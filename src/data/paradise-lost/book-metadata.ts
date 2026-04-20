/**
 * Paradise Lost book-level metadata — Roman numerals, traditional one-
 * sentence arguments, the opening lines of each book (English, since
 * Milton's poem is not a translation), and the line-range of each of
 * the four invocations (I, III, VII, IX).
 *
 * Shared by the React reader (for the in-page BookHeaderBlock
 * apparatus) and scripts/paradise-lost/transform-book.ts (for
 * ingest-time invocation tagging and line-anchor numbering).
 *
 * The "arguments" below are brief scholarly orienting summaries — a
 * parallel tradition to the Dryden / Pope single-sentence ARGUMENT.
 * Milton's own prose Arguments, written for the 1668 reissue, are
 * preserved in the chapter HTML and tagged `data-pl-argument`.
 */

export const BOOK_ROMAN_NUMERALS: Record<number, string> = {
  1: "I",   2: "II",  3: "III", 4: "IV",  5: "V",   6: "VI",
  7: "VII", 8: "VIII", 9: "IX", 10: "X",  11: "XI", 12: "XII",
}

export const BOOK_ARGUMENTS: Record<number, string> = {
  1:  "Satan and his fallen legions wake on the burning lake; they rise, rally, and build the palace Pandemonium as the seat of a new empire in Hell.",
  2:  "In council the fallen angels debate renewed war, and Satan alone undertakes the voyage through Chaos to find the new-created world.",
  3:  "In Heaven the Father foresees Man's fall; the Son offers himself in ransom; Satan, disguised, enters the cosmos at the orb of the Sun.",
  4:  "Satan beholds Eden and, torn by his first soliloquy of remorse, hardens his purpose; he is discovered among Adam and Eve by guardian angels.",
  5:  "The morning of Eden; Raphael descends to warn Adam, and begins the history of Satan's rebellion in Heaven.",
  6:  "The three days' war in Heaven — Michael and Satan meet in arms — until the Son alone drives the rebel host into the abyss.",
  7:  "Raphael recounts the six days of Creation — the new world made to repair what the rebel angels lost.",
  8:  "Adam tells of his own making and his first hours in the garden; Raphael warns him of passion and, at evening, departs.",
  9:  "The Serpent tempts Eve to the fruit; she eats, and persuades Adam; they fall together, and innocence departs from the world.",
  10: "The Son judges Adam and Eve; Sin and Death bridge Chaos to the earth; Satan returns to Hell and his legions are transformed into serpents.",
  11: "The Father accepts Adam's repentance; Michael descends, and on a high hill shows Adam the first deaths and deeds of fallen history.",
  12: "Michael continues the vision through Abraham, Moses, and the Messiah; Adam and Eve are led weeping from Eden, the world before them.",
}

/** Opening lines of each book, verbatim from Milton (1674 12-book edition),
 *  as an epigraph for the in-page header block. Lines are joined by " / ". */
export const BOOK_OPENINGS: Record<number, string> = {
  1:  "Of Man's first disobedience, and the fruit / Of that forbidden Tree, whose mortal taste / Brought death into the World, and all our woe…",
  2:  "High on a throne of royal state, which far / Outshone the wealth of Ormus and of Ind…",
  3:  "Hail, holy Light, offspring of Heaven first-born, / Or of the Eternal coeternal beam…",
  4:  "O, for that warning voice, which he, who saw / The Apocalypse, heard cry in Heaven aloud…",
  5:  "Now Morn, her rosy steps in the eastern clime / Advancing, sowed the earth with orient pearl…",
  6:  "All night the dreadless Angel, unpursued, / Through Heaven's wide champaign held his way…",
  7:  "Descend from Heaven, Urania, by that name / If rightly thou art called…",
  8:  "The Angel ended, and in Adam's ear / So charming left his voice, that he a while / Thought him still speaking…",
  9:  "No more of talk where God or Angel Guest / With Man, as with his friend, familiar used / To sit indulgent…",
  10: "Meanwhile the heinous and despiteful act / Of Satan, done in Paradise…",
  11: "Thus they, in lowliest plight, repentant stood / Praying…",
  12: "As one who in his journey bates at noon, / Though bent on speed…",
}

/**
 * The four invocations — Milton's direct addresses to the Muse/Spirit,
 * where the poet himself is most formally present. Line ranges are
 * inclusive, 1-based, per standard Milton scholarship.
 *
 *   I.1–26      "Of Man's first disobedience…" — the epic invocation.
 *   III.1–55    "Hail, holy Light…" — the poet's blindness as theological sign.
 *   VII.1–39    "Descend from Heaven, Urania…" — half past and still to sing.
 *   IX.1–47     "No more of talk…" — the swerve from pastoral to tragic mode.
 */
export const BOOK_INVOCATIONS: Record<number, { start: number; end: number }> = {
  1: { start: 1, end: 26 },
  3: { start: 1, end: 55 },
  7: { start: 1, end: 39 },
  9: { start: 1, end: 47 },
}
