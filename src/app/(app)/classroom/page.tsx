"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, BookOpen, Copy, Plus, Check, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import {
  DEMO_CLASSROOMS,
  getClassStats,
  getCompletionColor,
} from "@/lib/classroom"

interface ClassroomData {
  id: string
  name: string
  subject: string | null
  join_code: string
  student_count: number
  active_assignments: number
}

function mapDemoToClassroomData(): ClassroomData[] {
  return DEMO_CLASSROOMS.map((c) => {
    const stats = getClassStats(c.id)
    return {
      id: c.id,
      name: c.name,
      subject: c.subject,
      join_code: c.joinCode,
      student_count: c.studentCount,
      active_assignments: stats.activeAssignments,
    }
  })
}

export default function ClassroomDashboard() {
  const { user, role, isDemoMode } = useAuth()
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In demo mode or when role is set via localStorage, use demo data
    if (isDemoMode || !user) {
      setClassrooms(mapDemoToClassroomData())
      setLoading(false)
      return
    }

    async function fetchClassrooms() {
      const supabase = createClient()

      if (role === "teacher") {
        const { data } = await supabase
          .from("classrooms")
          .select("id, name, subject, join_code")
          .eq("teacher_id", user!.id)
          .eq("archived", false)
          .order("created_at", { ascending: false })

        if (data?.length) {
          const withCounts = await Promise.all(
            data.map(async (c) => {
              const { count: studentCount } = await supabase
                .from("classroom_members")
                .select("*", { count: "exact", head: true })
                .eq("classroom_id", c.id)
              const { count: assignmentCount } = await supabase
                .from("assignments")
                .select("*", { count: "exact", head: true })
                .eq("classroom_id", c.id)
                .eq("status", "active")
              return {
                ...c,
                student_count: studentCount ?? 0,
                active_assignments: assignmentCount ?? 0,
              }
            }),
          )
          setClassrooms(withCounts)
        } else {
          // No real classrooms yet — show demo data
          setClassrooms(mapDemoToClassroomData())
        }
      } else {
        const { data: memberships } = await supabase
          .from("classroom_members")
          .select("classroom_id, classrooms(id, name, subject, join_code)")
          .eq("student_id", user!.id)

        if (memberships?.length) {
          const items = memberships
            .map((m) => {
              const c = (m as any).classrooms as { id: string; name: string; subject: string | null; join_code: string } | null
              if (!c) return null
              return { ...c, student_count: 0, active_assignments: 0 }
            })
            .filter(Boolean) as ClassroomData[]
          setClassrooms(items)
        } else {
          // No real classrooms — show demo for students too
          setClassrooms(mapDemoToClassroomData())
        }
      }

      setLoading(false)
    }

    fetchClassrooms()
  }, [user, role, isDemoMode])

  const isTeacher = role === "teacher"

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isTeacher ? "Your Classrooms" : "My Classes"}
        </h1>
        {isTeacher ? (
          <Link href="/classroom/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Create classroom
            </Button>
          </Link>
        ) : (
          <Link href="/classroom/join">
            <Button size="sm" variant="outline" className="gap-1.5">
              <LogIn className="size-4" />
              Join a class
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border bg-muted" />
          ))}
        </div>
      ) : classrooms.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <BookOpen className="size-7 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            {isTeacher ? "No classrooms yet" : "No classes joined"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isTeacher
              ? "Create your first classroom to start managing students"
              : "Ask your teacher for a join code to get started"}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {classrooms.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <Link
                href={isTeacher ? `/classroom/${cls.id}` : `/classroom/${cls.id}`}
                className="block rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{cls.name}</h2>
                    {cls.subject && (
                      <span className="mt-1 inline-block text-xs bg-[#D4A04C]/10 text-[#D4A04C] px-2 py-0.5 rounded-full">
                        {cls.subject}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4" />
                    {cls.student_count}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="size-4" />
                    {cls.active_assignments} active
                  </span>
                </div>

                {isTeacher && <JoinCodeBadge code={cls.join_code} />}
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function JoinCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div
      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(code).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      <span className="text-xs font-mono text-muted-foreground">Code: {code}</span>
      {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3 text-muted-foreground cursor-pointer" />}
    </div>
  )
}
