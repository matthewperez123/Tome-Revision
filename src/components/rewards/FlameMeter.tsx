"use client"

/**
 * FlameMeter — the hearth, not the whip.
 *
 * Contract: { state: 'unlit'|'at-risk'|'secured'; days: number; size?: 'sm'|'md'|'lg' }
 *
 * - Transitioning into 'secured' plays the ignition beat ONCE
 *   (tactile moment #13 flameSecured), then settles to steady glow.
 * - 'at-risk' is a gentle dim with neutral copy — never a countdown,
 *   never distress, never a sad mascot (docs/product/core-loop.md).
 * - 'unlit' is a state, not an error: hearth outline + earn-back copy.
 * - Reduced motion: lit artwork swaps in instantly.
 */

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { FLAME_COPY, type FlameState } from "@/lib/game/economy"
import { playSound } from "@/lib/game/sound"
import { cn } from "@/lib/utils"

export interface FlameMeterProps {
  state: FlameState
  days: number
  size?: "sm" | "md" | "lg"
}

const SIZES = {
  sm: { glyph: 20, text: "text-xs", gap: "gap-1.5" },
  md: { glyph: 28, text: "text-sm", gap: "gap-2" },
  lg: { glyph: 38, text: "text-base", gap: "gap-2.5" },
} as const

export function FlameMeter({ state, days, size = "md" }: FlameMeterProps) {
  const reduced = useReducedMotion() === true
  const previous = useRef<FlameState>(state)
  const [igniteKey, setIgniteKey] = useState(0)

  useEffect(() => {
    if (previous.current !== "secured" && state === "secured") {
      // Ignition beat plays exactly once per unlit→secured transition.
      setIgniteKey((k) => k + 1)
      if (!reduced) playSound("flame-ignition")
    }
    previous.current = state
  }, [state, reduced])

  const s = SIZES[size]
  const lit = state === "secured"
  const dim = state === "at-risk"

  return (
    <span
      role="img"
      tabIndex={0}
      aria-label={
        lit
          ? `Hearth flame lit, day ${days}. ${FLAME_COPY.secured}`
          : dim
            ? `Hearth at ${days} days. ${FLAME_COPY["at-risk"]}`
            : FLAME_COPY.unlit
      }
      title={FLAME_COPY[state]}
      className={cn(
        "inline-flex select-none items-center rounded-full outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-surface)]",
        s.gap,
      )}
    >
      <motion.span
        key={igniteKey}
        className="relative inline-flex items-center justify-center"
        initial={false}
        animate={lit ? "lit" : "unlit"}
        variants={{
          unlit: { opacity: dim ? 0.6 : 0.5, scale: 0.9 },
          lit: reduced
            ? { opacity: 1, transition: { duration: 0.15 } }
            : {
                opacity: 1,
                scale: [0.9, 1.08, 1],
                transition: { duration: 0.72, times: [0, 0.5, 1], ease: [0.34, 1.56, 0.64, 1] },
              },
        }}
      >
        <FlameGlyph size={s.glyph} lit={lit} />
        {lit && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full"
            style={{ backgroundColor: "var(--la-flame-soft)" }}
            initial={false}
            animate={reduced ? { opacity: 0.6 } : { opacity: [0, 1, 0.6] }}
            transition={reduced ? { duration: 0.15 } : { duration: 0.9, times: [0, 0.5, 1] }}
          />
        )}
      </motion.span>
      {days > 0 && (
        <span
          className={cn("font-mono font-semibold", s.text)}
          style={{ color: lit ? "var(--la-flame-deep)" : "var(--la-ink-muted)", fontVariantNumeric: "tabular-nums" }}
          aria-hidden="true"
        >
          {days}
        </span>
      )}
    </span>
  )
}

/** Vermilion-coral flame; unlit renders as an outline hearth. */
function FlameGlyph({ size, lit }: { size: number; lit: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3.5c1.2 2 2 3.4 2 4.9 0 .5-.1 1-.3 1.4.8-.3 1.5-.9 1.9-1.7 1.2 1.5 1.9 3.3 1.9 5.1A5.6 5.6 0 0 1 12 18.7a5.6 5.6 0 0 1-5.5-5.5c0-2.5 1.6-4.6 3.2-6.4.6 1 1.2 1.7 2.3 2.2-.3-1.8-.4-3.5 0-5.5Z"
        fill={lit ? "var(--la-flame)" : "none"}
        stroke={lit ? "var(--la-flame-deep)" : "var(--la-ink-faint)"}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {lit && (
        <path
          d="M12 10.5c.9 1.1 1.6 2 1.6 3.1a1.7 1.7 0 1 1-3.3 0c0-1.1.7-2 1.7-3.1Z"
          fill="var(--la-flame-soft)"
        />
      )}
      {/* hearth base */}
      <path
        d="M7 20.5h10"
        stroke={lit ? "var(--la-flame-deep)" : "var(--la-ink-faint)"}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  )
}
