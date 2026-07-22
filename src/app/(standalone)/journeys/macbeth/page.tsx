import type { Metadata } from "next"
import { JourneyExperience } from "@/components/journeys"
import { parseJourneyTemplate } from "@/lib/journeys"
import seed from "../../../../../content/journeys/macbeth-14.json"

export const metadata: Metadata = {
  title: { absolute: "Macbeth — The Fourteen-Day Journey — Tome" },
  description:
    "Fourteen days through Shakespeare's Macbeth in the Living Archive: a short " +
    "daily reading with real public-domain text, a literary context card, Virgil's " +
    "question, a Trial, Wisdom, milestone Seals, and a final shareable learning record.",
  robots: { index: false, follow: false },
}

// Validated once at module load against the JourneyTemplate schema (which
// embeds the committed TrialItemSchema per item). If the seed is ever
// edited into an invalid shape, this page fails loudly at build/boot
// instead of rendering a broken journey.
const template = parseJourneyTemplate(seed)

export default function MacbethJourneyPage() {
  return <JourneyExperience template={template} />
}
