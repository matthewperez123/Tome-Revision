"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, BookOpen, Brain, Clock, Users, MonitorPlay, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import type { GuidedSession } from "@/lib/guided-learning-types"
import { getAllDemoSessions } from "@/lib/guided-learning-demo"

// Demo sessions for preview when not authenticated
const DEMO_SESSIONS: (GuidedSession & { book_title?: string; participant_count: number })[] = [
  {
    id: "demo-1",
    teacher_id: "demo",
    classroom_id: null,
    join_code: "LAUREL-7K2",
    type: "chapter",
    book_id: "pride-and-prejudice",
    chapter_index: 3,
    trial_id: null,
    time_limit_minutes: 30,
    mode: "strict",
    status: "ended",
    starts_at: new Date(Date.now() - 3600000).toISOString(),
    ends_at: new Date(Date.now() - 1800000).toISOString(),
    paused_at: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    ended_at: new Date(Date.now() - 1800000).toISOString(),
    summary_data: { total_participants: 24, completed_count: 22, avg_progress_pct: 94, avg_score: 87, total_violations: 3, duration_seconds: 1800 },
    book_title: "Pride and Prejudice",
    participant_count: 24,
  },
  {
    id: "demo-2",
    teacher_id: "demo",
    classroom_id: null,
    join_code: "LAUREL-9MX",
    type: "trial",
    book_id: null,
    chapter_index: null,
    trial_id: "hamlet-act3",
    time_limit_minutes: 15,
    mode: "lenient",
    status: "ended",
    starts_at: new Date(Date.now() - 86400000).toISOString(),
    ends_at: new Date(Date.now() - 85500000).toISOString(),
    paused_at: null,
    created_at: new Date(Date.now() - 90000000).toISOString(),
    ended_at: new Date(Date.now() - 85500000).toISOString(),
    summary_data: { total_participants: 18, completed_count: 18, avg_progress_pct: 100, avg_score: 76, total_violations: 0, duration_seconds: 900 },
    book_title: "Hamlet — Act III Trial",
    participant_count: 18,
  },
]

export default function GuidedLearningListPage() {
  const { user, isDemoMode } = useAuth()
  const [sessions, setSessions] = useState<(GuidedSession & { book_title?: string; participant_count: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode || !user) {
      // Merge hardcoded demos with any localStorage sessions
      const localSessions = getAllDemoSessions().map((d) => ({
        ...d.session,
        book_title: d.bookTitle,
        participant_count: d.participants.length,
      }))
      const combined = [...localSessions, ...DEMO_SESSIONS]
      // Deduplicate by id
      const seen = new Set<string>()
      const deduped = combined.filter((s) => {
        if (seen.has(s.id)) return false
        seen.add(s.id)
        return true
      })
      setSessions(deduped)
      setIsLoading(false)
      return
    }

    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("guided_sessions")
        .select(`
          *,
          books:book_id (title),
          guided_session_participants (id)
        `)
        .eq("teacher_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (data) {
        setSessions(
          data.map((s: any) => ({
            ...s,
            book_title: s.books?.title,
            participant_count: s.guided_session_participants?.length ?? 0,
          })),
        )
      }
      setIsLoading(false)
    }

    load()
  }, [user, isDemoMode])

  const [filter, setFilter] = useState<"active" | "upcoming" | "past">("active")

  const activeSessions = sessions.filter(
    (s) => s.status === "lobby" || s.status === "active" || s.status === "paused",
  )
  const upcomingSessions = sessions.filter(
    (s) => s.status === "draft" || s.status === "scheduled",
  )
  const pastSessions = sessions.filter(
    (s) => s.status === "ended" || s.status === "completed" || s.status === "cancelled",
  )

  const filteredSessions =
    filter === "active"
      ? activeSessions
      : filter === "upcoming"
        ? upcomingSessions
        : pastSessions

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
          >
            Guided Learning
          </h1>
          <p className="text-sm opacity-60">
            Proctored reading and trial sessions
          </p>
        </div>
        <Link href="/teacher/guided-learning/new">
          <Button
            className="gap-2 text-white"
            style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
          >
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        {(["active", "upcoming", "past"] as const).map((tab) => {
          const count = tab === "active" ? activeSessions.length : tab === "upcoming" ? upcomingSessions.length : pastSessions.length
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="flex-1 rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors"
              style={{
                backgroundColor: filter === tab ? "var(--background)" : "transparent",
                boxShadow: filter === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                color: filter === tab ? "inherit" : "rgba(128,128,128,0.6)",
              }}
            >
              {tab} {count > 0 && <span className="ml-1 opacity-50">({count})</span>}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin opacity-30" />
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(99, 102, 241, 0.08)" }}
          >
            <MonitorPlay className="h-8 w-8" style={{ color: "var(--tome-indigo, #6366F1)" }} />
          </div>
          <div>
            <p className="font-medium">
              {filter === "active"
                ? "No active sessions"
                : filter === "upcoming"
                  ? "No upcoming sessions"
                  : "No past sessions"}
            </p>
            <p className="mt-1 text-sm opacity-50">
              Create a new guided session to get started.
            </p>
          </div>
          <Link href="/teacher/guided-learning/new">
            <Button
              className="gap-2 text-white"
              style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
            >
              <Plus className="h-4 w-4" />
              New Session
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  )
}

function SessionCard({
  session,
}: {
  session: GuidedSession & { book_title?: string; participant_count: number }
}) {
  const statusColors: Record<string, { bg: string; text: string; label?: string }> = {
    draft: { bg: "rgba(128, 128, 128, 0.08)", text: "rgba(128, 128, 128, 0.6)", label: "Draft" },
    scheduled: { bg: "rgba(99, 102, 241, 0.08)", text: "var(--tome-indigo, #6366F1)", label: "Scheduled" },
    lobby: { bg: "rgba(99, 102, 241, 0.1)", text: "var(--tome-indigo, #6366F1)", label: "Lobby" },
    active: { bg: "rgba(45, 154, 71, 0.1)", text: "var(--tome-success, #2D9A47)", label: "Active" },
    paused: { bg: "rgba(200, 128, 31, 0.1)", text: "var(--tome-warning, #C8801F)", label: "Paused" },
    ended: { bg: "rgba(128, 128, 128, 0.08)", text: "rgba(128, 128, 128, 0.6)", label: "Completed" },
    completed: { bg: "rgba(128, 128, 128, 0.08)", text: "rgba(128, 128, 128, 0.6)", label: "Completed" },
    cancelled: { bg: "rgba(200, 74, 82, 0.08)", text: "var(--tome-error, #C84A52)", label: "Cancelled" },
  }
  const sc = statusColors[session.status] ?? statusColors.ended

  return (
    <Link href={`/teacher/guided-learning/${session.id}`}>
      <div
        className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
        style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: "rgba(99, 102, 241, 0.08)" }}
        >
          {session.type === "chapter" ? (
            <BookOpen className="h-5 w-5" style={{ color: "var(--tome-indigo, #6366F1)" }} />
          ) : (
            <Brain className="h-5 w-5" style={{ color: "var(--tome-indigo, #6366F1)" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold">
            {(session as any).title || session.book_title || `${session.type} session`}
          </p>
          <div className="flex items-center gap-3 text-xs opacity-50">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />{session.time_limit_minutes}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />{session.participant_count}
            </span>
            <span>{session.join_code}</span>
          </div>
        </div>

        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: sc.bg, color: sc.text }}
        >
          {sc.label ?? session.status}
        </span>
      </div>
    </Link>
  )
}
