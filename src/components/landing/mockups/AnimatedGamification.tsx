"use client"

import { motion, AnimatePresence } from "motion/react"
import { Flame, Shield, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "../useAnimationLoop"

const PHASES = [
  { name: "xpFill", duration: 3000 },
  { name: "streak", duration: 2500 },
  { name: "seal", duration: 2500 },
  { name: "leaderboard", duration: 2000 },
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
      <div className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<Trophy className="size-5 text-[#D4AF37]" />} label="Wisdom" value="450" />
          <StatCard icon={<Flame className="size-5 text-[#D4AF37]" />} label="Streak" value="14 days" />
          <StatCard icon={<Shield className="size-5 text-[#D4AF37]" />} label="Seals" value="3 / 21" />
          <StatCard icon={<Trophy className="size-5 text-[#D4AF37]" />} label="Level" value="Scholar 7" />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6 min-h-[280px]"
      aria-label="Animated gamification demonstration"
    >
      {/* XP Bar — always visible */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#7A756D]">Scholar Level 7</span>
          <motion.span
            className="text-xs text-[#D4AF37] font-semibold tabular-nums"
            key={phase === "xpFill" ? "filling" : "filled"}
          >
            {phase === "xpFill" ? "340" : "450"} / 600 Wisdom
          </motion.span>
        </div>
        <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
          <motion.div
            className="h-2 bg-gradient-to-r from-[#D4AF37] to-[#E0C060] rounded-full"
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
              <Flame className="size-10 text-[#D4AF37]" />
            </motion.div>
            <div>
              <p className="text-2xl font-bold text-[#FAF7F2] font-[var(--font-display)]">14 days</p>
              <p className="text-xs text-[#7A756D]">Reading streak</p>
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
                className="size-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center"
              >
                <Shield className="size-8 text-[#D4AF37]" />
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0 rounded-full border border-[#D4AF37]"
              />
            </div>
            <p className="mt-3 font-[var(--font-display)] text-lg font-bold text-[#FAF7F2]">
              Seal of Homer
            </p>
            <p className="text-xs text-[#7A756D] mt-1">Read 5 Greek texts</p>
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
            <p className="text-xs text-[#7A756D] mb-3">Scholar League</p>
            {LEADERBOARD.map((user, i) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5",
                  user.isUser
                    ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                    : "bg-[#1A1A1A] border border-[#333333]"
                )}
              >
                <span className="text-xs text-[#7A756D] w-4">{i + 1}</span>
                <div className="size-7 rounded-full bg-[#333333] flex items-center justify-center text-[10px] font-bold text-[#FAF7F2]">
                  {user.avatar}
                </div>
                <span className={cn("text-sm flex-1", user.isUser ? "text-[#D4AF37] font-semibold" : "text-[#FAF7F2]")}>
                  {user.name}
                </span>
                <span className="text-xs text-[#7A756D] tabular-nums">{user.wisdom}</span>
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
              className="text-lg text-[#D4AF37] font-semibold font-[var(--font-display)]"
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
    <div className="rounded-lg bg-[#1A1A1A] border border-[#333333] p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-sm font-semibold text-[#FAF7F2]">{value}</p>
      <p className="text-xs text-[#7A756D] mt-0.5">{label}</p>
    </div>
  )
}
