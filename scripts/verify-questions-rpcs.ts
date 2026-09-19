/**
 * Questions Available RPC unit tests (Gate 2).
 *
 * Proves, against the real database, that the SECURITY DEFINER RPCs from
 * 20260918010000_questions_available.sql enforce the launch rules:
 *
 *   1. consume beyond the balance raises `insufficient_questions`
 *   2. refund restores the balance (and ledgers `refund`)
 *   3. a repeated `stripe_event_id` grant is a NO-OP (exactly-once top-up)
 *   4. refresh_question_grants respects the 3-month accrual cap and never
 *      claws back an above-cap top-up balance
 *   5. an authenticated non-owner CANNOT consume from another teacher's pool
 *      (`not_pool_owner`), while the owner can
 *
 * Requires (from .env.local): NEXT_PUBLIC_SUPABASE_URL,
 * NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
 * All fixtures are ephemeral auth users; deleting them cascades pools + ledger.
 *
 * Run with:  npm run verify:questions
 */
import "./load-env"

import { randomUUID } from "node:crypto"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  console.error("✗ Missing Supabase env (URL / anon key / service-role key) in .env.local")
  process.exit(1)
}

const admin: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

let passed = 0
let failed = 0
function check(label: string, ok: boolean, detail?: string) {
  if (ok) {
    passed++
    console.log(`  ✓ ${label}`)
  } else {
    failed++
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`)
  }
}

const createdUserIds: string[] = []
const PASSWORD = `Qq1!${randomUUID()}`

async function makeUser(tag: string): Promise<string> {
  const email = `questions-verify+${tag}-${randomUUID().slice(0, 8)}@usetome.app`
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  })
  if (error || !data.user) throw new Error(`createUser failed: ${error?.message}`)
  createdUserIds.push(data.user.id)
  return data.user.id
}

async function signIn(userId: string): Promise<SupabaseClient> {
  const { data: got, error: getErr } = await admin.auth.admin.getUserById(userId)
  if (getErr || !got.user?.email) throw new Error(`getUserById failed: ${getErr?.message}`)
  const client = createClient(SUPABASE_URL!, ANON_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error } = await client.auth.signInWithPassword({
    email: got.user.email,
    password: PASSWORD,
  })
  if (error) throw new Error(`signIn failed: ${error.message}`)
  return client
}

async function cleanup() {
  console.log("\nCleaning up fixtures…")
  for (const id of createdUserIds) {
    await admin.auth.admin.deleteUser(id).catch(() => {})
  }
  console.log(`  removed ${createdUserIds.length} ephemeral users (pools + ledger cascade)`)
}

async function run() {
  console.log("QUESTIONS AVAILABLE RPC VERIFICATION\n")

  const teacherA = await makeUser("owner")
  const teacherB = await makeUser("stranger")
  await admin.from("profiles").update({ role: "teacher" }).eq("id", teacherA)
  await admin.from("profiles").update({ role: "teacher" }).eq("id", teacherB)

  // Pool + seed grant.
  const { data: poolId, error: poolErr } = await admin.rpc("ensure_question_pool", {
    p_owner: teacherA,
  })
  check("ensure_question_pool creates a personal pool", !poolErr && !!poolId, poolErr?.message)
  const pool = poolId as string

  const { data: b1, error: g1Err } = await admin.rpc("grant_question_credits", {
    p_pool: pool, p_count: 100, p_reason: "monthly_grant",
  })
  check("seed grant of 100 lands", !g1Err && b1 === 100, g1Err?.message ?? `balance=${b1}`)

  // 1. Insufficient balance raises insufficient_questions.
  const { error: overErr } = await admin.rpc("consume_question_credits", {
    p_pool: pool, p_count: 101,
  })
  check(
    "consuming beyond balance raises insufficient_questions",
    !!overErr && overErr.message.includes("insufficient_questions"),
    overErr?.message ?? "no error raised",
  )

  // Spend within balance, then 2. refund restores.
  const { data: afterSpend, error: spendErr } = await admin.rpc("consume_question_credits", {
    p_pool: pool, p_count: 40,
  })
  check("consume 40 → balance 60", !spendErr && afterSpend === 60, spendErr?.message ?? `balance=${afterSpend}`)
  const { data: afterRefund, error: refundErr } = await admin.rpc("refund_question_credits", {
    p_pool: pool, p_count: 40,
  })
  check("refund 40 restores balance to 100", !refundErr && afterRefund === 100, refundErr?.message ?? `balance=${afterRefund}`)
  const { data: refundRows } = await admin
    .from("question_credit_ledger")
    .select("delta, reason")
    .eq("pool_id", pool)
    .eq("reason", "refund")
  check("refund is ledgered (+40)", refundRows?.length === 1 && refundRows[0].delta === 40)

  // 3. Repeated stripe_event_id grant is a no-op.
  const evt = `evt_verify_${randomUUID().slice(0, 12)}`
  const { data: afterTopup, error: t1Err } = await admin.rpc("grant_question_credits", {
    p_pool: pool, p_count: 10000, p_reason: "topup", p_stripe_event_id: evt,
  })
  check("top-up +10000 lands (balance 10100)", !t1Err && afterTopup === 10100, t1Err?.message ?? `balance=${afterTopup}`)
  const { data: replay, error: t2Err } = await admin.rpc("grant_question_credits", {
    p_pool: pool, p_count: 10000, p_reason: "topup", p_stripe_event_id: evt,
  })
  check("replayed stripe_event_id is a no-op (balance still 10100)", !t2Err && replay === 10100, t2Err?.message ?? `balance=${replay}`)
  const { data: evtRows } = await admin
    .from("question_credit_ledger")
    .select("id")
    .eq("stripe_event_id", evt)
  check("exactly ONE ledger row for the event id", evtRows?.length === 1, `rows=${evtRows?.length}`)

  // 4. refresh_question_grants respects the accrual cap.
  // SAFETY: this RPC is the global cron — only run it if no OTHER pool in the
  // database is currently due a grant (so the test can't mutate real pools).
  const { count: dueOthers } = await admin
    .from("question_credit_pools")
    .select("*", { count: "exact", head: true })
    .gt("monthly_grant", 0)
    .lte("last_grant_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString())
  if ((dueOthers ?? 0) > 0) {
    console.log(
      `  ⏭ Skipping refresh_question_grants test: ${dueOthers} real pool(s) are due a grant — running the cron here would touch them.`,
    )
  } else {
    const past = new Date(Date.now() - 31 * 24 * 3600 * 1000).toISOString()
    // Below cap: 250 + 100 grant, cap 300 → 300 (partial grant of 50).
    await admin
      .from("question_credit_pools")
      .update({ balance: 250, monthly_grant: 100, accrual_cap: 300, last_grant_at: past })
      .eq("id", pool)
    const { data: granted1, error: r1Err } = await admin.rpc("refresh_question_grants")
    check("refresh grants exactly one due pool", !r1Err && granted1 === 1, r1Err?.message ?? `granted=${granted1}`)
    const { data: p1 } = await admin
      .from("question_credit_pools").select("balance").eq("id", pool).single()
    check("grant is capped at accrual_cap (250 → 300, not 350)", p1?.balance === 300, `balance=${p1?.balance}`)

    // Above cap (post-top-up): 500 with cap 300 → untouched, no clawback.
    await admin
      .from("question_credit_pools")
      .update({ balance: 500, last_grant_at: past })
      .eq("id", pool)
    const { data: granted2, error: r2Err } = await admin.rpc("refresh_question_grants")
    check("at/above cap counts zero grants", !r2Err && granted2 === 0, r2Err?.message ?? `granted=${granted2}`)
    const { data: p2 } = await admin
      .from("question_credit_pools").select("balance").eq("id", pool).single()
    check("above-cap balance is never clawed back (stays 500)", p2?.balance === 500, `balance=${p2?.balance}`)
  }

  // 5. Ownership: a stranger cannot consume; the owner can.
  const asB = await signIn(teacherB)
  const { error: strangerErr } = await asB.rpc("consume_question_credits", {
    p_pool: pool, p_count: 1,
  })
  check(
    "non-owner consume is rejected (not_pool_owner)",
    !!strangerErr && strangerErr.message.includes("not_pool_owner"),
    strangerErr?.message ?? "no error raised",
  )
  const asA = await signIn(teacherA)
  const { error: ownerErr } = await asA.rpc("consume_question_credits", {
    p_pool: pool, p_count: 1,
  })
  check("owner consume succeeds", !ownerErr, ownerErr?.message)

  // Server-only surface: authenticated callers must NOT reach grant/refund.
  const { error: grantAsUser } = await asB.rpc("grant_question_credits", {
    p_pool: pool, p_count: 10, p_reason: "topup",
  })
  check("authenticated caller cannot grant credits", !!grantAsUser, "grant succeeded for a normal user")
  const { error: refundAsUser } = await asB.rpc("refund_question_credits", {
    p_pool: pool, p_count: 10,
  })
  check("authenticated caller cannot refund credits", !!refundAsUser, "refund succeeded for a normal user")
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
    process.exit(1)
  })
