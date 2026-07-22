/**
 * Demo Trial bank — a deterministic showcase set covering all fifteen
 * question families, drawn from the canon. Pair with a fixed `seed` on
 * TrialPlayer and every shuffle, feedback line, and Wisdom award replays
 * identically — suitable for screenshots, walkthroughs, and labs.
 */
import type { TrialItem } from "./types"

export const DEMO_TRIAL_SEED = "virgil-maximalist-demo"

export const DEMO_TRIAL_ITEMS: TrialItem[] = [
  {
    id: "demo-fill-1",
    family: "fill-the-line",
    prompt: "Complete the first line of the Iliad.",
    anchors: [{ paragraphId: "iliad-1-p1" }],
    rationale:
      "The opening word in Greek is mēnis — rage. The whole poem unfolds from this single noun.",
    evidenceAnchor: { paragraphId: "iliad-1-p1", quote: "Sing, O goddess, the rage of Achilles" },
    hints: [
      { level: 1, text: "One word names the poem's subject — an emotion." },
      { level: 2, text: "It is what Achilles feels at Agamemnon's slight." },
      { level: 3, text: "Look at the first foot of line 1: the word before 'of Achilles'." },
    ],
    wisdom: 10,
    difficulty: "apprentice",
    content: {
      lines: ["Sing, O goddess, the rage of Achilles, son of Peleus"],
      blanks: [{ lineIndex: 0, answer: "rage" }],
      wordBank: ["rage", "pride", "sorrow", "glory"],
      mode: "bank",
    },
  },
  {
    id: "demo-evidence-1",
    family: "find-the-evidence",
    prompt: "Find the lines that prove the claim.",
    anchors: [{ paragraphId: "inferno-1-p1" }],
    rationale: "The dark wood and the lost straight way are Dante's figures for spiritual disorientation.",
    evidenceAnchor: { paragraphId: "inferno-1-p1", quote: "the straight way was lost" },
    hints: [
      { level: 1, text: "The proof is in the opening tercet." },
      { level: 2, text: "Look for where the way is described as lost." },
      { level: 3, text: "Lines 2 and 3 together carry the claim." },
    ],
    wisdom: 10,
    difficulty: "apprentice",
    content: {
      claim: "Dante begins the poem already lost.",
      segments: [
        "Midway upon the journey of our life",
        "I found myself within a forest dark,",
        "For the straightforward pathway had been lost.",
        "Ah me! how hard a thing it is to say",
      ],
      correctRange: [1, 2],
    },
  },
  {
    id: "demo-word-1",
    family: "word-in-context",
    prompt: "What does 'wherefore' mean here?",
    anchors: [{ paragraphId: "hamlet-2-2-p40" }],
    rationale: "'Wherefore' asks for a reason — 'why' — not a place. Juliet's question is why Romeo must be a Montague.",
    evidenceAnchor: { paragraphId: "hamlet-2-2-p40" },
    hints: [
      { level: 1, text: "Substitute a modern question word and read the line aloud." },
      { level: 2, text: "It does not ask 'where'." },
      { level: 3, text: "The answer is a reason, not a location." },
    ],
    wisdom: 5,
    difficulty: "apprentice",
    content: {
      sentence: "Wherefore art thou Romeo?",
      targetWord: "wherefore",
      choices: [
        { text: "Why", correct: true },
        { text: "Where", correct: false },
        { text: "When", correct: false },
        { text: "How", correct: false },
      ],
    },
  },
  {
    id: "demo-mc-1",
    family: "multiple-choice",
    prompt: "Whom does Beatrice send to guide Dante through Hell?",
    anchors: [{ paragraphId: "inferno-2-p70" }],
    rationale: "Beatrice descends from Paradise to summon Virgil, who meets Dante in the dark wood at the start of Inferno I.",
    evidenceAnchor: { paragraphId: "inferno-2-p70", quote: "I am Beatrice, who send you" },
    hints: [
      { level: 1, text: "The guide is a poet, not a saint." },
      { level: 2, text: "He wrote epic under Augustus." },
      { level: 3, text: "Reread Inferno II — Beatrice names him." },
    ],
    wisdom: 10,
    difficulty: "apprentice",
    content: {
      options: [
        { id: "a", text: "Saint Lucy", correct: false, nearMiss: true, distractorNote: "Lucy carries Beatrice's plea, but does not guide Dante." },
        { id: "b", text: "Virgil", correct: true },
        { id: "c", text: "Statius", correct: false },
        { id: "d", text: "Cato", correct: false },
      ],
    },
  },
  {
    id: "demo-match-1",
    family: "match-pairs",
    prompt: "Match each guide to the soul they accompany.",
    anchors: [],
    rationale: "Guides are a recurring epic device — Dante inherits the convention from Homer through Virgil.",
    evidenceAnchor: null,
    hints: [
      { level: 1, text: "Three of the four descend to the underworld." },
      { level: 2, text: "Virgil's charge is a fellow poet." },
      { level: 3, text: "Anchises waits for his son in Elysium." },
    ],
    wisdom: 10,
    difficulty: "scholar",
    content: {
      pairs: [
        { left: "Virgil", right: "Dante" },
        { left: "Athena", right: "Odysseus" },
        { left: "Anchises", right: "Aeneas" },
        { left: "Tiresias", right: "Odysseus (in Hades)" },
      ],
    },
  },
  {
    id: "demo-who-1",
    family: "who-said-it",
    prompt: "Who speaks this line?",
    anchors: [{ paragraphId: "pl-1-p254" }],
    rationale: "Satan rallies his fallen host in Book I. The line is famously double-edged — defiant and self-condemning.",
    evidenceAnchor: { paragraphId: "pl-1-p254", quote: "The mind is its own place" },
    hints: [
      { level: 1, text: "The speaker has just fallen a very long way." },
      { level: 2, text: "He refuses to repent." },
      { level: 3, text: "He speaks from a lake of fire in Book I." },
    ],
    wisdom: 10,
    difficulty: "scholar",
    content: {
      quote: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.",
      choices: [
        { name: "Adam", correct: false },
        { name: "Satan", correct: true },
        { name: "Beelzebub", correct: false },
        { name: "God the Father", correct: false },
      ],
    },
  },
  {
    id: "demo-order-1",
    family: "ordering",
    prompt: "Order the first circles of Dante's Hell, descending.",
    anchors: [{ paragraphId: "inferno-4-p1" }],
    rationale: "Inferno I–VII move from Limbo through the Lustful, the Gluttonous, and the Hoarders and Wasters.",
    evidenceAnchor: { paragraphId: "inferno-4-p1" },
    hints: [
      { level: 1, text: "The mildest circle comes first." },
      { level: 2, text: "The unbaptized virtuous are punished least." },
      { level: 3, text: "Limbo is reached before any wind or rain." },
    ],
    wisdom: 10,
    difficulty: "scholar",
    content: {
      items: [
        { id: "limbo", text: "Limbo" },
        { id: "lust", text: "The Lustful" },
        { id: "glut", text: "The Gluttonous" },
        { id: "hoard", text: "The Hoarders and Wasters" },
      ],
      correctOrder: ["limbo", "lust", "glut", "hoard"],
    },
  },
  {
    id: "demo-tfr-1",
    family: "true-false-with-reason",
    prompt: "Judge this claim about the Aeneid — then justify it.",
    anchors: [{ paragraphId: "aeneid-12-end" }],
    rationale: "Virgil ends on the killing of Turnus; the marriage to Lavinia is foretold but never narrated.",
    evidenceAnchor: { paragraphId: "aeneid-12-end", quote: "furious, sank in death" },
    hints: [
      { level: 1, text: "Think of the poem's final scene." },
      { level: 2, text: "The wedding is prophesied — but is it shown?" },
      { level: 3, text: "Book XII ends with a sword, not a wedding." },
    ],
    wisdom: 15,
    difficulty: "master",
    content: {
      statement: "The Aeneid ends with the marriage of Aeneas and Lavinia.",
      correctBool: false,
      reasons: [
        { id: "r0", text: "It ends abruptly with the killing of Turnus; the marriage is foretold but not narrated.", correct: true },
        { id: "r1", text: "It ends with Aeneas's death in old age.", correct: false },
        { id: "r2", text: "It ends with the founding of Rome by Romulus.", correct: false },
      ],
    },
  },
  {
    id: "demo-refl-1",
    family: "reflection",
    prompt: "Marcus Aurelius begins each day expecting difficult people. What would that practice change about your own mornings?",
    anchors: [{ paragraphId: "meditations-2-1" }],
    rationale: "Reflections are self-assessed: an earnest attempt earns Wisdom; the rubric keeps the self-assessment honest.",
    evidenceAnchor: { paragraphId: "meditations-2-1" },
    hints: [],
    wisdom: 10,
    difficulty: "scholar",
    content: {
      minWords: 30,
      guidance: [
        "Name one specific frustration the practice would defuse.",
        "Say what you would still owe the difficult person.",
      ],
      rubric: [
        { id: "t1", label: "I connected the practice to a real moment in my day." },
        { id: "t2", label: "I said what remains my responsibility regardless of others." },
      ],
    },
  },
  {
    id: "demo-sa-1",
    family: "short-answer",
    prompt: "Why does Achilles withdraw from the fighting in Iliad I?",
    anchors: [{ paragraphId: "iliad-1-p3" }],
    rationale: "Agamemnon's seizure of Briseis dishonors him; he appeals to his mother Thetis for Zeus to favor the Trojans.",
    evidenceAnchor: { paragraphId: "iliad-1-p3" },
    hints: [
      { level: 1, text: "Something is taken from him." },
      { level: 2, text: "Name what Agamemnon takes — and from whom." },
      { level: 3, text: "The name Briseis belongs in your answer." },
    ],
    wisdom: 10,
    difficulty: "scholar",
    content: {
      referenceAnswer: "Agamemnon takes Briseis from him; dishonored, Achilles withdraws and prays to Thetis.",
      acceptedKeywords: ["Agamemnon", "Briseis", "dishonor"],
    },
  },
]

/** Slice of the demo bank for a short session (first n items). */
export function demoTrialItems(count = DEMO_TRIAL_ITEMS.length): TrialItem[] {
  return DEMO_TRIAL_ITEMS.slice(0, count)
}
