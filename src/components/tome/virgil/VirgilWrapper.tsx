"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { VirgilProvider } from "@/lib/virgil-context"
import { VirgilCompanion } from "./VirgilCompanion"
import { VirgilChat } from "./VirgilChat"
import { VirgilPageContext } from "./VirgilPageContext"

/**
 * Virgil is a teacher-only system, so the floating companion + chat render
 * only once we've confirmed the signed-in user is a teacher. Students and
 * signed-out visitors never see it.
 */
export function VirgilWrapper({ children }: { children: React.ReactNode }) {
  const [isTeacher, setIsTeacher] = useState(false)

  useEffect(() => {
    let active = true
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const userId = data.user?.id
      if (!userId) return
      supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single()
        .then(({ data: profile }) => {
          if (active && profile?.role === "teacher") setIsTeacher(true)
        })
    })
    return () => {
      active = false
    }
  }, [])

  if (!isTeacher) return <>{children}</>

  return (
    <VirgilProvider>
      <VirgilPageContext />
      {children}
      <VirgilCompanion />
      <VirgilChat />
    </VirgilProvider>
  )
}
