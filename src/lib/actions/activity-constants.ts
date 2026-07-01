// Plain constants/types for the activity feed. These live OUTSIDE activities.ts
// because that file carries the "use server" directive, and a "use server" file
// may only export async functions — exporting these const arrays from it throws
// "A 'use server' file can only export async functions, found object." at module
// load (which surfaced as a runtime error on any page importing emitActivity,
// e.g. the reader).

// ── Activity types ──────────────────────────────────────────────────────────
// Must mirror the public.activity_type enum exactly.
export const ACTIVITY_TYPES = [
  "book_started",
  "book_completed",
  "trial_passed",
  "seal_earned",
  "club_joined",
  "session_completed",
] as const
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export const ACTIVITY_VISIBILITY = ["private", "friends", "public"] as const
export type ActivityVisibility = (typeof ACTIVITY_VISIBILITY)[number]

// Reaction kinds mirror the activity_reactions_kind_check constraint.
export const REACTION_KINDS = ["cheer", "insight", "same", "inspired"] as const
export type ReactionKind = (typeof REACTION_KINDS)[number]
