import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import {
  EDUCATOR_FINE_PRINT_DEV,
  EDUCATOR_FINE_PRINT_FINAL,
  SCHOOL_PRICING_IS_FINAL,
  educatorPlansForPeriod,
} from "@/lib/pricing"
import { PricingCard } from "./PricingCard"

// Teaser only — full plans live on /pricing. Numbers sourced from lib/pricing.
export function TeacherPricingSection() {
  const plans = educatorPlansForPeriod("monthly")

  return (
    <section className="bg-muted py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-10">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-3">
              Bring Tome to your classroom
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Free for individual teachers. Volume tiers for departments and districts.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => {
              const pricing = plan.monthly!
              return (
                <PricingCard
                  key={plan.id}
                  tier={plan.name}
                  price={pricing.price}
                  cadence={pricing.cadence}
                  description={plan.description}
                  features={plan.features}
                  ctaLabel={plan.ctaLabel}
                  ctaHref={plan.ctaHref}
                  featured={plan.featured}
                />
              )
            })}
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              {SCHOOL_PRICING_IS_FINAL
                ? EDUCATOR_FINE_PRINT_FINAL
                : EDUCATOR_FINE_PRINT_DEV}
            </p>
            <Link
              href="/pricing?for=educators"
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
