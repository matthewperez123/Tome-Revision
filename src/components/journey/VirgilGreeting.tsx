"use client"

/**
 * VirgilGreeting — the time-aware welcome header for /journey.
 *
 * Copy comes from src/lib/virgil/copy.ts (greeting / welcomeBack pools),
 * chosen by journey state — never by personal profiling. The salutation is
 * time-of-day aware; both are computed after mount so server and client
 * markup never disagree, with a stable static fallback for first paint.
 * Reduced motion renders Virgil's still pose via the component itself.
 */

import { useEffect, useState } from "react"
import { Virgil } from "@/components/virgil"
import { buildGreeting, type VirgilGreeting as Greeting } from "@/lib/journey/greeting"
import { useJourneyState } from "@/lib/journey/state"

const FALLBACK: Greeting = {
  salutation: "Welcome",
  line: "The lamp is lit. Pick a page and I'll walk with you.",
}

export function VirgilGreeting() {
  const { loop } = useJourneyState()
  const [greeting, setGreeting] = useState<Greeting>(FALLBACK)

  // Clock-derived copy must be set after mount to avoid hydration mismatch;
  // deferred to a frame callback so the effect stays an external-sync body.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setGreeting(buildGreeting(new Date(), loop !== "new"))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [loop])

  return (
    <header className="flex flex-wrap items-center gap-5">
      <Virgil state="idle" variant="macbeth" size={96} bust className="shrink-0" />
      <div className="min-w-0 max-w-xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--la-wisdom-deep)]">
          Your journey
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--la-ink)] md:text-4xl">
          {greeting.salutation}, reader.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--la-ink-muted)] md:text-base">
          Virgil: <q className="italic">{greeting.line}</q>
        </p>
      </div>
    </header>
  )
}
