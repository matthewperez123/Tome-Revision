/**
 * Act IV — annotations. 4.1 Friar's plan, 4.3 potion soliloquy.
 */

module.exports = function (A: any, T: any, _cite: any) {

  A.romeo_and_juliet_act4_scene1 = [
    {
      line_start: 88, line_end: 121,
      citation_display: "Romeo and Juliet 4.1.88–121",
      category: "thematic",
      title: "The Friar's plan — applied ethics of medicine and poison",
      body: "The Friar's plan is the direct application of the philosophy he announced in 2.3: 'Within the infant rind of this weak flower / Poison hath residence and medicine power.' Juliet will drink a draught that mimics death, 'for two and forty hours,' long enough for her burial and for Romeo to arrive to find her alive in the tomb. The plan is intricate, physically specific, and depends on timing. Shakespeare makes the Friar name every detail: the draught's chill, the forty-two hours, Juliet's appearance of death, the waiting at the tomb. Every element will go wrong. Friar John will be quarantined by plague and fail to deliver the letter to Romeo; Romeo will reach the tomb believing Juliet dead and kill himself before she wakes; the Friar will arrive too late. The play does not blame the Friar for wickedness; it indicts him for faith in his own ingenuity in a world that does not cooperate. The lesson: a good plan is not the same as a good outcome.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Paul A. Cantor, Shakespeare's Rome (1976)"]
    },
    {
      line_start: 75, line_end: 88,
      citation_display: "Romeo and Juliet 4.1.75–88",
      category: "close_reading",
      title: "Juliet's catalogue of horrors — what she will face rather than marry Paris",
      body: "Before the Friar suggests the potion, Juliet offers him a list of what she would do rather than marry Paris: leap from a tower, walk thievish roads, hide with serpents, be chained with roaring bears, shut in a charnel-house among reeky shanks and yellow chapless skulls, lie in a new-made grave. The catalogue is gothic in the extreme — and it is a rehearsal. Juliet is imagining the tomb she will lie in two scenes later. Shakespeare builds her resolve through speech: by articulating the horror in advance, she makes the actual horror bearable. Notice the poetic weight: the 'reeky shanks and yellow chapless skulls' will be among her literal neighbors when she wakes up.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    }
  ];
  T.romeo_and_juliet_act4_scene1 = [
    {
      kind: "comprehension",
      prompt: "How long is the Friar's draught meant to keep Juliet in death-like sleep?",
      options: [
        "Twelve hours",
        "Forty-two hours ('two and forty hours')",
        "Three days",
        "A week"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 105, anchor_line_end: 110
    },
    {
      kind: "theme",
      prompt: "How does the Friar's plan embody his 2.3 philosophy?",
      options: [
        "It doesn't — the plan contradicts his philosophy",
        "A single agent (the potion) is simultaneously medicine (saving Juliet from Paris) and poison (a near-death) — use and timing determine which",
        "It rejects philosophy altogether",
        "It is a strictly religious rite"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 88, anchor_line_end: 121
    },
    {
      kind: "structural",
      prompt: "Juliet's catalogue of horrors in 4.1 functions as —",
      options: [
        "A complaint she intends to withdraw",
        "A rehearsal — the images she lists (skulls, reeky shanks, new-made graves) are literally what she will encounter in the tomb",
        "Mere hyperbole with no bearing on later scenes",
        "A plea to postpone the Paris marriage indefinitely"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 75, anchor_line_end: 88
    }
  ];

  A.romeo_and_juliet_act4_scene2 = [
    {
      line_start: 14, line_end: 36,
      citation_display: "Romeo and Juliet 4.2.14–36",
      category: "thematic",
      title: "Juliet's strategic penitence",
      body: "Juliet, newly returned from the Friar's with the potion, kneels to Capulet and asks forgiveness. Her performance is so convincing that Capulet, delighted, moves the wedding from Thursday to Wednesday — one day earlier. The irony is cruel: Juliet's theatrical obedience has accelerated the timetable she was trying to evade. The scene demonstrates, quietly, how consequential even small forms of performance become in the play; Juliet's growing competence as a self-concealing actor will carry her into the tomb in the next scene. Capulet's generous response here ('My heart is wondrous light') also reminds us that he is not a monster — just a patriarch whose affections operate through his dynasty.",
      sources: ["Marjorie Garber, Shakespeare After All (2004)"]
    }
  ];
  T.romeo_and_juliet_act4_scene2 = [
    {
      kind: "inference",
      prompt: "What unintended consequence follows from Juliet's apology?",
      options: [
        "Her father forgives her but the marriage is still Thursday",
        "Capulet, delighted, moves the wedding from Thursday to Wednesday — one day earlier, tightening the Friar's timeline",
        "The wedding is cancelled",
        "Lady Capulet suspects nothing"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 30, anchor_line_end: 44
    }
  ];

  A.romeo_and_juliet_act4_scene4 = [
    {
      line_start: 1, line_end: 24,
      citation_display: "Romeo and Juliet 4.4.1–24",
      category: "close_reading",
      title: "Capulet in his kitchen — comedy before catastrophe",
      body: "The Capulets, up through the night preparing the wedding, bicker affectionately about quinces, baked meats, the cost of musicians. Capulet calls himself a 'cot-quean' (a man who meddles in housework); Lady Capulet accuses him of being a 'mouse-hunt' in his youth. The tone is domestic, comic, entirely quotidian — a narrative pause before the discovery of Juliet's 'corpse' three dozen lines later. The twenty-four-line scene functions as Shakespeare's last rest-beat: the everyday texture of family life, made visible so that its destruction a moment later registers its full weight. Directors often cut this scene; in the text, it performs a specific structural job that cutting eliminates.",
      sources: ["Susan Snyder, The Comic Matrix of Shakespeare's Tragedies (1979)"]
    }
  ];
  T.romeo_and_juliet_act4_scene4 = [
    {
      kind: "structural",
      prompt: "What structural purpose does the short wedding-prep scene (4.4) serve?",
      options: [
        "It advances the plot significantly",
        "A last rest-beat of quotidian family life — a tonal quiet before the discovery of Juliet's 'corpse' in 4.5",
        "It introduces new characters",
        "It provides comic relief at random"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 24
    }
  ];

  A.romeo_and_juliet_act4_scene3 = [
    {
      line_start: 14, line_end: 58,
      citation_display: "Romeo and Juliet 4.3.14–58",
      category: "close_reading",
      title: "Juliet's potion soliloquy — a tour of her own terror",
      body: "Left alone with the vial, Juliet's forty-four lines walk through every fear she can imagine and still choose the potion. She asks: What if this is poison — what if the Friar is saving himself from having married me? (She reasons he is too holy.) What if she wakes before Romeo arrives and suffocates in the tomb? What if she wakes among the stinking bones of her ancestors, Tybalt's new corpse fresh? What if ghosts wail and mandrakes scream? What if she goes mad? The whole speech is a study of a young person conducting her own moral audit under maximum pressure — she considers betrayal (by the Friar), suffocation, madness, desecration — and then drinks. Her toast 'Romeo, I come! this do I drink to thee' is both a wedding-night toast and a death-toast, compressed. This is one of Shakespeare's most concentrated studies of a character facing, and exceeding, her own fear.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Marjorie Garber, Shakespeare After All (2004)"]
    }
  ];
  T.romeo_and_juliet_act4_scene3 = [
    {
      kind: "inference",
      prompt: "Why does Juliet briefly consider the possibility that the Friar's potion is actually poison?",
      options: [
        "She is paranoid",
        "She reasons that the Friar might want to be rid of her to conceal his crime of marrying them — and then decides he is too holy for that",
        "She dislikes the Friar",
        "She has heard a rumor"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 24, anchor_line_end: 30
    },
    {
      kind: "theme",
      prompt: "Juliet's toast 'Romeo, I come! this do I drink to thee' compresses —",
      options: [
        "Only a wedding toast",
        "Both a wedding toast (drinking to her groom) and a death toast (drinking the near-poison) — the bridal and funereal registers collapse into one",
        "A mockery of Romeo",
        "A prayer to the Virgin Mary"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 57, anchor_line_end: 58
    },
    {
      kind: "close_reading",
      prompt: "What specific horror does Juliet imagine about the tomb?",
      options: [
        "Only that it is cold",
        "Ghosts wailing, mandrakes screaming, Tybalt's fresh corpse nearby, suffocation before Romeo arrives — an accumulating catalogue of specific terrors",
        "That her dress will be ruined",
        "Nothing in particular"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 30, anchor_line_end: 55
    }
  ];

  A.romeo_and_juliet_act4_scene5 = [
    {
      line_start: 40, line_end: 98,
      citation_display: "Romeo and Juliet 4.5.40–98",
      category: "structural",
      title: "The mourners' ritual — comedy inside tragedy",
      body: "The Nurse, Lady Capulet, Paris, and Capulet each deliver stylized laments over Juliet's 'corpse.' The repetitions — 'O lamentable day!', 'O woeful day!' — are so formulaic that they verge on parody. Shakespeare is doing something delicate here: the audience knows Juliet is not dead (she has drunk the Friar's potion), so the mourners' grief is both real and misdirected. The scene then pivots to the musicians and the servant Peter in a small comic interlude (Peter calling for the musicians to play Heart’s ease), giving the audience a pressure-release before Act 5. It is unusual theater — comedy embedded in a false funeral. Some editors consider the Peter scene to be a detachable bit for the comedian Will Kemp; others defend it as Shakespeare's deliberate tone-modulation before the tomb scene.",
      sources: ["Susan Snyder, The Comic Matrix of Shakespeare's Tragedies (1979)", "Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    }
  ];
  T.romeo_and_juliet_act4_scene5 = [
    {
      kind: "structural",
      prompt: "What tone does the scene of lamentation over Juliet's 'corpse' strike?",
      options: [
        "Straightforwardly tragic",
        "Formally stylized and repetitive, approaching parody — the audience knows Juliet is not really dead, so the mourners' grief is both real and misdirected",
        "Purely comic",
        "Silent mime"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 40, anchor_line_end: 70
    },
    {
      kind: "inference",
      prompt: "Why does Shakespeare follow the funeral laments with a brief comic exchange with musicians?",
      options: [
        "The play is losing its thread",
        "Deliberate tone-release before Act 5 — and a comic-register echo of Mercutio's lost voice; Peter the servant replaces Mercutio as wit-figure",
        "To fill time while actors change costume",
        "It is a printing error"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 98, anchor_line_end: 135
    }
  ];
};
