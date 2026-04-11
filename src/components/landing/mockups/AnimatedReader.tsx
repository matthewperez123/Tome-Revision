"use client"

import { motion, AnimatePresence } from "motion/react"
import { Check } from "lucide-react"
import { useAnimationLoop } from "../useAnimationLoop"

const PHASES = [
  { name: "reading", duration: 4500 },
  { name: "annotation", duration: 3500 },
  { name: "reading2", duration: 3500 },
  { name: "annotation2", duration: 3500 },
  { name: "celebrate", duration: 3500 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PASSAGE = `Tell me, O muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of Troy. Many cities did he visit, and many were the nations with whose manners and customs he was acquainted; moreover he suffered much by sea while trying to save his own life and bring his men safely home; but do what he might he could not save his men, for they perished through their own sheer folly in eating the cattle of the Sun-god Hyperion; so the god prevented them from ever reaching home.`

const ANNOTATION_1 = {
  trigger: "cattle of the Sun-god Hyperion",
  title: "Virgil notes",
  text: "The cattle of Helios (the Sun-god) on the island of Thrinacia are sacred and immortal. Homer uses this transgression to demonstrate that even after all their trials, the crew\u2019s lack of self-discipline seals their fate.",
}

const ANNOTATION_2 = {
  trigger: "ingenious hero",
  title: "Virgil \u00b7 Epithet",
  text: "Homer\u2019s epithet \u2018polytropos\u2019 (\u03c0\u03bf\u03bb\u03cd\u03c4\u03c1\u03bf\u03c0\u03bf\u03c2) literally means \u2018of many turns.\u2019 It signals Odysseus\u2019 defining trait: not strength like Achilles, but cunning adaptability.",
}

export function AnimatedReader() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showAnnotation1 = phase === "annotation"
  const showAnnotation2 = phase === "annotation2"
  const showHighlight1 = phase === "annotation" || phase === "reading2"
  const showHighlight2 = phase === "annotation2"
  const isCelebrate = phase === "celebrate"

  const progressWidth = isCelebrate ? "100%"
    : (phase === "annotation2" || phase === "reading2") ? "42%"
    : phase === "annotation" ? "28%"
    : "23%"

  if (isReduced) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 relative overflow-hidden">
        <div className="w-full h-1 bg-muted rounded-full mb-5">
          <div className="h-1 bg-primary rounded-full" style={{ width: "28%" }} />
        </div>
        <p className="text-xs text-muted-foreground mb-1">The Odyssey &middot; Book I</p>
        <p className="font-serif text-sm text-foreground leading-relaxed line-clamp-6">{PASSAGE}</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-card rounded-xl border border-border p-6 relative overflow-hidden min-h-[320px]"
      aria-label="Animated reader demonstration"
    >
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted rounded-full mb-5">
        <motion.div
          className="h-1 bg-primary rounded-full"
          animate={{ width: progressWidth }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{ willChange: "transform" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isCelebrate ? (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="text-xs text-muted-foreground mb-3">The Odyssey &middot; Book I</p>

            <p className="font-serif text-sm text-foreground leading-[1.8] line-clamp-8">
              {PASSAGE.split(ANNOTATION_2.trigger).map((outerPart, oi) =>
                oi === 0 ? (
                  <span key={oi}>
                    {outerPart.split(ANNOTATION_1.trigger).map((innerPart, ii) =>
                      ii === 0 ? (
                        <span key={ii}>
                          {innerPart}
                          <HighlightSpan show={showHighlight1} text={ANNOTATION_1.trigger} />
                        </span>
                      ) : (
                        <span key={ii}>{innerPart}</span>
                      )
                    )}
                    <HighlightSpan show={showHighlight2} text={ANNOTATION_2.trigger} />
                  </span>
                ) : (
                  <span key={oi}>{outerPart}</span>
                )
              )}
            </p>

            {/* Annotation cards */}
            <AnimatePresence>
              {showAnnotation1 && (
                <AnnotationCard title={ANNOTATION_1.title} text={ANNOTATION_1.text} />
              )}
              {showAnnotation2 && (
                <AnnotationCard title={ANNOTATION_2.title} text={ANNOTATION_2.text} />
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center justify-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.6, 1], ease: EASE }}
              className="size-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center mb-4"
              style={{ willChange: "transform" }}
            >
              <Check className="size-6 text-primary" />
            </motion.div>
            <p className="font-[var(--font-display)] text-lg font-bold text-foreground">
              Book I Complete
            </p>
            <motion.p
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [1, 1, 0], y: -20 }}
              transition={{ duration: 2, times: [0, 0.6, 1] }}
              className="text-sm text-primary font-semibold mt-2"
              style={{ willChange: "transform, opacity" }}
            >
              +5 Wisdom
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, ease: EASE }}
              className="mt-4 text-sm text-primary border border-primary/30 rounded-full px-5 py-2"
            >
              Continue to Trial &rarr;
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HighlightSpan({ show, text }: { show: boolean; text: string }) {
  return show ? (
    <motion.span
      className="underline decoration-primary underline-offset-4 text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {text}
    </motion.span>
  ) : (
    <span>{text}</span>
  )
}

function AnnotationCard({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="size-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-serif font-bold text-primary">
          V
        </div>
        <span className="text-xs text-primary font-semibold">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
    </motion.div>
  )
}
