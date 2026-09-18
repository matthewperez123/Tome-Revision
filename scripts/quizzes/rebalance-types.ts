// ─────────────────────────────────────────────
// [3.6] Platform quiz bank — type-ladder rebalance
// ─────────────────────────────────────────────
// Brings every whole-book quiz set (3 difficulties × 5 questions) onto the
// launch type ladder:
//
//   Apprentice: multiple_choice, true_false, fill_blank, identification, ordering
//   Scholar:    vocabulary_in_context, passage_id, matching, close_reading, tf_with_reason
//   Master:     theme_analysis, cross_reference, reflection, analytical multiple_choice,
//               close_reading (or identification)
//
// For already-quizzed books only the slots whose type is wrong are regenerated
// (good rows are kept). Unquizzed books with chapters get the full 3×5 set.
// Grounded in the first ~60k chars of chapter text + the synopsis, generated
// with Sonnet 4.6, validated with canon-lib's per-row integrity checks before
// any write, and recorded in the `quiz_generation_runs` ledger (resumable —
// conformance is re-derived from live rows every run, never from the ledger).
//
// Usage:
//   npx tsx scripts/quizzes/rebalance-types.ts --scope=tier1 [--limit=N] [--commit]
//   npx tsx scripts/quizzes/rebalance-types.ts --books=the-odyssey,dracula --commit
//   npx tsx scripts/quizzes/rebalance-types.ts --scope=all --commit
//
// Dry-run (no --commit) generates nothing and writes nothing: it reports the
// per-book worklist so the batch size and cost can be inspected first.
// ─────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getClient,
  loadEnv,
  validateQuestionRow,
  LADDER,
  ladderAllowed,
  BANNED_EXPLANATION as BANNED_PHRASE,
  type QuestionRow,
} from '../canon-lib'

const MODEL = 'claude-sonnet-4-6'
const SOURCE_CHAR_BUDGET = 60_000
const BATCH_SIZE = 20

type Difficulty = 'Apprentice' | 'Scholar' | 'Master'
const DIFFS: Difficulty[] = ['Apprentice', 'Scholar', 'Master']

// ── CLI ────────────────────────────────────────

const args = process.argv.slice(2)
const flag = (name: string) => args.includes(`--${name}`)
const opt = (name: string): string | undefined =>
  args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')

const COMMIT = flag('commit')
const SCOPE = opt('scope') ?? (opt('books') ? 'books' : 'tier1')
const BOOK_IDS = opt('books')?.split(',').map((s) => s.trim()).filter(Boolean) ?? []
const LIMIT = Number(opt('limit') ?? '0') || 0
const CONCURRENCY = Number(opt('concurrency') ?? '3') || 3

// ── Anthropic client ───────────────────────────

function getAnthropic(): Anthropic {
  // Prefer a NON-EMPTY process.env value; an empty exported var must not
  // shadow .env.local (seen on this machine: shell exports ANTHROPIC_API_KEY="").
  const apiKey = process.env.ANTHROPIC_API_KEY || loadEnv().ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing from .env.local / env')
  return new Anthropic({ apiKey })
}

// ── Source text ────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&rsquo;/g, '\u2019')
    .replace(/&#8220;|&ldquo;/g, '\u201C')
    .replace(/&#8221;|&rdquo;/g, '\u201D')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchSource(
  db: SupabaseClient,
  bookId: string,
): Promise<{ text: string; synopsis: string; title: string; author: string } | null> {
  const { data: book } = await db
    .from('books')
    .select('title, author, synopsis')
    .eq('id', bookId)
    .single()
  if (!book) return null

  const { data: chapters } = await db
    .from('chapters')
    .select('chapter_index, title, content_html')
    .eq('book_id', bookId)
    .order('chapter_index', { ascending: true })
  if (!chapters || chapters.length === 0) return null

  let text = ''
  for (const c of chapters) {
    if (!c.content_html) continue
    const chunk = stripHtml(c.content_html)
    if (!chunk) continue
    text += `\n\n[${c.title ?? `Chapter ${c.chapter_index}`}]\n${chunk}`
    if (text.length >= SOURCE_CHAR_BUDGET) break
  }
  return {
    text: text.slice(0, SOURCE_CHAR_BUDGET),
    synopsis: (book.synopsis as string | null) ?? '',
    title: book.title as string,
    author: book.author as string,
  }
}

// ── Generation prompt ──────────────────────────

const TYPE_SPECS: Record<string, string> = {
  multiple_choice:
    '{ "type": "multiple_choice", "question_text": string, "options": [4 strings], "correctIndex": 0-3 }',
  true_false:
    '{ "type": "true_false", "question_text": string starting exactly "True or False: ", "answer": boolean }',
  fill_blank:
    '{ "type": "fill_blank", "question_text": string containing "____" for the blank, "answer": single word, "acceptedVariants": [0-3 alternate spellings/forms] }',
  identification:
    '{ "type": "identification", "question_text": string (identify a speaker, place, or character from a short quoted line or description), "options": [4 strings], "correctIndex": 0-3, "subject": "speaker"|"character"|"book" }',
  ordering:
    '{ "type": "ordering", "question_text": string (ask to arrange events in order), "items": [4 short event strings in CORRECT chronological order] }',
  vocabulary_in_context:
    '{ "type": "vocabulary_in_context", "question_text": string quoting a sentence from the text and asking what a word means there, "vocabWord": string, "options": [4 definitions], "correctIndex": 0-3 }',
  passage_id:
    '{ "type": "passage_id", "question_text": string asking about a quoted passage, "passage": a verbatim 1-3 sentence quote from the source, "options": [4 strings], "correctIndex": 0-3 }',
  matching:
    '{ "type": "matching", "question_text": string, "pairs": { left item: right item } with exactly 4 entries (e.g. characters to descriptions) }',
  close_reading:
    '{ "type": "close_reading", "question_text": string asking a careful-reading question about a quoted passage, "passage": a verbatim 1-3 sentence quote from the source, "options": [4 strings], "correctIndex": 0-3 }',
  tf_with_reason:
    '{ "type": "tf_with_reason", "question_text": string starting exactly "True or False: ", "answer": boolean, "reasons": [4 short reason strings], "correctReason": 0-3 (index of the reason that correctly justifies the answer) }',
  theme_analysis:
    '{ "type": "theme_analysis", "question_text": string about a central theme, "options": [4 strings], "correctIndex": 0-3 }',
  cross_reference:
    '{ "type": "cross_reference", "question_text": string comparing this work to another classic or a broader tradition, "options": [4 strings], "correctIndex": 0-3, "crossRefLabel": short label of the referenced work/tradition }',
  reflection:
    '{ "type": "reflection", "question_text": string (an open reflection prompt about the reader\'s own engagement with the text), "wordMin": 30-60, "wordMax": 150-250, "expectedThemes": [2-4 short theme strings], "rubric": 1-2 sentence guidance for what a strong answer includes }',
}

const DIFF_GUIDANCE: Record<Difficulty, string> = {
  Apprentice:
    'Apprentice level: plot, characters, and settings a first-time reader who finished the book would recall. Clear, concrete, unambiguous.',
  Scholar:
    'Scholar level: careful reading — vocabulary in context, specific passages, relationships between details. Requires attention, not memorization of trivia.',
  Master:
    'Master level: analysis and synthesis — themes, technique, comparisons to the wider canon. The analytical multiple_choice question must require interpretation, not recall.',
}

function buildPrompt(
  title: string,
  author: string,
  synopsis: string,
  source: string,
  diff: Difficulty,
  slots: number[],
): string {
  const wanted = slots
    .map((s) => `slot ${s}: ${TYPE_SPECS[LADDER[diff][s]]}`)
    .join('\n')
  return `You are writing quiz questions for Tome, a classical-literature reading platform. Write questions for "${title}" by ${author}.

${DIFF_GUIDANCE[diff]}

SYNOPSIS:
${synopsis || '(none)'}

SOURCE TEXT (opening ~60k characters of the book):
${source}

Write EXACTLY ${slots.length} question(s), one per requested slot, as a JSON array. Each object must include "slot" (the number below), the type-specific fields shown, plus:
- "explanation": at least 90 characters, grounded in the text — name the specific scene, character, or passage that makes the answer correct. NEVER write "${BANNED_PHRASE}" or any similar generic filler.
- "category": one of "factual", "literary", "analytical", "thematic", "contextual".

Requested slots:
${wanted}

Rules:
- Every question must be answerable from THIS book. Quotes must be verbatim from the source text above.
- Distractors must be plausible but clearly wrong to a careful reader.
- Respond with ONLY the JSON array. No markdown fences, no commentary.`
}

// ── Response → dual-encoded rows ───────────────

type Gen = Record<string, unknown>

const NA = 'n/a'

function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  // never present the already-correct order
  if (out.length > 1 && JSON.stringify(out) === JSON.stringify(arr)) {
    ;[out[0], out[1]] = [out[1], out[0]]
  }
  return out
}

const CATEGORIES = new Set(['factual', 'literary', 'analytical', 'thematic', 'contextual'])

/**
 * Convert one generated question into a fully dual-encoded `questions` insert
 * payload (legacy option_a..d/correct_option AND options/correct_answer/meta),
 * honoring the encoding contract in src/lib/db-chapter-questions.ts and
 * canon-lib's validateQuestionRow. Throws on malformed generations.
 */
function encodeRow(g: Gen, quizId: string, order: number): Record<string, unknown> {
  const type = String(g.type ?? '')
  const text = String(g.question_text ?? '').trim()
  let explanation = String(g.explanation ?? '').trim()
  // Reflection generations often skimp on `explanation`; the rubric is the
  // natural guidance text, so promote it when it's the fuller of the two.
  if (type === 'reflection') {
    const rubric = String(g.rubric ?? '').trim()
    if (rubric.length > explanation.length) explanation = rubric
  }
  const category = CATEGORIES.has(String(g.category)) ? String(g.category) : 'factual'
  if (!text) throw new Error(`slot ${order}: empty question_text`)
  // Reflection has no single right answer; its explanation is guidance and may
  // run shorter than the grounded factual explanations.
  const minExplanation = type === 'reflection' ? 40 : 80
  if (explanation.length < minExplanation) throw new Error(`slot ${order}: explanation < ${minExplanation} chars`)
  if (explanation.includes(BANNED_PHRASE)) throw new Error(`slot ${order}: banned explanation phrase`)

  const base = {
    quiz_id: quizId,
    question_text: text,
    explanation,
    category,
    type,
    order,
    option_a: NA,
    option_b: NA,
    option_c: NA,
    option_d: NA,
    correct_option: 'A',
    options: [] as unknown,
    correct_answer: null as string | null,
    meta: null as unknown,
  }

  const optionType = (extraMeta: Record<string, unknown> = {}) => {
    const options = (g.options as string[] | undefined)?.map(String) ?? []
    const idx = Number(g.correctIndex)
    if (options.length !== 4) throw new Error(`slot ${order}: ${type} needs 4 options`)
    if (!(idx >= 0 && idx <= 3)) throw new Error(`slot ${order}: ${type} bad correctIndex`)
    return {
      ...base,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_option: ['A', 'B', 'C', 'D'][idx],
      options,
      correct_answer: options[idx],
      meta: Object.keys(extraMeta).length ? extraMeta : null,
    }
  }

  switch (type) {
    case 'multiple_choice':
    case 'theme_analysis':
      return optionType()
    case 'identification': {
      const subject = ['speaker', 'character', 'book'].includes(String(g.subject))
        ? String(g.subject)
        : 'character'
      return optionType({ identificationSubject: subject })
    }
    case 'vocabulary_in_context': {
      const vocabWord = String(g.vocabWord ?? '').trim()
      if (!vocabWord) throw new Error(`slot ${order}: vocab missing vocabWord`)
      return optionType({ vocabWord })
    }
    case 'passage_id':
    case 'close_reading': {
      const passage = String(g.passage ?? '').trim()
      if (!passage) throw new Error(`slot ${order}: ${type} missing passage`)
      return optionType({ passage })
    }
    case 'cross_reference': {
      const label = String(g.crossRefLabel ?? '').trim()
      return optionType(label ? { crossRefLabel: label } : {})
    }
    case 'true_false': {
      const answer = Boolean(g.answer)
      if (!/^true or false[:.]/i.test(text)) throw new Error(`slot ${order}: tf prompt must start "True or False:"`)
      return {
        ...base,
        option_a: 'True',
        option_b: 'False',
        correct_option: answer ? 'A' : 'B',
        options: ['True', 'False'],
        correct_answer: answer ? 'True' : 'False',
      }
    }
    case 'fill_blank': {
      const answer = String(g.answer ?? '').trim()
      if (!answer || /\s/.test(answer)) throw new Error(`slot ${order}: fill_blank answer must be a single word`)
      if (!text.includes('____')) throw new Error(`slot ${order}: fill_blank prompt missing ____`)
      const acceptedVariants = ((g.acceptedVariants as string[] | undefined) ?? []).map(String)
      return {
        ...base,
        option_a: answer,
        correct_answer: answer,
        meta: { acceptedVariants },
      }
    }
    case 'ordering': {
      const items = ((g.items as string[] | undefined) ?? []).map(String).filter(Boolean)
      if (items.length < 3 || items.length > 5) throw new Error(`slot ${order}: ordering needs 3-5 items`)
      return {
        ...base,
        options: shuffled(items),
        correct_answer: JSON.stringify(items),
        meta: { correctOrder: items },
      }
    }
    case 'matching': {
      const pairs = (g.pairs ?? {}) as Record<string, string>
      const left = Object.keys(pairs)
      if (left.length < 3 || left.length > 5) throw new Error(`slot ${order}: matching needs 3-5 pairs`)
      const right = Object.values(pairs).map(String)
      return {
        ...base,
        correct_answer: JSON.stringify(pairs),
        meta: { matchingLeft: left, matchingRight: shuffled(right), correctPairs: pairs },
      }
    }
    case 'tf_with_reason': {
      const answer = Boolean(g.answer)
      const reasons = ((g.reasons as string[] | undefined) ?? []).map(String).filter(Boolean)
      const correctReason = Number(g.correctReason)
      if (reasons.length !== 4) throw new Error(`slot ${order}: tf_with_reason needs 4 reasons`)
      if (!(correctReason >= 0 && correctReason < 4)) throw new Error(`slot ${order}: tf_with_reason bad correctReason`)
      return {
        ...base,
        correct_answer: `${answer}|${correctReason}`,
        meta: { tfReasons: reasons, tfCorrectReason: correctReason },
      }
    }
    case 'reflection': {
      const prompt = String(g.question_text ?? '').trim()
      const wordMin = Number(g.wordMin) || 40
      const wordMax = Number(g.wordMax) || 200
      const expectedThemes = ((g.expectedThemes as string[] | undefined) ?? []).map(String)
      const rubric = String(g.rubric ?? '').trim()
      return {
        ...base,
        meta: {
          reflectionPrompt: prompt,
          reflectionWordMin: wordMin,
          reflectionWordMax: wordMax,
          reflectionExpectedThemes: expectedThemes,
          ...(rubric ? { reflectionRubric: rubric } : {}),
        },
      }
    }
    default:
      throw new Error(`slot ${order}: unknown generated type "${type}"`)
  }
}

function parseGenerations(raw: string, expectedSlots: number[]): Map<number, Gen> {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    // Models occasionally emit invalid \' escapes inside JSON strings.
    .replace(/\\'/g, "'")
  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed)) throw new Error('response is not a JSON array')
  const bySlot = new Map<number, Gen>()
  for (const g of parsed as Gen[]) {
    const slot = Number(g.slot)
    if (expectedSlots.includes(slot)) bySlot.set(slot, g)
  }
  const missing = expectedSlots.filter((s) => !bySlot.has(s))
  if (missing.length) throw new Error(`missing slots: ${missing.join(', ')}`)
  return bySlot
}

// ── Per-book work derivation ───────────────────

type QuizWithQuestions = {
  quizId: string | null
  /** slot → existing question row (by `order`), when a quiz exists */
  byOrder: Map<number, QuestionRow>
}

type BookWork = {
  bookId: string
  title: string
  /** difficulty → slots needing regeneration (all 5 when the quiz is missing) */
  needed: Map<Difficulty, { quizId: string | null; slots: number[]; staleIds: string[] }>
}

async function deriveWork(db: SupabaseClient, bookId: string, title: string): Promise<BookWork> {
  const { data: quizzes } = await db
    .from('quizzes')
    .select('id, difficulty')
    .eq('book_id', bookId)
    .is('chapter_index', null)

  const byDiff = new Map<Difficulty, QuizWithQuestions>()
  for (const d of DIFFS) byDiff.set(d, { quizId: null, byOrder: new Map() })

  const quizIds = (quizzes ?? []).map((q) => q.id as string)
  let questionRows: QuestionRow[] = []
  if (quizIds.length) {
    const { data } = await db
      .from('questions')
      .select('*')
      .in('quiz_id', quizIds)
    questionRows = (data ?? []) as QuestionRow[]
  }
  for (const q of quizzes ?? []) {
    const d = q.difficulty as Difficulty
    if (!DIFFS.includes(d)) continue
    const entry = byDiff.get(d)!
    entry.quizId = q.id as string
    for (const r of questionRows.filter((r) => r.quiz_id === q.id)) {
      if (r.order != null) entry.byOrder.set(r.order, r)
    }
  }

  const needed = new Map<Difficulty, { quizId: string | null; slots: number[]; staleIds: string[] }>()
  for (const d of DIFFS) {
    const entry = byDiff.get(d)!
    const slots: number[] = []
    for (let s = 0; s < 5; s++) {
      const row = entry.byOrder.get(s)
      const bad =
        !row ||
        !ladderAllowed(d, s).has(row.type) ||
        validateQuestionRow(row).length > 0 ||
        (row.explanation ?? '').includes(BANNED_PHRASE)
      if (bad) slots.push(s)
    }
    if (slots.length === 0) continue
    // Everything except the kept slot-winners is stale (regenerated slots,
    // duplicate orders, null/out-of-range orders).
    const keep = new Set<string>()
    for (let s = 0; s < 5; s++) {
      const row = entry.byOrder.get(s)
      if (row && !slots.includes(s)) keep.add(row.id)
    }
    const staleIds = questionRows
      .filter((r) => r.quiz_id === entry.quizId && !keep.has(r.id))
      .map((r) => r.id)
    needed.set(d, { quizId: entry.quizId, slots, staleIds })
  }
  return { bookId, title, needed }
}

// ── Write path ─────────────────────────────────

async function writeSlots(
  db: SupabaseClient,
  bookId: string,
  title: string,
  diff: Difficulty,
  quizId: string | null,
  staleIds: string[],
  rows: Record<string, unknown>[],
): Promise<void> {
  let qid = quizId
  if (!qid) {
    const { data, error } = await db
      .from('quizzes')
      .insert({
        book_id: bookId,
        title: `${title} — ${diff}`,
        difficulty: diff,
        chapter_index: null,
        question_count: 5,
        hints_enabled: true,
        hint_point_penalty: 0,
      })
      .select('id')
      .single()
    if (error) throw new Error(`insert quiz: ${error.message}`)
    qid = data.id as string
  }
  // Delete by id, not by the `order` column — `order` is a reserved PostgREST
  // query param, so `.in('order', …)` cannot be expressed as a filter.
  if (staleIds.length > 0) {
    const { error: delError } = await db.from('questions').delete().in('id', staleIds)
    if (delError) throw new Error(`delete stale slots: ${delError.message}`)
  }
  const { error: insError } = await db
    .from('questions')
    .insert(rows.map((r) => ({ ...r, quiz_id: qid })))
  if (insError) throw new Error(`insert questions: ${insError.message}`)
}

// ── Book selection ─────────────────────────────

async function selectBooks(db: SupabaseClient): Promise<{ id: string; title: string }[]> {
  const { data: books } = await db
    .from('books')
    .select('id, title, is_tier1, featured')
    .order('title')
  const all = books ?? []

  // Only books with actual chapter content qualify.
  const withChapters = new Set<string>()
  {
    const pageSize = 1000
    let from = 0
    for (;;) {
      const { data } = await db.from('chapters').select('book_id').range(from, from + pageSize - 1)
      if (!data || data.length === 0) break
      for (const c of data) withChapters.add(c.book_id as string)
      if (data.length < pageSize) break
      from += pageSize
    }
  }

  if (BOOK_IDS.length) {
    return all
      .filter((b) => BOOK_IDS.includes(b.id as string) && withChapters.has(b.id as string))
      .map((b) => ({ id: b.id as string, title: b.title as string }))
  }

  if (SCOPE === 'all') {
    return all
      .filter((b) => withChapters.has(b.id as string))
      .map((b) => ({ id: b.id as string, title: b.title as string }))
  }

  // tier1 scope: is_tier1 OR featured, plus the 40 most-assigned books.
  const { data: assignments } = await db.from('assignments').select('book_id').not('book_id', 'is', null)
  const counts = new Map<string, number>()
  for (const a of assignments ?? []) {
    const id = a.book_id as string
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  const mostAssigned = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([id]) => id)
  const wanted = new Set<string>(mostAssigned)
  for (const b of all) if (b.is_tier1 || b.featured) wanted.add(b.id as string)
  return all
    .filter((b) => wanted.has(b.id as string) && withChapters.has(b.id as string))
    .map((b) => ({ id: b.id as string, title: b.title as string }))
}

// ── Main ───────────────────────────────────────

type RunStats = {
  booksProcessed: number
  quizzesTouched: number
  questionsWritten: number
  errors: { bookId: string; diff: string; error: string }[]
  inputChars: number
  apiCalls: number
}

async function processBook(
  db: SupabaseClient,
  ai: Anthropic,
  book: { id: string; title: string },
  stats: RunStats,
): Promise<void> {
  const work = await deriveWork(db, book.id, book.title)
  if (work.needed.size === 0) return

  if (!COMMIT) {
    const parts = [...work.needed.entries()]
      .map(([d, w]) => `${d}[${w.slots.join(',')}]${w.quizId ? '' : ' (new quiz)'}`)
      .join('  ')
    console.log(`  DRY ${book.id}: ${parts}`)
    stats.booksProcessed++
    return
  }

  const source = await fetchSource(db, book.id)
  if (!source) {
    console.log(`  SKIP ${book.id}: no readable chapter content`)
    return
  }

  for (const [diff, w] of work.needed) {
    let lastError: string | null = null
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const prompt = buildPrompt(source.title, source.author, source.synopsis, source.text, diff, w.slots)
        stats.inputChars += prompt.length
        stats.apiCalls++
        const res = await ai.messages.create({
          model: MODEL,
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        })
        const raw = res.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('')
        const bySlot = parseGenerations(raw, w.slots)
        const rows = w.slots.map((s) => encodeRow(bySlot.get(s)!, w.quizId ?? 'pending', s))
        // Pre-write integrity check with the canonical validator.
        for (const r of rows) {
          const issues = validateQuestionRow({ id: 'new', ...r } as unknown as QuestionRow)
          if (issues.length) throw new Error(`validation: ${issues.map((i) => i.problem).join('; ')}`)
        }
        await writeSlots(db, book.id, source.title, diff, w.quizId, w.staleIds, rows)
        await db.from('quiz_generation_runs').insert({
          book_id: book.id, difficulty: diff, status: 'success', model: MODEL,
        })
        stats.quizzesTouched++
        stats.questionsWritten += rows.length
        console.log(`  OK  ${book.id} ${diff}: wrote slots [${w.slots.join(',')}]`)
        lastError = null
        break
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e)
        if (attempt === 0) console.log(`  RETRY ${book.id} ${diff}: ${lastError}`)
      }
    }
    if (lastError) {
      console.log(`  FAIL ${book.id} ${diff}: ${lastError}`)
      stats.errors.push({ bookId: book.id, diff, error: lastError })
      await db.from('quiz_generation_runs').insert({
        book_id: book.id, difficulty: diff, status: 'error', model: MODEL, error: lastError.slice(0, 1000),
      })
    }
  }
  stats.booksProcessed++
}

async function main() {
  const db = getClient()
  const ai = COMMIT ? getAnthropic() : (null as unknown as Anthropic)

  let books = await selectBooks(db)
  if (LIMIT > 0) books = books.slice(0, LIMIT)
  console.log(`Scope=${SCOPE} → ${books.length} candidate books. Mode: ${COMMIT ? 'COMMIT' : 'dry-run'}`)

  const stats: RunStats = { booksProcessed: 0, quizzesTouched: 0, questionsWritten: 0, errors: [], inputChars: 0, apiCalls: 0 }

  for (let i = 0; i < books.length; i += BATCH_SIZE) {
    const batch = books.slice(i, i + BATCH_SIZE)
    console.log(`\nBatch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} books)…`)
    // simple worker pool, CONCURRENCY at a time
    const queue = [...batch]
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      for (;;) {
        const book = queue.shift()
        if (!book) return
        try {
          await processBook(db, ai, book, stats)
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e)
          console.log(`  FAIL ${book.id}: ${msg}`)
          stats.errors.push({ bookId: book.id, diff: '(book)', error: msg })
        }
      }
    })
    await Promise.all(workers)
  }

  console.log(`\n── Summary ──`)
  console.log(`books needing work: ${stats.booksProcessed}`)
  if (COMMIT) {
    console.log(`quiz difficulties written: ${stats.quizzesTouched}`)
    console.log(`questions written: ${stats.questionsWritten}`)
    console.log(`API calls: ${stats.apiCalls}, ~input chars: ${stats.inputChars.toLocaleString()}`)
    if (stats.errors.length) {
      console.log(`errors (${stats.errors.length}):`)
      for (const e of stats.errors) console.log(`  ${e.bookId} ${e.diff}: ${e.error}`)
      process.exitCode = 1
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
