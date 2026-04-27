"use client"

import { use, useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { ChevronLeft, GraduationCap } from "lucide-react"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { manualGrade, overrideGrade } from "@/lib/actions/grades"

interface Assignment {
  id: string
  title: string
  points_available: number
}

interface Student {
  id: string
  display_name: string
  username: string | null
}

interface Submission {
  id: string
  assignment_id: string
  student_id: string
  status: string
}

interface Grade {
  submission_id: string
  score: number | null
  max_score: number
  was_overridden: boolean
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
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [grades, setGrades] = useState<Map<string, Grade>>(new Map())
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

    // Pull classroom name + assignments + members + submissions + grades.
    const [{ data: cls }, { data: assignsData }, { data: membersData }] =
      await Promise.all([
        supabase
          .from("classrooms")
          .select("name")
          .eq("id", classroomId)
          .single(),
        supabase
          .from("assignments")
          .select("id, title, points_available")
          .eq("classroom_id", classroomId)
          .order("created_at", { ascending: true }),
        supabase
          .from("classroom_members")
          .select(
            `
            role,
            student:profiles!classroom_members_student_id_fkey(id, display_name, username)
          `,
          )
          .eq("classroom_id", classroomId)
          .eq("role", "student"),
      ])

    if (cls) setClassroomName((cls as { name: string }).name)
    setAssignments((assignsData as Assignment[] | null) ?? [])

    type MemberRow = {
      role: string
      student: { id: string; display_name: string | null; username: string | null } | null
    }
    const studentList: Student[] = ((membersData ?? []) as unknown as MemberRow[])
      .filter((m) => m.student)
      .map((m) => ({
        id: m.student!.id,
        display_name: m.student!.display_name ?? "Reader",
        username: m.student!.username,
      }))
    setStudents(studentList)

    if ((assignsData ?? []).length > 0) {
      const assignmentIds = (assignsData as { id: string }[]).map((a) => a.id)
      const { data: subs } = await supabase
        .from("assignment_submissions")
        .select("id, assignment_id, student_id, status")
        .in("assignment_id", assignmentIds)
      const subRows = (subs as Submission[] | null) ?? []
      setSubmissions(subRows)

      const submissionIds = subRows.map((s) => s.id)
      if (submissionIds.length > 0) {
        const { data: gradesData } = await supabase
          .from("grades")
          .select("submission_id, score, max_score, was_overridden")
          .in("submission_id", submissionIds)
        const gMap = new Map<string, Grade>()
        for (const g of (gradesData as Grade[] | null) ?? []) {
          gMap.set(g.submission_id, g)
        }
        setGrades(gMap)
      }
    }

    setLoading(false)
  }, [user, isDemoMode, classroomId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

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

  function findSubmission(assignmentId: string, studentId: string) {
    return submissions.find(
      (s) => s.assignment_id === assignmentId && s.student_id === studentId,
    )
  }

  function saveCell() {
    if (!editingCell) return
    const score = parseFloat(editingCell.score)
    if (Number.isNaN(score)) {
      toast.error("Enter a number")
      return
    }
    const sub = submissions.find((s) => s.id === editingCell.submissionId)
    const existingGrade = grades.get(editingCell.submissionId)
    if (!sub) return

    startTransition(async () => {
      const action = existingGrade
        ? overrideGrade({
            submissionId: sub.id,
            score,
          })
        : manualGrade({
            submissionId: sub.id,
            score,
          })
      const result = await action
      if (result.ok) {
        toast.success(existingGrade ? "Grade updated" : "Grade saved")
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
                        / {a.points_available}
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
                        {s.display_name}
                      </Link>
                    </td>
                    {assignments.map((a) => {
                      const sub = findSubmission(a.id, s.id)
                      const grade = sub ? grades.get(sub.id) : null
                      const isEditing =
                        sub && editingCell?.submissionId === sub.id
                      return (
                        <td
                          key={a.id}
                          className={`px-3 py-2 text-xs ${
                            grade?.was_overridden
                              ? "bg-amber-50/50 dark:bg-amber-950/20"
                              : ""
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
                          ) : grade ? (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingCell({
                                  submissionId: sub!.id,
                                  score: String(grade.score ?? ""),
                                })
                              }
                              className="rounded px-1.5 py-0.5 hover:bg-muted"
                              title={
                                grade.was_overridden
                                  ? "Override — click to change"
                                  : "Click to override"
                              }
                            >
                              {grade.score ?? "—"}
                              {grade.was_overridden && (
                                <span className="ml-1 text-[9px] text-amber-600">
                                  ⚙
                                </span>
                              )}
                            </button>
                          ) : sub ? (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingCell({
                                  submissionId: sub.id,
                                  score: "",
                                })
                              }
                              className="rounded px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                              title={`Status: ${sub.status} — click to grade`}
                            >
                              {sub.status === "submitted"
                                ? "Grade"
                                : sub.status === "not_started"
                                  ? "—"
                                  : sub.status}
                            </button>
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
        Click a cell to grade or override. Overridden grades are highlighted;
        the original score is preserved in the audit trail.
      </p>
    </div>
  )
}
