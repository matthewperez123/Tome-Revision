"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ClipboardCheck, AlertTriangle, Clock, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface AssignmentSummary {
  needsGrading: number
  dueThisWeek: number
  overdue: number
}

const EMPTY_SUMMARY: AssignmentSummary = {
  needsGrading: 0,
  dueThisWeek: 0,
  overdue: 0,
}

export function AssignmentsSummaryCard({ classroomId }: { classroomId?: string }) {
  const { user, isDemoMode, isLoading: authLoading } = useAuth()
  const [summary, setSummary] = useState<AssignmentSummary>(EMPTY_SUMMARY)
  // "loaded, genuinely zero" vs "couldn't load" — a failed read shows "—".
  const [error, setError] = useState(false)

  useEffect(() => {
    // Wait for auth to settle before treating a null user as signed-out.
    if (authLoading) return
    if (isDemoMode || !user) {
      setSummary(EMPTY_SUMMARY)
      setError(false)
      return
    }

    let cancelled = false

    async function fetchSummary() {
      const supabase = createClient()

      let classroomIds: string[] = []
      if (classroomId) {
        classroomIds = [classroomId]
      } else {
        const { data: classrooms, error: classErr } = await supabase
          .from("classrooms")
          .select("id")
          .eq("teacher_id", user!.id)

        if (cancelled) return
        if (classErr) {
          setError(true)
          return
        }
        classroomIds = (classrooms ?? []).map((c) => c.id)
      }

      if (!classroomIds.length) {
        setSummary(EMPTY_SUMMARY)
        setError(false)
        return
      }

      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      const { count: gradingCount, error: gradingErr } = await supabase
        .from("assignment_submissions")
        .select("*, assignments!inner(classroom_id, teacher_id)", { count: "exact", head: true })
        .eq("status", "submitted")
        .eq("assignments.teacher_id", user!.id)

      const { count: dueCount, error: dueErr } = await supabase
        .from("assignments")
        .select("*", { count: "exact", head: true })
        .in("classroom_id", classroomIds)
        .eq("status", "active")
        .gte("due_date", now.toISOString())
        .lte("due_date", weekFromNow.toISOString())

      const { count: overdueCount, error: overdueErr } = await supabase
        .from("assignments")
        .select("*", { count: "exact", head: true })
        .in("classroom_id", classroomIds)
        .eq("status", "active")
        .lt("due_date", now.toISOString())

      if (cancelled) return
      if (gradingErr || dueErr || overdueErr) {
        setError(true)
        return
      }
      setError(false)

      setSummary({
        needsGrading: gradingCount ?? 0,
        dueThisWeek: dueCount ?? 0,
        overdue: overdueCount ?? 0,
      })
    }

    fetchSummary()

    return () => {
      cancelled = true
    }
  }, [user, classroomId, isDemoMode, authLoading])

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Assignments</h3>
        <Link href="/classroom/create">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
            <Plus className="size-3" />
            Create
          </Button>
        </Link>
      </div>

      <div className="mt-4 space-y-2.5">
        <Link
          href="/classroom/grading"
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
          <ClipboardCheck className="size-4 text-amber-500" />
          <span className="flex-1 text-sm">
            <span className="font-medium">{error ? "—" : summary.needsGrading}</span> need grading
          </span>
          {!error && summary.needsGrading > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {summary.needsGrading}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3 rounded-lg p-2">
          <Clock className="size-4 text-blue-500" />
          <span className="flex-1 text-sm">
            <span className="font-medium">{error ? "—" : summary.dueThisWeek}</span> due this week
          </span>
        </div>

        {!error && summary.overdue > 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-2 dark:bg-red-950/20">
            <AlertTriangle className="size-4 text-red-500" />
            <span className="flex-1 text-sm text-red-700 dark:text-red-400">
              <span className="font-medium">{summary.overdue}</span> overdue
            </span>
          </div>
        )}
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
