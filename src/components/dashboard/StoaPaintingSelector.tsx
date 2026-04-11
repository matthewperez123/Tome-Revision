"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Palette, Check, Search, X } from "lucide-react"
import {
  PAINTINGS,
  PAINTING_CATEGORIES,
  type Painting,
  type PaintingCategory,
} from "@/lib/paintings"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface StoaPaintingSelectorProps {
  selectedId: string
  onSelect: (painting: Painting) => void
}

export function StoaPaintingSelector({ selectedId, onSelect }: StoaPaintingSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<PaintingCategory | "all">("all")
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [focusIndex, setFocusIndex] = useState(-1)
  const [panelPos, setPanelPos] = useState<{ top: number; left: number; maxH: number }>({ top: 0, left: 0, maxH: 420 })

  useEffect(() => { setMounted(true) }, [])

  // Filter paintings by category AND search query
  const filtered = useMemo(() => {
    let results = activeCategory === "all"
      ? PAINTINGS
      : PAINTINGS.filter((p) => p.category === activeCategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.artist.toLowerCase().includes(q) ||
          (p.tradition && p.tradition.toLowerCase().includes(q))
      )
    }
    return results
  }, [query, activeCategory])

  // Category counts for tab badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: PAINTINGS.length }
    for (const cat of PAINTING_CATEGORIES) {
      if (cat.id !== "all") {
        counts[cat.id] = PAINTINGS.filter((p) => p.category === cat.id).length
      }
    }
    return counts
  }, [])

  // Position the panel centered over the Stoa banner when opening
  useEffect(() => {
    if (!open || !triggerRef.current) return
    const stoa = triggerRef.current.closest("[role='img']") as HTMLElement | null
    if (!stoa) return
    const rect = stoa.getBoundingClientRect()
    const panelWidth = Math.min(360, window.innerWidth - 16)
    const maxH = Math.min(420, rect.height - 16)
    let left = rect.left + window.scrollX + rect.width / 2 - panelWidth / 2
    // Clamp to viewport edges
    left = Math.max(8, Math.min(left, window.innerWidth - panelWidth - 8))
    setPanelPos({
      top: rect.top + window.scrollY + (rect.height - maxH) / 2,
      left,
      maxH,
    })
    setQuery("")
    setActiveCategory("all")
    setFocusIndex(-1)
    requestAnimationFrame(() => searchRef.current?.focus())
  }, [open])

  useEffect(() => { setFocusIndex(-1) }, [query, activeCategory])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest?.("[aria-label='Switch to light mode'], [aria-label='Switch to dark mode']")) return
      if (
        panelRef.current && !panelRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open])

  // Keyboard navigation inside grid
  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const cols = 4
      const total = filtered.length
      if (total === 0) return
      let next = focusIndex
      switch (e.key) {
        case "ArrowRight": next = Math.min(focusIndex + 1, total - 1); break
        case "ArrowLeft": next = Math.max(focusIndex - 1, 0); break
        case "ArrowDown": next = Math.min(focusIndex + cols, total - 1); break
        case "ArrowUp": next = Math.max(focusIndex - cols, 0); break
        case "Enter":
        case " ":
          e.preventDefault()
          if (focusIndex >= 0 && focusIndex < total) {
            onSelect(filtered[focusIndex])
            setOpen(false)
          }
          return
        default: return
      }
      e.preventDefault()
      setFocusIndex(next)
    },
    [focusIndex, filtered, onSelect]
  )

  useEffect(() => {
    if (!open || focusIndex < 0) return
    const btn = gridRef.current?.children[focusIndex] as HTMLButtonElement | undefined
    btn?.focus()
  }, [focusIndex, open])

  // Auto-switch to "All" when user types in search
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (val.trim() && activeCategory !== "all") {
      setActiveCategory("all")
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center size-9 rounded-full transition-all duration-200",
          "bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/60 hover:text-white",
          "border border-white/10 hover:border-white/20",
          "shadow-lg"
        )}
        aria-label="Change banner painting"
        aria-expanded={open}
      >
        <Palette className="size-4" />
      </button>

      {/* Portal-rendered panel to escape overflow:hidden on the Stoa */}
      {mounted && open && createPortal(
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Select a painting"
          className={cn(
            "absolute z-[100]",
            "w-[320px] sm:w-[360px] rounded-xl",
            "bg-white dark:bg-[#1A1A1A]/95",
            "border border-stone-200 dark:border-[#D4A04C]/15",
            "shadow-2xl shadow-black/20 dark:shadow-black/40",
            "backdrop-blur-xl",
            "flex flex-col",
            "animate-in fade-in zoom-in-95 duration-150"
          )}
          style={{ top: panelPos.top, left: panelPos.left, maxHeight: panelPos.maxH }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
            <p className="text-[11px] font-semibold tracking-wide uppercase text-stone-500 dark:text-[#B0A898] flex-1 text-center">
              Choose painting
            </p>
            <button
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-center size-6 rounded-md transition-colors",
                "text-stone-400 hover:text-stone-600 hover:bg-stone-100",
                "dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/5"
              )}
              aria-label="Close"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none text-stone-400 dark:text-white/30" />
              <Input
                ref={searchRef}
                type="text"
                placeholder="Search painters or paintings..."
                value={query}
                onChange={handleSearchChange}
                className={cn(
                  "pl-8 h-7 text-xs",
                  "bg-stone-50 border-stone-200 placeholder:text-stone-400",
                  "dark:bg-white/5 dark:border-white/10 dark:placeholder:text-white/30 dark:text-white"
                )}
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="px-3 pb-2">
            <div className="flex gap-1 overflow-x-auto scrollbar-none pb-0.5">
              {PAINTING_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id as PaintingCategory | "all")
                      setQuery("")
                    }}
                    className={cn(
                      "flex-shrink-0 px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider transition-all duration-150",
                      isActive
                        ? "bg-[#D4A04C]/15 text-[#D4A04C] dark:bg-[#D4A04C]/20 dark:text-[#D4A04C]"
                        : "text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:text-white/35 dark:hover:text-white/60 dark:hover:bg-white/5"
                    )}
                  >
                    {cat.label}
                    <span className="ml-1 text-[8px] opacity-60">{categoryCounts[cat.id]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Scrollable grid */}
          <div
            className={cn(
              "flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pb-3",
              "[&::-webkit-scrollbar]:w-1.5",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/15"
            )}
          >
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-xs text-stone-400 dark:text-white/30">
                No paintings match your search
              </div>
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-4 gap-1"
                role="listbox"
                aria-label="Paintings"
                onKeyDown={handleGridKeyDown}
              >
                {filtered.map((painting, i) => {
                  const isSelected = painting.id === selectedId
                  return (
                    <button
                      key={painting.id}
                      role="option"
                      aria-selected={isSelected}
                      aria-label={`${painting.title} by ${painting.artist}`}
                      tabIndex={0}
                      onClick={() => { onSelect(painting); setOpen(false) }}
                      onFocus={() => setFocusIndex(i)}
                      className={cn(
                        "group relative aspect-square rounded-lg overflow-hidden transition-all duration-150",
                        "ring-1 ring-inset",
                        "ring-stone-200 hover:ring-[#D4A04C]/50",
                        "dark:ring-white/5 dark:hover:ring-[#D4A04C]/40",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A04C]/60",
                        isSelected && "ring-2 ring-[#D4A04C]/70 dark:ring-[#D4A04C]/60"
                      )}
                      style={{ backgroundColor: painting.dominantColor }}
                    >
                      <Image
                        src={painting.src}
                        alt={painting.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                        onError={(e) => {
                          // On error, make image transparent so dominantColor bg shows through
                          e.currentTarget.style.opacity = "0"
                        }}
                      />
                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="flex items-center justify-center size-5 rounded-full bg-[#D4A04C] shadow-md">
                            <Check className="size-3 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
