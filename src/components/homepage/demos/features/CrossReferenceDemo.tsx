"use client"

import { motion, AnimatePresence } from "motion/react"
import { ArrowRight } from "lucide-react"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "reading", duration: 3000 },
  { name: "xref", duration: 2000 },
  { name: "navigate", duration: 3000 },
]

export function CrossReferenceDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[180px] text-[10px]">
      <AnimatePresence mode="wait">
        {phase !== "navigate" ? (
          <motion.div key="source" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[8px] text-[#7A756D] mb-1">The Odyssey &middot; Book IX</p>
            <p className="font-serif leading-relaxed mb-2">
              ...and there we found the Cyclops, a monstrous being, neither like men nor like the gods...
            </p>
            {phase === "xref" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded border border-[#D4AF37]/30 bg-[#1A1A0D] p-2"
              >
                <span className="text-[7px] uppercase text-[#D4AF37] font-semibold">Compare</span>
                <p className="text-[8px] text-[#C4BFB6] mt-1">Aeneid, Book III — Aeneas encounters the same Cyclops.</p>
                <div className="flex items-center gap-0.5 mt-1 text-[8px] text-[#D4AF37]">
                  Read this <ArrowRight className="size-2" />
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="target" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[8px] text-[#7A756D]">The Aeneid &middot; Book III</p>
              <span className="text-[7px] text-[#D4AF37] border border-[#D4AF37]/30 rounded-full px-1.5 py-0.5">Return</span>
            </div>
            <p className="font-serif leading-relaxed">
              ...we see the fearful Cyclops, shepherd of the flocks, dragging his steps upon the shore...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
