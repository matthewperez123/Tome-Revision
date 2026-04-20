"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to console in dev; production logging can attach here later.
    console.error("App-group route error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </div>
      <h1 className="font-serif text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t finish rendering this page. Try again or head back
        to your dashboard.
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
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)]"
        >
          <Home className="size-4" aria-hidden="true" /> Back to dashboard
        </Link>
      </div>
    </div>
  )
}
