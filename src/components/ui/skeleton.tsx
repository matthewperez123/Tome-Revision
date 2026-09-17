import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Neutral muted placeholder. (The old bg-[var(--tome-gold)]/10 +
        // tome-shimmer combo rendered as a flat flashing yellow block — the
        // keyframe animates background-position with no gradient to move.)
        "rounded-md bg-muted motion-safe:animate-pulse motion-reduce:opacity-60",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
