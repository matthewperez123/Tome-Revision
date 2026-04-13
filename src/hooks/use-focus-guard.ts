"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { GuidedSessionMode, FocusState } from "@/lib/guided-learning-types"

interface Violation {
  type: string
  timestamp: string
}

interface UseFocusGuardOptions {
  mode: GuidedSessionMode
  enabled: boolean
  onViolation?: (violation: Violation) => void
  onAutoSubmit?: () => void
  maxViolations?: number
}

interface UseFocusGuardReturn {
  violationCount: number
  focusState: FocusState
  violations: Violation[]
}

/**
 * Focus guard hook that installs anti-distraction event listeners.
 *
 * Detects:
 * - Tab switches (visibilitychange)
 * - Window blur/focus
 * - Fullscreen exits
 * - Blocked keyboard shortcuts (Cmd/Ctrl+T/N/W, F11, Esc)
 * - Context menu (disabled)
 * - Copy/paste on quiz content (strict mode)
 *
 * Strict mode: 3 violations = auto-submit + flag
 * Lenient mode: warnings only
 */
export function useFocusGuard(options: UseFocusGuardOptions): UseFocusGuardReturn {
  const { mode, enabled, onViolation, onAutoSubmit, maxViolations = 3 } = options

  const [violations, setViolations] = useState<Violation[]>([])
  const [focusState, setFocusState] = useState<FocusState>("focused")
  const violationCountRef = useRef(0)
  const onViolationRef = useRef(onViolation)
  const onAutoSubmitRef = useRef(onAutoSubmit)
  onViolationRef.current = onViolation
  onAutoSubmitRef.current = onAutoSubmit

  const addViolation = useCallback(
    (type: string) => {
      const violation: Violation = { type, timestamp: new Date().toISOString() }
      setViolations((prev) => [...prev, violation])
      violationCountRef.current += 1
      setFocusState("violation")
      onViolationRef.current?.(violation)

      if (mode === "strict" && violationCountRef.current >= maxViolations) {
        onAutoSubmitRef.current?.()
      }
    },
    [mode, maxViolations],
  )

  useEffect(() => {
    if (!enabled) return

    // ── Visibility change (tab switch) ──────────────────────────────
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFocusState("blurred")
        addViolation("tab_hidden")
      } else {
        setFocusState("focused")
      }
    }

    // ── Window blur/focus ───────────────────────────────────────────
    const handleBlur = () => {
      setFocusState("blurred")
      // Only log if not already from a visibility change
      if (!document.hidden) {
        addViolation("window_blur")
      }
    }

    const handleFocus = () => {
      setFocusState("focused")
    }

    // ── Fullscreen exit detection ───────────────────────────────────
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        addViolation("fullscreen_exit")
      }
    }

    // ── Keyboard shortcut blocking ──────────────────────────────────
    const handleKeydown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey

      // Block Cmd/Ctrl + T (new tab), N (new window), W (close tab)
      if (meta && ["t", "n", "w"].includes(e.key.toLowerCase())) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // Block F11 (fullscreen toggle in some browsers)
      if (e.key === "F11") {
        e.preventDefault()
        return
      }

      // Block Escape (fullscreen exit) — note: browsers may not allow this
      if (e.key === "Escape") {
        e.preventDefault()
        return
      }
    }

    // ── Context menu (right-click) ──────────────────────────────────
    const handleContextMenu = (e: Event) => {
      e.preventDefault()
    }

    // ── Copy/paste blocking (strict mode) ───────────────────────────
    const handleCopyPaste = (e: ClipboardEvent) => {
      if (mode === "strict") {
        e.preventDefault()
      }
    }

    // Install listeners
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)
    window.addEventListener("focus", handleFocus)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("keydown", handleKeydown, { capture: true })
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("copy", handleCopyPaste)
    document.addEventListener("paste", handleCopyPaste)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("keydown", handleKeydown, { capture: true })
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("copy", handleCopyPaste)
      document.removeEventListener("paste", handleCopyPaste)
    }
  }, [enabled, mode, addViolation])

  return {
    violationCount: violations.length,
    focusState,
    violations,
  }
}
