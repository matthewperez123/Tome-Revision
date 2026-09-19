"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Clock, Send, Sparkles, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  getQuizForAttempt,
  submitQuizAttempt,
  type AttemptQuiz,
  type AttemptResult,
} from "@/lib/actions/teacher-quizzes"
import { IRIDESCENT } from "@/lib/semester-plan/rubric"
import { useActivityBeacon } from "@/hooks/use-activity-beacon"
import { useReducedMotion } from "framer-motion"
import { QUESTION_RENDERERS } from "@/components/trials/questions"
import {
  adaptTeacherQuestion,
  RENDERER_OWNS_PROMPT,
} from "@/lib/questions/adapt-teacher-question"
import { ShortAnswer } from "@/components/trials/questions/ShortAnswer"

/**
 * The single teacher-quiz take engine, reused wherever a student answers a
 * teacher quiz: the standalone classroom quiz page and the end-of-reading
 * quiz in the scoped assignment reader. Answer keys never reach the client —
 * every attempt is graded authoritatively server-side by `submitQuizAttempt`
 * (objective auto-grade + free-response Tome Assistant review), so this component only
 * renders question cards, collects answers, and shows the returned result.
 *
 * Every question renders through the shared trial renderer registry
 * (`QUESTION_RENDERERS`), the same components the reader's chapter trials
 * use — one renderer per canonical type, everywhere. Renderers are mounted
 * with `answered=false` for the whole attempt (no per-question feedback;
 * grading is server-authoritative on submit), so students can revise any
 * answer until they submit the quiz.
 */
export function QuizAttemptRunner({
  quizId,
  classroomId,
  backHref,
  embedded = false,
  onComplete,
}: {
  quizId: string
  classroomId: string
  /** Where "Back" links point (standalone page). Omit when embedded. */
  backHref?: string
  /** Drop the page chrome (outer container + back nav) for in-reader use. */
  embedded?: boolean
  onComplete?: (result: AttemptResult) => void
}) {
  const [quiz, setQuiz] = useState<AttemptQuiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<AttemptResult | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const startedAtRef = useRef<string>("")
  const reduced = useReducedMotion() ?? false

  useEffect(() => {
    let active = true
    getQuizForAttempt(quizId, classroomId).then((res) => {
      if (!active) return
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      setQuiz(res.data)
      startedAtRef.current = res.data.startedAt
      if (res.data.time_limit_minutes) setRemaining(res.data.time_limit_minutes * 60)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [quizId, classroomId])

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return
    setSubmitting(true)
    const hints: Record<string, { used: number; maxLevel: number }> = {}
    for (const q of quiz.questions) {
      if (revealedHints[q.id] && q.hints.length > 0) {
        hints[q.id] = { used: 1, maxLevel: q.hints[0].level }
      }
    }
    const res = await submitQuizAttempt({
      quizId,
      classroomId,
      startedAt: startedAtRef.current,
      answers,
      hints,
    })
    setSubmitting(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    setResult(res.data)
    onComplete?.(res.data)
    toast.success("Quiz submitted")
  }, [quiz, submitting, revealedHints, quizId, classroomId, answers, onComplete])

  // Countdown + auto-submit at zero.
  useEffect(() => {
    if (remaining == null || result) return
    if (remaining <= 0) {
      void handleSubmit()
      return
    }
    const t = setTimeout(() => setRemaining((r) => (r == null ? r : r - 1)), 1000)
    return () => clearTimeout(t)
  }, [remaining, result, handleSubmit])

  const answered = useMemo(
    () => (quiz ? quiz.questions.filter((q) => hasAnswer(answers[q.id])).length : 0),
    [quiz, answers],
  )

  // Beacon quiz-takers to the teacher's Lectern while the attempt is open.
  useActivityBeacon({
    classroomId: quiz && !result ? classroomId : null,
    surface: "quiz",
    assignmentId: null,
    detail: quiz?.title ?? null,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{error ?? "Quiz not found."}</p>
        {backHref && (
          <Link href={backHref} className="mt-3 inline-block text-sm text-[#2A4B8D] hover:underline">
            Back to class
          </Link>
        )}
      </div>
    )
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#2E7D6F]/10">
          <Check className="size-8 text-[#2E7D6F]" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">
          {result.percentage}% <span className="text-muted-foreground">({result.score}/{result.totalPoints})</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.passed ? "Passed" : "Below passing"}
          {result.pendingCount > 0
            ? ` · ${result.pendingCount} answer${result.pendingCount === 1 ? "" : "s"} awaiting review — your score covers graded questions only`
            : result.needsReview
              ? " · Free-response answers await your teacher's review"
              : ""}
        </p>
        {backHref && (
          <Link
            href={backHref}
            className="mt-6 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
          >
            Back to class
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className={embedded ? "" : "mx-auto max-w-2xl px-4 py-8"}>
      {!embedded && (
        <div className="flex items-center justify-between">
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Back
            </Link>
          ) : (
            <span />
          )}
          {remaining != null && (
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium tabular-nums ${
                remaining <= 30 ? "bg-red-50 text-red-600 dark:bg-red-950/30" : "bg-muted text-muted-foreground"
              }`}
            >
              <Clock className="size-4" />
              {fmt(remaining)}
            </span>
          )}
        </div>
      )}

      <h1 className={`text-xl font-bold ${embedded ? "" : "mt-4"}`}>{quiz.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {answered} of {quiz.questions.length} answered · passing {quiz.passing_score}%
        {embedded && remaining != null ? ` · ${fmt(remaining)} left` : ""}
      </p>

      {quiz.priorResult && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
          You scored {quiz.priorResult.percentage}% previously. Submitting again replaces that attempt.
        </div>
      )}

      <div className="mt-6 space-y-6">
        {quiz.questions.map((q, idx) => {
          const adapted = adaptTeacherQuestion(q)
          // Registry lookup with a text-entry fallback for any unknown type —
          // never silently drop a question the teacher authored.
          const Renderer = QUESTION_RENDERERS[adapted.type] ?? ShortAnswer
          const recorded = hasAnswer(answers[q.id])
          return (
          <div key={q.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-xs font-semibold text-muted-foreground">{idx + 1}.</span>
              {RENDERER_OWNS_PROMPT.has(adapted.type) ? (
                <span className="sr-only">{q.question_text}</span>
              ) : (
                <p className="flex-1 font-serif text-base leading-relaxed">{q.question_text}</p>
              )}
              {recorded && (
                <span className="ml-auto flex items-center gap-1 rounded-full bg-[#2E7D6F]/10 px-2 py-0.5 text-[11px] font-medium text-[#2E7D6F]">
                  <Check className="size-3" /> Recorded
                </span>
              )}
            </div>

            <div className="mt-4">
              <Renderer
                question={adapted}
                answered={false}
                isCorrect={false}
                isWrong={false}
                selectedAnswer={answers[q.id] ?? null}
                onSubmit={(answer) => setAnswers((a) => ({ ...a, [q.id]: answer }))}
                reduced={reduced}
              />
            </div>

            {quiz.hints_enabled && q.hints.length > 0 && (
              <div className="mt-4">
                {revealedHints[q.id] ? (
                  <div
                    className="overflow-hidden rounded-lg bg-card p-3"
                    style={{
                      border: "2px solid transparent",
                      backgroundImage: `linear-gradient(var(--card), var(--card)), ${IRIDESCENT}`,
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }}
                  >
                    <p className="font-serif text-sm leading-relaxed">{q.hints[0].text}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevealedHints((h) => ({ ...h, [q.id]: true }))}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
                    style={{ background: IRIDESCENT }}
                  >
                    <Sparkles className="size-4" />
                    Need a hint?
                    {quiz.hint_point_penalty > 0 && (
                      <span className="text-xs font-normal opacity-90">−{quiz.hint_point_penalty} pt</span>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
          )
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={submitting} className="gap-1.5">
          <Send className="size-4" />
          {submitting ? "Submitting…" : "Submit quiz"}
        </Button>
      </div>
    </div>
  )
}

function hasAnswer(v: string | undefined): boolean {
  return v != null && v.trim().length > 0
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}
