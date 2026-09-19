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
 *           (grandfathered; active Solo must still read beyond-sampler books)
 *   Family: active (student allowance 4)     [smoke]
 *   School: admin + covered teacher, seats, then cancel reverts both  [smoke]
 * Launch-model (Gate 2) scenarios:
 *   Free teacher:  educator tools free; 30-student / 1-classroom allowance
 *   Classroom:     seats:25 → allowance 25; the 26th join is rejected;
 *                  cancel_at_period_end retains; canceled reverts to free
 *   School pooled: seats:150 shared across covered teachers; a student in two
 *                  covered classrooms counts ONCE; flat150 SKU → allowance 150
 *   Legacy school: per-teacher holder still resolves as a teacher
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
  hasEducatorTools,
  getSeatAllowance,
  getClassroomAllowance,
  canUserReadBook,
  type Entitlement,
} from "@/lib/entitlements/server"
import { FREE_BOOK_LIMIT, isFreeSample } from "@/lib/stripe/free-books"
import {
  FREE_TEACHER_CLASSROOM_LIMIT,
  FREE_TEACHER_STUDENT_LIMIT,
  FAMILY_STUDENT_LIMIT,
  SCHOOL_MIN_SEATS,
} from "@/lib/billing/config"

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
    {
      subscription_user_id: ownerId,
      teacher_id: teacherId,
      seat_role: role,
      status: "active", // getSeatAllowance only counts active seats
    },
    { onConflict: "subscription_user_id,teacher_id", ignoreDuplicates: false },
  )
  if (error) throw new Error(`school_seats upsert failed: ${error.message}`)
}

/** handle_new_user auto-creates the profiles row — UPDATE, never INSERT. */
async function setProfileRole(
  userId: string,
  role: "reader" | "teacher" | "student",
) {
  const { error } = await admin.from("profiles").update({ role }).eq("id", userId)
  if (error) throw new Error(`profiles role update failed: ${error.message}`)
}

const createdClassroomIds: string[] = []

/** Admin-inserted classroom mirroring createClassroom (owner member row incl.). */
async function makeClassroom(teacherId: string, name: string): Promise<string> {
  const joinCode = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()
  const { data, error } = await admin
    .from("classrooms")
    .insert({ name, teacher_id: teacherId, join_code: joinCode })
    .select("id")
    .single()
  if (error || !data) {
    throw new Error(`classrooms insert failed: ${error?.message ?? "no row"}`)
  }
  createdClassroomIds.push(data.id as string)
  const { error: memberErr } = await admin
    .from("classroom_members")
    .insert({ classroom_id: data.id, student_id: teacherId, role: "owner" })
  if (memberErr) {
    throw new Error(`owner member insert failed: ${memberErr.message}`)
  }
  return data.id as string
}

async function enrollStudent(classroomId: string, studentId: string) {
  const { error } = await admin
    .from("classroom_members")
    .insert({ classroom_id: classroomId, student_id: studentId, role: "student" })
  if (error) throw new Error(`student enroll failed: ${error.message}`)
}

async function cleanup() {
  console.log("\nCleaning up fixtures…")
  for (const id of createdClassroomIds) {
    await admin.from("classroom_members").delete().eq("classroom_id", id)
    await admin.from("classrooms").delete().eq("id", id)
  }
  for (const id of createdUserIds) {
    await admin.from("school_seats").delete().eq("teacher_id", id)
    await admin.from("school_seats").delete().eq("subscription_user_id", id)
    await admin.from("subscriptions").delete().eq("user_id", id)
    await admin.auth.admin.deleteUser(id).catch(() => {})
  }
  console.log(
    `  removed ${createdUserIds.length} ephemeral users + ${createdClassroomIds.length} classrooms + their rows`,
  )
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
  // Grandfathered rule: an active legacy Solo must keep reading ALL books.
  const paidBook = "wuthering-heights"
  check("precondition: test book is beyond the free sampler", isFreeSample(paidBook), false)
  check("active Solo reads a beyond-sampler book", await canUserReadBook(solo, paidBook), true)

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
  const familySeat = await getSeatAllowance(family)
  check("Family student allowance", familySeat.allowance, FAMILY_STUDENT_LIMIT)
  check("Family classroom allowance is uncapped", await getClassroomAllowance(family), null)

  // ===== FREE TEACHER (teachers are free forever) =====
  console.log("\nFREE TEACHER")
  const freeTeacher = await makeUser("free-teacher")
  await setProfileRole(freeTeacher, "teacher")
  check("free teacher has educator tools", await hasEducatorTools(freeTeacher), true)
  const freeSeat = await getSeatAllowance(freeTeacher)
  check("free teacher plan tier", freeSeat.tier, "free_teacher")
  check("free teacher student allowance", freeSeat.allowance, FREE_TEACHER_STUDENT_LIMIT)
  check("free teacher seats used (none enrolled)", freeSeat.used, 0)
  check("free teacher payerId", freeSeat.payerId, null)
  check(
    "free teacher classroom allowance",
    await getClassroomAllowance(freeTeacher),
    FREE_TEACHER_CLASSROOM_LIMIT,
  )

  // ===== CLASSROOM (per-student seats) =====
  console.log("\nCLASSROOM (per-student seats, seats:25)")
  const clsTeacher = await makeUser("classroom-teacher")
  await setProfileRole(clsTeacher, "teacher")
  await setSubscription(clsTeacher, { tier: "classroom", status: "active", seats: 25 })

  expectEntitlement("active Classroom unlocks full library", await getEntitlement(clsTeacher), {
    tier: "classroom", status: "active", isActive: true, bookLimit: null,
    seats: null, schoolRole: null, fullLibrary: true, unlimitedVirgil: true,
    advancedTrials: true, teacherTools: false,
  })
  check("classroom teacher keeps educator tools", await hasEducatorTools(clsTeacher), true)
  check("classroom plan lifts the classroom cap", await getClassroomAllowance(clsTeacher), null)

  const clsRoom = await makeClassroom(clsTeacher, "Billing Verify — Classroom 25")
  const clsStudents: string[] = []
  for (let i = 0; i < 25; i++) {
    const sid = await makeUser(`cls-student-${i}`)
    await setProfileRole(sid, "student")
    clsStudents.push(sid)
  }
  for (const sid of clsStudents.slice(0, 24)) await enrollStudent(clsRoom, sid)

  let clsSeat = await getSeatAllowance(clsTeacher)
  check("classroom allowance = purchased seats", clsSeat.allowance, 25)
  check("24 students enrolled → used 24", clsSeat.used, 24)
  check("25th join allowed (used < allowance)", clsSeat.used >= clsSeat.allowance, false)

  await enrollStudent(clsRoom, clsStudents[24])
  clsSeat = await getSeatAllowance(clsTeacher)
  check("25 students enrolled → used 25", clsSeat.used, 25)
  check("26th join rejected (used >= allowance)", clsSeat.used >= clsSeat.allowance, true)
  check("classroom payerId = teacher", clsSeat.payerId, clsTeacher)

  // Cancel at period end: status stays active → seats retained.
  await setSubscription(clsTeacher, {
    tier: "classroom", status: "active", seats: 25, cancel_at_period_end: true,
  })
  clsSeat = await getSeatAllowance(clsTeacher)
  check("cancel-at-period-end retains 25-seat allowance", clsSeat.allowance, 25)

  // Period ends → canceled → reverts to free-teacher allowances.
  await setSubscription(clsTeacher, { tier: "classroom", status: "canceled", seats: 25 })
  clsSeat = await getSeatAllowance(clsTeacher)
  check("canceled Classroom reverts to free-teacher tier", clsSeat.tier, "free_teacher")
  check("canceled Classroom reverts to free student allowance", clsSeat.allowance, FREE_TEACHER_STUDENT_LIMIT)
  check(
    "canceled Classroom reverts to 1-classroom allowance",
    await getClassroomAllowance(clsTeacher),
    FREE_TEACHER_CLASSROOM_LIMIT,
  )
  check("canceled Classroom teacher keeps educator tools", await hasEducatorTools(clsTeacher), true)

  // ===== SCHOOL pooled seats (seats:150, two covered teachers) =====
  console.log("\nSCHOOL pooled seats (seats:150, shared usage)")
  const poolAdmin = await makeUser("school-pool-admin")
  const poolTeacher = await makeUser("school-pool-teacher")
  await setProfileRole(poolAdmin, "teacher")
  await setProfileRole(poolTeacher, "teacher")
  await setSubscription(poolAdmin, { tier: "school", status: "active", seats: 150 })
  await addSchoolSeat(poolAdmin, poolAdmin, "admin")
  await addSchoolSeat(poolAdmin, poolTeacher, "teacher")

  const roomA = await makeClassroom(poolAdmin, "Billing Verify — School Room A")
  const roomB = await makeClassroom(poolTeacher, "Billing Verify — School Room B")
  const s1 = await makeUser("school-student-1")
  const s2 = await makeUser("school-student-2")
  const s3 = await makeUser("school-student-3")
  for (const sid of [s1, s2, s3]) await setProfileRole(sid, "student")
  await enrollStudent(roomA, s1)
  await enrollStudent(roomA, s3)
  await enrollStudent(roomB, s2)
  await enrollStudent(roomB, s3) // s3 is in BOTH covered classrooms

  const adminSeat = await getSeatAllowance(poolAdmin)
  check("pooled admin allowance = 150", adminSeat.allowance, 150)
  check("pooled usage counts a shared student ONCE (3, not 4)", adminSeat.used, 3)
  check("pooled admin payerId = admin", adminSeat.payerId, poolAdmin)
  const covSeat = await getSeatAllowance(poolTeacher)
  check("covered teacher shares the 150 allowance", covSeat.allowance, 150)
  check("covered teacher sees the same pooled usage", covSeat.used, 3)
  check("covered teacher payerId = admin", covSeat.payerId, poolAdmin)

  // Flat 150 SKU: the webhook writes seats = maxStudents for flat prices.
  console.log("\nSCHOOL flat150 SKU")
  const flatAdmin = await makeUser("school-flat150")
  await setProfileRole(flatAdmin, "teacher")
  await setSubscription(flatAdmin, { tier: "school", status: "active", seats: 150 })
  await addSchoolSeat(flatAdmin, flatAdmin, "admin")
  const flatSeat = await getSeatAllowance(flatAdmin)
  check("flat150 allowance = 150", flatSeat.allowance, 150)

  // ===== LEGACY SCHOOL (per-teacher, grandfathered) =====
  console.log("\nLEGACY SCHOOL (per-teacher, grandfathered)")
  const legacy = await makeUser("legacy-school")
  await setProfileRole(legacy, "teacher")
  await setSubscription(legacy, { tier: "school", status: "active" }) // no seats col on legacy rows
  check("legacy school holder is still a teacher", await hasEducatorTools(legacy), true)
  const legacyEnt = await getEntitlement(legacy)
  check("legacy school holder resolves school tier", legacyEnt.tier, "school")
  const legacySeat = await getSeatAllowance(legacy)
  check("legacy school seatless row falls back to SCHOOL_MIN_SEATS", legacySeat.allowance, SCHOOL_MIN_SEATS)

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
