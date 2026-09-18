/**
 * The ONE deterministic grader for all 16 canonical question types.
 * Pure — no I/O, no server imports, no model calls. Both the platform trial
 * engine (`src/lib/quiz-engine.ts`) and the teacher stack
 * (`src/lib/teacher-quiz/objective.ts`) grade through this module.
 *
 * Verdicts:
 *  - `{ kind: "graded", correct, credit }` — machine-keyed. `credit` is the
 *    fraction of the question's points earned (0, 0.5 or 1). The only partial
 *    today: tf_with_reason awards 0.5 when the boolean matches but the chosen
 *    reason does not.
 *  - `{ kind: "pending" }` — open-ended (free_response, reflection,
 *    short_answer without an answer key): must go to the Virgil rubric grader
 *    or teacher review. NEVER convert pending into a zero.
 *
 * Answer wire formats (what the renderers commit):
 *  - option types / true_false / fill_blank / short_answer: the plain string
 *  - multiple_select: comma-joined selected option texts
 *  - tf_with_reason: composite "<bool>|<reasonIndex>"
 *  - ordering: JSON array of item strings in the user's order
 *  - matching: JSON object { [left]: right }
 */

import { acceptedAnswersFrom, isOpenEnded } from "@/lib/questions/classify"

export interface GradableQuestion {
  type: string
  correctAnswer: string | null
  /** fill_blank: additional accepted spellings/phrasings. */
  acceptedVariants?: string[] | null
  /** ordering: the correct sequence of item strings. */
  correctOrder?: string[] | null
  /** matching: { [left]: right } answer key. */
  correctPairs?: Record<string, string> | null
  /** reflection/free_response: minimum word count for a submittable answer. */
  reflectionWordMin?: number | null
  /** meta jsonb (drives short_answer's objective form via acceptedAnswers). */
  meta?: unknown
}

export type GradeVerdict =
  | { kind: "graded"; correct: boolean; credit: number }
  | { kind: "pending" }

export function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?"'`]+$/g, "")
}

const graded = (credit: number): GradeVerdict => ({
  kind: "graded",
  correct: credit === 1,
  credit,
})

/** Word-count acceptance for open types before the rubric grade lands. */
export function meetsWordMinimum(answer: string, min: number | null | undefined): boolean {
  const wc = answer.trim().split(/\s+/).filter(Boolean).length
  return wc >= (min ?? 30)
}

export function gradeAnswer(q: GradableQuestion, answer: string): GradeVerdict {
  const type = q.type
  const key = q.correctAnswer

  // short_answer's objective form: normalized match against acceptedAnswers.
  if (type === "short_answer") {
    const accepted = acceptedAnswersFrom(q.meta).map(norm)
    if (accepted.length === 0) return { kind: "pending" }
    return graded(accepted.includes(norm(answer)) ? 1 : 0)
  }

  if (isOpenEnded(type, q.meta)) return { kind: "pending" }

  if (key == null || key.trim() === "") return { kind: "pending" }
  const given = norm(answer)

  switch (type) {
    case "multiple_choice":
    case "true_false":
    case "passage_id":
    case "theme_analysis":
    case "vocabulary_in_context":
    case "cross_reference":
    case "close_reading":
    case "identification":
      // Option / exact-match types: the chosen option text vs correct_answer.
      return graded(given === norm(key) ? 1 : 0)

    case "tf_with_reason": {
      // Composite "<bool>|<reasonIndex>": both parts → 1; bool alone → 0.5.
      // A legacy bool-only key degrades to plain equality.
      if (!key.includes("|")) return graded(given === norm(key) ? 1 : 0)
      const [wantBool, wantReason] = key.split("|").map((s) => norm(s))
      const [gotBool, gotReason = ""] = answer.split("|").map((s) => norm(s))
      if (gotBool !== wantBool) return graded(0)
      return graded(gotReason === wantReason ? 1 : 0.5)
    }

    case "multiple_select": {
      const expected = new Set(key.split(",").map(norm).filter(Boolean))
      const got = new Set(answer.split(",").map(norm).filter(Boolean))
      if (expected.size !== got.size) return graded(0)
      for (const e of expected) if (!got.has(e)) return graded(0)
      return graded(1)
    }

    case "fill_blank": {
      const accepted = [key, ...(q.acceptedVariants ?? [])].map(norm)
      return graded(accepted.includes(given) ? 1 : 0)
    }

    case "ordering": {
      try {
        const userOrder = (JSON.parse(answer) as string[]).map(norm)
        const correctOrder = (q.correctOrder ?? []).map(norm)
        if (correctOrder.length === 0 || userOrder.length !== correctOrder.length) {
          return graded(0)
        }
        return graded(userOrder.every((item, i) => item === correctOrder[i]) ? 1 : 0)
      } catch {
        return graded(0)
      }
    }

    case "matching": {
      try {
        const givenPairs = JSON.parse(answer) as Record<string, string>
        const correct = q.correctPairs ?? {}
        const keys = Object.keys(correct)
        if (keys.length === 0) return graded(0)
        return graded(keys.every((k) => norm(givenPairs[k] ?? "") === norm(correct[k])) ? 1 : 0)
      } catch {
        return graded(0)
      }
    }

    default:
      // Unknown type: never silently grade — route to review.
      return { kind: "pending" }
  }
}
