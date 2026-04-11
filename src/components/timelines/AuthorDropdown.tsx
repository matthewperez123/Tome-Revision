"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { TimelineAuthor } from "@/data/timelines"
import type { TomeBook } from "@/data/books"

interface AuthorDropdownProps {
  author: TimelineAuthor
  books: TomeBook[]
  anchorRect: DOMRect
  onClose: () => void
}

export function AuthorDropdown({
  author,
  books,
  anchorRect,
  onClose,
}: AuthorDropdownProps) {
  const { top, left } = useMemo(() => {
    const viewportW = typeof window !== "undefined" ? window.innerWidth : 1280
    const viewportH = typeof window !== "undefined" ? window.innerHeight : 800
    const dropW = 280
    const dropMaxH = 400

    // Default: right of anchor
    const isRightThird = anchorRect.right > viewportW * 0.67
    const x = isRightThird
      ? anchorRect.left - dropW - 8
      : anchorRect.right + 8

    // Vertical: align with anchor top, clamp to viewport
    let y = anchorRect.top - 20
    if (y + dropMaxH > viewportH - 16) {
      y = viewportH - dropMaxH - 16
    }
    if (y < 16) y = 16

    return { top: y, left: Math.max(8, Math.min(x, viewportW - dropW - 8)) }
  }, [anchorRect])

  return (
    <motion.div
      data-author-dropdown
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed z-50 w-[280px] max-h-[400px] overflow-y-auto rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-xl"
      style={{ top, left }}
    >
      <div className="p-4">
        {/* Header */}
        <h4 className="font-[var(--font-display)] text-base font-semibold text-foreground">
          {author.authorName}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {author.authorDates}
        </p>

        <hr className="border-border my-2.5" />

        {/* Book list */}
        {books.length > 0 ? (
          <div className="space-y-1">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/reader/${book.id}`}
                onClick={onClose}
                className="block py-2 px-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <p className="font-serif text-[13px] font-semibold text-foreground group-hover:text-[#D4A04C] transition-colors">
                  {book.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {book.synopsis}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-2">
            No books in the library yet.
          </p>
        )}
      </div>
    </motion.div>
  )
}
