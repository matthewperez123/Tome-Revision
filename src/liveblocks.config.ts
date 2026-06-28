// Liveblocks global typing. Augments the `Liveblocks` interface so every
// Liveblocks hook/provider in the app is typed against our reader presence
// shape — no per-call generics needed. See reader-presence.tsx (presence
// writer) and the /api/liveblocks-auth route (where userInfo is minted).
declare global {
  interface Liveblocks {
    // Per-connection presence broadcast to others in the room.
    Presence: {
      // Which chapter index the reader is currently on (-1 before known).
      chapterIndex: number
    }
    // Immutable metadata the auth endpoint attaches to the session. Mirrors
    // the public profile fields safe to surface to co-readers.
    UserMeta: {
      id: string
      info: {
        name: string
        // Liveblocks' IUserInfo types `avatar` as `string` (optional) — use
        // undefined (not null) when the profile has no avatar.
        avatar?: string
        // Server-derived (NEVER client-supplied) role for guided-annotation
        // rooms. The UI keys moderation affordances off this; the auth
        // endpoint sets it from session ownership. Absent on reader rooms.
        role?: "teacher" | "student"
      }
    }
    // Per-thread metadata for guided-session margin annotations. Liveblocks
    // thread metadata only accepts string | number | boolean, so the W3C
    // text anchor is stored flattened (exact quote + a few chars of
    // prefix/suffix for disambiguation, plus char offsets as a fallback).
    // This is what the reader uses to re-find the highlighted span on each
    // paginated page after reflow. See src/lib/annotations/anchor.ts.
    ThreadMetadata: {
      quote: string
      prefix: string
      suffix: string
      startOffset: number
      endOffset: number
      chapterIndex: number
      // Teacher moderation / Virgil flags (rendered distinctly — gold-leaf
      // for endorsed/official, iridescent for Virgil). Optional; PR2/PR4.
      endorsed?: boolean
      teacherNote?: boolean
      virgil?: boolean
    }
  }
}

export {}
