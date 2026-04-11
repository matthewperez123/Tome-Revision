import manifest from "../../public/paintings/manifest.json"

export type PaintingMood =
  | "serene"
  | "dramatic"
  | "contemplative"
  | "epic"
  | "intimate"
  | "sublime"

export type PaintingCategory =
  | "classical-renaissance"
  | "baroque-dutch"
  | "romantic-sublime"
  | "pre-raphaelite-victorian"
  | "impressionist-modern"

export interface Painting {
  id: string
  filename: string
  src: string
  title: string
  artist: string
  year: string
  focalPoint: "top" | "center" | "bottom"
  dominantColor: string
  aspectRatio: number
  category: PaintingCategory
  mood: PaintingMood
  isDefault?: boolean
  medium?: string
  institution?: string
  sourceUrl?: string
  imageUrl?: string
  license?: "CC0" | "PD-Art" | "PD-US"
  tradition?: string
  themes?: string[]
  pairedBooks?: string[]
  era?: string
  caption?: string
}

export const PAINTING_CATEGORIES: { id: PaintingCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "classical-renaissance", label: "Classical" },
  { id: "baroque-dutch", label: "Baroque" },
  { id: "romantic-sublime", label: "Romantic" },
  { id: "pre-raphaelite-victorian", label: "Pre-Raph." },
  { id: "impressionist-modern", label: "Modern" },
]

export const PAINTINGS: Painting[] = manifest as Painting[]

export const DEFAULT_PAINTING =
  PAINTINGS.find((p) => p.isDefault) ?? PAINTINGS[0]

export function getPaintingById(id: string): Painting | undefined {
  return PAINTINGS.find((p) => p.id === id)
}

/** Get paintings paired with a specific book */
export function getPaintingsForBook(bookId: string): Painting[] {
  return PAINTINGS.filter((p) => p.pairedBooks?.includes(bookId))
}

/** Get paintings by tradition */
export function getPaintingsByTradition(tradition: string): Painting[] {
  return PAINTINGS.filter((p) => p.tradition === tradition)
}

/** Get paintings by mood */
export function getPaintingsByMood(mood: PaintingMood): Painting[] {
  return PAINTINGS.filter((p) => p.mood === mood)
}

/** Get paintings by display category */
export function getPaintingsByCategory(category: PaintingCategory): Painting[] {
  return PAINTINGS.filter((p) => p.category === category)
}

/** Check if painting uses an external URL */
export function isExternalPainting(p: Painting): boolean {
  return p.src.startsWith("http")
}

const STORAGE_KEY = "tome:stoa_painting_id"

export function getStoredPaintingId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredPaintingId(id: string): void {
  localStorage.setItem(STORAGE_KEY, id)
}
