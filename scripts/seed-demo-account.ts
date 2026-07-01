/**
 * Seed a DEDICATED demo account with realistic dashboard data.
 *
 *   npx tsx scripts/seed-demo-account.ts
 *
 * Why this exists
 * ───────────────
 * The reader dashboard is account-scoped and DB-backed (see
 * src/hooks/use-dashboard-data.ts). A fresh account therefore shows a welcoming
 * empty state, NOT fabricated progress. To demo a "full" dashboard for an
 * investor or school without faking data in the UI, sign in as the demo account
 * this script populates.
 *
 * What it does (idempotent — safe to re-run)
 *   1. Creates (or reuses) an auth user: DEMO_ACCOUNT_EMAIL / DEMO_ACCOUNT_PASSWORD.
 *   2. Sets its profile (display name, username, reader role, onboarding done).
 *   3. Replaces its user_stats / reading_progress / quiz_results / activities
 *      with a realistic, backdated snapshot.
 *
 * Isolation: every row is written under the demo user's id only, and activities
 * are visibility='friends', so this data never appears in any real user's
 * dashboard or public feed. Run with the service-role key (bypasses RLS).
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (from .env.local).
 * Optional overrides: DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD.
 */
import "./load-env"
import { createClient } from "@supabase/supabase-js"
import { getBook } from "@/lib/content"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const EMAIL = process.env.DEMO_ACCOUNT_EMAIL || "demo@usetome.app"
const PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD || "TomeDemo!2026"

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DAY = 86_400_000
const HOUR = 3_600_000
const ago = (ms: number) => new Date(Date.now() - ms).toISOString()
const today = () => new Date().toISOString().slice(0, 10)

/** A book's progress, expressed as a fraction so chapter_index follows the catalog. */
function chapterIndexForPct(bookId: string, pct: number): number {
  const book = getBook(bookId)
  const chapters = book?.chapters ?? 1
  return Math.max(0, Math.min(chapters - 1, Math.round((pct / 100) * chapters) - 1))
}

function lastChapter(bookId: string): number {
  return Math.max(0, (getBook(bookId)?.chapters ?? 1) - 1)
}

async function findOrCreateUser(): Promise<string> {
  // Try to create; if the email already exists, look it up.
  const created = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: "Eleanor Vance" },
  })
  if (created.data.user) {
    console.log(`  created auth user ${EMAIL}`)
    return created.data.user.id
  }

  // Already exists — page through users to find it.
  for (let page = 1; page <= 20; page++) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    const match = data.users.find((u) => u.email?.toLowerCase() === EMAIL.toLowerCase())
    if (match) {
      await admin.auth.admin.updateUserById(match.id, { password: PASSWORD, email_confirm: true })
      console.log(`  reusing existing auth user ${EMAIL}`)
      return match.id
    }
    if (data.users.length < 200) break
  }
  throw new Error(`Could not create or find demo user ${EMAIL}: ${created.error?.message}`)
}

async function main() {
  console.log("Seeding demo account…")
  const userId = await findOrCreateUser()

  // 1. Profile (handle_new_user trigger already inserted the row → UPDATE).
  await admin
    .from("profiles")
    .update({
      role: "reader",
      display_name: "Eleanor Vance",
      username: "eleanor",
      onboarding_completed: true,
    })
    .eq("id", userId)

  // 2. Gamification source of truth — a "Reader"-rank profile mid-streak.
  await admin.from("user_stats").upsert(
    {
      user_id: userId,
      xp_total: 420,
      current_streak: 5,
      longest_streak: 9,
      hearts: 5,
      coins: 64,
      daily_goal_minutes: 20,
      daily_progress_minutes: 14,
      last_active_date: today(),
      streak_freeze_available: true,
      hearts_last_regen: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  // 3. Reading progress (Continue Reading + completed count).
  const reading = [
    { book_id: "the-odyssey", pct: 23, updated_at: ago(2 * DAY) },
    { book_id: "pride-and-prejudice", pct: 68, updated_at: ago(6 * HOUR) },
    { book_id: "the-iliad", pct: 8, updated_at: ago(4 * DAY) },
    { book_id: "frankenstein", pct: 100, updated_at: ago(1 * DAY) },
  ]
    .filter((r) => getBook(r.book_id))
    .map((r) => ({
      user_id: userId,
      book_id: r.book_id,
      chapter_index:
        r.pct >= 100 ? lastChapter(r.book_id) : chapterIndexForPct(r.book_id, r.pct),
      page: null,
      scroll_ratio: null,
      updated_at: r.updated_at,
    }))

  await admin.from("reading_progress").delete().eq("user_id", userId)
  await admin.from("reading_progress").insert(reading)

  // 4. Quiz results (Trials).
  await admin.from("quiz_results").delete().eq("user_id", userId)
  await admin.from("quiz_results").insert(
    [
      { book_id: "the-odyssey", chapter_index: 2, difficulty: "Apprentice", score: 5, total_questions: 5, wisdom_earned: 25, passed: true, created_at: ago(3 * DAY) },
      { book_id: "pride-and-prejudice", chapter_index: 5, difficulty: "Scholar", score: 4, total_questions: 5, wisdom_earned: 40, passed: true, created_at: ago(2 * HOUR) },
      { book_id: "frankenstein", chapter_index: 6, difficulty: "Master", score: 6, total_questions: 6, wisdom_earned: 90, passed: true, created_at: ago(1 * DAY) },
    ]
      .filter((q) => getBook(q.book_id))
      .map((q) => ({ ...q, user_id: userId }))
  )

  // 5. Activity feed (Recent Activity + this week's reading). visibility=friends
  //    keeps demo data out of every real user's public feed.
  const activities = [
    { type: "book_started", entity_type: "book", entity_id: "the-iliad", created_at: ago(4 * DAY) },
    { type: "book_started", entity_type: "book", entity_id: "the-odyssey", created_at: ago(3 * DAY) },
    { type: "trial_passed", entity_type: "trial", entity_id: "the-odyssey:2", created_at: ago(3 * DAY) },
    { type: "book_started", entity_type: "book", entity_id: "frankenstein", created_at: ago(2 * DAY) },
    { type: "book_completed", entity_type: "book", entity_id: "frankenstein", created_at: ago(1 * DAY) },
    { type: "seal_earned", entity_type: "seal", entity_id: "well-read", created_at: ago(1 * DAY) },
    { type: "trial_passed", entity_type: "trial", entity_id: "pride-and-prejudice:5", created_at: ago(2 * HOUR) },
  ].map((a) => ({ ...a, actor_id: userId, visibility: "friends" as const }))

  await admin.from("activities").delete().eq("actor_id", userId)
  await admin.from("activities").insert(activities)

  console.log("\nDemo account seeded.")
  console.log(`  email:    ${EMAIL}`)
  console.log(`  password: ${PASSWORD}`)
  console.log(`  user_id:  ${userId}`)
  console.log("\nSign in as this account to see a fully-populated dashboard.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
