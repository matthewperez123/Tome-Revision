/**
 * Pure teacher-quiz grading primitives — NO server-only, NO model calls.
 *
 * This module holds the deterministic, machine-checkable half of grading plus
 * the single per-response decision (`resolveResponseGrade`). It is deliberately
 * free of `server-only` and the Anthropic SDK so the invariant it encodes —
 * "a grader failure or an unkeyed question is never a graded zero" — can be
 * exercised directly by a plain test (scripts/test-teacher-quiz-grading.ts).
 *
 * The model-calling free-response grader lives in ./grade, which re-exports
 * everything here so existing `@/lib/teacher-quiz/grade` imports keep working.
 */

export interface VirgilGrade {
  score: number
  isCorrect: boolean
  feedback: string
  rubricBreakdown: { criterion: string; points: number; note: string }[]
  strengths: string[]
  improvements: string[]
  /** True when the student's answer was truncated before grading. */
  truncated: boolean
}

/** Types that carry a machine-checkable correct_answer. */
const OBJECTIVE_TYPES = new Set([
  "multiple_choice",
  "multiple_select",
  "true_false",
  "fill_blank",
  "vocabulary_in_context",
  "passage_id",
  "vocabulary",
  "short_answer",
])

/** Types that must be graded by Virgil against a rubric / reference answer. */
const OPEN_ENDED_TYPES = new Set(["free_response", "tf_with_reason"])

export function isOpenEndedType(t: string): boolean {
  return OPEN_ENDED_TYPES.has(t)
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?"'`]+$/g, "")
}

/** Pull a plain answer string out of the stored jsonb response. */
export function answerToString(response: unknown): string {
  if (response == null) return ""
  if (typeof response === "string") return response
  if (Array.isArray(response)) return response.map((r) => String(r)).join(", ")
  if (typeof response === "object") {
    const v = (response as { value?: unknown }).value
    if (Array.isArray(v)) return v.map((r) => String(r)).join(", ")
    if (v != null) return String(v)
  }
  return String(response)
}

/**
 * Grade an objective question. Returns null when the question isn't
 * machine-gradable (no correct_answer, or an open-ended type) — the caller
 * then routes it to Virgil or to teacher review.
 */
export function autoGradeObjective(
  question: { question_type: string; correct_answer: string | null; options: unknown },
  response: unknown,
): boolean | null {
  const type = question.question_type
  const correct = question.correct_answer
  if (isOpenEndedType(type)) return null
  if (!OBJECTIVE_TYPES.has(type) || correct == null || correct.trim() === "") return null

  const given = answerToString(response)
  if (type === "multiple_select") {
    const expected = new Set(correct.split(",").map((s) => norm(s)).filter(Boolean))
    const got = new Set(given.split(",").map((s) => norm(s)).filter(Boolean))
    if (expected.size !== got.size) return false
    for (const e of expected) if (!got.has(e)) return false
    return true
  }
  return norm(given) === norm(correct)
}

/** Per-question max points, defaulting sensibly by kind. */
export function questionMaxPoints(q: {
  question_type: string
  max_points: number | null
  points: number | null
}): number {
  if (q.max_points != null) return q.max_points
  if (q.points != null) return q.points
  return isOpenEndedType(q.question_type) ? 4 : 1
}

// ── Per-response grading decision ─────────────────────────────────────────────

/** The injectable free-response grader (the real one calls Opus). */
export type FreeResponseGrader = (params: {
  questionText: string
  rubric: unknown
  referenceAnswer: string | null
  maxPoints: number
  answerText: string
}) => Promise<VirgilGrade>

export interface ResolvedGrade {
  /** null while awaiting review — never a false graded verdict. */
  isCorrect: boolean | null
  /** null while awaiting review — never a phantom zero. */
  score: number | null
  gradedBy: "auto" | "virgil" | "pending"
  aiFeedback: string | null
  aiRubricBreakdown: unknown
  /** true → the caller stamps graded_at; false → leave it null (pending). */
  graded: boolean
}

/**
 * Resolve a single response to its grade. This is the ONE place the grading
 * invariants live:
 *   1. Open-ended types are never machine auto-graded.
 *   2. A free-response grader that throws (model error / unparseable) yields a
 *      PENDING result — no score, no graded_at — never a zero.
 *   3. A successful free-response grade always carries feedback + a breakdown.
 *   4. An objective type with no answer key routes to teacher review, not a 0.
 * The model call is injected so the failure path is testable without a network.
 */
export async function resolveResponseGrade(params: {
  questionType: string
  correctAnswer: string | null
  options: unknown
  questionText: string
  rubric: unknown
  referenceAnswer: string | null
  maxPoints: number
  penalty: number
  rawAnswer: unknown
  grade: FreeResponseGrader
}): Promise<ResolvedGrade> {
  const { questionType: type, maxPoints, penalty, rawAnswer } = params

  const objectiveVerdict = isOpenEndedType(type)
    ? null
    : autoGradeObjective(
        { question_type: type, correct_answer: params.correctAnswer, options: params.options },
        rawAnswer,
      )

  if (objectiveVerdict !== null) {
    const isCorrect = objectiveVerdict === true
    const score = Math.max(0, (isCorrect ? maxPoints : 0) - penalty)
    return {
      isCorrect,
      score,
      gradedBy: "auto",
      aiFeedback: null,
      aiRubricBreakdown: null,
      graded: true,
    }
  }

  if (isOpenEndedType(type)) {
    try {
      const g = await params.grade({
        questionText: params.questionText,
        rubric: params.rubric,
        referenceAnswer: params.referenceAnswer,
        maxPoints,
        answerText: answerToString(rawAnswer),
      })
      const score = Math.max(0, g.score - penalty)
      return {
        isCorrect: g.isCorrect,
        score,
        gradedBy: "virgil",
        aiFeedback: g.feedback,
        aiRubricBreakdown: g.rubricBreakdown,
        graded: true,
      }
    } catch (err) {
      // Model error or unparseable result: mark pending so the teacher grades
      // it. Never a graded zero.
      console.error("[teacher-quiz] free-response grade failed:", err)
      return {
        isCorrect: null,
        score: null,
        gradedBy: "pending",
        aiFeedback: null,
        aiRubricBreakdown: null,
        graded: false,
      }
    }
  }

  // Objective type but not machine-gradable (no correct_answer). Quiz-authoring
  // gap → route to teacher review rather than stamping a 0.
  return {
    isCorrect: null,
    score: null,
    gradedBy: "pending",
    aiFeedback: null,
    aiRubricBreakdown: null,
    graded: false,
  }
}
