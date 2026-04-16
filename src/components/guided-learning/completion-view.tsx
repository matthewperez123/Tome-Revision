"use client"

import { motion } from "framer-motion"
import { Award, ArrowRight, Clock, BookOpen, Brain, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Station, StationType } from "@/lib/guided-learning-types"
import { STATION_TYPE_LABELS } from "@/lib/guided-station-utils"

const ICONS: Record<StationType, typeof BookOpen> = {
  reading: BookOpen,
  quiz: Brain,
  reflection: PenTool,
}

interface Props {
  sessionTitle: string
  stations: Station[]
  totalTimeMinutes?: number
  wisdomEarned?: number
  onReturnToDashboard: () => void
}

export function CompletionView({
  sessionTitle,
  stations,
  totalTimeMinutes,
  wisdomEarned,
  onReturnToDashboard,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-gray-950">
      <motion.div
        className="flex max-w-md flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Seal */}
        <motion.div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(184, 146, 74, 0.1)",
            border: "2px solid var(--gold-default, #B8924A)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
        >
          <Award className="h-10 w-10" style={{ color: "var(--gold-default, #B8924A)" }} />
        </motion.div>

        <motion.h1
          className="mb-2 text-2xl font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Session Complete
        </motion.h1>

        <motion.p
          className="mb-8 text-sm opacity-50"
          style={{ fontFamily: "var(--font-serif)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6 }}
        >
          {sessionTitle}
        </motion.p>

        {/* Summary */}
        <motion.div
          className="mb-8 w-full space-y-2 rounded-xl border p-4"
          style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {stations.map((s) => {
            const Icon = ICONS[s.type]
            return (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <Icon className="h-3.5 w-3.5 opacity-40" />
                <span className="flex-1 truncate text-left">
                  {s.title || STATION_TYPE_LABELS[s.type]}
                </span>
                <span className="text-xs opacity-40">
                  {s.target_minutes}m
                </span>
              </div>
            )
          })}

          {totalTimeMinutes != null && (
            <div className="flex items-center gap-3 border-t pt-2 text-sm" style={{ borderColor: "rgba(128,128,128,0.1)" }}>
              <Clock className="h-3.5 w-3.5 opacity-40" />
              <span className="flex-1 text-left opacity-60">Total time</span>
              <span className="text-xs font-semibold">{totalTimeMinutes}m</span>
            </div>
          )}

          {wisdomEarned != null && wisdomEarned > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <Award className="h-3.5 w-3.5" style={{ color: "var(--gold-default, #B8924A)" }} />
              <span className="flex-1 text-left font-medium" style={{ color: "var(--gold-default, #B8924A)" }}>
                +{wisdomEarned} wisdom earned
              </span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={onReturnToDashboard}
            className="gap-2"
            variant="outline"
          >
            Return to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
