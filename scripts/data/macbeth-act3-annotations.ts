module.exports = function (ANN: any, TR: any, cite: (a:number,s:number,ls:number,le:number)=>string) {

  // ── 3.1 ────────────────────────────────────────────────────────────
  ANN.macbeth_act3_scene1 = [
    { line_start:48, line_end:70, citation_display:cite(3,1,48,70), category:"thematic",
      title:"Banquo as the second fear",
      body:"Macbeth's soliloquy after Banquo's exit — 'To be thus is nothing, / But to be safely thus' — reveals the irony of his situation: he has the crown and feels nothing. The crown is 'fruitless,' the sceptre 'barren'; the Sisters' promise that Banquo's descendants will rule is the wound that keeps bleeding.\n\n'My Genius is rebuked' — Macbeth invokes Plutarch's *Life of Antony*, where Antony is said to have a lesser genius than Octavius, one that shrinks in the younger man's presence. Shakespeare had dramatized the image in *Antony and Cleopatra* (probably written the next year). Here, Banquo is Macbeth's Octavius: the calmer, more legitimate rival whose presence diminishes him.\n\nThe soliloquy crystallizes the play's problem. Murder was supposed to end the anxiety; it has only relocated it. Every murder Macbeth commits from here forward will be an attempt to kill the residue of the previous one.",
      sources:["Plutarch, *Life of Antony* 33","A. C. Bradley (1904)","Harold Bloom (1998)"] },
    { line_start:75, line_end:140, citation_display:cite(3,1,75,140), category:"structural",
      title:"The hiring of the murderers",
      body:"The extended scene in which Macbeth persuades two 'murderers' to kill Banquo and Fleance is usually cut or shortened in performance. It shouldn't be. The scene is the first and clearest demonstration of how Macbeth has begun to rule: by using Iago-like rhetorical manipulation on men below him in rank.\n\nHe does not order the killing. He persuades the murderers that Banquo has been their enemy — dishonest, blocking their advancement, responsible for their poverty. The manipulation is intimate and carefully graded. By the end, they believe they have reason to hate Banquo independently of Macbeth's command. They will kill him as volunteers, not as tools.\n\nThe scene rhymes with 1.7, where Lady Macbeth manipulated Macbeth into killing Duncan. Macbeth has learned her technique. He will apply it to everyone below him for the rest of the play — until, in 5.3, he can no longer bring himself to talk to servants.",
      sources:["Harold C. Goddard, *The Meaning of Shakespeare*, vol. 2 (1951)","Richard McCoy, *The Rites of Knighthood* (1989)"] },
  ];
  TR.macbeth_act3_scene1 = [
    { kind:"inference", prompt:"Why does Banquo's survival torment Macbeth even after he wears the crown?",
      options:["Banquo mocks him","The Sisters promised Banquo's descendants would rule — making Macbeth's crown 'fruitless' and 'barren'","Banquo refuses to eat at the banquet","Banquo is stealing from him"],
      answer_index:1, wisdom_reward:25, anchor_line_start:48, anchor_line_end:70 },
    { kind:"close_reading", prompt:"'My Genius is rebuked' references:",
      options:["A random phrase","Plutarch's *Life of Antony* — Antony's guardian spirit shrinks beside Octavius's; Macbeth feels diminished beside Banquo","A Bible quote","Scottish folklore"],
      answer_index:1, wisdom_reward:25, anchor_line_start:51, anchor_line_end:53 },
    { kind:"theme", prompt:"Macbeth's persuasion of the murderers shows he has:",
      options:["Become more honest","Learned Lady Macbeth's manipulation technique and is now applying it to men below him","Renounced murder","Gained compassion"],
      answer_index:1, wisdom_reward:25, anchor_line_start:75, anchor_line_end:140 },
  ];

  // ── 3.2 ────────────────────────────────────────────────────────────
  ANN.macbeth_act3_scene2 = [
    { line_start:1, line_end:30, citation_display:cite(3,2,1,30), category:"thematic",
      title:"The marriage in decline",
      body:"Lady Macbeth opens the scene alone: 'Naught's had, all's spent, / Where our desire is got without content.' The line is the play's most economical statement of achieved ambition. They have what they wanted. It is nothing.\n\nWhen Macbeth enters, the asymmetry of their marriage has reversed. In 1.7 she drove him to the deed; here, he has already decided on Banquo's murder and will not tell her. 'Be innocent of the knowledge, dearest chuck, / Till thou applaud the deed.' The endearment — 'chuck' — is sharper than it looks. He is patronizing her, relegating her to the position she forced him out of.\n\nThe scene is the hinge of their relationship. After 2.2 they are partners; after 3.2 they are not. He does not consult her again. When she next appears in a major scene (5.1), she is sleepwalking alone, her husband at Dunsinane without her, her confessions heard only by a doctor and a gentlewoman.",
      sources:["Juliet Dusinberre, *Shakespeare and the Nature of Women* (1975)","Marjorie Garber, *Shakespeare After All* (2004)"] },
    { line_start:40, line_end:56, citation_display:cite(3,2,40,56), category:"close_reading",
      title:"'Full of scorpions is my mind'",
      body:"Macbeth's image for his insomnia — 'O, full of scorpions is my mind, dear wife!' — is his most visible admission of internal rot. The scorpions are not metaphor for worry; they are presented as an infestation, creatures living in him.\n\nThe image prepares the cavern scene (4.1): the Witches' cauldron bubbling with adders, newts, slow-worms. Macbeth's mind has become what the Witches brew. The distinction between the supernatural and the psychological is dissolving. The 'rooky wood' he invokes at scene's end — 'ere to black Hecate's summons / The shard-borne beetle with his drowsy hums / Hath rung night's yawning peal' — is already the wood of the cavern.\n\nThe couplet 'Things bad begun make strong themselves by ill' is the doctrine. Evil, once undertaken, requires more evil to defend itself. The play's last three acts are the working out of this sentence.",
      sources:["Caroline Spurgeon (1935)","Ewan Fernie, *The Demonic* (2013)"] },
  ];
  TR.macbeth_act3_scene2 = [
    { kind:"inference", prompt:"Lady Macbeth's opening 'Naught's had, all's spent' reveals:",
      options:["Financial trouble","The play's most compact statement about achieved ambition: they have what they wanted, and it is nothing","Their house is empty","She wants a divorce"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:10 },
    { kind:"theme", prompt:"Macbeth's decision not to tell Lady Macbeth about Banquo's planned murder means:",
      options:["He has forgotten her","The asymmetry of their marriage has reversed; after 3.2 they are not partners","He trusts her more","She has asked to be excluded"],
      answer_index:1, wisdom_reward:25, anchor_line_start:36, anchor_line_end:50 },
    { kind:"close_reading", prompt:"'Full of scorpions is my mind' suggests:",
      options:["A literal infestation","His mind has become what the Witches brew — supernatural and psychological collapsing together","He has been stung by a scorpion","A mistranslation"],
      answer_index:1, wisdom_reward:20, anchor_line_start:40, anchor_line_end:45 },
  ];

  // ── 3.3 ────────────────────────────────────────────────────────────
  ANN.macbeth_act3_scene3 = [
    { line_start:14, line_end:22, citation_display:cite(3,3,14,22), category:"structural",
      title:"Fleance escapes",
      body:"The murder of Banquo is staged; the escape of Fleance is offstage but louder. 'Fly, good Fleance, fly, fly, fly!' — the dying father's command preserves the prophecy. The third murderer (whose identity is never explained — some editors suspect Macbeth himself, disguised) lets the boy go by accident.\n\nFleance's flight is structurally the whole point. If Macbeth had succeeded, the Stuart line would have been aborted. James I's claim to the throne ran through Banquo (via the historical Fleance) to Robert II and the Stuart kings. The audience at the 1606 performance knew that the escaping boy was, in political time, their own king's ancestor. The tragedy of Macbeth is also the legitimation narrative of the reigning monarch.\n\nThe scene is short — 22 lines — but its consequence dominates the rest of the play and much of British political history.",
      sources:["Henry N. Paul, *The Royal Play of Macbeth* (1950)","Alvin Kernan, *Shakespeare, the King's Playwright* (1995)"] },
  ];
  TR.macbeth_act3_scene3 = [
    { kind:"structural", prompt:"Why does Fleance's escape matter?",
      options:["He is a main character","He preserves the Banquo-Stuart line — James I claimed descent from Banquo; the prophecy is still in force","Nothing significant","Because he has a sword"],
      answer_index:1, wisdom_reward:25, anchor_line_start:14, anchor_line_end:22 },
    { kind:"comprehension", prompt:"A third murderer appears unexpectedly. Editorial speculation sometimes identifies him as:",
      options:["The ghost of Duncan","Macbeth himself, disguised — a persistent interpretive theory","The First Witch","Malcolm"],
      answer_index:1, wisdom_reward:15, anchor_line_start:1, anchor_line_end:10 },
  ];

  // ── 3.4 — Banquet scene ─────────────────────────────────────────────
  ANN.macbeth_act3_scene4 = [
    { line_start:36, line_end:85, citation_display:cite(3,4,36,85), category:"structural",
      title:"The ghost and the politics of sight",
      body:"The banquet scene stages a double play. On one plane, Macbeth and the guests are performing a state dinner — toasts, seating, ceremony. On the other, Banquo's ghost enters and sits in Macbeth's chair, visible to Macbeth and to the audience, invisible to everyone else. Macbeth's performance collapses; the guests see only a king screaming at empty furniture.\n\nShakespeare's staging is precise. The ghost enters twice, exits twice; the intervals are the scene's rhythm. The first entrance destroys Macbeth's opening speech about Banquo's absence; the second destroys his forced toast to the missing guest. The timing is exact: the ghost answers each lie at the moment it is spoken.\n\nThe politics of sight rhymes with 2.1 (the dagger). Again Macbeth asks whether what he sees is real; again the play refuses to answer. Unlike the ghost in *Hamlet*, which other characters also see, Banquo's ghost is visible only to the man who ordered his murder. Whether ghost or hallucination, it performs the same function: forcing the truth onto a stage where every other actor is trying to maintain a lie.",
      sources:["A. C. Bradley (1904)","Stephen Greenblatt, *Hamlet in Purgatory* (2001)","Marjorie Garber (2004)"] },
    { line_start:120, line_end:145, citation_display:cite(3,4,120,145), category:"close_reading",
      title:"'In blood stepp'd in so far'",
      body:"After the guests have fled, Macbeth delivers the play's most famous metaphor for tragic acceleration: 'I am in blood / Stepp'd in so far, that, should I wade no more, / Returning were as tedious as go o'er.' The metaphor is of a man standing in a river of blood at its midpoint, calculating that turning back will cost the same as pushing forward.\n\nThe calculation is economic, not moral. He has not been transformed by the murders; he has simply concluded that the sunk cost makes continuation rational. This is the most chilling kind of evil: evil that persists because reversing it is inefficient. The same line of thinking governs the Macduff family murder in 4.2 — Macbeth kills Lady Macduff and the children not because it helps him, but because stopping would be as tedious as continuing.\n\nThe line is sometimes quoted as tragic lament. Read carefully, it is closer to tragic bookkeeping.",
      sources:["A. D. Nuttall (2007)","Paul A. Kottman (2009)"] },
  ];
  TR.macbeth_act3_scene4 = [
    { kind:"structural", prompt:"Only Macbeth sees Banquo's ghost. The staging serves:",
      options:["Budget constraints","A politics of sight — the ghost forces truth onto a stage where every other actor is maintaining a lie","A joke","Comic timing"],
      answer_index:1, wisdom_reward:25, anchor_line_start:36, anchor_line_end:85 },
    { kind:"close_reading", prompt:"'In blood stepp'd in so far' is:",
      options:["Moral regret","Tragic bookkeeping — sunk cost reasoning: turning back is as costly as pushing forward","Religious imagery","A military metaphor"],
      answer_index:1, wisdom_reward:25, anchor_line_start:120, anchor_line_end:135 },
    { kind:"inference", prompt:"Lady Macbeth dismisses the ghost as:",
      options:["A genuine apparition","A 'painted devil' — the kind of image that only frightens children; she insists he is hallucinating","An enemy's disguise","Proof of guilt"],
      answer_index:1, wisdom_reward:20, anchor_line_start:57, anchor_line_end:72 },
  ];

  // ── 3.5 — Middleton authorship note ────────────────────────────────
  ANN.macbeth_act3_scene5 = [
    { line_start:1, line_end:36, citation_display:cite(3,5,1,36), category:"textual",
      title:"The Hecate scenes and the Middleton question",
      body:"3.5 is almost certainly not by Shakespeare. The scholarly consensus — dating to Edmond Malone in the 18th century and confirmed by computer-assisted attribution studies from Gary Taylor (Oxford) and Brian Vickers — identifies Thomas Middleton as the probable author of this scene and of parts of 4.1 (the songs 'Come away, come away' and 'Black spirits'). The scenes are interpolations added after 1609, probably for a revival of the play.\n\nThe evidence is stylistic. Hecate's speeches use tetrameter couplets in a way Shakespeare avoids in this play. The songs cited in 3.5 and 4.1 also appear in Middleton's *The Witch* (c. 1614). The internal incoherence — Hecate criticizes the Sisters for acting without her, but the rest of the play gives her no role before or after — suggests a late addition that never fully integrated.\n\nPerformance traditions split. Some productions cut Hecate entirely; others play her as a deliberate stylistic break, acknowledging the text's layered authorship. Reading *Macbeth* as a 'pure' Shakespeare play means reading past these scenes; reading it as the playtext it actually is means reading Middleton, too.",
      sources:["Gary Taylor, 'Empirical Middleton,' *Shakespeare Quarterly* (2010)","Brian Vickers, *Shakespeare, Co-Author* (2002)","John Jowett, *Shakespeare and Text* (2007)"] },
  ];
  TR.macbeth_act3_scene5 = [
    { kind:"textual", prompt:"Most scholars attribute 3.5 and parts of 4.1 to:",
      options:["Shakespeare alone","Thomas Middleton — an interpolation added after 1609, probably for a revival","Christopher Marlowe","Ben Jonson"],
      answer_index:1, wisdom_reward:30, anchor_line_start:1, anchor_line_end:36 },
    { kind:"comprehension", prompt:"What is Hecate's complaint?",
      options:["She is tired","The Sisters have acted without her — traded prophecies with Macbeth unsupervised","She is in love","The cauldron is broken"],
      answer_index:1, wisdom_reward:15, anchor_line_start:1, anchor_line_end:20 },
  ];

  // ── 3.6 ────────────────────────────────────────────────────────────
  ANN.macbeth_act3_scene6 = [
    { line_start:1, line_end:25, citation_display:cite(3,6,1,25), category:"structural",
      title:"The political assessment",
      body:"Lennox's long speech to a 'Lord' is the play's first moment of explicit political analysis. The word 'tyrant' is applied to Macbeth for the first time here. Lennox runs through Macbeth's rapid body count — Duncan, the grooms, now Banquo — and lets the repetitions speak: 'the gracious Duncan,' 'the right valiant Banquo,' 'the two delinquents.'\n\nThe irony is sustained. Lennox speaks as if praising Macbeth's story, but every sentence is a small accusation. The technique is one of the play's most compressed pieces of political speech: what cannot be said aloud in court is said in the form of ostentatious agreement. The scene is a preview of the discretion Scottish nobles will require until Malcolm's army arrives.",
      sources:["Alan Sinfield, *Faultlines* (1992)","Jonathan Dollimore, *Radical Tragedy* (1984)"] },
    { line_start:25, line_end:53, citation_display:cite(3,6,25,53), category:"historical",
      title:"Edward the Confessor and the political theology of kingship",
      body:"The Lord reports that Macduff has fled to England, to the court of Edward the Confessor (r. 1042–1066), the English king venerated for his piety. Edward's capacity to cure the 'King's Evil' (scrofula) by royal touch — staged in 4.3 — is the counter-image to Macbeth's tyranny: the legitimate king has divine power to heal; the usurper has only the power to kill.\n\nThe reference is political. James I practiced the royal touch ceremony, reviving a tradition the Puritans had tried to suppress. The play's 1606 audience, seeing Edward's healing at work, would have seen an argument for the divine right of kings that James had explicitly made in his *True Law of Free Monarchies* (1598). Macbeth's tyranny is the argument's negative space.",
      sources:["Marc Bloch, *The Royal Touch* (1924, tr. 1973)","Stephen Greenblatt, *Shakespearean Negotiations* (1988)","Peter Holland (2016)"] },
  ];
  TR.macbeth_act3_scene6 = [
    { kind:"close_reading", prompt:"Lennox's ironic speech about Duncan, Banquo, and the 'delinquents' functions as:",
      options:["Flattery","Political speech-in-code — saying what cannot be said aloud by way of ostentatious agreement","Confusion","A legal deposition"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:25 },
    { kind:"historical", prompt:"Edward the Confessor's touch-healing in the play frames:",
      options:["A ghost story","An argument for divine right of kings — the legitimate king heals, the usurper only kills","A medical fact","A comic interlude"],
      answer_index:1, wisdom_reward:25, anchor_line_start:25, anchor_line_end:40 },
  ];
};
