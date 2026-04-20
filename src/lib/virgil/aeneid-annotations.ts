// ── Aeneid Annotations ──
// Scholarly annotations for Virgil's Aeneid (John Dryden, 1697; Standard
// Ebooks edition, heroic couplets). Anchors are line-exact against the
// transformed HTML in `public/content/the-aeneid/ch-*.json`.
//
// Density target: 12–16 annotations per book (higher than Iliad/Odyssey,
// per the Aeneid ingestion spec — Virgil is more allusive and more
// politically specific, closer to Dante density).
//
// This file is merged into the global annotation list by the
// `getAllAnnotations()` accessor in `annotations.ts`.

import type { Annotation } from "./types"

import { AENEID_BOOK_1 } from "./aeneid/book-01"
import { AENEID_BOOK_2 } from "./aeneid/book-02"
import { AENEID_BOOK_3 } from "./aeneid/book-03"
import { AENEID_BOOK_4 } from "./aeneid/book-04"
import { AENEID_BOOK_5 } from "./aeneid/book-05"
import { AENEID_BOOK_6 } from "./aeneid/book-06"
import { AENEID_BOOK_7 } from "./aeneid/book-07"
import { AENEID_BOOK_8 } from "./aeneid/book-08"
import { AENEID_BOOK_9 } from "./aeneid/book-09"
import { AENEID_BOOK_10 } from "./aeneid/book-10"
import { AENEID_BOOK_11 } from "./aeneid/book-11"
import { AENEID_BOOK_12 } from "./aeneid/book-12"
import { AENEID_APOSTROPHE_ANNOTATIONS } from "./aeneid/apostrophe-annotations"

export const GENERATED_AENEID_ANNOTATIONS: Annotation[] = [
  ...AENEID_BOOK_1,
  ...AENEID_BOOK_2,
  ...AENEID_BOOK_3,
  ...AENEID_BOOK_4,
  ...AENEID_BOOK_5,
  ...AENEID_BOOK_6,
  ...AENEID_BOOK_7,
  ...AENEID_BOOK_8,
  ...AENEID_BOOK_9,
  ...AENEID_BOOK_10,
  ...AENEID_BOOK_11,
  ...AENEID_BOOK_12,
  // Synthetic cards for the canonical authorial apostrophes (tu
  // Marcellus eris, fortunati ambo, Caieta, Lausus, the gates of
  // sleep). The V. monogram markers in the reader resolve to these.
  ...AENEID_APOSTROPHE_ANNOTATIONS,
]
