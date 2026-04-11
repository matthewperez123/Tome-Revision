"use client"

import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { QuillCursor, type CursorWaypoint } from "@/components/homepage/QuillCursor"
import { MockReader } from "@/components/homepage/mock/MockReader"
import { MockVirgilDrawer } from "@/components/homepage/mock/MockVirgilDrawer"

// State machine
type State = "SHOW_ODYSSEY" | "HOVER_MARKER" | "OPEN_DRAWER" | "CLICK_CROSSREF" | "SHOW_AENEID" | "RETURN_BOOKMARK" | "IDLE"
type Action = { type: State | "RESET" }

function reducer(_state: State, action: Action): State {
  if (action.type === "RESET") return "SHOW_ODYSSEY"
  return action.type as State
}

const ODYSSEY_TEXT = "Thence we sailed on, grieved at heart, glad to have escaped death, but having lost our dear comrades. And we came to the isle of Aeaea, where dwelt fair-tressed Circe, a dread goddess of human speech, own sister to Baleful Aeetes."

const AENEID_TEXT = "I sing of arms and the man, he who, exiled by fate, first came from the coast of Troy to Italy, and to Lavinian shores \u2014 much buffeted he on land and on the deep by force of the gods, by reason of cruel Juno\u2019s unforgetting wrath."

const CROSS_REF = {
  type: "COMPARE",
  workTitle: "Aeneid, Book I",
  workAuthor: "Virgil",
  description: "Both Odysseus and Aeneas face divine intervention on the sea. Their responses reveal fundamental differences in Greek and Roman heroic ideals.",
}

const VIRGIL_NOTE = "Circe is both dangerous and hospitable \u2014 a figure of transformation. Homer presents her as a test of Odysseus\u2019s cunning, while later traditions (especially Virgil) cast her as a symbol of the seductive dangers that delay the hero\u2019s homecoming."

export function ReaderDemoLoop() {
  const [state, dispatch] = useReducer(reducer, "SHOW_ODYSSEY")
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  const isInView = mounted
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  // Auto-advance for timed states
  useEffect(() => {
    if (!isInView || reduced) return
    clearTimer()

    const delays: Partial<Record<State, number>> = {
      SHOW_ODYSSEY: 2000,
      HOVER_MARKER: 1000,
      CLICK_CROSSREF: 1500,
      RETURN_BOOKMARK: 1500,
      IDLE: 2500,
    }

    const nextState: Partial<Record<State, State | "RESET">> = {
      SHOW_ODYSSEY: "HOVER_MARKER",
      HOVER_MARKER: "OPEN_DRAWER",
      CLICK_CROSSREF: "SHOW_AENEID",
      RETURN_BOOKMARK: "IDLE",
      IDLE: "RESET",
    }

    const delay = delays[state]
    const next = nextState[state]
    if (delay && next) {
      timerRef.current = setTimeout(() => dispatch({ type: next }), delay)
    }

    return clearTimer
  }, [state, isInView, reduced, clearTimer])

  // Reduced motion: static frame
  if (reduced) {
    return (
      <div className="bg-[#0D0D0D] h-full w-full relative">
        <MockReader
          bookTitle="The Odyssey"
          chapter="Book X"
          text={ODYSSEY_TEXT}
          highlightText="Circe"
          progressPct={23}
        />
        <MockVirgilDrawer open title="On Circe" text={VIRGIL_NOTE} crossRef={CROSS_REF} />
      </div>
    )
  }

  const showOdyssey = state !== "SHOW_AENEID"
  const drawerOpen = state === "OPEN_DRAWER" || state === "CLICK_CROSSREF"
  const showHighlight = state !== "SHOW_ODYSSEY" && state !== "IDLE"

  // Cursor waypoints per state
  const waypoints: CursorWaypoint[] = (() => {
    switch (state) {
      case "OPEN_DRAWER":
        return [{ x: 70, y: 82, action: "move" as const, duration: 1 }]
      case "CLICK_CROSSREF":
        return [{ x: 70, y: 82, action: "click" as const, duration: 0.5, onReach: () => dispatch({ type: "CLICK_CROSSREF" }) }]
      case "SHOW_AENEID":
        return [{ x: 88, y: 8, action: "move" as const, duration: 1.5 }]
      case "RETURN_BOOKMARK":
        return [{ x: 88, y: 8, action: "click" as const, duration: 0.5 }]
      default:
        return [{ x: 72, y: 35, action: "move" as const, duration: 1 }]
    }
  })()

  return (
    <div ref={containerRef} className="bg-[#0D0D0D] h-full w-full relative overflow-hidden min-h-[280px]">
      <AnimatePresence mode="wait">
        {showOdyssey ? (
          <motion.div key="odyssey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="h-full">
            <MockReader
              bookTitle="The Odyssey"
              chapter="Book X"
              text={ODYSSEY_TEXT}
              highlightText={showHighlight ? "Circe" : undefined}
              progressPct={state === "IDLE" ? 28 : 23}
              showBookmark={state === "CLICK_CROSSREF"}
              bookmarkLabel="Saved"
            />
          </motion.div>
        ) : (
          <motion.div key="aeneid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="h-full">
            <MockReader
              bookTitle="The Aeneid"
              chapter="Book I"
              text={AENEID_TEXT}
              progressPct={0}
              showBookmark={state === "SHOW_AENEID"}
              bookmarkLabel="Return to Odyssey"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MockVirgilDrawer
        open={drawerOpen}
        title="On Circe"
        text={VIRGIL_NOTE}
        crossRef={CROSS_REF}
      />

      <QuillCursor path={waypoints} loop={false} visible={isInView && state !== "IDLE"} />
    </div>
  )
}
