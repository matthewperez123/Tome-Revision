/**
 * Richard III — Act IV annotations and Trials.
 * Two Tier-1 scenes: 4.3 (Tyrrel's report of the princes' deaths), 4.4
 * (the wailing queens + Richard's second wooing, this time of Elizabeth
 * of York through her mother). 4.1 (Anne dragged to coronation), 4.2
 * (Buckingham's fall), 4.5 (Derby's covert message) are non-Tier-1.
 *
 * This act carries the play's densest Tudor-historiography annotations:
 * the historical openness of the princes' deaths, the 2012 rediscovery
 * of Richard's remains, and the questions scholars still debate.
 */

interface Annotation {
  line_start: number; line_end: number;
  citation_display: string;
  category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading";
  title: string; body: string; sources: string[];
}
interface Trial {
  kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural";
  prompt: string; options: [string,string,string,string];
  answer_index: 0|1|2|3;
  wisdom_reward: number;
  anchor_line_start: number; anchor_line_end: number;
}

module.exports = function (
  ANNOTATIONS: Record<string, Annotation[]>,
  TRIALS: Record<string, Trial[]>,
  cite: (label: string, ls: number, le: number) => string
) {

  // ── 4.1 — Before the Tower. Anne summoned to coronation ───────────────
  ANNOTATIONS.richard_iii_act4_scene1 = [
    {
      line_start: 62, line_end: 83,
      citation_display: cite("4.1", 62, 83),
      category: "thematic",
      title: "Anne's retrospect — the self-curse she has lived",
      body: "Anne's speech — \"When he that is my husband now / Came to me, as I follow'd Henry's corse... / When, I say, I look'd on Richard's face, / This was my wish: 'Be thou,' quoth I, 'accursed'\" — recalls the audience directly to 1.2. Anne tells Elizabeth the curse she laid on Richard's wife-to-be in the wooing scene has fallen on herself: she became that wife. The speech is the play's most searing piece of retrospective self-knowledge, more frank than anything Richard delivers about himself until 5.3. Anne names the mechanism plainly: \"my woman's heart / Grossly grew captive to his honey words\" — she was won, she knows she was won, she has suffered for it, and she now says so aloud to another doomed woman. The scene pairs with 1.2 as before-and-after: the scene of the seduction, and the scene in which the seduced woman testifies to what the seduction cost.",
      sources: ["Janet Adelman, Suffocating Mothers (1992)", "Madonne M. Miner, \"'Neither mother, wife, nor England's queen'\" (1980)"]
    },
    {
      line_start: 93, line_end: 100,
      citation_display: cite("4.1", 93, 100),
      category: "close_reading",
      title: "Elizabeth's apostrophe to the Tower as nursery",
      body: "Elizabeth's closing speech — \"Pity, you ancient stones, those tender babes / Whom envy hath immured within your walls! / Rough cradle for such little pretty ones! / Rude ragged nurse, old sullen playfellow / For tender princes, use my babies well!\" — converts the Tower of London from fortress to child-care metaphor. The Tower becomes simultaneously cradle, nurse, and playfellow — maternal offices grotesquely misapplied to stone walls. The figure is not decoration; it enacts the specific horror of the princes' situation, which is that the institution charged with keeping them is the institution that will kill them. Shakespeare compresses the moral scandal into four lines of apostrophe. The speech is one of the play's emotional peaks before 4.4.",
      sources: ["Caroline Spurgeon, Shakespeare's Imagery (1935)", "Ann Blake, \"Children and Suffering in Shakespeare's Plays\" (1998)"]
    },
    {
      line_start: 49, line_end: 58,
      citation_display: cite("4.1", 49, 58),
      category: "thematic",
      title: "The Duchess of York's accursed womb",
      body: "The Duchess's speech — \"O ill-dispersing wind of misery! / O my accursed womb, the bed of death! / A cockatrice hast thou hatch'd to the world, / Whose unavoided eye is murderous\" — escalates 2.2's maternal self-reproach into full denunciation. The cockatrice is a legendary basilisk-creature, hatched from a cock's egg by a serpent, whose gaze killed. The Duchess has moved from \"he is my son; yea, and therein my shame\" (2.2.29) to naming her own womb the instrument of monster-production. Shakespeare does not ask us to accept the metaphysics of monstrous birth — the play is clear that Richard is a product of historical and political violence, not congenital malice — but the Duchess's language registers a particular kind of grief only a mother can carry. In 4.4 she will curse Richard to his face with the play's most terrible maternal curse. This is the speech in which she begins to claim that right.",
      sources: ["Janet Adelman, Suffocating Mothers (1992)", "Phyllis Rackin, Stages of History (1990)"]
    }
  ];

  TRIALS.richard_iii_act4_scene1 = [
    {
      kind: "close_reading",
      prompt: "Anne's long speech to Elizabeth (62–83) recalls which earlier scene?",
      options: [
        "Clarence's dream in 1.4",
        "The wooing scene in 1.2 — Anne admits that her curse on Richard's wife-to-be has fallen on herself",
        "Margaret's curse in 1.3",
        "Edward IV's reconciliation in 2.1"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 62, anchor_line_end: 83
    },
    {
      kind: "theme",
      prompt: "Elizabeth's apostrophe \"Rough cradle for such little pretty ones! / Rude ragged nurse, old sullen playfellow\" does what?",
      options: [
        "Praises the Tower for its protection of royal children",
        "Converts the Tower into maternal offices grotesquely misapplied, compressing the specific horror of the princes' situation into apostrophe",
        "Mourns the loss of her late husband Edward IV",
        "Requests formal permission to visit her sons"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 95, anchor_line_end: 99
    },
    {
      kind: "close_reading",
      prompt: "The Duchess of York calls her womb \"the bed of death\" and says she has \"hatch'd a cockatrice.\" A cockatrice is:",
      options: [
        "A type of songbird",
        "A legendary basilisk-creature whose gaze was thought to kill — an emblem of monstrous, killing birth",
        "A heraldic insignia of the House of York",
        "A common Elizabethan cooking implement"
      ],
      answer_index: 1,
      wisdom_reward: 15,
      anchor_line_start: 51, anchor_line_end: 52
    }
  ];

  // ── 4.2 — The palace. Richard crowned, Buckingham breaks ──────────────
  ANNOTATIONS.richard_iii_act4_scene2 = [
    {
      line_start: 1, line_end: 24,
      citation_display: cite("4.2", 1, 24),
      category: "textual",
      title: "The \"clock scene\" and the Q1/F1 variance",
      body: "This scene is the most famous textual crux of Richard III: the so-called \"clock scene\" in which Richard and Buckingham quarrel. In the First Folio (1623), the scene is extended by roughly thirty lines, including Richard's musical rebuke \"Because that, like a Jack, thou keep'st the stroke / Betwixt thy begging and my meditation.\" The First Quarto (1597) gives a shorter version. Editors have long debated which reading represents Shakespeare's preferred form — the Quarto's tighter version or the Folio's fuller one. Standard Ebooks' conflated text, following most modern editions, prefers the Folio's extended version. The extra lines add tonal colour (Richard's \"not in the giving vein\" becomes more pointed) and deepen Buckingham's humiliation. Richard III's Q1/F1 variance is not as scholarly-consequential as King Lear's, but this scene is where the two texts diverge most visibly, and the reader should know the text they are reading is one editorial choice among others.",
      sources: ["John Jowett, The Oxford Shakespeare: Richard III (2000)", "Antony Hammond, Arden Shakespeare: Richard III (1981)", "Peter W. M. Blayney, The Texts of King Lear and Their Origins (1982)"]
    },
    {
      line_start: 1, line_end: 43,
      citation_display: cite("4.2", 1, 43),
      category: "structural",
      title: "The throne ascended, the alliance breaks",
      body: "The scene opens with Richard ceremonially taking the throne (\"Here he ascendeth his throne. Thus high, by thy advice / And thy assistance, is King Richard seated\") and immediately begins testing Buckingham. The test is blunt: \"I wish the bastards dead; / And I would have it suddenly perform'd.\" Buckingham's hesitation — \"Give me some breath, some little pause, my lord\" — is the pause that kills him. Richard's cold aside (\"High-reaching Buckingham grows circumspect\") is the regime's first verdict on a principal ally. The scene enacts the pattern the play has been setting up since Buckingham's 2.2 alliance with Richard: those who enable Richard's rise must either continue enabling him or be eliminated. There is no middle state. Buckingham's attempt to defer decision is treated as refusal.",
      sources: ["Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "A. P. Rossiter, Angel with Horns (1961)"]
    },
    {
      line_start: 32, line_end: 62,
      citation_display: cite("4.2", 32, 62),
      category: "close_reading",
      title: "Tyrrel engaged, and Richard's horizon contracts",
      body: "Richard's engagement of Tyrrel through the Page — \"Know'st thou not any whom corrupting gold / Would tempt unto a close exploit of death?\" — marks a specific narrowing of his political world. In Acts I–III he worked through ceremony, legal pretext, and public performance. Here he works through an anonymous functionary paid in \"corrupting gold.\" The move is necessary because Buckingham, who had been the performance's co-producer, has balked. It also marks Richard's first explicit self-knowledge about his condition: \"I am in / So far in blood that sin will pluck on sin.\" The line echoes Macbeth's \"I am in blood / Stepp'd in so far\" (Macbeth 3.4) that Shakespeare will write about a decade later. Richard III is the play in which Shakespeare first articulates what becomes Macbeth's central theme — the logic of sin that generates the next sin.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Robert N. Watson, Shakespeare and the Hazards of Ambition (1984)"]
    },
    {
      line_start: 81, line_end: 119,
      citation_display: cite("4.2", 81, 119),
      category: "thematic",
      title: "\"I am not in the giving vein to-day\"",
      body: "Buckingham's attempt to claim his promised reward (the earldom of Hereford) is one of the play's small, bitter comedies. He returns to the subject repeatedly — \"I claim your gift, my due by promise\"; \"your promise for the earldom\"; \"what says your highness to my just demand?\" — and Richard responds with free-associative asides about Henry VI's prophecy, the Exeter castle called Rougemont, and a bard of Ireland's prediction. Richard is not distracted; he is humiliating Buckingham in public by refusing even the courtesy of a clear refusal. The final line — \"I am not in the giving vein to-day\" — is Richard's signature sentence of post-coronation power: the giving of rewards is now entirely at his pleasure, and he signals that Buckingham's has run out. Buckingham's exit line (\"let me think on Hastings\") is the scene's formal acknowledgement that he has become another Hastings.",
      sources: ["A. P. Rossiter, Angel with Horns (1961)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    }
  ];

  TRIALS.richard_iii_act4_scene2 = [
    {
      kind: "textual",
      prompt: "What is distinctive about the \"clock scene\" (4.2) in the textual history of Richard III?",
      options: [
        "It appears only in the First Quarto, not the First Folio",
        "It is the scene where the First Folio (1623) and First Quarto (1597) texts diverge most visibly, with F1 extending the scene by about thirty lines",
        "It is missing from all early texts and is a nineteenth-century interpolation",
        "It was rewritten by Colley Cibber for the Restoration stage"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 24
    },
    {
      kind: "comprehension",
      prompt: "What does Richard test Buckingham with, immediately after the coronation?",
      options: [
        "The demand to kill Richmond",
        "The demand to kill the princes (\"the bastards dead\") suddenly — and Buckingham's pause is treated as refusal",
        "The demand to disavow his wife and remarry",
        "The demand to renounce his dukedom"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 17, anchor_line_end: 30
    },
    {
      kind: "theme",
      prompt: "Richard's line \"I am in / So far in blood that sin will pluck on sin\" anticipates which later Shakespeare play?",
      options: [
        "Hamlet — Claudius's prayer scene",
        "Macbeth — the logic of sin that generates the next sin (cf. Macbeth 3.4 \"I am in blood / Stepp'd in so far\")",
        "Othello — Iago's final unrepentant silence",
        "King Lear — Edmund's dying confession"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 60, anchor_line_end: 62
    },
    {
      kind: "close_reading",
      prompt: "\"I am not in the giving vein to-day\" is Richard's signature line of post-coronation power. What does it announce?",
      options: [
        "A temporary mood that will change",
        "That the giving of rewards is now entirely at his pleasure — Buckingham's request is refused as humiliation, not as matter of substance",
        "A new tax policy to be enforced at court",
        "A renouncement of all future promises"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 112, anchor_line_end: 112
    },
    {
      kind: "inference",
      prompt: "Buckingham's exit line — \"let me think on Hastings\" — signals what?",
      options: [
        "A conciliatory desire to remember an old friend",
        "Formal acknowledgement that he has become another Hastings — marked for the same fate",
        "A plan to replace Hastings as Lord Chamberlain",
        "A political plot to rehabilitate Hastings' reputation"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 118, anchor_line_end: 119
    }
  ];

  // ── 4.3 — The palace. Tyrrel reports the princes' murder [TIER-1] ─────
  ANNOTATIONS.richard_iii_act4_scene3 = [
    {
      line_start: 1, line_end: 23,
      citation_display: cite("4.3", 1, 23),
      category: "thematic",
      title: "Tyrrel's report — grief kept close to the murder",
      body: "Tyrrel's opening speech is the play's most morally composed description of violence. \"The tyrannous and bloody deed is done, / The most arch of piteous massacre / That ever yet this land was guilty of.\" He names it massacre without qualification. His hirelings, Dighton and Forrest, \"flesh'd villains, bloody dogs,\" wept as they described the boys in each other's \"innocent alabaster arms,\" lips \"four red roses on a stalk\" (red for Lancaster, though these are York children — Shakespeare's symbolic compression), a \"book of prayers on their pillow.\" The detail of the prayer-book comes directly from More's History. What Shakespeare achieves here is a stage-convention almost unique to this play: the murderer who remains a moral witness. Tyrrel reports the deaths with specific grief he cannot himself share, and the scene's authority comes from the fact that even the paid killer cannot disconnect the act from its image.",
      sources: ["Thomas More, History of King Richard III (c. 1513)", "Ann Blake, \"Children and Suffering in Shakespeare's Plays\" (1998)", "Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)"]
    },
    {
      line_start: 1, line_end: 23,
      citation_display: cite("4.3", 1, 23),
      category: "historical",
      title: "The princes in the Tower: a question the play closes and history does not",
      body: "Shakespeare's play names Richard as the author of the princes' deaths and identifies Tyrrel as his commissioned agent. This follows More's History directly, which was the dominant Tudor-era account. The historical question, however, is unsettled and remains so. The princes (Edward V, aged 12, and Richard of York, aged 9) disappeared from Tower records in the summer of 1483. No bodies were definitively identified: the 1674 discovery of a chest with two children's skeletons, now interred in Westminster Abbey, has never been DNA-tested. Alternative theories have argued that Buckingham may have been responsible (he had custody of the Tower during the relevant months), that Henry VII may have ordered the deaths after Bosworth, or that one or both boys survived (the Perkin Warbeck claim of 1491–99 rested on such a story). The Richard III Society (founded 1924) has campaigned for historical reassessment, and the 2012 rediscovery of Richard's remains beneath a Leicester car park reopened the question in public. The play's treatment is not the historical verdict; it is Tudor tradition treated with dramatic seriousness.",
      sources: ["Charles Ross, Richard III (1981)", "Michael Hicks, Richard III (2000)", "David Horspool, Richard III: A Ruler and His Reputation (2015)", "Alison Weir, The Princes in the Tower (1992)", "A. J. Pollard, Richard III and the Princes in the Tower (1991)"]
    },
    {
      line_start: 14, line_end: 19,
      citation_display: cite("4.3", 14, 19),
      category: "close_reading",
      title: "\"A book of prayers on their pillow\"",
      body: "The detail is Tyrrel's hinge — the image that \"almost changed my mind,\" as Dighton reports Forrest saying. The prayer-book is what momentarily broke the killers. It is also what confirms to the audience that what is being killed is specifically a child, in a child's ordinary end-of-day act. Shakespeare uses the device of interrupted testimony — \"But O! the devil' — there the villain stopp'd\" — to let silence do work rhetoric cannot do. The killer cannot finish naming what he could not finish doing. Shakespeare learned the technique from medieval religious drama (moments of rupture before the worst) and refines it here for secular tragedy. The scene gives the audience the fact of the murder without its enactment; what it cannot give us is reconciled to the fact.",
      sources: ["Thomas More, History of King Richard III (c. 1513)", "Huston Diehl, Staging Reform, Reforming the Stage (1997)"]
    },
    {
      line_start: 36, line_end: 43,
      citation_display: cite("4.3", 36, 43),
      category: "thematic",
      title: "Richard's catalogue of the disposed",
      body: "Richard's soliloquy after Tyrrel exits — \"The son of Clarence have I pent up close; / His daughter meanly have I match'd in marriage; / The sons of Edward sleep in Abraham's bosom, / And Anne my wife hath bid the world good night\" — inventories the dynastic clean-up in four lines. Clarence's son Edward Earl of Warwick confined, his daughter Margaret (later Countess of Salisbury) married off to a nobody, Edward's sons dead, Anne dead. Richard has eliminated or neutralized every collateral claim to the throne. The speech's casualness is characteristic: he is reviewing a political balance sheet. \"Abraham's bosom\" is Richard's particular blasphemy — borrowing the New Testament image of heaven (Luke 16:22) for children he commissioned murdered. The line sets up the pivot to the Elizabeth-of-York wooing: with the inventory complete, Richard turns to the next conquest.",
      sources: ["Hannibal Hamlin, The Bible in Shakespeare (2013)", "A. P. Rossiter, Angel with Horns (1961)"]
    },
    {
      line_start: 40, line_end: 43,
      citation_display: cite("4.3", 40, 43),
      category: "historical",
      title: "Richmond and the historical race for Elizabeth of York",
      body: "Richard's recognition that \"the Breton Richmond aims / At young Elizabeth\" is historically precise. In Christmas 1483, exiled in Rennes Cathedral, Henry Tudor had sworn publicly to marry Elizabeth of York if he won the throne; the union would join the Lancastrian and Yorkist claims and neutralize dynastic opposition. Richard's plan to marry his niece himself is the counter-move: if Elizabeth is already married, Richmond's political claim evaporates. Historically Richard did pursue this (rumours during Anne's final illness in early 1485 alarmed the court so severely that Richard was forced to deny the plan publicly at St. John's Clerkenwell). The Shakespeare scene compresses the historical race and gives it to Richard in a single aside, but the political logic is exact. The wooing of the mother-queen in 4.4 is not comic virtuosity; it is a specific political response to an external threat.",
      sources: ["Charles Ross, Richard III (1981)", "Stanley B. Chrimes, Henry VII (1972)", "Polydore Vergil, Anglica Historia (c. 1513)"]
    },
    {
      line_start: 51, line_end: 56,
      citation_display: cite("4.3", 51, 56),
      category: "close_reading",
      title: "Richard's compressed self-exhortation",
      body: "The scene's closing couplets — \"Come, I have heard that fearful commenting / Is leaden servitor to dull delay; / Delay leads impotent and snail-paced beggary: / Then fiery expedition be my wing, / Jove's Mercury, and herald for a king!\" — reveal Richard in his new register: the hurried executive. Where in Acts I–III his method was patience (waiting for reconciliations to collapse, inciting factions to exhaust one another), in Act V he operates by speed. The change is partly circumstance — Richmond is at sea, Buckingham in revolt — but it is also psychological. Richard post-coronation is no longer the plotter. He is the defender of a crown under immediate pressure. The metaphor \"Jove's Mercury\" is ironic: Mercury the messenger carried Jove's instructions; Richard is casting himself as both source and agent, which is the new tyranny's characteristic self-contradiction.",
      sources: ["Stephen Greenblatt, Tyrant: Shakespeare on Politics (2018)", "A. P. Rossiter, Angel with Horns (1961)"]
    }
  ];

  TRIALS.richard_iii_act4_scene3 = [
    {
      kind: "close_reading",
      prompt: "Tyrrel reports that the hired killers Dighton and Forrest described the murdered princes as lying with \"A book of prayers on their pillow.\" What does this detail do dramaturgically?",
      options: [
        "It provides comic relief",
        "It marks the moment that \"almost changed\" the killer's mind — confirming to the audience that what is being killed is a child in a child's ordinary end-of-day act",
        "It indicates the princes were Jesuit recusants",
        "It is a stage property mentioned in the First Folio only"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 14, anchor_line_end: 16
    },
    {
      kind: "historical",
      prompt: "What is the historical status of Shakespeare's identification of Richard III as the author of the princes' deaths?",
      options: [
        "It is confirmed by contemporary legal records and DNA evidence",
        "It follows Thomas More's History and the dominant Tudor-era account, but the historical question remains open: alternative theories (Buckingham, Henry VII, natural causes) are seriously entertained by modern historians",
        "It is universally rejected by modern historians",
        "It was invented by Shakespeare without any prior source"
      ],
      answer_index: 1,
      wisdom_reward: 30,
      anchor_line_start: 1, anchor_line_end: 35
    },
    {
      kind: "inference",
      prompt: "Why does Richard say \"the sons of Edward sleep in Abraham's bosom\"?",
      options: [
        "He sincerely believes their souls are in heaven",
        "It is characteristic blasphemy — borrowing the New Testament image of heaven for children he commissioned murdered",
        "He is quoting from a contemporary sermon at Paul's Cross",
        "He is signaling that they died in their sleep"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 38, anchor_line_end: 38
    },
    {
      kind: "theme",
      prompt: "Richard's four-line inventory (\"The son of Clarence have I pent up close...\") reveals what about the post-coronation political program?",
      options: [
        "Richard is reconsidering his course of action",
        "He has systematically eliminated or neutralized every collateral claim to the throne — a dynastic clean-up enumerated with casual precision",
        "He has surrendered control to Buckingham",
        "He has reconciled with the surviving Woodvilles"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 36, anchor_line_end: 43
    },
    {
      kind: "historical",
      prompt: "Why does Richard plan to marry his niece Elizabeth of York?",
      options: [
        "He is in love with her",
        "Richmond (Henry Tudor), exiled in Brittany, has sworn to marry her — joining Lancastrian and Yorkist claims; Richard's counter-move is to marry her first",
        "It is required by the Titulus Regius statute",
        "To repair his reputation with Elizabeth's mother"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 40, anchor_line_end: 43
    },
    {
      kind: "close_reading",
      prompt: "Tyrrel's line \"The tyrannous and bloody deed is done\" functions in the play how?",
      options: [
        "As a euphemism softening the murder",
        "As the play's refusal to use euphemism: the deed is named massacre (\"the most arch of piteous massacre\") without qualification — moral weight preserved",
        "As a formal legal proclamation in Latin",
        "As an accidental slip in the paid killer's report"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 3
    }
  ];

  // ── 4.4 — Before the palace. The wailing queens [TIER-1] ──────────────
  ANNOTATIONS.richard_iii_act4_scene4 = [
    {
      line_start: 1, line_end: 113,
      citation_display: cite("4.4", 1, 113),
      category: "structural",
      title: "The three women together — the play's formal peak",
      body: "The first hundred lines of 4.4 are the play's most intricately constructed formal set-piece, and one of the densest in Shakespeare. Queen Margaret, Queen Elizabeth, and the Duchess of York arrange themselves in a triangle of grief; each has lost an Edward, each has lost a second male kinsman, each occupies a specific position in the moral ledger the play has been keeping. The central passage — \"I had an Edward, till a Richard kill'd him; / I had a Harry, till a Richard kill'd him: / Thou hadst an Edward, till a Richard kill'd him; / Thou hadst a Richard, till a Richard killed him\" — uses near-identical syntax to enact precise moral arithmetic. Every grief rhymes with every other; every murder is paid against every other. The form is Senecan antiphony refined through medieval complaint-poetry and brought to a level Shakespeare himself will rarely exceed. When Margaret and Elizabeth together review the dead (\"The adulterate Hastings, Rivers, Vaughan, Grey\"), they are also reviewing Margaret's 1.3 curse fulfilled.",
      sources: ["Nicholas Brooke, Shakespeare's Early Tragedies (1968)", "Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
    {
      line_start: 1, line_end: 16,
      citation_display: cite("4.4", 1, 16),
      category: "thematic",
      title: "Margaret returns — the chorus collects its dividends",
      body: "Margaret's soliloquy — \"So, now prosperity begins to mellow / And drop into the rotten mouth of death\" — is one of the most savage re-entries in Shakespeare. She has remained in England (historically impossible — she died in France in 1482) to witness each of her 1.3 curses being fulfilled, and now she enters to watch the last convulsions. \"A dire induction am I witness to\" — the vocabulary is Senecan, the posture choric. The scene's later line-for-line grief arithmetic is Margaret's grim exam: Elizabeth and the Duchess must now admit, in her presence, what they could not accept in 1.3. The play is asking whether the victim of yesterday's crime owes moral witness to today's victims when she was herself dismissed. Margaret is in one reading heartless and in another — closer to the play's own — terrible precisely because she is the only one left with the historical memory to be accurate.",
      sources: ["Patricia-Ann Lee, \"Reflections of Power: Margaret of Anjou and the Dark Side of Queenship\" (1986)", "Phyllis Rackin, Stages of History (1990)", "A. P. Rossiter, Angel with Horns (1961)"]
    },
    {
      line_start: 116, line_end: 126,
      citation_display: cite("4.4", 116, 126),
      category: "close_reading",
      title: "Elizabeth becomes Margaret's pupil",
      body: "Elizabeth's request — \"O thou well skill'd in curses, stay awhile, / And teach me how to curse mine enemies!\" — is the play's cleanest reversal. In 1.3 Elizabeth had dismissed Margaret as a \"lunatic\" (1.3.251). Now she asks Margaret to teach her the craft. Margaret's answer is methodologically specific: forbear sleep, fast, remember dead happiness against living woe, \"Compare dead happiness with living woe; / Think that thy babes were fairer than they were, / And he that slew them fouler than he is.\" The curse is a daily discipline of recollection. What Margaret is teaching is what she has become: someone whose grief survives because she refuses to let time soften it. The scene is the play's rarest gift — a moment of instruction across a victim-solidarity that crosses the Lancaster-York line. It will not prevent any of what comes, but it changes Elizabeth into someone capable of resisting Richard in the second half of the scene.",
      sources: ["Madonne M. Miner, \"'Neither mother, wife, nor England's queen'\" (1980)", "Janet Adelman, Suffocating Mothers (1992)", "Kathryn Schwarz, Tough Love: Amazon Encounters in the English Renaissance (2000)"]
    },
    {
      line_start: 165, line_end: 193,
      citation_display: cite("4.4", 165, 193),
      category: "thematic",
      title: "The Duchess of York's maternal curse",
      body: "The Duchess's farewell to Richard — \"take with thee my most heavy curse; / Which, in the day of battle, tire thee more / Than all the complete armour that thou wear'st!\" — is the play's most terrible maternal curse. She has traced his whole life in a single speech — grievous burthen at birth, tetchy infancy, frightful schooldays, venturous manhood, treacherous confirmed age — and concludes that no comfortable hour graced her in his company. The curse's specific invocation is that his own mother's prayers will fight for his adversary in the battle: \"My prayers on the adverse party fight.\" The play's supernatural machinery has now added the mother's prayer to Margaret's curse-chain and the murdered souls' ghost-summons. In 5.3 all three will converge against Richard in the tent. The Duchess is one of the ghosts of the battle before the battle begins.",
      sources: ["Janet Adelman, Suffocating Mothers (1992)", "Coppélia Kahn, Man's Estate: Masculine Identity in Shakespeare (1981)", "Phyllis Rackin, Stages of History (1990)"]
    },
    {
      line_start: 201, line_end: 293,
      citation_display: cite("4.4", 201, 293),
      category: "structural",
      title: "The second wooing — and the question whether Elizabeth yields",
      body: "Richard's attempt to woo Elizabeth of York through her mother is the play's structural answer to 1.2. The scene is roughly ninety lines, again stichomythic, again a duel of wits — but this time the woman opposing Richard is not exhausted and widowed; she is the mother of the murdered princes and has just been instructed by Margaret in the craft of curse. Critics remain divided on whether Elizabeth \"yields\" at the scene's end. The surface text (\"I go. Write to me very shortly, / And you shall understand from me her mind\") can be read as capitulation (Richard thinks so: \"Relenting fool, and shallow, changing woman!\"), as tactical delay (she knows Richmond is approaching), or as outright deceit (she is simultaneously sending Derby a letter arranging Elizabeth of York's marriage to Richmond — confirmed in 4.5). Modern productions mostly favour the tactical-deceit reading; the wordplay's aggressiveness supports it. What is clear is that Richard misjudges: the 1.2 method does not work on a mother who has read the play's earlier scenes.",
      sources: ["Madonne M. Miner, \"'Neither mother, wife, nor England's queen'\" (1980)", "Janet Adelman, Suffocating Mothers (1992)", "Marjorie Garber, Shakespeare and Modern Culture (2008)", "Harriet Hawkins, \"The Authority of Tradition, the Authority of Experience\" (1978)"]
    },
    {
      line_start: 364, line_end: 397,
      citation_display: cite("4.4", 364, 397),
      category: "close_reading",
      title: "\"Swear then by something that thou hast not wrong'd\"",
      body: "Elizabeth's systematic demolition of Richard's oaths (364–397) is one of the great rhetorical sequences in Shakespeare. He swears by his George, his garter, and his crown: profaned, dishonour'd, usurped. The world: full of his wrongs. His father's death: his life has dishonour'd it. Himself: misused. God: most wronged of all. Her method is not counter-argument but exclusion — the method of someone who has realized that Richard's rhetoric only works where a remainder of uncompromised value is available. She takes away every possible guarantor of his promise. The speech's closing thrust — \"Swear not by time to come; for that thou hast / Misused ere used, by time misused o'erpast\" — is the play's most precise articulation of the logic Margaret had been teaching: the future is already mortgaged by the past. This is the play's one entirely successful rhetorical duel against Richard. He loses.",
      sources: ["Brian Vickers, The Artistry of Shakespeare's Prose (1968)", "Madonne M. Miner, \"'Neither mother, wife, nor England's queen'\" (1980)", "Joel B. Altman, The Tudor Play of Mind (1978)"]
    },
    {
      line_start: 427, line_end: 428,
      citation_display: cite("4.4", 427, 428),
      category: "inference",
      title: "\"Relenting fool, and shallow, changing woman!\"",
      body: "Richard's aside after Elizabeth exits — \"Relenting fool, and shallow, changing woman!\" — is the scene's trap for him. He thinks he has won; the play lets us see that he has not. The coming scenes will reveal that Elizabeth has sent word to Derby that \"the queen hath heartily consented / He shall espouse Elizabeth her daughter\" — meaning Richmond, not Richard (4.5.17–18). Richard's contemptuous summary of her is the index of his misreading, and in a play whose hero is defined by his reading of others, being wrong about a woman is the first indication that his command of the scene has slipped. Margaret's curse — \"Thy friends suspect for traitors while thou livest, / And take deep traitors for thy dearest friends\" (1.3.219–220) — is fulfilled here in miniature. Richard cannot tell who he is talking to anymore.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Madonne M. Miner, \"'Neither mother, wife, nor England's queen'\" (1980)"]
    },
    {
      line_start: 46, line_end: 57,
      citation_display: cite("4.4", 46, 57),
      category: "thematic",
      title: "\"Kennel of thy womb\" — Margaret's extreme maternal curse",
      body: "Margaret's image of the Duchess's womb as \"kennel\" to a \"hell-hound\" — \"a dog, that had his teeth before his eyes, / To worry lambs and lap their gentle blood\" — is the play's most extreme treatment of its maternal-monstrous register. The compressed allusion to the birth-with-teeth legend (cf. 2.4, 1.3's \"rooting hog\") is weaponized here into a vision of the Duchess as unwitting kennel for a hunting-dog that hunts its own family. It is almost impossible maternal language. What justifies it dramaturgically is that the Duchess herself has been moving toward this language since 2.2 (\"from my dugs he drew not this deceit\") and 4.1 (\"cockatrice hast thou hatch'd\"). Margaret names what the Duchess has already been confessing. The scene's moral economy requires that the curse come from the outsider-queen rather than the mother, but the mother must consent. When the Duchess says \"God witness with me, I have wept for thine\" (59), she is consenting to Margaret's reading of her own son.",
      sources: ["Janet Adelman, Suffocating Mothers (1992)", "Phyllis Rackin, Stages of History (1990)", "Madonne M. Miner, \"'Neither mother, wife, nor England's queen'\" (1980)"]
    }
  ];

  TRIALS.richard_iii_act4_scene4 = [
    {
      kind: "structural",
      prompt: "The central passage \"I had an Edward, till a Richard kill'd him...\" does what formally?",
      options: [
        "It uses unstructured exclamation to convey grief",
        "It uses near-identical syntactic parallelism to enact precise moral arithmetic — every grief rhymes with every other",
        "It introduces new characters by their titles",
        "It is a quotation from an Old English lament poem"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 39, anchor_line_end: 42
    },
    {
      kind: "theme",
      prompt: "What is the structural function of Margaret's return in 4.4, given that historically she had died in 1482?",
      options: [
        "To provide comic relief before the final act",
        "To serve as the play's chorus — her historical impossibility as deliberate dramaturgy, keeping the cross-dynastic moral ledger present at the scene of its fulfillment",
        "To introduce a romantic subplot",
        "To represent France's official political position"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 16
    },
    {
      kind: "close_reading",
      prompt: "Elizabeth's \"O thou well skill'd in curses, stay awhile, / And teach me how to curse mine enemies!\" marks what change?",
      options: [
        "She has become confused about political allegiances",
        "She explicitly becomes Margaret's pupil — the reversal from her 1.3 dismissal of Margaret as a lunatic",
        "She is preparing a spell for use against Richmond",
        "She is mocking Margaret to distract her from grief"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 115, anchor_line_end: 116
    },
    {
      kind: "inference",
      prompt: "The Duchess of York's curse on Richard includes the line \"My prayers on the adverse party fight.\" What does she invoke?",
      options: [
        "The military chaplain of Richmond's army",
        "Her maternal prayers fighting for Richmond — the mother's prayer added to Margaret's curse-chain and the murdered souls' ghost-summons that will all converge in 5.3",
        "A specific saint she believes will intercede",
        "An ancient family motto"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 188, anchor_line_end: 191
    },
    {
      kind: "theme",
      prompt: "Most modern critics read Elizabeth's exit in the second wooing (4.4) as what?",
      options: [
        "A genuine capitulation, as Richard himself believes",
        "Tactical delay or outright deceit — she is in fact arranging her daughter's marriage to Richmond, not Richard (confirmed in 4.5)",
        "A permanent break with all political engagement",
        "A conversion to a religious order"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 420, anchor_line_end: 428
    },
    {
      kind: "close_reading",
      prompt: "Elizabeth's systematic demolition of Richard's oaths (364–397) succeeds by what method?",
      options: [
        "Direct counter-argument on each point",
        "Exclusion — she takes away every possible uncompromised guarantor of his promise (his George, his garter, the world, his father's death, himself, God), leaving nothing uncorrupted to swear by",
        "Appeal to a higher authority in heaven",
        "A legal argument citing specific statutes"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 364, anchor_line_end: 375
    },
    {
      kind: "structural",
      prompt: "Richard's aside at 427–428 — \"Relenting fool, and shallow, changing woman!\" — marks what?",
      options: [
        "The moment of Richard's final triumph",
        "The scene's trap for Richard: he thinks he has won; the audience sees (and 4.5 will confirm) that he has been outmanoeuvred",
        "A transitional soliloquy about his next military move",
        "A reflection on his mother's character"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 427, anchor_line_end: 428
    },
    {
      kind: "theme",
      prompt: "Margaret's \"kennel of thy womb\" image compresses which motif recurring since 2.4?",
      options: [
        "The boar as Richard's heraldic badge",
        "The folk legend that Richard was born with teeth — weaponized here into a vision of the Duchess's womb as unwitting kennel for a hunting-dog",
        "The biblical motif of the lion and the lamb",
        "The classical topos of the basilisk's gaze"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 46, anchor_line_end: 53
    }
  ];

  // ── 4.5 — Lord Derby's house. The covert message ──────────────────────
  ANNOTATIONS.richard_iii_act4_scene5 = [
    {
      line_start: 1, line_end: 20,
      citation_display: cite("4.5", 1, 20),
      category: "historical",
      title: "Lord Stanley's long double-game",
      body: "The scene shows Lord Stanley (Derby) sending Sir Christopher a message to Richmond: the queen has consented to Richmond marrying Elizabeth of York. Historically Stanley's position in summer 1485 was precisely this double-game. His second wife Margaret Beaufort was Richmond's mother; his son George was held as Richard's hostage (4.2.490); his own forces remained officially at Richard's disposal. At Bosworth, Stanley famously committed his forces only after the battle had begun to turn against Richard — arguably the decisive action of the day. Shakespeare compresses Stanley's layered motivations into a single cover-line: \"in the sty of this most bloody boar / My son George Stanley is frank'd up in hold: / If I revolt, off goes young George's head; / The fear of that withholds my present aid.\" The scene is short but historically load-bearing: Stanley is the character whose divided loyalties, more than any other, will decide the battle.",
      sources: ["Charles Ross, Richard III (1981)", "Barrie Williams, \"The Stanleys of Lathom and the Accession of Henry VII\" (1990)", "Polydore Vergil, Anglica Historia (c. 1513)"]
    },
    {
      line_start: 11, line_end: 13,
      citation_display: cite("4.5", 11, 13),
      category: "biographical",
      title: "The Welsh gentlemen and Rice ap Thomas",
      body: "Christopher's list of Richmond's supporters — Sir Walter Herbert, Sir Gilbert Talbot, Sir William Stanley, Oxford, \"redoubted Pembroke\" (Jasper Tudor), Sir James Blunt, and \"Rice ap Thomas, with a valiant crew\" — names the core of the coalition that would win at Bosworth. Rhys ap Thomas in particular was historically central: the Welsh magnate's decision to support Richmond during his march through Wales from Milford Haven (August 1485) was indispensable. Shakespeare's single-line mention masks vast political significance. Jasper Tudor (Earl of Pembroke, Richmond's uncle and long-term protector in exile) is the family link that made the Welsh support coherent. The scene in fourteen lines sketches the dynastic geography that would end the Wars of the Roses.",
      sources: ["Stanley B. Chrimes, Henry VII (1972)", "Ralph A. Griffiths and Roger S. Thomas, The Making of the Tudor Dynasty (1985)"]
    }
  ];

  TRIALS.richard_iii_act4_scene5 = [
    {
      kind: "historical",
      prompt: "Why cannot Lord Stanley (Derby) openly support Richmond at this point?",
      options: [
        "He has no political interest in doing so",
        "His son George Stanley is held as Richard's hostage at court — open revolt would cost the boy's head",
        "He has sworn a sacred oath to Richard",
        "He is physically imprisoned"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 2, anchor_line_end: 5
    },
    {
      kind: "historical",
      prompt: "Among the supporters Christopher lists for Richmond, who was historically central for the march through Wales?",
      options: [
        "Sir Walter Herbert",
        "Rhys ap Thomas (\"Rice ap Thomas\"), the Welsh magnate whose support during Richmond's march from Milford Haven was indispensable",
        "Sir James Blunt",
        "The Earl of Oxford, solely"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 12, anchor_line_end: 12
    }
  ];

};
