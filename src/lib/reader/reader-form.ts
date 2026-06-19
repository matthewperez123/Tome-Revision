/**
 * Reader form resolver — maps a book's genres to a typographic form.
 *
 * Form sets page-level defaults (`data-reader-form` on the surface). Semantic
 * blocks still win locally: a verse blockquote inside a prose novel keeps verse
 * styling regardless of form (see the form CSS in tome.css).
 *
 * NOTE: this repo's chapter HTML does NOT carry `data-epub-type` attributes
 * (verified against the live content). Form is therefore derived from genre,
 * and the per-form CSS keys off the real markup (role=doc-chapter, hgroup,
 * <table> drama, blockquote>p>span verse) rather than epub:type.
 */

export type ReaderForm = "prose" | "poetry" | "drama" | "nonfiction"

const DRAMA_MARKERS = ["Drama", "History Play"]
const VERSE_MARKERS = [
  "Poetry",
  "Epic Poetry",
  "War Poetry",
  "Didactic Poetry",
  "Mythological Poetry",
  "Novel in Verse",
  "Verse",
]
const EPIC_MARKERS = ["Epic", "National Epic"]
const NONFICTION_MARKERS = [
  "Philosophy",
  "Memoir",
  "Autobiography",
  "Essays",
  "Ethics",
  "Political Theory",
  "History",
  "Theology",
  "Science",
]

export function getReaderForm(genres: readonly string[] | null | undefined): ReaderForm {
  const g = genres ?? []
  const isNovel = g.some((x) => x.includes("Novel") || x.includes("Short Stor"))

  // Drama: explicit stage markers and not a novel (Comedy/Tragedy alone could
  // be a comedic short story or a tragic novel — require "Drama"/"History Play").
  if (g.some((x) => DRAMA_MARKERS.includes(x)) && !isNovel) return "drama"

  // Verse / epics (which are verse) and not a prose novel.
  const isVerse = g.some((x) => VERSE_MARKERS.includes(x)) || g.some((x) => EPIC_MARKERS.includes(x))
  if (isVerse && !isNovel) return "poetry"

  // Non-fiction nuance (minor — mostly ragged-right default).
  if (!isNovel && g.some((x) => NONFICTION_MARKERS.includes(x))) return "nonfiction"

  return "prose"
}

/** Legacy `.content-*` class so the existing prose/verse/drama CSS keeps applying. */
export function readerFormToContentClass(form: ReaderForm): string {
  switch (form) {
    case "drama":
      return "content-drama"
    case "poetry":
      return "content-verse"
    case "nonfiction":
    case "prose":
    default:
      return "content-prose"
  }
}
