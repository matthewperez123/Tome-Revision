import type { Annotation } from "../types"

// ── Paradise Lost Book IV — Satan on Mount Niphates, Eden, Adam and Eve ─
// The first soliloquy of genuine remorse, the first sight of Eden, Eve's
// water-gazing scene, "Hail, wedded Love," the confrontation with Gabriel
// and the scales. 16 annotations.

export const PARADISE_LOST_BOOK_4: Annotation[] = [
  {
    id: "pl-4-warning-voice",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "O, for that warning voice",
    anchorOccurrence: 1,
    title: "\"O, for that warning voice\" — Milton's interpolated lament",
    quotedPassage:
      "O, for that warning voice, which he, who saw / The Apocalypse, heard cry in Heaven aloud…",
    passageReference: "Book IV, lines 1–2 · PL IV.1–2",
    commentary: `Book IV opens not with invocation but with a lament. The *warning voice* is the angel in Revelation 8:13 — *Woe, woe, woe to the inhabitants of the earth* — whom Milton wishes could be heard in Eden at this moment. The effect is a narrative aside: the poet steps forward to say, in his own voice, that he wishes he could interrupt the plot.

The device is rare in epic. Homer rarely speaks as himself; Virgil's authorial apostrophes (*fortunati ambo*, *tu Marcellus eris*) are short and formal. Milton's lament is longer, more personal, and modern in its self-consciousness. It is also the moment the reader's sympathy swings most fully onto the side of humanity: Adam and Eve have not yet appeared on stage, and the poet is already grieving for what is about to happen to them.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Virgil's authorial apostrophes (fortunati ambo; tu Marcellus eris) are short and formal. Milton's lament at IV.1–8 is longer, more personal, and modern in its self-consciousness. The comparison marks Milton's distance from classical epic decorum.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IX, lines 446–449",
        targetBookId: "the-aeneid",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "pl-4-niphates-soliloquy",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "O thou that, with surpassing glory",
    anchorOccurrence: 1,
    title: "Satan's Niphates soliloquy — the first genuine self-knowledge",
    quotedPassage:
      "\"O thou that, with surpassing glory crowned, / Lookst from thy sole dominion like the God / Of this new world… to thee I call, / But with no friendly voice, and add thy name, / O Sun, to tell thee how I hate thy beams…\"",
    passageReference: "Book IV, lines 32–37 · PL IV.32–37",
    commentary: `The Mount Niphates soliloquy is Satan's first and only moment of full self-knowledge. Alone, addressing the Sun, he admits what he cannot admit to Beelzebub or the council: he has chosen his misery and keeps choosing it. The speech runs from IV.32 to IV.113 and contains the poem's most shocking concessions — *Me miserable! which way shall I fly / Infinite wrath and infinite despair? / Which way I fly is Hell; myself am Hell* (IV.73–75).

Milton is reported to have written the soliloquy first, as part of a planned tragedy called *Adam Unparadised*, before reconceiving the project as an epic. Whether or not the origin-story is exactly right, the soliloquy retains a theatrical self-contained quality: it could lift out of the poem and be staged as a scene. The theological weight of the passage is that Satan *can* see his situation clearly, and chooses not to repent. Damnation, in Milton, is chosen and re-chosen.

This is the single most important speech in the poem for the "is Satan the real hero?" debate. Readers who say yes often stop reading at I.263 ("Better to reign in Hell"); readers who say no often begin at IV.32. Both readings miss that they are the *same character* at two moments of clarity.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "pl-4-myself-am-hell",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Myself am Hell",
    anchorOccurrence: 1,
    title: "\"Myself am Hell\" — the line against which to read \"the mind is its own place\"",
    quotedPassage:
      "Which way I fly is Hell; myself am Hell; / And, in the lowest deep, a lower deep / Still threatening to devour me opens wide, / To which the Hell I suffer seems a Heaven.",
    passageReference: "Book IV, lines 75–78 · PL IV.75–78",
    commentary: `Read this line against Book I's "*the mind is its own place, and in itself / Can make a Heaven of Hell*" (I.254–55). The Book I version is Satan bragging. The Book IV version is Satan breaking. *Myself am Hell* uses the same mental-geography trope, but now the mind is the Hell it cannot leave — the metaphor has swallowed the speaker.

The nested image — *in the lowest deep, a lower deep / still threatening to devour me opens wide* — is a physics of despair. Every bottom has another bottom below it. The nearest Shakespeare equivalent is Hamlet's "*there's nothing either good or bad, but thinking makes it so; to me it is a prison*" (II.ii.250ff); the Milton upgrade is that the prison is the thinker.

One of the load-bearing features of the poem's moral architecture. Satan is the only character in the poem who explicitly recognizes his own damnation *as chosen*. The recognition does not produce repentance; Milton's theology says it could have. The freedom stays.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Read Satan's I.254–55 (\"the mind is its own place\") against IV.75 (\"myself am Hell\"). The same figure of speech, first as defiance and then as confession, is the central Miltonic method for showing Satan's self-deception collapsing.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 254–255",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "The mind is its own place",
      },
      {
        type: "echo",
        description:
          "Hamlet's \"I could be bounded in a nutshell and count myself a king of infinite space, were it not that I have bad dreams\" — the same mental-geography metaphor arrived at different conclusions.",
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
  {
    id: "pl-4-first-view-of-eden",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "so lovely seemed",
    anchorOccurrence: 1,
    title: "First view of Eden — \"so lovely seemed that landscape\"",
    quotedPassage:
      "So lovely seemed / That landscape: and of pure now purer air / Meets his approach…",
    passageReference: "Book IV, lines 152–154 · PL IV.152–54",
    commentary: `The first extended description of Eden is seen through Satan's eyes. Milton's technical choice is to make the reader share Satan's approach — we arrive where he arrives, at the angle he arrives at, and the landscape registers first as his sensory experience. The effect is moral: we see beauty with the eyes of the being who means to destroy it. The aesthetic pleasure and the ethical horror are both part of the reading.

The air is "*pure now purer*" — Milton is gradating the atmospheric layers. Ancient and medieval cosmology had zones of air of differing purities; crossing into Eden is crossing into a higher-quality layer. The detail is small but technically correct in the old cosmology and characteristic of Milton's dense physical imagination.

Over the next fifty lines (IV.131–287) Milton catalogues Eden's rivers, fruit, flowers, and animals. The description is pastoral at surface level but structurally Virgilian — the Georgics are behind the verse, and Spenser's Garden of Adonis is behind that.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },
  {
    id: "pl-4-adam-eve-described",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Two of far nobler shape",
    anchorOccurrence: 1,
    title: "Adam and Eve, first appearance — \"not equal, as their sex not equal seemed\"",
    quotedPassage:
      "Two of far nobler shape, erect and tall, / Godlike erect, with native honour clad / In naked majesty, seemed lords of all…",
    passageReference: "Book IV, lines 288–290 · PL IV.288–90",
    commentary: `The first full description. Adam and Eve are "*not equal, as their sex not equal seemed*" (IV.296): Adam is for contemplation and valor; Eve for softness and grace; "*He for God only, she for God in him*" (IV.299). The theological claim is hierarchical — Milton endorses a gendered order of creation — and modern readers regularly experience this as the poem's most uncomfortable passage.

Milton's position is complicated, not straightforwardly patriarchal. The hierarchy is Pauline (1 Corinthians 11:3 is the source text) but Milton's Eve will, in Books IV, V, VIII, IX, and X, repeatedly speak with independent intellectual and moral authority. Book IV's description is the static portrait; the dramatic truth of Eve as a character develops in the later books and tends to undermine the schema offered here.

The annotation should flag the difficulty without flattening it. Honest Milton reading keeps both of these facts in play: the poem formally subordinates Eve, and the poem repeatedly narrates her as equally consequential.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-4-water-gazing",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "looked into the clear",
    anchorOccurrence: 1,
    title: "Eve's water-gazing — the Narcissus echo",
    quotedPassage:
      "As I bent down to look, just opposite / A Shape within the watery gleam appeared, / Bending to look on me.",
    passageReference: "Book IV, lines 460–462 · PL IV.460–62",
    commentary: `Eve recalls her first moments of consciousness: she awoke by a pool, saw her reflection, and fell in love with it, until a voice (God's) redirected her to Adam. The scene is modeled closely on Ovid's Narcissus (Metamorphoses III.413ff) — the pool, the reflection, the unsuspecting self-love — but Milton inverts the ending: Narcissus dies because he never realizes the beloved image is himself; Eve is saved because God's voice interrupts the identification.

The theological and feminist stakes are both live. On one reading, Eve is a danger-prone being who has to be redirected toward her husband; on another, she is a creature who, unlike Narcissus, *does* learn, and learns quickly. The self-recognition is the moment she becomes the poem's second subjectivity.

Scholarship on the scene is one of the most extensive on any passage in English poetry. Christine Froula, Diane McColley, and Maureen Quilligan have read it in detail; the debate is worth looking up.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Ovid's Metamorphoses III.413ff — Narcissus sees his reflection in a pool and falls fatally in love with it. Milton's scene is the redeemed inversion: Eve sees herself and is redirected before she is lost.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book III, lines 413ff",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-4-prowling-wolf",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "As when a prowling wolf",
    anchorOccurrence: 1,
    title: "Satan as prowling wolf — the sheepfold simile",
    quotedPassage:
      "As when a prowling wolf, / Whom hunger drives to seek new haunt for prey, / Watching where shepherds pen their flocks at eve / In hurdled cotes… / Leaps o'er the fence with ease into the fold…",
    passageReference: "Book IV, lines 183–187 · PL IV.183–87",
    commentary: `Satan entering Eden is compared, first, to a wolf leaping a sheepfold. Milton immediately compounds it: "*Or as a thief*" (IV.188) climbing a cloister wall. Two similes in close succession, both violating pastoral enclosures. The effect is to present Satan as a *type* of intrusion, not a single character-specific image.

The wolf-and-sheepfold figure is drawn from John 10:1 and 10:12, where Jesus describes false pastors as *thieves and robbers* who do not enter by the door. Milton activates the Johannine language so that Satan's entry into Eden reads, to any reader of the Gospels, as an anti-shepherd act. This is the foundation for the poem's continuing pastoral imagery — Eden as sheepfold, Adam and Eve as sheep, Christ as the true shepherd in the prophetic vision of Book XII.

The next comparison Milton reaches for (IV.193–96) is commercial: Satan is like a hireling who has raised a tithe into a fortune. Milton stacks three similes — wolf, thief, corrupt clergyman — and the stacking is argumentative. Satan is not one kind of intruder; he is every kind at once.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "pl-4-hail-wedded-love",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Hail, wedded Love",
    anchorOccurrence: 1,
    title: "\"Hail, wedded Love\" — Milton's marriage aria",
    quotedPassage:
      "Hail, wedded Love, mysterious law, true source / Of human offspring, sole propriety / In Paradise of all things common else…",
    passageReference: "Book IV, lines 750–752 · PL IV.750–52",
    commentary: `Milton interpolates a full hymn to conjugal love inside the description of Adam and Eve's Edenic night. The passage is polemic as well as praise: Milton wrote the *Doctrine and Discipline of Divorce* (1643) defending the sanctity of marriage *and* the necessity of divorce in cases of incompatibility, and the aria here is the positive half of that argument — marriage as the founded institution, the *sole propriety* (sole form of private property) in an otherwise commonly-held Eden.

The polemical edge: Milton is explicitly rejecting both Catholic celibacy (*Hail, wedded Love*… "*whatever hypocrites austerely talk / Of purity and place and innocence*", IV.744–45) and the more ascetic Puritan suspicion of sexual pleasure. The Edenic marriage in Paradise Lost includes sexual intimacy as *part* of innocence, not a compromise with it. That claim was genuinely controversial in its day.

The scholarly literature (Haller, Turner, Chaplin) discusses Milton's marriage theology at length. The aria is its poetic statement.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-4-satan-at-eves-ear",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Squat like a toad",
    anchorOccurrence: 1,
    title: "Satan at Eve's ear — the toad and the dream",
    quotedPassage:
      "Him there they found / Squat like a toad, close at the ear of Eve, / Assaying by his devilish art to reach / The organs of her fancy, and with them forge / Illusions…",
    passageReference: "Book IV, lines 799–803 · PL IV.799–803",
    commentary: `Ithuriel and Zephon find Satan, in toad-form, whispering in Eve's ear as she sleeps — attempting to implant the dream that will surface in Book V. Milton's theological point: dreams can be corrupted from the outside, but acts require conscious assent. Eve will awake disturbed by her dream but innocent of it.

The toad iconography is drawn from the medieval and Renaissance tradition of depicting demonic figures as amphibians — unclean, liminal, damp. Milton uses it once and only once, at this moment of minimum Satanic dignity. Immediately after Ithuriel touches him with the celestial spear, Satan returns to his own shape (IV.812ff) — the disguise cannot survive contact with virtue.

A useful annotation on Milton's theology of temptation: the dream plants a seed; the seed requires Eve's conscious embrace to grow. Book IX's argument about whether Eve "had to" fall hinges on this division between impression and assent.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Eve's narration of the dream the next morning (V.28–93) is the payoff for this scene. Read the two passages together.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book V, lines 28–93",
        targetBookId: "paradise-lost",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "pl-4-scales-of-god",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "The Eternal, to prevent such horrid fray",
    anchorOccurrence: 1,
    title: "The scales of God — Homeric echo at the climax of Book IV",
    quotedPassage:
      "The Eternal, to prevent such horrid fray, / Hung forth in Heaven his golden Scales… / In these he put two weights, / The sequel each of parting and of fight…",
    passageReference: "Book IV, lines 996–1003 · PL IV.996–1003",
    commentary: `The confrontation between Satan and Gabriel is about to turn into open combat when God hangs golden scales in the constellation of Libra to weigh the outcomes. Satan's lot lifts; Satan retreats.

The scales are Milton's direct borrowing from Iliad XXII.209–13, where Zeus weighs the fates of Achilles and Hector before their combat — Hector's lot sinks, and he dies. Milton Christianizes the image: God's scales do not predict death, they signal divine preference, and Satan is spared humiliation but forced to flee. The Iliadic template is visible through Milton's blank verse.

Book IV closes with Satan's retreat, Gabriel's guard restored, and the reader positioned for the morning of Eden in Book V — a morning Eve will begin by recounting her disturbing dream.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer, Iliad XXII.209–213: Zeus lifts the scales and weighs the fates of Achilles and Hector. Milton rewrites the moment with Satan and Gabriel; the scales are the same, the cosmology is rearranged around them.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXII, lines 209–213",
        targetBookId: "the-iliad",
        targetChapterNumber: 21,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "pl-4-uriel-detects-satan",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Uriel, the regent of the Sun",
    anchorOccurrence: 1,
    title: "Uriel detects the deception",
    quotedPassage:
      "For Uriel, the regent of the Sun / Descending, warned them…",
    passageReference: "Book IV, lines 561–562 · PL IV.561–62",
    commentary: `Uriel, who unknowingly gave Satan directions in Book III, has been watching from the Sun. When the face of the *stripling Cherub* shows "*ire, envy, and despair*" (IV.114ff) on Mount Niphates, Uriel registers the contradiction and realizes the deception. He sends a warning down to Gabriel at the gate of Eden.

Milton's theology of hypocrisy: even the wisest angel could not detect the deception *in advance* (III.682–84, "*neither Man nor Angel can discern / Hypocrisy*") but could recognize it *after the fact* once the disguised being failed to maintain the mask. The face tells the truth once the will slips. Satan's soliloquy on Mount Niphates is the moment his face slips, and the sun — Uriel's station — is the only vantage point from which the slip is visible.

The infrastructure of good is not clairvoyant but observant. Milton's theodicy includes the possibility that evil can succeed locally because the angelic guards are not omniscient.`,
    crossReferences: [],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "pl-4-zephon-rebukes",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Think not, revolted Spirit",
    anchorOccurrence: 1,
    title: "Zephon's rebuke — \"thy glory withered\"",
    quotedPassage:
      "\"Think not, revolted Spirit, thy shape the same, / Or undiminished brightness to be known, / As when thou stood'st in Heaven upright and pure. / That glory then, when thou no more wast good, / Departed from thee; and thou resemblest now / Thy sin and place of doom obscure and foul.\"",
    passageReference: "Book IV, lines 835–840 · PL IV.835–40",
    commentary: `The young angel Zephon speaks truth to Satan without embarrassment, and Milton frames the rebuke with a striking line: "*abashed the Devil stood, / And felt how awful goodness is*" (IV.846–47). *Awful* in its seventeenth-century force: awe-inducing, overwhelming. The passage is one of the few in the poem where Satan's rhetorical command momentarily fails in the face of simple virtue.

The theology: Satan has been carrying himself as if he retained his original glory. Zephon points out that the glory was tethered to the goodness; the fall into evil destroyed the beauty, and Satan no longer recognizes his own reduced state. This is the prompt for Satan's internal recognition in the soliloquy to come — Niphates is downstream of this rebuke in the poem's psychological logic.

The Zephon palette keeps him in the gentle white-gold of the loyal minor angels. The speech is short; the moral weight is large.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
  {
    id: "pl-4-gabriel-confrontation",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Gabriel, thou hadst in Heaven",
    anchorOccurrence: 1,
    title: "Satan and Gabriel — the border scene",
    quotedPassage:
      "\"Gabriel, thou hadst in Heaven the esteem of wise, / And such I held thee…\"",
    passageReference: "Book IV, lines 886–887 · PL IV.886–87",
    commentary: `The stand-off at the gate of Eden. Gabriel and the angelic watch have caught Satan; the dispute is about whether Satan will leave voluntarily or be forced out. Satan's rhetorical move is to flatter Gabriel as a fellow political actor — *thou hadst in Heaven the esteem of wise* — as if the two of them were equally-ranked adversaries.

Gabriel's response (IV.904–16) refuses the equivalence, and closes with the command that draws out the Libra-scales passage. The diplomatic structure of the exchange — two commanders negotiating across a line — is lifted from the Iliad (Hector and Ajax at Iliad VII, Achilles and Hector at Iliad XXII) and from the Aeneid (Aeneas and Turnus at XII). Milton's border scene is the epic template domesticated to Heaven and Hell's border on the edge of Eden.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },
  {
    id: "pl-4-adams-instruction",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Sole partner and sole part",
    anchorOccurrence: 1,
    title: "Adam to Eve on the prohibition — \"our reason is our law\"",
    quotedPassage:
      "\"Sole partner and sole part of all these joys, / Dearer thyself than all…\"",
    passageReference: "Book IV, lines 411–412 · PL IV.411–12",
    commentary: `Adam's evening speech to Eve. He reviews the one prohibition (do not eat of the Tree of Knowledge) and offers a gloss: God's command leaves them otherwise entirely free, with *reason as their law*. The theology is Arminian — free choice is the essence of the original state, and the prohibition is not an imposition on freedom but its test.

Notice the rhetorical structure: Adam frames the prohibition as a *sign* of God's love (IV.427–32), and the meaning of the tree as the point at which freedom becomes legible. This is the poem's most explicit pre-Fall theodicy, and it is Adam, not the narrator, who voices it.

When Eve in Book IX proposes separate labor (IX.335ff), the argument she makes will quote this speech back to Adam. Milton's characters cite each other; the interior coherence of the poem's theological arguments is one of its formal achievements.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Eve's argument for separate labor at IX.335ff quotes and re-applies Adam's theology of freedom from this speech. Read the two passages together.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IX, lines 335–384",
        targetBookId: "paradise-lost",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical"],
  },
  {
    id: "pl-4-evening-in-eden",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "Now came still evening on",
    anchorOccurrence: 1,
    title: "\"Now came still evening on\" — the first pastoral nightfall",
    quotedPassage:
      "Now came still evening on, and twilight gray / Had in her sober livery all things clad; / Silence accompanied…",
    passageReference: "Book IV, lines 598–600 · PL IV.598–600",
    commentary: `The first evening in Eden Milton describes in detail. The passage is a set-piece pastoral — twilight, silence, the nightingale, the moon rising. Two points of craft worth flagging.

First, Milton is signaling the diurnal cycle of Eden: morning, noon, and evening each get their description through the poem, establishing a natural rhythm that the Fall will eventually disrupt (the post-Fall sky in Book X develops storms and seasons for the first time). This Book IV evening is the template against which the Book X perturbation reads.

Second, the syntax is unusually regular here: verse paragraphs shorter, enjambment lighter, tone closer to Spenser's pastoral than to Milton's characteristic long period. Milton can do pastoral when the subject requires pastoral, and he is doing it here to give the reader one night of quiet before the approaching disruption.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },
  {
    id: "pl-4-watch-by-night",
    bookId: "paradise-lost",
    chapterNumber: 3,
    anchorText: "winged warriors",
    anchorOccurrence: 1,
    title: "The angelic watch — military discipline around Eden",
    quotedPassage:
      "These are in dread tumult at the report, / And, for dispatch quick to the foe, / Gabriel…",
    passageReference: "Book IV, lines 778–784 · PL IV.778–84",
    commentary: `Milton renders the guardian angels as a military detachment: uniforms, discipline, rotating shifts, squads ordered to quarter the garden. The model is the Roman imperial legion or the English New Model Army that Milton himself knew at first hand (having served the Cromwellian government as Latin Secretary). Eden, in Book IV, is a garrisoned province.

The theological point: prelapsarian Eden is not unguarded. God stations an angelic watch, not because Adam and Eve are vulnerable (they are not), but because Satan is at large. The watch is external to the garden proper; it is the angelic world's containment of the threat, separate from the human test.

When Satan evades the watch at IV.561ff (Uriel's warning arrives too late; Satan had already entered), the failure is operational, not theological. Milton is careful to preserve the framework: God's providence includes the angelic defense, which can fail at a tactical level without compromising the cosmic outcome.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
]
