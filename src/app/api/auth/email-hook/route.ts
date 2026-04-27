/**
 * Supabase Auth — "Send Email Hook" handler.
 *
 * Supabase calls this endpoint instead of sending its built-in confirmation
 * / recovery / magic-link emails. We render a React Email template with
 * Resend and send it ourselves so the look matches the rest of Tome.
 *
 * ─── Supabase dashboard configuration ──────────────────────────────────
 *   Authentication → Hooks → Send Email hook
 *     URL:    ${NEXT_PUBLIC_APP_URL}/api/auth/email-hook
 *     Secret: value of SUPABASE_AUTH_HOOK_SECRET
 *       (generate with `openssl rand -hex 32`, paste with `v1,whsec_` prefix
 *        as Supabase requires the standard webhook secret format)
 *
 * Disable Supabase's default email templates for the events handled here
 * (signup, recovery, email_change) so users don't get duplicate emails.
 *
 * ─── Signature verification ────────────────────────────────────────────
 * Supabase signs each request with the standard-webhooks scheme:
 *   webhook-id, webhook-timestamp, webhook-signature
 * The signature is base64( HMAC-SHA256( "${id}.${timestamp}.${body}" ) )
 * keyed with the secret bytes after the `whsec_` prefix.
 */

import { NextResponse, type NextRequest } from "next/server"
import { createHmac, timingSafeEqual } from "node:crypto"

import { sendEmail } from "@/lib/email/send"
import { VerifyEmail } from "@/lib/email/templates/verify-email"
import { PasswordResetEmail } from "@/lib/email/templates/password-reset"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface EmailHookPayload {
  user: {
    id: string
    email: string
    user_metadata?: Record<string, unknown>
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type:
      | "signup"
      | "invite"
      | "magiclink"
      | "recovery"
      | "email_change"
      | "email_change_current"
      | "email_change_new"
    site_url: string
    token_new?: string
    token_hash_new?: string
  }
}

function verifySignature(
  secret: string,
  id: string,
  timestamp: string,
  body: string,
  signatureHeader: string,
): boolean {
  // Strip the `v1,whsec_` / `whsec_` prefix Supabase requires.
  const keyMaterial = secret.replace(/^v1,/, "").replace(/^whsec_/, "")
  let keyBytes: Buffer
  try {
    keyBytes = Buffer.from(keyMaterial, "base64")
  } catch {
    return false
  }

  const signedPayload = `${id}.${timestamp}.${body}`
  const expected = createHmac("sha256", keyBytes)
    .update(signedPayload)
    .digest("base64")

  // Header may contain space-separated `v1,<sig>` entries; check each.
  const candidates = signatureHeader
    .split(/\s+/)
    .map((s) => s.replace(/^v1,/, ""))
    .filter(Boolean)

  for (const candidate of candidates) {
    if (candidate.length !== expected.length) continue
    try {
      if (timingSafeEqual(Buffer.from(candidate), Buffer.from(expected))) {
        return true
      }
    } catch {
      // ignore length mismatch / encoding errors
    }
  }
  return false
}

function buildVerificationUrl(
  siteUrl: string,
  tokenHash: string,
  type: string,
  redirectTo: string,
) {
  // Supabase verify endpoint — matches the URL its built-in email would use.
  const u = new URL("/auth/v1/verify", siteUrl.replace(/\/$/, ""))
  u.searchParams.set("token", tokenHash)
  u.searchParams.set("type", type)
  u.searchParams.set("redirect_to", redirectTo)
  return u.toString()
}

export async function POST(request: NextRequest) {
  const secret = process.env.SUPABASE_AUTH_HOOK_SECRET
  if (!secret) {
    console.error("[email-hook] SUPABASE_AUTH_HOOK_SECRET not configured")
    return new NextResponse("Hook secret not configured", { status: 500 })
  }

  const body = await request.text()
  const id = request.headers.get("webhook-id") ?? ""
  const timestamp = request.headers.get("webhook-timestamp") ?? ""
  const signature = request.headers.get("webhook-signature") ?? ""

  if (!id || !timestamp || !signature) {
    return new NextResponse("Missing webhook headers", { status: 401 })
  }

  if (!verifySignature(secret, id, timestamp, body, signature)) {
    return new NextResponse("Invalid signature", { status: 401 })
  }

  let payload: EmailHookPayload
  try {
    payload = JSON.parse(body) as EmailHookPayload
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  const { user, email_data } = payload
  if (!user?.email) {
    return new NextResponse("No recipient", { status: 400 })
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? (user.user_metadata.full_name as string).trim()
      : null
  const firstName = fullName ? fullName.split(/\s+/)[0] : null

  try {
    switch (email_data.email_action_type) {
      case "signup":
      case "email_change":
      case "email_change_new": {
        const verificationUrl = buildVerificationUrl(
          email_data.site_url,
          email_data.token_hash,
          email_data.email_action_type,
          email_data.redirect_to,
        )
        const result = await sendEmail({
          to: user.email,
          subject: "Verify your email to begin reading",
          react: VerifyEmail({
            firstName,
            verificationUrl,
            recipient: user.email,
          }),
        })
        if (!result.ok) {
          return new NextResponse(`Email send failed: ${result.error}`, {
            status: 502,
          })
        }
        break
      }

      case "recovery": {
        const resetUrl = buildVerificationUrl(
          email_data.site_url,
          email_data.token_hash,
          "recovery",
          email_data.redirect_to,
        )
        const result = await sendEmail({
          to: user.email,
          subject: "Reset your Tome password",
          react: PasswordResetEmail({
            firstName,
            resetUrl,
            recipient: user.email,
          }),
        })
        if (!result.ok) {
          return new NextResponse(`Email send failed: ${result.error}`, {
            status: 502,
          })
        }
        break
      }

      // We don't override invite / magiclink / email_change_current — let
      // Supabase send its default for those (or wire them later if needed).
      default:
        return NextResponse.json({ skipped: email_data.email_action_type })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[email-hook] handler error:", message)
    return new NextResponse(`Hook error: ${message}`, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
