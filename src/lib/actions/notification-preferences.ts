"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { type ActionResult, fail, ok, requireUser } from "./_shared"

export interface NotificationPreferences {
  emailOnNewMessage: boolean
  emailOnClassroomInvite: boolean
}

const DEFAULTS: NotificationPreferences = {
  emailOnNewMessage: true,
  emailOnClassroomInvite: true,
}

/**
 * The caller's notification preferences. The row is seeded by the
 * handle_new_user trigger, but we fall back to the table defaults if it's
 * somehow absent so the UI always has a value to render.
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("email_on_new_message, email_on_classroom_invite")
    .eq("profile_id", user.id)
    .maybeSingle()
  if (error || !data) return DEFAULTS
  return {
    emailOnNewMessage: data.email_on_new_message,
    emailOnClassroomInvite: data.email_on_classroom_invite,
  }
}

const UpdateInput = z.object({
  emailOnNewMessage: z.boolean().optional(),
  emailOnClassroomInvite: z.boolean().optional(),
})

/** Upsert the caller's preferences. RLS gates the row to the caller. */
export async function updateNotificationPreferences(
  input: z.infer<typeof UpdateInput>,
): Promise<ActionResult<NotificationPreferences>> {
  const parsed = UpdateInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()
    const patch: Record<string, boolean | string> = {
      profile_id: user.id,
      updated_at: new Date().toISOString(),
    }
    if (parsed.data.emailOnNewMessage !== undefined) {
      patch.email_on_new_message = parsed.data.emailOnNewMessage
    }
    if (parsed.data.emailOnClassroomInvite !== undefined) {
      patch.email_on_classroom_invite = parsed.data.emailOnClassroomInvite
    }
    const { data, error } = await supabase
      .from("notification_preferences")
      .upsert(patch, { onConflict: "profile_id" })
      .select("email_on_new_message, email_on_classroom_invite")
      .single()
    if (error) return fail(error.message)
    revalidatePath("/account")
    return ok({
      emailOnNewMessage: data.email_on_new_message,
      emailOnClassroomInvite: data.email_on_classroom_invite,
    })
  } catch (e) {
    return fail((e as Error).message)
  }
}
