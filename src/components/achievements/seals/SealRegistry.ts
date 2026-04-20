// ─────────────────────────────────────────────
// Seal Motif Registry — Layered Visual System
// ─────────────────────────────────────────────
// Maps sealDesignKey strings to inline SVG path data,
// provides wax edge shape variants, category border ring
// generators, and rarity color palettes.

import type { AchievementRarity, AchievementCategory } from '@/types/achievement'

// ── 30 Seal Motifs (24x24 viewBox paths) ─────

/** 30 seal motifs — each value is an SVG <path d="..."> attribute. */
export const SEAL_MOTIFS: Record<string, string> = {
  quill:
    'M20.24 3.76a2.5 2.5 0 0 0-3.54 0L4 16.46V20h3.54L20.24 7.3a2.5 2.5 0 0 0 0-3.54ZM3 22h18v-2H3v2Z',
  torch:
    'M12 2c-1.5 2-3 3.5-3 5.5C9 9.43 10.34 11 12 11s3-1.57 3-3.5C15 5.5 13.5 4 12 2Zm0 11c-1.1 0-2 .9-2 2v7h4v-7c0-1.1-.9-2-2-2Z',
  lyre:
    'M12 2C9.24 2 7 4.24 7 7v2H5v2h2v4c0 2.76 2.24 5 5 5s5-2.24 5-5v-4h2V9h-2V7c0-2.76-2.24-5-5-5Zm-3 5a3 3 0 0 1 6 0v2H9V7Zm3 11a3 3 0 0 1-3-3v-4h6v4a3 3 0 0 1-3 3Z',
  skull:
    'M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7Zm-2 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM10 20h4v2h-4v-2Z',
  crown:
    'M3 18h18v2H3v-2Zm0-2 3-6 3 4 3-8 3 8 3-4 3 6H3Z',
  compass:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Zm-1.31-4.69L14.5 14.5l.81-3.81L11.5 11.5l-.81 3.81Z',
  ship:
    'M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v-2h2c1.38 0 2.74-.55 4-1.5 2.52 1.9 5.48 1.9 8 0 1.26.95 2.62 1.5 4 1.5h2v2h-2ZM3.95 19h.1l.78-6H5V9h4V5h2v4h4v4h.17l.78 6h.1',
  tree:
    'M12 2L8 8h2v4H7l-2 4h3v4H6v2h12v-2h-4v-4h3l-2-4h-3V8h2L12 2Z',
  scales:
    'M12 3v18M4 7l8-4 8 4M4 7c0 3 2 5 4 5s4-2 4-5M12 7c0 3 2 5 4 5s4-2 4-5',
  eye:
    'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  sword:
    'M14.12 4 4 14.12l1.41 1.41 2.13-2.12 4.24 4.24 2.12-2.13-4.24-4.24 6.36-6.36L14.12 4ZM5.41 20l-1.41-1.41 3-3 1.41 1.41-3 3Z',
  book:
    'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1Zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5Z',
  hourglass:
    'M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6Zm10 14.5V20H8v-3.5l4-4 4 4Zm-4-5-4-4V4h8v3.5l-4 4Z',
  mask:
    'M12 2C6.48 2 2 6.48 2 12c0 3.69 2 6.91 5 8.65V20c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v.65c3-1.74 5-4.96 5-8.65 0-5.52-4.48-10-10-10Zm-3 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z',
  column:
    'M6 3h12v2H6V3Zm1 4h10v10H7V7Zm-1 12h12v2H6v-2Zm3-10v6h2V9H9Zm4 0v6h2V9h-2Z',
  rose:
    'M12 2c-1 2-3 3-3 5 0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2 0-2-2-3-3-5Zm-5 8c-1.1 0-2 .9-2 2s.9 2 2 2c.74 0 1.38-.4 1.73-1H12v3.27c-.6.35-1 .99-1 1.73 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.73V13h3.27c.35.6.99 1 1.73 1 1.1 0 2-.9 2-2s-.9-2-2-2c-.74 0-1.38.4-1.73 1H14V7.73c.6-.35 1-.99 1-1.73h-2c0 .74-.4 1.38-1 1.73V11H8.73A1.99 1.99 0 0 0 7 10Z',
  raven:
    'M18 4c-2 0-3.5 1-4.5 2.5L12 4 10.5 6.5C9.5 5 8 4 6 4 3 4 2 6.5 2 9s1.5 4 3 5l3 2v4h8v-4l3-2c1.5-1 3-2.5 3-5s-1-5-4-5Zm-8 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  cross:
    'M11 2v7H4v4h7v9h2v-9h7V9h-7V2h-2Z',
  star:
    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z',
  flame:
    'M12 2C9 6 6 8.5 6 12.5c0 3.31 2.69 6 6 6s6-2.69 6-6C18 8.5 15 6 12 2Zm0 14.5c-1.66 0-3-1.34-3-3 0-2 1.5-3.5 3-5.5 1.5 2 3 3.5 3 5.5 0 1.66-1.34 3-3 3Z',
  wave:
    'M2 12c2-2.67 4-4 6-4s4 2.67 6 4 4 4 6 4 4-1.33 6-4M2 17c2-2.67 4-4 6-4s4 2.67 6 4 4 4 6 4 4-1.33 6-4M2 7c2-2.67 4-4 6-4s4 2.67 6 4 4 4 6 4 4-1.33 6-4',
  mountain:
    'M14 6l-3.75 5L12 13.5l2.25-3L21 22H3l8.25-12.5L14 6Z',
  key:
    'M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65ZM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z',
  chain:
    'M4 12c0-1.1.9-2 2-2h4v-2H6C3.79 8 2 9.79 2 12s1.79 4 4 4h4v-2H6c-1.1 0-2-.9-2-2Zm4 1h8v-2H8v2Zm10-5h-4v2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4v2h4c2.21 0 4-1.79 4-4s-1.79-4-4-4Z',
  lightning:
    'M7 2v11h3v9l7-12h-4l4-8H7Z',
  moon:
    'M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8C13 3.04 12.5 3 12 3Z',
  sun:
    'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5ZM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2v2Zm18 0h2v-2h-2c-.55 0-1 .45-1 1s.45 1 1 1ZM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2h-2Zm0 18v2h2v-2c0-.55-.45-1-1-1s-1 .45-1 1ZM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 1 0 1.41-1.41L5.99 4.58Zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06Zm1.06-12.37a1 1 0 0 0-1.41 0l-1.06 1.06a1 1 0 1 0 1.41 1.41l1.06-1.06a1 1 0 0 0 0-1.41ZM7.05 18.36a1 1 0 1 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06Z',
  globe:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z',
  feather:
    'M20 7c-.09.36-.22.71-.37 1.05l-2.83-.71-.18.7 2.54.63c-.26.42-.56.82-.9 1.18l-2.2-.55-.18.7 1.83.46c-.87.77-1.91 1.33-3.05 1.6L12 11.5 3 20.5l8.67-9.33c.35-.04.7-.1 1.04-.19l-.45 1.8.7.18.6-2.4c.42-.2.82-.43 1.18-.7l-.55 2.2.7.18.71-2.83c.35-.15.69-.28 1.05-.37L20 7Z',
  owl:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM8.5 13A2.5 2.5 0 1 1 8.5 8a2.5 2.5 0 0 1 0 5Zm7 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM12 18c-1.1 0-2-.45-2-1s.9-1 2-1 2 .45 2 1-.9 1-2 1Z',
}

// ── Rarity Wax Colors ────────────────────────

/** Wax seal base colors keyed by rarity. */
export const RARITY_WAX_COLORS: Record<AchievementRarity, string> = {
  common: '#8B6F47',
  uncommon: '#A86B3D',
  rare: '#7C1F2E',
  epic: '#2A1F5C',
  legendary: '#C9A961',
  mythic: '#C9A961',
}

/** Gold leaf accent color for epic+ seals. */
export const GOLD_LEAF = '#C9A961'

// ── Layer 1: Six Wax Edge Shape Variants ─────
// Each is a closed path in a 100x100 viewBox with
// irregular drip edges. Deterministically selected
// via hash of achievementId.

export const WAX_EDGE_PATHS: string[] = [
  // Variant 0 — original rounded drip
  'M50 5 C55 3,60 6,65 5 C70 4,74 8,78 10 C82 12,86 10,88 15 ' +
  'C90 20,94 22,95 28 C96 34,93 38,95 42 C97 46,96 52,95 56 ' +
  'C94 60,97 64,95 68 C93 72,90 76,88 80 C86 84,82 86,78 88 ' +
  'C74 90,72 94,68 95 C64 96,60 93,56 95 C52 97,48 97,44 95 ' +
  'C40 93,36 96,32 95 C28 94,24 90,22 88 C18 86,14 84,12 80 ' +
  'C10 76,7 72,5 68 C3 64,6 60,5 56 C4 52,3 48,5 44 ' +
  'C7 40,4 36,5 32 C6 28,8 24,10 20 C12 16,10 12,15 10 ' +
  'C20 8,18 4,22 5 C26 6,30 3,34 5 C38 7,42 4,46 5 C48 6,50 5,50 5Z',

  // Variant 1 — wider right drip
  'M50 4 C56 3,62 7,67 5 C72 3,76 9,80 12 C84 15,88 11,90 17 ' +
  'C92 23,95 20,96 27 C97 33,94 39,96 44 C98 49,96 54,94 58 ' +
  'C92 62,95 67,93 71 C91 75,87 79,84 83 C81 87,77 89,73 91 ' +
  'C69 93,65 96,61 97 C57 98,53 95,49 97 C45 99,41 96,37 94 ' +
  'C33 92,29 95,25 93 C21 91,17 87,14 83 C11 79,8 75,6 71 ' +
  'C4 67,7 63,5 59 C3 55,4 51,5 47 C6 43,3 39,5 35 ' +
  'C7 31,5 27,8 23 C11 19,9 15,13 11 C17 7,15 4,19 5 ' +
  'C23 6,27 3,31 4 C35 5,39 3,43 4 C47 5,50 4,50 4Z',

  // Variant 2 — more erratic with deeper drips
  'M50 3 C54 2,59 5,63 4 C67 3,71 7,75 9 C79 11,83 8,86 13 ' +
  'C89 18,93 16,95 22 C97 28,94 33,96 38 C98 43,95 48,96 53 ' +
  'C97 58,93 62,95 66 C97 70,93 74,90 78 C87 82,83 85,79 88 ' +
  'C75 91,71 94,67 96 C63 98,59 95,55 97 C51 99,47 96,43 97 ' +
  'C39 98,35 95,31 93 C27 91,23 94,19 91 C15 88,11 84,9 80 ' +
  'C7 76,4 72,3 68 C2 64,5 60,3 56 C1 52,4 48,3 44 ' +
  'C2 40,5 36,4 32 C3 28,6 24,9 20 C12 16,8 12,12 9 ' +
  'C16 6,13 3,17 4 C21 5,25 2,29 3 C33 4,37 2,41 3 C45 4,48 3,50 3Z',

  // Variant 3 — smoother, less drip, more oval
  'M50 6 C56 5,61 7,66 6 C71 5,75 9,79 12 C83 15,86 13,88 18 ' +
  'C90 23,92 20,93 26 C94 32,92 37,93 42 C94 47,93 52,92 57 ' +
  'C91 62,93 66,92 70 C91 74,88 78,85 81 C82 84,79 86,75 88 ' +
  'C71 90,67 92,63 93 C59 94,55 92,51 93 C47 94,43 92,39 93 ' +
  'C35 94,31 92,27 90 C23 88,19 86,16 83 C13 80,10 76,9 72 ' +
  'C8 68,10 64,9 60 C8 56,7 52,8 48 C9 44,7 40,8 36 ' +
  'C9 32,8 28,10 24 C12 20,10 16,13 13 C16 10,14 7,18 6 ' +
  'C22 5,26 7,30 6 C34 5,38 7,42 6 C46 5,48 6,50 6Z',

  // Variant 4 — big bottom drip, tight top
  'M50 6 C55 5,60 4,64 5 C68 6,72 8,76 10 C80 12,84 9,87 14 ' +
  'C90 19,93 17,94 23 C95 29,93 34,94 39 C95 44,94 49,93 54 ' +
  'C92 59,95 63,94 67 C93 71,90 75,87 79 C84 83,80 87,76 90 ' +
  'C72 93,69 97,65 98 C61 99,57 96,53 98 C49 100,45 97,41 98 ' +
  'C37 99,33 96,29 93 C25 90,21 87,18 83 C15 79,12 75,10 71 ' +
  'C8 67,6 63,5 59 C4 55,6 51,5 47 C4 43,5 39,7 35 ' +
  'C9 31,7 27,9 23 C11 19,9 15,12 12 C15 9,13 6,17 5 ' +
  'C21 4,25 6,29 5 C33 4,37 6,41 5 C45 4,48 6,50 6Z',

  // Variant 5 — asymmetric left-heavy drip
  'M50 5 C54 4,58 6,62 5 C66 4,70 7,74 9 C78 11,82 9,85 13 ' +
  'C88 17,91 15,93 21 C95 27,92 32,94 37 C96 42,94 47,95 52 ' +
  'C96 57,93 61,94 65 C95 69,92 73,89 77 C86 81,82 84,78 87 ' +
  'C74 90,70 93,66 94 C62 95,58 93,54 94 C50 95,46 93,42 94 ' +
  'C38 95,34 97,30 96 C26 95,22 92,18 89 C14 86,10 82,7 78 ' +
  'C4 74,2 70,1 66 C0 62,3 58,2 54 C1 50,3 46,2 42 ' +
  'C1 38,4 34,6 30 C8 26,5 22,8 18 C11 14,9 10,13 8 ' +
  'C17 6,14 3,18 4 C22 5,26 3,30 4 C34 5,38 3,42 4 C46 5,49 4,50 5Z',
]

// ── Layer 2: Category Border Ring SVG Generators ──
// Each returns SVG elements (circles, paths) to render
// a decorative inner ring at radius ~38 around centre 50,50.

export type CategoryRingFn = (uid: string, strokeColor: string) => string

/** Map of category to a function that generates SVG ring markup. */
export const CATEGORY_RING_GENERATORS: Record<AchievementCategory, CategoryRingFn> = {
  // Simple embossed circle
  'single-book': (_uid, stroke) =>
    `<circle cx="50" cy="50" r="38" fill="none" stroke="${stroke}" stroke-width="1.2" stroke-opacity="0.5"/>`,

  // Double ring with evenly-spaced dots
  'author-complete': (_uid, stroke) => {
    const dots = Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2 - Math.PI / 2
      const x = 50 + 38 * Math.cos(angle)
      const y = 50 + 38 * Math.sin(angle)
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.8" fill="${stroke}" fill-opacity="0.5"/>`
    }).join('')
    return (
      `<circle cx="50" cy="50" r="36" fill="none" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.4"/>` +
      `<circle cx="50" cy="50" r="40" fill="none" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.4"/>` +
      dots
    )
  },

  // Braided / rope ring (two offset sine-wave circles)
  'series-complete': (_uid, stroke) => {
    const pts1: string[] = []
    const pts2: string[] = []
    for (let i = 0; i <= 72; i++) {
      const angle = (i / 72) * Math.PI * 2
      const r1 = 38 + 1.5 * Math.sin(angle * 12)
      const r2 = 38 - 1.5 * Math.sin(angle * 12)
      pts1.push(`${(50 + r1 * Math.cos(angle)).toFixed(1)},${(50 + r1 * Math.sin(angle)).toFixed(1)}`)
      pts2.push(`${(50 + r2 * Math.cos(angle)).toFixed(1)},${(50 + r2 * Math.sin(angle)).toFixed(1)}`)
    }
    return (
      `<polyline points="${pts1.join(' ')}" fill="none" stroke="${stroke}" stroke-width="0.8" stroke-opacity="0.5"/>` +
      `<polyline points="${pts2.join(' ')}" fill="none" stroke="${stroke}" stroke-width="0.8" stroke-opacity="0.5"/>`
    )
  },

  // Laurel wreath ring — small leaf arcs on each side
  'tradition-complete': (_uid, stroke) => {
    const leaves: string[] = []
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2 - Math.PI / 2
      const cx = 50 + 38 * Math.cos(angle)
      const cy = 50 + 38 * Math.sin(angle)
      const tipAngle = angle + 0.3
      const tx = cx + 3 * Math.cos(tipAngle)
      const ty = cy + 3 * Math.sin(tipAngle)
      leaves.push(
        `<ellipse cx="${((cx + tx) / 2).toFixed(1)}" cy="${((cy + ty) / 2).toFixed(1)}" ` +
        `rx="2" ry="0.8" transform="rotate(${((angle * 180) / Math.PI + 90).toFixed(0)} ${((cx + tx) / 2).toFixed(1)} ${((cy + ty) / 2).toFixed(1)})" ` +
        `fill="${stroke}" fill-opacity="0.35"/>`
      )
    }
    return leaves.join('')
  },

  // Greek key pattern ring — stepped rectangle path around circle
  'form-mastery': (_uid, stroke) => {
    const segments: string[] = []
    const steps = 16
    for (let i = 0; i < steps; i++) {
      const a1 = (i / steps) * Math.PI * 2
      const a2 = ((i + 0.5) / steps) * Math.PI * 2
      const a3 = ((i + 1) / steps) * Math.PI * 2
      const outer = 40
      const inner = 36
      const x1 = (50 + outer * Math.cos(a1)).toFixed(1)
      const y1 = (50 + outer * Math.sin(a1)).toFixed(1)
      const x2 = (50 + outer * Math.cos(a2)).toFixed(1)
      const y2 = (50 + outer * Math.sin(a2)).toFixed(1)
      const x3 = (50 + inner * Math.cos(a2)).toFixed(1)
      const y3 = (50 + inner * Math.sin(a2)).toFixed(1)
      const x4 = (50 + inner * Math.cos(a3)).toFixed(1)
      const y4 = (50 + inner * Math.sin(a3)).toFixed(1)
      segments.push(`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}`)
    }
    return `<path d="${segments.join(' ')}" fill="none" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.5"/>`
  },

  // Era mastery — dashed concentric ring
  'era-mastery': (_uid, stroke) =>
    `<circle cx="50" cy="50" r="38" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="3 2"/>`,

  // Gear / cog teeth ring
  milestone: (_uid, stroke) => {
    const teeth = 18
    const pts: string[] = []
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2
      const a2 = ((i + 0.3) / teeth) * Math.PI * 2
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2
      const a4 = ((i + 0.8) / teeth) * Math.PI * 2
      pts.push(
        `${(50 + 36 * Math.cos(a1)).toFixed(1)},${(50 + 36 * Math.sin(a1)).toFixed(1)}`,
        `${(50 + 40 * Math.cos(a2)).toFixed(1)},${(50 + 40 * Math.sin(a2)).toFixed(1)}`,
        `${(50 + 40 * Math.cos(a3)).toFixed(1)},${(50 + 40 * Math.sin(a3)).toFixed(1)}`,
        `${(50 + 36 * Math.cos(a4)).toFixed(1)},${(50 + 36 * Math.sin(a4)).toFixed(1)}`
      )
    }
    return `<polygon points="${pts.join(' ')}" fill="none" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.5"/>`
  },

  // Starburst ring — alternating long and short spikes
  special: (_uid, stroke) => {
    const spikes = 24
    const pts: string[] = []
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2
      const r = i % 2 === 0 ? 41 : 35
      pts.push(`${(50 + r * Math.cos(angle)).toFixed(1)},${(50 + r * Math.sin(angle)).toFixed(1)}`)
    }
    return `<polygon points="${pts.join(' ')}" fill="none" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.45"/>`
  },
}

// ── Helpers ──────────────────────────────────

/** Simple deterministic hash of a string to a positive integer. */
export function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/** Pick a wax edge path variant deterministically from an achievement ID. */
export function pickWaxEdge(achievementId: string): string {
  return WAX_EDGE_PATHS[hashString(achievementId) % WAX_EDGE_PATHS.length]
}
