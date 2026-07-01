import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { VIRGIL_VOICE } from "@/lib/virgil/types"
import {
  KICKOFF_PROMPT,
  gatherGuidedContext,
  buildGuidedSystemPrompt,
  pickGuidedModel,
} from "@/lib/virgil/guided-reading"

export const maxDuration = 60

const bodySchema = z.object({
  sessionId: z.string().uuid(),
  // Omitted (or empty) ⇒ kickoff: Virgil opens the session himself.
  message: z.string().trim().min(1).max(8000).optional(),
})

interface SessionRow {
  id: string
  user_id: string
  book_id: string
  chapter: number | null
  status: "active" | "completed"
}
interface MessageRow {
  role: "user" | "virgil" | "system"
  content: string
}

function textOnce(text: string, status = 200): Response {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    },
  })
  return new Response(stream, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

/**
 * POST /api/virgil/guided — stream one turn of a private guided reading
 * session. Authenticates, loads the caller's own session (RLS-scoped), grounds
 * Virgil in the chapter text, selects a model by complexity, streams the reply
 * as raw text, and persists BOTH the reader's turn and Virgil's reply so the
 * conversation resumes later. No mock — real Anthropic only.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  // Virgil is a teacher-only system; the student 1:1 guided-reading surface is
  // retired. This gate matches /api/virgil so no non-teacher can invoke Virgil
  // through this route by direct URL.
  const { data: profileRow } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profileRow?.role !== "teacher") {
    return Response.json({ error: "Virgil is available to teachers only." }, { status: 403 })
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }
  const { sessionId, message } = parsed.data

  // RLS already restricts this to the caller's own rows; the explicit guard
  // turns a not-found into a clean 404 and rejects closed sessions.
  const { data: sessionData } = await supabase
    .from("virgil_guided_sessions")
    .select("id, user_id, book_id, chapter, status")
    .eq("id", sessionId)
    .maybeSingle()
  const session = sessionData as SessionRow | null
  if (!session || session.user_id !== user.id) {
    return Response.json({ error: "Session not found" }, { status: 404 })
  }
  if (session.status !== "active") {
    return Response.json({ error: "This session has ended." }, { status: 409 })
  }

  const { data: priorData } = await supabase
    .from("virgil_session_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .in("role", ["user", "virgil"])
    .order("created_at", { ascending: true })
  const prior = (priorData as MessageRow[] | null) ?? []

  const isKickoff = !message
  if (isKickoff && prior.length > 0) {
    // Nothing to open — the panel should send a real turn instead.
    return Response.json({ error: "Session already started." }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return textOnce(
      "Virgil isn't configured on this server yet — my voice needs an ANTHROPIC_API_KEY to speak.",
    )
  }

  // Build the model's message array (must start with `user`, then alternate).
  const modelMessages: Anthropic.MessageParam[] = prior.map((m) => ({
    role: m.role === "virgil" ? "assistant" : "user",
    content: m.content,
  }))
  if (modelMessages.length > 0 && modelMessages[0].role === "assistant") {
    // The persisted history opens with Virgil's welcome; re-prepend the hidden
    // kickoff so the array is valid without ever storing it.
    modelMessages.unshift({ role: "user", content: KICKOFF_PROMPT })
  }
  if (isKickoff) {
    modelMessages.push({ role: "user", content: KICKOFF_PROMPT })
  } else {
    modelMessages.push({ role: "user", content: message })
    // Persist the reader's turn before streaming so it survives a dropped stream.
    await supabase
      .from("virgil_session_messages")
      .insert({ session_id: sessionId, role: "user", content: message })
  }

  let ctx
  try {
    ctx = await gatherGuidedContext(supabase, session.book_id, session.chapter)
  } catch (err) {
    console.error("Guided gatherContext failed:", err)
    return textOnce(VIRGIL_VOICE.error)
  }
  const system = buildGuidedSystemPrompt(ctx)
  const { model } = pickGuidedModel(message ?? null, prior.length)

  const client = new Anthropic({ apiKey })
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      let accumulated = ""
      try {
        const ms = client.messages.stream({
          model,
          max_tokens: 1024,
          system,
          messages: modelMessages,
        })
        for await (const event of ms) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            accumulated += event.delta.text
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch (err) {
        console.error("Guided stream failed:", err)
        if (!accumulated) controller.enqueue(encoder.encode(VIRGIL_VOICE.error))
      } finally {
        controller.close()
        // Persist Virgil's reply + record the model used (best-effort).
        if (accumulated.trim()) {
          await supabase
            .from("virgil_session_messages")
            .insert({ session_id: sessionId, role: "virgil", content: accumulated, model })
          await supabase
            .from("virgil_guided_sessions")
            .update({ model_used: model })
            .eq("id", sessionId)
        }
      }
    },
  })

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
