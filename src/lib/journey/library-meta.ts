// ─────────────────────────────────────────────
// Journey Home — Library curation metadata
// ─────────────────────────────────────────────
// Browse/filter facets for the twelve featured registry books, used by the
// LibraryGrid embedded in /journey. The registry (src/lib/books/registry.ts)
// intentionally holds experience data, not catalog facets, so journey-level
// curation lives here. Facets are factual: tradition and era follow each
// book's canonical publication/origin; difficulty is Tome's reading-level
// curation for the guided journey. Reading minutes are shown only where a
// real content build reports them (Macbeth meta.json: 91 minutes).

import type { BookSlug } from "@/lib/books/types"

export type Tradition = "Greek" | "Roman" | "Italian" | "British" | "American"

export type Era =
  | "Classical antiquity"
  | "Medieval"
  | "Early modern"
  | "19th century"

export type Difficulty = "Gentle" | "Moderate" | "Demanding"

export interface LibraryMetaEntry {
  slug: BookSlug
  tradition: Tradition
  era: Era
  difficulty: Difficulty
}

export const LIBRARY_META: Record<BookSlug, LibraryMetaEntry> = {
  macbeth: {
    slug: "macbeth",
    tradition: "British",
    era: "Early modern",
    difficulty: "Moderate",
  },
  "moby-dick": {
    slug: "moby-dick",
    tradition: "American",
    era: "19th century",
    difficulty: "Demanding",
  },
  alice: {
    slug: "alice",
    tradition: "British",
    era: "19th century",
    difficulty: "Gentle",
  },
  "paradise-lost": {
    slug: "paradise-lost",
    tradition: "British",
    era: "Early modern",
    difficulty: "Demanding",
  },
  "divine-comedy": {
    slug: "divine-comedy",
    tradition: "Italian",
    era: "Medieval",
    difficulty: "Demanding",
  },
  iliad: {
    slug: "iliad",
    tradition: "Greek",
    era: "Classical antiquity",
    difficulty: "Moderate",
  },
  odyssey: {
    slug: "odyssey",
    tradition: "Greek",
    era: "Classical antiquity",
    difficulty: "Moderate",
  },
  frankenstein: {
    slug: "frankenstein",
    tradition: "British",
    era: "19th century",
    difficulty: "Moderate",
  },
  "pride-prejudice": {
    slug: "pride-prejudice",
    tradition: "British",
    era: "19th century",
    difficulty: "Gentle",
  },
  "jane-eyre": {
    slug: "jane-eyre",
    tradition: "British",
    era: "19th century",
    difficulty: "Moderate",
  },
  meditations: {
    slug: "meditations",
    tradition: "Roman",
    era: "Classical antiquity",
    difficulty: "Gentle",
  },
  republic: {
    slug: "republic",
    tradition: "Greek",
    era: "Classical antiquity",
    difficulty: "Demanding",
  },
}

/** Ordered facet options, derived from the curation table. */
export const TRADITIONS: readonly Tradition[] = [
  "Greek",
  "Roman",
  "Italian",
  "British",
  "American",
]

export const ERAS: readonly Era[] = [
  "Classical antiquity",
  "Medieval",
  "Early modern",
  "19th century",
]

export const DIFFICULTIES: readonly Difficulty[] = [
  "Gentle",
  "Moderate",
  "Demanding",
]
