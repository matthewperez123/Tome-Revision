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

const CreateInput = z.object({
  bookId: z.string().min(1),
  chapterIndex: z.number().int().nonnegative(),
  selectedText: z.string().min(1),
  startOffset: z.number().int().nonnegative(),
  endOffset: z.number().int().nonnegative(),
  color: z.string().min(1).max(16),
  note: z.string().max(8000).optional().default(""),
  kind: z.enum(["bookmark", "highlight"]).optional().default("highlight"),
  label: z.string().max(200).nullable().optional(),
})

/**
 * Persist a reader highlight. Written server-side (cookie-authed) so it never
 * depends on the browser Supabase client resolving a session; the owner RLS
 * insert policy (`auth.uid() = user_id`) remains the final guard.
 */
export async function createHighlight(
  input: z.input<typeof CreateInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = CreateInput.safeParse(input)
  if (!parsed.success) return fail("Invalid highlight")

  const { supabase, user } = await requireUser()
  const d = parsed.data

  const { data, error } = await supabase
    .from("highlights")
    .insert({
      user_id: user.id,
      book_id: d.bookId,
      chapter_index: d.chapterIndex,
      selected_text: d.selectedText,
      start_offset: d.startOffset,
      end_offset: d.endOffset,
      color: d.color,
      note: d.note,
      kind: d.kind,
      label: d.label ?? null,
      shared: false,
    })
    .select("id")
    .single()
  if (error || !data) return fail(error?.message ?? "Could not save highlight")
  return ok({ id: data.id })
}

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

const ToggleSharedInput = z.object({
  id: z.string().uuid(),
  shared: z.boolean(),
  classroomId: z.string().uuid().optional(),
})

/**
 * Share a highlight to a classroom (shared=true + classroom_id) or retract the
 * share (shared=false). Sharing is allowed only into a class the owner actually
 * belongs to — otherwise the highlight would surface to a class the author
 * isn't in. The `.eq("user_id", user.id)` keeps the owner-only UPDATE RLS
 * policy as the final guard either way.
 *
 * On retract we flip `shared` to false but INTENTIONALLY keep `classroom_id`.
 * Realtime subscribers filter on `classroom_id=eq.<class>`, so nulling it would
 * push the row out of the subscription and the classmates' live views would
 * never receive the "removed" event. Privacy is unaffected: the shared-read RLS
 * policy requires `shared=true`, so an unshared highlight is owner-visible only.
 */
export async function toggleShared(
  input: z.infer<typeof ToggleSharedInput>,
): Promise<ActionResult<void>> {
  const parsed = ToggleSharedInput.safeParse(input)
  if (!parsed.success) return fail("Invalid share request")

  const { supabase, user } = await requireUser()
  const { id, shared, classroomId } = parsed.data

  if (shared) {
    if (!classroomId) return fail("A class is required to share")
    const { data: membership } = await supabase
      .from("classroom_members")
      .select("classroom_id")
      .eq("classroom_id", classroomId)
      .eq("student_id", user.id)
      .maybeSingle()
    if (!membership) return fail("You are not a member of that class")

    const { error } = await supabase
      .from("highlights")
      .update({
        shared: true,
        classroom_id: classroomId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
    if (error) return fail(error.message)
    return ok(undefined)
  }

  const { error } = await supabase
    .from("highlights")
    .update({
      shared: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
  if (error) return fail(error.message)
  return ok(undefined)
}

const DeleteInput = z.object({ id: z.string().uuid() })

/** Delete a highlight. Owner-only via `user_id = auth.uid()` + the delete RLS. */
export async function deleteHighlight(
  input: z.infer<typeof DeleteInput>,
): Promise<ActionResult<void>> {
  const parsed = DeleteInput.safeParse(input)
  if (!parsed.success) return fail("Invalid request")

  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from("highlights")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id)
  if (error) return fail(error.message)
  return ok(undefined)
}
