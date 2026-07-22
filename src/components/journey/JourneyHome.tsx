"use client"

/**
 * JourneyHome — /journey, the reader journey home.
 *
 * Replaces the generic dashboard feeling with a living journey:
 * Virgil's time-aware greeting, the Macbeth portal hero with the dominant
 * Continue reading action, the chapter/path map, the learning-game dock
 * (daily goal, Flame, Wisdom level, next Trial, Seal goal, Stoa teaser),
 * the next-book rail, and the embedded library browser. First-time readers
 * get the loop explained by DOING (FirstTimeLoop), persisted in the
 * journey showcase store.
 *
 * Layout: mobile single column with a fixed bottom nav; desktop adds a left
 * rail and a two-column main grid. All interactive pieces are keyboard
 * reachable, and every committed component used here already ships its own
 * reduced-motion alternative.
 */

import { JourneyNav } from "./JourneyNav"
import { VirgilGreeting } from "./VirgilGreeting"
import { BookPortalHero } from "./BookPortalHero"
import { JourneyPath } from "./JourneyPath"
import { ProgressDock } from "./ProgressDock"
import { BookRail } from "./BookRail"
import { LibraryGrid } from "./LibraryGrid"
import { FirstTimeLoop } from "./FirstTimeLoop"
import { useJourneyState } from "@/lib/journey/state"

export function JourneyHome() {
  const { reset } = useJourneyState()

  return (
    <div className="min-h-screen bg-[var(--la-page)] font-sans text-[var(--la-ink)]">
      <a
        href="#journey-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-24 focus:top-4 focus:z-50 focus:rounded-[var(--la-radius-m)] focus:bg-[var(--la-surface)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--la-primary)] focus:outline-2 focus:outline-[var(--la-focus)]"
      >
        Skip to journey
      </a>

      <JourneyNav />

      <main
        id="journey-main"
        className="mx-auto max-w-7xl px-5 pb-28 pt-8 md:px-8 lg:pb-14 lg:pl-28 lg:pr-8"
      >
        <VirgilGreeting />

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(320px,4fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <BookPortalHero />
            <JourneyPath />
          </div>
          <div className="min-w-0">
            <ProgressDock />
          </div>
        </div>

        <BookRail />
        <LibraryGrid />

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--la-surface-sunken)] pt-4 text-xs text-[var(--la-ink-faint)]">
          <p>
            Showcase journey home — progress and rewards on this page are
            seeded demo state stored locally on this device only.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded underline-offset-4 hover:text-[var(--la-ink-muted)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
          >
            Reset journey showcase
          </button>
        </footer>
      </main>

      <FirstTimeLoop />
    </div>
  )
}
