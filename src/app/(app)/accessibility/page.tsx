import type { Metadata } from "next"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { SUPPORT_EMAIL } from "@/lib/support"

export const metadata: Metadata = {
  title: { absolute: "Accessibility — Tome" },
  description:
    "Tome's commitment to building an accessible reading platform, and how to report accessibility issues.",
  alternates: { canonical: "/accessibility" },
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-6 pb-24 pt-32 md:px-12">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-foreground md:text-5xl">
              Accessibility
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Reading should be open to everyone. We&apos;re committed to making
              Tome usable by as many people as possible, regardless of ability or
              technology.
            </p>
          </header>

          <div className="space-y-10 font-[var(--font-serif)] text-[15px] leading-relaxed text-muted-foreground [&_h2]:font-[var(--font-display)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2">
            <section>
              <h2>Our commitment</h2>
              <p>
                We aim to conform to the Web Content Accessibility Guidelines
                (WCAG) 2.1 Level AA. Accessibility is an ongoing effort, and we
                continually work to improve the experience for all of our
                readers.
              </p>
            </section>

            <section>
              <h2>What we&apos;ve built</h2>
              <ul>
                <li>Keyboard-navigable controls and visible focus states;</li>
                <li>Semantic, screen-reader-friendly markup and labels;</li>
                <li>
                  A reader with adjustable font size, line height, and a
                  high-contrast night theme;
                </li>
                <li>Respect for reduced-motion preferences;</li>
                <li>Color choices reviewed for sufficient contrast.</li>
              </ul>
            </section>

            <section>
              <h2>Known limitations</h2>
              <p>
                Some areas of the product are still being improved, and a few
                third-party components may not yet fully meet our standards. We
                treat accessibility issues as bugs and prioritize fixing them.
              </p>
            </section>

            <section>
              <h2>Reporting a problem</h2>
              <p>
                If you encounter an accessibility barrier on Tome, please tell us
                so we can fix it. Email{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the
                page, the issue, and the assistive technology you were using if
                applicable. We aim to respond promptly and will work with you to
                provide the information or functionality you need.
              </p>
            </section>
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
