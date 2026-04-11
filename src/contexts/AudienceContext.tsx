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

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceRaw] = useState<Audience>("reader")

  // Hydrate from sessionStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === "teacher") setAudienceRaw("teacher")
  }, [])

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
