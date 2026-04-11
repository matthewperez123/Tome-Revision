"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { HeroCTA } from "./HeroCTA"

export function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -180])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src="/paintings/creation-of-adam.jpg"
          alt="The Creation of Adam by Michelangelo, c.1512"
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
            "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 30%, transparent 60%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:px-12 md:pb-20 flex flex-col items-center text-center">
        <BlurFade delay={0.1} inView>
          <h1 className="font-[var(--font-display)] text-[32px] md:text-[56px] font-bold text-[#FAF7F2] max-w-3xl leading-[1.08] tracking-tight">
            Read the books that shaped the world.
          </h1>
        </BlurFade>
        <BlurFade delay={0.3} inView>
          <div className="mt-6">
            <HeroCTA />
          </div>
        </BlurFade>
        <BlurFade delay={0.4} inView>
          <p className="mt-4 text-sm text-[#7A756D]">
            Free to browse. No credit card.
          </p>
        </BlurFade>
      </div>
      <p className="absolute bottom-4 right-6 text-[11px] text-[#7A756D]/40">
        Michelangelo, The Creation of Adam, c.1512
      </p>
    </section>
  )
}
