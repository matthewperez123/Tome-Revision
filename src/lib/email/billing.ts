import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { PaidTier } from "@/lib/stripe/plans"
import { sendEmail } from "./send"
import { SubscriptionConfirmedEmail } from "./templates/subscription-confirmed"
import { TrialEndingEmail } from "./templates/trial-ending"
import { PaymentFailedEmail } from "./templates/payment-failed"

/**
 * Best-effort dispatchers for billing transactional emails, called from the
 * Stripe webhook handler. Every sender resolves the recipient from the auth
 * user record, formats money/plan/date, and NEVER throws — an email failure
 * must not fail the webhook (Stripe would otherwise retry the whole event).
 */

type Admin = SupabaseClient<any, "public", any>

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://usetome.app"
const MANAGE_URL = `${APP_URL}/profile`

const PLAN_LABELS: Record<PaidTier, string> = {
  solo: "Tome Solo",
  family: "Tome Family",
  school: "Tome School",
}

export function planLabel(tier: PaidTier | string | null): string {
  if (tier && tier in PLAN_LABELS) return PLAN_LABELS[tier as PaidTier]
  return "your Tome subscription"
}

export function formatMoney(
  amountCents: number | null | undefined,
  currency: string | null | undefined,
): string {
  const cents = typeof amountCents === "number" ? amountCents : 0
  const cur = (currency || "usd").toUpperCase()
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
    }).format(cents / 100)
  } catch {
    return `${(cents / 100).toFixed(2)} ${cur}`
  }
}

export function formatDate(unixSeconds: number | null | undefined): string | null {
  if (typeof unixSeconds !== "number") return null
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    dateStyle: "long",
  })
}

async function resolveRecipient(
  admin: Admin,
  userId: string,
): Promise<{ email: string; firstName: string | null } | null> {
  const { data, error } = await admin.auth.admin.getUserById(userId)
  if (error || !data?.user?.email) return null
  const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>
  const fullName =
    typeof meta.full_name === "string" ? meta.full_name.trim() : ""
  const firstName = fullName ? fullName.split(/\s+/)[0]! : null
  return { email: data.user.email, firstName }
}

/** Receipt / subscription-confirmed — on a successful paid invoice. */
export async function sendReceiptEmail(
  admin: Admin,
  userId: string,
  opts: {
    tier: PaidTier | string | null
    amountCents: number | null | undefined
    currency: string | null | undefined
    nextBillingUnix?: number | null
    invoiceUrl?: string | null
  },
): Promise<void> {
  try {
    const r = await resolveRecipient(admin, userId)
    if (!r) return
    const label = planLabel(opts.tier)
    await sendEmail({
      to: r.email,
      subject: `Your ${label} receipt`,
      react: SubscriptionConfirmedEmail({
        firstName: r.firstName,
        planLabel: label,
        amountFormatted: formatMoney(opts.amountCents, opts.currency),
        nextBillingDate: formatDate(opts.nextBillingUnix),
        invoiceUrl: opts.invoiceUrl ?? null,
        manageUrl: MANAGE_URL,
        recipient: r.email,
      }),
    })
  } catch (err) {
    console.error(
      "[billing-email] receipt failed:",
      err instanceof Error ? err.message : err,
    )
  }
}

/** Trial-ending reminder — on customer.subscription.trial_will_end. */
export async function sendTrialEndingEmail(
  admin: Admin,
  userId: string,
  opts: {
    tier: PaidTier | string | null
    trialEndUnix: number | null | undefined
    amountCents?: number | null
    currency?: string | null
  },
): Promise<void> {
  try {
    const r = await resolveRecipient(admin, userId)
    if (!r) return
    const trialEndDate = formatDate(opts.trialEndUnix) ?? "soon"
    const amountFormatted =
      typeof opts.amountCents === "number"
        ? formatMoney(opts.amountCents, opts.currency)
        : null
    await sendEmail({
      to: r.email,
      subject: "Your Tome free trial is ending soon",
      react: TrialEndingEmail({
        firstName: r.firstName,
        planLabel: planLabel(opts.tier),
        trialEndDate,
        amountFormatted,
        manageUrl: MANAGE_URL,
        recipient: r.email,
      }),
    })
  } catch (err) {
    console.error(
      "[billing-email] trial-ending failed:",
      err instanceof Error ? err.message : err,
    )
  }
}

/** Dunning — on invoice.payment_failed. */
export async function sendPaymentFailedEmail(
  admin: Admin,
  userId: string,
  opts: {
    tier: PaidTier | string | null
    amountCents?: number | null
    currency?: string | null
    /** Stripe hosted invoice URL — lets the reader pay the open invoice. */
    hostedInvoiceUrl?: string | null
  },
): Promise<void> {
  try {
    const r = await resolveRecipient(admin, userId)
    if (!r) return
    const amountFormatted =
      typeof opts.amountCents === "number"
        ? formatMoney(opts.amountCents, opts.currency)
        : null
    await sendEmail({
      to: r.email,
      subject: "Action needed: your Tome payment didn't go through",
      react: PaymentFailedEmail({
        firstName: r.firstName,
        planLabel: planLabel(opts.tier),
        amountFormatted,
        updatePaymentUrl: opts.hostedInvoiceUrl || MANAGE_URL,
        recipient: r.email,
      }),
    })
  } catch (err) {
    console.error(
      "[billing-email] payment-failed dispatch failed:",
      err instanceof Error ? err.message : err,
    )
  }
}
