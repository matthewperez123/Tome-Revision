import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface ClassroomJoinInviteEmailProps {
  classroomName: string
  inviterName: string
  /** Human-readable role label, e.g. "student" or "co-teacher". */
  roleLabel: string
  joinCode: string
  joinUrl: string
  recipient: string
}

/**
 * Invitation to JOIN a classroom via a self-serve link. Unlike the
 * already-added notice, this collects no membership until the recipient signs
 * in and joins with the code — the COPPA-safe path.
 */
export function ClassroomJoinInviteEmail({
  classroomName,
  inviterName,
  roleLabel,
  joinCode,
  joinUrl,
  recipient,
}: ClassroomJoinInviteEmailProps) {
  return (
    <EmailLayout
      preview={`${inviterName} invited you to join ${classroomName} on Tome`}
      recipient={recipient}
    >
      <EmailHeading>Join {classroomName} on Tome</EmailHeading>
      <EmailParagraph>
        {inviterName} invited you to join <strong>{classroomName}</strong> as a{" "}
        {roleLabel}. Follow the link below and sign in to enroll — no account
        details are shared until you join.
      </EmailParagraph>

      <EmailButton href={joinUrl}>Join the classroom</EmailButton>

      <EmailParagraph>
        Or enter this code after signing in: <strong>{joinCode}</strong>
      </EmailParagraph>

      <EmailDivider />

      <EmailSmall>
        If you weren&apos;t expecting this invitation, you can ignore this email.
      </EmailSmall>
    </EmailLayout>
  )
}

export default ClassroomJoinInviteEmail
