/**
 * Demo data — curated, deterministic slices drawn from the REAL catalog so the
 * marketing demos never invent books, traditions, or difficulties.
 *
 * Library controls (R5) reuse the exact sort + difficulty vocabulary from
 * src/app/(app)/library/browse/page.tsx; the book rows are real `TomeBook`s
 * pulled by id from src/data/books.ts.
 */
import { getBook } from "@/lib/content"
import type { TomeBook } from "@/data/books"

// ── Canonical library controls (mirror library/browse/page.tsx) ──────────────

export const DEMO_LIBRARY_SORTS = [
  { label: "Title A\u2013Z", value: "title" },
  { label: "Chronological", value: "year" },
  { label: "Difficulty", value: "difficulty" },
  { label: "Shortest First", value: "shortest" },
  { label: "Most Popular", value: "popular" },
] as const

export type DemoLibrarySort = (typeof DEMO_LIBRARY_SORTS)[number]["value"]

/** book.difficulty domain — distinct from the quiz Apprentice/Scholar/Master. */
export const DEMO_DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Scholar",
] as const

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  scholar: 4,
}

// A recognizable, tradition-diverse slice of the real canon for the library
// demo. Ids resolve against src/data/books.ts; any that don't resolve are
// dropped so the demo can never crash on a renamed id.
const DEMO_BOOK_IDS = [
  "the-iliad",
  "pride-and-prejudice",
  "meditations",
  "the-republic",
  "crime-and-punishment",
  "hamlet",
  "the-odyssey",
  "frankenstein",
  "the-divine-comedy",
  "jane-eyre",
] as const

export const DEMO_LIBRARY_BOOKS: TomeBook[] = DEMO_BOOK_IDS.map((id) =>
  getBook(id),
).filter((b): b is TomeBook => Boolean(b))

/** Traditions actually present in the demo slice (for the filter chips). */
export const DEMO_TRADITIONS: string[] = [
  ...new Set(DEMO_LIBRARY_BOOKS.map((b) => b.tradition)),
].sort()

/** Pure filter+sort over the demo slice, mirroring the real browse logic. */
export function filterAndSortDemoBooks(opts: {
  traditions: Set<string>
  difficulties: Set<string>
  sort: DemoLibrarySort
}): TomeBook[] {
  let result = DEMO_LIBRARY_BOOKS
  if (opts.traditions.size > 0)
    result = result.filter((b) => opts.traditions.has(b.tradition))
  if (opts.difficulties.size > 0)
    result = result.filter((b) => opts.difficulties.has(b.difficulty))

  const sorted = [...result]
  switch (opts.sort) {
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "year":
      sorted.sort((a, b) => a.year - b.year)
      break
    case "difficulty":
      sorted.sort(
        (a, b) =>
          (DIFFICULTY_ORDER[a.difficulty.toLowerCase()] ?? 2) -
          (DIFFICULTY_ORDER[b.difficulty.toLowerCase()] ?? 2),
      )
      break
    case "shortest":
      sorted.sort((a, b) => a.wordCount - b.wordCount)
      break
    case "popular":
      sorted.sort(
        (a, b) => (b.trending?.readers ?? 0) - (a.trending?.readers ?? 0),
      )
      break
  }
  return sorted
}

// ── Reading-form samples (R1) — each grounded in a real StructuralUnitType ───

import type { StructuralUnitType } from "@/data/books"

export interface ReadingFormSample {
  /** Tab label shown to the visitor. */
  label: string
  /** The real structural-unit type this form maps to. */
  unitType: StructuralUnitType
  workTitle: string
  locator: string
  byline: string
}

/**
 * The four presentation forms the reader adapts to. `unitType` ties each to the
 * canonical StructuralUnitType enum (src/data/books.ts) so the demo's claim
 * ("shaped to the work") is grounded, not invented.
 */
export const READING_FORM_SAMPLES: ReadingFormSample[] = [
  {
    label: "Prose",
    unitType: "chapter",
    workTitle: "The Odyssey",
    locator: "Book I",
    byline: "Homer \u00b7 Robert Fagles, trans.",
  },
  {
    label: "Verse",
    unitType: "poem",
    workTitle: "Sonnet 18",
    locator: "Shakespeare",
    byline: "William Shakespeare \u00b7 1609",
  },
  {
    label: "Play",
    unitType: "act_scene",
    workTitle: "Hamlet",
    locator: "Act I, Scene iv",
    byline: "William Shakespeare \u00b7 c. 1600",
  },
  {
    label: "Middle English",
    unitType: "chapter",
    workTitle: "The Canterbury Tales",
    locator: "General Prologue",
    byline: "Geoffrey Chaucer \u00b7 c. 1387",
  },
]
