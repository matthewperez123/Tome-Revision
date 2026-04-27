import { BlurFade } from "@/components/ui/blur-fade"
import { PricingCard } from "./PricingCard"

export function TeacherPricingSection() {
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
            <PricingCard
              tier="Classroom"
              price="$0"
              cadence="forever"
              description="Free for individual teachers, up to 30 students."
              features={[
                "1 class",
                "Up to 30 students",
                "Basic assignments",
                "Auto-graded Trials",
                "Gradebook export",
              ]}
              ctaLabel="Start free"
              ctaHref="/signup?plan=classroom"
            />

            <PricingCard
              tier="School"
              price="$TBD"
              cadence="per teacher / month"
              description="For departments and schools."
              features={[
                "Unlimited classes and students",
                "All assignment types",
                "Virgil reflection grading",
                "Class progress dashboard",
                "Co-teacher sharing",
                "LMS export",
                "Priority support",
              ]}
              ctaLabel="Book a demo"
              ctaHref="/demo?plan=school"
              featured
            />

            <PricingCard
              tier="District"
              price="Contact us"
              cadence=""
              description="For districts and large institutions."
              features={[
                "Everything in School",
                "SSO",
                "Roster sync (Clever, ClassLink, Google Classroom)",
                "Admin dashboard",
                "Custom standards alignment",
                "Dedicated success manager",
              ]}
              ctaLabel="Contact sales"
              ctaHref="/demo?plan=district"
            />
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <p className="text-center text-xs text-muted-foreground mt-8">
            Pricing in development &mdash; final tiers and rates announced at launch.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
