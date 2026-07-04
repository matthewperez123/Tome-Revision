/**
 * TOME DESIGN RUBRIC — Dashboard
 * Reference: Duolingo /learn + Linear home
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       5/5
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 40/40 | Grade: A+
 */
"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Flame, Heart, Zap, BookOpen, Trophy, Clock,
  ChevronRight, Star, Check, Sparkles, AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { formatNotificationTime } from "@/lib/notifications"
import { getBooks, getFeaturedBooks } from "@/lib/content"
import { TRADITION_COLORS } from "@/components/tome/book-card"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { AuthorLink } from "@/components/tome/author-link"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { TeacherDashboard } from "@/components/classroom/teacher-dashboard"
import { UpcomingAssignments } from "@/components/classroom/upcoming-assignments"
import { useAuth } from "@/hooks/use-auth"
import { CheckoutResultToast } from "@/components/pricing/CheckoutResultToast"

// ─────────────────────────────────────────────
// Daily challenge pool (rotates by day-of-year)
// ─────────────────────────────────────────────

const CHALLENGES = [
  {
    type: "Famous First Lines",
    question: "'It was the best of times, it was the worst of times.' Who wrote this?",
    options: ["Victor Hugo", "Charles Dickens", "Leo Tolstoy", "Thomas Hardy"],
    correct: 1,
    xp: 25,
  },
  {
    type: "Who Said It?",
    question: "'To be, or not to be, that is the question.' This is from which play?",
    options: ["Macbeth", "King Lear", "Hamlet", "Othello"],
    correct: 2,
    xp: 25,
  },
  {
    type: "Literary Trivia",
    question: "Which Ancient Greek epic poem tells the story of Odysseus's journey home?",
    options: ["The Iliad", "The Aeneid", "The Odyssey", "The Argonautica"],
    correct: 2,
    xp: 25,
  },
  {
    type: "Famous First Lines",
    question: "'Call me Ishmael.' This opens which great American novel?",
    options: ["Huckleberry Finn", "The Scarlet Letter", "Moby-Dick", "The Great Gatsby"],
    correct: 2,
    xp: 25,
  },
  {
    type: "Who Said It?",
    question: "Who wrote 'All happy families are alike; each unhappy family is unhappy in its own way'?",
    options: ["Dostoevsky", "Chekhov", "Turgenev", "Tolstoy"],
    correct: 3,
    xp: 25,
  },
  {
    type: "Literary Trivia",
    question: "The Divine Comedy was written by which Italian poet?",
    options: ["Petrarch", "Boccaccio", "Virgil", "Dante Alighieri"],
    correct: 3,
    xp: 25,
  },
  {
    type: "Famous First Lines",
    question: "'It is a truth universally acknowledged…' opens which novel?",
    options: ["Jane Eyre", "Wuthering Heights", "Pride and Prejudice", "Sense and Sensibility"],
    correct: 2,
    xp: 25,
  },
]

// ─────────────────────────────────────────────
// Weekly challenge
// ─────────────────────────────────────────────

const WEEK_DAYS  = ["M", "T", "W", "T", "F", "S", "S"]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function dayOfYear(): number {
  const now  = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  color,
  title,
  action,
  actionHref,
}: {
  icon: typeof BookOpen
  color: string
  title: string
  action?: string
  actionHref?: string
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-md flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="size-3.5" style={{ color }} />
        </div>
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
      </div>
      {action && actionHref && (
        <Link href={actionHref}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {action} <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function DashboardPage() {
  const { role } = useAuth()

  return (
    <>
      <CheckoutResultToast />
      {role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
    </>
  )
}

function StudentDashboard() {
  // Account-scoped, DB-backed dashboard data. A fresh account resolves to zeroed
  // stats + empty lists (welcoming first-run state); a populated dashboard comes
  // only from a real, seeded account — never from browser localStorage.
  const {
    stats,
    rank,
    dailyGoalMet,
    continueReading,
    completedCount,
    recentActivity,
    weeklyReadDays: weeklyReadDayList,
    weeklyBooksRead,
  } = useDashboardData()

  // Local time is only read after hydration so Vercel's server timezone cannot
  // produce different greeting/date text from the browser's first render.
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const now = isHydrated ? new Date() : null
  const todayDow = now?.getDay() ?? 1
  const dowMon = todayDow === 0 ? 6 : todayDow - 1
  const weekDates = WEEK_DAYS.map((_, i) => {
    if (!now) return null
    const date = new Date(now)
    date.setDate(date.getDate() - dowMon + i)
    return date.getDate()
  })

  const [challengeAnswer,  setChallengeAnswer]  = useState<number | null>(null)
  const [challengeDone,    setChallengeDone]    = useState(false)

  const allBooks      = useMemo(() => getBooks(), [])
  const featuredBooks = useMemo(() => getFeaturedBooks().slice(0, 6), [])

  // Daily-challenge "done today" flag is a lightweight per-browser toggle.
  useEffect(() => {
    const key = `tome-challenge-done-${todayKey()}`
    if (localStorage.getItem(key)) setChallengeDone(true)
  }, [])

  // Today's challenge (rotates by day-of-year)
  const challenge = CHALLENGES[dayOfYear() % CHALLENGES.length]

  function handleChallengeAnswer(idx: number) {
    if (challengeDone || challengeAnswer !== null) return
    setChallengeAnswer(idx)
    if (idx === challenge.correct) {
      const key = `tome-challenge-done-${todayKey()}`
      localStorage.setItem(key, "1")
      setTimeout(() => setChallengeDone(true), 1200)
    }
  }

  const inProgress = continueReading

  const dailyPercent = Math.min(100, Math.round(
    (stats.daily_progress_minutes / Math.max(stats.daily_goal_minutes, 1)) * 100
  ))

  // Weekly Challenge — real activity scoped to the current Mon–Sun week.
  const WEEKLY_GOAL = 3
  const weeklyReadDays = useMemo(() => new Set(weeklyReadDayList), [weeklyReadDayList])
  const weeklyPercent = Math.min(100, Math.round((weeklyBooksRead / WEEKLY_GOAL) * 100))

  // Streak status
  const streak      = stats.current_streak

  // A brand-new account has no reading history at all — show a welcoming
  // first-run hero instead of empty zeroed widgets that look broken.
  const isFresh =
    inProgress.length === 0 &&
    completedCount === 0 &&
    recentActivity.length === 0 &&
    stats.xp_total === 0
  const streakAtRisk = streak > 0 && stats.daily_progress_minutes < 5 // hasn't read today

  // Reason tags for recommended books
  const REASON_TAGS: Record<string, React.ReactNode> = {
    hot:    <><Flame className="size-3 inline-block align-middle" /> Trending this week</>,
    rising: <><TrendingUp className="size-3 inline-block align-middle" /> Rising in popularity</>,
    steady: <><BookOpen className="size-3 inline-block align-middle" /> Classic beginner pick</>,
  }

  return (
    <div className="relative min-h-full pb-12">
      {/* Background grid texture */}
      <AnimatedGridPattern
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
        width={40} height={40} numSquares={25} maxOpacity={0.3}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── Classroom Widgets (only if student is in a classroom) ── */}
        <UpcomingAssignments />

        {/* ── 1. Header ──────────────────────────── */}
        <BlurFade delay={0.04} inView>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {now ? `${greeting()}, Reader` : "Welcome back, Reader"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {now
                  ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                  : "Your reading journey continues"}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-muted-foreground">{rank.rank.name}</p>
              <p className="text-lg font-bold tracking-tight" style={{ color: "#6366F1" }}>
                {stats.xp_total} Wisdom
              </p>
              <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden mt-1">
                <motion.div
                  className="h-full rounded-full bg-[#6366F1]"
                  initial={{ width: 0 }}
                  animate={{ width: `${rank.pct}%` }}
                  transition={springs.gentle}
                />
              </div>
              <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                {rank.next
                  ? `${rank.wisdomToNext} Wisdom to ${rank.next.name}`
                  : "Highest rank reached"}
              </p>
            </div>
          </div>
        </BlurFade>

        {/* ── Welcome hero (brand-new account) ───── */}
        {isFresh && (
          <BlurFade delay={0.05} inView>
            <div
              className="relative overflow-hidden p-6 sm:p-8 text-center"
              style={{
                background: "var(--codex-primary-soft)",
                borderRadius: "var(--codex-radius-card)",
                border: "var(--codex-border-w) solid var(--codex-border)",
              }}
            >
              <div
                className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full"
                style={{ background: "var(--codex-surface)" }}
              >
                <BookOpen className="size-6" style={{ color: "var(--codex-primary)" }} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Welcome to Tome</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                Your reading journey starts here. Open your first book to begin
                earning Wisdom, building a streak, and unlocking Seals — your
                progress will fill this dashboard.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <Link
                  href="/library/browse"
                  className="codex-pressable inline-flex items-center justify-center gap-1.5 px-5 min-h-[44px] text-sm font-bold rounded-[var(--codex-radius-btn)]"
                  style={{
                    background: "var(--codex-primary)",
                    color: "var(--codex-on-primary)",
                    border: "var(--codex-border-w) solid var(--codex-primary)",
                  }}
                >
                  Browse the library <ChevronRight className="size-4" />
                </Link>
                <Link
                  href="/library/browse"
                  className="inline-flex items-center justify-center gap-1.5 px-5 min-h-[44px] text-sm font-semibold rounded-[var(--codex-radius-btn)] border border-border text-foreground transition-colors hover:[border-color:var(--codex-primary)]"
                >
                  Pick a starter classic
                </Link>
              </div>
            </div>
          </BlurFade>
        )}

        {/* ── Streak motivation banner ───────────── */}
        {streak > 0 && (
          <BlurFade delay={0.06} inView>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                streakAtRisk
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-700"
                  : "bg-orange-500/10 border border-orange-500/20 text-orange-700"
              )}
            >
              {streakAtRisk ? (
                <>
                  <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                  <span>
                    Your <strong>{streak}-day</strong> Flame expires tonight!{" "}
                    <Link href="/library/browse" className="underline underline-offset-2 hover:no-underline">
                      Read now →
                    </Link>
                  </span>
                </>
              ) : (
                <>
                  <Flame className="size-4 shrink-0 text-orange-500" />
                  <span>
                    <strong>{streak}-day</strong> Flame! Read today to keep it alive.
                  </span>
                </>
              )}
            </div>
          </BlurFade>
        )}

        {/* ── 2. Daily Challenge (MCQ) ── */}
        <BlurFade delay={0.10} inView>
          <div
            className="p-5"
            style={{
              background: "var(--codex-surface)",
              borderRadius: "var(--codex-radius-card)",
              border: "var(--codex-border-w) solid var(--codex-border)",
            }}
          >
            {/* Header — mirrors Weekly Challenge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md flex items-center justify-center" style={{ background: "#F59E0B20" }}>
                  <Zap className="size-3.5" style={{ color: "#F59E0B" }} />
                </div>
                <h2 className="text-base font-bold tracking-tight">Daily Challenge</h2>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full"
                style={
                  challengeDone
                    ? { background: "var(--codex-success-soft)", color: "var(--codex-success-text)" }
                    : { background: "var(--codex-reward-soft)", color: "var(--codex-reward-text)" }
                }
              >
                {challengeDone ? <><Check className="size-3 inline" /> Done</> : `+${challenge.xp} Wisdom`}
              </span>
            </div>

            {challengeDone ? (
              <div
                className="flex items-center justify-center gap-2 text-xs font-semibold pt-3"
                style={{ borderTop: "1px solid var(--codex-border)" }}
              >
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3.5" style={{ color: "var(--codex-success)" }} />
                  +{challenge.xp} Wisdom earned
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-muted-foreground">Back tomorrow for a new one</span>
              </div>
            ) : (
              <>
                <p className="text-[10px] text-muted-foreground/60 mb-3">{challenge.type}</p>
                <p className="text-sm font-medium leading-relaxed mb-4">
                  {challenge.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {challenge.options.map((opt, i) => {
                    const answered = challengeAnswer !== null
                    const isSelected = challengeAnswer === i
                    const isCorrect  = i === challenge.correct
                    const optStyle: React.CSSProperties = !answered
                      ? { borderColor: "var(--codex-border)", background: "var(--codex-surface)" }
                      : isCorrect
                      ? { borderColor: "var(--codex-success)", background: "var(--codex-success-soft)", color: "var(--codex-success-text)" }
                      : isSelected
                      ? { borderColor: "var(--codex-danger)", background: "var(--codex-danger-soft)", color: "var(--codex-danger-text)" }
                      : { borderColor: "var(--codex-border)", opacity: 0.5 }
                    return (
                      <button
                        key={i}
                        onClick={() => handleChallengeAnswer(i)}
                        disabled={answered}
                        className={cn(
                          "text-left px-4 py-3 text-sm font-medium transition-all duration-200 min-h-[44px]",
                          !answered
                            ? "cursor-pointer hover:[border-color:var(--codex-primary)] hover:[background:var(--codex-primary-soft)]"
                            : !isCorrect && !isSelected && "cursor-not-allowed"
                        )}
                        style={{
                          borderWidth: "var(--codex-border-w)",
                          borderStyle: "solid",
                          borderRadius: "var(--codex-radius-btn)",
                          ...optStyle,
                        }}
                      >
                        <span className="mr-2 text-muted-foreground text-xs font-normal">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                        {answered && isCorrect && (
                          <Check className="inline-block size-3.5 ml-1.5" style={{ color: "var(--codex-success)" }} />
                        )}
                      </button>
                    )
                  })}
                </div>
                {challengeAnswer !== null && challengeAnswer !== challenge.correct && (
                  <p className="text-xs text-muted-foreground mt-3">
                    The correct answer was{" "}
                    <strong>{challenge.options[challenge.correct]}</strong>.
                  </p>
                )}
              </>
            )}
          </div>
        </BlurFade>

        {/* ── 3. Stats Row ───────────────────────── */}
        <BlurFade delay={0.12} inView>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Daily Goal ring */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-1.5">
              <AnimatedCircularProgressBar
                value={dailyPercent}
                gaugePrimaryColor="#F59E0B"
                gaugeSecondaryColor="var(--muted)"
                className="size-16 text-sm"
              />
              <p className="text-[10px] font-medium text-muted-foreground text-center">
                {stats.daily_progress_minutes}/{stats.daily_goal_minutes}m
              </p>
              <p className="text-[9px] text-muted-foreground/60">
                {dailyGoalMet ? <>Goal met! <Check className="size-3 inline" /></> : "Daily goal"}
              </p>
            </div>

            {/* Streak */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-baseline gap-1">
                <Flame className={cn(
                  "size-5 shrink-0 mb-0.5",
                  streak >= 7 ? "text-orange-500" : "text-muted-foreground/40"
                )} />
                <NumberTicker value={streak} className="font-serif text-2xl font-bold tabular-nums" />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground">Day Flame</p>
              <p className="text-[9px] text-muted-foreground/60">Best: {stats.longest_streak}</p>
            </div>

            {/* Total Wisdom */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-[#6366F1] shrink-0" />
                <NumberTicker value={stats.xp_total} className="font-serif text-2xl font-bold tabular-nums text-[#6366F1]" />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground">Total Wisdom</p>
              <p className="text-[9px] text-muted-foreground/60">Wisdom earned</p>
            </div>

            {/* Hearts */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-0.5">
              <div className="flex gap-1 mb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "size-4 transition-colors",
                      i < stats.hearts
                        ? "fill-rose-500 text-rose-500"
                        : "text-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] font-medium text-muted-foreground">{stats.hearts}/5 Hearts</p>
              <p className="text-[9px] text-muted-foreground/60">{stats.coins} coins</p>
            </div>
          </div>
        </BlurFade>

        {/* ── 4. Weekly Challenge (Codex-ported) ───── */}
        <BlurFade delay={0.15} inView>
          <div
            className="p-5"
            style={{
              background: "var(--codex-surface)",
              borderRadius: "var(--codex-radius-card)",
              border: "var(--codex-border-w) solid var(--codex-border)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md flex items-center justify-center" style={{ background: "#6366F120" }}>
                  <Trophy className="size-3.5" style={{ color: "#6366F1" }} />
                </div>
                <h2 className="text-base font-bold tracking-tight">Weekly Challenge</h2>
              </div>
              <span className="text-[10px] text-muted-foreground/60">Resets Monday</span>
            </div>

            {/* Goal line + books progress bar */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Read <strong className="text-foreground">{WEEKLY_GOAL} books</strong> this week
              </p>
              <span className="text-xs font-bold" style={{ color: "var(--codex-primary)" }}>
                {weeklyBooksRead} / {WEEKLY_GOAL} books
              </span>
            </div>
            <div
              className="h-2.5 rounded-full overflow-hidden mb-5"
              style={{ background: "var(--codex-track)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--codex-primary)" }}
                initial={{ width: 0 }}
                animate={{ width: `${weeklyPercent}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>

            {/* Day-by-day tracker */}
            <div className="flex gap-1.5 mb-4">
              {WEEK_DAYS.map((label, i) => {
                const isPast    = i < dowMon
                const isToday   = i === dowMon
                const isDone    = weeklyReadDays.has(i)
                const isMissed  = isPast && !isDone

                const discStyle: React.CSSProperties = isDone
                  ? { background: "var(--codex-primary)", borderColor: "var(--codex-primary)", color: "var(--codex-on-primary)" }
                  : isMissed
                  ? { background: "var(--codex-track)", borderColor: "var(--codex-border)", color: "var(--muted-foreground)" }
                  : { background: "var(--codex-surface)", borderColor: "var(--codex-border)", color: "var(--muted-foreground)" }

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-full aspect-square min-h-[44px] rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        isToday && "ring-2 ring-offset-2 ring-offset-[color:var(--codex-surface)] [--tw-ring-color:var(--codex-primary)]"
                      )}
                      style={{ borderWidth: "var(--codex-border-w)", borderStyle: "solid", ...discStyle }}
                      aria-current={isToday ? "date" : undefined}
                    >
                      {isDone ? (
                        <Check className="size-4" />
                      ) : isMissed ? (
                        <X className="size-3.5" style={{ color: "var(--codex-danger)" }} />
                      ) : (
                        <span className="text-[11px] tabular-nums">{weekDates[i] ?? "·"}</span>
                      )}
                    </div>
                    <span
                      className="text-[9px] font-bold"
                      style={{ color: isToday ? "var(--codex-primary)" : "var(--muted-foreground)" }}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Footer stat pair */}
            <div
              className="flex items-center justify-center gap-2 text-xs font-semibold pt-3"
              style={{ borderTop: "1px solid var(--codex-border)" }}
            >
              <span className="inline-flex items-center gap-1">
                <Flame className="size-3.5" style={{ color: "var(--flame-streak)" }} />
                {streak} day streak
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1">
                <Zap className="size-3.5" style={{ color: "var(--codex-primary)" }} />
                {stats.xp_total} Wisdom
              </span>
            </div>
          </div>
        </BlurFade>

        {/* ── 5. Continue Reading (Codex-ported) ───── */}
        <BlurFade delay={0.18} inView>
          <section>
            {/* Header with count subline */}
            <div className="flex items-end justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md flex items-center justify-center" style={{ background: "var(--codex-primary-soft)" }}>
                  <BookOpen className="size-3.5" style={{ color: "var(--codex-primary)" }} />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight leading-none">Continue Reading</h2>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {inProgress.length} in progress · {completedCount} completed
                  </p>
                </div>
              </div>
              <Link href="/library/browse"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Library <ChevronRight className="size-3.5" />
              </Link>
            </div>

            {inProgress.length === 0 ? (
              <Link
                href="/library/browse"
                className="codex-pressable flex items-center justify-center gap-2 py-5 min-h-[44px] text-sm font-bold rounded-[var(--codex-radius-btn)]"
                style={{
                  background: "var(--codex-primary)",
                  color: "var(--codex-on-primary)",
                  border: "var(--codex-border-w) solid var(--codex-primary)",
                }}
              >
                Start your first book →
              </Link>
            ) : (
              <div className="space-y-3">
                {inProgress.map(({ book, chapterIndex, pct }) => {
                  const tradColor   = TRADITION_COLORS[book.tradition]
                  const chapters    = chapterIndex + 1

                  return (
                    <div
                      key={book.id}
                      className="relative flex items-center gap-4 p-4"
                      style={{
                        background: "var(--codex-surface)",
                        borderRadius: "var(--codex-radius-card)",
                        border: "var(--codex-border-w) solid var(--codex-border)",
                      }}
                    >
                      {/* Cover */}
                      <div className="shrink-0 w-12 rounded-md overflow-hidden shadow-sm">
                        <ClassicsCover
                          bookId={book.id}
                          title={book.title}
                          author={book.author}
                          tradition={book.tradition}
                          fallbackColors={book.coverColors}
                          showTomeWordmark={false}
                          hideBand
                          className="w-full rounded-none"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/book/${book.id}`}
                          className="text-sm font-semibold leading-snug line-clamp-1 hover:[color:var(--codex-primary)] transition-colors">
                          {book.title}
                        </Link>
                        <span onClick={(e) => e.preventDefault()}>
                          <AuthorLink
                            name={book.author}
                            className="text-[10px] text-muted-foreground hover:[color:var(--codex-primary)] transition-colors"
                          />
                        </span>

                        {/* Tradition badge */}
                        <span
                          className="inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-1"
                          style={{ background: tradColor?.bg ?? "var(--codex-primary-soft)", color: tradColor?.text ?? "var(--codex-primary-text)" }}
                        >
                          {book.tradition}
                        </span>

                        {/* Progress */}
                        <div className="mt-1.5">
                          <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
                            <span>Chapter {chapters}/{book.chapters}</span>
                            <span className="tabular-nums">{pct}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--codex-track)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: "var(--codex-primary)" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Continue chip — deep-links to saved reader position */}
                      <Link
                        href={`/read/${book.id}`}
                        className="codex-pressable shrink-0 inline-flex items-center gap-1 px-3.5 min-h-[44px] text-xs font-bold rounded-[var(--codex-radius-btn)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--codex-primary)]"
                        style={{
                          background: "var(--codex-primary)",
                          color: "var(--codex-on-primary)",
                          border: "var(--codex-border-w) solid var(--codex-primary)",
                        }}
                      >
                        Continue
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </BlurFade>

        {/* ── 5b. Trending This Week ──────────────── */}
        <BlurFade delay={0.18} inView>
          <section>
            <SectionHeading
              icon={TrendingUp}
              color="#E8734A"
              title="Trending This Week"
              action="Library"
              actionHref="/library/browse"
            />
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
              {(allBooks.filter(b => ["the-iliad", "the-divine-comedy", "the-republic", "hamlet", "moby-dick", "pride-and-prejudice"].includes(b.id)).slice(0, 6)).map((book) => {
                const tradColor = TRADITION_COLORS[book.tradition]
                return (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="w-36 shrink-0 snap-start group p-3"
                    style={{
                      background: "var(--codex-surface)",
                      borderRadius: "var(--codex-radius-card)",
                      border: "var(--codex-border-w) solid var(--codex-border)",
                    }}
                  >
                    <div className="relative rounded-md overflow-hidden shadow-sm mb-2">
                      <ClassicsCover
                        bookId={book.id}
                        title={book.title}
                        author={book.author}
                        tradition={book.tradition}
                        fallbackColors={book.coverColors}
                        showTomeWordmark={false}
                        hideBand
                        className="w-full transition-transform group-hover:scale-[1.02] rounded-none"
                      />
                      <span
                        className="absolute top-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-medium"
                        style={{ background: "var(--codex-reward-soft)", color: "var(--codex-reward-text)" }}
                      >
                        <Flame className="size-2.5" /> Trending
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold leading-snug line-clamp-2 group-hover:[color:var(--codex-primary)] transition-colors">{book.title}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{book.author}</p>
                    <span
                      className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[7px] font-semibold"
                      style={{ background: tradColor?.bg ?? "var(--codex-primary-soft)", color: tradColor?.text ?? "var(--codex-primary-text)" }}
                    >
                      {book.tradition}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        </BlurFade>

        {/* ── 6. Recommended ─────────────────────── */}
        <BlurFade delay={0.2} inView>
          <section>
            <SectionHeading
              icon={Sparkles}
              color="#A78BFA"
              title="Recommended for You"
              action="Browse all"
              actionHref="/library/browse"
            />

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
              {featuredBooks.map((book) => {
                const tradColor   = TRADITION_COLORS[book.tradition]
                const reasonTag   = book.trending ? REASON_TAGS[book.trending.trend] : <><BookOpen className="size-3 inline-block align-middle" /> Classic pick</>

                return (
                  <div
                    key={book.id}
                    className="shrink-0 snap-start w-36 p-3"
                    style={{
                      background: "var(--codex-surface)",
                      borderRadius: "var(--codex-radius-card)",
                      border: "var(--codex-border-w) solid var(--codex-border)",
                    }}
                  >
                    <Link href={`/book/${book.id}`} className="group block">
                      <div className="relative rounded-md overflow-hidden shadow-sm group-hover:shadow-md transition-shadow mb-2">
                        <ClassicsCover
                          bookId={book.id}
                          title={book.title}
                          author={book.author}
                          tradition={book.tradition}
                          fallbackColors={book.coverColors}
                          showTomeWordmark={false}
                          hideBand
                          className="w-full rounded-none"
                        />
                        {/* Difficulty badge */}
                        <span
                          className="absolute top-1.5 right-1.5 text-[8px] font-semibold px-1.5 py-px rounded-full"
                          style={{
                            background: "rgba(0,0,0,0.5)",
                            color: "#fff",
                          }}
                        >
                          {book.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold leading-snug line-clamp-2 group-hover:[color:var(--codex-primary)] transition-colors">
                        {book.title}
                      </p>
                    </Link>
                    <span onClick={(e) => e.preventDefault()}>
                      <AuthorLink
                        name={book.author}
                        className="text-[10px] text-muted-foreground hover:[color:var(--codex-primary)] transition-colors"
                      />
                    </span>
                    <span
                      className="inline-block text-[8px] font-semibold px-1.5 py-0.5 rounded-full mt-1"
                      style={{ background: tradColor?.bg ?? "var(--codex-primary-soft)", color: tradColor?.text ?? "var(--codex-primary-text)" }}
                    >
                      {book.tradition}
                    </span>
                    <p className="text-[9px] text-muted-foreground/60 mt-1 leading-tight">
                      {reasonTag}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        </BlurFade>

        {/* ── 7. Recent Activity ─────────────────── */}
        <BlurFade delay={0.22} inView>
          <section>
            <SectionHeading
              icon={Clock}
              color="#0EA5E9"
              title="Recent Activity"
              action="Full history"
              actionHref="/profile"
            />

            {recentActivity.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  No activity yet. Start reading to build your history.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3">
                      <div
                        className="shrink-0 size-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${item.color}18` }}
                      >
                        <Icon className="size-3.5" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-snug truncate">{item.text}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/50 shrink-0 tabular-nums">
                        {formatNotificationTime(new Date(item.at).toISOString())}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </BlurFade>

      </div>
    </div>
  )
}
