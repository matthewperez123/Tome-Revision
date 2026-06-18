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
      }
    }
  }
}

export {}
