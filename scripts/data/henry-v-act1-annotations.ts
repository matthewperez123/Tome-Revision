/**
 * Henry V — Act I annotations + Trials.
 * 1.1: Canterbury and Ely plot the Church's tactical support of Henry's
 *      war in exchange for deflecting the church-lands bill.
 * 1.2: The Salic Law exposition (satirical in staging, historically real
 *      in substance) and the tennis-balls insult.
 */
interface Annotation { line_start: number; line_end: number; citation_display: string; category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading"; title: string; body: string; sources: string[]; }
interface Trial { kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural"; prompt: string; options: [string,string,string,string]; answer_index: 0|1|2|3; wisdom_reward: number; anchor_line_start: number; anchor_line_end: number; }

module.exports = function (ANNOTATIONS: Record<string, Annotation[]>, TRIALS: Record<string, Trial[]>, cite: (label: string, ls: number, le: number) => string) {

  ANNOTATIONS.henry_v_act1_scene1 = [
    {
      line_start: 1, line_end: 19,
      citation_display: cite("1.1", 1, 19),
      category: "historical",
      title: "The bill that starts the war",
      body: "The scene opens on a parliamentary threat: a bill, first proposed in the reign of Henry IV and now revived, would strip the English Church of temporal lands worth more than half its possessions. Canterbury's calculation is precise — the confiscated revenues would maintain fifteen earls, fifteen hundred knights, six thousand two hundred esquires, a hundred almshouses, and would put £1,000 a year into the royal treasury. These figures are drawn from Raphael Holinshed's Chronicles (1587), Shakespeare's principal source. The historical bill, first raised in 1404 and revived in 1410 and 1414, was real, and so was the political logic: an ambitious Church-stripping measure was a durable threat to clerical wealth. Canterbury's counter-move — to engage the king's ambition so thoroughly in a French war that the bill cannot reach a vote — reads as realpolitik. Shakespeare shows the Church actively procuring the war. This is a materially more compromising portrait of the invasion's origins than anything Henry himself will admit in the scenes that follow.",
      sources: ["Raphael Holinshed, Chronicles of England, Scotland, and Ireland (1587)", "Gary Taylor (ed.), The Oxford Shakespeare: Henry V (1982), introduction"]
    },
    {
      line_start: 24, line_end: 45,
      citation_display: cite("1.1", 24, 45),
      category: "thematic",
      title: "The conversion narrative — Hal to Henry",
      body: "Canterbury's account of Henry's transformation — wildness that died with his father, Consideration whipping 'the offending Adam' out of him, the king now full of divinity, policy, and theology — compresses the arc of the Henry IV plays into forty lines. It is also strategically self-serving: Canterbury is flattering the king in advance of asking him to hear the Church's war-argument. Whether Henry's piety is real or performed is one of the play's open questions. The scene leaves it ambiguous on purpose: Canterbury's 'miracle' rhetoric sits beside Ely's more coolly political observation that they still need to act to prevent the bill. Audiences who have read the Henry IV plays know that Prince Hal's transformation at his coronation was public theatre; audiences who haven't hear Canterbury's speech as sincere wonder. Both readings remain available.",
      sources: ["Stephen Greenblatt, 'Invisible Bullets,' Shakespearean Negotiations (1988)", "Alexander Leggatt, Shakespeare's Political Drama (1988)"]
    },
    {
      line_start: 70, line_end: 102,
      citation_display: cite("1.1", 70, 102),
      category: "structural",
      title: "Canterbury's motive, made explicit",
      body: "The scene's most important structural feature is that Canterbury lays out his plan to divert the king before the king appears. By the time Henry enters in 1.2 and solicits Canterbury's legal judgement on the French claim, we already know the Archbishop has an institutional interest in encouraging the war. This changes what we hear in the next scene. When Canterbury speaks for forty lines about the Salic Law, we are not watching a disinterested legal consultation; we are watching a bought advocate. Shakespeare does not belabour the point, but he stages the causal sequence clearly: Church threat, political maneuver, war-justification. The play's later emphasis on Henry's providentialism and the God-fought nature of Agincourt must be read against this opening frame. The fact that the soldiers themselves debate the war's justice in 4.1 (Williams's challenge) is thus not a late innovation; the play has been keeping the question open from its first scene.",
      sources: ["A. R. Humphreys, The Arden Shakespeare: Henry V (1968)", "Andrew Gurr (ed.), King Henry V (New Cambridge Shakespeare, 1992)"]
    },
  ];

  TRIALS.henry_v_act1_scene1 = [
    {
      kind: "comprehension",
      prompt: "What is the bill that Canterbury fears (lines 1–19)?",
      options: [
        "A law that would ban English bishops from holding office",
        "A parliamentary bill that would strip the Church of temporal lands worth more than half its wealth",
        "A tax on monastic buildings only",
        "A requirement that the Church pay for royal wars"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 1, anchor_line_end: 19
    },
    {
      kind: "inference",
      prompt: "Why does Canterbury encourage Henry's war on France?",
      options: [
        "He believes Henry's claim is legally irrefutable, regardless of self-interest",
        "Because the war will absorb the king's attention and political capital, preventing the bill from passing — he has an institutional motive",
        "He personally hates the French King",
        "Because Joan of Arc is expected to lead a counter-invasion"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 70, anchor_line_end: 102
    },
    {
      kind: "theme",
      prompt: "Canterbury describes Henry's transformation from 'wildness' to kingly virtue. What dramatic history does this summary compress?",
      options: [
        "The events of Julius Caesar",
        "Prince Hal's development in Shakespeare's earlier Henry IV Parts 1 and 2",
        "Henry III's relationship with the Church",
        "The boyhood of Edward III"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 24, anchor_line_end: 45
    },
    {
      kind: "structural",
      prompt: "How does 1.1 frame what happens in 1.2?",
      options: [
        "It introduces Henry in person",
        "It establishes that Canterbury has a material interest in promoting the French war BEFORE he is asked to legally justify it — the audience hears the next scene's legal opinion as compromised",
        "It introduces the Dauphin",
        "It sets up a love plot that the rest of the play will develop"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 70, anchor_line_end: 102
    },
  ];

  ANNOTATIONS.henry_v_act1_scene2 = [
    {
      line_start: 34, line_end: 100,
      citation_display: cite("1.2", 34, 100),
      category: "historical",
      title: "The Salic Law speech — historical fact, satirical stagecraft",
      body: "Canterbury's sixty-line disquisition on the Salic Law is drawn directly, and in places verbatim, from Holinshed's Chronicles, which quotes the speech that Archbishop Chichele (the historical Canterbury) delivered to Parliament in 1414. Historically, the Salic Law — a 6th-century Frankish rule of inheritance — was invoked by 14th-century French jurists to bar inheritance of the French crown through the female line and thus to deny Edward III's claim. Canterbury's counter-argument is that the Salic Law applied only to the German Salian region, not to France, and that in any event the French themselves had repeatedly inherited through the female line. Whether he is right or tendentious is a genuine scholarly question; the historical arguments were and are real. But Shakespeare stages the exposition satirically. Canterbury speaks for sixty lines of tangled dynastic geography — Pharamond, Pepin, Hugh Capet, Lewis the Tenth, Louis the Ninth — and by line 88 Henry has to press him: 'May I with right and conscience make this claim?' The absurd scholarly cascade enacts the process by which a war of conquest is equipped with legal justification: laboriously, in learned Latin and medieval chronology, under pressure from a king who wants a yes.",
      sources: ["Raphael Holinshed, Chronicles (1587)", "Gary Taylor (ed.), The Oxford Shakespeare: Henry V (1982), introduction and 1.2 commentary", "Jonathan Bate, The Genius of Shakespeare (1997)"]
    },
    {
      line_start: 184, line_end: 220,
      citation_display: cite("1.2", 184, 220),
      category: "close_reading",
      title: "Exeter's honeybee speech — the commonwealth as hive",
      body: "Exeter's extended simile of the kingdom as a beehive — with its magistrates, merchants, sad-eyed executioners, and idle drones all ordered under the queen bee — is a set-piece of Elizabethan political theory in verse. The hive was a commonplace figure for the ordered commonwealth, drawn from Virgil's Georgics Book IV and transmitted through Renaissance emblem books and courtesy literature. Shakespeare's particular version works as an argument: a kingdom can sustain both domestic governance and foreign expedition simultaneously, because each order of subject has its own proper work. This answers Canterbury's earlier warning about the Scots invading if the army crosses to France. The simile matters because it is the play's fullest positive vision of political order — a kind of counter-argument to the mess and improvisation that every other scene shows. Shakespeare places it here, at the war's planning moment, as if to say: this is the ideal the expedition claims to embody. Whether the play endorses the ideal or merely displays it is, again, left open.",
      sources: ["Virgil, Georgics IV", "Frank Kermode, Shakespeare's Language (2000)", "Pauline Croft, King James (2003), on hive imagery in early modern political writing"]
    },
    {
      line_start: 245, line_end: 300,
      citation_display: cite("1.2", 245, 300),
      category: "historical",
      title: "The tennis-balls episode — a legendary insult",
      body: "The Dauphin's mocking gift of tennis balls, and Henry's elaborate in-kind reply, is one of the play's most famous set-pieces. It is also on historically shaky ground. The story appears in several 15th-century chronicles, including the First English Life of Henry V (c. 1513–14) and a ballad tradition that predates the chronicles themselves. But it is not in the most contemporary French sources. Most modern historians treat it as legend — a crystallizing narrative device for a diplomatic insult whose actual form, if any, is lost. What Shakespeare does with the episode is, however, historically precise in another way: he turns Henry's answer into a prophetic catalogue of French suffering ('mock mothers from their sons, / Mock castles down…'), and he locates the conversion of the insult into a war-justification at the crown-coronation moment of the play. 'His jest shall savour but of shallow wit, / When thousands weep more than did laugh at it' (lines 296–297): Henry transforms personal insult into collective retribution. Readers should notice how comfortably the rhetoric of wounded royal honour does this work — and how the Dauphin is made, in effect, to authorize the war.",
      sources: ["The First English Life of King Henry the Fifth, ed. C. L. Kingsford (1911)", "Anne Curry, Agincourt: A New History (2005)", "A. R. Humphreys, The Arden Shakespeare: Henry V (1968)"]
    },
    {
      line_start: 300, line_end: 312,
      citation_display: cite("1.2", 300, 312),
      category: "thematic",
      title: "'Well-hallow'd cause' — how a claim becomes a crusade",
      body: "Henry's closing line — 'But this lies all within the will of God, / To whom I do appeal' — places the war under divine sanction. This is the characteristic rhetorical move of Henry's speeches throughout the play, and by this point in the scene we have watched it be manufactured: Canterbury's compromised legal opinion, the Church's institutional interest, the sixty lines of Salic genealogy, the lords' eager endorsement, and finally the Dauphin's tennis-balls giving Henry the moral licence to call it an affront. What begins in 1.1 as a bill against Church lands ends in 1.2 as a 'well-hallow'd cause' with God on its side. The play does not tell us that this is cynical; it merely stages the process with unusual clarity. The same providentialism will return after Agincourt, when Henry forbids any soldier to claim credit for the victory on pain of death. Readers may notice that the same rhetorical apparatus that sanctifies conquest in 1.2 will sanctify victory in 4.8.",
      sources: ["Stephen Greenblatt, Shakespearean Negotiations (1988)", "Norman Rabkin, 'Either/Or,' in Shakespeare and the Problem of Meaning (1981)"]
    },
  ];

  TRIALS.henry_v_act1_scene2 = [
    {
      kind: "comprehension",
      prompt: "What is the 'Salic Law' that Canterbury explicates at length?",
      options: [
        "A Frankish legal tradition cited by 14th-century French jurists to bar royal inheritance through the female line — which Canterbury argues does not apply to France",
        "A tax on salt levied during Edward III's reign",
        "A treaty that ended the Hundred Years' War in 1453",
        "A ceremonial law requiring the king to be crowned at Rheims"
      ],
      answer_index: 0, wisdom_reward: 20,
      anchor_line_start: 34, anchor_line_end: 88
    },
    {
      kind: "inference",
      prompt: "Why does Shakespeare stage Canterbury's Salic Law speech at such exhausting length?",
      options: [
        "Because the Elizabethan audience wanted dynastic trivia",
        "Because Holinshed's Chronicles could not be abridged for legal reasons",
        "The tangled scholarly exposition dramatizes the process by which a war of conquest is laboriously equipped with legal justification — the legalism is itself the satire",
        "Because Canterbury is a bad speaker and Shakespeare wanted to show it"
      ],
      answer_index: 2, wisdom_reward: 30,
      anchor_line_start: 34, anchor_line_end: 100
    },
    {
      kind: "close_reading",
      prompt: "Exeter's 'honey-bees' speech (lines 184–220) uses the beehive as a metaphor for —",
      options: [
        "The Elizabethan court's intrigues",
        "The ordered commonwealth — a kingdom in which magistrates, merchants, and laborers each have their proper work, an image drawn from Virgil's Georgics",
        "The Roman Catholic Church",
        "The guild system of London"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 184, anchor_line_end: 220
    },
    {
      kind: "theme",
      prompt: "The Dauphin's gift of tennis balls is —",
      options: [
        "A well-documented historical event of 1414",
        "A legendary insult — attested in some 15th-century chronicles but not in the contemporary French sources; Shakespeare inherited it from tradition",
        "Shakespeare's own invention, without precedent",
        "An actual diplomatic document preserved in the British Library"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 258, anchor_line_end: 272
    },
    {
      kind: "close_reading",
      prompt: "What rhetorical transformation does Henry perform in his reply to the tennis balls (lines 272–300)?",
      options: [
        "He forgives the insult and offers the Dauphin peace",
        "He converts a personal jest into a prophecy of mass French suffering, using the Dauphin's mockery to license collective retribution",
        "He challenges the Dauphin to a game of tennis",
        "He ignores the insult and goes to bed"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 272, anchor_line_end: 300
    },
    {
      kind: "theme",
      prompt: "By the end of 1.2, how has the motive for war been framed?",
      options: [
        "As pure self-defense against an imminent French invasion",
        "As a 'well-hallow'd cause' under divine sanction — the scene has staged the process by which a dynastic claim, a compromised legal opinion, and a personal insult combine into a war blessed by God",
        "As a trade dispute over cloth exports",
        "As a response to the killing of an English ambassador"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 300, anchor_line_end: 312
    },
  ];
};
