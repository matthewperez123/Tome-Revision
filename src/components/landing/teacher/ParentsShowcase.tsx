"use client"

import { motion } from "motion/react"
import { Mail, Send, Check, Paperclip } from "lucide-react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 600 },
  { name: "list", duration: 1200 },
  { name: "compose", duration: 2000 },
  { name: "sent", duration: 1800 },
  { name: "reset", duration: 500 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PARENTS = [
  { name: "David Chen", student: "Emma Chen", last: "Apr 5" },
  { name: "Patrick O'Brien", student: "James O'Brien", last: "Apr 3" },
  { name: "Carmen Rodriguez", student: "Sofia Rodriguez", last: "Apr 1" },
]

export function ParentsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showList = phase !== "idle"
  const showCompose = phase === "compose" || phase === "sent"
  const showSent = phase === "sent"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="Keep parents in the loop" subcopy="Send progress reports, grade notifications, and celebration messages. Every parent, every student, one inbox." layout="mockup-right" bgClass="bg-muted">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider font-medium">Parents</p>
          {PARENTS.map(p => (
            <div key={p.name} className="flex items-center gap-2 py-1.5 text-[10px]">
              <Mail className="size-3 text-muted-foreground" />
              <span className="font-medium">{p.name}</span>
              <span className="text-muted-foreground ml-auto">{p.student}</span>
            </div>
          ))}
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="Keep parents in the loop" subcopy="Send progress reports, grade notifications, and celebration messages. Every parent, every student, one inbox." layout="mockup-right" bgClass="bg-muted">
      <div ref={containerRef} className="flex gap-3 min-h-[280px]" style={{ willChange: "transform" }}>
        {/* Left: parent list */}
        <motion.div animate={{ opacity: showList ? 1 : 0, x: showList ? 0 : -10 }} transition={{ duration: 0.4, ease: EASE }} className="w-[140px] shrink-0 bg-card rounded-xl border border-border p-3" style={{ willChange: "transform, opacity" }}>
          <p className="text-[8px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Parents</p>
          {PARENTS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0 }} animate={{ opacity: showList ? 1 : 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className={`flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[8px] cursor-pointer ${i === 0 && showCompose ? "bg-muted" : ""}`} style={{ willChange: "opacity" }}>
              <div className="size-4 rounded-full bg-muted flex items-center justify-center text-[6px] font-bold">{p.name[0]}</div>
              <div className="min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-[7px] text-muted-foreground truncate">{p.student}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right: compose */}
        <motion.div animate={{ opacity: showCompose ? 1 : 0, x: showCompose ? 0 : 10 }} transition={{ duration: 0.4, ease: EASE }} className="flex-1 bg-card rounded-xl border border-border p-3 flex flex-col" style={{ willChange: "transform, opacity" }}>
          <p className="text-[9px] font-semibold mb-2">David Chen</p>
          <p className="text-[7px] text-muted-foreground mb-3">david.chen@email.com · Emma Chen (father)</p>

          <div className="space-y-2 flex-1">
            <div>
              <p className="text-[7px] text-muted-foreground mb-0.5">Subject</p>
              <motion.div animate={{ opacity: showCompose ? 1 : 0 }} className="rounded border px-2 py-1 text-[8px]" style={{ willChange: "opacity" }}>Weekly Progress Update — Emma</motion.div>
            </div>
            <div>
              <p className="text-[7px] text-muted-foreground mb-0.5">Message</p>
              <motion.div animate={{ opacity: showCompose ? 1 : 0 }} transition={{ delay: 0.2 }} className="rounded border px-2 py-1.5 text-[7px] text-muted-foreground/80 leading-relaxed min-h-[50px]" style={{ willChange: "opacity" }}>
                Dear Mr. Chen, Emma has had an excellent week...
              </motion.div>
            </div>
            <motion.div animate={{ opacity: showCompose ? 1 : 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-1.5" style={{ willChange: "opacity" }}>
              <Paperclip className="size-2.5 text-muted-foreground" />
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 text-[7px] text-indigo-600 dark:text-indigo-400">Weekly Progress — Apr 1–5</span>
            </motion.div>
          </div>

          <motion.button animate={{ backgroundColor: showSent ? "#22C55E" : "#6366F1", scale: showSent ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.3 }} className="mt-2 w-full rounded-md py-1.5 text-[9px] font-medium text-white flex items-center justify-center gap-1" style={{ willChange: "transform" }}>
            {showSent ? <><Check className="size-3" /> Sent!</> : <><Send className="size-3" /> Send</>}
          </motion.button>
        </motion.div>
      </div>
    </TeacherShowcaseShell>
  )
}
