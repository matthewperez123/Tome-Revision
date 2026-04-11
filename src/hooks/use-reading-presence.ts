"use client"

import { useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import {
  joinReadingChannel,
  updateReadingPresence,
  leaveReadingChannel,
  type ReadingPresence,
} from "@/lib/supabase/presence"
import type { RealtimeChannel } from "@supabase/supabase-js"

/**
 * Hook for students: broadcasts reading presence to classroom channels.
 * Call this in the reader component.
 */
export function useReadingPresence({
  bookId,
  bookTitle,
  chapterTitle,
  chapterIndex,
}: {
  bookId: string
  bookTitle: string
  chapterTitle: string
  chapterIndex: number
}) {
  const { user, profile } = useAuth()
  const channelsRef = useRef<RealtimeChannel[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  // Get classrooms the student belongs to
  useEffect(() => {
    if (!user || !profile) return

    let mounted = true

    async function setup() {
      const supabase = createClient()

      // Get student's classrooms
      const { data: memberships } = await supabase
        .from("classroom_members")
        .select("classroom_id")
        .eq("student_id", user!.id)

      if (!memberships?.length || !mounted) return

      const presence: ReadingPresence = {
        studentId: user!.id,
        studentName: profile!.display_name ?? "Student",
        bookId,
        bookTitle,
        chapterTitle,
        chapterIndex,
        pageProgress: 0,
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      }

      // Join each classroom's reading channel
      const channels = memberships.map((m) =>
        joinReadingChannel(m.classroom_id, presence),
      )
      channelsRef.current = channels

      // Update presence every 30 seconds
      intervalRef.current = setInterval(() => {
        const updated = { ...presence, lastActivity: new Date().toISOString() }
        channels.forEach((ch) => updateReadingPresence(ch, updated))
      }, 30_000)
    }

    setup()

    return () => {
      mounted = false
      if (intervalRef.current) clearInterval(intervalRef.current)
      channelsRef.current.forEach((ch) => leaveReadingChannel(ch))
      channelsRef.current = []
    }
  }, [user, profile, bookId, bookTitle, chapterTitle, chapterIndex])

  // Update chapter info when it changes
  const updateChapter = useCallback(
    (newChapterTitle: string, newChapterIndex: number, pageProgress: number) => {
      const presence: ReadingPresence = {
        studentId: user?.id ?? "",
        studentName: profile?.display_name ?? "Student",
        bookId,
        bookTitle,
        chapterTitle: newChapterTitle,
        chapterIndex: newChapterIndex,
        pageProgress,
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      }
      channelsRef.current.forEach((ch) => updateReadingPresence(ch, presence))
    },
    [user, profile, bookId, bookTitle],
  )

  return { updateChapter }
}
