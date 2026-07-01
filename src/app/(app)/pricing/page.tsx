import { Suspense } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { PricingView } from "@/components/pricing/PricingView"
import { getFaqCategories } from "@/lib/faqs"
import { getCatalogStats } from "@/lib/marketing/catalog-stats"
import { CatalogStatsProvider } from "@/lib/marketing/catalog-stats-context"
import { marketingMasterImages } from "@/lib/marketing-images"
import { getBook } from "@/lib/content"

export const metadata: Metadata = {
  title: { absolute: "Pricing — Tome" },
  description:
    "Tome plans for readers and educators. Read the canon free forever, go deeper with Solo or Family, or bring guided reading to your classroom, school, or district.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    url: "/pricing",
    title: "Pricing — Tome",
    description:
      "Plans for readers and educators — Free, Solo, and Family for readers; Classroom, School, and District for educators.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Tome",
    description:
      "Plans for readers and educators — Free, Solo, and Family for readers; Classroom, School, and District for educators.",
    images: ["/og-image.png"],
  },
}

/** Contextual line shown when a server paywall redirected the reader here. */
function gateMessage(gate: string | undefined, book: string | undefined): string | null {
  switch (gate) {
    case "book": {
      const title = book ? getBook(book)?.title : undefined
      return title
        ? `${title} is part of Tome Solo. Subscribe to keep reading the full library.`
        : "That book is part of Tome Solo. Subscribe to read the full library."
    }
    case "virgil":
      return "You've reached today's free Virgil limit. Upgrade for unlimited conversations."
    case "advanced-trials":
      return "Scholar and Master Trials are part of Tome Solo. Upgrade to take advanced Trials."
    default:
      return null
  }
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ gate?: string; book?: string }>
}) {
  const { gate, book } = await searchParams
  const banner = gateMessage(gate, book)

  const stats = await getCatalogStats()
  const billingFaqs =
    getFaqCategories(stats)
      .find((category) => category.id === "billing")
      ?.items.slice(0, 3) ?? []

  return (
    <CatalogStatsProvider value={stats}>
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

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
              Read the canon. Choose how you go deeper.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0">
              Start free and stay free forever, or unlock the full library and
              Virgil&apos;s deeper scholarship when you&apos;re ready.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <Image
              src={marketingMasterImages.pricing.src}
              alt={marketingMasterImages.pricing.alt}
              width={marketingMasterImages.pricing.width}
              height={marketingMasterImages.pricing.height}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
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
    </CatalogStatsProvider>
  )
}
