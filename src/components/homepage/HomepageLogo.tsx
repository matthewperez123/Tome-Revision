import { BookOpen } from "lucide-react"

export function HomepageLogo() {
  return (
    <div className="flex items-center gap-2">
      <BookOpen className="size-6 text-white" />
      <span className="text-lg font-bold tracking-[0.08em] text-white font-[var(--font-display)]">
        TOME
      </span>
    </div>
  )
}
