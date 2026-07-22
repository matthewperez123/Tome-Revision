import type { Metadata } from "next"
import { VirgilLab } from "@/components/virgil/lab/VirgilLab"

export const metadata: Metadata = {
  title: { absolute: "Virgil Lab — Tome internal" },
  description:
    "Internal lab for Virgil, Tome's lantern-bearing guide: every state, expression, scale, and book-world variant, with motion, theme, and device controls.",
  robots: { index: false, follow: false },
}

export default function VirgilLabPage() {
  return <VirgilLab />
}
