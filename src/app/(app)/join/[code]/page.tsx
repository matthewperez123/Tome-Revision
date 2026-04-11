"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Direct join link: /join/[CODE]
 * Redirects to the regular join page with the code pre-filled.
 */
export default function DirectJoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()

  useEffect(() => {
    // Redirect to the join page with code as a search param
    router.replace(`/classroom/join?code=${encodeURIComponent(code.toUpperCase())}`)
  }, [code, router])

  return (
    <div className="flex items-center justify-center py-20">
      <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
    </div>
  )
}
