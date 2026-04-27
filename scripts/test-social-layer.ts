#!/usr/bin/env npx tsx
/**
 * test-social-layer.ts
 *
 * End-to-end smoke test of the Phase 1 schema + Phase 2 server actions.
 * Creates ephemeral users via the auth admin API, drives them through the
 * full social flow, asserts each step, and cleans up.
 *
 * Required env (in .env.local or shell):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run: npx tsx scripts/test-social-layer.ts
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.",
  )
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

interface TestUser {
  id: string
  email: string
  client: SupabaseClient
}

let createdUserIds: string[] = []

async function createUser(role: "reader" | "teacher" = "reader"): Promise<TestUser> {
  const email = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@tome.test`
  const password = "TestPass!2025"

  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error || !created.user) throw new Error(`createUser: ${error?.message}`)
  const userId = created.user.id
  createdUserIds.push(userId)

  // Insert the matching profile row.
  await admin.from("profiles").insert({
    id: userId,
    role,
    display_name: `Test ${role} ${userId.slice(0, 4)}`,
    username: `t_${userId.slice(0, 8)}`,
  })

  // Sign in to get a JWT-bearing client.
  const userClient = createClient(SUPABASE_URL!, ANON_KEY!)
  const { error: signInErr } = await userClient.auth.signInWithPassword({
    email,
    password,
  })
  if (signInErr) throw new Error(`signIn: ${signInErr.message}`)

  return { id: userId, email, client: userClient }
}

async function cleanup() {
  for (const id of createdUserIds) {
    try {
      await admin.auth.admin.deleteUser(id)
    } catch (e) {
      console.warn(`cleanup: failed to delete ${id}:`, (e as Error).message)
    }
  }
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`ASSERT FAIL: ${msg}`)
}

async function main() {
  console.log("→ Creating test users...")
  const alice = await createUser("reader")
  const bob = await createUser("reader")
  const teacher = await createUser("teacher")
  console.log(`  alice=${alice.id.slice(0, 8)} bob=${bob.id.slice(0, 8)} teacher=${teacher.id.slice(0, 8)}`)

  // ── 1. Friend request flow ──────────────────────────────────────────────
  console.log("→ Alice → Bob friend request")
  const { data: conn, error: cErr } = await alice.client
    .from("connections")
    .insert({ requester_id: alice.id, recipient_id: bob.id, status: "pending" })
    .select("id")
    .single()
  assert(!cErr && conn, `friend request insert: ${cErr?.message}`)
  console.log("  ✓ pending connection created")

  console.log("→ Bob accepts")
  const { error: aErr } = await bob.client
    .from("connections")
    .update({ status: "accepted", responded_at: new Date().toISOString() })
    .eq("id", conn!.id)
  assert(!aErr, `accept failed: ${aErr?.message}`)
  console.log("  ✓ connection accepted")

  // ── 2. Teacher creates classroom ────────────────────────────────────────
  console.log("→ Teacher creates classroom")
  const joinCode = `TST-${Date.now().toString(36).toUpperCase().slice(-6)}`
  const { data: classroom, error: ccErr } = await teacher.client
    .from("classrooms")
    .insert({
      name: "Smoke Test Classroom",
      teacher_id: teacher.id,
      join_code: joinCode,
    })
    .select("id, join_code")
    .single()
  assert(!ccErr && classroom, `create classroom: ${ccErr?.message}`)

  // Bootstrap owner membership via admin (simulates server action).
  await admin.from("classroom_members").insert({
    classroom_id: classroom!.id,
    student_id: teacher.id,
    role: "owner",
  })
  console.log(`  ✓ classroom created (code=${classroom!.join_code})`)

  // ── 3. Alice joins via code (server-side admin-bypass) ───────────────────
  console.log("→ Alice joins by code")
  const { error: joinErr } = await admin.from("classroom_members").insert({
    classroom_id: classroom!.id,
    student_id: alice.id,
    role: "student",
  })
  assert(!joinErr, `join: ${joinErr?.message}`)
  console.log("  ✓ alice is now a student")

  // ── 4. Teacher creates ad-hoc group + assignment with peer review ───────
  console.log("→ Teacher creates group + assignment with peer review")
  const { data: group, error: gErr } = await teacher.client
    .from("classroom_groups")
    .insert({
      classroom_id: classroom!.id,
      name: "Reading Crew",
      created_by: teacher.id,
    })
    .select("id")
    .single()
  assert(!gErr && group, `create group: ${gErr?.message}`)

  await teacher.client.from("classroom_group_members").insert({
    group_id: group!.id,
    user_id: alice.id,
  })

  const { data: assignment, error: asErr } = await teacher.client
    .from("assignments")
    .insert({
      classroom_id: classroom!.id,
      teacher_id: teacher.id,
      title: "Read Chapter 1",
      type: "chapter_read",
      scope: "group",
      status: "active",
      points_available: 100,
      peer_review_enabled: true,
      peer_reviewers_per_submission: 1,
    })
    .select("id")
    .single()
  assert(!asErr && assignment, `create assignment: ${asErr?.message}`)

  await teacher.client.from("assignment_targets").insert({
    assignment_id: assignment!.id,
    target_type: "group",
    group_id: group!.id,
  })
  console.log("  ✓ assignment created")

  // ── 5. Alice submits ────────────────────────────────────────────────────
  console.log("→ Alice submits")
  const { data: sub, error: sErr } = await alice.client
    .from("assignment_submissions")
    .insert({
      assignment_id: assignment!.id,
      student_id: alice.id,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .select("id")
    .single()
  assert(!sErr && sub, `submit: ${sErr?.message}`)
  console.log("  ✓ submission recorded")

  // ── 6. Teacher grades (manual) ──────────────────────────────────────────
  console.log("→ Teacher grades 95/100")
  const { error: grErr } = await teacher.client.from("grades").insert({
    submission_id: sub!.id,
    score: 95,
    max_score: 100,
    feedback: "Solid work.",
    is_auto_graded: false,
    graded_by: teacher.id,
  })
  assert(!grErr, `grade: ${grErr?.message}`)
  console.log("  ✓ grade written")

  // ── 7. Teacher posts an announcement ────────────────────────────────────
  console.log("→ Teacher posts announcement")
  const { error: anErr } = await teacher.client
    .from("classroom_announcements")
    .insert({
      classroom_id: classroom!.id,
      teacher_id: teacher.id,
      content: "Welcome to the smoke test.",
    })
  assert(!anErr, `announce: ${anErr?.message}`)
  console.log("  ✓ announcement posted")

  // ── 8. Bob recommends a book to Alice (they're friends) ─────────────────
  console.log("→ Bob recommends a book to Alice")
  const { data: anyBook } = await admin.from("books").select("id").limit(1).single()
  if (anyBook) {
    const { error: rErr } = await bob.client.from("book_recommendations").insert({
      sender_id: bob.id,
      recipient_id: alice.id,
      book_id: anyBook.id,
      status: "pending",
    })
    assert(!rErr, `recommend: ${rErr?.message}`)
    console.log("  ✓ recommendation sent")
  } else {
    console.log("  (skipped — no books in DB)")
  }

  // ── 9. RLS negative tests ───────────────────────────────────────────────
  console.log("→ RLS: Bob tries to read Alice/Teacher's classroom")
  const { data: bobSees } = await bob.client
    .from("classrooms")
    .select("id")
    .eq("id", classroom!.id)
  assert(
    !bobSees || bobSees.length === 0,
    `RLS LEAK: Bob can see classroom he isn't in`,
  )
  console.log("  ✓ Bob blocked")

  // ── 10. RLS: a third (non-classmate) user tries to recommend ────────────
  console.log("→ RLS: stranger tries to recommend a book to Alice")
  const stranger = await createUser("reader")
  if (anyBook) {
    const { error: strErr } = await stranger.client
      .from("book_recommendations")
      .insert({
        sender_id: stranger.id,
        recipient_id: alice.id,
        book_id: anyBook.id,
        status: "pending",
      })
    assert(strErr, `RLS LEAK: stranger could recommend without relationship`)
    console.log("  ✓ stranger blocked")
  }

  console.log("\n✓ All assertions passed.")
}

main()
  .catch((e) => {
    console.error("\n✗ Smoke test failed:", e)
    process.exitCode = 1
  })
  .finally(async () => {
    console.log("\n→ Cleaning up test users...")
    await cleanup()
    console.log("  done.")
  })
