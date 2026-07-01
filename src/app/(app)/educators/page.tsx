import type { Metadata } from "next"
import { LandingStack } from "@/components/landing/LandingStack"
import { getCatalogStats } from "@/lib/marketing/catalog-stats"
import { CatalogStatsProvider } from "@/lib/marketing/catalog-stats-context"

export async function generateMetadata(): Promise<Metadata> {
  const title = "For Educators — Teach the classics with Tome"
  const description =
    "Bring guided reading to your classroom. Assign chapters and Trials, auto-grade comprehension, and track every student in a live gradebook — free for individual teachers."
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/educators" },
    openGraph: {
      type: "website",
      url: "/educators",
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

export default async function EducatorsPage() {
  const stats = await getCatalogStats()
  return (
    <CatalogStatsProvider value={stats}>
      <LandingStack defaultView="teacher" />
    </CatalogStatsProvider>
  )
}
