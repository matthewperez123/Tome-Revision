import type { Annotation } from "../types"

// Book V: Departure of Ulysses from Calypso. Odysseus, offstage for four
// books, finally appears — and the first thing we see him do is weep.

export const ODYSSEY_BOOK_5: Annotation[] = [
  {
    id: "odyssey-5-hero-first-seen",
    bookId: "the-odyssey",
    chapterNumber: 5,
    anchorText: "Him kindly I received; I cherished him,",
    anchorOccurrence: 1,
    title: "The Hero First Seen",
    quotedPassage:
      "Him she beheld on the seashore / Weeping, and looking out upon the deep, / That never ceased to weep.",
    passageReference: "Book V (Bryant)",
    commentary: `This is Odysseus's first appearance in the poem that bears his name. After four books of absence — of other people talking about him — we finally meet him. He is crying on a beach.

No other epic hero is introduced this way. Achilles enters the Iliad arguing in a tent; Aeneas enters the Aeneid fighting a storm. Odysseus enters the Odyssey wanting to go home and unable to. The *polytropos* of Book I turns out, on first view, to be a man paralyzed by homesickness.

Homer has prepared this shock: we have heard Odysseus described as resourceful, many-minded, city-sacking, godlike. We meet a weeping castaway. The gap between reputation and reality is the Odyssey's foundational subject.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare Odysseus's tearful entrance with Achilles's first appearance in Iliad I — arguing Agamemnon in public assembly. Two epic heroes, opposite introductions.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book I",
        targetBookId: "the-iliad",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-5-calypso-immortality",
    bookId: "the-odyssey",
    chapterNumber: 5,
    anchorText: "And promised him a life that ne’er should know",
    anchorOccurrence: 1,
    title: "Calypso Offers Immortality",
    quotedPassage:
      "I could promise him that he should live / Exempt from age and death.",
    passageReference: "Book V (Bryant)",
    commentary: `Calypso has been offering Odysseus immortality for seven years. He keeps refusing. This is the Odyssey's moral center — the hero chooses home, mortality, an aging wife, a son he barely knows, over eternal life in the arms of a goddess.

The scandal, if you pause over it, is enormous. Achilles in Iliad IX chose a short glorious life over a long obscure one; that choice is heroic by Homer's older logic. Odysseus here chooses a long *unglorious* life over an eternal one — a life that will end at Ithaca, probably quietly, probably old. It is a humbler metaphysics than Achilles's and a deeper one.

The shade of Achilles in Book XI will confirm it: the dead Iliadic hero tells Odysseus he would rather be a farmhand's slave than king among the dead. The Odyssey has quietly rewritten what the Iliad meant by a good life.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Achilles in Book XI — 'I would rather be a hired hand for a landless man than king among the dead' — is the voice that confirms Odysseus's Book V choice. The Iliad's code of brief glorious life is reassessed by its own greatest hero.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XI",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-5-calypso-complaint",
    bookId: "the-odyssey",
    chapterNumber: 5,
    anchorText: "To men and to immortals. Then the gods",
    anchorOccurrence: 1,
    title: "Calypso's Feminist Complaint",
    quotedPassage:
      "Hard-hearted are ye, gods, and envious / Above all others, who, when goddesses / Love mortal men, still grudge them happiness.",
    passageReference: "Book V (Bryant)",
    commentary: `When Hermes delivers Zeus's order for Odysseus's release, Calypso erupts. Her speech is the first bitterly feminist complaint in Western literature. Gods get to sleep with mortal women (she lists examples — Eos and Orion, Demeter and Iasion). But when a goddess takes a mortal lover, Olympus intervenes. The double standard is ancient; Homer has her name it.

Calypso yields, but her yielding is not submission. She will even help Odysseus build the raft. There is a tenderness in her last scenes with him that exceeds what the plot requires. Homer doesn't resolve the pathos; he lets it stand.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The divine-female lover who loves and loses a mortal man is a pattern reworked by Virgil as Dido in Aeneid IV — another woman abandoned when the hero's fate calls him elsewhere. Virgil's Dido explicitly recalls Calypso's complaint.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV",
        targetBookId: "the-aeneid",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-5-raft-building",
    bookId: "the-odyssey",
    chapterNumber: 5,
    anchorText: "Dismiss thee hence. Rise, hew down trees, and bind",
    anchorOccurrence: 1,
    title: "The Raft as Hero's Return",
    quotedPassage:
      "He felled the trees, and twenty were cast down.",
    passageReference: "Book V (Bryant)",
    commentary: `Homer describes Odysseus building his raft for fifty lines — every tool, every dowel, every ring-pin, every caulked seam. No other hero in ancient epic builds his own transportation. This is Homer's image of *mētis* rendered in carpentry: the hero rescues himself by technical skill.

The same skill will appear later as the unmovable bed of olive-wood (Book XXIII) and the blinding stake in the Cyclops's cave (Book IX). Odysseus's body of expertise is craft. It is why he survives the wanderings while none of his companions do. A man who can build his own escape needs no golden fleece.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The olive-wood bed in Book XXIII is the domestic mirror of this raft — the same carpenter-hero, the same materials-awareness, applied at the poem's beginning and end of the wanderings.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XXIII, lines ~244–250",
        targetBookId: "the-odyssey",
        targetChapterNumber: 23,
        targetAnchorText: "Whether my bed remains as then it was",
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-5-poseidon-storm",
    bookId: "the-odyssey",
    chapterNumber: 5,
    anchorText: "The power who shakes the shores is wroth with me.”",
    anchorOccurrence: 1,
    title: "Poseidon's Storm",
    quotedPassage:
      "Then Neptune, who shakes the shore, beheld / Ulysses on his way.",
    passageReference: "Book V (Bryant)",
    commentary: `Poseidon — returning from Ethiopia (Book I) — sees Odysseus on the open sea and strikes. The storm that follows is one of the most physically vivid set-pieces in ancient literature: the shattered raft, the hero clinging to a timber, the dawn that shows no land.

The Cyclops's curse (Book IX) is being paid here. Homer is rigorous about causation: Polyphemus asked Poseidon to make Odysseus wander; this storm is the interest compounding. Virgil's Aeneid will open with a Juno-sent storm that is a direct rewrite of this scene — the post-Trojan voyager attacked by a hostile god. The Aeneid begins where the Odyssey's hero first appears.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The Aeneid's opening storm (Book I, lines 81–156) is Virgil's deliberate rewrite of this scene — same genre, same position (early in the poem), same divine antagonist-logic. Poseidon's curse becomes Juno's.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, lines 81–156",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "odyssey-5-ino-veil",
    bookId: "the-odyssey",
    chapterNumber: 5,
    anchorText: "The veil that Ino gave him from his breast,",
    anchorOccurrence: 1,
    title: "Ino's Veil",
    quotedPassage:
      "Leucothea, the white goddess, once a mortal, / Daughter of Cadmus.",
    passageReference: "Book V (Bryant)",
    commentary: `Ino, a mortal woman turned sea-goddess, gives Odysseus her veil — wear it on your chest, you will not drown, throw it back once you are safe. The gift is an object of grace given to a stranger by a woman who once suffered on land herself. She knows what drowning is.

Homer accumulates female helpers across the poem — Ino, Athena, Nausicaä, Arete, Circe-as-guide, Eurycleia, Penelope. No other epic is so determined to show that the hero's survival depends on specific acts of female generosity. The Iliad's women grieve and plead; the Odyssey's women rescue.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The pattern of female-helper-goddess returns in Virgil via Venus's interventions for Aeneas, but Virgil's goddess-mother acts from blood. Homer's Ino acts out of fellow-feeling for a stranger — a different moral coloring.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Books I, VIII",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },
  {
    id: "odyssey-5-octopus-simile",
    bookId: "the-odyssey",
    chapterNumber: 5,
    anchorText: "But when, in swimming, he had reached the mouth",
    anchorOccurrence: 1,
    title: "The Octopus Simile",
    quotedPassage:
      "As when the polypus is dragged from out / Its chambered rock, and on its suckers clings / The pebbles.",
    passageReference: "Book V (Bryant)",
    commentary: `One of the most arresting similes in all of Homer. When Odysseus is torn from the rocks by a receding wave, Homer compares the skin of his hands coming off the rocks to an octopus being pulled from its hole with pebbles stuck to its suckers.

The image is physical, biological, startlingly close. No modern novelist would dare it; Homer has been looking at octopuses. The Odyssey's similes do not idealize — they observe. The hero's suffering is given in terms of a small marine animal's injury, and the reader feels it.

Joseph Brodsky called this the most truthful simile in ancient literature. Longinus, in *On the Sublime*, uses Homer's similes to argue that great literature's sublimity comes from concrete honesty rather than abstraction.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Longinus in On the Sublime (c. 1st century CE) lifts Homer's concrete similes as his primary evidence that sublimity requires realistic observation — not abstraction.",
        workTitle: "On the Sublime",
        workAuthor: "Longinus",
        passageReference: "Sections 9–10",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "odyssey-5-washed-ashore",
    bookId: "the-odyssey",
    chapterNumber: 5,
    anchorText: "As when some builder, skilful in his art,",
    anchorOccurrence: 1,
    title: "The Hidden Ember",
    quotedPassage:
      "As when a brand some traveller has dropped / Hides under grey embers.",
    passageReference: "Book V, closing (Bryant)",
    commentary: `The book ends with Odysseus safe at last, buried in leaves like a live ember under ash. The simile is quiet and exact: a man who has been a storm's plaything, reduced to a concealed spark.

It is the image the Odyssey will spend the next eighteen books activating. Odysseus-as-beggar in Ithaca, Odysseus-as-stranger at the Phaeacian court, Odysseus-under-disguise-in-his-own-hall — every one of them is the hidden ember. The poem is about concealment and the moment the ember is finally blown back into flame.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The hidden-fire image recurs throughout the Odyssey's middle — Odysseus disguised, waiting, ready. Book V's ember is the master metaphor for everything that follows until the bow is strung in Book XXI.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XXI",
        targetBookId: "the-odyssey",
        targetChapterNumber: 21,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
]
