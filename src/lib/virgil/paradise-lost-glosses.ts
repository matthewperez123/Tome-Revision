/**
 * Paradise Lost glosses — single-sentence tap-to-reveal definitions for
 * Milton's 1674 second edition (Standard Ebooks). Follows the Aeneid /
 * Commedia pattern:
 *
 *   - Annotations argue about meaning (paragraph, in a drawer).
 *   - Glosses identify (one sentence, on hover/tap).
 *
 * Coverage per spec Part 5 (40–60 per book, highest in the catalog):
 *
 *   - Latinate and archaic English diction (empyrean, adamantine,
 *     imparadise, unessential, sable, horrent, obdurate, inviolable,
 *     umbrageous, sapience, refulgent, luculent).
 *   - Proper names, classical (every god, hero, and place Milton
 *     invokes). Books I and II carry the densest catalogues.
 *   - Proper names, biblical (every figure and place; Books XI–XII
 *     densest).
 *   - Angelic hierarchy (Seraphim, Cherubim, Thrones, Dominations,
 *     Virtues, Powers, Principalities, Archangels).
 *   - Cosmological terms (primum mobile, crystalline sphere, empyrean,
 *     chaos, abyss).
 *   - Theological terms (predestination, election, prevenient grace,
 *     felix culpa, Arian question, mortalist heresy).
 *   - Renaissance / 17th-century English usage (prevent, conversation,
 *     artist, secure, discover, fond, professing contrarily).
 *
 * Phrase-matching notes: `phrase` must appear verbatim in Milton's
 * HTML. Curly apostrophes/quotes and em-dashes are normalized by the
 * reader component. A phrase that appears in more than one book uses
 * `chapterIndex: -1` (cross-book), in which case the first occurrence
 * per book is decorated.
 */

export interface ParadiseLostGloss {
  /** Zero-indexed chapter (ch-0.json = Book I). -1 = cross-book. */
  chapterIndex: number
  /** Exact substring to wrap in a tooltip. */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export const PARADISE_LOST_GLOSSES: ParadiseLostGloss[] = [
  // ── Cross-book: angelic hierarchy ───────────────────────────────────
  { chapterIndex: -1, phrase: "Seraphim",
    definition: "Highest order of the Pseudo-Dionysian angelic hierarchy — the *burning ones*, associated with love and direct contemplation of God (Isaiah 6:2)." },
  { chapterIndex: -1, phrase: "Cherubim",
    definition: "Second order of the angelic hierarchy — guardians of holiness, stationed with the flaming sword at Eden's gate (Genesis 3:24); in Ezekiel 1 they draw the throne-chariot." },
  { chapterIndex: -1, phrase: "Thrones",
    definition: "Third order of the angelic hierarchy — the seats of divine justice, named in Colossians 1:16." },
  { chapterIndex: -1, phrase: "Dominations",
    definition: "Fourth order of the angelic hierarchy (from Greek *Kyriotetes*) — angels who regulate the activities of lower orders." },
  { chapterIndex: -1, phrase: "Virtues",
    definition: "Fifth order of the angelic hierarchy — bestowers of grace, workers of miracles; the traditional choir of Ascension." },
  { chapterIndex: -1, phrase: "Principalities",
    definition: "Sixth order of the angelic hierarchy (Greek *Archai*) — guardians of nations and princes, named in Colossians 1:16 and Romans 8:38." },
  { chapterIndex: -1, phrase: "Archangels",
    definition: "Second-to-lowest order of the Pseudo-Dionysian hierarchy; Milton names Michael, Gabriel, Raphael, Uriel, and Abdiel." },

  // ── Cross-book: cosmology ───────────────────────────────────────────
  { chapterIndex: -1, phrase: "empyrean",
    definition: "The highest heaven, the sphere of fire and pure light beyond the crystalline sphere — in Milton's cosmos the dwelling-place of God and the loyal angels." },
  { chapterIndex: -1, phrase: "Empyreal",
    definition: "Of the empyrean — the highest heaven beyond the stars, the realm of pure divine light." },
  { chapterIndex: -1, phrase: "primum mobile",
    definition: "In Ptolemaic cosmology, the outermost moving sphere (the 'first moved') that imparts motion to all the inner spheres." },
  { chapterIndex: -1, phrase: "crystalline",
    definition: "Of the crystalline sphere — the ninth sphere in Ptolemaic cosmology, between the fixed stars and the primum mobile." },
  { chapterIndex: -1, phrase: "Chaos",
    definition: "The unformed abyss between Hell and Heaven from which God created the World; Milton personifies it as a speaking figure in Book II." },
  { chapterIndex: -1, phrase: "Abyss",
    definition: "In Miltonic cosmology, the vast unformed region between Heaven and Hell — synonymous with Chaos." },
  { chapterIndex: -1, phrase: "pendent world",
    definition: "Milton's phrase for the suspended earthly cosmos — the entire universe of stars and spheres, hanging by a golden chain from Heaven's edge." },

  // ── Cross-book: Latinate and archaic diction ────────────────────────
  { chapterIndex: -1, phrase: "adamantine",
    definition: "Unbreakably hard; from *adamant*, a legendary unbreakable substance (diamond or lodestone). Milton uses it for the chains of Hell and the structure of God's decrees." },
  { chapterIndex: -1, phrase: "obdurate",
    definition: "Hardened, stubborn — from Latin *obdurare*, 'to harden'; used especially of Satan's will refusing repentance." },
  { chapterIndex: -1, phrase: "sable",
    definition: "Black; from the dark fur of the sable animal, by extension any deep black — a heraldic color term Milton likes for ominous night." },
  { chapterIndex: -1, phrase: "umbrageous",
    definition: "Shady, shadow-giving; from Latin *umbra* (shadow) — Milton's favorite word for dense Edenic foliage." },
  { chapterIndex: -1, phrase: "sapience",
    definition: "Wisdom, the highest knowing — from Latin *sapientia*; distinct from mere *scientia* (knowledge). Milton's term for the wisdom Eve seeks and misses." },
  { chapterIndex: -1, phrase: "refulgent",
    definition: "Brightly shining, resplendent — from Latin *refulgere*. Milton's register for celestial light." },
  { chapterIndex: -1, phrase: "imparadise",
    definition: "Milton's coinage: to place in Paradise, to make blessed. The verb appears only in Paradise Lost." },
  { chapterIndex: -1, phrase: "unessential",
    definition: "Without essence, insubstantial — Milton's term for Chaos's pre-creation condition, drawing on the scholastic distinction between *essentia* and *existentia*." },
  { chapterIndex: -1, phrase: "horrent",
    definition: "Bristling, standing on end (of hair, weapons, fur) — from Latin *horrere*. A military-epic term Milton keeps for battle scenes." },
  { chapterIndex: -1, phrase: "luculent",
    definition: "Shining, clear, brilliant — from Latin *luculentus*. Rare in English, Miltonic." },
  { chapterIndex: -1, phrase: "apostate",
    definition: "One who has abandoned a faith or order; from Greek *apostasis* (defection). Milton uses it for Satan and the fallen angels." },
  { chapterIndex: -1, phrase: "inviolable",
    definition: "Not to be broken or violated; from Latin *inviolabilis*. Milton's register for oaths and divine decrees." },
  { chapterIndex: -1, phrase: "irremediable",
    definition: "Incapable of being remedied; from Latin *irremediabilis*. The theological register of Satan's condition." },

  // ── Cross-book: 17th-century English usage ─────────────────────────
  { chapterIndex: -1, phrase: "prevent",
    definition: "In 17th-century English, *prevent* means to *go before* (Latin *prae-venire*) — to precede, not to obstruct. 'Prevenient grace' is grace that goes before human response." },
  { chapterIndex: -1, phrase: "conversation",
    definition: "In 17th-century English, a person's manner of life (from Latin *conversari*, to live among) — the whole of public behavior, not merely talk." },
  { chapterIndex: -1, phrase: "discover",
    definition: "In 17th-century English, to *reveal* or *uncover* (Latin *dis-cooperire*), not to detect for the first time." },
  { chapterIndex: -1, phrase: "secure",
    definition: "In 17th-century Latin sense: *sine cura*, without care — i.e., careless, free from anxiety. Often a pejorative term in Milton for false complacency." },
  { chapterIndex: -1, phrase: "fond",
    definition: "In 17th-century English, *foolish*, *doting* — the word used of Adam's fall at IX.999 ('fondly overcome with female charm'), indicating affective rather than intellectual failure." },
  { chapterIndex: -1, phrase: "artist",
    definition: "In 17th-century English, a skilled craftsman or technical expert, not a fine-arts painter — e.g., Milton's 'the Tuscan artist' for Galileo the astronomer." },

  // ── Cross-book: theological terms ──────────────────────────────────
  { chapterIndex: -1, phrase: "prevenient grace",
    definition: "Grace that 'goes before' human response — the Arminian doctrine that God's grace enables the will to turn toward him without compelling it." },
  { chapterIndex: -1, phrase: "felix culpa",
    definition: "Latin, 'fortunate fault' — the doctrine (from Augustine, elaborated in the Easter Exsultet) that the Fall was ultimately *fortunate* because it permitted the Incarnation and greater good." },

  // ── Book I — catalog of fallen angels, Pandemonium ─────────────────
  { chapterIndex: 0, phrase: "Moloch",
    definition: "Ammonite god to whom parents burned their children (Leviticus 20:2–5, 2 Kings 23:10); in Paradise Lost, the violence-arguing fallen angel in Book II's council." },
  { chapterIndex: 0, phrase: "Chemos",
    definition: "National god of the Moabites (Numbers 21:29, 1 Kings 11:7); Solomon built him an altar, provoking divine anger." },
  { chapterIndex: 0, phrase: "Baalim",
    definition: "Plural of *Baal* — the collective name for the male Canaanite fertility gods (Judges 2:11), Milton's generic term for local pagan deities as fallen angels." },
  { chapterIndex: 0, phrase: "Ashtaroth",
    definition: "Plural of *Ashtoreth*, the Canaanite and Phoenician mother-goddess (1 Kings 11:5); Milton classes her (them) as fallen angels rebranded as idols." },
  { chapterIndex: 0, phrase: "Thammuz",
    definition: "Sumerian/Akkadian vegetation god (Tammuz; Ezekiel 8:14); his death and resurrection were mourned annually by women. Identified by Milton with a fallen angel." },
  { chapterIndex: 0, phrase: "Dagon",
    definition: "Philistine sea- or grain-god (1 Samuel 5); his idol fell before the Ark of the Covenant, dramatized by Milton as the fall of a named fallen angel." },
  { chapterIndex: 0, phrase: "Rimmon",
    definition: "Aramean storm-god worshipped at Damascus (2 Kings 5:18); in Milton's catalogue a fallen angel." },
  { chapterIndex: 0, phrase: "Osiris",
    definition: "Egyptian god of the dead and resurrection (husband of Isis); killed by his brother Set and re-membered by Isis — the myth Milton glosses as fallen-angel fabrication." },
  { chapterIndex: 0, phrase: "Isis",
    definition: "Egyptian goddess of motherhood and magic, consort of Osiris; in Milton's scheme, a fallen angel worshipped under this name." },
  { chapterIndex: 0, phrase: "Orus",
    definition: "Milton's form of Horus — the falcon-headed Egyptian sky-god, son of Isis and Osiris, avenger of his father." },
  { chapterIndex: 0, phrase: "Belial",
    definition: "Hebrew *bĕlīyya'al*, 'worthlessness' — the fallen angel of dissolute sensuality and sophistical speech; speaks second in Book II's council." },
  { chapterIndex: 0, phrase: "Mammon",
    definition: "Aramaic for wealth or possessions; in Matthew 6:24 personified as a rival god. Milton makes Mammon a fallen angel of avarice; Mulciber as architect of Pandemonium shares his register." },
  { chapterIndex: 0, phrase: "Azazel",
    definition: "Scapegoat demon of Leviticus 16; apocryphal fallen-angel chief in the Book of Enoch. Milton's standard-bearer of the rebel angels." },
  { chapterIndex: 0, phrase: "Beelzebub",
    definition: "Hebrew *Ba'al-z'bûb*, 'Lord of the Flies' (2 Kings 1:2); by the Second Temple period, a generic name for the chief of the demons. Milton's Satan's second-in-command." },
  { chapterIndex: 0, phrase: "Pandemonium",
    definition: "Milton's coinage — Greek *pan* (all) + *daimon* (demon) — 'place of all demons,' the capital of Hell, enters English in this poem." },
  { chapterIndex: 0, phrase: "Mulciber",
    definition: "Roman cult-name of Vulcan (the soothing smith); identified by Milton with one of the fallen angels, and the architect of Pandemonium — an echo of Homer's Hephaestus hurled from Olympus." },
  { chapterIndex: 0, phrase: "Tuscan artist",
    definition: "Galileo, whom Milton visited in 1638 at his house arrest in Arcetri near Florence; the reference at I.288 is Milton's one explicit mention of a contemporary." },
  { chapterIndex: 0, phrase: "Fesole",
    definition: "Fiesole — a hilltop town just outside Florence where Galileo sometimes observed; in Milton's simile, one of the sites from which Galileo viewed the moon through his telescope." },
  { chapterIndex: 0, phrase: "Valdarno",
    definition: "The valley of the Arno in Tuscany; with Fiesole, one of the observational sites Milton names in the Galileo simile (I.287–89)." },
  { chapterIndex: 0, phrase: "Vallombrosa",
    definition: "'Shaded valley' — a real monastery in the Etrurian (Tuscan) Apennines where Milton is said to have visited in 1638; the autumnal-leaves simile (I.302–04) locates the image there." },
  { chapterIndex: 0, phrase: "Ormus",
    definition: "Hormuz, the strait at the entrance of the Persian Gulf — in 16th–17th c. English verse a byword for the wealth of the East." },
  { chapterIndex: 0, phrase: "Ind",
    definition: "India, especially as a site of spice and gem wealth in 17th-century English poetic convention." },
  { chapterIndex: 0, phrase: "Serbonian",
    definition: "A treacherous marsh near the Nile delta (ancient *Serbonis*); Milton compares Hell's frozen burning waste to it at II.592." },
  { chapterIndex: 0, phrase: "Styx",
    definition: "The river of hate — one of the five rivers of the classical underworld (Hades); Milton includes it among Hell's four infernal rivers at II.577." },
  { chapterIndex: 0, phrase: "Acheron",
    definition: "The river of sorrow — another of the classical underworld rivers, incorporated by Milton into Hell's geography." },
  { chapterIndex: 0, phrase: "Cocytus",
    definition: "The river of lamentation in the classical underworld — Milton's fourth infernal river at II.579." },
  { chapterIndex: 0, phrase: "Lethe",
    definition: "The river of forgetfulness; in Milton, one of the infernal rivers, into which the damned would plunge if they could reach it to forget their state." },
  { chapterIndex: 0, phrase: "Oreb",
    definition: "Alternative name for Mount Horeb, the mountain of Moses's burning bush and the giving of the Law (Exodus 3, 19). Milton names it alongside Sinai in the invocation." },

  // ── Book II ─────────────────────────────────────────────────────────
  { chapterIndex: 1, phrase: "Plutonian",
    definition: "Of Pluto (Greek Hades, god of the underworld) — Milton's adjective for the hall of Hell where the council is held." },
  { chapterIndex: 1, phrase: "disinthrone",
    definition: "To dethrone, deprive of a throne; Milton's spelling of *disenthrone* at II.229 (Mammon's speech)." },
  { chapterIndex: 1, phrase: "timbrels",
    definition: "A hand-percussion instrument like a tambourine; in Milton's Moloch catalogue (I.394) the instrument whose noise drowned the cries of sacrificed children." },

  // ── Book III ────────────────────────────────────────────────────────
  { chapterIndex: 2, phrase: "Thamyris",
    definition: "Legendary Thracian bard blinded by the Muses for challenging them; Milton names him in the Book III invocation alongside other blind poets." },
  { chapterIndex: 2, phrase: "Maeonides",
    definition: "Homer — the poet from Maeonia (the traditional birthplace in Lydia). Milton lists him in the Book III invocation as a blind poet-predecessor." },
  { chapterIndex: 2, phrase: "Tiresias",
    definition: "Blind Theban prophet of classical myth; Milton names him in the Book III invocation as a blind seer-predecessor." },
  { chapterIndex: 2, phrase: "Phineus",
    definition: "Blind Thracian prophet of the Argonaut myth, tormented by the Harpies. Milton names him in the Book III invocation as a blind seer-predecessor." },
  { chapterIndex: 2, phrase: "Urania",
    definition: "Classical Muse of astronomy; Milton claims her as the Christian Muse of sacred song in the Book VII invocation, detaching her from the pagan pantheon." },

  // ── Book IV — Eden topography ──────────────────────────────────────
  { chapterIndex: 3, phrase: "Assyrian garden",
    definition: "Milton's formulation for Eden's eastern location; the reference is to Babylonian-Assyrian claims to the site of Paradise, and implicitly to the lost hanging-gardens tradition." },
  { chapterIndex: 3, phrase: "Mount Niphates",
    definition: "A mountain in ancient Armenia (the modern Nimrud-Dagh range) from which Milton's Satan first views Eden; chosen for its geographical closeness to traditional locations of Eden." },
  { chapterIndex: 3, phrase: "Hesperian",
    definition: "Western; of the Hesperides, the western mythical garden. Milton uses the word for Eden's fabulous fruit-bearing quality." },

  // ── Book V — the hierarchy, Raphael ─────────────────────────────────
  { chapterIndex: 4, phrase: "protoplast",
    definition: "First-formed — the original created being; Milton's term (from Greek *prōtos*, first, + *plastos*, formed) for Adam as first man." },
  { chapterIndex: 4, phrase: "concoctive",
    definition: "Having the power of digestion; in 17th-c. medical vocabulary, the faculty by which the body converts food to substance. Milton applies it to Raphael eating in Book V." },

  // ── Book VI — war in Heaven ────────────────────────────────────────
  { chapterIndex: 5, phrase: "adamant",
    definition: "Unbreakable stone or metal of legend; Milton's term for the material of angelic weapons and God's throne." },
  { chapterIndex: 5, phrase: "panoply",
    definition: "A complete suit of armor; from Greek *pan-hoplon*, 'all-armament.' Milton's term for the full equipage of an angelic warrior." },
  { chapterIndex: 5, phrase: "Urim",
    definition: "Brightness, light — part of the Hebrew High Priest's oracular breastplate (Urim and Thummim, Exodus 28:30). Milton uses it as an adjective for the Son's armor." },

  // ── Book VII — creation ─────────────────────────────────────────────
  { chapterIndex: 6, phrase: "quintessence",
    definition: "The 'fifth essence' beyond the four sublunary elements (earth, water, air, fire); the heavenly substance of pure Aristotelian cosmology. Milton uses it for primal light." },
  { chapterIndex: 6, phrase: "orient",
    definition: "Lustrous, precious, of the East (especially of pearls); Milton's adjective for the dew of Eden and the quality of heavenly substances." },

  // ── Book VIII — Adam, astronomy ─────────────────────────────────────
  { chapterIndex: 7, phrase: "Pleiades",
    definition: "Seven-star cluster in Taurus, named for the seven daughters of Atlas; in classical astronomy, a seasonal marker." },
  { chapterIndex: 7, phrase: "Ptolemaic",
    definition: "Of Ptolemy's 2nd-c. cosmology — a geocentric universe with the Earth at the center and concentric spheres of Moon, Sun, and planets. The cosmology Milton's poem principally inhabits." },
  { chapterIndex: 7, phrase: "Copernican",
    definition: "Of Copernicus's 1543 heliocentric cosmology; Raphael entertains the possibility at VIII.122ff without endorsing it." },
  { chapterIndex: 7, phrase: "hieroglyphic",
    definition: "Egyptian picture-writing; by extension, any symbolic or emblematic sign system. Milton's register for the theological density of creation's signs." },

  // ── Book IX — the Fall ─────────────────────────────────────────────
  { chapterIndex: 8, phrase: "tragic",
    definition: "Of tragedy; Milton's term (IX.6) for the genre his poem shifts into at Book IX, from the pastoral dialogue of earlier books." },
  { chapterIndex: 8, phrase: "argument",
    definition: "In 17th-century usage, the *subject* of a poem or speech, not the modern 'disputation.' Milton's 'argument' of Paradise Lost is the Fall of Man." },
  { chapterIndex: 8, phrase: "wanton",
    definition: "Unrestrained, lascivious, disordered; a 17th-century word often for unruly growth or sexual license. Milton uses it precisely for post-Fall desire (IX.1015)." },

  // ── Book X — the judgment ──────────────────────────────────────────
  { chapterIndex: 9, phrase: "orbicular",
    definition: "Spherical, of the shape of an orb; Satan refers to the World as 'orbicular' at X.381, acknowledging its sphericity in Ptolemaic cosmology." },
  { chapterIndex: 9, phrase: "Plenipotent",
    definition: "Of full power; Milton's register for the authority Sin and Death claim as viceroys of Satan at X.404." },
  { chapterIndex: 9, phrase: "Tartarean",
    definition: "Of Tartarus, the deepest pit of classical Hades; Milton's term for the lowest region of Hell." },

  // ── Book XI — the visions of history ───────────────────────────────
  { chapterIndex: 10, phrase: "Lazar-house",
    definition: "A hospital for the sick, especially for lepers; from Lazarus the beggar (Luke 16). Milton's Book XI lazar-house is the first hospital in English poetry." },
  { chapterIndex: 10, phrase: "phthisic",
    definition: "Consumption, pulmonary tuberculosis; one of the many diseases Milton catalogues in the lazar-house passage." },
  { chapterIndex: 10, phrase: "Pisgah",
    definition: "The mountain (Deuteronomy 34) from which Moses saw the Promised Land; the type of visionary mountains in Christian tradition. Michael places Adam on a Pisgah-like peak." },
  { chapterIndex: 10, phrase: "Jabal",
    definition: "The first nomadic herdsman (Genesis 4:20), descendant of Cain; one of the figures Michael shows Adam as exemplifying the civilized arts." },
  { chapterIndex: 10, phrase: "Jubal",
    definition: "The first musician (Genesis 4:21), brother of Jabal; ancestor of all who play harp and organ." },
  { chapterIndex: 10, phrase: "Enoch",
    definition: "Pre-flood patriarch (Genesis 5:24) who 'walked with God, and he was not; for God took him' — traditionally taken to heaven without dying. Figured by Milton in the vision of history." },
  { chapterIndex: 10, phrase: "Nephilim",
    definition: "Hebrew for 'giants' or 'fallen ones' (Genesis 6:4), the offspring of the 'sons of God' and the 'daughters of men'; Milton reads them as the fruit of Sethite-Cainite intermarriage." },

  // ── Book XII — the redemption-history ──────────────────────────────
  { chapterIndex: 11, phrase: "Nimrod",
    definition: "Great-grandson of Noah (Genesis 10:8–12), the first king and builder of Babel; in Milton's republican reading, the inventor of tyranny." },
  { chapterIndex: 11, phrase: "Babel",
    definition: "The tower of Genesis 11 whose builders tried to reach heaven; God confused their language and scattered them. The origin of linguistic diversity in Milton's history." },
  { chapterIndex: 11, phrase: "Abraham",
    definition: "Patriarch called out of Ur (Genesis 12); father of the Hebrew people and, through his 'seed,' the lineage of the Messiah." },
  { chapterIndex: 11, phrase: "Canaan",
    definition: "The land promised to Abraham (Genesis 12:5); the site of the later kingdoms of Israel and Judah." },
  { chapterIndex: 11, phrase: "Moses",
    definition: "Leader of the Exodus from Egypt (Exodus 1–20); giver of the Law at Sinai; typological forerunner of Christ in Christian tradition." },
  { chapterIndex: 11, phrase: "Sinai",
    definition: "The mountain where Moses received the Law (Exodus 19); in Milton's invocation, paired with Oreb/Horeb as the seat of prophetic inspiration." },
  { chapterIndex: 11, phrase: "David",
    definition: "Second king of Israel (c. 1000 BCE), ancestor of the Messiah in Christian genealogy; author of many of the Psalms." },
  { chapterIndex: 11, phrase: "Solomon",
    definition: "David's son, third king of Israel, builder of the First Temple; proverbially wise, but in Milton's reading his late turn to idolatry is one of the threads of Book XII's history." },
  { chapterIndex: 11, phrase: "Zion",
    definition: "The hill in Jerusalem on which the Temple stood; synecdoche for Jerusalem and, in prophetic literature, for the faithful community." },
  { chapterIndex: 11, phrase: "Messiah",
    definition: "Hebrew for 'anointed one' (Greek *Christos*); the promised king-priest who in Christian reading is Jesus of Nazareth. Milton's Book XII focuses on the Messianic prophecy and its fulfillment." },
  { chapterIndex: 11, phrase: "Comforter",
    definition: "Translation of Greek *Parakletos* (John 14:16, 26) — the Holy Spirit promised by Christ, sent at Pentecost. Michael announces the Comforter's coming at XII.486ff." },
]

export function getParadiseLostGlossesForChapter(
  chapterIndex: number,
): ParadiseLostGloss[] {
  return PARADISE_LOST_GLOSSES.filter(
    (g) => g.chapterIndex === chapterIndex || g.chapterIndex === -1,
  )
}
