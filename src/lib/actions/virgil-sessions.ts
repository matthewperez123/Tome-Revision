"use server"

import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import { requireUser, ok, fail, type ActionResult } from "@/lib/actions/_shared"
import { MODEL_BY_TIER } from "@/lib/virgil/types"

/**
 * Lifecycle for Virgil's 1:1 guided reading sessions. Streaming of each turn
 * lives in `/api/virgil/guided`; these actions cover start / list / fetch /
 * end (with a Virgil-authored summary). All RLS-scoped to the caller.
 */

const Uuid = z.string().uuid()

export interface GuidedSessionMeta {
  id: string
  bookId: string
  chapter: number | null
  status: "active" | "completed"
  modelUsed: string | null
  summary: string | null
  startedAt: string
  endedAt: string | null
  messageCount: number
}

export interface GuidedSessionMessage {
  id: string
  role: "user" | "virgil" | "system"
  content: string
  createdAt: string
}

interface SessionRow {
  id: string
  book_id: string
  chapter: number | null
  status: "active" | "completed"
  model_used: string | null
  summary: string | null
  started_at: string
  ended_at: string | null
}

function toMeta(row: SessionRow, messageCount: number): GuidedSessionMeta {
  return {
    id: row.id,
    bookId: row.book_id,
    chapter: row.chapter,
    status: row.status,
    modelUsed: row.model_used,
    summary: row.summary,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    messageCount,
  }
}

/**
 * Start (or resume) a guided session for a book/chapter. If an active session
 * for the same book + chapter already exists, return it so the reader picks up
 * where they left off rather than spawning duplicates.
 */
export async function startGuidedSession(
  bookId: string,
  chapter: number | null,
): Promise<ActionResult<{ sessionId: string; resumed: boolean }>> {
  const parsedBook = z.string().min(1).max(200).safeParse(bookId)
  if (!parsedBook.success) return fail("A book is required to begin.")
  const parsedChapter = z.number().int().min(0).nullable().safeParse(chapter)
  if (!parsedChapter.success) return fail("Invalid chapter.")

  let supabase, user
  try {
    ;({ supabase, user } = await requireUser())
  } catch {
    return fail("Please sign in to read with Virgil.")
  }

  let existingQuery = supabase
    .from("virgil_guided_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("book_id", parsedBook.data)
    .eq("status", "active")
  existingQuery =
    parsedChapter.data == null
      ? existingQuery.is("chapter", null)
      : existingQuery.eq("chapter", parsedChapter.data)
  const { data: existing } = await existingQuery.limit(1).maybeSingle()
  if (existing?.id) return ok({ sessionId: existing.id as string, resumed: true })

  const { data: created, error } = await supabase
    .from("virgil_guided_sessions")
    .insert({ user_id: user.id, book_id: parsedBook.data, chapter: parsedChapter.data })
    .select("id")
    .single()
  if (error || !created) return fail("Virgil couldn't open a session just now.")
  return ok({ sessionId: created.id as string, resumed: false })
}

/** List the caller's guided sessions, newest first, with message counts. */
export async function listGuidedSessions(): Promise<ActionResult<GuidedSessionMeta[]>> {
  let supabase, user
  try {
    ;({ supabase, user } = await requireUser())
  } catch {
    return fail("Please sign in.")
  }

  const { data: rows } = await supabase
    .from("virgil_guided_sessions")
    .select("id, book_id, chapter, status, model_used, summary, started_at, ended_at")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
  const sessions = (rows as SessionRow[] | null) ?? []
  if (sessions.length === 0) return ok([])

  // One grouped count query for all sessions.
  const ids = sessions.map((s) => s.id)
  const { data: msgRows } = await supabase
    .from("virgil_session_messages")
    .select("session_id, role")
    .in("session_id", ids)
    .in("role", ["user", "virgil"])
  const counts = new Map<string, number>()
  for (const m of (msgRows as { session_id: string }[] | null) ?? []) {
    counts.set(m.session_id, (counts.get(m.session_id) ?? 0) + 1)
  }

  return ok(sessions.map((s) => toMeta(s, counts.get(s.id) ?? 0)))
}

/** Fetch one session + its full visible transcript (user + Virgil turns). */
export async function getGuidedSession(
  sessionId: string,
): Promise<ActionResult<{ session: GuidedSessionMeta; messages: GuidedSessionMessage[] }>> {
  const parsed = Uuid.safeParse(sessionId)
  if (!parsed.success) return fail("Invalid session.")

  let supabase, user
  try {
    ;({ supabase, user } = await requireUser())
  } catch {
    return fail("Please sign in.")
  }

  const { data: row } = await supabase
    .from("virgil_guided_sessions")
    .select("id, book_id, chapter, status, model_used, summary, started_at, ended_at")
    .eq("id", parsed.data)
    .eq("user_id", user.id)
    .maybeSingle()
  if (!row) return fail("Session not found.")

  const { data: msgs } = await supabase
    .from("virgil_session_messages")
    .select("id, role, content, created_at")
    .eq("session_id", parsed.data)
    .in("role", ["user", "virgil"])
    .order("created_at", { ascending: true })
  const messages = ((msgs as { id: string; role: GuidedSessionMessage["role"]; content: string; created_at: string }[] | null) ?? []).map(
    (m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.created_at }),
  )

  return ok({ session: toMeta(row as SessionRow, messages.length), messages })
}

/**
 * End a session: have Virgil write a short reflective summary from the
 * transcript, store it, and mark the session completed. The summary surfaces
 * on the profile and the session-summary view. Real Anthropic only.
 */
export async function endGuidedSession(
  sessionId: string,
): Promise<ActionResult<{ summary: string }>> {
  const parsed = Uuid.safeParse(sessionId)
  if (!parsed.success) return fail("Invalid session.")

  let supabase, user
  try {
    ;({ supabase, user } = await requireUser())
  } catch {
    return fail("Please sign in.")
  }

  const { data: row } = await supabase
    .from("virgil_guided_sessions")
    .select("id, book_id, chapter, status, model_used, summary, started_at, ended_at")
    .eq("id", parsed.data)
    .eq("user_id", user.id)
    .maybeSingle()
  const session = row as SessionRow | null
  if (!session) return fail("Session not found.")
  if (session.status === "completed") {
    return ok({ summary: session.summary ?? "" })
  }

  const { data: msgs } = await supabase
    .from("virgil_session_messages")
    .select("role, content")
    .eq("session_id", parsed.data)
    .in("role", ["user", "virgil"])
    .order("created_at", { ascending: true })
  const transcript = ((msgs as { role: string; content: string }[] | null) ?? [])
    .map((m) => `${m.role === "virgil" ? "Virgil" : "Reader"}: ${m.content}`)
    .join("\n\n")

  const apiKey = process.env.ANTHROPIC_API_KEY
  let summary = ""
  if (transcript.trim() && apiKey) {
    try {
      const client = new Anthropic({ apiKey })
      const model = MODEL_BY_TIER.haiku
      const resp = await client.messages.create({
        model,
        max_tokens: 320,
        system:
          "You are Virgil, a warm literary guide. In 2–4 sentences, write a brief, encouraging reflection on this guided reading conversation: what the reader explored and one thread worth returning to. Address the reader as \"you.\" No preamble, no headings — just the reflection.",
        messages: [{ role: "user", content: `Here is our conversation:\n\n${transcript}` }],
      })
      const block = resp.content.find((c) => c.type === "text")
      summary = block && block.type === "text" ? block.text.trim() : ""
    } catch (err) {
      console.error("Guided summary failed:", err)
    }
  }
  if (!summary) {
    summary = "A guided reading with Virgil. Reopen it any time to keep the conversation going."
  }

  const { error } = await supabase
    .from("virgil_guided_sessions")
    .update({ status: "completed", summary, ended_at: new Date().toISOString() })
    .eq("id", parsed.data)
    .eq("user_id", user.id)
  if (error) return fail("Couldn't close the session.")

  return ok({ summary })
}
