import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { getEntitlement, getUserRole } from "@/lib/entitlements/server"

export const dynamic = "force-dynamic"

/**
 * Record a passed Trial server-side through the single authoritative path:
 * record_trial_result (SECURITY DEFINER) inserts the quiz_results row AND awards
 * the Wisdom/coins to user_stats, both from a server-computed amount (tier rate ×
 * correct answers). The client no longer names the Wisdom number, and direct
 * INSERT on quiz_results is revoked — so no account can mint Wisdom or poison a
 * classroom leaderboard. Anonymous/guest readers (no session) get a 401 and
 * simply keep their localStorage progress.
 */
const bodySchema = z.object({
  bookId: z.string().min(1).max(200),
  chapterIndex: z.number().int().min(0),
  difficulty: z.string().max(40).optional(),
  correct: z.number().int().min(0).max(500),
  totalQuestions: z.number().int().min(0).max(500),
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
    correct,
    totalQuestions,
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

  // record_trial_result / user_stats are introduced by migrations not yet
  // reflected in the generated database.types — cast through `any` so the build
  // stays clean while the RPC (SECURITY DEFINER) records the row and awards the
  // server-computed Wisdom under the user's auth context.
  const rpc = supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: any; error: any }>
  }

  const { data: statsRow, error: recordError } = await rpc.rpc("record_trial_result", {
    p_book_id: bookId,
    p_chapter_index: chapterIndex,
    p_difficulty: difficulty ?? null,
    p_correct: correct,
    p_total: totalQuestions,
  })
  if (recordError) {
    return Response.json({ error: recordError.message }, { status: 500 })
  }
  // The RPC returns the reconciled user_stats row; the reader syncs its progress
  // display from this authoritative value rather than a client-minted amount.
  const stats = Array.isArray(statsRow) ? statsRow[0] : statsRow

  return Response.json({ ok: true, stats: stats ?? null })
}
