import { expect, test } from "@playwright/test"

const characterName = "Virgil, Tome’s blue-cloaked scholar holding a scroll"

test("Virgil's character loads on his marketing page and in the home demo", async ({ page }) => {
  for (const path of ["/virgil", "/"]) {
    await page.goto(path)
    const character = page.locator(`svg[aria-label="${characterName}"]`)
    await character.evaluate((el) => el.scrollIntoView({ block: "center" }))
    await expect(character).toBeVisible()
    await expect(character).toHaveAttribute("viewBox", "0 0 512 512")
  }
})

test("Virgil demonstrates each mood and can pause playback", async ({ page }) => {
  await page.goto("/virgil")
  const character = page.getByRole("img", { name: characterName })
  const body = character.locator('[data-part="Virgil"]')
  for (const label of ["Wave", "Think", "Read", "Celebrate", "Idle"]) {
    await page.getByRole("button", { name: label, exact: true }).click()
    await expect(page.getByRole("button", { name: label, exact: true })).toHaveAttribute("aria-pressed", "true")
    await expect(character.locator("..")).toHaveAttribute("data-mood", label.toLowerCase())
    await expect.poll(() => body.evaluate((el) => getComputedStyle(el).animationName)).not.toBe("none")
  }
  await page.getByRole("button", { name: "Pause Virgil animation" }).click()
  await expect.poll(() => body.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("paused")
  await page.getByRole("button", { name: "Play Virgil animation" }).click()
  await expect.poll(() => body.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("running")
})

test("Virgil fits a narrow screen and the hint demo still works with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/virgil")
  await expect(page.getByRole("img", { name: characterName })).toBeVisible()
  await expect.poll(() => page.locator('[data-part="Virgil"]').evaluate((el) => getComputedStyle(el).animationName)).toBe("none")
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole("button", { name: "Ask Virgil for a hint" }).click()
  await expect(page.getByText(/The speaker is a Danish prince/)).toBeVisible()
  await expect(page.getByRole("link", { name: "Start reading with Virgil" })).toHaveAttribute("href", "/signup")
})


test("Virgil pauses offscreen and changes expression with each mood", async ({ page }) => {
  await page.goto("/virgil")
  const character = page.getByRole("img", { name: characterName })
  for (const [label, pose] of [["Wave", "04_Wink"], ["Think", "06_Think"], ["Read", "11_Read"], ["Celebrate", "03_Joy"]]) {
    await page.getByRole("button", { name: label, exact: true }).click()
    await expect(character.locator(`[data-pose="${pose}"]`)).toBeVisible()
  }
  await page.getByRole("button", { name: "Ask Virgil for a hint" }).scrollIntoViewIfNeeded()
  await expect(page.locator("[data-mood]")).toHaveAttribute("data-paused", "true")
  await character.evaluate((el) => el.scrollIntoView({ block: "center" }))
  await expect(page.locator("[data-mood]")).toHaveAttribute("data-paused", "false")
})
