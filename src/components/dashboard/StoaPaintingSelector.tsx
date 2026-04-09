"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Palette, Check, Search, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { PAINTINGS, type Painting } from "@/lib/paintings"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface StoaPaintingSelectorProps {
  selectedId: string
  onSelect: (painting: Painting) => void
}

export function StoaPaintingSelector({ selectedId, onSelect }: StoaPaintingSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [focusIndex, setFocusIndex] = useState(-1)

  // Filter paintings by search query
  const filtered = useMemo(() => {
    if (!query.trim()) return PAINTINGS
    const q = query.toLowerCase()
    return PAINTINGS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q)
    )
  }, [query])

  // Reset search and focus when panel opens
  useEffect(() => {
    if (open) {
      setQuery("")
      setFocusIndex(-1)
      requestAnimationFrame(() => searchRef.current?.focus())
    }
  }, [open])

  // Reset focus index when filter results change
  useEffect(() => {
    setFocusIndex(-1)
  }, [query])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  // Focus the correct thumbnail when focusIndex changes
  useEffect(() => {
    if (!open || focusIndex < 0) return
    const btn = gridRef.current?.children[focusIndex] as HTMLButtonElement | undefined
    btn?.focus()
  }, [focusIndex, open])

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
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

      {/* Dropdown panel — anchored to trigger, not a full-screen modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="dialog"
            aria-label="Select a painting"
            className={cn(
              "absolute top-0 right-0 mt-10 z-50",
              "w-[280px] rounded-xl",
              "bg-white dark:bg-[#1A1A1A]/95",
              "border border-stone-200 dark:border-[#D4A04C]/15",
              "shadow-2xl shadow-black/20 dark:shadow-black/40",
              "backdrop-blur-xl",
              "flex flex-col"
            )}
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
                  placeholder="Search title or artist…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={cn(
                    "pl-8 h-7 text-xs",
                    "bg-stone-50 border-stone-200 placeholder:text-stone-400",
                    "dark:bg-white/5 dark:border-white/10 dark:placeholder:text-white/30 dark:text-white"
                  )}
                />
              </div>
            </div>

            {/* Scrollable grid — compact, fits inside the Stoa */}
            <div
              className={cn(
                "overflow-y-auto overscroll-contain px-3 pb-3",
                "scrollbar-thin",
                "scrollbar-thumb-stone-300 scrollbar-track-stone-100",
                "dark:scrollbar-thumb-white/15 dark:scrollbar-track-transparent"
              )}
              style={{ maxHeight: "min(320px, calc(100% - 100px))" }}
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
                      >
                        <Image
                          src={painting.src}
                          alt={painting.title}
                          fill
                          className="object-cover"
                          sizes="90px"
                          unoptimized
                        />
                        {/* Hover tooltip */}
                        <div className="absolute inset-x-0 bottom-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-[9px] text-white/90 leading-tight truncate font-medium">{painting.title}</p>
                          <p className="text-[8px] text-white/60 leading-tight truncate">{painting.artist}</p>
                        </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
