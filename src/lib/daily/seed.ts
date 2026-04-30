/**
 * Daily card content seed.
 *
 * Drives the dashboard's unified Daily card (Quote · Passage · Character ·
 * Book). One entry per type per day, selected deterministically by
 * `dayOfYear() % entries.length` so the same calendar day always shows the
 * same content.
 *
 * Quoted text uses curly typographic quotes throughout.
 */

export interface DailyQuote {
  type: "quote"
  text: string
  attribution: string
  /** Optional book id to deep-link from the card. */
  bookId?: string
}

export interface DailyPassage {
  type: "passage"
  /** Lines rendered as paragraph fragments. */
  lines: string[]
  bookId: string
  bookTitle: string
  /** Display label for attribution, e.g. "Book I" or "Act III, Scene i". */
  location: string
  /** 0-indexed chapter to deep-link via `/read/{bookId}?ch={chapterIndex}`. */
  chapterIndex: number
}

export interface DailyCharacter {
  type: "character"
  name: string
  bookId: string
  bookTitle: string
  summary: string
  /**
   * Optional Stoa painting id (from `data/stoa-collection.ts`) tied to the
   * unlocking book. The card will show a small painting credit when present.
   */
  stoaPaintingId?: string
}

export interface DailyBook {
  type: "book"
  bookId: string
  title: string
  author: string
  description: string
}

export type DailyEntry = DailyQuote | DailyPassage | DailyCharacter | DailyBook

export const DAILY_QUOTES: DailyQuote[] = [
  {
    type: "quote",
    text: "Waste no more time arguing what a good man should be. Be one.",
    attribution: "Marcus Aurelius, Meditations",
    bookId: "meditations",
  },
  {
    type: "quote",
    text: "There are more things in heaven and earth, Horatio, than are dreamt of in your philosophy.",
    attribution: "William Shakespeare, Hamlet",
    bookId: "hamlet",
  },
  {
    type: "quote",
    text: "Sing, O goddess, the rage of Achilles son of Peleus.",
    attribution: "Homer, The Iliad",
    bookId: "the-iliad",
  },
  {
    type: "quote",
    text: "Midway upon the journey of our life, I found myself within a forest dark.",
    attribution: "Dante, Inferno",
    bookId: "inferno",
  },
  {
    type: "quote",
    text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.",
    attribution: "John Milton, Paradise Lost",
    bookId: "paradise-lost",
  },
  {
    type: "quote",
    text: "I sing of arms and the man, who first from the shores of Troy came, an exile of fate.",
    attribution: "Virgil, The Aeneid",
    bookId: "the-aeneid",
  },
  {
    type: "quote",
    text: "Tell me, O muse, of that ingenious hero who travelled far and wide.",
    attribution: "Homer, The Odyssey",
    bookId: "the-odyssey",
  },
]

export const DAILY_PASSAGES: DailyPassage[] = [
  {
    type: "passage",
    lines: [
      "Sing, O goddess, the rage of Achilles son of Peleus, that brought countless ills upon the Achaeans.",
      "Many a brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures.",
      "For so were the counsels of Jove fulfilled from the day on which the son of Atreus, king of men, and great Achilles, first fell out with one another.",
    ],
    bookId: "the-iliad",
    bookTitle: "The Iliad",
    location: "Book I",
    chapterIndex: 0,
  },
  {
    type: "passage",
    lines: [
      "Midway upon the journey of our life I found myself within a forest dark, for the straightforward pathway had been lost.",
      "Ah me. How hard a thing it is to say what was this forest savage, rough, and stern, which in the very thought renews the fear.",
    ],
    bookId: "inferno",
    bookTitle: "Inferno",
    location: "Canto I",
    chapterIndex: 0,
  },
  {
    type: "passage",
    lines: [
      "Of Man's first disobedience, and the fruit of that forbidden tree whose mortal taste brought death into the world, and all our woe,",
      "with loss of Eden, till one greater Man restore us, and regain the blissful seat — sing, Heavenly Muse.",
    ],
    bookId: "paradise-lost",
    bookTitle: "Paradise Lost",
    location: "Book I",
    chapterIndex: 0,
  },
  {
    type: "passage",
    lines: [
      "Tell me, O muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of Troy.",
      "Many cities did he visit, and many were the nations with whose manners and customs he was acquainted.",
    ],
    bookId: "the-odyssey",
    bookTitle: "The Odyssey",
    location: "Book I",
    chapterIndex: 0,
  },
  {
    type: "passage",
    lines: [
      "I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and the Lavinian coast.",
      "Much was he tossed about on land and sea by the violence of the gods, on account of the unrelenting wrath of cruel Juno.",
    ],
    bookId: "the-aeneid",
    bookTitle: "The Aeneid",
    location: "Book I",
    chapterIndex: 0,
  },
  {
    type: "passage",
    lines: [
      "To be, or not to be, that is the question.",
      "Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles, and by opposing end them.",
    ],
    bookId: "hamlet",
    bookTitle: "Hamlet",
    location: "Act III, Scene i",
    chapterIndex: 2,
  },
  {
    type: "passage",
    lines: [
      "Begin each day by telling yourself: today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness.",
      "All of them due to the offenders' ignorance of what is good or evil.",
    ],
    bookId: "meditations",
    bookTitle: "Meditations",
    location: "Book II",
    chapterIndex: 1,
  },
]

export const DAILY_CHARACTERS: DailyCharacter[] = [
  {
    type: "character",
    name: "Achilles",
    bookId: "the-iliad",
    bookTitle: "The Iliad",
    summary:
      "Greatest of the Achaean warriors at Troy. His withdrawal from the war, in fury at Agamemnon, sets the poem's wrath in motion and seals the fates of Patroclus, Hector, and the city itself.",
    stoaPaintingId: "reading-from-homer",
  },
  {
    type: "character",
    name: "Beatrice",
    bookId: "inferno",
    bookTitle: "The Divine Comedy",
    summary:
      "Dante's beloved, who descends from Paradise to send Virgil as his guide through Hell. She is at once a real woman of Florence and the figure through whom divine love works on Dante's poem.",
    stoaPaintingId: "barque-of-dante",
  },
  {
    type: "character",
    name: "Hamlet",
    bookId: "hamlet",
    bookTitle: "Hamlet",
    summary:
      "Prince of Denmark, scholar at Wittenberg, son of a murdered king. The play traces his hesitation between knowledge and action under the pressure of the Ghost's command.",
    stoaPaintingId: "ophelia",
  },
  {
    type: "character",
    name: "Satan",
    bookId: "paradise-lost",
    bookTitle: "Paradise Lost",
    summary:
      "Milton's fallen archangel, the most charismatic voice in the poem. His council in Pandemonium and his journey through Chaos are among the most ambitious set-pieces in English verse.",
  },
  {
    type: "character",
    name: "Odysseus",
    bookId: "the-odyssey",
    bookTitle: "The Odyssey",
    summary:
      "King of Ithaca, husband of Penelope, ten years lost between Troy and home. The poem celebrates his cunning and tests it against gods, monsters, and the silence of his own household.",
    stoaPaintingId: "ulysses-and-the-sirens",
  },
  {
    type: "character",
    name: "Aeneas",
    bookId: "the-aeneid",
    bookTitle: "The Aeneid",
    summary:
      "Trojan exile and founder-figure of Rome. Virgil follows him from the burning city through Carthage and the underworld to the Italian shore, weighing duty against love at every turn.",
    stoaPaintingId: "aeneid-tiepolo",
  },
  {
    type: "character",
    name: "Macbeth",
    bookId: "macbeth",
    bookTitle: "Macbeth",
    summary:
      "A Scottish thane drawn into prophecy and regicide. The play follows the swift collapse of conscience under ambition and the sleepless ruin that follows.",
  },
]

export const DAILY_BOOKS: DailyBook[] = [
  {
    type: "book",
    bookId: "the-iliad",
    title: "The Iliad",
    author: "Homer",
    description:
      "The wrath of Achilles, the wall before Troy, the death of Hector. The Western tradition's first long poem, sung in twenty-four books.",
  },
  {
    type: "book",
    bookId: "the-odyssey",
    title: "The Odyssey",
    author: "Homer",
    description:
      "Ten years home from Troy. A poem of return, hospitality, and cunning, structured around the patient endurance of Odysseus and Penelope.",
  },
  {
    type: "book",
    bookId: "inferno",
    title: "Inferno",
    author: "Dante Alighieri",
    description:
      "The first canticle of the Divine Comedy. Virgil leads Dante down through nine concentric circles of the dead and out beneath the stars.",
  },
  {
    type: "book",
    bookId: "paradise-lost",
    title: "Paradise Lost",
    author: "John Milton",
    description:
      "Twelve books of blank verse on the Fall. Milton's ambition was to justify the ways of God to men; what he produced is the most consequential epic in English.",
  },
  {
    type: "book",
    bookId: "hamlet",
    title: "Hamlet",
    author: "William Shakespeare",
    description:
      "The longest and most-quoted of Shakespeare's plays. A revenge tragedy that turns inward at every step, refusing the cleanness of the form.",
  },
  {
    type: "book",
    bookId: "the-aeneid",
    title: "The Aeneid",
    author: "Virgil",
    description:
      "Rome's founding epic, written in twelve books to set Augustan order against Homeric chaos. The poem ends abruptly, on a question.",
  },
  {
    type: "book",
    bookId: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    description:
      "Private notebooks of a Roman emperor, written in Greek on campaign. A working stoic's reminders to himself, never intended for publication.",
  },
]

/**
 * Day-of-year selection: deterministic, same calendar day yields the same
 * entry. Caller passes the day index so SSR can compute it once.
 */
export function selectDaily<T>(entries: T[], dayIndex: number): T {
  if (entries.length === 0) {
    throw new Error("selectDaily: empty entries array")
  }
  const idx = ((dayIndex % entries.length) + entries.length) % entries.length
  return entries[idx]
}
