"use client"

import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "class", duration: 3000 },
  { name: "assign", duration: 2500 },
  { name: "student", duration: 2500 },
]

export function ClassroomDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[180px] text-[10px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-semibold">AP Literature</p>
        <span className="text-[7px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 rounded px-1 py-0.5">TOME42</span>
      </div>
      <AnimatePresence mode="wait">
        {phase === "class" && (
          <motion.div key="roster" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {["Emily R.", "James K.", "Sofia M."].map((name, i) => (
              <div key={name} className="flex items-center gap-1.5 mb-1">
                <div className={cn("size-1.5 rounded-full", i < 2 ? "bg-emerald-500" : "bg-yellow-500")} />
                <span className="text-[8px] text-[#C4BFB6] w-12">{name}</span>
                <div className="flex-1 h-1 bg-[#222] rounded-full">
                  <div className="h-1 bg-[#D4AF37] rounded-full" style={{ width: `${85 - i * 20}%` }} />
                </div>
              </div>
            ))}
          </motion.div>
        )}
        {phase === "assign" && (
          <motion.div key="assign" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded border border-[#333] bg-[#1A1A1A] p-2"
          >
            <p className="text-[8px] text-[#D4AF37] font-semibold mb-1">New Assignment</p>
            <p className="text-[8px] text-[#C4BFB6]">The Odyssey, Books I-IV</p>
            <p className="text-[7px] text-[#7A756D] mt-1">Due: Friday &middot; 25 students</p>
          </motion.div>
        )}
        {phase === "student" && (
          <motion.div key="student" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="rounded border border-emerald-700/30 bg-emerald-950/20 p-2 mb-1">
              <p className="text-[8px] text-emerald-400">Emily R. completed Chapter 4</p>
            </div>
            <p className="text-[8px] text-[#7A756D]">19/25 submitted</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
