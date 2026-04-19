"use client"

/**
 * CanterburyTalesEnhancements — scholarly apparatus for Chaucer's
 * *Canterbury Tales* (Ellesmere fragment order, 24 tales + General
 * Prologue).
 *
 * What it does (Phase 1):
 *   1. Renders, between the chapter H1 and the text body:
 *      - A fragment header (Roman numeral + fragment name + subtitle),
 *        so the reader can see that (e.g.) they are in Fragment III,
 *        the first fragment of the Marriage Group.
 *      - A teller block: the pilgrim's signature color bar, label, and
 *        one-sentence portrait note; plus the verse form indicator
 *        (heroic couplets / rime royal / tail-rhyme / prose / Monk's stanza).
 *      - A dramatic-link note ("The drunken Miller insists on speaking
 *        next … to 'quite' the Knight's courtly tale with a fabliau
 *        counter"), which is the Chaucer-specific information that makes
 *        the Ellesmere arrangement legible.
 *      - Incomplete-tale editorial banner for the Cook's and Squire's Tales.
 *      - Content-note banner for the Prioress's Tale (honest historical
 *        framing for the blood-libel material), Pardoner's Tale (sexual
 *        coding), and the bawdy fabliaux (Miller, Reeve, Summoner, Merchant,
 *        Shipman).
 *   2. Provides a reader toggle for the verse-form indicator (persisted).
 *
 * What it does NOT do yet (Phase 2+):
 *   - FacingGlossBlock (two-column desktop, tap-reveal mobile). This is
 *     the big architectural build and is deferred to a dedicated pass.
 *     Until it ships, the existing dotted-underline gloss renderer will
 *     cover Canterbury via src/lib/virgil/canterbury-tales-glosses.ts.
 *   - Per-line rhyme-scheme tagging for rime royal / tail-rhyme. The form
 *     indicator is static; the per-line tagging is the richer Phase 2 build.
 *   - Pilgrim Progress Map (24-slot grid) on the book detail page.
 *   - Narrative Context Tracker with dramatic-link overlay. The link note
 *     shown here is the minimal in-reader shape; the richer floating-
 *     tracker UI is Phase 2.
 *
 * Only active for `bookId === "the-canterbury-tales"`. Silently no-ops otherwise.
 */

import { useEffect, useState } from "react"
import { CANTERBURY_FRAGMENTS, dramaticLinkForChapter, fragmentForChapter } from "@/data/canterbury-tales/fragments"
import { CANTERBURY_PILGRIMS, pilgrimForChapter, PILGRIM_HOST, type CanterburyPilgrim } from "@/data/canterbury-tales/pilgrims"
import { CANTERBURY_TALES_METADATA, taleMetadata, type VerseForm } from "@/data/canterbury-tales/tales"

// Rhyme-scheme patterns by verse form. Applied via post-mount DOM walk.
// Each entry is a length-N array of rhyme letters; the walker tags every
// Nth line span (<span> inside <p>, separated by <br>) with data-ct-rhyme.
//
// The rime-royal stanza is ababbcc (7 lines, iambic pentameter). The
// Monk's stanza is ababbcbc (8 lines). Tail-rhyme stanzas (Sir Thopas)
// are variable and not auto-tagged at this pass.
const RHYME_PATTERNS: Partial<Record<VerseForm, readonly string[]>> = {
  "rime-royal":   ["A", "B", "A", "B", "B", "C", "C"],
  "monks-stanza": ["A", "B", "A", "B", "B", "C", "B", "C"],
}

interface CanterburyTalesEnhancementsProps {
  bookId: string
  currentChapter: number
}

// LocalStorage keys for persistent reader toggles.
const LS_FORM_INDICATOR = "ct:showFormIndicator"
const LS_RHYME_SCHEME = "ct:showRhymeScheme"

const FORM_LABEL: Record<VerseForm, string> = {
  "heroic-couplets": "Heroic couplets",
  "rime-royal":      "Rime royal",
  "tail-rhyme":      "Tail-rhyme (parody)",
  "monks-stanza":    "The Monk's stanza (ababbcbc)",
  prose:             "Prose",
  mixed:             "Mixed verse forms",
}

const CONTENT_NOTE_COPY: Record<string, { title: string; body: string }> = {
  antisemitism: {
    title: "Editorial note",
    body:
      "The Prioress's Tale is a blood-libel tale of a recognizable medieval " +
      "type. Tome presents it as written and annotates the history honestly. " +
      "The tale's antisemitic violence is not incidental but structural; " +
      "Chaucer's own framing — the Prioress's General Prologue portrait — is " +
      "part of what the tale offers the reader.",
  },
  "bawdy-fabliau": {
    title: "Content note",
    body:
      "This is a fabliau — the medieval genre of bawdy comedic tale. Direct " +
      "sexual humor, cuckoldry, and scatology are structural to the genre and " +
      "to Chaucer's social panorama. If you prefer to skip, the fragment's " +
      "other tales stand on their own.",
  },
  "sexual-coding": {
    title: "Editorial note",
    body:
      "The Pardoner's General Prologue portrait contains coded language about " +
      "his sexuality that has generated vast modern critical commentary. The " +
      "annotations engage that reception seriously and without modernizing.",
  },
  violence: {
    title: "Content note",
    body: "This tale contains graphic violence (a father's killing of his own daughter).",
  },
}

export function CanterburyTalesEnhancements({
  bookId,
  currentChapter,
}: CanterburyTalesEnhancementsProps) {
  const [showFormIndicator, setShowFormIndicator] = useState(true)
  const [showRhymeScheme, setShowRhymeScheme] = useState(false)

  // Hydrate toggles from localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const f = window.localStorage.getItem(LS_FORM_INDICATOR)
      if (f !== null) setShowFormIndicator(f === "true")
      const r = window.localStorage.getItem(LS_RHYME_SCHEME)
      if (r !== null) setShowRhymeScheme(r === "true")
    } catch {
      // localStorage unavailable; keep defaults
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    try { window.localStorage.setItem(LS_FORM_INDICATOR, String(showFormIndicator)) } catch {}
  }, [showFormIndicator])

  useEffect(() => {
    if (typeof window === "undefined") return
    try { window.localStorage.setItem(LS_RHYME_SCHEME, String(showRhymeScheme)) } catch {}
  }, [showRhymeScheme])

  // Per-line rhyme-scheme tagging (rime royal, Monk's stanza). One-shot
  // pass when the reader content is ready; the toggle only controls the
  // visibility of the chip letters, not whether tagging happens.
  useEffect(() => {
    if (bookId !== "the-canterbury-tales") return
    const tale = taleMetadata(currentChapter)
    const pattern = tale ? RHYME_PATTERNS[tale.verseForm] : undefined
    if (!pattern) return

    let cancelled = false
    const applyTagging = (): boolean => {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      const section = root?.querySelector("section[role='doc-chapter']")
      if (!section) return false
      const lineSpans = Array.from(
        section.querySelectorAll<HTMLSpanElement>("p > span"),
      ).filter(
        (span) =>
          !span.classList.contains("ct-rhyme-chip") &&
          !span.classList.contains("tome-gloss") &&
          !span.hasAttribute("data-ct-anchor") &&
          !span.closest("[data-pl-argument]"),
      )
      if (lineSpans.length === 0) return false
      lineSpans.forEach((span, idx) => {
        const patIdx = idx % pattern.length
        const letter = pattern[patIdx]
        if (span.getAttribute("data-ct-rhyme") !== letter) {
          span.setAttribute("data-ct-rhyme", letter)
          span.setAttribute("data-ct-stanza", String(Math.floor(idx / pattern.length) + 1))
        }
        const existingChip = span.querySelector(".ct-rhyme-chip")
        if (showRhymeScheme && !existingChip) {
          const chip = document.createElement("sup")
          chip.className = "ct-rhyme-chip"
          chip.textContent = letter
          chip.style.cssText =
            "display:inline-block;margin-left:0.3rem;padding:0 0.25rem;font-size:0.65rem;opacity:0.65;border:1px solid currentColor;border-radius:3px;vertical-align:super;"
          span.appendChild(chip)
        } else if (!showRhymeScheme && existingChip) {
          existingChip.remove()
        }
      })
      return true
    }
    // Try once up-front; if content not ready, retry a few times then stop.
    let attempts = 0
    const timer: { id: ReturnType<typeof setTimeout> | null } = { id: null }
    const tick = () => {
      if (cancelled) return
      if (applyTagging()) return
      attempts += 1
      if (attempts > 30) return
      timer.id = setTimeout(tick, 150)
    }
    tick()
    return () => {
      cancelled = true
      if (timer.id) clearTimeout(timer.id)
    }
  }, [bookId, currentChapter, showRhymeScheme])

  if (bookId !== "the-canterbury-tales") return null

  const fragment = fragmentForChapter(currentChapter)
  const tale = taleMetadata(currentChapter)
  const teller = pilgrimForChapter(currentChapter)
  const dramaticLink = dramaticLinkForChapter(currentChapter)
  const isRetractions = currentChapter === 25

  if (!fragment || !tale) return null

  const contentNote = tale.contentNote ? CONTENT_NOTE_COPY[tale.contentNote] : undefined

  return (
    <div
      data-ct-chrome
      data-ct-retractions={isRetractions ? "true" : undefined}
      style={{
        margin: "1.5rem 0 2rem",
        padding: "1rem 1.25rem",
        borderRadius: "0.5rem",
        border: isRetractions ? "1px solid rgba(214,139,0,0.4)" : "1px solid rgba(0,0,0,0.08)",
        background: isRetractions
          ? "linear-gradient(180deg, rgba(214,139,0,0.08), rgba(0,0,0,0))"
          : "linear-gradient(180deg, rgba(139,26,26,0.03), rgba(0,0,0,0))",
        fontFamily: "var(--tome-serif, Georgia, serif)",
      }}
    >
      {isRetractions && (
        <div
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#D68B00",
            marginBottom: "0.35rem",
            fontWeight: 700,
          }}
        >
          Author&apos;s Intervention — Chaucer&apos;s Own Voice
        </div>
      )}
      {/* Fragment + tale title row */}
      <div style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.65 }}>
        Fragment {fragment.roman} · {fragment.subtitle}
      </div>

      {/* Teller row */}
      {teller && (
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "0.5rem",
              height: "1.75rem",
              background: teller.color,
              borderRadius: "2px",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: teller.color }}>
              {teller.label}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.1rem" }}>
              {teller.professionalSphere}
            </div>
          </div>
          {showFormIndicator && (
            <span
              title={tale.verseFormNote}
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                background: "rgba(0,0,0,0.06)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {FORM_LABEL[tale.verseForm]}
            </span>
          )}
          {RHYME_PATTERNS[tale.verseForm] && (
            <button
              type="button"
              onClick={() => setShowRhymeScheme((v) => !v)}
              title={`Toggle ${tale.verseForm === "rime-royal" ? "ababbcc" : "ababbcbc"} rhyme-scheme letters on each line`}
              style={{
                fontSize: "0.7rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                background: showRhymeScheme ? teller?.color ?? "#8B1A1A" : "rgba(0,0,0,0.06)",
                color: showRhymeScheme ? "white" : "inherit",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {showRhymeScheme ? "✓ Rhyme" : "Rhyme"}
            </button>
          )}
        </div>
      )}

      {/* No-teller fallback (General Prologue): voice is Chaucer-the-pilgrim, but
          the portrait gallery itself is the content. Show a Host/frame bar. */}
      {!teller && currentChapter === 0 && (
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "0.5rem",
              height: "1.75rem",
              background: PILGRIM_HOST.color,
              borderRadius: "2px",
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: PILGRIM_HOST.color }}>
              THE FRAME
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.1rem" }}>
              Chaucer-the-pilgrim narrates; the Host proposes the game.
            </div>
          </div>
          {showFormIndicator && (
            <span
              title={tale.verseFormNote}
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                background: "rgba(0,0,0,0.06)",
              }}
            >
              {FORM_LABEL[tale.verseForm]}
            </span>
          )}
        </div>
      )}

      {/* Dramatic link note */}
      {dramaticLink && (
        <div
          style={{
            marginTop: "0.9rem",
            fontSize: "0.9rem",
            fontStyle: "italic",
            lineHeight: 1.5,
            opacity: 0.85,
            borderLeft: "2px solid rgba(0,0,0,0.12)",
            paddingLeft: "0.75rem",
          }}
        >
          {dramaticLink}
        </div>
      )}

      {/* Incomplete banner */}
      {tale.isIncomplete && (
        <div
          role="note"
          style={{
            marginTop: "0.9rem",
            padding: "0.5rem 0.75rem",
            fontSize: "0.85rem",
            borderRadius: "0.25rem",
            background: "rgba(214,139,0,0.10)",
            borderLeft: "3px solid #D68B00",
          }}
        >
          <strong>Incomplete.</strong> Chaucer did not finish this tale; the text breaks off in mid-episode.
        </div>
      )}

      {/* Content note */}
      {contentNote && (
        <div
          role="note"
          style={{
            marginTop: "0.9rem",
            padding: "0.5rem 0.75rem",
            fontSize: "0.85rem",
            borderRadius: "0.25rem",
            background: "rgba(0,0,0,0.05)",
            borderLeft: "3px solid rgba(0,0,0,0.25)",
          }}
        >
          <strong>{contentNote.title}.</strong> {contentNote.body}
        </div>
      )}
    </div>
  )
}

/**
 * Minimal Pilgrim Progress Map — a flat 25-slot visualization for the
 * book detail page. Each slot is a tale (or the General Prologue),
 * colored by the teller's signature hue, with a broken-edge mark for
 * the two incompletes (Cook, Squire). Phase 1 placeholder: the book
 * detail page can render this as a compact summary. The full Phase 2
 * version adds progress tracking (read / unread / in-progress) from
 * the economy-provider state.
 */
export function CanterburyTalesProgressMap({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(25, minmax(0, 1fr))",
        gap: "0.2rem",
        padding: "0.5rem 0",
      }}
      aria-label="Canterbury Tales progress map (25 tales by Ellesmere fragment)"
    >
      {CANTERBURY_FRAGMENTS.flatMap((fragment) =>
        fragment.members.map((member) => {
          const tale = taleMetadata(member.chapterIndex)
          const teller = pilgrimForChapter(member.chapterIndex)
          const color = teller?.color ?? "#9E9987"
          const isIncomplete = tale?.isIncomplete ?? false
          return (
            <a
              key={member.chapterIndex}
              href={`/read/the-canterbury-tales?chapter=${member.chapterIndex}`}
              title={`${tale?.title ?? ""} (Fragment ${fragment.roman})`}
              style={{
                display: "block",
                aspectRatio: "1 / 2",
                background: color,
                opacity: isIncomplete ? 0.5 : 1,
                border: isIncomplete ? "1px dashed rgba(0,0,0,0.35)" : "1px solid rgba(0,0,0,0.15)",
                borderRadius: "2px",
                textDecoration: "none",
              }}
            />
          )
        }),
      )}
    </div>
  )
}

/**
 * Pilgrims Gallery — a compact roster of the 26 pilgrims (Host, Chaucer-
 * pilgrim, tale-tellers major and secondary, non-tellers) for the book
 * detail page. Each card shows the pilgrim's label, signature color bar,
 * professional sphere, signature note, and (if applicable) a jump-link
 * to the chapter containing their tale.
 *
 * Grouped by role: Frame voices → major tellers → secondary tellers →
 * non-tellers. Respect the order; readers benefit from seeing the
 * structural hierarchy.
 */
export function CanterburyTalesPilgrimsGallery({ className }: { className?: string }) {
  const groups: Array<{ label: string; pilgrims: CanterburyPilgrim[] }> = [
    { label: "The Frame", pilgrims: CANTERBURY_PILGRIMS.filter((p) => p.group === "frame") },
    { label: "Major Tellers", pilgrims: CANTERBURY_PILGRIMS.filter((p) => p.group === "major-tellers") },
    { label: "Secondary Tellers", pilgrims: CANTERBURY_PILGRIMS.filter((p) => p.group === "secondary-tellers") },
    { label: "Portraits Only", pilgrims: CANTERBURY_PILGRIMS.filter((p) => p.group === "non-tellers") },
  ]

  return (
    <div className={className}>
      {groups.map((group) => (
        <div key={group.label} style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginBottom: "0.5rem",
            }}
          >
            {group.label}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: "0.6rem",
            }}
          >
            {group.pilgrims.map((p) => {
              const href =
                p.taleChapterIndex !== null
                  ? `/read/the-canterbury-tales?chapter=${p.taleChapterIndex}`
                  : null
              const Card = (
                <div
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "flex-start",
                    padding: "0.6rem 0.7rem",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "6px",
                    background: "rgba(0,0,0,0.02)",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: "4px",
                      alignSelf: "stretch",
                      background: p.color,
                      borderRadius: "2px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.82rem", color: p.color, letterSpacing: "0.04em" }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: "0.78rem", opacity: 0.85, marginTop: "0.1rem" }}>
                      {p.professionalSphere}
                    </div>
                    <div style={{ fontSize: "0.72rem", opacity: 0.65, marginTop: "0.3rem", lineHeight: 1.4 }}>
                      {p.signatureNote}
                    </div>
                  </div>
                </div>
              )
              return href ? (
                <a
                  key={p.id}
                  href={href}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {Card}
                </a>
              ) : (
                <div key={p.id}>{Card}</div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Tales at a Glance — a compact table of the 25 chapters grouped by
 * Ellesmere fragment, showing verse form, teller, and dramatic-link
 * note. Purely navigational/orienting; no scholarly apparatus beyond
 * what is already in fragments.ts and tales.ts.
 */
export function CanterburyTalesAtAGlance({ className }: { className?: string }) {
  const formLabel: Record<VerseForm, string> = {
    "heroic-couplets": "couplets",
    "rime-royal": "rime royal",
    "tail-rhyme": "tail-rhyme",
    "monks-stanza": "Monk's stanza",
    prose: "prose",
    mixed: "mixed",
  }

  return (
    <div className={className} style={{ fontSize: "0.82rem" }}>
      {CANTERBURY_FRAGMENTS.map((fragment) => (
        <div key={fragment.id} style={{ marginBottom: "1rem" }}>
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: "0.35rem",
            }}
          >
            Fragment {fragment.roman} · {fragment.subtitle}
          </div>
          <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "6px", overflow: "hidden" }}>
            {fragment.members.map((member, idx) => {
              const tale = CANTERBURY_TALES_METADATA.find((t) => t.chapterIndex === member.chapterIndex)
              const teller = pilgrimForChapter(member.chapterIndex)
              const isLast = idx === fragment.members.length - 1
              return (
                <a
                  key={member.chapterIndex}
                  href={`/read/the-canterbury-tales?chapter=${member.chapterIndex}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5rem 1fr auto",
                    gap: "0.6rem",
                    padding: "0.5rem 0.7rem",
                    borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.06)",
                    textDecoration: "none",
                    color: "inherit",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: "4px",
                      height: "1rem",
                      alignSelf: "center",
                      background: teller?.color ?? "#9E9987",
                      borderRadius: "2px",
                      opacity: tale?.isIncomplete ? 0.5 : 1,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>
                      {tale?.title ?? `Chapter ${member.chapterIndex}`}
                      {tale?.isIncomplete && (
                        <span style={{ fontWeight: 400, opacity: 0.55, marginLeft: "0.4rem" }}>
                          (incomplete)
                        </span>
                      )}
                    </div>
                    {teller && (
                      <div style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: "0.1rem" }}>
                        told by {teller.name.replace(/^The /, "")}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tale ? formLabel[tale.verseForm] : ""}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
