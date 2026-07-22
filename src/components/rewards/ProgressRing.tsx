"use client"

/**
 * ProgressRing — the Living Archive progress ring.
 *
 * Contract: { value: number; max: number; label?: string; size?: number }
 *
 * - Track --la-surface-sunken, fill --la-primary; completes with a
 *   single --la-success draw cycle. Error progress (value < 0 or
 *   max <= 0) renders the fill in --la-error, statically.
 * - Non-interactive, but always role="progressbar" with
 *   aria-valuenow / aria-valuemin / aria-valuemax.
 * - Stroke draws over 450ms (outExpo); reduced motion shows the
 *   value pre-drawn — no animation.
 */

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ProgressRingProps {
  value: number
  max: number
  label?: string
  size?: number
}

export function ProgressRing({ value, max, label, size = 64 }: ProgressRingProps) {
  const reduced = useReducedMotion() === true
  const invalid = !Number.isFinite(value) || !Number.isFinite(max) || max <= 0 || value < 0
  const fraction = invalid ? 0 : Math.min(1, value / max)
  const complete = !invalid && value >= max

  const strokeWidth = Math.max(4, size / 12)
  const radius = (size - strokeWidth) / 2
  const center = size / 2

  const fill = invalid
    ? "var(--la-error)"
    : complete
      ? "var(--la-success)"
      : "var(--la-primary)"

  return (
    <span
      role="progressbar"
      aria-valuenow={invalid ? 0 : Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={invalid ? 1 : Math.round(max)}
      aria-label={label ?? `Progress ${Math.round(fraction * 100)} percent`}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--la-surface-sunken)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={fill}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          initial={false}
          animate={{ pathLength: fraction }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
          }
        />
      </svg>
      {label !== undefined && (
        <span
          className={cn("absolute font-mono font-semibold")}
          style={{
            color: "var(--la-ink)",
            fontSize: Math.max(10, size / 4.5),
            fontVariantNumeric: "tabular-nums",
          }}
          aria-hidden="true"
        >
          {label}
        </span>
      )}
    </span>
  )
}
