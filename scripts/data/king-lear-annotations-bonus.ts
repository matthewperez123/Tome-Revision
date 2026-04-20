/**
 * King Lear — supplementary annotations + Trials that append to the base
 * per-act data. Loaded after the primary annotation modules so these
 * additions simply extend coverage without reshaping existing content.
 */

module.exports = function (A: any, T: any) {
  const pushA = (id: string, anns: any[]) => { A[id] = [...(A[id] ?? []), ...anns]; };
  const pushT = (id: string, trs: any[]) => { T[id] = [...(T[id] ?? []), ...trs]; };

  // ── 1.2 — Gloucester's credulity (bonus) ─────────────────────────────
  pushA("king_lear_act1_scene2", [
    {
      line_start: 90, line_end: 125,
      citation_display: "King Lear 1.2.90–125",
      category: "thematic",
      title: "Gloucester on the eclipses — astrological anxiety vs. Edmund's scorn",
      body: "Gloucester's catalogue of dangers following the recent eclipses ('unnaturalness between the child and the parent; death, dearth, dissolutions of ancient amities; divisions in state...') is a contemporary anxiety Shakespeare's first audience recognised — eclipses in October 1605 had set off a pamphlet industry of catastrophic predictions. Gloucester speaks in the voice of the credulous early-modern: Edmund rebuts him silently in the soliloquy that follows. The play does not choose between them. The catalogue turns out to be accurate — families do break, kingdoms do divide — but not because of the stars. Shakespeare lets Gloucester be right about effects and wrong about causes, which is the play's most efficient dramatic-ironic stance.",
      sources: ["Thomas Dekker, The Belman of London (1608)", "F. P. Wilson, Elizabethan and Jacobean (1945)"]
    }
  ]);
  pushT("king_lear_act1_scene2", [
    {
      kind: "historical",
      prompt: "Why would Gloucester's astrological speech have resonated with Shakespeare's first audience?",
      options: [
        "It didn't resonate — audiences ignored it",
        "Real eclipses in October 1605 had triggered a pamphlet industry of doom predictions; Gloucester's catalogue speaks in the contemporary credulous register",
        "It's a classical allusion",
        "It quotes Scripture"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 90, anchor_line_end: 125
    }
  ]);

  // ── 1.4 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act1_scene4", [
    {
      line_start: 220, line_end: 245,
      citation_display: "King Lear 1.4.220–245",
      category: "thematic",
      title: "Lear's curse on Goneril's womb — the play's moral threshold",
      body: "Lear's curse 'Into her womb convey sterility! / Dry up in her the organs of increase' takes imprecation to a place that Shakespeare elsewhere avoids. The father wishing his daughter infertile; the father wishing, if she bears a child, that the child 'live, and be a thwart disnatured torment to her.' Renaissance imprecation had a long tradition (Seneca, Latin tragic curses), but Shakespeare usually holds back from wishing specific bodily harm on daughters. Here he lets Lear go all the way. Some critics argue this speech forfeits Lear the audience's unqualified sympathy and is meant to; others that the theatrical force of grief requires the moral transgression. Either reading acknowledges the scene as a moral threshold — after this, audience sympathy for Lear is more costly.",
      sources: ["Janet Adelman, Suffocating Mothers (1992)", "Coppélia Kahn, Man's Estate (1981)"]
    }
  ]);
  pushT("king_lear_act1_scene4", [
    {
      kind: "inference",
      prompt: "What is dramatically risky about Lear's curse on Goneril's womb?",
      options: [
        "Nothing risky — it's conventional",
        "It crosses a moral threshold — wishing a daughter infertile, or her child to torment her — that some critics argue forfeits Lear's unqualified sympathy; audience feeling for him becomes costlier afterward",
        "It is comic relief",
        "It is spoken offstage"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 220, anchor_line_end: 245
    }
  ]);

  // ── 2.1 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act2_scene1", [
    {
      line_start: 75, line_end: 115,
      citation_display: "King Lear 2.1.75–115",
      category: "close_reading",
      title: "Edmund's fake wound — theater as evidence",
      body: "Edmund cuts his own arm to fabricate evidence that Edgar attacked him. The gesture anticipates Iago's way of manufacturing proofs from material fragments: a wound is more persuasive than a story. Gloucester accepts the evidence instantly and disinherits Edgar in a single line. The scene is Shakespeare's compressed lesson that physical signs can lie more fluently than language. It is also the Gloucester subplot's duplicate of Lear's 1.1 mistake: a parent mis-reading a staged performance as truth. Edmund, like the sisters, has learned that theater is more convincing than life.",
      sources: ["Jonathan Bate, Soul of the Age (2008)"]
    }
  ]);
  pushT("king_lear_act2_scene1", [
    {
      kind: "structural",
      prompt: "Edmund cutting his own arm to frame Edgar parallels what earlier moment?",
      options: [
        "It has no parallel",
        "Lear's 1.1 mis-reading of staged filial performance as truth — Gloucester too accepts a staged appearance as evidence; the two plots mirror in method",
        "The banishment of Kent",
        "The Fool's entry"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 75, anchor_line_end: 115
    }
  ]);

  // ── 2.3 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act2_scene3", [
    {
      line_start: 6, line_end: 21,
      citation_display: "King Lear 2.3.6–21",
      category: "structural",
      title: "Edgar's self-erasure — 'Edgar I nothing am'",
      body: "Edgar's twenty-one-line soliloquy is one of the play's quiet structural masterpieces. He disguises himself as 'Poor Turlygod, Poor Tom' and closes with 'Edgar I nothing am.' The phrase echoes the play's governing word ('nothing') and reassigns it to self-erasure rather than Cordelia's refusal or Lear's reduction. In 3.4 and 4.6 Edgar will do much of the play's work of moral witness while erased. Shakespeare's gamble is that the character who abolishes his identity is the one who can best observe — and who, at the end, may be the one to inherit the kingdom. Edgar's trajectory (disguise, witness, restorer) is the play's longest developmental arc, and it starts here.",
      sources: ["Jonathan Bate, Soul of the Age (2008)"]
    }
  ]);
  pushT("king_lear_act2_scene3", [
    {
      kind: "close_reading",
      prompt: "What is significant about Edgar's 'Edgar I nothing am'?",
      options: [
        "It is a grammatical error",
        "It echoes the play's governing word 'nothing' — now reassigned to self-erasure; Edgar becomes the most morally attentive witness precisely by abolishing his identity",
        "It is a curse",
        "It quotes Virgil"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 20, anchor_line_end: 21
    }
  ]);

  // ── 2.4 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act2_scene4", [
    {
      line_start: 52, line_end: 58,
      citation_display: "King Lear 2.4.52–58",
      category: "historical",
      title: "'Hysterica passio' — the mother rising in a male body",
      body: "Lear names his rising grief 'Hysterica passio' — 'the mother' — and tells it to 'climb no more.' This draws on Edward Jorden's 1603 'A Briefe Discourse of a Disease called the Suffocation of the Mother,' which had recently argued (controversially) that 'hysteria' (from Greek 'hystera,' womb) was a medical condition with natural causes. Jorden's book was partly a response to the witchcraft panics — it argued that symptoms blamed on demons were actually bodily. Lear applying a feminine-coded diagnosis to his own rising feeling is strange, a king appropriating a medical language usually reserved for women. The effect doubles the play's interest in gender-destabilized grief: Lear crying 'the mother' reaches, involuntarily, for an anatomy not his.",
      sources: ["Edward Jorden, A Briefe Discourse of a Disease called the Suffocation of the Mother (1603)", "Janet Adelman, Suffocating Mothers (1992)"]
    }
  ]);
  pushT("king_lear_act2_scene4", [
    {
      kind: "historical",
      prompt: "What is 'hysterica passio' (the mother) that Lear names rising in him?",
      options: [
        "A military term",
        "A medical diagnosis from Edward Jorden's 1603 treatise — typically associated with female bodies; Lear's appropriation of it is strange and gendered",
        "A scriptural phrase",
        "Court protocol"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 52, anchor_line_end: 58
    }
  ]);

  // ── 3.1 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act3_scene1", [
    {
      line_start: 4, line_end: 15,
      citation_display: "King Lear 3.1.4–15",
      category: "close_reading",
      title: "The Gentleman's report of Lear on the heath — ekphrasis of the storm",
      body: "The Gentleman's description of Lear in the storm — 'Contending with the fretful elements; / Bids the wind blow the earth into the sea' — is Shakespeare's preparation for what we are about to see directly. This is the classical technique of ekphrasis: a verbal painting that primes the spectator for the scene that follows. The Gentleman gives us the storm's geography ('this night, wherein the cub-drawn bear would couch'), the weather's refusal ('the lion, and the belly-pinched wolf, / Keep their fur dry'), and Lear's specific posture (tearing his hair, running bareheaded). When the storm scenes of 3.2 and 3.4 arrive, the audience already has the image; the poetry can now do intensification rather than description. Shakespeare uses ekphrasis deliberately before his greatest staged set-pieces.",
      sources: ["Russ McDonald, Shakespeare and the Arts of Language (2001)"]
    }
  ]);
  pushT("king_lear_act3_scene1", [
    {
      kind: "structural",
      prompt: "The Gentleman's description of Lear on the heath in 3.1 uses the classical technique of —",
      options: [
        "Ellipsis",
        "Ekphrasis — verbal painting that primes the audience for the storm scene to follow, so that the staged storm can intensify rather than describe",
        "Litotes",
        "Parataxis"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 4, anchor_line_end: 15
    }
  ]);

  // ── 3.3 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act3_scene3", [
    {
      line_start: 14, line_end: 22,
      citation_display: "King Lear 3.3.14–22",
      category: "thematic",
      title: "Gloucester's 'strange news' — pity in a time when pity is forbidden",
      body: "Gloucester tells Edmund he has had news of the impending French invasion and intends to aid Lear — despite Cornwall's prohibition. 'There is some strange thing toward, Edmund; pray you, be careful.' That Gloucester confides this to Edmund completes the parallel with Lear confiding in Goneril and Regan: each father hands his fatal intelligence to the child who will destroy him. But notice the play's specific moral move: Gloucester does this because he has chosen to risk himself for Lear. His first act of sustained moral courage is the act that dooms him. The play makes a dark claim here — in a sufficiently corrupt order, virtue is self-destructive. Gloucester will be blinded precisely because he tried to behave well.",
      sources: ["Terry Eagleton, William Shakespeare (1986)"]
    }
  ]);
  pushT("king_lear_act3_scene3", [
    {
      kind: "theme",
      prompt: "What claim does the play make through Gloucester's fate — blinded for trying to help Lear?",
      options: [
        "That Gloucester was imprudent",
        "A dark moral: in a sufficiently corrupt order, virtue is self-destructive; Gloucester's first act of sustained moral courage is what dooms him",
        "That Gloucester was secretly wicked",
        "That Cornwall was just"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 14, anchor_line_end: 22
    }
  ]);

  // ── 3.5 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act3_scene5", [
    {
      line_start: 1, line_end: 19,
      citation_display: "King Lear 3.5.1–19",
      category: "structural",
      title: "Nineteen lines that seal Gloucester's blinding",
      body: "This scene is nineteen lines long and contains the decisive act of denunciation. Edmund hands Cornwall the letter that Gloucester's 'intelligence' reveals; Cornwall promises Edmund the title Earl of Gloucester in return. The compression matters — the play's greatest atrocity (3.7) is set up in fewer than twenty lines of scene-time. Shakespeare is showing how fast betrayal can unfold when the conditions are right: a son ready to sell a father, a duke ready to pay the price, and a document as evidence. Nothing more is required.",
      sources: ["Jonathan Bate, Soul of the Age (2008)"]
    }
  ]);
  pushT("king_lear_act3_scene5", [
    {
      kind: "structural",
      prompt: "Why is 3.5 effective at nineteen lines?",
      options: [
        "It is incomplete",
        "Its compression shows how fast betrayal unfolds when conditions align — a son ready to sell his father, a duke ready to pay, a document as evidence; nothing else required",
        "Shakespeare ran out of time",
        "It was cut in Q1"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 19
    }
  ]);

  // ── 3.6 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act3_scene6", [
    {
      line_start: 80, line_end: 110,
      citation_display: "King Lear 3.6.80–110",
      category: "thematic",
      title: "The Fool's disappearance — an unresolved crux",
      body: "After 3.6 the Fool vanishes from the play. He has no death scene, no exit announcement, no reference by other characters. Scholars have offered several explanations: (1) the doubling theory — the same actor played Cordelia and the Fool in the original production, making the Fool's absence after 3.6 a theatrical necessity (Cordelia returns in 4.4); (2) the dying-offstage theory — Lear's later 'my poor fool is hanged' in 5.3 may refer equivocally to both Cordelia and the Fool; (3) the deliberate-silence theory — Shakespeare leaves the Fool's fate unexplained because the play is testing how much absence an audience can bear. The first theory is probably correct practically; the third is dramaturgically interesting. Either way, the Fool's disappearance is a reminder that the play's theater has working constraints (actor-count) that shaped its text.",
      sources: ["Richard Abrams, 'The Double Casting of Cordelia and the Fool,' Text and Performance Quarterly (1985)", "Stephen Booth, King Lear, Macbeth, Indefinition, and Tragedy (1983)"]
    }
  ]);
  pushT("king_lear_act3_scene6", [
    {
      kind: "structural",
      prompt: "What happens to the Fool after 3.6?",
      options: [
        "He dies onstage",
        "He vanishes without explanation — theories include actor-doubling with Cordelia, offstage death implied by Lear's 'my poor fool is hanged,' or deliberate authorial silence; the crux is unresolved",
        "He becomes king",
        "He leaves with Kent"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 80, anchor_line_end: 110
    }
  ]);

  // ── 4.1 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act4_scene1", [
    {
      line_start: 18, line_end: 30,
      citation_display: "King Lear 4.1.18–30",
      category: "close_reading",
      title: "'The worst is not / So long as we can say, This is the worst'",
      body: "Edgar's aside — 'O gods! Who is't can say I am at the worst? / I am worse than e'er I was.... / The worst is not / So long as we can say, this is the worst' — is the play's most painfully recursive thought. Language can always name a new bottom, which means the bottom has not been reached. This is the inverse of consolation: the very capacity to articulate one's condition proves it is not yet final. Edgar has just seen his blinded father led by an old man; he has nowhere lower left to go, except that by saying so he demonstrates he does. The paradox is a gloss on the play's entire progression — each time we think the worst has come, another worse arrives. Cordelia's death in 5.3 is what finally silences the capacity to articulate; there is no this is the worst after her body appears.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    }
  ]);
  pushT("king_lear_act4_scene1", [
    {
      kind: "close_reading",
      prompt: "What paradox does Edgar articulate in his 'the worst is not so long as we can say this is the worst' aside?",
      options: [
        "That the worst is always behind us",
        "Language's capacity to name a condition proves that condition is not final — the bottom has not been reached while we can still say so; the inverse of consolation",
        "That speech is worthless",
        "That only actions matter"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 27, anchor_line_end: 32
    }
  ]);

  // ── 4.2 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act4_scene2", [
    {
      line_start: 40, line_end: 72,
      citation_display: "King Lear 4.2.40–72",
      category: "close_reading",
      title: "Albany's 'monsters of the deep' — the play's cannibalism image",
      body: "Albany's 'Humanity must perforce prey on itself, / Like monsters of the deep' is the play's most compressed image of moral collapse. The earth's creatures consume each other by appetite; what distinguishes humanity is restraint. When Goneril and Regan act from pure will, without restraint, humanity stops being distinguishable from predation. The image has a Hobbesian premonition — Hobbes's 'bellum omnium contra omnes' is half a century away but the thought is legible here. Shakespeare is also gesturing at specific Jacobean anxieties: the post-Gunpowder-Plot fear of social dissolution. Albany speaks for the slow-developing conscience of the play, and his rhetoric here is the play's most explicit warning that moral order is frailer than anyone had assumed.",
      sources: ["Jonathan Dollimore, Radical Tragedy (1984)", "Kiernan Ryan, Shakespeare (1989)"]
    }
  ]);
  pushT("king_lear_act4_scene2", [
    {
      kind: "theme",
      prompt: "Albany's 'monsters of the deep' claim —",
      options: [
        "That the sea is dangerous",
        "That humanity is defined by restraint against appetite; when Goneril and Regan act from pure will, humanity ceases to be distinguishable from predation",
        "That fish are wicked",
        "That ocean travel should be avoided"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 40, anchor_line_end: 72
    }
  ]);

  // ── 4.3 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act4_scene3", [
    {
      line_start: 20, line_end: 40,
      citation_display: "King Lear 4.3.20–40",
      category: "close_reading",
      title: "'Sunshine and rain at once' — Cordelia's composed grief",
      body: "The Gentleman's description of Cordelia receiving news of her father — 'You have seen / Sunshine and rain at once; her smiles and tears / Were like, a better way' — is one of Shakespeare's most compressed emotional paintings. 'A better way' qualifies the cliché: her grief is more orderly than natural weather. 'Happy smilets... Those happy smilets, / That play'd on her ripe lip, seem'd not to know / What guests were in her eyes.' The face is doing two things at once, and Shakespeare's language tracks both. The passage is largely Q1-only and one of the reasons modern conflated editions feel emotionally completer than the Folio alone.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Frank Kermode, Shakespeare's Language (2000)"]
    }
  ]);

  // ── 4.7 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act4_scene7", [
    {
      line_start: 55, line_end: 75,
      citation_display: "King Lear 4.7.55–75",
      category: "close_reading",
      title: "'Pray, do not mock me' — the simplicity of restoration",
      body: "Lear waking to Cordelia says 'Pray, do not mock me: / I am a very foolish fond old man, / Fourscore and upward, not an hour more nor less; / And, to deal plainly, / I fear I am not in my perfect mind.' The speech is built from monosyllables and plain structure — no subordinate clauses, no Latinate vocabulary, no rhetorical figures. Shakespeare is matching syntax to self. The Lear of 1.1 spoke in elaborate subordinations; the Lear of 4.7 speaks in hesitation and plain fact. The humility is structural. Cordelia says 'No cause, no cause' — three syllables answering 'Have I caused you to suffer?' — and the exchange settles the play's quietest minute. Only the play's catastrophe in 5.3 can undo this tenderness. This is Shakespeare at his most economical.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)"]
    }
  ]);
  pushT("king_lear_act4_scene7", [
    {
      kind: "close_reading",
      prompt: "What does Shakespeare achieve in 4.7 by stripping Lear's speech to monosyllables and plain fact?",
      options: [
        "Simplicity for young readers",
        "Syntax matches self — the elaborate Lear of 1.1 contracts to plain hesitation; the humility is structural, not only emotional",
        "Imitation of Bible translation",
        "Accidental flatness"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 55, anchor_line_end: 75
    }
  ]);

  // ── 5.1 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act5_scene1", [
    {
      line_start: 1, line_end: 20,
      citation_display: "King Lear 5.1.1–20",
      category: "structural",
      title: "Edmund between sisters — Shakespeare's coldest triangle",
      body: "The first twenty lines of 5.1 stage an immense amount of dramatic information in a few gestures: Regan asks whether Edmund has slept with Goneril; Edmund denies it with a half-truth; Goneril arrives moments later with an aside ('I had rather lose the battle than that sister / Should loosen him and me'). The sexual triangle is fully alive. Edmund's coolness between them is the play's most economical study of how to manipulate two rivals simultaneously — tell each what she wants to hear, let them act on the assumption you prefer her, and watch them destroy each other. The scene also advances the military: the armies are about to engage. Shakespeare interleaves erotic plot and battlefield plot in a way that makes each feel consequent on the other.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)"]
    }
  ]);

  // ── 5.3 — bonus ──────────────────────────────────────────────────────
  pushA("king_lear_act5_scene3", [
    {
      line_start: 170, line_end: 220,
      citation_display: "King Lear 5.3.170–220",
      category: "structural",
      title: "The duel and Edgar's unmasking — the Gloucester plot's catharsis",
      body: "Edgar finally defeats Edmund in armored combat and unmasks. 'Let's exchange charity.' The moment formally resolves the Gloucester subplot: the legitimate son has survived, the bastard is dying, the father (who has died offstage with his 'heart burst smilingly') has been avenged. But the resolution is immediately dwarfed by what follows: Cordelia's death and Lear's collapse. Shakespeare is doing something specific in the scene's sequencing — the Gloucester plot gets a classical catharsis while the Lear plot refuses one. The subplot rewards its virtuous survivor; the main plot does not. That asymmetry is the play's final structural argument: there is no general rule that virtue is rewarded; the Gloucester plot was the luck of a single survivor, and the main plot shows what happens when luck runs out.",
      sources: ["Jonathan Bate, Soul of the Age (2008)", "Harold Bloom, Shakespeare: The Invention of the Human (1998)"]
    },
    {
      line_start: 287, line_end: 300,
      citation_display: "King Lear 5.3.287–300",
      category: "thematic",
      title: "Kent's refusal to live — the loyal servant asks leave",
      body: "As the survivors gather, Kent — who has served Lear in disguise for nearly the entire play — says 'I have a journey, sir, shortly to go; / My master calls me, I must not say no.' Kent is announcing his own impending death, following Lear. Albany's attempt to share the rule ('Friends of my soul, you twain / Rule in this realm, and the gor'd state sustain') is refused: Kent will not survive, Edgar will stand alone (or with Albany). The play will not permit its oldest loyal witness to live past his master. Kent's loyalty is absolute, and the play honors it by refusing him a later career. There is no restoration-narrative for those who loved Lear completely.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)"]
    }
  ]);
  pushT("king_lear_act5_scene3", [
    {
      kind: "structural",
      prompt: "How do the Gloucester and Lear plots resolve differently in 5.3?",
      options: [
        "Both resolve happily",
        "Gloucester plot receives classical catharsis (Edgar survives, Edmund dies, Gloucester's heart 'burst smilingly'); Lear plot refuses catharsis (Cordelia dies, Lear collapses) — the asymmetry argues that virtue is not generally rewarded",
        "Both plots fail",
        "The Gloucester plot is unresolved"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 170, anchor_line_end: 220
    },
    {
      kind: "close_reading",
      prompt: "What does Kent's 'I have a journey, sir, shortly to go' indicate?",
      options: [
        "He is traveling to France",
        "He is announcing his own impending death — he will follow his master Lear and not remain to rule; the loyal witness refuses a later career",
        "He is visiting Cordelia's grave",
        "He is returning to his own estates"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 287, anchor_line_end: 300
    }
  ]);
};
