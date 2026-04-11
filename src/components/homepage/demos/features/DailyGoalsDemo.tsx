"use client"

import { motion } from "motion/react"
import { Flame, Check } from "lucide-react"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "goals", duration: 3000 },
  { name: "progress", duration: 2500 },
  { name: "complete", duration: 2500 },
]

export function DailyGoalsDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)
  const pct = phase === "goals" ? 40 : phase === "progress" ? 75 : 100

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[240px] text-[10px]">
      <p className="text-[8px] text-[#7A756D] mb-2">Daily Goal</p>
      {/* Circular progress */}
      <div className="flex justify-center mb-3">
        <div className="relative size-16">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#222" strokeWidth="2" />
            <motion.circle
              cx="18" cy="18" r="15.5" fill="none" stroke="#D4AF37" strokeWidth="2"
              strokeLinecap="round" strokeDasharray="97.4"
              animate={{ strokeDashoffset: 97.4 - (97.4 * pct) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {phase === "complete" ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Flame className="size-5 text-[#D4AF37]" />
              </motion.div>
            ) : (
              <span className="text-xs font-bold text-[#D4AF37]">{pct}%</span>
            )}
          </div>
        </div>
      </div>
      {/* Checklist */}
      <div className="space-y-1.5">
        {["Read 15 minutes", "Complete 1 quiz", "Learn 3 words"].map((goal, i) => {
          const done = phase === "goals" ? i === 0 : phase === "progress" ? i <= 1 : true
          return (
            <div key={goal} className="flex items-center gap-1.5">
              <div className={`size-3 rounded-full border flex items-center justify-center ${done ? "bg-[#D4AF37] border-[#D4AF37]" : "border-[#444]"}`}>
                {done && <Check className="size-2 text-[#0D0D0D]" />}
              </div>
              <span className={`text-[9px] ${done ? "text-[#D4AF37]" : "text-[#7A756D]"}`}>{goal}</span>
            </div>
          )
        })}
      </div>
      {phase === "complete" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-2"
        >
          <p className="text-[9px] text-[#D4AF37] font-semibold">Streak: 15 days</p>
        </motion.div>
      )}
    </div>
  )
}
