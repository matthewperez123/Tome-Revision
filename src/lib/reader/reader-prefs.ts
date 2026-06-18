"use client"

/**
 * Reader preferences — a small global store mirrored to localStorage.
 *
 * Dependency-free (React `useSyncExternalStore`) so it loads instantly for
 * logged-out users and survives navigation. A separate sync layer
 * (`reader-sync.ts`) debounce-upserts these to Supabase for logged-in users
 * so settings follow the account.
 */

import { useSyncExternalStore } from "react"

export type ReaderMode = "scroll" | "single" | "spread"
// Two and only two reading color modes. Day is the original paper/light
// appearance (was "parchment"); night is the established dark reading surface.
export type ReaderSurfaceTheme = "day" | "night"
export type ReaderTurnStyle = "slide" | "fade" | "none"

export interface ReaderPrefs {
  mode: ReaderMode
  theme: ReaderSurfaceTheme
  fontSizePx: number // 14..26
  lineHeight: number // 1.4..2.2
  measureCh: number // 56..82 (line length)
  justify: boolean
  turnStyle: ReaderTurnStyle
  a11yFace: boolean // accessibility reading face (sans) instead of Literata
  showFrontMatter: boolean // include imprint/colophon/etc. in the reading flow
}

export const READER_PREFS_DEFAULTS: ReaderPrefs = {
  mode: "scroll",
  theme: "day",
  fontSizePx: 19,
  lineHeight: 1.8,
  measureCh: 68,
  justify: false,
  turnStyle: "slide",
  a11yFace: false,
  showFrontMatter: false,
}

export const FONT_SIZE_RANGE = { min: 14, max: 26, step: 1 } as const
export const LINE_HEIGHT_RANGE = { min: 1.4, max: 2.2, step: 0.1 } as const
export const MEASURE_RANGE = { min: 56, max: 82, step: 2 } as const

const STORAGE_KEY = "tome-reader-prefs"

// Themes that pair with the global dark chrome (next-themes "dark").
export const DARK_SURFACE_THEMES: ReadonlySet<ReaderSurfaceTheme> = new Set<ReaderSurfaceTheme>([
  "night",
])

// Migrate legacy persisted theme values (parchment/sepia/dark/night) to the
// two-mode day/night system so existing readers don't reset to default.
function coerceTheme(raw: unknown): ReaderSurfaceTheme {
  if (raw === "day" || raw === "night") return raw
  if (raw === "dark") return "night" // legacy dark surface → night
  // "parchment", "sepia", anything else → day
  return "day"
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

/** Coerce arbitrary parsed JSON into a valid ReaderPrefs, dropping junk. */
function coerce(raw: unknown): ReaderPrefs {
  const p = (raw && typeof raw === "object" ? raw : {}) as Partial<ReaderPrefs>
  const mode: ReaderMode =
    p.mode === "single" || p.mode === "spread" || p.mode === "scroll" ? p.mode : READER_PREFS_DEFAULTS.mode
  const theme: ReaderSurfaceTheme = coerceTheme(p.theme)
  const turnStyle: ReaderTurnStyle =
    p.turnStyle === "fade" || p.turnStyle === "none" || p.turnStyle === "slide"
      ? p.turnStyle
      : READER_PREFS_DEFAULTS.turnStyle
  return {
    mode,
    theme,
    turnStyle,
    fontSizePx: clamp(
      typeof p.fontSizePx === "number" ? p.fontSizePx : READER_PREFS_DEFAULTS.fontSizePx,
      FONT_SIZE_RANGE.min,
      FONT_SIZE_RANGE.max
    ),
    lineHeight: clamp(
      typeof p.lineHeight === "number" ? p.lineHeight : READER_PREFS_DEFAULTS.lineHeight,
      LINE_HEIGHT_RANGE.min,
      LINE_HEIGHT_RANGE.max
    ),
    measureCh: clamp(
      typeof p.measureCh === "number" ? p.measureCh : READER_PREFS_DEFAULTS.measureCh,
      MEASURE_RANGE.min,
      MEASURE_RANGE.max
    ),
    justify: typeof p.justify === "boolean" ? p.justify : READER_PREFS_DEFAULTS.justify,
    a11yFace: typeof p.a11yFace === "boolean" ? p.a11yFace : READER_PREFS_DEFAULTS.a11yFace,
    showFrontMatter:
      typeof p.showFrontMatter === "boolean" ? p.showFrontMatter : READER_PREFS_DEFAULTS.showFrontMatter,
  }
}

// ── Store internals ──────────────────────────────────────────────────────────

let state: ReaderPrefs = READER_PREFS_DEFAULTS
let hydrated = false
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return
  hydrated = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) state = coerce(JSON.parse(raw))
  } catch {
    /* keep defaults */
  }
}

function persist() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota / private mode — non-fatal */
  }
}

function subscribe(listener: () => void): () => void {
  hydrate()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): ReaderPrefs {
  hydrate()
  return state
}

function getServerSnapshot(): ReaderPrefs {
  return READER_PREFS_DEFAULTS
}

// ── Public API ───────────────────────────────────────────────────────────────

export function getReaderPrefs(): ReaderPrefs {
  hydrate()
  return state
}

/** Patch one or more preferences; persists to localStorage and notifies. */
export function setReaderPrefs(patch: Partial<ReaderPrefs>): void {
  hydrate()
  const next = coerce({ ...state, ...patch })
  // Reference-equality short-circuit to avoid redundant renders/persist.
  if (
    next.mode === state.mode &&
    next.theme === state.theme &&
    next.fontSizePx === state.fontSizePx &&
    next.lineHeight === state.lineHeight &&
    next.measureCh === state.measureCh &&
    next.justify === state.justify &&
    next.turnStyle === state.turnStyle &&
    next.a11yFace === state.a11yFace &&
    next.showFrontMatter === state.showFrontMatter
  ) {
    return
  }
  state = next
  persist()
  emit()
}

/**
 * Replace prefs from a remote (Supabase) source without re-persisting back to
 * the network. Used by the sync layer on initial account load.
 */
export function applyRemoteReaderPrefs(remote: Partial<ReaderPrefs>): void {
  hydrate()
  state = coerce({ ...state, ...remote })
  persist()
  emit()
}

export function useReaderPrefs(): ReaderPrefs {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Subscribe to any prefs change (same tab). Returns an unsubscribe fn. */
export function subscribeReaderPrefs(listener: () => void): () => void {
  return subscribe(listener)
}
