"use client"

import { motion } from "framer-motion"
import { Feather, Bell, Megaphone, Award, Info, X } from "lucide-react"
import { useState } from "react"
import type { MessageType } from "@/lib/guided-learning-types"

const MESSAGE_CONFIG: Record<
  MessageType,
  { icon: typeof Feather; color: string; bg: string; label: string }
> = {
  hint: {
    icon: Feather,
    color: "var(--gold-default, #B8924A)",
    bg: "rgba(184, 146, 74, 0.08)",
    label: "Hint",
  },
  nudge: {
    icon: Bell,
    color: "var(--tome-indigo, #6366F1)",
    bg: "rgba(99, 102, 241, 0.06)",
    label: "Nudge",
  },
  announcement: {
    icon: Megaphone,
    color: "var(--foreground)",
    bg: "rgba(128, 128, 128, 0.06)",
    label: "Announcement",
  },
  praise: {
    icon: Award,
    color: "var(--gold-default, #B8924A)",
    bg: "rgba(184, 146, 74, 0.1)",
    label: "Praise",
  },
  instruction: {
    icon: Info,
    color: "var(--foreground)",
    bg: "rgba(128, 128, 128, 0.06)",
    label: "Instruction",
  },
}

interface Props {
  messageType: MessageType
  content: string
  teacherName?: string
  onDismiss?: () => void
}

/**
 * Inline marginalia-style card for teacher messages shown to students.
 * Styled to match Virgil annotation aesthetic.
 */
export function MessageInlineCard({
  messageType,
  content,
  teacherName,
  onDismiss,
}: Props) {
  const config = MESSAGE_CONFIG[messageType]
  const Icon = config.icon
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const isNudge = messageType === "nudge"

  return (
    <motion.div
      className="mx-4 mb-3 rounded-xl border px-4 py-3"
      style={{
        backgroundColor: config.bg,
        borderColor: `${config.color}22`,
        borderLeftWidth: "3px",
        borderLeftColor: config.color,
      }}
      initial={isNudge ? { x: 20, opacity: 0 } : { y: -10, opacity: 0 }}
      animate={
        isNudge
          ? {
              x: [20, -3, 3, -1, 0],
              opacity: 1,
              transition: { duration: 0.5 },
            }
          : { y: 0, opacity: 1, transition: { duration: 0.3 } }
      }
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-start gap-3">
        <Icon
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: config.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-50">
            {config.label}
            {teacherName && ` from ${teacherName}`}
          </p>
          <p
            className="mt-1 text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {content}
          </p>
        </div>
        {onDismiss && messageType !== "instruction" && (
          <button
            onClick={() => {
              setDismissed(true)
              onDismiss()
            }}
            className="shrink-0 rounded p-1 opacity-30 hover:opacity-60 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)]"
            aria-label="Dismiss message"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
