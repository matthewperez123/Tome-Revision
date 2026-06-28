import "server-only"

import {
  generateQuizRequestSchema,
  type TeacherQuizDifficulty,
  type GenerateQuizRequest,
} from "@/lib/teacher-quiz-types"
import { generateQuizQuestions } from "@/lib/teacher-quiz/generate"
import { prepareScope, persistDraftQuiz } from "@/lib/teacher-quiz/draft-service"
import { booksWithContent } from "@/lib/semester-plan/catalog"
import type { VirgilDB } from "@/lib/virgil/profile"

// Only the reader-renderable objective types (see VirgilQuizPanel + the student
// quiz renderers). Open-ended types exist in the schema but have no UI, so we
// never author them here.
const RENDERABLE_TYPES: GenerateQuizRequest["types"] = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "vocabulary_in_context",
  "multiple_select",
]

const MAX_QUESTIONS = 30

export interface GenerateTeacherQuizInput {
  book_query: string
  chapter_range?: { start?: number; end?: number }
  focus?: string
  difficulty: TeacherQuizDifficulty
  question_count?: number
}

interface BookMatch {
  id: string
  title: string
}

/**
 * Fuzzy-resolve a book_query to a `books` row that HAS readable chapter content.
 * Returns an exact match when one stands out, otherwise the candidate set so
 * Virgil can ask the teacher which they meant.
 */
async function resolveBook(
  supabase: VirgilDB,
  query: string,
): Promise<{ kind: "one"; book: BookMatch } | { kind: "many"; books: BookMatch[] } | { kind: "none" }> {
  // PostgREST `.or()` is comma/paren-delimited — strip characters that would
  // break the filter grammar before interpolating the user's text.
  const safe = query.replace(/[,()%]/g, " ").trim()
  if (!safe) return { kind: "none" }
  const slug = safe.toLowerCase().replace(/\s+/g, "-")

  const { data } = await supabase
    .from("books")
    .select("id, title")
    .or(`title.ilike.%${safe}%,id.ilike.%${slug}%`)
    .limit(12)

  const rows = (data ?? []) as BookMatch[]
  if (rows.length === 0) return { kind: "none" }

  // Content-gate: never quiz a book that has no readable chapters.
  const withContent = await booksWithContent(
    supabase,
    rows.map((r) => r.id),
  )
  const matches = rows.filter((r) => withContent.has(r.id))
  if (matches.length === 0) return { kind: "none" }
  if (matches.length === 1) return { kind: "one", book: matches[0] }

  // Prefer a single exact title/slug hit when the fuzzy set is ambiguous.
  const lower = safe.toLowerCase()
  const exact = matches.filter((m) => m.title.toLowerCase() === lower || m.id === slug)
  if (exact.length === 1) return { kind: "one", book: exact[0] }

  return { kind: "many", books: matches.slice(0, 8) }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

/**
 * generate_teacher_quiz — resolve a book, generate a text-grounded quiz with the
 * existing teacher-quiz pipeline, and persist a draft owned (via RLS) by the
 * authenticated teacher. Idempotent on (teacher, book, title).
 */
export async function executeGenerateTeacherQuiz(
  supabase: VirgilDB,
  userId: string,
  raw: GenerateTeacherQuizInput,
): Promise<Record<string, unknown>> {
  const resolved = await resolveBook(supabase, raw.book_query ?? "")
  if (resolved.kind === "none") {
    return {
      status: "no_match",
      message: `No readable book matches "${raw.book_query}". Only books with ingested chapter content can be quizzed.`,
    }
  }
  if (resolved.kind === "many") {
    return {
      status: "ambiguous",
      message: "Several readable books match — ask the teacher which one they mean.",
      candidates: resolved.books.map((b) => ({ id: b.id, title: b.title })),
    }
  }
  const book = resolved.book

  // Idempotency: the pipeline titles quizzes "<Book> — Virgil Quiz". If one
  // already exists for this teacher + book, surface it instead of duplicating.
  const title = `${book.title} — Virgil Quiz`
  const { data: existing } = await supabase
    .from("teacher_quizzes")
    .select("id, title")
    .eq("teacher_id", userId)
    .eq("book_id", book.id)
    .eq("title", title)
    .limit(1)
    .maybeSingle()
  if (existing) {
    const ex = existing as { id: string; title: string }
    return {
      status: "exists",
      quiz_id: ex.id,
      title: ex.title,
      route: `/classroom/quiz-builder/${ex.id}`,
      message: `A quiz titled "${ex.title}" already exists for this book — surfacing it instead of making a duplicate.`,
    }
  }

  const count = clamp(Math.round(raw.question_count ?? 5), 1, MAX_QUESTIONS)
  const mix: Record<TeacherQuizDifficulty, number> = { apprentice: 0, scholar: 0, master: 0 }
  mix[raw.difficulty] = count

  let scope: GenerateQuizRequest["scope"] = {}
  const start = raw.chapter_range?.start
  const end = raw.chapter_range?.end
  if (typeof start === "number" && start >= 0) {
    const hi = typeof end === "number" && end >= start ? end : start
    const idxs: number[] = []
    for (let i = start; i <= Math.min(hi, start + MAX_QUESTIONS * 4); i++) idxs.push(i)
    scope = { chapterIndexes: idxs }
  }

  const parsed = generateQuizRequestSchema.safeParse({
    bookId: book.id,
    scope,
    difficultyMix: mix,
    types: RENDERABLE_TYPES,
    totalCount: count,
    focus: raw.focus?.trim() || undefined,
  })
  if (!parsed.success) {
    return { status: "error", message: "Could not build a valid quiz request from those inputs." }
  }
  const req = parsed.data

  const scopeResult = await prepareScope(supabase, req)
  if (scopeResult.error) {
    return {
      status: "error",
      message:
        (scopeResult.error.json.message as string) ??
        (scopeResult.error.json.error as string) ??
        "Could not resolve the reading scope.",
    }
  }
  const { book: bk, rows, passage } = scopeResult.data

  const result = await generateQuizQuestions({
    passage,
    bookTitle: bk.title,
    bookAuthor: bk.author,
    req,
  })

  const persisted = await persistDraftQuiz(
    supabase,
    userId,
    req,
    result.questions,
    rows,
    bk,
    result.model,
  )
  if (persisted.status !== 200) {
    return { status: "error", message: "The quiz was generated but could not be saved." }
  }
  const draft = (persisted.json.draft ?? {}) as {
    id: string
    title: string
    questions?: unknown[]
  }
  return {
    status: "created",
    quiz_id: draft.id,
    title: draft.title,
    book_title: bk.title,
    difficulty: raw.difficulty,
    question_count: draft.questions?.length ?? count,
    route: `/classroom/quiz-builder/${draft.id}`,
    message: `Saved a ${draft.questions?.length ?? count}-question draft quiz. The teacher can review and publish it from the quiz builder.`,
  }
}
