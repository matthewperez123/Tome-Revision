"use client"

import {
  BookOpen, Sparkles, Brain, Trophy, Globe2,
  GraduationCap, Palette, MessageSquareText, Route,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

const FEATURES = [
  { icon: BookOpen, label: "Full Texts", desc: "Read complete works from Homer to Hemingway, not summaries." },
  { icon: Sparkles, label: "Virgil AI Tutor", desc: "An AI companion trained in classical scholarship." },
  { icon: Brain, label: "Adaptive Trials", desc: "Quizzes that match your level \u2014 Apprentice, Scholar, or Master." },
  { icon: Trophy, label: "Gamified Progress", desc: "Earn Wisdom, maintain Flames, collect Seals." },
  { icon: Globe2, label: "World Map", desc: "Explore 36 literary traditions across every continent." },
  { icon: GraduationCap, label: "Classrooms", desc: "Teachers assign books, track reading, build quizzes." },
  { icon: Palette, label: "Painting Covers", desc: "Every book dressed in museum-quality public domain art." },
  { icon: MessageSquareText, label: "Annotations", desc: "Virgil highlights what matters as you read." },
  { icon: Route, label: "Reading Paths", desc: "Curated journeys through traditions, themes, and eras." },
]

export function FeatureGrid() {
  return (
    <section className="bg-[#161616] py-24 px-6 md:px-12">
      <BlurFade delay={0.1} inView>
        <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-center text-[#FAF7F2] mb-4">
          A Complete Literary Education
        </h2>
        <p className="text-center text-sm text-[#7A756D] mb-12 max-w-lg mx-auto">
          Everything you need to read, understand, and master the canon.
        </p>
      </BlurFade>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((feat, i) => (
          <BlurFade key={feat.label} delay={0.05 + i * 0.04} inView>
            <div className="rounded-xl bg-[#161616] border border-[rgba(255,255,255,0.06)] p-8 hover:bg-[#1E1E1E] hover:-translate-y-0.5 transition-all duration-200">
              <feat.icon className="size-6 text-[#D4AF37] mb-4" />
              <h3 className="font-[var(--font-display)] font-semibold text-[#FAF7F2] text-lg">
                {feat.label}
              </h3>
              <p className="text-sm text-[#7A756D] mt-2 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}
