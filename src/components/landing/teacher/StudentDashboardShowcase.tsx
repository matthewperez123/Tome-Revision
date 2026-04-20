"use client"

import { motion, AnimatePresence } from "motion/react"
import { Flame } from "lucide-react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 2000 },
  { name: "slideIn", duration: 2000 },
  { name: "progress", duration: 3000 },
  { name: "seals", duration: 2500 },
  { name: "flame", duration: 2000 },
  { name: "reset", duration: 600 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const SEALS = [
  { id: 0, unlocked: true },
  { id: 1, unlocked: true },
  { id: 2, unlocked: true },
  { id: 3, unlocked: false },
]

function ProgressRing({ progress }: { progress: number }) {
  const r = 30
  const circumference = 2 * Math.PI * r
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={72} height={72} viewBox="0 0 72 72" className="block">
      <circle
        cx={36}
        cy={36}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        className="text-border"
      />
      <motion.circle
        cx={36}
        cy={36}
        r={r}
        fill="none"
        stroke="#6366F1"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.8, ease: EASE }}
        style={{ willChange: "transform, opacity" }}
        transform="rotate(-90 36 36)"
      />
    </svg>
  )
}

function FlameCounter({ target }: { target: number }) {
  return (
    <div className="flex items-center gap-3">
      <Flame className="size-6 text-orange-500" />
      <motion.span
        className="text-2xl font-bold text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ willChange: "transform, opacity" }}
      >
        {target}
      </motion.span>
      <span className="text-xs text-muted-foreground">7-day Flame</span>
    </div>
  )
}

export function StudentDashboardShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showCard =
    phase === "slideIn" ||
    phase === "progress" ||
    phase === "seals" ||
    phase === "flame"

  const showProgress = phase === "progress" || phase === "seals" || phase === "flame"
  const showSeals = phase === "seals" || phase === "flame"
  const showFlame = phase === "flame"

  if (isReduced) {
    return (
      <TeacherShowcaseShell
        heading="Know every reader"
        subcopy="A full dashboard for each student: books finished, Seals earned, Flame streak, time in the text, and recent annotations."
        layout="mockup-left"
        bgClass="bg-background"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-500">
              LC
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Livia C.</p>
              <p className="text-xs text-muted-foreground">Section A</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <svg width={72} height={72} viewBox="0 0 72 72">
              <circle cx={36} cy={36} r={30} fill="none" stroke="currentColor" strokeWidth={3} className="text-border" />
              <circle
                cx={36} cy={36} r={30} fill="none" stroke="#6366F1" strokeWidth={3} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * 0.25}
                transform="rotate(-90 36 36)"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-foreground">3 of 4 books</p>
              <p className="text-xs text-muted-foreground">Reading time: 12.4h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {SEALS.map((s) => (
              <div
                key={s.id}
                className={
                  s.unlocked
                    ? "size-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center"
                    : "size-6 rounded-full bg-muted border border-border"
                }
              >
                {s.unlocked && (
                  <span className="text-[10px]" role="img" aria-label="seal">
                    ★
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Flame className="size-6 text-orange-500" />
            <span className="text-2xl font-bold text-foreground">7</span>
            <span className="text-xs text-muted-foreground">7-day Flame</span>
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell
      heading="Know every reader"
      subcopy="A full dashboard for each student: books finished, Seals earned, Flame streak, time in the text, and recent annotations."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated student dashboard demonstration"
      >
        {/* Student profile header */}
        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-500">
                  LC
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Livia C.</p>
                  <p className="text-xs text-muted-foreground">Section A</p>
                </div>
              </div>

              {/* Progress ring + stats */}
              <AnimatePresence>
                {showProgress && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex items-center gap-4 mb-5"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <ProgressRing progress={75} />
                    <div>
                      <p className="text-sm font-medium text-foreground">3 of 4 books</p>
                      <p className="text-xs text-muted-foreground">Reading time: 12.4h</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Seal badges */}
              <AnimatePresence>
                {showSeals && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex items-center gap-2 mb-5"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {SEALS.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: i * 0.25,
                          duration: 0.4,
                          ease: EASE,
                        }}
                        className={
                          s.unlocked
                            ? "size-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center"
                            : "size-6 rounded-full bg-muted border border-border"
                        }
                        style={{ willChange: "transform, opacity" }}
                      >
                        {s.unlocked && (
                          <span className="text-[10px]" role="img" aria-label="seal">
                            ★
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flame counter */}
              <AnimatePresence>
                {showFlame && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <FlameCounter target={7} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </TeacherShowcaseShell>
  )
}
