"use client"

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"

/**
 * Page-level fade-in. Previously this used <AnimatePresence mode="popLayout">
 * keyed on pathname, which held the previous route's tree in place during
 * exit and made route transitions feel like a hang when the destination had
 * no loading.tsx. We now mount the new tree immediately and fade it in.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className="flex-1">{children}</div>
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="flex-1"
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
