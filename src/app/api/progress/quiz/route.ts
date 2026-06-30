import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/**
 * Mirror a passed Trial to Supabase so Wisdom (XP) and Flames (streak) persist
 * server-side and survive sign-out/sign-in. localStorage remains the instant
 * source of truth (economy-provider); this write is additive and best-effort —
 * the reader fires it and forgets. Anonymous/guest readers (no session) get a
 * 401 and simply keep their localStorage progress.
 */
const bodySchema = z.object({
  bookId: z.string().min(1).max(200),
  chapterIndex: z.number().int().min(0),
  difficulty: z.string().max(40).optional(),
  score: z.number().int().min(0).max(100),
  totalQuestions: z.number().int().min(0).max(500),
  wisdomEarned: z.number().int().min(0).max(100000),
  currentStreak: z.number().int().min(0).max(100000).optional(),
  isLastChapter: z.boolean().optional(),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const {
    bookId,
    chapterIndex,
    difficulty,
    score,
    totalQuestions,
    wisdomEarned,
    currentStreak,
    isLastChapter,
  } = parsed.data

  // quiz_results / profiles.total_xp are introduced by a migration not yet
  // reflected in the generated database.types — cast through `any` so the build
  // stays clean while the row still inserts under the user's RLS context.
  const db = supabase as unknown as {
    from: (t: string) => any
  }

  const { error: insertError } = await db.from("quiz_results").insert({
    user_id: user.id,
    book_id: bookId,
    chapter_index: chapterIndex,
    difficulty: difficulty ?? null,
    score,
    total_questions: totalQuestions,
    wisdom_earned: wisdomEarned,
    passed: true,
  })
  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  // Accumulate Wisdom and carry the highest known Flame count onto the profile.
  const { data: profile } = await db
    .from("profiles")
    .select("total_xp, current_streak")
    .eq("id", user.id)
    .single()

  const nextXp = (profile?.total_xp ?? 0) + wisdomEarned
  const nextStreak = Math.max(profile?.current_streak ?? 0, currentStreak ?? 0)

  await db
    .from("profiles")
    .update({ total_xp: nextXp, current_streak: nextStreak })
    .eq("id", user.id)

  // Emit the social milestone(s) for the Community feed. Best-effort — the
  // SECURITY DEFINER record_activity() dedupes per (actor, type, entity) so a
  // re-passed quiz never spams. A passing quiz on the final chapter is also a
  // book_completed milestone.
  await supabase.rpc("record_activity", {
    p_type: "trial_passed",
    p_entity_type: "trial",
    p_entity_id: `${bookId}:${chapterIndex}`,
    p_visibility: "friends",
  })
  if (isLastChapter) {
    await supabase.rpc("record_activity", {
      p_type: "book_completed",
      p_entity_type: "book",
      p_entity_id: bookId,
      p_visibility: "friends",
    })
  }

  return Response.json({ ok: true, total_xp: nextXp, current_streak: nextStreak })
}
