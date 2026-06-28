import "server-only"

import type { createClient } from "@/lib/supabase/server"
import type { CandidateBook, GeneratedPlan, PlanSetup } from "@/lib/semester-plan/types"
import { PLAN_ITEM_TYPES } from "@/lib/semester-plan/types"

type DB = Awaited<ReturnType<typeof createClient>>

/** Difficulty ordering for the ceiling filter. */
const DIFFICULTY_RANK: Record<string, number> = {
  apprentice: 1,
  beginner: 1,
  scholar: 2,
  intermediate: 2,
  master: 3,
  advanced: 3,
}

const MAX_CANDIDATES = 120

/**
 * Pre-filter the catalog into a bounded candidate set so the prompt is never
 * the whole library. Required books are always included regardless of filters.
 * Sends metadata ONLY — never book text.
 */
export async function assembleCandidates(
  supabase: DB,
  setup: PlanSetup,
): Promise<CandidateBook[]> {
  let query = supabase
    .from("books")
    .select(
      "id, title, author, tradition, era, difficulty, is_tier1, chapter_count, word_count, reading_time_minutes",
    )

  if (setup.traditions.length) {
    query = query.in("tradition", setup.traditions)
  }

  // Prefer tier-1 + featured surfacing when the teacher hasn't narrowed by
  // tradition, so an unconstrained survey still draws from the strong core.
  const { data: rows } = await query.order("is_tier1", { ascending: false }).limit(MAX_CANDIDATES)
  const books = (rows ?? []) as Array<{
    id: string
    title: string
    author: string
    tradition: string
    era: string
    difficulty: string
    is_tier1: boolean | null
    chapter_count: number
    word_count: number
    reading_time_minutes: number
  }>

  // Always fold in required books even if filtered out above.
  const haveIds = new Set(books.map((b) => b.id))
  const missingRequired = setup.constraints.requiredBookIds.filter((id) => !haveIds.has(id))
  if (missingRequired.length) {
    const { data: req } = await supabase
      .from("books")
      .select(
        "id, title, author, tradition, era, difficulty, is_tier1, chapter_count, word_count, reading_time_minutes",
      )
      .in("id", missingRequired)
    for (const b of (req ?? []) as typeof books) {
      books.push(b)
      haveIds.add(b.id)
    }
  }

  // Difficulty ceiling filter (required books are exempt).
  const ceiling = setup.constraints.difficultyCeiling
  const required = new Set(setup.constraints.requiredBookIds)
  const filtered = ceiling
    ? books.filter(
        (b) =>
          required.has(b.id) ||
          (DIFFICULTY_RANK[b.difficulty?.toLowerCase()] ?? 2) <= (DIFFICULTY_RANK[ceiling] ?? 3),
      )
    : books

  // Determine which candidate books have ingested, readable chapter content.
  const ids = filtered.map((b) => b.id)
  const contentful = await booksWithContent(supabase, ids)

  return filtered.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    tradition: b.tradition,
    era: b.era,
    difficulty: b.difficulty,
    tier: b.is_tier1 ? 1 : null,
    chapter_count: b.chapter_count,
    word_count: b.word_count,
    reading_time_minutes: b.reading_time_minutes,
    has_chapter_content: contentful.has(b.id),
  }))
}

/** Set of book ids that have at least one chapter with non-empty content_html. */
export async function booksWithContent(supabase: DB, bookIds: string[]): Promise<Set<string>> {
  if (bookIds.length === 0) return new Set()
  const { data } = await supabase
    .from("chapters")
    .select("book_id")
    .in("book_id", bookIds)
    .not("content_html", "is", null)
    .neq("content_html", "")
  const set = new Set<string>()
  for (const row of (data ?? []) as { book_id: string }[]) set.add(row.book_id)
  return set
}

export interface RepairResult {
  plan: GeneratedPlan
  /** book_ids Virgil produced that were not in the candidate set (dropped). */
  invalidBookIds: string[]
}

/**
 * Validate + repair a generated plan against the candidate set:
 *  - Strip book_id values not present in the candidate catalog (no hallucinated
 *    books); for content-grounded item types, drop the book reference.
 *  - Coerce item types to the allowed set.
 *  - Renumber weeks to be contiguous from 1.
 */
export function repairPlan(plan: GeneratedPlan, candidates: CandidateBook[]): RepairResult {
  const byId = new Map(candidates.map((c) => [c.id, c]))
  const invalid = new Set<string>()
  const allowedTypes = new Set<string>(PLAN_ITEM_TYPES)

  const weeks = plan.weeks
    .map((w, i) => ({
      ...w,
      week_index: i + 1,
      items: w.items
        .filter((it) => allowedTypes.has(it.type))
        .map((it) => {
          if (it.book_id && !byId.has(it.book_id)) {
            invalid.add(it.book_id)
            // Custom readings don't need a catalog book; everything else loses
            // its dangling reference rather than pointing at a phantom book.
            return { ...it, book_id: undefined }
          }
          return it
        }),
    }))
    .filter((w) => w.items.length > 0 || w.theme)

  return { plan: { weeks }, invalidBookIds: [...invalid] }
}
