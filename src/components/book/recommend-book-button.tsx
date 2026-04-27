"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { Send, Sparkles, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { useFriendsData, type FriendProfile } from "@/hooks/use-friends-data"
import { recommendBook } from "@/lib/actions/recommendations"
import { cn } from "@/lib/utils"

/**
 * "Recommend to a friend" button for the book detail page.
 *
 * Always visible. In demo or unauthenticated mode the popover shows a
 * sign-in prompt; once authenticated, lists the user's accepted connections
 * for picking, then reveals an optional message textarea and a Send button.
 */
export function RecommendBookButton({
  bookId,
  bookTitle,
  className,
}: {
  bookId: string
  bookTitle: string
  className?: string
}) {
  const { user, isDemoMode } = useAuth()
  const { friends, mode } = useFriendsData()
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<FriendProfile | null>(null)
  const [message, setMessage] = useState("")
  const [pending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement | null>(null)

  const isReal = !isDemoMode && !!user && mode === "real"

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open])

  function send() {
    if (!picked) return
    startTransition(async () => {
      const result = await recommendBook({
        recipientId: picked.id,
        bookId,
        message: message.trim() || undefined,
      })
      if (result.ok) {
        toast.success(`Recommended ${bookTitle} to ${picked.displayName}`)
        setOpen(false)
        setPicked(null)
        setMessage("")
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 h-9 px-3 rounded-full border text-xs transition-colors",
          "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
        )}
      >
        <Sparkles className="size-3.5" />
        Recommend
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-card p-3 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-medium text-muted-foreground">
                {!isReal
                  ? "Recommend to a friend"
                  : picked
                    ? `Send to ${picked.displayName}`
                    : "Pick a friend"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setPicked(null)
                  setMessage("")
                }}
                aria-label="Close"
                className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </div>

            {/* Demo / unauthenticated → sign-in nudge */}
            {!isReal && (
              <div className="space-y-2 py-2">
                <p className="text-xs italic text-muted-foreground">
                  Sign in to recommend {bookTitle} to your friends.
                </p>
                <Link
                  href="/login"
                  className="inline-flex h-8 w-full items-center justify-center rounded-full bg-foreground px-3 text-[11px] font-medium text-background hover:opacity-90"
                >
                  Sign in
                </Link>
              </div>
            )}

            {/* Real-mode friend picker */}
            {isReal && !picked &&
              (friends.length === 0 ? (
                <p className="py-4 text-center text-xs italic text-muted-foreground">
                  Add friends first to recommend them books.
                </p>
              ) : (
                <div className="max-h-56 space-y-1 overflow-y-auto">
                  {friends.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setPicked(f)}
                      className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-muted/50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.avatarUrl}
                        alt=""
                        className="size-7 rounded-full border border-[#D4A04C]/20"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {f.displayName}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          @{f.username}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}

            {/* Message + send */}
            {isReal && picked && (
              <div className="space-y-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Why this book? (optional)"
                  rows={3}
                  className="w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tome-accent)]"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPicked(null)}
                    className="text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    ← Pick someone else
                  </button>
                  <button
                    type="button"
                    onClick={send}
                    disabled={pending}
                    className="flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background disabled:opacity-50"
                  >
                    {pending ? "Sending…" : <><Send className="size-3" /> Send</>}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
