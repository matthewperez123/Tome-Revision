/**
 * Pose resolution: maps every semantic state to concrete articulation
 * targets. Pure data — consumed by VirgilArt (static) and Virgil (animated).
 * Every state has an entry, so the reduced-motion still mapping is total.
 */

import type { VirgilPose, VirgilStateId } from "@/lib/virgil/types"

const REST: VirgilPose = {
  bodyY: 0,
  bodyLean: 0,
  squash: 1,
  headTilt: 0,
  headX: 0,
  headY: 0,
  eyeLookX: 0,
  eyeLookY: 0,
  armAngle: 0,
  lanternLift: 0,
  lanternSwing: 0,
  glow: 0.72,
  satchelSwing: 0,
  bookOpen: false,
  expression: "smile",
}

function pose(partial: Partial<VirgilPose>): VirgilPose {
  return { ...REST, ...partial }
}

export const VIRGIL_POSES: Record<VirgilStateId, VirgilPose> = {
  // Ambient
  enter: pose({ bodyY: 8, glow: 0.3, expression: "smile" }),
  greet: pose({ armAngle: -24, headTilt: 4, glow: 0.9, expression: "grin" }),
  idle: pose({}),
  glance: pose({ eyeLookX: 5, headTilt: 4, expression: "curious" }),
  readAlong: pose({ bookOpen: true, eyeLookY: 3, headTilt: 3, glow: 0.6, expression: "gentle" }),
  lookAtText: pose({ headTilt: 8, eyeLookX: 4, eyeLookY: 2, lanternLift: 4, glow: 0.85, expression: "curious" }),
  pagePeek: pose({ bodyLean: 6, headTilt: -5, bookOpen: true, expression: "curious" }),
  compactIdle: pose({ glow: 0.5 }),
  sleep: pose({ headY: 3, headTilt: 6, armAngle: 6, glow: 0.25, expression: "sleepy" }),

  // Conversational
  listen: pose({ headTilt: 7, eyeLookX: 2, armAngle: 4, glow: 0.6, expression: "listening" }),
  think: pose({ headTilt: -6, eyeLookX: -3, eyeLookY: -3, lanternSwing: 0, glow: 0.6, expression: "thoughtful" }),
  searchText: pose({ eyeLookY: 3, glow: 0.85, expression: "determined" }),
  retrievePassage: pose({ bookOpen: true, headY: 2, glow: 0.8, expression: "determined" }),
  explain: pose({ armAngle: -8, bookOpen: true, expression: "smile" }),
  compare: pose({ armAngle: -10, bookOpen: true, headTilt: 4, expression: "curious" }),
  pointToEvidence: pose({ armAngle: -32, glow: 0.95, eyeLookX: 5, expression: "determined" }),
  whisper: pose({ bodyLean: 8, headTilt: 8, glow: 0.4, expression: "whisper" }),
  socraticQuestion: pose({ headTilt: 6, armAngle: -14, expression: "curious" }),
  waitForUser: pose({ glow: 0.6, expression: "gentle" }),
  acknowledge: pose({ headY: 2, glow: 0.85, expression: "smile" }),
  citeParagraph: pose({ bookOpen: true, armAngle: -18, eyeLookY: 2, expression: "proud" }),

  // Hint ladder
  hint1: pose({ bodyLean: 4, glow: 0.8, expression: "gentle" }),
  hint2: pose({ armAngle: -10, bookOpen: true, glow: 0.85, expression: "encouraging" }),
  hint3: pose({ armAngle: -32, glow: 0.95, eyeLookX: 5, expression: "determined" }),
  explainFinal: pose({ bookOpen: true, headY: 1, glow: 0.85, expression: "proud" }),

  // Assessment
  correct: pose({ bodyY: -4, squash: 1.03, glow: 1, armAngle: -16, expression: "grin" }),
  elegantAnswer: pose({ bodyLean: -4, headTilt: -4, glow: 1, expression: "celebratory" }),
  nearMiss: pose({ headTilt: 5, armAngle: -8, glow: 0.85, expression: "encouraging" }),
  incorrectEncouraging: pose({ bookOpen: true, armAngle: 4, glow: 0.7, expression: "gentle" }),
  timeout: pose({ armAngle: 8, headY: 2, glow: 0.55, expression: "gentle" }),
  answerRevised: pose({ bodyLean: 3, eyeLookX: 3, expression: "curious" }),
  streak: pose({ armAngle: -20, glow: 0.95, expression: "celebratory" }),
  mastery: pose({ armAngle: -38, bodyY: -3, glow: 1, expression: "proud" }),

  // Rewards
  wisdomEarned: pose({ eyeLookY: -4, headTilt: -3, glow: 0.95, expression: "smile" }),
  dailyGoalAdvanced: pose({ bodyY: -2, headY: 1, expression: "smile" }),
  flameAtRisk: pose({ glow: 0.35, armAngle: 6, expression: "gentle" }),
  flameSecured: pose({ glow: 0.9, headY: 1, expression: "grin" }),
  chapterComplete: pose({ bookOpen: false, armAngle: -18, glow: 0.9, expression: "proud" }),
  levelUp: pose({ bodyY: -6, glow: 1, armAngle: -22, expression: "celebratory" }),
  sealReveal: pose({ armAngle: -40, bodyY: -2, glow: 1, expression: "celebratory" }),
  stoaRestoration: pose({ armAngle: -26, headTilt: 6, eyeLookX: 5, glow: 0.95, expression: "proud" }),
  bookComplete: pose({ bookOpen: true, armAngle: -24, glow: 1, expression: "celebratory" }),
  journeyComplete: pose({ bodyY: -4, armAngle: -30, glow: 1, headY: 2, expression: "celebratory" }),

  // System
  loading: pose({ eyeLookX: 2, glow: 0.65, expression: "neutral" }),
  offline: pose({ bookOpen: true, glow: 0.3, armAngle: 6, expression: "gentle" }),
  rateLimited: pose({ armAngle: -6, glow: 0.5, expression: "thoughtful" }),
  contentUnavailable: pose({ headTilt: 5, armAngle: 6, glow: 0.45, expression: "concerned" }),
  safeBoundary: pose({ armAngle: 6, glow: 0.55, expression: "gentle" }),
  mutedAck: pose({ headY: 2, glow: 0.5, expression: "smile" }),
  teacherMode: pose({ bodyLean: -3, armAngle: 8, glow: 0.55, expression: "proud" }),
  parentMode: pose({ bookOpen: true, glow: 0.65, expression: "gentle" }),
  welcomeBack: pose({ glow: 0.9, armAngle: -12, headTilt: 3, expression: "grin" }),
}

export function resolveVirgilPose(state: VirgilStateId): VirgilPose {
  return VIRGIL_POSES[state]
}
