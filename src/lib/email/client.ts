import "server-only"

import { Resend } from "resend"

const PLACEHOLDER_KEY = "re_placeholder"

// Use placeholder so static prerender doesn't crash without RESEND_API_KEY.
// Real key required at runtime — sendEmail short-circuits when it's absent.
const apiKey = process.env.RESEND_API_KEY || PLACEHOLDER_KEY

export const resend = new Resend(apiKey)

/**
 * True only when a real Resend key is present. When false, the SDK is holding
 * the placeholder and any send would make a doomed network call, so sendEmail
 * degrades gracefully instead of logging a spurious error on every attempt.
 */
export function isEmailConfigured(): boolean {
  return apiKey !== PLACEHOLDER_KEY
}

export const FROM =
  process.env.RESEND_FROM_EMAIL || "Tome <noreply@usetome.app>"
