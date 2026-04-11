"use client"

import { useState } from "react"
import { GraduationCap, BookOpen } from "lucide-react"
import { useAudience } from "@/contexts/AudienceContext"

const glass =
  "inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white font-semibold text-sm hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"

export function HeroCTA() {
  const { audience, setAudience } = useAudience()
  const [ready] = useState(true)

  if (!ready) return null

  if (audience === "teacher") {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button onClick={() => setAudience("teacher")} className={glass}>
          <GraduationCap className="size-4" />
          Start teaching
        </button>
        <button onClick={() => setAudience("reader")} className={glass}>
          <BookOpen className="size-4" />
          Start reading
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <button onClick={() => setAudience("reader")} className={glass}>
        <BookOpen className="size-4" />
        Start reading
      </button>
      <button onClick={() => setAudience("teacher")} className={glass}>
        <GraduationCap className="size-4" />
        Start teaching
      </button>
    </div>
  )
}
