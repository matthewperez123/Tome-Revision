/**
 * Expression sheet as data. Each expression is a combination of eye style,
 * brow offsets/rotations, and a mouth shape. Rendered by parts.tsx <Face />.
 */

import type { VirgilExpressionId } from "@/lib/virgil/types"

export type VirgilEyeStyle = "open" | "soft" | "happy" | "closed" | "wink"
export type VirgilMouthId =
  | "smile"
  | "grin"
  | "neutral"
  | "speak"
  | "oh"
  | "flat"
  | "soft"
  | "determined"

export interface VirgilExpressionDef {
  eyes: VirgilEyeStyle
  browLeft: { dy: number; rotate: number }
  browRight: { dy: number; rotate: number }
  mouth: VirgilMouthId
  blush: boolean
  /** design note surfaced in the Lab expression gallery */
  note: string
}

export const VIRGIL_EXPRESSIONS: Record<VirgilExpressionId, VirgilExpressionDef> = {
  neutral: {
    eyes: "open",
    browLeft: { dy: 0, rotate: 0 },
    browRight: { dy: 0, rotate: 0 },
    mouth: "neutral",
    blush: false,
    note: "Rest. Attentive, unpresuming.",
  },
  smile: {
    eyes: "open",
    browLeft: { dy: 0, rotate: 0 },
    browRight: { dy: 0, rotate: 0 },
    mouth: "smile",
    blush: true,
    note: "Default warmth.",
  },
  grin: {
    eyes: "open",
    browLeft: { dy: -1.5, rotate: -3 },
    browRight: { dy: -1.5, rotate: 3 },
    mouth: "grin",
    blush: true,
    note: "Greetings and wins.",
  },
  curious: {
    eyes: "open",
    browLeft: { dy: 0.5, rotate: 4 },
    browRight: { dy: -2.5, rotate: -8 },
    mouth: "soft",
    blush: false,
    note: "One brow up — a question forming.",
  },
  thoughtful: {
    eyes: "soft",
    browLeft: { dy: 1, rotate: 6 },
    browRight: { dy: 0, rotate: -2 },
    mouth: "flat",
    blush: false,
    note: "Working on it, unhurried.",
  },
  surprised: {
    eyes: "open",
    browLeft: { dy: -3, rotate: -6 },
    browRight: { dy: -3, rotate: 6 },
    mouth: "oh",
    blush: true,
    note: "Delighted surprise, never alarm.",
  },
  whisper: {
    eyes: "soft",
    browLeft: { dy: -1, rotate: 0 },
    browRight: { dy: -1, rotate: 0 },
    mouth: "oh",
    blush: true,
    note: "An aside between reader and guide.",
  },
  proud: {
    eyes: "soft",
    browLeft: { dy: -0.5, rotate: 0 },
    browRight: { dy: -0.5, rotate: 0 },
    mouth: "smile",
    blush: true,
    note: "Quiet pride in the reader.",
  },
  gentle: {
    eyes: "soft",
    browLeft: { dy: 0.5, rotate: 2 },
    browRight: { dy: 0.5, rotate: -2 },
    mouth: "smile",
    blush: true,
    note: "Calm under struggle.",
  },
  encouraging: {
    eyes: "open",
    browLeft: { dy: -1, rotate: -2 },
    browRight: { dy: -1, rotate: 2 },
    mouth: "smile",
    blush: true,
    note: "'So close' energy — palm up.",
  },
  concerned: {
    eyes: "open",
    browLeft: { dy: -1.5, rotate: 8 },
    browRight: { dy: -1.5, rotate: -8 },
    mouth: "flat",
    blush: false,
    note: "Something is unavailable; honesty without drama.",
  },
  celebratory: {
    eyes: "happy",
    browLeft: { dy: -2, rotate: -4 },
    browRight: { dy: -2, rotate: 4 },
    mouth: "grin",
    blush: true,
    note: "Happy-closed eyes; measured joy.",
  },
  sleepy: {
    eyes: "closed",
    browLeft: { dy: 1.5, rotate: 2 },
    browRight: { dy: 1.5, rotate: -2 },
    mouth: "flat",
    blush: false,
    note: "Resting while the tab sleeps.",
  },
  listening: {
    eyes: "open",
    browLeft: { dy: -0.5, rotate: 2 },
    browRight: { dy: -0.5, rotate: -2 },
    mouth: "soft",
    blush: true,
    note: "Full attention, slight lean.",
  },
  wink: {
    eyes: "wink",
    browLeft: { dy: -1, rotate: -4 },
    browRight: { dy: 0, rotate: 0 },
    mouth: "grin",
    blush: true,
    note: "Shared-secret playfulness, used sparingly.",
  },
  determined: {
    eyes: "open",
    browLeft: { dy: 1, rotate: -10 },
    browRight: { dy: 1, rotate: 10 },
    mouth: "determined",
    blush: false,
    note: "Pointing at evidence; scholarly focus.",
  },
}

export const VIRGIL_EXPRESSION_IDS = Object.keys(
  VIRGIL_EXPRESSIONS,
) as VirgilExpressionId[]
