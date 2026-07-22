"use client"

/**
 * SliceHome — beat 1: the seeded reader home.
 *
 * Virgil greets the returning reader and points to Macbeth. The home is
 * fully seeded: 40 lifetime Wisdom (level 1), a six-day Flame waiting for
 * today's page, and tonight's book. Clicking the Macbeth cover (or the
 * "Open Macbeth" button) starts the shared-element transition into the
 * storm-lit portal — the cover element carries layoutId "showcase-cover".
 *
 * The other shelves are honest: choosing another book tells you this
 * showcase follows Macbeth; nothing is a dead control.
 */

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { TomeCover } from "@/components/covers/TomeCover"
import { Virgil, useVirgilMachine } from "@/components/virgil"
import { FlameMeter, WisdomChip } from "@/components/rewards"
import { getBookExperience } from "@/lib/books/registry"
import { useReducedMotionSafe } from "@/lib/design/motion"
import {
  SEEDED_FLAME_DAYS,
  SEEDED_PRIOR_WISDOM,
  sessionLevels,
} from "@/lib/showcase/session"

const OTHER_BOOKS = ["moby-dick", "alice", "odyssey"] as const

export function SliceHome({
  role,
  onOpenBook,
}: {
  role: "reader" | "student"
  onOpenBook: () => void
}) {
  const machine = useVirgilMachine("idle")
  const reduced = useReducedMotionSafe()
  const [otherNote, setOtherNote] = useState<string | null>(null)
  const macbeth = getBookExperience("macbeth")

  // Greet on arrival: enter → greet → point toward the shelf.
  useEffect(() => {
    machine.dispatch({ type: "APP_ENTER", context: { bookId: "macbeth", returning: true } })
    const t = window.setTimeout(() => machine.dispatch({ type: "GREET" }), reduced ? 100 : 900)
    const t2 = window.setTimeout(() => machine.dispatch({ type: "GLANCE", direction: "right" }), reduced ? 400 : 2600)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const levels = sessionLevels(null)

  return (
    <section aria-label="Reader home" className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-start gap-5">
        <Virgil
          state={machine.state}
          announcement={machine.announcement}
          size={120}
          bust
          className="shrink-0"
        />
        <div className="min-w-0 flex-1 rounded-2xl border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--la-wisdom-deep)]">
            Virgil · your guide
          </p>
          <p className="mt-1 font-serif text-lg leading-snug text-[var(--la-ink)]">
            {role === "student"
              ? "Welcome back, scholar. Tonight's reading is set — and the storm is already waiting."
              : "Welcome back to the Living Archive. Tonight we follow a crown promised by lightning."}
          </p>
          <p className="mt-1 font-sans text-sm text-[var(--la-ink-muted)]">
            {macbeth?.heroCopy} One scene, one Trial — and the Stoa is watching.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <WisdomChip amount={SEEDED_PRIOR_WISDOM} size="sm" />
            <span className="font-sans text-xs text-[var(--la-ink-faint)]">
              Level {levels.before} reader
            </span>
            <FlameMeter state="at-risk" days={SEEDED_FLAME_DAYS} size="sm" />
          </div>
        </div>
      </div>

      <h2 className="mt-6 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--la-ink-faint)]">
        Tonight’s shelf
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-4 @sm:grid-cols-4">
        <motion.div layoutId="showcase-cover" className="relative">
          <button
            type="button"
            data-tour="slice-cover"
            onClick={onOpenBook}
            aria-label="Open Macbeth — step into the storm"
            className="block w-full rounded-xl text-left transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--la-focus)]"
          >
            <TomeCover slug="macbeth" size="card" priority />
          </button>
          <p className="mt-2 text-center font-sans text-xs font-semibold text-[var(--la-ink)]">
            Macbeth
            <span className="block font-normal text-[var(--la-ink-faint)]">William Shakespeare</span>
          </p>
        </motion.div>

        {OTHER_BOOKS.map((slug) => {
          const book = getBookExperience(slug)
          return (
            <div key={slug}>
              <button
                type="button"
                aria-label={`${book?.title ?? slug} — not tonight's reading; this showcase follows Macbeth`}
                onClick={() =>
                  setOtherNote(
                    `${book?.title ?? "That book"} waits on the shelf — tonight's showcase follows Macbeth.`,
                  )
                }
                className="block w-full rounded-xl opacity-70 grayscale-[35%] transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--la-focus)]"
              >
                <TomeCover slug={slug} size="card" />
              </button>
              <p className="mt-2 text-center font-sans text-xs text-[var(--la-ink-muted)]">
                {book?.title ?? slug}
              </p>
            </div>
          )
        })}
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-center font-sans text-xs text-[var(--la-ink-muted)]">
        {otherNote}
      </p>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onOpenBook}
          className="rounded-full bg-[var(--la-primary)] px-6 py-2.5 font-sans text-sm font-semibold text-[var(--la-primary-ink)] transition-colors hover:bg-[var(--la-primary-edge)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
        >
          Open Macbeth →
        </button>
      </div>
    </section>
  )
}
