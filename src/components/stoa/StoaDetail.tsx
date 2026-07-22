"use client"

/**
 * StoaDetail — the painting's detail view, as a modal dialog.
 *
 * Restored rewards: zoomable artwork, the related public-domain passage,
 * a line of Virgil commentary beside a small explain-pose Virgil, the
 * Seal medallion earned with the book, the provenance + license block,
 * and a shareable-still download (the SVG serialized to a file).
 * Locked rewards: the empty-state copy and which Trial restores it.
 *
 * Built on the native <dialog> element: focus trapping, Escape to close,
 * and top-layer rendering come from the platform. Backdrop click closes.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { Virgil } from "@/components/virgil"
import { SealMedallion } from "@/components/rewards/SealMedallion"
import type { StoaReward } from "@/lib/stoa/rewards"

export interface StoaDetailProps {
  reward: StoaReward
  restored: boolean
  open: boolean
  onClose: () => void
}

const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ZOOM_STEP = 0.5

export function StoaDetail({ reward, restored, open, onClose }: StoaDetailProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [zoom, setZoom] = useState(1)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      setZoom(1)
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const handleClose = useCallback(() => onClose(), [onClose])

  const onBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) onClose()
    },
    [onClose],
  )

  const downloadStill = useCallback(async () => {
    setDownloading(true)
    try {
      const res = await fetch(reward.artSrc)
      const svgText = await res.text()
      const blob = new Blob([svgText], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tome-stoa-${reward.id}.svg`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }, [reward.artSrc, reward.id])

  const clampZoom = (v: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v))

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={onBackdropClick}
      aria-labelledby={`stoa-detail-title-${reward.id}`}
      className="m-auto w-[min(92vw,880px)] rounded-[var(--la-radius-l)] border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-0 text-[var(--la-ink)] shadow-[var(--la-shadow-portal)] backdrop:bg-[var(--la-overlay)]"
    >
      <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
        {/* header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--la-wisdom-deep)]">
              The Stoa · {restored ? "Restored painting" : "Empty niche"}
            </p>
            <h2
              id={`stoa-detail-title-${reward.id}`}
              className="mt-1 text-2xl font-bold tracking-tight"
            >
              {restored ? reward.title : reward.bookTitle}
            </h2>
            <p className="mt-1 text-sm text-[var(--la-ink-muted)]">
              {reward.bookTitle} — {reward.author}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail view"
            className="rounded-full border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] px-3 py-1.5 text-sm text-[var(--la-ink-muted)] transition-colors hover:text-[var(--la-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
          >
            Close
          </button>
        </div>

        <div className={restored ? "grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : ""}>
          {/* artwork + zoom */}
          {restored && (
            <div>
              <div
                className="relative overflow-hidden border border-[var(--la-wisdom)]"
                style={{ borderRadius: "50% 50% 14px 14px / 26% 26% 14px 14px" }}
              >
                <div
                  className="transition-transform duration-200 ease-out"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "50% 42%" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- vector art, serialized for download */}
                  <img src={reward.artSrc} alt={reward.altText} className="block h-auto w-full" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
                  disabled={zoom <= ZOOM_MIN}
                  aria-label="Zoom out"
                  className="rounded-full border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] px-3 py-1 text-sm disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
                >
                  −
                </button>
                <input
                  type="range"
                  min={ZOOM_MIN}
                  max={ZOOM_MAX}
                  step={0.25}
                  value={zoom}
                  onChange={(e) => setZoom(clampZoom(Number(e.target.value)))}
                  aria-label="Artwork zoom"
                  className="h-1 flex-1 accent-[var(--la-wisdom)]"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
                  disabled={zoom >= ZOOM_MAX}
                  aria-label="Zoom in"
                  className="rounded-full border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] px-3 py-1 text-sm disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
                >
                  +
                </button>
                <span className="w-10 text-right font-mono text-xs text-[var(--la-ink-muted)]">
                  {zoom.toFixed(2)}×
                </span>
              </div>
            </div>
          )}

          {/* curatorial column */}
          <div className="flex flex-col gap-5">
            {!restored && (
              <p className="rounded-[var(--la-radius-m)] border border-dashed border-[var(--la-ink-faint)] bg-[var(--la-surface-sunken)] p-4 text-sm leading-relaxed text-[var(--la-ink-muted)]">
                {reward.emptyCopy.body}
              </p>
            )}

            {restored && (
              <>
                <div className="flex items-center gap-4 rounded-[var(--la-radius-m)] border border-[var(--la-wisdom)] bg-[var(--la-surface)] p-4">
                  <SealMedallion sealId={reward.id} name={reward.sealName} size={56} state="unlocked" />
                  <div>
                    <p className="text-sm font-semibold">{reward.sealName}</p>
                    <p className="text-xs text-[var(--la-ink-muted)]">
                      Seal earned with {reward.bookTitle} · {reward.restoredCopy.body}
                    </p>
                  </div>
                </div>

                <figure className="rounded-[var(--la-radius-m)] bg-[var(--la-surface)] p-5 shadow-[var(--la-shadow-raised)]">
                  <blockquote className="whitespace-pre-line text-[15px] italic leading-relaxed">
                    “{reward.passage.text}”
                  </blockquote>
                  <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--la-ink-muted)]">
                    {reward.passage.citation}
                  </figcaption>
                </figure>

                <div className="flex items-start gap-3 rounded-[var(--la-radius-m)] bg-[var(--la-surface)] p-4 shadow-[var(--la-shadow-raised)]">
                  <Virgil state="explain" size={72} bust className="shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--la-ink-muted)]">
                      Virgil says
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{reward.virgilLine}</p>
                  </div>
                </div>

                <div className="rounded-[var(--la-radius-m)] border border-[var(--la-surface-sunken)] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--la-ink-muted)]">
                    Provenance &amp; license
                  </p>
                  <p className="mt-1 text-sm font-semibold">{reward.provenanceLabel}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--la-ink-muted)]">
                    {reward.provenanceNote}
                  </p>
                  <button
                    type="button"
                    onClick={downloadStill}
                    disabled={downloading}
                    className="mt-3 rounded-full bg-[var(--la-primary)] px-4 py-2 text-sm font-semibold text-[var(--la-primary-ink)] transition-colors hover:bg-[var(--la-primary-edge)] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
                  >
                    {downloading ? "Preparing…" : "Download still (SVG)"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}
