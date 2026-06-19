"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Send, Sparkles, Highlighter, StickyNote } from "lucide-react"
import { DemoFrame } from "@/components/demo/DemoFrame"
import { TeacherShowcaseShell } from "../teacher/TeacherShowcaseShell"
import {
  DEMO_PASSAGE,
  DEMO_EXCHANGES,
  streamScriptedReply,
} from "@/lib/demo/virgil"

const AMBER = "#D97706"

interface ChatMsg {
  id: string
  role: "user" | "virgil"
  content: string
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="size-1.5 rounded-full bg-primary"
        />
      ))}
    </div>
  )
}

export function VirgilDrawerDemo() {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState("")
  const [thinking, setThinking] = useState(false)
  const [reduced, setReduced] = useState(false)
  const cancelRef = useRef<(() => void) | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined")
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return () => cancelRef.current?.()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, streaming, thinking])

  const ask = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return
    cancelRef.current?.()
    setMessages((m) => [
      ...m,
      { id: `${Date.now()}-u`, role: "user", content: trimmed },
    ])
    setInput("")
    setThinking(true)
    setStreaming("")

    let acc = ""
    cancelRef.current = streamScriptedReply(
      trimmed,
      (chunk) => {
        acc += chunk
        setStreaming(acc)
        setThinking(false)
      },
      () => {
        setMessages((m) => [
          ...m,
          { id: `${Date.now()}-v`, role: "virgil", content: acc },
        ])
        setStreaming("")
        setThinking(false)
      },
      { reduced },
    )
  }

  const askedPrompts = new Set(
    messages.filter((m) => m.role === "user").map((m) => m.content),
  )
  const remainingPills = DEMO_EXCHANGES.filter(
    (e) => !askedPrompts.has(e.prompt),
  )

  return (
    <TeacherShowcaseShell
      heading="A scholar in the margin. Your marks beside his."
      subcopy="Tap any annotation to open Virgil's drawer \u2014 a scholarly note up top, a live chat at the bottom. Highlight what stops you, leave a note for your future self. Virgil is indigo; you are amber."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <DemoFrame
        ariaLabel="Interactive Virgil drawer"
        hint="Ask Virgil"
        onReset={
          messages.length > 0
            ? () => {
                cancelRef.current?.()
                setMessages([])
                setStreaming("")
                setThinking(false)
                setInput("")
              }
            : undefined
        }
      >
        <div className="grid grid-cols-1 gap-4">
          {/* Virgil drawer */}
          <div className="bg-background rounded-lg border border-border relative overflow-hidden">
            <div className="p-5">
              <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider">
                {DEMO_PASSAGE.work} &middot; {DEMO_PASSAGE.locator}
              </p>
              <div className="font-serif text-sm text-foreground leading-[1.9] space-y-0.5">
                <p>{DEMO_PASSAGE.lines[0]}</p>
                <p>
                  <span className="underline decoration-primary underline-offset-4 rounded bg-primary/15 px-0.5">
                    {DEMO_PASSAGE.marked}
                  </span>
                  , that brought countless ills
                </p>
                <p>{DEMO_PASSAGE.lines[2]}</p>
              </div>
            </div>

            <div className="rounded-t-xl bg-card border-t border-border shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
              {/* Scholarly note */}
              <div className="px-5 pt-4 pb-3 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-5 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-[10px] font-serif font-bold text-primary">
                    V
                  </div>
                  <span className="text-xs font-semibold text-primary">Virgil</span>
                  <span className="text-[10px] text-muted-foreground">
                    &middot; {DEMO_PASSAGE.annotationLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {DEMO_PASSAGE.annotation}
                </p>
              </div>

              {/* Live chat */}
              <div className="p-3">
                <div
                  ref={scrollRef}
                  className="mb-3 space-y-2 max-h-[180px] overflow-y-auto"
                >
                  {messages.map((msg) =>
                    msg.role === "user" ? (
                      <div key={msg.id} className="flex justify-end">
                        <div className="rounded-2xl rounded-br-sm bg-primary/10 border border-primary/20 px-3 py-1.5 text-[11px] text-foreground max-w-[80%]">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div key={msg.id} className="flex items-start gap-2">
                        <div className="size-5 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-[9px] font-serif font-bold text-primary shrink-0 mt-0.5">
                          V
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-muted border border-border px-3 py-1.5 text-[11px] text-muted-foreground leading-relaxed max-w-[85%]">
                          {msg.content}
                        </div>
                      </div>
                    ),
                  )}

                  {streaming && (
                    <div className="flex items-start gap-2">
                      <div className="size-5 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-[9px] font-serif font-bold text-primary shrink-0 mt-0.5">
                        V
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-muted border border-border px-3 py-1.5 text-[11px] text-muted-foreground leading-relaxed max-w-[85%]">
                        {streaming}
                      </div>
                    </div>
                  )}

                  {thinking && !streaming && (
                    <div className="flex items-start gap-2">
                      <div className="size-5 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-[9px] font-serif font-bold text-primary shrink-0 mt-0.5">
                        V
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-muted border border-border">
                        <ThinkingDots />
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestion pills */}
                <AnimatePresence>
                  {remainingPills.length > 0 && !thinking && !streaming && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-wrap gap-1.5 mb-2"
                    >
                      {remainingPills.map((e) => (
                        <button
                          key={e.prompt}
                          type="button"
                          onClick={() => ask(e.prompt)}
                          className="text-[10px] bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary px-2.5 py-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {e.prompt}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input */}
                <form
                  onSubmit={(ev) => {
                    ev.preventDefault()
                    ask(input)
                  }}
                  className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5"
                >
                  <Sparkles className="size-3 text-primary shrink-0" />
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={thinking}
                    placeholder="Ask Virgil about this passage…"
                    aria-label="Ask Virgil about this passage"
                    className="text-[11px] bg-transparent text-foreground placeholder:text-muted-foreground flex-1 min-w-0 outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={thinking || !input.trim()}
                    aria-label="Send"
                    className="size-5 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-40"
                  >
                    <Send className="size-2.5 text-primary-foreground" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Amber user highlight + margin note (static counterpart) */}
          <div className="bg-background rounded-lg border border-border p-5 relative overflow-hidden">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
              Walden &middot; Thoreau
            </p>
            <p className="font-serif text-sm text-foreground leading-[1.9]">
              In every grain of sand I see{" "}
              <span
                className="rounded px-0.5"
                style={{ backgroundColor: "rgba(217, 119, 6, 0.22)" }}
              >
                the divine handwriting of a patient hand
              </span>
              . The shoreline remembers the sea, and the sea forgets nothing.
            </p>
            <div
              className="mt-4 rounded-lg border-l-2 p-3 flex gap-2.5"
              style={{ borderColor: AMBER, backgroundColor: "rgba(217, 119, 6, 0.05)" }}
            >
              <div
                className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: AMBER }}
              >
                MP
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <StickyNote className="size-3" style={{ color: AMBER }} />
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: AMBER }}
                  >
                    Your note
                  </span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  Echoes Blake &mdash; to see a world in a grain of sand. Pull
                  this for the essay.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Highlighter className="size-3" style={{ color: AMBER }} />
              <span>Amber = your marks &middot; Indigo = Virgil</span>
            </div>
          </div>
        </div>
      </DemoFrame>
    </TeacherShowcaseShell>
  )
}
