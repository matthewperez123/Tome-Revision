import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { BILLING_TIERS, type BillingTier } from "@/lib/billing/prices"

export const metadata: Metadata = {
  title: { absolute: "You're in — Tome" },
  robots: { index: false },
}

// RUBRIC verdigris — the settled palette's "confirmed / complete" accent.
// Iridescence is reserved exclusively for Virgil surfaces, so this page uses
// a flat, single-hue treatment.
const VERDIGRIS = "#2E7D6F"

function isBillingTier(value: string | undefined): value is BillingTier {
  return value === "solo" || value === "family" || value === "school"
}

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>
}) {
  const { tier } = await searchParams
  const plan = isBillingTier(tier) ? BILLING_TIERS[tier] : null

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div
          className="mx-auto flex size-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${VERDIGRIS}1a`, color: VERDIGRIS }}
        >
          <Check className="size-7" aria-hidden />
        </div>

        <h1 className="mt-6 font-[var(--font-display)] text-3xl font-bold text-foreground">
          {plan ? `Welcome to Tome ${plan.name}` : "You're all set"}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {plan
            ? plan.blurb
            : "Your subscription is active. Thank you for supporting the canon."}{" "}
          Your subscription is active and a receipt is on its way to your inbox.
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
