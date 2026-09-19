import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"
import { assertPriceMatchesKeyMode } from "@/lib/stripe/prices"
import {
  getStudentSeatPriceId,
  getSchoolFlatPriceId,
  schoolFlatForKey,
  getFamilyPriceId,
  getTopupPriceId,
  isPurchasableTier,
} from "@/lib/billing/prices"
import {
  MIN_STUDENT_SEATS,
  SCHOOL_MIN_SEATS,
  QUESTIONS_TOPUP_BLOCK,
} from "@/lib/billing/config"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/**
 * Creates a Stripe Checkout Session and returns its hosted-checkout URL.
 * All billing is annual; price ids resolve server-side from env and never
 * ship to the browser.
 *
 * Body (one of):
 *   { tier: "classroom", seats }            — $12 seat price × max(1, seats)
 *   { tier: "school", seats }               — seat price × max(125, seats)
 *   { tier: "school", flat: "flat150"|"flat300" } — flat price, qty 1
 *   { tier: "family" }                      — $99/yr, qty 1
 *   { kind: "topup" }                       — one-time Questions block (mode: payment)
 *
 * `metadata.tier` + `metadata.student_seats` disambiguate the shared seat
 * price for the webhook (classroom vs school). The signed-in user is attached
 * as the Stripe customer (reused from subscriptions → profiles → metadata
 * search, else created) and persisted to both tables; `client_reference_id`
 * + `subscription_data.metadata.user_id` let the webhook map the resulting
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
    tier?: string
    seats?: unknown
    flat?: string
    kind?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const isTopup = body.kind === "topup"
  if (!isTopup && (!body.tier || !isPurchasableTier(body.tier))) {
    return NextResponse.json(
      { error: "Provide a known tier or kind." },
      { status: 400 },
    )
  }

  // Resolve price id + line-item quantity + the student-seat count recorded
  // in metadata (which the webhook and seat enforcement read).
  let priceId: string | null = null
  let quantity = 1
  let studentSeats = 0
  let tier: string | null = null

  const seatsRaw = Math.floor(Number(body.seats))
  const requestedSeats = Number.isFinite(seatsRaw) && seatsRaw >= 1 ? seatsRaw : 1

  if (isTopup) {
    priceId = getTopupPriceId()
  } else if (body.tier === "classroom") {
    tier = "classroom"
    priceId = getStudentSeatPriceId()
    quantity = Math.max(MIN_STUDENT_SEATS, requestedSeats)
    studentSeats = quantity
  } else if (body.tier === "school" && typeof body.flat === "string") {
    const flat = schoolFlatForKey(body.flat)
    if (!flat) {
      return NextResponse.json({ error: "Unknown school tier." }, { status: 400 })
    }
    tier = "school"
    priceId = getSchoolFlatPriceId(flat.key)
    quantity = 1
    studentSeats = flat.maxStudents
  } else if (body.tier === "school") {
    tier = "school"
    priceId = getStudentSeatPriceId()
    quantity = Math.max(SCHOOL_MIN_SEATS, requestedSeats)
    studentSeats = quantity
  } else if (body.tier === "family") {
    tier = "family"
    priceId = getFamilyPriceId()
    quantity = 1
  }

  if (!priceId) {
    return NextResponse.json({ error: "Plan price not configured." }, { status: 500 })
  }

  // Require a signed-in user so the purchase can be mapped to an account.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in to subscribe." }, { status: 401 })
  }

  // Students never self-checkout: they're provisioned into a plan by a
  // teacher, school, or parent. Block the role explicitly so a signed-in
  // student can't mint a subscription. Reads the caller's OWN profile row
  // (RLS-scoped client).
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

  const kind = isTopup ? "topup" : "subscription"
  // {CHECKOUT_SESSION_ID} is expanded by Stripe on redirect so the success page
  // can reconcile the REAL status from Stripe (not claim "active" on trust,
  // which would be a lie until the webhook lands).
  const successPath = `/billing/success?session_id={CHECKOUT_SESSION_ID}&kind=${kind}${
    tier ? `&tier=${tier}` : ""
  }`

  const metadata: Record<string, string> = {
    user_id: user.id,
    kind,
    ...(tier ? { tier } : {}),
    ...(studentSeats > 0 ? { student_seats: String(studentSeats) } : {}),
    ...(isTopup ? { topup_questions: String(QUESTIONS_TOPUP_BLOCK) } : {}),
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isTopup ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity }],
      customer: customerId,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      ...(isTopup
        ? {}
        : { subscription_data: { metadata } }),
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata,
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
