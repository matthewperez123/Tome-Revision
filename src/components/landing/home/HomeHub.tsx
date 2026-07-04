"use client"

/**
 * Home hub — the overview that sits below the Barque-of-Dante hero on `/`.
 * Each block is a CONDENSED teaser that reuses a real primitive (BookCard,
 * QuestionCard, SealBase, the scripted Virgil drawer, the pricing data) and
 * links onward to the dedicated page where the full demo lives. It never
 * duplicates a deep-page demo wholesale — it samples one instance and points
 * to depth. All colour/type comes from theme tokens; motion respects
 * prefers-reduced-motion via BlurFade.
 */

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Users, GraduationCap, Check, HelpCircle } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { BookCard } from "@/components/tome/book-card"
import { DEMO_LIBRARY_BOOKS } from "@/lib/demo/data"
import { DemoEconomyProvider } from "@/components/demo/DemoEconomyProvider"
import { QuestionCard } from "@/components/trials/QuestionCard"
import { DEMO_TRIAL_QUESTIONS } from "@/lib/trials/demo-questions"
import { DEMO_PASSAGE, DEMO_EXCHANGES, streamScriptedReply } from "@/lib/demo/virgil"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { getReaderPlans, getEducatorPlans, READER_TRIAL_COPY } from "@/lib/marketing/plans"
import {
  formatBookCount,
  formatTraditionCount,
} from "@/lib/marketing/catalog-stats"
import { useCatalogStats } from "@/lib/marketing/catalog-stats-context"
import { marketingMasterImages } from "@/lib/marketing-images"

// ── Section shell ───────────────────────────────────────────────────

function SectionShell({
  id,
  eyebrow,
  title,
  subline,
  bg = "background",
  cta,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  subline: string
  bg?: "background" | "muted"
  cta: { label: string; href: string }
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={
        bg === "muted"
          ? "bg-muted px-6 py-20 md:px-12 md:py-28"
          : "bg-background px-6 py-20 md:px-12 md:py-28"
      }
    >
      <div className="mx-auto max-w-5xl">
        <BlurFade inView delay={0.05}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-[28px] md:text-[40px] font-bold leading-[1.1] tracking-tight text-foreground max-w-2xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground leading-relaxed">
            {subline}
          </p>
        </BlurFade>

        <BlurFade inView delay={0.12}>
          <div className="mt-8">{children}</div>
        </BlurFade>

        <BlurFade inView delay={0.18}>
          <Link
            href={cta.href}
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {cta.label}
            <ArrowRight className="size-4" />
          </Link>
        </BlurFade>
      </div>
    </section>
  )
}

function MasterHomeImage({
  image,
  priority = false,
  aspectClassName = "aspect-[21/9]",
}: {
  image: (typeof marketingMasterImages)[keyof typeof marketingMasterImages]
  priority?: boolean
  aspectClassName?: string
}) {
  // Full-bleed cover banner: breaks out of the section's horizontal padding
  // and crops to fill the frame (object-cover) so it bleeds to every edge,
  // matching the hero's edge-to-edge cover treatment.
  return (
    <div
      className={
        "relative -mx-6 overflow-hidden border-y border-border bg-card md:-mx-12 " +
        aspectClassName
      }
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
    </div>
  )
}

// ── 2 · Discover the Canon ──────────────────────────────────────────

function DiscoverCanon() {
  const stats = useCatalogStats()
  return (
    <SectionShell
      eyebrow="The Library"
      title="Discover the canon of world literature."
      subline={`${formatBookCount(
        stats.bookCount,
      )} foundational works, every one in the public domain, from Homer to the moderns — organized by the ${formatTraditionCount(
        stats.traditionCount,
      )} that shaped them.`}
      bg="background"
      cta={{ label: "Browse the library", href: "/library/browse" }}
    >
      <div
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 md:-mx-12 md:px-12 [scrollbar-width:thin]"
        role="list"
        aria-label="A sample of the library"
      >
        {DEMO_LIBRARY_BOOKS.map((book) => (
          <div key={book.id} role="listitem" className="w-[150px] shrink-0 snap-start">
            <BookCard book={book} size="sm" interactive={false} />
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

// ── 3 · Answer Quizzes (condensed Trial) ────────────────────────────

function AnswerQuizzes() {
  // A single representative Trial — the whole typed engine lives on /readers.
  const question =
    DEMO_TRIAL_QUESTIONS.find((q) => q.type === "who_said_it") ??
    DEMO_TRIAL_QUESTIONS[0]
  // Bump a key on "Continue" so the same question simply replays in place.
  const [round, setRound] = useState(0)

  return (
    <SectionShell
      eyebrow="Trials"
      title="Every chapter ends in a Trial."
      subline="Comprehension, vocabulary, evidence, and recall — answer to earn Wisdom and keep your Flame alive. This one is live; try it."
      bg="muted"
      cta={{ label: "See every Trial type", href: "/readers" }}
    >
      <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-[440px]">
          <DemoEconomyProvider initialStats={{ xp_total: 120 }}>
            <QuestionCard
              key={`${question.id}-${round}`}
              question={question}
              onNext={() => setRound((r) => r + 1)}
              sound={false}
            />
          </DemoEconomyProvider>
        </div>
      </div>
    </SectionShell>
  )
}

// ── 5 · Guide with Virgil (condensed drawer) ────────────────────────

function GuideWithVirgil() {
  const [answer, setAnswer] = useState("")
  const [thinking, setThinking] = useState(false)
  const [asked, setAsked] = useState<string | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)
  const reducedRef = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined")
      reducedRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
    return () => cancelRef.current?.()
  }, [])

  const ask = (prompt: string) => {
    if (thinking) return
    cancelRef.current?.()
    setAsked(prompt)
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
    <SectionShell
      eyebrow="Virgil"
      title="A scholar in the margin, whenever you need one."
      subline="Tap a phrase and Virgil explains it — grounded in the text beside you. Ask one of his questions to see how it reads."
      bg="muted"
      cta={{ label: "Meet Virgil", href: "/virgil" }}
    >
      <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-border bg-background">
        <div className="p-5">
          <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            {DEMO_PASSAGE.work} &middot; {DEMO_PASSAGE.locator}
          </p>
          <div className="space-y-0.5 font-serif text-sm leading-[1.9] text-foreground">
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

        <div className="border-t border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Image
              src={marketingMasterImages.virgil.src}
              alt={marketingMasterImages.virgil.alt}
              width={marketingMasterImages.virgil.width}
              height={marketingMasterImages.virgil.height}
              className="size-6 rounded-full border border-primary/40 object-cover"
            />
            <span className="text-xs font-semibold text-primary">Virgil</span>
            <span className="text-[10px] text-muted-foreground">
              &middot; {DEMO_PASSAGE.annotationLabel}
            </span>
          </div>
          <p
            aria-live="polite"
            className="min-h-[3.5rem] text-xs leading-relaxed text-muted-foreground"
          >
            {asked
              ? answer || (thinking ? "Virgil is considering…" : "")
              : DEMO_PASSAGE.annotation}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {DEMO_EXCHANGES.map((e) => (
              <button
                key={e.prompt}
                type="button"
                onClick={() => ask(e.prompt)}
                disabled={thinking}
                className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <Sparkles className="size-2.5 shrink-0" />
                {e.prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

// ── 6 · Invite Friends (Circles preview) ────────────────────────────

const FRIEND_AVATARS = [
  { imageUrl: "https://avatar.vercel.sh/ada.png", profileUrl: "#" },
  { imageUrl: "https://avatar.vercel.sh/byron.png", profileUrl: "#" },
  { imageUrl: "https://avatar.vercel.sh/colette.png", profileUrl: "#" },
  { imageUrl: "https://avatar.vercel.sh/dante.png", profileUrl: "#" },
  { imageUrl: "https://avatar.vercel.sh/eliot.png", profileUrl: "#" },
]

function InviteFriends() {
  return (
    <SectionShell
      eyebrow="Circles"
      title="Read together. Win it back as a generation."
      subline="Invite friends into a Circle, compare Flames and Seals, and trade recommendations. Reading is better when it's shared."
      bg="background"
      cta={{ label: "Start a Circle", href: "/readers" }}
    >
      <div className="flex flex-col items-start gap-5 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <AvatarCircles avatarUrls={FRIEND_AVATARS} numPeople={12} />
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Users className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            <span className="font-semibold text-foreground">
              Ada, Byron, and 15 others
            </span>{" "}
            are reading the canon in your Circle this week.
          </p>
        </div>
      </div>
    </SectionShell>
  )
}

// ── 7 · Teach Classes (teacher teaser) ──────────────────────────────

const TEACHER_POINTS = [
  "Assign books and chapters to a class",
  "Auto-graded Trials and a live gradebook",
  "Virgil-assisted reflection grading",
  "A searchable parent directory",
]

function TeachClasses() {
  return (
    <SectionShell
      eyebrow="For Teachers"
      title="Bring the canon to your classroom."
      subline="Assign, track, and grade — Tome handles the busywork so you can teach the books. Built for one class or a whole district."
      bg="muted"
      cta={{ label: "Explore for teachers", href: "/educators" }}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {TEACHER_POINTS.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-4 text-sm text-foreground"
          >
            <GraduationCap className="mt-0.5 size-4 shrink-0 text-primary" />
            {point}
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}

// ── 8 · Pricing teaser ──────────────────────────────────────────────

function PricingTeaser() {
  const stats = useCatalogStats()
  const readerPlans = getReaderPlans(stats)
  const educatorPlans = getEducatorPlans()
  const solo = readerPlans.find((p) => p.id === "solo")
  const family = readerPlans.find((p) => p.id === "family")
  const school = educatorPlans.find((p) => p.id === "school")
  const cards = [solo, family, school].filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  )

  return (
    <SectionShell
      eyebrow="Pricing"
      title="Start free. Upgrade when you're ready."
      subline={`Solo and Family for readers, plans for schools and districts. ${READER_TRIAL_COPY}`}
      bg="background"
      cta={{ label: "See full pricing", href: "/pricing" }}
    >
      <MasterHomeImage image={marketingMasterImages.pricing} aspectClassName="aspect-[21/8]" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((plan) => (
          <div
            key={plan.id}
            className={
              "flex flex-col rounded-xl border bg-card p-5 " +
              (plan.featured
                ? "border-primary shadow-[0_0_0_1px_var(--codex-primary)]"
                : "border-border")
            }
          >
            {plan.badge && (
              <span className="mb-2 inline-flex w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {plan.badge}
              </span>
            )}
            <h3 className="font-[var(--font-display)] text-lg font-bold text-foreground">
              {plan.name}
            </h3>
            {plan.monthly && (
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">
                  {plan.monthly.price}
                </span>{" "}
                {plan.monthly.cadence}
              </p>
            )}
            <ul className="mt-4 flex flex-col gap-2">
              {plan.features.slice(0, 4).map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

// ── 9 · FAQ teaser ─────────────────────────────────────────────────

const FAQ_POINTS = [
  "Reading and getting started",
  "Plans, billing, and trials",
  "Classroom and school use",
  "Texts, trust, and sources",
]

function FaqTeaser() {
  return (
    <SectionShell
      eyebrow="FAQ"
      title="Questions, answered before you begin."
      subline="A quiet place for the practical details: how Tome works, what is free, how classrooms start, and where the texts come from."
      bg="muted"
      cta={{ label: "Read the FAQ", href: "/faq" }}
    >
      <MasterHomeImage image={marketingMasterImages.faq} aspectClassName="aspect-[16/7]" />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {FAQ_POINTS.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground"
          >
            <HelpCircle className="mt-0.5 size-4 shrink-0 text-primary" />
            {point}
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}

// ── Hub ─────────────────────────────────────────────────────────────

export function HomeHub() {
  return (
    <>
      <DiscoverCanon />
      <AnswerQuizzes />
      <GuideWithVirgil />
      <InviteFriends />
      <TeachClasses />
      <PricingTeaser />
      <FaqTeaser />
    </>
  )
}
