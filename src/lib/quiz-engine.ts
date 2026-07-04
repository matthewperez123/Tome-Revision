// ─────────────────────────────────────────────
// Tome Trials Engine — State Manager
// Supports all question types declared in chapter-questions.ts.
// Quizzes are ungated: a wrong answer never ends or pauses the attempt.
// ─────────────────────────────────────────────

import type { QuizDifficulty } from "@/lib/book-progress"
import type { Hint } from "@/lib/quiz-hints"

// ── Types ──────────────────────────────────────

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "fill_blank"
  | "passage_id"
  | "theme_analysis"
  | "ordering"
  | "matching"
  | "vocabulary_in_context"
  | "cross_reference"
  | "close_reading"
  | "reflection"
  | "identification"
  | "tf_with_reason"

export type Question = {
  id: string
  quiz_id: string
  type: QuestionType
  prompt: string
  options: string[]
  correct_answer: string
  explanation: string | null
  order: number
  /** Serialized extras (JSON) — used by non-MC types */
  meta?: string
  difficulty?: QuizDifficulty
  citation?: string | null
  passage?: string | null
  passageHighlight?: [number, number] | null
  acceptedVariants?: string[]
  correctPairs?: Record<string, string>
  matchingLeft?: string[]
  matchingRight?: string[]
  correctOrder?: string[]
  vocabWord?: string
  etymology?: string
  crossRefBookId?: string
  crossRefLabel?: string
  /** Reflection (Virgil-graded). Engine treats response as always "correct"; the
   *  numeric grade lives on the attempt, not on the question result. */
  reflectionPrompt?: string
  reflectionWordMin?: number
  reflectionWordMax?: number
  reflectionRubric?: string
  reflectionExpectedThemes?: string[]
  /** For identification — what the prompt is asking the user to name. */
  identificationSubject?: "speaker" | "book" | "character"
  /** For tf_with_reason — list of follow-up reasons; user picks one. */
  tfReasons?: string[]
  /** For tf_with_reason — index into `tfReasons` of the correct reason. */
  tfCorrectReason?: number
  /** Progressive hint ladder (leak-checked at authoring time). */
  hints?: Hint[]
  /** MC-only incorrect option texts safe to grey out, in reveal order. */
  distractorEliminations?: string[]
}

export type Quiz = {
  id: string
  book_id: string
  title: string
  difficulty: string | null
}

export type QuizState = {
  quiz: Quiz
  questions: Question[]
  currentIndex: number
  score: number
  answers: (string | null)[]
  results: ("correct" | "wrong" | null)[]
  status: "idle" | "active" | "review" | "complete"
  timerSeconds: number | null
  timeRemaining: number
  startedAt: number
  endedAt: number | null
  /** Virgil-grade outputs for reflection questions, keyed by question id.
   *  Populated asynchronously by the placeholder grader server action. */
  reflectionGrades?: Record<string, { score: number; feedback: string; status: "pending" | "graded" | "failed" }>
}

export type QuizAction =
  | { type: "START"; timerSeconds?: number }
  | { type: "ANSWER"; answer: string }
  | { type: "NEXT" }
  | { type: "TICK" }
  | { type: "FINISH" }
  | ReflectionGradeAction

// ── Pass threshold ─────────────────────────────

export const TRIAL_PASS_THRESHOLD = 60 // percent

// ── Initial State ──────────────────────────────

export function createQuizState(
  quiz: Quiz,
  questions: Question[]
): QuizState {
  return {
    quiz,
    questions: [...questions].sort((a, b) => a.order - b.order),
    currentIndex: 0,
    score: 0,
    answers: new Array(questions.length).fill(null),
    results: new Array(questions.length).fill(null),
    status: "idle",
    timerSeconds: null,
    timeRemaining: 0,
    startedAt: Date.now(),
    endedAt: null,
    reflectionGrades: {},
  }
}

// ── Reflection grading actions ─────────────────
export type ReflectionGradeAction =
  | { type: "REFLECTION_PENDING"; questionId: string }
  | { type: "REFLECTION_GRADED"; questionId: string; score: number; feedback: string }
  | { type: "REFLECTION_FAILED"; questionId: string }

// ── Answer Checking ────────────────────────────

function norm(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ")
}

export function checkAnswer(question: Question, answer: string): boolean {
  const q = question
  const given = norm(answer)

  switch (q.type) {
    case "multiple_choice":
    case "true_false":
    case "passage_id":
    case "theme_analysis":
    case "vocabulary_in_context":
    case "cross_reference":
    case "close_reading":
    case "identification":
    case "tf_with_reason": {
      // All option/exact-match types — including identification (the chosen
      // option text) and tf_with_reason (the composite "<bool>|<reasonIndex>"
      // string the renderer commits). Compared verbatim against correct_answer.
      return given === norm(q.correct_answer)
    }

    case "fill_blank": {
      const accepted = [q.correct_answer, ...(q.acceptedVariants ?? [])].map(norm)
      return accepted.includes(given)
    }

    case "ordering": {
      // `answer` is a JSON array of strings representing the user's order.
      try {
        const userOrder = (JSON.parse(answer) as string[]).map(norm)
        const correctOrder = (q.correctOrder ?? []).map(norm)
        if (userOrder.length !== correctOrder.length) return false
        return userOrder.every((item, i) => item === correctOrder[i])
      } catch {
        return false
      }
    }

    case "matching": {
      // `answer` is a JSON object: { [left]: right }
      try {
        const given = JSON.parse(answer) as Record<string, string>
        const correct = q.correctPairs ?? {}
        const keys = Object.keys(correct)
        if (keys.length === 0) return false
        return keys.every((k) => norm(given[k] ?? "") === norm(correct[k]))
      } catch {
        return false
      }
    }

    case "reflection": {
      // Virgil-graded asynchronously; the engine accepts any response that
      // meets the minimum word threshold.
      const min = q.reflectionWordMin ?? 30
      const wc = answer.trim().split(/\s+/).filter(Boolean).length
      return wc >= min
    }

    default:
      return false
  }
}

// ── Reducer ────────────────────────────────────

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START": {
      return {
        ...state,
        status: "active",
        timerSeconds: action.timerSeconds ?? null,
        timeRemaining: action.timerSeconds ?? 0,
        startedAt: Date.now(),
      }
    }

    case "ANSWER": {
      if (state.status !== "active") return state
      const question = state.questions[state.currentIndex]
      if (!question) return state

      const isCorrect = checkAnswer(question, action.answer)
      const answers = [...state.answers]
      const results = [...state.results]
      answers[state.currentIndex] = action.answer
      results[state.currentIndex] = isCorrect ? "correct" : "wrong"

      const score = isCorrect ? state.score + 1 : state.score

      const isLast = state.currentIndex === state.questions.length - 1
      const nextStatus: QuizState["status"] = isLast ? "review" : "active"
      const endedAt: number | null = isLast ? Date.now() : state.endedAt

      return {
        ...state,
        answers,
        results,
        score,
        status: nextStatus,
        endedAt,
      }
    }

    case "NEXT": {
      if (state.currentIndex >= state.questions.length - 1) {
        return { ...state, status: "complete", endedAt: Date.now() }
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        status: "active",
      }
    }

    case "TICK": {
      if (!state.timerSeconds || state.status !== "active") return state
      const timeRemaining = Math.max(0, state.timeRemaining - 1)
      if (timeRemaining === 0) {
        return { ...state, timeRemaining: 0, status: "review", endedAt: Date.now() }
      }
      return { ...state, timeRemaining }
    }

    case "FINISH": {
      return { ...state, status: "complete", endedAt: state.endedAt ?? Date.now() }
    }

    case "REFLECTION_PENDING": {
      return {
        ...state,
        reflectionGrades: {
          ...(state.reflectionGrades ?? {}),
          [action.questionId]: { score: 0, feedback: "", status: "pending" },
        },
      }
    }

    case "REFLECTION_GRADED": {
      return {
        ...state,
        reflectionGrades: {
          ...(state.reflectionGrades ?? {}),
          [action.questionId]: {
            score: action.score,
            feedback: action.feedback,
            status: "graded",
          },
        },
      }
    }

    case "REFLECTION_FAILED": {
      return {
        ...state,
        reflectionGrades: {
          ...(state.reflectionGrades ?? {}),
          [action.questionId]: { score: 0, feedback: "", status: "failed" },
        },
      }
    }

    default:
      return state
  }
}

// ── Summary Helpers ────────────────────────────

export function getQuizSummary(state: QuizState) {
  const total = state.questions.length
  const answered = state.answers.filter((a) => a !== null).length
  const correct = state.results.filter((r) => r === "correct").length
  const wrong = state.results.filter((r) => r === "wrong").length
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
  const perfect = total > 0 && correct === total
  const passed = percentage >= TRIAL_PASS_THRESHOLD
  const elapsedMs = (state.endedAt ?? Date.now()) - state.startedAt

  return {
    total,
    answered,
    correct,
    wrong,
    percentage,
    passed,
    perfect,
    elapsedMs,
  }
}

export function formatElapsed(ms: number): string {
  const seconds = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`
}
