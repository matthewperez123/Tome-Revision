import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe/server"
import { getPriceId, isPaidTier } from "@/lib/stripe/plans"
import type { BillingPeriod } from "@/lib/pricing"

export const runtime = "nodejs"

/**
 * Creates a Stripe Checkout Session for a paid reader plan and returns its
 * hosted-checkout URL. The client redirects the browser to that URL.
 *
 * Body: { tier: "solo" | "family"; period?: "monthly" | "annual"; email?: string }
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: "Checkout is not configured. Set STRIPE_SECRET_KEY." },
      { status: 501 },
    )
  }

  let body: { tier?: string; period?: string; email?: string }
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

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000"

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: body.email || undefined,
      allow_promotion_codes: true,
      subscription_data: { trial_period_days: 7 },
      success_url: `${origin}/dashboard?checkout=success&tier=${tier}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: { tier, period },
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
