"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "path", duration: 3000 },
  { name: "progress", duration: 2500 },
  { name: "complete", duration: 2500 },
]

const BOOKS = [
  { title: "The Iliad", done: true },
  { title: "The Odyssey", done: true },
  { title: "The Aeneid", done: false },
  { title: "Metamorphoses", done: false },
]

export function ReadingPathDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)
  const progressIndex = phase === "path" ? 1 : phase === "progress" ? 2 : 3

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[240px] text-[10px]">
      <p className="text-[8px] text-[#D4AF37] font-semibold mb-3">Epic Poetry Path</p>
      <div className="flex flex-col gap-1">
        {BOOKS.map((book, i) => {
          const isDone = i < progressIndex
          return (
            <div key={book.title} className="flex items-center gap-2">
              <motion.div
                animate={isDone ? { backgroundColor: "#D4AF37" } : {}}
                className={cn(
                  "size-5 rounded-full border flex items-center justify-center shrink-0",
                  isDone ? "border-[#D4AF37] bg-[#D4AF37]" : "border-[#444] bg-transparent"
                )}
              >
                {isDone && <Check className="size-3 text-[#0D0D0D]" />}
                {!isDone && <span className="text-[7px] text-[#7A756D]">{i + 1}</span>}
              </motion.div>
              {i < BOOKS.length - 1 && <div className="absolute ml-2.5 mt-6 w-px h-3 bg-[#333]" />}
              <span className={cn("text-[9px]", isDone ? "text-[#D4AF37]" : "text-[#7A756D]")}>
                {book.title}
              </span>
            </div>
          )
        })}
      </div>
      {phase === "complete" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[9px] text-[#D4AF37] mt-3 font-semibold"
        >
          Path Complete! +100 Wisdom
        </motion.p>
      )}
    </div>
  )
}
