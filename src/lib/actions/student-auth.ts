"use server"

import { createHash } from "node:crypto"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import {
  type ActionResult,
  createAdminClient,
  fail,
  ok,
} from "./_shared"
import { normalizeStudentCode, studentCodePrefix } from "@/lib/student-code"
import { badgeTokenPrefix, parseBadgeQrPayload } from "@/lib/badge-token"

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

/**
 * Only follow same-origin relative targets (a single leading "/") so a scanned
 * or crafted ?returnTo= can't bounce a freshly signed-in student off-site.
 * Anything else falls back to the dashboard.
 */
function safeReturnTo(raw: string | null | undefined): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw
  return "/dashboard"
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
 * Classify a raw entry into the ONE credential it is, and describe how to
 * resolve it — WITHOUT hitting the DB yet. A typed XXXX-XXXX code and a scanned
 * badge QR are the two shapes; the 4-char `prefix` keys the shared rate limit,
 * and `lookup` performs the (service-role) row match when we're ready.
 *
 *   * Typed code   → match on `code`, must be active.
 *   * Scanned badge→ match on the SHA-256 of the token, must be active AND not
 *     revoked (a revoked badge is dead even though its hash still matches).
 *
 * Foreign QRs and malformed input return null → a single generic "invalid"
 * without a DB hit. No branch ever touches or reveals an email.
 */
type Resolver = {
  prefix: string
  lookup: (
    admin: ReturnType<typeof createAdminClient>,
  ) => Promise<{ user_id: string } | null>
}

function classifyEntry(raw: string): Resolver | null {
  const code = normalizeStudentCode(raw)
  if (code) {
    return {
      prefix: studentCodePrefix(code),
      lookup: async (admin) => {
        const { data } = await admin
          .from("student_access_codes")
          .select("user_id, active")
          .eq("code", code)
          .maybeSingle<{ user_id: string; active: boolean }>()
        return data && data.active ? { user_id: data.user_id } : null
      },
    }
  }

  const token = parseBadgeQrPayload(raw)
  if (token) {
    const hash = createHash("sha256").update(token).digest("hex")
    return {
      prefix: badgeTokenPrefix(token),
      lookup: async (admin) => {
        const { data } = await admin
          .from("student_access_codes")
          .select("user_id, active, badge_revoked_at")
          .eq("badge_token_hash", hash)
          .maybeSingle<{
            user_id: string
            active: boolean
            badge_revoked_at: string | null
          }>()
        return data && data.active && data.badge_revoked_at == null
          ? { user_id: data.user_id }
          : null
      },
    }
  }

  return null
}

/**
 * THE single student verification path. Both the typed code and the scanned
 * badge token resolve to this action. Given a raw entry it:
 *   1. classifies the shape (no DB hit on garbage),
 *   2. checks the rate-limit ledger for the prefix,
 *   3. looks up an active (and, for badges, un-revoked) row via service role,
 *   4. mints a session for the mapped student.
 * It never logs the code/token and never surfaces email in any branch.
 */
export async function verifyStudentAccess(
  rawCode: string,
  returnTo?: string,
): Promise<ActionResult<{ redirectTo: string }>> {
  const resolver = classifyEntry(rawCode ?? "")
  if (!resolver) return fail(MSG.invalid)

  const admin = createAdminClient()
  const ip = await callerIp()

  try {
    if ((await recentFailures(admin, resolver.prefix)) >= MAX_FAILURES) {
      return fail(MSG.lockedOut)
    }

    const row = await resolver.lookup(admin)
    if (!row) {
      await recordFailure(admin, resolver.prefix, ip)
      return fail(MSG.notFound)
    }

    const signedIn = await establishSessionForUser(row.user_id)
    if (!signedIn) {
      await recordFailure(admin, resolver.prefix, ip)
      return fail(MSG.generic)
    }

    // Honor a preserved destination (e.g. /join?code=… from a scanned class
    // QR) so the student lands back on the join flow; default to the dashboard.
    return ok({ redirectTo: safeReturnTo(returnTo) })
  } catch {
    return fail(MSG.generic)
  }
}
