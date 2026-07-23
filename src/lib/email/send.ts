import "server-only"

import type { ReactElement } from "react"
import { FROM, isEmailConfigured, resend } from "./client"

export interface SendEmailParams {
  to: string
  subject: string
  react: ReactElement
  /** Optional override for the From address (default RESEND_FROM_EMAIL). */
  from?: string
}

export interface SendEmailResult {
  ok: boolean
  id?: string
  error?: string
}

/**
 * Send a transactional email via Resend.
 *
 * Never throws — always returns a result object. Auth flows should not be
 * blocked by an email failure; the caller should log and continue.
 *
 * Resend handles its own retry logic, so we don't retry inline.
 */
export async function sendEmail({
  to,
  subject,
  react,
  from = FROM,
}: SendEmailParams): Promise<SendEmailResult> {
  // No key configured (dev/preview or a misconfigured deploy): skip the doomed
  // network call and return a clean, non-error result. Callers already treat
  // { ok: false } as best-effort and continue.
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email] Skipped (RESEND_API_KEY not set):", { to, subject })
    }
    return { ok: false, error: "Email not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
    })

    if (error) {
      console.error("[email] Resend error:", { to, subject, error })
      return { ok: false, error: error.message }
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[email] Sent:", { to, subject, id: data?.id })
    }

    return { ok: true, id: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[email] Unexpected send failure:", { to, subject, message })
    return { ok: false, error: message }
  }
}
