# Stripe cutover runbook (gated)

The step-by-step to take Tome's subscription billing from **code-complete** to
**proven in test mode** and then to **live**. Nothing in this document charges a
real card, emails a real user, or touches a live Stripe object until the final
"Go live" section, which is fully manual and gated.

> Secrets are referred to by **variable name only**. Never paste `sk_…`,
> `whsec_…`, or a live price id into a file that gets committed. They live in
> `.env.local` (local) and the Vercel project env (deploy) — both untracked.

---

## 0. Where the code stands

These fixes are committed on `today/stripe-full-integration` (not merged):

- **webhook** derives tier from the canonical price map (`tierForBillingPriceId`,
  `@/lib/billing/prices`) — the same table checkout resolves from.
- **checkout** carries logged-out intent to `/login?redirect=…`; blocks
  `role:'student'` self-checkout with a 403; appends
  `session_id={CHECKOUT_SESSION_ID}` to the success url.
- **billing/success** reconciles the real subscription status from Stripe (does
  not claim "active" until the session's subscription is `active`/`trialing`).
- **in-app upgrade CTAs** (reader PaywallGate, profile) push **Family**; the
  marketing pricing page is unchanged. Solo remains purchasable but is not
  surfaced in-app.

The single writer of `public.subscriptions` is the webhook
(`src/app/api/stripe/webhook/route.ts`). Entitlement is read by
`getEntitlement()` (`src/lib/entitlements/server.ts`). Do not add a second
writer.

---

## 1. Namespace: use the CANONICAL vars

The app has two price-config namespaces. Only one is wired to the live UI:

| | Namespace | Used by |
| --- | --- | --- |
| **CANONICAL (use this)** | `TOME_PRICE_*` → `src/lib/billing/prices.ts` | `/pricing`, `/api/stripe/checkout`, `billing/success`, webhook reverse-map |
| LEGACY (do not rely on) | `STRIPE_PRICE_*` → `src/lib/stripe/prices.ts`, `src/lib/marketing/plans.ts` | dead routes + the `verify:billing:stripe` script only |

The five canonical vars, one per live TEST price:

```
TOME_PRICE_SOLO_MONTHLY
TOME_PRICE_SOLO_YEARLY
TOME_PRICE_FAMILY_MONTHLY
TOME_PRICE_FAMILY_YEARLY
TOME_PRICE_SCHOOL_SEAT_YEARLY
```

> The legacy `verify:billing:stripe` script (see `docs/billing-test-plan.md`)
> reads `STRIPE_PRICE_{SOLO,FAMILY,SCHOOL}_MONTHLY`. It exercises Stripe test
> clocks in isolation but does **not** prove the app's real checkout→webhook
> path, which is canonical-only. Use it as a supplementary lifecycle check, not
> the primary proof.

---

## 2. Energize the TEST wire (local, ~10 min)

In the worktree `.env.local` (untracked), set:

```
STRIPE_SECRET_KEY            # sk_test_…  (test mode)
STRIPE_WEBHOOK_SECRET        # whsec_…    (from `stripe listen`, step 2)
TOME_PRICE_SOLO_MONTHLY      # price_… (test)
TOME_PRICE_SOLO_YEARLY       # price_…
TOME_PRICE_FAMILY_MONTHLY    # price_…
TOME_PRICE_FAMILY_YEARLY     # price_…
TOME_PRICE_SCHOOL_SEAT_YEARLY# price_…
```

1. Start the app on the worktree port: dev server `tome-stripe` (port 3300).
2. Forward webhooks — this prints the `whsec_…` to set above, then restart dev:
   ```
   stripe listen --forward-to localhost:3300/api/stripe/webhook
   ```
   Without `STRIPE_WEBHOOK_SECRET` the webhook returns 501 and no event is
   recorded.
3. Confirm the endpoint receives the required events (subscribe these on a
   dashboard endpoint for the hosted case):
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.paid`, `invoice.payment_failed`,
   `customer.subscription.trial_will_end`.

---

## 3. Prove it (test mode)

Drive a checkout from the app (test card `4242 4242 4242 4242`) for each case
and assert the DB. `stripe_events` starts empty (0 rows = the wire has never
fired).

**Phase 1 — the wire lands + is idempotent**
- Complete one Family checkout → a row appears in `public.stripe_events`.
- Re-deliver the same event (`stripe events resend <id>`, or replay from the
  CLI) → **no** duplicate row and **no** double-write (insert-first idempotency
  on the event id).

**Phase 2 — Family produces the right profile**
- After the Family checkout completes: `subscriptions` row `tier:family,
  status:active|trialing`; buyer `profiles.role = 'teacher'`;
  `getEntitlement()` → full library, `teacherTools:false`.
- Cancel at period end → `status:active, cancel_at_period_end:true`, access
  **retained**; let the period end (test clock) → `status:canceled`, reverts to
  Free; teacher role only stripped if the downgrade guard finds no other
  entitlement/classroom ownership.

**Phase 3 — School seats**
- School checkout with `quantity = seats` (min 2) → `subscriptions
  tier:school, status:active, seats:N`; `school_seats` provisioned (seat #1
  admin active, the rest pending); admin `getEntitlement()` →
  `schoolRole:admin, teacherTools:true`.
- Accept a seat invite (`/join/seat/[token]`) → covered teacher row, role
  teacher, `coveredBy:<admin>`.
- Cancel the school subscription → admin **and** covered teachers revert to
  Free.

**Gate blocks**
- Signed-out checkout → 401 → redirect to `/login?redirect=/pricing?plan=…`.
- `role:'student'` account → `/api/stripe/checkout` returns 403.

Cross-check the entitlement math anytime with `npm run verify:billing`
(DB-only, writes+asserts+cleans ephemeral users; documented in
`docs/billing-test-plan.md`).

---

## 4. Go live (manual, gated — do not automate)

Only after Section 3 passes end-to-end.

1. **Live products + prices.** In Stripe **live mode**, create the five prices
   mirroring the test catalog (Solo $9/$90, Family $18/$150, School seat
   $120/yr). Copy the live `price_…` ids. Solo prices exist but stay hidden
   in-app.
2. **Live webhook endpoint.** Developers → Webhooks → add endpoint
   `https://<prod-domain>/api/stripe/webhook`, subscribe the same event set as
   step 2.3, copy its **live** signing secret.
3. **Vercel env (Production).** Set live values for `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, and the five `TOME_PRICE_*` vars. Do not put live
   secrets in any file. Redeploy so the new env is picked up.
4. **Mode guard is automatic.** `assertPriceMatchesKeyMode` refuses a
   cross-mode session (test key + live price, or vice versa), so a half-set env
   fails loud instead of silently mischarging.
5. **Live smoke test.** One real low-exposure purchase (or Stripe's live test
   affordances), confirm `stripe_events` + `subscriptions` + role, then refund
   from the dashboard. Verify the billing portal opens from `/account` and
   `/profile` (Manage subscription).

## 5. Rollback

- **Bad price/env:** correct the `TOME_PRICE_*`/secret env in Vercel and
  redeploy. No code change; the canonical table reads env at runtime.
- **Bad webhook:** disable the live endpoint in the dashboard; the app degrades
  to "finalizing" on success (truthful) rather than false "active". Re-enable
  after fixing.
- **Bad deploy:** revert to the previous production deploy; env is unaffected.
- **Merge:** these fixes ship by merging `today/stripe-full-integration` after
  review. Do not merge before Section 3 passes.
