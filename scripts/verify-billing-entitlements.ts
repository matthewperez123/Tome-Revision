/**
 * End-to-end ENTITLEMENT verification — the DB-backed half of the billing suite.
 *
 * For every billing lifecycle state, this writes the EXACT `public.subscriptions`
 * row the Stripe webhook would produce, then asserts that the authoritative
 * `getEntitlement()` resolves the expected tier / status / features. This is the
 * "assert the subscriptions row state AND the getEntitlement output" requirement,
 * fully automated and self-cleaning — it never touches Stripe.
 *
 * It exercises:
 *   Solo:   free → trialing → active → cancel_at_period_end → canceled → past_due
 *   Family: active (seats n/a)               [smoke]
 *   School: admin + covered teacher, seats, then cancel reverts both  [smoke]
 *
 * Requires (from .env.local): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * Creates ephemeral auth users (billing-verify+…@usetome.app) and DELETES every
 * row + user it creates in a finally block. Run with:
 *
 *   npm run verify:billing
 *     (= node --conditions=react-server --import tsx scripts/verify-billing-entitlements.ts)
 *
 * The --conditions=react-server flag makes `import "server-only"` resolve to a
 * no-op so the real server entitlement module can run under tsx.
 */
// MUST be first: populates env before the admin client's module body runs.
import "./load-env"

import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import {
  getEntitlement,
  type Entitlement,
} from "@/lib/entitlements/server"
import { FREE_BOOK_LIMIT } from "@/lib/stripe/free-books"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  )
  process.exit(1)
}

const admin: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── tiny test harness ──────────────────────────────────────────────────
let passed = 0
let failed = 0
function check(label: string, actual: unknown, expected: unknown) {
  try {
    assert.deepEqual(actual, expected)
    passed++
    console.log(`    ✓ ${label}`)
  } catch {
    failed++
    console.error(
      `    ✗ ${label}\n        expected: ${JSON.stringify(expected)}\n        actual:   ${JSON.stringify(actual)}`,
    )
  }
}

/** Assert the full shape of an entitlement against an expected projection. */
function expectEntitlement(
  label: string,
  ent: Entitlement,
  want: {
    tier: Entitlement["tier"]
    status: string | null
    isActive: boolean
    bookLimit: number | null
    seats: number | null
    schoolRole: Entitlement["schoolRole"]
    fullLibrary: boolean
    unlimitedVirgil: boolean
    advancedTrials: boolean
    teacherTools: boolean
  },
) {
  console.log(`  ${label}`)
  check("tier", ent.tier, want.tier)
  check("status", ent.status, want.status)
  check("isActive", ent.isActive, want.isActive)
  check("bookLimit", ent.bookLimit, want.bookLimit)
  check("seats", ent.seats, want.seats)
  check("schoolRole", ent.schoolRole, want.schoolRole)
  check("features.fullLibrary", ent.features.fullLibrary, want.fullLibrary)
  check("features.unlimitedVirgil", ent.features.unlimitedVirgil, want.unlimitedVirgil)
  check("features.advancedTrials", ent.features.advancedTrials, want.advancedTrials)
  check("features.teacherTools", ent.features.teacherTools, want.teacherTools)
}

// ── ephemeral fixtures (always cleaned up) ─────────────────────────────
const createdUserIds: string[] = []

async function makeUser(tag: string): Promise<string> {
  const email = `billing-verify+${tag}-${randomUUID().slice(0, 8)}@usetome.app`
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: "Billing Verify" },
  })
  if (error || !data.user) {
    throw new Error(`createUser failed: ${error?.message ?? "no user returned"}`)
  }
  createdUserIds.push(data.user.id)
  return data.user.id
}

/** Mirror the webhook's subscriptions upsert for a given lifecycle state. */
async function setSubscription(
  userId: string,
  row: {
    tier: string | null
    status: string | null
    seats?: number | null
    cancel_at_period_end?: boolean
    current_period_end?: string | null
  },
) {
  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: `cus_test_${userId.slice(0, 8)}`,
      stripe_subscription_id: `sub_test_${userId.slice(0, 8)}`,
      tier: row.tier,
      status: row.status,
      seats: row.seats ?? null,
      cancel_at_period_end: row.cancel_at_period_end ?? false,
      current_period_end: row.current_period_end ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  )
  if (error) throw new Error(`subscriptions upsert failed: ${error.message}`)
}

async function addSchoolSeat(
  ownerId: string,
  teacherId: string,
  role: "admin" | "teacher",
) {
  const { error } = await admin.from("school_seats").upsert(
    { subscription_user_id: ownerId, teacher_id: teacherId, seat_role: role },
    { onConflict: "subscription_user_id,teacher_id", ignoreDuplicates: false },
  )
  if (error) throw new Error(`school_seats upsert failed: ${error.message}`)
}

async function cleanup() {
  console.log("\nCleaning up fixtures…")
  for (const id of createdUserIds) {
    await admin.from("school_seats").delete().eq("teacher_id", id)
    await admin.from("school_seats").delete().eq("subscription_user_id", id)
    await admin.from("subscriptions").delete().eq("user_id", id)
    await admin.auth.admin.deleteUser(id).catch(() => {})
  }
  console.log(`  removed ${createdUserIds.length} ephemeral users + their rows`)
}

// ── scenarios ──────────────────────────────────────────────────────────
async function run() {
  console.log("BILLING ENTITLEMENT VERIFICATION (DB-backed, no Stripe)\n")

  // ===== SOLO full lifecycle =====
  console.log("SOLO lifecycle")
  const solo = await makeUser("solo")

  // 1. Free (no subscription row).
  expectEntitlement("free (no subscription row)", await getEntitlement(solo), {
    tier: "free", status: null, isActive: false, bookLimit: FREE_BOOK_LIMIT,
    seats: null, schoolRole: null, fullLibrary: false, unlimitedVirgil: false,
    advancedTrials: false, teacherTools: false,
  })

  // 2. Start Solo trial (checkout.session.completed → trialing).
  await setSubscription(solo, { tier: "solo", status: "trialing" })
  expectEntitlement("trialing Solo unlocks full library", await getEntitlement(solo), {
    tier: "solo", status: "trialing", isActive: true, bookLimit: null,
    seats: null, schoolRole: null, fullLibrary: true, unlimitedVirgil: true,
    advancedTrials: true, teacherTools: false,
  })

  // 3. Trial converts to paid (invoice.paid → active).
  await setSubscription(solo, { tier: "solo", status: "active" })
  expectEntitlement("active Solo keeps full access", await getEntitlement(solo), {
    tier: "solo", status: "active", isActive: true, bookLimit: null,
    seats: null, schoolRole: null, fullLibrary: true, unlimitedVirgil: true,
    advancedTrials: true, teacherTools: false,
  })

  // 4. Cancel AT period end — access is RETAINED until the period actually ends
  //    (status is still active; only cancel_at_period_end flips).
  await setSubscription(solo, {
    tier: "solo", status: "active", cancel_at_period_end: true,
  })
  expectEntitlement("cancel-at-period-end retains access until period end", await getEntitlement(solo), {
    tier: "solo", status: "active", isActive: true, bookLimit: null,
    seats: null, schoolRole: null, fullLibrary: true, unlimitedVirgil: true,
    advancedTrials: true, teacherTools: false,
  })

  // 5. Period ends (customer.subscription.deleted → canceled) → reverts to Free.
  await setSubscription(solo, { tier: "solo", status: "canceled" })
  expectEntitlement("canceled reverts to Free", await getEntitlement(solo), {
    tier: "free", status: "canceled", isActive: false, bookLimit: FREE_BOOK_LIMIT,
    seats: null, schoolRole: null, fullLibrary: false, unlimitedVirgil: false,
    advancedTrials: false, teacherTools: false,
  })

  // 6. Payment failed (invoice.payment_failed → past_due) → access reverts.
  await setSubscription(solo, { tier: "solo", status: "past_due" })
  expectEntitlement("past_due (dunning) reverts to Free", await getEntitlement(solo), {
    tier: "free", status: "past_due", isActive: false, bookLimit: FREE_BOOK_LIMIT,
    seats: null, schoolRole: null, fullLibrary: false, unlimitedVirgil: false,
    advancedTrials: false, teacherTools: false,
  })

  // ===== FAMILY smoke =====
  console.log("\nFAMILY smoke")
  const family = await makeUser("family")
  await setSubscription(family, { tier: "family", status: "active" })
  expectEntitlement("active Family unlocks full library (no teacher tools)", await getEntitlement(family), {
    tier: "family", status: "active", isActive: true, bookLimit: null,
    seats: null, schoolRole: null, fullLibrary: true, unlimitedVirgil: true,
    advancedTrials: true, teacherTools: false,
  })

  // ===== SCHOOL smoke (admin + covered teacher) =====
  console.log("\nSCHOOL smoke")
  const schoolAdmin = await makeUser("school-admin")
  const coveredTeacher = await makeUser("school-teacher")
  await setSubscription(schoolAdmin, { tier: "school", status: "active", seats: 5 })
  await addSchoolSeat(schoolAdmin, schoolAdmin, "admin")
  await addSchoolSeat(schoolAdmin, coveredTeacher, "teacher")

  expectEntitlement("School admin: 5 seats, teacher tools", await getEntitlement(schoolAdmin), {
    tier: "school", status: "active", isActive: true, bookLimit: null,
    seats: 5, schoolRole: "admin", fullLibrary: true, unlimitedVirgil: true,
    advancedTrials: true, teacherTools: true,
  })
  const adminEnt = await getEntitlement(schoolAdmin)
  check("School admin coveredBy = self", adminEnt.coveredBy, schoolAdmin)

  expectEntitlement("Covered teacher inherits School access", await getEntitlement(coveredTeacher), {
    tier: "school", status: "active", isActive: true, bookLimit: null,
    seats: 5, schoolRole: "teacher", fullLibrary: true, unlimitedVirgil: true,
    advancedTrials: true, teacherTools: true,
  })
  const teacherEnt = await getEntitlement(coveredTeacher)
  check("Covered teacher coveredBy = admin", teacherEnt.coveredBy, schoolAdmin)

  // School canceled → BOTH admin and covered teacher revert to Free.
  await setSubscription(schoolAdmin, { tier: "school", status: "canceled", seats: 5 })
  expectEntitlement("Canceled School: admin reverts to Free", await getEntitlement(schoolAdmin), {
    tier: "free", status: "canceled", isActive: false, bookLimit: FREE_BOOK_LIMIT,
    seats: null, schoolRole: null, fullLibrary: false, unlimitedVirgil: false,
    advancedTrials: false, teacherTools: false,
  })
  expectEntitlement("Canceled School: covered teacher reverts to Free", await getEntitlement(coveredTeacher), {
    tier: "free", status: null, isActive: false, bookLimit: FREE_BOOK_LIMIT,
    seats: null, schoolRole: null, fullLibrary: false, unlimitedVirgil: false,
    advancedTrials: false, teacherTools: false,
  })
}

run()
  .then(cleanup, async (err) => {
    await cleanup()
    throw err
  })
  .then(() => {
    console.log(`\n${passed} checks passed, ${failed} failed.`)
    process.exit(failed === 0 ? 0 : 1)
  })
  .catch((err) => {
    console.error("\n✗ Suite errored:", err instanceof Error ? err.message : err)
    console.error(
      "  (If this is a connection timeout, the Supabase project may be paused — wake it and retry.)",
    )
    process.exit(1)
  })
