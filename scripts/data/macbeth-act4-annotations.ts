module.exports = function (ANN: any, TR: any, cite: (a:number,s:number,ls:number,le:number)=>string) {

  // ── 4.1 ──────────────────────────────────────────────────────────
  ANN.macbeth_act4_scene1 = [
    { line_start:1, line_end:38, citation_display:cite(4,1,1,38), category:"thematic",
      title:"The cauldron and the problem of the Witches",
      body:"The cauldron scene gives the Witches their most theatrical moment — and their most recognizable. The catalogue of ingredients ('eye of newt, and toe of frog') has become shorthand for stage witchcraft. But the scene's brilliance is the refusal to settle whether the Witches are real or theatrical.\n\nMany of the ingredients — eye of newt, toe of frog, wool of bat — are folk-names for herbs. 'Eye of newt' is mustard seed; 'toe of frog' is buttercup. An Elizabethan herbalist's handbook lets us read the scene as a recipe disguised as witchcraft — or witchcraft disguised as a recipe. Shakespeare refuses the disambiguation.\n\nAlso: the 'liver of blaspheming Jew,' 'nose of Turk,' 'Tartar's lips' belong to a catalogue of period anti-Semitism and Orientalism that a modern reader should see plainly. Early-modern English stage-magic borrowed the body parts of the religious Other as raw materials. It is not the play's most redeemable moment.",
      sources:["Reginald Scot, *The Discoverie of Witchcraft* (1584)","Kim F. Hall, *Things of Darkness* (1995)","Janet Clark & Eric Rasmussen, Arden 3 (2015)"] },
    { line_start:68, line_end:100, citation_display:cite(4,1,68,100), category:"thematic",
      title:"The three apparitions and the equivocation trap",
      body:"The apparitions are equivocations. A 'bloody child' promises Macbeth cannot be harmed by 'one of woman born' — a literal truth, but Macduff was delivered by Caesarean and is therefore not 'born' in the strict sense. A 'child crowned with a tree' promises Macbeth will be safe until Birnam wood comes to Dunsinane — a literal impossibility, until Malcolm's soldiers disguise themselves as branches. An armed head warns 'beware Macduff.'\n\nThe prophecies work by giving Macbeth three facts, each of which seems to grant invulnerability and each of which is the precise wording of his defeat. Lady Macbeth's 'serpent under't' pedagogy from 1.5 has come home: the Witches have looked like innocent flowers and are serpents. What Macbeth taught himself and his wife to do to Duncan is what the Sisters do to him.\n\nThe theatrical lesson is cruel. Equivocation — the doctrine the Porter scene associated with Henry Garnet — is not a vice practiced only by Jesuits and regicides. It is the structural principle of prophecy itself.",
      sources:["Garry Wills, *Witches and Jesuits* (1995)","William Empson, 'Dover Wilson on Macbeth' (1952)","Stephen Orgel, *The Authentic Shakespeare* (2002)"] },
    { line_start:105, line_end:130, citation_display:cite(4,1,105,130), category:"historical",
      title:"The show of eight kings: political flattery of James I",
      body:"The procession of eight kings is direct Jacobean flattery. James I, on the throne when *Macbeth* premiered in 1606, claimed descent from Banquo through the historical Fleance to Robert II and the Stuart kings. The eighth king in the procession holds a mirror — which, in the original Globe performance, would have reflected James himself seated in the audience.\n\nThe Stuart line ran: Robert II (r. 1371–1390), Robert III, James I of Scotland, James II, James III, James IV, James V, Mary Queen of Scots — and James VI of Scotland, who became James I of England in 1603. 'Some I see / That twofold balls and treble sceptres carry' refers to the multiple crowns James now wore: England, Scotland, and the claimed right to France.\n\nThe political reading of *Macbeth* starts here. The play is, among other things, a dramatized justification of James's legitimacy: the Stuart line survives because Fleance escapes in 3.3. The audience at Whitehall (where the play was probably performed for the Danish royal visit of August 1606) was watching the king's own genealogy be staged.",
      sources:["Henry N. Paul, *The Royal Play of Macbeth* (1950)","Alvin Kernan, *Shakespeare, the King's Playwright* (1995)","Jonathan Goldberg, *James I and the Politics of Literature* (1983)"] },
    { line_start:140, line_end:155, citation_display:cite(4,1,140,155), category:"thematic",
      title:"The decision to murder Macduff's family",
      body:"Learning that Macduff has fled to England, Macbeth vows: 'The castle of Macduff I will surprise; / Seize upon Fife; give to the edge o' the sword / His wife, his babes, and all unfortunate souls / That trace him in his line.' The decision is the play's cruelest because it has no strategic logic. Killing Macduff's family cannot stop Macduff; it can only enrage him.\n\nThe murder is an unmotivated atrocity. Macbeth is no longer calculating what will secure his crown; he is simply continuing to kill. The 'in blood stepp'd in so far' doctrine of 3.4 is now operative as automatic policy. The next scene (4.2) will show the killing, and 4.3 will show Macduff's grief — a triple-panel meditation on what Macbeth's tyranny has become.",
      sources:["A. C. Bradley (1904)","Paul A. Kottman (2009)"] },
  ];
  TR.macbeth_act4_scene1 = [
    { kind:"close_reading", prompt:"Several cauldron ingredients ('eye of newt,' 'toe of frog') are:",
      options:["Pure nonsense","Folk-names for herbs — the catalogue can be read as a herbalist's recipe disguised as witchcraft","Imaginary","Scottish slang"],
      answer_index:1, wisdom_reward:20, anchor_line_start:14, anchor_line_end:30 },
    { kind:"theme", prompt:"The three apparitions' prophecies work by:",
      options:["Pure truth","Equivocation — each prophecy is literally true but grammatically misleading in ways that become his defeat","Pure falsehood","Random chance"],
      answer_index:1, wisdom_reward:25, anchor_line_start:68, anchor_line_end:100 },
    { kind:"historical", prompt:"The 'show of eight kings' with the last bearing a mirror functions as:",
      options:["Random pageantry","Direct flattery of James I — James claimed descent from Banquo, and the mirror reflected James himself in the 1606 performance","A comic interlude","A funeral rite"],
      answer_index:1, wisdom_reward:30, anchor_line_start:105, anchor_line_end:130 },
    { kind:"inference", prompt:"Why does Macbeth order Macduff's family killed?",
      options:["Strategic advantage — it will stop Macduff","No strategic logic — the murder is the 'in blood stepp'd in so far' doctrine operative as automatic policy","Macduff's wife insulted him","Malcolm ordered it"],
      answer_index:1, wisdom_reward:25, anchor_line_start:140, anchor_line_end:155 },
    { kind:"comprehension", prompt:"The Second Apparition warns that Macbeth cannot be harmed by:",
      options:["Steel","One of woman born — a prophecy broken by Macduff's Caesarean delivery","Iron","A gunshot"],
      answer_index:1, wisdom_reward:15, anchor_line_start:78, anchor_line_end:85 },
  ];

  // ── 4.2 ──────────────────────────────────────────────────────────
  ANN.macbeth_act4_scene2 = [
    { line_start:1, line_end:40, citation_display:cite(4,2,1,40), category:"thematic",
      title:"Lady Macduff's complaint",
      body:"Lady Macduff's speech is the play's most direct moral statement from a woman. 'He loves us not; / He wants the natural touch.' Her husband has left her and their children exposed, and she calls it a violation of natural obligation. Ross's excuse — that Macduff's 'wisdom' knows best — she rejects: 'Wisdom! to leave his wife, to leave his babes, / His mansion and his titles, in a place / From whence himself does fly?'\n\nThe scene presents a second feminine counterweight to Lady Macbeth. Where Lady Macbeth renounced the maternal, Lady Macduff inhabits it and insists on its claims. Her argument — that the abstract duty of revolt cannot excuse the concrete duty of protection — is not given a rebuttal by the play. Ross leaves, her son holds the moral stage with her for sixty lines, and then the murderers arrive.",
      sources:["Janet Adelman (1992)","Marjorie Garber (2004)","Carol Chillington Rutter (2001)"] },
    { line_start:60, line_end:95, citation_display:cite(4,2,60,95), category:"structural",
      title:"The killing of the son",
      body:"The son is killed onstage: 'He has kill'd me, mother.' A thirteen-year-old Jacobean boy-actor speaks these words, and then dies while asking his mother to save herself. The scene is the play's most direct refutation of Lady Macbeth's 'I have given suck' boast from 1.7: here is the babe whose brains were dashed out, the promise kept. The image of the murdered child is now literal.\n\nShakespeare does not spare the audience. The scene runs to ninety-five lines, most of them the son's precocious back-and-forth with his mother ('What is a traitor?' 'Every one that does so is a traitor, and must be hanged'). The intimacy is deliberate. We watch the household for long enough to feel the domestic weight; then we watch it destroyed.\n\nThe scene has no strategic function in the plot. Its function is moral: to insist that the audience see what Macbeth's regime costs, counted in pennies.",
      sources:["A. C. Bradley (1904)","Harold Goddard (1951)","Ewan Fernie (2013)"] },
  ];
  TR.macbeth_act4_scene2 = [
    { kind:"theme", prompt:"Lady Macduff's argument against Ross is:",
      options:["Political","Moral: abstract duty of revolt cannot excuse concrete duty of protection — her children come first","Economic","Theological"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:40 },
    { kind:"structural", prompt:"The son's onstage murder is Shakespeare's:",
      options:["Comic relief","Direct refutation of Lady Macbeth's 'I have given suck' boast in 1.7 — here is the murdered babe, made literal","Political speech","Religious instruction"],
      answer_index:1, wisdom_reward:25, anchor_line_start:75, anchor_line_end:95 },
    { kind:"inference", prompt:"The scene's function in the plot is:",
      options:["Advance Macbeth's military plan","Moral — no strategic function; it forces the audience to see the human cost of Macbeth's regime","Introduce Macduff","Kill time"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:95 },
  ];

  // ── 4.3 ──────────────────────────────────────────────────────────
  ANN.macbeth_act4_scene3 = [
    { line_start:1, line_end:140, citation_display:cite(4,3,1,140), category:"thematic",
      title:"Malcolm's test",
      body:"The long scene in England is frequently cut in performance, which is a mistake. Its length is its point. Malcolm tests Macduff's loyalty by falsely accusing himself of every royal vice he can name — lust, avarice, lying, the whole negation of 'king-becoming graces.' The test is cruel: Macduff, who has just lost Scotland to one tyrant, is made to learn (he thinks) that the next king will be worse.\n\nThe test succeeds because Macduff finally breaks: 'Fit to govern! / No, not to live! O nation miserable...' His refusal to serve a man as corrupt as Malcolm has described is the proof that he is not a spy. Malcolm reveals the test, declares his virtue, and the scene becomes an extended meditation on the royal qualities that Scotland requires.\n\nThe scene is structural as well as political. It establishes the moral grounds on which Macbeth will be opposed — not merely as a usurper, but as the opposite of what kingship should be. The catalog of 'king-becoming graces' (justice, verity, temp'rance, stableness, bounty, perseverance, mercy, lowliness, devotion, patience, courage, fortitude) is the play's positive political theology, against which Macbeth's reign will be measured and found wanting.",
      sources:["Alan Sinfield (1992)","Peter Holland (2016)","James Shapiro, *The Year of Lear* (2015)"] },
    { line_start:140, line_end:175, citation_display:cite(4,3,140,175), category:"historical",
      title:"Edward the Confessor's royal touch",
      body:"The Doctor's report of Edward's healing ceremony ('strangely-visited people... the mere despair of surgery, he cures') is deliberate political topicality. James I, who had restored the royal touch ceremony after Elizabeth's intermittent practice, touched thousands of subjects during his reign; the coin ('stamp') Edward hangs around their necks was a real Jacobean medal. The scene is a direct advertisement for James's practice of the rite.\n\nSet dramatically against Macbeth's reign, it is argument: Edward's touch heals by divine legitimacy, Macbeth's touch kills. The power of kingship is not political but theological in this framing, and only the rightful king can access it. Malcolm, associated with Edward, inherits the healing power; Macbeth, in Scotland, is the principle's opposite.",
      sources:["Marc Bloch, *The Royal Touch* (1924, tr. 1973)","Stephen Greenblatt, *Shakespearean Negotiations* (1988)","Garry Wills (1995)"] },
    { line_start:200, line_end:240, citation_display:cite(4,3,200,240), category:"thematic",
      title:"'He has no children'",
      body:"Macduff's reply to Ross's report of his family's slaughter — 'He has no children' — is one of the most argued three-word lines in Shakespeare. The options are: (a) 'Malcolm has no children; he cannot understand my grief'; (b) 'Macbeth has no children; I cannot take revenge on his equivalently'; (c) some combination.\n\nThe line functions either way. If it is about Malcolm, it makes Macduff's grief the measure of what political counsel can and cannot understand — no speech about 'dispute it like a man' can reach him. If it is about Macbeth, it registers the wound of asymmetrical revenge: killing Macbeth will not restore Macduff's children.\n\nMalcolm's counsel — 'Dispute it like a man' — is met by Macduff's most cited reply: 'I shall do so; / But I must also feel it as a man.' Grief is redefined: manhood is not the suppression of feeling but the capacity to endure it.",
      sources:["A. C. Bradley (1904)","Harold Bloom (1998)","Edward Dowden, *Shakespeare* (1881)"] },
  ];
  TR.macbeth_act4_scene3 = [
    { kind:"structural", prompt:"Malcolm's false self-accusations function as:",
      options:["Honest confession","A loyalty test for Macduff — his final break ('Fit to govern! / No, not to live!') proves he is not a spy","A confession to the priest","Comic relief"],
      answer_index:1, wisdom_reward:25, anchor_line_start:50, anchor_line_end:115 },
    { kind:"historical", prompt:"Edward the Confessor's healing touch is:",
      options:["Fiction","Topical — James I revived the ceremony, making this a political advertisement for divine right","A modern invention","A Jewish ritual"],
      answer_index:1, wisdom_reward:25, anchor_line_start:140, anchor_line_end:175 },
    { kind:"close_reading", prompt:"Macduff's 'He has no children' (L198) is ambiguous. The two main readings are:",
      options:["'Malcolm has no children (can't understand)' OR 'Macbeth has no children (revenge is asymmetrical)' — either works","A simple factual statement","A joke","A mistranslation"],
      answer_index:0, wisdom_reward:25, anchor_line_start:196, anchor_line_end:200 },
    { kind:"theme", prompt:"Macduff redefines manhood when he says:",
      options:["'Dispute it like a man'","'I must also feel it as a man' — manhood is not suppression of feeling but capacity to endure it","'I will avenge them all'","'Let us rage'"],
      answer_index:1, wisdom_reward:25, anchor_line_start:220, anchor_line_end:225 },
  ];
};
