/**
 * Decameron chapter trials — tale-close, day-close, and work-close
 * questions for Boccaccio's hundred tales and their frame.
 *
 *   chapterIndex 0   — Proem (no trial; front matter)
 *   chapterIndex 1   — Day I stub (no trial)
 *   chapterIndex 2   — Day I Introduction (plague). Opening-trial here.
 *   chapterIndex 3..12  — Day I tales (light tale-close trials).
 *   chapterIndex 13..108 — alternating stub/intro/10-tales per day.
 *   chapterIndex 110 — Day X Introduction.
 *   chapterIndex 111..120 — Day X tales.
 *   chapterIndex 121 — Conclusion of the Author — trial on the work.
 *   chapterIndex 122 — Glossary (no trial).
 *
 *   chapterIndex 123 — Master Trial ("Member of the Brigata" Seal) —
 *                      stored above the content range so the reader
 *                      routes it to the capstone UI.
 *
 * Scope of this seed set: opening-trial (ch-2), tale-close trials on the
 * ten load-bearing tales (I.1 I.3 IV-intro IV.1 IV.5 V.9 VI.9 X.10), the
 * Conclusion trial, and the Master Trial. Other tales get tale-close
 * trials in a subsequent pass.
 */

import type { ChapterQuestion } from "./chapter-questions"

export const DECAMERON_TRIALS: Record<number, ChapterQuestion[]> = {

  // ── Day I Introduction (ch-2) — The Plague ─────────────────────────
  2: [
    { id: "dec-plague-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Boccaccio identifies three responses to the plague in Florence. Which of the three does the brigata choose?",
      options: [
        "Ascetic withdrawal and penance",
        "Hedonistic excess — drink, sing, and take everything before the end",
        "Moderate flight from the city in good company",
        "Armed defense of the city gates",
      ],
      correctIndex: 2,
      explanation: "Boccaccio names three responses — asceticism, hedonism, and moderate flight — and the brigata chooses the third: they leave the city for a countryside villa in good company, with provisions, music, and books." },
    { id: "dec-plague-2", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "In which Florentine church do the seven young ladies meet before they decide to leave the city?",
      options: [
        "The Duomo (Santa Maria del Fiore)",
        "Santa Maria Novella",
        "Santa Croce",
        "San Lorenzo",
      ],
      correctIndex: 1,
      explanation: "Santa Maria Novella, the great Dominican basilica, is the meeting place Boccaccio gives the brigata. It is a real place you can still stand in." },
    { id: "dec-plague-3", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Boccaccio himself was an eyewitness to the 1348 plague in Florence.",
      correctBool: true,
      explanation: "Boccaccio was in Florence during the 1348 pandemic. His father died in that wave, as did his stepmother. The eyewitness stance of the Introduction is not a literary convention — it is testimony." },
    { id: "dec-plague-4", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "How many young people form the brigata?",
      options: ["Three ladies and seven men", "Seven ladies and three men", "Ten men", "Five couples"],
      correctIndex: 1,
      explanation: "Seven women and three men — a ratio that reflects Boccaccio's dedication of the work to lovesick ladies in the Proem." },
  ],

  // ── Day I, Tale 1 (ch-3) — Ser Ciappelletto ────────────────────────
  3: [
    { id: "dec-i-1-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Which narrator opens the entire sequence of 100 tales?",
      options: ["Dioneo", "Filomena", "Pamfilo", "Pampinea"],
      correctIndex: 2,
      explanation: "Pamfilo ('all-loving') tells I.1 — the tale of Ser Ciappelletto. He will also rule the final day, Day X. He is the narrator who opens and closes the ordered-tale structure." },
    { id: "dec-i-1-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "The confessor who hears Ciappelletto's deathbed confession is himself corrupt.",
      correctBool: false,
      explanation: "The friar is, in Payne's translation, 'a man of very devout and good life' — the point is precisely that the confessor is sincere. Boccaccio's satire targets the epistemological gap in confession (a confessor cannot verify interior states), not the individual friar." },
  ],

  // ── Day I, Tale 3 (ch-5) — Melchizedek and the Three Rings ────────
  5: [
    { id: "dec-i-3-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "What question does Saladin ask Melchizedek that the parable of the three rings is meant to answer?",
      options: [
        "Whether Saladin may marry into the Jewish community",
        "Which of the three great religions — Jewish, Christian, Muslim — is the true one",
        "Whether Melchizedek will lend him a large sum",
        "Whether the Prophet Muhammad is to be called a saint",
      ],
      correctIndex: 1,
      explanation: "Saladin's trap is which religion is the true one. Melchizedek answers with three indistinguishable rings — one original, two copies so perfect no one can tell — and says the question of which faith holds the true original cannot be decided." },
    { id: "dec-i-3-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Which later German Enlightenment play takes the three-rings parable as its philosophical climax?",
      options: [
        "Goethe's Faust",
        "Lessing's Nathan der Weise",
        "Schiller's Wallenstein",
        "Kant's Was ist Aufklärung?",
      ],
      correctIndex: 1,
      explanation: "Lessing's *Nathan der Weise* (1779) makes the three-rings parable the play's philosophical heart. It is the foundational Enlightenment text on religious pluralism, and Lessing is explicit that he is adapting Boccaccio." },
  ],

  // ── Day IV Introduction (ch-38) — Author Intervention ─────────────
  38: [
    { id: "dec-iv-intro-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "The Introduction to Day IV is unique among the day-openings. Why?",
      options: [
        "It introduces King Filostrato and the day's theme, as every day-opening does",
        "It is spoken by Boccaccio directly, breaking the frame to defend the work against critics",
        "It is the only day-opening in verse",
        "It is told by Dioneo instead of the king",
      ],
      correctIndex: 1,
      explanation: "Uniquely in the work, the Day IV Introduction is Boccaccio himself stepping out of the frame to answer critics who had objected to the first three days. Tome renders this passage with a distinct amber 'author-voice' register to mark the shift." },
    { id: "dec-iv-intro-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "The Author's Conclusion at the end of the work is the only place where Boccaccio defends his own book.",
      correctBool: false,
      explanation: "Boccaccio defends the work twice: once in the Introduction to Day IV (mid-book, in response to early manuscript readers) and again in the Conclusion (at work's end). The two self-defenses bookend the tales and are to be read as a pair." },
  ],

  // ── Day IV, Tale 1 (ch-39) — Tancredi and Ghismonda ────────────────
  39: [
    { id: "dec-iv-1-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "In her famous speech to her father Tancredi, Ghismonda argues that nobility lies in:",
      options: ["Blood and lineage", "Virtue and character, not in birth", "Wealth and magnificence", "Political office"],
      correctIndex: 1,
      explanation: "Ghismonda's speech is one of the most eloquent defenses of natural nobility over class-based nobility in medieval European literature. She insists that Guiscardo's character, not his birth, is what makes him worthy." },
    { id: "dec-iv-1-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Which narrator tells the story of Tancredi and Ghismonda?",
      options: ["Fiammetta", "Filostrato", "Pampinea", "Dioneo"],
      correctIndex: 0,
      explanation: "Fiammetta tells IV.1. Boccaccio gives the highest-stakes tragic speech to his autobiographical figure — the woman named after a real love of his own — as her day-opening tale on the darkest day." },
  ],

  // ── Day IV, Tale 5 (ch-43) — Lisabetta and the Pot of Basil ───────
  43: [
    { id: "dec-iv-5-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "What does Lisabetta secretly place in her pot of basil after finding her murdered lover's body?",
      options: ["Her lover's letters", "Her lover's ring", "Her lover's head", "A flask of her own tears"],
      correctIndex: 2,
      explanation: "She cuts off Lorenzo's head, carries it home, and buries it in a pot of basil — which she waters with her tears and rosewater. The image is the one Keats will make central to his 1818 poem adapting the tale." },
    { id: "dec-iv-5-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Which Romantic poet adapts this tale as a long narrative poem?",
      options: ["Shelley", "Byron", "Keats", "Coleridge"],
      correctIndex: 2,
      explanation: "Keats's *Isabella; or, the Pot of Basil* (1818), fifty-three eight-line stanzas in the manner of Boccaccio himself. Keats is explicit about his source." },
  ],

  // ── Day V, Tale 9 (ch-59) — Federigo's Falcon ──────────────────────
  59: [
    { id: "dec-v-9-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Federigo, visited at last by the widow he has loved in vain, serves her:",
      options: ["A great feast of many courses", "Nothing — he has no food", "His last remaining falcon, killed and roasted", "A formal apology"],
      correctIndex: 2,
      explanation: "Having nothing else to offer a guest, Federigo kills and serves his prized falcon. Only after the meal does Monna Giovanna reveal that the falcon was what she had come to ask for — and his sacrifice is what wins her." },
    { id: "dec-v-9-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Henry James cited this tale as a model of short-form construction.",
      correctBool: true,
      explanation: "In writings including 'The Art of Fiction' and his New York Edition prefaces, James repeatedly cites the *Decameron* — and the falcon tale specifically — as an exemplar of structural economy. Many subsequent short-story theorists have followed him." },
  ],

  // ── Day VI, Tale 9 (ch-71) — Cavalcanti ────────────────────────────
  71: [
    { id: "dec-vi-9-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Where does Cavalcanti deliver his famous riposte in Elisa's tale?",
      options: [
        "At a banquet in Messer Betto's palace",
        "Among the ancient tombs beside the Baptistery of San Giovanni",
        "In the courtyard of the Palazzo Vecchio",
        "On the Ponte Vecchio",
      ],
      correctIndex: 1,
      explanation: "Cavalcanti is surprised among the tombs by a company of Florentine youths; he vaults a stone and delivers his retort — 'here among these stones, we are in our own house' — before escaping. The setting is the Baptistery precinct in Florence." },
    { id: "dec-vi-9-2", type: "multiple_choice", difficulty: "Master", xpReward: 50,
      text: "In which canto of Dante's Inferno does Cavalcanti's father, Cavalcante de' Cavalcanti, appear — in the tomb about which Dante stumbles over a verb tense and the father despairs of his son's fate?",
      options: ["Canto V", "Canto VI", "Canto IX", "Canto X"],
      correctIndex: 3,
      explanation: "Inferno X — the circle of the Epicurean heretics. Dante's scene with Cavalcante is the painful counterweight to Boccaccio's brief, alive, philosophical Guido in VI.9. The two scenes are in direct dialogue across thirty years." },
  ],

  // ── Day X, Tale 10 (ch-120) — Griselda ─────────────────────────────
  120: [
    { id: "dec-x-10-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Which narrator closes the entire work by telling the tale of Griselda?",
      options: ["Pamfilo, as king of Day X", "Fiammetta", "Pampinea, the eldest", "Dioneo, in his privileged tenth slot"],
      correctIndex: 3,
      explanation: "Dioneo tells X.10, as he tells the tenth tale of every day from Day II onward. The Decameron ends with Dioneo — and with his ambivalent coda on the tale he has just told." },
    { id: "dec-x-10-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "The Griselda tale travels into English literature via which immediate intermediary?",
      options: [
        "Chaucer translated it directly from the Decameron's Italian",
        "Petrarch's Latin translation (Historia Griseldis, 1373), which Chaucer then adapted as the Clerk's Tale",
        "An Anglo-Norman French prose version",
        "Boccaccio's own Latin self-translation",
      ],
      correctIndex: 1,
      explanation: "Petrarch was so moved by X.10 that he translated it into Latin in 1373 — his letter 'Historia Griseldis' (Seniles XVII.3). Chaucer read the Latin and adapted it as the Clerk's Tale. The English afterlife of Griselda runs through Petrarch, not directly through Boccaccio." },
    { id: "dec-x-10-3", type: "true_false", difficulty: "Master", xpReward: 50,
      text: "Dioneo, finishing the tale, signals that readers should swallow Griselda's patience as a straightforward exemplum.",
      correctBool: false,
      explanation: "Dioneo's closing remark — that the Marquis might have found his wife less docile if he had driven her from the house in her shift — deliberately undercuts the exemplum reading. The tale ends the work with productive unease, not with moral closure." },
  ],

  // ── Author's Conclusion (ch-121) ──────────────────────────────────
  121: [
    { id: "dec-concl-1", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "What is the Decameron's subtitle, and what does it mean?",
      options: [
        "*Prencipe Galeotto* — 'Prince Galehaut', the go-between of the Lancelot romance whom Dante's Francesca curses in Inferno V",
        "*Il Centonovelle* — 'The Hundred Tales'",
        "*Il Libro della Peste* — 'The Book of the Plague'",
        "*Il Libro dei Dieci* — 'The Book of the Ten'",
      ],
      correctIndex: 0,
      explanation: "*Prencipe Galeotto* / 'Prince Galahalt' in Payne. Dante's Francesca uses Galeotto as a common noun for a book-that-pimps; Boccaccio claims the damned name for his own work. This is the single sharpest piece of literary controversy in the fourteenth century." },
    { id: "dec-concl-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "In the Conclusion, Boccaccio concedes that his work is improper for ladies and repents of its bawdier tales.",
      correctBool: false,
      explanation: "The Conclusion is Boccaccio's second self-defense. He refuses to apologize, refuses to sanitize, and likens his book to a knife — a tool that can be used well or badly. He declines responsibility for bad readers." },
  ],

  // ── Master Trial (ch-123): "Member of the Brigata" Seal ───────────
  123: [
    { id: "dec-master-1", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "The ten storytellers of the brigata comprise:",
      options: ["Ten men", "Ten women", "Seven women and three men", "Five men and five women"],
      correctIndex: 2,
      explanation: "Seven women and three men — a specific ratio that encodes Boccaccio's dedication of the work to women in love." },
    { id: "dec-master-2", type: "multiple_choice", difficulty: "Apprentice", xpReward: 5,
      text: "Which city do the brigata flee, and what historical catastrophe drives the departure?",
      options: [
        "Milan; the Visconti wars",
        "Florence; the 1348 Black Death",
        "Venice; the fall of Constantinople",
        "Rome; the Avignon papacy",
      ],
      correctIndex: 1,
      explanation: "Florence; the bubonic plague pandemic of 1347–51 that killed perhaps half the city. Boccaccio was an eyewitness; his opening description of the plague is the most famous in European prose before Camus." },
    { id: "dec-master-3", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "From Day II onwards, what privilege does Dioneo claim — and keep — throughout the collection?",
      options: [
        "He is exempted from all tale-telling on free-subject days",
        "He tells the tenth and final tale of every day, and is exempt from the day's theme",
        "He is permitted to tell only tragic tales",
        "He rules the brigata for every other day",
      ],
      correctIndex: 1,
      explanation: "Dioneo's privilege is structural: tenth tale, every day, free of the day's theme. It makes him the formal virtuoso of the work — and the one who gets the last word. Griselda (X.10) is the climax of that privilege." },
    { id: "dec-master-4", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Which day has the darkest theme, and who imposes it on the company?",
      options: [
        "Day III, dictated by Neifile: desires achieved by industry",
        "Day IV, dictated by Filostrato: loves that end unhappily",
        "Day VI, dictated by Elisa: witty ripostes",
        "Day VIII, dictated by Lauretta: tricks of every kind",
      ],
      correctIndex: 1,
      explanation: "Filostrato — 'vanquished by love' — takes the crown and compels the brigata into tragedy. Day IV is the work's emotional low point and opens with Boccaccio breaking the frame to defend his own work." },
    { id: "dec-master-5", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Which of the following tales is NOT a direct source for a Shakespeare play?",
      options: [
        "II.9 — Bernabò of Genoa (source of *Cymbeline*)",
        "III.9 — Giletta of Narbonne (source of *All's Well That Ends Well*)",
        "V.9 — Federigo's falcon",
        "III.1 — Masetto of Lamporecchio",
      ],
      correctIndex: 2,
      explanation: "V.9 (Federigo's falcon) is not a Shakespeare source. II.9 and III.9 are direct sources (via Painter). III.1 (Masetto) is not a Shakespeare source either — but the question targets V.9, the most iconic non-source of the options. Shakespeare read Boccaccio; he did not rewrite the falcon tale." },
    { id: "dec-master-6", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "The Decameron's subtitle, *Prencipe Galeotto*, responds directly to which passage in Dante?",
      options: [
        "Inferno I — the dark wood",
        "Inferno V — Francesca da Rimini, who damns the Lancelot romance as 'a Galeotto'",
        "Purgatorio II — the ship of souls",
        "Paradiso XXXIII — the final vision",
      ],
      correctIndex: 1,
      explanation: "Francesca: *Galeotto fu 'l libro e chi lo scrisse*. She damns the romance that enabled her adultery. Boccaccio names his own book after Francesca's curse, claiming rather than avoiding the role of the book-that-moves-readers." },
    { id: "dec-master-7", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "The tale of Griselda (X.10) first reached English readers via which intermediary?",
      options: [
        "Caxton's 1477 English Decameron",
        "Petrarch's 1373 Latin translation, which Chaucer adapted as the Clerk's Tale",
        "William Painter's *Palace of Pleasure* (1566)",
        "A direct fifteenth-century English translation of the Decameron",
      ],
      correctIndex: 1,
      explanation: "Petrarch's Latin *Historia Griseldis* (1373) is the intermediary. Chaucer read Petrarch, not Boccaccio's Italian, and his Clerk's Tale descends from the Latin." },
    { id: "dec-master-8", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Which narrator was named by Boccaccio after a real woman he had loved and used as the addressee of several earlier works?",
      options: ["Fiammetta", "Pampinea", "Filomena", "Lauretta"],
      correctIndex: 0,
      explanation: "Fiammetta — 'little flame' — is Boccaccio's pseudonym for a woman he had loved, and the central figure of the *Elegia di Madonna Fiammetta*, the *Filocolo*, and other earlier works. She alone of the ten narrators has an existence outside the Decameron." },
    { id: "dec-master-9", type: "multiple_choice", difficulty: "Master", xpReward: 50,
      text: "Which narrator's name honors Petrarch — Boccaccio's close friend and contemporary — by alluding to Petrarch's own beloved?",
      options: ["Elisa", "Neifile", "Lauretta", "Filomena"],
      correctIndex: 2,
      explanation: "Lauretta — 'Little Laura' — is Boccaccio's homage to Petrarch, whose entire *Canzoniere* sang to a Laura. Boccaccio revered Petrarch and visited him in later life; Lauretta's presence in the brigata is a discreet literary kinship." },
    { id: "dec-master-10", type: "multiple_choice", difficulty: "Master", xpReward: 50,
      text: "The Decameron's three Muslim-world tales — I.3 (Saladin and Melchizedek), II.7 (Alatiel), and X.9 (Saladin and Torello) — share what editorial posture?",
      options: [
        "They treat the Muslim world as an exotic enemy",
        "They treat Muslim rulers and the Muslim world with notable respect, warmer than the book's ambient culture",
        "They are all comic deprecations",
        "They are all interpolations by later hands",
      ],
      correctIndex: 1,
      explanation: "Saladin is twice given the role of exemplary noble ruler; Alatiel's tale, though bawdy, treats the Mediterranean Islamic world as a continuous zone of movement rather than a hostile frontier. The warmth is deliberate and is part of the Decameron's distinctive moral weather." },
    { id: "dec-master-11", type: "multiple_choice", difficulty: "Master", xpReward: 50,
      text: "Which pair of passages bracket the tales as Boccaccio's twin self-defenses of the work?",
      options: [
        "The Proem and the Conclusion",
        "The Introduction to Day I (the plague) and the Introduction to Day IV",
        "The Introduction to Day IV and the Conclusion of the Author",
        "The Introduction to Day I and the Conclusion of the Author",
      ],
      correctIndex: 2,
      explanation: "The Decameron has two self-defenses: the mid-book Introduction to Day IV (answering early-manuscript critics) and the Conclusion of the Author (answering critics of the completed work). Together they are the founding document of the Renaissance defense of secular literature." },
    { id: "dec-master-12", type: "multiple_choice", difficulty: "Master", xpReward: 50,
      text: "What is the essential editorial argument of the Decameron, stated in the Proem and re-stated in the Conclusion?",
      options: [
        "That secular stories are trivial and should be read only for amusement",
        "That literature can be a survival skill — specifically, a consolation for women whose sorrow has no other outlet — and that a book may rightfully claim, not shun, the role of go-between",
        "That storytelling is a moral duty to God",
        "That the Italian vernacular is inferior to Latin",
      ],
      correctIndex: 1,
      explanation: "The Proem announces the work as a consolation for lovesick ladies; the Conclusion's final line names the book *Prince Galahalt*, claiming the very role Dante damned. Between the two bookends, the hundred tales are the evidence that literature is a survival skill — written in the shadow of the plague, offered as a way of continuing to be alive." },
  ],
}
