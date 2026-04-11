"use client"

import { motion, AnimatePresence } from "motion/react"
import { ArrowRight } from "lucide-react"

interface MockVirgilDrawerProps {
  open: boolean
  title: string
  text: string
  crossRef?: {
    type: string
    workTitle: string
    workAuthor: string
    description: string
  }
}

export function MockVirgilDrawer({ open, title, text, crossRef }: MockVirgilDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute bottom-0 left-0 right-0 bg-[#161616] border-t border-[#333333] rounded-t-xl p-3 max-h-[55%] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="size-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[9px] font-serif font-bold text-[#D4AF37]">
              V
            </div>
            <span className="text-[10px] text-[#D4AF37] font-semibold">Virgil</span>
            <span className="text-[9px] text-[#7A756D]">&middot; {title}</span>
          </div>

          {/* Commentary */}
          <p className="text-[10px] text-[#C4BFB6] leading-relaxed mb-3">
            {text}
          </p>

          {/* Cross-reference */}
          {crossRef && (
            <div className="rounded-lg border border-[#333333] bg-[#0D0D0D] p-2.5">
              <span className="text-[8px] uppercase font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">
                {crossRef.type}
              </span>
              <p className="text-[9px] text-[#C4BFB6] mt-1.5">{crossRef.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[8px] text-[#7A756D]">
                  <span className="font-serif italic">{crossRef.workTitle}</span> &middot; {crossRef.workAuthor}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] text-[#D4AF37] font-semibold cursor-default">
                  Read this <ArrowRight className="size-2.5" />
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
