import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { VIRGIL_REGISTRY } from "@/lib/virgil/registry"
import { runVirgilToolLoop } from "@/lib/virgil/tools"
import { MODEL_BY_TIER, VIRGIL_VOICE } from "@/lib/virgil/types"
import { isTeacherTask, handleTeacherTask } from "@/lib/virgil/teacher-tasks"

export const maxDuration = 60

/** Abuse-prevention cap on daily Virgil calls per teacher. Teacher cost is
 *  trivial, so this is set high — it exists only to bound runaway usage. */
const MAX_DAILY_VIRGIL_CALLS = 500

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

/**
 * Count this task against the caller's virgil_usage ledger for the current UTC
 * day. The table revokes client writes, so we use the service-role client:
 * read the running count for (user_id, usage_date) and upsert it + 1 on the
 * (user_id, usage_date) primary key.
 */
async function recordTaskUsage(userId: string): Promise<void> {
  // virgil_usage isn't in the generated Database types, so the typed client
  // infers `never`; cast to a loose client for this ad-hoc ledger write.
  const admin = createAdminClient() as unknown as SupabaseClient
  const usageDate = new Date().toISOString().slice(0, 10) // UTC YYYY-MM-DD

  const { data: existing } = await admin
    .from("virgil_usage")
    .select("message_count")
    .eq("user_id", userId)
    .eq("usage_date", usageDate)
    .maybeSingle()

  const messageCount = ((existing?.message_count as number | undefined) ?? 0) + 1

  const { error } = await admin
    .from("virgil_usage")
    .upsert(
      { user_id: userId, usage_date: usageDate, message_count: messageCount },
      { onConflict: "user_id,usage_date" },
    )
  if (error) console.error("[virgil] virgil_usage upsert failed:", error.message)
}

/** Whether the teacher has already hit today's abuse-prevention cap. */
async function isOverDailyCap(userId: string): Promise<boolean> {
  const admin = createAdminClient() as unknown as SupabaseClient
  const usageDate = new Date().toISOString().slice(0, 10)
  const { data } = await admin
    .from("virgil_usage")
    .select("message_count")
    .eq("user_id", userId)
    .eq("usage_date", usageDate)
    .maybeSingle()
  return ((data?.message_count as number | undefined) ?? 0) >= MAX_DAILY_VIRGIL_CALLS
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

  // Virgil is a teacher-only system. This single gate covers the ENTIRE
  // endpoint — every task, surface, and registry key — so no leftover
  // student-era key is reachable by a non-teacher. Increments still fire
  // per call (now teacher-only) purely for observability; the daily cap is
  // abuse-prevention set high because teacher cost is trivial.
  const { data: profileRow } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profileRow?.role !== "teacher") {
    return Response.json({ error: "Virgil is available to teachers only." }, { status: 403 })
  }

  if (await isOverDailyCap(user.id)) {
    return Response.json(
      { error: `You've reached today's Virgil limit of ${MAX_DAILY_VIRGIL_CALLS} requests.` },
      { status: 429 },
    )
  }

  const raw = await request.json().catch(() => null)

  // Teacher task pipeline (quiz builder, semester planner, grader, etc.).
  // Distinguished from the chat surface by the presence of a `task` field.
  if (raw && typeof raw === "object" && "task" in raw) {
    const task = (raw as { task?: unknown }).task
    if (isTeacherTask(task)) {
      return handleTeacherTask(task, raw, {
        userId: user.id,
        supabase,
        record: () => recordTaskUsage(user.id),
      })
    }
    return Response.json({ error: "Unknown task" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return Response.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }
  const { messages, surface } = parsed.data

  const profile = VIRGIL_REGISTRY[surface.kind]
  if (!profile) return Response.json({ error: "Unknown surface" }, { status: 404 })

  // The endpoint is teacher-gated above, so the role is always "teacher" here.
  const role: "teacher" = "teacher"

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
          void recordTaskUsage(user.id)
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
        void recordTaskUsage(user.id)
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
