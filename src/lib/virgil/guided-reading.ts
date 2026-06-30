import "server-only"

import { stripHtml } from "@/lib/teacher-quiz/generate"
import { MODEL_BY_TIER, type ModelTier } from "@/lib/virgil/types"
import type { SupaClient } from "@/lib/actions/_shared"

/**
 * Virgil's 1:1 guided reading mode — shared server helpers used by both the
 * streaming route (`/api/virgil/guided`) and the end-of-session summary action.
 *
 * This is distinct from the teacher `guided_sessions` surface: it is a private
 * reader↔Virgil conversation, grounded in the chapter the reader is on, that
 * persists every turn and resumes where it left off.
 */

/** The hidden opening turn. Never persisted — it primes Virgil's first reply
 *  and is re-prepended on resume so the model array always starts with `user`. */
export const KICKOFF_PROMPT =
  "I've just opened this part of the book and started a guided reading with you. Welcome me warmly in a sentence or two and offer one inviting way we might begin — a question, an image to notice, or a theme to hold onto."

const MAX_PASSAGE = 16_000

export interface GuidedReadingContext {
  bookTitle: string
  bookAuthor: string | null
  chapterTitle: string | null
  chapterLabel: string | null
  passage: string
}

/**
 * Gather the grounding context for a guided reading session. Reads the chapter
 * text from the `chapters` table (book_id is the plain slug used app-wide).
 * Falls back gracefully when a chapter row isn't ingested yet.
 */
export async function gatherGuidedContext(
  supabase: SupaClient,
  bookId: string,
  chapter: number | null,
): Promise<GuidedReadingContext> {
  const { data: bookRow } = await supabase
    .from("books")
    .select("title, author")
    .eq("id", bookId)
    .maybeSingle()
  const book = bookRow as { title?: string; author?: string } | null
  const bookTitle = book?.title?.trim() || prettifySlug(bookId)
  const bookAuthor = book?.author?.trim() || null

  let chapterTitle: string | null = null
  let passage = ""
  if (chapter != null) {
    const { data: chapterRow } = await supabase
      .from("chapters")
      .select("title, content_html")
      .eq("book_id", bookId)
      .eq("chapter_index", chapter)
      .maybeSingle()
    const ch = chapterRow as { title?: string | null; content_html?: string | null } | null
    chapterTitle = ch?.title?.trim() || null
    passage = stripHtml(ch?.content_html ?? "").slice(0, MAX_PASSAGE).trim()
  }

  const chapterLabel = chapter != null ? `chapter ${chapter}` : null

  return { bookTitle, bookAuthor, chapterTitle, chapterLabel, passage }
}

/** Build Virgil's system prompt, grounded strictly in the chapter passage. */
export function buildGuidedSystemPrompt(ctx: GuidedReadingContext): string {
  const where = ctx.chapterTitle
    ? `${ctx.chapterLabel ? `${ctx.chapterLabel} — ` : ""}"${ctx.chapterTitle}"`
    : ctx.chapterLabel ?? "the opening"

  const passageBlock = ctx.passage
    ? `You are grounded in this passage from ${ctx.bookTitle} (${where}). Quote and reason from it; never invent text beyond it:\n"""\n${ctx.passage}\n"""`
    : `The text of this section isn't available to you yet, so help at a general level about ${ctx.bookTitle} and do not invent specific textual detail.`

  return `You are Virgil — the warm, erudite literary guide named for the poet who led Dante. You are reading ${ctx.bookTitle}${
    ctx.bookAuthor ? ` by ${ctx.bookAuthor}` : ""
  } alongside a single reader, in a private guided session. Speak in the first person, like a companion who reads with them.

${passageBlock}

How to guide, one-to-one:
- Be Socratic and brief — a question, an observation, or a nudge, rarely a lecture. Two or three short paragraphs at most.
- Ground every claim in the passage above; point them to where to look before you interpret.
- Illuminate vocabulary, allusion, and historical context when it helps them see more.
- Never spoil beyond this section. If they ask for "the answer," orient them — where to look, then the approach — and let them complete the thought.
- Warm, plainspoken, never pretentious. You love this book and want them to love it too.`
}

/**
 * The dispatcher: pick a model tier by the complexity of the reader's turn.
 * Short clarifications go to Haiku; ordinary discussion to Sonnet; deep
 * interpretive/analytical asks to Opus. Returns the concrete model id too.
 */
export function pickGuidedModel(message: string | null, historyTurns: number): {
  tier: ModelTier
  model: string
} {
  const tier = pickGuidedTier(message, historyTurns)
  return { tier, model: MODEL_BY_TIER[tier] }
}

const DEEP_SIGNALS =
  /\b(analy[sz]e|interpret|interpretation|symbol|symboli|metaphor|allegor|theme|thematic|significance|why does|why is|compare|contrast|irony|moral|philosoph|ambigu|critique|argue|argument|meaning of)\b/i
const SHALLOW_SIGNALS =
  /\b(who is|who's|what is|what's|define|definition|meaning of the word|pronounce|when did|where is|where does|how many|spell|translate)\b/i

function pickGuidedTier(message: string | null, historyTurns: number): ModelTier {
  // The opening turn (no reader message yet) is a gentle welcome → Haiku.
  if (!message) return "haiku"
  const text = message.trim()

  if (DEEP_SIGNALS.test(text)) return "opus"
  // Long, multi-clause asks tend to want the strongest reasoning.
  if (text.length > 320 || (text.match(/\?/g)?.length ?? 0) >= 2) return "opus"

  if (SHALLOW_SIGNALS.test(text) && text.length < 90) return "haiku"
  if (text.length < 40 && historyTurns <= 1) return "haiku"

  return "sonnet"
}

function prettifySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
}
