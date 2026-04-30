/**
 * Trial bank — Marcus Aurelius, Meditations, Books I–III.
 *
 * In `src/data/chapters.ts` Book I sits at index 0, Book II at index 1, and
 * Book III at index 2. Citations follow the conventional book.section
 * numbering used in the Loeb / Hays / Long traditions.
 */

import type { ChapterQuestion } from "@/lib/chapter-questions"

// ─────────────────────────────────────────────────────────────────────────────
// Book I — Debts and Lessons
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_I: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "med-bk1-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What does Book I of the Meditations consist of?",
    options: [
      "A theory of the soul",
      "A series of acknowledgements of what Marcus learned from family members and teachers",
      "A guide to managing slaves and servants",
      "A treatise against the Christians",
    ],
    correctIndex: 1,
    explanation:
      "Book I is unique in the Meditations: it is a sustained inventory of debts — to his grandfather Verus, to his mother, to his tutors, to his predecessor Antoninus Pius. The book is sometimes called “The Debts.”",
    citation: "Meditations I.1–I.17",
  },
  {
    id: "med-bk1-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What does Marcus say he learned from his grandfather Verus?",
    options: [
      "Endurance under hardship",
      "Good morals and the government of his temper",
      "The art of generalship",
      "A taste for poetry",
    ],
    correctIndex: 1,
    explanation:
      "Marcus opens with the debt to his grandfather: ta kala ēthē kai aorgēsia — fine character and freedom from anger. The first sentence sets the moral focus of the entire book.",
    citation: "Meditations I.1",
  },
  {
    id: "med-bk1-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Marcus thanks his adoptive father ____ Pius for showing him a public man free of vanity, regular in habit, and gentle in private.",
    correctText: "Antoninus",
    explanation:
      "The long catalogue of Antoninus’s virtues in I.16 is the centrepiece of Book I — Marcus’s nearest model and, by the time he writes, an explicit imitatio Antonini.",
    citation: "Meditations I.16",
  },
  {
    id: "med-bk1-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "He thanks this teacher for the idea that one should commit one’s thoughts to writing.",
    identificationSubject: "speaker",
    options: ["Diognetus", "Rusticus", "Apollonius", "Maximus"],
    correctIndex: 1,
    explanation:
      "Junius Rusticus, the Stoic, is credited with introducing Marcus to Epictetus’s Discourses and with the practice of writing as moral discipline. The Meditations themselves are the visible legacy of that lesson.",
    citation: "Meditations I.7",
  },
  {
    id: "med-bk1-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Marcus thanks the gods first in Book I, before any human teacher.",
    correctBool: false,
    tfReasons: [
      "He thanks his grandfather and parents first; the long thanksgiving to the gods is the closing chapter, I.17.",
      "He thanks the gods first and his teachers afterwards.",
      "He never thanks the gods explicitly.",
      "He thanks only the gods, never any human teacher.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Book I’s structure is human ascent: family, then teachers, then his adoptive father, and only at the end the gods themselves — for parents, for siblings, for his wife, for his philosophy.",
    citation: "Meditations I.17",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "med-bk1-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Why does Marcus credit his brother Severus with “the conception of a state administered with regard to equal rights and equal freedom of speech”?",
    options: [
      "Because Severus served as proconsul under Trajan",
      "Because Severus introduced him to a circle of philosophical friends — Thrasea, Helvidius, Cato, Brutus — who held to ideals of constitutional liberty",
      "Because Severus authored a treatise on the Republic",
      "Because Severus served as Marcus’s tutor in early childhood",
    ],
    correctIndex: 1,
    explanation:
      "I.14 names the ideal: a polity ordered by isonomia and isēgoria. The credit is mediated — Severus introduced Marcus to the Stoic-republican exemplars whose memory shaped his own practice.",
    citation: "Meditations I.14",
  },
  {
    id: "med-bk1-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Marcus closes Book I with thanks to the gods. Which of the following does he NOT include in that catalogue?",
    options: [
      "That his children were neither stupid nor deformed in body",
      "That he did not advance further in rhetoric, poetry, and other studies, which might have absorbed him",
      "That he was preserved from a prolonged passion for a young companion",
      "That he found himself a victorious general in early life",
    ],
    correctIndex: 3,
    explanation:
      "The thanksgiving in I.17 is for restraints rather than triumphs: gentleness in family, freedom from intellectual vanity, sexual self-control. Military victories do not appear in the catalogue at all.",
    citation: "Meditations I.17",
  },
  {
    id: "med-bk1-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "From Diognetus, Marcus learned not to busy himself about ____ things — quail-fights, contests of jugglers, and the like.",
    correctText: "trifling",
    acceptedVariants: ["trivial", "vain"],
    explanation:
      "I.6 sets a Stoic note: not to take seriously the entertainments that absorb the mass of men. The phrasing — ta mē proshēkonta — is the Stoic vocabulary of what is and is not “our own.”",
    citation: "Meditations I.6",
  },
  {
    id: "med-bk1-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "He learned from this teacher to read carefully, and not to be content with a general impression of the whole.",
    identificationSubject: "speaker",
    options: ["Alexander the Grammarian", "Sextus", "Fronto", "Catulus"],
    correctIndex: 0,
    explanation:
      "Alexander the Grammarian — I.10 — taught the discipline of close reading. The chapter is small but pointed: a Stoic ethical attitude toward language as well as toward action.",
    citation: "Meditations I.10",
  },
  {
    id: "med-bk1-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each teacher named in Book I to the lesson Marcus credits to him.",
    matchingLeft: ["Rusticus", "Apollonius", "Sextus", "Maximus"],
    matchingRight: [
      "The acquaintance with Epictetus’s Discourses",
      "Steadfastness, freedom of choice without alternative",
      "A benevolent disposition and the absence of sourness",
      "Self-government, cheerfulness in all circumstances",
    ],
    correctPairs: {
      Rusticus: "The acquaintance with Epictetus’s Discourses",
      Apollonius: "Steadfastness, freedom of choice without alternative",
      Sextus: "A benevolent disposition and the absence of sourness",
      Maximus: "Self-government, cheerfulness in all circumstances",
    },
    explanation:
      "Marcus’s acknowledgements are Stoic in form: each teacher contributes a particular attitude or habit, building up the moral character whose final shape is the Antoninus described in I.16.",
    citation: "Meditations I.7–I.15",
  },
  {
    id: "med-bk1-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Book I is generally taken to have been composed first among the books of the Meditations.",
    correctBool: false,
    tfReasons: [
      "Most scholars take Book I to have been written late and prefixed as a kind of preface; the manuscript ordering need not follow the order of composition.",
      "Book I is the earliest of the books and was certainly written first.",
      "Book I was added by an editor after Marcus’s death.",
      "Book I is a forgery from the third century.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Most editors place Book I as a retrospective preface — composed late, set first. The catalogue tone and external orientation distinguish it sharply from the inward notes of Books II onward.",
    citation: "Meditations I",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "med-bk1-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why does Marcus credit Antoninus, in I.16, with “to be willing to listen to those who had anything to propose for the common weal”?",
    options: [
      "Because Antoninus enacted a major legal reform",
      "Because the chapter is a sustained portrait of the kind of practical, accessible, just ruler Marcus wishes to imitate",
      "Because Antoninus was the only emperor to consult the Senate weekly",
      "Because Marcus considered Antoninus a Stoic philosopher in print",
    ],
    correctIndex: 1,
    explanation:
      "I.16 is a programmatic sketch of the model emperor — patient, regular, free of vanity, governed by reason. Marcus is not writing biography; he is writing a portrait he means to live up to.",
    citation: "Meditations I.16",
  },
  {
    id: "med-bk1-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Which of the following best describes the function of Book I within the Meditations as a whole?",
    options: [
      "A late preface that gathers the influences shaping the moral self the rest of the work seeks to maintain",
      "A continuation of Book XII",
      "A theoretical defence of Stoic logic",
      "A polemic against Epicureanism",
    ],
    correctIndex: 0,
    explanation:
      "The book reads as a deliberate exercise in gratitude — acknowledging the human and divine sources of the self that the inward books then patiently re-form. The structure is Stoic askesis put on a page.",
    citation: "Meditations I",
  },
  {
    id: "med-bk1-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "The Meditations were written in ____, not in Latin — a deliberate choice for the language of Stoic philosophy.",
    correctText: "Greek",
    acceptedVariants: ["koine greek", "ancient greek"],
    explanation:
      "Marcus writes in koine Greek, the lingua franca of Mediterranean philosophy and the language of Epictetus, his greatest teacher. The choice itself is part of the work’s philosophical seriousness.",
    citation: "Manuscript title: Ta eis heauton",
  },
  {
    id: "med-bk1-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“To his children, Marcus thanks the gods that they were not stupid, nor deformed in body.”",
    identificationSubject: "book",
    options: ["The Discourses of Epictetus", "Seneca’s Letters", "Marcus Aurelius’s Meditations", "Plutarch’s Moralia"],
    correctIndex: 2,
    explanation:
      "I.17’s thanksgiving has a startling intimacy: a man cataloguing the small mercies of his life. The line places the Meditations unmistakably.",
    citation: "Meditations I.17",
  },
  {
    id: "med-bk1-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The Meditations were originally addressed to Marcus’s son Commodus.",
    correctBool: false,
    tfReasons: [
      "The work’s manuscript title is Ta eis heauton — “to himself” — and there is no internal sign that any addressee but the writer was envisaged.",
      "It was a public letter to Commodus, intended for instruction.",
      "It was sent to the Senate as policy.",
      "It was dictated as advice to Galen.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The conversational tone, the second-person address, and the manuscript title all point to a private register. Survival itself is partly accidental.",
    citation: "Manuscript title: Ta eis heauton",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Book II — Carnuntum
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_II: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "med-bk2-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "How does Marcus open Book II?",
    options: [
      "“The universe is change.”",
      "“Begin the morning by saying to thyself: today I shall meet with the busybody, the ungrateful, arrogant, deceitful, envious, unsocial.”",
      "“Death is nothing to us.”",
      "“Time is a river of passing events.”",
    ],
    correctIndex: 1,
    explanation:
      "II.1’s morning exercise is the most famous opening of any book of the Meditations. Marcus prepares himself in advance for the irritations of the day so that they cannot disturb the soul that holds to its own.",
    citation: "Meditations II.1",
  },
  {
    id: "med-bk2-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Where does the manuscript record Book II as being written?",
    options: ["Rome", "Carnuntum, on the Danube frontier", "Capri", "Athens"],
    correctIndex: 1,
    explanation:
      "Book II carries the headnote “Among the Quadi at the Granua,” and Book III “At Carnuntum.” The works were composed during the Marcomannic Wars on the northern frontier, not in any villa or city.",
    citation: "Meditations II (headnote)",
  },
  {
    id: "med-bk2-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“Throw away thy books; no longer distract thyself: it is not allowed.” He continues: live as if you might leave life this very ____.",
    correctText: "moment",
    acceptedVariants: ["instant", "hour"],
    explanation:
      "II.5 is the sharpest formulation of the Stoic memento mori: act each act as the last act of your life. The injunction frames the rest of the book.",
    citation: "Meditations II.5",
  },
  {
    id: "med-bk2-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“Time is a river of passing events, and strong is its current; no sooner is a thing brought to sight than it is swept by and another takes its place, and this too will be swept away.”",
    identificationSubject: "book",
    options: ["Heraclitus, Fragments", "Epictetus, Discourses", "Marcus Aurelius, Meditations", "Seneca, Letters"],
    correctIndex: 2,
    explanation:
      "II.17. The metaphor is Heraclitean in origin, but the form here is Marcus’s own — among the most-quoted lines of the work.",
    citation: "Meditations II.17",
  },
  {
    id: "med-bk2-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Marcus says the people he will meet in the morning will not be able to harm him.",
    correctBool: true,
    tfReasons: [
      "He says they cannot harm him because no one can do him real harm or implicate him in ugliness — only his own choices can.",
      "He says they will harm him and there is nothing to be done.",
      "He says he can avoid them by avoiding the city.",
      "He claims they have power over his soul.",
    ],
    tfCorrectReason: 0,
    explanation:
      "II.1 sets the Stoic core: no one can harm me but myself. The morning meditation turns into the discipline of holding fast to that conviction across the day’s irritations.",
    citation: "Meditations II.1",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "med-bk2-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What does Marcus say in II.1 about the kinship between the speaker and those he is about to meet?",
    options: [
      "That they share nothing in common with him",
      "That they all share in mind and a portion of the divine, so anger or rejection of them is, at root, anger at one’s own kin",
      "That they are kin only by chance of empire",
      "That they are kin only in body",
    ],
    correctIndex: 1,
    explanation:
      "II.1 grounds the morning exercise in physis: all rational beings share in nous, and so are by nature kin. To work with one another is the single thing one cannot rationally refuse.",
    citation: "Meditations II.1",
  },
  {
    id: "med-bk2-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What division of human powers does II.2 use to remind Marcus that what is essentially him is the rational part?",
    options: [
      "Body, breath, and ruling reason",
      "Senses, memory, and will",
      "Soul, body, and shadow",
      "Reason and the four humours",
    ],
    correctIndex: 0,
    explanation:
      "II.2 uses Marcus’s favourite tripartite scheme: sōmation (a little body), pneumation (a little breath), and to hēgemonikon (the ruling part). Only the third is properly oneself.",
    citation: "Meditations II.2",
  },
  {
    id: "med-bk2-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Marcus quotes a maxim he attributes to Plato: that even if you were to live three thousand years or thirty thousand, you would lose only the present, since no one ____ what they have not got.",
    correctText: "loses",
    acceptedVariants: ["loses what they have", "can lose"],
    explanation:
      "II.14 — the famous reflection on death. The same span of life is taken from each, since each only has the present to lose. The “three thousand years” formulation appears repeatedly across the Meditations.",
    citation: "Meditations II.14",
  },
  {
    id: "med-bk2-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“The longest-lived and the shortest-lived have an equal loss; for it is only the present moment that any can be deprived of, since this only he has.”",
    identificationSubject: "book",
    options: ["Seneca, On the Shortness of Life", "Marcus Aurelius, Meditations", "Epictetus, Enchiridion", "Plato, Phaedo"],
    correctIndex: 1,
    explanation:
      "Meditations II.14. Versions of this thought run through the whole work; in II.14 it is at its most compressed.",
    citation: "Meditations II.14",
  },
  {
    id: "med-bk2-sch-order-1",
    type: "ordering",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Order these moves of thought in the opening of Book II.",
    options: [
      "Prepare for the day’s difficult people in advance",
      "Recall the kinship of all rational beings",
      "Distinguish body, breath, and the ruling part as what is essentially oneself",
      "Live each act as if it were the last act of life",
    ],
    correctOrder: [
      "Prepare for the day’s difficult people in advance",
      "Recall the kinship of all rational beings",
      "Distinguish body, breath, and the ruling part as what is essentially oneself",
      "Live each act as if it were the last act of life",
    ],
    explanation:
      "Book II builds out as a Stoic morning practice: anticipate, refer to nature, locate the self, then act. The order is II.1 → II.2 → II.5.",
    citation: "Meditations II.1–II.5",
  },
  {
    id: "med-bk2-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Marcus’s morning meditation in II.1 is unique to him and has no clear precedent in earlier Stoicism.",
    correctBool: false,
    tfReasons: [
      "The praemeditatio futurorum malorum — anticipation of difficulties — is a Stoic exercise developed by earlier philosophers and visible already in Seneca and Epictetus.",
      "It is wholly original to Marcus.",
      "It is borrowed from Epicurean sources.",
      "It is borrowed from the Platonic dialogues.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Premeditation of evils — rehearsing in advance what may go wrong, in order to disarm it — is a standard Stoic practice. Marcus’s contribution is its compactness and the attention to other people specifically as the day’s test.",
    citation: "Meditations II.1; cf. Seneca, Epist. 24, 91",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "med-bk2-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What does Marcus mean in II.4 by saying you may at any moment leave life and arrange every act and thought accordingly?",
    options: [
      "He is recommending suicide as a routine option",
      "He is recommending the consciousness of death as a constraint that purifies present action",
      "He is exhorting his men to fight bravely",
      "He is forbidding any thought of death",
    ],
    correctIndex: 1,
    explanation:
      "II.4 is the explicit Stoic memento mori: not despair, not detachment, but the acknowledgement that mortality is a clarifying frame on what to do now. Pierre Hadot’s reading of the Meditations as “spiritual exercises” turns on passages of this kind.",
    citation: "Meditations II.4",
  },
  {
    id: "med-bk2-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why is II.17 — the meditation that ends the book — sometimes read as the manifesto of the whole work?",
    options: [
      "Because it lists the topics of every later book",
      "Because it compresses the work’s entire claim — life is short, the universe is in flux, fame perishes, only philosophy can guide a person through the day with dignity",
      "Because it names Epictetus directly",
      "Because it ends with a prayer to Mithras",
    ],
    correctIndex: 1,
    explanation:
      "II.17 is the closest the Meditations come to a programmatic statement: brevity, flux, the perishing of fame, and philosophy as the one thing that can keep a man “unwearied, calm, and undeceived” among them.",
    citation: "Meditations II.17",
  },
  {
    id: "med-bk2-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "Of the soul’s constituent parts, the one that is properly oneself, Marcus says, is the ____ — the ruling part of the soul.",
    correctText: "hegemonikon",
    acceptedVariants: ["hēgemonikon", "ruling part", "ruling reason"],
    explanation:
      "Hēgemonikon — the technical Stoic term for the directive faculty. To hold to the hēgemonikon and let body and breath fall away from one’s identification with self is the ascesis the Meditations enacts.",
    citation: "Meditations II.2",
  },
  {
    id: "med-bk2-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“What then can guide a man? One thing, and only one — philosophy.”",
    identificationSubject: "speaker",
    options: ["Epictetus", "Marcus Aurelius", "Cicero", "Plato"],
    correctIndex: 1,
    explanation:
      "II.17, in close to its concluding gesture. The line is unmistakably Marcus’s: not philosophy as system but philosophy as the practice that holds the soul together amid the flux.",
    citation: "Meditations II.17",
  },
  {
    id: "med-bk2-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The headnotes of Books II and III locate them at imperial residences in Italy.",
    correctBool: false,
    tfReasons: [
      "The headnotes locate Book II among the Quadi on the Granua and Book III at Carnuntum — both on the northern military frontier.",
      "The headnotes locate them in Rome and Capri.",
      "The headnotes locate them in Athens and Delphi.",
      "The headnotes are missing from all manuscripts.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The frontier setting is part of how the work means: a Stoic emperor writing in Greek, on campaign, between councils of war. The peace of mind the books rehearse is a peace fashioned in the field.",
    citation: "Meditations II–III headnotes",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Book III — At Carnuntum
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_III: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "med-bk3-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What does Marcus tell himself in III.1 he must hurry, since he is mortal?",
    options: [
      "To finish his works of philosophy",
      "Not only to be near death every day, but because the powers of mind may fail before death — so the labour of becoming good cannot be deferred",
      "To complete the campaign on the Danube",
      "To name his successor",
    ],
    correctIndex: 1,
    explanation:
      "III.1 widens the Stoic memento mori: the worry is not just that life ends but that the rational powers may fail before life does. The self-discipline is therefore present-tense and unrelenting.",
    citation: "Meditations III.1",
  },
  {
    id: "med-bk3-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What attitude does Marcus recommend in III.4 toward what others say of him?",
    options: [
      "Constant attention to it",
      "Attention only when it is praise",
      "Indifference: spend no time on what others’ ruling parts produce, except where the common interest demands",
      "Vigilant suspicion in all cases",
    ],
    correctIndex: 2,
    explanation:
      "III.4 is the Stoic discipline of attention: do not waste yourself on what is in the souls of others except where doing so serves the common good.",
    citation: "Meditations III.4",
  },
  {
    id: "med-bk3-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Marcus reminds himself that even small things — the cracks in a baking loaf, the figs at full ripeness — are themselves ____.",
    correctText: "beautiful",
    acceptedVariants: ["pleasing", "lovely"],
    explanation:
      "III.2 — the meditation on the incidental beauty in nature: the side-effects of natural processes (the cracks in bread, the gape of figs) themselves possess charm to a properly trained eye.",
    citation: "Meditations III.2",
  },
  {
    id: "med-bk3-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“No longer talk at all about the kind of man that a good man ought to be, but be such.”",
    identificationSubject: "book",
    options: ["Seneca, Letters", "Epictetus, Enchiridion", "Marcus Aurelius, Meditations", "Plutarch, Moralia"],
    correctIndex: 2,
    explanation:
      "Book X.16 is the sharper double of this lesson; III enforces the same principle. The Meditations are full of these short imperatives, addressed by Marcus to himself.",
    citation: "Meditations X.16; cf. III.4",
  },
  {
    id: "med-bk3-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "In Book III, Marcus says one should expect anything good from anyone but oneself.",
    correctBool: false,
    tfReasons: [
      "He repeatedly insists that the source of one’s own goodness is interior — not the praise, attention, or assistance of others.",
      "He says only friends can supply true virtue.",
      "He says philosophers must rely on the state.",
      "He says virtue is an external gift.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The Stoic dichotomy of control: the only good in one’s power is one’s own assent and action. III.4–III.7 elaborate the idea in different forms.",
    citation: "Meditations III.4–III.7",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "med-bk3-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Why does Marcus say in III.7 that nothing should be esteemed which would force one to break faith, lose honour, or hate, suspect, curse, dissemble, or desire anything that needs walls and curtains?",
    options: [
      "Because he is afraid of the gods’ punishment",
      "Because such goods compel acts incompatible with what reason and the social nature have already chosen as one’s highest good",
      "Because Antoninus told him so",
      "Because the senate had passed such a law",
    ],
    correctIndex: 1,
    explanation:
      "III.7 turns Stoic axiology into practical politics: any external “good” that costs you the inward goods is, by definition, not a good. The list — wall-and-curtain desires especially — is sharper for being so concrete.",
    citation: "Meditations III.7",
  },
  {
    id: "med-bk3-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "How does Marcus describe the right life in III.5?",
    options: [
      "As a life of absolute solitude",
      "Like a Roman and a man, doing what is at hand with perfect and simple dignity, affection, freedom, and justice — and easing oneself of all other thoughts",
      "As a life of constant ritual",
      "As a life of luxury, properly understood",
    ],
    correctIndex: 1,
    explanation:
      "III.5 sets the formula for action: the four virtues — practical wisdom, justice, fortitude, temperance — applied to the present task with no surplus. The phrase “like a Roman and a man” gives the Meditations’ characteristic civic-Stoic tone.",
    citation: "Meditations III.5",
  },
  {
    id: "med-bk3-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“Thou hast embarked, thou hast made the voyage, thou art come to ____.”",
    correctText: "shore",
    acceptedVariants: ["the shore", "harbour", "harbor"],
    explanation:
      "III.3 — the reflection on the deaths of others: Hippocrates and Alexander, Pythagoras and Heraclitus, all alike now nothing. The closing image makes the journey of life a sea-passage and death the harbour.",
    citation: "Meditations III.3",
  },
  {
    id: "med-bk3-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“Reverence the gods, and help men. Short is life: there is only this one fruit of earthly existence — a pious disposition and social acts.”",
    identificationSubject: "speaker",
    options: ["Marcus Aurelius", "Epictetus", "Seneca", "Cleanthes"],
    correctIndex: 0,
    explanation:
      "The kernel of III.7 (and of much of the Meditations): piety and social acts as the only durable goods. The line could stand as a one-sentence summary of Marcus’s practical ethics.",
    citation: "Meditations III.7",
  },
  {
    id: "med-bk3-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each section of Book III to the move it makes.",
    matchingLeft: ["III.1", "III.2", "III.4", "III.7"],
    matchingRight: [
      "Hurry, since reason itself may fail before death",
      "Even the by-products of natural processes have their own beauty",
      "Do not spend your time on what others’ ruling parts produce",
      "Esteem nothing that requires breaking faith or wall-and-curtain desires",
    ],
    correctPairs: {
      "III.1": "Hurry, since reason itself may fail before death",
      "III.2": "Even the by-products of natural processes have their own beauty",
      "III.4": "Do not spend your time on what others’ ruling parts produce",
      "III.7": "Esteem nothing that requires breaking faith or wall-and-curtain desires",
    },
    explanation:
      "The book moves from inward urgency to natural piety to social discipline to a practical axiology. It is a small but unusually coherent stretch of the Meditations.",
    citation: "Meditations III",
  },
  {
    id: "med-bk3-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "In III.2, Marcus is making an aesthetic case for the natural world rather than a moral one.",
    correctBool: false,
    tfReasons: [
      "The aesthetic eye in III.2 is in fact an instrument of moral training — to see the cracks in the loaf as beautiful is to take up a particular relation to nature as a whole.",
      "It is a purely aesthetic passage with no moral content.",
      "It is a private aside, not connected with the rest of the book.",
      "It is a quotation from another author with no original argument.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The “aesthetic” here is Stoic: a mode of attention to the world as a single rational order. The trained eye is part of the morally formed self.",
    citation: "Meditations III.2",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "med-bk3-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "How does Marcus’s figure of philosophy in III.5 differ from Cicero’s celebrated personification?",
    options: [
      "Marcus has no figure of philosophy at all",
      "Marcus’s philosophy is severe and intimate — a doctor, not an orator — and is addressed to himself in the second person rather than declaimed",
      "Marcus’s philosophy is identical to Cicero’s",
      "Marcus’s philosophy is a goddess crowned with stars",
    ],
    correctIndex: 1,
    explanation:
      "Where Cicero personifies Philosophy as a public figure (Tusc. V.5), Marcus’s philosophy is more like an inner discipline addressed in the imperative. The difference is genre as much as doctrine.",
    citation: "Meditations III.5; cf. Cicero, Tusc. V.5",
  },
  {
    id: "med-bk3-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What argument does III.16 advance about the soul?",
    options: [
      "That the soul is wholly material",
      "That a soul which lets itself be affected by what is not its own — pains, fears, opinions — is at once a soul running counter to nature, since nothing in nature can be harmed by what is not itself",
      "That the soul perishes with the body",
      "That souls migrate to other beings",
    ],
    correctIndex: 1,
    explanation:
      "III.16 closes the book by arguing that a properly self-possessed soul — one that uses the discipline of impressions to refuse the assent of the bad — is acting in accordance with universal nature. The argument is the moral pivot of the book.",
    citation: "Meditations III.16",
  },
  {
    id: "med-bk3-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "“Look beneath the surface,” Marcus tells himself; let neither the proper quality of any thing nor its ____ escape thee.",
    correctText: "value",
    acceptedVariants: ["worth", "merit"],
    explanation:
      "III.11 — the discipline of inspection. The trained eye refuses what is conventional and seeks the actual nature of each thing. The whole of the Meditations’ epistemology is implicit here.",
    citation: "Meditations III.11",
  },
  {
    id: "med-bk3-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“He moves through life looking after no man’s applause; he is content with little; he is just; he is genial; he is firm.”",
    identificationSubject: "speaker",
    options: ["Marcus’s portrait of the philosopher", "Marcus’s portrait of Antoninus Pius", "Marcus’s portrait of his Stoic teacher", "Marcus’s portrait of the ideal soldier"],
    correctIndex: 0,
    explanation:
      "The portrait of the philosopher in III.4–III.5 is, by deliberate design, a portrait Marcus can read as if from outside and aim at as if from inside. III.16 closes the book by glossing the same figure as the soul that is in agreement with universal nature.",
    citation: "Meditations III.4–III.5, III.16",
  },
  {
    id: "med-bk3-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Books II and III, written on the Danube frontier, mark the practical core of the Meditations because they apply Stoic doctrine to the conditions of campaign life and command.",
    correctBool: true,
    tfReasons: [
      "The frontier headnotes situate the inward exercise on the ground where command, fatigue, and mortality are most pressing — the works are not contemplative leisure but a discipline of office.",
      "They are simply philosophical exercises with no relation to Marcus’s circumstances.",
      "They are extracts copied from earlier Stoic textbooks.",
      "They were composed in retirement at Capri.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Reading Books II and III as written from the front gives them their full weight: this is Stoic ethics tested under campaign pressure by the man whose office most directly invites the corruptions ethics is meant to refuse.",
    citation: "Meditations II–III headnotes",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export const MEDITATIONS_I_III_TRIALS: Record<number, ChapterQuestion[]> = {
  0: BOOK_I,
  1: BOOK_II,
  2: BOOK_III,
}
