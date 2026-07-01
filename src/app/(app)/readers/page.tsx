import type { Metadata } from "next"
import { LandingStack } from "@/components/landing/LandingStack"
import { formatBookCount, getCatalogStats } from "@/lib/marketing/catalog-stats"
import { CatalogStatsProvider } from "@/lib/marketing/catalog-stats-context"

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getCatalogStats()
  const title = "For Readers — Guided reading of the classics on Tome"
  const description = `Read ${formatBookCount(
    stats.bookCount,
  )} unabridged classics with Virgil, an AI scholar in the margin. Answer Trials, earn Seals, keep a daily Flame, and finally finish the hard books — start free.`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/readers" },
    openGraph: {
      type: "website",
      url: "/readers",
      title,
      description,
      images: [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  }
}

export default async function ReadersPage() {
  const stats = await getCatalogStats()
  return (
    <CatalogStatsProvider value={stats}>
      <LandingStack defaultView="reader" />
    </CatalogStatsProvider>
  )
}
