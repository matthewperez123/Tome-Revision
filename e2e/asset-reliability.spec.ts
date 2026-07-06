import { test, expect } from "@playwright/test"

/**
 * Regression: asset load/save reliability (today/asset-loadsave-reliability).
 *
 * Prerequisites:
 *   - Dev server running on localhost:3000 (demo mode, no auth needed for
 *     /library/browse — it renders the static local BOOKS catalog).
 *
 * MEDIA-1 (Phase 3): ClassicsCover must never issue a doomed cover-image
 * request. `getBookCoverArt()` and the Monumental Literary Paths asset getter
 * both return undefined now, so every book renders the procedural gradient+motif
 * cover and NO /living-archive/assets/** or /covers/tome/generated/images/**
 * request is ever fired (those files are unshipped and would 404).
 */

test.describe("Asset load reliability — covers", () => {
  test("library covers render procedurally with no failed image requests", async ({
    page,
  }) => {
    const failed: string[] = []

    // A missing cover would surface either as an outright request failure or a
    // 4xx/5xx response for one of the culled asset roots.
    page.on("requestfailed", (req) => {
      const url = req.url()
      if (
        url.includes("/living-archive/assets/") ||
        url.includes("/covers/tome/generated/images/") ||
        url.includes("/covers/covers/museum/")
      ) {
        failed.push(`requestfailed ${url}`)
      }
    })
    page.on("response", (res) => {
      const url = res.url()
      if (
        res.status() >= 400 &&
        (url.includes("/living-archive/assets/") ||
          url.includes("/covers/tome/generated/images/") ||
          url.includes("/covers/covers/museum/"))
      ) {
        failed.push(`${res.status()} ${url}`)
      }
    })

    await page.goto("/library/browse")
    await page.waitForLoadState("networkidle")

    // Procedural covers always render: each ClassicsCover carries data-book-id
    // and an inline gradient background — proof the fallback is the live path.
    const covers = page.locator("[data-book-id]")
    expect(await covers.count()).toBeGreaterThan(0)

    expect(
      failed,
      `Culled cover-asset roots must never be requested:\n${failed.join("\n")}`,
    ).toEqual([])
  })
})
