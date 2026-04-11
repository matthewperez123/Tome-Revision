"use client"

import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "../useAnimationLoop"

const PHASES = [
  { name: "roster", duration: 3000 },
  { name: "notification", duration: 2500 },
  { name: "assignment", duration: 2500 },
  { name: "atRisk", duration: 2000 },
]

const STUDENTS = [
  { name: "Emily R.", chapter: "Ch 4", progress: 85, status: "active" as const },
  { name: "James K.", chapter: "Ch 3", progress: 62, status: "active" as const },
  { name: "Sofia M.", chapter: "Ch 4", progress: 78, status: "idle" as const },
  { name: "Aiden R.", chapter: "Ch 1", progress: 12, status: "risk" as const },
  { name: "Mia T.", chapter: "Ch 3", progress: 55, status: "active" as const },
]

export function AnimatedClassroom() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const assignmentCount = phase === "assignment" ? 19 : 18

  if (isReduced) {
    return (
      <div className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-serif text-sm font-semibold text-[#FAF7F2]">AP Literature &mdash; Period 3</p>
            <p className="text-xs text-[#7A756D] mt-0.5">Mrs. Holloway &middot; 25 students</p>
          </div>
          <div className="rounded-md bg-[#222222] border border-[#333333] px-3 py-1.5">
            <p className="text-[10px] text-[#7A756D] uppercase tracking-wider">Join Code</p>
            <p className="text-sm font-mono font-bold text-[#D4AF37]">TOME42</p>
          </div>
        </div>
        <StudentRows students={STUDENTS} riskHighlight={false} />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6 min-h-[320px] relative overflow-hidden"
      aria-label="Animated classroom demonstration"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-serif text-sm font-semibold text-[#FAF7F2]">AP Literature &mdash; Period 3</p>
          <p className="text-xs text-[#7A756D] mt-0.5">Mrs. Holloway &middot; 25 students</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-[#7A756D] uppercase tracking-wider">Submitted</p>
            <motion.p
              key={assignmentCount}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-mono font-bold text-[#D4AF37] tabular-nums"
            >
              {assignmentCount}/25
            </motion.p>
          </div>
          <div className="rounded-md bg-[#222222] border border-[#333333] px-3 py-1.5">
            <p className="text-[10px] text-[#7A756D] uppercase tracking-wider">Join Code</p>
            <p className="text-sm font-mono font-bold text-[#D4AF37]">TOME42</p>
          </div>
        </div>
      </div>

      {/* Student rows */}
      <StudentRows students={STUDENTS} riskHighlight={phase === "atRisk"} />

      {/* Notification toast */}
      <AnimatePresence>
        {phase === "notification" && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-3 right-3 bg-[#1A2E1A] border border-emerald-700/40 rounded-lg px-4 py-2.5 shadow-lg"
          >
            <p className="text-xs text-emerald-400">
              Sarah M. scored 95% on Odyssey Trial 5
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StudentRows({ students, riskHighlight }: { students: typeof STUDENTS; riskHighlight: boolean }) {
  return (
    <div className="space-y-2.5">
      {students.map((s) => {
        const isAtRisk = s.status === "risk"
        return (
          <motion.div
            key={s.name}
            animate={isAtRisk && riskHighlight ? { backgroundColor: ["rgba(217,119,6,0.05)", "rgba(217,119,6,0.15)", "rgba(217,119,6,0.05)"] } : {}}
            transition={isAtRisk && riskHighlight ? { duration: 1.5, repeat: Infinity } : {}}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2",
              isAtRisk && riskHighlight && "border border-amber-700/30"
            )}
          >
            {/* Status dot */}
            <div
              className={cn(
                "size-2 rounded-full shrink-0",
                s.status === "active" && "bg-emerald-500",
                s.status === "idle" && "bg-yellow-500",
                s.status === "risk" && "bg-red-500"
              )}
            />
            <span className="text-xs text-[#C4BFB6] w-16 shrink-0">{s.name}</span>
            <span className="text-[10px] text-[#7A756D] w-8 shrink-0">{s.chapter}</span>
            <div className="flex-1 h-1.5 bg-[#222222] rounded-full">
              <div
                className="h-1.5 bg-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: `${s.progress}%` }}
              />
            </div>
            <span className="text-[10px] text-[#7A756D] w-8 text-right tabular-nums">{s.progress}%</span>
            {isAtRisk && riskHighlight && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-amber-500 whitespace-nowrap"
              >
                inactive 4 days
              </motion.span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
