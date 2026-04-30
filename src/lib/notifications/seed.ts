/**
 * Demo notification seed for the reader role.
 *
 * Today this is consumed by the `useRealtimeNotifications` hook when no
 * authenticated user / real Supabase data is available. Tomorrow these rows
 * can be inserted into `db_notifications` and the hook will pick them up
 * automatically — the shape matches `DbNotification`.
 *
 * Each entry has a sensible `action_url` so no notification is a dead end.
 */

export type DemoNotificationCategory =
  | "social"
  | "assignment"
  | "system"
  | "achievement"

export interface DemoNotification {
  id: string
  type: string
  title: string
  body: string | null
  action_url: string | null
  read: boolean
  /** ISO timestamp string. */
  created_at: string
  /**
   * Visual category. Drives the left-border accent and icon family in the
   * notification card. Optional so it can be derived from `type` if absent.
   */
  category?: DemoNotificationCategory
  /**
   * Optional book id used by the inline "Save for later" action on friend
   * recommendations. The action only updates local state for the demo.
   */
  bookmarkBookId?: string
  /**
   * Optional book title used in the save-for-later toast confirmation.
   */
  bookmarkTitle?: string
}

const minutes = (n: number) => new Date(Date.now() - n * 60_000).toISOString()
const hours = (n: number) => minutes(n * 60)
const days = (n: number) => hours(n * 24)

/**
 * Reader demo set — 11 notifications spanning the social, assignment, system,
 * and achievement categories with mixed read states and timestamps.
 */
export const DEMO_READER_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "rn-rec-paradise-lost",
    type: "friend_recommendation",
    title: "Sarah recommended Paradise Lost to you",
    body: "She thought you'd enjoy Book I",
    action_url: "/book/paradise-lost",
    read: false,
    created_at: minutes(45),
    category: "social",
    bookmarkBookId: "paradise-lost",
    bookmarkTitle: "Paradise Lost",
  },
  {
    id: "rn-assignment-iliad",
    type: "assignment_created",
    title: "Mr. Aurelius assigned Books I–III of The Iliad",
    body: "Due Friday · AP Literature — Period 3",
    action_url: "/assignments/iliad-books-1-3",
    read: false,
    created_at: hours(2),
    category: "assignment",
  },
  {
    id: "rn-trial-hamlet",
    type: "submission_graded",
    title: "You completed Hamlet Act III Trial",
    body: "18 Wisdom earned",
    action_url: "/book/hamlet",
    read: false,
    created_at: hours(4),
    category: "achievement",
  },
  {
    id: "rn-streak-7",
    type: "streak_milestone",
    title: "Seven-day Flame",
    body: "Keep it going",
    action_url: "/profile/stats",
    read: false,
    created_at: hours(8),
    category: "achievement",
  },
  {
    id: "rn-rec-meditations",
    type: "friend_recommendation",
    title: "Theo recommended Meditations to you",
    body: "Marcus Aurelius · Book IV",
    action_url: "/book/meditations",
    read: false,
    created_at: hours(11),
    category: "social",
    bookmarkBookId: "meditations",
    bookmarkTitle: "Meditations",
  },
  {
    id: "rn-seal-cartographer",
    type: "seal_earned",
    title: "You earned the Cartographer Seal",
    body: "For finishing The Odyssey",
    action_url: "/seals/cartographer",
    read: true,
    created_at: hours(20),
    category: "achievement",
  },
  {
    id: "rn-newbook-aeneid",
    type: "new_book_in_canon",
    title: "The Aeneid is now available in the library",
    body: "Virgil · twelve books, fully ingested",
    action_url: "/book/the-aeneid",
    read: false,
    created_at: days(1),
    category: "system",
  },
  {
    id: "rn-friend-marcus",
    type: "friend_activity",
    title: "Marcus finished Macbeth",
    body: "He earned the Tragedian Seal",
    action_url: "/profile/marcus",
    read: true,
    created_at: days(1),
    category: "social",
  },
  {
    id: "rn-stoa-school-of-athens",
    type: "stoa_update",
    title: "A new painting was added to the Stoa",
    body: "The School of Athens · Raphael",
    action_url: "/explore",
    read: true,
    created_at: days(2),
    category: "system",
  },
  {
    id: "rn-assignment-due-soon",
    type: "assignment_due_soon",
    title: "Inferno Cantos I–III response due tomorrow",
    body: "World Literature · 600-word reflection",
    action_url: "/assignments/inferno-cantos-1-3",
    read: true,
    created_at: days(2),
    category: "assignment",
  },
  {
    id: "rn-friend-beatrice",
    type: "friend_activity",
    title: "Beatrice started reading Inferno",
    body: "Canto I · the dark wood",
    action_url: "/profile/beatrice",
    read: true,
    created_at: days(3),
    category: "social",
  },
]

/**
 * Map a notification type to a visual category when one isn't explicitly
 * set on the row. Used by the notification card to pick the left-border
 * accent and icon family.
 */
export function categoryForType(
  type: string,
  explicit?: DemoNotificationCategory,
): DemoNotificationCategory {
  if (explicit) return explicit
  if (
    type.startsWith("assignment") ||
    type === "submission_graded" ||
    type === "peer_review_assigned" ||
    type === "peer_review_received"
  ) {
    return "assignment"
  }
  if (
    type === "friend_recommendation" ||
    type === "friend_request_received" ||
    type === "friend_request_accepted" ||
    type === "friend_activity" ||
    type === "book_recommendation_received" ||
    type === "book_recommendation_accepted"
  ) {
    return "social"
  }
  if (
    type === "seal_earned" ||
    type === "streak_milestone" ||
    type === "flame_milestone" ||
    type === "book_completed" ||
    type === "chapter_completed"
  ) {
    return "achievement"
  }
  return "system"
}
