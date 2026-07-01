import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import { getEntitlement } from "@/lib/entitlements/server"
import type { SupabaseClient } from "@supabase/supabase-js"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/** Hard ceiling on a single self-serve School subscription's teacher seats. */
const MAX_SEATS = 500

/**
 * Change the number of teacher seats on the caller's School subscription.
 * Seats are the line-item `quantity`; Stripe is the source of truth for the
 * count, so this updates the subscription with proration on. The canonical
 * `subscriptions.seats` is refreshed here and re-confirmed by the webhook.
 *
 * Body: { seats: number }
 *
 * Admin-only. The new count cannot drop below the number of seats already
 * assigned to teachers (release teachers first via removeTeacherFromSchool).
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing is not configured." },
      { status: 501 },
    )
  }

  let body: { seats?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const seats = Math.floor(Number(body.seats))
  if (!Number.isFinite(seats) || seats < 1 || seats > MAX_SEATS) {
    return NextResponse.json(
      { error: `Choose between 1 and ${MAX_SEATS} teacher seats.` },
      { status: 400 },
    )
  }

  // Require a signed-in admin of an active School subscription.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in to manage seats." }, { status: 401 })
  }

  const entitlement = await getEntitlement(user.id)
  if (entitlement.tier !== "school" || entitlement.schoolRole !== "admin") {
    return NextResponse.json(
      { error: "Only the School plan admin can change seats." },
      { status: 403 },
    )
  }

  const admin = createAdminClient()

  // Never shrink below the seats already assigned to teachers (admin + covered).
  const { count: assigned } = await admin
    .from("school_seats")
    .select("*", { count: "exact", head: true })
    .eq("subscription_user_id", user.id)
  if (assigned != null && seats < assigned) {
    return NextResponse.json(
      {
        error: `${assigned} seats are in use. Remove teachers before reducing below ${assigned}.`,
      },
      { status: 400 },
    )
  }

  // Resolve the Stripe subscription to update.
  const { data: subRow } = await admin
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle()
  const subscriptionId = (subRow?.stripe_subscription_id as string | null) ?? null
  if (!subscriptionId) {
    return NextResponse.json(
      { error: "No active School subscription found." },
      { status: 404 },
    )
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const item = subscription.items.data[0]
    if (!item) {
      return NextResponse.json(
        { error: "Subscription has no billable item." },
        { status: 500 },
      )
    }

    // Proration on: Stripe credits/charges the seat-count delta immediately.
    await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: item.id, quantity: seats }],
      proration_behavior: "create_prorations",
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not update seats."
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Reflect the new count immediately; the webhook re-confirms from Stripe.
  await admin
    .from("subscriptions")
    .update({ seats, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)

  return NextResponse.json({ seats })
}
