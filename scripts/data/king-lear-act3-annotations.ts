/**
 * King Lear — Act III annotations + Trials.
 * 3.2 storm (Tier 1), 3.4 Poor Tom + Harsnett (Tier 1), 3.6 mock trial
 * (Q1-ONLY textual annotation), 3.7 blinding (Tier 1).
 */

module.exports = function (A: any, T: any) {

  A.king_lear_act3_scene1 = [
    {
      line_start: 35, line_end: 50,
      citation_display: "King Lear 3.1.35–50",
      category: "structural",
      title: "France invades — the political machinery that will fail the play",
      body: "Kent's speech to the Gentleman announces the French invasion — the force that might redeem Lear politically if it arrives in time. Shakespeare wants the audience to register the military stakes without dwelling on them; the invasion will matter as a deadline, not as a plot-driver. By 5.3 the French will have lost, Cordelia will be captured, and the political frame will collapse back onto private grief. This scene is a setup whose payoff is its own futility: the armies matter less than whether Lear's button gets undone.",
      sources: ["G. K. Hunter, 'The Last Tragic Heroes' in Later Shakespeare (1966)"]
    }
  ];
  T.king_lear_act3_scene1 = [
    {
      kind: "comprehension",
      prompt: "What political news does Kent deliver in 3.1?",
      options: [
        "Cornwall's death",
        "France has landed an invading army — the political machinery that might redeem Lear, though the play will let it fail",
        "Edmund's treachery",
        "Cordelia's capture"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 35, anchor_line_end: 50
    }
  ];

  // ── 3.2 — Storm (Tier 1) ────────────────────────────────────────────
  A.king_lear_act3_scene2 = [
    {
      line_start: 1, line_end: 25,
      citation_display: "King Lear 3.2.1–25",
      category: "thematic",
      title: "The storm as externalised psychology",
      body: "Lear's 'Blow, winds, and crack your cheeks! rage! blow!' is the moment critics have most often used to argue that Lear is not merely tragic drama but poetic cosmology. The storm is the play's most famous example of pathetic fallacy turned structural: Lear's mind is the weather. Harold Bloom writes that these scenes contain 'the greatest poetry ever composed' and that Lear 'is not so much a character as a cosmic force.' The storm is also staging itself against the theatrical limits of Shakespeare's stage — a king on a literal heath in literal wind and rain, calling on the elements to destroy the templates of creation ('Crack nature's moulds, an germens spill at once'). This is metaphysical revolt dressed as meteorology. Lear wants the world un-made, and the play permits him the syntax for it.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Frank Kermode, Shakespeare's Language (2000)"]
    },
    {
      line_start: 47, line_end: 60,
      citation_display: "King Lear 3.2.47–60",
      category: "close_reading",
      title: "'I am a man more sinn'd against than sinning' — compressed moral accounting",
      body: "After the big apostrophe to the storm, Lear quietens into a different register: 'Let the great gods, / That keep this dreadful pudder o'er our heads, / Find out their enemies now. Tremble, thou wretch, / That hast within thee undivulged crimes / Unwhipp'd of justice.' The list — hidden criminals, perjurers, adulterers — is almost a litany of Jacobean moral anxiety. Lear's own confession, 'I am a man / More sinn'd against than sinning,' is the play's quietest moment of self-appraisal. Not 'innocent,' not 'wronged' — he admits sin while claiming the weight is uneven. That asymmetry is the play's tragic judgment: Lear is no saint, but what's been done to him exceeds any reasonable punishment. This is a surprisingly rare move for Shakespeare — a protagonist who concedes fault while refusing the full allocation of blame.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)"]
    },
    {
      line_start: 67, line_end: 85,
      citation_display: "King Lear 3.2.67–85",
      category: "structural",
      title: "The Fool's prophecy — a Chaucer parody amid the storm",
      body: "Left alone on the heath, the Fool delivers a mock-prophecy beginning 'When priests are more in word than matter.' The speech is a parody of a genuine medieval prophecy commonly attributed to Chaucer, inverting its logic — the Fool prophesies a world in which justice reigns, which is by definition impossible. The joke is serious: the Fool is saying that Britain will never see such a world, and a kingdom that must wait for universal virtue for reform will wait forever. Some editors (Folger, Riverside) note that the prophecy may have been inserted by an actor later and question Shakespeare's authorship. Either way, it ends with 'This prophecy Merlin shall make; for I live before his time,' a temporal joke that makes the Fool older than Arthur and places his pessimism outside history.",
      sources: ["G. Blakemore Evans, The Riverside Shakespeare (1974, 1997)", "Kenneth Muir, King Lear (Arden, 1952)"]
    }
  ];
  T.king_lear_act3_scene2 = [
    {
      kind: "theme",
      prompt: "Critics often describe the storm in 3.2 as —",
      options: [
        "A simple weather event",
        "Externalised psychology — Lear's mind made weather; pathetic fallacy raised to structural principle",
        "A metaphor for England's climate",
        "A biblical reference to Noah"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 25
    },
    {
      kind: "close_reading",
      prompt: "Harold Bloom's reading of the storm scenes treats them as —",
      options: [
        "A failure of staging",
        "'The greatest poetry ever composed,' with Lear 'not so much a character as a cosmic force' — the summit of Shakespearean verse",
        "A weakness of the play",
        "A later addition"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 25
    },
    {
      kind: "inference",
      prompt: "Lear's 'I am a man / More sinn'd against than sinning' concedes what?",
      options: [
        "Complete innocence",
        "That he has sinned (not claiming innocence), but that what has been done to him exceeds the weight of his own faults — an asymmetric moral judgment",
        "That he is guilty of everything",
        "Nothing"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 58, anchor_line_end: 62
    },
    {
      kind: "historical",
      prompt: "The Fool's prophecy at the end of 3.2 parodies —",
      options: [
        "A Cavalier love-poem",
        "A genuine medieval prophecy commonly attributed to Chaucer, inverted for pessimistic effect",
        "A Latin hymn",
        "A modern lyric"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 79, anchor_line_end: 85
    }
  ];

  A.king_lear_act3_scene3 = [
    {
      line_start: 1, line_end: 22,
      citation_display: "King Lear 3.3.1–22",
      category: "structural",
      title: "Gloucester's mistake — Edmund becomes an informer",
      body: "Gloucester tells Edmund, in confidence, that he knows of a secret letter and intends to help Lear against the sisters' wishes. He even names the forbidden 'pity' he feels. Edmund's aside — 'This courtesy, forbid thee, shall the duke / Instantly know' — seals Gloucester's fate. The scene is twenty-two lines long and contains the whole mechanism by which Gloucester will be blinded. Shakespeare shows how every tragic sequence in this play runs on premature confidence: a parent telling a child a secret the child will weaponise. The structural echo of Lear's premature gift of the kingdom in 1.1 is exact.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)"]
    }
  ];
  T.king_lear_act3_scene3 = [
    {
      kind: "structural",
      prompt: "How does 3.3 parallel the opening scene?",
      options: [
        "It doesn't parallel anything",
        "A parent (Gloucester) confides in a child (Edmund) who instantly betrays him — echoing Lear's premature gift of trust to his daughters in 1.1",
        "It is set in the same location as 1.1",
        "It takes place at the same time of day"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 22
    }
  ];

  // ── 3.4 — Poor Tom (Tier 1) ─────────────────────────────────────────
  A.king_lear_act3_scene4 = [
    {
      line_start: 28, line_end: 42,
      citation_display: "King Lear 3.4.28–42",
      category: "thematic",
      title: "'Poor naked wretches' — Lear's first act of imagination",
      body: "Before entering the hovel, Lear pauses: 'Poor naked wretches, wheresoe'er you are, / That bide the pelting of this pitiless storm, / How shall your houseless heads and unfed sides, / Your loop'd and window'd raggedness, defend you / From seasons such as these? O, I have ta'en / Too little care of this! Take physic, pomp; / Expose thyself to feel what wretches feel, / That thou mayst shake the superflux to them, / And show the heavens more just.' This is the play's most remarkable moral moment — the king, stripped of his retinue, imagining for the first time the lives of those he ruled. 'Take physic, pomp' is the imperative he directs at his own past self: let royalty swallow the medicine of knowing what the poor endure. Critics read this as Lear's redemption-beginning, but its force comes from its too-lateness: the imagination arrives at the moment he is powerless to act on it. This is the play's argument for why moral imagination requires suffering.",
      sources: ["Stanley Cavell, 'The Avoidance of Love' in Disowning Knowledge (1987)", "Terry Eagleton, William Shakespeare (1986)"]
    },
    {
      line_start: 95, line_end: 130,
      citation_display: "King Lear 3.4.95–130",
      category: "historical",
      title: "Poor Tom's demons — Harsnett's 1603 Declaration as source",
      body: "Flibbertigibbet, Smulkin, Modo, Mahu, Obidicut, Hobbididance — Poor Tom's repertoire of demon-names is not random invention but direct borrowing from Samuel Harsnett's 'A Declaration of Egregious Popish Impostures' (1603). Harsnett's book was an exposure of staged exorcisms by Jesuit priests during the 1580s, naming the demons they claimed had possessed their subjects. Shakespeare, who was almost certainly reading the Declaration while writing Lear in 1605, has Edgar/Tom recite the names Harsnett's frauds had used. The effect is layered: Edgar is pretending to be possessed, using the language of actual frauds who pretended to be possessing, to fool demons who themselves are frauds. This is Shakespeare's most compact skepticism about religious spectacle — the theatrical demons of Poor Tom's madness turn out, source-wise, to be theatrical demons all the way down.",
      sources: ["Samuel Harsnett, A Declaration of Egregious Popish Impostures (1603)", "Stephen Greenblatt, 'Shakespeare and the Exorcists' in Shakespearean Negotiations (1988)"]
    },
    {
      line_start: 78, line_end: 95,
      citation_display: "King Lear 3.4.78–95",
      category: "close_reading",
      title: "'Unaccommodated man' — Lear strips",
      body: "Seeing Poor Tom in rags, Lear says: 'Is man no more than this? Consider him well... Thou art the thing itself: unaccommodated man is no more but such a poor, bare, forked animal as thou art.' He begins tearing off his own clothes: 'Off, off, you lendings!' The gesture is Lear's attempt to become 'the thing itself' — a creature without the false accommodations of culture. This is the play's most radical reduction. 'Poor, bare, forked animal' is the human as evolutionary fact: two legs forking from a trunk, nothing more. Shakespeare never comes closer to a non-theological anthropology than this line. Edgar's disguise has given Lear a mirror in which he sees what man is stripped of custom — and Lear insists on joining that image.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "R. A. Foakes, King Lear (Arden 3, 1997)"]
    },
    {
      line_start: 130, line_end: 160,
      citation_display: "King Lear 3.4.130–160",
      category: "close_reading",
      title: "'Learned Theban' — wisdom in madness",
      body: "Lear's insistence on treating Poor Tom as a philosopher ('Theban,' 'Athenian,' 'first let me talk with this philosopher') is the play's deepest irony about knowledge. Tom's speech is a jumble of demon-names, ballad-fragments, and folkloric oaths, and Lear takes it for wisdom. But Lear is not wrong. In a world where the sane (Goneril, Regan, Edmund) are the predators and the wise (Kent, Cordelia) have been banished, Tom's deranged honesty is more trustworthy than any coherent speech in the play. Lear's philosophical promotion of Tom is comedy of an extreme kind — but it also ratifies the play's argument that the truths of the broken are the only truths left. This is 'reason in madness' (Edgar's phrase in 4.6) at its opening instance.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    }
  ];
  T.king_lear_act3_scene4 = [
    {
      kind: "theme",
      prompt: "What does Lear's 'Poor naked wretches' speech (lines ~28–42) argue?",
      options: [
        "That he wants to return to the castle",
        "That royalty should 'take physic' — expose itself to the suffering of the poor so that wealth might be redistributed and the heavens made more just; moral imagination born of stripped power",
        "That he blames the storm",
        "That the poor deserve their fate"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 28, anchor_line_end: 42
    },
    {
      kind: "historical",
      prompt: "Where do Poor Tom's demon-names (Flibbertigibbet, Smulkin, Modo, Mahu) come from?",
      options: [
        "Shakespeare invented them",
        "Samuel Harsnett's 1603 'Declaration of Egregious Popish Impostures,' which exposed staged Jesuit exorcisms and named the demons the frauds had used",
        "Dante's Inferno",
        "The Book of Revelation"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 95, anchor_line_end: 130
    },
    {
      kind: "close_reading",
      prompt: "What does 'unaccommodated man' mean in Lear's reduction speech?",
      options: [
        "A man without a hotel room",
        "Man stripped of culture and custom — the 'poor, bare, forked animal' that remains when clothing, rank, and shelter are removed",
        "A man without family",
        "A man without education"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 78, anchor_line_end: 95
    },
    {
      kind: "inference",
      prompt: "Why is Lear's elevation of Poor Tom to 'philosopher' ironically correct?",
      options: [
        "It isn't correct at all",
        "In a world where the sane are predators and the wise banished, the broken Tom's deranged honesty is more trustworthy than any coherent speech in the play — 'reason in madness'",
        "Poor Tom is actually Plato",
        "Lear is hallucinating"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 130, anchor_line_end: 160
    }
  ];

  A.king_lear_act3_scene5 = [
    {
      line_start: 1, line_end: 19,
      citation_display: "King Lear 3.5.1–19",
      category: "close_reading",
      title: "Edmund the informer — the play's most efficient villainy",
      body: "Edmund betrays Gloucester to Cornwall in nineteen lines. 'This is the letter he spoke of, which approves him an intelligent party to the advantages of France.' Edmund's aside — 'I will persevere in my course of loyalty, though the conflict be sore between that and my blood' — is pure pretense; there is no conflict. Shakespeare lets Edmund's villainy be self-aware without qualm. The play's most chilling figures are not the raging sisters but this calm tactician who has studied how to convert kinship into profit. Edmund is modern in the worst sense: he does not hate his father; he just has a use for his father's blindness.",
      sources: ["Jonathan Dollimore, Radical Tragedy (1984)"]
    }
  ];
  T.king_lear_act3_scene5 = [
    {
      kind: "inference",
      prompt: "How does Edmund's betrayal of Gloucester differ in character from the sisters' cruelty to Lear?",
      options: [
        "It doesn't differ",
        "Edmund is calm, tactical, and profit-driven — not raging like the sisters; the play's most modern villainy is affective indifference, not hatred",
        "Edmund hates Gloucester more than the sisters hate Lear",
        "Edmund is acting under compulsion"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 19
    }
  ];

  // ── 3.6 — Q1-ONLY MOCK TRIAL — textual annotation ────────────────────
  A.king_lear_act3_scene6 = [
    {
      line_start: 20, line_end: 80,
      citation_display: "King Lear 3.6.20–80",
      category: "textual",
      title: "The mock trial — Q1-only material absent from the Folio",
      body: "The mock trial of Goneril and Regan — in which Lear, Kent, the Fool, and Edgar (as Poor Tom) hold court over two joint-stools standing in for the absent sisters — exists ONLY in the 1608 Quarto of King Lear (Q1). The 1623 Folio (F1) omits it entirely. This is one of the most significant Q1/F1 divergences in Shakespeare, and a test-case for editorial philosophy. Conflated editions (including Standard Ebooks' text) keep the trial. Some modern scholars (Gary Taylor, Michael Warren, Stanley Wells) argue that Q1 and F1 are different plays that Shakespeare revised, and that the Folio's excision of the mock trial was a deliberate late choice — tightening the scene, cutting a passage whose absurdity may have played better as read than staged. Whatever the textual politics, a reader encountering the conflated text encounters a scene Shakespeare may have later wanted removed. That layered presence matters: the trial is both definitively Shakespearean and potentially something he reconsidered.",
      sources: ["Gary Taylor and Michael Warren (eds.), The Division of the Kingdoms (1983)", "Stanley Wells and Gary Taylor, William Shakespeare: A Textual Companion (1987)"]
    },
    {
      line_start: 40, line_end: 70,
      citation_display: "King Lear 3.6.40–70",
      category: "structural",
      title: "Putting the daughters on trial — Lear's attempt to legislate grief",
      body: "Lear's mock court is a desperate attempt to do formally what the real justice system refuses: try Goneril and Regan for ingratitude. The scene has the structure of a legal proceeding (judges, prosecution, evidence) performed over absent defendants represented by furniture. It is bleakly funny and unbearably sad at once. The Fool's 'Come hither, mistress. Is your name Goneril?' addressing a joint-stool ratifies the theatrical convention. That Lear demands he 'arraign them straight' reveals the category-collapse: he believes the theater of the trial is itself justice. When Regan 'escapes' ('Stop her there!'), Lear screams of 'false justicers' — and is right in a way he does not mean. The play has taught by 3.6 that the court system cannot touch Goneril and Regan, so Lear improvises a parallel theater in the farmhouse. That this scene was later cut from the Folio may be because its bleakness pushed past what even Jacobean tragic convention could bear.",
      sources: ["R. A. Foakes, King Lear (Arden 3, 1997)"]
    }
  ];
  T.king_lear_act3_scene6 = [
    {
      kind: "structural",
      prompt: "The mock trial of Goneril and Regan in 3.6 is textually significant because —",
      options: [
        "It is the longest scene in the play",
        "It exists ONLY in the 1608 Quarto (Q1); the 1623 Folio (F1) omits it entirely — one of the most important Q1/F1 divergences in the Shakespeare canon",
        "It was added by an editor",
        "It is in prose"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 20, anchor_line_end: 80
    },
    {
      kind: "inference",
      prompt: "Why does Lear stage a mock trial on the heath?",
      options: [
        "For comic relief",
        "To improvise a parallel justice system because the real one cannot or will not try Goneril and Regan — Lear legislating grief when law has failed him",
        "To humiliate the Fool",
        "Because he misremembers the location"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 40, anchor_line_end: 70
    }
  ];

  // ── 3.7 — Blinding (Tier 1) ─────────────────────────────────────────
  A.king_lear_act3_scene7 = [
    {
      line_start: 70, line_end: 100,
      citation_display: "King Lear 3.7.70–100",
      category: "thematic",
      title: "'Out, vile jelly!' — the play's deliberate shock",
      body: "Cornwall's putting out of Gloucester's eyes, onstage, was shocking even by Jacobean standards. Earlier tragedies happen at a distance; here the violence is staged, with Gloucester bound, Cornwall's thumb described putting pressure on the eye. Nineteenth-century productions routinely cut or offstaged the blinding; Nahum Tate's 1681 adaptation simply omitted it. Shakespeare's deliberate choice to put the act in front of the audience is the play's moral argument made theatrical. Gloucester, who 'had eyes' metaphorically — who trusted what he could see and was therefore deceived by Edmund's forged letter — must literally lose them to perceive what his metaphorical sight missed. The 'Out, vile jelly!' line concentrates the play's horror into four words; 'jelly' reduces the eye to its biological substrate. Victorian audiences found this unbearable; modern audiences should not find it less so. The scene's purpose is to be unbearable.",
      sources: ["Jonathan Bate, Soul of the Age (2008)", "Stanley Wells, Shakespeare and Co. (2006)"]
    },
    {
      line_start: 82, line_end: 90,
      citation_display: "King Lear 3.7.82–90",
      category: "thematic",
      title: "The servant who intervenes — a tiny act of moral resistance",
      body: "In the middle of Gloucester's blinding, an unnamed First Servant — a household retainer — draws his sword on Cornwall: 'Hold your hand, my lord. / I have serv'd you ever since I was a child, / But better service have I never done you / Than now to bid you hold.' He wounds Cornwall fatally (the injury will kill Cornwall offstage, reported in 4.2). Regan snatches a sword and kills the servant from behind. The moment is easy to miss because it happens inside the scene's larger atrocity, but it is structurally crucial: the play's only direct onstage resistance to the sisters' cruelty comes not from a nobleman but from a serving-man, anonymous, who pays for it with his life. Shakespeare gives him no name because the point is that moral resistance can come from anywhere — and that in this play it is always punished.",
      sources: ["Terry Eagleton, William Shakespeare (1986)", "Kiernan Ryan, Shakespeare (1989)"]
    },
    {
      line_start: 100, line_end: 114,
      citation_display: "King Lear 3.7.100–114",
      category: "close_reading",
      title: "Gloucester's recognition — 'O my follies!'",
      body: "Blinded, Gloucester hears from Regan that 'it was he / That made the overture of thy treasons to us' — Edmund. The instant recognition: 'O my follies! then Edgar was abused. / Kind gods, forgive me that, and prosper him!' Gloucester achieves full understanding only after losing his eyes — the play's most ruthless formalization of its blindness-as-insight theme. Shakespeare makes the anagnorisis minimalist. Gloucester does not catalogue his errors; he names Edgar, asks forgiveness, hopes for his son's prospering. There is nothing left to do. The gods he invokes will not answer — 4.1's 'As flies to wanton boys' comes directly from this Gloucester, now fully disabused.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)"]
    }
  ];
  T.king_lear_act3_scene7 = [
    {
      kind: "theme",
      prompt: "Why does Shakespeare stage Gloucester's blinding onstage rather than reporting it?",
      options: [
        "Stage conventions required it",
        "The play's argument requires the shock — Gloucester who 'had eyes' metaphorically must lose them literally to perceive what his metaphorical sight missed; the scene's unbearability is its moral point",
        "Shakespeare wanted the play to be shorter",
        "It was a mistake"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 70, anchor_line_end: 100
    },
    {
      kind: "structural",
      prompt: "What is the significance of the unnamed First Servant who wounds Cornwall?",
      options: [
        "He is a minor comic figure",
        "The play's only direct onstage resistance to the sisters' cruelty — and it comes from an anonymous serving-man who dies for it; Shakespeare making moral resistance class-mobile and immediately punished",
        "He is actually Kent in disguise",
        "He is Cornwall's son"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 82, anchor_line_end: 90
    },
    {
      kind: "close_reading",
      prompt: "What does Gloucester recognise immediately after being blinded?",
      options: [
        "That Kent is alive",
        "That Edmund has betrayed him and Edgar was innocent — 'O my follies! then Edgar was abused' — full moral sight arrives only after physical blindness",
        "That Lear is safe",
        "Nothing at first"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 100, anchor_line_end: 114
    },
    {
      kind: "historical",
      prompt: "What did Nahum Tate's 1681 adaptation of Lear do with the blinding scene?",
      options: [
        "He expanded it",
        "He omitted it entirely — along with the tragic ending; Tate's Lear (in which Cordelia lives and marries Edgar) was the standard performance text for 150 years",
        "He moved it earlier in the play",
        "He kept it unchanged"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 70, anchor_line_end: 100
    }
  ];
};
