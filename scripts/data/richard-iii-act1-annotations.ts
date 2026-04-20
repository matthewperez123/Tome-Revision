/**
 * Richard III — Act I annotations and Trials.
 * Three Tier-1 scenes: 1.1 (Richard's self-introduction), 1.2 (wooing of
 * Anne), 1.3 (Margaret's curses). 1.4 (Clarence's dream) is non-Tier-1
 * but carries significant thematic and theological weight.
 */

interface Annotation {
  line_start: number; line_end: number;
  citation_display: string;
  category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading";
  title: string; body: string; sources: string[];
}
interface Trial {
  kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural";
  prompt: string; options: [string,string,string,string];
  answer_index: 0|1|2|3;
  wisdom_reward: number;
  anchor_line_start: number; anchor_line_end: number;
}

module.exports = function (
  ANNOTATIONS: Record<string, Annotation[]>,
  TRIALS: Record<string, Trial[]>,
  cite: (label: string, ls: number, le: number) => string
) {

  // ── 1.1 — Richard's self-introduction [TIER-1] ────────────────────────
  ANNOTATIONS.richard_iii_act1_scene1 = [
    {
      line_start: 1, line_end: 13,
      citation_display: cite("1.1", 1, 13),
      category: "close_reading",
      title: "The opening that everyone misreads",
      body: "Four of the most quoted lines in English — and the most misread. \"Now is the winter of our discontent / Made glorious summer by this sun of York\" does not mean \"our troubles continue.\" It means the opposite: our winter has ENDED, turned to summer. The York dynasty has triumphed, the wars are done, and Richard is observing a world of peace. He cannot belong to it. His opening catalogue of disarmament — bruised arms hung up for monuments, stern alarums changed to merry meetings, grim-visaged war smoothing his wrinkled front — is not a lament for war but a register of his own obsolescence. When he turns at line 14 (\"But I, that am not shaped for sportive tricks\") the logic clicks: he will manufacture the conflict the world no longer provides. The speech is his explanation for everything that follows.",
      sources: ["Janet Adelman, Suffocating Mothers (1992)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
    {
      line_start: 14, line_end: 31,
      citation_display: cite("1.1", 14, 31),
      category: "thematic",
      title: "Shakespeare's first villain-protagonist and the audience pact",
      body: "Richard's direct address to us is Shakespeare's great theatrical innovation of the early 1590s. The Vice-figure of the old morality plays had winked at the audience; Richard extends the wink into a conspiracy. By the time he tells us \"I am determined to prove a villain,\" we have already agreed to watch. Each of his soliloquies and asides reaffirms the pact: he confides in us before betraying everyone onstage. The technique is the template for Iago, Edmund, and Macbeth's darker soliloquies — but Richard does it first, and most audaciously. We are not simply observing a villain; we are his accomplices. The play's moral force depends on this complicity: when the ghosts arrive in 5.3, they arrive for us too. Coleridge called the device \"a species of ventriloquism\" by which Shakespeare makes the audience imagine and desire what Richard will do.",
      sources: ["Samuel Taylor Coleridge, Lectures on Shakespeare (1811–13)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Robert Weimann, Shakespeare and the Popular Tradition in the Theater (1967)"]
    },
    {
      line_start: 14, line_end: 27,
      citation_display: cite("1.1", 14, 27),
      category: "historical",
      title: "The deformity and the Tudor portrait",
      body: "Richard's self-description — curtailed of fair proportion, cheated of feature by dissembling nature, halting, deformed — descends from a specific historical tradition. Thomas More's unfinished History of King Richard III (written c. 1513, published 1557) established the withered-hunchback portrait that Edward Hall (1548) and Raphael Holinshed (1577) then amplified, and which Shakespeare inherits directly. The historical Richard had severe scoliosis of the spine (confirmed in 2012 when his skeleton was rediscovered beneath a Leicester car park), but he was not the shriveled monster of the stage tradition: Tudor polemic shaped the portrait to legitimize the dynasty that had overthrown him. Virgil's job here is not to adjudicate. The dramatic Richard is inseparable from the propagandistic tradition that produced him, and Shakespeare is working with More's portrait, not the man. But readers should know that the portrait has a political origin, and that the twenty-first century has seen substantial historical revision.",
      sources: ["Thomas More, History of King Richard III (c. 1513)", "Charles Ross, Richard III (1981)", "David Baldwin, Richard III (2013)"]
    },
    {
      line_start: 32, line_end: 41,
      citation_display: cite("1.1", 32, 41),
      category: "structural",
      title: "The plot announced before it begins",
      body: "Shakespeare structures Richard III unlike any of his earlier histories: the villain lays out the plot mechanism in the first forty lines, then executes it in public view. \"Plots have I laid, inductions dangerous\" is not a boast but a prospectus. The prophecy concerning the letter G, which Richard says \"Of Edward's heirs the murderer shall be,\" is really about Gloucester himself, but he has engineered its use against Clarence (George). We are watching plotting-as-framing. This openness — the audience always knows more than the stage does — produces the play's signature tempo. Dramatic irony is not used occasionally here; it is the structural principle. Every scene until the coronation (4.2) operates under the rule that we see the instrument of Richard's next move before the characters do. The pleasure is watching them catch up, too late.",
      sources: ["Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "A. P. Rossiter, Angel with Horns (1961)"]
    },
    {
      line_start: 116, line_end: 124,
      citation_display: cite("1.1", 116, 124),
      category: "close_reading",
      title: "The quiet brutality of Clarence's farewell",
      body: "\"Go, tread the path that thou shalt ne'er return, / Simple, plain Clarence!\" Richard says as his brother exits toward the Tower. What makes the line chilling is its tone — not triumph, almost affection. \"I do love thee so, / That I will shortly send thy soul to heaven\" is the play's first fully formed example of Richard's signature: sentimentality as weapon. Murder clothed in the language of care. The pattern will recur with the princes (\"the sons of Edward sleep in Abraham's bosom\", 4.3) and in the wooing of Anne (\"He that bereft thee, lady, of thy husband, / Did it to help thee to a better husband\", 1.2). Each time, Richard uses the idiom of benevolence to describe destruction. This is not simply hypocrisy — it is a specific rhetorical strategy that would become Shakespeare's template for evil eloquence across the major tragedies.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Stephen Greenblatt, Shakespearean Negotiations (1988)"]
    },
    {
      line_start: 145, line_end: 160,
      citation_display: cite("1.1", 145, 160),
      category: "textual",
      title: "The Q1 and F1 texts of Richard III",
      body: "Richard III survives in two substantively different texts: the First Quarto (Q1, 1597) and the First Folio (F1, 1623). F1 is roughly two hundred lines longer, with the \"clock scene\" (4.2) extended and several passages elsewhere expanded — including small additions to this final soliloquy. Unlike King Lear's Q1/F1 situation, which most modern editions treat as two distinct works, Richard III's variants are conventionally regarded as stages of the same play, and editors usually conflate them following F1's fuller text. Standard Ebooks uses a conflated modern-editorial text. Most passages students encounter are common to both versions, but the editorial question of which \"Richard III\" a production stages is live. Virgil raises this here as a small flag: the text is historically unstable, and that instability is part of what makes Shakespearean editing a living scholarly discipline.",
      sources: ["John Jowett, The Oxford Shakespeare: Richard III (2000)", "Antony Hammond, Arden Shakespeare: Richard III (1981)"]
    }
  ];

  TRIALS.richard_iii_act1_scene1 = [
    {
      kind: "close_reading",
      prompt: "What does \"Now is the winter of our discontent / Made glorious summer by this sun of York\" actually mean?",
      options: [
        "Our troubles continue, and our house of York is suffering",
        "Our winter has ended and turned to summer; our troubles are over",
        "Edward IV (the sun of York) is the source of our discontent",
        "The seasons have unnaturally reversed, signaling doom for the realm"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 4
    },
    {
      kind: "inference",
      prompt: "Why does Richard say he is \"determined to prove a villain\"?",
      options: [
        "He has been slandered and wishes to live up to his bad reputation",
        "God has predestined him to villainy and he cannot escape it",
        "He cannot belong to the peaceful court world and will manufacture conflict for himself",
        "He wishes to avenge the wrongs done to the House of York"
      ],
      answer_index: 2,
      wisdom_reward: 20,
      anchor_line_start: 14, anchor_line_end: 31
    },
    {
      kind: "theme",
      prompt: "What is distinctive about Richard's direct address to the audience in this scene?",
      options: [
        "It follows the choral convention inherited from Greek tragedy",
        "It is a formal aside, isolated from the surrounding dialogue",
        "It makes the audience complicit in his schemes — we agree to watch him plot before he acts",
        "It is a conventional prologue, informing the audience of prior events"
      ],
      answer_index: 2,
      wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 41
    },
    {
      kind: "comprehension",
      prompt: "What is Richard's plan against his brother Clarence?",
      options: [
        "To have him exiled to Burgundy",
        "To turn King Edward against him using a prophecy about the letter G, leading to Clarence's imprisonment",
        "To challenge him openly to single combat",
        "To force him to renounce his dukedom in exchange for safety"
      ],
      answer_index: 1,
      wisdom_reward: 15,
      anchor_line_start: 32, anchor_line_end: 41
    },
    {
      kind: "close_reading",
      prompt: "When Richard says of Clarence \"I do love thee so, / That I will shortly send thy soul to heaven,\" what is the rhetorical effect?",
      options: [
        "Genuine brotherly affection mingled with regret",
        "Sentimentality repurposed as a weapon — the idiom of care describing murder",
        "A sarcastic refusal of the royal order to imprison Clarence",
        "Religious consolation offered to a condemned brother"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 116, anchor_line_end: 124
    },
    {
      kind: "inference",
      prompt: "Why does Richard want to marry \"Warwick's youngest daughter\" (Anne)?",
      options: [
        "He has loved her since childhood",
        "Warwick's daughter will bring a large dowry",
        "\"Not all so much for love\" but for \"another secret close intent\" — political, not romantic",
        "His brother King Edward has commanded it as a peace-making alliance"
      ],
      answer_index: 2,
      wisdom_reward: 20,
      anchor_line_start: 151, anchor_line_end: 157
    },
    {
      kind: "structural",
      prompt: "What is unusual about how Richard III opens, compared to most Shakespeare plays?",
      options: [
        "The play begins in the middle of an ongoing battle",
        "The villain-protagonist enters alone and lays out the entire plot mechanism in advance",
        "A chorus introduces the historical background before any character speaks",
        "The opening is a dumb-show (mimed action without dialogue)"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 1, anchor_line_end: 41
    },
    {
      kind: "historical",
      prompt: "The exaggerated deformity Richard ascribes to himself (\"curtail'd of fair proportion,\" \"deform'd, unfinish'd\") descends from which historical tradition?",
      options: [
        "Eyewitness accounts from Richard's contemporaries, largely accurate",
        "Tudor-era chronicles (More, Hall, Holinshed) that blackened Richard's image to legitimize the Tudor dynasty",
        "Roman-era sources Shakespeare accessed via Plutarch",
        "A Lancastrian propaganda tradition dating to the 1450s"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 14, anchor_line_end: 27
    }
  ];

  // ── 1.2 — The wooing of Anne [TIER-1] ─────────────────────────────────
  ANNOTATIONS.richard_iii_act1_scene2 = [
    {
      line_start: 1, line_end: 67,
      citation_display: cite("1.2", 1, 67),
      category: "structural",
      title: "The premise as bravura",
      body: "Harold Bloom called this \"the greatest scene in Shakespeare between two people,\" and the claim rests on a simple observation: the premise is impossible. Anne enters with the corpse of her father-in-law Henry VI, whom Richard helped kill; her husband Edward, whom Richard also killed, is freshly dead. Richard interrupts her procession, openly admits both murders, offers her his sword against his bare chest, and leaves the scene engaged to her. No naturalistic logic supports the scene; Shakespeare makes it work anyway, through sheer rhetorical velocity. The wooing compresses what in most seductions would take acts or lifetimes into one uninterrupted span of stichomythia (line-for-line exchange) and bravura self-offering. It is the play's first demonstration that Richard's power is linguistic before it is political. What can be said in English he can make happen.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Nicholas Brooke, Shakespeare's Early Tragedies (1968)"]
    },
    {
      line_start: 73, line_end: 129,
      citation_display: cite("1.2", 73, 129),
      category: "linguistic",
      title: "Stichomythia and the duel of wits",
      body: "The central exchange between Richard and Anne is a virtuoso deployment of stichomythia — the classical-dramatic convention of alternating single-line retorts, inherited from Seneca. Each speaker seizes the opponent's diction and inverts it: \"Vouchsafe, divine perfection of a woman\" becomes \"Vouchsafe, defused infection of a man\"; \"More wonderful, when angels are so angry\" answers \"O wonderful, when devils tell the truth.\" This is not decorative. In a play whose hero is defined by his mastery of language, stichomythia is the duel's genre, and the scene's dramatic stakes are whether Anne can sustain her rhetorical position. She loses by degrees — first when she accepts the term of the exchange, then when she repurposes her own curse (\"despair, and die\") against Richard without noticing how he has already begun to convert it. The scene charts defeat by rhetoric.",
      sources: ["Brian Vickers, The Artistry of Shakespeare's Prose (1968)", "Russ McDonald, Shakespeare's Late Style (2006)"]
    },
    {
      line_start: 176, line_end: 196,
      citation_display: cite("1.2", 176, 196),
      category: "thematic",
      title: "Anne's psychology, or: the seduction is not simple",
      body: "It is tempting to read Anne as simply outmanoeuvred, but her yielding is more complex than defeat. She is young, widowed, exhausted, surrounded by the murderers of her family; the Yorkists have won the war, and the England she knew as Prince Edward's wife no longer exists. Richard's offered sword at his bared chest is the scene's theatrical peak, but the more telling moment is the line she lets fall: \"Arise, dissembler: though I wish thy death, / I will not be the executioner.\" She names him accurately — dissembler — and withholds violence from him anyway. This is not straightforward seduction; it is the capitulation of a person who has run out of allies, register by register. Contemporary critics (Janet Adelman, Madonne Miner) have resisted the older reading of Anne as dupe or hysteric, arguing instead that her exhaustion is the point, and that Richard's triumph depends on a specific kind of despair that the wars have produced in the women who survived.",
      sources: ["Madonne M. Miner, \"'Neither mother, wife, nor England's queen'\" (1980)", "Janet Adelman, Suffocating Mothers (1992)", "Phyllis Rackin, Stages of History (1990)"]
    },
    {
      line_start: 224, line_end: 260,
      citation_display: cite("1.2", 224, 260),
      category: "close_reading",
      title: "\"Was ever woman in this humour woo'd?\" as theatrical punctuation",
      body: "After Anne exits, Richard holds the stage alone and delivers one of Shakespeare's most audacious soliloquies. \"Was ever woman in this humour woo'd? / Was ever woman in this humour won?\" The rhetorical questions function as theatrical punctuation — Richard makes the audience acknowledge what we have just witnessed. He then surveys the impossibility: I killed her husband, I killed his father, she saw me with their blood on me, and still she accepted my ring. The soliloquy is the scene's control panel; Richard explains to us how outrageous it has been, and thereby forecloses any naturalistic objection we might raise. He is also, crucially, beginning to mock his own power: the last lines (\"I'll be at charges for a looking-glass...\") shade into comic preening. Richard cannot sustain anyone's devotion, including his own. What he can do is speak anything into being — for as long as he keeps speaking.",
      sources: ["A. P. Rossiter, Angel with Horns (1961)", "Emrys Jones, Scenic Form in Shakespeare (1971)"]
    },
    {
      line_start: 155, line_end: 168,
      citation_display: cite("1.2", 155, 168),
      category: "historical",
      title: "The biographical scaffolding Richard invokes",
      body: "Richard's claim that Anne's father Warwick (\"thy warlike father\") once wept over the death of Richard's own father, the Duke of York — killed at Wakefield in 1460 by Margaret's forces — is not Shakespeare's invention. The detail comes from Holinshed and ultimately from More. Rutland, the young son York and Clarence's biological brother, was killed at Wakefield by Clifford; Richard here weaponizes the family's grief-record to claim emotional cover. The moment illuminates something important about the tetralogy: Richard III is the final play in Shakespeare's first historical sequence (1, 2, 3 Henry VI and Richard III), and many of its scenes assume the audience's memory of the prior plays. Shakespeare trusts his audience to recall who Rutland was, who Clifford was, and what Wakefield cost. Readers encountering Richard III on its own lose some of this density; editions often footnote the prior-play references for that reason.",
      sources: ["Raphael Holinshed, Chronicles (1587)", "E. M. W. Tillyard, Shakespeare's History Plays (1944)", "Paola Pugliatti, Shakespeare the Historian (1996)"]
    },
    {
      line_start: 203, line_end: 223,
      citation_display: cite("1.2", 203, 223),
      category: "textual",
      title: "The ring — prop and symbol",
      body: "Richard's gift of the ring — \"Vouchsafe to wear this ring\" — is one of the scene's two decisive physical gestures (the other is the sword-on-chest offer). Theatrically the ring does heavy work. It converts rhetorical promise into material token; it stands in for consent Anne has not quite spoken; and it will haunt Anne's later remorse (4.1) when she recalls this moment as a curse self-inflicted. Productions stage the ring variously: placed on Anne's finger against her will, taken from her listless hand, left by Richard at her feet. None of the choices are wrong, and all carry different readings of what yielding means here. The line \"To take is not to give\" is Anne's attempt to hold a boundary; the stage action that follows is where directors and actors decide what she has actually done.",
      sources: ["John Russell Brown, Shakespeare's Plays in Performance (1966)", "Alan C. Dessen and Leslie Thomson, A Dictionary of Stage Directions in English Drama 1580-1642 (1999)"]
    },
    {
      line_start: 251, line_end: 260,
      citation_display: cite("1.2", 251, 260),
      category: "thematic",
      title: "\"Myself to be a marvellous proper man\"",
      body: "The scene's closing joke — Richard decides the wooing's success must mean he is, after all, handsome — is where the play first hints at Richard's self-division. He has convinced Anne with a performance he does not himself believe; the joke depends on the audience's knowledge that the performance is artificial. But Richard partly believes it too, or wants to. The line \"I'll be at charges for a looking-glass / And entertain some score or two of tailors\" is comic preening that also reveals appetite. This is the fissure the ghosts will eventually widen in 5.3: Richard is a villain who still wants to be loved. The scene leaves him laughing at Anne's gullibility and at his own power, but the closing apostrophe — \"Shine out, fair sun, till I have bought a glass\" — addresses the sun he mocked in 1.1's opening line. He has begun to flatter his own creation.",
      sources: ["Harold Bloom, Shakespeare: The Invention of the Human (1998)", "Harry Berger Jr., Imaginary Audition (1989)"]
    }
  ];

  TRIALS.richard_iii_act1_scene2 = [
    {
      kind: "comprehension",
      prompt: "Whose corpse does Anne accompany at the scene's opening?",
      options: [
        "Her husband Edward, Prince of Wales",
        "Her father Warwick \"the Kingmaker\"",
        "Her father-in-law Henry VI, the former Lancastrian king",
        "Richard III's father, the Duke of York"
      ],
      answer_index: 2,
      wisdom_reward: 15,
      anchor_line_start: 1, anchor_line_end: 32
    },
    {
      kind: "close_reading",
      prompt: "What is stichomythia, the rhetorical device that structures Anne and Richard's central exchange?",
      options: [
        "Extended metaphor sustained across multiple speakers",
        "Alternating single-line retorts in which each speaker seizes and inverts the opponent's diction",
        "A formal debate with a moderator between disputants",
        "Rhyming couplets passed between two characters"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 73, anchor_line_end: 129
    },
    {
      kind: "theme",
      prompt: "Which reading of Anne's \"yielding\" best reflects twentieth- and twenty-first-century scholarship on the scene?",
      options: [
        "She is an unrealistic character whom Shakespeare could not render plausibly",
        "She is straightforwardly seduced by Richard's superior wit",
        "Her yielding is the capitulation of a widowed, surrounded, exhausted woman in a conquered political world — more complex than defeat",
        "She is engineered by Margaret's curse and has no agency in the scene"
      ],
      answer_index: 2,
      wisdom_reward: 25,
      anchor_line_start: 176, anchor_line_end: 196
    },
    {
      kind: "inference",
      prompt: "When Richard offers Anne his bare chest and his own sword, inviting her to kill him, what is the rhetorical logic?",
      options: [
        "Genuine self-sacrifice to atone for his crimes",
        "A piece of theatre that forces Anne to either strike (implausible) or release him (inevitable), converting her hatred into reluctant mercy",
        "A religious gesture invoking martyrdom as penance",
        "A legal offering: the sword represents the authority she would need to judge him"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 176, anchor_line_end: 185
    },
    {
      kind: "close_reading",
      prompt: "Richard's closing couplet — \"Was ever woman in this humour woo'd? / Was ever woman in this humour won?\" — functions how in the scene's structure?",
      options: [
        "As a genuine expression of self-doubt and bewilderment",
        "As theatrical punctuation: he makes the audience acknowledge the impossibility of what we have just witnessed",
        "As a conventional prayer of thanksgiving",
        "As a formal vow to remain faithful to Anne"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 224, anchor_line_end: 235
    },
    {
      kind: "structural",
      prompt: "In the soliloquy after Anne exits, Richard's final joke — that her acceptance must mean he is \"a marvellous proper man\" — suggests what about his psychology?",
      options: [
        "He has sincerely fallen in love with her",
        "The play will not treat him psychologically; he is a flat villain",
        "He is self-divided: a villain who has begun to flatter his own performance and wants, partly, to be loved",
        "He has realized Anne will be a political liability"
      ],
      answer_index: 2,
      wisdom_reward: 20,
      anchor_line_start: 249, anchor_line_end: 260
    },
    {
      kind: "historical",
      prompt: "Richard tells Anne that her father Warwick once wept over the death of Richard's own father, the Duke of York. This reference draws on what source material?",
      options: [
        "Shakespeare's invention for the scene",
        "Plutarch's Lives, via North's 1579 translation",
        "The earlier plays 1, 2, and 3 Henry VI (and their chronicle sources) — the audience is expected to remember Wakefield and Rutland",
        "A fictional backstory with no prior reference"
      ],
      answer_index: 2,
      wisdom_reward: 25,
      anchor_line_start: 155, anchor_line_end: 168
    },
    {
      kind: "theme",
      prompt: "What is the larger argument the scene makes about Richard's power?",
      options: [
        "His power is primarily military",
        "His power is primarily financial",
        "His power is linguistic before it is political — what he can say he can make happen",
        "His power depends on supernatural agency, not rhetoric"
      ],
      answer_index: 2,
      wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 260
    }
  ];

  // ── 1.3 — Margaret's curses [TIER-1] ──────────────────────────────────
  ANNOTATIONS.richard_iii_act1_scene3 = [
    {
      line_start: 108, line_end: 140,
      citation_display: cite("1.3", 108, 140),
      category: "historical",
      title: "Margaret of Anjou and a deliberate historical impossibility",
      body: "The historical Margaret of Anjou, widow of Henry VI, was banished from England in 1475 and died in France in August 1482 — nine months before Edward IV's death in April 1483, which is where Richard III's action begins. She cannot be present at Edward's court. Shakespeare knows this: his own 3 Henry VI had already dramatized her post-Tewkesbury exile. He keeps her alive onstage anyway, and the decision is dramaturgically load-bearing. Margaret is not there as a Tudor-history figure but as a Greek-chorus figure — a prophetic memory outside the action, scoring each death against the roster of earlier Lancastrian deaths the Yorkists caused. Her presence insists that the Wars of the Roses are a single moral ledger, and that the debts accumulated in the earlier plays have not been paid. The anachronism is the point: by keeping Margaret alive, Shakespeare keeps Henry VI's ghost politically alive too.",
      sources: ["Patricia-Ann Lee, \"Reflections of Power: Margaret of Anjou and the Dark Side of Queenship\" (1986)", "Phyllis Rackin, Stages of History (1990)", "Hall's Chronicle (1548)"]
    },
    {
      line_start: 154, line_end: 210,
      citation_display: cite("1.3", 154, 210),
      category: "structural",
      title: "The curse as structural engine",
      body: "Margaret's long curse sequence is not ornament. Every prediction in it is fulfilled by the play's end, and the method of each death is named in advance. Edward IV will \"by surfeit die\" (he does, offstage, between 1.3 and 2.1). His son the Prince of Wales, now a boy, \"die in his youth by like untimely violence\" (he is murdered in 4.3). Elizabeth will \"outlive thy glory, like my wretched self\" (she is reduced to negotiating with her children's killer in 4.4). Rivers, Grey, and Hastings each receive specific dooms and die at Pomfret (3.3) and the Tower (3.4). Buckingham — uncursed here, because he has not yet harmed Margaret — receives a delayed curse at the end of the scene (\"take heed of yonder dog!\") and dies at 5.1 quoting her words. The play works as a checklist: Margaret names the deaths, the plot delivers them.",
      sources: ["Wolfgang Clemen, A Commentary on Shakespeare's Richard III (1968)", "Nicholas Brooke, Shakespeare's Early Tragedies (1968)"]
    },
    {
      line_start: 218, line_end: 243,
      citation_display: cite("1.3", 218, 243),
      category: "linguistic",
      title: "The vocabulary of imprecation",
      body: "Margaret's curse on Richard (lines 218–243) is the densest single passage of imprecatory vocabulary in Shakespeare. \"Worm of conscience\" (Isaiah 66:24), \"elvish-mark'd\" (marked by fairies at birth, i.e., deformed as a supernatural sign), \"abortive, rooting hog\" (monstrous boar — Richard's heraldic badge weaponized), \"slave of nature\" (ruled by a corrupt Nature), \"bottled spider\" (swollen-bodied, hunchbacked), \"bunch-back'd toad\" — the insults cluster from Scripture, folk-demonology, heraldry, and creature-imagery in rapid succession. The vocabulary is not random. It draws on a tradition of cursing-speeches in medieval romance and early Tudor drama (the \"flyting\" tradition), and it is also what Elizabeth will explicitly ask Margaret to teach her in 4.4 (\"O thou well skill'd in curses, stay awhile, / And teach me how to curse mine enemies!\"). Cursing, in this play, is a craft.",
      sources: ["Eric Partridge, Shakespeare's Bawdy (1947)", "Ian Frederick Moulton, \"'A Monster Great Deformed'\" (1996)"]
    },
    {
      line_start: 285, line_end: 300,
      citation_display: cite("1.3", 285, 300),
      category: "close_reading",
      title: "\"Take heed of yonder dog!\" — Buckingham's uncursed, then cursed",
      body: "Margaret's curse ends without including Buckingham by name — he has not yet done her wrong. But in a coda (lines 277–291), she blesses him, kisses his hand, and warns him against Richard: \"Take heed of yonder dog! / Look, when he fawns, he bites.\" Buckingham, who cannot yet imagine needing the warning, dismisses it politely. In 5.1, minutes before his execution, he will quote it back: \"'When he,' quoth she, 'shall split thy heart with sorrow, / Remember Margaret was a prophetess.'\" The scene's structural symmetry is exact. Buckingham's blindness to warning is the play's moral arithmetic demonstrated in miniature: you cannot take Richard's hand and expect to keep your head. Margaret's foreknowledge is the only thing in the play that keeps pace with Richard's cunning; Buckingham's willingness to ignore her is his specific tragedy.",
      sources: ["Emrys Jones, Scenic Form in Shakespeare (1971)", "A. P. Rossiter, Angel with Horns (1961)"]
    },
    {
      line_start: 321, line_end: 335,
      citation_display: cite("1.3", 321, 335),
      category: "thematic",
      title: "\"Seem a saint, when most I play the devil\"",
      body: "Richard's soliloquy at the scene's end states the play's operative motto: \"Thus I clothe my naked villany / With old odd ends stolen out of holy writ; / And seem a saint, when most I play the devil.\" The rhetorical self-consciousness here is what distinguishes Richard from the medieval Vice-figures he descends from. The Vice was opaque to himself; Richard is his own critic. He knows the technique, names it, and mocks his own success at it. This is both the play's great dramatic achievement — Richard's interiority visible from the inside — and its eventual ethical problem. We see him see himself clearly and choose wrongly. When the ghosts come in 5.3, they come to a conscience that has never been fooled by the performance. The soliloquy's final line is, functionally, Richard's admission that he has known all along.",
      sources: ["Bernard Spivack, Shakespeare and the Allegory of Evil (1958)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 336, line_end: 350,
      citation_display: cite("1.3", 336, 350),
      category: "close_reading",
      title: "The murderers arrive, and conscience becomes comic",
      body: "The scene's hinge — Richard's soliloquy giving way to the entrance of the two First and Second Murderers — introduces the play's tonal counter-current. The killers' banter (\"eyes drop millstones, when fools' eyes drop tears\") and the Second Murderer's coming comic debate with his own conscience (1.4) belong to a different tonal register from the cursing of 1.3. Shakespeare is experimenting with the mixed mode that will become Hamlet's gravediggers, Macbeth's Porter, and Lear's Fool — high tragic matter surrounded by low-comic ministers. The murderers' casualness is not relief but contrast: they are hired, they have a warrant, they will not plead, and their conscience (when it speaks) is a household pest. Richard is more terrifying because his instruments are banal.",
      sources: ["Nicholas Brooke, Shakespeare's Early Tragedies (1968)", "Harry Levin, The Question of Hamlet (1959)"]
    }
  ];

  TRIALS.richard_iii_act1_scene3 = [
    {
      kind: "historical",
      prompt: "Margaret of Anjou's appearance at Edward IV's court is historically impossible. Why?",
      options: [
        "She was still imprisoned in the Tower at the time of the play's action",
        "She had returned to France after Tewkesbury and died in 1482, before the play's action begins",
        "She never left France after her marriage to Henry VI",
        "She had renounced royal life and entered a convent"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 108, anchor_line_end: 140
    },
    {
      kind: "structural",
      prompt: "What function does Margaret serve dramaturgically, given her historical impossibility?",
      options: [
        "She is a realist character whose anachronism is an oversight",
        "She functions as a Greek-chorus / prophetic-memory figure, keeping the earlier plays' moral ledger open",
        "She represents an alternate-historical counterfactual",
        "She is a comic character, providing relief from tragic events"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 108, anchor_line_end: 210
    },
    {
      kind: "comprehension",
      prompt: "What does Margaret curse Edward IV with, specifically?",
      options: [
        "Death in battle",
        "Death \"by surfeit\" — over-indulgence (which does kill him offstage)",
        "Poisoning by the Woodvilles",
        "A slow wasting disease lasting seven years"
      ],
      answer_index: 1,
      wisdom_reward: 15,
      anchor_line_start: 193, anchor_line_end: 194
    },
    {
      kind: "close_reading",
      prompt: "Margaret's epithets for Richard — \"elvish-mark'd, abortive, rooting hog,\" \"bottled spider,\" \"bunch-back'd toad\" — draw on which overlapping traditions?",
      options: [
        "Classical Greek tragedy and Roman satire only",
        "Scripture, folk-demonology, heraldry, and creature-imagery in rapid combination",
        "Medieval courtly love poetry",
        "Euphuism — the decorative style of John Lyly"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 218, anchor_line_end: 243
    },
    {
      kind: "inference",
      prompt: "Why does Margaret not curse Buckingham in her main curse, only warning him at the scene's end?",
      options: [
        "Because she secretly loves him",
        "Because he has not yet done her wrong; her curse-logic is strictly retributive",
        "Because he is too powerful to curse safely",
        "Because he was not present for her husband's murder"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 270, anchor_line_end: 291
    },
    {
      kind: "theme",
      prompt: "Which Richard line from this scene serves as the play's operating motto for his villainy?",
      options: [
        "\"A plague upon you all!\"",
        "\"I cannot tell: the world is grown so bad\"",
        "\"Seem a saint, when most I play the devil\"",
        "\"I am a pack-horse in his great affairs\""
      ],
      answer_index: 2,
      wisdom_reward: 20,
      anchor_line_start: 333, anchor_line_end: 335
    },
    {
      kind: "structural",
      prompt: "How does Richard distinguish himself from the medieval Vice-figures he descends from?",
      options: [
        "He never speaks in rhyme",
        "He refuses to address the audience",
        "He is his own critic — he names and mocks his own rhetorical technique",
        "He is a purely comic character, not tragic"
      ],
      answer_index: 2,
      wisdom_reward: 25,
      anchor_line_start: 321, anchor_line_end: 335
    },
    {
      kind: "inference",
      prompt: "What is the tonal effect of the Murderers' entrance at the scene's end?",
      options: [
        "It heightens the tragic intensity of the preceding curse",
        "It provides contrast: the banal, comic-domestic register of Richard's hired instruments counterpoints the cursing",
        "It breaks the fourth wall, turning the play into a comedy",
        "It signals the end of the scene with a formal flourish"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 336, anchor_line_end: 350
    }
  ];

  // ── 1.4 — Clarence's dream and murder ─────────────────────────────────
  ANNOTATIONS.richard_iii_act1_scene4 = [
    {
      line_start: 9, line_end: 63,
      citation_display: cite("1.4", 9, 63),
      category: "close_reading",
      title: "Clarence's dream-speech: the play's first great set-piece",
      body: "The dream is the play's first unambiguously great poetry — denser and more imagined than anything before it. Clarence walking the ship's deck with Richard, the stumble, the fall into the \"tumbling billows of the main,\" the sea-bottom vision of skulls and wedges of gold and unvalued jewels. The speech moves from physical drowning (panting bulk, envious flood) to spiritual descent (the melancholy flood, the grim ferryman which poets write of — Charon; the kingdom of perpetual night), and culminates in a vision of Furies that is also a confession. The dream works because Clarence knows in his sleep what he cannot quite admit waking: that he betrayed Warwick, stabbed young Prince Edward at Tewkesbury, and has \"done those things, / Which now bear evidence against my soul.\" Clarence is the first character in the play whose interiority Shakespeare renders as richly as Richard's, and the dream sets the template the ghosts in 5.3 will revisit.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Caroline Spurgeon, Shakespeare's Imagery (1935)"]
    },
    {
      line_start: 105, line_end: 138,
      citation_display: cite("1.4", 105, 138),
      category: "structural",
      title: "The Second Murderer's conscience: comic theology",
      body: "The extended exchange between the murderers — the Second Murderer's catalogue of conscience as a household pest (\"'tis a blushing shamefast spirit... it fills one full of obstacles\") — is one of Shakespeare's first sustained experiments with tonal counterpoint in a tragic scene. The theology is exact: conscience in this period is a live theological question, and the Second Murderer's treatment of it as an accidental tenant is a kind of comic inversion of Reformation controversy over the soul's relationship to its own judgements. But the speech also looks forward: the Second Murderer's final refusal (\"I repent me that the duke is slain\") is the only moment of unambiguous moral reversal in the play, and Shakespeare isolates it here in a low-comic register as if to protect it from the scene's more operatic registers. This is comic theology handled with care.",
      sources: ["William Perkins, A Discourse of Conscience (1596)", "Huston Diehl, Staging Reform, Reforming the Stage (1997)"]
    },
    {
      line_start: 155, line_end: 194,
      citation_display: cite("1.4", 155, 194),
      category: "thematic",
      title: "Clarence pleads, and the murderers answer",
      body: "Clarence's plea for his life develops the play's characteristic method: rhetorical duel, but now across a moral asymmetry. Clarence appeals to divine law (\"the great King of kings / Hath in the tables of his law commanded / That thou shalt do no murder\"); the First Murderer answers with Clarence's own perjury at Tewkesbury, citing scripture against scripture. This is not a contest of right and wrong but of textual authority. The scene anticipates Richard's own later use of scripture-scraps (\"old odd ends stolen out of holy writ,\" 1.3.334). Clarence is a less skilled practitioner of the same rhetorical art Richard masters; his defeat prefigures the larger dynamic by which Richard outmanoeuvres every moral opponent in the play until the ghosts arrive to speak in voices he cannot answer.",
      sources: ["Debora K. Shuger, The Renaissance Bible (1994)", "Hannibal Hamlin, The Bible in Shakespeare (2013)"]
    },
    {
      line_start: 244, line_end: 259,
      citation_display: cite("1.4", 244, 259),
      category: "historical",
      title: "The malmsey-butt and Clarence's historical end",
      body: "The play's specific detail — that Clarence will be drowned in a \"malmsey-butt,\" a cask of sweet Mediterranean wine — is not Shakespeare's invention. The rumour that George of Clarence was drowned in a butt of malmsey in February 1478 appears in the Croyland Chronicle (contemporary), in Mancini (an Italian observer in London in 1482–83), and was repeated by More and Hall. Whether it actually happened is genuinely uncertain. The method has sometimes been read as a joke (Clarence was reputedly a heavy drinker) or as a specifically humiliating mode of execution reserved for a royal prisoner. What Shakespeare inherits is the detail as established tradition, and the play uses it for both grim humour (the murderers' casual \"we will chop him in the malmsey-butt\") and Tyrrel-like brutality (the stage direction: \"stabs him... I'll drown you in the malmsey-butt within\"). The scene's refusal to sentimentalize the method is part of its force.",
      sources: ["Croyland Chronicle (c. 1486)", "Dominic Mancini, The Usurpation of Richard III (1483)", "Charles Ross, Richard III (1981)"]
    },
    {
      line_start: 247, line_end: 258,
      citation_display: cite("1.4", 247, 258),
      category: "close_reading",
      title: "\"How fain, like Pilate, would I wash my hands\"",
      body: "The Second Murderer's last line — his Pilate simile — is the scene's theological knife. Pilate washed his hands to disclaim responsibility for Christ's death (Matthew 27:24), but the washing did not absolve him; the gesture became, across Christian tradition, an emblem of false exculpation. The Second Murderer grasps this: he names his own gesture as Pilate's gesture and thereby refuses the easy comfort. That he cannot actually wash the blood off is the point; Shakespeare will reuse the figure, vastly amplified, in Lady Macbeth's sleepwalking (\"Out, damn'd spot!\" Macbeth 5.1). The Second Murderer is, briefly, the play's only moral witness — and he exits unnamed, to say nothing of his act. Shakespeare keeps moral recognition available even in the play's blackest corners, but only ever at the margins.",
      sources: ["Kenneth Muir, Shakespeare's Sources (1957)", "Richard Strier, The Unrepentant Renaissance (2011)"]
    }
  ];

  TRIALS.richard_iii_act1_scene4 = [
    {
      kind: "close_reading",
      prompt: "In Clarence's dream, who is the \"grim ferryman which poets write of\"?",
      options: [
        "An anonymous boatman",
        "Charon, ferryman of the classical underworld across the river Styx",
        "A historical figure from the Wars of the Roses",
        "An allegory of the Thames waterman"
      ],
      answer_index: 1,
      wisdom_reward: 15,
      anchor_line_start: 44, anchor_line_end: 47
    },
    {
      kind: "inference",
      prompt: "What does Clarence's dream reveal about his conscience?",
      options: [
        "That he has no memory of his past actions",
        "That he knows in sleep what he cannot admit waking: his betrayal of Warwick and his role in Prince Edward's death at Tewkesbury weigh on his soul",
        "That he fears Richard will betray him, and nothing else",
        "That he expects a restoration to royal favour"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 49, anchor_line_end: 63
    },
    {
      kind: "comprehension",
      prompt: "What does the Second Murderer compare conscience to in his extended speech?",
      options: [
        "A faithful servant who must always be heard",
        "A dangerous household pest that fills a man with obstacles — he cannot steal or swear or lie without it accusing him",
        "An angel standing at one's shoulder",
        "An empty word devised by priests"
      ],
      answer_index: 1,
      wisdom_reward: 15,
      anchor_line_start: 119, anchor_line_end: 128
    },
    {
      kind: "theme",
      prompt: "In the Clarence–Murderers debate, what is the rhetorical terrain?",
      options: [
        "A contest of physical strength",
        "A contest of textual authority: scripture quoted against scripture, divine law against royal command",
        "A straightforward appeal to kinship",
        "A legal disputation on royal prerogative"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 169, anchor_line_end: 184
    },
    {
      kind: "historical",
      prompt: "The specific detail that Clarence is drowned in a \"malmsey-butt\" originates where?",
      options: [
        "Shakespeare's invention, unsupported by any source",
        "The Croyland Chronicle, Mancini, and later More — a rumour current in Clarence's own lifetime, transmitted to Shakespeare via the chronicle tradition",
        "Plutarch, via Thomas North's translation",
        "The trial records of Clarence's impeachment, preserved in the Tower"
      ],
      answer_index: 1,
      wisdom_reward: 25,
      anchor_line_start: 244, anchor_line_end: 246
    },
    {
      kind: "close_reading",
      prompt: "When the Second Murderer says \"How fain, like Pilate, would I wash my hands,\" the Pilate reference does what?",
      options: [
        "Successfully absolves him of the murder",
        "Names his own gesture as a falsely absolving one — Pilate's hand-washing was itself an emblem of insufficient exculpation",
        "Alludes to his ceremonial role as a witness",
        "Claims the Roman legal tradition as grounds for his immunity"
      ],
      answer_index: 1,
      wisdom_reward: 20,
      anchor_line_start: 247, anchor_line_end: 249
    }
  ];

};
