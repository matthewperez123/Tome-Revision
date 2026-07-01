import type { Metadata } from "next"

// The authors index is a client component, so its metadata lives on the route
// segment's layout (linked from the marketing footer; needs its own SEO copy).
export const metadata: Metadata = {
  title: { absolute: "Authors — The writers of the canon on Tome" },
  description:
    "Browse the authors of the world's canon on Tome — from Homer and Dante to Austen, Dostoevsky, and Woolf — with biographies and their complete works to read free.",
  alternates: { canonical: "/authors" },
  openGraph: {
    type: "website",
    url: "/authors",
    title: "Authors — The writers of the canon on Tome",
    description:
      "Browse the authors of the world's canon — biographies and complete works to read free on Tome.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Authors — The writers of the canon on Tome",
    description:
      "Browse the authors of the world's canon — biographies and complete works to read free on Tome.",
    images: ["/og-image.png"],
  },
}

export default function AuthorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
