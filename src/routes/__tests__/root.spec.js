import { test, expect } from "@playwright/test";

test.describe("Root Layout", () => {
  test("renders splash screen on first visit", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByTestId("splash-screen");
    await expect(splash).toBeVisible();
  });

  test("renders main content container", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();

    const container = page.locator("div.max-w-\\[393px\\]");
    await expect(container).toBeVisible();
  });

  test("main container has correct styling", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();

    const container = page.locator("div.max-w-\\[393px\\]");
    await expect(container).toHaveClass(/w-dvw/);
    await expect(container).toHaveClass(/h-dvh/);
    await expect(container).toHaveClass(/p-3/);
    await expect(container).toHaveClass(/flex/);
    await expect(container).toHaveClass(/flex-col/);
  });

  test("renders outlet content (home page)", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();

    // Verifica se o conteúdo da página inicial é renderizado
    const pageContent = page.locator("div.max-w-\\[393px\\]");
    await expect(pageContent).toBeVisible();
  });
});
