/**
 * Trial Engine — typed question models for ALL fifteen question families.
 *
 * Builds ON the existing six-type system in ./question-types (zod schemas +
 * validators): the six legacy families are composed in unchanged, keyed by
 * their kebab-case family id, and nine new families are added here. One
 * discriminated union (`TrialItem`) is what the session engine (./engine)
 * and the renderers (src/components/trials/session) consume.
 *
 * Every family carries the same pedagogical apparatus:
 *   prompt · passage anchors (paragraphId references) · options/answer model ·
 *   rationale · evidence anchor · 3-level hint ladder (gentle nudge → narrow
 *   the field → point to evidence) · Wisdom value.
 *
 * Hint levels reuse the shared ladder contract from src/lib/quiz-hints:
 *   L1 gentle nudge · L2 narrow the field · L3 point to evidence.
 */
import { z } from "zod"
import { hintSchema, type Hint } from "@/lib/quiz-hints"
import {
  FillTheLineContentSchema,
  FindTheEvidenceContentSchema,
  WordInContextContentSchema,
  MatchPairsContentSchema,
  WhoSaidItContentSchema,
  RecitationContentSchema,
  type TrialResponse as LegacyTrialResponse,
} from "./question-types"

export type { Hint }

// ── Family ids ───────────────────────────────────────────

/** The six families that already exist (see ./question-types). */
export const LEGACY_FAMILIES = [
  "fill-the-line",
  "find-the-evidence",
  "word-in-context",
  "match-pairs",
  "who-said-it",
  "recitation",
] as const

/** The nine families added by the Trial engine rebuild. */
export const NEW_FAMILIES = [
  "multiple-choice",
  "true-false-with-reason",
  "ordering",
  "close-reading",
  "passage-identification",
  "vocabulary-in-context",
  "cross-reference",
  "reflection",
  "short-answer",
] as const

export const TRIAL_FAMILIES = [...LEGACY_FAMILIES, ...NEW_FAMILIES] as const
export type TrialFamily = (typeof TRIAL_FAMILIES)[number]

/** Maps the six kebab-case family ids to the legacy snake_case type keys. */
export const LEGACY_TYPE_BY_FAMILY = {
  "fill-the-line": "fill_the_line",
  "find-the-evidence": "find_the_evidence",
  "word-in-context": "word_in_context",
  "match-pairs": "match_pairs",
  "who-said-it": "who_said_it",
  recitation: "recitation",
} as const
export type LegacyFamily = keyof typeof LEGACY_TYPE_BY_FAMILY

// ── Shared base ──────────────────────────────────────────

/** A reference to a passage location in the reader (paragraph anchors). */
export const PassageAnchorSchema = z.object({
  /** Stable paragraph id in the structured text (reader anchor). */
  paragraphId: z.string().min(1),
  /** Optional exact quoted span within the paragraph. */
  quote: z.string().optional(),
})
export type PassageAnchor = z.infer<typeof PassageAnchorSchema>

/** Fields every Trial item carries, regardless of family. */
const TrialBaseShape = {
  id: z.string().min(1),
  /** The question as the learner sees it. */
  prompt: z.string().min(1),
  /** Passage anchors this question is drawn from (paragraphId references). */
  anchors: z.array(PassageAnchorSchema).default([]),
  /** Why the correct answer is correct — shown after answering. */
  rationale: z.string().min(1),
  /** The single anchor that best proves the answer (highlighted post-answer). */
  evidenceAnchor: PassageAnchorSchema.nullable().default(null),
  /**
   * 3-level hint ladder, at most one hint per level:
   *   1 gentle nudge · 2 narrow the field · 3 point to evidence.
   * Reveal order is enforced by the engine (L1 → L2 → L3).
   */
  hints: z.array(hintSchema).max(3).default([]),
  /** Base Wisdom awarded for a first-try, unaided correct answer. */
  wisdom: z.number().int().min(1).default(10),
  difficulty: z.enum(["apprentice", "scholar", "master"]).default("apprentice"),
}

// ── Shared option primitive (new families) ───────────────

/**
 * One selectable option. `id` is stable so the engine can shuffle display
 * order deterministically (seeded) without corrupting responses.
 * `nearMiss` marks a distractor that is defensible-but-wrong — choosing it
 * yields the near-miss feedback track instead of plain incorrect.
 */
export const TrialOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  correct: z.boolean(),
  nearMiss: z.boolean().optional(),
  /** Why this distractor is tempting / where it goes wrong. */
  distractorNote: z.string().optional(),
})
export type TrialOption = z.infer<typeof TrialOptionSchema>

const optionsWithOneCorrect = (label: string) =>
  z
    .array(TrialOptionSchema)
    .min(2)
    .refine((opts) => opts.filter((o) => o.correct).length === 1, {
      message: `${label}: exactly one option must be correct`,
    })

// ── New family content payloads ──────────────────────────

/** multiple-choice — stem + options, one correct. */
export const MultipleChoiceContentSchema = z.object({
  options: optionsWithOneCorrect("multiple-choice"),
})
export type MultipleChoiceContent = z.infer<typeof MultipleChoiceContentSchema>

/** true-false-with-reason — verdict PLUS the justifying reason. */
export const TrueFalseWithReasonContentSchema = z.object({
  statement: z.string().min(1),
  correctBool: z.boolean(),
  reasons: optionsWithOneCorrect("true-false-with-reason"),
})
export type TrueFalseWithReasonContent = z.infer<typeof TrueFalseWithReasonContentSchema>

/** ordering — arrange the items into `correctOrder` (list of item ids). */
export const OrderingContentSchema = z.object({
  items: z.array(z.object({ id: z.string().min(1), text: z.string().min(1) })).min(2),
  correctOrder: z.array(z.string().min(1)).min(2),
})
export type OrderingContent = z.infer<typeof OrderingContentSchema>

/** close-reading — one passage, one deep question, per-option rationale. */
export const CloseReadingContentSchema = z.object({
  passage: z.string().min(1),
  /** The phrase the question homes in on (highlighted in the passage). */
  focusPhrase: z.string().optional(),
  options: optionsWithOneCorrect("close-reading"),
})
export type CloseReadingContent = z.infer<typeof CloseReadingContentSchema>

/** passage-identification — name the work / speaker / character of a passage. */
export const PassageIdentificationContentSchema = z.object({
  passage: z.string().min(1),
  subject: z.enum(["book", "speaker", "character"]),
  options: optionsWithOneCorrect("passage-identification"),
})
export type PassageIdentificationContent = z.infer<typeof PassageIdentificationContentSchema>

/**
 * vocabulary-in-context — infer a word's meaning from context clues (as
 * opposed to word-in-context, which recalls a gloss). Options carry
 * distractorNotes explaining the misread each represents.
 */
export const VocabularyInContextContentSchema = z.object({
  sentence: z.string().min(1),
  targetWord: z.string().min(1),
  options: optionsWithOneCorrect("vocabulary-in-context"),
})
export type VocabularyInContextContent = z.infer<typeof VocabularyInContextContentSchema>

/** cross-reference — connect a theme across two passages (often two works). */
export const CrossReferenceContentSchema = z.object({
  passageA: z.object({ text: z.string().min(1), citation: z.string().min(1) }),
  passageB: z.object({ text: z.string().min(1), citation: z.string().min(1) }),
  options: optionsWithOneCorrect("cross-reference"),
})
export type CrossReferenceContent = z.infer<typeof CrossReferenceContentSchema>

/**
 * reflection — open written response, self-assessed against a rubric.
 * Never marked incorrect (anti-punishment): completion + meeting minWords
 * earns Wisdom; the rubric makes the self-assessment concrete.
 */
export const ReflectionContentSchema = z.object({
  minWords: z.number().int().min(0).default(40),
  /** Sentence frames / guidance shown while writing. */
  guidance: z.array(z.string()).default([]),
  /** Rubric rows the learner checks off against their own response. */
  rubric: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) })).default([]),
})
export type ReflectionContent = z.infer<typeof ReflectionContentSchema>

/** short-answer — brief free response, auto-scored by keyword coverage. */
export const ShortAnswerContentSchema = z.object({
  referenceAnswer: z.string().min(1),
  /** Concepts a strong answer mentions (normalized substring match). */
  acceptedKeywords: z.array(z.string().min(1)).default([]),
  /** How many keywords must be hit for full credit (default: all-but-one). */
  minKeywords: z.number().int().min(0).optional(),
})
export type ShortAnswerContent = z.infer<typeof ShortAnswerContentSchema>

// ── The discriminated union ──────────────────────────────

export const TrialItemSchema = z.discriminatedUnion("family", [
  // Six legacy families — content schemas reused unchanged.
  z.object({ ...TrialBaseShape, family: z.literal("fill-the-line"), content: FillTheLineContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("find-the-evidence"), content: FindTheEvidenceContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("word-in-context"), content: WordInContextContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("match-pairs"), content: MatchPairsContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("who-said-it"), content: WhoSaidItContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("recitation"), content: RecitationContentSchema }),
  // Nine new families.
  z.object({ ...TrialBaseShape, family: z.literal("multiple-choice"), content: MultipleChoiceContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("true-false-with-reason"), content: TrueFalseWithReasonContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("ordering"), content: OrderingContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("close-reading"), content: CloseReadingContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("passage-identification"), content: PassageIdentificationContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("vocabulary-in-context"), content: VocabularyInContextContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("cross-reference"), content: CrossReferenceContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("reflection"), content: ReflectionContentSchema }),
  z.object({ ...TrialBaseShape, family: z.literal("short-answer"), content: ShortAnswerContentSchema }),
])

/** The validated Trial item union — discriminated on `family`. */
export type TrialItem = z.infer<typeof TrialItemSchema>

export type TrialContentFor<F extends TrialFamily> = Extract<
  TrialItem,
  { family: F }
>["content"]

// ── Responses ────────────────────────────────────────────

/**
 * What a renderer submits. Legacy families keep their established response
 * shapes (see ./question-types); new families respond with stable option /
 * item ids so seeded shuffles never corrupt grading.
 */
export type TrialResponseByFamily = {
  "fill-the-line": LegacyTrialResponse["fill_the_line"]
  "find-the-evidence": LegacyTrialResponse["find_the_evidence"]
  "word-in-context": LegacyTrialResponse["word_in_context"]
  "match-pairs": LegacyTrialResponse["match_pairs"]
  "who-said-it": LegacyTrialResponse["who_said_it"]
  recitation: LegacyTrialResponse["recitation"]
  "multiple-choice": { optionId: string }
  "true-false-with-reason": { bool: boolean; reasonId: string }
  ordering: { order: string[] }
  "close-reading": { optionId: string }
  "passage-identification": { optionId: string }
  "vocabulary-in-context": { optionId: string }
  "cross-reference": { optionId: string }
  reflection: { text: string; rubricChecked: string[] }
  "short-answer": { text: string }
}

export type TrialResponseFor<F extends TrialFamily> = TrialResponseByFamily[F]

/** Any response, with its family tag (what the engine receives). */
export type FamilyTaggedResponse = {
  [F in TrialFamily]: { family: F; response: TrialResponseFor<F> }
}[TrialFamily]

// ── Parse helpers ────────────────────────────────────────

export function parseTrialItem(raw: unknown): TrialItem {
  return TrialItemSchema.parse(raw)
}

export function safeParseTrialItem(raw: unknown): TrialItem | null {
  const r = TrialItemSchema.safeParse(raw)
  return r.success ? r.data : null
}
