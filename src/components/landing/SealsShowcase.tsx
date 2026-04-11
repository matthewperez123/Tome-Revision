"use client"

import { motion, AnimatePresence } from "motion/react"
import { Shield, Flame } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { QuillCursor } from "./QuillCursor"
import { useAnimationLoop } from "./useAnimationLoop"

const PHASES = [
  { name: "idle", duration: 3000 },
  { name: "sealUnlock", duration: 4000 },
  { name: "flame", duration: 4000 },
  { name: "sealUnlock2", duration: 4000 },
  { name: "reset", duration: 600 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function SealsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showSeal = phase === "sealUnlock" || phase === "sealUnlock2"
  const showFlame = phase === "flame"
  const sealName = phase === "sealUnlock2" ? "Seal of Dante" : "Seal of Homer"
  const sealDesc = phase === "sealUnlock2" ? "Complete the Divine Comedy" : "Read 5 Greek texts"

  const quillPos = (() => {
    switch (phase) {
      case "idle":         return { x: 200, y: 80 }
      case "sealUnlock":   return { x: 140, y: 110 }
      case "flame":        return { x: 100, y: 120 }
      case "sealUnlock2":  return { x: 140, y: 110 }
      default:             return { x: 200, y: 80 }
    }
  })()
  const quillClicking = phase === "sealUnlock" || phase === "sealUnlock2"

  if (isReduced) {
    return (
      <SealsShell>
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center gap-6">
          <div className="size-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <Shield className="size-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-[var(--font-display)] text-lg font-bold text-foreground">Seal of Homer</p>
            <p className="text-xs text-muted-foreground mt-1">Read 5 Greek texts</p>
          </div>
        </div>
      </SealsShell>
    )
  }

  return (
    <SealsShell>
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[280px] relative overflow-hidden flex flex-col items-center justify-center"
        style={{ willChange: "transform" }}
        aria-label="Animated seals and streaks demonstration"
      >
        <AnimatePresence mode="wait">
          {(phase === "idle" || showSeal) && (
            <motion.div
              key="seal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex flex-col items-center py-4"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative">
                <motion.div
                  animate={showSeal ? { scale: [0, 1.15, 1] } : { scale: 0.8, opacity: 0.4 }}
                  transition={{ duration: 0.5, times: showSeal ? [0, 0.6, 1] : undefined, ease: EASE }}
                  className="size-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
                  style={{ willChange: "transform" }}
                >
                  <Shield className="size-10 text-primary" />
                </motion.div>
                {showSeal && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    style={{ willChange: "transform, opacity" }}
                  />
                )}
              </div>
              <motion.p
                animate={{ opacity: showSeal ? 1 : 0.4 }}
                className="mt-4 font-[var(--font-display)] text-lg font-bold text-foreground"
              >
                {sealName}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-1">{sealDesc}</p>
              {showSeal && (
                <motion.p
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [1, 1, 0], y: -15 }}
                  transition={{ duration: 1, times: [0, 0.5, 1], ease: EASE }}
                  className="text-sm text-primary font-semibold mt-2"
                  style={{ willChange: "transform, opacity" }}
                >
                  Seal unlocked!
                </motion.p>
              )}
            </motion.div>
          )}

          {showFlame && (
            <motion.div
              key="flame"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex items-center justify-center gap-5 py-6"
              style={{ willChange: "transform, opacity" }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.8, repeat: 2, repeatType: "loop", ease: EASE }}
                style={{ willChange: "transform" }}
              >
                <Flame className="size-12 text-orange-500" />
              </motion.div>
              <div>
                <motion.p
                  className="text-3xl font-bold text-foreground font-[var(--font-display)] tabular-nums"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, ease: EASE }}
                >
                  14 days
                </motion.p>
                <p className="text-xs text-muted-foreground">Reading streak</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <QuillCursor
          visible
          x={quillPos.x}
          y={quillPos.y}
          clicking={quillClicking}
        />
      </div>
    </SealsShell>
  )
}

function SealsShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 items-center">
        <BlurFade delay={0.1} inView>
          {children}
        </BlurFade>
        <div>
          <BlurFade delay={0.15} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-2">
              Mark your progress.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Earn Seals for milestones and keep your Flame alive with daily reading. The language is classical, the motivation is real.
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
