"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/send"
import { AccountDeletedEmail } from "@/lib/email/templates/account-deleted"
import {
  PG_UNDEFINED_TABLE,
  USER_OWNED_TABLES,
} from "@/lib/auth/deletion-cascade"

export interface DeleteAccountResult {
  success: boolean
  error?: string
}

/**
 * Hard-delete the currently authenticated user.
 *
 *   1. Verify the active session.
 *   2. Send the deletion confirmation email FIRST (we need the address
 *      and metadata before we destroy them).
 *   3. Delete user-owned rows (best-effort — missing tables tolerated).
 *   4. Delete the auth user via the service-role admin client.
 *   5. Sign out client-side cookies.
 *
 * The dialog component navigates to /goodbye on success.
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not signed in." }
  }

  const userId = user.id
  const email = user.email ?? null
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  const fullName =
    typeof meta.full_name === "string" ? (meta.full_name as string) : null
  const firstName = fullName ? fullName.split(/\s+/)[0] : null

  // 1) Send deletion email FIRST — failure here is non-fatal but logged.
  if (email) {
    const result = await sendEmail({
      to: email,
      subject: "Your Tome account has been deleted",
      react: AccountDeletedEmail({
        firstName,
        recipient: email,
      }),
    })
    if (!result.ok) {
      console.warn(
        "[delete-account] confirmation email failed:",
        result.error,
      )
    }
  }

  // 2) Wipe user-owned rows with the service-role client.
  const admin = createAdminClient()
  for (const table of USER_OWNED_TABLES) {
    const { error } = await admin
      .from(table.name)
      .delete()
      .eq(table.userColumn, userId)

    if (error) {
      // Tolerate missing tables (schema not yet migrated). Log + continue.
      const code = (error as { code?: string }).code
      if (code === PG_UNDEFINED_TABLE) {
        if (process.env.NODE_ENV !== "production") {
          console.info(
            `[delete-account] skip ${table.name} (table does not exist)`,
          )
        }
        continue
      }
      // For any other error, fail loudly — partial deletes are worse than
      // the user retrying.
      console.error(
        `[delete-account] failed to delete from ${table.name}:`,
        error,
      )
      return {
        success: false,
        error: `Failed clearing ${table.name}. Please try again or contact support.`,
      }
    }
  }

  // 3) Delete the auth user. After this, all sessions are revoked.
  const { error: deleteErr } = await admin.auth.admin.deleteUser(userId)
  if (deleteErr) {
    console.error("[delete-account] auth.admin.deleteUser failed:", deleteErr)
    return {
      success: false,
      error: "Failed to delete account. Please try again or contact support.",
    }
  }

  // 4) Clear local cookies. signOut may fail because the user is already gone
  // server-side; we don't care.
  try {
    await supabase.auth.signOut()
  } catch {
    // ignore
  }

  return { success: true }
}

/**
 * Sign out and redirect home. Used by the danger-zone "sign out" button
 * for symmetry with the existing client-side flow.
 */
export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
