"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import type { TimerPhase } from "@/lib/guided-learning-types"

interface Props {
  /** ISO timestamp when the station ends */
  stationEndsAt: string | null
  /** ISO timestamp when the overall session ends */
  sessionEndsAt: string | null
  /** Called when station timer expires */
  onStationExpire?: () => void
  /** Called when session timer expires */
  onSessionExpire?: () => void
  /** Server clock offset in ms (client - server) */
  clockOffset?: number
  /** Whether session is paused */
  isPaused?: boolean
}

function getPhase(remainingMs: number, totalMs: number): TimerPhase {
  const ratio = remainingMs / totalMs
  if (ratio <= 0.1) return "critical"
  if (ratio <= 0.25) return "warning"
  return "normal"
}

const PHASE_COLORS: Record<TimerPhase, string> = {
  normal: "var(--foreground)",
  warning: "var(--gold-default, #B8924A)",
  critical: "var(--tome-error, #C84A52)",
}

function formatTime(ms: number): string {
  if (ms <= 0) return "0:00"
  const totalSec = Math.ceil(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

export function SessionTimer({
  stationEndsAt,
  sessionEndsAt,
  onStationExpire,
  onSessionExpire,
  clockOffset = 0,
  isPaused = false,
}: Props) {
  const [stationRemaining, setStationRemaining] = useState(0)
  const [sessionRemaining, setSessionRemaining] = useState(0)
  const [stationTotal, setStationTotal] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const stationExpiredRef = useRef(false)
  const sessionExpiredRef = useRef(false)
  const rafRef = useRef<number | undefined>(undefined)

  // Compute totals on mount
  useEffect(() => {
    const now = Date.now() - clockOffset
    if (stationEndsAt) {
      setStationTotal(new Date(stationEndsAt).getTime() - now + stationRemaining)
    }
    if (sessionEndsAt) {
      setSessionTotal(new Date(sessionEndsAt).getTime() - now + sessionRemaining)
    }
    // Only run on prop changes, not state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationEndsAt, sessionEndsAt, clockOffset])

  // Animation loop
  useEffect(() => {
    if (isPaused) return

    function tick() {
      const now = Date.now() - clockOffset

      if (stationEndsAt) {
        const remaining = Math.max(0, new Date(stationEndsAt).getTime() - now)
        setStationRemaining(remaining)
        if (remaining === 0 && !stationExpiredRef.current) {
          stationExpiredRef.current = true
          onStationExpire?.()
        }
      }

      if (sessionEndsAt) {
        const remaining = Math.max(0, new Date(sessionEndsAt).getTime() - now)
        setSessionRemaining(remaining)
        if (remaining === 0 && !sessionExpiredRef.current) {
          sessionExpiredRef.current = true
          onSessionExpire?.()
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [stationEndsAt, sessionEndsAt, clockOffset, isPaused, onStationExpire, onSessionExpire])

  // Reset expired flags when timestamps change
  useEffect(() => {
    stationExpiredRef.current = false
  }, [stationEndsAt])
  useEffect(() => {
    sessionExpiredRef.current = false
  }, [sessionEndsAt])

  const stationPhase = getPhase(stationRemaining, stationTotal || 1)
  const sessionPhase = getPhase(sessionRemaining, sessionTotal || 1)

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-1 rounded-xl border px-3 py-2 shadow-lg backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(var(--background-rgb, 255,255,255), 0.9)",
        borderColor: "rgba(128, 128, 128, 0.15)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label="Session timers"
    >
      {/* Station timer (primary) */}
      {stationEndsAt && (
        <div className="text-center">
          <p
            className={`text-xl font-bold tabular-nums ${stationPhase === "critical" ? "animate-pulse" : ""}`}
            style={{ color: PHASE_COLORS[stationPhase] }}
            role="timer"
            aria-live={stationPhase === "critical" ? "assertive" : "polite"}
            aria-label={`Station time remaining: ${formatTime(stationRemaining)}`}
          >
            {formatTime(stationRemaining)}
          </p>
          <p className="text-[9px] uppercase tracking-widest opacity-40">
            Station
          </p>
        </div>
      )}

      {/* Divider */}
      {stationEndsAt && sessionEndsAt && (
        <div className="h-px w-8 bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Session timer (secondary) */}
      {sessionEndsAt && (
        <div className="text-center">
          <p
            className="text-sm font-semibold tabular-nums"
            style={{ color: PHASE_COLORS[sessionPhase], opacity: 0.7 }}
            role="timer"
            aria-label={`Session time remaining: ${formatTime(sessionRemaining)}`}
          >
            {formatTime(sessionRemaining)}
          </p>
          <p className="text-[8px] uppercase tracking-widest opacity-30">
            Session
          </p>
        </div>
      )}

      {isPaused && (
        <p
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: "var(--tome-warning, #C8801F)" }}
        >
          Paused
        </p>
      )}
    </motion.div>
  )
}
