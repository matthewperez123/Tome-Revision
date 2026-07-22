/**
 * Virgil type foundation.
 *
 * Shared by the state machine (src/lib/virgil/state-machine.ts), the runtime
 * component (src/components/virgil/Virgil.tsx), and the Virgil Lab.
 */

export type VirgilCategory =
  | "ambient"
  | "conversational"
  | "hint"
  | "assessment"
  | "reward"
  | "system"

export type VirgilStateId =
  // Ambient
  | "enter"
  | "greet"
  | "idle"
  | "glance"
  | "readAlong"
  | "lookAtText"
  | "pagePeek"
  | "compactIdle"
  | "sleep"
  // Conversational
  | "listen"
  | "think"
  | "searchText"
  | "retrievePassage"
  | "explain"
  | "compare"
  | "pointToEvidence"
  | "whisper"
  | "socraticQuestion"
  | "waitForUser"
  | "acknowledge"
  | "citeParagraph"
  // Hint ladder
  | "hint1"
  | "hint2"
  | "hint3"
  | "explainFinal"
  // Assessment reactions
  | "correct"
  | "elegantAnswer"
  | "nearMiss"
  | "incorrectEncouraging"
  | "timeout"
  | "answerRevised"
  | "streak"
  | "mastery"
  // Reward reactions
  | "wisdomEarned"
  | "dailyGoalAdvanced"
  | "flameAtRisk"
  | "flameSecured"
  | "chapterComplete"
  | "levelUp"
  | "sealReveal"
  | "stoaRestoration"
  | "bookComplete"
  | "journeyComplete"
  // System
  | "loading"
  | "offline"
  | "rateLimited"
  | "contentUnavailable"
  | "safeBoundary"
  | "mutedAck"
  | "teacherMode"
  | "parentMode"
  | "welcomeBack"

/**
 * Product-event API. Virgil is driven by these semantic events — never by
 * arbitrary timers. The single internal event, ANIMATION_COMPLETE, is fired
 * by the runtime only when a transient state's animation has actually
 * finished (or its reduced-motion still has been shown for its beat).
 */
export type VirgilEvent =
  | { type: "APP_ENTER"; context?: { bookId?: string; returning?: boolean; compact?: boolean } }
  | { type: "GREET" }
  | { type: "IDLE" }
  | { type: "GLANCE"; direction?: "left" | "right" }
  | { type: "READ_ALONG_STARTED" }
  | { type: "TEXT_HIGHLIGHTED"; quote: string; paragraphId: string }
  | { type: "PAGE_PEEK" }
  | { type: "ASK_STARTED" }
  | { type: "ASK_STREAMING"; phase: "thinking" | "retrieving" | "answering" }
  | { type: "SEARCH_TEXT" }
  | { type: "EXPLAIN" }
  | { type: "COMPARE_IDEAS" }
  | { type: "POINT_TO_EVIDENCE"; paragraphId?: string }
  | { type: "WHISPER_ASIDE" }
  | { type: "SOCRATIC_QUESTION" }
  | { type: "WAIT_FOR_USER" }
  | { type: "ACKNOWLEDGE" }
  | { type: "CITE_PARAGRAPH"; paragraphId: string }
  | { type: "HINT_USED"; level: 1 | 2 | 3 }
  | { type: "FINAL_EXPLANATION" }
  | { type: "ANSWER_CORRECT"; streak: number }
  | { type: "ANSWER_ELEGANT" }
  | { type: "ANSWER_NEAR_MISS" }
  | { type: "ANSWER_INCORRECT" }
  | { type: "ANSWER_TIMEOUT" }
  | { type: "ANSWER_REVISED" }
  | { type: "MASTERY_ACHIEVED" }
  | { type: "WISDOM_EARNED"; amount: number }
  | { type: "DAILY_GOAL_ADVANCED"; progress: number }
  | { type: "FLAME_AT_RISK" }
  | { type: "FLAME_SECURED" }
  | { type: "CHAPTER_COMPLETE" }
  | { type: "LEVEL_UP"; level: number }
  | { type: "SEAL_UNLOCKED"; sealId: string }
  | { type: "STOA_RESTORED"; rewardId: string }
  | { type: "BOOK_COMPLETE" }
  | { type: "JOURNEY_COMPLETE" }
  | { type: "LOADING" }
  | { type: "OFFLINE" }
  | { type: "ONLINE_RESTORED" }
  | { type: "RATE_LIMITED" }
  | { type: "CONTENT_UNAVAILABLE" }
  | { type: "SAFE_BOUNDARY" }
  | { type: "SOUND_TOGGLED"; muted: boolean }
  | { type: "MODE_CHANGED"; mode: "teacher" | "parent" | "reader" }
  | { type: "ERROR"; recoverable: boolean }
  | { type: "APP_HIDDEN" }
  | { type: "APP_VISIBLE" }
  | { type: "WELCOME_BACK"; daysAway?: number }
  | { type: "ANIMATION_COMPLETE" }
  | { type: "RESET" }

export type VirgilExpressionId =
  | "neutral"
  | "smile"
  | "grin"
  | "curious"
  | "thoughtful"
  | "surprised"
  | "whisper"
  | "proud"
  | "gentle"
  | "encouraging"
  | "concerned"
  | "celebratory"
  | "sleepy"
  | "listening"
  | "wink"
  | "determined"

export type VirgilVariantId =
  | "canon"
  | "macbeth"
  | "moby-dick"
  | "alice"
  | "paradise-lost"
  | "divine-comedy"
  | "iliad"
  | "odyssey"
  | "frankenstein"
  | "pride-prejudice"
  | "jane-eyre"
  | "meditations"
  | "republic"

/**
 * Articulation targets for one rendered pose. Pure presentation data — the
 * state machine never holds these; poses.ts resolves a state to a pose.
 */
export interface VirgilPose {
  /** vertical bob of the whole figure (px in viewBox units) */
  bodyY: number
  /** whole-figure lean, degrees */
  bodyLean: number
  /** squash-and-stretch, 1 = rest */
  squash: number
  headTilt: number
  headX: number
  headY: number
  /** pupil travel, viewBox units, -6..6 */
  eyeLookX: number
  eyeLookY: number
  /** lantern-arm rotation at the shoulder, degrees. Negative raises. */
  armAngle: number
  /** lantern carriage height offset */
  lanternLift: number
  lanternSwing: number
  /** lantern glow opacity 0..1 */
  glow: number
  /** satchel sway, degrees */
  satchelSwing: number
  /** reading book presented in the free arm */
  bookOpen: boolean
  expression: VirgilExpressionId
}
