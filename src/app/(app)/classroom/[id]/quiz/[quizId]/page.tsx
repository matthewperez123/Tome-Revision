"use client"

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react"
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

const MULTI = new Set(["multiple_choice", "vocabulary_in_context"])
const TEXT = new Set(["fill_blank", "short_answer"])
const OPEN = new Set(["free_response", "tf_with_reason"])

type AnswerValue = string | string[]

export default function QuizTakePage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>
}) {
  const { id: classroomId, quizId } = use(params)
  const [quiz, setQuiz] = useState<AttemptQuiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<AttemptResult | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const startedAtRef = useRef<string>("")

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
    toast.success("Quiz submitted")
  }, [quiz, submitting, revealedHints, quizId, classroomId, answers])

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
        <Link href={`/classroom/${classroomId}`} className="mt-3 inline-block text-sm text-[#2A4B8D] hover:underline">
          Back to class
        </Link>
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
          {result.needsReview ? " · Free-response answers await your teacher's review" : ""}
        </p>
        <Link
          href={`/classroom/${classroomId}`}
          className="mt-6 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
        >
          Back to class
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <Link
          href={`/classroom/${classroomId}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> Back
        </Link>
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

      <h1 className="mt-4 text-xl font-bold">{quiz.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {answered} of {quiz.questions.length} answered · passing {quiz.passing_score}%
      </p>

      {quiz.priorResult && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
          You scored {quiz.priorResult.percentage}% previously. Submitting again replaces that attempt.
        </div>
      )}

      <div className="mt-6 space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-xs font-semibold text-muted-foreground">{idx + 1}.</span>
              <p className="font-serif text-base leading-relaxed">{q.question_text}</p>
            </div>

            <div className="mt-4">
              {MULTI.has(q.question_type) && (
                <div className="space-y-2">
                  {(q.options ?? []).map((opt) => (
                    <OptionRow
                      key={opt}
                      label={opt}
                      selected={answers[q.id] === opt}
                      onSelect={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    />
                  ))}
                </div>
              )}

              {q.question_type === "multiple_select" && (
                <div className="space-y-2">
                  {(q.options ?? []).map((opt) => {
                    const cur = (answers[q.id] as string[] | undefined) ?? []
                    const on = cur.includes(opt)
                    return (
                      <OptionRow
                        key={opt}
                        label={opt}
                        selected={on}
                        multi
                        onSelect={() =>
                          setAnswers((a) => ({
                            ...a,
                            [q.id]: on ? cur.filter((o) => o !== opt) : [...cur, opt],
                          }))
                        }
                      />
                    )
                  })}
                </div>
              )}

              {q.question_type === "true_false" && (
                <div className="flex gap-2">
                  {["true", "false"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: v }))}
                      className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                        answers[q.id] === v
                          ? "border-[#2A4B8D] bg-[#2A4B8D]/5 text-[#2A4B8D]"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}

              {TEXT.has(q.question_type) && (
                <input
                  type="text"
                  value={(answers[q.id] as string | undefined) ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Your answer"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}

              {OPEN.has(q.question_type) && (
                <textarea
                  value={(answers[q.id] as string | undefined) ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Write your response…"
                  rows={5}
                  className="w-full rounded-lg border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}
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
        ))}
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

function OptionRow({
  label,
  selected,
  onSelect,
  multi = false,
}: {
  label: string
  selected: boolean
  onSelect: () => void
  multi?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
        selected ? "border-[#2A4B8D] bg-[#2A4B8D]/5" : "hover:bg-muted/50"
      }`}
    >
      <span
        className={`flex size-4 flex-shrink-0 items-center justify-center border ${
          multi ? "rounded" : "rounded-full"
        } ${selected ? "border-[#2A4B8D] bg-[#2A4B8D] text-white" : "border-muted-foreground/40"}`}
      >
        {selected && <Check className="size-3" />}
      </span>
      <span>{label}</span>
    </button>
  )
}

function hasAnswer(v: AnswerValue | undefined): boolean {
  if (v == null) return false
  if (Array.isArray(v)) return v.length > 0
  return v.trim().length > 0
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}
