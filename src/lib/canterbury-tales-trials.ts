/**
 * Canterbury Tales chapter trials — General Prologue, per-tale trials,
 * and capstone trials for the pilgrimage as a whole.
 *
 * ChapterIndex layout (matches public/content/the-canterbury-tales/ch-*.json):
 *    0 — The General Prologue
 *    1 — The Knight's Tale
 *    2 — The Miller's Tale
 *    3 — The Reeve's Tale
 *    4 — The Cook's Tale
 *    5 — The Man of Law's Tale
 *    6 — The Wife of Bath's Tale (with her long Prologue)
 *    7 — The Friar's Tale
 *    8 — The Sompnour's Tale
 *    9 — The Clerk's Tale
 *   10 — The Merchant's Tale
 *   11 — The Squire's Tale
 *   12 — The Franklin's Tale
 *   13 — The Doctor's Tale
 *   14 — The Pardoner's Tale (with the Pardoner's Prologue)
 *   15 — The Shipman's Tale
 *   16 — The Prioress's Tale
 *   17 — Chaucer's Tale of Sir Thopas (parody)
 *   18 — Chaucer's Tale of Meliboeus (prose)
 *   19 — The Monk's Tale
 *   20 — The Nun's Priest's Tale
 *   21 — The Second Nun's Tale
 *   22 — The Canon's Yeoman's Tale
 *   23 — The Manciple's Tale
 *   24 — The Parson's Tale (prose sermon)
 *   25 — Chaucer's Retractions
 *
 *   26 — Canterbury Master Trial (awards the "Pilgrim of Canterbury" Seal)
 *   27 — Middle English Reader stretch (awards the "Englisc Tongue" Seal
 *        when combined with Beowulf / Malory / Gawain)
 *
 * Coverage policy:
 *   - The canonically-taught tales (General Prologue, Miller, Wife of
 *     Bath, Pardoner, Nun's Priest, and Retractions) carry 3–5
 *     questions each across Foundational/Scholar/Sage.
 *   - Other tales carry 1–2 Foundational questions.
 *   - Middle English spelling is preserved in question text where it
 *     matters (e.g. *whan*, *bifil*, *wol*, *eek*).
 *
 * Merged at lookup time by `getQuestionsForChapter` in
 * chapter-questions.ts. Schema matches `ChapterQuestion` there.
 *
 * Translation reference: William Wilson Purves's 1870 regularization
 * (Standard Ebooks edition) — Middle English preserved with minimal
 * modernization. Most quoted phrasing follows the Ellesmere manuscript
 * tradition.
 */

import type { ChapterQuestion } from "./chapter-questions"

export const CANTERBURY_TALES_TRIALS: Record<number, ChapterQuestion[]> = {

  // ── The General Prologue ───────────────────────────────────────
  0: [
    {
      id: "ct-gp-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The General Prologue begins with a long sentence about what season?",
      options: [
        "Midwinter at Candlemas",
        "April — *Whan that Aprille with his shoures soote / The droghte of March hath perced to the roote*",
        "Midsummer at St John's Day",
        "Autumn after harvest",
      ],
      correctIndex: 1,
      explanation:
        "The opening 18 lines are a single sentence (often called *the* great sentence of Middle English). Spring rain pierces winter's drought; birds cannot sleep for love; and so pilgrims go to Canterbury. The private erotic awakening of nature flows directly into the public religious pilgrimage — Chaucer's most elegant structural joke.",
    },
    {
      id: "ct-gp-2",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "How many pilgrims does Chaucer describe (plus himself and the Host) riding out of the Tabard Inn at Southwark?",
      options: ["Ten", "Twenty-nine", "Forty-two", "One hundred"],
      correctIndex: 1,
      explanation:
        "*Wel nyne and twenty in a compaignye.* Chaucer-the-pilgrim makes thirty, the Host makes thirty-one. The projected plan (four tales each, two going and two returning) would have been 120 tales; we have 24 completed tales. The unfinished state is part of the poem's meaning.",
    },
    {
      id: "ct-gp-3",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The Knight is described in idealized terms, but Chaucer includes which telling detail?",
      options: [
        "He has never fought in a real battle",
        "His *gypon* (tunic) is still stained and 'al bismotered with his habergeon' — he comes to the pilgrimage directly from military service, unchanged",
        "He mocks chivalric ideals",
        "He refuses to speak to the other pilgrims",
      ],
      correctIndex: 1,
      explanation:
        "The Knight's armor-stained tunic signals haste and authenticity: he has come straight from campaign to pilgrimage. It also permits readers (medieval and modern) to hear the portrait's idealizing language as either genuine praise or quiet irony — Jill Mann's reading of the portrait as both is now standard.",
    },
    {
      id: "ct-gp-4",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Which pilgrim's portrait ends with the devastating line *If gold ruste, what shal iren do*?",
      options: [
        "The Knight",
        "The Poor Parson — whose rural-priestly virtue is contrasted with the manifest corruption of higher clergy; if the gold of the priesthood is rusting, what will happen to the iron of the laity?",
        "The Prioress",
        "The Summoner",
      ],
      correctIndex: 1,
      explanation:
        "The Parson's portrait is the Prologue's ethical center: a country priest who practices what he preaches. *If gold ruste* is Chaucer's general accusation against the Church of his day. The Parson is the only pilgrim not ironized and the only one eventually given a full prose sermon (Tale 24).",
    },
    {
      id: "ct-gp-5",
      type: "true_false",
      difficulty: "Master",
      xpReward: 15,
      text: "The Host, Harry Bailly, proposes the tale-telling contest partly to increase his own business and turn the pilgrimage into a social event.",
      correctBool: true,
      explanation:
        "Harry Bailly's rules — tales on the way there, tales on the way back, and supper at his Tabard for whoever tells the best tale — are designed to bring the pilgrims back to his inn. Commerce and devotion run in parallel, as with April's rain and pilgrimage: Chaucer never separates them.",
    },
  ],

  // ── Knight's Tale ──────────────────────────────────────────────
  1: [
    {
      id: "ct-kt-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Knight's Tale — a Boethian philosophical romance — is Chaucer's adaptation of what Italian poem?",
      options: [
        "Dante's Commedia",
        "Boccaccio's *Teseida* (a twelve-book epic on Theseus)",
        "Petrarch's *Trionfi*",
        "Ariosto's *Orlando Furioso*",
      ],
      correctIndex: 1,
      explanation:
        "Chaucer compresses Boccaccio's twelve-book *Teseida* into a single Canterbury tale. The philosophical scaffolding — Boethian consolation on the 'faire cheyne of love' — is Chaucer's own addition.",
    },
    {
      id: "ct-kt-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Theseus's 'First Mover' speech at the end of the tale argues what?",
      options: [
        "That love is pointless",
        "That the whole cosmic order is held together by love — *The firste moevere of the cause above* — and that accepting death as part of this order is the only wise course",
        "That Arcite deserved to die",
        "That knights should renounce war",
      ],
      correctIndex: 1,
      explanation:
        "The First Mover speech (the tale's climactic consolation) draws on Boethius's *Consolation of Philosophy* IV.vi. Theseus's 'faire cheyne of love' is the cosmic bond holding the elements and the fates together; the proper human response to death is not grief but acceptance.",
    },
  ],

  // ── Miller's Tale ──────────────────────────────────────────────
  2: [
    {
      id: "ct-mt-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Miller insists on telling the next tale. What does his tale do in relation to the Knight's?",
      options: [
        "Continues the philosophy",
        "*Quites* it — paying it back, parodying it, answering aristocratic romance with a bourgeois fabliau",
        "Ignores it completely",
        "Apologizes for it",
      ],
      correctIndex: 1,
      explanation:
        "*Quiting* is the engine of the Canterbury Tales. Each tale answers (or is answered by) another; the Miller's fabliau retort to the Knight's romance — carpenter, student, wife, parish clerk, a misdirected kiss, a branding iron, and a flood — is Chaucer's great demonstration of comic inversion.",
    },
    {
      id: "ct-mt-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Absolon kisses Alison's *nether ye* (nether eye) — mistaking which body part for another?",
      options: [
        "Mouth for ear",
        "Face for buttocks — she has leaned out the window and presented her bare bottom in the dark",
        "Hand for face",
        "Nose for mouth",
      ],
      correctIndex: 1,
      explanation:
        "The misdirected kiss — one of the most famous scenes in medieval comedy — is the fabliau's structural pivot. Absolon's shame then produces the branding-iron retaliation that causes Nicholas to cry 'Water!' — which triggers John the carpenter (who thinks Noah's flood is starting) to cut the rope and crash down.",
    },
    {
      id: "ct-mt-3",
      type: "true_false",
      difficulty: "Master",
      xpReward: 15,
      text: "The Miller's Tale's cry of 'Water!' by Nicholas is both a realistic response (to a burned rear) and a structural callback — the whole fabliau was set in motion by Nicholas's fabricated prediction of a second Noah's flood.",
      correctBool: true,
      explanation:
        "Nicholas cries 'Water!' for pain and is answered by John cutting the rope — thinking the prophesied flood has come. Chaucer's comic architecture joins prophecy and slapstick: the fabricated flood-story produces a real small disaster when Nicholas actually needs water.",
    },
  ],

  // ── Reeve's Tale ──────────────────────────────────────────────
  3: [
    {
      id: "ct-reeve-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Reeve's Tale retaliates against the Miller's Tale by doing what?",
      options: [
        "Praising millers",
        "Telling a fabliau in which a dishonest miller is cuckolded and humiliated — the Reeve (a carpenter by training) is paying back the Miller for his anti-carpenter joke",
        "Changing the subject",
        "Refusing to tell a tale",
      ],
      correctIndex: 1,
      explanation:
        "The Reeve, trained as a carpenter, took the Miller's joke personally. His tale about a cheating miller is direct tit-for-tat — the second move in the *quiting* game of the Fragment.",
    },
  ],

  // ── Cook's Tale (fragmentary) ──────────────────────────────────
  4: [
    {
      id: "ct-cook-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Cook's Tale is:",
      options: [
        "A complete fabliau",
        "A fragment — it breaks off mid-sentence after about 60 lines",
        "The longest tale",
        "A prose moral treatise",
      ],
      correctIndex: 1,
      explanation:
        "The Cook's Tale breaks off mid-sentence; whether Chaucer abandoned it as beneath his standards, or whether it was lost, is a standard editorial question. Most editions print the fragment and move on to Fragment II.",
    },
  ],

  // ── Man of Law's Tale ──────────────────────────────────────────
  5: [
    {
      id: "ct-mol-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Man of Law's Tale is the story of Constance — an adaptation of what?",
      options: [
        "Greek tragedy",
        "A saint's-life romance, probably via the Anglo-Norman chronicler Trivet; Constance is cast adrift twice and survives by divine providence",
        "A French fabliau",
        "A Biblical parable",
      ],
      correctIndex: 1,
      explanation:
        "Constance's double exile — first to Syria, then to Northumbria — is a saint's-life plot dressed as romance. The tale's obsession with providence contrasts the pagan gods of the Knight's Tale.",
    },
  ],

  // ── Wife of Bath's Prologue & Tale ─────────────────────────────
  6: [
    {
      id: "ct-wob-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Wife of Bath's Prologue opens with what declaration?",
      options: [
        "That she has never married",
        "*Experience, though noon auctoritee / Were in this world, is right ynogh for me* — experience, even in the absence of written authority, is enough",
        "That she regrets everything",
        "That she will quote Augustine",
      ],
      correctIndex: 1,
      explanation:
        "The Wife's opening defiance — experience as its own authority — is Chaucer's most radical speech-act: a lay, unlettered, female voice claiming the right to theological interpretation without clerical backing. Her Prologue then quotes scripture (fluently) and ransacks authority (strategically).",
    },
    {
      id: "ct-wob-2",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "How many husbands has the Wife of Bath had?",
      options: [
        "Three",
        "Five — *Housbondes at chirche dore I have had fyve* — and she describes them in detail, four dead and one (Jankin) living",
        "Seven",
        "Two",
      ],
      correctIndex: 1,
      explanation:
        "Five husbands at the church door: three good (the wealthy old men who died and left her their property), two bad (young men she chose for love, including the clerk Jankin who read her the book of 'wicked wives'). Her Prologue is a systematic meditation on marriage, authority, and mastery.",
    },
    {
      id: "ct-wob-3",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The Wife's fifth husband, Jankin, reads her passages from what book, provoking her to tear the leaves and get struck on the ear — deafening her?",
      options: [
        "The Bible",
        "A composite *boke of wikked wyves* — containing Theophrastus, Jerome against Jovinian, Walter Map, Ovid — the standard clerical anti-feminist corpus bound into one volume",
        "The *Romance of the Rose*",
        "A French fabliau collection",
      ],
      correctIndex: 1,
      explanation:
        "The 'book of wicked wives' is the ironic engine of the Prologue: Jankin's clerical misogyny is exactly what the Wife's experience refutes. Her tearing of the book — and the consequent physical violence — dramatizes the contest between written authority and lived experience.",
    },
    {
      id: "ct-wob-4",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The Wife's *tale* (as opposed to her Prologue) is an Arthurian romance whose answer to the question 'What do women most desire?' is:",
      options: [
        "Youth and beauty",
        "*Maistrie* — sovereignty, mastery — over their husbands and their own persons",
        "Riches",
        "Silence",
      ],
      correctIndex: 1,
      explanation:
        "The knight's quest to answer the question (on pain of death) produces the answer: *maistrie*. The tale then dramatizes what happens when a husband (the knight) grants *maistrie* to a wife (the loathly lady) — who, freed of struggle, becomes beautiful and faithful. The Wife's tale is an idealized solution to her Prologue's autobiographical problem.",
    },
  ],

  // ── Friar's Tale ──────────────────────────────────────────────
  7: [
    {
      id: "ct-friar-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Friar's Tale is an anti-summoner fabliau in which a corrupt summoner meets:",
      options: [
        "An angel",
        "A yeoman-devil, who teaches him that demons take souls only when they are sincerely given over",
        "His ex-wife",
        "A monk",
      ],
      correctIndex: 1,
      explanation:
        "The summoner rides with a disguised devil and bullies an old widow; when she sincerely curses him to the devil, the devil claims him. The tale is the Friar's attack on the Summoner, part of their inter-pilgrim feud.",
    },
  ],

  // ── Sompnour's (Summoner's) Tale ───────────────────────────────
  8: [
    {
      id: "ct-som-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Summoner retaliates against the Friar with a tale whose punchline is:",
      options: [
        "A prayer",
        "A fart divided twelve ways — a friar's greed rewarded with a distribution puzzle in wind",
        "A quiet agreement",
        "A miracle",
      ],
      correctIndex: 1,
      explanation:
        "A bedridden old man promises the friar a 'gift' that must be divided equally among twelve friars; the gift turns out to be a fart, and the resulting twelve-way division is the tale's grotesque climax. It is the Summoner's direct answer to the Friar's Tale.",
    },
  ],

  // ── Clerk's Tale — Patient Griselda ────────────────────────────
  9: [
    {
      id: "ct-clerk-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Clerk's Tale — Patient Griselda — is Chaucer's translation of Petrarch's Latin version of which source?",
      options: [
        "Ovid",
        "Boccaccio's *Decameron* X.10 — the final tale of Boccaccio's collection",
        "Cicero",
        "Virgil",
      ],
      correctIndex: 1,
      explanation:
        "The Griselda story runs: Boccaccio (Italian, 1351) → Petrarch (Latin, c.1373) → Chaucer (Middle English, c.1390). Chaucer cites Petrarch, not Boccaccio; the literary relay is visible in the tale's Latinate vocabulary.",
    },
    {
      id: "ct-clerk-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The Clerk ends his tale with an envoy directly answering whom?",
      options: [
        "The Prioress",
        "The Wife of Bath — the six-stanza 'Lenvoy de Chaucer' mocks Griselda's patience and urges wives to *be not oppressed*; the Clerk, a bookish celibate, salutes the Wife with a poem that reads like her Prologue reversed",
        "The Host",
        "The Knight",
      ],
      correctIndex: 1,
      explanation:
        "The Lenvoy — *Grisilde is deed, and eek hire pacience* — is the Clerk's amused concession to the Wife: maybe Griselda's patience is not a model for actual marriages. The Fragment IV–V tale-group is built around the marriage question the Wife opened in Fragment III.",
    },
  ],

  // ── Merchant's Tale ────────────────────────────────────────────
  10: [
    {
      id: "ct-merch-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Merchant's Tale stages the pear-tree adultery of which couple?",
      options: [
        "John and Alison",
        "January (an old senator, 60) and May (his young wife) — with Damyan as the lover",
        "Troilus and Criseyde",
        "Arcite and Emily",
      ],
      correctIndex: 1,
      explanation:
        "January's name is his age; May's is her youth. The pear tree — with Damyan climbing it before May joins him — becomes the site of the adultery, which Pluto restores January's sight to reveal, only for Proserpine to give May the wit to lie her way out.",
    },
  ],

  // ── Squire's Tale (unfinished) ────────────────────────────────
  11: [
    {
      id: "ct-squire-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Squire's Tale is:",
      options: [
        "A fabliau",
        "An unfinished romance featuring a brass horse, a ring, and a falcon — elements Spenser later borrowed for the Faerie Queene (Book IV)",
        "A saint's life",
        "A sermon",
      ],
      correctIndex: 1,
      explanation:
        "The Squire breaks off mid-romance (or is interrupted by the Franklin). Spenser openly completes the tale in *Faerie Queene* IV — one of the rare moments of self-acknowledged literary continuation between the two great English allegorists.",
    },
  ],

  // ── Franklin's Tale ────────────────────────────────────────────
  12: [
    {
      id: "ct-franklin-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Franklin's Tale (Arveragus, Dorigen, Aurelius) resolves its ethical puzzle by whom?",
      options: [
        "A magician who insists on payment",
        "Each character showing *gentilesse* — the knight, the squire, and the magician each release the woman from her rash promise in turn",
        "A divine intervention",
        "A death",
      ],
      correctIndex: 1,
      explanation:
        "The Franklin's Tale is Chaucer's treatise on *gentilesse* — noble behavior independent of birth. Each man in turn acts with aristocratic generosity; the Franklin (a man just beneath the gentry) is idealizing the class he wants to belong to. Chaucer lets us hear it both ways.",
    },
  ],

  // ── Doctor's Tale — Virginia ──────────────────────────────────
  13: [
    {
      id: "ct-doctor-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Doctor's Tale of Virginia — a father killing his daughter to save her virtue — is drawn from:",
      options: [
        "Ovid",
        "Livy's history of Rome, filtered through the *Romance of the Rose*",
        "The Bible",
        "Chaucer's imagination",
      ],
      correctIndex: 1,
      explanation:
        "Livy's Roman-matron story, mediated through Jean de Meun's *Rose*. The tale is the grimmest in the collection; the Host's bewildered response leads directly into the Pardoner's show-stopping performance.",
    },
  ],

  // ── Pardoner's Prologue & Tale ────────────────────────────────
  14: [
    {
      id: "ct-pard-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Pardoner's Prologue is extraordinary because:",
      options: [
        "It is in Latin",
        "The Pardoner openly confesses that he is a fraud — he preaches against avarice to collect money for himself — and then, immediately after, attempts to sell his relics to the pilgrims",
        "It praises the Church",
        "It is sung",
      ],
      correctIndex: 1,
      explanation:
        "The Pardoner's self-exposure is the most brilliant set-piece in the Tales: a swindler explaining his craft, then swindling anyway. His tale (three young rioters find Death under a tree in the form of gold coins) is the finest *exemplum* in medieval English — preached, as he tells us, entirely cynically.",
    },
    {
      id: "ct-pard-2",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Pardoner's Tale's moral refrain is:",
      options: [
        "*Vanitas vanitatum*",
        "*Radix malorum est cupiditas* — the root of [all] evils is cupidity (covetousness)",
        "*Memento mori*",
        "*Ora et labora*",
      ],
      correctIndex: 1,
      explanation:
        "1 Timothy 6:10, in the standard medieval Latin. The Pardoner preaches this text as his whole sermon; the tale illustrates it by showing three men seeking gold and finding death. The ironic gap — the Pardoner himself being *radix*-level covetous — is the Tale's engine.",
    },
    {
      id: "ct-pard-3",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "In the Pardoner's Tale, where do the three young rioters find Death?",
      options: [
        "In a tavern",
        "Under an oak tree, where an old man has directed them — but what they find is a heap of gold coins, which they then kill each other over",
        "In the plague-ridden town",
        "In a church",
      ],
      correctIndex: 1,
      explanation:
        "The old man — one of Middle English's eeriest figures — tells the rioters they will find Death under the oak. They find gold; they plot against each other; they all die. The old man's identity (Death himself? the Wandering Jew? the allegory of old age?) has never been resolved.",
    },
    {
      id: "ct-pard-4",
      type: "true_false",
      difficulty: "Master",
      xpReward: 15,
      text: "After his tale the Pardoner tries to sell his relics to the Host; the Host's furious reply (referring to the Pardoner's testicles) is so hostile that the Knight has to intervene and make them kiss.",
      correctBool: true,
      explanation:
        "The Host's obscene counter-insult is Chaucer's darkest comic moment. The Knight brokers a kiss between them, closing the fragment on a forced-peace gesture. The Pardoner's sexual ambiguity (Chaucer's innuendo in the General Prologue) has become part of the scene's final targeting.",
    },
  ],

  // ── Shipman's Tale ────────────────────────────────────────────
  15: [
    {
      id: "ct-ship-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Shipman's Tale — a fabliau about a merchant's wife, a borrowed hundred francs, and a monk — was probably originally intended for:",
      options: [
        "The Knight",
        "The Wife of Bath (the tale's narrator says *the goode wyf* speaks in the first person; most editors believe Chaucer reassigned the tale to the Shipman when he gave the Wife her own longer material)",
        "The Parson",
        "Chaucer himself",
      ],
      correctIndex: 1,
      explanation:
        "Traces in the text ('the goode wyves' speaking collectively) suggest original assignment to the Wife of Bath. The reassignment fits Chaucer's pattern of continuous revision; we have the tale as the Shipman's in every surviving manuscript.",
    },
  ],

  // ── Prioress's Tale ───────────────────────────────────────────
  16: [
    {
      id: "ct-prior-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Prioress's Tale — a *Miracle of the Virgin* about a Christian boy murdered by Jews — confronts modern readers with what problem?",
      options: [
        "Excessive length",
        "Medieval anti-Semitism is the tale's explicit content; modern editions and teaching traditions must address the anti-Jewish blood-libel it dramatizes, which Chaucer presents as devout but whose violence is manifest",
        "Difficult meter",
        "Loss of the ending",
      ],
      correctIndex: 1,
      explanation:
        "The tale is a textbook *Miracle of the Virgin*, common in the genre; the anti-Semitic violence is characteristic of medieval piety but requires explicit address in modern contexts. Honest teaching acknowledges this rather than glossing past it.",
    },
  ],

  // ── Sir Thopas (parody) ───────────────────────────────────────
  17: [
    {
      id: "ct-thopas-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Chaucer-the-pilgrim tells the Tale of Sir Thopas, which:",
      options: [
        "Is Chaucer's best work",
        "Is a deliberate parody of tail-rhyme popular romance — so bad that the Host cuts him off mid-stanza and demands a different tale",
        "Is a saint's life",
        "Never existed",
      ],
      correctIndex: 1,
      explanation:
        "Sir Thopas is Chaucer making fun of bad popular romance — in the very meter (tail-rhyme) most associated with the genre. The Host's interruption (*Namoore of this, for Goddes dignitee!*) is Chaucer's self-interruption as his own worst stylist.",
    },
  ],

  // ── Tale of Meliboeus (prose) ─────────────────────────────────
  18: [
    {
      id: "ct-melib-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Tale of Meliboeus is:",
      options: [
        "Another fabliau",
        "A long prose treatise on revenge vs. prudence — Chaucer's translation of a French moral dialogue; it is often skipped in modern teaching because its prose density is the opposite of the Tales' usual liveliness",
        "An Arthurian romance",
        "A song",
      ],
      correctIndex: 1,
      explanation:
        "Chaucer-the-pilgrim's second attempt is a long prose moralization — the exact opposite of *Sir Thopas*. Taken together, the two tales parody both popular-romance verse and scholastic-moral prose; Chaucer gives himself the two worst tales in his own collection.",
    },
  ],

  // ── Monk's Tale ───────────────────────────────────────────────
  19: [
    {
      id: "ct-monk-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Monk's Tale is a series of:",
      options: [
        "Fabliaux",
        "Tragedies — short narratives of great figures falling from high estate (Lucifer, Adam, Samson, Hercules, Nebuchadnezzar, Nero, etc.) in the medieval *de casibus* tradition",
        "Sermons",
        "Romances",
      ],
      correctIndex: 1,
      explanation:
        "The Monk's *tragedies* — drawn from Boccaccio's *De Casibus Virorum Illustrium* — are the medieval definition of 'tragedy': falls from high estate. The Knight interrupts him to stop the drumbeat of doom, introducing the Nun's Priest's Tale as comic relief.",
    },
  ],

  // ── Nun's Priest's Tale ───────────────────────────────────────
  20: [
    {
      id: "ct-npt-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Nun's Priest's Tale is:",
      options: [
        "A saint's life",
        "A mock-epic beast fable about Chauntecleer the rooster, Pertelote the hen, and Russell the fox — classical, biblical, and scholastic learning deployed over a barnyard",
        "A plain moral treatise",
        "An allegorical romance",
      ],
      correctIndex: 1,
      explanation:
        "The tale mounts vast learning — Macrobius on dreams, Aeneid VI, 1 Corinthians, Boethius, Physiologus — over a domestic fox-and-rooster story. The effect is the tale's joke: epic machinery in a henyard. It is widely considered the most accomplished tale in the collection.",
    },
    {
      id: "ct-npt-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Chauntecleer is captured by the fox because:",
      options: [
        "The fox is faster",
        "Chauntecleer accepts the fox's flattery, closes his eyes, and crows — losing his defensive vigilance; the moral is about the danger of praise and the necessity of remaining alert",
        "The fox is invisible",
        "There are no walls",
      ],
      correctIndex: 1,
      explanation:
        "The flattery-and-vigilance structure is universal in beast fable; Chaucer's *moralitas* (wisely: 'taketh the moralite') is that pleasant speech is the hunter's tool. The tale's charm is that it insists on the moral while being entirely delightful.",
    },
    {
      id: "ct-npt-3",
      type: "true_false",
      difficulty: "Master",
      xpReward: 15,
      text: "The Nun's Priest's Tale includes a Latin-and-English mock-scholarly debate between Chauntecleer and Pertelote about whether prophetic dreams are to be trusted.",
      correctBool: true,
      explanation:
        "Chauntecleer cites Cicero's *Somnium Scipionis* and St. Kenelm; Pertelote recommends herbal laxatives. The husband-wife intellectual debate in the henhouse is Chaucer's most concentrated demonstration of his dual-register style.",
    },
  ],

  // ── Second Nun's Tale — Saint Cecilia ─────────────────────────
  21: [
    {
      id: "ct-sn-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Second Nun's Tale is the *vita* of:",
      options: [
        "St Katherine",
        "St Cecilia — patroness of music; Chaucer translates an earlier saint's life, keeping the doctrinal emphasis rather than dramatizing",
        "St Agnes",
        "St Margaret",
      ],
      correctIndex: 1,
      explanation:
        "Chaucer's Cecilia is a translation of earlier Latin and French sources; the tale's doctrinal symbolism (chastity, martyrdom, wisdom) links to the Clerk's Griselda and the Prioress's Miracle. A devotional set-piece that Chaucer is content to render rather than refashion.",
    },
  ],

  // ── Canon's Yeoman's Tale ─────────────────────────────────────
  22: [
    {
      id: "ct-cy-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Canon's Yeoman's Tale is an exposé of:",
      options: [
        "Monastic life",
        "Alchemy — the Yeoman chases down his fleeing master (a con-artist canon) and exposes the whole alchemical swindle to the pilgrims",
        "Royal courts",
        "University teaching",
      ],
      correctIndex: 1,
      explanation:
        "The Canon's Yeoman catches up with the pilgrimage en route, and his exposure of the alchemical con (technical vocabulary deployed to hoodwink marks) is the collection's most unusual interpolation — Chaucer adding a new pilgrim mid-pilgrimage.",
    },
  ],

  // ── Manciple's Tale ───────────────────────────────────────────
  23: [
    {
      id: "ct-manc-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Manciple's Tale is Chaucer's version of:",
      options: [
        "Homeric myth",
        "Ovid's story of Phoebus Apollo and the white crow that told the truth about his wife's adultery — and was blackened for it; the lesson is about the dangers of telling the truth",
        "A Biblical parable",
        "An English legend",
      ],
      correctIndex: 1,
      explanation:
        "Ovid's *Metamorphoses* II.531–632. Chaucer's version emphasizes the moral: better to hold one's tongue. Coming just before the Parson's long sermon, the Manciple's tale primes the pilgrimage's turn toward moral closure.",
    },
  ],

  // ── Parson's Tale ─────────────────────────────────────────────
  24: [
    {
      id: "ct-parson-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Parson's Tale is:",
      options: [
        "A fabliau",
        "A long prose sermon on penitence — the seven deadly sins, confession, and satisfaction — ending the pilgrimage in the voice of its most virtuous pilgrim",
        "A romance",
        "A saint's life",
      ],
      correctIndex: 1,
      explanation:
        "A full prose sermon (following Chaucer's usual Latin/French sources). The tale is structurally and tonally the opposite of the Miller's: high moral seriousness delivered in unadorned prose. The Parson's own prologue refuses 'fables and swich wrecchednesse' — his tale restores the pilgrimage to its devotional purpose.",
    },
  ],

  // ── Retractions ───────────────────────────────────────────────
  25: [
    {
      id: "ct-ret-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Chaucer's Retractions — the final section of the work — do what?",
      options: [
        "Praise his earlier tales",
        "List his earlier works and ask the reader's and God's forgiveness for the worldly ones — Troilus, the 'tales of Caunterbury that sownen into synne,' and so on",
        "Summarize the philosophy",
        "Promise a sequel",
      ],
      correctIndex: 1,
      explanation:
        "The Retractions distinguish works 'that sownen into synne' (tending toward sin) from works of 'moralitee and devocion.' Some scholars read them as a genuine late-life confession; others as a conventional gesture; others as a sly preservation (by naming the tales, Chaucer ensures they are not forgotten).",
    },
    {
      id: "ct-ret-2",
      type: "true_false",
      difficulty: "Scholar",
      xpReward: 10,
      text: "In the Retractions, Chaucer specifically retracts the Book of Troilus and the Canterbury Tales, but also names the Book of the Duchess, the Parliament of Fowls, and his translation of the Consolation of Philosophy as works he wishes preserved.",
      correctBool: true,
      explanation:
        "The asymmetric naming — what is retracted and what is preserved — is itself Chaucer's final poetic choice: his ethical hierarchy of his own output, made explicit at the end.",
    },
  ],

  // ── Canterbury Master Trial ───────────────────────────────────
  26: [
    {
      id: "ct-master-1",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The structural principle of the Canterbury Tales — pilgrims *quiting* each other's tales — produces what kind of organization?",
      options: [
        "Random",
        "A series of *fragments* (A through I), each containing tales that respond to or quarrel with each other; the fragments preserve the *quiting* chains, even where the tales' order among fragments is uncertain",
        "Strict chronological",
        "Geographical",
      ],
      correctIndex: 1,
      explanation:
        "The Ellesmere order (now standard) organizes the tales into ten fragments. Within each fragment the tales respond to each other; between fragments the order is editorial. The *quiting* chains — Knight → Miller → Reeve; Wife of Bath → Friar → Summoner → Clerk → Merchant → etc. — are the collection's animating principle.",
    },
    {
      id: "ct-master-2",
      type: "multiple_choice",
      difficulty: "Master",
      xpReward: 15,
      text: "Chaucer's project in the Canterbury Tales was to write how many tales per pilgrim?",
      options: [
        "One",
        "Four — two going, two returning — roughly 120 tales in total; we have 24, leaving the work massively unfinished and its meaning open to its unfinished-ness",
        "Ten",
        "Twelve",
      ],
      correctIndex: 1,
      explanation:
        "Harry Bailly's announcement (GP 790ff.) sets the plan: four tales per pilgrim. Chaucer lived to finish roughly a fifth. The incompleteness is part of the work's meaning: the pilgrimage never reaches Canterbury, and the work stops with the Parson's sermon rather than any return journey.",
    },
  ],

  // ── Middle English Reader stretch ────────────────────────────
  27: [
    {
      id: "ct-me-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Middle English (Chaucer's dialect: late 14th-century London) differs from Modern English most noticeably in:",
      options: [
        "Alphabet",
        "Orthography (much less standardized), inflection (dative -e endings still audible in meter), pronunciation (long vowels not yet shifted), and vocabulary (many French-derived words recently arrived)",
        "Punctuation only",
        "Word order",
      ],
      correctIndex: 1,
      explanation:
        "The Great Vowel Shift (15th–16th c.) postdates Chaucer, so his rhymes and meter work differently in original pronunciation. Modern readers often miss the final -e that makes an iambic line scan (e.g. *soote* = 'SOH-teh', two syllables).",
    },
    {
      id: "ct-me-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The Canterbury Tales' dominant verse form is:",
      options: [
        "Blank verse",
        "Heroic couplets (iambic pentameter rhymed AA BB CC) — Chaucer's English invention, which becomes Dryden's and Pope's centuries later",
        "Alliterative verse",
        "Free verse",
      ],
      correctIndex: 1,
      explanation:
        "Chaucer invents (or at least perfects) the decasyllabic rhymed couplet in English; the Knight's, Miller's, Wife of Bath's, Pardoner's, and Nun's Priest's Tales are all in heroic couplets. Other tales use rhyme royal (ababbcc, the Man of Law's and Prioress's), tail-rhyme (Sir Thopas's parody), or prose (Meliboeus, Parson's).",
    },
  ],
}
