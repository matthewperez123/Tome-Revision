"use client"

/**
 * JourneyRecord — the shareable learning record for a completed journey.
 *
 * A certificate-style card rendered as inline SVG, downloadable as SVG or
 * PNG (client-side canvas rasterization — no server, no paid calls).
 *
 * Honesty rule: every number on the card comes from the real persisted
 * journey progress (days completed, Wisdom banked, Seals earned). It
 * claims nothing the reader has not done.
 */
import { useCallback, useRef, useState } from "react"
import type { JourneyTemplate } from "@/lib/journeys/types"
import type { JourneyProgress } from "@/lib/journeys/progress"
import { journeyCompletedCount, journeyTotalWisdom } from "@/lib/journeys/progress"
import { la } from "@/components/trials/session/shared"

export interface JourneyRecordProps {
  template: JourneyTemplate
  progress: JourneyProgress
}

const W = 880
const H = 520

function formatDate(iso: string | undefined): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return "—"
  }
}

export function JourneyRecord({ template, progress }: JourneyRecordProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const totalDays = template.days.length
  const daysCompleted = journeyCompletedCount(progress)
  const wisdom = journeyTotalWisdom(progress)
  const complete = daysCompleted >= totalDays
  const sealNames = template.days
    .filter((d) => d.milestoneSeal && progress.seals.includes(d.milestoneSeal.sealId))
    .map((d) => d.milestoneSeal!.name)
  if (progress.seals.includes(template.finalReward.sealId)) {
    sealNames.push(template.finalReward.sealName)
  }
  const lastCompletedAt = Object.values(progress.days)
    .map((d) => d.completedAt)
    .sort()
    .at(-1)

  const triggerDownload = useCallback((href: string, filename: string) => {
    const a = document.createElement("a")
    a.href = href
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [])

  const downloadSvg = useCallback(() => {
    setDownloadError(null)
    const node = svgRef.current
    if (!node) return
    try {
      const serialized = new XMLSerializer().serializeToString(node)
      const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      triggerDownload(url, `${template.id}-learning-record.svg`)
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch {
      setDownloadError("SVG download failed in this browser.")
    }
  }, [template.id, triggerDownload])

  const downloadPng = useCallback(() => {
    setDownloadError(null)
    const node = svgRef.current
    if (!node) return
    try {
      const serialized = new XMLSerializer().serializeToString(node)
      const svgBlob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas")
          canvas.width = W * 2
          canvas.height = H * 2
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("no 2d context")
          ctx.scale(2, 2)
          ctx.drawImage(img, 0, 0, W, H)
          URL.revokeObjectURL(url)
          canvas.toBlob((blob) => {
            if (!blob) {
              setDownloadError("PNG export failed in this browser.")
              return
            }
            const pngUrl = URL.createObjectURL(blob)
            triggerDownload(pngUrl, `${template.id}-learning-record.png`)
            window.setTimeout(() => URL.revokeObjectURL(pngUrl), 10_000)
          }, "image/png")
        } catch {
          URL.revokeObjectURL(url)
          setDownloadError("PNG export failed in this browser.")
        }
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        setDownloadError("PNG export failed in this browser.")
      }
      img.src = url
    } catch {
      setDownloadError("PNG export failed in this browser.")
    }
  }, [template.id, triggerDownload])

  const sealLine = sealNames.length > 0 ? sealNames.join("  ·  ") : "No Seals yet"
  const statusLine = complete
    ? `Journey complete — ${formatDate(lastCompletedAt)}`
    : `In progress — ${daysCompleted} of ${totalDays} days walked`

  return (
    <section aria-label="Shareable learning record" className="space-y-4">
      <div
        className="overflow-hidden rounded-2xl"
        style={{ boxShadow: "var(--la-shadow-float)" }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Learning record for ${template.finalReward.shareableRecord.title}: ${statusLine}, ${wisdom} Wisdom, ${sealNames.length} Seals`}
          className="block h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* storm ground — macbeth world palette */}
          <rect width={W} height={H} fill="#232a3d" />
          <rect width={W} height={H} fill="url(#recordGlow)" />
          <defs>
            <radialGradient id="recordGlow" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#45506b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#232a3d" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="recordBolt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e4b95b" />
              <stop offset="100%" stopColor="#8a6317" />
            </linearGradient>
          </defs>
          {/* hairline frame */}
          <rect x="18" y="18" width={W - 36} height={H - 36} fill="none" stroke="#e4b95b" strokeOpacity="0.55" strokeWidth="1.5" />
          <rect x="26" y="26" width={W - 52} height={H - 52} fill="none" stroke="#9aa7c7" strokeOpacity="0.3" strokeWidth="1" />

          {/* seal medallion motif */}
          <circle cx={W / 2} cy="108" r="40" fill="none" stroke="url(#recordBolt)" strokeWidth="3" />
          <circle cx={W / 2} cy="108" r="30" fill="#1B2437" stroke="#e4b95b" strokeOpacity="0.5" strokeWidth="1" />
          {/* dagger glyph: blade + hilt */}
          <g stroke="#e4b95b" strokeWidth="3" strokeLinecap="round">
            <line x1={W / 2} y1="88" x2={W / 2} y2="120" />
            <line x1={W / 2 - 11} y1="116" x2={W / 2 + 11} y2="116" />
            <line x1={W / 2} y1="120" x2={W / 2} y2="128" />
          </g>

          <text x={W / 2} y="184" textAnchor="middle" fill="#9aa7c7" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" letterSpacing="4">
            THE LIVING ARCHIVE
          </text>
          <text x={W / 2} y="228" textAnchor="middle" fill="#f7f3ea" fontFamily="Georgia, 'Times New Roman', serif" fontSize="38" fontStyle="italic">
            {template.finalReward.shareableRecord.title}
          </text>
          <text x={W / 2} y="262" textAnchor="middle" fill="#c8cfdf" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16">
            {template.finalReward.shareableRecord.subtitle}
          </text>

          <line x1="120" y1="296" x2={W - 120} y2="296" stroke="#9aa7c7" strokeOpacity="0.35" strokeWidth="1" />

          {/* three fact columns — real persisted numbers only */}
          <g fontFamily="Georgia, 'Times New Roman', serif" textAnchor="middle">
            <text x="200" y="346" fill="#e4b95b" fontSize="34">{daysCompleted} / {totalDays}</text>
            <text x="200" y="372" fill="#9aa7c7" fontSize="13" letterSpacing="2">DAYS COMPLETED</text>
            <text x={W / 2} y="346" fill="#e4b95b" fontSize="34">{wisdom}</text>
            <text x={W / 2} y="372" fill="#9aa7c7" fontSize="13" letterSpacing="2">WISDOM EARNED</text>
            <text x={W - 200} y="346" fill="#e4b95b" fontSize="34">{sealNames.length}</text>
            <text x={W - 200} y="372" fill="#9aa7c7" fontSize="13" letterSpacing="2">SEALS HELD</text>
          </g>

          <text x={W / 2} y="424" textAnchor="middle" fill="#f7f3ea" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15">
            {sealLine}
          </text>
          <text x={W / 2} y="452" textAnchor="middle" fill="#9aa7c7" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fontStyle="italic">
            {statusLine}
          </text>
          <text x={W / 2} y="488" textAnchor="middle" fill="#5a6478" fontFamily="Georgia, 'Times New Roman', serif" fontSize="12" letterSpacing="2">
            TOME · READ THE BOOKS THAT SHAPED THE WORLD
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={downloadSvg}
          className="min-h-11 rounded-full px-5 font-sans text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
          style={{ background: la.primary, color: la.primaryInk }}
        >
          Download SVG
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="min-h-11 rounded-full px-5 font-sans text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
          style={{ background: la.surfaceSunken, color: la.ink }}
        >
          Download PNG
        </button>
        <p className="font-sans text-xs" style={{ color: la.inkFaint }}>
          Shows only what you have actually completed — the numbers come from your journey record on this device.
        </p>
      </div>
      {downloadError && (
        <p role="alert" className="font-sans text-sm" style={{ color: la.error }}>
          {downloadError}
        </p>
      )}
    </section>
  )
}
