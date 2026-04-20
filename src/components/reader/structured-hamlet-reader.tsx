"use client"

/**
 * Structured Hamlet reader — integrated into the main /read/hamlet route.
 * Renders the line-array content format (lines + speakers + stage directions +
 * glosses + annotations + Trials) produced by the Hamlet ingestion sprint.
 *
 * Uses native styles (no external libs beyond React) to keep bundle cost low
 * and avoid conflict with the existing reader's CSS classes.
 */

import { useEffect, useMemo, useState } from "react"

interface Line {
  number: number
  speaker?: string
  text: string
}
interface StageDirection {
  after_line: number
  text: string
}
interface Gloss {
  id: string
  line: number
  phrase: string
  definition: string
}
interface Annotation {
  id: string
  line_start: number
  line_end: number
  citation_display: string
  category: string
  title: string
  body: string
  sources: string[]
}
interface Trial {
  id: string
  kind: string
  prompt: string
  options: string[]
  answer_index: number
  wisdom_reward: number
  anchor_line_start: number
  anchor_line_end: number
}
interface Section {
  section_id: string
  act: number
  scene: number
  scene_title: string
  line_count: number
  word_count: number
  est_read_minutes: number
  lines: Line[]
  stage_directions: StageDirection[]
  glosses: Gloss[]
  annotations: Annotation[]
  trials: Trial[]
}
interface TocEntry {
  type: "act" | "scene"
  act?: number
  scene?: number
  title?: string
  section_id?: string
  scene_title?: string
  line_count?: number
}
interface Meta {
  title: string
  author: string
  total_lines: number
  total_words: number
  cover_title?: string
  cover_artist?: string
  cover_year?: string
  cover_image_url?: string
}

/** Normalize typography for gloss matching. SE text uses curly quotes and
 *  em-dashes; gloss phrases in the seed data use straight equivalents. */
function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u00A0/g, " ")
}

/**
 * Wrap each glossed phrase in the line text with an interactive span.
 * Searches the normalized text and slices the original at the same codepoint
 * boundaries so punctuation in the rendered output is preserved.
 */
function applyGlosses(text: string, lineGlosses: Gloss[]): React.ReactNode[] {
  if (lineGlosses.length === 0) return [text]
  const sorted = [...lineGlosses].sort((a, b) => b.phrase.length - a.phrase.length)
  const nodes: React.ReactNode[] = [text]

  for (const g of sorted) {
    for (let i = 0; i < nodes.length; i++) {
      const piece = nodes[i]
      if (typeof piece !== "string") continue

      const normPiece = normalizeForMatch(piece)
      const normPhrase = normalizeForMatch(g.phrase)
      const idx = normPiece.indexOf(normPhrase)
      if (idx === -1) continue

      // Normalization is character-for-character (no insertions/removals);
      // indices map 1:1 to the original string.
      const before = piece.slice(0, idx)
      const match = piece.slice(idx, idx + g.phrase.length)
      const after = piece.slice(idx + g.phrase.length)
      const replacement: React.ReactNode[] = []
      if (before) replacement.push(before)
      replacement.push(
        <span key={g.id} className="shr-gloss" data-definition={g.definition}>
          {match}
        </span>
      )
      if (after) replacement.push(after)
      nodes.splice(i, 1, ...replacement)
      break
    }
  }
  return nodes
}

function toRoman(n: number): string {
  const vals = [10, 9, 5, 4, 1]
  const syms = ["X", "IX", "V", "IV", "I"]
  let result = ""
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i]
      n -= vals[i]
    }
  }
  return result
}

export function StructuredHamletReader({ workId }: { workId: string }) {
  const [meta, setMeta] = useState<Meta | null>(null)
  const [toc, setToc] = useState<{ entries: TocEntry[] } | null>(null)
  const [currentSceneId, setCurrentSceneId] = useState<string>("")
  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)
  const [sceneLoading, setSceneLoading] = useState(false)
  const [openAnnotation, setOpenAnnotation] = useState<string | null>(null)
  const [trialAnswers, setTrialAnswers] = useState<Record<string, number>>({})
  const [trialRevealed, setTrialRevealed] = useState<Record<string, boolean>>({})
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Load meta + TOC on mount
  useEffect(() => {
    fetch(`/api/structured/${workId}`)
      .then((r) => r.json())
      .then((data) => {
        setMeta(data.meta)
        setToc(data.toc)
        // default to first scene
        const firstScene = data.toc.entries.find((e: TocEntry) => e.type === "scene")
        if (firstScene?.section_id) setCurrentSceneId(firstScene.section_id)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [workId])

  // Load section when currentSceneId changes
  useEffect(() => {
    if (!currentSceneId) return
    setSceneLoading(true)
    fetch(`/api/structured/${workId}/${currentSceneId}`)
      .then((r) => r.json())
      .then((s) => {
        setSection(s)
        setSceneLoading(false)
        setOpenAnnotation(null)
        setTrialAnswers({})
        setTrialRevealed({})
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
      .catch(() => setSceneLoading(false))
  }, [workId, currentSceneId])

  const glossesByLine = useMemo(() => {
    if (!section) return {}
    const map: Record<number, Gloss[]> = {}
    for (const g of section.glosses) {
      if (!map[g.line]) map[g.line] = []
      map[g.line].push(g)
    }
    return map
  }, [section])

  const stageDirsByLine = useMemo(() => {
    if (!section) return {}
    const map: Record<number, StageDirection[]> = {}
    for (const sd of section.stage_directions) {
      if (!map[sd.after_line]) map[sd.after_line] = []
      map[sd.after_line].push(sd)
    }
    return map
  }, [section])

  const annotationsByLine = useMemo(() => {
    if (!section) return {}
    const map: Record<number, Annotation[]> = {}
    for (const a of section.annotations) {
      if (!map[a.line_start]) map[a.line_start] = []
      map[a.line_start].push(a)
    }
    return map
  }, [section])

  const scenes: TocEntry[] = useMemo(
    () => toc?.entries.filter((e) => e.type === "scene") || [],
    [toc]
  )

  const currentIdx = scenes.findIndex((s) => s.section_id === currentSceneId)
  const prevScene = currentIdx > 0 ? scenes[currentIdx - 1] : null
  const nextScene = currentIdx < scenes.length - 1 ? scenes[currentIdx + 1] : null

  if (loading || !meta || !toc) {
    return <div className="shr-loading">Loading Hamlet…</div>
  }

  // Build render items
  const renderItems: React.ReactNode[] = []
  if (section) {
    const openingDirs = stageDirsByLine[0] || []
    for (let i = 0; i < openingDirs.length; i++) {
      const sd = openingDirs[i]
      renderItems.push(
        <div key={`sd-opening-${i}`} className="shr-stage-direction">
          <em>{sd.text}</em>
        </div>
      )
    }

    let prevLineNumber = 0
    for (let i = 0; i < section.lines.length; i++) {
      const line = section.lines[i]

      if (line.number > prevLineNumber) {
        for (let n = prevLineNumber + 1; n < line.number; n++) {
          const sds = stageDirsByLine[n] || []
          for (let j = 0; j < sds.length; j++) {
            renderItems.push(
              <div key={`sd-${n}-${j}`} className="shr-stage-direction">
                <em>{sds[j].text}</em>
              </div>
            )
          }
        }
      }

      const nextLine = section.lines[i + 1]
      const isFirstOfShared = nextLine && nextLine.number === line.number
      const isSecondOfShared = i > 0 && section.lines[i - 1].number === line.number

      const annotationsHere = annotationsByLine[line.number] || []
      const lineGlosses = glossesByLine[line.number] || []

      renderItems.push(
        <div
          key={`line-${i}`}
          className={`shr-verse-line ${isSecondOfShared ? "shr-shared-continuation" : ""}`}
          data-line={line.number}
        >
          <div className="shr-line-number">
            {isSecondOfShared ? "" : line.number}
          </div>
          <div className="shr-line-body">
            {line.speaker && !isSecondOfShared && (
              <span className="shr-speaker">{line.speaker}.</span>
            )}
            {isSecondOfShared && line.speaker && (
              <span className="shr-speaker-inline">{line.speaker}.</span>
            )}
            <span>{applyGlosses(line.text, lineGlosses)}</span>
          </div>
          <div className="shr-marginalia">
            {annotationsHere.map((a) => (
              <button
                key={a.id}
                className="shr-annotation-marker"
                onClick={() => setOpenAnnotation(openAnnotation === a.id ? null : a.id)}
                aria-label={`Annotation: ${a.title}`}
                title={a.title}
                type="button"
              >
                ✦
              </button>
            ))}
          </div>
        </div>
      )

      if (!isFirstOfShared) {
        const sds = stageDirsByLine[line.number] || []
        for (let j = 0; j < sds.length; j++) {
          renderItems.push(
            <div key={`sd-after-${i}-${j}`} className="shr-stage-direction">
              <em>{sds[j].text}</em>
            </div>
          )
        }
      }

      prevLineNumber = line.number
    }
  }

  const openAnnotationData = openAnnotation && section
    ? section.annotations.find((a) => a.id === openAnnotation)
    : null

  return (
    <div className="shr-root">
      {/* Sidebar: scene list */}
      <aside className={`shr-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="shr-sidebar-head">
          <h2>{meta.title}</h2>
          <p>{meta.author}</p>
        </div>
        <nav className="shr-scene-list">
          {toc.entries.map((e, i) => {
            if (e.type === "act") {
              return (
                <div key={`act-${i}`} className="shr-act-header">
                  {e.title}
                </div>
              )
            }
            const active = e.section_id === currentSceneId
            return (
              <button
                key={e.section_id}
                className={`shr-scene-item ${active ? "active" : ""}`}
                onClick={() => e.section_id && setCurrentSceneId(e.section_id)}
                type="button"
              >
                <span className="shr-scene-num">{e.act}.{e.scene}</span>
                <span className="shr-scene-loc">{e.scene_title}</span>
                <span className="shr-scene-count">{e.line_count}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main column */}
      <main className="shr-main">
        <header className="shr-header">
          <button
            className="shr-sidebar-toggle"
            onClick={() => setSidebarOpen((s) => !s)}
            type="button"
            aria-label="Toggle scene list"
          >
            {sidebarOpen ? "‹" : "›"}
          </button>
          {section && (
            <>
              <h1>Act {toRoman(section.act)}, Scene {toRoman(section.scene)}</h1>
              <p className="shr-location"><em>{section.scene_title}</em></p>
              <div className="shr-stats">
                <span>{section.line_count} lines</span>
                <span>·</span>
                <span>{section.glosses.length} glosses</span>
                <span>·</span>
                <span>{section.annotations.length} annotations</span>
                <span>·</span>
                <span>{section.trials.length} Trials</span>
              </div>
            </>
          )}
        </header>

        <article className="shr-body">
          {sceneLoading ? <div className="shr-loading">Loading scene…</div> : renderItems}
        </article>

        {section && section.trials.length > 0 && (
          <section className="shr-trials">
            <h2>Take the Trial</h2>
            <p className="shr-trials-intro">
              Answer to earn Wisdom. Each question anchors to specific lines above.
            </p>
            {section.trials.map((t, ti) => {
              const answered = trialAnswers[t.id] !== undefined
              const revealed = trialRevealed[t.id]
              const isCorrect = trialAnswers[t.id] === t.answer_index
              return (
                <div key={t.id} className="shr-trial">
                  <div className="shr-trial-head">
                    <span className="shr-trial-num">Q{ti + 1}</span>
                    <span className="shr-trial-kind">{t.kind.replace("_", " ")}</span>
                    <span className="shr-trial-anchor">
                      lines {t.anchor_line_start}
                      {t.anchor_line_start !== t.anchor_line_end && `–${t.anchor_line_end}`}
                    </span>
                    <span className="shr-trial-reward">+{t.wisdom_reward} Wisdom</span>
                  </div>
                  <p className="shr-trial-prompt">{t.prompt}</p>
                  <div className="shr-trial-options">
                    {t.options.map((opt, oi) => {
                      const selected = trialAnswers[t.id] === oi
                      const isAnswer = oi === t.answer_index
                      let cls = "shr-trial-option"
                      if (revealed) {
                        if (isAnswer) cls += " correct"
                        else if (selected) cls += " wrong"
                      } else if (selected) {
                        cls += " selected"
                      }
                      return (
                        <button
                          key={oi}
                          className={cls}
                          type="button"
                          onClick={() => {
                            if (revealed) return
                            setTrialAnswers((s) => ({ ...s, [t.id]: oi }))
                          }}
                          disabled={revealed}
                        >
                          <span className="shr-trial-letter">{String.fromCharCode(65 + oi)}</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {answered && !revealed && (
                    <button
                      type="button"
                      className="shr-trial-reveal"
                      onClick={() => setTrialRevealed((s) => ({ ...s, [t.id]: true }))}
                    >
                      Reveal answer
                    </button>
                  )}
                  {revealed && (
                    <div className={`shr-trial-result ${isCorrect ? "correct" : "wrong"}`}>
                      {isCorrect
                        ? `Correct — +${t.wisdom_reward} Wisdom.`
                        : `Not quite. The correct answer was ${String.fromCharCode(65 + t.answer_index)}.`}
                    </div>
                  )}
                </div>
              )
            })}
          </section>
        )}

        {section && (
          <nav className="shr-scene-nav">
            {prevScene && (
              <button
                type="button"
                onClick={() => prevScene.section_id && setCurrentSceneId(prevScene.section_id)}
                className="shr-nav-btn"
              >
                ← Act {prevScene.act}, Scene {prevScene.scene}
              </button>
            )}
            <div style={{ flex: 1 }} />
            {nextScene && (
              <button
                type="button"
                onClick={() => nextScene.section_id && setCurrentSceneId(nextScene.section_id)}
                className="shr-nav-btn"
              >
                Act {nextScene.act}, Scene {nextScene.scene} →
              </button>
            )}
          </nav>
        )}
      </main>

      {openAnnotationData && (
        <div className="shr-annotation-overlay" onClick={() => setOpenAnnotation(null)}>
          <div className="shr-annotation-drawer" onClick={(e) => e.stopPropagation()}>
            <header className="shr-annotation-head">
              <div className="shr-annotation-meta">
                <span className="shr-annotation-category">{openAnnotationData.category}</span>
                <span className="shr-annotation-cite">{openAnnotationData.citation_display}</span>
              </div>
              <button
                onClick={() => setOpenAnnotation(null)}
                aria-label="Close"
                type="button"
              >×</button>
            </header>
            <h2>{openAnnotationData.title}</h2>
            <div className="shr-annotation-body">
              {openAnnotationData.body.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {openAnnotationData.sources.length > 0 && (
              <footer className="shr-annotation-sources">
                <strong>Sources</strong>
                <ul>
                  {openAnnotationData.sources.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </footer>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .shr-root {
          display: flex;
          gap: 0;
          min-height: calc(100vh - 56px);
          background: var(--background, #fbf8f3);
          color: var(--foreground, #1a1611);
          font-family: var(--font-serif, ui-serif, Georgia, serif);
        }
        .shr-loading {
          padding: 48px;
          text-align: center;
          color: var(--muted-foreground, #888);
        }
        .shr-sidebar {
          width: 280px;
          flex-shrink: 0;
          border-right: 1px solid var(--border, #e4dfd2);
          overflow-y: auto;
          max-height: calc(100vh - 56px);
          position: sticky;
          top: 56px;
          transition: width 0.25s ease, opacity 0.25s ease;
        }
        .shr-sidebar.closed {
          width: 0;
          opacity: 0;
          overflow: hidden;
        }
        .shr-sidebar-head {
          padding: 20px 20px 12px;
          border-bottom: 1px solid var(--border, #e4dfd2);
        }
        .shr-sidebar-head h2 {
          margin: 0;
          font-size: 18px;
          letter-spacing: -0.3px;
        }
        .shr-sidebar-head p {
          margin: 2px 0 0;
          color: var(--muted-foreground, #888);
          font-size: 13px;
          font-style: italic;
        }
        .shr-scene-list {
          padding: 8px 0;
        }
        .shr-act-header {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--muted-foreground, #888);
          padding: 16px 20px 6px;
        }
        .shr-scene-item {
          width: 100%;
          display: flex;
          gap: 10px;
          align-items: baseline;
          padding: 8px 20px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          color: inherit;
          font-size: 14px;
          transition: background 0.15s;
        }
        .shr-scene-item:hover {
          background: var(--muted, #f3efe6);
        }
        .shr-scene-item.active {
          background: var(--muted, #f3efe6);
          border-left: 3px solid #b08d57;
          padding-left: 17px;
        }
        .shr-scene-num {
          font-weight: 600;
          min-width: 28px;
          color: #b08d57;
        }
        .shr-scene-loc {
          flex: 1;
          font-style: italic;
          color: var(--muted-foreground, #666);
          font-size: 12px;
          line-height: 1.3;
        }
        .shr-scene-count {
          font-size: 10px;
          color: var(--muted-foreground, #999);
          font-variant-numeric: tabular-nums;
        }

        .shr-main {
          flex: 1;
          max-width: 780px;
          margin: 0 auto;
          padding: 32px 32px 96px;
          min-width: 0;
        }
        .shr-header {
          margin-bottom: 32px;
          position: relative;
        }
        .shr-sidebar-toggle {
          position: absolute;
          top: 0;
          left: -24px;
          background: none;
          border: 1px solid var(--border, #e4dfd2);
          border-radius: 4px;
          width: 24px;
          height: 28px;
          cursor: pointer;
          font-size: 14px;
          color: var(--muted-foreground, #888);
        }
        .shr-sidebar-toggle:hover {
          background: var(--muted, #f3efe6);
        }
        .shr-header h1 {
          font-size: 30px;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        }
        .shr-location {
          color: var(--muted-foreground, #777);
          margin: 0 0 12px;
        }
        .shr-stats {
          display: flex;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--muted-foreground, #a8a294);
        }

        .shr-body {
          border-top: 1px solid var(--border, #e4dfd2);
          padding-top: 24px;
        }
        .shr-verse-line {
          display: grid;
          grid-template-columns: 48px 1fr 28px;
          gap: 12px;
          padding: 2px 0;
          align-items: baseline;
        }
        .shr-verse-line.shr-shared-continuation {
          padding-top: 0;
        }
        .shr-line-number {
          font-size: 11px;
          color: #c9c1ae;
          text-align: right;
          font-variant-numeric: tabular-nums;
          padding-top: 5px;
        }
        .shr-line-body {
          font-size: 17px;
          line-height: 1.7;
        }
        .shr-speaker, .shr-speaker-inline {
          font-variant-caps: all-small-caps;
          letter-spacing: 1.5px;
          font-weight: 600;
          color: #8b6a3d;
          margin-right: 8px;
        }
        .shr-marginalia {
          padding-top: 4px;
        }
        .shr-annotation-marker {
          background: none;
          border: none;
          color: #b08d57;
          cursor: pointer;
          font-size: 14px;
          padding: 0 4px;
          transition: transform 0.15s, color 0.15s;
        }
        .shr-annotation-marker:hover {
          color: #8b6a3d;
          transform: scale(1.25);
        }

        .shr-stage-direction {
          font-style: italic;
          color: #8a8270;
          padding: 10px 12px 10px 60px;
          font-size: 14px;
          background: rgba(176, 141, 87, 0.04);
          border-left: 2px solid var(--border, #e4dfd2);
          margin: 8px 0;
        }

        .shr-gloss {
          position: relative;
          border-bottom: 1px dotted #b08d57;
          cursor: help;
        }
        .shr-gloss:hover::after {
          content: attr(data-definition);
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #1a1611;
          color: #fbf8f3;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-style: normal;
          font-family: ui-sans-serif, system-ui, sans-serif;
          line-height: 1.4;
          width: max-content;
          max-width: 320px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
          pointer-events: none;
        }
        .shr-gloss:hover::before {
          content: "";
          position: absolute;
          bottom: calc(100% + 2px);
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #1a1611;
          z-index: 10;
        }

        .shr-trials {
          margin-top: 64px;
          padding: 28px;
          background: var(--muted, #f3efe6);
          border-radius: 14px;
        }
        .shr-trials h2 {
          margin: 0 0 4px;
          font-size: 24px;
        }
        .shr-trials-intro {
          color: var(--muted-foreground, #888);
          font-size: 14px;
          margin-bottom: 24px;
        }
        .shr-trial {
          background: var(--background, #fbf8f3);
          padding: 18px;
          border-radius: 8px;
          margin-bottom: 16px;
          border: 1px solid var(--border, #e4dfd2);
        }
        .shr-trial-head {
          display: flex;
          gap: 12px;
          align-items: center;
          font-size: 11px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--muted-foreground, #a8a294);
          margin-bottom: 8px;
        }
        .shr-trial-num { color: #b08d57; font-weight: 600; }
        .shr-trial-anchor { flex: 1; }
        .shr-trial-reward { color: #8b6a3d; font-weight: 600; }
        .shr-trial-prompt {
          font-size: 16px;
          margin: 0 0 12px;
          line-height: 1.5;
        }
        .shr-trial-options {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .shr-trial-option {
          text-align: left;
          background: var(--background, #fbf8f3);
          border: 1px solid var(--border, #e4dfd2);
          padding: 10px 14px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 15px;
          cursor: pointer;
          color: inherit;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .shr-trial-option:hover { background: var(--muted, #f3efe6); }
        .shr-trial-option.selected { background: var(--muted, #f3efe6); border-color: #b08d57; }
        .shr-trial-option.correct { background: #e8f0e4; border-color: #6b8c5a; color: #3e5734; }
        .shr-trial-option.wrong { background: #f5e5e2; border-color: #b07373; color: #734a4a; }
        .shr-trial-letter {
          font-weight: 600;
          color: var(--muted-foreground, #888);
          min-width: 16px;
        }
        .shr-trial-reveal {
          margin-top: 10px;
          background: #b08d57;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
        }
        .shr-trial-reveal:hover { background: #8b6a3d; }
        .shr-trial-result {
          margin-top: 10px;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 4px;
        }
        .shr-trial-result.correct { background: #e8f0e4; color: #3e5734; }
        .shr-trial-result.wrong { background: #f5e5e2; color: #734a4a; }

        .shr-scene-nav {
          display: flex;
          gap: 16px;
          padding: 32px 0;
          border-top: 1px solid var(--border, #e4dfd2);
          margin-top: 32px;
        }
        .shr-nav-btn {
          background: none;
          border: 1px solid var(--border, #e4dfd2);
          padding: 10px 16px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          color: inherit;
        }
        .shr-nav-btn:hover {
          background: var(--muted, #f3efe6);
          border-color: #b08d57;
          color: #b08d57;
        }

        .shr-annotation-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          justify-content: flex-end;
          z-index: 100;
          backdrop-filter: blur(2px);
        }
        .shr-annotation-drawer {
          width: 100%;
          max-width: 480px;
          background: var(--background, #fbf8f3);
          padding: 28px;
          overflow-y: auto;
          box-shadow: -8px 0 24px rgba(0, 0, 0, 0.14);
        }
        .shr-annotation-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border, #e4dfd2);
        }
        .shr-annotation-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }
        .shr-annotation-category {
          color: #b08d57;
          font-weight: 600;
        }
        .shr-annotation-cite {
          color: var(--muted-foreground, #888);
        }
        .shr-annotation-head button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--muted-foreground, #888);
          padding: 0 8px;
        }
        .shr-annotation-drawer h2 {
          font-size: 24px;
          margin: 0 0 16px;
          letter-spacing: -0.3px;
        }
        .shr-annotation-body p {
          font-size: 15px;
          line-height: 1.7;
          margin: 0 0 14px;
        }
        .shr-annotation-sources {
          margin-top: 28px;
          padding-top: 16px;
          border-top: 1px solid var(--border, #e4dfd2);
          font-size: 13px;
          color: var(--muted-foreground, #777);
        }
        .shr-annotation-sources strong {
          display: block;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-size: 11px;
          margin-bottom: 6px;
        }
        .shr-annotation-sources ul {
          margin: 0;
          padding-left: 20px;
        }

        /* Dark mode support via next-themes [data-theme="dark"] or .dark class */
        .dark .shr-gloss, [data-theme="dark"] .shr-gloss {
          border-bottom-color: #c9a670;
        }
        .dark .shr-speaker, .dark .shr-speaker-inline,
        [data-theme="dark"] .shr-speaker, [data-theme="dark"] .shr-speaker-inline {
          color: #c9a670;
        }
        .dark .shr-scene-num, .dark .shr-annotation-category,
        .dark .shr-trial-num, .dark .shr-trial-reward,
        [data-theme="dark"] .shr-scene-num, [data-theme="dark"] .shr-annotation-category,
        [data-theme="dark"] .shr-trial-num, [data-theme="dark"] .shr-trial-reward {
          color: #c9a670;
        }
        .dark .shr-line-number,
        [data-theme="dark"] .shr-line-number {
          color: #6b6456;
        }
      `}</style>
    </div>
  )
}
