"use client"

/**
 * WisdomChip — the award moment.
 *
 * On award, the chip counts out "+N Wisdom" with the wisdomCountUp tactile
 * preset (gold sparkle on land); under reduced motion the final value simply
 * appears. Colors come from the --la-wisdom tokens only.
 */
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { laDurations, pickTactile, useReducedMotionSafe } from "@/lib/design/motion"
import { la } from "./shared"

export function WisdomChip({
  /** Total session Wisdom — the resting display. */
  total,
  /** The most recent award (drives the +N burst); null at rest. */
  lastAward,
  reduced,
}: {
  total: number
  lastAward: number | null
  reduced?: boolean
}) {
  const systemReduced = useReducedMotionSafe()
  const isReduced = reduced ?? systemReduced

  return (
    <span className="relative inline-flex items-center gap-1.5" aria-live="polite">
      <Sparkles size={15} aria-hidden style={{ color: la.wisdom }} />
      <span className="font-sans text-sm font-semibold" style={{ color: la.wisdomDeep }}>
        {total} Wisdom
      </span>
      <AnimatePresence>
        {lastAward !== null && lastAward > 0 && (
          <motion.span
            // Keyed on the award itself: a new award replays the burst
            // without any effect-driven state.
            key={`${lastAward}-${total}`}
            variants={pickTactile("wisdomCountUp", isReduced)}
            initial="hidden"
            animate={["visible", "sparkle"]}
            exit={{ opacity: 0, transition: { duration: laDurations.fast / 1000 } }}
            className="absolute -top-5 right-0 font-sans text-xs font-bold"
            style={{ color: la.wisdom }}
            aria-label={`Plus ${lastAward} Wisdom`}
          >
            +{lastAward}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
