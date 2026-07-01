"use client"

import { use, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Clock,
  Target,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { getBook } from "@/lib/content"
import { LiveReadingPanel } from "@/components/classroom/live-reading-panel"

// One row of the teacher-gated classroom_reading_board RPC — all real data.
interface BoardRow {
  student_id: string
  student_name: string | null
  student_username: string | null
  avatar_url: string | null
  last_active: string | null
  current_book_id: string | null
  current_chapter: number | null
  furthest_chapter: number | null
  books_started: number
  trials_attempted: number
  trials_passed: number
  avg_score_pct: number | null
  last_trial_at: string | null
}

const ACCENT = "#C8A24B"
const LAPIS = "#2A4B8D"
const VERMILION = "#C8553D"

// Thresholds for the "needs attention" computation — all derived from real rows.
const INACTIVE_DAYS = 7
const LOW_SCORE_PCT = 60

function daysSince(iso: string | null): number | null {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

function relativeTime(iso: string | null): string {
  if (!iso) return "Never"
  const d = daysSince(iso)
  if (d === null) return "Never"
  if (d === 0) return "Today"
  if (d === 1) return "Yesterday"
  if (d < 7) return `${d}d ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

function bookTitle(bookId: string | null): string | null {
  if (!bookId) return null
  return getBook(bookId)?.title ?? bookId
}

interface Attention {
  studentId: string
  studentName: string
  username: string | null
  reason: string
}

// Derive the "needs attention" list from the real board rows only. Each entry
// carries a concrete, data-grounded reason — never a fabricated flag.
function computeAttention(rows: BoardRow[]): Attention[] {
  const out: Attention[] = []
  for (const r of rows) {
    const name = r.student_name ?? "Reader"
    const reasons: string[] = []

    const inactiveDays = daysSince(r.last_active)
    if (r.last_active === null) {
      reasons.push("Hasn't started reading")
    } else if (inactiveDays !== null && inactiveDays >= INACTIVE_DAYS) {
      reasons.push(`No reading in ${inactiveDays} days`)
    }

    const failed = r.trials_attempted - r.trials_passed
    if (failed > 0) {
      reasons.push(`Failed ${failed} Trial${failed === 1 ? "" : "s"}`)
    } else if (
      r.avg_score_pct !== null &&
      r.trials_attempted > 0 &&
      r.avg_score_pct < LOW_SCORE_PCT
    ) {
      reasons.push(`Low Trial average (${r.avg_score_pct}%)`)
    }

    if (reasons.length > 0) {
      out.push({
        studentId: r.student_id,
        studentName: name,
        username: r.student_username,
        reason: reasons.join(" · "),
      })
    }
  }
  return out
}

export default function ClassroomProgressPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user, isDemoMode } = useAuth()
  const [name, setName] = useState<string | null>(null)
  const [rows, setRows] = useState<BoardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)

  const fetchBoard = useCallback(async () => {
    if (!user || isDemoMode) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    const [{ data: cls }, { data: board, error }] = await Promise.all([
      supabase.from("classrooms").select("name").eq("id", id).maybeSingle<{ name: string }>(),
      supabase.rpc("classroom_reading_board", { p_classroom: id }),
    ])
    if (error) {
      // NOT_CLASSROOM_STAFF / NOT_AUTHENTICATED raised by the definer RPC.
      setDenied(true)
      setLoading(false)
      return
    }
    if (cls) setName(cls.name)
    setRows((board as BoardRow[] | null) ?? [])
    setLoading(false)
  }, [user, isDemoMode, id])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  // Live: any reading_progress change this teacher is allowed to see (RLS
  // reading_progress_staff_select scopes delivery to their own students)
  // re-derives the board so the furthest chapter / last-active update live.
  useEffect(() => {
    if (!user || isDemoMode) return
    const supabase = createClient()
    const channel = supabase
      .channel(`progress-board:${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reading_progress" },
        () => void fetchBoard(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [user, isDemoMode, id, fetchBoard])

  const attention = useMemo(() => computeAttention(rows), [rows])

  const classAvg = useMemo(() => {
    const scored = rows.filter((r) => r.avg_score_pct !== null)
    if (scored.length === 0) return null
    return Math.round(
      scored.reduce((s, r) => s + (r.avg_score_pct ?? 0), 0) / scored.length,
    )
  }, [rows])

  const activeReaders = useMemo(
    () => rows.filter((r) => daysSince(r.last_active) !== null && daysSince(r.last_active)! < 7).length,
    [rows],
  )

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-muted/30" />
      </div>
    )
  }

  if (isDemoMode || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">Sign in to view your class progress board.</p>
        <Link href="/classroom" className="mt-2 text-sm hover:underline" style={{ color: ACCENT }}>
          Back to classrooms
        </Link>
      </div>
    )
  }

  if (denied) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">
          You don&apos;t have access to this classroom&apos;s progress.
        </p>
        <Link href="/classroom" className="mt-2 text-sm hover:underline" style={{ color: ACCENT }}>
          Back to classrooms
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href={`/classroom/${id}`}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> {name ?? "Classroom"}
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Live Progress Board</h1>
        <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
          <span className="size-1.5 animate-pulse rounded-full bg-green-500" /> Live
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Furthest chapter, last active, and Trial performance for every student — updates as they read.
      </p>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: BookOpen, label: "Students", value: rows.length, color: "text-[#2A4B8D]" },
          { icon: TrendingUp, label: "Active this week", value: activeReaders, color: "text-green-500" },
          { icon: Target, label: "Class Trial avg", value: classAvg !== null ? `${classAvg}%` : "—", color: "text-[#C8A24B]" },
          { icon: AlertTriangle, label: "Needs attention", value: attention.length, color: "text-[#C8553D]" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-muted/50 p-4">
            <s.icon className={`size-4 ${s.color}`} />
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Progress table */}
        <div>
          <h2 className="text-lg font-semibold">Students</h2>
          {rows.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No students have joined this class yet. Share your join code to get started.
              </p>
            </div>
          ) : (
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Student</th>
                    <th className="px-3 py-2 font-medium">Reading</th>
                    <th className="px-3 py-2 font-medium">Last active</th>
                    <th className="px-3 py-2 text-center font-medium">Trials</th>
                    <th className="px-3 py-2 text-center font-medium">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const title = bookTitle(r.current_book_id)
                    const inactive = (daysSince(r.last_active) ?? 999) >= INACTIVE_DAYS
                    return (
                      <tr key={r.student_id} className="border-b border-border last:border-0">
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/profile/${r.student_username ?? r.student_id}`}
                            className="font-medium hover:text-[var(--tome-accent)]"
                          >
                            {r.student_name ?? "Reader"}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5">
                          {title ? (
                            <div className="min-w-0">
                              <p className="truncate text-foreground/90">{title}</p>
                              <p className="text-xs text-muted-foreground">
                                Ch {(r.current_chapter ?? 0) + 1}
                                {r.books_started > 1 ? ` · ${r.books_started} books` : ""}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not started</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 text-xs ${
                              inactive ? "text-[#C8553D]" : "text-muted-foreground"
                            }`}
                          >
                            <Clock className="size-3" />
                            {relativeTime(r.last_active)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center text-xs tabular-nums">
                          {r.trials_attempted > 0 ? (
                            <span>
                              <span className="text-green-600 dark:text-green-400">{r.trials_passed}</span>
                              <span className="text-muted-foreground">/{r.trials_attempted}</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center text-xs tabular-nums">
                          {r.avg_score_pct !== null ? (
                            <span
                              className={
                                r.avg_score_pct < LOW_SCORE_PCT
                                  ? "text-[#C8553D]"
                                  : "text-foreground/90"
                              }
                            >
                              {r.avg_score_pct}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right rail: live reading + needs attention */}
        <div className="space-y-4">
          <LiveReadingPanel classroomId={id} />

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4" style={{ color: VERMILION }} />
              <h3 className="text-sm font-semibold">Needs attention</h3>
              {attention.length > 0 && (
                <span className="ml-auto text-xs font-medium" style={{ color: VERMILION }}>
                  {attention.length}
                </span>
              )}
            </div>
            {attention.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Everyone is on track — no reading gaps or failed Trials.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {attention.map((a) => (
                  <li key={a.studentId}>
                    <Link
                      href={`/profile/${a.username ?? a.studentId}`}
                      className="block rounded-lg border p-2.5 transition-colors hover:bg-muted/40"
                      style={{ borderColor: `${VERMILION}30` }}
                    >
                      <p className="text-sm font-medium">{a.studentName}</p>
                      <p className="text-xs" style={{ color: VERMILION }}>
                        {a.reason}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        <span style={{ color: LAPIS }}>●</span> All figures are read live from students&apos; real reading and Trial records.
      </p>
    </div>
  )
}
