import type { Metadata } from "next"
import {
  catalogSummary,
  formatBookCount,
  formatTraditionCount,
  getCatalogStats,
} from "@/lib/marketing/catalog-stats"
import { LibraryBrowseClient } from "./library-browse-client"

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getCatalogStats()
  const title = `The Library — ${formatBookCount(
    stats.bookCount,
  )} classics to read free on Tome`
  const description = `Browse Tome's full catalog of public-domain classics across ${formatTraditionCount(
    stats.traditionCount,
  )} — from Homer to the Russian novel — with AI-guided reading, quizzes, and progress tracking.`
  const ogDescription = `Browse ${catalogSummary(stats)} on Tome.`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/library/browse" },
    openGraph: {
      type: "website",
      url: "/library/browse",
      title: "The Library — Read the books that shaped the world",
      description: ogDescription,
      images: [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Library — Read the books that shaped the world",
      description: ogDescription,
      images: ["/og-image.png"],
    },
  }
}

export default function LibraryBrowsePage() {
  return <LibraryBrowseClient />
}
