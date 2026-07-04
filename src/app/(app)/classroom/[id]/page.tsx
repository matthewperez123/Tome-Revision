"use client"

import { use, useCallback, useEffect, useMemo, useState, useTransition } from "react"
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
  Highlighter,
  Radio,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { getBook } from "@/lib/content"
import { StudentClassroomView } from "@/components/classroom/student-classroom-view"
import { TeacherAnnouncementComposer } from "@/components/classroom/teacher-announcement-composer"
import { TeacherAssignmentComposer } from "@/components/classroom/teacher-assignment-composer"
import { ClassroomRosterPanel } from "@/components/classroom/classroom-roster-panel"
import { publishAssignment } from "@/lib/actions/assignments"

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
  const [subCounts, setSubCounts] = useState<Record<string, Record<string, number>>>({})
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

    const [
      { data: assignsData },
      { count: students },
      { data: gradebook },
      { data: subRows },
    ] = await Promise.all([
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
      supabase
        .from("assignment_submissions")
        .select("assignment_id, status, assignment:assignments!inner(classroom_id)")
        .eq("assignment.classroom_id", classroomId),
    ])

    // Per-assignment submission counts keyed by status.
    const counts: Record<string, Record<string, number>> = {}
    for (const r of (subRows as { assignment_id: string; status: string }[] | null) ??
      []) {
      counts[r.assignment_id] ??= {}
      counts[r.assignment_id][r.status] = (counts[r.assignment_id][r.status] ?? 0) + 1
    }

    setAssignments((assignsData as AssignmentRow[] | null) ?? [])
    setStudentCount(students ?? 0)
    setCells((gradebook as Cell[] | null) ?? [])
    setSubCounts(counts)
    setLoading(false)
  }, [user, isDemoMode, classroomId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Distinct books assigned in this class (for the shared-annotations picker).
  const annotatableBooks = useMemo(() => {
    const seen = new Map<string, string>()
    for (const a of assignments) {
      if (a.book_id && !seen.has(a.book_id)) {
        seen.set(a.book_id, getBook(a.book_id)?.title ?? a.book_id)
      }
    }
    return [...seen.entries()].map(([id, title]) => ({ id, title }))
  }, [assignments])

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
    // Drafts live in the "upcoming" bucket until published.
    if (a.status === "draft") return "upcoming"
    const list = cellsByAssignment.get(a.id) ?? []
    const allDone = list.length > 0 && list.every((c) => isComplete(c.status))
    if (a.status === "archived" || a.status === "closed" || allDone) return "completed"
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
        <AssignmentDraftWithVirgil classroomId={classroomId} onCreated={fetchAll} />
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/classroom/${classroomId}/lectern`}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
            style={{
              color: "#3E7C6A",
              backgroundColor: "#3E7C6A14",
              border: "1px solid #3E7C6A33",
            }}
          >
            <Radio className="size-3.5" /> The Lectern
          </Link>
          <Link
            href={`/classroom/${classroomId}/progress`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Live progress board →
          </Link>
          <Link
            href={`/classroom/${classroomId}/gradebook`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Open gradebook →
          </Link>
        </div>
      </div>

      {/* Roster + invites — self-gated to staff */}
      <div className="mt-6">
        <ClassroomRosterPanel classroomId={classroomId} joinCode={meta.joinCode} />
      </div>

      {/* Virgil's read on the class — teacher-only, read-only */}
      <ClassInsightsPanel classroomId={classroomId} />

      {/* Shared margin annotations across the class's assigned books — live */}
      <ClassAnnotationsPanel classroomId={classroomId} books={annotatableBooks} />

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
              statusCounts={subCounts[a.id] ?? {}}
              isExpanded={expanded === a.id}
              onToggle={() => setExpanded(expanded === a.id ? null : a.id)}
              onPublished={fetchAll}
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

const ASSIGNMENT_DRAFT_TYPES = ["essay", "discussion", "annotation", "reading", "quiz"] as const
type AssignmentDraftType = (typeof ASSIGNMENT_DRAFT_TYPES)[number]

/**
 * Compact "draft an assignment with Virgil" flow. Unlike the manual composer,
 * Virgil owns the write: POST /api/virgil (task=assignment_draft) inserts a
 * DRAFT assignment row directly, then we refresh the list so it appears.
 */
function AssignmentDraftWithVirgil({
  classroomId,
  onCreated,
}: {
  classroomId: string
  onCreated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<AssignmentDraftType>("essay")
  const [bookId, setBookId] = useState("")
  const [chapterStart, setChapterStart] = useState("")
  const [chapterEnd, setChapterEnd] = useState("")
  const [brief, setBrief] = useState("")
  const [pending, setPending] = useState(false)

  async function submit() {
    setPending(true)
    try {
      const start = chapterStart.trim() ? parseInt(chapterStart, 10) : undefined
      const end = chapterEnd.trim() ? parseInt(chapterEnd, 10) : undefined
      const res = await fetch("/api/virgil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "assignment_draft",
          input: {
            classroomId,
            type,
            bookId: bookId.trim() || undefined,
            // UI chapters are 1-based; the task stores whatever it's given, so
            // convert to the 0-based index the reader/library use.
            chapterStart: start != null ? Math.max(0, start - 1) : undefined,
            chapterEnd: end != null ? Math.max(0, end - 1) : undefined,
            brief: brief.trim() || undefined,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Virgil couldn't draft the assignment.")
        return
      }
      toast.success(`Virgil drafted "${data.title}" — it's saved as a draft.`)
      setOpen(false)
      setBookId("")
      setChapterStart("")
      setChapterEnd("")
      setBrief("")
      onCreated()
    } catch {
      toast.error("Virgil couldn't be reached. Try again.")
    } finally {
      setPending(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-[var(--tome-accent)]/40 hover:bg-muted/50"
      >
        <Sparkles className="size-4 text-[#D4A04C]" />
        <span>Draft an assignment with Virgil…</span>
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-3.5 text-[#D4A04C]" />
        <h3 className="text-sm font-semibold">Draft an assignment with Virgil</h3>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1">
          {ASSIGNMENT_DRAFT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-full px-3 py-1 text-xs capitalize ${
                type === t
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="Book id (optional)"
            className="col-span-3 h-9 text-sm sm:col-span-1"
          />
          <Input
            value={chapterStart}
            onChange={(e) => setChapterStart(e.target.value)}
            type="number"
            min={1}
            placeholder="Ch from"
            className="h-9 text-sm"
          />
          <Input
            value={chapterEnd}
            onChange={(e) => setChapterEnd(e.target.value)}
            type="number"
            min={1}
            placeholder="Ch to"
            className="h-9 text-sm"
          />
        </div>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="What should this assignment focus on? (optional brief for Virgil)"
          rows={2}
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tome-accent)]"
        />
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={submit} disabled={pending}>
            <Sparkles className="size-3" />
            {pending ? "Drafting…" : "Draft with Virgil"}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

interface ClassInsights {
  trajectory: string
  needs_attention: { student: string; why: string }[]
  regrouping: string
  next_step: string
}

/**
 * Virgil's read on the class — a read-only, teacher-only insight card. Fetches
 * on demand from POST /api/virgil (task=class_insights); the endpoint is
 * teacher-gated and Virgil writes nothing, so this only ever displays.
 */
function ClassInsightsPanel({ classroomId }: { classroomId: string }) {
  const [insights, setInsights] = useState<ClassInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchInsights() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/virgil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "class_insights", input: { classroomId } }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Virgil couldn't read the class right now.")
        return
      }
      setInsights(data as ClassInsights)
    } catch {
      setError("Virgil couldn't be reached. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-[#C8A24B]/25 bg-[#C8A24B]/[0.04] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#D4A04C]" />
          <h2 className="text-sm font-semibold">Virgil&apos;s read on the class</h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs"
          onClick={fetchInsights}
          disabled={loading}
        >
          {loading ? "Reading…" : insights ? "Refresh" : "Ask Virgil"}
        </Button>
      </div>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

      {!insights && !error && !loading && (
        <p className="mt-2 text-xs text-muted-foreground">
          A private, on-demand read of your class&apos;s trajectory and who needs attention.
        </p>
      )}

      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-3 text-sm"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Trajectory</p>
            <p className="mt-0.5 text-foreground/90">{insights.trajectory}</p>
          </div>
          {insights.needs_attention.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Needs attention</p>
              <ul className="mt-1 space-y-1">
                {insights.needs_attention.map((n, i) => (
                  <li key={i} className="text-foreground/90">
                    <span className="font-medium">{n.student}</span> — {n.why}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Suggested regrouping</p>
            <p className="mt-0.5 text-foreground/90">{insights.regrouping}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Next step</p>
            <p className="mt-0.5 text-foreground/90">{insights.next_step}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface SharedAnnotation {
  id: string
  user_id: string
  chapter_index: number
  selected_text: string
  note: string | null
  student: string
}

/**
 * Teacher oversight of the class's shared margin annotations. Lists every
 * highlight students shared to this class for a selected assigned book,
 * grouped by chapter, showing who, the passage, and any note — read-only and
 * live. RLS (highlights_shared_read) already scopes reads to shares in classes
 * the teacher is a member of, so this only ever surfaces permitted rows.
 */
function ClassAnnotationsPanel({
  classroomId,
  books,
}: {
  classroomId: string
  books: { id: string; title: string }[]
}) {
  const [bookId, setBookId] = useState<string | null>(null)
  const [rows, setRows] = useState<SharedAnnotation[]>([])
  const [loading, setLoading] = useState(false)

  // Default to the first assigned book once assignments load.
  useEffect(() => {
    if (!bookId && books.length > 0) setBookId(books[0].id)
  }, [books, bookId])

  const load = useCallback(async () => {
    if (!bookId) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from("highlights")
      .select("id, user_id, chapter_index, selected_text, note")
      .eq("classroom_id", classroomId)
      .eq("book_id", bookId)
      .eq("shared", true)
      .order("chapter_index", { ascending: true })

    const raw =
      (data as {
        id: string
        user_id: string
        chapter_index: number
        selected_text: string
        note: string | null
      }[] | null) ?? []

    const ids = [...new Set(raw.map((r) => r.user_id))]
    const nameById = new Map<string, string>()
    if (ids.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", ids)
      for (const p of (profiles as { id: string; display_name: string | null }[] | null) ?? []) {
        nameById.set(p.id, p.display_name ?? "Reader")
      }
    }

    setRows(
      raw.map((r) => ({ ...r, student: nameById.get(r.user_id) ?? "Reader" })),
    )
    setLoading(false)
  }, [classroomId, bookId])

  useEffect(() => {
    void load()
  }, [load])

  // Live: any shared-highlight change in this class refreshes the current book.
  useEffect(() => {
    if (!bookId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`class-annotations:${classroomId}:${bookId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "highlights",
          filter: `classroom_id=eq.${classroomId}`,
        },
        () => void load(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [classroomId, bookId, load])

  const byChapter = useMemo(() => {
    const map = new Map<number, SharedAnnotation[]>()
    for (const r of rows) {
      const arr = map.get(r.chapter_index) ?? []
      arr.push(r)
      map.set(r.chapter_index, arr)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [rows])

  if (books.length === 0) return null

  return (
    <div className="mt-4 rounded-xl border border-[#2E7D6F]/25 bg-[#2E7D6F]/[0.04] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Highlighter className="size-4 text-[#2E7D6F]" />
          <h2 className="text-sm font-semibold">Class annotations</h2>
        </div>
        {books.length > 1 && (
          <select
            value={bookId ?? ""}
            onChange={(e) => setBookId(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading && rows.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">Loading annotations…</p>
      ) : rows.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">
          No students have shared a margin annotation for this book yet.
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {byChapter.map(([chapter, list]) => (
            <div key={chapter}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Chapter {chapter + 1}
              </p>
              <ul className="mt-1.5 space-y-2">
                {list.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-lg border border-border bg-card p-3 text-sm"
                  >
                    <p className="text-foreground/90">
                      <span className="text-muted-foreground">“</span>
                      {r.selected_text}
                      <span className="text-muted-foreground">”</span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-medium text-[#2E7D6F]">{r.student}</span>
                      {r.note && (
                        <span className="text-muted-foreground">— {r.note}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SUB_COUNT_META: { key: string; label: string; className: string }[] = [
  { key: "not_started", label: "Not started", className: "bg-muted text-muted-foreground" },
  { key: "in_progress", label: "In progress", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { key: "submitted", label: "Submitted", className: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  { key: "graded", label: "Graded", className: "bg-green-500/15 text-green-600 dark:text-green-400" },
]

function AssignmentCard({
  assignment,
  index,
  completion,
  completedCount,
  studentCount,
  statusCounts,
  isExpanded,
  onToggle,
  onPublished,
}: {
  assignment: AssignmentRow
  index: number
  completion: number
  completedCount: number
  studentCount: number
  statusCounts: Record<string, number>
  isExpanded: boolean
  onToggle: () => void
  onPublished: () => void
}) {
  const [publishing, startPublish] = useTransition()
  const isDraft = assignment.status === "draft"
  const completionColor =
    completion >= 70 ? "text-green-500" : completion >= 40 ? "text-amber-500" : "text-red-500"
  const chapterLabel =
    assignment.chapter_range_start != null
      ? assignment.chapter_range_end != null &&
        assignment.chapter_range_end !== assignment.chapter_range_start
        ? `Ch ${assignment.chapter_range_start}–${assignment.chapter_range_end}`
        : `Ch ${assignment.chapter_range_start}`
      : assignment.type
  const hasCounts = SUB_COUNT_META.some((s) => (statusCounts[s.key] ?? 0) > 0)

  function publish() {
    startPublish(async () => {
      const res = await publishAssignment(assignment.id)
      if (res.ok) {
        toast.success(
          res.data.published > 0
            ? `Published to ${res.data.published} student${res.data.published === 1 ? "" : "s"}`
            : "Assignment published",
        )
        onPublished()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-xl border p-5 transition-all ${
        isExpanded
          ? "border-[#C8A24B]/25 bg-[#C8A24B]/5 shadow-sm"
          : "border-border bg-card hover:shadow-sm"
      }`}
    >
      <button onClick={onToggle} className="flex w-full items-center gap-4 text-left">
        <div className="size-12 shrink-0 rounded-lg bg-gradient-to-br from-[#C8A24B] to-[#9c6e2b]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-semibold">{assignment.title}</p>
            {isDraft && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Draft
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {chapterLabel}
            {assignment.due_date
              ? ` · Due ${new Date(assignment.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
              : ""}
          </p>
        </div>
        {!isDraft && (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className={`text-2xl font-bold ${completionColor}`}>{completion}%</div>
            <span className="text-[10px] text-muted-foreground">
              {completedCount}/{studentCount} done
            </span>
          </div>
        )}
      </button>

      {/* Submission counts by status */}
      {!isDraft && hasCounts && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUB_COUNT_META.map((s) =>
            (statusCounts[s.key] ?? 0) > 0 ? (
              <span
                key={s.key}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}
              >
                {statusCounts[s.key]} {s.label}
              </span>
            ) : null,
          )}
        </div>
      )}

      {isDraft && (
        <div className="mt-3 flex items-center justify-end">
          <Button size="sm" className="text-xs" onClick={publish} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish"}
          </Button>
        </div>
      )}
    </motion.div>
  )
}
