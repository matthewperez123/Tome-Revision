import { createAdminClient } from "@/lib/supabase/admin"
import { syncPoolSizes } from "@/lib/credits/pools"

export const dynamic = "force-dynamic"
export const maxDuration = 300

/**
 * Daily Questions Available maintenance (06:00 UTC, vercel.json):
 * 1. `refresh_question_grants()` — pools 30+ days past their last grant gain
 *    a month's credits (capped at accrual_cap).
 * 2. `syncPoolSizes` for every teacher who owns a classroom, so pool sizes
 *    track roster and subscription changes.
 */
export async function GET(request: Request) {
  // Only the primary deployment runs crons (forks share this Supabase DB).
  if (process.env.CRON_ENABLED !== "true") {
    return Response.json({ skipped: true, reason: "cron disabled on this deployment" })
  }

  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = createAdminClient()

  const { data: granted, error: grantErr } = await db.rpc("refresh_question_grants")
  if (grantErr) {
    return Response.json({ error: grantErr.message }, { status: 500 })
  }

  // Every distinct classroom owner gets a size sync (covers roster drift).
  const { data: rooms } = await db.from("classrooms").select("teacher_id")
  const owners = [
    ...new Set(
      ((rooms ?? []) as { teacher_id: string | null }[])
        .map((r) => r.teacher_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ]

  let synced = 0
  for (const ownerId of owners) {
    try {
      await syncPoolSizes(ownerId)
      synced++
    } catch {
      // Continue; the next run retries.
    }
  }

  return Response.json({ granted: granted ?? 0, ownersSynced: synced })
}
