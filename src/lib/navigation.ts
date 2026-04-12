import {
  Home,
  LayoutDashboard,
  Library,
  BookOpen,
  Brain,
  Trophy,
  Users,
  Users2,
  Globe2,
  GraduationCap,
  ShoppingBag,
  User,
  Bookmark,
  BookMarked,
  ClipboardCheck,
  Feather,
  History,
  type LucideIcon,
} from "lucide-react"


export type UserRole = "reader" | "teacher"

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
  { label: "Library", href: "/library", icon: Library },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "My Shelves", href: "/shelves", icon: BookMarked },
  { label: "Authors", href: "/authors", icon: Users2 },
  { label: "Reading", href: "/reading", icon: BookOpen },
  { label: "Quizzes", href: "/quizzes", icon: Brain },

  // Teacher-only classroom tools
  { label: "My Classrooms", href: "/classroom", icon: GraduationCap, roles: ["teacher"], section: "teaching" },
  { label: "Quiz Builder", href: "/classroom/quiz-builder", icon: Feather, roles: ["teacher"], section: "teaching" },
  { label: "Grading", href: "/classroom/grading", icon: ClipboardCheck, roles: ["teacher"], section: "teaching" },

  // Student classroom access (only if they have joined classrooms)
  { label: "My Classes", href: "/classroom", icon: GraduationCap, roles: ["reader"] },

  // Discovery & social — all roles
  { label: "Explore", href: "/explore", icon: Globe2 },
  { label: "Timelines", href: "/timelines", icon: History },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Friends", href: "/friends", icon: Users },
  { label: "Community", href: "/social", icon: Users2 },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
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
  { label: "Library", href: "/library", icon: Library },
  { label: "Read", href: "/reading", icon: BookOpen },
  { label: "Quiz", href: "/quizzes", icon: Brain },
  { label: "Profile", href: "/profile", icon: User },
]
