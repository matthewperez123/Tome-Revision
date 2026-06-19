"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/tome/ThemeToggle"
import { TomeWordmark } from "@/components/brand/tome-wordmark"
import { PRIMARY_NAV, AUTH_LINKS, LANDING_PATHS } from "@/lib/marketing-nav"

export function LandingNav() {
  const pathname = usePathname()
  const isLandingPath = LANDING_PATHS.has(pathname)
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

          {/* Real auth entry points. "Sign in" matches the nav siblings;
              "Sign up" is the primary CTA — a solid pill that adapts to the
              scrolled / hero chrome. */}
          <Link href={AUTH_LINKS.signIn.href} className={cn("hidden sm:inline-flex", linkClass)}>
            {AUTH_LINKS.signIn.label}
          </Link>
          <Link
            href={AUTH_LINKS.signUp.href}
            className={cn(
              "text-sm font-semibold px-4 py-1.5 rounded-full transition-colors",
              solid
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-white text-black hover:bg-white/90"
            )}
          >
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
            <Link
              href={AUTH_LINKS.signIn.href}
              className="sm:hidden rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              {AUTH_LINKS.signIn.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
