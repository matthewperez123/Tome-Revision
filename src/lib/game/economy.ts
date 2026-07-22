// ─────────────────────────────────────────────
// Tome game economy — pure, typed, deterministic.
// ─────────────────────────────────────────────
// Single source of truth for the reward rules described in
// docs/product/core-loop.md (Master Plan §11 'Game economy'):
//
//   Wisdom  — earned by reading and proving, never bought.
//   Flame   — "hearth, not whip": kind streak with pre-granted,
//             auto-applied freeze days and a warm earn-back path.
//   Seals   — mastery medallions: every chapter read + every
//             Trial passed in a book. Never purchasable.
//   Levels  — a gentle cumulative curve over lifetime Wisdom.
//   Caps    — anti-exploit rate limits so grinding junk actions
//             can never outrun genuine reading.
//
// Everything here is a pure function of its inputs — no clocks,
// no storage, no randomness. Callers pass `now`/day strings in.
// ─────────────────────────────────────────────

// ── Wisdom awards ────────────────────────────

export type WisdomAction =
  /** Finishing a page in the reader. */
  | "read-page"
  /** Completing a chapter node on the path. */
  | "read-chapter"
  /** Passing a Trial (at or above the passing score). */
  | "trial-complete"
  /** Bonus: flawless Trial (no incorrect answers). */
  | "trial-perfect"
  /** Bonus: Trial passed without opening the hint drawer. */
  | "trial-no-hints"
  /** Saving a private reflection in the journal. */
  | "journal-entry"
  /** Responding to a Stoa plaque prompt. */
  | "stoa-reflection"
  /** First session of a new day (return welcome). */
  | "daily-return"

/**
 * Base Wisdom granted per action. Proving beats clicking: Trials
 * dominate, reading follows, everything else is a small kindness.
 */
export const WISDOM_AWARDS: Record<WisdomAction, number> = {
  "read-page": 2,
  "read-chapter": 20,
  "trial-complete": 50,
  "trial-perfect": 25,
  "trial-no-hints": 10,
  "journal-entry": 8,
  "stoa-reflection": 8,
  "daily-return": 5,
} as const

// ── Anti-exploit rate caps ───────────────────

export type RateCap = {
  /** Max times this action pays out in any rolling hour. */
  readonly perHour: number
  /** Max times this action pays out in any rolling UTC day. */
  readonly perDay: number
}

/**
 * Rolling-window payout caps per action. Exceeding a cap never
 * punishes the reader — the action still counts toward progress,
 * it simply stops granting Wisdom until the window opens up.
 */
export const ACTION_RATE_CAPS: Record<WisdomAction, RateCap> = {
  "read-page": { perHour: 120, perDay: 400 },
  "read-chapter": { perHour: 12, perDay: 24 },
  "trial-complete": { perHour: 20, perDay: 60 },
  "trial-perfect": { perHour: 20, perDay: 60 },
  "trial-no-hints": { perHour: 20, perDay: 60 },
  "journal-entry": { perHour: 6, perDay: 12 },
  "stoa-reflection": { perHour: 6, perDay: 12 },
  "daily-return": { perHour: 2, perDay: 2 },
} as const

/** Hard ceiling on total Wisdom granted per UTC day, all actions. */
export const WISDOM_DAILY_TOTAL_CAP = 1_000

const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

/** Count timestamps within the trailing `windowMs` ending at `now`. */
export function countWithinWindow(
  timestamps: readonly number[],
  now: number,
  windowMs: number,
): number {
  let count = 0
  for (const t of timestamps) {
    if (t <= now && now - t < windowMs) count += 1
  }
  return count
}

/**
 * `true` when one more payout of `action` is allowed at `now`,
 * given previous payout timestamps for that action.
 */
export function checkRateCap(
  action: WisdomAction,
  payoutTimestamps: readonly number[],
  now: number,
): boolean {
  const cap = ACTION_RATE_CAPS[action]
  if (countWithinWindow(payoutTimestamps, now, HOUR_MS) >= cap.perHour) return false
  if (countWithinWindow(payoutTimestamps, now, DAY_MS) >= cap.perDay) return false
  return true
}

export type WisdomAward = {
  readonly action: WisdomAction
  /** Wisdom actually granted (0 when capped). */
  readonly granted: number
  /** Base amount requested, before caps. */
  readonly base: number
  /** Whether any cap reduced the grant. */
  readonly capped: boolean
  readonly reason: "ok" | "action-cap" | "daily-total-cap"
}

/**
 * Grant Wisdom for an action, applying the action's rolling caps
 * and the global daily total cap. Pure: pass the action's payout
 * history and today's running total; returns the granted amount.
 */
export function awardWisdom(
  action: WisdomAction,
  history: { readonly payoutTimestamps: readonly number[]; readonly todayTotal: number },
  now: number,
): WisdomAward {
  const base = WISDOM_AWARDS[action]
  if (!checkRateCap(action, history.payoutTimestamps, now)) {
    return { action, granted: 0, base, capped: true, reason: "action-cap" }
  }
  const headroom = Math.max(0, WISDOM_DAILY_TOTAL_CAP - history.todayTotal)
  const granted = Math.min(base, headroom)
  return {
    action,
    granted,
    base,
    capped: granted < base,
    reason: granted === 0 ? "daily-total-cap" : "ok",
  }
}

// ── Level curve ──────────────────────────────

/**
 * Cumulative Wisdom required to reach level `n` (levels start at 1,
 * reached at 0 Wisdom). A soft power curve rounded to 25s: early
 * levels arrive quickly, later levels take real reading.
 */
export const LEVEL_BASE = 80
export const LEVEL_EXPONENT = 1.6
export const LEVEL_STEP = 25

/** Total lifetime Wisdom needed to *reach* `level`. */
export function wisdomForLevel(level: number): number {
  if (!Number.isFinite(level) || level <= 1) return 0
  const raw = LEVEL_BASE * Math.pow(level - 1, LEVEL_EXPONENT)
  return Math.round(raw / LEVEL_STEP) * LEVEL_STEP
}

/** Highest level reachable with `totalWisdom` lifetime Wisdom. */
export function levelForWisdom(totalWisdom: number): number {
  const total = Math.max(0, Math.floor(totalWisdom))
  let level = 1
  while (wisdomForLevel(level + 1) <= total) level += 1
  return level
}

export type LevelProgress = {
  readonly level: number
  /** Wisdom earned toward the next level. */
  readonly intoLevel: number
  /** Wisdom still needed for the next level. */
  readonly toNext: number
  /** 0..1 fraction of the way through the current level. */
  readonly fraction: number
}

export function levelProgress(totalWisdom: number): LevelProgress {
  const level = levelForWisdom(totalWisdom)
  const floor = wisdomForLevel(level)
  const ceiling = wisdomForLevel(level + 1)
  const intoLevel = Math.max(0, Math.floor(totalWisdom) - floor)
  const span = Math.max(1, ceiling - floor)
  return {
    level,
    intoLevel,
    toNext: Math.max(0, ceiling - Math.floor(totalWisdom)),
    fraction: Math.min(1, intoLevel / span),
  }
}

/** `true` when granting `amount` crosses into a new level. */
export function crossesLevel(totalBefore: number, amount: number): boolean {
  return levelForWisdom(totalBefore + Math.max(0, amount)) > levelForWisdom(totalBefore)
}

// ── Flame (the hearth) ───────────────────────

export type FlameState = "unlit" | "at-risk" | "secured"

/**
 * Freeze days are pre-granted (never earned, never bought) and
 * auto-applied: a fully missed day silently consumes one instead
 * of breaking the streak. This is the grace policy from
 * docs/product/core-loop.md — the hearth is never a whip.
 */
export const FLAME_MAX_FREEZES = 2

export type FlameSnapshot = {
  readonly state: FlameState
  /** Consecutive days the hearth has been kept. */
  readonly days: number
  /** Pre-granted freeze days still available (0..FLAME_MAX_FREEZES). */
  readonly freezesAvailable: number
  /** ISO day (YYYY-MM-DD, UTC) of the last day with activity. */
  readonly lastActiveDay: string | null
}

export type FlameEvent =
  /** Activity landed today; hearth secured for the day. */
  | "secured"
  /** A freeze was auto-applied to cover a missed day; streak held. */
  | "freeze-applied"
  /** Yesterday was active but today has none yet — gentle nudge. */
  | "at-risk"
  /** Misses exceeded the pre-granted freezes; flame went dark. */
  | "extinguished"
  /** Reader returned after extinguishment; a new day-one flame. */
  | "rekindled"
  /** Nothing changed (same day, or already handled). */
  | "unchanged"

export type FlameAdvance = FlameSnapshot & {
  readonly event: FlameEvent
  /** Freezes consumed by this advance (0 when none). */
  readonly freezesUsed: number
}

/** Whole-day difference `b − a` between two YYYY-MM-DD UTC day strings. */
export function dayDiff(a: string, b: string): number {
  const msA = Date.parse(`${a}T00:00:00Z`)
  const msB = Date.parse(`${b}T00:00:00Z`)
  return Math.round((msB - msA) / DAY_MS)
}

export function initialFlame(freezes: number = FLAME_MAX_FREEZES): FlameSnapshot {
  return { state: "unlit", days: 0, freezesAvailable: freezes, lastActiveDay: null }
}

/**
 * Advance the Flame to `today`. Call once per day boundary and once
 * whenever the reader's first qualifying activity of the day lands
 * (`activeToday: true`). Pure and idempotent for the same inputs.
 *
 * Kindness rules (never negotiable):
 *  - Missed days consume pre-granted freezes before anything breaks.
 *  - Extinguishment resets the count but offers `rekindled` — a
 *    warm day-one, never a punishment screen.
 *  - `days` never decreases except on true extinguishment.
 */
export function advanceFlame(
  snapshot: FlameSnapshot,
  input: { readonly today: string; readonly activeToday: boolean },
): FlameAdvance {
  const { today, activeToday } = input
  const freezes = Math.max(0, Math.min(FLAME_MAX_FREEZES, snapshot.freezesAvailable))
  const last = snapshot.lastActiveDay

  // First-ever activity.
  if (last === null) {
    if (!activeToday) {
      return { ...snapshot, freezesAvailable: freezes, event: "unchanged", freezesUsed: 0 }
    }
    return { state: "secured", days: 1, freezesAvailable: freezes, lastActiveDay: today, event: "secured", freezesUsed: 0 }
  }

  const gap = dayDiff(last, today)

  // Same day: only a pending secure can complete.
  if (gap === 0) {
    if (activeToday && snapshot.state !== "secured") {
      return { ...snapshot, state: "secured", freezesAvailable: freezes, event: "secured", freezesUsed: 0 }
    }
    return { ...snapshot, freezesAvailable: freezes, event: "unchanged", freezesUsed: 0 }
  }

  if (gap < 0) {
    // Clock moved backwards; treat defensively as no change.
    return { ...snapshot, freezesAvailable: freezes, event: "unchanged", freezesUsed: 0 }
  }

  const missedDays = gap - 1

  if (activeToday) {
    if (snapshot.days === 0) {
      // Warm re-entry after extinguishment (or a frozen restart):
      // a new day-one flame, and grace is structurally re-granted.
      return { state: "secured", days: 1, freezesAvailable: FLAME_MAX_FREEZES, lastActiveDay: today, event: snapshot.lastActiveDay === null ? "secured" : "rekindled", freezesUsed: 0 }
    }
    if (missedDays === 0) {
      // Unbroken chain: yesterday was active.
      return { state: "secured", days: snapshot.days + 1, freezesAvailable: freezes, lastActiveDay: today, event: "secured", freezesUsed: 0 }
    }
    if (missedDays <= freezes) {
      // Grace: freezes cover the gap; the streak survives.
      return {
        state: "secured",
        days: snapshot.days + 1,
        freezesAvailable: freezes - missedDays,
        lastActiveDay: today,
        event: "freeze-applied",
        freezesUsed: missedDays,
      }
    }
    // Chain truly broken — warm re-entry, count starts fresh at 1.
    return { state: "secured", days: 1, freezesAvailable: FLAME_MAX_FREEZES, lastActiveDay: today, event: "rekindled", freezesUsed: 0 }
  }

  // No activity today.
  if (missedDays === 0) {
    // Yesterday was active; today is still open.
    return { ...snapshot, state: "at-risk", freezesAvailable: freezes, event: "at-risk", freezesUsed: 0 }
  }
  if (missedDays <= freezes) {
    // Freeze silently holds the hearth. Count preserved; still
    // needs activity today to be secured.
    return {
      state: "at-risk",
      days: snapshot.days,
      freezesAvailable: freezes - missedDays,
      lastActiveDay: today,
      event: "freeze-applied",
      freezesUsed: missedDays,
    }
  }
  // Out of grace: the flame goes dark. Not an error — a state.
  return { state: "unlit", days: 0, freezesAvailable: freezes, lastActiveDay: today, event: "extinguished", freezesUsed: 0 }
}

/** Neutral, no-guilt copy keyed by Flame state (used by FlameMeter). */
export const FLAME_COPY: Record<FlameState, string> = {
  secured: "The hearth is warm.",
  "at-risk": "Read a page today to keep the hearth warm.",
  unlit: "Light the hearth — any page counts.",
} as const

// ── Seals ────────────────────────────────────

/**
 * One Seal per book. The rule is transparent and fixed: read every
 * chapter, pass every Trial. Perfection is never required — Seals
 * reward completion and understanding, not flawlessness.
 */
export type SealRequirement = {
  readonly chaptersRequired: number
  readonly trialsRequired: number
}

export type SealProgress = {
  readonly chaptersCompleted: number
  readonly trialsPassed: number
}

/** `true` when progress satisfies the Seal rule (all of both). */
export function sealUnlocked(requirement: SealRequirement, progress: SealProgress): boolean {
  return (
    progress.chaptersCompleted >= requirement.chaptersRequired &&
    progress.trialsPassed >= requirement.trialsRequired
  )
}

/** 0..1 completion fraction across chapters + Trials combined. */
export function sealProgressFraction(
  requirement: SealRequirement,
  progress: SealProgress,
): number {
  const total = requirement.chaptersRequired + requirement.trialsRequired
  if (total <= 0) return 1
  const done =
    Math.min(progress.chaptersCompleted, requirement.chaptersRequired) +
    Math.min(progress.trialsPassed, requirement.trialsRequired)
  return done / total
}

/**
 * Each unlocked Seal restores exactly one Stoa tile — the visible,
 * permanent record of the reader's effort (Master Plan §11).
 */
export function stoaTileIdForSeal(sealId: string): string {
  return `stoa-tile-${sealId}`
}

// ── Aggregate ────────────────────────────────

export const gameEconomy = {
  awards: WISDOM_AWARDS,
  rateCaps: ACTION_RATE_CAPS,
  dailyTotalCap: WISDOM_DAILY_TOTAL_CAP,
  maxFreezes: FLAME_MAX_FREEZES,
  flameCopy: FLAME_COPY,
} as const
