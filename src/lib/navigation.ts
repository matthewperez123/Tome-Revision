import {
  Home,
  LayoutDashboard,
  Library,
  BookOpen,
  Globe2,
  GraduationCap,
  CircleUser,
  ClipboardCheck,
  Feather,
  History,
  Compass,
  Settings,
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

export const sidebarNav: NavItem[] = [
  // Teacher landing — first for teachers (who don't see Home)
  { label: "Classes", href: "/classroom", icon: GraduationCap, roles: ["teacher"] },

  // Core — readers & students
  { label: "Home", href: "/", icon: Home, roles: ["reader", "student"] },

  // The bare /library route is now the public marketing/preview page.
  // The authenticated catalog lives at /library/browse.
  { label: "Library", href: "/library/browse", icon: Library },

  // Classroom access — students and readers who have joined classes
  { label: "My Classes", href: "/classroom", icon: GraduationCap, roles: ["reader", "student"] },
  { label: "My Progress", href: "/dashboard", icon: LayoutDashboard, roles: ["reader", "student"] },

  // Teacher-only classroom tools
  { label: "Quiz Builder", href: "/classroom/quiz-builder", icon: Feather, roles: ["teacher"] },
  { label: "Grading", href: "/classroom/grading", icon: ClipboardCheck, roles: ["teacher"] },
  { label: "Guided Sessions", href: "/teacher/guided-learning", icon: Compass, roles: ["teacher"] },

  // Discovery — readers & students
  { label: "Explore", href: "/explore", icon: Globe2, roles: ["reader", "student"] },
  { label: "Timelines", href: "/timelines", icon: History, roles: ["reader", "student"] },

  // Settings — all roles
  { label: "Settings", href: "/account", icon: Settings },
]

/**
 * Filter navigation items by user role.
 */
export function getNavForRole(role: UserRole | null): NavItem[] {
  if (!role) {
    // Unauthenticated — show items without role restrictions
    return sidebarNav.filter((item) => !item.roles)
  }
  return sidebarNav.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(role)
  })
}

export const dockNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Library", href: "/library/browse", icon: Library },
  { label: "Read", href: "/reading", icon: BookOpen },
  { label: "Classes", href: "/classroom", icon: GraduationCap },
  { label: "Profile", href: "/profile", icon: CircleUser },
]
