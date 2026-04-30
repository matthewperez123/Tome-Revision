/**
 * Trial bank — Dante, Inferno I–III.
 *
 * The Divine Comedy is stored as a single book in `chapters.ts`, with cantos
 * generated from the canticle offsets. Inferno I/II/III map to chapter
 * indices 0, 1, 2 (canticle offset 0; 1-based canto numbers). Citations use
 * the canonical canto.line numbering of the Italian text; English phrases
 * follow the Longfellow-tradition register.
 */

import type { ChapterQuestion } from "@/lib/chapter-questions"

// ─────────────────────────────────────────────────────────────────────────────
// Canto I — The Dark Wood
// ─────────────────────────────────────────────────────────────────────────────

const CANTO_I: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "inferno-c1-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Where does the pilgrim find himself at the start of Canto I?",
    options: [
      "On the slopes of Mount Purgatory",
      "Astray in a dark wood, having lost the straight way",
      "Standing before the gates of his city",
      "Crossing the river Acheron",
    ],
    correctIndex: 1,
    explanation:
      "“Midway upon the journey of our life I found myself within a forest dark, for the straightforward pathway had been lost.” The selva oscura is the figure of moral and spiritual disorientation that opens the poem.",
    citation: "Inferno I.1–3",
  },
  {
    id: "inferno-c1-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Three beasts block Dante’s path on the slope of the hill. What are they?",
    options: [
      "A dragon, a basilisk, and a serpent",
      "A leopard, a lion, and a she-wolf",
      "Three lions",
      "A wolf, a hound, and a hawk",
    ],
    correctIndex: 1,
    explanation:
      "The lonza, leone, lupa — the leopard, the lion, and the she-wolf — drive Dante back into the dark. The traditional readings link them to lust, pride, and avarice (or, alternately, to the tripartite scheme of incontinence, violence, and fraud).",
    citation: "Inferno I.32–60",
  },
  {
    id: "inferno-c1-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Midway upon the journey of our life I found myself within a forest ____.",
    correctText: "dark",
    acceptedVariants: ["obscure", "shadowed"],
    explanation:
      "The opening tercet of the Comedy: nel mezzo del cammin di nostra vita / mi ritrovai per una selva oscura / ché la diritta via era smarrita. The “dark wood” is the figure that the rest of Inferno is the way out of.",
    citation: "Inferno I.1–3",
  },
  {
    id: "inferno-c1-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "He appears on the slope, hoarse from long silence, and identifies himself as “a poet, and I sang of that just son of Anchises.”",
    identificationSubject: "character",
    options: ["Statius", "Ovid", "Homer", "Virgil"],
    correctIndex: 3,
    explanation:
      "Virgil, author of the Aeneid (“that just son of Anchises” is Aeneas), comes to Dante in the Comedy as guide through Hell and Purgatory. His self-introduction is the poem’s first explicit literary genealogy.",
    citation: "Inferno I.61–87",
  },
  {
    id: "inferno-c1-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Dante climbs the sunlit hill at the start of Canto I but is forced back by the three beasts.",
    correctBool: true,
    tfReasons: [
      "He sees the hill clothed in light, attempts the ascent, and is pushed back by the leopard, lion, and especially the she-wolf — Virgil intervenes only after this failure.",
      "He climbs the hill successfully and reaches the summit.",
      "He is too despondent to attempt the climb at all.",
      "He climbs only after Virgil arrives.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The failure of the direct ascent is the structural point of Canto I: the easy way is closed. The long route through Hell and Purgatory will be the only way to the same summit.",
    citation: "Inferno I.13–60",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "inferno-c1-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What is the relation between the journey of Inferno I and Easter?",
    options: [
      "It is set during the Twelve Days of Christmas",
      "It begins on the night of Maundy Thursday and unfolds across the Easter Triduum of 1300",
      "It is set in late summer",
      "Dante is silent about the date",
    ],
    correctIndex: 1,
    explanation:
      "The fictional date of the Comedy is Holy Week 1300. Canto I’s morning is Good Friday; Hell occupies Friday–Saturday; Easter Sunday begins on the shore of Mount Purgatory.",
    citation: "Inferno I; XXI.112–114; Purgatorio II",
  },
  {
    id: "inferno-c1-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Virgil prophesies in Canto I that the she-wolf will be driven back into Hell by what figure?",
    options: [
      "An angel from Heaven",
      "A “veltro” (greyhound) whose food will be wisdom, love, and virtue",
      "A pope yet to come",
      "A second poet greater than himself",
    ],
    correctIndex: 1,
    explanation:
      "The veltro prophecy in I.100–111 is one of the famously contested moments of the poem: the greyhound born between feltro and feltro. Readings vary — Cangrande della Scala, an emperor to come, a spiritual reformer — but the eschatological function is clear.",
    citation: "Inferno I.100–111",
  },
  {
    id: "inferno-c1-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "The opening word of the Comedy is the first-person plural possessive — “Nel mezzo del cammin di ____ vita.”",
    correctText: "nostra",
    acceptedVariants: ["our"],
    explanation:
      "Nostra — “our.” The first-person plural is famous: the journey is from the start a journey for the reader as well as the pilgrim. The personal Dante speaks for, and to, every reader at midlife.",
    citation: "Inferno I.1",
  },
  {
    id: "inferno-c1-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“Poet, I beseech thee, by that God whom thou didst never know.”",
    identificationSubject: "speaker",
    options: ["Beatrice", "Dante to Virgil", "Statius", "Cato"],
    correctIndex: 1,
    explanation:
      "Dante’s plea to Virgil at the close of Canto I is theologically careful: Virgil, the great pagan, is a guide to a Christian salvation he cannot share. The line names that gap and asks him to lead anyway.",
    citation: "Inferno I.130–135",
  },
  {
    id: "inferno-c1-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each of the three beasts to the most common allegorical reading.",
    matchingLeft: ["Leopard (lonza)", "Lion (leone)", "She-wolf (lupa)"],
    matchingRight: ["Lust / fraud", "Pride / violence", "Avarice / incontinence"],
    correctPairs: {
      "Leopard (lonza)": "Lust / fraud",
      "Lion (leone)": "Pride / violence",
      "She-wolf (lupa)": "Avarice / incontinence",
    },
    explanation:
      "There are competing allegorical schemes (Boccaccio, Singleton, Hollander). The matching here gives one canonical mapping, including each beast’s alternate gloss. Dante deliberately makes the figures vivid before fixing them.",
    citation: "Inferno I.32–60",
  },
  {
    id: "inferno-c1-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Virgil offers immediately to lead Dante up the sunlit hill.",
    correctBool: false,
    tfReasons: [
      "He says they must go by another road — through Hell and the Mountain — because the way up the bright hill is closed by the beasts.",
      "He proposes climbing the hill at once and warning Dante of the beasts on the slope.",
      "He says he will leave Dante and send a stronger guide.",
      "He says no path is open at all.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Virgil’s programme is the architecture of the poem: a different and longer road. The shape of the Comedy is given in his answer to the Pilgrim’s plea.",
    citation: "Inferno I.91–105",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "inferno-c1-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why does Virgil refer to himself in Canto I as “born sub Iulio, although it was late” and as having lived under Augustus?",
    options: [
      "To indicate that he is younger than Statius",
      "To locate himself precisely in pagan Roman history — born too late for Republican Rome, alive under the empire that was, in Dante’s reading, providential",
      "To identify himself as a Christian convert",
      "To suggest he is a contemporary of the Pilgrim",
    ],
    correctIndex: 1,
    explanation:
      "Virgil’s self-introduction is a tight historiographical capsule: he comes after the Republic but stands under the providential Augustan settlement Dante invokes throughout the Monarchia and the Comedy.",
    citation: "Inferno I.70–75",
  },
  {
    id: "inferno-c1-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What is the formal verse pattern of the Commedia, established already in Canto I?",
    options: [
      "Heroic couplets",
      "Terza rima — three-line tercets with interlocking rhyme aba bcb cdc",
      "Ottava rima",
      "Blank hendecasyllables",
    ],
    correctIndex: 1,
    explanation:
      "Terza rima is Dante’s invention. The interlocking ABA BCB CDC scheme produces a continuous forward chain mirroring the journey itself; the triple rhyme echoes the Trinity.",
    citation: "Inferno I (form)",
  },
  {
    id: "inferno-c1-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "Virgil names his task: he will lead Dante through the place where one hears “the despairing shrieks of the ancient ____ who call out for the second death.”",
    correctText: "spirits",
    acceptedVariants: ["souls", "shades"],
    explanation:
      "I.115–117. The “second death” is the hell whose horror Virgil knows but cannot share — a damnation he will see Dante through but cannot see his own way out of.",
    citation: "Inferno I.115–117",
  },
  {
    id: "inferno-c1-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“And as he is, who willingly acquires, and the time arrives that causes him to lose, who weeps in all his thoughts and is downcast — even such made me that beast without repose.”",
    identificationSubject: "book",
    options: ["Petrarch, Canzoniere", "Dante, Inferno", "Boccaccio, Decameron", "Tasso, Gerusalemme Liberata"],
    correctIndex: 1,
    explanation:
      "The simile is one of the canto’s most compressed: the man who profits and then loses — a Florentine, mercantile image — applied to the Pilgrim’s loss of the slope. The simile’s genre and meter mark Inferno I unmistakably.",
    citation: "Inferno I.55–60",
  },
  {
    id: "inferno-c1-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Canto I is properly the prologue to the entire Comedy, not only to the Inferno.",
    correctBool: true,
    tfReasons: [
      "Hell is 33 cantos plus this prologue, so Canto I serves the structure of the whole 100-canto poem; it sets up themes — exile, memory, salvation — that Purgatorio and Paradiso will resolve.",
      "Canto I is properly part only of Inferno and has no relation to the other canticles.",
      "Canto I is a late addition by an editor.",
      "Canto I exists separately from the Comedy proper.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The 1+33+33+33 structure — prologue plus three canticles of 33 — gives the Comedy its 100. Canto I is the prologue of the whole, not Inferno’s alone.",
    citation: "Inferno I; structure of the Comedy",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Canto II — The Journey Commissioned
// ─────────────────────────────────────────────────────────────────────────────

const CANTO_II: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "inferno-c2-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What time of day does Canto II begin in?",
    options: ["Dawn", "Midday", "Evening, with day departing", "Midnight"],
    correctIndex: 2,
    explanation:
      "Lo giorno se n’andava — “The day was going.” The journey proper begins at twilight. The temporal frame is exact: from this evening through Holy Saturday and out to Easter dawn.",
    citation: "Inferno II.1–6",
  },
  {
    id: "inferno-c2-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Who appears to Virgil in Limbo and asks him to find the lost pilgrim?",
    options: ["Mary", "Saint Lucy", "Beatrice", "Rachel"],
    correctIndex: 2,
    explanation:
      "Beatrice descends to Limbo to commission Virgil. The chain of intercession — Mary to Lucy to Beatrice to Virgil — is the theological architecture of the poem’s salvation plot.",
    citation: "Inferno II.52–117",
  },
  {
    id: "inferno-c2-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Beatrice tells Virgil that she comes from a place to which she longs to return; love has moved her, the love which makes her ____.",
    correctText: "speak",
    explanation:
      "II.72. Amor mi mosse, che mi fa parlare. Beatrice’s speech to Virgil is the most-quoted statement of the poem’s Christian erotic theology: love both initiates the journey and gives the speaker her tongue.",
    citation: "Inferno II.72",
  },
  {
    id: "inferno-c2-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "He hesitates at the threshold of the journey, comparing himself to Aeneas and Saint Paul and asking, “but I — why come I? or who concedes it?”",
    identificationSubject: "speaker",
    options: ["Virgil", "Dante the Pilgrim", "Beatrice", "Saint Lucy"],
    correctIndex: 1,
    explanation:
      "II.10–35: Dante’s “io non Enëa, io non Paulo sono.” The hesitation is the moral core of Canto II — the journey requires not only a guide but a willingness to take the place of the Aeneid and Acts.",
    citation: "Inferno II.10–35",
  },
  {
    id: "inferno-c2-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Canto II is the only canto in the Comedy in which Beatrice and Virgil appear together.",
    correctBool: false,
    tfReasons: [
      "They appear together at the summit of Purgatory in Purgatorio XXX — Virgil disappears as Beatrice arrives — and her presence in II is reported, not staged.",
      "True — they appear together only here.",
      "Beatrice never appears in Inferno at all.",
      "Virgil and Beatrice are present together in every canticle.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Beatrice’s arrival in Purgatorio XXX is the great structural pivot of the poem; in Canto II she is reported by Virgil. The two figures of guidance share no scene proper in Hell.",
    citation: "Inferno II; Purgatorio XXX",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "inferno-c2-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What three female figures together commission Dante’s journey?",
    options: [
      "Mary, Lucy, and Beatrice",
      "Beatrice, Rachel, and Eve",
      "Mary, Catherine, and Beatrice",
      "Beatrice, Lucy, and Catherine",
    ],
    correctIndex: 0,
    explanation:
      "Mary unbinds heaven in pity; Lucy is sent to Beatrice; Beatrice descends to Virgil. The chain is Marian-mariological, with Lucy (St. Lucy of Syracuse, Dante’s patroness against eye-trouble) at the centre.",
    citation: "Inferno II.94–117",
  },
  {
    id: "inferno-c2-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Why is the comparison to Aeneas (Aeneid VI) and Paul (II Corinthians 12) the point Dante hesitates at in Canto II?",
    options: [
      "Because he wants to flatter Virgil",
      "Because both are predecessors who descended (or were caught up) into the otherworld with sanction — and Dante must claim to be in their company without that sanction yet visible",
      "Because both are Roman heroes",
      "Because both are mentioned in the Commedia’s table of contents",
    ],
    correctIndex: 1,
    explanation:
      "Aeneas’s katabasis founded Rome; Paul’s rapture founded Christianity. The two precedents authorise extraordinary travel between worlds. Dante’s hesitation is precisely that he is not yet either; the rest of the canto answers him.",
    citation: "Inferno II.13–33",
  },
  {
    id: "inferno-c2-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "The Pilgrim’s hesitation breaks when he hears Virgil report Beatrice’s mission, and he says: O ____, courteous Mantuan soul, whose fame still in the world endures.",
    correctText: "anima",
    acceptedVariants: ["soul"],
    explanation:
      "II.58 — anima cortese mantovana. The Pilgrim addresses Virgil with the Italian word that runs through the canto, claiming Virgil for both Mantua and a continuing fame in the upper world.",
    citation: "Inferno II.58",
  },
  {
    id: "inferno-c2-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“She is so blessed and so lovely a thing that no act of speech is enough to capture her smile.”",
    identificationSubject: "character",
    options: ["Mary", "Beatrice", "Saint Lucy", "Rachel"],
    correctIndex: 1,
    explanation:
      "The unmistakable Beatrice, named by Virgil to Dante after a dense passage of indirect description. The Comedy makes her by accumulation: a name held off until both the Pilgrim and the reader can recognise it.",
    citation: "Inferno II.55–57",
  },
  {
    id: "inferno-c2-sch-order-1",
    type: "ordering",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Order the chain of intercession that brings Virgil to Dante.",
    options: [
      "Mary takes pity on Dante",
      "Lucy is sent to Beatrice",
      "Beatrice descends to Virgil in Limbo",
      "Virgil ascends to Dante on the slope",
    ],
    correctOrder: [
      "Mary takes pity on Dante",
      "Lucy is sent to Beatrice",
      "Beatrice descends to Virgil in Limbo",
      "Virgil ascends to Dante on the slope",
    ],
    explanation:
      "The descending chain — Mary → Lucy → Beatrice → Virgil → Dante — is the theological structure of the poem’s opening movement. Each step traverses the order of grace.",
    citation: "Inferno II.94–117",
  },
  {
    id: "inferno-c2-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Virgil says he was already on his way to help Dante before Beatrice asked him.",
    correctBool: false,
    tfReasons: [
      "Virgil is sent only on Beatrice’s commission; she descends and he obeys, agreeing to help only because of love and grace.",
      "Virgil claims to have come of his own initiative.",
      "Virgil refuses to help and is overruled by Beatrice.",
      "Virgil claims he was sent by Apollo.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Virgil’s assistance is mediated grace: he acts because Beatrice requests, she because Lucy, Lucy because Mary. The poem refuses any picture of pagan virtue self-sufficiently saving a soul.",
    citation: "Inferno II.52–93",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "inferno-c2-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What does Beatrice’s opening of her speech to Virgil — “O Mantuan spirit courteous” — accomplish?",
    options: [
      "It honours Virgil’s pagan virtue while binding it to a Christian errand of love",
      "It scorns Virgil for his paganism",
      "It mistakes Virgil for Aeneas",
      "It demands Virgil’s silence",
    ],
    correctIndex: 0,
    explanation:
      "Beatrice’s address recognises Virgil as “anima cortese” — the courtly virtue Dante most admires in the pre-Christian world — and folds it into a salvific purpose for which he himself is too late. The diction is studiedly tactful.",
    citation: "Inferno II.58–60",
  },
  {
    id: "inferno-c2-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why does Beatrice tell Virgil “I am one whom not even the fire of this place can hurt”?",
    options: [
      "Because she is invisible to the damned",
      "Because charity holds her secure: the love of God shields her from the harm Limbo imposes on its own",
      "Because she has been granted special permission by Mary",
      "Because Virgil promises to carry her through",
    ],
    correctIndex: 1,
    explanation:
      "II.91–93. The line is theologically precise: caritas, not status, makes Beatrice immune. The Comedy’s ontology of love as moral force is here stated almost in passing.",
    citation: "Inferno II.91–93",
  },
  {
    id: "inferno-c2-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "The flower that closes Canto II — Dante’s steadied resolve — is given by the simile of small ____ closed by the cold of night and opening when the sun shines on them.",
    correctText: "flowers",
    acceptedVariants: ["fioretti"],
    explanation:
      "Quali i fioretti, dal notturno gelo… The simile of the little flowers — fioretti — opening at sunrise gives the canto its title image: timidity unfolding into resolve.",
    citation: "Inferno II.127–132",
  },
  {
    id: "inferno-c2-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“Do thou go on, for one will is in both, thou leader, thou lord, and master.”",
    identificationSubject: "speaker",
    options: ["Beatrice", "Virgil", "Dante to Virgil", "Cato"],
    correctIndex: 2,
    explanation:
      "Tu duca, tu segnore, e tu maestro — II.140. The Pilgrim’s formal acceptance of Virgil as guide; the triple title settles the relationship that will hold across Inferno and most of Purgatorio.",
    citation: "Inferno II.139–142",
  },
  {
    id: "inferno-c2-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Canto II is conventionally read as the canto of the journey’s authorisation.",
    correctBool: true,
    tfReasons: [
      "Canto I describes the failure of the upward path; Canto II provides the sanction — by name and by chain of intercession — that makes the long descent possible.",
      "Canto II describes the entry into the first circle.",
      "Canto II is a digression unrelated to the journey.",
      "Canto II contains the punishment of Francesca.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Canto I sets the problem; Canto II names the figures who authorise its solution; Canto III opens the Hell proper. The triptych is the architecture of the poem’s opening.",
    citation: "Inferno I–III",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Canto III — The Gate of Hell
// ─────────────────────────────────────────────────────────────────────────────

const CANTO_III: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "inferno-c3-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What inscription is carved over the gate of Hell in Canto III?",
    options: [
      "“Salvation lies within”",
      "“Through me the way into the woeful city … abandon every hope, ye who enter”",
      "“Behold the punishments of the wicked”",
      "“Here justice fails”",
    ],
    correctIndex: 1,
    explanation:
      "Per me si va nella città dolente … lasciate ogne speranza, voi ch’intrate. The famous inscription summarises the metaphysics of Inferno: a place fashioned by divine power, wisdom, and primal love whose first instruction is the loss of hope.",
    citation: "Inferno III.1–9",
  },
  {
    id: "inferno-c3-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Who are the souls of the vestibule, just inside the gate?",
    options: [
      "Heretics",
      "The neutrals — those who lived without infamy and without praise",
      "Suicides",
      "Tyrants",
    ],
    correctIndex: 1,
    explanation:
      "The vestibule holds the ignavi, those who lived without taking sides — neither rebels nor faithful to God. Heaven cannot have them; deep Hell will not. They run after a featureless banner, stung by wasps and hornets.",
    citation: "Inferno III.34–69",
  },
  {
    id: "inferno-c3-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Abandon every ____, ye who enter.",
    correctText: "hope",
    acceptedVariants: ["speranza"],
    explanation:
      "Lasciate ogne speranza, voi ch’intrate — line 9 of Canto III. The most quoted line of Inferno after the opening tercet.",
    citation: "Inferno III.9",
  },
  {
    id: "inferno-c3-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "He is the white-haired ferryman who calls woe to all the wicked spirits, beating with his oar any who linger.",
    identificationSubject: "character",
    options: ["Phlegyas", "Charon", "Minos", "Geryon"],
    correctIndex: 1,
    explanation:
      "Charon, taken from Aeneid VI and re-cast as a demon in Christian Hell. His hostile reception of the living Pilgrim is one of the canto’s most quoted moments.",
    citation: "Inferno III.82–111",
  },
  {
    id: "inferno-c3-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Charon ferries Dante across the Acheron in his boat.",
    correctBool: false,
    tfReasons: [
      "He refuses to take a living man; the canto ends with an earthquake and a faint, and Dante wakes on the far bank without remembering how he crossed.",
      "Charon ferries him across with the others, complaining all the way.",
      "Virgil ferries him across instead.",
      "An angel carries him across.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The crossing is occluded — a deliberate narrative blank. Virgil placates Charon with the sufficient-cause formula (vuolsi così colà dove si puote) and the Pilgrim’s loss of consciousness substitutes for the act.",
    citation: "Inferno III.94–136",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "inferno-c3-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What three triune attributes are named in the inscription as the makers of Hell?",
    options: [
      "Faith, hope, and charity",
      "Power, wisdom, and primal love (la divina podestate, la somma sapienza e ’l primo amore)",
      "Justice, mercy, and patience",
      "Father, Son, and Spirit",
    ],
    correctIndex: 1,
    explanation:
      "The inscription names a Trinitarian making: divine power (the Father), highest wisdom (the Son), and primal love (the Holy Spirit). Hell, the canto insists, is a work of love.",
    citation: "Inferno III.4–6",
  },
  {
    id: "inferno-c3-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Whom does the Pilgrim seem to recognise among the neutrals?",
    options: [
      "Brunetto Latini",
      "“Him who, through cowardice, made the great refusal”",
      "Pier delle Vigne",
      "His own father",
    ],
    correctIndex: 1,
    explanation:
      "Colui che fece per viltade il gran rifiuto — III.59–60. Most readers identify the figure with Pope Celestine V, whose 1294 abdication opened the way for Boniface VIII; Dante does not name him.",
    citation: "Inferno III.55–60",
  },
  {
    id: "inferno-c3-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "When Charon refuses, Virgil silences him with the formula: ____ così colà dove si puote ciò che si vuole.",
    correctText: "vuolsi",
    explanation:
      "It is willed there where what is willed can be done. Virgil uses the same formula at the gates of Dis (Inferno V.23–24) — a phrase that names the divine permission that authorises the journey.",
    citation: "Inferno III.94–96",
  },
  {
    id: "inferno-c3-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“These have no hope of death.”",
    identificationSubject: "speaker",
    options: ["Charon", "Virgil", "Beatrice", "Dante the Pilgrim"],
    correctIndex: 1,
    explanation:
      "III.46 — Virgil’s comment on the neutrals. The line tightens the hopelessness of Hell into something more terrible than damnation: a state from which even oblivion is denied.",
    citation: "Inferno III.46",
  },
  {
    id: "inferno-c3-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each region/figure of Canto III to the role it plays.",
    matchingLeft: ["Inscription", "Vestibule (Ignavi)", "The great refuser", "Charon"],
    matchingRight: [
      "Names the Trinitarian causes of Hell and forbids hope",
      "Houses the neutrals — neither rebel nor faithful to God",
      "Pope Celestine V (by tradition), naming a refusal of office and grace",
      "Ferryman of the Acheron, refused by the living Pilgrim",
    ],
    correctPairs: {
      Inscription: "Names the Trinitarian causes of Hell and forbids hope",
      "Vestibule (Ignavi)": "Houses the neutrals — neither rebel nor faithful to God",
      "The great refuser": "Pope Celestine V (by tradition), naming a refusal of office and grace",
      Charon: "Ferryman of the Acheron, refused by the living Pilgrim",
    },
    explanation:
      "The four landmarks of Canto III work as a moral progression: the architecture of Hell, the punishment of refusing to choose, the great example of refusal, and the gatekeeping figure that confirms the journey’s authorisation.",
    citation: "Inferno III",
  },
  {
    id: "inferno-c3-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Canto III is structured to establish the metaphysical and political contracts of Hell before any sinner is named.",
    correctBool: true,
    tfReasons: [
      "Inscription, vestibule, ferryman: the canto installs the metaphysics, the moral border, and the gatekeeper before any of the named damned appear in II’s circles.",
      "Canto III is a digression on Florentine politics with no doctrinal purpose.",
      "Canto III concerns only Charon and is otherwise unrelated to Hell’s structure.",
      "Canto III is a continuation of Canto I, with no new material of its own.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Reading Cantos I, II, III as architecture: dilemma, sanction, threshold. Only at Canto IV does the topographic descent into named circles begin.",
    citation: "Inferno I–IV",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "inferno-c3-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why are the ignavi denied entrance even into the first proper circle of Hell?",
    options: [
      "Because their sins were too few",
      "Because they refused to take any side, including in the rebellion of the angels — and so are unwelcome to either Heaven or deep Hell",
      "Because they are awaiting later trials",
      "Because they are kept here as a warning to the living",
    ],
    correctIndex: 1,
    explanation:
      "Dante extends the angelic rebellion to mortal moral life: even Hell will not have those who would not choose. The vestibule punishment sharpens neutrality into a worse-than-damnation.",
    citation: "Inferno III.34–51",
  },
  {
    id: "inferno-c3-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Charon’s appearance is a Christianised version of which classical model?",
    options: [
      "The ferryman in Aeneid VI, where he refuses Aeneas without a Sibyl’s sign",
      "Hermes Psychopompos in the Odyssey",
      "The waters of the Styx in Plato’s Phaedrus",
      "The Acherusian lake in Plutarch",
    ],
    correctIndex: 0,
    explanation:
      "Aeneid VI.295–316 stands behind III.82–111 in nearly every detail — the eyes of fire, the white beard, the refusal of the living. Dante turns him into a demon while keeping every Virgilian feature.",
    citation: "Inferno III.82–111; Aeneid VI.295–316",
  },
  {
    id: "inferno-c3-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "The neutrals run after a banner that turns continually and never ____.",
    correctText: "rests",
    acceptedVariants: ["stops", "ceases"],
    explanation:
      "III.52–54. The endlessly turning standard is the perfect emblem of moral indeterminacy — perpetual movement that goes nowhere, an infernal version of refusing to choose.",
    citation: "Inferno III.52–54",
  },
  {
    id: "inferno-c3-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“Justice impelled my high maker; divine power made me, the highest wisdom, and primal love.”",
    identificationSubject: "book",
    options: [
      "Petrarch, Trionfi",
      "Dante, Inferno",
      "Boccaccio, Genealogia Deorum",
      "Aquinas, Summa Theologiae",
    ],
    correctIndex: 1,
    explanation:
      "The inscription on the gate of Hell — III.4–6. The line is the poem’s most concise statement of the doctrine that Hell is the work, not the failure, of love.",
    citation: "Inferno III.4–6",
  },
  {
    id: "inferno-c3-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The Pilgrim’s loss of consciousness at the end of Canto III is purely a narrative convenience to elide the crossing of Acheron.",
    correctBool: false,
    tfReasons: [
      "The faint marks the limit of waking representation: the boundary between the living and the dead is not narratable directly, and the poem says so by going dark.",
      "It is a pure convenience and has no meaning.",
      "It indicates Dante’s spiritual unworthiness.",
      "It is a manuscript variant adopted by some editors.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The deliberate blank is theological: the crossing into the realm of the dead is precisely what the living self cannot witness. The poem will repeat the device at the entrance to Dis.",
    citation: "Inferno III.130–136",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export const INFERNO_I_III_TRIALS: Record<number, ChapterQuestion[]> = {
  0: CANTO_I,
  1: CANTO_II,
  2: CANTO_III,
}
