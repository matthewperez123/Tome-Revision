import * as React from "react"
import {
  EmailHeading,
  EmailLayout,
  EmailParagraph,
} from "./_shared"

export interface AccountDeletedEmailProps {
  firstName?: string | null
  recipient: string
}

export function AccountDeletedEmail({
  firstName,
  recipient,
}: AccountDeletedEmailProps) {
  const name = firstName?.trim() || "Reader"

  return (
    <EmailLayout
      preview="A confirmation that your account and data have been permanently removed."
      recipient={recipient}
    >
      <EmailHeading>Your account has been deleted.</EmailHeading>
      <EmailParagraph>
        {name}, this is a confirmation that your Tome account, your library,
        your annotations, and all associated data have been permanently
        deleted. There is nothing left to recover.
      </EmailParagraph>
      <EmailParagraph>
        If this wasn&apos;t you, please reply to this email immediately so we
        can investigate.
      </EmailParagraph>
      <EmailParagraph>
        The canon will be here whenever you choose to return.
      </EmailParagraph>
      <EmailParagraph muted>— The Tome team</EmailParagraph>
    </EmailLayout>
  )
}

export default AccountDeletedEmail
