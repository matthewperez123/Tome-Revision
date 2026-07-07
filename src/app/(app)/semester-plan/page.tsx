"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarRange, Users, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { RUBRIC } from "@/lib/semester-plan/rubric"

type PlannerClassroom = {
  id: string
  name: string
  subject: string | null
  student_count: number
}

/**
 * Top-level Semester Planning landing. The planner itself lives per-classroom
 * at /classroom/[id]/semester-plan; this page lists the classrooms the teacher
 * owns or co-teaches and links into each one's planner so the nav item has a
 * stable id-less entry point.
 */
export default function SemesterPlanningLanding() {
  const { user, role, isDemoMode } = useAuth()
  const [classrooms, setClassrooms] = useState<PlannerClassroom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode || !user) {
      setClassrooms([])
      setLoading(false)
      return
    }

    async function fetchClassrooms() {
      const supabase = createClient()

      // Planning is a teaching activity — only classrooms the viewer owns or
      // co-teaches. Role-per-classroom is the source of truth, not profile role.
      const { data: memberships } = await supabase
        .from("classroom_members")
        .select(
          `
          role,
          classroom:classrooms!inner(id, name, subject, archived)
        `,
        )
        .eq("student_id", user!.id)
        .in("role", ["owner", "co_teacher"])

      type Row = {
        role: string
        classroom: {
          id: string
          name: string
          subject: string | null
          archived: boolean | null
        } | null
      }

      const rows = ((memberships ?? []) as unknown as Row[]).filter(
        (r) => r.classroom && !r.classroom.archived,
      )

      if (rows.length === 0) {
        setClassrooms([])
        setLoading(false)
        return
      }

      const withCounts: PlannerClassroom[] = await Promise.all(
        rows.map(async (r) => {
          const c = r.classroom!
          const { count: studentCount } = await supabase
            .from("classroom_members")
            .select("*", { count: "exact", head: true })
            .eq("classroom_id", c.id)
            .eq("role", "student")

          return {
            id: c.id,
            name: c.name,
            subject: c.subject,
            student_count: studentCount ?? 0,
          }
        }),
      )

      setClassrooms(withCounts)
      setLoading(false)
    }

    fetchClassrooms()
  }, [user, role, isDemoMode])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-2.5">
        <CalendarRange className="size-6 shrink-0 text-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Semester Planning</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose a classroom to build or review its semester plan.
      </p>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border bg-muted" />
          ))}
        </div>
      ) : classrooms.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <CalendarRange className="size-7 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No classrooms to plan yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isDemoMode
              ? "Sign in as a teacher to plan your semester."
              : "Create a classroom to start building a semester plan."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {classrooms.map((cls) => (
            <Link
              key={cls.id}
              href={`/classroom/${cls.id}/semester-plan`}
              className="group block rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{cls.name}</h2>
                  {cls.subject && (
                    <span className="mt-1 inline-block rounded-full bg-[#D4A04C]/10 px-2 py-0.5 text-xs text-[#D4A04C]">
                      {cls.subject}
                    </span>
                  )}
                </div>
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  style={{ color: RUBRIC.lapis }}
                />
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="size-4" />
                {cls.student_count}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
