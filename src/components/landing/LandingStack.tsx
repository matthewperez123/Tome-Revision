"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { AudienceProvider, useAudience } from "@/contexts/AudienceContext"
import { HeroSection } from "./HeroSection"
import { HomepageContent } from "./HomepageContent"
import { LandingFooter } from "./LandingFooter"
import { StickyMobileCTA } from "./StickyMobileCTA"

type View = "reader" | "teacher"

/**
 * Watches the audience for user-initiated toggles (post-mount changes) and
 * navigates to the partner route. Initial sync is handled by `AudienceProvider`'s
 * `initial` prop, so this only fires when the user actively flips the toggle.
 */
function AudienceRouter({ view }: { view: View }) {
  const { audience } = useAudience()
  const router = useRouter()
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (audience === view) return
    router.push(audience === "teacher" ? "/educators" : "/readers")
  }, [audience, view, router])

  return null
}

export function LandingStack({ defaultView }: { defaultView: View }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AudienceProvider initial={defaultView}>
        <AudienceRouter view={defaultView} />
        <HeroSection />
        <HomepageContent />
        <LandingFooter />
        <StickyMobileCTA />
      </AudienceProvider>
    </div>
  )
}
