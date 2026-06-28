/**
 * RUBRIC design language for Semester Planning.
 *
 * Board chrome uses these flat accents. The iridescent gradient is RESERVED for
 * Virgil affordances only (mirrors the guided-session assistant).
 *
 * Type stack: Fraunces (--font-display) for titles, Literata (--font-serif) for
 * body. "Switzer" from the brief is not in the repo — UI labels use the app's
 * sans (Inter) as the documented substitution.
 */

import type { PlanItemType } from "@/lib/semester-plan/types"

// Iridescent (Virgil only) — identical to the guided-session assistant signature.
export const IRIDESCENT =
  "linear-gradient(110deg, #6366F1 0%, #8B5CF6 35%, #06B6D4 70%, #6366F1 100%)"

// Flat RUBRIC accent palette.
export const RUBRIC = {
  lapis: "#2C4A7E",
  vermilion: "#D7472F",
  goldLeaf: "#C8972F",
  tyrian: "#6B2C4E",
  verdigris: "#3E7C6A",
  ink: "#1C1914",
} as const

/** Accent + soft background per item type for chips on the board. */
export const ITEM_ACCENT: Record<PlanItemType, { fg: string; bg: string }> = {
  reading: { fg: RUBRIC.lapis, bg: "rgba(44,74,126,0.10)" },
  quiz: { fg: RUBRIC.tyrian, bg: "rgba(107,44,78,0.10)" },
  guided_session: { fg: RUBRIC.verdigris, bg: "rgba(62,124,106,0.10)" },
  essay: { fg: RUBRIC.goldLeaf, bg: "rgba(200,151,47,0.12)" },
  discussion: { fg: RUBRIC.verdigris, bg: "rgba(62,124,106,0.10)" },
  custom_reading: { fg: RUBRIC.ink, bg: "rgba(28,25,20,0.06)" },
}

export function formatMinutes(min: number): string {
  if (min <= 0) return "0 min"
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}
