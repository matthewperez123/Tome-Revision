/**
 * King Lear — Act II annotations + Trials.
 */

module.exports = function (A: any, T: any) {

  A.king_lear_act2_scene1 = [
    {
      line_start: 30, line_end: 90,
      citation_display: "King Lear 2.1.30–90",
      category: "structural",
      title: "Edmund's deception of Gloucester — the subplot mirrors the main plot",
      body: "Edmund's theatrical self-wounding and instant framing of Edgar mirrors in miniature what the sisters are doing to Lear: a child exploits a parent's credulity, uses the rhetoric of filial piety, and drives the parent into immediate disinheritance of the other child. Gloucester disinheriting Edgar in 2.1 is the dramatic echo of Lear disinheriting Cordelia in 1.1. This parallelism is what makes Lear structurally unusual — a secondary plot that does not decorate the main plot but philosophically interrogates it. The two plots are two experiments testing the same question: can parental love survive the failure of its own perception?",
      sources: ["William R. Elton, King Lear and the Gods (1966)", "Russ McDonald, Shakespeare's Late Style (2006)"]
    }
  ];
  T.king_lear_act2_scene1 = [
    {
      kind: "structural",
      prompt: "How does Edmund's framing of Edgar in 2.1 relate structurally to 1.1?",
      options: [
        "The two scenes are unrelated",
        "2.1 is the Gloucester-plot mirror of 1.1 — a parent disinheriting a true child on the word of a false one; the two plots run in deliberate parallel",
        "Edgar is actually guilty in 2.1",
        "Gloucester already knows Edgar is innocent"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 30, anchor_line_end: 90
    }
  ];

  A.king_lear_act2_scene2 = [
    {
      line_start: 14, line_end: 30,
      citation_display: "King Lear 2.2.14–30",
      category: "linguistic",
      title: "Kent's catalogue of abuse — the Jacobean insult taxonomy",
      body: "Kent's explosion of epithets at Oswald — 'a knave; a rascal; an eater of broken meats; a base, proud, shallow, beggarly, three-suited, hundred-pound, filthy, worsted-stocking knave; a lily-liver'd, action-taking, whoreson, glass-gazing, super-serviceable, finical rogue' — is a Jacobean comic aria, almost a list-poem of social insult. Each term has specific class-bite: 'three-suited' (a servingman's limit), 'worsted-stocking' (cheap hose rather than silk), 'lily-liver'd' (no blood in the liver = coward). The joke is that Kent is a nobleman in disguise unloading courtly vitriol on a courtier-servant. Oswald is, in Shakespeare's hierarchy, the worst kind of creature — a servant who takes on the manners and betrayals of the master-class without the obligations. Kent's verbal violence in this scene is itself a moral gesture; he is refusing to treat Oswald politely, which is the system's first rule.",
      sources: ["Russ McDonald, Shakespeare and the Arts of Language (2001)"]
    },
    {
      line_start: 125, line_end: 160,
      citation_display: "King Lear 2.2.125–160",
      category: "thematic",
      title: "Kent in the stocks — a symbolic assault on the king",
      body: "Putting Kent (as 'Caius,' Lear's messenger) in the stocks is legally a minor punishment for a servant who strikes another. Symbolically it is an unprecedented insult to Lear: the king's messenger is the king in microcosm, and stocking him is stocking him. Gloucester recognizes this — 'The king must take it ill / That he, so slightly valued in his messenger, / Should have him thus restrain'd' — but Cornwall and Regan are past caring. Shakespeare marks the shift: politeness to Lear is no longer possible for them, and they are willing to have the court see it. The stocks in 2.2 are where the public phase of Lear's humiliation begins.",
      sources: ["Jonathan Bate, Soul of the Age (2008)"]
    }
  ];
  T.king_lear_act2_scene2 = [
    {
      kind: "close_reading",
      prompt: "What does Kent's elaborate string of insults to Oswald accomplish?",
      options: [
        "Nothing — it is mere noise",
        "A Jacobean taxonomy of class insult — each term has specific social bite; a nobleman (in disguise) unloading courtly vitriol on a servant who has taken on master-class manners",
        "It is a prayer",
        "It quotes Sidney"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 14, anchor_line_end: 30
    },
    {
      kind: "inference",
      prompt: "Why is putting Kent in the stocks so serious an affront?",
      options: [
        "Because Kent is elderly",
        "As Lear's messenger, Kent represents the king symbolically — stocking him is a deliberate public insult to the king himself",
        "Because Kent is Cornwall's enemy",
        "Because it is illegal"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 125, anchor_line_end: 160
    }
  ];

  A.king_lear_act2_scene3 = [
    {
      line_start: 1, line_end: 21,
      citation_display: "King Lear 2.3.1–21",
      category: "historical",
      title: "Edgar as Poor Tom — Bedlam beggars as historical type",
      body: "Edgar's plan to disguise himself as a 'Bedlam beggar' draws on a real Elizabethan phenomenon. Bethlem Royal Hospital (Bedlam) in London housed the mentally ill; discharged patients — or people pretending to be discharged patients — were a recognized class of roadside beggar, sometimes called 'Abraham-men.' They used characteristic attire (pinned rosemary sprigs, mortified arms), characteristic speech (lunatic cursing, demon-naming), and sometimes exaggerated or faked their condition for alms. Edgar's 'Edgar I nothing am' adopts an extant social costume. Samuel Harsnett's 1603 Declaration of Egregious Popish Impostures — from which Shakespeare draws Poor Tom's demon names in 3.4 — was partly an exposure of faked demoniac possession by exorcists. Edgar's Poor Tom thus operates inside a real cultural argument Shakespeare was reading about.",
      sources: ["Samuel Harsnett, A Declaration of Egregious Popish Impostures (1603)", "Kenneth Muir, Shakespeare's Sources (1957)"]
    }
  ];
  T.king_lear_act2_scene3 = [
    {
      kind: "historical",
      prompt: "What historical social type is Edgar disguising himself as in 2.3?",
      options: [
        "A Roman senator",
        "A 'Bedlam beggar' — a discharged-or-pretending-to-be-discharged inmate of Bethlem Hospital (London), a recognized class of Elizabethan roadside beggar",
        "A priest",
        "A pirate"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 21
    }
  ];

  A.king_lear_act2_scene4 = [
    {
      line_start: 150, line_end: 170,
      citation_display: "King Lear 2.4.150–170",
      category: "close_reading",
      title: "'Pelican daughters' — a folk-belief turned metaphor",
      body: "Lear calls his daughters 'pelican daughters' in a line anticipating 3.4. The pelican was believed (incorrectly, but persistently in folk tradition) to feed its young with blood pecked from its own breast. 'Pelican daughters' inverts the image: children who drain their parents' blood rather than receive it. The pelican was a medieval emblem of Christ — self-sacrificing parental love — so the inversion has theological weight. Goneril and Regan are anti-pelicans, anti-Christs in miniature. This is one of Lear's most compressed metaphors, and it matters that the Fool must speak the play's lighter truths while Lear reaches for these darker emblems.",
      sources: ["Henry Peacham, Minerva Britanna (1612) — contemporary emblem source on the pelican myth"]
    },
    {
      line_start: 250, line_end: 300,
      citation_display: "King Lear 2.4.250–300",
      category: "thematic",
      title: "'O, reason not the need!' — Lear's arithmetic of dignity",
      body: "Regan's question 'What need one?' — why do you need even a single attendant — strips Lear to his last arithmetic. His response, 'O, reason not the need!', is one of the most important speeches in the play. 'Our basest beggars / Are in the poorest thing superfluous; / Allow not nature more than nature needs, / Man's life is cheap as beast's.' Lear's claim: human dignity requires a margin of excess. A life calibrated to pure biological necessity is not a human life. The speech is also self-wounding — Lear has just been a king who demanded 'natural' filial love while also demanding a hundred-knight retinue; his daughters are using his logic against him. The scene ends with Lear rushing out into the storm and the famous 'Shut up your doors.' The threshold between civilization and exposure literally closes on him.",
      sources: ["A. C. Bradley, Shakespearean Tragedy (1904)", "Stanley Cavell, 'The Avoidance of Love' in Disowning Knowledge (1987)"]
    }
  ];
  T.king_lear_act2_scene4 = [
    {
      kind: "close_reading",
      prompt: "What folk-belief underlies 'pelican daughters'?",
      options: [
        "Pelicans eat fish",
        "Pelicans were believed to feed their young with blood pecked from their own breast — 'pelican daughters' inverts the image: children who drain their parents",
        "Pelicans are lucky",
        "Pelicans were sacred to Apollo"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 150, anchor_line_end: 160
    },
    {
      kind: "theme",
      prompt: "What does Lear's 'O, reason not the need!' argue?",
      options: [
        "That he needs material comforts",
        "That human dignity requires a margin of excess above biological necessity — a life calibrated to pure need is not a human life",
        "That reason is overrated",
        "That he has earned the retinue"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 260, anchor_line_end: 290
    },
    {
      kind: "structural",
      prompt: "The line 'Shut up your doors' at the end of 2.4 is important because —",
      options: [
        "It ends the scene arbitrarily",
        "The threshold between civilization and exposure literally closes on Lear — this is the moment that sends him into the storm scenes of Act 3",
        "It is a stage direction only",
        "It is spoken by the Fool"
      ],
      answer_index: 1, wisdom_reward: 20,
      anchor_line_start: 310, anchor_line_end: 322
    }
  ];
};
