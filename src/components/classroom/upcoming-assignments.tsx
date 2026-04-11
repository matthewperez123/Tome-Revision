"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Brain, MessageCircle, PenTool, Highlighter, Clock, ChevronRight } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface UpcomingAssignment {
  id: string
  title: string
  type: "reading" | "quiz" | "discussion" | "essay" | "annotation"
  due_date: string
  classroom_id: string
  classroom_name: string
  book_title: string | null
  status: string
}

const TYPE_ICONS = {
  reading: BookOpen,
  quiz: Brain,
  discussion: MessageCircle,
  essay: PenTool,
  annotation: Highlighter,
}

const TYPE_COLORS = {
  reading: "text-blue-500",
  quiz: "text-purple-500",
  discussion: "text-amber-500",
  essay: "text-green-500",
  annotation: "text-pink-500",
}

function getCountdown(dueDate: string): { text: string; urgent: boolean } {
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { text: "Overdue", urgent: true }
  if (diffDays === 0) return { text: "Due today", urgent: true }
  if (diffDays === 1) return { text: "Due tomorrow", urgent: true }
  if (diffDays <= 3) return { text: `Due in ${diffDays} days`, urgent: false }
  return { text: `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, urgent: false }
}

export function UpcomingAssignments() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<UpcomingAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }

    async function fetchAssignments() {
      const supabase = createClient()

      // Get classrooms the student belongs to
      const { data: memberships } = await supabase
        .from("classroom_members")
        .select("classroom_id, classrooms(name)")
        .eq("student_id", user!.id)

      if (!memberships?.length) { setLoading(false); return }

      const classroomIds = memberships.map((m) => m.classroom_id)
      const classroomNames = Object.fromEntries(
        memberships.map((m) => [m.classroom_id, ((m as any).classrooms as { name: string })?.name ?? ""])
      )

      // Get active assignments from those classrooms, ordered by due date
      const { data: assignmentData } = await supabase
        .from("assignments")
        .select("id, title, type, due_date, classroom_id, book_id, books(title)")
        .in("classroom_id", classroomIds)
        .eq("status", "active")
        .gte("due_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // include 1 week overdue
        .order("due_date", { ascending: true })
        .limit(3)

      if (assignmentData) {
        // Get submission statuses
        const { data: submissions } = await supabase
          .from("assignment_submissions")
          .select("assignment_id, status")
          .eq("student_id", user!.id)
          .in("assignment_id", assignmentData.map((a) => a.id))

        const submissionMap = Object.fromEntries(
          (submissions ?? []).map((s) => [s.assignment_id, s.status])
        )

        setAssignments(
          assignmentData.map((a) => ({
            id: a.id,
            title: a.title,
            type: a.type as UpcomingAssignment["type"],
            due_date: a.due_date,
            classroom_id: a.classroom_id,
            classroom_name: classroomNames[a.classroom_id] ?? "",
            book_title: ((a as any).books as { title: string } | null)?.title ?? null,
            status: submissionMap[a.id] ?? "not_started",
          }))
        )
      }

      setLoading(false)
    }

    fetchAssignments()
  }, [user])

  // Don't render if no assignments
  if (loading || assignments.length === 0) return null

  return (
    <BlurFade delay={0.1}>
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Assignments</h3>
          <Link
            href="/classroom"
            className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground"
          >
            View all <ChevronRight className="size-3" />
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          {assignments.map((assignment) => {
            const Icon = TYPE_ICONS[assignment.type]
            const countdown = getCountdown(assignment.due_date)

            return (
              <Link
                key={assignment.id}
                href={`/classroom/${assignment.classroom_id}/assignment/${assignment.id}`}
                className="flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-border hover:bg-muted/50"
              >
                <div className={`flex size-10 items-center justify-center rounded-lg bg-muted ${TYPE_COLORS[assignment.type]}`}>
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {assignment.classroom_name}
                    {assignment.book_title && ` · ${assignment.book_title}`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-xs font-medium ${countdown.urgent ? "text-red-500" : "text-muted-foreground"}`}>
                    {countdown.text}
                  </span>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {assignment.status.replace("_", " ")}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </BlurFade>
  )
}
