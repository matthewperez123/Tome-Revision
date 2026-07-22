"use client"

// ─────────────────────────────────────────────
// Journeys — Showcase Progress Store
// ─────────────────────────────────────────────
// Demo/showcase-only per-journey progress, localStorage-backed under
//   tome-showcase:journey:<journeyId>
// Same dependency-free useSyncExternalStore pattern as
// src/lib/stoa/state.ts (which itself follows src/lib/reader/reader-prefs.ts):
// one module-level snapshot per journey, a custom event for same-tab
// subscribers, the storage event for other tabs. NO Supabase writes.

import { useCallback, useSyncExternalStore } from "react"

// ── Types ────────────────────────────────────

export interface JourneyDayResult {
  /** Total Wisdom banked for the day (per-item + daily completion bonus). */
  wisdomEarned: number
  /** Trial items answered correctly (of the day's total). */
  correct: number
  total: number
  /** ISO timestamp of completion. */
  completedAt: string
}

export interface JourneyProgress {
  /** Completed days, keyed by day number (string). */
  days: Record<string, JourneyDayResult>
  /** Earned seal ids, in earning order (milestones + final). */
  seals: string[]
  /** True once the journey's Stoa reward was restored (final day). */
  stoaRestored: boolean
}

export type JourneyDayState = "locked" | "available" | "done"

const EMPTY_STATE: JourneyProgress = { days: {}, seals: [], stoaRestored: false }

// ── Per-journey snapshot registry ────────────

interface JourneyChannel {
  snapshot: JourneyProgress
  hydrated: boolean
  storageKey: string
  changeEvent: string
}

const channels = new Map<string, JourneyChannel>()

function channelFor(journeyId: string): JourneyChannel {
  let channel = channels.get(journeyId)
  if (!channel) {
    channel = {
      snapshot: EMPTY_STATE,
      hydrated: false,
      storageKey: `tome-showcase:journey:${journeyId}`,
      changeEvent: `tome-showcase:journey:${journeyId}:change`,
    }
    channels.set(journeyId, channel)
  }
  return channel
}

function coerce(raw: unknown): JourneyProgress {
  if (!raw || typeof raw !== "object") return EMPTY_STATE
  const source = raw as Partial<JourneyProgress>
  const days: Record<string, JourneyDayResult> = {}
  if (source.days && typeof source.days === "object") {
    for (const [key, value] of Object.entries(source.days)) {
      if (!value || typeof value !== "object") continue
      const v = value as Partial<JourneyDayResult>
      if (
        typeof v.wisdomEarned === "number" &&
        typeof v.correct === "number" &&
        typeof v.total === "number" &&
        typeof v.completedAt === "string"
      ) {
        days[key] = {
          wisdomEarned: Math.max(0, Math.floor(v.wisdomEarned)),
          correct: Math.max(0, Math.floor(v.correct)),
          total: Math.max(0, Math.floor(v.total)),
          completedAt: v.completedAt,
        }
      }
    }
  }
  const seals = Array.isArray(source.seals)
    ? [...new Set(source.seals.filter((s): s is string => typeof s === "string"))]
    : []
  return { days, seals, stoaRestored: source.stoaRestored === true }
}

function readStorage(channel: JourneyChannel): JourneyProgress {
  if (typeof window === "undefined") return EMPTY_STATE
  try {
    const raw = window.localStorage.getItem(channel.storageKey)
    return raw ? coerce(JSON.parse(raw)) : EMPTY_STATE
  } catch {
    return EMPTY_STATE
  }
}

function writeStorage(channel: JourneyChannel, next: JourneyProgress): void {
  channel.snapshot = next
  try {
    window.localStorage.setItem(channel.storageKey, JSON.stringify(next))
  } catch {
    // private mode / quota — the in-memory snapshot still drives the UI
  }
  window.dispatchEvent(new CustomEvent(channel.changeEvent))
}

function ensureHydrated(channel: JourneyChannel): void {
  if (channel.hydrated || typeof window === "undefined") return
  channel.hydrated = true
  channel.snapshot = readStorage(channel)
}

// ── Mutations ────────────────────────────────

/**
 * Record a completed day. Idempotent per day: a re-walk replaces the
 * prior result only when it earns more Wisdom (best-score wins, so
 * replaying a day never shrinks the record).
 */
export function completeJourneyDay(
  journeyId: string,
  day: number,
  result: Omit<JourneyDayResult, "completedAt">,
): void {
  const channel = channelFor(journeyId)
  ensureHydrated(channel)
  const key = String(day)
  const prior = channel.snapshot.days[key]
  if (prior && prior.wisdomEarned >= result.wisdomEarned) return
  writeStorage(channel, {
    ...channel.snapshot,
    days: {
      ...channel.snapshot.days,
      [key]: { ...result, completedAt: new Date().toISOString() },
    },
  })
}

/** Record an earned Seal (milestone or final). Idempotent. */
export function awardJourneySeal(journeyId: string, sealId: string): void {
  const channel = channelFor(journeyId)
  ensureHydrated(channel)
  if (channel.snapshot.seals.includes(sealId)) return
  writeStorage(channel, {
    ...channel.snapshot,
    seals: [...channel.snapshot.seals, sealId],
  })
}

/** Mark the journey's Stoa reward as restored. Idempotent. */
export function restoreJourneyStoa(journeyId: string): void {
  const channel = channelFor(journeyId)
  ensureHydrated(channel)
  if (channel.snapshot.stoaRestored) return
  writeStorage(channel, { ...channel.snapshot, stoaRestored: true })
}

/** Clear this journey's progress (showcase reset). */
export function resetJourney(journeyId: string): void {
  const channel = channelFor(journeyId)
  ensureHydrated(channel)
  writeStorage(channel, EMPTY_STATE)
}

// ── Derived state ────────────────────────────

/**
 * Sequential unlock: day 1 is always available; day N unlocks when day
 * N-1 is done. Completed days are "done" (replayable).
 */
export function journeyDayState(progress: JourneyProgress, day: number): JourneyDayState {
  if (progress.days[String(day)]) return "done"
  if (day === 1) return "available"
  return progress.days[String(day - 1)] ? "available" : "locked"
}

/** The first incomplete, unlocked day — where the trail resumes. */
export function journeyCurrentDay(progress: JourneyProgress, totalDays: number): number | null {
  for (let day = 1; day <= totalDays; day += 1) {
    if (!progress.days[String(day)] && journeyDayState(progress, day) !== "locked") return day
  }
  return null
}

/** Total Wisdom banked across completed days. */
export function journeyTotalWisdom(progress: JourneyProgress): number {
  return Object.values(progress.days).reduce((sum, d) => sum + d.wisdomEarned, 0)
}

/** Count of completed days. */
export function journeyCompletedCount(progress: JourneyProgress): number {
  return Object.keys(progress.days).length
}

/** The Flame: secured while at least one day is complete (showcase streak
 *  = completed-day count; the real product derives it server-side). */
export function journeyFlame(progress: JourneyProgress): { state: "unlit" | "secured"; days: number } {
  const days = journeyCompletedCount(progress)
  return days > 0 ? { state: "secured", days } : { state: "unlit", days: 0 }
}

// ── React hook ───────────────────────────────

export interface UseJourneyProgressResult extends JourneyProgress {
  /** Re-render-safe accessors over the snapshot. */
  dayState: (day: number) => JourneyDayState
  currentDay: (totalDays: number) => number | null
  totalWisdom: number
  completedCount: number
  isComplete: (totalDays: number) => boolean
  completeDay: (day: number, result: Omit<JourneyDayResult, "completedAt">) => void
  awardSeal: (sealId: string) => void
  restoreStoa: () => void
  reset: () => void
}

/** Showcase-scoped progress for one journey. Re-renders on any change. */
export function useJourneyProgress(journeyId: string): UseJourneyProgressResult {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const channel = channelFor(journeyId)
      ensureHydrated(channel)
      const onCustom = () => onChange()
      const onStorage = (e: StorageEvent) => {
        if (e.key === channel.storageKey || e.key === null) {
          channel.snapshot = readStorage(channel)
          onChange()
        }
      }
      window.addEventListener(channel.changeEvent, onCustom)
      window.addEventListener("storage", onStorage)
      return () => {
        window.removeEventListener(channel.changeEvent, onCustom)
        window.removeEventListener("storage", onStorage)
      }
    },
    [journeyId],
  )
  const getSnapshot = useCallback(() => {
    const channel = channelFor(journeyId)
    ensureHydrated(channel)
    return channel.snapshot
  }, [journeyId])
  const getServerSnapshot = useCallback(() => EMPTY_STATE, [])

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    ...state,
    dayState: (day) => journeyDayState(state, day),
    currentDay: (totalDays) => journeyCurrentDay(state, totalDays),
    totalWisdom: journeyTotalWisdom(state),
    completedCount: journeyCompletedCount(state),
    isComplete: (totalDays) => journeyCompletedCount(state) >= totalDays,
    completeDay: (day, result) => completeJourneyDay(journeyId, day, result),
    awardSeal: (sealId) => awardJourneySeal(journeyId, sealId),
    restoreStoa: () => restoreJourneyStoa(journeyId),
    reset: () => resetJourney(journeyId),
  }
}
