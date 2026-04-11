"use client"

import { BookOpen, Palette, MessageCircle } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { AnimatedReader } from "./mockups/AnimatedReader"

const CALLOUTS = [
  { icon: BookOpen, label: "Dark mode, parchment mode, and light mode", desc: "Three themes tuned for extended reading sessions." },
  { icon: Palette, label: "Adjustable font size and line height", desc: "Customize your reading experience for any screen." },
  { icon: MessageCircle, label: "Resume exactly where you left off", desc: "Your position is saved across devices automatically." },
]

export function ReaderSection() {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 items-center">
        {/* Animated Reader Mockup */}
        <BlurFade delay={0.1} inView>
          <AnimatedReader />
        </BlurFade>

        {/* Callouts */}
        <div>
          <BlurFade delay={0.15} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-2">
              Read the originals.
            </h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-sm">
              No summaries. No abridgements. Complete texts beautifully typeset in Literata with Virgil&apos;s scholarly annotations appearing exactly when you need them.
            </p>
          </BlurFade>
          <div className="space-y-5">
            {CALLOUTS.map((item, i) => (
              <BlurFade key={item.label} delay={0.2 + i * 0.08} inView>
                <div className="flex gap-3 items-start">
                  <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{item.label}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
