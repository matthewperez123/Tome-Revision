"use client"

// ─────────────────────────────────────────────
// Journey Home — Showcase State
// ─────────────────────────────────────────────
// Demo/showcase-only store for the /journey reader home: first-time guided
// loop completion, path nodes completed during the tap-through, and the
// small Wisdom/Flame bonuses the loop grants by DOING. Mirrors the
// dependency-free useSyncExternalStore pattern of src/lib/stoa/state.ts and
// shares the "tome-showcase" localStorage namespace so the demo resets
// cleanly. NO Supabase writes — real progress derivation replaces this at
// integration time.

import { useCallback, useSyncExternalStore } from "react"

const STORAGE_KEY = "tome-showcase:journey:v1"
const CHANGE_EVENT = "tome-showcase:journey:change"

export type FirstTimeLoopState = "new" | "done" | "skipped"

export interface JourneyShowcaseState {
  /** First-time guided loop: fresh reader, finished, or dismissed. */
  loop: FirstTimeLoopState
  /** Path node ids completed on top of the seeded story (see macbeth-path). */
  nodesCompleted: string[]
  /** Extra Wisdom granted by performing the guided loop. */
  wisdomBonus: number
  /** Today's hearth secured by acting in the guided loop / daily goal. */
  flameSecuredToday: boolean
}

export const EMPTY_JOURNEY_STATE: JourneyShowcaseState = {
  loop: "new",
  nodesCompleted: [],
  wisdomBonus: 0,
  flameSecuredToday: false,
}

// ── Snapshot (module-level, mutable) ─────────

let snapshot: JourneyShowcaseState = EMPTY_JOURNEY_STATE
let hydrated = false

function coerce(raw: unknown): JourneyShowcaseState {
  if (!raw || typeof raw !== "object") return EMPTY_JOURNEY_STATE
  const record = raw as Partial<Record<keyof JourneyShowcaseState, unknown>>
  const loop: FirstTimeLoopState =
    record.loop === "done" || record.loop === "skipped" ? record.loop : "new"
  const nodesCompleted = Array.isArray(record.nodesCompleted)
    ? [
        ...new Set(
          record.nodesCompleted.filter(
            (v): v is string => typeof v === "string" && v.length > 0,
          ),
        ),
      ]
    : []
  const wisdomBonus =
    typeof record.wisdomBonus === "number" && Number.isFinite(record.wisdomBonus)
      ? Math.max(0, Math.floor(record.wisdomBonus))
      : 0
  return {
    loop,
    nodesCompleted,
    wisdomBonus,
    flameSecuredToday: record.flameSecuredToday === true,
  }
}

function readStorage(): JourneyShowcaseState {
  if (typeof window === "undefined") return EMPTY_JOURNEY_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? coerce(JSON.parse(raw)) : EMPTY_JOURNEY_STATE
  } catch {
    return EMPTY_JOURNEY_STATE
  }
}

function writeStorage(next: JourneyShowcaseState): void {
  snapshot = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // private mode / quota — the in-memory snapshot still drives the UI
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

function ensureHydrated(): void {
  if (hydrated || typeof window === "undefined") return
  hydrated = true
  snapshot = readStorage()
}

// ── Store API ────────────────────────────────

function subscribe(onChange: () => void): () => void {
  ensureHydrated()
  const onCustom = () => onChange()
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      snapshot = readStorage()
      onChange()
    }
  }
  window.addEventListener(CHANGE_EVENT, onCustom)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom)
    window.removeEventListener("storage", onStorage)
  }
}

function getSnapshot(): JourneyShowcaseState {
  ensureHydrated()
  return snapshot
}

function getServerSnapshot(): JourneyShowcaseState {
  return EMPTY_JOURNEY_STATE
}

/** Mark the first-time guided loop as completed. */
export function completeFirstTimeLoop(): void {
  ensureHydrated()
  writeStorage({ ...snapshot, loop: "done" })
}

/** Dismiss the first-time guided loop without finishing it. */
export function skipFirstTimeLoop(): void {
  ensureHydrated()
  writeStorage({ ...snapshot, loop: "skipped" })
}

/** Complete a path node during the guided loop (idempotent). */
export function completeJourneyNode(id: string): void {
  ensureHydrated()
  if (snapshot.nodesCompleted.includes(id)) return
  writeStorage({
    ...snapshot,
    nodesCompleted: [...snapshot.nodesCompleted, id],
  })
}

/** Grant bonus Wisdom earned by acting in the guided loop. */
export function grantLoopWisdom(amount: number): void {
  ensureHydrated()
  const bonus = Math.max(0, Math.floor(amount))
  if (bonus === 0) return
  writeStorage({ ...snapshot, wisdomBonus: snapshot.wisdomBonus + bonus })
}

/** Secure today's hearth (guided loop / daily goal action). */
export function secureFlameToday(): void {
  ensureHydrated()
  if (snapshot.flameSecuredToday) return
  writeStorage({ ...snapshot, flameSecuredToday: true })
}

/** Clear all journey showcase state (demo reset). */
export function resetJourney(): void {
  ensureHydrated()
  writeStorage(EMPTY_JOURNEY_STATE)
}

export interface UseJourneyStateResult extends JourneyShowcaseState {
  isNodeCompleted: (id: string) => boolean
  completeLoop: typeof completeFirstTimeLoop
  skipLoop: typeof skipFirstTimeLoop
  completeNode: typeof completeJourneyNode
  grantWisdom: typeof grantLoopWisdom
  secureFlame: typeof secureFlameToday
  reset: typeof resetJourney
}

/** Showcase-scoped journey state. Re-renders on any change. */
export function useJourneyState(): UseJourneyStateResult {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isNodeCompleted = useCallback(
    (id: string) => state.nodesCompleted.includes(id),
    [state.nodesCompleted],
  )
  return {
    ...state,
    isNodeCompleted,
    completeLoop: completeFirstTimeLoop,
    skipLoop: skipFirstTimeLoop,
    completeNode: completeJourneyNode,
    grantWisdom: grantLoopWisdom,
    secureFlame: secureFlameToday,
    reset: resetJourney,
  }
}
