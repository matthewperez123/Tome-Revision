"use client"

import { useEffect, useState } from "react"
import { useAudience } from "@/contexts/AudienceContext"
import { BookOpen, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Mobile-only sticky bottom CTA.
 *
 * Sits fixed at the bottom of the viewport on mobile, above the
 * iOS safe-area inset and above any potential bottom navigator
 * (MobileDock is not rendered on the landing route, but the button
 * still respects safe-area + pads for any browser chrome).
 *
 * Appears after the user scrolls past the hero so the in-hero CTA
 * stays the primary call at the top of the page.
 */
export function StickyMobileCTA() {
  const { audience } = useAudience()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Show once user has scrolled past ~85% of the first viewport height.
      setShow(window.scrollY > window.innerHeight * 0.85)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isReader = audience === "reader"
  const label = isReader ? "Start reading" : "Book a demo"
  const Icon = isReader ? BookOpen : GraduationCap
  const href = isReader ? "/signup" : "/demo"

  return (
    <div
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 z-40 flex justify-center px-4 pointer-events-none transition-all duration-300 min-[768px]:hidden",
        "bottom-[calc(env(safe-area-inset-bottom,0px)+12px)]",
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0",
      )}
    >
      <a
        href={href}
        tabIndex={show ? 0 : -1}
        className={cn(
          "pointer-events-auto inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200",
          "bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] active:scale-[0.97]",
          "backdrop-blur-sm",
        )}
      >
        <Icon className="size-4" />
        {label}
      </a>
    </div>
  )
}
