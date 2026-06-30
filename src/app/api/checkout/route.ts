import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe/server"
import { getPriceId, isPaidTier } from "@/lib/stripe/plans"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { BillingPeriod } from "@/lib/pricing"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/**
 * Creates a Stripe Checkout Session for a paid reader plan and returns its
 * hosted-checkout URL. The client redirects the browser to that URL.
 *
 * Body: { tier: "solo" | "family"; period?: "monthly" | "annual" }
 *
 * The signed-in user is attached as the Stripe customer (created + persisted
 * to profiles.stripe_customer_id on first checkout) plus `client_reference_id`
 * and `subscription_data.metadata.user_id`, so the webhook can map the
 * resulting subscription back to the account.
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

  // Reuse or create the Stripe customer, persisting the id on the profile.
  const admin = createAdminClient()
  const { data: profileRow } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle()

  let customerId = (profileRow?.stripe_customer_id as string | null) ?? null
  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create customer."
      return NextResponse.json({ error: message }, { status: 500 })
    }
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
