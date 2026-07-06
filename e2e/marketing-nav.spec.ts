import { test, expect } from "@playwright/test"

/**
 * Regression: the marketing top nav must be DETERMINISTIC.
 *
 * The old bug: the nav visibly "switched" after page load — the auth CTA
 * flipped and/or the whole nav remounted as async auth resolved. This spec
 * locks in the fix:
 *   1. the marketing nav is ONE DOM node that is never replaced after load;
 *   2. the auth CTA settles to a single label and never flaps;
 *   3. no console errors while the nav resolves.
 *
 * How it measures: an init script (installed BEFORE any page script runs)
 * watches the DOM from the very first paint and records every distinct CTA
 * label it ever sees plus any time the nav element is swapped for a new node.
 * That captures the resolving -> final transition a post-load query would miss.
 *
 * Prerequisites: dev server on localhost:3000 (webServer config starts/reuses
 * one automatically).
 */

const PROBE = `
window.__navProbe = { ctaLabels: [], navReplacements: 0, firstNav: null };
function navEl() {
  return document.querySelector('nav.fixed') || document.querySelector('nav');
}
function record() {
  const nav = navEl();
  if (!nav) return;
  const p = window.__navProbe;
  if (!p.firstNav) {
    p.firstNav = nav;
  } else if (p.firstNav !== nav) {
    // A different nav element is live AND the original left the document =
    // React unmounted+remounted the nav (the exact regression we forbid).
    if (!p.firstNav.isConnected) {
      p.navReplacements++;
      p.firstNav = nav;
    }
  }
  const pill = nav.querySelector('a[href="/dashboard"]');
  const label = pill ? (pill.textContent || '').trim() : '';
  if (label) {
    const last = p.ctaLabels[p.ctaLabels.length - 1];
    if (label !== last) p.ctaLabels.push(label);
  }
}
const obs = new MutationObserver(record);
function start() {
  obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  record();
}
if (document.body) start();
else document.addEventListener('DOMContentLoaded', start);
`

type NavProbe = {
  ctaLabels: string[]
  navReplacements: number
}

declare global {
  interface Window {
    __navProbe: NavProbe
  }
}

test.describe("Marketing nav determinism", () => {
  test("nav node is stable and the CTA resolves exactly once on /", async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })
    page.on("pageerror", (err) => consoleErrors.push(err.message))

    await page.addInitScript(PROBE)
    await page.goto("/")

    // Grab a handle to the live nav BEFORE we wait. If React ever swaps the
    // node, this handle's element leaves the document (isConnected -> false).
    const navHandle = await page.locator("nav.fixed").elementHandle()
    expect(navHandle).not.toBeNull()

    // Give any late auth resolution the full window to misbehave.
    await page.waitForTimeout(5000)

    const stillConnected = await navHandle!.evaluate((el) => el.isConnected)
    expect(stillConnected, "nav DOM node was replaced after load").toBe(true)

    const probe = await page.evaluate(() => window.__navProbe)

    expect(
      probe.navReplacements,
      "nav element was remounted after load"
    ).toBe(0)

    // The CTA link may appear once (skeleton -> final). It must never CHANGE
    // to a second distinct label = the "switching" we're killing.
    expect(
      probe.ctaLabels.length,
      `CTA label changed more than once: ${JSON.stringify(probe.ctaLabels)}`
    ).toBeLessThanOrEqual(1)

    // The final label is one of the two legitimate resting states.
    const finalPill = page.locator('nav.fixed a[href="/dashboard"]')
    await expect(finalPill).toBeVisible()
    expect(["Use Beta", "Open Tome"]).toContain(
      (await finalPill.textContent())?.trim()
    )

    expect(
      consoleErrors,
      `console errors while nav resolved: ${JSON.stringify(consoleErrors)}`
    ).toHaveLength(0)
  })

  test("the same nav node persists across marketing navigation", async ({
    page,
  }) => {
    await page.goto("/")
    const navHandle = await page.locator("nav.fixed").elementHandle()
    expect(navHandle).not.toBeNull()

    // Client-side navigate via the nav's own links; the shell-mounted nav
    // must persist (same node), not remount per route.
    await page.locator('nav.fixed a[href="/pricing"]').click()
    await expect(page).toHaveURL(/\/pricing$/)
    expect(await navHandle!.evaluate((el) => el.isConnected)).toBe(true)

    await page.locator('nav.fixed a[href="/faq"]').click()
    await expect(page).toHaveURL(/\/faq$/)
    expect(await navHandle!.evaluate((el) => el.isConnected)).toBe(true)

    // Exactly one marketing (fixed) nav on the page throughout.
    expect(await page.locator("nav.fixed").count()).toBe(1)
  })
})
