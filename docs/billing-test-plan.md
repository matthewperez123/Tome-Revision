# Billing verification — pre-launch test plan

End-to-end checklist for the subscription billing system before going live.
It proves three layers line up:

1. **Stripe** produces the right subscription states across the lifecycle
   (trial → paid → renewal failure → cancel).
2. The **webhook** (`src/app/api/stripe/webhook/route.ts`) is the single writer
   of `public.subscriptions` and maps each Stripe state onto the right row.
3. **`getEntitlement()`** (`src/lib/entitlements/server.ts`) reads that row and
   unlocks / reverts access correctly (full library, seats, teacher tools).

Two of these are automated; the Stripe↔webhook seam is a short manual run with
the Stripe CLI. Nothing here charges a real card or emails a real user.

---

## What each script covers

| Script | npm | Talks to | Needs |
| --- | --- | --- | --- |
| `scripts/verify-billing-entitlements.ts` | `npm run verify:billing` | **our DB only** — writes `subscriptions` rows mirroring webhook outcomes, asserts `getEntitlement()` | Supabase URL + service-role key (in `.env.local`) |
| `scripts/verify-billing-stripe.ts` | `npm run verify:billing:stripe` | **Stripe TEST mode only** — drives real test-clock subscriptions, asserts Stripe statuses/invoices | `STRIPE_SECRET_KEY` (test) + `STRIPE_PRICE_{SOLO,FAMILY,SCHOOL}_MONTHLY` |

`verify:billing` runs today with no extra setup. `verify:billing:stripe`
**skips cleanly** (exit 0, prints a skip line) until you add TEST-mode Stripe
keys + price IDs, and **refuses to run** against a live key.

---

## Run 1 — Entitlement lifecycle (automated, DB-backed)

```
npm run verify:billing
```

Creates ephemeral auth users, writes `subscriptions` rows for each lifecycle
state, asserts the full `getEntitlement()` output, and deletes everything in a
`finally`. Latest run: **112 checks passed, 0 failed.**

For every step it asserts the **subscriptions row** that the webhook would write
and the **`getEntitlement()`** result it should produce:

### Solo

| Step | `subscriptions` row | `getEntitlement()` |
| --- | --- | --- |
| Free | *(no row)* | `tier:free`, `isActive:false`, `bookLimit:20`, `fullLibrary:false` |
| Start trial | `tier:solo, status:trialing` | `tier:solo`, `isActive:true`, full library, `teacherTools:false` |
| Trial → paid | `tier:solo, status:active` | unchanged — full access retained |
| Cancel (at period end) | `status:active, cancel_at_period_end:true` | **still full access** until the period actually ends |
| Period ends / canceled | `status:canceled` | reverts to Free (`bookLimit:20`) |
| Payment failed (dunning) | `status:past_due` | reverts to Free |

> Key rule: only `active` **or** `trialing` confer a paid tier. `cancel_at_period_end`
> keeps `status:active`, so access is retained until Stripe flips it to `canceled`
> at period end. `canceled` and `past_due` both fall back to Free.

### Family (seats, smoke)

| Step | row | entitlement |
| --- | --- | --- |
| Active Family | `tier:family, status:active` | full library, `teacherTools:false` |

### School (per-teacher quantity, smoke)

| Step | row | entitlement |
| --- | --- | --- |
| School admin | `tier:school, status:active, seats:5` | `schoolRole:admin`, `seats:5`, `teacherTools:true`, `coveredBy:self` |
| Covered teacher | admin row + `school_seats(teacher_id, seat_role:teacher)` | `schoolRole:teacher`, `coveredBy:<admin>`, full access |
| School canceled | admin `status:canceled` | **both** admin and covered teacher revert to Free |

---

## Run 2 — Stripe lifecycle with test clocks (automated, gated)

```
npm run verify:billing:stripe
```

Skipped today (no Stripe keys). To enable:

1. Stripe dashboard → **Test mode** → Developers → API keys → copy the **test**
   secret key (`sk_test_…`).
2. Create three **test-mode** recurring monthly prices (Solo / Family / School)
   and copy their `price_…` ids.
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_…
   STRIPE_PRICE_SOLO_MONTHLY=price_…
   STRIPE_PRICE_FAMILY_MONTHLY=price_…
   STRIPE_PRICE_SCHOOL_MONTHLY=price_…
   ```

What it asserts (using **test clocks** so no real time passes, no real charge):

- **Solo:** create with `trial_period_days:7` → `trialing` → advance +8 days →
  `active` with a **paid** first invoice (amount > 0) → swap to
  `pm_card_chargeCustomerFail` → advance to renewal → `past_due`/`unpaid`/`canceled`
  with the renewal invoice **not** paid → cancel → `canceled`.
- **Family:** subscription on the Family price starts `trialing`.
- **School:** subscription on the School price with `quantity = seats` — asserts
  the line-item quantity.

It creates everything under disposable test clocks and deletes them at the end
(cascades to customers + subscriptions). It **refuses to run** unless the key is
a test key.

---

## Run 3 — Webhook → DB integration (manual, ~5 min)

This is the one seam the two scripts can't cover automatically: Stripe events →
our webhook → `subscriptions` row. Exercise it locally with the Stripe CLI.

1. Start the app: `npm run dev`.
2. Forward webhooks (this prints a `whsec_…` — put it in `.env.local` as
   `STRIPE_WEBHOOK_SECRET` and restart dev):
   ```
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. Drive a real test checkout from the app's pricing page (use card
   `4242 4242 4242 4242`), or trigger events directly:
   ```
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.updated
   stripe trigger invoice.paid
   stripe trigger invoice.payment_failed
   stripe trigger customer.subscription.trial_will_end
   stripe trigger customer.subscription.deleted
   ```
4. After each, confirm the `subscriptions` row matches the table in Run 1
   (query Supabase or re-run `npm run verify:billing` against that user).
5. Confirm the **emails** fire (see `docs/email-setup.md`): `invoice.paid` →
   receipt (only when `amount_paid > 0`), `trial_will_end` → trial-ending,
   `invoice.payment_failed` → dunning. Point the recipient at a `@resend.dev`
   sink so no real user is emailed.

> `customer.subscription.trial_will_end` must be enabled on the webhook endpoint
> in the Stripe dashboard (Developers → Webhooks → your endpoint → events).

---

## Run 4 — In-app entitlement (manual UI check)

1. Sign in as a user whose `subscriptions.status` is `active`/`trialing` →
   `/library/browse` shows the **full** catalog; a paid-only book opens in the
   reader.
2. Flip that user's row to `canceled` (or let the period end) → the same
   paid-only book is gated; only the 20 free samples open.
3. School admin sees teacher tools; a covered teacher (via `school_seats`) has
   full access; removing the seat reverts them to Free.

---

## Pre-launch sign-off checklist

- [ ] `npm run verify:billing` → all checks pass.
- [ ] TEST Stripe keys + price ids added; `npm run verify:billing:stripe` → all checks pass.
- [ ] Run 3 manual webhook pass: each Stripe event writes the expected `subscriptions` row.
- [ ] Billing emails fire to `@resend.dev` sinks (receipt / trial-ending / dunning).
- [ ] Run 4 UI: paid library unlocks for active/trialing, reverts on cancel/past_due.
- [ ] Sending domain `usetome.app` **verified** in Resend (see `docs/email-setup.md`).
- [ ] Production env has live `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.
