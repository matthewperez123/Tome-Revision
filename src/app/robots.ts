import type { MetadataRoute } from "next"

const ORIGIN = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

// Index the marketing surface and public catalog (/, /readers, /educators,
// /virgil, /pricing, /faq, /library, /book/*, /author/*, /authors, /quizzes,
// and the legal pages). Disallow the authenticated app, account, auth flows,
// and API so private/dynamic surfaces stay out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/account",
        "/admin",
        "/dev",
        "/assignments",
        "/classroom",
        "/profile",
        "/bookmarks",
        "/shelves",
        "/join",
        "/read",
        "/reading",
        "/quiz/",
        "/teacher",
        "/explore",
        "/timelines",
        "/auth/",
        "/login",
        "/signup",
        "/onboarding",
        "/goodbye",
        "/learn",
        "/hamlet-preview",
        "/work-preview",
      ],
    },
    sitemap: `${ORIGIN}/sitemap.xml`,
    host: ORIGIN,
  }
}
