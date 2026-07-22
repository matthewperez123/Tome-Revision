"use client"

/**
 * ShowcaseApp — the /showcase root.
 *
 * Owns the shell chrome (badge, reset, role/device/mode switchers, share
 * link, captions), the device frame, the guided-tour coach marks, and the
 * routing between the reader/student vertical slice and the Teacher and
 * Parent role views. Durable state persists in the "tome-showcase"
 * localStorage namespace (src/lib/showcase/store.ts); role/device/mode are
 * mirrored into the URL so the exact showcase configuration is shareable.
 *
 * No login, no Supabase, no network — everything renders from seeded data.
 */

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useShowcaseState } from "@/lib/showcase/store"
import { resetStoa } from "@/lib/stoa/state"
import {
  isShowcaseDevice,
  isShowcaseMode,
  isShowcaseRole,
  SHOWCASE_ROLE_LABELS,
  SLICE_STEP_LABELS,
  type ShowcaseRole,
} from "@/lib/showcase/session"
import { DeviceFrame } from "./DeviceFrame"
import { ShowcaseShell } from "./ShowcaseShell"
import { CoachMarks, type TourStep } from "./CoachMarks"
import { ReaderSlice } from "./ReaderSlice"
import { TeacherView } from "./TeacherView"
import { ParentView } from "./ParentView"

/** Caption shown in the captions bar for each slice beat. */
const SLICE_CAPTIONS: Record<string, string> = {
  home: "Virgil greets the returning reader and points to tonight's book: Macbeth.",
  portal: "The cover opens into a storm-lit threshold — every Tome book is a world you step into.",
  passage: "Act I, Scene VII. Real public-domain text, 734 words, with stable paragraph anchors.",
  virgil: "A highlighted line becomes a question. Virgil answers from the passage, citing paragraphs.",
  trial: "Four proofs: a word in context, the evidence, the speaker, and your own judgment.",
  crescendo: "Wisdom, a level, the Flame, a Seal, and a restoration — sequenced, skippable, earned.",
  stoa: "The painting hangs in the courtyard with its provenance. The reward is the record.",
  teacher: "The classroom at a glance: completion, mastery, and exactly who needs help before Friday.",
  parent: "The shape of the habit, never its contents — progress and streaks, journals stay private.",
}

function buildTourSteps(role: ShowcaseRole): TourStep[] {
  const shell: TourStep[] = [
    {
      selector: '[data-tour="badge"]',
      title: "Showcase mode",
      body: "Everything here is seeded and deterministic — no login, no real accounts, no writes to any database. The same tour plays identically every time.",
    },
    {
      selector: '[data-tour="role-switcher"]',
      title: "Four perspectives",
      body: "Switch between Reader, Student, Teacher, and Parent at any moment. The demo keeps your place.",
    },
    {
      selector: '[data-tour="device-switcher"]',
      title: "One responsive product",
      body: "The same UI, framed at desktop, tablet, and mobile widths — not a separate app per device.",
    },
  ]
  const middle: TourStep[] =
    role === "teacher"
      ? [
          {
            selector: '[data-tour="teacher-table"]',
            title: "Assignment status",
            body: "Completion, mastery, and Flame for every student — with the two who need help surfaced first, each with a concrete next step.",
          },
          {
            selector: '[data-tour="teacher-csv"]',
            title: "Evidence you can carry",
            body: "Export the roster to CSV for your gradebook, review one student reflection, and assign the next chapter — all local demo data.",
          },
        ]
      : role === "parent"
        ? [
            {
              selector: '[data-tour="parent-privacy"]',
              title: "Privacy by design",
              body: "Parents see the shape of the habit — minutes, streaks, seals — never journal text or Virgil conversations.",
            },
          ]
        : [
            {
              selector: '[data-tour="slice-stage"]',
              title: "The Macbeth vertical slice",
              body: "Follow the golden thread: home, portal, passage, Virgil, Trial, reward crescendo, Stoa. You can also wander freely — every step is replayable.",
            },
          ]
  const end: TourStep[] = [
    {
      selector: '[data-tour="reset"]',
      title: "One-click reset",
      body: "Reset clears the whole showcase namespace and returns to the seeded start — ready for the next audience in seconds.",
    },
  ]
  return [...shell, ...middle, ...end]
}

export function ShowcaseApp() {
  const params = useSearchParams()
  const showcase = useShowcaseState()
  const { role, device, mode, captions, sliceStep, update, reset } = showcase

  // ── URL ↔ state sync (shareable configuration) ─────────
  const urlApplied = useRef(false)
  useEffect(() => {
    if (urlApplied.current) return
    urlApplied.current = true
    const patch: Record<string, string> = {}
    const pRole = params.get("role")
    const pDevice = params.get("device")
    const pMode = params.get("mode")
    if (pRole && isShowcaseRole(pRole)) patch.role = pRole
    if (pDevice && isShowcaseDevice(pDevice)) patch.device = pDevice
    if (pMode && isShowcaseMode(pMode)) patch.mode = pMode
    if (Object.keys(patch).length > 0) update(patch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("role", role)
    url.searchParams.set("device", device)
    url.searchParams.set("mode", mode)
    window.history.replaceState(null, "", url.toString())
  }, [role, device, mode])

  // ── Share link ─────────────────────────────────────────
  const [copied, setCopied] = useState(false)
  const copyShareLink = useCallback(async () => {
    const url = `${window.location.origin}/showcase?role=${role}&device=${device}&mode=${mode}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard blocked (permissions) — fall back to selecting the URL.
      window.prompt("Copy the showcase link:", url)
    }
  }, [role, device, mode])

  // ── Guided tour ────────────────────────────────────────
  // One-click reset: showcase store + the Stoa showcase store (its
  // in-memory snapshot needs resetStoa — removeItem alone won't notify
  // same-tab subscribers).
  const handleReset = useCallback(() => {
    reset()
    resetStoa()
  }, [reset])

  const [tourIndex, setTourIndex] = useState(0)
  const tourSteps = useMemo(() => buildTourSteps(role), [role])
  useEffect(() => {
    // Restart the tour on role/mode change — deferred, never synchronous.
    const t = window.setTimeout(() => setTourIndex(0), 0)
    return () => window.clearTimeout(t)
  }, [role, mode])

  const captionKey = role === "teacher" ? "teacher" : role === "parent" ? "parent" : sliceStep
  const caption = SLICE_CAPTIONS[captionKey] ?? ""

  return (
    <div className="min-h-screen bg-[var(--la-page)] text-[var(--la-ink)]">
      <a
        href="#showcase-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--la-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--la-primary-ink)]"
      >
        Skip to the showcase
      </a>

      <ShowcaseShell
        role={role}
        device={device}
        mode={mode}
        captions={captions}
        copied={copied}
        onRole={(r) => update({ role: r })}
        onDevice={(d) => update({ device: d })}
        onMode={(m) => update({ mode: m })}
        onCaptions={(c) => update({ captions: c })}
        onShare={copyShareLink}
        onReset={handleReset}
      />

      <main id="showcase-main" className="mx-auto w-full max-w-6xl px-3 pb-16 pt-4 sm:px-6">
        <DeviceFrame device={device} label={`${SHOWCASE_ROLE_LABELS[role]} view`}>
          {role === "teacher" ? (
            <TeacherView />
          ) : role === "parent" ? (
            <ParentView />
          ) : (
            <ReaderSlice role={role} />
          )}
        </DeviceFrame>

        {captions && (
          <p
            aria-live="polite"
            className="mx-auto mt-4 max-w-2xl text-center font-sans text-sm text-[var(--la-ink-muted)]"
          >
            <span className="mr-2 rounded-full bg-[var(--la-surface-sunken)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--la-ink-faint)]">
              {role === "teacher" || role === "parent" ? SHOWCASE_ROLE_LABELS[role] : SLICE_STEP_LABELS[sliceStep]}
            </span>
            {caption}
          </p>
        )}
      </main>

      {mode === "tour" && (
        <CoachMarks steps={tourSteps} index={tourIndex} onIndex={setTourIndex} onExit={() => update({ mode: "explore" })} />
      )}
    </div>
  )
}
