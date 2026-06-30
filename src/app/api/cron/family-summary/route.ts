import { createAdminClient } from "@/lib/supabase/admin"
import { notify, type NotifyParams } from "@/lib/actions/_shared"

export const dynamic = "force-dynamic"
export const maxDuration = 60

interface LinkRow {
  id: string
  parent_id: string
  student_id: string
}
interface QuizRow {
  user_id: string
  book_id: string
  chapter_index: number
  passed: boolean
  wisdom_earned: number | null
}
interface ProgressRow {
  user_id: string
  book_id: string
}
interface ProfileRow {
  id: string
  display_name: string | null
}
interface ExistingNotif {
  recipient_id: string
  entity_id: string | null
}

export async function GET(request: Request) {
  // ── Auth: only the cron may call this ──
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = createAdminClient()

  // Reporting window: the trailing 7 days. week_start keys the dedup so a fresh
  // summary may go out each week, but never twice for the same week.
  const now = new Date()
  const since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weekStart = since.toISOString().slice(0, 10)

  // Only active links share anything — revoked/pending see nothing.
  const { data: linksData } = await db
    .from("parent_links")
    .select("id, parent_id, student_id")
    .eq("status", "active")
  const links = (linksData as LinkRow[] | null) ?? []

  if (links.length === 0) {
    return Response.json({ ok: true, links: 0, notified: 0 })
  }

  const studentIds = Array.from(new Set(links.map((l) => l.student_id)))
  const linkIds = links.map((l) => l.id)

  // Bulk reads (service role bypasses RLS) — scoped to the linked students.
  const [{ data: quizzes }, { data: progress }, { data: profiles }, { data: existing }] =
    await Promise.all([
      db
        .from("quiz_results")
        .select("user_id, book_id, chapter_index, passed, wisdom_earned")
        .in("user_id", studentIds)
        .gte("created_at", since.toISOString()),
      db
        .from("reading_progress")
        .select("user_id, book_id")
        .in("user_id", studentIds)
        .gte("updated_at", since.toISOString()),
      db.from("profiles").select("id, display_name").in("id", studentIds),
      db
        .from("notifications")
        .select("recipient_id, entity_id")
        .eq("type", "session_summary")
        .eq("payload->>kind", "family_summary")
        .eq("payload->>week_start", weekStart)
        .in("entity_id", linkIds),
    ])

  const nameById = new Map(
    ((profiles as ProfileRow[] | null) ?? []).map((p) => [
      p.id,
      p.display_name?.trim() || "Your reader",
    ]),
  )

  // Per-student weekly tallies.
  const quizByStudent = new Map<string, QuizRow[]>()
  for (const q of (quizzes as QuizRow[] | null) ?? []) {
    const arr = quizByStudent.get(q.user_id) ?? []
    arr.push(q)
    quizByStudent.set(q.user_id, arr)
  }
  const chaptersByStudent = new Map<string, Set<string>>()
  for (const p of (progress as ProgressRow[] | null) ?? []) {
    const set = chaptersByStudent.get(p.user_id) ?? new Set<string>()
    set.add(p.book_id)
    chaptersByStudent.set(p.user_id, set)
  }

  const alreadySent = new Set(
    ((existing as ExistingNotif[] | null) ?? []).map(
      (n) => `${n.recipient_id}:${n.entity_id}`,
    ),
  )

  const toNotify: NotifyParams[] = []
  for (const link of links) {
    const key = `${link.parent_id}:${link.id}`
    if (alreadySent.has(key)) continue

    const userQuizzes = quizByStudent.get(link.student_id) ?? []
    const trialsPassed = userQuizzes.filter((q) => q.passed).length
    const wisdom = userQuizzes.reduce((s, q) => s + (q.wisdom_earned ?? 0), 0)
    const booksRead = chaptersByStudent.get(link.student_id)?.size ?? 0

    // Skip a quiet week — no summary for no activity.
    if (trialsPassed === 0 && wisdom === 0 && booksRead === 0) continue

    const name = nameById.get(link.student_id) ?? "Your reader"
    const parts = [
      booksRead > 0 ? `${booksRead} ${booksRead === 1 ? "book" : "books"}` : null,
      trialsPassed > 0
        ? `${trialsPassed} ${trialsPassed === 1 ? "trial" : "trials"}`
        : null,
      wisdom > 0 ? `${wisdom} Wisdom` : null,
    ].filter(Boolean)

    toNotify.push({
      recipientId: link.parent_id,
      type: "session_summary",
      title: `${name}'s week in Tome`,
      body: parts.length > 0 ? `This week: ${parts.join(" · ")}.` : undefined,
      actionUrl: "/family",
      actorId: link.student_id,
      entityType: "parent_link",
      entityId: link.id,
      payload: { kind: "family_summary", week_start: weekStart },
    })
  }

  if (toNotify.length > 0) await notify(toNotify)

  return Response.json({
    ok: true,
    links: links.length,
    notified: toNotify.length,
  })
}
