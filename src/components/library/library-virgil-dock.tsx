"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { VirgilSurface } from "@/components/virgil/VirgilSurface"
import { cn } from "@/lib/utils"

// Gold is Virgil's signature mark (kept in lockstep with <VirgilSurface>).
const GOLD = "linear-gradient(135deg,#E6C76E 0%,#C8A24B 55%,#9C7A2E 100%)"

/**
 * Library Virgil — a collapsible right-rail dock that mirrors the library's
 * left filter aside. Collapsed: a peek rail with Virgil's gold "V". Expanded:
 * the real streaming librarian surface ({ kind: "library" }), which recommends
 * only books that are actually ingested and avoids spoilers.
 */
export function LibraryVirgilDock() {
  const [open, setOpen] = useState(false)

  return (
    <aside
      className={cn(
        "relative shrink-0 border-l border-border bg-[var(--tome-surface-elevated)] transition-[width] duration-200 ease-[var(--tome-ease-scholarly)] overflow-hidden z-10 sticky top-0 self-start h-[calc(100vh-3rem)]",
        open ? "w-96" : "w-10",
      )}
    >
      {!open && (
        <div className="flex h-full w-10 flex-col items-center pt-3">
          <button
            onClick={() => setOpen(true)}
            title="Ask Virgil"
            aria-label="Open Virgil"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
            style={{ backgroundImage: GOLD }}
          >
            <span className="font-serif text-sm font-bold leading-none">V</span>
          </button>
        </div>
      )}

      {open && (
        <div className="flex h-full min-w-[320px] flex-col p-3">
          <div className="mb-2 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Collapse Virgil"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <VirgilSurface
              surface={{ kind: "library" }}
              placeholder="Ask Virgil for a book…"
              hint="Tell me what you're in the mood for, and I'll point you to something in the library."
              className="h-full"
            />
          </div>
        </div>
      )}
    </aside>
  )
}
