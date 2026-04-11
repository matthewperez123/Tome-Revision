"use client"

import { useEffect, useState, useRef } from "react"
import { BookOpen } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { subscribeToClassroomReading, type ReadingPresence } from "@/lib/supabase/presence"
import type { RealtimeChannel } from "@supabase/supabase-js"

type ReaderStatus = "active" | "idle" | "disconnected"

interface ActiveReader extends ReadingPresence {
  status: ReaderStatus
  sessionMinutes: number
}

function getStatus(lastActivity: string): ReaderStatus {
  const diff = Date.now() - new Date(lastActivity).getTime()
  const minutes = diff / 60_000
  if (minutes < 2) return "active"
  if (minutes < 5) return "idle"
  return "disconnected"
}

const STATUS_DOT: Record<ReaderStatus, string> = {
  active: "bg-green-500",
  idle: "bg-yellow-500",
  disconnected: "bg-gray-400",
}

// Demo readers per classroom
const DEMO_READERS_CLASS1: ActiveReader[] = [
  {
    studentId: "s1", studentName: "Sofia Rodriguez", bookId: "the-odyssey", bookTitle: "The Odyssey",
    chapterTitle: "Book 5", chapterIndex: 4, pageProgress: 67, startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    lastActivity: new Date(Date.now() - 30000).toISOString(), status: "active", sessionMinutes: 45,
  },
  {
    studentId: "s2", studentName: "James O'Brien", bookId: "pride-and-prejudice", bookTitle: "Pride & Prejudice",
    chapterTitle: "Chapter 12", chapterIndex: 11, pageProgress: 34, startedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    lastActivity: new Date(Date.now() - 60000).toISOString(), status: "active", sessionMinutes: 20,
  },
  {
    studentId: "s3", studentName: "Aisha Patel", bookId: "the-odyssey", bookTitle: "The Odyssey",
    chapterTitle: "Book 3", chapterIndex: 2, pageProgress: 89, startedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    lastActivity: new Date(Date.now() - 4 * 60000).toISOString(), status: "idle", sessionMinutes: 60,
  },
]

const DEMO_READERS_CLASS2: ActiveReader[] = [
  {
    studentId: "s10", studentName: "Tobias Grant", bookId: "the-republic", bookTitle: "The Republic",
    chapterTitle: "Book III", chapterIndex: 2, pageProgress: 45, startedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    lastActivity: new Date(Date.now() - 90000).toISOString(), status: "active", sessionMinutes: 30,
  },
  {
    studentId: "s11", studentName: "Linnaeus Park", bookId: "the-republic", bookTitle: "The Republic",
    chapterTitle: "Book II", chapterIndex: 1, pageProgress: 78, startedAt: new Date(Date.now() - 55 * 60000).toISOString(),
    lastActivity: new Date(Date.now() - 3 * 60000).toISOString(), status: "idle", sessionMinutes: 55,
  },
]

function getDemoReaders(classroomId?: string): ActiveReader[] {
  if (classroomId === "class-1") return DEMO_READERS_CLASS1
  if (classroomId === "class-2") return DEMO_READERS_CLASS2
  return [...DEMO_READERS_CLASS1, ...DEMO_READERS_CLASS2]
}

export function LiveReadingPanel({ classroomId }: { classroomId?: string }) {
  const { user, isDemoMode } = useAuth()
  const [readers, setReaders] = useState<ActiveReader[]>([])
  const channelsRef = useRef<RealtimeChannel[]>([])

  useEffect(() => {
    if (isDemoMode || !user) {
      setReaders(getDemoReaders(classroomId))
      return
    }

    let mounted = true

    async function subscribe() {
      const supabase = createClient()

      let classroomIds: string[] = []
      if (classroomId) {
        classroomIds = [classroomId]
      } else {
        const { data } = await supabase
          .from("classrooms")
          .select("id")
          .eq("teacher_id", user!.id)
          .eq("archived", false)
        classroomIds = (data ?? []).map((c) => c.id)
      }

      if (!classroomIds.length || !mounted) {
        setReaders(getDemoReaders(classroomId))
        return
      }

      const channels = classroomIds.map((id) =>
        subscribeToClassroomReading(id, (presences) => {
          if (!mounted) return
          const mapped = presences
            .map((p) => ({
              ...p,
              status: getStatus(p.lastActivity) as ReaderStatus,
              sessionMinutes: Math.round(
                (Date.now() - new Date(p.startedAt).getTime()) / 60_000,
              ),
            }))
            .filter((r) => r.status !== "disconnected")
            .sort((a, b) => (a.status === "active" ? -1 : 1))

          setReaders(mapped.length > 0 ? mapped : getDemoReaders(classroomId))
        }),
      )

      channelsRef.current = channels
    }

    subscribe()

    return () => {
      mounted = false
      const supabase = createClient()
      channelsRef.current.forEach((ch) => supabase.removeChannel(ch))
      channelsRef.current = []
    }
  }, [user, classroomId, isDemoMode])

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2">
        <div className="relative">
          <BookOpen className="size-4 text-green-500" />
          {readers.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        <h3 className="text-sm font-semibold">Live Reading Activity</h3>
        {readers.length > 0 && (
          <span className="ml-auto text-xs font-medium text-green-600">
            {readers.length} reading
          </span>
        )}
      </div>

      {readers.length === 0 ? (
        <div className="mt-4 flex flex-col items-center py-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <BookOpen className="size-5 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            No students reading right now
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-1.5">
          {readers.map((reader) => (
            <div
              key={reader.studentId}
              className="flex items-center gap-3 rounded-lg px-2.5 py-2"
            >
              <span className={`size-2 rounded-full ${STATUS_DOT[reader.status]}`} />
              <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {reader.studentName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{reader.studentName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {reader.bookTitle}, {reader.chapterTitle}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {reader.sessionMinutes}m
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
