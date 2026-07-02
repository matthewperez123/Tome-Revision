import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/**
 * Opens a Stripe Billing Portal session for the signed-in user so they can
 * update payment details or cancel. Returns the portal URL to redirect to.
 * The Stripe customer id is read from the canonical `subscriptions` row
 * (falling back to `profiles`).
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 501 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in to manage billing." }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: subRow } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle()
  let customerId = (subRow?.stripe_customer_id as string | null) ?? null

  if (!customerId) {
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle()
    customerId = (profile?.stripe_customer_id as string | null) ?? null
  }

  if (!customerId) {
    return NextResponse.json({ error: "No billing account found." }, { status: 403 })
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000"

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/profile`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not open billing portal."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
