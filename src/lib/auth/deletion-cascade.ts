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
  { name: "notifications", userColumn: "recipient_id" },

  // Community feed: remove my reactions first, then my activities (which
  // cascade-delete anyone's reactions on them), plus any reports I filed.
  // (All three FKs are also ON DELETE CASCADE on auth.users.)
  { name: "activity_reactions", userColumn: "user_id" },
  { name: "activities", userColumn: "actor_id" },
  { name: "reports", userColumn: "reporter_id" },

  // Friendships hold two user FK columns; delete rows on either side so no
  // half of a reciprocal pair survives. (Both FKs also ON DELETE CASCADE.)
  { name: "friendships", userColumn: "requester_id" },
  { name: "friendships", userColumn: "addressee_id" },

  // Parent/guardian consent links hold two user FK columns; delete rows on
  // either side. (Both FKs are also ON DELETE CASCADE on auth.users.)
  { name: "parent_links", userColumn: "parent_id" },
  { name: "parent_links", userColumn: "student_id" },

  // Groups (book clubs / study groups): wipe my posts, invites I sent or was
  // sent, my memberships, then any group I own (which cascade-deletes its
  // members/posts/invites/schedule). All FKs are also ON DELETE CASCADE on
  // auth.users — this is a best-effort explicit wipe.
  { name: "group_posts", userColumn: "author_id" },
  { name: "group_invites", userColumn: "inviter_id" },
  { name: "group_invites", userColumn: "invitee_id" },
  { name: "group_members", userColumn: "user_id" },
  { name: "groups", userColumn: "owner_id" },

  // Profile last — many things FK to it.
  { name: "profiles", userColumn: "id" },
] as const

/** Postgres error code for "relation does not exist". */
export const PG_UNDEFINED_TABLE = "42P01"
