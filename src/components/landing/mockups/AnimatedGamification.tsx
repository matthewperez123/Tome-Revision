"use client"

import { motion, AnimatePresence } from "motion/react"
import { Flame, Shield, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "../useAnimationLoop"

const PHASES = [
  { name: "xpFill", duration: 1400 },
  { name: "streak", duration: 1200 },
  { name: "seal", duration: 1200 },
  { name: "leaderboard", duration: 1200 },
]

const LEADERBOARD = [
  { name: "Elena P.", wisdom: 1240, avatar: "EP" },
  { name: "You", wisdom: 450, avatar: "ME", isUser: true },
  { name: "Marcus T.", wisdom: 380, avatar: "MT" },
]

export function AnimatedGamification() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  if (isReduced) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<Trophy className="size-5 text-primary" />} label="Wisdom" value="450" />
          <StatCard icon={<Flame className="size-5 text-primary" />} label="Flame" value="14 days" />
          <StatCard icon={<Shield className="size-5 text-primary" />} label="Seals" value="3 / 21" />
          <StatCard icon={<Trophy className="size-5 text-primary" />} label="Level" value="Scholar 7" />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-card rounded-xl border border-border p-6 min-h-[280px]"
      aria-label="Animated gamification demonstration"
    >
      {/* XP Bar — always visible */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Scholar Level 7</span>
          <motion.span
            className="text-xs text-primary font-semibold tabular-nums"
            key={phase === "xpFill" ? "filling" : "filled"}
          >
            {phase === "xpFill" ? "340" : "450"} / 600 Wisdom
          </motion.span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-2 bg-gradient-to-r from-primary to-primary/70 rounded-full"
            animate={{
              width: phase === "xpFill" ? ["56%", "75%"] : "75%",
            }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Animated panels */}
      <AnimatePresence mode="wait">
        {phase === "streak" && (
          <motion.div
            key="streak"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-4 py-6"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: 2, repeatType: "loop" }}
            >
              <Flame className="size-10 text-primary" />
            </motion.div>
            <div>
              <p className="text-2xl font-bold text-foreground font-[var(--font-display)]">14 days</p>
              <p className="text-xs text-muted-foreground">Flame</p>
            </div>
          </motion.div>
        )}

        {phase === "seal" && (
          <motion.div
            key="seal"
            initial={{ opacity: 0, rotateY: 180 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center py-6"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.15, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                className="size-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
              >
                <Shield className="size-8 text-primary" />
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0 rounded-full border border-primary"
              />
            </div>
            <p className="mt-3 font-[var(--font-display)] text-lg font-bold text-foreground">
              Seal of Homer
            </p>
            <p className="text-xs text-muted-foreground mt-1">Read 5 Greek texts</p>
          </motion.div>
        )}

        {phase === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground mb-3">Scholar League</p>
            {LEADERBOARD.map((user, i) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5",
                  user.isUser
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-muted border border-border"
                )}
              >
                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                <div className="size-7 rounded-full bg-muted-foreground/20 flex items-center justify-center text-[10px] font-bold text-foreground">
                  {user.avatar}
                </div>
                <span className={cn("text-sm flex-1", user.isUser ? "text-primary font-semibold" : "text-foreground")}>
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{user.wisdom}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === "xpFill" && (
          <motion.div
            key="xpFill"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: -20 }}
              transition={{ duration: 2.5, times: [0, 0.2, 0.7, 1] }}
              className="text-lg text-primary font-semibold font-[var(--font-display)]"
            >
              +110 Wisdom
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted border border-border p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}
