/**
 * Trial bank — Hamlet, Acts I–III.
 *
 * Hamlet’s chapters in `src/data/chapters.ts` are stored at scene granularity:
 *   Act I scenes I–V: indices 2, 3, 4, 5, 6
 *   Act II scenes I–II: indices 8, 9
 *   Act III scenes I–IV: indices 11, 12, 13, 14
 *
 * Each Act bank below is keyed against every scene index in that Act, so
 * any chapter end inside that Act fires the same Act-level Trial.
 */

import type { ChapterQuestion } from "@/lib/chapter-questions"

// ─────────────────────────────────────────────────────────────────────────────
// Act I — Battlements, Court, Household, Ghost
// ─────────────────────────────────────────────────────────────────────────────

const ACT_I: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "hamlet-act1-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Where does Act I, Scene 1 take place, and who first sees the Ghost?",
    options: [
      "On the battlements of Elsinore; the sentinels Marcellus and Bernardo, with Horatio",
      "In Claudius’s court; Polonius and Laertes",
      "In Ophelia’s chamber; Ophelia alone",
      "In Wittenberg; Hamlet and Horatio",
    ],
    correctIndex: 0,
    explanation:
      "The play opens on the platform before the castle at midnight. Marcellus and Bernardo have already seen the Ghost twice; they bring Horatio, the sceptic, to confirm what they have seen.",
    citation: "Hamlet I.i",
  },
  {
    id: "hamlet-act1-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What does the Ghost charge Hamlet to do in Scene 5?",
    options: [
      "To forgive Claudius and tend the kingdom",
      "To revenge his foul and most unnatural murder, but to leave Gertrude to heaven and her own conscience",
      "To take ship for Wittenberg and never return",
      "To kill Laertes",
    ],
    correctIndex: 1,
    explanation:
      "The Ghost asks for revenge against Claudius and explicitly forbids Hamlet to harm Gertrude — a constraint that shapes the entire play, not least the closet scene in III.iv.",
    citation: "Hamlet I.v.25–86",
  },
  {
    id: "hamlet-act1-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“Frailty, thy name is ____.”",
    correctText: "woman",
    explanation:
      "Hamlet’s first soliloquy — I.ii.146. The line bursts out as he reckons with his mother’s remarriage to his uncle inside two months of his father’s death.",
    citation: "Hamlet I.ii.146",
  },
  {
    id: "hamlet-act1-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“Something is rotten in the state of Denmark.”",
    identificationSubject: "speaker",
    options: ["Horatio", "Marcellus", "Hamlet", "Bernardo"],
    correctIndex: 1,
    explanation:
      "Marcellus’s line at I.iv.90, spoken as he and Horatio follow Hamlet and the Ghost into the dark. The line is constantly attributed to Hamlet but is in fact Marcellus’s.",
    citation: "Hamlet I.iv.90",
  },
  {
    id: "hamlet-act1-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Polonius forbids Ophelia to receive Hamlet’s love-tokens by the end of Act I.",
    correctBool: true,
    tfReasons: [
      "In I.iii Polonius commands her to “not… give words or talk with the Lord Hamlet” — though Laertes had already warned her in similar terms.",
      "Polonius encourages the relationship throughout Act I.",
      "Polonius is silent on the matter until Act II.",
      "Ophelia ignores both Laertes and Polonius and writes back.",
    ],
    tfCorrectReason: 0,
    explanation:
      "I.iii is the household scene: Laertes warns Ophelia, Polonius gives Laertes his famous “to thine own self be true,” and finally instructs Ophelia to stop accepting Hamlet’s attentions.",
    citation: "Hamlet I.iii.131–135",
  },
  {
    id: "hamlet-act1-app-order-1",
    type: "ordering",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Order these moments of Act I.",
    options: [
      "Horatio sees the Ghost and tries to speak with it",
      "Claudius opens his court and Hamlet stands apart in mourning",
      "Polonius gives Laertes counsel and Ophelia is forbidden Hamlet",
      "The Ghost reveals the murder and demands revenge",
    ],
    correctOrder: [
      "Horatio sees the Ghost and tries to speak with it",
      "Claudius opens his court and Hamlet stands apart in mourning",
      "Polonius gives Laertes counsel and Ophelia is forbidden Hamlet",
      "The Ghost reveals the murder and demands revenge",
    ],
    explanation:
      "Act I’s five scenes move from the public political problem (the Ghost on the wall) through the court and household to the private revelation that turns the play’s plot.",
    citation: "Hamlet I.i–v",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "hamlet-act1-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What political problem is established in I.i, well before the family plot is named?",
    options: [
      "A trade dispute with the Hanseatic League",
      "Young Fortinbras of Norway is raising a force to recover lands lost by his father to old Hamlet",
      "An English embassy demands the return of tribute",
      "A Polish ambassador has been imprisoned in Elsinore",
    ],
    correctIndex: 1,
    explanation:
      "Horatio’s long speech in I.i sets the international frame: old Hamlet killed old Fortinbras and won lands; young Fortinbras now plans to win them back. The political plot runs in parallel with the family plot through the play.",
    citation: "Hamlet I.i.79–107",
  },
  {
    id: "hamlet-act1-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "How does Claudius open his court in Scene 2?",
    options: [
      "By apologising for his marriage and offering to abdicate",
      "By naming the marriage to Gertrude and the threat from Fortinbras in a single, balanced speech, then dispatching ambassadors to old Norway",
      "By summoning Hamlet to lead the army into Norway",
      "By announcing the death of Polonius",
    ],
    correctIndex: 1,
    explanation:
      "Claudius is a careful public manager: I.ii.1–39 yokes the personal and political together with elegant rhetoric. The same Claudius will appear in III.iii failing to pray.",
    citation: "Hamlet I.ii.1–39",
  },
  {
    id: "hamlet-act1-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "The Ghost names the place of his murder: in the orchard, where his brother poured the juice of cursed ____ into his ear.",
    correctText: "hebenon",
    acceptedVariants: ["hebona", "henbane"],
    explanation:
      "I.v.62 — “the juice of cursèd hebenon in a vial.” The vegetable poison is impossible to identify with certainty (henbane, ebony, yew); Shakespeare’s point is the secret administration through the ear, an analogue of corrupting speech.",
    citation: "Hamlet I.v.62–70",
  },
  {
    id: "hamlet-act1-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“This above all — to thine own self be true, And it must follow, as the night the day, Thou canst not then be false to any man.”",
    identificationSubject: "speaker",
    options: ["Hamlet", "Horatio", "Polonius", "Laertes"],
    correctIndex: 2,
    explanation:
      "The maxim is Polonius’s, addressed to Laertes in I.iii. Its proverbial reception (often quoted as if it were earnest counsel) sits oddly with the comic-pedantic Polonius the play soon develops.",
    citation: "Hamlet I.iii.78–80",
  },
  {
    id: "hamlet-act1-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each Act I scene to the central action.",
    matchingLeft: ["I.i", "I.ii", "I.iii", "I.iv–v"],
    matchingRight: [
      "Horatio and the sentinels see the Ghost on the battlements",
      "Claudius’s public court; Hamlet’s first soliloquy",
      "Polonius’s household; Laertes departs and Ophelia is forbidden Hamlet",
      "Hamlet meets the Ghost; the murder revealed; the oath of secrecy on the sword",
    ],
    correctPairs: {
      "I.i": "Horatio and the sentinels see the Ghost on the battlements",
      "I.ii": "Claudius’s public court; Hamlet’s first soliloquy",
      "I.iii": "Polonius’s household; Laertes departs and Ophelia is forbidden Hamlet",
      "I.iv–v": "Hamlet meets the Ghost; the murder revealed; the oath of secrecy on the sword",
    },
    explanation:
      "Act I’s structure is symmetrical: ramparts, court, household, and back to the ramparts for the revelation. Each scene supplies a different vantage on the same political and moral disturbance.",
    citation: "Hamlet I",
  },
  {
    id: "hamlet-act1-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Hamlet immediately accepts the Ghost’s testimony as wholly trustworthy.",
    correctBool: false,
    tfReasons: [
      "He swears Horatio and Marcellus to secrecy and warns of his planned “antic disposition,” but the question whether the Ghost is honest or a devil opens again in II.ii and motivates the play within the play.",
      "He accepts the Ghost without reservation throughout.",
      "He rejects the Ghost outright and refuses revenge.",
      "He immediately attacks Claudius after hearing the Ghost.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The Ghost’s testimony is conditionally accepted; its corroboration through “The Mousetrap” is one of the play’s major mechanisms. Reading Act I as a definite charge ignores the doubt the play takes pains to develop.",
    citation: "Hamlet I.v, II.ii.594–612",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "hamlet-act1-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why does Hamlet, after his first soliloquy, declare his intent to “put an antic disposition on”?",
    options: [
      "To woo Ophelia covertly",
      "To gain freedom of action and concealment under the cover of madness, partly to test the Ghost’s testimony",
      "To frighten Polonius",
      "To force Claudius to abdicate",
    ],
    correctIndex: 1,
    explanation:
      "The “antic disposition” is the hinge between Hamlet’s public role and his secret one. The performance of madness is also the alibi for his investigations — it lets him say things he could not otherwise say.",
    citation: "Hamlet I.v.171–189",
  },
  {
    id: "hamlet-act1-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why does Horatio refer to the Ghost in Roman terms in I.i — “in the most high and palmy state of Rome, a little ere the mightiest Julius fell”?",
    options: [
      "To give Hamlet a classical compliment",
      "To analogise the Elsinore disturbance with portents that traditionally precede the death of a great prince",
      "To suggest that the Ghost is Caesar",
      "To mock Marcellus’s simplicity",
    ],
    correctIndex: 1,
    explanation:
      "The Roman parallel makes the Ghost an omen: portents at Caesar’s death, portents at Christ’s birth. The play frames itself in the line of stories where unearthly signs cluster around political crisis.",
    citation: "Hamlet I.i.113–125",
  },
  {
    id: "hamlet-act1-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "The Ghost ends each appearance with a single, repeated cry: “Remember ____.”",
    correctText: "me",
    explanation:
      "I.v.91 — the imperative on which the play turns. Hamlet’s following soliloquy registers it as a wholesale rewriting of memory: “Yea, from the table of my memory I’ll wipe away all trivial fond records.”",
    citation: "Hamlet I.v.91",
  },
  {
    id: "hamlet-act1-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“The time is out of joint — O cursèd spite, That ever I was born to set it right.”",
    identificationSubject: "speaker",
    options: ["Hamlet", "Horatio", "Claudius", "Laertes"],
    correctIndex: 0,
    explanation:
      "Hamlet, at the close of I.v.196–197. The lines name the play’s theological-political problem (a disordered Denmark) and the personal vocation he reluctantly takes up.",
    citation: "Hamlet I.v.196–197",
  },
  {
    id: "hamlet-act1-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Act I’s political subplot — Fortinbras and Norway — is incidental and could be cut without altering the play.",
    correctBool: false,
    tfReasons: [
      "Fortinbras frames the play and gives the final scene its closure: a soldier-prince inheriting the kingdom in V.ii — the political world the family plot has emptied out.",
      "Fortinbras is incidental and contributes nothing to the structure.",
      "Fortinbras appears only in Act IV.",
      "Fortinbras is a mute role and has no lines.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Reading the play without Fortinbras is reading without its political frame. He shadows Hamlet from I.i to V.ii — the alternative model of the prince who acts.",
    citation: "Hamlet I.i.79–107, V.ii.395–410",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Act II — Spies and the Players
// ─────────────────────────────────────────────────────────────────────────────

const ACT_II: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "hamlet-act2-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Whom does Polonius send to Paris to spy on Laertes in Scene 1?",
    options: ["Osric", "Reynaldo", "Horatio", "Voltimand"],
    correctIndex: 1,
    explanation:
      "Polonius dispatches Reynaldo with elaborate instructions in indirection — “by indirections find directions out.” The scene establishes Polonius’s habit of surveillance before Hamlet enters.",
    citation: "Hamlet II.i.1–73",
  },
  {
    id: "hamlet-act2-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Whom does Claudius summon in Scene 2 to “gather, so much as from occasion you may glean,” the cause of Hamlet’s transformation?",
    options: [
      "Voltimand and Cornelius",
      "Rosencrantz and Guildenstern",
      "Reynaldo and Marcellus",
      "Osric and Bernardo",
    ],
    correctIndex: 1,
    explanation:
      "Hamlet’s old schoolfellows are summoned to play the report-and-amuse role — courtiers turned informers. The pair occupy a major thread of Act II and are kept in motion through to V.ii.",
    citation: "Hamlet II.ii.1–18",
  },
  {
    id: "hamlet-act2-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“Though this be madness, yet there is ____ in it.”",
    correctText: "method",
    explanation:
      "Polonius’s aside in II.ii.205. The line crystallises one of the play’s recurring questions: how much of Hamlet’s madness is performance and how much real?",
    citation: "Hamlet II.ii.205",
  },
  {
    id: "hamlet-act2-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“What a piece of work is a man — how noble in reason, how infinite in faculties — and yet, to me, what is this quintessence of dust?”",
    identificationSubject: "speaker",
    options: ["Polonius", "Claudius", "Hamlet", "Horatio"],
    correctIndex: 2,
    explanation:
      "Hamlet’s set-piece in II.ii.305–321 to Rosencrantz and Guildenstern. The speech is partly a performance for the spies, partly the play’s most concentrated philosophical statement to that point.",
    citation: "Hamlet II.ii.305–321",
  },
  {
    id: "hamlet-act2-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Hamlet recognises Rosencrantz and Guildenstern as informers by the end of their first long scene.",
    correctBool: true,
    tfReasons: [
      "He elicits a confession from them that they were sent for, and from that point treats their friendship as instrumental.",
      "He never realises they have been sent for.",
      "He believes them to be loyal throughout the play.",
      "He suspects only Guildenstern.",
    ],
    tfCorrectReason: 0,
    explanation:
      "II.ii.270–304 is a careful interrogation: Hamlet asks plainly whether they were sent for, and after their evasions presses until they admit it. Their later betrayal in IV is therefore not surprise but an inevitability.",
    citation: "Hamlet II.ii.270–304",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "hamlet-act2-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What plan does Hamlet form on hearing the First Player’s speech on Hecuba?",
    options: [
      "To leave Denmark on the morning tide",
      "To have the players act before the king a play closely resembling his father’s murder, watching Claudius for signs of guilt",
      "To duel Laertes at once",
      "To run mad in earnest",
    ],
    correctIndex: 1,
    explanation:
      "“The play’s the thing, wherein I’ll catch the conscience of the king” — II.ii.605. The Mousetrap is set up in this scene and performed in III.ii.",
    citation: "Hamlet II.ii.582–605",
  },
  {
    id: "hamlet-act2-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Why does Hamlet weigh, in his soliloquy at the end of II.ii, the possibility that the Ghost may be a devil?",
    options: [
      "Because Horatio first told him so",
      "Because the devil hath power t’assume a pleasing shape, and may abuse him out of his weakness and melancholy to damnation",
      "Because Claudius has hinted as much",
      "Because the Ghost vanished too quickly",
    ],
    correctIndex: 1,
    explanation:
      "II.ii.594–602. Renaissance demonology kept open the possibility of a tempting devil disguised as a familiar dead. The Mousetrap is, in part, an empirical test of the Ghost’s honesty.",
    citation: "Hamlet II.ii.594–602",
  },
  {
    id: "hamlet-act2-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Hamlet asks the Player to recite a “passionate speech” — the tale of Aeneas to ____, on the slaughter of Priam.",
    correctText: "Dido",
    explanation:
      "The Aeneid II material — Pyrrhus’s murder of Priam and Hecuba’s grief — is the chosen test of dramatic feeling. Hamlet later contrasts the player’s tears for nothing with his own real grief, real cause, and inaction.",
    citation: "Hamlet II.ii.446–516",
  },
  {
    id: "hamlet-act2-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“What’s Hecuba to him, or he to Hecuba, that he should weep for her?”",
    identificationSubject: "speaker",
    options: ["The First Player", "Polonius", "Hamlet", "Horatio"],
    correctIndex: 2,
    explanation:
      "Hamlet, in the soliloquy that closes II.ii. The line is both the play’s sharpest meditation on poetry and pity and the moral pivot from “delay” to action — by the end of the speech he has hatched the Mousetrap.",
    citation: "Hamlet II.ii.559",
  },
  {
    id: "hamlet-act2-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each scheme of Act II to its agent.",
    matchingLeft: ["Spying on Laertes in Paris", "Spying on Hamlet in Elsinore", "Reading Hamlet’s love-letter aloud to the king", "Plot for the play within the play"],
    matchingRight: ["Polonius via Reynaldo", "Claudius via Rosencrantz and Guildenstern", "Polonius", "Hamlet"],
    correctPairs: {
      "Spying on Laertes in Paris": "Polonius via Reynaldo",
      "Spying on Hamlet in Elsinore": "Claudius via Rosencrantz and Guildenstern",
      "Reading Hamlet’s love-letter aloud to the king": "Polonius",
      "Plot for the play within the play": "Hamlet",
    },
    explanation:
      "Act II is the play’s book of devices. Every plot in it is a plot to read someone else’s mind, and the Mousetrap will be the last and largest of them.",
    citation: "Hamlet II",
  },
  {
    id: "hamlet-act2-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Polonius diagnoses Hamlet’s madness as caused by political ambition.",
    correctBool: false,
    tfReasons: [
      "He diagnoses it as love-madness — “the very ecstasy of love” — caused by Ophelia’s rejection, and proposes to test the diagnosis by setting them to meet under his observation.",
      "He says nothing about the cause until Act III.",
      "He blames Wittenberg.",
      "He suspects political ambition behind the appearance of love.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Polonius’s confidence in his diagnosis sets up the III.i “nunnery” scene where he and Claudius will eavesdrop on Hamlet and Ophelia.",
    citation: "Hamlet II.i.84–98, II.ii.96–151",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "hamlet-act2-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What is at stake in Hamlet’s self-accusation that he is “like a whore unpack[ing] my heart with words”?",
    options: [
      "He confesses to a sexual indiscretion",
      "He registers the gap between speech and act — the soliloquy is itself the kind of verbal substitute for action that the speech condemns",
      "He admits to being paid to deliver the lines",
      "He apologises for the soliloquy genre",
    ],
    correctIndex: 1,
    explanation:
      "II.ii.581–585. The accusation lands inside its own form: the soliloquy diagnoses its own dramatic function. The Mousetrap is in part the answer — speech producing action, not substituting for it.",
    citation: "Hamlet II.ii.581–585",
  },
  {
    id: "hamlet-act2-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why does Hamlet greet the players so warmly in II.ii?",
    options: [
      "Because they are his only old friends in the play",
      "Because they let him stage the test of the Ghost — and because the player’s art is the kind of feeling and craft Hamlet is currently failing to convert into action",
      "Because they have brought news from Wittenberg",
      "Because Polonius asks him to",
    ],
    correctIndex: 1,
    explanation:
      "Hamlet’s reception of the players carries both the practical purpose (the Mousetrap) and a deeper attraction to a craft of feeling. Both are at work in the long, alternately courteous and self-castigating scene.",
    citation: "Hamlet II.ii.394–605",
  },
  {
    id: "hamlet-act2-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "Polonius reads out one of Hamlet’s love-letters to Ophelia: “Doubt thou the stars are fire; doubt that the sun doth move; doubt truth to be a liar; but never doubt I ____.”",
    correctText: "love",
    explanation:
      "II.ii.116–119. The line is one of the play’s rare pieces of (allegedly) Hamlet’s lyric — read aloud, of course, in the worst possible setting.",
    citation: "Hamlet II.ii.116–119",
  },
  {
    id: "hamlet-act2-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“The play’s the thing, Wherein I’ll catch the conscience of the king.”",
    identificationSubject: "speaker",
    options: ["Hamlet", "The First Player", "Horatio", "Polonius"],
    correctIndex: 0,
    explanation:
      "Hamlet, II.ii.604–605. The couplet seals the soliloquy and bridges Act II to Act III; “catch the conscience” is the play’s most explicit claim that drama can be epistemically active.",
    citation: "Hamlet II.ii.604–605",
  },
  {
    id: "hamlet-act2-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The Pyrrhus-and-Hecuba speech is a digression with no bearing on the plot.",
    correctBool: false,
    tfReasons: [
      "It mirrors the play’s situation — a son avenging a slain father, a queen unable to mourn the right way — and provides the model the player surpasses Hamlet in performing.",
      "It is a digression with no plot bearing.",
      "It is a separate fragment by another author.",
      "It is comic relief only.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Reading the speech as a mirror is one of the central facts of the play’s metatheatre. The Mousetrap which follows is its repetition with one further turn of the mirror.",
    citation: "Hamlet II.ii.446–605",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Act III — Mousetrap, Closet, Pivot
// ─────────────────────────────────────────────────────────────────────────────

const ACT_III: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "hamlet-act3-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Where is Hamlet’s most famous soliloquy positioned in the play?",
    options: [
      "At the opening of Act I",
      "Just before the Mousetrap, in Act III, scene i",
      "After the killing of Polonius",
      "At the graveyard",
    ],
    correctIndex: 1,
    explanation:
      "“To be, or not to be” opens III.i, before Hamlet meets the planted Ophelia. The soliloquy is the structural midpoint of the play.",
    citation: "Hamlet III.i.55–87",
  },
  {
    id: "hamlet-act3-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What name does Hamlet give to the play within the play in III.ii?",
    options: ["The Mousetrap", "The Murder of Gonzago", "Both — he calls it The Mousetrap, “the image of a murder done in Vienna,” played as The Murder of Gonzago", "The King’s Trial"],
    correctIndex: 2,
    explanation:
      "“This play is the image of a murder done in Vienna; Gonzago is the duke’s name; his wife, Baptista … The Mousetrap.” The double name is part of the joke: a play disguised as another play.",
    citation: "Hamlet III.ii.232–246",
  },
  {
    id: "hamlet-act3-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“To be, or not to be — that is the ____.”",
    correctText: "question",
    explanation:
      "III.i.55. The single line is the most-quoted opening of any soliloquy in English literature; the rest of the speech is a tightly argued meditation on suicide as the choice between ills.",
    citation: "Hamlet III.i.55",
  },
  {
    id: "hamlet-act3-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "He kills Polonius behind an arras, mistaking him for the king.",
    identificationSubject: "character",
    options: ["Laertes", "Claudius", "Hamlet", "Horatio"],
    correctIndex: 2,
    explanation:
      "III.iv.23–25. Hamlet stabs through the arras in Gertrude’s closet. The discovery — “Is it the king?” — and his answer, “Thou wretched, rash, intruding fool, farewell” — fix Polonius’s fate and seal Hamlet’s.",
    citation: "Hamlet III.iv.23–32",
  },
  {
    id: "hamlet-act3-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Hamlet kills Claudius in Act III at the moment Claudius is alone praying.",
    correctBool: false,
    tfReasons: [
      "He spares Claudius precisely because killing a praying man would send him to heaven — he postpones the act for one fitter for damnation.",
      "He kills Claudius at his prayers without hesitation.",
      "He never finds Claudius alone in Act III.",
      "He is restrained by Horatio.",
    ],
    tfCorrectReason: 0,
    explanation:
      "III.iii.73–96. Hamlet’s scruple is theological: revenge is not enough — he wants damnation, not a soul caught in a moment of grace. The choice deepens the question of his motive.",
    citation: "Hamlet III.iii.73–96",
  },
  {
    id: "hamlet-act3-app-order-1",
    type: "ordering",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Order the events of Act III.",
    options: [
      "“To be, or not to be” and the nunnery scene with Ophelia",
      "The Mousetrap performance and Claudius’s flight",
      "Claudius alone trying to pray; Hamlet spares him",
      "Polonius killed behind the arras in Gertrude’s closet",
    ],
    correctOrder: [
      "“To be, or not to be” and the nunnery scene with Ophelia",
      "The Mousetrap performance and Claudius’s flight",
      "Claudius alone trying to pray; Hamlet spares him",
      "Polonius killed behind the arras in Gertrude’s closet",
    ],
    explanation:
      "The four scenes of Act III move from soliloquy to spectacle to private prayer to private violence. The pivot from delay to error happens here, and from this point the play accelerates.",
    citation: "Hamlet III.i–iv",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "hamlet-act3-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What does Hamlet conclude is the chief reason men do not commit suicide?",
    options: [
      "Love of life",
      "The fear of something after death — “the dread of something after death, the undiscovered country” — paralyses the will",
      "Religious prohibition alone",
      "The fear of pain",
    ],
    correctIndex: 1,
    explanation:
      "III.i.78–82. The crux of the soliloquy is epistemic, not pious: it is the unknowability of what comes after, not certainty of damnation, that makes the will fail. The line is a careful Renaissance argument about action under uncertainty.",
    citation: "Hamlet III.i.78–87",
  },
  {
    id: "hamlet-act3-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What does Hamlet ask Horatio to do during the play within the play?",
    options: [
      "To leave the room",
      "To watch the king closely; if his guilt does not unkennel itself in one speech of the play, the Ghost has been a devil",
      "To recite the players’ lines aloud",
      "To draw his sword if Claudius rises",
    ],
    correctIndex: 1,
    explanation:
      "III.ii.74–87. Horatio is the play’s second pair of eyes; the Mousetrap is empirical because it has two observers. Hamlet trusts Horatio precisely because he is not “passion’s slave.”",
    citation: "Hamlet III.ii.74–87",
  },
  {
    id: "hamlet-act3-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Claudius, alone after the play, prays: “My words fly up, my thoughts remain below — words without ____ never to heaven go.”",
    correctText: "thoughts",
    explanation:
      "III.iii.97–98. The couplet is one of the play’s sharpest formulations of the theology of speech: prayer as a mental act that words alone cannot perform.",
    citation: "Hamlet III.iii.97–98",
  },
  {
    id: "hamlet-act3-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“Get thee to a nunnery — why wouldst thou be a breeder of sinners?”",
    identificationSubject: "speaker",
    options: ["Polonius", "Laertes", "Hamlet", "Horatio"],
    correctIndex: 2,
    explanation:
      "Hamlet to Ophelia in III.i.121, knowing — or knowing he is being watched — that Claudius and Polonius are listening. The brutality of the scene is calibrated to its hidden audience.",
    citation: "Hamlet III.i.121",
  },
  {
    id: "hamlet-act3-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each Act III scene to its central action.",
    matchingLeft: ["III.i", "III.ii", "III.iii", "III.iv"],
    matchingRight: [
      "“To be, or not to be”; the nunnery scene; Claudius decides to send Hamlet to England",
      "Hamlet’s advice to the players; the Mousetrap; Claudius rises and the play breaks off",
      "Claudius alone, trying to pray; Hamlet spares him because he is at prayer",
      "The closet scene with Gertrude; Polonius killed behind the arras; the Ghost returns",
    ],
    correctPairs: {
      "III.i": "“To be, or not to be”; the nunnery scene; Claudius decides to send Hamlet to England",
      "III.ii": "Hamlet’s advice to the players; the Mousetrap; Claudius rises and the play breaks off",
      "III.iii": "Claudius alone, trying to pray; Hamlet spares him because he is at prayer",
      "III.iv": "The closet scene with Gertrude; Polonius killed behind the arras; the Ghost returns",
    },
    explanation:
      "Act III is the structural pivot. The four scenes test the Ghost, repeat the murder, refuse Claudius the perfect kill, and end in the wrong death — the catastrophe is set in motion here.",
    citation: "Hamlet III",
  },
  {
    id: "hamlet-act3-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "After the Mousetrap, Claudius is convinced of Hamlet’s harmlessness.",
    correctBool: false,
    tfReasons: [
      "He determines at once to send Hamlet to England — a hostile move that culminates in IV.iii–iv when the order to England carries with it a sealed commission for Hamlet’s death.",
      "He is reassured and lets Hamlet remain at court.",
      "He immediately repents and confesses to Gertrude.",
      "He retires from the throne in shock.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The Mousetrap’s success is also its limit: Hamlet now knows, but Claudius now knows that Hamlet knows. The play accelerates into the Polonius killing and the dispatch to England.",
    citation: "Hamlet III.i.169–179, III.iii.1–28",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "hamlet-act3-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What is the purpose of Hamlet’s advice to the players in III.ii — “Speak the speech, I pray you, as I pronounced it to you, trippingly on the tongue”?",
    options: [
      "It is filler material before the Mousetrap",
      "It is a small ars poetica that locates dramatic art in restraint and truth to nature, and that frames the entire question of theatrical evidence",
      "It is a complaint about poor acting in London",
      "It is a quotation from Aristotle’s Poetics",
    ],
    correctIndex: 1,
    explanation:
      "The “mirror up to nature” passage is the play’s explicit theory of representation. The Mousetrap that follows is the practical experiment — restrained, accurate enough to “catch” the truth.",
    citation: "Hamlet III.ii.1–43",
  },
  {
    id: "hamlet-act3-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "How does the closet scene in III.iv use the second appearance of the Ghost?",
    options: [
      "To prompt Hamlet to kill Claudius at once",
      "To re-anchor him to his original task — “Do not forget; this visitation is but to whet thy almost blunted purpose” — while Gertrude, who cannot see the Ghost, takes his speech for madness",
      "To absolve Gertrude of wrongdoing",
      "To deliver a new prophecy to Hamlet",
    ],
    correctIndex: 1,
    explanation:
      "The Ghost’s reappearance is private to Hamlet — Gertrude sees nothing — and turns the closet scene into a complex meeting of theological injunction and a son’s rage at his mother. The scene’s compression is one of Shakespeare’s sharpest.",
    citation: "Hamlet III.iv.106–138",
  },
  {
    id: "hamlet-act3-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "Hamlet shows Gertrude two pictures: this was your husband; “look you now what follows: here is your husband, like a mildewed ____ blasting his wholesome brother.”",
    correctText: "ear",
    acceptedVariants: ["ear of corn"],
    explanation:
      "III.iv.65–66. The “mildewed ear” returns the play to the Ghost’s opening figure — an ear into which poison is poured, an ear of corn corrupting another. Speech-as-poison runs as motif from I.v through this scene.",
    citation: "Hamlet III.iv.64–67",
  },
  {
    id: "hamlet-act3-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“The lady doth protest too much, methinks.”",
    identificationSubject: "speaker",
    options: ["Polonius", "Hamlet", "Gertrude", "Ophelia"],
    correctIndex: 2,
    explanation:
      "Gertrude’s line in III.ii.230, watching the Player Queen swear undying loyalty to her dead husband. The line is constantly misquoted as Hamlet’s and is in fact Gertrude’s own self-deflecting comment.",
    citation: "Hamlet III.ii.230",
  },
  {
    id: "hamlet-act3-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Act III completes the play’s movement from delay to action.",
    correctBool: false,
    tfReasons: [
      "Act III converts delay into a different problem — Hamlet acts decisively but on the wrong target, killing Polonius rather than Claudius — so the rest of the play unrolls as the consequences of that misdirected act.",
      "Act III simply ends the delay.",
      "Act III contains no decisive action.",
      "Act III has Hamlet kill Claudius successfully.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Reading Act III as the “completion” of the revenge is reading past the most important fact: he kills the wrong man. Acts IV and V are the working out of that error — Ophelia’s madness, Laertes’ rage, Polonius’s burial, the duel, the deaths.",
    citation: "Hamlet III.iv.23–32; IV.i–vii",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Export — keyed against every scene index in each Act so any chapter end
// inside that Act fires the Trial.
// ─────────────────────────────────────────────────────────────────────────────

export const HAMLET_I_III_TRIALS: Record<number, ChapterQuestion[]> = {
  // Act I scenes I–V
  2: ACT_I,
  3: ACT_I,
  4: ACT_I,
  5: ACT_I,
  6: ACT_I,
  // Act II scenes I–II
  8: ACT_II,
  9: ACT_II,
  // Act III scenes I–IV
  11: ACT_III,
  12: ACT_III,
  13: ACT_III,
  14: ACT_III,
}
