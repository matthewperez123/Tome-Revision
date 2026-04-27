import * as React from "react"
import {
  EmailButton,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface VerifyEmailProps {
  firstName?: string | null
  verificationUrl: string
  recipient: string
}

export function VerifyEmail({
  firstName,
  verificationUrl,
  recipient,
}: VerifyEmailProps) {
  return (
    <EmailLayout
      preview="One click and you're in. The canon is waiting."
      recipient={recipient}
    >
      <EmailHeading>Welcome, {firstName?.trim() || "reader"}.</EmailHeading>
      <EmailParagraph>
        You&apos;re one step away from the canon. Click the link below to
        verify your email and start reading.
      </EmailParagraph>
      <EmailButton href={verificationUrl}>Verify my email</EmailButton>
      <EmailSmall>
        This link expires in 24 hours. If you didn&apos;t sign up for Tome, you
        can safely ignore this message.
      </EmailSmall>
    </EmailLayout>
  )
}

export default VerifyEmail
