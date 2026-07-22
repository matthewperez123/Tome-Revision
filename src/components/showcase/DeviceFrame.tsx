"use client"

/**
 * DeviceFrame — a labeled device frame around the SAME responsive UI.
 *
 * Not an iframe, not a second app: the frame constrains the width of a CSS
 * container (`@container`), and showcase layouts use container queries and
 * fluid grids so they respond to the frame width exactly as they would to a
 * real device's viewport. Desktop renders unconstrained.
 */

import type { ReactNode } from "react"
import { SHOWCASE_DEVICE_LABELS, type ShowcaseDevice } from "@/lib/showcase/session"

const FRAME_WIDTHS: Record<ShowcaseDevice, string | undefined> = {
  desktop: undefined,
  tablet: "768px",
  mobile: "400px",
}

export function DeviceFrame({
  device,
  label,
  children,
}: {
  device: ShowcaseDevice
  label: string
  children: ReactNode
}) {
  const width = FRAME_WIDTHS[device]
  const framed = width !== undefined

  const inner = (
    <div className="@container min-h-[420px] bg-[var(--la-surface)] p-4 @sm:p-6" data-device={device}>
      {children}
    </div>
  )

  if (!framed) {
    return (
      <section
        aria-label={`${SHOWCASE_DEVICE_LABELS[device]} frame — ${label}`}
        className="overflow-hidden rounded-2xl border border-[var(--la-surface-sunken)] shadow-[var(--la-shadow-raised,0_1px_3px_rgba(20,27,46,0.08))]"
      >
        {inner}
      </section>
    )
  }

  return (
    <div className="flex justify-center">
      <section
        aria-label={`${SHOWCASE_DEVICE_LABELS[device]} frame — ${label}`}
        style={{ width: `min(${width}, 100%)` }}
        className="overflow-hidden rounded-2xl border border-[var(--la-surface-sunken)] shadow-[var(--la-shadow-raised,0_1px_3px_rgba(20,27,46,0.08))]"
      >
        <div className="flex items-center gap-2 border-b border-[var(--la-surface-sunken)] bg-[var(--la-page)] px-3 py-1.5">
          <span aria-hidden className="flex gap-1">
            <i className="block size-2 rounded-full bg-[var(--la-ink-faint)]/40" />
            <i className="block size-2 rounded-full bg-[var(--la-ink-faint)]/40" />
            <i className="block size-2 rounded-full bg-[var(--la-ink-faint)]/40" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--la-ink-faint)]">
            {SHOWCASE_DEVICE_LABELS[device]} frame · {label}
          </span>
        </div>
        {inner}
      </section>
    </div>
  )
}
