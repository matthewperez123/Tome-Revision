"use client"

import { use, useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, BookOpen, Brain, MessageCircle, PenTool, Highlighter, Check, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useActivityBeacon } from "@/hooks/use-activity-beacon"
import { startAssignment, submitAssignment, saveDraft } from "@/lib/actions/assignments"
import { RUBRIC } from "@/lib/semester-plan/rubric"

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  chapter_read: BookOpen,
  reading: BookOpen,
  trial: Brain,
  quiz: Brain,
  discussion: MessageCircle,
  essay: PenTool,
  annotation: Highlighter,
}

interface AssignmentDetail {
  id: string
  title: string
  type: string
  description: string | null
  book_id: string | null
  quiz_id: string | null
  chapter_range_start: number | null
  chapter_range_end: number | null
  discussion_prompt: string | null
  essay_prompt: string | null
  essay_word_min: number | null
  essay_word_max: number | null
  due_date: string
  points_available: number
}

interface Submission {
  id: string
  status: string
  response_text: string | null
  score: number | null
  feedback: string | null
  submitted_at: string | null
}

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>
}) {
  const { id: classroomId, assignmentId } = use(params)
  const { user, role } = useAuth()
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [responseText, setResponseText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmingSubmit, setConfirmingSubmit] = useState(false)
  const [autosave, setAutosave] = useState<"idle" | "saving" | "saved">("idle")
  const lastSavedRef = useRef<string>("")

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      const supabase = createClient()

      const { data: assignmentData } = await supabase
        .from("assignments")
        .select("*")
        .eq("id", assignmentId)
        .single()

      if (assignmentData) setAssignment(assignmentData)

      // Fetch student's submission (if student)
      if (role === "student") {
        const { data: sub } = await supabase
          .from("assignment_submissions")
          .select("*")
          .eq("assignment_id", assignmentId)
          .eq("student_id", user!.id)
          .maybeSingle()

        if (sub) {
          setSubmission(sub)
          setResponseText(sub.response_text ?? "")
          lastSavedRef.current = sub.response_text ?? ""
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [user, role, assignmentId])

  const handleSubmit = useCallback(async () => {
    if (!user || !assignment) return
    setSubmitting(true)

    // Server action enforces essay word bounds / annotation targets and writes
    // the submission under RLS — no direct client write.
    const res = await submitAssignment({
      assignmentId: assignment.id,
      responseText,
    })
    setSubmitting(false)
    setConfirmingSubmit(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    lastSavedRef.current = responseText
    toast.success("Submitted")
    setSubmission((prev) => ({
      ...(prev ?? { id: res.data.submissionId, score: null, feedback: null, submitted_at: null }),
      status: "submitted",
      response_text: responseText,
      submitted_at: new Date().toISOString(),
    }))
  }, [user, assignment, responseText])

  const handleSaveDraft = useCallback(async () => {
    if (!user || !assignment) return
    setSavingDraft(true)
    const res = await saveDraft({ assignmentId: assignment.id, responseText })
    setSavingDraft(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    lastSavedRef.current = responseText
    toast.success("Draft saved")
    setSubmission((prev) => ({
      ...(prev ?? { id: res.data.submissionId, score: null, feedback: null, submitted_at: null }),
      status: prev?.status === "graded" ? "graded" : "in_progress",
      response_text: responseText,
      submitted_at: prev?.submitted_at ?? null,
    }))
  }, [user, assignment, responseText])

  // Autosave: after ~10s idle, quietly persist the draft. Never runs once
  // submitted/graded. Skips when nothing changed since the last save.
  useEffect(() => {
    if (!assignment || !user || role !== "student") return
    if (assignment.type !== "essay" && assignment.type !== "discussion") return
    const isDone =
      submission?.status === "submitted" || submission?.status === "graded"
    if (isDone) return
    if (responseText === lastSavedRef.current) return
    const t = setTimeout(async () => {
      setAutosave("saving")
      const res = await saveDraft({ assignmentId: assignment.id, responseText })
      if (res.ok) {
        lastSavedRef.current = responseText
        setAutosave("saved")
      } else {
        setAutosave("idle")
      }
    }, 10000)
    return () => clearTimeout(t)
  }, [responseText, assignment, user, role, submission?.status])

  // Beacon essay writers to the teacher's Lectern while they're still drafting.
  const isEssayInProgress =
    assignment?.type === "essay" &&
    submission?.status !== "submitted" &&
    submission?.status !== "graded"
  useActivityBeacon({
    classroomId: isEssayInProgress ? classroomId : null,
    surface: "essay",
    bookId: assignment?.book_id ?? null,
    assignmentId,
    detail: assignment?.title ?? null,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-muted-foreground">Assignment not found</p>
      </div>
    )
  }

  const Icon = TYPE_ICONS[assignment.type] ?? BookOpen
  const isOverdue = new Date(assignment.due_date) < new Date()
  const isSubmitted = submission?.status === "submitted" || submission?.status === "graded"
  const wordCount = responseText.split(/\s+/).filter(Boolean).length
  const minWords = assignment.essay_word_min ?? 0
  const maxWords = assignment.essay_word_max
  const withinBounds =
    wordCount >= minWords && (maxWords == null || wordCount <= maxWords)
  // Gold once the response sits inside the word window; vermilion when it's
  // short or over. Muted before the writer has begun.
  const countColor =
    wordCount === 0 ? undefined : withinBounds ? RUBRIC.goldLeaf : RUBRIC.vermilion

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/classroom/${classroomId}`}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <Icon className="size-6 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{assignment.title}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="capitalize">{assignment.type}</span>
            <span>·</span>
            <span className={isOverdue ? "text-red-500 font-medium" : ""}>
              Due {new Date(assignment.due_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            <span>·</span>
            <span>{assignment.points_available} pts</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {assignment.description && (
        <div className="mt-6 rounded-xl border bg-card p-4">
          <p className="text-sm">{assignment.description}</p>
        </div>
      )}

      {/* Type-specific content */}
      {(assignment.type === "chapter_read" ||
        assignment.type === "reading" ||
        assignment.type === "annotation") &&
        assignment.book_id && (
          <div className="mt-4 rounded-xl border bg-card p-4">
            <p className="text-sm font-medium">
              {assignment.chapter_range_start != null
                ? assignment.chapter_range_end != null &&
                  assignment.chapter_range_end !== assignment.chapter_range_start
                  ? `Read chapters ${assignment.chapter_range_start}–${assignment.chapter_range_end}`
                  : `Read chapter ${assignment.chapter_range_start}`
                : "Read the assigned passage"}
            </p>
            <Link
              href={`/classroom/${classroomId}/assignment/${assignment.id}/read`}
              onClick={() => {
                if (role === "student") void startAssignment(assignment.id)
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-sm"
              style={{ color: RUBRIC.lapis }}
            >
              <BookOpen className="size-3.5" />
              Open in reader
            </Link>
          </div>
        )}

      {assignment.type === "trial" && assignment.book_id && (
        <div className="mt-4 rounded-xl border bg-card p-4">
          <p className="text-sm font-medium">
            {assignment.chapter_range_start != null
              ? `Pass the Trial for chapter ${assignment.chapter_range_start}`
              : "Pass the assigned Trial"}
          </p>
          <Link
            href={
              assignment.chapter_range_start != null
                ? `/read/${assignment.book_id}?ch=${assignment.chapter_range_start}&trial=1&classroom=${classroomId}`
                : `/read/${assignment.book_id}?trial=1&classroom=${classroomId}`
            }
            onClick={() => {
              if (role === "student") void startAssignment(assignment.id)
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Brain className="size-3.5" />
            Launch Trial
          </Link>
        </div>
      )}

      {assignment.type === "quiz" && assignment.quiz_id && (
        <div className="mt-4 rounded-xl border bg-card p-4">
          <p className="text-sm font-medium">
            {isSubmitted ? "You've completed this quiz." : "Ready when you are."}
          </p>
          {role === "student" && (
            <Link
              href={`/classroom/${classroomId}/quiz/${assignment.quiz_id}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-500"
            >
              <Brain className="size-3.5" />
              {isSubmitted ? "Review quiz" : "Start quiz"}
            </Link>
          )}
        </div>
      )}

      {assignment.type === "discussion" && assignment.discussion_prompt && (
        <div className="mt-4 rounded-xl border-l-4 border-l-amber-500 bg-card p-4">
          <p className="text-sm font-medium">Discussion Prompt</p>
          <p className="mt-1 text-sm text-muted-foreground">{assignment.discussion_prompt}</p>
        </div>
      )}

      {assignment.type === "essay" && assignment.essay_prompt && (
        <div className="mt-4 rounded-xl border-l-4 border-l-green-500 bg-card p-4">
          <p className="text-sm font-medium">Essay Prompt</p>
          <p className="mt-1 text-sm text-muted-foreground">{assignment.essay_prompt}</p>
        </div>
      )}

      {/* Student submission area */}
      {role === "student" && (assignment.type === "discussion" || assignment.type === "essay") && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold">Your Response</h2>

          {submission?.status === "graded" && submission.feedback && (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Graded</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">{submission.score}%</span>
              </div>
              <p className="mt-2 text-sm text-green-800 dark:text-green-300">{submission.feedback}</p>
            </div>
          )}

          {assignment.type === "essay" &&
            (assignment.essay_word_min != null || assignment.essay_word_max != null) && (
              <p className="mt-2 text-xs text-muted-foreground">
                {assignment.essay_word_min != null && assignment.essay_word_max != null
                  ? `Target: ${assignment.essay_word_min}–${assignment.essay_word_max} words`
                  : assignment.essay_word_min != null
                    ? `At least ${assignment.essay_word_min} words`
                    : `At most ${assignment.essay_word_max} words`}
              </p>
            )}

          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Begin writing…"
            rows={assignment.type === "essay" ? 16 : 8}
            disabled={isSubmitted}
            className="mt-3 w-full rounded-xl border bg-card p-5 font-serif text-base leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-medium"
                style={countColor ? { color: countColor } : undefined}
              >
                {wordCount} words
              </span>
              {!isSubmitted && autosave !== "idle" && (
                <span className="text-[11px] text-muted-foreground">
                  {autosave === "saving" ? "Saving…" : "Saved"}
                </span>
              )}
            </div>
            {!isSubmitted && !confirmingSubmit && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={savingDraft || submitting}
                  className="gap-1.5"
                >
                  {savingDraft ? "Saving..." : "Save draft"}
                </Button>
                <Button
                  onClick={() => setConfirmingSubmit(true)}
                  disabled={!responseText.trim() || submitting}
                  className="gap-1.5"
                >
                  <Send className="size-3.5" />
                  Submit
                </Button>
              </div>
            )}
            {isSubmitted && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: RUBRIC.verdigris }}>
                <Check className="size-4" /> Submitted
              </span>
            )}
          </div>

          {/* Submit confirmation — final, so make it deliberate. */}
          {confirmingSubmit && !isSubmitted && (
            <div
              className="mt-3 rounded-xl border p-4"
              style={{ borderColor: `${RUBRIC.lapis}33`, backgroundColor: `${RUBRIC.lapis}0A` }}
            >
              <p className="text-sm font-medium">Submit this response?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {assignment.type === "essay" && !withinBounds
                  ? maxWords != null && wordCount > maxWords
                    ? `You're over the ${maxWords}-word limit. You can keep editing instead.`
                    : `You're under the ${minWords}-word minimum. You can keep editing instead.`
                  : "Once submitted, you won't be able to edit."}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmingSubmit(false)}
                  disabled={submitting}
                >
                  Keep editing
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-1.5"
                >
                  <Send className="size-3.5" />
                  {submitting ? "Submitting…" : "Confirm submit"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
