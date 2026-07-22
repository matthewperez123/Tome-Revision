"use client"

/**
 * StoaNiche — one arch niche in the courtyard.
 *
 * Two states: EMPTY (ghost outline of the medallion + which book restores
 * it) and RESTORED (the painting, with a gold name plate). When the reward
 * transitions to restored while the gallery is open, the niche plays the
 * dust-to-gold materialize choreography from
 * `tactileMoments.stoaRestoration` (opacity-only under reduced motion).
 *
 * The whole niche is a single <button> so it is keyboard-focusable and
 * announced with its state; the detail dialog opens from the parent.
 */

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { pickTactile, useReducedMotionSafe } from "@/lib/design/motion"
import type { StoaReward } from "@/lib/stoa/rewards"

const ARCH_RADIUS = "50% 50% 14px 14px / 30% 30% 14px 14px"

export interface StoaNicheProps {
  reward: StoaReward
  restored: boolean
  onOpen: (id: StoaReward["id"]) => void
}

function DustMotes({ active }: { active: boolean }) {
  if (!active) return null
  const motes = [
    { left: "22%", delay: 0.1, size: 5 },
    { left: "38%", delay: 0.3, size: 4 },
    { left: "55%", delay: 0.05, size: 6 },
    { left: "70%", delay: 0.4, size: 4 },
    { left: "82%", delay: 0.2, size: 5 },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[var(--la-wisdom)]"
          style={{ left: m.left, bottom: "12%", width: m.size, height: m.size }}
          initial={{ opacity: 0.9, y: 0 }}
          animate={{ opacity: 0, y: -90 }}
          transition={{ duration: 1.1, delay: m.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

export function StoaNiche({ reward, restored, onOpen }: StoaNicheProps) {
  const reduced = useReducedMotionSafe()
  const [materializing, setMaterializing] = useState(false)
  const prevRestored = useRef(restored)

  // Detect the locked → restored transition and play the ceremony once.
  useEffect(() => {
    if (!prevRestored.current && restored) {
      setMaterializing(true)
      const timer = window.setTimeout(
        () => setMaterializing(false),
        reduced ? 400 : 1500,
      )
      return () => window.clearTimeout(timer)
    }
    prevRestored.current = restored
    return undefined
  }, [restored, reduced])

  useEffect(() => {
    prevRestored.current = restored
  }, [restored])

  const restoreVariants = pickTactile("stoaRestoration", reduced).variants as unknown as Variants

  const label = restored
    ? `${reward.title}, Stoa painting for ${reward.bookTitle} — restored. Open detail.`
    : `Empty niche — restore the ${reward.bookTitle} painting by passing a ${reward.bookTitle} Trial.`

  return (
    <button
      type="button"
      onClick={() => onOpen(reward.id)}
      aria-label={label}
      aria-pressed={restored}
      className="group relative flex w-[78vw] max-w-72 shrink-0 snap-center flex-col focus-visible:outline-none md:w-auto md:max-w-none"
    >
      {/* arch niche frame */}
      <span
        className="relative block aspect-[2/3] w-full overflow-hidden border transition-shadow duration-300 group-hover:shadow-[var(--la-shadow-float)] group-focus-visible:shadow-[var(--la-shadow-float)]"
        style={{
          borderRadius: ARCH_RADIUS,
          borderColor: restored ? "var(--la-wisdom)" : "var(--la-surface-sunken)",
          backgroundColor: restored ? "var(--la-midnight-ink)" : "var(--la-surface-sunken)",
          boxShadow: "var(--la-shadow-raised)",
        }}
      >
        {restored ? (
          <>
            <motion.span
              className="absolute inset-0 block"
              variants={restoreVariants}
              initial={materializing ? "hidden" : false}
              animate="visible"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- vector art, serialized for download */}
              <img
                src={reward.artSrc}
                alt={reward.altText}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.span>
            {/* gold wash during materialize */}
            {materializing && !reduced && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 block"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(217,166,60,0.55), rgba(217,166,60,0) 60%)",
                }}
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            )}
            <DustMotes active={materializing && !reduced} />
          </>
        ) : (
          /* EMPTY state — ghost outline of the medallion waiting in the arch */
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span
              aria-hidden="true"
              className="block h-2/5 w-3/5 rounded-full border-2 border-dashed border-[var(--la-ink-faint)] opacity-60 transition-opacity duration-300 group-hover:opacity-90"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--la-ink-muted)]">
              {reward.emptyCopy.heading}
            </span>
            <span className="text-xs leading-relaxed text-[var(--la-ink-muted)]">
              {reward.emptyCopy.body}
            </span>
          </span>
        )}
      </span>

      {/* name plate */}
      <span
        className="mt-3 block rounded-[var(--la-radius-s)] border px-3 py-2 text-left"
        style={{
          borderColor: restored ? "var(--la-wisdom)" : "var(--la-surface-sunken)",
          backgroundColor: "var(--la-surface)",
        }}
      >
        <span className="block text-sm font-semibold text-[var(--la-ink)]">
          {restored ? reward.title : reward.bookTitle}
        </span>
        <span className="block text-xs text-[var(--la-ink-muted)]">
          {restored ? `From ${reward.bookTitle} · ${reward.provenanceLabel}` : "Awaiting restoration"}
        </span>
      </span>
    </button>
  )
}
