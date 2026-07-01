"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * Invite-link entry point: /join?code=ABC123
 * Hands off to the full join flow (lookup + confirm + enroll) which runs behind
 * the app's auth gate, so unauthenticated visitors are routed to sign in first.
 */
export default function JoinByQueryPage() {
  return (
    <Suspense fallback={<JoinSpinner />}>
      <JoinByQueryInner />
    </Suspense>
  )
}

function JoinByQueryInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")?.trim().toUpperCase()
    router.replace(
      code ? `/classroom/join?code=${encodeURIComponent(code)}` : "/classroom/join",
    )
  }, [searchParams, router])

  return <JoinSpinner />
}

function JoinSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
    </div>
  )
}
