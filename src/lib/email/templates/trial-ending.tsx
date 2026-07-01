import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface TrialEndingEmailProps {
  firstName?: string | null
  /** Human plan label, e.g. "Tome Solo". */
  planLabel: string
  /** When the trial ends / first charge lands, already formatted. */
  trialEndDate: string
  /** Pre-formatted first charge amount with currency, when known. */
  amountFormatted?: string | null
  /** Link to manage the subscription (the app profile/billing page). */
  manageUrl: string
  recipient: string
}

/**
 * Trial-ending reminder. Triggered by Stripe's
 * `customer.subscription.trial_will_end` event, which fires ~3 days before the
 * trial converts to a paid subscription (no cron needed).
 */
export function TrialEndingEmail({
  firstName,
  planLabel,
  trialEndDate,
  amountFormatted,
  manageUrl,
  recipient,
}: TrialEndingEmailProps) {
  const greeting = firstName?.trim()
    ? `Hi ${firstName.trim()},`
    : "Hi there,"

  return (
    <EmailLayout
      preview={`Your Tome trial ends ${trialEndDate}.`}
      recipient={recipient}
    >
      <EmailHeading>Your free trial is ending soon</EmailHeading>
      <EmailParagraph>{greeting}</EmailParagraph>
      <EmailParagraph>
        Your {planLabel} free trial ends on <strong>{trialEndDate}</strong>.
        After that{amountFormatted ? `, we'll charge ${amountFormatted}` : ", your subscription will begin"}{" "}
        and you&apos;ll keep full access to the library, Virgil, and everything
        you&apos;ve started.
      </EmailParagraph>

      <EmailParagraph>
        You don&apos;t need to do anything to continue. If you&apos;d like to
        change your plan or cancel before the trial ends, you can do that
        anytime.
      </EmailParagraph>

      <EmailButton href={manageUrl}>Manage your subscription</EmailButton>

      <EmailDivider />

      <EmailSmall>
        Cancel before {trialEndDate} and you won&apos;t be charged. Questions?
        Just reply to this email.
      </EmailSmall>
    </EmailLayout>
  )
}

export default TrialEndingEmail
