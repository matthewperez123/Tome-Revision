"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Eye } from "lucide-react"

interface Props {
  isVisible: boolean
  teacherName?: string
}

/**
 * Subtle indicator shown on the student's screen when the teacher
 * is viewing their progress. Non-negotiable privacy requirement.
 */
export function TeacherViewingIndicator({ isVisible, teacherName }: Props) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed left-4 bottom-4 z-50 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-sm backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(var(--background-rgb, 255,255,255), 0.85)",
            borderColor: "rgba(128, 128, 128, 0.15)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <Eye className="h-3 w-3 opacity-40" />
          <span className="opacity-50">
            {teacherName ?? "Teacher"} is following along
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
