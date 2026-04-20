import type { Annotation } from "../types"

// Book XXIII: Ulysses and Penelope After the Slaughter.
// Preserve-first: 2 existing hand-written annotations (odyssey-23-bed,
// odyssey-23-reunion) are the core of this book. These supplementary
// annotations fill gaps in the approach-to-recognition and the final
// re-naming of the bed.

export const ODYSSEY_BOOK_23: Annotation[] = [
  {
    id: "odyssey-23-eurycleia-announces",
    bookId: "the-odyssey",
    chapterNumber: 23,
    anchorText: "Awake, Penelope, dear child, and see",
    anchorOccurrence: 1,
    title: "The Announcement",
    quotedPassage:
      "Awake, Penelope, dear child, and see / What long thou hast desired.",
    passageReference: "Book XXIII, opening (Bryant)",
    commentary: `Eurycleia runs upstairs laughing and shakes Penelope awake: your husband is here, the suitors are dead. Penelope, having slept through the slaughter, answers cold: *you are mocking me; the gods have driven you mad*.

This is the Odyssey's most important instance of deliberate non-recognition. Eurycleia has seen Odysseus; she knows. Penelope's refusal to believe is not inability — she is a woman who has been lied to for twenty years about her husband's possible return. Hope has cost her too much. She will not accept the news on anyone's word.

Homer's Penelope is the hardest test in the poem. Not Polyphemus, not Scylla — *her*. Odysseus will spend the rest of Book XXIII working to convince her, and she will only relent after the bed-test. Homer's respect for the difficulty of trust after long deception is total.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Penelope's disbelief is the poem's most rigorous recognition. Compare Eurycleia's instant recognition in XIX, Telemachus's faith-recognition in XVI — Penelope's is uniquely skeptical. She makes her husband prove it.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books XVI, XIX",
        targetBookId: "the-odyssey",
        targetChapterNumber: 19,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "odyssey-23-mother-unfeeling",
    bookId: "the-odyssey",
    chapterNumber: 23,
    anchorText: "Mother, unfeeling mother! hard of heart",
    anchorOccurrence: 1,
    title: "Telemachus Scolds His Mother",
    quotedPassage:
      "Mother, unfeeling mother! hard of heart.",
    passageReference: "Book XXIII (Bryant)",
    commentary: `Telemachus cannot understand why Penelope will not embrace his father. He calls her unfeeling. Penelope answers with calm dignity: *if he really is Odysseus, he and I have signs between us — known only to ourselves*.

Penelope's answer is the poem's most explicit articulation of private marital intimacy. *Signs known only to the two of us*. Homer gives marriage, in this line, a protected interior. What is shared between husband and wife is specifically not available to a son or a servant. The test she is about to run requires that privacy.

It is worth noting what this tells us about Penelope's theory of identity. She does not trust physical appearance (he looks like Odysseus), or testimony (Eurycleia's, Telemachus's). She trusts only something only Odysseus could know. Identity, in her account, is not body or name but shared secret.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Penelope's 'signs known only to the two of us' is the Odyssey's deepest statement of marital interiority — and the criterion the bed-test will operationalize. Homer defines marriage as the private domain of shared knowledge.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Lines ~245–290 (the bed-test)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 23,
        targetAnchorText: "Whether my bed remains as then it was",
      },
    ],
    tags: ["philosophical", "linguistic"],
  },
  {
    id: "odyssey-23-grace-poured-again",
    bookId: "the-odyssey",
    chapterNumber: 23,
    anchorText: "As when a workman skilled in many arts",
    anchorOccurrence: 1,
    title: "The Grace Poured Again",
    quotedPassage:
      "As when a workman skilled in many arts, / Taught by Minerva and Hephaestus, lays / A coat of gold on silver.",
    passageReference: "Book XXIII, lines ~192–195 (Bryant)",
    commentary: `Homer re-uses the Book VI goldsmith simile. Athena pours grace over Odysseus for the reunion with Penelope — the same image she used when he approached Nausicaä in Book VI. The repetition is deliberate.

In Book VI the grace worked — Nausicaä was struck. Here it does not. Penelope sees the restored Odysseus, notes that he looks like her husband, and maintains her skepticism. Homer uses the repetition to mark what has changed: Penelope cannot be moved by divine beauty-enhancement. She requires the secret.

It is a measure of her integrity. Athena's oldest trick — making the hero handsome — is the first thing Penelope refuses.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The repeated goldsmith simile (Books VI and XXIII) marks Penelope's immunity to Athena's cosmetic intervention. The poem makes her, quietly, the one character the goddess cannot trick.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book VI",
        targetBookId: "the-odyssey",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "odyssey-23-narrative-night",
    bookId: "the-odyssey",
    chapterNumber: 23,
    anchorText: "Of that well-vaulted chamber; the firm doors",
    anchorOccurrence: 1,
    title: "The Night in the Bed",
    quotedPassage:
      "Then in the well-framed chamber.",
    passageReference: "Book XXIII, closing (Bryant)",
    commentary: `The recognition complete, Athena prolongs the night so the reunion can be whole. They go to the olive-rooted bed. Odysseus tells Penelope his wanderings in summary — a kind of private apologoi, abbreviated and direct. She tells him about her twenty years.

Homer's gift to Penelope in this final scene: she gets to hear the story from his own mouth, in the bed they share, without any court or audience. The Phaeacians heard the four-book version; she gets the edited, intimate one. Homer knows the difference between public and private tellings.

The night ends with dawn. Odysseus has to go to Laertes. Book XXIV is the last step of the homecoming — the father reunion, the suitors' shades descending, the quelling of vendetta. The marriage scene in XXIII is the poem's emotional resolution. The civic resolution belongs to XXIV.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Odysseus's private retelling to Penelope mirrors and abbreviates the public apologoi of Books IX–XII. Homer gives the wife the edited, intimate version. Marriage gets a different narrative register than court.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books IX–XII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "odyssey-23-tiresias-prophecy-retold",
    bookId: "the-odyssey",
    chapterNumber: 23,
    anchorText: "Upon those violent men their guilty deeds.”",
    anchorOccurrence: 1,
    title: "The Oar-Inland Prophecy Remembered",
    quotedPassage:
      "The oar upon my shoulder.",
    passageReference: "Book XXIII, closing (Bryant)",
    commentary: `Odysseus tells Penelope, as she is falling asleep, about Tiresias's inland-oar prophecy (Book XI) — the future voyage after the poem's end, the mistaken winnowing-fan, the final sacrifice, the easeful death at sea in old age.

This is the Odyssey's explicit marker that the poem is not a full life. The hero's story continues past what we are given. A quieter voyage, an unknown inland people, a modest sacrifice, a gentle death — Homer refuses to show us any of it.

The refusal has haunted later readers. Dante's Ulysses takes the hint and invents a catastrophic voyage past Gibraltar. Tennyson's Ulysses takes it and builds a restlessness-for-more poem around it. Homer himself simply mentions it and moves on to Book XXIV. The poet's restraint is enormous.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The oar-inland prophecy is the seed of Inferno XXVI — Dante's Ulysses departs for a voyage specifically authorized by Tiresias's hint in Book XI and remembered here. Dante reads this passage as the Odyssey's unfinished business.",
        workTitle: "Inferno",
        workAuthor: "Dante Alighieri",
        passageReference: "Canto XXVI",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 25,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Tennyson's 'Ulysses' (1833) picks up the oar-inland prophecy's open ending and makes restless post-homecoming longing the emotional core of a lyric poem.",
        workTitle: "Ulysses",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "1833",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
]
