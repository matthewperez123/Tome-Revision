"use client"

import { use, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, BookOpen, Brain, MessageCircle, PenTool, Highlighter, Check, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { startAssignment, submitAssignment, saveDraft } from "@/lib/actions/assignments"

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
          .single()

        if (sub) {
          setSubmission(sub)
          setResponseText(sub.response_text ?? "")
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
    if (!res.ok) {
      toast.error(res.error)
      return
    }
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
    toast.success("Draft saved")
    setSubmission((prev) => ({
      ...(prev ?? { id: res.data.submissionId, score: null, feedback: null, submitted_at: null }),
      status: prev?.status === "graded" ? "graded" : "in_progress",
      response_text: responseText,
      submitted_at: prev?.submitted_at ?? null,
    }))
  }, [user, assignment, responseText])

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
              href={
                assignment.chapter_range_start != null
                  ? `/read/${assignment.book_id}?ch=${assignment.chapter_range_start}&classroom=${classroomId}`
                  : `/read/${assignment.book_id}?classroom=${classroomId}`
              }
              onClick={() => {
                if (role === "student") void startAssignment(assignment.id)
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-500"
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
            placeholder="Write your response here..."
            rows={8}
            disabled={isSubmitted}
            className="mt-3 w-full rounded-xl border bg-card p-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between">
            <span
              className={`text-xs ${wordCount < minWords || (maxWords != null && wordCount > maxWords) ? "text-red-500" : "text-muted-foreground"}`}
            >
              {wordCount} words
            </span>
            {!isSubmitted && (
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
                  onClick={handleSubmit}
                  disabled={!responseText.trim() || submitting}
                  className="gap-1.5"
                >
                  <Send className="size-3.5" />
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            )}
            {isSubmitted && (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <Check className="size-4" /> Submitted
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
