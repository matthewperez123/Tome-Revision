import type { Metadata } from "next"
import { StoaGallery } from "@/components/stoa"

export const metadata: Metadata = {
  title: { absolute: "The Stoa — Tome" },
  description:
    "A classical courtyard where your reading hangs on the walls: twelve arch " +
    "niches, twelve original Tome paintings, each restored by passing a book's Trial.",
  robots: { index: false, follow: false },
}

export default function StoaPage() {
  return <StoaGallery />
}
