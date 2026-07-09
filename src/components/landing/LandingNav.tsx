"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/tome/ThemeToggle"
import { TomeWordmark } from "@/components/brand/tome-wordmark"
import { PRIMARY_NAV, AUTH_LINKS, LANDING_PATHS } from "@/lib/marketing-nav"
import { useAuth } from "@/hooks/use-auth"

export function LandingNav() {
  const pathname = usePathname()
  const isLandingPath = LANDING_PATHS.has(pathname)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Reads the shared auth machine (LandingNav is mounted under <AuthProvider>
  // by app-shell.tsx). A "resolve-once" latch flips true the first time auth
  // settles and never falls back, so the auth slot swaps at most once — no
  // flapping between renders. Only a REAL session shows "Open Tome"; demo mode
  // (localStorage) keeps the signed-out entrances.
  const { isAuthenticated, isLoading } = useAuth()
  const [resolved, setResolved] = useState(false)
  useEffect(() => {
    if (!isLoading) setResolved(true)
  }, [isLoading])
  const showOpenTome = resolved && isAuthenticated

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Close the mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // A menu open over the hero needs solid chrome regardless of scroll.
  const solid = scrolled || menuOpen

  const linkClass = cn(
    "text-sm font-medium transition-colors px-3 py-1.5 rounded-full",
    solid ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
  )

  // Auth slot: a signed-OUT visitor gets a quiet "Sign in" link beside the
  // "Sign up" pill; a signed-IN visitor gets an "Open Tome" pill in place of
  // "Sign in" (the "Sign up" pill stays so a new person can still create an
  // account). The resolve-once latch above keeps the swap deterministic.
  const pillClass = cn(
    "text-sm font-semibold px-4 py-1.5 rounded-full transition-colors text-center min-w-[112px]",
    solid ? "bg-foreground text-background hover:opacity-90" : "bg-white text-black hover:bg-white/90"
  )

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        solid
          ? "bg-background/95 backdrop-blur-md border-b border-border text-foreground"
          : "bg-gradient-to-b from-black/60 to-transparent text-white"
      )}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
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
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("hidden md:inline-flex", linkClass)}
            >
              {item.label}
            </Link>
          ))}

          {/* Auth slot — "Open Tome" pill when signed in, otherwise a quiet
              "Sign in" link. The "Sign up" pill is always present. */}
          <div className={cn("hidden sm:flex items-center justify-end", showOpenTome ? "" : "w-[72px]")}>
            {showOpenTome ? (
              <Link href={AUTH_LINKS.openTome.href} className={cn("whitespace-nowrap", pillClass)}>
                {AUTH_LINKS.openTome.label}
              </Link>
            ) : (
              <Link href={AUTH_LINKS.signIn.href} className={cn("whitespace-nowrap", linkClass)}>
                {AUTH_LINKS.signIn.label}
              </Link>
            )}
          </div>
          <Link href={AUTH_LINKS.signUp.href} className={pillClass}>
            {AUTH_LINKS.signUp.label}
          </Link>

          <ThemeToggle
            className={cn(
              solid ? "" : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          />

          {/* Mobile menu toggle — primary nav collapses below md. */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "md:hidden inline-flex items-center justify-center size-9 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              solid ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
            )}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4">
          <div className="flex flex-col gap-1">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {showOpenTome ? (
              <Link
                href={AUTH_LINKS.openTome.href}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                {AUTH_LINKS.openTome.label}
              </Link>
            ) : (
              <Link
                href={AUTH_LINKS.signIn.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                {AUTH_LINKS.signIn.label}
              </Link>
            )}
            <Link
              href={AUTH_LINKS.signUp.href}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              {AUTH_LINKS.signUp.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
