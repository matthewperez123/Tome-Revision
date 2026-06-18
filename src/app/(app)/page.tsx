import type { Metadata } from "next"
import { AboutPage } from "@/components/about/AboutPage"

export const metadata: Metadata = {
  title: { absolute: "Tome — Read the Canon of World Literature" },
  description:
    "Tome is the gamified platform for the canon of world literature. Read over a thousand foundational works, answer Trials, earn Seals, and learn with Virgil, an AI scholar at your side.",
  openGraph: {
    title: "Tome — Read the Canon of World Literature",
    description:
      "Read the great books, answer Trials, earn Seals, and learn with Virgil — your AI scholar. For students, readers, and the classrooms that teach them.",
  },
}

export default function LandingPage() {
  return <AboutPage />
}
