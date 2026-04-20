"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * Thin laurel-gold progress bar shown at the top of the Trial viewport.
 */
export function TrialProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  const reduced = useReducedMotion()
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0

  return (
    <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card">
      <span
        className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground font-sans w-14 tabular-nums"
        aria-live="polite"
      >
        {Math.min(current + 1, total)} / {total}
      </span>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        className="flex-1 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden"
      >
        <motion.div
          initial={reduced ? { width: `${pct}%` } : { width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={
            reduced
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 160, damping: 24 }
          }
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #D4AF37 0%, #F0C850 100%)",
          }}
        />
      </div>
    </div>
  )
}
