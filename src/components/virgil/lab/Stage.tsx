"use client"

/**
 * Lab stage: the live, animated Virgil inside a device frame with the
 * current theme, plus the event deck and a rolling event/announcement log.
 */

import { useState } from "react"
import { VIRGIL_STATES } from "@/lib/virgil/state-machine"
import { VIRGIL_STAGE_THEMES, type VirgilStageTheme } from "@/lib/virgil/palette"
import type { VirgilEvent, VirgilVariantId } from "@/lib/virgil/types"
import { Virgil, type VirgilMachine } from "../Virgil"
import { LAB_EVENT_GROUPS } from "./events"

export type LabDevice = "desktop" | "tablet" | "mobile"

export const LAB_DEVICE_WIDTHS: Record<LabDevice, number> = {
  desktop: 1040,
  tablet: 700,
  mobile: 380,
}

export interface LabLogEntry {
  at: string
  text: string
  kind: "event" | "state" | "announcement"
}

export function Stage({
  machine,
  variant,
  speed,
  reducedMotion,
  theme,
  device,
  log,
  onDispatch,
}: {
  machine: VirgilMachine
  variant: VirgilVariantId
  speed: number
  reducedMotion: boolean
  theme: VirgilStageTheme
  device: LabDevice
  log: LabLogEntry[]
  onDispatch: (event: VirgilEvent) => void
}) {
  const [compact, setCompact] = useState(false)
  const defn = VIRGIL_STATES[machine.state]
  const tokens = VIRGIL_STAGE_THEMES[theme]
  const isMobileBust = device === "mobile" || compact

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* stage */}
      <div>
        <div
          className="mx-auto overflow-hidden rounded-xl border border-[#3A3D46] transition-[max-width] duration-300"
          style={{ maxWidth: LAB_DEVICE_WIDTHS[device] }}
          data-device-frame={device}
        >
          <div
            className="flex min-h-[380px] items-end justify-center px-8 pb-0 pt-10 transition-colors duration-300"
            style={{ backgroundColor: tokens.page }}
          >
            <Virgil
              state={machine.state}
              variant={variant}
              size={device === "mobile" ? 200 : 256}
              bust={isMobileBust}
              speed={speed}
              reducedMotion={reducedMotion}
              announcement={machine.announcement}
            />
          </div>
          <div
            className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5 font-mono text-[11px]"
            style={{
              backgroundColor: tokens.surface,
              borderColor: theme === "dark" ? "#2E3444" : "#D9CFB4",
              color: tokens.ink,
            }}
          >
            <span>
              state: <strong>{machine.state}</strong> · {defn.category} · {defn.kind}
            </span>
            <span>{defn.motion}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[12px] text-[#9A9484]">
            Frame: {device} · {LAB_DEVICE_WIDTHS[device]}px
            {isMobileBust ? " · compact bust" : ""}
          </p>
          <button
            type="button"
            onClick={() => setCompact((c) => !c)}
            aria-pressed={compact}
            className="rounded-md border border-[#3A3D46] px-2.5 py-1 text-[11px] text-[#C9C3B2] transition-colors hover:text-[#EDE6D4] focus-visible:outline-2 focus-visible:outline-[#C8A24B]"
          >
            {compact ? "Full body" : "Force compact bust"}
          </button>
        </div>

        {/* announcement log */}
        <div className="mt-4 rounded-lg border border-[#33363F] bg-[#1B1D24] p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A9484]">
            Event &amp; live-region log
          </p>
          <ol className="max-h-36 space-y-1 overflow-y-auto font-mono text-[11px]">
            {log.length === 0 && (
              <li className="text-[#5C584C]">No events yet — press a button on the deck.</li>
            )}
            {log.map((entry, i) => (
              <li key={`${entry.at}-${i}`} className="flex gap-2">
                <span className="text-[#5C584C]">{entry.at}</span>
                <span
                  className={
                    entry.kind === "event"
                      ? "text-[#8FB4D9]"
                      : entry.kind === "announcement"
                        ? "text-[#F2C14E]"
                        : "text-[#A8C69F]"
                  }
                >
                  {entry.kind === "event" ? "→" : entry.kind === "announcement" ? "◉" : "●"} {entry.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* event deck */}
      <div className="max-h-[560px] space-y-4 overflow-y-auto rounded-lg border border-[#33363F] bg-[#1B1D24] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A9484]">
          Event deck — semantic product events
        </p>
        {LAB_EVENT_GROUPS.map((group) => (
          <fieldset key={group.category}>
            <legend className="mb-1.5 text-xs font-semibold text-[#C8A24B]">
              {group.label}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {group.buttons.map((button) => (
                <button
                  key={button.label}
                  type="button"
                  onClick={() => onDispatch(button.event)}
                  className="rounded border border-[#3A3D46] bg-[#22252E] px-2 py-1 text-[11px] text-[#C9C3B2] transition-colors hover:border-[#C8A24B] hover:text-[#F2C14E] focus-visible:outline-2 focus-visible:outline-[#C8A24B] active:translate-y-px"
                >
                  {button.label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
