"use client"

import { motion, AnimatePresence } from "motion/react"
import { Bookmark, BookmarkCheck, Heart } from "lucide-react"
import { useAnimationLoop } from "@/components/landing/useAnimationLoop"

const PHASES = [
  { name: "reading", duration: 3000 },
  { name: "save", duration: 2500 },
  { name: "shelf", duration: 2500 },
]

export function BookmarkDemo({ playing = true }: { playing?: boolean }) {
  const { phase, containerRef } = useAnimationLoop(PHASES)

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] text-[#FAF7F2] p-3 h-full min-h-[240px] text-[10px]">
      <AnimatePresence mode="wait">
        {phase === "reading" && (
          <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[8px] text-[#7A756D] mb-1">The Odyssey</p>
            <p className="font-serif text-[9px] leading-relaxed mb-2">
              Tell me, O muse, of that ingenious hero who travelled far and wide...
            </p>
            <div className="flex justify-end">
              <Bookmark className="size-4 text-[#7A756D]" />
            </div>
          </motion.div>
        )}
        {phase === "save" && (
          <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}>
              <Heart className="size-8 text-rose-500 fill-rose-500 mx-auto" />
            </motion.div>
            <p className="text-[9px] text-[#FAF7F2] mt-2 font-semibold">Added to Favorites</p>
          </motion.div>
        )}
        {phase === "shelf" && (
          <motion.div key="shelf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[9px] font-semibold mb-2">My Shelves</p>
            {["Favorites", "Currently Reading", "Want to Read"].map((shelf, i) => (
              <motion.div
                key={shelf}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-1.5 mb-1.5 rounded bg-[#1A1A1A] p-1.5"
              >
                <BookmarkCheck className="size-3 text-[#D4AF37]" />
                <span className="text-[8px] flex-1">{shelf}</span>
                <span className="text-[7px] text-[#7A756D]">{i === 0 ? "3" : i === 1 ? "1" : "5"}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
