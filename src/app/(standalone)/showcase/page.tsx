import type { Metadata } from "next"
import { Suspense } from "react"
import { ShowcaseApp } from "@/components/showcase/ShowcaseApp"

export const metadata: Metadata = {
  title: { absolute: "The Tome Showcase — a playable Macbeth" },
  description:
    "A no-login, fully deterministic walk through Tome: read Macbeth with " +
    "Virgil, pass a four-part Trial, and restore a painting to the Stoa — " +
    "then see the Teacher and Parent views.",
  robots: { index: false, follow: false },
}

export default function ShowcasePage() {
  return (
    <Suspense fallback={null}>
      <ShowcaseApp />
    </Suspense>
  )
}
