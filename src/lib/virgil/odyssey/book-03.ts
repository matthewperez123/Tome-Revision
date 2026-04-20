import type { Annotation } from "../types"

// Book III: Interview of Telemachus with Nestor. The first model of xenia
// the Telemachy will exhibit, and the first retrospective glance back at
// the Trojan War.

export const ODYSSEY_BOOK_3: Annotation[] = [
  {
    id: "odyssey-3-pylos-sacrifice",
    bookId: "the-odyssey",
    chapterNumber: 3,
    anchorText: "Five hundred on each seat; nine steers were slain",
    anchorOccurrence: 1,
    title: "The Pylian Hecatomb",
    quotedPassage:
      "Nine benches, and five hundred sat at each, / And oxen nine for each.",
    passageReference: "Book III, opening (Bryant)",
    commentary: `Telemachus arrives at Pylos mid-sacrifice. Eighty-one oxen to Poseidon, laid out in nine rows of nine — Homer specifies because he wants the reader to feel the scale. Nestor's Pylos is a functioning ritual state. This is what Ithaca should look like.

The Odyssey uses sacrifice as a barometer of civilization. Nestor sacrifices to the sea-god properly; Odysseus's men will botch the cattle of Helios (XII) and die for it; the suitors sacrifice nothing and consume everything. Book III's opening is a silent commentary on every feast that has come before it in the poem.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare the suitors' feast in Books I–II — all consumption, no offering. Nestor's hecatomb is Homer's positive benchmark.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books I–II",
        targetBookId: "the-odyssey",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "mythological"],
  },
  {
    id: "odyssey-3-nestor-speaks",
    bookId: "the-odyssey",
    chapterNumber: 3,
    anchorText: "Say then, O strangers, who ye are, and whence",
    anchorOccurrence: 1,
    title: "Xenia Before Identity",
    quotedPassage:
      "Strangers, who are ye? Whence have ye sailed? / ... but these questions not until / The guests had eaten.",
    passageReference: "Book III (Bryant)",
    commentary: `Nestor feeds Telemachus BEFORE asking his name. This is textbook xenia, the same order Telemachus followed for Athena-as-Mentes in Book I. Hospitality's first law: food before interrogation.

The Cyclops (Book IX) will invert this precisely — asking the name first, then eating the guests. Homer composes Polyphemus's scene as the photographic negative of Pylos. Every Homeric guest-scene in the Odyssey is measured against Nestor's.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Polyphemus in Book IX asks the name BEFORE feeding, and eats his guests instead. The structural inversion is deliberate.",
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
    id: "odyssey-3-agamemnon-story",
    bookId: "the-odyssey",
    chapterNumber: 3,
    anchorText: "Men of strange speech. Aegisthus meantime planned",
    anchorOccurrence: 1,
    title: "Nestor Returns to the Aegisthus Parable",
    quotedPassage:
      "Aegisthus planned an evil thing, / And slew Atrides at the banquet.",
    passageReference: "Book III (Bryant)",
    commentary: `Zeus's Book I parable becomes Nestor's told story. Nestor spells out what Zeus only alluded to: Agamemnon's return was not a homecoming but an ambush; his palace was occupied; his wife betrayed him; his son Orestes avenged him years later.

Every word of this is aimed at Telemachus. Nestor is holding up a mirror: your father's situation is Agamemnon's. Your house is occupied. Your mother is being courted. You are Orestes. *Act.* Homer's technique here is exceptional — exposition becomes exhortation becomes character-formation all at once. By the end of the speech Telemachus has aged.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Aeschylus's Oresteia trilogy takes the shards of Nestor's summary and expands them into three plays. The Odyssey's paralleling of Odysseus-to-Agamemnon is the seed of Greek tragedy's obsession with the House of Atreus.",
        workTitle: "The Oresteia",
        workAuthor: "Aeschylus",
        passageReference: "458 BCE",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-3-nestor-old-age",
    bookId: "the-odyssey",
    chapterNumber: 3,
    anchorText: "A worthy fame among the sons of men:\uFEFF—",
    anchorOccurrence: 1,
    title: "The King of Three Generations",
    quotedPassage:
      "Three generations of the sons of men / Has he outlived.",
    passageReference: "Book III (Bryant)",
    commentary: `Homer's most memorable detail about Nestor: he has outlived three human generations. He is the Odyssey's living archive — the man who remembers Jason's Argo, the Calydonian boar hunt, the youth of Achilles's father.

Homer's attitude toward old age is complicated. Laertes is broken by it (XXIV); Penelope fears it; the shade of Achilles in Book XI would trade all the glory of his brief life for a day as an old farmhand. But Nestor holds old age as a kind of grace — the long-lived witness, kept on earth because his memory is useful. The Odyssey privileges age in a way the Iliad (written for a culture that exalted young warriors) does not.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Tennyson's elderly Ulysses in his 1833 poem takes Nestor's long-memory weight and gives it to Odysseus himself — old age as restlessness rather than authority.",
        workTitle: "Ulysses",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "1833",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-3-athena-reveals-self",
    bookId: "the-odyssey",
    chapterNumber: 3,
    anchorText: "Pallas, the blue-eyed goddess, spake again:\uFEFF—",
    anchorOccurrence: 1,
    title: "Athena in Likeness of a Sea-Eagle",
    quotedPassage:
      "The blue-eyed goddess, when the prayer was made, / Ascended, in the likeness of a sea-eagle.",
    passageReference: "Book III (Bryant)",
    commentary: `After a pious libation, Athena drops the Mentor-mask and flies away as a great sea-eagle. Nestor, who has seen the gods work before, reads the sign instantly. His reaction is the most balanced response to divinity anywhere in Homer — he is neither terrified nor proud, just matter-of-fact: *this is how things are in the world; now we give a proper thanks-offering.*

The transformation also tells Telemachus, for the first time without disguise, that Athena herself has been guiding him. The Telemachy began as a boy's doubtful journey; it now becomes a known-to-be-divine mission. His confidence thereafter is different.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Athena's bird-departures echo across the Odyssey (the eagles at Telemachus's assembly in II, her farewell in III as a sea-eagle). Birds are the poem's favored theophany.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books II, III",
        targetBookId: "the-odyssey",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "historical"],
  },
  {
    id: "odyssey-3-peisistratus-companion",
    bookId: "the-odyssey",
    chapterNumber: 3,
    anchorText: "Came brave Peisistratus, the sixth and last.",
    anchorOccurrence: 1,
    title: "Peisistratus — A Peer at Last",
    quotedPassage:
      "Peisistratus, with reins in either hand, / Rode with him.",
    passageReference: "Book III, closing (Bryant)",
    commentary: `Telemachus leaves Pylos for Sparta accompanied by Peisistratus, Nestor's youngest son — roughly Telemachus's age, and the first peer he has had in the poem. Until now Telemachus has been surrounded by suitors (enemies) and old men (guides). Here is someone like him.

The friendship is underdeveloped by modern standards — they ride, they share a bed at a guest-house, they pray together at Sparta — but its presence is the quiet point. Part of growing up is meeting equals. The Telemachy gives Telemachus his first.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Iliad pairs — Achilles and Patroclus, Glaucus and Diomedes — are fight-bonds or gift-bonds. Telemachus and Peisistratus are something newer: unaffiliated youths traveling together. It is the template for later epic friendship.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book 16 (Patroclus)",
        targetBookId: "the-iliad",
        targetChapterNumber: 16,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "odyssey-3-golden-cup-libation",
    bookId: "the-odyssey",
    chapterNumber: 3,
    anchorText: "Will give the golden goblet first to thee.”",
    anchorOccurrence: 1,
    title: "The Golden Cup",
    quotedPassage:
      "A golden cup to honor first with wine / The blue-eyed maid.",
    passageReference: "Book III (Bryant)",
    commentary: `Nestor's golden cup reappears in the Iliad (Book XI) as a famously ornate battlefield heirloom. Bryant's Odyssey lets it resurface in its quieter, domestic use: the vessel of a libation in a hall at peace. The Iliad's warriors drink to prepare for slaughter; the Odyssey's elders drink to honor the goddess who has just left.

Homer's objects have lives. The same cup in two poems reads differently; the same bow (Book XXI) has a biography; the same bed (Book XXIII) is a piece of the house's unmoving center. The Odyssey is a poem partly told through the things that outlast the people.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The Nestor cup inspired Heinrich Schliemann to identify an actual gold cup at Mycenae as Homer's; the Mycenae 'Cup of Nestor' is at the National Archaeological Museum, Athens. Homer's realism about objects is part of what drew 19th-century archaeology to take the poems seriously.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XI",
        targetBookId: "the-iliad",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "odyssey-3-bathing-polycaste",
    bookId: "the-odyssey",
    chapterNumber: 3,
    anchorText: "Meantime, fair Polycastè, youngest born",
    anchorOccurrence: 1,
    title: "Polycaste Bathes the Guest",
    quotedPassage:
      "Polycaste, the fair youngest child / Of Nestor ... bathed him in the bath.",
    passageReference: "Book III (Bryant)",
    commentary: `A modern reader flinches — the king's young daughter bathes the teenage guest. Homer does not flinch. The guest-bath is a ceremonial act, the formal welcome of a stranger into the household; its performance by the household's daughter indicates the household's full honor.

The scene is important because it establishes the ritual Eurycleia will perform in Book XIX for the disguised Odysseus. When Eurycleia's hand finds the scar, she is performing the same ceremony Polycaste performs here — and recognizing the guest as family. The ritual itself is the vehicle of the recognition. Polycaste's innocent bath-scene becomes, fifteen books later, the deepest anagnorisis in the poem.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Eurycleia's bath of the disguised Odysseus in Book XIX is the echo of this scene. Recognize the same ceremony; feel the difference in weight.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XIX, lines ~470–500",
        targetBookId: "the-odyssey",
        targetChapterNumber: 19,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
]
