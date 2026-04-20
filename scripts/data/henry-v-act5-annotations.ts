/**
 * Henry V — Act V annotations + Trials.
 * 5 Chorus: London's reception + the Essex topical reference.
 * 5.1: Fluellen forces Pistol to eat the leek; Pistol's closing turn.
 * 5.2: Treaty of Troyes + the wooing scene.
 */
interface Annotation { line_start: number; line_end: number; citation_display: string; category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading"; title: string; body: string; sources: string[]; }
interface Trial { kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural"; prompt: string; options: [string,string,string,string]; answer_index: 0|1|2|3; wisdom_reward: number; anchor_line_start: number; anchor_line_end: number; }

module.exports = function (ANNOTATIONS: Record<string, Annotation[]>, TRIALS: Record<string, Trial[]>, cite: (label: string, ls: number, le: number) => string) {

  ANNOTATIONS.henry_v_act5_chorus = [
    {
      line_start: 9, line_end: 34,
      citation_display: cite("5 Chorus", 9, 34),
      category: "structural",
      title: "London as Rome — the triumphal reception",
      body: "The 5 Chorus describes Henry's return to London in deliberately Roman terms: the mayor and aldermen 'Like to the senators of the antique Rome,' the plebeians at their heels, going forth to fetch their 'conquering Caesar in.' Henry's refusal of the triumphal display — refusing to have his bruised helmet and bent sword carried before him — is registered as humility ('being free from vainness and self-glorious pride'). Readers should note the layered strategy: the Chorus Latinizes London, elevates the event to antique ceremony, and then has Henry decline the ceremony, giving him all the moral credit of humility while retaining all the classical grandeur the framing confers. This is rhetorical double-counting. The passage is also the point at which the Chorus's voice sounds most frankly adulatory — and critics have often read this as the moment Shakespeare's irony is least available. Whether one hears the Chorus-stanza as sincere or as over-freighted with praise is a test of how the whole play sounds to each reader.",
      sources: ["Norman Rabkin, 'Either/Or' (1981)", "Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)"]
    },
    {
      line_start: 29, line_end: 34,
      citation_display: cite("5 Chorus", 29, 34),
      category: "historical",
      title: "The Essex reference — the play's one dating anchor",
      body: "'Were now the general of our gracious empress, / As in good time he may, from Ireland coming, / Bringing rebellion broached on his sword' — this is Henry V's only unambiguous topical reference, and its dating is important. The 'general of our gracious empress' is the Earl of Essex, Queen Elizabeth I's favorite, who set out for Ireland in late March 1599 to put down Hugh O'Neill's rebellion. Essex returned in September 1599 without victory; his attempted rebellion and execution followed in 1601. This means Henry V was written and performed in the narrow window between roughly March and September 1599 — almost certainly for the opening of the Globe that summer. The reference is optimistic about Essex ('as in good time he may') in a way that became impossible after his return. The line is thus historical evidence about both the play's composition date and the political sympathies of the Chamberlain's Men in the weeks before the Essex disaster. By the time the Folio was printed in 1623, Essex was twenty years dead; the line read (and reads) as the ghost of a hope.",
      sources: ["Gary Taylor (ed.), The Oxford Shakespeare: Henry V (1982), introduction", "Paul E. J. Hammer, The Polarisation of Elizabethan Politics (1999)", "Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)"]
    },
  ];

  TRIALS.henry_v_act5_chorus = [
    {
      kind: "close_reading",
      prompt: "How does the Chorus describe Henry's return to London (lines 9–28)?",
      options: [
        "As a quiet homecoming",
        "In Roman triumphal terms — the mayor and aldermen as 'senators of the antique Rome,' Londoners as plebeians, Henry as 'conquering Caesar' — but Henry declines the triumphal display, gaining the credit of humility while retaining the classical grandeur the framing supplies",
        "As a disaster",
        "As a secret arrival by night"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 9, anchor_line_end: 28
    },
    {
      kind: "historical",
      prompt: "The reference at lines 29–34 to 'the general of our gracious empress … from Ireland coming' dates the play how?",
      options: [
        "It cannot be dated",
        "To late March–September 1599 — during the Earl of Essex's Irish campaign, while hope for his success was still possible. After his return without victory (autumn 1599) and his execution (1601), the line could not have been written in that form",
        "To 1603, after Elizabeth's death",
        "To 1595, before the Globe was built"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 29, anchor_line_end: 34
    },
  ];

  ANNOTATIONS.henry_v_act5_scene1 = [
    {
      line_start: 1, line_end: 44,
      citation_display: cite("5.1", 1, 44),
      category: "structural",
      title: "Fluellen forces Pistol to eat the leek — the cycle closes",
      body: "The leek scene is long-setup comedy. At 4.1 Pistol mocked Fluellen's leek (not knowing he was speaking to the king's kinsman); at 5.1 Fluellen, now a veteran with Henry's acknowledgement, beats Pistol with a cudgel and forces him to eat a raw leek bite by bite. The comedy is brutal: Pistol is a known coward and a known petty criminal, and the scene gives us the satisfaction of seeing his bombast physically collapsed. But there is also a social point. Fluellen, the Welsh captain whose dialect we have been permitted to laugh at for four acts, now enforces discipline on the English braggart, and Gower (the English captain) endorses the act at length: 'henceforth let a Welsh correction teach you a good English condition.' The ethnic hierarchy the play has played with is, in this scene, upended: the Welshman teaches the Englishman manners. The scene also works as a final, unsentimental reckoning with the Eastcheap world. Pistol's closing soliloquy — Doll is dead, the rendezvous is cut off, 'bawd I'll turn, / And something lean to cutpurse of quick hand' — announces that he will go home to England and live by crime, with his 'cudgell'd scars' passed off as war-wounds. This is what the campaign has produced in the low-comic line: a criminal with a false story. The play does not soften it.",
      sources: ["Robert Weimann, Shakespeare and the Popular Tradition in the Theater (1978)", "Ann Rosalind Jones, 'The Ethnographic Present,' in Shakespeare and the Early Modern (2002)"]
    },
    {
      line_start: 62, line_end: 71,
      citation_display: cite("5.1", 62, 71),
      category: "thematic",
      title: "Pistol's homecoming as the play's underfoot pay-off",
      body: "Pistol's short closing soliloquy is the play's only honest post-war economic statement. He reports two facts: his wife Doll/Nell has died of the 'malady of France' (syphilis), and his tavern-rendezvous is therefore cut off. His plan: steal his way home to England, become a pimp ('bawd') and cut-purse, pass off his leek-beating bruises as war-wounds ('the Gallia wars'). The grim comedy is that Pistol will be one of the veterans of Agincourt the English streets soon see. The King's 'band of brothers' promise — that shared combat would 'gentle' a low soldier's condition — is falsified here by a low soldier making his own account. The speech is less than a dozen lines; it is what the victory looks like from the side of the army that had nothing to begin with. Readers should notice that Shakespeare ends his low-plot with this speech and not with the leek's beating. The beating is the comic catharsis; the soliloquy is the audit.",
      sources: ["C. L. Barber, Shakespeare's Festive Comedy (1959)", "Thomas Healy, Shakespeare, Alienation and the Early Modern Stage (1994)"]
    },
  ];

  TRIALS.henry_v_act5_scene1 = [
    {
      kind: "structural",
      prompt: "What does the leek scene accomplish?",
      options: [
        "Mere slapstick",
        "A long-setup comic pay-off: Fluellen beats Pistol with a cudgel and forces him to eat a raw leek, inverting the play's ethnic hierarchy — the Welshman corrects the English bombast, with Gower's explicit endorsement",
        "A political rebellion",
        "A second glove-plot"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 60
    },
    {
      kind: "theme",
      prompt: "What does Pistol's closing soliloquy reveal?",
      options: [
        "That he is reformed",
        "That he will return to England as a pimp and cut-purse, passing off his leek-bruises as war-wounds. His honest post-war account falsifies Henry's 'band of brothers' promise of social elevation for low-born soldiers",
        "That he plans to marry Alice",
        "That he has enlisted again for France"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 62, anchor_line_end: 71
    },
    {
      kind: "comprehension",
      prompt: "What has happened to Pistol's wife?",
      options: [
        "She has returned to Eastcheap",
        "She has died of the 'malady of France' — syphilis — in the hospital",
        "She is in Scotland",
        "She has become a nun"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 63, anchor_line_end: 64
    },
  ];

  ANNOTATIONS.henry_v_act5_scene2 = [
    {
      line_start: 23, line_end: 67,
      citation_display: cite("5.2", 23, 67),
      category: "close_reading",
      title: "Burgundy's lament for France — the garden-pastoral as political argument",
      body: "The Duke of Burgundy's forty-five-line plea for peace is the scene's opening rhetorical set-piece, and one of the play's most celebrated passages. It is also a political argument disguised as pastoral description. Burgundy catalogues, at length, what war has done to the French countryside: the 'naked, poor and mangled Peace' exiled; vines unpruned and dying; hedges grown wild; meadows overrun with weeds ('darnel, hemlock and rank fumitory'); and — extending the image — houses, children, and citizens 'grow like savages' for want of the 'sciences that should become our country.' The passage is beautiful and persuasive. It is also politically precise: Burgundy, historically a key mediator between the English and French crowns, is arguing that peace at any price is necessary for French civic life. This is the kind of speech Henry needs to hear in order to move forward with the treaty. The scene's structural logic is that Burgundy's lyrical diplomacy softens the French, and Henry can then extract his terms (marriage, heir-status to the crown, Katherine as capital demand) against a background of visibly ravaged France. The garden-pastoral rhetoric is not neutral; it is a lever.",
      sources: ["Patricia Parker, Shakespeare from the Margins (1996)", "Frank Kermode, Shakespeare's Language (2000)", "Peter Saccio, Shakespeare's English Kings (2nd ed., 2000)"]
    },
    {
      line_start: 97, line_end: 221,
      citation_display: cite("5.2", 97, 221),
      category: "thematic",
      title: "The wooing scene — Henry's 'plain soldier' pose as political performance",
      body: "Henry's courtship of Katherine is the play's longest sustained scene and its most heavily choreographed prose passage. Henry casts himself repeatedly as a 'plain soldier' — unable to dance, unable to rhyme, unable to 'look greenly' or 'gasp out [his] eloquence' — and offers Katherine only 'downright oaths' and a 'good heart.' The rhetoric is, however, anything but plain. Henry delivers long, polished prose paragraphs; he demonstrates competent (if deliberately awkward) French; he cites Saint Denis and Saint George; he prophesies a 'boy, half French, half English' who will 'take the Turk by the beard.' The 'plain soldier' pose is itself a carefully composed rhetorical mode — one more register in a king who has been speaking in different registers to different audiences throughout the play. At the same time, the scene has genuine local charm. Katherine's 'Is it possible dat I sould love de enemy of France?' (line 155) cuts through the flirtation to the unresolved political heart of the marriage. Henry's answer is a conquering-king's joke ('I love France so well that I will not part with a village of it; I will have it all mine'). The mixing of the political and the erotic is the point: Katherine is explicitly 'our capital demand,' the head of the articles, and the wooing scene is a ceremony for terms already arranged. Readers should notice who does the talking (Henry almost entirely), how much of the scene is in Henry's voice, and how carefully the 'plain soldier' pose is kept up. The pose is convincing; it is also work.",
      sources: ["Karen Newman, Fashioning Femininity and English Renaissance Drama (1991)", "Juliet Dusinberre, Shakespeare and the Nature of Women (1975)", "Lisa Jardine, Reading Shakespeare Historically (1996)"]
    },
    {
      line_start: 233, line_end: 242,
      citation_display: cite("5.2", 233, 242),
      category: "close_reading",
      title: "'Nice customs curtsy to great kings' — the wooing scene's operative phrase",
      body: "When Katherine politely cites the French custom that ladies are not kissed before their wedding, Henry's response is one of the most quietly revealing lines in the play: 'O Kate, nice customs curtsy to great kings. Dear Kate, you and I cannot be confined within the weak list of a country's fashion: we are the makers of manners, Kate; and the liberty that follows our places stops the mouth of all find-faults.' The phrase 'makers of manners' is operative. Henry is declaring that royal prerogative overrides national custom — his and Katherine's, jointly. The line works as wooing (it assimilates Katherine to his royal freedom), as conquest (it overrides French custom with English-king prerogative), and as political theory (kings are not subject to cultural norms, they make them). The kiss that follows is both a romantic gesture and a small constitutional act. Critics sometimes hear the scene as charming; Shakespeare also gives us this line. Both hearings are correct; the scene is doing both kinds of work at once.",
      sources: ["Stephen Greenblatt, Will in the World (2004)", "Graham Holderness, Shakespeare: The Histories (2000)"]
    },
    {
      line_start: 285, line_end: 302,
      citation_display: cite("5.2", 285, 302),
      category: "historical",
      title: "The Treaty of Troyes — what the wooing scene is serving",
      body: "The scene's formal conclusion records the effective terms of the Treaty of Troyes (1420). Exeter reads out the one article the French king has balked at: Henry is to be named in all future French royal documents as 'Notre très-cher fils Henri, Roi d'Angleterre, Héritier de France' — 'Our most dear son Henry, King of England, Heir of France.' The French king is to disinherit his own son (the Dauphin of the play, historically the future Charles VII) and acknowledge Henry as heir to the French throne. This was the Treaty's actual most important clause. The wooing scene is thus ornamental around this political fact: Katherine is given to Henry as the dynastic seal of an agreement that makes Henry the next king of France. Historically, the Treaty held for barely two years: Henry V died of dysentery in August 1422, and his infant son Henry VI's regency promptly collapsed, enabling Charles VII's eventual reconquest (the era of Joan of Arc) and the loss of all French territory by 1453. The play does not mention any of this within the scene — it is reserved for the Epilogue. But the reader who holds the Treaty's actual history alongside Henry's closing 'Prepare we for our marriage' will hear the scene's final lines differently from a reader who does not.",
      sources: ["Anne Curry, The Hundred Years War (2nd ed., 2003)", "Peter Saccio, Shakespeare's English Kings (2nd ed., 2000)", "Christopher Allmand, Henry V (1992)"]
    },
  ];

  TRIALS.henry_v_act5_scene2 = [
    {
      kind: "close_reading",
      prompt: "What is Burgundy doing rhetorically in his long lament for France (lines 23–67)?",
      options: [
        "Genuinely grieving for French agriculture only",
        "Delivering a political argument in pastoral disguise: the 'naked, poor and mangled Peace' and the overgrown vineyards are a plea that justifies French concessions on any terms. The beauty of the rhetoric is the lever",
        "Confessing to treason",
        "Proposing a Crusade"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 23, anchor_line_end: 67
    },
    {
      kind: "theme",
      prompt: "How should we read Henry's 'plain soldier' pose in the wooing scene?",
      options: [
        "As literally plain, unrehearsed speech",
        "As a carefully composed rhetorical register — Henry delivers long polished prose paragraphs while claiming plainness; the pose is one more audience-calibrated register in a king whose speech varies by audience throughout the play",
        "As evidence he had no eloquence",
        "As a sign of his youthful nerves"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 114, anchor_line_end: 142
    },
    {
      kind: "close_reading",
      prompt: "What is the force of Henry's 'nice customs curtsy to great kings … we are the makers of manners' (lines 234–236)?",
      options: [
        "A tactful compliment to French tradition",
        "An assertion of royal prerogative over cultural norm: kings aren't subject to custom, they create it. The line overrides Katherine's objection to pre-marriage kissing and doubles as political theory",
        "A quotation from Chaucer",
        "A piece of Welsh dialect"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 234, anchor_line_end: 236
    },
    {
      kind: "historical",
      prompt: "What does Exeter read out at lines 285–288?",
      options: [
        "A prayer in French",
        "The key clause of the Treaty of Troyes (1420): that Henry is to be named 'Héritier de France' — heir to the French throne — in all future French royal documents. The wooing scene ornaments this treaty-clause",
        "Katherine's dowry inventory",
        "A list of French prisoners still held in England"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 285, anchor_line_end: 288
    },
    {
      kind: "inference",
      prompt: "What does the wooing scene's place in the play's argument invite us to see?",
      options: [
        "That love conquers all political conflict",
        "That the marriage is a dynastic settlement dressed as romance: Katherine is the 'capital demand' of the treaty; the wooing scene is a ceremony for terms already arranged. Romance and conquest are not separable here",
        "That Henry has given up his French claim",
        "That Katherine was secretly Welsh"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 94, anchor_line_end: 96
    },
    {
      kind: "theme",
      prompt: "Why does Katherine's 'Is it possible dat I sould love de enemy of France?' (line 155) matter?",
      options: [
        "It introduces Katherine as a minor character",
        "It is the one moment the scene's underlying political question surfaces in Katherine's own voice. Henry's reply — loving him means loving France's conqueror, who will have 'all' of it — doesn't resolve the question so much as absorb it",
        "It shows Katherine does not actually speak French",
        "It is a quotation from Chaucer"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 155, anchor_line_end: 161
    },
  ];
};
