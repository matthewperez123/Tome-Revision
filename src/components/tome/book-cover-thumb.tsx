"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { TomeBook } from "@/data/books"
import { isBookRecommended } from "@/lib/book-apparatus"
import { ClassicsCover } from "./ClassicsCover"
import { ComingSoonCover } from "./ComingSoonCover"

interface BookCoverThumbProps {
  book: TomeBook
  /** Sizing utilities for the fixed-aspect box (default: w-10). */
  className?: string
}

/**
 * BookCoverThumb — a small, fixed 3/4 portrait thumbnail of a book's cover,
 * for list cards (Quizzes, Reading).
 *
 * Renders the book's `coverImagePath` image when one exists (object-cover so
 * portrait art is never stretched or its faces cropped oddly), falling back —
 * on a missing path OR a broken image load — to the same procedural cover the
 * library uses (ClassicsCover for catalogued books, ComingSoonCover
 * otherwise). The procedural cover can never break, so the grid is safe even
 * when an image file is absent.
 */
export function BookCoverThumb({ book, className }: BookCoverThumbProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = Boolean(book.coverImagePath) && !imgFailed

  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-10 shrink-0 overflow-hidden rounded-md bg-muted",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={book.coverImagePath!}
          alt={`Cover of ${book.title}`}
          fill
          sizes="44px"
          className="object-cover"
          onError={() => setImgFailed(true)}
          unoptimized
        />
      ) : isBookRecommended(book) ? (
        <ClassicsCover
          bookId={book.id}
          title={book.title}
          author={book.author}
          tradition={book.tradition}
          fallbackColors={book.coverColors}
          hideBand
          aspectRatio="3/4"
          className="h-full w-full rounded-none"
        />
      ) : (
        <ComingSoonCover
          tradition={book.tradition}
          fallbackColors={book.coverColors}
          aspectRatio="3/4"
          className="h-full w-full rounded-none"
        />
      )}
    </div>
  )
}
