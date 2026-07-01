import type { Metadata } from "next"

// The quizzes index is a client component, so its metadata lives on the route
// segment's layout (linked from the marketing footer; needs its own SEO copy).
export const metadata: Metadata = {
  title: { absolute: "Quizzes & Trials — Test your reading on Tome" },
  description:
    "Tome's Trials check what you read — comprehension, vocabulary, critical thinking, and Virgil-graded reflections at the end of every chapter, so the great books actually stick.",
  alternates: { canonical: "/quizzes" },
  openGraph: {
    type: "website",
    url: "/quizzes",
    title: "Quizzes & Trials — Test your reading on Tome",
    description:
      "Comprehension, vocabulary, critical thinking, and Virgil-graded reflections at the end of every chapter.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizzes & Trials — Test your reading on Tome",
    description:
      "Comprehension, vocabulary, critical thinking, and Virgil-graded reflections at the end of every chapter.",
    images: ["/og-image.png"],
  },
}

export default function QuizzesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
