/**
 * Demo seed — TWO validated questions per Trial type (grouped by type in
 * registry order), each drawn from a DIFFERENT book so the marketing demo
 * showcases both the full type set and the breadth of the canon: The Iliad,
 * the Divine Comedy, Pride and Prejudice, Moby-Dick, Frankenstein, Jane Eyre,
 * The Odyssey, Romeo and Juliet, Hamlet, Macbeth, Julius Caesar, and A Tale
 * of Two Cities. Each raw object is run through
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

  // fill_the_line — Longfellow's opening tercet of the Divine Comedy.
  {
    id: "demo-fill_the_line-2",
    type: "fill_the_line",
    prompt: "Restore the opening of Dante's Divine Comedy.",
    difficulty: "scholar",
    points: 10,
    explanation:
      "Longfellow's Inferno opens: \"Midway upon the journey of our life / I found myself within a forest dark, / For the straightforward pathway had been lost.\"",
    content: {
      lines: [
        "Midway upon the journey of our life",
        "I found myself within a forest dark,",
      ],
      blanks: [
        { lineIndex: 0, answer: "life" },
        { lineIndex: 1, answer: "dark" },
      ],
      wordBank: ["life", "dark", "light", "strife"],
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

  // find_the_evidence — Moby-Dick: why Ishmael goes to sea.
  {
    id: "demo-find_the_evidence-2",
    type: "find_the_evidence",
    prompt: "Which line shows why Ishmael goes to sea?",
    difficulty: "scholar",
    points: 10,
    explanation:
      "In the famous opening of Moby-Dick, Ishmael explains that whenever a damp, drizzly November settles in his soul, he takes to the ship as his substitute for despair.",
    content: {
      claim: "Ishmael sails not for wages but to drive off his own gloom.",
      segments: [
        "Call me Ishmael. Some years ago, having little money, I thought I would sail about a little.",
        "Whenever I find myself growing grim about the mouth, I account it high time to get to sea.",
        "The Pequod was fitting out for a three years' voyage under Captain Ahab.",
        "Queequeg and I signed the ship's articles together.",
      ],
      correctRange: [1, 1],
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

  // word_in_context — Jane Eyre: "countenance".
  {
    id: "demo-word_in_context-2",
    type: "word_in_context",
    prompt: "What does the marked word mean here?",
    difficulty: "scholar",
    points: 10,
    explanation:
      "Brontë uses \"countenance\" throughout Jane Eyre for the face as it reveals feeling — Rochester's expression darkens as he reads.",
    content: {
      sentence: "Mr. Rochester's countenance darkened as he read the letter.",
      targetWord: "countenance",
      choices: [
        { text: "facial expression", correct: true },
        { text: "formal signature", correct: false },
        { text: "financial account", correct: false },
        { text: "country estate", correct: false },
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

  // match_pairs — Romeo and Juliet: figures to their place in the feud.
  {
    id: "demo-match_pairs-2",
    type: "match_pairs",
    prompt: "Match each figure of Romeo and Juliet to their place in Verona.",
    difficulty: "scholar",
    points: 10,
    explanation:
      "The feud frames everyone: Romeo is Montague's heir, Juliet is Capulet's daughter, Mercutio is Romeo's quicksilver friend, and Tybalt is Juliet's duelling cousin.",
    content: {
      pairs: [
        { left: "Romeo", right: "Heir of the house of Montague" },
        { left: "Juliet", right: "Daughter of the house of Capulet" },
        { left: "Mercutio", right: "Romeo's quick-tongued friend" },
        { left: "Tybalt", right: "Juliet's hot-blooded cousin" },
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

  // who_said_it — Macbeth: the sleepwalking scene.
  {
    id: "demo-who_said_it-2",
    type: "who_said_it",
    prompt: "Who speaks this line?",
    difficulty: "scholar",
    points: 10,
    explanation:
      "Lady Macbeth, sleepwalking in Act V scene i, tries to scrub the imagined blood from her hands.",
    content: {
      quote: "Out, damned spot! out, I say!",
      choices: [
        { name: "Lady Macbeth", correct: true },
        { name: "Macbeth", correct: false },
        { name: "The Three Witches", correct: false },
        { name: "Banquo", correct: false },
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

  // recitation — A Tale of Two Cities' famous opening.
  {
    id: "demo-recitation-2",
    type: "recitation",
    prompt: "Recite the opening from memory.",
    difficulty: "scholar",
    points: 15,
    explanation:
      "Dickens opens A Tale of Two Cities with the most famous antithesis in English prose: \"It was the best of times, it was the worst of times.\"",
    content: {
      tokens: [
        "It",
        "was",
        "the",
        "best",
        "of",
        "times,",
        "it",
        "was",
        "the",
        "worst",
        "of",
        "times.",
      ],
      rounds: [0.25, 0.5, 0.75, 1],
    },
  },
]

/** Validated demo questions — two per net-new type, grouped in registry order. */
export const DEMO_TRIAL_QUESTIONS: TrialQuestion[] = RAW.map(parseTrialQuestion)
