// ── Iliad Annotations ──
// Hand-authored scholarly annotations for Homer's Iliad, using William
// Cullen Bryant's 1870 blank-verse translation (Standard Ebooks edition —
// the same translation that supplies the Odyssey anchors in this library,
// so character-color and Bryant name-conventions align across both epics).
//
// Coverage is deliberately flagship-first: Books I, VI, XVI, XXII, and
// XXIV — the five most-taught and most-echoed books in the tradition —
// get dedicated annotation modules. Books II–V, VII–XV, XVII–XXI, XXIII
// carry speaker-identification and gloss decoration via the general
// Iliad apparatus pass; deeper per-book annotations ship in a later
// iteration.
//
// Merged into the global annotation list by `getAllAnnotations()` in
// annotations.ts.

import type { Annotation } from "./types"

import { ILIAD_BOOK_1 } from "./iliad/book-01"
import { ILIAD_BOOK_6 } from "./iliad/book-06"
import { ILIAD_BOOK_16 } from "./iliad/book-16"
import { ILIAD_BOOK_22 } from "./iliad/book-22"
import { ILIAD_BOOK_24 } from "./iliad/book-24"

export const GENERATED_ILIAD_ANNOTATIONS: Annotation[] = [
  ...ILIAD_BOOK_1,
  ...ILIAD_BOOK_6,
  ...ILIAD_BOOK_16,
  ...ILIAD_BOOK_22,
  ...ILIAD_BOOK_24,
]
