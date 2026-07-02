/**
 * scripts/stripe-setup.ts — idempotent Stripe product/price provisioning.
 *
 * Guarantees the Stripe catalog matches Tome's settled billing model and prints
 * every resulting Price ID as ready-to-paste `TOME_PRICE_*` env lines. Safe to
 * run repeatedly: it searches for existing objects before creating anything, so
 * a second run creates nothing and prints the same IDs.
 *
 * What it ensures:
 *   - Solo   (prod_UnOyR0U75npmXt): metadata.tier=solo; $9/mo + $90/yr prices.
 *   - Family (prod_UnOy09CqGKXxB4): metadata.tier=family; $18/mo + $150/yr prices.
 *   - School: a "Tome School" product (metadata.tier=school, seat_role=teacher)
 *             with an active $120.00/yr PER-SEAT price.
 *
 * Run with:  npx tsx scripts/stripe-setup.ts
 * Requires:  STRIPE_SECRET_KEY (from .env.local, loaded below).
 */
import "./load-env"

import Stripe from "stripe"

const KEY = process.env.STRIPE_SECRET_KEY ?? ""
if (!KEY) {
  console.error(
    "✗ STRIPE_SECRET_KEY is not set. Add it to .env.local (test-mode key) and re-run.",
  )
  process.exit(1)
}

const MODE = KEY.startsWith("sk_live_") || KEY.startsWith("rk_live_") ? "LIVE" : "TEST"
const stripe = new Stripe(KEY)

// ── Settled billing model (see CLAUDE.md "TOME TODAY") ──────────────────
const SOLO_PRODUCT = "prod_UnOyR0U75npmXt"
const FAMILY_PRODUCT = "prod_UnOy09CqGKXxB4"

type Interval = "month" | "year"

interface DesiredPrice {
  interval: Interval
  unitAmount: number // minor units (cents)
  lookupKey: string
  nickname: string
}

// ── Helpers (all idempotent) ────────────────────────────────────────────

/** Merge metadata onto a product only when a key is missing/stale. */
async function ensureProductMetadata(
  productId: string,
  meta: Record<string, string>,
): Promise<Stripe.Product> {
  const product = await stripe.products.retrieve(productId)
  const stale = Object.entries(meta).some(
    ([k, v]) => (product.metadata ?? {})[k] !== v,
  )
  if (!stale) {
    console.log(`  = ${product.name} metadata already ${describe(meta)}`)
    return product
  }
  const updated = await stripe.products.update(productId, { metadata: meta })
  console.log(`  ↑ ${updated.name} metadata set ${describe(meta)}`)
  return updated
}

/**
 * Find an active recurring price by its stable lookup key, falling back to a
 * shape match (interval + unit_amount + currency) on the product's active
 * prices. Returns null when nothing matches.
 */
async function findPrice(
  productId: string,
  desired: DesiredPrice,
): Promise<Stripe.Price | null> {
  const byKey = await stripe.prices.list({
    lookup_keys: [desired.lookupKey],
    active: true,
    limit: 1,
  })
  if (byKey.data[0]) return byKey.data[0]

  const onProduct = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  })
  return (
    onProduct.data.find(
      (p) =>
        p.type === "recurring" &&
        p.recurring?.interval === desired.interval &&
        (p.recurring?.interval_count ?? 1) === 1 &&
        p.unit_amount === desired.unitAmount &&
        p.currency === "usd",
    ) ?? null
  )
}

/** Ensure a recurring price exists on a product; create it only if absent. */
async function ensurePrice(
  productId: string,
  desired: DesiredPrice,
): Promise<Stripe.Price> {
  const existing = await findPrice(productId, desired)
  if (existing) {
    console.log(
      `  = ${desired.nickname} exists (${existing.id}, ${money(existing.unit_amount)}/${desired.interval})`,
    )
    return existing
  }
  const created = await stripe.prices.create({
    product: productId,
    currency: "usd",
    unit_amount: desired.unitAmount,
    recurring: { interval: desired.interval, interval_count: 1 },
    lookup_key: desired.lookupKey,
    nickname: desired.nickname,
    metadata: { managed_by: "stripe-setup" },
  })
  console.log(
    `  + created ${desired.nickname} (${created.id}, ${money(created.unit_amount)}/${desired.interval})`,
  )
  return created
}

/**
 * Find the "Tome School" product by name + metadata (search API, with a list
 * fallback for search-index lag), creating it if absent. Always reconciles the
 * required metadata.
 */
async function ensureSchoolProduct(): Promise<Stripe.Product> {
  let found: Stripe.Product | null = null
  try {
    const res = await stripe.products.search({
      query: "active:'true' AND name:'Tome School' AND metadata['tier']:'school'",
      limit: 1,
    })
    found = res.data[0] ?? null
  } catch {
    // Search index not ready in this account — fall through to list scan.
  }
  if (!found) {
    const list = await stripe.products.list({ active: true, limit: 100 })
    found =
      list.data.find(
        (p) => p.name === "Tome School" && (p.metadata ?? {}).tier === "school",
      ) ?? null
  }

  if (found) {
    console.log(`  = Tome School exists (${found.id})`)
    return ensureProductMetadata(found.id, { tier: "school", seat_role: "teacher" })
  }

  const created = await stripe.products.create({
    name: "Tome School",
    description:
      "Per-teacher seats for departments and schools. Each seat grants a teacher account; students join free.",
    metadata: { tier: "school", seat_role: "teacher" },
  })
  console.log(`  + created Tome School (${created.id})`)
  return created
}

function money(minor: number | null | undefined): string {
  if (minor == null) return "$?"
  return `$${(minor / 100).toFixed(2)}`
}

function describe(meta: Record<string, string>): string {
  return Object.entries(meta)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Tome Stripe setup — ${MODE} mode\n`)

  console.log("Solo")
  await ensureProductMetadata(SOLO_PRODUCT, { tier: "solo" })
  const soloMonthly = await ensurePrice(SOLO_PRODUCT, {
    interval: "month",
    unitAmount: 900,
    lookupKey: "tome_solo_monthly",
    nickname: "Solo Monthly",
  })
  const soloYearly = await ensurePrice(SOLO_PRODUCT, {
    interval: "year",
    unitAmount: 9000,
    lookupKey: "tome_solo_annual",
    nickname: "Solo Annual",
  })

  console.log("\nFamily")
  await ensureProductMetadata(FAMILY_PRODUCT, { tier: "family" })
  const familyMonthly = await ensurePrice(FAMILY_PRODUCT, {
    interval: "month",
    unitAmount: 1800,
    lookupKey: "tome_family_monthly",
    nickname: "Family Monthly",
  })
  const familyYearly = await ensurePrice(FAMILY_PRODUCT, {
    interval: "year",
    unitAmount: 15000,
    lookupKey: "tome_family_annual",
    nickname: "Family Annual",
  })

  console.log("\nSchool")
  const school = await ensureSchoolProduct()
  const schoolSeatYearly = await ensurePrice(school.id, {
    interval: "year",
    unitAmount: 12000,
    lookupKey: "tome_school_seat_yearly",
    nickname: "School Seat (per teacher / year)",
  })

  console.log(`\n─────────────────────────────────────────────────────────`)
  console.log(`Price IDs (${MODE} mode) — paste into the matching environment:`)
  console.log(`─────────────────────────────────────────────────────────`)
  console.log(`TOME_PRICE_SOLO_MONTHLY=${soloMonthly.id}`)
  console.log(`TOME_PRICE_SOLO_YEARLY=${soloYearly.id}`)
  console.log(`TOME_PRICE_FAMILY_MONTHLY=${familyMonthly.id}`)
  console.log(`TOME_PRICE_FAMILY_YEARLY=${familyYearly.id}`)
  console.log(`TOME_PRICE_SCHOOL_SEAT_YEARLY=${schoolSeatYearly.id}`)
}

main().catch((err) => {
  console.error("\n✗ Setup failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
