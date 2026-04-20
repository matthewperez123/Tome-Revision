import type { Annotation } from "../types"

// ── Aeneid Book VI — hand-authored scholarly annotations ─────────────────
// John Dryden's 1697 heroic couplets. Anchors are line-exact against the
// transformed HTML in public/content/the-aeneid/ch-5.json.
//
// Book VI is the product-central book in the entire Tome catalog. It is
// where Virgil-the-poet becomes the figure who will guide Dante in the
// Commedia; it is the passage Paradise Lost I reads and inverts; it is
// the Odyssey XI Nekyia rewritten for a Roman civic purpose. Per the
// Aeneid ingestion spec: "Treat it as you would treat the five Opus-4.7
// scenes in any other book combined."
//
// Density target: 16 annotations (above the 12–16 per-book target), to
// cover the seven required passages from spec Part 4.8 plus structural
// commentary on the descent-machinery and the Roman-mission climax.
// Two apostrophe sites (Tu Marcellus eris, the Two Gates of Sleep) are
// already surfaced by the deterministic apparatus as V. monogram
// markers; their scholarly cards complement those markers here.

export const AENEID_BOOK_6: Annotation[] = [
  // ── 1. Arrival at Cumae — the architecture of the descent ──────────────
  {
    id: "aeneid-6-cumaean-shore",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "the Cumaean shore",
    anchorOccurrence: 1,
    title: "Arrival at Cumae — the descent begins",
    quotedPassage:
      "He said, and wept; then spread his sails before / The winds, and reach'd at length the Cumaean shore: / Their anchors dropp'd, his crew the vessels moor.",
    passageReference: "Book VI, lines 1–3 (Dryden) · Aeneid VI.1–5",
    commentary: `Book VI opens on a hinge. The first six books of the Aeneid have been Aeneas's Odyssey — wanderings, shipwrecks, a queen's court, a fatal love, funeral games. The last six will be his Iliad — war in Italy, a Troy-in-miniature fought for a marriage. Book VI is the pivot, and Virgil makes the geography of that pivot literal: Aeneas lands at Cumae, seeks the Sibyl, descends to the underworld, and emerges through the gate of sleep, reborn as the founder he was not yet in Book I.

Cumae itself is a real place — the Greek colony on the Bay of Naples near Lake Avernus, a volcanic crater the Romans took for an opening to the underworld. Virgil is writing in a particular landscape that his Roman reader could visit; the mythical machinery is overlaid on real terrain. This is one of the Aeneid's quiet signatures: *mythos* and *topos* collapsed into one location. Dante's Inferno will inherit the technique (Hell as a geography with coordinates).

The book's structural key is the descent-and-return pattern of *katabasis*. Odysseus does it in Odyssey XI but goes only to the border and summons shades up. Aeneas goes all the way down. The difference registers the whole difference of the two civilizations' theological imaginations: the Greek hero stays on the surface and the dead come to him; the Roman hero goes under and is shown the history to come.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The whole book is Virgil's explicit response to Odyssey XI — the Nekyia, where Odysseus meets his mother, Agamemnon, Achilles, and Heracles at the border of Hades. The cross-reference cluster on these two passages is load-bearing for the Tome catalog: Book VI ↔ Odyssey XI is the single most philosophically weighty pairing in classical epic.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XI (the Nekyia)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Dante's Commedia begins where this book ends. Virgil appears to Dante in Inferno I; they descend together in a direct structural imitation of Aeneas led by the Sibyl. The Aeneid VI ↔ Inferno I cross-reference is THE defining link of the Tome catalog — the Latin poet becoming his own character in the Italian poem.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto I–II (Dante meets Virgil)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "historical"],
  },

  // ── 2. The Sibyl in her rage ───────────────────────────────────────────
  {
    id: "aeneid-6-sibyl-cave",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "Deep in a cave the Sibyl makes abode",
    anchorOccurrence: 1,
    title: "The Sibyl of Cumae — prophecy as possession",
    quotedPassage:
      "Deep in a cave the Sibyl makes abode; / Thence full of fate returns, and of the god.",
    passageReference: "Book VI, lines 14–15 (Dryden) · Aeneid VI.42–51",
    commentary: `The Sibyl is Apollo's priestess at Cumae, but Virgil gives her something Homer's oracles do not have: a physical possession-drama. When Apollo enters her she struggles, her face changes, her voice becomes the god's — Virgil describes this at length, and it is one of the most physically specific portraits of religious ecstasy in classical literature. Dryden's Augustan decorum flattens it; the Latin is rougher.

Two literary inheritances come out of this figure:
- The Christian tradition of the Sibyls as pre-Christian prophets of Christ (via Book VI's Eclogue IV-adjacent language and the medieval *Dies Irae*: "Teste David cum Sibylla") — why Michelangelo painted Sibyls alongside Prophets on the Sistine ceiling.
- The modern tradition of the involuntary female medium (from Euripides' Cassandra forward through Eliot's *Waste Land* epigraph, which is a Sibyl of Cumae withered to the size of a hanging urn).

The woman-as-vessel-for-divine-speech is older than Virgil, but his *Sibyl* is the version everyone else writes in response to. The Aeneid's other prophetic women — Creusa's shade in Book II, Cassandra as a presence recalled, the Sibyl here — are systematically the most reliable truth-tellers in the poem. The gods lie and compete; the women who channel them do not.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Eliot opens The Waste Land (1922) with an epigraph from Petronius's Satyricon: the Sibyl of Cumae, shrunk to the size of a withered husk in a jar, asked what she wants and answering 'I want to die.' Virgil's Sibyl has become, by Eliot's time, the figure for a religious authority that has outlived its own meaning.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI (the Sibyl)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },

  // ── 3. Facilis descensus — the most quoted Virgilian maxim ─────────────
  {
    id: "aeneid-6-facilis-descensus",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "Smooth the descent, and easy is the way",
    anchorOccurrence: 1,
    title: "Facilis descensus Averno — the maxim that won't rest",
    quotedPassage:
      "Smooth the descent, and easy is the way: / (The gates of hell stand open night and day;) / But to return, and view the cheerful skies, / In this the task and mighty labour lies.",
    passageReference: "Book VI, lines 193–196 (Dryden) · Aeneid VI.126–129",
    commentary: `The Latin: *Facilis descēnsus Avernō; / noctēs atque diēs patet ātrī iānua Dītis; / sed revocāre gradum superāsque ēvādere ad aurās, / hoc opus, hic labor est.*

"The descent to Avernus is easy; night and day the gate of dark Dis stands open; but to retrace the steps and escape to the upper air — that is the work, that is the labor."

These four lines are the Sibyl's warning to Aeneas, and they became a maxim — *hoc opus, hic labor est* — the sentence Virgil is most often quoted for after *arma virumque*. Dryden's "this the task and mighty labour lies" is a competent rendering but it loses the Latin's stark demonstrative rhythm (*this is the task — THIS is the labor*). Fagles: "that is the struggle, that the labor."

The line resonates through every later descent-narrative. Dante's Commedia is the whole argument: the descent through Inferno is easy compared to the ascent through Purgatorio and Paradiso. Milton inverts deliberately in *Paradise Lost* I: "The descent and fall to us is adverse" — for the fallen angels, it is the *descent* that is hard, because they are trying to re-ascend to the heaven they lost. The inversion is part of Milton's argument that the fall is unrecoverable.

A note on translation: *hoc opus, hic labor est* enters English literature as a floating tag. Robert Louis Stevenson used it; it sits on countless nineteenth-century school-walls. It is the line the Aeneid contributes to the language as a proverb, detached from its underworld context but carrying the underworld's moral weight.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Milton in Paradise Lost I directly inverts this passage: the fallen angels find the descent easy but cannot re-ascend. The Miltonic Hell is Virgil's logic held in a Christian moral frame where the ascent is permanently barred.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 432–433 and elsewhere",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "If thou beest he",
      },
      {
        type: "echo",
        description:
          "Dante's Commedia is one long commentary on this sentence. The 100-canto structure is descent through Inferno (easy, in the sense that sin is easy), then the harder work of Purgatorio and Paradiso. Dante's Virgil citing his own words in Inferno is the cleanest literary-inheritance moment in the Western tradition.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto III (the gates of Hell)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence", "philosophical"],
  },

  // ── 4. The golden bough ────────────────────────────────────────────────
  {
    id: "aeneid-6-golden-bough",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "the golden bough",
    anchorOccurrence: 1,
    title: "The golden bough — the ticket into Hades",
    quotedPassage:
      "Perch'd on the double tree that bears the golden bough.",
    passageReference: "Book VI, line 296 (Dryden) · Aeneid VI.136–148",
    commentary: `The golden bough is Virgil's invention — no Greek source, no Roman cult. A branch of golden leaves on a tree in the forest near Lake Avernus, which will come away easily if Fate wills Aeneas to descend, and will resist if Fate does not. The Sibyl tells him to find it; two doves (Venus's birds) guide him; it breaks off in his hand with a slight resistance.

The image is so strange and so concentrated that Sir James Frazer borrowed it as the title of his twelve-volume comparative anthropology of religion (*The Golden Bough*, 1890–1915) — a book that in turn shaped Eliot's *The Waste Land*, Joseph Campbell's monomyth, and the modern academic study of myth itself. Virgil's branch carries forward through a surprising afterlife.

Scholarly puzzle: the text is ambiguous about whether Fate really was the arbiter. *Facile* in line 146 of the Latin (Dryden's "But, if deny'd the fatal bough") can mean either "easily" or "readily." The bough resists slightly when Aeneas pulls. Do we take that as confirmation of Fate's assent (it came away, after all) or as a shadow of doubt (it was harder than it should have been)? Virgil seems to want both. The ambivalence is typical of the poem's religious tone — a universe whose deepest machinery is real but never quite legible to the mortals acting under it.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Frazer's The Golden Bough (1890–1915) made Virgil's invention the master-image of comparative religion for the twentieth century. Virgil's bough is the seed from which modern mythography — and by extension modern poetry (Eliot, Yeats, Pound) — partly grew.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI (the golden bough)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 5. Thick as leaves — the Styx crowd simile ─────────────────────────
  {
    id: "aeneid-6-leaves-simile",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "Thick as the leaves in autumn strow the woods",
    anchorOccurrence: 1,
    title: "Thick as autumn leaves — the simile Dante will re-write",
    quotedPassage:
      "Thick as the leaves in autumn strow the woods, / Or fowls, by winter forc'd, forsake the floods, / And wing their hasty flight to happier lands; / Such, and so thick, the shiv'ring army stands, / And press for passage with extended hands.",
    passageReference: "Book VI, lines 428–432 (Dryden) · Aeneid VI.309–312",
    commentary: `The souls crowding to cross the Styx are compared to autumn leaves falling and to migrating birds. The simile is not original to Virgil — it adapts Homer's simile at Iliad VI.146 ("as is the generation of leaves, so is that of men"). But Virgil tightens and darkens it: the leaves are not about generations succeeding each other, they are about *the specific moment* of falling. The souls at the Styx are not humanity-in-the-abstract; they are the dead, right now, massing on the shore.

Dante, in *Inferno* III.112–117, picks up this exact simile — "*come d'autunno si levan le foglie / l'una appresso de l'altra*" — and uses it for the damned boarding Charon's boat. His source is explicit and unmistakable: Virgil is standing right there guiding him. The moment is the cleanest instance in Western poetry of what scholars call *imitatio* — a writer citing a predecessor by writing a line that only makes sense if the reader hears the predecessor beneath it. Dante is writing with Virgil's Book VI open.

Milton then re-writes Dante re-writing Virgil: *Paradise Lost* I.302–304, the fallen angels lying "Thick as autumnal leaves that strow the brooks / In Vallombrosa…" The three poets' leaves are a genealogy of Western descent-poetry — Homer, Virgil, Dante, Milton — each poet laying his leaves on the heap the previous poet left.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer's Iliad VI.146: 'As is the generation of leaves, so is that of men.' Glaucus's speech to Diomedes on the battlefield. Virgil takes the image, tightens it, and transplants it to the Styx.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book VI, lines 146–149",
        targetBookId: "the-iliad",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Dante's Inferno III.112–117 rewrites this simile, openly — 'come d'autunno si levan le foglie.' The damned at the Acheron. Dante is Virgil's student citing his master's line while walking beside him.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto III, lines 112–117",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Milton rewrites both: 'Thick as autumnal leaves that strow the brooks / In Vallombrosa' (Paradise Lost I.302–303). Three poets' leaves in one phrase.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 302–304",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 6. Charon — the horridus ferryman ──────────────────────────────────
  {
    id: "aeneid-6-charon",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "There Charon stands",
    anchorOccurrence: 1,
    title: "Charon — the horridus ferryman",
    quotedPassage:
      "There Charon stands, who rules the dreary coast— / A sordid god: down from his hoary chin / A length of beard descends, uncomb'd, unclean; / His eyes, like hollow furnaces on fire; / A girdle, foul with grease, binds his obscene attire.",
    passageReference: "Book VI, lines 413–417 (Dryden) · Aeneid VI.295–304",
    commentary: `Virgil's Charon is a physical grotesque. The Latin calls him *horrendus* — "bristling, appalling" — and details the filth: squalor on his cheeks, matted beard, flame-eyes, a greasy belt. Dryden preserves the register ("sordid god… uncomb'd, unclean… obscene attire"). Homer's underworld has no ferryman at all; Virgil is importing the figure from local Italian lore and detailing him with a realism that is almost caricature.

This is the first fully painted figure of the underworld, and its effect is to make the descent feel *embodied* in a way Homer's does not. The ghosts have no substance; the ferryman does. The Aeneid's underworld is not a neutral place where souls go — it has staff, it has a specific temperature, it has smells. Dante will inherit this approach and multiply it: the *Inferno* is Dante's Book VI grown into a hundred specified locations with specified inhabitants.

Note a precise touch: Charon refuses unburied souls passage. This is the cue for the Palinurus scene that follows (the drowned helmsman, recently lost, who begs to cross). The rule — that the dead need proper burial rites to enter — is a real Roman religious conviction, not a poetic invention. Virgil is writing actual Roman funerary theology into his underworld.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Dante's Charon in Inferno III is a direct lift — same ferryman, same fury, same fire-eyes. Dante's phrase 'Caron dimonio con occhi di bragia' (lines 109) picks up Virgil's flame-eyed grotesque and Christianizes him into a demon.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto III, lines 82–111",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 7. Palinurus — the unburied shade ──────────────────────────────────
  {
    id: "aeneid-6-palinurus",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "Palinurus press'd",
    anchorOccurrence: 1,
    title: "Palinurus at the Styx — the small injustice that haunts",
    quotedPassage:
      "Amidst the spirits, Palinurus press'd, / Yet fresh from life, a new-admitted guest, / Unblest, unbury'd, and among the crowd of wretches to the Styx admitted through the throng, / Implor'd a passage to the further shore.",
    passageReference: "Book VI, lines 461–465 (Dryden) · Aeneid VI.337–383",
    commentary: `Palinurus was Aeneas's helmsman, lulled overboard by the god Sleep at the end of Book V and drowned — one of the mortal costs exacted for Aeneas's Italian landing. Here he appears among the unburied shades who, per Charon's rule, cannot cross the Styx for a hundred years. He asks Aeneas to take him across, or to cast a handful of earth on his corpse so the rites can be completed.

The Sibyl refuses but promises him that his burial place will be named after him (the promontory in Lucania, Cape Palinurus, is named for the scene). It is a small, exact Virgilian consolation: you cannot cross tonight, but the land will remember your name. Every place in the poem where a man dies becomes a place; every drowned helmsman becomes a cape. Virgil's Italy is stitched together from proper nouns that were once people.

This is one of Virgil's signatures and one of the subtle moral weights of the Aeneid. The Italian landscape is not found; it is *paid for*. Every step of Aeneas's route leaves a named grave. By the time he reaches Latium, the ledger of loss is long — Creusa, Anchises, Palinurus, Misenus, and more — and the empire he is founding is in part a memorial to the dead who got him there.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Robert Lowell's poem 'Falling Asleep over the Aeneid' (1948) is a meditation on Palinurus — the helmsman's drowning as a figure for the mortal cost of history. The Palinurus scene is the most anthologized single moment of Book VI after tu Marcellus eris.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book V (Palinurus's death) + Book VI (his shade)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },

  // ── 8. Dido in the Fields of Mourning ──────────────────────────────────
  {
    id: "aeneid-6-dido-shade",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "Not far from these Phoenician Dido stood",
    anchorOccurrence: 1,
    title: "Dido in the Mourning Fields — the reunion that is not a reunion",
    quotedPassage:
      "Not far from these Phoenician Dido stood, / Fresh from her wound, her bosom bath'd in blood; / Whom when the Trojan hero hardly knew, / Obscure in shades, and with a doubtful view, / (Doubtful as he who sees, thro' dusky night, / Or thinks he sees, the moon's uncertain light,)… / \"Unhappy queen! then is the common breath / Of rumour true, in your reported death, / And I, alas! the cause?\"",
    passageReference: "Book VI, lines 610–635 (Dryden) · Aeneid VI.450–476",
    commentary: `The scene is often called the single greatest moment in Book VI after Marcellus. Aeneas meets Dido's shade in the Fields of Mourning — the area of the underworld reserved for those who died of love. He tries to explain himself: he did not want to leave, the gods compelled him, he did not know she would die. He weeps.

Dido does not answer. She turns away, returns to her first husband Sychaeus, and vanishes into the dark. Not one word. Virgil makes us wait for the speech that never comes.

The silence is one of the poem's moral peaks. Aeneas speaks the apology he failed to give in Book IV, finally saying the right things ("unwilling I forsook your shore"); the apology is accurate; he means it; and *it does not matter*. Dido is not obligated to forgive him, not in life, not in the underworld, not ever. Virgil registers that moral fact without flinching. The hero the poem is glorifying has caused a suffering that cannot be repaired. The silence of the shade is the poem telling the truth about its own protagonist.

The scene is the direct source of Inferno V — Dante meeting Francesca and Paolo. Dante's own tears at Francesca's story ("e caddi come corpo morto cade," Inferno V.142) are his response, in his own poem, to the scene where his guide, in his guide's poem, was the unforgiven one. The link is the cleanest literary-inheritance moment in the catalog: the Aeneid VI Dido scene ↔ the Inferno V Francesca scene. The medieval poet studying the classical master is, in that moment, teaching us that the master got it right: some griefs do not resolve.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Dante places Dido in Inferno V among the souls undone by lust. The placement is the direct medieval response to this scene. Dante's Dido is Virgil's Dido, remembered — the fifth canto of the Commedia is Dante's way of grieving this passage.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto V, lines 61–62 and 73–142",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "The model is Odyssey XI.541–567 — Odysseus meets the shade of Ajax, who also turns away in silence after the dispute over Achilles's armor. Virgil's Dido scene is a deliberate Homeric homage with the gender and the moral stakes reassigned.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XI (Ajax's silent shade)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 9. Tartarus — the punishment of the wicked ─────────────────────────
  {
    id: "aeneid-6-tartarus",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "Which to the depth of Tartarus descends",
    anchorOccurrence: 1,
    title: "Tartarus — the categorical geography of Virgil's hell",
    quotedPassage:
      "Which to the depth of Tartarus descends; / Where Rhadamanthus, who the race surveys, / Judges the dead, and sentences repays.",
    passageReference: "Book VI, lines 729–764 (Dryden) · Aeneid VI.548–627",
    commentary: `The Sibyl, who cannot herself enter Tartarus, describes it to Aeneas from the threshold. She runs through a catalogue of the punished: Titans, Salmoneus, Ixion, the Lapiths, the guilty king Tantalus, those who hated their brothers or struck their parents, those who practiced adultery, those who betrayed clients. Each category is specific. Each has its own eternal torment.

This is the most systematic moral geography in the classical underworld before Dante. Homer's Hades is morally flat — everyone ends up in the same gray asphodel meadow. Virgil imposes a *categorical* structure: there is Elysium for the virtuous, the Mourning Fields for the love-destroyed, the Fields of Lethe for those who will reincarnate, Tartarus for the actively evil. The structure is Orphic and Pythagorean in its sources, and Virgil is transmitting a syncretic Greek mystery-religion afterlife into Roman poetry.

Dante will take this seriously. *Inferno* is a much finer-grained version of Virgil's Tartarus, with nine circles instead of a single pit and a meticulous hierarchy of sins from lust (incontinence) to treachery (the frozen heart of Judas at the center). Every circle of the *Inferno* is a filing cabinet drawer from Virgil's Book VI, opened further. The medieval theology Dante brings to the classification is his own; the impulse to classify is Virgil's.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Dante's Inferno is a meticulous elaboration of Virgil's Tartarus. The nine circles, the contrapasso (the poetic justice of each punishment fitting its sin), the hierarchy of evil from incontinence to treachery — all extend the categorical impulse Virgil inherits from Orphism and hands to Dante.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "The nine-circle structure",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical", "literary-influence"],
  },

  // ── 10. Anchises unfolds — the reunion ─────────────────────────────────
  {
    id: "aeneid-6-anchises-embrace",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "thrice around his neck his arms he threw",
    anchorOccurrence: 1,
    title: "The three-fold embrace — grief at the limit of the body",
    quotedPassage:
      "\"Thy wish'd embrace permit, / And take the dear embraces of your longing son!\" / He said; and falling tears his face bedew: / Then thrice around his neck his arms he threw; / And thrice the flitting shadow slipp'd away, / Like winds, or empty dreams that fly the day.",
    passageReference: "Book VI, lines 946–951 (Dryden) · Aeneid VI.697–702",
    commentary: `Aeneas finds Anchises in Elysium. He reaches to embrace him. Three times he throws his arms around his father's neck; three times the shade slides through his arms "like winds, or empty dreams that fly the day."

Virgil has written this scene before — *word for word* — in Book II, where Aeneas tries and fails three times to embrace the shade of his dead wife Creusa on the last night of Troy. The repetition is deliberate. Aeneas has spent the whole poem losing the people who anchor him to the past, and every time — wife, father, comrades — he gropes for a substance that is not there. The three-fold embrace is Virgil's formula for grief that has no physical object.

The couplet itself is a borrowing from Homer — Odyssey XI.204–208, where Odysseus tries the same embrace with his mother Anticlea and she slips through his arms "like a shadow or a dream." Virgil takes Homer's once-given image and uses it twice in the Aeneid. What was one man's one-time grief in Homer becomes, in Virgil, a structural formula for what it means to be alive after the people who made you are not.

Dante marks this moment in *Purgatorio* II, where he tries to embrace the shade of his friend Casella and finds "l'altro suo vuoto, l'abbraccio si stroncò." Three poets, one gesture: the hand closing on nothing is how they all write the moment at which the dead are too much present and too little to hold.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The image comes from Odyssey XI.204–208 — Odysseus embracing his mother. Virgil transplants it once in Aeneid II (Creusa) and here in Aeneid VI (Anchises), so that the scene has already been rehearsed for the reader.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XI (Anticlea's shade)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
      {
        type: "allusion",
        description:
          "The Book II Creusa scene uses the same three-fold formula — Virgil writes his own echo two books before he asks you to hear it. This is the poem's technique of internal foreshadowing at its most tender.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II, Creusa's shade (lines 792–794, Latin)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Dante's Purgatorio II repeats the gesture with the shade of Casella. The echo chain Homer → Virgil → Dante for this one image is the cleanest genealogy of a poetic motif in the Western tradition.",
        workTitle: "Purgatorio",
        workAuthor: "Dante",
        passageReference: "Canto II (Casella)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 35,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 11. Tu regere imperio — the Roman mission ──────────────────────────
  {
    id: "aeneid-6-tu-regere-imperio",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "Let others better mould the running mass",
    anchorOccurrence: 1,
    title: "Tu regere imperio — the Roman mission stated",
    quotedPassage:
      "\"Let others better mould the running mass / Of metals, and inform the breathing brass, / And soften into flesh a marble face; / Plead better at the bar, describe the skies, / And when the stars descend, and when they rise. / But, Rome, 'tis thine alone, with awful sway, / To rule mankind, and make the world obey, / Disposing peace and war by thy own majestic way; / To tame the proud, the fetter'd slave to free: / These are imperial arts, and worthy thee.\"",
    passageReference: "Book VI, lines 1168–1177 (Dryden) · Aeneid VI.847–853",
    commentary: `The Latin lines (*Tū regere imperiō populōs, Rōmāne, mementō / [hae tibi erunt artes], pacīque impōnere mōrem, / parcere subiectīs et debellāre superbōs*) are the most politically explicit sentence in Latin literature. Anchises, pointing into Elysium at the unborn souls of Roman history, tells Aeneas what Rome's civilization will be for. Other peoples will sculpt better marble and argue better cases; Rome's art is *empire*, and specifically empire with a style — "to spare the submissive and subdue the proud."

Three readings sit inside this passage and the poem does not tell you which one to pick.

**The imperial reading**: Virgil is stating, without apology, the Augustan political program. Rome's mission is rule; rule is an art; Romans are good at it and should keep doing it. The poem is a foundation document for empire, and this is the thesis statement.

**The skeptical reading**: notice what Anchises concedes to others — *sculpture* (the Greeks), *oratory* (the Greeks), *astronomy* (the Greeks). Rome's specific gift is ruling. That is a strange boast if the frame is cultural — it is the kind of thing someone says when they cannot claim the higher ground. Read this way, Virgil is letting the concession speak: Rome will rule because it cannot rival Greece at anything else, and the reader is invited to notice.

**The complicated reading** (most scholars' current view): both readings hold at once, and the poem will not choose. The Aeneid can be read as an imperial poem for empire's purposes and as a poem that shows empire's cost — Dido, Turnus, Pallas, the mountain of dead. Virgil was a government contractor; he was also a great poet. The two identities were not separable in him, and this passage is their intersection.

The most honest thing to say is that the *Tu regere imperio* passage is both the summit of the Augustan program and the moment from which the poem's whole moral critique of that program can be read backward. The Aeneid contains both readings. The ending of the poem — the killing of Turnus, which the Book XII annotation takes up — is where the tension has to resolve, and it refuses to resolve.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The phrase 'parcere subiectis et debellare superbos' is quoted in every age that has wanted to justify an empire — Augustine, Charlemagne's legitimists, the British imperial tradition — and in every age that has wanted to critique one. Auden, in 'Secondary Epic,' called it the sentence by which Virgil was 'sold to the Augustan regime forever.'",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, line 853 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical", "literary-influence"],
  },

  // ── 12. The parade of Roman heroes ─────────────────────────────────────
  {
    id: "aeneid-6-parade-of-heroes",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "To set before your sight your glorious race",
    anchorOccurrence: 1,
    title: "The parade of heroes — a future written in faces",
    quotedPassage:
      "\"Long has my soul desir'd this time and place, / To set before your sight your glorious race, / That this presaging joy may fire your mind / To seek the shores by destiny design'd.\"",
    passageReference: "Book VI, lines 970–973 ff. (Dryden) · Aeneid VI.752–846",
    commentary: `Anchises walks Aeneas along the banks of Lethe, where the souls awaiting rebirth are gathered, and identifies the future of Rome face by face. The catalogue runs from Silvius (Aeneas's posthumous son by Lavinia) through the Alban kings, through Romulus and Remus, through the early Republican heroes — Brutus the tyrannicide, the Decii, the Fabii — through the Punic War generation (Fabius Maximus Cunctator, the Scipios), through Caesar and Pompey, to Augustus himself, presented as the culmination of Roman destiny.

Three observations about this passage:

**First, it is a political gesture.** Virgil is composing under Augustus's patronage and ends the parade on Augustus. The poem's contemporary reader is being told, in the voice of Aeneas's father in Elysium, that the current regime is what history has been for.

**Second, it is also more complicated than that.** Anchises pauses at Caesar and Pompey — the two generals whose quarrel caused the civil wars — and says, grieving: "Children, do not accustom your hearts to such wars; do not turn your strong force against your country's vitals." Virgil is putting, in the mouth of the hero's father, a denunciation of the civil wars that brought Augustus to power. The praise of the regime is genuine; it is also braided with grief for what the regime cost.

**Third, the parade ends not on Augustus but on Marcellus** — the young heir who had already died by the time Virgil finished the poem. The climax of Rome's glory parade is a boy who will not live. See the *Tu Marcellus eris* annotation for the apostrophe that closes the sequence. Virgil is stating the imperial program and undercutting it in the same breath.

This is also the gloss-dense section of the book. Dozens of Roman names appear; the accompanying glosses (forthcoming in the gloss module) handle the identification work so this annotation can handle the structural argument.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Milton answers the parade of heroes in Paradise Lost XII, where Michael shows Adam the history of salvation down to Christ. Virgil's imperial teleology becomes Milton's Christian one; the form (a vision of the unfolding future delivered by an authoritative elder to a hero) is explicitly inherited.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book XII (Michael's prophecy)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },

  // ── 13. Marcellus — the apostrophe that stopped a room ─────────────────
  {
    id: "aeneid-6-marcellus-apostrophe",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "See great Marcellus",
    anchorOccurrence: 1,
    title: "See great Marcellus — the dead child at the parade's end",
    quotedPassage:
      "\"See great Marcellus! how, untir'd in toils, / He moves with manly grace, how rich with regal spoils! / He, when his country, threaten'd with alarms, / Requires his courage and his conquering arms, / Shall more than once the Punic bands affright… / Mirror of ancient faith in early youth! / Undaunted worth, inviolable truth! / No foe, unpunish'd, in the fighting field / Shall dare thee, foot to foot, with sword and shield. / A new Marcellus shall arise in thee!\"",
    passageReference: "Book VI, lines 1180–1221 (Dryden) · Aeneid VI.868–886",
    commentary: `Anchises shows Aeneas the beautiful shade of a young man walking beside the Marcellus of the Punic wars — same face, same bearing, a generation younger. Aeneas asks who he is. Anchises weeps and tells him: this is Augustus's nephew Marcus Claudius Marcellus, who has died, and whom the fates will not let live.

The Latin — *Tū Marcellus eris; manibus date līlia plēnīs* — "You shall be Marcellus; give lilies with full hands" — is the most famous apostrophe in Latin poetry. Virgil addresses the dead unborn child directly. The grammatical future *eris* ("you shall be") is wrenching: the parade of heroes has been written in futures that turned into pasts, but this one future will not be realized in the Aeneid's Augustan present. Marcellus died at nineteen in 23 BC.

Servius records the reception: when Virgil read this passage aloud to Augustus and his sister Octavia (Marcellus's mother), Octavia fainted. The story may be apocryphal, but the passage's reception history is long — the line became a standard Roman school-text and, in the Christian Latin tradition, the formula *manibus date lilia plenis* entered liturgy and funerary art.

What makes the apostrophe structurally powerful is that it ends the parade of heroes. Virgil has spent eighty lines enumerating Rome's destined glory; he closes the sequence not on Augustus triumphant but on a nineteen-year-old corpse. The poem's largest political set-piece ends on grief for a boy the regime lost. This is what makes reading the Aeneid as purely triumphalist impossible. The Augustan summit is bordered on its far side by a sentence spoken, in second person, to the death of Augustus's heir.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The apostrophe 'tu Marcellus eris' becomes the model for every later poetic address to the unrealized dead — Lycidas, Adonais, 'In Memoriam.' Virgil taught English elegy how to speak to the person who is not there.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, line 883 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "linguistic", "literary-influence"],
  },

  // ── 14. The two gates of sleep ─────────────────────────────────────────
  {
    id: "aeneid-6-gates-of-sleep",
    bookId: "the-aeneid",
    chapterNumber: 5,
    anchorText: "Of polish\u2019d ivory this, that of transparent horn",
    anchorOccurrence: 1,
    title: "The two gates of sleep — Virgil's unresolved puzzle",
    quotedPassage:
      "Two gates the silent house of Sleep adorn; / Of polish'd ivory this, that of transparent horn: / True visions thro' transparent horn arise; / Thro' polish'd ivory pass deluding lies. / Of various things discoursing as he pass'd, / Anchises hither bends his steps at last. / Then, thro' the gate of iv'ry, he dismiss'd / His valiant offspring and divining guest.",
    passageReference: "Book VI, lines 1235–1242 (Dryden) · Aeneid VI.893–898",
    commentary: `Book VI ends with one of the strangest sentences in classical literature. There are two gates out of the underworld: a gate of horn, through which *true* dreams pass, and a gate of ivory, through which *false* dreams pass. Anchises sends Aeneas out through the gate of ivory — the gate of falsehood. The book ends immediately. The Aeneid does not explain why.

The scholarly tradition has been fighting about this for roughly two thousand years. Servius, in the fourth century, was already trying to explain it away. Robert Austin, in the 1977 Oxford commentary, lists over a dozen serious proposals. Four live positions worth honoring:

**Proposal A — The timing is symbolic.** Aeneas leaves at midnight; true dreams come at dawn; so he must leave through the ivory gate regardless of the content's truth. Austin argues this.
**Proposal B — Virgil is undercutting the vision.** The parade of heroes — and the Augustan program it climaxes on — is being marked as a false dream. The *Aeneid*, on this reading, is covertly critical of the regime it appears to glorify. W. R. Johnson, Michael Putnam, and the "pessimist school" of Aeneid criticism hold this view.
**Proposal C — The vision is true but the *time-frame* is false.** Aeneas cannot act on the parade of heroes because he has not yet lived the intervening twelve hundred years. Any dream of the distant future is, from the present, a kind of lie.
**Proposal D — Virgil is signaling the fictional frame.** The Aeneid is a poem; the poem is a false dream; the gates are meta-literary.

Virgil is not the only Greek or Roman source to use the two-gates image (it comes from Odyssey XIX, where Penelope invokes it); he is the only one to send a major hero through the gate of lies. Virgil's reticence is load-bearing — the fact that he does not explain is itself the position.

**The honest annotation is that the debate is genuinely open.** A polished commercial reader is in danger of overclaiming. The Aeneid ends on an ambiguity Virgil intended; honor it.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The image of the two gates is from Odyssey XIX.562–567, where Penelope tells Odysseus her dream. Homer's Penelope uses the gates as a hermeneutic — a way to say she does not know whether to trust a hopeful dream. Virgil repurposes the image into a moral puzzle at the climax of his underworld.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XIX, lines 562–567",
        targetBookId: "the-odyssey",
        targetChapterNumber: 19,
        targetAnchorText: null,
      },
      {
        type: "allusion",
        description:
          "The pessimist reading of the Aeneid — Putnam, Lyne, Parry — takes this gate as the decisive textual evidence that Virgil is ambivalent about the imperial project. The optimist reading — Galinsky, Hardie — reads it as a technical/timing decision without moral weight. Both schools are live. Do not choose for the reader.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 893–898 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Dante closes Purgatorio with Virgil's departure at the gate of the Earthly Paradise — Virgil led Aeneas OUT through the gate of false dreams, but he leaves Dante AT the threshold of true vision. The inversion is Dante's most deliberate commentary on Virgil's ending, and the rest of the Commedia is his answer to it.",
        workTitle: "Purgatorio",
        workAuthor: "Dante",
        passageReference: "Canto XXX (Virgil's departure)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 63,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical", "linguistic"],
  },
]
