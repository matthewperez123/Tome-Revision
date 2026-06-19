"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Safari } from "@/components/ui/safari"
import { CANONICAL_BOOK_COUNT } from "@/lib/pricing"

const ExploreDemoLoop = dynamic(
  () => import("./demos/ExploreDemoLoop").then((m) => ({ default: m.ExploreDemoLoop })),
  { ssr: false }
)

export function ExploreSection() {
  return (
    <section id="explore" className="py-24 px-6 md:px-12" style={{ background: "#1E1B2E" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 items-center">
        {/* Left: Text */}
        <div>
          <BlurFade delay={0.1} inView>
            <p className="text-xs text-[#6366F1] uppercase tracking-[0.15em] font-semibold mb-3">
              Explore the World
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[#FAF7F2] mb-4">
              36 traditions. Every continent.
            </h2>
            <p className="text-sm text-[#C4BFB6] leading-relaxed mb-6 max-w-sm">
              From ancient Greece to modern Japan &mdash; explore {CANONICAL_BOOK_COUNT} books by region, era, and tradition. Click any country to discover its authors.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#E0C060] transition-colors font-semibold"
            >
              Explore the Map <ArrowRight className="size-4" />
            </Link>
          </BlurFade>
        </div>

        {/* Right: Explore Demo in Safari frame */}
        <BlurFade delay={0.2} inView>
          <Safari mode="simple" url="tome.app/explore">
            <ExploreDemoLoop />
          </Safari>
        </BlurFade>
      </div>
    </section>
  )
}
