import {
  Home,
  LayoutDashboard,
  Library,
  BookOpen,
  Brain,
  PenTool,
  Globe2,
  GraduationCap,
  CircleUser,
  Bookmark,
  BookMarked,
  Bell,
  ClipboardCheck,
  Feather,
  History,
  Compass,
  type LucideIcon,
} from "lucide-react"


export type UserRole = "reader" | "teacher" | "student"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** If set, only show for these roles. If omitted, show for all. */
  roles?: UserRole[]
  /** If true, only show in a "teaching" section separator */
  section?: "teaching" | "reading" | "social"
}

export const sidebarNav: NavItem[] = [
  // Core — all roles
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // The bare /library route is now the public marketing/preview page.
  // The authenticated catalog lives at /library/browse.
  { label: "Library", href: "/library/browse", icon: Library },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "My Shelves", href: "/shelves", icon: BookMarked },
  { label: "Authors", href: "/authors", icon: PenTool },
  { label: "Reading", href: "/reading", icon: BookOpen },
  { label: "Quizzes", href: "/quizzes", icon: Brain },

  // Teacher-only classroom tools
  { label: "My Classrooms", href: "/classroom", icon: GraduationCap, roles: ["teacher"], section: "teaching" },
  { label: "Quiz Builder", href: "/classroom/quiz-builder", icon: Feather, roles: ["teacher"], section: "teaching" },
  { label: "Grading", href: "/classroom/grading", icon: ClipboardCheck, roles: ["teacher"], section: "teaching" },
  { label: "Guided Sessions", href: "/teacher/guided-learning", icon: Compass, roles: ["teacher"], section: "teaching" },

  // Classroom access — students and readers who have joined classes
  { label: "My Classes", href: "/classroom", icon: GraduationCap, roles: ["reader", "student"] },

  // Discovery — all roles
  { label: "Explore", href: "/explore", icon: Globe2 },
  { label: "Timelines", href: "/timelines", icon: History },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: CircleUser },
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
  { label: "Quiz", href: "/quizzes", icon: Brain },
  { label: "Profile", href: "/profile", icon: CircleUser },
]
