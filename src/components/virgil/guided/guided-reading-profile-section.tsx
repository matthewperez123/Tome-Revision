"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getBook } from "@/lib/content"
import { getPoseImage } from "@/lib/virgil-poses"
import { IRIDESCENT } from "@/lib/semester-plan/rubric"
import { listGuidedSessions, type GuidedSessionMeta } from "@/lib/actions/virgil-sessions"

/**
 * Profile surface for Virgil's guided reading: shows the reflections Virgil
 * wrote when sessions ended. Renders nothing for demo/empty so the profile
 * stays clean. Iridescence marks it as a Virgil surface.
 */
export function GuidedReadingProfileSection() {
  const { user, isDemoMode } = useAuth()
  const isReal = !!user && !isDemoMode
  const [sessions, setSessions] = useState<GuidedSessionMeta[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isReal) return
    let cancelled = false
    ;(async () => {
      const res = await listGuidedSessions()
      if (cancelled) return
      if (res.ok) setSessions(res.data)
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [isReal])

  if (!isReal || !loaded) return null

  const reflections = sessions.filter((s) => s.status === "completed" && s.summary)
  // Nothing reflected on yet — don't add visual noise to the profile.
  if (reflections.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-serif text-xl font-semibold tracking-tight">Reading with Virgil</h2>
        <Link href="/guided" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          All sessions <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="relative flex items-center my-5" aria-hidden>
        <div className="flex-1 h-px bg-border" />
        <div className="mx-3 shrink-0 rounded-full p-[2px]" style={{ backgroundImage: IRIDESCENT }}>
          <div className="rounded-full overflow-hidden bg-background size-5">
            <Image src={getPoseImage("idle")} alt="" width={768} height={768} sizes="20px" className="size-full object-cover" />
          </div>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-3">
        {reflections.slice(0, 3).map((s) => {
          const book = getBook(s.bookId)
          const title = book?.title ?? s.bookId.replace(/-/g, " ")
          return (
            <Link
              key={s.id}
              href={`/guided/${s.id}`}
              className="block rounded-2xl p-[1.5px] hover:opacity-95 transition-opacity"
              style={{ backgroundImage: IRIDESCENT }}
            >
              <div className="rounded-2xl bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {title}
                  {s.chapter != null ? ` · Chapter ${s.chapter + 1}` : ""}
                </p>
                <p className="text-sm leading-relaxed font-serif text-foreground mt-1.5 line-clamp-3">
                  {s.summary}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
