import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
} from "./_shared"

export interface WelcomeEmailProps {
  firstName?: string | null
  appUrl: string
  recipient: string
}

export function WelcomeEmail({
  firstName,
  appUrl,
  recipient,
}: WelcomeEmailProps) {
  const greeting = firstName?.trim() ? `Welcome, ${firstName.trim()}.` : "Welcome to Tome."

  return (
    <EmailLayout
      preview="Three thousand years of literature. One reader at a time."
      recipient={recipient}
    >
      <EmailHeading>{greeting}</EmailHeading>
      <EmailParagraph>
        You&apos;ve just joined a small but growing community of readers
        working through the books that built the world — Homer, Dante, Austen,
        Tolstoy, and a thousand more.
      </EmailParagraph>

      <EmailParagraph>Here&apos;s how to begin:</EmailParagraph>

      <EmailParagraph>
        <strong>The Reader.</strong> Open any book. The text is complete,
        beautifully typeset, and yours to annotate.
      </EmailParagraph>

      <EmailParagraph>
        <strong>Virgil.</strong> Tap any annotation in the margin to chat with
        a scholar — your guide through the harder passages.
      </EmailParagraph>

      <EmailParagraph>
        <strong>Trials.</strong> Every chapter ends with a Trial. Earn Wisdom,
        keep your Flame, collect Seals.
      </EmailParagraph>

      <EmailButton href={`${appUrl}/library`}>Open my library</EmailButton>

      <EmailDivider />

      <EmailParagraph muted>
        If you ever need help, reply to this email — a real person will read
        it.
      </EmailParagraph>

      <EmailParagraph muted>— The Tome team</EmailParagraph>
    </EmailLayout>
  )
}

export default WelcomeEmail
