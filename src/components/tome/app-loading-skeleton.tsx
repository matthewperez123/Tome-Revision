import { Skeleton } from "@/components/ui/skeleton"

type Variant = "page" | "detail" | "list" | "form" | "reader"

/**
 * Generic skeleton fallback for an authenticated app route.
 *
 * Used by every (app)/<segment>/loading.tsx that doesn't need a bespoke
 * shape. The cream surface + laurel-tinted blocks match Tome's chrome and
 * the underlying <Skeleton/> already disables its shimmer under
 * prefers-reduced-motion.
 */
export function AppLoadingSkeleton({
  variant = "page",
  title = true,
}: {
  variant?: Variant
  title?: boolean
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="px-4 py-6 sm:px-6 md:py-8"
    >
      <span className="sr-only">Loading</span>

      {title && (
        <div className="mb-6 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
      )}

      {variant === "page" && (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {variant === "detail" && (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="pt-4">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      )}

      {variant === "list" && (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {variant === "form" && (
        <div className="max-w-xl space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      )}

      {variant === "reader" && (
        <div className="mx-auto max-w-2xl space-y-3 py-8">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-9/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
        </div>
      )}
    </div>
  )
}
