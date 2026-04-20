/**
 * Act II — annotations. 2.2 balcony (Tier 1) is the load-bearing scene;
 * 2.3 is the Friar's herbal philosophy.
 */

module.exports = function (A: any, T: any, _cite: any) {

  A.romeo_and_juliet_act2_scene1 = [
    {
      line_start: 13, line_end: 40,
      citation_display: "Romeo and Juliet 2.1.13–40",
      category: "close_reading",
      title: "Mercutio's mock conjuration — the Petrarchan blazon weaponised",
      body: "Mercutio's 'conjuration' of Romeo by cataloguing Rosaline's body is a deliberate parody of the Petrarchan blazon — the sonnet-convention of listing the beloved's features (bright eyes, red lips, white hand) as isolated ornaments. Mercutio pushes the form to obscenity ('quivering thigh / And the demesnes that there adjacent lie'), revealing what the blazon always half-concealed: the beloved's body reduced to a pornographic inventory. By degrading Petrarchism into filth here, Shakespeare clears the air for the balcony scene that follows — where Romeo and Juliet will speak to each other as subjects, not as catalogued objects. Mercutio's wit is the play's most relentless de-romanticising voice; its silence after 3.1 is a formal loss, not just the loss of a friend.",
      sources: ["Nancy J. Vickers, 'Diana Described: Scattered Woman and Scattered Rhyme' (1981)"]
    }
  ];
  T.romeo_and_juliet_act2_scene1 = [
    {
      kind: "theme",
      prompt: "What does Mercutio's crude 'conjuration' of Rosaline parody?",
      options: [
        "Catholic exorcism rites",
        "The Petrarchan blazon — the sonnet-catalogue of a beloved's isolated features",
        "A medical examination",
        "A legal summons"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 18, anchor_line_end: 30
    },
    {
      kind: "inference",
      prompt: "Why does Mercutio not understand Romeo's true condition in this scene?",
      options: [
        "He has not yet met Romeo",
        "He still thinks Romeo pines for Rosaline — unaware of Juliet or the Capulet ball's outcome",
        "He is drunk",
        "He is deliberately ignoring him"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 1, anchor_line_end: 40
    }
  ];

  A.romeo_and_juliet_act2_scene2 = [
    {
      line_start: 2, line_end: 22,
      citation_display: "Romeo and Juliet 2.2.2–22",
      category: "close_reading",
      title: "'What light through yonder window breaks?' — Juliet as the sun",
      body: "Romeo's opening speech in the orchard transforms Juliet into a cosmic event: she is the sun rising in the east, brighter than stars, outshining day. The imagery is Petrarchan in its extravagance but new in its direction — Rosaline was cataloged; Juliet is made weather, is made sky. Notice the envious moon: for Romeo, the moon is Diana (chastity, the virgin goddess), and Juliet is the sun who will eclipse her. Urging Juliet to 'arise' and 'kill the envious moon' is urging her to abandon her virginity — the whole speech is erotic argument disguised as cosmology. This is Romeo's first speech in the new voice: the Rosaline-Petrarchism of 1.1 has been replaced with a vocabulary that is hotter, more physical, more solar.",
      sources: ["Caroline Spurgeon, Shakespeare's Imagery (1935)", "Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    },
    {
      line_start: 33, line_end: 49,
      citation_display: "Romeo and Juliet 2.2.33–49",
      category: "linguistic",
      title: "'Wherefore art thou Romeo?' — why, not where",
      body: "The single most misread line in all of Shakespeare. Juliet is not asking where Romeo is hiding; he is not yet visible to her, but she isn't calling out to locate him. 'Wherefore' in Shakespeare's English means 'why' (from Old English 'hwær-for,' 'for what cause'). Juliet is asking the cosmos a question: why do you have to be a Montague? Her next lines make the point explicit: 'Deny thy father and refuse thy name.' The whole speech pivots on the arbitrariness of names versus the substance of being — 'What's in a name? that which we call a rose / By any other name would smell as sweet.' This is the play's linguistic-philosophical climax: Juliet proposes that identity is separable from its label, that Romeo is 'himself' though he is not 'a Montague.' The tragedy will prove that the world does not agree.",
      sources: ["Stephen Orgel, The Authentic Shakespeare (2002)", "Frank Kermode, Shakespeare's Language (2000)"]
    },
    {
      line_start: 112, line_end: 127,
      citation_display: "Romeo and Juliet 2.2.112–127",
      category: "thematic",
      title: "Juliet on the contract — the play's most self-aware voice",
      body: "In the middle of the balcony-scene's ecstasy, Juliet stops to name the danger: 'I have no joy of this contract to-night: / It is too rash, too unadvised, too sudden; / Too like the lightning, which doth cease to be / Ere one can say it lightens.' These are astonishing lines for the play's thirteen-year-old heroine to speak — a self-critique of her own love as it happens. The three-adjective compression ('too rash, too unadvised, too sudden') resembles the Friar's later 'these violent delights have violent ends.' Juliet, like the Friar, sees the tragedy's shape; unlike him, she proceeds anyway, but with open eyes. The scene earns its sweetness because it has bought it by acknowledging its cost.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    },
    {
      line_start: 183, line_end: 185,
      citation_display: "Romeo and Juliet 2.2.183–185",
      category: "close_reading",
      title: "'Parting is such sweet sorrow' — the closing oxymoron",
      body: "Juliet's farewell to Romeo condenses the whole play into five words: parting is sweet sorrow. The oxymoron recalls Romeo's Petrarchan cold-fire in 1.1 ('feather of lead, bright smoke, cold fire, sick health') — but there, the paradoxes were stacked for performance. Here, the paradox is earned. Parting is sweet because the prospect of meeting again is sweeter; parting is sorrow because the meeting is uncertain. Juliet has learned to handle the same rhetorical figure Romeo flaunted, but with a difference: her oxymoron describes what she actually feels. This is also the scene's formal lesson — love discovers its own language, different from the clichés it inherits.",
      sources: ["Stephen Booth, Shakespeare's Sonnets (1977)"]
    }
  ];
  T.romeo_and_juliet_act2_scene2 = [
    {
      kind: "close_reading",
      prompt: "In 'O Romeo, Romeo! wherefore art thou Romeo?' — what does 'wherefore' mean?",
      options: [
        "Where are you hiding",
        "WHY are you named Romeo — i.e., why must you be a Montague (NOT 'where are you')",
        "In what manner are you acting",
        "Since when are you Romeo"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 34, anchor_line_end: 34
    },
    {
      kind: "theme",
      prompt: "What philosophical claim does Juliet make in 'What's in a name? that which we call a rose / By any other name would smell as sweet'?",
      options: [
        "Names are deeply tied to identity",
        "A thing's essence is separable from its label — identity is not fixed by the name society assigns",
        "Roses are the only true flowers",
        "Latin names are more reliable than English"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 44, anchor_line_end: 49
    },
    {
      kind: "close_reading",
      prompt: "What controlling image shapes Romeo's opening speech in the orchard?",
      options: [
        "Juliet as a flower",
        "Juliet as the sun rising in the east, outshining the envious moon",
        "Juliet as a ship in a storm",
        "Juliet as a caged bird"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 2, anchor_line_end: 22
    },
    {
      kind: "inference",
      prompt: "Juliet says the contract is 'too rash, too unadvised, too sudden.' What does this tell us about her?",
      options: [
        "She is rejecting Romeo",
        "She is the play's most self-aware voice — she sees the danger of her own love and proceeds with open eyes",
        "She has been coached by Friar Laurence",
        "She is nervous about her father"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 118, anchor_line_end: 122
    },
    {
      kind: "close_reading",
      prompt: "'Parting is such sweet sorrow' is an example of —",
      options: [
        "Metonymy",
        "Oxymoron (two contradictory terms yoked together)",
        "Anaphora",
        "Synecdoche"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 185, anchor_line_end: 185
    },
    {
      kind: "comprehension",
      prompt: "Why does Juliet refuse Romeo's oath 'by the moon'?",
      options: [
        "She thinks Romeo is joking",
        "The moon is inconstant — it waxes and wanes — and would make an unreliable witness",
        "Swearing by the moon is blasphemous",
        "She cannot see the moon from the balcony"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 107, anchor_line_end: 111
    }
  ];

  A.romeo_and_juliet_act2_scene3 = [
    {
      line_start: 17, line_end: 30,
      citation_display: "Romeo and Juliet 2.3.17–30",
      category: "thematic",
      title: "Friar Laurence's moral philosophy — poison and medicine in one root",
      body: "The Friar's opening soliloquy is the play's moral centerpiece. 'Within the infant rind of this weak flower / Poison hath residence and medicine power' — a single plant contains both the remedy and the kill, and only the user's intent makes the difference. 'Virtue itself turns vice, being misapplied, / And vice sometime's by action dignified.' This is Aristotelian ethics compressed into herbalism: the same substance is good or bad according to use. The philosophy matters because the Friar will test it in his own plot: the sleeping-draught he gives Juliet is intended to save her (medicine) but functionally kills both lovers (poison). The Friar is not a holy fool. He is the play's applied moral philosopher, and his plan fails because the material world (plague quarantine, missed letters, timing) does not cooperate with even the best intentions. His actions have real consequences — Shakespeare's moral universe does not excuse motive when outcome is catastrophe.",
      sources: ["Douglas Peterson, Time, Tide, and Tempest (1973)", "Paul A. Cantor, Shakespeare's Rome (1976)"]
    },
    {
      line_start: 94, line_end: 96,
      citation_display: "Romeo and Juliet 2.3.94–96",
      category: "thematic",
      title: "'Wisely and slow; they stumble that run fast'",
      body: "The Friar's advice to Romeo — 'Wisely and slow; they stumble that run fast' — would if heeded stop the tragedy. It will be ignored almost immediately. This warning joins a chorus of advisory lines the play gives its lovers and audience ('these violent delights have violent ends,' 'too rash, too unadvised, too sudden'). The tragedy is not caused by the absence of wisdom; it is caused by speed overrunning it. Shakespeare repeatedly shows characters who know exactly what they should do and cannot bring themselves to do it — which is a much harder and more interesting shape of tragedy than mere ignorance.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)"]
    }
  ];
  T.romeo_and_juliet_act2_scene3 = [
    {
      kind: "theme",
      prompt: "What moral claim does the Friar's herb-philosophy make?",
      options: [
        "Plants are inherently good",
        "A single plant holds both poison and medicine — use (intent and action) determines virtue",
        "Only the Church's plants are safe",
        "All plants are harmful unless blessed"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 17, anchor_line_end: 30
    },
    {
      kind: "structural",
      prompt: "The Friar's 'Wisely and slow; they stumble that run fast' functions as —",
      options: [
        "Idle proverbial filler",
        "A warning whose ignoring will drive the tragedy — the play gives its characters the advice they fail to take",
        "A line praising Romeo's maturity",
        "A religious blessing"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 94, anchor_line_end: 96
    }
  ];

  A.romeo_and_juliet_act2_scene4 = [
    {
      line_start: 1, line_end: 105,
      citation_display: "Romeo and Juliet 2.4.1–105",
      category: "close_reading",
      title: "Mercutio at full bore — the play's verbal comedy before it ends",
      body: "2.4 is Mercutio's great comic aria — the Italian-fencing parody (Tybalt as 'the Prince of Cats,' the 'passado, the punto reverso, the hai!'), the pun-relay with Romeo, the exasperating Nurse-tease. This is the last scene Shakespeare gives him at full linguistic power. From 3.1 forward, the play will have to do without this voice. Notice that Mercutio's style — accelerated puns, Italianism, classical allusion, sexual innuendo — is precisely the mode the tragedy will have to leave behind to become tragic. His killing is also a killing of the play's comic-verbal register.",
      sources: ["Jonathan Bate, The Soul of the Age (2008)"]
    }
  ];
  T.romeo_and_juliet_act2_scene4 = [
    {
      kind: "comprehension",
      prompt: "What is Mercutio's running joke about Tybalt in this scene?",
      options: [
        "That Tybalt is unusually short",
        "That Tybalt is 'the Prince of Cats' — Tybert, the cat of medieval Reynard fables — and fights by the Italian fencing-manual",
        "That Tybalt is a coward",
        "That Tybalt is in love with Rosaline"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 17, anchor_line_end: 24
    },
    {
      kind: "theme",
      prompt: "Why is Mercutio's comic voice structurally important to Romeo and Juliet?",
      options: [
        "Shakespeare needed more male roles",
        "Mercutio's language represents the comic-verbal mode the tragedy will have to abandon once he dies in 3.1",
        "It reduces the play's length",
        "It has no structural function"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 105
    }
  ];

  A.romeo_and_juliet_act2_scene6 = [
    {
      line_start: 9, line_end: 15,
      citation_display: "Romeo and Juliet 2.6.9–15",
      category: "thematic",
      title: "'These violent delights have violent ends'",
      body: "At the moment of the wedding — when the Friar is about to perform the sacrament that will, in his plan, end the feud — he speaks this warning. The metaphor is combustive: 'Like fire and powder, / Which, as they kiss, consume.' To call the lovers' union 'fire and powder' is to name the tragedy's engine. The line echoes the Prologue's 'fatal loins' and 'death-mark'd love' and will be fulfilled in 5.3. That the Friar speaks it, knowing what he knows, and proceeds anyway, locates the ethical weight of the Friar's role: he is not naive about the danger, which makes his active help in the secret marriage morally weightier, not less.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Paul A. Cantor, Shakespeare's Rome (1976)"]
    }
  ];
  T.romeo_and_juliet_act2_scene6 = [
    {
      kind: "close_reading",
      prompt: "What image does the Friar use for the lovers' union?",
      options: [
        "A rose in winter",
        "Fire and gunpowder — immediate detonation on contact",
        "A river meeting the sea",
        "A sunrise"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 9, anchor_line_end: 11
    },
    {
      kind: "inference",
      prompt: "The Friar sees the danger yet proceeds. What does that show us about his moral position?",
      options: [
        "He is a hypocrite",
        "He is knowingly complicit in a risky plan — which gives his later actions real ethical weight, not the excuse of innocence",
        "He does not believe his own warning",
        "He is only trying to stall"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 9, anchor_line_end: 15
    }
  ];

  A.romeo_and_juliet_act2_scene5 = [
    {
      line_start: 1, line_end: 15,
      citation_display: "Romeo and Juliet 2.5.1–15",
      category: "close_reading",
      title: "Juliet's impatience — comic timing as character",
      body: "Juliet's twelve-line soliloquy waiting for the Nurse is one of Shakespeare's loveliest exercises in comic timing through verse. She counts the hours, imagines the Nurse moving 'Unwieldy, slow, heavy, and pale as lead,' invokes the nimble doves of Venus. The scene is funny because the tempo of her language ('perchance she cannot meet him; that's not so') outruns her own reasoning. Yet the comedy is foreboding: Juliet's speed is exactly what the Friar has just warned against, and her wish ('Love's heralds should be thoughts, / Which ten times faster glide than the sun's beams') is the dramatic pressure that makes events outrun wisdom.",
      sources: ["Russ McDonald, Shakespeare and the Arts of Language (2001)"]
    }
  ];
  T.romeo_and_juliet_act2_scene5 = [
    {
      kind: "comprehension",
      prompt: "Why is Juliet so impatient in this scene?",
      options: [
        "She is hungry",
        "The Nurse is late returning with news from Romeo about the wedding plan",
        "She is angry with her father",
        "She fears for Tybalt"
      ],
      answer_index: 1, wisdom_reward: 10,
      anchor_line_start: 1, anchor_line_end: 15
    }
  ];
};
