"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getNavForRole } from "@/lib/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { ProfileSwitcher } from "@/components/tome/profile-switcher"
import { AnimatedIconWrapper } from "@/components/sidebar/animations/AnimatedIconWrapper"
import { studentIconRegistry } from "@/components/sidebar/animations/student/registry"
import { teacherIconRegistry } from "@/components/sidebar/animations/teacher/registry"
import { useFriendsData } from "@/hooks/use-friends-data"

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
      <SidebarContent className="pt-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNav pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-1.5 py-2 border-t border-border">
        <ProfileSwitcher />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarNav({ pathname }: { pathname: string }) {
  const { setOpen, setOpenMobile } = useSidebar()
  const { role } = useAuth()
  const listRef = React.useRef<HTMLUListElement>(null)

  const navItems = React.useMemo(() => getNavForRole(role), [role])

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
    if (pathname.startsWith("/book/"))    return "/library"
    if (pathname.startsWith("/author/") && !pathname.startsWith("/authors")) return "/authors"
    if (pathname.startsWith("/profile"))  return "/profile"
    if (pathname.startsWith("/clubs/"))   return "/clubs"
    if (pathname.startsWith("/study-groups/")) return "/study-groups"
    if (pathname.startsWith("/quiz/"))    return "/quizzes"
    if (pathname.startsWith("/read/"))    return "/reading"
    // Teacher sub-routes: keep their exact prefixes so they don't
    // also highlight the parent "/classroom" item
    if (pathname.startsWith("/teacher/parents"))          return "/teacher/parents"
    if (pathname.startsWith("/teacher/students"))        return "/classroom"
    if (pathname.startsWith("/classroom/quiz-builder")) return "/classroom/quiz-builder"
    if (pathname.startsWith("/classroom/grading"))      return "/classroom/grading"
    if (pathname.startsWith("/classroom/create"))       return "/classroom"
    if (pathname.startsWith("/classroom/"))             return "/classroom"
    return pathname
  })()

  // Pending friend-request count powers the gold badge on the Friends entry.
  const { requests } = useFriendsData()
  const pendingFriendRequests = requests.length

  return (
    <SidebarMenu ref={listRef}>
      {navItems.map((item, index) => {
        // Exact match for the home route
        // For other routes, match activeHref exactly to prevent
        // multiple items highlighting (e.g. /classroom and /classroom/quiz-builder)
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : activeHref === item.href

        const registry = role === "reader" ? studentIconRegistry : role === "teacher" ? teacherIconRegistry : undefined
        const AnimatedIcon = registry?.[item.label]

        return (
          <SidebarMenuItem key={`${item.label}-${item.href}`}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.label}
              render={<Link href={item.href} onClick={() => { setOpen(false); setOpenMobile(false) }} />}
            >
              {AnimatedIcon ? (
                <AnimatedIconWrapper isActive={isActive} index={index}>
                  {(hovered) => (
                    <AnimatedIcon
                      isHovered={hovered}
                      isActive={isActive}
                      className="size-4"
                    />
                  )}
                </AnimatedIconWrapper>
              ) : (
                /* Fallback (lucide-react) icon — kept deliberate even when the
                 * animated registry has no entry for an item. 1.75px stroke
                 * reads scholarly rather than utilitarian; parchment-70%
                 * inactive lifts to 100% on hover, and the SidebarMenuButton's
                 * data-[active=true] state already swaps to the gold accent. */
                <item.icon
                  className="size-4 transition-opacity opacity-70 group-hover/menu-button:opacity-100 group-data-active/menu-button:opacity-100"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              )}
              <span>{item.label}</span>
              {item.label === "Friends" && pendingFriendRequests > 0 && (
                <span
                  aria-label={`${pendingFriendRequests} pending friend ${pendingFriendRequests === 1 ? "request" : "requests"}`}
                  className="ml-auto flex size-4 items-center justify-center rounded-full bg-[#D4A04C] text-[9px] font-bold text-[#1a1a2e]"
                >
                  {pendingFriendRequests > 9 ? "9+" : pendingFriendRequests}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
