"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { springs } from "@/lib/design-tokens"
import type { GuidedSessionMode } from "@/lib/guided-learning-types"

interface ViolationWarningModalProps {
  isOpen: boolean
  violationCount: number
  maxViolations: number
  mode: GuidedSessionMode
  onDismiss: () => void
}

/**
 * Animated overlay shown when a focus violation occurs.
 * Strict mode: shows remaining violations before auto-submit.
 * Lenient mode: warning only.
 */
export function ViolationWarningModal({
  isOpen,
  violationCount,
  maxViolations,
  mode,
  onDismiss,
}: ViolationWarningModalProps) {
  const remaining = maxViolations - violationCount
  const isStrict = mode === "strict"
  const isFinalWarning = isStrict && remaining <= 1

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative mx-4 w-full max-w-md rounded-2xl border p-8 text-center shadow-2xl"
            style={{
              backgroundColor: "var(--tome-surface-elevated, #ffffff)",
              borderColor: isFinalWarning
                ? "var(--tome-error, #C84A52)"
                : "var(--tome-warning, #C8801F)",
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={springs.interactive}
          >
            {/* Icon */}
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: isFinalWarning
                  ? "rgba(200, 74, 82, 0.12)"
                  : "rgba(200, 128, 31, 0.12)",
              }}
            >
              {isFinalWarning ? (
                <ShieldAlert
                  size={32}
                  style={{ color: "var(--tome-error, #C84A52)" }}
                />
              ) : (
                <AlertTriangle
                  size={32}
                  style={{ color: "var(--tome-warning, #C8801F)" }}
                />
              )}
            </div>

            {/* Title */}
            <h2
              className="mb-2 text-xl font-bold"
            >
              {isFinalWarning ? "Final Warning" : "Focus Lost"}
            </h2>

            {/* Virgil quote */}
            <p
              className="mb-4 font-serif text-sm italic opacity-60"
              style={{ fontFamily: "var(--font-serif, 'Literata')" }}
            >
              &ldquo;Stay the path, traveler.&rdquo;
            </p>

            {/* Message */}
            <p className="mb-6 text-sm opacity-80">
              {isStrict ? (
                remaining > 0 ? (
                  <>
                    You have left the session screen.
                    <br />
                    <strong
                      style={{
                        color: isFinalWarning
                          ? "var(--tome-error, #C84A52)"
                          : "var(--tome-warning, #C8801F)",
                      }}
                    >
                      {remaining} {remaining === 1 ? "violation" : "violations"} remaining
                    </strong>{" "}
                    before your session is auto-submitted.
                  </>
                ) : (
                  <>
                    Maximum violations reached. Your session has been{" "}
                    <strong style={{ color: "var(--tome-error, #C84A52)" }}>
                      auto-submitted
                    </strong>
                    .
                  </>
                )
              ) : (
                <>
                  You left the session screen. This has been logged.
                  <br />
                  Please stay focused on your assignment.
                </>
              )}
            </p>

            {/* Violation counter */}
            <div className="mb-6 flex items-center justify-center gap-2">
              {Array.from({ length: maxViolations }).map((_, i) => (
                <div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor:
                      i < violationCount
                        ? "var(--tome-error, #C84A52)"
                        : "rgba(128, 128, 128, 0.2)",
                  }}
                />
              ))}
            </div>

            <Button
              onClick={onDismiss}
              className="w-full"
              style={{
                backgroundColor: "var(--tome-indigo, #6366F1)",
                color: "white",
              }}
            >
              {remaining <= 0 && isStrict ? "View Results" : "Return to Session"}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
