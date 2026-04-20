import type { Annotation } from "../types"

// Book VIII: Festivals in Honor of Ulysses. The book where Homer puts a
// bard on stage to sing about Homer's previous poem.

export const ODYSSEY_BOOK_8: Annotation[] = [
  {
    id: "odyssey-8-demodocus-blind",
    bookId: "the-odyssey",
    chapterNumber: 8,
    anchorText: "Him whom the Muse with an exceeding love",
    anchorOccurrence: 1,
    title: "Demodocus — The Blind Bard",
    quotedPassage:
      "Whom the Muse loved much and gave him / Good and evil both: she took away / The sight of his eyes, but gave him gift of song.",
    passageReference: "Book VIII (Bryant)",
    commentary: `Demodocus is the Odyssey's portrait of a poet. He is blind. He is divinely inspired. He sings at court with a harp. He is fed the choicest cut of meat by the hero whose story he has just sung. No ancient source identifies Homer himself as blind, but the tradition clearly started here — readers saw Homer in Demodocus and ran with it.

The metapoetic move is audacious. Homer, performing the Odyssey, places a performance of part of the Trojan War at the center of his own story, and has his hero weep at it. The audience watches the audience. This is the first recursion in Western literature.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The tradition of the blind poet — Milton most famously — begins here. Demodocus becomes the Western archetype: the singer who cannot see but knows, because the Muse has traded one sight for another.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book III proem",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "odyssey-8-song-of-troy",
    bookId: "the-odyssey",
    chapterNumber: 8,
    anchorText: "Between Ulysses and Achilles, son",
    anchorOccurrence: 1,
    title: "The First Song of Troy",
    quotedPassage:
      "The quarrel of Ulysses and of Peleus' son.",
    passageReference: "Book VIII (Bryant)",
    commentary: `Demodocus's first song is an episode we have never heard of — a quarrel between Odysseus and Achilles at a feast. Homer is telling us, at the center of the Odyssey, that the Trojan cycle is larger than the two poems we have. There were many songs; this is one.

Odysseus pulls his cloak over his head and weeps. The trigger is not grief for the dead (though that is present) — it is the discomfort of hearing your own story performed by a stranger. A man made a song about his quarrel, and now that song is sung at a stranger's court, on an evening when no one knows who he is. The recursion is exquisite and painful.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare to Aeneas weeping over the Trojan murals at Carthage (Aeneid I, lines 456–493). Virgil explicitly echoes Odysseus at Scheria — the hero confronted by his own story as art.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, lines 456–493",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "odyssey-8-weeping-woman-simile",
    bookId: "the-odyssey",
    chapterNumber: 8,
    anchorText: "Weeps her beloved husband, slain before",
    anchorOccurrence: 1,
    title: "The Weeping-Woman Simile",
    quotedPassage:
      "As when a woman weeps above her husband, / Fallen before his city and his people ... / So wept Ulysses.",
    passageReference: "Book VIII (Bryant)",
    commentary: `Homer's most devastating simile. Odysseus — the sacker of cities — weeps at Demodocus's song, and Homer compares him to a woman whose husband has just been killed defending a city under siege, now being dragged off to slavery.

The tenor (Odysseus weeping for the dead of Troy) and the vehicle (a captive widow) are morally inverted. Odysseus is being compared to his own victims' wives. Homer is saying: the man who conquered Troy ends up feeling what Troy's women felt.

This is the Odyssey at its ethical peak. The Iliad's brief acknowledgments of the cost on the Trojan side (Andromache, Hecuba) are here folded directly into the Greek hero's grief. It is the poem's most Christian moment, five centuries before Christianity.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Simone Weil's essay 'The Iliad, or the Poem of Force' (1940) is built around passages like this one — Homer's capacity to see the victor's grief and the victim's identical grief as one thing. The simile is her evidence.",
        workTitle: "The Iliad, or the Poem of Force",
        workAuthor: "Simone Weil",
        passageReference: "1940",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-8-phaeacian-games",
    bookId: "the-odyssey",
    chapterNumber: 8,
    anchorText: "Then spake Euryalus with chiding words:\uFEFF—",
    anchorOccurrence: 1,
    title: "The Insult and the Discus",
    quotedPassage:
      "Euryalus, a youth whose wit was less than meet.",
    passageReference: "Book VIII (Bryant)",
    commentary: `Euryalus taunts the stranger — you don't LOOK like an athlete; you look like a merchant-skipper. Odysseus answers with a cold speech ("you are well-formed and empty of wit") and throws a discus farther than any Phaeacian has ever thrown.

The exchange is a set-piece of insult-and-proof — a form Greek culture cherished. But notice what Odysseus's anger does: it activates his body after six books of weeping, shipwreck, and exposure. The discus scene is a moment of resurrection. The hero was weeping on Calypso's beach three days ago; here he is reasserting his physical competence. The poem will need him to climb the bow in Book XXI; Book VIII is where his strength comes back.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Iliad XXIII's funeral games for Patroclus use the same template — discus, foot-race, wrestling, boxing. The Phaeacian games of Odyssey VIII are the peaceful inversion of those warrior-games.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXIII",
        targetBookId: "the-iliad",
        targetChapterNumber: 23,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "odyssey-8-ares-aphrodite",
    bookId: "the-odyssey",
    chapterNumber: 8,
    anchorText: "Began the lay: he sang the loves of Mars",
    anchorOccurrence: 1,
    title: "The Song of Ares and Aphrodite",
    quotedPassage:
      "The loves of Mars and Venus fair-haired.",
    passageReference: "Book VIII (Bryant)",
    commentary: `Demodocus's second song is a comic one: Aphrodite and Ares, caught in Hephaestus's magical chain-net, exposed naked before the laughing gods. The tone is unlike anything else in the poem — closer to an Athenian comedy than to the heroic register.

The song is also a commentary on marriage. Odysseus is traveling toward Penelope; he has just refused Calypso; he is being indirectly offered Nausicaä. And here, in the middle of the Phaeacian court, the bard sings about a cuckolded husband who used cunning craftsmanship to catch his adulterous wife in the act. Hephaestus's web is literally a *trap* of woven cleverness — the same material vocabulary as Penelope's shroud.

Homer never puts a moral in the reader's mouth. But a reader who is about to go home after twenty years away, to a wife surrounded by a hundred suitors, might listen to this song carefully.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Chaucer's Merchant's Tale (Canterbury Tales) transplants this song's plot into a medieval garden — old husband, young wife, magical tree, caught in flagrante. Homer's comic register becomes the root of the Western fabliau tradition.",
        workTitle: "The Canterbury Tales",
        workAuthor: "Geoffrey Chaucer",
        passageReference: "The Merchant's Tale",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-8-naming-moment",
    bookId: "the-odyssey",
    chapterNumber: 8,
    anchorText: "The deep has come where wise Alcinoüs holds",
    anchorOccurrence: 1,
    title: "The Naming About to Happen",
    quotedPassage:
      "Wherefore weepest thou with such deep groans, / O stranger?",
    passageReference: "Book VIII, closing (Bryant)",
    commentary: `Alcinoüs finally asks what everyone has been delicately avoiding: *who are you?* The third song has set Odysseus weeping again — this time Demodocus has sung the Trojan horse, and there is no more pretending. The question opens the long answer that is Books IX–XII: the apologoi, Odysseus's autobiography.

The hero's name is about to be spoken. When Book IX begins, the first sentence out of Odysseus's mouth will be "I am Ulysses, son of Laertes." Homer has waited eight books to let him say it. This is the poem's most earned moment of self-naming, the exact inverse of the Book IX Cyclops episode where naming oneself is catastrophic.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The naming at Alcinoüs's court is the structural counterpoint to the naming at the Cyclops's cave. Both happen in Book IX of the poem but at opposite ethical valences — among friends, among enemies.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: "Ulysses, the destroyer of walled towns",
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
]
