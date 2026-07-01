"use client"

import { use, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart2, Check, ChevronRight, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  listQuizResults,
  listStudentResponses,
  overrideResponseScore,
  type QuizResultRow,
  type StudentResponseRow,
} from "@/lib/actions/teacher-quizzes"
// Pull a plain answer string out of the stored jsonb response. Kept local so
// this client page never imports the server-only grading module.
function answerToString(response: unknown): string {
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

export default function QuizResultsPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params)
  const [rows, setRows] = useState<QuizResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState<QuizResultRow | null>(null)

  const load = useCallback(async () => {
    const res = await listQuizResults(quizId)
    if (!res.ok) {
      setError(res.error)
      setLoading(false)
      return
    }
    setRows(res.data)
    setLoading(false)
  }, [quizId])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{error}</p>
        <Link href={`/classroom/quiz-builder/${quizId}`} className="mt-3 inline-block text-sm text-[var(--tome-accent)] hover:underline">
          Back to quiz
        </Link>
      </div>
    )
  }

  const avg =
    rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.percentage, 0) / rows.length) : 0
  const reviewCount = rows.filter((r) => r.needsReview).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/classroom/quiz-builder/${quizId}`}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to quiz
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--tome-accent)]">
          <BarChart2 className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Results</h1>
          <p className="text-xs text-muted-foreground">
            {rows.length} submission{rows.length === 1 ? "" : "s"} · average {avg}%
            {reviewCount > 0 && ` · ${reviewCount} awaiting review`}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed bg-muted/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">No one has taken this quiz yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {rows.map((r) => (
            <button
              key={r.studentId}
              onClick={() => setActive(r)}
              className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/40"
            >
              <span className="flex-1 text-sm font-medium">{r.studentName}</span>
              {r.needsReview && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  Needs review
                </span>
              )}
              <span className="text-sm font-semibold tabular-nums">{r.percentage}%</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {r.score}/{r.totalPoints}
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {active && (
        <StudentDetail
          quizId={quizId}
          student={active}
          onClose={() => setActive(null)}
          onGraded={() => void load()}
        />
      )}
    </div>
  )
}

function StudentDetail({
  quizId,
  student,
  onClose,
  onGraded,
}: {
  quizId: string
  student: QuizResultRow
  onClose: () => void
  onGraded: () => void
}) {
  const [responses, setResponses] = useState<StudentResponseRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await listStudentResponses(quizId, student.studentId)
    if (res.ok) setResponses(res.data)
    setLoading(false)
  }, [quizId, student.studentId])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border bg-background p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">{student.studentName}</h2>
            <p className="text-xs text-muted-foreground">
              {student.percentage}% · {student.score}/{student.totalPoints}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {responses.map((r, idx) => (
              <ResponseCard key={r.responseId} index={idx} row={r} onGraded={() => { void load(); onGraded() }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ResponseCard({
  index,
  row,
  onGraded,
}: {
  index: number
  row: StudentResponseRow
  onGraded: () => void
}) {
  const [score, setScore] = useState(String(row.score))
  const [feedback, setFeedback] = useState("")
  const [saving, setSaving] = useState(false)

  const answer = answerToString(row.response)
  const breakdown = Array.isArray(row.aiRubricBreakdown)
    ? (row.aiRubricBreakdown as { criterion: string; points: number; note: string }[])
    : []

  const save = useCallback(async () => {
    setSaving(true)
    const res = await overrideResponseScore({
      responseId: row.responseId,
      score: Number(score),
      feedback: feedback.trim() || undefined,
    })
    setSaving(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Score updated")
    onGraded()
  }, [row.responseId, score, feedback, onGraded])

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-xs font-semibold text-muted-foreground">{index + 1}.</span>
        <p className="flex-1 text-sm font-medium">{row.questionText}</p>
        <span className="flex items-center gap-1 text-xs font-semibold tabular-nums">
          {row.isCorrect === true && <Check className="size-3.5 text-green-600" />}
          {row.score}/{row.maxPoints}
        </span>
      </div>

      <div className="mt-3 rounded-lg bg-muted/50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Answer</p>
        <p className="mt-1 whitespace-pre-wrap text-sm">{answer || <span className="italic text-muted-foreground">No answer</span>}</p>
      </div>

      {!row.isOpenEnded && row.correctAnswer && (
        <p className="mt-2 text-xs text-muted-foreground">
          Correct answer: <span className="font-medium text-foreground">{row.correctAnswer}</span>
        </p>
      )}

      {row.isOpenEnded && (
        <div className="mt-3 space-y-3">
          {row.aiFeedback && (
            <div className="rounded-lg border border-[var(--tome-accent)]/20 bg-[var(--tome-accent)]/5 p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--tome-accent)]">
                <Sparkles className="size-3" /> Virgil&apos;s draft
              </p>
              <p className="mt-1 text-sm">{row.aiFeedback}</p>
              {breakdown.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {breakdown.map((b, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{b.criterion}</span> · {b.points} pt — {b.note}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground">Score (of {row.maxPoints})</label>
              <Input
                type="number"
                min={0}
                max={row.maxPoints}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="mt-1 w-24 text-sm"
              />
            </div>
            <Input
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Optional feedback to the student…"
              className="flex-1 text-sm"
            />
            <Button onClick={save} disabled={saving} className="gap-1.5">
              {saving ? "Saving…" : row.teacherOverride ? "Update" : "Approve"}
            </Button>
          </div>
          {row.teacherOverride && (
            <p className="text-[10px] text-muted-foreground">You&apos;ve overridden this score.</p>
          )}
        </div>
      )}
    </div>
  )
}
