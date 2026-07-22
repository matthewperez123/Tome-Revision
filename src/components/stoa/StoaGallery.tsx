"use client"

/**
 * StoaGallery — /stoa, the reward courtyard.
 *
 * An explorable classical courtyard, not an achievements grid:
 * - Mobile: horizontal scroll/swipe colonnade (scroll-snap, one niche per
 *   viewport step).
 * - Desktop: a grid of arch niches.
 * - Locked niches show the elegant EMPTY state; restored ones hang the
 *   painting and play the materialize choreography if the restoration
 *   happens while the gallery is open.
 * - A reduced-motion list view is always available (and becomes the
 *   default when prefers-reduced-motion is set).
 *
 * Restored state comes from the showcase store (src/lib/stoa/state.ts) —
 * demo-scoped, no Supabase writes.
 */

import { useState } from "react"
import { Virgil } from "@/components/virgil"
import { useReducedMotionSafe } from "@/lib/design/motion"
import { listStoaRewards, STOA_REWARD_COUNT } from "@/lib/stoa/rewards"
import type { StoaReward } from "@/lib/stoa/rewards"
import { useStoaState } from "@/lib/stoa/state"
import { StoaDetail } from "./StoaDetail"
import { StoaNiche } from "./StoaNiche"

type ViewMode = "courtyard" | "list"

const REWARDS = listStoaRewards()

export function StoaGallery() {
  const { isRestored, restoredCount, reset } = useStoaState()
  const reduced = useReducedMotionSafe()
  // View is derived: an explicit user choice wins; otherwise reduced-motion
  // visitors get the calm list view by default.
  const [viewChoice, setViewChoice] = useState<ViewMode | null>(null)
  const view: ViewMode = viewChoice ?? (reduced ? "list" : "courtyard")
  const [selectedId, setSelectedId] = useState<StoaReward["id"] | null>(null)

  const selected = selectedId ? REWARDS.find((r) => r.id === selectedId) ?? null : null

  return (
    <main className="min-h-screen bg-[var(--la-page)] font-sans text-[var(--la-ink)]">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        {/* header */}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--la-wisdom-deep)]">
              Tome · The Living Archive
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">The Stoa</h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--la-ink-muted)]">
              A quiet courtyard where your reading hangs on the walls. Each arch
              holds one painting, restored when you pass a book&apos;s Trial —
              twelve niches, twelve books, one colonnade.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Virgil state="idle" size={88} bust />
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums">
                {restoredCount}
                <span className="text-base font-normal text-[var(--la-ink-muted)]">
                  {" "}/ {STOA_REWARD_COUNT}
                </span>
              </p>
              <p className="text-xs text-[var(--la-ink-muted)]">paintings restored</p>
            </div>
          </div>
        </header>

        {/* controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Gallery view"
            className="flex rounded-full border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-1"
          >
            {(["courtyard", "list"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewChoice(mode)}
                aria-pressed={view === mode}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)] ${
                  view === mode
                    ? "bg-[var(--la-primary)] text-[var(--la-primary-ink)]"
                    : "text-[var(--la-ink-muted)] hover:text-[var(--la-ink)]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-[var(--la-ink-faint)] underline-offset-4 hover:text-[var(--la-ink-muted)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
          >
            Reset showcase
          </button>
        </div>

        {/* courtyard: swipe colonnade on mobile, niche grid on desktop */}
        {view === "courtyard" ? (
          <section
            aria-label="Courtyard of arch niches"
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4"
          >
            {REWARDS.map((reward) => (
              <StoaNiche
                key={reward.id}
                reward={reward}
                restored={isRestored(reward.id)}
                onOpen={setSelectedId}
              />
            ))}
          </section>
        ) : (
          /* reduced-motion-friendly list view */
          <section aria-label="Reward list" className="flex flex-col gap-3">
            {REWARDS.map((reward) => {
              const restored = isRestored(reward.id)
              return (
                <button
                  key={reward.id}
                  type="button"
                  onClick={() => setSelectedId(reward.id)}
                  className="flex items-center gap-4 rounded-[var(--la-radius-m)] border bg-[var(--la-surface)] p-3 text-left transition-shadow hover:shadow-[var(--la-shadow-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
                  style={{ borderColor: restored ? "var(--la-wisdom)" : "var(--la-surface-sunken)" }}
                  aria-label={
                    restored
                      ? `${reward.title}, restored. Open detail.`
                      : `Empty niche for ${reward.bookTitle}. ${reward.emptyCopy.body}`
                  }
                >
                  <span className="block h-16 w-12 shrink-0 overflow-hidden rounded border border-[var(--la-surface-sunken)] bg-[var(--la-surface-sunken)]">
                    {restored ? (
                      /* eslint-disable-next-line @next/next/no-img-element -- vector art, serialized for download */
                      <img src={reward.artSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span aria-hidden="true" className="m-2 block h-12 rounded-full border border-dashed border-[var(--la-ink-faint)]" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {restored ? reward.title : reward.bookTitle}
                    </span>
                    <span className="block text-xs text-[var(--la-ink-muted)]">
                      {restored
                        ? `From ${reward.bookTitle} by ${reward.author}`
                        : reward.emptyCopy.body}
                    </span>
                  </span>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{
                      backgroundColor: restored ? "var(--la-wisdom-soft)" : "var(--la-surface-sunken)",
                      color: restored ? "var(--la-wisdom-deep)" : "var(--la-ink-muted)",
                    }}
                  >
                    {restored ? "Restored" : "Empty"}
                  </span>
                </button>
              )
            })}
          </section>
        )}

        <footer className="mt-10 border-t border-[var(--la-surface-sunken)] pt-4 text-xs text-[var(--la-ink-faint)]">
          Every painting is original Tome art, generated for this courtyard —
          one per book, restored by passing that book&apos;s Trial. Showcase
          state is stored locally on this device only.
        </footer>
      </div>

      {selected && (
        <StoaDetail
          reward={selected}
          restored={isRestored(selected.id)}
          open={selected !== null}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  )
}
