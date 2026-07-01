import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface SubscriptionConfirmedEmailProps {
  firstName?: string | null
  /** Human plan label, e.g. "Tome Solo". */
  planLabel: string
  /** Pre-formatted amount with currency, e.g. "$9.00". */
  amountFormatted: string
  /** Optional next billing date, already formatted (e.g. "July 30, 2026"). */
  nextBillingDate?: string | null
  /** Link to the hosted Stripe receipt/invoice, when available. */
  invoiceUrl?: string | null
  /** Link to manage the subscription (the app profile/billing page). */
  manageUrl: string
  recipient: string
}

/**
 * Receipt / subscription-confirmed email. Sent on a successful paid invoice
 * (invoice.paid with amount > 0) — the first charge after the trial and every
 * renewal thereafter.
 */
export function SubscriptionConfirmedEmail({
  firstName,
  planLabel,
  amountFormatted,
  nextBillingDate,
  invoiceUrl,
  manageUrl,
  recipient,
}: SubscriptionConfirmedEmailProps) {
  const greeting = firstName?.trim()
    ? `Thank you, ${firstName.trim()}.`
    : "Thank you for subscribing."

  return (
    <EmailLayout
      preview={`Your ${planLabel} payment of ${amountFormatted} was received.`}
      recipient={recipient}
    >
      <EmailHeading>{greeting}</EmailHeading>
      <EmailParagraph>
        We&apos;ve received your payment and your {planLabel} subscription is
        active. Here&apos;s a summary for your records.
      </EmailParagraph>

      <EmailParagraph>
        <strong>Plan:</strong> {planLabel}
        <br />
        <strong>Amount:</strong> {amountFormatted}
        {nextBillingDate ? (
          <>
            <br />
            <strong>Next billing date:</strong> {nextBillingDate}
          </>
        ) : null}
      </EmailParagraph>

      {invoiceUrl ? (
        <EmailButton href={invoiceUrl}>View your receipt</EmailButton>
      ) : (
        <EmailButton href={manageUrl}>Manage your subscription</EmailButton>
      )}

      <EmailDivider />

      <EmailSmall>
        You can update your payment method, change plans, or cancel anytime from
        your{" "}
        <a href={manageUrl} style={{ color: "#6366F1" }}>
          billing settings
        </a>
        . Questions? Reply to this email and a real person will help.
      </EmailSmall>
    </EmailLayout>
  )
}

export default SubscriptionConfirmedEmail
