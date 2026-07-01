import * as React from "react"
import {
  EmailButton,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface PaymentFailedEmailProps {
  firstName?: string | null
  /** Human plan label, e.g. "Tome School". */
  planLabel: string
  /** Pre-formatted amount due with currency, when known. */
  amountFormatted?: string | null
  /**
   * Where the reader updates their card. Prefer Stripe's hosted invoice URL
   * (lets them pay the open invoice directly); falls back to billing settings.
   */
  updatePaymentUrl: string
  recipient: string
}

/**
 * Dunning / payment-failed email. Triggered by Stripe's
 * `invoice.payment_failed` event. Stripe retries automatically; this nudges the
 * reader to fix their card before the subscription lapses.
 */
export function PaymentFailedEmail({
  firstName,
  planLabel,
  amountFormatted,
  updatePaymentUrl,
  recipient,
}: PaymentFailedEmailProps) {
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : "Hi there,"

  return (
    <EmailLayout
      preview="We couldn't process your Tome payment — please update your card."
      recipient={recipient}
    >
      <EmailHeading>We couldn&apos;t process your payment</EmailHeading>
      <EmailParagraph>{greeting}</EmailParagraph>
      <EmailParagraph>
        We tried to charge{amountFormatted ? ` ${amountFormatted}` : ""} for
        your {planLabel} subscription, but the payment didn&apos;t go through.
        This usually means an expired card or insufficient funds.
      </EmailParagraph>

      <EmailParagraph>
        Please update your payment method to keep your access. We&apos;ll
        automatically retry over the next few days, but updating now is the
        fastest fix.
      </EmailParagraph>

      <EmailButton href={updatePaymentUrl}>Update payment method</EmailButton>

      <EmailDivider />

      <EmailSmall>
        If you think this is a mistake or need a hand, just reply to this email
        — a real person will help.
      </EmailSmall>
    </EmailLayout>
  )
}

export default PaymentFailedEmail
