"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, BookOpen, Backpack, ChevronUp, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import { getCurrentAvatar } from "@/lib/avatar-state"
import { CHARACTER_MAP, type BookCharacter } from "@/data/character-avatars"
import { useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"

interface RoleMeta {
  label: string
  subtitle: string
  icon: typeof BookOpen
  accentColor: string
}

// Account type is permanent — set once during onboarding, never switchable here.
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

export function ProfileSwitcher() {
  const { role, profile, signOut } = useAuth()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const [isOpen, setIsOpen] = React.useState(false)
  const [character, setCharacter] = React.useState<BookCharacter | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const [popupPos, setPopupPos] = React.useState<{ left: number; bottom: number } | null>(null)

  React.useEffect(() => {
    setCharacter(getCurrentAvatar())
  }, [])

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

  const displayCharacter = character ?? CHARACTER_MAP["virgil"]
  const currentRole = ROLE_META[role ?? "reader"]
  const displayName = profile?.display_name ?? "Matthew"

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
              <p className="text-[10px] text-muted-foreground">{currentRole.label} account</p>
            </div>
          </div>

          {/* Divider + links */}
          <div className="border-t p-1.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              View Profile
            </Link>
            <Link
              href="/profile/avatar"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              Change Avatar
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
        <UserAvatar
          character={displayCharacter}
          size="sm"
          showRarityRing={true}
        />
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
