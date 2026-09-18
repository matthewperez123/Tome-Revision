import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface SubscriptionCancelledEmailProps {
  firstName?: string | null
  /** Human plan label, e.g. "Tome Classroom". */
  planLabel: string
  /** Where the teacher can resubscribe. */
  pricingUrl: string
  recipient: string
}

/**
 * Cancellation confirmation. Triggered by Stripe's
 * `customer.subscription.deleted` event. Free teacher tools remain; this
 * confirms the paid plan ended and points back to pricing.
 */
export function SubscriptionCancelledEmail({
  firstName,
  planLabel,
  pricingUrl,
  recipient,
}: SubscriptionCancelledEmailProps) {
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : "Hi there,"

  return (
    <EmailLayout
      preview={`Your ${planLabel} subscription has ended.`}
      recipient={recipient}
    >
      <EmailHeading>Your subscription has ended</EmailHeading>
      <EmailParagraph>{greeting}</EmailParagraph>
      <EmailParagraph>
        Your {planLabel} subscription is now cancelled. You won&apos;t be
        charged again.
      </EmailParagraph>

      <EmailParagraph>
        Your teacher account stays free forever — your classroom, library
        access, quizzes, and gradebook are all still here. Student seats and
        the larger Questions allowance return whenever you do.
      </EmailParagraph>

      <EmailButton href={pricingUrl}>See plans</EmailButton>

      <EmailDivider />

      <EmailSmall>
        Cancelled by mistake, or something we could have done better? Reply to
        this email — a real person will help.
      </EmailSmall>
    </EmailLayout>
  )
}

export default SubscriptionCancelledEmail
