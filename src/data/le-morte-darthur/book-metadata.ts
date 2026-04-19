/**
 * Le Morte d'Arthur — book-level metadata (Caxton's 21 books).
 *
 * Source of truth for the reader's book/chapter headers, sidebar navigation,
 * and the trial/achievement engine. Flat chapter indices map to the ingested
 * `public/content/le-morte-darthur/ch-N.json` files.
 *
 * Chapter counts match the Standard Ebooks Pollard/Caxton edition:
 *   ch-0  Bibliographical Note    (front matter)
 *   ch-1  Caxton's Preface        (front matter)
 *   ch-2..505  the 504 body chapters across 21 books
 *   ch-506  Glossary              (back matter)
 */

export interface CaxtonBook {
  /** 1-indexed book number, 1..21 */
  bookNumber: number
  /** Roman numeral label, e.g. "I", "VIII", "XXI" */
  romanNumeral: string
  /** Human-readable subject title (editorial; Caxton himself gave none) */
  subject: string
  /** Flat chapter index of this book's first chapter (inclusive) */
  firstFlatIndex: number
  /** Flat chapter index of this book's last chapter (inclusive) */
  lastFlatIndex: number
  /** Number of chapters in this book */
  chapterCount: number
  /** Matter of Britain "storyline arc" this book belongs to */
  arc:
    | "rise-of-arthur"
    | "roman-war"
    | "fellowship-established"
    | "book-of-tristram"
    | "grail-quest"
    | "lancelot-guinevere-crisis"
    | "fall-of-arthur"
  /**
   * Orientation note shown in the reader at the top of the book's first
   * chapter. Especially important for Book VIII (where the Tristram
   * digression begins) and Book XIII (where the Grail quest starts).
   */
  orientation?: string
}

export const MALORY_BOOKS: readonly CaxtonBook[] = [
  {
    bookNumber: 1, romanNumeral: "I",
    subject: "From the birth of Arthur to the sword in the stone, his coronation, and the early wars",
    firstFlatIndex: 2, lastFlatIndex: 28, chapterCount: 27,
    arc: "rise-of-arthur",
    orientation:
      "Malory opens mid-stream. Uther Pendragon, Igraine, Merlin's bargain — these names arrive without preamble. The " +
      "early chapters establish the dynastic problem; the sword in the stone resolves it.",
  },
  {
    bookNumber: 2, romanNumeral: "II",
    subject: "The Tale of Balin and Balan — the tragedy of the two brothers, the Dolorous Stroke",
    firstFlatIndex: 29, lastFlatIndex: 47, chapterCount: 19,
    arc: "rise-of-arthur",
    orientation:
      "A self-contained tragedy. Two brothers do not recognize each other and fight to mutual destruction. The Dolorous " +
      "Stroke wounds the Fisher King and wastes the land — the central motif the Grail quest will later try to heal.",
  },
  {
    bookNumber: 3, romanNumeral: "III",
    subject: "The marriage of Arthur to Guenever and the founding of the Round Table",
    firstFlatIndex: 48, lastFlatIndex: 62, chapterCount: 15,
    arc: "rise-of-arthur",
  },
  {
    bookNumber: 4, romanNumeral: "IV",
    subject: "Merlin's entombment; the first great adventures of the Round Table",
    firstFlatIndex: 63, lastFlatIndex: 90, chapterCount: 28,
    arc: "rise-of-arthur",
    orientation:
      "Merlin is lost before the midpoint. The wizard who engineered Arthur is removed from the board, and the kingdom " +
      "must carry on without prophetic counsel — a structural loss the rest of the work feels.",
  },
  {
    bookNumber: 5, romanNumeral: "V",
    subject: "Arthur's Roman War — the Continental campaign against the Emperor Lucius",
    firstFlatIndex: 91, lastFlatIndex: 102, chapterCount: 12,
    arc: "roman-war",
  },
  {
    bookNumber: 6, romanNumeral: "VI",
    subject: "Sir Launcelot du Lake — the coming of the peerless knight",
    firstFlatIndex: 103, lastFlatIndex: 120, chapterCount: 18,
    arc: "fellowship-established",
  },
  {
    bookNumber: 7, romanNumeral: "VII",
    subject: "Sir Gareth of Orkney — the Fair-Unknown story; kitchen-boy to knight",
    firstFlatIndex: 121, lastFlatIndex: 155, chapterCount: 35,
    arc: "fellowship-established",
  },
  {
    bookNumber: 8, romanNumeral: "VIII",
    subject: "The Book of Sir Tristram de Lyonesse begins — Cornwall, King Mark, La Beale Isoud",
    firstFlatIndex: 156, lastFlatIndex: 196, chapterCount: 41,
    arc: "book-of-tristram",
    orientation:
      "YOU ARE ENTERING THE TRISTRAM DIGRESSION. For the next ~220 chapters the Arthurian main plot pauses while Malory " +
      "imports a parallel Arthurian-universe narrative about Tristram of Cornwall and his love for La Beale Isoud. Many " +
      "first-time readers abandon here. Two things help: (1) the Storylines sidebar will tell you where you are in this " +
      "thread; (2) it is not cheating to skim the tournament chapters and return for the Tristram-Palomides set pieces " +
      "and the Isoud scenes. The main plot resumes at Book XIII.",
  },
  {
    bookNumber: 9, romanNumeral: "IX",
    subject: "Tristram's exile, tournaments, La Cote Male Taile, and the disguised fellowship",
    firstFlatIndex: 197, lastFlatIndex: 240, chapterCount: 44,
    arc: "book-of-tristram",
  },
  {
    bookNumber: 10, romanNumeral: "X",
    subject: "Tristram at the Surluse tournament; Palomides' long pursuit; Lamorak's death",
    firstFlatIndex: 241, lastFlatIndex: 328, chapterCount: 88,
    arc: "book-of-tristram",
    orientation:
      "The longest book in the work. The Tristram/Palomides/Lamorak braid is at its densest here. If the interlace " +
      "starts to feel unreadable, the Storylines sidebar is the lifeline.",
  },
  {
    bookNumber: 11, romanNumeral: "XI",
    subject: "Launcelot at the Castle of Corbin; Galahad begotten; the Grail glimpsed",
    firstFlatIndex: 329, lastFlatIndex: 342, chapterCount: 14,
    arc: "book-of-tristram",
  },
  {
    bookNumber: 12, romanNumeral: "XII",
    subject: "Launcelot's madness; end of the Book of Tristram",
    firstFlatIndex: 343, lastFlatIndex: 356, chapterCount: 14,
    arc: "book-of-tristram",
  },
  {
    bookNumber: 13, romanNumeral: "XIII",
    subject: "The Sankgreal begins — Galahad arrives, the Siege Perilous is filled, the quest vowed",
    firstFlatIndex: 357, lastFlatIndex: 376, chapterCount: 20,
    arc: "grail-quest",
    orientation:
      "THE MAIN PLOT RESUMES AS THE GRAIL QUEST. A structural hinge. The Round Table's greatest adventure begins — and " +
      "it is the adventure that will dissolve the fellowship. Malory is here adapting the Cistercian 'Queste del Saint " +
      "Graal', and the theological frame sits uneasily on his chivalric one; watch for that tension.",
  },
  {
    bookNumber: 14, romanNumeral: "XIV",
    subject: "Percivale's adventures on the quest",
    firstFlatIndex: 377, lastFlatIndex: 386, chapterCount: 10,
    arc: "grail-quest",
  },
  {
    bookNumber: 15, romanNumeral: "XV",
    subject: "Launcelot's adventures — his sin, his confession, his partial reformation",
    firstFlatIndex: 387, lastFlatIndex: 392, chapterCount: 6,
    arc: "grail-quest",
  },
  {
    bookNumber: 16, romanNumeral: "XVI",
    subject: "Gawain and Ector's failures on the quest; Bors' trials",
    firstFlatIndex: 393, lastFlatIndex: 409, chapterCount: 17,
    arc: "grail-quest",
  },
  {
    bookNumber: 17, romanNumeral: "XVII",
    subject: "The achievement of the Grail — Galahad, Percivale, Bors at Sarras; Galahad's translation",
    firstFlatIndex: 410, lastFlatIndex: 432, chapterCount: 23,
    arc: "grail-quest",
  },
  {
    bookNumber: 18, romanNumeral: "XVIII",
    subject: "The Fair Maid of Astolat; the poisoned apple; Launcelot and Guenever's love exposed",
    firstFlatIndex: 433, lastFlatIndex: 457, chapterCount: 25,
    arc: "lancelot-guinevere-crisis",
    orientation:
      "The Elaine of Astolat chapters — directly adapted by Tennyson as 'Lancelot and Elaine' and the source of 'The " +
      "Lady of Shalott'. The cover painting (Waterhouse) depicts this book.",
  },
  {
    bookNumber: 19, romanNumeral: "XIX",
    subject: "The queen's abduction by Meliagrance; Launcelot's rescue; the knight of the cart",
    firstFlatIndex: 458, lastFlatIndex: 470, chapterCount: 13,
    arc: "lancelot-guinevere-crisis",
  },
  {
    bookNumber: 20, romanNumeral: "XX",
    subject: "The discovery in the queen's chamber; the war with Launcelot; the rupture",
    firstFlatIndex: 471, lastFlatIndex: 492, chapterCount: 22,
    arc: "lancelot-guinevere-crisis",
  },
  {
    bookNumber: 21, romanNumeral: "XXI",
    subject: "Mordred's rebellion; the last battle at Salisbury; Arthur to Avalon; Launcelot's death",
    firstFlatIndex: 493, lastFlatIndex: 505, chapterCount: 13,
    arc: "fall-of-arthur",
    orientation:
      "The elegiac final book. Mordred's rebellion, the battle at Salisbury, the return of Excalibur to the Lady of " +
      "the Lake, Arthur's passage to Avalon, Launcelot's death as a hermit. 'Rex quondam rexque futurus.'",
  },
] as const

/**
 * Map any body-chapter flat index → the book it belongs to. Returns null
 * for front-matter (ch-0, ch-1) and back-matter (ch-506).
 */
export function bookForFlatIndex(flatIndex: number): CaxtonBook | null {
  for (const b of MALORY_BOOKS) {
    if (flatIndex >= b.firstFlatIndex && flatIndex <= b.lastFlatIndex) return b
  }
  return null
}

/**
 * Flat index of the first chapter of the given book (1..21).
 */
export function firstChapterOf(bookNumber: number): number | null {
  const b = MALORY_BOOKS.find(x => x.bookNumber === bookNumber)
  return b ? b.firstFlatIndex : null
}
