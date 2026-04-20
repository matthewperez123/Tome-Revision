import type { Annotation } from "../types"

// ── Paradise Lost Book III — the heavenly council ─────────────────────
// Milton's second great invocation (Hail, holy Light), the Father-Son
// dialogue, the Son's voluntary ransom, the Paradise of Fools, Satan's
// arrival at the Sun and his conversation with Uriel. 13 annotations.

export const PARADISE_LOST_BOOK_3: Annotation[] = [
  {
    id: "pl-3-hail-holy-light",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Hail, holy Light",
    anchorOccurrence: 1,
    title: "\"Hail, holy Light\" — the second invocation and Milton's blindness",
    quotedPassage:
      "Hail, holy Light, offspring of Heaven first-born, / Or of the Eternal coeternal beam, / May I express thee unblamed?",
    passageReference: "Book III, lines 1–3 · PL III.1–3",
    commentary: `The second invocation. Milton is moving from Hell into Heaven and invokes Light at the threshold. *Offspring of Heaven first-born* positions Light as the first creature of Genesis 1:3 — *Let there be light* — and the parenthetical ("*Or of the Eternal coeternal beam*") hedges between orthodox Trinitarian identification of Christ-as-Light and the more radical claim that Light is coeternal with God. Milton's theology in *De Doctrina Christiana* flirts with Arianism (the Son as created, not coeternal); the hedge in this line is not accidental.

Within forty lines the invocation turns personal. Milton names his blindness — "*thou / Revisit'st not these eyes, that roll in vain / To find thy piercing ray*" (III.22–24) — and lists other blind poets and prophets (Thamyris, Maeonides — i.e. Homer — Tiresias, Phineus) he hopes to match. The claim is that outward blindness can be compensated by inward illumination; the *holy Light* of Genesis becomes the intellectual light of the inspired poet. It is the most moving piece of autobiography in the poem, and it is embedded in a theological lyric.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-3-father-sees",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Only-begotten Son, seest thou",
    anchorOccurrence: 1,
    title: "The Father's foreknowledge — and Milton's defense of free will",
    quotedPassage:
      "\"Only-begotten Son, seest thou what rage / Transports our Adversary?\"",
    passageReference: "Book III, lines 80–81 · PL III.80–81",
    commentary: `The Father opens the Heavenly council by pointing out Satan's approach and accurately predicting the Fall. The theological emergency Milton addresses: if God knows Man will fall, is Man free to do otherwise? Milton's answer, delivered by the Father himself in III.98–128, is that foreknowledge is not causation. "*If I foreknew, / Foreknowledge had no influence on their fault*" (III.117–18). The knowledge is compatible with the will.

This is Milton's Arminian answer to the Calvinist problem of predestination. The position places him against the more rigidly predestinarian Puritan theologians of his day and aligns him with the Dutch theologian Jacobus Arminius (d. 1609), whose followers — the Arminians — were a controversial minority within English Protestantism. Milton is staking the poem's theology on a specifically non-Calvinist view of the Fall.

The reader owes the passage slow attention. The syntax is characteristically compressed, and the theological stakes are the highest in the poem.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-3-son-offers-ransom",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Father, thy word is passed",
    anchorOccurrence: 1,
    title: "The Son's voluntary ransom",
    quotedPassage:
      "\"Father, thy word is passed, Man shall find grace; / And shall grace not find means…\"",
    passageReference: "Book III, lines 227–228 · PL III.227–28",
    commentary: `The dialogue's pivot. The Father has announced that Man will fall and be redeemable only by someone "*just the unjust to save*" — a substitutionary atonement — and the Son volunteers: *Behold me then; me for him, life for life / I offer* (III.236–37). This is Milton's incarnational theology in verse: the Son, not yet incarnate in Paradise Lost's chronology, offers himself in advance.

The silence between the Father's question and the Son's answer — *all the Heavenly quire stood mute, / And silence was in Heaven* (III.217–18) — is one of the poem's most eloquent pauses. Milton is putting weight on the fact that no angel volunteers; the redemption has to come from the Son. The theological economy of the scene has the Son's offer as an act of free love, not of obligation.

The palette keeps the Son in pale warm gold throughout — his color is the poem's register of mercy, in contrast to the Father's austere colorless voice.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Milton is retelling Romans 5:6–10 (Christ dying for the ungodly), Philippians 2:5–11 (Christ humbling himself), and John 3:16 in the voice of Milton's Son. The New Testament theology is fully inside Milton's verse.",
        workTitle: "The Letter to the Romans",
        workAuthor: "St. Paul",
        passageReference: "Romans 5:6–10",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-3-limbo-of-vanity",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Paradise of Fools",
    anchorOccurrence: 1,
    title: "The Limbo of Vanity / Paradise of Fools",
    quotedPassage:
      "…a Limbo large and broad, since called / The Paradise of Fools, to few unknown / Long after, now unpeopled, and untrod…",
    passageReference: "Book III, lines 495–497 · PL III.495–97",
    commentary: `Satan lands briefly on this liminal upper-air region — the "Paradise of Fools" — before Uriel redirects him. It is Milton's Protestant satire made geographical: a region of air neither in Heaven nor in Hell, stocked with the builders of Babel, the pilgrims of false relics, the self-mortifying friars, and the "*cowls, hoods, and habits*" of religious orders. Milton's point: all of that devotion was literally *wind*, and the wind deposits it here.

Dante has a similar half-way zone in his *Limbo of the Virtuous Pagans* (Inferno IV), but Milton's is not Dante's — Dante's Limbo is for the unbaptized but righteous classical souls; Milton's is for the devotionally-misguided of the Christian era. The shared name ("Limbo") hides a very different polemic.

Read the passage for its ear — it is one of the most purely comic sections of the poem — but also for the sharp-edged Protestantism of the satire.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Dante's Limbo (Inferno IV) is the vestibule for virtuous pagans. Milton's Limbo of Vanity is the posthumous lodging of Catholic devotional excess. Same word, different polemic.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno IV",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-3-uriel-sun",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Fair Angel, thy desire",
    anchorOccurrence: 1,
    title: "Uriel — the regent of the Sun",
    quotedPassage:
      "\"Fair Angel, thy desire, which tends to know / The works of God, thereby to glorify / The great Work-master, leads to no excess…\"",
    passageReference: "Book III, lines 694–696 · PL III.694–96",
    commentary: `Satan, disguised as a "stripling Cherub," asks Uriel — the angel whose station is the Sun — for directions to the new World. Uriel gives them without suspicion; Milton explains, "*For neither Man nor Angel can discern / Hypocrisy*" (III.682–83). This is the theological footnote to the whole temptation plot: angelic beings have no in-built lie detector. Satan's disguise works because hypocrisy is a form of evil invisible even to the wisest of creatures.

Milton's source for Uriel-as-sun-regent is the Jewish apocryphal tradition (2 Esdras, the Book of Enoch) and the Hermetic / Neoplatonic synthesis of the Renaissance. The name means "Light/Fire of God." Uriel's first-flush discovery of the deception later in the poem (IV.561–75) is Milton's way of showing that angelic intelligence, even at its sharpest, requires *observation*: Uriel only realizes the truth after watching Satan's face contort on Mount Niphates.`,
    crossReferences: [],
    tags: ["mythological", "historical"],
  },
  {
    id: "pl-3-predestination",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Some I have chosen of peculiar grace",
    anchorOccurrence: 1,
    title: "\"Some I have chosen of peculiar grace\" — Milton on predestination",
    quotedPassage:
      "Some I have chosen of peculiar grace, / Elect above the rest; so is my will: / The rest shall hear me call…",
    passageReference: "Book III, lines 183–185 · PL III.183–85",
    commentary: `This is the poem's most precise theological sentence on election. The Father admits a special election ("*some I have chosen of peculiar grace*") but immediately adds that *the rest* will be called too, and that grace will be offered to all who respond. Milton's formula is a carefully balanced middle position between Calvinist double predestination (some elected to salvation, others reprobated to damnation) and full Arminian universalism.

The hedge is characteristic Milton: he wants a doctrine that preserves divine sovereignty *and* meaningful human freedom. *De Doctrina Christiana*, his prose theological treatise, develops the position in detail; the poem compresses it into three lines and leaves them to do their work.

Readers who arrive from a Calvinist background are often surprised by the generosity of III.185–216, where the Father lays out the terms of general grace. Readers from an Arminian or universalist background are often surprised by the continuing reality of condemnation for those who refuse. Milton was consciously writing for both audiences at once.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-3-divine-similitude",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Divine Similitude",
    anchorOccurrence: 1,
    title: "The Son as \"Divine Similitude\" — Milton's Arian shading",
    quotedPassage:
      "Thee next they sang, of all Creation first, / Begotten Son, Divine Similitude, / In whose conspicuous countenance, without cloud / Made visible, the Almighty Father shines…",
    passageReference: "Book III, lines 383–386 · PL III.383–86",
    commentary: `The angelic choir's hymn to the Son. The phrase *Divine Similitude* is subtle: *similitude* means likeness, resemblance. It is softer than *equality* and fits a semi-Arian reading in which the Son is the image of the Father but not identical in substance. Milton's *De Doctrina Christiana* (unpublished in his lifetime, discovered 1823) explicitly teaches a subordinationist Christology in which the Son is a created being, not coeternal.

The published Paradise Lost is more orthodox on the surface than *De Doctrina* is. But lines like this one preserve the theology by careful word-choice. The reader who wants to know how heterodox Milton actually was has to read both texts together; the poem alone reads as broadly orthodox, and the scholarly consensus has shifted over the last century on how much of the heterodoxy survives into the published verse.

The footnote here flags the ambiguity. The Tome annotation system will not resolve what Milton scholars themselves do not resolve.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-3-ptolemaic-cosmos",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "round the world at once",
    anchorOccurrence: 1,
    title: "Milton's cosmology — Ptolemaic structure, Copernican fragments",
    quotedPassage:
      "The great luminary, / Aloof the vulgar constellations thick, / That from his lordly eye keep distance due…",
    passageReference: "Book III, lines 576–578 · PL III.576–78",
    commentary: `Milton's cosmology is predominantly Ptolemaic: a geocentric Earth at the center of nested spheres, the Empyrean above, Chaos outside, Hell below. He knew about Copernicus (Book VIII has Raphael lecturing on both systems) and about Galileo (Book I's telescope simile), but the poem's architecture rests on the older, more theologically tractable model.

This passage is Milton's description of Satan alighting on the sun. The sun is imagined as a body whose light touches all the planets; the hierarchy of luminaries is intact. When Raphael later (VIII.15–178) refuses to settle which system is physically correct — "*the great Architect / Did wisely to conceal…*" — Milton is splitting the poetic difference: Ptolemaic imagery for the poem's purposes, Copernican caution at the level of truth-claims.

The result is that Paradise Lost is the last great English poem composed in a cosmos that was already falling apart around the poet. By 1687 (Newton's Principia) the old architecture was gone. Milton's poem is the largest artifact built with it.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The astronomy debate between Adam and Raphael at VIII.15–178 is Milton's explicit handling of the Ptolemaic vs. Copernican question. Read the two passages together.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book VIII, lines 15–178",
        targetBookId: "paradise-lost",
        targetChapterNumber: 7,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-3-harrowing-foreshadow",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "thou shalt die",
    anchorOccurrence: 1,
    title: "The harrowing of Hell foreshadowed",
    quotedPassage:
      "… His grace in all the wealth of love to pay / Rigid satisfaction, death for death.",
    passageReference: "Book III, lines 211–212 · PL III.211–12",
    commentary: `The Father describes the atonement in terms of *rigid satisfaction*: the death of the Son literally substituting for the death of humanity. The specific phrase "*death for death*" draws on the harrowing-of-Hell tradition — the medieval doctrine that Christ, between Good Friday and Easter Sunday, descended into Hell and freed the souls of the righteous patriarchs. Dante dramatizes this in Inferno IV; the Apostles' Creed confesses it.

Milton is writing the Heavenly side of the same event. In the Heavenly council of Paradise Lost III, the transaction is set up: the Son accepts the ransom in advance, and the harrowing of Hell becomes the future act that settles the account. The reader of Dante who knows Virgil leading Dante through a freshly-harrowed Hell can hear how far back Milton has reached to make that harrowing's prerequisite visible.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Dante's Inferno IV references the harrowing — Christ's descent and rescue of the Old Testament righteous. Milton's Paradise Lost III.211–12 is the Heavenly prior-act that the harrowing executes.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno IV",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-3-satan-disguise",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "stripling Cherub",
    anchorOccurrence: 1,
    title: "Satan's first disguise — stripling cherub",
    quotedPassage:
      "A stripling Cherub he appears, / Not of the prime, yet such as in his face / Youth smiled celestial, and to every limb / Suitable grace diffused…",
    passageReference: "Book III, lines 636–639 · PL III.636–39",
    commentary: `Satan assumes the form of an adolescent cherub (*stripling* — a young man) to gain information from Uriel. The disguise logic is exact: a senior angel (Uriel) would expect a senior colleague to know the directions already; a young underling asking for orientation is plausible.

Milton's description is affectionate in a way that is disturbing: the *celestial youth*, *suitable grace*, the soft line-ends, all evoke what a good Renaissance painter would paint of a cherub. The passage is showing the reader exactly how Satan looks — beautiful — when he means to deceive. This is the same pedagogy the poem insists on: the diabolic does not come in horns and tails; it comes looking like a pious young person in search of wisdom.

The subsequent turn (IV.114ff, on Mount Niphates) where Satan's face shows *Ire, envy, and despair* and Uriel, watching from the sun, recognizes what he has done — is the matching piece. Angels can be fooled momentarily; eventually the face tells the truth.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Satan's disguise here is undone when Uriel, from the Sun, watches his face on Mount Niphates in Book IV.114ff. Read the two passages together.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IV, lines 114–130",
        targetBookId: "paradise-lost",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "pl-3-song-of-heaven",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Hail, Son of God, Saviour of Men",
    anchorOccurrence: 1,
    title: "The angels' song — Heaven sung from Heaven",
    quotedPassage:
      "\"Hail, Son of God, Saviour of Men! Thy name / Shall be the copious matter of my song / Henceforth…\"",
    passageReference: "Book III, lines 412–414 · PL III.412–14",
    commentary: `The hymn of the angels to the Son, following his offer of ransom. The structural parallel to the infernal council is exact: in Book II, the fallen angels praise Satan for volunteering; in Book III, the loyal angels praise the Son for offering himself. Milton's craft is to make the two praises structurally similar and tonally opposite. Satan's volunteering was rhetoric; the Son's is love.

The song also marks the first extended angelic *quotation* in the poem. The narrator reports it directly. Compare to the Homeric and Virgilian epic tradition where divine speech is reported by human poets; Milton is one step deeper into the theological imagination, reporting what angels sing.

The palette: the loyal angels' choir is tagged collectively in a warm white-gold. No single speaker; the song is the choir.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "pl-3-mercy-seat",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "Mercy-seat",
    anchorOccurrence: 1,
    title: "The Mercy Seat — the iconography of the ark",
    quotedPassage:
      "Beyond compare the Son of God was seen / Most glorious; in Him all His Father shone / Substantially expressed…",
    passageReference: "Book III, lines 138–140 · PL III.138–40",
    commentary: `Milton's image for the place of the Son's self-offering echoes the Hebrew Mercy Seat (*kapporet*) — the gold lid of the Ark of the Covenant where the High Priest sprinkled atonement blood. The New Testament book of Hebrews (9:5, 4:16) reinterprets Christ as the Mercy Seat himself; Milton is carrying that Pauline reading into verse.

*Substantially expressed* is a theological phrase from Colossians 1:15 / Hebrews 1:3 — the Son as the visible substance of the invisible Father. Milton's careful word is again subtle: *substantially expressed* preserves both the orthodox (Nicene) view (same substance) and the heterodox (Arian) view (substantially *like*, not coeternal), and the poem declines to resolve which.

The density of theological reference in Book III is the highest of any book in the poem. Milton wrote this book for readers who knew their Bibles book-by-book.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-3-arian-trinity-tension",
    bookId: "paradise-lost",
    chapterNumber: 2,
    anchorText: "All hast thou spoken as my thoughts",
    anchorOccurrence: 1,
    title: "Milton's Trinity — cooperative, not co-substantial",
    quotedPassage:
      "All hast thou spoken as my thoughts are, all / As my eternal purpose hath decreed.",
    passageReference: "Book III, lines 171–172 · PL III.171–72",
    commentary: `When the Son replies to the Father's statement about grace, the Father responds: *all hast thou spoken as my thoughts are*. In orthodox Trinitarianism the Father and Son share one will and essence; Milton's formulation has the Son *expressing* the Father's thoughts, which is a weaker claim — the two wills *agree*, but the grammar implies distinctness.

This is consistent with Milton's *De Doctrina Christiana*, where the Son is described as a derivative being whose will is voluntarily aligned with the Father's, rather than identical to it. In the published poem the theology is wrapped in the warmer register of fatherly approval — the Son has said exactly what the Father wished — but the underlying Christology is still shading toward Arianism.

The scholarly debate on Milton's Trinitarianism is one of the active areas of contemporary Milton studies (Lewis, Kelley, Bauman, Hunter, Rumrich). The Tome annotation flags the stakes rather than resolving them.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
]
