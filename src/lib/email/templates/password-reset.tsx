import * as React from "react"
import {
  EmailButton,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface PasswordResetEmailProps {
  firstName?: string | null
  resetUrl: string
  recipient: string
}

export function PasswordResetEmail({
  resetUrl,
  recipient,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout
      preview="A link to set a new password, valid for one hour."
      recipient={recipient}
    >
      <EmailHeading>Reset your password.</EmailHeading>
      <EmailParagraph>
        We received a request to reset the password for your Tome account.
        Click the link below to set a new one.
      </EmailParagraph>
      <EmailButton href={resetUrl}>Reset my password</EmailButton>
      <EmailSmall>
        This link expires in one hour. If you didn&apos;t request a password
        reset, you can safely ignore this message — your password will remain
        unchanged.
      </EmailSmall>
    </EmailLayout>
  )
}

export default PasswordResetEmail
