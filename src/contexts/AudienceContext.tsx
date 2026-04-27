"use client"

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react"

type Audience = "reader" | "teacher"

interface AudienceContextValue {
  audience: Audience
  setAudience: (a: Audience) => void
}

const DEFAULT_VALUE: AudienceContextValue = {
  audience: "reader",
  setAudience: () => {},
}

const AudienceContext = createContext<AudienceContextValue>(DEFAULT_VALUE)

const STORAGE_KEY = "tome-audience"

export function AudienceProvider({
  children,
  initial,
}: {
  children: ReactNode
  /** When provided, skips sessionStorage hydration and locks the initial audience to this value (route-driven). */
  initial?: Audience
}) {
  const [audience, setAudienceRaw] = useState<Audience>(initial ?? "reader")

  // Hydrate from sessionStorage after mount to avoid SSR mismatch.
  // Skip when an `initial` prop is provided — the route owns the audience in that case.
  useEffect(() => {
    if (initial) return
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === "teacher") setAudienceRaw("teacher")
  }, [initial])

  const setAudience = useCallback((a: Audience) => {
    setAudienceRaw(a)
    try { sessionStorage.setItem(STORAGE_KEY, a) } catch {}
  }, [])

  const value = useMemo(() => ({ audience, setAudience }), [audience, setAudience])

  return (
    <AudienceContext value={value}>
      {children}
    </AudienceContext>
  )
}

export function useAudience() {
  return useContext(AudienceContext)
}
