/**
 * Prologue + Act II Chorus — annotations and Trials.
 * Both are sonnets; the prologue is the play's most formally loaded 14 lines.
 */

module.exports = function (A: any, T: any, cite: (a: number | null, s: number | null, ls: number, le: number, label?: string) => string) {

  A.romeo_and_juliet_prologue = [
    {
      line_start: 1, line_end: 14,
      citation_display: "Romeo and Juliet Prologue.1–14",
      category: "structural",
      title: "The prologue is a sonnet",
      body: "The opening fourteen lines form a complete English sonnet — three quatrains (ABAB CDCD EFEF) and a final rhyming couplet (GG). That Shakespeare opens his great love-tragedy with a sonnet is not decoration: the sonnet is the Renaissance form for unrequited and idealized love, inherited from Petrarch and domesticated by the English sonneteers. By putting this form in the mouth of a CHORUS describing civil violence and death, Shakespeare announces that the love to come will be inseparable from the feud, that its vocabulary will be the sonnet's, and that even its ending is already written. The play will produce two more sonnets — the Act II chorus and, most remarkably, the shared sonnet between Romeo and Juliet at their first meeting in 1.5. A reader who hears the formal echo finds that the whole play is structured around a sequence of sonnets.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)", "Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)"]
    },
    {
      line_start: 6, line_end: 9,
      citation_display: "Romeo and Juliet Prologue.6–9",
      category: "thematic",
      title: "Spoiler by design — 'star-cross'd lovers take their life'",
      body: "Shakespeare makes the astonishing choice of disclosing his ending in the prologue: the lovers die, and their deaths end the feud. This is not a failure of suspense but a deliberate inversion. Classical tragedy presumed audience knowledge of its myths; Shakespeare manufactures that knowledge for Verona. Once the end is known, the play's urgency shifts from 'what happens' to 'how it happens' — from plot to pathos, from outcome to the thickening web of accident, haste, and structural bad luck that binds the lovers to their grave. The word 'star-cross'd' inscribes Elizabethan astrology into that doom: the stars at birth were thought to govern destiny, and the couple's horoscopes have collided. This is a pre-scientific worldview, but the play does not wholly endorse it; Romeo in 5.1 will defy it ('Then I defy you, stars!'), and his suicide becomes a paradoxical act of will against the fate the prologue announced.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Jonathan Bate, Shakespeare and Ovid (1993)"]
    }
  ];

  T.romeo_and_juliet_prologue = [
    {
      kind: "close_reading",
      prompt: "What verse form is the Prologue?",
      options: [
        "A Petrarchan sonnet (octave-sestet)",
        "An English (Shakespearean) sonnet — three quatrains and a couplet",
        "Blank verse (unrhymed iambic pentameter)",
        "A terza-rima canto adapted from Dante"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 1, anchor_line_end: 14
    },
    {
      kind: "comprehension",
      prompt: "What does 'star-cross'd' mean in the phrase 'A pair of star-cross'd lovers'?",
      options: [
        "They live in different regions of Italy",
        "Their love crosses social boundaries",
        "They are fated by the stars (i.e., by astrology) to misfortune",
        "They are born under the same zodiac sign"
      ],
      answer_index: 2, wisdom_reward: 10,
      anchor_line_start: 6, anchor_line_end: 6
    },
    {
      kind: "theme",
      prompt: "Why does Shakespeare reveal the ending of the play in the prologue?",
      options: [
        "He assumed audiences wouldn't stay for the full performance",
        "It shifts the audience's attention from plot outcome to how events unfold — from 'what' to 'how'",
        "He wanted to warn parents about the tragic content",
        "It was required by Elizabethan censors"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 6, anchor_line_end: 9
    },
    {
      kind: "close_reading",
      prompt: "What does the word 'mutiny' mean in 'From ancient grudge break to new mutiny'?",
      options: [
        "A naval rebellion against a captain",
        "Civil strife and public disorder (not military rebellion)",
        "A workers' strike",
        "A family dispute over inheritance"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 3, anchor_line_end: 3
    },
    {
      kind: "inference",
      prompt: "The line 'Do with their death bury their parents' strife' suggests that —",
      options: [
        "The parents will die shortly after their children",
        "Only the lovers' deaths can end the feud — no lesser cost will suffice",
        "The children were the actual cause of the feud",
        "The parents are already dying"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 8, anchor_line_end: 8
    }
  ];

  // ── Act II Chorus ────────────────────────────────────────────────────
  A.romeo_and_juliet_act2_chorus = [
    {
      line_start: 1, line_end: 14,
      citation_display: "Romeo and Juliet Act II Chorus.1–14",
      category: "structural",
      title: "A second sonnet — the play's triptych",
      body: "The Act II chorus is Shakespeare's second sonnet in the play, again spoken by CHORUS and again using the English form. Its function is narrative bridging — Rosaline is eclipsed by Juliet, Romeo's affection is reciprocated, and the obstacles are reframed. But the formal choice is not decorative: between the opening prologue-sonnet and the shared sonnet of 1.5, the Chorus's second intervention completes a triptych of sonnets punctuating the play's first half. After this, the sonnets stop — the poem gives way to the calamity. Some editors (including the 1623 Folio) omit this chorus, suggesting it may have been optional in early performances. The Quarto history makes it an editorial crux; modern editions generally retain it.",
      sources: ["Jill L. Levenson, The Oxford Shakespeare: Romeo and Juliet (2000)", "G. Blakemore Evans, The New Cambridge Shakespeare: Romeo and Juliet (1984)"]
    }
  ];

  T.romeo_and_juliet_act2_chorus = [
    {
      kind: "structural",
      prompt: "What formal feature does the Act II chorus share with the Prologue?",
      options: [
        "Both are in prose",
        "Both are fourteen-line sonnets spoken by CHORUS",
        "Both quote directly from Ovid",
        "Both are shouted offstage"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 14
    },
    {
      kind: "comprehension",
      prompt: "Whose 'old desire' lies 'in his death-bed' according to the Chorus?",
      options: [
        "Tybalt's desire for revenge",
        "Romeo's previous love for Rosaline",
        "The Friar's hope for peace",
        "Mercutio's love of wit"
      ],
      answer_index: 1, wisdom_reward: 10,
      anchor_line_start: 1, anchor_line_end: 3
    },
    {
      kind: "theme",
      prompt: "What does the chorus establish as distinctive about the new love (with Juliet) vs. the old one (with Rosaline)?",
      options: [
        "The new one is with a wealthier woman",
        "This time Romeo 'loves again' — the love is mutual, not unrequited",
        "It is now sanctioned by both families",
        "It is a platonic rather than romantic attachment"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 5, anchor_line_end: 6
    }
  ];
};
