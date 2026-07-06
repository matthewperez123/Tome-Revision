"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface AtRiskStudent {
  id: string
  display_name: string
  reason: string
  classroom_id: string
  severity: "warning" | "critical"
}

export function StudentsAtRiskCard({ classroomId }: { classroomId?: string }) {
  const { user, isDemoMode, isLoading: authLoading } = useAuth()
  const [students, setStudents] = useState<AtRiskStudent[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    // Wait for auth to settle before treating a null user as signed-out.
    if (authLoading) return
    if (isDemoMode || !user) {
      setStudents([])
      setError(false)
      return
    }

    let cancelled = false

    async function fetchAtRisk() {
      const supabase = createClient()

      let classroomIds: string[] = []
      if (classroomId) {
        classroomIds = [classroomId]
      } else {
        const { data: classrooms, error: classErr } = await supabase
          .from("classrooms")
          .select("id")
          .eq("teacher_id", user!.id)
          .eq("archived", false)

        if (cancelled) return
        // A failed read must not read as "all on track".
        if (classErr) {
          setError(true)
          return
        }
        classroomIds = (classrooms ?? []).map((c) => c.id)
      }

      if (!classroomIds.length) {
        setStudents([])
        setError(false)
        return
      }

      const now = new Date()
      const { data: overdueAssignments, error: overdueErr } = await supabase
        .from("assignments")
        .select("id, classroom_id, title")
        .in("classroom_id", classroomIds)
        .eq("status", "active")
        .lt("due_date", now.toISOString())

      if (cancelled) return
      if (overdueErr) {
        setError(true)
        return
      }
      setError(false)

      if (!overdueAssignments?.length) {
        setStudents([])
        return
      }

      const atRisk: AtRiskStudent[] = []

      for (const assignment of overdueAssignments.slice(0, 3)) {
        const { data: members } = await supabase
          .from("classroom_members")
          .select("student_id, profiles(id, display_name)")
          .eq("classroom_id", assignment.classroom_id)

        if (!members) continue

        const { data: submissions } = await supabase
          .from("assignment_submissions")
          .select("student_id")
          .eq("assignment_id", assignment.id)
          .in("status", ["submitted", "graded"])

        const submittedIds = new Set((submissions ?? []).map((s) => s.student_id))

        for (const member of members) {
          if (!submittedIds.has(member.student_id)) {
            const profile = (member as any).profiles as { id: string; display_name: string } | null
            atRisk.push({
              id: profile?.id ?? member.student_id,
              display_name: profile?.display_name ?? "Student",
              reason: `Overdue: ${assignment.title}`,
              classroom_id: assignment.classroom_id,
              severity: "critical",
            })
          }
        }
      }

      const seen = new Set<string>()
      const unique = atRisk.filter((s) => {
        if (seen.has(s.id)) return false
        seen.add(s.id)
        return true
      })

      if (cancelled) return
      setStudents(unique.slice(0, 5))
    }

    fetchAtRisk()

    return () => {
      cancelled = true
    }
  }, [user, classroomId, isDemoMode, authLoading])

  if (error) {
    return (
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Students at Risk</h3>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground py-4">
          Couldn&apos;t check student progress right now.
        </p>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Students at Risk</h3>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground py-4">
          All students are on track
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-500" />
        <h3 className="text-sm font-semibold">Students at Risk</h3>
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {students.length}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {students.map((student) => (
          <Link
            key={student.id}
            href={`/classroom/${student.classroom_id}`}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {student.display_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{student.display_name}</p>
              <p className={`text-xs truncate ${student.severity === "critical" ? "text-red-500" : "text-amber-500"}`}>
                {student.reason}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/classroom"
        className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        View all <ChevronRight className="size-3" />
      </Link>
    </div>
  )
}
