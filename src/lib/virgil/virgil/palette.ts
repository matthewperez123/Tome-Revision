/**
 * Virgil core palette. Hexes are the single source of truth referenced by
 * docs/design/virgil-character-bible.md. Book-world variants override a
 * subset of these in variants.ts.
 */

export interface VirgilPalette {
  /** deepest line/shadow ink */
  ink: string
  /** hooded cloak body */
  cloak: string
  /** cloak shadow side */
  cloakShadow: string
  /** cloak trim, hem band, hood edge */
  trim: string
  /** face */
  face: string
  /** face shadow / cheek */
  faceShadow: string
  /** eyes and line work on the face */
  eye: string
  /** blush */
  blush: string
  /** lantern metal frame */
  lanternFrame: string
  /** lantern glass */
  lanternGlass: string
  /** glow core */
  glow: string
  /** book satchel leather */
  satchel: string
  satchelFlap: string
  /** the book Virgil carries */
  book: string
  bookPages: string
  /** laurel pin and small metal accents */
  laurel: string
}

/**
 * Canon palette — the Living Archive affinity: midnight ink + lantern gold
 * on warm ivory, with the brand gold (#C8A24B) already used across Tome.
 */
export const VIRGIL_PALETTE: VirgilPalette = {
  ink: "#1F2430",
  cloak: "#2F3E66",
  cloakShadow: "#232F4E",
  trim: "#C8A24B",
  face: "#F7EBD4",
  faceShadow: "#E9D6B4",
  eye: "#232A38",
  blush: "#E0A27E",
  lanternFrame: "#7A5B2A",
  lanternGlass: "#F7D98A",
  glow: "#F2C14E",
  satchel: "#8A5A3B",
  satchelFlap: "#6F4527",
  book: "#E07856",
  bookPages: "#F4E9D3",
  laurel: "#C8A24B",
}

/** Stage backdrops used by the Lab theme switcher and embedding surfaces. */
export const VIRGIL_STAGE_THEMES = {
  light: { page: "#FBF7EE", surface: "#F3ECDC", ink: "#232A38" },
  dark: { page: "#141824", surface: "#1E2536", ink: "#EDE6D4" },
  reader: { page: "#F1E6CF", surface: "#E7D9BC", ink: "#3A2F22" },
} as const

export type VirgilStageTheme = keyof typeof VIRGIL_STAGE_THEMES
