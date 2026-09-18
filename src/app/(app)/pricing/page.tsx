import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { BillingPlans, type BillingPlanCard } from "@/components/pricing/BillingPlans"
import { getMarketingTiers, getTopupOffer, isPurchasableTier } from "@/lib/billing/tiers"
import { getFaqCategories } from "@/lib/faqs"
import { getCatalogStats } from "@/lib/marketing/catalog-stats"
import { marketingMasterImages } from "@/lib/marketing-images"
import { getBook } from "@/lib/content"

export const metadata: Metadata = {
  title: { absolute: "Pricing | Tome" },
  description:
    "Tome is free for teachers. Classroom seats are priced per student, schools get volume pricing, and homeschool families have the Family plan.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    url: "/pricing",
    title: "Pricing | Tome",
    description: "Free for teachers. Per-student seats for classrooms and schools.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Tome",
    description: "Free for teachers. Per-student seats for classrooms and schools.",
    images: ["/og-image.png"],
  },
}

/** Contextual line shown when a server paywall redirected the reader here. */
function gateMessage(gate: string | undefined, book: string | undefined): string | null {
  switch (gate) {
    case "book": {
      const title = book ? getBook(book)?.title : undefined
      return title
        ? `${title} is beyond the free sampler. Teachers read everything free — or join through your school.`
        : "That book is beyond the free sampler. Teachers read everything free — or join through your school."
    }
    case "virgil":
      return "You've reached today's free Tome Assistant limit."
    default:
      return null
  }
}

/** Build serializable cards from the canonical tier table (single source). */
function toCards(): BillingPlanCard[] {
  return getMarketingTiers().map((plan) => ({
    tier: plan.tier,
    name: plan.name,
    blurb: plan.blurb,
    featured: Boolean(plan.featured),
    badge: plan.badge,
    ctaLabel: plan.ctaLabel,
    ctaHref: plan.ctaHref,
    features: plan.features,
    checkoutTier:
      plan.seatCheckout && isPurchasableTier(plan.tier) ? plan.tier : null,
    price: plan.price,
    cadence: plan.cadence,
  }))
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ gate?: string; book?: string }>
}) {
  const { gate, book } = await searchParams
  const banner = gateMessage(gate, book)

  const cards = toCards()

  const stats = await getCatalogStats()
  const billingFaqs =
    getFaqCategories(stats)
      .find((category) => category.id === "billing")
      ?.items.slice(0, 5) ?? []

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-6 pb-24 pt-32 md:px-12">
        {banner ? (
          <div className="mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4">
            <Lock className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm font-medium text-foreground">{banner}</p>
          </div>
        ) : null}

        {/* Hero */}
        <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
              Free for teachers. Priced per student.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0">
              Teachers read the full library and use every classroom tool free.
              Classrooms pay per student seat, schools get volume pricing, and
              homeschool families have the{" "}
              <Link
                href="/homeschool"
                className="font-semibold text-primary hover:opacity-80"
              >
                Family plan
              </Link>
              .
            </p>
          </div>
          <figure className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <Image
              src={marketingMasterImages.pricing.src}
              alt={marketingMasterImages.pricing.alt}
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-center marketing-vibrant"
            />
            <figcaption className="absolute bottom-2 right-3 text-[11px] text-white/50">
              {marketingMasterImages.pricing.attribution}
            </figcaption>
          </figure>
        </section>

        {/* Plans */}
        <section className="mx-auto mt-16 max-w-5xl">
          <BillingPlans plans={cards} />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Need more Questions? {getTopupOffer().label} — available anytime
            from your account.
          </p>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Homeschooling?{" "}
            <Link
              href="/homeschool"
              className="font-semibold text-primary hover:opacity-80"
            >
              See the Family plan →
            </Link>
          </p>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Prices in USD, billed annually, cancel any time. Schools may pay by
            invoice or purchase order.
          </p>
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
