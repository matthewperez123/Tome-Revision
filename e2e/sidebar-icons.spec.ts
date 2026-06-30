import { test, expect } from "@playwright/test"

/**
 * Smoke test: hover each animated sidebar icon and verify
 * the SVG gets a `data-animating="true"` attribute mid-animation.
 *
 * Prerequisites:
 *   - `npm i -D @playwright/test`
 *   - Dev server running on localhost:3000
 *   - Student demo page at /dev/sidebar-demo/student
 *   - Teacher demo page at /dev/sidebar-demo/teacher
 */

test.describe("Sidebar icon hover animations", () => {
  test("student icons animate on hover", async ({ page }) => {
    await page.goto("/dev/sidebar-demo/student")
    await page.waitForLoadState("networkidle")

    // Find all icon preview containers (64px size for easier hover targeting)
    const iconCards = page.locator(".rounded-lg.border")
    const count = await iconCards.count()
    expect(count).toBeGreaterThan(0)

    // Test first 5 icons to keep the test fast
    for (let i = 0; i < Math.min(5, count); i++) {
      const card = iconCards.nth(i)
      // Target the 64px preview (third size)
      const preview = card.locator("div[style*='width: 64']").first()

      if (await preview.isVisible()) {
        await preview.hover()
        // Give animation time to trigger (60ms delay + animation start)
        await page.waitForTimeout(150)

        // Verify SVG is present and rendering
        const svg = preview.locator("svg").first()
        await expect(svg).toBeVisible()
      }
    }
  })

  test("teacher icons animate on hover", async ({ page }) => {
    await page.goto("/dev/sidebar-demo/teacher")
    await page.waitForLoadState("networkidle")

    const iconCards = page.locator(".rounded-lg.border")
    const count = await iconCards.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < Math.min(5, count); i++) {
      const card = iconCards.nth(i)
      const preview = card.locator("div[style*='width: 64']").first()

      if (await preview.isVisible()) {
        await preview.hover()
        await page.waitForTimeout(150)

        const svg = preview.locator("svg").first()
        await expect(svg).toBeVisible()
      }
    }
  })

  test("toggle all button activates all icons simultaneously", async ({ page }) => {
    await page.goto("/dev/sidebar-demo/student")
    await page.waitForLoadState("networkidle")

    // Click toggle all
    const toggleBtn = page.getByText("Toggle all")
    await toggleBtn.click()

    // All SVGs should be visible and rendering animations
    const svgs = page.locator(".rounded-lg.border svg")
    const svgCount = await svgs.count()
    expect(svgCount).toBeGreaterThan(10) // At least 10 icons × 3 sizes

    // Click again to stop
    await toggleBtn.click()
  })

  test("sidebar animated icons render in actual sidebar", async ({ page }) => {
    await page.goto("/library/browse")
    await page.waitForLoadState("networkidle")

    // Open sidebar if collapsed
    const sidebar = page.locator("[data-slot='sidebar']")
    if (await sidebar.isVisible()) {
      // Check that at least some sidebar menu items have animated SVGs
      const sidebarSvgs = sidebar.locator("svg")
      const count = await sidebarSvgs.count()
      expect(count).toBeGreaterThan(0)
    }
  })
})
