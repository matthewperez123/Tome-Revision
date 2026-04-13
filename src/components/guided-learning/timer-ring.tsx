"use client"

import { motion } from "framer-motion"
import { useSessionTimer } from "@/hooks/use-session-timer"
import { cn } from "@/lib/utils"
import type { TimerPhase } from "@/lib/guided-learning-types"

const PHASE_COLORS: Record<TimerPhase, string> = {
  normal: "#6366F1",   // indigo
  warning: "#F59E0B",  // amber
  critical: "#EF4444", // crimson/red
}

interface TimerRingProps {
  endsAt: string | null
  totalDurationMinutes: number
  size?: number
  className?: string
  onExpire?: () => void
}

/**
 * Circular SVG countdown timer with phase-based color transitions.
 * indigo → amber → crimson as time runs out.
 */
export function TimerRing({
  endsAt,
  totalDurationMinutes,
  size = 80,
  className,
  onExpire,
}: TimerRingProps) {
  const { minutes, seconds, progress, phase, isExpired, isPaused } = useSessionTimer(
    endsAt,
    totalDurationMinutes,
    { onExpire },
  )

  const strokeWidth = size * 0.08
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  const color = PHASE_COLORS[phase]
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-10"
        />

        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          animate={{ stroke: color }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      {/* Center time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-sans font-bold tabular-nums leading-none",
            isExpired && "opacity-50",
          )}
          style={{
            fontSize: size * 0.22,
            color,
          }}
        >
          {isExpired ? "00:00" : timeString}
        </span>
        {isPaused && (
          <span
            className="font-sans text-[10px] font-medium uppercase tracking-wider opacity-60"
            style={{ color }}
          >
            Paused
          </span>
        )}
      </div>
    </div>
  )
}
