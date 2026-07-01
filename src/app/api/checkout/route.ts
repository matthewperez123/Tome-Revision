import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe/server"
import { isPaidTier } from "@/lib/stripe/plans"
import { getPriceId, assertPriceMatchesKeyMode } from "@/lib/stripe/prices"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { BillingPeriod } from "@/lib/marketing/plans"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/**
 * Creates a Stripe Checkout Session for a paid reader plan and returns its
 * hosted-checkout URL. The client redirects the browser to that URL.
 *
 * Body: { tier: "solo" | "family"; period?: "monthly" | "annual" }
 *
 * The signed-in user is attached as the Stripe customer (resolved from the
 * canonical `subscriptions` row, then a metadata search, else created) plus
 * `client_reference_id` and `subscription_data.metadata.user_id`, so the
 * webhook can map the resulting subscription back to the account. The customer
 * id is persisted to `subscriptions` by the webhook — never to `profiles`.
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: "Checkout is not configured. Set STRIPE_SECRET_KEY." },
      { status: 501 },
    )
  }

  let body: { tier?: string; period?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const tier = body.tier ?? ""
  if (!isPaidTier(tier)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 })
  }
  // School is seat-based (quantity = teacher seats) — it has its own checkout
  // at /api/checkout/school so the seat count is always set.
  if (tier === "school") {
    return NextResponse.json(
      { error: "Use the School checkout for seat-based billing." },
      { status: 400 },
    )
  }
  const period: BillingPeriod = body.period === "annual" ? "annual" : "monthly"

  const priceId = getPriceId(tier, period)
  if (!priceId) {
    return NextResponse.json({ error: "Plan price not configured." }, { status: 500 })
  }

  // Require a signed-in user so the subscription can be mapped to an account.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in to subscribe." }, { status: 401 })
  }

  // Resolve the Stripe customer for this user. `subscriptions` is the canonical
  // store; fall back to a metadata search (avoids duplicate customers across
  // repeated pre-subscription checkouts), then create. The id is persisted to
  // `subscriptions` by the webhook — never to `profiles`.
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

  // Fail loudly if the resolved price's mode doesn't match the secret key's
  // mode (e.g. a live key paired with a test price). Authoritative: checks
  // Stripe's `livemode` flag, since price IDs don't encode their mode.
  try {
    await assertPriceMatchesKeyMode(stripe, priceId)
  } catch (err) {
    console.error("[checkout] Stripe mode guard failed:", err)
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
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: user.id, tier, period },
      },
      success_url: `${origin}/dashboard?checkout=success&tier=${tier}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: { user_id: user.id, tier, period },
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
