import { createHash } from "node:crypto"
import type { CoverBrief } from "../schemas/cover-brief"
import { IMAGEN_PROMPT_VERSION } from "../schemas/cover-brief"
import { getCompositionFamily } from "../compositions/library"
import { getCoverPalette } from "../styles/palettes"

export const MAX_IMAGEN_PROMPT_TOKENS = 440

const STABLE_STYLE_LANGUAGE = [
  "TEXTLESS 3:4 portrait editorial illustration for the Tome Luminous Minimal Modernism literary collection.",
  "Create an original light-first symbolic scene inspired by vintage lithograph, restrained screen print, matte paper fiber, soft grain, gentle overprint, simplified geometric masses, and shallow breathable depth.",
  "Keep the palette warm, sunlit, open, and calm: ivory paper, sage, moss, sea glass, pale sky blue, wheat, celadon, clay rose, warm stone, and restrained deep ink only for linework or small silhouettes.",
  "Use one immediately readable hero idea, one clear path/vector/threshold, generous quiet negative space, and no more than three important objects.",
  "Tiny anonymous adult silhouettes may be used only for scale, with no faces or costume detail.",
  "Preserve a calm title-safe area in a broad field of sky, paper, sea, meadow, wall, snow, or garden.",
  "Keep all essential figures, buildings, symbols, doors, ships, paths, and celestial objects inside the central 86% of the width because the 3:4 image will be cropped to 2:3.",
  "Completely exclude words, lettering, numbers, signs, inscriptions, runes, logos, signatures, watermarks, borders, book mockups, detailed faces, portraits, photorealism, glossy 3D, anime, comic styling, neon colors, crowded collage, generic fantasy-poster art, literal plot reconstruction, gothic darkness, black castles, storm-poster lighting, and dark purple or navy atmosphere.",
  "The final image must remain legible at 96 x 144 pixels and must not reproduce any reference composition.",
]

export interface BuiltImagenPrompt {
  promptVersion: typeof IMAGEN_PROMPT_VERSION
  finalPrompt: string
  estimatedTokens: number
  promptHash: string
  substitutedFields: Record<string, string>
}

export function estimatePromptTokens(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const punctuation = (text.match(/[.,;:!?()[\]-]/g) ?? []).length
  return Math.ceil(words * 1.18 + punctuation * 0.15)
}

export function assertEnglishPrompt(text: string): void {
  const asciiLetters = text.match(/[A-Za-z]/g) ?? []
  if (asciiLetters.length === 0) return
  const nonAsciiCharacters = text.match(/[^\x00-\x7F]/g) ?? []
  const nonAsciiRatio = nonAsciiCharacters.length / (asciiLetters.length + nonAsciiCharacters.length)
  if (nonAsciiRatio > 0.08) {
    throw new Error("Final Imagen prompt must be English/Latin-script before generation.")
  }
}

export function dedupeClauses(text: string): string {
  const seen = new Set<string>()
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const key = line.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .join("\n\n")
}

function truncateWords(value: string, maxWords: number): string {
  const words = value.trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return value.trim()
  return `${words.slice(0, maxWords).join(" ")}.`
}

function replacePromptBlock(text: string, label: string, value: string): string {
  const prefix = `${label}: `
  return text
    .split("\n\n")
    .map((block) => block.startsWith(prefix) ? `${prefix}${value}` : block)
    .join("\n\n")
}

function paletteText(id: CoverBrief["artDirection"]["paletteMode"]): string {
  const palette = getCoverPalette(id)
  return [
    `field ${palette.field}`,
    `principal ink ${palette.principalInk}`,
    `secondary ink ${palette.secondaryInk}`,
    `counter-color ${palette.counterColor}`,
    palette.accent ? `one restrained accent ${palette.accent}` : "",
  ].filter(Boolean).join(", ")
}

export function buildImagenPrompt(brief: CoverBrief): BuiltImagenPrompt {
  const family = getCompositionFamily(brief.artDirection.compositionFamily)
  const variant = family.variants.find((item) => item.id === brief.artDirection.compositionVariant) ?? family.variants[0]
  const semantic = brief.semantic
  const substitutedFields = {
    bookConcept: truncateWords(
      `${brief.source.title} by ${brief.source.author}: ${semantic.centralConflict} ${semantic.transformation ?? ""}`.trim(),
      34,
    ),
    heroMotif: truncateWords(semantic.heroMotif || semantic.principalVisualMetaphor, 16),
    composition: `${family.label}: ${variant.label}. ${variant.instructions}`,
    narrativeVector: semantic.narrativeVector,
    supportingMotifs: semantic.secondaryMotifs.slice(0, 2).join(", ") || "none",
    palette: paletteText(brief.artDirection.paletteMode),
    emotionalCharacter: semantic.emotionalTone.slice(0, 4).join(", "),
    familyInstructions: truncateWords(
      `${family.heroObjectRules} ${family.foregroundBehavior} ${family.middleGroundBehavior} ${family.backgroundBehavior} ${brief.artDirection.cropSafetyInstructions}`,
      54,
    ),
  }

  let prompt = dedupeClauses([
    STABLE_STYLE_LANGUAGE[0],
    STABLE_STYLE_LANGUAGE[1],
    `Book concept: ${substitutedFields.bookConcept}`,
    `Dominant visual metaphor: ${substitutedFields.heroMotif}`,
    `Composition: ${substitutedFields.composition}`,
    `Narrative force: ${substitutedFields.narrativeVector}`,
    `Supporting motifs: ${substitutedFields.supportingMotifs}`,
    `Palette: ${substitutedFields.palette}`,
    `Emotional character: ${substitutedFields.emotionalCharacter}`,
    `Composition requirements: ${substitutedFields.familyInstructions}`,
    ...STABLE_STYLE_LANGUAGE.slice(2),
  ].join("\n\n"))

  while (estimatePromptTokens(prompt) > MAX_IMAGEN_PROMPT_TOKENS) {
    const shortened = replacePromptBlock(
      replacePromptBlock(prompt, "Composition requirements", truncateWords(substitutedFields.familyInstructions, 32)),
      "Book concept",
      truncateWords(substitutedFields.bookConcept, 22),
    )
    if (shortened === prompt) break
    prompt = shortened
  }

  assertEnglishPrompt(prompt)
  const estimatedTokens = estimatePromptTokens(prompt)
  if (estimatedTokens > MAX_IMAGEN_PROMPT_TOKENS) {
    throw new Error(`Imagen prompt is ${estimatedTokens} tokens; limit is ${MAX_IMAGEN_PROMPT_TOKENS}.`)
  }

  return {
    promptVersion: IMAGEN_PROMPT_VERSION,
    finalPrompt: prompt,
    estimatedTokens,
    promptHash: createHash("sha256").update(prompt).digest("hex"),
    substitutedFields,
  }
}
