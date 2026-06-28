"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SendHorizontal, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { VIRGIL_VOICE, type VirgilChatMessage, type VirgilSurface as Surface } from "@/lib/virgil/types"

// Iridescent treatment is reserved for Virgil affordances ONLY (never leaks
// outside Virgil). Gold is Virgil's signature mark.
const IRIDESCENT = "linear-gradient(110deg,#6366F1 0%,#8B5CF6 35%,#06B6D4 70%,#6366F1 100%)"
const GOLD = "linear-gradient(135deg,#E6C76E 0%,#C8A24B 55%,#9C7A2E 100%)"

interface Msg extends VirgilChatMessage {
  id: string
}

export interface VirgilSurfaceProps {
  surface: Surface
  /** Placeholder for the input. */
  placeholder?: string
  /** One-line hint shown under the empty state (e.g. a surface-specific nudge). */
  hint?: string
  className?: string
  /**
   * Compact scale for embedding inside dense chrome (e.g. the teacher session
   * rail beside the messaging panel). Trims the header, bubbles, and ask bar so
   * Virgil sits at the host surface's scale without shouting.
   */
  dense?: boolean
  /** Hide the header (wordmark/subtitle) when the host already labels Virgil. */
  hideHeader?: boolean
}

function GoldV({ size = 36 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-white shadow-sm"
      style={{ width: size, height: size, backgroundImage: GOLD }}
      aria-hidden
    >
      <span className="font-serif font-bold leading-none" style={{ fontSize: size * 0.5 }}>
        V
      </span>
    </span>
  )
}

/**
 * The one reusable Virgil chat surface. Carries Virgil's identity (gold "V",
 * serif wordmark, literary voice, in-character error) and streams from the
 * generalized /api/virgil route, reading response.body as raw text.
 */
export function VirgilSurface({ surface, placeholder, hint, className, dense, hideHeader }: VirgilSurfaceProps) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [streaming, setStreaming] = useState("")
  const [busy, setBusy] = useState(false)
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  // Scale tokens — `dense` shrinks Virgil to host-chrome size (teacher rail).
  const avatarLg = dense ? 28 : 36
  const avatarSm = dense ? 20 : 24
  const bubbleCls = dense ? "px-3 py-1.5 text-xs leading-relaxed" : "px-4 py-2.5 text-sm leading-relaxed"

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streaming])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || busy) return
      const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", content: trimmed }
      const history = [...messages, userMsg]
      setMessages(history)
      setInput("")
      setBusy(true)
      setStreaming("")

      try {
        const res = await fetch("/api/virgil", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surface,
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
        })
        if (!res.ok || !res.body) {
          setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: VIRGIL_VOICE.error }])
          return
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ""
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          acc += decoder.decode(value, { stream: true })
          setStreaming(acc)
        }
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: acc || VIRGIL_VOICE.error }])
      } catch {
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: VIRGIL_VOICE.error }])
      } finally {
        setStreaming("")
        setBusy(false)
      }
    },
    [busy, messages, surface],
  )

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden border bg-[var(--codex-surface,#fff)]/95 backdrop-blur-md",
        dense ? "rounded-xl" : "rounded-2xl border-l-2",
        className,
      )}
      style={{ borderColor: "rgba(99,102,241,0.22)", ...(dense ? {} : { borderLeftColor: "#6366F1" }) }}
    >
      {/* Header — gold "V" + serif wordmark */}
      {!hideHeader && (
        <div
          className={cn("flex items-center border-b", dense ? "gap-2 px-3 py-2.5" : "gap-3 px-4 py-3")}
          style={{ borderColor: "rgba(99,102,241,0.15)" }}
        >
          <GoldV size={avatarLg} />
          <div className="min-w-0">
            <p className={cn("font-serif font-bold leading-tight", dense ? "text-sm" : "text-base")}>
              {VIRGIL_VOICE.wordmark}
            </p>
            <p className={cn("text-muted-foreground", dense ? "text-[11px]" : "text-xs")}>{VIRGIL_VOICE.subtitle}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className={cn("flex-1 overflow-y-auto", dense ? "space-y-2.5 px-3 py-2.5" : "space-y-3 px-4 py-3")}>
        {messages.length === 0 && !streaming && (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center">
            <p className={cn("font-serif italic text-muted-foreground", dense ? "text-xs" : "text-sm")}>
              {VIRGIL_VOICE.empty}
            </p>
            {hint && <p className={cn("text-muted-foreground/70", dense ? "text-[11px]" : "text-xs")}>{hint}</p>}
          </div>
        )}

        {messages.map((m) => {
          if (m.role === "user") {
            return (
              <div key={m.id} className="flex justify-end">
                <div className={cn("max-w-[85%] rounded-2xl rounded-br-md bg-[#6366F1] text-white", bubbleCls)}>
                  {m.content}
                </div>
              </div>
            )
          }
          return (
            <div key={m.id} className="flex gap-2">
              <GoldV size={avatarSm} />
              <div className="min-w-0 max-w-[85%]">
                <div className={cn("rounded-2xl rounded-bl-md bg-[#6366F1]/10 text-foreground", bubbleCls)}>
                  {m.content}
                </div>
              </div>
            </div>
          )
        })}

        {streaming && (
          <div className="flex gap-2">
            <GoldV size={avatarSm} />
            <div className={cn("max-w-[85%] rounded-2xl rounded-bl-md bg-[#6366F1]/10 text-foreground", bubbleCls)}>
              {streaming}
            </div>
          </div>
        )}

        {busy && !streaming && (
          <div className="flex items-center gap-2 px-1 text-muted-foreground">
            <GoldV size={avatarSm} />
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className={cn("flex items-center border-t", dense ? "gap-1.5 px-2.5 py-2.5" : "gap-2 px-3 py-3")}
        style={{ borderColor: "rgba(99,102,241,0.15)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder ?? "Ask Virgil…"}
          disabled={busy}
          className={cn(
            "flex-1 bg-muted outline-none focus:ring-2 focus:ring-[#6366F1]/30 disabled:opacity-50",
            dense ? "rounded-lg px-3 py-2 text-xs" : "rounded-xl px-4 py-2.5 text-sm",
          )}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40",
            dense ? "size-8" : "size-9",
          )}
          style={{ backgroundImage: IRIDESCENT }}
          aria-label="Send to Virgil"
        >
          <SendHorizontal className={dense ? "size-3.5" : "size-4"} />
        </button>
      </form>
    </div>
  )
}
