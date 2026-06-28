#!/usr/bin/env npx tsx
// ─────────────────────────────────────────────
// Verify the DB → ChapterQuestion → engine bridge end-to-end.
//
// For each supported question type, build a representative DB `questions`
// row exactly as the generator stores it, run it through the production
// adapter (dbRowToChapterQuestion), replicate the overlay's engine mapping,
// synthesize the *correct* user submission the renderer would commit, and
// assert the engine's checkAnswer() scores it correct. Also asserts a wrong
// submission scores incorrect, so we're not trivially passing everything.
//
// Run: npx tsx scripts/verify-db-quiz-bridge.ts
// ─────────────────────────────────────────────

import { dbRowToChapterQuestion, type QuestionRow } from '../src/lib/db-chapter-questions'
import { checkAnswer, type Question, type QuestionType } from '../src/lib/quiz-engine'
import type { ChapterQuestion, QuizDifficulty } from '../src/lib/chapter-questions'

let failures = 0
const ok = (name: string) => console.log(`  PASS  ${name}`)
const bad = (name: string, detail: string) => {
  console.error(`  FAIL  ${name} — ${detail}`)
  failures++
}

// Mirror of chapter-quiz-overlay.tsx mapToEngineQuestion (kept in sync).
function mapToEngineQuestion(q: ChapterQuestion, quizId: string, order: number): Question {
  const base: Question = {
    id: q.id, quiz_id: quizId, type: q.type, prompt: q.text,
    options: q.options ?? [], correct_answer: '', explanation: q.explanation, order,
    difficulty: q.difficulty, citation: q.citation ?? null,
    passage: q.passage ?? null, passageHighlight: q.passageHighlight ?? null,
    acceptedVariants: q.acceptedVariants, correctPairs: q.correctPairs,
    matchingLeft: q.matchingLeft, matchingRight: q.matchingRight, correctOrder: q.correctOrder,
    vocabWord: q.vocabWord, etymology: q.etymology, crossRefBookId: q.crossRefBookId,
    crossRefLabel: q.crossRefLabel, reflectionPrompt: q.reflectionPrompt,
    reflectionWordMin: q.reflectionWordMin, reflectionWordMax: q.reflectionWordMax,
    reflectionRubric: q.reflectionRubric, reflectionExpectedThemes: q.reflectionExpectedThemes,
    identificationSubject: q.identificationSubject, tfReasons: q.tfReasons,
    tfCorrectReason: q.tfCorrectReason,
  }
  switch (q.type) {
    case 'true_false':
      return { ...base, options: ['true', 'false'], correct_answer: q.correctBool ? 'true' : 'false' }
    case 'fill_blank':
      return { ...base, correct_answer: q.correctText ?? '' }
    case 'ordering':
      return { ...base, options: q.options ?? [], correctOrder: q.correctOrder ?? [], correct_answer: JSON.stringify(q.correctOrder ?? []) }
    case 'matching':
      return { ...base, options: [], correctPairs: q.correctPairs ?? {}, correct_answer: JSON.stringify(q.correctPairs ?? {}) }
    case 'reflection':
      return { ...base, options: [], correct_answer: '' }
    case 'identification': {
      const opts = q.options ?? []
      return { ...base, options: opts, correct_answer: opts[q.correctIndex ?? 0] ?? opts[0] ?? '' }
    }
    case 'tf_with_reason':
      return { ...base, options: ['true', 'false'], correct_answer: `${q.correctBool ? 'true' : 'false'}|${q.tfCorrectReason ?? 0}` }
    default: {
      const opts = q.options ?? []
      return { ...base, options: opts, correct_answer: opts[q.correctIndex ?? 0] ?? opts[0] ?? '' }
    }
  }
}

// The submission a renderer commits when the user answers correctly.
function correctSubmission(q: Question): string {
  switch (q.type) {
    case 'true_false':
    case 'fill_blank':
      return q.correct_answer
    case 'ordering':
      return JSON.stringify(q.correctOrder ?? [])
    case 'matching':
      return JSON.stringify(q.correctPairs ?? {})
    case 'reflection':
      return 'This response is deliberately written to exceed the minimum word threshold so that the engine accepts it as a valid reflection submission for the purposes of this end to end verification test of the bridge.'
    default:
      return q.correct_answer
  }
}

// A deliberately wrong submission, to prove checks aren't vacuous.
function wrongSubmission(q: Question): string | null {
  switch (q.type) {
    case 'true_false':
      return q.correct_answer === 'true' ? 'false' : 'true'
    case 'fill_blank':
      return '___definitely_wrong___'
    case 'ordering': {
      const arr = [...(q.correctOrder ?? [])]
      if (arr.length < 2) return null
      ;[arr[0], arr[1]] = [arr[1], arr[0]]
      return JSON.stringify(arr)
    }
    case 'matching': {
      const pairs = { ...(q.correctPairs ?? {}) }
      const keys = Object.keys(pairs)
      if (keys.length < 2) return null
      const tmp = pairs[keys[0]]; pairs[keys[0]] = pairs[keys[1]]; pairs[keys[1]] = tmp
      return JSON.stringify(pairs)
    }
    case 'reflection':
      return 'too short'
    case 'tf_with_reason':
      return q.correct_answer.startsWith('true') ? 'false|0' : 'true|0'
    default:
      return (q.options.find((o) => o !== q.correct_answer)) ?? null
  }
}

function run(name: string, type: QuestionType, row: Partial<QuestionRow>, difficulty: QuizDifficulty = 'Scholar') {
  const full: QuestionRow = {
    id: 'row-' + name, quiz_id: 'quiz-x', question_text: 'Q',
    option_a: 'n/a', option_b: 'n/a', option_c: 'n/a', option_d: 'n/a',
    correct_option: 'A', explanation: 'because', category: 'literary', type,
    options: null, correct_answer: null, order: 0, meta: null, ...row,
  }
  const cq = dbRowToChapterQuestion(full, difficulty)
  if (!cq) { bad(name, 'adapter returned null'); return }
  const eq = mapToEngineQuestion(cq, 'quiz-x', 0)
  const right = checkAnswer(eq, correctSubmission(eq))
  if (!right) { bad(name, 'correct submission scored WRONG'); return }
  const wrong = wrongSubmission(eq)
  if (wrong !== null && checkAnswer(eq, wrong)) { bad(name, 'wrong submission scored CORRECT'); return }
  ok(name)
}

// ── One representative row per type (matching the generator's encoding) ──

run('multiple_choice', 'multiple_choice', {
  option_a: 'right', option_b: 'w1', option_c: 'w2', option_d: 'w3', correct_option: 'A',
  options: ['right', 'w1', 'w2', 'w3'], correct_answer: 'right',
})

run('true_false', 'true_false', {
  option_a: 'True', option_b: 'False', correct_option: 'A',
  options: ['True', 'False'], correct_answer: 'True',
})

run('fill_blank', 'fill_blank', {
  option_a: 'doornail', correct_option: 'A',
  options: [], correct_answer: 'doornail', meta: { acceptedVariants: ['door-nail'] },
})

run('vocabulary_in_context', 'vocabulary_in_context', {
  option_a: 'greedy', option_b: 'kind', option_c: 'frail', option_d: 'shy', correct_option: 'A',
  options: ['greedy', 'kind', 'frail', 'shy'], correct_answer: 'greedy', meta: { vocabWord: 'covetous' },
})

run('cross_reference', 'cross_reference', {
  option_a: 'Hamlet', option_b: 'Odyssey', option_c: 'Inferno', option_d: 'Faust', correct_option: 'A',
  options: ['Hamlet', 'Odyssey', 'Inferno', 'Faust'], correct_answer: 'Hamlet',
  meta: { crossRefBookId: 'hamlet', crossRefLabel: 'Hamlet' },
})

run('close_reading', 'close_reading', {
  option_a: 'coldness', option_b: 'strength', option_c: 'wealth', option_d: 'fear', correct_option: 'A',
  options: ['coldness', 'strength', 'wealth', 'fear'], correct_answer: 'coldness',
  meta: { passage: 'Hard and sharp as flint...' },
})

run('theme_analysis', 'theme_analysis', {
  option_a: 'avarice', option_b: 'comedy', option_c: 'labor', option_d: 'suspense', correct_option: 'A',
  options: ['avarice', 'comedy', 'labor', 'suspense'], correct_answer: 'avarice',
})

run('passage_id', 'passage_id', {
  option_a: 'narrator', option_b: 'Scrooge', option_c: 'Marley', option_d: 'Fred', correct_option: 'A',
  options: ['narrator', 'Scrooge', 'Marley', 'Fred'], correct_answer: 'narrator',
})

run('identification', 'identification', {
  option_a: 'Scrooge', option_b: 'Marley', option_c: 'Cratchit', option_d: 'Fred', correct_option: 'A',
  options: ['Scrooge', 'Marley', 'Cratchit', 'Fred'], correct_answer: 'Scrooge',
  meta: { identificationSubject: 'speaker' },
})

run('ordering', 'ordering', {
  option_a: 'B', option_b: 'C', option_c: 'A', option_d: 'D', correct_option: 'A',
  options: ['B', 'C', 'A', 'D'], correct_answer: JSON.stringify(['A', 'B', 'C', 'D']),
  meta: { correctOrder: ['A', 'B', 'C', 'D'] },
})

run('matching', 'matching', {
  options: [], correct_answer: JSON.stringify({ L1: 'R1', L2: 'R2', L3: 'R3' }),
  meta: { matchingLeft: ['L1', 'L2', 'L3'], matchingRight: ['R1', 'R2', 'R3'], correctPairs: { L1: 'R1', L2: 'R2', L3: 'R3' } },
})

run('tf_with_reason', 'tf_with_reason', {
  option_a: 'True', option_b: 'False', correct_option: 'B',
  options: ['True', 'False'], correct_answer: 'false|0',
  meta: { tfReasons: ['right reason', 'wrong reason'], tfCorrectReason: 0 },
})

run('reflection', 'reflection', {
  options: [], correct_answer: '',
  meta: { reflectionPrompt: 'Reflect...', reflectionWordMin: 30, reflectionWordMax: 200 },
})

console.log('')
if (failures > 0) {
  console.error(`✗ ${failures} type(s) failed the bridge round-trip.`)
  process.exit(1)
} else {
  console.log('✓ All 13 question types round-trip DB → adapter → engine and score correctly.')
}
