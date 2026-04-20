/**
 * Odyssey Scholarly Apparatus — reader-facing API over the features
 * detected by `scripts/odyssey/detect-features.ts`.
 *
 * Loads `src/data/odyssey/apparatus.json` once (Next.js bundles the JSON
 * at build time) and exposes small typed accessors the reader can call
 * per chapter: first-occurrence epithet markers, extended-simile line
 * spans, and recognition-scene anchors.
 *
 * Everything here is deterministic — no LLM calls, no Supabase dependency.
 * The scholarly commentary attached to epithets lives in this file and
 * ships in the client bundle.
 */

import apparatusJson from "@/data/odyssey/apparatus.json"

// ── Types (mirror the script's output schema) ────────────────────────────

export interface EpithetOccurrence {
  bookNumber: number
  lineNumber: number
  matchedText: string
  context: string
}

export interface EpithetEntry {
  id: string
  greek: string
  transliteration: string
  gloss: string
  subject: string
  bryantRenderings: string[]
  /** First-occurrence-per-book; keys are book numbers as strings. */
  firstByBook: Record<string, EpithetOccurrence>
  totalCount: number
}

export interface SimileEntry {
  bookNumber: number
  startLine: number
  endLine: number
  opener: string
  resolver: string | null
  preview: string
  tenor: string | null
}

export interface RecognitionScene {
  bookNumber: number
  anchor: {
    lineNumber: number
    anchorText: string
  }
  title: string
  description: string
}

interface ApparatusShape {
  generatedAt: string
  generatedBy: string
  epithets: EpithetEntry[]
  similes: SimileEntry[]
  recognitionScenes: RecognitionScene[]
  counts: unknown
}

const APPARATUS = apparatusJson as unknown as ApparatusShape

// ── Epithet accessors ────────────────────────────────────────────────────

/**
 * All six key Homeric epithets, with their first-occurrence-per-book
 * indices. Stable shape; safe to render directly.
 */
export function getOdysseyEpithets(): EpithetEntry[] {
  return APPARATUS.epithets
}

/**
 * First-occurrence markers for a given book number. Reader overlays a
 * superscript glyph on each returned line; subsequent occurrences are
 * unmarked (per the oral-formulaic design — the first instance "teaches"
 * the epithet; later repetitions reinforce by rhythm, not by gloss).
 */
export function getEpithetMarkersForBook(
  bookNumber: number,
): Array<{
  epithet: EpithetEntry
  occurrence: EpithetOccurrence
}> {
  const markers: Array<{ epithet: EpithetEntry; occurrence: EpithetOccurrence }> = []
  for (const epithet of APPARATUS.epithets) {
    const occ = epithet.firstByBook[String(bookNumber)]
    if (occ) markers.push({ epithet, occurrence: occ })
  }
  // Order by line number within the book so the first epithet in the book
  // is the first one the reader sees.
  markers.sort((a, b) => a.occurrence.lineNumber - b.occurrence.lineNumber)
  return markers
}

// ── Simile accessors ─────────────────────────────────────────────────────

export function getOdysseySimiles(bookNumber?: number): SimileEntry[] {
  if (bookNumber == null) return APPARATUS.similes
  return APPARATUS.similes.filter((s) => s.bookNumber === bookNumber)
}

/**
 * Returns true if a given line (by book + line number) is inside a
 * detected extended simile. The reader uses this to color the simile
 * span with a subtle italicized background without a dedicated
 * annotation per simile.
 */
export function isLineInsideSimile(bookNumber: number, lineNumber: number): SimileEntry | null {
  for (const s of APPARATUS.similes) {
    if (s.bookNumber !== bookNumber) continue
    if (lineNumber >= s.startLine && lineNumber <= s.endLine) return s
  }
  return null
}

// ── Recognition accessors ────────────────────────────────────────────────

export function getRecognitionScenes(): RecognitionScene[] {
  return APPARATUS.recognitionScenes
}

export function getRecognitionSceneForBook(bookNumber: number): RecognitionScene | null {
  return APPARATUS.recognitionScenes.find((r) => r.bookNumber === bookNumber) ?? null
}

// ── Summary for audit / debug ────────────────────────────────────────────

export function summarizeApparatus() {
  return {
    generatedAt: APPARATUS.generatedAt,
    epithetsTracked: APPARATUS.epithets.length,
    totalEpithetOccurrences: APPARATUS.epithets.reduce((s, e) => s + e.totalCount, 0),
    extendedSimiles: APPARATUS.similes.length,
    recognitionScenes: APPARATUS.recognitionScenes.length,
    booksCoveredByEpithet: Object.fromEntries(
      APPARATUS.epithets.map((e) => [e.transliteration, Object.keys(e.firstByBook).length]),
    ),
  }
}
