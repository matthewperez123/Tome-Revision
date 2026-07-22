"use client"

/**
 * ShowcaseShell — the chrome strip above the device frame.
 *
 * "Showcase mode" badge · role switcher · device switcher · guided/free
 * mode toggle · captions toggle · share link · one-click reset. Every
 * control is a real button with a visible focus ring; nothing is a dead
 * control.
 */

import {
  SHOWCASE_DEVICES,
  SHOWCASE_DEVICE_LABELS,
  SHOWCASE_MODES,
  SHOWCASE_ROLES,
  SHOWCASE_ROLE_LABELS,
  type ShowcaseDevice,
  type ShowcaseMode,
  type ShowcaseRole,
} from "@/lib/showcase/session"

export interface ShowcaseShellProps {
  role: ShowcaseRole
  device: ShowcaseDevice
  mode: ShowcaseMode
  captions: boolean
  copied: boolean
  onRole: (role: ShowcaseRole) => void
  onDevice: (device: ShowcaseDevice) => void
  onMode: (mode: ShowcaseMode) => void
  onCaptions: (captions: boolean) => void
  onShare: () => void
  onReset: () => void
}

const BTN =
  "rounded-full px-3 py-1.5 font-sans text-xs font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"

function SegmentedGroup<T extends string>({
  label,
  options,
  labels,
  value,
  onChange,
  tourId,
}: {
  label: string
  options: readonly T[]
  labels: Record<T, string>
  value: T
  onChange: (v: T) => void
  tourId?: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      data-tour={tourId}
      className="inline-flex items-center gap-0.5 rounded-full border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-0.5"
    >
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={`${BTN} ${
              active
                ? "bg-[var(--la-primary)] text-[var(--la-primary-ink)]"
                : "text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)]"
            }`}
          >
            {labels[opt]}
          </button>
        )
      })}
    </div>
  )
}

export function ShowcaseShell({
  role,
  device,
  mode,
  captions,
  copied,
  onRole,
  onDevice,
  onMode,
  onCaptions,
  onShare,
  onReset,
}: ShowcaseShellProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--la-surface-sunken)] bg-[var(--la-page)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-3 py-2.5 sm:px-6">
        <span
          data-tour="badge"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--la-wisdom-soft)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--la-wisdom-deep)]"
          title="Seeded demo data. No login. No writes to real user records."
        >
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-[var(--la-wisdom)]" />
          Showcase mode
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <SegmentedGroup
            label="Switch role"
            options={SHOWCASE_ROLES}
            labels={SHOWCASE_ROLE_LABELS}
            value={role}
            onChange={onRole}
            tourId="role-switcher"
          />
          <SegmentedGroup
            label="Switch device frame"
            options={SHOWCASE_DEVICES}
            labels={SHOWCASE_DEVICE_LABELS}
            value={device}
            onChange={onDevice}
            tourId="device-switcher"
          />
          <SegmentedGroup
            label="Tour or explore freely"
            options={SHOWCASE_MODES}
            labels={{ tour: "Guided tour", explore: "Free explore" }}
            value={mode}
            onChange={onMode}
          />
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={captions}
            onClick={() => onCaptions(!captions)}
            className={`${BTN} border border-[var(--la-surface-sunken)] text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)]`}
          >
            {captions ? "Captions on" : "Captions off"}
          </button>
          <button
            type="button"
            onClick={onShare}
            className={`${BTN} border border-[var(--la-surface-sunken)] text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)]`}
          >
            {copied ? "Link copied ✓" : "Copy share link"}
          </button>
          <a
            href="/demo"
            className={`${BTN} border border-[var(--la-surface-sunken)] text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)]`}
          >
            Book a school demo
          </a>
          <button
            type="button"
            data-tour="reset"
            onClick={onReset}
            className={`${BTN} bg-[var(--la-error)] text-white hover:opacity-90`}
            title="Clear all showcase data and restart from the seeded beginning"
          >
            Reset showcase
          </button>
        </div>
      </div>
    </header>
  )
}
