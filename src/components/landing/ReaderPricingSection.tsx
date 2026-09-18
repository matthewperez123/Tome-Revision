"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

// Readers don't buy Tome — access comes through a school, a classroom, or the
// Family plan. This section routes each audience to the right door.
export function ReaderPricingSection() {
  return (
    <section className="bg-muted py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <BlurFade delay={0.1} inView>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-4">
            Reading on Tome is free
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Teachers and students read free through their school — ask your
            teacher for a class code, or start a classroom free.
          </p>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup?as=teacher"
              className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Start a classroom free
            </Link>
            <Link
              href="/homeschool"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:opacity-80"
            >
              Homeschooling? See the Family plan{" "}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
