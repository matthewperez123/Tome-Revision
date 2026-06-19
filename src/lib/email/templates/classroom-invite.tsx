import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface ClassroomInviteEmailProps {
  classroomName: string
  inviterName: string
  /** Human-readable role label, e.g. "student" or "co-teacher". */
  roleLabel: string
  classroomUrl: string
  recipient: string
}

export function ClassroomInviteEmail({
  classroomName,
  inviterName,
  roleLabel,
  classroomUrl,
  recipient,
}: ClassroomInviteEmailProps) {
  return (
    <EmailLayout
      preview={`${inviterName} added you to ${classroomName} on Tome`}
      recipient={recipient}
    >
      <EmailHeading>You&apos;ve joined {classroomName}</EmailHeading>
      <EmailParagraph>
        {inviterName} added you to <strong>{classroomName}</strong> as a{" "}
        {roleLabel}. Your reading, Trials, and messages for this class now live
        here.
      </EmailParagraph>

      <EmailButton href={classroomUrl}>Open the classroom</EmailButton>

      <EmailDivider />

      <EmailSmall>
        Turn off classroom emails any time in your account settings.
      </EmailSmall>
    </EmailLayout>
  )
}

export default ClassroomInviteEmail
