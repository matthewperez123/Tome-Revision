"use client"

import { useState, useCallback, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGuidedSession } from "@/hooks/use-guided-session"
import { useEventQueue } from "@/hooks/use-event-queue"
import { useClockSync } from "@/hooks/use-clock-sync"
import { FocusGuard } from "@/components/guided-learning/focus-guard"
import { LockedReader } from "@/components/guided-learning/locked-reader"
import { TimerRing } from "@/components/guided-learning/timer-ring"
import { StudentStationView } from "@/components/guided-learning/student-station-view"
import { Loader2, CheckCircle } from "lucide-react"
import type { GuidedSessionMode, Station, SessionMessage } from "@/lib/guided-learning-types"

export default function GuidedSessionPage() {
  const params = useParams<{ sessionId: string }>()
  const sessionId = params.sessionId
  const router = useRouter()

  const { session, participants, isLoading } = useGuidedSession(sessionId)
  const { queueEvent, flush } = useEventQueue(sessionId)
  const { offset: clockOffset } = useClockSync()

  const [progressPct, setProgressPct] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [currentStationIndex, setCurrentStationIndex] = useState(0)
  const [messages, setMessages] = useState<SessionMessage[]>([])

  // Find current user's participant record
  const myParticipant = participants[0] // Student view only returns own record

  // Determine if this is a multi-station session
  const stations: Station[] = session?.stations ?? []
  const isMultiStation = stations.length > 0

  // Sync station index from participant record
  useEffect(() => {
    if (myParticipant?.current_station_index != null) {
      setCurrentStationIndex(myParticipant.current_station_index)
    }
  }, [myParticipant?.current_station_index])

  // Fetch messages for multi-station sessions
  useEffect(() => {
    if (!isMultiStation || !sessionId) return
    async function loadMessages() {
      try {
        const res = await fetch(`/api/guided-sessions/${sessionId}/messages`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages ?? [])
        }
      } catch { /* ignore */ }
    }
    loadMessages()
    // Poll for new messages every 10 seconds
    const interval = setInterval(loadMessages, 10_000)
    return () => clearInterval(interval)
  }, [isMultiStation, sessionId])

  // Handle session ending
  useEffect(() => {
    if (session?.status === "ended" || session?.status === "completed") {
      setIsComplete(true)
    }
  }, [session?.status])

  // Check if already submitted
  useEffect(() => {
    if (
      myParticipant?.status === "submitted" ||
      myParticipant?.status === "completed" ||
      myParticipant?.status === "kicked"
    ) {
      setIsComplete(true)
    }
  }, [myParticipant?.status])

  const handleAutoSubmit = useCallback(async () => {
    queueEvent("submit", { reason: "auto_submit_violations", progress_pct: progressPct })
    await flush()
    setIsComplete(true)
  }, [queueEvent, flush, progressPct])

  const handleTimerExpire = useCallback(async () => {
    queueEvent("submit", { reason: "timer_expired", progress_pct: progressPct })
    await flush()
    setIsComplete(true)
  }, [queueEvent, flush, progressPct])

  const handleProgress = useCallback((pct: number) => {
    setProgressPct(pct)
  }, [])

  const handleComplete = useCallback(async () => {
    queueEvent("submit", { reason: "completed", progress_pct: 100 })
    await flush()
    setIsComplete(true)
  }, [queueEvent, flush])

  // Multi-station handlers
  const handleStationComplete = useCallback(async (stationIndex: number) => {
    queueEvent("station_completed", { station_index: stationIndex })
    // Ask server to advance
    try {
      const res = await fetch(`/api/guided-sessions/${sessionId}/station-advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.advanced) {
          setCurrentStationIndex(data.new_station_index)
          queueEvent("station_started", { station_index: data.new_station_index })
        } else if (data.completed) {
          setIsComplete(true)
        }
      }
    } catch { /* will retry via realtime */ }
    await flush()
  }, [sessionId, queueEvent, flush])

  const handleStationProgress = useCallback((stationIndex: number, pct: number) => {
    setProgressPct(pct)
    queueEvent("progress_update", { station_index: stationIndex, progress_pct: pct })
  }, [queueEvent])

  const handleReflectionSave = useCallback(async (stationId: string, content: string, wordCount: number) => {
    try {
      await fetch(`/api/guided-sessions/${sessionId}/reflections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ station_id: stationId, content, word_count: wordCount }),
      })
    } catch { /* ignore */ }
  }, [sessionId])

  const handleReflectionSubmit = useCallback(async (stationId: string, content: string, wordCount: number) => {
    try {
      await fetch(`/api/guided-sessions/${sessionId}/reflections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ station_id: stationId, content, word_count: wordCount, submit: true }),
      })
      queueEvent("reflection_saved", { station_id: stationId, word_count: wordCount })
    } catch { /* ignore */ }
  }, [sessionId, queueEvent])

  const handleExit = useCallback(() => {
    queueEvent("submit", { reason: "early_exit", progress_pct: progressPct })
    flush().then(() => {
      router.push("/")
    })
  }, [queueEvent, flush, progressPct, router])

  const handleSessionExpire = useCallback(async () => {
    queueEvent("submit", { reason: "session_timer_expired", progress_pct: progressPct })
    await flush()
    setIsComplete(true)
  }, [queueEvent, flush, progressPct])

  // Loading
  if (isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin opacity-30" />
      </div>
    )
  }

  // Session completed
  if (isComplete) {
    // Multi-station: redirect to review page
    if (isMultiStation) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-gray-950">
          <CheckCircle className="h-16 w-16" style={{ color: "var(--tome-success, #2D9A47)" }} />
          <h1 className="text-2xl font-bold">Session Complete</h1>
          <p className="text-sm opacity-60">
            {myParticipant?.status === "kicked"
              ? "You were removed from this session."
              : "Your work has been submitted."}
          </p>
          <button
            onClick={() => router.push(`/learn/session/${sessionId}/review`)}
            className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
          >
            View Results
          </button>
        </div>
      )
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-gray-950">
        <CheckCircle className="h-16 w-16" style={{ color: "var(--tome-success, #2D9A47)" }} />
        <h1 className="text-2xl font-bold">Session Complete</h1>
        <p className="text-sm opacity-60">
          {myParticipant?.status === "kicked"
            ? "You were removed from this session."
            : "Your work has been submitted. You may close this window."}
        </p>
      </div>
    )
  }

  // Session not active yet
  if (session.status !== "active" && session.status !== "paused") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-sm opacity-50">Waiting for session to start...</p>
      </div>
    )
  }

  // ── Multi-station active session ──────────────────────────────────────────
  if (isMultiStation) {
    return (
      <FocusGuard
        sessionId={sessionId}
        mode={session.mode as GuidedSessionMode}
        onAutoSubmit={handleAutoSubmit}
        progressPct={progressPct}
      >
        <StudentStationView
          session={session}
          stations={stations}
          currentStationIndex={currentStationIndex}
          messages={messages}
          clockOffset={clockOffset}
          onStationComplete={handleStationComplete}
          onProgress={handleStationProgress}
          onReflectionSave={handleReflectionSave}
          onReflectionSubmit={handleReflectionSubmit}
          onExit={handleExit}
          onSessionExpire={handleSessionExpire}
        />
      </FocusGuard>
    )
  }

  // ── Legacy single-task active session ─────────────────────────────────────
  return (
    <FocusGuard
      sessionId={sessionId}
      mode={session.mode as GuidedSessionMode}
      onAutoSubmit={handleAutoSubmit}
      progressPct={progressPct}
    >
      <div className="relative min-h-screen bg-white dark:bg-gray-950">
        <div className="fixed right-4 top-4 z-50">
          <TimerRing
            endsAt={session.ends_at}
            totalDurationMinutes={session.time_limit_minutes}
            size={64}
            onExpire={handleTimerExpire}
          />
        </div>

        {session.status === "paused" && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center text-white">
              <p className="mb-2 text-lg font-semibold">Session Paused</p>
              <p className="text-sm opacity-70">Waiting for teacher to resume...</p>
            </div>
          </div>
        )}

        {session.type === "chapter" && session.book_id && session.chapter_index !== null && (
          <LockedReader
            sessionId={sessionId}
            bookId={session.book_id}
            chapterIndex={session.chapter_index}
            onProgress={handleProgress}
            onComplete={handleComplete}
            annotationsEnabled={session.annotations_enabled !== false}
            annotationVisibility={session.annotation_visibility ?? "collaborative"}
            presenceEnabled={session.presence_enabled !== false}
          />
        )}

        {session.type === "trial" && (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm opacity-50">
              Trial mode — quiz component renders here
            </p>
          </div>
        )}
      </div>
    </FocusGuard>
  )
}
