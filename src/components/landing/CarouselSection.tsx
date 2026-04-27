"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { GalleryCard } from "./GalleryCard"
import { ROW_1, ROW_2 } from "./carousel-data"

export function CarouselSection() {
  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-8 px-6">
        <p className="font-[var(--font-display)] text-sm text-muted-foreground tracking-[0.15em] uppercase">
          Over a thousand books, charted across the canon.
        </p>
      </div>
      <Marquee
        pauseOnHover
        repeat={2}
        className="[--duration:60s] [--gap:0.75rem] mb-3"
      >
        {ROW_1.map((p) => (
          <GalleryCard key={p.slug} card={p} />
        ))}
      </Marquee>
      <Marquee
        pauseOnHover
        reverse
        repeat={2}
        className="[--duration:65s] [--gap:0.75rem]"
      >
        {ROW_2.map((p) => (
          <GalleryCard key={p.slug} card={p} />
        ))}
      </Marquee>
      <div className="text-center mt-8 px-6">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Browse the full library <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  )
}
