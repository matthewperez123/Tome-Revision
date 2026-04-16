"use client"

import { useState } from "react"
import { LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  allowEarlyExit: boolean
  onExit: () => void
}

/**
 * Overlay that dims the sidebar during a guided session.
 * Renders over the sidebar area with reduced opacity and disabled pointer events.
 * Shows an "Exit Session" button at the bottom.
 */
export function LockedSidebarOverlay({ allowEarlyExit, onExit }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      {/* Dim overlay covering sidebar area */}
      <div
        className="fixed left-0 top-0 z-40 h-full"
        style={{
          width: "var(--sidebar-width, 16rem)",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          pointerEvents: "all",
        }}
        aria-hidden="true"
      >
        {/* Block all clicks on the sidebar */}
        <div className="h-full w-full" style={{ opacity: 0.3, pointerEvents: "none" }} />

        {/* Exit button at bottom */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center" style={{ pointerEvents: "auto" }}>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
            style={{ color: "var(--tome-error, #C84A52)" }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit Session
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="mx-4 w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl"
            style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(200, 74, 82, 0.1)" }}
              >
                <AlertTriangle className="h-5 w-5" style={{ color: "var(--tome-error, #C84A52)" }} />
              </div>
              <div>
                <p className="font-semibold">Leave session?</p>
                <p className="text-xs opacity-50">
                  {allowEarlyExit
                    ? "Your teacher will be notified that you left early."
                    : "You cannot leave until the session ends or your teacher releases you."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                Stay
              </Button>
              {allowEarlyExit && (
                <Button
                  onClick={onExit}
                  className="text-white"
                  style={{ backgroundColor: "var(--tome-error, #C84A52)" }}
                >
                  Leave Session
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
