"use client"

/**
 * BookPortalHero — the current book portal on /journey (Macbeth).
 *
 * A palette-true portal into the storm world: the Tome-generated cover sits
 * on a Macbeth world-palette backdrop (Explore-mode vibrancy is allowed
 * here — Living Archive world palettes are for portals, never the reader).
 * "Continue reading" is the dominant action; progress is the real seeded
 * chapter count over the 34 chapters in public/content/macbeth/meta.json.
 */

import Link from "next/link"
import { motion } from "framer-motion"
import { TomeCover } from "@/components/covers/TomeCover"
import { ProgressRing } from "@/components/rewards"
import { getBookExperience } from "@/lib/books/registry"
import { useReducedMotionSafe } from "@/lib/design/motion"
import {
  MACBETH_CHAPTER_COUNT,
  MACBETH_ESTIMATED_MINUTES,
  chaptersRead,
  currentJourneyNode,
} from "@/lib/journey/macbeth-path"
import { useJourneyState } from "@/lib/journey/state"

const FOCUS_RING =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2"

export function BookPortalHero() {
  const { nodesCompleted } = useJourneyState()
  const reduced = useReducedMotionSafe()

  const experience = getBookExperience("macbeth")!
  const read = chaptersRead(nodesCompleted)
  const resume = currentJourneyNode(nodesCompleted)
  const percent = Math.round((read / MACBETH_CHAPTER_COUNT) * 100)

  return (
    <section
      aria-label="Current book: Macbeth"
      data-loop-target="hero"
      className="relative overflow-hidden rounded-[var(--la-radius-l)]"
      style={{
        background:
          "linear-gradient(150deg, var(--la-world-macbeth-ground) 0%, var(--la-world-macbeth-deep) 78%)",
        boxShadow: "var(--la-shadow-portal)",
      }}
    >
      {/* storm glow, decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full opacity-40 blur-3xl"
        style={{ backgroundColor: "var(--la-world-macbeth-glow)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 size-64 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: "var(--la-world-macbeth-accent)" }}
      />

      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center md:p-8">
        <div className="w-36 shrink-0 sm:w-44">
          <TomeCover slug="macbeth" size="hero" priority />
        </div>

        <div className="min-w-0 flex-1 text-[var(--la-ink-inverse)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/70">
            Current book · {experience.journeyLengthDays}-day journey
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {experience.title}
          </h2>
          <p className="mt-1 text-sm text-white/80">{experience.author}</p>
          <p className="mt-3 max-w-md text-sm italic leading-relaxed text-white/90 md:text-base">
            {experience.heroCopy}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <ProgressRing
              value={read}
              max={MACBETH_CHAPTER_COUNT}
              label={`${percent}% read — ${read} of ${MACBETH_CHAPTER_COUNT} chapters`}
              size={76}
            />
            <div className="text-sm">
              <p className="font-semibold text-white">
                {read} of {MACBETH_CHAPTER_COUNT} chapters
              </p>
              <p className="mt-0.5 text-white/75">
                Next: {resume.title}
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                About {MACBETH_ESTIMATED_MINUTES} minutes of reading in the whole play
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.02 }}
              whileTap={reduced ? undefined : { scale: 0.97, y: 2 }}
            >
              <Link
                href="/read/macbeth"
                className={`inline-flex h-12 items-center justify-center rounded-[var(--la-radius-m)] px-6 text-base font-semibold text-[var(--la-primary-ink)] ${FOCUS_RING} focus-visible:ring-offset-[var(--la-world-macbeth-deep)]`}
                style={{
                  backgroundColor: "var(--la-primary)",
                  boxShadow: "0 4px 0 var(--la-primary-edge)",
                }}
              >
                Continue reading
              </Link>
            </motion.div>
            <a
              href="#journey-path"
              className={`inline-flex h-12 items-center rounded-[var(--la-radius-m)] border border-white/30 px-5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 ${FOCUS_RING} focus-visible:ring-offset-[var(--la-world-macbeth-deep)]`}
            >
              See the path
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
