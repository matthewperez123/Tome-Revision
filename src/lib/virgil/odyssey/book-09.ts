import type { Annotation } from "../types"

// Book IX: The Ciconians, Lotus-Eaters, and Cyclops.
// Preserve-first: 8 existing hand-written annotations cover the Cyclops
// scene in depth. These supplementary annotations fill the Cicones /
// Lotus-Eaters material and frame the apologoi.

export const ODYSSEY_BOOK_9: Annotation[] = [
  {
    id: "odyssey-9-naming",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "The occasion, tell him that Laertes’ son,",
    anchorOccurrence: 1,
    title: "The Naming",
    quotedPassage:
      "I am Ulysses, son of Laertes, / Whose art and wiles are known to all mankind.",
    passageReference: "Book IX, opening (Bryant)",
    commentary: `The hero names himself for the first time in the Odyssey. Eight books of suspense break at once. And Homer places this naming six hundred lines before the Cyclops episode — deliberately — so that the later hubris-shout ("Ulysses, destroyer of walled towns") at Polyphemus will echo this legitimate naming by mirror-image.

Name-giving at Scheria: safe, welcoming, no consequences. Name-giving on the Cyclops's island: catastrophic. The Odyssey is, among other things, a book about when to speak one's name.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The two namings in Book IX frame the book as a lesson in speech-ethics — the correct naming before friends, the disastrous naming before a wounded enemy.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX, line ~594",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: "Ulysses, the destroyer of walled towns",
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "odyssey-9-cicones",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "The wind that blew me from the Trojan shore",
    anchorOccurrence: 1,
    title: "The Ciconian Raid",
    quotedPassage:
      "The wind that blew me from the Trojan shore / Brought me to Ismarus, the Ciconian town.",
    passageReference: "Book IX (Bryant)",
    commentary: `Before the fantasy-geography of the wanderings begins, Odysseus does one very ordinary thing: he sacks a human city. Ismarus is on the Thracian coast, well-mapped in ancient geography. His men slaughter the Cicones, take the women, refuse to leave, drink the wine. The Cicones regroup and counter-attack, killing seventy-two Greek crewmen.

Homer stages this deliberately. The Iliad-soldier routine — sack, rape, drink, fight — is what Odysseus carries out of the Trojan War. The wanderings proper begin only when the winds blow him past the edge of this recognizable violence. The punishment of the crew for *their own folly* — Zeus's Book I theme — begins on the very first day of the return journey, not at Calypso's cave, not at Polyphemus's.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Ciconian raid is the Iliad continuing by inertia into the Odyssey's first day. The men who cannot stop looting are exactly the men who will die eating Helios's cattle in Book XII. The pattern is set.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-9-lotus-eaters",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "The Lotus-eaters, men whose food is flowers.",
    anchorOccurrence: 1,
    title: "The Lotus-Eaters",
    quotedPassage:
      "The lotus-eaters, living on the fruit / Of the sweet lotus.",
    passageReference: "Book IX (Bryant)",
    commentary: `Three crewmen eat the lotus and forget about home. Odysseus drags them back weeping to the ships and binds them to the rowing benches.

The Lotus-Eaters are the first of the wanderings' three great temptations to forget home — the others being Circe's pig-making (Book X) and Calypso's immortality (Book V, narratively later but chronologically earlier). Forgetting is the subtle antagonist of the whole middle poem. *Nostos* is the act of remembering a place long enough to return to it.

Tennyson's "The Lotos-Eaters" (1832) takes Homer's four lines and expands them into the most famous Victorian meditation on the seduction of giving up. Homer's briefness is the point: he will not linger on the temptation himself, because his hero will not.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Tennyson's 1832 'The Lotos-Eaters' is the Victorian age's definitive enlargement of Homer's four-line episode. The mariners' chorus ('Why are we weighed upon with heaviness?') is the counter-voice the Odyssey suppresses.",
        workTitle: "The Lotos-Eaters",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "1832",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "odyssey-9-apologoi-frame",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "O King Alcinoüs, most renowned of men",
    anchorOccurrence: 1,
    title: "The Apologoi Frame",
    quotedPassage:
      "O King Alcinoüs, most renowned of men!",
    passageReference: "Book IX, opening speech (Bryant)",
    commentary: `Books IX through XII are a story within a story — Odysseus narrating his own wanderings at the Phaeacian court. The frame matters: when the Cyclops speaks, he speaks inside quotation marks inside quotation marks. Homer holds the nested voice for four books.

This is a structural innovation of enormous consequence. Virgil's Aeneas will tell his wanderings to Dido (Aeneid II–III) using the same frame. Dante will have Ulysses narrate his own posthumous shipwreck in Inferno XXVI. The embedded-narrative epic has its headwaters exactly here.

The Phaeacian audience, remember, is the poem's stand-in for us. When Odysseus weeps at his own memories, the court weeps with him. Homer is teaching his audience how to listen.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Aeneid II–III replicates the apologoi frame — Aeneas tells Dido his escape from Troy and his subsequent wanderings at her Carthage court. Virgil is working directly from Homer's structure.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Books II–III",
        targetBookId: "the-aeneid",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Dante's Ulysses in Inferno XXVI speaks from inside a flame, embedded in the Comedy's own frame — a citation of Homer's nested-narrative technique across a millennium.",
        workTitle: "Inferno",
        workAuthor: "Dante Alighieri",
        passageReference: "Canto XXVI",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 25,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "odyssey-9-oar-hint",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "Ulysses, the destroyer of walled towns,",
    anchorOccurrence: 1,
    title: "The Future the Cyclops Sees",
    quotedPassage:
      "Cyclops, if any of the sons of men / Ask how thy eye was put out, tell them thus: / Ulysses, the destroyer of walled towns.",
    passageReference: "Book IX, lines ~592–595 (Bryant)",
    commentary: `This is the same passage anchored by the hand-written annotation *odyssey-9-hubris*, which covers the pride and the consequent curse. Note here only that the Cyclops, just before cursing Odysseus, prophesies part of his future: a stranger shall come and blind him, and the stranger will be named. The prophecy is already fulfilled in the moment of its speaking.

Dante seized on this in Inferno XXVI. He invents a further voyage — Ulysses sailing past Gibraltar toward a sight of Purgatory's mountain — and has it end in shipwreck, punishment for the very naming that Homer recorded. Dante read this moment as the seed of a transgression Homer left open.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Dante's Inferno XXVI invents Ulysses's post-Ithaca voyage as the metaphysical consequence of this moment of self-naming. The hubris Homer lets stand is what Dante punishes.",
        workTitle: "Inferno",
        workAuthor: "Dante Alighieri",
        passageReference: "Canto XXVI",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 25,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
]
