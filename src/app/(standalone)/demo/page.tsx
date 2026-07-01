import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { DemoRequestForm } from "./demo-request-form"

export const metadata: Metadata = {
  title: { absolute: "Book a demo — Tome for Schools" },
  description:
    "See how Tome brings the classics to your classroom. Tell us about your school and we'll set up a walkthrough.",
  alternates: { canonical: "/demo" },
}

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const { plan } = await searchParams

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main className="px-6 pb-24 pt-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-wide"
              style={{ color: "#C8A24B" }}
            >
              Tome for Schools
            </p>
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
              Book a demo
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              See how Tome brings three thousand years of literature into your
              classroom — with classrooms, a live gradebook, AI-assisted quizzes,
              and Virgil to guide every reader. Tell us about your school and
              we&apos;ll be in touch.
            </p>
          </header>

          <DemoRequestForm initialPlan={plan} />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Prefer email? Reach us at{" "}
            <a
              href="/contact"
              className="text-foreground underline underline-offset-2"
            >
              our contact page
            </a>
            .
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
