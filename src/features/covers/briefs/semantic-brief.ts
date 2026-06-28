import { createHash } from "node:crypto"
import { BOOKS, type TomeBook } from "@/data/books"
import { COMPOSITION_FAMILIES, type CompositionFamilyId } from "../compositions/library"
import { type CoverBrief, COVER_BRIEF_SCHEMA_VERSION, IMAGEN_PROMPT_VERSION } from "../schemas/cover-brief"
import { COVER_PALETTES, COVER_STYLE_VERSION, type CoverPaletteId, type CoverTextureProfile } from "../styles/palettes"
import { buildImagenPrompt } from "../prompts/imagen-prompt"
import { readCoverFactoryConfig, selectImagenModel } from "../providers/config"

export interface SemanticBriefGenerator {
  generate(book: TomeBook, options?: { batchSeed?: string; lockedFamily?: CompositionFamilyId }): CoverBrief
}

const themeToFamily: Array<{ match: RegExp; family: CompositionFamilyId }> = [
  { match: /sea|voyage|return|homecoming|adventure|island|ship|shore|harbor/i, family: "shore-and-vessel" },
  { match: /justice|state|law|power|revolution|class|political|education|philosophy|civic/i, family: "civic-axis" },
  { match: /knowledge|revelation|freedom|constraint|temptation|threshold|secret/i, family: "open-threshold" },
  { match: /garden|courtship|society|social|domestic|marriage|manners/i, family: "garden-approach-light" },
  { match: /nature|wilderness|origin|species|flower|leaf|tree|pastoral|season/i, family: "botanical-monument" },
  { match: /room|interior|letter|mirror|private|family|psychological/i, family: "interior-light-vector" },
  { match: /gothic|isolation|horror|madness|fear|shelter|cabin|house/i, family: "solitary-dwelling-day" },
  { match: /war|wrath|honor|glory|battle|mortality|memory/i, family: "quiet-emblem-field" },
  { match: /storm|snow|fire|wave|catastrophe|wind|machine|future/i, family: "elemental-force-light" },
  { match: /satire|comic|delusion|quest|pilgrimage|journey/i, family: "luminous-path" },
]

export class DeterministicSemanticBriefGenerator implements SemanticBriefGenerator {
  generate(book: TomeBook, options: { batchSeed?: string; lockedFamily?: CompositionFamilyId } = {}): CoverBrief {
    const family = options.lockedFamily ?? chooseFamily(book, options.batchSeed ?? "tome")
    const composition = COMPOSITION_FAMILIES.find((item) => item.id === family) ?? COMPOSITION_FAMILIES[0]
    const variant = composition.variants[hashInt(`${book.id}:variant:${options.batchSeed ?? ""}`) % composition.variants.length]
    const paletteMode = choosePalette(book, family)
    const textureProfile = chooseTexture(book.id)
    const now = new Date().toISOString()
    const config = readCoverFactoryConfig()
    const mode = book.featured ? "featured" : "production"

    const draft: CoverBrief = {
      schemaVersion: COVER_BRIEF_SCHEMA_VERSION,
      styleVersion: COVER_STYLE_VERSION,
      promptVersion: IMAGEN_PROMPT_VERSION,
      source: {
        bookId: book.id,
        title: book.title,
        author: book.author,
        originalLanguage: book.language,
        synopsis: book.synopsis,
        genre: book.genres[0],
        subgenre: book.genres[1],
        historicalEra: book.era,
        geographicalSetting: book.country,
        themes: book.themes,
      },
      semantic: {
        emotionalTone: inferTone(book),
        centralConflict: truncate(book.synopsis, 260),
        philosophicalTension: inferTension(book),
        transformation: inferTransformation(book),
        storyScale: inferScale(book),
        principalVisualMetaphor: inferMetaphor(book, family),
        heroMotif: inferHeroMotif(book, family),
        secondaryMotifs: inferSecondaryMotifs(book).slice(0, 2),
        narrativeVector: composition.allowedNarrativeVectors[0] ?? "threshold",
        bookSpecificAvoidList: [
          "literal title-word illustration",
          "detailed human likenesses",
          "crowded plot collage",
          "ethnic or historical stereotypes",
        ],
        internalRationale: `${book.title} is assigned to ${composition.label} because its themes emphasize ${book.themes.slice(0, 3).join(", ") || "symbolic tension"}.`,
      },
      artDirection: {
        compositionFamily: composition.id,
        compositionVariant: variant.id,
        paletteMode,
        textureProfile,
        lightMode: composition.id === "interior-light-vector" ? "interior" : "daylight",
        horizonPosition: composition.recommendedHorizon === "variable" ? "middle" : composition.recommendedHorizon,
        negativeSpaceRegion: composition.negativeSpaceRegion,
        scaleRelationship: "One dominant symbol or place dwarfs the human counterpoint.",
        figureCount: Math.min(composition.figureCountRange[1], book.genres.some((genre) => /dialogue|philosophy/i.test(genre)) ? 1 : composition.figureCountRange[0]),
        figurePlacement: composition.figurePlacement,
        celestialElement: composition.optionalCelestialElements[0],
        architectureType: composition.id.includes("civic") || composition.id.includes("approach") || composition.id.includes("threshold") || composition.id.includes("dwelling") ? "simplified light architecture" : undefined,
        waterPresence: composition.allowedNarrativeVectors.some((vector) => /sea|wake|current|river|water|shore/i.test(vector)),
        titleSafeRegion: composition.titleSafeRecommendation.toLowerCase().includes("upper") ? "upper-field" : "archive-band",
        cropSafetyInstructions: "Keep all essential content inside the central eighty-six percent width for the 3:4 to 2:3 crop.",
        titlePlacementRecommendation: composition.titleSafeRecommendation,
        authorPlacementRecommendation: "Place author below title with smaller deterministic type.",
      },
      candidates: [],
      qaResults: [],
      review: { state: "unreviewed" },
      publication: { state: "unpublished", version: 0 },
      editorOverrides: {},
      lockedFields: [],
      createdAt: now,
      updatedAt: now,
      provenance: {
        createdBy: "deterministic-semantic-brief-generator",
        sourceHash: createHash("sha256").update(`${book.id}:${book.title}:${book.author}`).digest("hex"),
      },
      imagenRequest: {
        provider: config.allowPaidGeneration ? "google-imagen" : "mock-cover",
        transport: config.allowPaidGeneration ? config.transport : "mock",
        generationMode: mode,
        modelId: selectImagenModel(config, mode),
        aspectRatio: "3:4",
        imageSize: config.productionImageSize,
        candidateCount: mode === "featured" ? Math.min(4, config.candidatesPerBook) : config.candidatesPerBook,
        personGeneration: config.personGeneration,
        allowPaidGeneration: config.allowPaidGeneration,
        idempotencyKey: createHash("sha256").update(`${book.id}:${COVER_STYLE_VERSION}:${options.batchSeed ?? "tome"}`).digest("hex"),
      },
    }

    return {
      ...draft,
      imagenPrompt: buildImagenPrompt(draft),
    }
  }
}

export function developmentFixtureBooks(): TomeBook[] {
  const ids = [
    "the-odyssey",
    "pride-and-prejudice",
    "frankenstein",
    "the-republic",
    "walden",
    "the-secret-garden",
    "treasure-island",
    "a-dolls-house",
    "the-picture-of-dorian-gray",
    "leaves-of-grass",
    "middlemarch",
    "the-tempest",
  ]
  return ids.map((id) => BOOKS.find((book) => book.id === id)).filter((book): book is TomeBook => Boolean(book))
}

function chooseFamily(book: TomeBook, seed: string): CompositionFamilyId {
  const haystack = `${book.title} ${book.genres.join(" ")} ${book.themes.join(" ")} ${book.synopsis}`
  const mapped = themeToFamily.find((item) => item.match.test(haystack))
  if (mapped) return mapped.family
  return COMPOSITION_FAMILIES[hashInt(`${book.id}:${seed}`) % COMPOSITION_FAMILIES.length].id
}

function choosePalette(book: TomeBook, family: CompositionFamilyId): CoverPaletteId {
  const text = `${book.genres.join(" ")} ${book.themes.join(" ")} ${book.synopsis}`.toLowerCase()
  if (/sea|voyage|home|island|ship|shore|harbor/.test(text)) return "sea-glass-day"
  if (/justice|knowledge|state|law|philosophy|political|education/.test(text)) return "civic-stone-light"
  if (/garden|courtship|society|domestic|marriage|romance/.test(text)) return "clay-rose-garden"
  if (/nature|wilderness|origin|species|tree|leaf|field|pastoral/.test(text)) return "luminous-ivory-sage"
  if (/poetry|beauty|divine|soul|love/.test(text)) return "clear-sky-parchment"
  if (/gothic|horror|fear|storm|snow|fire|catastrophe/.test(text)) return "snowfield-ember-light"
  if (/satire|comic|quest|delusion/.test(text)) return "wheat-and-celadon"
  const allowed = COMPOSITION_FAMILIES.find((item) => item.id === family)?.allowedPaletteModes ?? COVER_PALETTES.map((item) => item.id)
  return allowed[hashInt(`${book.id}:palette`) % allowed.length]
}

function chooseTexture(bookId: string): CoverTextureProfile {
  const profiles: CoverTextureProfile[] = ["soft-lithograph", "cut-paper-linocut", "restrained-screenprint", "mineral-stipple", "matte-overprint"]
  return profiles[hashInt(bookId) % profiles.length]
}

function inferTone(book: TomeBook): string[] {
  const lower = `${book.genres.join(" ")} ${book.themes.join(" ")}`.toLowerCase()
  if (lower.includes("comedy") || lower.includes("satire")) return ["wry", "open", "brightly ironic"]
  if (lower.includes("war") || lower.includes("tragedy")) return ["grave", "sunlit", "restrained"]
  if (lower.includes("romance")) return ["yearning", "calm", "luminous"]
  if (lower.includes("philosophy")) return ["lucid", "civic", "searching"]
  return ["calm", "literary", "luminous"]
}

function inferTension(book: TomeBook): string {
  return book.themes.slice(0, 2).join(" against ") || "private desire against the larger world"
}

function inferTransformation(book: TomeBook): string {
  if (/return|home/i.test(book.themes.join(" "))) return "A long movement from estrangement toward home."
  if (/knowledge|education|justice/i.test(book.themes.join(" "))) return "A movement from shadow toward understanding."
  return "A central pressure changes the scale at which the reader understands the world."
}

function inferScale(book: TomeBook): CoverBrief["semantic"]["storyScale"] {
  if (book.genres.some((genre) => /epic|mythology/i.test(genre))) return "mythic"
  if (book.genres.some((genre) => /philosophy|spiritual/i.test(genre))) return "cosmic"
  if (book.genres.some((genre) => /novel|social/i.test(genre))) return "social"
  return "historical"
}

function inferMetaphor(book: TomeBook, family: CompositionFamilyId): string {
  if (family === "luminous-path") return "a sunlit path crossing a quiet field toward a small destination"
  if (family === "quiet-emblem-field") return "one calm oversized emblem carrying the book's pressure"
  if (family === "open-threshold") return "an open threshold drawing the reader from enclosure into light"
  if (family === "shore-and-vessel") return "a pale shore or vessel route moving across open water"
  if (family === "garden-approach-light") return "a soft garden approach organizing private feeling and social distance"
  if (family === "solitary-dwelling-day") return "one bright dwelling set against a generous quiet field"
  if (family === "botanical-monument") return "one natural form enlarged into a literary monument"
  if (family === "civic-axis") return "a daylight civic axis arranged around inquiry, law, and passage"
  if (family === "interior-light-vector") return "a room edge or window light turning private conflict into a path"
  if (family === "elemental-force-light") return "a daylight natural force bending the cover without dark spectacle"
  if (family === "framed-revelation") return "a threshold opening onto a clearer world"
  if (family === "luminous-sea-route") return "a bright current crossing open water toward a distant destination"
  if (family === "monumental-emblem") return "an oversized emblem bearing the pressure of history"
  if (family === "cosmic-ascent") return "a terraced ascent from obscurity toward radiance"
  return `a ${family.replaceAll("-", " ")} expressing ${book.themes[0] ?? "transformation"}`
}

function inferHeroMotif(book: TomeBook, family: CompositionFamilyId): string {
  if (family === "luminous-path") return "a single sunlit road, stream, furrow, or beam through quiet negative space"
  if (family === "quiet-emblem-field") return "one oversized symbol in a breathable light field"
  if (family === "open-threshold") return "one open door, window, gate, or stage gap with light beyond"
  if (family === "shore-and-vessel") return "one small vessel, sail, shore, wake, or harbor route in daylight"
  if (family === "garden-approach-light") return "a garden walk, hedge axis, estate road, or orchard path"
  if (family === "solitary-dwelling-day") return "one house, cabin, room, tent, or civic wall in daylight"
  if (family === "botanical-monument") return "one plant, branch, leaf, field, or natural trace made monumental"
  if (family === "civic-axis") return "columns, plaza, road, school, courthouse, or public wall in open daylight"
  if (family === "interior-light-vector") return "a window, lamp, table, mirror, or letterless page shape crossed by light"
  if (family === "elemental-force-light") return "wind, snow, wave, fire, rain, migration, or mountain in pale daylight"
  if (family === "windmill-procession") return "repeated wind-driven structures dwarfing a small procession"
  if (family === "estate-approach") return "a formal approach to a distant social house"
  if (family === "isolated-dwelling") return "one lit dwelling within an overwhelming landscape"
  return inferMetaphor(book, family)
}

function inferSecondaryMotifs(book: TomeBook): string[] {
  return book.themes.slice(0, 2).map((theme) => theme.toLowerCase())
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1).trim()}.`
}

function hashInt(value: string): number {
  return createHash("sha256").update(value).digest().readUInt32BE(0)
}
