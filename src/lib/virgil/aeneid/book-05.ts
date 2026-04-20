import type { Annotation } from "../types"

// ── Aeneid Book V — the funeral games ───────────────────────────────────
// Dryden translation; anchors line-exact against public/content/the-aeneid/ch-4.json.
//
// Book V is Virgil's direct rewrite of Iliad XXIII — the funeral games
// for Patroclus. Virgil transposes the setting: games for Anchises on
// the anniversary of his death, on Sicilian soil. Four contests (ship-
// race, footrace, boxing, archery), the divine omens, the burning of
// the ships by the Trojan women, the loss of Palinurus. Tonally lighter
// than Books II and IV but structurally load-bearing: Book V is where
// Aeneas steadies the remnant before the descent of Book VI.

export const AENEID_BOOK_5: Annotation[] = [
  {
    id: "aeneid-5-games-opening",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "This would I celebrate with annual games",
    anchorOccurrence: 1,
    title: "The games for Anchises — Iliad XXIII rewritten",
    quotedPassage:
      "\"This would I celebrate with annual games…\"",
    passageReference: "Book V, line 65 (Dryden) · Aeneid V.42–103",
    commentary: `The book announces itself as a rewriting of Iliad XXIII. Aeneas institutes funeral games at the tomb of his father Anchises, exactly a year after the Book III death. The four contests — ship-race, footrace, boxing, archery — correspond to four of the events Achilles held for Patroclus in the Iliadic Book XXIII. Virgil is declaring the inheritance explicitly.

The re-functioning is characteristic. Homer's funeral games are for a single man, an act of honor between warriors. Virgil's games are for a father, but they are also *civic* — a community-building ritual that binds the surviving Trojans together after years of wandering. The Aeneid absorbs Homer's pageant and reassigns its purpose from individual honor to civic continuity.

One technical note: these are the first *Roman* games in the Aeneid. The language of public festival, the roles of judges and stewards, the prizes — Virgil is importing Roman institutional vocabulary into a pre-Roman setting. His reader in 19 BC would recognize the civic technology even on the Sicilian sand.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad XXIII — the funeral games for Patroclus. Virgil's four contests parallel Homer's chariot race, boxing match, wrestling, footrace, and archery. The structural inheritance is one of the Aeneid's most formally visible Homeric echoes.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXIII (the funeral games)",
        targetBookId: "the-iliad",
        targetChapterNumber: 23,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "aeneid-5-serpent-tomb",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "A serpent from the tomb began to glide",
    anchorOccurrence: 1,
    title: "The serpent at the tomb — Anchises acknowledged",
    quotedPassage:
      "A serpent from the tomb began to glide…",
    passageReference: "Book V, line 112 (Dryden) · Aeneid V.84–93",
    commentary: `While Aeneas is making libations at his father's tomb, a great serpent emerges from the barrow, coils around the altar, and accepts the offering before sliding back in. Aeneas is uncertain whether this is Anchises's attendant spirit (*genius loci*) or the genius of the place. He treats it as either and completes his rites.

Two observations.

**The scene is Roman-religious, not Greek-mythological.** Serpents as tomb-genii are specifically Italian; Virgil is showing the Trojans practicing a form of ancestor-veneration that will evolve into Roman domestic religion. The blur between Trojan and Italian rites is already active in Book V, four books before the Italian landfall.

**Virgil writes the interpretive uncertainty into the text.** Aeneas does not know what he has seen. He proceeds with the ritual. This is the Aeneid's practical theology: you do not need to know which god is showing up; you owe the rites to whichever god IS showing up. The reverence is primary; the identification is secondary. This is different from the Homeric world, where heroes generally know which god they are dealing with.`,
    crossReferences: [],
    tags: ["historical", "mythological"],
  },
  {
    id: "aeneid-5-boxing-match",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "Then haughty Dares in the lists appears",
    anchorOccurrence: 1,
    title: "Dares and Entellus — the Virgilian boxing match",
    quotedPassage:
      "Then haughty Dares in the lists appears…",
    passageReference: "Book V, line 486 ff. (Dryden) · Aeneid V.362–484",
    commentary: `The boxing match between the young Trojan Dares and the aged Sicilian Entellus is one of Virgil's liveliest set pieces. Entellus has not boxed in years; his gauntlets — weighted leather thongs studded with lead and iron — are older than Dares. When he finally wins, he spares Dares at Aeneas's command and, refusing another fight, slaughters an ox with a single blow to demonstrate the punch he would have used.

The scene is a small anthology of what Virgil's Aeneid does well with physical action: exact weapons-detail (the *caestus* gauntlets are described as heirlooms of Eryx, Entellus's former trainer); the body of the old man registered without sentimentality; the violence averted by a civilizing gesture (Aeneas stops the fight). It is, in miniature, the poem's whole tonal palette applied to a prizefight.

The ox-slaughter-substitute has been read as a hint of *ritual-replacement-of-violence*. The animal dies instead of the man. That is the Roman sacrificial logic operating inside an athletic contest.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad XXIII.651–699 — Epeios and Euryalos box for Patroclus's funeral prize. Virgil's scene is an explicit rewriting, with the older fighter winning (reversing Homer's outcome) and ritual substitution closing the violence.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXIII, lines 651–699",
        targetBookId: "the-iliad",
        targetChapterNumber: 23,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "aeneid-5-nisus-euryalus-first",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "First Nisus, with Euryalus, appears",
    anchorOccurrence: 1,
    title: "Nisus and Euryalus introduced — the foreshadowing",
    quotedPassage:
      "First Nisus, with Euryalus, appears…",
    passageReference: "Book V, line 385 ff. (Dryden) · Aeneid V.315–339",
    commentary: `Nisus and Euryalus appear together in the footrace. Nisus slips on animal blood near the finish line; to help his friend win, he deliberately trips the runner who would have passed Euryalus. Aeneas awards both of them prizes. Virgil writes the scene with affection and sets up, casually, the pair who will be the protagonists of the night-raid tragedy in Book IX.

This is a signature Virgilian move: introduce a pair in a comic-athletic key, then use them in a tragic key four books later. The affection the reader forms in Book V for Nisus's sacrificial gesture toward Euryalus pays off in Book IX when Nisus risks (and loses) his life trying to save Euryalus from Volscian capture. The Aeneid's tragic weights are prepared long before they fall.

The relationship is also the poem's most explicit same-sex pairing, and its treatment is tender without being sentimental. Virgil will address them directly as *fortunati ambo* — "happy both" — in Book IX, one of the poem's five canonical apostrophes. See the Book IX annotation on Nisus and Euryalus for the full arc.`,
    crossReferences: [
      {
        type: "allusion",
        description: "The Book IX night-raid (lines 176–449 Latin) is where Nisus and Euryalus die together. Virgil's Book V introduction is the first beat of a two-book character-arc; the comic footrace prepares the tragedy.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IX (the night-raid)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "aeneid-5-women-burn-ships",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "If he should still in Sicily reside",
    anchorOccurrence: 1,
    title: "The women burn the ships — the crisis of Book V",
    quotedPassage:
      "If he should still in Sicily reside…",
    passageReference: "Book V, line 919 ff. (Dryden) · Aeneid V.604–699",
    commentary: `Juno, still the poem's antagonist, sends Iris to the Trojan women sitting apart on the beach while the men watch the games. Iris, disguised as an older woman, argues that they have been at sea long enough — seven years — and should force a settlement in Sicily by burning the ships. The women, exhausted and persuaded, light the fleet.

Four of the ships burn before Jupiter (in response to Aeneas's prayer) sends rain that saves the rest. Aeneas, shaken, considers settling in Sicily after all. An old Trojan, Nautes, counsels him to split the population — those who are tired can stay with King Acestes in Sicily; those with the stomach for Italy can sail on. Anchises appears in a dream to Aeneas that night and confirms the plan, adding: "Seek out the Sibyl at Cumae; meet me in Elysium."

This is the structural turn into Book VI. The settlement of the weaker Trojans in Sicily is both a compassionate concession and a narrowing of the company. The people who continue to Italy are the people willing to finish the journey. Virgil is writing, through plot, the Roman civic ideal of self-selection: you are part of the project by choice, and those who cannot continue are honorably dismissed.`,
    crossReferences: [],
    tags: ["mythological", "historical", "philosophical"],
  },
  {
    id: "aeneid-5-palinurus-sleep",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "The pilot, Palinurus, cried aloud",
    anchorOccurrence: 1,
    title: "The death of Palinurus — the cost of a safe passage",
    quotedPassage:
      "The pilot, Palinurus, cried aloud…",
    passageReference: "Book V, line 18, closing at 1130 ff. (Dryden) · Aeneid V.833–871",
    commentary: `Book V ends on the quietest of its losses. Neptune has granted the fleet safe passage to Italy on the condition that one life is exchanged. The god of sleep descends, disguised as Phorbas, and tries to talk Palinurus the helmsman into leaving his post. Palinurus refuses — he will not abandon the tiller in fair weather. Somnus throws him overboard holding a branch of Lethe, and Palinurus is lost.

The scene is morally strange. Palinurus has done nothing wrong. He has, in fact, been the *most* faithful member of the crew — the man who stays at his station when the god is explicitly trying to pull him away. The universe of the Aeneid kills him anyway, as the price of the calm voyage the others experience. Neptune's bargain is the theology made explicit: progress requires payment, and the payment is extracted from those who are *faithful*, not those who deserve it.

Aeneas, waking, discovers the loss and says one of the saddest lines in the Aeneid: *ō nimium caelō et pelagō cōnfīse serēnō, / nūdus in ignōtā, Palinūre, iacēbis harēnā* — "O Palinurus, you who trusted too much in clear sky and calm sea, you will lie naked on an unknown shore." Dryden renders the grief; the Latin is more compact.

The Palinurus loss prepares the Book VI Styx scene, where Aeneas will meet his shade and the Sibyl will promise him a named grave. The Book V ending and the Book VI Styx-encounter are a single continuous grief, sliced by the chapter break.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Palinurus's shade reappears at the Styx in Book VI, line 461 (Dryden) — begging to cross without a burial. The Book V death and the Book VI encounter are two halves of one arc.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI (Palinurus at the Styx)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "aeneid-5-anchises-dream",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "In sleep I saw her",
    anchorOccurrence: 1,
    title: "Anchises appears in a dream — the pivot to Book VI",
    quotedPassage:
      "In sleep I saw her; she supplied my hands…",
    passageReference: "Book V, line 829 ff. (Dryden) · Aeneid V.722–745",
    commentary: `After the fire and the counsel of Nautes, Anchises's shade appears to Aeneas in a dream. He confirms the division of the company, tells Aeneas that the war in Italy will be hard, and instructs him: seek out the Sibyl at Cumae, descend to the underworld, meet me there. "I will show you your race."

The dream is structurally the pivot into Book VI. Book V has been a return to stability (the games, the civic logic of the settlement); Book VI will be the poem's deepest descent. Virgil makes the transition not by plot-machinery but by a father's dream-voice, and the voice is issuing the invitation that becomes the next book. It is one of the cleanest book-to-book hand-offs in epic.

Anchises's promise — "I will show you your race" — is the Elysium parade of heroes delivered in advance. The reader arrives at Book VI with the cue already in ear.`,
    crossReferences: [
      {
        type: "allusion",
        description: "The Book VI descent is the fulfillment of this dream; the parade of heroes in Elysium is the 'race' Anchises promises here.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "aeneid-5-archery-omen",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "The strife of archers with contending bows",
    anchorOccurrence: 1,
    title: "The archery omen — Acestes' arrow catches fire",
    quotedPassage:
      "The strife of archers with contending bows.",
    passageReference: "Book V, line 647 ff. (Dryden) · Aeneid V.485–544",
    commentary: `The archery contest ends with a prodigy. The Trojans have set a live dove on a mast-top as the target. One contestant hits the cord; the dove escapes. Another hits the dove in flight. Old King Acestes, the Sicilian host, shoots his arrow into the air as a ceremonial release — and the arrow catches fire and traces a streak through the sky, vanishing into space.

Virgil writes this as a genuine omen, unparsed. Aeneas treats it as a sign of future glory and gives Acestes the top prize, above the archer who actually hit the bird. The scene is the book's clearest portrait of how civic honor and divine signalling are both managed by the same ruler. Aeneas, reading the omen, is also constructing the ritual.

The flaming-arrow-in-the-sky image survives in Roman cultural memory as a public-spectacle element; Suetonius reports that comets and meteors were regarded as signs at major state moments in Augustus's lifetime. Virgil is writing a foundation-scene for the Roman habit of reading the sky.`,
    crossReferences: [],
    tags: ["mythological", "historical"],
  },
  {
    id: "aeneid-5-sicily-settlement",
    bookId: "the-aeneid",
    chapterNumber: 4,
    anchorText: "Whose hallow\u2019d earth Anchises\u2019 bones contains",
    anchorOccurrence: 1,
    title: "Anchises in Sicilian soil — the founding of a cult",
    quotedPassage:
      "Whose hallow'd earth Anchises' bones contains…",
    passageReference: "Book V, line 40 ff. (Dryden) · Aeneid V.47–103",
    commentary: `Book V opens with the Trojans arriving, by chance or current, at the Sicilian port where Anchises died a year before. Aeneas interprets the landfall as providential and institutes annual games for his father. The tomb of Anchises at Drepanum becomes a cult site; the games become an anniversary; a piece of Italian soil is claimed for a Trojan dead.

Virgil is doing something specifically Roman here. The *parentalia* — the annual rites for the family dead — was an enormous piece of Roman domestic religion. By instituting these games for Anchises, Aeneas is founding, in the narrative, the type-site for a rite that every Roman family of Virgil's era practiced. The poem is writing an aetiology for a real religious calendar.

The Sicilian Trojans Aeneas will leave behind in this book become the caretakers of this cult. When the main company sails on, they are leaving their father-in-myth with a permanent congregation on the island. The *parentalia* is older than Rome; the Aeneid is saying, via mythological charter, that it came with the Trojans.`,
    crossReferences: [],
    tags: ["historical", "mythological"],
  },
]
