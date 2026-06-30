import Anthropic from "@anthropic-ai/sdk"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/send"
import { WeeklyDigestEmail, type DigestBook } from "@/lib/email/templates/weekly-digest"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tome-revision.vercel.app"
const HAIKU = "claude-haiku-4-5-20251001"

interface QuizRow {
  user_id: string
  book_id: string
  chapter_index: number
  score: number
  wisdom_earned: number
}
interface ProgressRow {
  user_id: string
  book_id: string
  updated_at: string
}
interface ProfileRow {
  id: string
  display_name: string | null
  total_xp: number | null
  current_streak: number | null
  role: string | null
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
}

function fmt(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** Optional warm one-liner in Virgil's voice. Never throws — returns undefined. */
async function virgilNote(
  name: string,
  chapters: number,
  trials: number,
  wisdom: number,
  flames: number,
): Promise<string | undefined> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return undefined
  try {
    const client = new Anthropic({ apiKey })
    const res = await client.messages.create({
      model: HAIKU,
      max_tokens: 120,
      system:
        "You are Virgil, a warm, erudite reading guide. Write ONE sentence (max 30 words) " +
        "celebrating a reader's week in the classics. Second person, no emojis, no quotes, no preamble.",
      messages: [
        {
          role: "user",
          content: `Reader: ${name}. This week: ${chapters} chapters read, ${trials} Trials passed, ${wisdom} Wisdom earned, ${flames}-day Flame streak.`,
        },
      ],
    })
    const text = res.content.find((b) => b.type === "text")
    const note = text && "text" in text ? text.text.trim() : ""
    return note || undefined
  } catch (err) {
    console.warn("[weekly-digest] Virgil note skipped:", err)
    return undefined
  }
}

export async function GET(request: Request) {
  // ── Auth: only the cron may call this ──
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = createAdminClient() as unknown as { from: (t: string) => any }

  // Reporting window: the trailing 7 days. The cron fires Monday 13:00 UTC, so
  // `since` lands on the previous Monday — its date is the week_start key.
  const now = new Date()
  const since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weekStart = since.toISOString().slice(0, 10) // YYYY-MM-DD
  const weekLabel = `${fmt(since)} – ${fmt(now)}`

  // ── Bulk reads (service role bypasses RLS) ──
  const [{ data: profiles }, { data: quizzes }, { data: progress }, { data: alreadySent }] =
    await Promise.all([
      db.from("profiles").select("id, display_name, total_xp, current_streak, role"),
      db
        .from("quiz_results")
        .select("user_id, book_id, chapter_index, score, wisdom_earned")
        .gte("created_at", since.toISOString()),
      db
        .from("reading_progress")
        .select("user_id, book_id, updated_at")
        .gte("updated_at", since.toISOString()),
      db.from("digest_runs").select("user_id").eq("week_start", weekStart),
    ])

  const sentSet = new Set<string>((alreadySent ?? []).map((r: { user_id: string }) => r.user_id))

  // Group activity by user.
  const quizByUser = new Map<string, QuizRow[]>()
  for (const q of (quizzes ?? []) as QuizRow[]) {
    const arr = quizByUser.get(q.user_id) ?? []
    arr.push(q)
    quizByUser.set(q.user_id, arr)
  }
  const progByUser = new Map<string, ProgressRow[]>()
  for (const p of (progress ?? []) as ProgressRow[]) {
    const arr = progByUser.get(p.user_id) ?? []
    arr.push(p)
    progByUser.set(p.user_id, arr)
  }

  // Email lookup (auth.users is not in `public`).
  const emailById = new Map<string, string>()
  for (let page = 1; page <= 40; page++) {
    const { data, error } = await (createAdminClient() as any).auth.admin.listUsers({
      page,
      perPage: 1000,
    })
    if (error || !data?.users?.length) break
    for (const u of data.users) if (u.email) emailById.set(u.id, u.email)
    if (data.users.length < 1000) break
  }

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const profile of (profiles ?? []) as ProfileRow[]) {
    if (profile.role === "teacher") continue
    if (sentSet.has(profile.id)) {
      skipped++
      continue
    }

    const userQuizzes = quizByUser.get(profile.id) ?? []
    const userProgress = progByUser.get(profile.id) ?? []

    // Skip readers with an empty week.
    if (userQuizzes.length === 0 && userProgress.length === 0) {
      skipped++
      continue
    }

    const email = emailById.get(profile.id)
    if (!email) {
      skipped++
      continue
    }

    const trialsPassed = userQuizzes.length
    const chapterKeys = new Set(userQuizzes.map((q) => `${q.book_id}:${q.chapter_index}`))
    const chaptersRead = chapterKeys.size || userProgress.length
    const averageScore =
      trialsPassed > 0
        ? Math.round(userQuizzes.reduce((s, q) => s + q.score, 0) / trialsPassed)
        : 0
    const wisdomEarned = userQuizzes.reduce((s, q) => s + q.wisdom_earned, 0)
    const flameCount = profile.current_streak ?? 0

    const continueBooks: DigestBook[] = userProgress
      .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
      .slice(0, 2)
      .map((p) => ({ title: titleFromSlug(p.book_id), href: `${SITE_URL}/read/${p.book_id}` }))

    const displayName = profile.display_name?.trim() || "Reader"
    const note = await virgilNote(
      displayName,
      chaptersRead,
      trialsPassed,
      wisdomEarned,
      flameCount,
    )

    // Idempotency: claim the slot BEFORE sending so a concurrent run can't
    // double-send; delete the claim if the send fails so a retry repicks it.
    const { error: claimError } = await db
      .from("digest_runs")
      .insert({ user_id: profile.id, week_start: weekStart })
    if (claimError) {
      // Unique violation => already claimed/sent this week. Skip quietly.
      skipped++
      continue
    }

    const result = await sendEmail({
      to: email,
      subject: `Your week in Tome — ${weekLabel}`,
      react: WeeklyDigestEmail({
        recipient: email,
        displayName,
        weekLabel,
        chaptersRead,
        trialsPassed,
        averageScore,
        wisdomEarned,
        flameCount,
        continueBooks,
        virgilNote: note,
        stoaUrl: `${SITE_URL}/dashboard`,
      }),
    })

    if (result.ok) {
      sent++
    } else {
      // Release the slot so the next run can retry this reader.
      await db.from("digest_runs").delete().eq("user_id", profile.id).eq("week_start", weekStart)
      errors.push(`${profile.id}: ${result.error ?? "send failed"}`)
    }
  }

  return Response.json({ ok: true, weekStart, sent, skipped, errors })
}
