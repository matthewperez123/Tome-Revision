"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { HeroCTA } from "./HeroCTA"
import { useAudience } from "@/contexts/AudienceContext"

const HERO_VARIANTS = {
  reader: {
    src: "/paintings/creation-of-adam.jpg",
    alt: "The Creation of Adam by Michelangelo, c.1512",
    attribution: "Michelangelo, The Creation of Adam, c.1512",
    headline: "Read the books that shaped the world.",
    subcopy:
      "Explore the canon of world literature with an AI scholar at your side. Annotations, quizzes, and progress tracking \u2014 all in your browser.",
  },
  teacher: {
    src: "/paintings/school-of-athens.jpg",
    alt: "The School of Athens by Raphael, c.1511",
    attribution: "Raphael, The School of Athens, c.1511",
    headline: "A scholar for every student",
    subcopy:
      "Bring the canon of world literature into your classroom. Tome handles the reading, the annotations, the quizzes, and the grading \u2014 so you can focus on the conversation.",
  },
} as const

export function HeroSection() {
  const { audience } = useAudience()
  const v = HERO_VARIANTS[audience]

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={audience}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={v.src}
            alt={v.alt}
            fill
            loading="eager"
            fetchPriority="high"
            className="object-cover object-center"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

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
            {v.headline}
          </h1>
        </BlurFade>
        <BlurFade delay={0.2} inView>
          <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
            {v.subcopy}
          </p>
        </BlurFade>
        <BlurFade delay={0.3} inView>
          <div className="mt-6">
            <HeroCTA />
          </div>
        </BlurFade>
      </div>

      <p className="absolute bottom-4 right-6 text-[11px] text-white/25">
        {v.attribution}
      </p>
    </section>
  )
}
