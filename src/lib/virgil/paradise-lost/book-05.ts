import type { Annotation } from "../types"

// ── Paradise Lost Book V — Eve's dream, Raphael's descent, the begetting
// of the Son, Abdiel's loyalty. 11 annotations.

export const PARADISE_LOST_BOOK_5: Annotation[] = [
  {
    id: "pl-5-morning-of-eden",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "Now Morn, her rosy steps",
    anchorOccurrence: 1,
    title: "\"Now Morn, her rosy steps\" — Homeric dawn in Eden",
    quotedPassage:
      "Now Morn, her rosy steps in the eastern clime / Advancing, sowed the earth with orient pearl…",
    passageReference: "Book V, lines 1–2 · PL V.1–2",
    commentary: `Milton's formal dawn. *Rosy steps* is Homeric — the *rhododaktylos Eos* epithet, "rosy-fingered dawn" — adapted into Milton's English. Book V opens with the most explicit Homeric borrowing in the poem, because the book is about to host Raphael, a divine visitor whose descent itself is Homeric in form.

*Orient pearl* — the dew. Milton uses *orient* in its 17th-century optical sense: lustrous, precious, of the East. The whole opening image is Miltonic synthesis: Greek dawn-formula, Persian-trade simile for dewdrops, English pastoral meadow.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The rosy-fingered dawn is Homer's most reused formula (Iliad and Odyssey, dozens of occurrences). Milton uses it here to mark Book V as the hospitality book — Raphael as a Homeric guest, the day opened with the Homeric sign.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book II, line 1 and passim",
        targetBookId: "the-odyssey",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "pl-5-eve-dream",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "O sole in whom my thoughts find all repose",
    anchorOccurrence: 1,
    title: "Eve's dream — the first interior fiction of the Fall",
    quotedPassage:
      "\"O sole in whom my thoughts find all repose, / My glory, my perfection! glad I see / Thy face, and morn returned…\"",
    passageReference: "Book V, lines 28–30 · PL V.28–30",
    commentary: `Eve narrates the dream Satan has implanted. In it, a voice (unidentified but clearly satanic) leads her to the tree, offers her the fruit, and she tastes. Milton's careful theology: the dream is authored from the outside, not from her own desire; Eve awakes disturbed, tells Adam, and he consoles her that dreams are not sins.

Adam's theology of the dream (V.100–121) is precise: "*Evil into the mind of God or Man / May come and go, so unapproved, and leave / No spot or blame behind*." Impressions are involuntary; assent is voluntary. What Eve has experienced is a temptation without consent.

When Eve in Book IX reaches for the actual fruit, this dream is its prehistory. Milton has planted the imagined act in Eve's mind long before she performs it; the pattern of narrative echo is one of the poem's subtle structural features.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Eve's dream here is the rehearsal of the Fall in IX.780ff. Read the two passages as a diptych: dream and deed, involuntary impression and voluntary assent.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IX, lines 780–792",
        targetBookId: "paradise-lost",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "pl-5-raphael-descent",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "Raphael, the sociable Spirit",
    anchorOccurrence: 1,
    title: "Raphael descends — the Mercury template",
    quotedPassage:
      "Raphael, the sociable Spirit, that deigned / To travel with Tobias, and secured / His marriage with the seventimes-wedded maid.",
    passageReference: "Book V, lines 221–223 · PL V.221–23",
    commentary: `Raphael is *the sociable Spirit* — affable, conversational, welcome. Milton names him first by his reputation as a travel-companion and demon-bindert in the apocryphal Book of Tobit. The descent itself (V.247–287) follows the Homeric template: Hermes putting on his sandals in Odyssey V.43ff; Mercury descending at Aeneid IV.238ff. Milton makes the template Christian-angelic.

The detail is dense. Raphael travels through the celestial spheres "*as when by night the glass / Of Galileo*" views the lunar horizon (V.261–63) — another Galileo simile inside the poem, this one anchoring the angelic descent to the new optical astronomy. Milton repeatedly cross-wires the ancient theophany forms with the contemporary physics of observation.

Raphael's palette is warm rose-gold — the color reads as welcoming. The book's whole dynamic is hospitality: Raphael as guest, Adam and Eve as hosts, the *guest-scene* of Homeric and biblical tradition (Abraham at Mamre, Odysseus on Scheria) transposed to prelapsarian Eden.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Mercury's descent at Aeneid IV.238ff is Milton's closest template. The sandals, the atmospheric layers, the errand of warning — all transposed. The difference: Raphael is a welcome guest, Mercury an unwelcome messenger.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV, lines 238–278",
        targetBookId: "the-aeneid",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Hermes descending to Calypso's island in Odyssey V.43ff is the ultimate source. Same gestural vocabulary: winged messenger, multiple atmospheric crossings, arrival as narrative turn.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book V, lines 43–77",
        targetBookId: "the-odyssey",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-5-hail-mother",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "Hail! Mother of Mankind",
    anchorOccurrence: 1,
    title: "Raphael salutes Eve — \"Hail, Mother of Mankind\"",
    quotedPassage:
      "\"Hail! Mother of Mankind, whose fruitful womb / Shall fill the World more numerous with thy sons / Than with these various fruits the trees of God / Have heaped this table!\"",
    passageReference: "Book V, lines 388–391 · PL V.388–91",
    commentary: `The salutation is explicitly typological: *Hail, Mother of Mankind* echoes the angel's greeting to Mary in Luke 1:28 (*Ave Maria, gratia plena*, "Hail, Mary, full of grace"). Milton is making Eve a *type* of Mary — the first human mother paralleled to the Mother of God.

The typology runs in both directions. In orthodox Christian interpretation, Mary undoes what Eve did (the *second Eve*). In Milton's framing, Eve is addressed before the Fall with a greeting that will later belong to Mary — the reader is invited to hold the two women together in mind, and to feel the loss of the first typological possibility as the Fall erases it.

The Catholic / Protestant resonance of *Ave Maria* makes this a theologically loaded moment in a poem by a committed Protestant. Milton uses the formula without sentimentality; the typological claim is doing its work under the surface.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-5-monism",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "one first matter all",
    anchorOccurrence: 1,
    title: "Raphael on monism — \"one first matter all\"",
    quotedPassage:
      "O Adam, one Almighty is, from whom / All things proceed, and up to him return, / If not depraved from good, created all / Such to perfection, one first matter all, / Endued with various forms, various degrees / Of substance…",
    passageReference: "Book V, lines 469–474 · PL V.469–74",
    commentary: `Raphael's lecture on the great chain of being is Milton's most explicit statement of his *monism* — the doctrine that all existence, including matter and spirit, is continuous and derived from one divine substance. Matter is not evil or inferior; it is the same stuff as spirit, refined or not. Adam and Eve, ascending in obedience, could have been "*improved by tract of time*" (V.498) into beings of angelic substance.

This is a heterodox position. Traditional Christianity (Augustine, Aquinas) keeps a metaphysical distinction between spirit and matter. Milton is closer to the ancient Stoics and to contemporary figures like Anne Conway — matter as a gradient rather than a separate category. The poem's physics of Heaven (angels eat real food, Raphael blushes, the War in Heaven is fought with material weapons) follows from this monism.

The passage is one of Milton's most philosophically consequential and most beautiful. Read it slowly.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
  {
    id: "pl-5-angelic-food",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "So down they sat",
    anchorOccurrence: 1,
    title: "Angelic food — Raphael eats with Adam and Eve",
    quotedPassage:
      "So down they sat, / And to their viands fell; nor seemingly / The Angel, nor in mist (the common gloss / Of theologians), but with keen dispatch / Of real hunger…",
    passageReference: "Book V, lines 433–437 · PL V.433–37",
    commentary: `Raphael eats actual food. Milton makes a point of refuting the common theological gloss that angelic eating was only apparent (a show, a courtesy). The angel is physical enough to transubstantiate earthly fruit into angelic substance — *concoctive* in the 17th-century medical sense, digestion.

The detail is a direct consequence of Milton's monism (see previous annotation). If matter and spirit are continuous, then angelic beings can literally ingest material food. Traditional Thomist theology denied this, treating angelic apparitions as pure appearance. Milton rebuts the tradition in a casual parenthesis ("*nor in mist, the common gloss / Of theologians*") — a sentence of sharp doctrinal aggression tucked into a table scene.

The reader who did not know they were reading a heterodox theological poem has it spelled out here. Eden is materially real; angels participate in its materiality; the doctrine implies that embodiment is no drawback.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-5-begetting-son",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "This day I have begot",
    anchorOccurrence: 1,
    title: "The begetting of the Son — the precipitating cause of Satan's fall",
    quotedPassage:
      "\"Hear, all ye Angels, Progeny of Light, / Thrones, Dominations, Princedoms, Virtues, Powers; / Hear my decree, which unrevoked shall stand. / This day I have begot whom I declare / My only Son…\"",
    passageReference: "Book V, lines 600–604 · PL V.600–04",
    commentary: `The Father's public exaltation of the Son is, in Milton's telling, what triggers Satan's rebellion. Satan (still *Lucifer*, the Morning Star) resents the new order and withdraws with his following to plan revolt. Milton's origin story of evil is specifically Christological: the rebellion is prompted by the elevation of the Son.

The word *begot* has been the focus of theological commentary for three centuries. Orthodox Trinitarianism holds the Son to be eternally begotten; Milton's wording ("*this day*") is temporally specific, which leans heterodox. In *De Doctrina Christiana* Milton develops the claim that the Son was begotten *within time*, not eternally — a position that aligns with the Arian tradition.

The published poem leaves the ambiguity in the Father's words; commentators can argue about whether "*this day*" is a temporal statement or a liturgical *today* (as in Psalm 2:7, which Milton is adapting). Either reading is defensible from the text.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-5-satan-ambition",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "Thrones, Dominations, Princedoms",
    anchorOccurrence: 1,
    title: "Satan's rebel speech — \"who can in reason then, or right, assume\"",
    quotedPassage:
      "Thrones, Dominations, Princedoms, Virtues, Powers… / If these magnific titles yet remain / Not merely titular…",
    passageReference: "Book V, lines 772–774 · PL V.772–74",
    commentary: `Satan's address to his rebel faction. The rhetorical move: if the titles are real (implying genuine sovereignty), then the angels cannot accept a superior. The argument makes hierarchy the ground of equality, and then uses equality to justify rebellion against the top of the hierarchy — a logic that is internally inconsistent and which Milton expects the reader to detect.

Abdiel, the one loyal angel in Satan's camp, detects it first. His rebuttal (V.809–48) is the most important short speech in the poem outside Satan's own soliloquies, and it turns on exactly this contradiction: the order that has made Satan a Seraph is the order he now rejects, and rejecting it unmakes the very dignity he claims as the ground of rejection.

Milton's political theology is here at its sharpest. The speech-shape is that of every failed republican — claim equality, appeal to dignity, find the claim undermines its own premise.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-5-abdiel-loyalty",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "O argument blasphemous",
    anchorOccurrence: 1,
    title: "Abdiel — the single loyal angel in Satan's camp",
    quotedPassage:
      "\"O argument blasphemous, false, and proud! / Words which no ear ever to hear in Heaven / Expected, least of all from thee…\"",
    passageReference: "Book V, lines 809–811 · PL V.809–11",
    commentary: `Abdiel's name means *servant of God* in Hebrew. Milton invents him — the figure is not in scripture — as the one-just-man in a corrupt camp, the pattern Milton will later find in Noah, Enoch, and, in an autobiographical register, Milton's own political situation after the Restoration. Abdiel is Milton's self-portrait as the faithful remnant in a polity that has chosen wrongly.

His speech refutes Satan's argument point by point (V.822–48): God did not create the angels "*to serve against his glory*" but *by* and *for* him; the elevation of the Son is not a degradation of the angels but an honor they share. Abdiel then turns his back on the rebels and marches alone back to the Father's throne.

The lone-faithful-remnant image is one of the few places in the poem where Milton's autobiographical register is visible. Abdiel is how Milton wanted to imagine himself after 1660 — the one who would not bend, even when alone.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-5-satan-first-hinted",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "Satan-so call him now",
    anchorOccurrence: 1,
    title: "\"Satan — so call him now\" — the loss of the name Lucifer",
    quotedPassage:
      "Satan-so call him now, his former name / Is heard no more in Heaven.",
    passageReference: "Book V, lines 658–659 · PL V.658–59",
    commentary: `A short parenthetical with large theological consequence. The Adversary's original name — *Lucifer*, "light-bearer," the morning star — is heard no more in Heaven after his rebellion. Milton marks the loss-of-name as a cosmic event: a being no longer identified by its original relation to its creator but only by its function (*ha-satan*, Hebrew for "the adversary").

The lost name tracks the whole pattern of the fallen angels' renaming as idols in Book I. Lucifer becomes Satan; the other Seraphim become Moloch, Chemos, Baalim — each name a rebranding after exile from divine speech. The taxonomy of evil in the poem is a taxonomy of lost original names.`,
    crossReferences: [],
    tags: ["linguistic", "mythological"],
  },
  {
    id: "pl-5-hierarchy-chain",
    bookId: "paradise-lost",
    chapterNumber: 4,
    anchorText: "The scale of Nature",
    anchorOccurrence: 1,
    title: "The great chain of being — Milton's ladder",
    quotedPassage:
      "Flowers and their fruit, / Man's nourishment, by gradual scale sublimed, / To vital spirits aspire, to animal, / To intellectual…",
    passageReference: "Book V, lines 482–486 · PL V.482–86",
    commentary: `Raphael's discourse on the metaphysical ladder — sometimes called the *scala naturae* or great chain of being — runs from roots and flowers through animal life to intellect to angelic reason. Milton's version differs from the standard medieval/Renaissance chain in two ways: (1) it is *fluid* (organisms can ascend the scale through virtue), and (2) it terminates in God without the rigid stratifications of Thomist cosmology.

This is the theological basis for the claim that Adam and Eve, staying obedient, could have been progressively *refined* until their bodies reached angelic substance. The Fall forecloses this upward pressure and replaces ascent with death. Paradise Lost imagines a human destiny as *upward metamorphosis* that the Fall aborts — a piece of the original plan that disappears without a named mourner.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
]
