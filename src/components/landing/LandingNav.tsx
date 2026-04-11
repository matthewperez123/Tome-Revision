"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/tome/ThemeToggle"

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
          ? "bg-background/95 backdrop-blur-md border-b border-border text-foreground"
          : "bg-gradient-to-b from-black/60 to-transparent text-white"
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-2 transition-opacity duration-[var(--tome-duration-fast)] hover:opacity-70"
      >
        <BookOpen className="size-5 shrink-0" />
        <span className="text-base font-[var(--font-display)] font-semibold tracking-tight">
          Tome
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/library"
          className={cn(
            "text-sm transition-colors",
            scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/60 hover:text-white"
          )}
        >
          Library
        </Link>
        <Link
          href="/explore"
          className={cn(
            "text-sm transition-colors",
            scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/60 hover:text-white"
          )}
        >
          Explore
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors px-3 py-1.5 rounded-full",
            scrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
          )}
        >
          Log in
        </Link>
        <Link
          href="/onboarding"
          className={cn(
            "text-sm font-medium transition-colors px-3 py-1.5 rounded-full",
            scrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
          )}
        >
          Sign Up
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
