"use client"

import { Send, Sparkles, Highlighter, StickyNote } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

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

const WALDEN_BEFORE = "In every grain of sand I see "
const WALDEN_HIGHLIGHT = "the divine handwriting of a patient hand"
const WALDEN_AFTER = ". The shoreline remembers the sea, and the sea forgets nothing."

const AMBER = "#D97706"

export function MergedVirgilBlock() {
  return (
    <section className="bg-muted py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-10">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-3">
              A scholar in the margin. Your marks beside his.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Tap any annotation to open Virgil&apos;s drawer &mdash; a scholarly note up top, a live chat at the bottom. Highlight what stops you, leave a note for your future self. Virgil is indigo; you are amber. Every mark is indexed and searchable.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Virgil drawer */}
            <div className="bg-card rounded-xl border border-border min-h-[360px] relative overflow-hidden">
              <div className="p-6">
                <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider">
                  The Iliad &middot; Book I
                </p>
                <div className="font-serif text-sm text-foreground leading-[1.9] space-y-0.5">
                  {PASSAGE_LINES.map((line, i) => (
                    <p key={i}>
                      {i === 1 ? (
                        <>
                          <span className="underline decoration-indigo-500 underline-offset-4 rounded bg-indigo-500/15 px-0.5">
                            son of Peleus
                          </span>
                          , that brought countless ills
                        </>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-background border-t border-border shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
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
                <div className="p-3">
                  <div className="mb-3 space-y-2">
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
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5">
                    <Sparkles className="size-3 text-indigo-500 shrink-0" />
                    <span className="text-[11px] text-muted-foreground flex-1 truncate">
                      Ask Virgil about this passage&hellip;
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
              </div>
            </div>

            {/* Right: Amber user highlight + margin note */}
            <div className="bg-card rounded-xl border border-border min-h-[360px] p-6 relative overflow-hidden">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
                Walden &middot; Thoreau
              </p>
              <p className="font-serif text-sm text-foreground leading-[1.9]">
                {WALDEN_BEFORE}
                <span
                  className="rounded px-0.5"
                  style={{ backgroundColor: "rgba(217, 119, 6, 0.22)" }}
                >
                  {WALDEN_HIGHLIGHT}
                </span>
                {WALDEN_AFTER}
              </p>

              <div
                className="mt-4 rounded-lg border-l-2 p-3 flex gap-2.5"
                style={{
                  borderColor: AMBER,
                  backgroundColor: "rgba(217, 119, 6, 0.05)",
                }}
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
                    Echoes Blake &mdash; to see a world in a grain of sand. Pull this for the essay.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Highlighter className="size-3" style={{ color: AMBER }} />
                <span>Amber = your marks &middot; Indigo = Virgil</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Amber = your marks &middot; Indigo = Virgil
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
