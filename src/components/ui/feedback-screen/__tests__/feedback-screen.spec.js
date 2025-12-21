import { test, expect } from "@playwright/test";

test.describe("SplashScreen - sessionStorage behavior", () => {
  test("shows splash on first visit", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();
  });

  test("hides splash after dismissal and stores flag", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();

    await splash.click();
    await expect(splash).not.toBeVisible();

    const flag = await page.evaluate(() => sessionStorage.getItem("showWelcomeSplash"));
    expect(flag).toBe("false");
  });

  test("does not show splash on subsequent visits", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();

    const splash = page.getByTestId("splash-screen");
    await expect(splash).not.toBeVisible();
  });

  test("splash screen displays WAITERAPP branding", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();

    const title = splash.getByTestId("feedback-title");
    await expect(title).toContainText("WAITER");
  });

  test("splash screen displays description", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();

    const description = splash.getByTestId("feedback-description");
    await expect(description).toHaveText("O App do Garçom");
  });

  test("splash screen has fullscreen styling", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();
    await expect(splash).toHaveClass(/fixed/);
    await expect(splash).toHaveClass(/inset-0/);
  });
});
