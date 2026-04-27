"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { X, Bookmark, BookmarkCheck } from "lucide-react"
import { toast } from "sonner"
import { getAnnotation } from "@/lib/virgil/annotations"
import {
  isAnnotationBookmarked,
  isCrossRefBookmarked,
  toggleAnnotationBookmark,
  toggleCrossRefBookmark,
} from "@/lib/bookmarks/annotationBookmarks"
import { CrossReferenceCard } from "./CrossReferenceCard"
import { VirgilChatFooter } from "./VirgilChatFooter"
import type { Annotation } from "@/lib/virgil/types"
import { cn } from "@/lib/utils"
import { easeArray } from "@/lib/design-tokens"

interface VirgilDrawerProps {
  annotationId: string | null
  onClose: () => void
  /** When true, the "See also" cross-reference section is hidden. Driven
   *  by the reader's "Show echoes" toolbar toggle. */
  hideEchoes?: boolean
}

export function VirgilDrawer({ annotationId, onClose, hideEchoes = false }: VirgilDrawerProps) {
  const [annotation, setAnnotation] = useState<Annotation | null>(null)
  const [bookmarked, setBookmarked] = useState(false)
  // Per-cross-reference bookmark state — keyed by cross-reference index.
  // Each individual echo / source / allusion quote inside the annotation
  // can be bookmarked independently.
  const [crossRefBookmarks, setCrossRefBookmarks] = useState<Record<number, boolean>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const prefersReducedMotion = useReducedMotion() ?? false

  useEffect(() => {
    if (annotationId) {
      const a = getAnnotation(annotationId)
      setAnnotation(a)
      setBookmarked(isAnnotationBookmarked(annotationId))
      // Hydrate per-cross-reference bookmark state for this annotation.
      const initial: Record<number, boolean> = {}
      if (a) {
        a.crossReferences.forEach((_, i) => {
          initial[i] = isCrossRefBookmarked(annotationId, i)
        })
      }
      setCrossRefBookmarks(initial)
      // Scroll to top when annotation changes
      scrollRef.current?.scrollTo(0, 0)
    } else {
      setAnnotation(null)
      setCrossRefBookmarks({})
    }
  }, [annotationId])

  // Close on escape
  useEffect(() => {
    if (!annotationId) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [annotationId, onClose])

  function handleToggleBookmark() {
    if (!annotationId) return
    const added = toggleAnnotationBookmark(annotationId)
    setBookmarked(added)
    toast(added ? "Annotation saved" : "Annotation removed", { duration: 1500 })
  }

  function handleToggleCrossRefBookmark(index: number) {
    if (!annotationId) return
    const added = toggleCrossRefBookmark(annotationId, index)
    setCrossRefBookmarks((prev) => ({ ...prev, [index]: added }))
    toast(added ? "Reference saved" : "Reference removed", { duration: 1500 })
  }

  const variants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : { hidden: { y: "100%", opacity: 0 }, visible: { y: 0, opacity: 1 }, exit: { y: "100%", opacity: 0 } }

  return (
    <AnimatePresence>
      {annotation && (
        <>
          {/* Backdrop — transparent, click-to-close only.
              Previously this dimmed the page with bg-black/20 at z-40,
              which visually occluded inline annotation markers (z-10) and
              made them appear to "disappear" once the drawer opened. The
              fix: keep an outside-click target so users can dismiss the
              drawer by clicking off it, but draw nothing — the markers
              stay fully visible underneath. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-transparent"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: easeArray.sheet }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-40 flex flex-col",
              "h-[55vh] sm:h-[42vh]",
              "bg-card border-t rounded-t-xl",
              "shadow-2xl shadow-black/30"
            )}
            style={{ borderColor: "rgba(212,160,76,0.25)" }}
          >
            {/* Handle + close */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
              <div className="flex-1 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
              </div>
              <button
                onClick={onClose}
                className="absolute right-3 top-3 flex items-center justify-center size-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close annotation drawer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable annotation content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4">
              {/* Title — bookmark intentionally NOT placed here to avoid
                  crowding the top-right close button. The annotation
                  bookmark control sits below, attached to the quoted
                  passage where it belongs visually. */}
              <div className="pr-8">
                <h3 className="font-serif text-lg font-semibold tracking-tight">
                  {annotation.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {annotation.passageReference}
                </p>
              </div>

              {/* Quoted passage + bookmark control */}
              <div className="mt-4 flex items-start gap-3">
                <blockquote
                  className="flex-1 border-l-[3px] pl-4 py-1"
                  style={{ borderColor: "#D4A04C" }}
                >
                  <p className="font-serif italic text-sm leading-relaxed text-foreground/75">
                    {annotation.quotedPassage}
                  </p>
                </blockquote>
                <button
                  onClick={handleToggleBookmark}
                  className="shrink-0 mt-1 inline-flex items-center justify-center size-8 rounded-md transition-colors hover:bg-muted"
                  aria-label={bookmarked ? "Remove bookmark" : "Bookmark this annotation"}
                  title={bookmarked ? "Remove bookmark" : "Bookmark this passage"}
                >
                  {bookmarked
                    ? <BookmarkCheck className="size-4" style={{ color: "#D4A04C" }} />
                    : <Bookmark className="size-4 text-muted-foreground hover:text-[#D4A04C]" />}
                </button>
              </div>

              {/* Virgil's commentary */}
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="size-7 rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0"
                    style={{ background: "rgba(212,160,76,0.15)", color: "#D4A04C" }}
                  >
                    V
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wide">Virgil</span>
                </div>
                <div className="pl-9 space-y-3">
                  {annotation.commentary.split("\n\n").map((para, i) => (
                    <p key={i} className="font-serif text-sm leading-[1.85] text-foreground/85">
                      {renderInline(para)}
                    </p>
                  ))}
                </div>
              </div>

              {/* Cross-references — suppressed when the reader has the
                  "Show echoes" toggle off. */}
              {!hideEchoes && annotation.crossReferences.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1" style={{ backgroundColor: "rgba(212,160,76,0.2)" }} />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      See also
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: "rgba(212,160,76,0.2)" }} />
                  </div>
                  <div className="space-y-2">
                    {annotation.crossReferences.map((ref, i) => (
                      <CrossReferenceCard
                        key={i}
                        crossRef={ref}
                        bookmarked={!!crossRefBookmarks[i]}
                        onToggleBookmark={() => handleToggleCrossRefBookmark(i)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {annotation.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {annotation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-medium rounded-full px-2 py-0.5 capitalize"
                      style={{ backgroundColor: "rgba(212,160,76,0.08)", color: "var(--muted-foreground)" }}
                    >
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Chat footer (disabled) */}
            <VirgilChatFooter />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Simple inline italic/bold rendering
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const italicMatch = remaining.match(/\*(.*?)\*/)
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) parts.push(remaining.slice(0, italicMatch.index))
      parts.push(<em key={key++}>{italicMatch[1]}</em>)
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length)
    } else {
      parts.push(remaining)
      break
    }
  }
  return parts
}
