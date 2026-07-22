#!/usr/bin/env node

// ─────────────────────────────────────────────
// Tome Vector Cover Generator
// ─────────────────────────────────────────────
// Procedurally generates ORIGINAL vector cover art for the twelve featured
// books (MASTER_EXECUTION_PLAN §10). Each cover is composed from the book's
// Living Archive palette and its assigned cover archetype, with a shared
// geometry language (rounded matte forms, gold hairline frame, lantern-gold
// accents, paper-grain scatter) so the set reads as curated, not twelve
// unrelated images.
//
//   node scripts/covers/tome-vector-covers.mjs
//
// Outputs to public/covers/tome-generated/:
//   <slug>.svg            vector source (768x1024, 3:4)
//   <slug>.png/.webp      raster exports (via sharp, when available)
//   manifest.json         alt text + provenance ("original Tome vector art")
//   contact-sheet.svg     QA contact sheet for visual balance review
//
// Palette/archetype data mirrors src/lib/books/registry.ts. If you change a
// palette there, change it here and re-run. No title/author text is ever
// baked into the art.

import fs from "node:fs/promises"
import path from "node:path"

const WIDTH = 768
const HEIGHT = 1024
const OUT_DIR = "public/covers/tome-generated"
const GENERATOR_VERSION = "1.0.0"

// ── Seeded PRNG (deterministic grain) ────────

function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── Book configs (mirror of registry) ────────

const BOOKS = [
  {
    slug: "macbeth",
    bookId: "macbeth",
    title: "Macbeth",
    archetype: "emblem-relic",
    palette: { ground: "#1B2437", ink: "#0E1420", primary: "#3D4E6E", accent: "#B03A2E", gold: "#E3B34C" },
    altText:
      "Original Tome vector cover for Macbeth: a gold crown above an upright dagger on a storm-dark indigo field, framed by a gold hairline.",
  },
  {
    slug: "moby-dick",
    bookId: "moby-dick",
    title: "Moby-Dick",
    archetype: "horizon-negative-space",
    palette: { ground: "#0F3B4C", ink: "#082430", primary: "#1F6E8C", accent: "#E9F1F2", gold: "#E8C46A" },
    altText:
      "Original Tome vector cover for Moby-Dick: a pale whale curve breaching a dark teal sea beneath a wide negative-space sky, gold compass star above.",
  },
  {
    slug: "alice",
    bookId: "alices-adventures-in-wonderland",
    title: "Alice's Adventures in Wonderland",
    archetype: "constellation-cabinet",
    palette: { ground: "#F6EFE3", ink: "#2A2438", primary: "#5B4E8C", accent: "#D94F5C", gold: "#DFAF4F" },
    altText:
      "Original Tome vector cover for Alice's Adventures in Wonderland: a constellation of small doors, keys, and card diamonds on warm ivory, joined by dotted lines.",
  },
  {
    slug: "paradise-lost",
    bookId: "paradise-lost",
    title: "Paradise Lost",
    archetype: "threshold-portal",
    palette: { ground: "#171226", ink: "#0B0817", primary: "#43346B", accent: "#D98E4A", gold: "#F0C766" },
    altText:
      "Original Tome vector cover for Paradise Lost: a tall rounded gate of gold light on deep violet, a single star falling beside it.",
  },
  {
    slug: "divine-comedy",
    bookId: "the-divine-comedy",
    title: "The Divine Comedy",
    archetype: "ascent-journey",
    palette: { ground: "#26160F", ink: "#170D08", primary: "#7A4A2B", accent: "#4E7D5B", gold: "#EFC25E" },
    altText:
      "Original Tome vector cover for The Divine Comedy: concentric gold rings and steps rising toward a small lantern light on a deep umber field.",
  },
  {
    slug: "iliad",
    bookId: "the-iliad",
    title: "The Iliad",
    archetype: "fragment-evidence",
    palette: { ground: "#26354A", ink: "#141E2C", primary: "#4A6B8A", accent: "#C57B3A", gold: "#D9A94E" },
    altText:
      "Original Tome vector cover for The Iliad: a fragmented bronze shield and a diagonal spear above an ochre shoreline on slate blue.",
  },
  {
    slug: "odyssey",
    bookId: "the-odyssey",
    title: "The Odyssey",
    archetype: "map-voyage",
    palette: { ground: "#14243F", ink: "#0A1426", primary: "#2E4E86", accent: "#3FA08C", gold: "#E6BC58" },
    altText:
      "Original Tome vector cover for The Odyssey: a dotted gold voyage path curving between small islands under stars on an indigo sea.",
  },
  {
    slug: "frankenstein",
    bookId: "frankenstein",
    title: "Frankenstein",
    archetype: "experiment-spark",
    palette: { ground: "#101C26", ink: "#070F16", primary: "#23455A", accent: "#5FD3D0", gold: "#E3C169" },
    altText:
      "Original Tome vector cover for Frankenstein: dark alpine peaks under a pale moon, crossed by a single cyan spark line.",
  },
  {
    slug: "pride-prejudice",
    bookId: "pride-and-prejudice",
    title: "Pride and Prejudice",
    archetype: "social-geometry-letter",
    palette: { ground: "#F4EBDD", ink: "#3A2E2A", primary: "#8C6A4F", accent: "#5E7D4F", gold: "#D9A94E" },
    altText:
      "Original Tome vector cover for Pride and Prejudice: overlapping circles, a ribbon curve, and a small letter on warm cream with garden-green accents.",
  },
  {
    slug: "jane-eyre",
    bookId: "jane-eyre",
    title: "Jane Eyre",
    archetype: "window-ember",
    palette: { ground: "#2B1E24", ink: "#180F14", primary: "#5C3A46", accent: "#C4553B", gold: "#E0B45C" },
    altText:
      "Original Tome vector cover for Jane Eyre: a four-paned window glowing ember red above a dark moor line on deep plum.",
  },
  {
    slug: "meditations",
    bookId: "meditations",
    title: "Meditations",
    archetype: "quiet-symbol-tablet",
    palette: { ground: "#F0E7D8", ink: "#2E2620", primary: "#6E5B49", accent: "#9C3D33", gold: "#CFA050" },
    altText:
      "Original Tome vector cover for Meditations: a single wax tablet and stylus on warm ivory, with a quiet dawn band of stoic red and gold.",
  },
  {
    slug: "republic",
    bookId: "the-republic",
    title: "The Republic",
    archetype: "cave-city-light",
    palette: { ground: "#16233D", ink: "#0B1322", primary: "#2C4A7C", accent: "#3FA08C", gold: "#EAC35E" },
    altText:
      "Original Tome vector cover for The Republic: a geometric cobalt city above a dark cave opening, with a beam of gold light from a low sun.",
  },
]

// ── Shared drawing language ──────────────────
// Every cover is built from the same vocabulary: matte rounded forms,
// thin gold hairlines, soft glow circles, dotted connectors, and a paper
// grain scatter. Archetypes differ in composition, not in dialect.

function grain(seed, color, count = 520) {
  const rand = mulberry32(seed)
  const dots = []
  for (let i = 0; i < count; i += 1) {
    const x = (rand() * WIDTH).toFixed(1)
    const y = (rand() * HEIGHT).toFixed(1)
    const r = (0.6 + rand() * 1.6).toFixed(2)
    const o = (0.03 + rand() * 0.05).toFixed(3)
    dots.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`)
  }
  return `<g>${dots.join("")}</g>`
}

function star(cx, cy, r, fill, opacity = 1) {
  const p = [
    `M ${cx} ${cy - r}`,
    `L ${cx + r * 0.28} ${cy - r * 0.28}`,
    `L ${cx + r} ${cy}`,
    `L ${cx + r * 0.28} ${cy + r * 0.28}`,
    `L ${cx} ${cy + r}`,
    `L ${cx - r * 0.28} ${cy + r * 0.28}`,
    `L ${cx - r} ${cy}`,
    `L ${cx - r * 0.28} ${cy - r * 0.28}`,
    "Z",
  ].join(" ")
  return `<path d="${p}" fill="${fill}" opacity="${opacity}"/>`
}

function frame(p) {
  return [
    `<rect x="30" y="30" width="${WIDTH - 60}" height="${HEIGHT - 60}" rx="26" fill="none" stroke="${p.gold}" stroke-width="2" opacity="0.85"/>`,
    `<rect x="42" y="42" width="${WIDTH - 84}" height="${HEIGHT - 84}" rx="20" fill="none" stroke="${p.gold}" stroke-width="0.8" opacity="0.35"/>`,
  ].join("")
}

function vignette(p, id) {
  return [
    `<radialGradient id="${id}-vig" cx="0.5" cy="0.42" r="0.95">`,
    `<stop offset="0.55" stop-color="${p.ink}" stop-opacity="0"/>`,
    `<stop offset="1" stop-color="${p.ink}" stop-opacity="0.38"/>`,
    `</radialGradient>`,
  ].join("")
}

// ── Archetype compositions ───────────────────
// Each returns { defs, body } painted over the ground rect.

const ARCHETYPES = {
  // 1. Macbeth — crown, dagger, storm.
  "emblem-relic"(p, id) {
    const cx = WIDTH / 2
    const defs = [
      `<linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">`,
      `<stop offset="0" stop-color="${p.primary}"/><stop offset="1" stop-color="${p.ground}"/>`,
      `</linearGradient>`,
      vignette(p, id),
    ].join("")
    const clouds = [210, 280, 350]
      .map(
        (y, i) =>
          `<path d="M 90 ${y} Q ${cx - 140} ${y - 52} ${cx - 40} ${y} T ${WIDTH - 90} ${y + (i % 2) * 14}" fill="none" stroke="${p.ink}" stroke-width="30" stroke-linecap="round" opacity="0.45"/>`,
      )
      .join("")
    const blade =
      `<path d="M ${cx} 330 L ${cx + 26} 380 L ${cx + 10} 640 L ${cx} 690 L ${cx - 10} 640 L ${cx - 26} 380 Z" fill="#E9E4D8"/>` +
      `<rect x="${cx - 7}" y="372" width="14" height="250" rx="7" fill="${p.ink}" opacity="0.18"/>` +
      `<rect x="${cx - 60}" y="686" width="120" height="20" rx="10" fill="${p.gold}"/>` +
      `<rect x="${cx - 11}" y="700" width="22" height="64" rx="10" fill="${p.accent}"/>`
    const crown =
      `<path d="M ${cx - 88} 236 L ${cx - 88} 186 L ${cx - 44} 216 L ${cx} 168 L ${cx + 44} 216 L ${cx + 88} 186 L ${cx + 88} 236 Z" fill="${p.gold}"/>` +
      `<circle cx="${cx}" cy="196" r="7" fill="${p.accent}"/>`
    const flash = star(cx + 210, 180, 22, p.gold, 0.9) + star(cx - 220, 460, 12, p.gold, 0.5)
    const body =
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-sky)"/>` +
      clouds + flash + crown + blade +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },

  // 2. Moby-Dick — sea horizon and whale curve.
  "horizon-negative-space"(p, id) {
    const defs = [
      `<linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">`,
      `<stop offset="0" stop-color="${p.accent}"/><stop offset="1" stop-color="#C9DDE1"/>`,
      `</linearGradient>`,
      `<linearGradient id="${id}-sea" x1="0" y1="0" x2="0" y2="1">`,
      `<stop offset="0" stop-color="${p.primary}"/><stop offset="1" stop-color="${p.ink}"/>`,
      `</linearGradient>`,
      vignette(p, id),
    ].join("")
    const horizon = 640
    const whale =
      `<path d="M 180 ${horizon + 60} Q 300 ${horizon - 190} 470 ${horizon - 60} Q 520 ${horizon - 30} 560 ${horizon + 40} Q 380 ${horizon + 6} 180 ${horizon + 60} Z" fill="${p.ink}"/>` +
      `<path d="M 470 ${horizon - 60} Q 540 ${horizon - 120} 600 ${horizon - 96} Q 560 ${horizon - 40} 540 ${horizon + 10} Z" fill="${p.ink}"/>` +
      `<path d="M 250 ${horizon - 60} Q 300 ${horizon - 180} 330 ${horizon - 220}" fill="none" stroke="${p.accent}" stroke-width="8" stroke-linecap="round" opacity="0.8"/>` +
      `<path d="M 300 ${horizon - 40} Q 350 ${horizon - 150} 380 ${horizon - 190}" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linecap="round" opacity="0.5"/>`
    const swells = [horizon + 120, horizon + 210, horizon + 300]
      .map(
        (y, i) =>
          `<path d="M 60 ${y} Q 220 ${y - 26} 384 ${y} T 708 ${y}" fill="none" stroke="${i === 1 ? p.gold : p.accent}" stroke-width="${i === 1 ? 3 : 4}" stroke-linecap="round" opacity="${i === 1 ? 0.8 : 0.35}"/>`,
      )
      .join("")
    const compass = star(WIDTH / 2, 170, 30, p.gold) +
      `<circle cx="${WIDTH / 2}" cy="170" r="52" fill="none" stroke="${p.gold}" stroke-width="2" opacity="0.6"/>`
    const body =
      `<rect width="${WIDTH}" height="${horizon}" fill="url(#${id}-sky)"/>` +
      `<rect y="${horizon}" width="${WIDTH}" height="${HEIGHT - horizon}" fill="url(#${id}-sea)"/>` +
      compass + whale + swells +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },

  // 3. Alice — keys, cards, doors, scale shifts.
  "constellation-cabinet"(p) {
    const rand = mulberry32(42)
    const items = []
    const dots = []
    for (let i = 0; i < 14; i += 1) {
      dots.push({ x: 110 + rand() * (WIDTH - 220), y: 110 + rand() * (HEIGHT - 220) })
    }
    const connectors = dots
      .slice(0, -1)
      .map((d, i) => {
        const n = dots[i + 1]
        return `<path d="M ${d.x} ${d.y} L ${n.x} ${n.y}" fill="none" stroke="${p.ink}" stroke-width="1.6" stroke-dasharray="1 9" stroke-linecap="round" opacity="0.4"/>`
      })
      .join("")
    dots.forEach((d, i) => {
      const kind = i % 3
      if (kind === 0) {
        const w = 34 + rand() * 30
        items.push(
          `<rect x="${d.x - w / 2}" y="${d.y - w}" width="${w}" height="${w * 1.7}" rx="${w / 2}" fill="${i % 2 ? p.primary : p.accent}"/>` +
          `<circle cx="${d.x + w * 0.22}" cy="${d.y + w * 0.1}" r="3.5" fill="${p.gold}"/>`,
        )
      } else if (kind === 1) {
        items.push(
          `<circle cx="${d.x}" cy="${d.y}" r="14" fill="none" stroke="${p.gold}" stroke-width="6"/>` +
          `<rect x="${d.x - 3}" y="${d.y + 12}" width="6" height="30" rx="3" fill="${p.gold}"/>` +
          `<rect x="${d.x + 3}" y="${d.y + 32}" width="12" height="6" rx="3" fill="${p.gold}"/>`,
        )
      } else {
        items.push(
          `<path d="M ${d.x} ${d.y - 16} L ${d.x + 12} ${d.y} L ${d.x} ${d.y + 16} L ${d.x - 12} ${d.y} Z" fill="${p.accent}"/>`,
        )
      }
    })
    const body = `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` + connectors + items.join("")
    return { defs: "", body }
  },

  // 4. Paradise Lost — gate and falling star.
  "threshold-portal"(p, id) {
    const cx = WIDTH / 2
    const defs = [
      `<linearGradient id="${id}-gate" x1="0" y1="0" x2="0" y2="1">`,
      `<stop offset="0" stop-color="${p.gold}"/><stop offset="1" stop-color="${p.accent}"/>`,
      `</linearGradient>`,
      vignette(p, id),
    ].join("")
    const rings = [340, 430, 520]
      .map(
        (r) =>
          `<circle cx="${cx}" cy="470" r="${r}" fill="none" stroke="${p.primary}" stroke-width="2" opacity="0.5"/>`,
      )
      .join("")
    const gate =
      `<path d="M ${cx - 110} 780 L ${cx - 110} 430 Q ${cx} 300 ${cx + 110} 430 L ${cx + 110} 780 Z" fill="url(#${id}-gate)"/>` +
      `<path d="M ${cx - 76} 780 L ${cx - 76} 452 Q ${cx} 350 ${cx + 76} 452 L ${cx + 76} 780 Z" fill="${p.ground}"/>` +
      `<path d="M ${cx - 40} 780 L ${cx - 40} 480 Q ${cx} 406 ${cx + 40} 480 L ${cx + 40} 780 Z" fill="url(#${id}-gate)" opacity="0.9"/>`
    const fall =
      `<path d="M ${WIDTH - 150} 130 L ${WIDTH - 260} 420" stroke="${p.gold}" stroke-width="5" stroke-linecap="round" opacity="0.9"/>` +
      `<path d="M ${WIDTH - 168} 160 L ${WIDTH - 252} 390" stroke="${p.gold}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>` +
      star(WIDTH - 262, 428, 18, p.gold)
    const body =
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` +
      rings + gate + fall +
      star(140, 200, 9, p.gold, 0.7) + star(620, 640, 7, p.gold, 0.5) +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },

  // 5. Divine Comedy — rings, steps, lantern.
  "ascent-journey"(p, id) {
    const cx = WIDTH / 2
    const defs = [
      `<radialGradient id="${id}-glow" cx="0.5" cy="0.5" r="0.5">`,
      `<stop offset="0" stop-color="${p.gold}" stop-opacity="0.9"/>`,
      `<stop offset="1" stop-color="${p.gold}" stop-opacity="0"/>`,
      `</radialGradient>`,
      vignette(p, id),
    ].join("")
    const rings = [0, 1, 2, 3, 4]
      .map((i) => {
        const r = 320 - i * 56
        const y = 640 - i * 92
        return `<path d="M ${cx - r} ${y} A ${r} ${r * 0.42} 0 0 1 ${cx + r} ${y}" fill="none" stroke="${i % 2 ? p.primary : p.gold}" stroke-width="${i % 2 ? 10 : 5}" stroke-linecap="round" opacity="${0.5 + i * 0.1}"/>`
      })
      .join("")
    const steps = [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const w = 220 - i * 26
        const y = 830 - i * 78
        return `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="16" rx="8" fill="${p.ink}" opacity="0.55"/>`
      })
      .join("")
    const lantern =
      `<circle cx="${cx}" cy="196" r="86" fill="url(#${id}-glow)"/>` +
      `<rect x="${cx - 16}" y="176" width="32" height="44" rx="9" fill="${p.gold}"/>` +
      `<path d="M ${cx - 12} 176 Q ${cx} 152 ${cx + 12} 176" fill="none" stroke="${p.gold}" stroke-width="5"/>` +
      `<circle cx="${cx}" cy="198" r="7" fill="#FFF3D6"/>` +
      `<path d="M ${cx - 60} 250 q 14 -18 30 -6 q 16 -14 30 4" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>`
    const body =
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` +
      rings + steps + lantern +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },

  // 6. Odyssey — stars, islands, path.
  "map-voyage"(p, id) {
    const defs = [vignette(p, id)].join("")
    const islands = [
      { x: 150, y: 700, rx: 74, ry: 40 },
      { x: 330, y: 480, rx: 56, ry: 32 },
      { x: 540, y: 620, rx: 66, ry: 36 },
      { x: 600, y: 330, rx: 48, ry: 28 },
    ]
    const route =
      `<path d="M 120 800 Q 200 620 330 480 T 600 330" fill="none" stroke="${p.gold}" stroke-width="5" stroke-dasharray="2 16" stroke-linecap="round"/>` +
      `<circle cx="120" cy="800" r="10" fill="${p.gold}"/>` +
      star(600, 330, 16, p.gold)
    const land = islands
      .map(
        (i, k) =>
          `<ellipse cx="${i.x}" cy="${i.y}" rx="${i.rx}" ry="${i.ry}" fill="${k % 2 ? p.accent : p.primary}"/>` +
          `<ellipse cx="${i.x - i.rx * 0.2}" cy="${i.y - i.ry * 0.4}" rx="${i.rx * 0.4}" ry="${i.ry * 0.35}" fill="${p.ink}" opacity="0.25"/>`,
      )
      .join("")
    const stars = [
      [130, 160, 10], [250, 240, 7], [420, 140, 12], [560, 200, 8], [660, 120, 6], [340, 320, 6],
    ]
      .map(([x, y, r]) => star(x, y, r, "#EAF0F6", 0.85))
      .join("")
    const swells = [840, 900, 950]
      .map(
        (y) =>
          `<path d="M 70 ${y} Q 240 ${y - 22} 400 ${y} T 700 ${y}" fill="none" stroke="${p.primary}" stroke-width="4" stroke-linecap="round" opacity="0.5"/>`,
      )
      .join("")
    const body =
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` +
      stars + land + route + swells +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },

  // 7. Iliad — shield, spear, shoreline fragments.
  "fragment-evidence"(p, id) {
    const cx = WIDTH / 2
    const defs = [vignette(p, id)].join("")
    const shore =
      `<path d="M 0 760 Q 240 700 420 750 T 768 720 L 768 1024 L 0 1024 Z" fill="${p.accent}" opacity="0.85"/>` +
      `<path d="M 0 800 Q 260 750 470 795 T 768 770" fill="none" stroke="${p.gold}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>` +
      [0, 1, 2, 3, 4]
        .map((i) => `<path d="M ${90 + i * 140} ${840 + (i % 2) * 34} l 46 -10 l 30 16 l -52 12 Z" fill="${p.ink}" opacity="0.4"/>`)
        .join("")
    const shield =
      `<path d="M ${cx} 210 A 170 170 0 0 1 ${cx + 147} 475 L ${cx + 40} 430 A 90 90 0 0 0 ${cx} 300 Z" fill="${p.accent}"/>` +
      `<path d="M ${cx + 147} 475 A 170 170 0 0 1 ${cx - 160} 440 L ${cx - 60} 400 A 90 90 0 0 0 ${cx + 40} 430 Z" fill="${p.primary}"/>` +
      `<path d="M ${cx - 160} 440 A 170 170 0 0 1 ${cx} 210 L ${cx} 300 A 90 90 0 0 0 ${cx - 60} 400 Z" fill="${p.gold}"/>` +
      `<circle cx="${cx}" cy="385" r="26" fill="${p.ink}"/>`
    const spear =
      `<path d="M 120 660 L 640 180" stroke="${p.gold}" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M 640 180 l -52 8 l 30 26 Z" fill="#E9E4D8"/>`
    const body =
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` +
      shore + shield + spear +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },

  // 8. Frankenstein — alpine silhouette and energy line.
  "experiment-spark"(p, id) {
    const defs = [
      `<radialGradient id="${id}-moon" cx="0.5" cy="0.5" r="0.5">`,
      `<stop offset="0" stop-color="#EAF6F6"/><stop offset="1" stop-color="#EAF6F6" stop-opacity="0"/>`,
      `</radialGradient>`,
      vignette(p, id),
    ].join("")
    const peaks =
      `<path d="M 0 760 L 150 470 L 260 660 L 390 400 L 520 640 L 640 500 L 768 700 L 768 1024 L 0 1024 Z" fill="${p.ink}"/>` +
      `<path d="M 150 470 L 200 560 L 120 560 Z" fill="${p.primary}"/>` +
      `<path d="M 390 400 L 450 520 L 330 520 Z" fill="${p.primary}"/>` +
      `<path d="M 640 500 L 690 590 L 596 590 Z" fill="${p.primary}"/>`
    const sparkPts = [
      [90, 830], [190, 700], [280, 760], [390, 560], [480, 640], [590, 460], [690, 520],
    ]
    const spark =
      `<path d="M ${sparkPts.map((pt) => pt.join(" ")).join(" L ")}" fill="none" stroke="${p.accent}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>` +
      sparkPts
        .map(
          ([x, y], i) =>
            `<circle cx="${x}" cy="${y}" r="${i === 3 ? 12 : 7}" fill="${p.accent}" opacity="${i === 3 ? 0.95 : 0.7}"/>`,
        )
        .join("") +
      `<circle cx="390" cy="560" r="34" fill="${p.accent}" opacity="0.2"/>`
    const moon =
      `<circle cx="600" cy="200" r="96" fill="url(#${id}-moon)"/>` +
      `<circle cx="600" cy="200" r="52" fill="#EAF6F6"/>`
    const body =
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` +
      moon + peaks + spark +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },

  // 9. Pride and Prejudice — ribbon, letter, garden geometry.
  "social-geometry-letter"(p) {
    const circles =
      `<circle cx="300" cy="360" r="150" fill="none" stroke="${p.accent}" stroke-width="7"/>` +
      `<circle cx="450" cy="360" r="150" fill="none" stroke="${p.primary}" stroke-width="7"/>` +
      `<circle cx="375" cy="490" r="150" fill="none" stroke="${p.gold}" stroke-width="7"/>` +
      `<circle cx="375" cy="416" r="12" fill="${p.ink}"/>`
    const ribbon =
      `<path d="M 120 700 Q 300 620 420 700 T 660 660" fill="none" stroke="${p.accent}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M 120 740 Q 300 660 420 740 T 660 700" fill="none" stroke="${p.gold}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>`
    const letter =
      `<rect x="309" y="560" width="150" height="104" rx="10" fill="#FBF6EC" stroke="${p.ink}" stroke-width="3"/>` +
      `<path d="M 309 570 L 384 626 L 459 570" fill="none" stroke="${p.ink}" stroke-width="3"/>` +
      `<circle cx="384" cy="616" r="13" fill="${p.accent}"/>`
    const garden = [0, 1, 2, 3, 4, 5]
      .map((i) => `<circle cx="${130 + i * 100}" cy="860" r="6" fill="${p.accent}" opacity="0.6"/>`)
      .join("")
    const body = `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` + garden + circles + ribbon + letter
    return { defs: "", body }
  },

  // 10. Jane Eyre — window, ember, moor.
  "window-ember"(p, id) {
    const cx = WIDTH / 2
    const defs = [
      `<radialGradient id="${id}-ember" cx="0.5" cy="0.55" r="0.55">`,
      `<stop offset="0" stop-color="#F2A65A"/>`,
      `<stop offset="0.55" stop-color="${p.accent}"/>`,
      `<stop offset="1" stop-color="${p.accent}" stop-opacity="0"/>`,
      `</radialGradient>`,
      vignette(p, id),
    ].join("")
    const moor =
      `<path d="M 0 720 Q 200 660 400 715 T 768 690 L 768 1024 L 0 1024 Z" fill="${p.ink}"/>` +
      `<path d="M 0 760 Q 240 705 460 752 T 768 730" fill="none" stroke="${p.primary}" stroke-width="5" stroke-linecap="round" opacity="0.8"/>`
    const win =
      `<circle cx="${cx}" cy="400" r="215" fill="url(#${id}-ember)"/>` +
      `<rect x="${cx - 130}" y="250" width="260" height="330" rx="14" fill="${p.ink}"/>` +
      `<rect x="${cx - 112}" y="268" width="102" height="140" rx="6" fill="url(#${id}-ember)"/>` +
      `<rect x="${cx + 10}" y="268" width="102" height="140" rx="6" fill="url(#${id}-ember)"/>` +
      `<rect x="${cx - 112}" y="422" width="102" height="140" rx="6" fill="${p.accent}" opacity="0.85"/>` +
      `<rect x="${cx + 10}" y="422" width="102" height="140" rx="6" fill="${p.accent}" opacity="0.6"/>` +
      `<rect x="${cx - 130}" y="250" width="260" height="330" rx="14" fill="none" stroke="${p.gold}" stroke-width="5"/>`
    const body =
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` +
      win + moor +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },

  // 11. Meditations — wax tablet, quiet dawn.
  "quiet-symbol-tablet"(p, id) {
    const cx = WIDTH / 2
    const defs = [
      `<linearGradient id="${id}-dawn" x1="0" y1="0" x2="0" y2="1">`,
      `<stop offset="0" stop-color="${p.gold}" stop-opacity="0.9"/>`,
      `<stop offset="0.5" stop-color="${p.accent}" stop-opacity="0.55"/>`,
      `<stop offset="1" stop-color="${p.ground}" stop-opacity="0"/>`,
      `</linearGradient>`,
    ].join("")
    const dawn =
      `<rect y="560" width="${WIDTH}" height="290" fill="url(#${id}-dawn)"/>` +
      `<circle cx="${cx}" cy="560" r="64" fill="${p.gold}"/>` +
      `<rect y="556" width="${WIDTH}" height="8" fill="${p.ground}"/>`
    const tablet =
      `<rect x="${cx - 150}" y="300" width="300" height="240" rx="20" fill="${p.primary}"/>` +
      `<rect x="${cx - 126}" y="324" width="252" height="192" rx="12" fill="#EADFC8"/>` +
      [0, 1, 2, 3]
        .map(
          (i) =>
            `<rect x="${cx - 100}" y="${356 + i * 40}" width="${200 - (i % 2) * 46}" height="9" rx="4.5" fill="${p.primary}" opacity="0.55"/>`,
        )
        .join("")
    const stylus =
      `<path d="M ${cx + 96} 250 L ${cx + 170} 470" stroke="${p.ink}" stroke-width="11" stroke-linecap="round"/>` +
      `<path d="M ${cx + 170} 470 l -16 22 l 26 -6 Z" fill="${p.gold}"/>`
    const body = `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` + dawn + tablet + stylus
    return { defs, body }
  },

  // 12. The Republic — cave, city, light.
  "cave-city-light"(p, id) {
    const cx = WIDTH / 2
    const defs = [
      `<linearGradient id="${id}-beam" x1="0" y1="0" x2="0" y2="1">`,
      `<stop offset="0" stop-color="${p.gold}" stop-opacity="0.85"/>`,
      `<stop offset="1" stop-color="${p.gold}" stop-opacity="0"/>`,
      `</linearGradient>`,
      vignette(p, id),
    ].join("")
    const sun =
      `<circle cx="${cx}" cy="150" r="66" fill="${p.gold}"/>` +
      `<circle cx="${cx}" cy="150" r="96" fill="none" stroke="${p.gold}" stroke-width="2" opacity="0.5"/>`
    const beam = `<path d="M ${cx - 70} 210 L ${cx + 70} 210 L ${cx + 210} 760 L ${cx - 210} 760 Z" fill="url(#${id}-beam)" opacity="0.35"/>`
    const blocks = [
      [200, 500, 70, 150], [290, 440, 84, 210], [394, 470, 70, 180], [484, 420, 88, 230], [592, 500, 64, 150],
    ]
      .map(([x, y, w, h], i) => {
        const fill = i % 2 ? p.primary : p.accent
        const winRows = [0, 1, 2]
          .map(
            (r) =>
              `<rect x="${x + 12}" y="${y + 16 + r * 42}" width="${w - 24}" height="16" rx="4" fill="${p.gold}" opacity="${0.5 + r * 0.15}"/>`,
          )
          .join("")
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}"/>${winRows}`
      })
      .join("")
    const cave =
      `<path d="M 0 1024 L 0 760 Q ${cx} 620 768 760 L 768 1024 Z" fill="${p.ink}"/>` +
      `<path d="M 0 800 Q ${cx} 668 768 800" fill="none" stroke="${p.gold}" stroke-width="3" opacity="0.6"/>` +
      [0, 1, 2]
        .map(
          (i) =>
            `<path d="M ${250 + i * 90} ${880 + (i % 2) * 24} q 20 -34 44 0 q -22 12 -44 0 Z" fill="${p.ground}" opacity="0.7"/>`,
        )
        .join("")
    const body =
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="${p.ground}"/>` +
      beam + sun + blocks + cave +
      `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${id}-vig)"/>`
    return { defs, body }
  },
}

// ── SVG assembly ─────────────────────────────

function buildSvg(book) {
  const p = book.palette
  const seed = [...book.slug].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const { defs, body } = ARCHETYPES[book.archetype](p, book.slug)
  const grainColor = ["alice", "pride-prejudice", "meditations"].includes(book.slug)
    ? p.ink
    : "#FFFFFF"
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${book.altText.replace(/"/g, "&quot;")}">`,
    defs ? `<defs>${defs}</defs>` : "",
    body,
    grain(seed, grainColor),
    frame(p),
    `</svg>`,
  ]
    .filter(Boolean)
    .join("\n")
}

// ── Contact sheet (QA artifact) ──────────────

function buildContactSheet() {
  const cellW = 280
  const cellH = 374 + 30
  const cols = 4
  const rows = Math.ceil(BOOKS.length / cols)
  const cells = BOOKS.map((book, i) => {
    const x = 24 + (i % cols) * (cellW + 16)
    const y = 24 + Math.floor(i / cols) * (cellH + 16)
    return [
      `<g>`,
      `<image href="${book.slug}.svg" x="${x}" y="${y}" width="${cellW}" height="374" preserveAspectRatio="xMidYMid meet"/>`,
      `<text x="${x}" y="${y + 396}" font-family="monospace" font-size="15" fill="#333">${book.slug} · ${book.archetype}</text>`,
      `</g>`,
    ].join("")
  }).join("\n")
  const w = 24 * 2 + cols * cellW + (cols - 1) * 16
  const h = 24 * 2 + rows * cellH + (rows - 1) * 16
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n<rect width="${w}" height="${h}" fill="#F5F2EB"/>\n${cells}\n</svg>\n`
}

// ── Main ─────────────────────────────────────

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })

  let sharp = null
  try {
    sharp = (await import("sharp")).default
  } catch {
    console.warn("sharp not available — writing SVG sources only.")
  }

  const entries = []
  for (const book of BOOKS) {
    const svg = buildSvg(book)
    const svgPath = path.join(OUT_DIR, `${book.slug}.svg`)
    await fs.writeFile(svgPath, svg, "utf8")

    const files = { svg: `/covers/tome-generated/${book.slug}.svg` }
    if (sharp) {
      const pngPath = path.join(OUT_DIR, `${book.slug}.png`)
      const webpPath = path.join(OUT_DIR, `${book.slug}.webp`)
      const buffer = Buffer.from(svg)
      await sharp(buffer, { density: 144 }).png({ compressionLevel: 9 }).toFile(pngPath)
      await sharp(buffer, { density: 144 }).webp({ quality: 88 }).toFile(webpPath)
      files.png = `/covers/tome-generated/${book.slug}.png`
      files.webp = `/covers/tome-generated/${book.slug}.webp`
    }

    entries.push({
      slug: book.slug,
      bookId: book.bookId,
      title: book.title,
      archetype: book.archetype,
      paletteSlot: book.slug,
      palette: book.palette,
      files,
      altText: book.altText,
      provenance: "original Tome vector art",
      provenanceNote:
        "Procedurally generated by scripts/covers/tome-vector-covers.mjs " +
        "(deterministic seeded composition; sharp raster exports). No " +
        "public-domain source art, no baked-in title/author text.",
    })
    console.log(`✓ ${book.slug} (${book.archetype})`)
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    generator: {
      script: "scripts/covers/tome-vector-covers.mjs",
      version: GENERATOR_VERSION,
      runtime: `node ${process.version}`,
      raster: sharp ? "sharp" : "svg-only",
    },
    outputDir: OUT_DIR,
    dimensions: { width: WIDTH, height: HEIGHT, aspect: "3:4" },
    count: entries.length,
    contactSheet: `/covers/tome-generated/contact-sheet.svg`,
    entries,
  }
  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  )
  await fs.writeFile(path.join(OUT_DIR, "contact-sheet.svg"), buildContactSheet(), "utf8")

  console.log(`\nWrote ${entries.length} covers + manifest + contact sheet to ${OUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
