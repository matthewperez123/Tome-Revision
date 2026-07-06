import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MessageCircle, GraduationCap } from "lucide-react"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support"

export const metadata: Metadata = {
  title: { absolute: "Contact — Tome" },
  description:
    "Get in touch with the Tome team for support, billing questions, or school pilots.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-6 pb-24 pt-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          <header className="mb-12 text-center">
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
              Get in touch
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              We&apos;d love to hear from you. Whether you have a question about
              your account, need help with billing, or want to bring Tome to your
              school, here&apos;s how to reach us.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={SUPPORT_MAILTO}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Mail className="size-6 text-primary" />
              <h2 className="mt-3 font-[var(--font-display)] text-lg font-bold text-foreground">
                Email support
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Questions about your account, reading, or anything else.
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-primary group-hover:underline">
                {SUPPORT_EMAIL}
              </span>
            </a>

            <a
              href={SUPPORT_MAILTO}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MessageCircle className="size-6 text-primary" />
              <h2 className="mt-3 font-[var(--font-display)] text-lg font-bold text-foreground">
                Billing &amp; subscriptions
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Help with plans, payments, refunds, or cancellations.
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-primary group-hover:underline">
                Contact billing
              </span>
            </a>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-muted p-6 sm:p-8">
            <GraduationCap className="size-6 text-primary" />
            <h2 className="mt-3 font-[var(--font-display)] text-lg font-bold text-foreground">
              For schools and educators
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Interested in a classroom or school-wide pilot? Tell us about your
              school and we&apos;ll help you get set up.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/educators"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Explore Tome for Teachers
              </Link>
              <a
                href={SUPPORT_MAILTO}
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Email us about a pilot
              </a>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Looking for quick answers? Check the{" "}
            <Link href="/faq" className="text-foreground underline underline-offset-2">
              FAQ
            </Link>
            .
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
