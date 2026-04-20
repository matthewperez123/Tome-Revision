/**
 * Henry V — Act III annotations + Trials.
 * 3 Chorus (Tier-1), 3.1 (Tier-1), 3.2, 3.3 (Tier-1 — Harfleur threat),
 * 3.4, 3.5, 3.6, 3.7 (French nobles and horses).
 */
interface Annotation { line_start: number; line_end: number; citation_display: string; category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading"; title: string; body: string; sources: string[]; }
interface Trial { kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural"; prompt: string; options: [string,string,string,string]; answer_index: 0|1|2|3; wisdom_reward: number; anchor_line_start: number; anchor_line_end: number; }

module.exports = function (ANNOTATIONS: Record<string, Annotation[]>, TRIALS: Record<string, Trial[]>, cite: (label: string, ls: number, le: number) => string) {

  ANNOTATIONS.henry_v_act3_chorus = [
    {
      line_start: 1, line_end: 18,
      citation_display: cite("3 Chorus", 1, 18),
      category: "close_reading",
      title: "'A city on th' inconstant billows dancing' — the fleet as sea-borne metropolis",
      body: "The Act 3 Chorus is one of Shakespeare's great occasional poems in miniature. Its core image — the English fleet observed from shore, 'a city on th' inconstant billows dancing' — has been admired since the Romantics. The stanza does several things at once: it persuades the audience to visualize a vast invasion fleet the Globe cannot stage; it dignifies the expedition with civic grandeur ('so appears this fleet majestical'); and it uses shore-based spectatorship ('you stand upon the rivage') to make the audience an onlooker rather than a participant. Notice the verbs: 'grapple your minds to sternage of this navy,' 'Work, work your thoughts.' The Chorus demands work from us; the language is almost nautical labor. And the stanza's closing image — 'the nimble gunner / With linstock now the devilish cannon touches / And down goes all before them' — dispatches Harfleur's fall in a single graceful sentence, letting the imagination accomplish what the stage cannot.",
      sources: ["Samuel Taylor Coleridge, Lectures on Shakespeare (1818)", "Frank Kermode, Shakespeare's Language (2000)"]
    },
    {
      line_start: 28, line_end: 35,
      citation_display: cite("3 Chorus", 28, 35),
      category: "thematic",
      title: "The Katherine offer — dowry as deflection",
      body: "The Chorus introduces an offstage diplomatic detail: the French king has offered Katharine as Henry's bride, together with 'some petty and unprofitable dukedoms,' as a settlement. 'The offer likes not' — Henry refuses. Why this matters: it tells the audience that a marriage-solution to the war existed and was declined. When Act 5 finally stages the wooing scene, the audience should remember that Katherine was offered to Henry before Harfleur, before Agincourt, before the thousands of French dead. Henry accepted her only after taking France at sword-point. The Chorus's brief couplet — dowry proposal, Henry refuses, 'nimble gunner … devilish cannon touches' — is a compressed argument about what this war is actually buying.",
      sources: ["Graham Holderness, Shakespeare: The Histories (2000)", "Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)"]
    },
  ];

  TRIALS.henry_v_act3_chorus = [
    {
      kind: "close_reading",
      prompt: "The Chorus compares the English fleet at sea to —",
      options: [
        "An army on the march",
        "A city on the inconstant billows dancing — civic grandeur conferred on the invasion by imagery",
        "A forest of masts",
        "A flock of migrating birds"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 13, anchor_line_end: 17
    },
    {
      kind: "theme",
      prompt: "Why does the Chorus mention the French king's offer of Katherine as a peace-settlement?",
      options: [
        "To introduce Katherine as a character for the first time",
        "To indicate that a marriage-settlement was offered BEFORE the war and was declined — reminding us (when we reach Act 5) that Katherine was the price of conquest, not the reward of genuine love",
        "To stage a French marriage proposal",
        "To introduce the sub-plot of Alice the interpreter"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 28, anchor_line_end: 32
    },
    {
      kind: "structural",
      prompt: "How does the Chorus handle the fall of Harfleur?",
      options: [
        "Stages the siege in detail",
        "Skips it entirely without mention",
        "Compresses it into a closing couplet — 'the nimble gunner / With linstock now the devilish cannon touches / And down goes all before them' — leaving the imagination to do the work",
        "Narrates it through a captured French soldier"
      ],
      answer_index: 2, wisdom_reward: 20,
      anchor_line_start: 32, anchor_line_end: 35
    },
  ];

  ANNOTATIONS.henry_v_act3_scene1 = [
    {
      line_start: 1, line_end: 17,
      citation_display: cite("3.1", 1, 17),
      category: "close_reading",
      title: "The rhetorical architecture of 'Once more unto the breach'",
      body: "Henry's speech to the soldiers at the Harfleur breach is a masterclass in siege oratory. Its structure is rigorously controlled. Lines 1–2 give the imperative and its stakes (return to the breach, or die filling it). Lines 3–5 mark the ethical pivot: what virtue is in peace is not what virtue is in war. Lines 6–14 supply the key metamorphic command: imitate the tiger, stiffen sinews, summon blood, disguise fair nature with hard-favour'd rage. The body-language is physical: teeth set, nostrils stretched, breath held, every spirit bent up. The rhetorical technique is transformation — Henry is not asking the soldiers to be braver; he is prescribing a bodily and facial reconfiguration that will make them killers. The speech is also addressed in two registers: first to the noblest ('you noblest English / Whose blood is fet from fathers of war-proof'), then to the yeomen ('good yeomen / Whose limbs were made in England'), closing with the single collective war-cry. The rhetorical care is near-liturgical.",
      sources: ["Madeleine Doran, Shakespeare's Dramatic Language (1976)", "Brian Vickers, The Artistry of Shakespeare's Prose (1968)"]
    },
    {
      line_start: 17, line_end: 34,
      citation_display: cite("3.1", 17, 34),
      category: "thematic",
      title: "Class-addressed oratory — the yeomen and the game",
      body: "Henry's speech explicitly addresses the yeomen — the free-born English farming commoners who made up the archer corps — and praises 'the mettle of your pasture.' This acknowledges a military reality: the longbow, which would decide Agincourt, was the yeoman's weapon, not the knight's. The speech flatters the social group that would actually win the battle. The closing image — 'I see you stand like greyhounds in the slips, / Straining upon the start. The game's afoot' — converts the army into a hunting pack and the French into quarry. 'The game's afoot' has become proverbial (and famously re-used by Arthur Conan Doyle's Sherlock Holmes). In context, it is the speech's decisive detheologizing move: what began as a siege-ethic ends as a blood-sport. The breach-ethic is not 'kill in the name of God' but 'chase the prey.' The closing invocation 'God for Harry, England, and Saint George' nominally rebalances this, but the hunt-image lingers.",
      sources: ["Juliet Barker, Agincourt: The King, the Campaign, the Battle (2005)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
  ];

  TRIALS.henry_v_act3_scene1 = [
    {
      kind: "close_reading",
      prompt: "What does Henry command the soldiers to do in lines 6–14?",
      options: [
        "Withdraw to regroup",
        "Undergo a bodily and facial metamorphosis — imitate the tiger, stiffen sinews, disguise fair nature with 'hard-favour'd rage' — a physical re-engineering into killers",
        "Pray for divine aid",
        "Sing a battle-song"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 6, anchor_line_end: 14
    },
    {
      kind: "theme",
      prompt: "Why does Henry explicitly address the yeomen?",
      options: [
        "They were the lowest social class present",
        "Because the yeoman archers — commoners with longbows — were the army's decisive force; the speech flatters the social group that will actually win the battle",
        "Because only yeomen spoke English",
        "Because the nobility had refused to fight"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 25, anchor_line_end: 30
    },
    {
      kind: "close_reading",
      prompt: "What is the structural function of 'I see you stand like greyhounds in the slips' (line 31)?",
      options: [
        "A reference to Henry's hunting hobby",
        "A closing simile that converts the army into a hunting pack and the French into quarry — 'The game's afoot' (line 32) makes the siege a blood-sport",
        "A Welsh idiom from Fluellen",
        "A misquotation of Ovid"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 31, anchor_line_end: 32
    },
    {
      kind: "comprehension",
      prompt: "The speech's final line invokes which three names?",
      options: [
        "God, Queen, and Country",
        "God, Harry, England, and Saint George (the English patron saint)",
        "Saint Denis, Saint George, and the Virgin",
        "Henry, Exeter, and Canterbury"
      ],
      answer_index: 1, wisdom_reward: 10,
      anchor_line_start: 34, anchor_line_end: 34
    },
  ];

  ANNOTATIONS.henry_v_act3_scene2 = [
    {
      line_start: 23, line_end: 44,
      citation_display: cite("3.2", 23, 44),
      category: "structural",
      title: "The Boy's soliloquy — the war seen from below",
      body: "The Boy's long speech assessing Pistol, Bardolph, and Nym is one of the play's most important counter-frames. The Chorus has just shown us 'our swift scene' flying 'with imagined wing' to Harfleur; Henry has just delivered the breach oration. The Boy, aged perhaps twelve, walks onstage and gives us an adult appraisal: the three older men who are his masters are cowards, thieves, and frauds. The speech is clear-eyed ('I must leave them, and seek some better service'); it is also delivered directly to the audience, without irony. Later, at 4.4 and 4.7, the Boy will be revealed to have been left with the camp's luggage and killed by the French during their raid. The play thus frames the war with the perspective of an intelligent child whom the play allows to speak truly once, and then allows to die. Readers should notice whom Shakespeare trusts with clarity and whom he rewards with survival.",
      sources: ["C. L. Barber, Shakespeare's Festive Comedy (1959)", "Thomas Healy, Shakespeare, Alienation and the Early Modern Stage (1994)"]
    },
    {
      line_start: 68, line_end: 110,
      citation_display: cite("3.2", 68, 110),
      category: "thematic",
      title: "The four captains — a British Isles tableau, under stress",
      body: "This is Shakespeare's four-captains scene: Gower (English), Fluellen (Welsh), Jamy (Scottish), and Macmorris (Irish) serving together before Harfleur. It stages the emerging idea of a British Isles identity united in foreign war — the nationalist premise that would later underwrite the Stuart union of crowns. But the scene does not smooth the union. Fluellen's classical pedantry, Jamy's Scots-cadenced courtesy, and Macmorris's explosive defensiveness — 'What ish my nation? Who talks of my nation?' — stage the identity as contested at the moment of its formation. Macmorris is Shakespeare's only Irish character in the canon, and this is the most-discussed Irish line in Renaissance drama. It can be read as comic (an Irishman over-reacting to a routine Welsh observation) or as politically serious (an Irishman interrupting the construction of 'Britishness' to demand whose nation is being talked about). Modern productions and critics (especially post-1980 Irish scholarship) tend to the latter. The scene's unresolved tension — the parley sounds and the captains have to abandon their dispute — is the point: British identity is assembled under the pressure of a common French enemy, and unresolved by the assembly.",
      sources: ["David Cairns & Shaun Richards, Writing Ireland (1988)", "Philip Edwards, Threshold of a Nation (1979)", "Andrew Murphy, But the Irish Sea Betwixt Us (1999)"]
    },
  ];

  TRIALS.henry_v_act3_scene2 = [
    {
      kind: "inference",
      prompt: "What is the structural purpose of the Boy's speech (lines 23–44)?",
      options: [
        "Pure comic relief",
        "To introduce a child character who will survive the play",
        "To provide a clear-eyed, adult-level critique of Pistol/Bardolph/Nym from below — delivered in the voice of a child the play will later permit to be killed offstage. The audience's only fully honest narrator is disposable",
        "To translate Fluellen's Welsh for the audience"
      ],
      answer_index: 2, wisdom_reward: 30,
      anchor_line_start: 23, anchor_line_end: 44
    },
    {
      kind: "theme",
      prompt: "Macmorris's line 'What ish my nation? Who talks of my nation?' is famous because —",
      options: [
        "It is a nonsense line inserted for comedy only",
        "Macmorris is Shakespeare's only Irish character; the line has become the most-cited Renaissance-drama passage in Irish studies, staging the contested nature of emergent British identity at the moment of its formation",
        "It is a quotation from Holinshed",
        "It is the longest line in the play"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 100, anchor_line_end: 103
    },
    {
      kind: "close_reading",
      prompt: "Fluellen's repeated phrase 'the disciplines of the war' signals what?",
      options: [
        "His Welsh heritage",
        "A serious critique of Henry's strategy",
        "His pedantic preoccupation with classical military theory — especially the 'Roman' and 'pristine' wars he keeps citing; the catchphrase becomes a running comic signature",
        "His religious beliefs"
      ],
      answer_index: 2, wisdom_reward: 20,
      anchor_line_start: 49, anchor_line_end: 115
    },
  ];

  ANNOTATIONS.henry_v_act3_scene3 = [
    {
      line_start: 1, line_end: 43,
      citation_display: cite("3.3", 1, 43),
      category: "thematic",
      title: "The threat to Harfleur — what is actually on the page",
      body: "Henry's speech to the governor of Harfleur is the play's hardest passage. The Chorus does not prepare us for it; the action scene does not euphemize it. In order, Henry threatens: the enraged soldiery in 'liberty of bloody hand,' with 'conscience wide as hell,' mowing virgins and infants like grass (lines 11–14); fire and desolation (15–18); the 'hot and forcing violation' of pure maidens — that is, the mass rape of the town's women (19–21); the defiling of 'shrill-shrieking daughters' and the dashing of old men's heads against the walls (34–37); and, most unmistakably, 'Your naked infants spitted upon pikes' (38). Henry compares the coming scene to Herod's massacre of the innocents at Bethlehem (40–41), thus locating his threat inside the Christian catalogue of atrocities. This is not a bluff; it is the standard early-modern rhetoric of siege warfare, in which credible threats of sack were conventional tools for forcing surrender. But Shakespeare's version is unusually specific and unusually sustained. Forty-three lines of threat, naming sexual violence and infanticide explicitly. Readers cannot honestly say Henry is a simple hero and hold these lines in mind at the same time. The play makes us hold both.",
      sources: ["Theodor Meron, Bloody Constraint: War and Chivalry in Shakespeare (1998)", "Norman Rabkin, 'Either/Or: Responding to Henry V,' Shakespeare and the Problem of Meaning (1981)", "Juliet Barker, Agincourt: The King, the Campaign, the Battle (2005)"]
    },
    {
      line_start: 44, line_end: 57,
      citation_display: cite("3.3", 44, 57),
      category: "structural",
      title: "Henry's pivot from threat to mercy",
      body: "The governor surrenders, and Henry pivots instantly: 'Use mercy to them all' (line 53). The same man who forty lines earlier was promising pikes through infants is now commanding his uncle Exeter to garrison Harfleur gently. The speed of the pivot is the point. Henry's threat worked: the town yielded 'our town and lives to thy soft mercy' rather than endure sack. The play thus invites two readings simultaneously. (1) Henry is a cunning military psychologist who knows the conventions of siege warfare: make the threat credible enough and the city surrenders, sparing both sides. No rape happens; no infant is spitted. The threat is instrumental. (2) Henry is a rhetorician who can summon the imagery of atrocity without hesitation and withdraw it without explanation; what matters is what he was willing to promise. The scene refuses to decide. The structural fact — threat, surrender, mercy — is historically accurate and morally unresolved.",
      sources: ["Meron, Bloody Constraint (1998)", "Rabkin, 'Either/Or' (1981)"]
    },
    {
      line_start: 54, line_end: 57,
      citation_display: cite("3.3", 54, 57),
      category: "historical",
      title: "The march to Calais — forced by dysentery",
      body: "Henry's closing announcement — 'The winter coming on and sickness growing / Upon our soldiers, we will retire to Calais' — corresponds to a historical fact the play slightly softens. The English army was ravaged by dysentery during and after the siege of Harfleur; thousands of men died of the 'bloody flux'; Henry's best estimate of his effective force by the time of Agincourt was a fraction of what had landed. The march to Calais was not a strategic decision but a desperate one, undertaken with depleted forces through hostile territory. Historically this is the situation that made the victory at Agincourt so improbable and so mythologized afterwards. The play will register the depletion (Henry to Montjoy in 3.6: 'My people are with sickness much enfeebled'), but it presents the retirement to Calais as a poised royal choice rather than an epidemiological emergency.",
      sources: ["Anne Curry, Agincourt: A New History (2005)", "Juliet Barker, Agincourt: The King, the Campaign, the Battle (2005)"]
    },
  ];

  TRIALS.henry_v_act3_scene3 = [
    {
      kind: "close_reading",
      prompt: "What, specifically, does Henry threaten if Harfleur does not surrender?",
      options: [
        "A long siege without casualties",
        "The mass rape of the town's women, the killing of its old men, and the impaling of its 'naked infants' on pikes — with an explicit comparison to Herod's massacre of the innocents",
        "Economic sanctions",
        "The removal of the town's governor"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 19, anchor_line_end: 41
    },
    {
      kind: "theme",
      prompt: "How should readers think about Henry's threat?",
      options: [
        "As a pure expression of villainy",
        "As the standard early-modern rhetoric of siege warfare, in which credible threats were conventional surrender-tools — but Shakespeare's version is unusually specific and sustained, naming sexual violence and infanticide; the moral weight is on the page and is not euphemized",
        "As a rhetorical flourish meant to impress the soldiers",
        "As a passage unique to the Folio and cut from modern editions"
      ],
      answer_index: 1, wisdom_reward: 35,
      anchor_line_start: 1, anchor_line_end: 43
    },
    {
      kind: "structural",
      prompt: "What happens immediately after Henry's threat?",
      options: [
        "A bloody assault on Harfleur",
        "The town surrenders, and Henry pivots instantly to 'Use mercy to them all' — the scene stages threat, surrender, and sudden mercy in forty lines",
        "The Dauphin arrives with reinforcements",
        "Henry withdraws without taking the town"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 44, anchor_line_end: 57
    },
    {
      kind: "inference",
      prompt: "Why does the scene end with Henry's decision to march to Calais?",
      options: [
        "Because he has defeated the French entirely",
        "The army has been ravaged by dysentery during the siege; the retreat is historically forced by disease, though the play presents it as a poised royal choice",
        "Because he wants to visit English garrisons",
        "Because Montjoy has offered a truce"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 54, anchor_line_end: 57
    },
  ];

  ANNOTATIONS.henry_v_act3_scene4 = [
    {
      line_start: 1, line_end: 47,
      citation_display: cite("3.4", 1, 47),
      category: "structural",
      title: "Katherine's English lesson — the play's quietest political scene",
      body: "Act 3.4 is an entire scene in French, broken only by Katherine's attempted English vocabulary words. It is a self-contained interlude: the princess of France, at her father's palace, systematically learning the body-words of the language of the man who is besieging her country. 'Le bras, le coude, le col, le menton, le pied' — the English-lesson is a domestic activity, but every word is a preparation for marriage. The scene works on two registers. The comic register is real: the accidental obscenities ('foot' and 'coun' — close to 'foutre' and 'con' in French) scandalize Katherine into an instruction-manual denial. The political register is that Katherine is being prepared for a conquest that has not yet happened but is already being arranged in the royal court. Shakespeare gives the scene no commentary, no choral frame, no English voice. It is pure preparation. When Henry finally woos her in 5.2, we will have already watched her assemble the vocabulary.",
      sources: ["Patricia Parker, Shakespeare from the Margins (1996)", "Karen Newman, Fashioning Femininity and English Renaissance Drama (1991)"]
    },
    {
      line_start: 33, line_end: 42,
      citation_display: cite("3.4", 33, 42),
      category: "linguistic",
      title: "The deliberate obscene pun — 'foot' and 'coun'",
      body: "The comic climax of the lesson is Katherine's shocked reaction to 'foot' (which sounds like the French 'foutre' — a crude word for sex) and 'coun' (Alice's attempt at English 'gown,' which sounds like the French 'con' — a crude word for female genitalia). Katherine's response is a full-scale courtly protest: these are 'mots de son mauvais, corruptible, gros, et impudique, et non pour les dames d'honneur d'user' — words of bad sound, corrupting, coarse, and immodest, not for ladies of honour to use. But she recites them anyway in her summary. The joke is that the English vocabulary of marriage-preparation is, from a French ear, a catalogue of obscenities. Shakespeare is making a very specific cross-linguistic observation about how sexual vocabulary hides in innocent words across languages. It is also a quiet comment on what marriage to the enemy king may bring.",
      sources: ["Margaret Jones-Davies, 'Shakespeare's French,' in Shakespeare and the Middle Ages (2009)", "Juliet Dusinberre, Shakespeare and the Nature of Women (1975)"]
    },
  ];

  TRIALS.henry_v_act3_scene4 = [
    {
      kind: "structural",
      prompt: "What is unusual about 3.4 as a scene?",
      options: [
        "It is in blank verse",
        "It is performed entirely in French (with Katherine's attempted English body-words), without English choral framing — an interlude preparing Katherine for a marriage Henry has not yet won",
        "It has only one character",
        "It is a sonnet, like the Prologue"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 47
    },
    {
      kind: "close_reading",
      prompt: "What is the source of Katherine's comic shock at 'foot' and 'coun' (lines 34–38)?",
      options: [
        "She dislikes feet",
        "The English words 'foot' (close to French 'foutre') and 'coun' (close to French 'con') sound obscene to French ears — a cross-linguistic sexual pun",
        "She cannot pronounce them",
        "Alice has taught her the wrong words"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 34, anchor_line_end: 42
    },
    {
      kind: "theme",
      prompt: "What political work does the scene quietly do?",
      options: [
        "None — it is comic relief only",
        "It stages Katherine's preparation (vocabulary, by body-part) for a marriage to the conquering English king; when Henry woos her in 5.2, we have already watched her assemble the vocabulary",
        "It introduces Alice as a new character for Act 4",
        "It announces the French surrender at Agincourt"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 1, anchor_line_end: 47
    },
  ];

  ANNOTATIONS.henry_v_act3_scene5 = [
    {
      line_start: 5, line_end: 34,
      citation_display: cite("3.5", 5, 34),
      category: "thematic",
      title: "The French self-diagnosis — Norman bastards and cold blood",
      body: "The Dauphin and Bourbon's speech about the English is one of the most politically revealing moments in the play. Their complaint is genealogical: the English are 'Normans, but bastard Normans, Norman bastards,' i.e. the French admit that the English invaders are descendants of their own Norman ancestors (via 1066), degraded by mixing with the 'wild and savage stock' of England. The Constable's speech that follows elaborates this into a climatic argument: how can a foggy, raw, cold country, living on beer ('sur-rein'd jades' drench), produce warriors hot enough to fight? The passage is doing work on two levels. Internally, it is French panic expressed as ethnic self-regard. Externally, Shakespeare is flattering his English audience: the French themselves admit that English valour is a mystery. The anxiety about mass rape ('our mettle is bred out, and they will give / Their bodies to the lust of English youth / To new-store France with bastard warriors') is especially striking: it inverts and acknowledges the Harfleur threat. The French fear what Henry just threatened.",
      sources: ["Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)", "Willy Maley, Nation, State, and Empire in English Renaissance Literature (2003)"]
    },
  ];

  TRIALS.henry_v_act3_scene5 = [
    {
      kind: "close_reading",
      prompt: "What does the Constable claim distinguishes the English at line 15 onwards?",
      options: [
        "They have more men",
        "That their cold, foggy climate and beer-fed diet should disqualify them as warriors — yet they fight hot and bravely, a paradox Constable finds shameful for France",
        "Their cavalry is superior",
        "They have better generals"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 14, anchor_line_end: 25
    },
    {
      kind: "theme",
      prompt: "What does the Dauphin fear at lines 27–30?",
      options: [
        "A French retreat",
        "That French women will give themselves to English soldiers and repopulate France with 'bastard warriors' — mass rape as ethnic replacement, the very threat Henry made at Harfleur",
        "That the Dauphin will be captured",
        "That the English army lacks bread"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 27, anchor_line_end: 30
    },
  ];

  ANNOTATIONS.henry_v_act3_scene6 = [
    {
      line_start: 32, line_end: 90,
      citation_display: cite("3.6", 32, 90),
      category: "thematic",
      title: "Bardolph's execution — Henry's old companion killed, without comment",
      body: "The execution of Bardolph for stealing a pax (a small altar object) from a French church is one of the play's most pointed structural decisions. Bardolph had been Falstaff's companion throughout the Henry IV plays and one of Prince Hal's Eastcheap drinking-crew; he is an old familiar face, a man Henry knew well in his youth. Fluellen reports the execution almost incidentally: 'one Bardolph, if your majesty know the man: his face is all bubukles, and whelks, and knobs, and flames o' fire...' Henry answers, 'We would have all such offenders so cut off' — a single line, no recognition, no hesitation. Compare Hal's immediate, raw grief when he thought Falstaff was dead in Henry IV Part 1, 5.4. The Henry V who executes Bardolph has successfully eliminated the Prince Hal who knew him. Readers should register the absence of emotion as itself the scene's moral statement. And Henry's follow-on speech forbidding English plunder in the villages — 'the gentler gamester is the soonest winner' — is the same speech that just refused to protect an old companion from the hanging-tree. The morality is consistent, but only if you accept that Henry's conversion from Hal to king was complete.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Stephen Greenblatt, Will in the World (2004)", "Graham Holderness, Shakespeare: The Histories (2000)"]
    },
    {
      line_start: 113, line_end: 140,
      citation_display: cite("3.6", 113, 140),
      category: "close_reading",
      title: "Henry's 'plain soldier' frankness with Montjoy",
      body: "When Montjoy the French herald arrives, Henry's answer is unusually direct: 'My people are with sickness much enfeebled, / My numbers lessened, and those few I have / Almost no better than so many French.' This is a private admission of weakness delivered to the enemy, and it is unexpected. The strategic calculation is one thing: Montjoy will report the English army as a ragged band, inviting the French to attack en masse rather than let the sick English march quietly to Calais. But there is also a rhetorical honesty here that Henry does not display elsewhere in the play. He even apologizes for boasting ('forgive me, God, / That I do brag thus'). The passage prepares us for the Henry of the night before Agincourt — the king who will walk among his men disguised and hear their complaints. The 'plain soldier' pose that dominates the wooing scene is already being rehearsed.",
      sources: ["Anne Barton, 'The King Disguised,' in The Triple Bond (1975)", "Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)"]
    },
  ];

  TRIALS.henry_v_act3_scene6 = [
    {
      kind: "inference",
      prompt: "How does Henry respond to the news that his old Eastcheap companion Bardolph is to be executed?",
      options: [
        "With private grief",
        "By pardoning Bardolph",
        "With a single line endorsing the execution — 'We would have all such offenders so cut off' — showing that Prince Hal has been successfully eliminated from the present king",
        "By sending him back to England in chains"
      ],
      answer_index: 2, wisdom_reward: 30,
      anchor_line_start: 82, anchor_line_end: 90
    },
    {
      kind: "comprehension",
      prompt: "What does Henry tell Montjoy about the English army's condition?",
      options: [
        "That it is in full health",
        "That the soldiers are enfeebled by sickness and reduced in numbers — a candid admission of weakness, delivered to the enemy",
        "That reinforcements have just arrived from England",
        "That the Dauphin has already surrendered"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 119, anchor_line_end: 122
    },
    {
      kind: "theme",
      prompt: "Henry's maxim 'the gentler gamester is the soonest winner' (line 92) refers to —",
      options: [
        "A recommendation that soldiers play chess",
        "His policy of forbidding plunder from French villages — strict discipline and payment for supplies, to conciliate the local population and speed the march",
        "A proverb about card games",
        "Instruction on how to treat horses"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 88, anchor_line_end: 92
    },
  ];

  ANNOTATIONS.henry_v_act3_scene7 = [
    {
      line_start: 1, line_end: 46,
      citation_display: cite("3.7", 1, 46),
      category: "thematic",
      title: "The French nobles and their horses — the play's critique of aristocratic vanity",
      body: "The extended discussion of horses and armour among the French nobles the night before Agincourt is the play's sharpest piece of character-comedy. The Dauphin's description of his horse ('pure air and fire,' 'le cheval volant,' the Pegasus-comparison, 'my horse is my mistress') is over-refined to the point of absurdity. The Constable's needling about the Dauphin's sonnet-to-his-horse is a scholarly joke — sonnets are properly addressed to mistresses. The scene stages the French aristocracy as over-cultivated, effeminate (they prefer horses to women), and over-confident. This is not neutral characterization. Shakespeare is shaping the English self-image by contrast: the English are starving, dirty, and silent; the French are ornate, voluble, and dissipated. Historically, the French nobility at Agincourt were heavily armoured knights who were indeed beaten by English yeoman archers. The play translates that military reality into a cultural one. Virgil asks the modern reader to notice this: the comic French scenes are ideological work, not decoration. The culture being defeated is coded as feminine and aesthetic; the culture doing the defeating is coded as plain and masculine.",
      sources: ["Lisa Jardine, Still Harping on Daughters (1983)", "Janet Adelman, Suffocating Mothers (1992)", "Graham Holderness, Shakespeare: The Histories (2000)"]
    },
    {
      line_start: 95, line_end: 117,
      citation_display: cite("3.7", 95, 117),
      category: "close_reading",
      title: "The mastiffs and the poor English army",
      body: "The French nobles' contempt for the English army is characterized with precision at the scene's close. Rambures compares the English to their 'mastiffs' — courageous but stupid dogs — and Orleans develops the simile: 'Foolish curs, that run winking into the mouth of a Russian bear / And have their heads crushed like rotten apples.' The Constable caps it: the English 'leave their wits with their wives, … give them great meals of beef and iron and steel, / They will eat like wolves and fight like devils.' Then the final deflation: 'Ay, but these English are shrewdly out of beef.' This is a clean dramatic irony. The audience knows the English have just been starved by the march; the French think they know the same and consider it the guarantee of victory. Tomorrow the army will win Agincourt. The scene is structured so that the French express their strategic assessment with perfect cultural snobbery and complete confidence, the audience hears it without commentary, and the play proceeds to falsify every word.",
      sources: ["Emrys Jones, Scenic Form in Shakespeare (1971)", "Andrew Gurr, The Shakespearean Stage (1992)"]
    },
  ];

  TRIALS.henry_v_act3_scene7 = [
    {
      kind: "theme",
      prompt: "How does the play characterize the French nobles at 3.7?",
      options: [
        "As sober military planners",
        "As over-refined, voluble, effeminate — in love with their horses and armour, composing sonnets to their mounts; this is ideological work, not neutral comedy. The play is shaping the English self-image by cultural contrast",
        "As honest peasants",
        "As religious fanatics"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 1, anchor_line_end: 50
    },
    {
      kind: "close_reading",
      prompt: "What is the joke of the Constable's line 'I have heard a sonnet begin so to one's mistress' (line 33)?",
      options: [
        "It is a misquotation",
        "Sonnets are properly addressed to mistresses; the Dauphin has written one to his horse — the Constable is accusing him of treating his horse as a lover. The Dauphin then doubles down: 'my horse is my mistress'",
        "Orleans doesn't understand sonnets",
        "The sonnet is a recent invention in the play's timeline"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 33, anchor_line_end: 36
    },
    {
      kind: "inference",
      prompt: "What is the dramatic irony of the French nobles' confidence in 3.7?",
      options: [
        "They don't know that Henry has already left for Calais",
        "They correctly assess the English army as starving and reduced, but conclude from this (wrongly) that victory is guaranteed — the audience knows Agincourt is tomorrow and the English will win",
        "They are fooled by a false peace offer",
        "The French king has died in the night"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 95, anchor_line_end: 117
    },
  ];
};
