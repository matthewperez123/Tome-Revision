import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"
import { isPaidTier, type PaidTier } from "@/lib/stripe/plans"
import { assertPriceMatchesKeyMode } from "@/lib/stripe/prices"
import {
  getBillingPriceId,
  tierForBillingPriceId,
  type BillingInterval,
} from "@/lib/billing/prices"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/**
 * Creates a Stripe Checkout Session (mode: subscription) and returns its
 * hosted-checkout URL for the client to redirect to.
 *
 * Body (either form):
 *   { priceId: string, quantity?: number }      — canonical (any API caller)
 *   { tier, period?, quantity? }                 — first-party UI convenience;
 *     the server resolves the price id from env so price ids never ship to the
 *     browser.
 *
 * The tier is resolved from `@/lib/billing/prices` (the single source of plan
 * facts): forward (tier + interval → price id) for the first-party form, and
 * reverse (`tierForBillingPriceId`) when an explicit price id is supplied.
 * `metadata.tier` on the session comes from that lookup — never hardcoded.
 *
 * The signed-in user is attached as the Stripe customer (reused from the
 * canonical `subscriptions` row → profiles → a metadata search, else created),
 * and the resolved customer id is persisted to BOTH `profiles.stripe_customer_id`
 * and `subscriptions.stripe_customer_id`. `client_reference_id` +
 * `subscription_data.metadata.user_id` let the webhook map the resulting
 * subscription back to the account.
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: "Checkout is not configured. Set STRIPE_SECRET_KEY." },
      { status: 501 },
    )
  }

  let body: {
    priceId?: string
    tier?: string
    period?: string
    quantity?: unknown
    seats?: unknown
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Resolve price id + tier from the canonical tier table. An explicit priceId
  // reverse-resolves its tier; otherwise tier + period resolves the price id
  // (keeps price ids off the client). School is annual-only.
  const wantsYearly = body.period === "annual" || body.period === "yearly"
  let priceId = typeof body.priceId === "string" ? body.priceId.trim() : ""
  let tier: PaidTier | null = null

  if (priceId) {
    tier = tierForBillingPriceId(priceId)
  } else {
    if (!body.tier || !isPaidTier(body.tier)) {
      return NextResponse.json(
        { error: "Provide a priceId or a known tier." },
        { status: 400 },
      )
    }
    tier = body.tier
    const interval: BillingInterval =
      tier === "school" || wantsYearly ? "yearly" : "monthly"
    const resolved = getBillingPriceId(tier, interval)
    if (!resolved) {
      return NextResponse.json({ error: "Plan price not configured." }, { status: 500 })
    }
    priceId = resolved
  }
  if (!tier) {
    return NextResponse.json({ error: "Unknown plan for that price." }, { status: 400 })
  }

  // Quantity = line-item quantity (only meaningful for School seats, min 2).
  const qtyRaw = Math.floor(Number(body.quantity ?? body.seats))
  const requested = Number.isFinite(qtyRaw) && qtyRaw >= 1 ? qtyRaw : 1
  const seats = tier === "school" ? Math.max(2, requested) : 1

  // Require a signed-in user so the subscription can be mapped to an account.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in to subscribe." }, { status: 401 })
  }

  // Students never self-checkout: they're provisioned into a plan by a parent
  // (Family) or teacher (School seat invite), not by buying their own. Block the
  // role explicitly so a signed-in student can't mint a subscription. Reads the
  // caller's OWN profile row (RLS-scoped client).
  const { data: roleRow } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (roleRow?.role === "student") {
    return NextResponse.json(
      { error: "Student accounts can't purchase a subscription." },
      { status: 403 },
    )
  }

  // Authoritative test/live mode guard: a test-mode key cannot see a live
  // price (and vice versa). Refuses to start a cross-mode Checkout Session.
  try {
    await assertPriceMatchesKeyMode(stripe, priceId)
  } catch (err) {
    console.error("[stripe/checkout] price resolution failed:", err)
    return NextResponse.json(
      { error: "Billing is misconfigured. Please contact support." },
      { status: 500 },
    )
  }

  // Resolve the Stripe customer: subscriptions row → profiles → metadata search
  // → create. Avoids duplicate customers across repeated pre-subscription
  // checkouts. Persist to BOTH profiles and subscriptions.
  const admin = createAdminClient()
  const customerId = await resolveCustomerId(stripe, admin, user.id, user.email ?? null)
  if (!customerId) {
    return NextResponse.json({ error: "Could not create customer." }, { status: 500 })
  }
  await persistCustomerId(admin, user.id, customerId)

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000"

  // {CHECKOUT_SESSION_ID} is expanded by Stripe on redirect so the success page
  // can reconcile the REAL subscription status from Stripe (not claim "active"
  // on trust, which would be a lie until the webhook lands).
  const successPath = `/billing/success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: tier === "school" ? seats : 1 }],
      customer: customerId,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier,
          ...(tier === "school" ? { seats: String(seats) } : {}),
        },
      },
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: {
        user_id: user.id,
        tier,
        ...(tier === "school" ? { seats: String(seats) } : {}),
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      )
    }
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** subscriptions → profiles → Stripe metadata search → create. */
async function resolveCustomerId(
  stripe: Stripe,
  admin: SupabaseClient<any, "public", any>,
  userId: string,
  email: string | null,
): Promise<string | null> {
  const { data: subRow } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle()
  const fromSub = (subRow?.stripe_customer_id as string | null) ?? null
  if (fromSub) return fromSub

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle()
  const fromProfile = (profile?.stripe_customer_id as string | null) ?? null
  if (fromProfile) return fromProfile

  try {
    const found = await stripe.customers.search({
      query: `metadata['user_id']:'${userId}'`,
      limit: 1,
    })
    if (found.data[0]?.id) return found.data[0].id
  } catch {
    // Search index unavailable — fall through to create.
  }

  try {
    const customer = await stripe.customers.create({
      email: email ?? undefined,
      metadata: { user_id: userId },
    })
    return customer.id
  } catch {
    return null
  }
}

/**
 * Store the customer id on both profiles and subscriptions (idempotent).
 * Updates an existing subscriptions row in place (so it can't clobber a live
 * status / cancel flag the webhook owns); inserts a stub row otherwise so the
 * customer id is captured before the first subscription event arrives.
 */
async function persistCustomerId(
  admin: SupabaseClient<any, "public", any>,
  userId: string,
  customerId: string,
): Promise<void> {
  await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId)

  const now = new Date().toISOString()
  const { data: existing } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle()
  if (existing) {
    await admin
      .from("subscriptions")
      .update({ stripe_customer_id: customerId, updated_at: now })
      .eq("user_id", userId)
  } else {
    await admin.from("subscriptions").insert({
      user_id: userId,
      stripe_customer_id: customerId,
      cancel_at_period_end: false,
      updated_at: now,
    })
  }
}
