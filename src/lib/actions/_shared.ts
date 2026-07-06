import "server-only"

import type { SupabaseClient, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import { hasActiveSchoolEntitlement } from "@/lib/entitlements/server"

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

// ── Paid educator-tool gate ───────────────────────────────────────────────
// The free Classroom tier (1 class, ≤30 students) is open to any teacher, but
// the paid educator tools — creating assignments, the gradebook, AI quiz/plan
// generation, and Virgil reflection grading — require an active School
// entitlement (as the plan admin OR a covered teacher seat). Call this at the
// top of every such action; it resolves the signed-in user and verifies the
// entitlement server-side so it can't be spoofed from the client.

export async function requireSchoolTools(): Promise<
  | { ok: true; supabase: SupaClient; user: User }
  | { ok: false; error: string }
> {
  let user: User
  let supabase: SupaClient
  try {
    ;({ supabase, user } = await requireUser())
  } catch {
    return { ok: false, error: "Sign in to use educator tools." }
  }
  const allowed = await hasActiveSchoolEntitlement(user.id)
  if (!allowed) {
    return {
      ok: false,
      error: "This tool requires an active School plan. Upgrade to unlock educator tools.",
    }
  }
  return { ok: true, supabase, user }
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
// Writes into public.notifications. Uses the service-role client because the
// actor and recipient are usually different users (RLS denies all client
// inserts by design — the only write paths are this helper and the
// SECURITY DEFINER create_notification RPC). Best-effort: failures are logged
// but never abort the calling action.
//
// The table is normalized (recipient/actor/type/entity_*/payload). The
// human-readable title/body/action_url are presentational and live inside
// `payload` so the bell can render a message without extra joins.

export type NotificationType =
  | "friend_request"
  | "friend_accepted"
  | "group_invite"
  | "group_post"
  | "class_assignment"
  | "assignment_graded"
  | "parent_link_request"
  | "session_summary"
  | "peer_review"
  | "book_recommendation"
  | "message"
  | "system"

export interface NotifyParams {
  recipientId: string
  type: NotificationType
  /** The user who caused the notification (nullable for system events). */
  actorId?: string
  /** What the notification points at, e.g. "assignment", "connection". */
  entityType?: string
  entityId?: string
  /** Presentational fields folded into payload. */
  title: string
  body?: string
  actionUrl?: string
  /** Extra structured fields merged into payload (e.g. { status: "received" }). */
  payload?: Record<string, unknown>
}

export async function notify(params: NotifyParams | NotifyParams[]) {
  const list = Array.isArray(params) ? params : [params]
  if (list.length === 0) return
  const admin = createAdminClient()
  const rows = list.map((p) => ({
    recipient_id: p.recipientId,
    actor_id: p.actorId ?? null,
    type: p.type,
    entity_type: p.entityType ?? null,
    entity_id: p.entityId ?? null,
    payload: {
      title: p.title,
      body: p.body ?? null,
      action_url: p.actionUrl ?? null,
      ...(p.payload ?? {}),
    },
  }))
  const { error } = await admin.from("notifications").insert(rows)
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
//   * bootstrapping the owner group_members row at group-create time
//   * pre-creating assignment_submissions for students at assignment-create
//   * looking up classrooms / groups by join_code before membership
// Always pair with explicit ownership checks in the action.
