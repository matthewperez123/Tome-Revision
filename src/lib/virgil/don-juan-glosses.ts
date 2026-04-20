// ── Don Juan Glosses ──
// One-line glosses for difficult words, names, foreign phrases, and 19c
// British political/literary figures in Byron's Don Juan. Target per spec
// Part 5: 30–45 per canto. This first pass seeds Canto I only; subsequent
// cantos will be generated in a Haiku-model pass.
//
// Glosses are looked up by chapterNumber (0-indexed, matching ch-*.json)
// and applied by the don-juan-annotations overlay via the shared
// .tome-gloss CSS class — dotted underline with a hover tooltip.

export interface DonJuanGloss {
  phrase: string
  definition: string
}

const CANTO_1_GLOSSES: DonJuanGloss[] = [
  // ── Epic-tradition names dropped in stanzas 2–4 ───────────────────
  { phrase: "Cumberland",   definition: "Prince William Augustus, Duke of Cumberland — \"the Butcher,\" son of George II, victor at Culloden (1746), whose brutal suppression of the Jacobite Highlanders gave him his nickname." },
  { phrase: "Wolfe",        definition: "Major-General James Wolfe — died at the Plains of Abraham (1759), winning Quebec for Britain and becoming the model 18c-British heroic death." },
  { phrase: "Hawke",        definition: "Admiral Edward Hawke — destroyed the French fleet at Quiberon Bay (1759), one of the decisive naval victories of the Seven Years War." },
  { phrase: "Wellesley",    definition: "Arthur Wellesley, Duke of Wellington — the victor of Waterloo (1815). Byron attacks him directly in Canto IX.1–10." },
  { phrase: "Buonaparté",   definition: "Napoleon Bonaparte — Byron uses the Italianate spelling Napoleon himself preferred, a subtle gesture of non-hostility." },
  { phrase: "Dumourier",    definition: "Charles François Dumouriez — French general of the Revolution who defected to the Austrians in 1793; Byron treats him as a type of the revolutionary betrayer." },
  { phrase: "Mirabeau",     definition: "Honoré-Gabriel Riqueti, comte de Mirabeau — orator of the early French Revolution, died 1791 before the Terror; Byron admired his rhetoric." },
  { phrase: "Marat",        definition: "Jean-Paul Marat — Jacobin journalist and ideologue of the Terror, murdered in his bath by Charlotte Corday in 1793." },
  { phrase: "La Fayette",   definition: "Marie-Joseph, marquis de Lafayette — fought in the American Revolution, commanded the National Guard in 1789, survived the Terror in Austrian imprisonment; Byron respected him as the surviving honest revolutionary." },
  { phrase: "Moniteur",     definition: "Le Moniteur Universel — the official French government newspaper, the Napoleonic equivalent of a state gazette." },
  { phrase: "Trafalgar",    definition: "Cape Trafalgar — the 1805 naval battle where Nelson destroyed the combined Franco-Spanish fleet and was killed. Byron's line registers that Nelson's fame had begun to fade by 1819." },

  // ── Donna Inez stanzas ──────────────────────────────────────────────
  { phrase: "Attic",        definition: "Of Attica, the region around Athens; by extension, elegant, pure, classical in style — \"Attic wit\" is the highest compliment for a conversational style." },
  { phrase: "dimity",       definition: "A lightweight cotton fabric with a checked or ribbed weave, standard for morning dresses in the early 19c — understated, practical, middle-class." },
  { phrase: "Hidalgo",      definition: "Spanish hereditary nobleman of the lower rank — lesser than a marqués or conde, but hereditary and entitled to the \"Don.\"" },

  // ── Donna Julia ancestry ────────────────────────────────────────────
  { phrase: "Boabdil",      definition: "Muhammad XII of Granada (r. 1482–92) — the last Moorish king of Al-Andalus, surrendered Granada to Ferdinand and Isabella in 1492. Tradition says he wept as he left the Alhambra; his mother said, \"Weep like a woman for what you could not defend as a man.\"" },
  { phrase: "Granada",      definition: "The last Moorish kingdom in Iberia, conquered by Castile and Aragon in 1492 — the completion of the Reconquista, the same year Columbus sailed." },

  // ── Julia's letter and related ──────────────────────────────────────
  { phrase: "zone to Venus", definition: "Venus's girdle — in Homer and the Alexandrian poets, the belt of Aphrodite that made its wearer irresistible. A conventional classical comparison for female beauty." },

  // ── Closing digressions ─────────────────────────────────────────────
  { phrase: "Cheops",       definition: "Khufu, the pharaoh of the 4th Egyptian dynasty (c. 2580–2560 BCE) who commissioned the Great Pyramid of Giza. Byron's trope: even the greatest monument could not preserve its builder from being displaced by a later grave-robber." },
  { phrase: "Pegasus",      definition: "The winged horse of Greek mythology — in 18c–19c British verse, a conventional metaphor for the poet's imagination and ambition." },
  { phrase: "Friar Bacon's Brazen Head", definition: "Roger Bacon (c. 1220–92), the English Franciscan natural philosopher — legend credited him with constructing a brass head that would speak and reveal the future; it uttered only three sentences (\"Time is, Time was, Time's past\") before shattering. A stock image for missed prophetic opportunity." },

  // ── General & foreign ────────────────────────────────────────────────
  { phrase: "pantomime",    definition: "In the 19c British theatrical sense, a popular stage entertainment featuring stock characters (Harlequin, Columbine, and a villain who is \"sent to the Devil\") rather than the modern silent-mime meaning. Don Juan appeared in pantomimes across Regency London." },
  { phrase: "cant",         definition: "19c British for sanctimonious or hypocritical moral language — the targeted object of much of Byron's satire. To speak \"cant\" was to mouth morality one didn't mean." },
  { phrase: "Banquo's monarchs", definition: "The line of eight kings shown to Macbeth in the witches' cauldron (Macbeth IV.i) — Byron's image of fame's successors stretching forward unstoppably." },
]

// ── Canto II (ch-3) — shipwreck, lot-drawing, Haidée's arrival ──
const CANTO_2_GLOSSES: DonJuanGloss[] = [
  { phrase: "Pedrillo",    definition: "Juan's Spanish tutor — the older, seasick, language-learned figure who is drawn by lot and killed for food in the lifeboat (II.72–77). Byron's satire and tenderness coexist in the character." },
  { phrase: "Promethean",  definition: "Of Prometheus, the Titan whose liver a vulture ate daily as punishment for stealing fire. Byron's \"Promethean vulture\" is the starving men's hunger, gnawing at them until they eat one of their own." },
  { phrase: "Ugolino",     definition: "Count Ugolino della Gherardesca of Pisa, imprisoned in the Tower of Hunger with his sons in 1288–89; Dante places him in Inferno XXXIII, gnawing the skull of Archbishop Ruggieri. Byron cites him as the Dantean precedent for Canto II's cannibalism scene." },
  { phrase: "Noddy",       definition: "A sea-bird (the noddy tern, Anous stolidus) caught easily by hand — the starving sailors' first non-human food after the lot-drawing." },
  { phrase: "Boobies",     definition: "Seabirds of the genus Sula, easily caught by sailors — the other species that, with the noddy, ends the cannibalism in Canto II stanza 87." },
  { phrase: "Haidée",      definition: "The young Greek woman who finds Juan cast ashore — daughter of the pirate Lambro, aged about seventeen. Protagonist of Cantos II–IV and the poem's single unironic love." },
  { phrase: "Zoe",         definition: "Haidée's attendant, a slightly older Ionian woman. The practical member of the two-woman team that revives Juan after the shipwreck." },
  { phrase: "Cadiz",       definition: "Spanish Atlantic port in Andalusia; Juan embarks from here at Canto II's opening, bound for northern Italy by way of the Mediterranean." },
  { phrase: "Moniteur",    definition: "Le Moniteur Universel, the official French government newspaper in Napoleonic and Restoration France." },
  { phrase: "Trafalgar",   definition: "Cape Trafalgar, southwest of Cadiz — Nelson's naval victory of 21 October 1805, where he was killed." },
  { phrase: "rum",         definition: "By the Admiralty's regulations of the 1790s, rum was the daily ration for Royal Navy sailors. Byron's ship here is a merchantman, not a warship; but the rum supply is still central to morale and, in Canto II, to the disorder of the sinking." },
  { phrase: "Méduse",      definition: "The French frigate Méduse wrecked off the West African coast in 1816; the raft of starving survivors was a European scandal and Géricault painted the aftermath (1818–19). Byron's shipwreck is modelled in part on this event." },
]

// ── Canto III (ch-4) — Haidée's feast, The Isles of Greece, Lambro's return ──
const CANTO_3_GLOSSES: DonJuanGloss[] = [
  { phrase: "Sappho",      definition: "Ancient Greek poet (c. 630–570 BCE) of Lesbos; her fragments survive in scattered quotations. For the Romantic generation Sappho was the archetypal woman poet, and her suicide-leap legend from the Leucadian cliff made her a type of the tragic artist." },
  { phrase: "Delos",       definition: "The small Cycladic island where Apollo and Artemis were born, according to Greek myth. In the Isles of Greece lyric it stands for the whole Aegean classical past." },
  { phrase: "Phoebus",     definition: "Phoebus Apollo, the Greek sun-god — \"Phoebus sprung\" alludes to Apollo's birth on Delos; by extension, the god of poetry and of prophecy." },
  { phrase: "Scian",       definition: "Of Chios — the traditional (one of several claimed) birthplaces of Homer; \"the Scian muse\" is Homer himself." },
  { phrase: "Teian",       definition: "Of Teos, birthplace of Anacreon (6c BCE), the lyric poet of wine and love — \"the Teian muse\" is Anacreon, paired with Homer as the two great lyric voices of the Aegean." },
  { phrase: "Marathon",    definition: "Plain northeast of Athens where the Athenians under Miltiades defeated the Persian invasion of 490 BCE — by Byron's day, the iconic site of a small free people resisting a vast empire." },
  { phrase: "Salamis",     definition: "The 480 BCE naval battle in which the Greek fleet under Themistocles destroyed Xerxes's Persian navy; Byron's stanza of \"the king who sate on the rocky brow\" refers to Xerxes watching the defeat from the shore." },
  { phrase: "Boabdil",     definition: "Muhammad XII (c. 1460–1533), last emir of Granada, whose tears at leaving the Alhambra are proverbial. Byron names him at III.54 for the bard's identification with the grief of lost kingdoms." },
  { phrase: "Anacharsis Cloots", definition: "Jean-Baptiste du Val-de-Grâce, baron de \"Cloots\" (1755–94), Prussian-born French revolutionary who styled himself \"orator of the human race\"; guillotined by Robespierre in 1794. Byron mentioned elsewhere as a proposed alternative ending for Juan." },
  { phrase: "Lambro",      definition: "Haidée's father, pirate-chief of the Greek island, presumed drowned or captured; returns alive in Canto III. Modeled partly on the historical Lambros Katsonis (1752–1804), an Aegean corsair." },
  { phrase: "Samian",      definition: "Of Samos — \"Samian wine\" is the sweet Muscat of the Aegean island of Samos, the traditional drink of Aegean antiquity; the bard's repeated call to \"dash down yon cup of Samian wine\" is the revolutionary command to abandon pleasure for action." },
  { phrase: "Sunium",      definition: "Cape Sounion, the southern tip of Attica, crowned by the temple of Poseidon — Byron carved his own name on the temple's marble; the lyric's \"Sunium's marbled steep\" is the place where Byron imagines himself dying \"swan-like, let me sing and die.\"" },
  { phrase: "Pyrrhic",     definition: "\"The Pyrrhic dance\" is the ancient Greek war-dance; Pyrrhus was a Molossian king famous for costly victories. The lyric contrasts the Pyrrhic dance (still practised in modern Greece) with the lost Pyrrhic phalanx, the military formation it rehearsed." },
  { phrase: "Cadmus",      definition: "Mythological founder of Thebes, credited in Greek legend with bringing the Phoenician alphabet to the Greeks — \"what has Cadmus left to us?\" in the lyric asks whether the letters are of any use if the people who use them are enslaved." },
  { phrase: "Miltiades",   definition: "Athenian general who commanded at Marathon (490 BCE); \"the blood of our Miltiades\" in the lyric is the imagined modern descent of the Marathon victors." },
  { phrase: "Trimmer",     definition: "Derogatory 18c–19c term for a political weather-vane, someone who \"trims their sails\" to every prevailing wind. Byron's bard is called a trimmer at III.87 for having sung for every political patron who paid him." },
]

// ── Canto IV (ch-5) — Haidée's death, Lambro's recognition ──
const CANTO_4_GLOSSES: DonJuanGloss[] = [
  { phrase: "Pegasus",     definition: "The winged horse of Greek mythology — in Byron's opening metaphor, the poet's imagination, liable to \"sprain a wing\" in mid-flight." },
  { phrase: "Lucifer",     definition: "\"Light-bearer\" — in Christian tradition, the name of Satan before his fall; Byron invokes him in IV.1 as the figure of a fall from grace. The Miltonic cadence is deliberate." },
  { phrase: "chameleon",   definition: "The color-changing lizard of the Mediterranean; in IV.31 Byron uses the chameleon as image of the dawn sky \"cradled in vermilion, baptized in molten gold.\"" },
  { phrase: "Allegra",     definition: "Clara Allegra Byron (1817–22), Byron's illegitimate daughter by Claire Clairmont, died at five in a Catholic convent at Bagnacavallo. Byron's grief in IV.74 (\"I have seen such — but must not call to mind\") is biographically weighted by her recent death." },
  { phrase: "Annabella",   definition: "Annabella Milbanke, Lady Byron (1792–1860), Byron's estranged wife; Donna Inez in Canto I is her satirical portrait. Mother of their daughter Ada (later Countess of Lovelace, 1815–52)." },
  { phrase: "Dido",        definition: "Queen of Carthage; her love for Aeneas and suicide after his departure (Aeneid IV) is the classical template for Haidée's death. Byron expected his readers to make the connection." },
  { phrase: "Longfellow",  definition: "Henry Wadsworth Longfellow's translations do not exist yet in 1823, but Milton's Lycidas and Shelley's Adonais (1821) are the pastoral-elegiac tradition Byron reaches for in the Haidée death-stanzas." },
]

// ── Canto IX (ch-10) — Wellington attack, Catherine ──
const CANTO_9_GLOSSES: DonJuanGloss[] = [
  { phrase: "Villainton",   definition: "French pun on \"Wellington\" — from villain (scoundrel) + ton (tone). The nickname circulated in post-1815 Paris; Byron adopts it with delight." },
  { phrase: "Kinnaird",     definition: "Douglas Kinnaird (1788–1830), Byron's close friend, banker, and Whig MP; Byron's 1823 grievance (the \"Marinèt's affair\" of IX.2) is with Wellington's treatment of Kinnaird in a Parisian diplomatic incident." },
  { phrase: "Westminster",  definition: "Westminster Abbey, England's national pantheon; Byron's IX.2 joke presumes Wellington's eventual burial there (in fact he was buried at St Paul's, 1852)." },
  { phrase: "Vittoria",     definition: "The 1813 battle in Spain where Wellington routed Joseph Bonaparte's forces; one of the engagements for which Parliament voted him cash grants." },
  { phrase: "Waterloo",     definition: "18 June 1815 — the decisive defeat of Napoleon by Wellington and Blücher; the event on which Wellington's post-1815 political career and national celebrity rested." },
  { phrase: "cut-throats",  definition: "Shakespeare, Macbeth III.iv.17 — Macbeth greeting the murderer he has hired: \"Thou art the best o' the cut-throats.\" Byron applies the phrase to Wellington with full awareness of the Shakespearean frame." },
  { phrase: "Cossacks",     definition: "Ukrainian/south-Russian horsemen serving the Russian imperial army as irregular cavalry; notorious in 19c Europe for brutality during the Ismail assault and elsewhere." },
  { phrase: "Polish",       definition: "Refers to the Polish partitions (1772, 1793, 1795) under Catherine the Great — a Romantic-era shorthand for imperial predation on a smaller free people. Byron's sympathy is with the Poles." },
  { phrase: "Holy Alliance", definition: "The 1815 compact between Russia, Austria, and Prussia to uphold Christian monarchy against revolution; in Byron's 1820s the Alliance was the principal political enemy of Continental liberals." },
  { phrase: "Castlereagh",  definition: "Robert Stewart, Viscount Castlereagh (1769–1822), British Foreign Secretary 1812–22 — the architect of the post-Waterloo Congress system and principal target of Byron's political hatred. Killed himself in August 1822 while the canto was being drafted; Byron did not revise the attacks already in the manuscript." },
]

export const DON_JUAN_GLOSSES_BY_CHAPTER: Record<number, DonJuanGloss[]> = {
  2:  CANTO_1_GLOSSES,
  3:  CANTO_2_GLOSSES,
  4:  CANTO_3_GLOSSES,
  5:  CANTO_4_GLOSSES,
  10: CANTO_9_GLOSSES,
  // Cantos V, VI, VII, VIII, X, XI, XII, XIII, XIV, XV, XVI, XVII: stubs
  // populated in the Haiku-tier pass per spec Part 5.
}

export function getDonJuanGlossesForChapter(chapterNumber: number): DonJuanGloss[] {
  return DON_JUAN_GLOSSES_BY_CHAPTER[chapterNumber] ?? []
}
