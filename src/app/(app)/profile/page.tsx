"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Sparkles, Flame, BookOpen, Bookmark, ChevronRight,
  Target, Share2, BarChart2, LogOut, Check, Pencil,
} from "lucide-react"
import { VirgilReflection } from "@/components/tome/virgil-reflection"
import { GuidedReadingProfileSection } from "@/components/virgil/guided/guided-reading-profile-section"
import { getAllBookProgress } from "@/lib/book-progress"
import { getBooks } from "@/lib/content"
import { TRADITION_COLORS } from "@/components/tome/book-card"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { AuthorLink } from "@/components/tome/author-link"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import { getCurrentAvatar } from "@/lib/avatar-state"
import type { BookCharacter } from "@/data/character-avatars"
import { CHARACTER_MAP, RARITY_COLORS } from "@/data/character-avatars"
import { AvatarPickerModal } from "@/components/tome/avatar/AvatarPickerModal"
import { useAuth } from "@/hooks/use-auth"
import { useEntitlement } from "@/hooks/use-entitlement"
import { useEconomy } from "@/components/tome/economy-provider"
import { CheckoutButton } from "@/components/pricing/CheckoutButton"
import { SOLO_ANNUAL_PRICE } from "@/lib/pricing"
import { getAllAchievements } from "@/data/achievements"
import { loadAchievementState } from "@/lib/achievements/engine"
import { RARITY_WAX_COLORS } from "@/types/achievement"

// Static literary quotes for the shareable card (not user data).
const READING_QUOTES = [
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott" },
  { text: "It is a truth universally acknowledged…", author: "Jane Austen" },
  { text: "All that is gold does not glitter.", author: "J.R.R. Tolkien" },
]

// ── Helpers ────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const day = 86_400_000
  if (diff < day) return "Today"
  const days = Math.floor(diff / day)
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return "1 week ago"
  if (weeks < 5) return `${weeks} weeks ago`
  const months = Math.floor(days / 30)
  return months <= 1 ? "1 month ago" : `${months} months ago`
}

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" })
}

function OrnamentalDivider({ color }: { color: string }) {
  return (
    <div className="relative flex items-center my-5" aria-hidden>
      <div className="flex-1 h-px bg-border" />
      <div className="mx-3 shrink-0">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={color} />
        </svg>
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// ── Main Page ──────────────────────────────────

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, isDemoMode, signOut, role } = useAuth()
  const { tier } = useEntitlement()
  const { stats, rank } = useEconomy()

  const [billingLoading, setBillingLoading] = useState(false)
  async function openBillingPortal() {
    setBillingLoading(true)
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" })
      const data = (await res.json()) as { url?: string; error?: string }
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
    } catch {
      // fall through
    }
    setBillingLoading(false)
  }

  const [allProgress, setAllProgress]   = useState<ReturnType<typeof getAllBookProgress>>({})
  const [shelfTab,    setShelfTab]       = useState<"progress" | "completed">("progress")
  const [settingMode, _setSettingMode]    = useState<"guided" | "free">(() => {
    if (typeof window !== "undefined") return (localStorage.getItem("tome:setting-mode") as "guided" | "free") ?? "guided"
    return "guided"
  })
  const [settingGoal, _setSettingGoal]    = useState(() => {
    if (typeof window !== "undefined") return Number(localStorage.getItem("tome:setting-goal")) || 20
    return 20
  })
  const { theme: globalTheme, setTheme: setGlobalTheme } = useTheme()
  const settingTheme = globalTheme === "dark" ? "night" : "default"

  const setSettingMode = (v: "guided" | "free") => { _setSettingMode(v); localStorage.setItem("tome:setting-mode", v) }
  const setSettingGoal = (v: number) => { _setSettingGoal(v); localStorage.setItem("tome:setting-goal", String(v)) }
  const setSettingTheme = (v: string) => { setGlobalTheme(v === "night" ? "dark" : "light") }
  const [shareOpen,   setShareOpen]      = useState(false)
  const [avatarCharacter, setAvatarCharacter] = useState<BookCharacter | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [achState, setAchState] = useState<ReturnType<typeof loadAchievementState>>({ unlocks: {} })

  const refreshAvatar = () => setAvatarCharacter(getCurrentAvatar())

  useEffect(() => {
    setAllProgress(getAllBookProgress())
    setAchState(loadAchievementState())
    refreshAvatar()
  }, [])

  const displayCharacter = avatarCharacter ?? CHARACTER_MAP["virgil"]

  const allBooks = useMemo(() => getBooks(), [])

  // ── Real identity ──────────────────────────────
  const displayName = profile?.display_name || displayCharacter?.name || "Reader"
  const accountEmail = user?.email ?? (profile?.username ? `@${profile.username}` : null)
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null

  // ── Real stats (economy + reading progress) ────
  const totalXp = stats.xp_total
  const streak = stats.current_streak
  const bestStreak = stats.longest_streak

  const totalChapters = useMemo(
    () => Object.values(allProgress).reduce((s, p) => s + p.completedChapterIndices.length, 0),
    [allProgress],
  )
  const booksStarted = useMemo(() => Object.keys(allProgress).length, [allProgress])

  const accentColor = "#6366F1"
  const quoteIdx = Math.floor(Date.now() / 86_400_000) % READING_QUOTES.length
  const quote    = READING_QUOTES[quoteIdx]

  // ── Real bookshelf, derived from saved progress ─
  const shelfEntries = useMemo(() => {
    return Object.values(allProgress)
      .map((p) => ({ p, book: allBooks.find((b) => b.id === p.bookId) }))
      .filter((x): x is { p: typeof x.p; book: NonNullable<typeof x.book> } => x.book != null)
  }, [allProgress, allBooks])

  const shelfInProgress = useMemo(() =>
    shelfEntries
      .filter(({ p, book }) => p.completedChapterIndices.length < book.chapters)
      .sort((a, b) => new Date(b.p.lastReadAt).getTime() - new Date(a.p.lastReadAt).getTime())
      .map(({ p, book }) => ({
        book,
        pct: Math.min(100, Math.round((p.completedChapterIndices.length / Math.max(1, book.chapters)) * 100)),
        lastRead: relativeTime(p.lastReadAt),
      })),
    [shelfEntries],
  )

  const shelfCompleted = useMemo(() =>
    shelfEntries
      .filter(({ p, book }) => p.completedChapterIndices.length >= book.chapters)
      .sort((a, b) => new Date(b.p.lastReadAt).getTime() - new Date(a.p.lastReadAt).getTime())
      .map(({ p, book }) => ({ book, completedOn: monthYear(p.lastReadAt) })),
    [shelfEntries],
  )

  // ── Real progress by tradition (over started books) ─
  const traditionProgress = useMemo(() => {
    const byTradition: Record<string, { done: number; total: number }> = {}
    for (const { p, book } of shelfEntries) {
      const t = book.tradition
      if (!byTradition[t]) byTradition[t] = { done: 0, total: 0 }
      byTradition[t].done += p.completedChapterIndices.length
      byTradition[t].total += book.chapters
    }
    return Object.entries(byTradition)
      .map(([tradition, v]) => ({ tradition, ...v }))
      .sort((a, b) => b.done - a.done)
  }, [shelfEntries])

  // ── Real achievements ──────────────────────────
  const { earnedBadges, earnedCount, totalAchievements } = useMemo(() => {
    const all = getAllAchievements()
    const earned = all.filter((a) => achState.unlocks[a.id])
    return {
      earnedBadges: earned,
      earnedCount: earned.length,
      totalAchievements: all.length,
    }
  }, [achState])

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-12">

        {/* ── 1. Profile Header ─────────────────── */}
        <BlurFade delay={0.05} inView>
          <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0 flex flex-col items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPickerOpen(true)}
                className="cursor-pointer outline-none"
              >
                {displayCharacter && (
                  <UserAvatar
                    character={displayCharacter}
                    size="lg"
                    showRarityRing={true}
                  />
                )}
              </motion.button>
              {displayCharacter && (
                <>
                  <span className="text-sm font-semibold text-foreground text-center max-w-[120px] truncate leading-tight">
                    {displayCharacter.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground text-center max-w-[120px] truncate leading-tight">
                    {displayCharacter.bookTitle}
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none"
                    style={{
                      color: RARITY_COLORS[displayCharacter.rarity].text,
                      backgroundColor: RARITY_COLORS[displayCharacter.rarity].bg,
                      border: `1px solid ${RARITY_COLORS[displayCharacter.rarity].border}`,
                    }}
                  >
                    {displayCharacter.rarity}
                  </span>
                </>
              )}
              <button
                onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                <Pencil className="size-3" />
                Change Avatar
              </button>
              {/* Level badge */}
              <div
                className="rounded-full px-2 py-0.5 text-[10px] font-bold leading-tight"
                style={{ background: accentColor, color: "#fff" }}
              >
                Lv {rank.rank.level}
              </div>
            </div>

            {/* Avatar picker modal */}
            <AvatarPickerModal
              open={pickerOpen}
              onOpenChange={setPickerOpen}
              onAvatarChanged={refreshAvatar}
            />

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="font-serif text-3xl font-bold tracking-tight">{displayName}</h1>
              {accountEmail && (
                <p className="text-sm text-muted-foreground mt-0.5">{accountEmail}</p>
              )}
              <p className="text-sm font-medium mt-1" style={{ color: accentColor }}>
                {rank.rank.name}
                {isDemoMode && (
                  <span className="ml-2 text-[10px] text-muted-foreground/70">· demo mode</span>
                )}
              </p>

              {/* Wisdom bar */}
              <div className="mt-3 max-w-xs mx-auto sm:mx-0">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>
                    {rank.next
                      ? `${rank.wisdomIntoRank.toLocaleString()} / ${rank.wisdomForNext.toLocaleString()} Wisdom`
                      : `${totalXp.toLocaleString()} Wisdom`}
                  </span>
                  {rank.next && (
                    <span>→ {rank.next.name}</span>
                  )}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: accentColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${rank.pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {memberSince && (
                <p className="text-[11px] text-muted-foreground/60 mt-2">Member since {memberSince}</p>
              )}
            </div>
          </section>
        </BlurFade>

        {/* ── 2. Stats Row ──────────────────────── */}
        <BlurFade delay={0.1} inView>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Wisdom",      value: totalXp.toLocaleString(),       icon: Sparkles, color: "#F59E0B", sub: "Wisdom" },
              { label: "Day Streak",         value: streak,                         icon: Flame,    color: "#F97316", sub: `Best: ${bestStreak}` },
              { label: "Books Started",      value: booksStarted,                   icon: BookOpen, color: "#0EA5E9", sub: "in library" },
              { label: "Chapters Done",      value: totalChapters,                  icon: Bookmark, color: "#8B5CF6", sub: "completed" },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" style={{ color }} />
                  <span className="text-[11px] text-muted-foreground truncate">{label}</span>
                </div>
                <p className="font-serif text-2xl font-bold tracking-tight" style={{ color }}>
                  {value}
                </p>
                <p className="text-[10px] text-muted-foreground/60">{sub}</p>
              </div>
            ))}
          </div>
        </BlurFade>

        {/* ── Upgrade to Solo (Stripe checkout) ──── */}
        <BlurFade delay={0.13} inView>
          <section className="relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 shrink-0 text-primary" />
                  <h2 className="font-serif text-xl font-bold tracking-tight">
                    Unlock Tome Solo
                  </h2>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  All 1,200+ books, unlimited Virgil conversations, advanced
                  Trials, and unlimited Hearts. Starts with a 7-day free trial.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                <CheckoutButton
                  tier="solo"
                  period="annual"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70"
                >
                  Upgrade — {SOLO_ANNUAL_PRICE}/yr
                </CheckoutButton>
                <Link
                  href="/pricing"
                  className="text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Compare all plans
                </Link>
              </div>
            </div>
          </section>
        </BlurFade>

        {/* ── Virgil Reflection ─────────────────── */}
        <VirgilReflection type="progress" context={{ booksRead: Object.keys(allProgress), chaptersCompleted: totalChapters, streakDays: streak }} />

        {/* ── 3. Tradition Progress ─────────────── */}
        {traditionProgress.length > 0 && (
          <BlurFade delay={0.16} inView>
            <section>
              <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">
                Progress by Tradition
              </h2>
              <OrnamentalDivider color={accentColor} />

              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                {traditionProgress.map(({ tradition, done, total }) => {
                  const pct   = Math.round((done / Math.max(1, total)) * 100)
                  const tcolor = TRADITION_COLORS[tradition]?.dot ?? accentColor
                  return (
                    <div key={tradition}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium">{tradition}</span>
                        <span className="text-muted-foreground">
                          {done} / {total} chapters
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: tcolor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </BlurFade>
        )}

        {/* ── 4. Achievements ───────────────────── */}
        <BlurFade delay={0.18} inView>
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold tracking-tight">Achievements</h2>
              <Link
                href="/achievements"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all <ChevronRight className="size-3" />
              </Link>
            </div>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">{earnedCount}</span> of{" "}
                {totalAchievements} earned
              </p>
              {earnedBadges.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {earnedBadges.map((a) => {
                    const color = RARITY_WAX_COLORS[a.rarity]
                    return (
                      <Link
                        key={a.id}
                        href={`/seals/${a.slug}`}
                        className="shrink-0 flex flex-col items-center gap-1.5 group"
                      >
                        <div
                          className="size-12 rounded-full flex items-center justify-center text-white font-serif text-sm font-bold"
                          style={{ background: color, border: `1.5px solid ${color}` }}
                          title={a.name}
                        >
                          {a.name.charAt(0)}
                        </div>
                        <span className="text-[9px] text-muted-foreground text-center w-14 leading-tight truncate">
                          {a.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/70">
                  No seals earned yet. Finish a book to claim your first.
                </p>
              )}
            </div>
          </section>
        </BlurFade>

        {/* ── 5. Bookshelf ──────────────────────── */}
        <BlurFade delay={0.22} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">My Bookshelf</h2>
            <OrnamentalDivider color={accentColor} />

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-muted p-1 mb-4 w-fit">
              {(["progress", "completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShelfTab(tab)}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-xs font-medium transition-colors",
                    shelfTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "progress" ? "In Progress" : "Completed"}
                </button>
              ))}
            </div>

            {shelfTab === "progress" && (
              shelfInProgress.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
                  {shelfInProgress.map(({ book, pct, lastRead }) => {
                    const tradColor    = TRADITION_COLORS[book.tradition]
                    return (
                      <div key={book.id} className="shrink-0 snap-start w-32">
                        <Link href={`/book/${book.id}`} className="group block">
                          <div className="relative rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow mb-2">
                            <ClassicsCover
                              bookId={book.id}
                              title={book.title}
                              author={book.author}
                              tradition={book.tradition}
                              fallbackColors={book.coverColors}
                              showTomeWordmark={false}
                              className="w-full rounded-none"
                            />
                            {/* Progress overlay */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-1"
                              style={{ background: "rgba(0,0,0,0.3)" }}
                            >
                              <div
                                className="h-full"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: tradColor?.dot ?? accentColor,
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-[11px] font-medium leading-tight line-clamp-2 group-hover:text-[color:var(--tome-accent)] transition-colors mb-0.5">
                            {book.title}
                          </p>
                        </Link>
                        <span onClick={(e) => e.preventDefault()}>
                          <AuthorLink
                            name={book.author}
                            className="text-[10px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors"
                          />
                        </span>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{pct}% · {lastRead}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/70">
                  Nothing in progress.{" "}
                  <Link href="/library/browse" className="text-[var(--tome-accent)] hover:underline">Browse the library</Link> to begin.
                </p>
              )
            )}

            {shelfTab === "completed" && (
              shelfCompleted.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
                  {shelfCompleted.map(({ book, completedOn }) => {
                    return (
                      <div key={book.id} className="shrink-0 snap-start w-32">
                        <Link href={`/book/${book.id}`} className="group block">
                          <div className="relative rounded-lg overflow-hidden shadow-sm mb-2">
                            <ClassicsCover
                              bookId={book.id}
                              title={book.title}
                              author={book.author}
                              tradition={book.tradition}
                              fallbackColors={book.coverColors}
                              showTomeWordmark={false}
                              className="w-full rounded-none"
                            />
                            {/* Checkmark overlay */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="size-8 rounded-full bg-emerald-500/90 flex items-center justify-center">
                                <Check className="size-4 text-white" />
                              </div>
                            </div>
                          </div>
                          <p className="text-[11px] font-medium leading-tight line-clamp-2 group-hover:text-[color:var(--tome-accent)] transition-colors mb-0.5">
                            {book.title}
                          </p>
                        </Link>
                        <span onClick={(e) => e.preventDefault()}>
                          <AuthorLink
                            name={book.author}
                            className="text-[10px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors"
                          />
                        </span>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5"><Check className="size-3 inline" /> {completedOn}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/70">No completed books yet.</p>
              )
            )}
          </section>
        </BlurFade>

        {/* ── 6. Analytics Link ─────────────────── */}
        <BlurFade delay={0.24} inView>
          <Link
            href="/profile/stats"
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div
                className="size-9 rounded-full flex items-center justify-center"
                style={{ background: `${accentColor}18` }}
              >
                <BarChart2 className="size-4.5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="text-sm font-semibold">Reading Analytics</p>
                <p className="text-[11px] text-muted-foreground">Charts, speed stats, milestones</p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </BlurFade>

        {/* ── 7. Shareable Progress Card ────────── */}
        <BlurFade delay={0.26} inView>
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold tracking-tight">Share Your Journey</h2>
            </div>
            <OrnamentalDivider color={accentColor} />

            {/* The card itself */}
            <div
              id="tome-share-card"
              className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
              style={{
                background: `linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)`,
                border: "1px solid rgba(99,102,241,0.4)",
              }}
            >
              {/* Dot texture */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden
              />

              <div className="relative">
                {/* Branding */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="size-7 rounded-full bg-white/15 flex items-center justify-center">
                    <BookOpen className="size-4 text-white" />
                  </div>
                  <span className="font-serif font-bold text-white text-lg tracking-tight">Tome</span>
                </div>

                {/* User name */}
                <p className="font-serif text-white text-2xl font-bold mb-1">{displayName}</p>
                <p className="text-[#D4A04C]/70 text-sm mb-6">
                  {rank.rank.name} · Level {rank.rank.level}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Wisdom", value: totalXp.toLocaleString(), icon: Sparkles },
                    { label: "Streak",  value: `${streak} days`,               icon: Flame },
                    { label: "Books",   value: `${booksStarted}`,              icon: BookOpen },
                    { label: "Chapters",value: `${totalChapters}`,             icon: Bookmark },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl bg-white/10 px-3 py-2.5">
                      <Icon className="size-3.5 text-[#D4A04C]/70 mb-1" />
                      <p className="text-white text-sm font-bold">{value}</p>
                      <p className="text-[#D4A04C]/70 text-[10px]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="border-l-2 border-[#D4A04C]/40 pl-4 mb-4">
                  <p className="font-serif italic text-white/85 text-sm leading-relaxed">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <cite className="text-[#D4A04C]/50 text-[11px] not-italic">— {quote.author}</cite>
                </blockquote>

                <p className="text-[#D4A04C]/60 text-[11px]">tome.app</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  const handle = profile?.username ?? user?.id ?? "me"
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`https://tome.app/profile/${handle}`)
                  }
                  setShareOpen(true)
                  setTimeout(() => setShareOpen(false), 2000)
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
                  shareOpen
                    ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                    : "hover:bg-muted"
                )}
              >
                {shareOpen ? <Check className="size-4" /> : <Share2 className="size-4" />}
                {shareOpen ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </section>
        </BlurFade>

        {/* ── Reading with Virgil (guided session reflections) ── */}
        <BlurFade delay={0.26} inView>
          <GuidedReadingProfileSection />
        </BlurFade>

        {/* ── 8. Settings ───────────────────────── */}
        <BlurFade delay={0.28} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">Settings</h2>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">

              {/* Daily Goal */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium">Daily Reading Goal</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {settingGoal === 10 ? "Casual" : settingGoal === 20 ? "Regular" : settingGoal === 30 ? "Ambitious" : "Intense"} · {settingGoal} min / day
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: "Casual",   val: 10  },
                    { label: "Regular",  val: 20  },
                    { label: "Ambitious",val: 30  },
                    { label: "Intense",  val: 60  },
                  ].map(({ label, val }) => (
                    <button
                      key={val}
                      onClick={() => setSettingGoal(val)}
                      className={cn(
                        "flex-1 rounded-lg border py-2 text-[11px] font-medium transition-colors",
                        settingGoal === val
                          ? "border-[var(--tome-accent)] text-[var(--tome-accent)] bg-[var(--tome-accent)]/10"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Mode */}
              <div className="px-5 py-4">
                <p className="text-sm font-medium mb-3">Default Reading Mode</p>
                <div className="flex gap-2">
                  {(["guided", "free"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettingMode(mode)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium capitalize transition-colors",
                        settingMode === mode
                          ? "border-[var(--tome-accent)] text-[var(--tome-accent)] bg-[var(--tome-accent)]/10"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      {mode === "guided" ? <><Target className="size-3.5" /> Guided</> : <><BookOpen className="size-4" /> Free Read</>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="px-5 py-4">
                <p className="text-sm font-medium mb-3">Reading Theme</p>
                <div className="flex gap-2">
                  {[
                    { label: "Default",       val: "default",  swatch: "#ffffff" },
                    { label: "Night Scholar", val: "night",    swatch: "#111827" },
                  ].map(({ label, val, swatch }) => (
                    <button
                      key={val}
                      onClick={() => setSettingTheme(val)}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-1.5 rounded-lg border py-2.5 text-[11px] font-medium transition-colors",
                        settingTheme === val
                          ? "border-[var(--tome-accent)] text-[var(--tome-accent)]"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      <div
                        className="size-5 rounded-full border border-border/50"
                        style={{ background: swatch }}
                      />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account & data */}
              <div className="px-5 py-4">
                <Link
                  href="/account"
                  className="flex items-center justify-between text-sm font-medium hover:text-foreground transition-colors group"
                >
                  <span>Account &amp; data</span>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Email, password, delete your account
                </p>
              </div>

              {/* Subscription — readers only */}
              {role === "reader" && (
                <div className="px-5 py-4">
                  {tier === "free" ? (
                    <Link
                      href="/pricing"
                      className="flex items-center justify-between text-sm font-medium hover:text-foreground transition-colors group"
                    >
                      <span>Upgrade to Tome Solo</span>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                  ) : (
                    <button
                      onClick={openBillingPortal}
                      disabled={billingLoading}
                      className="flex w-full items-center justify-between text-sm font-medium hover:text-foreground transition-colors group disabled:opacity-60"
                    >
                      <span>
                        Manage subscription
                        <span className="ml-2 text-[11px] font-normal text-muted-foreground capitalize">
                          Tome {tier}
                        </span>
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {tier === "free"
                      ? "Unlock the full library and Virgil"
                      : "Update payment, change plan, or cancel"}
                  </p>
                </div>
              )}

              {/* Sign out */}
              <div className="px-5 py-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </section>
        </BlurFade>

      </div>
    </div>
  )
}
