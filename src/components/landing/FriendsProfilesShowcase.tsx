"use client"

import { motion, AnimatePresence } from "motion/react"
import { BookOpen, UserPlus, Send } from "lucide-react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

// Reader loop target: ~5s.
const PHASES = [
  { name: "profile", duration: 1600 },
  { name: "share", duration: 1400 },
  { name: "added", duration: 1600 },
  { name: "reset", duration: 400 },
]

const PROFILE = {
  name: "Elena Petrakis",
  handle: "elena",
  color: "#8B5CF6",
  initials: "EP",
  status: "Reading Inferno, Canto V",
  books: 23,
  wisdom: "12,340",
  shelf: [
    { title: "The Odyssey", color: "#6366F1" },
    { title: "Meditations", color: "#059669" },
    { title: "Inferno", color: "#DC2626" },
  ],
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function FriendsProfilesShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showShare = phase === "share"
  const showAdded = phase === "added"

  return (
    <TeacherShowcaseShell
      heading="Read with friends."
      subcopy="Follow other readers, share the book that just cracked you open, and see what the people around you are working through. Public profiles are opt-in and mock-social by default."
      layout="mockup-right"
      bgClass="bg-background"
    >
      <div
        ref={isReduced ? undefined : containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[280px] relative overflow-hidden"
        aria-label="Friends and public profiles demonstration"
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="size-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: PROFILE.color }}
          >
            {PROFILE.initials}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {PROFILE.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              @{PROFILE.handle}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <BookOpen className="size-3 text-indigo-500" />
              {PROFILE.status}
            </p>
          </div>
          <motion.button
            type="button"
            animate={{
              backgroundColor: showAdded
                ? "rgb(16 185 129)"
                : "rgb(99 102 241)",
            }}
            transition={{ duration: 0.3, ease: EASE }}
            className="rounded-full px-3 py-1 text-[11px] font-semibold text-white flex items-center gap-1"
          >
            <UserPlus className="size-3" />
            {showAdded ? "Following" : "Follow"}
          </motion.button>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Stat label="Books" value={PROFILE.books.toString()} />
          <Stat label="Wisdom" value={PROFILE.wisdom} />
          <Stat label="Seals" value="8" />
        </div>

        {/* Shelf */}
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
          Currently reading
        </p>
        <div className="flex gap-2">
          {PROFILE.shelf.map((b) => (
            <div
              key={b.title}
              className="flex-1 rounded border border-border bg-muted px-2 py-1.5"
            >
              <div
                className="h-1 w-full rounded-full mb-1"
                style={{ backgroundColor: b.color }}
              />
              <p className="text-[10px] font-semibold text-foreground line-clamp-1">
                {b.title}
              </p>
            </div>
          ))}
        </div>

        {/* Share toast */}
        <AnimatePresence>
          {showShare && (
            <motion.div
              key="share"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute bottom-3 left-6 right-6 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
            >
              <Send className="size-3" />
              Elena shared <span className="font-semibold">Inferno</span> with you.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TeacherShowcaseShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted px-2 py-1.5 text-center">
      <p className="text-sm font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    </div>
  )
}
