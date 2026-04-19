/**
 * Le Morte d'Arthur — Storyline Tracker.
 *
 * Adapted from the Orlando Furioso tracker (src/data/orlando-furioso/storylines.ts)
 * to handle Malory's interlace, which is less virtuosic than Ariosto's but more
 * bewildering to modern readers because Malory does not use Ariosto's authorial
 * asides to orient you.
 *
 * Reader surface: a "Storylines" sidebar/bottom-sheet in the reader. When the
 * reader opens a chapter, it shows which of the seven Matter-of-Britain arcs
 * appears here and, when applicable, a one-sentence "where did we leave this"
 * summary. The load-bearing test case is Book VIII (Tristram begins) and Book
 * XIII (Grail begins) — those pivots MUST render useful context.
 *
 * NOTE: appearances are deliberately populated at the major pivot points only
 * (~60 entries across 504 chapters). A follow-up pass is required to batch-fill
 * appearance summaries for the interior chapters of the Tristram and Grail
 * arcs — that is a PART 4-equivalent authoring task and is not completed in
 * this checkpoint. Where an arc is active across a contiguous span, a single
 * "span" entry with `from`/`to` indices stands in for per-chapter summaries.
 */

export type StorylineId =
  | "rise-of-arthur"
  | "roman-war"
  | "fellowship-established"
  | "book-of-tristram"
  | "grail-quest"
  | "lancelot-guinevere-crisis"
  | "fall-of-arthur"

export interface StorylineAppearance {
  /** Flat chapter index (ch-N) */
  flatIndex: number
  /** Malory book number (1..21) */
  book: number
  /** Chapter number within book (1..N) */
  chapter: number
  /** Short "where did we leave this" summary */
  summary: string
  /** True for the pivot chapter of an arc (displayed with emphasis) */
  pivot?: boolean
}

export interface StorylineSpan {
  /** Range of flat indices this arc is "active" over (inclusive) */
  from: number
  to: number
  /** One-sentence description of the span's through-line */
  throughline: string
}

export interface Storyline {
  id: StorylineId
  label: string
  description: string
  palette: string
  darkPalette: string
  /** Explicitly-curated pivot appearances */
  appearances: readonly StorylineAppearance[]
  /** Contiguous spans where the arc is the dominant thread */
  spans: readonly StorylineSpan[]
}

export const MALORY_STORYLINES: readonly Storyline[] = [
  {
    id: "rise-of-arthur",
    label: "The Rise of Arthur",
    description: "Arthur's conception, the sword in the stone, his coronation, the founding of the Round Table, the loss of Merlin.",
    palette: "#D4A04C",
    darkPalette: "#F5C675",
    spans: [{ from: 2, to: 90, throughline: "Books I–IV: from Uther's lust for Igraine to Merlin's entombment." }],
    appearances: [
      { flatIndex: 2,   book: 1, chapter: 1,  summary: "Uther Pendragon lusts after Igraine; Merlin's bargain for Arthur begins." },
      { flatIndex: 6,   book: 1, chapter: 5,  summary: "Arthur is born and fostered by Sir Ector." , pivot: true },
      { flatIndex: 7,   book: 1, chapter: 6,  summary: "The sword in the stone is revealed; Arthur draws it. The coronation follows." , pivot: true },
      { flatIndex: 26,  book: 1, chapter: 25, summary: "Arthur receives Excalibur from the Lady of the Lake.", pivot: true },
      { flatIndex: 48,  book: 3, chapter: 1,  summary: "Arthur's marriage to Guenever; the Round Table is founded." , pivot: true },
      { flatIndex: 63,  book: 4, chapter: 1,  summary: "Merlin, ensnared by Nyneve's love-magic, is entombed beneath a rock — he will not return.", pivot: true },
    ],
  },
  {
    id: "roman-war",
    label: "The Roman War",
    description: "Arthur's continental campaign against the Emperor Lucius. Derived from the alliterative Morte Arthure.",
    palette: "#A16207",
    darkPalette: "#D1A13E",
    spans: [{ from: 91, to: 102, throughline: "Book V, compressed from the alliterative Morte Arthure." }],
    appearances: [
      { flatIndex: 91,  book: 5, chapter: 1, summary: "Roman ambassadors demand tribute; Arthur refuses.", pivot: true },
      { flatIndex: 102, book: 5, chapter: 12, summary: "Arthur, now emperor in fact, returns to Britain." },
    ],
  },
  {
    id: "fellowship-established",
    label: "Fellowship Established",
    description: "Launcelot emerges as the peerless knight; Gareth's Fair-Unknown story establishes the Round Table's ethos.",
    palette: "#4F46E5",
    darkPalette: "#8B82F0",
    spans: [{ from: 103, to: 155, throughline: "Books VI–VII: Launcelot's introduction, Gareth of Orkney's coming-of-age." }],
    appearances: [
      { flatIndex: 103, book: 6, chapter: 1, summary: "Launcelot's first sustained adventures — he is named the best knight of the world.", pivot: true },
      { flatIndex: 121, book: 7, chapter: 1, summary: "The kitchen-boy 'Beaumains' arrives at court — he is Gareth, Gawain's brother.", pivot: true },
    ],
  },
  {
    id: "book-of-tristram",
    label: "The Book of Tristram",
    description: "A 220-chapter parallel narrative: Tristram of Cornwall, La Beale Isoud, King Mark, and Palomides' long unrequited pursuit.",
    palette: "#0D9488",
    darkPalette: "#5FC7BD",
    spans: [{ from: 156, to: 356, throughline: "Books VIII–XII. The main plot pauses. If you lose your place, the pivots below will restore it." }],
    appearances: [
      { flatIndex: 156, book: 8,  chapter: 1,  summary: "YOU ARE ENTERING THE TRISTRAM DIGRESSION. Tristram is born; his mother dies in labour.", pivot: true },
      { flatIndex: 170, book: 8,  chapter: 15, summary: "Tristram drinks the love potion with Isoud on the voyage to Cornwall." },
      { flatIndex: 241, book: 10, chapter: 1,  summary: "The Surluse tournament arc opens — the densest interlace in the whole work." , pivot: true },
      { flatIndex: 329, book: 11, chapter: 1,  summary: "Launcelot at the Castle of Corbin; Galahad is begotten on Elaine through enchantment." , pivot: true },
      { flatIndex: 356, book: 12, chapter: 14, summary: "End of the Book of Tristram. The main plot is about to resume." , pivot: true },
    ],
  },
  {
    id: "grail-quest",
    label: "The Grail Quest",
    description: "The Sankgreal: Galahad arrives, the Siege Perilous is filled, the fellowship disperses. Most knights fail. Galahad, Percivale, and Bors succeed.",
    palette: "#E5E4E2",
    darkPalette: "#F8F8F8",
    spans: [{ from: 357, to: 432, throughline: "Books XIII–XVII. The spiritual climax; the fellowship will not survive intact." }],
    appearances: [
      { flatIndex: 357, book: 13, chapter: 1,  summary: "Galahad arrives at Arthur's court on Whitsunday; the Siege Perilous is filled.", pivot: true },
      { flatIndex: 360, book: 13, chapter: 4,  summary: "The vision of the Sankgreal appears in the hall; the quest is vowed by the fellowship." , pivot: true },
      { flatIndex: 410, book: 17, chapter: 1,  summary: "The Grail seekers converge at the castle of Carbonek." },
      { flatIndex: 432, book: 17, chapter: 23, summary: "Galahad's translation at Sarras; Percivale dies a hermit; Bors returns alone to Arthur.", pivot: true },
    ],
  },
  {
    id: "lancelot-guinevere-crisis",
    label: "Launcelot & Guenever: the Crisis",
    description: "The Fair Maid of Astolat. The poisoned apple. The discovery in the queen's chamber. Launcelot's war with the Round Table.",
    palette: "#BE185D",
    darkPalette: "#E05596",
    spans: [{ from: 433, to: 492, throughline: "Books XVIII–XX. The private love becomes public catastrophe." }],
    appearances: [
      { flatIndex: 433, book: 18, chapter: 1,  summary: "The poisoned-apple accusation; Launcelot vindicates Guenever." , pivot: true },
      { flatIndex: 441, book: 18, chapter: 9,  summary: "The Fair Maid of Astolat's love; Launcelot wears her sleeve at the tournament unawares." },
      { flatIndex: 452, book: 18, chapter: 20, summary: "The Maid of Astolat's death-barge arrives at Camelot. (Tennyson's 'Lancelot and Elaine' and 'The Lady of Shalott' descend directly from here.)", pivot: true },
      { flatIndex: 481, book: 20, chapter: 1,  summary: "Agravaine and Mordred engineer the trap; Launcelot escapes the queen's chamber at sword-point — the rupture begins.", pivot: true },
      { flatIndex: 492, book: 20, chapter: 22, summary: "The pope's peace; Guenever returned; Launcelot departs for his French lands. The fellowship is broken.", pivot: true },
    ],
  },
  {
    id: "fall-of-arthur",
    label: "The Fall of Arthur",
    description: "Mordred's rebellion, the last battle, Excalibur returned, Avalon. 'Rex quondam rexque futurus.'",
    palette: "#57534E",
    darkPalette: "#A8A29E",
    spans: [{ from: 493, to: 505, throughline: "Book XXI. The elegy. Every sentence lands." }],
    appearances: [
      { flatIndex: 493, book: 21, chapter: 1,  summary: "Mordred, left as regent, usurps the crown and besieges Guenever in the Tower of London.", pivot: true },
      { flatIndex: 496, book: 21, chapter: 4,  summary: "The last battle on Salisbury Plain. Arthur kills Mordred and receives his death-wound.", pivot: true },
      { flatIndex: 497, book: 21, chapter: 5,  summary: "Bedivere throws Excalibur back into the lake on the third asking; the barge bears Arthur to Avalon.", pivot: true },
      { flatIndex: 504, book: 21, chapter: 12, summary: "Launcelot, a hermit, sickens and dies. Sir Ector speaks the eulogy — the greatest passage in the work." , pivot: true },
      { flatIndex: 505, book: 21, chapter: 13, summary: "Constantine succeeds Arthur. 'Here is the end of the whole book of King Arthur and of his noble knights of the Round Table.'" , pivot: true },
    ],
  },
] as const

/**
 * Returns all storylines whose `spans` contain this flat chapter index,
 * paired with the curated appearance (if one exists for this exact chapter).
 */
export function storylinesForChapter(flatIndex: number): Array<{
  storyline: Storyline
  appearance: StorylineAppearance | null
}> {
  const out: Array<{ storyline: Storyline; appearance: StorylineAppearance | null }> = []
  for (const s of MALORY_STORYLINES) {
    const inSpan = s.spans.some(sp => flatIndex >= sp.from && flatIndex <= sp.to)
    const appearance = s.appearances.find(a => a.flatIndex === flatIndex) ?? null
    if (inSpan || appearance) out.push({ storyline: s, appearance })
  }
  return out
}
