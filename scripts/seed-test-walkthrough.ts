/**
 * seed-test-walkthrough.ts — a focused, idempotent teacher↔student walkthrough.
 *
 *   npx tsx scripts/seed-test-walkthrough.ts
 *
 * Stands up ONE teacher, THREE students, and ONE billing account as real
 * Supabase auth accounts (service role, email_confirm: true → immediate login,
 * no verification email), plus a classroom, enrollment, and a single Trial
 * assignment with deliberately varied state so the gradebook has something to
 * show on first load.
 *
 * Everything is tagged (user_metadata.seed = 'walkthrough' AND the dedicated
 * @walkthrough.tome.test domain) and looked up by natural key, so re-running
 * never duplicates and `teardown-test-walkthrough.ts` removes exactly this set.
 * It touches NO real user data.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (.env.local).
 * The service-role key is never printed.
 *
 * See docs/WALKTHROUGH-AUDIT.md for the schema/flow facts this relies on.
 */
import "./load-env"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Constants (kept in sync with teardown-test-walkthrough.ts) ──────────────
export const WALKTHROUGH_DOMAIN = "walkthrough.tome.test"
export const WALKTHROUGH_TAG = "walkthrough"
export const PASSWORD = process.env.WALKTHROUGH_PASSWORD || "TomeTest2026!"
export const CLASSROOM_NAME = "Third Period — Great Books"
export const JOIN_CODE = "GRTBK3" // 6-char, safe charset (no 0/O/I/1/l)
export const ASSIGNMENT_TITLE = "Trial — The Odyssey, Books I–III"
const BOOK_ID = "the-odyssey"
const BOOK_TITLE = "The Odyssey"

const DAY = 86_400_000
const ago = (ms: number) => new Date(Date.now() - ms).toISOString()
const ahead = (ms: number) => new Date(Date.now() + ms).toISOString()

interface AccountDef {
  key: "teacher" | "alpha" | "beta" | "gamma" | "billing"
  local: string
  name: string
  role: "teacher" | "student" | "reader"
  sub: { tier: "school" | "solo"; seats?: number } | null
}

const ACCOUNTS: AccountDef[] = [
  { key: "teacher", local: "teacher.test", name: "Terry Teacher", role: "teacher", sub: { tier: "school", seats: 5 } },
  { key: "alpha", local: "student.alpha", name: "Alpha Adams", role: "student", sub: { tier: "solo" } },
  { key: "beta", local: "student.beta", name: "Beta Brooks", role: "student", sub: { tier: "solo" } },
  { key: "gamma", local: "student.gamma", name: "Gamma Gray", role: "student", sub: { tier: "solo" } },
  { key: "billing", local: "billing.test", name: "Billy Billing", role: "reader", sub: null },
]

const emailFor = (a: AccountDef) => `${a.local}@${WALKTHROUGH_DOMAIN}`
const usernameFor = (a: AccountDef) => a.local.replace(/\./g, "-")

const id: Record<AccountDef["key"], string> = {} as Record<AccountDef["key"], string>

// ── Accounts ────────────────────────────────────────────────────────────────

async function findOrCreateUser(email: string, name: string): Promise<string> {
  const created = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: name, seed: WALKTHROUGH_TAG },
  })
  if (created.data.user) return created.data.user.id

  // Already exists → find it, reset the password + tag so login is guaranteed.
  for (let page = 1; page <= 30; page++) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (match) {
      await admin.auth.admin.updateUserById(match.id, {
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { display_name: name, seed: WALKTHROUGH_TAG },
      })
      return match.id
    }
    if (data.users.length < 200) break
  }
  throw new Error(`Could not create or find ${email}: ${created.error?.message}`)
}

async function seedAccounts() {
  console.log("\n── Accounts ────────────────────────────────────")
  for (const a of ACCOUNTS) {
    id[a.key] = await findOrCreateUser(emailFor(a), a.name)
    // handle_new_user already created the profiles row — UPDATE it.
    await admin
      .from("profiles")
      .update({
        role: a.role,
        display_name: a.name,
        username: usernameFor(a),
        onboarding_completed: true,
      })
      .eq("id", id[a.key])

    if (a.sub) {
      await admin.from("subscriptions").upsert(
        {
          user_id: id[a.key],
          tier: a.sub.tier,
          status: "active",
          seats: a.sub.seats ?? null,
          current_period_end: ahead(365 * DAY),
        },
        { onConflict: "user_id" },
      )
    } else {
      // Ensure the billing account is genuinely un-comped even on re-run.
      await admin.from("subscriptions").delete().eq("user_id", id[a.key])
    }
    console.log(`  ${a.role.padEnd(7)} ${emailFor(a)}${a.sub ? `  [${a.sub.tier}]` : "  [free]"}`)
  }
}

// ── Classroom + enrollment ──────────────────────────────────────────────────

async function seedClassroom(): Promise<string> {
  console.log("\n── Classroom + enrollment ──────────────────────")
  const { data: existing } = await admin
    .from("classrooms")
    .select("id")
    .eq("teacher_id", id.teacher)
    .eq("name", CLASSROOM_NAME)
    .maybeSingle<{ id: string }>()

  let classroomId: string
  if (existing) {
    classroomId = existing.id
    await admin
      .from("classrooms")
      .update({ join_code: JOIN_CODE, archived: false, archived_at: null, max_students: 35 })
      .eq("id", classroomId)
  } else {
    const { data, error } = await admin
      .from("classrooms")
      .insert({
        teacher_id: id.teacher,
        name: CLASSROOM_NAME,
        subject: "English",
        grade_level: "9",
        join_code: JOIN_CODE,
        max_students: 35,
      })
      .select("id")
      .single<{ id: string }>()
    if (error) throw new Error(`classroom: ${error.message}`)
    classroomId = data.id
  }

  // Owner membership + enroll alpha & beta. Gamma is LEFT OUT on purpose so the
  // live join flow can be tested during the walkthrough.
  const members = [
    { classroom_id: classroomId, student_id: id.teacher, role: "owner" },
    { classroom_id: classroomId, student_id: id.alpha, role: "student" },
    { classroom_id: classroomId, student_id: id.beta, role: "student" },
  ]
  const { error: mErr } = await admin
    .from("classroom_members")
    .upsert(members, { onConflict: "classroom_id,student_id" })
  if (mErr) throw new Error(`enrollment: ${mErr.message}`)

  // Belt-and-braces: make sure gamma is NOT a member (e.g. after a live join on
  // a prior run) so re-seeding restores the unenrolled starting state.
  await admin
    .from("classroom_members")
    .delete()
    .eq("classroom_id", classroomId)
    .eq("student_id", id.gamma)

  console.log(`  ${CLASSROOM_NAME}  →  ${classroomId}`)
  console.log(`  join code: ${JOIN_CODE}   enrolled: alpha, beta   (gamma unenrolled)`)
  return classroomId
}

// ── Assignment + staged submissions ─────────────────────────────────────────

async function clearAssignmentChildren(assignmentId: string) {
  const { data: subs } = await admin
    .from("assignment_submissions")
    .select("id")
    .eq("assignment_id", assignmentId)
  const subIds = (subs ?? []).map((s: { id: string }) => s.id)
  if (subIds.length) {
    const { data: grds } = await admin.from("grades").select("id").in("submission_id", subIds)
    const gradeIds = (grds ?? []).map((g: { id: string }) => g.id)
    if (gradeIds.length) await admin.from("grade_history").delete().in("grade_id", gradeIds)
    await admin.from("grades").delete().in("submission_id", subIds)
    await admin.from("assignment_submissions").delete().eq("assignment_id", assignmentId)
  }
}

async function seedAssignment(classroomId: string) {
  console.log("\n── Assignment + staged state ───────────────────")

  const fields = {
    classroom_id: classroomId,
    teacher_id: id.teacher,
    type: "trial",
    title: ASSIGNMENT_TITLE,
    description: `Pass the Scholar-tier Trial for the opening books of ${BOOK_TITLE}. Launch it from the reader.`,
    book_id: BOOK_ID,
    chapter_range_start: 0, // Book I (?ch= is 0-based)
    chapter_range_end: 2, // through Book III
    // trial_id has a FK to the trials table; the reader Trial launch keys off
    // book_id + chapter range (not trial_id), so leave it null.
    trial_id: null as string | null,
    points_available: 100,
    scope: "classroom",
    status: "active",
    due_date: ahead(7 * DAY),
  }

  const { data: existing } = await admin
    .from("assignments")
    .select("id")
    .eq("classroom_id", classroomId)
    .eq("title", ASSIGNMENT_TITLE)
    .maybeSingle<{ id: string }>()

  let assignmentId: string
  if (existing) {
    assignmentId = existing.id
    await clearAssignmentChildren(assignmentId)
    await admin.from("assignments").update(fields).eq("id", assignmentId)
  } else {
    const { data, error } = await admin
      .from("assignments")
      .insert(fields)
      .select("id")
      .single<{ id: string }>()
    if (error) throw new Error(`assignment: ${error.message}`)
    assignmentId = data.id
  }

  // Roster rows (mirrors publishAssignment): alpha has completed the Trial,
  // beta has not started. The gradebook derives alpha's score from quiz_results.
  await admin.from("assignment_submissions").insert([
    {
      assignment_id: assignmentId,
      student_id: id.alpha,
      status: "submitted",
      submitted_at: ago(2 * DAY),
      score: 90,
    },
    {
      assignment_id: assignmentId,
      student_id: id.beta,
      status: "not_started",
    },
  ])

  // Alpha's real Trial attempt (percent score, matches record_trial_result).
  await admin
    .from("quiz_results")
    .delete()
    .eq("user_id", id.alpha)
    .eq("book_id", BOOK_ID)
  const { error: qErr } = await admin.from("quiz_results").insert({
    user_id: id.alpha,
    book_id: BOOK_ID,
    chapter_index: 0,
    difficulty: "Scholar",
    score: 90, // percent
    total_questions: 10,
    wisdom_earned: 0,
    passed: true,
    created_at: ago(2 * DAY),
  })
  if (qErr) throw new Error(`quiz_results: ${qErr.message}`)

  console.log(`  ${ASSIGNMENT_TITLE}  →  ${assignmentId}`)
  console.log(`  alpha: Trial completed (90%)   beta: not started`)
  return assignmentId
}

// ── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding walkthrough environment (idempotent)…")
  await seedAccounts()
  const classroomId = await seedClassroom()
  await seedAssignment(classroomId)

  console.log("\n── Credentials (shared password) ───────────────")
  console.log(`  password: ${PASSWORD}`)
  for (const a of ACCOUNTS) console.log(`  ${emailFor(a)}`)
  console.log(`\n  Classroom : ${CLASSROOM_NAME}`)
  console.log(`  Join code : ${JOIN_CODE}  (gamma joins with this live)`)
  console.log("\nDone. (service-role key never printed)")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
