/**
 * Support entry point. The Intercom messenger only loads when an app id is
 * configured (NEXT_PUBLIC_INTERCOM_APP_ID); with no id, "Support" falls back
 * to a plain contact link and nothing is loaded — no errors, no PII.
 */

// Empty string when unset → messenger never boots.
export const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? ""

// [CONFIRM] real support address — placeholder until sign-off.
export const SUPPORT_EMAIL = "support@tome.app"
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`

export function isIntercomConfigured(): boolean {
  return INTERCOM_APP_ID.length > 0
}

interface IntercomWindow extends Window {
  Intercom?: (command: string, ...args: unknown[]) => void
}

/**
 * Open the Intercom messenger if it's loaded; otherwise fall back to a
 * mailto: contact link. Safe to call from any client event handler.
 */
export function openSupport(): void {
  if (typeof window === "undefined") return
  const intercom = (window as IntercomWindow).Intercom
  if (typeof intercom === "function") {
    intercom("show")
    return
  }
  window.location.href = SUPPORT_MAILTO
}
