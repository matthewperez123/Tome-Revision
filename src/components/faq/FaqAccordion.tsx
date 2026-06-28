"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import type { FaqItem } from "@/lib/faqs"

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  // One item open at a time within this category; null = all closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Deep links: /faq#who-is-virgil opens and scrolls to that question. Each
  // accordion only responds when the hash matches one of its own items.
  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.slice(1)
      if (!hash) return
      const index = items.findIndex((item) => item.id === hash)
      if (index === -1) return
      setOpenIndex(index)
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
      document
        .getElementById(`faq-${hash}-button`)
        ?.focus({ preventScroll: true })
    }
    openFromHash()
    window.addEventListener("hashchange", openFromHash)
    return () => window.removeEventListener("hashchange", openFromHash)
  }, [items])

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const buttonId = `faq-${item.id}-button`
        const panelId = `faq-${item.id}-panel`
        return (
          <div key={item.id} id={item.id} className="scroll-mt-28">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="text-base font-semibold text-foreground">
                  {item.q}
                </span>
                <ChevronDown
                  aria-hidden
                  className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-9 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
