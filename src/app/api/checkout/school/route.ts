import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe/server"
import { getPriceId, assertPriceMatchesKeyMode } from "@/lib/stripe/prices"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { BillingPeriod } from "@/lib/marketing/plans"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/** Min/max teacher seats a single self-serve School subscription can buy. */
const MIN_SEATS = 1
const MAX_SEATS = 500

/**
 * Creates a Stripe Checkout Session for the School plan, billed per teacher
 * seat. `quantity` on the single line item is the number of teacher seats; the
 * per-seat ("per teacher") price comes from STRIPE_PRICE_SCHOOL_* via env.
 *
 * Body: { seats: number; period?: "monthly" | "annual" }
 *
 * The buyer becomes the School subscription admin (subscriptions.user_id) and
 * is auto-assigned seat #1 by the webhook. Larger schools/districts are
 * sales-led and never reach this endpoint.
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: "Checkout is not configured. Set STRIPE_SECRET_KEY." },
      { status: 501 },
    )
  }

  let body: { seats?: unknown; period?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const seats = Math.floor(Number(body.seats))
  if (!Number.isFinite(seats) || seats < MIN_SEATS || seats > MAX_SEATS) {
    return NextResponse.json(
      { error: `Choose between ${MIN_SEATS} and ${MAX_SEATS} teacher seats.` },
      { status: 400 },
    )
  }
  const period: BillingPeriod = body.period === "annual" ? "annual" : "monthly"

  const priceId = getPriceId("school", period)
  if (!priceId) {
    return NextResponse.json({ error: "School price not configured." }, { status: 500 })
  }

  // Require a signed-in user so the subscription can be mapped to an account.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in to subscribe." }, { status: 401 })
  }

  // Resolve the Stripe customer for this user (subscriptions row → metadata
  // search → create), matching the reader checkout.
  const admin = createAdminClient()
  const { data: subRow } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle()

  let customerId = (subRow?.stripe_customer_id as string | null) ?? null

  if (!customerId) {
    try {
      const found = await stripe.customers.search({
        query: `metadata['user_id']:'${user.id}'`,
        limit: 1,
      })
      customerId = found.data[0]?.id ?? null
    } catch {
      // Search index unavailable — fall through to create.
    }
  }

  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create customer."
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }

  // Authoritative test/live mode guard (price IDs don't encode their mode).
  try {
    await assertPriceMatchesKeyMode(stripe, priceId)
  } catch (err) {
    console.error("[checkout/school] Stripe mode guard failed:", err)
    return NextResponse.json(
      { error: "Billing is misconfigured. Please contact support." },
      { status: 500 },
    )
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000"

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // quantity = teacher seats; admin can change it later (with proration)
      // via /api/school/seats.
      line_items: [{ price: priceId, quantity: seats }],
      customer: customerId,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: user.id, tier: "school", period, seats: String(seats) },
      },
      success_url: `${origin}/classroom/school?checkout=success`,
      cancel_url: `${origin}/pricing?for=educators&checkout=cancelled`,
      metadata: { user_id: user.id, tier: "school", period, seats: String(seats) },
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
