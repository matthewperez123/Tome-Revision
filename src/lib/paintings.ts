import manifest from "../../public/paintings/manifest.json"

export interface Painting {
  id: string
  filename: string
  src: string
  title: string
  artist: string
  year: string
  focalPoint: "top" | "center" | "bottom"
  isDefault?: boolean
  // Extended fields (optional for backward compat with older entries)
  medium?: string
  institution?: string
  sourceUrl?: string
  imageUrl?: string
  license?: "CC0" | "PD-Art" | "PD-US"
  tradition?: string
  themes?: string[]
  pairedBooks?: string[]
  era?: string
  mood?: string
  caption?: string
}

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
export function getPaintingsByMood(mood: string): Painting[] {
  return PAINTINGS.filter((p) => p.mood === mood)
}

const STORAGE_KEY = "tome:stoa_painting_id"

export function getStoredPaintingId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredPaintingId(id: string): void {
  localStorage.setItem(STORAGE_KEY, id)
}
