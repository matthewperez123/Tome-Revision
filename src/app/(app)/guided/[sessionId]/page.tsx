"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Loader2 } from "lucide-react"
import { getBook } from "@/lib/content"
import { getGuidedSession } from "@/lib/actions/virgil-sessions"
import { GuidedReadingPanel } from "@/components/virgil/guided/guided-reading-panel"

export default function GuidedSessionDetailPage() {
  const params = useParams<{ sessionId: string }>()
  const sessionId = params?.sessionId ?? ""
  const router = useRouter()

  const [meta, setMeta] = useState<{ bookTitle: string; chapterLabel: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    ;(async () => {
      const res = await getGuidedSession(sessionId)
      if (cancelled) return
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      const { session } = res.data
      const book = getBook(session.bookId)
      setMeta({
        bookTitle: book?.title ?? session.bookId.replace(/-/g, " "),
        chapterLabel: session.chapter != null ? `Chapter ${session.chapter + 1}` : null,
      })
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:py-8 h-[calc(100dvh-4rem)] flex flex-col">
      <Link
        href="/guided"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 shrink-0"
      >
        <ChevronLeft className="size-4" /> Guided Reading
      </Link>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-serif text-lg">{error}</p>
          </div>
        ) : meta ? (
          <GuidedReadingPanel
            sessionId={sessionId}
            bookTitle={meta.bookTitle}
            chapterLabel={meta.chapterLabel}
            mode="inline"
            onClose={() => router.push("/guided")}
          />
        ) : null}
      </div>
    </div>
  )
}
