/**
 * Richard III — Act V annotations and Trials.
 * Two Tier-1 scenes: 5.3 (the ghost procession and "thousand several
 * tongues"), 5.4 ("A horse! a horse!"). 5.1 (Buckingham's All-Souls'
 * execution), 5.2 (Richmond's rallying speech), and 5.5 (the Tudor-Myth
 * closing speech) are non-Tier-1 but structurally critical.
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

  // ── 5.1 — Salisbury. Buckingham to execution ──────────────────────────
  ANNOTATIONS.richard_iii_act5_scene1 = [
    {
      line_start: 1, line_end: 29,
      citation_display: cite("5.1", 1, 29),
      category: "structural",
      title: "Buckingham's All-Souls speech and the closure of the curse-chain",
      body: "Buckingham's last soliloquy is the play's most precisely calibrated moment of curse-recognition. He is executed on All-Souls' Day — 2 November, the feast of the dead — and the date was both historical fact and dramaturgical gift. The speech works on three registers simultaneously. First, he recalls the elaborate self-curse he swore in 2.1 during Edward's forced reconciliation (\"When I am cold in zeal to yours\") and names it as now executed against him. Second, he closes Margaret's 1.3 curse-chain by quoting her directly: \"'When he,' quoth she, 'shall split thy heart with sorrow, / Remember Margaret was a prophetess.'\" Third, he articulates the play's theology of providence: \"Thus doth he force the swords of wicked men / To turn their own points on their masters' bosoms.\" The speech is the clearest statement in the play of what the curses have meant. Buckingham dies understanding the system he enabled.",
      sources: ["A. P. Rossiter, Angel with Horns (1961)", "Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "Bernard Spivack, Shakespeare and the Allegory of Evil (1958)"]
    },
    {
      line_start: 10, line_end: 29,
      citation_display: cite("5.1", 10, 29),
      category: "historical",
      title: "All-Souls' Day as fact and metaphor",
      body: "Buckingham was in fact executed on All-Souls' Day, 2 November 1483, in Salisbury market square. The historical coincidence gives the scene its layered theological weight. All Souls (from the medieval tradition established c. 998 at Cluny) was the day set aside for prayer for all the faithful departed — particularly those in purgatory. Buckingham's \"All-Souls' day is my body's doomsday\" plays on the feast's day-of-reckoning connotation while acknowledging what the chronicles record. Shakespeare's audiences — still living inside decades of post-Reformation religious argument — would have heard the All-Souls reference with particular attention. The speech lets a Catholic calendar-detail carry a play's providential argument without committing the play to any specific doctrinal position. The dead, on the day of the dead, come for their witness.",
      sources: ["Eamon Duffy, The Stripping of the Altars (1992)", "Holinshed, Chronicles (1587)", "Charles Ross, Richard III (1981)"]
    }
  ];

  TRIALS.richard_iii_act5_scene1 = [
    {
      kind: "historical",
      prompt: "On what date does Buckingham's execution take place, and why does the play emphasize it?",
      options: [
        "Good Friday — Christ's crucifixion day",
        "All-Souls' Day (2 November), the medieval feast for prayer for the faithful departed — the day-of-reckoning connotation gives the scene its theological weight (and matches historical fact)",
        "St. George's Day — England's patron saint",
        "Christmas Eve — a date Shakespeare invented for dramatic effect"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 10, anchor_line_end: 12
    },
    {
      kind: "close_reading",
      prompt: "Buckingham's line \"Thus doth he force the swords of wicked men / To turn their own points on their masters' bosoms\" articulates what?",
      options: [
        "A military strategy for turning enemy weapons",
        "The play's providential theology: God uses the wicked's own instruments against them — the clearest statement of what the curse-chain has meant",
        "A secret weapons-making technique",
        "A specific Senecan dramatic convention"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 23, anchor_line_end: 24
    },
    {
      kind: "structural",
      prompt: "Whose earlier curse does Buckingham explicitly quote back in his final speech?",
      options: [
        "The Duchess of York's curse on Richard",
        "Margaret's 1.3 warning to Buckingham himself: \"Remember Margaret was a prophetess\"",
        "Hastings' prophecy in 3.4",
        "The scrivener's indictment-curse in 3.6"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 25, anchor_line_end: 27
    }
  ];

  // ── 5.2 — Plain near Tamworth. Richmond rallies ───────────────────────
  ANNOTATIONS.richard_iii_act5_scene2 = [
    {
      line_start: 1, line_end: 24,
      citation_display: cite("5.2", 1, 24),
      category: "close_reading",
      title: "Richmond's first speech: the boar, the hog, the swine",
      body: "Richmond's rallying speech uses three different pig-variants for Richard — boar, foul swine, hog — within twenty lines. The escalation is deliberate. The boar is Richard's heraldic badge (white boar of Gloucester); the swine and hog degrade the emblem to the barnyard. \"Swills your warm blood like wash\" converts Richard into a pig drinking kitchen-slops; the \"trough\" is made in \"your embowell'd bosoms.\" The imagery cluster answers Margaret's 1.3 \"elvish-mark'd, abortive, rooting hog\" — Richmond arrives speaking her vocabulary, a detail that partially legitimizes his violence against Richard as the language of the women Richard has wronged. What the speech cannot quite do is give Richmond interiority. He is the play's necessary figure rather than its psychological counterpart, and the speech's calculated hatred lets the audience feel that.",
      sources: ["Phyllis Rackin, Stages of History (1990)", "Nicholas Brooke, Shakespeare's Early Tragedies (1968)"]
    }
  ];

  TRIALS.richard_iii_act5_scene2 = [
    {
      kind: "close_reading",
      prompt: "Richmond's rallying speech uses three pig-variants for Richard (boar, swine, hog). What does this imagery cluster do?",
      options: [
        "Introduces comic deflation before a serious battle",
        "Answers Margaret's 1.3 vocabulary — Richmond arrives speaking the language of the women Richard has wronged, partially legitimizing his cause",
        "Is a classical pastoral reference drawn from Virgil",
        "Is a heraldic argument about the boar's lower standing"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 7, anchor_line_end: 12
    },
    {
      kind: "inference",
      prompt: "What does Richmond's calculated hatred of Richard reveal about his function in the play's design?",
      options: [
        "That he is the play's psychological centre",
        "That he is the play's necessary figure rather than its psychological counterpart — Shakespeare keeps him schematic so the Tudor dynastic arrival can take on providential shape",
        "That he is a secondary character inserted for historical completeness",
        "That he is the play's secret villain"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 24
    }
  ];

  // ── 5.3 — Bosworth Field. The ghost scene [TIER-1] ────────────────────
  ANNOTATIONS.richard_iii_act5_scene3 = [
    {
      line_start: 114, line_end: 173,
      citation_display: cite("5.3", 114, 173),
      category: "structural",
      title: "The ghost procession: Shakespeare's most extensive haunting",
      body: "Ten ghosts appear to Richard in turn — Prince Edward of Lancaster, Henry VI, Clarence, Rivers, Grey, Vaughan, Hastings, the two young Princes (collectively), Lady Anne, and Buckingham — in the order of their deaths within the play's chronology. This is the most extensive ghost sequence in Shakespeare; the nearest comparisons are Banquo's single appearance in Macbeth 3.4 and the Caesar-visitation in Julius Caesar 4.3. The ghost scene's basic form is strictly formal: each ghost addresses Richard first (\"despair, and die!\") and then turns to Richmond, sleeping in his own tent at the other side of the stage, to bless him (\"live, and flourish!\"). The symmetry is the structure. Every ghost curses Richard in the vocabulary Margaret began (\"despair\"), blesses Richmond in the vocabulary the Duchess's maternal prayer has set up, and exits. The curse-chain Margaret started in 1.3, the maternal prayer the Duchess added in 4.4, and the souls of the murdered converge here as a single ledger-settlement.",
      sources: ["Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "Marjorie Garber, Shakespeare's Ghost Writers (1987)", "Stephen Greenblatt, Hamlet in Purgatory (2001)"]
    },
    {
      line_start: 114, line_end: 173,
      citation_display: cite("5.3", 114, 173),
      category: "thematic",
      title: "The moral-accounting function of the ghosts",
      body: "Each ghost names a specific murder. Prince Edward cites Tewkesbury. Henry VI cites his own murder at the Tower (1471). Clarence cites the malmsey-butt drowning. Rivers, Grey, and Vaughan cite Pomfret. Hastings cites the council-chamber trap. The Young Princes cite the smothering in the Tower. Anne cites her own poisoned marriage-bed. Buckingham cites his betrayal at Salisbury. The sequence is the play's ledger, recited in order, one death at a time. The ghosts are not merely frightening — they are a courtroom. Each arrives to testify specifically. Richard's \"My conscience hath a thousand several tongues, / And every tongue brings in a several tale, / And every tale condemns me for a villain\" (190–192) names what the ghost sequence has just enacted: his conscience is not a single voice but a courtroom of testimonies, each specific, each separate. Shakespeare has given us in stage form what Richard will immediately re-describe in his own words.",
      sources: ["Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Maus, Katharine Eisaman, Inwardness and Theater in the English Renaissance (1995)"]
    },
    {
      line_start: 174, line_end: 207,
      citation_display: cite("5.3", 174, 207),
      category: "close_reading",
      title: "\"I am I\" — the soliloquy of self-division",
      body: "Richard's waking soliloquy is the most philosophically interesting speech in the play. \"Richard loves Richard; that is, I am I\" is a formal tautology — the self equaling the self — but it fails as a consolation. He immediately multiplies: \"Is there a murderer here? No. Yes, I am: / Then fly. What, from myself?\" The speech stages a self that cannot hold together. The pronouns themselves unravel: myself, I myself, I, I. \"I am a villain: yet I lie, I am not.\" He cannot both condemn and absolve himself in consistent voice. This is the interiority the play has been pointing toward since 1.1 and has so far only given us in inverted form (the Second Murderer in 1.4, Anne in 4.1). Richard's soliloquy is the play's formal admission that Richard has one. The cost is the coherence of the I that had spoken so fluidly for four acts. The ghosts have not only indicted him; they have dispersed him across the pronouns he used to control.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Maynard Mack, \"The Jacobean Shakespeare: Some Observations on the Construction of the Tragedies\" (1960)", "Katharine Eisaman Maus, Inwardness and Theater in the English Renaissance (1995)"]
    },
    {
      line_start: 190, line_end: 203,
      citation_display: cite("5.3", 190, 203),
      category: "thematic",
      title: "\"A thousand several tongues\" — interiority as courtroom",
      body: "The soliloquy's formal peak is \"My conscience hath a thousand several tongues, / And every tongue brings in a several tale, / And every tale condemns me for a villain.\" The three \"several\" (= separate) tongues are the exact form of the ghost procession: distinct voices, distinct tales, one verdict. Shakespeare converts the stage convention of serial haunting into the pattern of conscience itself. What is remarkable is that the speech's eventual conclusion — \"There is no creature loves me; / And if I die, no soul shall pity me: / Nay, wherefore should they, since that I myself / Find in myself no pity to myself?\" — is not self-pity but accurate self-diagnosis. Richard has understood. The play's morality does not require him to repent; it requires him to see. He sees, and it changes nothing about his choice in the coming battle. This is perhaps the play's darkest theological move.",
      sources: ["Katharine Eisaman Maus, Inwardness and Theater in the English Renaissance (1995)", "A. C. Bradley, Shakespearean Tragedy (1904)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 197, line_end: 202,
      citation_display: cite("5.3", 197, 202),
      category: "historical",
      title: "\"I shall despair\" — the specific theological weight",
      body: "Richard's \"I shall despair\" is the precise theological terminus the ghosts have been aiming at. Within Christian tradition, despair (Latin desperatio) is the sin against the Holy Spirit — the refusal to believe that one's sins are forgivable, which therefore precludes repentance and guarantees damnation. Unlike pride, envy, or murder, despair cannot itself be forgiven because it refuses the possibility of forgiveness. This is why every ghost has used the exact phrase \"despair, and die!\" The ghosts are not wishing Richard physical death; they are wishing him a specific kind of death — unrepentant. Richard's admission \"I shall despair\" signals that he has accepted the curse's theological operation. He cannot repent now. The play has placed him in the one condition medieval-Christian doctrine identified as beyond rescue. Whether Shakespeare endorsed this theology or dramatized it because his audience held it is scholarly debate; what the play demonstrates is that its moral world requires the doctrine to work.",
      sources: ["Susan Snyder, \"The Left Hand of God: Despair in Medieval and Renaissance Tradition\" (1965)", "Debora K. Shuger, Habits of Thought in the English Renaissance (1990)", "Richard Strier, The Unrepentant Renaissance (2011)"]
    },
    {
      line_start: 264, line_end: 273,
      citation_display: cite("5.3", 264, 273),
      category: "close_reading",
      title: "\"Conscience is but a word that cowards use\"",
      body: "Richard's oration to his soldiers includes the couplet \"Conscience is but a word that cowards use, / Devised at first to keep the strong in awe: / Our strong arms be our conscience, swords our law.\" The lines are Richard's most explicitly nihilist public speech. They also stand in direct contradiction to the soliloquy he delivered privately moments earlier (\"A thousand several tongues\"). Shakespeare gives us Richard's public self and private self within a few hundred lines and lets the gap speak. He is lying to his troops and knows he is lying. The \"Jockey of Norfolk\" placard — \"Jockey of Norfolk, be not too bold, / For Dickon thy master is bought and sold\" — mounted on Norfolk's tent and dismissed as \"A thing devised by the enemy,\" continues the motif. Richard is surrounded by warnings he is now refusing to hear after having heard them acutely just hours before. The tragedy of the final act is that Richard has seen clearly and chosen anyway.",
      sources: ["Stephen Greenblatt, Tyrant: Shakespeare on Politics (2018)", "A. P. Rossiter, Angel with Horns (1961)", "Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)"]
    },
    {
      line_start: 218, line_end: 282,
      citation_display: cite("5.3", 218, 282),
      category: "structural",
      title: "Richmond's prayer mirrors Richard's soliloquy",
      body: "Shakespeare stages the two commanders' nights in tight structural parallel. Each is visited by the same ghosts; each delivers a pre-battle speech. Richmond's prayer before sleep (105–113) — \"O Thou, whose captain I account myself, / Look on my forces with a gracious eye\" — asks God to \"make us thy ministers of chastisement.\" His post-ghost waking is the mirror-opposite of Richard's: \"my soul is very jocund / In the remembrance of so fair a dream.\" Same ghosts, opposite effects. Richmond's public oration to his troops (225–272) casts the battle as defence of \"God's enemies\" against \"foreign mercenaries,\" framing the Tudor arrival as national restoration. The parallel structure is doing particular theological work: the same supernatural visitation blesses one and curses the other, because the providential order recognizes the two men differently. Whether the audience must endorse this claim is another matter — but the scene asks us to see its shape.",
      sources: ["E. M. W. Tillyard, Shakespeare's History Plays (1944)", "Phyllis Rackin, Stages of History (1990)", "Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)"]
    },
    {
      line_start: 176, line_end: 202,
      citation_display: cite("5.3", 176, 202),
      category: "thematic",
      title: "The ghosts as Shakespeare's laboratory for later tragedies",
      body: "This scene is where Shakespeare first stages the essential pattern of tragic interiority that he will refine in Macbeth's banquet scene (Banquo's ghost) and Hamlet's encounters with his father. The technique — the sinner's recognition as a procession of specific indictments rather than a single voice of doom — is here perfected. Richard's \"thousand several tongues\" will reappear in Macbeth's \"the multitudinous seas incarnadine\" and Lady Macbeth's \"all the perfumes of Arabia.\" The idea that guilt is serial, specific, and cumulative, and that recognition is not rescue, is the doctrine of the mature tragedies working itself out here in early form. What is different in Richard III is that Shakespeare allows the ghosts to be literal — they arrive, they speak, they exit — whereas in the later tragedies the ghosts will become (or threaten to become) hallucinatory. Here Shakespeare uses medieval stage convention without apology; in the later plays he will interrogate the convention itself.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Marjorie Garber, Shakespeare's Ghost Writers (1987)", "Stephen Greenblatt, Hamlet in Purgatory (2001)"]
    }
  ];

  TRIALS.richard_iii_act5_scene3 = [
    {
      kind: "structural",
      prompt: "How is the ghost procession in 5.3 formally organized?",
      options: [
        "Each ghost speaks only once, with no structural pattern",
        "Each ghost curses Richard (\"despair, and die!\") and then turns to bless the sleeping Richmond (\"live, and flourish!\") — a double address in strict symmetry",
        "The ghosts speak together as a chorus in unison",
        "The ghosts speak only to Richmond, not to Richard"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 115, anchor_line_end: 173
    },
    {
      kind: "theme",
      prompt: "What is the dramatic function of the ghost procession?",
      options: [
        "To provide visual spectacle before the battle",
        "To serve as a moral ledger — each ghost naming a specific murder, together recited in chronological order, enacting conscience as a courtroom of specific testimonies",
        "To confirm that Richard will die the next day",
        "To give Richmond a prophetic dream of victory"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 115, anchor_line_end: 173
    },
    {
      kind: "close_reading",
      prompt: "Richard's soliloquy begins \"Richard loves Richard; that is, I am I.\" What does the speech dramatize?",
      options: [
        "Richard's settled self-knowledge",
        "Self-division: a self that cannot hold together — the pronouns unravel, he can neither condemn nor absolve himself in consistent voice, the I of four acts disperses under the ghosts' indictments",
        "Richard's new resolve to rule better",
        "A religious conversion"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 179, anchor_line_end: 200
    },
    {
      kind: "thematic",
      prompt: "\"My conscience hath a thousand several tongues\" (190–192) does what formally?",
      options: [
        "Restates a proverb from Ecclesiastes",
        "Converts the stage convention of serial haunting (the ghost procession) into the pattern of conscience itself — distinct voices, distinct tales, one verdict",
        "Predicts the number of soldiers in Richmond's army",
        "Refers to the number of Senators in Rome"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 190, anchor_line_end: 192
    },
    {
      kind: "historical",
      prompt: "Why is Richard's \"I shall despair\" theologically significant?",
      options: [
        "It is idiomatic, meaning only temporary discouragement",
        "In Christian tradition, despair (desperatio) is the sin against the Holy Spirit — refusal of forgiveness, which precludes repentance and guarantees damnation. Every ghost's \"despair, and die!\" aims at this specific theological terminus",
        "It marks Richard's conversion to Calvinism",
        "It is a quotation from Martin Luther"
      ],
      answer_index: 1,
      wisdom_reward: 30,
      anchor_line_start: 197, anchor_line_end: 197
    },
    {
      kind: "close_reading",
      prompt: "Richard's public oration — \"Conscience is but a word that cowards use\" — contradicts what?",
      options: [
        "A specific statute in Edwardian law",
        "His own private soliloquy moments earlier (\"A thousand several tongues\") — Shakespeare gives us Richard's public and private selves within a few hundred lines and lets the gap speak",
        "Richmond's rallying speech",
        "An earlier promise to his mother"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 269, anchor_line_end: 271
    },
    {
      kind: "structural",
      prompt: "Richmond's post-ghost waking (225–228) stands in what relation to Richard's?",
      options: [
        "The same: both are terrified",
        "Mirror-opposite: same ghosts, opposite effects — Richmond's soul is \"very jocund\" while Richard despairs, staging the providential order's differential recognition of the two men",
        "Unrelated, occurring in separate acts",
        "Briefer and less developed"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 224, anchor_line_end: 228
    },
    {
      kind: "theme",
      prompt: "The ghost scene is most important as Shakespeare's early laboratory for which of his later plays' techniques?",
      options: [
        "The comic subplots of Love's Labour's Lost",
        "The inward recognition structures of Macbeth and Hamlet — guilt as serial, specific, and cumulative, and recognition as not rescue",
        "The pastoral conventions of As You Like It",
        "The historical method of the Henry IV plays"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 176, anchor_line_end: 202
    },
    {
      kind: "inference",
      prompt: "When Richard says \"Is there a murderer here? No. Yes, I am: / Then fly. What, from myself?\" the syntactic feature most indicative of his breakdown is:",
      options: [
        "The use of short questions — rhetorical convention only",
        "The pronouns unravelling — \"myself, I myself, I, I\" — showing a self that can no longer sustain the coherent I of earlier acts",
        "The shift from iambic pentameter to prose",
        "The absence of biblical quotation"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 181, anchor_line_end: 187
    },
    {
      kind: "close_reading",
      prompt: "What is the paper Norfolk finds on his tent in the morning (263–265)?",
      options: [
        "A royal commission from Richard",
        "A jeering couplet: \"Jockey of Norfolk, be not too bold, / For Dickon thy master is bought and sold\" — warning Norfolk that Richard's army is betrayed",
        "A priest's absolution certificate",
        "A Welsh battle-song"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 263, anchor_line_end: 265
    }
  ];

  // ── 5.4 — The field. "A horse!" [TIER-1] ──────────────────────────────
  ANNOTATIONS.richard_iii_act5_scene4 = [
    {
      line_start: 7, line_end: 13,
      citation_display: cite("5.4", 7, 13),
      category: "thematic",
      title: "\"A horse! a horse!\" — restoring the line's weight",
      body: "The most famous line in Richard III is almost always quoted out of context. It is the death-scene. Richard has been unhorsed at Bosworth, his white Surrey has been killed, and he is fighting on foot in the centre of the battle. Catesby's preceding speech — \"The king enacts more wonders than a man... His horse is slain, and all on foot he fights\" — sets the military fact. Richard's offer \"my kingdom for a horse\" is not bluster; it is literal desperation. He is offering his entire claim to the throne for a remount to continue the fight. He is dead within minutes. Twentieth-century productions that have tried to play the line comically — with weary actors winking at the audience — have misread the scene. The line is tragic: a man who had schemed a kingdom reduced to trading it for transport. Restoring the line's seriousness is one of the play's most overdue critical adjustments.",
      sources: ["Jan Kott, Shakespeare Our Contemporary (1964)", "Stanley Wells, Shakespeare Survey 42 (1990)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 9, line_end: 12,
      citation_display: cite("5.4", 9, 12),
      category: "close_reading",
      title: "The gambler's heroism",
      body: "Richard's refusal of rescue — \"Slave, I have set my life upon a cast, / And I will stand the hazard of the die\" — converts his death-moment into a dice-table image. \"Cast\" is the throw of the die; \"hazard\" is the gambler's risk. The whole battle is a throw; he will see it through. The reference to \"six Richmonds in the field\" (historical: Richmond was deliberately decoyed by identically-armoured knights to confuse Richard's single-combat approach) reinforces the image of a desperate search by a man already half-dead. The repeated \"A horse! a horse! my kingdom for a horse!\" at line 13 — the exact line twice in eight lines — is not stuttering; it is the final cry of a man still trying to reach the target of his search. Then, stage direction-free, Richmond enters, and Richard is killed.",
      sources: ["Marjorie Garber, Shakespeare and Modern Culture (2008)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Charles Ross, Richard III (1981)"]
    }
  ];

  TRIALS.richard_iii_act5_scene4 = [
    {
      kind: "close_reading",
      prompt: "\"A horse! a horse! my kingdom for a horse!\" — what is the immediate dramatic context?",
      options: [
        "Richard is bargaining with a merchant for a prized stallion",
        "Richard has been unhorsed at Bosworth, his horse killed, and is fighting on foot in the centre of the battle — the line is literal desperation, not bluster",
        "Richard is on the coronation road, requiring a ceremonial mount",
        "Richard is mocking the low price of horses in Leicester market"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 4, anchor_line_end: 7
    },
    {
      kind: "theme",
      prompt: "Productions that have played \"A horse! a horse!\" comically (with weary winks at the audience) have done what?",
      options: [
        "Restored the line's original theatrical tone",
        "Misread the scene — the line is tragic, the cry of a man who had schemed a kingdom reduced to trading it for transport, dead within minutes",
        "Followed Shakespeare's authorial intention, as preserved in the First Folio stage directions",
        "Improved the line's reception by modern audiences"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 7, anchor_line_end: 13
    },
    {
      kind: "close_reading",
      prompt: "Richard's refusal of rescue — \"I have set my life upon a cast, / And I will stand the hazard of the die\" — uses what image?",
      options: [
        "A legal image from courtroom oath-taking",
        "A dice-table image — \"cast\" is the throw, \"hazard\" the gambler's risk; the whole battle is a throw and he will see it through",
        "A shipwreck image",
        "A biblical image from the Book of Job"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 9, anchor_line_end: 10
    },
    {
      kind: "historical",
      prompt: "\"I think there be six Richmonds in the field; / Five have I slain to-day instead of him.\" What does this refer to?",
      options: [
        "A rhetorical exaggeration with no historical basis",
        "The historical practice of decoying a commander with identically-armoured knights to confuse a single-combat approach — Richmond's men were so disguised at Bosworth",
        "Five sons of Richmond, each named after him",
        "A legend that Richmond had a twin brother"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 11, anchor_line_end: 12
    }
  ];

  // ── 5.5 — Another part of the field. The Tudor Myth ───────────────────
  ANNOTATIONS.richard_iii_act5_scene5 = [
    {
      line_start: 1, line_end: 7,
      citation_display: cite("5.5", 1, 7),
      category: "historical",
      title: "The crown from the dead temples",
      body: "Derby's line — \"Lo, here, this long-usurped royalty / From the dead temples of this bloody wretch / Have I pluck'd off, to grace thy brows withal\" — enacts a detail from the chronicle tradition: at Bosworth, Richard's crown was found on the battlefield (in a hawthorn bush, by later tradition) and placed on Richmond's head by Lord Stanley. The gesture is politically exact. Stanley's son George had been Richard's hostage; Stanley had refused to commit his forces until the battle turned; and now Stanley physically transfers the crown. The theatrical economy of the moment is its meaning: the man whose divided loyalty was the battle's hinge is the one who crowns Henry VII. The play does not comment on this arrangement. It lets us see it.",
      sources: ["Polydore Vergil, Anglica Historia (c. 1513)", "Charles Ross, Richard III (1981)", "Michael K. Jones and Malcolm G. Underwood, The King's Mother: Lady Margaret Beaufort, Countess of Richmond and Derby (1992)"]
    },
    {
      line_start: 18, line_end: 41,
      citation_display: cite("5.5", 18, 41),
      category: "historical",
      title: "The Tudor Myth and Henry VII's thin claim",
      body: "Richmond's closing speech declares the coming marriage to Elizabeth of York: \"We will unite the white rose and the red.\" The figure became the defining symbol of the Tudor dynasty — the red-and-white Tudor rose grafted together — and the theological framework for justifying the Tudor arrival is what modern scholarship calls the Tudor Myth. In this framework, the Wars of the Roses were divine punishment for Henry IV's usurpation of Richard II (1399); the Tudor accession was providential restoration. Shakespeare's entire first tetralogy (Henry VI Parts 1–3 and Richard III) is structured by this theology, most thoroughly argued by E. M. W. Tillyard in Shakespeare's History Plays (1944). What the Tudor Myth obscures is the thinness of Henry VII's own claim. Through his mother Margaret Beaufort he descended from John of Gaunt's third (legitimated) marriage via an illegitimate Beaufort line — weaker than Richard's under normal succession rules. Henry's claim at Bosworth was military, not dynastic. The marriage to Elizabeth of York repaired this retroactively. Richmond's speech is Shakespeare's clean summary of a complicated political theology; readers should know it is theology, not simple fact.",
      sources: ["E. M. W. Tillyard, Shakespeare's History Plays (1944)", "S. B. Chrimes, Henry VII (1972)", "Phyllis Rackin, Stages of History (1990)", "Polydore Vergil, Anglica Historia (c. 1513)"]
    },
    {
      line_start: 23, line_end: 34,
      citation_display: cite("5.5", 23, 34),
      category: "thematic",
      title: "\"England hath long been mad\" — the national self-diagnosis",
      body: "Richmond's diagnosis — \"England hath long been mad, and scarr'd herself; / The brother blindly shed the brother's blood, / The father rashly slaughter'd his own son, / The son, compell'd, been butcher to the sire\" — is Shakespeare's condensation of the whole first tetralogy into four lines. Every catastrophe named here appeared somewhere in the Henry VI plays: the father-son killings on the battlefield at Towton (3 Henry VI 2.5), the long fratricidal violence of the York-Lancaster cycle. Shakespeare is speaking to the audience in the theatre that has just watched the whole cycle: this is what we have been showing you. Richmond's prayer that his heirs may \"Enrich the time to come with smooth-faced peace\" is both the Tudor theology and the Elizabethan political hope. Elizabeth I was Henry VII's granddaughter, ruling when this play was written (c. 1592–3). Richmond's prayer is, in its way, Shakespeare's political acknowledgement of his own patron-queen.",
      sources: ["E. M. W. Tillyard, Shakespeare's History Plays (1944)", "Paola Pugliatti, Shakespeare the Historian (1996)", "Phyllis Rackin, Stages of History (1990)"]
    },
    {
      line_start: 35, line_end: 41,
      citation_display: cite("5.5", 35, 41),
      category: "historical",
      title: "\"Abate the edge of traitors\" and the Tudor anxiety",
      body: "Richmond's closing prayer for the abatement of future traitors — \"Let them not live to taste this land's increase / That would with treason wound this fair land's peace!\" — registers a specifically Tudor anxiety. The dynasty Henry VII founded remained insecure for decades: rebellions in 1486 (Lovell, Stafford), the Simnel affair (1487), the Warbeck affair (1491–99), and continuing plots into Henry VIII's reign made \"treason\" the period's master-category for political disorder. The 1352 Statute of Treasons and the Tudor elaborations of it (especially 1534 under Henry VIII) made treason prosecution the Crown's primary instrument of self-preservation. Shakespeare writing in the 1590s — with the Essex crisis building, the succession question unresolved, and treason trials a regular feature of political life — has Richmond pray for the specific thing his descendants continue to need. The Tudor Myth closes the play; the Tudor security-apparatus is already in force in the prayer's vocabulary.",
      sources: ["John Bellamy, The Tudor Law of Treason (1979)", "Wallace MacCaffrey, Elizabeth I (1993)", "Richard Hillman, Shakespearean Subversions (1992)"]
    }
  ];

  TRIALS.richard_iii_act5_scene5 = [
    {
      kind: "historical",
      prompt: "Richmond's declaration \"We will unite the white rose and the red\" refers to what?",
      options: [
        "A new university college to be founded at Oxford",
        "The marriage of Richmond (Lancaster) to Elizabeth of York, producing the Tudor rose — the dynasty's defining symbol and the political theology of the \"Tudor Myth\"",
        "A specific agricultural innovation of the Tudor period",
        "The union of two knightly orders"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 18, anchor_line_end: 19
    },
    {
      kind: "historical",
      prompt: "What is the historical strength of Henry VII's own dynastic claim?",
      options: [
        "It was legally unimpeachable through the male Lancastrian line",
        "It was thin — through the illegitimate (later legitimated) Beaufort line, weaker than Richard's under normal succession; his claim at Bosworth was military, and the marriage to Elizabeth of York repaired it retroactively",
        "He held the throne by papal appointment",
        "He was Richard III's designated heir"
      ],
      answer_index: 1,
      wisdom_reward: 30,
      anchor_line_start: 29, anchor_line_end: 31
    },
    {
      kind: "theme",
      prompt: "The \"Tudor Myth\" as a political theology argues what?",
      options: [
        "That the Tudors descended directly from King Arthur",
        "That the Wars of the Roses were divine punishment for Henry IV's usurpation of Richard II (1399), and the Tudor accession was providential restoration — the framework underlying Shakespeare's entire first tetralogy",
        "That Richmond was born of a virgin",
        "That Bosworth was fought under a miraculous sign in the sky"
      ],
      answer_index: 1,
      wisdom_reward: 30,
      anchor_line_start: 18, anchor_line_end: 34
    },
    {
      kind: "structural",
      prompt: "Richmond's \"England hath long been mad, and scarr'd herself\" speech condenses what?",
      options: [
        "Current events of the 1590s",
        "Shakespeare's entire first tetralogy (Henry VI 1–3 and Richard III) into four lines — the cycle of fratricidal violence the audience has just watched",
        "A single battle between two English armies",
        "A specific biblical passage on civil strife"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 23, anchor_line_end: 28
    },
    {
      kind: "historical",
      prompt: "Stanley (Derby) physically removes Richard's crown and places it on Richmond's head — a detail drawn from what?",
      options: [
        "Shakespeare's invention for the scene",
        "The chronicle tradition: at Bosworth, Richard's crown was recovered from the battlefield (by tradition, from a hawthorn bush) and placed on Richmond by Lord Stanley — whose divided loyalty had been the battle's hinge",
        "A ceremonial rubric from the English coronation liturgy",
        "A specific vision granted to Richmond in his dream"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 4, anchor_line_end: 7
    }
  ];

};
