/**
 * Demo seed — one validated question per net-new Trial type, drawn from the
 * existing canon (Homer, Shakespeare, Dante, Milton, Virgil). Each raw object
 * is run through `parseTrialQuestion` at module load, so the per-type zod
 * schemas guard the shape exactly as a DB / content-JSON read would. The
 * dev/trials harness mounts these through the real <QuestionCard> + registry.
 *
 * This is verification seed only — production banks live per-section in the
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
  {
    id: "demo-find_the_evidence",
    type: "find_the_evidence",
    prompt: "Which line shows why Apollo sends the plague?",
    difficulty: "scholar",
    points: 10,
    explanation:
      "Agamemnon's refusal to ransom Chryses' daughter dishonours Apollo's priest, so the god answers Chryses' prayer with a plague on the camp.",
    content: {
      claim: "Apollo sends the plague to avenge his dishonoured priest.",
      segments: [
        "Agamemnon seized Chryseis as his prize of war.",
        "Her father Chryses, priest of Apollo, came to ransom her.",
        "Agamemnon drove the old priest away with threats.",
        "So Chryses prayed, and Apollo sent a plague upon the Greeks.",
      ],
      correctRange: [3, 3],
    },
  },

  // word_in_context — gloss the target word as used in the sentence.
  {
    id: "demo-word_in_context",
    type: "word_in_context",
    prompt: "What does the marked word mean here?",
    difficulty: "apprentice",
    points: 10,
    explanation:
      "\"Portentous\" describes something that seems to foretell a momentous (often ominous) event — fitting for the Ghost on the battlements.",
    content: {
      sentence: "The Ghost was a portentous figure upon the battlements.",
      targetWord: "portentous",
      choices: [
        { text: "ominously foretelling something to come", correct: true },
        { text: "enormous in physical size", correct: false },
        { text: "faintly transparent", correct: false },
        { text: "warmly welcoming", correct: false },
      ],
    },
  },

  // match_pairs — character to the work they belong to.
  {
    id: "demo-match_pairs",
    type: "match_pairs",
    prompt: "Match each figure to the work they belong to.",
    difficulty: "apprentice",
    points: 10,
    explanation:
      "Each is the defining figure of its epic — protagonist, or in Satan's case its most consequential agent.",
    content: {
      pairs: [
        { left: "Achilles", right: "The Iliad" },
        { left: "Beatrice", right: "The Divine Comedy" },
        { left: "Satan", right: "Paradise Lost" },
        { left: "Aeneas", right: "The Aeneid" },
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
  {
    id: "demo-recitation",
    type: "recitation",
    prompt: "Recite the line from memory.",
    difficulty: "scholar",
    points: 15,
    explanation:
      "Hamlet III.i — the most-quoted opening in English drama.",
    content: {
      tokens: [
        "To",
        "be,",
        "or",
        "not",
        "to",
        "be,",
        "that",
        "is",
        "the",
        "question.",
      ],
      rounds: [0.25, 0.5, 0.75, 1],
    },
  },
]

/** Validated demo questions — one per net-new type, in registry order. */
export const DEMO_TRIAL_QUESTIONS: TrialQuestion[] = RAW.map(parseTrialQuestion)
