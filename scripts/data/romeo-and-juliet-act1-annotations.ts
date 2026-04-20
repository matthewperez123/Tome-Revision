/**
 * Act I — annotations + Trials. 1.3 (age), 1.4 (Queen Mab, Q1/Q2 note),
 * and 1.5 (shared sonnet) are load-bearing.
 */

module.exports = function (A: any, T: any, _cite: any) {

  // ── 1.1 ─────────────────────────────────────────────────────────────
  A.romeo_and_juliet_act1_scene1 = [
    {
      line_start: 1, line_end: 40,
      citation_display: "Romeo and Juliet 1.1.1–40",
      category: "linguistic",
      title: "Sampson and Gregory — beginning in prose and bawdry",
      body: "The play opens not with the noble lovers but with two Capulet servants trading puns and sexual insults in prose. This is a deliberate structural choice. Shakespeare's Verona is a city whose servants also carry the feud — violence is stitched into the social fabric from the bottom up. The bawdry ('maidenheads,' 'pretty piece of flesh,' 'take the wall') establishes that the feud is about masculine display, territory, and sexual honour as much as about high-family principle. Notice how rapidly the register shifts: prose for servants, verse for Benvolio and Tybalt, blank verse for the Prince. The play's verse/prose ecology mirrors its social hierarchy and makes possible the Nurse's later prose among the nobles' verse — a stylistic marker of her class and comic function.",
      sources: ["Russ McDonald, Shakespeare and the Arts of Language (2001)", "Frank Kermode, Shakespeare's Language (2000)"]
    },
    {
      line_start: 85, line_end: 107,
      citation_display: "Romeo and Juliet 1.1.85–107",
      category: "structural",
      title: "The Prince's first entry — civic peace as precondition",
      body: "Escalus arrives to break up the third street-fight in the play's opening minutes and declares that any future breach will be a capital offence. His speech ('Rebellious subjects, enemies to peace, / Profaners of this neighbour-stained steel') is written in commanding blank verse and establishes a legal frame that will prove decisive: Romeo's killing of Tybalt in 3.1 is not punishable by death only because Tybalt had already killed Mercutio — the Prince's later decision of exile rather than execution is the compromise that launches the tragedy's second half. The Prince appears only three times in the play (1.1, 3.1, 5.3), forming a structural spine: establishing the law, adjudicating the first major breach, and delivering the final verdict.",
      sources: ["Stephen Greenblatt, Will in the World (2004)"]
    },
    {
      line_start: 165, line_end: 209,
      citation_display: "Romeo and Juliet 1.1.165–209",
      category: "thematic",
      title: "Romeo's Petrarchan complaint — love as performance",
      body: "Romeo's first long speech is a study in Petrarchan affectation. 'Feather of lead, bright smoke, cold fire, sick health' — these stacked oxymorons are not Romeo's private anguish but a public performance of the sixteenth-century lover's script, inherited from Francesco Petrarca's sonnets to Laura. Elizabethan sonneteers (Sidney, Spenser, Daniel) had made the Petrarchan complaint a fashionable literary posture. Shakespeare lets Romeo perform it at exhaustive length so that we hear, when he meets Juliet in 1.5, how radically his language shifts: at the ball he speaks in the sonnet form itself, not in the sonnet's clichés about it. The play is arguing something about language and love: the Petrarchan mode is a pose; genuine love requires finding a different syntax.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)", "Heather Dubrow, Echoes of Desire (1995)"]
    }
  ];

  T.romeo_and_juliet_act1_scene1 = [
    {
      kind: "comprehension",
      prompt: "Why does the play open with servants rather than the titular lovers?",
      options: [
        "To provide comic relief before the tragedy",
        "To show the feud reaches all levels of Veronese society, not just the noble houses",
        "To introduce minor characters who will die later",
        "Standard opening convention of Elizabethan drama required it"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 1, anchor_line_end: 40
    },
    {
      kind: "close_reading",
      prompt: "What rhetorical figure dominates Romeo's first long speech about Rosaline ('cold fire,' 'bright smoke,' 'sick health')?",
      options: [
        "Anaphora (repetition of opening words)",
        "Oxymoron — stacked paradoxical pairings characteristic of Petrarchan love-poetry",
        "Metonymy",
        "Synecdoche"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 183, anchor_line_end: 190
    },
    {
      kind: "theme",
      prompt: "What critical view does Shakespeare take on Romeo's Rosaline-talk in 1.1?",
      options: [
        "He endorses it as genuine feeling",
        "He treats it neutrally without commentary",
        "He frames it as performative and affected — a pose borrowed from Petrarchan sonnet convention, to be contrasted with the real love in 1.5",
        "He mocks it as universally insincere"
      ],
      answer_index: 2, wisdom_reward: 25,
      anchor_line_start: 165, anchor_line_end: 209
    },
    {
      kind: "inference",
      prompt: "The Prince's decree that 'if ever you disturb our streets again, / Your lives shall pay the forfeit of the peace' is structurally important because —",
      options: [
        "It has no real consequence later in the play",
        "It sets the legal stake that Romeo's later killing of Tybalt will activate, shaping his punishment",
        "It is immediately forgotten by all characters",
        "It only applies to commoners, not the nobility"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 94, anchor_line_end: 107
    },
    {
      kind: "comprehension",
      prompt: "What is Benvolio's first action when he arrives at the Capulet-Montague brawl?",
      options: [
        "He encourages the fighting",
        "He draws his sword and tries to part the combatants, urging 'Part, fools!'",
        "He runs to fetch the Prince",
        "He stays hidden and watches"
      ],
      answer_index: 1, wisdom_reward: 10,
      anchor_line_start: 62, anchor_line_end: 68
    }
  ];

  // ── 1.3 — the age scene ──────────────────────────────────────────────
  A.romeo_and_juliet_act1_scene3 = [
    {
      line_start: 14, line_end: 22,
      citation_display: "Romeo and Juliet 1.3.14–22",
      category: "historical",
      title: "Juliet's age — not yet fourteen",
      body: "The play states Juliet's age unmistakably: she is thirteen, two weeks short of fourteen. Modern readers encounter this as disturbing, and the play does not soften it. Three contexts should be held together. First, Elizabethan aristocratic betrothal could occur young — the legal marriage age was twelve for girls, fourteen for boys, though actual marriage typically occurred in the late teens or twenties even among the nobility (Shakespeare's own wife Anne Hathaway was 26 when he married her at 18). Second, Shakespeare changed his source: Arthur Brooke's poem The Tragicall Historye of Romeus and Juliet (1562) makes Juliet sixteen; Shakespeare deliberately lowers her age. Third, the choice is dramatically freighted — Juliet's extreme youth sharpens the tragedy of her agency. She does not merely suffer events; she decides. A thirteen-year-old who insists on marrying, contrives her own fake death, and chooses suicide by her husband's side makes the play's claim about love's sovereignty more radical, not less disturbing.",
      sources: ["Arthur Brooke, The Tragicall Historye of Romeus and Juliet (1562)", "Stephen Greenblatt, Will in the World (2004)", "Lawrence Stone, The Family, Sex and Marriage in England 1500-1800 (1977)"]
    },
    {
      line_start: 24, line_end: 60,
      citation_display: "Romeo and Juliet 1.3.24–60",
      category: "linguistic",
      title: "The Nurse in prose — comic register among nobles",
      body: "Lady Capulet speaks in verse; the Nurse speaks in prose. Her famous weaning-story ('When it did taste the wormwood on the nipple / Of my dug, and felt it bitter') is a class-marker as much as a comic showpiece. The Nurse's earthy physicality — her dead daughter Susan, her dead husband's joke, her specific memory of breast-feeding — gives Juliet the only character in the play who has touched her body with her own. That bond makes the Nurse's betrayal of Juliet in 3.5 the most painful break in Juliet's adolescence, more than her father's rage. Notice how the Nurse's prose resists Lady Capulet's repeated attempts to return to courtly verse: it is class and intimacy reasserting themselves against formality.",
      sources: ["Russ McDonald, Shakespeare and the Arts of Language (2001)", "Carol Rutter, Enter the Body (2001)"]
    }
  ];

  T.romeo_and_juliet_act1_scene3 = [
    {
      kind: "comprehension",
      prompt: "How old is Juliet at the time of the play?",
      options: [
        "Sixteen, as in Shakespeare's source (Brooke's poem)",
        "Twelve — the legal minimum marriage age in Elizabethan England",
        "Thirteen — 'not yet fourteen,' with Lammas Eve (July 31) marking her fourteenth birthday two weeks off",
        "Fifteen"
      ],
      answer_index: 2, wisdom_reward: 20,
      anchor_line_start: 14, anchor_line_end: 22
    },
    {
      kind: "inference",
      prompt: "Shakespeare changed Juliet's age from sixteen (in his source, Brooke's poem) to thirteen. What is the most likely dramatic effect?",
      options: [
        "It makes the parents' urgency to marry her off seem excessive",
        "It sharpens the tragedy — her extreme youth heightens both vulnerability and the force of her decisions",
        "It makes her unable to legally marry",
        "It reduces her to a passive victim"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 14, anchor_line_end: 22
    },
    {
      kind: "close_reading",
      prompt: "Why does the Nurse speak in prose while Lady Capulet speaks in verse?",
      options: [
        "It's a random authorial decision",
        "Prose marks her class and intimacy; verse marks Lady Capulet's formality",
        "Prose indicates she's uneducated and therefore untrustworthy",
        "All older women in Shakespeare speak in prose"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 24, anchor_line_end: 60
    }
  ];

  // ── 1.4 — Queen Mab ─────────────────────────────────────────────────
  A.romeo_and_juliet_act1_scene4 = [
    {
      line_start: 53, line_end: 103,
      citation_display: "Romeo and Juliet 1.4.53–103",
      category: "close_reading",
      title: "The Queen Mab speech — performance, not summary",
      body: "Mercutio's fifty-line flight is a showpiece of what he can do with language, not a paraphrasable argument. It starts miniaturist (fairy coach-spokes of spider-leg, hazel-nut chariot, atomies for drivers) and then accelerates from whimsy into disturbance: dreams of courtiers 'smelling out a suit,' lawyers' fees, lovers' kisses, ladies' blistered lips, and finally the hag who 'presses' maids 'and learns them first to bear.' The rhythm stretches and compacts unpredictably; the diction shifts from folkloric to medical to satiric; the speech reveals Mercutio as the play's most linguistically unstable character. Romeo interrupts: 'Peace, peace, Mercutio, peace! Thou talk'st of nothing.' But 'nothing' is the point — Mercutio has been talking about the 'vain fantasy' of dreams and, by extension, the self-deceiving fantasies of love, ambition, and revenge that drive the play. His virtuosity turns, at speech's end, into genuine bleakness.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Jonathan Bate, The Soul of the Age (2008)"]
    },
    {
      line_start: 53, line_end: 103,
      citation_display: "Romeo and Juliet 1.4.53–103",
      category: "textual",
      title: "Q1 vs. Q2 — the textual crux",
      body: "Romeo and Juliet exists in two significantly different early texts. Q1 (1597, the so-called 'Bad Quarto') is shorter and is generally thought to be a memorial reconstruction, perhaps by actors. Q2 (1599) is longer, better-printed, and is the basis for modern editions (including Standard Ebooks, the source of this text). The Queen Mab speech is one of the places where Q1 and Q2 most visibly differ: Q1 gives a shorter, more restrained version of the speech, while Q2's text is the expansive virtuoso flight we have. Editors debate whether Q1 represents a pre-revision authorial draft or a performance-compressed acting text. Either way, the Q2 Queen Mab is the version that established Mercutio's reputation as Shakespeare's most verbally inventive minor character, and its length and escalation are intentional — the speech is designed to overflow, to reveal Mercutio's mind running out past his control.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)", "René Weis, Arden Shakespeare: Romeo and Juliet (2012)"]
    },
    {
      line_start: 106, line_end: 113,
      citation_display: "Romeo and Juliet 1.4.106–113",
      category: "thematic",
      title: "Romeo's last speech before the ball — premonition as self-knowledge",
      body: "Just before entering Capulet's house and meeting Juliet, Romeo speaks four lines of extraordinary prophetic weight: 'my mind misgives / Some consequence yet hanging in the stars / Shall bitterly begin his fearful date / With this night's revels.' He names the play's structure — the stars, the night's revels, the untimely death — but places himself in God's hands ('He that hath the steerage of my course'). Shakespeare lets Romeo speak with a self-knowledge he will immediately abandon. The premonition is not a plot-device; it is a kind of self-recognition the play asks us to notice. Romeo knows, at the door of the ball, what the prologue told us — and proceeds anyway. That is the shape of tragedy.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)"]
    }
  ];

  T.romeo_and_juliet_act1_scene4 = [
    {
      kind: "close_reading",
      prompt: "Who, in English folklore, is Queen Mab?",
      options: [
        "The queen of Scotland during Shakespeare's lifetime",
        "The fairies' midwife — she delivers dreams to sleepers",
        "A famous Elizabethan prostitute",
        "A character from Ovid's Metamorphoses"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 53, anchor_line_end: 55
    },
    {
      kind: "theme",
      prompt: "Which best describes the rhetorical trajectory of Mercutio's Queen Mab speech?",
      options: [
        "Steady tone throughout — all whimsical",
        "It begins miniaturist and whimsical, then accelerates into bitter satire and disturbing imagery (blisters, hags, the erotic hag pressing maids)",
        "Purely descriptive throughout",
        "Rhyming couplets from start to finish"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 53, anchor_line_end: 103
    },
    {
      kind: "inference",
      prompt: "How does Romeo interrupt Mercutio's Mab speech, and what does it tell us?",
      options: [
        "'Well spoken, friend!' — admiringly",
        "'Peace, peace, Mercutio, peace! Thou talk'st of nothing' — sensing Mercutio has run past himself",
        "He asks for the speech to continue",
        "He says nothing at all"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 95, anchor_line_end: 96
    },
    {
      kind: "structural",
      prompt: "What editorial fact does Q1 (1597) versus Q2 (1599) tell us about this scene?",
      options: [
        "The two quartos are identical",
        "Q1 is a 'Bad Quarto' whose Queen Mab speech is significantly shorter than Q2's; Q2 is the basis for modern editions",
        "Q2 is thought to be a pirated actors' memorial",
        "Neither Q1 nor Q2 mentions Queen Mab"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 53, anchor_line_end: 103
    },
    {
      kind: "comprehension",
      prompt: "What does Romeo feel as he approaches the Capulet ball?",
      options: [
        "Delight at the expected dancing",
        "Premonition — 'my mind misgives / Some consequence yet hanging in the stars' — and yet he goes in anyway",
        "Indifference to the evening",
        "Anger at Tybalt"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 106, anchor_line_end: 113
    }
  ];

  // ── 1.5 — the shared sonnet (Tier 1) ────────────────────────────────
  A.romeo_and_juliet_act1_scene5 = [
    {
      line_start: 89, line_end: 102,
      citation_display: "Romeo and Juliet 1.5.89–102",
      category: "structural",
      title: "The shared sonnet — the most formally intricate fourteen lines in the play",
      body: "When Romeo and Juliet first speak to each other, they do not speak in ordinary dialogue: they construct, line by line, a perfect English sonnet, shared between two voices. Romeo opens with the first quatrain (89–92), Juliet takes the second (93–96), and the sestet concludes with their voices alternating. The rhymes interlock across speakers — hand/stand, much/touch, lips/tips, prayer/despair, sake/take. This is not a decorative gesture. It is a structural proof of mutual recognition: the sonnet form is the Renaissance's vocabulary for solitary male desire (Petrarch to Laura, unreciprocated); by making the sonnet shared, Shakespeare insists that this love is, from the start, mutual in a way Romeo's earlier Rosaline-complaint never was. The conceit of the poem — pilgrim at a saint's shrine, hands in prayer, kiss as absolution — casts Juliet as the sacred object but also makes her an equal partner in theological argument. She counters Romeo's every turn of image. The result is both the most beautiful love-exchange in English drama and a quiet philosophical claim: love is a shared language, not a monologue.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)", "Stephen Booth, Shakespeare's Sonnets (1977)", "Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    },
    {
      line_start: 89, line_end: 107,
      citation_display: "Romeo and Juliet 1.5.89–107",
      category: "thematic",
      title: "Pilgrim and saint — love as religious parody",
      body: "The shared sonnet runs on an extended metaphor: Romeo as pilgrim, Juliet as saint, his lips as 'two blushing pilgrims,' her hand as a 'holy shrine,' their kiss as absolution from sin. This is Petrarchan devotion ('my lady' as 'my saint') intensified to near-blasphemy. The language is borrowed from Catholic pilgrimage vocabulary — palmers (pilgrims who carried palm leaves from Jerusalem), shrines, prayer — which in post-Reformation England was both exotic and faintly illicit. When Juliet says wryly 'You kiss by th' book' (1.5.107), she is both charmed and critical: Romeo is kissing according to a courtly-love manual. The exchange is the play's most honest moment about its own poetic strategy — love performed by the rulebook, but the rulebook made alive by the partner who turns each move back on its author.",
      sources: ["Heather Dubrow, Echoes of Desire (1995)", "G. K. Hunter, English Drama 1586–1642 (1997)"]
    },
    {
      line_start: 133, line_end: 145,
      citation_display: "Romeo and Juliet 1.5.133–145",
      category: "structural",
      title: "'Prodigious birth of love' — Juliet's last line of the scene",
      body: "When Juliet discovers from the Nurse that Romeo is a Montague, she gives the scene's closing quatrain: 'My only love sprung from my only hate! / Too early seen unknown, and known too late! / Prodigious birth of love it is to me, / That I must love a loathed enemy.' These rhyming couplets mirror the prologue's closing couplets — love and doom already inscribed. 'Prodigious' means 'portending evil' as well as 'wonderful': the word carries both senses. Notice that Juliet, rather than Romeo, names the structural danger. The whole first meeting has been built on her interrupting, countering, and finishing Romeo's poetic figures; here too, she gives the tragedy its first name. Juliet is the play's keenest judge of its own situation.",
      sources: ["Coppélia Kahn, Man's Estate (1981)"]
    }
  ];

  T.romeo_and_juliet_act1_scene5 = [
    {
      kind: "structural",
      prompt: "What verse form do Romeo and Juliet construct together during their first conversation?",
      options: [
        "A couplet",
        "A shared English sonnet — fourteen lines, three quatrains and a couplet, split between the two voices",
        "Blank verse",
        "Prose"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 89, anchor_line_end: 102
    },
    {
      kind: "close_reading",
      prompt: "What controlling metaphor runs through the shared sonnet?",
      options: [
        "Hunter and prey",
        "Pilgrim approaching a saint at a shrine — with kisses figured as absolution",
        "Ship and storm",
        "Gardener and rose"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 89, anchor_line_end: 102
    },
    {
      kind: "theme",
      prompt: "Why does the shared sonnet matter as a structural claim about this love vs. the Rosaline-love of 1.1?",
      options: [
        "It shows Romeo has a better tailor",
        "The sonnet has two voices instead of one — mutuality instead of Petrarchan unrequited monologue",
        "It proves Romeo has memorized more poems",
        "It has nothing to do with Rosaline"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 89, anchor_line_end: 107
    },
    {
      kind: "comprehension",
      prompt: "What does Juliet mean by calling Romeo's style 'You kiss by th' book'?",
      options: [
        "He is very bad at kissing",
        "He is kissing according to a courtly-love manual — charming and affected at once",
        "He has a Bible in his hand",
        "She is rejecting him"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 107, anchor_line_end: 107
    },
    {
      kind: "inference",
      prompt: "Juliet closes the scene with 'Prodigious birth of love it is to me, / That I must love a loathed enemy.' What does this accomplish?",
      options: [
        "It breaks the scene's mood",
        "It echoes the Prologue's closing couplets and names the tragic structure — Juliet is the first to articulate it",
        "It is spoken only to herself and has no bearing on plot",
        "It praises the Nurse"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 141, anchor_line_end: 145
    }
  ];

  // Lighter coverage for non-Tier-1 scenes in Act 1
  A.romeo_and_juliet_act1_scene2 = [
    {
      line_start: 8, line_end: 16,
      citation_display: "Romeo and Juliet 1.2.8–16",
      category: "thematic",
      title: "Capulet on his daughter — 'the hopeful lady of my earth'",
      body: "Capulet's first description of Juliet is surprisingly tender: she is his 'hopeful lady of my earth,' the only surviving child in a family that has buried others. The Latinate pun on 'earth' (terra, estate) compresses the two things she is to him — the living daughter he loves and the material heir who will preserve the house. This helps explain the violence of 3.5: Capulet's rage against Juliet is not only patriarchal but dynastic. She is the only thing that keeps his line going. Whether that helps or hurts her situation, the play asks us to see both sides.",
      sources: ["Coppélia Kahn, Man's Estate (1981)"]
    }
  ];
  T.romeo_and_juliet_act1_scene2 = [
    {
      kind: "comprehension",
      prompt: "Why is Juliet Capulet's only remaining child?",
      options: [
        "She was the only one her parents wanted",
        "Capulet says 'Earth hath swallow'd all my hopes but she' — his other children have died",
        "The Capulets never had other children",
        "Her siblings have been sent away to school"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 14, anchor_line_end: 16
    },
    {
      kind: "theme",
      prompt: "When Capulet tells Paris that Juliet is 'yet a stranger in the world,' he means:",
      options: [
        "She is a foreigner",
        "She is still young and unmarried — not yet initiated into adult society",
        "She does not know Paris personally",
        "She is shy at public gatherings"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 8, anchor_line_end: 11
    }
  ];
};
