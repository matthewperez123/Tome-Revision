"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { TimerPhase } from "@/lib/guided-learning-types"

interface UseSessionTimerOptions {
  onExpire?: () => void
}

interface UseSessionTimerReturn {
  /** Minutes remaining */
  minutes: number
  /** Seconds remaining (0-59) */
  seconds: number
  /** Total seconds remaining */
  totalSeconds: number
  /** Progress from 0 (just started) to 1 (expired) */
  progress: number
  /** Whether the timer has expired */
  isExpired: boolean
  /** Timer phase for UI color changes */
  phase: TimerPhase
  /** Whether the timer is paused */
  isPaused: boolean
}

/**
 * High-precision countdown timer that derives remaining time from
 * the server's `ends_at` timestamp. Uses requestAnimationFrame for
 * smooth updates. Never trusts the client for "time's up" — the
 * server-stored `ends_at` is the source of truth.
 */
export function useSessionTimer(
  endsAt: string | null,
  totalDurationMinutes: number,
  options: UseSessionTimerOptions = {},
): UseSessionTimerReturn {
  const { onExpire } = options
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const rafRef = useRef<number>(0)

  const tick = useCallback(() => {
    if (!endsAt) {
      setTotalSeconds(totalDurationMinutes * 60)
      return
    }

    const remaining = Math.max(0, (new Date(endsAt).getTime() - Date.now()) / 1000)
    setTotalSeconds(Math.ceil(remaining))

    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true
      setIsExpired(true)
      onExpireRef.current?.()
      return
    }

    if (remaining > 0) {
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [endsAt, totalDurationMinutes])

  useEffect(() => {
    // Reset on new endsAt
    expiredRef.current = false
    setIsExpired(false)
    tick()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [tick])

  const totalDurationSeconds = totalDurationMinutes * 60
  const progress = totalDurationSeconds > 0
    ? Math.min(1, Math.max(0, 1 - totalSeconds / totalDurationSeconds))
    : 0

  const remainingRatio = totalSeconds / totalDurationSeconds

  let phase: TimerPhase = "normal"
  if (remainingRatio <= 0.1) phase = "critical"
  else if (remainingRatio <= 0.25) phase = "warning"

  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    progress,
    isExpired,
    phase,
    isPaused: !endsAt,
  }
}
