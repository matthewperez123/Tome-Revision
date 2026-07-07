"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

/**
 * Invite / scan entry point: /join?code=ABC123 (the URL the class-join QR
 * encodes). Once auth resolves:
 *   * a real, signed-in account → the full join flow (lookup + confirm + enroll)
 *     at /classroom/join, which runs behind the app auth gate;
 *   * a logged-out scanner → the code-only student sign-in, preserving the
 *     destination via ?returnTo so the join completes right after they sign in.
 *     No account is ever created from a scan — students are teacher-provisioned.
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
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Wait for auth to settle so we don't misroute a signed-in student.
    if (isLoading) return

    const code = searchParams.get("code")?.trim().toUpperCase()
    const codeQuery = code ? `?code=${encodeURIComponent(code)}` : ""

    if (!user) {
      // Logged-out scan: send them to the code-only sign-in and carry the join
      // destination so they land back here (and enroll) once authenticated.
      const returnTo = `/join${codeQuery}`
      router.replace(`/student-login?returnTo=${encodeURIComponent(returnTo)}`)
      return
    }

    router.replace(`/classroom/join${codeQuery}`)
  }, [searchParams, router, user, isLoading])

  return <JoinSpinner />
}

function JoinSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
    </div>
  )
}
