/**
 * Henry V — Act II annotations + Trials.
 * 2 Chorus: youth of England aflame; the traitors flagged.
 * 2.1: Eastcheap tavern quarrel — Pistol/Nym/Bardolph.
 * 2.2: the Southampton trial of the traitors.
 * 2.3: Falstaff's death reported by Mistress Quickly.
 * 2.4: the French court receives Exeter.
 */
interface Annotation { line_start: number; line_end: number; citation_display: string; category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading"; title: string; body: string; sources: string[]; }
interface Trial { kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural"; prompt: string; options: [string,string,string,string]; answer_index: 0|1|2|3; wisdom_reward: number; anchor_line_start: number; anchor_line_end: number; }

module.exports = function (ANNOTATIONS: Record<string, Annotation[]>, TRIALS: Record<string, Trial[]>, cite: (label: string, ls: number, le: number) => string) {

  ANNOTATIONS.henry_v_act2_chorus = [
    {
      line_start: 1, line_end: 14,
      citation_display: cite("2 Chorus", 1, 14),
      category: "structural",
      title: "The economy of war — England retooling",
      body: "The Chorus's opening economic image — selling the pasture to buy the horse — is one of the play's most materially specific lines. It captures the Tudor understanding of an expeditionary war: livestock and arable land converted to cavalry; armourers prospering; silk and leisure ('silken dalliance') stored away; the young men mobilized. The Chorus frames this as moral elevation (honour 'reigns solely in the breast of every man'), but the economic mechanism remains visible. 'Now thrive the armourers' is not incidental — Shakespeare is telling us that war is industry. The speech's buoyant tone contrasts sharply with the tavern scene that follows (2.1), in which the war's actual recruits are low-life quarrellers preparing to go pillage for a living. The juxtaposition is deliberate. The Chorus speaks for official England; the play gives us the other England in counterpoint.",
      sources: ["Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)", "Thomas Healy, Shakespeare, Alienation and the Early Modern Stage (1994)"]
    },
    {
      line_start: 20, line_end: 30,
      citation_display: cite("2 Chorus", 20, 30),
      category: "historical",
      title: "The three traitors of Southampton",
      body: "The Chorus names the Southampton plotters — Richard Earl of Cambridge, Henry Lord Scroop of Masham, and Sir Thomas Grey of Northumberland — and attributes their treason simply to French gold. Historically, the situation was more complicated. Cambridge's real motive was dynastic: he was married to the Mortimer line, whose claim to the English throne was arguably stronger than the Lancastrian Henry's. His plot aimed to put his brother-in-law, Edmund Mortimer, Earl of March, on the throne. The play suppresses this because it would introduce the Lancastrian usurpation problem that Henry V itself wants to keep offstage. By reducing the motive to 'the gilt of France,' the Chorus and the later scene collapse a dynastic conspiracy into a simple bribery narrative. This is a characteristic move: the play manages the awkward question of Henry's legitimacy throughout, and the Chorus's simplification is one of its key instruments.",
      sources: ["Gary Taylor (ed.), The Oxford Shakespeare: Henry V (1982)", "Anne Curry, Agincourt: A New History (2005)"]
    },
  ];

  TRIALS.henry_v_act2_chorus = [
    {
      kind: "close_reading",
      prompt: "What does 'They sell the pasture now to buy the horse' (line 5) describe?",
      options: [
        "A farmer's bad bargain",
        "The economic mobilization of the English countryside for war — selling livestock-land to equip cavalry",
        "The purchase of racehorses for Agincourt",
        "A French trade embargo on English wool"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 5, anchor_line_end: 5
    },
    {
      kind: "inference",
      prompt: "The Chorus attributes the traitors' treason to 'the gilt of France.' What does the play omit?",
      options: [
        "Nothing — the account is historically complete",
        "That Cambridge's actual motive was dynastic: his Mortimer marriage gave his brother-in-law a rival claim to Henry's throne. The play simplifies the plot into bribery",
        "That one of the traitors was secretly Welsh",
        "That the plot also involved the Dauphin personally"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 22, anchor_line_end: 30
    },
    {
      kind: "theme",
      prompt: "Why does the Chorus's 'silken dalliance in the wardrobe lies' image matter?",
      options: [
        "It is purely decorative",
        "It registers the cultural cost of mobilization — ease, pleasure, and courtly idleness are stored away while the war industry thrives",
        "It refers to a ceremonial robe worn at Henry's coronation",
        "It is an anti-Catholic jibe"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 2, anchor_line_end: 4
    },
  ];

  ANNOTATIONS.henry_v_act2_scene1 = [
    {
      line_start: 1, line_end: 50,
      citation_display: cite("2.1", 1, 50),
      category: "thematic",
      title: "The other England — Eastcheap after Falstaff",
      body: "The Eastcheap scene that opens Act II introduces the remnants of Falstaff's old company — Bardolph, Nym, Pistol — and installs them as the play's recurring comic counterpoint to the official war. Their world is petty theft, doubtful marriages, and sword-quarrels about eight-shilling debts. Shakespeare is doing something structurally specific here: he is showing us who Henry's war actually sweeps up. The Chorus has just named England's 'youth on fire' and 'the mirror of all Christian kings'; the scene immediately undercuts the image by staging Nym's plodding cowardice and Pistol's inflated bombast as the mobilization's reality on the ground. The contrast is not sentimental — Shakespeare is not asking us to love Pistol — but it is structural: the play's official voice and its low-comic undervoice alternate throughout, and this is the first such alternation.",
      sources: ["C. L. Barber, Shakespeare's Festive Comedy (1959)", "Robert Weimann, Shakespeare and the Popular Tradition in the Theater (1978)"]
    },
    {
      line_start: 60, line_end: 100,
      citation_display: cite("2.1", 60, 100),
      category: "linguistic",
      title: "Pistol's diction — mock-heroic as a character",
      body: "Pistol is Shakespeare's most fully realized parody of a certain kind of Elizabethan actor — the roaring, classically-allusive, stage-villain whose speech is studded with half-digested Latin, misquoted classical mythology, and oaths designed to sound imposing. His vocabulary is a running pastiche: 'Couple a gorge' (bungled French), 'quondam Quickly' (Latinate pretension), 'pauca' (schoolboy Latin), 'Cressid's kind' (misused Troy-matter). His rhythmic, near-blank-verse inflections parody the high style of earlier Elizabethan drama (especially Marlowe). The comedy depends on our hearing the rhetorical mode Pistol is imitating. Importantly, Pistol's inflation is not just funny: it is a window into what soldier-theatre could sound like in 1599, and the play will later (5.1) strip away the inflated pose entirely, showing us the ordinary scrounger underneath.",
      sources: ["M. M. Mahood, Shakespeare's Wordplay (1957)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
  ];

  TRIALS.henry_v_act2_scene1 = [
    {
      kind: "structural",
      prompt: "What is the structural function of the Eastcheap scene in Act II?",
      options: [
        "To introduce new characters for the wooing subplot",
        "To provide comic relief with no thematic content",
        "To show the actual human material of Henry's 'youth of England on fire' — low-comic scroungers preparing for pillage — as a counterpoint to the Chorus's official rhetoric",
        "To explain the Salic Law to the audience"
      ],
      answer_index: 2, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 30
    },
    {
      kind: "close_reading",
      prompt: "What does Pistol's speech-register imitate?",
      options: [
        "Courtly French love-sonnets",
        "Biblical Psalter translations",
        "The mock-heroic, classically-allusive style of earlier Elizabethan stage-villains (especially the Marlovian bombastic tradition), full of misused Latin and over-inflated oaths",
        "The Welsh dialect of Fluellen"
      ],
      answer_index: 2, wisdom_reward: 25,
      anchor_line_start: 37, anchor_line_end: 70
    },
    {
      kind: "comprehension",
      prompt: "What is the actual quarrel between Pistol and Nym?",
      options: [
        "A matter of military honour",
        "A religious dispute",
        "An eight-shilling gambling debt — and Pistol's having married Nym's betrothed Nell Quickly",
        "A disputed command at Harfleur"
      ],
      answer_index: 2, wisdom_reward: 20,
      anchor_line_start: 16, anchor_line_end: 80
    },
  ];

  ANNOTATIONS.henry_v_act2_scene2 = [
    {
      line_start: 39, line_end: 85,
      citation_display: cite("2.2", 39, 85),
      category: "close_reading",
      title: "The trap sprung — Henry's performance of mercy",
      body: "Henry stages the traitors' entrapment with theatrical care. He first proposes releasing a drunken man who railed against him; the three traitors pile on insisting the king be harsher; Henry gently overrules them and grants mercy. Only then does he hand them the papers that, as they read them, reveal their own treason. The trap's elegance is the point: the traitors have just demanded strict punishment, and Henry will now apply to them the logic they themselves urged. 'The mercy that was quick in us but late, / By your own counsel is suppress'd and kill'd' (lines 77–78). This is the kind of monarch Henry has become: one who makes his enemies condemn themselves with their own argument. Readers may recall Prince Hal in Henry IV Part 2, who famously banishes Falstaff at his coronation with calculated public timing. The political method is the same. What looks like improvised royal authority is in fact carefully rehearsed dramaturgy.",
      sources: ["Alexander Leggatt, Shakespeare's Political Drama (1988)", "Stephen Greenblatt, Shakespearean Negotiations (1988)"]
    },
    {
      line_start: 92, line_end: 140,
      citation_display: cite("2.2", 92, 140),
      category: "thematic",
      title: "Scroop and the Second Fall",
      body: "Henry's long reproach to Scroop in particular — 'Thou that didst bear the key of all my counsels' — is the most emotionally charged thing Henry says in the play up to this point. Scroop was his intimate, his 'bedfellow' in the period's sense of confidant. His betrayal is framed as 'another fall of man,' a second Eden. The theological vocabulary is deliberate: Henry's scandal is not merely political but cosmological. A trusted companion who was 'spare in diet, / Free from gross passion,' 'garnish'd and deck'd in modest complement' — exactly the virtues Canterbury earlier attributed to Henry himself in 1.1 — has proven hollow. The passage resonates with the Henry IV plays' preoccupation with false appearances and feigned loyalty. It is also the moment the play comes closest to expressing genuine anguish from Henry; he announces it himself ('I will weep for thee'). The anguish is rhetorical as well as felt; it is the only proper setting in which to pronounce a capital sentence against a man who once ate at your table.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Graham Holderness, Shakespeare: The Histories (2000)"]
    },
  ];

  TRIALS.henry_v_act2_scene2 = [
    {
      kind: "inference",
      prompt: "Why does Henry first raise (and then grant) mercy for the drunkard before exposing the traitors?",
      options: [
        "Because he has forgotten about the traitors",
        "To make the traitors commit themselves to strict punishment — using their own advocacy for severity against them when their treason is revealed",
        "Because Exeter pressured him",
        "Because the drunk was an old friend"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 40, anchor_line_end: 82
    },
    {
      kind: "close_reading",
      prompt: "Henry's reproach to Scroop frames the betrayal as 'another fall of man.' Why this theological framing?",
      options: [
        "Because Scroop is a priest",
        "Because Shakespeare needs to fill time",
        "Because the betrayal of trusted intimacy is figured as a second Eden — a cosmic scandal, not just a political one. It also echoes the Henry IV plays' preoccupation with false appearances",
        "Because the Salic Law speech required biblical balance"
      ],
      answer_index: 2, wisdom_reward: 30,
      anchor_line_start: 139, anchor_line_end: 145
    },
    {
      kind: "comprehension",
      prompt: "What does the scene end with?",
      options: [
        "Henry sparing the traitors at the last moment",
        "A verdict of death for all three traitors, and Henry's immediate sailing to France ('No king of England, if not king of France')",
        "A council deciding to delay the French invasion",
        "The queen's arrival from Cyprus"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 161, anchor_line_end: 188
    },
  ];

  ANNOTATIONS.henry_v_act2_scene3 = [
    {
      line_start: 1, line_end: 35,
      citation_display: cite("2.3", 1, 35),
      category: "biographical",
      title: "Falstaff's death — narrative necessity",
      body: "The death of Falstaff, reported with unguarded tenderness by the Hostess, is one of the most-loved passages in Shakespeare and one of the most necessary. Sir John Falstaff had been the comic center of Henry IV Parts 1 and 2 — the fat knight whose drunken wit made Prince Hal's youth recognizably human. At the end of Part 2, Henry (now crowned) publicly rejected him. Part of that play's bargain with the audience was the Epilogue's promise that Falstaff would return in Henry V. Shakespeare went back on that promise: Falstaff does not appear. The reasons are speculative — possibly a dispute with the actor Will Kemp, possibly a recognition that Falstaff's comic register is incompatible with the martial tone of Henry V. Whatever the cause, Shakespeare had to remove the character, and he does it with exquisite misdirection: the Hostess's mangled syntax, the famous 'babbled of green fields,' the detail of Falstaff fumbling with the sheets at the turning of the tide. Falstaff dies in the play's wings; the audience inherits the grief without ever seeing the body.",
      sources: ["J. Dover Wilson, The Fortunes of Falstaff (1943)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)", "René Weis, Shakespeare Unbound (2007)"]
    },
    {
      line_start: 9, line_end: 15,
      citation_display: cite("2.3", 9, 15),
      category: "textual",
      title: "'A' babbled of green fields' — Theobald's textual miracle",
      body: "The phrase 'a' babbled of green fields,' one of the most resonant lines in Shakespeare, does not appear in any original text. The First Folio (1623) reads 'a Table of greene fields,' which is nonsense. The eighteenth-century editor Lewis Theobald conjectured in 1733 that a compositor had misread Shakespeare's 'a bablde' (abbreviated for 'a babbled') as 'a Table.' Theobald's emendation is so accepted that modern editions simply print it; few lines of Shakespeare are so universally cited and so purely editorial. The reading gives us a dying Falstaff in delirious peace, remembering pastoral — an image that retroactively humanizes the whole Eastcheap world. It is worth noting that this is what textual editing, at its best, can do: it can recover a line that makes a whole scene sing.",
      sources: ["Lewis Theobald, Shakespeare Restored (1726)", "Stanley Wells & Gary Taylor, William Shakespeare: A Textual Companion (1987)"]
    },
  ];

  TRIALS.henry_v_act2_scene3 = [
    {
      kind: "theme",
      prompt: "Why does Falstaff not appear in Henry V, given he was the star of Henry IV Parts 1 and 2?",
      options: [
        "Shakespeare wrote him into the play but censors cut it",
        "Because the martial register of Henry V has no place for his comic-unruly world — and his rejection at the end of Henry IV Part 2 had already severed him from the now-king. His death is reported, not staged",
        "Because the actor who played Falstaff had died",
        "Because the Queen disliked the character"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 1, anchor_line_end: 35
    },
    {
      kind: "close_reading",
      prompt: "What is the textual status of 'a' babbled of green fields' (line 14)?",
      options: [
        "It appears in all original editions",
        "The Folio (1623) has nonsense ('a Table of greene fields'); the famous line is an 18th-century editorial conjecture by Lewis Theobald that has become universally accepted",
        "It is only in the First Quarto and cut from the Folio",
        "It was added by Samuel Johnson in 1765"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 14, anchor_line_end: 14
    },
    {
      kind: "comprehension",
      prompt: "The Hostess's speech about Falstaff's death is full of malapropisms. 'Arthur's bosom' is her version of what?",
      options: [
        "'Arthur's cave'",
        "'Abraham's bosom' — the biblical resting-place of the righteous after death (Luke 16:22)",
        "'Arthur's table'",
        "'Aaron's bosom'"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 7, anchor_line_end: 8
    },
  ];

  ANNOTATIONS.henry_v_act2_scene4 = [
    {
      line_start: 25, line_end: 48,
      citation_display: cite("2.4", 25, 48),
      category: "thematic",
      title: "The French divided — two views of Henry",
      body: "The French council scene stages a revealing internal disagreement. The Dauphin — 'idly king'd' Henry is a 'vain, giddy, shallow, humorous youth' — dismisses the English threat as a Whitsun morris-dance (folk-dance of village England). The Constable (a more serious figure) rebukes him: Henry's reputation for wildness is the 'outside of the Roman Brutus,' a discretion disguised as folly. The Constable's parallel is literary — he invokes Lucius Junius Brutus, the founder of the Roman Republic, who feigned stupidity to mask the wit that would later overthrow the Tarquins. The French court is divided not over strategy but over Henry's character, and the Dauphin is on the wrong side. This prepares us for the Dauphin's eventual humiliation and the Constable's death at Agincourt: the serious reader of Henry is right, and he dies for his accuracy; the reductive reader of Henry is wrong, and he is disgraced.",
      sources: ["Gary Taylor (ed.), The Oxford Shakespeare: Henry V (1982)", "Joel Altman, 'Vile Participation: The Amplification of Violence in the Theater of Henry V,' Shakespeare Quarterly 42 (1991)"]
    },
    {
      line_start: 78, line_end: 112,
      citation_display: cite("2.4", 78, 112),
      category: "structural",
      title: "Exeter's delivery — the formal demand",
      body: "Exeter's speech to the French king frames the English claim in the most aggressive possible diplomatic language: 'divest yourself … of the borrow'd glories … unto the crown of France.' The threat escalates from 'bloody constraint' (line 97) to biblical thunder ('in thunder and in earthquake, like a Jove') to a grotesque inventory of the war's human cost — widows, orphans, maidens' groans for husbands, fathers, and betrothed lovers. The rhetorical work Exeter performs here is to make Henry's claim both total and inevitable. The French king answers with courtly delay ('Tomorrow shall you bear our full intent back'); the Dauphin cannot help himself and provokes Exeter further, earning a sharper secondary threat. The scene closes with Exeter's warning that Henry 'is footed in this land already' — i.e. the invasion is not a threat but an accomplished fact. Diplomacy here is theatre, with the outcome already decided.",
      sources: ["Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)", "Robert Shaughnessy, Shakespeare in the 21st Century (2012), on diplomatic staging"]
    },
  ];

  TRIALS.henry_v_act2_scene4 = [
    {
      kind: "comprehension",
      prompt: "What literary parallel does the French Constable use for Henry (lines 36–38)?",
      options: [
        "Hannibal of Carthage",
        "Alexander of Macedon",
        "Lucius Junius Brutus — the Roman who feigned stupidity to mask the wit that would overthrow the Tarquin kings",
        "Coriolanus"
      ],
      answer_index: 2, wisdom_reward: 20,
      anchor_line_start: 36, anchor_line_end: 40
    },
    {
      kind: "theme",
      prompt: "The scene stages a disagreement between the Dauphin and the Constable. What does it tell us?",
      options: [
        "That the French court is internally divided on Henry's character, and the Dauphin's dismissive reading is the wrong one — which prefigures his humiliation and the Constable's (accurate-but-fatal) respect",
        "That the French are planning a peace treaty",
        "That they intend to bribe the English army",
        "That the Dauphin plans to flee France"
      ],
      answer_index: 0, wisdom_reward: 25,
      anchor_line_start: 25, anchor_line_end: 48
    },
    {
      kind: "close_reading",
      prompt: "What does Exeter mean by Henry being 'footed in this land already' (line 143)?",
      options: [
        "Henry is limping from an injury",
        "Henry has already landed in France — the 'diplomatic' demand is actually a formality delivered after the invasion",
        "Henry has arrived at the French court in disguise",
        "Henry has taken up residence in Paris"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 143, anchor_line_end: 143
    },
  ];
};
