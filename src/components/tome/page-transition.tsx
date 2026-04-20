"use client"

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className="flex-1">{children}</div>
  }

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex-1"
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}
