"use client"

import { motion, AnimatePresence } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { useAnimationLoop } from "./useAnimationLoop"

const PHASES = [
  { name: "reading", duration: 4000 },
  { name: "hover", duration: 2500 },
  { name: "annotate", duration: 4000 },
  { name: "reading2", duration: 3500 },
  { name: "hover2", duration: 2500 },
  { name: "annotate2", duration: 4000 },
  { name: "reset", duration: 600 },
]

const PASSAGE_LINES = [
  "Sing, O goddess, the anger of Achilles",
  "son of Peleus, that brought countless ills",
  "upon the Achaeans. Many a brave soul",
  "did it send hurrying down to Hades,",
  "and many a hero did it yield a prey to dogs",
  "and vultures, for so were the counsels",
  "of Jove fulfilled from the day on which",
]

const ANNOTATIONS = [
  { line: 1, label: "Patronymic", text: "\u201cSon of Peleus\u201d is a patronymic \u2014 an epithet identifying Achilles by his father. Homer uses patronymics to place heroes within their lineage and remind the audience of inherited glory or doom." },
  { line: 3, label: "Hades", text: "Hades refers both to the god of the underworld and to the underworld itself. Homer\u2019s listeners understood death not as an end but as a passage into a shadowy existence \u2014 a fate worse than glory in battle." },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function AnnotationShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showHighlight1 = phase === "hover" || phase === "annotate" || phase === "reading2"
  const showAnnotation1 = phase === "annotate"
  const showHighlight2 = phase === "hover2" || phase === "annotate2"
  const showAnnotation2 = phase === "annotate2"

  if (isReduced) {
    return (
      <AnnotationShell>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-xs text-muted-foreground mb-3">The Iliad &middot; Book I</p>
          <div className="font-serif text-sm text-foreground leading-[1.9]">
            {PASSAGE_LINES.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        </div>
      </AnnotationShell>
    )
  }

  return (
    <AnnotationShell>
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated annotation demonstration"
      >
        <p className="text-xs text-muted-foreground mb-3">The Iliad &middot; Book I</p>

        <div className="font-serif text-sm text-foreground leading-[1.9] mb-4">
          {PASSAGE_LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: phase === "reading" ? i * 0.12 : 0, duration: 0.35, ease: EASE }}
              style={{ willChange: "transform, opacity" }}
            >
              {i === ANNOTATIONS[0].line && showHighlight1 ? (
                <HighlightSpan text={line} />
              ) : i === ANNOTATIONS[1].line && showHighlight2 ? (
                <HighlightSpan text={line} />
              ) : line}
            </motion.p>
          ))}
        </div>

        <AnimatePresence>
          {showAnnotation1 && (
            <VirgilCard label={ANNOTATIONS[0].label} text={ANNOTATIONS[0].text} />
          )}
          {showAnnotation2 && (
            <VirgilCard label={ANNOTATIONS[1].label} text={ANNOTATIONS[1].text} />
          )}
        </AnimatePresence>

      </div>
    </AnnotationShell>
  )
}

function HighlightSpan({ text }: { text: string }) {
  return (
    <motion.span
      initial={{ backgroundColor: "transparent" }}
      animate={{ backgroundColor: "rgba(99,102,241,0.15)" }}
      className="underline decoration-indigo-500 underline-offset-4 px-0.5 rounded"
      transition={{ duration: 0.35, ease: EASE }}
      style={{ willChange: "background-color" }}
    >
      {text}
    </motion.span>
  )
}

function VirgilCard({ label, text }: { label: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-lg border-l-2 border-indigo-500 bg-indigo-500/5 p-4 mt-2"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="size-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[10px] font-serif font-bold text-indigo-500">
          V
        </div>
        <span className="text-xs text-indigo-500 font-semibold">Virgil</span>
        <span className="text-[10px] text-muted-foreground">&middot; {label}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
    </motion.div>
  )
}

function AnnotationShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 items-center">
        <BlurFade delay={0.1} inView>
          {children}
        </BlurFade>
        <div>
          <BlurFade delay={0.15} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-2">
              Read with a scholar beside you.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Virgil&apos;s footnote annotations appear inline as you read &mdash; explaining unfamiliar words, historical context, and literary devices exactly when you need them.
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
