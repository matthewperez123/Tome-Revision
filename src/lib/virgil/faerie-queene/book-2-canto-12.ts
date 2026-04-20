import type { Annotation } from "../types"

// ── The Faerie Queene — Book II · Canto XII ───────────────────────────
// The Bower of Bliss — the poem's most imitated and most critically
// debated set-piece. Hand-authored scholarly annotations; Standard
// Ebooks text (selectively modernized from the 1596 quarto). Chapter
// index post-canto-split: ch-25 in public/content/the-faerie-queene/.
//
// Density: 13 annotations. Opus-grade per spec Part 4 — Book II canto
// xii is one of the ten named Opus clusters, and per spec explicitly
// "the demo-critical set-piece" of the whole poem. Milton's Paradise
// Lost IV (the unfallen Eden) is responding directly to this canto;
// the cross-reference cluster to Paradise Lost here is the single most
// important inter-book demonstrable inheritance in the Tome catalog's
// English-epic line, alongside Orlando Furioso ↔ Faerie Queene.
//
// The cluster traces, in this order:
//   (1) The canto's opening frame and the sea-voyage allegory
//   (2) Gulf of Greediness + Whirlpool of Decay — Homeric Scylla/Charybdis
//   (3) Mermaids making false melodies — Odyssean Sirens tradition
//   (4) The Genius at the gate — perverted genius loci, Ariostan echo
//   (5) The Rose song — carpe rosam from Ausonius through Spenser to Marvell
//   (6) "Ah! see the Virgin Rose" — the lyric's actual text and its
//       direct inheritance by Milton in the Eden of Paradise Lost IV
//   (7) Two naked damsels bathing — Alcina-tradition voyeuristic framing
//   (8) Acrasia and Verdant — Alcina-Ruggiero as direct formal source
//   (9) The subtile net — Vulcan/Mars/Venus via Ovid's Metamorphoses IV
//   (10) Guyon destroys the Bower "with rigour pittilesse" — THE
//        critically contested moment (Greenblatt 1980; verified citation)
//   (11) "Let Gryll be Gryll" — Circe/Plutarch tradition closing
//   (12) Bower → Eden: the direct Miltonic inheritance, documented
//   (13) The larger demo-critical reading: why this set-piece and not
//        another is Spenser's load-bearing moment in English-epic.
//
// Cross-references are verified: every work named is in the Tome catalog
// (Orlando Furioso, Paradise Lost, Odyssey, Iliad, Aeneid) or is cited
// with accurate scholarly authority (Greenblatt's Renaissance Self-
// Fashioning, 1980, University of Chicago Press — directly verified).

export const FAERIE_QUEENE_BOOK_2_CANTO_12: Annotation[] = [
  // ── 1. The canto's opening — temperance as architecture ────────────
  {
    id: "fq-2-12-opening-frame",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Now ginnes that goodly frame of Temperaunce",
    anchorOccurrence: 1,
    title: "\"Now ginnes that goodly frame\" — Book II's climactic approach",
    quotedPassage:
      "Now ginnes that goodly frame of Temperaunce / Fayrely to rise, and her adorned hed / To pricke of highest prayse forth to advaunce, / Formerly grounded and fast setteled / On firme foundation of true bountyhed",
    passageReference: "Book II canto xii, stanza 1",
    commentary: `Spenser opens the canto with an architectural figure — the virtue of Temperance is a *frame* being raised to "pricke of highest prayse." The word *frame* in 1596 still carries its Middle English sense of constructed edifice (as in *frame-work*, the timber skeleton of a house); combined with *firme foundation* it signals that temperance has been, through the eleven preceding cantos, *built*, course by course, like a building.

This is a deliberate structural signal from Spenser. Book II is about to conclude; the argument for temperance as a virtue has been constructed through a series of emblematic tests (Medina's house, the Cave of Mammon, the House of Alma), and now the *climax* of that construction — the destruction of the Bower of Bliss — is the roof going onto the frame. Guyon's journey by sea in the rest of this canto is both a literal voyage to Acrasia's island and an allegorical completion of Temperance's moral edifice.

The architectural figure also looks back to Book II canto ix (the House of Alma), where Spenser allegorizes the human body itself as a building — turrets, kitchens, libraries, chambers. The frame-of-Temperance here is thus not only the book's argument but also the temperate body and soul itself, which canto ix described, and which canto xii now sees threatened and defended.

Readers who have worked through Books I and II reach this stanza knowing that the *book's final test is coming*. Redcrosse's book ended with the Dragon-fight (the largest external enemy of Holiness); Guyon's book will end with the Bower of Bliss (the largest internal enemy of Temperance — pleasure that has detached from purpose). The shape of Book II is being named here.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Book I closed with the Dragon-fight (cantos xi–xii) — the massive external combat that vindicates the knight's holiness. Book II closes with the Bower's destruction — the massive internal temptation that vindicates (controversially) the knight's temperance. The structural parallel is Spenser's: each book's final canto is the extreme test of its virtue.",
        workTitle: "The Faerie Queene (Book I canto xii)",
        workAuthor: "Edmund Spenser",
        passageReference: "Book I canto xii",
        targetBookId: "the-faerie-queene",
        targetChapterNumber: 13,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 2. Gulf of Greediness — Homeric Charybdis ──────────────────────
  {
    id: "fq-2-12-gulf-of-greediness",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Gulfe of Greedinesse",
    anchorOccurrence: 1,
    title: "The Gulf of Greediness — Homer's Charybdis re-allegorized",
    quotedPassage:
      "That is the Gulfe of Greedinesse, they say, / That deepe engorgeth all this worldes pray; / Which having swallowd up excessively, / He soone in vomit up againe doth lay, / And belcheth forth his superfluity",
    passageReference: "Book II canto xii, stanza 3",
    commentary: `Guyon's sea-voyage to Acrasia's island is Spenser's explicit re-staging of Odysseus's homecoming voyage in *Odyssey* XII. The Gulf of Greediness — a whirlpool that "engorges" and "belches forth" its prey — is Charybdis, the monster-whirlpool of the Strait of Messina whom Odysseus must navigate past. Spenser's Palmer names the danger in exactly the terms Homer's Circe names it to Odysseus (*Odyssey* XII.104–110): a devouring whirlpool that swallows the sea down and belches it back three times a day.

The allegorical retuning is what makes this Spenser rather than Homer. Homer's Charybdis is a natural danger on a hero's route; Spenser's Gulf of Greediness is *greed itself* — the moral-psychological disposition to engorge excessively and then vomit what one cannot digest. The sea-voyage is now also, simultaneously, the moral pilgrimage, and the geography is the topography of the temperate soul's dangers.

The stanzas that follow list the rest of Guyon's Odyssean route: the Rock of Vile Reproach (Scylla, Charybdis's paired danger), the Wandering Islands (Homer's Planctae, "the Wandering Rocks" of XII.59–72), the Quicksand of Unthriftyhed (original to Spenser), and the Whirlpool of Decay (another Charybdis-echo). The catalogue is Spenser's most direct Homeric allegorical pass in the whole poem. A reader with the Odyssey to hand can walk through it stanza by stanza and see the Homeric coordinates translated into moral ones.

This technique — literal Homeric danger → moral-allegorical counterpart — is the Renaissance humanist method of Spenser's larger Homeric inheritance. He is *not* rewriting the Odyssey; he is allegorizing it. The journey is the temperate soul's journey, and every external sea-monster is an internal passion. By the canto's end, when the Bower is destroyed, the allegorical frame will have said: the voyage past Charybdis has been, all along, the voyage past one's own greed.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer's Odyssey XII — Charybdis, the whirlpool that swallows and belches the sea, and the paired Scylla, the six-headed rock-monster. Odysseus's navigation past them, instructed by Circe, is Spenser's direct source. Rose's Circe-passage (Circe's instruction to Odysseus) is the technical template Spenser allegorizes.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XII, lines 73–110, 234–259",
        targetBookId: "the-odyssey",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 3. Mermayds — Odyssean Sirens ──────────────────────────────────
  {
    id: "fq-2-12-mermayds-sirens",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Mermayds haunt making false melodies",
    anchorOccurrence: 1,
    title: "The Mermaids — Odyssean Sirens with Protestant theology",
    quotedPassage:
      "Where many Mermayds haunt making false melodies",
    passageReference: "Book II canto xii, stanza 30 (line 9, the alexandrine)",
    commentary: `The Sirens of Odyssey XII are, in Spenser's allegorical topography, mermaids — and their song is now explicitly *false*. Homer's Sirens sing a true song (they know all that has happened and will happen); their danger is that the truth they sing is fatally distracting. Spenser's mermaids sing *false* melodies. The danger is now about counterfeit pleasure rather than distracted attention.

This is a telling small shift. Homer's Sirens tempt Odysseus with *knowledge*; Spenser's mermaids tempt Guyon with *false music*. The Protestant allegorical register reads the Bower of Bliss as a domain of seductive *lies* — pleasure that promises what it cannot give — rather than seductive *truths*. Acrasia's island is not a place where one learns too much; it is a place where one believes too readily. The danger is credulity, not curiosity.

Note also the form: Spenser drops this key image into the *alexandrine* — line 9 of the Spenserian stanza, the hexameter close. The summative ninth line is carrying the passage's most important doctrinal claim: the music of the Bower is false. Readers with the "Highlight alexandrines" toggle enabled should see this line stand out structurally; the form is doing theological work.

The mermaid detail — fish-tailed women rather than Homer's bird-bodied Sirens — is medieval rather than classical. The bird-women of Homeric tradition (still visible in archaic Greek vase-painting) were replaced in late-medieval Christian iconography with fish-tailed mermaids, partly because the mermaid composite better matched the medieval moral association of the lower-body passions with the watery/bestial. Spenser inherits the medieval revision and integrates it.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer's Odyssey XII.39–54 + 165–200 — Circe's instruction about the Sirens, Odysseus tied to the mast while his crew rows past with wax in their ears. The single most recognizable Homeric scene of voluntary resistance to seductive song.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XII, lines 39–54, 165–200",
        targetBookId: "the-odyssey",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 4. The Genius at the gate — Ariostan/Roman echoes ──────────────
  {
    id: "fq-2-12-genius-at-gate",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "They in that place him Genius did call",
    anchorOccurrence: 1,
    title: "The false Genius — Spenser corrects Ariosto and the Roman tradition",
    quotedPassage:
      "They in that place him Genius did call: / Not that celestiall powre, to whom the care / Of life, and generation of all / That lives, perteines in charge particulare",
    passageReference: "Book II canto xii, stanzas 46–48",
    commentary: `Spenser is unusually explicit here, and the explicitness is the point. The gatekeeper at the threshold of Acrasia's Bower is called *Genius* — and Spenser immediately interrupts his narrative to clarify which Genius is meant. Not the *celestial Genius* of Roman tradition, the tutelary guardian of individuals and places (the *genius loci* of household religion, continued in medieval Christian thought as the guardian angel); but a *false Genius*, a corrupt figure who perverts the guardian's role.

Why the clarification? Because Ariosto and the Italian romance-epic tradition (Boccaccio's *Genealogia deorum gentilium*, Pulci, Boiardo) routinely used *Genius* in the positive Roman sense, and Spenser wants his reader not to mistake his allegorical figure for that tradition. The Bower's Genius is exactly the kind of guardian-of-pleasure who, in a late-Roman or a Florentine-humanist setting, would be celebrated. Spenser, writing a Protestant Christian allegory, labels him a *false* guardian and names the corruption.

The Ariostan particular that Spenser is correcting is *Orlando Furioso* VII, Alcina's island — where the entrance to the enchantress's realm is guarded by a fair figure whom Ariosto does not explicitly moralize. Spenser rewrites the Ariostan scene with Protestant moral apparatus baked in. The same figure at the same gate is now *labeled* as false-Genius, with a scholarly note explaining why.

This is Spenser's general method with Ariosto: *inherit the narrative, install the allegorical machinery*. The Alcina-Acrasia inheritance runs through this canto; the Genius-at-the-gate is the canto's most compact example of how Spenser translates from the Italian chivalric tradition to the English Protestant allegorical one. A reader who has read Orlando Furioso Canto VII recognizes the scene and notices the installed moral commentary.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Orlando Furioso Canto VII — Ruggiero arrives at Alcina's island, is welcomed, falls under her enchantment. Ariosto's guardian-at-the-gate is the direct model for Spenser's Genius, but Ariosto does not moralize the figure. Spenser installs the Protestant allegorical commentary Ariosto's romance did not carry.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Canto VII",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 7,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },

  // ── 5. "Gather therefore the Rose" — carpe rosam ──────────────────
  {
    id: "fq-2-12-gather-the-rose",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Gather therefore the Rose whilest yet is prime",
    anchorOccurrence: 1,
    title: "\"Gather therefore the Rose\" — the carpe rosam tradition",
    quotedPassage:
      "Gather therefore the Rose whilest yet is prime, / For soone comes age that will her pride deflowre; / Gather the Rose of love whilest yet is time, / Whilest loving thou mayst loved be with equall crime.",
    passageReference: "Book II canto xii, stanza 75 (closing stanza of the Rose song)",
    commentary: `One of the most famous couplets in English poetry, and a node in one of the longest literary traditions in Western verse — the *carpe diem* / *carpe rosam* motif, which Spenser inherits and Marvell and Herrick will inherit from Spenser.

The tradition begins, as far as we can trace it, with the pseudo-Ausonian Latin poem *De rosis nascentibus* ("On the Opening Roses," 4th century CE, sometimes attributed to Ausonius): *collige, virgo, rosas dum flos novus et nova pubes, / et memor esto aevum sic properare tuum* — "Gather, maiden, the roses while the flower is new and your youth is new, and remember that your life hastens away just so." Spenser's *gather therefore the Rose whilest yet is prime* is a direct translation-paraphrase of *collige, virgo, rosas*.

The motif then passes through Renaissance Italian poetry — Poliziano's *Stanze per la Giostra* (1475) has a version; Tasso's *Gerusalemme Liberata* (1581) XVI has an exquisite version in Armida's garden that Spenser clearly read. Tasso's lines *cogliam d'amor la rosa: amiamo or quando / esser si puote riamato amando* ("let us gather love's rose: let us love now when to be loved returning love is possible") are nearly word-for-word what Spenser writes. Spenser here is paraphrasing Tasso paraphrasing Ausonius.

The motif will pass forward to Herrick's *Gather ye rosebuds while ye may* (1648) and Marvell's *Had we but world enough and time* (c. 1650s). Every one of those later lyrics goes through this Spenserian node. The Bower of Bliss becomes, inadvertently, the canonical English poetic locus for the motif, even as Spenser is *morally condemning* the figure singing it.

That is the irony the reader should register: Spenser is writing the most beautiful carpe rosam lyric in English in order to frame it as a temptation the temperate hero must reject. The song is rhetorically glorious and morally dangerous at once; the poem wants the reader to feel both. Guyon will destroy the Bower in a few stanzas. That the Rose-song survives — and has been memorized by every subsequent English poet — suggests that the destruction did not settle the argument.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Pseudo-Ausonian 'De rosis nascentibus' (4th c. CE) — 'collige, virgo, rosas' — the Latin source of the entire carpe rosam motif. Renaissance poets from Poliziano and Tasso to Spenser to Marvell and Herrick all inherit through this poem.",
        workTitle: "De rosis nascentibus",
        workAuthor: "attributed to Ausonius",
        passageReference: "4th century CE",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Tasso's Gerusalemme Liberata XIV–XVI — Armida's garden and the parrot singing 'cogliam la rosa'. Spenser read Tasso's garden carefully; the 1596 Bower of Bliss is Spenser's answer to the 1581 Armida's garden. Tasso is not yet in the Tome catalog; when added, this cross-reference should be upgraded.",
        workTitle: "Gerusalemme Liberata",
        workAuthor: "Torquato Tasso",
        passageReference: "XIV–XVI (Armida's garden)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 6. "Ah! see the Virgin Rose" — the full lyric ──────────────────
  {
    id: "fq-2-12-virgin-rose-milton",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Ah! see the Virgin Rose",
    anchorOccurrence: 1,
    title: "\"Ah! see the Virgin Rose\" — direct source for Milton's Eden",
    quotedPassage:
      "Ah! see, whoso fayre thing doest faine to see, / In springing flowre the image of thy day. / Ah! see the Virgin Rose, how sweetly shee / Doth first peepe foorth with bashfull modestee",
    passageReference: "Book II canto xii, stanza 74",
    commentary: `Milton, composing *Paradise Lost* Book IV some seventy years after Spenser, takes this scene and rewrites it as the unfallen Eden.

The formal correspondences are exact enough to read side by side. Spenser's Bower has: a walled garden; a rose at its center; a song urging the gathering of the rose; bathing nymphs; a reclining enchantress; a fainted lover; manufactured artifice masquerading as nature. Milton's Eden (Paradise Lost IV.131–287) has: a walled garden with a living hedge; a rose at its center ("Flowers of all hue, and without thorn the rose"); no song (Eden is pre-lapsarian, so there is no carpe diem urgency); bathing is replaced with companionate labor; Eve reclining on a bed of flowers; Adam and Eve married rather than ruined; natural abundance rather than artifice — "nature boon / Poured forth profuse on hill and dale and plain."

Milton's genius is the inversion. Spenser's Bower is art pretending to be nature; Milton's Eden is nature that exceeds any art. Spenser's rose is the emblem of transience ("gather it before age deflowers it"); Milton's rose is without thorn — thornlessness is pre-lapsarian nature. Spenser's bathing nymphs are invitations to sin; Milton's bathing is displaced into companionate marriage.

This is the single most explicit one-epic-answering-another-epic relationship in the English tradition. Milton is *writing Eden in conscious response to the Bower*. Every visible design-choice Milton makes for the unfallen Eden is a direct inversion of a design-choice Spenser made for the fallen Bower. The cross-reference is not decoration; it is foundational. To read Paradise Lost IV without Faerie Queene II.xii is to miss what Milton is doing.

The critical consensus on the relationship is settled — see C. S. Lewis, *A Preface to Paradise Lost* (1942), who articulated it most forcefully, though it had been observed from the 18th century onward. A modern reader who reads both passages can confirm it without scholarly intermediation.

Spenser describes the Bower's beauty in full knowledge that he is about to destroy it. Milton describes Eden's beauty in full knowledge that we have already lost it. Both poems are composing beauty as an elegy.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Paradise Lost IV.131–287 is Milton's conscious rewriting of this canto. Every visual detail of the Bower is inverted in Milton's Eden: art-pretending-to-be-nature becomes nature-exceeding-any-art; the carpe-rosam song becomes pre-lapsarian abundance; the bathing nymphs become companionate labor. The single most important cross-reference in the Tome catalog's English-epic line.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IV, lines 131–287",
        targetBookId: "paradise-lost",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 7. Two naked damsels bathing ──────────────────────────────────
  {
    id: "fq-2-12-bathing-damsels",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Two naked Damzelles he therein espyde",
    anchorOccurrence: 1,
    title: "Two naked damsels bathing — Ariosto's Alcina re-voyeured",
    quotedPassage:
      "Two naked Damzelles he therein espyde, / Which therein bathing seemed to contend / And wrestle wantonly, ne car'd to hyde / Their dainty partes from vew of any which them eyd.",
    passageReference: "Book II canto xii, stanza 63",
    commentary: `The bathing-damsels scene is one of the poem's most-discussed passages. Spenser shows Guyon (and the reader) two naked women wrestling in a fountain; the women notice Guyon watching and, rather than retreating, display themselves further. Guyon's gaze lingers; the Palmer rebukes him; Guyon recovers.

The classical source is Ovid — Diana at her bath, and the hunter Actaeon who sees her (Metamorphoses III.155–252). Ovid's Actaeon is punished for seeing by being turned into a stag and killed by his own hounds. The Ovidian frame is: seeing the goddess's nakedness is fatal.

The immediate formal source, however, is Ariosto — Orlando Furioso VII.31–32, where Alcina appears to Ruggiero in a vision of bathing-nymph beauty that leads him into her enchantment. Ariosto's Alcina is the pleasurable-illusion-that-ruins; Spenser's bathing damsels are her descendants in a direct formal line.

Critical debate centers on Guyon's response. The poem says his "sparkling face" and "inflamed hart" visibly register the attraction; the Palmer has to verbally recall him to his quest. This is the most famous moment in Book II where Guyon's temperance is *seen to be tested rather than automatic*. A later school of critics — most influentially Stephen Greenblatt (*Renaissance Self-Fashioning*, University of Chicago Press 1980, chapter 4 "To Fashion a Gentleman") — argues that Spenser writes temperance as an *achieved* virtue built out of resisted temptations, and that the passage stages that achievement by letting the reader see the temptation's pull on the hero.

The reader's experience, in working this stanza, should be: the narrative is voyeuristic (we *do* see the damsels in detail through Guyon's eyes), and then the Palmer's rebuke turns the voyeurism into a moral test. Spenser has written the scene honestly: the pleasure is real, and the Palmer's correction is also real. Neither cancels the other. The temperance Guyon will need to destroy the Bower in a few stanzas is the temperance he builds in this stanza by looking, being recalled, and continuing.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Orlando Furioso VII.31–32 — Ruggiero's first vision of Alcina, beautiful, surrounded by bathing attendants. The direct formal model for Spenser's bathing-damsels scene. Ariosto does not moralize the gaze; Spenser adds the Palmer's rebuke as installed Protestant commentary.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Canto VII, stanzas 11–32",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 7,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Ovid's Metamorphoses III.155–252 — Actaeon's sight of Diana at her bath, punished by transformation into a stag. The classical moral: seeing the goddess's nakedness is fatal. Spenser's scene preserves the seeing-as-test frame but makes recovery (via the Palmer) possible.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book III, lines 155–252",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 8. Acrasia and Verdant — Alcina/Ruggiero inheritance ──────────
  {
    id: "fq-2-12-acrasia-verdant",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Verdant (so he hight)",
    anchorOccurrence: 1,
    title: "Acrasia and Verdant — Alcina and Ruggiero inherited, then severed",
    quotedPassage:
      "But Verdant (so he hight) he soone untyde, / And counsell sage in steede thereof to him applyde.",
    passageReference: "Book II canto xii, stanza 82",
    commentary: `The scene of Acrasia reclining with her fainted lover is the single most direct Ariostan transposition in the canto. Alcina and Ruggiero in *Orlando Furioso* VI–VIII: the enchantress has seduced the knight, lulled him into pleasurable forgetfulness, and holds him from his quest. Bradamante and Melissa arrive; Ruggiero is freed; Alcina's true hideous form is revealed; the illusion falls.

Spenser transposes the whole structure. *Acrasia* — the Greek word *ἀκρασία* meaning "incontinence," specifically the Aristotelian ethical term for the failure of moral self-control — is Alcina in Protestant guise. *Verdant* — from Latin *viridis*, "green," i.e. young, unripe, fresh — is Ruggiero. The Palmer (Reason) is Melissa's function. The binding-and-freeing action is mechanically identical.

What Spenser changes is the theology and the register. Ariosto is forgiving; Ruggiero's entanglement is a matter of erotic error that any noble knight could fall into, and when Bradamante and Melissa rescue him, he shakes off the shame without lasting damage. Spenser's Verdant is *shamed* — he falls asleep with his armor hanging on a nearby branch ("His warlike armes, the ydle instruments / Of sleeping praise, were hong upon a tree") — and the Palmer's untying is a quieter, soberer act than Melissa's. Spenser has read Ariosto and moved the pleasure and the shame closer together.

Then Spenser does what Ariosto does not. Guyon and the Palmer *do not simply leave*. They destroy the entire Bower. Ariosto's Ruggiero-frees-himself-and-moves-on is replaced by Spenser's Guyon-frees-the-captive-and-annihilates-the-prison. That is the Book II climactic difference. Where Ariosto trusts the knight's personal recovery to suffice, Spenser demands the eradication of the temptation's environment. This theological escalation — and the violence required to enact it — is what the next annotation addresses.

The specific palette continuity with Alcina is flagged in src/data/faerie-queene/speakers.ts: Acrasia carries the iridescent-rose-shifting-to-crimson register that Alcina carries, because the allegorical figure is the same figure under different theological governance. The reader moving through the Great Epics library chronologically should *feel* the visual inheritance — Acrasia's palette reads Alcina-like on purpose.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Orlando Furioso VI–VIII — the Alcina-Ruggiero sequence. The single most direct formal source for Acrasia-Verdant. Spenser's Greek-derived name Acrasia (incontinence, Aristotelian ἀκρασία) is the moral-philosophical retitling of Ariosto's Alcina. The palette continuity is explicit and deliberate.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Cantos VI–VIII (Alcina's island)",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 7,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological", "philosophical"],
  },

  // ── 9. The subtile net — Vulcan/Mars/Venus ────────────────────────
  {
    id: "fq-2-12-subtile-net",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "A subtile net, which only for that same",
    anchorOccurrence: 1,
    title: "The \"subtile net\" — Vulcan's Ovidian trap repurposed for virtue",
    quotedPassage:
      "Upon a bed of Roses she was layd, / As faint through heat, or dight to pleasant sin […] / And eke through feare as white as whales bone; / Her snowy brest was bare to ready spoyle / Of hungry eies, which n'ote therewith be fild; / And yet, through languour of her late sweete toyle, / Few drops, more cleare then Nectar, forth distild, / That like pure Orient perles adowne it trild; / And her faire eyes, sweete smyling in delight […] They on them rusht, and threw / A subtile net, which only for that same / The skilfull Palmer formally did frame",
    passageReference: "Book II canto xii, stanzas 77–81",
    commentary: `The net Guyon and the Palmer throw over Acrasia and the sleeping Verdant is the net Vulcan forges to trap his wife Venus with her lover Mars in Ovid's Metamorphoses IV.171–189. Ovid's story: the Sun-god informs Vulcan of Venus's adultery; Vulcan forges an invisible adamantine net; he catches the lovers; he calls the other gods to witness their shame.

The Ovidian reference tells the reader something precise about what Guyon and the Palmer are doing. They are Vulcan — the offended spouse, the craftsman-god — catching adulterers. The allegorical frame: temperance (the Palmer = Reason, the smith) catches incontinence (Acrasia = Venus in her adulterous aspect) in the very act, to expose it to general shame.

But the reference also raises a problem. Vulcan's net in Ovid is the comedy's setup: the gods arrive to witness, and Apollo and Mercury joke that they would gladly trade places with Mars. The Ovidian adultery is *funny*, and the Vulcan-the-cuckolded-husband is a figure of mild ridicule. Spenser is not writing a comedy. He wants the net to function morally: to bind vice in its act, for the sobering witness of the temperate reader.

The tension is the Bower's characteristic tension. Spenser is deploying comic-Ovidian machinery for Protestant-moral ends, and the friction shows. A reader who brings Ovid to Spenser's stanza hears the comedy Spenser is trying to mute. That the net is *adamantine* and *Palmer-forged* rather than *Vulcan-forged* is Spenser's attempt to suppress the Ovidian comedy. It mostly works; it does not entirely work.

This is the kind of moment where the Bower of Bliss is more complicated than its overt polemic. Spenser's inherited materials (Ovid, Ariosto, Tasso) are not always obedient to Protestant discipline, and the seams of the allegorical project show. A close reader can see Spenser working — see him *managing* Ovid, not merely using him — and the management is part of what makes the canto the set-piece it is.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Ovid's Metamorphoses IV.171–189 — Vulcan's net trapping Venus and Mars in adultery, exposed to the gods' laughter. Spenser's net is built from the Ovidian template; the comedy of the source strains against the moral gravity Spenser intends.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book IV, lines 171–189",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 10. Guyon destroys the Bower — the critical debate ────────────
  {
    id: "fq-2-12-destroys-bower",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Guyon broke downe with rigour pittilesse",
    anchorOccurrence: 1,
    title: "\"With rigour pittilesse\" — the most debated stanza in the poem",
    quotedPassage:
      "But all those pleasaunt bowres, and Pallace brave, / Guyon broke downe with rigour pittilesse; / Ne ought their goodly workmanship might save / Them from the tempest of his wrathfulnesse, / But that their blisse he turn'd to balefulnesse: / Their groves he feld, their gardins did deface, / Their arbers spoyle, their Cabinets suppresse, / Their banket houses burne, their buildings race, / And, of the fayrest late, now made the fowlest place.",
    passageReference: "Book II canto xii, stanza 83",
    commentary: `This stanza is, by critical consensus, the most contested in *The Faerie Queene*. The problem: Guyon, the knight of Temperance, destroys the Bower with a violence the poem names as *pitilesse*, *wrathfull*, *tempest*. Temperance is the virtue of moderation, of the golden mean, of *not* the extreme. How can the temperate knight exit the canto in a rage?

The orthodox reading treats the destruction as necessary and just. The Bower is an evil that cannot be reasoned with; it must be annihilated. Temperance is not a passive virtue; it requires active destruction of what corrupts. This is the reading present in the Spenser scholarship of the first half of the 20th century.

The influential revisionist reading comes from Stephen Greenblatt, *Renaissance Self-Fashioning: From More to Shakespeare* (University of Chicago Press, 1980), chapter 4 "To Fashion a Gentleman," which reads the destruction as Protestant-colonial violence — the self-fashioning of the Elizabethan gentleman as a project that requires the violent erasure of the desires it claims to master. Greenblatt's argument is that *temperance is built through destruction*; the temperate self is constituted precisely by what it must repeatedly destroy in order not to become. The energy of the destruction is the temperate self's own repressed desire, redirected outward. On this reading, Guyon's fury is diagnostic — it reveals what temperance had to suppress to achieve itself.

The Greenblatt reading is widely taught; it is also widely contested. A counter-revisionist school (associated with Harold Bloom's early work and more recently with Paul Alpers) argues that Spenser's ambivalence about the destruction is the point — that the stanza is written with deliberate tonal instability, asking the reader to both affirm the destruction and feel its cost. On this reading, Spenser is neither endorsing Guyon uncritically nor subverting him; he is writing a virtue-in-action with full awareness that its action is not clean.

A modern reader can hold the complexity without resolving it. Spenser wrote a stanza in which a knight destroys beauty, and the stanza uses ugly words — *tempest*, *wrathfulnesse*, *race* (i.e., raze), *fowlest* — to describe the destruction of what had been the *fayrest*. The poem registers the cost. Whether that registration is critical of Guyon, consonant with him, or merely honest about the violence temperance requires, is the debate the stanza has sustained for four hundred years. The Greenblatt citation above is verified; further debate lives in the secondary literature listed in any modern scholarly edition (Hamilton, Longman; A. C. Hamilton, Oxford).

The stanza's one unambiguous feature: it is a formally brilliant Spenserian stanza. The alexandrine closes: "*And, of the fayrest late, now made the fowlest place.*" The summative ninth line turns the whole stanza with a compressed irony — Spenser's characteristic closing gesture, used here for a moment whose moral content the form declines to stabilize.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Stephen Greenblatt, 'Renaissance Self-Fashioning: From More to Shakespeare' (University of Chicago Press, 1980), chapter 4 'To Fashion a Gentleman'. The revisionist reading of Guyon's destruction as Protestant-colonial violence reproducing the self it claims to master. The most influential 20th-century critical treatment of the stanza; directly named because verified.",
        workTitle: "Renaissance Self-Fashioning",
        workAuthor: "Stephen Greenblatt",
        passageReference: "Chapter 4, 'To Fashion a Gentleman'",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },

  // ── 11. "Let Gryll be Gryll" — the Circe-tradition closing ────────
  {
    id: "fq-2-12-let-gryll-be-gryll",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Let Gryll be Gryll",
    anchorOccurrence: 1,
    title: "\"Let Gryll be Gryll\" — Plutarch's Circe-in-reverse",
    quotedPassage:
      "The donghill kinde / Delightes in filth and fowle incontinence: / Let Gryll be Gryll, and have his hoggish minde; / But let us hence depart whilest wether serves and winde.",
    passageReference: "Book II canto xii, stanza 87 (the book's final stanza)",
    commentary: `Book II closes on one of the most memorable lines in English poetry, and the reference is specific. *Gryll* is a character in Plutarch's dialogue *Gryllus, or Whether Beasts Have Reason* (*Bruta animalia ratione uti*, one of the *Moralia*), in which a man whom Circe has transformed into a pig argues, against Odysseus, that he prefers his pig-existence to his former humanity. Plutarch's dialogue stages the philosophical question: is the life of uncomplicated animal appetite actually superior to the human life of rational complication?

In Plutarch's dialogue, Gryll wins the argument — or at least Odysseus does not answer him persuasively. The pig makes a compelling case for the honest satisfaction of instincts against the constant unsatisfactory striving of rational human desires. Plutarch leaves the argument unresolved; the point is that the Circean transformation is not simply bad for those who undergo it.

Spenser's conclusion to Book II *refuses Plutarch's ambiguity*. When Guyon and the Palmer transform Acrasia's bestial lovers back into human shape, one of them — Gryll — rejects the transformation and wishes to be returned to pig form. The Palmer shrugs: *let Gryll be Gryll*. Book II's final word is that some creatures prefer the dunghill to the soul; temperance has its limits; not everyone wants to be saved.

This is the darkest ending Spenser has written so far in the poem. Book I ended with Redcrosse's betrothal to Una — a celebratory close. Book II ends with a partial refusal of redemption. Temperance has been vindicated in the destruction of the Bower, but one of the Bower's inhabitants will not leave it. The alexandrine — "But let us hence depart whilest wether serves and winde" — has the Palmer turning his back on Gryll, and the book turning its back on the difficulty Plutarch raised. The problem Plutarch posed is not answered; it is walked away from.

The two Book VII Mutabilitie Cantos, written a decade later, end with the "unperfite" stanzas praying for eternal rest. The tonal trajectory of Spenser's career runs from Book I's celebratory close → Book II's resigned walking-away → the Mutabilitie fragment's exhausted prayer. The closings darken; Spenser is increasingly honest about what his allegorical project cannot resolve.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Plutarch's 'Gryllus, or Whether Beasts Have Reason' (Moralia), the dialogue in which Gryll — a man whom Circe has transformed into a pig — argues that pig-life is superior to human-life. Odysseus does not convincingly rebut him. Spenser's 'let Gryll be Gryll' is a direct Plutarchan allusion.",
        workTitle: "Moralia (Bruta animalia ratione uti)",
        workAuthor: "Plutarch",
        passageReference: "Moralia 985D–992E",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Homer's Odyssey X — Circe transforms Odysseus's men into swine and then (persuaded by Odysseus) restores them to human form. In Homer all the men want to be restored. Plutarch's Gryll — and Spenser's — is the dissenting voice Homer's scene does not include.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book X, lines 203–399",
        targetBookId: "the-odyssey",
        targetChapterNumber: 10,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical", "literary-influence"],
  },

  // ── 12. Bower → Eden: the demo-critical cross-reference ───────────
  {
    id: "fq-2-12-bower-to-eden",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "Verdant (so he hight)",
    anchorOccurrence: 2,
    title: "The Bower → Eden bridge — how to read Milton's garden against Spenser's",
    quotedPassage:
      "But Verdant (so he hight) he soone untyde",
    passageReference: "Book II canto xii, stanza 82 (repeat anchor at second occurrence)",
    commentary: `A concluding annotation specifically on the Bower → Eden cross-reference for readers who plan to read *Paradise Lost* after *The Faerie Queene*.

Spenser writes the Bower of Bliss in 1596 as the climax of Book II — a garden that is *morally fallen and physically artificial*, containing a seductive enchantress, a fainted captive lover, a carpe rosam song, bathing nymphs, a false Genius at the gate, and deliberately-contrived natural ornament (gilded bowers, painted flowers, marble fountains, "art striving to compare with nature"). Guyon destroys it.

Milton writes Eden in the 1660s as the climax of Paradise Lost Book IV — a garden that is *morally unfallen and metaphysically natural*, containing a primordial married couple, no song of urgency, companionate labor, no gate-keeper except angels above, and deliberately-*uncontrived* abundance ("nature boon / Poured forth profuse on hill and dale and plain, / Flowers of all hue, and without thorn the rose"). Satan will cause it to be lost.

The catalogue of inversions is systematic:
- *Art imitating nature* (Spenser) vs. *nature exceeding any art* (Milton)
- *Walled by false cunning* vs. *walled by a living hedge*
- *A rose to be gathered before it fades* vs. *a rose without thorn*
- *Bathing nymphs as temptation* vs. *conjugal companionship in labor*
- *A fainted lover shamed* vs. *Adam and Eve walking upright together*
- *A false Genius at the gate* vs. *angelic guardians above*
- *Destroyed at the end of Book II* vs. *not yet lost but about to be lost*

The relationship is not influence-in-general but one specific poem answering another. Milton had read Spenser carefully and said so; in *Areopagitica* (1644) he calls Spenser *"a better teacher than Scotus or Aquinas,"* citing by name "our sage and serious poet Spenser" and the very Bower of Bliss stanzas as having taught him what Christian virtue is. Milton's Eden is what Spenser's Bower *would have been* had humanity not fallen — and what Milton's readers are about to watch be lost for the first time in narrative order.

A reader who has worked this Bower-of-Bliss cluster is prepared to read Paradise Lost IV with double vision: the Eden on the page and the Bower beneath it. Milton's unfallen paradise reads differently after Spenser's fallen one; Spenser's destroyed artifice reads differently after Milton's inviolable nature. The two set-pieces are one of the great English literary conversations; read in sequence, each poem teaches what the other is doing.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Milton's Paradise Lost IV — Eden described in direct conscious response to the Bower of Bliss. Every element of the Bower inverted: art→nature, walled-by-cunning→walled-by-living-hedge, rose-to-gather→rose-without-thorn, bathing-nymphs→companionate-labor, false-Genius→angelic-guardians. THE single most important inter-work cross-reference in the Great Epics library.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IV, lines 131–287",
        targetBookId: "paradise-lost",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Milton's Areopagitica (1644) — Milton directly names Spenser as his moral teacher, citing the Bower of Bliss stanzas as the test of what true Christian virtue means: 'our sage and serious poet Spenser, whom I dare be known to think a better teacher than Scotus or Aquinas, describing true temperance under the person of Guyon, brings him in with his palmer through the cave of Mammon and the bower of earthly bliss, that he might see and know, and yet abstain.' The acknowledgment is in Milton's own words.",
        workTitle: "Areopagitica",
        workAuthor: "John Milton",
        passageReference: "Areopagitica, 1644",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  // ── 13. The book's final word: unfortunate birds ──────────────────
  {
    id: "fq-2-12-unfortunate-birds",
    bookId: "the-faerie-queene",
    chapterNumber: 25,
    anchorText: "the nation of unfortunate",
    anchorOccurrence: 1,
    title: "The unfortunate birds — Ovid, Dante, Spenser's ecology of transformation",
    quotedPassage:
      "Even all the nation of unfortunate / And fatall birds about them flocked were, / Such as by nature men abhorre and hate; / The ill-facste Owle, deaths dreadfull messengere; / The hoars Night-raven, trump of dolefull drere",
    passageReference: "Book II canto xii, stanza 36",
    commentary: `A small coda on the ecological dimension of the Bower of Bliss, and a bridge to a reading that is less foregrounded in the scholarship.

When Guyon and the Palmer approach Acrasia's island, they pass — among the other dangers — a "flock of unfortunate" birds: owls, night-ravens, cormorants, "the whistler shrill." The catalogue is Ovidian; Ovid's Metamorphoses repeatedly ends human stories in bird-transformation (Tereus, Progne, Philomela; Ceyx and Alcyone), and the tradition inherits through Dante (the Harpies of *Inferno* XIII) into Renaissance allegorical gardens. Spenser's birds are Ovidian bird-transformations of unfortunate humans, continuing their lives in an avian form that carries their mortal grief.

This reads, in the allegorical frame, as a coda to the Circean transformation theme that will dominate the canto's ending (Acrasia's human lovers turned to beasts, the Gryll episode). The birds are *former humans* — people who were once loving or wronged or seeking something, caught in permanent transformation. The island is populated with the traces of prior visitors; Guyon is not the first knight to arrive, and the birds attest that prior arrivals did not leave human.

There is a Virgilian source too — the catabasis of Aeneid VI (the entrance to the underworld is surrounded by mournful birds, shapes of the unburied dead). Spenser is composing his Bower's approach as a kind of pagan-Christian underworld-descent: temperance must pass into the land of the dead (birds-that-were-humans) to reach and destroy Acrasia. The approach is *katabatic*.

This is not a reading that gets equal airtime to the Paradise-Lost inheritance in the Bower scholarship, but it is available, and a reader who has read Virgil's Aeneid VI notices the bird-ecology as descent-marker. The island is the underworld Guyon must enter; the destruction of the Bower is the harrowing; Gryll's refusal to leave is the soul that remains in hell by choice.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid VI — the catabasis (underworld descent). The entrance to Hades is surrounded by mournful birds and shapes; Spenser composes the approach to Acrasia's island as a katabatic entry, with the unfortunate birds signaling descent into a realm of transformed-human dead.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 268–294",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Ovid's Metamorphoses — the long tradition of human-to-bird transformations (Tereus, Progne, Philomela; Ceyx and Alcyone; the Harpies). Spenser's unfortunate birds are Ovidian transformations continuing their mortal grief in avian form; the ecology of the island is populated with the traces of prior human visitors.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "passim, esp. VI.424–674 (Tereus, Progne, Philomela); XI.410–748 (Ceyx and Alcyone)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
]
