// ── Idylls of the King Annotations ──────────────────────────────────
// Scholarly annotations for Tennyson's Idylls of the King (1891
// Macmillan collected edition, 12 idylls + Dedication + "To the
// Queen," Standard Ebooks). Anchors are line-exact against the
// transformed HTML in `public/content/idylls-of-the-king/ch-*.json`
// after scripts/idylls/transform-book.ts (data-iotk-line="N").
//
// Density per spec Part 4: 10–14 annotations per idyll. Opus-
// allocated clusters (Dedication, Coming of Arthur, Lancelot and
// Elaine, Holy Grail, Guinevere, Passing of Arthur, To the Queen)
// carry the demo-weight annotations; Sonnet-allocated clusters
// (Gareth, Marriage of Geraint, Geraint and Enid, Balin and Balan,
// Merlin and Vivien, Pelleas and Ettarre, Last Tournament) carry
// ten each.
//
// Categories (spec Part 4):
//   1. The Dedication and "To the Queen" — authorial frame
//   2. Malory-source framing orientation (in Coming of Arthur)
//   3. The moral-allegorical argument, named honestly
//   4. Victorian context (surfaced also via the enhancement chrome)
//   5. Literary inheritance backward (Malory, Spenser, Milton,
//      classical epic)
//   6. Literary inheritance forward (Eliot, Pre-Raphaelites)
//   7–17. Per-idyll specifics
//
// This file is merged into the global annotation list by the
// `getAnnotationsForChapter()` accessor in `annotations.ts`.

import type { Annotation } from "./types"

import { IOTK_DEDICATION } from "./idylls-of-the-king/dedication"
import { IOTK_COMING_OF_ARTHUR } from "./idylls-of-the-king/coming-of-arthur"
import { IOTK_LANCELOT_AND_ELAINE } from "./idylls-of-the-king/lancelot-and-elaine"
import { IOTK_HOLY_GRAIL } from "./idylls-of-the-king/holy-grail"
import { IOTK_GUINEVERE } from "./idylls-of-the-king/guinevere"
import { IOTK_PASSING_OF_ARTHUR } from "./idylls-of-the-king/passing-of-arthur"
import { IOTK_TO_THE_QUEEN } from "./idylls-of-the-king/to-the-queen"
import { IOTK_GARETH_AND_LYNETTE } from "./idylls-of-the-king/gareth-and-lynette"
import { IOTK_MARRIAGE_OF_GERAINT } from "./idylls-of-the-king/marriage-of-geraint"
import { IOTK_GERAINT_AND_ENID } from "./idylls-of-the-king/geraint-and-enid"
import { IOTK_BALIN_AND_BALAN } from "./idylls-of-the-king/balin-and-balan"
import { IOTK_MERLIN_AND_VIVIEN } from "./idylls-of-the-king/merlin-and-vivien"
import { IOTK_PELLEAS_AND_ETTARRE } from "./idylls-of-the-king/pelleas-and-ettarre"
import { IOTK_LAST_TOURNAMENT } from "./idylls-of-the-king/last-tournament"

export const GENERATED_IDYLLS_OF_THE_KING_ANNOTATIONS: Annotation[] = [
  // Opus clusters (framing + demo-worthy + moral-climax):
  ...IOTK_DEDICATION,
  ...IOTK_COMING_OF_ARTHUR,
  ...IOTK_LANCELOT_AND_ELAINE,
  ...IOTK_HOLY_GRAIL,
  ...IOTK_GUINEVERE,
  ...IOTK_PASSING_OF_ARTHUR,
  ...IOTK_TO_THE_QUEEN,
  // Sonnet clusters (the remaining seven idylls):
  ...IOTK_GARETH_AND_LYNETTE,
  ...IOTK_MARRIAGE_OF_GERAINT,
  ...IOTK_GERAINT_AND_ENID,
  ...IOTK_BALIN_AND_BALAN,
  ...IOTK_MERLIN_AND_VIVIEN,
  ...IOTK_PELLEAS_AND_ETTARRE,
  ...IOTK_LAST_TOURNAMENT,
]
