/**
 * King Lear — Act I annotations + Trials. 1.1 (Tier 1) holds "Nothing
 * will come of nothing"; 1.4 (Tier 1) contains Goneril's rejection.
 */

module.exports = function (A: any, T: any) {

  // ── 1.1 — King Lear's palace (Tier 1) ───────────────────────────────
  A.king_lear_act1_scene1 = [
    {
      line_start: 1, line_end: 40,
      citation_display: "King Lear 1.1.1–40",
      category: "structural",
      title: "The play opens in prose — Gloucester and Kent on Edmund",
      body: "Lear famously begins with a prose conversation between Kent and Gloucester about a bastard son, not with the titular king. Gloucester introduces Edmund as 'this knave came somewhat saucily to the world before he was sent for' — a casual genital joke delivered in his son's hearing. This opening does three structural jobs at once. It introduces the Gloucester subplot that will run in strict parallel to the main Lear plot. It establishes Edmund as the resentful outsider whose resentment the play will vindicate as he destroys everyone. And it makes sexual and familial irregularity the medium of the play's moral universe — the feudal order that is about to be formally divided was already rotten in private. Shakespeare's decision to open with Edmund's paternity rather than Lear's coronet is a quiet masterstroke.",
      sources: ["Jonathan Bate, Soul of the Age (2008)", "Stephen Greenblatt, Will in the World (2004)"]
    },
    {
      line_start: 40, line_end: 120,
      citation_display: "King Lear 1.1.40–120",
      category: "thematic",
      title: "The love test — Lear's fatal category error",
      body: "Lear's 'Which of you shall we say doth love us most' confuses two kinds of love — the emotional and the performative. Goneril and Regan understand the game; Cordelia refuses it. Her 'Nothing, my lord' answers a question that should not have been asked. The scene is often played as Lear's tragic blindness, but it is better understood as his tragic presumption: that love can be auctioned, that rank can be bargained for in affection. Lear wants both to give up the kingdom (physical power) and to keep all of love's ceremonies (emotional tribute). The play exists because those two things cannot coexist. Shakespeare, remarkably, gives Lear no good reason for staging the love test at all — no motive survives analysis except vanity itself. That is the point: vanity starts the tragedy.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Stanley Cavell, 'The Avoidance of Love' in Disowning Knowledge (1987)"]
    },
    {
      line_start: 85, line_end: 135,
      citation_display: "King Lear 1.1.85–135",
      category: "close_reading",
      title: "'Nothing will come of nothing' — the play's governing word",
      body: "Lear's 'Nothing will come of nothing: speak again' inaugurates a word that will return at the play's most critical junctures. Cordelia's 'Nothing' is Lear's undoing; Edmund's 'Nothing, my lord' in 1.2 (about the forged letter) is Gloucester's; the Fool in 1.4 calls the king 'nothing' — 'Now thou art an O without a figure.' In 4.6 the Fool is absent and Lear is himself reduced to the nothingness the word names. The line Lear speaks is an aggressive rhetorical pressure: 'say more, or I take back the gift.' Cordelia replies, essentially, by refusing the category: love cannot be spoken in the register Lear demands. The play's philosophical claim compresses here: the things that matter most cannot be turned into speech-acts without being destroyed in the process. This annotation sits here as the root, and every subsequent 'nothing' in the play is its fruit.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 155, line_end: 200,
      citation_display: "King Lear 1.1.155–200",
      category: "thematic",
      title: "Kent as the play's first truth-teller — and his immediate exile",
      body: "When Lear exiles Cordelia, Kent steps in: 'Kill thy physician, and the fee bestow / Upon the foul disease.' He tells Lear his 'youngest daughter does not love thee least' — plain speech that costs him his rank and country. The play will make a pattern of this: those who speak truth are banished, blinded, or killed. The Fool, Kent, Cordelia, Gloucester, Edgar — each is punished for candor. Lear's world is built on the ceremonial lie, and the play will burn that world down around him. Kent's disguise as 'Caius' in 1.4 makes the point formal: the truth-teller can stay only if he performs as someone else. Shakespeare makes the political point sharp — a kingdom that cannot tolerate honesty is a kingdom that will not survive.",
      sources: ["Stephen Greenblatt, Shakespearean Negotiations (1988)"]
    },
    {
      line_start: 255, line_end: 305,
      citation_display: "King Lear 1.1.255–305",
      category: "close_reading",
      title: "France sees Cordelia — love, unlike Lear's, that increases with loss",
      body: "The Duke of Burgundy drops his suit the moment Cordelia loses her dowry. The King of France does the opposite: 'Fairest Cordelia, that art most rich, being poor; / Most choice, forsaken; and most lov'd, despis'd!' His love is the exact inverse of Lear's love-test economics. Where Lear measured love by gift received, France measures by gift given despite disfavor. The speech is the play's first real-time demonstration of what love actually is, offered against Lear's three-scene-long misunderstanding of it. It is also dramatically economical — we meet France only here, but this one speech is enough to make his absence in later acts painful when Cordelia comes back without him (4.3 sends him home on an 'imperfect' dispatch).",
      sources: ["Jill L. Levenson, 'Shakespeare's Language of Tragedy,' Cambridge Companion (2001)"]
    }
  ];

  T.king_lear_act1_scene1 = [
    {
      kind: "close_reading",
      prompt: "What is the significance of Cordelia's 'Nothing, my lord'?",
      options: [
        "She cannot speak from stage fright",
        "She refuses to participate in Lear's flattery-for-land exchange — her answer rejects the terms of the question itself",
        "She is angry with her sisters",
        "She has forgotten her prepared speech"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 85, anchor_line_end: 95
    },
    {
      kind: "theme",
      prompt: "The word 'nothing' is introduced in 1.1. How does it function across the play?",
      options: [
        "It appears only in this scene",
        "It is an ordinary word that Shakespeare uses unremarkably",
        "It returns as a governing refrain — Cordelia's 'Nothing,' Edmund's 'Nothing' (1.2), the Fool's 'thou art nothing' (1.4), and Lear's reduction to nothing in the storm scenes",
        "It is always spoken by Lear"
      ],
      answer_index: 2, wisdom_reward: 25,
      anchor_line_start: 85, anchor_line_end: 95
    },
    {
      kind: "inference",
      prompt: "Why does the play open with Gloucester's banter about Edmund rather than with Lear's coronet?",
      options: [
        "Shakespeare had not yet decided who the protagonist was",
        "To introduce the Gloucester subplot as formal parallel to the main Lear plot, and to establish sexual/familial irregularity as the play's moral climate",
        "It is an editorial error",
        "To make the play shorter"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 40
    },
    {
      kind: "comprehension",
      prompt: "What does Kent try to do in response to Cordelia's banishment?",
      options: [
        "He agrees with Lear and withdraws",
        "He intervenes on Cordelia's behalf — 'Thy youngest daughter does not love thee least' — and is himself exiled for speaking honestly",
        "He convinces Lear to revoke the banishment",
        "He leaves without a word"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 155, anchor_line_end: 200
    },
    {
      kind: "theme",
      prompt: "What does France's willingness to marry dowry-less Cordelia demonstrate?",
      options: [
        "He is acting strategically for political alliance",
        "Real love increases with loss, inverting Lear's transactional understanding of affection — the play's first positive demonstration of what love actually is",
        "He is mocking her",
        "He feels sorry for her"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 255, anchor_line_end: 290
    },
    {
      kind: "structural",
      prompt: "The Fool, Kent, Cordelia, Gloucester, and Edgar share what common fate?",
      options: [
        "All of them are Lear's children",
        "Each is punished for speaking truth — banished, blinded, disguised, or killed — in a play that systematically destroys its truth-tellers",
        "None of them survive the play",
        "All are nobility"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 155, anchor_line_end: 200
    }
  ];

  // ── 1.2 — Gloucester's castle ───────────────────────────────────────
  A.king_lear_act1_scene2 = [
    {
      line_start: 1, line_end: 22,
      citation_display: "King Lear 1.2.1–22",
      category: "thematic",
      title: "Edmund's 'Nature' soliloquy — the play's materialist manifesto",
      body: "Edmund's opening speech is the most dangerous in the play: a young man invoking 'Nature' against custom and law, claiming that illegitimate sons have 'more composition and fierce quality' than children 'got 'tween asleep and wake' in tired marital beds. This is Renaissance anti-humanism avant la lettre — Machiavellian in content, Senecan in rhetoric. Edmund has no supernatural explanation for his resentment and does not want one; he later rejects astrology as 'the excellent foppery of the world.' He is the play's first thoroughgoing modern — self-made, unbelieving, free of metaphysical scruple. Shakespeare lets him speak this speech with such rhetorical force that audiences often find themselves agreeing before they remember what Edmund will do. That seduction is deliberate: the play is testing how much of traditional morality survives when someone refuses to take it seriously.",
      sources: ["Stephen Greenblatt, Renaissance Self-Fashioning (1980)", "Jonathan Dollimore, Radical Tragedy (1984)"]
    }
  ];
  T.king_lear_act1_scene2 = [
    {
      kind: "close_reading",
      prompt: "What does Edmund mean by invoking 'Nature' as his goddess?",
      options: [
        "He is a pastoral poet",
        "He rejects custom, law, and legitimacy as arbitrary conventions, claiming natural vigor over social categories — a materialist manifesto",
        "He is a pagan religious believer",
        "He is quoting Cicero"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 22
    },
    {
      kind: "theme",
      prompt: "What is Edmund's view of astrology (lines ~103–120)?",
      options: [
        "He believes in it fervently",
        "He dismisses it as 'excellent foppery' — a self-excusing fiction for moral weakness",
        "He is uncertain",
        "He accepts only certain forms of it"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 103, anchor_line_end: 125
    }
  ];

  // ── 1.4 — Hall in Albany's palace (Tier 1) ───────────────────────────
  A.king_lear_act1_scene4 = [
    {
      line_start: 85, line_end: 130,
      citation_display: "King Lear 1.4.85–130",
      category: "historical",
      title: "The Fool's first appearance — the license of truth-telling",
      body: "The licensed fool was a historical office in European courts: a jester permitted to speak truths that would have been fatal from anyone else. Lear's Fool operates in that tradition at its most serious — he uses prose, riddle, song, and mock-prophecy to tell Lear truths the king cannot hear directly. 'Thou hadst little wit in thy bald crown when thou gav'st thy golden one away' is the whole play compressed into sixteen words. The Fool's genius is that he speaks while pretending not to mean it; his jester's cap is his armor. Shakespeare's deepest move is making the Fool's love for Lear unmistakable — he follows Lear into the storm when saner people leave. The licensed fool tradition ends when the fool starts caring; then he becomes a tragic figure, not a comic one.",
      sources: ["Enid Welsford, The Fool: His Social and Literary History (1935)", "Robert Armin, Fool upon Fool (1605) — Armin played the original Fool"]
    },
    {
      line_start: 190, line_end: 230,
      citation_display: "King Lear 1.4.190–230",
      category: "thematic",
      title: "'How sharper than a serpent's tooth' — Lear's first great curse",
      body: "Goneril's demand that Lear reduce his retinue triggers the play's first great outburst: 'Ingratitude, thou marble-hearted fiend... / How sharper than a serpent's tooth it is / To have a thankless child!' The imagery is biblical (Lear compares Goneril to the sea-monster); the emotional logic is primitive — the organ of increase cursed with sterility, the mother's womb wished barren. Lear's rhetoric here is already crossing a line: he wishes Goneril's hypothetical child to be 'disnatured torment' to her, so she may know what a thankless child feels like. This is imprecation as tragic condition. The speech is where Goneril loses whatever sympathy modern productions sometimes try to give her: a father who would curse his daughter's womb has forfeited moral standing. But the play also shows she has already acted on the decision to break him — her rejection precedes his curse, not the reverse.",
      sources: ["Marilyn French, Shakespeare's Division of Experience (1981)", "Frank Kermode, Shakespeare's Language (2000)"]
    },
    {
      line_start: 295, line_end: 310,
      citation_display: "King Lear 1.4.295–310",
      category: "structural",
      title: "Albany begins to matter — the conscience the play will reward",
      body: "Albany, Goneril's husband, says very little in 1.4. His 'How far your eyes may pierce I cannot tell' is the first whisper of moral hesitation from the play's patient-to-develop conscience. The contrast with Cornwall — instantly cruel, already drawn into the Edmund plot — will structure Act 3 and 4. By 4.2 Albany will be calling his wife 'most barbarous, most degenerate'; by 5.3 he will be on the right side of the final judgments. Shakespeare is doing something subtle: planting the quietest figure in Act 1 to be the surviving moral voice in Act 5. The technique is the reverse of Edmund, who dazzles in 1.2 and is dead by 5.3. Lear teaches that moral weight accumulates slowly in the people who speak least.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)"]
    }
  ];
  T.king_lear_act1_scene4 = [
    {
      kind: "historical",
      prompt: "What is the historical 'licensed fool' tradition the Fool inherits?",
      options: [
        "A pantomime tradition",
        "A court office permitting the jester to speak truths that would be fatal from anyone else — the Fool's 'license' is literal social permission",
        "A religious tradition",
        "A post-Elizabethan invention"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 85, anchor_line_end: 130
    },
    {
      kind: "close_reading",
      prompt: "Of whom does Lear say 'How sharper than a serpent's tooth it is / To have a thankless child!'?",
      options: [
        "Cordelia",
        "Goneril, whose reduction of his retinue has triggered his first great curse against filial ingratitude",
        "The Fool",
        "Regan"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 220, anchor_line_end: 225
    },
    {
      kind: "inference",
      prompt: "Why does the Fool offer Kent a coxcomb for following Lear?",
      options: [
        "He wants to embarrass Kent",
        "The Fool's jest — anyone who still serves a king who has given away his kingdom is a fool; the coxcomb is the badge of folly he thinks Kent has earned",
        "He has extra coxcombs",
        "He dislikes Kent"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 88, anchor_line_end: 100
    },
    {
      kind: "structural",
      prompt: "What structural role is Albany playing in 1.4 that pays off in Acts 4–5?",
      options: [
        "None — he has no development",
        "He begins as the silent, hesitating husband whose moral weight accumulates through the play until he is among the final judges in 5.3",
        "He is secretly working with Edmund",
        "He speaks only in aside"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 295, anchor_line_end: 310
    }
  ];

  // ── 1.3, 1.5 — shorter coverage ─────────────────────────────────────
  A.king_lear_act1_scene3 = [
    {
      line_start: 1, line_end: 27,
      citation_display: "King Lear 1.3.1–27",
      category: "structural",
      title: "Goneril's strategy — speed, provocation, documented grievance",
      body: "Goneril's brief twenty-seven-line scene with Oswald is a compressed study in practical politics. She orders the household to slack service to Lear, encourages grievances, tells Oswald she 'would breed from hence occasions' — manufactured provocations. The plan is to make Lear angry enough that his anger itself will provide cover for the retinue-reduction she has already decided to impose. This is Shakespeare's quickest demonstration of how the sisters operate: by creating the appearance of Lear's instability so that the punishment they intend can be framed as response rather than premeditation. Goneril anticipates modern PR.",
      sources: ["Marilyn French, Shakespeare's Division of Experience (1981)"]
    }
  ];
  T.king_lear_act1_scene3 = [
    {
      kind: "inference",
      prompt: "What is Goneril's strategy in 1.3?",
      options: [
        "To patiently care for her father",
        "To instruct her household to provoke Lear — manufacturing grievances so that her planned retinue-reduction can appear to respond to his bad behavior rather than precede it",
        "To beg Lear to leave",
        "To consult with Regan first"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 27
    }
  ];

  A.king_lear_act1_scene5 = [
    {
      line_start: 36, line_end: 42,
      citation_display: "King Lear 1.5.36–42",
      category: "thematic",
      title: "'I would not be mad' — Lear names the fear",
      body: "In six lines at the end of 1.5 Lear says aloud what he has been avoiding: 'O, let me not be mad, not mad, sweet heaven! / Keep me in temper: I would not be mad.' This is the first explicit admission. Before this he has raged; now he has cognitive insight into his own trajectory. The self-awareness is not a protection — he goes mad anyway — but it is the beginning of the play's central consciousness, the king watching himself come apart. Every later madness has this moment as its root: Lear knew, and the knowing could not save him.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)"]
    }
  ];
  T.king_lear_act1_scene5 = [
    {
      kind: "close_reading",
      prompt: "What does Lear recognize at the end of 1.5?",
      options: [
        "That he has made a mistake with his retinue",
        "That he fears losing his reason — 'let me not be mad, not mad, sweet heaven!' — the first explicit acknowledgment of the trajectory toward madness",
        "That he wishes to see Cordelia",
        "That the Fool is lying"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 36, anchor_line_end: 42
    }
  ];
};
