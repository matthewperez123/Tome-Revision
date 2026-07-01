"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, BookOpen, Brain, Flame, Trophy, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface StudentDetail {
  id: string
  display_name: string
  avatar_url: string | null
  username: string | null
}

interface AssignmentStatus {
  id: string
  title: string
  type: string
  due_date: string
  submission_status: string
  score: number | null
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string; studentId: string }>
}) {
  const { id: classroomId, studentId } = use(params)
  const { user } = useAuth()
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [assignments, setAssignments] = useState<AssignmentStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState("")
  const [notesDrafting, setNotesDrafting] = useState(false)

  // Ask Virgil to summarize this student's recent scores + reading into a
  // short private note. Virgil never persists it — it fills the box for the
  // teacher to keep or edit.
  async function draftNoteWithVirgil() {
    setNotesDrafting(true)
    try {
      const res = await fetch("/api/virgil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "student_note",
          input: { studentId, classroomId },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Virgil couldn't summarize this student.")
        return
      }
      if (data.content) {
        setNotes((prev) => (prev.trim() ? `${prev.trim()}\n\n${data.content}` : String(data.content)))
        toast.success("Virgil drafted a note — review and edit as needed.")
      }
    } catch {
      toast.error("Virgil couldn't be reached. Try again.")
    } finally {
      setNotesDrafting(false)
    }
  }

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      const supabase = createClient()

      // Fetch student profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, username")
        .eq("id", studentId)
        .single()

      if (profile) setStudent(profile)

      // Fetch assignments for this classroom
      const { data: classAssignments } = await supabase
        .from("assignments")
        .select("id, title, type, due_date")
        .eq("classroom_id", classroomId)
        .order("due_date", { ascending: false })

      if (classAssignments?.length) {
        // Fetch this student's submissions
        const { data: submissions } = await supabase
          .from("assignment_submissions")
          .select("assignment_id, status, score")
          .eq("student_id", studentId)
          .in("assignment_id", classAssignments.map((a) => a.id))

        const submissionMap = Object.fromEntries(
          (submissions ?? []).map((s) => [s.assignment_id, s]),
        )

        setAssignments(
          classAssignments.map((a) => ({
            id: a.id,
            title: a.title,
            type: a.type,
            due_date: a.due_date,
            submission_status: submissionMap[a.id]?.status ?? "not_started",
            score: submissionMap[a.id]?.score ?? null,
          })),
        )
      }

      setLoading(false)
    }

    fetchData()
  }, [user, classroomId, studentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-muted-foreground">Student not found</p>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    not_started: "bg-stone-100 text-stone-500",
    in_progress: "bg-amber-50 text-amber-700",
    submitted: "bg-blue-50 text-blue-700",
    graded: "bg-green-50 text-green-700",
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/classroom/${classroomId}/manage`}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to classroom
      </Link>

      {/* Student header */}
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-xl font-bold">
          {student.display_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold">{student.display_name}</h1>
          {student.username && (
            <p className="text-sm text-muted-foreground">@{student.username}</p>
          )}
          <Link
            href={`/teacher/students/${studentId}?from=${classroomId}`}
            className="text-xs text-[var(--tome-accent)] hover:underline mt-1 inline-block"
          >
            View full profile →
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold">
            {assignments.filter((a) => a.submission_status === "graded" || a.submission_status === "submitted").length}
          </p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold">
            {assignments.filter((a) => a.score !== null).length > 0
              ? Math.round(
                  assignments.filter((a) => a.score !== null).reduce((sum, a) => sum + (a.score ?? 0), 0) /
                    assignments.filter((a) => a.score !== null).length,
                )
              : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Avg Score</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{assignments.length}</p>
          <p className="text-xs text-muted-foreground">Assignments</p>
        </div>
      </div>

      {/* Assignment list */}
      <h2 className="mt-8 text-lg font-semibold">Assignments</h2>
      <div className="mt-3 space-y-2">
        {assignments.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">
                {a.type} · Due {new Date(a.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
            {a.score !== null && (
              <span className="text-sm font-medium">{a.score}%</span>
            )}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[a.submission_status] ?? ""}`}>
              {a.submission_status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>

      {/* Teacher notes */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Private Notes</h2>
        <button
          type="button"
          onClick={draftNoteWithVirgil}
          disabled={notesDrafting}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-[var(--tome-accent)]/40 hover:text-foreground disabled:opacity-60"
        >
          <Sparkles className="size-3 text-[#D4A04C]" />
          {notesDrafting ? "Drafting…" : "Ask Virgil"}
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add private notes about this student (only visible to you)..."
        className="mt-2 w-full rounded-xl border bg-card p-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        rows={4}
      />
    </div>
  )
}
