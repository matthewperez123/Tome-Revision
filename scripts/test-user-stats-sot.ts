/**
 * user_stats source-of-truth — end-to-end test.
 *
 *   npx tsx scripts/test-user-stats-sot.ts
 *
 * Proves that a brand-new account gets correct, persistent starting stats and
 * that the gamification store is server-authoritative (anti-spoof):
 *   1. Creating an auth user fires handle_new_user → a user_stats row is seeded.
 *   2. A fresh user gets the correct defaults (0 Wisdom / 0 streak / 5 hearts).
 *   3. economy_award (called under the user's own RLS context) persists Wisdom,
 *      coins and advances the streak — and survives a fresh read.
 *   4. The profiles mirror (total_xp / current_streak) tracks user_stats.
 *   5. A direct client UPDATE to user_stats is REJECTED (writes go through RPCs).
 *
 * Creates a throwaway user and deletes it at the end. Service-role + anon keys
 * from .env.local.
 */
import "./load-env"
import assert from "node:assert/strict"
import { createClient } from "@supabase/supabase-js"

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!URL || !SERVICE_ROLE || !ANON) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY")
  process.exit(1)
}

const admin = createClient(URL, SERVICE_ROLE, { auth: { autoRefreshToken: false, persistSession: false } })

const EMAIL = `sot-test-${Date.now()}@example.com`
const PASSWORD = "SotTest!2026"

let passed = 0
function check(label: string, actual: unknown, expected: unknown) {
  assert.deepEqual(actual, expected, `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  passed++
  console.log(`  ✓ ${label}`)
}

async function main() {
  // 1. Create a fresh auth user — the signup trigger should seed user_stats.
  const created = await admin.auth.admin.createUser({ email: EMAIL, password: PASSWORD, email_confirm: true })
  const userId = created.data.user?.id
  assert.ok(userId, `failed to create user: ${created.error?.message}`)
  console.log(`Created throwaway user ${EMAIL} (${userId})`)

  try {
    // 2. Trigger seeded a defaults row.
    const seeded = await admin.from("user_stats").select("*").eq("user_id", userId).maybeSingle()
    console.log("\nTrigger seeds a defaults row on signup:")
    check("user_stats row exists", !!seeded.data, true)
    check("xp_total = 0", seeded.data?.xp_total, 0)
    check("current_streak = 0", seeded.data?.current_streak, 0)
    check("hearts = 5", seeded.data?.hearts, 5)
    check("coins = 0", seeded.data?.coins, 0)
    check("daily_goal_minutes = 20", seeded.data?.daily_goal_minutes, 20)

    // Sign in as the user to get an RLS-scoped (anon-key) client.
    const userClient = createClient(URL, ANON, { auth: { autoRefreshToken: false, persistSession: false } })
    const signIn = await userClient.auth.signInWithPassword({ email: EMAIL, password: PASSWORD })
    assert.ok(signIn.data.session, `sign-in failed: ${signIn.error?.message}`)

    // economy_sync returns the authoritative row.
    console.log("\neconomy_sync returns correct defaults for a fresh user:")
    const sync = await userClient.rpc("economy_sync")
    const syncRow = Array.isArray(sync.data) ? sync.data[0] : sync.data
    check("sync xp_total = 0", syncRow?.xp_total, 0)
    check("sync hearts = 5", syncRow?.hearts, 5)

    // 3. Award persists Wisdom + coins and advances the streak.
    console.log("\neconomy_award persists and advances the streak:")
    const award = await userClient.rpc("economy_award", { p_xp: 50, p_coins: 5 })
    const awardRow = Array.isArray(award.data) ? award.data[0] : award.data
    check("award xp_total = 50", awardRow?.xp_total, 50)
    check("award coins = 5", awardRow?.coins, 5)
    check("award current_streak = 1 (first activity today)", awardRow?.current_streak, 1)

    // It survives a fresh read.
    const reread = await admin.from("user_stats").select("xp_total, coins, current_streak").eq("user_id", userId).single()
    check("persisted xp_total = 50", reread.data?.xp_total, 50)
    check("persisted coins = 5", reread.data?.coins, 5)
    check("persisted current_streak = 1", reread.data?.current_streak, 1)

    // 4. profiles mirror tracks user_stats.
    console.log("\nprofiles mirror tracks user_stats:")
    const prof = await admin.from("profiles").select("total_xp, current_streak").eq("id", userId).single()
    check("profiles.total_xp mirror = 50", prof.data?.total_xp, 50)
    check("profiles.current_streak mirror = 1", prof.data?.current_streak, 1)

    // 5. Anti-spoof: a direct client UPDATE is rejected (no table write grant).
    console.log("\nAnti-spoof: direct client writes are blocked:")
    const spoof = await userClient.from("user_stats").update({ xp_total: 999999 }).eq("user_id", userId)
    check("direct UPDATE rejected", spoof.error !== null, true)
    const after = await admin.from("user_stats").select("xp_total").eq("user_id", userId).single()
    check("xp_total unchanged after spoof attempt", after.data?.xp_total, 50)

    console.log(`\n${passed} checks passed.`)
  } finally {
    await admin.auth.admin.deleteUser(userId!)
    console.log(`\nCleaned up throwaway user ${userId}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
