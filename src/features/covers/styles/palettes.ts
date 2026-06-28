export const COVER_STYLE_VERSION = "tome-luminous-minimal-modernism-v1" as const

export type PaletteTemperature = "warm" | "cool" | "mixed"
export type DominantLightMode = "light" | "dark" | "mixed"
export type SemanticPaletteTag =
  | "elegiac"
  | "romantic"
  | "martial"
  | "metaphysical"
  | "maritime"
  | "philosophical"
  | "pastoral"
  | "gothic"
  | "catastrophic"
  | "comic"
  | "political"
  | "intimate"
  | "nature"
  | "civic"
  | "social"
  | "adventure"

export interface CoverPalette {
  id: string
  label: string
  colors: Record<string, string>
  field: string
  principalInk: string
  secondaryInk: string
  counterColor: string
  accent?: string
  temperature: PaletteTemperature
  dominantMode: DominantLightMode
  tags: SemanticPaletteTag[]
}

export const COVER_PALETTES = [
  {
    id: "luminous-ivory-sage",
    label: "Luminous Ivory Sage",
    colors: {
      agedVellum: "#F3E6C8",
      warmIvory: "#FAF2DB",
      sage: "#A9B796",
      eucalyptus: "#809A82",
      moss: "#566E57",
      paleGold: "#D8B866",
      restrainedInk: "#263634",
    },
    field: "#F3E6C8",
    principalInk: "#263634",
    secondaryInk: "#809A82",
    counterColor: "#FAF2DB",
    accent: "#D8B866",
    temperature: "warm",
    dominantMode: "light",
    tags: ["pastoral", "philosophical", "nature", "intimate"],
  },
  {
    id: "sea-glass-day",
    label: "Sea Glass Day",
    colors: {
      shellIvory: "#F5EEDB",
      seaGlass: "#8ABDB2",
      paleHarborBlue: "#9FC4D1",
      washedTeal: "#5E958F",
      sunlitWheat: "#D7BE72",
      softGraphite: "#3B4644",
    },
    field: "#F5EEDB",
    principalInk: "#3B4644",
    secondaryInk: "#5E958F",
    counterColor: "#9FC4D1",
    accent: "#D7BE72",
    temperature: "cool",
    dominantMode: "light",
    tags: ["maritime", "adventure", "pastoral", "romantic"],
  },
  {
    id: "wheat-and-celadon",
    label: "Wheat and Celadon",
    colors: {
      linen: "#F0E2C2",
      celadon: "#B7C7A2",
      dryGrass: "#D7BE78",
      oliveShadow: "#727A56",
      mutedOchre: "#C59646",
      quietInk: "#384034",
    },
    field: "#F0E2C2",
    principalInk: "#384034",
    secondaryInk: "#727A56",
    counterColor: "#B7C7A2",
    accent: "#C59646",
    temperature: "warm",
    dominantMode: "light",
    tags: ["pastoral", "nature", "comic", "elegiac"],
  },
  {
    id: "clay-rose-garden",
    label: "Clay Rose Garden",
    colors: {
      pearlPaper: "#F6E8D5",
      clayRose: "#C98276",
      terracotta: "#B96A4D",
      lichenGreen: "#9BAA83",
      chalk: "#EFE6D4",
      smallDarkAccent: "#3D3430",
    },
    field: "#F6E8D5",
    principalInk: "#3D3430",
    secondaryInk: "#9BAA83",
    counterColor: "#EFE6D4",
    accent: "#C98276",
    temperature: "warm",
    dominantMode: "light",
    tags: ["romantic", "intimate", "pastoral", "social"],
  },
  {
    id: "clear-sky-parchment",
    label: "Clear Sky Parchment",
    colors: {
      parchment: "#F1E0BD",
      washedSky: "#A9C7DE",
      stoneGrey: "#A9AAA0",
      saffron: "#D2A540",
      lineworkBlue: "#2D4B62",
      chalkCloud: "#F7EBD0",
    },
    field: "#F1E0BD",
    principalInk: "#2D4B62",
    secondaryInk: "#A9AAA0",
    counterColor: "#A9C7DE",
    accent: "#D2A540",
    temperature: "mixed",
    dominantMode: "light",
    tags: ["philosophical", "civic", "political", "metaphysical"],
  },
  {
    id: "orchard-mist",
    label: "Orchard Mist",
    colors: {
      cream: "#F8EED8",
      mistGrey: "#C9CDC2",
      appleLeaf: "#A6B882",
      mutedFern: "#768760",
      paleCoral: "#DA9A82",
      graphiteTwig: "#41413A",
    },
    field: "#F8EED8",
    principalInk: "#41413A",
    secondaryInk: "#768760",
    counterColor: "#C9CDC2",
    accent: "#DA9A82",
    temperature: "mixed",
    dominantMode: "light",
    tags: ["pastoral", "nature", "romantic", "intimate"],
  },
  {
    id: "civic-stone-light",
    label: "Civic Stone Light",
    colors: {
      chalk: "#EFE8D8",
      warmStone: "#C9BEA5",
      eucalyptus: "#869A83",
      fadedGold: "#C7AA5A",
      softBlueGrey: "#93A7AE",
      civicInk: "#333A3B",
    },
    field: "#EFE8D8",
    principalInk: "#333A3B",
    secondaryInk: "#869A83",
    counterColor: "#C9BEA5",
    accent: "#C7AA5A",
    temperature: "mixed",
    dominantMode: "light",
    tags: ["civic", "political", "philosophical", "social"],
  },
  {
    id: "snowfield-ember-light",
    label: "Snowfield Ember Light",
    colors: {
      ivorySnow: "#F3F0E6",
      paleBlueShadow: "#B7C7D2",
      softGraphite: "#4C5658",
      weatheredStone: "#A7AAA2",
      ember: "#C76345",
      winterCream: "#E8DDC8",
    },
    field: "#F3F0E6",
    principalInk: "#4C5658",
    secondaryInk: "#A7AAA2",
    counterColor: "#B7C7D2",
    accent: "#C76345",
    temperature: "cool",
    dominantMode: "light",
    tags: ["catastrophic", "gothic", "nature", "elegiac"],
  },
  {
    id: "archive-navy",
    label: "Archive Navy",
    colors: {
      parchment: "#EDD6B0",
      palePaper: "#F7E8CE",
      deepInk: "#102332",
      navy: "#1A323F",
      slate: "#3A5259",
      ochreAccent: "#B5823C",
    },
    field: "#EDD6B0",
    principalInk: "#102332",
    secondaryInk: "#3A5259",
    counterColor: "#F7E8CE",
    accent: "#B5823C",
    temperature: "mixed",
    dominantMode: "light",
    tags: ["elegiac", "pastoral", "philosophical"],
  },
  {
    id: "coral-ruins",
    label: "Coral Ruins",
    colors: {
      coralField: "#F2A57F",
      paleSalmon: "#F5B990",
      terracotta: "#D67753",
      rust: "#BD5840",
      umber: "#8B4637",
      charcoalBrown: "#442E2C",
    },
    field: "#F2A57F",
    principalInk: "#442E2C",
    secondaryInk: "#BD5840",
    counterColor: "#F5B990",
    accent: "#8B4637",
    temperature: "warm",
    dominantMode: "light",
    tags: ["elegiac", "catastrophic", "political"],
  },
  {
    id: "violet-ascent",
    label: "Violet Ascent",
    colors: {
      midnightViolet: "#171B2F",
      deepViolet: "#302A4C",
      duskPurple: "#524872",
      mauve: "#7B6F9D",
      paleLavender: "#AE97AD",
      starGold: "#D2A34A",
    },
    field: "#171B2F",
    principalInk: "#AE97AD",
    secondaryInk: "#524872",
    counterColor: "#302A4C",
    accent: "#D2A34A",
    temperature: "cool",
    dominantMode: "dark",
    tags: ["metaphysical", "elegiac", "philosophical"],
  },
  {
    id: "bronze-epic",
    label: "Bronze Epic",
    colors: {
      parchment: "#EDCE9E",
      sand: "#DDA567",
      bronze: "#B75E31",
      burntSienna: "#86462B",
      darkEarth: "#623A2B",
      charcoal: "#312C2B",
    },
    field: "#EDCE9E",
    principalInk: "#312C2B",
    secondaryInk: "#B75E31",
    counterColor: "#DDA567",
    accent: "#86462B",
    temperature: "warm",
    dominantMode: "light",
    tags: ["martial", "catastrophic", "political"],
  },
  {
    id: "aegean-nocturne",
    label: "Aegean Nocturne",
    colors: {
      abyss: "#071C3E",
      midnightBlue: "#082045",
      ultramarine: "#0D3263",
      cobalt: "#154075",
      seaBlue: "#39618D",
      moonIvory: "#E3DFCF",
      starGold: "#D4A348",
    },
    field: "#071C3E",
    principalInk: "#E3DFCF",
    secondaryInk: "#39618D",
    counterColor: "#082045",
    accent: "#D4A348",
    temperature: "cool",
    dominantMode: "dark",
    tags: ["maritime", "metaphysical", "romantic"],
  },
  {
    id: "cave-gold",
    label: "Cave Gold",
    colors: {
      blueBlack: "#14202A",
      graphite: "#212F38",
      slate: "#475963",
      ivory: "#EADAB9",
      paleStone: "#E5D3AF",
      mutedGold: "#B4A073",
    },
    field: "#14202A",
    principalInk: "#EADAB9",
    secondaryInk: "#475963",
    counterColor: "#212F38",
    accent: "#B4A073",
    temperature: "mixed",
    dominantMode: "dark",
    tags: ["philosophical", "political", "metaphysical"],
  },
  {
    id: "alpine-slate",
    label: "Alpine Slate",
    colors: {
      snowPaper: "#E8E4D8",
      fog: "#A7AAA5",
      slate: "#66757A",
      blueStone: "#344B56",
      deepInk: "#102332",
      ember: "#C25B36",
    },
    field: "#E8E4D8",
    principalInk: "#102332",
    secondaryInk: "#66757A",
    counterColor: "#A7AAA5",
    accent: "#C25B36",
    temperature: "cool",
    dominantMode: "light",
    tags: ["gothic", "catastrophic", "intimate"],
  },
  {
    id: "garden-teal",
    label: "Garden Teal",
    colors: {
      warmPaper: "#F0D8AF",
      sageStone: "#7D8479",
      mutedTeal: "#4F6969",
      darkTeal: "#29484F",
      deepNavy: "#142B3F",
      ochre: "#B88A43",
    },
    field: "#F0D8AF",
    principalInk: "#142B3F",
    secondaryInk: "#4F6969",
    counterColor: "#7D8479",
    accent: "#B88A43",
    temperature: "mixed",
    dominantMode: "light",
    tags: ["pastoral", "romantic", "comic"],
  },
  {
    id: "storm-ember",
    label: "Storm Ember",
    colors: {
      stormPaper: "#C7CAC5",
      coldGray: "#77838A",
      stormBlue: "#314956",
      nearBlack: "#0B2030",
      ember: "#C25E34",
      lightningIvory: "#F0E3C8",
    },
    field: "#C7CAC5",
    principalInk: "#0B2030",
    secondaryInk: "#314956",
    counterColor: "#F0E3C8",
    accent: "#C25E34",
    temperature: "cool",
    dominantMode: "mixed",
    tags: ["catastrophic", "gothic", "martial"],
  },
  {
    id: "moonlit-ivory",
    label: "Moonlit Ivory",
    colors: {
      ivoryField: "#F1DDC0",
      moon: "#F8E9CC",
      blueGray: "#66747A",
      darkSlate: "#334A53",
      blueBlack: "#132A3C",
      gold: "#C49345",
    },
    field: "#F1DDC0",
    principalInk: "#132A3C",
    secondaryInk: "#66747A",
    counterColor: "#F8E9CC",
    accent: "#C49345",
    temperature: "mixed",
    dominantMode: "light",
    tags: ["romantic", "intimate", "philosophical"],
  },
] as const satisfies readonly CoverPalette[]

export type CoverPaletteId = (typeof COVER_PALETTES)[number]["id"]

export const LUMINOUS_LIGHT_PALETTE_IDS = [
  "luminous-ivory-sage",
  "sea-glass-day",
  "wheat-and-celadon",
  "clay-rose-garden",
  "clear-sky-parchment",
  "orchard-mist",
  "civic-stone-light",
  "snowfield-ember-light",
] as const satisfies readonly CoverPaletteId[]

export const COVER_TEXTURE_PROFILES = [
  "soft-lithograph",
  "cut-paper-linocut",
  "restrained-screenprint",
  "mineral-stipple",
  "matte-overprint",
] as const

export type CoverTextureProfile = (typeof COVER_TEXTURE_PROFILES)[number]

export function getCoverPalette(id: CoverPaletteId): CoverPalette {
  const palette = COVER_PALETTES.find((item) => item.id === id)
  if (!palette) {
    throw new Error(`Unknown cover palette: ${id}`)
  }
  return palette
}
