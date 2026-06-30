import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { SUPPORT_EMAIL } from "@/lib/support"

/*
 * ⚠️ LEGAL REVIEW REQUIRED BEFORE LAUNCH.
 * This Privacy Policy is a standard SaaS template for a US-based ed-tech
 * product that stores user accounts and processes payments through Stripe.
 * It has NOT been reviewed by counsel. Before going live you must have a
 * lawyer confirm coverage of: COPPA/FERPA (we serve students and schools),
 * CCPA/CPRA, GDPR (if EU users), state privacy laws, Stripe's data-processing
 * terms, and your actual data flows. Replace the placeholder company name,
 * address, and effective date.
 */

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy — Tome" },
  description:
    "How Tome collects, uses, and protects your information when you use our reading platform.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
}

const EFFECTIVE_DATE = "June 29, 2026"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main className="px-6 pb-24 pt-32 md:px-12">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Effective {EFFECTIVE_DATE}
            </p>
          </header>

          <div className="space-y-10 font-[var(--font-serif)] text-[15px] leading-relaxed text-muted-foreground [&_h2]:font-[var(--font-display)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2">
            <section>
              <p>
                Tome (&ldquo;Tome,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) provides an online platform for reading and
                studying works of literature. This Privacy Policy explains what
                information we collect, how we use it, and the choices you have.
                By using Tome, you agree to the practices described here.
              </p>
            </section>

            <section>
              <h2>1. Information We Collect</h2>
              <p>We collect the following categories of information:</p>
              <ul>
                <li>
                  <strong>Account information.</strong> When you create an
                  account, we collect your name, email address, and a password
                  (stored in hashed form). Teachers and schools may provide
                  organization details.
                </li>
                <li>
                  <strong>Payment information.</strong> Subscription payments are
                  processed by our payment provider, Stripe. We do not store full
                  card numbers on our servers; Stripe handles card data under its
                  own terms. We retain limited billing records such as plan, last
                  four digits, and transaction history.
                </li>
                <li>
                  <strong>Usage data.</strong> Reading progress, quiz results,
                  achievements, streaks, and similar activity you generate while
                  using the product.
                </li>
                <li>
                  <strong>Technical data.</strong> Device, browser, IP address,
                  and log data collected automatically to operate and secure the
                  service.
                </li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>We use information to:</p>
              <ul>
                <li>Provide, maintain, and improve the service;</li>
                <li>Process subscriptions and payments through Stripe;</li>
                <li>Save your reading progress and personalize your experience;</li>
                <li>Communicate with you about your account and updates;</li>
                <li>Detect, prevent, and address fraud, abuse, and security issues;</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2>3. Students and Schools</h2>
              <p>
                Tome is used in educational settings. Where Tome is used by
                students under the direction of a school or teacher, we act as a
                service provider and process student data only to provide the
                service. We do not sell student personal information or use it
                for targeted advertising. Schools are responsible for obtaining
                any consents required under applicable law, including COPPA and
                FERPA.
              </p>
            </section>

            <section>
              <h2>4. How We Share Information</h2>
              <p>
                We do not sell your personal information. We share information
                only with:
              </p>
              <ul>
                <li>
                  <strong>Service providers</strong> who process data on our
                  behalf (for example, Stripe for payments and our hosting and
                  database providers) under contractual confidentiality and
                  security obligations;
                </li>
                <li>
                  <strong>Your school or teacher</strong>, where you use Tome as
                  part of a classroom;
                </li>
                <li>
                  <strong>Authorities</strong> when required by law or to protect
                  rights, safety, and security.
                </li>
              </ul>
            </section>

            <section>
              <h2>5. Data Retention</h2>
              <p>
                We retain personal information for as long as your account is
                active or as needed to provide the service, comply with legal
                obligations, resolve disputes, and enforce agreements. You may
                request deletion of your account at any time.
              </p>
            </section>

            <section>
              <h2>6. Security</h2>
              <p>
                We use reasonable administrative, technical, and physical
                safeguards to protect your information. No method of transmission
                or storage is completely secure, and we cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2>7. Your Rights and Choices</h2>
              <p>
                Depending on where you live, you may have rights to access,
                correct, delete, or port your personal information, and to opt
                out of certain processing. To exercise these rights, contact us
                using the details below. We will respond as required by
                applicable law.
              </p>
            </section>

            <section>
              <h2>8. Children&apos;s Privacy</h2>
              <p>
                Tome does not knowingly collect personal information from
                children under 13 outside of a school context with appropriate
                consent. If you believe a child has provided us information
                without authorization, contact us and we will take appropriate
                steps to delete it.
              </p>
            </section>

            <section>
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will post
                the updated version with a new effective date and, where
                appropriate, notify you.
              </p>
            </section>

            <section>
              <h2>10. Contact Us</h2>
              <p>
                Questions about this Privacy Policy? Email us at{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or visit
                our <a href="/contact">contact page</a>.
              </p>
            </section>
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
