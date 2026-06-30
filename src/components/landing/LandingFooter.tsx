"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { FOOTER_COLUMNS, type FooterItem } from "@/lib/marketing-nav"
import { openSupport } from "@/lib/support"

const linkClass =
  "block text-sm text-muted-foreground hover:text-foreground transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
// Plain labels for surfaces that don't exist yet — not fake-clickable.
const plainClass = "block text-sm text-muted-foreground/70"

function FooterEntry({ item }: { item: FooterItem }) {
  if ("href" in item) {
    return (
      <Link href={item.href} className={linkClass}>
        {item.label}
      </Link>
    )
  }
  if ("action" in item) {
    return (
      <button type="button" onClick={openSupport} className={linkClass}>
        {item.label}
      </button>
    )
  }
  return <span className={plainClass}>{item.label}</span>
}

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-8 md:gap-12">
        {/* Logo + description */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-5 shrink-0 text-foreground" />
            <span className="font-[var(--font-display)] text-base font-semibold tracking-tight text-foreground">
              Tome
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            The gamified platform for the canon of world literature. Read, learn, and grow with an AI scholar at your side.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              {column.heading}
            </h4>
            <div className="space-y-2">
              {column.items.map((item) => (
                <FooterEntry key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground/50">&copy; 2026 Tome</span>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
