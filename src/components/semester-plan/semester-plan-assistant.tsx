"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp, Check } from "lucide-react"
import { IRIDESCENT, RUBRIC } from "@/lib/semester-plan/rubric"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  /** Set on assistant turns that actually mutated the plan. */
  applied?: boolean
}

interface Props {
  planId: string
  /** Called after Virgil applies a revision, so the board can refresh. */
  onApplied: () => void
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "I'm Virgil. Tell me how you'd like to reshape the term \u2014 in plain language \u2014 and I'll revise the plan (e.g. \u201clighten weeks 5\u20136\u201d, \u201cswap the week 3 novel for something shorter\u201d, or \u201cadd a discussion to every reading week\u201d).",
}

export function SemesterPlanAssistant({ planId, onApplied }: Props) {
  const [open, setOpen] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const threadRef = useRef<HTMLDivElement>(null)

  // Keep the thread pinned to the latest message.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, sending])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text }
    const history = [...messages.filter((m) => m.id !== "greeting"), userMsg]
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setSending(true)
    try {
      const res = await fetch(`/api/classroom/semester-plan/${planId}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply ?? "Something went wrong on my end.",
          applied: !!data.applied,
        },
      ])
      if (data.applied) onApplied()
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Network hiccup — try sending that again." },
      ])
    } finally {
      setSending(false)
    }
  }, [input, sending, messages, planId, onApplied])

  return (
    <div className="mt-4 overflow-hidden rounded-2xl p-[1.5px]" style={{ backgroundImage: IRIDESCENT }}>
      <div className="rounded-2xl bg-card">
        {/* Header (collapses the chat) */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
        >
          <Sparkles className="size-4" style={{ color: "#7C5CFF" }} />
          <span className="text-sm font-semibold" style={{ color: RUBRIC.ink }}>
            Plan the term with Virgil
          </span>
          <span className="ml-1 text-xs font-normal text-muted-foreground">— ask in plain language</span>
          {open ? (
            <ChevronUp className="ml-auto size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="ml-auto size-4 text-muted-foreground" />
          )}
        </button>

        {open && (
          <div className="space-y-3 px-3 pb-3">
            {/* Chat thread */}
            <div
              ref={threadRef}
              className="max-h-72 space-y-2.5 overflow-y-auto rounded-xl border border-border p-3"
            >
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className="max-w-[85%]">
                    <div
                      className="rounded-2xl px-3 py-2 text-sm"
                      style={
                        m.role === "user"
                          ? { backgroundColor: "rgba(99,102,241,0.1)" }
                          : { backgroundColor: "var(--tome-surface-elevated)" }
                      }
                    >
                      {m.content}
                    </div>
                    {m.applied && (
                      <p
                        className="mt-1 flex items-center gap-1 text-[11px] font-medium"
                        style={{ color: RUBRIC.verdigris }}
                      >
                        <Check className="size-3" /> Plan updated
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Virgil is reworking the term…
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                rows={1}
                placeholder="Ask Virgil to revise the term…"
                disabled={sending}
                className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !input.trim()}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundImage: IRIDESCENT }}
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
