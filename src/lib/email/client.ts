import "server-only"

import { Resend } from "resend"

// Use placeholder so static prerender doesn't crash without RESEND_API_KEY.
// Real key required at runtime — sendEmail will surface failures.
const apiKey = process.env.RESEND_API_KEY || "re_placeholder"

export const resend = new Resend(apiKey)

export const FROM =
  process.env.RESEND_FROM_EMAIL || "Tome <noreply@usetome.app>"
