"use client"

import { motion, AnimatePresence } from "motion/react"

interface MockReaderProps {
  bookTitle: string
  chapter: string
  text: string
  progressPct?: number
  highlightText?: string
  showBookmark?: boolean
  bookmarkLabel?: string
}

export function MockReader({
  bookTitle,
  chapter,
  text,
  progressPct = 23,
  highlightText,
  showBookmark,
  bookmarkLabel,
}: MockReaderProps) {
  const parts = highlightText ? text.split(highlightText) : [text]

  return (
    <div className="bg-[#0D0D0D] h-full w-full p-4 relative overflow-hidden">
      {/* Progress bar */}
      <div className="w-full h-1 bg-[#222222] rounded-full mb-3">
        <motion.div
          className="h-1 bg-[#D4AF37] rounded-full"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>

      {/* Bookmark pill */}
      <AnimatePresence>
        {showBookmark && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-3 right-3 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full px-2 py-0.5 text-[9px] text-[#D4AF37] font-semibold"
          >
            {bookmarkLabel ?? "Saved"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter header */}
      <p className="text-[10px] text-[#7A756D] mb-2">
        {bookTitle} &middot; {chapter}
      </p>

      {/* Text */}
      <p className="font-serif text-xs text-[#FAF7F2] leading-[1.9]">
        {highlightText ? (
          <>
            {parts[0]}
            <span className="underline decoration-[#D4AF37] underline-offset-4 text-[#D4AF37]">
              {highlightText}
            </span>
            <span className="inline text-[8px] align-super ml-0.5 text-[#D4A04C]">✦</span>
            {parts[1]}
          </>
        ) : (
          text
        )}
      </p>
    </div>
  )
}
