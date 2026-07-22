"use client"

/**
 * StoaRestore — the restoration ceremony.
 *
 * Embedded by other surfaces (Trial results, book-completion moments)
 * right after a book is completed. It plays the dust-to-gold materialize
 * choreography from `tactileMoments.stoaRestoration`, marks the reward
 * restored in the showcase store, reveals the Seal and Wisdom earned
 * alongside it, then offers a path to /stoa.
 *
 * Virgil attends the ceremony: STOA_RESTORED is dispatched on mount, so
 * his stoaRestoration state runs in lockstep with the painting.
 *
 * Reduced motion: opacity-only fade; plaque and artwork appear together.
 */

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useVirgilMachine, Virgil } from "@/components/virgil"
import { SealMedallion } from "@/components/rewards/SealMedallion"
import { WisdomChip } from "@/components/rewards/WisdomChip"
import { pickTactile, useReducedMotionSafe } from "@/lib/design/motion"
import { getStoaReward } from "@/lib/stoa/rewards"
import { restoreReward } from "@/lib/stoa/state"
import type { BookSlug } from "@/lib/books/types"

export interface StoaRestoreProps {
  /** Reward (and book) being restored — the book's world slug. */
  rewardId: BookSlug
  /** Wisdom awarded with the pass, if the embedding surface knows it. */
  wisdomAwarded?: number
  /** Write the restoration into the showcase store (default true). */
  markRestored?: boolean
  /** Called when the ceremony finishes (after choreography + plaque). */
  onComplete?: () => void
  className?: string
}

export function StoaRestore({
  rewardId,
  wisdomAwarded,
  markRestored = true,
  onComplete,
  className,
}: StoaRestoreProps) {
  const reward = getStoaReward(rewardId)
  const reduced = useReducedMotionSafe()
  const machine = useVirgilMachine("idle")
  const [revealed, setRevealed] = useState(false)

  const ceremonyMs = reduced ? 350 : 1400

  useEffect(() => {
    machine.dispatch({ type: "STOA_RESTORED", rewardId })
    if (markRestored) restoreReward(rewardId)
    const timer = window.setTimeout(() => {
      setRevealed(true)
      onComplete?.()
    }, ceremonyMs)
    return () => window.clearTimeout(timer)
    // Ceremony runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!reward) return null

  const restoreVariants = pickTactile("stoaRestoration", reduced).variants as unknown as Variants

  return (
    <section
      aria-label={`Stoa restoration ceremony for ${reward.bookTitle}`}
      className={`rounded-[var(--la-radius-l)] border border-[var(--la-wisdom)] bg-[var(--la-page)] p-6 text-[var(--la-ink)] shadow-[var(--la-shadow-float)] ${className ?? ""}`}
    >
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--la-wisdom-deep)]">
        The Stoa accepts your painting
      </p>

      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-center">
        {/* materializing artwork */}
        <motion.div
          className="relative w-44 overflow-hidden border border-[var(--la-wisdom)]"
          style={{ borderRadius: "50% 50% 12px 12px / 28% 28% 12px 12px" }}
          variants={restoreVariants}
          initial="hidden"
          animate="visible"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- vector art, serialized for download */}
          <img src={reward.artSrc} alt={reward.altText} className="block h-auto w-full" />
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, rgba(217,166,60,0.6), rgba(217,166,60,0) 60%)",
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: ceremonyMs / 1000, ease: "easeOut" }}
            />
          )}
        </motion.div>

        <Virgil
          state={machine.state}
          announcement={machine.announcement}
          size={88}
          bust
          className="shrink-0"
        />
      </div>

      {/* plaque, revealed after the materialize beat */}
      <motion.div
        className="mx-auto mt-5 max-w-md text-center"
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-hidden={!revealed}
      >
        <h2 className="text-xl font-bold tracking-tight">{reward.title}</h2>
        <p className="mt-1 text-sm text-[var(--la-ink-muted)]">
          Restored from {reward.bookTitle} · {reward.provenanceLabel}
        </p>
        <p className="mt-3 text-sm italic leading-relaxed">“{reward.virgilLine}”</p>

        <div className="mt-4 flex items-center justify-center gap-4">
          <SealMedallion sealId={reward.id} name={reward.sealName} size={64} state="new" />
          {typeof wisdomAwarded === "number" && <WisdomChip amount={wisdomAwarded} />}
        </div>

        <Link
          href="/stoa"
          tabIndex={revealed ? 0 : -1}
          className="mt-5 inline-block rounded-full bg-[var(--la-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--la-primary-ink)] transition-colors hover:bg-[var(--la-primary-edge)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
        >
          Visit your Stoa
        </Link>
      </motion.div>
    </section>
  )
}
