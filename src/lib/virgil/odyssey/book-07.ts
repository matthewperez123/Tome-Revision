import type { Annotation } from "../types"

// Book VII: Reception of Ulysses by Alcinoüs. Homer's finest depiction of
// an ideal civilization receiving a stranger.

export const ODYSSEY_BOOK_7: Annotation[] = [
  {
    id: "odyssey-7-the-palace",
    bookId: "the-odyssey",
    chapterNumber: 7,
    anchorText: "With blue steel cornices. The doors within",
    anchorOccurrence: 1,
    title: "The Palace Description",
    quotedPassage:
      "Bronze walls, crown'd with a cornice blue as steel.",
    passageReference: "Book VII (Bryant)",
    commentary: `Homer spends fifty lines on architecture — bronze walls, a golden threshold, silver pillars, a lintel of silver, golden dogs crafted by Hephaestus standing guard, gold and silver youths holding torches. No hero has ever described a palace this carefully in any earlier epic.

The effect is double. On one hand, Alcinoüs's palace is Homer's imagination running up to its limit of material magnificence. On the other, the description feels almost dreamlike — a place the shipwrecked Odysseus comes to as if arriving in a fable. The Phaeacians are the last edge of the mortal world; their palace has to feel nearly mythic.

Gardens follow (pear trees perpetually fruiting, vines in every season) — proto-Elysian space. Virgil will put this garden in the Aeneid VI underworld; Dante will put it on the top of Mount Purgatory. Homer's Phaeacia is the headwaters of Western paradise poetry.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The garden of Alcinoüs feeds Virgil's Elysium (Aeneid VI) and Dante's Earthly Paradise (Purgatorio XXVIII). Every Western paradise-poem owes this book's description a debt.",
        workTitle: "Purgatorio",
        workAuthor: "Dante Alighieri",
        passageReference: "Canto XXVIII",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 61,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "odyssey-7-arete-addressed",
    bookId: "the-odyssey",
    chapterNumber: 7,
    anchorText: "And soon my own dear country. I have passed",
    anchorOccurrence: 1,
    title: "Addressing the Queen Before the King",
    quotedPassage:
      "Arete, daughter of Rhexenor, thy dear spouse, / And thee, and thy dear children.",
    passageReference: "Book VII (Bryant)",
    commentary: `Odysseus, following Nausicaä's instructions exactly, clasps Arete's knees, not Alcinoüs's. This is the poem's most socially unusual moment: the stranger supplicates the queen, not the king. Homer has already prepared us — everyone we meet at Scheria defers to Arete; Alcinoüs listens to her.

The Phaeacian court is Homer's one explicit matriarchy, or something close to it. Arete is addressed as sovereign; the household tilts toward her. This frames our expectations for Penelope: a queen who holds a household while her husband is away. Homer's Odyssey takes female rule seriously in a way the Iliad does not.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Arete's authority at Scheria frames the reader's sense of what Penelope's household ought to look like. The Phaeacian utopia is the measure of the dysfunction on Ithaca.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books I–II (suitors' misbehavior on Ithaca)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-7-guest-questioned-tactfully",
    bookId: "the-odyssey",
    chapterNumber: 7,
    anchorText: "Whatever, when his mother brought him forth,",
    anchorOccurrence: 1,
    title: "The Correct Order of Questions",
    quotedPassage:
      "What is thy country? ... / ... What ship / Brought thee to our land?",
    passageReference: "Book VII (Bryant)",
    commentary: `Alcinoüs asks where Odysseus is from — but only after feeding him, clothing him, setting him on a silver-studded chair. The hospitality is complete before the interrogation begins. Odysseus declines to give his name. Alcinoüs does not press. A good host waits.

This delay is structural — Odysseus will not give his name until Book IX, after Demodocus has sung of Troy and he has wept. The poem spends three books ripening the naming. Compare with Polyphemus (Book IX), who asks the name immediately. Hospitality, in Homer's code, is willing to wait for an answer.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Polyphemus asks 'Who are ye, strangers?' BEFORE feeding (Book IX). Alcinoüs asks only after. The pairing is the Odyssey's cleanest xenia-contrast.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: "Who are ye, strangers",
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-7-calypso-recounted",
    bookId: "the-odyssey",
    chapterNumber: 7,
    anchorText: "Raised by the goddess vanished. All within",
    anchorOccurrence: 1,
    title: "Odysseus's First Autobiography",
    quotedPassage:
      "Within Calypso's cave, the goddess-nymph.",
    passageReference: "Book VII (Bryant)",
    commentary: `Asked how he came to Scheria, Odysseus tells a partial story. He leaves out Troy, leaves out his name, leaves out most of the wanderings. He starts at Calypso and works back to the storm that nearly killed him. It is the first autobiography the hero gives in the poem, and it is carefully truncated.

Pay attention to how Odysseus always calibrates disclosure. To Arete and Alcinoüs, an edited brief; to the Phaeacian court in Books IX–XII, the full *apologoi* with tears; to Athena on the Ithacan beach (Book XIII), a prepared lie she sees through; to Penelope, the bed-secret alone, reserved to the last moment. Narrative self-control is the hero's art.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Odysseus's serial autobiographies (Book VII brief, Books IX–XII apologoi, Book XIII Cretan lie, Book XXIII bed-secret) constitute a running study in strategic disclosure. Homer makes the hero a narrator of himself.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books IX–XII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "odyssey-7-arete-quiet-question",
    bookId: "the-odyssey",
    chapterNumber: 7,
    anchorText: "“Stranger, I first must ask thee who thou art,",
    anchorOccurrence: 1,
    title: "Arete Recognizes Her Own Cloth",
    quotedPassage:
      "Stranger, this question I will ask thee first: / Who and whence art thou? Who gave thee these clothes?",
    passageReference: "Book VII (Bryant)",
    commentary: `Arete is the one who spots that Odysseus is wearing Phaeacian clothes — specifically, clothes she herself made. The detail is beautifully domestic. A queen knows her own weaving. Her question is the most penetrating in the scene, and Odysseus has to tell her about Nausicaä's kindness at the river.

Alcinoüs's response — nominally a scold of Nausicaä for not bringing Odysseus to the palace herself — is delivered with a wink. He knows what is happening; he is saving his daughter's reputation. The Phaeacian court handles the whole awkward situation with a grace the Ithacan palace has utterly lost.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Arete's recognition-by-clothing is a small precursor to the later great recognitions — Eurycleia by the scar (XIX), Penelope by the bed (XXIII). The Odyssey rehearses its anagnorises in miniature before the final ones.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books XIX, XXIII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 19,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-7-passage-promised",
    bookId: "the-odyssey",
    chapterNumber: 7,
    anchorText: "Is over, take your rest within your homes.",
    anchorOccurrence: 1,
    title: "A Ship Without a Captain",
    quotedPassage:
      "Our mariners shall take thee home.",
    passageReference: "Book VII, closing (Bryant)",
    commentary: `Alcinoüs promises Odysseus safe passage — the Phaeacian ships need no helmsmen, know the destination by thought alone, travel faster than any bird. The fantasy is Homer's most overt piece of technological magic.

Pay attention to the slight melancholy in the description. These are ships that could take any stranger anywhere; they are also the ships Poseidon will punish in Book XIII by turning to stone as they return home. Phaeacian magnanimity is going to cost them. The perfect society of Scheria is too generous for the world of the poem. Homer's utopia is real, and it is doomed.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The Phaeacian ship-punishment (Book XIII) is the price of their generosity. Homer's utopia is not sheltered from the jealous ordinary gods — a warning that every later utopian narrative inherits.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XIII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 13,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },
]
