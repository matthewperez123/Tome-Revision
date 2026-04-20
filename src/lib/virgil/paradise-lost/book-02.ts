import type { Annotation } from "../types"

// ── Paradise Lost Book II — the council in Hell ─────────────────────────
// Satan on the throne of Pandemonium opens the great consult; Moloch,
// Belial, Mammon, and Beelzebub speak in turn; Satan volunteers for the
// voyage through Chaos. Sin and Death open the gates of Hell; Chaos and
// Night give Satan directions; the book closes with Satan's first sight
// of the new-created World at the far edge of the abyss. 16 annotations.

export const PARADISE_LOST_BOOK_2: Annotation[] = [
  {
    id: "pl-2-opening-throne",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "High on a throne of royal state",
    anchorOccurrence: 1,
    title: "\"High on a throne of royal state\" — the opening amplification",
    quotedPassage:
      "High on a throne of royal state, which far / Outshone the wealth of Ormus and of Ind, / Or where the gorgeous East with richest hand / Showers on her kings barbaric pearl and gold, / Satan exalted sat…",
    passageReference: "Book II, lines 1–5 · PL II.1–5",
    commentary: `Milton opens Book II with a ten-line comparison structure: Satan's throne outshines (a) Ormus (Hormuz, Persian Gulf), (b) Ind (India), and (c) "the gorgeous East" generally. The grammar is suspension again — *High on a throne of royal state, which far / Outshone…* — and the main clause ("Satan exalted sat") does not arrive until the fifth line.

The political edge: *barbaric pearl and gold* codes this grandeur as Eastern, specifically as the wealth of conquered peoples flowing back to Roman-imperial-styled kings. Milton is positioning Pandemonium as a continuation of a very specific lineage of empire — oriental despotism as English Protestant readers were taught to see it. Satan's throne is designed to look magnificent *and* foreign, and the foreignness is an argument.

The iambic pattern is also doing work. Notice how many lines in this passage end without a period; the verse paragraph runs, piled with subordinate clauses, accumulating splendor. Milton's craft demonstration is the accumulation itself — the throne is not described, it is *amplified*.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "pl-2-moloch-open-war",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "My sentence is for open war",
    anchorOccurrence: 1,
    title: "Moloch's speech — \"My sentence is for open war\"",
    quotedPassage:
      "\"My sentence is for open war: of wiles, / More unexpert, I boast not; them let those / Contrive who need, or when they need, not now.\"",
    passageReference: "Book II, lines 51–53 · PL II.51–53",
    commentary: `Moloch's rhetorical strategy is blunt refusal of rhetoric. "*My sentence is for open war*" is eight monosyllables — the metrical plainness is part of the ethos. He dismisses *wiles* (cunning, strategy, speech) as the business of lesser spirits, positioning himself as the purer, more warrior-like voice.

This is the first of four set-piece speeches in the council. Milton is deliberately showing a spectrum. Moloch is the destructive pole, arguing for all-out war against Heaven, with annihilation as a preferable end-state to the present servitude. The reasoning collapses quickly ("*To be no more; sad cure!*" — II.146), but the speech is there to establish the floor of the debate.

In the speaker palette, Moloch takes a deeper crimson than Satan — closer to iron-rust. The distinction is deliberate: Satan's crimson is the seductive force of the whole rhetorical system; Moloch's crimson is its least rhetorical, most destructive extreme.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Moloch echoes the Achillean warrior-ethic of the Iliad — prefer honorable destruction to dishonorable persistence — but in a diabolic context where the argument's foundations have failed. Read against Achilles's 'Better to die and be finished with it' (Iliad IX.410ff).",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book IX, lines 410ff",
        targetBookId: "the-iliad",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "pl-2-belial-eloquence",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "I should be much for open war",
    anchorOccurrence: 1,
    title: "Belial — \"eloquent / But all was false and hollow\"",
    quotedPassage:
      "\"I should be much for open war, O Peers, / As not behind in hate…\"",
    passageReference: "Book II, lines 119–120 · PL II.119–20",
    commentary: `Milton gives Belial one of the most slickly crafted speeches in the poem, and introduces him with the infamous couplet that is itself a piece of rhetorical diagnosis: *A fairer person lost not Heaven; he seemed / For dignity composed and high exploit… / But all was false and hollow, though his tongue / Dropt manna, and could make the worse appear / The better reason, to perplex and dash / Maturest counsels* (II.110–15).

*Make the worse appear the better reason* is a direct translation of the charge Plato puts in the mouth of Socrates against the Sophists (Apology 18b-c). Milton is identifying Belial's species: the Sophist, the speaker whose gift is to dress bad arguments in persuasive language. His actual position is: *don't attempt anything; endure; hope for amelioration*. It is pacifism by resignation, and the eloquence is there to hide the spinelessness.

The palette codes this: Belial is a dusky rose — attractive, soft, without the weight of red. He looks like Satan and sounds like Satan and is, in fact, a specific reduced version of Satan, with the rhetoric minus the will.`,
    crossReferences: [],
    tags: ["philosophical", "linguistic"],
  },
  {
    id: "pl-2-mammon-materialism",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "Either to disinthrone the King",
    anchorOccurrence: 1,
    title: "Mammon — \"hard liberty before the easy yoke\"",
    quotedPassage:
      "\"Either to disinthrone the King of Heaven / We war, if war be best, or to regain / Our own right lost…\"",
    passageReference: "Book II, lines 229–231 · PL II.229–31",
    commentary: `Mammon's strategy: abandon the war altogether. Why crawl back to Heaven and stand servile in an imposed glory, when here in Hell one can *build up*, "raise / Magnificence" from the native materials and "live to ourselves"? The proposal is the ideology of industrial bourgeois colonialism projected back into Hell — make-the-place-pay, turn the desert into an enterprise. Mammon's name (Aramaic for wealth / possessions; used by Jesus in Matthew 6:24) is already a theological term for money as a rival god, and Milton is making the rhetoric do the work.

The line to watch: "*Hard liberty before the easy yoke / Of servile pomp*" (II.256–57). The phrasing anticipates whole traditions of Protestant political economy — the dignity of labor, the rejection of imposed hierarchy — and Milton knows it. The proposal is the most sympathetic-sounding of the four, which is exactly why it needs annotating. Milton the republican can give a plausible speech to Mammon and expect his readers to notice the *devil's tongue* delivering it.

Forge-orange in the palette. Mammon shares the metallurgical color with Mulciber; both are gods of things-being-worked, and both are idolators of the thing they make.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-2-beelzebub-plan",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "Thrones and imperial Powers",
    anchorOccurrence: 1,
    title: "Beelzebub's proposal — and Satan's plan delivered in another's mouth",
    quotedPassage:
      "\"Thrones and imperial Powers, Offspring of Heaven, / Ethereal Virtues! or these titles now / Must we renounce…?\"",
    passageReference: "Book II, lines 310–312 · PL II.310–12",
    commentary: `The fourth speech, and the one that wins. Beelzebub proposes not to attack Heaven directly but to strike at Heaven's new favorite — the new-created World, and the race (Man) that will inhabit it. Milton is explicit that this is Satan's plan: "*first devised / By Satan, and in part proposed*" (II.379–80). Beelzebub is the delivery mechanism.

The architecture of the council is the giveaway: the three opposing speeches (Moloch, Belial, Mammon) are allowed to split the vote; the fourth arrives as a synthesis, which it is not; and Satan then "volunteers" for the voyage, as if the assignment were dangerous rather than glorious. Milton is showing a rigged deliberation, and showing it carefully, so that a reader in 1667 who had just lived through the collapse of the English republic could recognize the political machinery.

*The great consult* is the Book II set-piece. It is the first parliamentary debate in English epic poetry, and Milton's republican politics show up in it as a critique of the form, not an endorsement.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The council of the Trojans in Aeneid II and of the Greeks in Iliad IX are Milton's templates — deliberations that produce consequential action. But Milton's council is already compromised by its outcome being preloaded in the speakers' mouths.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II (the council in Troy)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "pl-2-satan-volunteers",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "O Progeny of Heaven",
    anchorOccurrence: 1,
    title: "Satan volunteers — \"long is the way and hard\"",
    quotedPassage:
      "\"O Progeny of Heaven, empyreal Thrones! / With reason hath deep silence and demur / Seized us…\"",
    passageReference: "Book II, lines 430–432 · PL II.430–32",
    commentary: `Satan's volunteering speech. The rhetorical structure: acknowledge the danger (dignifying the silence of the others), appropriate the heroism (it must fall to him), and then close with the most famous piece of Hell-description in the book — "*long is the way and hard, that out of Hell leads up to Light*" (II.432–33). The line was quoted again, in its original form, by twentieth-century prisoners and dissidents as a figure of hard-won freedom; its original context is Satan persuading a room of demons that the journey to *corrupt* the world is worth the voyage cost.

The epic parallel is Odyssean. Satan is about to do the hero's *nostos* in reverse: sail a vast dangerous sea, encounter monsters (Sin, Death, Chaos), make landfall on a new world. The whole latter half of Book II, and the first half of Book III, is Satan playing Odysseus. Milton wants the reader to *feel* the pull of the old form even while the moral content has been inverted.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Satan's voyage through Chaos at the end of Book II is Milton's answer to Odysseus's wanderings in Odyssey IX–XII. Same structure — hero alone, monstrous encounters, perilous passage — but the hero is returning to the scene of the crime, not home.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books IX–XII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "pl-2-sin-description",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "The other Shape",
    anchorOccurrence: 1,
    title: "Sin and Death at the gates of Hell",
    quotedPassage:
      "Before the gates there sat / On either side a formidable Shape. / The one seemed woman to the waist, and fair, / But ended foul in many a scaly fold / Voluminous and vast…",
    passageReference: "Book II, lines 648–652 · PL II.648–52",
    commentary: `Milton's single sustained allegorical episode. Sin and Death are personifications in the Spenserian mode — figures whose physical description is itself an argument. Sin is fair above, monstrous below (a parody of the mermaid iconography and a visual pun on the Whore of Babylon); Death is "*the other Shape, / If shape it might be called that shape had none*" (II.666–67), insubstantial, black, wearing a crown.

Most of the poem rejects allegory — Satan and Adam are dramatic figures whose motivations you can argue about. Milton's choice to make Sin and Death *allegorical* rather than dramatic is a theological statement: these two are not agents but effects, the structural consequences of evil rather than its characters. They cannot be reasoned with; they can only be described.

The palette codes this: Sin and Death are ash-gray and bone-white in the Tome reader. Their speeches will be tagged in these neutral tones because they are figures of abstraction, not persons whose characters the reader develops feelings about.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Spenser's The Faerie Queene is Milton's allegorical model — figures like Despair, Duessa, and Error use the same half-woman, half-monster iconography. Milton lifts the method and the iconography and places it inside an otherwise non-allegorical poem.",
        workTitle: "The Faerie Queene",
        workAuthor: "Edmund Spenser",
        passageReference: "Book I (Una, Duessa, Error)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "pl-2-birth-of-sin",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "All on a sudden miserable pain",
    anchorOccurrence: 1,
    title: "The birth of Sin — parody of Athena",
    quotedPassage:
      "All on a sudden miserable pain / Surprised thee; dim thine eyes, and dizzy swum / In darkness, while thy head flames thick and fast / Threw forth, till on the left side opening wide, / Likest to thee in shape and countenance bright, / Then shining heavenly fair, a goddess armed, / Out of thy head I sprung…",
    passageReference: "Book II, lines 752–758 · PL II.752–58",
    commentary: `Sin is born from Satan's head. This is a direct parody of Athena's birth from the head of Zeus — Hesiod, Theogony 924ff; Pindar, Olympian 7 — reworked as an event of diabolic origin. In the classical myth Athena is wisdom, born fully-armed from the king of the gods. In Milton's inversion, Sin is born from the king of the fallen angels, in an act of rebellion-conceiving. Milton makes the parody explicit with *a goddess armed*: Sin emerges as Athena emerged.

What Milton is saying: the pagan stories were partial memories of cosmic events, distorted in their reaching us. The birth-from-the-head motif, which Greek mythology preserved as a story about wisdom, is actually the backstory of Sin. It is the same syncretic method as the fallen-angels catalogue in Book I, applied here to a specific myth.

The generational horror follows: Satan is then seized with desire for Sin, and from that union comes Death; Death then rapes Sin, and from that second incest the hell-hounds that gnaw her entrails are born. Milton is writing the family tree of evil as a literal family, and the incest and the cycle of devouring are the point.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Hesiod, Theogony 924ff — Athena's birth from Zeus's head. Milton's inversion is exact: the armed goddess emerges the same way, from the forehead of the sovereign god, but in Milton it is Sin from Satan.",
        workTitle: "Theogony",
        workAuthor: "Hesiod",
        passageReference: "lines 924ff",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "pl-2-satan-faces-death",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "Whence and what art thou",
    anchorOccurrence: 1,
    title: "Satan confronts Death — \"Whence and what art thou, execrable shape\"",
    quotedPassage:
      "\"Whence and what art thou, execrable Shape, / That darest, though grim and terrible, advance / Thy miscreated front athwart my way / To yonder gates?\"",
    passageReference: "Book II, lines 681–684 · PL II.681–84",
    commentary: `Satan does not recognize his own son. The encounter at the gates of Hell is stagecraft: the leader of the rebellion confronts a monstrous being he has actually produced, in an incestuous act he has forgotten. Milton's theological point is brutal — Satan is so fallen he cannot see his own consequences until they are about to kill him.

Death's counter-threat ("*Back to thy punishment, false fugitive*") is the book's most chilling moment, because Death speaks not as a person but as a principle: the wages of sin. Sin intervenes to prevent father and son from destroying each other by telling Satan who he is. The recognition scene is a parody of the recognition scenes in classical epic (Telemachus and Odysseus, Achilles and Priam) — there the recognitions heal; here the recognition installs a formal alliance of evil.

The bridge that Sin and Death will later build from Hell to Earth (Book X) begins its possibility here.`,
    crossReferences: [
      {
        type: "parody",
        description:
          "The recognition scenes of Homer (Telemachus and Odysseus in Odyssey XVI; Achilles and Priam in Iliad XXIV) are healing. Milton parodies them: Satan meets the son he has fathered in sin, and the recognition is an alliance for the destruction of humankind.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXIV",
        targetBookId: "the-iliad",
        targetChapterNumber: 23,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-2-paradise-of-fools",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "Embryos and idiots, eremites and friars",
    anchorOccurrence: 1,
    title: "The Paradise of Fools — Milton's Protestant satire",
    quotedPassage:
      "Embryos, and idiots, eremites, and friars, / White, black, and gray, with all their trumpery. / Here pilgrims roam, that strayed so far to seek / In Golgotha him dead, who lives in Heaven…",
    passageReference: "Book III, lines 474–477 · PL III.474–77",
    commentary: `A moment of direct Protestant satire. The Paradise of Fools — a region of the upper air near the moon — is where Milton places, among "embryos and idiots," the monks, friars, and Catholic pilgrims whose theology he regards as idolatrous. The catalogue is specific: *eremites* (hermits), *friars* (mendicant orders), *white, black, and gray* (Carmelites, Dominicans, Franciscans). The *trumpery* — rubbish — is the relics and indulgences the Protestant tradition rejected.

This is an annotation on Book III's geography, appearing in Book II's broader voyage arc because the Paradise of Fools is where Satan will nearly land before Uriel redirects him. Milton's point: Catholic devotional practice is, from a Protestant perspective, literally indistinguishable from folly, and the place reserved for it is nowhere in Heaven or Hell but a liminal air-pocket of nothing. The satire is sharp enough to have made Catholic readers through the centuries skip this passage.

Worth noting that Milton's poetry generally refuses sectarian polemic; this passage is an exception and marks one of his hardest Protestant commitments.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-2-chaos",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "I know thee, stranger",
    anchorOccurrence: 1,
    title: "Chaos and Night — the pre-creation abyss",
    quotedPassage:
      "Chaos and Night… I know thee, stranger, who thou art, / That mighty leading angel, who of late / Made head against Heaven's King…",
    passageReference: "Book II, lines 988–993 · PL II.988–93",
    commentary: `Chaos is the personification of the unformed abyss from which God made the World; Night is his consort. Milton's theological move here is heterodox and bold: he *personifies* the matter-before-creation, giving Chaos a voice and a political stake. Chaos wants his territory back — the act of creation shrank his domain — and so he will actively assist Satan's voyage in the hope that Satan's success will re-expand the formless.

This is Milton's monism showing. Unlike traditional Christian theology (which usually denies pre-creation being), Milton elsewhere argues that God created not *ex nihilo* but from his own substance. Chaos here is not nothing, but a something that was, a potentiality that has political interests. The passage is controversial and has generated centuries of commentary; the Tome annotations flag it here so the reader can recognize the heterodox claim when it surfaces.

Chaos and Night in the palette: slate and midnight blue. Abstract, cosmic, not dramatic — like Sin and Death, figures of principle rather than personality.`,
    crossReferences: [],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "pl-2-stupendous-bridge",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "a bridge of wondrous length",
    anchorOccurrence: 1,
    title: "The bridge of Sin and Death — foreshadowing Book X",
    quotedPassage:
      "(O transformation strange!) / Over the foaming deep high-arched, a bridge / Of length prodigious…",
    passageReference: "Book II (anticipatory); Book X, lines 301–305 · PL X.301–05",
    commentary: `Satan departs; Sin and Death, feeling his success at the gates, resolve to follow and to build a bridge from Hell to the new World. The bridge is the structural image of the Fall's consequences — once Man is tempted, the infrastructure of Hell will be physically connected to the Earth, and sin and mortality will have a literal pathway. Milton makes the allegory engineering: the bridge is described as a construction project, the two allegorical figures as its builders.

The actual construction happens in Book X.282ff. I anchor the note here because Book II sets up the architecture; the payoff is deferred. Readers who reach the building scene in Book X without having seen this setup often miss how carefully Milton has planted the foundations.

The image was not Milton's invention — early Christian iconography occasionally depicted a bridge between Earth and Hell — but the treatment (Sin and Death as engineers; the bridge as a specific consequence of the Fall; the materials drawn from the Chaos itself) is his, and it is one of the poem's strongest allegorical innovations.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The actual building of the bridge is in Book X.282–324. Read this annotation alongside that passage; the two scenes are a set-piece diptych.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book X, lines 282–324",
        targetBookId: "paradise-lost",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "pl-2-voyage-through-chaos",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "Into this wild abyss",
    anchorOccurrence: 1,
    title: "Satan's voyage through Chaos — the diabolic Odyssey",
    quotedPassage:
      "Into this wild Abyss the wary Fiend / Stood on the brink of Hell and looked a while, / Pondering his voyage…",
    passageReference: "Book II, lines 917–919 · PL II.917–19",
    commentary: `The last hundred lines of Book II are Milton's pure dark-epic. Satan, alone, is crossing an unformed waste as Odysseus crossed the wine-dark sea — but the sea is not water, it is a "wild abyss" of pre-creation where "*hot, cold, moist, and dry, four champions fierce, / Strive here for mastery*" (II.898–99). The Aristotelian elements have not yet been separated out into the forms they take in a made world. Satan is flying through the materials of Genesis 1:2.

The syntactic difficulty spikes here. The paragraphs are the longest in the book; the subordination is most recursive; the line-endings are overwhelmingly enjambed. Milton is writing verse that is itself formally chaotic, so the reader experiences the abyss as reading-difficulty.

When Satan finally sees the new World at the far edge (II.1049–55) — "*This pendent world, in bigness as a star / Of smallest magnitude close by the moon*" — the whole structure of the poem's cosmology comes into view for the first time. Heaven is above, Hell is below, and between them a small bright speck is the World that God has just made. Satan's voyage is on scale with that entire cosmology.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The voyage is Milton's answer to the Odyssey's middle books. Odysseus crossed a sea populated by monsters and magicians; Satan crosses a pre-cosmos populated by personified elements and allegorical custodians. The analog is exact and deliberate.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books IX–XII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "pl-2-pendent-world",
    bookId: "paradise-lost",
    chapterNumber: 1,
    anchorText: "This pendent world",
    anchorOccurrence: 1,
    title: "\"This pendent world\" — first sight of Earth from outside",
    quotedPassage:
      "This pendent world, in bigness as a star / Of smallest magnitude close by the Moon.",
    passageReference: "Book II, lines 1052–1053 · PL II.1052–53",
    commentary: `The last lines of Book II. Satan has crossed Chaos, and he sees — for the first time in the poem — what he has come to destroy. *Pendent* means hanging, suspended: the world is seen, from the distance he is at, as a single small star hanging near the moon. The image is modern-astronomical, not medieval-geocentric: Milton is writing a universe where the Earth is small, and its size is conveyed via Galilean-telescope comparison (cf. the Galileo simile of Book I).

The scale is the point of the book's ending. The council, the voyage, the monstrous encounters — all of that vast machinery has been rolled out to compass a "*star of smallest magnitude*." Milton's cosmology makes the target of the Fall physically tiny. The reader arrives at the close of Book II with the universe's dimensions in their head, and is about to see, in Book III, the Heaven from which all of this is visible.

This is also the poem's first true act of modern visual astronomy. The reader ends Book II on a Copernican image.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare to Book I's Galileo simile (I.284–91) — both are moments where the new telescope-astronomy enters the poem. Milton's cosmology is Ptolemaic in structure but uses modern optical imagery.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 284–291",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "Tuscan artist",
      },
    ],
    tags: ["historical", "philosophical"],
  },
]
