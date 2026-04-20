import type { Annotation } from "../types"

// Book XIX: Ulysses Recognized by Eurycleia.
// A flagship book — the scar scene, Penelope's long interview, the omen
// of the eagle.

export const ODYSSEY_BOOK_19: Annotation[] = [
  {
    id: "odyssey-19-penelope-interview",
    bookId: "the-odyssey",
    chapterNumber: 19,
    anchorText: "“First will I ask thee who thou art, and whence,",
    anchorOccurrence: 1,
    title: "The Long Interview",
    quotedPassage:
      "Stranger, first I would ask thee who thou art.",
    passageReference: "Book XIX (Bryant)",
    commentary: `Penelope and Odysseus, alone by the hearth, have the longest private conversation in the poem. Seven hundred lines of Bryant's Book XIX. He lies (another Cretan tale); she weeps for the Ulysses he describes; he observes her carefully; she describes her own ordeal — the shroud ruse, the suitors' pressure, her final desperation.

Homer gives us a marriage in which the wife tells her husband, in front of him, that she is about to remarry because he is never coming back. Odysseus listens, and lies. It is the most psychologically complex scene in ancient literature. The reader sees both minds working at cross-purposes with enormous care.

At the end, Odysseus weeps internally — Homer compares his hidden tears to melting snow — but does not reveal himself. He wants to test her further. This is the moment modern readers most reliably find cruel. It is also the moment in which Homer most clearly shows that his hero's *mētis* is sometimes an armor worn too long.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Book XIX is the poem's most complex dialogue-scene and the template for every later encounter between lovers in disguise — Isabella and Claudio, Viola and Orsino. Homer's patience with the misrecognition is the precursor.",
        workTitle: "Twelfth Night",
        workAuthor: "William Shakespeare",
        passageReference: "Viola disguised as Cesario",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-19-tears-like-snow",
    bookId: "the-odyssey",
    chapterNumber: 19,
    anchorText: "That flowed as when on mountain height the snow,",
    anchorOccurrence: 1,
    title: "Tears Like Snow",
    quotedPassage:
      "As snow upon the lofty mountain sides, / Which the warm southwind thaws ... / Her cheeks were wet with tears.",
    passageReference: "Book XIX (Bryant)",
    commentary: `Penelope weeps for the husband she does not know is sitting in front of her. Homer compares her tears to mountain snow melting in the south wind — water becoming water, slowly, through warmth.

It is one of Homer's most visually exquisite similes and one of his most emotionally subtle. The melting is gradual; the warmth is Odysseus himself, present and invisible. Homer's image is almost geological — the long patience of thaw. Twenty years of grief dissolving, in her presence.

The similes in Book XIX are meteorological and tender in a way the Iliad's never are. The Odyssey's Homer is a quieter observer of weather and feeling.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Homer's snow-melting simile for Penelope's tears is imitated throughout pastoral poetry — Theocritus, Virgil's Eclogues, and (via Petrarch) the Renaissance love lyric's 'snow that melts in the sun' figure.",
        workTitle: "Canzoniere",
        workAuthor: "Petrarch",
        passageReference: "14th century",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "odyssey-19-scar-recognition",
    bookId: "the-odyssey",
    chapterNumber: 19,
    anchorText: "His feet, and found the scar",
    anchorOccurrence: 1,
    title: "Recognition II — Eurycleia and the Scar",
    quotedPassage:
      "She came and bathed / His feet, and found the scar.",
    passageReference: "Book XIX, lines ~480–488 (Bryant)",
    commentary: `Penelope has asked Eurycleia to wash the stranger's feet. Eurycleia — the nurse who bathed Odysseus as a child — catches the ridged scar on his thigh and recognizes him instantly. The bronze basin clangs. Odysseus grabs her throat to keep her silent.

Erich Auerbach opens *Mimesis* (1946) with this scene as the founding example of Homeric realism. His argument: Homer interrupts the urgent moment of recognition to tell us, in sixty lines of flashback, the entire story of the scar — how Odysseus was wounded on a boar-hunt as a young man on his grandfather Autolycus's estate. The flashback is structurally INSIDE the recognition. Homer's narrative is always ALL lit at once, all foreground, no shadows.

For Auerbach this was the definition of one great Western narrative tradition (the other being the Hebrew Bible's murkier, back-shadowed style). The scar digression is therefore perhaps the single most influential sixty lines in Western literary history.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Auerbach's Mimesis opens with this scene as the paradigm of Homeric narrative style — all foreground, no shadow, the scar digression as proof of Homer's lucid realism.",
        workTitle: "Mimesis",
        workAuthor: "Erich Auerbach",
        passageReference: "Chapter 1: Odysseus' Scar",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "odyssey-19-autolycus-naming",
    bookId: "the-odyssey",
    chapterNumber: 19,
    anchorText: "His mother’s noble father, who excelled",
    anchorOccurrence: 1,
    title: "The Name from the Grandfather",
    quotedPassage:
      "Autolycus, his mother's father ... / ... / Since I have much been angered with mankind, / Let the child's name be Odysseus — the man of wrath.",
    passageReference: "Book XIX (Bryant)",
    commentary: `The scar flashback contains another disclosure: Odysseus is named by his grandfather Autolycus, the greatest thief of his generation, skilled in perjury and cunning. The name *Odysseus* puns on the Greek *odyssomai* — "to be angry with, to cause pain" — and Autolycus names the child after his own resentments.

This is the etymology the poem quietly insists on. Odysseus is the man of pain — the causer of it and the receiver of it. Both senses fit. He causes pain at Troy; he suffers at sea. His name is already his biography.

Autolycus is also the source of Odysseus's moral lineage. The hero's cunning is inherited from a grandfather who was a trickster-god's favorite. The Cretan lies, the Outis pun, the disguises — all of it runs in the blood. The scar flashback discloses not just a wound but an inheritance.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Odysseus etymology (pain/wrath) pairs with Achilles's (ἄχος, grief) at the opening of the Iliad. Both Homeric heroes are names that pun on what they cause and what they suffer.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book I (Achilles)",
        targetBookId: "the-iliad",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "mythological"],
  },
  {
    id: "odyssey-19-odysseus-grips-throat",
    bookId: "the-odyssey",
    chapterNumber: 19,
    anchorText: "Laid his right hand, and with the other drew",
    anchorOccurrence: 1,
    title: "The Nurse Silenced",
    quotedPassage:
      "He took her by the throat / With his right hand.",
    passageReference: "Book XIX (Bryant)",
    commentary: `At the moment of recognition, Odysseus seizes Eurycleia's throat. He threatens to kill her if she tells Penelope. This is the scene Homer wants us to feel.

Eurycleia is his childhood nurse. She loves him. She is among the three or four people in the world most loyal to him. And he threatens to murder her to preserve the disguise another two days.

The violence discloses something important: Odysseus's disguise-plot is not a game. He has chosen a path in which any leak of the secret means the death of him, Telemachus, and probably everyone loyal in the house. The price of discovery is absolute. The hero's coldness with Eurycleia is the reality-check on his Book XIII planning.

She promises silence. He releases her. The scene is brief and chilling. Homer does not sentimentalize.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The cold violence at recognition recurs at every Odyssean anagnorisis — Eurycleia's throat, the bed-test of Penelope (a cooler violence of rhetorical precision), the orchard-test of Laertes. Recognition is always, in the Odyssey, a form of interrogation.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books XXIII, XXIV",
        targetBookId: "the-odyssey",
        targetChapterNumber: 23,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "odyssey-19-penelope-dream",
    bookId: "the-odyssey",
    chapterNumber: 19,
    anchorText: "Within these courts are twenty geese that eat",
    anchorOccurrence: 1,
    title: "The Dream of the Geese",
    quotedPassage:
      "Twenty geese about my house. / ... / A mountain eagle came with hooked beak.",
    passageReference: "Book XIX, later (Bryant)",
    commentary: `Penelope tells the stranger her dream: an eagle swoops down and kills her twenty tame geese. The eagle turns back into a man and says, "Be of good cheer — I am your husband, and those were the suitors." Penelope asks the beggar to interpret.

He interprets it straight: Odysseus is coming back, and he will kill the suitors. She accepts the interpretation, thanks him, and — this is the knot — then announces the bow contest for the next day. Something HAS been communicated. The conversation has changed her.

Some critics have argued Penelope has actually recognized Odysseus in this scene and the bow contest is her consent. Homer leaves it deliberately unclear. What he does NOT leave unclear is that Penelope now acts — she names a contest that can only be won by Odysseus. Whether she knows or not, she has chosen.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The geese-dream interpretation is the Odyssey's most contested single passage in modern scholarship. Does Penelope recognize Odysseus? Homer lets the ambiguity stand; later readers (Philip Roth's essay on the scene, Emily Wilson's introduction) have made whole essays of it.",
        workTitle: "The Odyssey (Wilson translation)",
        workAuthor: "Emily Wilson (trans.)",
        passageReference: "2017",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "odyssey-19-gates-of-horn",
    bookId: "the-odyssey",
    chapterNumber: 19,
    anchorText: "Two portals are there for their shadowy shapes,",
    anchorOccurrence: 1,
    title: "The Gates of Horn and Ivory",
    quotedPassage:
      "Two gates there are for unsubstantial dreams, / One framed of horn and one of ivory.",
    passageReference: "Book XIX (Bryant)",
    commentary: `Penelope doubts the dream's authority. She tells the beggar that dreams come from two gates — horn (through which true visions pass) and ivory (through which deceptive ones come). She does not know which her eagle-and-geese dream came through.

Homer's passage is the oldest extant distinction between true and false dreams in Western literature. Virgil will cite it explicitly in Aeneid VI (Aeneas and the Sibyl leave the underworld through the ivory gate, provoking centuries of commentary). Dante will glance at it. Freud will tangentially invoke it in his dream theory.

The passage is also Penelope's deepest moment of self-awareness. She knows how hope and despair shape interpretation. She does not trust her own wish-fulfillment. A character capable of that level of epistemic vigilance is a character Homer gives more credit than the tradition often does.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid VI (lines 893–898) directly cites Homer's gates — and has Aeneas exit through the ivory (false) gate, a choice that has provoked two millennia of commentary on whether Virgil means his own prophecy to be distrusted.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 893–898",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "odyssey-19-bow-contest-announced",
    bookId: "the-odyssey",
    chapterNumber: 19,
    anchorText: "Ulysses in a row set up twelve stakes,",
    anchorOccurrence: 1,
    title: "The Bow Contest Announced",
    quotedPassage:
      "The bow of Ulysses, and the axes twelve.",
    passageReference: "Book XIX, closing (Bryant)",
    commentary: `Penelope announces the bow contest. Whoever can string Odysseus's bow and shoot an arrow through the sockets of twelve axe-heads lined up in the courtyard will marry her. No suitor has ever strung the bow; only Odysseus did.

The plot mechanics of Books XXI–XXII pivot on this announcement. Penelope has, effectively, invited the suitors to a contest she knows is impossible for any of them. She has, simultaneously, named a contest that Odysseus (in any form) could win.

It is the most decisive act she makes in the poem. Homer lets her have it. The announcement is presented as a decision she makes alone, by the fire, after the conversation with the beggar she does not know is her husband.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The bow contest in Book XXI is Penelope's contribution to the slaughter-plot — arguably the decisive one. The suitors are lured by her announcement into a test only Odysseus can win; the contest itself becomes the weapon.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books XXI–XXII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 21,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
]
