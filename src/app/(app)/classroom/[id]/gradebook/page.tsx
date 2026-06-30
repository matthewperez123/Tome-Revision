"use client"

import { use, useCallback, useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { ChevronLeft, GraduationCap } from "lucide-react"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { manualGrade, overrideGrade } from "@/lib/actions/grades"

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
  const { user, isDemoMode } = useAuth()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [classroomName, setClassroomName] = useState("")
  const [rows, setRows] = useState<GradebookRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCell, setEditingCell] = useState<{
    submissionId: string
    score: string
  } | null>(null)
  const [pending, startTransition] = useTransition()

  const fetchAll = useCallback(async () => {
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
  }, [user, isDemoMode, classroomId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

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

  // ── Renders ─────────────────────────────────────────────────────────────

  if (allowed === null || loading) {
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
    // Override when a manual grade already exists; otherwise create one.
    const isOverride = rows.some(
      (r) => r.submission_id === editingCell.submissionId && r.source === "manual",
    )

    startTransition(async () => {
      const result = isOverride
        ? await overrideGrade({ submissionId: editingCell.submissionId, score })
        : await manualGrade({ submissionId: editingCell.submissionId, score })
      if (result.ok) {
        toast.success(isOverride ? "Grade updated" : "Grade saved")
        setEditingCell(null)
        await fetchAll()
      } else {
        toast.error(result.error)
      }
    })
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
        <div className="flex items-center gap-3">
          <GraduationCap className="size-5 text-indigo-500" />
          <h1
            className="font-serif text-xl font-semibold tracking-tight md:text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Gradebook
          </h1>
        </div>
      </BlurFade>

      {students.length === 0 || assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {students.length === 0
              ? "No students have joined this classroom yet."
              : "No assignments yet — create one to start grading."}
          </p>
        </div>
      ) : (
        <BlurFade delay={0.08} inView>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="sticky left-0 z-10 bg-muted/30 px-3 py-2 text-left text-xs font-semibold">
                    Student
                  </th>
                  {assignments.map((a) => (
                    <th
                      key={a.id}
                      className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap"
                    >
                      <div className="font-medium">{a.title}</div>
                      <div className="text-[10px] font-normal text-muted-foreground">
                        / {a.points}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20">
                    <td className="sticky left-0 z-10 bg-card px-3 py-2 font-medium">
                      <Link
                        href={`/profile/${s.username ?? s.id}`}
                        className="hover:text-[var(--tome-accent)]"
                      >
                        {s.name}
                      </Link>
                    </td>
                    {assignments.map((a) => {
                      const cell = cellMap.get(`${a.id}:${s.id}`)
                      const isManual = cell?.source === "manual"
                      const hasScore = cell?.score != null
                      const canEdit = !!cell?.submission_id
                      const isEditing =
                        cell?.submission_id != null &&
                        editingCell?.submissionId === cell.submission_id
                      return (
                        <td
                          key={a.id}
                          className={`px-3 py-2 text-xs ${
                            isManual ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                          }`}
                        >
                          {isEditing ? (
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
                          ) : hasScore && canEdit ? (
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
                                isManual
                                  ? "Manual grade — click to change"
                                  : `${cell!.source} — click to override`
                              }
                            >
                              {cell!.score}
                              {isManual && (
                                <span className="ml-1 text-[9px] text-amber-600">
                                  ⚙
                                </span>
                              )}
                            </button>
                          ) : hasScore ? (
                            // Derived score (reading/trial) without a submission
                            // row to override against — show read-only.
                            <span
                              className="rounded px-1.5 py-0.5 text-[var(--tome-accent)]"
                              title={`Derived from ${cell!.source}`}
                            >
                              {cell!.score}
                            </span>
                          ) : canEdit ? (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingCell({
                                  submissionId: cell!.submission_id!,
                                  score: "",
                                })
                              }
                              className="rounded px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                              title={`Status: ${cell!.status} — click to grade`}
                            >
                              {cell!.status === "completed"
                                ? "Grade"
                                : STATUS_LABEL[cell!.status] ?? cell!.status}
                            </button>
                          ) : cell && cell.status !== "not_started" ? (
                            <span className="text-muted-foreground">
                              {STATUS_LABEL[cell.status] ?? cell.status}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BlurFade>
      )}

      <p className="text-[10px] italic text-muted-foreground">
        Reading and Trial progress fills in automatically as students work.
        Click a cell to enter or override a manual grade; overrides are
        highlighted and the original score is kept in the audit trail.
      </p>
    </div>
  )
}
