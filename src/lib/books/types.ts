// ─────────────────────────────────────────────
// Tome Book Experience Engine — Types
// ─────────────────────────────────────────────
// Config-driven typing for the featured-book experience registry
// (MASTER_EXECUTION_PLAN §10). Book-specific conditionals should live
// here, not scattered across components.

// ── Featured books ───────────────────────────

/** The twelve featured book-world slugs. These match the Living Archive
 * palette-slot names exactly (world slots, not canonical catalog IDs). */
export type BookSlug =
  | "macbeth"
  | "moby-dick"
  | "alice"
  | "paradise-lost"
  | "divine-comedy"
  | "iliad"
  | "odyssey"
  | "frankenstein"
  | "pride-prejudice"
  | "jane-eyre"
  | "meditations"
  | "republic"

/** Living Archive book-world palette slot names (plan §7 semantic tokens).
 * Kept 1:1 with BookSlug for the featured set. */
export type PaletteSlot = BookSlug

// ── Cover archetypes (plan §10) ──────────────

export type CoverArchetype =
  | "emblem-relic"
  | "horizon-negative-space"
  | "constellation-cabinet"
  | "threshold-portal"
  | "ascent-journey"
  | "map-voyage"
  | "fragment-evidence"
  | "experiment-spark"
  | "social-geometry-letter"
  | "window-ember"
  | "quiet-symbol-tablet"
  | "cave-city-light"

// ── Provenance (plan §10 — never blur these) ──

export type CoverProvenance =
  | "public-domain-source"
  | "tome-generated"
  | "procedural-fallback"
  | "stoa-reward"

// ── Palette ──────────────────────────────────

/** Per-book Living Archive palette. Hex values are mirrored by the vector
 * cover generator (scripts/covers/tome-vector-covers.mjs) so art and UI
 * chrome stay coherent. */
export interface BookPalette {
  /** Matte ground of the cover / book world. */
  ground: string
  /** Deepest tone — silhouettes, night sky, ink. */
  ink: string
  /** Dominant midtone of the world. */
  primary: string
  /** Bright counter-note (controlled vibrancy). */
  accent: string
  /** Lantern-gold accent used for hairline frames and highlights. */
  gold: string
}

// ── Experience entry ─────────────────────────

/** Asset paths for the Tome-generated vector cover set
 * (public/covers/tome-generated/). */
export interface BookCoverAssets {
  svg: string
  webp: string
  png: string
}

export interface BookExperience {
  /** Living Archive world slug, e.g. "alice". */
  slug: BookSlug
  /** Canonical catalog book ID from data_canon_books.json / books.id,
   * e.g. "alices-adventures-in-wonderland". */
  bookId: string
  title: string
  author: string
  /** Living Archive palette slot name (matches `slug` for featured books). */
  paletteSlot: PaletteSlot
  palette: BookPalette
  /** Short hand-crafted symbol vocabulary for the world, e.g. "crown, dagger, storm". */
  motif: string
  coverArchetype: CoverArchetype
  /** Prose description of the animated portal scene entered from the cover. */
  portalScene: string
  /** Visual style of the chapter map / journey path. */
  mapPathStyle: string
  /** Virgil book-world costume variant key (plan §8 book-world variants). */
  virgilVariantKey: string
  /** Ambient motion loop key for the book world (reduced-motion aware). */
  ambientMotionKey: string
  /** How chapter nodes appear on the map/path. */
  chapterNodeAppearance: string
  /** What this book's Trials emphasize pedagogically. */
  trialEmphasis: string
  /** Name of the Seal medallion earned on mastery. */
  sealName: string
  /** Description of the Stoa reward (stoa_paintings row, 1:1 with the book;
   * unlock derived from quiz_results.passed for the book). */
  stoaReward: string
  /** Hero copy shown on the book portal / showcase. */
  heroCopy: string
  /** Whether the 14-day guided journey is configured for this book. */
  fourteenDayJourney: boolean
  /** Journey length in days (14 for the flagship journey). */
  journeyLengthDays: number
  /** Sound accent key for the world's audio layer. */
  soundAccent: string
  /** Accessibility alt text for the generated cover art. */
  altText: string
  /** Cover art provenance class — all featured covers are Tome-generated. */
  provenance: CoverProvenance
  /** Human-readable provenance note (tool, pipeline, licensing). */
  provenanceNote: string
  /** Paths to the generated cover assets. */
  coverAssets: BookCoverAssets
}
