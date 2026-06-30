import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/**
 * Stripe webhook receiver. Verifies the signature against the raw request body
 * and syncs subscription state into `public.subscriptions` (service-role write).
 *
 * Handled events:
 *   - checkout.session.completed
 *   - customer.subscription.created | updated | deleted
 *
 * Set `STRIPE_WEBHOOK_SECRET` (from `stripe listen` locally, or the dashboard
 * endpoint secret in prod). Returns 200 quickly; 400 on bad signature.
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 501 },
    )
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id,
          )
          await upsertSubscription(stripe, subscription, {
            user_id: session.client_reference_id ?? session.metadata?.user_id ?? null,
            tier: session.metadata?.tier ?? null,
          })
        }
        break
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await upsertSubscription(stripe, subscription, {
          user_id: subscription.metadata?.user_id ?? null,
          tier: subscription.metadata?.tier ?? null,
        })
        break
      }
      default:
        break
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed."
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

/**
 * Resolve the Tome user id for a subscription (metadata → customer metadata →
 * existing row) and upsert the canonical subscription state.
 */
async function upsertSubscription(
  stripe: Stripe,
  subscription: Stripe.Subscription,
  hints: { user_id: string | null; tier: string | null },
) {
  const admin = createAdminClient()
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id

  // Resolve the user id: explicit hint → customer metadata → existing row.
  let userId = hints.user_id
  if (!userId) {
    try {
      const customer = await stripe.customers.retrieve(customerId)
      if (customer && !customer.deleted) {
        userId = (customer.metadata?.user_id as string | undefined) ?? null
      }
    } catch {
      // fall through to row lookup
    }
  }
  if (!userId) {
    const { data: existing } = await admin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscription.id)
      .maybeSingle()
    userId = (existing?.user_id as string | undefined) ?? null
  }
  if (!userId) return // can't map this subscription to an account

  const tier =
    hints.tier === "solo" || hints.tier === "family"
      ? hints.tier
      : subscription.items.data[0]?.price.metadata?.tier ?? null

  // A `customer.subscription.deleted` event already carries status "canceled".
  const status = subscription.status

  const periodEnd = subscription.items.data[0]?.current_period_end
  await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        tier,
        status,
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end ?? false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
}
