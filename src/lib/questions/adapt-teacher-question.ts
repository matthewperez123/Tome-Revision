/**
 * Adapt a teacher_quiz_questions row into the engine `Question` shape the
 * shared trial renderers (`src/components/trials/questions`) consume — the
 * same adapter contract `src/lib/db-chapter-questions.ts` implements for the
 * platform `questions` table.
 *
 * Two halves, both pure (safe on server and client):
 *  - `sanitizePresentationMeta` runs SERVER-SIDE (getQuizForAttempt) and
 *    strips every answer-key field out of the question's meta jsonb before it
 *    ships. Keys, accepted answers, correct order/pairs, and the correct
 *    reason index NEVER reach the student client — grading is authoritative
 *    in `submitQuizAttempt`.
 *  - `adaptTeacherQuestion` runs CLIENT-SIDE (quiz-attempt-runner) and maps
 *    the sanitized row onto `Question` with `correct_answer: ""` so renderers
 *    can present the interaction (they only reveal feedback when `answered`,
 *    which the runner never sets before submit).
 */

import type { Question, QuestionType } from "@/lib/quiz-engine"

/** meta jsonb keys that are safe to present to the student. */
const PRESENTATION_META_KEYS = [
  "citation",
  "passage",
  "passageHighlight",
  "items",
  "matchingLeft",
  "matchingRight",
  "vocabWord",
  "etymology",
  "crossRefBookId",
  "crossRefLabel",
  "tfReasons",
  "reflectionPrompt",
  "reflectionWordMin",
  "reflectionWordMax",
  "reflectionRubric",
  "identificationSubject",
] as const

/**
 * Keep only presentation-safe meta keys. Everything else — acceptedAnswers,
 * acceptedVariants, correctOrder, correctPairs, tfCorrectReason,
 * reflectionExpectedThemes, and any future key — is dropped by default.
 */
export function sanitizePresentationMeta(meta: unknown): Record<string, unknown> | null {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) return null
  const m = meta as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const key of PRESENTATION_META_KEYS) {
    if (m[key] != null) out[key] = m[key]
  }
  return Object.keys(out).length > 0 ? out : null
}

/** The renderable subset of a teacher_quiz_questions row (post-sanitize). */
export interface TeacherAttemptQuestionRow {
  id: string
  question_type: string
  question_text: string
  options: string[] | null
  sort_order: number
  /** Presentation-safe meta (already through sanitizePresentationMeta). */
  meta?: Record<string, unknown> | null
}

const OPEN_PROMPT_TYPES = new Set(["reflection", "free_response"])

function strings(v: unknown): string[] | null {
  return Array.isArray(v) ? v.map((x) => String(x)) : null
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined
}

/**
 * Map a sanitized teacher question row to the engine `Question` shape.
 * `correct_answer` is always "" — keys never ship; the server grades.
 */
export function adaptTeacherQuestion(row: TeacherAttemptQuestionRow): Question {
  const meta = row.meta ?? {}
  const type = row.question_type as QuestionType

  // Ordering renders from `options` (the shuffled item list): prefer
  // meta.items, fall back to stored options. true_false renders a fixed pair.
  let options = row.options ?? []
  if (type === "ordering") options = strings(meta.items) ?? options
  if (type === "true_false" && options.length === 0) options = ["true", "false"]

  const highlight = Array.isArray(meta.passageHighlight) &&
    meta.passageHighlight.length === 2 &&
    typeof meta.passageHighlight[0] === "number" &&
    typeof meta.passageHighlight[1] === "number"
      ? ([meta.passageHighlight[0], meta.passageHighlight[1]] as [number, number])
      : null

  const identificationSubject = str(meta.identificationSubject)

  return {
    id: row.id,
    quiz_id: "",
    type,
    prompt: row.question_text,
    options,
    correct_answer: "",
    explanation: null,
    order: row.sort_order,
    citation: str(meta.citation) ?? null,
    passage: str(meta.passage) ?? null,
    passageHighlight: highlight,
    matchingLeft: strings(meta.matchingLeft) ?? undefined,
    matchingRight: strings(meta.matchingRight) ?? undefined,
    vocabWord: str(meta.vocabWord),
    etymology: str(meta.etymology),
    crossRefBookId: str(meta.crossRefBookId),
    crossRefLabel: str(meta.crossRefLabel),
    tfReasons: strings(meta.tfReasons) ?? undefined,
    reflectionPrompt:
      str(meta.reflectionPrompt) ??
      (OPEN_PROMPT_TYPES.has(type) ? row.question_text : undefined),
    reflectionWordMin: num(meta.reflectionWordMin),
    reflectionWordMax: num(meta.reflectionWordMax),
    reflectionRubric: str(meta.reflectionRubric),
    identificationSubject:
      identificationSubject === "speaker" ||
      identificationSubject === "book" ||
      identificationSubject === "character"
        ? identificationSubject
        : undefined,
  }
}

/**
 * Types whose renderer presents the prompt itself (inline blank, passage
 * framing, assistant framing) — the host should not repeat the heading.
 * Mirrors the chapter-quiz-overlay set, plus the teacher-only types.
 */
export const RENDERER_OWNS_PROMPT = new Set<string>([
  "fill_blank",
  "short_answer",
  "passage_id",
  "close_reading",
  "vocabulary_in_context",
  "reflection",
  "free_response",
])
