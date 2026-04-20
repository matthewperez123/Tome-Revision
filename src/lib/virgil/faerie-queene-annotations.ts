// ── The Faerie Queene Annotations ────────────────────────────────────
// Scholarly annotations for Edmund Spenser's *The Faerie Queene* (Books
// I–III published 1590, IV–VI published 1596, the Mutabilitie Cantos
// published posthumously 1609). Standard Ebooks text — selectively
// modernized from the 1590 quarto; Spenser's deliberate archaisms
// (*whilom*, *eftsoones*, *ycladd*, etc.) preserved, merely accidental
// 16c spellings regularized.
//
// Density target per spec Part 4:
//   - Letter to Raleigh: substantial cluster (8 annotations ship here)
//   - Books I–II: 12–16 annotations per canto (demo-worthy)
//   - Books III–VI: 8–12 per canto
//   - Mutabilitie Cantos: 15–20 per canto
//   ≈ 800–1,000 annotations for the complete poem.
//
// Model allocation per spec:
//   - Opus: Letter to Raleigh; Book I canto i (opening); I.ix (Despair);
//           I.xii (Dragon-fight); II.vii (Cave of Mammon); II.xii (Bower
//           of Bliss); III.ii (Britomart's mirror vision); III.xii
//           (Busirane); VI.x (Mount Acidale); Mutabilitie canto vii
//           (trial on Arlo Hill). Ten Opus clusters total.
//   - Sonnet: all remaining cantos (~64 of 74).
//
// This first pass ships hand-authored Opus-grade annotations for the
// Letter to Raleigh only (8 annotations, including the load-bearing
// "dark conceit" orientation). The ten cantos marked Opus in the
// allocation table, plus all Sonnet cantos, ship in subsequent passes
// driven by scripts/faerie-queene/generate-annotations.ts (not yet
// written).
//
// Chapter-index convention (matches public/content/the-faerie-queene/):
//   ch-0  = Forward                           (no annotations)
//   ch-1  = Letter to Sir Walter Raleigh      (cluster present below)
//   ch-2  = Book I                            (Opus canto i pending)
//   ch-3  = Book II                           (Opus cantos vii, xii pending)
//   ch-4  = Book III                          (Opus cantos ii, xii pending)
//   ch-5  = Book IV                           (Sonnet pending)
//   ch-6  = Book V                            (Sonnet pending)
//   ch-7  = Book VI                           (Opus canto x pending)
//   ch-8  = Mutabilitie Cantos                (Opus canto vii pending)
//
// Once the Part 1 canto-split runs, chapter indices become canto-
// granular (~77 entries). This file's structure will mirror the shift —
// the current book-level arrays below become per-canto arrays imported
// from src/lib/virgil/faerie-queene/book-N-canto-NN.ts files.

import type { Annotation } from "./types"

import { FAERIE_QUEENE_LETTER_TO_RALEGH } from "./faerie-queene/letter-to-ralegh"
import { FAERIE_QUEENE_BOOK_1_CANTO_1 } from "./faerie-queene/book-1-canto-1"
import { FAERIE_QUEENE_BOOK_1_CANTO_9 } from "./faerie-queene/book-1-canto-9"
import { FAERIE_QUEENE_BOOK_1_CANTO_11 } from "./faerie-queene/book-1-canto-11"
import { FAERIE_QUEENE_BOOK_2_CANTO_7 } from "./faerie-queene/book-2-canto-7"
import { FAERIE_QUEENE_BOOK_2_CANTO_12 } from "./faerie-queene/book-2-canto-12"
import { FAERIE_QUEENE_BOOK_3_CANTO_2 } from "./faerie-queene/book-3-canto-2"
import { FAERIE_QUEENE_BOOK_3_CANTO_12 } from "./faerie-queene/book-3-canto-12"
import { FAERIE_QUEENE_BOOK_6_CANTO_10 } from "./faerie-queene/book-6-canto-10"
import { FAERIE_QUEENE_BOOK_7_CANTO_7 } from "./faerie-queene/book-7-canto-7"

// ── Stub arrays for the not-yet-authored canto clusters ──────────────
// Post-canto-split flat chapter layout (see scripts/faerie-queene/split-cantos.ts):
//   ch-0      Forward                       (no annotations planned)
//   ch-1      Letter to Sir Walter Raleigh  (8 annotations — shipped)
//   ch-2      Book I Canto I                (13 annotations — shipped, Opus)
//   ch-3..13  Book I Cantos II–XII          (pending — mix of Opus canto-ix/xii + Sonnet)
//   ch-14..25 Book II Cantos I–XII          (pending — Opus canto-vii/xii + Sonnet)
//   ch-26..37 Book III Cantos I–XII         (pending — Opus canto-ii/xii + Sonnet)
//   ch-38..49 Book IV Cantos I–XII          (pending — Sonnet)
//   ch-50..61 Book V Cantos I–XII           (pending — Sonnet)
//   ch-62..73 Book VI Cantos I–XII          (pending — Opus canto-x + Sonnet)
//   ch-74..75 Mutabilitie Cantos VI–VII     (pending — Opus canto-vii + Sonnet)
const EMPTY: Annotation[] = []

export const GENERATED_FAERIE_QUEENE_ANNOTATIONS: Annotation[] = [
  // Front matter
  ...FAERIE_QUEENE_LETTER_TO_RALEGH,     // ch-1  · 8  annotations
  // Book I
  ...FAERIE_QUEENE_BOOK_1_CANTO_1,       // ch-2  · 13 annotations (Opus — opening cluster)
  ...FAERIE_QUEENE_BOOK_1_CANTO_9,       // ch-10 · 13 annotations (Opus — Cave of Despair)
  ...FAERIE_QUEENE_BOOK_1_CANTO_11,      // ch-12 · 13 annotations (Opus — Dragon-fight)
  // Book II
  ...FAERIE_QUEENE_BOOK_2_CANTO_7,       // ch-20 · 13 annotations (Opus — Cave of Mammon)
  ...FAERIE_QUEENE_BOOK_2_CANTO_12,      // ch-25 · 13 annotations (Opus — Bower of Bliss)
  // Book III
  ...FAERIE_QUEENE_BOOK_3_CANTO_2,       // ch-27 · 12 annotations (Opus — Britomart's mirror)
  ...FAERIE_QUEENE_BOOK_3_CANTO_12,      // ch-37 · 13 annotations (Opus — House of Busirane)
  // Book VI
  ...FAERIE_QUEENE_BOOK_6_CANTO_10,      // ch-71 · 13 annotations (Opus — Mount Acidale)
  // Book VII (Mutabilitie Cantos)
  ...FAERIE_QUEENE_BOOK_7_CANTO_7,       // ch-75 · 13 annotations (Opus — Arlo Hill / Canto VIII Unperfite)
  // Remaining cantos — each EMPTY slot becomes an import when that
  // canto's annotations land in its per-canto file.
  ...EMPTY,
]
