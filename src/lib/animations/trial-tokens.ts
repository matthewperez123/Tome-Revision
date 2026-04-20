// ─────────────────────────────────────────────
// Trials Animation Tokens
// Motion presets for the Trial system. Mirrors the sidebar
// animation-token pattern (see sidebar/animations/AnimatedSvg).
// Every preset ships a reduced-motion variant (opacity-only).
// ─────────────────────────────────────────────

import { springs, durations, ease } from "@/lib/design-tokens"
import type { Transition, Variants } from "framer-motion"

// Reused from design-tokens
export const trialSprings = {
  // Matches Virgil drawer spring — question-to-question transition
  questionTransition: springs.gentle,
  // Snappy card response for selection
  answerSelect: { type: "spring" as const, stiffness: 280, damping: 18 },
  // Explanation card rise from bottom
  explanation: { type: "spring" as const, stiffness: 260, damping: 22 },
  // Results hero pop-in
  resultsHero: springs.gentle,
} as const

export const trialDurations = {
  intro: 2500,
  questionEnter: 220,
  questionExit: 180,
  answerSelect: 200,
  correctPulse: 300,
  wrongShake: 400,
  wisdomFloat: 900,
  heartMorph: 200,
  heartFade: 300,
  explanationRise: 350,
  resultsStagger: 80,
  perfectSparkle: 1800,
  progressBar: 450,
  sigilDraw: 800,
  goldUnderlineDraw: 400,
  lineConnect: 250,
} as const

export const trialEase = {
  scholarly: ease.scholarly,
  outExpo: ease["out-expo"],
} as const

// ── trialEnter / trialExit ───────────────────

export const trialEnter: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: trialDurations.questionEnter / 1000, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const trialExit: Variants = {
  visible: { opacity: 1, y: 0 },
  hidden: {
    opacity: 0,
    y: -12,
    transition: { duration: trialDurations.questionExit / 1000, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ── answerSelect ─────────────────────────────

export const answerSelect = {
  rest: { scale: 1 },
  selected: {
    scale: 1.02,
    transition: trialSprings.answerSelect,
  },
} as const

// ── correctPulse / wrongShake ────────────────

export const correctPulseKeyframes = {
  backgroundColor: [
    "rgba(22,163,74,0)",
    "rgba(22,163,74,0.08)",
    "rgba(22,163,74,0)",
  ],
}
export const correctPulseTransition: Transition = {
  duration: trialDurations.correctPulse / 1000,
  ease: [0.25, 0.46, 0.45, 0.94],
}

export const wrongShakeKeyframes = {
  x: [0, -8, 8, -4, 4, 0],
}
export const wrongShakeTransition: Transition = {
  duration: trialDurations.wrongShake / 1000,
  ease: "easeInOut",
}

// ── wisdomFloat ──────────────────────────────

export const wisdomFloat: Variants = {
  hidden: { opacity: 0, y: 0, scale: 1 },
  visible: {
    opacity: [1, 1, 0],
    y: [0, -48],
    scale: [1, 1.1],
    transition: {
      duration: trialDurations.wisdomFloat / 1000,
      ease: [0.16, 1, 0.3, 1],
      times: [0, 0.7, 1],
    },
  },
}

// ── heartLoss ────────────────────────────────

export const heartLoss = {
  morphDuration: trialDurations.heartMorph / 1000,
  fadeDuration: trialDurations.heartFade / 1000,
}

// ── explanationRise ──────────────────────────

export const explanationRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: trialSprings.explanation,
  },
}

// ── resultsStagger ───────────────────────────

export const resultsContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: trialDurations.resultsStagger / 1000,
    },
  },
}

export const resultsChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
}

// ── perfectSparkle ───────────────────────────

export const perfectSparkle = {
  particleCount: 12,
  durationMs: trialDurations.perfectSparkle,
}

// ── Reduced-motion fallbacks ─────────────────
// For every preset above, collapse to opacity-only / no keyframes.

export const reduced = {
  trialEnter: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
  } satisfies Variants,
  trialExit: {
    visible: { opacity: 1 },
    hidden: { opacity: 0, transition: { duration: 0.15 } },
  } satisfies Variants,
  answerSelect: {
    rest: { scale: 1 },
    selected: { scale: 1, transition: { duration: 0.15 } },
  },
  correctPulseKeyframes: { backgroundColor: "rgba(22,163,74,0.05)" },
  correctPulseTransition: { duration: 0.2 } satisfies Transition,
  wrongShakeKeyframes: { x: 0 },
  wrongShakeTransition: { duration: 0.15 } satisfies Transition,
  wisdomFloat: {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 1, 0],
      transition: { duration: 0.7, times: [0, 0.2, 1] },
    },
  } satisfies Variants,
  explanationRise: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
  } satisfies Variants,
  resultsContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0 } },
  } satisfies Variants,
  resultsChild: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
  } satisfies Variants,
} as const

// ── Colour tokens local to Trials ────────────
// Semantic names so the overlay doesn't hardcode hex.

export const trialColors = {
  laurelGold: "#D4AF37",
  brightGold: "#F0C850",
  laurelGreen: "#16A34A",
  ember: "#DC2626",
  indigo: "#6366F1",
  parchment: "#F8F0DC",
  ink: "var(--tome-ink, #1C1917)",
  stone400: "#A8A29E",
  stone500: "#78716C",
  stone100: "#F5F5F4",
} as const
