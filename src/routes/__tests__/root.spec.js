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

    const container = page.locator("main");
    await expect(container).toBeVisible();
  });

  test("main container has correct styling", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();

    const container = page.locator("main");
    await expect(container).toHaveClass(/w-full/);
    await expect(container).toHaveClass(/flex-1/);
    await expect(container).toHaveClass(/overflow-y-auto/);
    await expect(container).toHaveClass(/flex/);
  });

  test("renders outlet content (home page)", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("showWelcomeSplash", "false"));
    await page.reload();

    // Verifica se o conteúdo da página inicial é renderizado
    const pageContent = page.locator("main");
    await expect(pageContent).toBeVisible();
  });
});
