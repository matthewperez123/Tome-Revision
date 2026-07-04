"use client"

import { use, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  BookOpen,
  PenLine,
  HelpCircle,
  Radio,
  Clock,
  Moon,
  X,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { getBook, getChapters } from "@/lib/content"
import { RUBRIC } from "@/lib/semester-plan/rubric"

// ── Data shapes ──────────────────────────────────────────────────────────────

// Roster comes from the teacher-gated classroom_reading_board RPC (also our
// scope guard — a non-staff caller gets an error and is denied).
interface RosterRow {
  student_id: string
  student_name: string | null
  student_username: string | null
  avatar_url: string | null
}

interface ActivityRow {
  user_id: string
  surface: string
  book_id: string | null
  chapter_index: number | null
  assignment_id: string | null
  detail: string | null
  last_seen_at: string
}

type Presence = "active" | "idle" | "away"

interface Tile {
  studentId: string
  name: string
  username: string | null
  avatarUrl: string | null
  activity: ActivityRow | null
  presence: Presence
}

// ── Presence thresholds (derived board-side from last_seen_at) ────────────────

const ACTIVE_MS = 2 * 60_000 // < 2 min → at the lectern right now
const IDLE_MS = 10 * 60_000 // 2–10 min → paused

function presenceFor(lastSeen: string | null): Presence {
  if (!lastSeen) return "away"
  const delta = Date.now() - new Date(lastSeen).getTime()
  if (delta < ACTIVE_MS) return "active"
  if (delta < IDLE_MS) return "idle"
  return "away"
}

const PRESENCE_COLOR: Record<Presence, string> = {
  active: RUBRIC.verdigris,
  idle: RUBRIC.goldLeaf,
  away: "#9CA3AF",
}

const PRESENCE_LABEL: Record<Presence, string> = {
  active: "Active now",
  idle: "Paused",
  away: "Away",
}

function relativeSeen(iso: string | null): string {
  if (!iso) return "Not here today"
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function surfaceIcon(surface: string) {
  if (surface === "essay") return PenLine
  if (surface === "quiz") return HelpCircle
  return BookOpen
}

// Human sentence for what a student is doing, grounded in the activity row.
function activityLabel(a: ActivityRow | null): string {
  if (!a) return "Not in a live session"
  if (a.surface === "essay") return a.detail ? `Writing · ${a.detail}` : "Writing an essay"
  if (a.surface === "quiz") return a.detail ? `Trial · ${a.detail}` : "Taking a Trial"
  // reading
  const title = a.book_id ? getBook(a.book_id)?.title ?? a.book_id : null
  const chapters = a.book_id ? getChapters(a.book_id) : []
  const chLabel =
    a.chapter_index != null && chapters[a.chapter_index]
      ? chapters[a.chapter_index].title
      : a.chapter_index != null
        ? `Ch. ${a.chapter_index}`
        : null
  if (title && chLabel) return `Reading ${title} · ${chLabel}`
  if (title) return `Reading ${title}`
  return "Reading"
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LecternPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, isDemoMode } = useAuth()
  const [name, setName] = useState<string | null>(null)
  const [roster, setRoster] = useState<RosterRow[]>([])
  const [activity, setActivity] = useState<Record<string, ActivityRow>>({})
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  // A tick to re-derive presence as wall-clock time passes (no data change).
  const [, setTick] = useState(0)

  const fetchAll = useCallback(async () => {
    if (!user || isDemoMode) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    const [{ data: cls }, { data: board, error }, { data: acts }] = await Promise.all([
      supabase.from("classrooms").select("name").eq("id", id).maybeSingle<{ name: string }>(),
      supabase.rpc("classroom_reading_board", { p_classroom: id }),
      supabase
        .from("student_activity")
        .select("user_id, surface, book_id, chapter_index, assignment_id, detail, last_seen_at")
        .eq("classroom_id", id),
    ])
    if (error) {
      // NOT_CLASSROOM_STAFF / NOT_AUTHENTICATED raised by the definer RPC.
      setDenied(true)
      setLoading(false)
      return
    }
    if (cls) setName(cls.name)
    setRoster((board as RosterRow[] | null) ?? [])
    const map: Record<string, ActivityRow> = {}
    for (const a of (acts as ActivityRow[] | null) ?? []) map[a.user_id] = a
    setActivity(map)
    setLoading(false)
  }, [user, isDemoMode, id])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  // Live: any student_activity change in this classroom refreshes the board. The
  // teacher RLS policy already scopes delivery to classrooms they staff.
  useEffect(() => {
    if (!user || isDemoMode) return
    const supabase = createClient()
    const channel = supabase
      .channel(`lectern:${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_activity", filter: `classroom_id=eq.${id}` },
        (payload) => {
          const row = payload.new as ActivityRow | null
          if (row && row.user_id) {
            setActivity((prev) => ({ ...prev, [row.user_id]: row }))
          } else {
            void fetchAll()
          }
        },
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [user, isDemoMode, id, fetchAll])

  // Re-derive presence every 20s so a student silently sliding from active →
  // idle → away updates without waiting on a data event.
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 20_000)
    return () => clearInterval(t)
  }, [])

  const tiles = useMemo<Tile[]>(() => {
    const order: Record<Presence, number> = { active: 0, idle: 1, away: 2 }
    return roster
      .map((r) => {
        const a = activity[r.student_id] ?? null
        return {
          studentId: r.student_id,
          name: r.student_name ?? "Reader",
          username: r.student_username,
          avatarUrl: r.avatar_url,
          activity: a,
          presence: presenceFor(a?.last_seen_at ?? null),
        }
      })
      .sort((x, y) => {
        if (order[x.presence] !== order[y.presence]) return order[x.presence] - order[y.presence]
        return x.name.localeCompare(y.name)
      })
  }, [roster, activity])

  const pulse = useMemo(() => {
    let active = 0,
      idle = 0,
      away = 0
    for (const t of tiles) {
      if (t.presence === "active") active++
      else if (t.presence === "idle") idle++
      else away++
    }
    return { active, idle, away }
  }, [tiles])

  // Needs-attention: someone paused mid-work while the class is otherwise active.
  const attention = useMemo(
    () => tiles.filter((t) => t.presence === "idle" && t.activity),
    [tiles],
  )

  // Reading heatmap: active/idle readers grouped by book → chapter tallies.
  const heatmap = useMemo(() => {
    const byBook = new Map<string, Map<number, number>>()
    for (const t of tiles) {
      const a = t.activity
      if (!a || a.surface !== "reading" || !a.book_id || t.presence === "away") continue
      const ch = a.chapter_index ?? 0
      if (!byBook.has(a.book_id)) byBook.set(a.book_id, new Map())
      const chMap = byBook.get(a.book_id)!
      chMap.set(ch, (chMap.get(ch) ?? 0) + 1)
    }
    return [...byBook.entries()].map(([bookId, chMap]) => ({
      bookId,
      title: getBook(bookId)?.title ?? bookId,
      chapters: [...chMap.entries()].sort((a, b) => a[0] - b[0]),
      total: [...chMap.values()].reduce((s, n) => s + n, 0),
    }))
  }, [tiles])

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
        <p className="text-muted-foreground">Sign in to open the Lectern.</p>
        <Link href="/classroom" className="mt-2 text-sm hover:underline" style={{ color: RUBRIC.goldLeaf }}>
          Back to classes
        </Link>
      </div>
    )
  }

  if (denied) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">Only this class&apos;s teachers can open the Lectern.</p>
        <Link href="/classroom" className="mt-2 text-sm hover:underline" style={{ color: RUBRIC.goldLeaf }}>
          Back to classes
        </Link>
      </div>
    )
  }

  const selectedTile = selected ? tiles.find((t) => t.studentId === selected) ?? null : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href={`/classroom/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to class
      </Link>

      {/* Class pulse header */}
      <div
        className="mt-4 rounded-2xl border p-5"
        style={{ borderColor: "rgba(44,74,126,0.25)", background: "rgba(44,74,126,0.05)" }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Radio className="size-5" style={{ color: RUBRIC.verdigris }} />
          <h1 className="font-serif text-2xl font-bold">The Lectern</h1>
          {name && <span className="text-sm text-muted-foreground">· {name}</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <PulseStat color={PRESENCE_COLOR.active} icon={Radio} value={pulse.active} label="Active now" />
          <PulseStat color={PRESENCE_COLOR.idle} icon={Clock} value={pulse.idle} label="Paused" />
          <PulseStat color={PRESENCE_COLOR.away} icon={Moon} value={pulse.away} label="Away" />
        </div>
      </div>

      {roster.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No students have joined this class yet.
        </p>
      ) : (
        <>
          {/* Needs-attention rail */}
          {attention.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Paused mid-work
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {attention.map((t) => (
                  <button
                    key={t.studentId}
                    onClick={() => setSelected(t.studentId)}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors hover:bg-muted/50"
                    style={{ borderColor: "rgba(200,151,47,0.4)" }}
                  >
                    <span className="size-2 rounded-full" style={{ background: PRESENCE_COLOR.idle }} />
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted-foreground">· {relativeSeen(t.activity?.last_seen_at ?? null)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Student tile grid */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((t) => {
              const Icon = surfaceIcon(t.activity?.surface ?? "reading")
              return (
                <button
                  key={t.studentId}
                  onClick={() => setSelected(t.studentId)}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="relative">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {t.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.avatarUrl} alt="" className="size-10 rounded-full object-cover" />
                      ) : (
                        t.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card"
                      style={{ background: PRESENCE_COLOR[t.presence] }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {t.activity ? <Icon className="size-3.5 shrink-0" /> : null}
                      <span className="truncate">{activityLabel(t.activity)}</span>
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: PRESENCE_COLOR[t.presence] }}>
                      {PRESENCE_LABEL[t.presence]} · {relativeSeen(t.activity?.last_seen_at ?? null)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Reading heatmap */}
          {heatmap.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Where the class is reading
              </h2>
              <div className="mt-3 space-y-3">
                {heatmap.map((b) => {
                  const chapters = getChapters(b.bookId)
                  return (
                    <div key={b.bookId} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{b.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {b.total} reader{b.total === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {b.chapters.map(([ch, count]) => (
                          <span
                            key={ch}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
                            style={{ background: "rgba(44,74,126,0.10)", color: RUBRIC.lapis }}
                            title={chapters[ch]?.title ?? `Chapter ${ch}`}
                          >
                            {chapters[ch]?.title ?? `Ch. ${ch}`}
                            <span className="font-semibold">×{count}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Drill-down slide-over */}
      {selectedTile && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative h-full w-full max-w-sm overflow-y-auto border-l border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                  {selectedTile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedTile.avatarUrl} alt="" className="size-12 rounded-full object-cover" />
                  ) : (
                    selectedTile.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-card"
                  style={{ background: PRESENCE_COLOR[selectedTile.presence] }}
                />
              </div>
              <div>
                <p className="font-semibold">{selectedTile.name}</p>
                {selectedTile.username && (
                  <p className="text-xs text-muted-foreground">@{selectedTile.username}</p>
                )}
              </div>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
                <dd className="mt-0.5" style={{ color: PRESENCE_COLOR[selectedTile.presence] }}>
                  {PRESENCE_LABEL[selectedTile.presence]} · last seen{" "}
                  {relativeSeen(selectedTile.activity?.last_seen_at ?? null)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Doing</dt>
                <dd className="mt-0.5">{activityLabel(selectedTile.activity)}</dd>
              </div>
              {selectedTile.activity?.book_id && (
                <Link
                  href={`/book/${selectedTile.activity.book_id}`}
                  className="inline-flex items-center gap-1.5 text-sm hover:underline"
                  style={{ color: RUBRIC.lapis }}
                >
                  <BookOpen className="size-4" /> Open the book
                </Link>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}

function PulseStat({
  color,
  icon: Icon,
  value,
  label,
}: {
  color: string
  icon: typeof Radio
  value: number
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4" style={{ color }} />
      <span className="text-lg font-bold tabular-nums">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}
