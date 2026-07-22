/**
 * Showcase session — deterministic constants for the /showcase route.
 *
 * EVERY value here is fixed: the same seed, the same seeded reader state,
 * the same reward composition on every visit and every reset. Nothing in
 * the showcase reads the clock, the network, or Supabase; the only mutable
 * surface is the localStorage "tome-showcase" namespace (see ./store.ts),
 * which Reset clears back to these constants.
 *
 * The +120 Wisdom session award is a composition of REAL game-economy
 * actions (src/lib/game/economy.ts WISDOM_AWARDS) for the canonical path:
 * read the passage, finish the Trial perfectly without hints, save the
 * reflection, and check in for the day. The level-up is derived with the
 * economy's own level curve from the seeded lifetime total.
 */

import {
  WISDOM_AWARDS,
  advanceFlame,
  crossesLevel,
  initialFlame,
  levelForWisdom,
  wisdomForLevel,
  type FlameAdvance,
} from "@/lib/game/economy"
import type { CompletionSummary } from "@/lib/trials/engine"

/**
 * The minimal slice of the engine's CompletionSummary the session award
 * depends on — persistable in the showcase store so the crescendo replays
 * identically after a reload.
 */
export interface SessionOutcome {
  totalQuestions: number
  answeredCorrect: number
  firstTryCorrect: number
  hintsUsed: number
}

/** Narrow a full engine summary to the persistable outcome. */
export function outcomeFromSummary(s: CompletionSummary): SessionOutcome {
  return {
    totalQuestions: s.totalQuestions,
    answeredCorrect: s.answeredCorrect,
    firstTryCorrect: s.firstTryCorrect,
    hintsUsed: s.hintsUsed,
  }
}

/** Single deterministic seed used by the Trial engine and every shuffle. */
export const SHOWCASE_SEED = "tome-showcase-macbeth-2026-07-22"

/** localStorage namespace cleared by the one-click Reset. */
export const SHOWCASE_STORAGE_PREFIX = "tome-showcase"

// ── Roles & devices ──────────────────────────

export const SHOWCASE_ROLES = ["reader", "student", "teacher", "parent"] as const
export type ShowcaseRole = (typeof SHOWCASE_ROLES)[number]

export const SHOWCASE_ROLE_LABELS: Record<ShowcaseRole, string> = {
  reader: "Reader",
  student: "Student",
  teacher: "Teacher",
  parent: "Parent",
}

export const SHOWCASE_DEVICES = ["desktop", "tablet", "mobile"] as const
export type ShowcaseDevice = (typeof SHOWCASE_DEVICES)[number]

export const SHOWCASE_DEVICE_LABELS: Record<ShowcaseDevice, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
}

export const SHOWCASE_MODES = ["tour", "explore"] as const
export type ShowcaseMode = (typeof SHOWCASE_MODES)[number]

export function isShowcaseRole(v: string): v is ShowcaseRole {
  return (SHOWCASE_ROLES as readonly string[]).includes(v)
}
export function isShowcaseDevice(v: string): v is ShowcaseDevice {
  return (SHOWCASE_DEVICES as readonly string[]).includes(v)
}
export function isShowcaseMode(v: string): v is ShowcaseMode {
  return (SHOWCASE_MODES as readonly string[]).includes(v)
}

// ── The vertical-slice steps ─────────────────

export const SLICE_STEPS = [
  "home",
  "portal",
  "passage",
  "virgil",
  "trial",
  "crescendo",
  "stoa",
] as const
export type SliceStep = (typeof SLICE_STEPS)[number]

export const SLICE_STEP_LABELS: Record<SliceStep, string> = {
  home: "Reader home",
  portal: "Book-world portal",
  passage: "Guided reading",
  virgil: "Ask Virgil",
  trial: "The Trial",
  crescendo: "Reward crescendo",
  stoa: "The Stoa",
}

// ── Seeded reader state ──────────────────────

/** Seeded lifetime Wisdom before the showcase session begins. */
export const SEEDED_PRIOR_WISDOM = 40

/** Seeded Flame: six-day hearth, yesterday active, today still open. */
export const SEEDED_FLAME_LAST_DAY = "2026-07-21"
export const SEEDED_FLAME_TODAY = "2026-07-22"
export const SEEDED_FLAME_DAYS = 6

// ── The +120 session award ───────────────────

export interface SessionAwardLine {
  action: keyof typeof WISDOM_AWARDS
  label: string
  amount: number
  /** True when the line depends on how the Trial was actually played. */
  conditional: boolean
}

/**
 * The canonical-path breakdown. `trial-perfect` and `trial-no-hints` are
 * conditional on the real engine summary; everything else is fixed.
 */
export function sessionAwardLines(outcome: SessionOutcome | null): SessionAwardLine[] {
  const perfect =
    outcome !== null &&
    outcome.totalQuestions > 0 &&
    outcome.answeredCorrect === outcome.totalQuestions &&
    outcome.firstTryCorrect === outcome.totalQuestions
  const noHints = outcome !== null && outcome.hintsUsed === 0
  return [
    { action: "daily-return", label: "Daily return", amount: WISDOM_AWARDS["daily-return"], conditional: false },
    { action: "read-page", label: "Passage read", amount: WISDOM_AWARDS["read-page"], conditional: false },
    { action: "read-chapter", label: "Scene completed", amount: WISDOM_AWARDS["read-chapter"], conditional: false },
    { action: "trial-complete", label: "Trial passed", amount: WISDOM_AWARDS["trial-complete"], conditional: false },
    { action: "trial-perfect", label: "Flawless Trial", amount: perfect ? WISDOM_AWARDS["trial-perfect"] : 0, conditional: true },
    { action: "trial-no-hints", label: "No hints taken", amount: noHints ? WISDOM_AWARDS["trial-no-hints"] : 0, conditional: true },
    { action: "journal-entry", label: "Reflection saved", amount: WISDOM_AWARDS["journal-entry"], conditional: false },
  ]
}

/** Total session Wisdom (120 on the canonical path). */
export function sessionAwardTotal(outcome: SessionOutcome | null): number {
  return sessionAwardLines(outcome).reduce((n, l) => n + l.amount, 0)
}

/** Lifetime Wisdom after the session. */
export function seededTotalWisdom(outcome: SessionOutcome | null): number {
  return SEEDED_PRIOR_WISDOM + sessionAwardTotal(outcome)
}

/** Whether the session award crosses a level threshold (economy curve). */
export function sessionLeveledUp(outcome: SessionOutcome | null): boolean {
  return crossesLevel(SEEDED_PRIOR_WISDOM, sessionAwardTotal(outcome))
}

/** Level before / after, from the economy's own curve. */
export function sessionLevels(outcome: SessionOutcome | null): { before: number; after: number } {
  return {
    before: levelForWisdom(SEEDED_PRIOR_WISDOM),
    after: levelForWisdom(seededTotalWisdom(outcome)),
  }
}

/** Wisdom required for a level (re-exported for the level-up beat). */
export { wisdomForLevel }

/** Seeded Flame advanced by today's activity — deterministic day strings. */
export function sessionFlame(): FlameAdvance {
  return advanceFlame(
    { ...initialFlame(), state: "at-risk", days: SEEDED_FLAME_DAYS, lastActiveDay: SEEDED_FLAME_LAST_DAY },
    { today: SEEDED_FLAME_TODAY, activeToday: true },
  )
}
