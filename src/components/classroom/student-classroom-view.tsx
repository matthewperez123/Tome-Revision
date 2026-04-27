"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, BookOpen, Users, BarChart2, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { TeacherAnnouncementComposer } from "@/components/classroom/teacher-announcement-composer"
import { TeacherAssignmentComposer } from "@/components/classroom/teacher-assignment-composer"

type Tab = "feed" | "assignments" | "classmates" | "progress"

interface ClassroomInfo {
  id: string
  name: string
  subject: string | null
}

interface AnnouncementItem {
  id: string
  content: string
  pinned: boolean
  created_at: string
  teacher_name: string
}

interface AssignmentItem {
  id: string
  title: string
  type: string
  due_date: string
  status: string // submission status
}

interface Classmate {
  id: string
  display_name: string
  avatar_url: string | null
}

export function StudentClassroomView({ classroomId }: { classroomId: string }) {
  const { user } = useAuth()
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null)
  const [tab, setTab] = useState<Tab>("feed")
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [assignments, setAssignments] = useState<AssignmentItem[]>([])
  const [classmates, setClassmates] = useState<Classmate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      const supabase = createClient()

      // Classroom info
      const { data: cls } = await supabase
        .from("classrooms")
        .select("id, name, subject")
        .eq("id", classroomId)
        .single()
      if (cls) setClassroom(cls)

      // Announcements
      const { data: announcementData } = await supabase
        .from("classroom_announcements")
        .select("id, content, pinned, created_at, teacher_id, profiles!classroom_announcements_teacher_id_fkey(display_name)")
        .eq("classroom_id", classroomId)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10)

      if (announcementData) {
        setAnnouncements(
          announcementData.map((a) => ({
            id: a.id,
            content: a.content,
            pinned: a.pinned,
            created_at: a.created_at,
            teacher_name: ((a as any).profiles as { display_name: string } | null)?.display_name ?? "Teacher",
          })),
        )
      }

      // Assignments
      const { data: assignmentData } = await supabase
        .from("assignments")
        .select("id, title, type, due_date")
        .eq("classroom_id", classroomId)
        .eq("status", "active")
        .order("due_date", { ascending: true })

      if (assignmentData) {
        // Get student's submission statuses
        const { data: submissions } = await supabase
          .from("assignment_submissions")
          .select("assignment_id, status")
          .eq("student_id", user!.id)
          .in("assignment_id", assignmentData.map((a) => a.id))

        const statusMap = Object.fromEntries(
          (submissions ?? []).map((s) => [s.assignment_id, s.status]),
        )

        setAssignments(
          assignmentData.map((a) => ({
            ...a,
            status: statusMap[a.id] ?? "not_started",
          })),
        )
      }

      // Classmates
      const { data: memberData } = await supabase
        .from("classroom_members")
        .select("student_id, profiles(id, display_name, avatar_url)")
        .eq("classroom_id", classroomId)

      if (memberData) {
        setClassmates(
          memberData
            .map((m) => {
              const p = (m as any).profiles as { id: string; display_name: string; avatar_url: string | null } | null
              return { id: p?.id ?? m.student_id, display_name: p?.display_name ?? "Student", avatar_url: p?.avatar_url ?? null }
            })
            .filter((c) => c.id !== user!.id), // exclude self
        )
      }

      setLoading(false)
    }

    fetchData()
  }, [user, classroomId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!classroom) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-muted-foreground">Classroom not found</p>
        <Link href="/classroom" className="mt-2 text-sm text-[#D4A04C] hover:underline">
          Back to classes
        </Link>
      </div>
    )
  }

  const tabs: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: "feed", label: "Feed", icon: MessageCircle },
    { key: "assignments", label: "Assignments", icon: BookOpen },
    { key: "classmates", label: "Classmates", icon: Users },
    { key: "progress", label: "My Progress", icon: BarChart2 },
  ]

  const statusColors: Record<string, string> = {
    not_started: "bg-stone-100 text-stone-500",
    in_progress: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    submitted: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    graded: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/classroom"
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> My Classes
      </Link>

      <h1 className="text-2xl font-bold">{classroom.name}</h1>
      {classroom.subject && (
        <span className="mt-1 inline-block text-xs bg-[#D4A04C]/10 text-[#D4A04C] px-2 py-0.5 rounded-full">
          {classroom.subject}
        </span>
      )}

      {/* Real-mode owner/co_teacher composers — invisible to students. */}
      <div className="mt-6 space-y-2">
        <TeacherAnnouncementComposer classroomId={classroomId} />
        <TeacherAssignmentComposer classroomId={classroomId} />
        <Link
          href={`/classroom/${classroomId}/gradebook`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          Open gradebook →
        </Link>
      </div>

      {/* Tab bar */}
      <div className="mt-2 flex gap-1 overflow-x-auto border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-medium ${
              tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            <t.icon className="size-3.5" />
            {t.label}
            {tab === t.key && (
              <motion.div layoutId="student-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* Feed Tab */}
        {tab === "feed" && (
          <div className="space-y-3">
            {announcements.length === 0 && assignments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No updates yet</p>
            ) : (
              <>
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className={`rounded-xl border-l-4 bg-card p-4 ${a.pinned ? "border-l-[#D4A04C]" : "border-l-muted"}`}
                  >
                    <p className="text-sm">{a.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {a.teacher_name} · {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                ))}
                {assignments.slice(0, 3).map((a) => (
                  <Link
                    key={a.id}
                    href={`/classroom/${classroomId}/assignment/${a.id}`}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <BookOpen className="size-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(a.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[a.status] ?? ""}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {tab === "assignments" && (
          <div className="space-y-2">
            {assignments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No assignments yet</p>
            ) : (
              assignments.map((a) => (
                <Link
                  key={a.id}
                  href={`/classroom/${classroomId}/assignment/${a.id}`}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.type} · Due {new Date(a.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[a.status] ?? ""}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Classmates Tab */}
        {tab === "classmates" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {classmates.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No classmates yet
              </p>
            ) : (
              classmates.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {c.display_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium truncate">{c.display_name}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Progress Tab */}
        {tab === "progress" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card p-4">
                <p className="text-2xl font-bold">{assignments.filter((a) => a.status === "graded" || a.status === "submitted").length}</p>
                <p className="text-xs text-muted-foreground">Assignments completed</p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-2xl font-bold">{assignments.filter((a) => a.status === "not_started").length}</p>
                <p className="text-xs text-muted-foreground">Not started</p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground py-4">
              Detailed progress charts coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
