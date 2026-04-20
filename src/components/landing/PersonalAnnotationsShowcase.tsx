"use client"

import { motion, AnimatePresence } from "motion/react"
import { Highlighter, StickyNote } from "lucide-react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

// Reader loop target: ~5s.
const PHASES = [
  { name: "read", duration: 1100 },
  { name: "highlight", duration: 1200 },
  { name: "note", duration: 2000 },
  { name: "reset", duration: 400 },
]

const PASSAGE = `In every grain of sand I see the divine handwriting of a patient hand. The shoreline remembers the sea, and the sea forgets nothing.`

const HIGHLIGHT_PHRASE = "the divine handwriting of a patient hand"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const AMBER_BG = "rgba(217, 119, 6, 0.22)"
const AMBER_BORDER = "#D97706"

export function PersonalAnnotationsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showHighlight = phase === "highlight" || phase === "note"
  const showNote = phase === "note"

  const [before, after] = PASSAGE.split(HIGHLIGHT_PHRASE)

  return (
    <TeacherShowcaseShell
      heading="Your marginalia, kept."
      subcopy="Highlight the line that stops you. Leave a note for your future self. Virgil is indigo; you are amber. Every mark you make is indexed and searchable."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <div
        ref={isReduced ? undefined : containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[280px] relative overflow-hidden"
        aria-label="Personal annotations demonstration"
      >
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
          Walden &middot; Thoreau
        </p>

        <p className="font-serif text-sm text-foreground leading-[1.9]">
          {before}
          <motion.span
            animate={{ backgroundColor: showHighlight ? AMBER_BG : "transparent" }}
            transition={{ duration: 0.3, ease: EASE }}
            className="rounded px-0.5"
            style={{ willChange: "background-color" }}
          >
            {HIGHLIGHT_PHRASE}
          </motion.span>
          {after}
        </p>

        <AnimatePresence>
          {showNote && (
            <motion.div
              key="note"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-4 rounded-lg border-l-2 p-3 flex gap-2.5"
              style={{
                borderColor: AMBER_BORDER,
                backgroundColor: "rgba(217, 119, 6, 0.05)",
              }}
            >
              <div
                className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: AMBER_BORDER }}
              >
                MP
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <StickyNote
                    className="size-3"
                    style={{ color: AMBER_BORDER }}
                  />
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: AMBER_BORDER }}
                  >
                    Your note
                  </span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  Echoes Blake &mdash; to see a world in a grain of sand. Pull
                  this for the essay.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Highlighter className="size-3" style={{ color: AMBER_BORDER }} />
          <span>Amber = your marks &middot; Indigo = Virgil</span>
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
