"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "reading", duration: 3000 },
  { name: "highlight", duration: 2000 },
  { name: "annotation", duration: 3000 },
]

export function VirgilAnnotationDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[180px] text-[10px]">
      <div className="h-0.5 bg-[#222] rounded-full mb-2">
        <div className="h-0.5 bg-[#D4AF37] rounded-full w-[28%]" />
      </div>
      <p className="text-[8px] text-[#7A756D] mb-1">The Odyssey &middot; Book I</p>
      <p className="font-serif leading-relaxed">
        Tell me, O muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of{" "}
        <span className={phase !== "reading" ? "underline decoration-[#D4AF37] text-[#D4AF37]" : ""}>
          Troy
        </span>
        <span className={`inline text-[8px] align-super ml-0.5 ${phase !== "reading" ? "text-[#D4AF37] scale-125" : "text-[#D4A04C]"}`}>
          ✦
        </span>
        . Many cities did he visit.
      </p>
      <AnimatePresence>
        {phase === "annotation" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-2 rounded border-l-2 border-[#D4AF37] bg-[#1A1A0D] p-2"
          >
            <div className="flex items-center gap-1 mb-1">
              <div className="size-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[6px] font-bold text-[#D4AF37]">V</div>
              <span className="text-[7px] text-[#D4AF37] font-semibold">Virgil</span>
            </div>
            <p className="text-[8px] text-[#C4BFB6] leading-relaxed">
              The fall of Troy is the pivotal event of the ancient world. Homer assumes his audience knows the full story.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
