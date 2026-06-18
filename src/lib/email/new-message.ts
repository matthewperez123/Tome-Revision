import "server-only"

import { createAdminClient } from "@/lib/actions/_shared"
import { sendEmail } from "@/lib/email/send"
import { NewMessageEmail } from "@/lib/email/templates/new-message"

const COOLDOWN_MINUTES = 5
const EXCERPT_MAX = 240

function excerptOf(body: string): string {
  const clean = body.trim().replace(/\s+/g, " ")
  return clean.length > EXCERPT_MAX
    ? `${clean.slice(0, EXCERPT_MAX - 1)}…`
    : clean
}

/**
 * Email every OTHER participant of a conversation that a new message arrived.
 *
 * Best-effort and never throws — a mail failure must not break the send.
 * Per recipient we:
 *   1. Skip if their notification_preferences.email_on_new_message is false.
 *   2. Ask claim_email_slot to atomically debounce (one email per
 *      conversation per recipient per COOLDOWN_MINUTES).
 *   3. Resolve their address from the auth record (profiles has no email
 *      column) and send.
 *
 * Runs with the service-role client because it reads other users' prefs and
 * addresses, which RLS would otherwise hide.
 */
export async function sendNewMessageEmails(params: {
  conversationId: string
  senderId: string
  body: string
}): Promise<void> {
  const { conversationId, senderId, body } = params
  try {
    const admin = createAdminClient()

    const { data: parts } = await admin
      .from("conversation_participants")
      .select("profile_id")
      .eq("conversation_id", conversationId)
    const recipientIds = (parts ?? [])
      .map((p: { profile_id: string }) => p.profile_id)
      .filter((id: string) => id !== senderId)
    if (recipientIds.length === 0) return

    const [{ data: sender }, { data: conversation }] = await Promise.all([
      admin
        .from("profiles")
        .select("display_name")
        .eq("id", senderId)
        .maybeSingle(),
      admin
        .from("conversations")
        .select("subject")
        .eq("id", conversationId)
        .maybeSingle(),
    ])
    const senderName = sender?.display_name ?? "A classmate"
    const subject = conversation?.subject ?? null
    const excerpt = excerptOf(body)

    const { data: prefs } = await admin
      .from("notification_preferences")
      .select("profile_id, email_on_new_message")
      .in("profile_id", recipientIds)
    const optedOut = new Set(
      (prefs ?? [])
        .filter(
          (p: { email_on_new_message: boolean }) =>
            p.email_on_new_message === false,
        )
        .map((p: { profile_id: string }) => p.profile_id),
    )

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://usetome.app"
    const conversationUrl = `${appUrl}/messages`

    await Promise.all(
      recipientIds.map(async (recipientId: string) => {
        if (optedOut.has(recipientId)) return

        // Atomic debounce — false means we emailed too recently.
        const { data: claimed, error: claimErr } = await admin.rpc(
          "claim_email_slot",
          {
            _conversation_id: conversationId,
            _profile_id: recipientId,
            _cooldown_minutes: COOLDOWN_MINUTES,
          },
        )
        if (claimErr || claimed !== true) return

        const { data: userResult } = await admin.auth.admin.getUserById(
          recipientId,
        )
        const email = userResult?.user?.email
        if (!email) return

        await sendEmail({
          to: email,
          subject: `${senderName} sent you a message`,
          react: NewMessageEmail({
            senderName,
            excerpt,
            subject,
            conversationUrl,
            recipient: email,
          }),
        })
      }),
    )
  } catch (err) {
    console.error("[new-message-email] failed:", (err as Error).message)
  }
}
