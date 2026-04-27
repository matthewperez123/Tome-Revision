/**
 * Auth Callback Route Handler
 *
 * Handles two flows:
 *  1. Email-link verification (signup, magic-link, recovery) — Supabase
 *     redirects here with `?code=...` after the user clicks an email link.
 *     We exchange the code for a session and forward to `?next=...`.
 *  2. OAuth (Google) — same shape: code in the URL, exchange for session,
 *     forward. For first-time Google signups we ALSO fire the welcome email.
 *
 * ─── Google Cloud Console configuration ────────────────────────────────
 * Register this redirect URI for your OAuth 2.0 Client ID:
 *   ${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback
 * Required scopes: openid email profile
 * Then in the Supabase dashboard:
 *   Authentication → Providers → Google → paste Client ID + Client Secret
 *   Authentication → URL Configuration → Site URL = ${NEXT_PUBLIC_APP_URL}
 *   Authentication → URL Configuration → Redirect URLs:
 *     - ${NEXT_PUBLIC_APP_URL}/auth/callback
 *     - ${NEXT_PUBLIC_APP_URL}/auth/verified
 *     - ${NEXT_PUBLIC_APP_URL}/auth/reset-password
 */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendWelcomeEmailIfNeeded } from "@/lib/email/welcome"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?code=auth_callback_failed`,
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?code=auth_callback_failed`,
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/error?code=session_missing`)
  }

  // First-time Google OAuth signup detection: created_at === last_sign_in_at
  // means this is the very first sign-in. Fire the welcome email immediately
  // (Google has already verified the address — no need for our verification
  // step). Failure is logged inside the helper; never blocks the redirect.
  const provider = user.app_metadata?.provider
  const isFirstSignIn =
    user.created_at && user.last_sign_in_at
      ? new Date(user.created_at).getTime() ===
        new Date(user.last_sign_in_at).getTime()
      : false

  if (provider === "google" && isFirstSignIn) {
    void sendWelcomeEmailIfNeeded(user.id).catch((e) => {
      console.warn("[auth-callback] welcome email failed:", e)
    })
  }

  // For email-verification flow we honor `?next=/auth/verified`; the
  // /auth/verified page will (idempotently) send the welcome email.
  // For everything else, route via onboarding gate.
  if (next === "/auth/verified") {
    return NextResponse.redirect(`${origin}/auth/verified`)
  }

  // Onboarding check (preserved from original behavior).
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single()

  if (!profile?.onboarding_completed) {
    return NextResponse.redirect(`${origin}/onboarding`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
