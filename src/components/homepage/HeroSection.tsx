"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Safari } from "@/components/ui/safari"
import { HomepageLogo } from "./HomepageLogo"
import { HeroCTA } from "@/components/landing/HeroCTA"

const ReaderDemoLoop = dynamic(
  () => import("./demos/ReaderDemoLoop").then((m) => ({ default: m.ReaderDemoLoop })),
  { ssr: false }
)

export function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -180])

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      {/* Background painting */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src="/paintings/ulysses-deriding-polyphemus.jpg"
          alt="Ulysses Deriding Polyphemus by J.M.W. Turner, 1829"
          fill
          priority
          className="object-cover object-center scale-110"
          unoptimized
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%), linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20">
        {/* Logo */}
        <BlurFade delay={0.1} inView>
          <HomepageLogo />
        </BlurFade>

        <div className="mt-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text */}
          <div className="flex-1 max-w-xl">
            <BlurFade delay={0.2} inView>
              <h1 className="font-[var(--font-display)] text-[40px] md:text-[64px] font-bold text-white leading-[1.05] tracking-tight">
                The great books, guided by AI.
              </h1>
            </BlurFade>
            <BlurFade delay={0.35} inView>
              <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-md">
                One thousand canonical works. Two thousand years of literature. One AI scholar who knows them all.
              </p>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <div className="mt-8 flex items-center gap-4">
                <HeroCTA />
                <Link
                  href="#explore"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Watch Demo
                </Link>
              </div>
            </BlurFade>
          </div>

          {/* Right: Reader Demo in Safari frame */}
          <div className="flex-1 w-full max-w-lg hidden lg:block">
            <BlurFade delay={0.4} inView>
              <div className="transform rotate-1">
                <Safari mode="simple" url="tome.app/read/the-odyssey">
                  <ReaderDemoLoop />
                </Safari>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>

      {/* Painting credit */}
      <p className="absolute bottom-4 right-6 text-[11px] text-white/30 z-10">
        J.M.W. Turner, Ulysses Deriding Polyphemus, 1829
      </p>
    </section>
  )
}
