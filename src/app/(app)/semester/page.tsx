"use client"

/**
 * Student Semester — a read-only agenda of the teacher's schedule. Students
 * can't read the teacher-only semester_plan tables, so the schedule is derived
 * from the assignments the teacher has published to their classes (the same
 * rows the student is already authorized to read). Reading and quiz work is
 * laid out chronologically by due date and grouped by month so a student can
 * see what's coming across the term.
 */

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CalendarRange, BookOpen, Brain, MessageCircle, PenTool, Highlighter, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getBook } from "@/lib/content"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

type AssignmentType = "reading" | "quiz" | "discussion" | "essay" | "annotation"

interface ScheduleItem {
  id: string
  title: string
  type: AssignmentType
  due_date: string | null
  classroom_id: string
  classroom_name: string
  book_id: string | null
  status: string
}

const TYPE_ICONS: Record<AssignmentType, typeof BookOpen> = {
  reading: BookOpen,
  quiz: Brain,
  discussion: MessageCircle,
  essay: PenTool,
  annotation: Highlighter,
}

const TYPE_COLORS: Record<AssignmentType, string> = {
  reading: "text-blue-500",
  quiz: "text-purple-500",
  discussion: "text-amber-500",
  essay: "text-green-500",
  annotation: "text-pink-500",
}

function monthKey(due: string | null): string {
  if (!due) return "No date set"
  return new Date(due).toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export default function StudentSemesterPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    ;(async () => {
      const supabase = createClient()

      const { data: memberships } = await supabase
        .from("classroom_members")
        .select("classroom_id, classrooms(name)")
        .eq("student_id", user.id)

      if (cancelled) return
      if (!memberships?.length) {
        setItems([])
        setLoading(false)
        return
      }

      const classroomIds = memberships.map((m) => m.classroom_id)
      const classroomNames = Object.fromEntries(
        memberships.map((m) => [
          m.classroom_id,
          ((m as any).classrooms as { name: string } | null)?.name ?? "Class",
        ]),
      )

      const { data: rows } = await supabase
        .from("assignments")
        .select("id, title, type, due_date, classroom_id, book_id")
        .in("classroom_id", classroomIds)
        .eq("status", "active")
        .order("due_date", { ascending: true, nullsFirst: false })

      if (cancelled) return

      const list = (rows ?? []) as Array<{
        id: string
        title: string
        type: AssignmentType
        due_date: string | null
        classroom_id: string
        book_id: string | null
      }>

      const { data: submissions } = await supabase
        .from("assignment_submissions")
        .select("assignment_id, status")
        .eq("student_id", user.id)
        .in("assignment_id", list.map((a) => a.id))

      if (cancelled) return
      const statusMap = Object.fromEntries(
        (submissions ?? []).map((s) => [s.assignment_id, s.status]),
      )

      setItems(
        list.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          due_date: a.due_date,
          classroom_id: a.classroom_id,
          classroom_name: classroomNames[a.classroom_id] ?? "Class",
          book_id: a.book_id,
          status: statusMap[a.id] ?? "not_started",
        })),
      )
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  const groups = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>()
    for (const it of items) {
      const key = monthKey(it.due_date)
      const arr = map.get(key) ?? []
      arr.push(it)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [items])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-2.5">
        <CalendarRange className="size-6 shrink-0 text-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Semester</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Your teacher&apos;s schedule — reading and quizzes laid out across the term.
      </p>

      <div className="mt-6 space-y-8">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ))
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <CalendarRange className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold">No schedule yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                When your teacher schedules reading and quizzes, the term plan appears
                here. Join a class with a code from your teacher to see it.
              </p>
            </div>
            <Link
              href="/classroom"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              My Classes <ChevronRight className="size-4" />
            </Link>
          </div>
        ) : (
          groups.map(([month, group]) => (
            <section key={month}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {month}
              </h2>
              <ol className="relative space-y-2 border-l border-border pl-4">
                {group.map((it) => {
                  const Icon = TYPE_ICONS[it.type] ?? BookOpen
                  const bookTitle = it.book_id ? getBook(it.book_id)?.title ?? null : null
                  const dayLabel = it.due_date
                    ? new Date(it.due_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : "No due date"
                  return (
                    <li key={it.id} className="relative">
                      <span className="absolute -left-[21px] top-4 size-2 rounded-full bg-border" aria-hidden />
                      <Link
                        href={`/classroom/${it.classroom_id}/assignment/${it.id}`}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:bg-muted/50"
                      >
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted ${TYPE_COLORS[it.type] ?? "text-foreground"}`}
                        >
                          <Icon className="size-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{it.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {it.classroom_name}
                            <span className="capitalize"> · {it.type.replace("_", " ")}</span>
                            {bookTitle ? ` · ${bookTitle}` : ""}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">{dayLabel}</span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
