"use client"

import type { PurchasableTier } from "@/lib/billing/tiers"
import { PricingCard } from "./PricingCard"

/**
 * Plain, serialized plan card derived on the server from
 * `@/lib/billing/tiers` (the single source of plan facts) and passed in as
 * props. Carries NO Stripe Price IDs — checkout resolves those server-side
 * from the tier. All billing is annual; there is no monthly toggle.
 */
export interface BillingPlanCard {
  tier: string
  name: string
  blurb: string
  featured: boolean
  badge?: string
  ctaLabel: string
  ctaHref: string
  features: string[]
  /** null → the CTA is a plain link (free / quote); else opens seat checkout. */
  checkoutTier: PurchasableTier | null
  price: string
  cadence: string
}

export function BillingPlans({ plans }: { plans: BillingPlanCard[] }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <PricingCard
          key={plan.tier}
          name={plan.name}
          price={plan.price}
          cadence={plan.cadence}
          description={plan.blurb}
          features={plan.features}
          ctaLabel={plan.ctaLabel}
          ctaHref={plan.ctaHref}
          featured={plan.featured}
          badge={plan.badge}
          checkout={
            plan.checkoutTier ? { tier: plan.checkoutTier } : undefined
          }
        />
      ))}
    </div>
  )
}
