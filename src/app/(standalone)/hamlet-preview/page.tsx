/**
 * Hamlet structured-content preview — index page
 * Unauthenticated debug route to view the new line-array content format
 * that was produced during the Hamlet ingestion sprint (2026-04-16).
 */
import fs from "fs"
import path from "path"
import Link from "next/link"

interface TocEntry {
  type: "act" | "scene"
  act?: number
  scene?: number
  title?: string
  section_id?: string
  scene_title?: string
  line_count?: number
  word_count?: number
  est_read_minutes?: number
  sequence?: number
}

interface Meta {
  title: string
  author: string
  total_lines: number
  total_words: number
  est_read_minutes: number
  cover_title?: string
  cover_artist?: string
  cover_year?: string
  cover_image_url?: string
}

export default function HamletPreviewIndex() {
  const contentDir = path.join(process.cwd(), "content/hamlet")
  const meta: Meta = JSON.parse(fs.readFileSync(path.join(contentDir, "_meta.json"), "utf-8"))
  const toc: { entries: TocEntry[] } = JSON.parse(
    fs.readFileSync(path.join(contentDir, "toc.json"), "utf-8")
  )

  // Collect per-scene totals from the scene files
  const sceneTotals: Record<string, { glosses: number; annotations: number; trials: number }> = {}
  const sceneFiles = fs
    .readdirSync(contentDir)
    .filter((f) => f.startsWith("hamlet_act") && f.endsWith(".json"))

  let totalGlosses = 0
  let totalAnnotations = 0
  let totalTrials = 0

  for (const f of sceneFiles) {
    const s = JSON.parse(fs.readFileSync(path.join(contentDir, f), "utf-8"))
    sceneTotals[s.section_id] = {
      glosses: s.glosses?.length || 0,
      annotations: s.annotations?.length || 0,
      trials: s.trials?.length || 0,
    }
    totalGlosses += s.glosses?.length || 0
    totalAnnotations += s.annotations?.length || 0
    totalTrials += s.trials?.length || 0
  }

  return (
    <main style={{
      maxWidth: 780,
      margin: "0 auto",
      padding: "48px 24px",
      fontFamily: "ui-serif, Georgia, serif",
      color: "#1a1611",
      background: "#fbf8f3",
      minHeight: "100vh",
    }}>
      <nav style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, color: "#888", marginBottom: 8 }}>
        Hamlet preview — structured content
      </nav>
      <h1 style={{ fontSize: 42, marginTop: 0, marginBottom: 4, letterSpacing: -0.5 }}>{meta.title}</h1>
      <p style={{ fontSize: 18, fontStyle: "italic", color: "#555", margin: "0 0 32px" }}>{meta.author}</p>

      {meta.cover_image_url && (
        <figure style={{ margin: "0 0 32px", textAlign: "center" }}>
          <img
            src={meta.cover_image_url}
            alt={meta.cover_title}
            style={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain", border: "1px solid #ddd" }}
          />
          <figcaption style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
            {meta.cover_artist}, <i>{meta.cover_title}</i> ({meta.cover_year}) — Met CC0
          </figcaption>
        </figure>
      )}

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        padding: "16px 0",
        borderTop: "1px solid #e4dfd2",
        borderBottom: "1px solid #e4dfd2",
        marginBottom: 32,
      }}>
        <Stat label="Lines" value={meta.total_lines} />
        <Stat label="Glosses" value={totalGlosses} />
        <Stat label="Annotations" value={totalAnnotations} />
        <Stat label="Trials" value={totalTrials} />
      </section>

      <h2 style={{ fontSize: 22, marginBottom: 16 }}>Scenes</h2>
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {toc.entries.map((e, i) => {
          if (e.type === "act") {
            return (
              <li key={`act-${i}`} style={{ marginTop: 24, marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, letterSpacing: 2, textTransform: "uppercase", color: "#888", margin: 0 }}>
                  {e.title}
                </h3>
              </li>
            )
          }
          const totals = e.section_id ? sceneTotals[e.section_id] : null
          return (
            <li key={e.section_id} style={{ margin: "4px 0" }}>
              <Link
                href={`/hamlet-preview/${e.section_id}`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  textDecoration: "none",
                  color: "inherit",
                  padding: "10px 14px",
                  borderRadius: 6,
                  border: "1px solid transparent",
                  transition: "background 0.15s",
                }}
                className="scene-link"
              >
                <span style={{ fontWeight: 600, minWidth: 60 }}>{e.act}.{e.scene}</span>
                <span style={{ flex: 1, fontStyle: "italic" }}>{e.scene_title}</span>
                <span style={{ fontSize: 11, color: "#a8a294", fontVariant: "all-small-caps", letterSpacing: 1 }}>
                  {e.line_count} lines
                  {totals && ` · ${totals.glosses}g · ${totals.annotations}a · ${totals.trials}q`}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>

      <style dangerouslySetInnerHTML={{ __html: `
        .scene-link:hover {
          background: #f3efe6 !important;
          border-color: #e4dfd2 !important;
        }
      `}} />
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#888" }}>{label}</div>
    </div>
  )
}
