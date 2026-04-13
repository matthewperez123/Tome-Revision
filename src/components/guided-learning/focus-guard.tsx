"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useFocusGuard } from "@/hooks/use-focus-guard"
import { useEventQueue } from "@/hooks/use-event-queue"
import { ViolationWarningModal } from "./violation-warning-modal"
import type { GuidedSessionMode, FocusState } from "@/lib/guided-learning-types"
import {
  joinGuidedChannel,
  updateGuidedPresence,
  leaveGuidedChannel,
} from "@/lib/supabase/guided-presence"
import { useAuth } from "@/hooks/use-auth"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface FocusGuardProps {
  sessionId: string
  mode: GuidedSessionMode
  children: React.ReactNode
  onAutoSubmit: () => void
  progressPct?: number
}

/**
 * Wrapper component that enforces focus lockdown for guided learning sessions.
 *
 * - Requests fullscreen on mount
 * - Installs all focus/blur/keydown/contextmenu listeners via useFocusGuard
 * - Queues focus events via useEventQueue
 * - Broadcasts presence (focus state) to teacher via Supabase Realtime
 * - Shows ViolationWarningModal on violations
 */
export function FocusGuard({
  sessionId,
  mode,
  children,
  onAutoSubmit,
  progressPct = 0,
}: FocusGuardProps) {
  const { user, profile } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const presenceIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const { queueEvent } = useEventQueue(sessionId)

  const handleViolation = useCallback(
    (violation: { type: string; timestamp: string }) => {
      setShowWarning(true)
      queueEvent("violation", { violation_type: violation.type })
    },
    [queueEvent],
  )

  const { violationCount, focusState, violations } = useFocusGuard({
    mode,
    enabled: true,
    onViolation: handleViolation,
    onAutoSubmit,
    maxViolations: 3,
  })

  // Queue focus state changes as events
  const prevFocusRef = useRef<FocusState>("focused")
  useEffect(() => {
    if (focusState !== prevFocusRef.current) {
      if (focusState === "blurred") {
        queueEvent("focus_lost", {})
      } else if (focusState === "focused" && prevFocusRef.current !== "focused") {
        queueEvent("focus_regained", {})
      }
      prevFocusRef.current = focusState
    }
  }, [focusState, queueEvent])

  // Request fullscreen on mount
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen()
        }
      } catch {
        // Fullscreen not supported or denied — log but don't block
        console.warn("Fullscreen request denied")
      }
    }

    // Small delay to avoid browser blocking
    const timer = setTimeout(requestFullscreen, 500)

    return () => {
      clearTimeout(timer)
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  // Broadcast presence to teacher
  useEffect(() => {
    if (!user || !profile || !sessionId) return

    const channel = joinGuidedChannel(sessionId, {
      studentId: user.id,
      studentName: profile.display_name ?? "Student",
      focusState: "focused",
      progressPct,
      lastActivity: new Date().toISOString(),
    })
    channelRef.current = channel

    // Update presence every 10 seconds
    presenceIntervalRef.current = setInterval(() => {
      updateGuidedPresence(channel, {
        studentId: user.id,
        studentName: profile.display_name ?? "Student",
        focusState: prevFocusRef.current,
        progressPct,
        lastActivity: new Date().toISOString(),
      })
    }, 10_000)

    return () => {
      if (presenceIntervalRef.current) clearInterval(presenceIntervalRef.current)
      if (channelRef.current) leaveGuidedChannel(channelRef.current)
      channelRef.current = null
    }
  }, [user, profile, sessionId, progressPct])

  // Update presence on focus state change
  useEffect(() => {
    if (!channelRef.current || !user || !profile) return
    updateGuidedPresence(channelRef.current, {
      studentId: user.id,
      studentName: profile.display_name ?? "Student",
      focusState,
      progressPct,
      lastActivity: new Date().toISOString(),
    })
  }, [focusState, user, profile, progressPct])

  return (
    <>
      {children}

      <ViolationWarningModal
        isOpen={showWarning}
        violationCount={violationCount}
        maxViolations={3}
        mode={mode}
        onDismiss={() => setShowWarning(false)}
      />
    </>
  )
}
