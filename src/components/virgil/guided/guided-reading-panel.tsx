"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, SendHorizontal, BookCheck, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPoseImage } from "@/lib/virgil-poses"
import { IRIDESCENT } from "@/lib/semester-plan/rubric"
import { getGuidedSession, endGuidedSession } from "@/lib/actions/virgil-sessions"

interface Turn {
  id: string
  role: "user" | "virgil"
  content: string
}

interface GuidedReadingPanelProps {
  sessionId: string
  bookTitle: string
  /** e.g. "Chapter 3" — optional caption under Virgil's name. */
  chapterLabel?: string | null
  /** "floating" = fixed overlay (reader); "inline" = fills its container (route). */
  mode?: "floating" | "inline"
  onClose?: () => void
  /** Fired after the session is ended, with the stored summary. */
  onEnded?: (summary: string) => void
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="size-1.5 rounded-full bg-virgil"
        />
      ))}
    </div>
  )
}

/** Virgil's avatar in an iridescent ring — iridescence is reserved for Virgil. */
function VirgilAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="rounded-full p-[2px] shrink-0"
      style={{ backgroundImage: IRIDESCENT }}
    >
      <div
        className="rounded-full overflow-hidden bg-background"
        style={{ width: size, height: size }}
      >
        <Image
          src={getPoseImage("idle")}
          alt="Virgil"
          width={768}
          height={768}
          sizes={`${size}px`}
          className="size-full object-cover"
        />
      </div>
    </div>
  )
}

export function GuidedReadingPanel({
  sessionId,
  bookTitle,
  chapterLabel,
  mode = "floating",
  onClose,
  onEnded,
}: GuidedReadingPanelProps) {
  const [turns, setTurns] = useState<Turn[]>([])
  const [streaming, setStreaming] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [ending, setEnding] = useState(false)
  const [input, setInput] = useState("")

  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const startedRef = useRef(false)

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])
  useEffect(scrollToEnd, [turns, streaming, isThinking, scrollToEnd])

  // Stream one turn. `message` omitted ⇒ Virgil's opening (kickoff).
  const streamTurn = useCallback(
    async (message?: string) => {
      setIsThinking(true)
      setStreaming("")
      let accumulated = ""
      try {
        const res = await fetch("/api/virgil/guided", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message ? { sessionId, message } : { sessionId }),
        })
        if (!res.ok || !res.body) {
          throw new Error(`Stream failed: ${res.status}`)
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setStreaming(accumulated)
        }
      } catch {
        if (!accumulated) {
          accumulated = "I seem to have lost my voice for a moment. Please try again."
        }
      } finally {
        setTurns((prev) => [
          ...prev,
          { id: `v-${Date.now()}`, role: "virgil", content: accumulated },
        ])
        setStreaming("")
        setIsThinking(false)
        inputRef.current?.focus()
      }
    },
    [sessionId],
  )

  // Load history; kick off Virgil's opening when the session is brand new.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    let cancelled = false
    ;(async () => {
      const res = await getGuidedSession(sessionId)
      if (cancelled) return
      if (!res.ok) {
        setLoading(false)
        return
      }
      const { session, messages } = res.data
      setTurns(messages.map((m) => ({ id: m.id, role: m.role as "user" | "virgil", content: m.content })))
      if (session.status === "completed") {
        setCompleted(true)
        setSummary(session.summary)
        setLoading(false)
        return
      }
      setLoading(false)
      if (messages.length === 0) void streamTurn()
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId, streamTurn])

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isThinking || completed) return
      setTurns((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: trimmed }])
      setInput("")
      void streamTurn(trimmed)
    },
    [isThinking, completed, streamTurn],
  )

  const handleEnd = useCallback(async () => {
    if (ending) return
    setEnding(true)
    const res = await endGuidedSession(sessionId)
    setEnding(false)
    if (res.ok) {
      setCompleted(true)
      setSummary(res.data.summary)
      onEnded?.(res.data.summary)
    }
  }, [ending, sessionId, onEnded])

  const body = (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <VirgilAvatar />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold font-serif">Virgil</p>
          <p className="text-xs text-muted-foreground truncate">
            {chapterLabel ? `${bookTitle} · ${chapterLabel}` : `Reading ${bookTitle}`}
          </p>
        </div>
        {!completed && turns.length > 0 && (
          <button
            onClick={handleEnd}
            disabled={ending}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full px-2.5 py-1.5 hover:bg-muted transition-colors disabled:opacity-50"
            title="End session & save a summary"
          >
            {ending ? <Loader2 className="size-3.5 animate-spin" /> : <BookCheck className="size-3.5" />}
            End
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}

        {turns.map((m) => (
          <div key={m.id} className={cn("flex gap-2", m.role === "user" && "justify-end")}>
            <div
              className={cn(
                "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "virgil"
                  ? "bg-virgil/10 text-foreground rounded-2xl rounded-bl-md font-serif"
                  : "bg-virgil text-virgil-foreground rounded-2xl rounded-br-md ml-auto",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {streaming && (
          <div className="flex gap-2">
            <div className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap bg-virgil/10 text-foreground rounded-2xl rounded-bl-md font-serif">
              {streaming}
            </div>
          </div>
        )}

        {isThinking && !streaming && (
          <div className="flex gap-2">
            <div className="bg-virgil/10 rounded-2xl rounded-bl-md">
              <ThinkingDots />
            </div>
          </div>
        )}

        {/* Closing summary card */}
        {completed && summary && (
          <div
            className="rounded-2xl p-[1.5px] mt-2"
            style={{ backgroundImage: IRIDESCENT }}
          >
            <div className="rounded-2xl bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <VirgilAvatar size={24} />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Virgil&apos;s reflection
                </p>
              </div>
              <p className="text-sm leading-relaxed font-serif text-foreground whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input — hidden once the session is closed */}
      {!completed && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="px-4 py-3 border-t border-border shrink-0"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Virgil about this passage…"
              disabled={isThinking || loading}
              className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-virgil/25 disabled:opacity-50"
            />
            {input.trim() && (
              <button
                type="submit"
                className="size-9 flex items-center justify-center rounded-full bg-virgil text-virgil-foreground shrink-0 hover:bg-virgil/90 transition-colors disabled:opacity-50"
                disabled={isThinking}
                aria-label="Send"
              >
                <SendHorizontal className="size-4" />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )

  if (mode === "inline") {
    return (
      <div className="flex flex-col h-full min-h-0 bg-popover border border-border rounded-2xl overflow-hidden">
        {body}
      </div>
    )
  }

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className={cn(
            "fixed z-[61] flex flex-col bg-popover border border-border shadow-2xl overflow-hidden",
            "max-md:inset-x-0 max-md:bottom-0 max-md:h-[80vh] max-md:rounded-t-3xl",
            "md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] md:rounded-2xl",
          )}
        >
          {body}
        </motion.div>
      </>
    </AnimatePresence>
  )
}
