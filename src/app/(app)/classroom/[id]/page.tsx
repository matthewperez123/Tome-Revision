"use client"

import { use, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  BookOpen,
  TrendingUp,
  ClipboardCheck,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { StudentClassroomView } from "@/components/classroom/student-classroom-view"
import { TeacherAnnouncementComposer } from "@/components/classroom/teacher-announcement-composer"
import { TeacherAssignmentComposer } from "@/components/classroom/teacher-assignment-composer"

export default function ClassroomDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { role, isDemoMode } = useAuth()

  // Teachers (and demo previews) get the management view; authenticated
  // students get their own classroom view. Membership-role gating inside the
  // teacher view is the real source of truth for staff actions.
  if (role === "teacher" || isDemoMode) {
    return <TeacherClassroomView classroomId={id} />
  }
  return <StudentClassroomView classroomId={id} />
}

// ── Types ─────────────────────────────────────────────────────────────────

interface ClassroomMeta {
  name: string
  subject: string | null
  joinCode: string
}

interface AssignmentRow {
  id: string
  title: string
  type: string
  book_id: string | null
  chapter_range_start: number | null
  chapter_range_end: number | null
  due_date: string | null
  points_available: number | null
  status: string | null
}

/** One derived gradebook cell from the classroom_gradebook RPC. */
interface Cell {
  assignment_id: string
  student_id: string
  student_name: string | null
  student_username: string | null
  status: string
  score: number | null
  max_score: number | null
  completed_at: string | null
  source: string
}

const ACCENT = "#C8A24B"

function isComplete(status: string) {
  return status === "completed" || status === "graded"
}

function TeacherClassroomView({ classroomId }: { classroomId: string }) {
  const { user, isDemoMode } = useAuth()
  const [meta, setMeta] = useState<ClassroomMeta | null>(null)
  const [assignments, setAssignments] = useState<AssignmentRow[]>([])
  const [studentCount, setStudentCount] = useState(0)
  const [cells, setCells] = useState<Cell[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [filter, setFilter] = useState<"active" | "upcoming" | "completed">("active")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user || isDemoMode) {
      setLoading(false)
      return
    }
    const supabase = createClient()

    const { data: cls } = await supabase
      .from("classrooms")
      .select("name, subject, join_code")
      .eq("id", classroomId)
      .maybeSingle<{ name: string; subject: string | null; join_code: string }>()
    if (!cls) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setMeta({ name: cls.name, subject: cls.subject, joinCode: cls.join_code })

    const [{ data: assignsData }, { count: students }, { data: gradebook }] =
      await Promise.all([
        supabase
          .from("assignments")
          .select(
            "id, title, type, book_id, chapter_range_start, chapter_range_end, due_date, points_available, status",
          )
          .eq("classroom_id", classroomId)
          .order("created_at", { ascending: false }),
        supabase
          .from("classroom_members")
          .select("*", { count: "exact", head: true })
          .eq("classroom_id", classroomId)
          .eq("role", "student"),
        supabase.rpc("classroom_gradebook", { p_classroom: classroomId }),
      ])

    setAssignments((assignsData as AssignmentRow[] | null) ?? [])
    setStudentCount(students ?? 0)
    setCells((gradebook as Cell[] | null) ?? [])
    setLoading(false)
  }, [user, isDemoMode, classroomId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Group derived cells by assignment for completion + roster panels.
  const cellsByAssignment = useMemo(() => {
    const map = new Map<string, Cell[]>()
    for (const c of cells) {
      const arr = map.get(c.assignment_id) ?? []
      arr.push(c)
      map.set(c.assignment_id, arr)
    }
    return map
  }, [cells])

  function completionFor(assignmentId: string): number {
    const list = cellsByAssignment.get(assignmentId) ?? []
    if (list.length === 0) return 0
    const done = list.filter((c) => isComplete(c.status)).length
    return Math.round((done / list.length) * 100)
  }

  // Derive the active/upcoming/completed bucket for an assignment.
  function bucketFor(a: AssignmentRow): "active" | "upcoming" | "completed" {
    const list = cellsByAssignment.get(a.id) ?? []
    const allDone = list.length > 0 && list.every((c) => isComplete(c.status))
    if (a.status === "archived" || allDone) return "completed"
    const hasStarted = list.some((c) => c.status !== "not_started")
    if (a.due_date && new Date(a.due_date) > new Date() && !hasStarted) {
      return "upcoming"
    }
    return "active"
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-muted/30" />
      </div>
    )
  }

  if (isDemoMode || !meta) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">
          {notFound ? "Classroom not found" : "Sign in to view this classroom"}
        </p>
        <Link href="/classroom" className="mt-2 text-sm hover:underline" style={{ color: ACCENT }}>
          Back to classrooms
        </Link>
      </div>
    )
  }

  const activeAssignments = assignments.filter((a) => bucketFor(a) === "active")
  const avgCompletion =
    activeAssignments.length > 0
      ? Math.round(
          activeAssignments.reduce((s, a) => s + completionFor(a.id), 0) /
            activeAssignments.length,
        )
      : 0
  const needsGrading = cells.filter((c) => c.status === "submitted").length

  const filtered = assignments.filter((a) => bucketFor(a) === filter)
  const expandedRoster = expanded
    ? [...(cellsByAssignment.get(expanded) ?? [])].sort((a, b) => {
        const order = (c: Cell) =>
          c.status === "not_started"
            ? 0
            : c.status === "in_progress"
              ? 1
              : c.status === "submitted"
                ? 2
                : 3
        return order(a) - order(b)
      })
    : []

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/classroom"
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Classrooms
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{meta.name}</h1>
        {meta.subject && (
          <span className="rounded-full bg-[#C8A24B]/10 px-2 py-0.5 text-xs text-[#C8A24B]">
            {meta.subject}
          </span>
        )}
        <button
          onClick={() => {
            navigator.clipboard.writeText(meta.joinCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/80"
        >
          Code: {meta.joinCode}
          {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
        </button>
        <Link href={`/classroom/${classroomId}/manage`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="size-3.5" /> Manage
          </Button>
        </Link>
        <Link href={`/classroom/${classroomId}/semester-plan`}>
          <Button
            size="sm"
            className="gap-1.5 text-white"
            style={{ backgroundImage: "linear-gradient(110deg, #6366F1 0%, #8B5CF6 35%, #06B6D4 70%, #6366F1 100%)" }}
          >
            <Sparkles className="size-3.5" /> Semester Planning
          </Button>
        </Link>
      </div>

      {/* Owner/co_teacher composers — self-gated to staff */}
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

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Users, label: "Students", value: studentCount, color: "text-[#C8A24B]" },
          { icon: BookOpen, label: "Assignments", value: assignments.length, color: "text-teal-500" },
          { icon: TrendingUp, label: "Avg completion", value: `${avgCompletion}%`, color: "text-amber-500" },
          { icon: ClipboardCheck, label: "Needs grading", value: needsGrading, color: "text-green-500" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-muted/50 p-4">
            <stat.icon className={`size-4 ${stat.color}`} />
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Assignments */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Assignments</h2>
        <div className="mt-3 flex gap-2">
          {(["active", "upcoming", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {assignments.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No assignments yet — create one above to get started.
            </p>
          )}
          {assignments.length > 0 && filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No {filter} assignments</p>
          )}
          {filtered.map((a, i) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              index={i}
              completion={completionFor(a.id)}
              completedCount={(cellsByAssignment.get(a.id) ?? []).filter((c) => isComplete(c.status)).length}
              studentCount={studentCount}
              isExpanded={expanded === a.id}
              onToggle={() => setExpanded(expanded === a.id ? null : a.id)}
            />
          ))}
        </div>
      </div>

      {/* Per-assignment student progress */}
      {expanded && expandedRoster.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <h2 className="text-lg font-semibold">Student progress</h2>
          <div className="mt-3 space-y-2">
            {expandedRoster.map((c, i) => (
              <motion.div
                key={c.student_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 sm:p-4"
              >
                <Link
                  href={`/profile/${c.student_username ?? c.student_id}`}
                  className="min-w-[160px] flex-1 text-sm font-medium hover:text-[var(--tome-accent)]"
                >
                  {c.student_name ?? "Reader"}
                </Link>
                {c.score !== null && (
                  <span className="w-12 text-center text-sm tabular-nums">
                    {c.score}
                    {c.max_score ? `/${c.max_score}` : ""}
                  </span>
                )}
                <StatusBadge status={c.status} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: "bg-green-500/15", text: "text-green-600 dark:text-green-400", label: "Completed" },
  graded: { bg: "bg-green-500/15", text: "text-green-600 dark:text-green-400", label: "Graded" },
  submitted: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", label: "Submitted" },
  in_progress: { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", label: "In progress" },
  not_started: { bg: "bg-muted", text: "text-muted-foreground", label: "Not started" },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.not_started
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}

function AssignmentCard({
  assignment,
  index,
  completion,
  completedCount,
  studentCount,
  isExpanded,
  onToggle,
}: {
  assignment: AssignmentRow
  index: number
  completion: number
  completedCount: number
  studentCount: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const completionColor =
    completion >= 70 ? "text-green-500" : completion >= 40 ? "text-amber-500" : "text-red-500"
  const chapterLabel =
    assignment.chapter_range_start != null
      ? assignment.chapter_range_end != null &&
        assignment.chapter_range_end !== assignment.chapter_range_start
        ? `Ch ${assignment.chapter_range_start}–${assignment.chapter_range_end}`
        : `Ch ${assignment.chapter_range_start}`
      : assignment.type
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onToggle}
      className={`w-full rounded-xl border p-5 text-left transition-all ${
        isExpanded
          ? "border-[#C8A24B]/25 bg-[#C8A24B]/5 shadow-sm"
          : "border-border bg-card hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="size-12 shrink-0 rounded-lg bg-gradient-to-br from-[#C8A24B] to-[#9c6e2b]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">{assignment.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {chapterLabel}
            {assignment.due_date
              ? ` · Due ${new Date(assignment.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
              : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className={`text-2xl font-bold ${completionColor}`}>{completion}%</div>
          <span className="text-[10px] text-muted-foreground">
            {completedCount}/{studentCount} done
          </span>
        </div>
      </div>
    </motion.button>
  )
}
