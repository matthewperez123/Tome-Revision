"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { JoinCodeInput } from "@/components/guided-learning/join-code-input"
import { SessionLobby } from "@/components/guided-learning/session-lobby"
import { useGuidedSession } from "@/hooks/use-guided-session"
import { useAuth } from "@/hooks/use-auth"
import type { GuidedSession } from "@/lib/guided-learning-types"

export default function JoinGuidedSessionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookInfo, setBookInfo] = useState<{ title?: string; author?: string }>({})

  const { session, participants } = useGuidedSession(sessionId)

  // When session becomes active, redirect to the lockdown screen
  useEffect(() => {
    if (session?.status === "active" && sessionId) {
      router.push(`/learn/session/${sessionId}`)
    }
  }, [session?.status, sessionId, router])

  const handleJoinCode = useCallback(
    async (code: string) => {
      setError(null)
      setIsJoining(true)

      try {
        // Lookup session by code
        const lookupRes = await fetch(`/api/guided-sessions/lookup?code=${encodeURIComponent(code)}`)
        if (!lookupRes.ok) {
          const data = await lookupRes.json()
          throw new Error(data.error || "Session not found")
        }
        const { session: found } = await lookupRes.json() as { session: GuidedSession & { books?: { title: string; author: string } } }
        setBookInfo({ title: (found as any).books?.title, author: (found as any).books?.author })

        // Join the session
        const joinRes = await fetch(`/api/guided-sessions/${found.id}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ join_code: code }),
        })

        if (!joinRes.ok) {
          const data = await joinRes.json()
          // 409 = already joined, that's ok
          if (joinRes.status !== 409) {
            throw new Error(data.error || "Failed to join")
          }
        }

        setSessionId(found.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsJoining(false)
      }
    },
    [],
  )

  // Show lobby if joined
  if (sessionId && session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <SessionLobby
          session={session}
          participants={participants}
          isTeacher={false}
          bookTitle={bookInfo.title}
          bookAuthor={bookInfo.author}
        />
      </div>
    )
  }

  // Show join code input
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="mb-8 text-center">
        <h1
          className="mb-2 text-3xl font-bold"
        >
          Join Session
        </h1>
        <p className="text-sm opacity-60">
          Enter the code your teacher shared
        </p>
      </div>

      <JoinCodeInput
        onSubmit={handleJoinCode}
        isLoading={isJoining}
        error={error}
      />
    </div>
  )
}
