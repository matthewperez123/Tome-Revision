import type { Annotation } from "../types"

// ── Paradise Lost Book I — hand-authored scholarly annotations ──────────
// Milton's 1674 second edition (Standard Ebooks). Anchors are line-exact
// against the transformed HTML in public/content/paradise-lost/ch-0.json
// (data-pl-line="N"). Book I covers: the epic invocation, Satan and the
// fallen legions waking on the burning lake, the great catalogue of
// fallen angels under the names of ancient Near Eastern and classical
// idols, and the building of Pandemonium by Mulciber.
//
// Density target per spec Part 4: 14–18 annotations per book. Book I
// carries a large share of the poem's signature passages (the opening
// period, Satan's rhetoric, the Galileo simile, the autumnal-leaves
// simile, the Dante inversion) and is weighted accordingly.

export const PARADISE_LOST_BOOK_1: Annotation[] = [
  // ── 1. Opening invocation ────────────────────────────────────────────
  {
    id: "pl-1-invocation",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "Of Man’s first disobedience",
    anchorOccurrence: 1,
    title: "The Invocation — 16 lines in a single sentence",
    quotedPassage:
      "Of Man's first disobedience, and the fruit / Of that forbidden Tree, whose mortal taste / Brought death into the World, and all our woe, / With loss of Eden, till one greater Man / Restore us, and regain the blissful seat, / Sing Heavenly Muse…",
    passageReference: "Book I, lines 1–6 · PL I.1–6",
    commentary: `Milton's opening is a deliberate answer to Virgil's *Arma virumque cano*: where the Aeneid begins with arms, Paradise Lost begins with *Man*, and the first word-order move of the poem is already its theological argument. "Of Man's first disobedience" places the subject before the verb; *Sing* arrives five lines later, after four full clauses have stretched the syntax into suspension. This is Milton's characteristic long period — the main verb postponed until the reader's patience and comprehension have both been taxed, and the syntactic arrival coincides with the semantic one ("Sing, Heavenly Muse").

The sentence runs sixteen lines before resolving. Every subsequent Miltonic invocation (III.1–55, VII.1–39, IX.1–47) picks up this suspended-period signature, and so do the long speeches of Satan and God. Learn to parse this sentence and you have learned to read the whole poem. The useful mental move: track the subject ("I") and verb ("Sing"), and treat everything else as modifying clauses.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Milton's opening is the Christian answer to Virgil's opening three words. Virgil gives arma (war) priority; Milton gives Man priority and demotes war to the interior of the poem (the war in Heaven of Book VI). The inversion is itself the argument.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, line 1",
        targetBookId: "the-aeneid",
        targetChapterNumber: 0,
        targetAnchorText: "Arms, and the man I sing",
      },
      {
        type: "echo",
        description:
          "Compare Homer's Odyssey opening — one word (polytropos) before the hero's name — and the Iliad's one emotion (anger) first. Milton's first word is the category of *all* of us: Man. The epic tradition's opening move is consciously displaced and universalized.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book I, line 1",
        targetBookId: "the-odyssey",
        targetChapterNumber: 0,
        targetAnchorText: "Tell me, O Muse, of that sagacious man",
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 2. Justify the ways ─────────────────────────────────────────────
  {
    id: "pl-1-justify",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "justify the ways of God to men",
    anchorOccurrence: 1,
    title: "\"That… I may assert Eternal Providence, / And justify the ways of God to men\"",
    quotedPassage:
      "That, to the height of this great argument, / I may assert Eternal Providence, / And justify the ways of God to men.",
    passageReference: "Book I, lines 24–26 · PL I.24–26",
    commentary: `These three lines are the poem's stated purpose, and they close the sixteen-line opening period. *Justify* carries its seventeenth-century legal force: to establish as just, to defend in court. Milton is naming the project of theodicy — from Greek *theos* + *dike*, "the justice of God" — which Leibniz would coin as a technical term a generation later.

The claim is extraordinary in scale: not to explain God's ways, but to *defend* them, in verse, against the reader's likely objections. The entire poem is the argument. Every scholarly debate about Paradise Lost — is Satan the real hero? does Milton believe the felix culpa? is Eve treated justly? — is downstream of this promise. Hold Milton to the promise as you read: when Satan rises magnificently, or Adam yields to Eve, or God speaks with what feels like cold justice, ask whether the poem is clearing or muddying the case it set out to make.

The "Justify the Ways" Seal in the Tome trial system is named from this line.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 3. Satan rises — Dante inversion ────────────────────────────────
  {
    id: "pl-1-satan-rises",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "If thou beest he",
    anchorOccurrence: 1,
    title: "Satan rising from the lake — inverting Dante's frozen Lucifer",
    quotedPassage:
      "\"If thou beest he—But Oh how fallen! how changed / From him, who in the happy realms of light, / Clothed with transcendent brightness, didst outshine / Myriads, though bright!\"",
    passageReference: "Book I, lines 84–87 · PL I.84–87",
    commentary: `Satan's first spoken words. *How fallen, how changed* — the line splits mid-phrase with a sigh, and the syntax is already the syntax of a mind that has rehearsed this recognition many times. He is addressing Beelzebub, but the camera stays on him: we learn Satan before we learn Beelzebub because Milton's whole rhetorical wager is on Satan's voice.

Crucially, this Satan is rising. Dante's Satan, at the center of Inferno XXXIV, is frozen in ice up to the waist, weeping and chewing traitors, absolutely immobile — the ultimate parody of motion, the thing nearest the center of gravity. Milton inherits every piece of Dante's iconography (the wings, the enormous scale, the posture in frozen liquid) and inverts the one feature that matters: his Satan *moves*. He pulls himself from the burning lake, speaks, organizes, leads. The whole energetic architecture of Paradise Lost — Satan's council, voyage, temptation — is built on the decision to let him rise where Dante froze him.

This also means Milton's readers have to work harder than Dante's. In the Inferno the moral is spatial: Satan is stuck at the bottom, you are with Dante walking past him. In Paradise Lost Satan is the most active character, and his rhetoric is the most compelling. Milton is betting that the reader who understands why that must be so — and how not to be fooled by it — learns something Dante cannot teach.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Dante's Satan, frozen in ice at the center of Hell, is Milton's direct iconographic source — and the one feature Milton inverts. Milton's Satan rises; Dante's cannot move.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno XXXIV",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 4. Mind is its own place ────────────────────────────────────────
  {
    id: "pl-1-mind-own-place",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "The mind is its own place",
    anchorOccurrence: 1,
    title: "\"The mind is its own place\" — Satan's great self-deception",
    quotedPassage:
      "The mind is its own place, and in itself / Can make a Heaven of Hell, a Hell of Heaven. / What matter where, if I be still the same, / And what I should be, all but less than he / Whom thunder hath made greater?",
    passageReference: "Book I, lines 254–259 · PL I.254–58",
    commentary: `One of the most quoted lines in English poetry, and one of the most misread. Stripped of context, "The mind is its own place" sounds like a Stoic triumph over circumstance — a consolation for every reader who has ever been miserable in a beautiful room. That is exactly what Satan wants it to sound like.

Read the sentence it sits inside. Satan is arguing that geography doesn't matter: if his mind is intact, Hell is as good as Heaven. But the entire rest of the poem shows this to be false, and Satan himself will disprove it in Book IV when, on Mount Niphates, seeing Eden, he cries "Myself am Hell" — the same metaphor, now turned inside out, admitting that his mind has carried Hell with it. The Book I version is defiance; the Book IV version is confession. Milton is showing the exact same figure of speech used first as bravado and then as despair, and the lesson is in the gap between them.

Why the line survives as a quotation despite being wrong-in-context: Milton makes Satan's rhetoric work. The line *is* beautiful, and the iambic pentameter is perfect, and the reader who highlights it without reading Book IV has been taught something about reading Milton.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Satan repeats this figure at IV.75 — 'Myself am Hell' — but now as despair rather than defiance. Compare the two uses: the same metaphor reversed is Milton's method for showing Satan's rhetorical self-deception collapsing.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IV, line 75",
        targetBookId: "paradise-lost",
        targetChapterNumber: 3,
        targetAnchorText: "Myself am Hell",
      },
      {
        type: "echo",
        description:
          "Hamlet's \"I could be bounded in a nutshell and count myself a king of infinite space, were it not that I have bad dreams\" is the nearest Shakespearean cousin — the same consolation, cut short by the same honesty.",
        workTitle: "Hamlet",
        workAuthor: "William Shakespeare",
        passageReference: "Act II, Scene ii",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 5. Better to reign in Hell ──────────────────────────────────────
  {
    id: "pl-1-better-reign",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "Better to reign in Hell",
    anchorOccurrence: 1,
    title: "\"Better to reign in Hell, than serve in Heaven\" — Satan's rhetoric is not Milton's conclusion",
    quotedPassage:
      "Here we may reign secure; and, in my choice, / To reign is worth ambition, though in Hell: / Better to reign in Hell, than serve in Heaven.",
    passageReference: "Book I, lines 261–263 · PL I.261–63",
    commentary: `The single most misused line in English poetry. On the page, Satan is justifying his choice with a maxim that sounds, at the velocity of poetry, self-evidently true. The iambic pentameter is clean, the antithesis (reign/serve, Hell/Heaven) is perfectly balanced, and the line's rhetorical snap invites assent.

But what is Satan actually saying? That dominion over an inferior place is preferable to obedience in a superior one. The maxim is true if and only if *reigning* is the highest good — which is exactly the proposition Milton's whole poem is written to disprove. Blake's famous claim that Milton was "of the Devil's party without knowing it" is downstream of moments like this: readers *feel* that Satan has won the argument, because the rhetoric is so good, and they conclude the author must secretly agree. Empson, Lewis, Fish, and Lewalski have spent the last century working through this problem, with divergent answers.

The responsible reading: Milton is teaching you to hear how seductive the case sounds, and also how to notice, a hundred lines later, that Satan has traded Heaven for a burning lake full of his own bewildered followers. The rhetoric sells the choice; the context shows the cost. Both are the poem.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 6. Princes, Potentates — rallying speech ───────────────────────
  {
    id: "pl-1-princes-potentates",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "Princes, Potentates",
    anchorOccurrence: 1,
    title: "\"Princes, Potentates, / Warriors, the flower of Heaven\" — the rhetoric of the rally",
    quotedPassage:
      "\"Princes, Potentates, / Warriors, the flower of Heaven, once yours, now lost, / If such astonishment as this can seize / Eternal Spirits!\"",
    passageReference: "Book I, lines 315–318 · PL I.315–18",
    commentary: `Satan is rousing the fallen angels from stupor. Notice the rhetorical structure: three escalating appositional terms (*Princes, Potentates, Warriors*) that honor the listeners as they are recognized; the turn of the second line ("once yours, now lost") that admits the defeat without conceding it; and the shamed conditional ("If such astonishment…") that converts despair into a point of honor they must refuse.

This is the first full example in English poetry of Satan as a rhetorician, and it is a specific rhetorical species — Homeric / Iliadic generalship, the speech of the commander reminding his men who they are. Hector does this to the Trojans at Iliad VIII.173ff; Aeneas to the Trojans at Aeneid I.198ff ("O socii…"). Milton is deliberately echoing the epic rallying speech as a genre, and asking the reader to notice that the greatest rhetorical performance of the kind, in English, comes from the mouth of the Adversary.

The craft demonstration here is part of the poem's pedagogy: Milton wants the reader to *hear* a great rally speech, delivered by a speaker we have been warned against, and to feel the pull. That pull is the substance of the temptation motif. Eve will feel it in Book IX.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Aeneas's rallying speech at Aeneid I.198ff — 'O socii, neque enim ignari sumus ante malorum' ('Comrades, we have known worse') — is a template. Milton turns the consoling-general speech into Satan's signature, so every future reader of Paradise Lost will hear the Virgilian memory under Satan's lines.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, lines 198ff",
        targetBookId: "the-aeneid",
        targetChapterNumber: 0,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },

  // ── 7. Autumnal leaves simile ───────────────────────────────────────
  {
    id: "pl-1-autumnal-leaves",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "Thick as autumnal leaves",
    anchorOccurrence: 1,
    title: "\"Thick as autumnal leaves\" — the ancestor-simile of the fallen",
    quotedPassage:
      "Thick as autumnal leaves that strow the brooks / In Vallombrosa, where the Etrurian shades / High over-arched embower…",
    passageReference: "Book I, lines 302–304 · PL I.302–04",
    commentary: `Milton's single most traceable simile, because he is doing it in full view. The image — fallen warriors compared to fallen leaves — is Homer's (Iliad VI.146–49, Glaucus to Diomedes: "like the generations of leaves"), and then Virgil's (Aeneid VI.309–10, the shades of the dead at the river Styx: *quam multa in silvis autumni frigore primo lapsa cadunt folia*), and then Dante's (Inferno III.112–14, the souls at Acheron: *Come d'autunno si levan le foglie*).

Milton is consciously inheriting all three and naming his place on the line: *Vallombrosa*, "shaded valley," is a real monastery in the Etrurian (Tuscan) Apennines Milton is said to have visited. The leaves in Milton's simile are literal local leaves; the comparison reaches back to Homer and sets Milton explicitly in the classical-to-Christian line. The reader who has already read Inferno III will register the echo as direct — Milton is picking up exactly where Dante left off.

What's at stake: Milton's fallen angels are not being compared to *any* old multitude. They are being placed in a 2,500-year-old tradition of comparisons for the dead, and the tradition is descending along with the leaves.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's simile at Aeneid VI.309–10 compares the crowding shades of the dead at Acheron to autumn leaves. Milton's English line is carrying Virgil's Latin on its back.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 309–310",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Dante's Inferno III compares the souls gathered at the banks of Acheron to autumn leaves falling: 'As in autumn the leaves fall one after the other…' Milton is picking up the line directly from Dante.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno III, lines 112–114",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Homer, Iliad VI.146–149, Glaucus to Diomedes: 'As is the generation of leaves, so is that of humanity.' The ancestor of the line.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book VI, lines 146–149",
        targetBookId: "the-iliad",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 8. Satan's shield / Galileo simile ──────────────────────────────
  {
    id: "pl-1-galileo-shield",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "Tuscan artist",
    anchorOccurrence: 1,
    title: "Satan's shield compared to the moon through Galileo's telescope",
    quotedPassage:
      "His ponderous shield, / Ethereal temper, massy, large, and round, / Behind him cast. The broad circumference / Hung on his shoulders like the Moon, whose orb / Through optic glass the Tuscan artist views / At evening, from the top of Fesole, / Or in Valdarno, to descry new lands, / Rivers, or mountains, in her spotty globe.",
    passageReference: "Book I, lines 284–291 · PL I.284–91",
    commentary: `Milton's one explicit reference to a living (at time of composition) contemporary. *The Tuscan artist* is Galileo, whom Milton had visited in 1638 when Galileo was under house arrest by the Roman Inquisition in Arcetri near Florence. *Fesole* is Fiesole; *Valdarno* is the Arno valley — both are real places Galileo looked from. The simile compares Satan's shield, held at the scale of classical epic, to the moon as the new astronomy had just shown it to be — pitted, irregular, *spotty* — a body that had been perfect in Ptolemaic-Aristotelian cosmology and was suddenly, empirically, imperfect.

Two things are happening at once. First, Milton is doing scale: the shield is the size of the moon, not "like the moon" the poet has seen, but the moon *as seen through the newest optical instrument in the world*, i.e. impossibly large. Second, Milton is naming a moment of historical contact: the last great Christian epic poet has stood in the same room as the man whose observations would dismantle the cosmology the poem needs. Milton leaves the tension in the poem without resolving it — Satan's shield is lunar in both cosmologies, and the reader is invited to register the modernist strangeness of the moment.

The biographical footnote is checkable: Milton, in *Areopagitica* (1644), records visiting "the famous Galileo, grown old, a prisoner to the Inquisition." This annotation is the same event surfacing inside the poem.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 9. Catalogue of fallen angels ───────────────────────────────────
  {
    id: "pl-1-catalogue",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "The chief were those who, from the pit of Hell",
    anchorOccurrence: 1,
    title: "The catalogue of fallen angels — Milton's syncretic idolatry",
    quotedPassage:
      "The chief were those who, from the pit of Hell, / Roaming to seek their prey on Earth, durst fix / Their seats, long after, next the seat of God…",
    passageReference: "Book I, lines 381–391 · PL I.381ff",
    commentary: `Milton is about to run through roughly 140 lines of ancient Near Eastern, Greek, Roman, and Egyptian deities — Moloch, Chemos, Baalim, Ashtoreth, Thammuz, Dagon, Rimmon, Osiris, Isis, Orus, Belial — and identify each one as one of the fallen angels, later worshipped by humanity under an idol's name. This is the poem's most famous *syncretism*: the thesis that the pagan pantheons are real (they are the fallen angels) but not divine (the angels are fallen). It is also Milton's most aggressive piece of comparative mythology.

The move has two consequences. First, it absorbs every other epic's divine machinery into Paradise Lost: Homer's gods, Virgil's gods, Ovid's gods, and the Old Testament's rival deities all now have names in Milton's hierarchy of Hell. Second, it rewrites the history of religion: every ancient idol is a specific fallen angel's self-rebranding campaign, and what the reader experienced in Homer or Ovid is being reinterpreted as the *backstory* of Milton's Hell.

Each named idol gets a gloss in the Tome gloss layer — tap the name to see the one-line identification. The catalogue is pedagogically dense on purpose; Milton wrote it for a reader educated in the King James Bible and in Sandys's translation of Ovid. Modern readers are owed the glosses.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Homer and Virgil's divine machineries — Zeus/Jove, Poseidon/Neptune, Aphrodite/Venus — are not named here; Milton's catalogue is deliberately Semitic. But the move behind it is the same: the gods of earlier poems are, in this one, real but secondary beings. Read Milton's catalogue as the Christian answer to the *Theomachy* in Iliad XX.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XX",
        targetBookId: "the-iliad",
        targetChapterNumber: 19,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "historical"],
  },

  // ── 10. Moloch ──────────────────────────────────────────────────────
  {
    id: "pl-1-moloch",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "First, Moloch, horrid king",
    anchorOccurrence: 1,
    title: "Moloch, first named — \"horrid king, besmeared with blood\"",
    quotedPassage:
      "First, Moloch, horrid king, besmeared with blood / Of human sacrifice, and parents' tears; / Though, for the noise of drums and timbrels loud, / Their children's cries unheard that passed through fire / To his grim idol.",
    passageReference: "Book I, lines 392–396 · PL I.392–96",
    commentary: `Moloch is first in the catalogue because he is the most monstrous — the Ammonite god to whom parents burned their children (2 Kings 23:10, Jeremiah 32:35). Milton's detail *though for the noise of drums and timbrels loud, their children's cries unheard* is devastating: the drums are there to drown out the screaming. Milton read his Bible with a specific imagination for what idolatry would have sounded like to the people caught inside it.

When Moloch speaks in the Book II council (II.43–105) he will argue for open war against Heaven — "*My sentence is for open war*." The argument is pure destructive rage, utterly unconvincing as strategy, and Milton positions it first in the debate so that the reader sees the spectrum: Moloch is the violent pole, Belial the pacifist-by-cowardice pole, Mammon the materialist pole, and Beelzebub (cueing Satan's plan) the synthesizing pole. The character the drums were meant to drown out is the first to speak the loudest.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Moloch's Book II speech for open war is his rhetorical follow-up to this characterization. The epithets match.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book II, lines 43–105",
        targetBookId: "paradise-lost",
        targetChapterNumber: 1,
        targetAnchorText: "My sentence is for open war",
      },
    ],
    tags: ["mythological", "historical"],
  },

  // ── 11. Mulciber — Vulcan fallen ────────────────────────────────────
  {
    id: "pl-1-mulciber",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "Mulciber",
    anchorOccurrence: 1,
    title: "Mulciber — Hephaestus / Vulcan as a fallen angel",
    quotedPassage:
      "Men called him Mulciber; and how he fell / From Heaven, they fabled, thrown by angry Jove / Sheer o'er the crystal battlements; from morn / To noon he fell, from noon to dewy eve, / A summer's day; and with the setting sun / Dropt from the zenith, like a falling star…",
    passageReference: "Book I, lines 740–745 · PL I.740–45",
    commentary: `The architect of Pandemonium is Mulciber — the Roman cult-name for Vulcan, himself the Latin name for Hephaestus. Milton is explicit: Mulciber, the classical smith-god, *is* one of the fallen angels. The passage even quotes the Iliad's story (I.590–94) of Hephaestus being hurled out of Olympus by Zeus, "from morn to noon he fell" — and then calls it a fable, a partial memory, of what *really* happened: the original fall from Heaven, long before the Greeks told it as pantheon gossip.

The palette payoff: in the Tome speaker palette, Mulciber carries a forge-orange that deliberately matches Hephaestus's forge-orange in the Iliad and Vulcan's forge-orange in the Aeneid. The color itself is the cross-work echo.

The literary move is characteristic Milton: pagan mythology is not false, it is partial — a garbled, demoted memory of a larger event the classical poets could not see in full. Every time a classical god appears in Paradise Lost, the reader is being asked to re-file him in a Christian taxonomy.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer, Iliad I.590–594: Hephaestus tells his mother Hera how Zeus 'seized me by the foot and hurled me from the divine threshold, and I fell all day long, and with the setting sun I landed in Lemnos.' Milton's lines are a direct verse translation.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book I, lines 590–594",
        targetBookId: "the-iliad",
        targetChapterNumber: 0,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Vulcan forges Aeneas's shield at Aeneid VIII.370ff. In Virgil he is a working craftsman god; Milton reveals him as a fallen angel doing the same craftsmanship under an idol's name.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VIII, lines 370ff",
        targetBookId: "the-aeneid",
        targetChapterNumber: 7,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 12. Pandemonium rising "like an exhalation" ─────────────────────
  {
    id: "pl-1-pandemonium",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "rose like an exhalation",
    anchorOccurrence: 1,
    title: "Pandemonium rises \"like an exhalation\" — Hell's parody architecture",
    quotedPassage:
      "Anon out of the earth a fabric huge / Rose like an exhalation, with the sound / Of dulcet symphonies and voices sweet…",
    passageReference: "Book I, lines 710–712 · PL I.710–12",
    commentary: `The building of Pandemonium is the first major set-piece of the poem after Satan's rise from the lake. *Like an exhalation* is an extraordinary choice of simile — buildings do not rise like breath. The image is weightless, as if the palace were being imagined into existence rather than built, and Milton wants the reader to feel the too-easiness of the thing: the fallen angels' capital is *exhaled* out of hell, and the speed is a sign of its unreality.

Pandemonium is Milton's coinage — Greek *pan* (all) + *daimon* (demon). It literally means "Place of All Demons," and the word enters English in this poem. The palace is modeled on classical temple architecture (Doric pillars, gilded capitals, a ceiling of molten gold) because Milton is writing Hell in the idiom of Roman imperial splendor: the fallen angels re-make their city in the image of the city that had persecuted the early Church. The parody is political as well as theological.

The building's architect, Mulciber (see the preceding annotation), adds the last layer. Classical magnificence, built by a demoted classical craftsman, from materials hell apparently produces on demand, in time faster than architecture allows. Every piece of it reads as wrong.`,
    crossReferences: [],
    tags: ["linguistic", "historical"],
  },

  // ── 13. Opening 16-line sentence — syntactic parse ──────────────────
  {
    id: "pl-1-syntax-opening",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "Sing, Heavenly Muse",
    anchorOccurrence: 1,
    title: "Parsing the opening sentence — where is the main verb?",
    quotedPassage:
      "Of Man's first disobedience… Sing, Heavenly Muse, that, on the secret top / Of Oreb, or of Sinai, didst inspire / That shepherd, who first taught the chosen seed…",
    passageReference: "Book I, lines 1–10 · PL I.1–10",
    commentary: `One Miltonic sentence, sixteen lines long, and the main verb does not arrive until line 6: *Sing.* Everything before that verb is the grammatical object of the imperative ("*Of* Man's first disobedience…" — the *of* is doing the work of *about*, the thing the Muse is being asked to sing about). Everything after the verb is a cascade of relative clauses modifying *Muse*: which Muse, on which mountain, inspired which shepherd…

To read Milton you have to hold the sentence open — not rush for the period. This is the first and most important lesson in reading Paradise Lost. The poetic effect is the held breath: the suspension is not a bug but the feature, and it mimics the vast delay between the Fall (in time) and the restoration ("till one greater Man / Restore us," I.4–5). The syntax enacts the waiting.

When the 17th-century ear accepted this kind of Latinate delay, it was trained on Cicero and Seneca. When the modern ear resists it, that is also a historical fact about how English prose has shortened its sentence since Milton. Keep the habit of tracking (1) the subject, and (2) the main verb. The rest fills in.`,
    crossReferences: [],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 14. "Better to reign" as rhetorical climax / second Satan speech ─
  {
    id: "pl-1-is-this-the-region",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "Is this the region, this the soil, the clime",
    anchorOccurrence: 1,
    title: "Satan surveying Hell — the rhetoric of defiant acceptance",
    quotedPassage:
      "\"Is this the region, this the soil, the clime,\" / Said then the lost Archangel, \"this the seat / That we must change for Heaven? This mournful gloom / For that celestial light?\"",
    passageReference: "Book I, lines 242–245 · PL I.242–45",
    commentary: `Satan's second major speech. Notice the tricolon ("the region, this the soil, the clime") — three near-synonyms held apart by comma-rhythm, asking the same question in three registers (geographic, agricultural, climatic). The effect is the mind refusing to accept what it sees: the iteration is grief.

Then the answer-phase: "Be it so, since he / Who now is sovereign can dispose and bid / What shall be right…" The defiance collapses into resignation, and then the resignation recoils into the great closing couplet of the speech: "Here at least / We shall be free… Better to reign in Hell, than serve in Heaven" (I.261–63, annotated separately). The speech is a rhetorical arc: from grief through submission into a new founding claim.

Milton is rehearsing something the Iliad and Aeneid both do: the commander's survey-of-desolation speech (Aeneas in Aeneid III looking at ravaged Thrace; Achilles in Iliad XVIII on Patroclus). The template is the same; the content has been inverted.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },

  // ── 15. Beelzebub response ──────────────────────────────────────────
  {
    id: "pl-1-beelzebub-response",
    bookId: "paradise-lost",
    chapterNumber: 0,
    anchorText: "O Prince, O Chief of many throned powers",
    anchorOccurrence: 1,
    title: "Beelzebub — the rhetorician's second voice",
    quotedPassage:
      "\"O Prince, O Chief of many throned powers, / That led the embattled Seraphim to war…\"",
    passageReference: "Book I, lines 128–129 · PL I.128–29",
    commentary: `Beelzebub's first words. Observe the rhetorical move: four ascending vocatives (*Prince, Chief, of many, throned powers*) piled in a single line, plus the grandiose military epithet *embattled Seraphim*. Beelzebub is not arguing with Satan; he is confirming him. The psychological dynamic of the Book I and II debates is being set up: Beelzebub's job is to echo and amplify Satan, so Satan's proposals arrive as if already endorsed.

In Book II, Beelzebub will deliver the plan to tempt mankind, and the reader is meant to recognize that the "new" plan is Satan's, pre-placed in Beelzebub's mouth. The two-person chorus (Satan, with Beelzebub as his audible amplifier) is the mechanism by which the fallen-angels' council in Book II produces exactly the conclusion Satan wants without Satan himself appearing to push for it.

Beelzebub's name (Hebrew *Ba'al-z'bûb*, "Lord of the Flies") became, in the Second Temple period, a generic name for the chief of the demons. Milton keeps him as Satan's second-in-command, a position confirmed by the near-enthronement in II.299ff.`,
    crossReferences: [],
    tags: ["historical", "mythological"],
  },
]
