/**
 * Single source of truth for the MARKETING navigation + footer (LandingNav,
 * its mobile menu, and LandingFooter) so those links never drift. This is
 * separate from `navigation.ts`, which drives the authenticated app sidebar
 * and dock. Routes stay /readers and /educators; only the labels read
 * "For Students" / "For Teachers" per the site IA.
 */

export interface NavLink {
  label: string
  href: string
}

/** Primary nav (and mobile menu) — kept deliberately short. */
export const PRIMARY_NAV: NavLink[] = [
  { label: "For Students", href: "/readers" },
  { label: "For Teachers", href: "/educators" },
  { label: "Library", href: "/library/browse" },
  { label: "Virgil", href: "/virgil" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
]

export const AUTH_LINKS = {
  signIn: { label: "Sign in", href: "/login" },
  signUp: { label: "Sign up", href: "/signup" },
} as const

/**
 * Where the "Open Tome" front-door CTA sends a LOGGED-OUT visitor. Default is
 * the sign-in page (which itself offers "Create account" → /signup and the
 * student class-code path). Flip this single line to "/signup" if you'd rather
 * the acquisition-first funnel. Logged-in visitors always go to their role home
 * (/dashboard) — that routing is owned by LandingNav, not this constant.
 */
export const OPEN_TOME_LOGGED_OUT_TARGET = "/login"

/**
 * Marketing routes that suppress the Beta superscript on the wordmark so it
 * reads cleanly on hero chrome. Authenticated surfaces keep the indicator.
 */
export const LANDING_PATHS = new Set<string>([
  "/",
  "/readers",
  "/educators",
  "/virgil",
  "/pricing",
  "/faq",
  "/library",
  "/privacy",
  "/terms",
  "/security",
  "/contact",
  "/accessibility",
  "/demo",
])

/**
 * Footer items resolve to one of three kinds so we never render a
 * fake-clickable dead link:
 *  - `href`   → a real route or in-page anchor
 *  - `action: "support"` → opens the Intercom messenger (or mailto fallback)
 *  - neither  → plain label for a surface that doesn't exist yet
 */
export type FooterItem =
  | { label: string; href: string }
  | { label: string; action: "support" }
  | { label: string }

export interface FooterColumn {
  heading: string
  items: FooterItem[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    items: [
      { label: "Library", href: "/library/browse" },
      { label: "Virgil", href: "/virgil" },
      { label: "Trials", href: "/quizzes" },
      { label: "Authors", href: "/authors" },
      { label: "Live Demo", href: "/demo" },
    ],
  },
  {
    heading: "For Teachers",
    items: [
      { label: "Classroom", href: "/educators" },
      { label: "Gradebook", href: "/educators#gradebook" },
      { label: "Curriculum", href: "/educators#curriculum" },
      { label: "Parent Directory", href: "/educators#parent-directory" },
      { label: "Privacy for Schools", href: "/security" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "FAQ", href: "/faq" },
      { label: "Support", action: "support" },
      { label: "Getting Started", href: "/faq#readers" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
]
