import "server-only"

import Anthropic from "@anthropic-ai/sdk"
import {
  generatedPlanSchema,
  type CandidateBook,
  type GeneratedPlan,
  type PlanSetup,
} from "@/lib/semester-plan/types"
import { repairPlan, type RepairResult } from "@/lib/semester-plan/catalog"

// Whole-term planning needs real reasoning; haiku is too weak. Sonnet is the
// default; opus handles ambitious surveys + deep thematic threading.
const MODEL_SONNET = "claude-sonnet-4-6"
const MODEL_OPUS = "claude-opus-4-8"

export function choosePlanModel(setup: PlanSetup): string {
  if (setup.ambition === "ambitious" || setup.weeks >= 16) return MODEL_OPUS
  return MODEL_SONNET
}

// ── Catalog block (cached) ────────────────────────────────────────────────────

/** Compact, metadata-only catalog Virgil may sequence from. Never book text. */
function catalogBlock(candidates: CandidateBook[]): string {
  const lines = candidates.map(
    (b) =>
      `- ${b.id} :: "${b.title}" by ${b.author} | ${b.tradition} | ${b.era} | ` +
      `${b.tier ? "tier-1 " : ""}${b.difficulty} | ${b.chapter_count} ch | ` +
      `${b.reading_time_minutes} min total | ${b.has_chapter_content ? "readable" : "NOT-yet-readable"}`,
  )
  return `CANDIDATE CATALOG (sequence ONLY from these book ids):\n${lines.join("\n")}`
}

const CONTRACT = `Return ONLY strict JSON, no prose, no markdown fences:
{
  "weeks": [
    {
      "week_index": 1,
      "theme": "short thematic title",
      "notes": "optional one-line teacher note",
      "items": [
        { "type": "reading", "book_id": "<catalog id>", "chapter_refs": [1,2,3], "title": "Books I-III", "due_offset_days": 4 },
        { "type": "quiz", "book_id": "<catalog id>", "chapter_refs": [1,2,3], "difficulty": "apprentice", "title": "Trial: ..." },
        { "type": "essay", "title": "...", "description": "prompt", "due_offset_days": 6 }
      ]
    }
  ]
}

Rules:
- Use ONLY book_id values from the candidate catalog. Never invent a book or id.
- Prefer "readable" books for reading/quiz/guided_session items.
- type is one of: reading, quiz, guided_session, essay, discussion, custom_reading.
- chapter_refs are integer chapter indexes (from the catalog's chapter count) — only for catalog books.
- Do NOT compute dates or minute totals; use due_offset_days (0-6) only. Pacing is computed downstream.
- difficulty (apprentice|scholar|master) only on quiz items; ramp it up across the term.`

function buildInstruction(setup: PlanSetup): string {
  const themes = setup.goals.themes.length ? setup.goals.themes.join(", ") : "(none specified)"
  const objectives = setup.goals.objectives.length
    ? setup.goals.objectives.join("; ")
    : "(none specified)"
  const required = setup.constraints.requiredBookIds.length
    ? setup.constraints.requiredBookIds.join(", ")
    : "(none)"
  const cap = setup.constraints.maxMinutesPerWeek
    ? `${setup.constraints.maxMinutesPerWeek} minutes/week`
    : "(no hard cap, keep it reasonable)"
  const ceiling = setup.constraints.difficultyCeiling ?? "master"
  const breaks = setup.constraints.breakWeeks.length
    ? setup.constraints.breakWeeks.join(", ")
    : "(none)"

  return `You are Virgil, designing a ${setup.weeks}-week literature semester plan${
    setup.level ? ` for ${setup.level}` : ""
  }.

Course goals/themes: ${themes}
Learning objectives: ${objectives}
Required books (MUST appear): ${required}
Reading-load target: ${cap}
Difficulty ceiling: ${ceiling}
Break weeks (no new reading): ${breaks}
Meetings/week: ${setup.cadence.meetingsPerWeek}
${setup.focus ? `Teacher steer: ${setup.focus}` : ""}

Sequence books from the candidate catalog into exactly ${setup.weeks} weeks. Build a
coherent thematic arc, start with more accessible works and ramp difficulty up,
and keep each week's reading within the load target. Pair major readings with a
quiz (Trial) and weave in essays/discussions where they deepen the theme.

${CONTRACT}`
}

function buildReviseInstruction(current: GeneratedPlan, instruction: string): string {
  return `You are Virgil, REVISING an existing semester plan. Apply this instruction:

"${instruction}"

Keep everything else stable. Return the FULL revised plan as JSON (all weeks),
using ONLY book_id values from the candidate catalog.

CURRENT PLAN:
${JSON.stringify(current)}

${CONTRACT}`
}

// ── Anthropic call ────────────────────────────────────────────────────────────

export interface PlanGenResult extends RepairResult {
  model: string
  usage: { input_tokens: number; output_tokens: number; cache_read?: number; cache_write?: number }
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : text
  const objMatch = raw.match(/\{[\s\S]*\}/)
  if (!objMatch) throw new Error("No JSON object in model response")
  return JSON.parse(objMatch[0])
}

/**
 * Generate (or revise) a semester plan grounded in the candidate catalog.
 * The catalog lives in a cached system block so it is reused across the initial
 * generation, per-week regenerations, and free-text revisions.
 */
export async function generateSemesterPlan(opts: {
  setup: PlanSetup
  candidates: CandidateBook[]
  revise?: { current: GeneratedPlan; instruction: string }
}): Promise<PlanGenResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured")
  const client = new Anthropic({ apiKey })
  const model = choosePlanModel(opts.setup)

  const instruction = opts.revise
    ? buildReviseInstruction(opts.revise.current, opts.revise.instruction)
    : buildInstruction(opts.setup)

  const run = async () => {
    const msg = await client.messages.create({
      model,
      max_tokens: 8192,
      system: [
        {
          type: "text",
          text:
            "You design rigorous, coherent literature curricula. You output strictly valid JSON and only sequence books that appear in the supplied candidate catalog.",
        },
        {
          type: "text",
          text: catalogBlock(opts.candidates),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: instruction }],
    })
    const block = msg.content.find((b) => b.type === "text")
    const text = block && block.type === "text" ? block.text : ""
    const parsed = generatedPlanSchema.parse(extractJson(text))
    return {
      parsed,
      usage: {
        input_tokens: msg.usage.input_tokens,
        output_tokens: msg.usage.output_tokens,
        cache_read: msg.usage.cache_read_input_tokens ?? undefined,
        cache_write: msg.usage.cache_creation_input_tokens ?? undefined,
      },
    }
  }

  let result
  try {
    result = await run()
  } catch {
    result = await run() // one retry on parse/validation failure
  }

  const repaired = repairPlan(result.parsed, opts.candidates)
  return { ...repaired, model, usage: result.usage }
}
