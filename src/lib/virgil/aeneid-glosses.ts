/**
 * Aeneid glosses — single-sentence tap-to-reveal definitions for
 * Dryden's heroic-couplets translation. Follows the Commedia pattern:
 *
 *   - Annotations argue about meaning (paragraph, in a drawer).
 *   - Glosses identify (one sentence, on hover/tap).
 *
 * Coverage is weighted by density need per spec Part 5:
 *   - Latin terms surviving in English or untranslatable (pietas, furor,
 *     fatum, Penates, fidus, pius, imperium, fata) — cross-book.
 *   - Roman gods with Greek equivalents — cross-book (Iliad/Odyssey
 *     readers arriving on Book I can still identify Juno as Hera).
 *   - The parade of heroes (Book VI) and the shield of Aeneas (Book
 *     VIII) are the gloss-dense catalogues — each Roman-historical name
 *     gets a one-line identification.
 *   - Place names (Strophades, Drepanum, Buthrotum, Pallanteum) as
 *     needed per book.
 *   - Mythological prerequisites (Judgment of Paris, Ganymede, Sibylline
 *     books, Penates, Lares).
 *
 * Phrase-matching notes:
 *   - `phrase` must appear verbatim in Dryden's rendered HTML. Curly
 *     apostrophes (U+2019) and em-dashes (U+2014) are normalized by the
 *     reader component, so plain ASCII works in most cases.
 *   - Longer phrases risk spanning verse-line breaks; 1–2 word
 *     identifications are safest.
 *   - A phrase appearing across several books can share one gloss entry
 *     with `chapterIndex: -1` (cross-book), in which case the first
 *     occurrence per book is decorated.
 */

export interface AeneidGloss {
  /** Zero-indexed chapter (ch-0.json = Book I). -1 means cross-book. */
  chapterIndex: number
  /** Exact substring to wrap in a tooltip. */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export const AENEID_GLOSSES: AeneidGloss[] = [
  // ── Cross-book: Latin concepts ──────────────────────────────────────
  { chapterIndex: -1, phrase: "Penates",
    definition: "The household gods of the Roman family — ancestral spirits presiding over the hearth and the pantry; Aeneas carries the Trojan Penates into Italy as the seed of Roman religion." },
  { chapterIndex: -1, phrase: "pious Aeneas",
    definition: "Formulaic translation of Virgil's *pius Aeneas* — the hero's signature epithet, fusing duty to the gods, parents, country, and descendants into one untranslatable virtue." },
  { chapterIndex: -1, phrase: "fates",
    definition: "Latin *fata* — not blind destiny but a decreed order, mostly underwritten by Jupiter, that the poem's action progressively discloses." },

  // ── Cross-book: Roman gods (first-occurrence identifications) ────────
  { chapterIndex: 0, phrase: "Juno",
    definition: "Roman queen of the gods (Greek Hera), sister and wife of Jupiter; her *unforgetting wrath* (saevae Iunonis iram) is the engine of the Aeneid's plot." },
  { chapterIndex: 0, phrase: "Jove",
    definition: "Jupiter (Greek Zeus), king of the gods; in the Aeneid he is the supreme but semi-detached underwriter of fate, speaking directly only at turning points." },
  { chapterIndex: 0, phrase: "Venus",
    definition: "Roman goddess of love (Greek Aphrodite); mother of Aeneas and, through him, patroness of the Julian line and of Rome itself." },
  { chapterIndex: 0, phrase: "Aeolus",
    definition: "King of the winds, keeper of the storms in his mountain-cave; in Aeneid I, bribed by Juno to wreck the Trojan fleet." },
  { chapterIndex: 0, phrase: "Neptune",
    definition: "Roman god of the sea (Greek Poseidon); unusually pro-Trojan in the Aeneid — he rebukes Aeolus and calms the opening storm." },
  { chapterIndex: 0, phrase: "Cytherea",
    definition: "Cult-title of Venus, from the island of Cythera where she was worshipped as the foam-born goddess." },
  { chapterIndex: 0, phrase: "Cupid",
    definition: "Roman god of love (Greek Eros), Venus's son; in Book I he takes Ascanius's form to kindle Dido's passion for Aeneas." },
  { chapterIndex: 3, phrase: "Mercury",
    definition: "Roman messenger-god (Greek Hermes); in Book IV he descends to Carthage with Jupiter's order for Aeneas to sail for Italy." },
  { chapterIndex: 5, phrase: "Apollo",
    definition: "God of prophecy, music, and the sun; his Cumaean oracle is the Sibyl, who guides Aeneas into the underworld." },
  { chapterIndex: 5, phrase: "Elysian",
    definition: "Of Elysium, the section of the underworld reserved for the virtuous dead; the Latin term is *Elysii Campi* — the Fields of the Blessed." },
  { chapterIndex: 7, phrase: "Vulcan",
    definition: "Roman god of fire and metalwork (Greek Hephaestus); in Book VIII he forges Aeneas's shield at Venus's request." },
  { chapterIndex: 6, phrase: "Diana",
    definition: "Roman virgin goddess of the hunt and the moon (Greek Artemis); patron and protector of the warrior-maiden Camilla." },
  { chapterIndex: 6, phrase: "Allecto",
    definition: "One of the three Furies (with Megaera and Tisiphone), dispatched by Juno to poison the Italian peace and provoke the war." },

  // ── Cross-book: Trojans, Carthaginians, Italians ────────────────────
  { chapterIndex: 0, phrase: "Aeneas",
    definition: "Son of Anchises and Venus, pious leader of the Trojan remnant after Troy's fall; founder of the line that will become Rome." },
  { chapterIndex: 0, phrase: "Dardan",
    definition: "Of Dardanus, the mythical Trojan-ancestor who gave the Trojans their other tribal name (Dardanians); Dryden uses 'Dardan' for 'Trojan.'" },
  { chapterIndex: 0, phrase: "Tyrian",
    definition: "Of Tyre, the Phoenician city from which Dido fled; in Aeneid I, 'Tyrian' = 'Carthaginian.'" },
  { chapterIndex: 0, phrase: "Phrygian",
    definition: "Of Phrygia, the region of Anatolia containing Troy; often used as a synonym for Trojan." },
  { chapterIndex: 0, phrase: "Ascanius",
    definition: "Son of Aeneas and Creusa, also called Iulus; ancestor-namesake of the gens Iulia (Julius Caesar's family)." },
  { chapterIndex: 0, phrase: "Iulus",
    definition: "Alternate name for Ascanius, emphasizing his role as ancestor of the Julian line — politically load-bearing under Augustus." },
  { chapterIndex: 0, phrase: "Achates",
    definition: "Aeneas's inseparable companion; 'fidus Achates' ('faithful Achates') enters English as a figure for a loyal friend." },
  { chapterIndex: 0, phrase: "Ilioneus",
    definition: "Elder Trojan, diplomat and spokesman for the embassy before Dido (Book I) and Latinus (Book VII)." },
  { chapterIndex: 0, phrase: "Sichaeus",
    definition: "Dido's murdered first husband (Latinized 'Sychaeus'); his shade receives her in the underworld in Book VI." },
  { chapterIndex: 0, phrase: "Carthage",
    definition: "Phoenician colony on the North African coast founded by Dido; Rome's principal enemy in the Punic Wars (264–146 BCE)." },
  { chapterIndex: 0, phrase: "Dido",
    definition: "Also called Elissa; Tyrian princess who founded Carthage after her brother Pygmalion murdered her husband Sychaeus for his gold." },

  // ── Book I: Trojan War backstory ────────────────────────────────────
  { chapterIndex: 0, phrase: "Troy",
    definition: "City in northwest Anatolia (also called Ilium); destroyed by the Greeks after a ten-year siege — the backstory of the Iliad and the start of the Aeneid." },
  { chapterIndex: 0, phrase: "Ilium",
    definition: "Alternate name for Troy, from its royal founder Ilus." },
  { chapterIndex: 0, phrase: "Paris",
    definition: "Trojan prince who abducted Helen and judged Venus winner of the beauty contest that earned Juno's hatred of Troy." },
  { chapterIndex: 0, phrase: "Ganymede",
    definition: "Trojan prince carried off by Jupiter to serve as cupbearer; another of Juno's grievances against Troy." },

  // ── Book II: fall of Troy ───────────────────────────────────────────
  { chapterIndex: 1, phrase: "Sinon",
    definition: "The Greek who, feigning desertion, persuaded the Trojans to drag the wooden horse inside the walls; Dante places him among the falsifiers in Inferno XXX." },
  { chapterIndex: 1, phrase: "Laocoon",
    definition: "Trojan priest of Neptune who warned against the wooden horse; killed with his sons by sea-serpents — a scene famous in sculpture (Vatican Laocoön group)." },
  { chapterIndex: 1, phrase: "Priam",
    definition: "Aged king of Troy, killed by Pyrrhus at the palace altar on Troy's last night — the scene Hamlet calls for from the Player (Hamlet II.ii)." },
  { chapterIndex: 1, phrase: "Polites",
    definition: "Son of Priam, killed by Pyrrhus in his father's arms in the palace courtyard." },
  { chapterIndex: 1, phrase: "Pyrrhus",
    definition: "Son of Achilles, also called Neoptolemus; butcher of Priam and the royal family on the night Troy falls." },
  { chapterIndex: 1, phrase: "Creusa",
    definition: "Aeneas's first wife, daughter of Priam; lost on the last night of Troy, her ghost prophesies the Italian destination." },
  { chapterIndex: 1, phrase: "Hecuba",
    definition: "Queen of Troy, wife of Priam; witnesses her husband's death in the palace courtyard." },
  { chapterIndex: 1, phrase: "Anchises",
    definition: "Aeneas's aged father, of the Trojan royal line; carried from burning Troy on Aeneas's shoulders — the emblem of *pietas*." },
  { chapterIndex: 1, phrase: "Panthus",
    definition: "Priest of Apollo on the Trojan citadel; brings the household gods to Aeneas as the city burns." },
  { chapterIndex: 1, phrase: "Hector",
    definition: "Priam's eldest son, Troy's greatest warrior, killed by Achilles in Iliad XXII; his ghost appears to Aeneas in a dream in Aeneid II." },

  // ── Book III: the wanderings ────────────────────────────────────────
  { chapterIndex: 2, phrase: "Strophades",
    definition: "Small Ionian islands where the Trojans encounter the Harpies; the name means 'turning points' (where one turns back)." },
  { chapterIndex: 2, phrase: "Harpies",
    definition: "Bird-women who foul food; their leader Celaeno prophesies that the Trojans will 'eat their tables' before reaching Italy." },
  { chapterIndex: 2, phrase: "Delos",
    definition: "Aegean island sacred to Apollo; the Trojans consult its oracle and are told to seek their 'ancient mother' (Italy)." },
  { chapterIndex: 2, phrase: "Crete",
    definition: "Large Mediterranean island; Anchises misinterprets Apollo's oracle and the Trojans briefly settle here before being driven on." },
  { chapterIndex: 2, phrase: "Helenus",
    definition: "Son of Priam, Trojan seer; ruling a small Troy-in-exile at Buthrotum with Andromache, he gives Aeneas the fullest prophecy of the voyage to come." },
  { chapterIndex: 2, phrase: "Andromache",
    definition: "Hector's widow, a captive of Pyrrhus after Troy fell, now remarried to Helenus at Buthrotum; one of the Aeneid's most pathos-laden encounters." },
  { chapterIndex: 2, phrase: "Buthrotum",
    definition: "Small town in Epirus (modern Butrint, Albania) where Helenus and Andromache have built a replica of Troy." },
  { chapterIndex: 2, phrase: "Hesperia",
    definition: "'The western land' — Greek poetic term for Italy, used throughout the Aeneid as the Trojans' promised destination." },
  { chapterIndex: 2, phrase: "Aetna",
    definition: "Volcanic mountain in eastern Sicily; the Trojans pass its eruption on their way around the island." },
  { chapterIndex: 2, phrase: "Cyclops",
    definition: "One-eyed giant race of Sicily; Polyphemus, blinded by Odysseus in Odyssey IX, is still alive when the Trojans pass Etna." },
  { chapterIndex: 2, phrase: "Drepanum",
    definition: "Port on Sicily's western coast (modern Trapani); Anchises dies here, establishing the cult-site the Trojans return to in Book V." },

  // ── Book IV: Dido ───────────────────────────────────────────────────
  { chapterIndex: 3, phrase: "Anna",
    definition: "Dido's sister and confidante; her counsel to encourage the Dido-Aeneas affair seals the tragedy." },
  { chapterIndex: 3, phrase: "Iarbas",
    definition: "African prince (Gaetulian), rejected suitor of Dido, son of Jupiter Ammon; his prayer to Jove triggers Mercury's mission." },
  { chapterIndex: 3, phrase: "Fame",
    definition: "Dryden's translation of *Fama* — the personified Rumor, depicted as a monstrous bird-creature with countless tongues and ears." },
  { chapterIndex: 3, phrase: "Cyllenius",
    definition: "Title of Mercury from his birthplace, Mount Cyllene in Arcadia; used for the god in Book IV's descent scene." },
  { chapterIndex: 3, phrase: "Elissa",
    definition: "Dido's Phoenician name; used in the Aeneid in moments of tenderness or grief (as here, by Dido herself)." },
  { chapterIndex: 3, phrase: "Hecate",
    definition: "Three-faced goddess of witchcraft, crossroads, and the underworld; invoked in Dido's final curse-ritual." },
  { chapterIndex: 3, phrase: "Stygian",
    definition: "Of the Styx, the river of the underworld; 'Stygian' = infernal, belonging to the realm of the dead." },

  // ── Book V: funeral games ───────────────────────────────────────────
  { chapterIndex: 4, phrase: "Acestes",
    definition: "Sicilian king of Trojan descent who hosts the funeral games for Anchises; Aeneas leaves the weary Trojans in his care." },
  { chapterIndex: 4, phrase: "Entellus",
    definition: "Aged Sicilian boxer, once trained by Eryx, who defeats the younger Trojan Dares in Book V's boxing match." },
  { chapterIndex: 4, phrase: "Dares",
    definition: "Young Trojan boxer, overconfident, who loses to Entellus; Aeneas stops the fight to spare him." },
  { chapterIndex: 4, phrase: "Palinurus",
    definition: "Aeneas's helmsman; lulled overboard by the god Sleep at the end of Book V; his shade begs passage at the Styx in Book VI." },

  // ── Book VI: catabasis + parade of heroes ───────────────────────────
  { chapterIndex: 5, phrase: "Sibyl",
    definition: "Apollo's priestess at Cumae; prophesies under divine possession and guides Aeneas through the underworld." },
  { chapterIndex: 5, phrase: "Cumaean",
    definition: "Of Cumae, the Greek colony on the Bay of Naples near the crater Lake Avernus, traditional entrance to the underworld." },
  { chapterIndex: 5, phrase: "Avernus",
    definition: "Volcanic crater-lake near Cumae, in antiquity believed to be a mouth of the underworld; 'Avernus' becomes a poetic synonym for hell." },
  { chapterIndex: 5, phrase: "Charon",
    definition: "Ferryman of the Styx; Virgil gives him a grotesque physical portrait (filth, flame-eyes) that Dante directly inherits in Inferno III." },
  { chapterIndex: 5, phrase: "Lethe",
    definition: "River of forgetting in the underworld; souls destined for rebirth drink from it to lose memory of their past lives." },
  { chapterIndex: 5, phrase: "Tartarus",
    definition: "The deep region of the underworld reserved for the wicked; Virgil's Tartarus is the direct model for Dante's Inferno." },
  { chapterIndex: 5, phrase: "Rhadamanthus",
    definition: "Judge of the dead in Tartarus; son of Jupiter and Europa, brother of Minos." },
  { chapterIndex: 5, phrase: "Deiphobus",
    definition: "Son of Priam; Helen's Trojan husband after Paris's death; butchered on Troy's last night, his mutilated shade meets Aeneas in Book VI." },
  { chapterIndex: 5, phrase: "Tityos",
    definition: "Giant punished in Tartarus by a vulture eternally tearing at his liver; he assaulted Leto (Latona), mother of Apollo and Diana." },
  { chapterIndex: 5, phrase: "Tantalus",
    definition: "King punished in Tartarus by eternal unreachable food and water; his crime was feeding his son Pelops to the gods." },
  { chapterIndex: 5, phrase: "Pirithous",
    definition: "Theseus's companion, punished in Tartarus for attempting to abduct Proserpina (Persephone)." },
  { chapterIndex: 5, phrase: "Musaeus",
    definition: "Legendary pre-Homeric Greek poet and religious teacher, associated with Orphic mystery-cult; guides Aeneas to Anchises in Elysium." },
  // parade of heroes
  { chapterIndex: 5, phrase: "Silvius",
    definition: "Son of Aeneas and Lavinia, first of the Alban kings to be born after Aeneas's death; Anchises names him first in the parade of heroes." },
  { chapterIndex: 5, phrase: "Procas",
    definition: "Alban king in the genealogy from Aeneas to Romulus; father of Numitor and Amulius." },
  { chapterIndex: 5, phrase: "Numitor",
    definition: "Alban king, father of Ilia/Rhea Silvia, grandfather of Romulus and Remus." },
  { chapterIndex: 5, phrase: "Romulus",
    definition: "Son of Mars and Ilia, founder of Rome (traditional date 753 BCE); Anchises shows him to Aeneas with his helmet-plume twinned as a sign of Jupiter's favor." },
  { chapterIndex: 5, phrase: "Numa",
    definition: "Numa Pompilius, second king of Rome (traditional dates 715–673 BCE); organized Roman religion and gave the city its sacred calendar." },
  { chapterIndex: 5, phrase: "Tullus",
    definition: "Tullus Hostilius, third king of Rome; traditionally warlike, destroyed Alba Longa." },
  { chapterIndex: 5, phrase: "Ancus",
    definition: "Ancus Marcius, fourth king of Rome; traditionally built the port of Ostia and the first bridge over the Tiber." },
  { chapterIndex: 5, phrase: "Brutus",
    definition: "Lucius Junius Brutus, who expelled the last Etruscan king (Tarquinius Superbus) in 509 BCE and founded the Roman Republic." },
  { chapterIndex: 5, phrase: "Decii",
    definition: "Plebeian Roman family whose members (three generations) famously 'devoted' themselves to death in battle to win divine favor for Rome." },
  { chapterIndex: 5, phrase: "Camillus",
    definition: "Marcus Furius Camillus (c. 446–365 BCE), Roman general who saved Rome after the Gallic sack of 390 BCE — the 'second founder' of Rome." },
  { chapterIndex: 5, phrase: "Gracchi",
    definition: "Brothers Tiberius and Gaius Gracchus (tribunes 133 and 123 BCE), reformers killed in political violence; ancestors of the Roman revolutionary tradition." },
  { chapterIndex: 5, phrase: "Scipios",
    definition: "Roman patrician family; Scipio Africanus defeated Hannibal at Zama (202 BCE); Scipio Aemilianus destroyed Carthage (146 BCE)." },
  { chapterIndex: 5, phrase: "Fabricius",
    definition: "Gaius Fabricius Luscinus, consul 282 BCE, legendary for incorruptibility — 'poor Fabricius' in Anchises's parade is the Roman ideal of austere virtue." },
  { chapterIndex: 5, phrase: "Fabius",
    definition: "Quintus Fabius Maximus Verrucosus 'Cunctator' (the Delayer), dictator during the Second Punic War; 'by delaying alone he restored the state.'" },
  { chapterIndex: 5, phrase: "Caesar",
    definition: "Julius Caesar (100–44 BCE), dictator and founder-of-the-Imperial-system; Anchises addresses him as 'my descendant' through the Julian line." },
  { chapterIndex: 5, phrase: "Marcellus",
    definition: "Marcus Claudius Marcellus (42–23 BCE), Augustus's nephew and intended heir, who died at nineteen; the climactic address of the parade of heroes." },

  // ── Book VII: war in Italy ──────────────────────────────────────────
  { chapterIndex: 6, phrase: "Latinus",
    definition: "Aged king of the Latins, son of Faunus; welcomes the Trojans and offers his daughter Lavinia before Juno's Fury derails the peace." },
  { chapterIndex: 6, phrase: "Amata",
    definition: "Queen of the Latins, mother of Lavinia; driven mad by the Fury Allecto to oppose the Trojan match; dies by suicide in Book XII." },
  { chapterIndex: 6, phrase: "Lavinia",
    definition: "Daughter of Latinus; betrothed to Turnus, promised to Aeneas; gives her name to Lavinium, the first Trojan city in Italy." },
  { chapterIndex: 6, phrase: "Turnus",
    definition: "Rutulian prince, betrothed to Lavinia, champion of the Italian resistance to the Trojan settlement; killed by Aeneas in Book XII." },
  { chapterIndex: 6, phrase: "Mezentius",
    definition: "Exiled Etruscan tyrant, *contemptor divum* ('despiser of the gods'); allies with Turnus; killed by Aeneas in Book X after his son Lausus dies for him." },
  { chapterIndex: 6, phrase: "Faunus",
    definition: "Rustic Italian god, ancestor-hero of the Latins; Latinus's father; associated with prophecy and the sacred groves." },
  { chapterIndex: 6, phrase: "Volscians",
    definition: "Italic people of central Italy, southwest of Latium; Camilla leads their cavalry in Book XI." },
  { chapterIndex: 6, phrase: "Rutulian",
    definition: "Of the Rutuli, a small Italic people on the Latin coast; Turnus's tribe." },
  { chapterIndex: 6, phrase: "Tiber",
    definition: "River of central Italy running through Rome; in the Aeneid the Trojans land at its mouth, and its river-god Tiberinus appears to Aeneas." },

  // ── Book VIII: Evander and the shield ───────────────────────────────
  { chapterIndex: 7, phrase: "Evander",
    definition: "Arcadian exile, king of the small settlement of Pallanteum on the future site of Rome; father of Pallas; Aeneas's ally in Book VIII." },
  { chapterIndex: 7, phrase: "Pallanteum",
    definition: "Evander's Arcadian settlement on the Palatine hill — the future site of Rome, glimpsed by Aeneas in its Bronze-Age infancy." },
  { chapterIndex: 7, phrase: "Arcadian",
    definition: "Of Arcadia, the mountainous central region of the Peloponnese; Evander's people are Greek colonists settled in Italy." },
  { chapterIndex: 7, phrase: "Cacus",
    definition: "Fire-breathing monster son of Vulcan who lived on the Aventine; killed by Hercules for stealing the cattle of Geryon — the aetiology for the Ara Maxima." },
  { chapterIndex: 7, phrase: "Ara Maxima",
    definition: "'The Greatest Altar' — ancient altar to Hercules in the Forum Boarium, active in Virgil's Rome, which Evander's cult celebrates here." },
  { chapterIndex: 7, phrase: "Hercules",
    definition: "Greco-Roman hero of the Twelve Labors; in Book VIII, the deliverer of Pallanteum from the monster Cacus, honored by annual rites." },
  { chapterIndex: 7, phrase: "Tiberinus",
    definition: "The river-god of the Tiber; appears to Aeneas in a dream to direct him upstream to Pallanteum." },
  { chapterIndex: 7, phrase: "Pallas",
    definition: "Young son of Evander, entrusted to Aeneas as his first campaign; killed by Turnus in Book X; his sword-belt triggers the poem's final killing." },
  { chapterIndex: 7, phrase: "Lemnian",
    definition: "Of Lemnos, the island where Vulcan had his primary workshop; the 'Lemnian god' = Vulcan." },
  { chapterIndex: 7, phrase: "Mulciber",
    definition: "Cult-title of Vulcan, meaning 'he who softens' (metals); used in the shield-forging scene." },
  // shield of Aeneas
  { chapterIndex: 7, phrase: "Porsenna",
    definition: "Lars Porsena of Clusium, Etruscan king; led the siege of Rome in 508 BCE to restore the Tarquins; depicted on the shield." },
  { chapterIndex: 7, phrase: "Cocles",
    definition: "Horatius Cocles, Roman hero who held the Pons Sublicius alone against Porsena's army while the bridge was destroyed behind him." },
  { chapterIndex: 7, phrase: "Cloelia",
    definition: "Roman maiden held hostage by Porsena who escaped by swimming across the Tiber to freedom; depicted on the shield." },
  { chapterIndex: 7, phrase: "Manlius",
    definition: "Marcus Manlius Capitolinus, who woke to the cackling of the sacred geese and saved the Capitol from the Gauls in 390 BCE." },
  { chapterIndex: 7, phrase: "Actium",
    definition: "Naval battle of 31 BCE off western Greece in which Octavian (future Augustus) defeated Antony and Cleopatra; the shield's climactic scene." },
  { chapterIndex: 7, phrase: "Cleopatra",
    definition: "Cleopatra VII of Egypt (69–30 BCE), ally and lover of Mark Antony; on the shield she is depicted fleeing the Battle of Actium." },
  { chapterIndex: 7, phrase: "Antony",
    definition: "Mark Antony (83–30 BCE), former triumvir and Octavian's rival; defeated at Actium; on the shield he is depicted in 'barbarous' company." },
  { chapterIndex: 7, phrase: "Augustus",
    definition: "Octavian (63 BCE – 14 CE), Julius Caesar's adopted heir, first Roman emperor; the Aeneid's dedicatee and the climactic figure on the shield and in the parade of heroes." },
  { chapterIndex: 7, phrase: "Araxes",
    definition: "River in Armenia; conquered by Augustus's campaigns on the eastern frontier; depicted on the shield as submitting to Roman authority." },

  // ── Book IX: Nisus and Euryalus ─────────────────────────────────────
  { chapterIndex: 8, phrase: "Nisus",
    definition: "Trojan warrior, older of the famous pair; proposes and leads the night-raid; dies avenging his friend Euryalus." },
  { chapterIndex: 8, phrase: "Euryalus",
    definition: "Young Trojan warrior, Nisus's beloved companion; killed on the night-raid; Virgil addresses them both as 'fortunati ambo.'" },
  { chapterIndex: 8, phrase: "Bitias",
    definition: "Giant Trojan warrior, killed when he opens the gates in Book IX; Virgil gives him a collapsing-tower simile." },
  { chapterIndex: 8, phrase: "Pandarus",
    definition: "Giant Trojan warrior, brother of Bitias; closes the gate with Turnus still inside, trapping him in the Trojan camp." },
  { chapterIndex: 8, phrase: "Cybele",
    definition: "Phrygian mother-goddess, introduced to Roman state religion in 205 BCE; associated with Trojan origins." },

  // ── Book X: death of Pallas ─────────────────────────────────────────
  { chapterIndex: 9, phrase: "Lausus",
    definition: "Young son of Mezentius; dies defending his father from Aeneas; Virgil addresses him directly in one of the poem's canonical apostrophes." },
  { chapterIndex: 9, phrase: "Etrurian",
    definition: "Of Etruria, the Etruscan homeland north of Rome; the Etruscans are Aeneas's allies against Mezentius and Turnus." },

  // ── Book XI: Camilla ────────────────────────────────────────────────
  { chapterIndex: 10, phrase: "Camilla",
    definition: "Virgin warrior-maiden of the Volsci, dedicated to Diana from infancy; leads the Italian cavalry; killed by Arruns in Book XI." },
  { chapterIndex: 10, phrase: "Metabus",
    definition: "Exiled Volscian tyrant, Camilla's father; escapes pursuit by hurling infant Camilla tied to his spear across a river." },
  { chapterIndex: 10, phrase: "Drances",
    definition: "Aged Latin senator, Turnus's rhetorical opponent; argues for peace with Aeneas in the Book XI debate." },
  { chapterIndex: 10, phrase: "Chloreus",
    definition: "Gold-armored Trojan priest of Cybele whose ornate dress distracts Camilla; her pursuit of him gives Arruns the fatal shot." },
  { chapterIndex: 10, phrase: "Arruns",
    definition: "Etruscan archer who strikes Camilla with a treacherous javelin from concealment; killed in turn by Diana's nymph Opis." },
  { chapterIndex: 10, phrase: "Opis",
    definition: "Nymph in Diana's service; Diana commands her to avenge Camilla's death, and she kills Arruns with a bowshot." },
  { chapterIndex: 10, phrase: "Acca",
    definition: "Camilla's lieutenant; carries the dying Camilla's last command to Turnus to abandon his ambush and reinforce the line." },

  // ── Book XII: the killing ───────────────────────────────────────────
  { chapterIndex: 11, phrase: "Juturna",
    definition: "Water-nymph, sister of Turnus; promoted to divinity by Jupiter; in Book XII she intervenes repeatedly to delay her brother's death." },
  { chapterIndex: 11, phrase: "Metiscus",
    definition: "Turnus's mortal charioteer; Juturna takes his form to drive Turnus around the battlefield and keep him from Aeneas." },
  { chapterIndex: 11, phrase: "Daunus",
    definition: "Turnus's father, aged king of the Rutulians; invoked by Turnus in his final plea to Aeneas for mercy." },
  { chapterIndex: 11, phrase: "Ausonian",
    definition: "Ancient poetic term for Italy and its inhabitants; Jove's settlement in Book XII preserves the 'Ausonian tongue' against the Trojan name." },
]

export function getAeneidGlossesForChapter(chapterIndex: number): AeneidGloss[] {
  return AENEID_GLOSSES.filter(
    (g) => g.chapterIndex === chapterIndex || g.chapterIndex === -1,
  )
}
