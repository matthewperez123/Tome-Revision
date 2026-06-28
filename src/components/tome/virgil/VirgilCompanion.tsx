"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useVirgil } from "@/lib/virgil-context"
import { getPoseImage } from "@/lib/virgil-poses"

export function VirgilCompanion() {
  const { toggleChat, isOpen, currentPose, hasNotification } = useVirgil()
  const pathname = usePathname()
  const poseImage = getPoseImage(currentPose)

  // Fade-in guard: while the button is still transparent, keep it out
  // of the tab order and hidden from assistive tech. Once opacity
  // animation completes (~300ms), reveal fully.
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 320)
    return () => clearTimeout(t)
  }, [])

  // Hide on landing page (has its own Virgil presence) and when chat is open
  if (isOpen || pathname === "/") return null

  return (
    <motion.button
      onClick={toggleChat}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [1, 1.03, 1],
        opacity: 1,
      }}
      transition={{
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.3 },
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-background ring-2 ring-virgil/50 shadow-lg overflow-hidden cursor-pointer outline-none flex items-center justify-center focus-visible:ring-4 focus-visible:ring-virgil/60"
      aria-label="Open Virgil chat"
      aria-hidden={!revealed}
      tabIndex={revealed ? 0 : -1}
      style={{ pointerEvents: revealed ? "auto" : "none" }}
    >
      <Image
        src={poseImage}
        alt=""
        width={768}
        height={768}
        sizes="48px"
        className="size-full object-cover"
        priority
      />
      {hasNotification && (
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-0 right-0 size-3 rounded-full bg-[#D4A04C] border-2 border-background"
        />
      )}
    </motion.button>
  )
}
