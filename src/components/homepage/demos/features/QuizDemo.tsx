"use client"

import { motion, AnimatePresence } from "motion/react"
import { Check, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "question", duration: 3000 },
  { name: "select", duration: 2000 },
  { name: "result", duration: 3000 },
]

const OPTIONS = ["A metaphor for death", "Formulaic epithet", "Visual synesthesia", "Color symbolism"]

export function QuizDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[180px] text-[10px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[8px] text-[#D4AF37] font-semibold">Book I Trial</span>
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => (
            <Heart key={i} className={cn("size-2", i <= 4 ? "text-rose-500 fill-rose-500" : "text-[#333]")} />
          ))}
        </div>
      </div>
      <p className="font-serif text-[10px] font-semibold mb-2">
        Homer&apos;s &quot;wine-dark sea&quot; is an example of:
      </p>
      <div className="space-y-1">
        {OPTIONS.map((opt, i) => (
          <motion.div
            key={i}
            animate={phase === "result" && i === 1 ? { borderColor: "rgba(34,197,94,0.5)" } : {}}
            className={cn(
              "flex items-center gap-1.5 rounded border px-2 py-1 text-[9px]",
              phase !== "question" && i === 1
                ? "border-emerald-600/50 bg-emerald-950/30 text-emerald-400"
                : "border-[#333] bg-[#1A1A1A] text-[#FAF7F2]"
            )}
          >
            <span className="font-semibold text-[8px]">{String.fromCharCode(65 + i)}</span>
            <span className="flex-1">{opt}</span>
            {phase === "result" && i === 1 && <Check className="size-2.5 text-emerald-400" />}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {phase === "result" && (
          <motion.p
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [1, 1, 0], y: -8 }}
            transition={{ duration: 2, times: [0, 0.6, 1] }}
            className="text-[10px] text-[#D4AF37] font-semibold mt-1 text-center"
          >
            +25 Wisdom
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
