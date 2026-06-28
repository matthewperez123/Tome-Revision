"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { VirgilSurface } from "@/components/virgil/VirgilSurface"

// Gold is Virgil's signature mark (kept in lockstep with <VirgilSurface>).
const GOLD = "linear-gradient(135deg,#E6C76E 0%,#C8A24B 55%,#9C7A2E 100%)"

interface Props {
  sessionId: string
  /** A teacher gets a co-teacher framing; a student gets a Socratic guide. The
   *  server resolves the true role from session ownership — this only tunes the
   *  affordance's copy. */
  role?: "teacher" | "student"
}

/**
 * Guided-session Virgil — a floating, dismissible facilitator present in the
 * live session. The server resolves the caller's role from session ownership
 * (teacher iff they own it) and grounds Virgil in the assigned passage, so the
 * same surface serves both the locked student reader and the teacher monitor.
 * For students it is Socratic and never hands over answers.
 */
export function GuidedSessionVirgilDock({ sessionId, role = "student" }: Props) {
  const [open, setOpen] = useState(false)

  const teacher = role === "teacher"

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 h-[32rem] max-h-[calc(100vh-8rem)] w-[22rem] max-w-[calc(100vw-3rem)]">
          <VirgilSurface
            surface={{ kind: "guided-session", sessionId }}
            placeholder={teacher ? "Ask Virgil to summarize or steer…" : "Ask Virgil about the reading…"}
            hint={
              teacher
                ? "I can suggest discussion prompts, summarize the room, and point to where to steer next."
                : "I won't hand you answers — but I'll point you to where to look and how to think it through."
            }
            className="h-full shadow-2xl"
          />
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Virgil" : "Ask Virgil"}
        className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full text-white shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#C8A24B]/40"
        style={{ backgroundImage: GOLD }}
      >
        {open ? <X className="size-5" /> : <span className="font-serif text-lg font-bold leading-none">V</span>}
      </button>
    </>
  )
}
