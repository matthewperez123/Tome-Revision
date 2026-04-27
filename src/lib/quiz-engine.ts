// ─────────────────────────────────────────────
// Tome Trials Engine — State Manager
// Supports all 10 question types declared in chapter-questions.ts.
// Wisdom rewards are tier-scaled: Apprentice 5, Scholar 10, Master 15
// per correct answer.
// ─────────────────────────────────────────────

import { COIN_REWARDS } from "@/lib/economy"
import type { QuizDifficulty } from "@/lib/book-progress"

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
  hearts: number
  xpEarned: number
  coinsEarned: number
  answers: (string | null)[]
  results: ("correct" | "wrong" | null)[]
  /** Incremented when hearts-zero pause resumes. Used to key UI remounts. */
  resumeCount: number
  status: "idle" | "active" | "review" | "paused" | "complete"
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
  | { type: "RESUME" }
  | { type: "FINISH" }
  | ReflectionGradeAction

// ── Wisdom scaling ──────────────────────────────

export const WISDOM_PER_CORRECT: Record<QuizDifficulty, number> = {
  Apprentice: 5,
  Scholar: 10,
  Master: 15,
}

export const TRIAL_PASS_THRESHOLD = 60 // percent

export function wisdomForQuestion(q: Question): number {
  return WISDOM_PER_CORRECT[q.difficulty ?? "Apprentice"] ?? 5
}

// ── Initial State ──────────────────────────────

export function createQuizState(
  quiz: Quiz,
  questions: Question[],
  hearts: number
): QuizState {
  return {
    quiz,
    questions: [...questions].sort((a, b) => a.order - b.order),
    currentIndex: 0,
    score: 0,
    hearts,
    xpEarned: 0,
    coinsEarned: 0,
    answers: new Array(questions.length).fill(null),
    results: new Array(questions.length).fill(null),
    resumeCount: 0,
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
    case "close_reading": {
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
      // meets the minimum word threshold so the user isn't penalised hearts.
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

      let { score, hearts, xpEarned, coinsEarned } = state

      if (isCorrect) {
        score++
        xpEarned += wisdomForQuestion(question)
        coinsEarned += COIN_REWARDS.quiz_correct
      } else {
        hearts = Math.max(0, hearts - 1)
      }

      const isLast = state.currentIndex === state.questions.length - 1
      const outOfHearts = hearts === 0

      let nextStatus: QuizState["status"] = "active"
      let endedAt: number | null = state.endedAt
      if (isLast) {
        nextStatus = "review"
        endedAt = Date.now()
      } else if (outOfHearts) {
        // Pause instead of ending — player can resume after refill / regen.
        nextStatus = "paused"
      }

      return {
        ...state,
        answers,
        results,
        score,
        hearts,
        xpEarned,
        coinsEarned,
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

    case "RESUME": {
      if (state.status !== "paused") return state
      return {
        ...state,
        status: "active",
        // Refill handled by caller updating `hearts` externally; if hearts are
        // still 0, the next wrong answer will pause again immediately.
        resumeCount: state.resumeCount + 1,
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
    xpEarned: state.xpEarned,
    coinsEarned: state.coinsEarned,
    heartsLost: state.results.filter((r) => r === "wrong").length,
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
