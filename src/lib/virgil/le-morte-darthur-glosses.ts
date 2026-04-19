/**
 * Le Morte d'Arthur — vocabulary glosses.
 *
 * Follows the Paradise Lost / Aeneid gloss pattern:
 *   - Annotations argue about meaning (paragraph, in a drawer).
 *   - Glosses identify a word or short phrase (one sentence, on hover/tap).
 *
 * Malory is the first Tier-1 book in Tome that requires inline vocabulary
 * glosses at per-chapter density. His fifteenth-century prose is accessible
 * to modern readers with help, and the same ~120 archaic words recur
 * across 504 chapters. This file is that lexicon.
 *
 * The enhancements overlay component applies word-boundary regex matching
 * across every body chapter. Toggle: "Vocabulary glosses" ON by default
 * for this book only (persisted per-book in preferences).
 *
 * `chapterIndex: -1` means: match in every chapter (the common case here).
 *
 * Format guarantees:
 *   - Definitions are <= 140 chars. If a word needs more, promote to
 *     annotation.
 *   - Match is case-insensitive but the phrase is written in its lower
 *     case Malory spelling. Word-boundaries are enforced.
 *   - Proper-noun false-positives are suppressed by the overlay by not
 *     matching inside capitalized tokens that begin mid-sentence.
 */

export interface MaloryGloss {
  /** Zero-indexed chapter (ch-N). -1 = all chapters. */
  chapterIndex: number
  /** Lower-case lemma as Malory spells it. */
  phrase: string
  /** One-sentence modern equivalent. */
  definition: string
}

export const LE_MORTE_DARTHUR_GLOSSES: readonly MaloryGloss[] = [
  // ── Core verbs of knowing / thinking / wanting ──────────────────────
  { chapterIndex: -1, phrase: "wit",      definition: "Know; have knowledge of. ('wit thou well' = 'know this for certain')." },
  { chapterIndex: -1, phrase: "wot",      definition: "Know (1st/3rd person present). From the same Old English root as *wit*." },
  { chapterIndex: -1, phrase: "ween",     definition: "Think, suppose, believe; often suggests a belief that will turn out wrong." },
  { chapterIndex: -1, phrase: "trow",     definition: "Believe, trust, suppose." },
  { chapterIndex: -1, phrase: "meseemeth",definition: "'It seems to me'; impersonal construction with me-dative." },
  { chapterIndex: -1, phrase: "list",     definition: "(Verb) wish, desire; 'if thou list' = 'if thou wish'. Not a catalogue." },
  { chapterIndex: -1, phrase: "lever",    definition: "Rather, preferably. 'I had lever' = 'I would rather'." },
  { chapterIndex: -1, phrase: "lief",     definition: "Dear, beloved; 'as thou art to me lief and dear'." },

  // ── Core verbs of motion / state ────────────────────────────────────
  { chapterIndex: -1, phrase: "yede",     definition: "Went, proceeded; past tense of an archaic verb *to go*." },
  { chapterIndex: -1, phrase: "hight",    definition: "Was named; 'a knight that hight Galahad'." },
  { chapterIndex: -1, phrase: "anon",     definition: "At once, immediately; Malory's default adverb of sudden action." },
  { chapterIndex: -1, phrase: "eftsoons", definition: "Soon after; a second time; again." },
  { chapterIndex: -1, phrase: "espied",   definition: "Saw, noticed, caught sight of." },
  { chapterIndex: -1, phrase: "hoved",    definition: "Halted, hovered, lingered; often of a boat riding at a bank." },
  { chapterIndex: -1, phrase: "bestead",  definition: "Placed, situated; usually badly — 'sore bestead' = 'hard-pressed'." },

  // ── Honour / chivalric register ─────────────────────────────────────
  { chapterIndex: -1, phrase: "worship",  definition: "Honour, reputation, renown. A knight's most valuable possession." },
  { chapterIndex: -1, phrase: "worshipful",definition: "Honourable, worthy of respect." },
  { chapterIndex: -1, phrase: "orgulyte", definition: "Arrogance, pride (from French *orgueil*)." },
  { chapterIndex: -1, phrase: "orgulous", definition: "Arrogant, proud; applied to knights who boast beyond their deeds." },
  { chapterIndex: -1, phrase: "recreant", definition: "Cowardly, faithless; a knight who yields shamefully." },
  { chapterIndex: -1, phrase: "felon",    definition: "Villain, traitor; a person of low character — not a legal term here." },
  { chapterIndex: -1, phrase: "leman",    definition: "Lover, sweetheart; applied to both men and women." },
  { chapterIndex: -1, phrase: "paramour", definition: "Lover; in Malory often neutral, sometimes tinged with adultery." },
  { chapterIndex: -1, phrase: "avaunt",   definition: "(Verb) boast; (interj.) 'begone!'. Malory uses both." },
  { chapterIndex: -1, phrase: "descrive", definition: "Describe; especially, blazon (name the components of) a coat of arms." },

  // ── Grief / emotion ─────────────────────────────────────────────────
  { chapterIndex: -1, phrase: "dolour",   definition: "Grief, sorrow." },
  { chapterIndex: -1, phrase: "doleful",  definition: "Sorrowful, grieving." },
  { chapterIndex: -1, phrase: "wroth",    definition: "Angry; 'wonderly wroth' = 'exceedingly angry'." },
  { chapterIndex: -1, phrase: "adread",   definition: "Afraid, in dread." },
  { chapterIndex: -1, phrase: "dreadful", definition: "Fearful; full of fear (passive sense) or causing fear (active)." },
  { chapterIndex: -1, phrase: "wailed",   definition: "Lamented aloud." },
  { chapterIndex: -1, phrase: "swooned",  definition: "Fainted." },

  // ── Pronouns / conjunctions / small words that trip modern readers ──
  { chapterIndex: -1, phrase: "an",       definition: "If; 'an I might live myself' = 'if I could live'." },
  { chapterIndex: -1, phrase: "sith",     definition: "Since; 'sith that time' = 'since that time'." },
  { chapterIndex: -1, phrase: "eke",      definition: "Also, too." },
  { chapterIndex: -1, phrase: "mo",       definition: "More (in number)." },
  { chapterIndex: -1, phrase: "thilk",    definition: "That same, this; demonstrative pronoun." },
  { chapterIndex: -1, phrase: "whilom",   definition: "Formerly, once upon a time." },
  { chapterIndex: -1, phrase: "yonder",   definition: "Over there; at that place visible from here." },
  { chapterIndex: -1, phrase: "withal",   definition: "Along with it; besides; moreover." },
  { chapterIndex: -1, phrase: "thereto",  definition: "To that; in addition to that." },
  { chapterIndex: -1, phrase: "therewith",definition: "With that; at that moment." },
  { chapterIndex: -1, phrase: "thereout",  definition: "Out of it; from that." },
  { chapterIndex: -1, phrase: "ywis",     definition: "Certainly, truly. (An intensifier, not a proper name.)" },
  { chapterIndex: -1, phrase: "iwis",     definition: "Variant of *ywis*: certainly, truly." },

  // ── Intensifiers ────────────────────────────────────────────────────
  { chapterIndex: -1, phrase: "passing",  definition: "Exceedingly, surpassingly; 'passing wroth' = 'exceedingly angry'." },
  { chapterIndex: -1, phrase: "wonderly", definition: "Wondrously, exceedingly." },
  { chapterIndex: -1, phrase: "marvellously",definition: "To a marvellous degree; extremely." },
  { chapterIndex: -1, phrase: "sore",     definition: "(Adv.) grievously, severely; 'sore wounded'. Not the modern adjective sense." },
  { chapterIndex: -1, phrase: "fain",     definition: "Gladly, willingly; 'I would fain see him' = 'I would gladly see him'." },
  { chapterIndex: -1, phrase: "right",    definition: "(Adv.) very, extremely; 'right well', 'right sorry'. Not the direction." },

  // ── Court / household / retinue ─────────────────────────────────────
  { chapterIndex: -1, phrase: "varlet",   definition: "A young attendant or servant; not pejorative in Malory — a role, not an insult." },
  { chapterIndex: -1, phrase: "meinie",   definition: "A knight's household, retinue, armed following. (Also *meyny*, *menye*.)" },
  { chapterIndex: -1, phrase: "fellowship",definition: "A band of knights under shared vow; Malory's word for what later romance calls an *order*." },
  { chapterIndex: -1, phrase: "damosel",  definition: "A young unmarried noblewoman; the chivalric standard form." },
  { chapterIndex: -1, phrase: "churl",    definition: "A peasant; someone of low birth; often dismissive." },
  { chapterIndex: -1, phrase: "wight",    definition: "Person, being; gender-neutral archaic noun." },
  { chapterIndex: -1, phrase: "wights",   definition: "Persons, beings (plural of *wight*)." },

  // ── Weaponry / armour / combat ──────────────────────────────────────
  { chapterIndex: -1, phrase: "sithen",   definition: "After that, subsequently; often marks a sequel event." },
  { chapterIndex: -1, phrase: "buckler",  definition: "A small round shield held by a central grip, for parrying." },
  { chapterIndex: -1, phrase: "glaive",   definition: "A lance or long sword; Malory uses it loosely for either." },
  { chapterIndex: -1, phrase: "truncheon",definition: "The shaft of a broken lance." },
  { chapterIndex: -1, phrase: "habergeon",definition: "A short mail shirt covering neck and shoulders." },
  { chapterIndex: -1, phrase: "hauberk",  definition: "A long mail shirt reaching to the knee." },
  { chapterIndex: -1, phrase: "gorget",   definition: "Armour covering the throat." },
  { chapterIndex: -1, phrase: "arsoun",   definition: "Saddle-bow." },
  { chapterIndex: -1, phrase: "pavilion", definition: "A large free-standing tent, typical of tournament encampments." },
  { chapterIndex: -1, phrase: "pight",    definition: "Pitched (as a tent or camp); past tense of *pitch*." },
  { chapterIndex: -1, phrase: "unhorsed", definition: "Knocked off his horse; standard outcome of a successful joust." },
  { chapterIndex: -1, phrase: "smote",    definition: "Struck (past tense of *smite*)." },
  { chapterIndex: -1, phrase: "rive",     definition: "Split, cleave; 'rived him to the teeth' (a Malory-wound formula)." },

  // ── Travel / place ──────────────────────────────────────────────────
  { chapterIndex: -1, phrase: "marish",   definition: "Marsh, swamp." },
  { chapterIndex: -1, phrase: "fordone",  definition: "Exhausted, overcome; 'sore fordone' = 'utterly spent'." },
  { chapterIndex: -1, phrase: "waxen",    definition: "Grown (past participle of *wax*); 'waxen old'." },
  { chapterIndex: -1, phrase: "wroken",   definition: "Avenged; past participle of *wreak*." },
  { chapterIndex: -1, phrase: "jeopardy", definition: "Risk, peril; a neutral word in Malory, not the modern legal term." },
  { chapterIndex: -1, phrase: "adventure", definition: "A quest-event; Malory's technical term for a divinely-sent trial of a knight." },
  { chapterIndex: -1, phrase: "betook",   definition: "Committed, entrusted; 'he betook him to God'." },

  // ── Transactional / speech verbs ────────────────────────────────────
  { chapterIndex: -1, phrase: "quoth",    definition: "Said; inverted past tense used only with the subject following ('quoth he')." },
  { chapterIndex: -1, phrase: "bade",     definition: "Commanded, asked; past tense of *bid*." },
  { chapterIndex: -1, phrase: "shrift",   definition: "Confession to a priest." },
  { chapterIndex: -1, phrase: "shrove",   definition: "Confessed (past tense of *shrive*)." },

  // ── Miscellaneous high-frequency adverbs / phrasings ────────────────
  { chapterIndex: -1, phrase: "bootless", definition: "Useless, pointless; 'bootless to contend' = 'pointless to fight'." },
  { chapterIndex: -1, phrase: "forthwith",definition: "Immediately, at once." },
  { chapterIndex: -1, phrase: "perforce", definition: "By force; by necessity." },
  { chapterIndex: -1, phrase: "perchance",definition: "By chance, perhaps." },
  { chapterIndex: -1, phrase: "certes",   definition: "Certainly, for sure." },
  { chapterIndex: -1, phrase: "gramercy", definition: "Thank you (from Old French *grand merci*)." },
  { chapterIndex: -1, phrase: "mickle",   definition: "Much, great; 'mickle worship' = 'great honour'." },
  { chapterIndex: -1, phrase: "much",     definition: "In Malory often used as 'great' (of a person): 'a much knight' = 'a great knight'." },
  { chapterIndex: -1, phrase: "siker",    definition: "Sure, certain (from Old English *sicor*, kin to German *sicher*)." },
  { chapterIndex: -1, phrase: "or ever",  definition: "Before ever; 'or ever he wist' = 'before he knew'." },
  { chapterIndex: -1, phrase: "ere",      definition: "Before (in time); 'ere long' = 'soon'." },
  { chapterIndex: -1, phrase: "erst",     definition: "Formerly, previously; 'as erst' = 'as before'." },
  { chapterIndex: -1, phrase: "albeit",   definition: "Although; 'albeit that he was hurt'." },
  { chapterIndex: -1, phrase: "natheless",definition: "Nevertheless; variant of *nonetheless*." },

  // ── Love / fortune / fate ───────────────────────────────────────────
  { chapterIndex: -1, phrase: "adventurous", definition: "Subject to fortune; ready to venture; 'the Siege Adventurous' = 'the seat reserved by destiny'." },
  { chapterIndex: -1, phrase: "enamoured", definition: "In love; 'sore enamoured of her' = 'deeply in love with her'." },
  { chapterIndex: -1, phrase: "despite",  definition: "Insult, scorn; 'to her great despite' = 'to her great injury'." },
  { chapterIndex: -1, phrase: "behight",  definition: "Promised; past tense of *behote*." },

  // ── Body / wounds / death ───────────────────────────────────────────
  { chapterIndex: -1, phrase: "brast",    definition: "Burst, broke (past tense of *burst*); 'his heart brast'." },
  { chapterIndex: -1, phrase: "weltered", definition: "Rolled about (as in blood); 'weltered in his gore'." },
  { chapterIndex: -1, phrase: "swelt",    definition: "Died; lost consciousness; from Old English *sweltan*." },
  { chapterIndex: -1, phrase: "grievous", definition: "Heavy, severe; 'a grievous wound' = 'a severe wound'. Less emotional than the modern sense." },
  { chapterIndex: -1, phrase: "woodness", definition: "Madness, frenzy." },
  { chapterIndex: -1, phrase: "wood",     definition: "(Adj.) mad, frenzied; 'he went wood' = 'he went mad'. Not the tree." },

  // ── Tournament / court procedure ────────────────────────────────────
  { chapterIndex: -1, phrase: "jousts",   definition: "Single combats on horseback with lance; the individual bouts of a tournament." },
  { chapterIndex: -1, phrase: "à outrance", definition: "To the uttermost; tournament combat fought without quarter, often to the death. (From French.)" },
  { chapterIndex: -1, phrase: "quartered", definition: "Divided into four; of heraldic arms." },
  { chapterIndex: -1, phrase: "bourdon",  definition: "A pilgrim's staff — or a lance's thick shaft." },

  // ── Grail / liturgical ──────────────────────────────────────────────
  { chapterIndex: -1, phrase: "sankgreal", definition: "The Holy Grail (Malory's spelling of *saint grail*)." },
  { chapterIndex: -1, phrase: "sangreal",  definition: "Variant spelling of *Sankgreal* — the Holy Grail." },
  { chapterIndex: -1, phrase: "siege perilous", definition: "The empty seat at the Round Table reserved by Merlin for the knight who would achieve the Grail." },
  { chapterIndex: -1, phrase: "hermitage", definition: "A solitary dwelling of a religious recluse, often beside a chapel in a forest." },
  { chapterIndex: -1, phrase: "abased",   definition: "Brought low; made to kneel." },
] as const

export function getLeMorteDarthurGlossesForChapter(
  chapterIndex: number,
): MaloryGloss[] {
  return LE_MORTE_DARTHUR_GLOSSES.filter(
    (g) => g.chapterIndex === chapterIndex || g.chapterIndex === -1,
  )
}
