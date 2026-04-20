/**
 * King Lear — Act IV annotations + Trials. 4.1 "As flies to wanton boys"
 * (theological skepticism). 4.6 (Tier 1) Dover cliff + "great stage of fools".
 */

module.exports = function (A: any, T: any) {

  A.king_lear_act4_scene1 = [
    {
      line_start: 36, line_end: 38,
      citation_display: "King Lear 4.1.36–38",
      category: "thematic",
      title: "'As flies to wanton boys' — the play's theological centerpiece",
      body: "Gloucester's 'As flies to wanton boys are we to the gods; / They kill us for their sport' is the most direct theological statement in Shakespeare. The image is borrowed from Plutarch and Montaigne, but Shakespeare's concentration is new: the gods are not merely indifferent, they are cruel-playful, like boys tearing the wings off insects. This is theological skepticism in its sharpest Jacobean form. Gloucester has just been blinded; he has lost his son through his own folly; he is being led across an open country by a beggar he does not recognise as Edgar. The image is earned. Critics have read Lear as Shakespeare's most religious play and as his most secular. Gloucester's line is a test case: a character in extremity voicing a cosmology in which the divine order is hostile. The play does not refute him. Gloucester's restoration in 5.3 (his heart 'burst smilingly') happens offstage, and even that is ambiguous. Virgil's verdict: Shakespeare does not finally arbitrate, but the weight of the line is that of a real question, not a rhetorical flourish.",
      sources: ["William R. Elton, King Lear and the Gods (1966)", "Stephen Greenblatt, Hamlet in Purgatory (2001)", "Montaigne, 'Apology for Raymond Sebond' (trans. Florio, 1603)"]
    },
    {
      line_start: 56, line_end: 65,
      citation_display: "King Lear 4.1.56–65",
      category: "historical",
      title: "The demons return — Flibbertigibbet, Obidicut, Hobbididance, Mahu, Modo",
      body: "Edgar's recital of demon-names here extends the Harsnett catalogue from 3.4. Five devils named in six lines: Flibbertigibbet (from 3.4), Obidicut (of lust), Hobbididance (dumbness), Mahu (stealing), Modo (murder), plus 'of mopping and mowing' (grimacing). This is the full taxonomy from Harsnett's Declaration, which Shakespeare is using to give Poor Tom a consistent demonological vocabulary. The demons are assigned specific sins, making Tom's ravings a mock-catechism of vice. Edgar is playing along with Gloucester's belief that a demon led him to the cliff; by naming demons from an exposed-fraud source, Shakespeare doubles the irony — the demons are theatrical props all the way down.",
      sources: ["Samuel Harsnett, A Declaration of Egregious Popish Impostures (1603)", "Stephen Greenblatt, 'Shakespeare and the Exorcists' in Shakespearean Negotiations (1988)"]
    },
    {
      line_start: 66, line_end: 80,
      citation_display: "King Lear 4.1.66–80",
      category: "thematic",
      title: "Gloucester's redistributive ethics — 'Distribution should undo excess'",
      body: "Blind Gloucester, giving Tom his purse: 'Heavens, deal so still! / Let the superfluous and lust-dieted man, / That slaves your ordinance, that will not see / Because he does not feel, feel your power quickly; / So distribution should undo excess, / And each man have enough.' Gloucester's speech rhymes almost verbatim with Lear's 'Poor naked wretches' in 3.4. Both blind men (Lear in his madness, Gloucester in his eyes) reach the same redistributive conclusion: luxury should be redistributed to need, not hoarded. This is the play's most compressed political theology. Shakespeare has made the argument available in both plots: it is the moral conclusion drawn by the play's most radically suffering figures, in parallel, independently.",
      sources: ["Terry Eagleton, William Shakespeare (1986)", "Kiernan Ryan, Shakespeare (1989)"]
    }
  ];
  T.king_lear_act4_scene1 = [
    {
      kind: "theme",
      prompt: "What does Gloucester's 'As flies to wanton boys' claim?",
      options: [
        "That the gods are just",
        "That the gods are not merely indifferent but cruel-playful, treating humans as boys treat insects — the play's sharpest statement of theological skepticism",
        "That there are no gods",
        "That the gods sleep"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 36, anchor_line_end: 38
    },
    {
      kind: "structural",
      prompt: "How does Gloucester's 'distribution should undo excess' speech relate to Lear's 'poor naked wretches' speech?",
      options: [
        "They have no relation",
        "They are parallel — both blind men reaching the same redistributive conclusion independently; Shakespeare doubles the moral argument across both plots",
        "Gloucester is quoting Lear",
        "Lear later retracts his"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 66, anchor_line_end: 80
    }
  ];

  A.king_lear_act4_scene2 = [
    {
      line_start: 40, line_end: 80,
      citation_display: "King Lear 4.2.40–80",
      category: "structural",
      title: "Albany's transformation — from silence to denunciation",
      body: "Albany in 4.2 is no longer the cautious husband of 1.4. He calls Goneril 'most barbarous, most degenerate,' predicts 'humanity must perforce prey on itself / Like monsters of the deep,' and compares her to a fiend 'self-cover'd' in a woman's skin. The rhetoric is a transformation: he has seen what his wife is capable of and is speaking it. The scene also delivers the news of Cornwall's death (from the servant's wound in 3.7) by report. Goneril's aside — 'Our fears in Cornwall have weighed against my prayers' — shows the sisters calculating power: with Cornwall dead, Regan is free to claim Edmund, and the rivalry that will destroy them both is now active.",
      sources: ["Jonathan Bate, Soul of the Age (2008)"]
    }
  ];
  T.king_lear_act4_scene2 = [
    {
      kind: "structural",
      prompt: "How has Albany changed between 1.4 and 4.2?",
      options: [
        "He hasn't changed",
        "From cautious silence to open moral denunciation — 'most barbarous, most degenerate' — the play's conscience-figure steps into speech",
        "He has become more cruel",
        "He has left the play"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 40, anchor_line_end: 80
    }
  ];

  A.king_lear_act4_scene3 = [
    {
      line_start: 8, line_end: 35,
      citation_display: "King Lear 4.3.8–35",
      category: "textual",
      title: "4.3 is largely a Q1-only scene — a second textual crux",
      body: "The Gentleman's report to Kent about Cordelia receiving the news of her father — her tears and smilets, her face like 'sunshine and rain at once' — is in many modern conflated editions (including Standard Ebooks') but is substantially ABSENT from the 1623 Folio. This is the second major Q1/F1 divergence in the play, alongside 3.6's mock trial. The scene's function is to prepare the audience emotionally for Cordelia's reappearance in 4.4: we see her grief refracted through a witness before we see her directly. The Folio's excision of this scene, if deliberate, would make Cordelia's return more abrupt; modern editorial practice overwhelmingly restores it. Readers encountering the conflated text should know that the Folio editors saw fit to cut it.",
      sources: ["Gary Taylor and Michael Warren (eds.), The Division of the Kingdoms (1983)", "R. A. Foakes, King Lear (Arden 3, 1997)"]
    }
  ];
  T.king_lear_act4_scene3 = [
    {
      kind: "structural",
      prompt: "What is notable about 4.3 editorially?",
      options: [
        "Nothing — it is uncontroversial",
        "It is substantially a Q1-only scene; the 1623 Folio largely omits it — the second major Q1/F1 divergence in the play (after 3.6's mock trial)",
        "It was added by an editor in the 18th century",
        "It is in prose"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 58
    }
  ];

  A.king_lear_act4_scene4 = [
    {
      line_start: 1, line_end: 20,
      citation_display: "King Lear 4.4.1–20",
      category: "close_reading",
      title: "Cordelia entering crowned with weeds — the plant-catalogue of Lear's madness",
      body: "Cordelia enters describing Lear 'As mad as the vex'd sea; singing aloud; / Crown'd with rank fumiter and furrow-weeds, / With hardoks, hemlock, nettles, cuckoo-flowers, / Darnel, and all the idle weeds that grow / In our sustaining corn.' The catalogue is both botanical and symbolic: fumitory (smoke / self-deception), hemlock (poison / Socratic death), nettles (burning), cuckoo-flowers (cuckoldry), darnel (drunkenness in folk medicine). Every plant in the crown has a moral valence. Shakespeare is signaling that Lear's madness is legible — you can read his crown of weeds. The line-count is small but the image is among the play's densest. Pre-Raphaelite painters (Ford Madox Brown, for instance) returned to it repeatedly.",
      sources: ["Henry Peacham, Minerva Britanna (1612)", "Jonathan Bate, Soul of the Age (2008)"]
    }
  ];
  T.king_lear_act4_scene4 = [
    {
      kind: "close_reading",
      prompt: "What is symbolic about the weeds that crown Lear in his madness?",
      options: [
        "They are random plants",
        "Each is legible — fumitory (self-deception), hemlock (poison/Socratic death), nettles (burning), cuckoo-flowers (cuckoldry), darnel (drunkenness) — his crown is a readable moral emblem",
        "They represent royal heraldry",
        "They identify the time of year"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 3, anchor_line_end: 7
    }
  ];

  A.king_lear_act4_scene5 = [
    {
      line_start: 25, line_end: 40,
      citation_display: "King Lear 4.5.25–40",
      category: "thematic",
      title: "Regan and Goneril's rivalry for Edmund — mutual destruction set in motion",
      body: "With Cornwall dead, Regan is newly available and presses her claim to Edmund: 'I know your lady does not love her husband; / I am sure of that.' Goneril's letter, hidden on Oswald's body, will eventually surface. The rivalry is darkly funny — two women in their forties competing over a bastard half their age who is using them both — but it is also structurally decisive. Edmund's courtship of both sisters is the mechanism by which they will poison each other (Goneril poisoning Regan, then taking her own life). Shakespeare is letting Edmund be the knife each sister is handing the other. Their sexual rivalry is the play's most compressed study of how evil ultimately consumes itself — not because evil is self-punishing in general, but because Edmund is specifically more dangerous than anyone he plays.",
      sources: ["Marilyn French, Shakespeare's Division of Experience (1981)"]
    }
  ];
  T.king_lear_act4_scene5 = [
    {
      kind: "inference",
      prompt: "The sisters' rivalry for Edmund in 4.5 sets in motion —",
      options: [
        "A new political alliance",
        "Their mutual destruction — Edmund will be the knife each sister hands the other, ending in Goneril poisoning Regan and taking her own life",
        "Edmund's escape",
        "Cornwall's revenge"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 25, anchor_line_end: 40
    }
  ];

  // ── 4.6 — Dover cliff (Tier 1) ──────────────────────────────────────
  A.king_lear_act4_scene6 = [
    {
      line_start: 1, line_end: 80,
      citation_display: "King Lear 4.6.1–80",
      category: "structural",
      title: "The non-existent cliff — Edgar's therapeutic theater",
      body: "Edgar leads blind Gloucester to what Gloucester believes is the edge of the Dover cliffs, describes a vertiginous view that pure language makes real, and stands by while Gloucester 'falls' onto flat ground. This is Shakespeare's most sustained demonstration of theater's power to construct reality through verbal description alone. The cliff exists only in Edgar's speech. The ekphrasis — choughs 'midway air,' samphire-gatherers 'dreadful trade,' fishermen 'like mice,' the anchored ship 'diminish'd to her cock' — is vertiginous prose-verse, designed to make the reader's head spin alongside Gloucester's. After Gloucester falls, Edgar becomes a different speaker, 'of the bottom,' convincing Gloucester that a fiend led him and that the gods have preserved him. The scene is Edgar's therapeutic lie: he manages his father's despair by staging a survival miracle. That Shakespeare grants this theater its healing work (Gloucester's 'henceforth I'll bear / Affliction till it do cry out itself / Enough') is a quiet endorsement of theater as consolation — the opposite of Hamlet's bitter view of performance.",
      sources: ["Jonathan Bate, The Genius of Shakespeare (1997)", "Simon Palfrey, Doing Shakespeare (2005)"]
    },
    {
      line_start: 210, line_end: 220,
      citation_display: "King Lear 4.6.210–220",
      category: "thematic",
      title: "'Great stage of fools' — the theatrum mundi tradition",
      body: "Lear's 'When we are born, we cry that we are come / To this great stage of fools' enters the theatrum mundi tradition at its most pessimistic. The metaphor of the world as a stage has a long history — Plato, Epictetus, Erasmus (whose 'The Praise of Folly' Shakespeare knew), Petronius ('mundus universus exercet histrionicam,' the whole world plays the actor). Shakespeare himself returns to it constantly ('All the world's a stage' in As You Like It; 'We are such stuff as dreams are made on' in The Tempest). Lear's contribution is the quality of the actors: not all human beings, just fools. Birth itself is figured as an entry into absurdity. This is pitch-dark — Lear in full disillusion — but it is also philosophically serious. The play ends with Edgar (or Albany) saying 'Speak what we feel, not what we ought to say,' which keeps the theatrical frame ('say') while endorsing sincerity over performance within it. The world is still a stage; only the register of the performance is negotiable.",
      sources: ["Frances Yates, Theatre of the World (1969)", "Stephen Greenblatt, 'Shakespeare and the Ethics of Authority' (2010)"]
    },
    {
      line_start: 220, line_end: 235,
      citation_display: "King Lear 4.6.220–235",
      category: "close_reading",
      title: "'Reason in madness' — Edgar's formulation of the play's central paradox",
      body: "Edgar's aside during Lear's mad coherence — 'O, matter and impertinency mix'd! / Reason in madness!' — is the play's key formulation of its central paradox. Lear on the heath and at Dover has been speaking wisdom through derangement. 'Matter' (substance, real content) is mixed with 'impertinency' (off-topic ravings); the signal rides on noise. Edgar, who has spent much of the play playing at madness as Poor Tom, is the right character to recognise this. 'Reason in madness' will become a touchstone phrase in the play's critical tradition — E.M. Forster quoted it; Kurosawa's Ran takes its title from the Japanese word for chaos or turmoil that shares semantic territory with 'reason in madness.' The phrase names Shakespeare's deepest gamble in the play: that truth is accessible to the broken in ways the composed cannot reach.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "E.M. Forster, Aspects of the Novel (1927)"]
    }
  ];
  T.king_lear_act4_scene6 = [
    {
      kind: "structural",
      prompt: "What does Edgar accomplish by staging the non-existent cliff at Dover?",
      options: [
        "He humiliates Gloucester",
        "He uses pure verbal description to construct a reality Gloucester can 'fall' from — theater's power to heal by making a survival miracle out of a flat field",
        "He tests whether Gloucester is faking blindness",
        "He attempts to kill Gloucester"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 1, anchor_line_end: 80
    },
    {
      kind: "theme",
      prompt: "Lear's 'great stage of fools' belongs to which long tradition?",
      options: [
        "The medieval morality play",
        "Theatrum mundi — 'the world as theater,' a tradition running from Plato through Erasmus and Petronius to Shakespeare's own 'All the world's a stage'",
        "Courtly romance",
        "Biblical exegesis"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 210, anchor_line_end: 220
    },
    {
      kind: "close_reading",
      prompt: "Edgar's 'reason in madness' formulation names —",
      options: [
        "Lear's hypocrisy",
        "The play's central paradox — that truth is accessible to the broken in ways the composed cannot reach; signal riding on noise",
        "A medical diagnosis",
        "Edgar's own confusion"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 220, anchor_line_end: 225
    },
    {
      kind: "inference",
      prompt: "The extensive verbal description of the Dover cliff (choughs, samphire, fishermen) serves what purpose?",
      options: [
        "Padding the scene",
        "Constructing reality through language alone — the cliff exists only in Edgar's speech; the ekphrasis is designed to make reader and Gloucester equally vertiginous",
        "Geographic accuracy",
        "Showing off Shakespeare's research"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 11, anchor_line_end: 25
    }
  ];

  A.king_lear_act4_scene7 = [
    {
      line_start: 45, line_end: 85,
      citation_display: "King Lear 4.7.45–85",
      category: "thematic",
      title: "Lear wakes — 'You do me wrong to take me out o' the grave'",
      body: "Lear waking to Cordelia is the play's most tender scene. He does not immediately recognise her; he thinks he is dead and bound on 'a wheel of fire.' 'Pray, do not mock me: / I am a very foolish fond old man.' The vocabulary is minimized — almost no Latinate words, almost all monosyllables. Shakespeare strips Lear's language in precise proportion to how far he is from his 1.1 grandeur. 'I think this lady / To be my child Cordelia.' 'And so I am, I am.' Reunion delivered through uncertainty — Lear finding identity through recognising hers first. The Folio cuts some lines from this scene that Q1 preserves (another textual divergence); modern editions restore them because they make Lear's humility more complete. This is the play's closest approach to redemption, and Shakespeare will destroy it in 5.3. But while it lasts, it is perfect.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Stanley Cavell, 'The Avoidance of Love' in Disowning Knowledge (1987)"]
    }
  ];
  T.king_lear_act4_scene7 = [
    {
      kind: "close_reading",
      prompt: "What is distinctive about Lear's language when he wakes to Cordelia in 4.7?",
      options: [
        "It is grand and operatic",
        "Stripped to near-monosyllables ('a very foolish fond old man,' 'I am, I am') — Shakespeare minimises diction in proportion to Lear's distance from his 1.1 grandeur",
        "It is in Latin",
        "It is highly rhymed"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 60, anchor_line_end: 85
    }
  ];
};
