"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

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
  act: number | null
  scene: number | null
  scene_title: string
  sequence: number
  line_count: number
  word_count: number
  est_read_minutes: number
  lines: Line[]
  stage_directions: StageDirection[]
  glosses: Gloss[]
  annotations: Annotation[]
  trials: Trial[]
}
interface TocScene {
  section_id: string
  act: number | null
  scene: number | null
  scene_title: string
  type?: string
}

function applyGlosses(text: string, lineGlosses: Gloss[]): React.ReactNode[] {
  if (lineGlosses.length === 0) return [text]
  const sorted = [...lineGlosses].sort((a, b) => b.phrase.length - a.phrase.length)
  const nodes: React.ReactNode[] = [text]
  for (const g of sorted) {
    for (let i = 0; i < nodes.length; i++) {
      const piece = nodes[i]
      if (typeof piece !== "string") continue
      const idx = piece.toLowerCase().indexOf(g.phrase.toLowerCase())
      if (idx === -1) continue
      const before = piece.slice(0, idx)
      const match = piece.slice(idx, idx + g.phrase.length)
      const after = piece.slice(idx + g.phrase.length)
      const replacement: React.ReactNode[] = []
      if (before) replacement.push(before)
      replacement.push(
        <span
          key={g.id}
          className="gloss"
          data-definition={g.definition}
          style={{
            borderBottom: "1px dotted #b08d57",
            cursor: "help",
            position: "relative",
          }}
        >
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

function sceneLabel(s: { act: number | null; scene: number | null; type?: string; scene_title?: string }) {
  if (s.type === "chorus") return s.scene_title || "Chorus"
  if (s.act != null && s.scene != null) return `${s.act}.${s.scene}`
  return s.scene_title || "Scene"
}

export function SceneClient({
  section,
  prev,
  next,
  workId,
}: {
  section: Section
  prev: TocScene | null
  next: TocScene | null
  workId: string
}) {
  const [openAnnotation, setOpenAnnotation] = useState<string | null>(null)
  const [trialAnswers, setTrialAnswers] = useState<Record<string, number>>({})
  const [trialRevealed, setTrialRevealed] = useState<Record<string, boolean>>({})

  const glossesByLine = useMemo(() => {
    const map: Record<number, Gloss[]> = {}
    for (const g of section.glosses) {
      if (!map[g.line]) map[g.line] = []
      map[g.line].push(g)
    }
    return map
  }, [section.glosses])

  const stageDirsByLine = useMemo(() => {
    const map: Record<number, StageDirection[]> = {}
    for (const sd of section.stage_directions) {
      if (!map[sd.after_line]) map[sd.after_line] = []
      map[sd.after_line].push(sd)
    }
    return map
  }, [section.stage_directions])

  const annotationsByLine = useMemo(() => {
    const map: Record<number, Annotation[]> = {}
    for (const a of section.annotations) {
      if (!map[a.line_start]) map[a.line_start] = []
      map[a.line_start].push(a)
    }
    return map
  }, [section.annotations])

  const renderItems: React.ReactNode[] = []
  const openingDirs = stageDirsByLine[0] || []
  for (const sd of openingDirs) {
    renderItems.push(
      <div key={`sd-opening-${sd.text.slice(0, 20)}`} className="stage-direction">
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
        for (const sd of sds) {
          renderItems.push(
            <div key={`sd-${n}-${sd.text.slice(0, 20)}`} className="stage-direction">
              <em>{sd.text}</em>
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
        className={`verse-line ${isSecondOfShared ? "shared-continuation" : ""}`}
        data-line={line.number}
      >
        <div className="line-number">{isSecondOfShared ? "" : line.number}</div>
        <div className="line-body">
          {line.speaker && !isSecondOfShared && (
            <span className="speaker">{line.speaker}.</span>
          )}
          {isSecondOfShared && line.speaker && (
            <span className="speaker-inline">{line.speaker}.</span>
          )}
          <span className="line-text">{applyGlosses(line.text, lineGlosses)}</span>
        </div>
        <div className="line-marginalia">
          {annotationsHere.map((a) => (
            <button
              key={a.id}
              className="annotation-marker"
              onClick={() => setOpenAnnotation(openAnnotation === a.id ? null : a.id)}
              aria-label={`Annotation: ${a.title}`}
              title={a.title}
            >
              ✦
            </button>
          ))}
        </div>
      </div>
    )
    if (!isFirstOfShared) {
      const sds = stageDirsByLine[line.number] || []
      for (const sd of sds) {
        renderItems.push(
          <div key={`sd-after-${i}-${sd.text.slice(0, 20)}`} className="stage-direction">
            <em>{sd.text}</em>
          </div>
        )
      }
    }
    prevLineNumber = line.number
  }

  const openAnnotationData = openAnnotation
    ? section.annotations.find((a) => a.id === openAnnotation)
    : null

  const headerTitle =
    section.act != null && section.scene != null
      ? `Act ${toRoman(section.act)}, Scene ${toRoman(section.scene)}`
      : section.scene_title

  return (
    <div className="preview-page">
      <nav className="scene-nav">
        <Link href={`/work-preview/${workId}`} className="nav-link">← All scenes</Link>
        <div className="scene-title">
          <span className="scene-id">{sceneLabel(section)}</span>
          <span className="scene-loc">{section.scene_title}</span>
        </div>
        <div className="nav-cluster">
          {prev && (
            <Link href={`/work-preview/${workId}/${prev.section_id}`} className="nav-link">
              ← {sceneLabel(prev)}
            </Link>
          )}
          {next && (
            <Link href={`/work-preview/${workId}/${next.section_id}`} className="nav-link">
              {sceneLabel(next)} →
            </Link>
          )}
        </div>
      </nav>

      <header className="scene-header">
        <h1>{headerTitle}</h1>
        <p className="scene-location"><em>{section.scene_title}</em></p>
        <div className="scene-stats">
          <span>{section.line_count} lines</span>
          <span>·</span>
          <span>{section.glosses.length} glosses</span>
          <span>·</span>
          <span>{section.annotations.length} annotations</span>
          <span>·</span>
          <span>{section.trials.length} Trials</span>
        </div>
      </header>

      <article className="scene-body">{renderItems}</article>

      {section.trials.length > 0 && (
        <section className="trials-section">
          <h2>Take the Trial</h2>
          <p className="trials-intro">
            Answer the following to earn Wisdom. Anchors reference the lines above.
          </p>
          {section.trials.map((t, i) => {
            const answered = trialAnswers[t.id] !== undefined
            const revealed = trialRevealed[t.id]
            const isCorrect = trialAnswers[t.id] === t.answer_index
            return (
              <div key={t.id} className="trial">
                <div className="trial-head">
                  <span className="trial-num">Q{i + 1}</span>
                  <span className="trial-kind">{t.kind.replace("_", " ")}</span>
                  <span className="trial-anchor">
                    lines {t.anchor_line_start}
                    {t.anchor_line_start !== t.anchor_line_end && `–${t.anchor_line_end}`}
                  </span>
                  <span className="trial-reward">+{t.wisdom_reward} Wisdom</span>
                </div>
                <p className="trial-prompt">{t.prompt}</p>
                <div className="trial-options">
                  {t.options.map((opt, oi) => {
                    const selected = trialAnswers[t.id] === oi
                    const isAnswer = oi === t.answer_index
                    let cls = "trial-option"
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
                        onClick={() => {
                          if (revealed) return
                          setTrialAnswers((s) => ({ ...s, [t.id]: oi }))
                        }}
                        disabled={revealed}
                      >
                        <span className="trial-option-letter">{String.fromCharCode(65 + oi)}</span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {answered && !revealed && (
                  <button
                    className="trial-reveal"
                    onClick={() => setTrialRevealed((s) => ({ ...s, [t.id]: true }))}
                  >
                    Reveal answer
                  </button>
                )}
                {revealed && (
                  <div className={`trial-result ${isCorrect ? "correct" : "wrong"}`}>
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

      {openAnnotationData && (
        <div className="annotation-overlay" onClick={() => setOpenAnnotation(null)}>
          <div className="annotation-drawer" onClick={(e) => e.stopPropagation()}>
            <header className="annotation-head">
              <div className="annotation-meta">
                <span className="annotation-category">{openAnnotationData.category}</span>
                <span className="annotation-cite">{openAnnotationData.citation_display}</span>
              </div>
              <button onClick={() => setOpenAnnotation(null)} aria-label="Close">×</button>
            </header>
            <h2>{openAnnotationData.title}</h2>
            <div className="annotation-body">
              {openAnnotationData.body.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {openAnnotationData.sources.length > 0 && (
              <footer className="annotation-sources">
                <strong>Sources:</strong>
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
        body { background: #fbf8f3; margin: 0; }
        .preview-page {
          max-width: 780px; margin: 0 auto; padding: 24px 24px 96px;
          font-family: var(--font-serif, ui-serif, Georgia, serif); color: #1a1611; line-height: 1.7;
        }
        .scene-nav {
          display: flex; align-items: center; gap: 16px; padding: 12px 0;
          border-bottom: 1px solid #e4dfd2; font-size: 13px; margin-bottom: 24px;
        }
        .scene-title { flex: 1; display: flex; gap: 8px; align-items: baseline; }
        .scene-id { font-weight: 600; }
        .scene-loc { color: #888; font-style: italic; font-size: 12px; }
        .nav-link { color: #b08d57; text-decoration: none; padding: 4px 8px; border-radius: 4px; }
        .nav-link:hover { background: #f3efe6; }
        .nav-cluster { display: flex; gap: 8px; }
        .scene-header { margin-bottom: 32px; }
        .scene-header h1 { font-size: 32px; margin: 0 0 4px; letter-spacing: -0.5px; }
        .scene-location { color: #777; margin: 0 0 12px; }
        .scene-stats { font-size: 12px; letter-spacing: 1.2px; text-transform: uppercase; color: #a8a294; display: flex; gap: 8px; }
        .scene-body { border-top: 1px solid #e4dfd2; padding-top: 24px; }
        .verse-line { display: grid; grid-template-columns: 48px 1fr 28px; gap: 12px; padding: 2px 0; align-items: baseline; }
        .verse-line.shared-continuation { padding-top: 0; }
        .line-number { font-size: 11px; color: #c9c1ae; text-align: right; font-variant-numeric: tabular-nums; padding-top: 5px; }
        .line-body { font-size: 17px; }
        .speaker, .speaker-inline {
          font-variant-caps: all-small-caps; letter-spacing: 1.5px;
          font-weight: 600; color: #8b6a3d; margin-right: 8px;
        }
        .line-marginalia { padding-top: 4px; }
        .annotation-marker {
          background: none; border: none; color: #b08d57; cursor: pointer;
          font-size: 14px; padding: 0 4px; transition: transform 0.15s, color 0.15s;
        }
        .annotation-marker:hover { color: #8b6a3d; transform: scale(1.2); }
        .stage-direction {
          font-style: italic; color: #8a8270; padding: 10px 12px 10px 60px;
          font-size: 14px; background: rgba(176, 141, 87, 0.04);
          border-left: 2px solid #e4dfd2; margin: 8px 0;
        }
        .gloss { position: relative; }
        .gloss:hover::after {
          content: attr(data-definition); position: absolute;
          bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
          background: #1a1611; color: #fbf8f3; padding: 8px 12px;
          border-radius: 6px; font-size: 13px; font-style: normal;
          font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.4;
          white-space: normal; width: max-content; max-width: 320px;
          z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.15); pointer-events: none;
        }
        .gloss:hover::before {
          content: ""; position: absolute; bottom: calc(100% + 2px); left: 50%;
          transform: translateX(-50%); border: 6px solid transparent;
          border-top-color: #1a1611; z-index: 10;
        }
        .trials-section { margin-top: 64px; padding: 24px; background: #f3efe6; border-radius: 12px; }
        .trials-section h2 { margin-top: 0; font-size: 24px; }
        .trials-intro { color: #888; font-size: 14px; margin-bottom: 24px; }
        .trial { background: #fbf8f3; padding: 18px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e4dfd2; }
        .trial-head { display: flex; gap: 12px; font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; color: #a8a294; margin-bottom: 8px; align-items: center; }
        .trial-num { color: #b08d57; font-weight: 600; }
        .trial-kind { color: #888; }
        .trial-anchor { flex: 1; }
        .trial-reward { color: #8b6a3d; font-weight: 600; }
        .trial-prompt { font-size: 16px; margin: 0 0 12px; line-height: 1.5; }
        .trial-options { display: flex; flex-direction: column; gap: 6px; }
        .trial-option {
          text-align: left; background: #fbf8f3; border: 1px solid #e4dfd2;
          padding: 10px 14px; border-radius: 6px; font-family: inherit;
          font-size: 15px; cursor: pointer; display: flex; gap: 12px; align-items: flex-start;
        }
        .trial-option:hover { background: #f3efe6; }
        .trial-option.selected { background: #f3efe6; border-color: #b08d57; }
        .trial-option.correct { background: #e8f0e4; border-color: #6b8c5a; color: #3e5734; }
        .trial-option.wrong { background: #f5e5e2; border-color: #b07373; color: #734a4a; }
        .trial-option-letter { font-weight: 600; color: #888; min-width: 16px; }
        .trial-reveal {
          margin-top: 10px; background: #b08d57; color: white; border: none;
          padding: 8px 16px; border-radius: 6px; cursor: pointer;
          font-family: inherit; font-size: 14px;
        }
        .trial-reveal:hover { background: #8b6a3d; }
        .trial-result { margin-top: 10px; font-size: 14px; padding: 8px 12px; border-radius: 4px; }
        .trial-result.correct { background: #e8f0e4; color: #3e5734; }
        .trial-result.wrong { background: #f5e5e2; color: #734a4a; }
        .annotation-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; justify-content: flex-end; z-index: 100;
        }
        .annotation-drawer {
          width: 100%; max-width: 460px; background: #fbf8f3; padding: 24px;
          overflow-y: auto; box-shadow: -8px 0 24px rgba(0,0,0,0.12);
        }
        .annotation-head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e4dfd2;
        }
        .annotation-meta { display: flex; gap: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; }
        .annotation-category { color: #b08d57; font-weight: 600; }
        .annotation-cite { color: #888; }
        .annotation-head button { background: none; border: none; font-size: 22px; cursor: pointer; color: #888; padding: 0 8px; }
        .annotation-drawer h2 { font-size: 22px; margin: 0 0 16px; letter-spacing: -0.3px; }
        .annotation-body p { font-size: 15px; line-height: 1.65; color: #2a251e; margin: 0 0 12px; }
        .annotation-sources { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4dfd2; font-size: 13px; color: #777; }
        .annotation-sources strong { display: block; text-transform: uppercase; letter-spacing: 1.2px; font-size: 11px; margin-bottom: 6px; }
        .annotation-sources ul { margin: 0; padding-left: 20px; }
      `}</style>
    </div>
  )
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
