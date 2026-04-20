import type { Annotation } from "../types"
import { getAeneidApostrophes } from "../aeneid-apparatus"

/**
 * Generate synthetic Annotation records for the five canonical
 * Virgilian authorial apostrophes, so that the V. monogram markers
 * inserted by AeneidAnnotations.tsx resolve cleanly in the shared
 * VirgilDrawer. Annotation ids are namespaced `aeneid-apostrophe-*`
 * to avoid collisions with the scholarly ✦ annotations.
 *
 * The apparatus-generated entries carry the Latin tag, the full
 * Latin quotation, and a scholarly description — everything the
 * drawer needs to render a useful card.
 */
export const AENEID_APOSTROPHE_ANNOTATIONS: Annotation[] = getAeneidApostrophes().map(
  (apo) => ({
    id: `aeneid-apostrophe-${apo.id}`,
    bookId: "the-aeneid",
    // chapterNumber is zero-indexed (ch-N.json), so Book I is 0.
    chapterNumber: apo.bookNumber - 1,
    anchorText: apo.anchorText,
    anchorOccurrence: 1,
    title: `${apo.title} — ${apo.latinTag}`,
    quotedPassage: apo.latinLine,
    passageReference: `Book ${apo.bookNumber} · Aeneid (Latin)`,
    commentary: apo.description,
    crossReferences: [],
    tags: ["linguistic", "literary-influence"],
  }),
)
