/**
 * Virgil semantic state machine.
 *
 * Pure and typed: no timers, no DOM, no framer-motion. The runtime component
 * (src/components/virgil/Virgil.tsx) feeds it real product events and fires
 * ANIMATION_COMPLETE only when a transient state's animation has finished.
 *
 * - `loop`      — ambient, holds until the next event (idle, readAlong…)
 * - `transient` — plays once, then ANIMATION_COMPLETE returns to `returnTo`
 * - `steady`    — holds indefinitely (sleep, offline, teacherMode…)
 *
 * Every state also declares `still`: the pose the reduced-motion path holds
 * instead of animating. The reduced-motion map therefore covers 100% of
 * states by construction.
 */

import type {
  VirgilCategory,
  VirgilEvent,
  VirgilExpressionId,
  VirgilStateId,
} from "./types"

export type VirgilStateKind = "loop" | "transient" | "steady"

export interface VirgilStateDef {
  id: VirgilStateId
  category: VirgilCategory
  kind: VirgilStateKind
  expression: VirgilExpressionId
  /** ms a transient state holds before ANIMATION_COMPLETE is expected */
  durationMs?: number
  /** state entered when a transient completes (default: idle) */
  returnTo?: VirgilStateId
  /** screen-reader announcement; null = decorative change, stay silent */
  announcement: string | null
  /** human label for the Lab */
  label: string
  /** one-line motion description, mirrored into docs/design/virgil-motion-bible.md */
  motion: string
}

function def(
  id: VirgilStateId,
  category: VirgilCategory,
  kind: VirgilStateKind,
  expression: VirgilExpressionId,
  label: string,
  motion: string,
  announcement: string | null,
  durationMs?: number,
  returnTo?: VirgilStateId,
): VirgilStateDef {
  return { id, category, kind, expression, label, motion, announcement, durationMs, returnTo }
}

export const VIRGIL_STATES: Record<VirgilStateId, VirgilStateDef> = {
  // ── Ambient ──────────────────────────────────────────────────────────
  enter: def("enter", "ambient", "transient", "smile", "Enter",
    "Rises from 8px below with a soft overshoot settle; lantern glow fades up.",
    null, 900, "greet"),
  greet: def("greet", "ambient", "transient", "grin", "Greet",
    "Lantern arm lifts 24° and lowers; small head bow; glow blooms once.",
    "Virgil says hello", 1400),
  idle: def("idle", "ambient", "loop", "smile", "Idle breathe",
    "3.4s breath (body ±3px), lantern sway ±4°, blink every ~4.6s, glow pulse.",
    null),
  glance: def("glance", "ambient", "transient", "curious", "Glance",
    "Pupils travel 5px, head follows 4° after an 80ms delay, then returns.",
    null, 1100),
  readAlong: def("readAlong", "ambient", "loop", "gentle", "Read along",
    "Book open in the free arm; slow 1.5px page-gaze drift; lantern still.",
    "Virgil is reading along with you"),
  lookAtText: def("lookAtText", "ambient", "transient", "curious", "Look toward highlight",
    "Head tilts toward the highlighted line; pupils lock; lantern dips as if to light it.",
    "Virgil is looking at the passage you highlighted", 1600),
  pagePeek: def("pagePeek", "ambient", "transient", "curious", "Page peek",
    "Leans 6° forward, one brow up, book rises 4px — a peek ahead.",
    null, 1300),
  compactIdle: def("compactIdle", "ambient", "loop", "smile", "Compact idle (mobile bust)",
    "Bust crop; breath and blink only; lantern glow rests at 0.5.",
    null),
  sleep: def("sleep", "ambient", "steady", "sleepy", "Sleep / rest (inactive tab)",
    "All loops parked; eyes closed; glow embers down to 0.25. Entered on tab hide.",
    null),

  // ── Conversational ───────────────────────────────────────────────────
  listen: def("listen", "conversational", "steady", "listening", "Listen",
    "Head tilts 7° toward the reader; breathing slows; lantern held low and steady.",
    "Virgil is listening"),
  think: def("think", "conversational", "loop", "thoughtful", "Think",
    "Free hand to chin; eyes drift up-left; lantern swing narrows to ±1.5°.",
    "Virgil is thinking"),
  searchText: def("searchText", "conversational", "loop", "determined", "Search text",
    "Lantern sweeps side to side ±10° like a reading light; eyes track it.",
    "Virgil is searching the text"),
  retrievePassage: def("retrievePassage", "conversational", "transient", "determined", "Retrieve passage",
    "Satchel dips, book rises; a quick 2px nod when the passage lands.",
    "Virgil found the passage", 1500),
  explain: def("explain", "conversational", "loop", "smile", "Explain",
    "Lantern arm gestures in open 6° arcs; mouth cycles speak shapes; head nods on beats.",
    "Virgil is explaining"),
  compare: def("compare", "conversational", "loop", "curious", "Compare two ideas",
    "Lantern arm and book arm rise alternately like scales; head tips with each side.",
    "Virgil is weighing two ideas"),
  pointToEvidence: def("pointToEvidence", "conversational", "transient", "determined", "Point to evidence",
    "Lantern arm extends and holds the line for 1.6s; glow brightens toward the text.",
    "Virgil is pointing to the evidence", 1700),
  whisper: def("whisper", "conversational", "transient", "whisper", "Whisper an aside",
    "Leans 8° closer, free hand at the mouth, glow drops to 0.4 — conspiratorial.",
    "Virgil whispers an aside", 1500),
  socraticQuestion: def("socraticQuestion", "conversational", "transient", "curious", "Ask a Socratic question",
    "Brow lift, head tilt, lantern raised to chin height — the question hangs.",
    "Virgil asks you a question", 1600, "waitForUser"),
  waitForUser: def("waitForUser", "conversational", "steady", "gentle", "Wait for user",
    "Settled and patient: breathing only, no gesturing, no pressure.",
    null),
  acknowledge: def("acknowledge", "conversational", "transient", "smile", "Acknowledge",
    "Single warm nod; glow blips +0.15 for 300ms.",
    null, 900),
  citeParagraph: def("citeParagraph", "conversational", "transient", "proud", "Cite a paragraph",
    "Taps the book twice (2px dips), then points to the cited paragraph.",
    "Virgil cites the paragraph", 1500),

  // ── Hint ladder ──────────────────────────────────────────────────────
  hint1: def("hint1", "hint", "transient", "gentle", "Hint 1 · gentle nudge",
    "Small shoulder-tip and a soft glow rise; deliberately tiny — a nudge, not a shove.",
    "Virgil offers a gentle hint", 1400, "waitForUser"),
  hint2: def("hint2", "hint", "transient", "encouraging", "Hint 2 · narrow the field",
    "Hands draw together 6px as if closing a bracket around fewer choices.",
    "Virgil narrows the field", 1500, "waitForUser"),
  hint3: def("hint3", "hint", "transient", "determined", "Hint 3 · point to evidence",
    "Lantern extends to the exact line and holds; glow peaks at 0.95.",
    "Virgil lights the exact evidence", 1800, "waitForUser"),
  explainFinal: def("explainFinal", "hint", "transient", "proud", "Final explanation",
    "Book opens fully; three slow nod beats while the explanation settles.",
    "Virgil explains the passage in full", 2200),

  // ── Assessment reactions ─────────────────────────────────────────────
  correct: def("correct", "assessment", "transient", "grin", "Correct",
    "Anticipation crouch (squash 0.96) then spring up 4px with glow bloom; settles in 700ms.",
    "Correct", 1300),
  elegantAnswer: def("elegantAnswer", "assessment", "transient", "celebratory", "Elegant answer",
    "Slow impressed lean-back, laurel-bright glow, then a scholar's nod. No frenzy.",
    "A beautiful answer", 1800),
  nearMiss: def("nearMiss", "assessment", "transient", "encouraging", "Near miss",
    "Head tips 5°, hand rises palm-up — 'so close'; glow warms, never dims.",
    "So close — nearly there", 1600, "waitForUser"),
  incorrectEncouraging: def("incorrectEncouraging", "assessment", "transient", "gentle", "Incorrect but encouraging",
    "No recoil, no frown: a calm settling, lantern lowered to reading height, book offered.",
    "Not quite — let's look together", 1700, "waitForUser"),
  timeout: def("timeout", "assessment", "transient", "gentle", "Timeout",
    "Lantern lowers slowly; a patient, unhurried shrug of 2px. Zero penalty energy.",
    "Time ran out — try again when you're ready", 1600, "waitForUser"),
  answerRevised: def("answerRevised", "assessment", "transient", "curious", "Answer revised",
    "Quick interested lean-in; eyes flick to the new answer; small approving nod.",
    "Answer revised", 1200),
  streak: def("streak", "assessment", "transient", "celebratory", "Streak of correct answers",
    "Two-beat glow pulse like a quiet drum; lantern lifts in measured arcs — pride, not panic.",
    "You're on a streak", 1800),
  mastery: def("mastery", "assessment", "transient", "proud", "Mastery achieved",
    "Full lantern raise held for 1s at peak glow; deep bow of the hood; settle to calm.",
    "Mastery achieved", 2400),

  // ── Reward reactions ─────────────────────────────────────────────────
  wisdomEarned: def("wisdomEarned", "reward", "transient", "smile", "Wisdom earned",
    "Gold motes rise 12px beside the lantern; Virgil watches them up with a smile.",
    "Wisdom earned", 1500),
  dailyGoalAdvanced: def("dailyGoalAdvanced", "reward", "transient", "smile", "Daily goal advanced",
    "One measured step forward (4px) and a nod; progress marked, not fireworks.",
    "Daily goal advanced", 1200),
  flameAtRisk: def("flameAtRisk", "reward", "steady", "gentle", "Flame at risk",
    "Lantern glow rests at 0.35 — low, never out. No sad eyes, no guilt posture.",
    "Your Flame is resting until you read again"),
  flameSecured: def("flameSecured", "reward", "transient", "grin", "Flame secured",
    "Glow ignites 0.35 → 0.9 in one clean rise; a satisfied single nod.",
    "Flame secured for today", 1400),
  chapterComplete: def("chapterComplete", "reward", "transient", "proud", "Chapter complete",
    "Book closes with a 2px settle; lantern raised once; a long contented exhale (squash 1.02 → 1).",
    "Chapter complete", 2000),
  levelUp: def("levelUp", "reward", "transient", "celebratory", "Level up",
    "Staggered: glow bloom, then rise 6px, then laurel-flash at the hood — three beats, not confetti.",
    "Level up", 2200),
  sealReveal: def("sealReveal", "reward", "transient", "celebratory", "Seal reveal",
    "Lantern lifted high and held; glow peaks at 1 for 1.2s so the Seal can resonate.",
    "A Seal is revealed", 2400),
  stoaRestoration: def("stoaRestoration", "reward", "transient", "proud", "Stoa restoration",
    "Virgil turns toward the restored stone, lantern sweeping a slow 12° arc across it.",
    "The Stoa is a little more whole", 2100),
  bookComplete: def("bookComplete", "reward", "transient", "celebratory", "Book complete",
    "Book pressed to the chest, eyes closed for one beat, then a lantern-raise finale.",
    "Book complete — congratulations", 2600),
  journeyComplete: def("journeyComplete", "reward", "transient", "celebratory", "14-day journey complete",
    "The fullest arc: enter-rise, glow crescendo, deep bow, and a held 1.4s still of gratitude.",
    "Journey complete. Remarkable reading.", 3000),

  // ── System ───────────────────────────────────────────────────────────
  loading: def("loading", "system", "loop", "neutral", "Loading",
    "Lantern swings a slow pendulum ±6°; eyes follow — a honest 'working' tell, not a spinner.",
    "Loading"),
  offline: def("offline", "system", "steady", "gentle", "Offline",
    "Glow dims to 0.3; book open — what is on the device still works. Calm, not broken.",
    "You are offline. Downloaded chapters still work."),
  rateLimited: def("rateLimited", "system", "steady", "thoughtful", "Rate-limited",
    "Hand raised palm-out at half height; a patient 'one moment' hold.",
    "Virgil needs a short pause before the next question"),
  contentUnavailable: def("contentUnavailable", "system", "steady", "concerned", "Content unavailable",
    "Satchel shown open and empty for a beat; apologetic half-shrug; alternative offered.",
    "That passage isn't available yet"),
  safeBoundary: def("safeBoundary", "system", "steady", "gentle", "Safe-response boundary",
    "Lantern lowered, posture upright and kind; a clear, calm still — no scolding.",
    "Virgil gently keeps the conversation to the text"),
  mutedAck: def("mutedAck", "system", "transient", "smile", "Muted / sound-off acknowledgment",
    "A small nod and a lantern dim-blip acknowledging quiet mode.",
    "Sound off", 900),
  teacherMode: def("teacherMode", "system", "steady", "proud", "Teacher mode",
    "Steps 6px to the side and lowers the lantern — present, but the students do the reading.",
    "Teacher view"),
  parentMode: def("parentMode", "system", "steady", "gentle", "Parent mode",
    "Book open toward the viewer like a report shared across a table; steady and plain.",
    "Parent view"),
  welcomeBack: def("welcomeBack", "system", "transient", "grin", "Welcome back after absence",
    "Glow rekindles from 0.3 to full as Virgil rises — warmth without a tally of missed days.",
    "Welcome back", 1600),
}

export const VIRGIL_STATE_IDS = Object.keys(VIRGIL_STATES) as VirgilStateId[]

export interface VirgilTransition {
  state: VirgilStateId
  /** announcement to place in the live region, or null to stay silent */
  announcement: string | null
  /** true when the event was a no-op for the current state */
  unchanged: boolean
}

function to(state: VirgilStateId): VirgilTransition {
  return { state, announcement: VIRGIL_STATES[state].announcement, unchanged: false }
}

const stay = (current: VirgilStateId): VirgilTransition => ({
  state: current,
  announcement: null,
  unchanged: true,
})

/**
 * The transition table. Any event not listed for a state is ignored
 * (unchanged) — product code can dispatch freely without guarding.
 */
export function reduceVirgil(current: VirgilStateId, event: VirgilEvent): VirgilTransition {
  // Universal interrupts — honored from every state.
  switch (event.type) {
    case "APP_HIDDEN":
      return to("sleep")
    case "RESET":
      return to("idle")
    case "OFFLINE":
      return to("offline")
    case "LOADING":
      return to("loading")
    case "ERROR":
      return event.recoverable ? to("loading") : to("contentUnavailable")
  }

  if (current === "sleep") {
    // Only explicit waking events leave sleep.
    if (event.type === "APP_VISIBLE") return to("welcomeBack")
    if (event.type === "WELCOME_BACK") return to("welcomeBack")
    if (event.type === "APP_ENTER") return to("enter")
    return stay(current)
  }

  if (event.type === "ANIMATION_COMPLETE") {
    const defn = VIRGIL_STATES[current]
    if (defn.kind === "transient") {
      const next = defn.returnTo ?? "idle"
      return { state: next, announcement: VIRGIL_STATES[next].kind === "steady" ? VIRGIL_STATES[next].announcement : null, unchanged: false }
    }
    return stay(current)
  }

  switch (event.type) {
    case "APP_ENTER":
      return event.context?.returning ? to("welcomeBack") : to("enter")
    case "GREET":
      return to("greet")
    case "IDLE":
      return to(current === "compactIdle" ? "compactIdle" : "idle")
    case "GLANCE":
      return to("glance")
    case "READ_ALONG_STARTED":
      return to("readAlong")
    case "TEXT_HIGHLIGHTED":
      return to("lookAtText")
    case "PAGE_PEEK":
      return to("pagePeek")
    case "ASK_STARTED":
      return to("listen")
    case "ASK_STREAMING":
      if (event.phase === "thinking") return to("think")
      if (event.phase === "retrieving") return to("retrievePassage")
      return to("explain")
    case "SEARCH_TEXT":
      return to("searchText")
    case "EXPLAIN":
      return to("explain")
    case "COMPARE_IDEAS":
      return to("compare")
    case "POINT_TO_EVIDENCE":
      return to("pointToEvidence")
    case "WHISPER_ASIDE":
      return to("whisper")
    case "SOCRATIC_QUESTION":
      return to("socraticQuestion")
    case "WAIT_FOR_USER":
      return to("waitForUser")
    case "ACKNOWLEDGE":
      return to("acknowledge")
    case "CITE_PARAGRAPH":
      return to("citeParagraph")
    case "HINT_USED":
      return to(event.level === 1 ? "hint1" : event.level === 2 ? "hint2" : "hint3")
    case "FINAL_EXPLANATION":
      return to("explainFinal")
    case "ANSWER_CORRECT":
      return event.streak >= 3 ? to("streak") : to("correct")
    case "ANSWER_ELEGANT":
      return to("elegantAnswer")
    case "ANSWER_NEAR_MISS":
      return to("nearMiss")
    case "ANSWER_INCORRECT":
      return to("incorrectEncouraging")
    case "ANSWER_TIMEOUT":
      return to("timeout")
    case "ANSWER_REVISED":
      return to("answerRevised")
    case "MASTERY_ACHIEVED":
      return to("mastery")
    case "WISDOM_EARNED":
      return to("wisdomEarned")
    case "DAILY_GOAL_ADVANCED":
      return to("dailyGoalAdvanced")
    case "FLAME_AT_RISK":
      return to("flameAtRisk")
    case "FLAME_SECURED":
      return to("flameSecured")
    case "CHAPTER_COMPLETE":
      return to("chapterComplete")
    case "LEVEL_UP":
      return to("levelUp")
    case "SEAL_UNLOCKED":
      return to("sealReveal")
    case "STOA_RESTORED":
      return to("stoaRestoration")
    case "BOOK_COMPLETE":
      return to("bookComplete")
    case "JOURNEY_COMPLETE":
      return to("journeyComplete")
    case "ONLINE_RESTORED":
      return to("welcomeBack")
    case "RATE_LIMITED":
      return to("rateLimited")
    case "CONTENT_UNAVAILABLE":
      return to("contentUnavailable")
    case "SAFE_BOUNDARY":
      return to("safeBoundary")
    case "SOUND_TOGGLED":
      return event.muted ? to("mutedAck") : to("acknowledge")
    case "MODE_CHANGED":
      if (event.mode === "teacher") return to("teacherMode")
      if (event.mode === "parent") return to("parentMode")
      return to("idle")
    case "WELCOME_BACK":
      return to("welcomeBack")
    case "APP_VISIBLE":
      // sleep already returns above; from any other state this is a no-op
      return stay(current)
    default:
      return stay(current)
  }
}

/**
 * Reduced-motion mapping: every animated state resolves to a still pose.
 * Loops park at their rest pose; transients park at their *meaning* pose
 * (e.g. hint3 still points at the evidence) for a quiet beat before the
 * state machine settles — so semantics survive with zero motion.
 */
export const VIRGIL_REDUCED_MOTION_STILLS: Record<VirgilStateId, VirgilStateId> =
  VIRGIL_STATE_IDS.reduce(
    (acc, id) => {
      // The still of a state is the state itself rendered without animation.
      // Recorded explicitly so the mapping is auditable and total.
      acc[id] = id
      return acc
    },
    {} as Record<VirgilStateId, VirgilStateId>,
  )

export function virgilStatesByCategory(category: VirgilCategory): VirgilStateDef[] {
  return VIRGIL_STATE_IDS.map((id) => VIRGIL_STATES[id]).filter(
    (s) => s.category === category,
  )
}
