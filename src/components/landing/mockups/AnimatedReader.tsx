"use client"

import { motion, AnimatePresence } from "motion/react"
import { Check } from "lucide-react"
import { useAnimationLoop } from "../useAnimationLoop"

const PHASES = [
  { name: "reading", duration: 4000 },
  { name: "annotation", duration: 2000 },
  { name: "fade", duration: 2000 },
  { name: "celebrate", duration: 2000 },
]

const PASSAGE = `Tell me, O muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of Troy. Many cities did he visit, and many were the nations with whose manners and customs he was acquainted; moreover he suffered much by sea while trying to save his own life and bring his men safely home; but do what he might he could not save his men, for they perished through their own sheer folly in eating the cattle of the Sun-god Hyperion; so the god prevented them from ever reaching home.`

export function AnimatedReader() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const progressWidth = phase === "celebrate" ? "100%" : phase === "reading" ? "23%" : "28%"

  if (isReduced) {
    return (
      <div className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
        <div className="w-full h-1 bg-[#222222] rounded-full mb-5">
          <div className="h-1 bg-[#D4AF37] rounded-full" style={{ width: "28%" }} />
        </div>
        <p className="text-xs text-[#7A756D] mb-1">The Odyssey &middot; Book I</p>
        <p className="font-serif text-sm text-[#FAF7F2] leading-relaxed line-clamp-6">{PASSAGE}</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6 relative overflow-hidden min-h-[320px]"
      aria-label="Animated reader demonstration"
    >
      {/* Progress bar */}
      <div className="w-full h-1 bg-[#222222] rounded-full mb-5">
        <motion.div
          className="h-1 bg-[#D4AF37] rounded-full"
          animate={{ width: progressWidth }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {phase !== "celebrate" ? (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <p className="text-xs text-[#7A756D] mb-3">The Odyssey &middot; Book I</p>

            {/* Text with potential highlight */}
            <p className="font-serif text-sm text-[#FAF7F2] leading-[1.8] line-clamp-8">
              {PASSAGE.split("cattle of the Sun-god Hyperion").map((part, i) =>
                i === 0 ? (
                  <span key={i}>
                    {part}
                    {phase === "annotation" || phase === "fade" ? (
                      <motion.span
                        className="underline decoration-[#D4AF37] underline-offset-4 text-[#D4AF37]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        cattle of the Sun-god Hyperion
                      </motion.span>
                    ) : (
                      <span>cattle of the Sun-god Hyperion</span>
                    )}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>

            {/* Virgil Annotation Card */}
            <AnimatePresence>
              {phase === "annotation" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 rounded-lg border border-[#D4AF37]/30 bg-[#1A1A0D] p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[10px] font-serif font-bold text-[#D4AF37]">
                      V
                    </div>
                    <span className="text-xs text-[#D4AF37] font-semibold">Virgil notes</span>
                  </div>
                  <p className="text-xs text-[#C4BFB6] leading-relaxed">
                    The cattle of Helios (the Sun-god) on the island of Thrinacia are sacred and immortal. Homer uses this transgression to demonstrate that even after all their trials, the crew&apos;s lack of self-discipline seals their fate.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.6, 1] }}
              className="size-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mb-4"
            >
              <Check className="size-6 text-[#D4AF37]" />
            </motion.div>
            <p className="font-[var(--font-display)] text-lg font-bold text-[#FAF7F2]">
              Book I Complete
            </p>
            <motion.p
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [1, 1, 0], y: -20 }}
              transition={{ duration: 1.5, times: [0, 0.6, 1] }}
              className="text-sm text-[#D4AF37] font-semibold mt-2"
            >
              +5 Wisdom
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-sm text-[#D4AF37] border border-[#D4AF37]/30 rounded-full px-5 py-2"
            >
              Continue to Trial &rarr;
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
