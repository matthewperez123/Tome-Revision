import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"
import { tierForPriceId } from "@/lib/stripe/prices"
import { isPaidTier, type PaidTier } from "@/lib/stripe/plans"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"
import {
  sendReceiptEmail,
  sendTrialEndingEmail,
  sendPaymentFailedEmail,
} from "@/lib/email/billing"

type Admin = SupabaseClient<any, "public", any>
const createAdminClient = () => createAdminClientUntyped() as unknown as Admin

export const runtime = "nodejs"

/**
 * Stripe webhook receiver — the single writer that keeps `public.subscriptions`
 * (the entitlement source of truth) in sync with Stripe.
 *
 * - Verifies the signature against the raw body using STRIPE_WEBHOOK_SECRET.
 * - Idempotent: every event id is claimed in `public.stripe_events`; a replayed
 *   or duplicate delivery is a logged no-op.
 * - Writes via the Supabase SERVICE ROLE (bypasses RLS); clients can only read.
 *
 * Handled events:
 *   checkout.session.completed
 *   customer.subscription.created | updated | deleted
 *   customer.subscription.trial_will_end   (→ trial-ending email)
 *   invoice.paid                           (→ receipt email)
 *   invoice.payment_failed                 (→ dunning email)
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 501 })
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
    console.warn(`[stripe-webhook] signature verification failed: ${message}`)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const admin = createAdminClient()

  // ── Idempotency gate: skip events we've already processed ──────────
  const { data: seen } = await admin
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle()
  if (seen) {
    console.log(`[stripe-webhook] duplicate ${event.type} (${event.id}) — skipping`)
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            asId(session.subscription),
          )
          const result = await syncSubscription(stripe, admin, subscription, {
            userId: session.client_reference_id ?? session.metadata?.user_id ?? null,
            tier: session.metadata?.tier ?? null,
          })
          console.log(`[stripe-webhook] handled ${event.type} (${event.id}): ${result.log}`)
        } else {
          console.log(`[stripe-webhook] handled ${event.type} (${event.id}): non-subscription session, ignored`)
        }
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const result = await syncSubscription(stripe, admin, subscription, {
          userId: subscription.metadata?.user_id ?? null,
          tier: subscription.metadata?.tier ?? null,
        })
        console.log(`[stripe-webhook] handled ${event.type} (${event.id}): ${result.log}`)
        break
      }

      case "customer.subscription.trial_will_end": {
        // Fires ~3 days before a trial converts. Re-sync, then nudge the reader.
        const subscription = event.data.object as Stripe.Subscription
        const result = await syncSubscription(stripe, admin, subscription, {
          userId: subscription.metadata?.user_id ?? null,
          tier: subscription.metadata?.tier ?? null,
        })
        if (result.userId) {
          const item = subscription.items.data[0]
          await sendTrialEndingEmail(admin, result.userId, {
            tier: result.tier,
            trialEndUnix: subscription.trial_end ?? null,
            amountCents: item?.price?.unit_amount ?? null,
            currency: item?.price?.currency ?? null,
          })
        }
        console.log(`[stripe-webhook] handled ${event.type} (${event.id}): ${result.log}`)
        break
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subId = invoiceSubscriptionId(invoice)
        if (!subId) {
          console.log(`[stripe-webhook] handled ${event.type} (${event.id}): no subscription on invoice, ignored`)
          break
        }
        const subscription = await stripe.subscriptions.retrieve(subId)
        const result = await syncSubscription(stripe, admin, subscription, {
          userId: subscription.metadata?.user_id ?? null,
          tier: subscription.metadata?.tier ?? null,
        })

        if (result.userId) {
          if (event.type === "invoice.paid") {
            // Receipt only on a real charge (amount > 0 skips $0 trial invoices).
            const amountPaid = invoice.amount_paid ?? 0
            if (amountPaid > 0) {
              await sendReceiptEmail(admin, result.userId, {
                tier: result.tier,
                amountCents: amountPaid,
                currency: invoice.currency ?? null,
                nextBillingUnix: subscriptionPeriodEnd(subscription),
                invoiceUrl: invoice.hosted_invoice_url ?? null,
              })
            }
          } else {
            await sendPaymentFailedEmail(admin, result.userId, {
              tier: result.tier,
              amountCents: invoice.amount_due ?? null,
              currency: invoice.currency ?? null,
              hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
            })
          }
        }

        console.log(`[stripe-webhook] handled ${event.type} (${event.id}): ${result.log}`)
        break
      }

      default:
        console.log(`[stripe-webhook] ignored ${event.type} (${event.id})`)
        break
    }
  } catch (err) {
    // Do NOT record the event — let Stripe retry a transient failure.
    const message = err instanceof Error ? err.message : "Webhook handler failed."
    console.error(`[stripe-webhook] error handling ${event.type} (${event.id}): ${message}`)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Mark processed (idempotency). ignoreDuplicates guards a concurrent delivery.
  await admin
    .from("stripe_events")
    .upsert({ id: event.id, type: event.type }, { onConflict: "id", ignoreDuplicates: true })

  return NextResponse.json({ received: true })
}

interface SyncResult {
  userId: string | null
  tier: PaidTier | null
  log: string
}

/**
 * Resolve the Tome user id, derive the tier, and upsert the canonical
 * subscription row. Returns the resolved user/tier (for downstream email
 * dispatch) plus a short status string for logging.
 */
async function syncSubscription(
  stripe: Stripe,
  admin: Admin,
  subscription: Stripe.Subscription,
  hints: { userId: string | null; tier: string | null },
): Promise<SyncResult> {
  const customerId = asId(subscription.customer)
  const userId = await resolveUserId(stripe, admin, {
    hint: hints.userId,
    customerId,
    subscriptionId: subscription.id,
  })
  if (!userId) {
    return {
      userId: null,
      tier: null,
      log: `unmapped (no user_id for customer ${customerId}, sub ${subscription.id})`,
    }
  }

  const tier = deriveTier(subscription, hints.tier)
  const periodEnd = subscriptionPeriodEnd(subscription)
  // Seats = the line item quantity. Only meaningful for the seat-based School
  // plan; null for the single-seat reader plans.
  const quantity = subscription.items.data[0]?.quantity ?? null
  const seats = tier === "school" ? quantity : null

  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      tier,
      status: subscription.status,
      seats,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  )
  if (error) throw new Error(`subscriptions upsert failed: ${error.message}`)

  // Family & School are teacher-capable plans: grant the teacher role so the
  // Virgil gate (role='teacher') and educator tools unlock. Only ever SETS the
  // role — never strips it, so a mid-period cancel doesn't yank access.
  if ((tier === "family" || tier === "school") && isLiveStatus(subscription.status)) {
    await ensureTeacherRole(admin, userId)
  }

  // The purchasing admin always occupies seat #1 of their own School plan.
  // Idempotent: ignore the duplicate on replay. Skipped once the subscription
  // is no longer live so a canceled plan stops conferring teacher tools.
  if (tier === "school" && isLiveStatus(subscription.status)) {
    await ensureSchoolAdminSeat(admin, userId)
  }

  return {
    userId,
    tier,
    log: `user ${userId} -> tier ${tier ?? "null"}, status ${subscription.status}, seats ${seats ?? "n/a"}`,
  }
}

/** A subscription status that still confers entitlement. */
function isLiveStatus(status: string): boolean {
  return status === "active" || status === "trialing" || status === "past_due"
}

/** Grant profiles.role='teacher' if not already. Never downgrades. */
async function ensureTeacherRole(admin: Admin, userId: string): Promise<void> {
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()
  if ((profile?.role as string | null) === "teacher") return
  const { error } = await admin
    .from("profiles")
    .update({ role: "teacher" })
    .eq("id", userId)
  if (error) {
    console.error(`[stripe-webhook] could not set teacher role for ${userId}: ${error.message}`)
  }
}

/** Ensure the School admin holds seat #1 (seat_role='admin'). Idempotent. */
async function ensureSchoolAdminSeat(admin: Admin, ownerId: string): Promise<void> {
  const { error } = await admin.from("school_seats").upsert(
    {
      subscription_user_id: ownerId,
      teacher_id: ownerId,
      seat_role: "admin",
    },
    { onConflict: "subscription_user_id,teacher_id", ignoreDuplicates: true },
  )
  if (error) {
    console.error(`[stripe-webhook] could not bootstrap admin seat for ${ownerId}: ${error.message}`)
  }
}

/**
 * Resolve a Tome user id from (in order): an explicit event hint, the Stripe
 * customer's `metadata.user_id` (set at checkout), or an existing subscriptions
 * row keyed by subscription id then customer id.
 */
async function resolveUserId(
  stripe: Stripe,
  admin: Admin,
  args: { hint: string | null; customerId: string; subscriptionId: string },
): Promise<string | null> {
  if (args.hint) return args.hint

  try {
    const customer = await stripe.customers.retrieve(args.customerId)
    if (customer && !customer.deleted) {
      const fromMeta = (customer.metadata?.user_id as string | undefined) ?? null
      if (fromMeta) return fromMeta
    }
  } catch {
    // fall through to row lookups
  }

  const bySub = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", args.subscriptionId)
    .maybeSingle()
  if (bySub.data?.user_id) return bySub.data.user_id as string

  const byCustomer = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", args.customerId)
    .maybeSingle()
  if (byCustomer.data?.user_id) return byCustomer.data.user_id as string

  return null
}

/** tier from: metadata hint → env price-id reverse map → price metadata. */
function deriveTier(subscription: Stripe.Subscription, hint: string | null): PaidTier | null {
  if (hint && isPaidTier(hint)) return hint
  const priceId = subscription.items.data[0]?.price?.id
  if (priceId) {
    const fromEnv = tierForPriceId(priceId)
    if (fromEnv) return fromEnv
  }
  const fromMeta = subscription.items.data[0]?.price?.metadata?.tier
  return fromMeta && isPaidTier(fromMeta) ? fromMeta : null
}

/** current_period_end across Stripe API versions (item-level → top-level). */
function subscriptionPeriodEnd(subscription: Stripe.Subscription): number | null {
  const itemLevel = subscription.items.data[0]?.current_period_end
  if (typeof itemLevel === "number") return itemLevel
  const topLevel = (subscription as unknown as { current_period_end?: number }).current_period_end
  return typeof topLevel === "number" ? topLevel : null
}

/** Extract a subscription id from an invoice across Stripe API versions. */
function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const direct = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription
  if (typeof direct === "string") return direct
  if (direct && typeof direct === "object" && "id" in direct) return direct.id
  const parent = (invoice as unknown as {
    parent?: { subscription_details?: { subscription?: string | { id: string } } }
  }).parent
  const sub = parent?.subscription_details?.subscription
  if (typeof sub === "string") return sub
  if (sub && typeof sub === "object" && "id" in sub) return sub.id
  return null
}

/** Normalize a Stripe id-or-object to its id string. */
function asId(value: string | { id: string }): string {
  return typeof value === "string" ? value : value.id
}
