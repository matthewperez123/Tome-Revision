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
| `scripts/verify-billing-stripe.ts` | `npm run verify:billing:stripe` | **Stripe TEST mode only** — drives real test-clock subscriptions, asserts Stripe statuses/invoices | `STRIPE_SECRET_KEY` (test) + the `TOME_PRICE_*` vars below |

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

Launch-model scenarios (seats are **student** seats; teachers are free):

### Free teacher

| Step | `subscriptions` row | `getEntitlement()` / plan |
| --- | --- | --- |
| Teacher, no sub | *(no row)*, `profiles.role:teacher` | `hasEducatorTools:true`, student allowance 30, classroom allowance 1 |

### Classroom (per-student seats)

| Step | row | expected |
| --- | --- | --- |
| Checkout `seats:25` | `tier:classroom, status:active, seats:25` | allowance 25; the **26th** student join is rejected |
| Cancel (at period end) | `status:active, cancel_at_period_end:true` | access retained until period end |
| Period ends | `status:canceled` | reverts to free-teacher allowances (1 classroom · 30 students) |

### School (pooled student seats across teachers)

| Step | row | expected |
| --- | --- | --- |
| Checkout `seats:150` | `tier:school, status:active, seats:150` | admin `school_seats` row active; covered teachers share the 150-student allowance; a student in two covered classrooms counts **once** |
| Flat 150 SKU | `tier:school`, flat150 price | allowance 150 |
| School canceled | `status:canceled` | admin and covered teachers revert to free-teacher |

### Family ($99 / yr, sold only from /homeschool)

| Step | row | expected |
| --- | --- | --- |
| Active Family | `tier:family, status:active` | full library, student allowance 4 |

### Grandfathered (never sold, must keep resolving)

| Step | row | expected |
| --- | --- | --- |
| Legacy Solo | `tier:solo, status:active` | reads all books (full library) |
| Legacy School (per-teacher) | legacy school row | holder is still a teacher |

> Key rule: only `active` **or** `trialing` confer a paid tier.
> `cancel_at_period_end` keeps `status:active`, so access is retained until
> Stripe flips it to `canceled` at period end. `canceled` and `past_due` fall
> back to the free-teacher baseline (teachers are never locked out of tools).

---

## Run 2 — Stripe lifecycle with test clocks (automated, gated)

```
npm run verify:billing:stripe
```

Skipped today (no Stripe keys). To enable:

1. Stripe dashboard → **Test mode** → Developers → API keys → copy the **test**
   secret key (`sk_test_…`).
2. Create the **test-mode** prices for the launch model and copy their
   `price_…` ids.
3. Add to `.env.local` (same names the app itself reads —
   `src/lib/billing/prices.ts`):
   ```
   STRIPE_SECRET_KEY=sk_test_…
   TOME_PRICE_STUDENT_SEAT_YEARLY=price_…
   TOME_PRICE_SCHOOL_FLAT_150=price_…
   TOME_PRICE_SCHOOL_FLAT_300=price_…
   TOME_PRICE_FAMILY_YEARLY=price_…
   TOME_PRICE_QUESTIONS_TOPUP=price_…
   ```

What it asserts (using **test clocks** so no real time passes, no real charge):

- **Classroom:** checkout with seat `quantity:12` → `subscriptions.seats = 12`
  and a personal Question pool granted.
- **School:** `quantity:125` on the seat price → `seats = 125` and the admin's
  `school_seats` row active; **flat300** → `seats = 300`.
- **Top-up:** one-time payment → ledger `+10000 topup` **exactly once** even
  when the webhook event is replayed.
- **Deletion:** subscription deleted → role kept while still teaching,
  `monthly_grant` reset to the free-teacher 100.

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
- [ ] Questions RPC unit tests: insufficient balance raises `insufficient_questions`;
      refund restores; a repeated `stripe_event_id` grant is a no-op;
      `refresh_question_grants` respects the 3-month accrual cap; a non-owner
      cannot consume from another teacher's pool.
- [ ] `/pricing` shows one set of numbers matching `src/lib/billing/config.ts`;
      `/homeschool` shows $99 and `/pricing` does not.
- [ ] TEST Stripe keys + price ids added; `npm run verify:billing:stripe` → all checks pass.
- [ ] Run 3 manual webhook pass: each Stripe event writes the expected `subscriptions` row.
- [ ] Billing emails fire to `@resend.dev` sinks (receipt / trial-ending / dunning).
- [ ] Run 4 UI: paid library unlocks for active/trialing, reverts on cancel/past_due.
- [ ] Sending domain `usetome.app` **verified** in Resend (see `docs/email-setup.md`).
- [ ] Production env has live `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.
