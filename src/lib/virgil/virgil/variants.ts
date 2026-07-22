/**
 * Book-world variants.
 *
 * Restrained adaptations: palette slots + one chest/hem motif + one prop
 * accent. The silhouette — pointed hood, bell cloak, lantern, satchel —
 * never changes, so Virgil stays recognizable in every world.
 */

import type { VirgilPalette } from "./palette"
import { VIRGIL_PALETTE } from "./palette"
import type { VirgilVariantId } from "./types"

export type VirgilMotifId =
  | "laurel"
  | "thistle"
  | "compass"
  | "key"
  | "falling-star"
  | "ascent"
  | "shield"
  | "north-star"
  | "spark"
  | "ribbon"
  | "ember-window"
  | "tablet"
  | "city-glyph"

export interface VirgilVariant {
  id: VirgilVariantId
  label: string
  work: string
  /** design note shown in the Lab */
  note: string
  palette: VirgilPalette
  motif: VirgilMotifId
  /** glow hue shift for the lantern */
  glow: string
}

function makeVariant(
  base: Partial<VirgilPalette> & Pick<VirgilVariant, "id" | "label" | "work" | "note" | "motif">,
): VirgilVariant {
  const { id, label, work, note, motif, ...overrides } = base
  const palette = { ...VIRGIL_PALETTE, ...overrides }
  return { id, label, work, note, motif, palette, glow: palette.glow }
}

export const VIRGIL_VARIANTS: Record<VirgilVariantId, VirgilVariant> = {
  canon: makeVariant({
    id: "canon",
    label: "Canon",
    work: "The Living Archive",
    note: "Midnight cloak, lantern gold, laurel pin. The default guide.",
    motif: "laurel",
  }),
  macbeth: makeVariant({
    id: "macbeth",
    label: "Macbeth",
    work: "Macbeth",
    note: "Storm cloak, blood-dark trim, thistle-and-crown motif.",
    motif: "thistle",
    cloak: "#3B3F4D",
    cloakShadow: "#2B2E3A",
    trim: "#8E3B3B",
    glow: "#E8B64C",
    laurel: "#7A5C9E",
  }),
  "moby-dick": makeVariant({
    id: "moby-dick",
    label: "Moby-Dick",
    work: "Moby-Dick",
    note: "Maritime coat, sea-spray trim, brass compass.",
    motif: "compass",
    cloak: "#2E5266",
    cloakShadow: "#22404F",
    trim: "#E8E3D3",
    glow: "#F0CE7A",
    laurel: "#B08A4A",
  }),
  alice: makeVariant({
    id: "alice",
    label: "Alice",
    work: "Alice's Adventures in Wonderland",
    note: "Wonderland blue, card-suit trim, a small gold key.",
    motif: "key",
    cloak: "#4A6FA5",
    cloakShadow: "#38567F",
    trim: "#C0473B",
    glow: "#F4D06F",
    laurel: "#E3C15E",
  }),
  "paradise-lost": makeVariant({
    id: "paradise-lost",
    label: "Paradise Lost",
    work: "Paradise Lost",
    note: "Void-deep cloak, celestial geometry, a falling star.",
    motif: "falling-star",
    cloak: "#262640",
    cloakShadow: "#1B1B30",
    trim: "#E5C15D",
    glow: "#F6E3A1",
    laurel: "#E5C15D",
  }),
  "divine-comedy": makeVariant({
    id: "divine-comedy",
    label: "Divine Comedy",
    work: "The Divine Comedy",
    note: "Three-realm progression: vermilion hem to laurel ascent.",
    motif: "ascent",
    cloak: "#4E3A5C",
    cloakShadow: "#3A2B45",
    trim: "#B3402A",
    glow: "#F2D38A",
    laurel: "#7D9B5E",
  }),
  iliad: makeVariant({
    id: "iliad",
    label: "Iliad",
    work: "The Iliad",
    note: "Bronze, blue and ochre; a shield on the shoreline.",
    motif: "shield",
    cloak: "#4E5A6E",
    cloakShadow: "#3A4554",
    trim: "#B07D3A",
    glow: "#EFC56A",
    laurel: "#B07D3A",
  }),
  odyssey: makeVariant({
    id: "odyssey",
    label: "Odyssey",
    work: "The Odyssey",
    note: "Indigo sea, rope trim, navigation by the north star.",
    motif: "north-star",
    cloak: "#333F6E",
    cloakShadow: "#252D50",
    trim: "#C9B28A",
    glow: "#F0D28A",
    laurel: "#C9B28A",
  }),
  frankenstein: makeVariant({
    id: "frankenstein",
    label: "Frankenstein",
    work: "Frankenstein",
    note: "Alpine storm slate, laboratory spark, icy cyan glow.",
    motif: "spark",
    cloak: "#43536B",
    cloakShadow: "#324052",
    trim: "#7FD4D9",
    glow: "#9FE6E6",
    laurel: "#7FD4D9",
  }),
  "pride-prejudice": makeVariant({
    id: "pride-prejudice",
    label: "Pride & Prejudice",
    work: "Pride and Prejudice",
    note: "Garden sage, a rose ribbon, a folded letter.",
    motif: "ribbon",
    cloak: "#66795C",
    cloakShadow: "#4E5D47",
    trim: "#C9898E",
    glow: "#F2D18C",
    laurel: "#C9898E",
  }),
  "jane-eyre": makeVariant({
    id: "jane-eyre",
    label: "Jane Eyre",
    work: "Jane Eyre",
    note: "Moor heather, red-room trim, an ember in the window.",
    motif: "ember-window",
    cloak: "#5B4E5E",
    cloakShadow: "#443945",
    trim: "#8E3B3B",
    glow: "#D97B4A",
    laurel: "#A8694A",
  }),
  meditations: makeVariant({
    id: "meditations",
    label: "Meditations",
    work: "Meditations",
    note: "Quiet dawn wool, stoic red, a wax tablet.",
    motif: "tablet",
    cloak: "#6E6156",
    cloakShadow: "#544A41",
    trim: "#A14A3A",
    glow: "#EFC98A",
    laurel: "#A14A3A",
  }),
  republic: makeVariant({
    id: "republic",
    label: "Republic",
    work: "The Republic",
    note: "Cobalt and gold, cave-light glow, the geometric city.",
    motif: "city-glyph",
    cloak: "#2F4C8E",
    cloakShadow: "#223868",
    trim: "#D4AF5A",
    glow: "#F6DC92",
    laurel: "#D4AF5A",
  }),
}

export const VIRGIL_VARIANT_IDS = Object.keys(VIRGIL_VARIANTS) as VirgilVariantId[]
