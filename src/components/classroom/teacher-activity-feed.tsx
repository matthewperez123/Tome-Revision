"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, BookOpen, Brain, UserPlus, AlertTriangle, Flame, Inbox } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface ActivityItem {
  id: string
  type: string
  title: string
  body: string | null
  action_url: string | null
  created_at: string
}

const TYPE_ICONS: Record<string, typeof Trophy> = {
  quiz_completed: Brain,
  assignment_submitted: BookOpen,
  book_completed: Trophy,
  student_joined: UserPlus,
  student_at_risk: AlertTriangle,
  streak_milestone: Flame,
}

const TYPE_COLORS: Record<string, string> = {
  quiz_completed: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
  assignment_submitted: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  book_completed: "text-green-500 bg-green-50 dark:bg-green-950/30",
  student_joined: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
  student_at_risk: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  streak_milestone: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function TeacherActivityFeed({ classroomId }: { classroomId?: string }) {
  const { user, isDemoMode, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    // Wait for auth to settle before treating a null user as signed-out.
    if (authLoading) return
    if (isDemoMode || !user) {
      setItems([])
      setError(false)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)
    async function fetchActivity() {
      const supabase = createClient()

      const { data, error: loadErr } = await supabase
        .from("notifications")
        .select("id, type, payload, created_at")
        .eq("recipient_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(8)

      if (cancelled) return
      // A failed read is NOT "no activity" — surface it.
      if (loadErr) {
        setError(true)
        setLoading(false)
        return
      }

      const rows: ActivityItem[] = (data ?? []).map((n) => {
        const p = (n.payload ?? {}) as {
          title?: string
          body?: string | null
          action_url?: string | null
        }
        return {
          id: n.id,
          type: n.type,
          title: p.title ?? "",
          body: p.body ?? null,
          action_url: p.action_url ?? null,
          created_at: n.created_at,
        }
      })

      setItems(rows)
      setLoading(false)
    }

    fetchActivity()
    return () => {
      cancelled = true
    }
  }, [user, isDemoMode, authLoading, classroomId, attempt])

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="text-sm font-semibold">Recent Activity</h3>

      {loading ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-8 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
          <AlertTriangle className="size-6 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load recent activity
          </p>
          <button
            onClick={reload}
            className="text-xs font-medium text-[#D4A04C] hover:underline"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
          <Inbox className="size-6 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No activity yet</p>
          <p className="max-w-xs text-xs text-muted-foreground/70">
            As your students read, pass Trials, and submit work, their activity
            will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-1.5">
          {items.map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? BookOpen
            const colorClass = TYPE_COLORS[item.type] ?? "text-muted-foreground bg-muted"

            const content = (
              <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{item.title}</p>
                  {item.body && (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{item.body}</p>
                  )}
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatTimeAgo(item.created_at)}
                </span>
              </div>
            )

            return item.action_url ? (
              <Link key={item.id} href={item.action_url}>
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}
