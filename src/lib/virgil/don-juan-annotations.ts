// ── Don Juan Annotations ──
// Scholarly annotations for Byron's Don Juan (1819–24, 17 cantos in
// ottava rima, the final canto a 14-stanza fragment). Standard Ebooks
// text — 19c Murray-lineage edition, E.H. Coleridge editorial apparatus.
// Byron's Dedication to Southey is absent from this source and is
// therefore *not* annotated in this pass; flagged for re-ingestion.
//
// Density per spec Part 4: 12–16 annotations per canto. This first pass
// ships hand-authored Opus-grade annotations for:
//   Canto I — 8 (opening, ottava rima, Inez/Annabella, Julia, marriage
//              digression, Julia's letter, "What is the end of Fame",
//              virtuoso rhyme)
//   Canto II — 6 (education digression, shipwreck, lot-drawing, Ugolino,
//              Haidée's arrival, spaniel rhyme)
//   Canto III — 5 ("Hail, Muse! et cetera", "The Isles of Greece",
//              Marathon stanza, Lambro's return, bard-as-trimmer)
//   Canto IV — 5 (opening Lucifer, last idyll, Lambro recognition,
//              Haidée's death, narrator returns to mourn)
//   Canto IX — 5 (Wellington opening, "best of cut-throats",
//              pensions indictment, Catherine, Westminster Abbey tomb)
//
// Cantos V–VIII and X–XVII carry empty stubs that will be populated in a
// second pass (Sonnet 4.6 per spec model allocation; the Opus cantos
// above are the ones the spec marks demo-critical).
//
// The unified `annotations.ts` merges this into the global library.

import type { Annotation } from "./types"

import { DON_JUAN_CANTO_1  } from "./don-juan/canto-01"
import { DON_JUAN_CANTO_2  } from "./don-juan/canto-02"
import { DON_JUAN_CANTO_3  } from "./don-juan/canto-03"
import { DON_JUAN_CANTO_4  } from "./don-juan/canto-04"
import { DON_JUAN_CANTO_5  } from "./don-juan/canto-05"
import { DON_JUAN_CANTO_6  } from "./don-juan/canto-06"
import { DON_JUAN_CANTO_7  } from "./don-juan/canto-07"
import { DON_JUAN_CANTO_8  } from "./don-juan/canto-08"
import { DON_JUAN_CANTO_9  } from "./don-juan/canto-09"
import { DON_JUAN_CANTO_10 } from "./don-juan/canto-10"
import { DON_JUAN_CANTO_11 } from "./don-juan/canto-11"
import { DON_JUAN_CANTO_12 } from "./don-juan/canto-12"
import { DON_JUAN_CANTO_13 } from "./don-juan/canto-13"
import { DON_JUAN_CANTO_14 } from "./don-juan/canto-14"
import { DON_JUAN_CANTO_15 } from "./don-juan/canto-15"
import { DON_JUAN_CANTO_16 } from "./don-juan/canto-16"
import { DON_JUAN_CANTO_17 } from "./don-juan/canto-17"

export const GENERATED_DON_JUAN_ANNOTATIONS: Annotation[] = [
  ...DON_JUAN_CANTO_1,
  ...DON_JUAN_CANTO_2,
  ...DON_JUAN_CANTO_3,
  ...DON_JUAN_CANTO_4,
  ...DON_JUAN_CANTO_5,
  ...DON_JUAN_CANTO_6,
  ...DON_JUAN_CANTO_7,
  ...DON_JUAN_CANTO_8,
  ...DON_JUAN_CANTO_9,
  ...DON_JUAN_CANTO_10,
  ...DON_JUAN_CANTO_11,
  ...DON_JUAN_CANTO_12,
  ...DON_JUAN_CANTO_13,
  ...DON_JUAN_CANTO_14,
  ...DON_JUAN_CANTO_15,
  ...DON_JUAN_CANTO_16,
  ...DON_JUAN_CANTO_17,
]
