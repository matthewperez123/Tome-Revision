import type { Metadata } from "next"
import { LibraryBrowseClient } from "./library-browse-client"

export const metadata: Metadata = {
  title: { absolute: "The Library — 1,200+ classics to read free on Tome" },
  description:
    "Browse Tome's full catalog of public-domain classics across 16 literary traditions — from Homer to the Russian novel — with AI-guided reading, quizzes, and progress tracking.",
  alternates: { canonical: "/library/browse" },
  openGraph: {
    title: "The Library — Read the books that shaped the world",
    description:
      "Browse 1,200+ public-domain classics across 16 literary traditions on Tome.",
    url: "/library/browse",
    images: [{ url: "/og-image.png" }],
  },
}

export default function LibraryBrowsePage() {
  return <LibraryBrowseClient />
}
