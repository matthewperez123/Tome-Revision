/**
 * Demo seed — one validated question per Trial type, EACH drawn from a
 * DIFFERENT book so the marketing demo showcases both the full type set and the
 * breadth of the canon: The Iliad, Pride and Prejudice, Frankenstein, The
 * Odyssey, Hamlet, and Julius Caesar. Each raw object is run through
 * `parseTrialQuestion` at module load, so the per-type zod schemas guard the
 * shape exactly as a DB / content-JSON read would. The dev/trials harness and
 * the /readers Trial demo mount these through the real <QuestionCard> +
 * registry.
 *
 * This is verification/demo seed only — production banks live per-section in the
 * trials table (type + content columns) and the per-book *-trials siblings.
 */
import {
  parseTrialQuestion,
  type TrialQuestion,
} from "./question-types"

const RAW = [
  // fill_the_line — Pope's heroic-couplet opening of the Iliad; the rhyme
  // (spring / sing) is the hint. Bank mode.
  {
    id: "demo-fill_the_line",
    type: "fill_the_line",
    prompt: "Restore Pope's opening couplet of the Iliad.",
    difficulty: "apprentice",
    points: 10,
    explanation:
      "Pope renders Homer's proem in heroic couplets: \"Achilles' wrath, to Greece the direful spring / Of woes unnumber'd, heavenly goddess, sing!\"",
    content: {
      lines: [
        "Achilles' wrath, to Greece the direful spring",
        "Of woes unnumber'd, heavenly goddess, sing!",
      ],
      blanks: [
        { lineIndex: 0, answer: "spring" },
        { lineIndex: 1, answer: "sing" },
      ],
      wordBank: ["spring", "sing", "king", "bring"],
      mode: "bank",
    },
  },

  // find_the_evidence — tap the line(s) that support the claim.
  // Pride and Prejudice — Mrs. Bennet's matchmaking motive.
  {
    id: "demo-find_the_evidence",
    type: "find_the_evidence",
    prompt: "Which line shows what Mrs. Bennet really wants?",
    difficulty: "scholar",
    points: 10,
    explanation:
      "From the opening of Pride and Prejudice: the moment Bingley takes Netherfield, Mrs. Bennet's single object is to see one of her daughters married to him.",
    content: {
      claim: "Mrs. Bennet regards the new neighbour chiefly as a husband for one of her daughters.",
      segments: [
        "A wealthy young gentleman, Mr. Bingley, had taken nearby Netherfield Park.",
        "Mrs. Bennet at once pressed her husband to call on him.",
        "\"I am thinking of his marrying one of our daughters,\" she confessed.",
        "Mr. Bennet only teased her for her scheming.",
      ],
      correctRange: [2, 2],
    },
  },

  // word_in_context — gloss the target word as used in the sentence.
  // Frankenstein — Victor's flight from the creature.
  {
    id: "demo-word_in_context",
    type: "word_in_context",
    prompt: "What does the marked word mean here?",
    difficulty: "apprentice",
    points: 10,
    explanation:
      "In Frankenstein, Victor recoils from his creation and repeatedly calls it a \"wretch\" — a miserable, contemptible creature.",
    content: {
      sentence: "Victor fled from the wretch to whom he had given life.",
      targetWord: "wretch",
      choices: [
        { text: "a miserable, contemptible creature", correct: true },
        { text: "a trusted companion", correct: false },
        { text: "a skilled craftsman", correct: false },
        { text: "a distant relative", correct: false },
      ],
    },
  },

  // match_pairs — figures within a single work (The Odyssey) to their role.
  {
    id: "demo-match_pairs",
    type: "match_pairs",
    prompt: "Match each figure of the Odyssey to their role.",
    difficulty: "apprentice",
    points: 10,
    explanation:
      "All four belong to Homer's Odyssey: Odysseus strives home to Ithaca, where Penelope holds off her suitors and Telemachus sets out to find his father — while the Cyclops Polyphemus is the monster Odysseus must blind to escape.",
    content: {
      pairs: [
        { left: "Odysseus", right: "The king striving to reach home" },
        { left: "Penelope", right: "His wife, besieged by suitors" },
        { left: "Telemachus", right: "His son, who seeks him" },
        { left: "Polyphemus", right: "The Cyclops he blinds to escape" },
      ],
    },
  },

  // who_said_it — attribute the quote to its speaker.
  {
    id: "demo-who_said_it",
    type: "who_said_it",
    prompt: "Who speaks this line?",
    difficulty: "apprentice",
    points: 10,
    explanation:
      "Hamlet opens his third soliloquy with these words in Act III, scene i.",
    content: {
      quote: "To be, or not to be, that is the question.",
      choices: [
        { name: "Hamlet", correct: true },
        { name: "Macbeth", correct: false },
        { name: "Othello", correct: false },
        { name: "King Lear", correct: false },
      ],
    },
  },

  // recitation — progressive cloze; type the passage from a partial view.
  // Julius Caesar — Antony's oration (III.ii).
  {
    id: "demo-recitation",
    type: "recitation",
    prompt: "Recite the line from memory.",
    difficulty: "scholar",
    points: 15,
    explanation:
      "Mark Antony's funeral oration in Julius Caesar III.ii — \"Friends, Romans, countrymen, lend me your ears.\"",
    content: {
      tokens: [
        "Friends,",
        "Romans,",
        "countrymen,",
        "lend",
        "me",
        "your",
        "ears.",
      ],
      rounds: [0.25, 0.5, 0.75, 1],
    },
  },
]

/** Validated demo questions — one per net-new type, in registry order. */
export const DEMO_TRIAL_QUESTIONS: TrialQuestion[] = RAW.map(parseTrialQuestion)
