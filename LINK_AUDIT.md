# Link Audit — Tome

_Branch: `fix/reader-pathways-styling` · Audited 2026-06-19_

Goal: find and fix every broken or dead link — nonexistent routes, dynamic
links that resolve to nothing, links to nonexistent records, placeholder/no-op
hrefs, dead external URLs, and broken programmatic navigation.

## Method

1. **Route map** — enumerated the App Router under `src/app/(app)` and
   `src/app/(standalone)`; recorded every real page route + dynamic segment.
2. **Link inventory** — `<Link>` / `href=` / `router.push|replace` / `redirect()`
   across `src`.
3. **Static check** — every literal route href compared against the route map.
4. **Dynamic + data check** — traced templated links (`/read/${id}`,
   `/book/${id}`, `/author/${slug}`) and verified the target data resolves, via
   `scripts/audit-links.ts` (validates against `BOOKS`, `AUTHORS`,
   living-archive, stoa) and a live `tsx` probe of the catalogue.
5. **Runtime check** — booted the dev server (`tome-dev`, port 3000) and
   requested representative URLs (dashboard, library, marketing, ~6 book pages,
   the previously-broken author slugs, nav destinations, and known-bad ids).
6. **Fix** — corrected wrong paths, repaired the resolver mismatch at the data
   layer, replaced placeholder hrefs, flagged ambiguous/external cases.

## Inventory totals

| Kind | Count |
| --- | --- |
| `href=` occurrences | 226 |
| `<Link>` / href / router / redirect-bearing files | 127 |
| `router.push` / `router.replace` | 39 |
| `redirect()` | 12 |
| Books in catalogue | 1,277 |
| Curated authors | 117 |

## Summary by failure type

| Failure type | Found | Fixed | Flagged | Not-a-defect |
| --- | --- | --- | --- | --- |
| Wrong path (route does not exist) | 1 | 1 | 0 | 0 |
| Dynamic link resolves to nothing | 2 | 2 | 0 | 0 |
| Placeholder / no-op href | 1 | 1 | 0 | 0 |
| Dead route in orphaned component | 1 | 0 | 1 | 0 |
| Dead in-page anchor (footer) | 3 | 3 | 0 | 0 |
| External URL (unverifiable) | 1 | 0 | 1 | 0 |
| Curated author unreachable by link slug | 2 | 0 | 2 | 0 |
| Dangling `book.authorId` (data hygiene) | 784 | 0 | 1 | n/a |

After fixes: `scripts/audit-links.ts` reports **0** truly-broken author links,
**0** dangling living-archive slugs, **0** dangling stoa `unlockingBookId`s.

## Detailed findings

| File:line | Link text / target | Failure type | Root cause | Action | Status |
| --- | --- | --- | --- | --- | --- |
| `src/components/timelines/AuthorDropdown.tsx:71` | `/reader/${book.id}` | Wrong path | `/reader/` route does not exist (correct route is `/read/`) | Changed to `/read/${book.id}` | ✅ Fixed |
| `src/data/authors.ts` (`authorSlug`) | `/author/${authorSlug(name)}` (all author links) | Dynamic link resolves to nothing | `authorSlug` dropped diacritics, so accented names (Émile Zola, Molière, Brontë…) produced slugs that matched neither a curated id nor a derivable id → redirect to `/library/browse` | Normalized `authorSlug` (NFD + strip combining marks) to match curated ids; aligned the author page's `deriveAuthorFromBooks` to use the same slugifier | ✅ Fixed (21+ author links) |
| `src/app/(app)/author/[id]/page.tsx:182` | "Works in Tome's Library" book cards | Dynamic link resolves to nothing | Curated branch listed works via `getBooksByAuthor(found.id)` = `b.authorId === id` only; many books carry a mismatched `authorId` (e.g. `his-masterpiece` → `mile-zola`), so curated author pages showed **zero works** | List works by union of `authorId` match **and** `authorSlug(b.author)` match (id/name/fullName) | ✅ Fixed |
| `src/components/ui/avatar-circles.tsx:39` | `+N` overflow avatar (`href=""`) | Placeholder / no-op href | Empty-string anchor rendered a clickable no-op that navigates to the current page | Replaced the empty `<a>` with a non-link `<span>` (keeps `aria-label`) | ✅ Fixed |
| `src/components/landing/HomepageContent.tsx` | footer anchors `/educators#gradebook`, `#curriculum`, `#parent-directory` | Dead in-page anchor | Footer linked to ids that no section rendered | Wrapped the matching teacher demos in `id` + `scroll-mt-20` targets | ✅ Fixed |
| `src/components/social/NotificationBell.tsx:327` | `router.push("/notifications")` | Dead route | No `/notifications` route exists (confirmed 404 at runtime) | **Flagged** — component is **orphaned** (never imported; the live bell is `src/components/tome/notification-bell.tsx`), so the link is unreachable dead code. Did not modify; see "Needs your call". | ⚑ Flagged |
| `src/app/(app)/faq/page.tsx:82` | `https://claude.ai/contact` | External URL (unverifiable) | Cannot verify an external destination from here | **Flagged** for confirmation; see "Needs your call". | ⚑ Flagged |
| `src/data/authors.ts` (`honor-de-balzac`) | `/author/honore-de-balzac` | Curated author unreachable by link slug | Curated id was built with the old accent-dropping logic (missing `e`); links now build `honore-de-balzac`, which resolves to a **derived stub** (functional, 17 works) instead of the curated bio | **Flagged** — rename recommended; see "Needs your call". | ⚑ Flagged |
| `src/data/authors.ts` (`unknown-beowulf`) | `/author/the-beowulf-poet` | Curated author unreachable by link slug | Sentinel id intentionally differs from the name slug | **Flagged** — likely intentional; confirm. | ⚑ Flagged |
| `src/data/books.ts` (784 rows) | book detail "More by this author" | Data hygiene (not a dead link) | 784 books have an `authorId` not present in `AUTHORS` (e.g. `mile-zola`, `niccol-machiavelli`, `anne-bront`). Author **links** are unaffected (built from `authorSlug(name)`), but `book/[id]`'s `getAuthor(b.authorId)` / `getBooksByAuthor(b.authorId)` may under-populate the author blurb & related list | **Flagged** as a follow-up data backfill; not a broken link. | ⚑ Flagged |

## Verified-healthy pathways (no defects)

- **Sidebar / dock nav** (`src/lib/navigation.ts`) — all destinations resolve.
- **Marketing nav + footer** (`src/lib/marketing-nav.ts`) — all route hrefs
  resolve; the previously-dead `/educators#…` anchors now have targets.
- **Middleware redirects** (`middleware.ts`) — only `/dashboard`, `/onboarding`
  (both exist).
- **FAQ category nav** (`src/components/faq/FaqCategoryNav.tsx`) — `#${id}`
  anchors match the section `id={category.id}` targets.
- **Unknown record handling** — `/book/<unknown>` renders "Book not found" + a
  link back to `/library/browse`; `/read/<unknown>` renders "Book not found.";
  `/author/<unknown>` redirects to `/library/browse`. No hard dead-ends.
- **Stoa & living-archive** — `unlockingBookId` and slug links all resolve
  (audit script: 0 dangling).

## Runtime spot-check (dev server, port 3000)

All real routes returned `200`; `/notifications` returned `404` (confirming the
flagged dead route). Previously-broken author slugs now resolve to curated
pages **with their works listed**:

- `/author/emile-zola` → "Émile Zola", 2 works (`/book/germinal`, `/book/his-masterpiece`)
- `/author/moliere` → "Molière", 1 work (`/book/tartuffe`)
- `/author/honore-de-balzac` → "Honoré de Balzac", 17 works (derived stub — see flag)

## Needs your call

1. **`/notifications` dead route** (`social/NotificationBell.tsx:327`). The
   component is orphaned (not imported anywhere). Options: (a) delete the
   orphaned component, (b) leave as-is. I did not delete a feature without your
   sign-off. **Recommend: delete the orphaned `social/NotificationBell.tsx`.**
2. **External link `https://claude.ai/contact`** (`faq/page.tsx:82`). Please
   confirm this is the intended contact destination, or provide the correct URL.
3. **Curated `honor-de-balzac` id** (missing `e`). Links land on a functional
   derived stub, not the curated bio. **Recommend: rename the curated id to
   `honore-de-balzac`** (touches ~35 references across 4 files incl. generated
   data). Held off because it edits generated data files.
4. **`unknown-beowulf` curated id** — appears to be an intentional sentinel for
   an anonymous author; confirm no rename is wanted.
5. **784 dangling `book.authorId`s** — a data backfill to align each
   `book.authorId` with the curated/derived author id would restore the
   book-detail "More by this author" list. Not a broken link; flagging as a
   separate data-hygiene task if you want it pursued.
