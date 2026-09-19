import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { getMarketingTiers } from "@/lib/billing/tiers"
import { PricingCard } from "./PricingCard"

// Teaser only — seat checkout and the full breakdown live on /pricing.
// Numbers are sourced from lib/billing/tiers so they never drift.
export function TeacherPricingSection() {
  const plans = getMarketingTiers()

  return (
    <section className="bg-muted py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-10">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-3">
              Bring Tome to your classroom
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Free for teachers. Per-student seats for classrooms and schools.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <PricingCard
                key={plan.tier}
                tier={plan.name}
                price={plan.price}
                cadence={plan.cadence}
                description={plan.blurb}
                features={plan.features}
                ctaLabel={plan.ctaLabel}
                ctaHref={plan.seatCheckout ? "/pricing" : plan.ctaHref}
                featured={plan.featured}
                badge={plan.badge}
              />
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Prices in USD, billed annually, cancel any time. Schools may pay
              by invoice or purchase order.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:opacity-80"
            >
              Compare all plans <ArrowRight className="size-4" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
