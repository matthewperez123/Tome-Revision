"use client"

import { Input } from "@/components/ui/input"
import type { SessionSettings } from "@/lib/guided-learning-types"
import type { WizardState } from "./create-session-wizard"

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

const TOGGLES: {
  key: keyof SessionSettings
  label: string
  help: string
}[] = [
  {
    key: "lockNavigation",
    label: "Lock Navigation",
    help: "Dim the sidebar and prevent students from navigating away during the session.",
  },
  {
    key: "autoAdvance",
    label: "Auto-Advance Stations",
    help: "Automatically move students to the next station when they complete the current one.",
  },
  {
    key: "allowEarlyExit",
    label: "Allow Early Exit",
    help: "Let students leave the session before it ends. Their teacher will be notified.",
  },
  {
    key: "showOtherStudentsProgress",
    label: "Show Peer Progress",
    help: "Let students see which station their classmates are on (names and stations only, no scores).",
  },
  {
    key: "pauseOnTeacherDisconnect",
    label: "Pause on Teacher Disconnect",
    help: "Automatically pause the session if the teacher loses connection for more than 60 seconds.",
  },
]

export function StepSettings({ state, onChange }: Props) {
  const settings = state.settings

  const updateSetting = <K extends keyof SessionSettings>(
    key: K,
    value: SessionSettings[K],
  ) => {
    onChange({ settings: { ...settings, [key]: value } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Session Settings</h2>
        <p className="text-xs opacity-50">
          Configure how the session behaves for students.
        </p>
      </div>

      {/* Toggles */}
      <div className="space-y-1">
        {TOGGLES.map(({ key, label, help }) => (
          <label
            key={key}
            className="flex items-start gap-3 rounded-lg px-3 py-3 cursor-pointer transition-colors hover:bg-muted/30"
          >
            <input
              type="checkbox"
              checked={!!settings[key]}
              onChange={(e) => updateSetting(key, e.target.checked as any)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs opacity-50">{help}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Collaborative annotations */}
      <div className="space-y-3 rounded-lg border px-4 py-3" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
        <div>
          <h3 className="text-sm font-semibold">Margin Annotations</h3>
          <p className="text-xs opacity-50">
            Let students highlight passages and leave notes or questions while they read.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.annotationsEnabled}
            onChange={(e) => onChange({ annotationsEnabled: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-gray-300"
          />
          <div>
            <p className="text-sm font-medium">Enable Annotations</p>
            <p className="text-xs opacity-50">
              Turn margin annotations on for this session&rsquo;s readings.
            </p>
          </div>
        </label>

        {state.annotationsEnabled && (
          <>
            <div className="space-y-2 pl-7">
              <p className="text-xs font-semibold opacity-70">Who can see annotations?</p>
              {([
                {
                  value: "collaborative" as const,
                  label: "Collaborative",
                  help: "The whole class shares one margin. Students see and reply to each other.",
                },
                {
                  value: "private_to_teacher" as const,
                  label: "Private to teacher",
                  help: "Each student annotates privately. Only they and you can see their notes.",
                },
              ]).map(({ value, label, help }) => (
                <label key={value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="annotation-visibility"
                    checked={state.annotationVisibility === value}
                    onChange={() => onChange({ annotationVisibility: value })}
                    className="mt-0.5 h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs opacity-50">{help}</p>
                  </div>
                </label>
              ))}
            </div>

            <label className="flex items-start gap-3 pl-7 cursor-pointer">
              <input
                type="checkbox"
                checked={state.presenceEnabled}
                onChange={(e) => onChange({ presenceEnabled: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
              />
              <div>
                <p className="text-sm font-medium">Show Live Presence</p>
                <p className="text-xs opacity-50">
                  Display avatars of classmates reading the same passage in real time.
                </p>
              </div>
            </label>
          </>
        )}
      </div>

      {/* Hint budget */}
      <div className="space-y-2 rounded-lg border px-4 py-3" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
        <label className="text-sm font-semibold">Hint Budget Per Student</label>
        <p className="text-xs opacity-50">
          How many hints can each student request? Leave empty for unlimited.
        </p>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={0}
            value={settings.hintBudgetPerStudent ?? ""}
            onChange={(e) => {
              const v = e.target.value
              updateSetting("hintBudgetPerStudent", v ? parseInt(v) : null)
            }}
            placeholder="Unlimited"
            className="w-28 text-sm"
          />
          {settings.hintBudgetPerStudent != null && (
            <button
              onClick={() => updateSetting("hintBudgetPerStudent", null)}
              className="text-xs font-medium transition-colors hover:underline"
              style={{ color: "var(--tome-indigo, #6366F1)" }}
            >
              Set Unlimited
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
