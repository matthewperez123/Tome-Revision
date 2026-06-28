import { GoogleImagenProvider } from "./google-imagen-provider"
import { MockCoverProvider } from "./mock-cover-provider"
import { hasGoogleCredentials, readCoverFactoryConfig } from "./config"
import type { ImageGenerationProvider } from "./types"

export function createImageGenerationProvider(): ImageGenerationProvider {
  const config = readCoverFactoryConfig()
  if (!config.allowPaidGeneration || !hasGoogleCredentials(config)) {
    return new MockCoverProvider()
  }
  return new GoogleImagenProvider(config)
}
