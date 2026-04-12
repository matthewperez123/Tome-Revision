/**
 * Tome Notification System — localStorage-backed
 *
 * Types, store, creation helpers, and query functions.
 * Ready for Supabase migration: swap the storage layer,
 * keep the same API surface.
 */

// ── Notification Types ──────────────────────────────────────────────────────

export type NotificationType =
  // Achievements & Seals
  | "seal_earned"
  | "seal_tier_up"
  | "seal_rare_unlock"
  // Reading Progress
  | "chapter_completed"
  | "book_completed"
  | "part_completed"
  | "first_book_completed"
  | "tradition_completed"
  // Streak & Wisdom
  | "flame_milestone"
  | "flame_recovered"
  | "wisdom_milestone"
  | "daily_goal_met"
  // Virgil
  | "virgil_annotation_ready"
  | "virgil_insight"
  // Unlocks
  | "painting_unlocked"
  | "book_unlocked"
  | "tradition_unlocked"
  | "profile_customization_unlocked"
  | "avatar_frame_unlocked"
  | "banner_unlocked"
  | "crest_unlocked"
  // Social (stubs)
  | "friend_finished_book"
  | "weekly_recap"
  // Legacy
  | "book_recommendation"

export type NotificationCategory =
  | "achievements"
  | "reading"
  | "streaks"
  | "unlocks"
  | "virgil"
  | "social"

export type NotificationPriority = "low" | "normal" | "high" | "celebration"

export interface TomeNotification {
  id: string
  type: NotificationType
  category: NotificationCategory
  priority: NotificationPriority
  title: string
  body?: string
  icon?: string          // lucide icon name
  imageUrl?: string      // painting thumbnail, seal image, etc.
  link?: string          // deep link
  metadata?: Record<string, unknown>
  read: boolean
  createdAt: string      // ISO timestamp
}

// ── Type → Category mapping ─────────────────────────────────────────────────

const TYPE_CATEGORY: Record<NotificationType, NotificationCategory> = {
  seal_earned: "achievements",
  seal_tier_up: "achievements",
  seal_rare_unlock: "achievements",
  chapter_completed: "reading",
  book_completed: "reading",
  part_completed: "reading",
  first_book_completed: "reading",
  tradition_completed: "reading",
  flame_milestone: "streaks",
  flame_recovered: "streaks",
  wisdom_milestone: "streaks",
  daily_goal_met: "streaks",
  virgil_annotation_ready: "virgil",
  virgil_insight: "virgil",
  painting_unlocked: "unlocks",
  book_unlocked: "unlocks",
  tradition_unlocked: "unlocks",
  profile_customization_unlocked: "unlocks",
  avatar_frame_unlocked: "unlocks",
  banner_unlocked: "unlocks",
  crest_unlocked: "unlocks",
  friend_finished_book: "social",
  weekly_recap: "social",
  book_recommendation: "social",
}

// High-priority types that also trigger a toast
const TOAST_TYPES: Set<NotificationType> = new Set([
  "book_completed",
  "first_book_completed",
  "seal_rare_unlock",
  "tradition_completed",
  "flame_milestone",
  "wisdom_milestone",
])

// ── localStorage Store ──────────────────────────────────────────────────────

const STORAGE_KEY = "tome:notifications"
const MAX_NOTIFICATIONS = 200

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function loadNotifications(): TomeNotification[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveNotifications(notifications: TomeNotification[]): void {
  if (typeof window === "undefined") return
  // Keep only the most recent MAX_NOTIFICATIONS
  const trimmed = notifications.slice(0, MAX_NOTIFICATIONS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

// ── Pub/Sub for reactive updates ────────────────────────────────────────────

type Listener = () => void
const listeners: Set<Listener> = new Set()

export function subscribeNotifications(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notifyListeners() {
  listeners.forEach((fn) => fn())
}

// ── CRUD Operations ─────────────────────────────────────────────────────────

export function getNotifications(): TomeNotification[] {
  return loadNotifications()
}

export function getUnreadCount(): number {
  return loadNotifications().filter((n) => !n.read).length
}

export function getNotificationsByCategory(category: NotificationCategory): TomeNotification[] {
  return loadNotifications().filter((n) => n.category === category)
}

export function markAsRead(id: string): void {
  const all = loadNotifications()
  const notif = all.find((n) => n.id === id)
  if (notif && !notif.read) {
    notif.read = true
    saveNotifications(all)
    notifyListeners()
  }
}

export function markAllAsRead(): void {
  const all = loadNotifications()
  let changed = false
  for (const n of all) {
    if (!n.read) {
      n.read = true
      changed = true
    }
  }
  if (changed) {
    saveNotifications(all)
    notifyListeners()
  }
}

export function clearNotifications(): void {
  saveNotifications([])
  notifyListeners()
}

// ── Core Creation Function ──────────────────────────────────────────────────

export interface CreateNotificationParams {
  type: NotificationType
  title: string
  body?: string
  icon?: string
  imageUrl?: string
  link?: string
  metadata?: Record<string, unknown>
  priority?: NotificationPriority
}

/** Returns the notification ID and whether it should trigger a toast */
export function createNotification(params: CreateNotificationParams): {
  id: string
  shouldToast: boolean
} {
  const id = generateId()
  const category = TYPE_CATEGORY[params.type] ?? "reading"
  const priority = params.priority ?? (TOAST_TYPES.has(params.type) ? "high" : "normal")

  const notification: TomeNotification = {
    id,
    type: params.type,
    category,
    priority,
    title: params.title,
    body: params.body,
    icon: params.icon,
    imageUrl: params.imageUrl,
    link: params.link,
    metadata: params.metadata,
    read: false,
    createdAt: new Date().toISOString(),
  }

  const all = loadNotifications()
  all.unshift(notification) // newest first
  saveNotifications(all)
  notifyListeners()

  return {
    id,
    shouldToast: TOAST_TYPES.has(params.type),
  }
}

// ── Typed Convenience Wrappers ──────────────────────────────────────────────

export function notifyChapterCompleted(bookTitle: string, chapterTitle: string, bookId: string, nextChapterIndex?: number, unitLabel = "Chapter") {
  return createNotification({
    type: "chapter_completed",
    title: `${unitLabel} complete`,
    body: `${bookTitle} — ${chapterTitle}`,
    icon: "BookCheck",
    link: nextChapterIndex != null ? `/read/${bookId}` : `/book/${bookId}`,
    metadata: { bookId, chapterTitle },
  })
}

export function notifyBookCompleted(bookTitle: string, bookId: string, wisdomEarned: number) {
  return createNotification({
    type: "book_completed",
    title: `You finished ${bookTitle}!`,
    body: `${wisdomEarned} Wisdom earned. A remarkable achievement.`,
    icon: "Trophy",
    link: `/book/${bookId}/complete`,
    priority: "celebration",
    metadata: { bookId, wisdomEarned, confetti: true },
  })
}

export function notifyFirstBookCompleted(bookTitle: string, bookId: string) {
  return createNotification({
    type: "first_book_completed",
    title: "Your first book complete!",
    body: `You finished ${bookTitle}. The journey of a thousand pages begins with one.`,
    icon: "Sparkles",
    link: `/book/${bookId}/complete`,
    priority: "celebration",
    metadata: { bookId, confetti: true },
  })
}

export function notifyPartCompleted(bookTitle: string, partTitle: string, bookId: string) {
  return createNotification({
    type: "part_completed",
    title: `${partTitle} complete`,
    body: `You finished ${partTitle} of ${bookTitle}.`,
    icon: "BookOpen",
    link: `/read/${bookId}`,
    metadata: { bookId, partTitle },
  })
}

export function notifyTraditionCompleted(traditionName: string) {
  return createNotification({
    type: "tradition_completed",
    title: `${traditionName} tradition complete!`,
    body: `You've read every book in the ${traditionName} collection. A true scholar.`,
    icon: "Landmark",
    link: `/library?tradition=${encodeURIComponent(traditionName)}`,
    priority: "celebration",
    metadata: { traditionName, confetti: true },
  })
}

export function notifySealEarned(sealName: string, sealId: string, isRare = false) {
  return createNotification({
    type: isRare ? "seal_rare_unlock" : "seal_earned",
    title: isRare ? "Rare Seal earned!" : "New Seal earned",
    body: sealName,
    icon: "Shield",
    link: "/profile",
    priority: isRare ? "celebration" : "high",
    metadata: { sealId, sealName, isRare },
  })
}

export function notifyFlameMilestone(days: number) {
  const milestoneNames: Record<number, string> = {
    3: "Three-day flame!",
    7: "One week of reading!",
    14: "Two-week streak!",
    30: "A month of dedication!",
    60: "Two months unstoppable!",
    100: "Century streak!",
    365: "A full year of reading!",
  }
  const title = milestoneNames[days] ?? `${days}-day streak!`
  return createNotification({
    type: "flame_milestone",
    title,
    body: `You've read for ${days} days in a row. Odysseus would be proud.`,
    icon: "Flame",
    priority: days >= 30 ? "celebration" : "high",
    metadata: { days },
  })
}

export function notifyWisdomMilestone(total: number) {
  const formatted = total >= 1000 ? `${Math.round(total / 1000)}k` : String(total)
  return createNotification({
    type: "wisdom_milestone",
    title: `${formatted} Wisdom reached!`,
    body: "Your knowledge grows. Keep reading.",
    icon: "Sparkles",
    priority: total >= 10000 ? "celebration" : "high",
    metadata: { total },
  })
}

export function notifyDailyGoalMet(minutes: number) {
  return createNotification({
    type: "daily_goal_met",
    title: "Daily goal met",
    body: `${minutes} minutes of reading today.`,
    icon: "Target",
    priority: "low",
  })
}

export function notifyPaintingUnlocked(paintingTitle: string, artist: string, paintingId: string, imageUrl?: string) {
  return createNotification({
    type: "painting_unlocked",
    title: "New painting in your Stoa",
    body: `${paintingTitle} — ${artist}`,
    icon: "Palette",
    imageUrl,
    link: "/dashboard",
    metadata: { paintingId },
  })
}

export function notifyVirgilInsight(message: string, bookId?: string) {
  return createNotification({
    type: "virgil_insight",
    title: "Virgil has a thought",
    body: message,
    icon: "MessageSquare",
    link: bookId ? `/book/${bookId}` : undefined,
    priority: "low",
    metadata: { bookId },
  })
}

// ── Time formatting helper ──────────────────────────────────────────────────

export function formatNotificationTime(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ── Seed notifications for new users ────────────────────────────────────────

export function seedNotificationsIfEmpty(): void {
  const existing = loadNotifications()
  if (existing.length > 0) return

  const now = Date.now()
  const hour = 3600000

  const seeds: CreateNotificationParams[] = [
    {
      type: "seal_earned",
      title: "New Seal earned",
      body: "First Page — Opened your first book",
      icon: "Shield",
      link: "/profile",
    },
    {
      type: "flame_milestone",
      title: "Three-day flame!",
      body: "You've read for 3 days in a row. Odysseus would be proud.",
      icon: "Flame",
    },
    {
      type: "chapter_completed",
      title: "Chapter complete",
      body: "The Odyssey — Preface",
      icon: "BookCheck",
      link: "/read/the-odyssey",
    },
    {
      type: "painting_unlocked",
      title: "New painting in your Stoa",
      body: "Ulysses and the Sirens — John William Waterhouse",
      icon: "Palette",
      link: "/dashboard",
    },
    {
      type: "virgil_insight",
      title: "Virgil has a thought",
      body: "You've been reading Greek epics. Have you considered The Aeneid? Virgil wrote it as a response to Homer.",
      icon: "MessageSquare",
      link: "/book/the-aeneid",
    },
    {
      type: "wisdom_milestone",
      title: "1k Wisdom reached!",
      body: "Your knowledge grows. Keep reading.",
      icon: "Sparkles",
    },
    {
      type: "daily_goal_met",
      title: "Daily goal met",
      body: "20 minutes of reading today.",
      icon: "Target",
      priority: "low",
    },
    {
      type: "seal_earned",
      title: "New Seal earned",
      body: "On Fire — 7-day reading streak",
      icon: "Shield",
      link: "/profile",
    },
  ]

  // Create seeds with staggered timestamps
  for (let i = 0; i < seeds.length; i++) {
    const id = generateId()
    const category = TYPE_CATEGORY[seeds[i].type] ?? "reading"
    const priority = seeds[i].priority as NotificationPriority ?? (TOAST_TYPES.has(seeds[i].type) ? "high" : "normal")

    const notification: TomeNotification = {
      id,
      type: seeds[i].type,
      category,
      priority,
      title: seeds[i].title,
      body: seeds[i].body,
      icon: seeds[i].icon,
      imageUrl: seeds[i].imageUrl,
      link: seeds[i].link,
      metadata: seeds[i].metadata,
      read: i >= 3, // First 3 are unread
      createdAt: new Date(now - i * hour * 4).toISOString(),
    }
    existing.push(notification)
  }

  saveNotifications(existing)
}

export function groupNotificationsByDay(notifications: TomeNotification[]): {
  label: string
  notifications: TomeNotification[]
}[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  const thisWeek = new Date(today.getTime() - 7 * 86400000)

  const groups: Map<string, TomeNotification[]> = new Map()

  for (const n of notifications) {
    const date = new Date(n.createdAt)
    let label: string
    if (date >= today) label = "Today"
    else if (date >= yesterday) label = "Yesterday"
    else if (date >= thisWeek) label = "This week"
    else label = "Earlier"

    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(n)
  }

  const order = ["Today", "Yesterday", "This week", "Earlier"]
  return order
    .filter((label) => groups.has(label))
    .map((label) => ({ label, notifications: groups.get(label)! }))
}
