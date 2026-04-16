"use client"

import { AlertTriangle, UserX, MessageSquare, BookOpen, Brain, PenTool, Feather, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ParticipantWithProfile, GuidedPresence, FocusState, Station, StationType } from "@/lib/guided-learning-types"
import { STATION_TYPE_LABELS } from "@/lib/guided-station-utils"

const STATION_ICONS: Record<StationType, typeof BookOpen> = {
  reading: BookOpen,
  quiz: Brain,
  reflection: PenTool,
}

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
  /** Ordered stations for this session (used to show station indicator) */
  stations?: Station[]
  onKick?: (studentId: string) => void
  onMessage?: (studentId: string) => void
  onAdvance?: (studentId: string) => void
}

/**
 * Per-student live status tile for the teacher monitoring dashboard.
 * Shows name, progress, focus indicator, violation count.
 */
export function StudentMonitorCard({
  participant,
  presence,
  stations,
  onKick,
  onMessage,
  onAdvance,
}: StudentMonitorCardProps) {
  const focusState: FocusState = presence?.focusState ?? "focused"
  const focus = FOCUS_COLORS[focusState]
  const name = participant.profiles?.display_name ?? "Student"
  const progress = presence?.progressPct ?? participant.progress_pct

  const isSubmitted = participant.status === "submitted" || participant.status === "completed"
  const isKicked = participant.status === "kicked"

  // Station info
  const currentStationIndex = participant.current_station_index ?? 0
  const currentStation = stations?.find((s) => s.station_index === currentStationIndex)
  const StationIcon = currentStation ? STATION_ICONS[currentStation.type] : null
  const hintsUsed = participant.hints_used ?? 0

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

      {/* Station indicator */}
      {currentStation && StationIcon && stations && stations.length > 1 && (
        <div className="mb-2 flex items-center gap-1.5 text-xs opacity-50">
          <StationIcon className="h-3 w-3" />
          <span>
            {STATION_TYPE_LABELS[currentStation.type]} — Station {currentStationIndex + 1}/{stations.length}
          </span>
        </div>
      )}

      {/* Hints used */}
      {hintsUsed > 0 && (
        <div className="mb-2 flex items-center gap-1 text-xs opacity-50">
          <Feather className="h-3 w-3" style={{ color: "var(--gold-default, #B8924A)" }} />
          Hints: {hintsUsed}
        </div>
      )}

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
          {onAdvance && stations && stations.length > 1 && (
            <button
              onClick={() => onAdvance(participant.student_id)}
              className="rounded-md p-1.5 text-xs opacity-40 transition-opacity hover:opacity-80"
              title="Advance to next station"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          )}
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
