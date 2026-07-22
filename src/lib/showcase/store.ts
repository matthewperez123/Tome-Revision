"use client"

/**
 * Showcase store — the client-side state of /showcase.
 *
 * localStorage-backed under the shared "tome-showcase" namespace (alongside
 * the Stoa showcase store), so the one-click Reset can clear the entire
 * demo cleanly. Same dependency-free useSyncExternalStore pattern as
 * src/lib/stoa/state.ts. No Supabase writes anywhere in the showcase.
 *
 * Only durable shell + slice progress lives here; ephemeral UI state
 * (streaming cursors, open drawers) stays in React state.
 */

import { useCallback, useSyncExternalStore } from "react"
import {
  type SessionOutcome,
  isShowcaseDevice,
  isShowcaseMode,
  isShowcaseRole,
  type SliceStep,
  type ShowcaseDevice,
  type ShowcaseMode,
  type ShowcaseRole,
  SLICE_STEPS,
} from "./session"

const STORAGE_KEY = "tome-showcase:showcase:v1"
const CHANGE_EVENT = "tome-showcase:showcase:change"

export interface ShowcasePersistedState {
  role: ShowcaseRole
  device: ShowcaseDevice
  mode: ShowcaseMode
  captions: boolean
  /** Vertical-slice progress. */
  sliceStep: SliceStep
  highlightedQuote: string | null
  highlightedParagraphId: string | null
  trialComplete: boolean
  /** Persisted trial outcome — drives the crescendo identically after reload. */
  trialOutcome: SessionOutcome | null
  /** Teacher view: whether "Assign next chapter" has been used. */
  nextChapterAssigned: boolean
}

export const INITIAL_SHOWCASE_STATE: ShowcasePersistedState = {
  role: "reader",
  device: "desktop",
  mode: "tour",
  captions: true,
  sliceStep: "home",
  highlightedQuote: null,
  highlightedParagraphId: null,
  trialComplete: false,
  trialOutcome: null,
  nextChapterAssigned: false,
}

function coerceOutcome(raw: unknown): SessionOutcome | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  const nums = ["totalQuestions", "answeredCorrect", "firstTryCorrect", "hintsUsed"]
  if (!nums.every((k) => typeof o[k] === "number" && Number.isFinite(o[k]))) return null
  return {
    totalQuestions: o.totalQuestions as number,
    answeredCorrect: o.answeredCorrect as number,
    firstTryCorrect: o.firstTryCorrect as number,
    hintsUsed: o.hintsUsed as number,
  }
}

let snapshot: ShowcasePersistedState = INITIAL_SHOWCASE_STATE
let hydrated = false

function coerce(raw: unknown): ShowcasePersistedState {
  if (!raw || typeof raw !== "object") return INITIAL_SHOWCASE_STATE
  const o = raw as Record<string, unknown>
  const step = typeof o.sliceStep === "string" && (SLICE_STEPS as readonly string[]).includes(o.sliceStep)
    ? (o.sliceStep as SliceStep)
    : "home"
  return {
    role: typeof o.role === "string" && isShowcaseRole(o.role) ? o.role : "reader",
    device: typeof o.device === "string" && isShowcaseDevice(o.device) ? o.device : "desktop",
    mode: typeof o.mode === "string" && isShowcaseMode(o.mode) ? o.mode : "tour",
    captions: typeof o.captions === "boolean" ? o.captions : true,
    sliceStep: step,
    highlightedQuote: typeof o.highlightedQuote === "string" ? o.highlightedQuote : null,
    highlightedParagraphId: typeof o.highlightedParagraphId === "string" ? o.highlightedParagraphId : null,
    trialComplete: o.trialComplete === true,
    trialOutcome: coerceOutcome(o.trialOutcome),
    nextChapterAssigned: o.nextChapterAssigned === true,
  }
}

function readStorage(): ShowcasePersistedState {
  if (typeof window === "undefined") return INITIAL_SHOWCASE_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? coerce(JSON.parse(raw)) : INITIAL_SHOWCASE_STATE
  } catch {
    return INITIAL_SHOWCASE_STATE
  }
}

function writeStorage(next: ShowcasePersistedState): void {
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

/** Merge a partial update into the persisted showcase state. */
export function updateShowcase(patch: Partial<ShowcasePersistedState>): void {
  ensureHydrated()
  writeStorage({ ...snapshot, ...patch })
}

/**
 * One-click reset: clears EVERY key in the "tome-showcase" namespace
 * (this store plus the Stoa showcase store) and restores the initial
 * snapshot, so the demo restarts from a clean seeded state.
 */
export function resetShowcase(): void {
  ensureHydrated()
  try {
    const keys: string[] = []
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i)
      if (key && key.startsWith("tome-showcase")) keys.push(key)
    }
    for (const key of keys) window.localStorage.removeItem(key)
  } catch {
    // storage unavailable — in-memory reset below still applies
  }
  writeStorage(INITIAL_SHOWCASE_STATE)
}

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

function getSnapshot(): ShowcasePersistedState {
  ensureHydrated()
  return snapshot
}

function getServerSnapshot(): ShowcasePersistedState {
  return INITIAL_SHOWCASE_STATE
}

export interface UseShowcaseStateResult extends ShowcasePersistedState {
  update: typeof updateShowcase
  reset: typeof resetShowcase
}

/** Persisted showcase state; re-renders on any change. */
export function useShowcaseState(): UseShowcaseStateResult {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const update = useCallback(
    (patch: Partial<ShowcasePersistedState>) => updateShowcase(patch),
    [],
  )
  return { ...state, update, reset: resetShowcase }
}
