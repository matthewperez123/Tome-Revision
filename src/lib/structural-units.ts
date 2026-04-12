// Structural unit display helpers — used everywhere the app references chapters/cantos/poems/etc.

import type { StructuralUnitType } from "@/data/books"

const LABELS: Record<StructuralUnitType, [string, string]> = {
  chapter:     ["Chapter", "Chapters"],
  canto:       ["Canto", "Cantos"],
  poem:        ["Poem", "Poems"],
  short_story: ["Story", "Stories"],
  book:        ["Book", "Books"],
  essay:       ["Essay", "Essays"],
  letter:      ["Letter", "Letters"],
}

/** Returns the human-readable label for a structural unit type. */
export function getUnitLabel(type: StructuralUnitType, plural = false): string {
  return LABELS[type]?.[plural ? 1 : 0] ?? LABELS.chapter[plural ? 1 : 0]
}

/** Convert a number to Roman numerals (1 → "I", 4 → "IV", etc.) */
function toRoman(n: number): string {
  if (n <= 0 || n > 3999) return String(n)
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
  let result = ""
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i]
      n -= vals[i]
    }
  }
  return result
}

/**
 * Returns the display string for a unit number.
 * - chapter  → "Chapter 3"
 * - canto    → "Canto III" (Roman numerals)
 * - book     → "Book IV" (Roman numerals)
 * - poem     → title if available, else "Poem 5"
 * - short_story → title if available, else "Story 3"
 * - essay    → title if available, else "Essay 12"
 * - letter   → title if available, else "Letter 47"
 *
 * @param type    The structural unit type
 * @param number  1-based unit number (displayed number, not 0-based index)
 * @param title   Optional title for the unit (preferred for poem/story/essay/letter)
 */
export function getUnitNumber(type: StructuralUnitType, number: number, title?: string): string {
  switch (type) {
    case "canto":
      return `Canto ${toRoman(number)}`
    case "book":
      return `Book ${toRoman(number)}`
    case "poem":
      return title || `Poem ${number}`
    case "short_story":
      return title || `Story ${number}`
    case "essay":
      return title || `Essay ${number}`
    case "letter":
      return title || `Letter ${number}`
    case "chapter":
    default:
      return `Chapter ${number}`
  }
}

/**
 * Returns a compact progress string like "3 of 24 chapters" or "VIII of XXXIV cantos".
 */
export function getProgressLabel(type: StructuralUnitType, done: number, total: number): string {
  const label = getUnitLabel(type, true).toLowerCase()
  if (type === "canto" || type === "book") {
    return `${toRoman(done)} of ${toRoman(total)} ${label}`
  }
  return `${done} of ${total} ${label}`
}

/**
 * Returns a short progress string for compact displays like book cards.
 * e.g. "Ch 3/24", "Canto III/XXXIV", "Story 3/15"
 */
export function getShortProgress(type: StructuralUnitType, done: number, total: number): string {
  switch (type) {
    case "canto":
      return `Canto ${toRoman(done)}/${toRoman(total)}`
    case "book":
      return `Bk ${toRoman(done)}/${toRoman(total)}`
    case "poem":
      return `Poem ${done}/${total}`
    case "short_story":
      return `Story ${done}/${total}`
    case "essay":
      return `Essay ${done}/${total}`
    case "letter":
      return `Letter ${done}/${total}`
    case "chapter":
    default:
      return `Ch ${done}/${total}`
  }
}
