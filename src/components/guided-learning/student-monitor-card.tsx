"use client"

import { AlertTriangle, UserX, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ParticipantWithProfile, GuidedPresence, FocusState } from "@/lib/guided-learning-types"

const FOCUS_COLORS: Record<FocusState, { bg: string; dot: string; label: string }> = {
  focused: {
    bg: "rgba(45, 154, 71, 0.08)",
    dot: "var(--tome-success, #2D9A47)",
    label: "Focused",
  },
  blurred: {
    bg: "rgba(200, 128, 31, 0.08)",
    dot: "var(--tome-warning, #C8801F)",
    label: "Away",
  },
  violation: {
    bg: "rgba(200, 74, 82, 0.08)",
    dot: "var(--tome-error, #C84A52)",
    label: "Violation",
  },
}

interface StudentMonitorCardProps {
  participant: ParticipantWithProfile
  presence?: GuidedPresence
  onKick?: (studentId: string) => void
  onMessage?: (studentId: string) => void
}

/**
 * Per-student live status tile for the teacher monitoring dashboard.
 * Shows name, progress, focus indicator, violation count.
 */
export function StudentMonitorCard({
  participant,
  presence,
  onKick,
  onMessage,
}: StudentMonitorCardProps) {
  const focusState: FocusState = presence?.focusState ?? "focused"
  const focus = FOCUS_COLORS[focusState]
  const name = participant.profiles?.display_name ?? "Student"
  const progress = presence?.progressPct ?? participant.progress_pct

  const isSubmitted = participant.status === "submitted"
  const isKicked = participant.status === "kicked"

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-colors",
        (isSubmitted || isKicked) && "opacity-60",
      )}
      style={{
        borderColor: "rgba(128, 128, 128, 0.15)",
        backgroundColor: isSubmitted
          ? "rgba(45, 154, 71, 0.04)"
          : isKicked
            ? "rgba(200, 74, 82, 0.04)"
            : focus.bg,
      }}
    >
      {/* Header: name + focus dot */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
        >
          {name[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="text-xs opacity-50">
            {isSubmitted ? "Submitted" : isKicked ? "Kicked" : focus.label}
          </p>
        </div>
        {!isSubmitted && !isKicked && (
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: focus.dot }}
          />
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="mb-1 flex justify-between text-xs opacity-60">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor:
                progress >= 100
                  ? "var(--tome-success, #2D9A47)"
                  : "var(--tome-indigo, #6366F1)",
            }}
          />
        </div>
      </div>

      {/* Violations */}
      {participant.violation_count > 0 && (
        <div
          className="mb-2 flex items-center gap-1 text-xs font-medium"
          style={{ color: "var(--tome-error, #C84A52)" }}
        >
          <AlertTriangle className="h-3 w-3" />
          {participant.violation_count} violation{participant.violation_count !== 1 ? "s" : ""}
        </div>
      )}

      {/* Actions */}
      {!isSubmitted && !isKicked && (
        <div className="flex gap-1 pt-1">
          <button
            onClick={() => onMessage?.(participant.student_id)}
            className="rounded-md p-1.5 text-xs opacity-40 transition-opacity hover:opacity-80"
            title="Send message"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onKick?.(participant.student_id)}
            className="rounded-md p-1.5 text-xs opacity-40 transition-opacity hover:opacity-80"
            style={{ color: "var(--tome-error, #C84A52)" }}
            title="Remove student"
          >
            <UserX className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
