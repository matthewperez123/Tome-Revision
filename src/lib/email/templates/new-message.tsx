import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface NewMessageEmailProps {
  senderName: string
  /** A short excerpt of the message body. */
  excerpt: string
  subject?: string | null
  conversationUrl: string
  recipient: string
}

export function NewMessageEmail({
  senderName,
  excerpt,
  subject,
  conversationUrl,
  recipient,
}: NewMessageEmailProps) {
  return (
    <EmailLayout
      preview={`${senderName} sent you a message on Tome`}
      recipient={recipient}
    >
      <EmailHeading>New message from {senderName}</EmailHeading>
      {subject?.trim() ? (
        <EmailParagraph muted>Re: {subject.trim()}</EmailParagraph>
      ) : null}
      <EmailParagraph>
        <em>&ldquo;{excerpt}&rdquo;</em>
      </EmailParagraph>

      <EmailButton href={conversationUrl}>Read &amp; reply</EmailButton>

      <EmailDivider />

      <EmailSmall>
        You&apos;re receiving this because you&apos;re a member of a shared
        classroom. Turn off message emails any time in your account settings.
      </EmailSmall>
    </EmailLayout>
  )
}

export default NewMessageEmail
