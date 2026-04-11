import { BlurFade } from "@/components/ui/blur-fade"
import { PricingCard } from "./PricingCard"

export function TeacherPricingSection() {
  return (
    <section className="bg-muted py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-3">
              Pricing for classrooms
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Simple per-student pricing. Volume discounts for whole schools and
              districts.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <PricingCard
              tier="Classroom"
              price="$4"
              cadence="per student / month"
              description="For a single teacher with one or more class sections."
              features={[
                "Up to 150 students",
                "All 256 books in the canon",
                "Class roster and sections",
                "Assignment builder with due dates",
                "Gradebook with Virgil usage analytics",
                "Passage-anchored discussion threads",
              ]}
              ctaLabel="Start a pilot"
              ctaHref="/demo?plan=classroom"
            />

            <PricingCard
              tier="School"
              price="$3"
              cadence="per student / month"
              description="For English departments and whole schools."
              features={[
                "Unlimited students",
                "Everything in Classroom",
                "Custom Trials authoring",
                "Standards alignment (Common Core, AP, IB)",
                "Google Classroom roster sync",
                "Department-wide analytics",
                "Dedicated onboarding",
              ]}
              ctaLabel="Book a demo"
              ctaHref="/demo?plan=school"
              featured
            />

            <PricingCard
              tier="District"
              price="Custom"
              cadence="volume pricing"
              description="For districts adopting Tome across multiple schools."
              features={[
                "Everything in School",
                "Multi-school admin console",
                "SSO and SIS integration",
                "District-wide reporting",
                "Custom professional development",
                "Annual contract with invoicing",
              ]}
              ctaLabel="Contact sales"
              ctaHref="/demo?plan=district"
            />
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <p className="text-center text-xs text-muted-foreground mt-8">
            All school plans include a free thirty-day pilot. No credit card
            required.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
