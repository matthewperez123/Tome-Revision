/**
 * Act III — annotations. 3.1 Mercutio's death and 3.5 the dawn parting
 * are the Tier-1 scenes.
 */

module.exports = function (A: any, T: any, _cite: any) {

  A.romeo_and_juliet_act3_scene1 = [
    {
      line_start: 95, line_end: 122,
      citation_display: "Romeo and Juliet 3.1.95–122",
      category: "structural",
      title: "'A plague o' both your houses!' — the play's tragic hinge",
      body: "Everything before this moment is comedy — arranged or conditioned or delayed. Everything after is tragedy. Mercutio's death converts the register of the whole play. The specific mechanism is cruel: Romeo's well-meaning intervention (stepping between Tybalt and Mercutio to urge peace, citing the Prince's decree) is exactly what enables Tybalt to land the fatal thrust, reaching under Romeo's arm. Romeo's peacemaking causes the death that will force the tragedy. Mercutio delivers three versions of his dying curse, 'A plague o' both your houses,' each more desperate than the last — refusing to side with either family, laying the tragedy's fault equally on both. The curse is structurally performative: from Mercutio's death forward, the play accelerates, every scene shorter and tighter than the last, rushing toward 5.3.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Susan Snyder, The Comic Matrix of Shakespeare's Tragedies (1979)"]
    },
    {
      line_start: 96, line_end: 110,
      citation_display: "Romeo and Juliet 3.1.96–110",
      category: "close_reading",
      title: "Mercutio dying — puns to the last",
      body: "Mercutio's dying lines keep his voice intact: 'Ask for me to-morrow, and you shall find me a grave man' — the pun on 'grave' (serious / sepulchral) is delivered with a wound in his chest. 'I am peppered, I warrant, for this world' — 'peppered' meaning 'done for.' He keeps fencing with language until his language gives out. This is not just characterization; it is structural. The play cannot continue in Mercutio's voice, and he knows it: 'A plague o' both your houses, / They have made worms' meat of me.' The 'worms' meat' phrase compresses his identity (wit, speed, excess) into the material fact of a corpse. Mercutio's commitment to puns even as he bleeds out is Shakespeare's most concentrated demonstration of character expressed in style.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 156, line_end: 158,
      citation_display: "Romeo and Juliet 3.1.156–158",
      category: "thematic",
      title: "'O, I am fortune's fool!'",
      body: "After killing Tybalt, Romeo cries out: 'O, I am fortune's fool!' — the phrase naming the play's second theory of misfortune. The prologue said 'star-cross'd' (fated by the stars); here, Romeo says 'fortune's fool' (toy of the goddess Fortuna). Fortune was the medieval figure of circumstance; her wheel raised and toppled men arbitrarily. Romeo is indicating that he is not just doomed, but humiliated by doom — made a fool. The self-awareness is partial: he is not yet ready to rebel against fortune. That moment comes in 5.1, 'Then I defy you, stars!' — where his suicide becomes the paradoxical assertion of will against the fate the prologue announced.",
      sources: ["Douglas Peterson, Time, Tide, and Tempest (1973)", "Frederick Kiefer, Fortune and Elizabethan Tragedy (1983)"]
    },
    {
      line_start: 185, line_end: 222,
      citation_display: "Romeo and Juliet 3.1.185–222",
      category: "structural",
      title: "The Prince's second judgment — exile instead of death",
      body: "Escalus returns to adjudicate the second major breach of the peace. The decision is consequential: Romeo killed Tybalt, but Tybalt killed Mercutio first. The Prince banishes Romeo rather than executing him, and fines the Montagues and Capulets. Every element of this judgment will drive the rest of the play. Banishment rather than death preserves Romeo — and therefore preserves the need to communicate with Juliet — and therefore requires the Friar's letter, which (Act 5) will fail to reach him. The fine does not end the feud; the families' private grief takes a more personal turn. The Prince's closing line, 'Mercy but murders, pardoning those that kill,' is a rueful acknowledgment that his attempted mercy will not save more lives.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    }
  ];

  T.romeo_and_juliet_act3_scene1 = [
    {
      kind: "structural",
      prompt: "Why is Mercutio's death called the play's tragic hinge?",
      options: [
        "It is the longest death-scene",
        "It converts the play's register from comedy to tragedy — everything before is conditional, everything after is catastrophe",
        "It happens at the exact midpoint (line count)",
        "The Prince appears for the first time"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 95, anchor_line_end: 122
    },
    {
      kind: "comprehension",
      prompt: "How exactly does Tybalt manage to wound Mercutio?",
      options: [
        "Tybalt stabs him from behind",
        "Romeo steps between them to urge peace, and Tybalt thrusts under Romeo's arm — Romeo's peacemaking enables the fatal blow",
        "Mercutio trips on his own sword",
        "Benvolio accidentally pushes Mercutio onto Tybalt's blade"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 90, anchor_line_end: 97
    },
    {
      kind: "close_reading",
      prompt: "What pun does the dying Mercutio make?",
      options: [
        "A pun on 'feud' / 'food'",
        "'Ask for me to-morrow, and you shall find me a grave man' — grave meaning both serious and buried",
        "A pun on 'Tybalt' / 'Tybert'",
        "A pun on 'Romeo' / 'rose'"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 97, anchor_line_end: 99
    },
    {
      kind: "theme",
      prompt: "What does Mercutio's triple-repeated curse 'A plague o' both your houses!' accomplish?",
      options: [
        "It blames only the Capulets",
        "It refuses to take sides — laying the tragedy's fault equally on Montague and Capulet",
        "It asks for divine intervention",
        "It is merely an exclamation"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 99, anchor_line_end: 122
    },
    {
      kind: "inference",
      prompt: "Romeo cries 'O, I am fortune's fool!' — what does this mean?",
      options: [
        "He is proud of his luck",
        "He feels used and humiliated by Fortune (circumstance) — a toy of events beyond his control",
        "He is apologizing to Tybalt",
        "He is joking"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 156, anchor_line_end: 158
    },
    {
      kind: "structural",
      prompt: "What is the Prince's judgment at the end of the scene?",
      options: [
        "He executes Romeo",
        "He exiles Romeo from Verona on pain of death — and fines both houses; this preserves Romeo for the rest of the tragedy",
        "He pardons Romeo entirely",
        "He jails Romeo for one year"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 211, anchor_line_end: 222
    }
  ];

  A.romeo_and_juliet_act3_scene2 = [
    {
      line_start: 1, line_end: 31,
      citation_display: "Romeo and Juliet 3.2.1–31",
      category: "close_reading",
      title: "Juliet's epithalamium — 'Gallop apace, you fiery-footed steeds'",
      body: "While the city is still reeling from 3.1, Juliet (who does not yet know) calls on night to come quickly so Romeo can reach her. Her speech is an epithalamium, a wedding-night hymn in the Renaissance tradition (Spenser's Epithalamion, 1595, is the English masterpiece). 'Come, civil night, / Thou sober-suited matron, all in black' — night as chaperone to her first sexual experience. The speech then pivots to sublime astronomy: 'Take him and cut him out in little stars, / And he will make the face of heaven so fine / That all the world will be in love with night.' The pitch of desire here is vertical, cosmic — and the audience, knowing Tybalt is dead and Romeo is about to be banished, receives the speech as both gorgeous and devastating.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)", "Heather Dubrow, A Happier Eden: The Politics of Marriage in the Stuart Epithalamium (1990)"]
    },
    {
      line_start: 73, line_end: 85,
      citation_display: "Romeo and Juliet 3.2.73–85",
      category: "close_reading",
      title: "Juliet's stacked oxymorons — the Petrarchan mode now turned tragic",
      body: "When Juliet believes Romeo has killed Tybalt, she lets loose: 'O serpent heart, hid with a flowering face! / ... Dove-feather'd raven! wolvish-ravening lamb! / Despised substance of divinest show! / Just opposite to what thou justly seem'st, / A damned saint, an honourable villain!' These are the same oxymorons Romeo played with for Rosaline in 1.1 — but now they mean something. Rosaline-Petrarchism was pose; Juliet's paradoxes here are a genuine moral crisis, the lover discovering her beloved is also a killer. Shakespeare turns the rhetorical device from decoration to tragic utterance. This is the play asking: how do you speak when the person you love has done the thing you hate? The answer is oxymoron — the figure of impossible truth.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    }
  ];
  T.romeo_and_juliet_act3_scene2 = [
    {
      kind: "structural",
      prompt: "What Renaissance genre does Juliet's 'Gallop apace' speech belong to?",
      options: [
        "The elegy (mourning poem)",
        "The epithalamium — a wedding-night hymn celebrating the approach of consummation",
        "The eclogue (pastoral dialogue)",
        "The anacreontic (drinking-song)"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 31
    },
    {
      kind: "close_reading",
      prompt: "Juliet's 'serpent heart, hid with a flowering face' and 'Dove-feather'd raven' are examples of —",
      options: [
        "Simple metaphor",
        "Oxymoron — but now carrying real moral weight, unlike Romeo's earlier Petrarchan versions",
        "Chiasmus",
        "Metonymy"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 73, anchor_line_end: 81
    },
    {
      kind: "inference",
      prompt: "What is the effect of juxtaposing Juliet's 'Gallop apace' with what the audience knows (Tybalt's death, Romeo's banishment)?",
      options: [
        "It is merely decorative",
        "Dramatic irony — the audience receives the speech as both exquisite and devastating; the ecstasy is already shadowed by the catastrophe",
        "It creates confusion in the plot",
        "It prefigures the Nurse's betrayal"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 110
    }
  ];

  A.romeo_and_juliet_act3_scene3 = [
    {
      line_start: 12, line_end: 70,
      citation_display: "Romeo and Juliet 3.3.12–70",
      category: "thematic",
      title: "'There is no world without Verona walls' — banishment as death",
      body: "Romeo's speech on banishment is the play's most extreme statement of the lover's absolutism. The Friar has announced the Prince's mercy: exile instead of execution. Romeo rejects the framing: 'There is no world without Verona walls, / But purgatory, torture, hell itself.' To be banished from Juliet is to be banished from existence. The speech stacks increasingly extreme formulations — banishment is worse than death, because death at least sets you free from Juliet's absence. This is hyperbole, but it is also an accurate report of how love-totalitarianism felt to a sixteen-year-old in Shakespeare's world (and in ours). The Friar's attempt to counsel 'philosophy' — classical Stoic acceptance — crashes into Romeo's 'Hang up philosophy.' The play is not endorsing either position; it is staging the collision.",
      sources: ["G. K. Hunter, English Drama 1586–1642 (1997)", "Douglas Peterson, Time, Tide, and Tempest (1973)"]
    }
  ];
  T.romeo_and_juliet_act3_scene3 = [
    {
      kind: "theme",
      prompt: "Why does Romeo say 'There is no world without Verona walls'?",
      options: [
        "Because he has never travelled",
        "Because banishment means separation from Juliet — without her, there is no 'world' worth the name",
        "Because Verona has the best food in Italy",
        "Because he fears Mantua's law"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 17, anchor_line_end: 21
    },
    {
      kind: "structural",
      prompt: "What position does the Friar defend against Romeo's despair?",
      options: [
        "He urges him to escape to France",
        "He appeals to 'philosophy' — classical Stoic acceptance — which Romeo rejects ('Hang up philosophy')",
        "He argues Romeo should confess and surrender",
        "He urges Romeo to forget Juliet"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 47, anchor_line_end: 55
    }
  ];

  A.romeo_and_juliet_act3_scene5 = [
    {
      line_start: 1, line_end: 36,
      citation_display: "Romeo and Juliet 3.5.1–36",
      category: "structural",
      title: "The aubade — a dawn-song sung in the wrong direction",
      body: "The aubade is the lyric tradition of lovers parting at dawn — typically she wishes the night would continue; he acknowledges that it must not. Shakespeare runs the convention with a twist. Juliet argues that the bird they hear is the nightingale (night's bird) rather than the lark (dawn's); Romeo at first concedes ('Let me be ta'en, let me be put to death'), accepting the fiction for the sake of one more hour. Then Juliet relents: 'It is the lark that sings so out of tune.' The reversal is devastating — once Juliet admits the dawn, it is real, and Romeo must go. The aubade tradition is courtly and erotic; here it is saturated with dread ('More light and light; more dark and dark our woes!'). Juliet's prophetic vision of Romeo 'As one dead in the bottom of a tomb' extends the tragedy's inexorable forward motion.",
      sources: ["Jonathan Saville, The Medieval Erotic Alba (1972)", "Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    },
    {
      line_start: 126, line_end: 195,
      citation_display: "Romeo and Juliet 3.5.126–195",
      category: "thematic",
      title: "Capulet's rage — the patriarch's extreme response",
      body: "When Juliet refuses to marry Paris, Capulet's response is terrifying: 'Out, you green-sickness carrion! out, you baggage! / You tallow-face!' He threatens to drag her to the church 'on a hurdle' (the sled used for traitors' executions), disown her, starve her: 'Hang, beg, starve, die in the streets!' The violence is startling partly because Capulet has been genial elsewhere (1.2, 1.5). Shakespeare shows a father whose dynastic investment in his daughter (see 1.2's 'hopeful lady of my earth') curdles into rage the moment she asserts will. Lady Capulet's 'I would the fool were married to her grave' compounds the horror. This is not a study of uniquely bad parents but of the Elizabethan household under pressure: a patriarchal house discovering that its dynasty depends on the consent of a child.",
      sources: ["Lawrence Stone, The Family, Sex and Marriage in England 1500–1800 (1977)", "Coppélia Kahn, Man's Estate (1981)"]
    },
    {
      line_start: 211, line_end: 246,
      citation_display: "Romeo and Juliet 3.5.211–246",
      category: "structural",
      title: "The Nurse's betrayal — 'ancient damnation'",
      body: "Facing the catastrophe her parents have delivered, Juliet turns to the Nurse who has loved her since the breast. The Nurse's counsel is pragmatic: marry Paris ('He's a lovely gentleman! / Romeo's a dishclout to him'). For Juliet this is betrayal absolute. Her aside — 'Ancient damnation! O most wicked fiend!' and 'Thou and my bosom henceforth shall be twain' — is the play's most painful break in adolescent relationship. She does not show the Nurse her shock; she protects the pretense and reserves her judgment for soliloquy. This is the moment Juliet is fully alone. From here, she will decide things on her own — the Friar becomes her only adviser, and her final decisions (the potion, the dagger) are her own. The Nurse does not reappear substantively after this scene.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)", "Carol Rutter, Enter the Body (2001)"]
    }
  ];
  T.romeo_and_juliet_act3_scene5 = [
    {
      kind: "structural",
      prompt: "The opening of 3.5 is a dawn-scene in a traditional lyric form. What is it?",
      options: [
        "An elegy",
        "An aubade — the medieval/Renaissance dawn-parting lyric of lovers",
        "A pastoral dialogue",
        "A prothalamion"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 36
    },
    {
      kind: "comprehension",
      prompt: "Why does Juliet initially insist the bird they hear is the nightingale, not the lark?",
      options: [
        "She cannot tell birds apart",
        "The nightingale sings by night; she is asking for more night — to keep Romeo from having to leave",
        "She thinks the lark is sick",
        "The lark cannot sing in the orchard"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 2, anchor_line_end: 20
    },
    {
      kind: "theme",
      prompt: "Capulet's rage against Juliet ('Hang, beg, starve, die in the streets!') reveals —",
      options: [
        "That he has never loved her",
        "A patriarchal dynasty's crisis when its only heir refuses to consent — his affection (1.2) turns to fury when his line depends on her will",
        "That he is drunk",
        "That he does not know who Juliet is"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 161, anchor_line_end: 175
    },
    {
      kind: "inference",
      prompt: "Juliet's response to the Nurse's advice (marry Paris, forget Romeo) is —",
      options: [
        "Relieved agreement",
        "A total break — 'Ancient damnation!' 'Thou and my bosom henceforth shall be twain' — Juliet is now alone in her decisions",
        "Anger she shows openly to the Nurse",
        "Indifference"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 235, anchor_line_end: 246
    },
    {
      kind: "close_reading",
      prompt: "'More light and light; more dark and dark our woes!' — what rhetorical figure organises this line?",
      options: [
        "Simile",
        "Parallel structure with antithesis (the repetition 'more light and light' mirrored by 'more dark and dark')",
        "Metonymy",
        "Hendiadys"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 36, anchor_line_end: 37
    }
  ];

  // Lighter coverage for 3.4 (short transitional scene)
  A.romeo_and_juliet_act3_scene4 = [
    {
      line_start: 14, line_end: 35,
      citation_display: "Romeo and Juliet 3.4.14–35",
      category: "structural",
      title: "Capulet sets the wedding date — without consulting Juliet",
      body: "This brief thirty-seven-line scene is the play's most economical turning point. Capulet, in his grief over Tybalt, promises Juliet's hand to Paris for Thursday — two days away. Juliet has just been married to Romeo; Capulet doesn't know. The haste is meant to console — 'o' Thursday let it be: o' Thursday, tell her, / She shall be married to this noble earl' — but it creates the pressure under which Juliet will take the Friar's potion. The scene is important because it happens offstage from Juliet's perspective: when we cut to her in 3.5, the Paris-marriage decision has already been made without her being consulted. Structurally, this is the Elizabethan domestic machine visible in miniature.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    }
  ];
  T.romeo_and_juliet_act3_scene4 = [
    {
      kind: "comprehension",
      prompt: "What does Capulet promise Paris in this scene, without consulting Juliet?",
      options: [
        "He will give Paris a gold chain",
        "He promises Juliet's hand in marriage for Thursday — two days away — setting the tragic timeline",
        "He will end the feud with the Montagues",
        "He will exile his daughter"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 14, anchor_line_end: 25
    }
  ];
};
