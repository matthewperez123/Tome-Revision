"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronDown, ChevronUp, FileText, PenLine } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

// Deterministic avatar color from the student id — mirrors the roster palette so
// initials render consistently without storing a color.
const AVATAR_PALETTE = [
  "#4F46E5", "#0D9488", "#D4A04C", "#EA580C",
  "#7C3AED", "#16A34A", "#BE185D", "#0284C7",
]

function colorForId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

interface StudentProfile {
  id: string
  name: string
  username: string | null
  avatarUrl: string | null
  classroomNames: string[]
}

interface AssignmentRow {
  id: string
  title: string
  type: string
  dueDate: string | null
  status: string
  score: number | null
}

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = use(params)
  const searchParams = useSearchParams()
  const fromClassroom = searchParams.get("from")
  const { user, isDemoMode } = useAuth()

  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [assignments, setAssignments] = useState<AssignmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState("")
  const [notesOpen, setNotesOpen] = useState(false)

  useEffect(() => {
    if (!user || isDemoMode) {
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      const supabase = createClient()

      // Real identity — profiles are readable.
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, username")
        .eq("id", studentId)
        .maybeSingle<{
          id: string
          display_name: string | null
          avatar_url: string | null
          username: string | null
        }>()

      if (cancelled) return
      if (!profile) {
        setStudent(null)
        setLoading(false)
        return
      }

      // Classrooms the signed-in teacher owns that this student belongs to.
      const { data: classes } = await supabase
        .from("classrooms")
        .select("id, name")
        .eq("teacher_id", user.id)

      const classIds = (classes ?? []).map((c) => c.id)
      const classNameById = new Map(
        (classes ?? []).map((c) => [c.id, c.name as string]),
      )

      let classroomNames: string[] = []
      let assignmentRows: AssignmentRow[] = []

      if (classIds.length > 0) {
        const { data: memberships } = await supabase
          .from("classroom_members")
          .select("classroom_id")
          .eq("student_id", studentId)
          .in("classroom_id", classIds)

        classroomNames = [
          ...new Set(
            (memberships ?? [])
              .map((m) => classNameById.get(m.classroom_id))
              .filter((n): n is string => Boolean(n)),
          ),
        ]

        // Real assignments + this student's real submissions (teacher-readable).
        const { data: classAssignments } = await supabase
          .from("assignments")
          .select("id, title, type, due_date")
          .in("classroom_id", classIds)
          .order("due_date", { ascending: false })

        if (classAssignments?.length) {
          const { data: submissions } = await supabase
            .from("assignment_submissions")
            .select("assignment_id, status, score")
            .eq("student_id", studentId)
            .in(
              "assignment_id",
              classAssignments.map((a) => a.id),
            )

          const byAssignment = Object.fromEntries(
            (submissions ?? []).map((s) => [s.assignment_id, s]),
          )

          assignmentRows = classAssignments.map((a) => ({
            id: a.id,
            title: a.title,
            type: a.type,
            dueDate: a.due_date,
            status: byAssignment[a.id]?.status ?? "not_started",
            score: byAssignment[a.id]?.score ?? null,
          }))
        }
      }

      if (cancelled) return
      setStudent({
        id: profile.id,
        name: profile.display_name ?? "Student",
        username: profile.username,
        avatarUrl: profile.avatar_url,
        classroomNames,
      })
      setAssignments(assignmentRows)
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [user, isDemoMode, studentId])

  const backHref = fromClassroom
    ? `/classroom/${fromClassroom}/manage`
    : "/classroom"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <p className="text-lg font-medium">Student not found</p>
        <Link
          href={backHref}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to classrooms
        </Link>
      </div>
    )
  }

  const graded = assignments.filter((a) => a.score !== null)
  const avgScore =
    graded.length > 0
      ? Math.round(
          graded.reduce((sum, a) => sum + (a.score ?? 0), 0) / graded.length,
        )
      : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link
        href={backHref}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        {student.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={student.avatarUrl}
            alt={student.name}
            className="size-20 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ backgroundColor: colorForId(student.id) }}
          >
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            {student.name}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {[
              student.username ? `@${student.username}` : null,
              student.classroomNames.join(", ") || null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-3 gap-3 pt-4">
            <StatCard
              label="Assignments"
              value={String(assignments.length)}
              sub="Total assigned"
            />
            <StatCard
              label="Completed"
              value={String(
                assignments.filter(
                  (a) =>
                    a.status === "graded" || a.status === "submitted",
                ).length,
              )}
              sub="Submitted or graded"
            />
            <StatCard
              label="Avg Score"
              value={avgScore !== null ? `${avgScore}%` : "—"}
              sub={avgScore !== null ? "Graded work" : "No grades yet"}
            />
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsTab assignments={assignments} />
        </TabsContent>
      </Tabs>

      {/* Teacher Notes — private, local only */}
      <div className="mt-8 border-t pt-6">
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <PenLine className="size-3.5" />
          Teacher Notes (private)
          {notesOpen ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </button>
        {notesOpen && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add private notes about this student (only visible to you)..."
            className="mt-3 min-h-[100px] w-full rounded-xl border bg-card p-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={4}
          />
        )}
      </div>
    </div>
  )
}

function AssignmentsTab({ assignments }: { assignments: AssignmentRow[] }) {
  const statusColors: Record<string, string> = {
    not_started: "bg-stone-100 text-stone-500 dark:bg-stone-900/40 dark:text-stone-400",
    in_progress: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    submitted: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    graded: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <FileText className="size-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No assignments in your classrooms yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 pt-4">
      {assignments.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-3 rounded-xl border bg-card p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{a.title}</p>
            <p className="text-xs text-muted-foreground">
              {a.type}
              {a.dueDate
                ? ` · Due ${new Date(a.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : ""}
            </p>
          </div>
          {a.score !== null && (
            <span className="text-sm font-medium">{a.score}%</span>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
              statusColors[a.status] ?? "",
            )}
          >
            {a.status.replace("_", " ")}
          </span>
        </div>
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="truncate text-[10px] text-muted-foreground">{sub}</p>
    </div>
  )
}
