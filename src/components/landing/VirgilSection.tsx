"use client"

import {
  Bookmark, Languages, GitBranch, HelpCircle, FileText,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { AnimatedVirgil } from "./mockups/AnimatedVirgil"

const CAPABILITIES = [
  { icon: Bookmark, label: "Annotations", desc: "Scholarly footnotes that appear as you read" },
  { icon: Languages, label: "Vocabulary", desc: "Ancient and archaic words explained in context" },
  { icon: GitBranch, label: "Connections", desc: "Links between texts, traditions, and ideas" },
  { icon: HelpCircle, label: "Socratic Mode", desc: "Ask Virgil anything about the text" },
  { icon: FileText, label: "Summaries", desc: "Chapter and section recaps when you need them" },
]

export function VirgilSection() {
  return (
    <section className="bg-[#0A0A0A] py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <BlurFade delay={0.1} inView>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center text-[#FAF7F2] mb-10">
            Your guide through the canon.
          </h2>
        </BlurFade>

        {/* Capability cards — horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-10 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {CAPABILITIES.map((cap, i) => (
            <BlurFade key={cap.label} delay={0.15 + i * 0.05} inView>
              <div className="min-w-[160px] snap-start rounded-xl bg-[#161616] border border-[rgba(255,255,255,0.06)] p-4 flex flex-col items-center text-center">
                <cap.icon className="size-5 text-[#D4AF37] mb-2" />
                <h4 className="font-semibold text-[#FAF7F2] text-sm">{cap.label}</h4>
                <p className="text-xs text-[#7A756D] mt-1 leading-relaxed">{cap.desc}</p>
              </div>
            </BlurFade>
          ))}
        </div>

        {/* Animated Virgil Mockup */}
        <div className="max-w-[800px] mx-auto">
          <BlurFade delay={0.3} inView>
            <AnimatedVirgil />
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
