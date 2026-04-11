"use client"

import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { QuillCursor, type CursorWaypoint } from "@/components/homepage/QuillCursor"
import { ArrowLeft } from "lucide-react"

// State machine
type State = "WORLD_VIEW" | "HOVER_EUROPE" | "EUROPE_ZOOM" | "FRANCE_PANEL" | "AUTHOR_DETAIL" | "ZOOM_OUT"
type Action = { type: State | "RESET" }

function reducer(_state: State, action: Action): State {
  if (action.type === "RESET") return "WORLD_VIEW"
  return action.type as State
}

const AUTHORS = [
  { name: "Victor Hugo", books: 12 },
  { name: "Gustave Flaubert", books: 3 },
  { name: "Marcel Proust", books: 7 },
  { name: "Alexandre Dumas", books: 5 },
  { name: "Albert Camus", books: 4 },
]

export function ExploreDemoLoop() {
  const [state, dispatch] = useReducer(reducer, "WORLD_VIEW")
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  const isInView = mounted // Always run when mounted (parent FeatureCard/Section handles visibility)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  useEffect(() => {
    if (!isInView || reduced) return
    clearTimer()

    const delays: Partial<Record<State, number>> = {
      WORLD_VIEW: 2000,
      HOVER_EUROPE: 1500,
      EUROPE_ZOOM: 1500,
      FRANCE_PANEL: 2500,
      AUTHOR_DETAIL: 2500,
      ZOOM_OUT: 2000,
    }
    const nextState: Partial<Record<State, State | "RESET">> = {
      WORLD_VIEW: "HOVER_EUROPE",
      HOVER_EUROPE: "EUROPE_ZOOM",
      EUROPE_ZOOM: "FRANCE_PANEL",
      FRANCE_PANEL: "AUTHOR_DETAIL",
      AUTHOR_DETAIL: "ZOOM_OUT",
      ZOOM_OUT: "RESET",
    }

    const delay = delays[state]
    const next = nextState[state]
    if (delay && next) {
      timerRef.current = setTimeout(() => dispatch({ type: next }), delay)
    }

    return clearTimer
  }, [state, isInView, reduced, clearTimer])

  const isZoomed = state === "EUROPE_ZOOM" || state === "FRANCE_PANEL" || state === "AUTHOR_DETAIL"
  const showPanel = state === "FRANCE_PANEL" || state === "AUTHOR_DETAIL"
  const europeHighlighted = state === "HOVER_EUROPE" || isZoomed

  if (reduced) {
    return (
      <div className="bg-[#0F0E1A] h-full w-full relative p-4 min-h-[280px]">
        <MapSVG zoomed highlightEurope highlightFrance />
      </div>
    )
  }

  const waypoints: CursorWaypoint[] = (() => {
    switch (state) {
      case "WORLD_VIEW": return [{ x: 52, y: 30, action: "move" as const, duration: 1.5 }]
      case "HOVER_EUROPE": return [{ x: 52, y: 30, action: "hover" as const, duration: 0.6 }]
      case "EUROPE_ZOOM": return [{ x: 46, y: 42, action: "move" as const, duration: 1 }]
      case "FRANCE_PANEL": return [{ x: 30, y: 35, action: "move" as const, duration: 1 }]
      case "AUTHOR_DETAIL": return [{ x: 8, y: 8, action: "move" as const, duration: 1 }]
      default: return [{ x: 50, y: 50, action: "move" as const, duration: 1 }]
    }
  })()

  return (
    <div ref={containerRef} className="bg-[#0F0E1A] h-full w-full relative overflow-hidden min-h-[280px]">
      {/* Map */}
      <motion.div
        className="absolute inset-0"
        animate={showPanel ? { x: "-20%" } : { x: "0%" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <MapSVG
          zoomed={isZoomed}
          highlightEurope={europeHighlighted}
          highlightFrance={state === "FRANCE_PANEL" || state === "AUTHOR_DETAIL"}
        />

        {/* Tooltip */}
        <AnimatePresence>
          {state === "HOVER_EUROPE" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bg-[#222] border border-[#444] rounded px-2 py-1 text-[9px] text-[#FAF7F2]"
              style={{ top: "22%", left: "48%" }}
            >
              Europe &mdash; 347 books, 89 authors
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Side panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 bottom-0 w-[45%] bg-[#161622] border-l border-[#333] p-3 overflow-y-auto"
          >
            <AnimatePresence mode="wait">
              {state === "FRANCE_PANEL" ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-[10px] font-semibold text-[#FAF7F2] mb-2">France</p>
                  {AUTHORS.map((a, i) => (
                    <motion.div
                      key={a.name}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-1.5 rounded px-2 py-1.5 mb-1 bg-[#1A1A2E] hover:bg-[#222244]"
                    >
                      <div className="size-4 rounded-full bg-[#333] flex items-center justify-center text-[7px] font-bold text-[#FAF7F2]">
                        {a.name[0]}
                      </div>
                      <span className="flex-1 text-[9px] text-[#FAF7F2]">{a.name}</span>
                      <span className="text-[8px] text-[#7A756D]">{a.books}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button className="flex items-center gap-1 text-[9px] text-[#7A756D] mb-2">
                    <ArrowLeft className="size-2.5" /> Back
                  </button>
                  <p className="text-[12px] font-semibold text-[#FAF7F2] font-[var(--font-display)]">Victor Hugo</p>
                  <p className="text-[9px] text-[#7A756D] mb-1">1802&ndash;1885</p>
                  <p className="text-[8px] text-[#C4BFB6] leading-relaxed mb-2">
                    French poet, novelist, and dramatist of the Romantic movement. Widely regarded as one of the greatest French writers.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["Les Mis\u00e9rables", "Notre-Dame", "Ninety-Three"].map(b => (
                      <span key={b} className="text-[7px] bg-[#D4AF37]/10 text-[#D4AF37] rounded px-1.5 py-0.5">
                        {b}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <QuillCursor path={waypoints} loop={false} visible={isInView} />
    </div>
  )
}

// Simplified inline SVG world map
function MapSVG({ zoomed, highlightEurope, highlightFrance }: { zoomed?: boolean; highlightEurope?: boolean; highlightFrance?: boolean }) {
  const defaultFill = "#1A1A2E"
  const activeFill = "#2A2A4E"
  const europeFill = highlightEurope ? "#D4AF37" : activeFill
  const franceFill = highlightFrance ? "#D4AF37" : activeFill

  return (
    <motion.svg
      viewBox={zoomed ? "280 60 220 200" : "0 0 800 400"}
      className="w-full h-full"
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Ocean */}
      <rect x="0" y="0" width="800" height="400" fill="#0F0E1A" />

      {/* North America */}
      <path d="M80,80 Q120,60 180,70 L200,100 Q220,130 210,170 L190,200 Q170,210 140,200 L100,180 Q70,150 60,120 Z" fill={activeFill} stroke="#2A2A3E" strokeWidth="0.5" />

      {/* South America */}
      <path d="M160,220 Q180,210 200,220 L210,260 Q220,300 200,340 L180,360 Q160,350 150,320 L145,280 Z" fill={activeFill} stroke="#2A2A3E" strokeWidth="0.5" />

      {/* Europe */}
      <path d="M340,80 Q360,70 390,75 L410,90 Q420,110 415,130 L400,145 Q380,155 360,145 L340,130 Q330,110 335,90 Z" fill={europeFill} stroke="#2A2A3E" strokeWidth="0.5" />

      {/* France (inside Europe, visible when zoomed) */}
      {zoomed && (
        <path d="M340,110 Q350,105 365,108 L370,120 Q372,130 365,135 L350,138 Q340,135 338,125 Z" fill={franceFill} stroke="#3A3A5E" strokeWidth="0.8" />
      )}

      {/* Africa */}
      <path d="M350,170 Q380,160 410,170 L420,210 Q430,260 410,310 L380,330 Q360,320 350,290 L340,240 Z" fill={activeFill} stroke="#2A2A3E" strokeWidth="0.5" />

      {/* Asia */}
      <path d="M440,70 Q500,55 580,65 L620,90 Q640,120 630,160 L600,190 Q560,200 500,190 L460,170 Q430,140 435,100 Z" fill={activeFill} stroke="#2A2A3E" strokeWidth="0.5" />

      {/* Australia */}
      <path d="M600,280 Q630,270 660,280 L670,310 Q665,330 640,335 L620,330 Q600,320 595,300 Z" fill={activeFill} stroke="#2A2A3E" strokeWidth="0.5" />

      {/* Region dots (pulsing) */}
      {!zoomed && (
        <>
          <circle cx="150" cy="140" r="3" fill="#D4AF37" opacity="0.8"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" /></circle>
          <circle cx="370" cy="110" r="3" fill="#D4AF37" opacity="0.8"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" begin="0.3s" /></circle>
          <circle cx="380" cy="250" r="3" fill="#D4AF37" opacity="0.8"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" begin="0.6s" /></circle>
          <circle cx="530" cy="120" r="3" fill="#D4AF37" opacity="0.8"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" begin="0.9s" /></circle>
          <circle cx="640" cy="300" r="3" fill="#D4AF37" opacity="0.8"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" begin="1.2s" /></circle>
        </>
      )}
    </motion.svg>
  )
}
