/**
 * The Faerie Queene — book/canto metadata used by the reader's header chrome,
 * navigation, trials, and annotation layer.
 *
 * Structural hierarchy (deepest in the Tome catalog):
 *   book → canto → stanza → line
 *
 * The poem has six complete books (Books I–VI) plus two cantos of an
 * unfinished Book VII ("The Mutabilitie Cantos," numbered vi and vii to
 * signal Spenser's intent that they are late in their book). Each of
 * Books I–VI has 12 cantos of ~50–60 Spenserian stanzas. The Mutabilitie
 * Cantos are substantially shorter and include two "unperfite" closing
 * stanzas that are Spenser's last surviving verse.
 *
 * Current Standard Ebooks content layout (public/content/the-faerie-queene/):
 *   ch-0  = Forward (editor's intro, app-generated)
 *   ch-1  = Letter to Sir Walter Raleigh (Spenser's 1589 allegorical key)
 *   ch-2  = Book I
 *   ch-3  = Book II
 *   ch-4  = Book III
 *   ch-5  = Book IV
 *   ch-6  = Book V
 *   ch-7  = Book VI
 *   ch-8  = Mutabilitie Cantos (both cantos + the two "unperfite" closing
 *           stanzas, in one file)
 *
 * Part 1 of the ingestion plan splits ch-2..ch-8 into per-canto files. Until
 * that split runs, `chapterIndex` maps to book (ch-2=Book I, etc.) and canto-
 * level navigation happens via in-page anchors.
 */

export const FAERIE_QUEENE_BOOK_COUNT = 6
export const FAERIE_QUEENE_COMPLETE_CANTOS_PER_BOOK = 12
export const FAERIE_QUEENE_MUTABILITIE_CANTOS = [6, 7] as const

/** Chapter indices in public/content/the-faerie-queene/ch-N.json */
export const CHAPTER_INDEX = {
  FORWARD: 0,
  LETTER_TO_RALEGH: 1,
  BOOK_I: 2,
  BOOK_II: 3,
  BOOK_III: 4,
  BOOK_IV: 5,
  BOOK_V: 6,
  BOOK_VI: 7,
  MUTABILITIE: 8,
} as const

export const ROMAN: Record<number, string> = {
  1: "I",  2: "II", 3: "III", 4: "IV",  5: "V",
  6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X",
  11: "XI", 12: "XII",
}

export interface BookMeta {
  /** 1-based book number, I–VI, plus Mutabilitie as 7. */
  number: number
  roman: string
  /** Display title (excluding "Book I:" prefix, which the reader adds). */
  title: string
  /** Virtue allegorized by this book's titular knight. */
  virtue: string
  /** Book's titular knight (or, for Mutabilitie, protagonist). */
  titularKnight: string
  /** Number of cantos in this book. 12 for I–VI, 2 for Mutabilitie. */
  cantoCount: number
  /** Canto number(s) marked as climactic set-pieces in navigation. */
  climacticCantos: number[]
  /** Which chapter file in public/content/the-faerie-queene/ currently holds
   *  this book, pending canto-level split. */
  currentChapterIndex: number
  /** Publication year of the edition this book first appeared in. */
  firstPublished: number
  /** One-sentence orientation for the book as a whole. */
  summary: string
}

export const FAERIE_QUEENE_BOOKS: Record<number, BookMeta> = {
  1: {
    number: 1, roman: "I",
    title: "The Legend of the Knight of the Red Cross, or of Holiness",
    virtue: "Holiness",
    titularKnight: "Redcrosse Knight",
    cantoCount: 12,
    // The House of Holiness (x) and the Dragon-fight (xi–xii) form the
    // climactic triad; the Cave of Despair (ix) is the moral summit.
    climacticCantos: [9, 10, 11, 12],
    currentChapterIndex: CHAPTER_INDEX.BOOK_I,
    firstPublished: 1590,
    summary:
      "The Redcrosse Knight, sent by Gloriana to rescue Una's parents from a dragon, " +
      "is separated from Una by the sorcerer Archimago, deceived by Duessa, falls to " +
      "pride and despair, is restored in the House of Holiness, and kills the dragon — " +
      "a Protestant allegory of the Christian soul from fall to redemption, and of " +
      "England as the new Israel.",
  },
  2: {
    number: 2, roman: "II",
    title: "The Legend of Sir Guyon, or of Temperance",
    virtue: "Temperance",
    titularKnight: "Sir Guyon",
    cantoCount: 12,
    // Cave of Mammon (vii), House of Alma (ix), Bower of Bliss (xii) —
    // the three great set-pieces; the Bower is the most imitated passage
    // in the poem (Paradise Lost IV is responding to it).
    climacticCantos: [7, 9, 12],
    currentChapterIndex: CHAPTER_INDEX.BOOK_II,
    firstPublished: 1590,
    summary:
      "Guyon, guided by the Palmer (Reason), traverses a moral landscape of passions " +
      "and appetites — the bloody-handed babe, Medina's mean between extremes, the " +
      "three-day temptation in the Cave of Mammon, the allegorical body of the House " +
      "of Alma — and at the book's close destroys Acrasia's Bower of Bliss in a scene " +
      "whose violence has troubled critics for four centuries.",
  },
  3: {
    number: 3, roman: "III",
    title: "The Legend of Britomartis, or of Chastity",
    virtue: "Chastity",
    titularKnight: "Britomart",
    cantoCount: 12,
    // Britomart's mirror-vision (ii), Garden of Adonis (vi), Busirane's
    // house (xi–xii) — the poem's most erotic and most philosophical
    // book, with interlace beginning to dominate the narrative.
    climacticCantos: [2, 6, 11, 12],
    currentChapterIndex: CHAPTER_INDEX.BOOK_III,
    firstPublished: 1590,
    summary:
      "Britomart, the warrior maiden who fell in love with Artegall by seeing him in " +
      "her father's magic mirror, quests through a landscape of erotic dangers — " +
      "Malecasta's Castle Joyous, the Garden of Adonis, the House of Busirane — " +
      "rescuing Amoret from enchantment at the book's close. The interlace structure, " +
      "inherited from Ariosto, here becomes dominant.",
  },
  4: {
    number: 4, roman: "IV",
    title: "The Legend of Cambel and Triamond, or of Friendship",
    virtue: "Friendship",
    titularKnight: "Sir Cambel & Sir Triamond",
    cantoCount: 12,
    // Florimell's girdle (v), the Temple of Venus (x) — one of Spenser's
    // most beautiful set-pieces — and the reunion of Florimell with
    // Marinell at the book's end.
    climacticCantos: [5, 10, 12],
    currentChapterIndex: CHAPTER_INDEX.BOOK_IV,
    firstPublished: 1596,
    summary:
      "Continuing the interlaced plots of Book III — Amoret, Florimell, Britomart, " +
      "Artegall — under the banner of friendship rather than chastity. The book " +
      "includes Spenser's elegant fidelity-test (the false Florimell and the girdle) " +
      "and the Temple of Venus, a vision of erotic concord at the center of the poem.",
  },
  5: {
    number: 5, roman: "V",
    title: "The Legend of Artegall, or of Justice",
    virtue: "Justice",
    titularKnight: "Sir Artegall",
    cantoCount: 12,
    // Radigund (iv–vii), Isis Church (vii), Mercilla's trial of Duessa
    // (ix), the Irish campaign against Grantorto (xi–xii). The poem's
    // most politically contemporary and most scholarly-controversial book.
    climacticCantos: [4, 5, 6, 7, 9, 11, 12],
    currentChapterIndex: CHAPTER_INDEX.BOOK_V,
    firstPublished: 1596,
    summary:
      "Artegall and his iron-man Talus ride out to administer justice — the Amazon " +
      "Radigund, the giant with scales, the trial of Duessa (Mary Queen of Scots) " +
      "before Mercilla (Elizabeth), and the Irish campaign against Grantorto (Spain). " +
      "Spenser's service as Lord Grey's secretary in Ireland underlies the book's " +
      "politics; the moral difficulty is real and the annotations do not soften it.",
  },
  6: {
    number: 6, roman: "VI",
    title: "The Legend of Sir Calidore, or of Courtesy",
    virtue: "Courtesy",
    titularKnight: "Sir Calidore",
    cantoCount: 12,
    // Mount Acidale (x) — the vision of the Graces, Spenser's most
    // personal and self-referential moment — is the book's summit.
    // The Blatant Beast's escape at xii is the tonal ending of the
    // whole six-book enterprise.
    climacticCantos: [9, 10, 12],
    currentChapterIndex: CHAPTER_INDEX.BOOK_VI,
    firstPublished: 1596,
    summary:
      "Calidore, pursuing the Blatant Beast (slander), turns aside to a pastoral " +
      "interlude where he falls in love with Pastorella and climbs Mount Acidale " +
      "to glimpse a vision of the Graces that his approach breaks. The Blatant " +
      "Beast escapes at the book's close; the courtesy-project is unresolved; the " +
      "poem's tonal register darkens toward the unwritten books that never came.",
  },
  7: {
    number: 7, roman: "VII",
    title: "The Mutabilitie Cantos",
    virtue: "Constancy",
    titularKnight: "Mutabilitie (as plaintiff) / Dame Nature (as judge)",
    cantoCount: 2,
    climacticCantos: [7],   // the trial on Arlo Hill (canto vii) is the summit
    currentChapterIndex: CHAPTER_INDEX.MUTABILITIE,
    firstPublished: 1609,
    summary:
      "Published posthumously in 1609, these two cantos (numbered vi and vii, as if " +
      "late in an unwritten Book VII on Constancy) are the poem's philosophical " +
      "summit. The Titaness Mutabilitie storms Jove's throne, claims rule over all " +
      "creation, and is judged by Dame Nature on Arlo Hill. The fragment ends with " +
      "two \"unperfite\" stanzas — Spenser's last known verses, a prayer for the " +
      "\"Sabbaoths sight\" of eternal rest.",
  },
}

/** Maps chapter index → book number, or null for front matter. */
export function bookNumberForChapter(chapterIndex: number): number | null {
  switch (chapterIndex) {
    case CHAPTER_INDEX.BOOK_I:   return 1
    case CHAPTER_INDEX.BOOK_II:  return 2
    case CHAPTER_INDEX.BOOK_III: return 3
    case CHAPTER_INDEX.BOOK_IV:  return 4
    case CHAPTER_INDEX.BOOK_V:   return 5
    case CHAPTER_INDEX.BOOK_VI:  return 6
    case CHAPTER_INDEX.MUTABILITIE: return 7
    default: return null
  }
}

/**
 * Canto-level metadata. Arguments for Books I and II are provided at
 * ingestion time (confidence zone — these are the demo-worthy books).
 * Arguments for Books III–VI will be extracted from the SE HTML during
 * the canto-splitting pass (Part 1 of the ingestion plan); `summary:
 * null` indicates deferred extraction, not absence.
 *
 * Note on Spenser's own verse Arguments: each canto in the 1590/1596
 * editions opens with a four-line quatrain "Argument" summarizing the
 * canto's action. Those belong in the per-canto content JSON as
 * CantoArgumentBlock (front-loaded, styled distinctly) — NOT here.
 * The `summary` field below is a scholarly one-sentence orientation
 * for navigation and the reader's "What happens in this canto?" UI.
 */
export interface CantoMeta {
  book: number
  canto: number
  roman: string
  /** Scholarly one-sentence summary, or null if deferred extraction. */
  summary: string | null
  /** True for cantos marked climactic (BookMeta.climacticCantos). */
  climactic: boolean
}

function mk(book: number, canto: number, summary: string | null): CantoMeta {
  const bm = FAERIE_QUEENE_BOOKS[book]
  return {
    book, canto,
    roman: ROMAN[canto],
    summary,
    climactic: bm.climacticCantos.includes(canto),
  }
}

export const CANTO_METADATA: CantoMeta[] = [
  // ── Book I (Holiness) ──────────────────────────────────────────────
  mk(1, 1,  "Redcrosse, riding with Una through the fair forest, enters the Wood of Error and slays the dragon Error, whose brood of books and papers figures Protestant polemic against Roman Church falsehood."),
  mk(1, 2,  "The sorcerer Archimago, disguised as a pious hermit, sends Redcrosse a false dream of Una's unchastity; separated from her at dawn, Redcrosse meets Duessa in the guise of Fidessa and is deceived."),
  mk(1, 3,  "Una, alone in the wilderness, is defended by a lion and sheltered by Abessa and Corceca; Archimago, impersonating Redcrosse, comes to her, then is unmasked in combat by the Saracen Sansloy."),
  mk(1, 4,  "Duessa leads Redcrosse to the House of Pride; the seven deadly sins parade before Lucifera; Redcrosse duels Sansjoy, the brother of Duessa's former lover, and is spared his killing-stroke by Duessa's cry."),
  mk(1, 5,  "Redcrosse discovers Sansjoy has been magically borne to the underworld for healing; warned by the dwarf of the House of Pride's true nature, he escapes; Duessa slips away to join him."),
  mk(1, 6,  "Una, rescued from Sansloy by a troop of woodland satyrs who worship her, is sheltered with them until Sir Satyrane escorts her back to the quest; Archimago still hunts them."),
  mk(1, 7,  "Redcrosse, resting disarmed beside Duessa by a sapping fountain, is overpowered by the giant Orgoglio and cast into a dungeon; Duessa becomes Orgoglio's consort; Una, learning of his fall, meets Prince Arthur."),
  mk(1, 8,  "Arthur storms Orgoglio's castle, strikes the giant to earth, frees Redcrosse from the dungeon, and strips Duessa of her disguise; her true hideous form is revealed and she flees into the wilderness."),
  mk(1, 9,  "Restored to Una, Redcrosse meets a despairing knight and is led to the Cave of Despair, whose rhetoric nearly persuades him to suicide; Una arrives in time to name grace, and they depart."),
  mk(1, 10, "Una brings Redcrosse to the House of Holiness, where Dame Caelia and her daughters Fidelia, Speranza, and Charissa heal him; he climbs the hill of Contemplation and glimpses the New Jerusalem."),
  mk(1, 11, "Redcrosse, armored with holiness, meets the Dragon that has besieged Una's parents' kingdom; the three-day battle — wounding, fall into the Well of Life, rising, fall into the Tree of Life, rising — allegorizes the Passion and Resurrection."),
  mk(1, 12, "The Dragon slain, Una's parents are freed, Redcrosse is betrothed to Una — but the quest continues: he must return to Gloriana's court for six more years before the marriage can be sealed."),

  // ── Book II (Temperance) ───────────────────────────────────────────
  mk(2, 1,  "Archimago, still pursuing Redcrosse, instead turns his malice on Guyon, nearly provoking him to strike Redcrosse; shamed by the recognition, Guyon rides on with the Palmer, and discovers the dying Amavia with her bloody-handed babe Ruddymane."),
  mk(2, 2,  "Guyon seeks to wash the baby's blood from his hands in a nearby spring, which refuses to be cleansed; at Medina's castle, her two quarrelling sisters — Elissa and Perissa, the extremes — are reconciled by Medina, the mean."),
  mk(2, 3,  "Braggadochio, a coward who has stolen Guyon's horse and spear, encounters Belphoebe hunting in the forest; her rebuke of his cowardice is one of Spenser's first portraits of Elizabeth in her virgin-huntress aspect."),
  mk(2, 4,  "Guyon meets the madman Furor and his mother Occasion, binds them at the Palmer's advice, and learns from Phedon the story by which jealousy destroyed his friendship with Philemon and drove him mad."),
  mk(2, 5,  "The Saracen Pyrochles, finding Occasion and Furor bound, frees them in pride and is himself driven mad by them; Guyon must rescue him from the fire of his own rage."),
  mk(2, 6,  "Crossing the Idle Lake with the wanton Phaedria to her island of sloth, Guyon resists her blandishments; on the far shore, the Saracen Cymochles finds Pyrochles raving and tries to douse his fire in the lake."),
  mk(2, 7,  "Guyon, left by the Palmer on the wrong shore, descends with the god Mammon into the underworld Cave of Mammon; over three days and nights he is tempted with wealth, with Philotime's chain of ambition, with the forbidden fruit of Proserpina's garden, and resists all."),
  mk(2, 8,  "Guyon, emerging exhausted from Mammon's cave, faints; Pyrochles and Cymochles arrive to strip him; an angel guards him until the Palmer returns with Arthur, who kills both Saracens in defense of the unconscious knight."),
  mk(2, 9,  "Guyon and Arthur arrive at the House of Alma, the allegorical human body, defended against the siege of Maleger (figure of mortality). They tour the body's rooms — the kitchens of digestion, the library of imagination, the parlor of the heart."),
  mk(2, 10, "While Arthur fights Maleger outside, Guyon reads in Alma's library the chronicles of Britain from Brutus to Uther Pendragon — Spenser's version of Virgil's parade of Roman heroes."),
  mk(2, 11, "Arthur, unable to kill the half-dead Maleger by strength, drowns him in a standing pool; the siege of the House of Alma is lifted."),
  mk(2, 12, "Guyon sails with the Palmer past the Rock of Reproach, the Gulf of Greediness, the Wandering Islands, the quicksands of Unthriftihed, and reaches Acrasia's Bower of Bliss; they bind her in an adamantine net and Guyon destroys the Bower in the poem's most imitated and most debated set-piece."),

  // ── Book III (Chastity) — summaries deferred to canto-splitting pass
  mk(3, 1,  null),
  mk(3, 2,  null),
  mk(3, 3,  null),
  mk(3, 4,  null),
  mk(3, 5,  null),
  mk(3, 6,  null),
  mk(3, 7,  null),
  mk(3, 8,  null),
  mk(3, 9,  null),
  mk(3, 10, null),
  mk(3, 11, null),
  mk(3, 12, null),

  // ── Book IV (Friendship) ───────────────────────────────────────────
  mk(4, 1,  null),
  mk(4, 2,  null),
  mk(4, 3,  null),
  mk(4, 4,  null),
  mk(4, 5,  null),
  mk(4, 6,  null),
  mk(4, 7,  null),
  mk(4, 8,  null),
  mk(4, 9,  null),
  mk(4, 10, null),
  mk(4, 11, null),
  mk(4, 12, null),

  // ── Book V (Justice) ───────────────────────────────────────────────
  mk(5, 1,  null),
  mk(5, 2,  null),
  mk(5, 3,  null),
  mk(5, 4,  null),
  mk(5, 5,  null),
  mk(5, 6,  null),
  mk(5, 7,  null),
  mk(5, 8,  null),
  mk(5, 9,  null),
  mk(5, 10, null),
  mk(5, 11, null),
  mk(5, 12, null),

  // ── Book VI (Courtesy) ─────────────────────────────────────────────
  mk(6, 1,  null),
  mk(6, 2,  null),
  mk(6, 3,  null),
  mk(6, 4,  null),
  mk(6, 5,  null),
  mk(6, 6,  null),
  mk(6, 7,  null),
  mk(6, 8,  null),
  mk(6, 9,  null),
  mk(6, 10, null),
  mk(6, 11, null),
  mk(6, 12, null),

  // ── Book VII (The Mutabilitie Cantos) ──────────────────────────────
  {
    book: 7, canto: 6, roman: "VI",
    summary:
      "The Titaness Mutabilitie, claiming rule over all creation, ascends to the sphere " +
      "of the moon and challenges Cynthia for her throne; Jove, summoned, hesitates to " +
      "strike her down by force and agrees to judgment on Arlo Hill under Dame Nature.",
    climactic: false,
  },
  {
    book: 7, canto: 7, roman: "VII",
    summary:
      "On Arlo Hill, Mutabilitie presents the procession of seasons, months, hours, life " +
      "and death as proof of her sovereignty over all; Dame Nature judges that change is " +
      "only the working-out of each being's nature toward its own perfection — concluding " +
      "with the two \"unperfite\" closing stanzas, Spenser's last surviving verse, a prayer " +
      "for the Sabbath-sight of eternal rest.",
    climactic: true,
  },
]

/** Lookup a canto by (book, canto) — returns null if out of range. */
export function getCanto(book: number, canto: number): CantoMeta | null {
  return CANTO_METADATA.find((c) => c.book === book && c.canto === canto) ?? null
}

/** All cantos in a book, in order. */
export function cantosForBook(book: number): CantoMeta[] {
  return CANTO_METADATA.filter((c) => c.book === book)
}

/**
 * Verse form declaration. Spenser's verse engine (Spenserian stanza) is
 * distinct from ottava rima (Don Juan, Orlando Furioso) and from
 * Miltonic blank verse (Paradise Lost).
 */
export const VERSE_FORM = {
  id: "spenserian-stanza",
  lineCount: 9,
  meter: "iambic-pentameter-except-line-9",
  alexandrineLine: 9,                // the ninth line is iambic hexameter
  rhymeScheme: "ABABBCBCC",
  invented: "Edmund Spenser, 1590",
  description:
    "Nine lines: eight in iambic pentameter plus a ninth alexandrine " +
    "(iambic hexameter), rhyming ABABBCBCC. The alexandrine closing line " +
    "is Spenser's formal signature — it typically summarizes, deflates, " +
    "or amplifies the preceding eight, and is the form's characteristic " +
    "rhythmic moment.",
} as const

/**
 * Structural-summit (climactic-canto) flags, aggregated for the canto
 * navigator's subtle marker. Pulled from BookMeta.climacticCantos.
 */
export const CLIMACTIC_MARKERS: Array<{ book: number; canto: number; label: string }> = [
  // Book I
  { book: 1, canto: 9,  label: "Cave of Despair" },
  { book: 1, canto: 10, label: "House of Holiness" },
  { book: 1, canto: 11, label: "The Dragon — first day" },
  { book: 1, canto: 12, label: "The Dragon slain — betrothal to Una" },
  // Book II
  { book: 2, canto: 7,  label: "Cave of Mammon" },
  { book: 2, canto: 9,  label: "House of Alma" },
  { book: 2, canto: 12, label: "Bower of Bliss" },
  // Book III
  { book: 3, canto: 2,  label: "Britomart's mirror vision" },
  { book: 3, canto: 6,  label: "Garden of Adonis" },
  { book: 3, canto: 11, label: "House of Busirane — the masque" },
  { book: 3, canto: 12, label: "House of Busirane — Amoret freed" },
  // Book IV
  { book: 4, canto: 5,  label: "Florimell's girdle" },
  { book: 4, canto: 10, label: "Temple of Venus" },
  { book: 4, canto: 12, label: "Florimell reunited with Marinell" },
  // Book V
  { book: 5, canto: 4,  label: "Radigund — Artegall unmanned" },
  { book: 5, canto: 7,  label: "Isis Church dream" },
  { book: 5, canto: 9,  label: "Trial of Duessa before Mercilla" },
  { book: 5, canto: 12, label: "Defeat of Grantorto" },
  // Book VI
  { book: 6, canto: 9,  label: "Pastorella and the shepherds" },
  { book: 6, canto: 10, label: "Mount Acidale — vision of the Graces" },
  { book: 6, canto: 12, label: "The Blatant Beast escapes" },
  // Mutabilitie
  { book: 7, canto: 7,  label: "Trial on Arlo Hill — the \"unperfite\" end" },
]
