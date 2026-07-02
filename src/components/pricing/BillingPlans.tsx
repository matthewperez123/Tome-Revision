"use client"

import { useState } from "react"
import type { BillingPeriod } from "@/lib/marketing/plans"
import type { PaidTier } from "@/lib/stripe/plans"
import { BillingToggle } from "./BillingToggle"
import { PricingCard } from "./PricingCard"

/**
 * Plain, serialized plan card derived on the server from
 * `@/lib/billing/prices` (the single source of plan facts) and passed in as
 * props. Carries NO Stripe Price IDs — checkout resolves those server-side
 * from the tier + period.
 */
export interface BillingPlanCard {
  tier: BillingTier
  name: string
  blurb: string
  featured: boolean
  badge?: string
  ctaLabel: string
  ctaHref: string
  /** null → the CTA is a plain link (seat-based / contact); else opens checkout. */
  checkoutTier: PaidTier | null
  /** null when the tier has no monthly option (School is annual-only). */
  monthly: { price: string; cadence: string } | null
  annual: { price: string; cadence: string }
}

type BillingTier = "solo" | "family" | "school"

export function BillingPlans({ plans }: { plans: BillingPlanCard[] }) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly")

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <BillingToggle
          value={period}
          onChange={setPeriod}
          annualNote="2 months free"
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          // Fall back to the annual price for annual-only tiers (School).
          const pricing =
            period === "annual" ? plan.annual : plan.monthly ?? plan.annual
          return (
            <PricingCard
              key={plan.tier}
              name={plan.name}
              price={pricing.price}
              cadence={pricing.cadence}
              description={plan.blurb}
              features={[]}
              ctaLabel={plan.ctaLabel}
              ctaHref={plan.ctaHref}
              featured={plan.featured}
              badge={plan.badge}
              checkout={
                plan.checkoutTier
                  ? { tier: plan.checkoutTier, period }
                  : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}
