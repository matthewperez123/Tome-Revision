import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/actions/_shared"
import { sendEmail } from "@/lib/email/send"
import { DemoRequestNotifyEmail } from "@/lib/email/templates/demo-request-notify"
import { DemoRequestConfirmEmail } from "@/lib/email/templates/demo-request-confirm"
import { SUPPORT_EMAIL } from "@/lib/support"

/**
 * POST /api/demo-request
 *
 * Public B2B lead capture for the /demo page. Inserts the lead into
 * `demo_requests` (service-role only — RLS denies everyone else), notifies the
 * sales inbox, and confirms back to the requester. Protected by a hidden
 * honeypot field and a per-IP rate limit.
 */

// Where internal lead alerts are delivered. Falls back to support.
const SALES_INBOX = process.env.DEMO_REQUESTS_INBOX || SUPPORT_EMAIL
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://usetome.app"

// Rate limit: at most this many submissions per IP within the window.
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

const BodySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  email: z.string().trim().email("A valid email is required.").max(320),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  planInterest: z.string().trim().max(60).optional().or(z.literal("")),
  studentCount: z.number().int().min(0).max(1_000_000).optional().nullable(),
  teacherCount: z.number().int().min(0).max(1_000_000).optional().nullable(),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  // Honeypot — real users never see or fill this. Bots do.
  company_website: z.string().optional(),
})

function clientIp(request: Request): string | null {
  const fwd = request.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return request.headers.get("x-real-ip")
}

function emptyToNull(value?: string | null): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const data = parsed.data

  // Honeypot tripped → pretend success, persist nothing.
  if (data.company_website && data.company_website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  const admin = createAdminClient()
  const ip = clientIp(request)
  const userAgent = request.headers.get("user-agent")

  // Per-IP rate limit (best-effort; skipped when IP is unknown).
  if (ip) {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
    const { count } = await admin
      .from("demo_requests")
      .select("*", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since)
    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 },
      )
    }
  }

  const { error: insertErr } = await admin.from("demo_requests").insert({
    name: data.name,
    email: data.email,
    organization: emptyToNull(data.organization),
    role: emptyToNull(data.role),
    plan_interest: emptyToNull(data.planInterest),
    student_count: data.studentCount ?? null,
    teacher_count: data.teacherCount ?? null,
    message: emptyToNull(data.message),
    ip,
    user_agent: userAgent,
  })
  if (insertErr) {
    console.error("[demo-request] insert failed:", insertErr.message)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
  const firstName = data.name.split(" ")[0] ?? data.name

  // Fire both emails; failures are logged, not surfaced — the lead is saved.
  await Promise.allSettled([
    sendEmail({
      to: SALES_INBOX,
      subject: `New demo request — ${data.name}${
        emptyToNull(data.organization) ? ` (${data.organization})` : ""
      }`,
      react: DemoRequestNotifyEmail({
        recipient: SALES_INBOX,
        name: data.name,
        email: data.email,
        organization: emptyToNull(data.organization),
        role: emptyToNull(data.role),
        planInterest: emptyToNull(data.planInterest),
        studentCount: data.studentCount ?? null,
        teacherCount: data.teacherCount ?? null,
        message: emptyToNull(data.message),
        submittedAt,
      }),
    }),
    sendEmail({
      to: data.email,
      subject: "We received your Tome demo request",
      react: DemoRequestConfirmEmail({
        firstName,
        appUrl: APP_URL,
        recipient: data.email,
      }),
    }),
  ])

  return NextResponse.json({ ok: true })
}
