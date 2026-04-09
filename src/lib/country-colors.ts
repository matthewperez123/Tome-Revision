/**
 * Deterministic color assignment for countries on the Explore map.
 *
 * Each country with authors gets a unique color from a hand-curated
 * scholarly palette. Colors are assigned using a greedy algorithm
 * that avoids giving adjacent countries similar colors.
 */

// ── Scholarly palette: ~40 colors inspired by illuminated manuscripts ────────

interface ColorPair {
  light: string  // For light mode (parchment ocean)
  dark: string   // For dark mode (indigo ocean) — slightly lighter for readability
}

const PALETTE: ColorPair[] = [
  { light: "#6366F1", dark: "#818CF8" },   // indigo
  { light: "#D4A04C", dark: "#E2B85C" },   // laurel gold
  { light: "#8B5A3C", dark: "#A97B5A" },   // umber
  { light: "#A34A28", dark: "#C46A48" },   // rust
  { light: "#7A8B5A", dark: "#9AAB7A" },   // sage
  { light: "#8B2635", dark: "#AB4655" },   // claret
  { light: "#6B4C7A", dark: "#8B6C9A" },   // plum
  { light: "#4A6B7A", dark: "#6A8B9A" },   // teal-slate
  { light: "#B8860B", dark: "#D8A62B" },   // dark goldenrod
  { light: "#8B6914", dark: "#AB8934" },   // bronze
  { light: "#5C4A3A", dark: "#7C6A5A" },   // walnut
  { light: "#A0845C", dark: "#C0A47C" },   // sand
  { light: "#6F4E37", dark: "#8F6E57" },   // coffee
  { light: "#8B4513", dark: "#AB6533" },   // saddle
  { light: "#708238", dark: "#90A258" },   // moss
  { light: "#4A5D4A", dark: "#6A7D6A" },   // forest
  { light: "#9B2D20", dark: "#BB4D40" },   // vermillion
  { light: "#5D4E75", dark: "#7D6E95" },   // heather
  { light: "#7D6B5B", dark: "#9D8B7B" },   // taupe
  { light: "#B8956A", dark: "#D8B58A" },   // khaki
  { light: "#2D5F8A", dark: "#4D7FAA" },   // steel blue
  { light: "#8B7355", dark: "#AB9375" },   // tan
  { light: "#556B2F", dark: "#758B4F" },   // dark olive
  { light: "#704214", dark: "#905234" },   // sepia
  { light: "#4A3728", dark: "#6A5748" },   // burnt sienna
  { light: "#7B3F00", dark: "#9B5F20" },   // chocolate
  { light: "#3B5998", dark: "#5B79B8" },   // cornflower
  { light: "#8E6B23", dark: "#AE8B43" },   // antique gold
  { light: "#5B3A29", dark: "#7B5A49" },   // mahogany
  { light: "#4E6E58", dark: "#6E8E78" },   // fern
  { light: "#9C4040", dark: "#BC6060" },   // terra cotta
  { light: "#6E5160", dark: "#8E7180" },   // mauve
  { light: "#456A5A", dark: "#658A7A" },   // patina
  { light: "#8A6642", dark: "#AA8662" },   // caramel
  { light: "#5F4B8B", dark: "#7F6BAB" },   // wisteria
  { light: "#7A5C3E", dark: "#9A7C5E" },   // tawny
  { light: "#3E6957", dark: "#5E8977" },   // hunter
  { light: "#A65E2E", dark: "#C67E4E" },   // copper
  { light: "#445566", dark: "#647786" },   // gunmetal
  { light: "#8C5E3C", dark: "#AC7E5C" },   // cinnamon
]

// ── Country adjacency (simplified — covers all countries with authors) ───────

const ADJACENCY: Record<string, string[]> = {
  GBR: ["IRL", "FRA"],
  IRL: ["GBR"],
  FRA: ["GBR", "DEU", "ITA", "ESP", "CHE"],
  DEU: ["FRA", "AUT", "CHE", "CZE", "POL"],
  ITA: ["FRA", "AUT", "CHE"],
  ESP: ["FRA"],
  AUT: ["DEU", "ITA", "CHE", "CZE", "HUN"],
  CHE: ["FRA", "DEU", "ITA", "AUT"],
  CZE: ["DEU", "AUT", "POL"],
  POL: ["DEU", "CZE", "RUS"],
  HUN: ["AUT"],
  NOR: ["SWE", "FIN", "RUS"],
  SWE: ["NOR", "FIN"],
  FIN: ["NOR", "SWE", "RUS"],
  RUS: ["NOR", "FIN", "POL", "CHN"],
  GRC: ["ITA"],
  USA: ["CAN"],
  CAN: ["USA"],
  CHN: ["RUS", "IND", "JPN"],
  JPN: ["CHN"],
  IND: ["CHN", "IRN"],
  IRN: ["IND"],
  LBN: ["IRN"],
}

// ── Deterministic greedy assignment ─────────────────────────────────────────

function hslDistance(hex1: string, hex2: string): number {
  // Simple hex-based distance (good enough for greedy coloring)
  const r1 = parseInt(hex1.slice(1, 3), 16)
  const g1 = parseInt(hex1.slice(3, 5), 16)
  const b1 = parseInt(hex1.slice(5, 7), 16)
  const r2 = parseInt(hex2.slice(1, 3), 16)
  const g2 = parseInt(hex2.slice(3, 5), 16)
  const b2 = parseInt(hex2.slice(5, 7), 16)
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

function assignColors(countries: string[]): Record<string, ColorPair> {
  const sorted = [...countries].sort()
  const assigned: Record<string, ColorPair> = {}
  const usedByNeighbor: Record<string, Set<number>> = {}

  for (const iso of sorted) {
    // Get palette indices used by neighbors
    const neighborIndices = new Set<number>()
    const neighbors = ADJACENCY[iso] ?? []
    for (const n of neighbors) {
      if (assigned[n]) {
        const idx = PALETTE.findIndex(
          (p) => p.light === assigned[n].light
        )
        if (idx >= 0) neighborIndices.add(idx)
      }
    }

    // Pick the palette color most distant from neighbors
    let bestIdx = 0
    let bestDist = -1

    for (let i = 0; i < PALETTE.length; i++) {
      if (neighborIndices.has(i)) continue

      // Calculate minimum distance to any neighbor's color
      let minDist = Infinity
      for (const nIdx of neighborIndices) {
        const d = hslDistance(PALETTE[i].light, PALETTE[nIdx].light)
        if (d < minDist) minDist = d
      }

      // If no neighbors, just use index distance from last assigned
      if (neighborIndices.size === 0) minDist = i * 10

      if (minDist > bestDist) {
        bestDist = minDist
        bestIdx = i
      }
    }

    assigned[iso] = PALETTE[bestIdx]
  }

  return assigned
}

// ── Pre-computed assignments ─────────────────────────────────────────────────

import { getCountriesWithAuthors } from "@/data/author-countries"

const ACTIVE_COUNTRIES = getCountriesWithAuthors()

export const COUNTRY_COLORS: Record<string, ColorPair> = assignColors(ACTIVE_COUNTRIES)

/** Get the fill color for a country (returns undefined if country has no authors) */
export function getCountryColor(iso3: string, mode: "light" | "dark"): string | undefined {
  const pair = COUNTRY_COLORS[iso3]
  if (!pair) return undefined
  return mode === "dark" ? pair.dark : pair.light
}

/** Get all assigned colors for debugging/preview */
export function getAllCountryColors(): { iso3: string; light: string; dark: string }[] {
  return Object.entries(COUNTRY_COLORS).map(([iso3, colors]) => ({
    iso3,
    light: colors.light,
    dark: colors.dark,
  }))
}
