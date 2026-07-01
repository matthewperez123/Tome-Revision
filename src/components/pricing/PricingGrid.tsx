import type { BillingPeriod, EducatorPlan, ReaderPlan } from "@/lib/marketing/plans"
import { isPaidTier } from "@/lib/stripe/plans"
import { PricingCard } from "./PricingCard"

interface PricingGridProps {
  plans: (ReaderPlan | EducatorPlan)[]
  period: BillingPeriod
}

export function PricingGrid({ plans, period }: PricingGridProps) {
  const cols =
    plans.length >= 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : "md:grid-cols-3"

  return (
    <div className={`grid grid-cols-1 gap-6 ${cols} items-stretch`}>
      {plans.map((plan) => {
        const pricing = plan[period]
        if (!pricing) return null
        return (
          <PricingCard
            key={plan.id}
            name={plan.name}
            price={pricing.price}
            cadence={pricing.cadence}
            description={plan.description}
            features={plan.features}
            ctaLabel={plan.ctaLabel}
            ctaHref={plan.ctaHref}
            featured={plan.featured}
            badge={plan.badge}
            checkout={
              isPaidTier(plan.id) ? { tier: plan.id, period } : undefined
            }
          />
        )
      })}
    </div>
  )
}
