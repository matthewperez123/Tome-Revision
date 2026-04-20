"use client"

import { motion } from "motion/react"
import { Users, BookOpen } from "lucide-react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 600 },
  { name: "card", duration: 1100 },
  { name: "posts", duration: 1850 },
  { name: "join", duration: 1100 },
  { name: "reset", duration: 350 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const POSTS = [
  { author: "Sofia R.", text: "The Nobody trick is pure metis — cunning over strength." },
  { author: "Marcus W.", text: "But his hubris in revealing his name is the real lesson." },
  { author: "Aisha P.", text: "Exactly! His greatest strength is also his flaw." },
]

export function BookClubsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showCard = phase !== "idle"
  const showPosts = phase === "posts" || phase === "join"
  const showJoin = phase === "join"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="Read together" subcopy="Join readers around the world in shared conversations about the books that matter." layout="mockup-left" bgClass="bg-muted">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-[#0EA5E9] flex items-center justify-center text-white"><BookOpen className="size-5" /></div>
            <div>
              <p className="text-sm font-semibold">The Odyssey Circle</p>
              <p className="text-[10px] text-muted-foreground">23 members</p>
            </div>
          </div>
          {POSTS.map(p => <div key={p.author} className="py-1.5 text-[10px]"><strong>{p.author}:</strong> {p.text}</div>)}
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="Read together" subcopy="Join readers around the world in shared conversations about the books that matter." layout="mockup-left" bgClass="bg-muted">
      <div ref={containerRef} className="min-h-[280px]" style={{ willChange: "transform" }}>
        <motion.div animate={{ opacity: showCard ? 1 : 0, y: showCard ? 0 : 15 }} transition={{ duration: 0.5, ease: EASE }} className="bg-card rounded-xl border border-border p-5" style={{ willChange: "transform, opacity" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-[#0EA5E9] flex items-center justify-center text-white"><BookOpen className="size-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold">The Odyssey Circle</p>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Users className="size-3" />
                <motion.span animate={{ opacity: 1 }} key={showJoin ? "24" : "23"}>{showJoin ? "24" : "23"} members</motion.span>
              </div>
            </div>
            <motion.button animate={{ backgroundColor: showJoin ? "#22C55E" : "#6366F1", scale: showJoin ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.3 }} className="rounded-full px-3 py-1 text-[10px] font-medium text-white" style={{ willChange: "transform" }}>
              {showJoin ? "Joined ✓" : "Join"}
            </motion.button>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            {POSTS.map((p, i) => (
              <motion.div key={p.author} initial={{ opacity: 0, x: -10 }} animate={{ opacity: showPosts ? 1 : 0, x: showPosts ? 0 : -10 }} transition={{ delay: i * 0.2, duration: 0.4, ease: EASE }} className="flex gap-2" style={{ willChange: "transform, opacity" }}>
                <div className="size-5 rounded-full bg-muted flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5">{p.author[0]}</div>
                <div>
                  <span className="text-[9px] font-semibold">{p.author}</span>
                  <p className="text-[10px] text-muted-foreground">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </TeacherShowcaseShell>
  )
}
