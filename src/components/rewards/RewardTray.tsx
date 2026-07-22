"use client"

/**
 * RewardTray — the staggered reveal tray for the post-Trial crescendo.
 *
 * Contract: { children: React.ReactNode; open: boolean }
 * (optional extras: onDismiss, label — contract fields unchanged.)
 *
 * - Opens as a bottom tray with the sheet spring; children reveal in
 *   a 90ms stagger, rising 12px each (tactile moment #11 rhythm).
 * - Always dismissible (Esc, close button) and never blocks
 *   continuing — no modal scrim, focus is not trapped.
 * - Reduced motion: tray and children fade in together over 200ms.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Children, useEffect, useRef } from "react"
import { laSprings, staggerChild, staggerContainer } from "@/lib/design/motion"

export interface RewardTrayProps {
  children: React.ReactNode
  open: boolean
  /** Called on Esc / close press. Omit for a read-only presentation. */
  onDismiss?: () => void
  /** Accessible name for the tray region. */
  label?: string
}

export function RewardTray({ children, open, onDismiss, label = "Rewards earned" }: RewardTrayProps) {
  const reduced = useReducedMotion() === true
  const trayRef = useRef<HTMLDivElement | null>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (!open || !onDismiss) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        onDismiss()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onDismiss])

  useEffect(() => {
    // Move focus into the tray when it opens so keyboard and AT
    // users meet the crescendo; do not steal it back afterwards.
    if (open && !wasOpen.current) {
      trayRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  const items = Children.toArray(children)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={trayRef}
          role="region"
          aria-label={label}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-2xl px-4 pb-4 outline-none"
          initial={reduced ? { opacity: 0 } : { y: "100%", opacity: 0.4 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          transition={
            reduced
              ? { duration: 0.2 }
              : laSprings.sheet
          }
        >
          <div
            className="relative rounded-[22px] p-5"
            style={{
              backgroundColor: "var(--la-surface-raised)",
              boxShadow: "var(--la-shadow-float)",
              border: "1px solid var(--la-surface-sunken)",
            }}
          >
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss rewards"
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--la-ink-muted)] outline-none transition-colors hover:bg-[var(--la-primary-soft)] hover:text-[var(--la-ink)] focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              variants={
                reduced
                  ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
                  : staggerContainer(90, 150)
              }
              initial="hidden"
              animate="visible"
            >
              {items.map((child, index) => (
                <motion.div
                  key={index}
                  variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } } : staggerChild}
                >
                  {child}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
