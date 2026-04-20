/**
 * Paradise Lost speech table — per-book, in reading order, each entry
 * is the canonical speaker name (matching src/data/paradise-lost/speakers.ts)
 * and a short substring from the line that OPENS that speech. The
 * transform-book.ts state machine walks line-by-line and, when a line
 * contains the opener, tags the line and subsequent lines (until a
 * close-quote with no following open-quote) with data-pl-speaker.
 *
 * Openers were calibrated against the Standard Ebooks edition of
 * Milton's 1674 second edition. Spellings follow that edition exactly
 * (e.g. Mammon's "disinthrone", Book 9's "sovereign mistress" rather
 * than the archaic "sovran"). The matcher is case-sensitive, so
 * proper-noun capitalization must match the source text.
 */

export interface Speech {
  /** Canonical speaker id (must match src/data/paradise-lost/speakers.ts) */
  speaker: string
  /** Unique substring from the opening line of this speech.
   *  Prefer 5–10 words from the opening quoted phrase. */
  opens: string
}

export const BOOK_SPEECHES: Record<number, Speech[]> = {
  // ── Book I — the council on the burning lake ─────────────────────
  1: [
    { speaker: "Satan",     opens: "If thou beest he" },
    { speaker: "Beelzebub", opens: "O Prince, O Chief of many" },
    { speaker: "Satan",     opens: "Fallen Cherub, to be weak" },
    { speaker: "Satan",     opens: "Is this the region, this the soil" },
    { speaker: "Satan",     opens: "Princes, Potentates" },
  ],

  // ── Book II — the great consult ──────────────────────────────────
  2: [
    { speaker: "Satan",     opens: "Powers and Dominions, Deities of Heaven" },
    { speaker: "Moloch",    opens: "My sentence is for open war" },
    { speaker: "Belial",    opens: "I should be much for open war" },
    { speaker: "Mammon",    opens: "Either to disinthrone the King" },
    { speaker: "Beelzebub", opens: "Thrones and imperial Powers" },
    { speaker: "Satan",     opens: "O Progeny of Heaven" },
    { speaker: "Satan",     opens: "Whence and what art thou" },
    { speaker: "Death",     opens: "Back to thy punishment" },
    { speaker: "Sin",       opens: "O father, what intends thy hand" },
    { speaker: "Chaos",     opens: "I know thee, stranger" },
  ],

  // ── Book III — the heavenly council ──────────────────────────────
  3: [
    { speaker: "Father",    opens: "Only-begotten Son, seest thou" },
    { speaker: "Son",       opens: "O Father, gracious was that word" },
    { speaker: "Father",    opens: "All hast thou spoken as my thoughts" },
    { speaker: "Son",       opens: "Father, thy word is passed" },
    { speaker: "Uriel",     opens: "Fair Angel, thy desire" },
  ],

  // ── Book IV — first sight of Eden, Satan's soliloquy ─────────────
  4: [
    { speaker: "Satan",     opens: "O thou that, with surpassing glory" },
    { speaker: "Satan",     opens: "O Hell! what do mine eyes" },
    { speaker: "Adam",      opens: "Sole partner and sole part" },
    { speaker: "Eve",       opens: "O thou for whom" },
    { speaker: "Gabriel",   opens: "Uzziel, half these draw off" },
    { speaker: "Ithuriel",  opens: "Which of those rebel Spirits" },
    { speaker: "Satan",     opens: "Not to know me argues yourselves" },
    { speaker: "Zephon",    opens: "Think not, revolted Spirit" },
    { speaker: "Satan",     opens: "Gabriel, thou hadst in Heaven" },
    { speaker: "Gabriel",   opens: "O loss of one in Heaven" },
  ],

  // ── Book V — morning in Eden, Raphael's descent ──────────────────
  5: [
    { speaker: "Adam",      opens: "My fairest, my espoused, my latest found" },
    { speaker: "Eve",       opens: "O sole in whom my thoughts" },
    { speaker: "Adam",      opens: "Haste hither, Eve" },
    { speaker: "Raphael",   opens: "Hail! Mother of Mankind" },
    { speaker: "Abdiel",    opens: "O argument blasphemous" },
    { speaker: "Satan",     opens: "Thrones, Dominations, Princedoms, Virtues, Powers" },
  ],

  // ── Book VI — the war in Heaven ──────────────────────────────────
  6: [
    { speaker: "Abdiel",    opens: "O Heaven! that such resemblance" },
    { speaker: "Satan",     opens: "Ill for thee, but in wished hour" },
    { speaker: "Michael",   opens: "Author of evil, unknown" },
    { speaker: "Father",    opens: "Effulgence of my glory" },
    { speaker: "Son",       opens: "O Father, O Supreme of Heavenly Thrones" },
  ],

  // ── Book VII — Creation (mostly Raphael narration) ───────────────
  7: [
    { speaker: "Adam",      opens: "Great things, and full of wonder" },
    { speaker: "Raphael",   opens: "This also thy request, with caution asked" },
  ],

  // ── Book VIII — Adam's tale ──────────────────────────────────────
  8: [
    { speaker: "Adam",      opens: "When I behold this goodly frame" },
    { speaker: "Raphael",   opens: "To ask or search I blame thee not" },
    { speaker: "Adam",      opens: "For Man to tell how human life began" },
    { speaker: "Raphael",   opens: "Accuse not Nature, she hath done her part" },
  ],

  // ── Book IX — the Fall ───────────────────────────────────────────
  9: [
    { speaker: "Satan",     opens: "O Earth, how like to Heaven" },
    { speaker: "Eve",       opens: "Adam, well may we labour" },
    { speaker: "Adam",      opens: "Sole Eve, associate sole" },
    { speaker: "Eve",       opens: "Offspring of Heaven and Earth" },
    { speaker: "Serpent",   opens: "Wonder not, sovereign mistress" },
    { speaker: "Eve",       opens: "Serpent, thy overpraising" },
    { speaker: "Serpent",   opens: "Empress, the way is ready" },
    { speaker: "Eve",       opens: "Serpent, we might have spared" },
    { speaker: "Serpent",   opens: "Indeed? Hath God then said" },
    { speaker: "Eve",       opens: "yet sinless" },
    { speaker: "Serpent",   opens: "O sacred, wise, and wisdom-giving" },
    { speaker: "Eve",       opens: "Great are thy virtues, doubtless" },
    { speaker: "Eve",       opens: "Hast thou not wondered, Adam" },
    { speaker: "Adam",      opens: "O fairest of creation, last and best" },
    { speaker: "Adam",      opens: "Bold deed thou hast presumed" },
    { speaker: "Eve",       opens: "Would thou hadst hearkened" },
    { speaker: "Adam",      opens: "What words have passed thy lips" },
  ],

  // ── Book X — the judgment, the bridge of Sin and Death ───────────
  10: [
    { speaker: "Father",    opens: "Assembled Angels, and ye Powers" },
    { speaker: "Son",       opens: "Father Eternal, thine is to decree" },
    { speaker: "Son",       opens: "Where art thou, Adam" },
    { speaker: "Adam",      opens: "O Heaven! in evil strait" },
    { speaker: "Eve",       opens: "The Serpent me beguiled" },
    { speaker: "Sin",       opens: "O Son, why sit we here" },
    { speaker: "Sin",       opens: "O Parent, these are thy magnific" },
    { speaker: "Satan",     opens: "Fair daughter, and thou son and grandchild" },
    { speaker: "Satan",     opens: "Thrones, Dominations, Princedoms, Virtues, Powers" },
    { speaker: "Eve",       opens: "Forsake me not thus, Adam" },
    { speaker: "Adam",      opens: "Unwary, and too desirous" },
  ],

  // ── Book XI — Michael descends, the first deaths ─────────────────
  11: [
    { speaker: "Son",       opens: "See, Father, what first-fruits" },
    { speaker: "Father",    opens: "All thy request for Man" },
    { speaker: "Michael",   opens: "Adam, Heaven's high behest" },
    { speaker: "Eve",       opens: "O unexpected stroke, worse than of Death" },
    { speaker: "Adam",      opens: "O Teacher, some great mischief" },
    { speaker: "Michael",   opens: "The brazen throat of war" },
  ],

  // ── Book XII — the prophetic vision, the expulsion ───────────────
  12: [
    { speaker: "Michael",   opens: "Thus will this latter, as the former" },
    { speaker: "Adam",      opens: "O prophet of glad tidings" },
    { speaker: "Michael",   opens: "Dream not of their fight" },
    { speaker: "Adam",      opens: "How soon hath thy prediction" },
    { speaker: "Michael",   opens: "Let us descend now, therefore" },
    { speaker: "Eve",       opens: "Whence thou return'st, and whither went'st" },
  ],
}
