import { test, expect } from "@playwright/test";
import { disableSplashScreen, loginAsAdmin } from "../../../__tests__/helpers";

test.describe("Logo Component", () => {
  test("renders logo with Waiter and App text", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const logo = page.locator("h1.font-title");
    await expect(logo).toBeVisible();
    await expect(logo).toContainText("Waiter");
    await expect(logo).toContainText("App");
  });

  test("Waiter text has primary color", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const waiterSpan = page.locator("h1.font-title span.text-primary");
    await expect(waiterSpan).toBeVisible();
    await expect(waiterSpan).toHaveText("Waiter");
  });

  test("App text has light font weight", async ({ page }) => {
    await disableSplashScreen(page);
    await page.goto("/");

    const appSpan = page.locator("h1.font-title span.font-extralight");
    await expect(appSpan).toBeVisible();
    await expect(appSpan).toHaveText("App");
  });

  test("logo is hidden when minimized in dashboard", async ({ page }) => {
    await loginAsAdmin(page);

    const logo = page.locator("h1.font-title");
    await expect(logo).toBeVisible();

    const toggleButton = page.getByTestId("toggle-sidebar");
    await toggleButton.click();

    await expect(logo).toBeHidden();
  });
});
