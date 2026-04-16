/**
 * Guided session notification utilities.
 *
 * Handles in-app notifications, Browser Notification API,
 * and email stubs for guided session events.
 */

import { createNotification } from "@/lib/notifications"

// ── In-App Notifications ──────────────────────────────────────────────────────

export function notifySessionInvite(sessionTitle: string, teacherName: string) {
  createNotification({
    type: "weekly_recap" as any, // closest generic type available
    title: "Guided Session Invite",
    body: `${teacherName} invited you to "${sessionTitle}"`,
    priority: "high",
  })
}

export function notifySessionStartingSoon(sessionTitle: string, minutesUntil: number) {
  createNotification({
    type: "weekly_recap" as any,
    title: "Session Starting Soon",
    body: `"${sessionTitle}" starts in ${minutesUntil} minute${minutesUntil !== 1 ? "s" : ""}`,
    priority: "high",
  })
}

export function notifySessionStarted(sessionTitle: string) {
  createNotification({
    type: "weekly_recap" as any,
    title: "Session Started",
    body: `"${sessionTitle}" is now active`,
    priority: "high",
  })
}

export function notifySessionCompleted(sessionTitle: string) {
  createNotification({
    type: "weekly_recap" as any,
    title: "Session Complete",
    body: `"${sessionTitle}" has ended`,
    priority: "normal",
  })
}

// ── Browser Notification API ──────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false
  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false

  const result = await Notification.requestPermission()
  return result === "granted"
}

export function sendBrowserNotification(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return

  try {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: "guided-session", // Replaces previous notification
    })
  } catch {
    // Service worker may be required on some platforms — silently fail
  }
}

export function notifyBrowserSessionStart(sessionTitle: string) {
  sendBrowserNotification(
    "Guided Session Starting",
    `"${sessionTitle}" is about to begin. Head to your session now.`,
  )
}

export function notifyBrowserFiveMinWarning(sessionTitle: string) {
  sendBrowserNotification(
    "5 Minutes Remaining",
    `"${sessionTitle}" ends in 5 minutes.`,
  )
}

// ── Email (Resend) — Stubs ────────────────────────────────────────────────────
// Resend is not yet integrated in the stack. These are placeholder functions
// that will be wired up when the email service is added.

export async function sendSessionInviteEmail(
  _studentEmail: string,
  _sessionTitle: string,
  _teacherName: string,
  _scheduledAt: string,
): Promise<void> {
  // TODO: Implement with Resend when available
  console.log("[guided-notifications] Email stub: session invite")
}

export async function sendSessionReminderEmail(
  _studentEmail: string,
  _sessionTitle: string,
  _minutesUntil: number,
): Promise<void> {
  // TODO: Implement with Resend when available
  console.log("[guided-notifications] Email stub: session reminder")
}

export async function sendSessionCancelledEmail(
  _studentEmail: string,
  _sessionTitle: string,
): Promise<void> {
  // TODO: Implement with Resend when available
  console.log("[guided-notifications] Email stub: session cancelled")
}
