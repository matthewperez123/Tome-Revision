"use client"

import { use, useState, useEffect } from "react"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SessionReviewDashboard } from "@/components/guided-learning/session-review-dashboard"
import type {
  GuidedSession, Station, ParticipantWithProfile,
  SessionMessage, Reflection,
} from "@/lib/guided-learning-types"

export default function TeacherReviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<GuidedSession | null>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [participants, setParticipants] = useState<ParticipantWithProfile[]>([])
  const [messages, setMessages] = useState<SessionMessage[]>([])
  const [reflections, setReflections] = useState<Reflection[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/guided-sessions/${sessionId}/review`)
        if (res.ok) {
          const data = await res.json()
          setSession(data.session)
          setStations(data.stations ?? [])
          setParticipants(data.participants ?? [])
          setMessages(data.messages ?? [])
          setReflections(data.reflections ?? [])
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin opacity-30" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-2 py-32 text-center">
        <p className="text-lg font-semibold">Session not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="px-4 pt-4">
        <Link
          href={`/teacher/guided-learning/${sessionId}`}
          className="inline-flex items-center gap-1 text-xs opacity-50 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to session
        </Link>
      </div>
      <SessionReviewDashboard
        session={session}
        stations={stations}
        participants={participants}
        messages={messages}
        reflections={reflections}
        isTeacher
      />
    </div>
  )
}
