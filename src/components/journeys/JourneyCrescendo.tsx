"use client"

/**
 * JourneyCrescendo — the post-day reward choreography for Journeys.
 *
 * Wraps the committed useRewardCrescendo sequencer (wisdom → level → flame
 * → seal → stoa) in a RewardTray. Each step renders committed reward
 * components (WisdomChip, LevelUpBadge, FlameMeter, SealMedallion). The
 * sequence is skippable per-step or whole; reduced motion collapses every
 * duration (handled inside the hook).
 */
import { useEffect } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useRewardCrescendo } from "@/components/game"
import { LevelUpBadge } from "@/components/game"
import { FlameMeter, RewardTray, SealMedallion, WisdomChip } from "@/components/rewards"
import { la } from "@/components/trials/session/shared"

export interface JourneyCrescendoProps {
  open: boolean
  /** Total Wisdom awarded this completion (trial + daily bonus). */
  wisdomAward: number
  /** True when the award crossed a level threshold. */
  leveledUp?: boolean
  /** New level reached, shown when leveledUp. */
  newLevel?: number
  /** Completed-day count shown with the Flame. */
  flameDays?: number
  /** Milestone/final Seal earned with this completion, if any. */
  sealEarned?: { sealId: string; name: string } | null
  /** Stoa reward title restored with this completion, if any. */
  stoaRestoredTitle?: string | null
  /** Called when the sequence finishes or is skipped whole. */
  onDone: () => void
}

export function JourneyCrescendo({
  open,
  wisdomAward,
  leveledUp = false,
  newLevel,
  flameDays = 1,
  sealEarned = null,
  stoaRestoredTitle = null,
  onDone,
}: JourneyCrescendoProps) {
  const reduced = useReducedMotion() === true
  const crescendo = useRewardCrescendo({
    wisdomAward: open ? wisdomAward : 0,
    leveledUp: open && leveledUp,
    flameSecured: open,
    sealEarned: open ? sealEarned : null,
    stoaTileRestored: open ? stoaRestoredTitle : null,
  })

  useEffect(() => {
    if (open && crescendo.done) onDone()
  }, [open, crescendo.done, onDone])

  const step = crescendo.activeStep

  return (
    <RewardTray open={open} onDismiss={crescendo.skipAll} label="Day rewards">
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-4 text-center">
        <AnimatePresence mode="wait">
          {step === "wisdom" && (
            <motion.div
              key="wisdom"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="font-sans text-xs uppercase tracking-widest" style={{ color: la.inkFaint }}>
                Wisdom earned
              </p>
              <WisdomChip amount={wisdomAward} animate size="lg" />
            </motion.div>
          )}
          {step === "level" && (
            <motion.div
              key="level"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <LevelUpBadge level={newLevel ?? 2} show />
            </motion.div>
          )}
          {step === "flame" && (
            <motion.div
              key="flame"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              <FlameMeter state="secured" days={flameDays} size="lg" />
              <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
                Flame secured for today.
              </p>
            </motion.div>
          )}
          {step === "seal" && sealEarned && (
            <motion.div
              key="seal"
              initial={reduced ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <SealMedallion sealId={sealEarned.sealId} name={sealEarned.name} size={104} state="new" />
            </motion.div>
          )}
          {step === "stoa" && stoaRestoredTitle && (
            <motion.div
              key="stoa"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              <p className="font-sans text-xs uppercase tracking-widest" style={{ color: la.inkFaint }}>
                The Stoa
              </p>
              <p className="font-serif text-xl" style={{ color: la.ink }}>
                “{stoaRestoredTitle}” hangs in the courtyard.
              </p>
              <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
                Visit the Stoa to see the restored painting and its provenance.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {crescendo.running && (
          <button
            type="button"
            onClick={crescendo.skip}
            className="mt-2 min-h-11 rounded-full px-4 font-sans text-xs uppercase tracking-widest underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
            style={{ color: la.inkFaint }}
          >
            Skip
          </button>
        )}
      </div>
    </RewardTray>
  )
}
