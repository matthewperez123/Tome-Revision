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
  ClipboardList,
  Feather,
  SquarePen,
  Brain,
  History,
  Compass,
  Settings,
  CalendarRange,
  type LucideIcon,
} from "lucide-react"
import { RUBRIC } from "@/lib/semester-plan/rubric"
import { PLATFORM_QUIZZES_ENABLED } from "@/lib/quizzes/flags"

/**
 * Sidebar icon palette — one RUBRIC pigment per section so teachers and
 * students can find surfaces by colour at a glance. Flat accents only
 * (iridescence stays reserved for Virgil).
 */
export const NAV_ACCENTS = {
  home: RUBRIC.lapis,
  library: RUBRIC.goldLeaf,
  read: RUBRIC.verdigris,
  discover: RUBRIC.tyrian,
  classroom: RUBRIC.vermilion,
} as const


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
  /** Flat RUBRIC pigment applied to every icon in the group. */
  accent?: string
}

/**
 * Section building blocks. Learning surfaces only — no gamification or social
 * entries. Groups collapse to a bare icon rail (labels auto-hide) so the
 * 64px ↔ 240px peek behaviour is preserved. Section ORDER is role-specific
 * (see teacherOrder / readerStudentOrder) — teachers lead with the classroom,
 * readers and students lead with the library.
 */
const homeGroup: NavGroup = {
  label: "Home",
  accent: NAV_ACCENTS.home,
  items: [
    { label: "Home", href: "/", icon: Home, roles: ["reader", "student"] },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ],
}

const libraryGroup: NavGroup = {
  label: "Library",
  accent: NAV_ACCENTS.library,
  items: [
    { label: "Library", href: "/library/browse", icon: Library },
    { label: "Authors", href: "/authors", icon: Feather },
  ],
}

const readGroup: NavGroup = {
  label: "Read",
  accent: NAV_ACCENTS.read,
  items: [
    // Readers/teachers get their personal reading list; students get the
    // reading their teacher assigned (same page, reading-only filter).
    { label: "Reading", href: "/reading", icon: BookOpen, roles: ["reader", "teacher"] },
    { label: "Reading", href: "/assignments?type=reading", icon: BookOpen, roles: ["student"] },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { label: "Shelves", href: "/shelves", icon: LibraryBig },
  ],
}

const discoverGroup: NavGroup = {
  label: "Discover",
  accent: NAV_ACCENTS.discover,
  items: [
    { label: "Explore", href: "/explore", icon: Globe2 },
    { label: "Timelines", href: "/timelines", icon: History },
  ],
}

const classroomGroup: NavGroup = {
  label: "Classroom",
  accent: NAV_ACCENTS.classroom,
  items: [
    { label: "Classes", href: "/classroom", icon: GraduationCap },
    // Students see teacher-given Assignments + the term Semester schedule in
    // place of the personal practice "Quizzes" surface (kept for readers).
    { label: "Assignments", href: "/assignments", icon: ClipboardList, roles: ["student"] },
    { label: "Semester", href: "/semester", icon: CalendarRange, roles: ["student"] },
    // While platform practice quizzes are paused, only teachers see the
    // Quizzes entry (their saved-quiz library). Restore "reader" when unpaused.
    {
      label: "Quizzes",
      href: "/quizzes",
      icon: Brain,
      roles: PLATFORM_QUIZZES_ENABLED ? ["reader", "teacher"] : ["teacher"],
    },
    { label: "Quiz Builder", href: "/classroom/quiz-builder", icon: SquarePen, roles: ["teacher"] },
    { label: "Grading", href: "/classroom/grading", icon: ClipboardCheck, roles: ["teacher"] },
    { label: "Semester Planning", href: "/semester-plan", icon: CalendarRange, roles: ["teacher"] },
    { label: "Guided Sessions", href: "/teacher/guided-learning", icon: Compass, roles: ["teacher"] },
  ],
}

// Settings stays neutral (inherits foreground) so it reads in light AND dark
// themes — ink would disappear on a dark background.
const settingsGroup: NavGroup = {
  label: "Settings",
  items: [{ label: "Settings", href: "/account", icon: Settings }],
}

/** Teachers lead with the classroom (planning now lives inside it); library sits at the end. */
const teacherOrder: NavGroup[] = [
  homeGroup,
  classroomGroup,
  libraryGroup,
  readGroup,
  discoverGroup,
  settingsGroup,
]

/** Readers and students lead with the library; classroom follows. */
const readerStudentOrder: NavGroup[] = [
  homeGroup,
  libraryGroup,
  readGroup,
  discoverGroup,
  classroomGroup,
  settingsGroup,
]

/**
 * Filter navigation groups (and their items) by user role, dropping any group
 * that ends up empty. Section order is role-specific. Unauthenticated visitors
 * fall back to the reader/student order and see only role-agnostic entries.
 */
export function getNavGroupsForRole(role: UserRole | null): NavGroup[] {
  const allow = (roles?: UserRole[]) => {
    if (!roles) return true
    if (!role) return false
    return roles.includes(role)
  }
  const order = role === "teacher" ? teacherOrder : readerStudentOrder
  return order
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
