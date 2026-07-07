"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getNavGroupsForRole } from "@/lib/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { ProfileSwitcher } from "@/components/tome/profile-switcher"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  // Layering fix: shadcn's container ships `z-20`, which sits BELOW every
  // drawer in the app (Virgil, annotation, bookmark all at z-30/40). When
  // collapsed we keep the sidebar above drawers; when expanded we push it
  // above the drawer layer entirely so the panel can never be visually
  // clipped by a drawer that opened underneath it.
  const zClass = collapsed ? "!z-50" : "!z-[60]"

  return (
    <Sidebar collapsible="icon" overlayExpand className={`border-r-0 !top-12 !h-[calc(100svh-3rem)] [&_[data-sidebar=sidebar]]:bg-background ${zClass}`}>
      <SidebarNav pathname={pathname} />
      <SidebarFooter className="px-1.5 py-2 border-t border-border">
        <ProfileSwitcher />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarNav({ pathname }: { pathname: string }) {
  const { setOpen, setOpenMobile } = useSidebar()
  const { role, isLoading } = useAuth()
  const listRef = React.useRef<HTMLDivElement>(null)

  const navGroups = React.useMemo(() => getNavGroupsForRole(role), [role])

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!listRef.current) return
      const items = Array.from(
        listRef.current.querySelectorAll<HTMLElement>("[data-slot='sidebar-menu-button']")
      )
      const current = items.findIndex((el) => el === document.activeElement)
      if (current === -1 && (e.key === "j" || e.key === "k")) {
        items[0]?.focus()
        e.preventDefault()
        return
      }
      if (e.key === "j" && current < items.length - 1) {
        items[current + 1]?.focus()
        e.preventDefault()
      } else if (e.key === "k" && current > 0) {
        items[current - 1]?.focus()
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Map sub-routes to their parent nav item for active highlighting.
  // Teacher-specific classroom sub-routes get their own active states
  // to avoid multiple items highlighting at once.
  const activeHref = (() => {
    if (pathname.startsWith("/book/"))    return "/library/browse"
    if (pathname.startsWith("/library"))  return "/library/browse"
    if (pathname.startsWith("/read/"))    return "/reading"
    if (pathname.startsWith("/reading"))  return "/reading"
    if (pathname.startsWith("/bookmarks")) return "/bookmarks"
    if (pathname.startsWith("/shelves"))  return "/shelves"
    if (pathname.startsWith("/author"))   return "/authors"
    if (pathname.startsWith("/explore"))  return "/explore"
    if (pathname.startsWith("/timelines")) return "/timelines"
    if (pathname.startsWith("/quiz"))     return "/quizzes"
    if (pathname.startsWith("/semester-plan")) return "/semester-plan"
    if (pathname.startsWith("/dashboard")) return "/dashboard"
    if (pathname.startsWith("/account"))  return "/account"
    if (pathname.startsWith("/teacher/guided-learning")) return "/teacher/guided-learning"
    // Teacher sub-routes: keep their exact prefixes so they don't
    // also highlight the parent "/classroom" item
    if (pathname.startsWith("/classroom/quiz-builder")) return "/classroom/quiz-builder"
    if (pathname.startsWith("/classroom/grading"))      return "/classroom/grading"
    if (pathname.startsWith("/classroom"))              return "/classroom"
    return pathname
  })()

  // Until auth resolves we don't know the role, so we render a fixed-shape
  // skeleton instead of the role-agnostic subset. Rendering the partial nav
  // first and then adding role-specific items was the visible "profile type
  // switching" — this replaces that role flip with a clean loading reveal.
  if (isLoading) {
    return <SidebarNavSkeleton />
  }

  return (
    <SidebarContent ref={listRef} className="gap-1 px-1.5 pt-2">
      {navGroups.map((group) => (
        <SidebarGroup key={group.label ?? group.items[0]?.href} className="px-1 py-1">
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : activeHref === item.href

                return (
                  <SidebarMenuItem key={`${item.label}-${item.href}`}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} onClick={() => { setOpen(false); setOpenMobile(false) }} />}
                    >
                      {/* Minimalist Lucide line icon — no animations, no entrance,
                       * no hover scale. 1.5 stroke reads scholarly. */}
                      <item.icon
                        className="size-4 transition-colors duration-200"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  )
}

// Deterministic loading placeholder (fixed widths — no Math.random, so it is
// hydration-safe). Mirrors the grouped nav shape so the real nav reveals in
// place without a layout jump or a role-dependent reflow.
const SKELETON_GROUPS = [2, 4, 3, 1, 1]

function SidebarNavSkeleton() {
  return (
    <SidebarContent className="gap-1 px-1.5 pt-2" aria-hidden="true">
      {SKELETON_GROUPS.map((rows, gi) => (
        <div key={gi} className="px-1 py-1">
          <div className="mx-1 mb-1 h-3 w-16 rounded bg-muted/60" />
          <div className="flex flex-col gap-0.5">
            {Array.from({ length: rows }).map((_, ri) => (
              <div key={ri} className="flex h-8 items-center gap-2 rounded-md px-2">
                <div className="size-4 shrink-0 rounded bg-muted/60" />
                <div className="h-3 flex-1 rounded bg-muted/40" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </SidebarContent>
  )
}
