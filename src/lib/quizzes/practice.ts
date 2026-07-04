"use client"

/**
 * Practice quizzes — the read-side helper for the student /quizzes surface.
 *
 * Practice is ungated and unlimited: it draws on the public `quizzes` catalogue
 * (book-level rows, one per Apprentice/Scholar/Master tier) and the reader's own
 * `quiz_results` attempt history. It NEVER touches grades or the gradebook —
 * those belong exclusively to teacher assignments. There is no Wisdom/coin/XP
 * concept here; the only signals are best score and attempt count.
 *
 * All calls guard on an authenticated user and swallow errors — a signed-out
 * visitor gets empty coverage stats but still sees the catalogue.
 */

import { supabase } from "@/lib/supabase"

export type QuizTier = "Apprentice" | "Scholar" | "Master"
export const QUIZ_TIERS: QuizTier[] = ["Apprentice", "Scholar", "Master"]

const TIER_SET = new Set<string>(QUIZ_TIERS)

export interface TierCoverage {
  tier: QuizTier
  /** Book-level quiz id — the Practice CTA opens /quiz/[quizId]. */
  quizId: string
  questionCount: number
}

export interface TierStat {
  /** Best score across all recorded attempts at this tier, 0–100, or null. */
  bestPercent: number | null
  attempts: number
}

export interface QuizBookEntry {
  bookId: string
  tiers: TierCoverage[]
  stats: Partial<Record<QuizTier, TierStat>>
  /** Name of a class this book is actively assigned in, if any. */
  assignedIn: string | null
}

export interface QuizAttempt {
  bookId: string
  chapterIndex: number
  tier: string | null
  score: number
  totalQuestions: number
  percent: number
  passed: boolean
  createdAt: string
}

export interface PracticeData {
  books: QuizBookEntry[]
  history: QuizAttempt[]
}

async function getUserId(): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

function normalizeTier(value: string): QuizTier | null {
  return TIER_SET.has(value) ? (value as QuizTier) : null
}

/**
 * Load the full practice picture: the book-level quiz catalogue grouped by book
 * and tier, the reader's per-book/per-tier best score + attempt count, the
 * last-10 attempt history, and which books are actively assigned in the reader's
 * classes (for the "Assigned in …" chip).
 */
export async function loadPracticeData(): Promise<PracticeData> {
  // Book-level quiz catalogue — public read, so this works signed-out too.
  const { data: quizRows } = await supabase
    .from("quizzes")
    .select("id, book_id, difficulty, question_count, chapter_index")
    .is("chapter_index", null)

  const coverage = new Map<string, TierCoverage[]>()
  for (const row of quizRows ?? []) {
    const tier = normalizeTier(row.difficulty)
    if (!tier) continue
    const list = coverage.get(row.book_id) ?? []
    list.push({ tier, quizId: row.id, questionCount: row.question_count })
    coverage.set(row.book_id, list)
  }

  const uid = await getUserId()

  // Attempt history + per-tier aggregates from the reader's own quiz_results.
  const stats = new Map<string, Partial<Record<QuizTier, TierStat>>>()
  let history: QuizAttempt[] = []
  if (uid) {
    const { data: resultRows } = await supabase
      .from("quiz_results")
      .select("book_id, chapter_index, difficulty, score, total_questions, passed, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })

    for (const row of resultRows ?? []) {
      const percent =
        row.total_questions > 0
          ? Math.round((row.score / row.total_questions) * 100)
          : 0
      history.push({
        bookId: row.book_id,
        chapterIndex: row.chapter_index,
        tier: row.difficulty,
        score: row.score,
        totalQuestions: row.total_questions,
        percent,
        passed: row.passed,
        createdAt: row.created_at,
      })

      const tier = row.difficulty ? normalizeTier(row.difficulty) : null
      if (!tier) continue
      const perBook = stats.get(row.book_id) ?? {}
      const prev = perBook[tier] ?? { bestPercent: null, attempts: 0 }
      perBook[tier] = {
        bestPercent: Math.max(prev.bestPercent ?? 0, percent),
        attempts: prev.attempts + 1,
      }
      stats.set(row.book_id, perBook)
    }
    history = history.slice(0, 10)
  }

  // "Assigned in [class]" — active quiz/reading assignments in the reader's
  // classes that target a covered book. Personal practice is unaffected by this;
  // the chip is purely informational.
  const assignedIn = new Map<string, string>()
  if (uid) {
    const { data: memberships } = await supabase
      .from("classroom_members")
      .select("classroom_id")
      .eq("student_id", uid)
    const classroomIds = (memberships ?? []).map((m) => m.classroom_id)
    if (classroomIds.length > 0) {
      const [{ data: assigns }, { data: classes }] = await Promise.all([
        supabase
          .from("assignments")
          .select("book_id, classroom_id")
          .in("classroom_id", classroomIds)
          .eq("status", "active")
          .not("book_id", "is", null),
        supabase.from("classrooms").select("id, name").in("id", classroomIds),
      ])
      const nameById = new Map((classes ?? []).map((c) => [c.id, c.name]))
      for (const a of assigns ?? []) {
        if (!a.book_id) continue
        if (!assignedIn.has(a.book_id)) {
          assignedIn.set(a.book_id, nameById.get(a.classroom_id) ?? "your class")
        }
      }
    }
  }

  const books: QuizBookEntry[] = [...coverage.entries()].map(([bookId, tiers]) => ({
    bookId,
    tiers: tiers.sort(
      (a, b) => QUIZ_TIERS.indexOf(a.tier) - QUIZ_TIERS.indexOf(b.tier),
    ),
    stats: stats.get(bookId) ?? {},
    assignedIn: assignedIn.get(bookId) ?? null,
  }))

  return { books, history }
}
