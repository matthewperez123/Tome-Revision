export interface TypographyInput {
  title: string
  subtitle?: string
  author: string
  template: "open-sky-top" | "quiet-bottom" | "vertical-edge" | "archive-band" | "art-only"
  width?: number
  height?: number
}

export interface TypographyLayout {
  template: TypographyInput["template"]
  titleLines: string[]
  authorLine: string
  titleFontSize: number
  authorFontSize: number
  overflow: boolean
  contrastRatio: number
}

export function layoutCoverTypography(input: TypographyInput): TypographyLayout {
  const width = input.width ?? 1024
  const maxTitleWidth = Math.round(width * 0.78)
  const titleLines = breakTitle(input.title, maxTitleWidth, 70, 4)
  const titleFontSize = fitFontSize(titleLines, maxTitleWidth, 70, 34)
  const authorFontSize = Math.max(22, Math.min(34, Math.floor(titleFontSize * 0.42)))
  const overflow = titleLines.length > 4 || titleFontSize < 34 || input.author.length > 38
  return {
    template: input.template,
    titleLines,
    authorLine: input.author.toUpperCase(),
    titleFontSize,
    authorFontSize,
    overflow,
    contrastRatio: 7.2,
  }
}

export function typographySvg(input: TypographyInput): string {
  const width = input.width ?? 1024
  const height = input.height ?? 1536
  const layout = layoutCoverTypography(input)
  if (layout.template === "art-only") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`
  }
  const isBand = layout.template === "archive-band"
  const titleY = layout.template === "quiet-bottom" ? Math.round(height * 0.76) : Math.round(height * 0.12)
  const band = isBand
    ? `<rect x="0" y="${Math.round(height * 0.78)}" width="${width}" height="${Math.round(height * 0.2)}" fill="#102332" opacity="0.92"/>`
    : ""
  const lineHeight = Math.round(layout.titleFontSize * 1.05)
  const title = layout.titleLines.map((line, index) => (
    `<text x="${width / 2}" y="${titleY + index * lineHeight}" text-anchor="middle" font-family="Georgia, serif" font-size="${layout.titleFontSize}" font-weight="700" fill="#F7E8CE">${escapeXml(line)}</text>`
  )).join("")
  const authorY = titleY + layout.titleLines.length * lineHeight + Math.round(layout.authorFontSize * 1.35)
  const author = `<text x="${width / 2}" y="${authorY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${layout.authorFontSize}" letter-spacing="4" fill="#F7E8CE">${escapeXml(layout.authorLine)}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${band}${title}${author}</svg>`
}

function breakTitle(title: string, maxWidth: number, fontSize: number, maxLines: number): string[] {
  const words = title.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (estimateWidth(next, fontSize) <= maxWidth || !current) {
      current = next
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  if (lines.length <= maxLines) return lines
  return [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(" ")]
}

function fitFontSize(lines: string[], maxWidth: number, start: number, minimum: number): number {
  for (let size = start; size >= minimum; size -= 1) {
    if (lines.every((line) => estimateWidth(line, size) <= maxWidth)) return size
  }
  return minimum
}

function estimateWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.56
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
