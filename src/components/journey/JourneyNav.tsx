"use client"

/**
 * JourneyNav — responsive journey navigation.
 *
 * Mobile: a fixed bottom bar (Home / Library / Stoa / Profile) with 48px
 * targets and aria-current on the active stop. Desktop: a slim left rail
 * with icon + label stacks. Same four stops on both; /journey is Home.
 *
 * Library links to the existing /library route and Profile to /account —
 * this component never re-implements those surfaces.
 */

import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavStop {
  id: "home" | "library" | "stoa" | "profile"
  label: string
  href: string
  icon: (props: { className?: string }) => React.ReactNode
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  )
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M5 4h4.5A2.5 2.5 0 0 1 12 6.5V20a2.5 2.5 0 0 0-2.5-2.5H5V4Z" />
      <path d="M19 4h-4.5A2.5 2.5 0 0 0 12 6.5V20a2.5 2.5 0 0 1 2.5-2.5H19V4Z" />
    </svg>
  )
}

function StoaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M7 20V10a5 5 0 0 1 10 0v10" />
      <path d="M4 20h16" />
    </svg>
  )
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

const STOPS: readonly NavStop[] = [
  { id: "home", label: "Home", href: "/journey", icon: HomeIcon },
  { id: "library", label: "Library", href: "/library", icon: LibraryIcon },
  { id: "stoa", label: "Stoa", href: "/stoa", icon: StoaIcon },
  { id: "profile", label: "Profile", href: "/account", icon: ProfileIcon },
]

const FOCUS_RING =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-surface)]"

export function JourneyNav() {
  return (
    <>
      {/* Mobile bottom bar */}
      <nav
        aria-label="Journey"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--la-surface-sunken)] bg-[var(--la-surface)]/95 backdrop-blur-sm lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {STOPS.map((stop) => {
            const active = stop.id === "home"
            return (
              <li key={stop.id}>
                <Link
                  href={stop.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                    FOCUS_RING,
                    active
                      ? "text-[var(--la-primary)]"
                      : "text-[var(--la-ink-muted)] hover:text-[var(--la-ink)]",
                  )}
                >
                  <stop.icon className="size-5" />
                  {stop.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop left rail */}
      <nav
        aria-label="Journey"
        className="fixed inset-y-0 left-0 z-40 hidden w-20 flex-col items-center gap-2 border-r border-[var(--la-surface-sunken)] bg-[var(--la-surface)] py-6 lg:flex"
      >
        <span
          aria-hidden="true"
          className="mb-4 flex size-10 items-center justify-center rounded-full font-mono text-sm font-bold text-[var(--la-primary-ink)]"
          style={{ backgroundColor: "var(--la-primary)" }}
          title="Tome"
        >
          T
        </span>
        <ul className="flex flex-col gap-2">
          {STOPS.map((stop) => {
            const active = stop.id === "home"
            return (
              <li key={stop.id}>
                <Link
                  href={stop.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-16 flex-col items-center gap-1 rounded-[var(--la-radius-m)] px-2 py-2.5 text-[11px] font-medium transition-colors",
                    FOCUS_RING,
                    active
                      ? "bg-[var(--la-primary-soft)] text-[var(--la-primary)]"
                      : "text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)] hover:text-[var(--la-ink)]",
                  )}
                >
                  <stop.icon className="size-5" />
                  {stop.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
