"use client"

import { useEffect, useRef, useState } from "react"
import { Bookmark, Check, ChevronDown, Heart } from "lucide-react"
import {
  addToShelf,
  listShelfItems,
  removeFromShelf,
  type Shelf,
} from "@/lib/shelves/shelves"
import { cn } from "@/lib/utils"

const OPTIONS: { shelf: Shelf; label: string; icon: React.FC<{ className?: string }> }[] = [
  { shelf: "favorites", label: "Favorites", icon: Heart },
  { shelf: "want_to_read", label: "Want to Read", icon: Bookmark },
  { shelf: "completed", label: "Completed", icon: Check },
]

/**
 * Book-detail affordance to place a book on any personal shelf. The three
 * manual shelves persist to `shelf_items` (account-backed, cross-device). When
 * the reader has finished the book (`completed` hint), the Completed option is
 * gently emphasized.
 */
export function AddToShelf({ bookId, completed = false }: { bookId: string; completed?: boolean }) {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [membership, setMembership] = useState<Set<Shelf>>(new Set())
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const items = await listShelfItems()
      if (cancelled) return
      setMembership(new Set(items.filter((i) => i.bookId === bookId).map((i) => i.shelf)))
      setReady(true)
    })()
    return () => { cancelled = true }
  }, [bookId])

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  function toggle(shelf: Shelf) {
    const next = new Set(membership)
    if (next.has(shelf)) {
      next.delete(shelf)
      removeFromShelf(bookId, shelf)
    } else {
      next.add(shelf)
      addToShelf(bookId, shelf)
    }
    setMembership(next)
  }

  if (!ready) return null

  const count = membership.size

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 h-9 px-3 rounded-full border text-xs transition-colors",
          count > 0
            ? "border-[var(--tome-accent)] text-[var(--tome-accent)] bg-[color-mix(in_srgb,var(--tome-accent)_8%,transparent)]"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
        )}
      >
        <Bookmark className="size-3.5" />
        {count > 0 ? `On ${count} shelf${count > 1 ? "s" : ""}` : "Add to Shelf"}
        <ChevronDown className="size-3" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-48 rounded-lg border border-border bg-popover shadow-md p-1">
          {OPTIONS.map(({ shelf, label, icon: Icon }) => {
            const on = membership.has(shelf)
            const emphasize = shelf === "completed" && completed && !on
            return (
              <button
                key={shelf}
                onClick={() => toggle(shelf)}
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs transition-colors text-left",
                  on ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  emphasize && "text-[var(--gold-default)]",
                )}
              >
                <Icon className={cn("size-3.5 shrink-0", on && "fill-current")} />
                <span className="flex-1">{label}</span>
                {on && <Check className="size-3.5 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
