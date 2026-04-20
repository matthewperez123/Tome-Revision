// ── Paradise Lost Annotations ──
// Scholarly annotations for Milton's Paradise Lost (1674 second edition,
// twelve books, Standard Ebooks). Anchors are line-exact against the
// transformed HTML in `public/content/paradise-lost/ch-*.json`.
//
// Density per spec Part 4: Books I, II, IV, IX, XII (Opus) carry 15–18
// annotations each — the highest density in the Tome catalog. Books III,
// V, VI, VII, VIII, X, XI (Sonnet in the original spec, hand-authored
// here at Milton-scholarship density) carry 10–13 each.
//
// Categories covered: invocations, similes, syntactic annotations,
// biblical allusions, classical allusions, Dante allusions, theological
// annotations, Satan's rhetoric, Eve passages, felix culpa, the ending,
// Galileo.
//
// This file is merged into the global annotation list by the
// `getAnnotationsForChapter()` accessor in `annotations.ts`.

import type { Annotation } from "./types"

import { PARADISE_LOST_BOOK_1 } from "./paradise-lost/book-01"
import { PARADISE_LOST_BOOK_2 } from "./paradise-lost/book-02"
import { PARADISE_LOST_BOOK_3 } from "./paradise-lost/book-03"
import { PARADISE_LOST_BOOK_4 } from "./paradise-lost/book-04"
import { PARADISE_LOST_BOOK_5 } from "./paradise-lost/book-05"
import { PARADISE_LOST_BOOK_6 } from "./paradise-lost/book-06"
import { PARADISE_LOST_BOOK_7 } from "./paradise-lost/book-07"
import { PARADISE_LOST_BOOK_8 } from "./paradise-lost/book-08"
import { PARADISE_LOST_BOOK_9 } from "./paradise-lost/book-09"
import { PARADISE_LOST_BOOK_10 } from "./paradise-lost/book-10"
import { PARADISE_LOST_BOOK_11 } from "./paradise-lost/book-11"
import { PARADISE_LOST_BOOK_12 } from "./paradise-lost/book-12"

export const GENERATED_PARADISE_LOST_ANNOTATIONS: Annotation[] = [
  ...PARADISE_LOST_BOOK_1,
  ...PARADISE_LOST_BOOK_2,
  ...PARADISE_LOST_BOOK_3,
  ...PARADISE_LOST_BOOK_4,
  ...PARADISE_LOST_BOOK_5,
  ...PARADISE_LOST_BOOK_6,
  ...PARADISE_LOST_BOOK_7,
  ...PARADISE_LOST_BOOK_8,
  ...PARADISE_LOST_BOOK_9,
  ...PARADISE_LOST_BOOK_10,
  ...PARADISE_LOST_BOOK_11,
  ...PARADISE_LOST_BOOK_12,
]
