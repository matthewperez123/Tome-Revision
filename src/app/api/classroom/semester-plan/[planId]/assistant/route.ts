import { NextResponse } from "next/server"
import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { assembleCandidates } from "@/lib/semester-plan/catalog"
import { generateSemesterPlan } from "@/lib/semester-plan/generate"
import { hydratePlan, rematerializePlan } from "@/lib/semester-plan/persist"
import { loadOwnedPlan, planToGenerated, setupFromPlanRow } from "@/lib/semester-plan/mutations"
import type { SemesterPlan } from "@/lib/semester-plan/types"

export const maxDuration = 120

const CHAT_MODEL = "claude-sonnet-4-6"

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
})

const REVISE_TOOL: Anthropic.Tool = {
  name: "revise_plan",
  description:
    "Apply the teacher's requested change to the semester plan. Re-sequences books " +
    "from the same candidate catalog and recomputes pacing. Use scope 'week' (with " +
    "weekIndex) for a change confined to one week, or scope 'term' for changes that " +
    "span the whole plan. Call this once you understand what the teacher wants; if " +
    "they are vague, proceed with a sensible interpretation rather than interrogating them.",
  input_schema: {
    type: "object",
    properties: {
      scope: {
        type: "string",
        enum: ["term", "week"],
        description: "Whether the edit touches the whole term or a single week.",
      },
      weekIndex: {
        type: "integer",
        minimum: 1,
        description: "The 1-based week to regenerate. Required when scope is 'week'.",
      },
      instruction: {
        type: "string",
        description:
          "A precise, self-contained editing instruction to apply, e.g. " +
          "'add a discussion item to weeks that only have reading' or " +
          "'swap the week 4 novel for a shorter, more accessible work'.",
      },
    },
    required: ["scope", "instruction"],
  },
}

/** Compact, text-free summary of the current plan for the chat model. */
function planSummary(plan: SemesterPlan): string {
  const themes = plan.goals?.themes?.length ? plan.goals.themes.join(", ") : "(none)"
  const cap = plan.constraints?.maxMinutesPerWeek
  const head = `Title: "${plan.title}" · ${plan.weeks} weeks · themes: ${themes}${
    cap ? ` · load cap ${cap} min/week` : ""
  }`
  const weeks = plan.week_list
    .map((w) => {
      const items = w.items.map((it) => `${it.type}: ${it.title}`).join("; ")
      return `Week ${w.week_index} — ${w.theme ?? "(untitled)"} [${w.load_minutes}m${
        w.over_cap ? " · OVER CAP" : ""
      }]: ${items || "break (no reading)"}`
    })
    .join("\n")
  return `${head}\n\n${weeks}`
}

/**
 * POST /api/classroom/semester-plan/[planId]/assistant
 *
 * Conversational front door to Virgil semester planning. The teacher chats in
 * natural language; Virgil either replies or calls the revise_plan tool, in
 * which case we run the same grounded revision pipeline as /revise and return a
 * conversational reply plus an `applied` flag so the board can refresh.
 * Draft-only; provisioned plans are frozen.
 */
export async function POST(request: Request, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const planRow = await loadOwnedPlan(supabase, planId, user.id)
  if (!planRow) return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  if (planRow.status !== "draft") {
    return NextResponse.json({ error: "Only draft plans can be revised" }, { status: 409 })
  }

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }
  const body = parsed.data

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { reply: "Virgil isn't configured on this server yet (missing ANTHROPIC_API_KEY)." },
      { status: 200 },
    )
  }

  const hydrated = await hydratePlan(supabase, planId)
  if (!hydrated) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

  const system = `You are Virgil, a warm, erudite teaching assistant inside Tome, helping a teacher refine a literature semester plan.

CURRENT PLAN:
${planSummary(hydrated)}

Chat briefly and naturally. When the teacher asks for a change to the plan, call revise_plan with a clear, self-contained instruction — choose scope "week" (with weekIndex) for a single-week change or "term" for anything broader. Infer sensible interpretations when they are vague; do NOT interrogate them. If they are only asking a question or chatting (not requesting an edit), just reply without calling the tool. Keep any text replies to 1-2 short sentences.`

  const client = new Anthropic({ apiKey })

  let resp: Anthropic.Message
  try {
    resp = await client.messages.create({
      model: CHAT_MODEL,
      max_tokens: 700,
      system,
      tools: [REVISE_TOOL],
      messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
    })
  } catch (err) {
    console.error("Virgil plan assistant chat failed:", err)
    return NextResponse.json({ reply: "I had trouble thinking that through — mind trying again?" }, { status: 200 })
  }

  const textBlock = resp.content.find((b) => b.type === "text")
  const preamble = textBlock && textBlock.type === "text" ? textBlock.text.trim() : ""
  const toolUse = resp.content.find((b) => b.type === "tool_use")

  // Pure conversational turn — no revision requested.
  if (!toolUse || toolUse.type !== "tool_use") {
    return NextResponse.json({
      reply: preamble || "Tell me what you'd like to change about the plan and I'll revise it.",
    })
  }

  const args = toolUse.input as { scope?: string; weekIndex?: number; instruction?: string }
  const toolInstruction = (args.instruction ?? "").trim()
  if (!toolInstruction) {
    return NextResponse.json({ reply: "I couldn't tell what to change — could you rephrase that?" })
  }

  // ── Ground + revise + persist (shared pipeline with /revise) ──
  const setup = setupFromPlanRow(planRow)
  const candidates = await assembleCandidates(supabase, setup)
  if (candidates.length === 0) {
    return NextResponse.json({ reply: "I couldn't assemble a book catalog to revise from. Try again in a moment." })
  }

  const weekScoped = args.scope === "week" && typeof args.weekIndex === "number" && args.weekIndex >= 1
  const instruction = weekScoped
    ? `Regenerate ONLY week ${args.weekIndex}, keeping every other week exactly as-is. Guidance: ${toolInstruction}`
    : toolInstruction

  let result
  try {
    result = await generateSemesterPlan({
      setup,
      candidates,
      revise: { current: planToGenerated(hydrated), instruction },
    })
  } catch (err) {
    console.error("Virgil plan assistant revision failed:", err)
    return NextResponse.json({ reply: "I hit a snag while reworking the plan. Want me to try again?" })
  }

  const re = await rematerializePlan({
    supabase,
    planId,
    termStart: setup.termStart,
    plan: result.plan,
    candidates,
    model: result.model,
  })
  if ("error" in re) {
    return NextResponse.json({ reply: "I reworked the plan but couldn't save it. Mind trying again?" })
  }

  const reply =
    preamble ||
    (weekScoped
      ? `Done — I reworked week ${args.weekIndex}. Take a look at the updated board.`
      : "Done — I revised the plan. The board has been updated.")

  return NextResponse.json({ reply, applied: true, model: result.model })
}
