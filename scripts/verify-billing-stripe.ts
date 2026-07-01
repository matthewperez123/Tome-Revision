/**
 * End-to-end STRIPE verification — the Stripe-side half of the billing suite.
 *
 * Drives real Stripe TEST-mode API calls with **test clocks** to prove that our
 * price/checkout config produces the right subscription states across the
 * lifecycle, WITHOUT waiting real days and WITHOUT charging anyone:
 *
 *   Solo:   create on a test clock → trial (trialing) → advance past trial →
 *           converts to paid (active, invoice paid) → swap to a failing card →
 *           advance to renewal → payment fails (past_due) → cancel.
 *   Family: smoke — subscription on the Family price (trialing).
 *   School: smoke — subscription on the School price with quantity = seats.
 *
 * This script talks ONLY to Stripe. It does NOT write our DB — the webhook does
 * that in the live app. To verify the full webhook→subscriptions→entitlement
 * path, run `stripe listen --forward-to localhost:3000/api/stripe/webhook` while
 * this runs (see docs/billing-test-plan.md), then run `npm run verify:billing`.
 *
 * SAFETY: refuses to run unless STRIPE_SECRET_KEY is a TEST key (sk_test_/rk_test_).
 * Creates everything under disposable test clocks and deletes them at the end.
 *
 * Run with:  npm run verify:billing:stripe
 */
import "./load-env"

import Stripe from "stripe"

const KEY = process.env.STRIPE_SECRET_KEY ?? ""
const isTestKey = KEY.startsWith("sk_test_") || KEY.startsWith("rk_test_")

if (!KEY) {
  console.log(
    "⏭  Skipped: STRIPE_SECRET_KEY not set. Add TEST-mode Stripe keys + price IDs to .env.local to run this.",
  )
  process.exit(0)
}
if (!isTestKey) {
  console.error(
    "✗ Refusing to run: STRIPE_SECRET_KEY is not a TEST key. This script must never touch live mode.",
  )
  process.exit(1)
}

const PRICES = {
  solo: process.env.STRIPE_PRICE_SOLO_MONTHLY,
  family: process.env.STRIPE_PRICE_FAMILY_MONTHLY,
  school: process.env.STRIPE_PRICE_SCHOOL_MONTHLY,
}
const missing = Object.entries(PRICES)
  .filter(([, v]) => !v)
  .map(([k]) => `STRIPE_PRICE_${k.toUpperCase()}_MONTHLY`)
if (missing.length) {
  console.log(`⏭  Skipped: missing test price IDs: ${missing.join(", ")}`)
  process.exit(0)
}

const stripe = new Stripe(KEY)

const DAY = 24 * 60 * 60
let passed = 0
let failed = 0
function check(label: string, ok: boolean, detail?: string) {
  if (ok) {
    passed++
    console.log(`    ✓ ${label}`)
  } else {
    failed++
    console.error(`    ✗ ${label}${detail ? ` — ${detail}` : ""}`)
  }
}

const clocksToClean: string[] = []

/** Advance a test clock to `toUnix` and poll until it finishes processing. */
async function advanceClock(clockId: string, toUnix: number): Promise<void> {
  await stripe.testHelpers.testClocks.advance(clockId, { frozen_time: toUnix })
  // Poll until the clock is no longer "advancing".
  for (let i = 0; i < 40; i++) {
    const clock = await stripe.testHelpers.testClocks.retrieve(clockId)
    if (clock.status === "ready") return
    if (clock.status === "internal_failure") {
      throw new Error(`test clock ${clockId} internal_failure while advancing`)
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
  throw new Error(`test clock ${clockId} did not become ready in time`)
}

async function makeClockedCustomer(
  startUnix: number,
  paymentMethod: string,
): Promise<{ clockId: string; customerId: string }> {
  const clock = await stripe.testHelpers.testClocks.create({ frozen_time: startUnix })
  clocksToClean.push(clock.id)
  const customer = await stripe.customers.create({
    test_clock: clock.id,
    email: `billing-verify-${clock.id}@usetome.app`,
  })
  await stripe.paymentMethods.attach(paymentMethod, { customer: customer.id })
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: paymentMethod },
  })
  return { clockId: clock.id, customerId: customer.id }
}

async function soloLifecycle() {
  console.log("SOLO lifecycle (test clock)")
  const start = Math.floor(Date.now() / 1000)
  const { clockId, customerId } = await makeClockedCustomer(start, "pm_card_visa")

  // Start a 7-day trial — mirrors checkout's subscription_data.trial_period_days.
  let sub = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: PRICES.solo!, quantity: 1 }],
    trial_period_days: 7,
    metadata: { tier: "solo" },
    payment_settings: { save_default_payment_method: "on_subscription" },
  })
  check("subscription starts in trialing", sub.status === "trialing", `status=${sub.status}`)

  // Advance past the trial → should convert to active with a paid invoice.
  await advanceClock(clockId, start + 8 * DAY)
  sub = await stripe.subscriptions.retrieve(sub.id, { expand: ["latest_invoice"] })
  check("trial converts to active", sub.status === "active", `status=${sub.status}`)
  const inv1 = sub.latest_invoice as Stripe.Invoice | null
  check(
    "first paid invoice settled (amount > 0)",
    !!inv1 && inv1.status === "paid" && (inv1.amount_paid ?? 0) > 0,
    `invoice status=${inv1?.status} paid=${inv1?.amount_paid}`,
  )

  // Swap to a card that fails, then advance to the next renewal → payment fails.
  await stripe.paymentMethods.attach("pm_card_chargeCustomerFail", { customer: customerId })
  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: "pm_card_chargeCustomerFail" },
  })
  const periodEnd = sub.items.data[0]?.current_period_end ?? start + 38 * DAY
  await advanceClock(clockId, periodEnd + 2 * DAY)
  sub = await stripe.subscriptions.retrieve(sub.id, { expand: ["latest_invoice"] })
  check(
    "renewal payment failure leaves subscription non-active (past_due/unpaid/canceled)",
    sub.status === "past_due" || sub.status === "unpaid" || sub.status === "canceled",
    `status=${sub.status}`,
  )
  const inv2 = sub.latest_invoice as Stripe.Invoice | null
  check(
    "the failed renewal invoice is not paid",
    !inv2 || inv2.status !== "paid",
    `invoice status=${inv2?.status}`,
  )

  // Cancel.
  const canceled = await stripe.subscriptions.cancel(sub.id)
  check("cancel sets status=canceled", canceled.status === "canceled", `status=${canceled.status}`)
}

async function smoke(tier: "family" | "school", price: string, quantity: number) {
  console.log(`\n${tier.toUpperCase()} smoke (test clock, quantity=${quantity})`)
  const start = Math.floor(Date.now() / 1000)
  const { customerId } = await makeClockedCustomer(start, "pm_card_visa")
  const sub = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price, quantity }],
    trial_period_days: 7,
    metadata: { tier },
  })
  check(`${tier} subscription starts trialing`, sub.status === "trialing", `status=${sub.status}`)
  check(
    `${tier} line-item quantity = ${quantity}`,
    sub.items.data[0]?.quantity === quantity,
    `quantity=${sub.items.data[0]?.quantity}`,
  )
}

async function cleanup() {
  console.log("\nCleaning up test clocks (cascades to customers + subscriptions)…")
  for (const id of clocksToClean) {
    await stripe.testHelpers.testClocks.del(id).catch(() => {})
  }
  console.log(`  deleted ${clocksToClean.length} test clocks`)
}

async function main() {
  console.log("BILLING STRIPE VERIFICATION (TEST mode, test clocks)\n")
  await soloLifecycle()
  await smoke("family", PRICES.family!, 1)
  await smoke("school", PRICES.school!, 3)
}

main()
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
