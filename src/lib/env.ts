/**
 * Environment variable validation.
 *
 * Validates required env vars at module-load time. In production a missing
 * required var throws (Vercel logs surface the error). In development we
 * log a warning so static prerender / local dev can continue with placeholders.
 *
 * Server-only vars (no NEXT_PUBLIC_ prefix) are intentionally not exported
 * from a client-importable shape — read them via process.env on the server.
 */

import { z } from "zod"

const isProduction = process.env.NODE_ENV === "production"

const envSchema = z.object({
  // Public — bundled into client. Required for Supabase calls.
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("https://usetome.app"),

  // Server-only — used by service-role client and Resend.
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z
    .string()
    .min(1)
    .default("Tome <noreply@usetome.app>"),
  SUPABASE_AUTH_HOOK_SECRET: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env)

  if (parsed.success) return parsed.data

  const missing = parsed.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n")

  if (isProduction) {
    // Hard fail in prod so misconfiguration is loud.
    throw new Error(
      `[env] Missing or invalid environment variables:\n${missing}\n` +
        `Set these in your Vercel project settings.`,
    )
  }

  // Dev: warn but let the app boot with whatever was provided so static
  // prerender + local exploration without Supabase/Resend keys keep working.
  console.warn(
    `[env] Some environment variables are missing or invalid:\n${missing}\n` +
      `The app will boot but auth/email features will fail at runtime.`,
  )

  return process.env as unknown as Env
}

export const env = loadEnv()
