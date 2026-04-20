module.exports = function (ANN: any, TR: any, cite: (a:number,s:number,ls:number,le:number)=>string) {

  // ── 5.1 — TIER 1 — Sleepwalking ─────────────────────────────────
  ANN.macbeth_act5_scene1 = [
    { line_start:1, line_end:22, citation_display:cite(5,1,1,22), category:"structural",
      title:"The observers and the form of confession",
      body:"Shakespeare frames the sleepwalking scene with two silent witnesses: the Doctor of Physic and the Gentlewoman. Neither may repeat what Lady Macbeth says, but both are forced to hear. The form is the confession — sacramentally, the priest must not repeat what he hears. Shakespeare has placed a priest-stand-in at a scene of unconscious confession by a woman who cannot stop speaking.\n\nThe structural choice matters. We have not heard Lady Macbeth's inner voice since 3.2. Between then and now, the play gave her silence. What she stopped saying — about the murder, about her husband, about her conscience — pooled and returned in her sleep. The two witnesses allow the audience to hear what Lady Macbeth could not say while awake. The prohibition on repetition is Shakespeare's acknowledgment that what we are hearing should not be heard at all.",
      sources:["Janet Adelman (1992)","Coppélia Kahn, *Man's Estate* (1981)","Carol Chillington Rutter (2001)"] },
    { line_start:22, line_end:50, citation_display:cite(5,1,22,50), category:"thematic",
      title:"The habitual action of washing",
      body:"'Accustomed action with her, to seem thus washing her hands. I have known her continue in this a quarter of an hour.' Lady Macbeth's sleepwalking has ritualized itself. The hand-washing of 2.2 — 'A little water clears us of this deed' — has become a permanent, nightly, fifteen-minute automation.\n\nThe specific minute-count is the scene's most chilling detail. We are not watching a one-off outburst; we are watching a private liturgy that has been repeating for months. The water Lady Macbeth pours is the water that, by 2.2, she said would be sufficient; it has been proving itself insufficient nightly for the entire third act.\n\nThe play's most important revision of her confidence comes at line 55: 'all the perfumes of Arabia will not sweeten this little hand.' The Arabian spice trade was the Renaissance emblem of the most expensive commodity in the world. If the Arabian perfume cannot reach it, nothing can. Lady Macbeth is making, in her sleep, the argument Macbeth made to her awake in 2.2 — the 'multitudinous seas' will rather take on the blood than wash it off.",
      sources:["Caroline Spurgeon (1935)","Cleanth Brooks (1947)","Stephen Orgel (2002)"] },
    { line_start:50, line_end:69, citation_display:cite(5,1,50,69), category:"thematic",
      title:"Her spiritual diagnosis",
      body:"The Doctor's final line — 'More needs she the divine than the physician' — names what has happened to Lady Macbeth. Her illness is not medical but spiritual. The 'unnatural deeds' of 1.5 and 2.2 have produced 'unnatural troubles': sleep without rest, sight without vision, speech without listener. These are the classical symptoms of a soul separated from grace.\n\nThe play does not let Lady Macbeth die on stage. Her death is reported in 5.5, offstage, and Macbeth barely responds. Shakespeare's choice is precise: Lady Macbeth's death is not a scene but a rumor. She has become unrepresentable — not because she lacks dramatic weight, but because the scene we have just watched is her death. Everything after it is postscript.",
      sources:["A. C. Bradley (1904)","Ewan Fernie (2013)","Paul A. Kottman (2009)"] },
  ];
  TR.macbeth_act5_scene1 = [
    { kind:"structural", prompt:"Why are the Doctor and Gentlewoman both present?",
      options:["Medical accuracy","They function as priest-stand-ins at an unconscious confession — forced to hear, forbidden to repeat","For comic effect","To give Lady Macbeth company"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:22 },
    { kind:"close_reading", prompt:"The Gentlewoman notes Lady Macbeth continues the hand-washing 'a quarter of an hour.' This reveals:",
      options:["A one-off outburst","A nightly ritual that has been repeating for months — a private liturgy","Her cleanliness","A prescription from the Doctor"],
      answer_index:1, wisdom_reward:25, anchor_line_start:22, anchor_line_end:32 },
    { kind:"theme", prompt:"'All the perfumes of Arabia will not sweeten this little hand' functions as:",
      options:["A shopping preference","Lady Macbeth making, in her sleep, the argument Macbeth made to her awake in 2.2 — blood cannot be washed off","A geography lesson","A reference to prayer"],
      answer_index:1, wisdom_reward:25, anchor_line_start:35, anchor_line_end:38 },
    { kind:"inference", prompt:"The Doctor concludes 'More needs she the divine than the physician' because:",
      options:["He is a priest","Her illness is spiritual, not medical — the symptoms of a soul separated from grace","He is incompetent","It is bedtime"],
      answer_index:1, wisdom_reward:20, anchor_line_start:65, anchor_line_end:69 },
    { kind:"comprehension", prompt:"Lady Macbeth mentions three murders in her sleep. They are:",
      options:["Duncan, Banquo, Macduff's family (the Thane of Fife's wife)","Duncan, Malcolm, Macduff","Banquo, Fleance, Ross","Duncan, Banquo, Malcolm"],
      answer_index:0, wisdom_reward:20, anchor_line_start:32, anchor_line_end:50 },
  ];

  // ── 5.2 ──────────────────────────────────────────────────────────
  ANN.macbeth_act5_scene2 = [
    { line_start:11, line_end:22, citation_display:cite(5,2,11,22), category:"close_reading",
      title:"'Like a giant's robe upon a dwarfish thief'",
      body:"Angus's image for Macbeth's failing reign returns the play to its most sustained metaphor: kingship is clothing. Macbeth's title 'Hangs loose about him, like a giant's robe / Upon a dwarfish thief.' Cleanth Brooks's essay 'The Naked Babe and the Cloak of Manliness' reads this moment as the clothing-image system's summary statement.\n\nThe thief has stolen a robe cut for a bigger man. The longer he wears it, the more absurd he looks. The problem is not that Macbeth's ambition was too small (the play explicitly calls it 'vaulting'); the problem is that the office of king is not a fit: it was not cut for him, because kingship in this play's theology is a natural inheritance, not a position to be occupied.\n\nThe metaphor's last iteration will be Malcolm's coronation in 5.8, where the robe finds its body. The play's theological reading of kingship — inherited legitimacy restored after usurpation — is also a theatrical reading: it is about what fits.",
      sources:["Cleanth Brooks (1947)","Caroline Spurgeon (1935)","A. P. Rossiter, *Angel with Horns* (1961)"] },
  ];
  TR.macbeth_act5_scene2 = [
    { kind:"close_reading", prompt:"'Like a giant's robe upon a dwarfish thief' summarizes:",
      options:["A tailor's mistake","The play's clothing-image system — Macbeth's kingship is a stolen robe that does not fit","A prophecy","A battle plan"],
      answer_index:1, wisdom_reward:25, anchor_line_start:11, anchor_line_end:22 },
    { kind:"inference", prompt:"'Minutely revolts upbraid his faith-breach' means:",
      options:["He is sick","Minute-by-minute defections reproach him for broken loyalty — his support is collapsing in real time","His subjects are angels","The clock is wrong"],
      answer_index:1, wisdom_reward:20, anchor_line_start:10, anchor_line_end:12 },
  ];

  // ── 5.3 ──────────────────────────────────────────────────────────
  ANN.macbeth_act5_scene3 = [
    { line_start:22, line_end:30, citation_display:cite(5,3,22,30), category:"thematic",
      title:"'The sere, the yellow leaf'",
      body:"Macbeth's autumnal self-portrait — 'My way of life / Is fall'n into the sere, the yellow leaf' — is the play's most direct statement that he knows what he has lost. The things old age should command, he lists as already absent: 'honour, love, obedience, troops of friends.' In their place he has 'curses, not loud but deep, mouth-honour, breath.'\n\nThe speech's precision matters. Macbeth is not self-pitying; he is accurate. 'Mouth-honour' — lip-service, formal praise that is not meant — is exactly what a failing tyrant receives, and exactly what Macbeth has been getting since 3.1. The diagnosis is correct. The grief is that the diagnosis has come too late to revise the conduct.",
      sources:["Harold Bloom (1998)","A. D. Nuttall (2007)","Harold Goddard (1951)"] },
    { line_start:40, line_end:56, citation_display:cite(5,3,40,56), category:"close_reading",
      title:"'Minister to a mind diseas'd'",
      body:"Macbeth's plea to the Doctor about Lady Macbeth is the play's most direct articulation of its psychiatric vocabulary: 'rooted sorrow,' 'written troubles of the brain,' 'stuff'd bosom,' 'sweet oblivious antidote.' The Jacobean audience did not have a clinical discipline of mental illness; Shakespeare is inventing one in front of them.\n\nThe Doctor's answer — 'Therein the patient / Must minister to himself' — is the play's most important refusal. There is no medicine for a soul that has chosen its own affliction. Macbeth's response ('Throw physic to the dogs') is refusal of refusal; he will not accept what the Doctor has said. The scene ends with him arming for battle he already knows he will not win.",
      sources:["Andrew Lemon, *A Strange Kind of Truth* (2020)","Ewan Fernie (2013)"] },
  ];
  TR.macbeth_act5_scene3 = [
    { kind:"close_reading", prompt:"'Sere, the yellow leaf' is:",
      options:["Agricultural advice","Macbeth's autumnal self-diagnosis — he can name exactly what he has lost","A weather forecast","An allusion to Spring"],
      answer_index:1, wisdom_reward:25, anchor_line_start:22, anchor_line_end:30 },
    { kind:"theme", prompt:"The Doctor's answer about Lady Macbeth ('the patient must minister to himself') is:",
      options:["Standard medicine","The play's refusal of psychiatric cure for chosen affliction","A joke","A confession of incompetence"],
      answer_index:1, wisdom_reward:25, anchor_line_start:45, anchor_line_end:52 },
  ];

  // ── 5.4 ──────────────────────────────────────────────────────────
  ANN.macbeth_act5_scene4 = [
    { line_start:1, line_end:10, citation_display:cite(5,4,1,10), category:"structural",
      title:"Birnam wood, literally",
      body:"Malcolm's order — 'Let every soldier hew him down a bough, / And bear't before him' — is the prophecy's literal fulfillment. The Sisters promised Macbeth could not be vanquished until Birnam wood came to Dunsinane; Malcolm's soldiers carry branches, and the wood moves. The equivocation the apparitions relied on — a literal impossibility becoming a literal truth — is here reversed by military strategy.\n\nThe tactic is real. Ancient and medieval armies used boughs to disguise troop numbers — there is a plausible historical precedent, though the particular incident is Shakespeare's invention (or Holinshed's, from whose *Chronicles* Shakespeare drew). The scene is ten lines long. It is the shortest scene in the play. Its function is to let the audience see the prophecy break, before Macbeth does.",
      sources:["Raphael Holinshed, *Chronicles of Scotland* (1577)","Geoffrey Bullough, *Narrative and Dramatic Sources of Shakespeare* vol. 7 (1973)"] },
  ];
  TR.macbeth_act5_scene4 = [
    { kind:"structural", prompt:"Malcolm's 'hew him down a bough' tactic:",
      options:["Is decorative","Is the literal fulfillment of the Birnam-wood prophecy — military strategy defeats equivocation","Is a hunting technique","Is a religious ritual"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:10 },
  ];

  // ── 5.5 — TIER 1 — Tomorrow speech ──────────────────────────────
  ANN.macbeth_act5_scene5 = [
    { line_start:15, line_end:17, citation_display:cite(5,5,15,17), category:"structural",
      title:"'The queen, my lord, is dead' — the flatness is the point",
      body:"Seyton delivers Lady Macbeth's death in five words. Macbeth's reply is almost as short: 'She should have died hereafter; / There would have been a time for such a word.' The couple who opened Act 1 writing to each other about glorious futures now communicates through a functionary's terse report and a husband's disordered shrug.\n\nThe flatness is the point. Macbeth does not weep; he notes. The woman who drove him to regicide, the wife whose hands he once could not look at, the mother of his unborn children (the 'babe that milks me' of 1.7) — dead, and his first response is a schedule complaint. She should have died later.\n\nShakespeare's refusal to give Macbeth any grief at this moment is not authorial coldness. It is authorial precision. The man has 'supp'd full with horrors' (L13, one line earlier). The direness his slaughterous thoughts have learned has cauterized the response to death itself. The tragedy's argument — that continued evil extinguishes feeling — has arrived at its strongest demonstration.",
      sources:["A. C. Bradley (1904)","Harold Bloom (1998)","Paul A. Kottman (2009)"] },
    { line_start:18, line_end:27, citation_display:cite(5,5,18,27), category:"thematic",
      title:"'Tomorrow and tomorrow and tomorrow': nihilism in its context",
      body:"The speech's nihilism is not abstract. It arrives in a specific context: Macbeth has just learned his wife is dead, and Shakespeare immediately follows her death with his most extended meditation on meaninglessness. The 'signifying nothing' is addressed to the life that has just ended.\n\nThe speech's philosophical content has been read as precocious existentialism (Macbeth as Shakespeare's Camus), as medieval contemptus mundi (life as shadow in the tradition of Thomas à Kempis), and as characterization (the nihilism of a man who has destroyed everything he cared about). All three readings are right simultaneously.\n\nWhat makes the speech bearable, theatrically, is the precision of its grammar. 'To-morrow, and to-morrow, and to-morrow, / Creeps in this petty pace from day to day / To the last syllable of recorded time.' The future and the past collapse into one mechanical process. The iambic pentameter ticks like a clock. Time is not the enemy of meaning here; time is the absence of meaning, revealed.\n\nThe speech is where Macbeth's tragedy concentrates. He has killed Duncan for a crown, lost his wife, killed innocents, and arrived at the conclusion that it was all sound and fury. Shakespeare does not correct him. The play's conclusion — Malcolm's restoration, the healing of the state — is given to others. Macbeth's voice, in his last major speech, finds only the void.",
      sources:["William Hazlitt, *Characters of Shakespeare's Plays* (1817)","G. Wilson Knight, *The Wheel of Fire* (1930)","Jan Kott, *Shakespeare Our Contemporary* (1964)","Harold Bloom (1998)"] },
    { line_start:41, line_end:50, citation_display:cite(5,5,41,50), category:"thematic",
      title:"'The equivocation of the fiend'",
      body:"Told that Birnam wood is moving, Macbeth names his defeat: 'I pull in resolution, and begin / To doubt the equivocation of the fiend, / That lies like truth.' The doctrine the Porter associated with Henry Garnet in 2.3 — swearing truly while reserving mental truths — has been applied to him by the Sisters. His own 'serpent under the flower' method has been turned.\n\nThe line closes a structural arc. The play's first great paradox ('Fair is foul') was announced by the Witches in 1.1. Its second ('Look like the innocent flower, / But be the serpent under't') was delivered by Lady Macbeth in 1.5. Now, at the end, Macbeth is the victim of the same technique he helped promulgate. The political allegory (Garnet, Gunpowder Plot, Jesuit equivocation) meets its ethical match: equivocation as a doctrine of power returns to destroy those who practiced it.",
      sources:["Garry Wills, *Witches and Jesuits* (1995)","William Empson (1952)","Alvin Kernan (1995)"] },
  ];
  TR.macbeth_act5_scene5 = [
    { kind:"structural", prompt:"Seyton's 'The queen, my lord, is dead' is followed by Macbeth's:",
      options:["Weeping","'She should have died hereafter' — a flat schedule complaint; the tragic point is the absence of grief","A speech of love","Prayers"],
      answer_index:1, wisdom_reward:25, anchor_line_start:15, anchor_line_end:17 },
    { kind:"theme", prompt:"The 'tomorrow' speech's nihilism arrives:",
      options:["Out of nowhere","Immediately after Lady Macbeth's death announcement — the meaninglessness is addressed to her life","Mid-battle","At dawn"],
      answer_index:1, wisdom_reward:25, anchor_line_start:15, anchor_line_end:27 },
    { kind:"close_reading", prompt:"'Signifying nothing' is the speech's:",
      options:["Opening line","Final phrase — the arrival point of the argument; the end of meaning itself","Middle quotation","Stage direction"],
      answer_index:1, wisdom_reward:20, anchor_line_start:26, anchor_line_end:27 },
    { kind:"structural", prompt:"Macbeth naming 'the equivocation of the fiend':",
      options:["Is random","Closes an arc — the Witches have used on him the 'serpent under the flower' technique he helped promulgate","Is incorrect","Is a compliment"],
      answer_index:1, wisdom_reward:25, anchor_line_start:41, anchor_line_end:45 },
    { kind:"close_reading", prompt:"'Life's but a walking shadow, a poor player / That struts and frets his hour upon the stage' figures life as:",
      options:["A dream","A bad theatrical performance — 'poor player' is an unskilled actor","A king","A flower"],
      answer_index:1, wisdom_reward:20, anchor_line_start:23, anchor_line_end:26 },
    { kind:"theme", prompt:"The speech has been read as:",
      options:["Only as medieval contemptus mundi","Multiple coherent readings at once: existentialism, medieval contemptus mundi, and character — Macbeth's psychological end-point","Only as Protestant theology","Only as character study"],
      answer_index:1, wisdom_reward:25, anchor_line_start:18, anchor_line_end:27 },
  ];

  // ── 5.6, 5.7, 5.8 ───────────────────────────────────────────────
  ANN.macbeth_act5_scene6 = [
    { line_start:1, line_end:10, citation_display:cite(5,6,1,10), category:"structural",
      title:"The order to drop the branches",
      body:"Eleven lines. Malcolm tells his soldiers to throw down the branches they have been carrying — the prophecy has served its purpose, and now the army must be seen. The scene is the precise inverse of 5.4 (the order to cut branches). Shakespeare frames the defeat of equivocation as two short scenes bracketing the 'tomorrow' speech: 5.4 prepares the trick, 5.6 reveals it. The pivot is Macbeth's speech in 5.5.",
      sources:["Harold Goddard (1951)"] },
  ];
  TR.macbeth_act5_scene6 = [
    { kind:"structural", prompt:"5.6's eleven lines function as:",
      options:["Filler","The reveal — soldiers drop the branches they used to disguise their numbers in 5.4","A banquet","A death scene"],
      answer_index:1, wisdom_reward:15, anchor_line_start:1, anchor_line_end:10 },
  ];

  ANN.macbeth_act5_scene7 = [
    { line_start:1, line_end:10, citation_display:cite(5,7,1,10), category:"thematic",
      title:"'They have tied me to a stake'",
      body:"Macbeth figures himself as a bear in a bear-baiting pit — tied to a stake, unable to flee, forced to fight the dogs. The reference is specific: bear-baiting was a Southwark spectacle staged alongside plays in Shakespeare's period, often in the same theaters. The audience knew the image literally. Macbeth has become the attraction at an entertainment.\n\nThe image is his last piece of self-knowledge. He is no longer the 'Bellona's bridegroom' of 1.2; he is the bear who cannot run. His 'charmed life' ('none of woman born') is about to be tested by Young Siward and then Macduff. The first test he passes, because Young Siward is in fact woman-born; the second will break him.",
      sources:["Andrew Gurr, *The Shakespearean Stage 1574–1642* (1992)","Tiffany Stern, *Documents of Performance in Early Modern England* (2009)"] },
  ];
  TR.macbeth_act5_scene7 = [
    { kind:"close_reading", prompt:"'They have tied me to a stake' references:",
      options:["A religious punishment","Bear-baiting — a spectacle staged alongside plays in Shakespeare's theaters; Macbeth is the attraction","A farming practice","A military tactic"],
      answer_index:1, wisdom_reward:20, anchor_line_start:1, anchor_line_end:10 },
  ];

  ANN.macbeth_act5_scene8 = [
    { line_start:17, line_end:32, citation_display:cite(5,8,17,32), category:"thematic",
      title:"The equivocation sprung",
      body:"Macbeth's confidence in the Second Apparition's prophecy breaks in a single exchange. 'I bear a charmed life, which must not yield / To one of woman born.' Macduff: 'Despair thy charm; / And let the angel whom thou still hast served / Tell thee, Macduff was from his mother's womb / Untimely ripp'd.' Caesarean birth — which early-modern medicine categorized as not, strictly, 'born' in the ordinary sense — has made Macduff the prophecy's loophole.\n\nMacbeth's response — 'these juggling fiends no more believed, / That palter with us in a double sense' — is the play's closing indictment of equivocation. The Porter's equivocator from 2.3, the Witches' double meanings from 4.1, Lady Macbeth's 'serpent under the flower' from 1.5 — all have combined to produce this defeat. Macbeth dies knowing he has been played by his own technique.\n\nHis last line (Lay on, Macduff; / And damn'd be him that first cries, Hold, enough!) recovers something. He has lost everything, but he will not surrender. The soldier Macbeth of 1.2 returns in the last couplet. It is not redemption — but it is a kind of closing coherence.",
      sources:["A. C. Bradley (1904)","Harold Bloom (1998)","Paul A. Kottman (2009)"] },
    { line_start:55, line_end:76, citation_display:cite(5,8,55,76), category:"historical",
      title:"Malcolm's coronation and the new earldoms",
      body:"Malcolm's coronation speech makes Scotland's Thanes into 'earls' — the first earls in Scottish history, per Holinshed. The play ends with an administrative innovation: Scotland will be reorganized on the English model. Macduff, not Malcolm, delivers the line naming Macbeth 'this dead butcher and his fiend-like queen,' setting the official verdict.\n\nThe play's final couplet belongs to the restored state: 'So thanks to all at once and to each one, / Whom we invite to see us crown'd at Scone.' Scone — the coronation site first mentioned in 2.4 as the site of Macbeth's crowning — now receives Malcolm. The play has taken the audience from Duncan's body (2.3) to Macbeth's crowning (2.4, offstage) to Malcolm's crowning (5.8, also offstage). Three kings, one throne, one site. The political order has been cycled through rupture and restoration.\n\nThe audience of 1606 would have read the conclusion as confirmation of the Stuart legitimacy theme: disorder is chaotic but temporary; rightful kingship returns. It was what James I wanted the play to mean. It is also what the play means. The two are not incompatible.",
      sources:["Raphael Holinshed, *Chronicles* (1577)","Henry N. Paul (1950)","Alvin Kernan (1995)"] },
  ];
  TR.macbeth_act5_scene8 = [
    { kind:"structural", prompt:"What breaks Macbeth's charmed-life confidence?",
      options:["Young Siward's attack","Macduff's revelation that he was 'from his mother's womb untimely ripp'd' — Caesarean birth is the prophecy's loophole","Malcolm's army","Lady Macbeth's death"],
      answer_index:1, wisdom_reward:25, anchor_line_start:17, anchor_line_end:32 },
    { kind:"theme", prompt:"Macbeth's last line ('Lay on, Macduff') recovers:",
      options:["Regret","The soldier of 1.2 — not redemption, but closing coherence; he refuses to surrender","Joy","Religious faith"],
      answer_index:1, wisdom_reward:25, anchor_line_start:35, anchor_line_end:42 },
    { kind:"historical", prompt:"Malcolm's creation of 'earls' at the end:",
      options:["Is fictional filler","Is historical — per Holinshed, the first earls in Scottish history, reorganizing Scotland on the English model","Is a joke","Is unconstitutional"],
      answer_index:1, wisdom_reward:20, anchor_line_start:60, anchor_line_end:76 },
  ];
};
