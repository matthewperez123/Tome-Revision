"use client"

import { use, useCallback, useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { ChevronLeft, Download, GraduationCap } from "lucide-react"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { gradeSubmission } from "@/lib/actions/grades"

/** One row of the classroom_gradebook RPC — a single (assignment, student) cell. */
interface GradebookRow {
  assignment_id: string
  assignment_title: string
  assignment_type: string
  book_id: string | null
  chapter_start: number | null
  chapter_end: number | null
  points_available: number | null
  due_date: string | null
  student_id: string
  student_name: string | null
  student_username: string | null
  submission_id: string | null
  status: string
  score: number | null
  max_score: number | null
  completed_at: string | null
  /** manual | reading | trial | submission | none */
  source: string
}

interface AssignmentCol {
  id: string
  title: string
  points: number
}

interface StudentRow {
  id: string
  name: string
  username: string | null
}

const STATUS_LABEL: Record<string, string> = {
  graded: "Graded",
  completed: "Done",
  submitted: "Submitted",
  in_progress: "In progress",
  not_started: "—",
}

export default function GradebookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: classroomId } = use(params)
  const { user, isDemoMode, isLoading: authLoading } = useAuth()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [classroomName, setClassroomName] = useState("")
  const [rows, setRows] = useState<GradebookRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCell, setEditingCell] = useState<{
    submissionId: string
    score: string
  } | null>(null)
  // The gradebook opens on a general per-student overview; picking a student
  // drills into that student's per-assignment breakdown.
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const fetchAll = useCallback(async () => {
    // Wait for auth to settle before deciding access — a transiently-null
    // `user` during cold resolution must not flash the "not allowed" state.
    if (authLoading) return
    if (!user || isDemoMode) {
      setAllowed(false)
      setLoading(false)
      return
    }
    const supabase = createClient()

    // Resolve viewer's role; only owner/co_teacher/ta can view gradebook.
    const { data: membership } = await supabase
      .from("classroom_members")
      .select("role")
      .eq("classroom_id", classroomId)
      .eq("student_id", user.id)
      .maybeSingle<{ role: string }>()
    const isStaff =
      membership?.role === "owner" ||
      membership?.role === "co_teacher" ||
      membership?.role === "ta"
    setAllowed(isStaff)
    if (!isStaff) {
      setLoading(false)
      return
    }

    // Classroom name + the live derived gradebook (reading/trial completion
    // pulled straight from reading_progress / quiz_results, manual grades on
    // top) in one staff-only SECURITY DEFINER call.
    const [{ data: cls }, { data: gb }] = await Promise.all([
      supabase.from("classrooms").select("name").eq("id", classroomId).single(),
      supabase.rpc("classroom_gradebook", { p_classroom: classroomId }),
    ])

    if (cls) setClassroomName((cls as { name: string }).name)
    setRows((gb as GradebookRow[] | null) ?? [])
    setLoading(false)
  }, [user, isDemoMode, authLoading, classroomId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Live: a student submitting / progressing (assignment_submissions) or a
  // co-teacher grading refreshes the gradebook without a reload. Realtime
  // enforces RLS, so the staff-select policy scopes delivery to this teacher's
  // own classrooms — an unfiltered subscription is safe here.
  useEffect(() => {
    if (!allowed || !user || isDemoMode) return
    const supabase = createClient()
    const channel = supabase
      .channel(`gradebook:${classroomId}:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignment_submissions" },
        () => void fetchAll(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [allowed, user, isDemoMode, classroomId, fetchAll])

  // Derive columns (assignments) and rows (students) + a cell lookup from the
  // flat RPC result. The RPC already cross-joins every assignment × student.
  const assignments = useMemo<AssignmentCol[]>(() => {
    const seen = new Map<string, AssignmentCol>()
    for (const r of rows) {
      if (!seen.has(r.assignment_id)) {
        seen.set(r.assignment_id, {
          id: r.assignment_id,
          title: r.assignment_title,
          points: r.points_available ?? 100,
        })
      }
    }
    return [...seen.values()]
  }, [rows])

  const students = useMemo<StudentRow[]>(() => {
    const seen = new Map<string, StudentRow>()
    for (const r of rows) {
      if (!seen.has(r.student_id)) {
        seen.set(r.student_id, {
          id: r.student_id,
          name: r.student_name ?? "Reader",
          username: r.student_username,
        })
      }
    }
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [rows])

  const cellMap = useMemo(() => {
    const map = new Map<string, GradebookRow>()
    for (const r of rows) map.set(`${r.assignment_id}:${r.student_id}`, r)
    return map
  }, [rows])

  // Per-assignment average % (over graded/scored cells only) + overall class
  // average across every scored cell.
  const { assignmentAvg, classAvg } = useMemo(() => {
    const byAssignment = new Map<string, number | null>()
    let classSum = 0
    let classCount = 0
    for (const a of assignments) {
      let sum = 0
      let count = 0
      for (const s of students) {
        const cell = cellMap.get(`${a.id}:${s.id}`)
        if (cell?.score != null) {
          const max = cell.max_score ?? a.points ?? 100
          const pct = max > 0 ? (cell.score / max) * 100 : 0
          sum += pct
          count += 1
          classSum += pct
          classCount += 1
        }
      }
      byAssignment.set(a.id, count > 0 ? Math.round(sum / count) : null)
    }
    return {
      assignmentAvg: byAssignment,
      classAvg: classCount > 0 ? Math.round(classSum / classCount) : null,
    }
  }, [assignments, students, cellMap])

  // Per-student rollup for the general overview: overall average %, how many
  // assignments are scored, and how many are still awaiting a grade.
  interface StudentSummary {
    avg: number | null
    scored: number
    needsGrading: number
    total: number
  }
  const studentSummary = useMemo(() => {
    const map = new Map<string, StudentSummary>()
    for (const s of students) {
      let sum = 0
      let scored = 0
      let needsGrading = 0
      for (const a of assignments) {
        const cell = cellMap.get(`${a.id}:${s.id}`)
        if (cell?.score != null) {
          const max = cell.max_score ?? a.points ?? 100
          sum += max > 0 ? (cell.score / max) * 100 : 0
          scored += 1
        } else if (cell?.status === "submitted") {
          needsGrading += 1
        }
      }
      map.set(s.id, {
        avg: scored > 0 ? Math.round(sum / scored) : null,
        scored,
        needsGrading,
        total: assignments.length,
      })
    }
    return map
  }, [students, assignments, cellMap])

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) ?? null,
    [students, selectedStudentId],
  )

  const exportCsv = useCallback(() => {
    const esc = (v: string | number | null) => {
      const s = v == null ? "" : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const header = ["Student", "Username", ...assignments.map((a) => `${a.title} (/${a.points})`)]
    const lines = [header.map(esc).join(",")]
    for (const s of students) {
      const cells = assignments.map((a) => {
        const cell = cellMap.get(`${a.id}:${s.id}`)
        return cell?.score != null ? cell.score : ""
      })
      lines.push([esc(s.name), esc(s.username ?? ""), ...cells.map(esc)].join(","))
    }
    lines.push(
      [
        esc("Average %"),
        esc(""),
        ...assignments.map((a) => {
          const avg = assignmentAvg.get(a.id)
          return esc(avg == null ? "" : `${avg}%`)
        }),
      ].join(","),
    )
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const safeName = (classroomName || "gradebook").replace(/[^a-z0-9]+/gi, "-").toLowerCase()
    link.download = `${safeName}-gradebook.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [assignments, students, cellMap, assignmentAvg, classroomName])

  // ── Renders ─────────────────────────────────────────────────────────────

  if (authLoading || allowed === null || loading) {
    return (
      <div className="mx-auto max-w-5xl p-4 md:p-6">
        <div className="h-32 animate-pulse rounded-2xl border border-border bg-muted/30" />
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="mx-auto max-w-2xl space-y-3 p-4 md:p-6">
        <Link
          href={`/classroom/${classroomId}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> Classroom
        </Link>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            The gradebook is only visible to teachers and TAs.
          </p>
        </div>
      </div>
    )
  }

  function saveCell() {
    if (!editingCell) return
    const score = parseFloat(editingCell.score)
    if (Number.isNaN(score)) {
      toast.error("Enter a number")
      return
    }
    startTransition(async () => {
      const result = await gradeSubmission({
        submissionId: editingCell.submissionId,
        score,
      })
      if (result.ok) {
        toast.success(result.data.wasRegrade ? "Grade updated" : "Grade saved")
        setEditingCell(null)
        await fetchAll()
      } else {
        toast.error(result.error)
      }
    })
  }

  // The gradeable cell control — editable score / derived score / grade prompt.
  // Shared by the (rare) matrix and the per-student detail drill-down.
  function renderCell(cell: GradebookRow | undefined, a: AssignmentCol) {
    const isManual = cell?.source === "manual"
    const hasScore = cell?.score != null
    const canEdit = !!cell?.submission_id
    const isEditing =
      cell?.submission_id != null && editingCell?.submissionId === cell.submission_id
    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editingCell!.score}
            onChange={(e) =>
              setEditingCell({
                submissionId: editingCell!.submissionId,
                score: e.target.value,
              })
            }
            type="number"
            step="0.01"
            className="h-7 w-16 text-xs"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") saveCell()
              if (e.key === "Escape") setEditingCell(null)
            }}
          />
          <Button
            size="sm"
            className="h-7 px-2 text-[10px]"
            onClick={saveCell}
            disabled={pending}
          >
            Save
          </Button>
        </div>
      )
    }
    if (hasScore && canEdit) {
      return (
        <button
          type="button"
          onClick={() =>
            setEditingCell({
              submissionId: cell!.submission_id!,
              score: String(cell!.score ?? ""),
            })
          }
          className="rounded px-1.5 py-0.5 hover:bg-muted"
          title={
            isManual ? "Manual grade — click to change" : `${cell!.source} — click to override`
          }
        >
          {cell!.score}
          {isManual && <span className="ml-1 text-[9px] text-amber-600">⚙</span>}
        </button>
      )
    }
    if (hasScore) {
      return (
        <span
          className="rounded px-1.5 py-0.5 text-[var(--tome-accent)]"
          title={`Derived from ${cell!.source}`}
        >
          {cell!.score}
        </span>
      )
    }
    if (canEdit) {
      return (
        <button
          type="button"
          onClick={() =>
            setEditingCell({ submissionId: cell!.submission_id!, score: "" })
          }
          className="rounded px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          title={`Status: ${cell!.status} — click to grade`}
        >
          {cell!.status === "completed"
            ? "Grade"
            : STATUS_LABEL[cell!.status] ?? cell!.status}
        </button>
      )
    }
    if (cell && cell.status !== "not_started") {
      return (
        <span className="text-muted-foreground">
          {STATUS_LABEL[cell.status] ?? cell.status}
        </span>
      )
    }
    return <span className="text-muted-foreground/40">—</span>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4 md:p-6">
      <Link
        href={`/classroom/${classroomId}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> {classroomName || "Classroom"}
      </Link>

      <BlurFade delay={0.04} inView>
        <div className="flex flex-wrap items-center gap-3">
          <GraduationCap className="size-5 text-indigo-500" />
          <h1
            className="font-serif text-xl font-semibold tracking-tight md:text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Gradebook
          </h1>
          {classAvg != null && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Class average {classAvg}%
            </span>
          )}
          {students.length > 0 && assignments.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="ml-auto gap-1.5"
              onClick={exportCsv}
            >
              <Download className="size-3.5" /> Export CSV
            </Button>
          )}
        </div>
      </BlurFade>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No students have joined this classroom yet.
          </p>
        </div>
      ) : selectedStudent ? (
        // ── Per-student drill-down: this student's assignment-by-assignment
        // breakdown, reached by selecting a student in the overview. ──────────
        <BlurFade delay={0.04} inView>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                setSelectedStudentId(null)
                setEditingCell(null)
              }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> All students
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-serif text-lg font-semibold tracking-tight">
                {selectedStudent.name}
              </h2>
              {(() => {
                const sum = studentSummary.get(selectedStudent.id)
                return sum?.avg != null ? (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Average {sum.avg}%
                  </span>
                ) : null
              })()}
              <Link
                href={`/profile/${selectedStudent.username ?? selectedStudent.id}`}
                className="text-xs text-muted-foreground hover:text-[var(--tome-accent)]"
              >
                View profile →
              </Link>
            </div>

            {assignments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
                No assignments yet — create one to start grading.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="min-w-full divide-y divide-border text-sm">
                  <tbody className="divide-y divide-border">
                    {assignments.map((a) => {
                      const cell = cellMap.get(`${a.id}:${selectedStudent.id}`)
                      const isManual = cell?.source === "manual"
                      return (
                        <tr key={a.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="font-medium">{a.title}</div>
                            <div className="text-[10px] text-muted-foreground">
                              out of {a.points}
                            </div>
                          </td>
                          <td
                            className={`px-4 py-3 text-right text-xs ${
                              isManual ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                            }`}
                          >
                            {renderCell(cell, a)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-[10px] italic text-muted-foreground">
              Reading and Trial progress fills in automatically as students work.
              Click a score to enter or override a manual grade; overrides are
              highlighted and the original score is kept in the audit trail.
            </p>
          </div>
        </BlurFade>
      ) : (
        // ── General overview: one summarized, selectable row per student. ────
        <BlurFade delay={0.08} inView>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold">Student</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold">Graded</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold">To grade</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold">Average</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => {
                  const sum = studentSummary.get(s.id)
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      className="cursor-pointer transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-right text-xs tabular-nums text-muted-foreground">
                        {sum?.scored ?? 0}/{sum?.total ?? assignments.length}
                      </td>
                      <td className="px-4 py-3 text-right text-xs tabular-nums">
                        {sum && sum.needsGrading > 0 ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            {sum.needsGrading}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-semibold tabular-nums">
                        {sum?.avg == null ? (
                          <span className="text-muted-foreground/40">—</span>
                        ) : (
                          `${sum.avg}%`
                        )}
                      </td>
                      <td className="px-2 py-3 text-right text-muted-foreground/60">
                        <ChevronLeft className="ml-auto size-4 rotate-180" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="border-t border-border bg-muted/30">
                <tr>
                  <td className="px-4 py-2 text-xs font-semibold">Class average</td>
                  <td />
                  <td />
                  <td className="px-4 py-2 text-right text-xs font-semibold tabular-nums">
                    {classAvg == null ? (
                      <span className="text-muted-foreground/40">—</span>
                    ) : (
                      `${classAvg}%`
                    )}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </BlurFade>
      )}

      <p className="text-[10px] italic text-muted-foreground">
        Select a student to see their assignment-by-assignment grades.
      </p>
    </div>
  )
}
