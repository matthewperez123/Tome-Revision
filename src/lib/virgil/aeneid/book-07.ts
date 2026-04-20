import type { Annotation } from "../types"

// ── Aeneid Book VII — the war in Italy begins ───────────────────────────
// Dryden; anchors against public/content/the-aeneid/ch-6.json.
//
// Book VII is the poem's structural hinge between the Odyssean and the
// Iliadic halves. The Trojans land at the Tiber, King Latinus welcomes
// them, Juno sends the Fury Allecto to poison the peace, and the book
// closes on a catalogue of Italian warriors — Virgil's own Catalogue of
// Ships. The Caieta invocation opens the book (apostrophe already
// surfaced as a V. monogram via the apparatus).

export const AENEID_BOOK_7: Annotation[] = [
  {
    id: "aeneid-7-second-invocation",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Relate what Latium was",
    anchorOccurrence: 1,
    title: "Book VII's second invocation — a new poem begins",
    quotedPassage:
      "Relate what Latium was; her ancient kings…",
    passageReference: "Book VII, line 54 ff. (Dryden) · Aeneid VII.37–45",
    commentary: `Virgil begins Book VII with a second invocation to the Muse — *maior rērum mihi nāscitur ōrdō, / maius opus moveō* ("a greater order of events is being born for me, a greater work I set in motion"). The line is the Aeneid's explicit structural midpoint. Books I–VI were the *maius prius opus* (the earlier great work); Books VII–XII are the *maius* — the greater. Virgil is naming his own poem's second half as more ambitious than its first.

The implicit argument is that the Iliadic material (war in Italy, the killing of Turnus) will be weightier than the Odyssean material (the wanderings, the descent). This was a surprising claim in antiquity and has been argued about ever since. The first six books contain Dido and the catabasis; the second six contain the war. Many readers prefer the first half. Virgil, at least in this invocation, is betting on the second.

Note also the Caieta apostrophe that opens the book proper — the poet addressing Aeneas's nurse directly, promising her immortality through being named. That apostrophe is marked by a V. monogram in the reader; see its dedicated card for the full Virgilian-apostrophe scholarship.`,
    crossReferences: [
      {
        type: "source",
        description: "The twin invocations (Aeneid I.1 and VII.37) are modeled on the Iliad's re-invocation in Book II (the Catalogue of Ships). Homer pauses his narrative to pray for ability; Virgil pauses to escalate his stakes.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book II (the second invocation before the Catalogue)",
        targetBookId: "the-iliad",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "aeneid-7-tables-omen",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Betwixt the trees the Tiber took his course",
    anchorOccurrence: 1,
    title: "The Tiber — landfall at the destined river",
    quotedPassage:
      "Betwixt the trees the Tiber took his course…",
    passageReference: "Book VII, line 42 ff. (Dryden) · Aeneid VII.25–36",
    commentary: `The Trojans land at the mouth of the Tiber. They eat what bread they have, using wheat-cakes as improvised plates, and when the food is gone they eat the plates themselves. Ascanius laughs: "See, we're eating our tables!" Aeneas recognizes the Harpy Celaeno's prophecy from Book III — that the Trojans would reach Italy only when they ate their tables — being fulfilled in a comic key. The curse was the arrival-sign.

The scene is Virgilian at its most delicate. A frightening prophecy (Celaeno's "you will eat your tables, for hunger") is fulfilled by hungry travelers finishing a picnic. The Aeneid repeatedly does this — prophecy arrives in a register its original speaker did not imagine. The gods' words are true; the shape of their truth keeps surprising the mortals interpreting them.

Aeneas offers immediate thanks, names the spot as Trojan, and prepares to meet the local king. The landfall is the whole aim of Books I–VI; Book VII converts it from promise into ground.`,
    crossReferences: [
      {
        type: "allusion",
        description: "The prophecy being fulfilled is Celaeno's in Book III (line 277 ff., Dryden) — 'you will eat your tables.' Virgil is cashing in a setup laid down four books earlier.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book III (Celaeno's curse)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "aeneid-7-latinus",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Latinus, old and mild",
    anchorOccurrence: 1,
    title: "Latinus — the good king overruled",
    quotedPassage:
      "Latinus, old and mild, had long possess'd / The Latian scepter, and his people bless'd…",
    passageReference: "Book VII, line 68 ff. (Dryden) · Aeneid VII.45–106",
    commentary: `Latinus is the Aeneid's portrait of a benevolent ruler outmatched by events. He receives the Trojan embassy graciously, recognizes their arrival as the fulfillment of an oracle promising his daughter Lavinia a foreign husband, and offers alliance. He is the exact figure Aeneas himself hopes to become — an aged king, pious, careful with ritual, offering his daughter for a political marriage that will found a new people.

Latinus is also unable to prevent the war. His wife Amata, his betrothed-son-in-law Turnus, and (behind them) the Fury Allecto working on Juno's orders drag Italy into conflict over his protests. He retreats into his palace and refuses to participate. The Aeneid repeatedly shows this pattern: the good ruler whose goodness is insufficient against organized *furor*. Latinus prefigures the moral question the whole poem asks about the limits of *pietas*.

One historical note. Latinus is the eponym of the Latin people, and Virgil's Latinus is a figure Augustan propaganda cared about — Rome claimed descent from the Trojan-Latin fusion Latinus authorizes. The Aeneid is giving him an honor (he recognizes Aeneas's destiny at once) and a tragedy (he cannot enforce his recognition). The nuance is typical of Virgil's treatment of his political patrons' foundational myths.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "aeneid-7-allecto",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Restless Amata lay",
    anchorOccurrence: 1,
    title: "Allecto — the Fury sent to poison the peace",
    quotedPassage:
      "Restless Amata lay, her swelling breast / Fir'd with disdain for Turnus dispossess'd… / Unseen, unfelt, the fiery serpent skims…",
    passageReference: "Book VII, line 482 ff. (Dryden) · Aeneid VII.341–405",
    commentary: `Juno, defeated in the main arc but not willing to accept the settlement, goes to the underworld and recalls Allecto — one of the three Furies. She sends Allecto to Latium with a specific assignment: poison the queen, provoke Turnus, start a war. Allecto does all three, with meticulous cruelty. She drops a serpent from her hair into Amata's breast; the serpent slides beneath the queen's clothes and possesses her. Amata becomes the engine of the war the Aeneid's human characters would otherwise have avoided.

The scene is one of the Aeneid's most physically precise *possession* passages. Virgil describes Allecto's cord-snake worming into the sleeping queen's body — through folds of linen, against her skin, coiling around her heart. Amata, when she wakes, is not herself; she is Allecto in Amata's body. The Fury has taken residence.

This is Virgil's theology of violence as supernatural infection. Left to themselves, Latinus and Aeneas would have made peace. Juno cannot tolerate the peace; she invites a Fury into the world to prevent it. The war the second half of the Aeneid fights is explicitly framed as a war the human characters do not want and that a goddess has imposed. This reading complicates any triumphalist account of the poem's ending. The *bellum* Aeneas has to win is a *bellum* Juno engineered.`,
    crossReferences: [
      {
        type: "echo",
        description: "Virgil's Allecto is the ancestor of every later possessed-by-a-demon scene in Western literature, from Dante's Pluto-screaming-gibberish in Inferno VII to the New Testament's Gadarene swine to the modern horror trope. The specifically *somatic* possession — serpent into chest — is Virgil's contribution to the genre.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VII (the Allecto scene)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },
  {
    id: "aeneid-7-amata-top",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Breathless and tir\u2019d, is all my fury spent",
    anchorOccurrence: 1,
    title: "Amata as a spinning top — Virgil's strangest simile",
    quotedPassage:
      "\"Breathless and tir'd, is all my fury spent?\"",
    passageReference: "Book VII, line 412 ff. (Dryden) · Aeneid VII.378–384",
    commentary: `Virgil compares the Fury-driven Amata, running through the city rousing the women to madness, to a spinning top whipped by boys in a courtyard: the top gathers speed under each whip-stroke, the children watching, the object spinning by force applied from outside. It is one of the oddest similes in classical epic — a queen in divine possession is compared to a child's toy.

The simile is precise. Amata is not her own agent; she is being driven. The top spins because it is whipped. It *appears* to be moving under its own power; it is actually responding to impact-energy applied by someone else. That is exactly the Aeneid's model of Allecto's possession. Virgil is using a children's-game image to expose a theology of divine manipulation.

The simile is also an art-historical curiosity. It survives in reference through Virgil alone; we have no other detailed ancient description of the Roman children's-top toy. Scholars have used this passage to reconstruct what the toy was.`,
    crossReferences: [],
    tags: ["linguistic", "historical"],
  },
  {
    id: "aeneid-7-turnus-rage",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Appearing in a dream, to rouse the careless man",
    anchorOccurrence: 1,
    title: "Turnus enraged — the antagonist awakened",
    quotedPassage:
      "Allecto appears to Turnus in a dream as an aged priestess of Juno, tells him the Trojans are stealing his bride, and, when he refuses to believe her, reveals her true form and hurls a flaming torch into his chest.",
    passageReference: "Book VII, lines 570–640 (Dryden) · Aeneid VII.406–474",
    commentary: `The scene of Allecto's intervention with Turnus is one of the book's best pieces of theological-psychological writing. She approaches him in his sleep as the priestess Calybe and delivers a sober political argument: the Trojans are taking Lavinia; your kingdom is being given away; you must act. Turnus — at this moment in the narrative, a reasonable prince — dismisses her. He tells her that war is men's business, not old women's, and asks her to leave him alone.

Allecto drops the disguise. The old woman becomes a black-eyed Fury with snakes for hair, and she hurls a pine torch into his breast. Turnus wakes from the dream soaked in sweat, calls for his arms, and declares war. He has been *infected* with the *furor* he was, fifteen lines earlier, resisting.

The scene is Virgil's most careful portrait of the transition from reasonable man to possessed warrior. Turnus does not *choose* his rage; it is handed to him by a supernatural force while he sleeps. This is crucial for the Book XII ending: Turnus's entire war-career is framed as divine imposition, which means his death in XII is the death of a man who was not, in some sense, the agent of the violence he committed. The reading is difficult but the poem keeps making it available.`,
    crossReferences: [
      {
        type: "allusion",
        description: "The Book XII killing of Turnus has to be weighed against this scene. The *furor* that makes Turnus an enemy was inflicted on him by a Fury; Aeneas's killing of him is the killing of a man infected against his will. The moral ambiguity of the ending begins in Book VII.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII (the killing of Turnus)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "aeneid-7-gates-of-war",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Then on Mount Aventine the son of Jove",
    anchorOccurrence: 1,
    title: "The gates of war — Roman religion made visible",
    quotedPassage:
      "Latinus, refusing, shuts himself in his palace. Juno herself throws open the gates of the Temple of Janus — the gates that, in Roman ritual, stood open during war and closed in peace.",
    passageReference: "Book VII, lines 810–900 (Dryden) · Aeneid VII.601–622",
    commentary: `Virgil here writes the foundation of the Temple of Janus ritual. In Roman state religion, the gates of Janus's temple on the Forum stood open during war and were closed during peace. They were closed very rarely in Roman history — Augustus famously closed them in 29 BC after Actium, an event Virgil's reader remembered.

The Aeneid gives this ritual a narrative origin. Latinus, the good king, refuses to declare war and ceremonially open the gates. Juno, acting against him, opens them herself. The war is started *by the goddess*, against the wish of the legitimate ruler. The ritual that Augustus closed in 29 BC is being opened, in the poem's narrative time, against human consent.

This is a quietly sharp political point. The Roman state's most visible peace-ritual — the closing of the gates — is, by Virgil's aetiology, a human response to a war that the divine sphere imposed. Augustus closing the gates is, on this reading, a repair of an original divine wound. Virgil is flattering the regime and also acknowledging the cost of what the regime had to end.`,
    crossReferences: [],
    tags: ["historical", "mythological"],
  },
  {
    id: "aeneid-7-catalogue-mezentius",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Mezentius first appear\u2019d upon the plain",
    anchorOccurrence: 1,
    title: "The Italian catalogue — Virgil's answer to the Catalogue of Ships",
    quotedPassage:
      "Mezentius first appear'd upon the plain… / Last, from the Volscians fair Camilla came…",
    passageReference: "Book VII, lines 895–1105 (Dryden) · Aeneid VII.641–817",
    commentary: `Book VII closes with a 170-line catalogue of the Italian warriors who will fight against the Trojans. Virgil lists the captains, their weapons, their tribal origins, their personal eccentricities (Caeculus, Hercules's descendant, the barefoot Hernican tribes, Mezentius with his son Lausus, the king-and-priest Umbro, Camilla leading the Volscian cavalry). The catalogue is Virgil's deliberate answer to the Catalogue of Ships in Iliad II.

Two things make the Italian catalogue unusual. First, Virgil is cataloguing his own country — a Roman writing Italian regional pride into formal hexameter. The catalogue is an encyclopedic tribute to the peoples who, by Virgil's Augustan moment, have been consolidated under Rome. He is naming them with affection as the Trojan's soon-to-be enemies. Second, the catalogue ends on Camilla, the warrior-maiden leader of the Volsci — a woman given the closing position, which is the position of honor. Homer ends his catalogue on nondescript heroes. Virgil ends his on a woman riding into battle. Camilla's Book XI aristeia and death are foreshadowed here.

The catalogue is also the gloss-dense section of the book. Individual warriors are mostly hapax references — they appear once and die in later battles. The glosses (pending in the gloss module) handle the identification work.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad II.484–877 is the Catalogue of Ships — the listing of the Greek forces at Troy. Virgil's Italian catalogue is the deliberate answer, with the defenders catalogued rather than the invaders. The reversal is part of the Aeneid's general Iliadic inversion: the losing side is the side the poem honors.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book II (the Catalogue of Ships)",
        targetBookId: "the-iliad",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "aeneid-7-camilla-intro",
    bookId: "the-aeneid",
    chapterNumber: 6,
    anchorText: "Last, from the Volscians fair Camilla came",
    anchorOccurrence: 1,
    title: "Camilla introduced — the warrior-maiden's first appearance",
    quotedPassage:
      "Last, from the Volscians fair Camilla came, / And led her warlike troops, a warrior dame…",
    passageReference: "Book VII, lines 1094–1113 (Dryden) · Aeneid VII.803–817",
    commentary: `Camilla closes the catalogue in the place of honor. Virgil gives her a compact portrait — she rides at the head of the Volscian cavalry; she is so swift she could run over the tops of standing wheat without bending the ears; she is dedicated to Diana from infancy. She is the Aeneid's most distinctive invention — a warrior woman whose type has partial antecedents (Penthesilea, the Amazons) but whose specific character is Virgil's own.

Camilla's full arc plays out in Book XI — her *aristeia* on the battlefield, her killing by the archer Arruns, Diana's vengeance on Arruns, the funeral. This Book VII introduction is the opening chord of that aria, and Virgil is, per his signature, planting the character we will grieve for eleven books in advance.

A note on the literary afterlife. Camilla is one of the Aeneid's most influential characters for the chivalric and romance traditions: Spenser's Britomart, Ariosto's Bradamante, Tasso's Clorinda are all partly her descendants. The warrior-maiden in Western European narrative has one genealogy running through Virgil, and Camilla is the type-specimen.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Camilla's death in Book XI is the end of her arc. The Book VII introduction sets the stakes that Book XI cashes in.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XI (Camilla's aristeia and death)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 10,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
]
