import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright config for Tome's browser regression specs (e2e/).
 *
 * The specs assume a dev server on localhost:3000. `webServer` starts
 * `npm run dev` automatically and REUSES an already-running server, so
 * `npm run test:nav` works whether or not you already have `next dev` up.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
