/**
 * Trial engine unit tests — runnable directly:
 *   ./node_modules/.bin/tsx src/lib/trials/engine.test.ts
 *
 * Plain node:assert, no framework: the engine is pure, so each test builds a
 * session, drives it, and asserts on the returned state/events.
 */
import assert from "node:assert/strict"
import {
  advance,
  createTrialSession,
  currentItem,
  deserializeSession,
  gradeResponse,
  hintLadder,
  nextHint,
  optionOrder,
  retryQuestion,
  seededShuffle,
  serializeSession,
  submitAnswer,
  summarize,
  toggleElimination,
  useHint,
  DEFAULT_TRIAL_RULES,
} from "./engine"
import { fromChapterQuestion, fromTypedQuestion } from "./adapters"
import { safeParseTrialItem, type TrialItem } from "./types"
import type { ChapterQuestion } from "@/lib/chapter-questions"

let passed = 0
let failed = 0
function test(name: string, fn: () => void) {
  try {
    fn()
    passed++
    console.log(`  ✓ ${name}`)
  } catch (err) {
    failed++
    console.error(`  ✗ ${name}`)
    console.error(err)
  }
}

// ── Fixtures ─────────────────────────────────────────────

const mcItem: TrialItem = {
  id: "q-mc-1",
  family: "multiple-choice",
  prompt: "Who quarrels with Achilles in Iliad I?",
  anchors: [{ paragraphId: "iliad-1-p3" }],
  rationale: "Agamemnon seizes Briseis after being forced to return Chryseis.",
  evidenceAnchor: { paragraphId: "iliad-1-p3", quote: "Agamemnon took Briseis" },
  hints: [
    { level: 1, text: "Reread the assembly scene." },
    { level: 2, text: "It is not a warrior renowned for battle prowess." },
    { level: 3, text: "Look at who is forced to give up Chryseis." },
  ],
  wisdom: 10,
  difficulty: "apprentice",
  content: {
    options: [
      { id: "a", text: "Hector", correct: false },
      { id: "b", text: "Agamemnon", correct: true },
      { id: "c", text: "Odysseus", correct: false, nearMiss: true, distractorNote: "He mediates, but does not quarrel." },
      { id: "d", text: "Priam", correct: false },
    ],
  },
}

const fillItem: TrialItem = {
  id: "q-fill-1",
  family: "fill-the-line",
  prompt: "Complete the invocation.",
  anchors: [],
  rationale: "The Iliad opens with mēnis — the rage of Achilles.",
  evidenceAnchor: null,
  hints: [{ level: 1, text: "One word names the poem's subject." }],
  wisdom: 10,
  difficulty: "apprentice",
  content: {
    lines: ["Sing, O goddess, the rage of Achilles", "son of Peleus, that destructive rage"],
    blanks: [
      { lineIndex: 0, answer: "rage" },
      { lineIndex: 1, answer: "destructive" },
    ],
    mode: "type",
  },
}

const orderingItem: TrialItem = {
  id: "q-ord-1",
  family: "ordering",
  prompt: "Order the first circles of Hell, descending.",
  anchors: [],
  rationale: "Limbo → Lustful → Gluttonous → Hoarders and Wasters (Inferno I–VII).",
  evidenceAnchor: null,
  hints: [],
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
}

const tfrItem: TrialItem = {
  id: "q-tfr-1",
  family: "true-false-with-reason",
  prompt: "Judge the claim, then justify it.",
  anchors: [],
  rationale: "The Iliad covers weeks in the tenth year, not the whole war.",
  evidenceAnchor: null,
  hints: [],
  wisdom: 10,
  difficulty: "apprentice",
  content: {
    statement: "The Iliad narrates all ten years of the Trojan War.",
    correctBool: false,
    reasons: [
      { id: "r0", text: "It covers weeks in the tenth year, from the wrath to Hector's funeral.", correct: true },
      { id: "r1", text: "It begins with the ships launching for Troy.", correct: false },
    ],
  },
}

const reflectionItem: TrialItem = {
  id: "q-refl-1",
  family: "reflection",
  prompt: "What does Achilles' wrath cost the Greeks? Reflect.",
  anchors: [],
  rationale: "Open reflection — self-assessed against the rubric.",
  evidenceAnchor: null,
  hints: [],
  wisdom: 10,
  difficulty: "scholar",
  content: {
    minWords: 5,
    guidance: ["Name a specific consequence."],
    rubric: [{ id: "t1", label: "I named a consequence of the quarrel." }],
  },
}

const shortAnswerItem: TrialItem = {
  id: "q-sa-1",
  family: "short-answer",
  prompt: "Why does Achilles withdraw from battle?",
  anchors: [],
  rationale: "Agamemnon's seizure of Briseis dishonors him; he appeals to Thetis.",
  evidenceAnchor: null,
  hints: [],
  wisdom: 10,
  difficulty: "scholar",
  content: {
    referenceAnswer: "Agamemnon took Briseis, so Achilles, dishonored, prays to Thetis.",
    acceptedKeywords: ["Agamemnon", "Briseis", "dishonor", "Thetis"],
  },
}

const evidenceItem: TrialItem = {
  id: "q-ev-1",
  family: "find-the-evidence",
  prompt: "Tap the lines that prove the claim.",
  anchors: [],
  rationale: "The plague and the ransom refusal provoke the quarrel.",
  evidenceAnchor: null,
  hints: [],
  wisdom: 10,
  difficulty: "apprentice",
  content: {
    claim: "Apollo's plague starts the crisis.",
    segments: ["Line one.", "The plague falls on the host.", "Line three.", "Line four."],
    correctRange: [1, 1],
  },
}

const allItems = [mcItem, fillItem, orderingItem, tfrItem, reflectionItem, shortAnswerItem, evidenceItem]

// ── Determinism ──────────────────────────────────────────

console.log("\ndeterminism")

test("seeded shuffle is stable for the same seed and differs across seeds", () => {
  const ids = ["a", "b", "c", "d", "e", "f"]
  const s1 = seededShuffle(ids, 42, "k")
  const s2 = seededShuffle(ids, 42, "k")
  const s3 = seededShuffle(ids, 43, "k")
  assert.deepEqual(s1, s2)
  assert.notDeepEqual(s1, s3)
  assert.deepEqual([...s1].sort(), [...ids].sort())
})

test("optionOrder is deterministic per (seed, itemId)", () => {
  const ids = mcItem.content.options.map((o) => o.id)
  assert.deepEqual(optionOrder(ids, "demo", "q-mc-1"), optionOrder(ids, "demo", "q-mc-1"))
  assert.deepEqual([...optionOrder(ids, "demo", "q-mc-1")].sort(), [...ids].sort())
})

test("same seed replays an identical session (feedback text included)", () => {
  const run = () => {
    const s = createTrialSession({ items: [mcItem], seed: "replay" })
    const r = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } })
    return r.outcome?.feedback
  }
  assert.deepEqual(run(), run())
})

// ── Scoring & Wisdom ─────────────────────────────────────

console.log("\nscoring & wisdom")

test("elegant answer: first try, no hints → bonus Wisdom + ANSWER_ELEGANT", () => {
  const s = createTrialSession({ items: [mcItem], seed: 1 })
  const r = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } })
  assert.equal(r.outcome?.kind, "elegant")
  // 10 × 1.25 = 12.5 → rounds to 13
  assert.equal(r.outcome?.wisdomAwarded, 13)
  assert.ok(r.virgilEvents.some((e) => e.type === "ANSWER_ELEGANT"))
  assert.ok(r.virgilEvents.some((e) => e.type === "WISDOM_EARNED" && e.amount === 13))
  assert.equal(r.session.streak, 1)
})

test("plain correct: ANSWER_CORRECT carries the streak", () => {
  let s = createTrialSession({ items: [mcItem, fillItem], seed: 1 })
  s = useHint(s).session // one hint on MC (10% penalty) → no longer elegant
  const r1 = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } })
  assert.equal(r1.outcome?.kind, "correct")
  assert.equal(r1.outcome?.wisdomAwarded, 9) // 10 × (1 − 0.10)
  assert.ok(r1.virgilEvents.some((e) => e.type === "ANSWER_CORRECT" && e.streak === 1))
})

test("hint penalties stack but cap at maxHintPenalty", () => {
  let s = createTrialSession({ items: [mcItem], seed: 1 })
  s = useHint(s).session // L1
  s = useHint(s).session // L2
  s = useHint(s).session // L3
  assert.deepEqual(s.questions[0].hintsUsed, [1, 2, 3])
  const r = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } })
  // raw penalty 0.75 capped at 0.6 → 10 × 0.4 = 4
  assert.equal(r.outcome?.wisdomAwarded, 4)
})

test("HINT_USED events fire per level, in order", () => {
  const s = createTrialSession({ items: [mcItem], seed: 1 })
  const r1 = useHint(s)
  assert.deepEqual(r1.virgilEvents, [{ type: "HINT_USED", level: 1 }])
  const r2 = useHint(r1.session)
  assert.deepEqual(r2.virgilEvents, [{ type: "HINT_USED", level: 2 }])
  assert.deepEqual(nextHint(r2.session), { level: 3, text: "Look at who is forced to give up Chryseis." })
})

test("retry decay: correct on third attempt earns decayed Wisdom (floor respected)", () => {
  let s = createTrialSession({ items: [mcItem], seed: 1, rules: { retryMultiplier: 0.5 } })
  s = submitAnswer(s, { family: "multiple-choice", response: { optionId: "a" } }).session
  s = retryQuestion(s)
  s = submitAnswer(s, { family: "multiple-choice", response: { optionId: "d" } }).session
  s = retryQuestion(s)
  const r = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } })
  // 10 × 0.5² = 2.5 → 3
  assert.equal(r.outcome?.kind, "correct")
  assert.equal(r.outcome?.wisdomAwarded, 3)
  assert.equal(r.session.questions[0].attempts, 3)
})

// ── Near-miss & feedback kinds ───────────────────────────

console.log("\nnear-miss & feedback")

test("near-miss distractor yields ANSWER_NEAR_MISS, no Wisdom, retry allowed", () => {
  const s = createTrialSession({ items: [mcItem], seed: 1 })
  const r = submitAnswer(s, { family: "multiple-choice", response: { optionId: "c" } })
  assert.equal(r.outcome?.kind, "near-miss")
  assert.equal(r.outcome?.wisdomAwarded, 0)
  assert.deepEqual(r.virgilEvents, [{ type: "ANSWER_NEAR_MISS" }])
  assert.equal(r.session.questions[0].status, "answered-near-miss")
  // retry restores pending without wiping hint/elimination state
  const s2 = retryQuestion(r.session)
  assert.equal(s2.questions[0].status, "pending")
})

test("plain wrong answer is encouraging, costs nothing, never locks", () => {
  const s = createTrialSession({ items: [mcItem], seed: 1 })
  const r = submitAnswer(s, { family: "multiple-choice", response: { optionId: "a" } })
  assert.equal(r.outcome?.kind, "incorrect")
  assert.match(r.outcome?.feedback.message ?? "", /try again|once more/i)
  assert.deepEqual(r.virgilEvents, [{ type: "ANSWER_INCORRECT" }])
  assert.equal(r.session.streak, 0)
})

test("fill-the-line: half the blanks right is a near-miss", () => {
  const g = gradeResponse(fillItem, {
    family: "fill-the-line",
    response: { answers: ["rage", "wrong"] },
  })
  assert.deepEqual(g, { correct: false, nearMiss: true })
})

test("find-the-evidence: overlap without exact match is a near-miss", () => {
  const g = gradeResponse(evidenceItem, {
    family: "find-the-evidence",
    response: { range: [1, 3] },
  })
  assert.deepEqual(g, { correct: false, nearMiss: true })
  const exact = gradeResponse(evidenceItem, {
    family: "find-the-evidence",
    response: { range: [1, 1] },
  })
  assert.deepEqual(exact, { correct: true, nearMiss: false })
})

test("ordering: half in place is a near-miss; exact order is correct", () => {
  const half = gradeResponse(orderingItem, {
    family: "ordering",
    response: { order: ["limbo", "glut", "lust", "hoard"] },
  })
  assert.deepEqual(half, { correct: false, nearMiss: true })
  const exact = gradeResponse(orderingItem, {
    family: "ordering",
    response: { order: ["limbo", "lust", "glut", "hoard"] },
  })
  assert.deepEqual(exact, { correct: true, nearMiss: false })
})

test("true-false-with-reason: right verdict + wrong reason is a near-miss", () => {
  const g = gradeResponse(tfrItem, {
    family: "true-false-with-reason",
    response: { bool: false, reasonId: "r1" },
  })
  assert.deepEqual(g, { correct: false, nearMiss: true })
  const both = gradeResponse(tfrItem, {
    family: "true-false-with-reason",
    response: { bool: false, reasonId: "r0" },
  })
  assert.deepEqual(both, { correct: true, nearMiss: false })
})

test("short-answer: keyword coverage drives correct / near-miss / incorrect", () => {
  const full = gradeResponse(shortAnswerItem, {
    family: "short-answer",
    response: { text: "Agamemnon seized Briseis, dishonoring him; he prays to Thetis." },
  }, DEFAULT_TRIAL_RULES)
  assert.deepEqual(full, { correct: true, nearMiss: false })
  const near = gradeResponse(shortAnswerItem, {
    family: "short-answer",
    response: { text: "Because Agamemnon took Briseis from him." },
  }, DEFAULT_TRIAL_RULES)
  assert.deepEqual(near, { correct: false, nearMiss: true })
  const wrong = gradeResponse(shortAnswerItem, {
    family: "short-answer",
    response: { text: "He was tired of fighting." },
  }, DEFAULT_TRIAL_RULES)
  assert.deepEqual(wrong, { correct: false, nearMiss: false })
})

test("reflection: meeting minWords completes; nothing is ever marked incorrect", () => {
  const ok = gradeResponse(reflectionItem, {
    family: "reflection",
    response: { text: "The wrath costs the Greeks ships men and honor alike.", rubricChecked: ["t1"] },
  })
  assert.equal(ok.correct, true)
  const thin = gradeResponse(reflectionItem, {
    family: "reflection",
    response: { text: "It costs much.", rubricChecked: [] },
  })
  assert.equal(thin.correct, false)
  assert.equal(thin.nearMiss, true) // encouraged, never punished
})

// ── Session flow ─────────────────────────────────────────

console.log("\nsession flow")

test("full walkthrough: advance through all items → complete + summary", () => {
  let s = createTrialSession({ items: allItems, seed: "walk" })
  assert.equal(currentItem(s)?.id, "q-mc-1")
  s = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } }).session
  s = advance(s)
  s = submitAnswer(s, { family: "fill-the-line", response: { answers: ["rage", "destructive"] } }).session
  s = advance(s)
  s = submitAnswer(s, { family: "ordering", response: { order: ["limbo", "lust", "glut", "hoard"] } }).session
  s = advance(s)
  s = submitAnswer(s, { family: "true-false-with-reason", response: { bool: false, reasonId: "r0" } }).session
  s = advance(s)
  s = submitAnswer(s, { family: "reflection", response: { text: "one two three four five six", rubricChecked: ["t1"] } }).session
  s = advance(s)
  s = submitAnswer(s, { family: "short-answer", response: { text: "Agamemnon Briseis dishonor Thetis" } }).session
  s = advance(s)
  s = submitAnswer(s, { family: "find-the-evidence", response: { range: [1, 1] } }).session
  s = advance(s)
  assert.equal(s.status, "complete")
  const sum = summarize(s)
  assert.equal(sum.totalQuestions, 7)
  assert.equal(sum.answeredCorrect, 7)
  assert.equal(sum.elegant, 7)
  assert.equal(sum.bestStreak, 7)
  assert.equal(sum.accuracy, 1)
  assert.equal(sum.wisdomEarned, s.wisdomTotal)
})

test("distractor elimination toggles and is captured in feedback", () => {
  let s = createTrialSession({ items: [mcItem], seed: 1 })
  s = toggleElimination(s, "a")
  s = toggleElimination(s, "d")
  s = toggleElimination(s, "a") // toggle back off
  assert.deepEqual(s.questions[0].eliminated, ["d"])
  const r = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } })
  assert.deepEqual(r.outcome?.feedback.eliminated, ["d"])
})

test("serialize/deserialize round-trips a mid-flight session", () => {
  let s = createTrialSession({ items: [mcItem, fillItem], seed: 99 })
  s = useHint(s).session
  s = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } }).session
  const restored = deserializeSession(serializeSession(s))
  assert.deepEqual(restored, s)
})

test("answered-correct questions reject further submissions (no double-dip)", () => {
  let s = createTrialSession({ items: [mcItem], seed: 1 })
  s = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } }).session
  const before = s.wisdomTotal
  const r = submitAnswer(s, { family: "multiple-choice", response: { optionId: "b" } })
  assert.equal(r.outcome, null)
  assert.equal(r.session.wisdomTotal, before)
})

// ── Types & adapters ─────────────────────────────────────

console.log("\ntypes & adapters")

test("TrialItem schema validates every family fixture", () => {
  for (const item of allItems) {
    const parsed = safeParseTrialItem(item)
    assert.ok(parsed, `fixture ${item.id} should parse`)
    assert.equal(parsed.family, item.family)
  }
})

test("schema rejects items with two correct options", () => {
  const bad = {
    ...mcItem,
    content: { options: [
      { id: "a", text: "x", correct: true },
      { id: "b", text: "y", correct: true },
    ] },
  }
  assert.equal(safeParseTrialItem(bad), null)
})

test("hintLadder orders levels and de-dupes", () => {
  const item: TrialItem = {
    ...mcItem,
    hints: [
      { level: 3, text: "third" },
      { level: 1, text: "first" },
      { level: 1, text: "duplicate ignored" },
    ],
  }
  assert.deepEqual(hintLadder(item).map((h) => h.level), [1, 3])
})

test("fromChapterQuestion maps legacy bank rows onto TrialItems", () => {
  const legacyMcq: ChapterQuestion = {
    id: "seed-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Who quarrels with Achilles?",
    options: ["Hector", "Agamemnon", "Odysseus", "Priam"],
    correctIndex: 1,
    explanation: "Agamemnon seizes Briseis.",
    citation: "Iliad I",
  }
  const item = fromChapterQuestion(legacyMcq)
  assert.ok(item)
  assert.equal(item.family, "multiple-choice")
  assert.equal(item.wisdom, 5)
  assert.equal(item.content.options.find((o) => o.correct)?.text, "Agamemnon")
  // and it grades through the engine
  const g = gradeResponse(item, { family: "multiple-choice", response: { optionId: "opt-1" } })
  assert.equal(g.correct, true)
})

test("fromChapterQuestion returns null for unmappable rows instead of throwing", () => {
  const sparse: ChapterQuestion = {
    id: "bad-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Missing options.",
    explanation: "—",
  }
  assert.equal(fromChapterQuestion(sparse), null)
})

test("fromTypedQuestion preserves legacy content + maps difficulty", () => {
  const item = fromTypedQuestion({
    id: "tq-1",
    type: "fill_the_line",
    prompt: "Complete the line.",
    explanation: "Rage opens the poem.",
    difficulty: "master",
    points: 15,
    flames: 1,
    position: 0,
    content: {
      lines: ["Sing, O goddess, the rage of Achilles"],
      blanks: [{ lineIndex: 0, answer: "rage" }],
      mode: "bank",
      wordBank: ["rage", "pride"],
    },
  })
  assert.equal(item.family, "fill-the-line")
  assert.equal(item.difficulty, "master")
  assert.equal(item.wisdom, 15)
  const g = gradeResponse(item, { family: "fill-the-line", response: { answers: ["Rage"] } })
  assert.equal(g.correct, true)
})

// ── Summary ──────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
