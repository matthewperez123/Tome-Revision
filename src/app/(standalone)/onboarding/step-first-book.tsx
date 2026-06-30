"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { getFeaturedBooks } from "@/lib/content"
import { createBookProgress, saveBookProgress } from "@/lib/book-progress"
import { saveOnboardingData } from "@/lib/onboarding"

const STARTER_BOOKS = getFeaturedBooks()

export function StepFirstBook({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleContinue = () => {
    if (!selected) return
    saveBookProgress(createBookProgress(selected))
    saveOnboardingData({ firstBookId: selected })
    onNext()
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Choose your first book
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Virgil will be at your side from the very first page.
      </p>

      <div className="mt-8 grid w-full grid-cols-3 gap-3 sm:grid-cols-4">
        {STARTER_BOOKS.map((book) => {
          const isSelected = selected === book.id
          return (
            <motion.button
              key={book.id}
              onClick={() => setSelected(book.id)}
              animate={{ scale: isSelected ? 1.04 : 1 }}
              transition={springs.interactive}
              className={`group relative flex flex-col gap-2 rounded-xl border p-2 text-left transition-colors duration-[var(--tome-duration-fast)] ${
                isSelected
                  ? "border-[var(--tome-accent)] bg-[var(--tome-accent)]/5"
                  : "border-border hover:border-foreground/20"
              }`}
              aria-pressed={isSelected}
            >
              <div className="relative overflow-hidden rounded-md">
                <ClassicsCover
                  bookId={book.id}
                  title={book.title}
                  author={book.author}
                  tradition={book.tradition}
                  fallbackColors={book.coverColors}
                  showTomeWordmark={false}
                  aspectRatio="2/3"
                  className="w-full"
                />
                {isSelected && (
                  <div className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-[var(--tome-accent)] text-white shadow">
                    <Check className="size-3" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div className="px-0.5">
                <p className="truncate text-xs font-semibold leading-tight">
                  {book.title}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {book.author}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 flex w-full gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button className="flex-1" disabled={!selected} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
