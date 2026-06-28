import { z } from "zod"
import { COMPOSITION_FAMILIES } from "../compositions/library"
import { COVER_PALETTES, COVER_STYLE_VERSION, COVER_TEXTURE_PROFILES } from "../styles/palettes"

export const COVER_BRIEF_SCHEMA_VERSION = "cover-brief.v2.0.0" as const
export const IMAGEN_PROMPT_VERSION = "imagen-prompt.v2.1.0" as const

const compositionIds = COMPOSITION_FAMILIES.map((family) => family.id) as [
  (typeof COMPOSITION_FAMILIES)[number]["id"],
  ...(typeof COMPOSITION_FAMILIES)[number]["id"][],
]
const paletteIds = COVER_PALETTES.map((palette) => palette.id) as [
  (typeof COVER_PALETTES)[number]["id"],
  ...(typeof COVER_PALETTES)[number]["id"][],
]

export const LightModeSchema = z.enum(["daylight", "dusk", "night", "interior", "abstract-light"])
export const HorizonPositionSchema = z.enum(["low", "middle", "high"])
export const NegativeSpaceRegionSchema = z.enum(["top", "bottom", "left", "right", "center", "split"])
export const TitleSafeRegionSchema = z.enum(["upper-field", "lower-field", "left-field", "right-field", "archive-band", "art-only"])
export const GenerationModeSchema = z.enum(["concept", "production", "featured"])
export const ProviderNameSchema = z.enum(["google-imagen", "mock-cover"])
export const JobLifecycleSchema = z.enum([
  "draft",
  "brief_pending",
  "brief_ready",
  "approved_for_generation",
  "queued",
  "claimed",
  "generating",
  "source_received",
  "processing",
  "candidates_ready",
  "auto_reviewed",
  "needs_review",
  "approved",
  "rejected",
  "composing",
  "ready_to_publish",
  "published",
  "paused",
  "cancelled",
  "retry_scheduled",
  "failed",
  "dead_letter",
  "superseded",
  "provider_unavailable",
  "budget_paused",
])

export const SourceBookMetadataSchema = z.object({
  bookId: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  author: z.string().min(1),
  originalLanguage: z.string().optional(),
  synopsis: z.string().max(1800).optional(),
  genre: z.string().optional(),
  subgenre: z.string().optional(),
  historicalEra: z.string().optional(),
  geographicalSetting: z.string().optional(),
  themes: z.array(z.string().min(1)).max(12).default([]),
})

export const SemanticVisualInterpretationSchema = z.object({
  emotionalTone: z.array(z.string().min(1)).max(6),
  centralConflict: z.string().min(1).max(280),
  philosophicalTension: z.string().max(280).optional(),
  transformation: z.string().max(280).optional(),
  storyScale: z.enum(["intimate", "social", "historical", "mythic", "cosmic"]),
  principalVisualMetaphor: z.string().min(1).max(160),
  heroMotif: z.string().min(1).max(120),
  secondaryMotifs: z.array(z.string().min(1).max(80)).max(2).default([]),
  narrativeVector: z.string().min(1).max(80),
  bookSpecificAvoidList: z.array(z.string().min(1).max(120)).max(12).default([]),
  internalRationale: z.string().min(1).max(600),
})

export const ArtDirectionSelectionSchema = z.object({
  compositionFamily: z.enum(compositionIds),
  compositionVariant: z.string().min(1),
  paletteMode: z.enum(paletteIds),
  textureProfile: z.enum(COVER_TEXTURE_PROFILES),
  lightMode: LightModeSchema,
  horizonPosition: HorizonPositionSchema,
  negativeSpaceRegion: NegativeSpaceRegionSchema,
  scaleRelationship: z.string().min(1).max(160),
  figureCount: z.number().int().min(0).max(3),
  figurePlacement: z.string().max(160),
  celestialElement: z.string().max(80).optional(),
  architectureType: z.string().max(100).optional(),
  waterPresence: z.boolean().default(false),
  titleSafeRegion: TitleSafeRegionSchema,
  cropSafetyInstructions: z.string().max(240),
  titlePlacementRecommendation: z.string().max(160),
  authorPlacementRecommendation: z.string().max(160),
})

export const ImagenRequestConfigSchema = z.object({
  provider: ProviderNameSchema,
  transport: z.enum(["vertex", "genai", "mock"]),
  generationMode: GenerationModeSchema,
  modelId: z.string().min(1),
  aspectRatio: z.literal("3:4"),
  imageSize: z.string().default("2K"),
  candidateCount: z.number().int().min(1).max(4),
  personGeneration: z.string().default("allow_adult"),
  allowPaidGeneration: z.boolean().default(false),
  idempotencyKey: z.string().min(1),
})

export const ImagenPromptSnapshotSchema = z.object({
  promptVersion: z.literal(IMAGEN_PROMPT_VERSION),
  finalPrompt: z.string().min(1),
  estimatedTokens: z.number().int().positive(),
  promptHash: z.string().min(32),
  substitutedFields: z.record(z.string(), z.string()),
})

export const GeneratedCandidateSchema = z.object({
  candidateId: z.string().min(1),
  jobId: z.string().min(1),
  provider: ProviderNameSchema,
  modelId: z.string().min(1),
  sourceAssetPath: z.string().min(1),
  masterAssetPath: z.string().optional(),
  derivativePaths: z.record(z.string(), z.string()).default({}),
  cropRect: z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).optional(),
  promptHash: z.string().min(32),
  createdAt: z.string(),
})

export const QAResultSchema = z.object({
  structural: z.object({ pass: z.boolean(), reasons: z.array(z.string()) }),
  typography: z.object({ pass: z.boolean(), confidence: z.number().min(0).max(1), reasons: z.array(z.string()) }),
  cropSafety: z.object({ pass: z.boolean(), reasons: z.array(z.string()) }),
  palette: z.object({ pass: z.boolean(), score: z.number().min(0).max(1), reasons: z.array(z.string()) }),
  composition: z.object({ pass: z.boolean(), score: z.number().min(0).max(1), reasons: z.array(z.string()) }),
  thumbnail: z.object({ pass: z.boolean(), score: z.number().min(0).max(1), reasons: z.array(z.string()) }),
  style: z.record(z.string(), z.object({ score: z.number().min(0).max(1), reason: z.string() })),
  duplicate: z.object({ pass: z.boolean(), reasons: z.array(z.string()), nearestReferenceId: z.string().optional() }),
})

export const HumanReviewSchema = z.object({
  state: z.enum(["unreviewed", "approved", "rejected", "changes_requested"]),
  reviewerId: z.string().optional(),
  notes: z.string().max(1000).optional(),
  reviewedAt: z.string().optional(),
})

export const TypographicRenderingSchema = z.object({
  template: z.enum(["open-sky-top", "quiet-bottom", "vertical-edge", "archive-band", "art-only"]),
  titleLines: z.array(z.string()).max(4),
  authorLine: z.string(),
  compositeAssetPath: z.string().optional(),
  contrastRatio: z.number().optional(),
  overflow: z.boolean().default(false),
})

export const PublicationSchema = z.object({
  state: z.enum(["unpublished", "published", "superseded", "rolled_back"]),
  version: z.number().int().min(0),
  publishedAssetPath: z.string().optional(),
  publishedAt: z.string().optional(),
  supersedesPublicationId: z.string().optional(),
})

export const CoverBriefSchema = z.object({
  schemaVersion: z.literal(COVER_BRIEF_SCHEMA_VERSION).default(COVER_BRIEF_SCHEMA_VERSION),
  styleVersion: z.literal(COVER_STYLE_VERSION).default(COVER_STYLE_VERSION),
  promptVersion: z.literal(IMAGEN_PROMPT_VERSION).default(IMAGEN_PROMPT_VERSION),
  source: SourceBookMetadataSchema,
  semantic: SemanticVisualInterpretationSchema,
  artDirection: ArtDirectionSelectionSchema,
  imagenPrompt: ImagenPromptSnapshotSchema.optional(),
  imagenRequest: ImagenRequestConfigSchema.optional(),
  candidates: z.array(GeneratedCandidateSchema).default([]),
  qaResults: z.array(QAResultSchema).default([]),
  review: HumanReviewSchema.default({ state: "unreviewed" }),
  typography: TypographicRenderingSchema.optional(),
  publication: PublicationSchema.default({ state: "unpublished", version: 0 }),
  editorOverrides: z.record(z.string(), z.unknown()).default({}),
  lockedFields: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  provenance: z.object({
    createdBy: z.string().default("cover-factory"),
    batchId: z.string().optional(),
    sourceHash: z.string().optional(),
  }),
})

export type CoverBrief = z.infer<typeof CoverBriefSchema>
export type SourceBookMetadata = z.infer<typeof SourceBookMetadataSchema>
export type ArtDirectionSelection = z.infer<typeof ArtDirectionSelectionSchema>
export type ImagenRequestConfig = z.infer<typeof ImagenRequestConfigSchema>
