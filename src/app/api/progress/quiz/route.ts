import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { getEntitlement, getUserRole } from "@/lib/entitlements/server"

export const dynamic = "force-dynamic"

/**
 * Record a passed Trial server-side: persist the quiz_results row and emit the
 * Community-feed milestone(s). Wisdom (XP) and Flames (streak) are NOT written
 * here — the economy-provider awards them through the SECURITY DEFINER
 * economy_* RPCs (user_stats is the single source of truth). Anonymous/guest
 * readers (no session) get a 401 and simply keep their localStorage progress.
 */
const bodySchema = z.object({
  bookId: z.string().min(1).max(200),
  chapterIndex: z.number().int().min(0),
  difficulty: z.string().max(40).optional(),
  score: z.number().int().min(0).max(100),
  totalQuestions: z.number().int().min(0).max(500),
  wisdomEarned: z.number().int().min(0).max(100000),
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
    isLastChapter,
  } = parsed.data

  // Advanced Trials (Scholar / Master) are a paid feature. Enforce it on the
  // server so a free account can't bank credit for an assessment its plan
  // doesn't include. Classroom roles (teacher/student) are exempt.
  const difficultyLevel = (difficulty ?? "").toLowerCase()
  const isAdvancedTrial = difficultyLevel === "scholar" || difficultyLevel === "master"
  if (isAdvancedTrial) {
    const role = await getUserRole(user.id)
    const isClassroomRole = role === "teacher" || role === "student"
    if (!isClassroomRole) {
      const entitlement = await getEntitlement(user.id)
      if (!entitlement.features.advancedTrials) {
        return Response.json(
          {
            error: "advanced_trials",
            message:
              "Scholar and Master Trials are part of Tome Solo. Upgrade to take advanced Trials.",
          },
          { status: 402 },
        )
      }
    }
  }

  // quiz_results is introduced by a migration not yet reflected in the
  // generated database.types — cast through `any` so the build stays clean
  // while the row still inserts under the user's RLS context.
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

  // Wisdom / coins / Flames are awarded by the economy-provider via the
  // economy_award RPC (user_stats = single source of truth). This route no
  // longer writes gamification state, so a Trial's Wisdom is never counted twice.

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

  return Response.json({ ok: true })
}
