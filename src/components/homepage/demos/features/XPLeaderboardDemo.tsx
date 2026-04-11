"use client"

import { motion, AnimatePresence } from "motion/react"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "xpFill", duration: 3000 },
  { name: "leaderboard", duration: 2500 },
  { name: "levelUp", duration: 2500 },
]

const BOARD = [
  { name: "Elena P.", xp: 1240, rank: 1 },
  { name: "You", xp: 1265, rank: 2, isUser: true },
  { name: "Marcus T.", xp: 1180, rank: 3 },
]

export function XPLeaderboardDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[240px] text-[10px]">
      <AnimatePresence mode="wait">
        {phase === "xpFill" && (
          <motion.div key="xp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[8px] text-[#7A756D] mb-1">Scholar Level 7</p>
            <div className="h-1.5 bg-[#222] rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-1.5 bg-[#D4AF37] rounded-full"
                animate={{ width: ["60%", "85%"] }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: -10 }}
              transition={{ duration: 2.5, times: [0, 0.2, 0.7, 1] }}
              className="text-center text-[10px] text-[#D4AF37] font-semibold"
            >
              +25 Wisdom
            </motion.p>
          </motion.div>
        )}
        {phase === "leaderboard" && (
          <motion.div key="board" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="text-[8px] text-[#7A756D] mb-2">Scholar League</p>
            {BOARD.map((u, i) => (
              <motion.div
                key={u.name}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-1.5 rounded px-2 py-1 mb-1",
                  u.isUser ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30" : "bg-[#1A1A1A]"
                )}
              >
                {u.rank === 1 && <Trophy className="size-2.5 text-[#D4AF37]" />}
                {u.rank !== 1 && <span className="text-[8px] text-[#7A756D] w-3">{u.rank}</span>}
                <span className={cn("flex-1 text-[9px]", u.isUser ? "text-[#D4AF37] font-semibold" : "")}>{u.name}</span>
                <span className="text-[8px] text-[#7A756D] tabular-nums">{u.xp}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
        {phase === "levelUp" && (
          <motion.div key="level" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="size-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mb-2"
            >
              <span className="text-sm font-bold text-[#D4AF37]">8</span>
            </motion.div>
            <p className="text-[10px] font-semibold text-[#FAF7F2]">Level Up!</p>
            <p className="text-[8px] text-[#7A756D]">Scholar Level 8</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
