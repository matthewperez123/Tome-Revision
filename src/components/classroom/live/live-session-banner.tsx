"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Radio, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface LiveSessionRow {
  id: string
  status: string
  total_questions: number
}

/**
 * Surfaces any in-flight live quiz for a classroom so members can hop in. RLS
 * (live_quiz_sessions_select = class member) scopes the query, so a non-member
 * simply sees nothing. Realtime keeps it live — the banner appears the instant
 * a teacher launches and clears when the game ends. The `role` prop only tunes
 * the copy; the shared /classroom/live/[sessionId] route decides host vs player
 * from the server-computed isStaff flag.
 */
export function LiveSessionBanner({
  classroomId,
  role,
}: {
  classroomId: string
  role: "teacher" | "student"
}) {
  const [session, setSession] = useState<LiveSessionRow | null>(null)

  const refetch = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("live_quiz_sessions")
      .select("id, status, total_questions")
      .eq("classroom_id", classroomId)
      .neq("status", "ended")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<LiveSessionRow>()
    setSession(data ?? null)
  }, [classroomId])

  useEffect(() => {
    void refetch()
  }, [refetch])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`live-banner:${classroomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_quiz_sessions",
          filter: `classroom_id=eq.${classroomId}`,
        },
        () => void refetch(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [classroomId, refetch])

  return (
    <AnimatePresence>
      {session && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
        >
          <Link
            href={`/classroom/live/${session.id}`}
            className="group flex items-center gap-3 rounded-xl border border-[#6C2D5C]/30 bg-[#6C2D5C]/[0.06] px-4 py-3 transition-colors hover:bg-[#6C2D5C]/[0.12]"
          >
            <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[#6C2D5C] text-white">
              <Radio className="size-4" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 animate-pulse rounded-full bg-[#C8A24B]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#6C2D5C] dark:text-[#c98db8]">
                {role === "teacher" ? "Your live quiz is running" : "A live quiz is happening now"}
              </p>
              <p className="text-xs text-muted-foreground">
                {role === "teacher"
                  ? "Resume the host screen"
                  : "Tap to jump into the arena"}
                {" · "}
                {session.total_questions} questions
              </p>
            </div>
            <ChevronRight className="size-4 text-[#6C2D5C] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
