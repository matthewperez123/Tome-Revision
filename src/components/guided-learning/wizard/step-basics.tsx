"use client"

import { Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TIME_LIMIT_PRESETS } from "@/lib/guided-learning-types"
import type { WizardState } from "./create-session-wizard"

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

export function StepBasics({ state, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Session Title</label>
        <Input
          value={state.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Friday Reading: Odyssey Book IX"
          className="text-sm"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Description <span className="font-normal opacity-40">(optional)</span>
        </label>
        <textarea
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="What should students focus on in this session?"
          rows={3}
          className="w-full rounded-lg border border-transparent bg-[var(--tome-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--tome-accent)] focus:outline-none resize-none"
        />
      </div>

      {/* Schedule */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Scheduled Start <span className="font-normal opacity-40">(optional)</span>
        </label>
        <Input
          type="datetime-local"
          value={state.scheduledStartAt}
          onChange={(e) => onChange({ scheduledStartAt: e.target.value })}
          className="w-64 text-sm"
        />
        <p className="text-xs opacity-40">
          Leave empty to start manually. Students will be notified when you schedule.
        </p>
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="h-4 w-4 opacity-60" />
          Total Session Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_LIMIT_PRESETS.map((t) => (
            <button
              key={t}
              onClick={() => onChange({ durationMinutes: t })}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                borderColor:
                  state.durationMinutes === t
                    ? "var(--tome-indigo, #6366F1)"
                    : "rgba(128, 128, 128, 0.2)",
                backgroundColor:
                  state.durationMinutes === t
                    ? "rgba(99, 102, 241, 0.08)"
                    : "transparent",
                color:
                  state.durationMinutes === t
                    ? "var(--tome-indigo, #6366F1)"
                    : "inherit",
              }}
            >
              {t}m
            </button>
          ))}
          <Input
            type="number"
            min={1}
            max={240}
            value={
              TIME_LIMIT_PRESETS.includes(state.durationMinutes as (typeof TIME_LIMIT_PRESETS)[number])
                ? ""
                : state.durationMinutes
            }
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (v > 0) onChange({ durationMinutes: v })
            }}
            placeholder="Custom"
            className="w-24 text-sm"
          />
        </div>
      </div>

      {/* Mode */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Session Mode</label>
        <div className="flex gap-3">
          {(["strict", "lenient"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onChange({ mode: m })}
              className="flex-1 rounded-xl border-2 p-3 text-left transition-colors"
              style={{
                borderColor:
                  state.mode === m
                    ? "var(--tome-indigo, #6366F1)"
                    : "rgba(128, 128, 128, 0.15)",
                backgroundColor:
                  state.mode === m ? "rgba(99, 102, 241, 0.06)" : "transparent",
              }}
            >
              <p className="text-sm font-semibold capitalize">{m}</p>
              <p className="text-xs opacity-50">
                {m === "strict"
                  ? "Focus violations tracked and counted"
                  : "Warnings only, no violation count"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
