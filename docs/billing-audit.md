# Billing Audit — Tome

_End-to-end audit of the current Stripe billing implementation. Generated against branch `fix/reader-pathways-styling`._

## Update — webhook sync hardened (subscriptions is now canonical)

- Webhook (`src/app/api/stripe/webhook/route.ts`) now handles `checkout.session.completed`, `customer.subscription.{created,updated,deleted}`, **`invoice.paid`**, and **`invoice.payment_failed`**; verifies the signature; logs every handled/ignored/duplicate event; and writes via the service role.
- **Idempotency** via `public.stripe_events` (event-id ledger, migration `20260707000000_stripe_events_idempotency.sql`): each event id is checked before processing and recorded after; replays are no-ops. RLS enabled, **no policies / no grants → service-role only**.
- **`subscriptions` is the single source of truth for the Stripe customer id.** Checkout resolves the customer from `subscriptions` → Stripe metadata search → create (no longer writes `profiles`). Portal reads the customer from `subscriptions`.
- **Planned removal (NOT dropped):** `profiles.stripe_customer_id` is now read/written by **zero** code paths (verified by grep). Drop it in a future migration once confirmed no out-of-band tooling depends on it:
  ```sql
  -- future migration, after confirming nothing external reads it:
  alter table public.profiles drop column if exists stripe_customer_id;
  ```
  Left in place for now to avoid coupling this change to a destructive column drop.

## TL;DR

Tome has a **functional, well-structured but unconfigured and unfinished** Stripe subscription flow:

- A hosted-Checkout subscription flow (Solo / Family), a webhook that syncs state into `public.subscriptions`, a Billing Portal route, and a client entitlement gate all exist and are wired together.
- **It cannot take payments right now**: there are **no Stripe env vars set** (`.env.local` has none), so every Stripe route returns `501 Not configured`. There is also **no `.env.example`** documenting what to set.
- The only hardcoded price/product IDs are **four TEST-mode price IDs** in `src/lib/stripe/plans.ts`. There are **no product IDs** anywhere and **no live-mode IDs**.
- **Entitlement is client-side only** (`useEntitlement()` in the browser) and the reader paywall is explicitly a UX gate, not a security boundary — chapter JSON under `/content/*.json` is publicly fetchable.
- **`stripe_customer_id` is duplicated** across `profiles` and `subscriptions`. `profiles` is the read/write source of truth (checkout + portal); `subscriptions.stripe_customer_id` is webhook-written but never read.
- **Family / School entitlements are sold but not implemented**: "Family" confers the same single-seat access as "Solo" (no seat sharing), and there is **no School/classroom billing path** at all (the educator plans link to `/signup` and `/demo`, never to checkout).

---

## 1. Stripe SDK initialization & keys

### Server SDK
- **File:** `src/lib/stripe/server.ts`
- Lazily constructs a singleton `new Stripe(process.env.STRIPE_SECRET_KEY)` via `getStripe()`. Returns `null` when `STRIPE_SECRET_KEY` is absent so routes degrade to `501` instead of throwing at module load (mirrors the liveblocks-auth pattern).
- Marked `import "server-only"`.
- **No `apiVersion` is pinned** — uses the SDK's default version (package `stripe@^22.3.0`). This is a stability risk: behavior can shift on SDK upgrade.

### Client publishable key
- **Not used anywhere.** There is no `@stripe/stripe-js`, no `loadStripe`, no `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and no Stripe Elements/Embedded Checkout.
- The flow is **hosted-redirect only**: the client POSTs to `/api/checkout`, gets back `session.url`, and does `window.location.href = url`. The publishable key is genuinely not needed for this design.

### Env vars consumed
| Var | Where | Purpose | Set in `.env.local`? |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | `src/lib/stripe/server.ts:12` | Server SDK auth | **No** |
| `STRIPE_WEBHOOK_SECRET` | `src/app/api/stripe/webhook/route.ts:25` | Verify webhook signature | **No** |
| `STRIPE_PRICE_{SOLO,FAMILY}_{MONTHLY,ANNUAL}` | `src/lib/stripe/plans.ts:31` (computed) | Override hardcoded price IDs | **No** |
| `NEXT_PUBLIC_SITE_URL` | checkout & portal routes | Build success/cancel/return URLs | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `src/lib/supabase/admin.ts` | Service-role writes (checkout/portal/webhook) | Yes |

**Gap:** `.env.local` contains only `NEXT_PUBLIC_SITE_URL`, Supabase (url/anon/service-role), Resend, Liveblocks. **No Stripe keys at all** → the entire billing surface is dormant locally. There is **no `.env.example`** in the repo to document required Stripe vars.

---

## 2. Stripe price / product IDs referenced in code

All IDs live in **`src/lib/stripe/plans.ts`** (the only file referencing any Stripe price). No product (`prod_…`) IDs appear anywhere in the codebase.

| Tier | Period | ID | Source | Mode |
|---|---|---|---|---|
| solo | monthly | `price_1TnoAKQx4yuHRtovThJ5Kf5I` | hardcoded default | **TEST** |
| solo | annual | `price_1TnoAPQx4yuHRtovPpOWP2qY` | hardcoded default | **TEST** |
| family | monthly | `price_1TnoAWQx4yuHRtovcW4q1OlJ` | hardcoded default | **TEST** |
| family | annual | `price_1TnoAdQx4yuHRtovvHJl9ncx` | hardcoded default | **TEST** |

- Resolution order (`getPriceId`, `plans.ts:30-33`): env override `STRIPE_PRICE_<TIER>_<PERIOD>` → hardcoded `TEST_PRICE_IDS` → `null`.
- The file's own docstring states these are **"TEST-mode prices created in the 'Tome sandbox' Stripe account"** and that live IDs should be supplied via env.
- These test IDs are paired with the **test `STRIPE_SECRET_KEY`** that is currently unset — a live secret key + test price ID (or vice-versa) would fail at Stripe.

**Gap:** No live-mode price IDs and no product IDs exist. Going live requires creating live products/prices and supplying their IDs via `STRIPE_PRICE_*` env (no code change needed for that part — the env override path already exists).

---

## 3. Checkout flow

- **Route:** `src/app/api/checkout/route.ts` (`POST`, `runtime = "nodejs"`).
- **Mechanism:** Stripe **Checkout Session** (`stripe.checkout.sessions.create`), hosted redirect. No Payment Links, no Elements.
- **Mode:** `"subscription"`.
- **Body:** `{ tier: "solo" | "family"; period?: "monthly" | "annual" }` (defaults to monthly).
- **Auth:** requires a signed-in Supabase user (`401` otherwise) so the subscription can be mapped to an account.
- **Customer handling:** reads `profiles.stripe_customer_id`; if absent, `stripe.customers.create({ email, metadata.user_id })` and persists the new id back to `profiles.stripe_customer_id` via the **service-role admin client**.
- **Mapping hooks attached:** `client_reference_id = user.id`, `metadata = {user_id, tier, period}`, and `subscription_data.metadata = {user_id, tier, period}` — so the webhook can resolve the account from either the session or the subscription.
- **Trial:** **Yes — `trial_period_days: 7`** on `subscription_data`.
- **Promo codes:** `allow_promotion_codes: true`.
- **URLs:**
  - success → `${origin}/dashboard?checkout=success&tier=${tier}`
  - cancel → `${origin}/pricing?checkout=cancelled`
  - `origin` = `NEXT_PUBLIC_SITE_URL` ?? request `origin` header ?? `http://localhost:3000`.

### Client triggers
- **`src/components/pricing/CheckoutButton.tsx`** — POSTs to `/api/checkout`, redirects to `data.url`, toasts errors. Used by:
  - `PricingCard` → `PricingGrid` (the `/pricing` page; `isPaidTier(plan.id)` gates which cards get a checkout button).
  - `UpgradeGate` (reader paywall interstitial; `tier=solo period=monthly`).
  - `profile/page.tsx` ("Unlock Tome Solo" card; `tier=solo period=annual`).
- **`src/components/pricing/CheckoutResultToast.tsx`** — mounted on `dashboard/page.tsx`, reads `?checkout=success|cancelled` and toasts, then strips the param.

**Gap:** The marketing CTAs in `src/lib/pricing.ts` (`HREFS.signupSolo = "/signup?tier=solo"`, etc.) route to **signup**, not checkout. The `?tier=` param is **not consumed** anywhere in the signup flow (no matches), so a user who clicks "Start Solo" on a marketing surface is **not** carried into checkout post-signup. Only the `/pricing` grid, the reader `UpgradeGate`, and the profile card actually invoke checkout.

---

## 4. Webhook handler

- **Route:** `src/app/api/stripe/webhook/route.ts` (`POST`, `runtime = "nodejs"`).
- **Signature verification:** **Yes.** Reads `req.text()` (raw body), requires the `stripe-signature` header (`400` if missing), and calls `stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)` (`400` on failure). Returns `501` if `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` is unset.
- **Events handled:**
  - `checkout.session.completed` (re-retrieves the subscription, then upserts)
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - all others → ignored (`200 {received:true}`).
- **DB writes (`upsertSubscription`, service-role admin client):** upserts `public.subscriptions` on conflict `user_id` with:
  `user_id, stripe_customer_id, stripe_subscription_id, tier, status, current_period_end, cancel_at_period_end, updated_at`.
  - **User resolution order:** event hint (`client_reference_id` / `metadata.user_id`) → Stripe customer `metadata.user_id` → existing `subscriptions` row by `stripe_subscription_id`. If unresolved, the event is dropped (no row written).
  - **Tier resolution:** metadata hint → `subscription.items.data[0].price.metadata.tier`.
  - **Period end:** read from `subscription.items.data[0].current_period_end` (the newer item-level location, correct for current Stripe API).

**Gaps / risks:**
- **Does not touch `profiles`** — webhook only writes `subscriptions`. Role (`profiles.role`) is never updated on subscribe (fine for readers, but means no role-based provisioning).
- **Upsert conflict key is `user_id`**, while `stripe_subscription_id` has a separate `UNIQUE` constraint. If a single user ever has two subscription rows (e.g. resubscribe before deletion lands), the upsert could collide on `stripe_subscription_id` instead and error.
- **No event idempotency/dedup store** — relies on upsert being naturally idempotent (true for this payload, but out-of-order `updated`/`deleted` events could momentarily regress state since there's no event-timestamp guard).
- `current_period_end` from a `deleted` event may be stale; `status` becomes `canceled`, which the entitlement gate correctly treats as non-paying.

---

## 5. Entitlement decisions (Free / Solo / Family / School)

### The runtime gate
- **`src/lib/stripe/entitlements.ts`** — pure/client-safe. `Tier = "free" | "solo" | "family"` (no "school" tier exists in code).
  - `FREE_BOOK_IDS` = `getFeaturedBooks()` ids (the free sampler).
  - `canReadBook(tier, role, bookId)`: teachers & students → always true; paid tier (`solo` **or** `family`) → always true; otherwise true only if the book is in the free sampler.
  - File docstring is explicit: **"this is a UX gate, not a hard security boundary"** — `/content/*.json` is publicly fetchable.
- **`src/hooks/use-entitlement.ts`** — **client-side** read. Queries `public.subscriptions` by `user_id`, returns a paid tier only if `status` is `active` or `trialing` **and** `tier` is `solo`/`family`; else `free`. Signed-out/demo → `free`.

### Where the gate is enforced
- **Reader paywall:** `src/app/(app)/read/[bookId]/page.tsx:967` — `if (!entitlementLoading && !canReadBook(tier, role, bookId)) return <UpgradeGate .../>`. This is the **only enforcement point**.
- **Profile page** (`profile/page.tsx:83`) reads `tier` (display only).

### Plan catalog (display)
- `src/lib/pricing.ts` is the single source of marketing copy/prices: reader plans Free/Solo/Family, educator plans Classroom/School/District. These are **display-only**; only `solo`/`family` map to real checkout via `isPaidTier`.

**Gaps:**
- **No "School"/educator billing exists.** Educator plans link to `/signup` (Classroom) and `/demo` (School/District). No Stripe path, no seat/teacher entitlement, no org model.
- **Family ≠ multi-seat.** "Family" is sold as 5 seats (`HOUSEHOLD_SEATS`) but `canReadBook` treats `family` identically to `solo` for a single user. There is **no seat invitation, no household/group membership, no per-seat entitlement** — a Family subscriber simply gets their own single-account access.
- **Entitlement is purely client-side.** No server component, route handler, middleware, or RLS policy enforces tier. Anyone can fetch `/content/<id>.json` directly. API routes (e.g. Virgil) do not check tier.
- **No "isPro"/feature flags** beyond `canReadBook`. Feature differences advertised in the comparison table (unlimited Virgil, advanced Trials, offline, custom lists) are **not enforced** anywhere — they're marketing copy only.

---

## 6. `subscriptions` and `profiles` tables — `stripe_customer_id` duplication

### Schema (migration `supabase/migrations/20260706000000_student_role_and_billing.sql`; applied out-of-band per the migration header)
- **`profiles`** gained `stripe_customer_id text` (nullable). Also widened `profiles_role_check` to `('reader','teacher','student')`.
- **`public.subscriptions`** (new):
  ```
  user_id uuid PRIMARY KEY → auth.users(id) ON DELETE CASCADE
  stripe_customer_id text
  stripe_subscription_id text UNIQUE
  tier text CHECK (tier in ('solo','family'))
  status text
  current_period_end timestamptz
  cancel_at_period_end boolean NOT NULL DEFAULT false
  updated_at timestamptz NOT NULL DEFAULT now()
  ```
- **RLS:** enabled. `subscriptions_select_own` (SELECT to `authenticated WHERE auth.uid() = user_id`). `REVOKE ALL` then `GRANT SELECT` to authenticated — **no client INSERT/UPDATE**; only the service-role webhook writes.

### Every read/write of `stripe_customer_id`

**`profiles.stripe_customer_id`** (the operational source of truth):
- **Read** `src/app/api/checkout/route.ts:63` — look up existing customer.
- **Write** `src/app/api/checkout/route.ts:77` — persist newly-created customer id.
- **Read** `src/app/api/billing/portal/route.ts:35` — resolve customer for the Billing Portal (`404` if null).

**`subscriptions.stripe_customer_id`** (webhook-mirrored, **never read**):
- **Write** `src/app/api/stripe/webhook/route.ts:137` — set on every upsert.
- No code ever reads `subscriptions.stripe_customer_id`. (`useEntitlement` selects only `tier, status`; portal/checkout use the `profiles` copy.)

**Duplication assessment:** The `subscriptions.stripe_customer_id` column is **redundant** — it's written by the webhook but never read; all customer-id reads use `profiles`. Risk: the two can drift (e.g. if a customer is recreated). They are populated by independent code paths (checkout writes `profiles`; webhook writes `subscriptions`), so a checkout that creates a customer and a webhook for a different customer could leave them inconsistent. Recommend designating **one** canonical location (likely `profiles`) and dropping/ignoring the other.

---

## Prioritized gap list — what must change to take real payments

### P0 — Required before any real charge
1. **Configure Stripe env vars** (no code change for keys): set `STRIPE_SECRET_KEY` (live), `STRIPE_WEBHOOK_SECRET`, and `STRIPE_PRICE_{SOLO,FAMILY}_{MONTHLY,ANNUAL}` (live price IDs) in Vercel + local. _You must do this in the Stripe + Vercel dashboards._
2. **Create live products/prices in Stripe** and wire their IDs via the existing `STRIPE_PRICE_*` env override. _Stripe dashboard task._
3. **Register the webhook endpoint** in the Stripe dashboard (`/api/stripe/webhook`) and subscribe to `checkout.session.completed`, `customer.subscription.{created,updated,deleted}`; copy the signing secret into `STRIPE_WEBHOOK_SECRET`. _Stripe dashboard task._
4. **Add `.env.example`** documenting every required var (none exists today) so the deploy is reproducible and secrets aren't guessed.
5. **Pin the Stripe `apiVersion`** in `src/lib/stripe/server.ts` to avoid behavior drift on SDK upgrade.

### P1 — Correctness / integrity
6. **Decide the canonical `stripe_customer_id`** location and remove the duplication (stop writing or stop reading one copy) to prevent drift.
7. **Harden the webhook upsert**: reconcile the `user_id` PK vs `stripe_subscription_id UNIQUE` conflict, and add event ordering/idempotency (e.g. ignore older `updated_at`, or store processed event ids).
8. **Server-side entitlement enforcement**: today the paywall is client-only and content JSON is public. Move premium content behind an authenticated endpoint or add RLS/route checks if the paywall must actually hold.

### P2 — Product completeness (sold but unimplemented)
9. **Family multi-seat**: implement seat invitations / household membership / per-seat entitlement, or stop advertising 5 seats. Currently `family` == `solo` for one account.
10. **Educator/School billing**: there is no checkout path for Classroom/School/District — they go to `/signup` and `/demo`. Build the org/seat billing model or keep it sales-led explicitly.
11. **Carry `?tier=` through signup → checkout**: marketing "Start Solo/Family" CTAs drop the chosen tier (the param is never read). Either consume it post-signup to auto-start checkout, or point those CTAs at the `/pricing` grid.
12. **Enforce advertised feature differences** (unlimited Virgil, advanced Trials, offline, custom lists) — currently only book access is gated; these are marketing-only.

### P3 — Polish
13. Update `profiles.role` or a provisioning hook on subscribe if any role/feature provisioning is intended.
14. Add monitoring/logging for dropped webhook events (currently silently returns without writing when `user_id` can't be resolved).
