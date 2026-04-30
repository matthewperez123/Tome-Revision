"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/tome/ThemeToggle"
import { TomeWordmark } from "@/components/brand/tome-wordmark"

// Marketing / landing routes that suppress the Beta superscript so the
// wordmark reads cleanly on hero-style chrome. Authenticated app surfaces
// (TopBar) keep the Beta indicator.
const LANDING_PATHS = new Set(["/", "/readers", "/educators"])

export function LandingNav() {
  const pathname = usePathname()
  const isLandingPath = LANDING_PATHS.has(pathname)
  const [scrolled, setScrolled] = useState(false)
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const linkClass = cn(
    "text-sm font-medium transition-colors px-3 py-1.5 rounded-full",
    scrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
  )

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border text-foreground"
          : "bg-gradient-to-b from-black/60 to-transparent text-white"
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-2 transition-opacity duration-[var(--tome-duration-fast)] hover:opacity-70 pr-3"
      >
        <BookOpen className="size-5 shrink-0" />
        <TomeWordmark
          showBeta={!isLandingPath}
          betaPx={9}
          className="text-base font-[var(--font-display)] font-semibold tracking-tight"
        />
      </Link>
      <div className="flex items-center gap-1 sm:gap-3">
        <Link href="/readers" className={cn("hidden sm:inline-flex", linkClass)}>
          Readers
        </Link>
        <Link href="/educators" className={cn("hidden sm:inline-flex", linkClass)}>
          Educators
        </Link>
        <Link href="/library" className={cn("hidden sm:inline-flex", linkClass)}>
          Library
        </Link>
        {/* Beta-demo nav: single "Use Beta" button replaces the previous
            Log in / Sign Up pair. Reuses linkClass exactly so the button
            visually matches the Readers / Educators / Library siblings.
            The (standalone)/login and (standalone)/signup route files
            still exist on disk — they just aren't linked from here. */}
        <Link href="/dashboard" className={linkClass}>
          Use Beta
        </Link>
        <ThemeToggle
          className={cn(
            scrolled ? "" : "text-white/60 hover:text-white hover:bg-white/10"
          )}
        />
      </div>
    </nav>
  )
}
