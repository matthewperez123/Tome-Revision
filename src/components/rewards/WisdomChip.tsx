"use client"

/**
 * WisdomChip — the lantern-gold counter for earned Wisdom.
 *
 * Contract: { amount: number; animate?: boolean; size?: 'sm'|'md'|'lg' }
 *
 * - When `animate`, the count rolls 0 → amount over 720ms (outExpo,
 *   tactile moment #12 wisdomCountUp) and lands with a sparkle beat.
 * - Reduced motion: final value appears immediately, no roll.
 * - Non-interactive display (counts never decrease; there is no
 *   purchase affordance anywhere in Tome). Focusable for its tooltip
 *   explanation, keyboard reachable, announced via aria-label.
 */

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { laEasings } from "@/lib/design/motion"
import { playSound } from "@/lib/game/sound"
import { cn } from "@/lib/utils"

export interface WisdomChipProps {
  amount: number
  animate?: boolean
  size?: "sm" | "md" | "lg"
}

const SIZES = {
  sm: { pad: "px-2.5 py-1", text: "text-xs", glyph: 12, gap: "gap-1" },
  md: { pad: "px-3.5 py-1.5", text: "text-sm", glyph: 15, gap: "gap-1.5" },
  lg: { pad: "px-5 py-2.5", text: "text-lg", glyph: 20, gap: "gap-2" },
} as const

const COUNT_UP_MS = 720

/** Lantern glyph — Wisdom's motif. Inline SVG, currentColor. */
function LanternGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 3h6" />
      <path d="M10 3v2h4V3" />
      <path d="M7 8c0-1.7 2.2-3 5-3s5 1.3 5 3v8c0 2.2-2.2 4-5 4s-5-1.8-5-4V8Z" />
      <path d="M12 10.5c.9 1 1.5 1.8 1.5 2.8a1.5 1.5 0 1 1-3 0c0-1 .6-1.8 1.5-2.8Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function WisdomChip({ amount, animate = false, size = "md" }: WisdomChipProps) {
  const reduced = useReducedMotion() === true
  const runRoll = animate && !reduced
  // `rolled` is only meaningful while runRoll is true; the static
  // path derives `display` straight from props (no effect sync).
  const [rolled, setRolled] = useState<number | null>(null)
  const [landed, setLanded] = useState(false)
  const display = runRoll ? (rolled ?? 0) : amount

  useEffect(() => {
    if (!runRoll) return
    const target = Math.max(0, Math.round(amount))
    const ease = (t: number) => {
      // outExpo mirror of laEasings.outExpo for the rAF counter.
      const [x1, y1, x2, y2] = laEasings.outExpo
      return cubicBezier(x1, y1, x2, y2, t)
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS)
      setRolled(Math.round(target * ease(t)))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setRolled(target)
        setLanded(true)
        playSound("wisdom-sparkle")
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [amount, runRoll])

  const s = SIZES[size]

  return (
    <motion.span
      role="status"
      tabIndex={0}
      title="Wisdom is earned by reading and proving — never bought."
      aria-label={`${display} Wisdom earned`}
      className={cn(
        "inline-flex select-none items-center rounded-full font-mono font-semibold",
        "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-surface)]",
        s.pad,
        s.text,
        s.gap,
      )}
      style={{
        backgroundColor: "var(--la-wisdom)",
        color: "var(--la-wisdom-ink)",
        fontVariantNumeric: "tabular-nums",
        boxShadow: "0 2px 0 var(--la-wisdom-deep)",
      }}
      animate={landed && runRoll ? "sparkle" : "rest"}
      variants={{
        rest: { scale: 1 },
        sparkle: { scale: [1, 1.12, 1], transition: { duration: 0.3 } },
      }}
    >
      <span style={{ color: "var(--la-wisdom-deep)" }}>
        <LanternGlyph size={s.glyph} />
      </span>
      <span aria-hidden="true">{display.toLocaleString("en-US")}</span>
      <span className="sr-only">
        {display} Wisdom. Wisdom is earned by reading and proving — never bought.
      </span>
    </motion.span>
  )
}

/** Small cubic-bezier sampler (y for t) — matches laEasings tuples. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number, t: number): number {
  // Newton–Raphson on x, then evaluate y. Eight iterations is plenty.
  let u = t
  for (let i = 0; i < 8; i += 1) {
    const x = sample(u, x1, x2) - t
    if (Math.abs(x) < 1e-5) break
    const dx = sampleDerivative(u, x1, x2)
    if (Math.abs(dx) < 1e-5) break
    u -= x / dx
  }
  return sample(clamp01(u), y1, y2)
}

function sample(u: number, a1: number, a2: number): number {
  const inv = 1 - u
  return 3 * inv * inv * u * a1 + 3 * inv * u * u * a2 + u * u * u
}

function sampleDerivative(u: number, a1: number, a2: number): number {
  const inv = 1 - u
  return 3 * inv * inv * a1 + 6 * inv * u * (a2 - a1) + 3 * u * u * (1 - a2)
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v))
}
