"use client"

/**
 * Reader dashboard — a reading-first home for the signed-in student.
 *
 * Progress here comes ONLY from the two real learning signals: reading position
 * (`reading_progress`, via the `listReadingProgress` helper) and quiz/grade
 * results (`quiz_results` + graded `assignment_submissions`). There is NO
 * gamification — no streak, Wisdom, coins, Seals, daily/weekly challenge — and
 * no social. A fresh account resolves to a welcoming empty state; a populated
 * dashboard reflects genuine reading + practice history.
 *
 * Teachers are routed to the classroom-first <TeacherDashboard/>.
 */

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  ChevronRight,
  Brain,
  Bookmark as BookmarkIcon,
  Highlighter,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { listReadingProgress } from "@/lib/reading/positions"
import { loadPracticeData, type QuizAttempt } from "@/lib/quizzes/practice"
import { getBook } from "@/lib/content"
import type { TomeBook } from "@/data/books"
import { BookCoverThumb } from "@/components/tome/book-cover-thumb"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { TeacherDashboard } from "@/components/classroom/teacher-dashboard"
import { UpcomingAssignments } from "@/components/classroom/upcoming-assignments"
import { RecentlyGraded } from "@/components/classroom/recently-graded"
import { CheckoutResultToast } from "@/components/pricing/CheckoutResultToast"

// RUBRIC flat accents (iridescence stays Virgil-only).
const LAPIS = "#2A4B8D"
const VERDIGRIS = "#2E7D6F"

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function DashboardPage() {
  const { role } = useAuth()
  return (
    <>
      <CheckoutResultToast />
      {role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
    </>
  )
}

// ─────────────────────────────────────────────
// Student (reader) dashboard
// ─────────────────────────────────────────────

interface ContinueItem {
  book: TomeBook
  chapterIndex: number
  pct: number
  updatedAt: string
}

interface BookmarkRow {
  id: string
  book_id: string
  chapter_index: number
  kind: "bookmark" | "highlight"
  selected_text: string | null
  label: string | null
  color: string
  created_at: string
}

function StudentDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [continueReading, setContinueReading] = useState<ContinueItem[]>([])
  const [completedCount, setCompletedCount] = useState(0)
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([])
  const [quizCount, setQuizCount] = useState(0)
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([])

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setContinueReading([])
      setCompletedCount(0)
      setQuizHistory([])
      setQuizCount(0)
      setBookmarks([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    ;(async () => {
      const supabase = createClient()
      const [positions, practice, bookmarkRes] = await Promise.all([
        listReadingProgress(),
        loadPracticeData(),
        supabase
          .from("highlights")
          .select("id, book_id, chapter_index, kind, selected_text, label, color, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ])
      if (cancelled) return

      const resolved = positions
        .map((p) => {
          const book = getBook(p.bookId)
          if (!book) return null
          const pct =
            p.percent != null
              ? Math.min(100, Math.max(0, Math.round(p.percent)))
              : Math.min(100, Math.round(((p.chapterIndex + 1) / Math.max(book.chapters, 1)) * 100))
          const done = p.chapterIndex + 1 >= book.chapters
          return { book, chapterIndex: p.chapterIndex, pct, updatedAt: p.updatedAt, done }
        })
        .filter(Boolean) as (ContinueItem & { done: boolean })[]

      setContinueReading(resolved.filter((r) => !r.done).slice(0, 3))
      setCompletedCount(resolved.filter((r) => r.done).length)
      setQuizHistory(practice.history.slice(0, 5))
      setQuizCount(practice.history.length)
      setBookmarks((bookmarkRes.data as BookmarkRow[] | null) ?? [])
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  const busy = loading || authLoading
  const inProgressCount = continueReading.length
  const isFresh =
    !busy && inProgressCount === 0 && completedCount === 0 && quizCount === 0 && bookmarks.length === 0

  const titleFor = (bookId: string) => getBook(bookId)?.title ?? bookId

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {mounted ? `${greeting()}, Reader` : "Welcome back, Reader"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mounted
              ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
              : "Your reading journey continues"}
          </p>
        </div>

        {/* Classroom widgets — self-hiding when the reader is in no class */}
        <UpcomingAssignments />
        <RecentlyGraded />

        {busy ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : isFresh ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-xl border border-dashed border-border text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <BookOpen className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold">Your reading journey starts here</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Open your first book and your progress, quiz results, and bookmarks will fill this page.
              </p>
            </div>
            <Link
              href="/library/browse"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
            >
              Browse the library <ChevronRight className="size-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Reading stats strip */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={BookOpen} color={LAPIS} value={inProgressCount} label="In progress" />
              <StatCard icon={CheckCircle2} color={VERDIGRIS} value={completedCount} label="Completed" />
              <StatCard icon={Brain} color="#6B2D5C" value={quizCount} label="Quizzes taken" />
            </div>

            {/* Continue reading */}
            <section>
              <SectionHeading title="Continue reading" actionHref="/reading" action="All reading" />
              {continueReading.length === 0 ? (
                <Link
                  href="/library/browse"
                  className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Start a new book <ChevronRight className="size-4" />
                </Link>
              ) : (
                <div className="space-y-2">
                  {continueReading.map((item) => (
                    <div key={item.book.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                      <BookCoverThumb book={item.book} className="w-12" />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/book/${item.book.id}`}
                          className="text-sm font-semibold text-foreground line-clamp-1 hover:opacity-80 transition-opacity"
                        >
                          {item.book.title}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">{item.book.author}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                            <span>Chapter {item.chapterIndex + 1}/{item.book.chapters}</span>
                            <span className="tabular-nums">{item.pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden bg-muted">
                            <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: LAPIS }} />
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/read/${item.book.id}`}
                        className="self-center shrink-0 inline-flex items-center gap-1 rounded-lg bg-foreground px-3.5 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
                      >
                        Continue <ChevronRight className="size-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recent quiz results */}
            {quizHistory.length > 0 && (
              <section>
                <SectionHeading title="Recent quiz results" actionHref="/quizzes" action="Practice" />
                <ul className="rounded-xl border border-border bg-card divide-y divide-border">
                  {quizHistory.map((a, i) => (
                    <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <span className="flex-1 min-w-0 truncate">
                        <span className="font-medium text-foreground">{titleFor(a.bookId)}</span>
                        <span className="text-muted-foreground"> · Ch. {a.chapterIndex + 1}</span>
                        {a.tier && <span className="text-muted-foreground"> · {a.tier}</span>}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 tabular-nums font-semibold",
                          a.percent >= 80 ? "text-[#2E7D6F]" : a.percent >= 50 ? "text-[var(--amber-default)]" : "text-muted-foreground",
                        )}
                      >
                        {a.percent}%
                      </span>
                      <span className="shrink-0 w-16 text-right text-[11px] text-muted-foreground">
                        {relativeTime(a.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Recent bookmarks */}
            {bookmarks.length > 0 && (
              <section>
                <SectionHeading title="Recent bookmarks" actionHref="/bookmarks" action="All marks" />
                <div className="space-y-2">
                  {bookmarks.map((m) => (
                    <Link
                      key={m.id}
                      href={`/read/${m.book_id}?ch=${m.chapter_index}`}
                      className="flex gap-3 rounded-xl border border-border bg-card p-3 hover:bg-accent/20 transition-colors"
                      style={{ borderLeft: `3px solid ${m.color}` }}
                    >
                      <span className="shrink-0 mt-0.5 text-muted-foreground">
                        {m.kind === "bookmark" ? <BookmarkIcon className="size-3.5" /> : <Highlighter className="size-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="truncate">{titleFor(m.book_id)}</span>
                          <span>·</span>
                          <span className="shrink-0">Ch. {m.chapter_index + 1}</span>
                        </span>
                        {m.label && <span className="block text-xs font-medium text-foreground truncate mt-0.5">{m.label}</span>}
                        {m.selected_text && (
                          <span className="block text-xs italic text-foreground/80 line-clamp-2 mt-0.5">
                            &ldquo;{m.selected_text}&rdquo;
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="size-3" /> {relativeTime(m.created_at)}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: typeof BookOpen
  color: string
  value: number
  label: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-1">
      <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon className="size-4" style={{ color }} />
      </div>
      <span className="text-xl font-bold tabular-nums leading-none mt-0.5">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}

function SectionHeading({
  title,
  action,
  actionHref,
}: {
  title: string
  action?: string
  actionHref?: string
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-bold tracking-tight">{title}</h2>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {action} <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  )
}
