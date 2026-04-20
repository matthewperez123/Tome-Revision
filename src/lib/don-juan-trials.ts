/**
 * Don Juan chapter trials — Cantos I through XVII (chapterIndex 2..18,
 * with 0/1 reserved for the Introduction and Preface front-matter),
 * plus the "Pilgrim of Eternity" Master Trial (chapterIndex 19) which
 * awards the eponymous Seal, and a stretch capstone:
 *
 *   chapterIndex 20 — Epic Succession with Byron (Iliad + Odyssey +
 *                      Aeneid + Paradise Lost + Don Juan)
 *
 * Merged at lookup time by `getQuestionsForChapter` in
 * chapter-questions.ts, following the Aeneid / Paradise Lost pattern.
 *
 * Byron died at Missolonghi in April 1824 with Canto XVII still in
 * draft; the fragment ends at stanza 14 mid-sentence. Canto XVII
 * questions honour the unfinished ending rather than pretend it closes.
 */

import type { ChapterQuestion } from "./chapter-questions"

export const DON_JUAN_TRIALS: Record<number, ChapterQuestion[]> = {
  // ── Canto I (ch-2) ───────────────────────────────────────────────────
  2: [
    { id: "dj-1-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Byron opens Don Juan with \"I want a hero: an uncommon want.\" In what sense is he using \"want\"?",
      options: [
        "To desire — he longs for a hero",
        "To lack — he cannot find one",
        "To need, in the practical sense",
        "An archaic poetic filler word without meaning",
      ],
      correctIndex: 1,
      explanation: "*Want* is 17c–18c English for *lack*, and the joke of the opening is that the canto treats finding a hero as a practical problem of supply — the modern gazettes have consumed all the candidates, so Byron reaches for a stage-pantomime legend. The plain-English register is itself the satirical move: every previous major epic opens with an invocation; Byron opens with a shortage complaint." },
    { id: "dj-1-2", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Don Juan is written in which verse form?",
      options: [
        "Terza rima (ABA BCB CDC …)",
        "Heroic couplets",
        "Blank verse",
        "Ottava rima (ABABABCC)",
      ],
      correctIndex: 3,
      explanation: "Eight lines of iambic pentameter rhyming ABABABCC — Italian-inherited from Ariosto and Tasso. Six alternating rhymes accumulate a thought or image; the final couplet is Byron's comic \"snap,\" where the setup is deflated or twisted. This closing-couplet rhythm is the poem's comic engine; the reader's \"closing couplets\" toggle surfaces it structurally." },
    { id: "dj-1-3", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Donna Inez, Juan's mother, is widely read as Byron's satirical portrait of his estranged wife Annabella Milbanke.",
      correctBool: true,
      explanation: "Byron called Annabella \"the Princess of Parallelograms\" in private letters, and Inez's mathematical bent, evangelical piety, and moral self-seriousness transparently repeat Annabella's characteristics. Byron published the stanzas while Annabella was alive and Ada was in her care; his letter to Moore admits he is \"using her worse\" now than when they were married." },
    { id: "dj-1-4", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "The single most-quoted line of the entire poem comes from Donna Julia's farewell letter. It is:",
      options: [
        "\"I want a hero: an uncommon want\"",
        "\"Man's love is of man's life a thing apart, / 'Tis a Woman's whole existence\"",
        "\"The Isles of Greece, the Isles of Greece!\"",
        "\"Hail, Muse! et cetera\"",
      ],
      correctIndex: 1,
      explanation: "Stanza I.194. Julia, writing from the convent, gives Juan the distinction that has been quoted (often out of context) for two centuries as a truth about love and gender. In context it is a letter of accusation — Julia naming exactly what Juan is walking away from. The form (ottava rima in the Byronic comic register) carrying the most serious speech Byron gives a woman character is the point: the prosody has earned its seriousness across 193 preceding stanzas." },
    { id: "dj-1-5", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Byron's virtuoso comic rhyme in Canto I (stanza 22) forces which word into rhyme with \"intellectual\"?",
      options: [
        "individual",
        "ineffectual",
        "hen-pecked you all",
        "remedial",
      ],
      correctIndex: 2,
      explanation: "The outrageous multi-word rhyme is Byron's signature. *Intellectual / hen-pecked you all* is deliberately stretched — a comic rhyme that can only work by forcing \"you all\" into a single slurred sound. The attack on bluestocking wives lands on a rhyme that is itself conspicuously *un*-intellectual; form and content collapse into the same gag. Roughly 40–60 such virtuoso rhymes run across the 17 cantos." },
  ],

  // ── Canto II (ch-3) ──────────────────────────────────────────────────
  3: [
    { id: "dj-2-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Canto II opens with the shipwreck. After the lifeboat runs out of food, the sailors draw lots. Whom does the lot fall on?",
      options: [
        "Don Juan himself",
        "Pedrillo, Juan's tutor",
        "The ship's captain",
        "A nameless sailor",
      ],
      correctIndex: 1,
      explanation: "Pedrillo — the language-learned Spanish tutor introduced comically seasick at the canto's opening. Byron researched the cannibalism scene from real incidents (the *Peggy*, 1765; the *Nautilus*, 1807) and wrote the lot-drawing with ritual formality (\"The lots were made, and marked, and mixed, and handed, / In silent horror\"). Five stanzas later Byron names Dante's Ugolino as his defence: the greatest Christian poem also ate people." },
    { id: "dj-2-2", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "The young woman who finds Juan washed up on the beach is named:",
      options: [
        "Donna Julia",
        "Gulbeyaz",
        "Haidée",
        "Zoe",
      ],
      correctIndex: 2,
      explanation: "Haidée — daughter of the pirate Lambro, about seventeen, encountered by Juan at canto II.128 and at the centre of the poem's one unironic love through Cantos III and IV. Her palette color (sea-pearl with a dawn-gold undertone) signals the Edenic register of her passages; her death at IV.70 is the poem's emotional core." },
    { id: "dj-2-3", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "The real-world historical event that shapes Byron's shipwreck sequence is most closely associated with:",
      options: [
        "Géricault's *The Raft of the Medusa* (1818–19)",
        "The Spanish Armada",
        "Captain Cook's death",
        "The HMS Bounty mutiny",
      ],
      correctIndex: 0,
      explanation: "The French frigate *Méduse* sank off West Africa in 1816; Géricault was painting the raft of starving survivors in Paris while Byron drafted Canto II in Venice. Byron also drew on Dalyell's *Shipwrecks and Disasters at Sea* (1812) and the *Peggy* narrative, but the Méduse was the period's defining maritime horror and almost certainly the event Byron's readers would have had in mind." },
    { id: "dj-2-4", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Haidée's arrival — a young woman finding a shipwrecked man on a beach — echoes which classical episode?",
      options: [
        "Dido receiving Aeneas at Carthage (Aeneid I)",
        "Nausicaa finding Odysseus on the Phaeacian shore (Odyssey VI)",
        "Circe meeting Odysseus on Aeaea (Odyssey X)",
        "Penelope receiving Odysseus in disguise (Odyssey XIX)",
      ],
      correctIndex: 1,
      explanation: "Odyssey VI. Nausicaa, princess of the Phaeacians, discovers the naked shipwrecked Odysseus on the beach and brings him home. Byron's Haidée is the same mythic template transposed to a 19c Aegean island — but treated with Romantic tenderness rather than archaic formality, and with no Athena-orchestrated divine plan to reassure the reader that the encounter will end well." },
  ],

  // ── Canto III (ch-4) ─────────────────────────────────────────────────
  4: [
    { id: "dj-3-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Canto III opens with \"Hail, Muse! et cetera.\" What is Byron doing?",
      options: [
        "Apologizing for losing his place",
        "Dismissing the Homeric / Miltonic invocation by reducing it to an abbreviation",
        "Actually invoking the Muse seriously",
        "Admitting he has writer's block",
      ],
      correctIndex: 1,
      explanation: "Every previous serious epic required an invocation, and every previous reader submitted to the formula. Byron's three words acknowledge the convention and refuse the submission. The joke is precise: the reader is asked to supply the rest of the formula, and the poem moves on without it. Within the same stanza Byron modulates to the tenderest register yet about Haidée (\"a young heart, too deeply blest\"), demonstrating that the comic dismissal does not compromise the seriousness of what follows." },
    { id: "dj-3-2", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Embedded in Canto III is a 16-stanza lyric in a different meter from the surrounding ottava rima, sung by a wandering bard at Haidée's feast. Its title is:",
      options: [
        "\"The Prophecy of Dante\"",
        "\"The Isles of Greece\"",
        "\"To Ianthe\"",
        "\"The Vision of Judgment\"",
      ],
      correctIndex: 1,
      explanation: "\"The Isles of Greece\" — Byron's most anthologized short poem, printed as a standalone in every 19c English anthology. Six-line iambic-tetrameter stanzas rhyming ABABCC. The lyric addresses modern Greece under Ottoman rule and the Marathon stanza (\"The mountains look on Marathon — / And Marathon looks on the sea\") was translated into every European language, set to music, and carried into battle by Greek revolutionaries in the 1821–29 War of Independence." },
    { id: "dj-3-3", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Byron frames the bard who sings \"The Isles of Greece\" as a cynical \"trimmer\" who will sing whatever patron pays him.",
      correctBool: true,
      explanation: "True. At III.87, immediately after the lyric ends, Byron dismisses the bard as a political weather-vane. The frame is sophisticated: Byron is admitting in advance that political poetry is suspect and that his own authority to write the revolutionary call is not automatic. The frame is a promissory note he redeemed with his life — two years later he died at Missolonghi fighting for Greek independence." },
  ],

  // ── Canto IV (ch-5) ──────────────────────────────────────────────────
  5: [
    { id: "dj-4-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Haidée dies at Canto IV, stanza 70. The stanza's central paradox describes the unborn child she carries as:",
      options: [
        "\"A fair and sinless child of sin\"",
        "\"A curse upon the world\"",
        "\"An innocent abandoned\"",
        "\"The issue of a blighted love\"",
      ],
      correctIndex: 0,
      explanation: "\"A fair and sinless child of sin.\" The phrase is the stanza's load-bearing paradox — the child would have been illegitimate in its parents' society (\"of sin\") but is itself sinless, having never been born. Byron refuses the moral category of *bastardy* while admitting the social category of *shame*, and in the refusal writes one of the sharpest Romantic protests against Christian ethics' treatment of illegitimate children in the period's literature." },
    { id: "dj-4-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Which earlier epic death is the clearest classical template for Haidée's death at the end of Canto IV?",
      options: [
        "Patroclus in the Iliad",
        "Dido in Aeneid IV",
        "Eurydice in the Orpheus myth",
        "Francesca in Inferno V",
      ],
      correctIndex: 1,
      explanation: "Dido's death in Aeneid IV. Both are women destroyed by love for a man shipped off to a larger fate; both deaths are the canto's formal close. Byron makes the debt explicit by modeling Canto IV on Aeneid IV — both are the fourth canto/book, both the emotional centerpiece, both the moment the hero's course is redirected by the woman's end." },
    { id: "dj-4-3", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "The Frankenstein cross-reference in Canto IV's opening is biographical rather than textual — both books were conceived in the same summer at Villa Diodati, 1816.",
      correctBool: true,
      explanation: "True. Villa Diodati, Lake Geneva, June 1816: Byron hosting the Shelleys and Polidori, the ghost-story contest, Mary Shelley's *Frankenstein* and Polidori's *The Vampyre* both emerging. Byron abandoned his own fragment and wrote Don Juan instead. The three-way cluster — Milton's Satan → Byron's Byronic narrator → Mary Shelley's Creature — is one of the most consequential creative chains in English letters." },
  ],

  // ── Canto V (ch-6) ───────────────────────────────────────────────────
  6: [
    { id: "dj-5-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Who buys Juan in the Constantinople slave market?",
      options: [
        "The Sultan himself",
        "An Ottoman merchant",
        "A eunuch acting for the Sultana Gulbeyaz",
        "A Russian emissary",
      ],
      correctIndex: 2,
      explanation: "Baba the eunuch, acting as Gulbeyaz's agent. Juan is smuggled into the seraglio disguised as a woman (\"Juanna\") and brought before the Sultana, who demands his love. Juan, still mourning Haidée two cantos before, refuses — the canto's central confrontation." },
    { id: "dj-5-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Johnson's line \"Most men are slaves, none more so than the great\" is an anti-aristocratic argument in favor of chattel slavery.",
      correctBool: false,
      explanation: "False. It is the radical-Whig comparative-slavery position: all hierarchical societies contain coercion, and the chattel slavery of the Ottoman market is only the most literal form of the general condition. Byron is not defending Ottoman slavery; he is forcing the British reader to feel the comparative sting — we keep slaves too, we call them servants, and the distance between \"freedom\" and \"slavery\" is narrower than polite British society admits." },
  ],

  // ── Canto VI (ch-7) ──────────────────────────────────────────────────
  7: [
    { id: "dj-6-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Canto VI opens with \"There is a tide in the affairs of men, / Which — taken at the flood — you know the rest.\" The source is:",
      options: [
        "Milton, Paradise Lost",
        "Pope, Essay on Man",
        "Shakespeare, Julius Caesar (Brutus at Philippi)",
        "Thomson, The Seasons",
      ],
      correctIndex: 2,
      explanation: "Julius Caesar IV.iii.218, Brutus arguing to march on Antony's forces at Philippi. Byron's \"you know the rest\" trusts the reader to complete the famous quotation — the same compression move as Canto III's \"Hail, Muse! et cetera.\" The stanza's substance is the women's version of Brutus's claim: tides in the affairs of men matter less than the moment at which a woman makes a decision." },
  ],

  // ── Canto VII (ch-8) ─────────────────────────────────────────────────
  8: [
    { id: "dj-7-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Cantos VII and VIII depict which historical military event?",
      options: [
        "The Battle of Waterloo (1815)",
        "The Russian siege of the Ottoman fortress of Ismail (1790)",
        "The Battle of Trafalgar (1805)",
        "The French Revolution's Reign of Terror (1793–94)",
      ],
      correctIndex: 1,
      explanation: "The siege and storming of Ismail on the Danube, 22 December 1790, during Catherine the Great's second war with the Ottomans. Byron followed Castelnau's *Essai sur la Nouvelle Russie* (1820) in close detail and names real generals — Suvorov, Potemkin, Kutuzov, Ribas, Markov — with near-perfect fidelity. The assault killed an estimated 26,000 Ottoman defenders and perhaps 8,000 civilians." },
    { id: "dj-7-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "The Russian field-marshal commanding at Ismail, whom Byron calls \"Suwarrow,\" is historically:",
      options: [
        "Mikhail Kutuzov",
        "Alexander Suvorov",
        "Grigory Potemkin",
        "Alexei Arakcheyev",
      ],
      correctIndex: 1,
      explanation: "Alexander Vasilyevich Suvorov (1729–1800) — undefeated across sixty-plus battles, the architect of the Ismail assault and of the 1799 Alpine crossing in retreat from the French. Byron's \"who loved blood as an alderman loves marrow\" is satirical rather than biographical (the historical Suvorov was an ascetic), but catches the image of Suvorov that 19c European military culture preserved." },
  ],

  // ── Canto VIII (ch-9) ────────────────────────────────────────────────
  9: [
    { id: "dj-8-1", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Canto VIII's anti-war argument is pacifist — Byron rejects all military action as unjustifiable.",
      correctBool: false,
      explanation: "False. Byron's position is consequentialist just-war, not pacifist. Canto VIII stanza 5 names Leonidas (at Thermopylae) and Washington (the American Revolution) as counter-examples whose battlefields are \"holy ground\" — wars of national defence and liberation. Ismail is condemned as a war of dynastic aggrandizement, not warfare as such. Byron died under arms at Missolonghi fighting for Greek independence — precisely the kind of war he categorizes as just." },
    { id: "dj-8-2", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "In the middle of the sack of Ismail, Juan rescues a small Tatar girl whose name is:",
      options: [
        "Haidée",
        "Gulbeyaz",
        "Leila",
        "Zoe",
      ],
      correctIndex: 2,
      explanation: "Leila — about ten years old, orphaned in the assault, rescued by Juan from Cossack irregulars. She remains with Juan through the rest of the poem, silent, appearing in the English cantos as his ward. Byron keeps her deliberately understated — a fact the poem carries, not a subject the poem works up. The line \"a gentler duty / Pervaded him still more\" gives her moral rank over Juan's soldierhood." },
  ],

  // ── Canto IX (ch-10) ─────────────────────────────────────────────────
  10: [
    { id: "dj-9-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Canto IX opens with one of the most sustained personal attacks ever published on a living British public figure. Who?",
      options: [
        "William Pitt the Younger",
        "Lord Castlereagh",
        "The Duke of Wellington",
        "George IV",
      ],
      correctIndex: 2,
      explanation: "Wellington — the victor of Waterloo, the most-celebrated British soldier since Marlborough, and the political face of the post-1815 conservative order. Cantos IX.1–10 are the indictment: the French pun \"Villainton,\" the Shakespearean \"best of cut-throats\" (Macbeth III.iv.17), the pensions and Stratfield Saye, the imagined Westminster Abbey epitaph. Wellington was 53 when the canto was published (1823) and outlived Byron by 28 years; the attack did not touch his career but fixed a counter-portrait that radical poets from Shelley through Heine to Whitman inherited." },
    { id: "dj-9-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "The Shakespearean quotation Byron applies to Wellington — \"the best of cut-throats\" — comes from which play and speaker?",
      options: [
        "Hamlet, spoken by the Ghost",
        "Macbeth, spoken by Macbeth to the hired murderer",
        "King Lear, spoken by Edmund",
        "Julius Caesar, spoken by Antony",
      ],
      correctIndex: 1,
      explanation: "Macbeth III.iv.17 — Macbeth greeting the assassin he has hired to murder Banquo: \"Thou art the best o' the cut-throats.\" Byron's anchoring in Shakespeare is deliberate: a defender of Wellington would have to argue not with Byron but with Shakespeare. The implication about Wellington is the political master's assassin in better uniform." },
  ],

  // ── Canto X (ch-11) ──────────────────────────────────────────────────
  11: [
    { id: "dj-10-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Canto X opens with \"When Newton saw an apple fall\" — the stanza's central pun depends on the double meaning of which word?",
      options: [
        "Apple",
        "Fall",
        "Gravitation",
        "Science",
      ],
      correctIndex: 1,
      explanation: "*Fall* — the theological Fall (from Paradise Lost) and the fall of Newton's apple at Woolsthorpe (1666). The pun collapses Christian myth and secular science: both require an apple, both result in a new knowledge. Byron's couplet — \"this is the sole mortal who could grapple, / Since Adam — with a fall — or with an apple\" — puts Newton and Adam on the same historical line. The Enlightenment replaces the Fall with scientific discovery; modernity is what comes after the second fall." },
  ],

  // ── Canto XI (ch-12) ─────────────────────────────────────────────────
  12: [
    { id: "dj-11-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Canto XI opens with a reference to which philosopher?",
      options: [
        "John Locke",
        "David Hume",
        "George Berkeley",
        "Immanuel Kant",
      ],
      correctIndex: 2,
      explanation: "George Berkeley (1685–1753), the Anglo-Irish philosopher whose *Principles of Human Knowledge* (1710) argued that matter has no independent existence. Byron compresses the position into three words (\"universal egotism\") and plays the standard British common-sense rejoinder against it — \"who can believe it?\" The Berkeley opening prepares the canto's sustained philosophical meditation on vanity, fame, and the transience of reputation." },
  ],

  // ── Canto XII (ch-13) ────────────────────────────────────────────────
  13: [
    { id: "dj-12-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Canto XII describes the middle age of man in a memorable typographic metaphor:",
      options: [
        "\"A rose that droops before the dew\"",
        "\"Black letter upon foolscap\"",
        "\"An empty harp\"",
        "\"A winter garden\"",
      ],
      correctIndex: 1,
      explanation: "\"Black letter upon foolscap\" — Gothic typeface on standard legal paper. The metaphor is precise: middle-aged life as an old legal document, serious, cumbrous, written in a hand no one reads anymore. Byron was 34 when he wrote it (autumn 1822); the stanza is both general satire and personal confession." },
  ],

  // ── Canto XIII (ch-14) ───────────────────────────────────────────────
  14: [
    { id: "dj-13-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "The English cantos (XIII–XVII) are set at Norman Abbey, the country seat of:",
      options: [
        "Lord and Lady Henry Amundeville",
        "The Duke of Fitz-Fulke",
        "Sir Walter Norman",
        "The Earl of Ruthven",
      ],
      correctIndex: 0,
      explanation: "Norman Abbey is Byron's poetic version of Newstead Abbey, his own ancestral seat in Nottinghamshire, sold in 1818 to settle his debts. Lord Henry Amundeville (Tory MP, competent landlord) and Lady Adeline (the primary female interest of the English cantos) are the hosts. Byron describes the house from memory; the Black Friar ghost of Cantos XV–XVI was genuine Newstead folklore before it became Byronic myth." },
  ],

  // ── Canto XIV (ch-15) ────────────────────────────────────────────────
  15: [
    { id: "dj-14-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Canto XIV's opening Saturnian stanza argues that:",
      options: [
        "All men eventually die",
        "The gods are indifferent to humanity",
        "Every philosophical system eats the one before it",
        "English weather defeats all metaphysics",
      ],
      correctIndex: 2,
      explanation: "The Saturn / Rhea myth inverted — \"System doth reverse the Titan's breakfast, / And eats her parents.\" Byron's image of philosophical succession (Kant eating Leibniz, Fichte eating Kant, Hegel eating Fichte — the period's actual intellectual history) is his most condensed argument for philosophical scepticism. The closing question \"can you make fast your faith to any question?\" is Byron's invitation to the reader to notice they cannot." },
  ],

  // ── Canto XV (ch-16) ─────────────────────────────────────────────────
  16: [
    { id: "dj-15-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "The Catholic orphan introduced at Canto XV as the only character in the late cantos who genuinely interests Juan is named:",
      options: [
        "Lady Adeline",
        "The Duchess of Fitz-Fulke",
        "Aurora Raby",
        "Lady Pinchbeck",
      ],
      correctIndex: 2,
      explanation: "Aurora Raby — Catholic, orphaned, reserved, wealthy. The narrator treats her with a care that has no equivalent elsewhere in the late cantos. Her introduction late in the poem signals that Byron was planning a significant arc for her in cantos he did not live to write; the Canto XVII fragment mentions her briefly before breaking off." },
  ],

  // ── Canto XVI (ch-17) ────────────────────────────────────────────────
  17: [
    { id: "dj-16-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Byron's French-derived term \"mobility,\" introduced in Canto XVI stanza 97, names:",
      options: [
        "Social climbing",
        "A capacity for rapid, sincere emotional change",
        "Military readiness",
        "Freedom of movement",
      ],
      correctIndex: 1,
      explanation: "*Mobilité* — the capacity to shift genuinely and quickly between strong emotional states, to be moved by what is immediately present, and to leave behind (without repression) the state that was present a moment before. Byron's footnote to the stanza insists it is a real psychological type, and the term is the single most important self-analytical concept in his work. The poem's violent swings between satire and tenderness are the record of a mobile sensibility." },
    { id: "dj-16-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "The Black Friar who appears to Juan in Canto XVI is resolved as the Duchess of Fitz-Fulke in disguise.",
      correctBool: true,
      explanation: "The second apparition is resolved as the Duchess — her prank-disguise to access Juan's chamber. But the FIRST apparition (earlier in the canto) is not resolved; Byron leaves the reader and Juan genuinely uncertain whether the first Friar was the Duchess or something else. The ghost-story ambiguity was what the Canto XVII fragment was moving to develop when the poem broke off." },
  ],

  // ── Canto XVII fragment (ch-18) ──────────────────────────────────────
  18: [
    { id: "dj-17-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Canto XVII is a fragment. How many stanzas exist?",
      options: [
        "14 stanzas",
        "50 stanzas",
        "99 stanzas",
        "The canto was finished but lost",
      ],
      correctIndex: 0,
      explanation: "Fourteen stanzas. Byron wrote them in Greece in early 1824 while preparing his Suliote brigade for the Greek War of Independence. He died of fever at Missolonghi on 19 April 1824 before returning to the poem. The fragment opens on the taxonomy of orphans (\"The world is full of orphans: firstly, those / Who are so in the strict sense of the phrase\") — a subject deeply personal given Byron's separation from his daughter Ada and the recent death of his daughter Allegra (1822)." },
    { id: "dj-17-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Byron planned to finish Don Juan by sending Juan to revolutionary France and killing him as a Jacobin.",
      correctBool: false,
      explanation: "False — Byron had NO fixed plan. His 1819 letter to Murray: \"You ask me for the plan of Donny Johnny; I *have* no plan — I *had* no plan; but I had or have materials.\" He mentioned several possible endings across his letters (Juan as Anacharsis Cloots in the French Revolution; Juan guillotined; Juan as a *cavalier servente* in Italy; Juan in an unhappy English marriage) but committed to none. The poem ends mid-scene at Norman Abbey; no retrospective plan was ever firm." },
  ],

  // ── The Pilgrim of Eternity Master Trial (ch-19) ─────────────────────
  // 15 questions synthesizing the poem's full arc.
  19: [
    { id: "dj-master-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "The phrase \"Pilgrim of Eternity\" — which names this trial's Seal — comes from which poem?",
      options: [
        "Wordsworth's *Prelude*",
        "Keats's *Ode on a Grecian Urn*",
        "Shelley's *Adonais*",
        "Byron's own *Childe Harold*",
      ],
      correctIndex: 2,
      explanation: "Shelley's elegy *Adonais* (1821), written on the death of Keats, names Byron as \"the Pilgrim of Eternity, whose fame / Over his living head like Heaven is bent, / An early but enduring monument.\" The title names the Byron-of-*Childe Harold* for Shelley's purpose; the Seal adopts it as the title appropriate to the poet who completed his reckoning in Don Juan and died at Missolonghi." },
    { id: "dj-master-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "*Don Juan* is a comic-satirical counter-statement to which previous epic's moral gravity?",
      options: [
        "Homer's Iliad",
        "Milton's Paradise Lost",
        "Virgil's Aeneid",
        "Dante's Divine Comedy",
      ],
      correctIndex: 1,
      explanation: "Paradise Lost is the primary reference. Byron knew Milton thoroughly; his Satan-sympathies are explicit in *Cain*. Don Juan's opening (\"I want a hero\") demotes Milton's opening period; Canto IV's Lucifer-fall opening names Milton directly; the narrator's relation to his reader parodies Milton's Satan-tempting-Eve structure. Byron is the first English poet to write major verse consciously setting itself against Milton's moral project." },
    { id: "dj-master-3", type: "true_false", difficulty: "Scholar", xpReward: 15,
      text: "The narrator of Don Juan is the poem's protagonist — Juan himself is largely passive and reactive.",
      correctBool: true,
      explanation: "True. Byron's own readers (Eliot, Auden, Calvino) have consistently noted that the narrator — \"Byron-the-narrator,\" the ink-blue voice of roughly half the poem's stanzas — is the true protagonist. Juan is famously passive; Byron's joke is that the legendary seducer is actually seduced throughout. The poem's plot is the occasion; the narrator's voice is the argument." },
    { id: "dj-master-4", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "The geographic arc of Juan's adventures is, in order:",
      options: [
        "Seville → London → Constantinople → Rome → St Petersburg",
        "Seville → Greek island (shipwreck, Haidée) → Constantinople → Ismail → St Petersburg → London",
        "Madrid → Venice → Constantinople → Paris",
        "Seville → Lisbon → London → New York",
      ],
      correctIndex: 1,
      explanation: "Canto I Seville (Julia); II–IV shipwreck and Haidée's Greek island; V–VI Constantinople seraglio; VII–VIII Russian siege of Ismail; IX–X Catherine's court in St Petersburg; XI–XVII London and Norman Abbey (fragment). The arc takes the hero through every major political formation of late-18c Europe." },
    { id: "dj-master-5", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "Which of these features does NOT appear in Don Juan?",
      options: [
        "Cannibalism (the lot-drawing in the lifeboat)",
        "A disguised-as-a-woman seraglio episode",
        "A ghost story (the Black Friar)",
        "A descent to the underworld",
      ],
      correctIndex: 3,
      explanation: "There is no katabasis / descent to the underworld, despite Byron's obvious awareness of the Odyssey XI, Aeneid VI, and Inferno precedents. Scholars speculate Byron was moving toward a supernatural episode in the English cantos (the Black Friar ghost story was heading somewhere), but the poem breaks off at Canto XVII before any descent materializes. The unfinished ending leaves this classical-epic element conspicuously absent." },
    { id: "dj-master-6", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "Byron's political attacks in Don Juan are most intensely targeted at:",
      options: [
        "The French Bourbons",
        "The Ottoman Sultan",
        "The British Tory government and the post-1815 conservative order (Wellington, Castlereagh, George IV)",
        "The Papacy",
      ],
      correctIndex: 2,
      explanation: "The Tory settlement Byron was exiled under. Wellington (Canto IX opening), Castlereagh (Dedication absent here, but referenced throughout), George IV (the \"Regent,\" satirized by innuendo in the English cantos), the Six Acts and the repression of radical press — Byron's satire is specifically targeted at the British state in the 1815–23 period. He was writing, effectively, from political exile, and the satire is the exile's retaliation." },
    { id: "dj-master-7", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "The Haidée sequence (Cantos II–IV) is the poem's emotional core. What breaks the idyll?",
      options: [
        "Haidée falls in love with another man",
        "Juan is summoned back to Spain",
        "A hurricane destroys the island",
        "Haidée's pirate father Lambro returns alive",
      ],
      correctIndex: 3,
      explanation: "Lambro returns alive. He was presumed drowned or captured during the idyll; he reappears quietly on his own island at Canto III's close, confronts the pair at Canto IV.34, wounds Juan, ships him to Turkish slavery, and places Haidée under convent-style house arrest. Haidée, pregnant, refuses food, falls into a twelve-day fever, and dies at IV.70 — the unborn child dying with her." },
    { id: "dj-master-8", type: "true_false", difficulty: "Scholar", xpReward: 15,
      text: "\"Man's love is of man's life a thing apart, / 'Tis a Woman's whole existence\" is spoken by Byron's narrator in his own voice.",
      correctBool: false,
      explanation: "False. The line is spoken by Donna Julia in her farewell letter (I.194). Byron ventriloquizes a woman writing to the young man who has ruined her. The context is a letter of accusation, not a sentimental generalization — though the line has been quoted for two centuries out of context as if it were Byron's own pronouncement." },
    { id: "dj-master-9", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "Which historical event is the documentary source for Byron's anti-war cantos (VII–VIII)?",
      options: [
        "The Battle of Waterloo",
        "The Siege of Badajoz (1812)",
        "The Russian siege of Ismail (1790)",
        "The Battle of Borodino (1812)",
      ],
      correctIndex: 2,
      explanation: "Ismail on the Danube, 22 December 1790, during Catherine's second Ottoman war. Byron followed Castelnau's *Nouvelle Russie* (1820) and names real generals — Suvorov, Potemkin, Kutuzov, Markov — with near-perfect fidelity. The assault killed c. 26,000 Ottoman defenders; the cantos are probably the 19c's most sustained anti-war argument in English verse." },
    { id: "dj-master-10", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "Byron died at Missolonghi in April 1824. What was he doing there?",
      options: [
        "Completing Don Juan",
        "Commanding a brigade for the Greek War of Independence",
        "Visiting Shelley's grave",
        "Writing his memoirs",
      ],
      correctIndex: 1,
      explanation: "Byron had raised, paid for out of his own diminished fortune, and was training a brigade of Suliote fighters for the Greek independence war against the Ottoman Empire. He arrived at Missolonghi in January 1824, caught a fever during military preparations, and died 19 April 1824. The Greek state, declared in 1830, regarded him as one of its founders." },
    { id: "dj-master-11", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "The Villa Diodati cross-reference in Canto IV connects Don Juan to which other English masterpiece?",
      options: [
        "Shelley's *Prometheus Unbound*",
        "Mary Shelley's *Frankenstein*",
        "Keats's *Endymion*",
        "Polidori's *The Vampyre*",
      ],
      correctIndex: 1,
      explanation: "*Frankenstein*. Villa Diodati, Lake Geneva, summer 1816 — Byron hosting the Shelleys and Polidori, the wet June ghost-story contest. Mary Shelley's *Frankenstein* and Polidori's *The Vampyre* both emerged; Byron abandoned his own fragment and wrote Don Juan instead. The three-way cluster — Milton's Satan → Byron's Byronic narrator → Mary Shelley's Creature — is a demo-critical cross-reference in the Tome catalog." },
    { id: "dj-master-12", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "\"The Isles of Greece\" is:",
      options: [
        "A Byron poem written separately",
        "A lyric embedded in Canto III, sung by a wandering bard at Haidée's feast",
        "A Shelley poem mentioned in Don Juan",
        "A Greek revolutionary song Byron translated",
      ],
      correctIndex: 1,
      explanation: "Embedded in Canto III at stanza 86. Sixteen six-line stanzas in iambic tetrameter (ABABCC) — a different meter from the surrounding ottava rima. Since the 19c it has been extracted and printed as a standalone poem in every English anthology that includes Byron. The Marathon stanza in particular was carried into battle by Greek revolutionaries 1821–29." },
    { id: "dj-master-13", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "Byron's term \"mobility\" (Canto XVI stanza 97) names:",
      options: [
        "Physical health and athletic vigor",
        "A capacity for sincere, rapid emotional change",
        "Social mobility between classes",
        "The mobility of philosophical argument",
      ],
      correctIndex: 1,
      explanation: "*Mobilité* — genuinely being moved by what is immediately present, and leaving behind (without repression or insincerity) the state that was present a moment before. Byron applies it to Adeline but it is transparently a self-portrait: the poem's violent swings between satire and tenderness are the record of a mobile sensibility. For readers who want to understand Byron's technique, this is the single most important concept." },
    { id: "dj-master-14", type: "true_false", difficulty: "Scholar", xpReward: 15,
      text: "Byron never finished Don Juan — Canto XVII breaks off after 14 stanzas.",
      correctBool: true,
      explanation: "True. Byron was working on Canto XVII at Missolonghi in early 1824 and died on 19 April 1824. The fragment ends mid-movement, without closing the Black Friar ghost story, without resolving Juan's relation to Aurora or Adeline. The canto's opening meditation on orphans is the last sustained thing Byron wrote, and the unfinished ending — honored rather than papered over — is the reading-canon's consensus treatment." },
    { id: "dj-master-15", type: "multiple_choice", difficulty: "Scholar", xpReward: 15,
      text: "What is the closing-couplet \"snap\" of ottava rima, and why does it matter for Byron?",
      options: [
        "A typographical ornament — visual, not semantic",
        "A rhythmic variation on the six preceding lines",
        "The final two rhymed lines after six alternating rhymes; Byron's comic-satirical argumentation lives here",
        "A prose signature at the end of each canto",
      ],
      correctIndex: 2,
      explanation: "ABABABCC: six lines of alternating rhyme (the setup) close with a couplet (the snap). Byron built most of the poem's comedy on this structure — the six lines build up a thought or image, the closing couplet deflates, twists, insults, or confesses. The reader's \"closing couplets\" toggle in the Don Juan canto header surfaces the structure; learning to listen for the snap is the single most productive reading skill for this poem." },
  ],

  // ── Epic Succession stretch trial (ch-20) ────────────────────────────
  // Iliad + Odyssey + Aeneid + Paradise Lost + Don Juan — the five-epic
  // arc from Homer to the Romantic counter-statement.
  20: [
    { id: "dj-succession-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 20,
      text: "The five-epic succession from Homer to Byron is usually characterized as:",
      options: [
        "A progressive moral ascent",
        "A repetition of the same form across languages",
        "An accumulating tradition of opening moves, each consciously answering its predecessors",
        "Independent works with no formal relation",
      ],
      correctIndex: 2,
      explanation: "Each opening consciously answers the previous: Homer (Iliad) opens with *anger*, Homer (Odyssey) with *polytropos*, Virgil with *arma virumque* (war + man), Dante with *Nel mezzo del cammin* (the midpoint of life), Milton with *Of Man's first disobedience* (theological Fall), Byron with *I want a hero* (demotion and refusal). The tradition is a chain of openings, each performing a specific theological-literary displacement of its predecessor." },
    { id: "dj-succession-2", type: "true_false", difficulty: "Scholar", xpReward: 20,
      text: "Don Juan completes the Epic Succession as its comic counter-statement — the poem that knows all the others and refuses their moral gravity.",
      correctBool: true,
      explanation: "True. Byron knew Homer (in Pope's translation and in Greek from Harrow), Virgil (by heart, in Latin), Dante (closely, for *The Prophecy of Dante*), and Milton (thoroughly, for *Cain*). Don Juan opens by demoting the tradition's invocations, quotes its templates across the cantos, and ends in a fragment that refuses the tradition's usual closure. The five-epic arc — from Homer's *anger* to Byron's *I want a hero* — is the history of Western epic's progressive self-demolition." },
    { id: "dj-succession-3", type: "multiple_choice", difficulty: "Scholar", xpReward: 20,
      text: "Which cross-book-specific echo is demonstrably in Byron's mind in Canto II's shipwreck?",
      options: [
        "Odysseus's raft in Odyssey V",
        "Dante's Ugolino (Inferno XXXIII), whom Byron names in II.83",
        "Virgil's storm in Aeneid I",
        "Milton's Chaos in Paradise Lost II",
      ],
      correctIndex: 1,
      explanation: "Ugolino. Byron names the cross-reference explicitly in II.83 (\"Remember Ugolino condescends / To eat the head of his arch-enemy\") to claim Dantean peerage for his cannibalism scene. The other three books are present in Don Juan's background — the Odyssey V shipwreck is in the template; Aeneid I's storm is a classical prototype; Milton's Chaos informs Canto IV's Lucifer-fall opening — but the Ugolino reference is the explicit textual echo Byron chooses to mark." },
  ],
}
