"use client"

/**
 * /virgil deep page — four scripted, self-contained demonstrations of what
 * Virgil does in the reader. Everything is canned (lib/demo/virgil.ts): no
 * network, no AI request, no backend write. Virgil's colour is the indigo
 * `primary` token throughout; the reader's own marks would be amber.
 *
 *   1 · Annotations in Text     — a marked phrase + scholarly note
 *   2 · Hints During Quizzes    — a mini Trial with a scaffolded hint
 *   3 · Assistance in Reading   — select a line → Explain / Who / Why
 *   4 · Understand Your Taste   — "Because you read X, try Y" (opt-in)
 */

import { useEffect, useRef, useState } from "react"
import {
  Sparkles,
  Lightbulb,
  Check,
  X,
  MessageCircleQuestion,
  ArrowRight,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { BookCard } from "@/components/tome/book-card"
import { DEMO_LIBRARY_BOOKS } from "@/lib/demo/data"
import {
  DEMO_PASSAGE,
  DEMO_EXCHANGES,
  streamScriptedReply,
} from "@/lib/demo/virgil"

// ── Shared section shell ────────────────────────────────────────────

function FeatureSection({
  index,
  eyebrow,
  title,
  subline,
  bg = "background",
  children,
}: {
  index: number
  eyebrow: string
  title: string
  subline: string
  bg?: "background" | "muted"
  children: React.ReactNode
}) {
  return (
    <section
      className={
        (bg === "muted" ? "bg-muted" : "bg-background") +
        " px-6 py-20 md:px-12 md:py-28"
      }
    >
      <div className="mx-auto max-w-5xl">
        <BlurFade inView delay={0.05}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {String(index).padStart(2, "0")} · {eyebrow}
          </p>
          <h2 className="mt-2 max-w-2xl font-[var(--font-display)] text-[26px] font-bold leading-[1.1] tracking-tight text-foreground md:text-[36px]">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {subline}
          </p>
        </BlurFade>
        <BlurFade inView delay={0.12}>
          <div className="mt-8">{children}</div>
        </BlurFade>
      </div>
    </section>
  )
}

// ── 1 · Annotations in Text ─────────────────────────────────────────

function AnnotationsInText() {
  return (
    <FeatureSection
      index={1}
      eyebrow="Annotations"
      title="Scholarship in the margin, not the footnotes."
      subline="Virgil marks the phrases that matter and explains them in plain language — right where you're reading, never a tab away."
      bg="background"
    >
      <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-border bg-background">
        <div className="p-6">
          <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            {DEMO_PASSAGE.work} &middot; {DEMO_PASSAGE.locator}
          </p>
          <div className="space-y-0.5 font-serif text-base leading-[1.9] text-foreground">
            <p>{DEMO_PASSAGE.lines[0]}</p>
            <p>
              <span className="rounded bg-primary/15 px-0.5 underline decoration-primary underline-offset-4">
                {DEMO_PASSAGE.marked}
              </span>
              , that brought countless ills
            </p>
            <p>{DEMO_PASSAGE.lines[2]}</p>
          </div>
        </div>
        <div className="border-t border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-full border border-primary/40 bg-primary/15 font-serif text-[10px] font-bold text-primary">
              V
            </div>
            <span className="text-xs font-semibold text-primary">Virgil</span>
            <span className="text-[10px] text-muted-foreground">
              &middot; {DEMO_PASSAGE.annotationLabel}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {DEMO_PASSAGE.annotation}
          </p>
        </div>
      </div>
    </FeatureSection>
  )
}

// ── 2 · Hints During Quizzes ────────────────────────────────────────

const HINT_QUIZ = {
  quote: "To be, or not to be, that is the question.",
  choices: [
    { name: "Hamlet", correct: true },
    { name: "Macbeth", correct: false },
    { name: "Othello", correct: false },
    { name: "King Lear", correct: false },
  ],
  hint: "The speaker is a Danish prince, alone on stage, weighing life against death. The play is named for him.",
}

function HintsDuringQuizzes() {
  const [picked, setPicked] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const answered = picked !== null

  return (
    <FeatureSection
      index={2}
      eyebrow="Quiz Hints"
      title="Stuck on a Trial? Ask for a nudge, not the answer."
      subline="Virgil offers a scaffolded hint that points you back to the text — so you still earn the insight yourself."
      bg="muted"
    >
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Who said it?
        </p>
        <blockquote className="mt-2 font-serif text-lg leading-snug text-foreground">
          &ldquo;{HINT_QUIZ.quote}&rdquo;
        </blockquote>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {HINT_QUIZ.choices.map((c) => {
            const isPicked = picked === c.name
            const state =
              answered && c.correct
                ? "correct"
                : answered && isPicked && !c.correct
                  ? "wrong"
                  : "idle"
            return (
              <button
                key={c.name}
                type="button"
                disabled={answered}
                onClick={() => setPicked(c.name)}
                style={{ borderRadius: "var(--codex-radius-btn)" }}
                className={
                  "flex items-center justify-between border-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                  (state === "correct"
                    ? "border-[var(--codex-success)] bg-[var(--codex-success-soft)] text-[var(--codex-success-text)]"
                    : state === "wrong"
                      ? "border-[var(--codex-danger)] bg-[var(--codex-danger-soft)] text-[var(--codex-danger-text)]"
                      : "border-border bg-background text-foreground hover:border-primary disabled:opacity-60")
                }
              >
                {c.name}
                {state === "correct" && <Check className="size-4" />}
                {state === "wrong" && <X className="size-4" />}
              </button>
            )
          })}
        </div>

        {!showHint ? (
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Lightbulb className="size-3.5" />
            Ask Virgil for a hint
          </button>
        ) : (
          <div className="mt-4 flex gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-primary">Virgil&apos;s hint — </span>
              {HINT_QUIZ.hint}
            </p>
          </div>
        )}
      </div>
    </FeatureSection>
  )
}

// ── 3 · Assistance in Reading ───────────────────────────────────────

const READING_ACTIONS = [
  { label: "Explain this", prompt: DEMO_EXCHANGES[0].prompt },
  { label: "Who is named?", prompt: DEMO_EXCHANGES[1].prompt },
  { label: "Who are they?", prompt: DEMO_EXCHANGES[2].prompt },
]

function AssistanceInReading() {
  const [selected, setSelected] = useState(false)
  const [answer, setAnswer] = useState("")
  const [thinking, setThinking] = useState(false)
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)
  const reducedRef = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined")
      reducedRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
    return () => cancelRef.current?.()
  }, [])

  const run = (label: string, prompt: string) => {
    if (thinking) return
    cancelRef.current?.()
    setActiveLabel(label)
    setAnswer("")
    setThinking(true)
    let acc = ""
    cancelRef.current = streamScriptedReply(
      prompt,
      (chunk) => {
        acc += chunk
        setAnswer(acc)
        setThinking(false)
      },
      () => setThinking(false),
      { reduced: reducedRef.current },
    )
  }

  return (
    <FeatureSection
      index={3}
      eyebrow="Reading Help"
      title="Select a line. Ask Virgil to take it from there."
      subline="Highlight anything that stops you and choose what you need — an explanation, a name, or why it matters."
      bg="background"
    >
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-background p-6">
        <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
          {DEMO_PASSAGE.work} &middot; {DEMO_PASSAGE.locator}
        </p>
        <button
          type="button"
          onClick={() => setSelected((s) => !s)}
          className="block w-full text-left font-serif text-base leading-[1.9] text-foreground focus-visible:outline-none"
          aria-pressed={selected}
        >
          {DEMO_PASSAGE.lines[0]}{" "}
          <span
            className={
              "rounded px-0.5 transition-colors " +
              (selected
                ? "bg-primary/20 underline decoration-primary underline-offset-4"
                : "hover:bg-primary/10")
            }
          >
            son of Peleus, that brought countless ills
          </span>{" "}
          {DEMO_PASSAGE.lines[2]}
        </button>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {selected ? "Line selected — choose what you need:" : "Tap the line to select it."}
        </p>

        {selected && (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {READING_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => run(a.label, a.prompt)}
                  disabled={thinking}
                  className={
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 " +
                    (activeLabel === a.label
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary")
                  }
                >
                  <MessageCircleQuestion className="size-3.5" />
                  {a.label}
                </button>
              ))}
            </div>

            {(answer || thinking) && (
              <div className="mt-4 flex gap-2.5 rounded-lg border border-border bg-card p-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15 font-serif text-[10px] font-bold text-primary">
                  V
                </div>
                <p
                  aria-live="polite"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {answer || "Virgil is considering…"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </FeatureSection>
  )
}

// ── 4 · Understand Your Taste ───────────────────────────────────────

function UnderstandTaste() {
  const [optIn, setOptIn] = useState(true)
  const because = DEMO_LIBRARY_BOOKS.find((b) => b.id === "crime-and-punishment")
  const tryNext = DEMO_LIBRARY_BOOKS.find((b) => b.id === "frankenstein")

  return (
    <FeatureSection
      index={4}
      eyebrow="Your Taste"
      title="Virgil learns what you love — privately."
      subline="From the works you finish, Virgil suggests where to go next. It's opt-in and yours alone; turn it off any time."
      bg="muted"
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 shrink-0 text-primary" />
          Because you read{" "}
          <span className="font-semibold text-foreground">
            {because?.title ?? "Crime and Punishment"}
          </span>
          , try&hellip;
        </div>

        {because && tryNext && (
          <div className="mt-5 flex items-center gap-4 sm:gap-6">
            <div className="w-[130px] shrink-0">
              <BookCard book={because} size="sm" interactive={false} />
            </div>
            <ArrowRight className="size-6 shrink-0 text-primary" />
            <div className="w-[130px] shrink-0">
              <BookCard book={tryNext} size="sm" interactive={false} />
            </div>
          </div>
        )}

        <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm">
          <button
            type="button"
            role="switch"
            aria-checked={optIn}
            onClick={() => setOptIn((v) => !v)}
            className={
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
              (optIn ? "bg-primary" : "bg-muted-foreground/30")
            }
          >
            <span
              className={
                "inline-block size-4 transform rounded-full bg-white transition-transform " +
                (optIn ? "translate-x-4" : "translate-x-0.5")
              }
            />
          </button>
          <span className="text-muted-foreground">
            {optIn
              ? "Tailored suggestions are on — private to you."
              : "Tailored suggestions are off."}
          </span>
        </label>
      </div>
    </FeatureSection>
  )
}

// ── Page body ───────────────────────────────────────────────────────

export function VirgilLanding() {
  return (
    <>
      <AnnotationsInText />
      <HintsDuringQuizzes />
      <AssistanceInReading />
      <UnderstandTaste />
    </>
  )
}
