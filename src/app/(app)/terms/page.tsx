import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { SUPPORT_EMAIL } from "@/lib/support"

/*
 * ⚠️ LEGAL REVIEW REQUIRED BEFORE LAUNCH.
 * These Terms of Service are a standard SaaS template for a US-based ed-tech
 * product with paid subscriptions billed through Stripe and stored user
 * accounts. They have NOT been reviewed by counsel. Before going live you must
 * have a lawyer confirm: subscription/auto-renewal and refund terms, the
 * governing-law/arbitration clause, limitation of liability and warranty
 * disclaimers, school/district contracting, and consumer-protection
 * disclosures (e.g. automatic-renewal laws). Replace the placeholder company
 * name, governing-law jurisdiction, and effective date.
 */

export const metadata: Metadata = {
  title: { absolute: "Terms of Service — Tome" },
  description:
    "The terms that govern your use of Tome, including subscriptions, billing, and acceptable use.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
}

const EFFECTIVE_DATE = "June 29, 2026"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main className="px-6 pb-24 pt-32 md:px-12">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Effective {EFFECTIVE_DATE}
            </p>
          </header>

          <div className="space-y-10 font-[var(--font-serif)] text-[15px] leading-relaxed text-muted-foreground [&_h2]:font-[var(--font-display)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2">
            <section>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access
                to and use of Tome (&ldquo;Tome,&rdquo; &ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;), an online platform for
                reading and studying literature. By creating an account or using
                the service, you agree to these Terms. If you do not agree, do
                not use Tome.
              </p>
            </section>

            <section>
              <h2>1. Eligibility and Accounts</h2>
              <p>
                You must be able to form a binding contract to use Tome, or use
                it under the supervision of a parent, guardian, school, or
                teacher. You are responsible for the accuracy of your account
                information and for keeping your credentials secure. You are
                responsible for all activity under your account.
              </p>
            </section>

            <section>
              <h2>2. Subscriptions and Billing</h2>
              <ul>
                <li>
                  Paid plans are billed in advance on a recurring basis (monthly
                  or annually) through our payment processor, Stripe.
                </li>
                <li>
                  Unless you cancel before the end of the current billing period,
                  your subscription automatically renews and the applicable fee
                  is charged to your payment method.
                </li>
                <li>
                  You can cancel at any time from your account settings.
                  Cancellation takes effect at the end of the current billing
                  period; you retain access until then.
                </li>
                <li>
                  Fees are stated exclusive of taxes, which we may add where
                  required. Prices may change with notice for future billing
                  periods.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. Refunds</h2>
              <p>
                Except where required by law, payments are non-refundable and
                there are no refunds or credits for partially used periods. If
                you believe you were charged in error, contact us and we will
                review your request.
              </p>
            </section>

            <section>
              <h2>4. Free Trials</h2>
              <p>
                We may offer free trials. Unless you cancel before the trial
                ends, you will be charged the applicable subscription fee when
                the trial period expires.
              </p>
            </section>

            <section>
              <h2>5. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Violate any law or the rights of others;</li>
                <li>
                  Share, resell, or provide unauthorized access to your account;
                </li>
                <li>
                  Scrape, copy, or redistribute content except as permitted by
                  applicable public-domain status or by us in writing;
                </li>
                <li>
                  Interfere with or disrupt the service or attempt to gain
                  unauthorized access to it.
                </li>
              </ul>
            </section>

            <section>
              <h2>6. Content and Intellectual Property</h2>
              <p>
                The literary texts on Tome are drawn from the public domain
                except where otherwise noted. Tome&apos;s software, design,
                annotations, quizzes, and other original materials are owned by
                us or our licensors and are protected by intellectual-property
                laws. We grant you a limited, non-exclusive, non-transferable
                license to use the service for its intended purpose.
              </p>
            </section>

            <section>
              <h2>7. Schools and Educators</h2>
              <p>
                If you use Tome on behalf of a school or organization, you
                represent that you are authorized to bind that organization to
                these Terms. Additional written agreements with schools or
                districts, where executed, govern in case of conflict.
              </p>
            </section>

            <section>
              <h2>8. Disclaimers</h2>
              <p>
                The service is provided &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; without warranties of any kind, whether express
                or implied, including merchantability, fitness for a particular
                purpose, and non-infringement, to the fullest extent permitted
                by law.
              </p>
            </section>

            <section>
              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Tome will not be liable
                for any indirect, incidental, special, consequential, or
                punitive damages, or for any loss of data, revenue, or profits.
                Our total liability for any claim relating to the service will
                not exceed the amount you paid us in the twelve months before the
                claim.
              </p>
            </section>

            <section>
              <h2>10. Termination</h2>
              <p>
                You may stop using Tome at any time. We may suspend or terminate
                your access if you violate these Terms or to protect the service.
                Sections that by their nature should survive termination will
                survive.
              </p>
            </section>

            <section>
              <h2>11. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the United States and the
                state in which Tome is established, without regard to conflict-of-
                law rules. Disputes will be resolved in the courts located in that
                jurisdiction, except where applicable law provides otherwise.
              </p>
            </section>

            <section>
              <h2>12. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. We will post the
                updated version with a new effective date and, where appropriate,
                notify you. Your continued use after changes take effect
                constitutes acceptance.
              </p>
            </section>

            <section>
              <h2>13. Contact Us</h2>
              <p>
                Questions about these Terms? Email us at{" "}
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
