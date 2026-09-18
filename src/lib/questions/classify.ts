/**
 * The ONE question-type vocabulary and objective/open-ended classification.
 *
 * Phase 3 unifies the platform bank (`questions`), the teacher stack
 * (`teacher_quiz_questions`) and the reader trials on these 16 canonical types
 * (migration 20260918030000_question_types_unified.sql widens both DB checks
 * to exactly this list). Client-safe: no server imports, no zod.
 *
 * Classification rules (settled — encode here, nowhere else):
 *  - `free_response` and `reflection` are ALWAYS open-ended (rubric-graded).
 *  - `short_answer` is objective when `meta.acceptedAnswers[]` is present
 *    (graded by normalized match against the list); otherwise open-ended.
 *  - `tf_with_reason` is OBJECTIVE: its key is the composite
 *    `"<bool>|<reasonIndex>"`; both parts must match for full credit and the
 *    boolean alone earns half credit (implemented in the shared grader).
 *  - Every other type carries a machine-checkable key and is objective.
 */

export const CANONICAL_QUESTION_TYPES = [
  // The 13 platform types
  "multiple_choice",
  "true_false",
  "fill_blank",
  "vocabulary_in_context",
  "passage_id",
  "matching",
  "ordering",
  "close_reading",
  "tf_with_reason",
  "theme_analysis",
  "cross_reference",
  "reflection",
  "identification",
  // The 3 teacher-stack additions
  "multiple_select",
  "short_answer",
  "free_response",
] as const

export type CanonicalQuestionType = (typeof CANONICAL_QUESTION_TYPES)[number]

export function isCanonicalQuestionType(t: string): t is CanonicalQuestionType {
  return (CANONICAL_QUESTION_TYPES as readonly string[]).includes(t)
}

/** Types that are open-ended regardless of meta. */
export const ALWAYS_OPEN_ENDED_TYPES = ["free_response", "reflection"] as const

/** The subset of question meta that classification reads. */
export interface ClassifiableMeta {
  /** short_answer: normalized-match answer key. Present → objective. */
  acceptedAnswers?: unknown
}

/** Extract a clean acceptedAnswers list from a meta jsonb value (or []). */
export function acceptedAnswersFrom(meta: unknown): string[] {
  if (meta == null || typeof meta !== "object") return []
  const raw = (meta as ClassifiableMeta).acceptedAnswers
  if (!Array.isArray(raw)) return []
  return raw.map((a) => String(a).trim()).filter(Boolean)
}

/**
 * Is this question graded by a rubric (Virgil / teacher review) rather than a
 * machine key? Pass the question's `meta` so short_answer resolves correctly;
 * without meta, short_answer defaults to open-ended.
 */
export function isOpenEnded(type: string, meta?: unknown): boolean {
  if ((ALWAYS_OPEN_ENDED_TYPES as readonly string[]).includes(type)) return true
  if (type === "short_answer") return acceptedAnswersFrom(meta).length === 0
  return false
}

/** Machine-gradable counterpart of {@link isOpenEnded}. */
export function isObjective(type: string, meta?: unknown): boolean {
  return isCanonicalQuestionType(type) && !isOpenEnded(type, meta)
}
