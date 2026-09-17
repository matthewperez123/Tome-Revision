import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { VirgilLanding } from "@/components/landing/virgil/VirgilLanding"
import { VirgilShowcase } from "@/components/virgil/VirgilShowcase"

export const metadata: Metadata = {
  title: { absolute: "Tome Assistant: Your AI Scholar | Tome" },
  description:
    "Meet the Tome Assistant, the AI scholar inside Tome. It annotates the text as you read, offers scaffolded hints during Trials, and explains any passage on request.",
  alternates: { canonical: "/assistant" },
  openGraph: {
    type: "website",
    url: "/assistant",
    title: "Tome Assistant: Your AI Scholar | Tome",
    description:
      "Annotations in the margin, hints during quizzes, and help with any passage. A scholar at your side, grounded in the text.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tome Assistant: Your AI Scholar | Tome",
    description:
      "Annotations in the margin, hints during quizzes, and help with any passage. A scholar at your side, grounded in the text.",
    images: ["/og-image.png"],
  },
}

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-6 pb-12 pt-32 md:px-12 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <VirgilShowcase />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="size-3.5" />
            Meet the Assistant
          </span>
          <h1 className="mt-5 font-[var(--font-display)] text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-6xl">
            A scholar at your side, line by line.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The Tome Assistant reads alongside you, marking what matters, answering what you
            ask, and nudging when you&apos;re stuck. Grounded in the text, never a
            tab away.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start reading with the Assistant
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/readers"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              See the reader
            </Link>
          </div>
        </div>
      </section>

      <VirgilLanding />

      <LandingFooter />
    </div>
  )
}
