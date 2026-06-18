import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { FaqAccordion } from "@/components/faq/FaqAccordion"
import { FaqCategoryNav } from "@/components/faq/FaqCategoryNav"
import { faqCategories, faqJsonLd } from "@/lib/faqs"

export const metadata: Metadata = {
  title: { absolute: "FAQ — Tome" },
  description:
    "Answers about reading on Tome, plans and billing, classroom and school use, and where the texts come from.",
  openGraph: {
    title: "FAQ — Tome",
    description:
      "Reading & getting started, plans & billing, for educators, and the texts & trust — answered.",
  },
}

export default function FaqPage() {
  const navCategories = faqCategories.map(({ id, label }) => ({ id, label }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      <script
        type="application/ld+json"
        // Generated from lib/faqs.ts so structured data never drifts from the
        // visible copy.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <main className="px-6 pb-24 pt-32 md:px-12">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
            Questions, answered.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Everything about reading on Tome, plans and billing, classroom use,
            and where the texts come from.
          </p>
        </section>

        {/* Nav + sections */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-[200px_1fr]">
          <aside>
            <FaqCategoryNav categories={navCategories} />
          </aside>

          <div className="space-y-16">
            {faqCategories.map((category) => (
              <section
                key={category.id}
                id={category.id}
                aria-labelledby={`${category.id}-heading`}
                className="scroll-mt-28"
              >
                <h2
                  id={`${category.id}-heading`}
                  className="mb-4 font-[var(--font-display)] text-2xl font-bold text-foreground"
                >
                  {category.label}
                </h2>
                <FaqAccordion categoryId={category.id} items={category.items} />
              </section>
            ))}

            {/* Bottom CTA */}
            <section className="rounded-xl border border-border bg-muted p-8 text-center">
              <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground">
                Still stuck?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                We&apos;re happy to help — reach out or tell us about your
                school and we&apos;ll set up a pilot.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="https://claude.ai/contact"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Contact us
                </a>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Talk to us about your school <ArrowRight className="size-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
