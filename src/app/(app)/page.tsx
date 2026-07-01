import type { Metadata } from "next"
import { AboutPage } from "@/components/about/AboutPage"
import {
  formatBookCount,
  getCatalogStats,
} from "@/lib/marketing/catalog-stats"
import { CatalogStatsProvider } from "@/lib/marketing/catalog-stats-context"

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getCatalogStats()
  const description = `Tome is the gamified platform for the canon of world literature. Read ${formatBookCount(
    stats.bookCount,
  )} foundational works, answer Trials, earn Seals, and learn with Virgil, an AI scholar at your side.`
  const ogTitle = "Tome — Read the Canon of World Literature"
  const ogDescription =
    "Read the great books, answer Trials, earn Seals, and learn with Virgil — your AI scholar. For students, readers, and the classrooms that teach them."
  return {
    title: { absolute: ogTitle },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      title: ogTitle,
      description: ogDescription,
      images: [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ["/og-image.png"],
    },
  }
}

export default async function LandingPage() {
  const stats = await getCatalogStats()
  return (
    <CatalogStatsProvider value={stats}>
      <AboutPage />
    </CatalogStatsProvider>
  )
}
