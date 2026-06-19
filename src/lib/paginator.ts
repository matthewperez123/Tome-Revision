/**
 * Paginator — DOM-measurement HTML pagination engine
 * Splits an HTML string into pages that fit a given pixel height/width.
 * Must be called client-side only.
 */

export interface PaginateOptions {
  html: string
  pageHeight: number  // usable content height in px (after subtracting padding)
  pageWidth: number   // usable content width in px (after subtracting padding)
  fontSize: number
  lineHeight?: number // default 1.8
  contentTypeClass?: string // "content-drama" | "content-verse" | "content-prose"
  justify?: boolean   // match the reading surface so page counts don't drift
  a11yFace?: boolean  // accessibility (sans) reading face
}

// Module-level cache — max 20 entries
const paginationCache = new Map<string, string[]>()

/** Cheap string hash for cache keying */
function fastHash(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
    h >>>= 0
  }
  return h
}

export function getPaginationCacheKey(
  bookId: string,
  chapterIndex: number,
  fontSize: number,
  pageHeight: number,
  pageWidth: number
): string {
  return `${bookId}-${chapterIndex}-${fontSize}-${Math.round(pageHeight)}-${Math.round(pageWidth)}`
}

// Leaf block tags are paginated atomically (kept whole, or emitted alone when
// taller than a page — e.g. a drama's single large table).
const LEAF_BLOCK_TAGS = new Set(["P","H1","H2","H3","H4","H5","H6","BLOCKQUOTE","HR","UL","OL","PRE","TABLE","FIGURE","FIGCAPTION"])
// Structural containers are transparent — we descend into them and flatten to
// their block children so wrapped chapters (e.g. a single <article> wrapping
// the whole chapter) split into many pages instead of one giant page.
const CONTAINER_TAGS = new Set(["DIV","SECTION","ARTICLE","MAIN","HEADER","FOOTER","ASIDE"])

/** Normalize raw HTML childNodes into block-level Elements */
function normalizeToBlocks(nodes: NodeListOf<ChildNode>): Element[] {
  const result: Element[] = []
  for (const node of Array.from(nodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        const p = document.createElement("p")
        p.textContent = text
        result.push(p)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      if (CONTAINER_TAGS.has(el.tagName) && el.children.length > 0) {
        // Transparent wrapper — descend and flatten its block children.
        result.push(...normalizeToBlocks(el.childNodes))
      } else if (LEAF_BLOCK_TAGS.has(el.tagName)) {
        result.push(el)
      } else {
        // Inline wrapper — wrap in paragraph
        const p = document.createElement("p")
        p.innerHTML = el.outerHTML
        result.push(p)
      }
    }
  }
  return result
}

/** Block-level children eligible for splitting a too-tall container
 *  (blockquote, list, …). Returns [] when the element can't be meaningfully
 *  split (single child, or mixed/inline content). */
function splittableChildren(el: HTMLElement): HTMLElement[] {
  const kids = Array.from(el.children) as HTMLElement[]
  if (kids.length < 2) return []
  const splittable = kids.every(
    (k) => LEAF_BLOCK_TAGS.has(k.tagName) || CONTAINER_TAGS.has(k.tagName) || k.tagName === "LI"
  )
  return splittable ? kids : []
}

/**
 * Lay a list of block elements into a fresh probe, then break them into page
 * HTML strings (largest run of whole blocks that fits `pageHeight`, measured
 * from the first block's real offsetTop so stacked margins are honored).
 *
 * A block taller than a page is recursively split into its block children, and
 * each resulting page is re-wrapped in a shallow clone of that block so its
 * styling (a blockquote's left rule, a list's markers) survives the break —
 * overflowing content flows onto the next page instead of being clipped. Truly
 * atomic over-tall blocks (a lone image) still get their own page.
 *
 * A fresh probe per call means nested measurements never disturb the parent's
 * offsets. `wrapTemplate`, when set, is the ancestor block clone the children
 * are laid inside (so its padding/border reduce the measured width) and that
 * every emitted page is wrapped in.
 */
function paginateBlocks(
  blocks: HTMLElement[],
  pageHeight: number,
  makeProbe: () => HTMLElement,
  wrapTemplate: HTMLElement | null
): string[] {
  if (blocks.length === 0) return []

  const probe = makeProbe()
  let host: HTMLElement = probe
  if (wrapTemplate) {
    const wrapProbe = wrapTemplate.cloneNode(false) as HTMLElement
    probe.appendChild(wrapProbe)
    host = wrapProbe
  }
  document.body.appendChild(probe)

  const laid: HTMLElement[] = []
  for (const b of blocks) {
    const clone = b.cloneNode(true) as HTMLElement
    host.appendChild(clone)
    laid.push(clone)
  }

  const wrapHtml = (inner: string): string => {
    if (!wrapTemplate) return inner
    const w = wrapTemplate.cloneNode(false) as HTMLElement
    w.innerHTML = inner
    return w.outerHTML
  }

  const out: string[] = []
  let start = 0
  let pageTop = laid[0].offsetTop

  const flush = (end: number) => {
    if (end > start) out.push(wrapHtml(laid.slice(start, end).map((n) => n.outerHTML).join("")))
  }

  for (let i = 0; i < laid.length; i++) {
    const el = laid[i]
    const blockBottom = el.offsetTop + el.offsetHeight
    if (blockBottom - pageTop > pageHeight && i > start) {
      flush(i)
      start = i
      pageTop = el.offsetTop
    }
    if (el.offsetHeight > pageHeight && i === start) {
      // Block taller than a page: split its children rather than clip it.
      const kids = splittableChildren(blocks[i])
      if (kids.length > 0) {
        const innerWrap = blocks[i].cloneNode(false) as HTMLElement
        const subPages = paginateBlocks(kids, pageHeight, makeProbe, innerWrap)
        for (const sp of subPages) out.push(wrapHtml(sp))
      } else {
        // Unsplittable (lone image, single child) — its own page.
        out.push(wrapHtml(el.outerHTML))
      }
      start = i + 1
      pageTop = i + 1 < laid.length ? laid[i + 1].offsetTop : 0
    }
  }
  flush(laid.length)

  document.body.removeChild(probe)
  return out
}

export async function paginateHTML(options: PaginateOptions): Promise<string[]> {
  const { html, pageHeight, pageWidth, fontSize, lineHeight = 1.8, contentTypeClass = "content-prose", justify = false, a11yFace = false } = options

  // Guard: SSR or invalid dimensions
  if (typeof window === "undefined") return [html]
  if (!html || pageHeight <= 0 || pageWidth <= 0) return [html || ""]

  // Wait for fonts to be ready (prevents fallback-font measurement errors)
  await document.fonts.ready

  // Check cache — keyed on everything that changes wrapped-line height.
  const htmlHash = fastHash(html)
  const cacheKey = `${fontSize}-${lineHeight}-${Math.round(pageHeight)}-${Math.round(pageWidth)}-${contentTypeClass}-${justify ? "j" : "r"}-${a11yFace ? "a" : "s"}-${htmlHash}`
  if (paginationCache.has(cacheKey)) {
    return paginationCache.get(cacheKey)!
  }

  // Probe factory — a hidden, off-screen element carrying the exact reader
  // styles so DOM measurement matches the rendered page. A fresh probe per
  // (recursive) call keeps nested split measurements from disturbing parent
  // offsets.
  const probeClassName = `font-serif prose-reader ${contentTypeClass} ${justify ? "reader-justify" : "reader-ragged"}${a11yFace ? " reader-a11y-face" : ""}`
  const makeProbe = (): HTMLElement => {
    const probe = document.createElement("div")
    probe.setAttribute("aria-hidden", "true")
    probe.className = probeClassName
    Object.assign(probe.style, {
      position: "fixed",
      top: "-9999px",
      left: "-9999px",
      width: `${pageWidth}px`,
      height: "auto",
      fontSize: `${fontSize}px`,
      lineHeight: String(lineHeight),
      fontFamily: a11yFace ? "var(--font-sans, Inter, system-ui, sans-serif)" : "var(--font-serif, Literata, Georgia, serif)",
      padding: "0",
      margin: "0",
      overflow: "visible",
      visibility: "hidden",
      pointerEvents: "none",
      wordBreak: "break-word",
      overflowWrap: "break-word",
      boxSizing: "border-box",
    })
    return probe
  }

  // Parse HTML into block elements
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html
  const blockNodes = normalizeToBlocks(tempDiv.childNodes) as HTMLElement[]

  // Edge case: no block nodes
  if (blockNodes.length === 0) {
    return [html]
  }

  // Lay blocks together (margins collapse as on the rendered page) and break by
  // real offsetTop/offsetHeight; over-tall blocks split into their children
  // rather than clip. See paginateBlocks.
  const pages = paginateBlocks(blockNodes, pageHeight, makeProbe, null)

  // Cache with eviction
  if (paginationCache.size >= 20) {
    const firstKey = paginationCache.keys().next().value
    if (firstKey !== undefined) paginationCache.delete(firstKey)
  }
  paginationCache.set(cacheKey, pages)

  return pages.length > 0 ? pages : [html]
}
