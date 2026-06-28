import { createHash } from "node:crypto"
import sharp from "sharp"

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface RenderedDerivative {
  type: "master-2x3" | "768" | "512" | "256" | "thumb" | "composite"
  width: number
  height: number
  mimeType: string
  bytes: Buffer
  sha256: string
}

export function centeredTwoByThreeCrop(sourceWidth: number, sourceHeight: number, saliencyX = 0.5): CropRect {
  const targetWidth = Math.round(sourceHeight * (2 / 3))
  const safeAdjustment = Math.max(-0.025, Math.min(0.025, saliencyX - 0.5))
  const centerX = sourceWidth / 2 + sourceWidth * safeAdjustment
  const x = Math.max(0, Math.min(sourceWidth - targetWidth, Math.round(centerX - targetWidth / 2)))
  return { x, y: 0, width: targetWidth, height: sourceHeight }
}

export async function renderCoverDerivatives(source: Buffer): Promise<{ cropRect: CropRect; derivatives: RenderedDerivative[] }> {
  const metadata = await sharp(source).metadata()
  if (!metadata.width || !metadata.height) {
    throw new Error("Cannot render derivatives without source dimensions.")
  }
  const ratio = metadata.width / metadata.height
  if (Math.abs(ratio - 0.75) > 0.04) {
    throw new Error(`Expected 3:4 source ratio, received ${metadata.width}x${metadata.height}.`)
  }
  const cropRect = centeredTwoByThreeCrop(metadata.width, metadata.height)
  const cropped = sharp(source).extract({
    left: cropRect.x,
    top: cropRect.y,
    width: cropRect.width,
    height: cropRect.height,
  })
  const master = await cropped.clone().resize(1024, 1536, { fit: "cover" }).png().toBuffer()
  const webp768 = await sharp(master).resize(768, 1152).webp({ quality: 88 }).toBuffer()
  const webp512 = await sharp(master).resize(512, 768).webp({ quality: 86 }).toBuffer()
  const webp256 = await sharp(master).resize(256, 384).webp({ quality: 84 }).toBuffer()
  const thumb = await sharp(master).resize(96, 144).webp({ quality: 80 }).toBuffer()

  return {
    cropRect,
    derivatives: [
      derivative("master-2x3", 1024, 1536, "image/png", master),
      derivative("768", 768, 1152, "image/webp", webp768),
      derivative("512", 512, 768, "image/webp", webp512),
      derivative("256", 256, 384, "image/webp", webp256),
      derivative("thumb", 96, 144, "image/webp", thumb),
    ],
  }
}

function derivative(type: RenderedDerivative["type"], width: number, height: number, mimeType: string, bytes: Buffer): RenderedDerivative {
  return { type, width, height, mimeType, bytes, sha256: createHash("sha256").update(bytes).digest("hex") }
}
