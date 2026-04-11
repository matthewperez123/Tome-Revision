import Link from "next/link"
import { BookOpen } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)] py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-8 md:gap-12">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-5 text-[#D4AF37]" />
            <span className="font-[var(--font-display)] text-base font-bold tracking-[0.08em] text-[#D4AF37]">
              TOME
            </span>
          </div>
          <p className="text-xs text-[#7A756D] leading-relaxed">
            The gamified platform for classical literature.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs text-[#7A756D] uppercase tracking-wider mb-3">Product</h4>
          <div className="space-y-2">
            <Link href="/library" className="block text-sm text-[#7A756D] hover:text-[#FAF7F2] transition-colors">Library</Link>
            <Link href="/explore" className="block text-sm text-[#7A756D] hover:text-[#FAF7F2] transition-colors">Explore</Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs text-[#7A756D] uppercase tracking-wider mb-3">Company</h4>
          <div className="space-y-2">
            <span className="block text-sm text-[#7A756D]">About</span>
            <span className="block text-sm text-[#7A756D]">Contact</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-[rgba(255,255,255,0.04)] flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="text-xs text-[#444444]">&copy; 2026 Cellini Studio</span>
      </div>
    </footer>
  )
}
