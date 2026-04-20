"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 500 },
  { name: "bookAppear", duration: 500 },
  { name: "tag1", duration: 500 },
  { name: "tag2", duration: 500 },
  { name: "tag3", duration: 600 },
  { name: "hoverTag", duration: 700 },
  { name: "reset", duration: 200 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const STANDARDS = [
  { label: "Common Core", code: "CCSS.ELA-LITERACY.RL.9-10.2" },
  { label: "AP Literature", code: "AP-LIT.3.B" },
  { label: "IB English", code: "IB-ENG.SL.1.2" },
]

export function StandardsAlignmentShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showBook =
    phase === "bookAppear" ||
    phase === "tag1" ||
    phase === "tag2" ||
    phase === "tag3" ||
    phase === "hoverTag"

  const showTag1 =
    phase === "tag1" ||
    phase === "tag2" ||
    phase === "tag3" ||
    phase === "hoverTag"

  const showTag2 =
    phase === "tag2" || phase === "tag3" || phase === "hoverTag"

  const showTag3 = phase === "tag3" || phase === "hoverTag"

  const showTooltip = phase === "hoverTag"

  if (isReduced) {
    return (
      <TeacherShowcaseShell
        heading="Aligned to your standards"
        subcopy="Every book and Trial is tagged to Common Core, AP English Literature, and IB frameworks."
        layout="mockup-left"
        bgClass="bg-background"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-28 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-500 text-lg font-bold">I</span>
            </div>
            <p className="text-sm font-semibold text-foreground mt-2">The Iliad</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {STANDARDS.map((s, i) => (
              <span
                key={i}
                className="inline-flex px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold border border-indigo-500/20"
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell
      heading="Aligned to your standards"
      subcopy="Every book and Trial is tagged to Common Core, AP English Literature, and IB frameworks."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated standards alignment demonstration"
      >
        {/* Book display */}
        <AnimatePresence>
          {showBook && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-center mb-6"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="w-20 h-28 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <span className="text-indigo-500 text-lg font-bold">I</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-2">The Iliad</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Standard pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <AnimatePresence>
            {showTag1 && (
              <motion.span
                key="tag-cc"
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="inline-flex px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold border border-indigo-500/20"
                style={{ willChange: "transform, opacity" }}
              >
                {STANDARDS[0].label}
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTag2 && (
              <motion.span
                key="tag-ap"
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="inline-flex px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold border border-indigo-500/20"
                style={{ willChange: "transform, opacity" }}
              >
                {STANDARDS[1].label}
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTag3 && (
              <motion.span
                key="tag-ib"
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="inline-flex px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold border border-indigo-500/20"
                style={{ willChange: "transform, opacity" }}
              >
                {STANDARDS[2].label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Tooltip on hover */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute left-[40px] top-[210px] bg-card border border-border rounded-lg p-3 shadow-lg z-20 max-w-[200px]"
              style={{ willChange: "transform, opacity" }}
            >
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="text-foreground font-semibold">{STANDARDS[0].code}</span>
                {" \u2014 "}Determine a theme or central idea
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </TeacherShowcaseShell>
  )
}
