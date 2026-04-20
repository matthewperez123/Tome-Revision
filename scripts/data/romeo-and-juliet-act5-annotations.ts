/**
 * Act V — annotations. 5.3 (the tomb) is the play's catastrophe (Tier 1).
 */

module.exports = function (A: any, T: any, _cite: any) {

  A.romeo_and_juliet_act5_scene1 = [
    {
      line_start: 1, line_end: 29,
      citation_display: "Romeo and Juliet 5.1.1–29",
      category: "structural",
      title: "Romeo's dream — and 'Then I defy you, stars!'",
      body: "Romeo opens 5.1 in a state of inexplicable joy: 'My bosom's lord sits lightly in his throne.' He dreams Juliet found him dead and her kisses brought him back to life. This is one of the play's most exquisite moments of dramatic irony — the dream exactly inverts what is about to happen: he will find her 'dead' in the tomb; his kisses will not revive her; his suicide will be consummated by her dagger. Balthasar enters with the news of Juliet's death. Romeo's response — 'Is it e'en so? then I defy you, stars!' — is the most heroic gesture in the play. After a play in which he has been 'fortune's fool' (3.1) and 'star-cross'd' (prologue), Romeo asserts will against fate. The defiance is tragic because its means is suicide — he wills his own death in order to join Juliet. In rebelling against the stars, he fulfills them.",
      sources: ["Douglas Peterson, Time, Tide, and Tempest (1973)", "Marjorie Garber, Shakespeare After All (2004)"]
    },
    {
      line_start: 37, line_end: 83,
      citation_display: "Romeo and Juliet 5.1.37–83",
      category: "close_reading",
      title: "The apothecary — poverty as moral leverage",
      body: "Romeo finds the Mantuan apothecary in the extreme of poverty — 'tatter'd weeds, with overwhelming brows,' 'beggarly account of empty boxes.' Romeo buys illegal poison not with argument but with pressure: 'My poverty, but not my will, consents,' the apothecary says. Shakespeare lingers on this transaction for twenty-four lines — not a detour, but a scene in miniature about what poverty can be made to do. The apothecary accepts forty ducats and the moral weight of the sale because he has no other option. Romeo's line 'I pay thy poverty, and not thy will' is brutal recognition of the transaction's ethics. This is Shakespeare's most compact anatomy of how catastrophe recruits the poor as its instruments — a theme he develops in Timon of Athens and Lear. The apothecary disappears from the play after this scene, but the transaction has a long shadow.",
      sources: ["Stephen Greenblatt, Will in the World (2004)"]
    }
  ];
  T.romeo_and_juliet_act5_scene1 = [
    {
      kind: "close_reading",
      prompt: "What dream does Romeo report in the opening speech of 5.1?",
      options: [
        "A dream of the feud ending",
        "A dream that Juliet found him dead, and that her kisses revived him — an ironic inversion of the actual outcome",
        "A dream of his mother's death",
        "A nightmare of Tybalt's ghost"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 11
    },
    {
      kind: "structural",
      prompt: "What is the significance of Romeo's cry 'Then I defy you, stars!'?",
      options: [
        "He has lost his faith in astrology forever",
        "After being 'fortune's fool' and 'star-cross'd,' he asserts will against fate — a heroic gesture, though its means (suicide) will ironically fulfill the stars' sentence",
        "He is accusing Balthasar of lying",
        "He is merely exclaiming in surprise"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 28, anchor_line_end: 29
    },
    {
      kind: "theme",
      prompt: "What moral point does the apothecary scene make?",
      options: [
        "Pharmacies should be better regulated",
        "Poverty can be recruited as an instrument of catastrophe — 'My poverty, but not my will, consents'",
        "Romeo is good at negotiation",
        "Apothecaries are generally untrustworthy"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 67, anchor_line_end: 76
    }
  ];

  A.romeo_and_juliet_act5_scene2 = [
    {
      line_start: 5, line_end: 17,
      citation_display: "Romeo and Juliet 5.2.5–17",
      category: "structural",
      title: "Plague quarantine — the missed letter",
      body: "Friar John returns with the undelivered letter. The explanation is appallingly specific: he went to find a fellow Franciscan to accompany him (the Franciscan rule required pairs for travel); the pair entered a house under plague quarantine; they were detained by the searchers of the town as suspected contagion. The letter never reached Mantua. Shakespeare makes the obstacle precise and material. The tragedy is not the work of a malicious fate but of epidemiological bad luck: plague in Verona in the summer of the play (the real Verona endured plagues repeatedly in the sixteenth century, including outbreaks in 1575 and 1596, the latter just a year or two before the play's composition). The missed letter is the technical hinge that makes the final tragedy inevitable.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)", "Jonathan Gil Harris, Sick Economies (2004)"]
    }
  ];
  T.romeo_and_juliet_act5_scene2 = [
    {
      kind: "comprehension",
      prompt: "Why did the Friar's letter not reach Romeo in Mantua?",
      options: [
        "Friar John refused to deliver it",
        "Friar John was detained by plague quarantine — the letter never reached Mantua",
        "Romeo had already left Mantua",
        "Balthasar intercepted it"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 5, anchor_line_end: 17
    }
  ];

  A.romeo_and_juliet_act5_scene3 = [
    {
      line_start: 1, line_end: 136,
      citation_display: "Romeo and Juliet 5.3.1–136",
      category: "structural",
      title: "The pileup — why Paris, why the Friar's late arrival",
      body: "The tomb scene is a compression — three bodies in forty minutes of stage time. Paris dies first, killed by Romeo who does not recognize him. Romeo dies second, from the apothecary's poison. Juliet dies third, by her husband's dagger, after the Friar arrives moments too late. The critical question is: why does Shakespeare bring Paris back to the tomb? The sources don't require it (in Arthur Brooke's poem, Paris does not visit the grave). Shakespeare's addition lets the scene enact the play's pattern of good intentions producing catastrophic outcomes: Paris comes to mourn; Romeo thinks him an enemy; a corpse is added to the tomb unnecessarily. The Friar's late arrival is a structural device — his explanatory speech to the Watch in lines 229 onward gives the Prince (and audience) the full chronology, confirming that the tragedy is complete and unreversable. The sources require this delivery of truth after the deaths; Shakespeare gives it to the character morally most implicated.",
      sources: ["Arthur Brooke, The Tragicall Historye of Romeus and Juliet (1562)", "Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 97, line_end: 136,
      citation_display: "Romeo and Juliet 5.3.97–136",
      category: "close_reading",
      title: "Romeo's last speech — 'Thus with a kiss I die'",
      body: "Romeo's forty-line speech over Juliet's 'corpse' is the play's most formally wrought dying aria. He catalogues her unchanged beauty ('beauty's ensign yet / Is crimson in thy lips and in thy cheeks'), and the hint of crimson is what the audience knows means life — but Romeo reads it as the persistence of death's beauty. He apologizes to Tybalt, now a body sharing the vault. He invokes 'unsubstantial Death' as Juliet's 'paramour' — the traditional figure of Death the Lover, classical and medieval at once. Then 'Here's to my love! O true apothecary! / Thy drugs are quick. Thus with a kiss I die.' The kiss is the same kiss that began their sonnet in 1.5 — pilgrim's absolution now become suicide. The sonnet-world that opened the play is sealed here.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)", "Stephen Booth, Shakespeare's Sonnets (1977)"]
    },
    {
      line_start: 160, line_end: 211,
      citation_display: "Romeo and Juliet 5.3.160–211",
      category: "close_reading",
      title: "Juliet's wake and suicide — 'happy dagger'",
      body: "Juliet wakes to find the Friar bending over her, Romeo's body beside her, the poison vial empty: 'O churl! drunk all, and left no friendly drop / To help me after!' The accusation is playful-tender — the half-joke of a spouse robbed of her share. She then kisses Romeo: 'I will kiss thy lips; / Haply some poison yet doth hang on them.' When the poison fails her, she takes his dagger: 'O happy dagger! / This is thy sheath: there rust, and let me die.' The dagger's sheath is her body — an image that fuses the sexual and the funerary, the wedding bed and the grave. Juliet's death is the fourth and most absolute of the play's four major deaths (Mercutio, Tybalt, Paris, Romeo), and its visual vocabulary is Shakespeare's most compressed image of love and death as inseparable.",
      sources: ["Coppélia Kahn, Man's Estate (1981)", "Carol Rutter, Enter the Body (2001)"]
    },
    {
      line_start: 300, line_end: 316,
      citation_display: "Romeo and Juliet 5.3.300–316",
      category: "structural",
      title: "The Prince's closing couplets — rhyme as closure",
      body: "The Prince closes the play in rhyming couplets rather than blank verse. 'A glooming peace this morning with it brings; / The sun, for sorrow, will not show his head: / Go hence, to have more talk of these sad things; / Some shall be pardon'd, and some punished: / For never was a story of more woe / Than this of Juliet and her Romeo.' The choice of couplets is deliberate — couplet closure is the sonnet's own technique, and the play that opened with a sonnet now ends with couplets that formally echo a sonnet's sestet. The famous final line ('For never was a story of more woe...') turns the proper names into the rhyme-word, making the tragedy eponymous by the closing syllable. The form itself performs the final act of commemoration: the lovers' story is inscribed, through rhyme, into collective memory.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)", "Frank Kermode, Shakespeare's Language (2000)"]
    }
  ];
  T.romeo_and_juliet_act5_scene3 = [
    {
      kind: "structural",
      prompt: "Why is Paris's death in the tomb a notable choice by Shakespeare?",
      options: [
        "It's a historical record of Paris's real death",
        "Shakespeare added Paris's tomb-visit to his source — letting the scene embody the play's pattern of good intentions (Paris's mourning) producing catastrophe (Romeo kills him without recognizing him)",
        "It was required by Elizabethan stage conventions",
        "The actor had no other scenes"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 54, anchor_line_end: 87
    },
    {
      kind: "close_reading",
      prompt: "What does Romeo note about Juliet's appearance in the tomb — which the audience understands as dramatic irony?",
      options: [
        "That she is obviously alive",
        "That 'beauty's ensign' is still 'crimson in thy lips' — the audience knows this crimson is life, while Romeo reads it as beauty persisting in death",
        "That she looks unlike herself",
        "Her clothes are dishevelled"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 111, anchor_line_end: 116
    },
    {
      kind: "theme",
      prompt: "Juliet calls Romeo 'O churl! drunk all, and left no friendly drop'. The tone is —",
      options: [
        "Straight fury",
        "Half-playful, half-desolate — the tenderness of a spouse cheated of her share, inflected by despair",
        "Mockery",
        "Indifference"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 163, anchor_line_end: 166
    },
    {
      kind: "close_reading",
      prompt: "Juliet's 'O happy dagger! / This is thy sheath: there rust, and let me die' compresses —",
      options: [
        "A wartime allusion",
        "A sexual-funerary image — body as sheath, dagger's entry fusing wedding-bed and grave into one image",
        "A religious oath",
        "A joke about ironmongery"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 205, anchor_line_end: 207
    },
    {
      kind: "structural",
      prompt: "Why does the Prince end the play in rhymed couplets rather than blank verse?",
      options: [
        "Shakespeare ran out of blank verse material",
        "Couplets formally echo the sonnet form that opened the play, commemorating the story by enclosing it in rhyme — 'more woe / Romeo' is the play's epitaph by rhyme-syllable",
        "Elizabethan law required couplets at the end of plays",
        "It is an editorial addition"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 300, anchor_line_end: 316
    },
    {
      kind: "theme",
      prompt: "The Prince says 'Some shall be pardon'd, and some punished.' This acknowledges —",
      options: [
        "That the feud is now over without consequence",
        "That justice remains imperfect — not all wrongs can be remedied, and the living must still be sorted out; but the cost is the children",
        "That he intends to execute the Friar",
        "That the Nurse will be jailed"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 307, anchor_line_end: 312
    }
  ];
};
