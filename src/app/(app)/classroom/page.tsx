"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, BookOpen, Copy, Plus, Check, LogIn, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import {
  DEMO_CLASSROOMS,
  getClassStats,
  getCompletionColor,
} from "@/lib/classroom"

type ClassroomRole = "owner" | "co_teacher" | "ta" | "student"

interface ClassroomData {
  id: string
  name: string
  subject: string | null
  join_code: string
  student_count: number
  active_assignments: number
  /** Viewer's role in this classroom. Demo data defaults to "owner". */
  my_role: ClassroomRole
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
      my_role: "owner",
    }
  })
}

const ROLE_LABEL: Record<ClassroomRole, string> = {
  owner: "Owner",
  co_teacher: "Co-teacher",
  ta: "TA",
  student: "Student",
}

const ROLE_BADGE_STYLE: Record<ClassroomRole, string> = {
  owner: "bg-[#D4A04C]/15 text-[#9c6e2b] dark:text-[#D4A04C]",
  co_teacher: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  ta: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  student: "bg-muted text-muted-foreground",
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

      // Unified path: query all classroom_members rows for this user,
      // joined to the parent classroom. Role-per-classroom (not the
      // user's profile role) is the source of truth for what they see.
      const { data: memberships } = await supabase
        .from("classroom_members")
        .select(
          `
          role,
          classroom:classrooms!inner(id, name, subject, join_code, archived)
        `,
        )
        .eq("student_id", user!.id)

      type Row = {
        role: ClassroomRole
        classroom: {
          id: string
          name: string
          subject: string | null
          join_code: string
          archived: boolean | null
        } | null
      }

      const rows = ((memberships ?? []) as unknown as Row[])
        .filter((r) => r.classroom && !r.classroom.archived)

      if (rows.length === 0) {
        setClassrooms([])
        setLoading(false)
        return
      }

      // Hydrate counts in parallel — student_count from classroom_members,
      // active_assignments from assignments where status='active'.
      const withCounts: ClassroomData[] = await Promise.all(
        rows.map(async (r) => {
          const c = r.classroom!
          const [{ count: studentCount }, { count: assignmentCount }] = await Promise.all([
            supabase
              .from("classroom_members")
              .select("*", { count: "exact", head: true })
              .eq("classroom_id", c.id)
              .eq("role", "student"),
            supabase
              .from("assignments")
              .select("*", { count: "exact", head: true })
              .eq("classroom_id", c.id)
              .eq("status", "active"),
          ])
          return {
            id: c.id,
            name: c.name,
            subject: c.subject,
            join_code: c.join_code,
            student_count: studentCount ?? 0,
            active_assignments: assignmentCount ?? 0,
            my_role: r.role,
          }
        }),
      )

      setClassrooms(withCounts)
      setLoading(false)
    }

    fetchClassrooms()
  }, [user, role, isDemoMode])

  const isTeacher = role === "teacher"

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="size-6 shrink-0 text-foreground" />
          <h1 className="text-2xl font-bold tracking-tight">
            {isTeacher ? "Your Classrooms" : "My Classes"}
          </h1>
        </div>
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
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${ROLE_BADGE_STYLE[cls.my_role]}`}
                  >
                    {ROLE_LABEL[cls.my_role]}
                  </span>
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

                {(cls.my_role === "owner" || cls.my_role === "co_teacher") && (
                  <JoinCodeBadge code={cls.join_code} />
                )}
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
