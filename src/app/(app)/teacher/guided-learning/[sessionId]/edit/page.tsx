"use client"

import { use, useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { CreateSessionWizard } from "@/components/guided-learning/wizard/create-session-wizard"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import type { GuidedSession } from "@/lib/guided-learning-types"

export default function EditGuidedSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const { user, isDemoMode } = useAuth()
  const [session, setSession] = useState<GuidedSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/guided-sessions/${sessionId}`)
        if (res.ok) {
          const data = await res.json()
          setSession(data.session)
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
        <p className="text-sm opacity-50">This session may have been deleted.</p>
      </div>
    )
  }

  if (session.status !== "draft" && session.status !== "scheduled") {
    return (
      <div className="flex flex-col items-center gap-2 py-32 text-center">
        <p className="text-lg font-semibold">Cannot edit</p>
        <p className="text-sm opacity-50">
          Only draft or scheduled sessions can be edited.
        </p>
      </div>
    )
  }

  return <CreateSessionWizard editSession={session} />
}
