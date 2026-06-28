/**
 * Text anchoring for guided-session margin annotations.
 *
 * The locked reader paginates each chapter into discrete HTML pages and renders
 * one at a time, so an annotation can't hold a live DOM Range — a quote reflows
 * to a different page when the font size, viewport, or layout mode changes. We
 * therefore store a W3C-Web-Annotation-style descriptor (exact quote + a few
 * characters of prefix/suffix context, plus character offsets as a durability
 * fallback) in the Liveblocks thread metadata, and re-find the range inside
 * whichever page is currently rendered.
 *
 * Re-find leans on quote + prefix/suffix because the rendered container is a
 * single page (page-local), whereas the stored offsets are chapter-global —
 * they're retained for the mirror/analytics, not used to disambiguate here.
 *
 * Everything here touches `document`, so call it only on the client.
 */

export interface AnnotationAnchor {
  /** Exact selected text. */
  quote: string
  /** Up to CONTEXT_LEN chars immediately before the quote (disambiguation). */
  prefix: string
  /** Up to CONTEXT_LEN chars immediately after the quote (disambiguation). */
  suffix: string
  /** Char offset of the quote start within the source container (fallback). */
  startOffset: number
  /** Char offset of the quote end within the source container (fallback). */
  endOffset: number
  /** Chapter the anchor belongs to — guards against cross-chapter re-find. */
  chapterIndex: number
}

const CONTEXT_LEN = 32

function collectTextNodes(container: Node): Text[] {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    nodes.push(n as Text)
  }
  return nodes
}

function flatText(nodes: Text[]): string {
  let s = ""
  for (const n of nodes) s += n.data
  return s
}

/** Map a global char offset back to a concrete (textNode, offset) point. */
function pointAt(
  nodes: Text[],
  offset: number,
): { node: Text; offset: number } | null {
  let acc = 0
  for (const n of nodes) {
    const len = n.data.length
    if (offset <= acc + len) return { node: n, offset: offset - acc }
    acc += len
  }
  const last = nodes[nodes.length - 1]
  return last ? { node: last, offset: last.data.length } : null
}

/** Global char offset of a (textNode, offset) within the container, or null. */
function globalOffsetOf(
  nodes: Text[],
  node: Node,
  nodeOffset: number,
): number | null {
  let acc = 0
  for (const n of nodes) {
    if (n === node) return acc + nodeOffset
    acc += n.data.length
  }
  return null
}

/**
 * Build an anchor from a live selection Range within `container`.
 * Returns null for an empty/whitespace-only selection.
 */
export function computeAnchor(
  range: Range,
  container: HTMLElement,
  chapterIndex: number,
): AnnotationAnchor | null {
  const quote = range.toString()
  if (!quote.trim()) return null

  const nodes = collectTextNodes(container)
  if (nodes.length === 0) return null
  const flat = flatText(nodes)

  let start = globalOffsetOf(nodes, range.startContainer, range.startOffset)
  let end = globalOffsetOf(nodes, range.endContainer, range.endOffset)

  if (start === null || end === null) {
    // Selection boundary wasn't a tracked text node — fall back to text search.
    const idx = flat.indexOf(quote)
    if (idx < 0) return null
    start = idx
    end = idx + quote.length
  }
  if (start > end) [start, end] = [end, start]

  return {
    quote,
    prefix: flat.slice(Math.max(0, start - CONTEXT_LEN), start),
    suffix: flat.slice(end, end + CONTEXT_LEN),
    startOffset: start,
    endOffset: end,
    chapterIndex,
  }
}

/** Pick the best occurrence of the quote within `flat` using prefix/suffix. */
function locate(
  flat: string,
  anchor: Pick<AnnotationAnchor, "quote" | "prefix" | "suffix">,
): number {
  const { quote, prefix, suffix } = anchor
  if (!quote) return -1

  const positions: number[] = []
  for (let i = flat.indexOf(quote); i >= 0; i = flat.indexOf(quote, i + 1)) {
    positions.push(i)
  }
  if (positions.length === 0) return -1
  if (positions.length === 1) return positions[0]!

  let best = positions[0]!
  let bestScore = -1
  for (const p of positions) {
    let score = 0
    if (prefix) {
      const before = flat.slice(Math.max(0, p - prefix.length), p)
      if (before.endsWith(prefix)) score += 2
      else if (before && prefix.endsWith(before)) score += 1
    }
    if (suffix) {
      const after = flat.slice(p + quote.length, p + quote.length + suffix.length)
      if (after.startsWith(suffix)) score += 2
      else if (after && suffix.startsWith(after)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = p
    }
  }
  return best
}

/**
 * Re-find the anchored span inside a currently-rendered page container.
 * Returns a live Range (for highlight rects) or null if the quote isn't on
 * this page (e.g. it reflowed to another page).
 */
export function findAnchorRange(
  container: HTMLElement,
  anchor: Pick<AnnotationAnchor, "quote" | "prefix" | "suffix">,
): Range | null {
  const nodes = collectTextNodes(container)
  if (nodes.length === 0) return null

  const start = locate(flatText(nodes), anchor)
  if (start < 0) return null

  const a = pointAt(nodes, start)
  const b = pointAt(nodes, start + anchor.quote.length)
  if (!a || !b) return null

  const range = document.createRange()
  range.setStart(a.node, a.offset)
  range.setEnd(b.node, b.offset)
  return range
}
