"use client"

import { motion, AnimatePresence } from "motion/react"
import { Send, Sparkles } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { useAnimationLoop } from "./useAnimationLoop"

// Reader-side loop target: ~5s per cycle.
const PHASES = [
  { name: "read", duration: 900 },
  { name: "tap", duration: 800 },
  { name: "drawer", duration: 1400 },
  { name: "ask", duration: 1600 },
  { name: "reset", duration: 400 },
]

const PASSAGE_LINES = [
  "Sing, O goddess, the anger of Achilles",
  "son of Peleus, that brought countless ills",
  "upon the Achaeans.",
]

const ANNOTATION = {
  label: "Patronymic",
  body:
    "\u201cSon of Peleus\u201d is a patronymic \u2014 an epithet identifying Achilles by his father. Homer uses patronymics to place heroes within their lineage and remind the audience of inherited glory or doom.",
}

const CHAT_Q = "Why open with Achilles' anger?"
const CHAT_A =
  "The anger is the engine of the epic. Homer frames the entire Iliad around a single wound to honor."

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function AnnotationShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showHighlight = phase === "tap" || phase === "drawer" || phase === "ask"
  const showDrawer = phase === "drawer" || phase === "ask"
  const showChat = phase === "ask"

  if (isReduced) {
    return (
      <Shell>
        <StaticMockup />
      </Shell>
    )
  }

  return (
    <Shell>
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border min-h-[340px] relative overflow-hidden"
        aria-label="Unified Virgil drawer demonstration"
      >
        {/* Passage */}
        <div className="p-6">
          <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider">
            The Iliad &middot; Book I
          </p>
          <div className="font-serif text-sm text-foreground leading-[1.9] space-y-0.5">
            {PASSAGE_LINES.map((line, i) => (
              <p key={i}>
                {i === 1 && showHighlight ? (
                  <>
                    <motion.span
                      initial={{ backgroundColor: "transparent" }}
                      animate={{ backgroundColor: "rgba(99,102,241,0.18)" }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="underline decoration-indigo-500 underline-offset-4 rounded"
                    >
                      son of Peleus
                    </motion.span>
                    , that brought countless ills
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
        </div>

        {/* Bottom sheet drawer */}
        <AnimatePresence>
          {showDrawer && (
            <motion.div
              key="drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-x-0 bottom-0 rounded-t-xl bg-background border-t border-border shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
              style={{ willChange: "transform" }}
            >
              {/* Drawer header — annotation */}
              <div className="px-5 pt-4 pb-3 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-5 rounded-full bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-[10px] font-serif font-bold text-indigo-500">
                    V
                  </div>
                  <span className="text-xs font-semibold text-indigo-500">
                    Virgil
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    &middot; {ANNOTATION.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ANNOTATION.body}
                </p>
              </div>

              {/* Chat footer */}
              <div className="p-3">
                <AnimatePresence>
                  {showChat && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="mb-3 space-y-2"
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div className="flex justify-end">
                        <div className="rounded-2xl rounded-br-sm bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-[11px] text-foreground max-w-[80%]">
                          {CHAT_Q}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-5 rounded-full bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-[9px] font-serif font-bold text-indigo-500 shrink-0 mt-0.5">
                          V
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-muted border border-border px-3 py-1.5 text-[11px] text-muted-foreground leading-relaxed max-w-[85%]">
                          {CHAT_A}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5">
                  <Sparkles className="size-3 text-indigo-500 shrink-0" />
                  <span className="text-[11px] text-muted-foreground flex-1 truncate">
                    Ask Virgil about this passage…
                  </span>
                  <button
                    type="button"
                    className="size-5 rounded-full bg-indigo-500 flex items-center justify-center"
                    aria-hidden
                  >
                    <Send className="size-2.5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  )
}

function StaticMockup() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider">
        The Iliad &middot; Book I
      </p>
      <div className="font-serif text-sm text-foreground leading-[1.9] space-y-0.5 mb-4">
        {PASSAGE_LINES.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="rounded-lg border-l-2 border-indigo-500 bg-indigo-500/5 p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="size-5 rounded-full bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-[10px] font-serif font-bold text-indigo-500">
            V
          </div>
          <span className="text-xs font-semibold text-indigo-500">Virgil</span>
          <span className="text-[10px] text-muted-foreground">
            &middot; {ANNOTATION.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {ANNOTATION.body}
        </p>
      </div>
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 items-center">
        <BlurFade delay={0.1} inView>
          {children}
        </BlurFade>
        <div>
          <BlurFade delay={0.15} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-2">
              A scholar in the margin.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Tap any annotation to open Virgil&apos;s drawer: a scholarly
              note at the top, a live chat footer at the bottom. Read the
              footnote, ask a follow-up, keep reading.
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
