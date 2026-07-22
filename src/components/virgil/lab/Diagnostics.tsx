"use client"

/**
 * Lab diagnostics: live FPS sampling, asset-loading checks for the
 * public/virgil exports, a client-side contact-sheet exporter, system
 * counts, and the full copy deck browser.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { VIRGIL_COPY, VIRGIL_COPY_LINE_COUNT } from "@/lib/virgil/copy"
import { VIRGIL_STATES } from "@/lib/virgil/state-machine"
import { VIRGIL_VARIANT_IDS } from "@/lib/virgil/variants"
import { VIRGIL_EXPRESSION_IDS } from "../expressions"
import { LabSection } from "./controls"

/* ── FPS ────────────────────────────────────────────────────────────── */

function useFps(): number {
  const [fps, setFps] = useState(0)
  const frames = useRef(0)
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      frames.current += 1
      if (now - last >= 500) {
        setFps(Math.round((frames.current * 1000) / (now - last)))
        frames.current = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return fps
}

/* ── asset checks ───────────────────────────────────────────────────── */

const VIRGIL_PUBLIC_ASSETS = [
  "/virgil/posters/contact-sheet.svg",
  "/virgil/posters/turnaround.svg",
  "/virgil/posters/expression-sheet.svg",
  "/virgil/posters/variant-sheet.svg",
  "/virgil/posters/silhouette-test.svg",
  "/virgil/posters/palette.svg",
  "/virgil/runtime/virgil-mark.svg",
  "/virgil/runtime/virgil-grayscale.svg",
  "/virgil/runtime/virgil-offline.svg",
  "/virgil/runtime/virgil-loading.svg",
  "/virgil/runtime/virgil-app-icon.svg",
] as const

type AssetStatus = "pending" | "ok" | "missing"

function useAssetChecks(): { path: string; status: AssetStatus; bytes: number | null }[] {
  const [results, setResults] = useState<
    { path: string; status: AssetStatus; bytes: number | null }[]
  >(VIRGIL_PUBLIC_ASSETS.map((path) => ({ path, status: "pending", bytes: null })))

  useEffect(() => {
    let cancelled = false
    async function check() {
      const settled = await Promise.all(
        VIRGIL_PUBLIC_ASSETS.map(async (path) => {
          try {
            const res = await fetch(path, { method: "HEAD" })
            const bytes = Number(res.headers.get("content-length")) || null
            return { path, status: res.ok ? ("ok" as const) : ("missing" as const), bytes }
          } catch {
            return { path, status: "missing" as const, bytes: null }
          }
        }),
      )
      if (!cancelled) setResults(settled)
    }
    check()
    return () => {
      cancelled = true
    }
  }, [])

  return results
}

/* ── contact-sheet export ───────────────────────────────────────────── */

function exportContactSheet() {
  // Serialize the state-gallery SVGs into one nested-SVG contact sheet.
  const figures = Array.from(
    document.querySelectorAll<SVGSVGElement>("[data-contact-sheet-source] svg[data-virgil-art]"),
  )
  if (figures.length === 0) return
  const cell = 120
  const cols = 8
  const rows = Math.ceil(figures.length / cols)
  const label = 22
  const body = figures
    .map((svg, i) => {
      const x = (i % cols) * cell
      const y = Math.floor(i / cols) * (cell + label)
      const clone = svg.cloneNode(true) as SVGSVGElement
      clone.setAttribute("width", String(cell - 16))
      clone.setAttribute("height", String(Math.round(((cell - 16) * 320) / 240)))
      return `<g transform="translate(${x + 8} ${y})">${clone.outerHTML}</g>` +
        `<text x="${x + cell / 2}" y="${y + cell + 4}" text-anchor="middle" font-family="monospace" font-size="9" fill="#5C584C">${svg.dataset.virgilArt}</text>`
    })
    .join("\n")
  const sheet =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cell}" height="${rows * (cell + label)}" viewBox="0 0 ${cols * cell} ${rows * (cell + label)}">` +
    `<rect width="100%" height="100%" fill="#F5EFE0"/>\n${body}\n</svg>`
  const blob = new Blob([sheet], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "virgil-contact-sheet.svg"
  a.click()
  URL.revokeObjectURL(url)
}

/* ── section ────────────────────────────────────────────────────────── */

export function Diagnostics() {
  const fps = useFps()
  const assets = useAssetChecks()
  const [exported, setExported] = useState(false)
  const [openCopy, setOpenCopy] = useState<string | null>(null)

  const onExport = useCallback(() => {
    exportContactSheet()
    setExported(true)
    window.setTimeout(() => setExported(false), 2000)
  }, [])

  const okCount = assets.filter((a) => a.status === "ok").length
  const stateCount = Object.keys(VIRGIL_STATES).length

  return (
    <LabSection id="diagnostics" kicker="05 · Proof" title="Performance, assets & copy deck">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* performance */}
        <div className="rounded-lg border border-[#33363F] bg-[#1B1D24] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A9484]">
            Performance
          </p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-[#EDE6D4]">
            {fps}
            <span className="ml-1 text-sm font-normal text-[#9A9484]">fps</span>
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#7C7768]">
            Sampled over 500ms via requestAnimationFrame while the stage runs.
            Target: 60 on modern hardware. All animation is transform/opacity;
            loops park when the tab hides (sleep state).
          </p>
          <dl className="mt-4 space-y-1.5 font-mono text-[11px] text-[#C9C3B2]">
            <div className="flex justify-between"><dt>states</dt><dd>{stateCount}</dd></div>
            <div className="flex justify-between"><dt>expressions</dt><dd>{VIRGIL_EXPRESSION_IDS.length}</dd></div>
            <div className="flex justify-between"><dt>variants</dt><dd>{VIRGIL_VARIANT_IDS.length}</dd></div>
            <div className="flex justify-between"><dt>copy lines</dt><dd>{VIRGIL_COPY_LINE_COUNT}</dd></div>
          </dl>
        </div>

        {/* assets */}
        <div className="rounded-lg border border-[#33363F] bg-[#1B1D24] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A9484]">
            Asset loading · {okCount}/{assets.length} ok
          </p>
          <ul className="mt-3 space-y-1 font-mono text-[11px]">
            {assets.map((asset) => (
              <li key={asset.path} className="flex items-center justify-between gap-2">
                <span className="truncate text-[#C9C3B2]">{asset.path}</span>
                <span
                  className={
                    asset.status === "ok"
                      ? "text-[#A8C69F]"
                      : asset.status === "missing"
                        ? "text-[#E07856]"
                        : "text-[#5C584C]"
                  }
                >
                  {asset.status === "ok"
                    ? `ok${asset.bytes ? ` · ${(asset.bytes / 1024).toFixed(1)}kB` : ""}`
                    : asset.status}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onExport}
            className="mt-4 w-full rounded-md border border-[#C8A24B] bg-[#2A2517] px-3 py-2 text-xs font-semibold text-[#F2C14E] transition-colors hover:bg-[#35301D] focus-visible:outline-2 focus-visible:outline-[#C8A24B]"
          >
            {exported ? "Contact sheet downloaded ✓" : "Export contact sheet (.svg)"}
          </button>
          <p className="mt-1.5 text-[10px] text-[#7C7768]">
            Serializes the state gallery above into a single nested-SVG sheet.
          </p>
        </div>

        {/* copy deck */}
        <div className="rounded-lg border border-[#33363F] bg-[#1B1D24] p-4 lg:row-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A9484]">
            Voice &amp; copy deck · {VIRGIL_COPY_LINE_COUNT} lines
          </p>
          <div className="mt-3 max-h-[420px] space-y-1 overflow-y-auto pr-1">
            {Object.entries(VIRGIL_COPY).map(([key, lines]) => (
              <div key={key} className="rounded border border-[#2A2D36]">
                <button
                  type="button"
                  onClick={() => setOpenCopy(openCopy === key ? null : key)}
                  aria-expanded={openCopy === key}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#C9C3B2] hover:text-[#EDE6D4] focus-visible:outline-2 focus-visible:outline-[#C8A24B]"
                >
                  <span>{key}</span>
                  <span className="font-mono text-[10px] text-[#7C7768]">{lines.length}</span>
                </button>
                {openCopy === key && (
                  <ul className="space-y-1 border-t border-[#2A2D36] px-2.5 py-2">
                    {lines.map((line) => (
                      <li key={line} className="text-[11px] leading-relaxed text-[#9A9484]">
                        “{line}”
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LabSection>
  )
}
