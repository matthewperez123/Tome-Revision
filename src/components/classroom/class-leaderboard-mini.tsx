"use client"

import { useEffect, useState } from "react"
import { Trophy } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface LeaderboardEntry {
  id: string
  display_name: string
  avatar_url: string | null
  wisdom: number
  rank: number
  isCurrentUser: boolean
}

export function ClassLeaderboardMini() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [classroomName, setClassroomName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }

    async function fetchLeaderboard() {
      const supabase = createClient()

      // Get the student's first classroom
      const { data: membership } = await supabase
        .from("classroom_members")
        .select("classroom_id, classrooms(name, leaderboard_enabled)")
        .eq("student_id", user!.id)
        .limit(1)
        .single()

      if (!membership) { setLoading(false); return }

      const classroom = (membership as any).classrooms as { name: string; leaderboard_enabled: boolean } | null
      if (!classroom?.leaderboard_enabled) { setLoading(false); return }

      setClassroomName(classroom.name)

      // Real class ranking: member-gated SECURITY DEFINER RPC sums each
      // student's quiz_results.wisdom_earned. No fabricated numbers.
      const { data: board } = await supabase.rpc("classroom_wisdom_leaderboard", {
        p_classroom: membership.classroom_id,
      })

      const rows =
        (board as {
          student_id: string
          display_name: string | null
          avatar_url: string | null
          wisdom: number
          trials_passed: number
        }[] | null) ?? []

      if (rows.length === 0) { setLoading(false); return }

      const ranked = rows
        .map((r) => ({
          id: r.student_id,
          display_name: r.display_name ?? "Student",
          avatar_url: r.avatar_url,
          wisdom: Number(r.wisdom),
          rank: 0,
          isCurrentUser: r.student_id === user!.id,
        }))
        .map((entry, i) => ({ ...entry, rank: i + 1 }))
        .slice(0, 5)

      setEntries(ranked)
      setLoading(false)
    }

    fetchLeaderboard()
  }, [user])

  if (loading || entries.length === 0) return null

  return (
    <BlurFade delay={0.15}>
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-[#D4A04C]" />
          <h3 className="text-sm font-semibold">Class Ranking</h3>
          <span className="ml-auto text-xs text-muted-foreground">{classroomName}</span>
        </div>

        <div className="mt-3 space-y-1.5">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${
                entry.isCurrentUser ? "bg-indigo-50 dark:bg-indigo-950/30" : ""
              }`}
            >
              <span className={`w-5 text-center text-xs font-bold ${
                entry.rank === 1 ? "text-[#D4A04C]" :
                entry.rank === 2 ? "text-slate-400" :
                entry.rank === 3 ? "text-amber-700" :
                "text-muted-foreground"
              }`}>
                {entry.rank}
              </span>
              <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {entry.display_name.charAt(0).toUpperCase()}
              </div>
              <span className="flex-1 truncate text-sm">
                {entry.display_name}
                {entry.isCurrentUser && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {entry.wisdom.toLocaleString()} Wisdom
              </span>
            </div>
          ))}
        </div>
      </div>
    </BlurFade>
  )
}
