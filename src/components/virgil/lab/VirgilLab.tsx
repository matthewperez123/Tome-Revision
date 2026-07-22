"use client"

/**
 * Virgil Lab — /virgil/lab
 *
 * Proves Virgil is a reusable product system: live event-driven stage,
 * every state as its reduced-motion still, every expression, every scale,
 * all book-world variants, speed/motion/theme/device controls, FPS and
 * asset diagnostics, and the full copy deck.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { VIRGIL_STATES } from "@/lib/virgil/state-machine"
import type { VirgilStageTheme } from "@/lib/virgil/palette"
import type { VirgilEvent, VirgilVariantId } from "@/lib/virgil/types"
import { useVirgilMachine } from "../Virgil"
import { LabToggle, Segmented } from "./controls"
import { Stage, type LabDevice, type LabLogEntry } from "./Stage"
import {
  ExpressionGallery,
  ScaleGallery,
  StateGallery,
  VariantGallery,
} from "./Galleries"
import { Diagnostics } from "./Diagnostics"

type ReducedMode = "auto" | "on" | "off"

function timeStamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false })
}

export function VirgilLab() {
  const machine = useVirgilMachine("idle")
  const [variant, setVariant] = useState<VirgilVariantId>("canon")
  const [speed, setSpeed] = useState(1)
  const [reducedMode, setReducedMode] = useState<ReducedMode>("auto")
  const [systemReduced, setSystemReduced] = useState(false)
  const [theme, setTheme] = useState<VirgilStageTheme>("light")
  const [device, setDevice] = useState<LabDevice>("desktop")
  const [sound, setSound] = useState(false)
  const [log, setLog] = useState<LabLogEntry[]>([])
  const prevState = useRef(machine.state)
  const prevAnnouncement = useRef(machine.announcement)

  // track the media query so "auto" is honest
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setSystemReduced(query.matches)
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  const reducedMotion =
    reducedMode === "auto" ? systemReduced : reducedMode === "on"

  const pushLog = useCallback((entry: Omit<LabLogEntry, "at">) => {
    setLog((prev) => [{ at: timeStamp(), ...entry }, ...prev].slice(0, 24))
  }, [])

  const onDispatch = useCallback(
    (event: VirgilEvent) => {
      pushLog({ kind: "event", text: formatEvent(event) })
      machine.dispatch(event)
    },
    [machine, pushLog],
  )

  useEffect(() => {
    if (prevState.current !== machine.state) {
      pushLog({ kind: "state", text: `state → ${machine.state}` })
      prevState.current = machine.state
    }
    if (machine.announcement && prevAnnouncement.current !== machine.announcement) {
      pushLog({ kind: "announcement", text: `live region: “${machine.announcement}”` })
      prevAnnouncement.current = machine.announcement
    }
  }, [machine.state, machine.announcement, pushLog])

  return (
    <div className="min-h-screen bg-[#14161C] font-sans text-[#EDE6D4]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* header */}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#C8A24B]">
              Tome · Internal system lab
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Virgil Lab
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#9A9484]">
              The lantern-bearing guide as a product system: {Object.keys(VIRGIL_STATES).length} semantic
              states, one typed event API, twelve book-world costumes, and a
              total reduced-motion mapping. Driven by events, never timers.
            </p>
          </div>
          <nav aria-label="Lab sections" className="flex gap-3 font-mono text-[11px] text-[#9A9484]">
            {["scales", "expressions", "states", "variants", "diagnostics"].map((id) => (
              <a key={id} href={`#${id}`} className="underline-offset-4 hover:text-[#F2C14E] hover:underline">
                {id}
              </a>
            ))}
          </nav>
        </header>

        {/* control bar */}
        <div className="mb-8 flex flex-wrap items-end gap-x-8 gap-y-4 rounded-xl border border-[#33363F] bg-[#1B1D24] p-4">
          <Segmented<VirgilStageTheme>
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "reader", label: "Reader sepia" },
            ]}
          />
          <Segmented<LabDevice>
            label="Device frame"
            value={device}
            onChange={setDevice}
            options={[
              { value: "desktop", label: "Desktop" },
              { value: "tablet", label: "Tablet" },
              { value: "mobile", label: "Mobile" },
            ]}
          />
          <Segmented<ReducedMode>
            label="Reduced motion"
            value={reducedMode}
            onChange={setReducedMode}
            options={[
              { value: "auto", label: `Auto (${systemReduced ? "reduce" : "no-preference"})` },
              { value: "on", label: "Force on" },
              { value: "off", label: "Force off" },
            ]}
          />
          <div>
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A9484]">
              Speed · {speed}×
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.25}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                aria-label="Animation speed"
                className="h-1.5 w-36 accent-[#C8A24B]"
              />
            </div>
          </div>
          <LabToggle
            label="Sound"
            checked={sound}
            onChange={setSound}
            hint="Pack ships muted by default; toggle is a lab stub — captions carry meaning."
          />
        </div>

        {/* stage */}
        <div className="mb-12">
          <Stage
            machine={machine}
            variant={variant}
            speed={speed}
            reducedMotion={reducedMotion}
            theme={theme}
            device={device}
            log={log}
            onDispatch={onDispatch}
          />
        </div>

        <div className="space-y-12">
          <ScaleGallery variant={variant} />
          <ExpressionGallery variant={variant} />
          <StateGallery variant={variant} />
          <VariantGallery variant={variant} onSelect={setVariant} />
          <Diagnostics />
        </div>

        <footer className="mt-14 border-t border-[#33363F] pt-6 text-[11px] leading-relaxed text-[#7C7768]">
          <p>
            System source: <code className="font-mono text-[#9A9484]">src/lib/virgil</code> ·{" "}
            <code className="font-mono text-[#9A9484]">src/components/virgil</code>. Docs:{" "}
            <code className="font-mono text-[#9A9484]">docs/design/virgil-*.md</code>. Static exports:{" "}
            <code className="font-mono text-[#9A9484]">public/virgil/posters</code>,{" "}
            <code className="font-mono text-[#9A9484]">public/virgil/runtime</code>.
          </p>
        </footer>
      </div>
    </div>
  )
}

function formatEvent(event: VirgilEvent): string {
  const { type, ...rest } = event
  const detail = Object.entries(rest)
    .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
    .join(" ")
  return detail ? `${type} ${detail}` : type
}
