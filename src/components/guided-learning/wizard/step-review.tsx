"use client"

import { BookOpen, Brain, PenTool, Clock, Users, Save, Play, CalendarClock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { StationType } from "@/lib/guided-learning-types"
import { STATION_TYPE_LABELS } from "@/lib/guided-station-utils"
import type { WizardState } from "./create-session-wizard"

interface Props {
  state: WizardState
  onSubmit: (action: "draft" | "schedule" | "start") => void
  isSubmitting: boolean
}

const TYPE_ICONS: Record<StationType, typeof BookOpen> = {
  reading: BookOpen,
  quiz: Brain,
  reflection: PenTool,
}

export function StepReview({ state, onSubmit, isSubmitting }: Props) {
  const totalTargetMinutes = state.stations.reduce((s, st) => s + st.target_minutes, 0)
  const hasSchedule = !!state.scheduledStartAt

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Review Session</h2>
        <p className="text-xs opacity-50">
          Confirm everything looks right before creating.
        </p>
      </div>

      {/* Summary card */}
      <div
        className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "rgba(128,128,128,0.12)" }}
      >
        <div>
          <h3 className="text-lg font-bold">{state.title}</h3>
          {state.description && (
            <p className="mt-1 text-sm opacity-60">{state.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1.5 opacity-60">
            <Clock className="h-3.5 w-3.5" />
            {state.durationMinutes}m session
          </span>
          <span className="flex items-center gap-1.5 opacity-60">
            <Users className="h-3.5 w-3.5" />
            {state.selectedStudentIds.size} students
          </span>
          {hasSchedule && (
            <span className="flex items-center gap-1.5 opacity-60">
              <CalendarClock className="h-3.5 w-3.5" />
              {new Date(state.scheduledStartAt).toLocaleString()}
            </span>
          )}
          <span className="capitalize opacity-60">{state.mode} mode</span>
        </div>

        {/* Stations */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-40">
            Stations ({state.stations.length})
          </p>
          {state.stations.map((s, i) => {
            const Icon = TYPE_ICONS[s.type]
            return (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <span className="w-5 text-right text-xs font-bold opacity-30">
                  {i + 1}
                </span>
                <Icon className="h-3.5 w-3.5" style={{ color: "var(--tome-indigo, #6366F1)" }} />
                <span className="flex-1 truncate">
                  {s.title || STATION_TYPE_LABELS[s.type]}
                  {s.book_title && (
                    <span className="ml-2 opacity-40">({s.book_title})</span>
                  )}
                </span>
                <span className="text-xs opacity-40">{s.target_minutes}m</span>
              </div>
            )
          })}
          <div className="flex justify-end text-xs opacity-40">
            Total station time: {totalTargetMinutes}m
            {totalTargetMinutes > state.durationMinutes && (
              <span className="ml-2 font-semibold" style={{ color: "var(--tome-error, #C84A52)" }}>
                — exceeds session duration
              </span>
            )}
          </div>
        </div>

        {/* Settings summary */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-40">
            Settings
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-50">
            {state.settings.lockNavigation && <span>Navigation locked</span>}
            {state.settings.autoAdvance && <span>Auto-advance</span>}
            {state.settings.allowEarlyExit && <span>Early exit allowed</span>}
            {state.settings.showOtherStudentsProgress && <span>Peer progress visible</span>}
            {state.settings.pauseOnTeacherDisconnect && <span>Pause on disconnect</span>}
            <span>
              Hints: {state.settings.hintBudgetPerStudent ?? "Unlimited"}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => onSubmit("draft")}
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save as Draft
        </Button>

        {hasSchedule && (
          <Button
            onClick={() => onSubmit("schedule")}
            disabled={isSubmitting}
            className="gap-2 text-white"
            style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
            Schedule Session
          </Button>
        )}

        <Button
          onClick={() => onSubmit("start")}
          disabled={isSubmitting}
          className="gap-2 text-white"
          style={{ backgroundColor: "var(--tome-success, #2D9A47)" }}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Start Now
        </Button>
      </div>
    </div>
  )
}
