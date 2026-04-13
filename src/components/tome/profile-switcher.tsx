"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, BookOpen, ChevronUp, Check, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import { getCurrentAvatar } from "@/lib/avatar-state"
import { CHARACTER_MAP, type BookCharacter } from "@/data/character-avatars"
import { saveOnboardingData, getOnboardingData } from "@/lib/onboarding"
import { useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"

interface ProfileOption {
  role: "reader" | "teacher"
  label: string
  subtitle: string
  icon: typeof BookOpen
  accentColor: string
}

const PROFILES: ProfileOption[] = [
  {
    role: "teacher",
    label: "Teacher",
    subtitle: "Classroom management",
    icon: GraduationCap,
    accentColor: "#D4A04C",
  },
  {
    role: "reader",
    label: "Reader",
    subtitle: "Personal reading",
    icon: BookOpen,
    accentColor: "#6366F1",
  },
]

export function ProfileSwitcher() {
  const router = useRouter()
  const { role, profile } = useAuth()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const [isOpen, setIsOpen] = React.useState(false)
  const [character, setCharacter] = React.useState<BookCharacter | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setCharacter(getCurrentAvatar())
  }, [])

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  const displayCharacter = character ?? CHARACTER_MAP["virgil"]
  const currentProfile = PROFILES.find((p) => p.role === role) ?? PROFILES[1]
  const displayName = profile?.display_name ?? "Matthew"

  function switchRole(newRole: "reader" | "teacher") {
    if (newRole === role) {
      setIsOpen(false)
      return
    }

    // Update localStorage onboarding data
    saveOnboardingData({ userType: newRole })
    setIsOpen(false)

    // Navigate to dashboard and reload to pick up the new role
    window.location.href = "/dashboard"
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Expanded profile options (opens upward) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border bg-card shadow-xl z-50 overflow-hidden"
          >
            {/* Profile options */}
            <div className="p-1.5">
              {PROFILES.map((p) => {
                const isActive = p.role === role
                const Icon = p.icon
                return (
                  <button
                    key={p.role}
                    onClick={() => switchRole(p.role)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className="flex size-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${p.accentColor}15` }}
                    >
                      <Icon className="size-4" style={{ color: p.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.label}</p>
                      <p className="text-[10px] text-muted-foreground">{p.subtitle}</p>
                    </div>
                    {isActive && (
                      <Check className="size-4 text-green-500 shrink-0" />
                    )}
                  </button>
                )
              })}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current profile button */}
      <button
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
                <currentProfile.icon className="size-2.5" />
                {currentProfile.label}
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
