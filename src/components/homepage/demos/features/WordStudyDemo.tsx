"use client"

import { motion, AnimatePresence } from "motion/react"
import { BookOpen } from "lucide-react"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "word", duration: 3000 },
  { name: "definition", duration: 2500 },
  { name: "saved", duration: 2500 },
]

export function WordStudyDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[180px] text-[10px]">
      <p className="text-[8px] text-[#7A756D] mb-1">The Odyssey &middot; Book XI</p>
      <p className="font-serif leading-relaxed mb-2">
        ...and he showed me{" "}
        <span className={phase !== "word" ? "underline decoration-[#D4AF37] text-[#D4AF37] cursor-default" : ""}>
          Tartarus
        </span>
        , where the sinners dwell in endless torment...
      </p>
      <AnimatePresence mode="wait">
        {phase === "definition" && (
          <motion.div
            key="def"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded border border-[#333] bg-[#1A1A1A] p-2"
          >
            <p className="font-serif text-[10px] font-bold text-[#D4AF37] mb-0.5">Tartarus</p>
            <p className="text-[8px] text-[#C4BFB6] italic mb-1">/tar-tuh-ruhs/ — noun</p>
            <p className="text-[8px] text-[#C4BFB6]">The deepest region of the underworld in Greek mythology, reserved for the punishment of the wicked.</p>
          </motion.div>
        )}
        {phase === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-2 text-center"
          >
            <BookOpen className="size-4 text-[#D4AF37] mx-auto mb-1" />
            <p className="text-[8px] text-[#D4AF37] font-semibold">Saved to Vocabulary</p>
            <p className="text-[7px] text-[#7A756D] mt-0.5">12 words learned this week</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
