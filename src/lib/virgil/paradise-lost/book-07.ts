import type { Annotation } from "../types"

// ── Paradise Lost Book VII — the third invocation, Raphael's account of
// the six days of Creation. 10 annotations.

export const PARADISE_LOST_BOOK_7: Annotation[] = [
  {
    id: "pl-7-urania-invocation",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "Descend from Heaven, Urania",
    anchorOccurrence: 1,
    title: "\"Descend from Heaven, Urania\" — the third invocation",
    quotedPassage:
      "Descend from Heaven, Urania, by that name / If rightly thou art called…",
    passageReference: "Book VII, lines 1–2 · PL VII.1–2",
    commentary: `The third invocation. *Urania* — *heavenly one* — is the classical Muse of astronomy; Milton explicitly detaches her from the classical pantheon ("*by that name if rightly thou art called*") and treats her as the Christian Muse of sacred song. The detachment is a theological move: Milton wants the Muse, but not the mythology.

The invocation notes Milton's physical position: "*Standing on Earth, not rapt above the pole*" (VII.23). He is not claiming prophetic ecstasy or visionary ascent; he is on the ground, blind, writing. The contrast to the Miltonic rhapsodic tradition (the Pindaric ode, the sublime lyric) is purposeful — Milton insists his visionary authority is *textual*, not experiential.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "pl-7-fallen-on-evil-days",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "fallen on evil days",
    anchorOccurrence: 1,
    title: "\"Fallen on evil days\" — Milton's political autobiography",
    quotedPassage:
      "More safe I sing with mortal voice, unchanged / To hoarse or mute, though fallen on evil days, / On evil days though fallen, and evil tongues…",
    passageReference: "Book VII, lines 24–26 · PL VII.24–26",
    commentary: `One of the two or three most autobiographical lines in the poem. Milton is writing after 1660 — the Restoration of Charles II, the collapse of the English republic, the execution of his political allies, his own brief imprisonment. *Fallen on evil days* is the plain self-description of a republican intellectual who has watched the cause fail.

The repeated inversion — *fallen on evil days, on evil days though fallen* — is a formal mourning. The phrasing is consciously classical (cf. Homer's *epeseth' allo kakon*) but the political specificity is modern. Milton is marking his own defeat inside the poem, in the voice that is about to narrate the world's Creation.

The positioning of the autobiographical lines is significant: they sit at the beginning of Book VII, the book of *making*. Milton is admitting the unmaking of his political world before reciting the making of the physical one. The poem's largest act of hope is placed right after its sharpest moment of grief.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-7-let-there-be-light",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "Let there be Light",
    anchorOccurrence: 1,
    title: "\"Let there be Light\" — Genesis inside the epic",
    quotedPassage:
      "Let there be Light, said God; and forthwith Light / Ethereal, first of things, quintessence pure, / Sprung from the Deep…",
    passageReference: "Book VII, lines 243–245 · PL VII.243–45",
    commentary: `Milton versifies Genesis 1:3. The Biblical *fiat* is preserved verbatim — *Let there be Light* — and then glossed with a Neoplatonic-Aristotelian metaphysical commentary (*quintessence pure*, i.e. the fifth element, the aether, distinct from the four sublunary elements). Milton is doing both — honoring the scriptural line and adding the metaphysical freight it carries for a seventeenth-century reader.

The craft move: the Genesis formula is not ornamented or expanded; it sits in Milton's blank verse as a direct quotation. The ornament is the commentary that wraps it. This is Milton's method throughout the Creation narrative — the biblical text is embedded as the load-bearing beam, and the verse builds interior spaces around it without altering the structure.`,
    crossReferences: [],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "pl-7-six-days",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "the rest thy race",
    anchorOccurrence: 1,
    title: "The six days of Creation — Milton's versified Hexaemeron",
    quotedPassage:
      "So even and morn accomplished the first Day.",
    passageReference: "Book VII, line 252 · PL VII.252",
    commentary: `Book VII is Milton's *Hexaemeron* — the traditional Christian genre of the Six-Days meditation (Basil of Caesarea, Ambrose, Augustine, Du Bartas). The whole of VII.243–547 versifies Genesis 1:3–31 day by day.

Each day follows a pattern: the divine command (usually quoted directly from Genesis), the immediate fulfillment, a descriptive amplification of the newly-created thing. Milton's originality is in the amplification — the fish of Day 5 swim in "*their finny drove*" (VII.400); the elephants of Day 6 "*wreath'd / Their lithe proboscis*" (VII.321). The Hexaemeron tradition gave him permission to expand freely, and he fills every day with precisely-observed natural detail.

Pedagogically, this is the most accessible section of the poem for a modern reader with no specific theological background. The text is *beautiful and clear*; the argument is the beauty.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Genesis 1 is Milton's line-by-line source. He versifies the seven days of Creation with almost no structural departure from the Hebrew text, adding only descriptive amplifications to each act of making.",
        workTitle: "Genesis",
        workAuthor: "Moses (traditional)",
        passageReference: "Chapter 1, verses 1–31",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "pl-7-mans-making",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "Let us make now Man",
    anchorOccurrence: 1,
    title: "Man's creation — \"upright with front serene governed\"",
    quotedPassage:
      "\"Let us make now Man in our image, Man / In our similitude, and let them rule / Over the fish and fowl of sea and air…\"",
    passageReference: "Book VII, lines 519–521 · PL VII.519–21",
    commentary: `The formal creation of Man, Day 6. Milton quotes Genesis 1:26 exactly — *Let us make now Man in our image* — and then versifies the physical making (VII.524–34): Man is "*of dust the inferior / But* raised "*upright with front serene*," the phrase *front serene* meaning a calm, lifted forehead. The detail is Lucretian (De Rerum Natura V.1014) but redirected — Lucretius's first humans were savages; Milton's first human stands upright *as the sign* of rational kinship with the Divine.

Milton's line "*Upright he looked to Heaven*" (paraphrasing VII.507) is the inherited Platonic/Lucretian/Ovidian trope (*os homini sublime dedit*, Ovid Metamorphoses I.85 — "[God] gave to humans an uplifted face"). Upright posture *as* theology. The posture itself is the image-of-God.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Ovid, Metamorphoses I.85 — 'os homini sublime dedit' ('to humankind he gave a lifted face'). The Ovidian trope of upright posture as the distinguishing mark of the human is behind Milton's line.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book I, lines 84–86",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "pl-7-heavens-answered",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "Open, ye everlasting gates",
    anchorOccurrence: 1,
    title: "The Son's return in triumph — \"Open, ye everlasting gates\"",
    quotedPassage:
      "\"Open, ye everlasting gates!\" they sung; / \"Open, ye Heavens, your living doors!\"…",
    passageReference: "Book VII, lines 565–566 · PL VII.565–66",
    commentary: `After the Son completes the act of Creation, the angels sing Psalm 24 as he re-enters Heaven. *Open, ye everlasting gates* is Psalm 24:7 (*Lift up your heads, O ye gates*), recontextualized as the moment the Son passes through the gates of Heaven after finishing the world. In Christian liturgy the same psalm is sung at the Ascension; Milton is typologically linking the Son's return after Creation to the Ascension after Resurrection.

The pattern: every major divine act in Paradise Lost is accompanied by a psalmic quotation. The scriptural ornament is part of the theological structure; Milton is showing that the events of the poem are foretold in the Psalter.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "pl-7-chariot-of-wings",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "Chariot of paternal Deity",
    anchorOccurrence: 1,
    title: "The Chariot of the Deity — re-echoing Book VI",
    quotedPassage:
      "Chariot of paternal Deity, / Flashing thick flames, wheel within wheel undrawn…",
    passageReference: "Book VII, lines 195–196 · PL VII.195–96",
    commentary: `The chariot that drove the rebels out of Heaven in Book VI is the same chariot that now goes forth to create the world. Milton deliberately repeats the Ezekiel-vision iconography (wheels within wheels, fire, the driver veiled in glory) to make the expulsion and the creation a matched pair of divine acts. The Son as expeller and the Son as creator are the same.

The theological economy is tidy: the rebellion emptied a portion of Heaven; the Creation replaces what was lost. Book VII's Creation is Milton's answer to Book VI's Fall — not only as narrative sequence but as theological purpose. The war in Heaven *makes the Creation necessary*, and the Creation is the restoration of the balance the war disturbed.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The chariot in Book VI.760ff drives the rebels out; the same chariot in VII.195ff goes forth to create. Read the two passages together to see the chariot as Milton's emblem of the Son's double agency — destroyer of evil, maker of good.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book VI, lines 749–866",
        targetBookId: "paradise-lost",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-7-beasts-of-earth",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "out of the ground up rose",
    anchorOccurrence: 1,
    title: "The beasts rising from the earth — a Genesis miniature",
    quotedPassage:
      "Out of the ground up rose, / As from his lair, the wild beast, where he wons / In forest wild, in thicket, brake, or den…",
    passageReference: "Book VII, lines 456–458 · PL VII.456–58",
    commentary: `Day 6 opens with the land animals emerging directly from the earth — as if the ground itself were parturient. Milton's image is visually striking: the lion "*now half appeared*," then "*pawing… springs loose*" (VII.463–65). The beasts literally emerge from the soil that holds them.

The scene is Milton's own gloss on the Genesis phrase *the earth brought forth* (Genesis 1:24). Most translators give the phrase metaphorically; Milton dramatizes it. The earth is *showing* the beasts out, and they arrive already mature, already moving, already themselves. The pastoral comedy of the passage is one of Milton's great animal set-pieces.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },
  {
    id: "pl-7-sabbath",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "The great Creator from his work returned",
    anchorOccurrence: 1,
    title: "The seventh day — Sabbath as architecture",
    quotedPassage:
      "The great Creator from his work returned / Magnificent, his six days' work, a World…",
    passageReference: "Book VII, lines 567–568 · PL VII.567–68",
    commentary: `The seventh day. Milton treats the Sabbath not as mere rest but as *completion* — a structural event that crowns the six days of making. The Creator returns, surveys the made world, pronounces it good, and rests.

Milton's Sabbath theology is Puritan-austere: the Sabbath is not a luxurious cessation but a dedicated space for the creature to register the completeness of what has been made. The liturgical music of Heaven (VII.592–632) celebrates the finished world with a hymn that runs sixty lines — Milton's longest continuous hymn, placed at the moment of Creation's conclusion.

Book VII closes on this liturgical high. The reader has been carried from pre-creation Chaos (Book II) through the rebellion (VI) to the finished World — a full cosmogony in four books.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-7-creation-from-god",
    bookId: "paradise-lost",
    chapterNumber: 6,
    anchorText: "One first matter",
    anchorOccurrence: 1,
    title: "Creation from God — Milton's monism at work",
    quotedPassage:
      "Boundless the Deep, because I AM who fill / Infinitude, nor vacuous the space. / Though I, uncircumscribed, myself retire…",
    passageReference: "Book VII, lines 168–170 · PL VII.168–70",
    commentary: `The Father's explanation of how Creation happens. Rather than the orthodox *creatio ex nihilo* (creation from nothing), Milton's God creates by *retiring* — withdrawing his infinite presence from a portion of space, and thereby making room for a distinct creation. The matter is derived from God's own substance.

This is Milton's monism rendered as cosmology. The position is heterodox — most Christian theology insisted on creation from nothing to preserve God's absolute priority — but Milton holds that matter, being derived from God, is good in itself, and that Creation is not an insertion of alien stuff into space but a measured emanation from divine substance.

The philosophical stakes: if matter is derived from God, then embodiment is not a fall from spirit but a gradient within the same substance. Milton's doctrine of *the resurrection of the body* (not the release of the soul) and his monist anthropology both follow from this passage.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
]
