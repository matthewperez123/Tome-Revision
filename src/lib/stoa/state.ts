"use client"

// ─────────────────────────────────────────────
// The Stoa — Showcase State
// ─────────────────────────────────────────────
// Demo/showcase-only store tracking which Stoa rewards have been restored.
// localStorage-backed under the shared "tome-showcase" namespace so the
// demo can reset cleanly. NO Supabase writes — the real unlock derivation
// (quiz_results.passed for the book, per docs/architecture/supabase-data-map.md)
// replaces this at integration time.
//
// Dependency-free (React useSyncExternalStore), same pattern as
// src/lib/reader/reader-prefs.ts: one module-level snapshot, a custom
// event for same-tab subscribers, the storage event for other tabs.

import { useCallback, useSyncExternalStore } from "react"
import { isStoaRewardId } from "./rewards"
import type { BookSlug } from "@/lib/books/types"

const STORAGE_KEY = "tome-showcase:stoa:v1"
const CHANGE_EVENT = "tome-showcase:stoa:change"

export interface StoaShowcaseState {
  /** Restored reward ids (world slugs), in restoration order. */
  restored: BookSlug[]
}

const EMPTY_STATE: StoaShowcaseState = { restored: [] }

// ── Snapshot (module-level, mutable) ─────────

let snapshot: StoaShowcaseState = EMPTY_STATE
let hydrated = false

function coerce(raw: unknown): StoaShowcaseState {
  if (!raw || typeof raw !== "object") return EMPTY_STATE
  const list = (raw as { restored?: unknown }).restored
  if (!Array.isArray(list)) return EMPTY_STATE
  const restored = list.filter(
    (v): v is BookSlug => typeof v === "string" && isStoaRewardId(v),
  )
  return { restored: [...new Set(restored)] }
}

function readStorage(): StoaShowcaseState {
  if (typeof window === "undefined") return EMPTY_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? coerce(JSON.parse(raw)) : EMPTY_STATE
  } catch {
    return EMPTY_STATE
  }
}

function writeStorage(next: StoaShowcaseState): void {
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

function getSnapshot(): StoaShowcaseState {
  ensureHydrated()
  return snapshot
}

function getServerSnapshot(): StoaShowcaseState {
  return EMPTY_STATE
}

/** Mark a reward as restored (showcase only — no Supabase write). */
export function restoreReward(id: BookSlug): void {
  ensureHydrated()
  if (snapshot.restored.includes(id)) return
  writeStorage({ restored: [...snapshot.restored, id] })
}

/** Clear all showcase restorations. */
export function resetStoa(): void {
  ensureHydrated()
  writeStorage(EMPTY_STATE)
}

export interface UseStoaStateResult extends StoaShowcaseState {
  restoredCount: number
  isRestored: (id: BookSlug) => boolean
  restore: typeof restoreReward
  reset: typeof resetStoa
}

/** Showcase-scoped restored-reward state. Re-renders on any change. */
export function useStoaState(): UseStoaStateResult {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isRestored = useCallback(
    (id: BookSlug) => state.restored.includes(id),
    [state.restored],
  )
  return {
    restored: state.restored,
    restoredCount: state.restored.length,
    isRestored,
    restore: restoreReward,
    reset: resetStoa,
  }
}
