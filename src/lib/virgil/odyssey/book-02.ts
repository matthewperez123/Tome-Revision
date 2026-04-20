import type { Annotation } from "../types"

// Book II: Departure of Telemachus from Ithaca.
// The first assembly held on Ithaca in twenty years. Telemachus stands
// before his people; the suitors show their hand.

export const ODYSSEY_BOOK_2: Annotation[] = [
  {
    id: "odyssey-2-assembly-summoned",
    bookId: "the-odyssey",
    chapterNumber: 2,
    anchorText: "At once he bade the clear-voiced heralds call",
    anchorOccurrence: 1,
    title: "The First Assembly in Twenty Years",
    quotedPassage:
      "He bade the clear-voiced heralds call / The long-haired Greeks to council. At the call / They came in haste and met.",
    passageReference: "Book II, opening (Bryant)",
    commentary: `Aegyptius's first speech flags what Homer wants the reader to feel: no assembly (ἀγορή / *agora*) has been held on Ithaca since Odysseus sailed for Troy. Twenty years of no public political life. The Cyclopes in Book IX will be condemned for lacking assemblies at all. The suitors have reduced Ithaca to the same condition.

Telemachus is summoning an institution back into being. The Greek polis begins in moments exactly like this — a boy standing up and speaking, and the old men deciding whether to listen. Homer will come back to this in Book XXIV, when Laertes's line finally reopens its house to a legitimate gathering.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare to the lawless Cyclopes in Book IX — Homer's explicit argument that assemblies define civilization.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX, lines ~133–150",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: "Plant not, nor plough the fields",
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-2-shroud-ruse",
    bookId: "the-odyssey",
    chapterNumber: 2,
    anchorText: "She planned; she laid upon the loom a web,",
    anchorOccurrence: 1,
    title: "Penelope's Shroud",
    quotedPassage:
      "She set a mighty web within her hall, / And wove ... but every night / Unravelled, by the torches' light, the web.",
    passageReference: "Book II, lines ~113–125 (Bryant)",
    commentary: `Antinoüs, of all speakers, is the one Homer uses to tell us about the shroud trick. The suitor is furious at Penelope's cunning and betrays it by describing it. The weaving by day and unweaving by night — three years of it — is the Odyssey's first image of *mētis* in female hands, and the structural counterpart to Odysseus's cunning abroad.

Penelope's art is temporal: she turns the loom's forward motion into a holding pattern, weaving that undoes itself. It is a metaphor for the poem she is trapped inside. The Odyssey's plot is likewise a pattern that keeps delaying its own conclusion. When Odysseus finally comes home, it is to a wife who has been making his delay into a form of art.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Penelope's loom is reborn in Roland Barthes' S/Z as the image of the writerly text — a fabric whose making is never complete. The shroud ruse is one of the deep metaphors of Western literature for narrative itself.",
        workTitle: "S/Z",
        workAuthor: "Roland Barthes",
        passageReference: "1970",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "odyssey-2-halitherses-prophecy",
    bookId: "the-odyssey",
    chapterNumber: 2,
    anchorText: "Named Halitherses, Mastor’s son. He knew",
    anchorOccurrence: 1,
    title: "The Ignored Prophet",
    quotedPassage:
      "Halitherses, Mastor's son, rose up, / The bird-discerning sage.",
    passageReference: "Book II, lines ~158–170 (Bryant)",
    commentary: `Two eagles tear each other's cheeks above the assembly — an omen. Halitherses, who reads birds, announces what it means: Odysseus is near; the suitors are about to be annihilated. He is laughed off.

The ignored seer is a Homeric specialty (Calchas in Iliad I, Cassandra in the Troy cycle). The convention's purpose is not dramatic irony but ethical: the characters hear the warning and choose wrongly, so the destruction that follows is earned, not fated. This is the Aegisthus frame (Book I) acted out. The suitors' doom in Book XXII begins at this moment of dismissal.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Calchas opens the Iliad reading a plague as divine anger; Halitherses opens Telemachus's Odyssey reading eagles as a father's return. The augur-voice frames both poems.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book I, lines ~100–150",
        targetBookId: "the-iliad",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },
  {
    id: "odyssey-2-athena-as-mentor",
    bookId: "the-odyssey",
    chapterNumber: 2,
    anchorText: "In form and voice like Mentor, by his side,",
    anchorOccurrence: 1,
    title: "Mentor — Athena's Second Mask",
    quotedPassage:
      "Athenè, blue-eyed goddess, now drew near, / In voice and likeness, Mentor.",
    passageReference: "Book II, later (Bryant)",
    commentary: `The second disguise. Athena was Mentes in Book I (a stranger-guest); now she is Mentor (a familiar counselor). Both are masculine old men, both are names puns for *mental* qualities, both are credible channels for her voice. Our English word *mentor* — teacher, protector of the young — comes from exactly this passage.

Pay attention to how Athena's disguises trend toward intimacy. Stranger, then counselor, then (in Book XIII) a young shepherd — she will finally drop the mask for Odysseus and laugh at him for not recognizing her sooner. The Odyssey tests a quiet thesis: wisdom appears at first as a stranger, then as a friend, and only at the end as itself.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "François Fénelon's Telémaque (1699) turned Mentor into a pedagogical program; its runaway success is why English borrowed the word. Homer's goddess-in-disguise became an entire Enlightenment literary genre.",
        workTitle: "Les Aventures de Télémaque",
        workAuthor: "François Fénelon",
        passageReference: "1699",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "odyssey-2-departure-by-night",
    bookId: "the-odyssey",
    chapterNumber: 2,
    anchorText: "And all the ensuing morn they held their way.",
    anchorOccurrence: 1,
    title: "By Night, Without the Mother Knowing",
    quotedPassage:
      "All night and through the dawn they held their way.",
    passageReference: "Book II, closing lines (Bryant)",
    commentary: `Telemachus leaves without telling Penelope. Homer underscores this with a tenderness that cuts: the old nurse Eurycleia is sworn to keep the secret for twelve days unless Penelope asks. The son protects the mother from the knowledge of where he has gone.

It is also the first night voyage of the poem. The Odyssey uses night departures the way the Iliad uses dawn battles — as moments of moral reset. Telemachus's secret departure mirrors his father's eventual secret return (Book XIII, deposited on Ithaca by Phaeacian night-runners). Father and son move through the same dark water at opposite ends of the poem.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The image of the son slipping away at night to seek news of a vanished father recurs in modern literature — most directly in Joyce's Ulysses, where Stephen Dedalus's morning departure carries the same pre-dawn Telemachan weight.",
        workTitle: "Ulysses",
        workAuthor: "James Joyce",
        passageReference: "Episode 1 (Telemachus)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "odyssey-2-antinous-portrait",
    bookId: "the-odyssey",
    chapterNumber: 2,
    anchorText: "Slew him for his last meal. Three other sons",
    anchorOccurrence: 1,
    title: "The Portrait of Antinoüs",
    quotedPassage:
      "Antinoüs answered him, Eupeithes' son, / With bitter words.",
    passageReference: "Book II (Bryant)",
    commentary: `Antinoüs ("opposite-minded") is introduced here with the quality that will define him until Book XXII: sheer unprovoked aggression. He attacks Telemachus for speaking in his own house. Homer gives him the first kill in the massacre — not because he was the worst suitor, but because he was the loudest. *Loudest goes first* is a Homeric rule of moral accounting.

His father Eupeithes will get his own bad end in Book XXIV, stirring up vendetta and being put down by Laertes. Antinoüs comes from a line of men who cannot shut up when they should. It is a lineage the poem punishes.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Antinoüs's loud rudeness positions him as the anti-guest, the perfect inversion of Telemachus's Book I hospitality toward Mentes. The suitors consume the food but violate the grammar of xenia.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book I (Telemachus and Mentes)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 1,
        targetAnchorText: "Telemachus the godlike was the first",
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "odyssey-2-eurycleia-loyalty",
    bookId: "the-odyssey",
    chapterNumber: 2,
    anchorText: "Greatly as she desired it. He would draw",
    anchorOccurrence: 1,
    title: "Eurycleia's First Oath",
    quotedPassage:
      "She swore as he desired, and when the oath / Was uttered, she drew wine into the jars.",
    passageReference: "Book II (Bryant)",
    commentary: `Eurycleia, the old nurse, swears to keep Telemachus's voyage secret. Her oath is the Odyssey's first formal bond between a servant and the house, and she will honor it through eighteen more books — most famously at the scar-recognition in Book XIX, where she silently accepts Odysseus's threat to kill her if she betrays his disguise.

She is older than any character in the poem. Laertes bought her as a young woman; she nursed both Odysseus and Telemachus. The house's memory lives in her. When Book XXII ends with her joyous cry over the slaughtered suitors, she is cut short by Odysseus — "rejoice not over men slain" — because even the loyal old nurse can forget herself at a moment of triumph.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Eurycleia is the template for the old nurse as literary device — Juliet's Nurse, Pushkin's Arina Rodionovna, every grandmotherly servant in the novel tradition.",
        workTitle: "Romeo and Juliet",
        workAuthor: "William Shakespeare",
        passageReference: "The Nurse",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "odyssey-2-ship-provisioned",
    bookId: "the-odyssey",
    chapterNumber: 2,
    anchorText: "In vessels\uFEFF—wine in jars, and meal, the strength",
    anchorOccurrence: 1,
    title: "The First Ship",
    quotedPassage:
      "Wine drawn in casks, and grain the strength of men.",
    passageReference: "Book II (Bryant)",
    commentary: `Telemachus and Athena (as Mentor) rig a ship by night, in secret, from a borrowed hull. Noemon lends it. The detail is domestic, almost tedious — wineskins, barley, a crew of twenty — and Homer lingers because this is a hero's first logistical act. The Iliad never has to ask how a ship gets loaded; the Odyssey cares about the question.

The poem's interest in material detail (Penelope's loom, the bed of olive, the bow that must be strung) gives it a different texture from the Iliad. The Odyssey is a poem about *things* as well as people — the quiet technology of a household holding itself together.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Odyssey's attention to domestic things — provisions, looms, beds, doors — is the seed from which every realist novel grows. Erich Auerbach begins Mimesis with the Book XIX scar scene for exactly this reason.",
        workTitle: "Mimesis",
        workAuthor: "Erich Auerbach",
        passageReference: "Chapter 1: Odysseus' Scar",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },
]
