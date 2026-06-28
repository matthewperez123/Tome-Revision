import { createHash } from "node:crypto"
import type {
  GeneratedImageCandidate,
  ImageGenerationProvider,
  ImagenImageRequest,
  ProviderHealth,
} from "./types"

function seededColor(seed: string, offset: number): string {
  const hash = createHash("sha256").update(`${seed}:${offset}`).digest()
  return `#${hash.subarray(0, 3).toString("hex")}`
}

function mockSvg(prompt: string, seed: string): string {
  const a = seededColor(seed, 0)
  const b = seededColor(seed, 1)
  const c = seededColor(seed, 2)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="2048" viewBox="0 0 1536 2048">
  <rect width="1536" height="2048" fill="${a}"/>
  <path d="M0 1620 C420 1320 680 1190 1536 1010 L1536 2048 L0 2048 Z" fill="${b}" opacity="0.82"/>
  <circle cx="1040" cy="390" r="155" fill="${c}" opacity="0.88"/>
  <path d="M230 2048 C560 1500 760 1110 1110 740" fill="none" stroke="#f4e4bf" stroke-width="82" stroke-linecap="round" opacity="0.9"/>
  <path d="M1020 850 L1230 1200 L830 1200 Z" fill="#102332" opacity="0.75"/>
  <rect x="702" y="1612" width="48" height="150" rx="24" fill="#101820"/>
  <text x="48" y="1988" font-size="1" fill="transparent">${escapeXml(createHash("sha256").update(prompt).digest("hex"))}</text>
</svg>`
}

export class MockCoverProvider implements ImageGenerationProvider {
  readonly name = "mock-cover" as const

  async validateStartup(): Promise<ProviderHealth> {
    return this.healthCheck()
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: this.name,
      available: true,
      mode: "mock",
      transport: "mock",
      modelId: "deterministic-svg-mock",
      lifecycle: {
        modelId: "deterministic-svg-mock",
        configuredAt: new Date().toISOString(),
      },
    }
  }

  async generateImages(request: ImagenImageRequest): Promise<GeneratedImageCandidate[]> {
    return Array.from({ length: request.config.candidateCount }, (_, index) => {
      const seed = `${request.bookId}:${request.briefVersion}:${request.config.idempotencyKey}:${index}`
      const svg = mockSvg(request.prompt, seed)
      return {
        candidateId: createHash("sha256").update(seed).digest("hex").slice(0, 24),
        mimeType: "image/png",
        bytesBase64: Buffer.from(svg).toString("base64"),
        width: 1536,
        height: 2048,
        providerMetadata: {
          provider: "mock-cover",
          deterministic: true,
          promptHash: createHash("sha256").update(request.prompt).digest("hex"),
        },
      }
    })
  }
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
