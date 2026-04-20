/**
 * Richard III — Act III annotations and Trials.
 * One Tier-1 scene: 3.7 (the staged-reluctance-between-two-clergymen
 * scene with "Two props of virtue for a Christian prince"). 3.1–3.6
 * trace the rising Hastings arc, the Pomfret execution, and the
 * scrivener's clear-eyed view of the fraud. Moderate annotation load.
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

  // ── 3.1 — The streets. The prince arrives, York joins him ─────────────
  ANNOTATIONS.richard_iii_act3_scene1 = [
    {
      line_start: 44, line_end: 56,
      citation_display: cite("3.1", 44, 56),
      category: "historical",
      title: "\"Sanctuary children\" — Buckingham's innovation",
      body: "Buckingham's argument that Prince York can be taken from Westminster sanctuary because \"sanctuary children\" are a novel and unsupportable category is dramaturgically audacious and historically consequential. The right of sanctuary at Westminster Abbey, established by Edward the Confessor's charter and confirmed by successive kings, was a live and contested legal question in 1483. The Cardinal's hesitation (\"God in heaven forbid / We should infringe the holy privilege / Of blessed sanctuary!\") represents the orthodox position; Buckingham's counter that only those with \"wit to claim\" the place can hold it overturns centuries of precedent. Historically the boy was indeed removed from sanctuary under these arguments, a decision that led directly to the princes' deaths in the Tower. Shakespeare compresses the theological and legal dispute into eight lines and lets Buckingham win — because the argument's success on the stage is the fact that produces the murder.",
      sources: ["Thomas More, History of King Richard III (c. 1513)", "Charles Ross, Richard III (1981)", "A. R. Myers, England in the Late Middle Ages (1952)"]
    },
    {
      line_start: 79, line_end: 94,
      citation_display: cite("3.1", 79, 94),
      category: "close_reading",
      title: "\"So wise so young, they say, do never live long\"",
      body: "Richard's aside as the young prince reflects on history — \"So wise so young, they say, do never live long\" — is the play's most chilling aphoristic sentence of prediction. The young Edward V has just delivered a compressed meditation on historical memory: Julius Caesar's wit set down his valour to make it \"live,\" so death \"makes no conquest of this conqueror.\" The speech is a twelve-year-old's theory of posterity, and it is well done. Richard's response is to note that children who speak like this are marked. The aside is then doubled a moment later when Gloucester tells the audience directly — in a further aside — that he speaks \"like the formal vice, Iniquity / I moralize two meanings in one word.\" The self-naming as Vice-figure is explicit, and it is paired with a line that functions as the boy's death-sentence.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Bernard Spivack, Shakespeare and the Allegory of Evil (1958)"]
    },
    {
      line_start: 100, line_end: 135,
      citation_display: cite("3.1", 100, 135),
      category: "structural",
      title: "York's wit and the play's rehearsal of the princes' intelligence",
      body: "The exchange between Richard and the Duke of York is a deliberate showcase: Shakespeare makes the younger prince, like the elder, visibly clever. York teases Richard about his dagger, about small herbs and great weeds (turning Richard's own 2.4 proverb back on him), and about being carried like an ape on shoulders. Buckingham's aside — \"So cunning and so young is wonderful\" — is the scene's most quietly devastating line. In a court where political survival depends on obscurity, these boys have shown themselves brilliantly in conversation. The scene thereby completes the indictment implicit in 2.4: the princes are too conspicuous to survive. Richard's plan, announced to Buckingham and Catesby in the remainder of the scene, is the logical consequence of a political order in which a clever child is a threat.",
      sources: ["Ann Blake, \"Children and Suffering in Shakespeare's Plays\" (1998)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
    {
      line_start: 188, line_end: 197,
      citation_display: cite("3.1", 188, 197),
      category: "thematic",
      title: "\"Chop off his head\" — the casualness of the new regime",
      body: "Richard's instruction to Buckingham about Hastings — \"Chop off his head, man; somewhat we will do\" — is the play's bluntest sentence of political killing, and its placement is deliberate. We have just watched Richard charm and condescend to two boys in measured iambs; he pivots to casual dismembership in a single line. The tonal whiplash is the characterization. Richard governs by emotional range: tenderness, legalism, piety, mock-humility, and dismissal each available at will. The command's casualness — \"somewhat we will do\" — is what marks the new regime. Kingship under Edward IV had required ceremony; Richard has stripped ceremony from the act of killing while preserving it for public display. This is the play's theory of tyranny in miniature.",
      sources: ["A. P. Rossiter, Angel with Horns (1961)", "Stephen Greenblatt, Tyrant: Shakespeare on Politics (2018)"]
    }
  ];

  TRIALS.richard_iii_act3_scene1 = [
    {
      kind: "historical",
      prompt: "Buckingham's argument that the young Duke of York can be removed from Westminster sanctuary because he is a child turns on what claim?",
      options: [
        "That no sanctuary has ever existed in English law",
        "That sanctuary protects only adults with \"the wit to claim\" it, making \"sanctuary children\" a novel category without legal precedent",
        "That Westminster Abbey has lost its sanctuary privilege under a recent statute",
        "That the boy is not in fact in sanctuary because he has already left the grounds"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 48, anchor_line_end: 56
    },
    {
      kind: "close_reading",
      prompt: "Richard's aside \"So wise so young, they say, do never live long\" functions as what?",
      options: [
        "An idle proverbial observation with no plot consequence",
        "A death-sentence delivered in the form of aphorism — Richard predicting (and effectively confirming) the boy's fate",
        "A genuine expression of concern for his nephew's health",
        "A prayer that the prince be long-lived"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 79, anchor_line_end: 79
    },
    {
      kind: "comprehension",
      prompt: "Which figure does Gloucester explicitly compare himself to in his aside?",
      options: [
        "The Roman general Coriolanus",
        "The \"formal Vice, Iniquity\" of the old morality plays, who \"moralizes two meanings in one word\"",
        "The biblical Cain",
        "The conqueror Tamerlane"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 82, anchor_line_end: 83
    },
    {
      kind: "theme",
      prompt: "The princes' visible cleverness in this scene serves what dramatic function?",
      options: [
        "It establishes them as comic relief before the tragic turn",
        "It completes the indictment begun in 2.4: the boys are too conspicuous to survive in Richard's political order",
        "It suggests they will outwit Richard in a later scene",
        "It demonstrates the high quality of Tudor royal education"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 100, anchor_line_end: 135
    },
    {
      kind: "close_reading",
      prompt: "Richard's line \"Chop off his head, man; somewhat we will do\" about Hastings achieves what tonal effect?",
      options: [
        "It is a quotation from a legal statute",
        "Tonal whiplash: the measured iambs of the prior exchange pivot to casual dismembership, revealing a regime in which killing requires no ceremony",
        "A misheard line that the audience would have mistaken for courtly politeness",
        "An attempt at humour to defuse tension"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 190, anchor_line_end: 190
    }
  ];

  // ── 3.2 — Before Hastings' house. Stanley's warning ───────────────────
  ANNOTATIONS.richard_iii_act3_scene2 = [
    {
      line_start: 1, line_end: 31,
      citation_display: cite("3.2", 1, 31),
      category: "close_reading",
      title: "Stanley's boar-dream as political reading",
      body: "Stanley sends his messenger to Hastings at four in the morning with a reading of a dream: \"the boar had razed his helm.\" The boar is Richard's heraldic badge (the white boar of Gloucester), and the image of a boar removing a helmet — i.e., exposing the head — is a direct warning of decapitation. Stanley asks Hastings to flee north with him. Hastings dismisses the dream with the characteristic Elizabethan scepticism toward oneiromancy (\"I wonder he is so fond / To trust the mockery of unquiet slumbers\") and adds the fatal second argument: to run from the boar is to invite pursuit. The logic is sound in general, wrong in this case. Hastings has misread what kind of play he is in. Shakespeare gives the reader the epistemological joke: dream-reading and political intuition converge in this play, and dismissing either costs Hastings his head before evening.",
      sources: ["Marjorie Garber, Dream in Shakespeare (1974)", "Keith Thomas, Religion and the Decline of Magic (1971)"]
    },
    {
      line_start: 41, line_end: 69,
      citation_display: cite("3.2", 41, 69),
      category: "thematic",
      title: "Hastings' one line he will not cross",
      body: "Catesby probes Hastings on whether he will support Richard's claim to the crown, and Hastings draws the line exactly where we expect him to: \"I'll have this crown of mine cut from my shoulders / Ere I will see the crown so foul misplaced.\" The line is principled and self-aware: Hastings knows what he is saying, knows he is marking himself as obstacle, and says it anyway. The scene thus portrays a figure who is not simply a Richard-type careerist but a courtier with a limit. His subsequent miscalculation is not a failure of principle but of recognition: having drawn the line, he thinks he remains safe because the queen's kindred (his old enemies) are being executed at Pomfret that same day. He cannot hold two political logics at once — Richard's killing of the queen's men and Richard's coming killing of him — and the scene lets the audience see the cognitive trap.",
      sources: ["A. P. Rossiter, Angel with Horns (1961)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
    {
      line_start: 104, line_end: 117,
      citation_display: cite("3.2", 104, 117),
      category: "close_reading",
      title: "The priest, the pursuivant, and Buckingham's joke",
      body: "The scene closes with Hastings' trio of encounters: a pursuivant (junior court officer), a priest (\"Sir John\"), and Buckingham, each greeted with increasing cheer. Hastings is, at this moment, the most confident man in England. Buckingham's aside — \"Your honour hath no shriving work in hand\" — is a black joke turning on the Catholic sacrament of confession (\"shriving\"). Hastings dismisses the priest as unneeded; Buckingham silently marks the irony that Hastings will need a priest urgently within hours. The scene uses minor functionaries — pursuivant, priest — as choric witnesses to Hastings' fatal unknowing. Shakespeare learned this technique from Christopher Marlowe (who used small characters to frame large falls in Edward II), but Richard III refines it into the play's signature rhythm.",
      sources: ["Nicholas Brooke, Shakespeare's Early Tragedies (1968)", "Jonathan Bate, The Genius of Shakespeare (1997)"]
    }
  ];

  TRIALS.richard_iii_act3_scene2 = [
    {
      kind: "close_reading",
      prompt: "What does Stanley's dream about \"the boar\" and \"his helm\" warn of?",
      options: [
        "A hunting accident",
        "Decapitation: the boar is Richard's heraldic badge, and a boar removing a helmet pictures a head exposed",
        "A betrayal by a stable-hand",
        "A failed military campaign"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 8, anchor_line_end: 8
    },
    {
      kind: "inference",
      prompt: "Why does Hastings refuse to flee north with Stanley?",
      options: [
        "He is loyal to the crown and will not abandon his post",
        "He distrusts dream-reading generally, and reasons that fleeing the boar would invite pursuit — sound logic misapplied to this specific situation",
        "He has been promised lands if he remains",
        "He is physically unable to travel"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 22, anchor_line_end: 30
    },
    {
      kind: "theme",
      prompt: "When Hastings tells Catesby \"I'll have this crown of mine cut from my shoulders / Ere I will see the crown so foul misplaced,\" what is the dramatic function of the line?",
      options: [
        "An idle hyperbole without consequence",
        "A principled refusal — Hastings draws the one line he will not cross, and the play immediately makes that line his death-warrant",
        "A promise to fight Richard in single combat",
        "A legal objection to Buckingham's proposal"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 40, anchor_line_end: 41
    },
    {
      kind: "close_reading",
      prompt: "Buckingham's aside to Hastings — \"Your honour hath no shriving work in hand\" — puns on what?",
      options: [
        "The medieval tradition of trial by combat",
        "The Catholic sacrament of confession (\"shriving\") — Hastings will in fact need a priest urgently within hours",
        "The legal requirement for witnesses at an execution",
        "A specific guild's ceremony of initiation"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 110, anchor_line_end: 110
    }
  ];

  // ── 3.3 — Pomfret. Rivers, Grey, Vaughan executed ─────────────────────
  ANNOTATIONS.richard_iii_act3_scene3 = [
    {
      line_start: 1, line_end: 25,
      citation_display: cite("3.3", 1, 25),
      category: "historical",
      title: "Pomfret and the ghosts of Richard II",
      body: "Rivers' apostrophe — \"O Pomfret, Pomfret! O thou bloody prison, / Fatal and ominous to noble peers!\" — invokes Pontefract Castle's long history as a royal slaughterhouse. Most pointedly, Richard II was imprisoned and murdered there in 1400, as dramatized in Shakespeare's own Richard II. Shakespeare cross-references his own play: the Yorkist murder of the Lancastrian king Henry VI (Tower, 1471) and the usurper Richard III's murder of Yorkist allies at Pomfret (1483) rhyme with the original sin of the cycle — Henry Bolingbroke's murder of Richard II at the same place. Pomfret is the Tudor Myth's master-location. Rivers names it consciously, and the scene gives Grey the play's first confirmation of Margaret's curse (\"Now Margaret's curse is fall'n upon our heads / For standing by when Richard stabb'd her son\"). The curse's machinery is now public to its victims.",
      sources: ["E. M. W. Tillyard, Shakespeare's History Plays (1944)", "John Jowett, The Oxford Shakespeare: Richard III (2000)", "Raphael Holinshed, Chronicles (1587)"]
    },
    {
      line_start: 15, line_end: 25,
      citation_display: cite("3.3", 15, 25),
      category: "structural",
      title: "Margaret's curse confirmed — the play begins its reckoning",
      body: "Grey's line — \"Now Margaret's curse is fall'n upon our heads, / For standing by when Richard stabb'd her son\" — is the first explicit confirmation within the play that Margaret's 1.3 cursing-speech was prophetic. The structural move is precise. Margaret cursed Rivers, Dorset, and Hastings (1.3.206–210); Rivers and Grey die here, Hastings dies at 3.4, Buckingham will die at 5.1 quoting her, and Richard dies at 5.4/5.5. The play's curse-mechanism becomes audible to its victims just before it kills them. Shakespeare is dramatizing prophecy as political epistemology: curses are real because historical violence accumulates as debt, and the debt is paid on schedule. Whether this is theology, dramaturgy, or both is a question the play does not settle. What the play demonstrates is that the curse-structure works.",
      sources: ["Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "A. P. Rossiter, Angel with Horns (1961)"]
    }
  ];

  TRIALS.richard_iii_act3_scene3 = [
    {
      kind: "historical",
      prompt: "Why does Rivers call Pomfret Castle \"fatal and ominous to noble peers\"?",
      options: [
        "Because of its location near the Scottish border",
        "Because Richard II was imprisoned and murdered there in 1400 — Shakespeare's own Richard II cross-referenced here",
        "Because it was built on the site of a Roman massacre",
        "Because of an ancient curse laid upon it by the druids"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 9, anchor_line_end: 12
    },
    {
      kind: "structural",
      prompt: "Grey's line \"Now Margaret's curse is fall'n upon our heads\" marks what moment in the play's architecture?",
      options: [
        "A casual retrospective allusion",
        "The first explicit confirmation inside the play that Margaret's 1.3 curses are prophetic — her curse-mechanism becomes audible to its victims just before it kills them",
        "The beginning of a new subplot unrelated to Margaret",
        "The moment Margaret herself returns to the stage"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 15, anchor_line_end: 19
    }
  ];

  // ── 3.4 — The Tower. Hastings arrested ────────────────────────────────
  ANNOTATIONS.richard_iii_act3_scene4 = [
    {
      line_start: 31, line_end: 48,
      citation_display: cite("3.4", 31, 48),
      category: "historical",
      title: "The strawberries of Ely Place, and the trap",
      body: "Richard's apparent non sequitur — \"When I was last in Holborn, / I saw good strawberries in your garden there: / I do beseech you send for some of them\" — is one of Shakespeare's most quoted off-kilter moments, and it is inherited directly from Thomas More's History, where the detail is recorded verbatim as from eyewitness testimony. The Bishop of Ely's town palace in Holborn had famous strawberry gardens. Shakespeare uses the historical detail to construct a theatrical trap: Richard ambles into the council meeting cheerful and inconsequent, exits briefly (ostensibly to fetch strawberries), and returns moments later to accuse Hastings of witchcraft and order his head. The strawberries serve as cover for Richard's consultation with Buckingham — and as a signal to the audience that the council's apparent ordinariness is a stage set for murder.",
      sources: ["Thomas More, History of King Richard III (c. 1513)", "John Jowett, The Oxford Shakespeare: Richard III (2000)", "Charles Ross, Richard III (1981)"]
    },
    {
      line_start: 49, line_end: 59,
      citation_display: cite("3.4", 49, 59),
      category: "thematic",
      title: "Hastings' last and worst judgement",
      body: "Hastings' speech immediately before his accusation — \"His grace looks cheerfully and smooth to-day... / For by his face straight shall you know his heart\" — is one of Shakespeare's great ironies, and it registers as tragedy rather than simple dramatic irony because Hastings is not stupid. He has read Richard's face and trusted the reading. The play's claim is that this reading-method cannot work with Richard, whose face is a deliberate instrument. Hastings' confidence is the precise trap the play has been setting since 1.3. Derby's quiet counter-line — \"I pray God he be not, I say\" — is the only honest response Hastings' blindness permits. The audience, again, knows more than the stage: we have watched Richard give Catesby his orders about Hastings in 3.1. The scene demonstrates that political experience is no defence against Richard's mode of dissimulation.",
      sources: ["Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 60, line_end: 80,
      citation_display: cite("3.4", 60, 80),
      category: "historical",
      title: "The withered arm: staging the impossible charge",
      body: "Richard's production of his \"blasted sapling, wither'd up\" arm, blamed on Elizabeth and Jane Shore's witchcraft, enacts on stage what More reports as the scene's central spectacle. Two things are going on at once. First, everyone present knows that Richard's arm has always been as it is; the \"withering\" is not new. Second, Richard's point is precisely that the charge need not be plausible. What he needs is a pretext sufficient to move immediately. Hastings' \"If they have done this thing, my gracious lord —\" is the word that dooms him: the conditional \"if\" is treated as treason, because Richard has decided the accusation is not a claim but an instruction. Shakespeare is showing a show-trial in miniature. The charge is not a theory of what happened; it is a theory of what will happen, stated backward.",
      sources: ["Thomas More, History of King Richard III (c. 1513)", "Stephen Greenblatt, Tyrant: Shakespeare on Politics (2018)", "Charles Ross, Richard III (1981)"]
    },
    {
      line_start: 95, line_end: 108,
      citation_display: cite("3.4", 95, 108),
      category: "close_reading",
      title: "\"Momentary grace of mortal men\"",
      body: "Hastings' final soliloquy — \"O momentary grace of mortal men, / Which we more hunt for than the grace of God!\" — is the play's first fully articulated moral retrospect. The drunken-sailor-on-a-mast image compresses the court-life critique into a seafarer's emblem: those who build their hopes on a monarch's favourable looks live without stable footing. The speech is also, structurally, an echo of Clarence's dream-speech in 1.4 — another figure about to die, pulled from confidence to drowning. Shakespeare is quietly repeating forms: the self-conscious fall-speech becomes a convention the play establishes now and exploits later. Buckingham in 5.1 and Richard himself in 5.3 will each, in different ways, deliver versions of this retrospect.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    }
  ];

  TRIALS.richard_iii_act3_scene4 = [
    {
      kind: "historical",
      prompt: "Richard's request for strawberries from the Bishop of Ely's garden is drawn from what source?",
      options: [
        "Shakespeare's invention, unsupported by chronicle",
        "Thomas More's History of King Richard III, which reports the detail from eyewitness testimony",
        "Holinshed, but without More's authority",
        "A forged document from the Cromwell era"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 33, anchor_line_end: 35
    },
    {
      kind: "inference",
      prompt: "Hastings says of Richard \"For by his face straight shall you know his heart.\" The line's tragic irony is that:",
      options: [
        "It is a deliberate lie Hastings tells to flatter Richard",
        "Hastings' reading-method, sound in general, fails with Richard, whose face is a deliberate instrument of dissimulation",
        "It is a mistranslation of a Latin commonplace",
        "Hastings is referring to a different person, not Richard"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 54, anchor_line_end: 54
    },
    {
      kind: "close_reading",
      prompt: "Richard's charge that Jane Shore and Elizabeth have withered his arm by witchcraft serves what rhetorical purpose?",
      options: [
        "An earnest medical diagnosis",
        "An instruction disguised as accusation — Richard does not need the charge to be plausible, only sufficient to move against Hastings immediately",
        "A standard legal procedure for treason trials",
        "A ploy to gain sympathy from the council"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 68, anchor_line_end: 77
    },
    {
      kind: "close_reading",
      prompt: "Hastings' line \"O momentary grace of mortal men, / Which we more hunt for than the grace of God!\" is structurally what?",
      options: [
        "A comic aside",
        "The play's first fully articulated moral retrospect, establishing a convention the play will reuse in Buckingham's 5.1 and Richard's 5.3 speeches",
        "A biblical quotation",
        "A private confession meant only for his own ear"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 97, anchor_line_end: 98
    }
  ];

  // ── 3.5 — The Tower walls. The mayor ──────────────────────────────────
  ANNOTATIONS.richard_iii_act3_scene5 = [
    {
      line_start: 1, line_end: 12,
      citation_display: cite("3.5", 1, 12),
      category: "structural",
      title: "The play explicitly names itself as theatre",
      body: "Richard's opening line — \"Come, cousin, canst thou quake, and change thy colour, / Murder thy breath in the middle of a word\" — and Buckingham's reply (\"I can counterfeit the deep tragedian\") is one of the most bald metatheatrical exchanges in all of Shakespeare. The two leading villains are here directly discussing their own craft as actors. Buckingham's self-description — tremble and start at wagging of a straw, ghastly looks at my service, enforced smiles — is a textbook for the Elizabethan tragedian. Shakespeare is doing something striking: he is letting his villains announce that the whole political spectacle they are staging is theatre. The scene self-consciously rehearses for the Mayor's benefit what it in fact is for us: a play. The distance between Richard's public performance and Richard's private self is not concealed from the audience — it is dramatized.",
      sources: ["Anne Righter, Shakespeare and the Idea of the Play (1962)", "Robert Weimann, Shakespeare and the Popular Tradition in the Theater (1967)"]
    },
    {
      line_start: 68, line_end: 107,
      citation_display: cite("3.5", 68, 107),
      category: "historical",
      title: "Doctor Shaw, Friar Penker, and the bastardy campaign",
      body: "Richard's instructions to Buckingham — \"Go, Lovel, with all speed to Doctor Shaw; / To Catesby. Go thou to Friar Penker\" — name two historical propagandists. Ralph Shaw (the \"Doctor\" of divinity) preached at Paul's Cross on 22 June 1483 that Edward IV's children were illegitimate (arguing that Edward had been pre-contracted to Eleanor Butler before marrying Elizabeth Woodville). John Penker, provincial of the Augustinian friars, preached similar arguments. The sermon-campaign was the theological-legal groundwork for Richard's accession ten days later. Shakespeare compresses the campaign into a few stage-lines, but the detail is exact. What the play makes dramatically visible is the machinery: Buckingham delivers the propaganda at Guildhall (reported back in 3.7); clergymen stand ostentatiously next to Richard during the staged-reluctance tableau. Legitimacy is being manufactured in public view.",
      sources: ["Charles Ross, Richard III (1981)", "Rosemary Horrox, Richard III: A Study of Service (1989)", "Michael Hicks, Richard III (2000)"]
    }
  ];

  TRIALS.richard_iii_act3_scene5 = [
    {
      kind: "structural",
      prompt: "When Buckingham claims he can \"counterfeit the deep tragedian,\" what is the scene doing dramaturgically?",
      options: [
        "Breaking down — the actors have lost their lines",
        "Explicitly naming itself as theatre — the villains are discussing their own acting craft in front of the audience",
        "Introducing a minor character (the tragedian) who will later speak",
        "Citing a specific contemporary actor of the Lord Chamberlain's Men"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 5, anchor_line_end: 11
    },
    {
      kind: "historical",
      prompt: "Who are Doctor Shaw and Friar Penker, sent for at this scene's end?",
      options: [
        "Fictional comic characters invented by Shakespeare",
        "Historical clergymen who preached sermons arguing for Edward IV's children's illegitimacy — the theological groundwork for Richard's claim",
        "Disguised officers of Richmond's intelligence service",
        "Rival candidates for the see of Canterbury"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 101, anchor_line_end: 103
    }
  ];

  // ── 3.6 — A street. The scrivener ─────────────────────────────────────
  ANNOTATIONS.richard_iii_act3_scene6 = [
    {
      line_start: 1, line_end: 14,
      citation_display: cite("3.6", 1, 14),
      category: "structural",
      title: "The scrivener as one-scene truth-teller",
      body: "The scrivener's fourteen-line scene is the shortest in the play and one of its most precisely calibrated. A legal scribe, alone, explains that the indictment against Hastings was drawn up before Hastings was accused, that the precedent (draft) took as long as the fair copy, and that the whole operation is a \"palpable device.\" The word \"palpable\" is key — the fraud is not subtle, it is obvious to anyone who handles the paper. The scrivener's closing couplet — \"Bad is the world; and all will come to nought, / When such bad dealings must be seen in thought\" — is a choric judgement from a minor character whose profession gives him uniquely reliable access to the regime's documentary practice. Shakespeare keeps moral clarity alive in the play by distributing it across scenes and minor voices. The scrivener will not appear again; his sentence is the whole scene.",
      sources: ["Phyllis Rackin, Stages of History (1990)", "Paola Pugliatti, Shakespeare the Historian (1996)"]
    }
  ];

  TRIALS.richard_iii_act3_scene6 = [
    {
      kind: "comprehension",
      prompt: "What does the scrivener reveal about the indictment against Hastings?",
      options: [
        "That it is legally sound",
        "That it was drafted before Hastings was ever accused — it is a \"palpable device\" visible to anyone handling the document",
        "That Hastings himself had signed it in advance",
        "That the charges are limited to minor offences"
      ],
      answer_index: 1,
      wisdom_reward: 15,
      anchor_line_start: 5, anchor_line_end: 10
    },
    {
      kind: "structural",
      prompt: "The scrivener's fourteen-line scene functions as what?",
      options: [
        "Accidental material, carried over from an earlier draft",
        "A choric judgement from a minor professional voice — moral clarity distributed to a figure with uniquely reliable access to the regime's paperwork",
        "A piece of comic relief without dramatic purpose",
        "A digression on Elizabethan legal practice"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 14
    }
  ];

  // ── 3.7 — Baynard's Castle. The staged reluctance [TIER-1] ────────────
  ANNOTATIONS.richard_iii_act3_scene7 = [
    {
      line_start: 1, line_end: 42,
      citation_display: cite("3.7", 1, 42),
      category: "structural",
      title: "Buckingham reports failure — and the scene's hinge",
      body: "The scene opens with Buckingham's account of what just failed: the Guildhall audience refused to acclaim Richard king. Buckingham laid out the entire propaganda package — Edward IV's pre-contract with Lady Lucy, his marriage-by-proxy to Bona of Savoy, his sexual predation on city wives, his own supposed illegitimacy (an extraordinary slander of Richard's own mother), and Richard's personal virtues (Scottish campaign, discipline, bounty) — and was met with \"dumb statuas.\" Only ten voices cried \"God save King Richard!\" and those were Buckingham's own followers planted at the lower end of the hall. The first conclusion the scene reaches is political: Richard's coup does not have public consent. The second conclusion is theatrical: if consent cannot be won, it must be staged. The remainder of the scene is that staging.",
      sources: ["Charles Ross, Richard III (1981)", "Rosemary Horrox, Richard III: A Study of Service (1989)", "Thomas More, History of King Richard III (c. 1513)"]
    },
    {
      line_start: 44, line_end: 55,
      citation_display: cite("3.7", 44, 55),
      category: "close_reading",
      title: "Buckingham's stage-directions spoken aloud",
      body: "Buckingham's instructions to Richard are as frank as theatrical direction can be: intend some fear, be not easily won, play the maid's part still answer nay and take it, get a prayer-book, stand betwixt two churchmen. Shakespeare lets Buckingham narrate the coming scene to Richard before they stage it for the Mayor. The maid's-part line — \"Play the maid's part, still answer nay, and take it\" — is one of the most corrosive single sentences in English political theatre. The simile's gender is not accidental. The staging of pretended reluctance is explicitly likened to scripted seduction: a woman who says no while yielding, a script designed so that the refusal itself is the invitation. Richard will accept the crown the way (Buckingham says) women accept suitors. Politics and seduction are made grammatically identical.",
      sources: ["Madonne M. Miner, \"'Neither mother, wife, nor England's queen'\" (1980)", "Janet Adelman, Suffocating Mothers (1992)", "Stephen Greenblatt, Shakespearean Negotiations (1988)"]
    },
    {
      line_start: 88, line_end: 99,
      citation_display: cite("3.7", 88, 99),
      category: "thematic",
      title: "\"Two props of virtue for a Christian prince\"",
      body: "The tableau's peak: Buckingham points to Richard standing between two bishops with a prayer book in his hand and says \"Two props of virtue for a Christian prince, / To stay him from the fall of vanity.\" The line works three ways simultaneously. First, it is straight propaganda — Buckingham is selling Richard to the Mayor. Second, it is explicit theatre — the audience knows the bishops are props, the book a prop, the piety a performance. Third, it is bitterly ironic — the actual historical Richard III was a deeply pious man by the standards of his period, and Shakespeare's scene nevertheless asks us to read all his piety as performance. The play makes no room for sincere Ricardian religion. What Shakespeare wants us to see is how completely piety can be weaponized as cover, regardless of the underlying state of the actor's soul.",
      sources: ["Anne Sutton, \"'A curious searcher for our weal public': Richard III, piety, chivalry and the concept of the 'good prince'\" (1986)", "Charles Ross, Richard III (1981)", "A. P. Rossiter, Angel with Horns (1961)"]
    },
    {
      line_start: 137, line_end: 169,
      citation_display: cite("3.7", 137, 169),
      category: "close_reading",
      title: "Richard's speech of refusal, which is his acceptance",
      body: "Richard's long refusal-speech (137–169) is rhetorically astonishing. He divides his response into a precise rhetorical quadrant — to speak is ungracious, not to speak looks like tongue-tied acceptance; to reprove is to scold his friends, to accept is unworthy. Having announced the dilemma, he refuses the crown on grounds of personal unworthiness (\"my poverty of spirit,\" \"mighty and so many my defects\") and on grounds of legitimate succession (\"The royal tree hath left us royal fruit\" — i.e., the prince should inherit). Both reasons are false. The speech works because each is individually plausible; the combined effect is to make acceptance, when it comes, look like the regrettable overriding of personal scruple by public duty. Shakespeare is dramatizing the specific structure by which illegitimate power claims legitimacy through theatre.",
      sources: ["Brian Vickers, The Artistry of Shakespeare's Prose (1968)", "A. P. Rossiter, Angel with Horns (1961)", "Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)"]
    },
    {
      line_start: 170, line_end: 210,
      citation_display: cite("3.7", 170, 210),
      category: "historical",
      title: "The pre-contract argument and its legal weight",
      body: "Buckingham's legal argument that Edward IV's marriage to Elizabeth Woodville was invalid — because Edward had been pre-contracted to Lady Lucy and had a marriage-by-proxy to Bona of Savoy, making his subsequent marriage bigamous — is drawn from the historical petition Titulus Regius (January 1484), which formally declared Richard III legitimate king. The pre-contract doctrine (matrimonium per verba de praesenti, followed by intercourse, created indissoluble marriage) was live canon law, and the Eleanor Butler pre-contract (substituted historically for the \"Lady Lucy\" Shakespeare gives) was the actual legal basis. Historians continue to debate whether any pre-contract actually existed or whether Richard's regime manufactured the evidence. Shakespeare's scene keeps the audience aware that the argument has legal form while making us see its propagandistic function. The two are simultaneously true: the claim is both legally articulated and politically engineered.",
      sources: ["Titulus Regius (1484)", "Charles Ross, Richard III (1981)", "Michael Hicks, Richard III (2000)", "R. H. Helmholz, \"The Sons of Edward IV\" (1986)"]
    },
    {
      line_start: 212, line_end: 230,
      citation_display: cite("3.7", 212, 230),
      category: "thematic",
      title: "Buckingham's ultimatum and Richard's \"yielding\"",
      body: "The scene's resolution depends on Buckingham's threat: if Richard will not accept, we will \"plant some other in the throne, / To the disgrace and downfall of your house.\" The threat is the mechanism by which Richard can accept without appearing to have wanted to. Richard's line — \"I am not made of stones, / But penetrable to your kind entreats, / Albeit against my conscience and my soul\" — completes the scripted seduction Buckingham named earlier: he lets himself be pierced by the request. The final acclamation (\"Long live Richard, England's royal king!\") follows in a single line. The scene has taken 226 lines to produce a single formal result — a coronation date — but the production has mattered more than the result. The play now gives us a king acclaimed, however theatrically, and the coming scenes will test whether the theatricality can be extended into governance. It cannot.",
      sources: ["Robert Weimann, Shakespeare and the Popular Tradition in the Theater (1967)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    }
  ];

  TRIALS.richard_iii_act3_scene7 = [
    {
      kind: "comprehension",
      prompt: "What happened when Buckingham addressed the citizens at Guildhall?",
      options: [
        "They acclaimed Richard enthusiastically",
        "They responded with silence; only ten voices (Buckingham's own planted followers) cried \"God save King Richard!\"",
        "They rioted and demanded Edward V's coronation",
        "They demanded Buckingham be king instead"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 24, anchor_line_end: 42
    },
    {
      kind: "close_reading",
      prompt: "Buckingham instructs Richard: \"Play the maid's part, still answer nay, and take it.\" The simile compares political acceptance to what?",
      options: [
        "The role of a young actor playing a female part on the Elizabethan stage",
        "Scripted seduction — a woman refusing while yielding, where the refusal itself is the invitation",
        "A child's game of hide and seek",
        "A legal formality used in marriage contracts"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 51, anchor_line_end: 51
    },
    {
      kind: "theme",
      prompt: "Buckingham's line \"Two props of virtue for a Christian prince, / To stay him from the fall of vanity\" points to Richard flanked by what, and to what end?",
      options: [
        "Two guards — to suggest prudent caution",
        "Two churchmen, with a prayer-book in his hand — piety as stage prop, legitimizing the claim to the throne",
        "Two family relatives — to suggest dynastic legitimacy",
        "Two scholars — to suggest intellectual depth"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 91, anchor_line_end: 95
    },
    {
      kind: "close_reading",
      prompt: "Richard's formal refusal speech (137–169) works how?",
      options: [
        "It is a sincere declaration of unworthiness that Richard genuinely holds",
        "It deploys two individually plausible arguments (personal unworthiness, legitimate succession), combining to make the eventual acceptance look like reluctant overriding of personal scruple",
        "It is incoherent, revealing Richard's cracking composure",
        "It relies on direct biblical citation"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 137, anchor_line_end: 169
    },
    {
      kind: "historical",
      prompt: "The legal argument that Edward IV's children are illegitimate — based on a pre-contract to \"Lady Lucy\" and the Bona of Savoy proxy — has what basis?",
      options: [
        "Pure invention; no such arguments were ever made",
        "It draws on the historical Titulus Regius (1484), which formally declared Richard III legitimate king — a real legal argument historians still debate",
        "It was invented by Henry VII after Bosworth to discredit Richard",
        "It originates in Holinshed alone, with no earlier source"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 175, anchor_line_end: 187
    },
    {
      kind: "theme",
      prompt: "What is the scene's larger claim about political legitimacy?",
      options: [
        "Legitimacy rests on ancient lineage, independent of performance",
        "Illegitimate power claims legitimacy through theatre — the acceptance must look like a reluctant yielding rather than a seizure",
        "Legitimacy requires only military strength",
        "Only God can confer legitimacy, which is why the clergymen are necessary"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 230
    }
  ];

};
