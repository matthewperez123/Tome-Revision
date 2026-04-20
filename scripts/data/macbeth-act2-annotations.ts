module.exports = function (ANN: any, TR: any, cite: (a:number,s:number,ls:number,le:number)=>string) {

  // ── 2.1 — TIER 1 — Dagger soliloquy ──────────────────────────────
  ANN.macbeth_act2_scene1 = [
    { line_start:33, line_end:64, citation_display:cite(2,1,33,64), category:"thematic",
      title:"The dagger and the epistemology of guilt",
      body:"'Is this a dagger which I see before me, / The handle toward my hand?' The soliloquy's grammar is an interrogation. Macbeth asks the vision for its credentials: is it real, is it a 'dagger of the mind,' is it a 'false creation / Proceeding from the heat-oppressed brain?' The play will not answer. The dagger may be objective (a demonic apparition), subjective (a guilty hallucination), or both at once.\n\nThe uncertainty is the point. *Macbeth* is a play about the interpretability of the world — the witches whose prophecies are true but deceptive, the faces that cannot be read (1.4), the ghost that only Macbeth sees (3.4). The dagger scene stages the epistemological crisis in one long speech: a man cannot trust what his senses report, and must nevertheless act on what they show him.\n\nMacbeth resolves the question by declaring 'there's no such thing' and proceeding anyway. The dagger has done its work: real or imagined, it has pointed him at the bedroom. Whether matter causes mind or mind causes matter, the deed happens either way.",
      sources:["Stanley Cavell, *Disowning Knowledge* (2003)","A. D. Nuttall, *Shakespeare the Thinker* (2007)","Harold Bloom (1998)"] },
    { line_start:49, line_end:64, citation_display:cite(2,1,49,64), category:"thematic",
      title:"Night as accomplice",
      body:"The second half of the soliloquy summons a night of murder: 'Now o'er the one half-world / Nature seems dead, and wicked dreams abuse / The curtain'd sleep.' Hecate, witchcraft, the wolf, 'withered Murder' like Tarquin — an iconography of the classical and folk supernatural all gathered to assist him.\n\nThe speech rhymes with Lady Macbeth's 'blanket of the dark' in 1.5 and with Macbeth's 'Stars, hide your fires' in 1.4. The three invocations build: where she asked for cover, he now asks for assistance. 'Thou sure and firm-set earth, / Hear not my steps.' The earth itself is being drafted into the conspiracy.\n\nThe Tarquin reference is precise. Tarquin — whose rape of Lucrece Shakespeare told in his earlier narrative poem — is the play's analogue for this night: a silent approach to a sleeping victim's bed, ending in a death that will outlast the perpetrator.",
      sources:["Catherine Belsey, *Shakespeare and the Loss of Eden* (1999)","Shakespeare, *The Rape of Lucrece* (1594)"] },
  ];
  TR.macbeth_act2_scene1 = [
    { kind:"theme", prompt:"The dagger soliloquy refuses to resolve whether the dagger is:",
      options:["Hot or cold","Real (supernatural) or imagined (hallucination) — the play leaves both possibilities open","Steel or bronze","A sword or a knife"],
      answer_index:1, wisdom_reward:25, anchor_line_start:33, anchor_line_end:49 },
    { kind:"close_reading", prompt:"Macbeth compares his approach to Duncan's chamber to:",
      options:["A battlefield charge","Tarquin's ravishing strides — the Roman rapist's silent advance toward a sleeping bed","A church procession","A hunting party"],
      answer_index:1, wisdom_reward:20, anchor_line_start:55, anchor_line_end:60 },
    { kind:"inference", prompt:"Macbeth ends the soliloquy by:",
      options:["Deciding not to commit murder","Declaring 'there's no such thing' and proceeding anyway — acting without settling whether the vision is real","Calling for the guards","Weeping"],
      answer_index:1, wisdom_reward:20, anchor_line_start:47, anchor_line_end:64 },
    { kind:"structural", prompt:"Duncan's closing line in 2.1 ('goes off' to bed peacefully thanking Macbeth for his hospitality) functions as:",
      options:["Routine pleasantry","Unbearable dramatic irony — Duncan's kindness to his host is delivered moments before his murder","A joke","Political protocol"],
      answer_index:1, wisdom_reward:20, anchor_line_start:13, anchor_line_end:16 },
  ];

  // ── 2.2 — TIER 1 — "Sleep no more" ────────────────────────────────
  ANN.macbeth_act2_scene2 = [
    { line_start:1, line_end:20, citation_display:cite(2,2,1,20), category:"structural",
      title:"The murder offstage",
      body:"Shakespeare refuses to show the murder. Duncan is killed between the dagger soliloquy and Macbeth's return; what the audience sees is Lady Macbeth waiting in the court, listening for a cry, remarking that she would have killed Duncan herself 'had he not resembled / My father as he slept.' The one flicker of personal feeling she admits to all play.\n\nThe decision to keep the murder offstage is structural. *Macbeth* is never about the killing itself; it is about what killing does to the killer. The audience is placed where Lady Macbeth is — outside the door, hearing the act's edges, already complicit. When Macbeth returns with bloody hands, the scene we could not watch is inscribed on his body. The play will spend its remaining acts watching him try, and fail, to wash it off.",
      sources:["A. C. Bradley (1904)","Harley Granville-Barker (1947)"] },
    { line_start:30, line_end:46, citation_display:cite(2,2,30,46), category:"thematic",
      title:"'Macbeth does murder sleep'",
      body:"The voice Macbeth heard — 'Sleep no more! / Macbeth does murder sleep' — turns the act of regicide into the destruction of a category. Sleep, in the play's vocabulary, is 'the innocent sleep,' 'the death of each day's life,' 'great nature's second course, / Chief nourisher in life's feast.' To murder it is to murder the human's capacity for rest, forgiveness, repair.\n\nThe indictment is immediate and, for Macbeth, permanent. From this moment forward, neither he nor Lady Macbeth sleeps properly. 3.2 will show him begging for the 'peace' sleep brings to the grave's more fortunate inhabitants. 5.1 will show Lady Macbeth walking in her sleep, confessing aloud what she has stopped daring to say awake.\n\nNotice the liturgical form. The voice accuses Macbeth by each of his titles in sequence — 'Glamis hath murdered sleep, and therefore Cawdor / Shall sleep no more, Macbeth shall sleep no more.' It is naming and indicting. The Catholic sacrament of confession, in which the sinner is named and his sin tallied, is the shape this voice is parodying. Macbeth's Amen stuck in his throat a moment earlier; this voice is the counter-Amen.",
      sources:["Harold Bloom (1998)","Ewan Fernie, *Demonic: Literature and Experience* (2013)","Jonathan Bate, *The Genius of Shakespeare* (1997)"] },
    { line_start:58, line_end:76, citation_display:cite(2,2,58,76), category:"thematic",
      title:"Blood and water: Lady Macbeth's first error",
      body:"Macbeth stares at his hands: 'Will all great Neptune's ocean wash this blood / Clean from my hand? No, this my hand will rather / The multitudinous seas incarnadine, / Making the green one red.' Lady Macbeth dismisses him: 'A little water clears us of this deed.' The exchange is the play's deepest disagreement.\n\nShe is wrong by 5.1 — 'All the perfumes of Arabia will not sweeten this little hand.' He is right from the start. The blood is not a stain to be removed but an ontological condition to be endured. The word 'incarnadine' — to turn flesh-colored, to dye red from the Latin 'caro,' flesh — is Shakespeare's coinage for a specific moment: Macbeth's imagination has moved from a hand to an ocean, and the ocean has taken on the property of the hand.\n\nThe scene's final dissonance — Lady Macbeth's confidence, Macbeth's dread, the knocking that won't stop — is a preview of the rest of the play. She will break slowly and silently; he will break loudly and on stage. Both begin to break here.",
      sources:["Caroline Spurgeon (1935)","Cleanth Brooks (1947)","Janet Adelman (1992)"] },
  ];
  TR.macbeth_act2_scene2 = [
    { kind:"structural", prompt:"Why does Shakespeare not stage the murder of Duncan?",
      options:["Censorship forbade it","The play is about what killing does to the killer, not the killing itself — the audience watches Lady Macbeth wait outside the door","He ran out of time","Duncan's actor was unavailable"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:20 },
    { kind:"close_reading", prompt:"The voice Macbeth hears — 'Sleep no more!' — accuses him by:",
      options:["His name alone","Each of his titles in sequence (Glamis, Cawdor, Macbeth) — a liturgical form that parodies confession","A nickname","A Latin curse"],
      answer_index:1, wisdom_reward:25, anchor_line_start:42, anchor_line_end:46 },
    { kind:"theme", prompt:"Macbeth and Lady Macbeth disagree about whether water can wash the blood off. Who is right?",
      options:["Lady Macbeth — the stain is trivial","Macbeth — the 'multitudinous seas' cannot clean it; 5.1 will confirm his reading","Neither","Both"],
      answer_index:1, wisdom_reward:25, anchor_line_start:58, anchor_line_end:76 },
    { kind:"close_reading", prompt:"'Incarnadine' (L62) is:",
      options:["A common Elizabethan word","Shakespeare's coinage from Latin 'caro' (flesh) — to turn blood-red",
       "A French loanword for ink","A technical term of painting"],
      answer_index:1, wisdom_reward:20, anchor_line_start:60, anchor_line_end:64 },
    { kind:"inference", prompt:"Lady Macbeth says she would have killed Duncan herself 'had he not resembled / My father as he slept.' This reveals:",
      options:["She is lying","One flicker of personal feeling she admits to in the entire play","Duncan was her father","She is a sleepwalker already"],
      answer_index:1, wisdom_reward:20, anchor_line_start:10, anchor_line_end:14 },
  ];

  // ── 2.3 — Porter scene ─────────────────────────────────────────────
  ANN.macbeth_act2_scene3 = [
    { line_start:1, line_end:18, citation_display:cite(2,3,1,18), category:"historical",
      title:"The equivocator and the Gunpowder Plot",
      body:"The Porter imagines himself as the gatekeeper of hell and lets in a procession of the damned. The second damned soul is an 'equivocator, that could swear in both the scales against either scale.' For a London audience in 1606, the reference was unmissable.\n\nHenry Garnet, the Jesuit superior in England, had been executed on May 3, 1606 — months before the play's earliest likely performance — for his role in the Gunpowder Plot (November 1605). His *Treatise of Equivocation*, circulated in manuscript, argued that a Catholic under interrogation could swear 'truly' while mentally reserving crucial qualifications. The doctrine was held up at his trial as proof that Catholics could not be trusted to swear loyalty. Garnet was the equivocator in public imagination.\n\nThe Porter is not engaged in incidental humor. He is placing Duncan's murder — the regicide happening upstairs — in direct conversation with the Gunpowder Plot, the regicide that nearly happened a few months earlier. Both are attacks on a Scottish king on English soil. Both involved subjects sworn to protect the king and the oaths they broke. The play's audience heard the political analogy; James I heard it too, and would have approved.\n\nWhen Macbeth himself invokes 'the equivocation of the fiend' at 5.5.42, he is naming the same doctrine — but now against his own ruin.",
      sources:["Garry Wills, *Witches and Jesuits: Shakespeare's Macbeth* (1995)","Peter Holland (ed.), Oxford *Macbeth* (2016)","Alvin Kernan, *Shakespeare, the King's Playwright* (1995)"] },
    { line_start:55, line_end:100, citation_display:cite(2,3,55,100), category:"thematic",
      title:"The discovery of Duncan's murder",
      body:"Macduff finds Duncan. His reaction — 'O horror, horror, horror! / Tongue nor heart cannot conceive nor name thee' — gives the play its iconic scream. He returns with the body-image: 'Confusion now hath made his masterpiece! / Most sacrilegious murder hath broke ope / The Lord's anointed temple.' Duncan is figured as a holy building, regicide as architectural sacrilege.\n\nNote who speaks and who doesn't. Macduff cries out; Banquo swears an oath of service ('In the great hand of God I stand'); Malcolm and Donalbain whisper asides about fleeing. Macbeth delivers a prepared speech so over-rhetorical that a suspicious listener would recognize it as performance — 'Had I but died an hour before this chance, / I had lived a blessed time.' Lady Macbeth is ostentatiously shocked, and faints at the right moment.\n\nThe scene is an audition for every character's reaction to violence, and the play rewards the ones who are honestly horrified. Macduff will become the avenger. Malcolm and Donalbain's decision to flee separately, to England and Ireland, is the political act that will eventually defeat Macbeth.",
      sources:["Alan Sinfield, *Faultlines* (1992)","A. R. Braunmuller (1997)"] },
  ];
  TR.macbeth_act2_scene3 = [
    { kind:"historical", prompt:"The Porter's 'equivocator' is a direct allusion to:",
      options:["Shakespeare himself","Henry Garnet, the Jesuit executed May 1606 for the Gunpowder Plot — his 'Treatise of Equivocation' justified sworn mental reservation","A fictional character","A Roman senator"],
      answer_index:1, wisdom_reward:30, anchor_line_start:6, anchor_line_end:10 },
    { kind:"theme", prompt:"The Porter scene is not filler. Its function is:",
      options:["To make the audience laugh","To place Duncan's murder in direct dialogue with the Gunpowder Plot — another regicide that nearly happened","To introduce a new character","To describe the weather"],
      answer_index:1, wisdom_reward:25, anchor_line_start:1, anchor_line_end:30 },
    { kind:"inference", prompt:"Macbeth's prepared speech on finding Duncan ('Had I but died an hour before this chance') is:",
      options:["Sincere grief","Over-rhetorical performance that a suspicious listener would spot as staged","A private soliloquy","A Biblical citation"],
      answer_index:1, wisdom_reward:25, anchor_line_start:105, anchor_line_end:115 },
    { kind:"comprehension", prompt:"Malcolm and Donalbain decide to:",
      options:["Stay and investigate","Flee separately to England and Ireland — the political decision that preserves the legitimate line","Challenge Macbeth","Confess their own guilt"],
      answer_index:1, wisdom_reward:15, anchor_line_start:125, anchor_line_end:145 },
    { kind:"close_reading", prompt:"Lennox's report of the night — tempests, crying in the air, the owl's scream — functions as:",
      options:["Weather report","Portents — the natural order registering the regicide before it is announced","A poem","A sermon"],
      answer_index:1, wisdom_reward:20, anchor_line_start:62, anchor_line_end:71 },
  ];

  // ── 2.4 ────────────────────────────────────────────────────────────
  ANN.macbeth_act2_scene4 = [
    { line_start:11, line_end:22, citation_display:cite(2,4,11,22), category:"thematic",
      title:"Nature's inversions",
      body:"The scene outside Macbeth's castle catalogs a series of impossibilities. The sun has not risen though it is day. A falcon has been killed by a mouse-eating owl ('towering in her pride of place'). Duncan's horses have broken their stalls and eaten each other. None of these is decorative; each is the natural order registering, in its own dialect, that the king has been murdered.\n\nThe Tudor and Jacobean theory of correspondence — the doctrine that the political order mirrors the natural order, and that regicide disrupts both — is given its clearest poetic expression in this scene. The mousing owl killing the falcon is a picture of a tyrant killing a king; the horses eating each other is the state turning on itself; the darkness at noon is the sun's refusal to light a disordered world.\n\nShakespeare is not being superstitious here; he is showing us the vocabulary in which his audience would have processed political crisis. When, forty lines later, Ross tells us 'Adieu, / Lest our old robes sit easier than our new,' the clothing-image returns: the state is dressed in the wrong clothes, and until the right king is found, it will not fit.",
      sources:["E. M. W. Tillyard, *The Elizabethan World Picture* (1943)","Stephen Greenblatt, *Renaissance Self-Fashioning* (1980)"] },
  ];
  TR.macbeth_act2_scene4 = [
    { kind:"theme", prompt:"The portents Ross reports (sun dark at noon, falcon killed by an owl, Duncan's horses eating each other) function as:",
      options:["Weather anecdotes","The natural order's registration of regicide — correspondence theory put into stage imagery","Random incidents","Mythological references"],
      answer_index:1, wisdom_reward:25, anchor_line_start:11, anchor_line_end:22 },
    { kind:"comprehension", prompt:"Who is named as the new king?",
      options:["Macduff","Macbeth — he will be crowned at Scone","Malcolm","Banquo"],
      answer_index:1, wisdom_reward:10, anchor_line_start:30, anchor_line_end:35 },
  ];
};
