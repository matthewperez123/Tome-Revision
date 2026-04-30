"use client"

/**
 * Structured-content enhancements — glosses, scholarly annotations, and
 * Trials layered onto the existing HTML chapter reader without disturbing
 * its formatting. Mounts alongside the chapter body and:
 *
 *   1. Scans `[data-reader-text]` for glossed phrases and wraps matches in
 *      spans with hover tooltips (dotted underline, Kindle-subtle).
 *   2. Adds clickable ✦ monograms next to annotation anchor passages,
 *      opening a side drawer with Virgil's scholarly note.
 *   3. Renders the scene Trial quiz as a section below the chapter body,
 *      appearing once the reader has scrolled to the end.
 */

import { useEffect, useMemo, useRef, useState } from "react"

// ── Chapter index → structured scene ID mappings ───────────────────────
// The existing reader loads /content/{workId}/ch-{N}.json. Only the scene
// chapters have structured content; Dramatis Personae and Act title pages
// are skipped.

const HAMLET_CHAPTER_TO_SCENE: Record<number, string> = {
  2: "hamlet_act1_scene1",
  3: "hamlet_act1_scene2",
  4: "hamlet_act1_scene3",
  5: "hamlet_act1_scene4",
  6: "hamlet_act1_scene5",
  8: "hamlet_act2_scene1",
  9: "hamlet_act2_scene2",
  11: "hamlet_act3_scene1",
  12: "hamlet_act3_scene2",
  13: "hamlet_act3_scene3",
  14: "hamlet_act3_scene4",
  16: "hamlet_act4_scene1",
  17: "hamlet_act4_scene2",
  18: "hamlet_act4_scene3",
  19: "hamlet_act4_scene4",
  20: "hamlet_act4_scene5",
  21: "hamlet_act4_scene6",
  22: "hamlet_act4_scene7",
  24: "hamlet_act5_scene1",
  25: "hamlet_act5_scene2",
}

// Othello: 21 chapters. Dramatis Personae is ch-0; Act title pages are at
// ch-1, 5, 9, 14, 18. The 15 scene chapters are the rest.
// Macbeth: 34 chapters total. Dramatis Personae (ch-0) and Act title pages
// (ch-1, 9, 14, 21, 25) are not scenes. 28 scene chapters remain.
const MACBETH_CHAPTER_TO_SCENE: Record<number, string> = {
  2: "macbeth_act1_scene1",
  3: "macbeth_act1_scene2",
  4: "macbeth_act1_scene3",
  5: "macbeth_act1_scene4",
  6: "macbeth_act1_scene5",
  7: "macbeth_act1_scene6",
  8: "macbeth_act1_scene7",
  10: "macbeth_act2_scene1",
  11: "macbeth_act2_scene2",
  12: "macbeth_act2_scene3",
  13: "macbeth_act2_scene4",
  15: "macbeth_act3_scene1",
  16: "macbeth_act3_scene2",
  17: "macbeth_act3_scene3",
  18: "macbeth_act3_scene4",
  19: "macbeth_act3_scene5",
  20: "macbeth_act3_scene6",
  22: "macbeth_act4_scene1",
  23: "macbeth_act4_scene2",
  24: "macbeth_act4_scene3",
  26: "macbeth_act5_scene1",
  27: "macbeth_act5_scene2",
  28: "macbeth_act5_scene3",
  29: "macbeth_act5_scene4",
  30: "macbeth_act5_scene5",
  31: "macbeth_act5_scene6",
  32: "macbeth_act5_scene7",
  33: "macbeth_act5_scene8",
}

const OTHELLO_CHAPTER_TO_SCENE: Record<number, string> = {
  2: "othello_act1_scene1",
  3: "othello_act1_scene2",
  4: "othello_act1_scene3",
  6: "othello_act2_scene1",
  7: "othello_act2_scene2",
  8: "othello_act2_scene3",
  10: "othello_act3_scene1",
  11: "othello_act3_scene2",
  12: "othello_act3_scene3",
  13: "othello_act3_scene4",
  15: "othello_act4_scene1",
  16: "othello_act4_scene2",
  17: "othello_act4_scene3",
  19: "othello_act5_scene1",
  20: "othello_act5_scene2",
}

// King Lear: 32 chapters. ch-0 Dramatis Personae, Act title pages at
// ch-1/7/12/20/28. 26 scenes (5-4-7-7-3, conflated Q1/F1 text).
const KING_LEAR_CHAPTER_TO_SCENE: Record<number, string> = {
  2: "king_lear_act1_scene1",
  3: "king_lear_act1_scene2",
  4: "king_lear_act1_scene3",
  5: "king_lear_act1_scene4",
  6: "king_lear_act1_scene5",
  8: "king_lear_act2_scene1",
  9: "king_lear_act2_scene2",
  10: "king_lear_act2_scene3",
  11: "king_lear_act2_scene4",
  13: "king_lear_act3_scene1",
  14: "king_lear_act3_scene2",
  15: "king_lear_act3_scene3",
  16: "king_lear_act3_scene4",
  17: "king_lear_act3_scene5",
  18: "king_lear_act3_scene6",
  19: "king_lear_act3_scene7",
  21: "king_lear_act4_scene1",
  22: "king_lear_act4_scene2",
  23: "king_lear_act4_scene3",
  24: "king_lear_act4_scene4",
  25: "king_lear_act4_scene5",
  26: "king_lear_act4_scene6",
  27: "king_lear_act4_scene7",
  29: "king_lear_act5_scene1",
  30: "king_lear_act5_scene2",
  31: "king_lear_act5_scene3",
}

// Richard III: 31 chapters. ch-0 Dramatis Personae, Act title pages at
// ch-1/6/11/19/25. 25 scenes (4-4-7-5-5). No choric passages.
const RICHARD_III_CHAPTER_TO_SCENE: Record<number, string> = {
  2: "richard_iii_act1_scene1",
  3: "richard_iii_act1_scene2",
  4: "richard_iii_act1_scene3",
  5: "richard_iii_act1_scene4",
  7: "richard_iii_act2_scene1",
  8: "richard_iii_act2_scene2",
  9: "richard_iii_act2_scene3",
  10: "richard_iii_act2_scene4",
  12: "richard_iii_act3_scene1",
  13: "richard_iii_act3_scene2",
  14: "richard_iii_act3_scene3",
  15: "richard_iii_act3_scene4",
  16: "richard_iii_act3_scene5",
  17: "richard_iii_act3_scene6",
  18: "richard_iii_act3_scene7",
  20: "richard_iii_act4_scene1",
  21: "richard_iii_act4_scene2",
  22: "richard_iii_act4_scene3",
  23: "richard_iii_act4_scene4",
  24: "richard_iii_act4_scene5",
  26: "richard_iii_act5_scene1",
  27: "richard_iii_act5_scene2",
  28: "richard_iii_act5_scene3",
  29: "richard_iii_act5_scene4",
  30: "richard_iii_act5_scene5",
}

// Julius Caesar: 24 chapters. ch-0 Dramatis Personae, Act title pages at
// ch-1/5/10/14/18. 18 scenes (3-4-3-3-5).
const JULIUS_CAESAR_CHAPTER_TO_SCENE: Record<number, string> = {
  2: "julius_caesar_act1_scene1",
  3: "julius_caesar_act1_scene2",
  4: "julius_caesar_act1_scene3",
  6: "julius_caesar_act2_scene1",
  7: "julius_caesar_act2_scene2",
  8: "julius_caesar_act2_scene3",
  9: "julius_caesar_act2_scene4",
  11: "julius_caesar_act3_scene1",
  12: "julius_caesar_act3_scene2",
  13: "julius_caesar_act3_scene3",
  15: "julius_caesar_act4_scene1",
  16: "julius_caesar_act4_scene2",
  17: "julius_caesar_act4_scene3",
  19: "julius_caesar_act5_scene1",
  20: "julius_caesar_act5_scene2",
  21: "julius_caesar_act5_scene3",
  22: "julius_caesar_act5_scene4",
  23: "julius_caesar_act5_scene5",
}

// Henry V: 31 chapters. ch-0 Dramatis Personae, ch-1 standalone Prologue,
// Act title pages at ch-2/5/10/18/27 — Acts II–V bundle their chorus
// into the act title chapter (the same pattern Romeo's Act II uses).
// ch-30 is the standalone Epilogue. 28 scene/chorus sections total.
const HENRY_V_CHAPTER_TO_SCENE: Record<number, string> = {
  1: "henry_v_prologue",
  3: "henry_v_act1_scene1",
  4: "henry_v_act1_scene2",
  5: "henry_v_act2_chorus",
  6: "henry_v_act2_scene1",
  7: "henry_v_act2_scene2",
  8: "henry_v_act2_scene3",
  9: "henry_v_act2_scene4",
  10: "henry_v_act3_chorus",
  11: "henry_v_act3_scene1",
  12: "henry_v_act3_scene2",
  13: "henry_v_act3_scene3",
  14: "henry_v_act3_scene4",
  15: "henry_v_act3_scene5",
  16: "henry_v_act3_scene6",
  17: "henry_v_act3_scene7",
  18: "henry_v_act4_chorus",
  19: "henry_v_act4_scene1",
  20: "henry_v_act4_scene2",
  21: "henry_v_act4_scene3",
  22: "henry_v_act4_scene4",
  23: "henry_v_act4_scene5",
  24: "henry_v_act4_scene6",
  25: "henry_v_act4_scene7",
  26: "henry_v_act4_scene8",
  27: "henry_v_act5_chorus",
  28: "henry_v_act5_scene1",
  29: "henry_v_act5_scene2",
  30: "henry_v_epilogue",
}

// Romeo and Juliet: 31 chapters. ch-0 Dramatis Personae, ch-1 Prologue
// (standalone CHORUS sonnet), Act title pages at ch-2/8/15/21/27. Note that
// the Act II chorus is bundled into ch-8 (the Act II title chapter itself).
const ROMEO_AND_JULIET_CHAPTER_TO_SCENE: Record<number, string> = {
  1: "romeo_and_juliet_prologue",
  3: "romeo_and_juliet_act1_scene1",
  4: "romeo_and_juliet_act1_scene2",
  5: "romeo_and_juliet_act1_scene3",
  6: "romeo_and_juliet_act1_scene4",
  7: "romeo_and_juliet_act1_scene5",
  8: "romeo_and_juliet_act2_chorus",
  9: "romeo_and_juliet_act2_scene1",
  10: "romeo_and_juliet_act2_scene2",
  11: "romeo_and_juliet_act2_scene3",
  12: "romeo_and_juliet_act2_scene4",
  13: "romeo_and_juliet_act2_scene5",
  14: "romeo_and_juliet_act2_scene6",
  16: "romeo_and_juliet_act3_scene1",
  17: "romeo_and_juliet_act3_scene2",
  18: "romeo_and_juliet_act3_scene3",
  19: "romeo_and_juliet_act3_scene4",
  20: "romeo_and_juliet_act3_scene5",
  22: "romeo_and_juliet_act4_scene1",
  23: "romeo_and_juliet_act4_scene2",
  24: "romeo_and_juliet_act4_scene3",
  25: "romeo_and_juliet_act4_scene4",
  26: "romeo_and_juliet_act4_scene5",
  28: "romeo_and_juliet_act5_scene1",
  29: "romeo_and_juliet_act5_scene2",
  30: "romeo_and_juliet_act5_scene3",
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
  lines: { number: number; speaker?: string; text: string }[]
  glosses: Gloss[]
  annotations: Annotation[]
  trials: Trial[]
}

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
}

/**
 * Scan a root element's text nodes for occurrences of `phrase` and wrap
 * matches in spans. Mutates the DOM in place. Returns the number of
 * instances wrapped.
 */
function wrapPhraseOccurrences(
  root: HTMLElement,
  phrase: string,
  wrap: (match: string) => HTMLElement
): number {
  const normPhrase = normalizeForMatch(phrase)
  if (!normPhrase) return 0
  let wrapped = 0

  // Walk only text nodes; skip anything already inside a gloss or inside
  // speaker cells (first td of a table row) to avoid cluttering labels.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (parent.closest(".tome-gloss, .tome-annotation-anchor")) {
        return NodeFilter.FILTER_REJECT
      }
      // Skip speaker cells (first <td> in each <tr>)
      const td = parent.closest("td")
      if (td && td.parentElement && td === td.parentElement.firstElementChild) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const textNodes: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) textNodes.push(n as Text)

  for (const textNode of textNodes) {
    const raw = textNode.nodeValue || ""
    const norm = normalizeForMatch(raw)
    const idx = norm.indexOf(normPhrase)
    if (idx === -1) continue

    // Normalization preserves character positions (it replaces single
    // characters 1:1 and only the whitespace collapse could shift — skip
    // entries whose normalization changed length by whitespace collapse).
    if (norm.length !== raw.length) continue

    const before = raw.slice(0, idx)
    const match = raw.slice(idx, idx + phrase.length)
    const after = raw.slice(idx + phrase.length)

    const parent = textNode.parentNode
    if (!parent) continue

    const matchEl = wrap(match)
    if (before) parent.insertBefore(document.createTextNode(before), textNode)
    parent.insertBefore(matchEl, textNode)
    if (after) parent.insertBefore(document.createTextNode(after), textNode)
    parent.removeChild(textNode)
    wrapped++
  }

  return wrapped
}

// Persist toggle preferences across sessions
const TOGGLE_STORAGE_KEY = "tome-structured-toggles-v1"

function loadToggles(): { glosses: boolean; annotations: boolean } {
  if (typeof window === "undefined") return { glosses: true, annotations: true }
  try {
    const raw = localStorage.getItem(TOGGLE_STORAGE_KEY)
    if (!raw) return { glosses: true, annotations: true }
    const parsed = JSON.parse(raw)
    return {
      glosses: parsed.glosses !== false,
      annotations: parsed.annotations !== false,
    }
  } catch {
    return { glosses: true, annotations: true }
  }
}

export function StructuredEnhancements({
  workId,
  chapterIndex,
  chapterEndReached,
}: {
  workId: string
  chapterIndex: number
  chapterEndReached: boolean
}) {
  const [section, setSection] = useState<Section | null>(null)
  const [openAnnotation, setOpenAnnotation] = useState<string | null>(null)
  const [trialAnswers, setTrialAnswers] = useState<Record<string, number>>({})
  const [trialRevealed, setTrialRevealed] = useState<Record<string, boolean>>({})
  const hasDecoratedRef = useRef<string | null>(null)

  // Toggle state — user can hide glosses or annotations independently.
  // Persists to localStorage.
  const [showGlosses, setShowGlosses] = useState(true)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [togglesLoaded, setTogglesLoaded] = useState(false)

  useEffect(() => {
    const t = loadToggles()
    setShowGlosses(t.glosses)
    setShowAnnotations(t.annotations)
    setTogglesLoaded(true)
  }, [])

  useEffect(() => {
    if (!togglesLoaded) return
    try {
      localStorage.setItem(
        TOGGLE_STORAGE_KEY,
        JSON.stringify({ glosses: showGlosses, annotations: showAnnotations })
      )
    } catch { /* noop */ }
  }, [showGlosses, showAnnotations, togglesLoaded])

  // Resolve scene ID for this chapter
  const sceneId = useMemo(() => {
    if (workId === "hamlet") return HAMLET_CHAPTER_TO_SCENE[chapterIndex] || null
    if (workId === "othello") return OTHELLO_CHAPTER_TO_SCENE[chapterIndex] || null
    if (workId === "macbeth") return MACBETH_CHAPTER_TO_SCENE[chapterIndex] || null
    if (workId === "romeo-and-juliet") return ROMEO_AND_JULIET_CHAPTER_TO_SCENE[chapterIndex] || null
    if (workId === "king-lear") return KING_LEAR_CHAPTER_TO_SCENE[chapterIndex] || null
    if (workId === "richard-iii") return RICHARD_III_CHAPTER_TO_SCENE[chapterIndex] || null
    if (workId === "julius-caesar") return JULIUS_CAESAR_CHAPTER_TO_SCENE[chapterIndex] || null
    if (workId === "henry-v") return HENRY_V_CHAPTER_TO_SCENE[chapterIndex] || null
    return null
  }, [workId, chapterIndex])

  // Load scene JSON when chapter changes
  useEffect(() => {
    if (!sceneId) {
      setSection(null)
      return
    }
    let cancelled = false
    fetch(`/api/structured/${workId}/${sceneId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (!cancelled) setSection(s)
      })
      .catch(() => { if (!cancelled) setSection(null) })
    return () => { cancelled = true }
  }, [workId, sceneId])

  // Reset trial state when scene changes
  useEffect(() => {
    setTrialAnswers({})
    setTrialRevealed({})
    setOpenAnnotation(null)
  }, [sceneId])

  // Decorate the rendered chapter with glosses + annotation anchors.
  // Re-runs whenever scene changes or either toggle changes.
  useEffect(() => {
    if (!section || !sceneId || !togglesLoaded) return

    const timer = setTimeout(() => {
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return

      // Remove prior decorations so we start clean.
      root.querySelectorAll(".tome-gloss").forEach((el) => {
        const t = document.createTextNode(el.textContent || "")
        el.parentNode?.replaceChild(t, el)
      })
      root.querySelectorAll(".tome-annotation-anchor").forEach((el) => el.remove())
      root.normalize()

      // Annotation markers FIRST (only if enabled): place ✦ at the first
      // occurrence of each annotation's starting-line text. Applied before
      // glosses so that a gloss wrapping part of the opening phrase doesn't
      // prevent the annotation anchor from attaching.
      if (showAnnotations) {
        for (const ann of section.annotations) {
          const line = section.lines.find((l) => l.number === ann.line_start)
          if (!line) continue
          const firstWords = line.text.split(/\s+/).slice(0, 6).join(" ")
          if (!firstWords) continue

          wrapPhraseOccurrences(root, firstWords, (match) => {
            const container = document.createElement("span")
            const btn = document.createElement("button")
            btn.className = "tome-annotation-anchor"
            btn.setAttribute("data-annotation-id", ann.id)
            btn.setAttribute("aria-label", `Scholarly annotation: ${ann.title}`)
            btn.title = ann.title
            btn.type = "button"
            btn.textContent = "✦"
            container.appendChild(btn)
            container.appendChild(document.createTextNode(match))
            return container
          })
        }
      }

      // Glosses (only if enabled): longest first to avoid substring overlap.
      if (showGlosses) {
        const sortedGlosses = [...section.glosses].sort(
          (a, b) => b.phrase.length - a.phrase.length
        )
        const seenGlossIds = new Set<string>()
        for (const g of sortedGlosses) {
          if (seenGlossIds.has(g.phrase.toLowerCase())) continue
          seenGlossIds.add(g.phrase.toLowerCase())
          wrapPhraseOccurrences(root, g.phrase, (match) => {
            const span = document.createElement("span")
            span.className = "tome-gloss"
            span.dataset.definition = g.definition
            span.textContent = match
            return span
          })
        }
      }

      const clickHandler = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest?.(".tome-annotation-anchor")
        if (!target) return
        e.preventDefault()
        const id = target.getAttribute("data-annotation-id")
        if (id) setOpenAnnotation(id)
      }
      root.addEventListener("click", clickHandler)
      hasDecoratedRef.current = `${sceneId}:${showGlosses}:${showAnnotations}`
      return () => root.removeEventListener("click", clickHandler)
    }, 100)

    return () => clearTimeout(timer)
  }, [section, sceneId, showGlosses, showAnnotations, togglesLoaded])

  const openAnnotationData = useMemo(
    () => (section && openAnnotation ? section.annotations.find((a) => a.id === openAnnotation) : null),
    [section, openAnnotation]
  )

  if (!section) return null

  const glossCount = section.glosses.length
  const annotationCount = section.annotations.length

  return (
    <>
      {/* Floating toggle pill — lets the reader turn glosses or annotations
          on/off independently. Fixed top-right, above any reader chrome. */}
      <div
        className="tome-enhancement-toggles"
        role="group"
        aria-label="Reading aids"
      >
        <button
          type="button"
          className={`tome-toggle ${showGlosses ? "active" : ""}`}
          onClick={() => setShowGlosses((v) => !v)}
          title={`${showGlosses ? "Hide" : "Show"} ${glossCount} glosses`}
          aria-pressed={showGlosses}
        >
          <span className="tome-toggle-dot" />
          <span className="tome-toggle-label">Glosses</span>
          <span className="tome-toggle-count">{glossCount}</span>
        </button>
        <button
          type="button"
          className={`tome-toggle ${showAnnotations ? "active" : ""}`}
          onClick={() => setShowAnnotations((v) => !v)}
          title={`${showAnnotations ? "Hide" : "Show"} ${annotationCount} scholarly annotations`}
          aria-pressed={showAnnotations}
        >
          <span className="tome-toggle-dot" />
          <span className="tome-toggle-label">Notes</span>
          <span className="tome-toggle-count">{annotationCount}</span>
        </button>
      </div>

      {/* Scene Trial — appears below the chapter body when reader reaches end */}
      {section.trials.length > 0 && chapterEndReached && (
        <section className="tome-trials">
          <h2 className="tome-trials-heading">Scene Trial</h2>
          <p className="tome-trials-intro">
            Answer to earn Wisdom. Questions reference the lines you just read.
          </p>
          {section.trials.map((t, i) => {
            const answered = trialAnswers[t.id] !== undefined
            const revealed = trialRevealed[t.id]
            const isCorrect = trialAnswers[t.id] === t.answer_index
            return (
              <div key={t.id} className="tome-trial">
                <div className="tome-trial-head">
                  <span className="tome-trial-num">Q{i + 1}</span>
                  <span className="tome-trial-kind">{t.kind.replace("_", " ")}</span>
                  <span className="tome-trial-anchor">
                    lines {t.anchor_line_start}
                    {t.anchor_line_start !== t.anchor_line_end && `–${t.anchor_line_end}`}
                  </span>
                  <span className="tome-trial-reward">+{t.wisdom_reward} Wisdom</span>
                </div>
                <p className="tome-trial-prompt">{t.prompt}</p>
                <div className="tome-trial-options">
                  {t.options.map((opt, oi) => {
                    const selected = trialAnswers[t.id] === oi
                    const isAnswer = oi === t.answer_index
                    let cls = "tome-trial-option"
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
                        <span className="tome-trial-letter">{String.fromCharCode(65 + oi)}</span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {answered && !revealed && (
                  <button
                    type="button"
                    className="tome-trial-reveal"
                    onClick={() => setTrialRevealed((s) => ({ ...s, [t.id]: true }))}
                  >
                    Reveal answer
                  </button>
                )}
                {revealed && (
                  <div className={`tome-trial-result ${isCorrect ? "correct" : "wrong"}`}>
                    {isCorrect
                      ? `Correct — +${t.wisdom_reward} Wisdom earned.`
                      : `Not quite. The correct answer was ${String.fromCharCode(65 + t.answer_index)}.`}
                  </div>
                )}
              </div>
            )
          })}
        </section>
      )}

      {/* Annotation drawer */}
      {openAnnotationData && (
        <div className="tome-annotation-overlay" onClick={() => setOpenAnnotation(null)}>
          <div className="tome-annotation-drawer" onClick={(e) => e.stopPropagation()}>
            <header className="tome-annotation-head">
              <div className="tome-annotation-meta">
                <span className="tome-annotation-category">{openAnnotationData.category}</span>
                <span className="tome-annotation-cite">{openAnnotationData.citation_display}</span>
              </div>
              <button
                onClick={() => setOpenAnnotation(null)}
                aria-label="Close"
                type="button"
              >×</button>
            </header>
            <h2>{openAnnotationData.title}</h2>
            <div className="tome-annotation-body">
              {openAnnotationData.body.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {openAnnotationData.sources.length > 0 && (
              <footer className="tome-annotation-sources">
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

      {/* Enhancement styles — layered over the existing reader without
          overriding its typography. Colors use the Tome gold accent. */}
      <style jsx global>{`
        .tome-enhancement-toggles {
          position: fixed;
          top: 76px;
          right: 24px;
          display: flex;
          gap: 6px;
          padding: 4px;
          background: var(--background);
          border: 1px solid var(--border, #e4dfd2);
          border-radius: 999px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          z-index: 40;
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .dark .tome-enhancement-toggles {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .tome-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          padding: 6px 12px 6px 10px;
          border-radius: 999px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.4px;
          color: var(--muted-foreground, #999);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .tome-toggle:hover {
          background: var(--muted, #f3efe6);
          color: var(--foreground);
        }
        .dark .tome-toggle:hover { background: rgba(255, 255, 255, 0.05); }
        .tome-toggle.active {
          background: rgba(176, 141, 87, 0.12);
          color: #8b6a3d;
        }
        .dark .tome-toggle.active {
          background: rgba(201, 166, 112, 0.15);
          color: #c9a670;
        }
        .tome-toggle-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--muted-foreground, #c9c1ae);
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .tome-toggle.active .tome-toggle-dot {
          background: #b08d57;
        }
        .dark .tome-toggle.active .tome-toggle-dot {
          background: #c9a670;
        }
        .tome-toggle-label {
          line-height: 1;
        }
        .tome-toggle-count {
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--muted, #f3efe6);
          color: var(--muted-foreground, #888);
          font-variant-numeric: tabular-nums;
          font-weight: 600;
          line-height: 1.3;
        }
        .tome-toggle.active .tome-toggle-count {
          background: rgba(176, 141, 87, 0.2);
          color: #8b6a3d;
        }
        .dark .tome-toggle-count {
          background: rgba(255, 255, 255, 0.08);
        }
        .dark .tome-toggle.active .tome-toggle-count {
          background: rgba(201, 166, 112, 0.22);
          color: #c9a670;
        }

        .tome-gloss {
          border-bottom: 1px dotted #b08d57;
          cursor: help;
          position: relative;
        }
        .tome-gloss:hover::after {
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
          white-space: normal;
          z-index: 50;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
          pointer-events: none;
        }
        .tome-gloss:hover::before {
          content: "";
          position: absolute;
          bottom: calc(100% + 2px);
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #1a1611;
          z-index: 50;
        }
        .dark .tome-gloss { border-bottom-color: #c9a670; }

        .tome-annotation-anchor {
          display: inline-block;
          background: none;
          border: none;
          color: #b08d57;
          cursor: pointer;
          font-size: 0.7em;
          padding: 0 4px 0 0;
          vertical-align: super;
          line-height: 1;
          transition: transform 0.15s ease, color 0.15s ease;
        }
        .tome-annotation-anchor:hover {
          color: #8b6a3d;
          transform: scale(1.25);
        }
        .dark .tome-annotation-anchor { color: #c9a670; }
        .dark .tome-annotation-anchor:hover { color: #e2c28d; }

        .tome-trials {
          margin: 48px auto 24px;
          max-width: 680px;
          padding: 28px;
          background: var(--muted, #f3efe6);
          border-radius: 14px;
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .dark .tome-trials { background: rgba(255, 255, 255, 0.04); }
        .tome-trials-heading {
          margin: 0 0 4px;
          font-size: 22px;
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          letter-spacing: -0.3px;
        }
        .tome-trials-intro {
          color: var(--muted-foreground, #888);
          font-size: 14px;
          margin: 0 0 24px;
        }
        .tome-trial {
          background: var(--background);
          padding: 18px;
          border-radius: 8px;
          margin-bottom: 16px;
          border: 1px solid var(--border, #e4dfd2);
        }
        .tome-trial-head {
          display: flex;
          gap: 12px;
          align-items: center;
          font-size: 11px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--muted-foreground, #a8a294);
          margin-bottom: 10px;
        }
        .tome-trial-num { color: #b08d57; font-weight: 600; }
        .tome-trial-anchor { flex: 1; }
        .tome-trial-reward { color: #8b6a3d; font-weight: 600; }
        .dark .tome-trial-num,
        .dark .tome-trial-reward { color: #c9a670; }
        .tome-trial-prompt {
          font-size: 16px;
          margin: 0 0 14px;
          line-height: 1.5;
          color: var(--foreground);
        }
        .tome-trial-options {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tome-trial-option {
          text-align: left;
          background: var(--background);
          border: 1px solid var(--border, #e4dfd2);
          padding: 10px 14px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 15px;
          cursor: pointer;
          color: var(--foreground);
          display: flex;
          gap: 12px;
          align-items: flex-start;
          transition: background 0.12s, border-color 0.12s;
        }
        .tome-trial-option:hover:not(:disabled) {
          background: var(--muted, #f3efe6);
        }
        .dark .tome-trial-option:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.06);
        }
        .tome-trial-option.selected {
          border-color: #b08d57;
          background: rgba(176, 141, 87, 0.08);
        }
        .tome-trial-option.correct {
          background: #e8f0e4;
          border-color: #6b8c5a;
          color: #3e5734;
        }
        .tome-trial-option.wrong {
          background: #f5e5e2;
          border-color: #b07373;
          color: #734a4a;
        }
        .dark .tome-trial-option.correct {
          background: rgba(107, 140, 90, 0.18);
          color: #bfd8b1;
        }
        .dark .tome-trial-option.wrong {
          background: rgba(176, 115, 115, 0.18);
          color: #dca9a9;
        }
        .tome-trial-letter {
          font-weight: 600;
          color: var(--muted-foreground, #888);
          min-width: 16px;
        }
        .tome-trial-reveal {
          margin-top: 10px;
          background: #b08d57;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          transition: background 0.12s;
        }
        .tome-trial-reveal:hover { background: #8b6a3d; }
        .tome-trial-result {
          margin-top: 10px;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 4px;
        }
        .tome-trial-result.correct { background: #e8f0e4; color: #3e5734; }
        .tome-trial-result.wrong { background: #f5e5e2; color: #734a4a; }
        .dark .tome-trial-result.correct {
          background: rgba(107, 140, 90, 0.18);
          color: #bfd8b1;
        }
        .dark .tome-trial-result.wrong {
          background: rgba(176, 115, 115, 0.18);
          color: #dca9a9;
        }

        .tome-annotation-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          justify-content: flex-end;
          z-index: 200;
          backdrop-filter: blur(2px);
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .tome-annotation-drawer {
          width: 100%;
          max-width: 480px;
          background: var(--background);
          color: var(--foreground);
          padding: 28px;
          overflow-y: auto;
          box-shadow: -8px 0 24px rgba(0, 0, 0, 0.18);
        }
        .tome-annotation-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border, #e4dfd2);
        }
        .tome-annotation-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }
        .tome-annotation-category {
          color: #b08d57;
          font-weight: 600;
        }
        .dark .tome-annotation-category { color: #c9a670; }
        .tome-annotation-cite {
          color: var(--muted-foreground, #888);
        }
        .tome-annotation-head button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--muted-foreground, #888);
          padding: 0 8px;
        }
        .tome-annotation-drawer h2 {
          font-size: 24px;
          margin: 0 0 16px;
          letter-spacing: -0.3px;
          font-family: var(--font-serif, ui-serif, Georgia, serif);
        }
        .tome-annotation-body p {
          font-size: 15px;
          line-height: 1.7;
          margin: 0 0 14px;
          font-family: var(--font-serif, ui-serif, Georgia, serif);
        }
        .tome-annotation-sources {
          margin-top: 28px;
          padding-top: 16px;
          border-top: 1px solid var(--border, #e4dfd2);
          font-size: 13px;
          color: var(--muted-foreground, #777);
        }
        .tome-annotation-sources strong {
          display: block;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-size: 11px;
          margin-bottom: 6px;
        }
        .tome-annotation-sources ul {
          margin: 0;
          padding-left: 20px;
        }
      `}</style>
    </>
  )
}
