"use client"

import { useCallback } from "react"
import type { FaqCategory } from "@/lib/faqs"

interface FaqCategoryNavProps {
  categories: Pick<FaqCategory, "id" | "label">[]
}

export function FaqCategoryNav({ categories }: FaqCategoryNavProps) {
  const handleJump = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const target = document.getElementById(id)
      if (!target) return
      event.preventDefault()
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      })
      history.replaceState(null, "", `#${id}`)
    },
    []
  )

  return (
    <nav aria-label="FAQ categories" className="lg:sticky lg:top-28">
      <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
        {categories.map((category) => (
          <li key={category.id}>
            <a
              href={`#${category.id}`}
              onClick={(event) => handleJump(event, category.id)}
              className="inline-block rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {category.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
