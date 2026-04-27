import "server-only"

import { createAdminClient } from "@/lib/supabase/admin"
import { WelcomeEmail } from "@/lib/email/templates/welcome"
import { sendEmail } from "@/lib/email/send"

const WELCOME_FLAG = "welcome_email_sent_at"

/**
 * Idempotently send the welcome email for a given user.
 *
 * Uses `auth.user_metadata.welcome_email_sent_at` as the dedupe flag — this
 * lives on the Supabase auth user record so it's available even if the
 * profile row hasn't been created yet (first-time Google signup).
 *
 * Safe to call from /auth/verified (post email-link) and from /auth/callback
 * (Google OAuth first-time signup) without sending duplicates.
 */
export async function sendWelcomeEmailIfNeeded(userId: string): Promise<{
  sent: boolean
  reason?: string
}> {
  const admin = createAdminClient()

  const { data: userResult, error: getErr } = await admin.auth.admin.getUserById(
    userId,
  )
  if (getErr || !userResult?.user) {
    return { sent: false, reason: getErr?.message ?? "user_not_found" }
  }

  const user = userResult.user
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>

  if (meta[WELCOME_FLAG]) {
    return { sent: false, reason: "already_sent" }
  }

  if (!user.email) {
    return { sent: false, reason: "no_email" }
  }

  const fullName =
    typeof meta.full_name === "string" && meta.full_name.trim().length > 0
      ? (meta.full_name as string)
      : null
  const firstName = fullName ? fullName.split(/\s+/)[0] : null

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://usetome.app"

  const result = await sendEmail({
    to: user.email,
    subject: "Welcome to Tome.",
    react: WelcomeEmail({
      firstName,
      appUrl,
      recipient: user.email,
    }),
  })

  if (!result.ok) {
    // Don't mark as sent — let a future visit retry.
    return { sent: false, reason: result.error ?? "send_failed" }
  }

  // Mark as sent. Failure here just means we may double-send later — log it.
  const { error: updateErr } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...meta,
      [WELCOME_FLAG]: new Date().toISOString(),
    },
  })
  if (updateErr) {
    console.warn("[welcome-email] sent but failed to mark flag:", updateErr.message)
  }

  return { sent: true }
}
