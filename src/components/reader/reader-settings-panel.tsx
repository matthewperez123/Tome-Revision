"use client"

/**
 * ReaderSettingsPanel — Kindle-style reading controls.
 *
 * Reads/writes the global reader prefs store. Mode, theme, font size, line
 * spacing, line length (measure), justification, page-turn style, and an
 * opt-in accessibility reading face. Two-page spread is width-gated; when
 * unavailable the option is disabled and the reader falls back to single page.
 */

import { useEffect, useRef, useState } from "react"
import {
  Settings2,
  ScrollText,
  BookOpen,
  Columns2,
  Minus,
  Plus,
  AlignLeft,
  AlignJustify,
  Type,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useReaderPrefs,
  setReaderPrefs,
  FONT_SIZE_RANGE,
  LINE_HEIGHT_RANGE,
  MEASURE_RANGE,
  type ReaderMode,
  type ReaderTurnStyle,
} from "@/lib/reader/reader-prefs"

interface ReaderSettingsPanelProps {
  /** Whether the two-page spread is allowed at the current viewport. */
  canSpread: boolean
}

const MODES: { value: ReaderMode; label: string; icon: typeof ScrollText }[] = [
  { value: "scroll", label: "Scroll", icon: ScrollText },
  { value: "single", label: "Single", icon: BookOpen },
  { value: "spread", label: "Spread", icon: Columns2 },
]

const TURN_STYLES: { value: ReaderTurnStyle; label: string }[] = [
  { value: "slide", label: "Slide" },
  { value: "fade", label: "Fade" },
  { value: "none", label: "None" },
]

function Stepper({
  label,
  value,
  display,
  canDec,
  canInc,
  onDec,
  onInc,
}: {
  label: string
  value: string | number
  display: string
  canDec: boolean
  canInc: boolean
  onDec: () => void
  onInc: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!canDec}
          onClick={onDec}
          className="flex size-7 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-3" />
        </button>
        <span className="w-12 text-center text-[11px] tabular-nums text-foreground">{display}</span>
        <button
          type="button"
          disabled={!canInc}
          onClick={onInc}
          className="flex size-7 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-3" />
        </button>
      </div>
    </div>
  )
}

export function ReaderSettingsPanel({ canSpread }: ReaderSettingsPanelProps) {
  const prefs = useReaderPrefs()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation()
        setOpen(false)
      }
    }
    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKey, true)
    return () => {
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKey, true)
    }
  }, [open])

  const effectiveMode: ReaderMode = prefs.mode === "spread" && !canSpread ? "single" : prefs.mode

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-7 items-center justify-center rounded-md transition-colors",
          open ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Reading settings"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Settings2 className="size-3.5" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Reading settings"
          className="absolute right-0 top-9 z-50 w-64 rounded-xl border border-border bg-popover p-3 shadow-xl"
          style={{ borderRadius: "var(--codex-radius-card, 0.75rem)" }}
        >
          {/* Mode */}
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mode
          </p>
          <div className="mb-3 grid grid-cols-3 gap-1">
            {MODES.map(({ value, label, icon: Icon }) => {
              const disabled = value === "spread" && !canSpread
              const active = effectiveMode === value
              return (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setReaderPrefs({ mode: value })}
                  title={disabled ? "Spread needs a wider screen" : label}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] transition-colors",
                    active
                      ? "border-[var(--codex-primary)] bg-[var(--codex-primary-soft)] text-[var(--codex-primary-text)]"
                      : "border-border text-muted-foreground hover:bg-muted",
                    disabled && "opacity-30"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Steppers */}
          <div className="mb-3 space-y-2">
            <Stepper
              label="Font size"
              value={prefs.fontSizePx}
              display={`${prefs.fontSizePx}px`}
              canDec={prefs.fontSizePx > FONT_SIZE_RANGE.min}
              canInc={prefs.fontSizePx < FONT_SIZE_RANGE.max}
              onDec={() => setReaderPrefs({ fontSizePx: prefs.fontSizePx - FONT_SIZE_RANGE.step })}
              onInc={() => setReaderPrefs({ fontSizePx: prefs.fontSizePx + FONT_SIZE_RANGE.step })}
            />
            <Stepper
              label="Line spacing"
              value={prefs.lineHeight}
              display={prefs.lineHeight.toFixed(1)}
              canDec={prefs.lineHeight > LINE_HEIGHT_RANGE.min + 1e-6}
              canInc={prefs.lineHeight < LINE_HEIGHT_RANGE.max - 1e-6}
              onDec={() =>
                setReaderPrefs({
                  lineHeight: Math.round((prefs.lineHeight - LINE_HEIGHT_RANGE.step) * 10) / 10,
                })
              }
              onInc={() =>
                setReaderPrefs({
                  lineHeight: Math.round((prefs.lineHeight + LINE_HEIGHT_RANGE.step) * 10) / 10,
                })
              }
            />
            <Stepper
              label="Line length"
              value={prefs.measureCh}
              display={`${prefs.measureCh}ch`}
              canDec={prefs.measureCh > MEASURE_RANGE.min}
              canInc={prefs.measureCh < MEASURE_RANGE.max}
              onDec={() => setReaderPrefs({ measureCh: prefs.measureCh - MEASURE_RANGE.step })}
              onInc={() => setReaderPrefs({ measureCh: prefs.measureCh + MEASURE_RANGE.step })}
            />
          </div>

          {/* Justify */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">Justify text</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setReaderPrefs({ justify: false })}
                aria-pressed={!prefs.justify}
                title="Ragged right"
                className={cn(
                  "flex size-7 items-center justify-center rounded-md border transition-colors",
                  !prefs.justify
                    ? "border-[var(--codex-primary)] bg-[var(--codex-primary-soft)] text-[var(--codex-primary-text)]"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <AlignLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setReaderPrefs({ justify: true })}
                aria-pressed={prefs.justify}
                title="Justified"
                className={cn(
                  "flex size-7 items-center justify-center rounded-md border transition-colors",
                  prefs.justify
                    ? "border-[var(--codex-primary)] bg-[var(--codex-primary-soft)] text-[var(--codex-primary-text)]"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <AlignJustify className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Page-turn style (only meaningful in paginated modes) */}
          {effectiveMode !== "scroll" && (
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">Page turn</span>
              <div className="flex items-center gap-1">
                {TURN_STYLES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setReaderPrefs({ turnStyle: value })}
                    aria-pressed={prefs.turnStyle === value}
                    className={cn(
                      "rounded-md border px-2 py-1 text-[10px] transition-colors",
                      prefs.turnStyle === value
                        ? "border-[var(--codex-primary)] bg-[var(--codex-primary-soft)] text-[var(--codex-primary-text)]"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Accessibility reading face */}
          <button
            type="button"
            onClick={() => setReaderPrefs({ a11yFace: !prefs.a11yFace })}
            aria-pressed={prefs.a11yFace}
            className="flex w-full items-center justify-between gap-2 rounded-md py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Type className="size-3.5" />
              Accessible face
            </span>
            <span
              className={cn(
                "inline-flex h-4 w-7 items-center rounded-full px-0.5 transition-colors",
                prefs.a11yFace ? "bg-[var(--codex-primary)]" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "size-3 rounded-full bg-white transition-transform",
                  prefs.a11yFace ? "translate-x-3" : "translate-x-0"
                )}
              />
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
