import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { SUPPORT_EMAIL } from "@/lib/support"

/*
 * ⚠️ LEGAL REVIEW REQUIRED BEFORE LAUNCH.
 * This Privacy & Security for Schools summary describes how Tome handles
 * student data. It is a plain-language summary for school evaluators, NOT a
 * contract, and has NOT been reviewed by counsel. Before relying on it for a
 * school agreement you must have a lawyer confirm: the FERPA "school official"
 * posture, COPPA school-consent posture, state student-privacy laws (e.g.
 * California SOPIPA, the SDPC/national DPA template), the sub-processor list,
 * actual retention/deletion timelines, and any security claims. The Data
 * Processing Addendum (DPA) referenced here is a PLACEHOLDER and does not yet
 * exist as an executable document — see the checklist.
 */

export const metadata: Metadata = {
  title: { absolute: "Privacy & Security for Schools — Tome" },
  description:
    "How Tome handles student data: what we collect, our sub-processors, FERPA- and COPPA-aligned practices, data deletion, and a Data Processing Addendum for schools.",
  alternates: { canonical: "/security" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/security",
    title: "Privacy & Security for Schools — Tome",
    description:
      "How Tome handles student data — sub-processors, FERPA/COPPA-aligned practices, deletion, and a DPA for schools.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy & Security for Schools — Tome",
    description:
      "How Tome handles student data — sub-processors, FERPA/COPPA-aligned practices, deletion, and a DPA for schools.",
    images: ["/og-image.png"],
  },
}

const LAST_UPDATED = "June 30, 2026"

/** Sub-processors Tome relies on, kept honest with the actual stack. */
const SUBPROCESSORS = [
  {
    name: "Supabase",
    purpose: "Database, authentication, and application hosting",
    data: "Account details, reading progress, quiz results, classroom data",
  },
  {
    name: "Vercel",
    purpose: "Web application hosting and content delivery",
    data: "Request and log data needed to serve the app",
  },
  {
    name: "Stripe",
    purpose: "Subscription and payment processing",
    data: "Billing contact and payment details (card data handled by Stripe)",
  },
  {
    name: "Resend",
    purpose: "Transactional email (account, billing, and classroom notices)",
    data: "Recipient email address and message contents",
  },
  {
    name: "Anthropic",
    purpose: "Powers Virgil's annotations, answers, and reflection grading",
    data: "The passage and prompt text sent for a given request",
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-6 pb-24 pt-32 md:px-12">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="size-3.5" />
              For Schools
            </span>
            <h1 className="mt-5 font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
              Privacy &amp; Security for Schools
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated {LAST_UPDATED}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              A plain-language summary of how Tome handles student data for
              teachers, schools, and districts evaluating the platform. For the
              full legal terms, see our{" "}
              <a
                href="/privacy"
                className="text-foreground underline underline-offset-2"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                className="text-foreground underline underline-offset-2"
              >
                Terms of Service
              </a>
              .
            </p>
          </header>

          {/* Honest status banner — this is a summary, not yet a signed agreement. */}
          <div className="mb-12 rounded-lg border border-amber-500/40 bg-amber-500/5 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Pilot status.</strong> This page
            summarizes our current practices. A countersigned Data Processing
            Addendum (DPA) is available on request for schools and districts that
            require one before a pilot. Email{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-foreground underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </div>

          <div className="space-y-10 font-[var(--font-serif)] text-[15px] leading-relaxed text-muted-foreground [&_h2]:font-[var(--font-display)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-3 [&_h2]:font-[family-name:var(--font-display)] [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2">
            <section>
              <h2>What student data we collect</h2>
              <p>
                When a student uses Tome under a teacher or school, we collect
                only what the product needs to work:
              </p>
              <ul>
                <li>
                  <strong>Account basics</strong> — a display name and the email
                  or join code used to enter a class. Students typically join
                  with a teacher&apos;s class code rather than providing personal
                  contact details.
                </li>
                <li>
                  <strong>Learning activity</strong> — reading progress, quiz
                  (Trial) results, written reflections, annotations, Wisdom,
                  streaks, and Seals.
                </li>
                <li>
                  <strong>Technical data</strong> — standard device, browser, and
                  log data needed to operate and secure the service.
                </li>
              </ul>
              <p>
                We do not require or request sensitive categories of personal
                information from students, and we do not build advertising
                profiles.
              </p>
            </section>

            <section>
              <h2>How we use and store it</h2>
              <p>
                Student data is used only to provide and improve the reading
                experience for that student and to give their teacher the
                gradebook and progress views. When a school directs the use of
                Tome, we act as a service provider / school official under the
                school&apos;s direction and process student data on its behalf.
              </p>
              <p>
                Data is stored with our hosting and database provider (see
                sub-processors below). We use reasonable administrative,
                technical, and physical safeguards, including encryption in
                transit and access controls. No system is perfectly secure, and
                we do not claim it is.
              </p>
            </section>

            <section>
              <h2>We never sell student data</h2>
              <p>
                We do not sell student personal information, we do not share it
                for targeted advertising, and we do not use it to build
                advertising profiles. Student data is used to deliver the
                educational service — nothing else.
              </p>
            </section>

            <section>
              <h2>Sub-processors</h2>
              <p>
                Tome relies on a small number of vetted vendors to operate. Each
                processes data under its own contractual security and
                confidentiality obligations:
              </p>
              <div className="not-prose overflow-hidden rounded-lg border border-border">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 font-[var(--font-sans)] text-foreground">
                      <th className="px-4 py-2.5 font-semibold">Provider</th>
                      <th className="px-4 py-2.5 font-semibold">Purpose</th>
                      <th className="px-4 py-2.5 font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUBPROCESSORS.map((sp) => (
                      <tr
                        key={sp.name}
                        className="border-b border-border last:border-0 align-top"
                      >
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {sp.name}
                        </td>
                        <td className="px-4 py-3">{sp.purpose}</td>
                        <td className="px-4 py-3">{sp.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm">
                We will update this list as our sub-processors change. Schools
                with notification requirements can request advance notice in
                their DPA.
              </p>
            </section>

            <section>
              <h2>Parent &amp; teacher consent</h2>
              <p>
                Where COPPA or a school&apos;s policy requires consent for
                students under 13, Tome supports the school-consent model: the
                school or district provides the required consent on behalf of
                parents for educational use, consistent with FTC guidance.
                Schools remain responsible for obtaining any consents required by
                their own policies and applicable law. Parents may contact their
                school, or reach us directly, with questions about their
                child&apos;s data.
              </p>
            </section>

            <section>
              <h2>Data deletion &amp; retention</h2>
              <p>
                We retain student data while the account is active and the school
                is using Tome. A teacher can remove a student from a class, and a
                school can request deletion of its students&apos; data at the end
                of a term or engagement. Account holders may also request
                deletion of their own account at any time. On a verified deletion
                request, we delete or de-identify the relevant data within a
                commercially reasonable period, except where we must retain
                limited records to meet legal obligations.
              </p>
              <p>
                To make a deletion request, email{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
              </p>
            </section>

            <section>
              <h2>Data Processing Addendum (DPA)</h2>
              <p>
                For schools and districts that require a signed agreement before
                a pilot, a Data Processing Addendum covering FERPA/COPPA roles,
                data handling, sub-processors, breach notification, and deletion
                is available on request.
              </p>
              <p className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm">
                <strong className="text-foreground">DPA — coming soon.</strong>{" "}
                Our standard DPA template is being finalized with counsel. To
                request the current draft or to have us review your district&apos;s
                DPA, email{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
              </p>
            </section>

            <section>
              <h2>Questions</h2>
              <p>
                Evaluating Tome for your school? Email us at{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or{" "}
                <a href="/demo">book a demo</a> and we&apos;ll walk your team
                through data handling and set up a pilot.
              </p>
            </section>
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
