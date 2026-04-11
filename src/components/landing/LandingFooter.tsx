import Link from "next/link"
import { BookOpen } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-8 md:gap-12">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-5 shrink-0 text-foreground" />
            <span className="font-[var(--font-display)] text-base font-semibold tracking-tight text-foreground">
              Tome
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The gamified platform for classical literature.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Product</h4>
          <div className="space-y-2">
            <Link href="/library" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Library</Link>
            <Link href="/explore" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Company</h4>
          <div className="space-y-2">
            <span className="block text-sm text-muted-foreground">About</span>
            <span className="block text-sm text-muted-foreground">Contact</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground/50">&copy; 2026 Cellini Studio</span>
      </div>
    </footer>
  )
}
