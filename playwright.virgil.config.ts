import { defineConfig, devices } from "@playwright/test"
export default defineConfig({
  testDir: "./e2e",
  testMatch: "virgil-character.spec.ts",
  fullyParallel: false,
  timeout: 90_000,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: process.env.VIRGIL_TEST_URL || "http://localhost:3107", ...devices["Desktop Chrome"] },
})
