"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const STUDENTS = [
  { name: "Marcus A.", initials: "MA", bg: "bg-indigo-500/20", text: "text-indigo-500", online: true, reading: "The Iliad", wisdom: "Level 3" },
  { name: "Livia C.", initials: "LC", bg: "bg-amber-500/20", text: "text-amber-500", online: true, reading: "Jane Eyre", wisdom: "Level 4" },
  { name: "Aurelius T.", initials: "AT", bg: "bg-emerald-500/20", text: "text-emerald-500", online: false, reading: "Frankenstein", wisdom: "Level 2" },
  { name: "Helena P.", initials: "HP", bg: "bg-rose-500/20", text: "text-rose-500", online: true, reading: "The Odyssey", wisdom: "Level 5" },
  { name: "Cassius D.", initials: "CD", bg: "bg-sky-500/20", text: "text-sky-500", online: false, reading: "Don Quixote", wisdom: "Level 2" },
  { name: "Diana M.", initials: "DM", bg: "bg-violet-500/20", text: "text-violet-500", online: true, reading: "Wuthering Heights", wisdom: "Level 3" },
]

export function ClassRosterShowcase() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <TeacherShowcaseShell
      heading="Your class, in one place"
      subcopy="Add students, organize them into sections, and track every reader at a glance."
      layout="mockup-left"
      bgClass="bg-background"
      paddingClass="py-20"
    >
      <div
        className="bg-card rounded-xl border border-border p-6 min-h-[300px]"
        aria-label="Interactive class roster demonstration"
      >
        <div className="flex items-start justify-between mb-4 gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">AP Literature &middot; Period 3</p>
            <p className="text-[10px] text-muted-foreground">28 students &middot; Join code <span className="font-mono text-foreground">TOME-7Q4</span></p>
          </div>
          <p className="text-[10px] text-muted-foreground">Click a student</p>
        </div>

        <div className="space-y-1">
          {STUDENTS.map((s, i) => {
            const isOpen = openIndex === i
            return (
              <div key={s.name}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`flex w-full items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isOpen ? "bg-indigo-500/5" : "hover:bg-muted"
                  }`}
                >
                  <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${s.bg} ${s.text}`}>
                    {s.initials}
                  </div>
                  <span className="text-sm text-foreground">{s.name}</span>
                  <div className="ml-auto">
                    <div className={`size-2 rounded-full ${s.online ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="mx-2 mt-1 mb-2 rounded-lg border border-border bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Currently reading: <span className="text-foreground font-medium">{s.reading}</span>
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                          Wisdom: <span className="text-foreground font-medium">{s.wisdom}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
