import { readFile } from "node:fs/promises"
import { z } from "zod"

export const DEFAULT_IMAGEN_MODELS = {
  draft: "imagen-4.0-fast-generate-001",
  production: "imagen-4.0-generate-001",
  featured: "imagen-4.0-ultra-generate-001",
} as const

const ConfigSchema = z.object({
  transport: z.enum(["vertex", "genai"]).default("vertex"),
  draftModel: z.string().default(DEFAULT_IMAGEN_MODELS.draft),
  productionModel: z.string().default(DEFAULT_IMAGEN_MODELS.production),
  featuredModel: z.string().default(DEFAULT_IMAGEN_MODELS.featured),
  aspectRatio: z.literal("3:4").default("3:4"),
  productionImageSize: z.string().default("2K"),
  candidatesPerBook: z.coerce.number().int().min(1).max(4).default(2),
  personGeneration: z.string().default("allow_adult"),
  allowPaidGeneration: z.coerce.boolean().default(false),
  googleCloudProject: z.string().optional(),
  googleCloudLocation: z.string().default("us-central1"),
  googleApplicationCredentials: z.string().optional(),
  googleServiceAccountJson: z.string().optional(),
  googleApiKey: z.string().optional(),
  modelRetirementDate: z.string().optional(),
  modelDeprecationDate: z.string().optional(),
  concurrency: z.coerce.number().int().positive().default(2),
  requestsPerMinute: z.coerce.number().int().positive().default(30),
  maxRetries: z.coerce.number().int().min(0).default(3),
  dailyBudgetUsd: z.coerce.number().nonnegative().default(0),
  estimatedCostPerImageUsd: z.coerce.number().nonnegative().default(0),
  requireLargeBatchConfirmation: z.coerce.boolean().default(true),
  largeBatchThreshold: z.coerce.number().int().positive().default(100),
})

export type CoverFactoryConfig = z.infer<typeof ConfigSchema>

export function readCoverFactoryConfig(env: NodeJS.ProcessEnv = process.env): CoverFactoryConfig {
  return ConfigSchema.parse({
    transport: env.IMAGEN_TRANSPORT,
    draftModel: env.IMAGEN_DRAFT_MODEL,
    productionModel: env.IMAGEN_PRODUCTION_MODEL,
    featuredModel: env.IMAGEN_FEATURED_MODEL,
    aspectRatio: env.IMAGEN_ASPECT_RATIO,
    productionImageSize: env.IMAGEN_PRODUCTION_IMAGE_SIZE,
    candidatesPerBook: env.IMAGEN_CANDIDATES_PER_BOOK,
    personGeneration: env.IMAGEN_PERSON_GENERATION,
    allowPaidGeneration: env.IMAGEN_ALLOW_PAID_GENERATION ?? env.COVER_ALLOW_PAID_GENERATION,
    googleCloudProject: env.GOOGLE_CLOUD_PROJECT,
    googleCloudLocation: env.GOOGLE_CLOUD_LOCATION,
    googleApplicationCredentials: env.GOOGLE_APPLICATION_CREDENTIALS,
    googleServiceAccountJson: env.GOOGLE_SERVICE_ACCOUNT_JSON,
    googleApiKey: env.GOOGLE_API_KEY,
    modelRetirementDate: env.IMAGEN_MODEL_RETIREMENT_DATE,
    modelDeprecationDate: env.IMAGEN_MODEL_DEPRECATION_DATE,
    concurrency: env.COVER_GENERATION_CONCURRENCY,
    requestsPerMinute: env.COVER_REQUESTS_PER_MINUTE,
    maxRetries: env.COVER_MAX_RETRIES,
    dailyBudgetUsd: env.COVER_DAILY_BUDGET_USD,
    estimatedCostPerImageUsd: env.COVER_ESTIMATED_COST_PER_IMAGE_USD,
    requireLargeBatchConfirmation: env.COVER_REQUIRE_LARGE_BATCH_CONFIRMATION,
    largeBatchThreshold: env.COVER_LARGE_BATCH_THRESHOLD,
  })
}

export function hasGoogleCredentials(config: CoverFactoryConfig): boolean {
  if (config.transport === "genai") return Boolean(config.googleApiKey)
  return Boolean(
    config.googleServiceAccountJson ||
      config.googleApplicationCredentials ||
      process.env.GOOGLE_ACCESS_TOKEN ||
      process.env.GCE_METADATA_HOST,
  )
}

export function selectImagenModel(config: CoverFactoryConfig, mode: "concept" | "production" | "featured"): string {
  if (mode === "concept") return config.draftModel
  if (mode === "featured") return config.featuredModel
  return config.productionModel
}

export async function readServiceAccountJson(config: CoverFactoryConfig): Promise<string | undefined> {
  if (config.googleServiceAccountJson) return config.googleServiceAccountJson
  if (config.googleApplicationCredentials) {
    return readFile(config.googleApplicationCredentials, "utf8")
  }
  return undefined
}

export function redactSecret(value: string | undefined): string | undefined {
  if (!value) return undefined
  if (value.length <= 8) return "[redacted]"
  return `${value.slice(0, 4)}...[redacted]...${value.slice(-4)}`
}
