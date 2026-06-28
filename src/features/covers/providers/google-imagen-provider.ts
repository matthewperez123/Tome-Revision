import { createHash, createSign } from "node:crypto"
import type {
  GeneratedImageCandidate,
  ImageGenerationProvider,
  ImagenImageRequest,
  ImagenModelLifecycle,
  ProviderHealth,
} from "./types"
import {
  hasGoogleCredentials,
  readCoverFactoryConfig,
  readServiceAccountJson,
  selectImagenModel,
  type CoverFactoryConfig,
} from "./config"

interface ServiceAccount {
  client_email: string
  private_key: string
  token_uri?: string
}

const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform"

function base64url(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url")
}

function nowIso() {
  return new Date().toISOString()
}

function lifecycleFor(modelId: string, config: CoverFactoryConfig): ImagenModelLifecycle {
  const retirementDate = config.modelRetirementDate
  const deprecationDate = config.modelDeprecationDate
  const today = Date.now()
  const retireTime = retirementDate ? Date.parse(retirementDate) : Number.NaN
  const warning = Number.isFinite(retireTime) && retireTime - today < 1000 * 60 * 60 * 24 * 90
    ? `Imagen model ${modelId} is within 90 days of configured retirement date ${retirementDate}.`
    : undefined

  return {
    modelId,
    configuredAt: nowIso(),
    retirementDate,
    deprecationDate,
    replacementPlan: "Migrate by changing IMAGEN_*_MODEL after editorial/style QA. Do not switch to non-Imagen production art.",
    warning,
  }
}

export class GoogleImagenProvider implements ImageGenerationProvider {
  readonly name = "google-imagen" as const
  private readonly config: CoverFactoryConfig

  constructor(config: CoverFactoryConfig = readCoverFactoryConfig()) {
    this.config = config
  }

  async validateStartup(): Promise<ProviderHealth> {
    const modelId = selectImagenModel(this.config, "production")
    if (!hasGoogleCredentials(this.config)) {
      return {
        provider: this.name,
        available: false,
        mode: "real",
        transport: this.config.transport,
        modelId,
        lifecycle: lifecycleFor(modelId, this.config),
        error: "Google Imagen credentials are unavailable; deterministic mock mode must be used.",
      }
    }
    if (!this.config.allowPaidGeneration) {
      return {
        provider: this.name,
        available: false,
        mode: "real",
        transport: this.config.transport,
        modelId,
        lifecycle: lifecycleFor(modelId, this.config),
        warning: "Paid Imagen generation is disabled by configuration.",
      }
    }
    return this.healthCheck()
  }

  async healthCheck(): Promise<ProviderHealth> {
    const modelId = selectImagenModel(this.config, "production")
    try {
      if (this.config.transport === "vertex") {
        await this.getAccessToken()
      } else if (!this.config.googleApiKey) {
        throw new Error("GOOGLE_API_KEY is required for the Gen AI Imagen transport.")
      }
      const lifecycle = lifecycleFor(modelId, this.config)
      return {
        provider: this.name,
        available: true,
        mode: "real",
        transport: this.config.transport,
        modelId,
        lifecycle,
        warning: lifecycle.warning,
      }
    } catch (error) {
      return {
        provider: this.name,
        available: false,
        mode: "real",
        transport: this.config.transport,
        modelId,
        lifecycle: lifecycleFor(modelId, this.config),
        error: error instanceof Error ? error.message : "Unknown Imagen provider health-check failure.",
      }
    }
  }

  async generateImages(request: ImagenImageRequest): Promise<GeneratedImageCandidate[]> {
    if (!this.config.allowPaidGeneration || !request.config.allowPaidGeneration) {
      throw new Error("Paid Imagen generation is disabled. Set IMAGEN_ALLOW_PAID_GENERATION and COVER_ALLOW_PAID_GENERATION explicitly.")
    }
    if (!hasGoogleCredentials(this.config)) {
      throw new Error("Google Imagen credentials are unavailable. Generation fails closed.")
    }
    if (!request.config.modelId.includes("imagen")) {
      throw new Error(`Configured model ${request.config.modelId} is not an Imagen model.`)
    }

    return this.config.transport === "vertex"
      ? this.generateViaVertex(request)
      : this.generateViaGenAi(request)
  }

  private async generateViaVertex(request: ImagenImageRequest): Promise<GeneratedImageCandidate[]> {
    if (!this.config.googleCloudProject) {
      throw new Error("GOOGLE_CLOUD_PROJECT is required for Vertex AI Imagen transport.")
    }

    const token = await this.getAccessToken()
    const endpoint =
      `https://${this.config.googleCloudLocation}-aiplatform.googleapis.com/v1/projects/` +
      `${this.config.googleCloudProject}/locations/${this.config.googleCloudLocation}/publishers/google/models/` +
      `${request.config.modelId}:predict`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [{ prompt: request.prompt }],
        parameters: {
          sampleCount: request.config.candidateCount,
          aspectRatio: request.config.aspectRatio,
          personGeneration: request.config.personGeneration,
          outputOptions: {
            mimeType: "image/png",
            imageSize: request.config.imageSize,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Imagen Vertex request failed with ${response.status}: ${await safeErrorText(response)}`)
    }

    const data = await response.json() as { predictions?: Array<{ bytesBase64Encoded?: string; mimeType?: string }> }
    return normalizeCandidates(data.predictions ?? [], request)
  }

  private async generateViaGenAi(request: ImagenImageRequest): Promise<GeneratedImageCandidate[]> {
    if (!this.config.googleApiKey) {
      throw new Error("GOOGLE_API_KEY is required for Gen AI Imagen transport.")
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${request.config.modelId}:generateImages?key=${encodeURIComponent(this.config.googleApiKey)}`
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: request.prompt,
        config: {
          numberOfImages: request.config.candidateCount,
          aspectRatio: request.config.aspectRatio,
          personGeneration: request.config.personGeneration,
          outputMimeType: "image/png",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Imagen Gen AI request failed with ${response.status}: ${await safeErrorText(response)}`)
    }

    const data = await response.json() as { generatedImages?: Array<{ image?: { imageBytes?: string; mimeType?: string } }> }
    return (data.generatedImages ?? []).map((item, index) => ({
      candidateId: candidateId(request, index),
      mimeType: "image/png",
      bytesBase64: item.image?.imageBytes ?? "",
      providerMetadata: { transport: "genai", modelId: request.config.modelId },
    }))
  }

  private async getAccessToken(): Promise<string> {
    if (process.env.GOOGLE_ACCESS_TOKEN) return process.env.GOOGLE_ACCESS_TOKEN

    const serviceAccountJson = await readServiceAccountJson(this.config)
    if (serviceAccountJson) {
      return getServiceAccountAccessToken(JSON.parse(serviceAccountJson) as ServiceAccount)
    }

    const metadataHost = process.env.GCE_METADATA_HOST ?? "metadata.google.internal"
    const response = await fetch(`http://${metadataHost}/computeMetadata/v1/instance/service-accounts/default/token`, {
      headers: { "Metadata-Flavor": "Google" },
    })
    if (!response.ok) {
      throw new Error(`Unable to obtain metadata-server access token: ${response.status}`)
    }
    const data = await response.json() as { access_token?: string }
    if (!data.access_token) throw new Error("Metadata-server token response did not include access_token.")
    return data.access_token
  }
}

async function getServiceAccountAccessToken(serviceAccount: ServiceAccount): Promise<string> {
  const tokenUri = serviceAccount.token_uri ?? "https://oauth2.googleapis.com/token"
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 3600
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const payload = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: tokenUri,
    scope: CLOUD_PLATFORM_SCOPE,
    iat,
    exp,
  }))
  const unsigned = `${header}.${payload}`
  const signer = createSign("RSA-SHA256")
  signer.update(unsigned)
  signer.end()
  const signature = signer.sign(serviceAccount.private_key).toString("base64url")
  const assertion = `${unsigned}.${signature}`

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })
  if (!response.ok) {
    throw new Error(`Service-account credential validation failed: ${response.status}`)
  }
  const data = await response.json() as { access_token?: string }
  if (!data.access_token) throw new Error("OAuth token response did not include access_token.")
  return data.access_token
}

function normalizeCandidates(predictions: Array<{ bytesBase64Encoded?: string; mimeType?: string }>, request: ImagenImageRequest): GeneratedImageCandidate[] {
  return predictions.map((prediction, index) => ({
    candidateId: candidateId(request, index),
    mimeType: "image/png",
    bytesBase64: prediction.bytesBase64Encoded ?? "",
    providerMetadata: { transport: "vertex", modelId: request.config.modelId },
  }))
}

function candidateId(request: ImagenImageRequest, index: number): string {
  return createHash("sha256")
    .update(`${request.bookId}:${request.briefVersion}:${request.config.idempotencyKey}:${index}`)
    .digest("hex")
    .slice(0, 24)
}

async function safeErrorText(response: Response): Promise<string> {
  const text = await response.text()
  return text.replace(/[A-Za-z0-9_-]{24,}/g, "[redacted-token]").slice(0, 500)
}
