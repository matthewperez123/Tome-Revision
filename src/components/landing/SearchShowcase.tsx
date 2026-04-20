"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Search } from "lucide-react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 400 },
  { name: "typing", duration: 1250 },
  { name: "results", duration: 1750 },
  { name: "filter", duration: 1250 },
  { name: "reset", duration: 350 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const CATEGORIES = [
  { label: "Books", result: "Love in the Time of Cholera", color: "#0EA5E9" },
  { label: "Authors", result: "Emily Brontë", color: "#A855F7" },
  { label: "Themes", result: "Unrequited love", color: "#F43F5E" },
  { label: "Periods", result: "Romantic Era", color: "#F59E0B" },
  { label: "Quotes", result: "\"Whatever our souls are made of...\"", color: "#22C55E" },
  { label: "Traditions", result: "Victorian Literature", color: "#6366F1" },
]

export function SearchShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const isTyping = phase === "typing" || phase === "results" || phase === "filter"
  const showResults = phase === "results" || phase === "filter"
  const showFilter = phase === "filter"

  const typedText = isTyping ? "love" : ""

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="Search the canon, six ways" subcopy="Titles, authors, themes, periods, quotes, traditions — everything indexed for discovery." layout="mockup-left" bgClass="bg-background">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 mb-4">
            <Search className="size-3.5 text-muted-foreground" />
            <span className="text-sm">love</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(c => (
              <div key={c.label} className="rounded-lg border p-2">
                <p className="text-[8px] font-medium uppercase" style={{ color: c.color }}>{c.label}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{c.result}</p>
              </div>
            ))}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="Search the canon, six ways" subcopy="Titles, authors, themes, periods, quotes, traditions — everything indexed for discovery." layout="mockup-left" bgClass="bg-background">
      <div ref={containerRef} className="bg-card rounded-xl border border-border p-5 min-h-[260px]" style={{ willChange: "transform" }}>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 mb-4">
          <Search className="size-3.5 text-muted-foreground" />
          <span className="text-sm font-[var(--font-body)]">
            {typedText}
            {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-px h-4 bg-foreground ml-px align-middle" />}
          </span>
        </div>

        <motion.div animate={{ opacity: showResults ? 1 : 0, y: showResults ? 0 : 8 }} transition={{ duration: 0.4, ease: EASE }} className="grid grid-cols-3 gap-2" style={{ willChange: "transform, opacity" }}>
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: showResults ? 1 : 0, y: showResults ? 0 : 6 }} transition={{ delay: i * 0.08, duration: 0.3, ease: EASE }} className={`rounded-lg border p-2 transition-colors ${showFilter && i === 0 ? "border-[#0EA5E9] bg-[#0EA5E9]/5" : ""}`} style={{ willChange: "transform, opacity" }}>
              <p className="text-[8px] font-medium uppercase tracking-wider" style={{ color: c.color }}>{c.label}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{c.result}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </TeacherShowcaseShell>
  )
}
