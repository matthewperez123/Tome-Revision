import type { Annotation } from "../types"

// Book VI: Ulysses Discovered by Nausicaä. The Phaeacian arc begins —
// Homer's most idealized society, and the place where the shipwrecked
// hero recovers his humanity.

export const ODYSSEY_BOOK_6: Annotation[] = [
  {
    id: "odyssey-6-phaeacian-prehistory",
    bookId: "the-odyssey",
    chapterNumber: 6,
    anchorText: "To Hades, and Alcinoüs, whom the gods",
    anchorOccurrence: 1,
    title: "The Phaeacians' Founding Myth",
    quotedPassage:
      "Nausithoüs, whom the gods had given / A form and spirit like their own.",
    passageReference: "Book VI, opening (Bryant)",
    commentary: `The Phaeacians were founded as a refugee colony — driven from Hypereia by the Cyclopes, resettled on Scheria. The people who will host Odysseus are themselves the exiles of an earlier Cyclops violence. Homer hints at a wider mythology the poem mostly leaves offstage: the Cyclopes were once neighbors of the Phaeacians, until they became unbearable.

The detail matters because it frames the Cyclops episode (Book IX) as something structurally prior to the poem. Odysseus arriving at the Phaeacian court is a late echo of their original flight — and when he tells them the Polyphemus story, he is telling them an episode from the history of their own founding trauma.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Phaeacian / Cyclops relationship frames Book IX's Cyclops scene. Homer uses the Phaeacian backstory as the moral baseline against which Polyphemus's behavior is the violation.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "historical"],
  },
  {
    id: "odyssey-6-nausicaa-dream",
    bookId: "the-odyssey",
    chapterNumber: 6,
    anchorText: "As comes a breath of air, and stood beside",
    anchorOccurrence: 1,
    title: "Athena as a Breath of Air",
    quotedPassage:
      "She entered, like a breath of air, the room / Where slept the maiden.",
    passageReference: "Book VI (Bryant)",
    commentary: `Athena visits Nausicaä in a dream, taking the form of a girlhood friend. The scene is unusually gentle for Homer: no theophanic trumpet, no omen, just a whisper in a young woman's ear about washing clothes before her wedding.

This is the Odyssey's most delicate piece of scene-setting. Homer is arranging a meeting between a shipwrecked hero and a teenage princess on a beach, and he must make it possible, believable, and morally clean. The dream is the scaffolding. Nausicaä goes to the river because of a thought she thinks is her own; Odysseus is there because a storm put him there. Two divine interventions converge and look, to the mortals, like coincidence.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The dream-frame appears throughout later literature when poets need a plausible magical conjunction — Chaucer's Book of the Duchess, Dante's dream-vision at the opening of the Vita Nuova. Homer's Book VI dream is the template.",
        workTitle: "The Book of the Duchess",
        workAuthor: "Geoffrey Chaucer",
        passageReference: "c. 1368–72",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-6-odysseus-emerges",
    bookId: "the-odyssey",
    chapterNumber: 6,
    anchorText: "Then like a mountain lion he went forth,",
    anchorOccurrence: 1,
    title: "The Hero as Mountain Lion",
    quotedPassage:
      "As some grim lion of the mountain comes / ... So to that fair-haired company of maids / Ulysses came, though naked as he was.",
    passageReference: "Book VI (Bryant)",
    commentary: `Odysseus emerges from the thicket naked, salt-crusted, covered in seaweed. Homer compares him to a lion driven by hunger among sheep and goats — a simile lifted straight from the Iliad's battlefield. But here the lion does NOT strike. He speaks. He "craves the food of need."

The simile is set up for violence and swerves into speech. It is one of Homer's quietest demonstrations of what distinguishes Odysseus from Iliadic heroes. He has the lion's hunger; he does not have the lion's reflex. He has Iliad-bones; he speaks Odyssey-words.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Iliad's lion-similes (Hector in V, Achilles in XX) trigger combat. This Odyssey lion-simile is set up to trigger combat and pivots to diplomacy — the genre-difference between the two epics, in a single trope.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Books V, XX",
        targetBookId: "the-iliad",
        targetChapterNumber: 20,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "odyssey-6-artemis-simile",
    bookId: "the-odyssey",
    chapterNumber: 6,
    anchorText: "Began a song. As when the archer-queen",
    anchorOccurrence: 1,
    title: "Nausicaä as Artemis",
    quotedPassage:
      "As when the archer Dian roves the hills / ... such / Amid her maidens stood the virgin queen.",
    passageReference: "Book VI (Bryant)",
    commentary: `Nausicaä is compared to Artemis — not just tall and beautiful, but surrounded by attendant companions, moving through wild country. The simile idealizes her, but it also contains a warning: Artemis is the virgin goddess. Nausicaä will not be marrying Odysseus.

The whole Book VI scene is structured by a marriage that does not happen. Nausicaä wants to marry the stranger; her father will even offer him the match in Book VII. Odysseus deflects it graciously throughout. Homer has set up a temptation and lets the hero pass it silently. Calypso's immortality was the vast temptation; Nausicaä's affection is the small one. Odysseus declines both for Penelope.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The Nausicaä/Odysseus scene is the template for the 'castaway meets noble princess' trope — from medieval romance to Shakespeare's Tempest (Miranda and Ferdinand). The marriage that does NOT happen is part of what makes Homer's scene distinctive.",
        workTitle: "The Tempest",
        workAuthor: "William Shakespeare",
        passageReference: "Miranda / Ferdinand",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "odyssey-6-supplication-speech",
    bookId: "the-odyssey",
    chapterNumber: 6,
    anchorText: "Her purpose to her father and the queen.",
    anchorOccurrence: 1,
    title: "Odysseus's First Speech in the Poem",
    quotedPassage:
      "Queen, I implore thee. Art thou a divinity / Or human?",
    passageReference: "Book VI (Bryant)",
    commentary: `This is technically the first speech Odysseus makes in the Odyssey. (His weeping on the beach was wordless; his prayers to Athena in Book V are short.) And what he does with it is breathtaking.

He cannot clasp her knees — she would recoil. So he delivers a formal supplication-speech from a polite distance, comparing her to a young palm-tree he once saw at Delos. He praises her brothers. He asks only for rags and directions. In seventy lines he turns a naked shipwrecked stranger into a guest no well-raised princess could dismiss.

It is perhaps the finest diplomatic speech in ancient literature, and its first-appearance in Odysseus's own mouth is Homer's announcement: *this* is the hero. Wrath is Achilles's signature; speech that gets what it wants is Odysseus's.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare Odysseus's supplication-speech to Priam's to Achilles (Iliad XXIV). Both are masterworks of formal speech in extremity. Priam kisses the hand that killed his son; Odysseus stands at a cautious distance. Genre shapes decorum.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXIV",
        targetBookId: "the-iliad",
        targetChapterNumber: 24,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "odyssey-6-nausicaa-prudence",
    bookId: "the-odyssey",
    chapterNumber: 6,
    anchorText: "I too would blame another who should do",
    anchorOccurrence: 1,
    title: "Nausicaä's Prudence",
    quotedPassage:
      "It would not be seemly that a stranger / Should enter with me through the city gates.",
    passageReference: "Book VI, closing (Bryant)",
    commentary: `Nausicaä tells Odysseus to walk separately into the city — it would look bad to be seen arriving with him. She understands her culture's gossip economy exactly. She gives him precise instructions (go to Arete first, not Alcinoüs; clasp her knees, not his) that he will execute to the letter in Book VII.

Homer makes her clever without making her sly. She is socially calibrated, and her calibration saves Odysseus's arrival from scandal. It is also her farewell — she will appear once more in Book VIII to say goodbye, and that is all. Homer lets her pass out of the poem with dignity intact. Samuel Butler was so moved by her that he wrote a book arguing she was the actual author of the Odyssey.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Samuel Butler's The Authoress of the Odyssey (1897) — the famous crank-book proposing that Nausicaä wrote the poem about her own youth. Butler is wrong; he is also attentive, and the theory's appeal is Homer's portrait of her.",
        workTitle: "The Authoress of the Odyssey",
        workAuthor: "Samuel Butler",
        passageReference: "1897",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "odyssey-6-skilful-workman-simile",
    bookId: "the-odyssey",
    chapterNumber: 6,
    anchorText: "As when some skilful workman",
    anchorOccurrence: 1,
    title: "Athena as Goldsmith",
    quotedPassage:
      "As when some skilful workman trained and taught / By Pallas and Hephaestus pours the gold / Round silver.",
    passageReference: "Book VI (Bryant)",
    commentary: `Athena "pours grace" over Odysseus as a goldsmith pours gold around silver. The simile is technical — a specific jewelry process, electrum-plating — and the god-pair is exact: Pallas for the design, Hephaestus for the fire.

The Odyssey treats beauty as a craft, not a gift. The hero is made handsome by a known technique. This is consistent with the poem's broader metaphysics — raft-building, weaving, recognition-by-object. Grace has a manufacturing process. Homer's world is modest about miracles.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The same goldsmith-simile recurs in Book XXIII at Odysseus's final reunion with Penelope — Athena pours beauty over him as the craftsman pours gold. The poem's grace-metaphor is consistent from here to the end.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XXIII, lines ~192–195",
        targetBookId: "the-odyssey",
        targetChapterNumber: 23,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "historical"],
  },
]
