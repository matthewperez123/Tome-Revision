import type { MetadataRoute } from "next"
import { getBooks } from "@/lib/content"
import { AUTHORS, authorSlug } from "@/data/authors"
import { BOOKS } from "@/data/books"

// Absolute origin for sitemap entries. Mirrors the metadataBase logic in the
// root layout so URLs match the canonical host on Vercel.
const ORIGIN = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Public marketing + legal surfaces.
  const staticPaths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/readers", priority: 0.9, changeFrequency: "monthly" },
    { path: "/educators", priority: 0.9, changeFrequency: "monthly" },
    { path: "/virgil", priority: 0.8, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/library/browse", priority: 0.9, changeFrequency: "weekly" },
    { path: "/authors", priority: 0.7, changeFrequency: "weekly" },
    { path: "/quizzes", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/security", priority: 0.5, changeFrequency: "monthly" },
    { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${ORIGIN}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  // Every public book detail page.
  const bookEntries: MetadataRoute.Sitemap = getBooks().map((book) => ({
    url: `${ORIGIN}/book/${book.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  // Author detail pages: curated author ids plus every author slug derived from
  // the catalog (matches the author route's generateStaticParams).
  const authorIds = new Set<string>()
  for (const a of AUTHORS) authorIds.add(a.id)
  for (const b of BOOKS) if (b.author) authorIds.add(authorSlug(b.author))
  const authorEntries: MetadataRoute.Sitemap = [...authorIds].map((id) => ({
    url: `${ORIGIN}/author/${id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [...staticEntries, ...bookEntries, ...authorEntries]
}
