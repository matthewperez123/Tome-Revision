#!/usr/bin/env node

// ─────────────────────────────────────────────
// Tome Stoa Reward Art Generator
// ─────────────────────────────────────────────
// Procedurally generates the twelve ORIGINAL Stoa reward paintings
// (MASTER_EXECUTION_PLAN §11) — one per featured book, unlocked in the
// reader's Stoa by a passed Trial. Every painting shares one architectural
// dialect — an arch niche with fluted columns, an entablature, a stepped
// plinth, and a central medallion — so the gallery reads as a curated
// courtyard rather than twelve unrelated images. Inside the medallion sits
// the book's motif, drawn in the book's Living Archive world palette.
//
//   node scripts/stoa/gen-stoa-art.mjs
//
// Outputs to public/stoa/:
//   <slug>.svg            vector source (720x1080, 2:3), no text baked in
//   manifest.json         alt text + provenance ("Original Tome art")
//   contact-sheet.svg     QA contact sheet for visual balance review
//
// Palette/motif data mirrors src/lib/design/tokens.ts (laWorlds) and
// src/lib/books/registry.ts. If you change a palette there, change it here
// and re-run. Validation: each SVG is parsed by sharp after writing.

import fs from "node:fs/promises"
import path from "node:path"

const WIDTH = 720
const HEIGHT = 1080
const OUT_DIR = "public/stoa"
const GENERATOR_VERSION = "1.0.0"

// Shared architectural stone tone — identical across all twelve paintings
// so the courtyard feels like one building.
const STONE = "#EDE4D0"
const STONE_DIM = "#C9BEA6"

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

function seedFor(slug) {
  let h = 2166136261
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// ── Book configs (mirror of laWorlds + registry motifs) ──

const BOOKS = [
  {
    slug: "macbeth",
    title: "Macbeth",
    palette: { ground: "#45506B", deep: "#232A3D", accent: "#E4B95B", glow: "#9AA7C7" },
    motif: "crown, dagger, storm",
    altText:
      "Original Tome Stoa painting for Macbeth: a gold crown above an upright " +
      "dagger inside a stone arch medallion, crossed by jagged storm lines.",
  },
  {
    slug: "moby-dick",
    title: "Moby-Dick",
    palette: { ground: "#2F6E8F", deep: "#12303F", accent: "#E8D9B5", glow: "#7FC4D9" },
    motif: "sea horizon, whale curve, compass star",
    altText:
      "Original Tome Stoa painting for Moby-Dick: a pale whale curve breaching " +
      "a horizon line inside a stone arch medallion, a gold compass star above.",
  },
  {
    slug: "alice",
    title: "Alice's Adventures in Wonderland",
    palette: { ground: "#4E9BA6", deep: "#233A4A", accent: "#E05A6B", glow: "#F2D98C" },
    motif: "keys, cards, doors, scale shifts",
    altText:
      "Original Tome Stoa painting for Alice's Adventures in Wonderland: a gold " +
      "key, a small arched door, and a card diamond inside a stone arch medallion.",
  },
  {
    slug: "paradise-lost",
    title: "Paradise Lost",
    palette: { ground: "#4A3F78", deep: "#1C1830", accent: "#E4C66B", glow: "#B8A9E8" },
    motif: "gate, falling star, celestial geometry",
    altText:
      "Original Tome Stoa painting for Paradise Lost: an open gate of gold light " +
      "inside a stone arch medallion, a single star falling beside it.",
  },
  {
    slug: "divine-comedy",
    title: "The Divine Comedy",
    palette: { ground: "#7C6BA8", deep: "#2A1E3F", accent: "#E8B23C", glow: "#9FD8E8" },
    motif: "rings, steps, lantern, laurel",
    altText:
      "Original Tome Stoa painting for The Divine Comedy: concentric gold rings " +
      "and rising steps around a small lantern inside a stone arch medallion.",
  },
  {
    slug: "iliad",
    title: "The Iliad",
    palette: { ground: "#A6643A", deep: "#3E2A1C", accent: "#2E5E8C", glow: "#E0A75B" },
    motif: "shield, spear, shoreline fragments",
    altText:
      "Original Tome Stoa painting for The Iliad: a bronze shield broken into " +
      "quartered fragments inside a stone arch medallion, crossed by a spear.",
  },
  {
    slug: "odyssey",
    title: "The Odyssey",
    palette: { ground: "#2C4E7C", deep: "#14233C", accent: "#D9C08A", glow: "#6FA8D8" },
    motif: "stars, islands, path, rope",
    altText:
      "Original Tome Stoa painting for The Odyssey: a dotted gold voyage path " +
      "between small islands inside a stone arch medallion, a mast under stars.",
  },
  {
    slug: "frankenstein",
    title: "Frankenstein",
    palette: { ground: "#4A6070", deep: "#1E2A33", accent: "#63C7E0", glow: "#A8E4F0" },
    motif: "alpine silhouette, laboratory spark, ice",
    altText:
      "Original Tome Stoa painting for Frankenstein: an alpine ridge inside a " +
      "stone arch medallion, split by a single cyan spark line under a pale moon.",
  },
  {
    slug: "pride-prejudice",
    title: "Pride and Prejudice",
    palette: { ground: "#6E9A6B", deep: "#2E4030", accent: "#D98CA6", glow: "#F2E4BC" },
    motif: "ribbon, letter, garden geometry",
    altText:
      "Original Tome Stoa painting for Pride and Prejudice: two overlapping " +
      "circles and a ribbon curve above a small letter inside a stone arch medallion.",
  },
  {
    slug: "jane-eyre",
    title: "Jane Eyre",
    palette: { ground: "#7A3E34", deep: "#2E1E22", accent: "#E0885B", glow: "#C9A9BC" },
    motif: "window, ember, moor, red room",
    altText:
      "Original Tome Stoa painting for Jane Eyre: a four-paned window glowing " +
      "ember red inside a stone arch medallion above a dark moor line.",
  },
  {
    slug: "meditations",
    title: "Meditations",
    palette: { ground: "#B8895A", deep: "#3A2E24", accent: "#A03A30", glow: "#F0D9B5" },
    motif: "wax tablet, stylus, quiet dawn",
    altText:
      "Original Tome Stoa painting for Meditations: a wax tablet and stylus " +
      "inside a stone arch medallion, backed by a quiet dawn band.",
  },
  {
    slug: "republic",
    title: "The Republic",
    palette: { ground: "#2E5BE6", deep: "#1A2340", accent: "#D9A63C", glow: "#7FB0F0" },
    motif: "geometric city, cave light, sun",
    altText:
      "Original Tome Stoa painting for The Republic: a gold sun over a geometric " +
      "city inside a stone arch medallion, rising from a cave opening.",
  },
]

// ── Shared architecture (one dialect) ────────
// Canvas 720x1080. Entablature at top, two fluted columns flanking a
// semicircular arch opening, a stepped plinth, and a centered medallion.

const MED = { cx: 360, cy: 520, r: 190, inner: 168 }

function archPath(x, width, springY, footY) {
  // Semicircular arch: left foot up to spring line, arc across, down to right foot.
  const r = width / 2
  return (
    `M ${x} ${footY} L ${x} ${springY} ` +
    `A ${r} ${r} 0 0 1 ${x + width} ${springY} L ${x + width} ${footY} Z`
  )
}

function column(x, top, bottom, uid) {
  const w = 46
  const capH = 18
  const baseH = 16
  const flutes = [-13, 0, 13]
    .map(
      (dx) =>
        `<line x1="${x + w / 2 + dx}" y1="${top + capH + 8}" x2="${x + w / 2 + dx}" y2="${bottom - baseH - 8}" stroke="${STONE_DIM}" stroke-width="2" opacity="0.55"/>`,
    )
    .join("")
  return `
  <g>
    <rect x="${x - 5}" y="${top}" width="${w + 10}" height="${capH}" rx="3" fill="${STONE}" opacity="0.92"/>
    <rect x="${x}" y="${top + capH}" width="${w}" height="${bottom - baseH - top - capH}" fill="url(#stoneShaft-${uid})"/>
    ${flutes}
    <rect x="${x - 6}" y="${bottom - baseH}" width="${w + 12}" height="${baseH}" rx="2" fill="${STONE}" opacity="0.92"/>
  </g>`
}

function plinth() {
  return `
  <g>
    <rect x="252" y="836" width="216" height="22" rx="3" fill="${STONE}" opacity="0.9"/>
    <rect x="230" y="858" width="260" height="20" rx="3" fill="${STONE}" opacity="0.78"/>
    <rect x="206" y="878" width="308" height="22" rx="3" fill="${STONE}" opacity="0.66"/>
  </g>`
}

function architecture(uid, gold) {
  const springY = 480
  const footY = 900
  return `
  <!-- entablature -->
  <rect x="56" y="92" width="608" height="52" rx="4" fill="${STONE}" opacity="0.16"/>
  <line x1="56" y1="92" x2="664" y2="92" stroke="${gold}" stroke-width="2" opacity="0.8"/>
  <line x1="56" y1="144" x2="664" y2="144" stroke="${gold}" stroke-width="1" opacity="0.5"/>
  <!-- arch opening -->
  <path d="${archPath(150, 420, springY, footY)}" fill="url(#archSky-${uid})"/>
  <path d="${archPath(150, 420, springY, footY)}" fill="none" stroke="${gold}" stroke-width="2.5" opacity="0.9"/>
  <path d="${archPath(138, 444, springY - 12, footY + 10)}" fill="none" stroke="${STONE}" stroke-width="6" opacity="0.35"/>
  <!-- columns -->
  ${column(92, 152, footY, uid)}
  ${column(582, 152, footY, uid)}
  <!-- floor -->
  <rect x="0" y="${footY}" width="${WIDTH}" height="${HEIGHT - footY}" fill="${STONE}" opacity="0.10"/>
  <line x1="0" y1="${footY}" x2="${WIDTH}" y2="${footY}" stroke="${gold}" stroke-width="1.5" opacity="0.45"/>
  ${plinth()}`
}

function medallion(uid, palette) {
  const { cx, cy, r, inner } = MED
  return `
  <circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="none" stroke="${palette.accent}" stroke-width="1.5" opacity="0.35"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#field-${uid})" stroke="${palette.accent}" stroke-width="3"/>
  <circle cx="${cx}" cy="${cy}" r="${inner}" fill="none" stroke="${palette.accent}" stroke-width="1" opacity="0.6"/>
  <clipPath id="medClip-${uid}"><circle cx="${cx}" cy="${cy}" r="${inner}"/></clipPath>`
}

// ── Motifs (drawn in a <g transform="translate(360 520)">, r≤160) ──

const MOTIFS = {
  macbeth: (p) => `
    <polyline points="-140,-150 -118,-118 -132,-116 -104,-78" fill="none" stroke="${p.glow}" stroke-width="5" stroke-linejoin="round" opacity="0.85"/>
    <polyline points="96,-158 116,-128 102,-126 128,-92" fill="none" stroke="${p.glow}" stroke-width="4" stroke-linejoin="round" opacity="0.6"/>
    <polygon points="-52,-96 -38,-128 -24,-100 -12,-130 0,-98 12,-130 24,-100 38,-128 52,-96 52,-84 -52,-84" fill="${p.accent}"/>
    <rect x="-56" y="-84" width="112" height="12" rx="3" fill="${p.accent}" opacity="0.9"/>
    <g>
      <polygon points="0,96 -9,6 -4,0 4,0 9,6" fill="${p.glow}"/>
      <polygon points="0,96 -3,6 0,2 3,6" fill="${p.deep}" opacity="0.35"/>
      <rect x="-26" y="-2" width="52" height="9" rx="4" fill="${p.accent}"/>
      <rect x="-6" y="7" width="12" height="30" rx="4" fill="${p.accent}" opacity="0.85"/>
      <circle cx="0" cy="44" r="8" fill="${p.accent}"/>
      <line x1="0" y1="96" x2="0" y2="112" stroke="${p.glow}" stroke-width="3" opacity="0.5"/>
    </g>`,

  "moby-dick": (p) => `
    <circle cx="62" cy="-108" r="5" fill="${p.accent}"/>
    <polygon points="62,-128 68,-112 84,-108 68,-104 62,-88 56,-104 40,-108 56,-112" fill="${p.accent}"/>
    <circle cx="-96" cy="-96" r="2.5" fill="${p.glow}" opacity="0.8"/>
    <circle cx="-34" cy="-124" r="2" fill="${p.glow}" opacity="0.6"/>
    <circle cx="128" cy="-52" r="2.5" fill="${p.glow}" opacity="0.7"/>
    <path d="M -150,44 Q -96,-64 -18,-34 Q 66,-2 132,40" fill="none" stroke="${p.accent}" stroke-width="14" stroke-linecap="round"/>
    <polygon points="-150,44 -186,18 -178,52 -190,74" fill="${p.accent}"/>
    <line x1="-150" y1="60" x2="150" y2="60" stroke="${p.glow}" stroke-width="3" opacity="0.85"/>
    <path d="M -110,60 q 10,-12 20,0 M -60,60 q 10,-12 20,0 M 10,60 q 10,-12 20,0 M 70,60 q 10,-12 20,0" fill="none" stroke="${p.glow}" stroke-width="3" opacity="0.6"/>`,

  alice: (p) => `
    <line x1="-120" y1="-96" x2="-40" y2="-30" stroke="${p.glow}" stroke-width="1.5" stroke-dasharray="2 6" opacity="0.7"/>
    <line x1="-40" y1="-30" x2="60" y2="10" stroke="${p.glow}" stroke-width="1.5" stroke-dasharray="2 6" opacity="0.7"/>
    <line x1="60" y1="10" x2="-84" y2="92" stroke="${p.glow}" stroke-width="1.5" stroke-dasharray="2 6" opacity="0.7"/>
    <g transform="translate(-72 -62) rotate(-18)">
      <circle cx="0" cy="0" r="17" fill="none" stroke="${p.accent}" stroke-width="7"/>
      <line x1="0" y1="17" x2="0" y2="62" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
      <line x1="0" y1="46" x2="14" y2="46" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
      <line x1="0" y1="60" x2="11" y2="60" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
    </g>
    <path d="M 22,108 L 22,-6 A 34 34 0 0 1 90,-6 L 90,108 Z" fill="${p.deep}" stroke="${p.glow}" stroke-width="4"/>
    <circle cx="78" cy="52" r="4.5" fill="${p.glow}"/>
    <polygon points="-92,66 -70,92 -92,118 -114,92" fill="${p.accent}" opacity="0.92"/>
    <circle cx="128" cy="-84" r="3" fill="${p.glow}"/>
    <circle cx="-128" cy="4" r="2.5" fill="${p.glow}" opacity="0.8"/>`,

  "paradise-lost": (p) => `
    <line x1="118" y1="-138" x2="46" y2="-30" stroke="${p.glow}" stroke-width="3" opacity="0.55"/>
    <polygon points="34,-22 46,-52 52,-22 46,2" fill="${p.accent}"/>
    <circle cx="122" cy="-142" r="4" fill="${p.glow}"/>
    <path d="M -52,120 L -52,-56 A 52 52 0 0 1 52,-56 L 52,120" fill="none" stroke="${p.accent}" stroke-width="6"/>
    <path d="M -36,120 L -36,-52 A 36 36 0 0 1 36,-52 L 36,120 Z" fill="${p.accent}" opacity="0.22"/>
    <line x1="0" y1="-104" x2="0" y2="120" stroke="${p.accent}" stroke-width="2" opacity="0.7"/>
    <line x1="-52" y1="120" x2="52" y2="120" stroke="${p.accent}" stroke-width="6"/>
    <circle cx="-108" cy="-96" r="2.5" fill="${p.glow}" opacity="0.75"/>
    <circle cx="-128" cy="30" r="2" fill="${p.glow}" opacity="0.55"/>
    <circle cx="104" cy="74" r="2.5" fill="${p.glow}" opacity="0.65"/>`,

  "divine-comedy": (p) => `
    <circle cx="0" cy="0" r="128" fill="none" stroke="${p.accent}" stroke-width="2.5" opacity="0.45"/>
    <circle cx="0" cy="0" r="92" fill="none" stroke="${p.accent}" stroke-width="3" opacity="0.65"/>
    <circle cx="0" cy="0" r="56" fill="none" stroke="${p.accent}" stroke-width="3.5" opacity="0.9"/>
    <rect x="-118" y="86" width="42" height="14" rx="2" fill="${p.glow}" opacity="0.45"/>
    <rect x="-92" y="62" width="42" height="14" rx="2" fill="${p.glow}" opacity="0.6"/>
    <rect x="-66" y="38" width="42" height="14" rx="2" fill="${p.glow}" opacity="0.75"/>
    <circle cx="0" cy="0" r="14" fill="${p.accent}"/>
    <circle cx="0" cy="0" r="26" fill="${p.accent}" opacity="0.25"/>
    <line x1="0" y1="-14" x2="0" y2="-34" stroke="${p.accent}" stroke-width="3"/>
    <path d="M -14,44 Q 0,60 14,44" fill="none" stroke="${p.glow}" stroke-width="3" opacity="0.8"/>
    <circle cx="98" cy="-98" r="3" fill="${p.glow}" opacity="0.8"/>`,

  iliad: (p) => `
    <line x1="-128" y1="118" x2="112" y2="-122" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
    <polygon points="112,-122 88,-108 104,-96" fill="${p.accent}"/>
    <g fill="none" stroke="${p.glow}" stroke-width="12">
      <path d="M -12,-108 A 109 109 0 0 1 108,-12" transform="translate(6 -6)"/>
      <path d="M 108,12 A 109 109 0 0 1 12,108" transform="translate(6 6)"/>
      <path d="M 12,108 A 109 109 0 0 1 -108,12" transform="translate(-6 6)"/>
      <path d="M -108,-12 A 109 109 0 0 1 -12,-108" transform="translate(-6 -6)"/>
    </g>
    <circle cx="0" cy="0" r="30" fill="none" stroke="${p.glow}" stroke-width="8"/>
    <circle cx="0" cy="0" r="8" fill="${p.glow}"/>`,

  odyssey: (p) => `
    <circle cx="-112" cy="-118" r="2.5" fill="${p.glow}"/>
    <circle cx="-40" cy="-136" r="3" fill="${p.glow}"/>
    <circle cx="52" cy="-110" r="2.5" fill="${p.glow}"/>
    <circle cx="118" cy="-66" r="3" fill="${p.glow}"/>
    <circle cx="-128" cy="-40" r="2" fill="${p.glow}" opacity="0.7"/>
    <path d="M -120,96 Q -60,20 0,44 T 120,-24" fill="none" stroke="${p.accent}" stroke-width="4" stroke-dasharray="1 12" stroke-linecap="round"/>
    <path d="M -120,96 a 20 20 0 0 1 40 0 Z" fill="${p.glow}" opacity="0.85"/>
    <path d="M 60,30 a 16 16 0 0 1 32 0 Z" fill="${p.glow}" opacity="0.7"/>
    <path d="M 96,-60 a 13 13 0 0 1 26 0 Z" fill="${p.glow}" opacity="0.85"/>
    <line x1="0" y1="44" x2="0" y2="-56" stroke="${p.accent}" stroke-width="5"/>
    <polygon points="0,-56 34,8 0,8" fill="${p.accent}" opacity="0.9"/>
    <line x1="-26" y1="70" x2="26" y2="70" stroke="${p.glow}" stroke-width="3" opacity="0.6"/>`,

  frankenstein: (p) => `
    <circle cx="92" cy="-104" r="26" fill="${p.glow}" opacity="0.9"/>
    <circle cx="92" cy="-104" r="38" fill="${p.glow}" opacity="0.18"/>
    <polyline points="-150,96 -102,10 -64,58 -18,-30 22,44 66,-8 118,66 150,30" fill="none" stroke="${p.glow}" stroke-width="6" stroke-linejoin="round"/>
    <polyline points="-140,-52 -96,-38 -104,-14 -60,-24 -52,4 -8,-8 4,22 44,10" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="44" cy="10" r="7" fill="${p.accent}"/>
    <circle cx="-112" cy="-88" r="2" fill="${p.glow}" opacity="0.7"/>
    <circle cx="-30" cy="-116" r="2.5" fill="${p.glow}" opacity="0.6"/>`,

  "pride-prejudice": (p) => `
    <circle cx="-42" cy="-30" r="58" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.9"/>
    <circle cx="42" cy="-30" r="58" fill="none" stroke="${p.glow}" stroke-width="4" opacity="0.9"/>
    <path d="M -120,52 Q -60,16 0,52 T 120,44" fill="none" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
    <g transform="translate(0 92) rotate(-6)">
      <rect x="-52" y="-30" width="104" height="62" rx="4" fill="${p.glow}"/>
      <polyline points="-52,-30 0,8 52,-30" fill="none" stroke="${p.deep}" stroke-width="3" opacity="0.7"/>
      <circle cx="0" cy="12" r="9" fill="${p.accent}" opacity="0.9"/>
    </g>`,

  "jane-eyre": (p) => `
    <path d="M -150,108 Q -75,88 0,102 T 150,96" fill="none" stroke="${p.glow}" stroke-width="4" opacity="0.6"/>
    <rect x="-52" y="-112" width="104" height="176" rx="6" fill="${p.deep}" stroke="${p.glow}" stroke-width="5"/>
    <rect x="-40" y="-100" width="37" height="72" fill="${p.accent}" opacity="0.95"/>
    <rect x="3" y="-100" width="37" height="72" fill="${p.accent}" opacity="0.8"/>
    <rect x="-40" y="-22" width="37" height="74" fill="${p.accent}" opacity="0.65"/>
    <rect x="3" y="-22" width="37" height="74" fill="${p.accent}" opacity="0.9"/>
    <rect x="-52" y="-112" width="104" height="176" rx="6" fill="${p.accent}" opacity="0.12"/>
    <circle cx="0" cy="-20" r="72" fill="${p.accent}" opacity="0.12"/>
    <line x1="-52" y1="76" x2="52" y2="76" stroke="${p.glow}" stroke-width="5"/>`,

  meditations: (p) => `
    <rect x="-150" y="34" width="300" height="46" fill="${p.accent}" opacity="0.35"/>
    <rect x="-150" y="80" width="300" height="26" fill="${p.accent}" opacity="0.18"/>
    <g transform="rotate(-3)">
      <rect x="-58" y="-104" width="116" height="142" rx="12" fill="${p.glow}" opacity="0.28" stroke="${p.glow}" stroke-width="4"/>
      <line x1="-36" y1="-74" x2="36" y2="-74" stroke="${p.glow}" stroke-width="3" opacity="0.6"/>
      <line x1="-36" y1="-50" x2="36" y2="-50" stroke="${p.glow}" stroke-width="3" opacity="0.5"/>
      <line x1="-36" y1="-26" x2="16" y2="-26" stroke="${p.glow}" stroke-width="3" opacity="0.4"/>
    </g>
    <line x1="18" y1="92" x2="86" y2="-40" stroke="${p.deep}" stroke-width="8" stroke-linecap="round"/>
    <line x1="18" y1="92" x2="86" y2="-40" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/>
    <polygon points="86,-40 78,-18 96,-26" fill="${p.accent}"/>`,

  republic: (p) => `
    <circle cx="0" cy="-96" r="30" fill="${p.accent}"/>
    <circle cx="0" cy="-96" r="46" fill="${p.accent}" opacity="0.2"/>
    <polygon points="-14,-66 14,-66 44,10 -44,10" fill="${p.accent}" opacity="0.18"/>
    <g fill="${p.glow}">
      <rect x="-104" y="10" width="30" height="42"/>
      <rect x="-66" y="-8" width="30" height="60" opacity="0.85"/>
      <rect x="-28" y="4" width="30" height="48" opacity="0.7"/>
      <rect x="10" y="-16" width="30" height="68"/>
      <rect x="48" y="6" width="30" height="46" opacity="0.85"/>
      <rect x="86" y="-2" width="30" height="54" opacity="0.7"/>
    </g>
    <line x1="-116" y1="52" x2="116" y2="52" stroke="${p.accent}" stroke-width="3"/>
    <path d="M -70,128 L -70,96 A 70 70 0 0 1 70,96 L 70,128 Z" fill="${p.deep}" stroke="${p.glow}" stroke-width="4" opacity="0.95"/>
    <ellipse cx="0" cy="112" rx="34" ry="10" fill="${p.accent}" opacity="0.35"/>`,
}

// ── Composition ──────────────────────────────

function grain(rand, color) {
  const dots = []
  for (let i = 0; i < 90; i++) {
    const x = (rand() * WIDTH).toFixed(1)
    const y = (rand() * HEIGHT).toFixed(1)
    const r = (0.6 + rand() * 1.6).toFixed(2)
    const o = (0.03 + rand() * 0.06).toFixed(3)
    dots.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`)
  }
  return dots.join("")
}

function painting(book) {
  const p = book.palette
  const uid = book.slug
  const rand = mulberry32(seedFor(book.slug))
  const motif = MOTIFS[book.slug](p)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${book.altText.replace(/"/g, "&quot;")}">
  <title>${book.altText}</title>
  <defs>
    <linearGradient id="wall-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.deep}"/>
      <stop offset="1" stop-color="${p.ground}"/>
    </linearGradient>
    <linearGradient id="archSky-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.ground}"/>
      <stop offset="1" stop-color="${p.deep}"/>
    </linearGradient>
    <linearGradient id="field-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.deep}"/>
      <stop offset="1" stop-color="${p.ground}"/>
    </linearGradient>
    <linearGradient id="stoneShaft-${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${STONE}" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="${STONE}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${STONE}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wall-${uid})"/>
  ${architecture(uid, p.accent)}
  ${medallion(uid, p)}
  <g clip-path="url(#medClip-${uid})">
    <g transform="translate(${MED.cx} ${MED.cy})">
      ${motif}
    </g>
  </g>
  ${grain(rand, p.glow)}
</svg>
`
}

function contactSheet() {
  const cols = 4
  const thumbW = 180
  const thumbH = 270
  const pad = 16
  const rows = Math.ceil(BOOKS.length / cols)
  const w = cols * (thumbW + pad) + pad
  const h = rows * (thumbH + pad) + pad
  const cells = BOOKS.map((b, i) => {
    const x = pad + (i % cols) * (thumbW + pad)
    const y = pad + Math.floor(i / cols) * (thumbH + pad)
    return `<image href="${b.slug}.svg" x="${x}" y="${y}" width="${thumbW}" height="${thumbH}"/>`
  }).join("\n  ")
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#F6F1E6"/>
  ${cells}
</svg>
`
}

// ── Main ─────────────────────────────────────

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })

  const manifestEntries = []
  for (const book of BOOKS) {
    const svg = painting(book)
    const file = path.join(OUT_DIR, `${book.slug}.svg`)
    await fs.writeFile(file, svg, "utf8")
    manifestEntries.push({
      slug: book.slug,
      title: book.title,
      motif: book.motif,
      palette: book.palette,
      file: `/stoa/${book.slug}.svg`,
      altText: book.altText,
      provenance: "Original Tome art",
      provenanceNote:
        "Procedurally generated by scripts/stoa/gen-stoa-art.mjs (deterministic " +
        "seeded composition in a shared arch-and-medallion dialect; SVG only, " +
        "no baked-in title/author text). Not a public-domain historical source.",
    })
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    generator: {
      script: "scripts/stoa/gen-stoa-art.mjs",
      version: GENERATOR_VERSION,
      runtime: `node ${process.version}`,
    },
    outputDir: OUT_DIR,
    dimensions: { width: WIDTH, height: HEIGHT, aspect: "2:3" },
    count: BOOKS.length,
    contactSheet: "/stoa/contact-sheet.svg",
    entries: manifestEntries,
  }
  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8",
  )
  await fs.writeFile(path.join(OUT_DIR, "contact-sheet.svg"), contactSheet(), "utf8")

  // Validation: every SVG must parse (sharp decodes SVG via librsvg).
  let sharp = null
  try {
    sharp = (await import("sharp")).default
  } catch {
    console.warn("sharp unavailable — skipping raster parse validation")
  }
  if (sharp) {
    for (const book of BOOKS) {
      const file = path.join(OUT_DIR, `${book.slug}.svg`)
      const buf = await fs.readFile(file)
      const img = sharp(buf, { density: 96 })
      const meta = await img.metadata()
      await img.png().toBuffer() // full decode, not just header
      // librsvg rasterizes at the requested density (96dpi vs 72dpi user units).
      const scale = 96 / 72
      if (meta.width !== WIDTH * scale || meta.height !== HEIGHT * scale) {
        throw new Error(
          `${book.slug}.svg parsed at ${meta.width}x${meta.height}, expected ${WIDTH * scale}x${HEIGHT * scale}`,
        )
      }
    }
    console.log(`validated ${BOOKS.length} SVGs: all parse, all ${WIDTH}x${HEIGHT}`)
  }

  console.log(`wrote ${BOOKS.length} paintings + manifest.json + contact-sheet.svg to ${OUT_DIR}/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
