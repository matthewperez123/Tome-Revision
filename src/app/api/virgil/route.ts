import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { VIRGIL_REGISTRY } from "@/lib/virgil/registry"
import { runVirgilToolLoop } from "@/lib/virgil/tools"
import { MODEL_BY_TIER, VIRGIL_VOICE, type AllowedRole } from "@/lib/virgil/types"

export const maxDuration = 60

const surfaceSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("library") }),
  z.object({ kind: z.literal("guided-session"), sessionId: z.string().min(1) }),
])

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) }))
    .min(1)
    .max(40),
  surface: surfaceSchema,
})

/** A 'teacher' role may use any surface; a 'student' may only use student/both surfaces. */
function authorized(allowed: AllowedRole, role: "teacher" | "student"): boolean {
  if (allowed === "teacher") return role === "teacher"
  return true
}

function textStream(text: string): Response {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    },
  })
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}

/**
 * POST /api/virgil — one generalized, streaming Virgil. Authenticates the user,
 * resolves the surface profile, authorizes the role server-side, gathers
 * RLS-scoped context, builds the system prompt, and streams the model's reply
 * as raw text the client appends to the assistant message.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }
  const { messages, surface } = parsed.data

  const profile = VIRGIL_REGISTRY[surface.kind]
  if (!profile) return Response.json({ error: "Unknown surface" }, { status: 404 })

  const { data: profileRow } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const role: "teacher" | "student" = profileRow?.role === "teacher" ? "teacher" : "student"
  if (!authorized(profile.allowedRole, role)) {
    return Response.json({ error: "You don't have access to this Virgil." }, { status: 403 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return textStream("Virgil isn't configured on this server yet — my voice needs an ANTHROPIC_API_KEY to speak.")
  }

  let ctx: unknown
  try {
    ctx = await profile.gatherContext({ surface: surface as never, supabase, userId: user.id, role })
  } catch (err) {
    console.error("Virgil gatherContext failed:", err)
    return textStream(VIRGIL_VOICE.error)
  }
  const system = profile.buildSystemPrompt(ctx)
  const model = MODEL_BY_TIER[profile.modelTier]

  const client = new Anthropic({ apiKey })
  const encoder = new TextEncoder()

  // Tool-enabled surfaces (teacher guided-session) run an agentic loop: the
  // model may call server-side tools before its final turn. Tool-use can't be
  // streamed token-by-token, so we resolve the final text then emit it.
  const tools = profile.tools?.(role) ?? []
  if (tools.length > 0) {
    const toolStream = new ReadableStream({
      async start(controller) {
        try {
          const text = await runVirgilToolLoop({
            client,
            model,
            system,
            messages,
            tools,
            supabase,
            userId: user.id,
          })
          controller.enqueue(encoder.encode(text || VIRGIL_VOICE.error))
        } catch (err) {
          console.error("Virgil tool loop failed:", err)
          controller.enqueue(encoder.encode(VIRGIL_VOICE.error))
        } finally {
          controller.close()
        }
      },
    })
    return new Response(toolStream, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const ms = client.messages.stream({
          model,
          max_tokens: 1024,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        })
        for await (const event of ms) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch (err) {
        console.error("Virgil stream failed:", err)
        controller.enqueue(encoder.encode(VIRGIL_VOICE.error))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
