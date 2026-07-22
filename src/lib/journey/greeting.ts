// ─────────────────────────────────────────────
// Journey Home — Virgil greeting
// ─────────────────────────────────────────────
// Time-aware, state-based greeting for the reader home. The salutation is
// time-of-day aware; the spoken line is real Virgil production copy from
// src/lib/virgil/copy.ts — greeting lines for new readers, welcomeBack lines
// for returning ones. State-based, never invasive: only the loop state and
// the clock, no profiling.
//
// Selection is deterministic (day-of-year) so server and client agree once
// the hour is known, and so the same day always greets the same way.

import { VIRGIL_COPY } from "@/lib/virgil/copy"

export type TimeOfDay = "morning" | "afternoon" | "evening"

export function timeOfDayForHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return "morning"
  if (hour >= 12 && hour < 18) return "afternoon"
  return "evening"
}

const SALUTATIONS: Record<TimeOfDay, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
}

export interface VirgilGreeting {
  /** Time-aware salutation, e.g. "Good evening." */
  salutation: string
  /** One line of Virgil production copy, chosen by reader state. */
  line: string
}

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 1)
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((today - start) / 86_400_000)
}

/**
 * Build the greeting for a local Date. `returning` selects the copy pool:
 * welcomeBack lines for a reader whose journey is underway, greeting lines
 * for a first visit.
 */
export function buildGreeting(date: Date, returning: boolean): VirgilGreeting {
  const salutation = SALUTATIONS[timeOfDayForHour(date.getHours())]
  const pool = returning ? VIRGIL_COPY.welcomeBack : VIRGIL_COPY.greeting
  const line = pool[dayOfYear(date) % pool.length] ?? pool[0]!
  return { salutation, line }
}
