/**
 * Continent-based color assignment for the Explore map.
 * Each continent has a thematically relevant base hue.
 * Countries within a continent get distinct shades of that hue.
 *
 * Europe     → Indigo/Violet (classical scholarship, Western canon)
 * Asia       → Amber/Gold (silk road, imperial traditions)
 * Africa     → Emerald/Green (lush, vibrant heritage)
 * N. America → Teal/Blue (Atlantic, new world)
 * S. America → Rose/Warm Red (passion, magical realism)
 * Oceania    → Cyan/Sky (Pacific ocean)
 */

import { CONTINENT_COUNTRIES, getCountriesWithAuthors } from "@/data/author-countries"

interface ColorPair {
  light: string
  dark: string
}

// ── Continent shade palettes ────────────────────────────────────────────────
// Each continent has enough shades for its countries, ordered lightest→deepest.

const EUROPE_SHADES: ColorPair[] = [
  { light: "#818CF8", dark: "#A5B4FC" }, // indigo-400 / indigo-300
  { light: "#6366F1", dark: "#818CF8" }, // indigo-500 / indigo-400
  { light: "#4F46E5", dark: "#6366F1" }, // indigo-600 / indigo-500
  { light: "#4338CA", dark: "#818CF8" }, // indigo-700 / indigo-400
  { light: "#7C3AED", dark: "#A78BFA" }, // violet-600 / violet-400
  { light: "#6D28D9", dark: "#8B5CF6" }, // violet-700 / violet-500
  { light: "#5B21B6", dark: "#7C3AED" }, // violet-800 / violet-600
  { light: "#8B5CF6", dark: "#C4B5FD" }, // violet-500 / violet-300
  { light: "#3730A3", dark: "#6366F1" }, // indigo-800 / indigo-500
  { light: "#312E81", dark: "#818CF8" }, // indigo-900 / indigo-400
  { light: "#5346E0", dark: "#A5B4FC" }, // custom mid-indigo
  { light: "#7E22CE", dark: "#A855F7" }, // purple-700 / purple-500
  { light: "#6B21A8", dark: "#9333EA" }, // purple-800 / purple-600
  { light: "#581C87", dark: "#7C3AED" }, // purple-900 / violet-600
  { light: "#4C1D95", dark: "#8B5CF6" }, // violet-900 / violet-500
  { light: "#553C9A", dark: "#9F7AEA" }, // custom deep violet
  { light: "#6C2BD9", dark: "#B794F4" }, // custom vibrant violet
  { light: "#4A3AE0", dark: "#9B8DFA" }, // custom blue-violet
  { light: "#7043E0", dark: "#B5A3FA" }, // custom bright violet
  { light: "#5A3FD4", dark: "#A594FA" }, // custom warm indigo
]

const ASIA_SHADES: ColorPair[] = [
  { light: "#F59E0B", dark: "#FBBF24" }, // amber-500 / amber-400
  { light: "#D97706", dark: "#F59E0B" }, // amber-600 / amber-500
  { light: "#B45309", dark: "#D97706" }, // amber-700 / amber-600
  { light: "#92400E", dark: "#F59E0B" }, // amber-800 / amber-500
  { light: "#CA8A04", dark: "#EAB308" }, // yellow-600 / yellow-500
  { light: "#A16207", dark: "#CA8A04" }, // yellow-700 / yellow-600
  { light: "#EA580C", dark: "#FB923C" }, // orange-600 / orange-400 (for variety)
]

const AFRICA_SHADES: ColorPair[] = [
  { light: "#10B981", dark: "#34D399" }, // emerald-500 / emerald-400
  { light: "#059669", dark: "#10B981" }, // emerald-600 / emerald-500
  { light: "#047857", dark: "#059669" }, // emerald-700 / emerald-600
  { light: "#065F46", dark: "#10B981" }, // emerald-800 / emerald-500
  { light: "#16A34A", dark: "#4ADE80" }, // green-600 / green-400
  { light: "#15803D", dark: "#22C55E" }, // green-700 / green-500
  { light: "#166534", dark: "#16A34A" }, // green-800 / green-600
]

const NORTH_AMERICA_SHADES: ColorPair[] = [
  { light: "#0D9488", dark: "#2DD4BF" }, // teal-600 / teal-400
  { light: "#0F766E", dark: "#14B8A6" }, // teal-700 / teal-500
  { light: "#115E59", dark: "#0D9488" }, // teal-800 / teal-600
]

const SOUTH_AMERICA_SHADES: ColorPair[] = [
  { light: "#E11D48", dark: "#FB7185" }, // rose-600 / rose-400
  { light: "#BE123C", dark: "#F43F5E" }, // rose-700 / rose-500
  { light: "#9F1239", dark: "#E11D48" }, // rose-800 / rose-600
  { light: "#DB2777", dark: "#F472B6" }, // pink-600 / pink-400
  { light: "#C026D3", dark: "#E879F9" }, // fuchsia-600 / fuchsia-400
]

const OCEANIA_SHADES: ColorPair[] = [
  { light: "#0891B2", dark: "#22D3EE" }, // cyan-600 / cyan-400
  { light: "#0E7490", dark: "#06B6D4" }, // cyan-700 / cyan-500
]

// ── Map continents to their shade palettes ──────────────────────────────────

const CONTINENT_PALETTES: Record<string, ColorPair[]> = {
  Europe: EUROPE_SHADES,
  Asia: ASIA_SHADES,
  Africa: AFRICA_SHADES,
  "North America": NORTH_AMERICA_SHADES,
  "South America": SOUTH_AMERICA_SHADES,
  Oceania: OCEANIA_SHADES,
}

// ── Deterministic assignment: each country gets a shade from its continent ──

function buildCountryColors(): Record<string, ColorPair> {
  const activeCountries = new Set(getCountriesWithAuthors())
  const result: Record<string, ColorPair> = {}

  for (const [continent, countries] of Object.entries(CONTINENT_COUNTRIES)) {
    const palette = CONTINENT_PALETTES[continent]
    if (!palette) continue

    // Only assign to countries that have authors
    const active = countries.filter((c) => activeCountries.has(c))

    active.forEach((iso3, i) => {
      // Cycle through shades if more countries than shades
      result[iso3] = palette[i % palette.length]
    })
  }

  return result
}

export const COUNTRY_COLORS: Record<string, ColorPair> = buildCountryColors()

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

/** Get the continent base color (first shade) for theming purposes */
export function getContinentColor(continent: string, mode: "light" | "dark"): string {
  const palette = CONTINENT_PALETTES[continent]
  if (!palette?.[0]) return mode === "dark" ? "#818CF8" : "#6366F1"
  return mode === "dark" ? palette[0].dark : palette[0].light
}
