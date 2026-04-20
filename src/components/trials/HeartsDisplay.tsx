"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Heart, HeartCrack } from "lucide-react"
import { heartLoss } from "@/lib/animations/trial-tokens"

/**
 * Row of hearts with an animated HeartCrack morph on loss. The heart that was
 * just lost is passed via `lostIndex` to drive the one-shot animation.
 */
export function HeartsDisplay({
  current,
  max,
  lostIndex,
}: {
  current: number
  max: number
  /** Index of the heart that was just lost — triggers a one-shot morph */
  lostIndex?: number | null
}) {
  const reduced = useReducedMotion()

  return (
    <div
      className="flex items-center gap-1"
      role="status"
      aria-label={`${current} of ${max} hearts remaining`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < current
        const isLostNow = lostIndex === i

        return (
          <div key={i} className="relative size-5">
            <AnimatePresence>
              {isLostNow && !reduced && (
                <motion.div
                  key="crack"
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 0.85 }}
                  transition={{
                    duration: heartLoss.fadeDuration,
                    delay: heartLoss.morphDuration,
                  }}
                  className="absolute inset-0"
                >
                  <HeartCrack className="w-5 h-5 fill-rose-500 text-rose-500" />
                </motion.div>
              )}
            </AnimatePresence>
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                filled
                  ? "fill-rose-500 text-rose-500"
                  : "fill-transparent text-stone-400 dark:text-stone-300"
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}
