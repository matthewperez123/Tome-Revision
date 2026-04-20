module.exports = function (ANN: any, TR: any, cite: (a:number,s:number,ls:number,le:number)=>string) {

  // ── 1.1 ─────────────────────────────────────────────────────────────
  ANN.macbeth_act1_scene1 = [
    { line_start:1, line_end:13, citation_display:cite(1,1,1,13), category:"structural",
      title:"Thirteen lines that set the weather",
      body:"The shortest opening in Shakespeare. Thunder, three witches, a paradox ('Fair is foul, and foul is fair'), and an exit. Nothing is explained; the audience is handed an atmosphere and told that moral categories are about to invert.\n\nThe scene is a tonal overture rather than an exposition. Compare the deliberate exposition of *Hamlet* (the ghost, the watch, the state of Denmark) with this. *Macbeth* does not argue its weather; it declares it. The three witches will not appear again until line 32 of 1.3 — but the paradox they hand the audience is already installed, waiting for Macbeth's unwitting echo when he enters the play saying 'So foul and fair a day I have not seen.'",
      sources:["A. C. Bradley, *Shakespearean Tragedy* (1904)","L. C. Knights, 'How Many Children Had Lady Macbeth?' (1933)"] },
  ];
  TR.macbeth_act1_scene1 = [
    { kind:"close_reading", prompt:"The Witches' line 'Fair is foul, and foul is fair' does what for the play?",
      options:["Announces the weather","Establishes a paradox about moral inversion that Macbeth will unwittingly echo in 1.3","Invokes a specific biblical passage","Describes the Scottish highlands"],
      answer_index:1, wisdom_reward:20, anchor_line_start:10, anchor_line_end:11 },
    { kind:"comprehension", prompt:"Where do the Witches plan to meet Macbeth?",
      options:["A hall in the palace","On the battlefield","On the heath, after the battle ends","At Inverness"],
      answer_index:2, wisdom_reward:10, anchor_line_start:6, anchor_line_end:8 },
  ];

  // ── 1.2 ─────────────────────────────────────────────────────────────
  ANN.macbeth_act1_scene2 = [
    { line_start:9, line_end:25, citation_display:cite(1,2,9,25), category:"thematic",
      title:"Macbeth as Bellona's bridegroom: the problem of praise",
      body:"The bleeding Captain's report introduces Macbeth not as a man but as a killing machine. He 'unseam'd him from the nave to the chaps' — a graphic battlefield image that lets the audience see Macbeth's capacity for violence before he ever enters. The Captain's praise is extravagant ('Bellona's bridegroom'), figuring Macbeth as the husband of the Roman war goddess.\n\nThe praise matters structurally. What we will later see Macbeth do — to Duncan, Banquo, Macduff's family — he first did on the battlefield, and he was rewarded for it. The play's moral economy refuses a clean line between the sanctioned violence of war and the prohibited violence of murder. Macbeth's skill at one made his access to the other possible.\n\nShakespeare does not sentimentalize. The Captain's tongue-in-cheek horror at Macbeth's surgery with a sword tells the audience what kind of heroic economy Scotland runs on.",
      sources:["Stephen Greenblatt, *Will in the World* (2004), ch. 12","Janet Adelman, *Suffocating Mothers* (1992)"] },
    { line_start:46, line_end:56, citation_display:cite(1,2,46,56), category:"historical",
      title:"The Thane of Cawdor's title, and its transfer",
      body:"Duncan's royal act — stripping a traitor of his title and bestowing it on a loyal subject — is presented as swift, clean, legitimate. But the play will spend its next five acts exposing how fragile that transfer is. Titles, the play will show, are clothing: they fit only the man for whom they were cut.\n\nThe 'Thane of Cawdor' is about to become, in rapid succession, three different men: the executed traitor, Macbeth the newly loyal, Macbeth the regicide. Shakespeare is careful: the title never really belongs to Macbeth, and the play's clothing imagery (culminating in the 'giant's robe upon a dwarfish thief' in 5.2) begins here.",
      sources:["Cleanth Brooks, 'The Naked Babe and the Cloak of Manliness' (1947)"] },
  ];
  TR.macbeth_act1_scene2 = [
    { kind:"comprehension", prompt:"What does the Captain report about Macbeth's defeat of Macdonwald?",
      options:["Macbeth fled","Macbeth killed Macdonwald in single combat by splitting him from navel to jaws","Macbeth captured him and demanded ransom","Macbeth made a treaty"],
      answer_index:1, wisdom_reward:15, anchor_line_start:18, anchor_line_end:25 },
    { kind:"close_reading", prompt:"Calling Macbeth 'Bellona's bridegroom' (L54) does what?",
      options:["Names his actual wife","Figures him as husband of the Roman war goddess — a high, violent praise","States his military rank","Insults his cowardice"],
      answer_index:1, wisdom_reward:15, anchor_line_start:52, anchor_line_end:56 },
    { kind:"inference", prompt:"Why does Shakespeare open the play with a military report celebrating Macbeth's violence?",
      options:["To bore the audience with exposition","To establish that Macbeth's capacity for murder was honored before it was feared — the transfer from soldier to regicide is shorter than it looks","To explain Scottish politics","To introduce minor characters"],
      answer_index:1, wisdom_reward:25, anchor_line_start:9, anchor_line_end:56 },
  ];

  // ── 1.3 — TIER 1 — First prophecy ─────────────────────────────────
  ANN.macbeth_act1_scene3 = [
    { line_start:19, line_end:45, citation_display:cite(1,3,19,45), category:"linguistic",
      title:"Weird: not strange, but wyrd",
      body:"The modern English 'weird' — meaning odd or uncanny — is a sense the word only fully acquired in the 19th century, and largely because of this play. In 1606, 'weird' carried its Old English root 'wyrd': fate, destiny, the unfolding of what must be. The Norns of Norse mythology, spinners of fate, are often translated as the Weird Sisters.\n\nThis matters for the play's metaphysics. If the Sisters are *weird* in the modern sense, they are merely odd witches. If they are *wyrd*, they are agents of fate — not causes of the murder, but its annunciators. The difference determines whether *Macbeth* is a play about what Macbeth chose to do or about what he was always going to do. Shakespeare's text refuses to settle the question; the word carries both possibilities at once, and the production must choose.\n\nScholarly editors (Braunmuller's New Cambridge, Kerrigan, Clark & Mason) all flag this. When Banquo calls them 'weird sisters' (and later 'imperfect speakers'), he is invoking the Fates of classical myth, not hedge-magic.",
      sources:["OED, 'weird, adj. and n.'","A. R. Braunmuller (ed.), New Cambridge *Macbeth* (1997)","Janet Clark & Eric Rasmussen, Arden 3 *Macbeth* (2015)"] },
    { line_start:48, line_end:85, citation_display:cite(1,3,48,85), category:"thematic",
      title:"Banquo and Macbeth: two reactions, one prophecy",
      body:"The prophecy arrives in the same words to both men. Their reactions differ completely. Macbeth is 'rapt withal' — absorbed, silent, visibly shaken. Banquo, seeing this, asks the Sisters for his own future and takes their words as information to be examined, not commands to be obeyed.\n\nShakespeare's staging here is moral: two men hear the same temptation and react differently. Macbeth's silence is already the murder; he has accepted the future the Sisters describe. Banquo's questions are the defense. The scene demonstrates that the prophecy does not cause the tragedy; it reveals which men will make the tragedy happen.\n\nCompare the Delphic oracle in *Oedipus Rex*: the oracle tells Oedipus he will kill his father, and his attempt to escape it enacts it. In *Macbeth* the Sisters tell a truth, and Macbeth makes it true through action. The difference between Greek fate and Shakespearean fate is the difference between the inevitable and the chosen.",
      sources:["A. C. Bradley, *Shakespearean Tragedy* (1904)","Harold Bloom, *Shakespeare: The Invention of the Human* (1998)","Paul A. Kottman, *Tragic Conditions in Shakespeare* (2009)"] },
    { line_start:130, line_end:170, citation_display:cite(1,3,130,170), category:"close_reading",
      title:"'If chance will have me king, why, chance may crown me'",
      body:"Macbeth's first soliloquy after the prophecy is a masterwork of self-deception. He tells himself fate will act for him — 'If chance will have me king, why, chance may crown me, / Without my stir.' The phrase 'without my stir' is the key: Macbeth is asking whether he can have the crown without doing anything for it. The soliloquy lets us see him already considering that he might have to 'stir.'\n\nThe language is already the language of the later soliloquies. 'Horrid image,' 'seated heart knock at my ribs,' 'single state of man' — these are the images of 1.7 and 2.1, already present in miniature. Macbeth is not slowly corrupted by Iago-figures; he is visibly already there, thirty lines after meeting the Sisters.\n\nNotice the syntactical breakage. His speech in 1.2 (as reported) was coherent, military, direct. Here it fragments under the weight of the imagined deed. The play will watch this syntax continue to crack.",
      sources:["L. C. Knights, *Some Shakespearean Themes* (1959)","A. D. Nuttall, *Shakespeare the Thinker* (2007)"] },
  ];
  TR.macbeth_act1_scene3 = [
    { kind:"close_reading", prompt:"When Shakespeare calls them 'weird sisters,' what does the word 'weird' mean in 1606?",
      options:["Strange, odd, or uncanny (the modern sense)","From Old English 'wyrd' — fate, destiny; they are the Fates, not hedge-witches","An invented Shakespeare word with no root","A technical term for Scottish witchcraft"],
      answer_index:1, wisdom_reward:25, anchor_line_start:19, anchor_line_end:45 },
    { kind:"inference", prompt:"How do Macbeth's and Banquo's responses to the prophecy differ?",
      options:["They respond identically with caution","Macbeth goes silent and absorbed; Banquo questions the Sisters and examines the news rationally","Macbeth laughs; Banquo weeps","Both ignore the Sisters entirely"],
      answer_index:1, wisdom_reward:20, anchor_line_start:48, anchor_line_end:85 },
    { kind:"theme", prompt:"Shakespeare's 'weird sisters' differ from Greek fate in that:",
      options:["They have no causal power","The Sisters tell truths; Macbeth must act to make them true — fate is declared, choice makes it real","They act physically on their victims","They cannot see the future accurately"],
      answer_index:1, wisdom_reward:25, anchor_line_start:48, anchor_line_end:160 },
    { kind:"close_reading", prompt:"'If chance will have me king, why, chance may crown me, / Without my stir' reveals Macbeth:",
      options:["Is innocent of murderous intent","Is already considering that he might have to 'stir' — that is, act","Trusts God entirely","Wants to abdicate"],
      answer_index:1, wisdom_reward:25, anchor_line_start:154, anchor_line_end:160 },
    { kind:"comprehension", prompt:"What three prophecies do the Sisters deliver to Macbeth?",
      options:["King, thane of Cawdor, thane of Glamis","Thane of Glamis, thane of Cawdor, king hereafter","Earl, king, emperor","Soldier, father, king"],
      answer_index:1, wisdom_reward:10, anchor_line_start:43, anchor_line_end:47 },
  ];

  // ── 1.4 ────────────────────────────────────────────────────────────
  ANN.macbeth_act1_scene4 = [
    { line_start:11, line_end:21, citation_display:cite(1,4,11,21), category:"thematic",
      title:"'No art to find the mind's construction in the face'",
      body:"Duncan's line about the first Thane of Cawdor — that there is no art to read inner mind from outer face — is delivered at the exact moment Macbeth, his new Thane of Cawdor, enters the stage. The dramatic irony is too pointed to miss: Duncan's epistemological humility is exactly right, and exactly fatal. He cannot read the face of the man he is about to host.\n\nThis is the play's first serious engagement with its central moral problem. Hamlet asked whether the ghost's report could be trusted. *Othello* asks whether Desdemona's face tells the truth. *Macbeth* asks whether any face, king or subject, is legible at all. Duncan says no, and proceeds as if yes.",
      sources:["Stanley Cavell, *Disowning Knowledge* (2003)","A. D. Nuttall (2007)"] },
    { line_start:45, line_end:53, citation_display:cite(1,4,45,53), category:"close_reading",
      title:"'Stars, hide your fires'",
      body:"Macbeth's aside concludes with his first direct prayer for darkness. 'Stars, hide your fires; / Let not light see my black and deep desires.' The dissociation is already advanced: the hand must not know what the eye sees. This will become the play's recurring grammar — hands estranged from their owners, eyes covered, night invoked against day.\n\nThe Cleanth Brooks reading of the play's imagery picks up here. Darkness is not metaphor in *Macbeth*; it is invocation. Lady Macbeth in 1.5 will speak the complement of this prayer — the 'blanket of the dark' — and the play's central murders will all happen under self-summoned night.",
      sources:["Cleanth Brooks, 'The Naked Babe and the Cloak of Manliness' (1947)","Caroline Spurgeon, *Shakespeare's Imagery* (1935)"] },
  ];
  TR.macbeth_act1_scene4 = [
    { kind:"structural", prompt:"Duncan announces Malcolm as 'Prince of Cumberland' (line 39). What structural function does this serve?",
      options:["It is mere genealogy","It names a political obstacle Macbeth sees immediately — the visible block on his way to the crown","It is a joke","It confuses the audience"],
      answer_index:1, wisdom_reward:20, anchor_line_start:39, anchor_line_end:53 },
    { kind:"inference", prompt:"What is the dramatic irony of Duncan saying 'There's no art / To find the mind's construction in the face'?",
      options:["It is sincere and true","Duncan says it just as the new Cawdor (Macbeth) enters — he cannot read the face of the man about to kill him","It is a Macbeth quote","It describes the weather"],
      answer_index:1, wisdom_reward:25, anchor_line_start:11, anchor_line_end:21 },
    { kind:"close_reading", prompt:"Macbeth prays 'Stars, hide your fires.' This begins:",
      options:["A religious conversion","A pattern in which the play's central murders are all invoked under self-summoned darkness","An astronomy lecture","A love song"],
      answer_index:1, wisdom_reward:20, anchor_line_start:48, anchor_line_end:53 },
  ];

  // ── 1.5 — TIER 1 — "Unsex me here" ────────────────────────────────
  ANN.macbeth_act1_scene5 = [
    { line_start:15, line_end:30, citation_display:cite(1,5,15,30), category:"thematic",
      title:"Milk of human kindness",
      body:"Lady Macbeth's first characterization of her husband is the play's most famous phrase about him: 'too full o' the milk of human kindness.' The metaphor is precise and insulting. 'Milk' is maternal nurture — the substance that makes human beings human. Her complaint is that Macbeth has too much of it: he has retained the infant's dependency on care, the compassion that prevents atrocity.\n\nThe metaphor's intimacy matters. She does not figure him as weak or cowardly; she figures him as nursed. And in the next twelve lines she will speak her own 'unsex me here' speech, in which she asks to have her own milk replaced with gall. The two speeches are paired: his nurture is the problem, and her self-cancellation is the solution.\n\nReading *Macbeth* alongside Janet Adelman's *Suffocating Mothers*, this is the play's founding metaphor: the household has too much mother-substance, and the tragedy will unfold as an attempt to purge it. The witches are mothers without children; the Macbeths are a marriage without visible children (L. C. Knights's famous essay question); and the murders are committed in rooms where breast-feeding ought to happen.",
      sources:["Janet Adelman, *Suffocating Mothers* (1992)","L. C. Knights, 'How Many Children Had Lady Macbeth?' (1933)","Cleanth Brooks, 'The Naked Babe and the Cloak of Manliness' (1947)"] },
    { line_start:31, line_end:48, citation_display:cite(1,5,31,48), category:"thematic",
      title:"'Unsex me here': the speech and its failure",
      body:"Lady Macbeth's invocation — 'unsex me here,' 'take my milk for gall,' 'make thick my blood' — is the play's most famous request for self-transformation. It asks the 'spirits / That tend on mortal thoughts' to strip her of everything that makes her a woman as the period understood the category: compassion, nurture, the possibility of regret.\n\nThe speech succeeds theatrically and fails metaphysically. She gets what she asks for in the short term — the resolve to plan the murder, the cold practicality of 2.2 ('a little water clears us of this deed'). But the play grants her no lasting transformation. By 5.1 she is sleepwalking in a nightdress, rubbing her hands and smelling blood on them. The 'compunctious visitings of nature' she prayed to stop have returned, deferred but not denied.\n\nShakespeare is quietly refusing her request. The speech is the play's strongest argument that the moral architecture of a human being cannot be dismantled by incantation. You can postpone conscience. You cannot delete it.",
      sources:["Janet Adelman (1992)","Carol Chillington Rutter, *Enter the Body* (2001)","A. C. Bradley (1904)"] },
    { line_start:56, line_end:68, citation_display:cite(1,5,56,68), category:"close_reading",
      title:"'Look like the innocent flower, / But be the serpent under't'",
      body:"Lady Macbeth's instruction to Macbeth — look innocent, be poisonous — is the play's second paradox, paired with the Witches' 'Fair is foul' from 1.1. The two paradoxes frame the tragedy: the supernatural has announced that appearances deceive, and the wife has now given the husband a practical manual for deception.\n\nThe flower/serpent image will echo through the play. In 3.2 Macbeth will tell Lady Macbeth 'we have scotched the snake, not killed it' — and by then they are the snake. The couple who weaponize deception will be destroyed by the equivocations of the Sisters, whose prophecies 'palter with us in a double sense' (5.8). What Lady Macbeth teaches Macbeth in this scene, the Sisters will do to them both.",
      sources:["Harold Goddard, *The Meaning of Shakespeare*, vol. 2 (1951)","Paul Jorgensen, *Our Naked Frailties* (1971)"] },
  ];
  TR.macbeth_act1_scene5 = [
    { kind:"close_reading", prompt:"Lady Macbeth calls Macbeth 'too full o' the milk of human kindness.' What is she accusing him of?",
      options:["Being cowardly","Retaining the compassionate, nurturing nature that prevents him from committing murder","Drinking too much","Being religious"],
      answer_index:1, wisdom_reward:25, anchor_line_start:15, anchor_line_end:22 },
    { kind:"theme", prompt:"In her 'unsex me here' speech, Lady Macbeth is:",
      options:["Praying to Christian angels","Invoking spirits to strip her of compassion and maternal instinct so she can commit murder","Declaring her love","Cursing Macbeth"],
      answer_index:1, wisdom_reward:25, anchor_line_start:31, anchor_line_end:48 },
    { kind:"inference", prompt:"What does the play do with Lady Macbeth's 'unsex me' request?",
      options:["She is transformed permanently","She gets short-term resolve, but 5.1's sleepwalking shows the transformation failed — conscience returns","She dies instantly","She becomes a witch"],
      answer_index:1, wisdom_reward:25, anchor_line_start:31, anchor_line_end:48 },
    { kind:"close_reading", prompt:"'Look like the innocent flower, / But be the serpent under't' continues what earlier pattern?",
      options:["A love poem","The 'Fair is foul' paradox from 1.1 — deceptive appearance is now a practical instruction","A religious lesson","A military tactic"],
      answer_index:1, wisdom_reward:20, anchor_line_start:60, anchor_line_end:68 },
    { kind:"comprehension", prompt:"Why does Lady Macbeth learn Duncan will sleep at her castle?",
      options:["Macbeth tells her in person","A letter from Macbeth, followed by a messenger announcing Duncan's arrival","She learns from the Witches","She has a vision"],
      answer_index:1, wisdom_reward:10, anchor_line_start:1, anchor_line_end:15 },
  ];

  // ── 1.6 ────────────────────────────────────────────────────────────
  ANN.macbeth_act1_scene6 = [
    { line_start:1, line_end:15, citation_display:cite(1,6,1,15), category:"thematic",
      title:"Duncan's last approval",
      body:"Duncan and Banquo praise the sweet air of Macbeth's castle while Lady Macbeth waits inside to kill him. Banquo notes the martlet — a bird said to nest only in holy places — has made its home on the walls. The dramatic irony is unbearable: every word of their praise is a misreading of the place they are about to enter.\n\nThe scene is Shakespeare at his most cruel. He does not allow Duncan a moment of suspicion. The king is graceful, charming, trusting. His thanks to Lady Macbeth ('this honoured hostess') is delivered as courtesy, and she answers in perfect protocol. The audience has thirty-seven lines to watch the trap be set politely.",
      sources:["Harley Granville-Barker, *Prefaces to Shakespeare* (1947)"] },
  ];
  TR.macbeth_act1_scene6 = [
    { kind:"inference", prompt:"Why does Shakespeare have Banquo note the martlet nests on the castle walls?",
      options:["Ornithological accuracy","To set up dramatic irony — martlets nest only in holy places, but this house is about to become a site of regicide","To foreshadow peace","Because Banquo is an amateur naturalist"],
      answer_index:1, wisdom_reward:20, anchor_line_start:3, anchor_line_end:12 },
    { kind:"close_reading", prompt:"Duncan calls Lady Macbeth 'this honoured hostess.' The dramatic irony is:",
      options:["None — it is sincere","She is preparing to help murder him","She is about to divorce her husband","She is a witch"],
      answer_index:1, wisdom_reward:15, anchor_line_start:10, anchor_line_end:20 },
  ];

  // ── 1.7 — TIER 1 — "If it were done" + Brooks on imagery ──────────
  ANN.macbeth_act1_scene7 = [
    { line_start:1, line_end:28, citation_display:cite(1,7,1,28), category:"thematic",
      title:"'If it were done': the soliloquy of reasons against",
      body:"Macbeth's soliloquy at scene's opening is unusual among tragic speeches in one respect: almost every reason he gives against the murder is prudential, not moral. 'If th' assassination / Could trammel up the consequence' — if the act could be insulated from its effects, he would do it. The worry is that consequences return: the 'even-handed justice' that 'commends th' ingredients of our poison'd chalice / To our own lips.'\n\nOnly near the end of the speech does Macbeth name moral reasons — Duncan's 'virtues' will 'plead like angels, trumpet-tongued' — and he names them in imagery so visual that the play's deepest image-systems surface together in one passage: angelic cherubs riding storm winds, and the 'naked new-born babe / Striding the blast,' which Cleanth Brooks reads as the play's central emblem.\n\nBrooks's argument, advanced in *The Well Wrought Urn*, is that the babe represents helpless pity — the exact thing Lady Macbeth has tried to strip from herself in 1.5 — and that the 'cherubin' carrying it is the moral force that the Macbeths cannot suppress. The babe will return in 4.1 (the bloody child apparition) and 4.2 (Macduff's murdered son), insisting on its presence across the play.\n\nThe soliloquy ends with Macbeth defeated: 'I have no spur / To prick the sides of my intent, but only / Vaulting ambition.' He has not been persuaded by the moral argument; he has been deserted by the practical one. Lady Macbeth's entrance will force the third, decisive factor.",
      sources:["Cleanth Brooks, 'The Naked Babe and the Cloak of Manliness,' in *The Well Wrought Urn* (1947)","A. C. Bradley (1904)","Caroline Spurgeon, *Shakespeare's Imagery* (1935)"] },
    { line_start:29, line_end:60, citation_display:cite(1,7,29,60), category:"thematic",
      title:"Lady Macbeth's attack on manhood",
      body:"Lady Macbeth's counter-argument does not engage with Macbeth's scruples; it attacks his masculinity. 'Art thou afeard / To be the same in thine own act and valour / As thou art in desire?' The implied definition of manhood is uncompromising: a man is what he dares, not what he deliberates.\n\nHer climactic image — 'I have given suck, and know / How tender 'tis to love the babe that milks me: / I would, while it was smiling in my face, / Have pluck'd my nipple from his boneless gums, / And dash'd the brains out, had I so sworn as you / Have done to this' — is one of the most shocking passages in Shakespeare. It yokes maternal tenderness to infanticide in a single sentence, and offers the composite image as a measure of kept promises.\n\nThe speech answers Macbeth's 'naked new-born babe' with a 'babe that milks me.' The play's central image-cluster — babes, milk, swords — is now fully assembled. The Macbeths have staked their marriage on the proposition that a vow can override the instincts that make a human being human. The play will spend four acts proving them wrong.",
      sources:["Janet Adelman (1992)","Cleanth Brooks (1947)","Marjorie Garber, *Shakespeare After All* (2004)"] },
    { line_start:61, line_end:82, citation_display:cite(1,7,61,82), category:"close_reading",
      title:"'Screw your courage to the sticking-place'",
      body:"The phrase is often quoted as if it meant 'find your nerve.' The metaphor is more specific. The 'sticking-place' is the notch on a crossbow that holds the drawn string; to screw your courage to it is to wind the string up to full tension and lock it there — ready to release. Courage, in the metaphor, is not a feeling but a mechanical readiness. You wind it up and it fires.\n\nLady Macbeth's plan follows the same logic: apply wine to the chamberlains, let oblivion lock them in place, and the deed becomes executable — a triggered mechanism. The play's dialogue repeatedly returns to this vocabulary of tension, bending, release ('bend up each corporal agent,' 2.1; 'the bond of life,' 3.2). Macbeth's courage, by 5.5, will have snapped: 'I am aweary of the sun.'",
      sources:["Frank Kermode, *Shakespeare's Language* (2000)","Russ McDonald, *Shakespeare's Late Style* (2006)"] },
  ];
  TR.macbeth_act1_scene7 = [
    { kind:"theme", prompt:"Most of Macbeth's reasons against murdering Duncan in this soliloquy are:",
      options:["Moral and religious","Prudential — he worries about consequences returning to him, not the murder's wrongness","Economic","Family-related"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:28 },
    { kind:"close_reading", prompt:"Cleanth Brooks reads the 'naked new-born babe' image as:",
      options:["Random poetic imagery","The play's central emblem of helpless pity — exactly what Lady Macbeth tried to strip from herself","A Christian symbol","A reference to Scottish folklore"],
      answer_index:1, wisdom_reward:25, anchor_line_start:21, anchor_line_end:28 },
    { kind:"theme", prompt:"Lady Macbeth's counterargument to Macbeth's reluctance:",
      options:["Engages his moral concerns","Attacks his masculinity — reframing manhood as what one dares, not what one deliberates","Proposes an alternative victim","Offers to withdraw from the plan"],
      answer_index:1, wisdom_reward:25, anchor_line_start:35, anchor_line_end:48 },
    { kind:"close_reading", prompt:"'Screw your courage to the sticking-place' — what is the sticking-place?",
      options:["A stage direction","The notch on a crossbow holding the drawn string at full tension","A tavern","A compass bearing"],
      answer_index:1, wisdom_reward:25, anchor_line_start:60, anchor_line_end:63 },
    { kind:"inference", prompt:"Lady Macbeth claims she would dash her nursing child's brains out rather than break an oath like the one Macbeth has made. The rhetorical function:",
      options:["Autobiographical confession","A shock-image measuring kept promises — yoking nurture and infanticide in one sentence to shame Macbeth's hesitation","Gentle reassurance","A jest"],
      answer_index:1, wisdom_reward:25, anchor_line_start:54, anchor_line_end:60 },
    { kind:"comprehension", prompt:"What is Lady Macbeth's plan for framing Duncan's murder?",
      options:["Blame the English","Drug the chamberlains, smear them with blood, and use their daggers — then blame them","Flee Scotland","Announce the murder publicly"],
      answer_index:1, wisdom_reward:10, anchor_line_start:63, anchor_line_end:82 },
  ];
};
