import { test, expect } from "@playwright/test";

test.describe("SplashScreen Component", () => {
  test("shows splash on first visit", async ({ page }) => {
    await page.goto("/");

    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();
  });

  test("displays WAITERAPP branding", async ({ page }) => {
    await page.goto("/");

    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();

    const title = splash.getByTestId("feedback-title");
    await expect(title).toContainText("WAITER");
  });

  test("displays description text", async ({ page }) => {
    await page.goto("/");

    const splash = page.getByTestId("splash-screen");
    const description = splash.getByTestId("feedback-description");

    await expect(description).toHaveText("O App do Garçom");
  });

  test("hides splash after click and stores flag in sessionStorage", async ({ page }) => {
    await page.goto("/");

    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();

    await splash.click();
    await expect(splash).not.toBeVisible();

    const flag = await page.evaluate(() =>
      sessionStorage.getItem("showWelcomeSplash")
    );
    expect(flag).toBe("false");
  });

  test("does not show splash on subsequent visits", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      sessionStorage.setItem("showWelcomeSplash", "false")
    );
    await page.reload();

    const splash = page.getByTestId("splash-screen");
    await expect(splash).not.toBeVisible();
  });

  test("has fullscreen fixed positioning", async ({ page }) => {
    await page.goto("/");

    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();
    await expect(splash).toHaveClass(/fixed/);
    await expect(splash).toHaveClass(/inset-0/);
  });

  test("uses success variant styling", async ({ page }) => {
    await page.goto("/");

    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();

    const hasSuccessStyle = await splash.evaluate((el) =>
      el.className.includes("bg-primary")
    );
    expect(hasSuccessStyle).toBe(true);
  });
});
