import "server-only"

import type { SupabaseClient, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"

// Loose-typed Supabase client alias. Until `supabase gen types typescript`
// is wired into the build, the action layer cannot get strict insert/select
// row types — every `.from('table')` call would be inferred as `never`. This
// alias keeps callers ergonomic without sprinkling `any` everywhere.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupaClient = SupabaseClient<any, "public", any>

// ── Result shape ──────────────────────────────────────────────────────────
// Every server action returns this discriminated union so callers can
// branch on `result.ok` without throwing.

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data })
export const fail = (error: string): ActionResult<never> => ({
  ok: false,
  error,
})

// ── Auth helpers ──────────────────────────────────────────────────────────

export async function requireUser(): Promise<{
  supabase: SupaClient
  user: User
}> {
  const raw = await createClient()
  const {
    data: { user },
  } = await raw.auth.getUser()
  if (!user) throw new Error("UNAUTHENTICATED")
  return { supabase: raw as unknown as SupaClient, user }
}

export function createAdminClient(): SupaClient {
  return createAdminClientUntyped() as unknown as SupaClient
}

// ── Join-code generator ───────────────────────────────────────────────────
// 4-4 alphanumeric uppercase. Excludes ambiguous chars (I, O, 0, 1).

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateJoinCode(): string {
  const pick = () =>
    CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  const block = () => Array.from({ length: 4 }, pick).join("")
  return `${block()}-${block()}`
}

// ── Notification helper ───────────────────────────────────────────────────
// Writes into db_notifications. Uses the service-role client because the
// actor and recipient are usually different users (RLS would otherwise
// block cross-user inserts). Best-effort: failures are logged but never
// abort the calling action.

export interface NotifyParams {
  userId: string
  type: string
  title: string
  body?: string
  actionUrl?: string
  sourceUserId?: string
  classroomId?: string
}

export async function notify(params: NotifyParams | NotifyParams[]) {
  const list = Array.isArray(params) ? params : [params]
  if (list.length === 0) return
  const admin = createAdminClient()
  const rows = list.map((p) => ({
    user_id: p.userId,
    type: p.type,
    title: p.title,
    body: p.body ?? null,
    action_url: p.actionUrl ?? null,
    source_user_id: p.sourceUserId ?? null,
    classroom_id: p.classroomId ?? null,
  }))
  const { error } = await admin.from("db_notifications").insert(rows)
  if (error) {
    console.error("[notify] insert failed:", error.message, {
      count: rows.length,
    })
  }
}

// ── Admin escape hatch ────────────────────────────────────────────────────
// `createAdminClient` is exported above (already returning the loose-typed
// alias). Use it for privileged bootstraps that RLS can't express
// ergonomically:
//   * inserting the owner classroom_members row at classroom-create time
//   * inserting the admin study_group_members row at group-create time
//   * pre-creating assignment_submissions for students at assignment-create
//   * looking up classrooms / study_groups by join_code before membership
// Always pair with explicit ownership checks in the action.
