import type { Annotation } from "../types"

// ── Paradise Lost Book VI — the war in Heaven. Abdiel's return, the
// three days of combat, the Son drives the rebels into Hell. 10 annotations.

export const PARADISE_LOST_BOOK_6: Annotation[] = [
  {
    id: "pl-6-abdiel-return",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "the dreadless Angel",
    anchorOccurrence: 1,
    title: "Abdiel's return — \"all night the dreadless Angel\"",
    quotedPassage:
      "All night the dreadless Angel, unpursued, / Through Heaven's wide champaign held his way…",
    passageReference: "Book VI, lines 1–2 · PL VI.1–2",
    commentary: `The opening lines honor Abdiel's solitary return to the loyal camp. *Dreadless* — fearless, without dread — is the Miltonic superlative for the one who stood alone against the many. The image of a single figure crossing a night sky to rejoin the Father's court is one of the few moments of pure moral beauty in the poem, and Milton signals its weight by making it the first thing Book VI describes.

The theological framing: moral loyalty is measured under load. Abdiel's courage was proven among adversaries; now it is proven again in the solitary crossing. Milton is building the pattern of the *faithful remnant* — the one, the few, who keep their integrity when most do not — and Abdiel is the prototype for every later biblical and Christian-political instance.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
  {
    id: "pl-6-iliadic-battle",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "Heaven rung",
    anchorOccurrence: 1,
    title: "War in Heaven as Iliadic pastiche",
    quotedPassage:
      "Heaven rung / With jubilee, and loud hosannas filled / The eternal regions.",
    passageReference: "Book VI, lines 82–84 · PL VI.82–84",
    commentary: `Book VI is Milton's Iliadic book. The angels fight in formations (phalanxes, wings), individual heroes square off (Michael vs. Satan, Gabriel vs. Moloch), the combat includes epic aristeiai and chariots. Milton writes deliberately in the Homeric battle register so that the reader registers the parody: a Christian version of the Iliadic battle-books in which the combatants are all immortal and the fighting is therefore theologically strange.

The strangeness is the point. Milton wants the reader to *feel* that war in Heaven is an unnatural event — that the whole Iliadic inheritance, when projected onto angelic beings, becomes slightly absurd. The rebellion has made possible a category of violence that Heaven was not built for.

When Satan "invents" gunpowder on Day 2 of the battle (VI.469ff), the absurdity deepens: the fallen are forced to invent the materials of harm because Heaven does not naturally provide them.`,
    crossReferences: [
      {
        type: "parody",
        description:
          "Iliad books XI–XXII are the battle-books; Milton's VI is their Christian parody. The forms are inherited (aristeia, chariot-combat, single-duel, divine intervention); the context turns them into arguments for the inadequacy of martial heroism as a theology.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Books XI–XXII",
        targetBookId: "the-iliad",
        targetChapterNumber: 10,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-6-michael-wounds-satan",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "deep-entering",
    anchorOccurrence: 1,
    title: "Michael wounds Satan — the first wound in the universe",
    quotedPassage:
      "But the sword / Of Michael from the armoury of God / Was given him, tempered so that neither keen / Nor solid might resist that edge; it met / The sword of Satan…",
    passageReference: "Book VI, lines 320–324 · PL VI.320–24",
    commentary: `Michael strikes Satan, and Satan experiences pain for the first time (VI.327ff). Milton's physics of angelic combat is consistent with his monism — Satan's celestial *substance* can be parted, and the parting produces *nectarous humour*, an angelic blood — but the point is that *pain itself is novel*. Before this wound, no being has suffered damage in the universe.

The theological implication is precise: suffering is a consequence of the rebellion, not an original feature of creation. The first instance of pain is the first wound struck in defense of the good order. The moral economy of the poem treats this as a regrettable necessity rather than an edifying victory.

Satan's wound heals quickly (VI.344–45) — angelic substance knits itself back together — but the possibility of wounding has entered the world.`,
    crossReferences: [],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "pl-6-invention-gunpowder",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "cannons",
    anchorOccurrence: 1,
    title: "Satan invents gunpowder — technological hubris",
    quotedPassage:
      "…in a moment up they turned / Wide the celestial soil, and saw beneath / The originals of Nature in their crude / Conception; sulphurous and nitrous foam / They found, they mingled…",
    passageReference: "Book VI, lines 509–513 · PL VI.509–13",
    commentary: `At night, between the first and second day of combat, Satan's engineers dig up the "*originals of Nature in their crude conception*" — the elemental materials of Heaven itself — and compound sulfur and nitre to make gunpowder. On Day 2 the rebels deploy cannons against the loyal angels, briefly routing them.

Milton is making a historical argument: the invention of gunpowder was not a neutral technological development but a morally specific event. The passage projects the invention of artillery back into the war in Heaven, making it a Satanic innovation rather than a human one. Every cannon in every later war becomes, in the logic of Milton's typology, a continuation of Satan's second-day battle plan.

This was a live polemic in the seventeenth century. Erasmus, Rabelais, and Montaigne had all noted the moral strangeness of the cannon; Milton makes it literally diabolic.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-6-mountains-uprooted",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "uprooted, with all their load",
    anchorOccurrence: 1,
    title: "Angels hurling mountains — the escalation",
    quotedPassage:
      "From their foundations loosening to and fro, / They plucked the seated hills, with all their load, / Rocks, waters, woods, and by the shaggy tops / Uplifting bore them in their hands…",
    passageReference: "Book VI, lines 643–646 · PL VI.643–46",
    commentary: `Day 3 of the war opens with the loyal angels' response to Satan's artillery: they uproot entire mountains and hurl them at the rebels, who respond in kind. Milton's image is consciously excessive — battle has escalated beyond any proportion to its purpose — and the comedy of it, though strange, is intended. When Heaven's warriors find themselves tearing up the landscape, the war has exceeded what can be won with weapons.

This is why the Son's solo intervention (VI.749ff) is necessary: no angelic force can conclude the war, because the war as such has no conclusion possible in angelic terms. The Son's arrival is the only closing move Milton's cosmology allows.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },
  {
    id: "pl-6-son-drives-rebels",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "Chariot of paternal Deity",
    anchorOccurrence: 1,
    title: "The Son in the chariot — Ezekiel's vision activated",
    quotedPassage:
      "He, in celestial panoply all armed / Of radiant Urim, work divinely wrought, / Ascended…",
    passageReference: "Book VI, lines 760–762 · PL VI.760–62",
    commentary: `The Son ascends the "*chariot of paternal Deity*" — Milton's transformation of the chariot-vision of Ezekiel 1 — and drives the rebels single-handedly out of Heaven and over the edge into the abyss. The chariot is described with the visionary particularity of Ezekiel (four cherubic wheels, eyes, the whirlwind of fire); Milton is making the Son's single combat a direct activation of the prophet's vision.

The theological point: victory belongs to the Son alone. The whole war of the previous books and days could not bring an end; the Son's arrival ends it in a single action. Paradise Lost's Christology makes the Son the sole agent of decisive good, which is why his voluntary ransom in Book III is the central theological fact the rest of the poem is pointing toward.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Ezekiel 1 — the prophet's vision of the throne-chariot with four cherubim, wheels within wheels, and the likeness of God above. Milton makes the Son its driver in the war-in-Heaven set piece.",
        workTitle: "The Book of Ezekiel",
        workAuthor: "Ezekiel",
        passageReference: "Chapter 1",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-6-effulgence",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "Effulgence of my glory",
    anchorOccurrence: 1,
    title: "The Father commissions the Son — \"effulgence of my glory\"",
    quotedPassage:
      "\"Effulgence of my glory, Son beloved, / Son, in whose face invisible is beheld / Visibly what by Deity I am…\"",
    passageReference: "Book VI, lines 680–682 · PL VI.680–82",
    commentary: `The Father's commissioning of the Son for the final action of the war. *Effulgence of my glory* (from Hebrews 1:3 — *apaugasma tes doxes*) positions the Son as the visible radiance of the invisible Father. The careful Christology is back: the Son is the Father's *expression*, his *visibility*, without the Nicene assertion of co-substantial equality.

The scene is a public commissioning; the whole loyal angelic company witnesses the Father entrusting the decisive action to the Son. Milton is building the theological scaffolding for the Son's later self-offering as the redeemer of Man — the war-in-Heaven victory is rehearsal for the cross.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-6-sons-reply",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "O Father, O Supreme of Heavenly Thrones",
    anchorOccurrence: 1,
    title: "The Son's reply — \"shall soon be done\"",
    quotedPassage:
      "\"O Father, O Supreme of Heavenly Thrones, / First, Highest, Holiest, Best, thou always seek'st / To glorify thy Son…\"",
    passageReference: "Book VI, lines 723–725 · PL VI.723–25",
    commentary: `The Son's acceptance speech. The rhetorical structure: thanksgiving, acceptance, a promise of obedience. *Shall soon be done* (VI.736) is the note of the whole passage — the Son's agency is decisive, but its speed is what Milton wants the reader to register. Three days of angelic war, and the end arrives in a matter of lines once the Son mounts the chariot.

The relationship to Book III's self-offering is intentional. In Book III the Son offers himself for the redemption of Man and the Father accepts; in Book VI the Father commissions and the Son accepts. The parallelism is doctrinal: the economy of salvation in Milton's theology has the Son as the active agent, the Father as the commissioner, and the angelic hosts as witnesses.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Son's self-offering in III.227ff and his acceptance of the commission here are a paired set. Read the two passages together.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book III, lines 227ff",
        targetBookId: "paradise-lost",
        targetChapterNumber: 2,
        targetAnchorText: "Father, thy word is passed",
      },
    ],
    tags: ["philosophical"],
  },
  {
    id: "pl-6-gates-of-heaven",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "Heaven opened wide",
    anchorOccurrence: 1,
    title: "The gates of Heaven open — the rebels fall",
    quotedPassage:
      "Heaven opened wide / Her ever-during gates, harmonious sound, / On golden hinges moving…",
    passageReference: "Book VI, lines 860–862 · PL VI.860–62",
    commentary: `At the moment the Son drives the rebels toward the edge of Heaven, the gates open to expel them. The *harmonious sound* and *golden hinges* are Milton-at-his-most-Spenserian — a purely aesthetic register applied to a theological event. The beauty of the description is part of the argument: the expulsion is a *restoration* of order, not a violence against it, and so it comes with the sound of music.

The rebels fall "*nine days they fell*" (VI.871) — a Homeric nine-day measure, echoing the nine days Hephaestus fell (see the Mulciber annotation in Book I). The falling is in slow motion; the cosmos registers the extent of the descent.

Book VI closes with the rebels closed below in Hell and Raphael asking Adam whether the warning example is clear. Adam's hunger for more (VII.60ff) will be the prompt for the creation narrative.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The nine-day fall echoes Hephaestus's fall from Olympus (Iliad I.590ff) and, by syncretic extension, the Mulciber passage in Milton's Book I. The nine-day measure is Milton's signature for a cosmic expulsion.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 740–745",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "Mulciber",
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-6-warning-purpose",
    bookId: "paradise-lost",
    chapterNumber: 5,
    anchorText: "terrible example of the reward",
    anchorOccurrence: 1,
    title: "The warning to Adam — \"terrible example\"",
    quotedPassage:
      "Let it profit thee to have heard, / By terrible example, the reward / Of disobedience…",
    passageReference: "Book VI, lines 909–911 · PL VI.909–11",
    commentary: `Raphael closes the war-in-Heaven narrative by naming its pedagogical purpose: Adam is to use the fallen angels as a cautionary example. This is Milton's answer to the question *why is this story being told*. The angelic rebellion is instructional for the human pair; Raphael is the instructor, the pre-emptive warning the poem stages so that no one can later say Adam and Eve were not told.

The theological move is the poem's version of Deuteronomy 30:19 — *I set before you life and death; therefore choose life*. The warning does not compel; it informs. The Fall, when it comes in Book IX, comes without the excuse of ignorance. Milton has made sure of that by staging Books V–VIII as a full curriculum.

Raphael's role ends here; the next two books (VII, VIII) are his Creation narrative and his astronomy-and-Eve dialogue with Adam. But the war-in-Heaven arc proper concludes at this moment of explicit moral takeaway.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
]
