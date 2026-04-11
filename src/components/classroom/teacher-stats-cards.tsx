"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Activity, BookOpen, Brain } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { DEMO_CLASSROOMS, DEMO_STUDENTS } from "@/lib/classroom"

interface StatsData {
  totalStudents: number
  activeToday: number
  readingNow: number
  avgQuizScore: number
}

const DEMO_STATS_ALL: StatsData = {
  totalStudents: DEMO_CLASSROOMS.reduce((sum, c) => sum + c.studentCount, 0),
  activeToday: 12,
  readingNow: 5,
  avgQuizScore: Math.round(
    DEMO_STUDENTS.filter((s) => s.quizScore !== null).reduce((sum, s) => sum + (s.quizScore ?? 0), 0) /
    DEMO_STUDENTS.filter((s) => s.quizScore !== null).length,
  ),
}

const DEMO_STATS_BY_CLASS: Record<string, StatsData> = {
  "class-1": { totalStudents: 24, activeToday: 8, readingNow: 3, avgQuizScore: 88 },
  "class-2": { totalStudents: 18, activeToday: 4, readingNow: 2, avgQuizScore: 79 },
}

function getDemoStats(classroomId?: string): StatsData {
  if (classroomId && DEMO_STATS_BY_CLASS[classroomId]) return DEMO_STATS_BY_CLASS[classroomId]
  return DEMO_STATS_ALL
}

const STAT_CONFIG = [
  { key: "totalStudents" as const, label: "Total Students", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
  { key: "activeToday" as const, label: "Active Today", icon: Activity, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
  { key: "readingNow" as const, label: "Reading Now", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { key: "avgQuizScore" as const, label: "Avg Quiz Score", icon: Brain, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
]

export function TeacherStatsCards({ classroomId }: { classroomId?: string }) {
  const { user, isDemoMode } = useAuth()
  const [stats, setStats] = useState<StatsData>(getDemoStats(classroomId))

  useEffect(() => {
    if (isDemoMode || !user) {
      setStats(getDemoStats(classroomId))
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
        setStats(getDemoStats(classroomId))
        return
      }

      const { count: studentCount } = await supabase
        .from("classroom_members")
        .select("*", { count: "exact", head: true })
        .in("classroom_id", classroomIds)

      const { data: quizResults } = await supabase
        .from("teacher_quiz_results")
        .select("percentage")
        .in("classroom_id", classroomIds)

      const avgScore = quizResults?.length
        ? Math.round(quizResults.reduce((sum, r) => sum + Number(r.percentage), 0) / quizResults.length)
        : 87

      setStats({
        totalStudents: studentCount ?? getDemoStats(classroomId).totalStudents,
        activeToday: getDemoStats(classroomId).activeToday,
        readingNow: getDemoStats(classroomId).readingNow,
        avgQuizScore: avgScore,
      })
    }

    fetchStats()
  }, [user, classroomId, isDemoMode])

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {STAT_CONFIG.map((config, i) => {
        const Icon = config.icon
        const value = stats[config.key]
        const displayValue = config.key === "avgQuizScore" ? `${value}%` : value

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
