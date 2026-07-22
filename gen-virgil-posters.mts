/**
 * One-shot generator for Virgil static exports.
 * Renders VirgilArt (the same components the product uses) to static SVG
 * posters + runtime assets inside tome-revision/public/virgil/.
 * Run from the repo root: ./node_modules/.bin/tsx gen-virgil-posters.mts
 */

import { renderToStaticMarkup } from "react-dom/server"
import { createElement as h } from "react"
import { writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { VirgilArt } from "./src/components/virgil/VirgilArt"
import { VIRGIL_EXPRESSIONS, VIRGIL_EXPRESSION_IDS } from "./src/components/virgil/expressions"
import { VIRGIL_STATES, virgilStatesByCategory } from "./src/lib/virgil/state-machine"
import { VIRGIL_PALETTE } from "./src/lib/virgil/palette"
import type { VirgilPalette } from "./src/lib/virgil/palette"
import { VIRGIL_VARIANTS, VIRGIL_VARIANT_IDS } from "./src/lib/virgil/variants"
import type { VirgilCategory, VirgilStateId } from "./src/lib/virgil/types"

const OUT = join(process.cwd(), "public", "virgil")
mkdirSync(join(OUT, "posters"), { recursive: true })
mkdirSync(join(OUT, "runtime"), { recursive: true })
mkdirSync(join(OUT, "source"), { recursive: true })

const FONT = `font-family="ui-monospace, SFMono-Regular, Menlo, monospace"`

/* render one VirgilArt and return its inner SVG content */
function art(props: Parameters<typeof VirgilArt>[0]): string {
  const markup = renderToStaticMarkup(h(VirgilArt, props))
  return markup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")
}

/** nest art at x/y scaled to width w (full-body 240×320 or bust 128×150) */
function nest(inner: string, x: number, y: number, w: number, bust = false): string {
  const vb = bust ? "56 14 128 150" : "0 0 240 320"
  const hh = bust ? Math.round((w * 150) / 128) : Math.round((w * 320) / 240)
  return `<svg x="${x}" y="${y}" width="${w}" height="${hh}" viewBox="${vb}">${inner}</svg>`
}

function label(text: string, x: number, y: number, size = 11, color = "#6B6556", anchor = "middle"): string {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${color}" ${FONT}>${safe}</text>`
}

function save(dir: string, name: string, svg: string) {
  writeFileSync(join(OUT, dir, name), svg)
  console.log(`wrote public/virgil/${dir}/${name} (${(svg.length / 1024).toFixed(1)}kB)`)
}

const PAPER = "#F5EFE0"
const INK = "#232A38"

/* ── 1. contact sheet: every state ─────────────────────────────────── */
{
  const states = Object.keys(VIRGIL_STATES) as VirgilStateId[]
  const cell = 150, cols = 9, lh = 20
  const rows = Math.ceil(states.length / cols)
  const W = cols * cell, H = rows * (cell * 1.34 + lh) + 46
  const body = states
    .map((s, i) => {
      const x = (i % cols) * cell
      const y = Math.floor(i / cols) * (cell * 1.34 + lh) + 40
      return (
        nest(art({ state: s, size: 200 }), x + 8, y, cell - 16) +
        label(s, x + cell / 2, y + cell * 1.34 + 12, 10)
      )
    })
    .join("\n")
  save("posters", "contact-sheet.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="100%" height="100%" fill="${PAPER}"/>` +
    label("VIRGIL · STATE CONTACT SHEET — every state at its reduced-motion still", 20, 26, 13, INK, "start") +
    `\n${body}\n</svg>`)
}

/* ── 2. turnaround: front / three-quarter / side / back ────────────── */
{
  const W = 1160, H = 560
  const front = nest(art({ state: "idle", size: 300 }), 30, 70, 240)
  const threeQ = nest(art({ state: "idle", size: 300, pose: { bodyLean: -8, headTilt: -12, eyeLookX: -5, armAngle: -10 } }), 320, 70, 240)
  // side + back are construction schematics (documented as such)
  const side = `
    <g transform="translate(640 70)">
      <path d="M120 18 C150 24 166 50 168 80 C186 110 192 150 193 200 C194 250 196 280 196 300 Q150 312 104 300 C100 250 98 200 100 150 C102 100 106 40 120 18 Z" fill="${VIRGIL_PALETTE.cloak}"/>
      <ellipse cx="126" cy="112" rx="34" ry="40" fill="${VIRGIL_PALETTE.face}"/>
      <ellipse cx="150" cy="108" rx="5" ry="7" fill="${VIRGIL_PALETTE.eye}"/>
      <path d="M150 134 Q156 137 150 140" stroke="${VIRGIL_PALETTE.eye}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M170 160 Q192 166 192 186" stroke="${VIRGIL_PALETTE.cloak}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <circle cx="192" cy="188" r="7" fill="${VIRGIL_PALETTE.face}"/>
      <path d="M186 202 L198 202 L202 216 L198 238 L186 238 L182 216 Z" fill="${VIRGIL_PALETTE.lanternFrame}"/>
      <path d="M189 207 L195 207 L197 216 L195 231 L189 231 L187 216 Z" fill="${VIRGIL_PALETTE.lanternGlass}"/>
      <rect x="96" y="206" width="16" height="44" rx="7" fill="${VIRGIL_PALETTE.satchel}"/>
    </g>`
  const back = `
    <g transform="translate(900 70)">
      <path d="M120 18 C148 22 168 44 172 74 C196 96 206 130 208 168 C210 220 212 262 212 296 Q181 306 150 298 Q120 308 90 298 Q59 306 28 296 C28 262 30 220 32 168 C34 130 44 96 68 74 C72 44 92 22 120 18 Z" fill="${VIRGIL_PALETTE.cloak}"/>
      <path d="M120 18 C100 60 96 140 100 220" stroke="${VIRGIL_PALETTE.cloakShadow}" stroke-width="5" fill="none" opacity="0.6"/>
      <path d="M170 128 C130 160 92 190 60 214" stroke="${VIRGIL_PALETTE.satchelFlap}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.9"/>
      <path d="M28 296 Q59 306 90 298 Q120 308 150 298 Q181 306 212 296 L212 288 Q181 297 150 289 Q120 299 90 289 Q59 297 28 288 Z" fill="${VIRGIL_PALETTE.trim}"/>
    </g>`
  const grid = [0, 1, 2, 3, 4, 5, 6, 7]
    .map((i) => `<line x1="20" y1="${70 + i * 60}" x2="${W - 20}" y2="${70 + i * 60}" stroke="#D9CFB4" stroke-width="0.6"/>`)
    .join("")
  save("posters", "turnaround.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="100%" height="100%" fill="${PAPER}"/>${grid}` +
    label("VIRGIL · TURNAROUND — front and 3/4 from the component system; side and back as construction schematics", 20, 30, 13, INK, "start") +
    label("proportion grid: hood peak to hem = 5 heads", 20, 48, 10) +
    front + threeQ + side + back +
    label("front", 150, 540, 11, INK) + label("three-quarter", 440, 540, 11, INK) +
    label("side (schematic)", 760, 540, 11, INK) + label("back (schematic)", 1020, 540, 11, INK) +
    `</svg>`)
}

/* ── 3. expression sheet ───────────────────────────────────────────── */
{
  const cell = 150, cols = 8, lh = 26
  const rows = Math.ceil(VIRGIL_EXPRESSION_IDS.length / cols)
  const W = cols * cell, H = rows * (cell + lh) + 46
  const body = VIRGIL_EXPRESSION_IDS.map((id, i) => {
    const x = (i % cols) * cell
    const y = Math.floor(i / cols) * (cell + lh) + 44
    return (
      nest(art({ state: "idle", expression: id, size: 150, bust: true }), x + 12, y, cell - 24, true) +
      label(id, x + cell / 2, y + cell - 2, 10, INK)
    )
  }).join("\n")
  save("posters", "expression-sheet.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="100%" height="100%" fill="${PAPER}"/>` +
    label("VIRGIL · EXPRESSION SHEET — 16 expressions from eye style × brow × mouth", 20, 26, 13, INK, "start") +
    `\n${body}\n</svg>`)
}

/* ── 4. variant sheet ──────────────────────────────────────────────── */
{
  const cell = 190, cols = 5, lh = 44
  const rows = Math.ceil(VIRGIL_VARIANT_IDS.length / cols)
  const W = cols * cell, H = rows * (cell * 1.34 + lh) + 50
  const body = VIRGIL_VARIANT_IDS.map((id, i) => {
    const v = VIRGIL_VARIANTS[id]
    const x = (i % cols) * cell
    const y = Math.floor(i / cols) * (cell * 1.34 + lh) + 44
    const swatches = [v.palette.cloak, v.palette.trim, v.glow, v.palette.laurel]
      .map((hex, j) => `<rect x="${x + 40 + j * 26}" y="${y + cell * 1.34 + 8}" width="20" height="20" rx="3" fill="${hex}" stroke="#00000022"/>`)
      .join("")
    return (
      nest(art({ state: "greet", variant: id, size: 220 }), x + 25, y, cell - 50) +
      label(v.label, x + cell / 2, y + cell * 1.34 + 2, 12, INK) +
      swatches
    )
  }).join("\n")
  save("posters", "variant-sheet.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="100%" height="100%" fill="${PAPER}"/>` +
    label("VIRGIL · BOOK-WORLD VARIANTS — palette + motif + glow; silhouette unchanged", 20, 28, 13, INK, "start") +
    `\n${body}\n</svg>`)
}

/* ── 5. silhouette test ────────────────────────────────────────────── */
{
  const sizes = [24, 40, 64, 128, 256]
  const W = 980, H = 520
  let x = 40
  const row = sizes
    .map((s) => {
      const cellW = s + 40
      const cellH = Math.round(s * 1.34) + 20
      const out =
        `<rect x="${x}" y="80" width="${s + 20}" height="${cellH}" fill="#FFFFFF" stroke="#D9CFB4"/>` +
        nest(art({ state: "idle", size: 256, tone: "silhouette", toneColor: INK }), x + 10, 90, s) +
        label(`${s}px`, x + 10 + s / 2, 106 + cellH, 10)
      x += cellW + 16
      return out
    })
    .join("\n")
  save("posters", "silhouette-test.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="100%" height="100%" fill="${PAPER}"/>` +
    label("VIRGIL · SILHOUETTE TEST — 24 / 40 / 64 / 128 / 256 px, single ink", 20, 30, 13, INK, "start") +
    label("pass criteria: hood peak, bell hem, and lantern readable at 24px", 20, 48, 10) +
    `\n${row}\n</svg>`)
}

/* ── 6. palette poster ─────────────────────────────────────────────── */
{
  const entries = Object.entries(VIRGIL_PALETTE) as [keyof VirgilPalette, string][]
  const cols = 5, cellW = 210, cellH = 96
  const rows = Math.ceil(entries.length / cols)
  const W = cols * cellW + 40, H = rows * cellH + 70
  const body = entries
    .map(([key, hex], i) => {
      const x = 20 + (i % cols) * cellW
      const y = 60 + Math.floor(i / cols) * cellH
      return (
        `<rect x="${x}" y="${y}" width="180" height="56" rx="6" fill="${hex}" stroke="#00000018"/>` +
        label(key, x, y + 72, 10, INK, "start") +
        label(hex, x + 180, y + 72, 10, "#6B6556", "end")
      )
    })
    .join("\n")
  save("posters", "palette.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="100%" height="100%" fill="${PAPER}"/>` +
    label("VIRGIL · CANON PALETTE — hexes are the source of truth (src/lib/virgil/palette.ts)", 20, 30, 13, INK, "start") +
    `\n${body}\n</svg>`)
}

/* ── runtime assets ────────────────────────────────────────────────── */
{
  // single-color mark
  save("runtime", "virgil-mark.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="320" viewBox="0 0 240 320" role="img" aria-label="Virgil single-color mark">` +
    art({ state: "idle", size: 240, tone: "mono", toneColor: INK }) + `</svg>`)

  // grayscale: map every palette hex to its luminance
  const gray = (hex: string): string => {
    const n = parseInt(hex.slice(1), 16)
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
    const l = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)
    return `#${l.toString(16).padStart(2, "0").repeat(3)}`
  }
  const grayPalette = Object.fromEntries(
    Object.entries(VIRGIL_PALETTE).map(([k, v]) => [k, gray(v)]),
  ) as unknown as VirgilPalette
  save("runtime", "virgil-grayscale.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="320" viewBox="0 0 240 320" role="img" aria-label="Virgil grayscale">` +
    art({ state: "idle", size: 240, paletteOverride: grayPalette }) + `</svg>`)

  // fallback art
  save("runtime", "virgil-offline.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="320" viewBox="0 0 240 320" role="img" aria-label="Virgil offline fallback">` +
    art({ state: "offline", size: 240 }) + `</svg>`)
  save("runtime", "virgil-loading.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="320" viewBox="0 0 240 320" role="img" aria-label="Virgil loading fallback">` +
    art({ state: "loading", size: 240 }) + `</svg>`)

  // app icon: bust on midnight tile with glow ring — not a reduced face
  save("runtime", "virgil-app-icon.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="Virgil app icon">` +
    `<rect width="512" height="512" rx="112" fill="${VIRGIL_PALETTE.ink}"/>` +
    `<circle cx="336" cy="300" r="150" fill="${VIRGIL_PALETTE.glow}" opacity="0.18"/>` +
    nest(art({ state: "greet", size: 400, bust: true }), 56, 90, 400, true) +
    `</svg>`)

  // construction sheet for public/virgil/source
  save("source", "virgil-construction.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="760" viewBox="0 0 640 760">` +
    `<rect width="100%" height="100%" fill="${PAPER}"/>` +
    label("VIRGIL · CONSTRUCTION — 240×320 grid, landmarks annotated", 24, 32, 13, INK, "start") +
    [80, 160, 240, 320, 400, 480, 560]
      .map((y) => `<line x1="60" y1="${y}" x2="420" y2="${y}" stroke="#D9CFB4" stroke-width="0.7"/>`)
      .join("") +
    [120, 180, 240, 300, 360]
      .map((x) => `<line x1="${x}" y1="60" x2="${x}" y2="720" stroke="#D9CFB4" stroke-width="0.7"/>`)
      .join("") +
    nest(art({ state: "idle", size: 480 }), 120, 60, 360) +
    label("hood peak (120,18)", 460, 90, 10, INK, "start") +
    label("face center (120,114)", 460, 250, 10, INK, "start") +
    label("lantern (190,216)", 460, 440, 10, INK, "start") +
    label("satchel (57,228)", 460, 480, 10, INK, "start") +
    label("hem y≈300 · ground 306", 460, 660, 10, INK, "start") +
    `</svg>`)
}

console.log("done")
