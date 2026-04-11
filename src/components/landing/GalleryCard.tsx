import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaintingCard } from "./carousel-data"

export function GalleryCard({ card }: { card: PaintingCard }) {
  return (
    <a
      href={`/book/${card.slug}`}
      className={cn(
        "group relative block shrink-0 rounded-lg overflow-hidden",
        "border border-border/50 dark:border-white/10",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.05] hover:border-indigo-400/60 dark:hover:border-indigo-400/40",
        "hover:shadow-[0_8px_24px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_8px_24px_rgba(99,102,241,0.25)]",
        "hover:z-10"
      )}
      style={{ width: 180, height: 270 }}
    >
      {card.cover ? (
        <Image
          src={card.cover}
          alt={`${card.painting} by ${card.artist}`}
          fill
          className="object-cover"
          sizes="180px"
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #1F2937, #111827)" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <p className="font-serif text-sm text-primary italic">{card.painting}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{card.artist}</p>
          </div>
        </div>
      )}
      {/* Dark overlay on image cards stays dark regardless of theme */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3"
        style={{
          background:
            "linear-gradient(to top, #0A0A0AE0 0%, #0A0A0A80 30%, transparent 55%)",
        }}
      >
        <p className="font-[var(--font-display)] text-[13px] font-semibold text-white leading-tight line-clamp-2">
          {card.title}
        </p>
        <p className="text-[11px] text-white/50 mt-0.5">{card.author}</p>
        <span className="inline-flex items-center gap-1 text-[10px] text-primary mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          Read <ChevronRight className="size-3" />
        </span>
      </div>
    </a>
  )
}
