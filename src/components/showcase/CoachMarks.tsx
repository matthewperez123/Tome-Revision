"use client"

/**
 * CoachMarks — the guided-tour overlay.
 *
 * A sequence of steps, each targeting a `[data-tour]` element: a dimming
 * overlay with a spotlight ring on the target and a small dialog card with
 * Back / Next / Skip. Keyboard: → or Enter advances, ← goes back, Esc or
 * "Skip tour" exits to free-explore mode. Steps whose target is not on
 * screen are skipped automatically, so the tour survives role switches.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

export interface TourStep {
  /** CSS selector of the highlighted element. */
  selector: string
  title: string
  body: string
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export function CoachMarks({
  steps,
  index,
  onIndex,
  onExit,
}: {
  steps: TourStep[]
  index: number
  onIndex: (next: number) => void
  onExit: () => void
}) {
  const [rect, setRect] = useState<Rect | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  // Advance past steps whose target is missing (e.g. hidden on this role).
  // Deferred so the parent state update never runs synchronously in-effect.
  useEffect(() => {
    if (index >= steps.length) {
      const t = window.setTimeout(onExit, 0)
      return () => window.clearTimeout(t)
    }
    const step = steps[index]
    if (step && !document.querySelector(step.selector)) {
      const t = window.setTimeout(() => onIndex(index + 1), 0)
      return () => window.clearTimeout(t)
    }
    return undefined
  }, [index, steps, onIndex, onExit])

  const step = index < steps.length ? steps[index] : undefined

  const measure = useCallback(() => {
    if (!step) return
    const el = document.querySelector(step.selector)
    if (!el) {
      setRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    el.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [step])

  useLayoutEffect(() => {
    // Deferred: measuring the DOM and storing the rect is async to render,
    // never a synchronous setState-in-effect.
    let raf = requestAnimationFrame(measure)
    const onReflow = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    window.addEventListener("resize", onReflow)
    window.addEventListener("scroll", onReflow, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onReflow)
      window.removeEventListener("scroll", onReflow, true)
    }
  }, [measure])

  // Focus the card on each step for screen readers and keyboard control.
  useEffect(() => {
    cardRef.current?.focus()
  }, [index])

  const next = useCallback(() => onIndex(index + 1), [index, onIndex])
  const back = useCallback(() => onIndex(Math.max(0, index - 1)), [index, onIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onExit()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        next()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        back()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, back, onExit])

  if (!step || !rect) return null

  const isLast = index >= steps.length - 1
  const pad = 8
  const spot = {
    top: Math.max(0, rect.top - pad),
    left: Math.max(0, rect.left - pad),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  }
  // Prefer below the target; flip above when space runs out.
  const below = spot.top + spot.height + 12
  const cardTop =
    below + 220 < window.innerHeight ? below : Math.max(12, spot.top - 220 - 12)
  const cardLeft = Math.min(
    Math.max(12, spot.left),
    Math.max(12, window.innerWidth - 360),
  )

  return (
    <div role="presentation" className="fixed inset-0 z-50">
      {/* dim layer with spotlight cutout */}
      <div
        aria-hidden
        className="absolute rounded-xl"
        style={{
          top: spot.top,
          left: spot.left,
          width: spot.width,
          height: spot.height,
          boxShadow: "0 0 0 9999px rgba(15, 20, 32, 0.62)",
          outline: "2px solid var(--la-wisdom)",
        }}
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        aria-label={`Tour step ${index + 1} of ${steps.length}: ${step.title}`}
        tabIndex={-1}
        className="absolute w-[min(340px,calc(100vw-24px))] rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-4 shadow-[0_12px_40px_rgba(15,20,32,0.35)] focus:outline-none"
        style={{ top: cardTop, left: cardLeft }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--la-wisdom-deep)]">
          Guided tour · {index + 1} / {steps.length}
        </p>
        <h2 className="mt-1 font-serif text-lg text-[var(--la-ink)]">{step.title}</h2>
        <p className="mt-1 font-sans text-sm leading-relaxed text-[var(--la-ink-muted)]">{step.body}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={back}
            disabled={index === 0}
            className="rounded-full px-3 py-1.5 font-sans text-xs font-semibold text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)] disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-[var(--la-primary)] px-4 py-1.5 font-sans text-xs font-semibold text-[var(--la-primary-ink)] hover:bg-[var(--la-primary-edge)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
          >
            {isLast ? "Finish tour" : "Next"}
          </button>
          <button
            type="button"
            onClick={onExit}
            className="ml-auto rounded-full px-3 py-1.5 font-sans text-xs text-[var(--la-ink-faint)] hover:bg-[var(--la-surface-sunken)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
          >
            Skip tour (Esc)
          </button>
        </div>
      </div>
    </div>
  )
}
