import type { ImagenRequestConfig } from "../schemas/cover-brief"

export type ImageGenerationProviderName = "google-imagen" | "mock-cover"

export interface ImagenImageRequest {
  prompt: string
  config: ImagenRequestConfig
  bookId: string
  briefVersion: number
}

export interface GeneratedImageCandidate {
  candidateId: string
  mimeType: "image/png" | "image/jpeg" | "image/webp"
  bytesBase64: string
  width?: number
  height?: number
  providerMetadata: Record<string, unknown>
}

export interface ProviderHealth {
  provider: ImageGenerationProviderName
  available: boolean
  mode: "mock" | "real"
  transport: "vertex" | "genai" | "mock"
  modelId?: string
  warning?: string
  error?: string
  lifecycle: ImagenModelLifecycle
}

export interface ImagenModelLifecycle {
  modelId: string
  configuredAt: string
  retirementDate?: string
  deprecationDate?: string
  replacementPlan?: string
  warning?: string
}

export interface ImageGenerationProvider {
  readonly name: ImageGenerationProviderName
  validateStartup(): Promise<ProviderHealth>
  healthCheck(): Promise<ProviderHealth>
  generateImages(request: ImagenImageRequest): Promise<GeneratedImageCandidate[]>
}
