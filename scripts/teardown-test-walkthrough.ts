/**
 * teardown-test-walkthrough.ts — removes exactly what seed-test-walkthrough.ts
 * created, and nothing else.
 *
 *   npx tsx scripts/teardown-test-walkthrough.ts
 *
 * Targets ONLY accounts on the dedicated @walkthrough.tome.test domain (also
 * tagged user_metadata.seed = 'walkthrough'). Deletes their owned classroom and
 * all of its children (assignments → submissions → grades → grade_history),
 * their quiz_results / subscriptions / classroom memberships, and finally the
 * auth users (which cascades their profiles). Idempotent + safe to re-run.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (.env.local).
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

const WALKTHROUGH_DOMAIN = "walkthrough.tome.test"

async function collectUsers(): Promise<{ id: string; email: string }[]> {
  const found: { id: string; email: string }[] = []
  for (let page = 1; page <= 30; page++) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    for (const u of data.users) {
      const email = u.email?.toLowerCase() ?? ""
      const tagged = (u.user_metadata as { seed?: string } | null)?.seed === "walkthrough"
      if (email.endsWith(`@${WALKTHROUGH_DOMAIN}`) || tagged) {
        // Guard: only ever touch the dedicated domain, even if a tag leaked.
        if (email.endsWith(`@${WALKTHROUGH_DOMAIN}`)) found.push({ id: u.id, email })
      }
    }
    if (data.users.length < 200) break
  }
  return found
}

async function main() {
  console.log("Tearing down walkthrough environment…")
  const users = await collectUsers()
  if (users.length === 0) {
    console.log("  No @walkthrough.tome.test accounts found. Nothing to do.")
    return
  }
  const userIds = users.map((u) => u.id)

  // Classrooms owned by any walkthrough account (the teacher's class).
  const { data: rooms } = await admin
    .from("classrooms")
    .select("id")
    .in("teacher_id", userIds)
  const roomIds = (rooms ?? []).map((r: { id: string }) => r.id)

  // Assignments in those classrooms → submissions → grades → grade_history.
  if (roomIds.length) {
    const { data: assigns } = await admin
      .from("assignments")
      .select("id")
      .in("classroom_id", roomIds)
    const assignIds = (assigns ?? []).map((a: { id: string }) => a.id)
    if (assignIds.length) {
      const { data: subs } = await admin
        .from("assignment_submissions")
        .select("id")
        .in("assignment_id", assignIds)
      const subIds = (subs ?? []).map((s: { id: string }) => s.id)
      if (subIds.length) {
        const { data: grds } = await admin.from("grades").select("id").in("submission_id", subIds)
        const gradeIds = (grds ?? []).map((g: { id: string }) => g.id)
        if (gradeIds.length) await admin.from("grade_history").delete().in("grade_id", gradeIds)
        await admin.from("grades").delete().in("submission_id", subIds)
      }
      await admin.from("assignment_submissions").delete().in("assignment_id", assignIds)
      await admin.from("assignments").delete().in("id", assignIds)
    }
    await admin.from("classroom_members").delete().in("classroom_id", roomIds)
    await admin.from("classrooms").delete().in("id", roomIds)
  }

  // Per-user artifacts (memberships elsewhere, quiz attempts, subscriptions).
  await admin.from("classroom_members").delete().in("student_id", userIds)
  await admin.from("quiz_results").delete().in("user_id", userIds)
  await admin.from("subscriptions").delete().in("user_id", userIds)
  // Any submissions the users authored outside the torn-down classrooms.
  await admin.from("assignment_submissions").delete().in("student_id", userIds)

  // Finally the auth users (cascades profiles).
  for (const u of users) {
    const { error } = await admin.auth.admin.deleteUser(u.id)
    if (error) console.error(`  failed to delete ${u.email}: ${error.message}`)
    else console.log(`  deleted ${u.email}`)
  }

  console.log(`\nRemoved ${users.length} account(s) and their classroom data. Done.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
