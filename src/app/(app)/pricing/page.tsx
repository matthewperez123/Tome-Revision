import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { PricingView } from "@/components/pricing/PricingView"
import { faqCategories } from "@/lib/faqs"

export const metadata: Metadata = {
  title: { absolute: "Pricing — Tome" },
  description:
    "Tome plans for readers and educators. Read the canon free forever, go deeper with Solo or Family, or bring guided reading to your classroom, school, or district.",
  openGraph: {
    title: "Pricing — Tome",
    description:
      "Plans for readers and educators — Free, Solo, and Family for readers; Classroom, School, and District for educators.",
  },
}

const billingFaqs =
  faqCategories.find((category) => category.id === "billing")?.items.slice(0, 3) ?? []

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      <main className="px-6 pb-24 pt-32 md:px-12">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
            Read the canon. Choose how you go deeper.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Start free and stay free forever, or unlock the full library and
            Virgil&apos;s deeper scholarship when you&apos;re ready.
          </p>
        </section>

        {/* Plans + toggles */}
        <section className="mx-auto mt-16 max-w-5xl">
          <Suspense fallback={null}>
            <PricingView />
          </Suspense>
        </section>

        {/* FAQ teaser strip */}
        <section className="mx-auto mt-24 max-w-3xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-[var(--font-display)] text-2xl font-bold text-foreground">
              Billing questions
            </h2>
            <Link
              href="/faq#billing"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See all questions <ArrowRight className="size-4" />
            </Link>
          </div>
          <dl className="divide-y divide-border border-y border-border">
            {billingFaqs.map((item) => (
              <div key={item.q} className="py-4">
                <dt className="text-base font-semibold text-foreground">
                  {item.q}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
