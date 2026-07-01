import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
} from "./_shared"

export interface DemoRequestConfirmEmailProps {
  firstName?: string | null
  appUrl: string
  recipient: string
}

/** Confirmation sent to the person who submitted the demo request. */
export function DemoRequestConfirmEmail({
  firstName,
  appUrl,
  recipient,
}: DemoRequestConfirmEmailProps) {
  const greeting = firstName?.trim()
    ? `Thanks, ${firstName.trim()}.`
    : "Thanks for reaching out."

  return (
    <EmailLayout
      preview="We received your request — the Tome team will be in touch."
      recipient={recipient}
    >
      <EmailHeading>{greeting}</EmailHeading>
      <EmailParagraph>
        We received your request for a Tome demo. A member of our team will be
        in touch shortly to learn about your school and set up a walkthrough.
      </EmailParagraph>

      <EmailParagraph>
        In the meantime, you&apos;re welcome to explore what Tome offers
        educators — classrooms, the gradebook, AI-assisted quizzes, and Virgil,
        your students&apos; reading guide.
      </EmailParagraph>

      <EmailButton href={`${appUrl}/educators`}>Explore Tome for Teachers</EmailButton>

      <EmailDivider />

      <EmailParagraph muted>
        If you have an immediate question, just reply to this email — a real
        person will read it.
      </EmailParagraph>

      <EmailParagraph muted>— The Tome team</EmailParagraph>
    </EmailLayout>
  )
}

export default DemoRequestConfirmEmail
