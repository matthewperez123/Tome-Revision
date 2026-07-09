import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface SeatInviteEmailProps {
  inviterName: string
  claimUrl: string
  recipient: string
}

export function SeatInviteEmail({
  inviterName,
  claimUrl,
  recipient,
}: SeatInviteEmailProps) {
  return (
    <EmailLayout
      preview={`${inviterName} invited you to a Tome School teacher seat`}
      recipient={recipient}
    >
      <EmailHeading>You&apos;ve been given a Tome teacher seat</EmailHeading>
      <EmailParagraph>
        {inviterName} invited you to a <strong>Tome School</strong> teacher seat.
        Claim it to unlock the full educator suite — classrooms, assignments,
        Trials, and Virgil.
      </EmailParagraph>

      <EmailButton href={claimUrl}>Claim your seat</EmailButton>

      <EmailDivider />

      <EmailSmall>
        If you weren&apos;t expecting this invitation, you can safely ignore this
        email.
      </EmailSmall>
    </EmailLayout>
  )
}

export default SeatInviteEmail
