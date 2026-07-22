import type { Metadata } from "next"
import { JourneyHome } from "@/components/journey/JourneyHome"

export const metadata: Metadata = {
  title: { absolute: "Your Journey — Tome" },
  description:
    "The reader journey home: Virgil's greeting, the current book portal, the " +
    "chapter path, daily goal, Flame, Wisdom, Trials, Seals, and the Stoa — " +
    "a living journey instead of a dashboard.",
  robots: { index: false, follow: false },
}

export default function JourneyPage() {
  return <JourneyHome />
}
