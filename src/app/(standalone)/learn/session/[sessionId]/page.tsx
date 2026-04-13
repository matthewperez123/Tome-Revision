"use client"

import { useState, useCallback, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGuidedSession } from "@/hooks/use-guided-session"
import { useEventQueue } from "@/hooks/use-event-queue"
import { FocusGuard } from "@/components/guided-learning/focus-guard"
import { LockedReader } from "@/components/guided-learning/locked-reader"
import { TimerRing } from "@/components/guided-learning/timer-ring"
import { Loader2, CheckCircle } from "lucide-react"
import type { GuidedSessionMode } from "@/lib/guided-learning-types"

export default function GuidedSessionPage() {
  const params = useParams<{ sessionId: string }>()
  const sessionId = params.sessionId
  const router = useRouter()

  const { session, participants, isLoading } = useGuidedSession(sessionId)
  const { queueEvent, flush } = useEventQueue(sessionId)

  const [progressPct, setProgressPct] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Find current user's participant record
  const myParticipant = participants[0] // Student view only returns own record

  // Handle session ending
  useEffect(() => {
    if (session?.status === "ended") {
      setIsComplete(true)
    }
  }, [session?.status])

  // Check if already submitted
  useEffect(() => {
    if (myParticipant?.status === "submitted" || myParticipant?.status === "kicked") {
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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-gray-950">
        <CheckCircle
          className="h-16 w-16"
          style={{ color: "var(--tome-success, #2D9A47)" }}
        />
        <h1
          className="text-2xl font-bold"
        >
          Session Complete
        </h1>
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

  // Active session: render lockdown screen
  return (
    <FocusGuard
      sessionId={sessionId}
      mode={session.mode as GuidedSessionMode}
      onAutoSubmit={handleAutoSubmit}
      progressPct={progressPct}
    >
      <div className="relative min-h-screen bg-white dark:bg-gray-950">
        {/* Timer in top-right corner */}
        <div className="fixed right-4 top-4 z-50">
          <TimerRing
            endsAt={session.ends_at}
            totalDurationMinutes={session.time_limit_minutes}
            size={64}
            onExpire={handleTimerExpire}
          />
        </div>

        {/* Paused overlay */}
        {session.status === "paused" && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center text-white">
              <p className="mb-2 text-lg font-semibold">Session Paused</p>
              <p className="text-sm opacity-70">Waiting for teacher to resume...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {session.type === "chapter" && session.book_id && session.chapter_index !== null && (
          <LockedReader
            sessionId={sessionId}
            bookId={session.book_id}
            chapterIndex={session.chapter_index}
            onProgress={handleProgress}
            onComplete={handleComplete}
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
