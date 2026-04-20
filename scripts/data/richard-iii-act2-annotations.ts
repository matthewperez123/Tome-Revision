/**
 * Richard III — Act II annotations and Trials.
 * No Tier-1 scenes in Act II. The act is transitional: Edward IV's death
 * (offstage), the formally intricate lament of 2.2 (the "wailing queens"
 * rehearsal-piece), the citizens' choric scene (2.3), and the flight
 * to sanctuary (2.4). Moderate coverage.
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

  // ── 2.1 — The palace. Edward's forced reconciliation ──────────────────
  ANNOTATIONS.richard_iii_act2_scene1 = [
    {
      line_start: 1, line_end: 44,
      citation_display: cite("2.1", 1, 44),
      category: "structural",
      title: "The sick-king reconciliation, staged as theatre",
      body: "Edward's deathbed peace-making is one of the play's most overtly theatrical set-pieces: each peer is walked to another, hands are joined, and formal vows of love are spoken before the king. Edward insists on performance (\"Dissemble not your hatred\"), but the whole court knows the gestures are hollow. The audience knows more — we have watched Richard engineer Clarence's imprisonment and death in 1.1 and 1.3. The scene thus functions as a false reconciliation, a ritual that cannot undo the murder already accomplished offstage. Buckingham's vow (\"When I have most need to employ a friend, / And most assured that he is a friend, / Deep, hollow, treacherous, and full of guile, / Be he unto me!\") is the play's most explicit instance of dramatic irony: Buckingham swears against the exact fate he will meet at Richard's hands in Act V.",
      sources: ["Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
    {
      line_start: 78, line_end: 95,
      citation_display: cite("2.1", 78, 95),
      category: "thematic",
      title: "Clarence's death announced, and the craft of the counter-blame",
      body: "When Richard tells the assembled court \"Who knows not that the noble duke is dead?\" he has already pre-positioned the accusation: the king's first (fatal) order was obeyed by a winged Mercury; the countermand was carried by a tardy cripple. The image is Richard's rhetorical signature — he externalizes responsibility onto the speed of messengers rather than his own actions. Elizabeth's horrified \"All-seeing heaven, what a world is this!\" is the only response available to characters who do not yet understand they are watching a murderer script their future. The scene's closing couplet from Gloucester (\"God will revenge it\") is the play's most brazen hypocrisy — Richard invokes divine justice for a death he himself commissioned.",
      sources: ["A. P. Rossiter, Angel with Horns (1961)", "Nicholas Brooke, Shakespeare's Early Tragedies (1968)"]
    },
    {
      line_start: 100, line_end: 132,
      citation_display: cite("2.1", 100, 132),
      category: "close_reading",
      title: "Edward's self-indictment: \"Who sued to me for him?\"",
      body: "Edward IV's speech — \"My brother slew no man; his fault was thought\" — is one of the play's unexpected moments of genuine feeling. Edward recalls the field at Tewkesbury when Clarence rescued him from Oxford, recalls lying frozen under Clarence's own cloak. The speech mourns not only Clarence but his own failure as king and brother: no one in his court spoke for Clarence; his royal wrath overrode his memory. What makes the speech dramatically strong is its structural position — Edward gets this moment of clarity, then dies offstage, never to speak again. The play's political machinery has used up the one man capable of honouring the bonds of kinship. Richard will inherit a court trained to stay silent.",
      sources: ["Phyllis Rackin, Stages of History (1990)", "Paola Pugliatti, Shakespeare the Historian (1996)"]
    },
    {
      line_start: 134, line_end: 139,
      citation_display: cite("2.1", 134, 139),
      category: "thematic",
      title: "\"God will revenge it\" — Richard's theological irony",
      body: "Richard's closing aside — \"God will revenge it\" — uses divine retribution as deflection. The line is characteristically double-voiced: at the level of plot it is a cover-story (the queen's kin will be blamed for Clarence's death); at the level of the play's larger theology it is an admission. God does revenge it, in 5.3, when the ghosts arrive. Richard the plot-mover speaks words that the play's moral order will make true against him. This is the pattern Shakespeare learned from the medieval morality plays and is now refining: the villain, speaking glibly, utters the judgement that will eventually come for him. Whether or not Shakespeare shares the theology, the dramaturgy requires it: Richard's doom must be prefigured in his own speech.",
      sources: ["Bernard Spivack, Shakespeare and the Allegory of Evil (1958)", "E. M. W. Tillyard, Shakespeare's History Plays (1944)"]
    }
  ];

  TRIALS.richard_iii_act2_scene1 = [
    {
      kind: "comprehension",
      prompt: "Why does Edward IV stage the reconciliation among his peers?",
      options: [
        "He expects to go on a long journey and wants peace behind him",
        "He expects to die soon and wants his court at peace before his death",
        "He has received a vision commanding it",
        "He is preparing to abdicate in favour of Gloucester"
      ],
      answer_index: 1,
      wisdom_reward: 15,
      anchor_line_start: 1, anchor_line_end: 8
    },
    {
      kind: "inference",
      prompt: "How does Richard explain why Clarence's reprieve failed to reach him in time?",
      options: [
        "That the king's written order was lost in transit",
        "That a \"winged Mercury\" bore the first (fatal) order and a \"tardy cripple\" bore the countermand, arriving too late",
        "That the jailer willfully disobeyed the reprieve",
        "That the queen's allies intercepted the reprieve"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 87, anchor_line_end: 90
    },
    {
      kind: "theme",
      prompt: "Buckingham's oath against those who would turn on him — the elaborate self-curse at 32–40 — functions as what?",
      options: [
        "A sincere pledge of loyalty",
        "Dramatic irony: he unwittingly predicts the exact fate he will meet at Richard's hands in Act V",
        "A legal binding that makes the reconciliation permanent",
        "A ceremonial formality with no narrative consequence"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 32, anchor_line_end: 40
    },
    {
      kind: "close_reading",
      prompt: "What emotional register does Edward's speech (102–132) bring that the play has not yet sustained?",
      options: [
        "Comic irony and wordplay",
        "Grieved clarity — genuine remorse, specific memory of Tewkesbury, and self-indictment as king and brother",
        "Satirical mockery of the court",
        "A prophetic vision of future events"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 102, anchor_line_end: 132
    },
    {
      kind: "inference",
      prompt: "When Richard says \"God will revenge it\" after Clarence's death is announced, the line is an example of what?",
      options: [
        "Genuine piety",
        "Deflection that is also an unwitting prophecy — God will revenge it, against Richard, in 5.3",
        "A stage direction mistaken as dialogue",
        "A scriptural quotation from the Book of Job"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 138, anchor_line_end: 138
    }
  ];

  // ── 2.2 — The palace. The wailing queens, first formation ─────────────
  ANNOTATIONS.richard_iii_act2_scene2 = [
    {
      line_start: 34, line_end: 100,
      citation_display: cite("2.2", 34, 100),
      category: "structural",
      title: "The first formation of the wailing-queens pattern",
      body: "This is the play's first great formal lament, and it rehearses the set-piece that will reach full scale in 4.4. Queen Elizabeth, the Duchess of York, and Clarence's two children (Boy and Girl) arrange themselves in a pattern of antiphonal grief: each names a dead kinsman, then each responds with parallel syntax. \"Was never widow had so dear a loss!\" / \"Were never orphans had so dear a loss!\" / \"Was never mother had so dear a loss!\" The pattern is not decorative — it is the scene's architecture, and it tells the audience how to read grief in this play. Grief is not individual but choric. The women and children of the dynasty collectively mourn a political history their male kin built, and the formal symmetry enacts the claim that their sorrow is equal and shared. Shakespeare will tighten and extend the pattern in 4.4, adding Margaret; the pattern here prepares that reach.",
      sources: ["Phyllis Rackin, Stages of History (1990)", "Jean Howard and Phyllis Rackin, Engendering a Nation (1997)"]
    },
    {
      line_start: 27, line_end: 32,
      citation_display: cite("2.2", 27, 32),
      category: "close_reading",
      title: "The Duchess of York's terrible knowledge",
      body: "The Duchess's aside about Richard — \"He is my son; yea, and therein my shame; / Yet from my dugs he drew not this deceit\" — is the play's first frank maternal condemnation of Richard. She is saying he is her son biologically but not morally; she did not nurse him into his villainy. The line is important because Margaret's later insults will accuse the Duchess of precisely this — of having hatched \"a hell-hound\" in her womb (4.4.47) — and the Duchess will accept that judgement. Here she is still trying to separate herself from him. The theological vocabulary (\"shame,\" \"deceit\") and the emphasis on nursing (\"dugs\") set up the play's peculiar pressure on mothers: in Richard III, maternal love is the one bond Richard's rhetoric can only reach by parody.",
      sources: ["Janet Adelman, Suffocating Mothers (1992)", "Coppélia Kahn, Man's Estate: Masculine Identity in Shakespeare (1981)"]
    },
    {
      line_start: 109, line_end: 153,
      citation_display: cite("2.2", 109, 153),
      category: "structural",
      title: "Buckingham moves the plot — the trip to Ludlow",
      body: "The scene's political hinge is Buckingham's proposal that the young prince be fetched from Ludlow to London with \"some little train\" — a minimal escort. The reasoning given is public-order prudence (a large retinue would revive faction); the real purpose, announced to Richard in aside, is to \"part the queen's proud kindred from the king.\" This is the play's first clear demonstration that Buckingham is not merely a witness to Richard's plotting but an equal designer. Richard's response — \"My other self, my counsel's consistory, / My oracle, my prophet!\" — is the most extravagant flattery he delivers to any character in the play, and the reader should notice it. In 3 Henry VI Richard had no such partner. Buckingham is new. His usefulness to Richard extends only as long as his agreement; when he hesitates in 4.2 over the princes' murder, the flattery-vocabulary evaporates and he is marked for death.",
      sources: ["Nicholas Brooke, Shakespeare's Early Tragedies (1968)", "Charles R. Forker, \"Webster's Prose and the Rhetoric of Despair\" (1977)"]
    },
    {
      line_start: 88, line_end: 98,
      citation_display: cite("2.2", 88, 98),
      category: "thematic",
      title: "Dorset's Christian resignation and what the play does with it",
      body: "The Marquess of Dorset's rebuke to his grieving mother — \"God is much displeased / That you take with unthankfulness his doing\" — is the voice of orthodox Elizabethan piety. Death is a debt; complaint against God's taking is ingratitude. The speech is sincere, and it is also dramatically insufficient. The play does not quarrel with the theology but demonstrates its limits: Dorset will himself be in exile by Act IV (fleeing to Richmond), and the \"royal debt\" language he deploys will by 4.4 be revealed as a mask for the plot's actual mechanism, which is not God's taking but Richard's. Shakespeare is careful not to reject the theology outright. He lets it stand, and lets its inadequacy to the play's suffering reveal itself as the plot continues. Consolation is real in Richard III; it is simply not sufficient.",
      sources: ["Debora K. Shuger, Habits of Thought in the English Renaissance (1990)", "Huston Diehl, Staging Reform, Reforming the Stage (1997)"]
    }
  ];

  TRIALS.richard_iii_act2_scene2 = [
    {
      kind: "structural",
      prompt: "The formally parallel exchange (\"Was never widow had so dear a loss! / Were never orphans had so dear a loss! / Was never mother had so dear a loss!\") serves what function?",
      options: [
        "Ornamental rhetoric without structural purpose",
        "The scene's architecture — it enacts the claim that grief in this play is choric and collectively shared",
        "A parody of orthodox prayer",
        "A riddle whose answer the audience must infer"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 76, anchor_line_end: 79
    },
    {
      kind: "comprehension",
      prompt: "The Duchess of York, speaking of Richard, says \"He is my son... Yet from my dugs he drew not this deceit.\" What does she mean?",
      options: [
        "That he is not in fact her biological son",
        "That he is her biological son but she did not nurse him into his villainy — she separates herself morally from his acts",
        "That she refused to breastfeed him, and this is the reason for his character",
        "That he was raised by a wet-nurse rather than by her"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 29, anchor_line_end: 30
    },
    {
      kind: "inference",
      prompt: "Why does Buckingham want the young prince fetched from Ludlow with \"some little train\"?",
      options: [
        "To save expense",
        "The stated reason is public order; the private reason (announced to Richard in aside) is to separate the prince from the queen's \"proud kindred\"",
        "To speed the journey back to London",
        "To avoid attracting the notice of foreign ambassadors"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 119, anchor_line_end: 149
    },
    {
      kind: "theme",
      prompt: "Richard greets Buckingham as \"My other self, my counsel's consistory, / My oracle, my prophet!\" What does this flattery signal?",
      options: [
        "Sincere religious devotion",
        "That Buckingham is Richard's equal partner in design at this moment — a relationship that will hold only until Buckingham hesitates in 4.2",
        "That Richard has converted to Catholic piety",
        "A casual formulaic courtesy, with no dramatic weight"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 150, anchor_line_end: 152
    },
    {
      kind: "close_reading",
      prompt: "Dorset's counsel to his mother — \"God is much displeased that you take with unthankfulness his doing\" — represents what?",
      options: [
        "Explicit blasphemy",
        "Orthodox Elizabethan Christian consolation, which the play respects but ultimately finds insufficient to its suffering",
        "A sarcastic mockery of piety",
        "A legal argument against inheritance disputes"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 88, anchor_line_end: 94
    }
  ];

  // ── 2.3 — A street. Three citizens ────────────────────────────────────
  ANNOTATIONS.richard_iii_act2_scene3 = [
    {
      line_start: 1, line_end: 46,
      citation_display: cite("2.3", 1, 46),
      category: "structural",
      title: "The choric citizens: ordinary voices in an extraordinary play",
      body: "The three citizens' scene is Shakespeare's equivalent of the commoner-chorus he will deploy more elaborately in Julius Caesar (the Roman crowds) and Coriolanus. Here it is compact and haunted. The Third Citizen's cluster of weather-proverbs — \"When clouds appear, wise men put on their cloaks; / When great leaves fall, the winter is at hand; / When the sun sets, who doth not look for night?\" — operates as choric foreknowing, the ordinary man reading political weather as climate. The scene does critical structural work: it establishes that Richard's rise is not invisible to ordinary citizens. They see it coming. They do not know what to do. The play has just moved from Edward's death (2.1) to the wailing queens (2.2) to street-level fear, and in three short movements it has represented the whole polity grieving.",
      sources: ["Phyllis Rackin, Stages of History (1990)", "Andrew Gurr, Playgoing in Shakespeare's London (1987)"]
    },
    {
      line_start: 11, line_end: 30,
      citation_display: cite("2.3", 11, 30),
      category: "historical",
      title: "\"Woe to the land that's govern'd by a child\"",
      body: "The First Citizen's quotation — \"Woe to the land that's govern'd by a child\" — is Ecclesiastes 10:16 in the Geneva Bible's phrasing (\"Woe be unto thee, O land, when thy King is a child\"). The citation is not incidental. Elizabethan political theology, especially in periods of anxious succession, treated the question of the underage king with great seriousness: Henry VI's own nine-month coronation is brought up here, and the Third Citizen's response (that Henry VI's reign had \"virtuous uncles\" to protect him, unlike Edward V's) names the exact political anxiety that Richard will exploit. The scene offers the audience not Richard's propaganda but its critical reception: the citizens understand why Richard could claim the protectorate and why that claim is dangerous. Shakespeare is letting his stage show his audience what his audience would have recognized as their own political literacy.",
      sources: ["Geneva Bible (1560)", "John Jowett, The Oxford Shakespeare: Richard III (2000)", "Blair Worden, The Sound of Virtue: Philip Sidney's Arcadia (1996)"]
    }
  ];

  TRIALS.richard_iii_act2_scene3 = [
    {
      kind: "structural",
      prompt: "What role do the three citizens serve in the play's structure?",
      options: [
        "Comic relief with no relation to the main plot",
        "A choric function: ordinary voices reading political weather, establishing that Richard's rise is visible to citizens",
        "A contrived obstacle to the main plot",
        "A device to introduce historical backstory the audience has missed"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 46
    },
    {
      kind: "comprehension",
      prompt: "The First Citizen quotes \"Woe to the land that's govern'd by a child.\" What is the source?",
      options: [
        "A proverb from Aesop's Fables",
        "Ecclesiastes 10:16 — a biblical commonplace about the political dangers of an underage king",
        "A line from Seneca's Hercules Furens",
        "A Tudor-era statute on royal minority"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 11, anchor_line_end: 11
    },
    {
      kind: "close_reading",
      prompt: "The Third Citizen's weather-proverbs (\"When clouds appear...\" etc.) function as what?",
      options: [
        "A literal forecast of bad weather",
        "Choric foreknowing: ordinary political intuition reading the court as climate",
        "A parody of astrological prognostication",
        "An unconnected digression"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 32, anchor_line_end: 37
    }
  ];

  // ── 2.4 — The palace. Flight to sanctuary ─────────────────────────────
  ANNOTATIONS.richard_iii_act2_scene4 = [
    {
      line_start: 1, line_end: 48,
      citation_display: cite("2.4", 1, 48),
      category: "historical",
      title: "Stony Stratford and the arrest of Rivers and Grey",
      body: "The messenger's news — that Rivers, Grey, and Vaughan have been sent to Pomfret — compresses the historical crisis of late April 1483. The young prince, escorted by Rivers and Grey, was met at Stony Stratford in Northamptonshire by Richard and Buckingham, travelling with a larger force. Richard arrested Rivers at nearby Northampton on 30 April and seized the prince at Stony Stratford on 1 May; Rivers, Grey, and Vaughan were sent north to Pomfret where they were executed in June. The play compresses these events offstage, but the dates, places, and names are accurate to Holinshed's chronicle. What the play adds is the women's immediate recognition of what has happened: Elizabeth's \"I see the downfall of our house\" and her decision to take sanctuary at Westminster Abbey. Shakespeare's stage condenses historical weeks into minutes, but the political grammar survives the compression.",
      sources: ["Raphael Holinshed, Chronicles (1587)", "Charles Ross, Richard III (1981)", "Michael Hicks, Richard III (2000)"]
    },
    {
      line_start: 27, line_end: 35,
      citation_display: cite("2.4", 27, 35),
      category: "close_reading",
      title: "York's tongue: precocity read and feared",
      body: "The young Duke of York's quick-witted exchange with his grandmother — the nurse who supposedly said Richard was born with teeth and therefore \"grew so fast / That he could gnaw a crust at two hours old\" — is one of the play's showcase moments of child-speech. York's rhetorical quickness is praised onstage (Buckingham: \"With what a sharp-provided wit he reasons!\") and feared behind the hand. Richard's own judgement (3.1.151 — \"a parlous boy\") will seal the child's fate. Shakespeare does something difficult here: he lets the boy be funny and then shows us that his very liveness is what dooms him. Tudor policy around royal children required their formative concealment; visible intelligence in a boy-heir was a political liability. The play lets us feel the tightening of a net we cannot prevent.",
      sources: ["Ann Blake, \"Children and Suffering in Shakespeare's Plays\" (1998)", "Carol Chillington Rutter, Shakespeare and Child's Play (2007)"]
    },
    {
      line_start: 49, line_end: 64,
      citation_display: cite("2.4", 49, 64),
      category: "thematic",
      title: "\"The tiger now hath seized the gentle hind\"",
      body: "Elizabeth's image for Richard's arrest of her brother and son — \"The tiger now hath seized the gentle hind\" — introduces the play's predator-prey register that will intensify through Margaret's 4.4 imagery (wolves and lambs, hell-hound and butcher'd princes). What distinguishes this image is its political specificity: Elizabeth is not speaking of generic predation but of \"insulting tyranny\" jetting upon \"the innocent and aweless throne.\" The throne is \"aweless\" because its occupant is a child: the political body has lost its commanding presence. Elizabeth's phrase \"I see, as in a map, the end of all\" is one of the play's strongest compressed images of political foresight — she sees the whole sequence at once. What she cannot do, yet, is prevent it.",
      sources: ["Caroline Spurgeon, Shakespeare's Imagery (1935)", "Maurice Charney, Shakespeare's Style (1969)"]
    }
  ];

  TRIALS.richard_iii_act2_scene4 = [
    {
      kind: "historical",
      prompt: "The arrest of Rivers and Grey took place historically where, according to the chronicle sources Shakespeare used?",
      options: [
        "At Ludlow Castle, before the prince's departure",
        "At Northampton and Stony Stratford in late April 1483",
        "At the Tower of London after Edward IV's death",
        "At Dover, as they attempted to leave for Burgundy"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 41
    },
    {
      kind: "close_reading",
      prompt: "The young Duke of York's joke about Richard's birth-teeth (28–30) achieves what dramatic effect?",
      options: [
        "It introduces pure comic relief, unrelated to the plot",
        "It is clever enough to be praised aloud and feared silently — the child's visible intelligence is precisely what makes him politically dangerous",
        "It is an unwitting insult the boy does not understand",
        "It is a learned riddle requiring classical knowledge to decode"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 27, anchor_line_end: 35
    },
    {
      kind: "comprehension",
      prompt: "Where does Queen Elizabeth take refuge at the scene's end?",
      options: [
        "At the Tower of London",
        "In sanctuary at Westminster Abbey",
        "At the Scottish border",
        "At her brother Rivers' estate in Northamptonshire"
      ],
      answer_index: 1,
      wisdom_reward: 15,
      anchor_line_start: 65, anchor_line_end: 72
    },
    {
      kind: "theme",
      prompt: "Elizabeth's \"The tiger now hath seized the gentle hind\" and \"I see, as in a map, the end of all\" together characterize her as what?",
      options: [
        "A character given to inexact rhetorical flourish",
        "A political seer whose predator-prey vocabulary and compressed foresight anticipate the play's larger imagery and moral arithmetic",
        "An unreliable narrator",
        "A passive mother with no political awareness"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 49, anchor_line_end: 53
    }
  ];

};
