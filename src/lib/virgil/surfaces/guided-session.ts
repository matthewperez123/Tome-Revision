import "server-only"

import type { VirgilSurfaceProfile } from "@/lib/virgil/profile"
import type { VirgilSurface } from "@/lib/virgil/types"
import { stripHtml } from "@/lib/teacher-quiz/generate"
import { VIRGIL_TEACHER_TOOLS } from "@/lib/virgil/tools"

type GuidedSurface = Extract<VirgilSurface, { kind: "guided-session" }>

interface GuidedContext {
  role: "teacher" | "student"
  sessionTitle: string
  bookTitle: string | null
  readingLabel: string | null
  passage: string
  discussionPrompts: string[]
  participantCount: number
}

const MAX_PASSAGE = 18_000

/**
 * Guided Sessions — a Socratic facilitator present in the session. Students may
 * ask about the passage, request orientation, and clarify vocabulary/context
 * WITHOUT being handed answers (this mirrors the progressive hint ladder rather
 * than duplicating it). Teachers may generate discussion prompts, summarize the
 * conversation, and decide where to steer. Read-only.
 */
export const guidedSessionProfile: VirgilSurfaceProfile<GuidedSurface, GuidedContext> = {
  kind: "guided-session",
  allowedRole: "both",
  modelTier: "sonnet",

  // Teachers get the agentic tool-belt (quiz generation, recommendations,
  // semester planning); students stay on the plain Socratic stream.
  tools: (role) => (role === "teacher" ? VIRGIL_TEACHER_TOOLS : []),

  async gatherContext({ surface, supabase, userId, role }) {
    const { data: session } = await supabase
      .from("guided_sessions")
      .select("teacher_id, title, book_id, chapter_index")
      .eq("id", surface.sessionId)
      .single()

    const s = session as
      | { teacher_id: string; title: string | null; book_id: string | null; chapter_index: number | null }
      | null

    // Role for THIS session: teacher iff they own it (never trust the client).
    const sessionRole: "teacher" | "student" = s && s.teacher_id === userId ? "teacher" : role

    let bookTitle: string | null = null
    if (s?.book_id) {
      const { data: book } = await supabase.from("books").select("title").eq("id", s.book_id).single()
      bookTitle = (book as { title?: string } | null)?.title ?? null
    }

    // Reading + reflection stations: passage to ground on, prompts to weave in.
    const { data: stations } = await supabase
      .from("guided_session_stations")
      .select("type, title, book_id, chapter_start, chapter_end, reflection_prompt")
      .eq("session_id", surface.sessionId)
      .order("station_index", { ascending: true })

    const stationRows = (stations ?? []) as {
      type: string
      title: string | null
      book_id: string | null
      chapter_start: number | null
      chapter_end: number | null
      reflection_prompt: string | null
    }[]

    const discussionPrompts = stationRows
      .map((st) => st.reflection_prompt)
      .filter((p): p is string => !!p && p.trim().length > 0)

    // Build a grounded passage from the first reading station (or the legacy
    // single-chapter session), capped for cost.
    const reading = stationRows.find((st) => st.type === "reading" && st.book_id)
    let passage = ""
    let readingLabel: string | null = null
    const passageBookId = reading?.book_id ?? s?.book_id ?? null
    if (passageBookId) {
      const start = reading?.chapter_start ?? s?.chapter_index ?? null
      const end = reading?.chapter_end ?? start
      let q = supabase
        .from("chapters")
        .select("chapter_index, title, content_html")
        .eq("book_id", passageBookId)
        .order("chapter_index", { ascending: true })
      if (start != null) q = q.gte("chapter_index", start)
      if (end != null) q = q.lte("chapter_index", end)
      const { data: chapters } = await q.limit(6)
      const rows = (chapters ?? []) as { chapter_index: number; title: string | null; content_html: string | null }[]
      if (rows.length) {
        readingLabel =
          start != null ? `chapters ${start}${end != null && end !== start ? `–${end}` : ""}` : null
        let budget = MAX_PASSAGE
        const parts: string[] = []
        for (const ch of rows) {
          if (budget <= 0) break
          const slice = stripHtml(ch.content_html ?? "").slice(0, budget)
          budget -= slice.length
          parts.push(`[Chapter ${ch.chapter_index}${ch.title ? `: ${ch.title}` : ""}]\n${slice}`)
        }
        passage = parts.join("\n\n").trim()
      }
    }

    const { count } = await supabase
      .from("guided_session_participants")
      .select("id", { count: "exact", head: true })
      .eq("session_id", surface.sessionId)

    return {
      role: sessionRole,
      sessionTitle: s?.title ?? "this session",
      bookTitle,
      readingLabel,
      passage,
      discussionPrompts,
      participantCount: count ?? 0,
    }
  },

  buildSystemPrompt(ctx) {
    const passageBlock = ctx.passage
      ? `You are grounded in this passage${ctx.readingLabel ? ` (${ctx.readingLabel})` : ""} from ${
          ctx.bookTitle ?? "the reading"
        } — quote it, never invent beyond it:\n"""\n${ctx.passage}\n"""`
      : `There is no ingested passage for this session yet; help with the discussion at a general level and do not invent textual detail.`

    const prompts = ctx.discussionPrompts.length
      ? `The teacher's discussion questions to weave into reflection (do not answer them for the student):\n${ctx.discussionPrompts
          .map((p) => `- ${p}`)
          .join("\n")}`
      : "The teacher has not authored discussion questions yet."

    if (ctx.role === "teacher") {
      return `You are Virgil — a warm, erudite Socratic facilitator inside a live Tome guided session ("${ctx.sessionTitle}", ${ctx.participantCount} participant(s)). You are speaking privately with the TEACHER. Speak in the first person, like a co-teacher.

${passageBlock}

${prompts}

Help the teacher: generate fresh discussion prompts grounded in the passage, summarize where the conversation seems to be going, and suggest where to steer next. Keep replies tight and practical.

You also have tools. When the teacher asks for one, use it rather than describing it:
- generate_teacher_quiz — author and save a real, text-grounded quiz on a book/chapters. Confirm the saved quiz's title and that it's a draft to review.
- recommend_books — suggest readable books for a level/theme; rank only what the tool returns.
- create_semester_plan — draft a multi-week reading plan (preview only, not saved).
If a tool returns candidates or asks for disambiguation, ask the teacher a brief clarifying question before proceeding.`
    }

    return `You are Virgil — a warm, erudite Socratic facilitator present in a live Tome guided session about ${
      ctx.bookTitle ?? "this reading"
    }. You are speaking with a STUDENT. Speak in the first person, like a guide who reads alongside them.

${passageBlock}

${prompts}

How to help a student, live:
- Support inquiry. Ask guiding questions, point them to where in the passage to look, clarify vocabulary and historical context.
- NEVER hand over answers to the discussion questions or quiz. If they ask for "the answer," orient them like a hint would: first where to look, then the approach — but they must commit to the thought themselves.
- No spoilers beyond the assigned passage.
Keep replies short and Socratic — a question or a nudge, not a lecture.`
  },
}
