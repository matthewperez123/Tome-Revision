"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 550 },
  { name: "highlight", duration: 700 },
  { name: "comment", duration: 700 },
  { name: "reply1", duration: 550 },
  { name: "reply2", duration: 700 },
  { name: "reset", duration: 200 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PASSAGE_LINES = [
  "Many a brave soul did it send",
  "hurrying down to Hades, and many",
  "a hero did it yield a prey to dogs",
]

const COMMENTS = [
  {
    initials: "LC",
    name: "Livia C.",
    bg: "bg-indigo-500/20",
    text: "text-indigo-500",
    body: "This line foreshadows the fate of Patroclus",
  },
  {
    initials: "MA",
    name: "Marcus A.",
    bg: "bg-amber-500/20",
    text: "text-amber-500",
    body: "Agreed \u2014 the catalogue of losses begins here",
  },
  {
    initials: "Prof.",
    name: "Prof.",
    bg: "bg-emerald-500/20",
    text: "text-emerald-500",
    body: "Excellent observation, both of you",
  },
]

export function DiscussionThreadsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showHighlight =
    phase === "highlight" ||
    phase === "comment" ||
    phase === "reply1" ||
    phase === "reply2"

  const showComment =
    phase === "comment" || phase === "reply1" || phase === "reply2"

  const showReply1 = phase === "reply1" || phase === "reply2"
  const showReply2 = phase === "reply2"

  if (isReduced) {
    return (
      <TeacherShowcaseShell
        heading="Discussion, anchored in the text"
        subcopy="Students post comments attached to specific passages. You and the whole class can see the conversation exactly where it happened."
        layout="mockup-right"
        bgClass="bg-muted"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="font-serif text-sm text-foreground leading-[1.9]">
            {PASSAGE_LINES.map((line, i) => (
              <span key={i}>
                {i === 1 ? (
                  <span className="bg-indigo-500/15 rounded px-0.5">{line}</span>
                ) : (
                  line
                )}
                {i < PASSAGE_LINES.length - 1 && <br />}
              </span>
            ))}
          </div>
          <div className="mt-4 ml-4 border-l-2 border-border pl-4 space-y-3">
            {COMMENTS.map((c, i) => (
              <div key={i} className="bg-muted rounded-lg p-3 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${c.bg} ${c.text}`}
                  >
                    {c.initials}
                  </div>
                  <span className="font-medium text-foreground">{c.name}</span>
                </div>
                <p className="text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell
      heading="Discussion, anchored in the text"
      subcopy="Students post comments attached to specific passages. You and the whole class can see the conversation exactly where it happened."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated discussion threads demonstration"
      >
        {/* Passage text */}
        <div className="font-serif text-sm text-foreground leading-[1.9]">
          {PASSAGE_LINES.map((line, i) => (
            <span key={i}>
              {i === 1 ? (
                <motion.span
                  initial={{ backgroundColor: "rgba(99,102,241,0)" }}
                  animate={{
                    backgroundColor: showHighlight
                      ? "rgba(99,102,241,0.15)"
                      : "rgba(99,102,241,0)",
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="rounded px-0.5"
                  style={{ willChange: "transform, opacity" }}
                >
                  {line}
                </motion.span>
              ) : (
                line
              )}
              {i < PASSAGE_LINES.length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Comment thread */}
        <div className="mt-4 ml-4 border-l-2 border-border pl-4 space-y-2">
          <AnimatePresence>
            {showComment && (
              <motion.div
                key="comment-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="bg-muted rounded-lg p-3 text-xs"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${COMMENTS[0].bg} ${COMMENTS[0].text}`}
                  >
                    {COMMENTS[0].initials}
                  </div>
                  <span className="font-medium text-foreground">
                    {COMMENTS[0].name}
                  </span>
                </div>
                <p className="text-muted-foreground">{COMMENTS[0].body}</p>
              </motion.div>
            )}

            {showReply1 && (
              <motion.div
                key="comment-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="bg-muted rounded-lg p-3 text-xs"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${COMMENTS[1].bg} ${COMMENTS[1].text}`}
                  >
                    {COMMENTS[1].initials}
                  </div>
                  <span className="font-medium text-foreground">
                    {COMMENTS[1].name}
                  </span>
                </div>
                <p className="text-muted-foreground">{COMMENTS[1].body}</p>
              </motion.div>
            )}

            {showReply2 && (
              <motion.div
                key="comment-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="bg-muted rounded-lg p-3 text-xs"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${COMMENTS[2].bg} ${COMMENTS[2].text}`}
                  >
                    {COMMENTS[2].initials}
                  </div>
                  <span className="font-medium text-foreground">
                    {COMMENTS[2].name}
                  </span>
                </div>
                <p className="text-muted-foreground">{COMMENTS[2].body}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </TeacherShowcaseShell>
  )
}
