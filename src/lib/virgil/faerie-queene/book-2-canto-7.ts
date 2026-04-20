import type { Annotation } from "../types"

// ── The Faerie Queene — Book II · Canto VII ───────────────────────────
// The Cave of Mammon — Guyon's three-day descent into the underworld
// cave of the money-god, the most concentrated philosophical sequence
// in Book II. Temperance's longest and most sustained test: Guyon is
// shown wealth, power, and the forbidden fruit of Proserpina's garden,
// and declines all three. Hand-authored scholarly annotations; Standard
// Ebooks text (selectively modernized from the 1596 quarto). Chapter
// index post-canto-split: ch-20 in public/content/the-faerie-queene/.
//
// Density: 13 annotations. Opus-grade per spec Part 4 — one of the ten
// named Opus clusters.
//
// The canto is Spenser's most ambitious katabasis (underworld descent),
// combining Homeric, Virgilian, and Dantean underworld-material with
// the Gospel's warning against Mammon ("ye cannot serve God and
// mammon," Matthew 6:24). Milton's Mammon in Paradise Lost II is a
// direct descendant — Milton's debt here is acknowledged and explicit.
//
// The cluster traces: (1) The epic-simile opening and Guyon's
// solitude; (2) Mammon introduced as uncouth wight; (3) Mammon's
// self-declaration; (4) The first temptation (wealth); (5) The porch
// of hell personifications; (6) The House of Riches and its gold-
// working; (7) Philotime and the chain of Ambition — second
// temptation; (8) The Garden of Proserpina; (9) The classical apple-
// parade (Hercules / Atalanta / Acontius); (10) Pilate and Tantalus
// in Cocytus; (11) The biblical Mammon and Matthew 6:24; (12) The
// three-day descent's theological structure; (13) Milton's Mammon
// as the direct Miltonic descendant.

export const FAERIE_QUEENE_BOOK_2_CANTO_7: Annotation[] = [
  // ── 1. The pilot simile opening ───────────────────────────────────
  {
    id: "fq-2-7-pilot-simile",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "As pilot well expert in perilous wave",
    anchorOccurrence: 1,
    title: "\"As pilot well expert\" — epic simile opening the canto",
    quotedPassage:
      "As pilot well expert in perilous wave, / That to a stedfast starre his course hath bent, / When foggy mistes or cloudy tempests have / The faithfull light of that faire lampe yblent, / And cover'd heaven with hideous dreriment, / Upon his card and compas firmes his eye, / The maysters of his long experiment, / And to them does the steddy helme apply",
    passageReference: "Book II canto vii, stanza 1",
    commentary: `Spenser opens canto vii with an epic simile — the first technical-navigational simile in the poem. Guyon is compared to a pilot (ship's navigator) who, when fog obscures his guiding star, steers by card (sea-chart) and compass. The simile's allegorical application: Guyon has been separated from the Palmer (his guide / Reason) at the end of canto vi and is now entering a new test alone, relying on practiced judgment rather than an external guide.

The figure descends from Virgil, where Aeneas is repeatedly compared to a pilot navigating treacherous seas. But Spenser's 1596 navigational-technical specifics — the *card* (printed sea-chart, relatively new technology in 1590s England), the *compas* (magnetic compass), and their pairing — are deliberately modern. Spenser is writing the Elizabethan-English navigational experience into his epic simile. English sea-power in the 1590s was ascendant; the Armada defeat was eight years past; English readers of 1596 would recognize their own mariners in the figure.

The theological register is also specific. The pilot has lost sight of his "faithfull light" (the guiding star, allegorically the Palmer / Reason) and must steer by the inscribed and instrumental resources that remain (card / compass, allegorically the internal memory of the virtue's discipline). Virtue, tested in absence-of-guide, is what canto vii will examine. Guyon will move through Mammon's temptations without Reason beside him, and the question the canto asks is whether *interiorized* temperance (the virtue as habitus, not as ongoing tutelage) can withstand what external guides are not present to defend.

A minor but telling detail: the first canto after Guyon's loss of the Palmer opens with a technical-professional simile rather than a mythological one. The register is pragmatic. Temperance is being staged here as a skill exercised alone, not as doctrine applied in community. That framing is Spenser's claim about how tested virtue works.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid repeatedly uses the pilot-simile for heroes navigating dangers. Spenser's opening simile is the Virgilian technique transposed into Elizabethan-English navigational particulars (card, compass, 16c English seamanship).",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book III passim; Book V.1–34",
        targetBookId: "the-aeneid",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 2. Mammon introduced ──────────────────────────────────────────
  {
    id: "fq-2-7-mammon-introduced",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "An uncouth, salvage, and uncivile wight",
    anchorOccurrence: 1,
    title: "Mammon as \"uncouth, salvage, and uncivile wight\" — the god disguised",
    quotedPassage:
      "In secret shadow from the sunny ray, / On a great heap of gold, that round him lay, / An uncouth, salvage, and uncivile wight, / Of griesly hew and fowle ill favour'd sight",
    passageReference: "Book II canto vii, stanzas 3–4",
    commentary: `Spenser's Mammon is first seen counting gold on a heap in a shadowed spot, and Spenser's description of him is *deliberately unflattering*. He is "uncouth" (strange, unknown), "salvage" (savage, uncultivated), "uncivile" (uncivil, crude), with a "griesly hew" (grim color) and "fowle ill favour'd sight" (ugly). The money-god does not appear in Spenser in the glamorous guise one might expect of a god of wealth. He appears grubby, half-troll, hoarding.

The descriptive choice is theological. Spenser's Protestant moral-satirical tradition reads *avarice* (love of money) as a vice that makes its practitioners physically and morally ugly. Medieval moralists (Chaucer's Pardoner, Langland's Avarice in Piers Plowman) depicted the miser's degradation physically — the vice writes on the body. Spenser inherits the tradition and applies it to Mammon directly: the god of wealth *looks* like his worshippers after they have been shaped by him.

The contrast with classical-humanist depictions of Plutus (Greek Πλοῦτος, the god of wealth in Greek mythology, often genealogized as the son of Demeter and Iasion) is pointed. Aristophanes's *Plutus* (c. 388 BCE) personifies wealth; Renaissance emblem books often depicted Plutus as blindfolded and richly adorned. Spenser's Mammon is not this classical figure; he is a Jewish-Christian-moralist figure, named from the New Testament rather than from Greek tradition.

Note how different Mammon is from Archimago (Book I's sorcerer): Archimago *disguises* as holiness, looks distinguished, fools the knight. Mammon does not disguise — he is what he is, openly grim. The test of Mammon's cave is not a test of seeing-through-disguise (the Archimago test); it is a test of *refusing-what-is-openly-offered*. Guyon will have no trouble recognizing what Mammon is; the question will be whether he can decline what Mammon offers even when the offer is honest.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Matthew 6:24 / Luke 16:13 — 'No man can serve two masters... Ye cannot serve God and mammon.' The New Testament personification of wealth as a rival god, which gives Spenser's figure his name. *Mammōnás* in Greek transliterates an Aramaic word for wealth/money, treated in the Gospel text as proper name.",
        workTitle: "The Bible (Matthew, Luke)",
        workAuthor: "St. Matthew, St. Luke",
        passageReference: "Matthew 6:24; Luke 16:13",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Chaucer's Pardoner's Tale — avarice personified and shown as moral destroyer. Langland's Piers Plowman contains a similar figure of 'Avaryce.' Spenser's Mammon is in the medieval-moral-satirical tradition these earlier English poets established.",
        workTitle: "The Canterbury Tales (Pardoner's Tale)",
        workAuthor: "Geoffrey Chaucer",
        passageReference: "The Pardoner's Tale",
        targetBookId: "the-canterbury-tales",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical", "literary-influence"],
  },

  // ── 3. Mammon's self-declaration ──────────────────────────────────
  {
    id: "fq-2-7-mammon-declares-self",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "Great Mammon, greatest god below the skye",
    anchorOccurrence: 1,
    title: "\"Greatest god below the skye\" — Mammon's self-declaration",
    quotedPassage:
      "'God of the world and worldlings I me call, / Great Mammon, greatest god below the skye, / That of my plenty poure out unto all, / And unto none my graces do envye: / Riches, renowme, and principality, / Honour, estate, and all this worldes good'",
    passageReference: "Book II canto vii, stanza 8",
    commentary: `Mammon describes himself in terms that, read carefully, are a parodic inversion of Christian divine self-declaration. The Christian God of the 1590 Protestant imagination is the creator of all, the giver of grace, the provider of "all the Earth is the Lord's." Mammon claims to be "god of the world and worldlings" — this-world only, for its this-worldly inhabitants — and to "pour out [his] plenty unto all" and "envy none [his] graces."

The parody: Mammon's self-description *sounds scriptural* (God's plenty; God's gracious generosity). But the reach is deliberately limited — "below the skye," "of the world," for "worldlings." Mammon rules the sublunary, terrestrial, mercantile realm; he does not claim heaven. He is not pretending to be the Christian God; he is pretending to be the honest alternative — a god you can serve *instead of* the Christian God, to receive this-world's goods rather than the next-world's.

This is theologically precise. Matthew 6:24 ("Ye cannot serve God and mammon") does not describe mammon as *false*; it describes him as *rival*. You can serve either, not both. Spenser's Mammon embraces the scriptural framing — yes, I am rival to your God; serve me instead and receive these goods. The canto's challenge is that Mammon's offer is *genuinely* available; he really does give wealth to those who serve him, and his devotees really do accumulate what he promises. The test is not whether Mammon is lying; the test is whether Guyon prefers the rewards of temperance to the rewards of wealth.

Mammon's claim that he envies no one his graces — *unto none my graces do envye* — is particularly sharp. Christian grace is by-God's-choice (election); Mammon's "graces" are by-Mammon's-choice-to-give-universally. Mammon, by offering his goods to all without restriction, is positioning himself as *more generous than God*. The polemic is that Mammon's open-handed distribution of wealth is, in the spiritual economy, a form of false largesse — distributing this-world's goods at the cost of next-world's. The seeming generosity is the trap.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Matthew 6:19–24 — 'Lay not up for yourselves treasures upon earth... Ye cannot serve God and mammon.' The Gospel passage against which Mammon's self-declaration is composed. Spenser's Mammon is the personified alternative-god that Matthew 6:24 warns against.",
        workTitle: "The Bible (Matthew)",
        workAuthor: "St. Matthew",
        passageReference: "Matthew 6:19–24",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological"],
  },

  // ── 4. Guyon's first refusal — "give me my own" ───────────────────
  {
    id: "fq-2-7-guyon-refusal",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "Riches, renowme, and principality",
    anchorOccurrence: 1,
    title: "Guyon's first refusal — temperance declines what it has not earned",
    quotedPassage:
      "'Riches, renowme, and principality, / Honour, estate, and all this worldes good.' ... [Guyon answers:] 'Me ill besits, that in derdoing armes, / And honours suit my vowed dayes do spend, / Unto thy bounteous baytes and pleasing charmes, / With which weake men thou witchest, to attend'",
    passageReference: "Book II canto vii, stanzas 8–10",
    commentary: `Mammon offers Guyon, as the first temptation, the full catalogue of wealth and worldly goods: *Riches, renowme, and principality, honour, estate, and all this worlds good*. Guyon declines by explaining his vocation — he is a knight dedicated to arms and honor, not to wealth.

The refusal is interesting because Guyon does *not* argue that wealth is bad. He argues that wealth is *not his vocation*. "Me ill besits" (it ill befits me) to receive these goods; his days are vowed to martial honor. The theological register is tactfully limited: Guyon does not preach Matthew 6:24; he declines on vocational grounds. The temperate knight does not need abstract anti-wealth doctrine; he has a *calling* that makes wealth beside the point.

This is one of Spenser's most sophisticated temperance moments. Temperance is frequently misread as abstract moderation ("have a little of everything, not too much of anything"). Spenser's Guyon is not moderate-in-wealth; he is *refusing-wealth-entirely* because it is not what his life is shaped around. Temperance here is *vocational discipline*, not middle-way compromise. The knight of Temperance is not the knight who takes a little of Mammon's gold; he is the knight who takes *none* because his vocation does not call for it.

The vocabulary is telling. *Witchest* — Mammon "witches" (bewitches) weak men. The verb frames wealth-desire as *enchantment* or *magical seduction* — the weak are *spellbound* by wealth's glamour. Guyon, as a dedicated knight, is not susceptible to the spell because his attention is fully committed to his quest. The analogy is almost physical: a properly-committed life *repels* Mammon's enchantment, much as a soul in prayer repels sensual distraction. The temperance is not white-knuckle refusal; it is a life so full of its purpose that temptation has nothing to latch onto.

This vocational framing is what saves Book II from being merely ascetic. Spenser is not writing against wealth *in general*; he is writing for a fully-inhabited life whose commitments leave no room for Mammon. A life organized around vocation is a life Mammon cannot reach.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Book I canto iv (the House of Pride) and Book II canto iv (the Furor / Occasion binding) both work variations of the vocational-refusal pattern: virtue defined by what the knight is *doing* rather than by abstract prohibition. Canto vii is this pattern's most articulate statement.",
        workTitle: "The Faerie Queene (Book II canto iv)",
        workAuthor: "Edmund Spenser",
        passageReference: "Book II canto iv",
        targetBookId: "the-faerie-queene",
        targetChapterNumber: 17,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical"],
  },

  // ── 5. The porch of hell — the personifications at the gate ───────
  {
    id: "fq-2-7-porch-of-hell",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "Cruell Revenge, and rancorous Despight",
    anchorOccurrence: 1,
    title: "The porch of hell — personifications at Mammon's gate",
    quotedPassage:
      "That houses forme within was rude and strong, / Lyke an huge cave, hewne out of rocky clifte, / From whose rough vaut the ragged breaches hong, / Embost with massy gold of glorious gifte, / And with rich metall loaded every rifte, / That heavy ruine they did seeme to threatt; ... / Before the dore sat selfe-consuming Care, / Day and night keeping wary watch and ward, / For feare least Force or Fraud should unaware / Breake in, and spoile the treasure there in gard ... / On th'other side in one consort there sate / Cruell Revenge, and rancorous Despight, / Disloyall Treason, and hart-burning Hate, / But gnawing Gealosy",
    passageReference: "Book II canto vii, stanzas 20–22",
    commentary: `At the entrance to Mammon's subterranean house stands a gallery of personifications that Spenser has carefully selected. The first group, on one side of the door: *Selfe-consuming Care* (anxious watchfulness over treasure), *Feare*, *Force* and *Fraud* (the dangers Care anticipates). On the other side: *Cruell Revenge*, *rancorous Despight*, *Disloyall Treason*, *hart-burning Hate*, *gnawing Gealosy*.

These are not random vices; they are specifically the *social consequences of wealth*. Spenser's allegorical logic: wealth produces *anxiety-for-wealth* (Care); wealth makes you a target, producing *fear-of-violence* (Fear) and *fear-of-cheating* (Force and Fraud); wealth produces interpersonal toxicity among its possessors — *revenge* for perceived slights, *spite* toward rivals, *treason* by those you trusted, *hate* of the unequal, *jealousy* of others' wealth.

The portrait is extraordinary in its social precision. Spenser is not describing hell in general; he is describing the *specific psychological ecosystem that wealth creates around its possessors*. A modern reader recognizes the catalogue — the same vices still cluster around accumulated wealth. The stanza is not dated theology; it is observational social psychology.

The literary source is Virgil's entrance to the underworld in Aeneid VI.273–281, which similarly names personifications that stand at the gate: *Luctus* (Grief), *Curae* (Cares), *Morbi* (Diseases), *Metus* (Fear), *Fames* (Hunger), *Egestas* (Poverty), *Labor* (Labor). Spenser's gallery is built on Virgil's template, but Virgil's personifications are human sufferings in general; Spenser's are the specific sufferings of *the wealthy*. The Virgilian tradition is repurposed into a more targeted polemic.

Milton's Paradise Lost II will take the Virgilian-Spenserian personification-gallery and use it for his own portal-figures (Sin and Death at Hell's gate, the Paradise of Fools, the Chaos at the edge of creation). The chain Virgil → Spenser → Milton is one of the most traceable inheritances in English epic.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid VI.273–281 — the personifications at the entrance to the underworld (Grief, Cares, Diseases, Fear, Hunger, Poverty, Labor). The direct source for Spenser's gallery. Spenser's choice to make his personifications specifically-wealth-related is the polemical contribution.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 273–281",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Milton's Paradise Lost II.645ff — Sin and Death at Hell's gate. The Virgilian-Spenserian porch-personification tradition continues in Milton. The allegorical gate-figure is the shared form; Milton's Sin-and-Death pair is the specific Miltonic invention within the tradition.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book II.645ff",
        targetBookId: "paradise-lost",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 6. The house of Richesse ──────────────────────────────────────
  {
    id: "fq-2-7-house-of-richesse",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "house of Richesse from hell-mouth divide",
    anchorOccurrence: 1,
    title: "The House of Richesse — wealth's underworld factory",
    quotedPassage:
      "Some way, that did the house of Richesse from hell-mouth divide",
    passageReference: "Book II canto vii, stanza 24 (alexandrine)",
    commentary: `Spenser's most remarkable geographic compression. Mammon's House of Riches is physically *adjacent to the mouth of Hell*, separated from it by only "some way" (a little distance). The two places — where wealth is manufactured, and where the damned are sent — share a border.

This is allegorical topography at its most direct. Spenser is making the claim that *the production of wealth and the generation of hell are neighboring operations*. The people who work in the House of Riches (stanzas 34–39 describe them: fiends laboring at furnaces, gold molten in the ovens, treasures being forged with sweat and flame) are adjacent to, and indistinguishable from, the damned in hell. The reader's eye cannot tell which chamber is Riches and which is Hell, because they are in the same rock under the same stress.

Compare this to Milton's *Mammon* in Paradise Lost I.678–688, who "led them on" in Hell to dig out gold from the infernal ridges to build Pandemonium. Milton's Mammon *explicitly* extracts gold from Hell to build Satan's capital. The two images are continuous: Spenser's Mammon runs his House of Riches next door to Hell; Milton's Mammon *is* the fallen angel who mines Hell for gold to build the devils' palace. The inheritance is transparent; Milton's reading of Spenser is built into the architecture of Hell itself.

This canto is where Spenser's indictment of accumulated wealth is most direct. The reader who watches Guyon walk through Mammon's house is watching a tour of the *infernal economy*: where gold comes from (the rock-furnace), who mines it (the damned), what it rests on (Hell's foundation). Spenser is not content with the metaphor of wealth-as-danger; he makes it spatial. Wealth's origin is *physically* adjacent to Hell's mouth. To accumulate it is to work in a factory whose neighboring chamber is the lake of fire.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Milton's Paradise Lost I.678–688 — Mammon leads fallen angels to mine gold from Hell's ridges to build Pandemonium. The direct imaginative descendant of Spenser's House of Richesse at Hell-mouth. Milton makes the adjacency literal: his Mammon extracts gold *from Hell itself* to build Satan's capital.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 678–688",
        targetBookId: "paradise-lost",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },

  // ── 7. Philotime and the chain of Ambition ────────────────────────
  {
    id: "fq-2-7-philotime-ambition",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "And fayre Philotime she rightly hight",
    anchorOccurrence: 1,
    title: "Philotime and the chain of Ambition — the second temptation",
    quotedPassage:
      "'And fayre Philotime she rightly hight, / The fairest wight that wonneth under skie, / But that this darksom neather world her light / Doth dim with horrour and deformity, / Worthy of heven and hye felicitie, / From whence the gods have her for envy thrust'",
    passageReference: "Book II canto vii, stanzas 49–50",
    commentary: `Mammon's second major temptation is not wealth but *ambition*. He shows Guyon a golden chain that extends from earth to heaven, each link a stage of dignity, each step of which one may climb toward greatness. At the chain's top sits a beautiful lady, Philotime ("love-of-honor" in Greek: *philo-* + *timē*), whom Mammon offers as Guyon's spouse if he will serve.

The Greek etymology is exact. *Philotimia* in classical ethics (Aristotle's Nicomachean Ethics IV.4) is the desire for honor — the middle virtue between vanity and humility-as-inability. At the Aristotelian register Philotimia is morally ambiguous: excess is vanity, deficiency is unreadiness-for-honor, the mean is legitimate dignity. Spenser takes the figure and places her in Mammon's cave — positioning "love of honor" as a *temptation* rather than a virtue. The move is explicitly Protestant-ethical: *ambition-for-honor* is a this-world-oriented desire, not a this-world-transcending one, and so belongs in Mammon's realm even when it is not about money.

Guyon's refusal is sharper than the first. He explicitly identifies Philotime as *in the wrong place* — "I, that am fraile flesh and earthly wight, / Unworthy match for such immortall mate / My selfe well wote, and myne unequall fate" (stanza 50). The language of "immortal mate" and "unworthy match" plays on a genuinely courtly-romantic register (a knight refusing a lady far above his station is a troubadour commonplace), but the refusal turns on recognizing that the lady-of-honor offered here is not the marriage one's life is ordered toward. Guyon's ordered life has its own bride (Gloriana, or Medina's ordered court, or the temperate fellowship of his completed quest), and accepting Philotime would mean abandoning that order.

The chain itself is significant. Every link is a "degree of dignity" — a step of worldly rise. Spenser is describing the social-hierarchical ladder of Elizabethan England, where honor is pursued through patronage, office, title. To climb that ladder is to accept Mammon as the ladder's foot. This is perhaps Spenser's most pointed Elizabethan-political moment: he is writing as an English court-poet who has himself labored at the foot of the ladder of court-favor, and he sees clearly that the ambition he has practiced is Mammonic.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Aristotle's Nicomachean Ethics IV.4 — *philotimia* as the virtue concerned with honor. Aristotle's morally-ambiguous treatment (the mean between vanity and deficient desire for honor) is what Spenser inherits and decisively moves into Mammon's cave as a temptation.",
        workTitle: "Nicomachean Ethics",
        workAuthor: "Aristotle",
        passageReference: "Book IV, chapter 4",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ── 8. The Garden of Proserpina ───────────────────────────────────
  {
    id: "fq-2-7-proserpina-garden",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "The Gardin of Proserpina",
    anchorOccurrence: 1,
    title: "The Garden of Proserpina — the third temptation (forbidden fruit)",
    quotedPassage:
      "'Lo here the Gardin of Proserpina, / The goddess fayre of earths vital welth!' / ... The Gardin of Proserpina this hight; / And in the midst thereof a silver seat, / With a thick Arber goodly over-dight, / In which she often usd from open heat / Her selfe to shroud, and pleasures to entreat.",
    passageReference: "Book II canto vii, stanzas 51–53",
    commentary: `Spenser's third and climactic temptation takes Guyon into a garden — and the garden is Proserpina's. Proserpina (Greek Persephone) is the queen of the classical underworld, abducted by Hades while gathering flowers, forced to spend half each year in the underworld because she ate the pomegranate-seeds of its fruit.

Spenser's garden is a compressed anti-Eden. The trees are fair; the fruit is bright; at the center is a silver seat where the goddess rests. But the fruit — golden apples that shine — are Proserpina's fruit, and to eat any is to be bound, as Proserpina was bound, to the underworld.

The biblical register is unmistakable. Genesis 3 places the temptation in a garden; the forbidden fruit is the apple (iconographically); the eating binds humanity to fallen existence. Spenser is writing Eden as a *classical underworld* and the serpent's temptation as Mammon's offer of Proserpina's fruit. Two mythological frames collapse into one allegorical moment: the Christian fall and the pagan underworld-binding are the *same event*, differently narrated.

Spenser's Proserpina garden plants several famous classical apples in its orchard (stanzas 54–55): the apples Hercules stole from the Garden of the Hesperides (his eleventh labor); the golden apple Atalanta dropped to lose her foot-race against Hippomenes; the apple Acontius inscribed with a marriage-vow and rolled to Cydippe. These are all *classical apple-temptation* stories, each ending in commitment, binding, loss. Spenser is arranging a classical-apple-catalogue that makes his Garden of Proserpina the gathering-place of every apple-temptation in pagan myth.

The theological point: the *forbidden fruit* is not a single event in Eden. It is the archetypal temptation-form, recurrent across cultures, all pointing to the same reality — to eat what is offered in the shadow-garden is to be bound. Guyon is about to face the concentrated essence of all prior apple-temptations.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Ovid's Metamorphoses V.341–571 — the abduction of Proserpina. The Ovidian source for Spenser's Garden. The pomegranate-seed binding (Proserpina's eating the forbidden fruit that bound her to the underworld) is the direct model.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book V, lines 341–571",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "typological",
        description:
          "Genesis 3 — Eden, the forbidden fruit, the serpent, the fall. Spenser's Garden of Proserpina is Eden's classical shadow; the two temptation-gardens are allegorically the same, differently narrated.",
        workTitle: "The Bible (Genesis)",
        workAuthor: "traditional author",
        passageReference: "Genesis 3",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 9. The classical apple-parade ─────────────────────────────────
  {
    id: "fq-2-7-classical-apples",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "those which Hercules, with conquest bold",
    anchorOccurrence: 1,
    title: "The classical apple-parade — every pagan apple-temptation gathered",
    quotedPassage:
      "'For those which Hercules, with conquest bold / Got from great Atlas daughters, hence began, / And planted here did bring forth fruit of gold: / And those with which th' Eubœan young man wan / Swift Atalanta, when through craft he her out ran. / Here also sprong that goodly golden fruit, / With which Acontius got his lover trew'",
    passageReference: "Book II canto vii, stanzas 54–55",
    commentary: `Spenser catalogues three classical apple-stories, each a different type of apple-temptation:

**Hercules and the apples of the Hesperides (stanza 54).** Hercules's eleventh labor: to retrieve the golden apples guarded by the daughters of Atlas and the serpent Ladon. Hercules defeated the serpent and took the fruit. Spenser plants these apples in Proserpina's garden — meaning Hercules's prize, in Spenser's allegorical retelling, ends up with the queen of the underworld, not with Hercules. The conquest is reversed; classical triumph becomes Christian trap.

**Atalanta and the golden apples (stanza 54).** Atalanta, the fastest runner of Arcadia, vowed to marry only the man who could out-race her. Hippomenes of Boeotia ("th'Euboean young man" — though Spenser's geography is slightly off; it is Boeotia not Euboea) used golden apples given by Aphrodite to tempt Atalanta to pause during the race; she stopped to pick them up, he won. The apples here are temptation-to-pause, temptation to take what is offered rather than complete the race.

**Acontius and Cydippe (stanza 55).** Acontius of Ceos wrote a marriage-vow on an apple and rolled it to Cydippe; when she picked it up and read the inscription aloud ("I swear by Artemis to marry Acontius"), she was bound by the oath to marry him. The apple here is inscribed-binding, fruit that commits its taker.

Each of the three apple-stories names a different mode of temptation: Hercules = conquest-pride (I take it because I am strong); Atalanta = distraction-from-vocation (I pause my race for a prize); Acontius = inadvertent-binding (I read what the apple says, and am committed). Spenser has sourced the three types of apple-trap the classical tradition offers.

And Spenser places all three in Proserpina's garden — which is the canto's shadow-Eden. The three pagan apple-traps and the one biblical apple-trap converge. *Any* eating of offered fruit is the Eden-trap in different dress. The test Guyon is about to face is composite: to eat is to be, simultaneously, Adam-eating, Hercules-conquering, Atalanta-pausing, Cydippe-binding. All four fruit-meanings converge on the single act of eating.

Guyon, it turns out, does not eat. The refusal of the fruit is the central moment of Book II's temperance — the hero who refuses the apple is the Christian-humanist hero who learns from both pagan mythology (apple-as-trap in all three stories) and from scripture (apple-as-Eden-fall) that the offered fruit is always to be refused.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Ovid's Metamorphoses X.560–680 — Atalanta and Hippomenes. The direct Ovidian source for the Atalanta-apple story. Ovid is Spenser's standard classical-apple reference point.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book X, lines 560–680",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 10. Pilate and Tantalus in Cocytus ────────────────────────────
  {
    id: "fq-2-7-pilate-tantalus",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "Tantalus, I here tormented lye",
    anchorOccurrence: 1,
    title: "Tantalus and Pilate in Cocytus — the wealth-tempted damned",
    quotedPassage:
      "'Of whom high Jove wont whylome feasted bee, / Lo! Tantalus, I here tormented lye: / Of whom high Jove wont whylome feasted bee' / ... 'I Pilate am, the falsest Judge, alas! / And most unjust; that, by unrighteous / And wicked doome, to Jewes despiteous / Delivered up the Lord of life to dye'",
    passageReference: "Book II canto vii, stanzas 58–62",
    commentary: `Near Proserpina's garden, in the river Cocytus, Spenser places two damned figures whose presence explains the canto's whole moral scheme.

**Tantalus.** In Greek mythology, Tantalus was a king who either stole the gods' ambrosia, revealed their secrets, or — most famously — served his own son Pelops to the gods at a banquet to test their omniscience. His punishment in Hades: to stand in a pool beneath a fruit tree, with the water receding whenever he stoops to drink and the fruit withdrawing whenever he reaches up. Eternal proximity-without-reach to food and drink.

The choice of Tantalus is theologically precise. Tantalus's sin is *violating hospitality* (serving his son at his own feast) — a sin against the gods' generous provision. His punishment is to be denied the provision he once abused. In Spenser's Cave of Mammon, this is the exact pattern: Mammon offers wealth; the accepting soul is punished by being given wealth-without-satisfaction. Tantalus in Cocytus is the emblem of the accepting soul's ultimate fate: *to have what one sought and find it ever-withdrawing*. The possession of wealth does not end the hunger for wealth; it intensifies it.

**Pilate.** Pontius Pilate, the Roman governor who condemned Jesus to crucifixion. His inclusion here is Spenser's sharpest theological turn: he places *the betrayer of Christ* in the same river as Tantalus. Pilate washes his hands endlessly (Matthew 27:24 — Pilate's famous gesture of purported absolution — becomes eternal compulsive hand-washing). The sin: to have condemned innocent blood for political expediency. The punishment: to wash forever and never be clean.

Why Pilate in a Mammon-canto? Because Pilate's sin was a *political-economic* betrayal — he condemned Jesus to keep favor with the Jewish authorities and preserve his Roman office. Pilate traded righteousness for political wealth (in the form of social position and office). He is, in Spenser's theological geometry, a Mammon-damned figure: one who sold the innocent man for favor.

Together, Tantalus and Pilate name the two kinds of damnation Mammon produces: Tantalus = the insatiable-accumulator (to possess and still to want); Pilate = the betrayer-for-office (to sell what is sacred for social position). Both are on display in Mammon's river; both are what Guyon is being invited to become.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer's Odyssey XI.582–592 — Tantalus in Hades, reaching for retreating fruit. The classical source of the punishment-in-proximity archetype.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XI, lines 582–592",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Matthew 27:24 — Pilate washing his hands to disclaim responsibility for Christ's condemnation. Spenser eternalizes the gesture as compulsive, unsuccessful washing. The specific Gospel-source text for Pilate's Cocytean torment.",
        workTitle: "The Bible (Matthew)",
        workAuthor: "St. Matthew",
        passageReference: "Matthew 27:24",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical", "historical"],
  },

  // ── 11. Mammon's cave and the katabasis tradition ─────────────────
  {
    id: "fq-2-7-katabasis-tradition",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "river of Cocytus deepe",
    anchorOccurrence: 1,
    title: "The Cave of Mammon as katabasis — Spenser's Homer-Virgil-Dante inheritance",
    quotedPassage:
      "'That is the river of Cocytus deepe, / In which full many soules do endlesse wayle and weepe.'",
    passageReference: "Book II canto vii, stanza 57 (alexandrine)",
    commentary: `Spenser's Cave of Mammon is the most sustained *katabasis* (underworld descent) in The Faerie Queene, and it inherits from three distinct descent-traditions, each of which Spenser engages explicitly.

**Homer.** Odyssey XI (the *Nekyia*): Odysseus summons the dead at the edge of the world, meets his mother, Agamemnon, Achilles, and sees Tantalus and Sisyphus. The Homeric katabasis is oracular — the living hero receives prophecy and information from the dead. Spenser's canto names Tantalus explicitly, marking the Homeric lineage.

**Virgil.** Aeneid VI (the descent with the Cumaean Sibyl): Aeneas descends into the underworld, sees the parade of his descendants (the Roman future), meets Anchises. The Virgilian katabasis is *dynastic-political* — the hero sees his descendants and receives his political mission. Spenser's catalogues of damned (Tantalus, Pilate, the sufferers in Cocytus) echo Virgil's gallery of the shades; his personifications at Mammon's porch echo Virgil's at Hades' entrance.

**Dante.** Inferno (the full nine-circle descent): Dante, guided by Virgil, traverses the full geography of hell, each circle assigned to a sin. The Dantean katabasis is *allegorical-theological* — the tour is systematic moral pedagogy. Spenser's house-of-Mammon geography (porch with vices, inner chambers with gold-work, garden with forbidden fruit, river with damned souls) is the Dantean tour compressed into a single-canto miniature.

What makes Spenser's katabasis distinctive is that the hero *does not descend to gain*. Odysseus gains prophecy, Aeneas gains dynastic mission, Dante gains moral education. Guyon gains *nothing*. The canto's dramatic structure is: temptation offered, temptation refused, temptation offered again, temptation refused again, three days pass, hero emerges faint from the strain. The katabasis becomes a *fasting* — a descent whose purpose is to decline the underworld's offerings, not to gain them.

This is specifically Protestant-ethical. The Reformation reading of Christ's *Harrowing of Hell* (1 Peter 3:19: "he went and preached unto the spirits in prison") reads Christ as descending not to negotiate with hell but to break its gates from inside and emerge. Guyon's katabasis is patterned on the Christ-model rather than the pagan-heroic model. The hero enters the underworld to refuse and exit, not to acquire. The three-day duration is part of the same allegorical system: Christ's three days in the tomb, Guyon's three days in Mammon's cave, both ending with the hero's emergence from the underworld having conquered it by refusal rather than combat.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer's Odyssey XI — the Nekyia, the original Greek katabasis. Establishes the underworld-descent convention Spenser's canto works within.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XI",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Virgil's Aeneid VI — Aeneas with the Sibyl. The Roman-dynastic katabasis template.",
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
          "Dante's Inferno — the full nine-circle allegorical descent. Dante's systematic moral geography is the model for Spenser's house-of-Mammon compression.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno I–XXXIV",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 12. Three-day descent — the theological structure ─────────────
  {
    id: "fq-2-7-three-days",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "three dayes of men were full outwrought",
    anchorOccurrence: 1,
    title: "Three days — Guyon's descent patterns Christ's tomb",
    quotedPassage:
      "For now three dayes of men were full outwrought, / Since he this hardy enterprize began: / Forthy great Mammon fayrely he besought / Into the world to guyde him backe",
    passageReference: "Book II canto vii, stanza 65",
    commentary: `The canto's hidden architectural frame: Guyon has been underground for *three days*. Spenser tells us this at the moment Guyon asks Mammon to lead him out — "three dayes of men were full outwrought."

Three days is not a casual duration. It is Christ's tomb-time: Friday afternoon to Sunday morning. Spenser's Book I used the three-day structure explicitly for the Dragon-fight (canto xi); Book II canto vii uses it again for Guyon's Mammon-cave ordeal.

The theological echo: Christ's descent into hell (Matthew 12:40: "as Jonas was three days and three nights in the whale's belly; so shall the Son of man be three days and three nights in the heart of the earth") is the archetypal three-day underworld duration. Christ descends to hell, harrows it (liberates the righteous dead), and ascends. Guyon descends to Mammon's cave, *refuses its offerings*, and ascends.

The pattern is specifically *Christ-participatory* rather than Christ-typological. Guyon is not Christ; he is a knight who, in his particular test, re-enacts the Christ-shape of three-day-underworld-descent. The Christian soul in disciplined temperance, faced with temptations of wealth, does something formally analogous to what Christ did — enters, refuses, emerges. The disciplined life participates in the Christ-event by having the same shape.

At the canto's close, Guyon emerges but *collapses* at the edge of the upper world: "his enfeebled spright / Gan sucke this vitall ayre into his brest, / As overcome with too exceeding might, / The life did flit away out of her nest, / And all his sences were with deadly fit opprest." The knight has been sustained in the cave by the sheer effort of refusal; once he is out, he faints. Canto viii will open with Guyon prone and defenseless, Pyrrhocles and Cymochles about to strip him, an angel guarding him until Arthur arrives.

The faint is theologically deliberate. Refusing Mammon *takes everything*. Temperance is not easy; it is depleting. The hero who refuses the underworld's offerings over three days of sustained refusal is *exhausted by his virtue*. The canto ends with the reminder that moral excellence costs the body. Grace (in the form of the angel at canto viii's opening) is what carries the depleted temperate hero into safety.`,
    crossReferences: [
      {
        type: "typological",
        description:
          "Matthew 12:40 — 'three days and three nights in the heart of the earth.' The archetypal duration of underworld descent in Christian typology. Spenser uses the same three-day architecture here as in Book I's Dragon-fight; the temperate hero's ordeal formally mirrors Christ's tomb-time.",
        workTitle: "The Bible (Matthew)",
        workAuthor: "St. Matthew",
        passageReference: "Matthew 12:40",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Book I canto xi — the three-day Dragon-fight. Spenser uses the same three-day architecture for the climactic tests of both Book I (holiness) and Book II (temperance). The structural rhyme is deliberate; the two virtues are tested by three-day confrontations with evil.",
        workTitle: "The Faerie Queene (Book I canto xi)",
        workAuthor: "Edmund Spenser",
        passageReference: "Book I canto xi",
        targetBookId: "the-faerie-queene",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological"],
  },

  // ── 13. Milton's Mammon — the direct descendant ───────────────────
  {
    id: "fq-2-7-milton-mammon",
    bookId: "the-faerie-queene",
    chapterNumber: 20,
    anchorText: "Great Mammon",
    anchorOccurrence: 1,
    title: "Milton's Mammon — Paradise Lost's direct inheritance",
    quotedPassage:
      "'God of the world and worldlings I me call, / Great Mammon, greatest god below the skye'",
    passageReference: "Book II canto vii, stanza 8",
    commentary: `Milton's Mammon appears twice in Paradise Lost — once in Book I (as the fallen angel who led his fellow devils to mine gold from Hell's ridges to build Pandemonium, I.678–730) and once in Book II (where he speaks at the infernal debate, II.228–283, arguing against further war with God and for making the best of Hell's existing resources).

The inheritance from Spenser's canto is precise and acknowledged. Milton had read The Faerie Queene carefully; in *Areopagitica* (1644) he explicitly cites Guyon's journey *through the cave of Mammon* as exemplary of true Christian temperance — the famous passage about "our sage and serious poet Spenser, whom I dare be known to think a better teacher than Scotus or Aquinas, describing true temperance under the person of Guyon, brings him in with his palmer through the cave of Mammon, and the bower of earthly bliss, that he might see and know, and yet abstain."

Spenser's Mammon is a distinct figure (money-god in a cave, with his house of riches and garden of Proserpina); Milton's Mammon is a fallen angel among Satan's peers. But the *character* Milton gives his Mammon is recognizably Spenserian: gold-obsessed, underworld-operating, accumulator rather than fighter. When Milton's Mammon argues in II.252–257 that Hell can be made into a kind of Pandemonium-empire by extracting its mineral wealth, he is enacting what Spenser's Mammon offers to Guyon.

The key difference: Spenser's Mammon is a *god* (the money-god of pagan-Christian synthesis); Milton's Mammon is a *devil* (one of Satan's lieutenants). Milton's theological precision has demoted the figure: money is not a rival god; money is a particular corrupt angel. The Miltonic Mammon is scripturally more careful than the Spenserian, which is consistent with Milton's general relationship to allegorical personification (he treats allegorical figures more sparingly than Spenser).

But the underground-factory-of-wealth, the gold-mining-in-hell, the ambition-ladder, the dangerous-garden: all of these Milton takes from Spenser. Paradise Lost Book II.228–283 is one of the most direct one-work-to-another transmissions in the English epic tradition, second only to the Bower of Bliss → Eden (Faerie Queene II.xii → Paradise Lost IV) inheritance already annotated in this edition.

A reader who reads Canto VII alongside Paradise Lost I.678–730 and II.228–283 will see the inheritance in full. Milton is not borrowing images; he is *continuing Spenser's moral-theological project on Mammon* into the next epic generation.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Milton's Paradise Lost I.678–730 (Mammon leads gold-mining in Hell to build Pandemonium) and II.228–283 (Mammon's infernal-debate speech). The direct formal descendants of Spenser's Mammon. Milton's Areopagitica acknowledges the debt explicitly: Spenser's canto VII is one of his named Protestant-pedagogical models.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I.678–730; Book II.228–283",
        targetBookId: "paradise-lost",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Milton's Areopagitica (1644) — the explicit acknowledgment: 'our sage and serious poet Spenser, whom I dare be known to think a better teacher than Scotus or Aquinas, describing true temperance under the person of Guyon, brings him in with his palmer through the cave of Mammon, and the bower of earthly bliss.' Milton's own words on his Spenserian inheritance.",
        workTitle: "Areopagitica",
        workAuthor: "John Milton",
        passageReference: "1644",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
]
