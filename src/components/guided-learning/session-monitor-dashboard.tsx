"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { SessionLobby } from "./session-lobby"
import { StudentMonitorCard } from "./student-monitor-card"
import { TeacherControlsBar } from "./teacher-controls-bar"
import { SessionSummaryView } from "./session-summary"
import { Loader2 } from "lucide-react"
import {
  getDemoSession,
  updateDemoSessionStatus,
  extendDemoSession,
  resumeDemoSession,
  kickDemoParticipant,
  simulateDemoProgress,
  type DemoSession,
} from "@/lib/guided-learning-demo"
import type { GuidedPresence, FocusState } from "@/lib/guided-learning-types"

interface SessionMonitorDashboardProps {
  sessionId: string
}

/**
 * Teacher monitoring dashboard layout.
 * In demo mode: uses localStorage-backed session state.
 * In auth mode: uses API + Supabase Realtime.
 */
export function SessionMonitorDashboard({ sessionId }: SessionMonitorDashboardProps) {
  const { isDemoMode, user } = useAuth()
  const [demoState, setDemoState] = useState<DemoSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [presences, setPresences] = useState<Map<string, GuidedPresence>>(new Map())
  const simulateRef = useRef<ReturnType<typeof setInterval>>(undefined)

  // Load session
  useEffect(() => {
    if (isDemoMode || !user) {
      const demo = getDemoSession(sessionId)
      setDemoState(demo)
      setIsLoading(false)
    } else {
      // Real mode: fetch from API
      fetch(`/api/guided-sessions/${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.session) {
            setDemoState({
              session: data.session,
              participants: data.participants ?? [],
              events: [],
              bookTitle: data.session.books?.title,
              bookAuthor: data.session.books?.author,
            })
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [sessionId, isDemoMode, user])

  // Simulate progress in demo mode when session is active
  useEffect(() => {
    if (!demoState || demoState.session.status !== "active") {
      if (simulateRef.current) clearInterval(simulateRef.current)
      return
    }

    // Generate initial presences
    const focusStates: FocusState[] = ["focused", "focused", "focused", "blurred", "focused"]
    const initialPresences = new Map<string, GuidedPresence>()
    demoState.participants.forEach((p, i) => {
      if (p.status === "active") {
        initialPresences.set(p.student_id, {
          studentId: p.student_id,
          studentName: p.profiles?.display_name ?? "Student",
          focusState: focusStates[i % focusStates.length],
          progressPct: p.progress_pct,
          lastActivity: new Date().toISOString(),
        })
      }
    })
    setPresences(initialPresences)

    // Simulate progress every 3 seconds
    simulateRef.current = setInterval(() => {
      const updated = simulateDemoProgress(sessionId)
      if (updated) {
        setDemoState({ ...updated })

        // Update presences with new progress and random focus states
        const newPresences = new Map<string, GuidedPresence>()
        updated.participants.forEach((p) => {
          if (p.status === "active") {
            const rand = Math.random()
            const focus: FocusState = rand < 0.8 ? "focused" : rand < 0.95 ? "blurred" : "violation"
            newPresences.set(p.student_id, {
              studentId: p.student_id,
              studentName: p.profiles?.display_name ?? "Student",
              focusState: focus,
              progressPct: p.progress_pct,
              lastActivity: new Date().toISOString(),
            })
          }
        })
        setPresences(newPresences)
      }
    }, 3000)

    return () => {
      if (simulateRef.current) clearInterval(simulateRef.current)
    }
  }, [demoState?.session.status, sessionId])

  // ── Actions ─────────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    setIsStarting(true)
    const updated = updateDemoSessionStatus(sessionId, "active")
    if (updated) setDemoState({ ...updated })
    setIsStarting(false)
  }, [sessionId])

  const handlePause = useCallback(() => {
    const updated = updateDemoSessionStatus(sessionId, "paused")
    if (updated) setDemoState({ ...updated })
  }, [sessionId])

  const handleResume = useCallback(() => {
    const updated = resumeDemoSession(sessionId)
    if (updated) setDemoState({ ...updated })
  }, [sessionId])

  const handleExtend = useCallback((minutes: number) => {
    const updated = extendDemoSession(sessionId, minutes)
    if (updated) setDemoState({ ...updated })
  }, [sessionId])

  const handleEnd = useCallback(() => {
    const updated = updateDemoSessionStatus(sessionId, "ended")
    if (updated) setDemoState({ ...updated })
  }, [sessionId])

  const handleKick = useCallback((studentId: string) => {
    const updated = kickDemoParticipant(sessionId, studentId)
    if (updated) setDemoState({ ...updated })
  }, [sessionId])

  const handleSendMessage = useCallback((_message: string) => {
    // In demo mode, just a no-op visual feedback could go here
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin opacity-30" />
      </div>
    )
  }

  if (!demoState) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm opacity-50">Session not found</p>
      </div>
    )
  }

  const { session, participants } = demoState

  // Lobby state
  if (session.status === "lobby") {
    return (
      <SessionLobby
        session={session}
        participants={participants}
        isTeacher
        bookTitle={demoState.bookTitle}
        bookAuthor={demoState.bookAuthor}
        onStart={handleStart}
        isStarting={isStarting}
      />
    )
  }

  // Ended state
  if (session.status === "ended") {
    return <SessionSummaryView session={session} participants={participants} />
  }

  // Active / Paused state
  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">
          {demoState.bookTitle ?? "Guided Session"}
        </h1>
        <p className="text-sm opacity-60">
          {participants.length} students &middot; {session.mode} mode
        </p>
      </div>

      {/* Controls bar — inline at top of section */}
      <div className="mb-4">
        <TeacherControlsBar
          session={session}
          onPause={handlePause}
          onResume={handleResume}
          onExtend={handleExtend}
          onEnd={handleEnd}
          onSendMessage={handleSendMessage}
          onExpire={handleEnd}
        />
      </div>

      {/* Student grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {participants.map((p) => (
          <StudentMonitorCard
            key={p.id}
            participant={p}
            presence={presences.get(p.student_id)}
            onKick={handleKick}
            onMessage={() => handleSendMessage(`Message for ${p.profiles?.display_name}`)}
          />
        ))}
      </div>
    </div>
  )
}
