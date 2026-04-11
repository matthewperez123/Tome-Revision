"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { isOnboardingComplete } from "@/lib/onboarding"

export function HeroCTA() {
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDone(isOnboardingComplete())
    setReady(true)
  }, [])
  if (!ready) return null
  return (
    <Link
      href={done ? "/library" : "/onboarding"}
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D4AF37] text-[#111111] font-semibold text-sm hover:bg-[#E0C060] hover:scale-[1.03] transition-all duration-200 shadow-lg"
    >
      Start reading <ArrowRight className="size-4" />
    </Link>
  )
}
