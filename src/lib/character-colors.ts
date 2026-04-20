/**
 * Character Color System — assigns muted, scholarly colors to drama characters.
 *
 * Goals:
 * - Each character gets a distinct, consistent color across the entire play
 * - Colors readable in both light and dark mode
 * - Muted, illuminated-manuscript aesthetic — not bright or gamified
 * - Deterministic: same input always produces same output
 */

// ── Curated Palette ────────────────────────────────────────────────

interface ColorPair {
  light: string
  dark: string
  name: string
}

/** Primary palette — top 6 characters by speech count */
const PRIMARY: ColorPair[] = [
  { name: "deep-rose",   light: "#8C3A4F", dark: "#C97189" },
  { name: "sage-green",  light: "#5A7A5C", dark: "#94B596" },
  { name: "ochre",       light: "#A8782C", dark: "#D4A04A" },
  { name: "slate-blue",  light: "#3D5266", dark: "#7A93AB" },
  { name: "aubergine",   light: "#5C3A5C", dark: "#9C7A9C" },
  { name: "umber",       light: "#6B4A2E", dark: "#A88560" },
]

/** Secondary palette — characters 7-12 */
const SECONDARY: ColorPair[] = [
  { name: "muted-teal",  light: "#3D6E6E", dark: "#82A8A8" },
  { name: "dusty-mauve", light: "#8C6B7E", dark: "#B89AAA" },
  { name: "moss",        light: "#4A5A3D", dark: "#8AA17C" },
  { name: "brick",       light: "#8C4A3D", dark: "#B87A6E" },
  { name: "indigo",      light: "#4A4A6E", dark: "#8888AC" },
  { name: "bronze",      light: "#8C6B3D", dark: "#B8966C" },
]

/** Tertiary palette — characters 13-18 */
const TERTIARY: ColorPair[] = [
  { name: "plum",        light: "#6E3A5A", dark: "#A87A94" },
  { name: "olive",       light: "#5A6040", dark: "#949A78" },
  { name: "steel",       light: "#4A5A6E", dark: "#8898AC" },
  { name: "sienna",      light: "#8C5A3D", dark: "#B88A6E" },
  { name: "wine",        light: "#6E3A3D", dark: "#A87A7E" },
  { name: "fern",        light: "#3D6E4A", dark: "#7AA88A" },
]

/** Special roles — group speakers, chorus, supernatural */
const SPECIAL_GROUP: ColorPair = { name: "muted-gold", light: "#A8882C", dark: "#D4B056" }
const SPECIAL_GHOST: ColorPair = { name: "ghost-slate", light: "#6E7A8C", dark: "#9AA8B8" }

const ALL_COLORS = [...PRIMARY, ...SECONDARY, ...TERTIARY]

// ── Group speaker names (case-insensitive) ─────────────────────────

const GROUP_SPEAKERS = new Set([
  "all", "both", "chorus", "all the lords", "all three",
  "together", "several", "senators", "citizens", "soldiers",
  "lords", "servants", "musicians", "players",
])

const GHOST_SPEAKERS = new Set([
  "ghost", "ghost of hamlet's father", "banquo's ghost",
  "first witch", "second witch", "third witch",
  "first apparition", "second apparition", "third apparition",
])

// ── Assignment ─────────────────────────────────────────────────────

export interface CharacterColorAssignment {
  name: string
  color: ColorPair
  speechCount: number
  rank: number
}

export interface BookColorAssignments {
  bookId: string
  assignments: CharacterColorAssignment[]
  /** Map of normalized name → color pair for fast lookup */
  colorMap: Record<string, ColorPair>
}

/**
 * Assign colors to characters based on speech count ranking.
 * Protagonist (if specified) always gets slot 0 (deep-rose).
 */
export function assignCharacterColors(
  bookId: string,
  characterNames: string[],
  speechCounts?: Record<string, number>,
  protagonist?: string,
): BookColorAssignments {
  // Sort by speech count (descending), then alphabetically
  const ranked = characterNames
    .map(name => ({
      name,
      count: speechCounts?.[name] ?? 0,
      normalized: name.toLowerCase().trim(),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  const assignments: CharacterColorAssignment[] = []
  const colorMap: Record<string, ColorPair> = {}
  let colorIndex = 0

  // If protagonist specified, assign first slot
  const protNorm = protagonist?.toLowerCase().trim()

  for (const { name, count, normalized } of ranked) {
    let color: ColorPair

    if (GROUP_SPEAKERS.has(normalized)) {
      color = SPECIAL_GROUP
    } else if (GHOST_SPEAKERS.has(normalized)) {
      color = SPECIAL_GHOST
    } else if (protNorm && normalized === protNorm && colorIndex > 0) {
      // Protagonist always gets deep-rose (slot 0)
      color = ALL_COLORS[0]
    } else {
      // Skip slot 0 if it was reserved for protagonist and this isn't them
      if (protNorm && colorIndex === 0 && normalized !== protNorm) {
        colorIndex = 1
      }
      color = ALL_COLORS[colorIndex % ALL_COLORS.length]
      colorIndex++
    }

    assignments.push({ name, color, speechCount: count, rank: assignments.length })
    colorMap[normalized] = color
  }

  return { bookId, assignments, colorMap }
}

/**
 * Look up a character's color by name (case-insensitive).
 * Returns the hex color string for the given theme.
 */
export function getCharacterColor(
  assignments: BookColorAssignments,
  characterName: string,
  isDark: boolean,
): string | null {
  const normalized = characterName.toLowerCase().trim()
  const pair = assignments.colorMap[normalized]
  if (!pair) return null
  return isDark ? pair.dark : pair.light
}

/**
 * Get the full palette for reference/display.
 */
export function getFullPalette(): ColorPair[] {
  return ALL_COLORS
}
