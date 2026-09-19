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

import { isOpenEnded } from "@/lib/questions/classify"
import { gradeAnswer, type GradableQuestion, type GradeVerdict } from "@/lib/questions/grade"

/**
 * The canonical objective/open-ended split lives in
 * `src/lib/questions/classify.ts`. Pass `meta` where available so
 * short_answer (objective iff meta.acceptedAnswers[]) resolves correctly.
 */
export function isOpenEndedType(t: string, meta?: unknown): boolean {
  return isOpenEnded(t, meta)
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

/** Pull grade.ts extras (variants / order / pairs) out of the row's meta jsonb. */
function metaExtras(
  meta: unknown,
): Pick<GradableQuestion, "acceptedVariants" | "correctOrder" | "correctPairs"> {
  if (meta == null || typeof meta !== "object") return {}
  const m = meta as Record<string, unknown>
  const strings = (v: unknown): string[] | null =>
    Array.isArray(v) ? v.map((x) => String(x)) : null
  const pairs =
    m.correctPairs != null && typeof m.correctPairs === "object" && !Array.isArray(m.correctPairs)
      ? Object.fromEntries(
          Object.entries(m.correctPairs as Record<string, unknown>).map(([k, v]) => [k, String(v)]),
        )
      : null
  return {
    acceptedVariants: strings(m.acceptedVariants),
    correctOrder: strings(m.correctOrder),
    correctPairs: pairs,
  }
}

/** Serialize the stored jsonb response into the grader's wire format. */
function responseToWire(type: string, response: unknown): string {
  if (typeof response === "string") return response
  // ordering / matching grade against JSON — preserve structure, don't flatten.
  if ((type === "ordering" || type === "matching") && response != null && typeof response === "object") {
    return JSON.stringify(response)
  }
  return answerToString(response)
}

/** The shared 16-type verdict for a teacher-quiz row (pending = not machine-gradable). */
export function gradeObjectiveVerdict(
  question: {
    question_type: string
    correct_answer: string | null
    meta?: unknown
  },
  response: unknown,
): GradeVerdict {
  return gradeAnswer(
    {
      type: question.question_type,
      correctAnswer: question.correct_answer,
      meta: question.meta,
      ...metaExtras(question.meta),
    },
    responseToWire(question.question_type, response),
  )
}

/**
 * Grade an objective question. Returns null when the question isn't
 * machine-gradable (no correct_answer, or an open-ended type) — the caller
 * then routes it to Virgil or to teacher review. Boolean-only view of
 * `gradeObjectiveVerdict` (partial credit reads as not-correct).
 */
export function autoGradeObjective(
  question: {
    question_type: string
    correct_answer: string | null
    options: unknown
    meta?: unknown
  },
  response: unknown,
): boolean | null {
  const v = gradeObjectiveVerdict(question, response)
  return v.kind === "pending" ? null : v.correct
}

/** Per-question max points, defaulting sensibly by kind. */
export function questionMaxPoints(q: {
  question_type: string
  max_points: number | null
  points: number | null
  meta?: unknown
}): number {
  if (q.max_points != null) return q.max_points
  if (q.points != null) return q.points
  return isOpenEndedType(q.question_type, q.meta) ? 4 : 1
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
  /** Question meta jsonb — drives short_answer objective/open classification. */
  meta?: unknown
}): Promise<ResolvedGrade> {
  const { questionType: type, maxPoints, penalty, rawAnswer, meta } = params

  const verdict = isOpenEndedType(type, meta)
    ? null
    : gradeObjectiveVerdict(
        { question_type: type, correct_answer: params.correctAnswer, meta },
        rawAnswer,
      )

  if (verdict && verdict.kind === "graded") {
    // credit ∈ {0, 0.5, 1} — tf_with_reason's boolean-alone half credit lands
    // here (score columns are numeric(6,2) since the 3.1 migration).
    const score = Math.max(0, verdict.credit * maxPoints - penalty)
    return {
      isCorrect: verdict.correct,
      score,
      gradedBy: "auto",
      aiFeedback: null,
      aiRubricBreakdown: null,
      graded: true,
    }
  }

  if (isOpenEndedType(type, meta)) {
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
