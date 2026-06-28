import "server-only"

import type Anthropic from "@anthropic-ai/sdk"
import type { VirgilDB } from "@/lib/virgil/profile"
import {
  executeGenerateTeacherQuiz,
  type GenerateTeacherQuizInput,
} from "@/lib/virgil/tools/generate-teacher-quiz"
import { executeRecommendBooks, type RecommendBooksInput } from "@/lib/virgil/tools/recommend-books"
import { executeCreateSemesterPlan, type CreateSemesterPlanInput } from "@/lib/virgil/tools/semester-plan"

/**
 * Anthropic tool definitions Virgil may call inside the teacher-facing chat
 * loop. Executors live alongside (one file each) and run server-side, RLS-
 * scoped to the authenticated teacher.
 */
export const VIRGIL_TEACHER_TOOLS: Anthropic.Tool[] = [
  {
    name: "generate_teacher_quiz",
    description:
      "Generate and save a text-grounded teacher quiz from a book the class can read. Use when the teacher asks to create/make/build a quiz on a book or chapters. Saves a draft the teacher reviews and publishes.",
    input_schema: {
      type: "object",
      properties: {
        book_query: { type: "string", description: "Title or slug of the book to quiz on." },
        chapter_range: {
          type: "object",
          description: "Optional inclusive chapter_index range to scope the quiz.",
          properties: {
            start: { type: "integer", description: "First chapter_index (0-based)." },
            end: { type: "integer", description: "Last chapter_index, inclusive." },
          },
        },
        focus: { type: "string", description: "Optional thematic focus, e.g. 'fate and free will'." },
        difficulty: {
          type: "string",
          enum: ["apprentice", "scholar", "master"],
          description: "apprentice=recall, scholar=interpretation, master=synthesis/theme.",
        },
        question_count: { type: "integer", description: "Number of questions, 1–30 (default 5)." },
      },
      required: ["book_query", "difficulty"],
    },
  },
  {
    name: "recommend_books",
    description:
      "Recommend readable books from Tome's library for a teacher's criteria (level, theme, tradition). Read-only — returns candidates to rank and explain.",
    input_schema: {
      type: "object",
      properties: {
        criteria_text: { type: "string", description: "What the teacher is looking for." },
        level: { type: "string", description: "Optional level/grade, e.g. 'high school'." },
        max_results: { type: "integer", description: "How many to recommend, 1–10 (default 5)." },
      },
      required: ["criteria_text"],
    },
  },
  {
    name: "create_semester_plan",
    description:
      "Draft a multi-week semester reading plan from content-complete books. Read-only preview — does not save anything.",
    input_schema: {
      type: "object",
      properties: {
        weeks: { type: "integer", description: "Number of weeks, 1–40." },
        level: { type: "string", description: "Course level/grade." },
        theme: { type: "string", description: "Optional course theme/title." },
        constraints: { type: "string", description: "Optional free-text constraints or steer." },
      },
      required: ["weeks", "level"],
    },
  },
]

/**
 * Dispatch a tool call to its server-side executor. Returns a JSON string for
 * the tool_result content block. Never throws — surfaces errors as data so the
 * loop can continue and Virgil can explain.
 */
export async function executeVirgilTool(args: {
  name: string
  input: unknown
  supabase: VirgilDB
  userId: string
}): Promise<string> {
  const { name, input, supabase, userId } = args
  const obj = (input ?? {}) as Record<string, unknown>
  try {
    switch (name) {
      case "generate_teacher_quiz":
        return JSON.stringify(
          await executeGenerateTeacherQuiz(supabase, userId, obj as unknown as GenerateTeacherQuizInput),
        )
      case "recommend_books":
        return JSON.stringify(await executeRecommendBooks(supabase, obj as unknown as RecommendBooksInput))
      case "create_semester_plan":
        return JSON.stringify(
          await executeCreateSemesterPlan(supabase, obj as unknown as CreateSemesterPlanInput),
        )
      default:
        return JSON.stringify({ status: "error", message: `Unknown tool: ${name}` })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool execution failed"
    console.error(`[virgil-tool] ${name} failed:`, message)
    return JSON.stringify({ status: "error", message })
  }
}

const MAX_TOOL_TURNS = 6

/**
 * Run the standard Anthropic tool-use loop, then return Virgil's final text.
 * Tool-use responses can't be streamed token-by-token (we must inspect
 * stop_reason), so this resolves to the full final turn which the route then
 * emits to the client.
 */
export async function runVirgilToolLoop(args: {
  client: Anthropic
  model: string
  system: string
  messages: { role: "user" | "assistant"; content: string }[]
  tools: Anthropic.Tool[]
  supabase: VirgilDB
  userId: string
}): Promise<string> {
  const { client, model, system, tools, supabase, userId } = args
  const convo: Anthropic.MessageParam[] = args.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const res = await client.messages.create({
      model,
      max_tokens: 1500,
      system,
      messages: convo,
      tools,
    })

    if (res.stop_reason === "tool_use") {
      convo.push({ role: "assistant", content: res.content })
      const toolResults: Anthropic.ToolResultBlockParam[] = []
      for (const block of res.content) {
        if (block.type === "tool_use") {
          const result = await executeVirgilTool({
            name: block.name,
            input: block.input,
            supabase,
            userId,
          })
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result })
        }
      }
      convo.push({ role: "user", content: toolResults })
      continue
    }

    return res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim()
  }

  return "I started on that but it took more steps than I can take in one turn — let's break it into a smaller request."
}
