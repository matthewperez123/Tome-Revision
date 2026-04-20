/**
 * Aeneid Scholarly Apparatus — reader-facing API over the features
 * detected by `scripts/aeneid/detect-features.ts`.
 *
 * Loads `src/data/aeneid/apparatus.json` once (Next.js bundles the JSON
 * at build time) and exposes small typed accessors the reader can call
 * per book: first-occurrence epithet markers (pius Aeneas, infelix
 * Dido…), extended-simile line spans, and the six canonical Virgilian
 * authorial-apostrophe sites (tu Marcellus eris, fortunati ambo, the
 * Caieta invocation, the Lausus apostrophe, the two gates of sleep).
 *
 * Everything here is deterministic — no LLM calls, no Supabase
 * dependency. Scholarly commentary attached to epithets and apostrophes
 * lives in this file and ships in the client bundle.
 */

import apparatusJson from "@/data/aeneid/apparatus.json"

// ── Types (mirror the script's output schema) ────────────────────────────

export interface EpithetOccurrence {
  bookNumber: number
  lineNumber: number
  matchedText: string
  context: string
}

export interface EpithetEntry {
  id: string
  latin: string
  transliteration: string
  gloss: string
  subject: string
  drydenRenderings: string[]
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
}

export interface ApostropheSite {
  id: string
  bookNumber: number
  lineNumber: number
  anchorText: string
  title: string
  latinTag: string
  latinLine: string
  description: string
}

interface ApparatusShape {
  generatedAt: string
  generatedBy: string
  epithets: EpithetEntry[]
  similes: SimileEntry[]
  apostrophes: ApostropheSite[]
  counts: unknown
}

const APPARATUS = apparatusJson as unknown as ApparatusShape

// ── Epithet accessors ────────────────────────────────────────────────────

/** All Virgilian characterizing epithets, with their first-occurrence-per-book indices. */
export function getAeneidEpithets(): EpithetEntry[] {
  return APPARATUS.epithets
}

/**
 * First-occurrence markers for a given book. Reader overlays a small
 * Latin-tag marker on each returned line; subsequent occurrences go
 * unmarked — the first instance "teaches" the formula, later
 * repetitions reinforce by rhythm rather than by gloss (per the
 * Virgilian / Homeric formulaic system).
 */
export function getAeneidEpithetMarkersForBook(
  bookNumber: number,
): Array<{ epithet: EpithetEntry; occurrence: EpithetOccurrence }> {
  const markers: Array<{ epithet: EpithetEntry; occurrence: EpithetOccurrence }> = []
  for (const epithet of APPARATUS.epithets) {
    const occ = epithet.firstByBook[String(bookNumber)]
    if (occ) markers.push({ epithet, occurrence: occ })
  }
  markers.sort((a, b) => a.occurrence.lineNumber - b.occurrence.lineNumber)
  return markers
}

// ── Simile accessors ─────────────────────────────────────────────────────

export function getAeneidSimiles(bookNumber?: number): SimileEntry[] {
  if (bookNumber == null) return APPARATUS.similes
  return APPARATUS.similes.filter((s) => s.bookNumber === bookNumber)
}

/** True if (book, line) sits inside a detected extended simile. */
export function isAeneidLineInsideSimile(
  bookNumber: number,
  lineNumber: number,
): SimileEntry | null {
  for (const s of APPARATUS.similes) {
    if (s.bookNumber !== bookNumber) continue
    if (lineNumber >= s.startLine && lineNumber <= s.endLine) return s
  }
  return null
}

// ── Apostrophe accessors ─────────────────────────────────────────────────

/**
 * All five canonical Virgilian apostrophe sites. The reader marks each
 * with a subtle V. monogram in the margin, signaling that the poet has
 * stepped forward from third-person narrative to address a character
 * directly — one of the Aeneid's formal signatures.
 */
export function getAeneidApostrophes(): ApostropheSite[] {
  return APPARATUS.apostrophes
}

export function getAeneidApostrophesForBook(bookNumber: number): ApostropheSite[] {
  return APPARATUS.apostrophes.filter((a) => a.bookNumber === bookNumber)
}

// ── Summary for audit / debug ────────────────────────────────────────────

export function getAeneidApparatusSummary() {
  return {
    generatedAt: APPARATUS.generatedAt,
    epithets: APPARATUS.epithets.length,
    similes: APPARATUS.similes.length,
    apostrophes: APPARATUS.apostrophes.length,
  }
}
