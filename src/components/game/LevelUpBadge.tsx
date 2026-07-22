"use client"

/**
 * LevelUpBadge — the crest ceremony for crossing a level.
 *
 * The system's single permitted celebratory burst: one restrained
 * canvas-confetti volley in Living Archive colors, fired once when
 * `show` turns true (tactile moment #18 levelUp).
 *
 * - Reduced motion: no confetti, no expanding ring — the crest and
 *   label fade in. The level itself is announced via role="status".
 * - canvas-confetti is imported dynamically so the ceremony code
 *   stays out of every route that never levels up.
 */

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef } from "react"
import { laPalette } from "@/lib/design/tokens"
import { playSound } from "@/lib/game/sound"

export interface LevelUpBadgeProps {
  /** The level just reached. */
  level: number
  /** True while the ceremony is visible. */
  show: boolean
  /** Called once the entrance choreography has settled. */
  onDone?: () => void
}

export function LevelUpBadge({ level, show, onDone }: LevelUpBadgeProps) {
  const reduced = useReducedMotion() === true
  const fired = useRef(false)

  useEffect(() => {
    if (!show) {
      fired.current = false
      return
    }
    if (reduced || fired.current) return
    fired.current = true
    playSound("seal-resonance")
    let cancelled = false
    // One restrained burst — never confetti spam.
    void import("canvas-confetti")
      .then(({ default: confetti }) => {
        if (cancelled) return
        confetti({
          particleCount: 60,
          spread: 70,
          startVelocity: 32,
          scalar: 0.9,
          ticks: 140,
          origin: { y: 0.7 },
          colors: [laPalette.lanternGold, laPalette.violet, laPalette.coral, laPalette.jade],
          disableForReducedMotion: true,
        })
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [show, reduced])

  if (!show) return null

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`Level ${level} reached`}
      className="relative inline-flex flex-col items-center gap-2"
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 20 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 180, damping: 14, mass: 1.1 }
      }
      onAnimationComplete={() => onDone?.()}
    >
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 m-auto h-24 w-24 rounded-full"
          style={{ border: "3px solid var(--la-wisdom)" }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
      )}
      <span
        className="inline-flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          backgroundColor: "var(--la-wisdom)",
          color: "var(--la-wisdom-ink)",
          boxShadow: "var(--la-shadow-float), inset 0 0 0 4px var(--la-wisdom-deep)",
        }}
      >
        <span className="font-mono text-2xl font-bold" style={{ fontVariantNumeric: "tabular-nums" }} aria-hidden="true">
          {level}
        </span>
      </span>
      <motion.span
        className="font-mono text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--la-ink-muted)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.2, duration: 0.3 }}
        aria-hidden="true"
      >
        Level {level}
      </motion.span>
    </motion.div>
  )
}
