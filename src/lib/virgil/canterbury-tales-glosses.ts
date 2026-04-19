/**
 * Canterbury Tales glosses — single-sentence tap-to-reveal definitions for
 * Chaucer's Middle English (Standard Ebooks David Laing Purves edition,
 * 1870/2021). Follows the Paradise Lost / Aeneid / Commedia pattern:
 *
 *   - Annotations argue about meaning (paragraph, in a drawer).
 *   - Glosses identify (one sentence, on hover/tap).
 *
 * CANTERBURY-SPECIFIC NOTES
 *
 * - Middle English gloss density is unique in the catalog. The prompt
 *   target is 400–600 entries; this file is the starter tranche —
 *   prioritizing (a) cross-chapter ME vocabulary that repeats throughout
 *   the work, (b) the General Prologue (densest pedagogical coverage),
 *   and (c) the load-bearing tales (Knight, Miller, Wife of Bath, Clerk,
 *   Pardoner, Prioress, Nun's Priest, Retractions). Later passes fill in
 *   the interior tales.
 *
 * - Phrase-matching must match the exact diacritical forms in the Purves
 *   text. Words like `sunnë`, `swoot`, `croppës`, `áventure` preserve the
 *   diacritics that mark the syllabic pronunciation of final -e and
 *   stressed vowels in Chaucer's metre. DO NOT use modernized forms.
 *
 * - Purves's edition already includes its own endnote-based scholarly
 *   apparatus (numeric footnotes). Our glosses do NOT duplicate those —
 *   they cover words Purves leaves for the reader to puzzle through.
 *
 * - False friends are the most important category: words that survive but
 *   with shifted sense (nice = foolish; silly = blessed; queynte = strange
 *   with a bawdy pun; corage = heart, desire). A reader who skips these
 *   thinks they understood and gets the scene backwards.
 *
 * - What we do NOT gloss: words whose modern form is transparent from
 *   context after twenty lines (hir = her, hem = them, swich = such,
 *   oon = one, whan = when, doth, hath, wilt). The ear adjusts; repeated
 *   glossing on these becomes noise.
 *
 * - FACING-GLOSS UI NOTE: this file is read by both the legacy dotted-
 *   underline gloss renderer and (when shipped) the Chaucer-specific
 *   FacingGlossBlock two-column layout. The data shape is stable across
 *   both.
 */

export interface CanterburyTalesGloss {
  /** Zero-indexed chapter (ch-0 = General Prologue). -1 = cross-chapter. */
  chapterIndex: number
  /** Exact substring to match against the chapter HTML. Diacritics required. */
  phrase: string
  /** One-sentence definition shown on hover / in the facing column. */
  definition: string
}

export const CANTERBURY_TALES_GLOSSES: CanterburyTalesGloss[] = [

  // ─────────────────────────────────────────────────────────────────────
  // CROSS-CHAPTER: Middle English high-frequency vocabulary
  // These words recur throughout the work. Glossing them once (first
  // occurrence) is the reader-kind thing to do. The facing-gloss UI will
  // de-duplicate within a tale but surface the first occurrence.
  // ─────────────────────────────────────────────────────────────────────

  // -- Function words with shifted meaning --
  { chapterIndex: -1, phrase: "eke",
    definition: "Also, in addition — Middle English *eek* / *eke*. A conjunction Chaucer uses constantly." },
  { chapterIndex: -1, phrase: "ere",
    definition: "Before — as in 'ere that I farther in this tale pace,' before I go any further." },
  { chapterIndex: -1, phrase: "sooth",
    definition: "Truth; as an adverb, 'truly.' Survives in 'soothsayer' (truth-teller) and 'forsooth.'" },
  { chapterIndex: -1, phrase: "soothly",
    definition: "Truly, in truth — from *sooth* (truth). Not 'softly.'" },
  { chapterIndex: -1, phrase: "sickerly",
    definition: "Certainly, assuredly — from *siker* (sure). Not related to modern 'sick.'" },
  { chapterIndex: -1, phrase: "natheless",
    definition: "Nevertheless, nonetheless — *nathe-less*, the same word modernized." },
  { chapterIndex: -1, phrase: "certes",
    definition: "Certainly — from Old French *certes*. Chaucer's formal equivalent of 'sickerly.'" },
  { chapterIndex: -1, phrase: "y-fall",
    definition: "Fallen together; the *y-* prefix marks past participle (Old English *ge-*), preserved in Chaucer's verse." },
  { chapterIndex: -1, phrase: "y-taught",
    definition: "Taught; the *y-* is a past-participle prefix preserved from Old English *ge-*." },
  { chapterIndex: -1, phrase: "y-clad",
    definition: "Clad, clothed — the *y-* prefix marks the past participle." },
  { chapterIndex: -1, phrase: "y-pinched",
    definition: "Pinched, pleated — the *y-* prefix marks past participle; here describing the neat folds of the Prioress's wimple." },
  { chapterIndex: -1, phrase: "y-been",
    definition: "Been; *y-* is the Middle English past-participle marker preserved from Old English *ge-*." },
  { chapterIndex: -1, phrase: "y-run",
    definition: "Run (past participle); *y-* marks the past participle, from Old English *ge-*." },
  { chapterIndex: -1, phrase: "wend",
    definition: "Go, travel — past tense *went* has survived and replaced *go*'s past tense in standard English." },
  { chapterIndex: -1, phrase: "wenden",
    definition: "To go, to make one's way — survives today only in the past tense *went*." },
  { chapterIndex: -1, phrase: "holpen",
    definition: "Helped — the Middle English strong past participle of *help*; modernized to regular *helped* after Chaucer." },
  { chapterIndex: -1, phrase: "pricketh",
    definition: "Spurs, urges — *pricken* meant to ride hard (from the spurs). A knight 'prickinge' is a knight at speed." },
  { chapterIndex: -1, phrase: "trowe",
    definition: "Believe, think — Middle English *trowen*; survives only in fossilized 'I trow.'" },
  { chapterIndex: -1, phrase: "weneth",
    definition: "Thinks, supposes — Middle English *wenen*, no modern descendant. 'He weneth' = he supposes." },
  { chapterIndex: -1, phrase: "nolde",
    definition: "Would not — contraction of *ne wolde*; the negative marker *ne* prefixed to *wolde*." },
  { chapterIndex: -1, phrase: "nyste",
    definition: "Did not know — contraction of *ne wyste* (not knew); the fossil negative prefix *ne-* attached to *wist*." },
  { chapterIndex: -1, phrase: "gan",
    definition: "Began; in Chaucer's verse often a simple tense-marker — 'gan speak' = spoke." },
  { chapterIndex: -1, phrase: "hent",
    definition: "Get, seize, obtain — 'what he might of his friendes hent' = whatever he could get from his friends." },
  { chapterIndex: -1, phrase: "lest",
    definition: "Pleasure, desire — 'in courtesy was set full much her lest' = she set much of her pleasure in courtesy. Unrelated to modern 'lest.'" },
  { chapterIndex: -1, phrase: "fetis",
    definition: "Neat, elegant, well-made — from Old French *faitis*. The Prioress's cloak is *full fetis*." },
  { chapterIndex: -1, phrase: "digne",
    definition: "Worthy, dignified — from Latin *dignus*. The same root gives modern 'dignity,' 'indignation,' 'disdain.'" },
  { chapterIndex: -1, phrase: "wight",
    definition: "Person, creature, being — Middle English *wiht*. Survives in 'unwitting' and the Isle of Wight's very different etymology." },
  { chapterIndex: -1, phrase: "lever",
    definition: "Rather, more willingly — 'he had lever' = he would rather. From *leof* (dear, willing); not the lifting tool." },
  { chapterIndex: -1, phrase: "chees",
    definition: "Chose — the Middle English past tense of *choose*, before it regularized to *chose*." },

  // -- False friends (most important category) --
  { chapterIndex: -1, phrase: "corage",
    definition: "Heart, inclination, desire — Middle English *corage* (heart, from French *coeur*), not modern 'courage' as in bravery." },
  { chapterIndex: -1, phrase: "coráges",
    definition: "Hearts, inclinations — the diacritic marks the stressed final syllable; not plural of modern 'courage.'" },
  { chapterIndex: -1, phrase: "queynte",
    definition: "Strange, elaborate, curious — from Latin *cognitus*. Chaucer also exploits a bawdy pun on the word (female anatomy) in the Miller's and Wife of Bath's passages." },
  { chapterIndex: -1, phrase: "silly",
    definition: "Blessed, innocent, pitiable — Middle English *seely*. The modern pejorative sense 'foolish' is a late drift." },
  { chapterIndex: -1, phrase: "nice",
    definition: "Foolish, silly, wanton — the Middle English sense is the opposite of the modern one; from Latin *nescius*, ignorant." },
  { chapterIndex: -1, phrase: "gentil",
    definition: "Of gentle birth, noble — a social term, not a temperamental one. A 'gentil knight' is an aristocratic knight; the modern sense 'gentle' is a derivation." },
  { chapterIndex: -1, phrase: "worthy",
    definition: "Of high social station, distinguished — less 'morally deserving' than 'socially prominent.' Chaucer's ironies often hinge on this." },
  { chapterIndex: -1, phrase: "subtil",
    definition: "Skillful, crafty, intricate — from Latin *subtilis*. The pejorative modern 'sneaky' sense comes from Chaucer's ironic deployments of the word." },
  { chapterIndex: -1, phrase: "villainy",
    definition: "Churlish or low-class behavior — from *villein* (peasant). Closer to 'vulgarity' than to modern 'evil.'" },
  { chapterIndex: -1, phrase: "meat",
    definition: "Food in general (not specifically flesh) — Old English *mete*. 'At meat' means 'at the meal.'" },
  { chapterIndex: -1, phrase: "meatë",
    definition: "Food, meal — the diacritic marks pronounced final -e; refers to the meal in general, not specifically flesh." },
  { chapterIndex: -1, phrase: "courtesy",
    definition: "The whole code of aristocratic conduct — manners, speech, generosity, restraint. A structurally larger word for Chaucer than for us." },
  { chapterIndex: -1, phrase: "pitous",
    definition: "Compassionate, apt to feel pity — not 'pitiful' in the modern diminished sense." },
  { chapterIndex: -1, phrase: "disport",
    definition: "Merriment, cheerful manner — the *disport* of the Prioress is her pleasant bearing, not 'misconduct.'" },
  { chapterIndex: -1, phrase: "port",
    definition: "Bearing, demeanor — from Old French *porter* (to carry). 'Amiable of port' = pleasant in bearing." },
  { chapterIndex: -1, phrase: "sentence",
    definition: "Meaning, judgement, the 'sense' or moral of a saying — from Latin *sententia*. Not a grammatical unit in Chaucer." },
  { chapterIndex: -1, phrase: "senténce",
    definition: "Meaning, moral sense, weighty judgement — from Latin *sententia*; the Clerk's speech is 'full of high senténce.'" },

  // -- Honorifics and forms of address --
  { chapterIndex: -1, phrase: "dame",
    definition: "Lady, woman of standing — a title; the Wife of Bath is 'Dame Alys.'" },
  { chapterIndex: -1, phrase: "sir",
    definition: "In Chaucer, used both of knights and of priests ('Sir Priest'). A social rank title, not only martial." },
  { chapterIndex: -1, phrase: "dan",
    definition: "Lord, master — a form of address for monks and scholars (from *dominus* via Old French *dan*). 'Dan Russel' is a fox in the Nun's Priest's Tale." },

  // -- The pilgrimage and its terms --
  { chapterIndex: -1, phrase: "palmers",
    definition: "Pilgrims who have been to the Holy Land — named for the palm branch they carried back as a token." },
  { chapterIndex: -1, phrase: "hallows",
    definition: "Holy places, shrines — from Old English *halig* (holy). 'Ferne hallows couth' = distant shrines known." },
  { chapterIndex: -1, phrase: "couth",
    definition: "Known, famous — past participle of *connen* (to know). Modern 'couth' is a back-formation from 'uncouth.'" },
  { chapterIndex: -1, phrase: "holy blissful Martyr",
    definition: "Thomas Becket, Archbishop of Canterbury, murdered in the cathedral on 29 December 1170 — the pilgrims' destination." },
  { chapterIndex: -1, phrase: "Southwark",
    definition: "The borough on the south bank of the Thames, opposite the City of London — starting point of the pilgrimage road to Canterbury." },
  { chapterIndex: -1, phrase: "Tabard",
    definition: "An actual inn in Southwark, on the Canterbury pilgrimage route; the pilgrims gather here to begin." },
  { chapterIndex: -1, phrase: "Canterbury",
    definition: "The cathedral city in Kent, shrine of St. Thomas Becket — the pilgrimage's destination, about sixty miles southeast of London." },
  { chapterIndex: -1, phrase: "áventure",
    definition: "Chance, fortune — from Old French *aventure*. 'By áventure' = by chance, by happenstance." },

  // -- Other repeated terms --
  { chapterIndex: -1, phrase: "quite",
    definition: "Repay, requite, top — the Miller promises to 'quite' the Knight's tale (answer it, outdo it); the Reeve then quits the Miller." },
  { chapterIndex: -1, phrase: "cleped",
    definition: "Called, named — past tense of *clepen* (to call). 'The knight was cleped X' = the knight was named X." },
  { chapterIndex: -1, phrase: "hight",
    definition: "Is called, named — from Old English *hatte*. 'She hight X' = her name is X." },
  { chapterIndex: -1, phrase: "eyen",
    definition: "Eyes — the Middle English plural before regularization to 'eyes'; a strong plural in -n, like oxen, children." },
  { chapterIndex: -1, phrase: "kirtle",
    definition: "A tunic or dress worn by both men and women — the standard outer garment of the period." },
  { chapterIndex: -1, phrase: "swive",
    definition: "To have sexual intercourse with — a direct, non-euphemistic Middle English term Chaucer deploys in the fabliaux." },

  // ─────────────────────────────────────────────────────────────────────
  // GENERAL PROLOGUE (ch-0) — dense coverage of the opening 18 lines and
  // the most distinctive lexical points in the 22 portraits.
  // ─────────────────────────────────────────────────────────────────────

  // -- The opening spring passage --
  { chapterIndex: 0, phrase: "Aprilis",
    definition: "April — Purves's regularized form of Chaucer's 'Aprille.' The pilgrimage begins in the spring of the liturgical year." },
  { chapterIndex: 0, phrase: "swoot",
    definition: "Sweet — Middle English *swoot*. 'Showers swoot' = sweet showers, the rains of April." },
  { chapterIndex: 0, phrase: "licóur",
    definition: "Liquid, moisture — from Latin *liquor*. The diacritic marks the stressed syllable in Chaucer's metre." },
  { chapterIndex: 0, phrase: "virtúe",
    definition: "Power, efficacy — the life-producing power of rain, not the moral sense. From Latin *virtus*." },
  { chapterIndex: 0, phrase: "Zephyrus",
    definition: "The West Wind, personified in classical myth as the gentle bringer of spring — breath of rebirth, literary heritage from Virgil and the *Roman de la Rose*." },
  { chapterIndex: 0, phrase: "swootë",
    definition: "Sweet — the diacritic marks pronounced final -e, making the word two syllables for the metre." },
  { chapterIndex: 0, phrase: "holt",
    definition: "Wooded hill, grove — Old English *holt*. Paired with 'heath' (open country) for the whole countryside." },
  { chapterIndex: 0, phrase: "croppës",
    definition: "Shoots, young growths at the top of plants — from *crop* (top). Two syllables here by the diacritic." },
  { chapterIndex: 0, phrase: "Ram",
    definition: "Aries, the first sign of the zodiac — the sun runs its 'half course' through Aries in April." },
  { chapterIndex: 0, phrase: "smallë fowlës",
    definition: "Small birds — *fowl* meant 'bird' generally in Middle English before narrowing to poultry." },
  { chapterIndex: 0, phrase: "longë folk",
    definition: "People long (to go) — *longe* is the verb, not the adjective. People yearn to go on pilgrimage." },
  { chapterIndex: 0, phrase: "fernë",
    definition: "Distant, far — Middle English *fern* (far); compare modern 'far.' Distant holy places." },

  // -- The Tabard frame --
  { chapterIndex: 0, phrase: "hostelry",
    definition: "An inn for travelers — Middle English *hostelrie*. The Tabard itself." },
  { chapterIndex: 0, phrase: "nine and twenty",
    definition: "Twenty-nine — Chaucer's company, although in fact he describes somewhat more characters once the Canon's Yeoman and Chaucer himself are counted." },
  { chapterIndex: 0, phrase: "were of sundry folk",
    definition: "Were of various kinds of people — *sundry* retained a full 'various / diverse' sense in Middle English before narrowing in modern use." },
  { chapterIndex: 0, phrase: "forword",
    definition: "Agreement, promise — Middle English *forward* / *foreword* (pact, stipulation). Not the modern 'forward' of motion." },
  { chapterIndex: 0, phrase: "devise",
    definition: "Relate, describe — from Old French *deviser*. 'As I you devise' = as I am telling you." },

  // -- Portraits: Knight --
  { chapterIndex: 0, phrase: "chivalry",
    definition: "The whole code and practice of knightly conduct — military, social, religious. A weighty structural term, not a synonym for politeness." },
  { chapterIndex: 0, phrase: "Alexandria",
    definition: "City in Egypt captured briefly by a crusading army in 1365 — one of the Knight's campaigns, a real recent engagement." },
  { chapterIndex: 0, phrase: "Pruce",
    definition: "Prussia — the Baltic region where the Teutonic Knights fought crusading campaigns against pagan Lithuania in the 14th century." },
  { chapterIndex: 0, phrase: "verray, parfit, gentil knight",
    definition: "A true, perfect, noble knight — the Knight's signature line. *Verray* = true (French *vrai*); *parfit* = perfect; *gentil* = noble by birth." },

  // -- Portraits: Squire --
  { chapterIndex: 0, phrase: "bachelor",
    definition: "A young knight or candidate for knighthood — not 'unmarried man' in the modern narrow sense. From the Old French *bacheler*, a young man in military service." },
  { chapterIndex: 0, phrase: "crulle",
    definition: "Curly — the Squire's hair. Middle English *crul*, surviving only in 'curly.'" },

  // -- Portraits: Prioress --
  { chapterIndex: 0, phrase: "Stratford attë Bow",
    definition: "A Benedictine nunnery on the outskirts of London — the Prioress learned her French there, and Chaucer's amused annotation is that it is emphatically not the French of Paris." },
  { chapterIndex: 0, phrase: "wimple",
    definition: "The cloth head-covering worn by nuns, married women, and widows — folded around head and neck." },
  { chapterIndex: 0, phrase: "tretis",
    definition: "Well-shaped, shapely — from Old French *traitis*. Describing the Prioress's nose, which should not be so specifically described." },
  { chapterIndex: 0, phrase: "wastel bread",
    definition: "Fine white bread made from the best flour — expensive, the kind one does not normally feed to dogs. The Prioress feeds it to hers." },
  { chapterIndex: 0, phrase: "Amor vincit omnia",
    definition: "Latin: 'Love conquers all' — from Virgil, *Eclogues* X.69. Engraved on the Prioress's brooch; the ambiguity is whether 'love' means divine or romantic, and whether she knows the difference." },

  // -- Portraits: Monk --
  { chapterIndex: 0, phrase: "venery",
    definition: "Hunting — from Latin *venari* (to hunt). The Monk's preferred sport; the pun with the other sense (sexual pursuit) is probably not accidental." },
  { chapterIndex: 0, phrase: "oyster",
    definition: "The Monk's estimation of the regulatory rule that says he should not hunt — not worth an oyster. Proverbial expression of contempt." },

  // -- Portraits: Friar --
  { chapterIndex: 0, phrase: "limiter",
    definition: "A friar licensed to beg within a specific geographical 'limit' — the Friar's professional role, and the source of the opportunities for corruption his portrait catalogues." },
  { chapterIndex: 0, phrase: "In principio",
    definition: "Latin: 'In the beginning' — the opening of John's Gospel, which the Friar could quote 'so plesaunt' to extract alms from widows. Professional charm." },

  // -- Portraits: Clerk --
  { chapterIndex: 0, phrase: "Oxenford",
    definition: "Oxford — Middle English form, preserved in compounds. The Clerk is a poor student there." },
  { chapterIndex: 0, phrase: "Aristotle",
    definition: "The Greek philosopher (384–322 BC); 'Aristotle and his philosophy' meant the whole curriculum of scholastic learning — logic, ethics, natural science." },
  { chapterIndex: 0, phrase: "scholay",
    definition: "Study, pursue learning — Middle English verb from *scholar*. 'That gave him wherewith to scholay' = who supported his studies." },

  // -- Portraits: Man of Law --
  { chapterIndex: 0, phrase: "Parvis",
    definition: "The porch of St. Paul's in London — where lawyers met clients. 'Often had y-been at the Parvis' = he was an established practising lawyer." },
  { chapterIndex: 0, phrase: "fee simple",
    definition: "Absolute hereditary ownership of land — the highest form of land tenure in English law. The Man of Law was uncommonly good at getting it." },

  // -- Portraits: Wife of Bath --
  { chapterIndex: 0, phrase: "Ypres",
    definition: "A Flemish city famous for cloth-making; the Wife of Bath's cloth-weaving outdid even Ypres' product." },
  { chapterIndex: 0, phrase: "Gaunt",
    definition: "Ghent — another major Flemish cloth-making city, frequently Anglicized 'Gaunt' (as in John of Gaunt)." },
  { chapterIndex: 0, phrase: "coverchief",
    definition: "A head-covering, a kerchief — the Wife's elaborate cloths weighed ten pounds by Chaucer's hyperbole." },
  { chapterIndex: 0, phrase: "Compostella",
    definition: "Santiago de Compostela in Galicia, Spain — the great medieval pilgrimage shrine of St. James. The Wife has been." },
  { chapterIndex: 0, phrase: "Coloigne",
    definition: "Cologne — the Rhineland city famous for the shrine of the Three Magi. Another of the Wife's pilgrimages." },
  { chapterIndex: 0, phrase: "gat-toothed",
    definition: "Gap-toothed — the Wife has a gap between her front teeth, which medieval lore associated with amorousness and wandering." },

  // -- Portraits: Parson --
  { chapterIndex: 0, phrase: "lered",
    definition: "Learned — 'lered and lewd' = learned and unlearned, educated and common people. The Parson preaches to both." },
  { chapterIndex: 0, phrase: "lewd",
    definition: "Unlearned, lay — in Middle English a neutral social classifier (non-clerical, uneducated), not the modern sexual-morality sense." },

  // -- Portraits: Miller --
  { chapterIndex: 0, phrase: "thombe of gold",
    definition: "A miller's 'thumb of gold' — an ironic proverb; millers were traditionally cheats, skimming flour by pressing down their thumb on the scales. The proverbial gold thumb measures how much they stole." },

  // -- Portraits: Pardoner --
  { chapterIndex: 0, phrase: "geldyng or a mare",
    definition: "A gelded male or a mare — Chaucer's coded suggestion about the Pardoner's sexuality or gender, a line that has generated vast modern critical commentary." },
  { chapterIndex: 0, phrase: "vernicle",
    definition: "A small badge depicting the Veronica — the cloth that wiped Christ's face and retained its image. A souvenir from Rome." },

  // -- Portraits: Summoner --
  { chapterIndex: 0, phrase: "visage",
    definition: "Face — from Old French *visage*. The Summoner's face is the subject of his portrait's catalogue of skin diseases." },
  { chapterIndex: 0, phrase: "Questio quid juris",
    definition: "Latin: 'The question is, what is the law' — the only Latin tag the drunken Summoner knows; he repeats it as his entire Latin repertoire." },

  // -- The Host's proposal --
  { chapterIndex: 0, phrase: "cut",
    definition: "A straw, a lot — drawing 'cut' is drawing straws to determine who goes first. The Knight draws the shortest." },
  { chapterIndex: 0, phrase: "governance",
    definition: "Rule, authority — a loaded word throughout the work; who has *governance* over whom is the Wife of Bath's and the Franklin's central question in advance." },

  // ─────────────────────────────────────────────────────────────────────
  // KNIGHT'S TALE (ch-1) — starter glosses. Fuller coverage in Phase 2.
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 1, phrase: "Theseus",
    definition: "The legendary Duke of Athens — hero of Greek myth and (via Boccaccio's *Teseida*) the tale's authoritative figure. Also appears in Shakespeare's *A Midsummer Night's Dream*, drawn from this tale." },
  { chapterIndex: 1, phrase: "Thebes",
    definition: "The Greek city whose defeat by Theseus opens the tale; Palamon and Arcite are Theban royals captured in its fall." },
  { chapterIndex: 1, phrase: "Emily",
    definition: "Emelye in Chaucer; sister of Hippolyta, queen of the Amazons — both knights fall in love with her on sight from the prison tower." },
  { chapterIndex: 1, phrase: "Firste Moevere",
    definition: "The First Mover — Theseus's closing philosophical speech (adapted from Boethius) names God as the prime cause of the chain of being; the tale's ultimate consolation." },

  // ─────────────────────────────────────────────────────────────────────
  // MILLER'S TALE (ch-2) — fabliau; glosses for the bawdy mechanics.
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 2, phrase: "hende",
    definition: "Courteous, ready to hand, pleasant — the Miller's ironic epithet for the clerk Nicholas ('hende Nicholas'), as elegant as he is unscrupulous." },
  { chapterIndex: 2, phrase: "Absolon",
    definition: "The parish clerk who courts Alisoun by singing under her window — named for the handsome biblical Absalom, with deliberate comic irony." },
  { chapterIndex: 2, phrase: "Nowelis flood",
    definition: "Noah's flood — the credulous carpenter pronounces it 'Nowelis,' a Chaucerian joke about his uncertainty with biblical names." },

  // ─────────────────────────────────────────────────────────────────────
  // WIFE OF BATH (ch-6) — starter. Full coverage in Phase 2.
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 6, phrase: "experience",
    definition: "Personal, lived knowledge — the Wife's famous opening word, set against 'auctoritee' (authority of books). The Prologue's entire argument is the opposition of these two modes of knowing." },
  { chapterIndex: 6, phrase: "auctoritee",
    definition: "Authority, especially of written texts (scripture, fathers of the Church, Aristotle). The word Alisoun sets herself against with 'experience' in her opening line." },
  { chapterIndex: 6, phrase: "maistrie",
    definition: "Mastery, dominance, sovereignty — the key term of the Wife of Bath's argument. What she wants from her husbands, and what the loathly lady demands of the knight in her tale." },
  { chapterIndex: 6, phrase: "loathly lady",
    definition: "An ugly old woman who becomes beautiful once granted sovereignty — a folk-tale type Chaucer draws on (analogues in Gower and in the Arthurian *Wedding of Sir Gawain*)." },

  // ─────────────────────────────────────────────────────────────────────
  // CLERK'S TALE (ch-9) — Griselda. Load-bearing for the Decameron link.
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 9, phrase: "Griseldis",
    definition: "Griselda, the patient peasant bride tested by her husband Walter. Chaucer's source is Petrarch's Latin translation of Boccaccio's *Decameron* X.10 — the catalog's direct Italian-English cross-reference." },
  { chapterIndex: 9, phrase: "Petrark",
    definition: "Francesco Petrarca (1304–1374), Italian humanist poet. The Clerk cites him as his direct source; Petrarch's Latin *Historia Griseldis* is a 1373 translation of Boccaccio's *Decameron* X.10." },
  { chapterIndex: 9, phrase: "Saluces",
    definition: "Saluzzo, a real marquisate in Piedmont — the setting of Griselda's tale. Chaucer preserves the Italian geographic frame from his source." },
  { chapterIndex: 9, phrase: "Lenvoy",
    definition: "Envoy — a short concluding address at the end of a poem. Chaucer's 'Lenvoy de Chaucer' at the close of the Clerk's Tale ironically undercuts the patient-wife exemplum the tale has just offered." },

  // ─────────────────────────────────────────────────────────────────────
  // PARDONER'S TALE (ch-14) — sermon-tale. Starter.
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 14, phrase: "Radix malorum est cupiditas",
    definition: "Latin: 'The root of evils is greed' — 1 Timothy 6:10. The Pardoner's preaching text, and the theme of the tale he tells." },
  { chapterIndex: 14, phrase: "rioters",
    definition: "Wild young men, revellers — the three who swear brotherhood to slay Death and find him in a hoard of gold. The Pardoner's central cautionary trio." },

  // ─────────────────────────────────────────────────────────────────────
  // PRIORESS'S TALE (ch-16) — flagged content; gloss with honest context.
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 16, phrase: "Alma Redemptoris",
    definition: "Latin: 'Kind Mother of the Redeemer' — an 11th-century Marian antiphon. The schoolboy's song in the tale; its continuation after his murder is the tale's central miracle. See the editorial note on this tale's antisemitic frame." },
  { chapterIndex: 16, phrase: "Jewry",
    definition: "A Jewish quarter — a historically accurate feature of many medieval cities. This tale participates in the medieval blood-libel tradition; see the editorial note." },

  // ─────────────────────────────────────────────────────────────────────
  // SIR THOPAS (ch-17) — tail-rhyme parody. Glosses point at the parody.
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 17, phrase: "Flanders",
    definition: "The Low Countries — in this parody, Chaucer gives the 'heroic' Sir Thopas an emphatically un-heroic provenance (a merchant's region, not a knight's)." },
  { chapterIndex: 17, phrase: "Popering",
    definition: "Poperinghe, a town in Flanders — a deliberately unromantic birthplace for the parody-hero Sir Thopas, known for hops and beer rather than chivalry." },

  // ─────────────────────────────────────────────────────────────────────
  // NUN'S PRIEST'S TALE (ch-20) — mock-epic. Starter.
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 20, phrase: "Chanticleer",
    definition: "The rooster hero of the mock-epic — from Old French *chanter cler* (sing clearly). A literary descendant of the Reynard cycle's Chantecler." },
  { chapterIndex: 20, phrase: "Pertelote",
    definition: "The favored hen among Chanticleer's seven wives — from the Reynard fox-and-chicken tradition." },
  { chapterIndex: 20, phrase: "Russel",
    definition: "The name given here to the fox who seizes Chanticleer — 'Dan Russel' by title, 'Russel' his name. The trickster villain." },
  { chapterIndex: 20, phrase: "Gaufred",
    definition: "Geoffrey of Vinsauf (c. 1200), a medieval rhetorician whose lament on the death of King Richard I is here mock-epically invoked to lament the capture of a chicken." },

  // ─────────────────────────────────────────────────────────────────────
  // PARSON'S TALE / RETRACTIONS (ch-24)
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 24, phrase: "Deadly Sins",
    definition: "The traditional list of seven cardinal sins — Pride, Envy, Wrath, Sloth, Avarice, Gluttony, Lechery — organized by the Parson's prose sermon as the centerpiece of his treatise on penitence." },
  { chapterIndex: 24, phrase: "penitence",
    definition: "Penitence, repentance — the Parson's organizing theme. The medieval sacramental concept: contrition, confession, satisfaction." },
  { chapterIndex: 24, phrase: "translations",
    definition: "Translations — in his Retractions Chaucer disowns specifically his 'translations and enditings of worldly vanities' — the bawdy tales and secular poems. The editorial note discusses the complicated reception." },

  // ─────────────────────────────────────────────────────────────────────
  // KNIGHT'S TALE (ch-1) — expanded (classical machinery)
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 1, phrase: "Palamon",
    definition: "A Theban knight; one of the two cousin-prisoners in love with Emily, who prays to Venus and, after losing the tournament but winning the aftermath, marries her." },
  { chapterIndex: 1, phrase: "Arcite",
    definition: "The other Theban knight; the cousin of Palamon, who prays to Mars and wins the tournament but dies of his injuries before he can claim Emily." },
  { chapterIndex: 1, phrase: "Mars",
    definition: "The Roman god of war — one of the tale's three presiding deities. Arcite prays to him and wins the fight, but the granting is ambiguous." },
  { chapterIndex: 1, phrase: "Venus",
    definition: "The Roman goddess of love — Palamon's patron deity. Her granting proves, in the long run, the more effective of the three." },
  { chapterIndex: 1, phrase: "Diana",
    definition: "Roman goddess of chastity — Emily's own preferred deity; she prays to remain unmarried. Her granting, like the others, is partial." },
  { chapterIndex: 1, phrase: "Saturn",
    definition: "In medieval astrology the old cold planet, god of discord and misfortune — the figure who resolves the conflict between Mars and Venus by a means neither side had asked for (Arcite wins but dies)." },
  { chapterIndex: 1, phrase: "Boece",
    definition: "Boethius (c. 480–525), author of *De Consolatione Philosophiae* — the Latin philosophical consolation Chaucer himself translated into English, and the source of Theseus's closing speech on the First Mover." },
  { chapterIndex: 1, phrase: "tournament",
    definition: "A formal combat between two large parties of knights — here Theseus's elaborate staged battle that Arcite wins with a hundred picked knights against Palamon's." },

  // ─────────────────────────────────────────────────────────────────────
  // MILLER'S TALE (ch-2) — more fabliau vocabulary
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 2, phrase: "Alisoun",
    definition: "The young wife of the Oxford carpenter — eighteen years old, her husband nearly sixty; the tale's center of sexual gravity. A different Alisoun from the Wife of Bath." },
  { chapterIndex: 2, phrase: "John",
    definition: "The credulous carpenter and Alisoun's husband — the tale's fall guy, persuaded that a second Flood is imminent and left hanging in a tub." },
  { chapterIndex: 2, phrase: "Osney",
    definition: "A district north of Oxford — the Miller's unmistakable setting, a real-world anchor for a wildly farcical plot." },

  // ─────────────────────────────────────────────────────────────────────
  // WIFE OF BATH'S PROLOGUE AND TALE (ch-6) — expanded coverage
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 6, phrase: "Jankin",
    definition: "The Wife of Bath's fifth and favorite husband — a young Oxford clerk half her age, whose relentless quoting from the Book of Wicked Wives finally provokes her into the fight that leaves her partly deaf." },
  { chapterIndex: 6, phrase: "wicked wives",
    definition: "A hostile anthology Jankin reads aloud every night — real fourteenth-century patristic tracts against women (Jerome's *Adversus Jovinianum*, Theophrastus's *Golden Book*, Walter Map's *Valerius*). Chaucer knew them intimately and has Alisoun answer them one by one." },
  { chapterIndex: 6, phrase: "Ptholomee",
    definition: "Ptolemy (c. 90–168), the astronomer — Jankin cites his *Almagest* for proverbs hostile to women; Alisoun parries with her own quotations." },
  { chapterIndex: 6, phrase: "quoniam",
    definition: "Latin: 'whereas, because.' A euphemism for female anatomy — the Wife uses the Latin word as a learned pun, showing off her reading of the same clerical Latin that her husbands have tried to use against her." },
  { chapterIndex: 6, phrase: "Arthur",
    definition: "King Arthur — the tale's setting. Chaucer sets his Wife-of-Bath tale explicitly in the Arthurian past, not in his contemporary England, to mark its distance from the Prologue's autobiographical realism." },
  { chapterIndex: 6, phrase: "Dante",
    definition: "Dante Alighieri (1265–1321), the *Divine Comedy* — the loathly lady in the tale quotes a passage from *Purgatorio* VII on the true nobility of the soul. Chaucer cites Dante by name." },
  { chapterIndex: 6, phrase: "gentilesse",
    definition: "True nobility — the loathly lady's central argument to the knight: that nobility is a matter of the soul, not of birth. Borrowed from Dante's *Purgatorio* VII and *Convivio*." },

  // ─────────────────────────────────────────────────────────────────────
  // FRIAR'S TALE (ch-7)
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 7, phrase: "archdeacon",
    definition: "A senior ecclesiastical official with jurisdiction to try moral cases — the summoner's employer in this tale, whose office is Chaucer's setup for the satire." },

  // ─────────────────────────────────────────────────────────────────────
  // CLERK'S TALE (ch-9) — expanded Griselda coverage
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 9, phrase: "Walter",
    definition: "The Marquis of Saluzzo who tests Griselda's patience to the breaking point and beyond. Boccaccio's Gualtieri; Chaucer preserves the Italian name form." },
  { chapterIndex: 9, phrase: "Janicula",
    definition: "Griselda's peasant father — Chaucer preserves Boccaccio's name. His one scene is heartbreaking." },
  { chapterIndex: 9, phrase: "sergeant",
    definition: "Walter's cruel instrument — a serjeant of his household who pretends to carry Griselda's children to their deaths on Walter's orders. Boccaccio's figure; Chaucer makes him, if anything, colder." },
  { chapterIndex: 9, phrase: "Envoy",
    definition: "A short concluding address — here Chaucer's own *'Lenvoy de Chaucer'* that overturns the tale the Clerk has just told, urging modern wives not to imitate Griselda. One of the great Chaucerian tonal reversals." },
  { chapterIndex: 9, phrase: "cloth of gold",
    definition: "Woven gold cloth — the robe Walter provides to clothe Griselda as a new bride. The medieval reader would have registered the extravagance; the scene's power is in the contrast with her peasant smock." },

  // ─────────────────────────────────────────────────────────────────────
  // MERCHANT'S TALE (ch-10) — January-and-May
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 10, phrase: "January",
    definition: "The old knight of the tale — sixty years old, marries the young May. His name is the tale's allegorical cold season against May's spring." },
  { chapterIndex: 10, phrase: "May",
    definition: "The young wife — her name the tale's allegorical spring against January's age. The pear-tree scene is the fabliau climax." },
  { chapterIndex: 10, phrase: "Damian",
    definition: "January's squire — secretly the lover who waits up the pear tree for May to climb up and join him, in the tale's famous scene." },
  { chapterIndex: 10, phrase: "Pluto",
    definition: "God of the Underworld — here and with Proserpine, the mythological couple who witness and argue over the pear-tree scene, with Pluto magically restoring January's sight at the critical moment." },
  { chapterIndex: 10, phrase: "Proserpine",
    definition: "Pluto's queen, a goddess of the Underworld — in Chaucer's telling, the one who gives May the ready lie that persuades January not to trust his own eyes." },

  // ─────────────────────────────────────────────────────────────────────
  // FRANKLIN'S TALE (ch-12) — Breton lay
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 12, phrase: "Dorigen",
    definition: "The wife at the heart of the Franklin's tale — makes the rash promise about the black rocks, must be delivered from it by her husband's generosity." },
  { chapterIndex: 12, phrase: "Arveragus",
    definition: "The knight whose marriage with Dorigen is founded on mutual sovereignty — the Franklin's direct answer to the Wife of Bath's question about maistrie." },
  { chapterIndex: 12, phrase: "Aurelius",
    definition: "The squire who loves Dorigen — the third figure in the generosity-chain at the tale's end." },
  { chapterIndex: 12, phrase: "magician of Orleans",
    definition: "The clerk at Orleans who, by natural magic, removes the black rocks from the Breton coast — the tale's fourth generosity, when he remits his fee." },
  { chapterIndex: 12, phrase: "Breton lay",
    definition: "A short Breton-originated romance-form with magical elements — the genre the Franklin chooses for his tale. The tradition runs through Marie de France." },

  // ─────────────────────────────────────────────────────────────────────
  // PARDONER'S PROLOGUE AND TALE (ch-14) — expanded
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 14, phrase: "indulgence",
    definition: "A remission of the punishment due for sins already forgiven — the Pardoner sells them for money. The later Reformation will destroy the whole economic basis of the office the Pardoner inhabits." },
  { chapterIndex: 14, phrase: "relics",
    definition: "Physical remains or possessions of saints, venerated and believed to work miracles — the Pardoner carries fake ones (a shoulder-blade, a mitten) and charges for access." },
  { chapterIndex: 14, phrase: "Flanders",
    definition: "The Flemish Low Countries — where the Pardoner sets his tale of the three rioters. Traditional medieval shorthand for a rowdy drinking culture." },
  { chapterIndex: 14, phrase: "plague",
    definition: "The Black Death — the devastating mid-14th-century epidemic; the three rioters hear a bell ringing for a plague death and resolve to slay Death himself." },
  { chapterIndex: 14, phrase: "cupiditas",
    definition: "Latin: *greed, covetousness* — from the Pardoner's preaching text, 1 Timothy 6:10: *Radix malorum est cupiditas*, 'the root of evils is greed.'" },

  // ─────────────────────────────────────────────────────────────────────
  // SHIPMAN'S TALE (ch-15)
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 15, phrase: "Saint-Denis",
    definition: "A town near Paris, the tale's setting — a French location chosen deliberately for its cosmopolitan merchant-class milieu." },

  // ─────────────────────────────────────────────────────────────────────
  // PRIORESS'S TALE (ch-16) — expanded
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 16, phrase: "clergeon",
    definition: "A young chorister, a choir-boy — the tale's seven-year-old martyr." },
  { chapterIndex: 16, phrase: "Hugh of Lincoln",
    definition: "A real 13th-century boy (1246) whose murder in Lincoln was blamed on the local Jewish community in one of the most notorious historical blood libels — the Prioress invokes his cult at the end of her tale." },

  // ─────────────────────────────────────────────────────────────────────
  // NUN'S PRIEST'S TALE (ch-20) — expanded mock-epic
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 20, phrase: "Macrobius",
    definition: "Late Roman author (c. 400) of the *Commentarii in Somnium Scipionis* — the medieval textbook of dream-theory Chanticleer cites to argue that dreams have prophetic force." },
  { chapterIndex: 20, phrase: "Cato",
    definition: "The *Disticha Catonis*, a Latin schoolbook — Pertelote cites it ('Dreams mean nothing') against Chanticleer's Macrobius. Medieval grade-school Latin deployed with mock-epic seriousness." },
  { chapterIndex: 20, phrase: "Boece",
    definition: "Boethius's *Consolation of Philosophy* — the philosophical text Chanticleer cites in his defense of prophetic dreams. The full scholastic curriculum invoked for the argument between a rooster and a hen." },

  // ─────────────────────────────────────────────────────────────────────
  // SECOND NUN'S TALE (ch-21) — hagiography
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 21, phrase: "Cecilia",
    definition: "St. Cecilia — Roman virgin, converter of her husband Valerian and his brother Tiburce, ultimately beheaded by the prefect Almachius. Her life is the center of the Second Nun's rime-royal tale, adapted from the *Legenda Aurea*." },
  { chapterIndex: 21, phrase: "Legenda Aurea",
    definition: "The *Golden Legend* — Jacobus de Voragine's mid-13th-century compendium of saints' lives, the most-read book in late-medieval Christendom after the Bible. The Second Nun's Tale is a close adaptation of its Cecilia entry." },

  // ─────────────────────────────────────────────────────────────────────
  // CANON'S YEOMAN'S TALE (ch-22) — alchemy exposé
  // ─────────────────────────────────────────────────────────────────────

  { chapterIndex: 22, phrase: "multiplicacioun",
    definition: "Alchemical 'multiplication' — the supposed conversion of base metal into gold. The Yeoman exposes the whole fraud of it, including the standard sleight of hand whereby a confederate slips real silver into a crucible at the critical moment." },
  { chapterIndex: 22, phrase: "quicksilver",
    definition: "Mercury — the alchemist's primary reagent, believed to contain the principle of metallicity. The Yeoman's catalogue of terms and apparatus is one of the most detailed medieval alchemical passages in literature." },
]

/** Return all glosses applicable to a chapter (chapter-specific + cross-chapter). */
export function getCanterburyTalesGlossesForChapter(chapterIndex: number): CanterburyTalesGloss[] {
  return CANTERBURY_TALES_GLOSSES.filter(
    (g) => g.chapterIndex === chapterIndex || g.chapterIndex === -1,
  )
}
