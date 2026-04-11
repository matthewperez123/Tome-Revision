"use client"

import { use, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, BookOpen, Brain, MessageCircle, PenTool, Highlighter, Check, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  reading: BookOpen,
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
  chapter_range_start: number | null
  chapter_range_end: number | null
  discussion_prompt: string | null
  essay_prompt: string | null
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
      if (role === "reader") {
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

    const supabase = createClient()

    if (submission) {
      // Update existing submission
      await supabase
        .from("assignment_submissions")
        .update({
          response_text: responseText,
          word_count: responseText.split(/\s+/).filter(Boolean).length,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
        .eq("id", submission.id)
    } else {
      // Create new submission
      await supabase
        .from("assignment_submissions")
        .insert({
          assignment_id: assignment.id,
          student_id: user.id,
          response_text: responseText,
          word_count: responseText.split(/\s+/).filter(Boolean).length,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
    }

    setSubmission((prev) => ({
      ...(prev ?? { id: "", score: null, feedback: null, submitted_at: null }),
      status: "submitted",
      response_text: responseText,
      submitted_at: new Date().toISOString(),
    }))
    setSubmitting(false)
  }, [user, assignment, submission, responseText])

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
      {(assignment.type === "reading" || assignment.type === "annotation") && assignment.book_id && (
        <div className="mt-4 rounded-xl border bg-card p-4">
          <p className="text-sm font-medium">
            Read chapters {assignment.chapter_range_start}–{assignment.chapter_range_end}
          </p>
          <Link
            href={`/read/${assignment.book_id}`}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-500"
          >
            <BookOpen className="size-3.5" />
            Open in reader
          </Link>
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
      {role === "reader" && (assignment.type === "discussion" || assignment.type === "essay") && (
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

          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your response here..."
            rows={8}
            disabled={isSubmitted}
            className="mt-3 w-full rounded-xl border bg-card p-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {responseText.split(/\s+/).filter(Boolean).length} words
            </span>
            {!isSubmitted && (
              <Button
                onClick={handleSubmit}
                disabled={!responseText.trim() || submitting}
                className="gap-1.5"
              >
                <Send className="size-3.5" />
                {submitting ? "Submitting..." : "Submit"}
              </Button>
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
