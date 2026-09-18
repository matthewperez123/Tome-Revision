import "server-only"

import Anthropic from "@anthropic-ai/sdk"
import { isOpenEnded } from "@/lib/questions/classify"
import {
  ALL_QUESTION_TYPES,
  generatedQuestionSchema,
  generatedQuizSchema,
  answerStringsForLeakCheck,
  DIFFICULTY_SEMANTICS,
  QUESTION_TYPE_LABELS,
  type GeneratedQuestion,
  type GenerateQuizRequest,
  type TeacherQuizDifficulty,
  type TeacherQuizQuestionType,
} from "@/lib/teacher-quiz-types"
import { hintLadderSchema, hintLeaks, stripLeakingHints, type Hint } from "@/lib/quiz-hints"

// ── Model routing ─────────────────────────────────────────────────────────────
// haiku for cheap objective recall; opus for master-tier + open-ended rubric
// authoring; sonnet as the default middle ground.
const MODEL_HAIKU = "claude-haiku-4-5"
const MODEL_SONNET = "claude-sonnet-4-6"
const MODEL_OPUS = "claude-opus-4-8"

// The canonical open-ended rule (meta-free default form) — classify.ts is the
// single source of truth for the 16-type vocabulary.
const OPEN_ENDED = new Set<TeacherQuizQuestionType>(
  ALL_QUESTION_TYPES.filter((t) => isOpenEnded(t)),
)

export function chooseModel(req: GenerateQuizRequest): string {
  const hasMaster = (req.difficultyMix.master ?? 0) > 0 || req.single?.difficulty === "master"
  const hasOpenEnded = req.types.some((t) => OPEN_ENDED.has(t)) || (req.single && OPEN_ENDED.has(req.single.type))
  if (hasMaster || req.types.includes("free_response") || (req.single && OPEN_ENDED.has(req.single.type) && req.single.type === "free_response")) {
    return MODEL_OPUS
  }
  if (hasOpenEnded) return MODEL_SONNET
  const onlyEasyObjective = (req.difficultyMix.master ?? 0) === 0
  return onlyEasyObjective ? MODEL_HAIKU : MODEL_SONNET
}

// ── HTML → text ─────────────────────────────────────────────────────────────
const MAX_PASSAGE_CHARS = 60_000

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/gi, '"')
    .replace(/&mdash;/gi, "—")
    .replace(/\s+/g, " ")
    .trim()
}

export interface ChapterRow {
  id: string
  chapter_index: number
  title: string | null
  content_html: string | null
}

/** Build the grounded source passage from selected chapters, capped for cost. */
export function buildSourcePassage(chapters: ChapterRow[]): string {
  const parts: string[] = []
  let budget = MAX_PASSAGE_CHARS
  for (const ch of chapters) {
    if (budget <= 0) break
    const heading = `\n\n[Chapter ${ch.chapter_index}${ch.title ? `: ${ch.title}` : ""}]\n`
    const text = stripHtml(ch.content_html ?? "")
    const slice = text.slice(0, budget)
    budget -= slice.length + heading.length
    parts.push(heading + slice)
  }
  return parts.join("").trim()
}

// ── Prompt construction ───────────────────────────────────────────────────────

function difficultyMixLines(req: GenerateQuizRequest): string {
  const m = req.difficultyMix
  const rows = (["apprentice", "scholar", "master"] as TeacherQuizDifficulty[])
    .filter((d) => (m[d] ?? 0) > 0)
    .map((d) => `  - ${m[d]} × ${d} (${DIFFICULTY_SEMANTICS[d]})`)
  return rows.join("\n")
}

function typesLine(types: TeacherQuizQuestionType[]): string {
  return types.map((t) => `${t} (${QUESTION_TYPE_LABELS[t]})`).join(", ")
}

const CONTRACT = `Each question object MUST match exactly:
{
  "type": one of the allowed types,
  "difficulty": "apprentice" | "scholar" | "master",
  "category": "factual" | "literary" | "analytical" | "thematic" | "contextual",
  "prompt": the question text,
  "options": ["…","…","…","…"]  // exactly 4 for option types; 4-6 for multiple_select; omit otherwise
  "correct_answer": see the per-type table below,
  "meta": { per-type payload — see the table below },
  "rubric": { "max_points": int, "criteria": [{ "name": str, "points": int, "descriptor": str }] }  // REQUIRED for reflection/free_response (3-5 criteria); omit for objective types
  "reference_answer": model answer  // include for open-ended types
  "explanation": specific, text-grounded reason the answer is correct. NEVER write generic filler like "See the text for the relevant passage" — cite what happens and why the answer follows.
  "source_anchor": { "chapter_index": int, "quote": "<= 15 words quoted from the passage" },
  "hints": [
    { "level": 1, "text": "ORIENT — where to look / what the question is really asking. Point to the relevant passage or concept. Give NO reasoning away." },
    { "level": 2, "text": "SCAFFOLD — the approach or concept needed. For multiple choice you MAY eliminate ONE distractor by reasoning ('two of these can't be right because…') but NEVER name the correct option." },
    { "level": 3, "text": "STRONG NUDGE — very close, but the student must still commit. For open-ended, scaffold the rubric criteria ('a strong answer connects X to Y') without writing the answer." }
  ],
  "distractor_eliminations": ["<exact text of an INCORRECT option safe to grey out>", "…"]  // multiple_choice/vocabulary_in_context ONLY; ordered; NEVER include the correct option; omit otherwise
}

HARD RULE for hints: no hint may contain the literal correct answer, the correct option's text or letter, or the exact reference_answer. The student does the thinking; hints only orient and scaffold.

PER-TYPE PAYLOAD TABLE (required fields per type):
- multiple_choice / theme_analysis / close_reading: options[4], correct_answer = exact option text. theme_analysis also meta.theme (the theme named). close_reading also meta.passage (verbatim excerpt from the source, 1-4 sentences) and optionally meta.passageHighlight = [startChar, endChar] within that excerpt.
- vocabulary_in_context: options[4] (definitions), correct_answer, meta.vocabWord (the word as it appears in the text).
- passage_id: options[4] (e.g. speakers, scenes, or works), correct_answer, meta.passage (verbatim excerpt), optional meta.passageHighlight.
- identification: options[4], correct_answer, meta.identificationSubject = "speaker" | "book" | "character".
- cross_reference: options[4], correct_answer, meta.crossRefBookId (the slug id of the other book, e.g. "the-odyssey"), meta.crossRefLabel (its display title).
- true_false: correct_answer = "true" or "false". No options needed.
- tf_with_reason: correct_answer = "<true|false>|<reasonIndex>" (e.g. "true|2"), meta.tfReasons = array of 3-4 candidate reasons; the index (0-based) picks the correct one.
- multiple_select: options[4-6], correct_answer = the 2+ correct option texts comma-joined.
- fill_blank: prompt marks the blank with ____, correct_answer = the missing word/phrase, meta.acceptedVariants = array of other accepted spellings/phrasings (may be empty []).
- short_answer: correct_answer = canonical expected answer (a few words), meta.acceptedVariants = array of accepted alternate phrasings (may be empty []).
- ordering: meta.items = 4-6 event/item strings in SHUFFLED presentation order, meta.correctOrder = the same strings in the correct sequence. No correct_answer field.
- matching: meta.matchingLeft = 3-5 items, meta.matchingRight = same count of counterparts, meta.correctPairs = { "<left>": "<right>", ... }. No correct_answer field.
- reflection / free_response: rubric (3-5 criteria), reference_answer, meta.reflectionPrompt (the full writing prompt), meta.reflectionWordMin and meta.reflectionWordMax (integers, min < max — e.g. 50/300 for reflection, 150/800 for free_response), meta.reflectionExpectedThemes = array of themes a strong answer engages.`

function buildInstruction(req: GenerateQuizRequest, bookTitle: string, bookAuthor: string): string {
  return `You are the Tome Assistant, a literature teacher writing a rigorous, TEXT-GROUNDED quiz for students on "${bookTitle}" by ${bookAuthor}.

Use ONLY the provided source passage. Every question must be answerable from that text — never invent events, characters, or quotations. Quotes in source_anchor must appear verbatim in the passage.

Generate exactly ${req.totalCount} questions with this difficulty mix:
${difficultyMixLines(req)}

Allowed question types (distribute across them): ${typesLine(req.types)}.
${
    req.totalCount >= 10 && req.types.length >= 6
      ? "\nTYPE-MIX RULE: use at least 6 distinct types, and no more than 2 questions of any single type."
      : ""
  }
${req.focus ? `\nFocus the quiz on: ${req.focus}` : ""}

${CONTRACT}

Return ONLY a JSON object {"questions": [...]} — no prose, no markdown fences.`
}

function buildSingleInstruction(req: GenerateQuizRequest, bookTitle: string, bookAuthor: string): string {
  const s = req.single!
  return `You are the Tome Assistant, writing ONE replacement quiz question for "${bookTitle}" by ${bookAuthor}, grounded only in the provided source passage.

Type: ${s.type} (${QUESTION_TYPE_LABELS[s.type]}). Difficulty: ${s.difficulty} (${DIFFICULTY_SEMANTICS[s.difficulty]}).
${s.instruction ? `Teacher instruction: ${s.instruction}` : ""}

${CONTRACT}

Return ONLY a JSON object {"questions": [ <one question> ]} — no prose, no fences.`
}

// ── Anthropic call ──────────────────────────────────────────────────────────

interface CallResult {
  questions: GeneratedQuestion[]
  model: string
  usage: { input_tokens: number; output_tokens: number; cache_read?: number; cache_write?: number }
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : text
  const objMatch = raw.match(/\{[\s\S]*\}/)
  if (!objMatch) throw new Error("No JSON object in model response")
  return JSON.parse(objMatch[0])
}

/**
 * Core generation. Passage is placed in a cached system block so it is reused
 * across difficulties and single-question regenerations without re-billing.
 */
async function callModel(
  client: Anthropic,
  model: string,
  passage: string,
  instruction: string,
  single: boolean,
): Promise<CallResult> {
  const maxTokens = single ? 1024 : Math.min(8192, 512 + 350 * 30)

  const run = async () => {
    const msg = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: [
        {
          type: "text",
          text:
            "You write rigorous, text-grounded literature quizzes. You output strictly valid JSON and never hallucinate content beyond the supplied passage.",
        },
        {
          type: "text",
          text: `SOURCE PASSAGE:\n${passage}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: instruction }],
    })
    const block = msg.content.find((b) => b.type === "text")
    const text = block && block.type === "text" ? block.text : ""
    const parsed = generatedQuizSchema.parse(extractJson(text))
    return {
      questions: parsed.questions,
      usage: {
        input_tokens: msg.usage.input_tokens,
        output_tokens: msg.usage.output_tokens,
        cache_read: msg.usage.cache_read_input_tokens ?? undefined,
        cache_write: msg.usage.cache_creation_input_tokens ?? undefined,
      },
    }
  }

  try {
    const r = await run()
    return { ...r, model }
  } catch {
    // one retry on parse/validation failure
    const r = await run()
    return { ...r, model }
  }
}

// ── Hint leak vetting ─────────────────────────────────────────────────────────

/** Re-author a question's hint ladder from the passage when the original leaked. */
async function regenerateHints(
  client: Anthropic,
  model: string,
  passage: string,
  q: GeneratedQuestion,
): Promise<Hint[]> {
  const msg = await client.messages.create({
    model,
    max_tokens: 600,
    system: [
      { type: "text", text: "You write progressive quiz hints that never reveal the answer." },
      { type: "text", text: `SOURCE PASSAGE:\n${passage}`, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      {
        role: "user",
        content: `Re-write a 3-level hint ladder for this question. L1 orients (where to look), L2 scaffolds the approach (MC may rule out one wrong option without naming the right one), L3 is a strong nudge but the student still commits.

ABSOLUTE RULE: no hint may contain the correct answer, the correct option text, or the reference answer.

Question: ${q.prompt}
${q.options ? `Options: ${q.options.join(" | ")}` : ""}

Return ONLY {"hints":[{"level":1,"text":"…"},{"level":2,"text":"…"},{"level":3,"text":"…"}]} — no prose, no fences.`,
      },
    ],
  })
  const block = msg.content.find((b) => b.type === "text")
  const text = block && block.type === "text" ? block.text : ""
  const json = extractJson(text) as { hints?: unknown }
  return hintLadderSchema.parse(json.hints)
}

/**
 * Ensure no hint leaks the answer. On a leak, re-author that question's ladder
 * once; then strip any hint that still leaks (dropping to a shorter ladder, or
 * to no hints, rather than ship a leaky one).
 */
async function vetHints(
  client: Anthropic,
  model: string,
  passage: string,
  questions: GeneratedQuestion[],
): Promise<void> {
  for (const q of questions) {
    if (!q.hints || q.hints.length === 0) continue
    const forbidden = answerStringsForLeakCheck(q)
    const leaks = q.hints.some((h) => hintLeaks(h.text, forbidden))
    if (!leaks) continue
    try {
      q.hints = await regenerateHints(client, model, passage, q)
    } catch {
      // keep the original; the strip below removes the offending levels
    }
    const clean = stripLeakingHints(q.hints, forbidden)
    q.hints = clean.length > 0 ? clean : undefined
  }
}

export async function generateQuizQuestions(params: {
  passage: string
  bookTitle: string
  bookAuthor: string
  req: GenerateQuizRequest
}): Promise<CallResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured")
  const client = new Anthropic({ apiKey })
  const model = chooseModel(params.req)
  const single = !!params.req.single
  const instruction = single
    ? buildSingleInstruction(params.req, params.bookTitle, params.bookAuthor)
    : buildInstruction(params.req, params.bookTitle, params.bookAuthor)
  const result = await callModel(client, model, params.passage, instruction, single)

  // For full generations, validate each question individually so a single bad
  // item is caught with a clear path (schema already validated the array).
  result.questions.forEach((q) => generatedQuestionSchema.parse(q))

  // Reject/repair any hint that contains the answer before it can be persisted.
  await vetHints(client, model, params.passage, result.questions)
  return result
}
