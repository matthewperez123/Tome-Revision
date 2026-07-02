import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"
import { tierForPriceId } from "@/lib/stripe/prices"
import { isPaidTier, type PaidTier } from "@/lib/stripe/plans"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getEntitlement } from "@/lib/entitlements/server"
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

  // ── Idempotency: CLAIM the event id before doing any work ──────────
  // Inserting the primary key first makes the claim atomic — a replayed or
  // concurrently-delivered event hits the pk conflict (23505) and returns 200
  // so Stripe stops retrying. If processing then fails, the claim is released
  // (below) so Stripe's next retry can reprocess.
  const { error: claimErr } = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type })
  if (claimErr) {
    if (claimErr.code === "23505") {
      console.log(`[stripe-webhook] duplicate ${event.type} (${event.id}) — skipping`)
      return NextResponse.json({ received: true, duplicate: true })
    }
    // A transient claim failure — let Stripe retry the whole event.
    console.error(`[stripe-webhook] could not claim ${event.id}: ${claimErr.message}`)
    return NextResponse.json({ error: "Could not record event." }, { status: 500 })
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
        // A fully deleted subscription no longer confers a paid teacher plan —
        // step the buyer back down to `reader` unless they still teach.
        if (event.type === "customer.subscription.deleted" && result.userId) {
          await maybeDowngradeRole(admin, result.userId)
        }
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
    // Release the claim so Stripe's retry can reprocess a transient failure.
    await admin.from("stripe_events").delete().eq("id", event.id)
    const message = err instanceof Error ? err.message : "Webhook handler failed."
    console.error(`[stripe-webhook] error handling ${event.type} (${event.id}): ${message}`)
    return NextResponse.json({ error: message }, { status: 500 })
  }

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

  // Mirror the Stripe customer id onto the profile so the account page can
  // surface the billing portal even before the entitlement is read.
  await persistProfileCustomerId(admin, userId, customerId)

  // Family & School are teacher-capable plans: grant the teacher role so the
  // Virgil gate (role='teacher') and educator tools unlock. Only ever SETS the
  // role — never strips it, so a mid-period cancel doesn't yank access.
  if ((tier === "family" || tier === "school") && isLiveStatus(subscription.status)) {
    await ensureTeacherRole(admin, userId)
  }

  // Provision one School seat per purchased quantity: seat #1 is the buying
  // admin (active), the rest are `pending` placeholders the admin fills by
  // inviting teachers. Idempotent — tops up only the missing rows on replay.
  if (tier === "school" && isLiveStatus(subscription.status)) {
    await ensureSchoolSeats(admin, userId, quantity ?? 1)
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

/** Persist the Stripe customer id onto the profile. Best-effort. */
async function persistProfileCustomerId(
  admin: Admin,
  userId: string,
  customerId: string,
): Promise<void> {
  const { error } = await admin
    .from("profiles")
    .update({ stripe_customer_id: customerId })
    .eq("id", userId)
  if (error) {
    console.error(`[stripe-webhook] could not set stripe_customer_id for ${userId}: ${error.message}`)
  }
}

/**
 * Provision the School seat roster to match the purchased quantity. Seat #1 is
 * the admin (active); each remaining seat is a `pending` placeholder (no
 * teacher yet) that an invite later claims. Idempotent — creates only the
 * shortfall, never removes seats (a downward change is handled elsewhere).
 */
async function ensureSchoolSeats(
  admin: Admin,
  ownerId: string,
  quantity: number,
): Promise<void> {
  // Seat #1 — the purchasing admin.
  const { error: adminErr } = await admin.from("school_seats").upsert(
    {
      subscription_user_id: ownerId,
      teacher_id: ownerId,
      seat_role: "admin",
      status: "active",
    },
    { onConflict: "subscription_user_id,teacher_id", ignoreDuplicates: true },
  )
  if (adminErr) {
    console.error(`[stripe-webhook] could not bootstrap admin seat for ${ownerId}: ${adminErr.message}`)
  }

  const target = Math.max(1, Math.floor(quantity))
  const { count } = await admin
    .from("school_seats")
    .select("id", { count: "exact", head: true })
    .eq("subscription_user_id", ownerId)
  const missing = target - (count ?? 0)
  if (missing <= 0) return

  const rows = Array.from({ length: missing }, () => ({
    subscription_user_id: ownerId,
    teacher_id: null,
    seat_role: "teacher",
    status: "pending",
  }))
  const { error } = await admin.from("school_seats").insert(rows)
  if (error) {
    console.error(`[stripe-webhook] could not provision ${missing} pending seat(s) for ${ownerId}: ${error.message}`)
  }
}

/**
 * Step a former teacher back down to `reader` after their paid plan is deleted,
 * UNLESS they still teach: they own/co-teach a classroom, or a still-active
 * School seat covers them. Never touches a non-teacher role.
 */
async function maybeDowngradeRole(admin: Admin, userId: string): Promise<void> {
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()
  if ((profile?.role as string | null) !== "teacher") return

  // Still entitled as a paid teacher (a covered School seat or Family plan)?
  const entitlement = await getEntitlement(userId)
  if (entitlement.isActive && (entitlement.tier === "school" || entitlement.tier === "family")) {
    console.log(`[stripe-webhook] keep teacher role for ${userId}: still entitled (${entitlement.tier})`)
    return
  }

  // Owns or co-teaches a classroom → keep the teacher role (and log the skip).
  if (await teachesAnyClassroom(admin, userId)) {
    console.log(`[stripe-webhook] keep teacher role for ${userId}: owns/co-teaches a classroom`)
    return
  }

  const { error } = await admin
    .from("profiles")
    .update({ role: "reader" })
    .eq("id", userId)
  if (error) {
    console.error(`[stripe-webhook] could not downgrade role for ${userId}: ${error.message}`)
  } else {
    console.log(`[stripe-webhook] downgraded ${userId} to reader (plan deleted, no classroom)`)
  }
}

/** True when the user creates or co-teaches at least one classroom. */
async function teachesAnyClassroom(admin: Admin, userId: string): Promise<boolean> {
  const { count: owned } = await admin
    .from("classrooms")
    .select("id", { count: "exact", head: true })
    .eq("teacher_id", userId)
  if ((owned ?? 0) > 0) return true

  const { count: staffed } = await admin
    .from("classroom_members")
    .select("id", { count: "exact", head: true })
    .eq("student_id", userId)
    .in("role", ["owner", "co_teacher"])
  return (staffed ?? 0) > 0
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
