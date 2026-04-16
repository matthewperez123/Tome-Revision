"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Brain, PenTool, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Station, StationType } from "@/lib/guided-learning-types"
import { STATION_TYPE_LABELS } from "@/lib/guided-station-utils"

const ICONS: Record<StationType, typeof BookOpen> = {
  reading: BookOpen,
  quiz: Brain,
  reflection: PenTool,
}

interface Props {
  isVisible: boolean
  completedStation?: Station
  nextStation?: Station
  /** If autoAdvance is true, this auto-transitions after a brief pause */
  autoAdvance?: boolean
  onContinue: () => void
}

export function StationTransitionOverlay({
  isVisible,
  completedStation,
  nextStation,
  autoAdvance = false,
  onContinue,
}: Props) {
  const NextIcon = nextStation ? ICONS[nextStation.type] : null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Completed badge */}
            {completedStation && (
              <p className="text-xs font-semibold uppercase tracking-widest opacity-40">
                Station {completedStation.station_index + 1} complete
              </p>
            )}

            {/* Next station preview */}
            {nextStation ? (
              <>
                <div className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5 opacity-30" />
                  <p className="text-sm font-semibold opacity-60">Up next</p>
                </div>

                <div className="flex items-center gap-3">
                  {NextIcon && (
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "rgba(99, 102, 241, 0.08)" }}
                    >
                      <NextIcon
                        className="h-6 w-6"
                        style={{ color: "var(--tome-indigo, #6366F1)" }}
                      />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-lg font-bold">
                      {nextStation.title || STATION_TYPE_LABELS[nextStation.type]}
                    </p>
                    <p className="text-sm opacity-50">
                      {STATION_TYPE_LABELS[nextStation.type]} — target {nextStation.target_minutes} minutes
                    </p>
                  </div>
                </div>

                {!autoAdvance && (
                  <Button
                    onClick={onContinue}
                    className="mt-4 gap-2 text-white"
                    style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </>
            ) : (
              <p className="text-lg font-bold">All stations complete</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
