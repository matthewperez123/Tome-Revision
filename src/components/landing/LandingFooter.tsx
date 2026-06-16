import Link from "next/link"
import { BookOpen } from "lucide-react"

const footerLink = "block text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"

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

        {/* Product */}
        <div>
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Product</h4>
          <div className="space-y-2">
            <Link href="/library" className={footerLink}>Library</Link>
            <Link href="/explore" className={footerLink}>Explore</Link>
            <Link href="/authors" className={footerLink}>Authors</Link>
            <Link href="/quizzes" className={footerLink}>Trials</Link>
          </div>
        </div>

        {/* For Teachers */}
        <div>
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">For Teachers</h4>
          <div className="space-y-2">
            <Link href="/classroom" className={footerLink}>Classroom</Link>
            <span className={footerLink}>Gradebook</span>
            <span className={footerLink}>Standards</span>
            <span className={footerLink}>Roster Import</span>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Resources</h4>
          <div className="space-y-2">
            <span className={footerLink}>Help Center</span>
            <span className={footerLink}>Getting Started</span>
            <span className={footerLink}>Accessibility</span>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Company</h4>
          <div className="space-y-2">
            <span className={footerLink}>About</span>
            <span className={footerLink}>Contact</span>
            <span className={footerLink}>Privacy</span>
            <span className={footerLink}>Terms</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground/50">&copy; 2026 Tome</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer">Privacy Policy</span>
          <span className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  )
}
