"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, ChevronRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getBook } from "@/lib/content"
import { getPoseImage } from "@/lib/virgil-poses"
import { IRIDESCENT } from "@/lib/semester-plan/rubric"
import { listGuidedSessions, type GuidedSessionMeta } from "@/lib/actions/virgil-sessions"

const GOLD = "#C8A24B"
const VERDIGRIS = "#2E7D6F"

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime()
  const s = Math.floor((Date.now() - d) / 1000)
  if (s < 60) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function VirgilMark({ size = 40 }: { size?: number }) {
  return (
    <div className="rounded-full p-[2px] shrink-0" style={{ backgroundImage: IRIDESCENT }}>
      <div className="rounded-full overflow-hidden bg-background" style={{ width: size, height: size }}>
        <Image src={getPoseImage("idle")} alt="Virgil" width={768} height={768} sizes={`${size}px`} className="size-full object-cover" />
      </div>
    </div>
  )
}

function SessionCard({ s }: { s: GuidedSessionMeta }) {
  const book = getBook(s.bookId)
  const title = book?.title ?? s.bookId.replace(/-/g, " ")
  const chapterLabel = s.chapter != null ? `Chapter ${s.chapter + 1}` : null
  return (
    <Link
      href={`/guided/${s.id}`}
      className="group block rounded-2xl border border-border bg-card p-4 hover:border-muted-foreground/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        <VirgilMark />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-serif font-semibold truncate">{title}</p>
            <span
              className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full shrink-0"
              style={
                s.status === "active"
                  ? { color: GOLD, background: `${GOLD}1A` }
                  : { color: VERDIGRIS, background: `${VERDIGRIS}1A` }
              }
            >
              {s.status === "active" ? "Active" : "Complete"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {chapterLabel ? `${chapterLabel} · ` : ""}
            {s.messageCount} {s.messageCount === 1 ? "turn" : "turns"} · {timeAgo(s.startedAt)}
          </p>
          {s.summary && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-serif">{s.summary}</p>
          )}
        </div>
        <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground shrink-0 mt-1" />
      </div>
    </Link>
  )
}

export default function GuidedSessionsPage() {
  const { user, isDemoMode, isLoading: authLoading } = useAuth()
  const isReal = !!user && !isDemoMode
  const [sessions, setSessions] = useState<GuidedSessionMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isReal) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      const res = await listGuidedSessions()
      if (cancelled) return
      if (res.ok) setSessions(res.data)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, isReal])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <header className="flex items-center gap-4 mb-8">
        <VirgilMark size={56} />
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Guided Reading</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your conversations with Virgil. Open any book and tap{" "}
            <span className="font-medium">Read with Virgil</span> to begin a new one.
          </p>
        </div>
      </header>

      {!isReal && !authLoading ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <BookOpen className="size-7 mx-auto text-muted-foreground/60 mb-3" />
          <p className="font-serif text-lg">Sign in to read with Virgil</p>
          <p className="text-sm text-muted-foreground mt-1">
            Guided sessions remember where you left off and reflect on what you explored.
          </p>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <BookOpen className="size-7 mx-auto text-muted-foreground/60 mb-3" />
          <p className="font-serif text-lg">No guided readings yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Open a book and tap <span className="font-medium">Read with Virgil</span> to start your first.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <SessionCard s={s} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
