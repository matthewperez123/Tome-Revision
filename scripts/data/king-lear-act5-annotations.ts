/**
 * King Lear — Act V annotations + Trials. 5.3 (Tier 1) must carry the
 * Howl×4 annotation, the Nahum Tate happy-ending note, and the final
 * couplet's Edgar/Albany attribution crux.
 */

module.exports = function (A: any, T: any) {

  A.king_lear_act5_scene1 = [
    {
      line_start: 55, line_end: 78,
      citation_display: "King Lear 5.1.55–78",
      category: "structural",
      title: "Edmund's soliloquy — 'Both? one? or neither?'",
      body: "Edmund's 5.1 soliloquy is the play's coldest calculation: 'To both these sisters have I sworn my love; / Each jealous of the other... Which of them shall I take? / Both? one? or neither?' He concludes he will 'carry on my side' regardless of outcome — let the sisters kill each other and see who's left. This is sociopathic calculation as dramatic soliloquy. What makes the speech theatrically alive is Edmund's evident enjoyment; he is not tormented, he is amused. Shakespeare gives his villain a Machiavellian pleasure that neither the sisters nor Cornwall possess — they rage, he calculates. That calculative pleasure is also what undoes him: his very coolness leaves him open to being moved at the end ('some good I mean to do, / Despite of mine own nature'), a moment of late conscience that would have been unavailable to a villain of pure rage.",
      sources: ["Jonathan Dollimore, Radical Tragedy (1984)"]
    }
  ];
  T.king_lear_act5_scene1 = [
    {
      kind: "close_reading",
      prompt: "What tone does Edmund's 'Both? one? or neither?' soliloquy strike?",
      options: [
        "Anguished indecision",
        "Cold calculation with evident enjoyment — Edmund's Machiavellian pleasure is what distinguishes him from the raging sisters and Cornwall",
        "Regret",
        "Boredom"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 55, anchor_line_end: 78
    }
  ];

  A.king_lear_act5_scene2 = [
    {
      line_start: 6, line_end: 11,
      citation_display: "King Lear 5.2.6–11",
      category: "thematic",
      title: "'Ripeness is all' — Edgar's Stoic minimum",
      body: "Edgar's line to the despairing Gloucester — 'Men must endure / Their going hence, even as their coming hither; / Ripeness is all' — is the play's most compressed Stoic formula. 'Ripeness' = readiness to die, analogous to Hamlet's 'the readiness is all' (Hamlet 5.2). The line is often quoted as a nugget of wisdom, but in context it is said to a blind man who has just tried to kill himself — it is a painful sufficiency, not a comfortable maxim. Shakespeare gives Edgar the responsibility of speaking the play's only durable consolation, and that consolation is not hope but maturity-to-die. The play's theology finally offers no heaven; it offers ripening. Readers expecting a more affirmative wisdom should notice how much the play withholds in exchange for this single phrase.",
      sources: ["William R. Elton, King Lear and the Gods (1966)", "A. C. Bradley, Shakespearean Tragedy (1904)"]
    }
  ];
  T.king_lear_act5_scene2 = [
    {
      kind: "theme",
      prompt: "What does Edgar's 'Ripeness is all' claim?",
      options: [
        "That life will reward the patient",
        "A Stoic minimum — readiness to die is everything; the play offers no heaven, only maturity-to-die",
        "That Gloucester will recover",
        "That Cordelia is safe"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 6, anchor_line_end: 11
    }
  ];

  // ── 5.3 — Tier 1 — the play's catastrophe ───────────────────────────
  A.king_lear_act5_scene3 = [
    {
      line_start: 9, line_end: 28,
      citation_display: "King Lear 5.3.9–28",
      category: "close_reading",
      title: "'We two alone will sing like birds i' the cage' — Lear's fantasy of enclosed love",
      body: "Captured by Edmund's forces with Cordelia, Lear imagines prison as idyll: 'We two alone will sing like birds i' the cage.' This is the scene's most tender moment before its destruction. Lear imagines an endless father-daughter companionship — kneeling for blessings, praying, telling stories, laughing at court gossip 'as if we were God's spies.' The speech compresses everything he lost at 1.1 and found at 4.7. It is also willfully unreal; he is imagining a prison that will never exist because he cannot protect Cordelia from Edmund's order. Shakespeare lets the speech run to thirty lines of dreamy beauty so the audience can inhabit it before he breaks it. When Edmund immediately orders Cordelia's execution fifteen lines later, the speech is retroactively a eulogy.",
      sources: ["Stanley Cavell, 'The Avoidance of Love' in Disowning Knowledge (1987)", "Jonathan Bate, Soul of the Age (2008)"]
    },
    {
      line_start: 257, line_end: 280,
      citation_display: "King Lear 5.3.257–280",
      category: "close_reading",
      title: "'Howl, howl, howl, howl!' — four repetitions of one word",
      body: "Lear enters with Cordelia's body and says 'Howl, howl, howl, howl! O, you are men of stones.' Four repetitions of a single word — commonly identified as the most devastating line in Shakespeare. The word 'howl' is pre-linguistic grief: not an idea but an utterance. Its fourfold repetition refuses to resolve into meaning; it is the sound of a human being at the end of his capacity for words. Later in the speech Lear will say 'Never, never, never, never, never' — five repetitions of 'never' mirror the four 'Howl's, the pair bracketing his collapse. 'Why should a dog, a horse, a rat, have life, / And thou no breath at all?' — this is the play's most bitter theodicy, delivered as arithmetic: three living animals, one dead Cordelia. And the sequence ends not with a cry but with 'Pray you, undo this button' — a domestic, small request that concentrates grief into a smaller event than the 'Howl' could carry. Shakespeare's most famous closing sequence is built on this asymmetry: the howl that cannot be spoken and the button that can.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Frank Kermode, Shakespeare's Language (2000)", "A. C. Bradley, Shakespearean Tragedy (1904)"]
    },
    {
      line_start: 257, line_end: 315,
      citation_display: "King Lear 5.3.257–315",
      category: "historical",
      title: "Nahum Tate's happy ending — 150 years of Lear without death",
      body: "In 1681 Nahum Tate published 'The History of King Lear,' an adaptation in which Cordelia does not die, she marries Edgar, Lear and Gloucester both survive, and the play ends happily. Tate's Lear became the ONLY version performed on the English stage for 150 years. Samuel Johnson, in his 1765 edition of Shakespeare, defended Tate's version — he wrote that he was so shocked by Cordelia's death that he could not re-read the final scenes until he had to edit them. Charles Lamb in his 1811 essay 'On the Tragedies of Shakespeare' attacked Tate's version as destroying the play's moral argument. It was Edmund Kean's 1823 production that finally restored Shakespeare's tragic ending to the London stage, and only in 1838 (Macready's production) was Tate's version fully retired. The fact that the English theatrical tradition could not bear Shakespeare's ending for 150 years is itself part of the play's meaning. Cordelia's death is designed to be unbearable, and the tradition confirmed it by refusing to bear it. Virgil's verdict: if you feel the wrongness of Cordelia's death, you are having the correct response, and the whole critical tradition is with you.",
      sources: ["Nahum Tate, The History of King Lear (1681)", "Samuel Johnson, Preface to Shakespeare (1765)", "Charles Lamb, 'On the Tragedies of Shakespeare' (1811)", "Michael Dobson, The Making of the National Poet (1992)"]
    },
    {
      line_start: 305, line_end: 320,
      citation_display: "King Lear 5.3.305–320",
      category: "textual",
      title: "The final couplet — Edgar or Albany?",
      body: "'The weight of this sad time we must obey; / Speak what we feel, not what we ought to say. / The oldest hath borne most: we that are young / Shall never see so much, nor live so long.' In the 1623 Folio (F1), these final lines are spoken by EDGAR; in the 1608 Quarto (Q1), they are spoken by ALBANY. This is one of the most consequential speaker-attribution differences in the Shakespeare canon — not because of any particular textual detail, but because who speaks the play's closing lines determines what the play closes as. If Edgar speaks them, the young survivor is taking authority — a new king stepping forward. If Albany speaks them, the middle-aged survivor is stepping aside, giving the final word to youth even while disclaiming office. Most modern editors give the lines to Edgar (following F1), but the assignment is not settled. The brief's flag of this crux is well-placed: readers should know the play ends with textual uncertainty about its own successor.",
      sources: ["Gary Taylor and Michael Warren (eds.), The Division of the Kingdoms (1983)", "R. A. Foakes, King Lear (Arden 3, 1997)", "Stanley Wells and Gary Taylor, William Shakespeare: A Textual Companion (1987)"]
    },
    {
      line_start: 279, line_end: 285,
      citation_display: "King Lear 5.3.279–285",
      category: "close_reading",
      title: "'Never, never, never, never, never' — pentameter collapse",
      body: "Lear's fivefold 'never' is a perfect iambic pentameter line ('ne-ver, ne-ver, ne-ver, ne-ver, ne-ver' = five trochees, or five stressed monosyllables depending on reading), made of nothing but one word. Shakespeare takes the formal unit of his verse — the iambic pentameter line — and fills it with a single syllable of negation. This is meter at its most self-abolishing: the line stays a line, but its content has collapsed into the smallest unit. Critics sometimes call this Shakespeare's most concentrated moment of form expressing content. The verse is doing the work Lear's language can no longer do — holding the shape of speech around a void of meaning. This is the companion line to the four 'Howl's: negation and grief as counterweights to the rest of the play's verbal richness.",
      sources: ["George T. Wright, Shakespeare's Metrical Art (1988)", "Frank Kermode, Shakespeare's Language (2000)"]
    }
  ];
  T.king_lear_act5_scene3 = [
    {
      kind: "close_reading",
      prompt: "Why is 'Howl, howl, howl, howl!' considered the most devastating line in Shakespeare?",
      options: [
        "It is the longest line in the play",
        "Four repetitions of a single pre-linguistic word of grief — a human being at the end of his capacity for meaning; refusing to resolve into sense",
        "It contains rare vocabulary",
        "It is a Biblical quotation"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 257, anchor_line_end: 260
    },
    {
      kind: "historical",
      prompt: "What was Nahum Tate's 1681 adaptation of King Lear, and why does it matter?",
      options: [
        "A minor curio without influence",
        "A happy-ending rewrite (Cordelia lives, marries Edgar) that became the ONLY Lear performed in English theaters for 150 years, until 1838 — showing the tradition could not bear Shakespeare's ending, which is itself part of the play's meaning",
        "A Latin translation",
        "An illustrated edition"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 257, anchor_line_end: 315
    },
    {
      kind: "structural",
      prompt: "The final couplet of King Lear ('The weight of this sad time...') is spoken by whom?",
      options: [
        "Always by Albany in all editions",
        "Edgar in the 1623 Folio, Albany in the 1608 Quarto — a textual crux whose resolution changes what the play closes as (a new king stepping forward, or a survivor stepping aside)",
        "The Fool",
        "Kent"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 305, anchor_line_end: 320
    },
    {
      kind: "close_reading",
      prompt: "What is formally remarkable about 'Never, never, never, never, never'?",
      options: [
        "It is in Latin",
        "A perfect iambic-pentameter-length line built from a single word of negation — Shakespeare's form holding the shape of speech around a void of meaning",
        "It is a question",
        "It rhymes with the next line"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 279, anchor_line_end: 285
    },
    {
      kind: "theme",
      prompt: "Lear's 'Why should a dog, a horse, a rat, have life, / And thou no breath at all?' is —",
      options: [
        "A call for animal rights",
        "The play's bitterest theodicy — arithmetic of injustice: three living animals vs. one dead Cordelia; the gods' accounting fails",
        "An oath",
        "A riddle"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 275, anchor_line_end: 277
    },
    {
      kind: "inference",
      prompt: "What is the significance of Lear's final request 'Pray you, undo this button'?",
      options: [
        "Nothing — it is merely practical",
        "The smallness of the gesture — domestic, bodily, almost embarrassed — concentrates grief into an event smaller than 'Howl' can carry; Shakespeare's most compressed ending",
        "He is asking for his crown back",
        "He is asking to be hanged"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 281, anchor_line_end: 283
    }
  ];
};
