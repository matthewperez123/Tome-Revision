/**
 * Bright, vivid color assignment for countries on the Explore map.
 * Every country with authors gets a unique, distinct color.
 */

interface ColorPair {
  light: string
  dark: string
}

// 23 vivid, maximally distinct colors — one per active country, no sharing
const VIVID_PALETTE: ColorPair[] = [
  { light: "#6366F1", dark: "#818CF8" },   // indigo
  { light: "#EC4899", dark: "#F472B6" },   // pink
  { light: "#EF4444", dark: "#F87171" },   // red
  { light: "#F59E0B", dark: "#FBBF24" },   // amber
  { light: "#10B981", dark: "#34D399" },   // emerald
  { light: "#3B82F6", dark: "#60A5FA" },   // blue
  { light: "#8B5CF6", dark: "#A78BFA" },   // violet
  { light: "#14B8A6", dark: "#2DD4BF" },   // teal
  { light: "#F97316", dark: "#FB923C" },   // orange
  { light: "#06B6D4", dark: "#22D3EE" },   // cyan
  { light: "#84CC16", dark: "#A3E635" },   // lime
  { light: "#E11D48", dark: "#FB7185" },   // rose
  { light: "#7C3AED", dark: "#A78BFA" },   // purple
  { light: "#D97706", dark: "#F59E0B" },   // golden
  { light: "#059669", dark: "#34D399" },   // green
  { light: "#2563EB", dark: "#93C5FD" },   // royal blue
  { light: "#DC2626", dark: "#FCA5A5" },   // crimson
  { light: "#9333EA", dark: "#C084FC" },   // grape
  { light: "#0891B2", dark: "#67E8F9" },   // sky
  { light: "#65A30D", dark: "#BEF264" },   // chartreuse
  { light: "#BE185D", dark: "#F9A8D4" },   // magenta
  { light: "#1D4ED8", dark: "#BFDBFE" },   // sapphire
  { light: "#B45309", dark: "#FCD34D" },   // honey
]

// Country adjacency for greedy assignment
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
  IRN: ["IND", "LBN"],
  LBN: ["IRN"],
}

function hslDistance(hex1: string, hex2: string): number {
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
  const usedIndices = new Set<number>()

  for (const iso of sorted) {
    const neighborIndices = new Set<number>()
    for (const n of ADJACENCY[iso] ?? []) {
      if (assigned[n]) {
        const idx = VIVID_PALETTE.findIndex(p => p.light === assigned[n].light)
        if (idx >= 0) neighborIndices.add(idx)
      }
    }

    let bestIdx = 0
    let bestDist = -1

    for (let i = 0; i < VIVID_PALETTE.length; i++) {
      if (neighborIndices.has(i)) continue
      if (usedIndices.has(i)) continue // never reuse a color

      let minDist = Infinity
      for (const nIdx of neighborIndices) {
        const d = hslDistance(VIVID_PALETTE[i].light, VIVID_PALETTE[nIdx].light)
        if (d < minDist) minDist = d
      }
      if (neighborIndices.size === 0) minDist = i * 10

      if (minDist > bestDist) {
        bestDist = minDist
        bestIdx = i
      }
    }

    assigned[iso] = VIVID_PALETTE[bestIdx]
    usedIndices.add(bestIdx)
  }

  return assigned
}

import { getCountriesWithAuthors } from "@/data/author-countries"

export const COUNTRY_COLORS: Record<string, ColorPair> = assignColors(getCountriesWithAuthors())

export function getCountryColor(iso3: string, mode: "light" | "dark"): string | undefined {
  const pair = COUNTRY_COLORS[iso3]
  if (!pair) return undefined
  return mode === "dark" ? pair.dark : pair.light
}

export function getAllCountryColors(): { iso3: string; light: string; dark: string }[] {
  return Object.entries(COUNTRY_COLORS).map(([iso3, colors]) => ({
    iso3,
    light: colors.light,
    dark: colors.dark,
  }))
}
