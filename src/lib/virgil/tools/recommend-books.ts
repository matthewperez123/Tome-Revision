import "server-only"

import type { VirgilDB } from "@/lib/virgil/profile"

export interface RecommendBooksInput {
  criteria_text: string
  level?: string
  max_results?: number
}

interface CandidateRow {
  id: string
  title: string
  author: string
  difficulty: string | null
  themes: string[] | null
  tradition: string | null
  era: string | null
  synopsis: string | null
}

const MAX_CANDIDATES = 60

/**
 * recommend_books — read-only. Returns the content-gated candidate set (books
 * with at least one readable chapter) for Virgil to rank and explain against
 * the teacher's criteria. Never writes; never surfaces an un-ingested book.
 */
export async function executeRecommendBooks(
  supabase: VirgilDB,
  raw: RecommendBooksInput,
): Promise<Record<string, unknown>> {
  // Distinct book_ids with non-empty chapter content (RLS-scoped reads).
  const { data: contentRows } = await supabase
    .from("chapters")
    .select("book_id")
    .not("content_html", "is", null)
    .neq("content_html", "")
    .limit(6000)

  const ids = Array.from(
    new Set((contentRows ?? []).map((r) => (r as { book_id: string }).book_id).filter(Boolean)),
  )
  if (ids.length === 0) {
    return { status: "empty", message: "No readable books are available yet.", candidates: [] }
  }

  const { data } = await supabase
    .from("books")
    .select("id, title, author, difficulty, themes, tradition, era, synopsis")
    .in("id", ids)
    .order("title")
    .limit(MAX_CANDIDATES)

  const candidates = ((data ?? []) as CandidateRow[]).map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    difficulty: b.difficulty,
    themes: b.themes?.slice(0, 6) ?? null,
    tradition: b.tradition,
    era: b.era,
    synopsis: b.synopsis ? b.synopsis.slice(0, 280) : null,
  }))

  const maxResults = Math.max(1, Math.min(10, Math.round(raw.max_results ?? 5)))
  return {
    status: "ok",
    criteria: raw.criteria_text,
    level: raw.level ?? null,
    max_results: maxResults,
    instruction: `Rank the top ${maxResults} of these readable books for the criteria and explain each briefly. Recommend ONLY from this list.`,
    candidates,
  }
}
