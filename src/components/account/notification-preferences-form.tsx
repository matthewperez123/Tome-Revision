"use client"

import { useState, useTransition } from "react"
import {
  type NotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/actions/notification-preferences"
import { cn } from "@/lib/utils"

interface Row {
  key: keyof NotificationPreferences
  title: string
  description: string
}

const ROWS: Row[] = [
  {
    key: "emailOnNewMessage",
    title: "New messages",
    description:
      "Email me when a classmate or teacher sends me a message (at most one every few minutes).",
  },
  {
    key: "emailOnClassroomInvite",
    title: "Classroom invites",
    description: "Email me when I'm added to a classroom.",
  },
]

function Switch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)] focus-visible:ring-offset-2 disabled:opacity-50",
        checked ? "bg-[var(--tome-accent)]" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block size-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  )
}

export function NotificationPreferencesForm({
  initial,
}: {
  initial: NotificationPreferences
}) {
  const [prefs, setPrefs] = useState(initial)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function toggle(key: keyof NotificationPreferences) {
    const next = { ...prefs, [key]: !prefs[key] }
    const previous = prefs
    setPrefs(next) // optimistic
    setError(null)
    startTransition(async () => {
      const res = await updateNotificationPreferences({ [key]: next[key] })
      if (!res.ok) {
        setPrefs(previous) // revert
        setError(res.error)
      }
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
      {ROWS.map((row) => (
        <div
          key={row.key}
          className="px-5 py-4 flex items-start justify-between gap-4"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium">{row.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {row.description}
            </p>
          </div>
          <Switch
            checked={prefs[row.key]}
            disabled={pending}
            onChange={() => toggle(row.key)}
            label={row.title}
          />
        </div>
      ))}
      {error ? (
        <p className="px-5 py-3 text-xs text-rose-600">{error}</p>
      ) : null}
    </div>
  )
}
