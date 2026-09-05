"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { VirgilCharacter, type VirgilMood } from "./VirgilCharacter"

const MOODS: { value: VirgilMood; label: string; description: string }[] = [
  { value: "idle", label: "Idle", description: "A little company for the next chapter." },
  { value: "wave", label: "Wave", description: "A familiar face to welcome you back." },
  { value: "think", label: "Think", description: "Taking a moment to consider the passage." },
  { value: "read", label: "Read", description: "Following the story, line by line." },
  { value: "celebrate", label: "Celebrate", description: "Every new understanding is worth celebrating." },
]

export function VirgilShowcase() {
  const [mood, setMood] = useState<VirgilMood>("idle")
  const [paused, setPaused] = useState(false)
  return (
    <div className="mx-auto mb-8 max-w-xl">
      <VirgilCharacter mood={mood} paused={paused} className="mx-auto size-64 md:size-80" />
      <div role="group" aria-label="Virgil animations" className="mt-2 flex flex-wrap justify-center gap-2">
        {MOODS.map((item) => (
          <button key={item.value} type="button" aria-pressed={mood === item.value}
            onClick={() => setMood(item.value)}
            className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${mood === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent"}`}>
            {item.label}
          </button>
        ))}
        <button type="button" aria-label={paused ? "Play Virgil animation" : "Pause Virgil animation"}
          onClick={() => setPaused((value) => !value)}
          className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:hidden">
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-10 text-sm text-muted-foreground">{MOODS.find((item) => item.value === mood)?.description}</p>
    </div>
  )
}
