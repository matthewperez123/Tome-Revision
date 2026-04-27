"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Check, Sparkles, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import {
  acceptRecommendation,
  rejectRecommendation,
} from "@/lib/actions/recommendations"

interface PendingRec {
  id: string
  message: string | null
  created_at: string
  sender: {
    display_name: string | null
    username: string | null
    avatar_url: string | null
  } | null
  book: {
    id: string
    title: string
    author: string | null
    cover_image_path: string | null
  } | null
}

/**
 * Pending book-recommendations inbox. Renders only when the current user
 * has at least one pending recommendation. Accept/reject buttons call the
 * server actions; on success the row animates out.
 *
 * Hidden in demo mode (no real auth) so the existing library page stays
 * untouched for previews.
 */
export function RecommendationsInbox() {
  const { user, isDemoMode } = useAuth()
  const [recs, setRecs] = useState<PendingRec[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecs = useCallback(async () => {
    if (!user || isDemoMode) {
      setRecs([])
      setLoading(false)
      return
    }
    const supabase = createClient()
    const { data } = await supabase
      .from("book_recommendations")
      .select(
        `
        id, message, created_at,
        sender:profiles!book_recommendations_sender_id_fkey(display_name, username, avatar_url),
        book:books!book_recommendations_book_id_fkey(id, title, author, cover_image_path)
      `,
      )
      .eq("recipient_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
    setRecs((data as unknown as PendingRec[]) ?? [])
    setLoading(false)
  }, [user, isDemoMode])

  useEffect(() => {
    fetchRecs()
  }, [fetchRecs])

  if (isDemoMode || loading || recs.length === 0) return null

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-[#D4A04C]" />
        <h2 className="text-sm font-semibold tracking-tight">
          Recommendations for you
        </h2>
        <span className="text-xs text-muted-foreground">
          ({recs.length} pending)
        </span>
      </div>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {recs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              onResolved={() => setRecs((s) => s.filter((r) => r.id !== rec.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

function RecommendationCard({
  rec,
  onResolved,
}: {
  rec: PendingRec
  onResolved: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [resolved, setResolved] = useState<"accepted" | "rejected" | null>(null)

  function accept() {
    if (pending || resolved) return
    startTransition(async () => {
      const result = await acceptRecommendation(rec.id)
      if (result.ok) {
        setResolved("accepted")
        setTimeout(onResolved, 800)
      }
    })
  }

  function reject() {
    if (pending || resolved) return
    startTransition(async () => {
      const result = await rejectRecommendation(rec.id)
      if (result.ok) {
        setResolved("rejected")
        setTimeout(onResolved, 400)
      }
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: resolved === "rejected" ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
    >
      {rec.book && (
        <Link
          href={`/book/${rec.book.id}`}
          className="block size-14 shrink-0 overflow-hidden rounded-md bg-muted"
        >
          {rec.book.cover_image_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={rec.book.cover_image_path}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              {rec.book.title.slice(0, 1)}
            </div>
          )}
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">
          {resolved === "accepted" ? (
            <span className="text-[#D4A04C]">
              Added {rec.book?.title ?? "book"} to your library
            </span>
          ) : (
            <>
              <span className="text-muted-foreground">
                {rec.sender?.display_name ?? "Someone"} recommends{" "}
              </span>
              <span>{rec.book?.title ?? "a book"}</span>
              {rec.book?.author && (
                <span className="text-muted-foreground"> by {rec.book.author}</span>
              )}
            </>
          )}
        </p>
        {rec.message && resolved !== "accepted" && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            "{rec.message}"
          </p>
        )}
      </div>
      {!resolved && (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={accept}
            disabled={pending}
            className="flex size-8 items-center justify-center rounded-full bg-[#D4A04C]/15 text-[#D4A04C] transition-colors hover:bg-[#D4A04C]/25 disabled:opacity-50"
            aria-label={`Accept recommendation for ${rec.book?.title ?? "book"}`}
          >
            <Check className="size-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={reject}
            disabled={pending}
            className="flex size-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-500/80 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
            aria-label={`Reject recommendation for ${rec.book?.title ?? "book"}`}
          >
            <X className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </motion.article>
  )
}
