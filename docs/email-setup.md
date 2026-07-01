# Transactional email (Resend) — setup, templates & DNS

Tome sends all transactional email through **Resend** (`src/lib/email/*`).
`sendEmail()` (`src/lib/email/send.ts`) never throws — a delivery failure logs
and is swallowed so it can never break auth, checkout, or a webhook.

## Sender & domains — what we control

| Thing | Value | Notes |
| --- | --- | --- |
| Sending domain | **`usetome.app`** | The product domain. All mail is `From: …@usetome.app`. |
| From address | `Tome <noreply@usetome.app>` | `RESEND_FROM_EMAIL` (`src/lib/email/client.ts`). |
| Support address | **`support@usetome.app`** | `src/lib/support.ts` → surfaces in footer, `/contact`, `/privacy`, `/terms`, `/accessibility`. |
| App / link base | `https://usetome.app` | `NEXT_PUBLIC_APP_URL`. |

**`support@tome.app` was a placeholder on a different domain we do NOT own or
route** — it would have bounced. It has been replaced everywhere with
`support@usetome.app`, which is on our verified sending domain. To actually
**receive** replies at that address you still need inbound mail/forwarding on
`usetome.app` (e.g. an MX/forwarding rule, or a Resend inbound route) — sending
DNS alone does not create a mailbox.

> Display-only strings like `tome.app/join/<code>` in classroom UIs and share
> links are cosmetic and were left as-is; they are not email/support routing.

## DKIM / SPF / domain verification — what YOU must set in DNS

Status today: the sending domain is **NOT verified in Resend yet** — that is the
cause of the `403 "usetome.app domain is not verified"` we saw during testing.
Until you verify it, Resend rejects every send.

Steps:

1. In the Resend dashboard → **Domains → Add Domain** → enter `usetome.app`.
2. Resend shows DNS records to add at your DNS provider (the exact tokens are
   generated per-account — copy them from the dashboard). They are:

   | Type | Host (typical) | Purpose |
   | --- | --- | --- |
   | `TXT` | `resend._domainkey` (or `<selector>._domainkey`) | **DKIM** public key — signs each message. |
   | `TXT` | `send` (the MAIL FROM subdomain) | **SPF** — `v=spf1 include:amazonses.com ~all` authorizing Resend/SES to send. |
   | `MX` | `send` | Return-path/bounce handling for the MAIL FROM subdomain. |

3. (Recommended) Add a **DMARC** record so inbox providers trust the domain:
   `TXT` at `_dmarc` → `v=DMARC1; p=none; rua=mailto:dmarc@usetome.app`
   (start at `p=none` to monitor, tighten to `quarantine`/`reject` later).
4. Back in Resend, click **Verify**. Propagation is usually minutes (up to ~48h).
   Once it flips to **Verified**, sends succeed.
5. Set the env vars (below) in Vercel: Preview = Resend **test** key, Production
   = live key. Keep `RESEND_FROM_EMAIL=Tome <noreply@usetome.app>`.

### Required env vars

```
RESEND_API_KEY=            # Resend API key (server-only)
RESEND_FROM_EMAIL=Tome <noreply@usetome.app>   # must be on the verified domain
NEXT_PUBLIC_APP_URL=https://usetome.app        # link base in emails
DEMO_REQUESTS_INBOX=       # where /demo leads go (falls back to support@usetome.app)
SUPABASE_AUTH_HOOK_SECRET= # signs the Supabase Send-Email hook (verify/reset)
STRIPE_WEBHOOK_SECRET=     # required for the billing emails to fire
```

## Templates & where each is triggered

All templates live in `src/lib/email/templates/` and share the `_shared.tsx`
layout primitives.

| Template | File | Trigger |
| --- | --- | --- |
| Welcome | `welcome.tsx` | `sendWelcomeEmailIfNeeded()` from `/auth/verified` + `/auth/callback`. Idempotent via `auth.user_metadata.welcome_email_sent_at`. |
| Verify email | `verify-email.tsx` | Supabase **Send Email Hook** → `POST /api/auth/email-hook` on signup / email change. |
| Password reset | `password-reset.tsx` | Same hook, `recovery` action. |
| Demo request — notify | `demo-request-notify.tsx` | `POST /api/demo-request` → internal alert to `DEMO_REQUESTS_INBOX`. |
| Demo request — confirm | `demo-request-confirm.tsx` | `POST /api/demo-request` → confirmation to the requester. |
| **Receipt / confirmed** | `subscription-confirmed.tsx` | Stripe webhook `invoice.paid` (amount_paid > 0) → `sendReceiptEmail()`. |
| **Trial ending** | `trial-ending.tsx` | Stripe webhook `customer.subscription.trial_will_end` (~3 days before conversion) → `sendTrialEndingEmail()`. |
| **Payment failed (dunning)** | `payment-failed.tsx` | Stripe webhook `invoice.payment_failed` → `sendPaymentFailedEmail()`. Card-update link uses Stripe's `hosted_invoice_url`. |

The three billing emails are dispatched best-effort from
`src/lib/email/billing.ts`, called inside `src/app/api/stripe/webhook/route.ts`
**after** the canonical `subscriptions` upsert. They never throw, so a failed
email can't make the webhook 500 (which would trigger Stripe to retry the whole
event). The webhook stays idempotent via `stripe_events`.

### Stripe dashboard: enable the trial-ending event

`customer.subscription.trial_will_end` must be selected on the webhook endpoint
in the Stripe dashboard (Developers → Webhooks → your endpoint → events). Stripe
emits it ~3 days before a trial ends; checkout sets `trial_period_days: 7`, so
no cron is needed for the trial reminder.

## Testing without emailing real users

- Resend exposes safe sink addresses: `delivered@resend.dev`,
  `bounced@resend.dev`, `complained@resend.dev` — send to those instead of a
  real inbox.
- Or render a template to HTML without sending (`@react-email/render`) to eyeball
  it.
- Stripe billing emails can be exercised end-to-end with the Stripe CLI:
  `stripe trigger invoice.payment_failed` /
  `stripe trigger customer.subscription.trial_will_end` against
  `stripe listen --forward-to localhost:3000/api/stripe/webhook` — point the
  recipient at a `@resend.dev` test user.
