/**
 * Tables that hold user-owned rows. When a user hard-deletes their account
 * we wipe these (in order) using the service-role client BEFORE calling
 * `auth.admin.deleteUser`.
 *
 * Order matters: delete leaf rows before parents so foreign-key cascades
 * never block. If any of these tables don't exist in your schema yet the
 * delete is silently skipped (Supabase returns a "relation does not exist"
 * error which we tolerate — see `runDeletionCascade`).
 *
 * Tables confirmed in `supabase/migrations/`:
 *   - guided_session_*    (4 tables, FK to guided_sessions)
 *   - achievement_unlocks
 *
 * Tables NOT yet in migrations but referenced in code (best-effort delete):
 *   - profiles            (referenced by middleware.ts and lib/auth.ts)
 *   - wisdom_entries
 *   - flame_logs
 *   - seal_unlocks
 *   - trial_attempts
 *   - annotations
 *   - highlights
 *   - library_entries
 *   - book_circle_memberships
 *   - notifications
 *   - bookmarks
 *
 * If you add a new user-owned table, append it to USER_OWNED_TABLES so
 * deletion stays compliant.
 */

export interface UserOwnedTable {
  name: string
  /** The column on this table that holds the owning user_id. */
  userColumn: string
}

export const USER_OWNED_TABLES: readonly UserOwnedTable[] = [
  // Leaf tables (no inbound FKs from other user-owned tables) first.
  { name: "guided_session_messages", userColumn: "user_id" },
  { name: "guided_session_reflections", userColumn: "user_id" },
  { name: "guided_session_stations", userColumn: "user_id" },
  { name: "guided_session_events", userColumn: "user_id" },
  { name: "guided_session_participants", userColumn: "user_id" },
  { name: "guided_sessions", userColumn: "host_user_id" },

  { name: "achievement_unlocks", userColumn: "user_id" },

  // Aspirational / referenced-in-code (no migration yet).
  { name: "wisdom_entries", userColumn: "user_id" },
  { name: "flame_logs", userColumn: "user_id" },
  { name: "seal_unlocks", userColumn: "user_id" },
  { name: "trial_attempts", userColumn: "user_id" },
  { name: "highlights", userColumn: "user_id" },
  { name: "library_entries", userColumn: "user_id" },
  { name: "book_circle_memberships", userColumn: "user_id" },
  { name: "notifications", userColumn: "user_id" },

  // Profile last — many things FK to it.
  { name: "profiles", userColumn: "id" },
] as const

/** Postgres error code for "relation does not exist". */
export const PG_UNDEFINED_TABLE = "42P01"
