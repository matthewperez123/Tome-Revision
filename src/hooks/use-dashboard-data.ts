"use client"

/**
 * Dashboard data — account-scoped and DB-backed.
 *
 * The reader dashboard used to read browser-local storage (`tome-user-stats`
 * via the economy provider + `tome-book-progress-*`). That data is per-browser,
 * not per-account, and the two stores drift apart — producing the "fabricated"
 * dashboard (real-looking Continue Reading next to 0 Wisdom) that is unsafe to
 * show an investor or school.
 *
 * This hook reads the per-account source-of-truth tables for the *authenticated*
 * user:
 *   - `user_stats`        → streak / daily goal
 *   - `reading_progress`  → Continue Reading (joined to the static book catalog)
 *   - `activities`        → Recent Activity + this week's reading
 *
 * For a brand-new account (no rows) it returns zeroed stats and empty lists, so
 * the dashboard renders a welcoming first-run state — never fake progress.
 *
 * Demo mode (localStorage onboarding, no real session) and signed-out both
 * resolve to the same empty state: we deliberately do NOT surface localStorage
 * progress here. A populated dashboard comes only from a real, seeded account
 * (see scripts/seed-demo-account.ts).
 */

import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  Star,
  Trophy,
  Sparkles,
  Users,
  GraduationCap,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { getBook } from "@/lib/content"
import type { TomeBook } from "@/data/books"
import {
  createDefaultStats,
  isDailyGoalMet,
  type UserStats,
} from "@/lib/economy"

const supabase = createClient()

export interface ContinueReadingItem {
  book: TomeBook
  chapterIndex: number
  /** Completion percentage, 0–100. */
  pct: number
  lastReadAt: number
}

export interface DashboardActivity {
  id: string
  icon: typeof BookOpen
  color: string
  text: string
  at: number
}

export interface DashboardData {
  /** "real" once an authenticated account's rows have loaded; "empty" for demo/signed-out. */
  mode: "real" | "empty"
  loading: boolean
  stats: UserStats
  dailyGoalMet: boolean
  continueReading: ContinueReadingItem[]
  inProgressCount: number
  completedCount: number
  recentActivity: DashboardActivity[]
  /** This week's reading, Monday=0 … Sunday=6. */
  weeklyReadDays: number[]
  weeklyBooksRead: number
  reflection: { booksRead: string[]; chaptersCompleted: number; streakDays: number }
}

interface ReadingRow {
  book_id: string
  chapter_index: number | null
  updated_at: string
}

interface ActivityRow {
  id: string
  type: string
  entity_type: string | null
  entity_id: string | null
  created_at: string
}

const EMPTY_USER_ID = "00000000-0000-0000-0000-000000000000"

/** Weekday index with Monday as 0 (JS getDay has Sunday as 0). */
function mondayIndex(d: Date): number {
  const g = d.getDay()
  return g === 0 ? 6 : g - 1
}

function weekStart(now: Date): Date {
  const s = new Date(now)
  s.setHours(0, 0, 0, 0)
  s.setDate(s.getDate() - mondayIndex(s))
  return s
}

/** Resolve the catalog book referenced by an activity row. */
function bookIdForActivity(row: ActivityRow): string | null {
  if (!row.entity_id) return null
  if (row.entity_type === "book") return row.entity_id
  if (row.entity_type === "trial") return row.entity_id.split(":")[0]
  return null
}

function activityChapter(row: ActivityRow): number | null {
  if (row.entity_type === "trial" && row.entity_id) {
    const part = row.entity_id.split(":")[1]
    const n = Number(part)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function describeActivity(row: ActivityRow): DashboardActivity | null {
  const bookId = bookIdForActivity(row)
  const title = bookId ? getBook(bookId)?.title ?? bookId : null
  const at = new Date(row.created_at).getTime()
  if (!Number.isFinite(at)) return null

  switch (row.type) {
    case "book_started":
      return title
        ? { id: row.id, icon: BookOpen, color: "#0EA5E9", text: `Started ${title}`, at }
        : null
    case "book_completed":
      return title
        ? { id: row.id, icon: Star, color: "#A78BFA", text: `Finished ${title}`, at }
        : null
    case "trial_passed": {
      const ch = activityChapter(row)
      const where = title ? ` in ${title}` : ""
      const chapter = ch != null ? ` — Chapter ${ch + 1}` : ""
      return { id: row.id, icon: Trophy, color: "#F59E0B", text: `Passed a Trial${where}${chapter}`, at }
    }
    case "seal_earned":
      return { id: row.id, icon: Sparkles, color: "#C8A24B", text: "Earned a Wisdom Seal", at }
    case "club_joined":
      return { id: row.id, icon: Users, color: "#2E7D6F", text: "Joined a book club", at }
    case "session_completed":
      return { id: row.id, icon: GraduationCap, color: "#2A4B8D", text: "Completed a guided session", at }
    default:
      return null
  }
}

export function useDashboardData(): DashboardData {
  const { user, isLoading: authLoading } = useAuth()
  const userId = user?.id ?? null

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UserStats>(() => createDefaultStats(EMPTY_USER_ID))
  const [reading, setReading] = useState<ReadingRow[]>([])
  const [activities, setActivities] = useState<ActivityRow[]>([])

  useEffect(() => {
    // Wait for auth to settle. Demo/signed-out → empty state, no DB read.
    if (authLoading) return

    if (!userId) {
      setStats(createDefaultStats(EMPTY_USER_ID))
      setReading([])
      setActivities([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    ;(async () => {
      const [statsRes, readingRes, activityRes] = await Promise.all([
        supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle(),
        supabase
          .from("reading_progress")
          .select("book_id, chapter_index, updated_at")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false }),
        supabase
          .from("activities")
          .select("id, type, entity_type, entity_id, created_at")
          .eq("actor_id", userId)
          .order("created_at", { ascending: false })
          .limit(8),
      ])
      if (cancelled) return

      const row = statsRes.data as Partial<UserStats> | null
      setStats(
        row
          ? { ...createDefaultStats(userId), ...row, user_id: userId }
          : createDefaultStats(userId)
      )
      setReading((readingRes.data as ReadingRow[] | null) ?? [])
      setActivities((activityRes.data as ActivityRow[] | null) ?? [])
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [userId, authLoading])

  return useMemo<DashboardData>(() => {
    const dailyGoalMet = isDailyGoalMet(stats)

    // Continue Reading — join reading_progress to the static catalog.
    const resolved = reading
      .map((r) => {
        const book = getBook(r.book_id)
        if (!book) return null
        const chapterIndex = r.chapter_index ?? 0
        const pct = Math.min(100, Math.round(((chapterIndex + 1) / Math.max(book.chapters, 1)) * 100))
        return {
          book,
          chapterIndex,
          pct,
          lastReadAt: new Date(r.updated_at).getTime(),
          done: chapterIndex + 1 >= book.chapters,
        }
      })
      .filter(Boolean) as (ContinueReadingItem & { done: boolean })[]

    const continueReading = resolved.filter((r) => !r.done).slice(0, 3)
    const completedCount = resolved.filter((r) => r.done).length

    const recentActivity = activities
      .map(describeActivity)
      .filter(Boolean)
      .slice(0, 6) as DashboardActivity[]

    // This week's reading from activity timestamps.
    const now = new Date()
    const start = weekStart(now)
    const end = new Date(start)
    end.setDate(end.getDate() + 7)
    const days = new Set<number>()
    const weekBooks = new Set<string>()
    for (const a of activities) {
      const t = new Date(a.created_at)
      if (Number.isNaN(t.getTime()) || t < start || t >= end) continue
      days.add(mondayIndex(t))
      const bid = bookIdForActivity(a)
      if (bid) weekBooks.add(bid)
    }

    const reflection = {
      booksRead: resolved.map((r) => r.book.id),
      chaptersCompleted: resolved.reduce((sum, r) => sum + (r.chapterIndex + 1), 0),
      streakDays: stats.current_streak,
    }

    return {
      mode: userId ? "real" : "empty",
      loading: authLoading || loading,
      stats,
      dailyGoalMet,
      continueReading,
      inProgressCount: continueReading.length,
      completedCount,
      recentActivity,
      weeklyReadDays: [...days],
      weeklyBooksRead: weekBooks.size,
      reflection,
    }
  }, [userId, authLoading, loading, stats, reading, activities])
}
