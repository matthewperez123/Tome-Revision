import "server-only"

import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateQuizQuestions } from "@/lib/teacher-quiz/generate"
import { prepareScope, persistDraftQuiz } from "@/lib/teacher-quiz/draft-service"
import { gradeFreeResponseWithVirgil, answerToString } from "@/lib/teacher-quiz/grade"
import {
  ALL_QUESTION_TYPES,
  TEACHER_QUIZ_DIFFICULTIES,
  type GenerateQuizRequest,
} from "@/lib/teacher-quiz-types"

/**
 * Teacher-only Virgil task handlers. Every task here is reachable only after the
 * /api/virgil route's teacher role gate, so these never re-check the role — they
 * trust `ctx.userId` is a teacher. Model routing: Sonnet for generation, Opus
 * ONLY for grading, Haiku for lightweight drafting. Each successful call meters
 * one unit via `ctx.record()`.
 */

type DB = Awaited<ReturnType<typeof createClient>>

export interface TaskCtx {
  userId: string
  supabase: DB
  /** Increment the virgil_usage ledger for observability. */
  record: () => Promise<void>
}

const MODEL_SONNET = "claude-sonnet-4-6"
const MODEL_HAIKU = "claude-haiku-4-5"

function client(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY
  return apiKey ? new Anthropic({ apiKey }) : null
}

function notConfigured(): Response {
  return Response.json({ error: "Virgil isn't configured on this server yet." }, { status: 503 })
}

/**
 * Service-role reader for the read-only insight tools. A teacher's own request
 * client cannot see students' `reading_progress` (user-scoped RLS), so these
 * aggregators would surface empty data. Callers MUST verify classroom
 * ownership first (`classroom.teacher_id === ctx.userId`); only then may they
 * read the enrolled students' signals through this elevated client.
 */
function studentSignalReader(): SupabaseClient {
  return createAdminClient() as unknown as SupabaseClient
}

function bad(details?: unknown): Response {
  return Response.json({ error: "Invalid request", details }, { status: 400 })
}

/** Pull the first JSON object/array out of a model reply, tolerating fences. */
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : text
  const match = raw.match(/[[{][\s\S]*[\]}]/)
  if (!match) throw new Error("No JSON in model response")
  return JSON.parse(match[0])
}

async function callJson(
  model: string,
  system: Anthropic.TextBlockParam[],
  prompt: string,
  maxTokens: number,
  temperature?: number,
): Promise<unknown> {
  const c = client()
  if (!c) throw new Error("not_configured")
  const msg = await c.messages.create({
    model,
    max_tokens: maxTokens,
    ...(temperature !== undefined ? { temperature } : {}),
    system,
    messages: [{ role: "user", content: prompt }],
  })
  const block = msg.content.find((b) => b.type === "text")
  return extractJson(block && block.type === "text" ? block.text : "")
}

async function callText(
  model: string,
  system: string,
  prompt: string,
  maxTokens: number,
): Promise<string> {
  const c = client()
  if (!c) throw new Error("not_configured")
  const msg = await c.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
  })
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim()
}

// ── 3a. Quiz builder ──────────────────────────────────────────────────────────

const teacherQuizSchema = z.object({
  task: z.literal("teacher_quiz"),
  input: z.object({
    bookId: z.string().min(1),
    chapterStart: z.number().int().nonnegative(),
    chapterEnd: z.number().int().nonnegative(),
    questionCount: z.number().int().min(1).max(30),
    difficulty: z.enum(TEACHER_QUIZ_DIFFICULTIES),
    brief: z.string().max(500).optional(),
  }),
})

async function handleTeacherQuiz(raw: unknown, ctx: TaskCtx): Promise<Response> {
  const parsed = teacherQuizSchema.safeParse(raw)
  if (!parsed.success) return bad(parsed.error.flatten())
  if (!client()) return notConfigured()
  const { input } = parsed.data

  const start = Math.min(input.chapterStart, input.chapterEnd)
  const end = Math.max(input.chapterStart, input.chapterEnd)
  const chapterIndexes: number[] = []
  for (let i = start; i <= end && chapterIndexes.length < 20; i++) chapterIndexes.push(i)

  // Mix the difficulty across a sensible spread of question types.
  const req: GenerateQuizRequest = {
    bookId: input.bookId,
    scope: { chapterIndexes },
    difficultyMix: {
      apprentice: input.difficulty === "apprentice" ? input.questionCount : 0,
      scholar: input.difficulty === "scholar" ? input.questionCount : 0,
      master: input.difficulty === "master" ? input.questionCount : 0,
    },
    types: [...ALL_QUESTION_TYPES],
    totalCount: input.questionCount,
    focus: input.brief,
  }

  const scoped = await prepareScope(ctx.supabase, req)
  if (scoped.error) return Response.json(scoped.error.json, { status: scoped.error.status })

  const result = await generateQuizQuestions({
    passage: scoped.data.passage,
    bookTitle: scoped.data.book.title,
    bookAuthor: scoped.data.book.author,
    req,
  })

  const saved = await persistDraftQuiz(
    ctx.supabase,
    ctx.userId,
    req,
    result.questions,
    scoped.data.rows,
    scoped.data.book,
    MODEL_SONNET,
  )
  if (saved.status === 200) await ctx.record()
  return Response.json(saved.json, { status: saved.status })
}

// ── 3b. Curriculum planner ────────────────────────────────────────────────────

const semesterPlanSchema = z.object({
  task: z.literal("semester_plan"),
  input: z.object({
    title: z.string().min(1).max(200),
    weeks: z.number().int().min(1).max(52),
    level: z.string().max(80).optional(),
    goals: z.array(z.string().max(300)).max(20).default([]),
    bookIds: z.array(z.string().min(1)).min(1).max(30),
    cadence: z.string().max(200).optional(),
  }),
})

const planItemSchema = z.object({
  type: z.string().min(1),
  book_id: z.string().nullable().optional(),
  title: z.string().min(1),
  description: z.string().optional().default(""),
  difficulty: z.string().nullable().optional(),
  est_minutes: z.number().int().nonnegative().nullable().optional(),
})
const planWeekSchema = z.object({
  week_index: z.number().int().nonnegative(),
  theme: z.string().optional().default(""),
  items: z.array(planItemSchema).default([]),
})
const planResultSchema = z.object({ weeks: z.array(planWeekSchema).min(1) })

async function handleSemesterPlan(raw: unknown, ctx: TaskCtx): Promise<Response> {
  const parsed = semesterPlanSchema.safeParse(raw)
  if (!parsed.success) return bad(parsed.error.flatten())
  if (!client()) return notConfigured()
  const { input } = parsed.data

  const { data: books } = await ctx.supabase
    .from("books")
    .select("id, title, author")
    .in("id", input.bookIds)
  const bookList = (books ?? [])
    .map((b) => `- ${b.id}: "${b.title}" by ${b.author}`)
    .join("\n")

  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: "You are Virgil, an experienced classics teacher designing a coherent curriculum. You output strictly valid JSON and sequence works into a clear intellectual arc with sensible pacing and a balanced mix of reading, discussion, and assessment.",
    },
  ]
  const prompt = `Design a ${input.weeks}-week ${input.level ?? ""} curriculum titled "${input.title}".
${input.cadence ? `Cadence: ${input.cadence}.` : ""}
Learning goals:
${input.goals.map((g) => `- ${g}`).join("\n") || "- (none supplied)"}

Sequence ONLY these works (use the exact book_id when an item is tied to a book):
${bookList}

Return ONLY JSON:
{"weeks":[{"week_index":0,"theme":"...","items":[{"type":"reading|discussion|assessment","book_id":"<id or null>","title":"...","description":"...","difficulty":"apprentice|scholar|master|null","est_minutes":<int or null>}]}]}
Produce exactly ${input.weeks} weeks (week_index 0..${input.weeks - 1}). No prose, no fences.`

  let plan: z.infer<typeof planResultSchema>
  try {
    plan = planResultSchema.parse(await callJson(MODEL_SONNET, system, prompt, 4000))
  } catch (err) {
    console.error("[virgil] semester_plan generation failed:", err)
    return Response.json({ error: "Virgil couldn't draft the plan. Try again." }, { status: 502 })
  }

  const { data: planRow, error: planErr } = await ctx.supabase
    .from("semester_plans")
    .insert({
      teacher_id: ctx.userId,
      class_id: null,
      title: input.title,
      weeks: plan.weeks.length,
      cadence: input.cadence ? { description: input.cadence } : {},
      level: input.level ?? null,
      goals: input.goals,
      constraints: {},
      status: "draft",
      generated_by_model: MODEL_SONNET,
    })
    .select("id, title")
    .single()
  if (planErr || !planRow) {
    console.error("[virgil] semester_plans insert failed:", planErr)
    return Response.json({ error: "Failed to save plan" }, { status: 500 })
  }

  for (const week of plan.weeks) {
    const { data: weekRow, error: weekErr } = await ctx.supabase
      .from("semester_plan_weeks")
      .insert({ plan_id: planRow.id, week_index: week.week_index, theme: week.theme || null })
      .select("id")
      .single()
    if (weekErr || !weekRow) continue
    const items = week.items.map((item, i) => ({
      week_id: weekRow.id,
      sort_order: i,
      type: item.type,
      book_id: item.book_id ?? null,
      title: item.title,
      description: item.description || null,
      difficulty: item.difficulty ?? null,
      est_minutes: item.est_minutes ?? null,
      status: "planned",
    }))
    if (items.length > 0) await ctx.supabase.from("semester_plan_items").insert(items)
  }

  await ctx.record()
  return Response.json({ planId: planRow.id, title: planRow.title, weeks: plan.weeks.length })
}

// ── 3c. Assignment builder ────────────────────────────────────────────────────

const assignmentSchema = z.object({
  task: z.literal("assignment_draft"),
  input: z.object({
    classroomId: z.string().uuid(),
    type: z.enum(["essay", "discussion", "annotation", "reading", "quiz"]),
    bookId: z.string().min(1).optional(),
    chapterStart: z.number().int().nonnegative().optional(),
    chapterEnd: z.number().int().nonnegative().optional(),
    brief: z.string().max(1000).optional(),
  }),
})

const assignmentResultSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  essay_prompt: z.string().nullable().optional(),
  essay_word_min: z.number().int().nonnegative().nullable().optional(),
  essay_word_max: z.number().int().nonnegative().nullable().optional(),
  discussion_prompt: z.string().nullable().optional(),
  annotation_target: z.number().int().nonnegative().nullable().optional(),
  points_available: z.number().int().nonnegative().nullable().optional(),
})

async function handleAssignmentDraft(raw: unknown, ctx: TaskCtx): Promise<Response> {
  const parsed = assignmentSchema.safeParse(raw)
  if (!parsed.success) return bad(parsed.error.flatten())
  if (!client()) return notConfigured()
  const { input } = parsed.data

  // Ownership: only the classroom's own teacher may draft into it.
  const { data: classroom } = await ctx.supabase
    .from("classrooms")
    .select("id, teacher_id, name")
    .eq("id", input.classroomId)
    .maybeSingle()
  if (!classroom || classroom.teacher_id !== ctx.userId) {
    return Response.json({ error: "You don't own that classroom." }, { status: 403 })
  }

  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: "You are Virgil, a classics teacher drafting a clear, rigorous classroom assignment. You output strictly valid JSON. Prompts are specific, text-grounded, and age-appropriate — never generic filler.",
    },
  ]
  const prompt = `Draft a ${input.type} assignment for a classics classroom.
${input.bookId ? `Book: ${input.bookId}.` : ""}
${input.chapterStart != null ? `Chapters ${input.chapterStart}–${input.chapterEnd ?? input.chapterStart}.` : ""}
Teacher brief: ${input.brief ?? "(none)"}

Return ONLY JSON with fields relevant to a ${input.type} assignment:
{"title":"...","description":"...","essay_prompt":<string|null>,"essay_word_min":<int|null>,"essay_word_max":<int|null>,"discussion_prompt":<string|null>,"annotation_target":<int|null>,"points_available":<int|null>}
No prose, no fences.`

  let draft: z.infer<typeof assignmentResultSchema>
  try {
    draft = assignmentResultSchema.parse(await callJson(MODEL_SONNET, system, prompt, 2000))
  } catch (err) {
    console.error("[virgil] assignment_draft generation failed:", err)
    return Response.json({ error: "Virgil couldn't draft the assignment. Try again." }, { status: 502 })
  }

  const { data: assignment, error: aErr } = await ctx.supabase
    .from("assignments")
    .insert({
      classroom_id: input.classroomId,
      teacher_id: ctx.userId,
      type: input.type,
      title: draft.title,
      description: draft.description || null,
      book_id: input.bookId ?? null,
      chapter_range_start: input.chapterStart ?? null,
      chapter_range_end: input.chapterEnd ?? null,
      essay_prompt: draft.essay_prompt ?? null,
      essay_word_min: draft.essay_word_min ?? null,
      essay_word_max: draft.essay_word_max ?? null,
      discussion_prompt: draft.discussion_prompt ?? null,
      annotation_target: draft.annotation_target ?? null,
      points_available: draft.points_available ?? 100,
      status: "draft",
      scope: "classroom",
    })
    .select("id, title")
    .single()
  if (aErr || !assignment) {
    console.error("[virgil] assignments insert failed:", aErr)
    return Response.json({ error: "Failed to save assignment" }, { status: 500 })
  }

  await ctx.supabase
    .from("assignment_targets")
    .insert({ assignment_id: assignment.id, target_type: "classroom" })

  await ctx.record()
  return Response.json({ assignmentId: assignment.id, title: assignment.title })
}

// ── 3d. Auto-grader (free response) ───────────────────────────────────────────

const gradeSchema = z.object({
  task: z.literal("grade_response"),
  input: z.object({ responseId: z.string().uuid() }),
})

async function handleGradeResponse(raw: unknown, ctx: TaskCtx): Promise<Response> {
  const parsed = gradeSchema.safeParse(raw)
  if (!parsed.success) return bad(parsed.error.flatten())
  if (!client()) return notConfigured()
  const { responseId } = parsed.data.input

  const { data: response } = await ctx.supabase
    .from("teacher_quiz_responses")
    .select("id, quiz_id, question_id, response, max_points")
    .eq("id", responseId)
    .maybeSingle()
  if (!response) return Response.json({ error: "Response not found" }, { status: 404 })

  // Ownership: the response's quiz must belong to this teacher.
  const { data: quiz } = await ctx.supabase
    .from("teacher_quizzes")
    .select("id, teacher_id")
    .eq("id", response.quiz_id)
    .maybeSingle()
  if (!quiz || quiz.teacher_id !== ctx.userId) {
    return Response.json({ error: "You don't own that quiz." }, { status: 403 })
  }

  const { data: question } = await ctx.supabase
    .from("teacher_quiz_questions")
    .select("question_text, rubric, reference_answer, max_points, points")
    .eq("id", response.question_id)
    .maybeSingle()
  if (!question) return Response.json({ error: "Question not found" }, { status: 404 })

  const maxPoints =
    (response.max_points as number | null) ?? (question.max_points as number | null) ?? question.points ?? 4

  let grade
  try {
    grade = await gradeFreeResponseWithVirgil({
      questionText: question.question_text,
      rubric: question.rubric,
      referenceAnswer: question.reference_answer,
      maxPoints,
      answerText: answerToString(response.response),
    })
  } catch (err) {
    console.error("[virgil] grade_response generation failed:", err)
    return Response.json({ error: "Virgil couldn't grade this response. Try again." }, { status: 502 })
  }

  const { error: updErr } = await ctx.supabase
    .from("teacher_quiz_responses")
    .update({
      score: grade.score,
      is_correct: grade.isCorrect,
      graded_by: "virgil",
      ai_feedback: grade.feedback,
      ai_rubric_breakdown: grade.rubricBreakdown,
      graded_at: new Date().toISOString(),
    })
    .eq("id", responseId)
  if (updErr) {
    console.error("[virgil] teacher_quiz_responses update failed:", updErr)
    return Response.json({ error: "Failed to save grade" }, { status: 500 })
  }

  await ctx.record()
  return Response.json({ score: grade.score, is_correct: grade.isCorrect, feedback: grade.feedback })
}

// ── 3e. Announcement draft (no write — teacher saves separately) ──────────────

const announcementSchema = z.object({
  task: z.literal("announcement_draft"),
  input: z.object({ classroomId: z.string().uuid(), brief: z.string().min(1).max(1000) }),
})

async function handleAnnouncementDraft(raw: unknown, ctx: TaskCtx): Promise<Response> {
  const parsed = announcementSchema.safeParse(raw)
  if (!parsed.success) return bad(parsed.error.flatten())
  if (!client()) return notConfigured()
  const { input } = parsed.data

  const { data: classroom } = await ctx.supabase
    .from("classrooms")
    .select("id, teacher_id")
    .eq("id", input.classroomId)
    .maybeSingle()
  if (!classroom || classroom.teacher_id !== ctx.userId) {
    return Response.json({ error: "You don't own that classroom." }, { status: 403 })
  }

  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: "You are Virgil drafting a short, warm classroom announcement for a teacher to review and post. You output strictly valid JSON: a concise title and a friendly body of 1–3 short paragraphs.",
    },
  ]
  const prompt = `Draft a classroom announcement.
Teacher brief: ${input.brief}

Return ONLY JSON: {"title":"...","content":"..."} — no prose, no fences.`

  let draft: { title: string; content: string }
  try {
    const json = (await callJson(MODEL_HAIKU, system, prompt, 600)) as { title?: unknown; content?: unknown }
    draft = {
      title: String(json.title ?? "Announcement"),
      content: String(json.content ?? ""),
    }
  } catch (err) {
    console.error("[virgil] announcement_draft generation failed:", err)
    return Response.json({ error: "Virgil couldn't draft the announcement. Try again." }, { status: 502 })
  }

  await ctx.record()
  return Response.json(draft)
}

// ── 3f. Student progress note (no write — teacher saves separately) ───────────

const studentNoteSchema = z.object({
  task: z.literal("student_note"),
  input: z.object({ studentId: z.string().uuid(), classroomId: z.string().uuid() }),
})

async function handleStudentNote(raw: unknown, ctx: TaskCtx): Promise<Response> {
  const parsed = studentNoteSchema.safeParse(raw)
  if (!parsed.success) return bad(parsed.error.flatten())
  if (!client()) return notConfigured()
  const { studentId, classroomId } = parsed.data.input

  const { data: classroom } = await ctx.supabase
    .from("classrooms")
    .select("id, teacher_id")
    .eq("id", classroomId)
    .maybeSingle()
  if (!classroom || classroom.teacher_id !== ctx.userId) {
    return Response.json({ error: "You don't own that classroom." }, { status: 403 })
  }

  // Ownership verified above → read the student's signals with the elevated
  // client (their reading_progress is invisible to the teacher under RLS).
  const reader = studentSignalReader()
  const { data: scores } = await reader
    .from("teacher_quiz_responses")
    .select("score, max_points, is_correct, graded_at, created_at")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(20)

  const { data: progress } = await reader
    .from("reading_progress")
    .select("book_id, chapter_index, updated_at")
    .eq("user_id", studentId)
    .order("updated_at", { ascending: false })
    .limit(10)

  const signal = {
    recentScores: (scores ?? []).map((s) => ({
      score: s.score,
      max: s.max_points,
      correct: s.is_correct,
    })),
    recentReading: (progress ?? []).map((p) => ({ book: p.book_id, chapter: p.chapter_index })),
  }

  const system =
    "You are Virgil writing a brief, private progress note for a teacher about one student. 2–4 sentences: specific, balanced, and actionable. No greeting, no sign-off — just the note."
  const prompt = `Student signal (recent quiz scores + reading):
${JSON.stringify(signal, null, 2)}

Write the progress note.`

  let content: string
  try {
    content = await callText(MODEL_SONNET, system, prompt, 400)
  } catch (err) {
    console.error("[virgil] student_note generation failed:", err)
    return Response.json({ error: "Virgil couldn't summarize this student. Try again." }, { status: 502 })
  }

  await ctx.record()
  return Response.json({ content })
}

// ── 3g. Class insights (read-only, no write) ──────────────────────────────────

const classInsightsSchema = z.object({
  task: z.literal("class_insights"),
  input: z.object({ classroomId: z.string().uuid() }),
})

const classInsightsResultSchema = z.object({
  trajectory: z.string(),
  needs_attention: z.array(z.object({ student: z.string(), why: z.string() })).default([]),
  regrouping: z.string(),
  next_step: z.string(),
})

async function handleClassInsights(raw: unknown, ctx: TaskCtx): Promise<Response> {
  const parsed = classInsightsSchema.safeParse(raw)
  if (!parsed.success) return bad(parsed.error.flatten())
  if (!client()) return notConfigured()
  const { classroomId } = parsed.data.input

  const { data: classroom } = await ctx.supabase
    .from("classrooms")
    .select("id, teacher_id, name")
    .eq("id", classroomId)
    .maybeSingle()
  if (!classroom || classroom.teacher_id !== ctx.userId) {
    return Response.json({ error: "You don't own that classroom." }, { status: 403 })
  }

  // Ownership verified → read enrolled students' signals with the elevated
  // client. Only genuine students count (exclude owner/co_teacher rows).
  const reader = studentSignalReader()
  const { data: members } = await reader
    .from("classroom_members")
    .select("student_id")
    .eq("classroom_id", classroomId)
    .eq("role", "student")
  const studentIds = (members ?? []).map((m) => m.student_id as string)
  if (studentIds.length === 0) {
    return Response.json({ error: "This class has no students yet." }, { status: 422 })
  }

  const [{ data: profiles }, { data: scores }, { data: progress }] = await Promise.all([
    reader.from("profiles").select("id, display_name, username").in("id", studentIds),
    reader
      .from("teacher_quiz_responses")
      .select("student_id, score, max_points, is_correct")
      .in("student_id", studentIds),
    reader
      .from("reading_progress")
      .select("user_id, book_id, chapter_index")
      .in("user_id", studentIds),
  ])

  const nameFor = new Map(
    (profiles ?? []).map((p) => [p.id as string, (p.display_name as string) || (p.username as string) || "Student"]),
  )
  const perStudent = studentIds.map((id) => ({
    name: nameFor.get(id) ?? "Student",
    scores: (scores ?? [])
      .filter((s) => s.student_id === id)
      .map((s) => ({ score: s.score, max: s.max_points, correct: s.is_correct })),
    reading: (progress ?? [])
      .filter((p) => p.user_id === id)
      .map((p) => ({ book: p.book_id, chapter: p.chapter_index })),
  }))

  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: "You are Virgil giving a teacher a private read on their class. You output strictly valid JSON. Be specific and actionable; name students only from the supplied data.",
    },
  ]
  const prompt = `Class: ${classroom.name}. Per-student signal:
${JSON.stringify(perStudent, null, 2)}

Return ONLY JSON:
{"trajectory":"overall read on the class","needs_attention":[{"student":"name","why":"..."}],"regrouping":"one suggested regrouping","next_step":"one recommended next step"}
No prose, no fences.`

  let insights: z.infer<typeof classInsightsResultSchema>
  try {
    insights = classInsightsResultSchema.parse(await callJson(MODEL_SONNET, system, prompt, 2000))
  } catch (err) {
    console.error("[virgil] class_insights generation failed:", err)
    return Response.json({ error: "Virgil couldn't read the class right now. Try again." }, { status: 502 })
  }

  await ctx.record()
  return Response.json(insights)
}

// ── Dispatch ──────────────────────────────────────────────────────────────────

const TEACHER_TASKS = new Set([
  "teacher_quiz",
  "semester_plan",
  "assignment_draft",
  "grade_response",
  "announcement_draft",
  "student_note",
  "class_insights",
])

export function isTeacherTask(task: unknown): task is string {
  return typeof task === "string" && TEACHER_TASKS.has(task)
}

export async function handleTeacherTask(task: string, raw: unknown, ctx: TaskCtx): Promise<Response> {
  switch (task) {
    case "teacher_quiz":
      return handleTeacherQuiz(raw, ctx)
    case "semester_plan":
      return handleSemesterPlan(raw, ctx)
    case "assignment_draft":
      return handleAssignmentDraft(raw, ctx)
    case "grade_response":
      return handleGradeResponse(raw, ctx)
    case "announcement_draft":
      return handleAnnouncementDraft(raw, ctx)
    case "student_note":
      return handleStudentNote(raw, ctx)
    case "class_insights":
      return handleClassInsights(raw, ctx)
    default:
      return Response.json({ error: "Unknown task" }, { status: 400 })
  }
}
