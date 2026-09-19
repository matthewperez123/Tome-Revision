import type { Metadata } from "next"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { getStripe } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: { absolute: "You're in — Tome" },
  robots: { index: false },
}

// RUBRIC verdigris — the settled palette's "confirmed / complete" accent.
// Iridescence is reserved exclusively for Tome Assistant surfaces, so this page uses
// a flat, single-hue treatment.
const VERDIGRIS = "#2E7D6F"

/** Display names + confirmation blurbs for the purchasable tiers. */
const TIER_COPY: Record<string, { name: string; blurb: string }> = {
  classroom: {
    name: "Classroom",
    blurb: "Your student seats are ready — invite your roster and assign the first reading.",
  },
  school: {
    name: "School",
    blurb: "Your school's seats are ready — invite teachers and roll out classrooms.",
  },
  family: {
    name: "Family",
    blurb: "The whole household can read now — set up your students and assign the first book.",
  },
}

/**
 * Reconcile the REAL subscription status straight from Stripe, keyed off the
 * Checkout Session id. This is authoritative and does NOT depend on the webhook
 * having landed yet, so the page can tell the truth ("active" vs "finalizing")
 * instead of asserting a subscription is active the instant Stripe redirects.
 * Returns null when it can't confirm (no session id, Stripe unconfigured, the
 * session doesn't belong to the signed-in user, or a lookup error).
 */
async function resolveConfirmed(sessionId: string | undefined): Promise<boolean> {
  if (!sessionId) return false
  const stripe = getStripe()
  if (!stripe) return false
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })
    // Only trust a session that belongs to THIS signed-in user.
    if (session.client_reference_id !== user.id) return false
    // One-time purchases (Questions top-up) have no subscription.
    if (session.mode === "payment") return session.payment_status === "paid"
    const sub = session.subscription
    const status = sub && typeof sub !== "string" ? sub.status : null
    return status === "active" || status === "trialing"
  } catch {
    return false
  }
}

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; session_id?: string; kind?: string }>
}) {
  const { tier, session_id, kind } = await searchParams
  const isTopup = kind === "topup"
  const plan = (tier && TIER_COPY[tier]) || null
  const confirmed = await resolveConfirmed(session_id)

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div
          className="mx-auto flex size-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${VERDIGRIS}1a`, color: VERDIGRIS }}
        >
          {confirmed ? (
            <Check className="size-7" aria-hidden />
          ) : (
            <Loader2 className="size-7 animate-spin" aria-hidden />
          )}
        </div>

        <h1 className="mt-6 font-[var(--font-display)] text-3xl font-bold text-foreground">
          {confirmed
            ? isTopup
              ? "Questions added"
              : plan
                ? `Welcome to Tome ${plan.name}`
                : "You're all set"
            : isTopup
              ? "Finalizing your purchase"
              : "Finalizing your subscription"}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {confirmed ? (
            isTopup ? (
              <>
                Your Questions top-up is applied and ready to use. A receipt is
                on its way to your inbox.
              </>
            ) : (
              <>
                {plan
                  ? plan.blurb
                  : "Your subscription is active. Thank you for supporting the canon."}{" "}
                Your subscription is active and a receipt is on its way to your inbox.
              </>
            )
          ) : (
            <>
              Thanks for your purchase{plan ? ` of Tome ${plan.name}` : ""}. We&apos;re
              confirming your payment — this can take a moment. Your receipt will
              arrive by email, and your access unlocks as soon as it clears.
            </>
          )}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/library/browse"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start reading
          </Link>
          <Link
            href="/account"
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Manage billing
          </Link>
        </div>
      </div>
    </main>
  )
}
