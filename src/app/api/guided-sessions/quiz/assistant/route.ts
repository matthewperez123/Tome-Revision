import { NextResponse } from "next/server"
import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import {
  ALL_QUESTION_TYPES,
  MAX_QUIZ_QUESTIONS,
  generateQuizRequestSchema,
  type GenerateQuizRequest,
  type TeacherQuizQuestionType,
} from "@/lib/teacher-quiz-types"
import { generateQuizQuestions } from "@/lib/teacher-quiz/generate"
import { prepareScope, persistDraftQuiz } from "@/lib/teacher-quiz/draft-service"

export const maxDuration = 60

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
  bookId: z.string().nullable().optional(),
  bookTitle: z.string().optional(),
  bookAuthor: z.string().optional(),
  chapterIndexes: z.array(z.number().int().nonnegative()).max(200).default([]),
})

const GENERATE_TOOL: Anthropic.Tool = {
  name: "generate_quiz",
  description:
    "Generate a text-grounded quiz draft from the teacher's selected book and chapters. " +
    "Call this once you understand roughly what the teacher wants. If they are vague, " +
    "go ahead with sensible defaults rather than interrogating them.",
  input_schema: {
    type: "object",
    properties: {
      totalCount: {
        type: "integer",
        minimum: 1,
        maximum: MAX_QUIZ_QUESTIONS,
        description: "How many questions in total.",
      },
      apprentice: { type: "integer", minimum: 0, description: "Recall / plot questions." },
      scholar: { type: "integer", minimum: 0, description: "Interpretation / technique questions." },
      master: { type: "integer", minimum: 0, description: "Synthesis / theme questions." },
      types: {
        type: "array",
        items: { type: "string", enum: ALL_QUESTION_TYPES as unknown as string[] },
        description: "Allowed question types to draw from.",
      },
      focus: {
        type: "string",
        description: "Optional thematic focus, e.g. 'the theme of fate' or 'Odysseus's cunning'.",
      },
    },
    required: ["totalCount", "types"],
  },
}

/**
 * POST /api/guided-sessions/quiz/assistant
 *
 * Conversational front door to Virgil quiz generation. The teacher chats in
 * natural language; Virgil either replies or calls the generate_quiz tool, in
 * which case we run the same grounded generation pipeline as /generate and
 * return the draft alongside a conversational reply.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can use the quiz assistant" }, { status: 403 })
  }

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }
  const body = parsed.data

  if (!body.bookId) {
    return NextResponse.json({
      reply:
        "Pick a book in the panel above and (optionally) tap the chapters you want — then tell me what kind of quiz to build.",
    })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { reply: "Virgil isn't configured on this server yet (missing ANTHROPIC_API_KEY)." },
      { status: 200 },
    )
  }

  const scopeLabel = body.chapterIndexes.length
    ? `chapters ${body.chapterIndexes.join(", ")}`
    : "the whole book"

  const system = `You are Virgil, a warm, erudite teaching assistant inside Tome, helping a teacher assemble a quiz for a guided study session.

The teacher has selected:
- Book: "${body.bookTitle ?? "the selected book"}"${body.bookAuthor ? ` by ${body.bookAuthor}` : ""}
- Scope: ${scopeLabel}

Chat briefly and naturally, then build the quiz with the generate_quiz tool as soon as you understand what they want. Infer sensible defaults when they are vague — do NOT interrogate them:
- default 6 questions (about 3 apprentice / 2 scholar / 1 master)
- default question types: multiple_choice and true_false
Always pass a difficulty mix whose numbers add up to the total count. If the teacher just says something like "make a quiz", generate immediately with defaults. Keep any text replies to 1-2 short sentences.`

  const client = new Anthropic({ apiKey })

  let resp: Anthropic.Message
  try {
    resp = await client.messages.create({
      model: CHAT_MODEL,
      max_tokens: 700,
      system,
      tools: [GENERATE_TOOL],
      messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
    })
  } catch (err) {
    console.error("Virgil assistant chat failed:", err)
    return NextResponse.json({ reply: "I had trouble thinking that through — mind trying again?" }, { status: 200 })
  }

  const textBlock = resp.content.find((b) => b.type === "text")
  const preamble = textBlock && textBlock.type === "text" ? textBlock.text.trim() : ""
  const toolUse = resp.content.find((b) => b.type === "tool_use")

  // Pure conversational turn — no generation requested.
  if (!toolUse || toolUse.type !== "tool_use") {
    return NextResponse.json({
      reply: preamble || "Tell me a little about the quiz you'd like and I'll build it.",
    })
  }

  // ── Reconcile the tool args into a valid GenerateQuizRequest ──
  const args = toolUse.input as {
    totalCount?: number
    apprentice?: number
    scholar?: number
    master?: number
    types?: string[]
    focus?: string
  }

  const a = Math.max(0, Math.floor(args.apprentice ?? 0))
  const s = Math.max(0, Math.floor(args.scholar ?? 0))
  const m = Math.max(0, Math.floor(args.master ?? 0))
  let mix = { apprentice: a, scholar: s, master: m }
  if (a + s + m === 0) {
    const reqCount = Math.min(MAX_QUIZ_QUESTIONS, Math.max(1, Math.floor(args.totalCount ?? 6)))
    const ap = Math.round(reqCount * 0.5)
    const ma = Math.max(0, Math.round(reqCount * 0.17))
    mix = { apprentice: ap, master: ma, scholar: Math.max(0, reqCount - ap - ma) }
  }
  const totalCount = Math.min(MAX_QUIZ_QUESTIONS, mix.apprentice + mix.scholar + mix.master)

  const validTypes = (args.types ?? []).filter((t): t is TeacherQuizQuestionType =>
    (ALL_QUESTION_TYPES as readonly string[]).includes(t),
  )
  const types = validTypes.length
    ? validTypes
    : (["multiple_choice", "true_false"] as TeacherQuizQuestionType[])

  const reqParse = generateQuizRequestSchema.safeParse({
    bookId: body.bookId,
    scope: body.chapterIndexes.length ? { chapterIndexes: body.chapterIndexes } : {},
    difficultyMix: mix,
    types,
    totalCount: Math.max(1, totalCount),
    focus: args.focus?.trim() || undefined,
  } satisfies Partial<GenerateQuizRequest>)

  if (!reqParse.success) {
    return NextResponse.json({ reply: "I couldn't quite shape that quiz — could you rephrase what you'd like?" })
  }
  const req = reqParse.data

  // ── Ground + generate + persist (shared with /generate) ──
  const scope = await prepareScope(supabase, req)
  if (scope.error) {
    const msg = typeof scope.error.json.message === "string" ? scope.error.json.message : undefined
    return NextResponse.json({ reply: msg ?? "I couldn't read that book's text to build a grounded quiz." })
  }

  let result
  try {
    result = await generateQuizQuestions({
      passage: scope.data.passage,
      bookTitle: scope.data.book.title,
      bookAuthor: scope.data.book.author,
      req,
    })
  } catch (err) {
    console.error("Virgil assistant generation failed:", err)
    return NextResponse.json({ reply: "I hit a snag while drafting those questions. Want me to try again?" })
  }

  const persisted = await persistDraftQuiz(
    supabase,
    user.id,
    req,
    result.questions,
    scope.data.rows,
    scope.data.book,
    result.model,
  )
  if (persisted.status !== 200 || !persisted.json.draft) {
    return NextResponse.json({ reply: "I drafted the questions but couldn't save them. Mind trying again?" })
  }

  const count = result.questions.length
  const reply =
    preamble ||
    `Done — I drafted ${count} question${count === 1 ? "" : "s"} on "${scope.data.book.title}"${
      req.focus ? `, focused on ${req.focus}` : ""
    }. Review them below, then add the quiz to your session.`

  return NextResponse.json({ reply, draft: persisted.json.draft })
}
