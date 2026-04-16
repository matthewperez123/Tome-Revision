"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { SessionReviewDashboard } from "@/components/guided-learning/session-review-dashboard"
import type {
  GuidedSession, Station, ParticipantWithProfile,
  SessionMessage, Reflection,
} from "@/lib/guided-learning-types"

export default function StudentReviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin opacity-30" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold">Session not found</p>
      </div>
    )
  }

  return (
    <SessionReviewDashboard
      session={session}
      stations={stations}
      participants={participants}
      messages={messages}
      reflections={reflections}
      isTeacher={false}
    />
  )
}
