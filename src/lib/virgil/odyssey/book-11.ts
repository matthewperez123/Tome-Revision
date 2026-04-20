import type { Annotation } from "../types"

// Book XI: The Nekyia — Odysseus's descent to the land of the dead.
// The densest book of the poem, annotated accordingly.

export const ODYSSEY_BOOK_11: Annotation[] = [
  {
    id: "odyssey-11-nekyia-opening",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "Now, when we reached our galley by the shore",
    anchorOccurrence: 1,
    title: "The Descent Begins",
    quotedPassage:
      "Now, when we reached our galley by the shore, / We drew it first into the mighty deep.",
    passageReference: "Book XI, opening (Bryant)",
    commentary: `No descent into Hades in Book XI. Odysseus simply sails to the edge of the world, beaches the ship, digs a trench, pours libations, and the dead come to him. The underworld is not a place you travel to — it is a place the poet lets brush against the living world at a calibrated geographical edge.

Virgil (Aeneid VI) and Dante (Inferno) will both architect proper underworlds — cities, rivers, concentric rings. Homer's is flatter, stranger, more primal. The dead come up through the libation trench; Odysseus keeps them off with a drawn sword; speech with them requires each shade to drink the offering-blood first. It is a shamanic séance more than a descent. It also predates the Greek geography-of-death that later Hellenistic writers will spell out.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Aeneid VI — Aeneas's descent with the Sibyl — is Virgil's direct reply to this book, but reshaped into architecture. Homer's edge-of-the-world trench becomes Virgil's ordered afterlife.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Dante reads Virgil reading Homer — Inferno's architecture is the Aeneid's architecture retopographed for Christian theology. But the first ghost-encounter pattern (the speaker unable to cross, the shade that begs for a service) is Homer's.",
        workTitle: "Inferno",
        workAuthor: "Dante Alighieri",
        passageReference: "Cantos I–III",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-11-elpenor-burial",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "“And first the soul of my companion came,",
    anchorOccurrence: 1,
    title: "Elpenor's Plea",
    quotedPassage:
      "First the soul of my companion came, / Elpenor, for he had not yet been laid / Within the earth.",
    passageReference: "Book XI (Bryant)",
    commentary: `The first shade is Elpenor — the drunken crewman from Book X, unburied on Circe's roof. He begs Odysseus to return to Circe's island and bury him with his oar planted as a marker. Odysseus promises. The promise will be kept (Book XII opening).

Elpenor's plea is Homer's most explicit statement of the Greek theology of burial. The unburied dead cannot rest. They cannot join the other shades. They wander in a kind of liminal absence until a living hand marks their body.

Sophocles's Antigone is built on this theology; so is Virgil's treatment of Palinurus (Aeneid VI); so is the central ghost-scene of Hamlet. The unburied / unavenged dead are Western literature's oldest source of haunting. Elpenor is the prototype.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Sophocles's Antigone (c. 441 BCE) builds an entire tragedy on the theological axiom Elpenor states here — the dead require burial, and denying it to a brother is a crime against the gods themselves.",
        workTitle: "Antigone",
        workAuthor: "Sophocles",
        passageReference: "c. 441 BCE",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Virgil's Palinurus (Aeneid VI, 337–383) is the direct descendant of Elpenor — a helmsman lost overboard, unburied, pleading for Aeneas's service at the entrance to the underworld.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 337–383",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },
  {
    id: "odyssey-11-tiresias-prophecy",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "The soul of King Tiresias, saying this",
    anchorOccurrence: 1,
    title: "Tiresias's Prophecy",
    quotedPassage:
      "The soul of King Tiresias, saying this, / Departed.",
    passageReference: "Book XI (Bryant)",
    commentary: `Tiresias — the only shade retaining his full wits in the underworld — delivers the Odyssey's longest prophecy. Home is reachable. Beware Helios's cattle. The suitors will be slain. And then: carry an oar inland until a stranger mistakes it for a winnowing-fan. Sacrifice there; die peacefully at sea in old age.

The inland-oar prophecy is the Odyssey's most mysterious moment. It suggests a voyage after the poem's ending — a journey after homecoming. Dante grabbed this thread and made it the entire invention of Inferno XXVI: Ulysses, already home, sets out again past the pillars of Hercules and dies at sea. Homer leaves the prophecy unresolved; Dante resolves it catastrophically.

Virgil, Tennyson, Kazantzakis all take their cue from this half-second of uncertainty about whether Odysseus's return is really his end.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Dante's Inferno XXVI — Ulysses's 'folle volo' past Gibraltar — is the medieval answer to Tiresias's prophecy. Dante's Ulysses sets out for the voyage the inland-oar hinted at, and dies at sea.",
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
          "Tennyson's 'Ulysses' (1833) sits in the post-homecoming moment Homer leaves untouched — the hero aged, restless, choosing one more voyage. It is Tiresias's prophecy in a different key.",
        workTitle: "Ulysses",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "1833",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-11-anticleia",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "“And then the soul of Anticleia came\uFEFF—",
    anchorOccurrence: 1,
    title: "Anticlea — The Son Cannot Embrace the Mother",
    quotedPassage:
      "The soul of Anticleia came ... / I longed to take into my arms / ... thrice I grasped, / And thrice her image slipped away.",
    passageReference: "Book XI (Bryant)",
    commentary: `Odysseus did not know his mother was dead. She tells him — she died of grief for him. He reaches to embrace her three times, and three times her shade slips through his arms "like a shadow or a dream."

This is the Odyssey's single most affecting passage. Homer's restraint is total: no speeches, no lament, just the repeated failed embrace. A mother who died waiting for her son; a son who cannot touch her even in the underworld.

Virgil will reproduce the three-embrace pattern for Aeneas and Anchises (Aeneid VI); Dante will do it for the shade of Casella (Purgatorio II). The figure has become the single most enduring Homeric image in Western poetry. Three grasps; three times empty. The weight is in the numeric exactness — Homer knew that three makes the grief real.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Virgil reproduces the triple-failed-embrace precisely in Aeneid VI (Aeneas reaching for Anchises). It is the most directly imitated Homeric gesture in Western literature.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 700–702",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Dante reproduces the triple-failed-embrace in Purgatorio II, where the pilgrim tries to embrace his old friend Casella. Three grasps, three empty air.",
        workTitle: "Purgatorio",
        workAuthor: "Dante Alighieri",
        passageReference: "Canto II",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 35,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-11-catalogue-women",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "“And then the soul of Anticleia came\uFEFF—",
    anchorOccurrence: 1,
    title: "The Catalogue of Heroines",
    quotedPassage:
      "Then came the daughter of Salmoneus, / Tyro fair.",
    passageReference: "Book XI (Bryant)",
    commentary: `Odysseus sees a parade of heroines from the earlier mythic age — Tyro, Antiope, Alcmene, Epicaste (Oedipus's mother), Chloris, Leda, Iphimedeia, Phaedra, Ariadne, Maera, Clymene, Eriphyle. Each gets a brief identifying line. The whole catalogue is perhaps 80 lines.

This catalogue feels like a list — and later critics (notably Aristarchus of Samothrace) thought it was a Hellenistic interpolation. But the women's catalogue is doing something specific: it is making the underworld a place of genealogy. Every great mortal family begins in a mother; Odysseus is being shown the mothers, in order.

Hesiod's *Catalogue of Women* (mostly lost) is the Homeric tradition's great expansion of this technique. The Odyssey's Book XI is a small-scale performance of how mythology was *organized* in oral Greek culture: by mother-lines, by daughter-lines, by the women through whom the stories were remembered.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Hesiod's Catalogue of Women (7th–6th c. BCE) takes up the mother-centered genealogy this passage demonstrates. The heroic-women list is Homer's quietest acknowledgment that myth runs through women.",
        workTitle: "Catalogue of Women",
        workAuthor: "Hesiod (attributed)",
        passageReference: "fragmentary",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "historical"],
  },
  {
    id: "odyssey-11-agamemnon-shade",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "The soul of Agamemnon, Atreus’ son.",
    anchorOccurrence: 1,
    title: "Agamemnon's Warning",
    quotedPassage:
      "The soul of Agamemnon, Atreus' son, / Sorrowing, appeared.",
    passageReference: "Book XI (Bryant)",
    commentary: `Agamemnon's shade tells Odysseus his own murder-story for the fourth time in the poem. The repetition is structural — each time we hear it, Odysseus is further along, and the Ithacan parallel grows more specific. Agamemnon's final advice is pointed: come home quietly. Do not announce yourself. Trust no woman completely — not even Penelope.

The last line is a bruise on the poem. Agamemnon is bitter; Clytemnestra murdered him; he warns Odysseus to keep Penelope at arm's length. Homer holds the counsel in the reader's mind for twelve books, to be answered in XXIII when Penelope meets Odysseus with the bed-trick. Penelope is NOT Clytemnestra — but Odysseus has to find out, not assume it.

The narrative test Penelope sets Odysseus with the bed in Book XXIII is, among other things, her proof that Agamemnon's warning was wrong about HER specifically.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Agamemnon's warning — 'trust no woman fully' — is the frame Penelope's Book XXIII bed-test has to disprove. Her cunning with him is not Clytemnestra's. The poem is arguing back against Agamemnon.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XXIII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 23,
        targetAnchorText: "Whether my bed remains as then it was",
      },
    ],
    tags: ["mythological", "philosophical"],
  },
  {
    id: "odyssey-11-achilles-great-reversal",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "It is for those who breathe the breath of life",
    anchorOccurrence: 1,
    title: "Achilles's Reversal",
    quotedPassage:
      "Better, I say, to breathe the breath of life, / The hireling of a stranger, serving him / For wages scant, than reign o'er all the dead.",
    passageReference: "Book XI (Bryant)",
    commentary: `The single most important revision of the Iliad anywhere in Homer. Achilles — the Iliad's hero, who chose a short glorious life over a long obscure one — tells Odysseus he would trade his kleos, his whole immortal fame, for the chance to be alive and penniless.

The Iliad's moral world is overturned in three lines. Glory is not worth death; being a living slave is worth more than being king of all the dead. This is the Odyssey's quietest, deepest ethical argument — and it is placed, with surgical precision, in the mouth of the hero most identified with the opposite view.

Homer gives Odysseus no answer. There is nothing to say. He acknowledges Achilles's son Neoptolemus is doing well (a small comfort), and Achilles strides away "in joy." The comfort of a son's glory survives; Achilles's own is evaluated and found insufficient. The Iliad's code is not refuted — it is put in its proper place within a larger moral frame.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Iliad IX, 410–416 — Achilles himself laid out the Iliadic choice (short glorious life vs. long obscure one) and took the short. Odyssey XI is the same speaker revising his answer. Reading these two passages back to back is one of the great educations in the two poems.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book IX, lines 410–416",
        targetBookId: "the-iliad",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "odyssey-11-ajax-silence",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "But that of Ajax, son of Telamon,",
    anchorOccurrence: 1,
    title: "The Silence of Ajax",
    quotedPassage:
      "The soul of Ajax, Telamon's great son, / Alone, apart ... He answered not.",
    passageReference: "Book XI (Bryant)",
    commentary: `Ajax stands apart, silent, still furious at the judgment over Achilles's armor — awarded to Odysseus, which drove Ajax to suicide. Odysseus apologizes; Ajax says nothing. He turns and walks away into the dark.

Homer's silence here is one of the most powerful negative speeches in Western literature. The Iliad would have given Ajax a lament; the Odyssey gives him silence and makes it more devastating. A hero who will not speak to the poem's hero, from inside the poem — it is an unhealed wound at the center of the Greek heroic world.

Sophocles's Ajax expands this silence into a full tragedy. What Homer encapsulates in a refusal, Sophocles draws out across a stage. But Homer's silence, quite literally, is deeper.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Sophocles's Ajax (c. 445 BCE) takes this silent meeting as its prehistory — the tragedy covers the events before Ajax becomes the shade that will not speak to Odysseus in Book XI.",
        workTitle: "Ajax",
        workAuthor: "Sophocles",
        passageReference: "c. 445 BCE",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-11-minos-rhadamanthys",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "“ ‘Most glorious son of Atreus, king of men!",
    anchorOccurrence: 1,
    title: "Minos as Judge",
    quotedPassage:
      "Minos the glorious son of Jupiter, / Holding a golden sceptre, dealing law / Unto the dead.",
    passageReference: "Book XI (Bryant)",
    commentary: `Minos sits in Hades as a magistrate of the dead, sceptre in hand. Homer's description is brief and institutional — Minos is not a god, just a mortal king promoted to keep the dead's civic order.

Dante borrows this figure and makes him the terrifying gatekeeper of Inferno, coiling his tail to assign each damned soul to its circle. The upgrade from Homeric civil-servant to Dantean demon-judge is a measure of how theology transformed the underworld over two thousand years.

In Homer, the dead have civil procedure but no torment. In Dante, the civil procedure sorts souls into eternal suffering. Homer's Hades is sad; Dante's is punitive. The shift tracks the entire history of Christian eschatology.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Dante's Inferno V takes Homer's Minos and makes him the coiling judge of the damned. The difference between the two figures is the history of Christian hell.",
        workTitle: "Inferno",
        workAuthor: "Dante Alighieri",
        passageReference: "Canto V",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-11-tantalus-sisyphus",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "Seasoned with salt, nor ever have beheld",
    anchorOccurrence: 1,
    title: "Tantalus and Sisyphus",
    quotedPassage:
      "Tantalus in dreadful torment stood ... / Next I beheld that son of Aeolus, / Sisyphus.",
    passageReference: "Book XI (Bryant)",
    commentary: `Homer's Hades is not a torture-chamber, with one exception: Tantalus, eternally thirsty and hungry as the water recedes and the fruit withdraws; Sisyphus, pushing the stone up the slope only to watch it roll back. These two punishments have defined Western metaphors for pointless, unending labor.

Camus's *Myth of Sisyphus* (1942) rebuilt Western existentialism on Sisyphus's silence. Homer's original passage is briefer and crueler — Sisyphus's face is wet with sweat, the dust rises around him, the stone rolls back without comment. Homer does not ask whether Sisyphus is happy. He just watches.

Tantalus gave us the verb "tantalize." Sisyphus gave us the adjective "sisyphean." Two common English words, both born in ten lines of Bryant's Book XI.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Camus's Le Mythe de Sisyphe (1942) turned the Homeric figure into the emblem of existentialist endurance. Homer's quiet description is the ur-text.",
        workTitle: "The Myth of Sisyphus",
        workAuthor: "Albert Camus",
        passageReference: "1942",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-11-heracles-shade",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "While yet a living man, among thy friends.’",
    anchorOccurrence: 1,
    title: "Heracles — Shade and God",
    quotedPassage:
      "The shadow of Alcides vast, — the man / Himself among the gods.",
    passageReference: "Book XI (Bryant)",
    commentary: `Homer's theological sleight-of-hand: Heracles is divided. His shade wanders in Hades (with a bow still drawn, glowering) while his actual self lives among the gods on Olympus.

Ancient readers already argued about whether Homer or a later interpolator wrote these lines. Whoever wrote them was navigating a serious theological problem: Heracles was traditionally both a dead hero and a deified god. Homer's solution is surgical — split the being, put one part below, one part above.

It is also Homer's last shade-encounter in Book XI. The list descends from the structurally important (Tiresias, Anticlea, Agamemnon, Achilles) through the tragic (Ajax) and the mythical (Minos, Tantalus, Sisyphus) to this theological curiosity. Homer is winding the Nekyia down through a diminuendo of seriousness.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The bifurcated Heracles is Homer's reply to the theological problem of a human being who becomes a god. The doubled Heracles has echoes in every later account of apotheosis — Romulus in Livy, Augustus in Horace, Christ in early patristic exegesis.",
        workTitle: "Classical apotheosis tradition",
        workAuthor: "Various",
        passageReference: "Theological problem",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },
  {
    id: "odyssey-11-nekyia-closes",
    bookId: "the-odyssey",
    chapterNumber: 11,
    anchorText: "White meal upon them. Then I offered prayer",
    anchorOccurrence: 1,
    title: "The Ascent Interrupted",
    quotedPassage:
      "Pale Fear then laid upon me.",
    passageReference: "Book XI, closing (Bryant)",
    commentary: `Odysseus breaks off the Nekyia abruptly. A crowd of "ten thousand" shades is gathering; fear that Persephone might send the Gorgon up through the blood-trench drives him back to his ship.

The ending is anti-climactic on purpose. Homer does not grant full closure to the underworld visit. The Nekyia opens onto something larger than any single visit can contain. The interruption also mirrors the frame: we are still inside Odysseus's apologoi at the Phaeacian court, and he pauses for breath. Alcinoüs prompts him to continue; he does.

The self-interruption is Homer's trick of underlining the scale. The dead are uncountable, the descent is finite. The hero acknowledges he cannot stay down there forever — as, eventually, the poem cannot either.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The interrupted descent becomes a convention — Virgil's Aeneas is hurried out by the Sibyl; Dante and Virgil are rushed past the lower circles by time-pressure. Homer establishes the pattern of the descent-that-must-end.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
]
