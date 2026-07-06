"use server"

import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import {
  type ActionResult,
  createAdminClient,
  fail,
  ok,
} from "./_shared"
import { normalizeStudentCode, studentCodePrefix } from "@/lib/student-code"

// ── Rate limiting ───────────────────────────────────────────────────────────
// Every entry attempt (typed OR scanned) funnels through this action, and each
// failure is recorded in `login_attempts` keyed by the code's 4-char prefix.
// Too many recent failures on a prefix locks that prefix out for the window.
// The ledger is service-role only (RLS deny-all), so clients can neither read
// nor forge it.
const MAX_FAILURES = 8
const WINDOW_MINUTES = 15

/** Best-effort caller IP from the proxy headers (never shown to the student). */
async function callerIp(): Promise<string | null> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim() || null
  return h.get("x-real-ip")
}

/** Count recent failures for a prefix within the lockout window. */
async function recentFailures(
  admin: ReturnType<typeof createAdminClient>,
  prefix: string,
): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString()
  const { count } = await admin
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("code_prefix", prefix)
    .gte("attempted_at", since)
  return count ?? 0
}

async function recordFailure(
  admin: ReturnType<typeof createAdminClient>,
  prefix: string,
  ip: string | null,
): Promise<void> {
  await admin.from("login_attempts").insert({ code_prefix: prefix, ip })
}

// Age-appropriate copy. Never mentions email, accounts, or password recovery,
// and always points a stuck student back to their teacher.
const MSG = {
  invalid: "That code doesn't look right. Check it and try again.",
  notFound: "We couldn't find that code. Ask your teacher for help.",
  lockedOut: "Too many tries. Take a break and ask your teacher for help.",
  generic: "Something went wrong. Ask your teacher for help.",
} as const

/**
 * Establish a real Supabase session for an already-verified student, WITHOUT a
 * password. We mint a one-time magic-link token server-side (service role) and
 * immediately redeem it on the SSR client so the session cookies are set. The
 * student's synthetic email is used only here, inside the server, and never
 * leaves it.
 */
async function establishSessionForUser(userId: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data: got, error: getErr } = await admin.auth.admin.getUserById(userId)
  const email = got?.user?.email
  if (getErr || !email) return false

  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  })
  const tokenHash = link?.properties?.hashed_token
  if (linkErr || !tokenHash) return false

  const supabase = await createClient()
  // NOTE(phase-4): confirm this `type` against the live project during the
  // persona proof — magic-link token_hash verification uses "email" in the
  // current SSR flow; older projects expect "magiclink".
  const { error: otpErr } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: tokenHash,
  })
  return !otpErr
}

/**
 * THE single student verification path. Both the typed code and the scanned
 * badge token (Phase 3) resolve to this action. Given a raw code it:
 *   1. normalizes + validates the shape (no DB hit on garbage),
 *   2. checks the rate-limit ledger for the prefix,
 *   3. looks up an active code row (service role — RLS would hide other rows),
 *   4. mints a session for the mapped student.
 * It never logs the code and never surfaces email in any branch.
 */
export async function verifyStudentAccess(
  rawCode: string,
): Promise<ActionResult<{ redirectTo: string }>> {
  const code = normalizeStudentCode(rawCode ?? "")
  if (!code) return fail(MSG.invalid)

  const prefix = studentCodePrefix(code)
  const admin = createAdminClient()
  const ip = await callerIp()

  try {
    if ((await recentFailures(admin, prefix)) >= MAX_FAILURES) {
      return fail(MSG.lockedOut)
    }

    const { data: row } = await admin
      .from("student_access_codes")
      .select("user_id, active")
      .eq("code", code)
      .maybeSingle<{ user_id: string; active: boolean }>()

    if (!row || !row.active) {
      await recordFailure(admin, prefix, ip)
      return fail(MSG.notFound)
    }

    const signedIn = await establishSessionForUser(row.user_id)
    if (!signedIn) {
      await recordFailure(admin, prefix, ip)
      return fail(MSG.generic)
    }

    return ok({ redirectTo: "/dashboard" })
  } catch {
    return fail(MSG.generic)
  }
}
