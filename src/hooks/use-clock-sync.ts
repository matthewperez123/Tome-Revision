"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const SYNC_INTERVAL_MS = 30_000 // 30 seconds

/**
 * Polls the server for its current time and computes the clock offset.
 * All timer math should use (Date.now() - offset) to get server-adjusted time.
 *
 * offset = client_now - server_now
 * To get "server time now": Date.now() - offset
 */
export function useClockSync(): {
  offset: number
  isSynced: boolean
  syncNow: () => Promise<void>
} {
  const [offset, setOffset] = useState(0)
  const [isSynced, setIsSynced] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const syncNow = useCallback(async () => {
    try {
      const clientBefore = Date.now()
      const res = await fetch("/api/time")
      if (!res.ok) return
      const clientAfter = Date.now()
      const { serverTime } = await res.json()
      const serverMs = new Date(serverTime).getTime()
      // Estimate one-way latency as half the round-trip
      const rtt = clientAfter - clientBefore
      const clientAtServerTime = clientBefore + rtt / 2
      setOffset(clientAtServerTime - serverMs)
      setIsSynced(true)
    } catch {
      // Silently fail — use 0 offset (trust client clock)
    }
  }, [])

  useEffect(() => {
    syncNow()
    intervalRef.current = setInterval(syncNow, SYNC_INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [syncNow])

  return { offset, isSynced, syncNow }
}
