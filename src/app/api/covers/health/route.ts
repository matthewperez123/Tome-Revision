import { createImageGenerationProvider } from "@/features/covers/providers"

export async function GET() {
  const provider = createImageGenerationProvider()
  const health = await provider.healthCheck()
  return Response.json({
    ...health,
    credentials: health.mode === "mock" ? "mock" : health.available ? "validated-without-paid-generation" : "unavailable",
  })
}
