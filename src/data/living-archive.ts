import {
  getMonumentalLiteraryPathsAssets,
  getMonumentalLiteraryPathsBooks,
  hasCompleteMonumentalLiteraryPathsPack,
  type BookVisualBible,
} from "@/data/monumental-literary-paths"

export type TomeTemplateFamily =
  | "emblem"
  | "horizon"
  | "threshold"
  | "constellation"
  | "ascent"

export type TomeCoverVariant = "archive" | "gallery" | "compact"

export interface TomeVisualAssetSet {
  coverMaster2x3: string
  coverApp3x4: string
  coverSquare: string
  coverThumbnail: string
  stoaDesktop16x9: string
  stoaTablet4x3: string
  stoaMobile3x4: string
  coverAlt: string
  stoaAlt: string
  coverFocalPoint?: { x: number; y: number }
  stoaFocalPoint?: { x: number; y: number }
}

export interface TomeBookVisualBible {
  slug: string
  title: string
  author: string
  templateFamily: TomeTemplateFamily
  archetypeLabel: string
  artistPrinciple: string
  description: string
  accent: string
  palette: string[]
  assets: TomeVisualAssetSet
}

const assetPath = (slug: string, fileName: string) =>
  `/living-archive/assets/${slug}/${fileName}`

function assetsFor(
  slug: string,
  coverAlt: string,
  stoaAlt: string,
  coverFocalPoint: { x: number; y: number },
  stoaFocalPoint: { x: number; y: number }
): TomeVisualAssetSet {
  return {
    coverMaster2x3: assetPath(slug, "cover-master-2x3.webp"),
    coverApp3x4: assetPath(slug, "cover-app-3x4.webp"),
    coverSquare: assetPath(slug, "cover-square.webp"),
    coverThumbnail: assetPath(slug, "cover-thumbnail-96x144.png"),
    stoaDesktop16x9: assetPath(slug, "stoa-desktop-16x9.webp"),
    stoaTablet4x3: assetPath(slug, "stoa-tablet-4x3.webp"),
    stoaMobile3x4: assetPath(slug, "stoa-mobile-3x4.webp"),
    coverAlt,
    stoaAlt,
    coverFocalPoint,
    stoaFocalPoint,
  }
}

function templateFamilyFromBible(bible: BookVisualBible): TomeTemplateFamily {
  if (bible.coverArchetype.includes("horizon")) return "horizon"
  if (bible.coverArchetype.includes("threshold") || bible.coverArchetype.includes("window")) return "threshold"
  if (bible.coverArchetype.includes("ascent")) return "ascent"
  if (bible.coverArchetype.includes("constellation")) return "constellation"
  return "emblem"
}

function livingArchiveBookFromBible(bible: BookVisualBible): TomeBookVisualBible {
  const assets = getMonumentalLiteraryPathsAssets(bible.bookId)
  if (!assets) {
    throw new Error(`Missing Monumental Literary Paths assets for ${bible.bookId}`)
  }

  return {
    slug: bible.slug,
    title: bible.title,
    author: bible.author,
    templateFamily: templateFamilyFromBible(bible),
    archetypeLabel: bible.coverArchetype,
    artistPrinciple: `${bible.heroSymbol}; ${bible.pathGeometry}.`,
    description: bible.centralConflict ?? bible.environment,
    accent: bible.paletteHex[4] ?? bible.paletteHex[2] ?? "#D2A86A",
    palette: bible.paletteHex,
    assets,
  }
}

const TOME_LIVING_ARCHIVE_PILOT_BOOKS: TomeBookVisualBible[] = [
  {
    slug: "macbeth",
    title: "Macbeth",
    author: "William Shakespeare",
    templateFamily: "emblem",
    archetypeLabel: "Emblem / Relic",
    artistPrinciple:
      "Old-master light hierarchy reduced to one crown, one blade, and one red moon.",
    description:
      "Prophecy, regicide, and conscience gather into a single ceremonial field of crown, blade, moon, and moor.",
    accent: "#D9A03C",
    palette: ["#171B26", "#21304B", "#D9A03C", "#AE4656", "#33584C"],
    assets: assetsFor(
      "macbeth",
      "A gold crown balances above a silver dagger beneath a red moon, with a raven, thorn branches, and a dark castle on the moor.",
      "Storm bands cross a moonlit moor toward dark battlements lit by three small torches.",
      { x: 50, y: 42 },
      { x: 68, y: 48 }
    ),
  },
  {
    slug: "moby-dick",
    title: "Moby-Dick",
    author: "Herman Melville",
    templateFamily: "horizon",
    archetypeLabel: "Horizon / Negative Space",
    artistPrinciple:
      "Restrained negative space and immense scale, with a tiny vessel against one overwhelming white curve.",
    description:
      "Ahab's ocean becomes a field of scale: a small human vessel held against an overwhelming white presence.",
    accent: "#D9A03C",
    palette: ["#21304B", "#5C7AA6", "#3E7B72", "#F2EAD8", "#D9A03C"],
    assets: assetsFor(
      "moby-dick",
      "A tiny mast and harpoon float beside the immense white curve of a whale beneath a navy star chart.",
      "A small sailboat crosses layered blue-green waves above a submerged whale-shaped shadow under a field of stars.",
      { x: 58, y: 56 },
      { x: 66, y: 58 }
    ),
  },
  {
    slug: "alices-adventures-in-wonderland",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    templateFamily: "constellation",
    archetypeLabel: "Constellation / Cabinet",
    artistPrinciple:
      "Playful scale shifts organized by a disciplined orbit and modular editorial grid.",
    description:
      "Wonderland's objects orbit in measured disorder, with nonsense treated as a catalog of precise little impossibilities.",
    accent: "#E2684A",
    palette: ["#A9A3CC", "#F2EAD8", "#E2684A", "#D9A03C", "#7C5A77"],
    assets: assetsFor(
      "alices-adventures-in-wonderland",
      "A pocket watch, key, tiny door, teacup, playing card, checker path, and mushroom orbit on a pale lavender field.",
      "A surreal corridor of differently sized doors, mushrooms, stepping stones, and a long tea table in pale lavender light.",
      { x: 50, y: 47 },
      { x: 57, y: 55 }
    ),
  },
]

const generatedBooks = getMonumentalLiteraryPathsBooks()
  .filter((book) => hasCompleteMonumentalLiteraryPathsPack(book.bookId))
  .map(livingArchiveBookFromBible)
const pilotSlugs = new Set(TOME_LIVING_ARCHIVE_PILOT_BOOKS.map((book) => book.slug))

export const TOME_LIVING_ARCHIVE_BOOKS: TomeBookVisualBible[] = [
  ...generatedBooks,
  ...TOME_LIVING_ARCHIVE_PILOT_BOOKS.filter((book) => !generatedBooks.some((item) => item.slug === book.slug)),
]

export const TOME_LIVING_ARCHIVE_DEFAULT_SLUG = "the-republic"

export function getLivingArchiveBooks(): TomeBookVisualBible[] {
  return TOME_LIVING_ARCHIVE_BOOKS
}

export function getLivingArchiveBookBySlug(
  slug: string
): TomeBookVisualBible | undefined {
  return TOME_LIVING_ARCHIVE_BOOKS.find((book) => book.slug === slug)
}

export function isLivingArchivePilotBook(slug: string): boolean {
  return pilotSlugs.has(slug)
}
