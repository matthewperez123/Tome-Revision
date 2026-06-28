import "server-only"

import {
  generatedToRow,
  type GenerateQuizRequest,
  type GeneratedQuestion,
  type TeacherQuizDifficulty,
} from "@/lib/teacher-quiz-types"
import { buildSourcePassage, type ChapterRow } from "@/lib/teacher-quiz/generate"
import type { createClient } from "@/lib/supabase/server"

type DB = Awaited<ReturnType<typeof createClient>>

export interface ScopeResult {
  book: { id: string; title: string; author: string }
  rows: ChapterRow[]
  passage: string
}

/**
 * Resolve a book + its in-scope chapter content into a grounded source passage.
 *
 * Scope may be an arbitrary, non-contiguous set of chapter indexes — the picker
 * lets teachers select sections out of order, and `.in(chapter_index, [...])`
 * honors exactly that set.
 */
export async function prepareScope(
  supabase: DB,
  req: GenerateQuizRequest,
): Promise<
  | { error: { status: number; json: Record<string, unknown> }; data: null }
  | { error: null; data: ScopeResult }
> {
  const { data: book } = await supabase
    .from("books")
    .select("id, title, author")
    .eq("id", req.bookId)
    .single()
  if (!book) return { error: { status: 404, json: { error: "Book not found" } }, data: null }

  let chapterQuery = supabase
    .from("chapters")
    .select("id, chapter_index, title, content_html")
    .eq("book_id", req.bookId)
    .order("chapter_index", { ascending: true })

  if (req.scope.chapterIds?.length) {
    chapterQuery = chapterQuery.in("id", req.scope.chapterIds)
  } else if (req.scope.chapterIndexes?.length) {
    chapterQuery = chapterQuery.in("chapter_index", req.scope.chapterIndexes)
  } else if (req.scope.passage) {
    chapterQuery = chapterQuery.eq("id", req.scope.passage.chapterId)
  } else {
    // No explicit scope: cap to the first 8 chapters to bound cost.
    chapterQuery = chapterQuery.limit(8)
  }

  const { data: chapters } = await chapterQuery
  const rows = (chapters ?? []) as ChapterRow[]
  const hasContent = rows.some((c) => (c.content_html ?? "").trim().length > 0)

  // Refuse to hallucinate a quiz on an un-ingested book.
  if (rows.length === 0 || !hasContent) {
    return {
      error: {
        status: 422,
        json: {
          error: "not_ingested",
          message: `"${book.title}" has no readable chapter content yet, so Virgil can't write a grounded quiz. Ingest the book first.`,
        },
      },
      data: null,
    }
  }

  return { error: null, data: { book, rows, passage: buildSourcePassage(rows) } }
}

/** Persist generated questions as a draft teacher_quiz. Returns a response payload. */
export async function persistDraftQuiz(
  supabase: DB,
  userId: string,
  req: GenerateQuizRequest,
  questions: GeneratedQuestion[],
  rows: ChapterRow[],
  book: { id: string; title: string },
  model: string,
): Promise<{ status: number; json: Record<string, unknown> }> {
  const dominant = (Object.entries(req.difficultyMix) as [TeacherQuizDifficulty, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0] as TeacherQuizDifficulty | undefined
  const indexes = rows.map((r) => r.chapter_index)

  const { data: quiz, error: quizError } = await supabase
    .from("teacher_quizzes")
    .insert({
      teacher_id: userId,
      book_id: req.bookId,
      title: `${book.title} — Virgil Quiz`,
      difficulty: dominant ?? "scholar",
      chapter_range_start: Math.min(...indexes),
      chapter_range_end: Math.max(...indexes),
      status: "draft",
      source_scope: req.scope,
      generated_by_model: model,
      generation_params: {
        types: req.types,
        difficultyMix: req.difficultyMix,
        totalCount: req.totalCount,
        focus: req.focus ?? null,
      },
    })
    .select("id, title, book_id, difficulty, status")
    .single()

  if (quizError || !quiz) {
    console.error("Failed to persist draft quiz:", quizError)
    return { status: 500, json: { error: "Failed to save draft quiz" } }
  }

  const rowsToInsert = questions.map((q, i) => generatedToRow(q, quiz.id, i))
  const { data: inserted, error: qError } = await supabase
    .from("teacher_quiz_questions")
    .insert(rowsToInsert)
    .select(
      "id, quiz_id, question_type, question_text, options, correct_answer, explanation, difficulty, category, points, max_points, rubric, reference_answer, source_anchor, hints, distractor_eliminations, sort_order",
    )
    .order("sort_order", { ascending: true })

  if (qError || !inserted) {
    console.error("Failed to persist draft questions:", qError)
    await supabase.from("teacher_quizzes").delete().eq("id", quiz.id)
    return { status: 500, json: { error: "Failed to save draft questions" } }
  }

  return { status: 200, json: { draft: { ...quiz, questions: inserted } } }
}
