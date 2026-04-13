"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { SessionEventType } from "@/lib/guided-learning-types"

interface QueuedEvent {
  event_type: SessionEventType
  payload: Record<string, unknown>
  queued_at: string
}

interface UseEventQueueReturn {
  /** Queue an event for batched sending */
  queueEvent: (eventType: SessionEventType, payload?: Record<string, unknown>) => void
  /** Force flush all queued events immediately */
  flush: () => Promise<void>
  /** Number of events waiting to be sent */
  pendingCount: number
}

const IDB_DB_NAME = "tome-guided-events"
const IDB_STORE_NAME = "pending-events"
const FLUSH_INTERVAL = 5000 // 5 seconds

/**
 * Offline-resilient batched event queue for guided learning sessions.
 *
 * Events are queued locally and flushed to the server every 5 seconds.
 * If offline, events persist in IndexedDB and flush on reconnect.
 */
export function useEventQueue(sessionId: string | null): UseEventQueueReturn {
  const [pendingCount, setPendingCount] = useState(0)
  const queueRef = useRef<QueuedEvent[]>([])
  const flushingRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const dbRef = useRef<IDBDatabase | null>(null)

  // ── IndexedDB Setup ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!sessionId) return

    try {
      const request = indexedDB.open(IDB_DB_NAME, 1)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME, { autoIncrement: true })
        }
      }

      request.onsuccess = () => {
        dbRef.current = request.result

        // Load any persisted events from a previous session/offline period
        const tx = dbRef.current.transaction(IDB_STORE_NAME, "readonly")
        const store = tx.objectStore(IDB_STORE_NAME)
        const getAll = store.getAll()

        getAll.onsuccess = () => {
          const stored = getAll.result as QueuedEvent[]
          if (stored.length > 0) {
            queueRef.current = [...stored, ...queueRef.current]
            setPendingCount(queueRef.current.length)
          }
        }
      }

      request.onerror = () => {
        // IndexedDB unavailable — fall back to in-memory only
        console.warn("IndexedDB unavailable for event queue, using in-memory fallback")
      }
    } catch {
      // IndexedDB not supported
    }

    return () => {
      dbRef.current?.close()
      dbRef.current = null
    }
  }, [sessionId])

  // ── Flush Logic ─────────────────────────────────────────────────────────

  const flushToServer = useCallback(async () => {
    if (!sessionId || flushingRef.current || queueRef.current.length === 0) return
    if (!navigator.onLine) return

    flushingRef.current = true
    const batch = [...queueRef.current]
    queueRef.current = []
    setPendingCount(0)

    try {
      const res = await fetch(`/api/guided-sessions/${sessionId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: batch.map(({ event_type, payload }) => ({ event_type, payload })),
        }),
      })

      if (!res.ok) {
        // Put events back in queue on failure
        queueRef.current = [...batch, ...queueRef.current]
        setPendingCount(queueRef.current.length)
      } else {
        // Clear from IndexedDB on success
        clearIDB()
      }
    } catch {
      // Network error — put events back
      queueRef.current = [...batch, ...queueRef.current]
      setPendingCount(queueRef.current.length)
      persistToIDB(queueRef.current)
    } finally {
      flushingRef.current = false
    }
  }, [sessionId])

  // ── Periodic Flush ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!sessionId) return

    intervalRef.current = setInterval(flushToServer, FLUSH_INTERVAL)

    // Flush on reconnect
    const handleOnline = () => flushToServer()
    window.addEventListener("online", handleOnline)

    // Flush before unload
    const handleBeforeUnload = () => {
      // Best-effort sync flush via sendBeacon
      if (queueRef.current.length > 0) {
        const payload = JSON.stringify({
          events: queueRef.current.map(({ event_type, payload }) => ({
            event_type,
            payload,
          })),
        })
        navigator.sendBeacon(`/api/guided-sessions/${sessionId}/events`, payload)
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [sessionId, flushToServer])

  // ── IDB Helpers ─────────────────────────────────────────────────────────

  function persistToIDB(events: QueuedEvent[]) {
    if (!dbRef.current) return
    try {
      const tx = dbRef.current.transaction(IDB_STORE_NAME, "readwrite")
      const store = tx.objectStore(IDB_STORE_NAME)
      store.clear()
      events.forEach((e) => store.add(e))
    } catch {
      // Silently fail — in-memory is the fallback
    }
  }

  function clearIDB() {
    if (!dbRef.current) return
    try {
      const tx = dbRef.current.transaction(IDB_STORE_NAME, "readwrite")
      tx.objectStore(IDB_STORE_NAME).clear()
    } catch {
      // Silently fail
    }
  }

  // ── Public API ──────────────────────────────────────────────────────────

  const queueEvent = useCallback(
    (eventType: SessionEventType, payload: Record<string, unknown> = {}) => {
      const event: QueuedEvent = {
        event_type: eventType,
        payload,
        queued_at: new Date().toISOString(),
      }
      queueRef.current.push(event)
      setPendingCount(queueRef.current.length)
      persistToIDB(queueRef.current)
    },
    [],
  )

  return {
    queueEvent,
    flush: flushToServer,
    pendingCount,
  }
}
