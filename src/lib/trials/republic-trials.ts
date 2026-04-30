/**
 * Trial bank — Plato’s Republic.
 *
 * In `src/data/chapters.ts` the Republic is stored as a single chapter
 * (index 0) spanning the whole work. The trial bank here therefore covers
 * the canonical landmarks of Books I–X — Cephalus, Thrasymachus, Glaucon’s
 * challenge, the analogy of the city and the soul, the Sun, the Line, and
 * the Cave — and is keyed to chapter index 0.
 */

import type { ChapterQuestion } from "@/lib/chapter-questions"

const REPUBLIC: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "republic-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "In whose house and city does the conversation of the Republic take place?",
    options: [
      "Socrates’s house in Athens",
      "Cephalus’s house in the Piraeus",
      "Glaucon’s house in Athens",
      "The Academy",
    ],
    correctIndex: 1,
    explanation:
      "Socrates says he had gone down to the Piraeus with Glaucon to see the festival of Bendis. They are detained by Polemarchus and end up at the house of his father Cephalus, where the dialogue begins.",
    citation: "Republic 327a–328c",
  },
  {
    id: "republic-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "The famous definition of justice as “the advantage of the stronger” is offered by which speaker?",
    options: ["Cephalus", "Polemarchus", "Thrasymachus", "Glaucon"],
    correctIndex: 2,
    explanation:
      "Thrasymachus bursts into the conversation in Book I and defines the just as nothing other than the advantage of the established power. Socrates spends the rest of Book I — and, in a sense, the rest of the dialogue — answering him.",
    citation: "Republic 338c",
  },
  {
    id: "republic-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "The Republic begins, in Greek, with the verb κατέβην — “I went ____.”",
    correctText: "down",
    explanation:
      "Katebēn — “I went down” — is the famous first word, naming a literal descent to the Piraeus and prefiguring later descents in the dialogue (the Cave, the myth of Er).",
    citation: "Republic 327a",
  },
  {
    id: "republic-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "An old man, content in his old age because his appetites have quieted; he hands the conversation off to his son and goes to attend to his sacrifices.",
    identificationSubject: "character",
    options: ["Cephalus", "Thrasymachus", "Glaucon", "Polemarchus"],
    correctIndex: 0,
    explanation:
      "Cephalus opens the dialogue with the celebrated remark — borrowed from Sophocles — that old age has freed him from the tyranny of desire. He withdraws to the sacrifices, leaving Polemarchus to inherit the argument.",
    citation: "Republic 328c–331d",
  },
  {
    id: "republic-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "The Republic argues that justice is to be valued only for the rewards and reputation it brings.",
    correctBool: false,
    tfReasons: [
      "Glaucon explicitly challenges Socrates to defend justice as good in itself, regardless of consequences — and Socrates spends the rest of the dialogue doing so.",
      "Yes — Socrates concedes that justice has only instrumental value.",
      "Justice is valued only as a means of avoiding punishment.",
      "Plato considers reputation the only motive worth discussing.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Glaucon’s task in Book II is to make the strongest case for injustice and demand that Socrates defend justice as intrinsically valuable. The argumentative shape of the entire dialogue is the response to that demand.",
    citation: "Republic 357a–367e",
  },
  {
    id: "republic-app-order-1",
    type: "ordering",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Order these famous moments of the Republic.",
    options: [
      "Cephalus on old age",
      "Thrasymachus’s definition of justice",
      "Glaucon and Adeimantus reissue the challenge in Book II",
      "The allegory of the Cave",
    ],
    correctOrder: [
      "Cephalus on old age",
      "Thrasymachus’s definition of justice",
      "Glaucon and Adeimantus reissue the challenge in Book II",
      "The allegory of the Cave",
    ],
    explanation:
      "Books I–II open with Cephalus, then escalate through Thrasymachus to Glaucon’s and Adeimantus’s formal challenge. The Cave appears in Book VII, late in the dialogue’s arc.",
    citation: "Republic I–VII",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "republic-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "In Book II, why does Glaucon retell the story of the Ring of Gyges?",
    options: [
      "To prove that the gods exist",
      "To argue that, given the power to act unseen, no one would remain just for justice’s own sake",
      "To illustrate the Athenian legal code",
      "To show that the just always prosper",
    ],
    correctIndex: 1,
    explanation:
      "The ring grants invisibility. Glaucon’s thought-experiment is that even a “just” man, given that power, would behave like an unjust one — so the appearance of justice, not its substance, must be all that anyone really values. Socrates must show this is wrong.",
    citation: "Republic 359d–360d",
  },
  {
    id: "republic-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What method does Socrates propose for finding justice in the soul, in Book II?",
    options: [
      "By reading the laws of Athens",
      "By looking first at justice in a city, written large, and then back at the soul",
      "By interrogating the priests at Delphi",
      "By analysing the speeches of the poets",
    ],
    correctIndex: 1,
    explanation:
      "Justice in a city, Socrates says, will be easier to read than justice in the soul because the city is bigger. The whole construction of the kallipolis through Books II–IV is a magnification meant to be read back into the soul.",
    citation: "Republic 368e–369a",
  },
  {
    id: "republic-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "The three classes of the city in the Republic are the producers, the guardians (or auxiliaries), and the ____.",
    correctText: "philosopher-kings",
    acceptedVariants: ["philosopher kings", "rulers", "guardians proper", "philosophers"],
    explanation:
      "The tripartite city has producers (artisans and farmers), auxiliaries (warriors), and a smaller ruling class drawn from the guardians, who, by Books V–VII, must be philosophers. The structure mirrors the soul’s three parts.",
    citation: "Republic 412b–417b, 473c–e",
  },
  {
    id: "republic-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "The three parts of the soul, named in Book IV, are the rational (logistikon), the spirited (thumoeides), and the ____.",
    identificationSubject: "character",
    options: ["honour-loving", "appetitive", "imitative", "law-loving"],
    correctIndex: 1,
    explanation:
      "Epithymētikon — the appetitive part — completes the trio. Each corresponds to a class in the city: rulers, auxiliaries, and producers. Justice in the soul is each part doing its own task and not encroaching on the others.",
    citation: "Republic 435c–441c",
  },
  {
    id: "republic-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each part of the city to its corresponding part of the soul.",
    matchingLeft: ["Rulers (philosopher-kings)", "Auxiliaries (warriors)", "Producers (artisans, farmers)"],
    matchingRight: ["Rational part", "Spirited part", "Appetitive part"],
    correctPairs: {
      "Rulers (philosopher-kings)": "Rational part",
      "Auxiliaries (warriors)": "Spirited part",
      "Producers (artisans, farmers)": "Appetitive part",
    },
    explanation:
      "The city–soul analogy makes each class the externalisation of a soul-part. Justice is the same in both: each part doing its own work in harmony, with the rational part ruling.",
    citation: "Republic IV",
  },
  {
    id: "republic-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Plato’s ideal city excludes the dramatic poets entirely from its educational programme.",
    correctBool: false,
    tfReasons: [
      "Imitative poetry is heavily restricted, but hymns to the gods and praises of good men are admitted; the worry is mimesis of the bad, not poetry as such.",
      "All poetry is admitted without restriction.",
      "Poetry is replaced entirely by mathematics.",
      "Only Homer is admitted, on the grounds of antiquity.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Books III and X exclude imitative poetry that would corrupt character. Hymns and encomia of virtue are kept. The position is more nuanced than the slogan “Plato banished the poets.”",
    citation: "Republic 387a–398b, 595a–608b",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "republic-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "In the Allegory of the Cave, what does the sun outside the cave represent?",
    options: [
      "The Form of the Good",
      "The Athenian polis",
      "The myth of Er",
      "The body, as opposed to the soul",
    ],
    correctIndex: 0,
    explanation:
      "The Sun is the analogue of the Good — the source both of being and of intelligibility, just as the sun is the source both of growth and of visibility. The Cave dramatises the soul’s ascent toward it.",
    citation: "Republic 514a–517c, 508a–509c",
  },
  {
    id: "republic-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What is the divided line, introduced at the end of Book VI?",
    options: [
      "A diagram dividing the political constitutions of Greece",
      "A diagram of four cognitive states across two ontological levels — images, sensible things, mathematical objects, and Forms",
      "A myth of the soul’s descent into Hades",
      "A guide to the four cardinal virtues",
    ],
    correctIndex: 1,
    explanation:
      "The Line is divided once into the visible and the intelligible, then again, yielding four states (eikasia, pistis, dianoia, noēsis) running from images of sensible things up to direct apprehension of the Forms.",
    citation: "Republic 509d–511e",
  },
  {
    id: "republic-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "The Republic ends with a story of the soul after death told by ____, who returned from the dead to report what he had seen.",
    correctText: "Er",
    explanation:
      "The Myth of Er, in Book X, replaces traditional eschatology with a Platonic vision of judgement, reincarnation, and choice. It is the dialogue’s answer to the suggestion in Book II that the just suffer in this life and the next.",
    citation: "Republic 614a–621d",
  },
  {
    id: "republic-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“Until philosophers are kings, or the kings of this world have the spirit and power of philosophy, cities will have no rest from their evils.”",
    identificationSubject: "speaker",
    options: ["Glaucon", "Socrates", "Adeimantus", "Thrasymachus"],
    correctIndex: 1,
    explanation:
      "Socrates’s third wave in Book V — the most controversial proposal of the dialogue. The line names what it would take to bring the kallipolis into being and immediately exposes the practical and political resistance to such a thought.",
    citation: "Republic 473c–e",
  },
  {
    id: "republic-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Socrates believes the kallipolis described in the Republic could be implemented in any actual Greek city.",
    correctBool: false,
    tfReasons: [
      "He stresses that the kallipolis is a paradigm laid up in heaven — useful for guiding the soul whether or not it ever exists in any actual city.",
      "He thinks Athens is ready to adopt it after a short reform.",
      "He considers Sparta the natural site for it.",
      "He believes Persia must be conquered before it can be founded.",
    ],
    tfCorrectReason: 0,
    explanation:
      "At the end of Book IX Socrates explicitly says it does not matter whether the city ever exists; the just man uses it as a paradigm to govern his own soul. The dialogue’s political and ethical claims are tightly linked.",
    citation: "Republic 591e–592b",
  },
]

export const REPUBLIC_TRIALS: Record<number, ChapterQuestion[]> = {
  0: REPUBLIC,
}
