"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300",
        scrolled
          ? "bg-[#161616]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]"
          : "bg-gradient-to-b from-black/60 to-transparent"
      )}
    >
      <Link href="/" className="flex items-center gap-2 drop-shadow-md">
        <BookOpen className="size-5 text-[#D4AF37]" />
        <span className="text-base font-bold tracking-[0.08em] text-[#D4AF37] drop-shadow-md font-[var(--font-display)]">
          TOME
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        <Link href="/library" className="text-sm text-[#7A756D] hover:text-[#FAF7F2] transition-colors">
          Library
        </Link>
        <Link href="/explore" className="text-sm text-[#7A756D] hover:text-[#FAF7F2] transition-colors">
          Explore
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[#FAF7F2] hover:text-white transition-colors drop-shadow-md px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          Log in
        </Link>
        <Link
          href="/onboarding"
          className="text-sm font-semibold text-[#111111] bg-[#D4AF37] rounded-full px-5 py-2 hover:bg-[#E0C060] transition-colors shadow-md"
        >
          Start Reading
        </Link>
      </div>
    </nav>
  )
}
