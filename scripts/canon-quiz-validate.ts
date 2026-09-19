#!/usr/bin/env npx tsx
// ─────────────────────────────────────────────
// Canon quiz validator — the gate for authored quiz sets.
// Enforces the acceptance criteria. Whole-book sets ([3.6] launch standard):
// 3 difficulties × 5 questions on the type ladder, all 13 platform types
// across the set, no generic filler explanations. Chapter-scoped sets keep
// the legacy standard (10 questions; ≥4 distinct types; ≤2 of any type).
// Both: full, consistent dual-encoding + type-specific meta integrity.
// Exits non-zero if any issue is found.
//
// Usage:
//   ... scripts/canon-quiz-validate.ts <book_id> [chapter_index]
//   ... scripts/canon-quiz-validate.ts --all-chapter-scoped
// ─────────────────────────────────────────────

import {
  getClient, validateQuizSet, DIFFS, ladderAllowed, PLATFORM_TYPES,
  type QuizRow, type QuestionRow, type ValidationIssue,
} from './canon-lib'

async function fetchQuizzes(client: ReturnType<typeof getClient>, bookId: string, chapterIndex?: number) {
  let q = client.from('quizzes').select('id,book_id,difficulty,chapter_index').eq('book_id', bookId)
  q = chapterIndex == null ? q.is('chapter_index', null) : q.eq('chapter_index', chapterIndex)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []) as QuizRow[]
}

async function fetchQuestions(client: ReturnType<typeof getClient>, quizIds: string[]) {
  const byQuiz = new Map<string, QuestionRow[]>()
  if (quizIds.length === 0) return byQuiz
  const { data, error } = await client.from('questions').select('*').in('quiz_id', quizIds).order('order')
  if (error) throw new Error(error.message)
  for (const r of (data ?? []) as QuestionRow[]) {
    if (!byQuiz.has(r.quiz_id)) byQuiz.set(r.quiz_id, [])
    byQuiz.get(r.quiz_id)!.push(r)
  }
  return byQuiz
}

/** [3.6] Whole-book ladder conformance + 13-type coverage across the set. */
function validateLadder(quizzes: QuizRow[], byQuiz: Map<string, QuestionRow[]>): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const typesSeen = new Set<string>()
  for (const quiz of quizzes) {
    const rows = [...(byQuiz.get(quiz.id) ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    rows.forEach((r, slot) => {
      typesSeen.add(r.type)
      const allowed = ladderAllowed(quiz.difficulty ?? '', slot)
      if (!allowed.has(r.type)) {
        issues.push({
          quizId: quiz.id, questionId: r.id,
          problem: `slot ${slot} type ${r.type} ∉ ladder {${[...allowed].join('|')}} for ${quiz.difficulty}`,
        })
      }
    })
  }
  for (const t of PLATFORM_TYPES) {
    if (!typesSeen.has(t)) issues.push({ quizId: '(set)', problem: `type ${t} missing from whole-book set` })
  }
  return issues
}

async function validateOne(client: ReturnType<typeof getClient>, bookId: string, chapterIndex?: number): Promise<number> {
  const quizzes = await fetchQuizzes(client, bookId, chapterIndex)
  const byQuiz = await fetchQuestions(client, quizzes.map((q) => q.id))
  const label = `${bookId}${chapterIndex == null ? ' (whole-book)' : ` · ch ${chapterIndex}`}`
  // Whole-book sets follow the launch standard: 5 questions/quiz on the type
  // ladder, all 13 platform types across the set. Chapter-scoped sets keep
  // the legacy 10-question standard.
  const issues = validateQuizSet(quizzes, byQuiz, chapterIndex == null ? 5 : 10)
  if (chapterIndex == null) issues.push(...validateLadder(quizzes, byQuiz))
  if (issues.length === 0) {
    console.log(`  ✓ ${label} — ${quizzes.length} quizzes, all ${DIFFS.join('/')} valid`)
    return 0
  }
  console.log(`  ✗ ${label} — ${issues.length} issue(s):`)
  for (const i of issues) console.log(`       [${i.quizId.slice(0, 8)}${i.questionId ? '/' + i.questionId.slice(0, 8) : ''}] ${i.problem}`)
  return issues.length
}

async function main() {
  const client = getClient()
  const args = process.argv.slice(2)

  if (args[0] === '--all-chapter-scoped') {
    const { data, error } = await client
      .from('quizzes').select('book_id,chapter_index').not('chapter_index', 'is', null)
    if (error) throw new Error(error.message)
    const seen = new Set<string>()
    const targets: { book_id: string; chapter_index: number }[] = []
    for (const r of (data ?? []) as { book_id: string; chapter_index: number }[]) {
      const k = `${r.book_id}#${r.chapter_index}`
      if (!seen.has(k)) { seen.add(k); targets.push(r) }
    }
    console.log(`Validating ${targets.length} chapter-scoped set(s):`)
    let total = 0
    for (const t of targets) total += await validateOne(client, t.book_id, t.chapter_index)
    process.exit(total > 0 ? 1 : 0)
  }

  const bookId = args[0]
  if (!bookId) {
    console.error('Usage: canon-quiz-validate.ts <book_id> [chapter_index] | --all-chapter-scoped')
    process.exit(2)
  }
  const chapterIndex = args[1] != null ? Number(args[1]) : undefined
  console.log(`Validating ${bookId}${chapterIndex != null ? ` · ch ${chapterIndex}` : ''}:`)
  const issues = await validateOne(client, bookId, chapterIndex)
  process.exit(issues > 0 ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(1) })
