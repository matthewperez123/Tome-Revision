"use server"

import { z } from "zod"
import { type ActionResult, fail, ok, requireUser } from "./_shared"

/**
 * Highlight annotation + sharing actions.
 *
 * The reader writes/reads highlight rows directly through RLS (own
 * select/insert/delete). These actions cover the mutations that benefit from
 * a server-side ownership/membership check before the RLS-guarded update:
 *   • attaching a note (durable annotation text),
 *   • sharing a highlight to a classroom you actually belong to,
 *   • retracting a share.
 *
 * Every update is additionally scoped to `user_id = auth.uid()` so the owner
 * RLS policy ("Users can update own highlights") is the final guard.
 */

const NoteInput = z.object({
  highlightId: z.string().uuid(),
  note: z.string().max(2000).nullable(),
})

export async function updateHighlightNote(
  input: z.infer<typeof NoteInput>,
): Promise<ActionResult<void>> {
  const parsed = NoteInput.safeParse(input)
  if (!parsed.success) return fail("Invalid note")

  const { supabase, user } = await requireUser()
  const trimmed = parsed.data.note?.trim()
  const note = trimmed ? trimmed : null

  const { error } = await supabase
    .from("highlights")
    .update({ note, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.highlightId)
    .eq("user_id", user.id)
  if (error) return fail(error.message)
  return ok(undefined)
}

const ShareInput = z.object({
  highlightId: z.string().uuid(),
  classroomId: z.string().uuid(),
})

export async function shareHighlight(
  input: z.infer<typeof ShareInput>,
): Promise<ActionResult<void>> {
  const parsed = ShareInput.safeParse(input)
  if (!parsed.success) return fail("Invalid share request")

  const { supabase, user } = await requireUser()

  // Only let the owner share into a classroom they actually belong to —
  // otherwise the highlight would surface to a class the author isn't in.
  const { data: membership } = await supabase
    .from("classroom_members")
    .select("classroom_id")
    .eq("classroom_id", parsed.data.classroomId)
    .eq("student_id", user.id)
    .maybeSingle()
  if (!membership) return fail("You are not a member of that class")

  const { error } = await supabase
    .from("highlights")
    .update({
      shared: true,
      classroom_id: parsed.data.classroomId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.highlightId)
    .eq("user_id", user.id)
  if (error) return fail(error.message)
  return ok(undefined)
}

const UnshareInput = z.object({ highlightId: z.string().uuid() })

export async function unshareHighlight(
  input: z.infer<typeof UnshareInput>,
): Promise<ActionResult<void>> {
  const parsed = UnshareInput.safeParse(input)
  if (!parsed.success) return fail("Invalid request")

  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from("highlights")
    .update({
      shared: false,
      classroom_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.highlightId)
    .eq("user_id", user.id)
  if (error) return fail(error.message)
  return ok(undefined)
}
