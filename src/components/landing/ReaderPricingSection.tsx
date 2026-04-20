import { BlurFade } from "@/components/ui/blur-fade"
import { PricingCard } from "./PricingCard"

export function ReaderPricingSection() {
  return (
    <section className="bg-muted py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-3">
              Begin your reading
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Start free. Upgrade when you&apos;re ready to go deeper.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <PricingCard
              tier="Free"
              price="$0"
              cadence="forever"
              description="Everything you need to start reading the canon."
              features={[
                "Access to 20 foundational books",
                "Virgil annotations in the reader",
                "Daily Flame and Seal tracking",
                "Basic Trials after each chapter",
                "Personal library and progress tracking",
              ]}
              ctaLabel="Begin reading"
              ctaHref="/signup"
            />

            <PricingCard
              tier="Pro"
              price="$9"
              cadence="per month"
              description="Unlimited access to the full canon and Virgil's deeper scholarship."
              features={[
                "All 256 books across 36 literary traditions",
                "Unlimited Virgil conversations",
                "Advanced Trials and Seals",
                "Custom reading lists and collections",
                "Offline reading",
                "Priority support",
              ]}
              ctaLabel="Start Pro"
              ctaHref="/signup?tier=pro"
              featured
            />

            <PricingCard
              tier="Scholar"
              price="$90"
              cadence="per year"
              description="Pro at two months free, for the committed reader."
              features={[
                "Everything in Pro",
                "Two months free versus monthly",
                "Early access to new books",
                "Scholar Seal on your profile",
                "Annual reading review and insights",
              ]}
              ctaLabel="Go annual"
              ctaHref="/signup?tier=scholar"
            />
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <p className="text-center text-xs text-muted-foreground mt-8">
            All plans include a seven-day free trial of Pro. Cancel anytime.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
