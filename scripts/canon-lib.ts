// ─────────────────────────────────────────────
// Canon pipeline — shared library
// ─────────────────────────────────────────────
// Resumability rule (from the ingestion skill): NEVER trust in-memory
// progress or the `ingestion_status` column. All state is re-derived from
// live row counts every run, so the pipeline can stop and resume at any point.
//
// This module centralizes: the service-role Supabase client, the audit
// fetchers + worklist derivation, the JSON checkpoint, and the quiz-set
// validator that enforces the acceptance criteria. The audit/validate/ingest
// scripts all build on it.
// ─────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const PROJECT_REF = 'vjaezrcuuzmbmnsfrtwt'
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const CHECKPOINT_PATH = resolve(ROOT, 'scripts', 'canon-progress.json')

// ── Env ────────────────────────────────────────

/** Minimal .env.local loader (avoids a dotenv dependency). */
export function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {}
  const path = resolve(ROOT, '.env.local')
  if (!existsSync(path)) return out
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    let v = m[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    out[m[1]] = v
  }
  return out
}

export function getClient(): SupabaseClient {
  const env = { ...loadEnv(), ...process.env }
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }
  // Hard guardrail: only ever the tome-app project.
  if (!url.includes(PROJECT_REF)) {
    throw new Error(`Refusing to run: Supabase URL is not the tome-app project (${PROJECT_REF}).`)
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

// ── Audit data ─────────────────────────────────

export type BookRow = { id: string; title: string; is_tier1: boolean | null; featured: boolean | null; ingestion_status: string | null }
export type ChapterRow = { book_id: string; chapter_index: number | null }
export type QuizRow = { id: string; book_id: string; difficulty: string | null; chapter_index: number | null }

/** Paginated select — Supabase caps at 1000 rows/request. */
async function selectAll<T>(client: SupabaseClient, table: string, columns: string): Promise<T[]> {
  const pageSize = 1000
  let from = 0
  const rows: T[] = []
  for (;;) {
    const { data, error } = await client.from(table).select(columns).range(from, from + pageSize - 1)
    if (error) throw new Error(`select ${table}: ${error.message}`)
    if (!data || data.length === 0) break
    rows.push(...(data as T[]))
    if (data.length < pageSize) break
    from += pageSize
  }
  return rows
}

export type AuditData = { books: BookRow[]; chapters: ChapterRow[]; quizzes: QuizRow[] }

export async function fetchAuditData(client: SupabaseClient): Promise<AuditData> {
  const [books, chapters, quizzes] = await Promise.all([
    selectAll<BookRow>(client, 'books', 'id,title,is_tier1,featured,ingestion_status'),
    selectAll<ChapterRow>(client, 'chapters', 'book_id,chapter_index'),
    selectAll<QuizRow>(client, 'quizzes', 'id,book_id,difficulty,chapter_index'),
  ])
  return { books, chapters, quizzes }
}

// ── Worklists (derived from live data) ─────────

const DIFFS = ['Apprentice', 'Scholar', 'Master'] as const

export type Worklists = {
  summary: {
    booksTotal: number
    statusSuccess: number
    booksWithChapters: number
    chaptersTotalIngested: number
    booksWithQuizzes: number
    booksFullWholeBookSet: number
    chapterScopedQuizzes: number
    chaptersWithFullPerChapterSet: number
  }
  ingestion: { id: string; title: string }[] // books with zero chapters
  wholeBookQuiz: { id: string; title: string }[] // ingested books missing the 3-difficulty whole-book set
  perChapter: { book_id: string; chapter_index: number; have: string[] }[] // chapters missing one+ difficulty
}

export function buildWorklists(data: AuditData): Worklists {
  const { books, chapters, quizzes } = data

  const chaptersByBook = new Map<string, Set<number>>()
  for (const c of chapters) {
    if (!chaptersByBook.has(c.book_id)) chaptersByBook.set(c.book_id, new Set())
    if (c.chapter_index != null) chaptersByBook.get(c.book_id)!.add(c.chapter_index)
  }

  // whole-book quiz difficulties (chapter_index null)
  const wholeBookDiffs = new Map<string, Set<string>>()
  // per-chapter quiz difficulties keyed `${book}#${idx}`
  const perChapterDiffs = new Map<string, Set<string>>()
  for (const q of quizzes) {
    if (!q.difficulty) continue
    if (q.chapter_index == null) {
      if (!wholeBookDiffs.has(q.book_id)) wholeBookDiffs.set(q.book_id, new Set())
      wholeBookDiffs.get(q.book_id)!.add(q.difficulty)
    } else {
      const k = `${q.book_id}#${q.chapter_index}`
      if (!perChapterDiffs.has(k)) perChapterDiffs.set(k, new Set())
      perChapterDiffs.get(k)!.add(q.difficulty)
    }
  }

  const prioritize = (a: { id: string; title: string }, b: { id: string; title: string }) => {
    const ba = books.find((x) => x.id === a.id)!
    const bb = books.find((x) => x.id === b.id)!
    return (
      Number(bb.is_tier1) - Number(ba.is_tier1) ||
      Number(bb.featured) - Number(ba.featured) ||
      a.title.localeCompare(b.title)
    )
  }

  const ingestion = books
    .filter((b) => !(chaptersByBook.get(b.id)?.size))
    .map((b) => ({ id: b.id, title: b.title }))
    .sort(prioritize)

  const ingestedBookIds = new Set([...chaptersByBook.keys()])

  const wholeBookQuiz = books
    .filter((b) => ingestedBookIds.has(b.id))
    .filter((b) => {
      const have = wholeBookDiffs.get(b.id) ?? new Set()
      return DIFFS.some((d) => !have.has(d))
    })
    .map((b) => ({ id: b.id, title: b.title }))
    .sort(prioritize)

  const perChapter: Worklists['perChapter'] = []
  for (const [bookId, idxSet] of chaptersByBook) {
    for (const idx of idxSet) {
      const have = [...(perChapterDiffs.get(`${bookId}#${idx}`) ?? [])].sort()
      if (DIFFS.some((d) => !have.includes(d))) {
        perChapter.push({ book_id: bookId, chapter_index: idx, have })
      }
    }
  }

  const chaptersWithFullPerChapterSet = [...perChapterDiffs.values()].filter(
    (s) => DIFFS.every((d) => s.has(d))
  ).length

  return {
    summary: {
      booksTotal: books.length,
      statusSuccess: books.filter((b) => b.ingestion_status === 'success').length,
      booksWithChapters: chaptersByBook.size,
      chaptersTotalIngested: chapters.length,
      booksWithQuizzes: new Set(quizzes.map((q) => q.book_id)).size,
      booksFullWholeBookSet: [...wholeBookDiffs.values()].filter((s) => DIFFS.every((d) => s.has(d))).length,
      chapterScopedQuizzes: quizzes.filter((q) => q.chapter_index != null).length,
      chaptersWithFullPerChapterSet,
    },
    ingestion,
    wholeBookQuiz,
    perChapter,
  }
}

// ── Checkpoint ─────────────────────────────────

export type Checkpoint = {
  updatedAt: string
  summary: Worklists['summary']
  worklistSizes: { ingestion: number; wholeBookQuiz: number; perChapter: number }
  scopeEstimate: { perChapterQuestionsForIngestedBacklog: number }
  // Books fully done (chapters + at least the whole-book set), for quick glance.
  notes?: string
}

export function readCheckpoint(): Checkpoint | null {
  if (!existsSync(CHECKPOINT_PATH)) return null
  try {
    return JSON.parse(readFileSync(CHECKPOINT_PATH, 'utf8')) as Checkpoint
  } catch {
    return null
  }
}

export function writeCheckpoint(cp: Checkpoint): void {
  writeFileSync(CHECKPOINT_PATH, JSON.stringify(cp, null, 2) + '\n', 'utf8')
}

// ── Quiz-set validation (acceptance criteria) ──

export type QuestionRow = {
  id: string
  quiz_id: string
  question_text: string
  option_a: string; option_b: string; option_c: string; option_d: string
  correct_option: string
  explanation: string
  category: string | null
  type: string
  options: unknown
  correct_answer: string | null
  order: number | null
  meta: unknown
}

const OPTION_TYPES = new Set([
  'multiple_choice', 'vocabulary_in_context', 'cross_reference',
  'close_reading', 'theme_analysis', 'passage_id', 'identification',
])

export type ValidationIssue = { quizId: string; questionId?: string; problem: string }

/**
 * Validate one chapter's worth of quizzes (the 3-difficulty set) against the
 * acceptance criteria. `quizzesForChapter` = the up-to-3 quizzes; `byQuiz` maps
 * quiz id → its question rows. Returns a list of issues (empty = pass).
 */
export function validateQuizSet(
  quizzesForChapter: QuizRow[],
  byQuiz: Map<string, QuestionRow[]>,
  expectedQuestions = 10
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const diffs = new Set(quizzesForChapter.map((q) => q.difficulty))
  for (const d of DIFFS) {
    if (!diffs.has(d)) issues.push({ quizId: '(set)', problem: `missing ${d} quiz` })
  }

  for (const quiz of quizzesForChapter) {
    const rows = byQuiz.get(quiz.id) ?? []
    if (rows.length !== expectedQuestions) {
      issues.push({ quizId: quiz.id, problem: `${rows.length} questions (expected ${expectedQuestions})` })
    }
    // type distribution
    const typeCount = new Map<string, number>()
    for (const r of rows) typeCount.set(r.type, (typeCount.get(r.type) ?? 0) + 1)
    if (new Set(rows.map((r) => r.type)).size < 4) {
      issues.push({ quizId: quiz.id, problem: 'fewer than 4 distinct question types' })
    }
    for (const [t, c] of typeCount) {
      if (c > 2) issues.push({ quizId: quiz.id, problem: `${c}× ${t} (max 2 of any type)` })
    }
    // per-question integrity
    for (const r of rows) issues.push(...validateQuestionRow(r))
  }
  return issues
}

function asArr(v: unknown): unknown[] { return Array.isArray(v) ? v : [] }
function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
}

/** Per-question dual-encoding + type-specific integrity checks. */
export function validateQuestionRow(r: QuestionRow): ValidationIssue[] {
  const out: ValidationIssue[] = []
  const fail = (problem: string) => out.push({ quizId: r.quiz_id, questionId: r.id, problem })
  const meta = asObj(r.meta)
  const opts = asArr(r.options) as string[]

  if (!r.explanation || r.explanation.trim().length < 12) fail('explanation too short/empty')

  if (OPTION_TYPES.has(r.type)) {
    const letterOpt = { A: r.option_a, B: r.option_b, C: r.option_c, D: r.option_d }[r.correct_option]
    if (r.correct_answer !== letterOpt) fail('correct_answer ≠ correct_option letter target')
    if (!opts.includes(r.correct_answer ?? '')) fail('correct_answer not in options jsonb')
    if (r.type === 'vocabulary_in_context' && !meta.vocabWord) fail('vocab missing meta.vocabWord')
    if (r.type === 'identification' && !meta.identificationSubject) fail('identification missing meta.identificationSubject')
  } else if (r.type === 'true_false') {
    if (JSON.stringify(opts) !== JSON.stringify(['True', 'False'])) fail('tf options ≠ [True,False]')
    if (!['True', 'False'].includes(r.correct_answer ?? '')) fail('tf correct_answer ∉ {True,False}')
  } else if (r.type === 'fill_blank') {
    if (!r.correct_answer) fail('fill_blank empty correct_answer')
    if (!Array.isArray(meta.acceptedVariants)) fail('fill_blank missing meta.acceptedVariants[]')
  } else if (r.type === 'ordering') {
    const co = asArr(meta.correctOrder)
    if (co.length === 0) fail('ordering missing meta.correctOrder')
    if (opts.length !== co.length) fail('ordering options length ≠ correctOrder length')
    try { if (JSON.stringify(JSON.parse(r.correct_answer ?? '[]')) !== JSON.stringify(co)) fail('ordering correct_answer ≠ meta.correctOrder') } catch { fail('ordering correct_answer not JSON') }
  } else if (r.type === 'matching') {
    const cp = asObj(meta.correctPairs)
    const left = asArr(meta.matchingLeft)
    if (Object.keys(cp).length === 0) fail('matching missing meta.correctPairs')
    if (left.length !== Object.keys(cp).length) fail('matching matchingLeft length ≠ correctPairs keys')
    try { if (JSON.stringify(JSON.parse(r.correct_answer ?? '{}')) !== JSON.stringify(cp)) fail('matching correct_answer ≠ meta.correctPairs') } catch { fail('matching correct_answer not JSON') }
  } else if (r.type === 'tf_with_reason') {
    if (!/^(true|false)\|\d+$/.test(r.correct_answer ?? '')) fail('tf_with_reason correct_answer not "<bool>|<idx>"')
    const reasons = asArr(meta.tfReasons)
    const idx = Number((r.correct_answer ?? '|0').split('|')[1])
    if (reasons.length === 0) fail('tf_with_reason missing meta.tfReasons')
    if (idx >= reasons.length) fail('tf_with_reason reason index out of range')
  } else if (r.type === 'reflection') {
    if (typeof meta.reflectionWordMin !== 'number') fail('reflection missing meta.reflectionWordMin')
    if (!meta.reflectionPrompt) fail('reflection missing meta.reflectionPrompt')
  } else {
    fail(`unrecognized type "${r.type}"`)
  }
  return out
}

export { DIFFS }
