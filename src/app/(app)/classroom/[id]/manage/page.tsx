"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Copy, Check, Users, BookOpen, TrendingUp, Plus, Settings, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { rotateJoinCode } from "@/lib/actions/classrooms"
import { useAuth } from "@/hooks/use-auth"

import { SemesterPlanTab } from "@/components/classroom/semester-timeline"

type Tab = "overview" | "students" | "assignments" | "announcements" | "semester-plan"

interface ClassroomInfo {
  id: string
  name: string
  subject: string | null
  join_code: string
  description: string | null
  leaderboard_enabled: boolean
}

interface MemberInfo {
  student_id: string
  display_name: string
  avatar_url: string | null
  joined_at: string
}

interface AssignmentInfo {
  id: string
  title: string
  type: string
  status: string
  due_date: string
  created_at: string
}

export default function ClassroomManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, isDemoMode } = useAuth()
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null)
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [assignments, setAssignments] = useState<AssignmentInfo[]>([])
  const [tab, setTab] = useState<Tab>("overview")
  const [copied, setCopied] = useState(false)
  const [rotating, setRotating] = useState(false)
  const [loading, setLoading] = useState(true)

  async function handleRotate() {
    if (isDemoMode || !user || rotating || !classroom) return
    setRotating(true)
    const res = await rotateJoinCode(classroom.id)
    if (res.ok) {
      setClassroom({ ...classroom, join_code: res.data.joinCode })
      toast.success("New join code generated")
    } else {
      toast.error(res.error)
    }
    setRotating(false)
  }

  useEffect(() => {
    if (!user && !isDemoMode) return

    async function fetchData() {
      const supabase = createClient()

      // Fetch classroom
      const { data: cls } = await supabase
        .from("classrooms")
        .select("id, name, subject, join_code, description, leaderboard_enabled")
        .eq("id", id)
        .single()

      if (cls) setClassroom(cls)

      // Fetch members
      const { data: membersData } = await supabase
        .from("classroom_members")
        .select("student_id, joined_at, profiles(display_name, avatar_url)")
        .eq("classroom_id", id)
        .order("joined_at", { ascending: false })

      if (membersData) {
        setMembers(
          membersData.map((m) => ({
            student_id: m.student_id,
            display_name: ((m as any).profiles as { display_name: string } | null)?.display_name ?? "Student",
            avatar_url: ((m as any).profiles as { avatar_url: string | null } | null)?.avatar_url ?? null,
            joined_at: m.joined_at,
          })),
        )
      }

      // Fetch assignments
      const { data: assignmentData } = await supabase
        .from("assignments")
        .select("id, title, type, status, due_date, created_at")
        .eq("classroom_id", id)
        .order("created_at", { ascending: false })

      if (assignmentData) setAssignments(assignmentData)

      setLoading(false)
    }

    fetchData()
  }, [user, isDemoMode, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!classroom) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Classroom not found</p>
        <Link href="/classroom" className="mt-2 text-sm text-[#D4A04C] hover:underline">
          Back to classrooms
        </Link>
      </div>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "students", label: `Students (${members.length})` },
    { key: "assignments", label: `Assignments (${assignments.length})` },
    { key: "announcements", label: "Announcements" },
    { key: "semester-plan", label: "Semester Plan" },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/classroom"
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" /> Classrooms
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{classroom.name}</h1>
        {classroom.subject && (
          <span className="text-xs bg-[#D4A04C]/10 text-[#D4A04C] px-2 py-0.5 rounded-full">
            {classroom.subject}
          </span>
        )}
        <button
          onClick={() => {
            navigator.clipboard.writeText(classroom.join_code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 text-xs font-mono text-muted-foreground hover:bg-muted/80"
        >
          Code: {classroom.join_code}
          {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
        </button>
        {!isDemoMode && user && (
          <button
            onClick={handleRotate}
            disabled={rotating}
            title="Generate a new join code"
            className="inline-flex items-center justify-center rounded-lg bg-muted p-1.5 text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
          >
            <RefreshCw className={`size-3 ${rotating ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            {t.label}
            {tab === t.key && (
              <motion.div
                layoutId="manage-tab"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {tab === "overview" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Users, label: "Students", value: members.length, color: "text-indigo-500" },
              { icon: BookOpen, label: "Assignments", value: assignments.length, color: "text-blue-500" },
              { icon: TrendingUp, label: "Active", value: assignments.filter((a) => a.status === "active").length, color: "text-green-500" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-4">
                <stat.icon className={`size-4 ${stat.color}`} />
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "students" && (
          <div className="space-y-2">
            {members.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No students have joined yet. Share your join code: <span className="font-mono font-medium">{classroom.join_code}</span>
              </p>
            ) : (
              members.map((member) => (
                <Link
                  key={member.student_id}
                  href={`/classroom/${id}/student/${member.student_id}`}
                  className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {member.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member.display_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.joined_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {tab === "assignments" && (
          <div className="space-y-3">
            <Link href={`/classroom/${id}/assignments/create`}>
              <Button size="sm" className="gap-1.5">
                <Plus className="size-3.5" />
                Create Assignment
              </Button>
            </Link>
            {assignments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No assignments yet. Create your first one above.
              </p>
            ) : (
              assignments.map((a) => (
                <Link
                  key={a.id}
                  href={`/classroom/${id}/assignment/${a.id}`}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.type} · Due {new Date(a.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    a.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" :
                    a.status === "draft" ? "bg-muted text-muted-foreground" :
                    "bg-stone-100 text-stone-500"
                  }`}>
                    {a.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}

        {tab === "announcements" && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Announcements coming soon
          </p>
        )}

        {tab === "semester-plan" && (
          <SemesterPlanTab classroomId={id} />
        )}
      </div>
    </div>
  )
}
