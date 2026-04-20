// ── Orlando Furioso Annotations ──
// Scholarly annotations for Ariosto's Orlando Furioso (1516/1521/1532 —
// final expanded edition, 46 cantos in ottava rima). Standard Ebooks
// text: William Stewart Rose, 1823–31, eight-volume Murray verse
// translation — the only complete public-domain English Orlando Furioso.
// See canto-01.ts for the per-canto headnote explaining Rose's virtues
// and limits.
//
// Density per spec Part 4: 10–14 annotations per canto — slightly lower
// than Paradise Lost and Don Juan because Orlando Furioso is longer (46
// cantos vs. 12 or 17) and much of its content is narrative pleasure
// rather than scholarly puzzle. Annotations concentrate on the allegorical,
// intertextual, politically specific, or formally load-bearing moments.
//
// Model allocation:
//   - Opus (hand-authored in this pass): Canto I, VI–VIII, XXIII–XXIV,
//     XXXIII–XXXV, XLVI. Demo-critical clusters.
//   - Sonnet (second pass): the other 36 cantos.
//
// This first pass ships hand-authored Opus-grade annotations for Canto I
// only (12 annotations, including the load-bearing Boiardo orientation).
// Cantos II–XLVI carry empty arrays that will be populated in subsequent
// passes.

import type { Annotation } from "./types"

import { ORLANDO_FURIOSO_CANTO_1 } from "./orlando-furioso/canto-01"
import { ORLANDO_FURIOSO_CANTO_6 } from "./orlando-furioso/canto-06"
import { ORLANDO_FURIOSO_CANTO_7 } from "./orlando-furioso/canto-07"
import { ORLANDO_FURIOSO_CANTO_23 } from "./orlando-furioso/canto-23"
import { ORLANDO_FURIOSO_CANTO_46 } from "./orlando-furioso/canto-46"

// ── Stub exports for the not-yet-authored cantos ─────────────────────
// Each authored canto has its own file (orlando-furioso/canto-NN.ts).
// Empty arrays below keep the registry's shape stable; authoring will
// replace each EMPTY with an import from the corresponding canto-NN.ts.
const EMPTY: Annotation[] = []
const ORLANDO_FURIOSO_CANTO_2:  Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_3:  Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_4:  Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_5:  Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_8:  Annotation[] = EMPTY   // Opus pass — Logistilla
const ORLANDO_FURIOSO_CANTO_9:  Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_10: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_11: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_12: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_13: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_14: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_15: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_16: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_17: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_18: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_19: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_20: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_21: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_22: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_24: Annotation[] = EMPTY   // Opus pass — rampage, Zerbino death
const ORLANDO_FURIOSO_CANTO_25: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_26: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_27: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_28: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_29: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_30: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_31: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_32: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_33: Annotation[] = EMPTY   // Opus pass — hippogriff to Ethiopia
const ORLANDO_FURIOSO_CANTO_34: Annotation[] = EMPTY   // Opus pass — hell-descent and ascent
const ORLANDO_FURIOSO_CANTO_35: Annotation[] = EMPTY   // Opus pass — moon, St John, catalogue
const ORLANDO_FURIOSO_CANTO_36: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_37: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_38: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_39: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_40: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_41: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_42: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_43: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_44: Annotation[] = EMPTY
const ORLANDO_FURIOSO_CANTO_45: Annotation[] = EMPTY

export const GENERATED_ORLANDO_FURIOSO_ANNOTATIONS: Annotation[] = [
  ...ORLANDO_FURIOSO_CANTO_1,
  ...ORLANDO_FURIOSO_CANTO_2,
  ...ORLANDO_FURIOSO_CANTO_3,
  ...ORLANDO_FURIOSO_CANTO_4,
  ...ORLANDO_FURIOSO_CANTO_5,
  ...ORLANDO_FURIOSO_CANTO_6,
  ...ORLANDO_FURIOSO_CANTO_7,
  ...ORLANDO_FURIOSO_CANTO_8,
  ...ORLANDO_FURIOSO_CANTO_9,
  ...ORLANDO_FURIOSO_CANTO_10,
  ...ORLANDO_FURIOSO_CANTO_11,
  ...ORLANDO_FURIOSO_CANTO_12,
  ...ORLANDO_FURIOSO_CANTO_13,
  ...ORLANDO_FURIOSO_CANTO_14,
  ...ORLANDO_FURIOSO_CANTO_15,
  ...ORLANDO_FURIOSO_CANTO_16,
  ...ORLANDO_FURIOSO_CANTO_17,
  ...ORLANDO_FURIOSO_CANTO_18,
  ...ORLANDO_FURIOSO_CANTO_19,
  ...ORLANDO_FURIOSO_CANTO_20,
  ...ORLANDO_FURIOSO_CANTO_21,
  ...ORLANDO_FURIOSO_CANTO_22,
  ...ORLANDO_FURIOSO_CANTO_23,
  ...ORLANDO_FURIOSO_CANTO_24,
  ...ORLANDO_FURIOSO_CANTO_25,
  ...ORLANDO_FURIOSO_CANTO_26,
  ...ORLANDO_FURIOSO_CANTO_27,
  ...ORLANDO_FURIOSO_CANTO_28,
  ...ORLANDO_FURIOSO_CANTO_29,
  ...ORLANDO_FURIOSO_CANTO_30,
  ...ORLANDO_FURIOSO_CANTO_31,
  ...ORLANDO_FURIOSO_CANTO_32,
  ...ORLANDO_FURIOSO_CANTO_33,
  ...ORLANDO_FURIOSO_CANTO_34,
  ...ORLANDO_FURIOSO_CANTO_35,
  ...ORLANDO_FURIOSO_CANTO_36,
  ...ORLANDO_FURIOSO_CANTO_37,
  ...ORLANDO_FURIOSO_CANTO_38,
  ...ORLANDO_FURIOSO_CANTO_39,
  ...ORLANDO_FURIOSO_CANTO_40,
  ...ORLANDO_FURIOSO_CANTO_41,
  ...ORLANDO_FURIOSO_CANTO_42,
  ...ORLANDO_FURIOSO_CANTO_43,
  ...ORLANDO_FURIOSO_CANTO_44,
  ...ORLANDO_FURIOSO_CANTO_45,
  ...ORLANDO_FURIOSO_CANTO_46,
]
