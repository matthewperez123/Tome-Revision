"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, BookOpen, BarChart2, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getBook } from "@/lib/content"
import { useAuth } from "@/hooks/use-auth"
import { TeacherAnnouncementComposer } from "@/components/classroom/teacher-announcement-composer"
import { TeacherAssignmentComposer } from "@/components/classroom/teacher-assignment-composer"
import { LiveSessionBanner } from "@/components/classroom/live/live-session-banner"

type Tab = "feed" | "assignments" | "progress"

interface ClassroomInfo {
  id: string
  name: string
  subject: string | null
}

interface AnnouncementItem {
  id: string
  content: string
  pinned: boolean
  created_at: string
  teacher_name: string
}

interface AssignmentItem {
  id: string
  title: string
  type: string
  book_id: string | null
  due_date: string
  status: string // submission status
}

interface GradeItem {
  id: string
  title: string
  score: number | null
  max_score: number | null
  feedback: string | null
  was_overridden: boolean
  graded_at: string
}

export function StudentClassroomView({ classroomId }: { classroomId: string }) {
  const { user, isLoading: authLoading } = useAuth()
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null)
  const [tab, setTab] = useState<Tab>("feed")
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [assignments, setAssignments] = useState<AssignmentItem[]>([])
  const [grades, setGrades] = useState<GradeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Bumped by reload() to re-run the fetch after a transient failure.
  const [attempt, setAttempt] = useState(0)
  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  // Student reads ONLY their own grades (grades_student_select RLS), scoped to
  // this classroom's assignments. Feedback + score come straight off the
  // canonical grades table.
  const fetchGrades = useCallback(async () => {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from("grades")
      .select(
        `id, score, max_score, feedback, was_overridden, graded_at,
         submission:assignment_submissions!inner(
           student_id,
           assignment:assignments!inner(title, classroom_id)
         )`,
      )
      .eq("submission.student_id", user.id)
      .eq("submission.assignment.classroom_id", classroomId)
      .order("graded_at", { ascending: false })

    setGrades(
      (data ?? []).map((g) => ({
        id: g.id,
        title:
          (((g as any).submission as { assignment: { title: string } })?.assignment
            ?.title) ?? "Assignment",
        score: g.score,
        max_score: g.max_score,
        feedback: g.feedback,
        was_overridden: g.was_overridden,
        graded_at: g.graded_at,
      })),
    )
  }, [user, classroomId])

  // Announcement stream — read side of the classroom feed. Pinned rows float to
  // the top (order pinned desc, then newest first).
  const fetchAnnouncements = useCallback(async () => {
    const supabase = createClient()
    const { data: announcementData } = await supabase
      .from("classroom_announcements")
      .select("id, content, pinned, created_at, teacher_id, profiles!classroom_announcements_teacher_id_fkey(display_name)")
      .eq("classroom_id", classroomId)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(10)

    if (announcementData) {
      setAnnouncements(
        announcementData.map((a) => ({
          id: a.id,
          content: a.content,
          pinned: a.pinned,
          created_at: a.created_at,
          teacher_name: ((a as any).profiles as { display_name: string } | null)?.display_name ?? "Teacher",
        })),
      )
    }
  }, [classroomId])

  // Live: when a grade lands (mirror updates the student's own submission), the
  // grades list refreshes so the score/feedback appears without a reload.
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    const channel = supabase
      .channel(`my-grades:${classroomId}:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "assignment_submissions",
          filter: `student_id=eq.${user.id}`,
        },
        () => void fetchGrades(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [user, classroomId, fetchGrades])

  // Live: new/edited/pinned announcements land in the feed without a reload.
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`class-announcements:${classroomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "classroom_announcements",
          filter: `classroom_id=eq.${classroomId}`,
        },
        () => void fetchAnnouncements(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [classroomId, fetchAnnouncements])

  useEffect(() => {
    // Wait for auth to settle — a null user mid-resolution is not "signed out",
    // and must not lock the view in a permanent spinner.
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void fetchGrades()

    async function fetchData() {
      const supabase = createClient()

      // Classroom info — a failed read is NOT "not found"; distinguish them so
      // the student sees a retry, not a false "Classroom not found".
      const { data: cls, error: clsErr } = await supabase
        .from("classrooms")
        .select("id, name, subject")
        .eq("id", classroomId)
        .single()
      if (cancelled) return
      if (clsErr) {
        // PGRST116 = no row matched (genuinely not found / not a member).
        if (clsErr.code !== "PGRST116") {
          setError("Couldn't load this class. Check your connection and try again.")
          setLoading(false)
          return
        }
      }
      if (cls) setClassroom(cls)

      // Announcements
      await fetchAnnouncements()

      // Assignments
      const { data: assignmentData, error: assignErr } = await supabase
        .from("assignments")
        .select("id, title, type, book_id, due_date")
        .eq("classroom_id", classroomId)
        .eq("status", "active")
        .order("due_date", { ascending: true })

      if (cancelled) return
      if (assignErr) {
        setError("Couldn't load this class. Check your connection and try again.")
        setLoading(false)
        return
      }

      if (assignmentData) {
        // Get student's submission statuses
        const { data: submissions } = await supabase
          .from("assignment_submissions")
          .select("assignment_id, status")
          .eq("student_id", user!.id)
          .in("assignment_id", assignmentData.map((a) => a.id))

        if (cancelled) return
        const statusMap = Object.fromEntries(
          (submissions ?? []).map((s) => [s.assignment_id, s.status]),
        )

        setAssignments(
          assignmentData.map((a) => ({
            ...a,
            status: statusMap[a.id] ?? "not_started",
          })),
        )
      }

      setLoading(false)
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [user, authLoading, classroomId, attempt, fetchGrades, fetchAnnouncements])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-sm font-medium text-[#C8553D]">{error}</p>
        <button
          onClick={reload}
          className="mt-3 rounded-md px-3 py-1.5 text-sm font-medium text-[#D4A04C] hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!classroom) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-muted-foreground">Classroom not found</p>
        <Link href="/classroom" className="mt-2 text-sm text-[#D4A04C] hover:underline">
          Back to classes
        </Link>
      </div>
    )
  }

  const tabs: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: "feed", label: "Feed", icon: MessageCircle },
    { key: "assignments", label: "Assignments", icon: BookOpen },
    { key: "progress", label: "My Progress", icon: BarChart2 },
  ]

  const statusColors: Record<string, string> = {
    not_started: "bg-stone-100 text-stone-500",
    in_progress: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    submitted: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    graded: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/classroom"
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> My Classes
      </Link>

      <h1 className="text-2xl font-bold">{classroom.name}</h1>
      {classroom.subject && (
        <span className="mt-1 inline-block text-xs bg-[#D4A04C]/10 text-[#D4A04C] px-2 py-0.5 rounded-full">
          {classroom.subject}
        </span>
      )}

      {/* Live quiz in progress — appears the instant the teacher launches. */}
      <div className="mt-6">
        <LiveSessionBanner classroomId={classroomId} role="student" />
      </div>

      {/* Real-mode owner/co_teacher composers — invisible to students. */}
      <div className="mt-6 space-y-2">
        <TeacherAnnouncementComposer classroomId={classroomId} />
        <TeacherAssignmentComposer classroomId={classroomId} />
        <Link
          href={`/classroom/${classroomId}/gradebook`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          Open gradebook →
        </Link>
      </div>

      {/* Tab bar */}
      <div className="mt-2 flex gap-1 overflow-x-auto border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-medium ${
              tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            <t.icon className="size-3.5" />
            {t.label}
            {tab === t.key && (
              <motion.div layoutId="student-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* Feed Tab */}
        {tab === "feed" && (
          <div className="space-y-3">
            {announcements.length === 0 && assignments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No updates yet</p>
            ) : (
              <>
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className={`rounded-xl border-l-4 bg-card p-4 ${a.pinned ? "border-l-[#D4A04C]" : "border-l-muted"}`}
                  >
                    <p className="text-sm">{a.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {a.teacher_name} · {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                ))}
                {assignments.slice(0, 3).map((a) => (
                  <Link
                    key={a.id}
                    href={`/classroom/${classroomId}/assignment/${a.id}`}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <BookOpen className="size-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(a.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[a.status] ?? ""}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {tab === "assignments" && (
          <div className="space-y-2">
            {assignments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No assignments yet</p>
            ) : (
              assignments.map((a) => (
                <Link
                  key={a.id}
                  href={`/classroom/${classroomId}/assignment/${a.id}`}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="capitalize">{a.type.replace("_", " ")}</span>
                      {a.book_id ? ` · ${getBook(a.book_id)?.title ?? a.book_id}` : ""}
                      {a.due_date
                        ? ` · Due ${new Date(a.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : ""}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[a.status] ?? ""}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Progress Tab */}
        {tab === "progress" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card p-4">
                <p className="text-2xl font-bold">{grades.length}</p>
                <p className="text-xs text-muted-foreground">Grades received</p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-2xl font-bold">
                  {(() => {
                    const scored = grades.filter(
                      (g) => g.score != null && (g.max_score ?? 0) > 0,
                    )
                    if (scored.length === 0) return "—"
                    const avg =
                      scored.reduce(
                        (s, g) => s + (g.score! / (g.max_score || 1)) * 100,
                        0,
                      ) / scored.length
                    return `${Math.round(avg)}%`
                  })()}
                </p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">My grades</h3>
              {grades.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No grades yet. They&apos;ll appear here as your teacher grades your work.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {grades.map((g) => {
                    const pct =
                      g.score != null && (g.max_score ?? 0) > 0
                        ? Math.round((g.score / g.max_score!) * 100)
                        : null
                    return (
                      <div key={g.id} className="rounded-xl border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">{g.title}</p>
                          <div className="text-right">
                            <span className="text-sm font-semibold tabular-nums">
                              {g.score ?? "—"}
                              {g.max_score != null ? `/${g.max_score}` : ""}
                            </span>
                            {pct != null && (
                              <span className="ml-1.5 text-xs text-muted-foreground">
                                ({pct}%)
                              </span>
                            )}
                          </div>
                        </div>
                        {g.feedback && (
                          <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Feedback
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm">{g.feedback}</p>
                          </div>
                        )}
                        <p className="mt-2 text-[10px] text-muted-foreground">
                          Graded{" "}
                          {new Date(g.graded_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {g.was_overridden ? " · adjusted by teacher" : ""}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
