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

      // Get all members of this classroom with their profiles
      const { data: members } = await supabase
        .from("classroom_members")
        .select("student_id, profiles(id, display_name, avatar_url)")
        .eq("classroom_id", membership.classroom_id)

      if (!members?.length) { setLoading(false); return }

      // For now, use a simple ranking based on profile data
      // In production, this would query quiz results and XP from the classroom
      const ranked = members
        .map((m, i) => {
          const profile = (m as any).profiles as { id: string; display_name: string; avatar_url: string | null } | null
          return {
            id: profile?.id ?? m.student_id,
            display_name: profile?.display_name ?? "Student",
            avatar_url: profile?.avatar_url ?? null,
            wisdom: Math.floor(Math.random() * 500) + 100, // Placeholder until real XP tracking
            rank: 0,
            isCurrentUser: m.student_id === user!.id,
          }
        })
        .sort((a, b) => b.wisdom - a.wisdom)
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
                {entry.wisdom} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </BlurFade>
  )
}
