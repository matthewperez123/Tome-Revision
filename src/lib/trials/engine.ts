/**
 * Trial Engine — pure, deterministic session runtime.
 *
 * No I/O, no React, no timers: the caller supplies items and persistence
 * callbacks; the engine owns progress, scoring, Wisdom awards, retry rules,
 * distractor-elimination state, hint state, per-question feedback
 * (correct / elegant / near-miss / incorrect-encouraging) and the completion
 * summary. Every mutation returns a NEW session object — state is a plain
 * JSON-serializable value so it can be persisted or replayed at any point.
 *
 * Determinism: `seed` drives a mulberry32 PRNG. Option/display order derives
 * from (seed, itemId) only, so showcase demos replay identically.
 *
 * Anti-punishment rule: there are no lives and no lockouts. A wrong answer
 * costs nothing but the Wisdom bonus for that question; retries are always
 * available and reading is never gated on Trial performance.
 */
import type { VirgilEvent } from "@/lib/virgil/types"
import { normalizeText } from "./question-types"
import {
  validateFillTheLine,
  validateFindTheEvidence,
  validateMatchPairs,
  validateRecitation,
  validateWhoSaidIt,
  validateWordInContext,
} from "./validators"
import {
  LEGACY_TYPE_BY_FAMILY,
  type FamilyTaggedResponse,
  type Hint,
  type TrialFamily,
  type TrialItem,
  type TrialResponseByFamily,
} from "./types"

// ── Seeded RNG ───────────────────────────────────────────

/** FNV-1a hash → uint32 seed. */
export function hashSeed(seed: string | number): number {
  const s = String(seed)
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** mulberry32 — tiny deterministic PRNG. Returns [value 0..1, nextState]. */
export function nextRandom(state: number): [number, number] {
  const t = (state + 0x6d2b79f5) >>> 0
  let r = t
  r = Math.imul(r ^ (r >>> 15), r | 1)
  r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
  return [((r ^ (r >>> 14)) >>> 0) / 4294967296, t]
}

/** Deterministic Fisher–Yates shuffle keyed on (seed, key). */
export function seededShuffle<T>(arr: readonly T[], seed: string | number, key: string): T[] {
  let state = hashSeed(`${seed}::${key}`)
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const [r, next] = nextRandom(state)
    state = next
    const j = Math.floor(r * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Display order for a list of option ids — stable for a given (session seed,
 * itemId). Renderers call this instead of Math.random so demos replay.
 */
export function optionOrder(ids: readonly string[], seed: string | number, itemId: string): string[] {
  return seededShuffle(ids, seed, `options:${itemId}`)
}

// ── Rules ────────────────────────────────────────────────

export interface TrialRules {
  /**
   * Wisdom fraction forfeited per hint level revealed, indexed by level
   * (L1 gentle nudge · L2 narrow the field · L3 point to evidence).
   * Penalties stack but are capped by `maxHintPenalty`.
   */
  hintPenalty: readonly [number, number, number]
  /** Hard cap on total hint penalty so help never zeroes the award. */
  maxHintPenalty: number
  /** Multiplier applied per prior failed attempt (retry decay). */
  retryMultiplier: number
  /** Bonus multiplier for an elegant answer (first try, no hints). */
  elegantBonus: number
  /** Minimum Wisdom a correct answer ever earns (never zero). */
  minWisdomFloor: number
  /** Keyword coverage needed for short-answer full credit. */
  shortAnswerFullCredit: number
  /** Keyword coverage at/above which short-answer is a near-miss. */
  shortAnswerNearMiss: number
}

export const DEFAULT_TRIAL_RULES: TrialRules = {
  hintPenalty: [0.1, 0.25, 0.4],
  maxHintPenalty: 0.6,
  retryMultiplier: 0.5,
  elegantBonus: 1.25,
  minWisdomFloor: 1,
  shortAnswerFullCredit: 0.75,
  shortAnswerNearMiss: 0.4,
}

// ── Session state ────────────────────────────────────────

export type FeedbackKind = "correct" | "elegant" | "near-miss" | "incorrect"

export interface QuestionFeedback {
  kind: FeedbackKind
  /** Encouraging, kind-specific line shown with the rationale. */
  message: string
  /** The item's rationale, echoed for convenience. */
  rationale: string
  /** Option ids ruled out by hints/elimination at answer time. */
  eliminated: string[]
  wisdomAwarded: number
  attempts: number
  hintsUsed: number[]
}

export type QuestionStatus = "pending" | "answered-wrong" | "answered-near-miss" | "correct"

export interface QuestionState {
  itemId: string
  status: QuestionStatus
  attempts: number
  /** Hint levels revealed so far, ascending (1|2|3). */
  hintsUsed: number[]
  /** Option/item ids the learner ruled out (distractor elimination). */
  eliminated: string[]
  wisdomEarned: number
  feedback: QuestionFeedback | null
}

export interface CompletionSummary {
  totalQuestions: number
  answeredCorrect: number
  /** First-try correct count. */
  firstTryCorrect: number
  elegant: number
  nearMisses: number
  hintsUsed: number
  wisdomEarned: number
  wisdomPossible: number
  bestStreak: number
  accuracy: number
}

export interface TrialSession {
  seed: string | number
  rules: TrialRules
  items: TrialItem[]
  index: number
  questions: QuestionState[]
  streak: number
  bestStreak: number
  wisdomTotal: number
  status: "in-progress" | "complete"
}

// ── Outcomes ─────────────────────────────────────────────

export interface AnswerOutcome {
  kind: FeedbackKind
  wisdomAwarded: number
  correct: boolean
  /** Virgil events to dispatch, in order. Empty array when no-op. */
  virgilEvents: VirgilEvent[]
  feedback: QuestionFeedback
}

export interface StepResult {
  session: TrialSession
  outcome: AnswerOutcome | null
  virgilEvents: VirgilEvent[]
}

// ── Grading (pure, per family) ───────────────────────────

type Grade = { correct: boolean; nearMiss: boolean }

function gradeChoice(
  options: readonly { id: string; correct: boolean; nearMiss?: boolean }[],
  optionId: string
): Grade {
  const chosen = options.find((o) => o.id === optionId)
  if (!chosen) return { correct: false, nearMiss: false }
  return { correct: chosen.correct, nearMiss: !chosen.correct && chosen.nearMiss === true }
}

function gradeOrdering(
  items: readonly { id: string }[],
  correctOrder: readonly string[],
  order: readonly string[]
): Grade {
  if (order.length !== correctOrder.length) return { correct: false, nearMiss: false }
  const validIds = new Set(items.map((i) => i.id))
  if (order.some((id) => !validIds.has(id))) return { correct: false, nearMiss: false }
  const correct = correctOrder.every((id, i) => order[i] === id)
  if (correct) return { correct: true, nearMiss: false }
  // Near-miss: at least half the items are already in their final position.
  const inPlace = correctOrder.filter((id, i) => order[i] === id).length
  return { correct: false, nearMiss: inPlace >= Math.ceil(correctOrder.length / 2) }
}

function gradeFillTheLine(
  content: Extract<TrialItem, { family: "fill-the-line" }>["content"],
  response: TrialResponseByFamily["fill-the-line"]
): Grade {
  const correct = validateFillTheLine(content, response)
  if (correct) return { correct: true, nearMiss: false }
  const hits = content.blanks.filter(
    (b, i) => normalizeText(response.answers[i] ?? "") === normalizeText(b.answer)
  ).length
  return { correct: false, nearMiss: hits > 0 && hits >= Math.ceil(content.blanks.length / 2) }
}

function gradeFindTheEvidence(
  content: Extract<TrialItem, { family: "find-the-evidence" }>["content"],
  response: TrialResponseByFamily["find-the-evidence"]
): Grade {
  const [cs, ce] = content.correctRange
  const [rs, re] = response.range
  const exact = rs === cs && re === ce
  if (exact) return { correct: true, nearMiss: false }
  const overlap = validateFindTheEvidence(content, response)
  return { correct: false, nearMiss: overlap }
}

function gradeShortAnswer(
  content: Extract<TrialItem, { family: "short-answer" }>["content"],
  response: TrialResponseByFamily["short-answer"],
  rules: TrialRules
): Grade {
  const text = normalizeText(response.text)
  if (!text) return { correct: false, nearMiss: false }
  if (content.acceptedKeywords.length === 0) {
    return { correct: true, nearMiss: false } // no key → any attempt earns
  }
  const hits = content.acceptedKeywords.filter((k) => text.includes(normalizeText(k))).length
  const coverage = hits / content.acceptedKeywords.length
  const needed =
    content.minKeywords !== undefined
      ? Math.min(1, content.minKeywords / content.acceptedKeywords.length)
      : rules.shortAnswerFullCredit
  if (coverage >= needed) return { correct: true, nearMiss: false }
  return { correct: false, nearMiss: coverage >= rules.shortAnswerNearMiss }
}

function gradeReflection(
  content: Extract<TrialItem, { family: "reflection" }>["content"],
  response: TrialResponseByFamily["reflection"]
): Grade {
  const words = response.text.trim().split(/\s+/).filter(Boolean).length
  // Reflections are never "incorrect" — an earnest attempt completes.
  const correct = words >= content.minWords
  return { correct, nearMiss: !correct && words >= Math.ceil(content.minWords / 2) }
}

/** Grade any family-tagged response against its item. */
export function gradeResponse(
  item: TrialItem,
  tagged: FamilyTaggedResponse,
  rules: TrialRules = DEFAULT_TRIAL_RULES
): Grade {
  switch (item.family) {
    case "fill-the-line":
      return gradeFillTheLine(item.content, (tagged as { response: TrialResponseByFamily["fill-the-line"] }).response)
    case "find-the-evidence":
      return gradeFindTheEvidence(item.content, (tagged as { response: TrialResponseByFamily["find-the-evidence"] }).response)
    case "word-in-context": {
      const r = (tagged as { response: TrialResponseByFamily["word-in-context"] }).response
      const correct = validateWordInContext(item.content, r)
      return { correct, nearMiss: false }
    }
    case "match-pairs": {
      const r = (tagged as { response: TrialResponseByFamily["match-pairs"] }).response
      const correct = validateMatchPairs(item.content, r)
      if (correct) return { correct: true, nearMiss: false }
      const hits = item.content.pairs.filter(
        (p) => normalizeText(r.pairs[p.left] ?? "") === normalizeText(p.right)
      ).length
      return { correct: false, nearMiss: hits > 0 && hits >= Math.ceil(item.content.pairs.length / 2) }
    }
    case "who-said-it": {
      const r = (tagged as { response: TrialResponseByFamily["who-said-it"] }).response
      return { correct: validateWhoSaidIt(item.content, r), nearMiss: false }
    }
    case "recitation": {
      const r = (tagged as { response: TrialResponseByFamily["recitation"] }).response
      const correct = validateRecitation(item.content, r)
      if (correct) return { correct: true, nearMiss: false }
      // Near-miss: ≥70% of tokens recalled in order.
      const target = item.content.tokens.map(normalizeText)
      const given = normalizeText(r.text).split(" ").filter(Boolean)
      const hits = target.filter((t, i) => given[i] === t).length
      return { correct: false, nearMiss: hits / target.length >= 0.7 }
    }
    case "multiple-choice":
    case "close-reading":
    case "passage-identification":
    case "vocabulary-in-context":
    case "cross-reference":
      return gradeChoice(item.content.options, (tagged as { response: { optionId: string } }).response.optionId)
    case "true-false-with-reason": {
      const r = (tagged as { response: TrialResponseByFamily["true-false-with-reason"] }).response
      const boolRight = r.bool === item.content.correctBool
      const reason = gradeChoice(item.content.reasons, r.reasonId)
      if (boolRight && reason.correct) return { correct: true, nearMiss: false }
      // Right verdict, wrong reason (or vice versa) is the classic near-miss.
      return { correct: false, nearMiss: boolRight || reason.correct }
    }
    case "ordering":
      return gradeOrdering(item.content.items, item.content.correctOrder, (tagged as { response: TrialResponseByFamily["ordering"] }).response.order)
    case "reflection":
      return gradeReflection(item.content, (tagged as { response: TrialResponseByFamily["reflection"] }).response)
    case "short-answer":
      return gradeShortAnswer(item.content, (tagged as { response: TrialResponseByFamily["short-answer"] }).response, rules)
  }
}

// ── Feedback copy (always kind — the anti-punishment rule) ──

const FEEDBACK_LINES: Record<FeedbackKind, string[]> = {
  elegant: [
    "Elegant — first try, no lantern needed.",
    "Beautifully done. The text holds no secrets from you.",
  ],
  correct: [
    "Correct — well read.",
    "Yes. The passage agrees with you.",
  ],
  "near-miss": [
    "So close — you are circling the right idea. Look again.",
    "Nearly there. One detail turns the lock.",
  ],
  incorrect: [
    "Not quite — and that is fine. The text waits for you; try again.",
    "A good wrong answer teaches more than a lucky right one. Once more?",
  ],
}

function feedbackMessage(kind: FeedbackKind, seed: string | number, itemId: string): string {
  const lines = FEEDBACK_LINES[kind]
  const [r] = nextRandom(hashSeed(`${seed}::feedback:${itemId}:${kind}`))
  return lines[Math.floor(r * lines.length)] ?? lines[0]
}

// ── Engine API ───────────────────────────────────────────

export interface CreateSessionOptions {
  items: TrialItem[]
  /** Deterministic seed — same seed + same items replays identically. */
  seed?: string | number
  rules?: Partial<TrialRules>
  /**
   * Called after every state transition with the new session. Persistence
   * lives with the caller — the engine never writes anywhere itself.
   */
  onChange?: (session: TrialSession) => void
}

export function createTrialSession(options: CreateSessionOptions): TrialSession {
  const rules = { ...DEFAULT_TRIAL_RULES, ...options.rules }
  return {
    seed: options.seed ?? "tome",
    rules,
    items: options.items,
    index: 0,
    questions: options.items.map((item) => ({
      itemId: item.id,
      status: "pending",
      attempts: 0,
      hintsUsed: [],
      eliminated: [],
      wisdomEarned: 0,
      feedback: null,
    })),
    streak: 0,
    bestStreak: 0,
    wisdomTotal: 0,
    status: "in-progress",
  }
}

export function currentItem(session: TrialSession): TrialItem | null {
  return session.items[session.index] ?? null
}

export function currentQuestion(session: TrialSession): QuestionState | null {
  return session.questions[session.index] ?? null
}

/** Ordered hint ladder for an item (L1 → L2 → L3), at most one per level. */
export function hintLadder(item: TrialItem): Hint[] {
  const byLevel = new Map<number, Hint>()
  for (const h of item.hints) if (!byLevel.has(h.level)) byLevel.set(h.level, h)
  return [...byLevel.values()].sort((a, b) => a.level - b.level)
}

/** The next hint available for the current question, or null when exhausted. */
export function nextHint(session: TrialSession): Hint | null {
  const item = currentItem(session)
  const q = currentQuestion(session)
  if (!item || !q) return null
  return hintLadder(item).find((h) => !q.hintsUsed.includes(h.level)) ?? null
}

function replaceQuestion(session: TrialSession, q: QuestionState): TrialSession {
  const questions = session.questions.map((existing, i) => (i === session.index ? q : existing))
  return { ...session, questions }
}

function hintPenaltyFor(levels: readonly number[], rules: TrialRules): number {
  const raw = levels.reduce((sum, l) => sum + (rules.hintPenalty[l - 1] ?? 0), 0)
  return Math.min(rules.maxHintPenalty, raw)
}

/** Reveal the next hint level on the current question. */
export function useHint(session: TrialSession): StepResult {
  const item = currentItem(session)
  const q = currentQuestion(session)
  const hint = nextHint(session)
  if (!item || !q || !hint || q.status === "correct") {
    return { session, outcome: null, virgilEvents: [] }
  }
  const nextQ: QuestionState = { ...q, hintsUsed: [...q.hintsUsed, hint.level].sort() }
  return {
    session: replaceQuestion(session, nextQ),
    outcome: null,
    virgilEvents: [{ type: "HINT_USED", level: hint.level as 1 | 2 | 3 }],
  }
}

/** Toggle distractor elimination for an option/item id on the current question. */
export function toggleElimination(session: TrialSession, optionId: string): TrialSession {
  const q = currentQuestion(session)
  if (!q || q.status === "correct") return session
  const eliminated = q.eliminated.includes(optionId)
    ? q.eliminated.filter((id) => id !== optionId)
    : [...q.eliminated, optionId]
  return replaceQuestion(session, { ...q, eliminated })
}

/** Reset the current question for another attempt (retry — never a lockout). */
export function retryQuestion(session: TrialSession): TrialSession {
  const q = currentQuestion(session)
  if (!q || q.status === "pending" || q.status === "correct") return session
  return replaceQuestion(session, { ...q, status: "pending", feedback: null })
}

/** Submit a response for the current question. */
export function submitAnswer(session: TrialSession, tagged: FamilyTaggedResponse): StepResult {
  const item = currentItem(session)
  const q = currentQuestion(session)
  if (!item || !q || q.status === "correct" || session.status === "complete") {
    return { session, outcome: null, virgilEvents: [] }
  }

  const grade = gradeResponse(item, tagged, session.rules)
  const attempts = q.attempts + 1
  const virgilEvents: VirgilEvent[] = []

  let kind: FeedbackKind
  let wisdomAwarded = 0
  let status: QuestionStatus
  let streak = session.streak
  let bestStreak = session.bestStreak

  if (grade.correct) {
    const elegant = attempts === 1 && q.hintsUsed.length === 0
    kind = elegant ? "elegant" : "correct"
    const penalty = hintPenaltyFor(q.hintsUsed, session.rules)
    const retryDecay = Math.pow(session.rules.retryMultiplier, attempts - 1)
    const raw = item.wisdom * (elegant ? session.rules.elegantBonus : 1) * (1 - penalty) * retryDecay
    wisdomAwarded = Math.max(session.rules.minWisdomFloor, Math.round(raw))
    status = "correct"
    streak = session.streak + 1
    bestStreak = Math.max(session.bestStreak, streak)
    virgilEvents.push(
      elegant ? { type: "ANSWER_ELEGANT" } : { type: "ANSWER_CORRECT", streak },
      { type: "WISDOM_EARNED", amount: wisdomAwarded }
    )
  } else if (grade.nearMiss) {
    kind = "near-miss"
    status = "answered-near-miss"
    streak = 0
    virgilEvents.push({ type: "ANSWER_NEAR_MISS" })
  } else {
    kind = "incorrect"
    status = "answered-wrong"
    streak = 0
    virgilEvents.push({ type: "ANSWER_INCORRECT" })
  }

  const feedback: QuestionFeedback = {
    kind,
    message: feedbackMessage(kind, session.seed, item.id),
    rationale: item.rationale,
    eliminated: q.eliminated,
    wisdomAwarded,
    attempts,
    hintsUsed: q.hintsUsed,
  }

  const nextQ: QuestionState = {
    ...q,
    status,
    attempts,
    wisdomEarned: q.wisdomEarned + wisdomAwarded,
    feedback,
  }

  const nextSession: TrialSession = {
    ...replaceQuestion(session, nextQ),
    streak,
    bestStreak,
    wisdomTotal: session.wisdomTotal + wisdomAwarded,
  }

  return { session: nextSession, outcome: { kind, wisdomAwarded, correct: grade.correct, virgilEvents, feedback }, virgilEvents }
}

/** Move to the next question; completes the session after the last one. */
export function advance(session: TrialSession): TrialSession {
  if (session.index >= session.items.length - 1) {
    return { ...session, status: "complete" }
  }
  return { ...session, index: session.index + 1 }
}

/** Jump to a specific question (review/navigation), clamped in range. */
export function goTo(session: TrialSession, index: number): TrialSession {
  const clamped = Math.max(0, Math.min(session.items.length - 1, index))
  return { ...session, index: clamped, status: "in-progress" }
}

/** Completion summary — safe to call at any point (partial until complete). */
export function summarize(session: TrialSession): CompletionSummary {
  const answered = session.questions.filter((q) => q.attempts > 0)
  const correctQs = session.questions.filter((q) => q.status === "correct")
  const firstTry = correctQs.filter((q) => q.attempts === 1)
  const elegant = session.questions.filter((q) => q.feedback?.kind === "elegant")
  const nearMisses = session.questions.reduce(
    (n, q) => n + (q.status === "answered-near-miss" ? 1 : 0) + (q.feedback?.kind === "near-miss" ? 1 : 0) - (q.status === "answered-near-miss" && q.feedback?.kind === "near-miss" ? 1 : 0),
    0
  )
  const hintsUsed = session.questions.reduce((n, q) => n + q.hintsUsed.length, 0)
  const wisdomPossible = session.items.reduce((n, item) => n + item.wisdom, 0)
  return {
    totalQuestions: session.items.length,
    answeredCorrect: correctQs.length,
    firstTryCorrect: firstTry.length,
    elegant: elegant.length,
    nearMisses,
    hintsUsed,
    wisdomEarned: session.wisdomTotal,
    wisdomPossible,
    bestStreak: session.bestStreak,
    accuracy: answered.length === 0 ? 0 : firstTry.length / session.items.length,
  }
}

/** Serialize → restore (persistence is the caller's; state is plain JSON). */
export function serializeSession(session: TrialSession): string {
  return JSON.stringify(session)
}

export function deserializeSession(json: string): TrialSession {
  const parsed = JSON.parse(json) as TrialSession
  return { ...parsed, rules: { ...DEFAULT_TRIAL_RULES, ...parsed.rules } }
}

/** True when the family is one of the six legacy types (for adapter routing). */
export function isLegacyFamily(family: TrialFamily): family is keyof typeof LEGACY_TYPE_BY_FAMILY {
  return family in LEGACY_TYPE_BY_FAMILY
}
