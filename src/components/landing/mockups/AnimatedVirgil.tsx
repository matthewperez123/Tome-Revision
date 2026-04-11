"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"

const PHASES = [
  { name: "passage", duration: 3000 },
  { name: "highlight", duration: 3000 },
  { name: "annotation1", duration: 3000 },
  { name: "annotation2", duration: 3000 },
]

const PASSAGE_LINES = [
  "There sighs, lamentations, and loud wailings",
  "resounded through the starless air,",
  "so that at first it made me weep;",
  "strange tongues, horrible languages,",
  "words of pain, tones of anger,",
  "voices loud and hoarse, and with these",
  "the sound of hands, made a tumult.",
]

const ANNOTATION_1 = {
  title: "Contrapasso",
  text: "The principle that a sinner\u2019s punishment mirrors their sin. Dante borrowed the concept from Aristotelian ethics. In this canto, the fortune-tellers walk with their heads twisted backward \u2014 because in life they tried to see the future.",
}

const ANNOTATION_2 = {
  title: "The Starless Air",
  text: "Notice how Dante weeps at the sight. Virgil scolds him: \u2018Are you, too, like the other fools?\u2019 This is one of the moments where the poem questions whether compassion can be misplaced.",
}

export function AnimatedVirgil() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showHighlight = phase === "highlight" || phase === "annotation1" || phase === "annotation2"
  const showAnnotation = phase === "annotation1" || phase === "annotation2"
  const annotation = phase === "annotation2" ? ANNOTATION_2 : ANNOTATION_1

  if (isReduced) {
    return (
      <div className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6">
        <p className="text-xs text-[#7A756D] mb-3">The Divine Comedy &middot; Inferno, Canto III</p>
        <div className="font-serif text-sm text-[#FAF7F2] leading-[1.9] mb-4">
          {PASSAGE_LINES.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <div className="rounded-lg border-l-2 border-[#D4AF37] bg-[#1A1A0D] p-4">
          <div className="flex items-center gap-2 mb-2">
            <VirgilAvatar />
            <span className="text-xs text-[#D4AF37] font-semibold">Virgil</span>
          </div>
          <p className="text-xs text-[#C4BFB6] leading-relaxed">{ANNOTATION_1.text}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6 min-h-[300px]"
      aria-label="Animated Virgil annotation demonstration"
    >
      <p className="text-xs text-[#7A756D] mb-3">The Divine Comedy &middot; Inferno, Canto III</p>

      {/* Passage */}
      <div className="font-serif text-sm text-[#FAF7F2] leading-[1.9] mb-4">
        {PASSAGE_LINES.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: phase === "passage" ? i * 0.15 : 0, duration: 0.4 }}
          >
            {i === 0 && showHighlight ? (
              <>
                There{" "}
                <motion.span
                  initial={{ backgroundColor: "transparent" }}
                  animate={{ backgroundColor: "rgba(212,175,55,0.15)" }}
                  className="underline decoration-[#D4AF37] underline-offset-4 px-0.5 rounded"
                >
                  sighs, lamentations
                </motion.span>
                , and loud wailings
              </>
            ) : (
              line
            )}
          </motion.p>
        ))}
      </div>

      {/* Annotation card */}
      <AnimatePresence mode="wait">
        {showAnnotation && (
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg border-l-2 border-[#D4AF37] bg-[#1A1A0D] p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <VirgilAvatar />
              <span className="text-xs text-[#D4AF37] font-semibold">Virgil</span>
              <span className="text-[10px] text-[#7A756D]">&middot; {annotation.title}</span>
            </div>
            <p className="text-xs text-[#C4BFB6] leading-relaxed">{annotation.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VirgilAvatar() {
  return (
    <div className="size-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[10px] font-serif font-bold text-[#D4AF37]">
      V
    </div>
  )
}
