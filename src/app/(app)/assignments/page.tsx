"use client"

/**
 * Student Assignments — every active piece of work a teacher has assigned across
 * the classrooms this student belongs to. This is the classroom-driven
 * counterpart to the personal practice "/quizzes" surface: the reader dashboard
 * shows a preview (UpcomingAssignments); this is the full list.
 *
 * A `?type=reading` query narrows it to reading assignments so the sidebar's
 * student "Reading" entry can point here without a second page.
 */

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  BookOpen,
  Brain,
  MessageCircle,
  PenTool,
  Highlighter,
  ClipboardList,
  ChevronRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getBook } from "@/lib/content"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

type AssignmentType = "reading" | "quiz" | "discussion" | "essay" | "annotation"

interface StudentAssignment {
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

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400",
  in_progress: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  submitted: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  graded: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
}

function dueLabel(due: string | null): { text: string; urgent: boolean } {
  if (!due) return { text: "No due date", urgent: false }
  const days = Math.ceil((new Date(due).getTime() - Date.now()) / 86_400_000)
  if (days < 0) return { text: "Overdue", urgent: true }
  if (days === 0) return { text: "Due today", urgent: true }
  if (days === 1) return { text: "Due tomorrow", urgent: true }
  if (days <= 3) return { text: `Due in ${days} days`, urgent: false }
  return {
    text: `Due ${new Date(due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    urgent: false,
  }
}

function AssignmentsList() {
  const { user, isLoading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const typeFilter = searchParams.get("type") as AssignmentType | null
  const readingOnly = typeFilter === "reading"

  const [assignments, setAssignments] = useState<StudentAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setAssignments([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    ;(async () => {
      const supabase = createClient()

      // Classrooms this student belongs to (student_id is the member column for
      // all roles). classroom_members RLS scopes this to the caller's rows.
      const { data: memberships } = await supabase
        .from("classroom_members")
        .select("classroom_id, classrooms(name)")
        .eq("student_id", user.id)

      if (cancelled) return
      if (!memberships?.length) {
        setAssignments([])
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

      // Student submission status per assignment.
      const { data: submissions } = await supabase
        .from("assignment_submissions")
        .select("assignment_id, status")
        .eq("student_id", user.id)
        .in("assignment_id", list.map((a) => a.id))

      if (cancelled) return
      const statusMap = Object.fromEntries(
        (submissions ?? []).map((s) => [s.assignment_id, s.status]),
      )

      setAssignments(
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

  const visible = useMemo(
    () => (readingOnly ? assignments.filter((a) => a.type === "reading") : assignments),
    [assignments, readingOnly],
  )

  const heading = readingOnly ? "Reading" : "Assignments"
  const HeadingIcon = readingOnly ? BookOpen : ClipboardList
  const subtitle = readingOnly
    ? "Reading your teachers have assigned across your classes."
    : "Everything your teachers have assigned across your classes."

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-2.5">
        <HeadingIcon className="size-6 shrink-0 text-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {!loading && visible.length > 0 && (
          <span className="ml-auto text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

      <div className="mt-6 space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <HeadingIcon className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold">
                {readingOnly ? "No reading assigned yet" : "No assignments yet"}
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                When your teacher assigns {readingOnly ? "reading" : "work"}, it will show up
                here. Join a class with a code from your teacher to get started.
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
          visible.map((a) => {
            const Icon = TYPE_ICONS[a.type] ?? ClipboardList
            const due = dueLabel(a.due_date)
            const bookTitle = a.book_id ? getBook(a.book_id)?.title ?? null : null
            return (
              <Link
                key={a.id}
                href={`/classroom/${a.classroom_id}/assignment/${a.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ${TYPE_COLORS[a.type] ?? "text-foreground"}`}
                >
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.classroom_name}
                    <span className="capitalize"> · {a.type.replace("_", " ")}</span>
                    {bookTitle ? ` · ${bookTitle}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`text-xs font-medium ${due.urgent ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    {due.text}
                  </span>
                  <p
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[a.status] ?? ""}`}
                  >
                    {a.status.replace("_", " ")}
                  </p>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function StudentAssignmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <div className="mt-6 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <AssignmentsList />
    </Suspense>
  )
}
