import "server-only"

import { createAdminClient } from "@/lib/actions/_shared"
import { sendEmail, type SendEmailResult } from "@/lib/email/send"
import { ClassroomInviteEmail } from "@/lib/email/templates/classroom-invite"
import { ClassroomJoinInviteEmail } from "@/lib/email/templates/classroom-join-invite"

const ROLE_LABELS: Record<string, string> = {
  co_teacher: "co-teacher",
  ta: "teaching assistant",
  student: "student",
}

/**
 * Email a newly-invited member that they were added to a classroom.
 *
 * Best-effort and never throws. Skips silently if the invitee has opted out
 * (notification_preferences.email_on_classroom_invite = false) or has no
 * resolvable email. Runs with the service-role client to read the invitee's
 * pref and address across the RLS boundary.
 */
export async function sendClassroomInviteEmail(params: {
  inviteeId: string
  classroomId: string
  classroomName: string
  inviterName: string
  role: string
}): Promise<void> {
  const { inviteeId, classroomId, classroomName, inviterName, role } = params
  try {
    const admin = createAdminClient()

    const { data: pref } = await admin
      .from("notification_preferences")
      .select("email_on_classroom_invite")
      .eq("profile_id", inviteeId)
      .maybeSingle()
    if (pref && pref.email_on_classroom_invite === false) return

    const { data: userResult } = await admin.auth.admin.getUserById(inviteeId)
    const email = userResult?.user?.email
    if (!email) return

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://usetome.app"

    await sendEmail({
      to: email,
      subject: `You've been added to ${classroomName}`,
      react: ClassroomInviteEmail({
        classroomName,
        inviterName,
        roleLabel: ROLE_LABELS[role] ?? "member",
        classroomUrl: `${appUrl}/classroom/${classroomId}`,
        recipient: email,
      }),
    })
  } catch (err) {
    console.error("[classroom-invite-email] failed:", (err as Error).message)
  }
}

/**
 * Email a self-serve invite to JOIN a classroom via /join?code=. Sent to a raw
 * address (no account required) — the recipient enrolls themselves through the
 * link, so no membership row or student PII is created by sending this.
 * Returns the send result so the caller can count successful sends.
 */
export async function sendClassroomJoinInvite(params: {
  toEmail: string
  classroomName: string
  inviterName: string
  roleLabel: string
  joinCode: string
  joinUrl: string
}): Promise<SendEmailResult> {
  const { toEmail, classroomName, inviterName, roleLabel, joinCode, joinUrl } =
    params
  try {
    return await sendEmail({
      to: toEmail,
      subject: `${inviterName} invited you to join ${classroomName}`,
      react: ClassroomJoinInviteEmail({
        classroomName,
        inviterName,
        roleLabel,
        joinCode,
        joinUrl,
        recipient: toEmail,
      }),
    })
  } catch (err) {
    const message = (err as Error).message
    console.error("[classroom-join-invite] failed:", message)
    return { ok: false, error: message }
  }
}
