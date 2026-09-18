/**
 * Teacher quiz (Virgil-authored) types + zod contracts.
 *
 * Shared by the generation service (server) and the draft-review UI (client),
 * so this file must stay free of server-only imports.
 *
 * Difficulty is lowercase here (apprentice | scholar | master) to match the
 * `teacher_quizzes`/`teacher_quiz_questions` check constraints — NOT the
 * Capitalized values used by the platform `quizzes`/`questions` tables.
 */

import { z } from "zod"
import { hintLadderSchema, normalizeLadder, type Hint } from "@/lib/quiz-hints"

// ── Difficulty ──────────────────────────────────────────────────────────────

export const TEACHER_QUIZ_DIFFICULTIES = ["apprentice", "scholar", "master"] as const
export type TeacherQuizDifficulty = (typeof TEACHER_QUIZ_DIFFICULTIES)[number]

/**
 * Difficulty ladder semantics (kept here so prompt + UI agree):
 * - apprentice: recall / plot / who-what-where
 * - scholar:    interpretation / technique / vocabulary-in-context
 * - master:     synthesis / theme / why-it-matters / context
 */
export const DIFFICULTY_SEMANTICS: Record<TeacherQuizDifficulty, string> = {
  apprentice: "recall, plot, who/what/where — answerable from the literal text",
  scholar: "interpretation, literary technique, vocabulary-in-context",
  master: "synthesis, theme, why-it-matters, historical/literary context",
}

// ── Question types ────────────────────────────────────────────────────────────

// The canonical 16-type vocabulary and the objective/open-ended rule live in
// src/lib/questions/classify.ts — this file re-exposes them for the teacher
// stack. NOTE: short_answer is objective only when meta.acceptedAnswers[] is
// present; the meta-free lists below use its DEFAULT (open-ended) form.
import {
  CANONICAL_QUESTION_TYPES,
  isObjective,
  isOpenEnded,
  type CanonicalQuestionType,
} from "@/lib/questions/classify"

export const ALL_QUESTION_TYPES = CANONICAL_QUESTION_TYPES
export type TeacherQuizQuestionType = CanonicalQuestionType

export type OpenEndedQuestionType = "short_answer" | "free_response" | "reflection"
export type ObjectiveQuestionType = Exclude<TeacherQuizQuestionType, OpenEndedQuestionType>

export const OPEN_ENDED_QUESTION_TYPES = ALL_QUESTION_TYPES.filter(
  (t): t is OpenEndedQuestionType => isOpenEnded(t),
)
export const OBJECTIVE_QUESTION_TYPES = ALL_QUESTION_TYPES.filter(
  (t): t is ObjectiveQuestionType => !isOpenEnded(t),
)

export const QUESTION_TYPE_LABELS: Record<TeacherQuizQuestionType, string> = {
  multiple_choice: "Multiple choice",
  true_false: "True / False",
  fill_blank: "Fill the blank",
  vocabulary_in_context: "Vocabulary in context",
  passage_id: "Passage identification",
  matching: "Matching",
  ordering: "Ordering",
  close_reading: "Close reading",
  tf_with_reason: "True/False with reason",
  theme_analysis: "Theme analysis",
  cross_reference: "Cross-reference",
  reflection: "Reflection",
  identification: "Identification",
  multiple_select: "Multiple select",
  short_answer: "Short answer",
  free_response: "Free response",
}

export function isObjectiveType(t: TeacherQuizQuestionType): t is ObjectiveQuestionType {
  return isObjective(t)
}

export const QUESTION_CATEGORIES = [
  "factual",
  "literary",
  "analytical",
  "thematic",
  "contextual",
] as const
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number]

// ── Per-question generation contract (what Virgil must emit) ────────────────────

export const rubricCriterionSchema = z.object({
  name: z.string().min(1),
  points: z.number().int().nonnegative(),
  descriptor: z.string().min(1),
})

export const rubricSchema = z.object({
  max_points: z.number().int().positive(),
  criteria: z.array(rubricCriterionSchema).min(1),
})

export const sourceAnchorSchema = z.object({
  chapter_index: z.number().int().nonnegative(),
  // <= 15 words from the text — soft cap, validated loosely
  quote: z.string().min(1),
})

// ── Per-type meta payload helpers (validated inside superRefine) ─────────────

function metaOf(q: { meta?: Record<string, unknown> | undefined }): Record<string, unknown> {
  return q.meta ?? {}
}

function metaStrings(m: Record<string, unknown>, key: string): string[] | null {
  const v = m[key]
  if (!Array.isArray(v)) return null
  const out = v.map((x) => String(x).trim()).filter(Boolean)
  return out.length === v.length ? out : null
}

function metaStr(m: Record<string, unknown>, key: string): string | null {
  const v = m[key]
  return typeof v === "string" && v.trim().length > 0 ? v : null
}

/** Option-keyed types whose correct_answer must be one of `options`. */
const OPTION_KEYED_TYPES = new Set<TeacherQuizQuestionType>([
  "multiple_choice",
  "vocabulary_in_context",
  "theme_analysis",
  "identification",
  "close_reading",
  "cross_reference",
  "passage_id",
])

export const generatedQuestionSchema = z
  .object({
    type: z.enum(ALL_QUESTION_TYPES),
    difficulty: z.enum(TEACHER_QUIZ_DIFFICULTIES),
    category: z.enum(QUESTION_CATEGORIES),
    prompt: z.string().min(1),
    options: z.array(z.string().min(1)).optional(),
    /**
     * For objective types: the literal correct option text (or a comma-joined
     * list for multiple_select, or "<bool>|<reasonIndex>" for tf_with_reason).
     * Required for objective, omitted for open-ended and for ordering/matching
     * (whose keys live in meta.correctOrder / meta.correctPairs).
     */
    correct_answer: z.string().optional(),
    /**
     * Per-type payload, keyed exactly as the renderer adapter and grader read
     * it: vocabWord, identificationSubject, passage, passageHighlight,
     * crossRefBookId, crossRefLabel, theme, tfReasons, acceptedVariants,
     * items, correctOrder, matchingLeft, matchingRight, correctPairs,
     * reflectionPrompt, reflectionWordMin, reflectionWordMax,
     * reflectionExpectedThemes.
     */
    meta: z.record(z.string(), z.unknown()).optional(),
    rubric: rubricSchema.optional(),
    reference_answer: z.string().optional(),
    explanation: z.string().min(1),
    source_anchor: sourceAnchorSchema.optional(),
    /** Progressive 3-level hint ladder (leak-checked post-generation). */
    hints: hintLadderSchema.optional(),
    /** MC-only: incorrect option texts safe to grey out, in reveal order. */
    distractor_eliminations: z.array(z.string()).optional(),
  })
  .superRefine((q, ctx) => {
    const issue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message, path })
    const m = metaOf(q)
    const norm = (s: string) => s.trim().toLowerCase()

    // Generic explanation filler is banned — every explanation must be specific.
    if (/see the text for the relevant passage/i.test(q.explanation)) {
      issue("explanation must be specific — generic filler is banned", ["explanation"])
    }

    // ── Option-keyed types: 4 options, key ∈ options, per-type meta ──────────
    if (OPTION_KEYED_TYPES.has(q.type)) {
      if (!q.options || q.options.length < 3 || q.options.length > 6) {
        issue(`${q.type} requires 4 options (3–6 accepted)`, ["options"])
      }
      if (!q.correct_answer) {
        issue(`${q.type} requires correct_answer`, ["correct_answer"])
      } else if (q.options && !q.options.some((o) => norm(o) === norm(q.correct_answer!))) {
        issue("correct_answer must be one of options", ["correct_answer"])
      }
      if (q.type === "vocabulary_in_context" && !metaStr(m, "vocabWord")) {
        issue("vocabulary_in_context requires meta.vocabWord", ["meta", "vocabWord"])
      }
      if (q.type === "identification") {
        const s = metaStr(m, "identificationSubject")
        if (s !== "speaker" && s !== "book" && s !== "character") {
          issue("identification requires meta.identificationSubject ∈ speaker|book|character", ["meta", "identificationSubject"])
        }
      }
      if ((q.type === "passage_id" || q.type === "close_reading") && !metaStr(m, "passage")) {
        issue(`${q.type} requires meta.passage (verbatim excerpt)`, ["meta", "passage"])
      }
      if (q.type === "cross_reference" && !metaStr(m, "crossRefBookId")) {
        issue("cross_reference requires meta.crossRefBookId", ["meta", "crossRefBookId"])
      }
      if (q.type === "theme_analysis" && !metaStr(m, "theme")) {
        issue("theme_analysis requires meta.theme", ["meta", "theme"])
      }
      return
    }

    switch (q.type) {
      case "true_false": {
        const v = q.correct_answer?.toLowerCase()
        if (v !== "true" && v !== "false") {
          issue("true_false correct_answer must be 'true' or 'false'", ["correct_answer"])
        }
        return
      }

      case "multiple_select": {
        if (!q.options || q.options.length < 4 || q.options.length > 6) {
          issue("multiple_select requires 4–6 options", ["options"])
        }
        const parts = (q.correct_answer ?? "").split(",").map((s) => s.trim()).filter(Boolean)
        if (parts.length < 2) {
          issue("multiple_select requires 2+ correct options comma-joined in correct_answer", ["correct_answer"])
        } else if (q.options) {
          const opts = q.options.map(norm)
          for (const p of parts) {
            if (!opts.includes(norm(p))) issue(`correct option "${p}" is not in options`, ["correct_answer"])
          }
        }
        return
      }

      case "tf_with_reason": {
        const reasons = metaStrings(m, "tfReasons")
        if (!reasons || reasons.length < 3 || reasons.length > 4) {
          issue("tf_with_reason requires meta.tfReasons (3–4 reasons)", ["meta", "tfReasons"])
        }
        const match = /^(true|false)\|(\d+)$/i.exec(q.correct_answer ?? "")
        if (!match) {
          issue('tf_with_reason correct_answer must be "<true|false>|<reasonIndex>" e.g. "true|2"', ["correct_answer"])
        } else if (reasons && Number(match[2]) >= reasons.length) {
          issue("tf_with_reason reason index out of range", ["correct_answer"])
        }
        return
      }

      case "fill_blank": {
        if (!q.prompt.includes("____")) {
          issue("fill_blank prompt must mark the blank with ____", ["prompt"])
        }
        if (!q.correct_answer) issue("fill_blank requires correct_answer", ["correct_answer"])
        if (metaStrings(m, "acceptedVariants") == null) {
          issue("fill_blank requires meta.acceptedVariants[] (may be empty)", ["meta", "acceptedVariants"])
        }
        return
      }

      case "short_answer": {
        // Generated short_answer is always the OBJECTIVE form: a key plus
        // accepted variants (persisted as meta.acceptedAnswers by generatedToRow).
        if (!q.correct_answer) issue("short_answer requires correct_answer", ["correct_answer"])
        if (metaStrings(m, "acceptedVariants") == null) {
          issue("short_answer requires meta.acceptedVariants[] (may be empty)", ["meta", "acceptedVariants"])
        }
        return
      }

      case "ordering": {
        const items = metaStrings(m, "items")
        const order = metaStrings(m, "correctOrder")
        if (!items || items.length < 4 || items.length > 6) {
          issue("ordering requires meta.items (4–6, shuffled)", ["meta", "items"])
        }
        if (!order || (items && order.length !== items.length)) {
          issue("ordering requires meta.correctOrder (same items, correct sequence)", ["meta", "correctOrder"])
        } else if (items) {
          const set = new Set(items.map(norm))
          if (!order.every((o) => set.has(norm(o)))) {
            issue("meta.correctOrder must be a permutation of meta.items", ["meta", "correctOrder"])
          }
        }
        return
      }

      case "matching": {
        const left = metaStrings(m, "matchingLeft")
        const right = metaStrings(m, "matchingRight")
        if (!left || left.length < 3 || left.length > 5) {
          issue("matching requires meta.matchingLeft (3–5 items)", ["meta", "matchingLeft"])
        }
        if (!right || (left && right.length !== left.length)) {
          issue("matching requires meta.matchingRight (same length as left)", ["meta", "matchingRight"])
        }
        const pairs = m.correctPairs
        if (pairs == null || typeof pairs !== "object" || Array.isArray(pairs)) {
          issue("matching requires meta.correctPairs { left: right }", ["meta", "correctPairs"])
        } else if (left && right) {
          const rights = new Set(right.map(norm))
          for (const l of left) {
            const r = (pairs as Record<string, unknown>)[l]
            if (typeof r !== "string" || !rights.has(norm(r))) {
              issue(`meta.correctPairs must map "${l}" to one of matchingRight`, ["meta", "correctPairs"])
            }
          }
        }
        return
      }

      case "reflection":
      case "free_response": {
        if (!q.rubric) issue(`${q.type} requires a rubric`, ["rubric"])
        else if (q.rubric.criteria.length < 3 || q.rubric.criteria.length > 5) {
          issue(`${q.type} rubric requires 3–5 criteria`, ["rubric", "criteria"])
        }
        const min = m.reflectionWordMin
        const max = m.reflectionWordMax
        if (typeof min !== "number" || typeof max !== "number" || min <= 0 || max <= min) {
          issue(`${q.type} requires meta.reflectionWordMin < meta.reflectionWordMax`, ["meta"])
        }
        if (metaStrings(m, "reflectionExpectedThemes") == null) {
          issue(`${q.type} requires meta.reflectionExpectedThemes[]`, ["meta", "reflectionExpectedThemes"])
        }
        return
      }
    }
  })

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>

/**
 * The answer strings a hint must never contain, for this question. Used by the
 * leak check at generation time and during backfill. Boolean true/false answers
 * are filtered downstream by the leak helper, so they are safe to include here.
 */
export function answerStringsForLeakCheck(q: {
  type?: TeacherQuizQuestionType
  options?: string[] | null
  correct_answer?: string | null
  reference_answer?: string | null
}): string[] {
  const out: string[] = []
  if (q.reference_answer) out.push(q.reference_answer)
  if (q.correct_answer) {
    // multiple_select packs several correct options into one comma-joined string
    for (const part of q.correct_answer.split(",")) {
      const t = part.trim()
      if (t) out.push(t)
    }
  }
  return out
}

export const generatedQuizSchema = z.object({
  questions: z.array(generatedQuestionSchema).min(1),
})

// ── Generation request (client → /api/guided-sessions/quiz/generate) ────────────

export const difficultyMixSchema = z.object({
  apprentice: z.number().int().min(0).max(50).default(0),
  scholar: z.number().int().min(0).max(50).default(0),
  master: z.number().int().min(0).max(50).default(0),
})
export type DifficultyMix = z.infer<typeof difficultyMixSchema>

export const MAX_QUIZ_QUESTIONS = 30

export const generateQuizRequestSchema = z.object({
  bookId: z.string().min(1),
  scope: z.object({
    chapterIds: z.array(z.string()).optional(),
    chapterIndexes: z.array(z.number().int().nonnegative()).optional(),
    passage: z
      .object({
        chapterId: z.string(),
        from: z.number().int().nonnegative(),
        to: z.number().int().nonnegative(),
      })
      .optional(),
  }),
  difficultyMix: difficultyMixSchema,
  types: z.array(z.enum(ALL_QUESTION_TYPES)).min(1),
  totalCount: z.number().int().min(1).max(MAX_QUIZ_QUESTIONS),
  focus: z.string().max(500).optional(),
  /** When set, regenerate a single replacement question (not persisted). */
  single: z
    .object({
      type: z.enum(ALL_QUESTION_TYPES),
      difficulty: z.enum(TEACHER_QUIZ_DIFFICULTIES),
      instruction: z.string().max(500).optional(),
    })
    .optional(),
})
export type GenerateQuizRequest = z.infer<typeof generateQuizRequestSchema>

// ── Persisted draft shape returned to the client ────────────────────────────────

export interface TeacherQuizDraftQuestion {
  id: string
  quiz_id: string
  question_type: TeacherQuizQuestionType
  question_text: string
  options: string[] | null
  correct_answer: string | null
  meta?: Record<string, unknown> | null
  explanation: string | null
  difficulty: TeacherQuizDifficulty | null
  category: QuestionCategory | null
  points: number
  max_points: number | null
  rubric: z.infer<typeof rubricSchema> | null
  reference_answer: string | null
  source_anchor: z.infer<typeof sourceAnchorSchema> | null
  hints: Hint[] | null
  distractor_eliminations: string[] | null
  sort_order: number
}

export interface TeacherQuizDraft {
  id: string
  title: string
  book_id: string | null
  difficulty: TeacherQuizDifficulty | null
  status: "draft" | "published"
  questions: TeacherQuizDraftQuestion[]
}

/**
 * Build the persisted meta jsonb for a generated question. Generated
 * short_answer is always the objective form, so its classify key
 * (`acceptedAnswers` = correct_answer + variants) is derived here.
 */
export function generatedMeta(q: GeneratedQuestion): Record<string, unknown> | null {
  const meta: Record<string, unknown> = { ...(q.meta ?? {}) }
  if (q.type === "short_answer" && q.correct_answer) {
    const variants = Array.isArray(meta.acceptedVariants)
      ? meta.acceptedVariants.map((v) => String(v))
      : []
    meta.acceptedAnswers = [q.correct_answer, ...variants]
  }
  return Object.keys(meta).length > 0 ? meta : null
}

/** Map a validated generated question to a teacher_quiz_questions row insert. */
export function generatedToRow(
  q: GeneratedQuestion,
  quizId: string,
  sortOrder: number,
): Record<string, unknown> {
  const objective = isObjectiveType(q.type) || q.type === "short_answer" // generated short_answer is keyed
  const maxPoints = q.rubric?.max_points ?? (objective ? 1 : 4)
  const items = q.meta && Array.isArray(q.meta.items) ? q.meta.items.map((i) => String(i)) : null
  return {
    quiz_id: quizId,
    question_type: q.type,
    question_text: q.prompt,
    // ordering renders from its shuffled item list — mirror meta.items into
    // options so legacy list views show the items.
    options: q.options ?? items,
    correct_answer: objective ? (q.correct_answer ?? null) : null,
    meta: generatedMeta(q),
    explanation: q.explanation ?? null,
    difficulty: q.difficulty,
    category: q.category,
    points: maxPoints,
    max_points: maxPoints,
    rubric: q.rubric ?? null,
    reference_answer: objective ? null : (q.reference_answer ?? null),
    source_anchor: q.source_anchor ?? null,
    hints: q.hints && q.hints.length > 0 ? normalizeLadder(q.hints) : null,
    distractor_eliminations:
      objective && q.distractor_eliminations?.length ? q.distractor_eliminations : null,
    sort_order: sortOrder,
  }
}
