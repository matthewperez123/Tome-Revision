/**
 * Chapter-metadata dispatcher for the Decameron.
 *
 * The reader knows each chapter only by a flat 0..122 index. This module
 * translates that index into a structural descriptor — which the reader
 * enhancements component then uses to decide chapter-header chrome,
 * visual register (standard tale vs author-intervention vs frame vs
 * plague-introduction), narrator attribution, and the narrator tracker's
 * current state.
 *
 * Five kinds of chapter:
 *
 *   "proem"              — ch-0. Boccaccio's opening address to women in love.
 *   "plague-intro"       — ch-2. Day I Introduction: the plague of 1348 and
 *                          the brigata's formation. Visually distinct —
 *                          muted palette, eyewitness-account framing.
 *   "day-stub"           — ch-1, 13, 25, ... The three-word title cards.
 *                          Skippable in the reader; kept for structure.
 *   "day-intro"          — ch-14, 26, 38, 50, 62, 74, 86, 98, 110. The
 *                          frame passages opening each day (governor
 *                          election, theme, setting).
 *   "author-intervention" — ch-38. Day IV's "introduction" is really
 *                          Boccaccio's long self-defense against critics.
 *                          Visually distinct — amber register, "B." glyph.
 *   "tale"               — the 100 tales. Rendered with the narrator's
 *                          signature color in the header.
 *   "author-conclusion"  — ch-121. Boccaccio's closing self-defense.
 *   "glossary"           — ch-122. Standard Ebooks glossary page.
 */

import type { BrigataId } from "./brigata"
import { AUTHOR_VOICE_ID, type VoiceId } from "./brigata"
import { DAYS, dayForChapter } from "./days"
import { getTaleByFlat, type Tale } from "./tales"

export type ChapterKind =
  | "proem"
  | "plague-intro"
  | "day-stub"
  | "day-intro"
  | "author-intervention"
  | "tale"
  | "author-conclusion"
  | "glossary"

export interface ChapterMetadata {
  flatChapter: number
  kind: ChapterKind
  /** Day number 1–10 if the chapter is part of a day, else null. */
  day: number | null
  /** Tale number 1–10 if the chapter is a tale, else null. */
  tale: number | null
  /** Narrator (or Boccaccio-as-author for Proem / IV Intro / Conclusion). */
  voice: VoiceId | null
  /** The Tale record if kind === "tale", else null. */
  taleRecord: Tale | null
  /** One-line editorial label used in the header card (e.g. "Day III, Tale V — Elissa"). */
  displayLabel: string
  /** Optional editorial subtitle: the tale's rubric-subtitle, or the day intro's mood, etc. */
  displaySubtitle: string | null
}

const DAY_STUB_CHAPTERS = new Set(DAYS.map((d) => d.dayStubChapter))
const DAY_INTRO_CHAPTERS = new Map(DAYS.map((d) => [d.introChapter, d] as const))

// Day IV's "introduction" IS the Author Intervention, per PART 8 of the
// ingestion spec. It is the single most famous digression in the work.
const AUTHOR_INTERVENTION_CHAPTER = 38

const TOTAL_CHAPTERS = 123 // Proem + 10×(stub+intro) + 100 tales + Conclusion + Glossary

export function getChapterMetadata(flatChapter: number): ChapterMetadata {
  // Proem ───────────────────────────────────────────
  if (flatChapter === 0) {
    return {
      flatChapter,
      kind: "proem",
      day: null,
      tale: null,
      voice: AUTHOR_VOICE_ID,
      taleRecord: null,
      displayLabel: "Proem",
      displaySubtitle: "Boccaccio's dedication to ladies in love.",
    }
  }

  // Plague Introduction ──────────────────────────────
  if (flatChapter === 2) {
    return {
      flatChapter,
      kind: "plague-intro",
      day: 1,
      tale: null,
      voice: AUTHOR_VOICE_ID,
      taleRecord: null,
      displayLabel: "The Plague of 1348",
      displaySubtitle: "Boccaccio's eyewitness account of the Black Death in Florence, and the gathering of the brigata at Santa Maria Novella.",
    }
  }

  // Day-stub title cards ─────────────────────────────
  if (DAY_STUB_CHAPTERS.has(flatChapter)) {
    const d = DAYS.find((day) => day.dayStubChapter === flatChapter)!
    return {
      flatChapter,
      kind: "day-stub",
      day: d.day,
      tale: null,
      voice: null,
      taleRecord: null,
      displayLabel: `Day ${toRoman(d.day)}`,
      displaySubtitle: null,
    }
  }

  // Day IV Introduction — Author Intervention ────────
  if (flatChapter === AUTHOR_INTERVENTION_CHAPTER) {
    return {
      flatChapter,
      kind: "author-intervention",
      day: 4,
      tale: null,
      voice: AUTHOR_VOICE_ID,
      taleRecord: null,
      displayLabel: "Day IV — Introduction",
      displaySubtitle: "Boccaccio breaks the frame to defend his work against its critics. One of the founding documents of the Renaissance defense of secular letters.",
    }
  }

  // Other day introductions ──────────────────────────
  if (DAY_INTRO_CHAPTERS.has(flatChapter)) {
    const d = DAY_INTRO_CHAPTERS.get(flatChapter)!
    return {
      flatChapter,
      kind: "day-intro",
      day: d.day,
      tale: null,
      voice: null, // frame narration, not attributed to any single voice
      taleRecord: null,
      displayLabel: `Day ${toRoman(d.day)} — Introduction`,
      displaySubtitle: d.moodEpigraph,
    }
  }

  // Tales ────────────────────────────────────────────
  const tale = getTaleByFlat(flatChapter)
  if (tale) {
    return {
      flatChapter,
      kind: "tale",
      day: tale.day,
      tale: tale.tale,
      voice: tale.narrator,
      taleRecord: tale,
      displayLabel: `Day ${toRoman(tale.day)}, Tale ${toRoman(tale.tale)}`,
      displaySubtitle: tale.rubricSubtitle,
    }
  }

  // Author's Conclusion ──────────────────────────────
  if (flatChapter === 121) {
    return {
      flatChapter,
      kind: "author-conclusion",
      day: null,
      tale: null,
      voice: AUTHOR_VOICE_ID,
      taleRecord: null,
      displayLabel: "Conclusion of the Author",
      displaySubtitle: "Boccaccio's second and final self-defense of the work.",
    }
  }

  // Glossary ─────────────────────────────────────────
  if (flatChapter === 122) {
    return {
      flatChapter,
      kind: "glossary",
      day: null,
      tale: null,
      voice: null,
      taleRecord: null,
      displayLabel: "Glossary",
      displaySubtitle: "Standard Ebooks' glossary of names and terms for this edition.",
    }
  }

  // Fallback (out of range) ──────────────────────────
  return {
    flatChapter,
    kind: "tale",
    day: dayForChapter(flatChapter)?.day ?? null,
    tale: null,
    voice: null,
    taleRecord: null,
    displayLabel: `Chapter ${flatChapter}`,
    displaySubtitle: null,
  }
}

// Small Roman-numeral helper for 1..10 (the Decameron never exceeds 10 in
// any axis that uses Roman numerals — day or tale).
export function toRoman(n: number): string {
  const map: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X" }
  return map[n] ?? String(n)
}

/** True if the chapter has the "author intervention" visual register. */
export function isAuthorIntervention(flatChapter: number): boolean {
  return flatChapter === AUTHOR_INTERVENTION_CHAPTER
}

/** Used by the TOC to decide whether to list, fold, or suppress the
 * three-word day stubs. */
export function isDayStub(flatChapter: number): boolean {
  return DAY_STUB_CHAPTERS.has(flatChapter)
}

export { TOTAL_CHAPTERS, AUTHOR_INTERVENTION_CHAPTER }
