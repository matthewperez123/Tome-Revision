"use client"

/**
 * DailyGoalCard — today's gentle target on Home / Journey.
 *
 * Composes the kit primitives: ProgressRing for the page goal,
 * FlameMeter for the hearth, WisdomChip for today's earnings, and a
 * single primary continue action with pressPrimary tactility.
 * Kind copy only — goals are invitations, not quotas.
 */

import { motion, useReducedMotion } from "framer-motion"
import type { FlameState } from "@/lib/game/economy"
import { playSound } from "@/lib/game/sound"
import { FlameMeter } from "@/components/rewards/FlameMeter"
import { ProgressRing } from "@/components/rewards/ProgressRing"
import { WisdomChip } from "@/components/rewards/WisdomChip"

export interface DailyGoalCardProps {
  /** Pages in today's goal. */
  goalPages: number
  /** Pages read so far today. */
  pagesRead: number
  flameState: FlameState
  flameDays: number
  /** Wisdom earned today; chip count-up animates on change. */
  wisdomToday?: number
  /** Continue reading CTA. */
  onContinue?: () => void
  /** Label for the continue action, e.g. "Continue Macbeth, Chapter 3". */
  continueLabel?: string
}

export function DailyGoalCard({
  goalPages,
  pagesRead,
  flameState,
  flameDays,
  wisdomToday = 0,
  onContinue,
  continueLabel = "Continue reading",
}: DailyGoalCardProps) {
  const reduced = useReducedMotion() === true
  const done = goalPages > 0 && pagesRead >= goalPages

  return (
    <section
      aria-label="Today's reading goal"
      className="flex w-full max-w-md flex-col gap-4 rounded-[22px] p-5"
      style={{
        backgroundColor: "var(--la-surface-raised)",
        boxShadow: "var(--la-shadow-raised)",
        border: "1px solid var(--la-surface-sunken)",
      }}
    >
      <div className="flex items-center gap-4">
        <ProgressRing
          value={pagesRead}
          max={Math.max(1, goalPages)}
          label={`${Math.min(pagesRead, goalPages)}`}
          size={72}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium" style={{ color: "var(--la-ink)" }}>
            {done ? "Today's pages are done — nicely read." : `${Math.max(0, goalPages - pagesRead)} pages to today's goal`}
          </p>
          <p className="text-xs" style={{ color: "var(--la-ink-muted)" }}>
            A goal is an invitation, never a quota.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <FlameMeter state={flameState} days={flameDays} size="sm" />
        <WisdomChip amount={wisdomToday} animate={!reduced && wisdomToday > 0} size="sm" />
      </div>

      {onContinue && (
        <motion.button
          type="button"
          onClick={() => {
            playSound("soft-press")
            onContinue()
          }}
          className="inline-flex h-11 items-center justify-center rounded-[14px] px-4 text-sm font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-surface-raised)]"
          style={{
            backgroundColor: "var(--la-primary)",
            color: "var(--la-primary-ink)",
            boxShadow: "0 4px 0 var(--la-primary-edge)",
          }}
          initial="rest"
          whileHover={reduced ? undefined : "hover"}
          whileTap={reduced ? undefined : "pressed"}
          variants={{
            rest: { scale: 1, y: 0, boxShadow: "0 4px 0 var(--la-primary-edge)" },
            hover: { scale: 1.02, transition: { duration: 0.16 } },
            pressed: {
              scale: 0.96,
              y: 2,
              boxShadow: "0 2px 0 var(--la-primary-edge)",
              transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.8 },
            },
          }}
        >
          {continueLabel}
        </motion.button>
      )}
    </section>
  )
}
