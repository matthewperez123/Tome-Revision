import { LUMINOUS_COMPOSITION_FAMILY_IDS, type CompositionFamilyId } from "../compositions/library"
import { type CoverPaletteId, LUMINOUS_LIGHT_PALETTE_IDS } from "../styles/palettes"

export interface DiversityAssignment {
  bookId: string
  compositionFamily: CompositionFamilyId
  paletteMode: CoverPaletteId
  locked?: boolean
}

export interface DiversityLimits {
  maxSingleFamilyPct: number
  minFamiliesPerHundred: number
  minFamiliesPerTwenty: number
  maxRoadPct: number
  maxCastlePct: number
  maxGiantCelestialPct: number
  maxSeaPct: number
  maxEmblemPct: number
  maxFramedPct: number
}

export const DEFAULT_DIVERSITY_LIMITS: DiversityLimits = {
  maxSingleFamilyPct: 12,
  minFamiliesPerHundred: 10,
  minFamiliesPerTwenty: 8,
  maxRoadPct: 30,
  maxCastlePct: 22,
  maxGiantCelestialPct: 22,
  maxSeaPct: 22,
  maxEmblemPct: 20,
  maxFramedPct: 15,
}

export interface DiversityStats {
  total: number
  familyCounts: Record<string, number>
  paletteCounts: Record<string, number>
  warnings: string[]
}

export function rebalanceAssignments(
  assignments: DiversityAssignment[],
  options: { seed?: string; limits?: DiversityLimits } = {},
): DiversityAssignment[] {
  const limits = options.limits ?? DEFAULT_DIVERSITY_LIMITS
  const seed = options.seed ?? "tome"
  const familyCounts = new Map<string, number>()
  const paletteCounts = new Map<string, number>()

  for (const assignment of assignments) {
    if (!assignment.locked) continue
    familyCounts.set(assignment.compositionFamily, (familyCounts.get(assignment.compositionFamily) ?? 0) + 1)
    paletteCounts.set(assignment.paletteMode, (paletteCounts.get(assignment.paletteMode) ?? 0) + 1)
  }

  return assignments.map((assignment, index) => {
    if (assignment.locked) return assignment
    const previous = index > 0 ? assignments[index - 1] : undefined
    const family = chooseLeastUsed(
      [...LUMINOUS_COMPOSITION_FAMILY_IDS],
      familyCounts,
      `${seed}:${assignment.bookId}:family`,
      previous?.compositionFamily,
    )
    familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1)
    const palette = chooseLeastUsed(
      [...LUMINOUS_LIGHT_PALETTE_IDS],
      paletteCounts,
      `${seed}:${assignment.bookId}:palette`,
      previous?.paletteMode,
    )
    paletteCounts.set(palette, (paletteCounts.get(palette) ?? 0) + 1)
    return { ...assignment, compositionFamily: family, paletteMode: palette }
  }).map((assignment) => {
    const stats = diversityStats(assignments, limits)
    void stats
    return assignment
  })
}

export function diversityStats(assignments: DiversityAssignment[], limits: DiversityLimits = DEFAULT_DIVERSITY_LIMITS): DiversityStats {
  const total = assignments.length
  const familyCounts = countBy(assignments.map((item) => item.compositionFamily))
  const paletteCounts = countBy(assignments.map((item) => item.paletteMode))
  const warnings: string[] = []

  if (total >= 20) {
    for (const [family, count] of Object.entries(familyCounts)) {
      const pct = total === 0 ? 0 : (count / total) * 100
      if (pct > limits.maxSingleFamilyPct) {
        warnings.push(`${family} is ${pct.toFixed(1)}% of the batch; limit is ${limits.maxSingleFamilyPct}%.`)
      }
    }
  }

  if (total >= 20) {
    for (let index = 0; index <= total - 20; index += 1) {
      const unique = new Set(assignments.slice(index, index + 20).map((item) => item.compositionFamily)).size
      if (unique < limits.minFamiliesPerTwenty) {
        warnings.push(`Window ${index + 1}-${index + 20} uses only ${unique} composition families.`)
      }
    }
  }

  if (total >= 100 && Object.keys(familyCounts).length < limits.minFamiliesPerHundred) {
    warnings.push(`Batch uses ${Object.keys(familyCounts).length} families; at least ${limits.minFamiliesPerHundred} are required per 100 covers.`)
  }

  return { total, familyCounts, paletteCounts, warnings }
}

function chooseLeastUsed<T extends string>(values: readonly T[], counts: Map<string, number>, seed: string, avoid?: string): T {
  const ranked = values
    .map((value) => ({ value, count: counts.get(value) ?? 0, rank: hashRank(`${seed}:${value}`) }))
    .sort((a, b) => a.count - b.count || a.rank - b.rank)
  return (ranked.find((item) => item.value !== avoid) ?? ranked[0]).value
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

function hashRank(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}
