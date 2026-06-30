"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, BookOpen, ClipboardCheck, Brain } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface StatsData {
  totalStudents: number
  activeAssignments: number
  needsGrading: number
  avgGrade: number | null
}

const EMPTY_STATS: StatsData = {
  totalStudents: 0,
  activeAssignments: 0,
  needsGrading: 0,
  avgGrade: null,
}

const STAT_CONFIG = [
  { key: "totalStudents" as const, label: "Total Students", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
  { key: "activeAssignments" as const, label: "Active Assignments", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { key: "needsGrading" as const, label: "Needs Grading", icon: ClipboardCheck, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
  { key: "avgGrade" as const, label: "Avg Grade", icon: Brain, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
]

export function TeacherStatsCards({ classroomId }: { classroomId?: string }) {
  const { user, isDemoMode } = useAuth()
  const [stats, setStats] = useState<StatsData>(EMPTY_STATS)

  useEffect(() => {
    if (isDemoMode || !user) {
      setStats(EMPTY_STATS)
      return
    }

    async function fetchStats() {
      const supabase = createClient()

      let classroomIds: string[] = []
      if (classroomId) {
        classroomIds = [classroomId]
      } else {
        const { data: classrooms } = await supabase
          .from("classrooms")
          .select("id")
          .eq("teacher_id", user!.id)
          .eq("archived", false)
        classroomIds = (classrooms ?? []).map((c) => c.id)
      }

      if (!classroomIds.length) {
        setStats(EMPTY_STATS)
        return
      }

      const [
        { count: studentCount },
        { count: activeCount },
        { count: gradingCount },
        { data: gradedRows },
      ] = await Promise.all([
        supabase
          .from("classroom_members")
          .select("*", { count: "exact", head: true })
          .in("classroom_id", classroomIds)
          .eq("role", "student"),
        supabase
          .from("assignments")
          .select("*", { count: "exact", head: true })
          .in("classroom_id", classroomIds)
          .eq("status", "active"),
        supabase
          .from("assignment_submissions")
          .select("*, assignments!inner(classroom_id)", { count: "exact", head: true })
          .eq("status", "submitted")
          .in("assignments.classroom_id", classroomIds),
        supabase
          .from("assignment_submissions")
          .select("score, assignments!inner(classroom_id)")
          .eq("status", "graded")
          .in("assignments.classroom_id", classroomIds),
      ])

      const scores = ((gradedRows ?? []) as { score: number | null }[])
        .map((r) => r.score)
        .filter((s): s is number => typeof s === "number")
      const avgGrade =
        scores.length > 0
          ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
          : null

      setStats({
        totalStudents: studentCount ?? 0,
        activeAssignments: activeCount ?? 0,
        needsGrading: gradingCount ?? 0,
        avgGrade,
      })
    }

    fetchStats()
  }, [user, classroomId, isDemoMode])

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {STAT_CONFIG.map((config, i) => {
        const Icon = config.icon
        const value = stats[config.key]
        const displayValue =
          config.key === "avgGrade"
            ? value === null
              ? "—"
              : `${value}%`
            : value

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-xl border bg-card p-4"
          >
            <div className={`flex size-9 items-center justify-center rounded-lg ${config.bg}`}>
              <Icon className={`size-4.5 ${config.color}`} />
            </div>
            <p className="mt-3 font-serif text-2xl font-bold tracking-tight">
              {displayValue}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{config.label}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
