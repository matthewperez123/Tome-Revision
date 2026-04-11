"use client"

import { motion, AnimatePresence } from "motion/react"
import { Shield, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "collection", duration: 3000 },
  { name: "earn", duration: 2500 },
  { name: "display", duration: 2500 },
]

const SEALS = [
  { name: "First Page", unlocked: true },
  { name: "Homer", unlocked: true },
  { name: "Polyglot", unlocked: false },
  { name: "Night Owl", unlocked: false },
]

export function SealsDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)
  const polyglotUnlocked = phase !== "collection"

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[240px] text-[10px]">
      <p className="text-[9px] font-semibold mb-2">Seals</p>
      <AnimatePresence mode="wait">
        {phase !== "display" ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 gap-1.5">
              {SEALS.map((seal, i) => {
                const isUnlocking = i === 2 && phase === "earn"
                const isUnlocked = seal.unlocked || (i === 2 && polyglotUnlocked)
                return (
                  <motion.div
                    key={seal.name}
                    animate={isUnlocking ? { scale: [1, 1.1, 1] } : {}}
                    className={cn(
                      "rounded border p-2 text-center",
                      isUnlocked ? "border-[#D4AF37]/30 bg-[#D4AF37]/5" : "border-[#333] bg-[#1A1A1A]"
                    )}
                  >
                    {isUnlocked ? (
                      <Shield className="size-5 text-[#D4AF37] mx-auto mb-0.5" />
                    ) : (
                      <Lock className="size-5 text-[#444] mx-auto mb-0.5" />
                    )}
                    <p className={cn("text-[8px]", isUnlocked ? "text-[#D4AF37]" : "text-[#7A756D]")}>{seal.name}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-3">
            <motion.div
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="size-14 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center">
                <Shield className="size-7 text-[#D4AF37]" />
              </div>
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-full border border-[#D4AF37]"
              />
            </motion.div>
            <p className="text-[10px] font-semibold mt-2 font-[var(--font-display)]">Seal of the Polyglot</p>
            <p className="text-[8px] text-[#7A756D] mt-0.5">Read books from 5 traditions</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
