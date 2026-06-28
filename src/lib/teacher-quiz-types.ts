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

export const OBJECTIVE_QUESTION_TYPES = [
  "multiple_choice",
  "multiple_select",
  "true_false",
  "fill_blank",
  "vocabulary_in_context",
] as const

export const OPEN_ENDED_QUESTION_TYPES = [
  "short_answer",
  "free_response",
  "tf_with_reason",
] as const

export const ALL_QUESTION_TYPES = [
  ...OBJECTIVE_QUESTION_TYPES,
  ...OPEN_ENDED_QUESTION_TYPES,
] as const

export type ObjectiveQuestionType = (typeof OBJECTIVE_QUESTION_TYPES)[number]
export type OpenEndedQuestionType = (typeof OPEN_ENDED_QUESTION_TYPES)[number]
export type TeacherQuizQuestionType = (typeof ALL_QUESTION_TYPES)[number]

export const QUESTION_TYPE_LABELS: Record<TeacherQuizQuestionType, string> = {
  multiple_choice: "Multiple choice",
  multiple_select: "Multiple select",
  true_false: "True / False",
  fill_blank: "Fill the blank",
  vocabulary_in_context: "Vocabulary in context",
  short_answer: "Short answer",
  free_response: "Free response",
  tf_with_reason: "True/False with reason",
}

export function isObjectiveType(t: TeacherQuizQuestionType): t is ObjectiveQuestionType {
  return (OBJECTIVE_QUESTION_TYPES as readonly string[]).includes(t)
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

export const generatedQuestionSchema = z
  .object({
    type: z.enum(ALL_QUESTION_TYPES),
    difficulty: z.enum(TEACHER_QUIZ_DIFFICULTIES),
    category: z.enum(QUESTION_CATEGORIES),
    prompt: z.string().min(1),
    options: z.array(z.string().min(1)).optional(),
    /**
     * For objective types: the literal correct option text (or a comma-joined
     * list for multiple_select). Required for objective, omitted for open-ended.
     */
    correct_answer: z.string().optional(),
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
    const objective = isObjectiveType(q.type)
    if (objective) {
      if (!q.correct_answer) {
        ctx.addIssue({ code: "custom", message: `${q.type} requires correct_answer`, path: ["correct_answer"] })
      }
      const needsOptions =
        q.type === "multiple_choice" ||
        q.type === "multiple_select" ||
        q.type === "vocabulary_in_context"
      if (needsOptions && (!q.options || q.options.length < 2)) {
        ctx.addIssue({ code: "custom", message: `${q.type} requires at least 2 options`, path: ["options"] })
      }
      if (q.type === "true_false") {
        const v = q.correct_answer?.toLowerCase()
        if (v !== "true" && v !== "false") {
          ctx.addIssue({ code: "custom", message: "true_false correct_answer must be 'true' or 'false'", path: ["correct_answer"] })
        }
      }
    } else {
      // open-ended types need a rubric to be Virgil-gradable
      if (!q.rubric) {
        ctx.addIssue({ code: "custom", message: `${q.type} requires a rubric`, path: ["rubric"] })
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

/** Map a validated generated question to a teacher_quiz_questions row insert. */
export function generatedToRow(
  q: GeneratedQuestion,
  quizId: string,
  sortOrder: number,
): Record<string, unknown> {
  const objective = isObjectiveType(q.type)
  const maxPoints = q.rubric?.max_points ?? (objective ? 1 : 4)
  return {
    quiz_id: quizId,
    question_type: q.type,
    question_text: q.prompt,
    options: q.options ?? null,
    correct_answer: objective ? (q.correct_answer ?? null) : null,
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
