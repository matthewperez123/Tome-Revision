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
  lineHeight?: number // default 1.6
  contentTypeClass?: string // "content-drama" | "content-verse" | "content-prose"
  justify?: boolean   // match the reading surface so page counts don't drift
  a11yFace?: boolean  // accessibility (sans) reading face
  hyphenate?: boolean // hyphens: auto (reader setting; off by default)
  // CSS max-width matching the rendered `.reader-measure` cap (e.g. "68ch").
  // Without this the probe wraps at the full page width while the rendered
  // page wraps at the (narrower) measure — extra lines then overflow the
  // page box and get clipped. Passing it keeps measurement === render.
  measure?: string
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
 * Split an over-tall inline-flow block (typically a verse paragraph — one
 * giant <p> whose lines are separated by <br>) at its <br> boundaries into
 * display:block line-group spans. Each group is a valid child of <p>, so the
 * emitted pages re-wrap in a clone of the original block without the browser
 * parser re-nesting anything. Returns [] when there's nothing to split on.
 */
function splitInlineByBr(el: HTMLElement): HTMLElement[] {
  if (el.querySelectorAll("br").length < 2) return []
  const groups: HTMLElement[] = []
  let current: HTMLElement | null = null
  const startGroup = () => {
    const span = document.createElement("span")
    span.style.display = "block"
    // Mirror `.prose-reader br { margin-bottom: 0.25em }` line spacing.
    span.style.marginBottom = "0.25em"
    groups.push(span)
    return span
  }
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === "BR") {
      current = null // next content starts a new line group
      continue
    }
    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim() && !current) continue
    if (!current) current = startGroup()
    current.appendChild(node.cloneNode(true))
  }
  return groups.filter((g) => g.textContent?.trim() || g.children.length > 0)
}

/**
 * Split an over-tall inline-flow block with no <br> boundaries (a very long
 * prose paragraph) at word boundaries, by measurement. Every word of each
 * direct text node is wrapped in an inline span (inline spans don't change
 * wrapping, so the probe lays out exactly like the render); we then walk the
 * word boxes and break where the next line would exceed `pageHeight`. Inline
 * element children (<em>, <a>, …) are kept atomic. Returns full page HTML
 * strings, each re-wrapped in a shallow clone of the original block, or []
 * when everything fits on one page.
 */
function splitInlineByWords(
  el: HTMLElement,
  pageHeight: number,
  makeProbe: () => HTMLElement,
  wrapTemplate: HTMLElement | null
): string[] {
  const probe = makeProbe()
  let parent: HTMLElement = probe
  if (wrapTemplate) {
    const w = wrapTemplate.cloneNode(false) as HTMLElement
    probe.appendChild(w)
    parent = w
  }
  const host = el.cloneNode(false) as HTMLElement
  parent.appendChild(host)

  // Word-wrap direct text nodes of a deep clone; element children stay atomic.
  const prepared = el.cloneNode(true) as HTMLElement
  for (const child of Array.from(prepared.childNodes)) {
    if (child.nodeType !== Node.TEXT_NODE) continue
    const text = child.textContent ?? ""
    const frag = document.createDocumentFragment()
    for (const token of text.split(/(\s+)/)) {
      if (!token) continue
      if (/^\s+$/.test(token)) {
        frag.appendChild(document.createTextNode(token))
      } else {
        const s = document.createElement("span")
        s.textContent = token
        frag.appendChild(s)
      }
    }
    prepared.replaceChild(frag, child)
  }
  while (prepared.firstChild) host.appendChild(prepared.firstChild)
  document.body.appendChild(probe)

  // Half-leading correction: inline rects are glyph boxes, but the page clips
  // at line-box edges — extend each measured bottom to its line-box bottom.
  const lineH = parseFloat(getComputedStyle(host).lineHeight) || 0

  const pages: string[] = []
  let current: Node[] = []
  let pageStartTop: number | null = null
  const flush = () => {
    if (current.length === 0) return
    const w = el.cloneNode(false) as HTMLElement
    for (const n of current) {
      // Unwrap measurement spans back to plain text so emitted HTML is clean.
      if (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName === "SPAN" && (n as Element).attributes.length === 0) {
        w.appendChild(document.createTextNode(n.textContent ?? ""))
      } else {
        w.appendChild(n.cloneNode(true))
      }
    }
    w.normalize()
    pages.push(w.outerHTML)
    current = []
  }

  for (const node of Array.from(host.childNodes)) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      current.push(node) // whitespace rides with the preceding word
      continue
    }
    const rects = (node as HTMLElement).getClientRects()
    if (rects.length === 0) {
      current.push(node)
      continue
    }
    const first = rects[0]
    const last = rects[rects.length - 1]
    const adj = Math.max(0, (lineH - first.height) / 2)
    const top = first.top - adj
    const bottom = last.bottom + Math.max(0, (lineH - last.height) / 2)
    if (pageStartTop === null) pageStartTop = top
    if (bottom - pageStartTop > pageHeight && current.length > 0) {
      flush()
      pageStartTop = top
    }
    current.push(node)
  }
  flush()

  document.body.removeChild(probe)
  return pages.length > 1 ? pages : []
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
        // Inline flow (e.g. a giant verse <p> with <br> line breaks) — split
        // at the <br> boundaries so the overflow continues on the next page
        // instead of being clipped by the page box.
        const lineGroups = splitInlineByBr(blocks[i])
        if (lineGroups.length > 1) {
          const innerWrap = blocks[i].cloneNode(false) as HTMLElement
          const subPages = paginateBlocks(lineGroups, pageHeight, makeProbe, innerWrap)
          for (const sp of subPages) out.push(wrapHtml(sp))
        } else {
          // No <br> boundaries — a very long prose paragraph. Split at word
          // boundaries by measurement so it flows across pages.
          const wordPages = splitInlineByWords(blocks[i], pageHeight, makeProbe, wrapTemplate)
          if (wordPages.length > 0) {
            for (const sp of wordPages) out.push(wrapHtml(sp))
          } else {
            // Truly unsplittable (lone image, single word) — its own page.
            out.push(wrapHtml(el.outerHTML))
          }
        }
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
  const { html, pageHeight, pageWidth, fontSize, lineHeight = 1.6, contentTypeClass = "content-prose", justify = false, a11yFace = false, hyphenate = false, measure } = options

  // Guard: SSR or invalid dimensions
  if (typeof window === "undefined") return [html]
  if (!html || pageHeight <= 0 || pageWidth <= 0) return [html || ""]

  // Wait for fonts to be ready (prevents fallback-font measurement errors)
  await document.fonts.ready

  // Check cache — keyed on everything that changes wrapped-line height.
  const htmlHash = fastHash(html)
  const cacheKey = `${fontSize}-${lineHeight}-${Math.round(pageHeight)}-${Math.round(pageWidth)}-${contentTypeClass}-${justify ? "j" : "r"}-${a11yFace ? "a" : "s"}-${hyphenate ? "h" : "n"}-${measure ?? "none"}-${htmlHash}`
  if (paginationCache.has(cacheKey)) {
    return paginationCache.get(cacheKey)!
  }

  // Probe factory — a hidden, off-screen element carrying the exact reader
  // styles so DOM measurement matches the rendered page. A fresh probe per
  // (recursive) call keeps nested split measurements from disturbing parent
  // offsets.
  const probeClassName = `font-serif prose-reader ${contentTypeClass} ${justify ? "reader-justify" : "reader-ragged"}${a11yFace ? " reader-a11y-face" : ""}${hyphenate ? " reader-hyphenate" : ""}`
  const makeProbe = (): HTMLElement => {
    const probe = document.createElement("div")
    probe.setAttribute("aria-hidden", "true")
    probe.className = probeClassName
    Object.assign(probe.style, {
      position: "fixed",
      top: "-9999px",
      left: "-9999px",
      width: `${pageWidth}px`,
      // Mirror the rendered `.reader-measure` cap so line wrapping (and thus
      // page height) is measured at the exact width the page renders at.
      maxWidth: measure ?? "none",
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
