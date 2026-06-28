"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { SessionLobby } from "./session-lobby"
import { StudentMonitorCard } from "./student-monitor-card"
import { TeacherControlsBar } from "./teacher-controls-bar"
import { SessionSummaryView } from "./session-summary"
import { MessagingPanel } from "./messaging-panel"
import { TeacherAnnotationReview } from "./annotations/teacher-annotation-review"
import { VirgilSurface } from "@/components/virgil/VirgilSurface"
import { Loader2, MessageSquareText } from "lucide-react"
import Link from "next/link"
import {
  getDemoSession,
  updateDemoSessionStatus,
  extendDemoSession,
  resumeDemoSession,
  kickDemoParticipant,
  simulateDemoProgress,
  type DemoSession,
} from "@/lib/guided-learning-demo"
import type { GuidedPresence, FocusState, SessionMessage, MessageType, Station } from "@/lib/guided-learning-types"

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
  const [messages, setMessages] = useState<SessionMessage[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [rightTab, setRightTab] = useState<"messages" | "virgil">("messages")
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

  // Load messages and stations for real sessions
  useEffect(() => {
    if (isDemoMode || !user) return
    async function loadExtra() {
      const [msgRes, stRes] = await Promise.all([
        fetch(`/api/guided-sessions/${sessionId}/messages`),
        fetch(`/api/guided-sessions/${sessionId}`),
      ])
      if (msgRes.ok) {
        const data = await msgRes.json()
        setMessages(data.messages ?? [])
      }
      if (stRes.ok) {
        const data = await stRes.json()
        setStations(data.session?.stations ?? data.session?.guided_session_stations ?? [])
      }
    }
    loadExtra()
    // Poll messages every 5 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/guided-sessions/${sessionId}/messages`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages ?? [])
        }
      } catch { /* ignore */ }
    }, 5000)
    return () => clearInterval(interval)
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
    // Legacy: broadcast message via control endpoint
    if (!isDemoMode && user) {
      fetch(`/api/guided-sessions/${sessionId}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", message: _message }),
      })
    }
  }, [isDemoMode, user, sessionId])

  const handleSendTypedMessage = useCallback(async (params: {
    message_type: MessageType
    content: string
    recipient_id: string | null
  }) => {
    if (isDemoMode) {
      // Add to local messages for demo
      const msg: SessionMessage = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        sender_id: "teacher",
        recipient_id: params.recipient_id,
        message_type: params.message_type,
        content: params.content,
        station_index: null,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, msg])
      return
    }

    await fetch(`/api/guided-sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message_type: params.message_type,
        content: params.content,
        recipient_id: params.recipient_id,
      }),
    })
  }, [isDemoMode, sessionId])

  const handleAdvanceAll = useCallback(async () => {
    if (isDemoMode) return
    await fetch(`/api/guided-sessions/${sessionId}/control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "advance_station" }),
    })
  }, [isDemoMode, sessionId])

  const handleAdvanceStudent = useCallback(async (studentId: string) => {
    if (isDemoMode) return
    await fetch(`/api/guided-sessions/${sessionId}/control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "advance_student", student_id: studentId }),
    })
  }, [isDemoMode, sessionId])

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

  // Ended / Completed state
  if (session.status === "ended" || session.status === "completed") {
    return (
      <div>
        <SessionSummaryView session={session} participants={participants} />
        <div className="flex justify-center pb-8">
          <Link
            href={`/teacher/guided-learning/${sessionId}/review`}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
          >
            View Detailed Review
          </Link>
        </div>
      </div>
    )
  }

  // Active / Paused state
  const hasStations = stations.length > 0
  // Virgil needs real server auth for /api/virgil — demo sessions can't reach it.
  const canUseVirgil = !isDemoMode && !!user

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">
          {(session as any).title || demoState.bookTitle || "Guided Session"}
        </h1>
        <p className="text-sm opacity-60">
          {participants.length} students &middot; {session.mode} mode
          {hasStations && ` · ${stations.length} stations`}
        </p>
      </div>

      {/* Controls bar */}
      <div className="mb-4">
        <TeacherControlsBar
          session={session}
          stations={hasStations ? stations : undefined}
          onPause={handlePause}
          onResume={handleResume}
          onExtend={handleExtend}
          onEnd={handleEnd}
          onSendMessage={handleSendMessage}
          onExpire={handleEnd}
          onAdvanceAll={hasStations ? handleAdvanceAll : undefined}
        />
      </div>

      {/* Main layout: student grid + messaging panel */}
      <div className="flex gap-4">
        {/* Student grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {participants.map((p) => (
              <StudentMonitorCard
                key={p.id}
                participant={p}
                presence={presences.get(p.student_id)}
                stations={hasStations ? stations : undefined}
                onKick={handleKick}
                onMessage={(studentId) => setSelectedStudentIds(new Set([studentId]))}
                onAdvance={hasStations ? handleAdvanceStudent : undefined}
              />
            ))}
          </div>
        </div>

        {/* Right rail — tabbed: Messages / Ask Virgil */}
        <div className="hidden w-80 shrink-0 lg:block">
          <div
            className="sticky top-4 flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border"
            style={{ borderColor: "rgba(128,128,128,0.12)" }}
          >
            {/* Tab strip — only show Virgil tab when real auth backs /api/virgil */}
            {canUseVirgil && (
              <div
                className="flex shrink-0 items-center gap-1 border-b px-2 py-1.5"
                style={{ borderColor: "rgba(128,128,128,0.12)" }}
              >
                <button
                  type="button"
                  onClick={() => setRightTab("messages")}
                  className="flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors"
                  style={
                    rightTab === "messages"
                      ? { backgroundColor: "var(--tome-indigo, #6366F1)", color: "#fff" }
                      : { color: "var(--tome-ink-soft, #6b7280)" }
                  }
                >
                  Messages
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab("virgil")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors"
                  style={
                    rightTab === "virgil"
                      ? { color: "#fff", backgroundImage: "linear-gradient(110deg,#6366F1 0%,#8B5CF6 35%,#06B6D4 70%,#6366F1 100%)" }
                      : { color: "var(--tome-ink-soft, #6b7280)" }
                  }
                >
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full font-serif text-[10px] font-bold leading-none text-white"
                    style={{ backgroundImage: "linear-gradient(135deg,#E6C76E 0%,#C8A24B 55%,#9C7A2E 100%)" }}
                    aria-hidden
                  >
                    V
                  </span>
                  Ask Virgil
                </button>
              </div>
            )}

            {/* Panel body */}
            <div className="min-h-0 flex-1">
              {canUseVirgil && rightTab === "virgil" ? (
                <VirgilSurface
                  surface={{ kind: "guided-session", sessionId }}
                  dense
                  hideHeader
                  className="h-full rounded-none border-0"
                  placeholder="Ask Virgil about this session…"
                  hint="Generate discussion prompts, summarize the room, or steer a struggling student."
                />
              ) : (
                <MessagingPanel
                  sessionId={sessionId}
                  participants={participants}
                  messages={messages}
                  selectedStudentIds={selectedStudentIds.size > 0 ? selectedStudentIds : undefined}
                  onSend={handleSendTypedMessage}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Margin annotation moderation (real sessions only — needs Liveblocks auth) */}
      {!isDemoMode && user && session.annotations_enabled !== false && (
        <div className="mt-4 rounded-xl border" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
          <button
            type="button"
            onClick={() => setShowAnnotations((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquareText className="h-4 w-4 opacity-60" />
              Margin Annotations
              <span className="text-xs font-normal opacity-50">
                {session.annotation_visibility === "private_to_teacher"
                  ? "private to you"
                  : "shared with the class"}
              </span>
            </span>
            <span className="text-xs font-medium opacity-60">
              {showAnnotations ? "Hide" : "Review"}
            </span>
          </button>
          {showAnnotations && (
            <div className="border-t" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
              <TeacherAnnotationReview
                session={session}
                stations={stations}
                participants={participants}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
