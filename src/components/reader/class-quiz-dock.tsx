"use client"

import { useEffect, useState } from "react"
import { X, ClipboardList, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { QuizAttemptRunner } from "@/components/classroom/quiz-attempt-runner"
import { RUBRIC } from "@/lib/semester-plan/rubric"

interface AssignedQuiz {
  assignmentId: string
  title: string
  quizId: string
  classroomId: string
  submitted: boolean
}

/**
 * In-reader access to teacher quizzes: when a student is reading a book that
 * has an ACTIVE quiz assignment in one of their classrooms, a pill appears in
 * the reader (mirroring the end-of-chapter Trial affordance) and opens the
 * shared <QuizAttemptRunner> in an overlay — no leaving the reading.
 *
 * All authorization stays server-side: the assignments select is RLS-scoped to
 * classroom members, and the runner's getQuizForAttempt / submitQuizAttempt
 * re-verify enrollment + active assignment before serving or grading anything.
 */
export function ClassQuizDock({ bookId }: { bookId: string }) {
  const { user, role } = useAuth()
  const [quizzes, setQuizzes] = useState<AssignedQuiz[]>([])
  const [open, setOpen] = useState<AssignedQuiz | null>(null)

  useEffect(() => {
    if (!user || role !== "student") return
    let cancelled = false

    async function load() {
      const supabase = createClient()
      // RLS scopes this to the student's classrooms.
      const { data } = await supabase
        .from("assignments")
        .select("id, title, quiz_id, classroom_id")
        .eq("book_id", bookId)
        .eq("status", "active")
        .not("quiz_id", "is", null)

      if (cancelled || !data || data.length === 0) return

      const ids = data.map((a) => a.id)
      const { data: subs } = await supabase
        .from("assignment_submissions")
        .select("assignment_id, status")
        .in("assignment_id", ids)
        .eq("student_id", user!.id)

      if (cancelled) return
      const submitted = new Set(
        (subs ?? [])
          .filter((s) => s.status === "submitted" || s.status === "graded")
          .map((s) => s.assignment_id),
      )
      setQuizzes(
        data.map((a) => ({
          assignmentId: a.id,
          title: a.title,
          quizId: a.quiz_id as string,
          classroomId: a.classroom_id,
          submitted: submitted.has(a.id),
        })),
      )
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user, role, bookId])

  if (quizzes.length === 0) return null

  return (
    <>
      {/* Pills — top-right, hanging just below the notification bell so quiz
          alerts read as part of the notification center (never near the
          profile switcher bottom-left, never over the assistant bottom-right). */}
      <div className="fixed right-4 top-14 z-40 flex flex-col items-end gap-2">
        {quizzes.map((q) => (
          <button
            key={q.assignmentId}
            type="button"
            onClick={() => setOpen(q)}
            className="flex items-center gap-2 rounded-full border bg-card px-3.5 py-2 text-xs font-medium shadow-lg transition-colors hover:bg-muted/60"
            style={{ borderColor: q.submitted ? RUBRIC.verdigris : RUBRIC.lapis }}
          >
            {q.submitted ? (
              <Check className="size-3.5" style={{ color: RUBRIC.verdigris }} />
            ) : (
              <ClipboardList className="size-3.5" style={{ color: RUBRIC.lapis }} />
            )}
            <span className="max-w-44 truncate">
              {q.submitted ? "Submitted" : "Class quiz"} · {q.title}
            </span>
          </button>
        ))}
      </div>

      {/* In-reading quiz overlay hosting the shared attempt runner. */}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
          <div className="relative w-full max-w-2xl rounded-xl border bg-background p-5 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close quiz"
              className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            {/* No local heading — the embedded runner renders the quiz title itself. */}
            <QuizAttemptRunner
              quizId={open.quizId}
              classroomId={open.classroomId}
              embedded
              onComplete={() => {
                setQuizzes((prev) =>
                  prev.map((q) =>
                    q.assignmentId === open.assignmentId ? { ...q, submitted: true } : q,
                  ),
                )
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
