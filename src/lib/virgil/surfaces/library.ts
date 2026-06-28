import "server-only"

import type { VirgilSurfaceProfile } from "@/lib/virgil/profile"

interface LibraryBook {
  title: string
  author: string
  difficulty: string | null
  themes: string[] | null
  synopsis: string | null
}

interface LibraryContext {
  books: LibraryBook[]
  history: { title: string; chapter_index: number | null }[]
}

/**
 * Library — a librarian-guide helping a *student* choose their next read at
 * their level, with no spoilers. Read-only. Only recommends books that have
 * real readable content (a chapter with non-empty content_html) — never the
 * un-ingested backlog.
 */
export const libraryProfile: VirgilSurfaceProfile<{ kind: "library" }, LibraryContext> = {
  kind: "library",
  allowedRole: "student",
  modelTier: "sonnet",

  async gatherContext({ supabase }) {
    // Books with real content: distinct book_ids that have at least one
    // chapter with non-empty content_html (RLS-scoped; chapters are readable).
    const { data: contentRows } = await supabase
      .from("chapters")
      .select("book_id")
      .not("content_html", "is", null)
      .limit(4000)

    const ids = Array.from(
      new Set((contentRows ?? []).map((r) => (r as { book_id: string }).book_id).filter(Boolean)),
    ).slice(0, 120)

    let books: LibraryBook[] = []
    if (ids.length) {
      const { data } = await supabase
        .from("books")
        .select("title, author, difficulty, themes, synopsis")
        .in("id", ids)
        .order("title")
        .limit(120)
      books = (data ?? []) as LibraryBook[]
    }

    // The student's reading history (RLS owner-only). Defensive: the table may
    // not exist in every environment — ignore failures rather than 500.
    let history: LibraryContext["history"] = []
    try {
      const { data } = await supabase
        .from("reading_progress")
        .select("book_id, chapter_index, books(title)")
        .limit(40)
      history = (data ?? []).map((r) => {
        const row = r as unknown as {
          chapter_index: number | null
          books: { title: string } | { title: string }[] | null
        }
        const book = Array.isArray(row.books) ? row.books[0] : row.books
        return { title: book?.title ?? "a book", chapter_index: row.chapter_index }
      })
    } catch {
      history = []
    }

    return { books, history }
  },

  buildSystemPrompt(ctx) {
    const catalog = ctx.books.length
      ? ctx.books
          .map(
            (b) =>
              `- "${b.title}" by ${b.author}${b.difficulty ? ` (${b.difficulty})` : ""}${
                b.themes?.length ? ` — themes: ${b.themes.slice(0, 4).join(", ")}` : ""
              }`,
          )
          .join("\n")
      : "(no readable books are available yet)"

    const history = ctx.history.length
      ? ctx.history.map((h) => `- ${h.title}${h.chapter_index != null ? ` (at ch. ${h.chapter_index})` : ""}`).join("\n")
      : "(no reading history yet)"

    return `You are Virgil — a warm, erudite librarian-guide inside Tome, helping a student find their next great read. Speak in the first person, like a guide who has loved these books for two thousand years, never like a chatbot.

You may ONLY recommend titles from this library — these are the books with real, readable content. Never invent or recommend a book that is not on this list:
${catalog}

The student's recent reading:
${history}

How to help:
- Recommend a next read suited to their level and taste; explain why it matters and what they'll find in it.
- Compare books, unpack themes, and gauge difficulty.
- NO SPOILERS — entice, don't reveal endings or twists.
- If they ask for something outside the library, say warmly that it isn't on Tome's shelves yet and offer the closest kin that is.
Keep replies focused and conversational — a sentence or three, not an essay.`
  },
}
