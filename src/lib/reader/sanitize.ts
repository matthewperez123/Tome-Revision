"use client"

/**
 * Reader HTML sanitizer — defense-in-depth for chapter `content_html`.
 *
 * Content is author-controlled (Standard-Ebooks-derived static files + our own
 * Supabase rows), so this is not the primary trust boundary; it strips the
 * obvious XSS vectors (scripts, event handlers, javascript: URLs, unhosted
 * images) while DELIBERATELY preserving the structural/semantic markup and the
 * baked enhancement attributes (`role`, `class`, `id`, `data-*`) that per-book
 * overlays scan for after mount. Removing those would regress glosses,
 * line-numbering, speaker colors, etc.
 *
 * Runs client-side (the reader fetches chapter JSON in an effect); on the
 * server it returns the input unchanged.
 */

// Tags removed entirely, including their contents.
const FORBIDDEN_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "LINK",
  "META",
  "BASE",
  "FORM",
  "INPUT",
  "BUTTON",
  "TEXTAREA",
  "SELECT",
  "OPTION",
  "SVG",
  "MATH",
  "TITLE",
  "NOSCRIPT",
  "TEMPLATE",
  "HEAD",
])

function isUnsafeUrl(value: string): boolean {
  // Strip leading control chars/whitespace, then check the scheme.
  // eslint-disable-next-line no-control-regex
  const v = value.replace(/[\u0000-\u0020]+/g, "").toLowerCase()
  return v.startsWith("javascript:") || v.startsWith("vbscript:") || v.startsWith("data:text/html")
}

function scrubElement(el: Element): void {
  // Remove event-handler attributes and unsafe URL attributes.
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase()
    if (name.startsWith("on")) {
      el.removeAttribute(attr.name)
      continue
    }
    if ((name === "href" || name === "src" || name === "xlink:href") && isUnsafeUrl(attr.value)) {
      el.removeAttribute(attr.name)
    }
  }
}

function isHostedImage(src: string | null): boolean {
  if (!src) return false
  return /^https?:\/\//i.test(src) || src.startsWith("/")
}

// Small LRU-ish memo (sanitizing the same chapter repeatedly is common when
// settings change and the body re-derives).
const cache = new Map<string, string>()
const CACHE_MAX = 24

function fastHash(str: string): string {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
    h >>>= 0
  }
  return String(h)
}

export function sanitizeReaderHtml(html: string): string {
  if (!html) return ""
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return html

  const key = fastHash(html)
  const cached = cache.get(key)
  if (cached !== undefined) return cached

  const doc = new DOMParser().parseFromString(html, "text/html")

  // Walk a static list (live collection mutates as we remove nodes).
  const all = Array.from(doc.body.querySelectorAll("*"))
  for (const el of all) {
    if (FORBIDDEN_TAGS.has(el.tagName)) {
      el.remove()
      continue
    }
    if (el.tagName === "IMG") {
      // SE images use relative "../images/..." paths with no asset host —
      // drop unhosted images rather than render broken icons.
      const src = el.getAttribute("src")
      if (!isHostedImage(src)) {
        el.remove()
        continue
      }
    }
    scrubElement(el)
  }

  const out = doc.body.innerHTML

  if (cache.size >= CACHE_MAX) {
    const first = cache.keys().next().value
    if (first !== undefined) cache.delete(first)
  }
  cache.set(key, out)
  return out
}
