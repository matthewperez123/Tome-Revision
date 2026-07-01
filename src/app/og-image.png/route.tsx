import { ImageResponse } from "next/og"

// Serves the default Open Graph / Twitter share card at the stable `/og-image.png`
// URL that the page metadata across the site references. Generated rather than
// shipped as a binary so it never goes stale and needs no asset pipeline.
export const runtime = "edge"
export const dynamic = "force-static"

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          color: "#F5F1E8",
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: "-0.05em" }}>
          Tome
        </div>
        <div style={{ fontSize: 42, marginTop: 4, color: "#C8A24B" }}>
          Read the Canon of World Literature
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
