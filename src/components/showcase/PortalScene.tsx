"use client"

/**
 * PortalScene — beat 2: the storm-lit book-world threshold.
 *
 * The Macbeth cover (shared element, layoutId "showcase-cover") morphs from
 * the shelf into the world's portal: the registry's storm palette, its
 * portal-scene copy, drifting rain and a slow thunderhead wash. Reduced
 * motion: rain and drift are still; the transition collapses to a fade.
 */

import { motion } from "framer-motion"
import { TomeCover } from "@/components/covers/TomeCover"
import { Virgil, useVirgilMachine } from "@/components/virgil"
import { getBookExperience } from "@/lib/books/registry"
import { laWorlds } from "@/lib/design/tokens"
import { useReducedMotionSafe } from "@/lib/design/motion"
import { useEffect } from "react"

function Rain({ reduced }: { reduced: boolean }) {
  if (reduced) return null
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      {[0, 1, 2].map((layer) => (
        <motion.div
          key={layer}
          className="absolute -inset-y-full inset-x-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(105deg, transparent 0 14px, rgba(154,167,199,0.35) 14px 15px)",
            backgroundSize: `${90 + layer * 40}px ${140 + layer * 50}px`,
          }}
          animate={{ y: ["0%", "50%"] }}
          transition={{
            duration: 1.6 + layer * 0.7,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export function PortalScene({ onEnter }: { onEnter: () => void }) {
  const reduced = useReducedMotionSafe()
  const machine = useVirgilMachine("idle")
  const book = getBookExperience("macbeth")
  const world = laWorlds.macbeth

  useEffect(() => {
    machine.dispatch({ type: "PAGE_PEEK" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      aria-label="Macbeth book world — storm-lit portal"
      className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[var(--la-surface-sunken)]"
      style={{
        background: `linear-gradient(170deg, ${world.deep} 0%, ${world.ground} 55%, ${world.deep} 100%)`,
      }}
    >
      {/* thunderhead wash */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 45% at 62% 18%, ${world.glow}33, transparent 70%)`,
          }}
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <Rain reduced={reduced} />

      <div className="relative flex flex-col items-center gap-6 px-6 py-10 @md:flex-row @md:items-end @md:gap-10">
        <motion.div
          layoutId="showcase-cover"
          className="w-40 shrink-0 @sm:w-48"
          transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 120, damping: 18 }}
        >
          <TomeCover slug="macbeth" size="card" showProvenanceBadge={false} />
        </motion.div>

        <div className="text-center @md:text-left">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: world.accent }}
          >
            The threshold opens
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight text-[var(--la-ink-inverse)] @md:text-3xl">
            A storm-lit battlement.
          </h2>
          <p className="mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-[var(--la-ink-inverse)]/80 @md:mx-0">
            {book?.portalScene}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 @md:justify-start">
            <button
              type="button"
              onClick={onEnter}
              className="rounded-full px-6 py-2.5 font-sans text-sm font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
              style={{ background: world.accent, color: world.deep }}
            >
              Step through the rain →
            </button>
            <Virgil
              state={machine.state}
              announcement={machine.announcement}
              variant="macbeth"
              size={88}
              bust
            />
          </div>
        </div>
      </div>
    </section>
  )
}
