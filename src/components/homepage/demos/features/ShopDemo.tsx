"use client"

import { motion, AnimatePresence } from "motion/react"
import { Coins, Snowflake, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "browse", duration: 3000 },
  { name: "select", duration: 2500 },
  { name: "purchase", duration: 2500 },
]

const ITEMS = [
  { name: "Streak Freeze", price: 10, icon: Snowflake },
  { name: "Double Wisdom", price: 20, icon: Sparkles },
]

export function ShopDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[240px] text-[10px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-semibold">Shop</p>
        <div className="flex items-center gap-0.5 text-[8px] text-[#D4AF37]">
          <Coins className="size-2.5" />
          <motion.span key={phase === "purchase" ? "spent" : "full"} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            {phase === "purchase" ? "45" : "55"}
          </motion.span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {ITEMS.map((item, i) => (
          <div
            key={item.name}
            className={cn(
              "rounded border p-2 text-center",
              phase !== "browse" && i === 0 ? "border-[#D4AF37]/50 bg-[#D4AF37]/5" : "border-[#333] bg-[#1A1A1A]"
            )}
          >
            <item.icon className="size-4 text-[#D4AF37] mx-auto mb-1" />
            <p className="text-[8px] font-semibold">{item.name}</p>
            <p className="text-[7px] text-[#7A756D] mt-0.5">{item.price} coins</p>
            <AnimatePresence>
              {phase === "purchase" && i === 0 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[7px] text-emerald-400 mt-1 font-semibold"
                >
                  Owned
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
