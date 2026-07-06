"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ChevronDown, BookOpen, GraduationCap } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { HomeHub } from "@/components/landing/home/HomeHub"

const heroGlassButton =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20 hover:scale-[1.03]"

export function AboutPage() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/paintings/barque-of-dante.jpg"
          alt="The Barque of Dante by Eugène Delacroix, 1822"
          fill
          priority
          className="object-cover object-center"
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 30%, transparent 60%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:px-12 md:pb-20 flex flex-col items-center text-center">
          <BlurFade delay={0.1} inView>
            <h1 className="font-[var(--font-display)] text-[32px] md:text-[56px] font-bold text-white max-w-3xl leading-[1.08] tracking-tight">
              We are in a reading crisis.
            </h1>
          </BlurFade>
          <BlurFade delay={0.2} inView>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
              Reading rates are at historic lows. A generation is losing the
              canon. Tome is how we win it back.
            </p>
          </BlurFade>
          <BlurFade delay={0.3} inView>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/readers" className={heroGlassButton}>
                <BookOpen className="size-4" />
                For Readers
              </Link>
              <Link href="/educators" className={heroGlassButton}>
                <GraduationCap className="size-4" />
                For Educators
              </Link>
            </div>
          </BlurFade>
        </div>

        <p className="absolute bottom-4 right-6 text-[11px] text-white/40">
          Eugène Delacroix · The Barque of Dante · 1822
        </p>

        <motion.div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40"
          animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-6" />
        </motion.div>
      </section>

      {/* ── OVERVIEW HUB (8 condensed teasers → deep pages) ───────── */}
      <HomeHub />

      <LandingFooter />
    </div>
  )
}
