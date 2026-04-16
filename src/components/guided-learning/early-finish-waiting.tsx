"use client"

import { motion } from "framer-motion"
import { BookOpen, Clock } from "lucide-react"

interface Props {
  sessionTitle: string
  suggestedBookTitle?: string
  suggestedBookId?: string
}

/**
 * Shown when a student completes all stations early and allowEarlyExit is false.
 * Gentle waiting screen with optional free-reading suggestion.
 */
export function EarlyFinishWaiting({
  sessionTitle,
  suggestedBookTitle,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <motion.div
        className="max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "rgba(45, 154, 71, 0.08)" }}
        >
          <Clock className="h-8 w-8" style={{ color: "var(--tome-success, #2D9A47)" }} />
        </div>

        <div>
          <h2 className="text-xl font-bold">Nicely done!</h2>
          <p className="mt-2 text-sm opacity-50">
            You've completed all stations. Waiting for the rest of the class to finish.
          </p>
        </div>

        {suggestedBookTitle && (
          <div
            className="rounded-xl border p-4 text-left"
            style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-40">
              While you wait
            </p>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 opacity-40" />
              <div>
                <p className="text-sm font-medium">
                  Continue reading {suggestedBookTitle}
                </p>
                <p className="text-xs opacity-40">
                  Pick up where you left off
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
