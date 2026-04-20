import type { Annotation } from "../types"

// Book I: Visit of Pallas to Telemachus.
// Preserve-first: the two hand-written annotations in annotations.ts
// (odyssey-1-invocation, odyssey-1-xenia-athena) are authoritative.
// These supplementary annotations fill gaps in the divine council, the
// Telemachy frame, and the suitors' portrait.

export const ODYSSEY_BOOK_1: Annotation[] = [
  {
    id: "odyssey-1-aegisthus-parable",
    bookId: "the-odyssey",
    chapterNumber: 1,
    anchorText: "How strange it is that mortals blame the gods",
    anchorOccurrence: 1,
    title: "Zeus's Parable: The Aegisthus Frame",
    quotedPassage:
      "How strange it is that mortals blame the gods / And say that we inflict the ills they bear, / When they, by their own folly and against / The will of fate, bring sorrow on themselves!",
    passageReference: "Book I, lines ~43–51 (Bryant)",
    commentary: `The poem opens not on Odysseus but on Zeus making a speech about responsibility. Aegisthus — who seduced Clytemnestra and murdered Agamemnon on his return from Troy — was *warned* by Hermes, and did it anyway. Zeus's point is theological and moral at once: suffering is not arbitrary punishment but earned by choice.

This is the frame the whole Odyssey is built on. Watch for it to recur: the crewmen eating Helios's cattle (Book XII), the suitors consuming Odysseus's substance (Books II, XXII), even Polyphemus (Book IX) — each violates a warned-against limit and is destroyed. The Aegisthus story is the template; the Odyssey is its elaboration.

The Iliad's gods act from partisanship and anger. The Odyssey's gods, in this opening speech, act as underwriters of moral causality. It is a different universe.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Contrast with the Iliad's opening theology — Apollo's plague in Book I is a god's personal vengeance, not a consequence of mortal choice.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book I",
        targetBookId: "the-iliad",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Aeschylus builds his Oresteia trilogy on the same Aegisthus / Clytemnestra / Orestes triangle Zeus invokes here — Homer's passing allusion became three Attic tragedies.",
        workTitle: "The Oresteia",
        workAuthor: "Aeschylus",
        passageReference: "Agamemnon, Libation Bearers, Eumenides",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "odyssey-1-athena-plan",
    bookId: "the-odyssey",
    chapterNumber: 1,
    anchorText: "If such the pleasure of the blessed gods",
    anchorOccurrence: 1,
    title: "Athena's Double Plan",
    quotedPassage:
      "Let us at once despatch / Hermes, the Argicide, our messenger, / Down to Ogygia, to the bright-haired nymph ... / And I will haste to Ithaca, and move / His son.",
    passageReference: "Book I, lines ~104–112 (Bryant)",
    commentary: `Athena proposes a two-front strategy: Hermes to Calypso (the plot of Books V–XIII), Athena herself to Ithaca (the plot of Books I–IV, the Telemachy). The Odyssey's architecture is announced here, in the goddess's first speech. Homer is telling us how the poem is built before it begins.

Note that the Telemachy comes first in the narrative even though the Calypso release comes first in the causal chain. The poem begins in medias res and holds Odysseus offstage for four books — a structural choice no modern novelist would dare without paying the price. Homer earns it because the absence IS the subject: Ithaca without its king is the condition the poem sets out to end.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Virgil inherits this divine-council opening in Aeneid I (Juno storming at Aeneas, Venus pleading with Jove). The machinery is Homeric, the moral weight reallocated.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, lines 223–296",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "odyssey-1-mentes-mask",
    bookId: "the-odyssey",
    chapterNumber: 1,
    anchorText: "Mentes; my father was the great in war",
    anchorOccurrence: 1,
    title: "Mentes — Athena's First Mask",
    quotedPassage:
      "I am named / Mentes; my father was the great in war / Anchialus. I rule a people skilled / To wield the oar, the Taphians.",
    passageReference: "Book I, lines ~222–226 (Bryant)",
    commentary: `Athena lies. She gives a specific genealogy, a specific polity, a specific errand (bronze for Temesa). The lie has the texture of truth because Homer's poets knew that credible fiction requires concrete detail — a lesson Auerbach would later draw from the Eurycleia / scar scene in Book XIX.

Disguise is Athena's signature move in the Odyssey. She will appear as Mentor (II, III), as a shepherd (XIII), as a young woman (VII). Odysseus, her counterpart, will pass as a beggar (XVII–XXII). The poem is obsessed with the question of how identity shows through disguise — how Telemachus recognizes Athena "in his secret heart" (line 330) even while accepting her cover story.

*Mētis* — cunning — is the shared currency of goddess and hero. This is the first transaction.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Athena's serial disguises in the Odyssey are the direct source for the disguised-god trope running through Ovid's Metamorphoses (Book I's Jupiter-and-Philemon, for instance) and thence into medieval and Renaissance hospitality narratives.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book VIII (Baucis and Philemon)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "mythological"],
  },
  {
    id: "odyssey-1-phemius-compelled",
    bookId: "the-odyssey",
    chapterNumber: 1,
    anchorText: "Phemius, who had only by constraint",
    anchorOccurrence: 1,
    title: "The Compelled Bard",
    quotedPassage:
      "A herald brought / A shapely harp, and gave it to the hands / Of Phemius, who had only by constraint / Sung to the suitors.",
    passageReference: "Book I, lines ~187–190 (Bryant)",
    commentary: `Phemius is the Odyssey's house-bard, and Homer introduces him in a single phrase of quiet violence: he sings *by constraint*. The suitors have not merely eaten Odysseus's food; they have conscripted his poet. Later, in Book XXII, Phemius will kneel to Odysseus and plead for his life — *spare me, I sang under duress*. He is spared.

This is Homer reflecting on his own art's vulnerability. A bard depends on a hall and a feast; the hall's lord sets the terms. Phemius's compelled song of the Achaeans' ruinous homecoming (line 191) — the theme that makes Penelope weep — is the Odyssey's first moment of self-consciousness about poetic performance under an unjust patron.

Later readers (Dante in the first circle of Inferno, Milton in the proem to Paradise Lost) will pick up Homer's thread: the poet is never neutral in the hall.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Demodocus at Alcinoüs's court (Books VIII, XIII) is Phemius's positive inversion — a bard singing in a just hall. The Odyssey stages the same art under two regimes.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book VIII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-1-telemachus-speaks",
    bookId: "the-odyssey",
    chapterNumber: 1,
    anchorText: "I will be the lord of mine own house",
    anchorOccurrence: 1,
    title: "The First Word of the Son",
    quotedPassage:
      "But I will be the lord of mine own house, / And o'er my servants whom the godlike chief, / Ulysses, brought from war, his share of spoil.",
    passageReference: "Book I, lines ~377–380 (Bryant)",
    commentary: `Telemachus, who has spent the book being seen — sad, passive, visited — finally speaks an assertion. He will be lord of his own house. The grammar matters: not *I will be king of Ithaca* (Antinoüs has just told him he may never be that); not *I will avenge my father*; but the minimum viable claim — *my house is mine*. It is a startlingly small statement for a coming-of-age speech, and startlingly hard to make.

The Telemachy (Books I–IV) is structurally a small Odyssey inside the large one. Telemachus's journey to Pylos and Sparta, his encounter with older masculine authority (Nestor, Menelaus), his return to find the suitors plotting his murder — all of it is the hero-arc in miniature, and it completes in Book IV. This line is its first footstep.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Telemachy provided the opening structure for countless Bildungsroman — most explicitly James Joyce's Ulysses, whose first three episodes (\"Telemachus\", \"Nestor\", \"Proteus\") are Stephen Dedalus as Telemachus seeking a father he doesn't know how to recognize.",
        workTitle: "Ulysses",
        workAuthor: "James Joyce",
        passageReference: "Episodes 1–3 (Telemachus, Nestor, Proteus)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
]
