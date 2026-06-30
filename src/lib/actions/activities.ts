"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { type ActionResult, fail, ok, requireUser } from "./_shared"

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

const EmitInput = z.object({
  type: z.enum(ACTIVITY_TYPES),
  entityType: z.string().trim().min(1).max(40).optional(),
  entityId: z.string().trim().min(1).max(200).optional(),
  visibility: z.enum(ACTIVITY_VISIBILITY).default("friends"),
})

/**
 * Emit one activity milestone. The ONLY write path into public.activities — it
 * routes through the SECURITY DEFINER record_activity() so clients can't forge
 * a row (and a student's `public` request is downgraded to `friends`). Idempotent
 * per (actor, type, entity_id): re-emitting the same milestone is a no-op.
 *
 * Reward values are NOT set here — this records the social event only; Wisdom /
 * coins stay in the economy layer.
 */
export async function emitActivity(
  input: z.input<typeof EmitInput>,
): Promise<ActionResult<{ id: string | null }>> {
  const parsed = EmitInput.safeParse(input)
  if (!parsed.success) return fail("Invalid activity.")
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase.rpc("record_activity", {
      p_type: parsed.data.type,
      p_entity_type: parsed.data.entityType ?? null,
      p_entity_id: parsed.data.entityId ?? null,
      p_visibility: parsed.data.visibility,
    })
    if (error) return fail(error.message)
    revalidatePath("/social")
    return ok({ id: (data as string | null) ?? null })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Reactions ───────────────────────────────────────────────────────────────

const Uuid = z.string().uuid()

const ReactionInput = z.object({
  activityId: Uuid,
  kind: z.enum(REACTION_KINDS),
})

/** Add (or no-op if already present) the caller's reaction to an activity. */
export async function addReaction(
  input: z.infer<typeof ReactionInput>,
): Promise<ActionResult<void>> {
  const parsed = ReactionInput.safeParse(input)
  if (!parsed.success) return fail("Invalid reaction.")
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase.from("activity_reactions").upsert(
      {
        activity_id: parsed.data.activityId,
        user_id: user.id,
        kind: parsed.data.kind,
      },
      { onConflict: "activity_id,user_id,kind", ignoreDuplicates: true },
    )
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Remove the caller's reaction of a given kind from an activity. */
export async function removeReaction(
  input: z.infer<typeof ReactionInput>,
): Promise<ActionResult<void>> {
  const parsed = ReactionInput.safeParse(input)
  if (!parsed.success) return fail("Invalid reaction.")
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase
      .from("activity_reactions")
      .delete()
      .eq("activity_id", parsed.data.activityId)
      .eq("user_id", user.id)
      .eq("kind", parsed.data.kind)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Reports (moderation) ────────────────────────────────────────────────────

const ReportInput = z.object({
  contentType: z.string().trim().min(1).max(40),
  contentId: z.string().trim().min(1).max(200),
  reason: z.string().trim().min(1).max(2000),
})

/**
 * File a moderation report. Insert-only by the reporter; the queue is readable
 * only by the service role (no select RLS policy on public.reports).
 */
export async function reportContent(
  input: z.infer<typeof ReportInput>,
): Promise<ActionResult<void>> {
  const parsed = ReportInput.safeParse(input)
  if (!parsed.success) return fail("Please add a short reason.")
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase.from("reports").insert({
      content_type: parsed.data.contentType,
      content_id: parsed.data.contentId,
      reporter_id: user.id,
      reason: parsed.data.reason,
    })
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}
