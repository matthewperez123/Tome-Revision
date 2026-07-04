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
import { TASK_CONFIG, recordTaskEvent, type TeacherTaskKey } from "@/lib/virgil/task-config"
import { assertOwnership } from "@/lib/virgil/ownership"
import { notify } from "@/lib/actions/_shared"

/**
 * Teacher-only Virgil task handlers. Every task here is reachable only after the
 * /api/virgil route's teacher role gate + strict `{ task, input }` envelope +
 * per-task daily cap, so these never re-check the role. Each handler proves
 * OBJECT-level ownership through the shared `assertOwnership` table before doing
 * any work, routes its model / token ceiling / temperature through TASK_CONFIG
 * (the client can never choose those), and meters one unit into the
 * service-role `virgil_task_events` ledger on success.
 *
 * The dedicated semester planner lives at /api/classroom/semester-plan/generate
 * (School-gated, classroom-owned, catalog-repaired). There is deliberately NO
 * semester_plan task on this surface.
 */

type DB = Awaited<ReturnType<typeof createClient>>

export interface TaskCtx {
  userId: string
  supabase: DB
  /** Aborted when the client disconnects; forwarded to the model call. */
  signal?: AbortSignal
}

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
 * ownership first via `assertOwnership`; only then may they read the enrolled
 * students' signals through this elevated client.
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
  opts: { temperature?: number; signal?: AbortSignal } = {},
): Promise<unknown> {
  const c = client()
  if (!c) throw new Error("not_configured")
  const msg = await c.messages.create(
    {
      model,
      max_tokens: maxTokens,
      ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
      system,
      messages: [{ role: "user", content: prompt }],
    },
    opts.signal ? { signal: opts.signal } : undefined,
  )
  const block = msg.content.find((b) => b.type === "text")
  return extractJson(block && block.type === "text" ? block.text : "")
}

async function callText(
  model: string,
  system: string,
  prompt: string,
  maxTokens: number,
  signal?: AbortSignal,
): Promise<string> {
  const c = client()
  if (!c) throw new Error("not_configured")
  const msg = await c.messages.create(
    {
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }],
    },
    signal ? { signal } : undefined,
  )
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

  const own = await assertOwnership("teacher_quiz", input, ctx)
  if (!own.ok) return own.response

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
    TASK_CONFIG.teacher_quiz.model,
  )
  if (saved.status === 200) {
    const quizId = (saved.json as { quizId?: string } | null)?.quizId ?? null
    await recordTaskEvent(ctx.userId, "teacher_quiz", quizId)
  }
  return Response.json(saved.json, { status: saved.status })
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

  const own = await assertOwnership("assignment_draft", input, ctx)
  if (!own.ok) return own.response

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
    draft = assignmentResultSchema.parse(
      await callJson(
        TASK_CONFIG.assignment_draft.model,
        system,
        prompt,
        TASK_CONFIG.assignment_draft.maxTokens,
        { signal: ctx.signal },
      ),
    )
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

  await recordTaskEvent(ctx.userId, "assignment_draft", assignment.id)
  return Response.json({ assignmentId: assignment.id, title: assignment.title })
}

// ── 3d. Auto-grader (free response) ───────────────────────────────────────────

const gradeSchema = z.object({
  task: z.literal("grade_response"),
  input: z.union([
    z.object({ responseId: z.string().uuid() }),
    z.object({ submissionId: z.string().uuid() }),
  ]),
})

async function handleGradeResponse(raw: unknown, ctx: TaskCtx): Promise<Response> {
  const parsed = gradeSchema.safeParse(raw)
  if (!parsed.success) return bad(parsed.error.flatten())
  if (!client()) return notConfigured()
  const input = parsed.data.input

  // Object-level authorization (404-not-403 so a probe can't confirm existence):
  //  • responseId  → the response's teacher_quiz must belong to this teacher
  //  • submissionId → the essay's assignment classroom must be owned by them
  const own = await assertOwnership("grade_response", input as Record<string, unknown>, ctx)
  if (!own.ok) return own.response

  if ("submissionId" in input) {
    return gradeEssaySubmission(input.submissionId, ctx)
  }

  const responseId = input.responseId
  const { data: response } = await ctx.supabase
    .from("teacher_quiz_responses")
    .select("id, quiz_id, question_id, response, max_points")
    .eq("id", responseId)
    .maybeSingle()
  if (!response) return Response.json({ error: "Not found." }, { status: 404 })

  const { data: question } = await ctx.supabase
    .from("teacher_quiz_questions")
    .select("question_text, rubric, reference_answer, max_points, points")
    .eq("id", response.question_id)
    .maybeSingle()
  if (!question) return Response.json({ error: "Not found." }, { status: 404 })

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
    // The grader refuses over-long answers WITHOUT ever calling the model.
    if (err instanceof Error && err.message === "student_response_too_long") {
      return Response.json(
        { error: "That response is too long for Virgil to grade. Ask the student to trim it." },
        { status: 422 },
      )
    }
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

  await recordTaskEvent(ctx.userId, "grade_response", responseId)
  return Response.json({
    score: grade.score,
    is_correct: grade.isCorrect,
    feedback: grade.feedback,
    truncated: grade.truncated,
  })
}

/**
 * Essay variant of grade_response. Ownership is already proven (the assignment's
 * classroom is owned by this teacher). Grades the student's `response_text`
 * against the essay prompt via the same shared grader, then writes the canonical
 * `grades` row (single source of truth) and mirrors the numeric score onto the
 * denormalized assignment_submissions cache through the service-role client.
 * The teacher stays the grader of record (graded_by = teacher), Virgil only
 * proposes the score + feedback.
 */
async function gradeEssaySubmission(submissionId: string, ctx: TaskCtx): Promise<Response> {
  const { data: sub } = await ctx.supabase
    .from("assignment_submissions")
    .select(
      "id, student_id, response_text, assignment:assignments(title, essay_prompt, points_available, classroom_id)",
    )
    .eq("id", submissionId)
    .maybeSingle<{
      id: string
      student_id: string
      response_text: string | null
      assignment: {
        title: string | null
        essay_prompt: string | null
        points_available: number | null
        classroom_id: string | null
      } | null
    }>()
  if (!sub?.assignment) return Response.json({ error: "Not found." }, { status: 404 })

  const answerText = (sub.response_text ?? "").trim()
  if (!answerText) {
    return Response.json({ error: "There's no essay to grade yet." }, { status: 422 })
  }
  const maxPoints = sub.assignment.points_available ?? 100

  let grade
  try {
    grade = await gradeFreeResponseWithVirgil({
      questionText: sub.assignment.essay_prompt ?? "Grade this essay.",
      rubric: null,
      referenceAnswer: null,
      maxPoints,
      answerText,
    })
  } catch (err) {
    if (err instanceof Error && err.message === "student_response_too_long") {
      return Response.json(
        { error: "That essay is too long for Virgil to grade. Ask the student to trim it." },
        { status: 422 },
      )
    }
    console.error("[virgil] essay grade generation failed:", err)
    return Response.json({ error: "Virgil couldn't grade this essay. Try again." }, { status: 502 })
  }

  const score = Math.round(Math.max(0, Math.min(grade.score, maxPoints)))
  const nowIso = new Date().toISOString()
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from("grades")
    .select("id, score, feedback, graded_by")
    .eq("submission_id", submissionId)
    .maybeSingle<{ id: string; score: number | null; feedback: string | null; graded_by: string | null }>()

  if (existing) {
    await admin.from("grade_history").insert({
      grade_id: existing.id,
      previous_score: existing.score,
      previous_feedback: existing.feedback,
      previous_graded_by: existing.graded_by,
      changed_by: ctx.userId,
    })
    const { error: updErr } = await admin
      .from("grades")
      .update({
        score,
        max_score: maxPoints,
        feedback: grade.feedback,
        graded_by: ctx.userId,
        is_auto_graded: false,
        was_overridden: true,
        graded_at: nowIso,
      })
      .eq("id", existing.id)
    if (updErr) return Response.json({ error: "Failed to save grade" }, { status: 500 })
  } else {
    const { error: insErr } = await admin.from("grades").insert({
      submission_id: submissionId,
      score,
      max_score: maxPoints,
      feedback: grade.feedback,
      is_auto_graded: false,
      graded_by: ctx.userId,
      graded_at: nowIso,
    })
    if (insErr) return Response.json({ error: "Failed to save grade" }, { status: 500 })
  }

  await admin
    .from("assignment_submissions")
    .update({
      status: "graded",
      score,
      feedback: grade.feedback,
      graded_at: nowIso,
      graded_by: ctx.userId,
    })
    .eq("id", submissionId)

  await notify({
    recipientId: sub.student_id,
    type: "assignment_graded",
    title: `Your essay was graded: ${sub.assignment.title ?? "Essay"}`,
    body: `Score: ${score} / ${maxPoints}`,
    actionUrl: sub.assignment.classroom_id
      ? `/classroom/${sub.assignment.classroom_id}`
      : "/classroom",
    actorId: ctx.userId,
    entityType: "submission",
    entityId: submissionId,
  })

  await recordTaskEvent(ctx.userId, "grade_response", submissionId)
  return Response.json({
    score: grade.score,
    is_correct: grade.isCorrect,
    feedback: grade.feedback,
    truncated: grade.truncated,
  })
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

  const own = await assertOwnership("announcement_draft", input, ctx)
  if (!own.ok) return own.response

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
    const json = (await callJson(
      TASK_CONFIG.announcement_draft.model,
      system,
      prompt,
      TASK_CONFIG.announcement_draft.maxTokens,
      { signal: ctx.signal },
    )) as { title?: unknown; content?: unknown }
    draft = {
      title: String(json.title ?? "Announcement"),
      content: String(json.content ?? ""),
    }
  } catch (err) {
    console.error("[virgil] announcement_draft generation failed:", err)
    return Response.json({ error: "Virgil couldn't draft the announcement. Try again." }, { status: 502 })
  }

  await recordTaskEvent(ctx.userId, "announcement_draft", input.classroomId)
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

  const own = await assertOwnership("student_note", parsed.data.input, ctx)
  if (!own.ok) return own.response

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
    content = await callText(
      TASK_CONFIG.student_note.model,
      system,
      prompt,
      TASK_CONFIG.student_note.maxTokens,
      ctx.signal,
    )
  } catch (err) {
    console.error("[virgil] student_note generation failed:", err)
    return Response.json({ error: "Virgil couldn't summarize this student. Try again." }, { status: 502 })
  }

  await recordTaskEvent(ctx.userId, "student_note", studentId)
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

  const own = await assertOwnership("class_insights", parsed.data.input, ctx)
  if (!own.ok) return own.response

  // Ownership verified → read enrolled students' signals with the elevated
  // client. Only genuine students count (exclude owner/co_teacher rows).
  const reader = studentSignalReader()
  const { data: classroom } = await reader
    .from("classrooms")
    .select("name")
    .eq("id", classroomId)
    .maybeSingle()
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
  const prompt = `Class: ${classroom?.name ?? "this class"}. Per-student signal:
${JSON.stringify(perStudent, null, 2)}

Return ONLY JSON:
{"trajectory":"overall read on the class","needs_attention":[{"student":"name","why":"..."}],"regrouping":"one suggested regrouping","next_step":"one recommended next step"}
No prose, no fences.`

  let insights: z.infer<typeof classInsightsResultSchema>
  try {
    insights = classInsightsResultSchema.parse(
      await callJson(
        TASK_CONFIG.class_insights.model,
        system,
        prompt,
        TASK_CONFIG.class_insights.maxTokens,
        { signal: ctx.signal },
      ),
    )
  } catch (err) {
    console.error("[virgil] class_insights generation failed:", err)
    return Response.json({ error: "Virgil couldn't read the class right now. Try again." }, { status: 502 })
  }

  await recordTaskEvent(ctx.userId, "class_insights", classroomId)
  return Response.json(insights)
}

// ── Dispatch ──────────────────────────────────────────────────────────────────

const TEACHER_TASKS = new Set<TeacherTaskKey>([
  "teacher_quiz",
  "assignment_draft",
  "grade_response",
  "announcement_draft",
  "student_note",
  "class_insights",
])

export function isTeacherTask(task: unknown): task is TeacherTaskKey {
  return typeof task === "string" && TEACHER_TASKS.has(task as TeacherTaskKey)
}

export async function handleTeacherTask(
  task: TeacherTaskKey,
  raw: unknown,
  ctx: TaskCtx,
): Promise<Response> {
  switch (task) {
    case "teacher_quiz":
      return handleTeacherQuiz(raw, ctx)
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
