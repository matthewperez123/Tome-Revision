/**
 * Codex reference spec — the frozen page geometry for Tome's book-fidelity
 * reader (spec_version = 1).
 *
 * Every page is typeset into this fixed-geometry box and then scaled WHOLE to
 * fit the viewport via `transform: scale(...)` — like holding a printed book
 * closer or farther away. The type block is never reflowed by the viewport;
 * only the user's font-size / line-spacing setting re-flows text.
 *
 * Canonical page numbers (book_page_maps) are computed against this spec at
 * the DEFAULT body size. Bump CODEX_SPEC_VERSION only when any value below
 * changes — a bump invalidates every stored canonical page map.
 */

export const CODEX_SPEC_VERSION = 1

export const CODEX = {
  /** Full page box, px (portrait, ~2:3 book proportions). */
  pageW: 528,
  pageH: 816,
  /** Margins, px. Inner = gutter/spine side; outer = fore-edge side. */
  marginTop: 64,
  marginBottom: 80,
  marginInner: 60,
  marginOuter: 76,
  /** Text block = pageW − inner − outer × pageH − top − bottom. */
  textW: 392, // 528 − 60 − 76
  textH: 672, // 816 − 64 − 80
  /** Reference body type: Literata 16/24 (≈28 lines/page, 280–340 words). */
  bodyFontPx: 16,
  bodyLinePx: 24,
  /** User-facing font-size steps; index 2 is the spec default. */
  fontSteps: [13, 14, 16, 18, 20] as readonly number[],
  /** Line-spacing steps (unitless). 1.5 × 16px = the reference 24px leading. */
  lineHeightSteps: [1.5, 1.75] as readonly number[],
  /** Spine rule between verso and recto in spread mode, px. */
  spineW: 1,
} as const

export const CODEX_DEFAULTS = {
  fontSizePx: CODEX.bodyFontPx,
  lineHeight: CODEX.bodyLinePx / CODEX.bodyFontPx, // 1.5
} as const

/**
 * Usable text-block height for a given type setting, floored to a whole
 * number of lines so no partial line is ever clipped at the page boundary.
 */
export function codexTextHeight(fontSizePx: number, lineHeight: number): number {
  const linePx = fontSizePx * lineHeight
  if (linePx <= 0) return CODEX.textH
  return Math.max(linePx, Math.floor(CODEX.textH / linePx) * linePx)
}

/**
 * Scale factor to fit the codex box (single page or full spread) into an
 * available container, preserving aspect. Upscaling is allowed (holding the
 * book closer) but soft-capped so type never balloons on huge displays.
 */
export function codexScale(
  availW: number,
  availH: number,
  mode: "single" | "spread",
  maxScale = 1.35
): number {
  if (availW <= 0 || availH <= 0) return 1
  const needW = mode === "spread" ? CODEX.pageW * 2 + CODEX.spineW : CODEX.pageW
  const needH = CODEX.pageH
  return Math.min(maxScale, availW / needW, availH / needH)
}
