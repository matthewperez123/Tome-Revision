/**
 * Henry V — Act IV annotations + Trials.
 * 4 Chorus (Tier-1 — the night before Agincourt), 4.1 (Tier-1 — Williams),
 * 4.2, 4.3 (Tier-1 — Crispin's Day), 4.4, 4.5, 4.6 (Tier-1 — prisoners),
 * 4.7, 4.8.
 */
interface Annotation { line_start: number; line_end: number; citation_display: string; category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading"; title: string; body: string; sources: string[]; }
interface Trial { kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural"; prompt: string; options: [string,string,string,string]; answer_index: 0|1|2|3; wisdom_reward: number; anchor_line_start: number; anchor_line_end: number; }

module.exports = function (ANNOTATIONS: Record<string, Annotation[]>, TRIALS: Record<string, Trial[]>, cite: (label: string, ls: number, le: number) => string) {

  ANNOTATIONS.henry_v_act4_chorus = [
    {
      line_start: 1, line_end: 28,
      citation_display: cite("4 Chorus", 1, 28),
      category: "close_reading",
      title: "The atmospheric masterwork — night between two armies",
      body: "The Act 4 Chorus is, for many critics, the single greatest poetic passage in Shakespeare's histories. It does not narrate events; it builds an atmosphere. The opening triplet — 'creeping murmur,' 'poring dark,' 'wide vessel of the universe' — establishes a nocturnal stillness in which the two armies are close enough to hear each other ('the fix'd sentinels almost receive / The secret whispers of each other's watch'). The visual poetry that follows — 'fire answers fire,' 'paly flames,' 'umber'd face,' 'steed threatens steed' — gives the reader a cinematic image of two camps facing each other across a dark field. The sound-world is tight: hammers closing rivets, cocks crowing, clocks tolling the third hour. The Chorus uses the stillness to set up the contrast: the 'over-lusty' French playing at dice, the 'poor condemned English' sitting like sacrifices by their watchful fires. No battle has yet begun; everything about the outcome is already ambient.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)", "Emrys Jones, Scenic Form in Shakespeare (1971)", "Stephen Greenblatt, Will in the World (2004)"]
    },
    {
      line_start: 29, line_end: 47,
      citation_display: cite("4 Chorus", 29, 47),
      category: "thematic",
      title: "'A little touch of Harry in the night' — the king as moral presence",
      body: "The Chorus's portrait of Henry walking among his soldiers — 'bids them good morrow with a modest smile / And calls them brothers, friends, and countrymen' — is the play's official version of the event. Henry is generous, his liberal eye a 'largess universal like the sun'; wretches 'pluck comfort from his looks.' The tableau is hagiographic. The famous phrase 'a little touch of Harry in the night' has a tender, almost monastic cadence. But the Chorus is about to hand over to the actual 4.1 scene, which will show us Henry doing what the Chorus has described — except with a specific and conflictual encounter: the Williams debate. The Chorus and the scene do not contradict each other exactly, but the Chorus's radiant-royal generosity and the scene's soldier's critique of royal responsibility do not occupy the same moral universe. Again, both are the play; readers should hold both.",
      sources: ["Anne Barton, 'The King Disguised,' in The Triple Bond (1975)", "Norman Rabkin, 'Either/Or' (1981)"]
    },
  ];

  TRIALS.henry_v_act4_chorus = [
    {
      kind: "close_reading",
      prompt: "What atmosphere does the Chorus build in lines 1–16?",
      options: [
        "A blazing daytime battlefield",
        "A quiet night between two armies, close enough to hear each other's sentinels — a cinematic stillness in which the hammers of armourers, the crowing of cocks, and the tolling of clocks all register",
        "A stormy sea-crossing",
        "A royal funeral"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 16
    },
    {
      kind: "theme",
      prompt: "What does 'A little touch of Harry in the night' (line 47) do?",
      options: [
        "Introduces Harry as a character",
        "Concludes the Chorus's hagiographic portrait of Henry as a morally radiant presence among his men — just before the 4.1 scene will complicate that portrait with Williams's challenge",
        "Stages Henry's nightmare",
        "Describes a battle already underway"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 47, anchor_line_end: 47
    },
    {
      kind: "close_reading",
      prompt: "How does the Chorus contrast the two armies at lines 17–28?",
      options: [
        "They are equally confident",
        "The French 'over-lusty' and 'secure in soul,' playing at dice for English prisoners; the 'poor condemned English' sitting 'like sacrifices' by their fires, 'horrid ghosts' in the moonlight",
        "Both armies are asleep",
        "The English play dice and the French pray"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 17, anchor_line_end: 28
    },
  ];

  ANNOTATIONS.henry_v_act4_scene1 = [
    {
      line_start: 1, line_end: 30,
      citation_display: cite("4.1", 1, 30),
      category: "thematic",
      title: "Henry's philosophy of hardship — 'soul of goodness in things evil'",
      body: "The scene opens with Henry's characteristic alchemical language: 'There is some soul of goodness in things evil, / Would men observingly distil it out.' The formulation is Stoic in its lineage — the philosopher's counsel that what cannot be avoided can be repurposed. Henry extends it: the 'bad neighbour' (the French army) is their 'outward conscience,' preaching 'that we should dress us fairly for our end.' What is unusual here is the private nature of the speech. Henry is speaking to his brothers and Erpingham before the sun is up; there is no crowd to impress, no audience to persuade. The speech is not performance; it is what the king actually thinks. This matters when we turn to the Chorus's heroic portrait and the Williams dialogue that follows: Henry genuinely believes hardship has spiritual value, and he genuinely believes a king's work is to model that belief to his men. The rhetorical question the play keeps asking is whether this private piety changes anything about the political and moral compromises Henry has already made.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 69, line_end: 70,
      citation_display: cite("4.1", 69, 70),
      category: "close_reading",
      title: "Henry's aside on Fluellen",
      body: "In the brief moment after overhearing Fluellen rebuking Gower for loud speech at night, Henry says: 'Though it appear a little out of fashion, / There is much care and valour in this Welshman.' It is a small line, but important. Henry is watching a subordinate whom the audience has been permitted to find comic, and he sees something genuine in him. The line is evidence that Henry's generosity is not only rhetorical — and it anticipates Henry's public affirmation in 4.7 ('I am Welsh, you know, good countryman') that binds the king to the Welsh soldiery. A king who can hear out-of-fashion manners and still see care and valour in them is a king the play takes seriously. This is one of the small ways Shakespeare earns our ambivalence: not every Henry-moment is a calculation.",
      sources: ["Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)", "Peter Saccio, Shakespeare's English Kings (2nd ed., 2000)"]
    },
    {
      line_start: 106, line_end: 145,
      citation_display: cite("4.1", 106, 145),
      category: "thematic",
      title: "The Williams debate — royal responsibility on trial",
      body: "The dialogue between Henry (disguised) and the soldier Michael Williams is the play's most sustained philosophical passage. Williams's argument is precise: if the king's cause is unjust, his soldiers die damned; if they die damned, 'it will be a black matter for the king that led them to it.' Henry's reply is the long merchant/servant analogy (lines 122–145): a father who sends a son to sea does not damn himself if the son sins on the journey; a master who sends a servant with money is not damned if the servant is killed by robbers. The argument's logic is: each subject's soul is his own; the king is not responsible for the spiritual state of his soldiers at the moment of death. This is internally coherent theology. But it is also a careful evasion of Williams's real question, which is about the justness of the cause itself. Henry's reply does not engage the premise ('if the cause be not good'); it sidesteps it by asserting the separability of king's judgement and subject's soul. Williams's concession ('Ay, he said so, to make us fight cheerfully') suggests the soldier is not fully persuaded. The scene refuses to vindicate either voice. It is the play's most direct staging of the critique that the Chorus's rhetoric wants to suppress.",
      sources: ["Norman Rabkin, 'Either/Or' (1981)", "Graham Holderness, Shakespeare: The Histories (2000)", "Alexander Leggatt, Shakespeare's Political Drama (1988)"]
    },
    {
      line_start: 193, line_end: 209,
      citation_display: cite("4.1", 193, 209),
      category: "historical",
      title: "'Not today, O Lord' — Henry IV's usurpation and the guilty crown",
      body: "Henry's prayer alone before dawn — 'Not today, O Lord, / O, not today, think not upon the fault / My father made in compassing the crown' — is one of the play's most historically rich moments. Henry IV had seized the throne from his cousin Richard II in 1399, forcing Richard's abdication and later condoning his murder. This dynastic sin has shadowed the Lancastrian line throughout the first tetralogy (Henry VI Parts 1–3) and the second (Richard II, Henry IV Parts 1–2). Henry V's reburial of Richard II at Westminster Abbey (historically attested, 1413) and his endowment of two chantries for Richard's soul are acts of atonement specifically. Henry's prayer is honest about this: 'all that I can do is nothing worth, / Since that my penitence comes after all.' The Lancastrian curse — that usurpation poisons the crown and will eventually bring civil war — is acknowledged by the king himself in solitude. The Epilogue will return to it: Henry VI will lose France and England will bleed in the Wars of the Roses that end the tetralogy Shakespeare had already written.",
      sources: ["Peter Saccio, Shakespeare's English Kings (2nd ed., 2000)", "Nigel Saul, Richard II (1997)", "Gary Taylor (ed.), Henry V (1982)"]
    },
  ];

  TRIALS.henry_v_act4_scene1 = [
    {
      kind: "theme",
      prompt: "What philosophical stance opens Henry's speech to his brothers?",
      options: [
        "Pure fatalism",
        "A stoic/alchemical stance: 'some soul of goodness in things evil' — hardship can be distilled into spiritual preparation; the bad neighbour is an 'outward conscience' teaching us to 'dress us fairly for our end'",
        "Scepticism about prayer",
        "A renunciation of kingship"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 3, anchor_line_end: 12
    },
    {
      kind: "close_reading",
      prompt: "What is Williams's central argument about royal responsibility?",
      options: [
        "That kings cannot be challenged under any circumstances",
        "That if the king's cause is unjust, his soldiers die in a state of unrepented sin — and therefore 'it will be a black matter for the king that led them to it.' The king's moral accountability is load-bearing",
        "That soldiers should refuse to fight without pay",
        "That Henry is a kind king and deserves no criticism"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 111, anchor_line_end: 121
    },
    {
      kind: "inference",
      prompt: "How does Henry answer Williams's challenge?",
      options: [
        "By agreeing entirely",
        "With the father/son and master/servant analogies: each subject's soul is his own; the king isn't damned for the private state of each soldier. The reply is theologically coherent but sidesteps Williams's actual question about the justice of the war",
        "By threatening to have him executed",
        "By revealing his identity as king on the spot"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 122, anchor_line_end: 152
    },
    {
      kind: "historical",
      prompt: "What 'fault' does Henry pray God to 'think not upon' at line 198?",
      options: [
        "His own drunken youth",
        "His father Henry IV's usurpation of Richard II's throne in 1399 — the dynastic sin Henry V has tried to atone for by reburying Richard and endowing chantries for his soul",
        "The tennis-balls insult",
        "The death of Falstaff"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 197, anchor_line_end: 209
    },
    {
      kind: "structural",
      prompt: "What does the glove-exchange between Henry and Williams set up?",
      options: [
        "Nothing — it is a throwaway moment",
        "A two-scene comic pay-off: Henry will give the glove to Fluellen in 4.7, Williams will punch Fluellen in 4.8, and Henry will reveal the trick and reward Williams with a glove full of crowns",
        "A duel that actually happens during Agincourt",
        "An engagement between Williams and Alice"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 170, anchor_line_end: 181
    },
  ];

  ANNOTATIONS.henry_v_act4_scene2 = [
    {
      line_start: 35, line_end: 53,
      citation_display: cite("4.2", 35, 53),
      category: "close_reading",
      title: "Grandpré's mocking survey — English as dead meat",
      body: "Lord Grandpré's speech describing the English army before battle is a small masterpiece of contemptuous portraiture. The English are 'island carrions' — dead flesh — 'desperate of their bones,' their tattered banners hanging limp, 'Big Mars seems bankrupt in their beggar'd host.' The horses 'Lob down their heads,' their bits fouled with chewed grass; the crows are the horses' 'executors,' impatient for the hour. It is a memorable image and (like 3.7) an intensifier of the battle's dramatic irony: the French look at this army and see food for carrion-birds. The English will win in a few hours. Notice also that Grandpré's contempt is specifically for the English army's ragged appearance, not for its fighting quality — he doesn't understand that the longbow will make appearance irrelevant. The scene closes with the Constable reaching for his guidon: the battle starts at the end of this speech.",
      sources: ["Juliet Barker, Agincourt: The King, the Campaign, the Battle (2005)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
  ];

  TRIALS.henry_v_act4_scene2 = [
    {
      kind: "close_reading",
      prompt: "Grandpré describes the English army as —",
      options: [
        "A formidable force",
        "'Island carrions, desperate of their bones' — dead meat, with crows already circling as their 'executors' — a contemptuous image that the battle is about to falsify",
        "A disciplined Roman legion",
        "A combined fleet"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 35, anchor_line_end: 48
    },
    {
      kind: "theme",
      prompt: "What does the French attitude in 4.2 accomplish structurally?",
      options: [
        "It wastes time",
        "It amplifies the dramatic irony of the coming victory: the French are certain, the audience knows Agincourt is minutes away, and the English (unseen) are already saying the prayer that 4.3 will stage",
        "It introduces the wooing subplot",
        "It previews Henry's death"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 13, anchor_line_end: 34
    },
  ];

  ANNOTATIONS.henry_v_act4_scene3 = [
    {
      line_start: 18, line_end: 39,
      citation_display: cite("4.3", 18, 39),
      category: "close_reading",
      title: "The speech's opening inversion — fewer, not more",
      body: "The Crispin's Day oration begins with a reversal that does most of the speech's political work. Westmoreland wishes for reinforcements; Henry answers by wishing for even fewer men. 'If we are mark'd to die, we are enow / To do our country loss; and if to live, / The fewer men, the greater share of honour.' The rhetorical move is calculated: by publicly welcoming under-numbering, Henry takes the army's greatest liability (numerical inferiority) and converts it into the army's greatest asset (concentrated glory). The premise is that honour is a finite resource divided among the survivors, so a smaller share-base produces more per head. This is mathematically absurd and rhetorically irresistible. Westmoreland is immediately converted (line 74: 'Would you and I alone, / Without more help, could fight this royal battle!'). Henry now offers passports and pocket money to any man unwilling to fight; none leave. The opening inversion is the gate of the speech, and the audience feels it work.",
      sources: ["Madeleine Doran, Shakespeare's Dramatic Language (1976)", "Gary Taylor (ed.), Henry V (1982)"]
    },
    {
      line_start: 40, line_end: 67,
      citation_display: cite("4.3", 40, 67),
      category: "thematic",
      title: "'Band of brothers' and the politics of fraternity",
      body: "The core of the Crispin's Day speech — 'We few, we happy few, we band of brothers; / For he today that sheds his blood with me / Shall be my brother; be he ne'er so vile, / This day shall gentle his condition' — makes two enormous promises at once. The first is fraternity: the king will call the meanest soldier 'brother.' The second is social elevation: 'vile' here means low-born (not morally evil in this period), and 'gentle his condition' means to raise him to the rank of gentleman. Henry is offering, in effect, that shared combat will dissolve class distinction. The promise is explosive; it is also, historically, not kept. Agincourt's low-born survivors returned to England as commoners; very few were raised in rank. But the speech's rhetorical power is not damaged by its promise's thin fulfilment: the 'band of brothers' phrase has become foundational to English and American military rhetoric, used for the WWII 101st Airborne ('Easy Company'), later the HBO miniseries title, and across innumerable commemorations. The speech keeps working on any reading of Henry — patriotic or critical — because the promise of shared sacrifice and honour is, in the moment of battle, genuinely mobilizing. The fact that the speech works on the 'cynical' Henry as well as the 'heroic' one is itself part of the play's argument about rhetoric and power.",
      sources: ["Norman Rabkin, 'Either/Or' (1981)", "Stephen Ambrose, Band of Brothers (1992)", "Graham Holderness, Shakespeare: The Histories (2000)"]
    },
    {
      line_start: 85, line_end: 130,
      citation_display: cite("4.3", 85, 130),
      category: "close_reading",
      title: "Henry's answer to Montjoy — the second, private oration",
      body: "After the public Crispin's Day speech, Montjoy returns for one more attempt at ransom, and Henry delivers what is effectively a second oration, less quoted but equally tight. 'We are but warriors for the working-day; / Our gayness and our gilt are all besmirch'd / With rainy marching in the painful field.' The tonal register is entirely different from the high-heroic 'band of brothers' speech: plainer, grittier, almost proletarian ('working-day,' 'slovenry,' 'poor soldiers'). Henry offers the French the image of his army as an honest working crew in dirty uniforms. It is also a commitment not to be ransomed: 'they shall have none, I swear, but these my joints' — his body is the only ransom. The combination — a public oration that promises nobility and a private answer that promises only labour and death — is rhetorically masterful. Readers should notice how many registers Henry can speak in and how each is pitched for its audience.",
      sources: ["Brian Vickers, The Artistry of Shakespeare's Prose (1968)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
  ];

  TRIALS.henry_v_act4_scene3 = [
    {
      kind: "close_reading",
      prompt: "What does Henry do with Westmoreland's wish for ten thousand more men from England?",
      options: [
        "Grants it by sending a messenger",
        "Inverts it — 'The fewer men, the greater share of honour' — converting the army's numerical liability into a rhetorical asset, then offering passports to anyone unwilling to fight",
        "Rebukes Westmoreland publicly",
        "Delays the battle to await reinforcements"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 18, anchor_line_end: 39
    },
    {
      kind: "theme",
      prompt: "What does 'be he ne'er so vile, / This day shall gentle his condition' (lines 62–63) promise?",
      options: [
        "That cowards will be pardoned",
        "That a low-born man ('vile' = socially base in period usage) who fights today will be raised to the rank of gentleman — a promise of social elevation through shared combat",
        "That French prisoners will be treated well",
        "That Henry's brothers will be made dukes"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 62, anchor_line_end: 63
    },
    {
      kind: "theme",
      prompt: "How does 'band of brothers' work on the critical (as well as patriotic) reading of Henry?",
      options: [
        "It doesn't — cynical readings make the speech ineffective",
        "The speech remains effective on any reading; even a calculating or cynical Henry could deliver it, and the rhetorical power of shared sacrifice doesn't depend on the speaker's sincerity. This is itself part of the play's argument about rhetoric and power",
        "Only Olivier's 1944 film supports the patriotic reading",
        "The speech is absent from critical editions"
      ],
      answer_index: 1, wisdom_reward: 35,
      anchor_line_start: 60, anchor_line_end: 67
    },
    {
      kind: "close_reading",
      prompt: "What register does Henry use in his answer to Montjoy (lines 108–125)?",
      options: [
        "Same as the Crispin's Day oration",
        "Plain, gritty, almost proletarian — 'warriors for the working-day,' 'besmirch'd' gilt, 'slovenry,' 'poor soldiers.' The tonal shift is pitched for the French herald",
        "Outraged Latinate grandeur",
        "Formal verse quatrains"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 108, anchor_line_end: 125
    },
    {
      kind: "comprehension",
      prompt: "What date is St. Crispin's Day, and why does it matter?",
      options: [
        "June 15 — the anniversary of Henry's coronation",
        "October 25 — the date of the Battle of Agincourt (1415); saints Crispin and Crispianus were 3rd-century martyred shoemakers",
        "March 1 — St. David's Day",
        "April 23 — St. George's Day"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 40, anchor_line_end: 48
    },
    {
      kind: "structural",
      prompt: "Why is the Crispin's Day speech preceded by a second Montjoy-embassy (lines 79–88)?",
      options: [
        "To give Montjoy more lines",
        "To give Henry a second oration-audience: the French herald gets the 'working-day' register, after the army has been given the 'band of brothers' register. The two audiences receive different speeches",
        "Because Westmoreland requested it",
        "Because Montjoy has changed sides"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 79, anchor_line_end: 130
    },
  ];

  ANNOTATIONS.henry_v_act4_scene4 = [
    {
      line_start: 1, line_end: 50,
      citation_display: cite("4.4", 1, 50),
      category: "linguistic",
      title: "Bilingual comedy — the mishearing scene",
      body: "The capture of Monsieur Le Fer by Pistol and the Boy is built on sustained linguistic misunderstanding. Pistol hears the French 'Seigneur Dieu' as the man's name; he hears 'moi' as a unit of currency ('forty moys'); he hears the soldier's 'bras' (arm) as English 'brass' (the metal) and takes offence at being offered base metal. The Boy, who actually knows French, works as translator between them. The scene is funny, but it is doing important structural work: it gives us our last sustained look at Pistol, the Boy, and the Eastcheap group before the French raid the baggage camp and kill the Boy offstage (reported in 4.7). The Boy's final soliloquy at lines 52–60 — that Pistol is a 'roaring devil in the old play' with more noise than valour, and that he (the Boy) must stay with the luggage because the French could raid the camp — is the audience's last notice of the Boy's situation. By the next scene-but-one, he will be dead. Shakespeare lets the Boy earn the last word, and then has him killed for being in its way.",
      sources: ["C. L. Barber, Shakespeare's Festive Comedy (1959)", "Patricia Parker, Shakespeare from the Margins (1996)"]
    },
  ];

  TRIALS.henry_v_act4_scene4 = [
    {
      kind: "close_reading",
      prompt: "What drives the comedy of Pistol's interrogation of the French soldier?",
      options: [
        "Pistol's fluent French",
        "A series of mishearings: 'Seigneur Dieu' taken as a name, 'moi' as a unit of currency, 'bras' (arm) as 'brass' (metal). The Boy mediates",
        "The soldier's refusal to speak",
        "A trick by the Constable of France"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 3, anchor_line_end: 20
    },
    {
      kind: "structural",
      prompt: "The Boy's soliloquy at 4.4 lines 52–60 is the audience's last extended look at him. What does he reveal?",
      options: [
        "That he's plotting with the French",
        "That he will stay with the luggage and lackeys (standard protocol for a boy non-combatant) because the French could easily raid the camp — foreshadowing his offstage death, reported in 4.7",
        "That he wants to marry Alice",
        "That he is Pistol's cousin"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 52, anchor_line_end: 60
    },
  ];

  ANNOTATIONS.henry_v_act4_scene5 = [
    {
      line_start: 1, line_end: 23,
      citation_display: cite("4.5", 1, 23),
      category: "close_reading",
      title: "The French collapse in twenty lines",
      body: "Scene 4.5 is the shortest scene in the play. The French nobles — the same Dauphin, Bourbon, Orleans, and Constable whose horse-boasts filled 3.7 — now cry out 'O diable!' and 'O seigneur! le jour est perdu, tout est perdu!' The brevity is the point. Shakespeare does not stage a French defeat scene of equal weight to any English triumph scene. Instead, he gives us twenty-three lines of panic, and then moves to 4.6, where Henry names York's death. The structural effect is fast and somewhat cruel: 3.7's fifty-line horse-bragging is paid off with 4.5's twenty-line collapse, and the ratio itself enacts the play's judgment. Bourbon's final line — 'The devil take order now! I'll to the throng; / Let life be short; else shame will be too long' — is the only dignified note. The rest is confusion. This is structural contempt rendered as pacing.",
      sources: ["Emrys Jones, Scenic Form in Shakespeare (1971)", "Andrew Gurr, The Shakespearean Stage (1992)"]
    },
  ];

  TRIALS.henry_v_act4_scene5 = [
    {
      kind: "structural",
      prompt: "What is notable about the length of 4.5?",
      options: [
        "It is the longest scene in Act IV",
        "It is the shortest scene in the play — 23 lines; the brevity is the point: 3.7's long horse-bragging scene is paid off with a compressed collapse, the ratio enacting the play's judgment",
        "It has been cut in most modern productions",
        "It is spoken in Latin"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 23
    },
  ];

  ANNOTATIONS.henry_v_act4_scene6 = [
    {
      line_start: 3, line_end: 32,
      citation_display: cite("4.6", 3, 32),
      category: "close_reading",
      title: "The York-Suffolk death — chivalric tableau",
      body: "Exeter's thirty-line report of the deaths of the Duke of York and the Earl of Suffolk is the play's most elaborate chivalric set-piece. The two earls die side by side, Suffolk first, then York 'all haggled over' comes to him; York takes Suffolk's beard, kisses the wounds on his face, and asks his soul to wait so they can fly to heaven together. The image of the two men 'espoused to death' with 'a testament of noble-ending love' is unmistakably homoerotic in its language and its staging — a male-male death-marriage. This is period chivalric idiom; it is also a tonal counterpoint to the harder action that is about to happen. Exeter's admission that he wept ('all my mother came into mine eyes / And gave me up to tears') is unusual for a commander; Henry's answer ('I blame you not; / For, hearing this, I must perforce compound / With mistful eyes') equally unusual for a king. The scene is building, in chivalric tears, an emotional charge that the next line — the order to kill the prisoners — will suddenly violate.",
      sources: ["Bruce Smith, Homosexual Desire in Shakespeare's England (1991)", "Goran V. Stanivukovic (ed.), Ovidian Transversions (2020)"]
    },
    {
      line_start: 35, line_end: 38,
      citation_display: cite("4.6", 35, 38),
      category: "historical",
      title: "'Then every soldier kill his prisoners' — the play's moral crux",
      body: "Henry's order to kill the French prisoners is the play's single most controversial moment, and Shakespeare does not soften it. 'But hark! what new alarum is this same? / The French have reinforced their scatter'd men: / Then every soldier kill his prisoners; / Give the word through.' Four lines. No debate, no hesitation, no later regret. Historically the order is attested: contemporary chroniclers (the Gesta Henrici Quinti and others) record that Henry gave this command when the baggage camp was attacked during the battle, fearing that the prisoners (who still had their weapons) would rise up and join their countrymen. The order was controversial even in its own time; some English knights refused to carry it out. The killing that followed was of noble prisoners who were, by the conventions of chivalric warfare, legally protected until ransomed. Shakespeare stages it flatly. The next scene (4.7) will let Gower interpret the order as retaliation for the French killing the camp-boys — but the play's chronology is deliberately blurred; in the text, Henry gives the order before he has heard about the boys. The moral complexity is exactly this: is Henry responding to a tactical emergency (the reinforcement alarm he mentions), a strategic calculation about armed prisoners, or a breach of the laws of war? The play refuses to adjudicate. Readers should hold the flatness of the stage-moment against the weight of what has been ordered.",
      sources: ["Gesta Henrici Quinti, ed. Frank Taylor & John S. Roskell (1975)", "Anne Curry, Agincourt: A New History (2005)", "Juliet Barker, Agincourt: The King, the Campaign, the Battle (2005)", "Theodor Meron, Bloody Constraint (1998)"]
    },
  ];

  TRIALS.henry_v_act4_scene6 = [
    {
      kind: "close_reading",
      prompt: "How does Exeter describe the death of York and Suffolk?",
      options: [
        "A distant massacre",
        "A chivalric death-marriage: the two earls 'espoused to death' with York kissing Suffolk's wounds; Exeter admits he wept; Henry admits he must 'compound / With mistful eyes' — unusual emotional frankness before the next line's order",
        "A forgotten incident",
        "A strategic retreat"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 8, anchor_line_end: 32
    },
    {
      kind: "theme",
      prompt: "How does the play stage Henry's order to kill the French prisoners?",
      options: [
        "With a long soliloquy justifying it",
        "In four lines — 'hark! what new alarum is this same? / The French have reinforced their scatter'd men: / Then every soldier kill his prisoners; / Give the word through.' No debate, no regret; the flatness itself is the play's statement",
        "As a deferred decision never actually carried out",
        "Through Fluellen's narration offstage"
      ],
      answer_index: 1, wisdom_reward: 35,
      anchor_line_start: 35, anchor_line_end: 38
    },
    {
      kind: "historical",
      prompt: "Is Henry's order historically attested?",
      options: [
        "No — it is Shakespeare's invention",
        "Yes — contemporary chroniclers (Gesta Henrici Quinti and others) record that Henry gave this command during the battle; it was controversial in its own time, with some English knights refusing to carry it out",
        "Only in French sources hostile to Henry",
        "Only in 19th-century retellings"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 37, anchor_line_end: 37
    },
    {
      kind: "inference",
      prompt: "Why does the play deliberately blur the timing between Henry's order and the French killing the camp-boys?",
      options: [
        "Sloppy writing",
        "To leave the moral question open: 4.6 has Henry give the order in response to a 'new alarum' of reinforcement, before any mention of the boys; 4.7 has Gower retroactively interpret the order as retaliation for the killed boys. The two framings are both on the page, neither adjudicated",
        "The Folio printers made an error",
        "Because Shakespeare wrote the scenes years apart"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 35, anchor_line_end: 38
    },
  ];

  ANNOTATIONS.henry_v_act4_scene7 = [
    {
      line_start: 1, line_end: 8,
      citation_display: cite("4.7", 1, 8),
      category: "structural",
      title: "The French raid on the boys — retroactive justification",
      body: "Fluellen's opening lines announce that the French have raided the English baggage camp and killed 'the poys' (the boys, in Welsh pronunciation). Gower's immediate interpretive move is to connect this atrocity to Henry's prisoner-killing order of the previous scene: 'the king, most worthily, hath caused every soldier to cut his prisoner's throat. O, 'tis a gallant king!' But the textual chronology is reversed. In the play's spoken sequence, Henry gave the order BEFORE the raid on the boys was reported. Gower is retroactively supplying a just-war justification that the moment of the order did not provide. The play keeps both framings visible. A reader can, with Gower, read the prisoner-killing as legitimate retaliation; a reader can, with the blunt text of 4.6, read it as a tactical decision with independent justification. The scene's structural honesty is that it supplies Gower's reading as reading, not as fact.",
      sources: ["Rabkin, 'Either/Or' (1981)", "Anne Curry, Agincourt: A New History (2005)"]
    },
    {
      line_start: 9, line_end: 41,
      citation_display: cite("4.7", 9, 41),
      category: "close_reading",
      title: "Alexander the Pig — the play's shrewdest parallel",
      body: "Fluellen's comparison of Henry to Alexander the Great is one of the play's most quietly consequential passages. The comedy is Welsh-dialect: 'Alexander the Pig' (for 'Big'), rivers in Macedon and Monmouth, 'salmons in both.' But the parallel Fluellen draws is dangerous. He reminds Gower that Alexander, 'in his rages, and his furies,' killed his best friend Cleitus. Gower objects: Our king is not like Alexander in that; Henry never killed any of his friends. Fluellen corrects him: 'as Alexander killed his friend Cleitus, being in his ales and his cups; so also Harry Monmouth, being in his right wits and his good judgements, turned away the fat knight with the great belly doublet.' The fat knight is Falstaff. Fluellen is saying: Alexander-drunk killed Cleitus; Henry-sober rejected Falstaff; the parallel holds. This is the play's clearest acknowledgement that Henry's rejection of Falstaff was a moral action of the same order as Alexander's murder of his friend. A Welshman in a military camp, in dialect-inflected comic cadence, delivers what is arguably the most damning critical observation the play ventures about Henry.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Stephen Greenblatt, 'Invisible Bullets' (1985)", "A. C. Bradley, 'The Rejection of Falstaff' (1902)"]
    },
    {
      line_start: 77, line_end: 102,
      citation_display: cite("4.7", 77, 102),
      category: "thematic",
      title: "'We call it Agincourt' — naming the victory",
      body: "When Montjoy returns with no more ransom-request but a plea for permission to bury the French dead, Henry asks the name of the nearest castle. Montjoy answers: 'Agincourt.' Henry immediately christens the battle: 'Then call we this the field of Agincourt, / Fought on the day of Crispin Crispianus.' The act of naming is the victory's first rhetorical monument. The place-name is not yet a battle-name; Henry makes it one. Then follows the Welsh-leek exchange with Fluellen — 'I am Welsh, you know, good countryman' — in which Henry publicly affirms his Welshness (he was born at Monmouth) and binds himself to the Welsh soldiery whose longbows had carried the day. This is Henry at his rhetorical best: naming the victory, crediting God, binding the army. It is also the moment the play's highest civic music sounds. The play does not deflate it here; the Epilogue will.",
      sources: ["Peter Saccio, Shakespeare's English Kings (2nd ed., 2000)", "Gwyn A. Williams, When Was Wales? (1985)"]
    },
  ];

  TRIALS.henry_v_act4_scene7 = [
    {
      kind: "structural",
      prompt: "What is the structural problem with Gower's interpretation at 4.7 lines 4–8?",
      options: [
        "It is false historically",
        "Gower retroactively interprets Henry's prisoner-killing order as retaliation for the French raid on the boys — but in the text Henry gave the order BEFORE the raid was reported. The play keeps both framings visible, neither adjudicated",
        "Gower is lying",
        "Fluellen contradicts it immediately"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 4, anchor_line_end: 8
    },
    {
      kind: "close_reading",
      prompt: "What parallel does Fluellen draw between Henry and Alexander the Great?",
      options: [
        "Both were born in Macedon",
        "Alexander drunk killed his friend Cleitus; Henry sober rejected Falstaff — the parallel suggests the rejection was a moral action of the same kind. Delivered in Welsh-accented dialect, this is one of the play's most damning critical observations about its king",
        "Both conquered India",
        "Both died at age 35"
      ],
      answer_index: 1, wisdom_reward: 35,
      anchor_line_start: 25, anchor_line_end: 41
    },
    {
      kind: "theme",
      prompt: "Why does Henry's exchange with Fluellen about the leek matter (lines 85–98)?",
      options: [
        "It's a lunch break",
        "It publicly affirms Henry's Welshness (he was born at Monmouth) and binds him to the Welsh soldiery whose longbow archers won the battle — a rhetorical moment of unity after naming the victory 'Agincourt'",
        "It prepares the wooing scene",
        "It introduces Macmorris"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 85, anchor_line_end: 98
    },
  ];

  ANNOTATIONS.henry_v_act4_scene8 = [
    {
      line_start: 1, line_end: 50,
      citation_display: cite("4.8", 1, 50),
      category: "structural",
      title: "The glove-plot pays off — Henry gives Williams crowns",
      body: "The glove-exchange set up in 4.1 pays off here. Williams has punched Fluellen (believing the glove in Fluellen's cap belongs to the arrogant soldier who insulted the king); Henry reveals that he was that soldier. Williams's defense is disarmingly direct: 'Your majesty came not like yourself … had you been as I took you for, I made no offence.' Henry's response is generous: he fills Williams's glove with crowns. What makes the sequence work is Williams's refusal to apologize: the king in disguise invited the insult, and the responsibility is not on the soldier. Shakespeare does not flinch from having Williams win the argument. Henry rewards him with money, not with a title; Williams will go home as a commoner, which is the appropriate register. The king-in-disguise trope is a favorite of Elizabethan drama (it recurs in As You Like It and Measure for Measure); Shakespeare's version here is unusual in that the commoner gets to keep his moral advantage.",
      sources: ["Anne Barton, 'The King Disguised,' in The Triple Bond (1975)", "Kenneth Muir, The Sources of Shakespeare's Plays (1977)"]
    },
    {
      line_start: 58, line_end: 100,
      citation_display: cite("4.8", 58, 100),
      category: "historical",
      title: "The catalogue of the dead — historical politics of a casualty report",
      body: "Henry's long recitation of the French noble dead is a set-piece of propagandist accounting. The numbers are unreliable: 10,000 French dead, 126 princes and banner-bearing nobles, 8,400 knights and gentlemen, 500 freshly-knighted — and only 25 common English dead plus four named nobles (York, Suffolk, Kettle, Davy Gam). Historical estimates of Agincourt casualties vary considerably, but modern historians generally put French losses at roughly 6,000–10,000 (heavily weighted toward the nobility, who led the fatal cavalry charge into the mud) and English losses at probably several hundred rather than 25. Shakespeare follows his source (Holinshed) but the source itself inherits the aftermath-propaganda. What the catalogue accomplishes dramatically is different from its historical accuracy: it stages an astonishing inversion of normal war-casualties (nobles killed in massive numbers, commoners almost untouched) and it invites the audience to hear 'God fought for us' as both historically adequate (in the sense that such a disproportion is not ordinary) and theologically exorbitant (since attributing it wholly to God erases the strategic fact of the longbow). Henry's immediate decree banning boasting on pain of death — 'be it death proclaimed through our host / To boast of this or take that praise from God / Which is his only' — closes the catalogue by making providentialism state policy.",
      sources: ["Anne Curry, Agincourt: A New History (2005)", "Juliet Barker, Agincourt: The King, the Campaign, the Battle (2005)", "Peter Saccio, Shakespeare's English Kings (2nd ed., 2000)"]
    },
  ];

  TRIALS.henry_v_act4_scene8 = [
    {
      kind: "structural",
      prompt: "How does the glove-plot resolve?",
      options: [
        "Williams is imprisoned for striking Fluellen",
        "Williams explains that the king's disguise invited the insult; Henry, persuaded, fills Williams's glove with crowns. Williams doesn't apologize; the king doesn't insist",
        "Fluellen is rewarded with a dukedom",
        "Both Williams and Fluellen are sent to Calais"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 37, anchor_line_end: 48
    },
    {
      kind: "comprehension",
      prompt: "According to Henry's list, how many common English soldiers died?",
      options: [
        "Five hundred",
        "Twenty-five — an astonishingly low number that has been disputed by modern historians, who estimate several hundred",
        "Ten thousand",
        "None"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 88, anchor_line_end: 91
    },
    {
      kind: "theme",
      prompt: "What does Henry do immediately after reciting the casualty catalogue?",
      options: [
        "Leads a prayer at the battlefield",
        "Issues a decree — on pain of death — forbidding any soldier to boast of Agincourt or take credit from God. Providentialism becomes state policy",
        "Orders the dead to be burned",
        "Writes a personal letter to Katherine"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 98, anchor_line_end: 101
    },
    {
      kind: "historical",
      prompt: "How should readers treat Henry's casualty numbers?",
      options: [
        "As modern archaeology",
        "As propaganda inherited from 15th-century sources (via Holinshed): the disproportion (French nobles killed in huge numbers, English commoners barely scratched) is extraordinary and real, but the specific numbers are likely inflated/deflated on both sides. Modern estimates differ substantially",
        "As literal transcripts of French rolls",
        "As inventions of Shakespeare with no historical basis"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 65, anchor_line_end: 91
    },
  ];
};
