/**
 * Odyssey glosses — single-sentence, tap-to-reveal definitions for
 * William Cullen Bryant's blank-verse translation of the Odyssey.
 *
 *   - Annotations (see `annotations.ts` + `odyssey-annotations.ts`) are
 *     the scholarly-paragraph layer, Virgil's voice, drawer-opened.
 *   - Glosses are dictionary-style, tooltip-sized, one sentence max.
 *     They identify — places, people, Greek terms, ritual objects.
 *
 * Phrase-matching: each gloss's `phrase` must appear verbatim in the
 * rendered Bryant text; the reader's matcher is a substring scan. Short
 * phrases (proper names, single terms) are safer across line breaks.
 * Longer phrasal glosses should be used sparingly.
 *
 * Scope target: 20+ per book × 24 books = ~500 glosses. Heaviest in
 * Book XI (the Nekyia, shade-dense) and Books III–IV (Telemachus's
 * encounters, name-dense).
 */

import { ODYSSEY_GLOSSES_BOOK_1_THROUGH_12 } from "./odyssey/glosses-1-12"
import { ODYSSEY_GLOSSES_BOOK_13_THROUGH_24 } from "./odyssey/glosses-13-24"

export interface OdysseyGloss {
  /** Chapter index in public/content/the-odyssey/ — 0=Preface, 1=Book I, ..., 24=Book XXIV. */
  chapterIndex: number
  /** Exact substring to wrap in a tooltip. */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export const ODYSSEY_GLOSSES: OdysseyGloss[] = [
  ...ODYSSEY_GLOSSES_BOOK_1_THROUGH_12,
  ...ODYSSEY_GLOSSES_BOOK_13_THROUGH_24,
]
