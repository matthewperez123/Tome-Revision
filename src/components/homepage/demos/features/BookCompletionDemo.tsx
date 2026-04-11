"use client"

import { motion, AnimatePresence } from "motion/react"
import { Check, Star } from "lucide-react"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "reading", duration: 2000 },
  { name: "complete", duration: 3000 },
  { name: "stats", duration: 3000 },
]

export function BookCompletionDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[240px] text-[10px]">
      <AnimatePresence mode="wait">
        {phase === "reading" && (
          <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[8px] text-[#7A756D] mb-1">The Odyssey &middot; Book XXIV</p>
            <div className="h-1 bg-[#222] rounded-full mb-2">
              <motion.div
                className="h-1 bg-[#D4AF37] rounded-full"
                animate={{ width: ["92%", "100%"] }}
                transition={{ duration: 1.5 }}
              />
            </div>
            <p className="font-serif text-[9px] leading-relaxed">
              ...and so the hero returned at last to his beloved Ithaca, and peace was restored.
            </p>
          </motion.div>
        )}
        {phase === "complete" && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="size-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mb-2"
            >
              <Check className="size-5 text-[#D4AF37]" />
            </motion.div>
            <p className="text-[11px] font-semibold font-[var(--font-display)]">Book Complete!</p>
            <p className="text-[8px] text-[#7A756D] mt-1">The Odyssey by Homer</p>
            <div className="flex gap-0.5 mt-2">
              {[1,2,3,4,5].map(i => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <Star className="size-3 text-[#D4AF37] fill-[#D4AF37]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {phase === "stats" && (
          <motion.div key="stats" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="text-[9px] font-semibold mb-2">Reading Stats</p>
            {[
              { label: "Time", value: "12h 34m" },
              { label: "Words", value: "121,572" },
              { label: "Wisdom", value: "+350" },
              { label: "Quizzes", value: "24/24" },
            ].map(s => (
              <div key={s.label} className="flex justify-between mb-1 text-[8px]">
                <span className="text-[#7A756D]">{s.label}</span>
                <span className="text-[#D4AF37] font-semibold tabular-nums">{s.value}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
