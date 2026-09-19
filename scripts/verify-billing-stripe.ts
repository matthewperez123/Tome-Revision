/**
 * End-to-end STRIPE verification — the Stripe-side half of the billing suite
 * (launch model: annual-only, per-student seats, Family, Questions top-up).
 *
 * Drives real Stripe TEST-mode API calls with **test clocks** to prove that our
 * price/checkout config produces the right subscription states, WITHOUT waiting
 * real days and WITHOUT charging anyone:
 *
 *   Classroom: seat price, quantity 12 → active, qty 12, first invoice paid;
 *              advance the clock past the annual period → renewal invoice paid,
 *              quantity retained; then cancel → canceled.
 *   School:    seat price, quantity 125 (the $1,500 minimum) → active, qty 125.
 *   Flat 300:  flat SKU, quantity 1 → active on TOME_PRICE_SCHOOL_FLAT_300.
 *   Family:    $99/yr price, quantity 1 → active.
 *   Top-up:    one-time Questions block — invoice on TOME_PRICE_QUESTIONS_TOPUP
 *              settles (paid, amount > 0).
 *
 * This script talks ONLY to Stripe. The DB effects (subscriptions.seats,
 * Question pool grants, the exactly-once top-up ledger entry, the free-teacher
 * monthly_grant reset on deletion) are the WEBHOOK's writes — prove those with
 * `stripe listen --forward-to localhost:3000/api/stripe/webhook` (Run 3 in
 * docs/billing-test-plan.md), plus `npm run verify:billing` and the Questions
 * RPC unit tests for the entitlement/ledger math.
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
    "⏭  Skipped: STRIPE_SECRET_KEY not set. Add TEST-mode Stripe keys + TOME_PRICE_* ids to .env.local to run this.",
  )
  process.exit(0)
}
if (!isTestKey) {
  console.error(
    "✗ Refusing to run: STRIPE_SECRET_KEY is not a TEST key. This script must never touch live mode.",
  )
  process.exit(1)
}

// The canonical launch-model price vars (src/lib/billing/prices.ts).
const PRICES = {
  studentSeat: process.env.TOME_PRICE_STUDENT_SEAT_YEARLY,
  schoolFlat300: process.env.TOME_PRICE_SCHOOL_FLAT_300,
  family: process.env.TOME_PRICE_FAMILY_YEARLY,
  topup: process.env.TOME_PRICE_QUESTIONS_TOPUP,
}
const VAR_NAMES: Record<keyof typeof PRICES, string> = {
  studentSeat: "TOME_PRICE_STUDENT_SEAT_YEARLY",
  schoolFlat300: "TOME_PRICE_SCHOOL_FLAT_300",
  family: "TOME_PRICE_FAMILY_YEARLY",
  topup: "TOME_PRICE_QUESTIONS_TOPUP",
}
const missing = (Object.keys(PRICES) as (keyof typeof PRICES)[])
  .filter((k) => !PRICES[k])
  .map((k) => VAR_NAMES[k])
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

/**
 * Mirror checkout's subscription creation: the shared seat price with the
 * metadata (`tier`, `student_seats`) the webhook uses to disambiguate.
 */
async function seatSubscription(
  customer: string,
  tier: "classroom" | "school",
  seats: number,
  price: string,
  quantity: number,
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create({
    customer,
    items: [{ price, quantity }],
    metadata: { tier, student_seats: String(seats) },
    payment_settings: { save_default_payment_method: "on_subscription" },
  })
}

async function classroomLifecycle() {
  console.log("CLASSROOM lifecycle (seat price, quantity 12, test clock)")
  const start = Math.floor(Date.now() / 1000)
  const { clockId, customerId: cust } = await makeClockedCustomer(start, "pm_card_visa")

  let sub = await seatSubscription(cust, "classroom", 12, PRICES.studentSeat!, 12)
  check("subscription is active (annual, no trial)", sub.status === "active", `status=${sub.status}`)
  check("line-item quantity = 12", sub.items.data[0]?.quantity === 12, `qty=${sub.items.data[0]?.quantity}`)
  check(
    "metadata carries tier=classroom student_seats=12",
    sub.metadata.tier === "classroom" && sub.metadata.student_seats === "12",
    JSON.stringify(sub.metadata),
  )
  sub = await stripe.subscriptions.retrieve(sub.id, { expand: ["latest_invoice"] })
  const inv1 = sub.latest_invoice as Stripe.Invoice | null
  check(
    "first annual invoice settled (amount > 0)",
    !!inv1 && inv1.status === "paid" && (inv1.amount_paid ?? 0) > 0,
    `invoice status=${inv1?.status} paid=${inv1?.amount_paid}`,
  )

  // Advance past the annual period → the renewal invoice pays, seats retained.
  const periodEnd = sub.items.data[0]?.current_period_end ?? start + 366 * DAY
  await advanceClock(clockId, periodEnd + 1 * DAY)
  sub = await stripe.subscriptions.retrieve(sub.id, { expand: ["latest_invoice"] })
  check("annual renewal keeps subscription active", sub.status === "active", `status=${sub.status}`)
  check(
    "renewal retains quantity 12",
    sub.items.data[0]?.quantity === 12,
    `qty=${sub.items.data[0]?.quantity}`,
  )
  const inv2 = sub.latest_invoice as Stripe.Invoice | null
  check(
    "renewal invoice settled",
    !!inv2 && inv2.status === "paid" && inv2.id !== inv1?.id,
    `invoice status=${inv2?.status}`,
  )

  // Deletion — the webhook then keeps the teacher role and resets the
  // monthly grant to the free-teacher 100 (proven in Run 3 / RPC tests).
  const canceled = await stripe.subscriptions.cancel(sub.id)
  check("cancel sets status=canceled", canceled.status === "canceled", `status=${canceled.status}`)
}

async function schoolSeats() {
  console.log("\nSCHOOL seats (seat price, quantity 125 = $1,500 minimum)")
  const start = Math.floor(Date.now() / 1000)
  const { customerId: cust } = await makeClockedCustomer(start, "pm_card_visa")
  const sub = await seatSubscription(cust, "school", 125, PRICES.studentSeat!, 125)
  check("school subscription active", sub.status === "active", `status=${sub.status}`)
  check("line-item quantity = 125", sub.items.data[0]?.quantity === 125, `qty=${sub.items.data[0]?.quantity}`)
  check(
    "metadata carries tier=school student_seats=125",
    sub.metadata.tier === "school" && sub.metadata.student_seats === "125",
    JSON.stringify(sub.metadata),
  )
}

async function schoolFlat300() {
  console.log("\nSCHOOL flat300 SKU (quantity 1)")
  const start = Math.floor(Date.now() / 1000)
  const { customerId: cust } = await makeClockedCustomer(start, "pm_card_visa")
  const sub = await stripe.subscriptions.create({
    customer: cust,
    items: [{ price: PRICES.schoolFlat300!, quantity: 1 }],
    metadata: { tier: "school", student_seats: "300" },
  })
  check("flat300 subscription active", sub.status === "active", `status=${sub.status}`)
  check(
    "flat300 rides the flat price id",
    sub.items.data[0]?.price.id === PRICES.schoolFlat300,
    `price=${sub.items.data[0]?.price.id}`,
  )
  check(
    "metadata carries student_seats=300",
    sub.metadata.student_seats === "300",
    JSON.stringify(sub.metadata),
  )
}

async function familySmoke() {
  console.log("\nFAMILY ($99/yr, quantity 1)")
  const start = Math.floor(Date.now() / 1000)
  const { customerId: cust } = await makeClockedCustomer(start, "pm_card_visa")
  const sub = await stripe.subscriptions.create({
    customer: cust,
    items: [{ price: PRICES.family!, quantity: 1 }],
    metadata: { tier: "family" },
  })
  check("family subscription active", sub.status === "active", `status=${sub.status}`)
}

async function topupOneTime() {
  console.log("\nTOP-UP (one-time Questions block)")
  const start = Math.floor(Date.now() / 1000)
  const { customerId: cust } = await makeClockedCustomer(start, "pm_card_visa")
  await stripe.invoiceItems.create({ customer: cust, price: PRICES.topup! })
  const draft = await stripe.invoices.create({ customer: cust, auto_advance: false })
  const invoice = await stripe.invoices.pay(draft.id!)
  check(
    "top-up invoice settles (paid, amount > 0)",
    invoice.status === "paid" && (invoice.amount_paid ?? 0) > 0,
    `status=${invoice.status} paid=${invoice.amount_paid}`,
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
  console.log("BILLING STRIPE VERIFICATION (TEST mode, test clocks, launch model)\n")
  await classroomLifecycle()
  await schoolSeats()
  await schoolFlat300()
  await familySmoke()
  await topupOneTime()
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
