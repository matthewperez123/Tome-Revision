/**
 * Trial Question Types — single source of truth for the six net-new
 * question types (feat/quiz-question-types).
 *
 * The discriminated union (keyed on `type`) ties each question to its
 * type-specific `content` payload and its `response` shape. A matching zod
 * schema per type validates `content` on read (DB jsonb / content JSON), and a
 * pure `validate(content, response)` checks correctness without touching React.
 *
 * These types are intentionally separate from the legacy flat `Question` in
 * src/lib/quiz-engine.ts. The runner resolves a type → its renderer + validator
 * through the registry (./registry), so adding a future type is one new variant
 * here + one registry entry.
 */
import { z } from "zod"

// ── Shared primitives ──────────────────────────

export const TRIAL_QUESTION_TYPES = [
  "fill_the_line",
  "find_the_evidence",
  "word_in_context",
  "match_pairs",
  "who_said_it",
  "recitation",
] as const

export type TrialQuestionType = (typeof TRIAL_QUESTION_TYPES)[number]

/** Difficulty tiers, lower-cased to match the existing tier ramp. */
export const TRIAL_DIFFICULTIES = ["apprentice", "scholar", "master"] as const
export type TrialDifficulty = (typeof TRIAL_DIFFICULTIES)[number]

/** Normalize for fuzzy text comparison: case, punctuation, whitespace. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^\p{L}\p{N}\s]/gu, "") // strip punctuation
    .replace(/\s+/g, " ")
    .trim()
}

// ── Per-type content payloads ──────────────────

/** fill_the_line — poetry cloze. Render the stanza with blank slots; the user
 *  fills each blank from the word bank (mode 'bank') or by typing (mode 'type').
 *  Blanking a rhyme word lets the scheme act as the hint. */
export const FillTheLineContentSchema = z.object({
  lines: z.array(z.string()).min(1),
  blanks: z
    .array(
      z.object({
        lineIndex: z.number().int().min(0),
        answer: z.string().min(1),
      })
    )
    .min(1),
  wordBank: z.array(z.string()).optional(),
  mode: z.enum(["bank", "type"]),
})
export type FillTheLineContent = z.infer<typeof FillTheLineContentSchema>

/** find_the_evidence — tap the line(s) in a passage that support a claim.
 *  `segments` are the indexed addressable units (lines / sentences).
 *  `correctRange` is an inclusive [start, end] index pair into `segments`. */
export const FindTheEvidenceContentSchema = z.object({
  claim: z.string().min(1),
  segments: z.array(z.string()).min(1),
  correctRange: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
})
export type FindTheEvidenceContent = z.infer<typeof FindTheEvidenceContentSchema>

/** A single-correct multiple-choice option (shared by word_in_context +
 *  who_said_it, which both render through the shared MC body). */
const ChoiceSchema = z.object({
  text: z.string().min(1),
  correct: z.boolean(),
})

/** word_in_context — pick the gloss/meaning of a target word in a sentence.
 *  Seeded from Virgil glosses where possible. */
export const WordInContextContentSchema = z.object({
  sentence: z.string().min(1),
  targetWord: z.string().min(1),
  choices: z.array(ChoiceSchema).min(2),
})
export type WordInContextContent = z.infer<typeof WordInContextContentSchema>

/** match_pairs — shuffled grid; tap a left then a right; matched pairs lock. */
export const MatchPairsContentSchema = z.object({
  pairs: z
    .array(z.object({ left: z.string().min(1), right: z.string().min(1) }))
    .min(2),
})
export type MatchPairsContent = z.infer<typeof MatchPairsContentSchema>

/** who_said_it — attribute a quote to a speaker. Renders through the MC body
 *  ({name} surfaced as the choice text). */
export const WhoSaidItContentSchema = z.object({
  quote: z.string().min(1),
  choices: z.array(z.object({ name: z.string().min(1), correct: z.boolean() })).min(2),
})
export type WhoSaidItContent = z.infer<typeof WhoSaidItContentSchema>

/** recitation — progressive cloze. `tokens` is the passage pre-tokenized into
 *  words/punctuation units; `rounds` is the blank ratio per round (e.g.
 *  [0.25, 0.5, 0.75, 1]) — each round blanks an increasing share, final round
 *  is the whole passage from memory. */
export const RecitationContentSchema = z.object({
  tokens: z.array(z.string()).min(1),
  rounds: z.array(z.number().min(0).max(1)).min(1),
})
export type RecitationContent = z.infer<typeof RecitationContentSchema>

// ── Discriminated union (the source of truth) ──

/** Fields common to every typed question row (DB columns / JSON keys). */
const BaseQuestionShape = {
  id: z.string(),
  prompt: z.string(),
  explanation: z.string().nullable().default(null),
  difficulty: z.enum(TRIAL_DIFFICULTIES).default("apprentice"),
  /** Wisdom awarded on correct (maps to trials.wisdom_reward). */
  points: z.number().int().min(0).default(10),
  /** Flames awarded on correct (maps to trials.flames). */
  flames: z.number().int().min(0).default(1),
  position: z.number().int().min(0).default(0),
}

export const TrialQuestionSchema = z.discriminatedUnion("type", [
  z.object({ ...BaseQuestionShape, type: z.literal("fill_the_line"), content: FillTheLineContentSchema }),
  z.object({ ...BaseQuestionShape, type: z.literal("find_the_evidence"), content: FindTheEvidenceContentSchema }),
  z.object({ ...BaseQuestionShape, type: z.literal("word_in_context"), content: WordInContextContentSchema }),
  z.object({ ...BaseQuestionShape, type: z.literal("match_pairs"), content: MatchPairsContentSchema }),
  z.object({ ...BaseQuestionShape, type: z.literal("who_said_it"), content: WhoSaidItContentSchema }),
  z.object({ ...BaseQuestionShape, type: z.literal("recitation"), content: RecitationContentSchema }),
])

/** The validated typed-question union — discriminated on `type`. */
export type TrialQuestion = z.infer<typeof TrialQuestionSchema>

/** Content payload type for a given question type. */
export type TrialContentFor<T extends TrialQuestionType> = Extract<
  TrialQuestion,
  { type: T }
>["content"]

// ── Response shapes (what a renderer submits) ──

export type TrialResponse = {
  fill_the_line: { answers: string[] } // one entry per blank, in blanks order
  find_the_evidence: { range: [number, number] } // user-selected [start,end]
  word_in_context: { choiceIndex: number }
  match_pairs: { pairs: Record<string, string> } // left -> right
  who_said_it: { choiceIndex: number }
  recitation: { round: number; text: string } // typed recall for the round
}

export type TrialResponseFor<T extends TrialQuestionType> = TrialResponse[T]

// ── Validation (parse content on read) ─────────

/** Parse + validate a raw question row's content against its type's schema.
 *  Returns the typed question or throws ZodError. Use on DB / JSON read. */
export function parseTrialQuestion(raw: unknown): TrialQuestion {
  return TrialQuestionSchema.parse(raw)
}

/** Safe variant — returns null instead of throwing (logs nothing). */
export function safeParseTrialQuestion(raw: unknown): TrialQuestion | null {
  const r = TrialQuestionSchema.safeParse(raw)
  return r.success ? r.data : null
}
