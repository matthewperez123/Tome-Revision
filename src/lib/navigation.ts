import {
  Home,
  LayoutDashboard,
  Library,
  LibraryBig,
  BookOpen,
  Bookmark,
  Globe2,
  GraduationCap,
  CircleUser,
  ClipboardCheck,
  Feather,
  SquarePen,
  Brain,
  History,
  Compass,
  Settings,
  MessageCircle,
  type LucideIcon,
} from "lucide-react"


export type UserRole = "reader" | "teacher" | "student"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** If set, only show for these roles. If omitted, show for all. */
  roles?: UserRole[]
}

export type NavGroup = {
  /** Heading shown above the group; hidden automatically when the rail is collapsed. */
  label?: string
  items: NavItem[]
  /** If set, only show for these roles. If omitted, show for all. */
  roles?: UserRole[]
}

/**
 * Grouped sidebar navigation. Learning surfaces only — no gamification or
 * social entries. Groups collapse to a bare icon rail (labels auto-hide) so the
 * 64px ↔ 240px peek behaviour is preserved.
 */
export const navGroups: NavGroup[] = [
  {
    label: "Home",
    items: [
      { label: "Home", href: "/", icon: Home, roles: ["reader", "student"] },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Read",
    items: [
      { label: "Library", href: "/library/browse", icon: Library },
      { label: "Reading", href: "/reading", icon: BookOpen },
      { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
      { label: "Shelves", href: "/shelves", icon: LibraryBig },
    ],
  },
  {
    label: "Discover",
    items: [
      { label: "Authors", href: "/authors", icon: Feather },
      { label: "Explore", href: "/explore", icon: Globe2 },
      { label: "Timelines", href: "/timelines", icon: History },
    ],
  },
  {
    label: "Practice",
    items: [{ label: "Quizzes", href: "/quizzes", icon: Brain }],
  },
  {
    label: "Classroom",
    items: [
      { label: "My Classes", href: "/classroom", icon: GraduationCap },
      { label: "Messages", href: "/messages", icon: MessageCircle, roles: ["teacher", "student"] },
      { label: "Quiz Builder", href: "/classroom/quiz-builder", icon: SquarePen, roles: ["teacher"] },
      { label: "Grading", href: "/classroom/grading", icon: ClipboardCheck, roles: ["teacher"] },
      { label: "Guided Sessions", href: "/teacher/guided-learning", icon: Compass, roles: ["teacher"] },
    ],
  },
  {
    label: "Settings",
    items: [{ label: "Settings", href: "/account", icon: Settings }],
  },
]

/**
 * Filter navigation groups (and their items) by user role, dropping any group
 * that ends up empty. Unauthenticated visitors see only role-agnostic entries.
 */
export function getNavGroupsForRole(role: UserRole | null): NavGroup[] {
  const allow = (roles?: UserRole[]) => {
    if (!roles) return true
    if (!role) return false
    return roles.includes(role)
  }
  return navGroups
    .filter((g) => allow(g.roles))
    .map((g) => ({ ...g, items: g.items.filter((i) => allow(i.roles)) }))
    .filter((g) => g.items.length > 0)
}

export const dockNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Library", href: "/library/browse", icon: Library },
  { label: "Read", href: "/reading", icon: BookOpen },
  { label: "Classes", href: "/classroom", icon: GraduationCap },
  { label: "Profile", href: "/profile", icon: CircleUser },
]
