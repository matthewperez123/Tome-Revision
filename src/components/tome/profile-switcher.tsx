"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, BookOpen, Backpack, ChevronUp, LogOut, Eye, RotateCcw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"

interface RoleMeta {
  label: string
  subtitle: string
  icon: typeof BookOpen
  accentColor: string
}

// Account type is permanent — set at onboarding. The "View as" section below
// is a UI-only preview lens for demo/testing; it never changes the account.
const ROLE_META: Record<"reader" | "teacher" | "student", RoleMeta> = {
  teacher: {
    label: "Teacher",
    subtitle: "Classroom management",
    icon: GraduationCap,
    accentColor: "#D4A04C",
  },
  student: {
    label: "Student",
    subtitle: "Enrolled in a class",
    icon: Backpack,
    accentColor: "#2A4B8D",
  },
  reader: {
    label: "Reader",
    subtitle: "Personal reading",
    icon: BookOpen,
    accentColor: "#6366F1",
  },
}

/** Width of the portal popup */
const POPUP_WIDTH = 240

// Reader preview is paused for now — only teacher/student are offered.
const PREVIEW_ROLES = ["teacher", "student"] as const

export function ProfileSwitcher() {
  const { role, profile, signOut, isLoading, isAuthenticated, rolePreview, setRolePreview } = useAuth()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const [popupPos, setPopupPos] = React.useState<{ left: number; bottom: number } | null>(null)

  // Position the portal popup above the button
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPopupPos({
        left: rect.left,
        bottom: window.innerHeight - rect.top + 8, // 8px gap above button
      })
    }
  }, [isOpen])

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        popupRef.current && !popupRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  // Close on Escape
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    if (isOpen) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen])

  const currentRole = ROLE_META[role ?? "reader"]
  const displayName = profile?.display_name ?? "Reader"
  const initial = displayName.trim().charAt(0).toUpperCase() || "R"

  // Render popup via portal so it escapes sidebar overflow constraints
  const popupContent = (
    <AnimatePresence>
      {isOpen && popupPos && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed rounded-xl border bg-card shadow-xl z-[100] overflow-hidden"
          style={{
            left: popupPos.left,
            bottom: popupPos.bottom,
            width: POPUP_WIDTH,
          }}
        >
          {/* Account identity (read-only — role is fixed at onboarding) */}
          <div className="flex items-center gap-3 p-3">
            <div
              className="flex size-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${currentRole.accentColor}15` }}
            >
              <currentRole.icon className="size-4" style={{ color: currentRole.accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground">
                {rolePreview
                  ? `Previewing as ${currentRole.label}`
                  : `${currentRole.label} account`}
              </p>
            </div>
          </div>

          {/* View as — demo/testing lens. UI-only: the session, DB profile, and
              every server-side check keep the real identity. Reader is paused. */}
          {isAuthenticated && (
            <div className="border-t p-1.5">
              <p className="px-3 pt-1 pb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                View as
              </p>
              {PREVIEW_ROLES.map((r) => {
                const meta = ROLE_META[r]
                const active = (rolePreview ?? profile?.role) === r
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setIsOpen(false)
                      setRolePreview(r)
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <meta.icon className="size-3.5" style={{ color: meta.accentColor }} />
                    <span className="flex-1 text-left">{meta.label}</span>
                    {active && <Eye className="size-3 text-muted-foreground" />}
                  </button>
                )
              })}
              {rolePreview && (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setRolePreview(null)
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  Reset to my account
                </button>
              )}
            </div>
          )}

          {/* Divider + links */}
          <div className="border-t p-1.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              View Profile
            </Link>
            <button
              onClick={() => {
                setIsOpen(false)
                void signOut()
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Until auth resolves, render a neutral placeholder rather than defaulting to
  // the "Reader" role — showing a guessed role that then flips to the real one
  // is exactly the perceived role "switching" this avoids.
  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className={`flex w-full items-center gap-2 rounded-md p-1.5 ${collapsed ? "justify-center" : ""}`}
      >
        <span className="size-8 shrink-0 rounded-full bg-muted/60" />
        {!collapsed && (
          <div className="flex-1 space-y-1">
            <span className="block h-3 w-20 rounded bg-muted/60" />
            <span className="block h-2.5 w-12 rounded bg-muted/40" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Portal the popup to document.body so it escapes sidebar clipping */}
      {typeof document !== "undefined" && createPortal(popupContent, document.body)}

      {/* Current account button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-2 rounded-md p-1.5 hover:bg-accent/50 transition-colors ${collapsed ? "justify-center" : ""}`}
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: currentRole.accentColor }}
          aria-hidden="true"
        >
          {initial}
        </span>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium truncate leading-tight">{displayName}</p>
              <p className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
                <currentRole.icon className="size-2.5" />
                {currentRole.label}
              </p>
            </div>
            <ChevronUp
              className={`size-3.5 text-muted-foreground transition-transform ${isOpen ? "" : "rotate-180"}`}
            />
          </>
        )}
      </button>
    </div>
  )
}
