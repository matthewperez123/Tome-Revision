"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Keyboard } from "lucide-react"

const HINTS: { keys: string; desc: string }[] = [
  { keys: "1 / 2 / 3 / 4", desc: "Select option A–D" },
  { keys: "T / F", desc: "Select True / False" },
  { keys: "Enter / Space", desc: "Submit or continue" },
  { keys: "?", desc: "Toggle this panel" },
  { keys: "Esc", desc: "Exit Trial" },
]

export function KeyboardHints() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't intercept if typing in an input
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return
      if (e.key === "?") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Keyboard shortcuts"
        aria-expanded={open}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-1.5 rounded-full bg-stone-800/80 text-stone-100 backdrop-blur-sm px-3 py-1.5 text-[11px] font-sans shadow-lg hover:bg-stone-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <Keyboard className="w-3.5 h-3.5" />
        Shortcuts
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 left-1/2 z-40 w-72 rounded-xl bg-card border border-border shadow-xl p-4"
            role="dialog"
            aria-label="Keyboard shortcuts"
          >
            <h3 className="text-sm font-semibold font-sans text-ink mb-2">
              Keyboard shortcuts
            </h3>
            <dl className="space-y-1.5">
              {HINTS.map((h) => (
                <div
                  key={h.keys}
                  className="flex items-center justify-between text-xs"
                >
                  <dd className="text-muted-foreground">{h.desc}</dd>
                  <dt className="font-mono text-[11px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                    {h.keys}
                  </dt>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
