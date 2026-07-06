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
  // Marketing pages are statically rendered, so the server always ships the
  // "resolving" skeleton. This client nav reads auth ONLY from the shared
  // AuthProvider (no localStorage, no route inference, no second subscription)
  // and resolves the CTA exactly once — see the auth-slot latch below.
  const { isAuthenticated, isDemoMode, isLoading } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // Latch the first settled auth resolution. Server HTML and the first client
  // render show "resolving"; once the shared machine settles we render the
  // final CTA once and never fall back to the skeleton. After that the slot
  // only moves on a genuine sign-in/out, since the shared machine already
  // ignores INITIAL_SESSION / TOKEN_REFRESHED and only recomputes demo state on
  // a real SIGNED_OUT.
  const [resolved, setResolved] = useState(false)
  useEffect(() => {
    if (!isLoading && !resolved) setResolved(true)
  }, [isLoading, resolved])

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

  // The auth slot has exactly three states. Server HTML always renders
  // "resolving"; the client resolves to "in" (a real session OR a demo shell →
  // "Open Tome") or "out" (a fresh visitor → "Sign in" + "Use Beta") once, then
  // latches. Keying "in" off isAuthenticated || isDemoMode means a stale
  // session vs demo-fallback flap can't move the slot — both are "Open Tome".
  const hasEntry = isAuthenticated || isDemoMode
  const slotState: "resolving" | "in" | "out" =
    isLoading && !resolved ? "resolving" : hasEntry ? "in" : "out"
  // The pill always points at /dashboard and carries a fixed min-width + centred
  // text so "Use Beta" and "Open Tome" share one box; the skeleton reuses it.
  const pillClass = cn(
    "text-sm font-semibold px-4 py-1.5 rounded-full transition-colors text-center min-w-[112px]",
    solid ? "bg-foreground text-background hover:opacity-90" : "bg-white text-black hover:bg-white/90"
  )
  const pillLabel = slotState === "in" ? "Open Tome" : "Use Beta"
  const skeletonBg = solid ? "bg-foreground/10" : "bg-white/20"

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

          {/* Auth slot — one fixed footprint across all three states so the
              skeleton and both final states occupy identical space (no layout
              shift when it resolves). The Sign-in area keeps its width even in
              the "in" state; the pill is always present with a fixed min-width
              so "Use Beta"/"Open Tome"/skeleton share one box. */}
          <div
            className="hidden sm:flex items-center justify-end w-[72px]"
            aria-busy={slotState === "resolving"}
          >
            {slotState === "resolving" && (
              <span aria-hidden className={cn("h-[30px] w-[68px] rounded-full animate-pulse", skeletonBg)} />
            )}
            {slotState === "out" && (
              <Link href={AUTH_LINKS.signIn.href} className={cn("whitespace-nowrap", linkClass)}>
                {AUTH_LINKS.signIn.label}
              </Link>
            )}
          </div>
          {slotState === "resolving" ? (
            <span aria-hidden className={cn(pillClass, "animate-pulse opacity-60")} />
          ) : (
            <Link href="/dashboard" className={pillClass}>
              {pillLabel}
            </Link>
          )}

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
            {slotState === "out" && (
              <Link
                href={AUTH_LINKS.signIn.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                {AUTH_LINKS.signIn.label}
              </Link>
            )}
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              {pillLabel}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
