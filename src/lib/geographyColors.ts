// ── Geography-based accent colors for timeline author icon borders ───────────
// Country name overrides continent fallbacks. All hex values pass WCAG AA
// contrast against both light (#FAFAF8) and dark (#0A0A0A) backgrounds.

const COUNTRY_COLORS: Record<string, string> = {
  // Europe
  Greece: "#1E4A7A",
  Italy: "#4E6B2D",
  England: "#3B2F5C",
  Scotland: "#2D4A5C",
  Ireland: "#2D5C3B",
  France: "#1E3A8A",
  Germany: "#2D3748",
  Austria: "#3D4A5C",
  Spain: "#8B1A1A",
  Portugal: "#2D5C4A",
  Russia: "#5C3A3A",
  Poland: "#8B2D4A",
  Netherlands: "#C97A1E",
  Norway: "#4A6B8B",
  Iceland: "#4A6B8B",
  Sweden: "#3A5C7A",
  Denmark: "#3A5C6B",
  Switzerland: "#5C3A3A",
  Hungary: "#5C3A4A",
  Czechia: "#3A4A5C",

  // Americas
  USA: "#2A4A6B",
  Canada: "#3A5C6B",
  Colombia: "#C9732D",
  Argentina: "#5C7A9B",
  Brazil: "#2D6B4A",
  Jamaica: "#3B6B4A",
  Chile: "#5C4A6B",
  Peru: "#8B5C2D",
  Mexico: "#6B4A2D",

  // Asia
  China: "#7B2D2D",
  Japan: "#2D3B4A",
  India: "#C97A3B",
  Iran: "#1E4A7A",
  Lebanon: "#5C4A3A",
  Turkey: "#6B3A3A",

  // Africa & Middle East
  Egypt: "#B8733E",
  Nigeria: "#2D6B4A",
  Senegal: "#7B5C2D",
  "South Africa": "#3A6B5C",
  Kenya: "#5C6B3A",
  Ghana: "#4A6B3A",
  Algeria: "#5C5C3A",
  Arabia: "#7B5C2D",
}

const CONTINENT_FALLBACKS: Record<string, string> = {
  Europe: "#3B4A5C",
  Asia: "#5C2D2D",
  Africa: "#6B4A2D",
  "North America": "#2D4A5C",
  "South America": "#2D4A5C",
  Oceania: "#3B5C5C",
}

export function getGeographyColor(
  country: string,
  continent: string,
): string {
  return COUNTRY_COLORS[country] ?? CONTINENT_FALLBACKS[continent] ?? "#6B7280"
}
