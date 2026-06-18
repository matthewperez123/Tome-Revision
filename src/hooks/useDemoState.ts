"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * useDemoState — tiny state container shared by the interactive homepage demos.
 *
 * Wraps a piece of demo state with:
 *   • `interacted` — flips true on the first user action (lets a demo drop any
 *     idle hint / auto-cue once the visitor takes control)
 *   • `set` — update state AND mark interacted in one call
 *   • `reset` — restore the initial value and clear `interacted`
 *   • `reduced` — the user's prefers-reduced-motion setting (SSR-safe)
 *
 * No persistence, no network — pure in-memory demo state.
 */
export function useDemoState<T>(initial: T) {
  const [state, setState] = useState<T>(initial)
  const [interacted, setInteracted] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setInteracted(true)
    setState(next)
  }, [])

  const reset = useCallback(() => {
    setInteracted(false)
    setState(initial)
  }, [initial])

  return { state, set, setRaw: setState, interacted, reset, reduced }
}
