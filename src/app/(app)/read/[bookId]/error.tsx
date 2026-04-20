"use client"

import { useEffect } from "react"
import Link from "next/link"
import { BookX, RotateCcw, Library } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReaderError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Reader route error:", error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <BookX className="size-7" aria-hidden="true" />
      </div>
      <h1 className="font-serif text-2xl font-semibold tracking-tight">
        This chapter couldn&apos;t load
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The text source or an enhancement bundle failed to render. You can
        retry, or return to your library and pick a different book.
      </p>
      {error?.digest && (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground/60">
          ref: {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => reset()} variant="default">
          <RotateCcw className="mr-2 size-4" aria-hidden="true" /> Try again
        </Button>
        <Button asChild variant="ghost">
          <Link href="/library">
            <Library className="mr-2 size-4" aria-hidden="true" /> Open library
          </Link>
        </Button>
      </div>
    </div>
  )
}
