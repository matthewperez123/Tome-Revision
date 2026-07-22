"use client"

/**
 * JourneyPath — the chapter/path map for the current book.
 *
 * Renders the real Macbeth structure (34 chapters grouped into day nodes,
 * three Trials, the Seal, the Stoa) through the game PathMap. States come
 * from the seeded story merged with live showcase completions, so completing
 * a node live flips the next one unlocked and PathNode plays its wake-pop
 * (the unlock animation); reduced motion swaps state instantly.
 *
 * Activation routes to real surfaces: chapter nodes resume the reader,
 * Trial nodes open the Trial showcase, the Seal/Stoa nodes open the Stoa.
 * Locked nodes stay focusable and announce their earning path (PathNode).
 */

import { useRouter } from "next/navigation"
import { PathMap } from "@/components/game"
import { getJourneyNode, resolveNodeStates } from "@/lib/journey/macbeth-path"
import { useJourneyState } from "@/lib/journey/state"

export function JourneyPath() {
  const router = useRouter()
  const { nodesCompleted } = useJourneyState()
  const nodes = resolveNodeStates(nodesCompleted)

  const handleActivate = (id: string) => {
    const def = getJourneyNode(id)
    if (!def) return
    switch (def.kind) {
      case "chapter":
        router.push("/read/macbeth")
        break
      case "trial":
        // Trial showcase route; the in-reader Trial launch replaces this at
        // integration time.
        router.push("/dev/trials")
        break
      case "seal":
      case "stoa":
        router.push("/stoa")
        break
    }
  }

  return (
    <section
      id="journey-path"
      aria-label="Macbeth journey path"
      data-loop-target="path"
      className="scroll-mt-6 rounded-[var(--la-radius-l)] border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-5 md:p-6"
      style={{ boxShadow: "var(--la-shadow-raised)" }}
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold tracking-tight text-[var(--la-ink)]">
          The path through the storm
        </h2>
        <p className="text-xs text-[var(--la-ink-muted)]">
          Days, Trials, the Seal, and the Stoa — in walking order.
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <PathMap
          nodes={nodes}
          width={400}
          height={900}
          onNodeActivate={handleActivate}
          label="Macbeth journey path: day chapters, Trials, Seal, and Stoa"
        />
      </div>

      {/* Text mirror of the path — the map stays meaningful with every
          animation off, and gives screen readers the full sequence. */}
      <ol className="sr-only">
        {nodes.map((node) => (
          <li key={node.id}>
            {getJourneyNode(node.id)?.title ?? node.label} — {node.state}
          </li>
        ))}
      </ol>
    </section>
  )
}
