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
  // Marketing pages stay statically rendered; this client nav reads auth on
  // mount and re-renders the instant `onAuthStateChange` fires (see useAuth),
  // swapping the Sign in / Sign up CTAs for an "Open Tome" entry point.
  const { isAuthenticated, isDemoMode } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  // A visitor "has entry" if they hold a real session OR a demo profile —
  // demo mode enters the exact same app shell as a signed-in account. Keying
  // the nav off this (instead of isAuthenticated alone) is what kills the
  // "constant switching": the auth machine can flap between a stale session
  // and the localStorage demo fallback, but BOTH map to the same "Open Tome"
  // CTA, so the flap is no longer visible. Only a genuinely fresh visitor
  // (no session, no demo) sees "Sign in".
  const hasEntry = isAuthenticated || isDemoMode
  // The primary pill always points at /dashboard and is present in every
  // state, so it never appears/disappears — only its label changes.
  const pillClass = cn(
    "text-sm font-semibold px-4 py-1.5 rounded-full transition-colors",
    solid ? "bg-foreground text-background hover:opacity-90" : "bg-white text-black hover:bg-white/90"
  )
  const pillLabel = hasEntry ? "Open Tome" : "Use Beta"
  const showSignIn = !hasEntry

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

          {/* Real auth entry points. The primary pill is always rendered (it
              links to /dashboard in every state) so it never flips in or out;
              only the "Sign in" link is conditional, and only once auth has
              resolved to a confirmed signed-out visitor. The pill's label
              reads "Open Tome" for a session, "Use Beta" for the demo shell. */}
          {showSignIn && (
            <Link href={AUTH_LINKS.signIn.href} className={cn("hidden sm:inline-flex", linkClass)}>
              {AUTH_LINKS.signIn.label}
            </Link>
          )}
          <Link href="/dashboard" className={pillClass}>
            {pillLabel}
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
            {showSignIn && (
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
