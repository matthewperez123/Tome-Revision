import type { Annotation } from "../types"

// ── Paradise Lost Book X — judgment, the bridge of Sin and Death, Satan's
// return, the transformation into serpents, Adam's despair, the
// reconciliation, the protevangelium. 12 annotations.

export const PARADISE_LOST_BOOK_10: Annotation[] = [
  {
    id: "pl-10-sons-judgment",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "Where art thou, Adam",
    anchorOccurrence: 1,
    title: "The Son's descent for judgment",
    quotedPassage:
      "\"Where art thou, Adam, wont with joy to meet / My coming seen far off?\"",
    passageReference: "Book X, lines 103–104 · PL X.103–04",
    commentary: `The Son descends to Eden to pronounce judgment. Milton stages the scene carefully: the Father does not judge directly — he sends the Son, who combines the judicial authority with a mercy the Father's austere justice could not embody alone. The Son acts as judge, defender, and eventual ransomer in one.

The question *Where art thou, Adam?* is directly from Genesis 3:9 but, in Milton's hands, it is poignant rather than interrogatory. God knows where Adam is; he is asking Adam to *present himself* — to face the judgment as a responsible party, not hide.

The scene that follows — Adam blaming Eve (X.137), Eve blaming the Serpent (X.162), the triple curse pronounced on Serpent, Eve, and Adam (X.175–223) — is Milton's versification of Genesis 3:10–19 with theological amplification.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Genesis 3:9–19 — the scene of judgment in Eden. Milton versifies it, adding theological amplification and the framing of the Son as the judge-and-future-ransomer.",
        workTitle: "Genesis",
        workAuthor: "Moses (traditional)",
        passageReference: "Chapter 3, verses 9–19",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-10-protevangelium",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "Her seed shall bruise thy head",
    anchorOccurrence: 1,
    title: "The Protevangelium — \"her seed shall bruise thy head\"",
    quotedPassage:
      "\"Between thee and the woman I will put / Enmity, and between thine and her seed: / Her seed shall bruise thy head, thou bruise his heel.\"",
    passageReference: "Book X, lines 179–181 · PL X.179–81",
    commentary: `The Serpent's curse (Genesis 3:15) contains, in traditional Christian reading, the first prophecy of Christ — the *protevangelium*, "first gospel." The *seed of the woman* who will bruise the serpent's head is read typologically as Christ, who in his resurrection crushes Satan's power.

Milton renders the verse without explicit theological gloss in the immediate context, but the poem's whole doctrinal structure rests on the typology. The Son will, in Michael's vision in Book XII, explicitly fulfill this prophecy (XII.430–35). The arc from the Garden's curse to the Cross's victory is the spine of the poem's theology.

This is also the first moment in the poem where the Fall is explicitly anticipated-as-repaired. The curse on the Serpent contains its own undoing; the theological economy of *felix culpa* (the fortunate fall) is visible here as structural promise.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Genesis 3:15 — traditionally called the protevangelium, the first announcement of the gospel. Christian exegesis from Irenaeus onward reads the 'seed of the woman' as Christ. Milton's verse preserves the typology for Book XII to fulfill.",
        workTitle: "Genesis",
        workAuthor: "Moses (traditional)",
        passageReference: "Chapter 3, verse 15",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-10-sin-death-bridge",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "O Son, why sit we here",
    anchorOccurrence: 1,
    title: "Sin and Death build the bridge",
    quotedPassage:
      "\"O Son, why sit we here each other viewing / Idly, while Satan, our great author, thrives / In other worlds…\"",
    passageReference: "Book X, lines 235–237 · PL X.235–37",
    commentary: `Sin, feeling the success of Satan's project, proposes to Death that they build a bridge from Hell to the new World. Milton describes the construction in engineering detail (X.282–324): Sin and Death gather *the aggregated soil, death with his mace petrific, cold and dry, / As with a trident smote…* The materials are drawn from Chaos; the structural principles are allegorical engineering.

The bridge is Milton's literal rendering of what the early Church Fathers described as *the dominion of Sin and Death over fallen creation*. Post-Fall, Sin and Death have *access* to Earth — a geographical, not merely metaphorical, reality. The bridge is the infrastructure of this access.

The passage should be read against Book II's setup (Sin and Death at the gates of Hell, II.648ff). The architecture of evil that was theatrically staged in Book II is now realized in actual construction in Book X.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Book II's Sin-and-Death scene at the gates of Hell (II.648ff) is the theatrical setup; Book X's bridge-building is the structural payoff. Read the two as a diptych.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book II, lines 648–870",
        targetBookId: "paradise-lost",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "pl-10-satan-returns-triumph",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "Thrones, Dominations, Princedoms",
    anchorOccurrence: 1,
    title: "Satan's triumphal speech in Pandemonium",
    quotedPassage:
      "\"Thrones, Dominations, Princedoms, Virtues, Powers! / For in possession such, not only of right, / I call ye, and declare ye now…\"",
    passageReference: "Book X, lines 460–462 · PL X.460–62",
    commentary: `Satan returns to Pandemonium and delivers the victory speech. The same address (*Thrones, Dominations, Princedoms, Virtues, Powers*) he used in Heaven in Book V.601, now redeployed in Hell. Milton is signaling the completeness of Satan's rhetorical self-deception: he still addresses his fallen legions with the honorifics they have forfeited.

The speech runs through the narrative of the voyage (a compressed account of Books II–IX from his point of view), and ends with Satan expecting applause. He gets, instead, a hiss. The moment is one of the poem's most unexpectedly comic: the assembled legions have been transformed, while he spoke, into serpents.

This is one of Milton's most audacious narrative strokes. The transformation happens *during* the speech, so that Satan hears himself acclaimed and looks up to see reptiles. Comedy and horror are simultaneous.`,
    crossReferences: [],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "pl-10-transformation-serpents",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "A dismal universal hiss",
    anchorOccurrence: 1,
    title: "The transformation — \"a dismal universal hiss\"",
    quotedPassage:
      "A dismal universal hiss, the sound / Of public scorn…",
    passageReference: "Book X, lines 508–509 · PL X.508–09",
    commentary: `The fallen angels, at the moment of Satan's speech, are transformed into serpents. Their intended applause comes out as hissing. Satan himself is transformed alongside them — *his arms clung to his ribs, his legs entwining* (X.512) — and tastes, along with them, a false fruit that turns to ashes in the mouth.

The transformation is Milton's most audacious narrative invention — not in scripture, not in earlier Christian tradition. It is a pure act of poetic justice: the rhetorical triumph of the fallen legions is converted into the noise of reptiles. Milton is mocking them at the moment of their greatest self-congratulation.

The annual re-enactment (X.575–77) — Satan and the fallen angels are, *to dash their pride*, made to repeat the serpent-metamorphosis each year at a fixed time — is Milton's version of a dark liturgical calendar. Evil is punished by being made to replay its own moment of shame.`,
    crossReferences: [],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-10-cosmic-changes",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "the Sun / Had first his precept",
    anchorOccurrence: 1,
    title: "Cosmic changes — seasons, storms, and mortality",
    quotedPassage:
      "The Sun / Had first his precept so to move, so shine, / As might affect the earth with cold and heat / Scarce tolerable…",
    passageReference: "Book X, lines 651–654 · PL X.651–54",
    commentary: `Milton's account of the cosmic consequences of the Fall. Before the Fall, the Earth enjoyed perpetual temperate weather; after, the Sun's axis is tilted (X.668–75) so that seasons begin — the scorching summer, the bitter winter, the storm. The stars are assigned hostile influences; winds are released from the four compass-points to blow with malice.

Milton's choice is technically correct cosmology: on a geocentric model, the tilt of the ecliptic produces the seasons. The Fall *causes* the tilt, retroactively explaining the astronomical observation that is the foundation of the seasons. Milton is writing physics as theology.

Alternatively (X.668–75), the passage allows that God may have instead moved the Earth's axis — leaving open whichever cosmology (Ptolemaic or Copernican) the reader prefers. The double explanation is Milton's method: give the theological effect, and leave the physics underdetermined. Compare Raphael's astronomy counsel at VIII.66–178.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-10-adams-despair",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "O miserable of happy",
    anchorOccurrence: 1,
    title: "Adam's despair — the longest post-Fall soliloquy",
    quotedPassage:
      "\"O miserable of happy! is this the end / Of this new glorious World, and me so late / The glory of that glory, who now become / Accursed of blessed?\"",
    passageReference: "Book X, lines 720–723 · PL X.720–23",
    commentary: `Adam's post-Fall soliloquy runs 120 lines (X.720–844), making it the longest single speech in the poem. He works through the reasons he exists to be in this condition — whether his coming children inherit the curse (they do), whether death will end his suffering (he thinks not, since his soul may endure), whether he can repay the debt (he cannot).

The argumentative structure is scholastic: Adam reasons through the theology like a man working out his Aquinas under duress. The moments of human despair appear mostly in the spaces between arguments — *O miserable of happy!* as a pure cry; *Did I request thee, Maker, from my clay / To mould me Man?* (X.743–45) as a Joban challenge.

This last question (*did I request thee, Maker…*) is the line Mary Shelley quotes on the title page of *Frankenstein*. The Creature reads Paradise Lost and identifies with the speaker. The annotation here flags the intertext, which is one of the strongest novel-to-epic intertextual clusters in the catalog.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Mary Shelley's Frankenstein quotes Adam's challenge at X.743–45 on its title page: 'Did I request thee, Maker, from my clay / To mould me Man? Did I solicit thee / From darkness to promote me?' Shelley's Creature is reading Milton and speaking with Adam's voice. The citation is one of the most influential novel-to-epic quotations in English literature.",
        workTitle: "Frankenstein",
        workAuthor: "Mary Shelley",
        passageReference: "Title page",
        targetBookId: "frankenstein",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "pl-10-eve-approaches",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "Forsake me not",
    anchorOccurrence: 1,
    title: "Eve's approach — \"forsake me not thus, Adam\"",
    quotedPassage:
      "\"Forsake me not thus, Adam! witness Heaven / What love sincere, and reverence in my heart, / I bear thee…\"",
    passageReference: "Book X, lines 914–916 · PL X.914–16",
    commentary: `Eve initiates the reconciliation. She has been rebuked, she has recognized her share of the fault, and she approaches Adam humbly. The speech (X.914–36) is the turning point of the book: before it, Adam and Eve are two isolated beings in despair; after it, they are a couple again, which is the precondition for anything else in the poem.

The rhetorical structure is important. Eve does not argue; she asks. She takes the blame — *on me… on me alone, as in the source and spring / Of all corruption, all the blame lights due* (X.935–36) — and offers to intercede with God if he will accept one sufferer rather than two.

Milton is making a specific point. Eve, who the patriarchal reading of the Fall blames, is the one who *begins the repair*. She takes responsibility before Adam does. The reconciliation is hers to initiate; Adam's generosity (X.940–65, "*if prayers could alter high decrees*") follows her lead.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
  {
    id: "pl-10-adams-relenting",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "Unwary, and too desirous",
    anchorOccurrence: 1,
    title: "Adam relents — \"if prayers could alter high decrees\"",
    quotedPassage:
      "\"Unwary, and too desirous, as before / So now, of what thou know'st not, who desir'st / The punishment all on thyself…\"",
    passageReference: "Book X, lines 947–949 · PL X.947–49",
    commentary: `Adam's reply. He rebukes Eve's offer to take all the blame (you are being too eager again, as you were before), but he is softened. The rhetorical shift is from bitterness to shared responsibility: *rather alternate our labours, and divide, / Or share our common calamity* (X.962–65).

This is Milton showing prelapsarian love surviving postlapsarian damage. The love is no longer pure, but it is still love, and the damage is not terminal. Paradise Lost will not end with Adam and Eve's estrangement; the reconciliation here lays the psychological groundwork for the expulsion in Book XII, when they leave the garden hand in hand.

The theology: repentance is possible, forgiveness is possible, the fall has not destroyed the possibility of love. The rest of the poem is about how those possibilities play out.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
  {
    id: "pl-10-eve-suicide-proposal",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "seek we Death",
    anchorOccurrence: 1,
    title: "Eve proposes suicide — and is refused",
    quotedPassage:
      "\"Why stand we longer shivering under fears / That shew no end but Death…? / Let us seek Death…\"",
    passageReference: "Book X, lines 1003–1006 · PL X.1003–06",
    commentary: `Eve, continuing to propose alternatives to the curse's slow unfolding, suggests they commit suicide: either together, or through not producing children. The proposal is theologically enormous — it would end the human race before it begins.

Adam refuses (X.1028ff). His reply is consciously ironic: to choose death is to give Satan the victory he sought, and to refuse the mercy God has left in the curse (the protevangelium, the *seed of the woman*). The reply turns Eve's despair into hope by reframing the curse as promise.

This is the pivot to the closing arc of the poem. Adam's speech at X.1028–1104 *invents* Christian hope inside the Fall — he teaches Eve (and the reader) to read the curse as containing its own promise of redemption. Book XI's vision of human history, and Book XII's felix culpa, both follow from the theological move Adam makes here.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
  {
    id: "pl-10-prayer-of-repentance",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "Suppliant he sat",
    anchorOccurrence: 1,
    title: "The prayer of repentance — the first human prayer",
    quotedPassage:
      "What better can we do, than, to the place / Repairing where he judged us, prostrate fall / Before him reverent; and there confess / Humbly our faults, and pardon beg…",
    passageReference: "Book X, lines 1086–1089 · PL X.1086–89",
    commentary: `Adam's closing speech: let us return to the place of judgment and pray. The repeated line at X.1099–1104 shows them doing so: *prostrate fall before him reverent, and there confess humbly our faults, and pardon beg*. This is the first human prayer in the poem's chronology.

Milton's theology of repentance: it is not performed without grace. The Father in Book XI will say that he sent the *prevenient grace* that moved Adam and Eve to pray (*for from the Mercy-seat above / Prevenient grace descending had removed / The stony from their hearts*, XI.2–4). The prayer is theirs; the capacity to pray is given.

This is the standard Arminian / Wesleyan position. God offers the help; the human accepts it; neither side is sufficient alone. Milton is closing Book X on the exact theological move that will anchor Book XI's opening.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-10-eve-blames-serpent",
    bookId: "paradise-lost",
    chapterNumber: 9,
    anchorText: "The Serpent me beguiled",
    anchorOccurrence: 1,
    title: "\"The Serpent me beguiled\" — the shortest speech in the poem",
    quotedPassage:
      "\"The Serpent me beguiled, and I did eat.\"",
    passageReference: "Book X, line 162 · PL X.162",
    commentary: `Eve's reply to the judgment. Six monosyllables, one line, the shortest speech in the poem. Milton is quoting Genesis 3:13 directly (*the serpent beguiled me, and I did eat*). The brevity is the point: Eve has nothing to say beyond the fact. Her defense is accurate and minimal.

Adam's answer to the same question (X.125–43) is longer and more self-serving: he blames Eve, then implicitly blames God for giving her to him. The comparison is devastating for Adam. Eve simply states what happened; Adam spreads the blame around.

This is one of the minor formal excellencies of the poem. Milton could have given Eve a longer speech, and almost every 18th-century editor expected him to. Keeping it at six words preserves the Biblical brevity and makes Eve the more morally economical speaker of the two.`,
    crossReferences: [],
    tags: ["linguistic", "philosophical"],
  },
]
