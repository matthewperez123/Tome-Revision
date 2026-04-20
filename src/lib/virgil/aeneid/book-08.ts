import type { Annotation } from "../types"

// ── Aeneid Book VIII — Evander and the shield ───────────────────────────
// Dryden; anchors against public/content/the-aeneid/ch-7.json.
//
// Aeneas travels up the Tiber to Pallanteum (the future site of Rome),
// where the Arcadian king Evander receives him, narrates the cult of
// Hercules against Cacus, and introduces his young son Pallas. Venus
// has Vulcan forge a shield for Aeneas whose engravings depict the
// unborn history of Rome, culminating at the Battle of Actium — Virgil's
// Augustan set-piece answering the Iliadic shield of Achilles.

export const AENEID_BOOK_8: Annotation[] = [
  {
    id: "aeneid-8-tiber-god",
    bookId: "the-aeneid",
    chapterNumber: 7,
    anchorText: "Was laid on Tiber\u2019s banks, oppress\u2019d with grief",
    anchorOccurrence: 1,
    title: "The Tiber appears — the river-god speaks",
    quotedPassage:
      "Was laid on Tiber's banks, oppress'd with grief…",
    passageReference: "Book VIII, line 43 ff. (Dryden) · Aeneid VIII.26–65",
    commentary: `The book opens with Aeneas unable to sleep. The river-god Tiberinus appears to him in a dream — crowned with reeds, wrapped in a blue-gray robe — and tells him what to do: go upstream to King Evander the Arcadian. The sign will be a white sow with thirty piglets found under an oak.

Virgil is here aetiologizing several Roman things at once. The thirty piglets are, by Roman tradition, the thirty years between Aeneas's Lavinium and Ascanius's founding of Alba Longa. The white-sow portent was a site-marker for actual Italian towns in Virgil's time (there were temples commemorating it). And the Tiber-god himself — *Tiberinus* — was a real cult figure in Roman religion. The dream is a narrative that gathers a dozen Roman pieces of theological furniture into one scene.

The Tiber-god is also one of the Aeneid's most affectionate divine portraits. He is local, he is practical, he gives Aeneas a specific route. Compare the cosmic Jupiter of Book I or the infernal Dis of Book VI — Tiberinus is a god of the neighborhood, personable, and his appearance is one of the poem's most tenderly Italian moments.`,
    crossReferences: [],
    tags: ["mythological", "historical"],
  },
  {
    id: "aeneid-8-evander",
    bookId: "the-aeneid",
    chapterNumber: 7,
    anchorText: "Driv\u2019n with Evander from th\u2019 Arcadian land",
    anchorOccurrence: 1,
    title: "Evander at Pallanteum — a tour of future Rome",
    quotedPassage:
      "Driv'n with Evander from th' Arcadian land, / His son Pallas…",
    passageReference: "Book VIII, line 70 ff. (Dryden) · Aeneid VIII.97–369",
    commentary: `Aeneas lands at Pallanteum — Evander's small Arcadian settlement on the hill that will be the Palatine. Evander welcomes him, hosts a feast, and takes him on a walking tour of the site. Virgil uses the tour to point at every future Roman landmark: here is the spot where the Forum will be, here is the Capitol (an overgrown thicket in Evander's time, a hilltop for wild birds), here is the cave that will become the Lupercal, here is the Argiletum.

The scene is Virgil's most playful piece of *double-vision* writing. The reader in 19 BC knows the Palatine, the Forum, the Capitol; Evander and Aeneas are walking through them when they were goat-paths. Virgil is writing a foundation-tour that is also a city-letter to his contemporary audience. The smallness of the Arcadian settlement against the scale of the imperial Rome-to-come is the book's running image.

Evander's cottage-hospitality — the simple feast, the straw bedding, the small courtyard — is also one of Virgil's most affectionate portraits of *rusticitas*, the Roman agricultural-rural virtue. Augustus valorized this virtue politically; the Aeneid is giving it a mythological charter. Rome began as a guest staying in an Arcadian's cottage.`,
    crossReferences: [
      {
        type: "echo",
        description: "Evander's Pallanteum-tour is the model for every subsequent literary walking-tour of a city whose past and present are being overlaid. Joyce's Ulysses is arguably a descendant of the technique.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VIII (the Pallanteum walk)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "aeneid-8-cacus",
    bookId: "the-aeneid",
    chapterNumber: 7,
    anchorText: "The monster Cacus, more than half a beast",
    anchorOccurrence: 1,
    title: "Hercules and Cacus — the civilizing victory",
    quotedPassage:
      "The monster Cacus, more than half a beast… / Vulcan this plague begot; and, like his sire… / And led the searcher backward from the cave.",
    passageReference: "Book VIII, lines 258–278 ff. (Dryden) · Aeneid VIII.185–275",
    commentary: `Evander narrates at length the cult-myth Pallanteum celebrates: Hercules, passing through with the cattle of Geryon, was robbed by the fire-breathing monster Cacus, son of Vulcan, who dragged the stolen cattle tail-first into a cave so the hoofprints would mislead pursuit. Hercules, alerted by one cow's lowing, broke into the cave and strangled Cacus with his bare hands.

The story is the aetiology for the Ara Maxima, the most ancient altar in Rome (at the foot of the Aventine, still active in Virgil's time). Evander explains that he and his Arcadians celebrate the rite annually. Aeneas and his Trojans join the celebration — the ritual meal, the praising of Hercules' labors, the procession.

Two structural observations. First, the Cacus story is Virgil's one full-length narrative of a civilizing hero defeating a monster in a dark cave — it is the Aeneid's own Beowulf-scene, though of course long before Beowulf. Second, the myth is being told to Aeneas as a model: Hercules was a foreigner who freed this land from a monster and was thanked with eternal worship. The implicit parallel is that Aeneas is going to be another such foreigner, the next liberator, the next recipient of cult. Evander is writing Aeneas into the pattern.

The Ara Maxima scene is also the Aeneid showing Roman religion as *inheritance*. Pre-Roman Italians honored Hercules; Romans would honor Hercules after them; Aeneas, arriving in between, joins the existing cult. The continuity is the point.`,
    crossReferences: [],
    tags: ["mythological", "historical", "literary-influence"],
  },
  {
    id: "aeneid-8-venus-vulcan",
    bookId: "the-aeneid",
    chapterNumber: 7,
    anchorText: "While, at the Lemnian god\u2019s command",
    anchorOccurrence: 1,
    title: "Venus and Vulcan — the bedroom scene",
    quotedPassage:
      "While, at the Lemnian god's command, they urge / Their labours…",
    passageReference: "Book VIII, lines 597 ff. (Dryden) · Aeneid VIII.370–453",
    commentary: `Venus persuades her husband Vulcan to forge new armor for Aeneas. The persuasion scene is erotically specific: Virgil describes Venus's embrace, the marble-white arms around Vulcan's neck, Vulcan's instant acquiescence. The Latin is coy but the sense is unambiguous. This is sex as plot-lever — the goddess using her body to buy her son a shield.

The scene is a direct rewriting of Iliad XIV, where Hera seduces Zeus to distract him from the battle. Virgil takes Homer's scene and repurposes it for a different end: not distraction from a battle but commission of a weapon. The technique is one of the Aeneid's signatures — borrow a Homeric set piece, keep the physical staging, re-aim the plot-consequence.

Also worth noting: Vulcan instantly understands what he is being asked to make and why. He does not need to be told whose armor, for whose war. Venus's requests are understood by her husband as commissions for Rome's founding. The marriage-theology is specifically Roman: even the Olympian domestic sphere is entangled with the political project.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad XIV.159–351 — Hera's seduction of Zeus with Aphrodite's belt. Virgil rewrites the scene with the roles reassigned (Venus is now the wife, not the gift-giver) and the consequence reoriented (a weapon is forged, not a battle turned).",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XIV (the deception of Zeus)",
        targetBookId: "the-iliad",
        targetChapterNumber: 14,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "aeneid-8-wolf-twins",
    bookId: "the-aeneid",
    chapterNumber: 7,
    anchorText: "There, by the wolf, were laid the martial twins",
    anchorOccurrence: 1,
    title: "The wolf and the twins — on the shield",
    quotedPassage:
      "There, by the wolf, were laid the martial twins…",
    passageReference: "Book VIII, line 836 ff. (Dryden) · Aeneid VIII.626–641",
    commentary: `The shield Vulcan forges for Aeneas is engraved with scenes from Rome's future history. Virgil devotes about 100 lines to describing it — the Aeneid's most elaborate ekphrasis. The scenes depicted include: the wolf nursing Romulus and Remus, the rape of the Sabine women, the killing of Mettius Fufetius, the siege of Rome by Porsenna, Cloelia swimming the Tiber, the geese of the Capitol, and at the center, the Battle of Actium with Augustus in the prow and Antony and Cleopatra fleeing.

The structural model is the shield of Achilles in Iliad XVIII — the most famous ekphrasis in classical literature, where Hephaestus engraves the entire human world on a shield. Virgil is deliberately narrowing Homer's scope. Homer's shield depicts *humanity* (a city at peace, a city at war, a harvest, a dance, the river of Ocean); Virgil's shield depicts *Roman history specifically*. The reduction is the point. Rome, on this shield, is what the cosmos is *for*. The universe has been narrowed to a national narrative.

This is either the Aeneid's deepest flattery of Augustus or its sharpest critique — again, both readings sit in the same ekphrasis. The shield is beautiful; it is also a piece of national-chauvinism-in-metalwork that the Homer it imitates would have found bewildering. See the Actium annotation below for the climax of the ekphrasis.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad XVIII.478–608 — the shield of Achilles. Hephaestus engraves the whole human world on it: cities, wars, peace, agriculture, dancing, the cosmos. Virgil's shield reduces that scope to Roman political history specifically. The comparison is the load-bearing Homeric inheritance of Book VIII.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XVIII, lines 478–608",
        targetBookId: "the-iliad",
        targetChapterNumber: 18,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "aeneid-8-actium",
    bookId: "the-aeneid",
    chapterNumber: 7,
    anchorText: "Actium surveys the well-disputed prize",
    anchorOccurrence: 1,
    title: "Actium on the shield — Augustan propaganda forged",
    quotedPassage:
      "Actium surveys the well-disputed prize…",
    passageReference: "Book VIII, line 897 ff. (Dryden) · Aeneid VIII.671–728",
    commentary: `The center of the shield depicts the Battle of Actium (31 BC) — the naval victory by which Octavian (soon to be Augustus) defeated Antony and Cleopatra and became sole ruler of the Roman world. Virgil places Augustus in the ship's prow with the *sidus Iulium* (the comet that appeared after Caesar's death, read as Caesar's deified star) above his head. Antony is depicted with "barbarous wealth," Egyptian forces, and — crucially — *with a foreign wife*, which is the charge Augustus's propaganda leveled at him. Cleopatra flees the battle in panic; the Nile opens its arms to receive her.

This is the Aeneid's most propagandistic passage. It is straightforwardly an engraving of the Augustan version of Actium, with all of the official framing (Antony as corrupted by the East, Cleopatra as an animal sistrum-player, Augustus as the restorer of Roman order). It appears on a shield presented to Rome's founder by the gods themselves. Virgil has used the Iliadic ekphrasis as a vehicle for the current regime's account of its own origins.

And yet — characteristic of the Aeneid — the scene's irony is not suppressed. Aeneas carries the shield without knowing what the scenes depict. *Rērumque ignārus imāgine gaudet* — "ignorant of the events, he rejoices in the image." Virgil's hero is carrying his own descendants' civil-war victory on his back without understanding it. The line is one of the book's most interpretively charged: the founding hero is enthusiastic about a history he cannot comprehend. The shield is beautiful; Aeneas's ignorance of what makes it beautiful is stated explicitly.

This is one of the passages that the *two voices* reading of the Aeneid stands on. The public voice gives us Actium as glorious; the private voice gives us the founding hero not knowing what he's carrying.`,
    crossReferences: [
      {
        type: "echo",
        description: "The Actium ekphrasis is the single most openly Augustan passage in the poem. Later critics of imperial art history (from Nietzsche through Benjamin) have returned to this shield as a case-study in the aesthetics of political propaganda.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VIII (the shield's Actium scene)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical", "literary-influence"],
  },
  {
    id: "aeneid-8-pallas-entrusted",
    bookId: "the-aeneid",
    chapterNumber: 7,
    anchorText: "Deriv\u2019d from Pallas, his great-grandsire\u2019s name",
    anchorOccurrence: 1,
    title: "Pallas entrusted — the setup for the Book X catastrophe",
    quotedPassage:
      "Deriv'd from Pallas, his great-grandsire's name…",
    passageReference: "Book VIII, line 73 ff. (Dryden) · Aeneid VIII.514–584",
    commentary: `Evander gives Aeneas his son Pallas as a comrade-in-arms. The scene is one of the most emotionally loaded in the Aeneid: an aged king handing his only son over to a foreigner, knowing that Pallas's first experience of war will be this one. Evander's speech — "if you die and leave me sonless, do not send me news; I would rather die not knowing than learn what happened" — is Virgil's registering that the Aeneid's central parent-figure (after Anchises's death) is this old king losing his boy to the poem's war.

The entrustment is the setup for the Book X catastrophe. Pallas will be killed by Turnus; Turnus will strip Pallas's sword-belt; Aeneas will carry the loss into Book XII where he will see the belt on Turnus's shoulder and kill him in Pallas's name. The whole ending of the poem pivots on this quiet scene in Book VIII where an old father gave his son to a traveling stranger.

Virgil marks the entrustment with precise emotional texture. Evander touches Pallas's armor one last time; he cannot speak; he is led fainting back into the house. The prose of grief in Virgil is almost always physical — the hand reaching and not reaching, the voice breaking, the older body needing to be led. The Aeneid's signature.`,
    crossReferences: [
      {
        type: "allusion",
        description: "The Pallas-entrustment is the first beat of a three-book arc: Book VIII entrusts, Book X kills, Book XII avenges. Each book knows the other; the architecture is explicit.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book X (Pallas's death) + Book XII (the killing of Turnus)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "aeneid-8-rerum-ignarus",
    bookId: "the-aeneid",
    chapterNumber: 7,
    anchorText: "Unknown the names, he yet admires the grace",
    anchorOccurrence: 1,
    title: "Rerum ignarus — the founder ignorant of the founding",
    quotedPassage:
      "These figures, on the shield divinely wrought, / By Vulcan labour'd, and by Venus brought, / With joy and wonder fill the hero's thought. / Unknown the names, he yet admires the grace, / And bears aloft the fame and fortune of his race.",
    passageReference: "Book VIII, lines 973–977 (Dryden) · Aeneid VIII.729–731",
    commentary: `The last line of Book VIII is one of the poem's most-debated lines: *rērumque ignārus imāgine gaudet* — "ignorant of these matters, he rejoices in the image." Dryden renders it expansively ("Pleas'd with the mute fable on the brass") but the Latin is precise and tart.

Aeneas, walking off with the shield on his shoulders, does not know what the pictures mean. He sees the Battle of Actium and cannot know it is Augustus's victory. He sees the fleeing Cleopatra and cannot place her. He is carrying a physical object whose semantic content is invisible to him. Virgil's word *ignārus* is not neutral — it can mean "inexperienced" or "ignorant" depending on tone — and the verb *gaudet* ("rejoices") is set in pointed contrast with the ignorance. He is enjoying what he does not understand.

Michael Putnam and W. R. Johnson have read this line as Virgil's deepest critique of the regime. The founding hero carries the imperial history as *decorative*, not as knowledge. The shield is a gift that stands on its own aesthetic terms rather than on the hero's moral ownership of the events. The Aeneid, at this line, separates the *feeling* of the imperial project from the *understanding* of it.

Read it alongside the Book VI gates of sleep and the Book XII ending, and a pattern emerges: Virgil's hero repeatedly acts in and on histories he does not comprehend, guided by signs he can neither decline nor fully read. The Aeneid is the portrait of a founder working inside partial knowledge. *Ignārus* is the word that names this predicament.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence", "linguistic"],
  },
]
