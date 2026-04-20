/**
 * Henry V — Prologue (Act I Chorus) — annotations + Trials.
 * The Chorus's theatrical humility AND its invocation tradition.
 * Set up the patriotic/critical split here so it frames the play.
 */
interface Annotation { line_start: number; line_end: number; citation_display: string; category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading"; title: string; body: string; sources: string[]; }
interface Trial { kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural"; prompt: string; options: [string,string,string,string]; answer_index: 0|1|2|3; wisdom_reward: number; anchor_line_start: number; anchor_line_end: number; }

module.exports = function (ANNOTATIONS: Record<string, Annotation[]>, TRIALS: Record<string, Trial[]>, cite: (label: string, ls: number, le: number) => string) {

  ANNOTATIONS.henry_v_prologue = [
    {
      line_start: 1, line_end: 8,
      citation_display: cite("Prologue", 1, 8),
      category: "structural",
      title: "The Muse-of-fire invocation and the epic tradition it claims",
      body: "The opening eight lines place Henry V inside the classical epic tradition by imitating an epic invocation of the Muse — as Homer opens the Iliad, Virgil the Aeneid, Milton (later) Paradise Lost. By asking for 'a Muse of fire' (the noblest of the four elements), a kingdom-sized stage, and princes and monarchs as its actors, the Chorus stakes a claim: this is not a comedy or an ordinary history play but a poem of national destiny. Yet the invocation is immediately undercut, in lines 8–14, by the humility trope that follows. The pattern — soaring request, swift retraction — is the Chorus's governing rhythm throughout the play. It simultaneously asserts that Henry deserves epic treatment and apologizes for not being able to provide it. Readers should hear this as both reverence and knowing theatrical self-awareness: Shakespeare knows perfectly well his Globe can't stage Agincourt; the Chorus is the play's strategy for converting that limitation into a participatory virtue.",
      sources: ["Anne Barton, 'The King Disguised,' in The Triple Bond (1975)", "A. R. Humphreys, The Arden Shakespeare: Henry V (1968)"]
    },
    {
      line_start: 11, line_end: 14,
      citation_display: cite("Prologue", 11, 14),
      category: "historical",
      title: "The 'wooden O' and the Globe's constraints",
      body: "'This cockpit' and 'this wooden O' refer to the Globe Theatre, which opened in the summer of 1599 — the same season Henry V was first performed. The Chorus's apology is literal: the Globe was a wooden polygon roughly 30 metres across, open to the sky, able to hold perhaps 3,000 spectators but offering a thrust stage with almost no scenery. The play's siege at Harfleur, the night-before-battle panorama of the Act 4 Chorus, the Agincourt victory itself — none of it could be staged. Shakespeare's solution is to write an anti-spectacle: he defers the seen to the imagined and demands the audience supply the missing armies, ships, and cavalry from their own minds. The 'crooked figure' (line 15) — a zero — that can 'attest in little place a million' is a mathematical image for this theatrical trick: the actors are ciphers that the audience must multiply. It is a rhetoric of co-production that, by 1599, had no recent precedent on the English stage.",
      sources: ["Andrew Gurr, The Shakespearean Stage 1574–1642 (3rd ed., 1992)", "Stephen Greenblatt, Shakespeare's Freedom (2010)"]
    },
    {
      line_start: 15, line_end: 25,
      citation_display: cite("Prologue", 15, 25),
      category: "thematic",
      title: "Imagination as the play's working substance",
      body: "The heart of the Prologue is its contract with the audience. The Chorus does not promise to show Agincourt; it asks us to make it. 'Piece out our imperfections with your thoughts,' 'Into a thousand parts divide one man,' 'Think, when we talk of horses, that you see them / Printing their proud hoofs i' the receiving earth' — these are not decorations but working instructions. Shakespeare is asking the audience to perform a continuous act of imaginative generosity, and the whole play will depend on our willingness. This has political implications too: a play that recruits its audience into the making of national glory is a play whose ideological work is necessarily collaborative. If we stop supplying the Chorus's imagined horses, the English cause visibly shrinks to a few men in ragged costumes in a wooden ring. The play's critics (starting with the 20th-century productions that refused to collaborate) have shown how readily the epic frame can be withdrawn once one simply declines to imagine it.",
      sources: ["Norman Rabkin, 'Either/Or: Responding to Henry V,' Shakespeare and the Problem of Meaning (1981)", "Stephen Greenblatt, Shakespearean Negotiations (1988)"]
    },
    {
      line_start: 32, line_end: 34,
      citation_display: cite("Prologue", 32, 34),
      category: "thematic",
      title: "The Chorus's role — and the play's central interpretive problem",
      body: "'Admit me Chorus to this history' — the Chorus petitions the audience to be accepted as a narrative voice. This is the play's unique structural feature: of all Shakespeare's histories, only Henry V has a formal Chorus appearing six times (Prologue, before Acts II–V, and the Epilogue), relentlessly heroic and morally one-toned. Yet the action scenes the Chorus frames are frequently much darker than the Chorus prepares us for. The Prologue introduces Henry as 'warlike Harry, like himself' assuming 'the port of Mars'; the following scenes show Canterbury manipulating the king toward a war of dynastic ambition. The Chorus celebrates 'brothers, friends and countrymen' in the Act 4 Chorus; the Act 4 itself stages Williams's challenge to royal responsibility and the killing of prisoners. Norman Rabkin's 1981 essay 'Either/Or' argues this double vision is the play's point: the Chorus supplies the patriotic frame, the action supplies its critique, and Shakespeare refuses to adjudicate between them. Readers should hold both registers at once.",
      sources: ["Norman Rabkin, 'Either/Or: Responding to Henry V,' Shakespeare and the Problem of Meaning (1981)", "Lawrence Danson, Tragic Alphabet (1974)", "Gary Taylor (ed.), The Oxford Shakespeare: Henry V (1982)"]
    },
  ];

  TRIALS.henry_v_prologue = [
    {
      kind: "structural",
      prompt: "What is the Chorus's opening request, and why?",
      options: [
        "A kingdom-sized stage and a Muse of fire — because the subject is too great for an ordinary theatre",
        "A quiet setting — because the play is domestic",
        "An end to dramatic convention — because the story is too true to stage",
        "The closure of the theatres — because the play is a religious work"
      ],
      answer_index: 0, wisdom_reward: 15,
      anchor_line_start: 1, anchor_line_end: 8
    },
    {
      kind: "close_reading",
      prompt: "What does the Chorus mean by 'this wooden O'?",
      options: [
        "The round letter O as a symbol of nothingness",
        "A hollow crown",
        "The Globe Theatre — Shakespeare's round wooden playhouse",
        "A siege-engine used at Agincourt"
      ],
      answer_index: 2, wisdom_reward: 10,
      anchor_line_start: 13, anchor_line_end: 13
    },
    {
      kind: "theme",
      prompt: "What does the 'crooked figure' that 'may attest in little place a million' (lines 15–16) represent?",
      options: [
        "A dishonest accountant",
        "A zero — a small numeral that multiplies larger numbers; image for how the actors, as 'ciphers,' must be multiplied by the audience's imagination",
        "A bent sword unfit for battle",
        "A star-shape on a military banner"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 15, anchor_line_end: 17
    },
    {
      kind: "comprehension",
      prompt: "The Chorus asks the audience to do what specifically?",
      options: [
        "Remain silent throughout the performance",
        "Imagine the missing armies, fleets, and battlefield in their own minds ('piece out our imperfections with your thoughts')",
        "Applaud only at the end of each act",
        "Not bring weapons into the theatre"
      ],
      answer_index: 1, wisdom_reward: 15,
      anchor_line_start: 23, anchor_line_end: 27
    },
    {
      kind: "inference",
      prompt: "Why does Shakespeare have the Prologue apologize so insistently for the theatre's limitations?",
      options: [
        "He genuinely doubted the play would succeed",
        "It was legally required by Elizabethan censors",
        "The apologies recruit the audience into co-producing the play's epic scale — a rhetorical strategy, not mere humility",
        "He had been forced to cut most of the script before performance"
      ],
      answer_index: 2, wisdom_reward: 25,
      anchor_line_start: 15, anchor_line_end: 25
    },
    {
      kind: "theme",
      prompt: "Critics often note that the Chorus presents Henry heroically while the action scenes sometimes undercut that portrait. What is this structural feature called in Norman Rabkin's classic 1981 essay?",
      options: [
        "The tragic-comic blend",
        "The 'Either/Or' double vision — the play sustains both a patriotic and a critical reading at once",
        "The choral interlude tradition",
        "The deus-ex-machina effect"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 32, anchor_line_end: 34
    },
  ];
};
